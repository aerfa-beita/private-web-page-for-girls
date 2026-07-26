/* ============================================================
   月光情书 · 每日一句话弹窗
   交互：长按月亮 → 弹窗 + 打字机 → 点击"收下" → 银河信封
   ============================================================ */

(function () {
    'use strict';

    var typewriterTimer = null;
    var envelopeRequestTimer = null;

    function getModal() {
        return document.getElementById('love-letter-modal');
    }

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

    function clearLetter(modal) {
        var parts = getParts(modal);
        if (parts.content) parts.content.textContent = '';
        if (parts.source) parts.source.textContent = '';
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
        clearLetter(modal);

        typewriterTimer = window.setInterval(function () {
            parts.content.textContent += chars[index] || '';
            index += 1;
            if (index < chars.length) return;

            stopTypewriter();
            if (parts.source) parts.source.textContent = quote.source || '';
        }, 100);
    }

    function dismissLoveLetter() {
        var modal = getModal();
        if (!modal) return;

        stopTypewriter();
        modal._letterRequestId = (modal._letterRequestId || 0) + 1;
        modal.classList.remove('active');
        modal.hidden = true;
    }

    function showAcceptedEnvelope() {
        if (typeof window.showEnvelope === 'function') {
            window.showEnvelope();
            return;
        }

        window.addEventListener('cosmicEnvelopeReady', function () {
            if (typeof window.showEnvelope === 'function') window.showEnvelope();
        }, { once: true });
    }

    /* ----------------------------------------------------------
       长按月亮 → loveLetterRequested 事件 → 显示弹窗 + 自动打字
       ---------------------------------------------------------- */
    function openLoveLetter() {
        var modal = getModal();
        if (!modal) return;

        stopTypewriter();
        modal.hidden = false;
        modal.classList.add('active');
        modal._letterQuote = null;
        modal._letterRequestId = (modal._letterRequestId || 0) + 1;
        var requestId = modal._letterRequestId;
        clearLetter(modal);

        if (typeof window.getMoonQuote !== 'function') {
            setQuote(modal);
            return;
        }

        Promise.resolve(window.getMoonQuote()).then(function (quote) {
            if (modal.hidden || modal._letterRequestId !== requestId) return;
            setQuote(modal, quote);
        }).catch(function () {
            if (!modal.hidden && modal._letterRequestId === requestId) setQuote(modal);
        });
    }

    /* ----------------------------------------------------------
       只有点击"收下这句话"才进入信封；遮罩与 Esc 仅关闭每日一句。
       ---------------------------------------------------------- */
    function acceptLoveLetter() {
        dismissLoveLetter();
        if (envelopeRequestTimer) window.clearTimeout(envelopeRequestTimer);
        envelopeRequestTimer = window.setTimeout(function () {
            envelopeRequestTimer = null;
            showAcceptedEnvelope();
        }, 260);
    }

    function bindLoveLetter() {
        var modal = getModal();
        if (!modal || modal.dataset.letterBound === 'true') return;
        modal.dataset.letterBound = 'true';

        var acceptBtn = modal.querySelector('[data-accept-letter]');
        if (acceptBtn) acceptBtn.addEventListener('click', acceptLoveLetter);

        modal.addEventListener('click', function (event) {
            if (event.target === modal) dismissLoveLetter();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !modal.hidden) dismissLoveLetter();
        });
    }

    function init() {
        bindLoveLetter();
        window.addEventListener('loveLetterRequested', openLoveLetter);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    window.openLoveLetter = openLoveLetter;
    window.acceptLoveLetter = acceptLoveLetter;
    window.closeLoveLetter = dismissLoveLetter;
}());
