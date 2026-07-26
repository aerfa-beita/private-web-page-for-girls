(function() {
    'use strict';

    // 【小花先生改行星文案与位置】
    var GALAXY_PLANETS = [
        { id: 'first-light', cardClass: 'planet-one', asset: 'assets/planets/first-light-v2.png', name: '第一束光', tag: 'UNICA', record: '星辰手记 · ORIGIN', position: { x: 19, y: 48 }, size: 190, message: '在所有晨光之前，\n这一点微亮，\n已经朝向钰涵大人。' },
        { id: 'dream-realm', cardClass: 'planet-two', asset: 'assets/planets/dream-realm-moon-v4.png', name: '梦境之境', tag: 'DREAMORA', record: '星辰手记 · VEIL', position: { x: 43, y: 70 }, size: 220, message: '雾气经过时，\n有一颗小星，\n替我们记得。' },
        { id: 'heart-trace', cardClass: 'planet-three', asset: 'assets/planets/heart-trace-v2.png', name: '心动轨迹', tag: 'HEARTORA', record: '星辰手记 · ORBIT', position: { x: 58, y: 48 }, size: 190, message: '靠近不是喧响，\n是漫长星夜里，\n同频的一次微光。' },
        { id: 'eternal-pact', cardClass: 'planet-four', asset: 'assets/planets/eternal-pact-v2.png', name: '永恒之约', tag: 'AETERNUM', record: '星辰手记 · DISTANT', position: { x: 82, y: 52 }, size: 330, message: '再远的天体，\n也有一束微光，\n留给彼此辨认。' }
    ];

    var galaxyFrame = 0;
    var resizeObserver = null;

    function injectStyles() {
        if (document.getElementById('earth-atlas-styles')) return;
        var style = document.createElement('style');
        style.id = 'earth-atlas-styles';
        style.textContent = [
            '#module-earth-atlas.module-page { width: 100%; max-width: none; min-height: 100svh; margin: 0; padding: 0; overflow: hidden; }',
            '.earth-atlas { position: relative; width: 100%; min-height: 100svh; isolation: isolate; overflow: hidden; color: var(--text-primary, #f8f4ea); background: transparent; }',
            '.earth-atlas::before { content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(180deg, rgba(2,7,18,.12), transparent 38%, rgba(2,7,18,.08)); }',
            '.space { position: absolute; inset: -4%; z-index: 0; width: 108%; height: 108%; pointer-events: none; transform: translate3d(0,0,0) scale(1.03); transition: transform .72s cubic-bezier(.22,.61,.36,1); will-change: transform; }',
            '.galaxy-flow-canvas { display: block; width: 100%; height: 100%; pointer-events: none; }',
            '.earth-atlas-header { position: relative; z-index: 2; width: min(1120px, calc(100% - 48px)); margin: 0 auto; padding: clamp(76px, 11vh, 132px) 0 20px; text-align: center; }',
            '.earth-atlas-kicker { margin: 0 0 16px; color: rgba(242,206,137,.9); font: 11px var(--font-display, serif); letter-spacing: .28em; }',
            '.earth-atlas-title { margin: 0; color: #f8ebcf; font: 500 clamp(38px, 5.5vw, 76px)/1.04 var(--font-display, serif); letter-spacing: .03em; text-shadow: 0 0 32px rgba(222,183,105,.24); }',
            '.earth-atlas-subtitle { max-width: 430px; margin: 18px auto 0; color: rgba(233,239,249,.72); font-size: 14px; line-height: 1.85; letter-spacing: .06em; }',
            '.galaxy-caption { position: absolute; z-index: 2; left: 50%; bottom: clamp(34px, 6vh, 72px); width: min(400px, calc(100% - 48px)); transform: translateX(-50%); color: rgba(239,215,163,.58); text-align: center; font: 11px/1.8 var(--font-display, serif); letter-spacing: .14em; pointer-events: none; }',
            '.planet-card { position: absolute; z-index: 3; left: var(--planet-x); top: var(--planet-y); width: var(--planet-size); height: var(--planet-size); transform: translate(-50%, -50%); }',
            '.earth-atlas .planet { position: absolute; inset: 0; z-index: 3; display: block; width: 100%; height: 100%; padding: 0; overflow: visible; border: 0; border-radius: 0; background: transparent; box-shadow: none; color: transparent; cursor: pointer; opacity: var(--planet-opacity, .84); filter: drop-shadow(0 0 10px var(--planet-atmosphere)); transition: opacity .35s ease, filter .35s ease, transform .35s ease; animation: planetFloat 12s ease-in-out infinite; }',
            '.earth-atlas .planet::before, .earth-atlas .planet::after { content: none; }',
            '.planet-asset { display: block; width: 100%; height: 100%; object-fit: contain; user-select: none; pointer-events: none; filter: var(--planet-asset-filter, none); transition: transform .35s ease; }',
            '.planet-light { position: absolute; inset: -18%; z-index: 1; border-radius: 50%; background: radial-gradient(circle, var(--planet-atmosphere), transparent 68%); opacity: .2; filter: blur(8px); animation: planetHalo 8s ease-in-out infinite; pointer-events: none; }',
            '.planet-nebula, .planet-ring-reflection { display: none; }',
            '.orbit { position: absolute; z-index: 2; top: 50%; left: -20%; width: 140%; height: 27%; border: 1px solid rgba(238,213,165,.34); border-radius: 50%; box-shadow: 0 0 11px rgba(244,210,140,.16); opacity: 0; pointer-events: none; transform: translateY(-50%) rotate(-15deg) scale(.96); transition: opacity .38s ease, transform .38s ease; }',
            '.planet-info { position: absolute; top: calc(100% + 14px); left: 50%; z-index: 4; width: 190px; color: #f6ead4; text-align: center; text-shadow: 0 0 18px rgba(0,0,0,.84); transform: translateX(-50%); pointer-events: none; }',
            '.planet-record { margin: 0 0 6px; color: rgba(229,200,147,.56); font: 9px/1.2 var(--font-display, serif); letter-spacing: .13em; white-space: nowrap; }',
            '.planet-info h2 { margin: 0; color: rgba(255,234,195,.84); font: 400 clamp(15px, 1.25vw, 20px)/1.2 var(--font-display, serif); letter-spacing: .14em; white-space: nowrap; }',
            '.planet-info span { display: block; margin-top: 5px; color: rgba(226,204,165,.58); font: italic 10px Georgia, serif; letter-spacing: .19em; }',
            '.planet-info p { max-height: 0; margin: 0 auto; overflow: hidden; color: rgba(244,242,235,.75); font-size: 11px; line-height: 1.9; letter-spacing: .08em; opacity: 0; transition: max-height .42s ease, margin .42s ease, opacity .32s ease; white-space: pre-line; }',
            '.planet-card:hover .planet, .planet-card:focus-within .planet, .planet-card.is-active .planet { opacity: 1; filter: drop-shadow(0 0 17px var(--planet-atmosphere)); }',
            '.planet-card:hover .planet-asset, .planet-card:focus-within .planet-asset, .planet-card.is-active .planet-asset { transform: scale(1.035); }',
            '.planet-card.is-active .orbit { opacity: .65; transform: translateY(-50%) rotate(-15deg) scale(1); }',
            '.planet-card.is-active .planet-info p { max-height: 88px; margin-top: 12px; opacity: 1; }',
            '.planet-one { --planet-atmosphere:rgba(224,177,100,.28); --planet-opacity:.88; }',
            '.planet-one .planet { transform-origin: 50% 50%; }',
            '.planet-one .planet-info { top: calc(100% + 16px); left: -11px; text-align: left; transform: none; }',
            '.planet-two { --planet-atmosphere:rgba(173,133,214,.16); --planet-opacity:.78; --planet-asset-filter:saturate(.82) contrast(1.05); }',
            '.planet-two .planet-nebula { display: block; position: absolute; inset: -21%; z-index: 0; border-radius: 46% 54% 63% 37% / 41% 44% 56% 59%; opacity: .5; background: radial-gradient(ellipse at 33% 42%, rgba(211,169,234,.34), transparent 18%), radial-gradient(ellipse at 69% 55%, rgba(112,77,170,.3), transparent 38%), radial-gradient(ellipse at 45% 71%, rgba(151,103,196,.19), transparent 43%); filter: blur(20px); pointer-events: none; transform: rotate(-16deg); }',
            '.planet-two .planet-light { inset: -28%; opacity: .18; background: radial-gradient(ellipse, rgba(170,126,214,.2), transparent 67%); filter: blur(18px); }',
            '.planet-two .planet-info { top: calc(100% + 20px); left: 22px; text-align: left; transform: none; }',
            '.planet-three { --planet-atmosphere:rgba(232,193,144,.22); --planet-opacity:.86; }',
            '.planet-three .planet-info { top: calc(100% + 16px); left: 27px; text-align: left; transform: none; }',
            '.planet-four { --planet-atmosphere:rgba(205,190,156,.2); --planet-opacity:.82; }',
            '.planet-four .orbit { width: 148%; left: -24%; height: 22%; }',
            '.planet-four .planet-info { top: calc(100% + 16px); left: 56%; text-align: left; transform: none; }',
            '.earth-drawer-trigger { position: fixed; top: 50%; left: 18px; z-index: 130; display: inline-flex; align-items: center; gap: 9px; padding: 10px 12px 10px 9px; border: 1px solid rgba(216,179,106,.56); background: rgba(11,14,27,.76); color: #f5dfad; box-shadow: 0 12px 34px rgba(0,0,0,.28); cursor: pointer; transform: translateY(-50%); font: 11px var(--font-display, sans-serif); letter-spacing: .14em; visibility: hidden; opacity: 0; pointer-events: none; transition: opacity .3s ease; }',
            '.earth-drawer-trigger i { display: grid; gap: 3px; width: 16px; }',
            '.earth-drawer-trigger i::before, .earth-drawer-trigger i::after, .earth-drawer-trigger i { border-top: 1px solid currentColor; }',
            '.earth-drawer { position: fixed; top: 0; bottom: 0; left: 0; z-index: 140; width: min(300px, calc(100vw - 48px)); padding: 38px 24px; background: rgba(8,11,23,.96); border-right: 1px solid rgba(216,179,106,.28); box-shadow: 24px 0 70px rgba(0,0,0,.34); transform: translateX(-105%); transition: transform .48s cubic-bezier(.22,.61,.36,1); visibility: hidden; pointer-events: none; }',
            '#app-main.active ~ .earth-drawer-trigger { visibility: visible; opacity: 1; pointer-events: auto; }',
            '#app-main.active ~ .earth-drawer { visibility: visible; }',
            '.earth-drawer.is-open { transform: translateX(0); pointer-events: auto; }',
            '.earth-drawer-title { margin: 0 0 34px; color: #f7f2e9; font: 26px var(--font-display, serif); font-weight: 500; }',
            '.earth-drawer-note { margin: -24px 0 26px; color: var(--text-secondary, #b9b4c4); font-size: 12px; line-height: 1.7; }',
            '.earth-drawer-tab { display: flex; align-items: baseline; gap: 14px; width: 100%; padding: 15px 0; border: 0; border-bottom: 1px solid rgba(255,255,255,.1); color: rgba(244,239,230,.68); background: transparent; cursor: pointer; text-align: left; transition: color .25s ease, padding-left .25s ease; }',
            '.earth-drawer-tab span { color: var(--gold, #d8b36a); font: 10px var(--font-display, sans-serif); letter-spacing: .12em; }',
            '.earth-drawer-tab strong { font: 18px var(--font-display, serif); font-weight: 500; }',
            '.earth-drawer-tab:hover, .earth-drawer-tab.is-active { padding-left: 8px; color: #f8df9f; }',
            '.earth-drawer-close { position: absolute; top: 18px; right: 18px; border: 0; color: #d8b36a; background: transparent; font-size: 20px; cursor: pointer; }',
            '@keyframes planetFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }',
            '@keyframes planetHalo { 0%,100% { opacity: .7; transform: scale(1); } 50% { opacity: .42; transform: scale(1.08); } }',
            '@media (max-width: 700px) { .earth-atlas-header { width: min(100% - 34px, 1120px); padding-top: 82px; } .earth-atlas-title { font-size: clamp(36px, 11vw, 54px); } .earth-atlas-subtitle { font-size: 13px; } .galaxy-caption { bottom: 34px; font-size: 11px; } .planet-card { transform: translate(-50%, -50%) scale(.76); } .planet-info { width: 146px; } .planet-info h2 { font-size: 14px; } .planet-info span { font-size: 10px; } .planet-info p { font-size: 10px; } .planet-record { font-size: 8px; } .planet-four .planet-info { left: 44%; } .earth-drawer-trigger { left: 10px; } }',
            '@media (prefers-reduced-motion: reduce) { .planet, .planet-light { animation: none; } }'
        ].join('');
        document.head.appendChild(style);
    }

    function syncDrawerActiveState() {
        var activePage = document.querySelector('.module-page.active');
        var activeModule = activePage ? activePage.id.replace('module-', '') : 'earth-atlas';
        document.querySelectorAll('.earth-drawer-tab').forEach(function(tab) {
            tab.classList.toggle('is-active', tab.dataset.module === activeModule);
        });
    }

    function createDrawer() {
        if (document.getElementById('earth-drawer')) return;

        var drawer = document.createElement('aside');
        drawer.className = 'earth-drawer';
        drawer.id = 'earth-drawer';
        drawer.setAttribute('aria-label', '页面导航');
        drawer.innerHTML =
            '<button class="earth-drawer-close" type="button" aria-label="关闭导航">×</button>' +
            '<h2 class="earth-drawer-title">我们的宇宙</h2>' +
            '<p class="earth-drawer-note">从星河出发，慢慢走进每一段回忆。</p>' +
            '<button class="earth-drawer-tab is-active" type="button" data-module="earth-atlas"><span>01</span><strong>星河</strong></button>' +
            '<button class="earth-drawer-tab" type="button" data-module="time-machine"><span>02</span><strong>回忆</strong></button>' +
            '<button class="earth-drawer-tab" type="button" data-module="secret-base"><span>03</span><strong>此刻</strong></button>';

        var archiveTab = document.createElement('button');
        archiveTab.className = 'earth-drawer-tab';
        archiveTab.type = 'button';
        archiveTab.dataset.module = 'memory-archive';
        archiveTab.innerHTML = '<span>04</span><strong>档案</strong>';
        drawer.appendChild(archiveTab);

        var trigger = document.createElement('button');
        trigger.className = 'earth-drawer-trigger';
        trigger.type = 'button';
        trigger.setAttribute('aria-controls', 'earth-drawer');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.innerHTML = '<i aria-hidden="true"></i>地图';

        function closeDrawer() {
            drawer.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('click', function() {
            var isOpen = drawer.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) syncDrawerActiveState();
        });
        drawer.querySelector('.earth-drawer-close').addEventListener('click', closeDrawer);
        drawer.querySelectorAll('.earth-drawer-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                if (typeof window.switchModule === 'function') window.switchModule(tab.dataset.module);
                closeDrawer();
                syncDrawerActiveState();
            });
        });
        document.body.append(drawer, trigger);
    }

    function buildStars(width, height) {
        var starCount = window.matchMedia('(max-width: 700px)').matches ? 220 : 450;
        var stars = [];

        for (var index = 0; index < starCount; index += 1) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.8,
                speed: Math.random() * 0.15 + 0.05,
                alpha: Math.random()
            });
        }
        return stars;
    }

    function buildGalaxyDust(width, height) {
        var dustCount = window.matchMedia('(max-width: 700px)').matches ? 360 : 960;
        var dust = [];
        var colors = ['255,248,225', '244,210,140', '224,235,248'];

        for (var index = 0; index < dustCount; index += 1) {
            var progress = Math.random();
            var centerY = height * (0.54 + Math.sin(progress * Math.PI * 2.2) * 0.058);
            var edgeWeight = 0.025 + Math.sin(progress * Math.PI) * 0.115;
            var offset = (Math.random() + Math.random() + Math.random() - 1.5) * height * edgeWeight;
            dust.push({
                x: progress * width,
                y: centerY + offset,
                size: 0.25 + Math.random() * 1.42,
                speed: 0.012 + Math.random() * 0.034,
                alpha: 0.1 + Math.random() * 0.68,
                phase: Math.random() * Math.PI * 2,
                color: colors[index % colors.length]
            });
        }
        return dust;
    }

    function initGalaxyCanvas(root, module) {
        var space = root.querySelector('.space');
        var canvas = root.querySelector('#stars');
        var context = canvas.getContext('2d', { alpha: true });
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        var stars = [];
        var galaxyDust = [];
        var bursts = [];
        var width = 0;
        var height = 0;
        var pixelRatio = 1;

        function canRender() {
            var appMain = document.getElementById('app-main');
            return !reducedMotion.matches && module.classList.contains('active') && appMain && appMain.classList.contains('active') && document.visibilityState === 'visible';
        }

        function resizeCanvas() {
            var rect = space.getBoundingClientRect();
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.max(1, Math.round(rect.width));
            height = Math.max(1, Math.round(rect.height));
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            stars = buildStars(width, height);
            galaxyDust = buildGalaxyDust(width, height);
        }

        function drawGalaxyDust(now) {
            var bandY = height * 0.54;
            var haze = context.createLinearGradient(0, bandY - height * 0.18, 0, bandY + height * 0.18);
            haze.addColorStop(0, 'rgba(255,240,205,0)');
            haze.addColorStop(0.5, 'rgba(244,219,166,.055)');
            haze.addColorStop(1, 'rgba(255,240,205,0)');
            context.fillStyle = haze;
            context.fillRect(0, bandY - height * 0.2, width, height * 0.4);
            context.globalCompositeOperation = 'lighter';

            galaxyDust.forEach(function(dust) {
                dust.x += dust.speed;
                if (dust.x > width + 16) dust.x = -16;
                var shimmer = 0.62 + Math.sin(now * 0.0011 + dust.phase) * 0.38;
                context.beginPath();
                context.fillStyle = 'rgba(' + dust.color + ',' + (dust.alpha * shimmer) + ')';
                context.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
                context.fill();
            });
            context.globalCompositeOperation = 'source-over';
        }

        function drawStars(now) {
            context.clearRect(0, 0, width, height);
            drawGalaxyDust(now);
            stars.forEach(function(star) {
                star.y -= star.speed;
                if (star.y < 0) star.y = height;

                context.beginPath();
                context.fillStyle = 'rgba(255,255,255,' + star.alpha + ')';
                context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                context.fill();
            });

            for (var index = bursts.length - 1; index >= 0; index -= 1) {
                var burst = bursts[index];
                var progress = (now - burst.bornAt) / burst.life;
                if (progress >= 1) {
                    bursts.splice(index, 1);
                    continue;
                }
                burst.x += burst.vx * 16;
                burst.y += burst.vy * 16;
                burst.vx *= 0.983;
                burst.vy = burst.vy * 0.983 + 0.0007;
                context.beginPath();
                context.fillStyle = 'rgba(' + burst.color + ',' + Math.pow(1 - progress, 1.35) + ')';
                context.arc(burst.x, burst.y, burst.size, 0, Math.PI * 2);
                context.fill();
            }
        }

        function render(now) {
            galaxyFrame = 0;
            if (!canRender()) return;
            drawStars(now);
            galaxyFrame = requestAnimationFrame(render);
        }

        function ensureAnimation() {
            var rect = space.getBoundingClientRect();
            if (Math.round(rect.width) !== width || Math.round(rect.height) !== height) resizeCanvas();
            if (reducedMotion.matches) {
                drawStars(performance.now());
                return;
            }
            if (!galaxyFrame && canRender()) galaxyFrame = requestAnimationFrame(render);
        }

        function explode(x, y, colors) {
            for (var index = 0; index < 52; index += 1) {
                var angle = Math.random() * Math.PI * 2;
                var speed = 0.04 + Math.random() * 0.16;
                bursts.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 0.45 + Math.random() * 1.9,
                    color: colors[index % colors.length],
                    bornAt: performance.now(),
                    life: 680 + Math.random() * 620
                });
            }
            ensureAnimation();
        }

        function explodeAtViewport(x, y, colors) {
            var canvasRect = canvas.getBoundingClientRect();
            if (!canvasRect.width || !canvasRect.height) return;
            explode(
                (x - canvasRect.left) * (width / canvasRect.width),
                (y - canvasRect.top) * (height / canvasRect.height),
                colors
            );
        }

        function moveSpace(event) {
            if (!canRender() || event.pointerType && event.pointerType !== 'mouse') return;
            var offsetX = (event.clientX / window.innerWidth - 0.5) * 20;
            var offsetY = (event.clientY / window.innerHeight - 0.5) * 20;
            space.style.transform = 'translate3d(' + offsetX.toFixed(2) + 'px,' + offsetY.toFixed(2) + 'px,0) scale(1.03)';
        }

        function resetSpace() {
            space.style.transform = 'translate3d(0,0,0) scale(1.03)';
        }

        resizeCanvas();
        window.addEventListener('resize', ensureAnimation, { passive: true });
        window.addEventListener('pointermove', moveSpace, { passive: true });
        root.addEventListener('pointerleave', resetSpace, { passive: true });
        window.addEventListener('mainExperienceEntered', ensureAnimation);
        document.addEventListener('visibilitychange', ensureAnimation);
        reducedMotion.addEventListener('change', function() {
            if (galaxyFrame) cancelAnimationFrame(galaxyFrame);
            galaxyFrame = 0;
            resetSpace();
            ensureAnimation();
        });
        var observer = new MutationObserver(ensureAnimation);
        observer.observe(module, { attributes: true, attributeFilter: ['class'] });
        resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(ensureAnimation) : null;
        if (resizeObserver) resizeObserver.observe(space);

        return { ensureAnimation: ensureAnimation, explodeAtViewport: explodeAtViewport };
    }

    function initEarthAtlas() {
        var module = document.getElementById('module-earth-atlas');
        if (!module || module.dataset.ready === 'true') return;
        module.dataset.ready = 'true';
        injectStyles();
        module.innerHTML =
            '<main class="earth-atlas" id="earth-atlas-root">' +
                '<div class="space" aria-hidden="true"><canvas class="galaxy-flow-canvas" id="stars"></canvas></div>' +
                '<header class="earth-atlas-header">' +
                    '<p class="earth-atlas-kicker">A GALAXY MADE OF US</p>' +
                    '<h1 class="earth-atlas-title">把每一次靠近<br>留在星河里</h1>' +
                    '<p class="earth-atlas-subtitle">一条星河缓慢经过，藏着几颗只属于我们的行星。</p>' +
                '</header>' +
                GALAXY_PLANETS.map(function(planet) {
                    return '<article class="planet-card ' + planet.cardClass + '" data-planet="' + planet.id + '" style="--planet-x:' + planet.position.x + '%;--planet-y:' + planet.position.y + '%;--planet-size:' + planet.size + 'px;">' +
                        '<span class="planet-nebula" aria-hidden="true"></span>' +
                        '<span class="planet-light" aria-hidden="true"></span>' +
                        '<span class="planet-ring-reflection" aria-hidden="true"></span>' +
                        '<span class="orbit" aria-hidden="true"></span>' +
                        '<button class="planet" type="button" aria-label="点亮' + planet.name + '" aria-expanded="false"><img class="planet-asset" src="' + planet.asset + '" alt="" draggable="false"></button>' +
                        '<div class="planet-info"><div class="planet-record">' + planet.record + '</div><h2>' + planet.name + '</h2><span>' + planet.tag + '</span><p>' + planet.message + '</p></div>' +
                    '</article>';
                }).join('') +
                '<p class="galaxy-caption">此刻，星河正缓慢经过我们</p>' +
            '</main>';

        var root = module.querySelector('#earth-atlas-root');
        var galaxy = initGalaxyCanvas(root, module);
        var planetCards = root.querySelectorAll('.planet-card');

        planetCards.forEach(function(card) {
            var button = card.querySelector('.planet');
            button.addEventListener('click', function() {
                var planet = GALAXY_PLANETS.find(function(item) { return item.id === card.dataset.planet; });
                if (!planet) return;
                var planetRect = button.getBoundingClientRect();
                planetCards.forEach(function(otherCard) {
                    var isSelected = otherCard === card;
                    otherCard.classList.toggle('is-active', isSelected);
                    otherCard.querySelector('.planet').setAttribute('aria-expanded', String(isSelected));
                });
                galaxy.explodeAtViewport(
                    planetRect.left + planetRect.width / 2,
                    planetRect.top + planetRect.height / 2,
                    ['255,248,225', '244,210,140', '224,235,248']
                );
            });
        });
        createDrawer();
        galaxy.ensureAnimation();
    }

    window.initEarthAtlas = initEarthAtlas;
    window.addEventListener('beforeunload', function() {
        if (galaxyFrame) cancelAnimationFrame(galaxyFrame);
        if (resizeObserver) resizeObserver.disconnect();
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initEarthAtlas, { once: true });
    else initEarthAtlas();
})();
