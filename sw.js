/* ============================================================
   Service Worker — "我们的宇宙" PWA
   策略：核心文件 NetworkFirst（优先网络），静态资源 CacheFirst
   缓存文件列表在 CACHE_FILES 中定义，可按需增删
   ============================================================ */

// 缓存名称（修改版本号可强制刷新所有客户端缓存）
const CACHE_NAME = 'our-universe-v67-cosmic-letter';

// 需要预缓存的静态文件列表
const CACHE_FILES = [
    'index.html',
    'firebase-config.js',
    'manifest.json',
    'scripts/services/runtime-config.js?v=1',
    'lion_background.js?v=5',
    'assets/vendor/three.r128.min.js',
    'scripts/opening/cinematic-opening.js?v=8',
    'scripts/opening/opening-flow.js?v=2',
    'image_carousel.js?v=4',
    'love_letter.js',
    'scripts/ui/presence-heart.js?v=2',
    'scripts/ui/earth-atlas.js?v=12',
    'scripts/ui/stardust-trail.js?v=3',
    'components/cosmic-envelope/envelope.css?v=7',
    'components/cosmic-envelope/envelope.js?v=7',
    'assets/blessing.mp3',
    'assets/icon-192.png',
    'assets/icon-512.png',
    'assets/backgrounds/celestial-atlas-cloud-drift.png?v=2',
    'assets/planets/first-light-v2.png',
    'assets/planets/dream-realm-moon-v4.png',
    'assets/planets/heart-trace-v2.png',
    'assets/planets/eternal-pact-v2.png'
];

/* ---- install：预缓存所有静态文件 ---- */
self.addEventListener('install', (event) => {
    console.log('[SW] 安装中…');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] 预缓存文件:', CACHE_FILES);
                return cache.addAll(CACHE_FILES).catch(err => {
                    console.warn('[SW] 部分文件缓存失败:', err);
                });
            })
            .then(() => self.skipWaiting())
    );
    // G9 修复：不再在 waitUntil 外调用 skipWaiting，避免缓存未就绪就激活
});

/* ---- activate：清理旧版本缓存 ---- */
self.addEventListener('activate', (event) => {
    console.log('[SW] 激活，CACHE_NAME:', CACHE_NAME);
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] 删除旧缓存:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

/* ---- message：页面可通知 SW 立即跳过等待 ---- */
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        console.log('[SW] 收到 SKIP_WAITING，立即激活');
        self.skipWaiting();
    }
});

/* ---- fetch ---- */
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = event.request.url;
    const requestUrl = new URL(url);

    // 不对 Firebase / OpenWeatherMap / 运行配置请求做缓存。
    // /api/config 的环境变量可在不改动代码时更新，不能落入 CacheFirst。
    if (url.includes('firebaseio.com') ||
        url.includes('firestore.googleapis.com') ||
        url.includes('storage.googleapis.com') ||
        url.includes('openweathermap.org') ||
        url.includes('config.js') ||
        (requestUrl.origin === self.location.origin && requestUrl.pathname.startsWith('/api/'))) {
        return; // 直接走网络，不经过 SW
    }

    const isCorePageAsset = requestUrl.origin === self.location.origin &&
        /\.(?:html|js|css)$/.test(requestUrl.pathname);

    // HTML、脚本与样式：NetworkFirst（先取最新网络版本，断网回退缓存）
    if (isCorePageAsset) {
        event.respondWith(
            fetch(event.request).then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    // 其他资源：CacheFirst（缓存优先，网络回退）
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            }).catch(() => {
                if (event.request.headers.get('accept')?.includes('text/html')) {
                    return new Response(
                        '<html><body style="background:#0a0a1a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><p>📡 当前离线，请连接网络后重试</p></body></html>',
                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                    );
                }
                return new Response('', { status: 408 });
            });
        })
    );
});
