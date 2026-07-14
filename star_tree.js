(function () {
    function renderMessageStars(messages) {
        var container = document.getElementById('star-tree');
        var count = document.getElementById('star-count');
        if (!container || !count) return;
        container.innerHTML = '<div class="star-tree-trunk" aria-hidden="true"></div>';
        messages.forEach(function (message, index) {
            var star = document.createElement('span');
            var angle = index * 2.399963229728653;
            var radius = 18 + Math.sqrt(index) * 13;
            star.className = 'message-star';
            star.textContent = '★';
            star.title = message.text || '一条留言';
            star.style.left = (50 + Math.cos(angle) * radius) + '%';
            star.style.top = (72 - Math.sin(angle) * radius) + '%';
            container.appendChild(star);
        });
        count.textContent = '✨ ' + messages.length + ' 颗留言星星';
    }

    window.renderMessageStars = renderMessageStars;
}());
