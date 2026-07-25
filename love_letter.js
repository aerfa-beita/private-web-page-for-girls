/* ============================================================
   月光情书 · 每日一句话弹窗
   交互：长按月亮 → 弹窗 + 打字机 → 点击"收下" → 银河信封
   ============================================================ */

(function () {
    var typewriterTimer = null;

    function stopTypewriter() {
        if (typewriterTimer) window.clearInterval(typewriterTimer);
        typewriterTimer = null;
    }

    function getParts(modal) {
        return {
            content: modal.querySelector('[data-letter-content]'),
            source: modal.querySelector('[data-letter-source]')
        };
    }

    /* 设置情话内容，并自动开始打字 */
    function setQuote(modal, quote) {
        modal._letterQuote = quote || {
            text: '今夜的月光，替我陪在你身边。',
            source: '—— 月光替我收好'
        };
        startTyping(modal);
    }

    /* 打字机效果 */
    function startTyping(modal) {
        stopTypewriter();
        var parts = getParts(modal);
        var quote = modal._letterQuote;
        if (!parts.content) return;

        var chars = Array.from(quote.text || '');
        var index = 0;
        parts.content.textContent = '';
        if (parts.source) parts.source.textContent = '';

        typewriterTimer = window.setInterval(function () {
            parts.content.textContent += chars[index] || '';
            index += 1;
            if (index < chars.length) {
                return;
            }
            stopTypewriter();
            if (parts.source) parts.source.textContent = quote.source || '';
        }, 46);
    }

    /* ----------------------------------------------------------
       长按月亮 → loveLetterRequested 事件 → 显示弹窗 + 自动打字
       ---------------------------------------------------------- */
    function openLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        stopTypewriter();
        modal.hidden = false;
        modal.classList.add('active');
        modal._letterQuote = null;

        var parts = getParts(modal);
        if (parts.content) parts.content.textContent = '';
        if (parts.source) parts.source.textContent = '';

        if (typeof window.getMoonQuote !== 'function') {
            setQuote(modal);
            return;
        }
        window.getMoonQuote().then(function (quote) {
            if (modal.hidden) return;
            setQuote(modal, quote);
        }).catch(function () {
            if (!modal.hidden) setQuote(modal);
        });
    }

    /* ----------------------------------------------------------
       点击"收下这句话" → 关闭弹窗 → 弹出银河信封
       ---------------------------------------------------------- */
    function closeLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        stopTypewriter();
        modal.classList.remove('active');
        modal.hidden = true;

        // 弹出银河信封
        window.setTimeout(function () {
            if (typeof showEnvelope === 'function') showEnvelope();
        }, 400);
    }

    /* ---- 事件绑定 ---- */
    document.addEventListener('DOMContentLoaded', function () {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;

        var closeBtn = modal.querySelector('[data-close-letter]');
        if (closeBtn) closeBtn.addEventListener('click', closeLoveLetter);

        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeLoveLetter();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !modal.hidden) closeLoveLetter();
        });
        window.addEventListener('loveLetterRequested', openLoveLetter);
    });

    window.openLoveLetter = openLoveLetter;
    window.closeLoveLetter = closeLoveLetter;
}());
