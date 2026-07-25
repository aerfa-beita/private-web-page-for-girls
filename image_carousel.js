(function(){
    /* =================================================================
       图片轮播模块 — 随机选 3 张，优先未展示过的图片
       ================================================================= */

    // 图片路径列表（来自 assets/Photograph/IMG_20260228/）

    var usedIndices = [];    // 已展示过的索引（队列，先进先出）
    var currentGroup = [];   // 当前展示的 3 张
    var autoScrollTimer = null;
    var currentSlideIdx = 0; // 当前滚动到的卡片索引（0/1/2）
    var isHovering = false;
    var isInitialized = false;
    var cssInjected = false;
    var archiveImages = [];
    // 完整回忆档案首先由 Vercel 静态文件提供。Firebase 仅保留给以后新增或投稿照片，
    // 因而网络、规则或 SDK 异常都不会让既有 93 张回忆消失。
    var STATIC_ARCHIVE_FILES = [
        'IMG_20250704_133728.jpg',
        'IMG_20250704_133732.jpg',
        'IMG_20250704_133746.jpg',
        'IMG_20250704_133748.jpg',
        'IMG_20250704_133857.jpg',
        'IMG_20250704_162208.jpg',
        'IMG_20250704_172316.jpg',
        'IMG_20250704_172321.jpg',
        'IMG_20250705_201215.jpg',
        'IMG_20250705_201239.jpg',
        'IMG_20250705_224634.jpg',
        'IMG_20250705_231720.jpg',
        'IMG_20250706_094730.jpg',
        'IMG_20250706_100100.jpg',
        'IMG_20250706_123939.jpg',
        'IMG_20250706_123947.jpg',
        'IMG_20250706_203015.jpg',
        'IMG_20250706_203357.jpg',
        'IMG_20250706_203528.jpg',
        'IMG_20250706_203532.jpg',
        'IMG_20250707_055600.jpg',
        'IMG_20250707_072410.jpg',
        'IMG_20250707_162203.jpg',
        'IMG_20250707_163821.jpg',
        'IMG_20250707_163824.jpg',
        'IMG_20250708_194815.jpg',
        'IMG_20250708_222305.jpg',
        'IMG_20250710_163620.jpg',
        'IMG_20250711_195806.jpg',
        'IMG_20250711_205020.jpg',
        'IMG_20250811_182749.jpg',
        'IMG_20250811_184702.jpg',
        'IMG_20250811_191741.jpg',
        'IMG_20250826_144739.jpg',
        'IMG_20250826_153328.jpg',
        'IMG_20250826_194549.jpg',
        'IMG_20250829_233503.jpg',
        'IMG_20260123_181528.jpg',
        'IMG_20260204_183142.jpg',
        'IMG_20260204_183143.jpg',
        'IMG_20260204_183329.jpg',
        'IMG_20260204_183332.jpg',
        'IMG_20260204_183426.jpg',
        'IMG_20260204_183620.jpg',
        'IMG_20260204_213723.jpg',
        'IMG_20260204_213724.jpg',
        'IMG_20260204_221813.jpg',
        'IMG_20260210_190213.jpg',
        'IMG_20260210_195559.jpg',
        'IMG_20260210_195642.jpg',
        'IMG_20260210_200135.jpg',
        'IMG_20260210_200230.jpg',
        'IMG_20260210_200439.jpg',
        'IMG_20260210_200502.jpg',
        'IMG_20260210_200504.jpg',
        'IMG_20260211_144655.jpg',
        'IMG_20260211_185447.jpg',
        'IMG_20260211_185506.jpg',
        'IMG_20260211_185522.jpg',
        'IMG_20260211_185551.jpg',
        'IMG_20260211_190135.jpg',
        'IMG_20260211_190139.jpg',
        'IMG_20260211_190144.jpg',
        'IMG_20260211_190201.jpg',
        'IMG_20260212_104811.jpg',
        'IMG_20260213_203353.jpg',
        'IMG_20260223_155511.jpg',
        'IMG_20260223_164415.jpg',
        'IMG_20260223_164433.jpg',
        'IMG_20260223_194704.jpg',
        'IMG_20260223_213643.jpg',
        'IMG_20260223_214357.jpg',
        'IMG_20260228_150244.jpg',
        'IMG_20260228_152231.jpg',
        'IMG_20260228_152519.jpg',
        'IMG_20260228_153817.jpg',
        'IMG_20260228_153822.jpg',
        'IMG_20260228_154231.jpg',
        'IMG_20260228_154704.jpg',
        'IMG_20260228_160837.jpg',
        'IMG_20260228_161800.jpg',
        'IMG_20260228_170339.jpg',
        'mmexport1743751159291.jpg',
        'mmexport1743751535249.jpg',
        'mmexport1746149751988.jpg',
        'mmexport1747482750764.jpg',
        'mmexport1754626092562.jpg',
        'mmexport1754626095415.jpg',
        'mmexport1754626099506.jpg',
        'mmexport1754626102323.jpg',
        'mmexport1771611774437.jpg',
        'Screenshot_20250404_152545_com.tencent.mm.jpg',
        'Screenshot_20250502_093500_com.huawei.himovie.local.jpg'
    ];
    var approvedImages = [];
    var archivePhotoUnsubscribe = null;
    var carouselPhotoUnsubscribe = null;
    var carouselServicesPromise = null;
    var selectedUpload = null;
    var uploadInProgress = false;

    var MAX_ORIGINAL_IMAGE_BYTES = 15 * 1024 * 1024;
    var MAX_COMPRESSED_IMAGE_BYTES = 1024 * 1024;
    var MAX_IMAGE_DIMENSION = 1920;
    var DAILY_UPLOAD_LIMIT = 5;

    /* =================================================================
       CSS 注入
       ================================================================= */
    function injectCSS() {
        if (cssInjected || document.getElementById('image-carousel-styles')) {
            cssInjected = true;
            return;
        }
        var style = document.createElement('style');
        style.id = 'image-carousel-styles';
        style.textContent =
            '#memory-archive { text-align: center; }' +
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
            '.carousel-upload-panel {' +
                'max-width: 720px;' +
                'margin: 28px auto 0;' +
                'padding: 18px;' +
                'border: 1px solid rgba(216,179,106,0.35);' +
                'border-radius: 16px;' +
                'background: rgba(10,8,24,0.48);' +
                'text-align: left;' +
            '}' +
            '.carousel-upload-title {' +
                'margin: 0 0 6px;' +
                'color: #f6ddaa;' +
                'font-size: 16px;' +
            '}' +
            '.carousel-upload-note, .carousel-upload-state {' +
                'margin: 0 0 12px;' +
                'color: var(--text-secondary, #c5bfd1);' +
                'font-size: 13px;' +
                'line-height: 1.7;' +
            '}' +
            '.carousel-upload-state.is-error { color: #ff9eae; }' +
            '.carousel-upload-actions {' +
                'display: flex;' +
                'align-items: center;' +
                'gap: 10px;' +
                'flex-wrap: wrap;' +
            '}' +
            '.carousel-upload-button, .carousel-upload-submit, .carousel-upload-cancel {' +
                'border: 0;' +
                'border-radius: 999px;' +
                'padding: 10px 16px;' +
                'font-size: 14px;' +
                'cursor: pointer;' +
            '}' +
            '.carousel-upload-button, .carousel-upload-submit {' +
                'background: linear-gradient(135deg, #d8b36a, #9c7440);' +
                'color: #1b1220;' +
                'font-weight: 700;' +
            '}' +
            '.carousel-upload-cancel {' +
                'background: rgba(255,255,255,0.1);' +
                'color: #f4efff;' +
            '}' +
            '.carousel-upload-button:disabled, .carousel-upload-submit:disabled, .carousel-upload-cancel:disabled {' +
                'opacity: 1;' +
                'cursor: not-allowed;' +
            '}' +
            '.carousel-upload-preview {' +
                'display: none;' +
                'align-items: center;' +
                'gap: 12px;' +
                'margin-top: 14px;' +
            '}' +
            '.carousel-upload-preview.is-visible { display: flex; }' +
            '.carousel-upload-preview img {' +
                'width: 72px;' +
                'height: 72px;' +
                'border-radius: 10px;' +
                'object-fit: cover;' +
                'border: 1px solid rgba(255,255,255,0.2);' +
            '}' +
            '.carousel-upload-preview-copy {' +
                'color: #eee9f6;' +
                'font-size: 13px;' +
                'line-height: 1.6;' +
            '}' +
            '@media (max-width: 600px) {' +
                '.carousel-slide img { max-height: 40vh; }' +
                '.carousel-next-btn { padding: 10px 24px; font-size: 14px; }' +
                '.carousel-upload-preview { align-items: flex-start; }' +
            '}';
        document.head.appendChild(style);
        cssInjected = true;
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

    function getFallbackImages() {
        var configuredPhotos = Array.isArray(window.UNIVERSE_PHOTOS) ? window.UNIVERSE_PHOTOS : [];
        return configuredPhotos.map(function(photo) {
            return photo && typeof photo.url === 'string' ? photo.url : null;
        }).filter(Boolean);
    }

    function getStaticArchiveImages() {
        return STATIC_ARCHIVE_FILES.map(function(fileName) {
            return 'assets/Photograph/IMG_20260228/' + fileName;
        });
    }

    function getArchiveImages() {
        var staticImages = getStaticArchiveImages();
        return staticImages.length ? staticImages : (archiveImages.length ? archiveImages : getFallbackImages());
    }

    function getAllImages() {
        return getArchiveImages().concat(approvedImages).filter(function(url, index, list) {
            return list.indexOf(url) === index;
        });
    }

    // 获取下一组 3 张（优先未展示的）
    function getNextGroup(count) {
        count = count || 3;
        var imagePool = getAllImages();
        if (imagePool.length === 0) return [];
        count = Math.min(count, imagePool.length);

        // 找到未使用过的索引
        var unseen = [];
        for (var i = 0; i < imagePool.length; i++) {
            if (usedIndices.indexOf(i) === -1) {
                unseen.push(i);
            }
        }

        // 如果全部展示过一轮，重置（但打乱顺序避免重复感）
        if (unseen.length < count) {
            usedIndices = [];
            for (var k = 0; k < imagePool.length; k++) {
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

        return picked.map(function(idx){ return imagePool[idx]; });
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
        if (currentGroup.length === 0) return;
        var next = (currentSlideIdx + 1) % currentGroup.length;
        goToSlide(next);
    }

    function prevSlide() {
        if (currentGroup.length === 0) return;
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
        var total = getAllImages().length;
        el.textContent = '已展示 ' + shown + ' / ' + total + ' 张（全部看完后重新开始）';
    }

    /* =================================================================
       朋友投稿：压缩 → Storage → Firestore 待审核
       ================================================================= */
    function setUploadState(message, isError) {
        var state = document.getElementById('carousel-upload-state');
        if (!state) return;
        state.textContent = message;
        state.classList.toggle('is-error', Boolean(isError));
    }

    function hideUploadPanel() {
        var panel = document.querySelector('.carousel-upload-panel');
        if (panel) panel.hidden = true;
    }

    function setUploadBusy(isBusy) {
        uploadInProgress = isBusy;
        ['carousel-upload-pick', 'carousel-upload-submit', 'carousel-upload-cancel'].forEach(function(id) {
            var button = document.getElementById(id);
            if (button) button.disabled = isBusy ||
                ((id === 'carousel-upload-submit' || id === 'carousel-upload-cancel') && !selectedUpload);
        });
    }

    function formatFileSize(bytes) {
        return (bytes / 1024 / 1024).toFixed(bytes >= 1024 * 1024 ? 2 : 1) + ' MB';
    }

    function clearSelectedUpload() {
        if (selectedUpload && selectedUpload.previewUrl) URL.revokeObjectURL(selectedUpload.previewUrl);
        selectedUpload = null;

        var input = document.getElementById('carousel-upload-input');
        var preview = document.getElementById('carousel-upload-preview');
        var previewImage = document.getElementById('carousel-upload-preview-image');
        if (input) input.value = '';
        if (preview) preview.classList.remove('is-visible');
        if (previewImage) previewImage.removeAttribute('src');
        setUploadBusy(false);
    }

    function loadImage(file) {
        return new Promise(function(resolve, reject) {
            var objectUrl = URL.createObjectURL(file);
            var image = new Image();
            image.onload = function() {
                URL.revokeObjectURL(objectUrl);
                resolve(image);
            };
            image.onerror = function() {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('无法读取这张图片，请换一张 JPG、PNG 或 WebP 图片。'));
            };
            image.src = objectUrl;
        });
    }

    function canvasToJpeg(canvas, quality) {
        return new Promise(function(resolve, reject) {
            canvas.toBlob(function(blob) {
                if (blob) resolve(blob);
                else reject(new Error('图片压缩失败，请换一张图片重试。'));
            }, 'image/jpeg', quality);
        });
    }

    async function compressImage(file) {
        var image = await loadImage(file);
        var sourceWidth = image.naturalWidth || image.width;
        var sourceHeight = image.naturalHeight || image.height;
        if (!sourceWidth || !sourceHeight) throw new Error('图片尺寸无效，请换一张图片。');

        var scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(sourceWidth, sourceHeight));
        var quality = 0.88;
        var canvas = document.createElement('canvas');

        for (var attempt = 0; attempt < 8; attempt++) {
            canvas.width = Math.max(1, Math.round(sourceWidth * scale));
            canvas.height = Math.max(1, Math.round(sourceHeight * scale));
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            var blob = await canvasToJpeg(canvas, quality);
            if (blob.size <= MAX_COMPRESSED_IMAGE_BYTES) {
                return { blob: blob, width: canvas.width, height: canvas.height };
            }
            if (quality > 0.52) quality -= 0.12;
            else {
                scale *= 0.8;
                quality = 0.82;
            }
        }

        throw new Error('压缩后仍超过 1 MB，请换一张更小的图片。');
    }

    async function prepareUpload(file) {
        if (!file || uploadInProgress) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setUploadState('只支持 JPG、PNG 或 WebP 图片。', true);
            return;
        }
        if (file.size > MAX_ORIGINAL_IMAGE_BYTES) {
            setUploadState('原图超过 15 MB，请先换一张更小的图片。', true);
            return;
        }

        setUploadBusy(true);
        setUploadState('正在压缩图片，位置信息不会被上传…');
        try {
            var compressed = await compressImage(file);
            clearSelectedUpload();
            selectedUpload = {
                blob: compressed.blob,
                width: compressed.width,
                height: compressed.height,
                previewUrl: URL.createObjectURL(compressed.blob)
            };

            var preview = document.getElementById('carousel-upload-preview');
            var previewImage = document.getElementById('carousel-upload-preview-image');
            var previewCopy = document.getElementById('carousel-upload-preview-copy');
            if (preview) preview.classList.add('is-visible');
            if (previewImage) previewImage.src = selectedUpload.previewUrl;
            if (previewCopy) previewCopy.textContent =
                compressed.width + ' × ' + compressed.height + '，压缩后 ' + formatFileSize(compressed.blob.size);
            setUploadState('照片已准备好，提交后会先等待小花先生确认。');
            setUploadBusy(false);
        } catch (err) {
            clearSelectedUpload();
            setUploadState(err.message || '图片处理失败，请重试。', true);
        }
    }

    function withTimeout(task, timeoutMs, message) {
        var timer = null;
        return Promise.race([
            task,
            new Promise(function(_, reject) {
                timer = window.setTimeout(function() { reject(new Error(message)); }, timeoutMs);
            })
        ]).finally(function() { window.clearTimeout(timer); });
    }

    function createUploadId() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID().replace(/-/g, '');
        }
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
    }

    async function uploadCompressedFile(storageRef, blob) {
        var uploadTask = storageRef.put(blob, {
            contentType: 'image/jpeg',
            cacheControl: 'public,max-age=31536000,immutable'
        });
        var uploadTimeout = window.setTimeout(function() { uploadTask.cancel(); }, 45000);
        try {
            var snapshot = await uploadTask;
            return await withTimeout(snapshot.ref.getDownloadURL(), 10000, '获取图片地址超时，请重试。');
        } finally {
            window.clearTimeout(uploadTimeout);
        }
    }

    async function saveSubmission(services, storagePath, imageUrl) {
        var db = services.db;
        var uid = services.auth.currentUser.uid;
        var limitRef = db.collection('carouselUploadLimits').doc(uid);
        var limitSnapshot = await withTimeout(limitRef.get(), 10000, '读取今日投稿次数超时，请重试。');
        var now = Date.now();
        var limitData = limitSnapshot.exists ? limitSnapshot.data() : null;
        var dayStartedAt = limitData && limitData.dayStartedAt;
        var sameDay = dayStartedAt && typeof dayStartedAt.toMillis === 'function' &&
            now - dayStartedAt.toMillis() < 24 * 60 * 60 * 1000;
        var nextCount = sameDay ? Number(limitData.count || 0) + 1 : 1;
        if (sameDay && nextCount > DAILY_UPLOAD_LIMIT) {
            throw new Error('今天已经投稿 ' + DAILY_UPLOAD_LIMIT + ' 张，明天再来分享新的瞬间吧。');
        }

        var batch = db.batch();
        var submissionRef = db.collection('carouselSubmissions').doc();
        if (sameDay) {
            batch.update(limitRef, { count: nextCount });
        } else {
            batch.set(limitRef, {
                count: 1,
                dayStartedAt: services.serverTimestamp()
            });
        }
        batch.set(submissionRef, {
            authorId: uid,
            status: 'pending',
            storagePath: storagePath,
            imageUrl: imageUrl,
            fileSize: selectedUpload.blob.size,
            contentType: 'image/jpeg',
            width: selectedUpload.width,
            height: selectedUpload.height,
            createdAt: services.serverTimestamp()
        });
        await withTimeout(batch.commit(), 15000, '提交审核超时，请检查网络后重试。');
    }

    async function submitUpload() {
        if (!selectedUpload || uploadInProgress) return;
        if (!carouselServicesPromise) {
            setUploadState('上传服务还未连接，请稍后重试。', true);
            return;
        }

        var services = await carouselServicesPromise;
        if (!services || !services.auth.currentUser) {
            setUploadState('上传服务暂时不可用，请稍后重试。', true);
            return;
        }

        setUploadBusy(true);
        setUploadState('正在上传压缩后的照片…');
        var storagePath = 'carousel-submissions/' + services.auth.currentUser.uid + '/' + createUploadId() + '.jpg';
        var storageRef = services.storage.ref().child(storagePath);
        try {
            var imageUrl = await uploadCompressedFile(storageRef, selectedUpload.blob);
            setUploadState('照片已上传，正在送往待审核区…');
            await saveSubmission(services, storagePath, imageUrl);
            clearSelectedUpload();
            setUploadState('已提交，等小花先生确认后会加入放映机。');
        } catch (err) {
            console.error('放映机投稿失败:', err);
            storageRef.delete().catch(function() {});
            setUploadBusy(false);
            setUploadState(err.message || '投稿失败，请重试。', true);
        }
    }

    function refreshArchiveDisplay() {
        usedIndices = [];
        currentGroup = [];
        updateCounter();
        if (!isInitialized || getAllImages().length === 0) return;
        renderCarousel(getNextGroup(3));
    }

    function subscribeArchivePhotos(db) {
        if (archivePhotoUnsubscribe) return;
        archivePhotoUnsubscribe = db.collection('archivePhotos')
            .orderBy('sortOrder', 'asc')
            .limit(150)
            .onSnapshot(function(snapshot) {
                archiveImages = snapshot.docs.map(function(doc) {
                    var data = doc.data();
                    return data && typeof data.imageUrl === 'string' && /^https:\/\//.test(data.imageUrl)
                        ? data.imageUrl
                        : null;
                }).filter(Boolean);
                refreshArchiveDisplay();
            }, function(err) {
                console.warn('读取完整回忆档案失败，将继续使用首页照片。', err);
            });
    }

    function subscribeApprovedPhotos(db) {
        if (carouselPhotoUnsubscribe) return;
        carouselPhotoUnsubscribe = db.collection('carouselPhotos')
            .orderBy('approvedAt', 'desc')
            .limit(120)
            .onSnapshot(function(snapshot) {
                approvedImages = snapshot.docs.map(function(doc) {
                    var data = doc.data();
                    return data && typeof data.imageUrl === 'string' && /^https:\/\//.test(data.imageUrl)
                        ? data.imageUrl
                        : null;
                }).filter(Boolean);
                usedIndices = [];
                updateCounter();
            }, function(err) {
                console.warn('读取已审核照片失败:', err);
            });
    }

    function connectCarouselServices() {
        if (carouselServicesPromise || typeof window.getFirebaseServices !== 'function') {
            if (typeof window.getFirebaseServices !== 'function') {
                hideUploadPanel();
            }
            return;
        }

        setUploadState('正在连接投稿服务…');
        carouselServicesPromise = window.getFirebaseServices()
            .then(function(services) {
                subscribeArchivePhotos(services.db);
                subscribeApprovedPhotos(services.db);
                var panel = document.querySelector('.carousel-upload-panel');
                if (panel) panel.hidden = false;
                var pickButton = document.getElementById('carousel-upload-pick');
                if (pickButton) pickButton.disabled = false;
                setUploadState('选择一张照片，压缩后提交给小花先生审核。');
                return services;
            })
            .catch(function(err) {
                console.warn('放映机上传服务未连接:', err);
                carouselServicesPromise = null;
                hideUploadPanel();
                return null;
            });
    }

    /* =================================================================
       初始化（首次展开“全部回忆”时调用）
       ================================================================= */
    function initImageCarousel() {
        if (isInitialized) return true;

        // 查找或创建 UI
        var module = document.getElementById('memory-archive');
        if (!module) return false;

        injectCSS();

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
                '<button class="carousel-next-btn" id="carousel-next-group">下一组</button>' +
                '<button class="carousel-arrow" id="carousel-next" title="下一张">▶</button>';
            container.appendChild(navBtns);

            // 计数器
            var counter = document.createElement('p');
            counter.className = 'carousel-counter';
            counter.id = 'carousel-counter';
            container.appendChild(counter);

            // 朋友投稿：照片先进入待审核区，不能直接出现在放映机。
            var uploadPanel = document.createElement('section');
            uploadPanel.className = 'carousel-upload-panel';
            uploadPanel.hidden = true;
            uploadPanel.setAttribute('aria-label', '投稿照片');
            uploadPanel.innerHTML =
                '<h3 class="carousel-upload-title">把这一刻留在放映机</h3>' +
                '<p class="carousel-upload-note">支持 JPG、PNG、WebP；原图最多 15 MB，上传前会压缩为不超过 1 MB 的 JPG，并移除位置信息。提交后需要小花先生确认。</p>' +
                '<input id="carousel-upload-input" type="file" accept="image/jpeg,image/png,image/webp" hidden>' +
                '<div class="carousel-upload-actions">' +
                    '<button id="carousel-upload-pick" class="carousel-upload-button" type="button" disabled>＋ 选择照片</button>' +
                    '<button id="carousel-upload-submit" class="carousel-upload-submit" type="button" disabled>提交审核</button>' +
                    '<button id="carousel-upload-cancel" class="carousel-upload-cancel" type="button" disabled>取消</button>' +
                '</div>' +
                '<div id="carousel-upload-preview" class="carousel-upload-preview">' +
                    '<img id="carousel-upload-preview-image" alt="待提交照片预览">' +
                    '<span id="carousel-upload-preview-copy" class="carousel-upload-preview-copy"></span>' +
                '</div>' +
                '<p id="carousel-upload-state" class="carousel-upload-state" aria-live="polite">正在准备投稿服务…</p>';
            container.appendChild(uploadPanel);

            module.appendChild(container);

            // 事件绑定
            document.getElementById('carousel-next-group').addEventListener('click', function(){
                var images = getNextGroup(3);
                renderCarousel(images);
            });
            document.getElementById('carousel-prev').addEventListener('click', prevSlide);
            document.getElementById('carousel-next').addEventListener('click', nextSlide);
            document.getElementById('carousel-upload-pick').addEventListener('click', function() {
                document.getElementById('carousel-upload-input').click();
            });
            document.getElementById('carousel-upload-input').addEventListener('change', function(event) {
                prepareUpload(event.target.files && event.target.files[0]);
            });
            document.getElementById('carousel-upload-submit').addEventListener('click', submitUpload);
            document.getElementById('carousel-upload-cancel').addEventListener('click', function() {
                clearSelectedUpload();
                setUploadState('已取消本次选择。');
            });

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

        isInitialized = true;
        connectCarouselServices();
        return true;
    }

    // 暴露给全局
    window.initImageCarousel = initImageCarousel;
    window.refreshCarousel = function(){
        if (!isInitialized && !initImageCarousel()) return;
        var images = getNextGroup(3);
        renderCarousel(images);
    };

    window.addEventListener('firebaseSdkReady', function() {
        if (isInitialized) connectCarouselServices();
    });

})();
