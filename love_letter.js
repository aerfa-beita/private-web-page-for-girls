(function () {
    function openLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        modal.hidden = false;
        modal.classList.add('active');
        var content = modal.querySelector('[data-letter-content]');
        var source = modal.querySelector('[data-letter-source]');
        if (content) content.textContent = '正在从星空里取一句话。';
        if (source) source.textContent = '';
        if (typeof window.getMoonQuote === 'function') {
            window.getMoonQuote().then(function (quote) {
                if (modal.hidden || !quote) return;
                if (content) content.textContent = quote.text;
                if (source) source.textContent = quote.source || '';
            }).catch(function () {
                if (content) content.textContent = '今夜的月光，替我陪在你身边。';
            });
        }
        var closeButton = modal.querySelector('[data-close-letter]');
        if (closeButton) closeButton.focus();
    }

    function closeLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        modal.classList.remove('active');
        modal.hidden = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        modal.querySelector('[data-close-letter]').addEventListener('click', closeLoveLetter);
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
