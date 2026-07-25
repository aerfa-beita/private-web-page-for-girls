(function () {
    function renderPresenceHeart(isTogether) {
        var area = document.getElementById('heartbeat-area');
        var panel = document.getElementById('presence-panel');
        var heart = area && area.querySelector('.presence-heart');
        var text = document.getElementById('heartbeat-text');
        if (!area || !panel || !heart || !text) return;

        window.__PRESENCE_TOGETHER__ = Boolean(isTogether);
        panel.classList.add('is-ready');
        panel.classList.toggle('is-together', Boolean(isTogether));
        area.style.display = 'flex';
        heart.classList.toggle('is-solo', !isTogether);
        text.textContent = isTogether ? '此刻，心跳同频' : '另一颗星光，正在路上';
    }

    function hidePresenceHeart() {
        var area = document.getElementById('heartbeat-area');
        var panel = document.getElementById('presence-panel');
        if (area) area.style.display = 'none';
        if (panel) panel.classList.remove('is-ready', 'is-together');
    }

    window.renderPresenceHeart = renderPresenceHeart;
    window.hidePresenceHeart = hidePresenceHeart;
    if (typeof window.__PRESENCE_TOGETHER__ === 'boolean') {
        renderPresenceHeart(window.__PRESENCE_TOGETHER__);
    }
}());
