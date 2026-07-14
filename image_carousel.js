(function(){
    /* =================================================================
       图片轮播模块 — 随机选 3 张，优先未展示过的图片
       ================================================================= */

    // 图片路径列表（来自 assets/Photograph/IMG_20260228/）
    var ALL_IMAGES = [
        'assets/Photograph/IMG_20260228/mmexport1743751159291.jpg',
        'assets/Photograph/IMG_20260228/mmexport1743751535249.jpg',
        'assets/Photograph/IMG_20260228/mmexport1746149751988.jpg',
        'assets/Photograph/IMG_20260228/Screenshot_20250404_152545_com.tencent.mm.jpg',
        'assets/Photograph/IMG_20260228/Screenshot_20250502_093500_com.huawei.himovie.local.jpg',
        'assets/Photograph/IMG_20260228/mmexport1747482750764.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_133732.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_133746.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_133728.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_133748.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_162208.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_133857.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250705_201215.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250705_201239.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_094730.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250705_224634.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250705_231720.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_100100.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_123939.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_123947.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_203015.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_203357.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_203532.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250707_072410.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250706_203528.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250707_162203.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250707_055600.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_172316.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250707_163821.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250707_163824.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250704_172321.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250708_194815.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250708_222305.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250710_163620.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250711_195806.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250711_205020.jpg',
        'assets/Photograph/IMG_20260228/mmexport1754626092562.jpg',
        'assets/Photograph/IMG_20260228/mmexport1754626095415.jpg',
        'assets/Photograph/IMG_20260228/mmexport1754626099506.jpg',
        'assets/Photograph/IMG_20260228/mmexport1754626102323.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250811_191741.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250811_182749.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250826_144739.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250811_184702.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250826_153328.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250826_194549.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_183142.jpg',
        'assets/Photograph/IMG_20260228/IMG_20250829_233503.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_183332.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260123_181528.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_183329.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_183426.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_213724.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_183620.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_213723.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_195559.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_200135.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_221813.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260204_183143.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_195642.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_200504.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_200502.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_200230.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_190213.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260210_200439.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_185522.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_185506.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_144655.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_185551.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_185447.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_190139.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_190144.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260212_104811.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_190201.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260211_190135.jpg',
        'assets/Photograph/IMG_20260228/mmexport1771611774437.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260213_203353.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260223_194704.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260223_164415.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260223_155511.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260223_214357.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_150244.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260223_213643.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_152519.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260223_164433.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_152231.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_153822.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_154231.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_154704.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_153817.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_161800.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_170339.jpg',
        'assets/Photograph/IMG_20260228/IMG_20260228_160837.jpg'
    ];

    var usedIndices = [];    // 已展示过的索引（队列，先进先出）
    var currentGroup = [];   // 当前展示的 3 张
    var autoScrollTimer = null;
    var currentSlideIdx = 0; // 当前滚动到的卡片索引（0/1/2）
    var isHovering = false;

    /* =================================================================
       CSS 注入
       ================================================================= */
    function injectCSS() {
        var style = document.createElement('style');
        style.textContent =
            '#module-image-carousel { text-align: center; }' +
            '.carousel-container {' +
                'position: relative;' +
                'max-width: 1000px;' +
                'margin: 0 auto;' +
                'overflow: hidden;' +
                'border-radius: 16px;' +
                'background: rgba(0,0,0,0.25);' +
            '}' +
            '.carousel-track {' +
                'display: flex;' +
                'transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);' +
                'will-change: transform;' +
            '}' +
            '.carousel-slide {' +
                'min-width: 100%;' +
                'display: flex;' +
                'justify-content: center;' +
                'align-items: center;' +
                'padding: 12px;' +
                'box-sizing: border-box;' +
            '}' +
            '.carousel-slide img {' +
                'width: auto;' +
                'height: auto;' +
                'max-width: 100%;' +
                'max-height: 55vh;' +
                'border-radius: 12px;' +
                'object-fit: contain;' +
                'box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(255,107,157,0.15);' +
                'transition: transform 0.3s ease, box-shadow 0.3s ease;' +
            '}' +
            '.carousel-slide img:hover {' +
                'transform: scale(1.02);' +
                'box-shadow: 0 12px 50px rgba(0,0,0,0.6), 0 0 80px rgba(255,107,157,0.25);' +
            '}' +
            '.carousel-indicators {' +
                'display: flex;' +
                'justify-content: center;' +
                'gap: 10px;' +
                'margin: 16px 0;' +
            '}' +
            '.carousel-dot {' +
                'width: 10px;' +
                'height: 10px;' +
                'border-radius: 50%;' +
                'background: rgba(255,255,255,0.3);' +
                'transition: all 0.3s ease;' +
                'cursor: pointer;' +
            '}' +
            '.carousel-dot.active {' +
                'background: var(--accent, #ff6b9d);' +
                'box-shadow: 0 0 10px rgba(255,107,157,0.6);' +
                'transform: scale(1.3);' +
            '}' +
            '.carousel-nav-btns {' +
                'display: flex;' +
                'justify-content: center;' +
                'align-items: center;' +
                'gap: 16px;' +
                'flex-wrap: wrap;' +
            '}' +
            '.carousel-arrow {' +
                'background: rgba(255,255,255,0.1);' +
                'border: 1px solid rgba(255,255,255,0.2);' +
                'color: #fff;' +
                'width: 40px;' +
                'height: 40px;' +
                'border-radius: 50%;' +
                'cursor: pointer;' +
                'font-size: 18px;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'transition: all 0.3s ease;' +
            '}' +
            '.carousel-arrow:hover {' +
                'background: rgba(255,255,255,0.2);' +
                'box-shadow: 0 0 15px rgba(255,107,157,0.3);' +
            '}' +
            '.carousel-next-btn {' +
                'background: linear-gradient(135deg, #ff6b9d, #c44569);' +
                'color: #fff;' +
                'border: none;' +
                'padding: 12px 32px;' +
                'border-radius: 30px;' +
                'font-size: 16px;' +
                'cursor: pointer;' +
                'transition: all 0.3s ease;' +
                'box-shadow: 0 4px 20px rgba(255,107,157,0.3);' +
                'letter-spacing: 2px;' +
            '}' +
            '.carousel-next-btn:hover {' +
                'transform: translateY(-2px);' +
                'box-shadow: 0 8px 30px rgba(255,107,157,0.5);' +
            '}' +
            '.carousel-next-btn:active {' +
                'transform: scale(0.95);' +
            '}' +
            '.carousel-counter {' +
                'color: var(--text-secondary, #b0b0c0);' +
                'font-size: 13px;' +
                'margin-top: 10px;' +
            '}' +
            '@media (max-width: 600px) {' +
                '.carousel-slide img { max-height: 40vh; }' +
                '.carousel-next-btn { padding: 10px 24px; font-size: 14px; }' +
            '}';
        document.head.appendChild(style);
    }

    /* =================================================================
       核心逻辑
       ================================================================= */

    // Fisher-Yates 洗牌
    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    // 获取下一组 3 张（优先未展示的）
    function getNextGroup(count) {
        count = count || 3;

        // 找到未使用过的索引
        var unseen = [];
        for (var i = 0; i < ALL_IMAGES.length; i++) {
            if (usedIndices.indexOf(i) === -1) {
                unseen.push(i);
            }
        }

        // 如果全部展示过一轮，重置（但打乱顺序避免重复感）
        if (unseen.length < count) {
            usedIndices = [];
            for (var k = 0; k < ALL_IMAGES.length; k++) {
                unseen.push(k);
            }
        }

        // 从未展示中随机选 count 个
        unseen = shuffle(unseen);
        var picked = unseen.slice(0, count);

        // 记录已使用
        for (var j = 0; j < picked.length; j++) {
            usedIndices.push(picked[j]);
        }

        return picked.map(function(idx){ return ALL_IMAGES[idx]; });
    }

    // 渲染轮播
    function renderCarousel(images) {
        var track = document.getElementById('carousel-track');
        var indicators = document.getElementById('carousel-indicators');
        if (!track || !indicators) return;

        currentGroup = images;
        currentSlideIdx = 0;

        // 构建 slide
        var html = '';
        for (var i = 0; i < images.length; i++) {
            html += '<div class="carousel-slide"><img src="' + images[i] + '" alt="照片" loading="lazy"></div>';
        }
        track.innerHTML = html;
        track.style.transform = 'translateX(0)';

        // 构建指示器圆点
        var dotsHtml = '';
        for (var j = 0; j < images.length; j++) {
            dotsHtml += '<span class="carousel-dot' + (j === 0 ? ' active' : '') + '" data-idx="' + j + '"></span>';
        }
        indicators.innerHTML = dotsHtml;

        // 更新计数
        updateCounter();

        // 绑定圆点点击
        var dots = indicators.querySelectorAll('.carousel-dot');
        dots.forEach(function(dot){
            dot.addEventListener('click', function(){
                var idx = parseInt(this.dataset.idx);
                goToSlide(idx);
            });
        });

        // 重启自动轮播
        restartAutoScroll();
    }

    function goToSlide(idx) {
        if (idx < 0 || idx >= currentGroup.length) return;
        currentSlideIdx = idx;
        var track = document.getElementById('carousel-track');
        if (track) {
            track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        }
        // 更新圆点
        var dots = document.querySelectorAll('#carousel-indicators .carousel-dot');
        dots.forEach(function(d, i){
            d.classList.toggle('active', i === idx);
        });
        restartAutoScroll();
    }

    function nextSlide() {
        var next = (currentSlideIdx + 1) % currentGroup.length;
        goToSlide(next);
    }

    function prevSlide() {
        var prev = (currentSlideIdx - 1 + currentGroup.length) % currentGroup.length;
        goToSlide(prev);
    }

    function restartAutoScroll() {
        if (autoScrollTimer) clearInterval(autoScrollTimer);
        autoScrollTimer = setInterval(function(){
            if (!isHovering) nextSlide();
        }, 5000); // 每 5 秒自动翻一张
    }

    function updateCounter() {
        var el = document.getElementById('carousel-counter');
        if (!el) return;
        var shown = usedIndices.length;
        var total = ALL_IMAGES.length;
        el.textContent = '已展示 ' + shown + ' / ' + total + ' 张（全部看完后重新开始）';
    }

    /* =================================================================
       初始化（页面加载后自动绑定事件）
       ================================================================= */
    function initImageCarousel() {
        injectCSS();

        // 查找或创建 UI
        var module = document.getElementById('module-image-carousel');
        if (!module) return;

        // 确保有容器结构
        if (!document.getElementById('carousel-container')) {
            var container = document.createElement('div');
            container.className = 'carousel-container';
            container.id = 'carousel-container';

            // 轮播轨道
            var track = document.createElement('div');
            track.className = 'carousel-track';
            track.id = 'carousel-track';
            container.appendChild(track);

            // 指示器
            var indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            indicators.id = 'carousel-indicators';
            container.appendChild(indicators);

            // 按钮区
            var navBtns = document.createElement('div');
            navBtns.className = 'carousel-nav-btns';
            navBtns.innerHTML =
                '<button class="carousel-arrow" id="carousel-prev" title="上一张">◀</button>' +
                '<button class="carousel-next-btn" id="carousel-next-group">✨ 下一组</button>' +
                '<button class="carousel-arrow" id="carousel-next" title="下一张">▶</button>';
            container.appendChild(navBtns);

            // 计数器
            var counter = document.createElement('p');
            counter.className = 'carousel-counter';
            counter.id = 'carousel-counter';
            container.appendChild(counter);

            module.appendChild(container);

            // 事件绑定
            document.getElementById('carousel-next-group').addEventListener('click', function(){
                var images = getNextGroup(3);
                renderCarousel(images);
            });
            document.getElementById('carousel-prev').addEventListener('click', prevSlide);
            document.getElementById('carousel-next').addEventListener('click', nextSlide);

            // 鼠标悬浮暂停自动轮播
            container.addEventListener('mouseenter', function(){ isHovering = true; });
            container.addEventListener('mouseleave', function(){ isHovering = false; });
            // 触摸暂停
            container.addEventListener('touchstart', function(){ isHovering = true; });
            container.addEventListener('touchend', function(){ isHovering = false; });
        }

        // 初始加载第一组
        if (currentGroup.length === 0) {
            var images = getNextGroup(3);
            renderCarousel(images);
        }
    }

    // 暴露给全局
    window.initImageCarousel = initImageCarousel;
    window.refreshCarousel = function(){
        var images = getNextGroup(3);
        renderCarousel(images);
    };

    // 自动初始化（DOM 就绪后）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageCarousel);
    } else {
        initImageCarousel();
    }
})();
