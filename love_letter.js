(function () {
    function openLoveLetter() {
        var modal = document.getElementById('love-letter-modal');
        if (!modal) return;
        modal.hidden = false;
        modal.classList.add('active');
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
