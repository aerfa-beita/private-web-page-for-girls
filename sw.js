/* ============================================================
   Service Worker — "我们的宇宙" PWA
   策略：CacheFirst（优先从缓存取，离线可用）
   缓存文件列表在 CACHE_FILES 中定义，可按需增删
   ============================================================ */

// 缓存名称（修改版本号可强制刷新缓存）
const CACHE_NAME = 'our-universe-v21-firebase-config';

// 需要缓存的静态文件列表
const CACHE_FILES = [
    'index.html',
    'firebase-config.js',
    'manifest.json',
    'lion_background.js?v=20',
    'assets/Leo/leo-linework-transparent.png?v=15',
    'image_carousel.js',
    'memory_timeline.js',
    'love_letter.js',
    'star_tree.js',
    'ai_service.js',
    'assets/blessing.mp3',
    'assets/icon-192.png',
    'assets/icon-512.png'
    // 照片文件如果也在 assets 下，按格式添加：
    // 'assets/photo1.jpg',
    // 'assets/photo2.jpg',
];

/* ---- install：预缓存所有静态文件 ---- */
self.addEventListener('install', (event) => {
    console.log('[SW] 安装中…');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] 预缓存文件:', CACHE_FILES);
                return cache.addAll(CACHE_FILES).catch(err => {
                    // 某个文件不存在时不影响整体安装
                    console.warn('[SW] 部分文件缓存失败:', err);
                });
            })
            .then(() => self.skipWaiting())
    );
    self.skipWaiting();
});

/* ---- activate：清理旧版本缓存 ---- */
self.addEventListener('activate', (event) => {
    console.log('[SW] 激活');
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

/* ---- fetch：CacheFirst 策略（缓存优先，网络回退）---- */
self.addEventListener('fetch', (event) => {
    // 只处理 GET 请求
    if (event.request.method !== 'GET') return;

    // 不对 Firebase / OpenWeatherMap API 请求做缓存
    const url = event.request.url;
    if (url.includes('firebaseio.com') ||
        url.includes('firestore.googleapis.com') ||
        url.includes('storage.googleapis.com') ||
        url.includes('openweathermap.org')) {
        return; // 直接走网络
    }

    const requestUrl = new URL(url);
    const isCorePageAsset = requestUrl.origin === self.location.origin &&
        /\.(?:html|js|css)$/.test(requestUrl.pathname);

    // HTML、脚本与样式始终先取最新网络版本，断网时才回退到缓存。
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

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) {
                // 缓存命中，直接返回
                return cached;
            }
            // 缓存未命中，走网络并动态加入缓存
            return fetch(event.request).then(response => {
                // 只缓存成功的响应
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clone);
                });
                return response;
            }).catch(() => {
                // 网络也失败，离线状态下返回一个简单的提示页
                // （仅对 HTML 请求返回，图片等资源静默失败）
                if (event.request.headers.get('accept')?.includes('text/html')) {
                    return new Response(
                        '<html><body style="background:#0a0a1a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><p>📡 当前离线，请连接网络后重试</p></body></html>',
                        { headers: { 'Content-Type': 'text/html' } }
                    );
                }
                return new Response('', { status: 408 });
            });
        })
    );
});
