/* ============================================================
   Cosmic Letter Module · 动画 v7

   触发：长按月亮 → showEnvelope()
   点击封蜡 → 封蜡爆亮 → 上盖翻转 → 信纸从内部升起 → 打字
   ============================================================ */

(function () {
    'use strict';

    var envelope  = document.querySelector('#cosmicEnvelope');
    if (!envelope) return;

    var seal      = envelope.querySelector('#envelopeSeal');
    var bodyEl    = envelope.querySelector('#envelopeBody');
    var overlay   = envelope.querySelector('.envelope-overlay');
    var closeBtn  = envelope.querySelector('.envelope-close');
    var contentEl = envelope.querySelector('#letterContent');

    var typingTimer = null;
    var openTimer   = null;

    /* showEnvelope() — 由 lion_background.js 长按月亮调用 */
    window.showEnvelope = function () {
        if (!envelope) return;
        resetEnvelope();
        requestAnimationFrame(function () {
            envelope.classList.add('active');
        });
    };

    /* 点击封蜡或信封 → 打开 */
    seal.addEventListener('click', function (e) {
        e.stopPropagation();
        startOpen();
    });
    bodyEl.addEventListener('click', function (e) {
        if (e.target.closest('#envelopeSeal')) return;
        startOpen();
    });

    function startOpen() {
        if (envelope.classList.contains('activating')) return;
        if (envelope.classList.contains('open')) return;

        // 阶段一：封蜡爆亮
        envelope.classList.add('activating');

        // 阶段二：600ms 后上盖翻转 + 信纸升起
        openTimer = setTimeout(function () {
            envelope.classList.add('open');
            // 等信纸升起后开始打字
            setTimeout(function () { typeContent(); }, 1400);
        }, 600);
    }

    /* 关闭 */
    function closeEnvelope(e) {
        if (e) e.stopPropagation();
        resetEnvelope();
    }
    closeBtn.addEventListener('click', closeEnvelope);
    overlay.addEventListener('click', closeEnvelope);

    /* ==== 逐字打字 ==== */
    function typeContent() {
        var text = [
            '在浩瀚星河之中，', '',
            '有一颗星辰，', '',
            '一直等待与你相遇。', '', '',
            '谢谢你来到我的世界。', '',
            '愿未来每一个夜晚，', '',
            '都有星光陪伴。'
        ].join('\n');

        if (!contentEl) return;
        if (typingTimer) clearInterval(typingTimer);

        var i = 0;
        contentEl.innerHTML = '';

        typingTimer = setInterval(function () {
            contentEl.innerHTML += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(typingTimer);
                typingTimer = null;
            }
        }, 90);
    }

    function resetEnvelope() {
        if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
        if (openTimer)   { clearTimeout(openTimer);   openTimer = null; }
        if (contentEl) contentEl.innerHTML = '';
        envelope.classList.remove('active', 'activating', 'open');
    }

})();
