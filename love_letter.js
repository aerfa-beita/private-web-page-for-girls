(function () {
    var typewriterTimer = null;

    function stopTypewriter() {
        if (typewriterTimer) window.clearInterval(typewriterTimer);
        typewriterTimer = null;
    }

    function getLetterParts(modal) {
        return {
            content: modal.querySelector('[data-letter-content]'),
            source: modal.querySelector('[data-letter-source]'),
            envelope: modal.querySelector('[data-open-letter]')
        };
    }

    function setLetterQuote(modal, quote) {
        modal._letterQuote = quote || {
            text: '今夜的月光，替我陪在你身边。',
            source: '—— 月光替我收好'
        };
        if (modal.classList.contains('is-open')) typeLetter(modal);
    }

    function typeLetter(modal) {
        stopTypewriter();
        var parts = getLetterParts(modal);
        var quote = modal._letterQuote;
        if (!parts.content || !quote) return;
        var characters = Array.from(quote.text || '今夜的月光，替我陪在你身边。');
        var index = 0;
        parts.content.textContent = '';
        if (parts.source) parts.source.textContent = '';
        typewriterTimer = window.setInterval(function () {
            parts.content.textContent += characters[index] || '';
            index += 1;
            if (index < characters.length) return;
            stopTypewriter();
            if (parts.source) parts.source.textContent = quote.source || '';
        }, 46);
    }

    function openLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        stopTypewriter();
        modal.hidden = false;
        modal.classList.add('active');
        modal.classList.remove('is-open');
        modal._letterQuote = null;

        var parts = getLetterParts(modal);
        if (parts.content) parts.content.textContent = '';
        if (parts.source) parts.source.textContent = '';
        if (parts.envelope) {
            parts.envelope.setAttribute('aria-expanded', 'false');
            parts.envelope.focus();
        }

        if (typeof window.getMoonQuote !== 'function') {
            setLetterQuote(modal);
            return;
        }
        window.getMoonQuote().then(function (quote) {
            if (modal.hidden) return;
            setLetterQuote(modal, quote);
        }).catch(function () {
            if (!modal.hidden) setLetterQuote(modal);
        });
    }

    function revealLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal || modal.hidden || modal.classList.contains('is-open')) return;
        modal.classList.add('is-open');
        var parts = getLetterParts(modal);
        if (parts.envelope) parts.envelope.setAttribute('aria-expanded', 'true');
        window.setTimeout(function () {
            if (!modal.hidden) typeLetter(modal);
        }, 720);
        // 打字完成后关闭情书弹窗，弹出银河信封
        window.setTimeout(function () {
            closeLoveLetter();
            if (typeof showEnvelope === 'function') showEnvelope();
        }, 2200);
    }

    function closeLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        stopTypewriter();
        modal.classList.remove('is-open', 'active');
        modal.hidden = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        var closeButton = modal.querySelector('[data-close-letter]');
        var envelope = modal.querySelector('[data-open-letter]');
        if (closeButton) closeButton.addEventListener('click', closeLoveLetter);
        if (envelope) envelope.addEventListener('click', revealLoveLetter);
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
