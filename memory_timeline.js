(function () {
    function formatDate(value) {
        if (!value) return '未标注日期';
        return value.replace(/-/g, '.');
    }

    function renderTimeline() {
        var container = document.getElementById('memory-timeline');
        var photos = window.UNIVERSE_PHOTOS || [];
        if (!container || !photos.length) return;

        var ordered = photos.slice().sort(function (a, b) {
            return String(a.date || '').localeCompare(String(b.date || ''));
        });
        container.innerHTML = '<h2 class="section-title">✨ 时间星河</h2><div class="timeline-track"></div>';
        var track = container.querySelector('.timeline-track');

        ordered.forEach(function (photo) {
            var item = document.createElement('article');
            item.className = 'timeline-item polaroid-card';
            item.innerHTML =
                '<img loading="lazy" alt="' + escapeHtml(photo.text || '回忆照片') + '">' +
                '<p class="timeline-date">' + escapeHtml(formatDate(photo.date)) + '</p>' +
                '<p class="timeline-text">' + escapeHtml(photo.text || '我们的回忆') + '</p>';
            item.querySelector('img').src = photo.url;
            track.appendChild(item);
        });
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
        });
    }

    window.initMemoryTimeline = renderTimeline;
    document.addEventListener('DOMContentLoaded', renderTimeline);
}());
