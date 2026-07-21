(function () {
    'use strict';

    var initialized = false;
    var phase = 'idle';
    var timers = [];
    var elements = {};

    function later(callback, delay) {
        var timer = window.setTimeout(callback, delay);
        timers.push(timer);
        return timer;
    }

    function clearTimeline() {
        timers.forEach(function (timer) { window.clearTimeout(timer); });
        timers = [];
    }

    function emit(name) {
        window.dispatchEvent(new Event(name));
    }

    function writeCaption(text, fragmentable) {
        elements.caption.textContent = '';
        if (!fragmentable) {
            elements.caption.textContent = text;
            return;
        }

        Array.from(text).forEach(function (character, index) {
            if (character === '\n') {
                elements.caption.appendChild(document.createElement('br'));
                return;
            }
            var glyph = document.createElement('span');
            glyph.className = 'cinematic-caption__glyph';
            glyph.textContent = character;
            glyph.dataset.char = character;
            var shardX = (((index * 17) % 5) - 2) * 4;
            var shardY = (((index * 11) % 5) - 2) * 3;
            var shardTurn = (((index * 13) % 5) - 2) * 1.8;
            glyph.style.setProperty('--shard-x', shardX + 'px');
            glyph.style.setProperty('--shard-y', shardY + 'px');
            glyph.style.setProperty('--shard-turn', shardTurn + 'deg');
            glyph.style.setProperty('--shard-x-opposite', (-shardX) + 'px');
            glyph.style.setProperty('--shard-y-opposite', (-shardY) + 'px');
            glyph.style.setProperty('--shard-turn-opposite', (-shardTurn) + 'deg');
            elements.caption.appendChild(glyph);
        });
    }

    function setCaption(text, visible, fragmentable) {
        if (!elements.caption) return;
        if (visible === false) {
            elements.caption.textContent = '';
            elements.caption.classList.remove('is-visible', 'is-gathering');
            return;
        }
        if (elements.caption.classList.contains('is-visible')) {
            elements.caption.classList.remove('is-visible');
            later(function () {
                writeCaption(text, fragmentable);
                elements.caption.classList.add('is-visible');
            }, 420);
            return;
        }
        writeCaption(text, fragmentable);
        window.requestAnimationFrame(function () {
            elements.caption.classList.add('is-visible');
        });
    }

    function gatherCaptionIntoStar() {
        var glyphs = elements.caption.querySelectorAll('.cinematic-caption__glyph');
        if (!glyphs.length) {
            setCaption('', false);
            return;
        }

        var target = elements.originStar.getBoundingClientRect();
        var targetX = target.left + target.width / 2;
        var targetY = target.top + target.height / 2;
        elements.root.classList.add('is-origin-centered');

        glyphs.forEach(function (glyph) {
            var source = glyph.getBoundingClientRect();
            glyph.style.setProperty('--gather-x', (targetX - (source.left + source.width / 2)).toFixed(1) + 'px');
            glyph.style.setProperty('--gather-y', (targetY - (source.top + source.height / 2)).toFixed(1) + 'px');
        });
        elements.caption.classList.add('is-gathering');
        later(function () { setCaption('', false); }, 1380);
    }

    function createStars() {
        var fragment = document.createDocumentFragment();
        var count = window.matchMedia('(max-width: 700px)').matches ? 90 : 180;

        for (var index = 0; index < count; index += 1) {
            var star = document.createElement('i');
            var angle = Math.random() * Math.PI * 2;
            var distance = 12 + Math.pow(Math.random(), 0.62) * 49;
            var x = Math.cos(angle) * distance;
            var y = Math.sin(angle) * distance * 0.58;
            var size = 0.8 + Math.random() * 2.2;
            star.className = 'cinematic-star-field__star';
            star.style.setProperty('--x', x.toFixed(2) + 'vw');
            star.style.setProperty('--y', y.toFixed(2) + 'vh');
            star.style.setProperty('--size', size.toFixed(2) + 'px');
            star.style.setProperty('--delay', (400 + Math.random() * 3500).toFixed(0) + 'ms');
            fragment.appendChild(star);
        }
        elements.starField.appendChild(fragment);
    }

    function createGalaxy() {
        var fragment = document.createDocumentFragment();
        var count = window.matchMedia('(max-width: 700px)').matches ? 110 : 230;

        for (var index = 0; index < count; index += 1) {
            var arm = index % 3;
            var progress = Math.random();
            var angle = progress * Math.PI * 4.6 + arm * (Math.PI * 2 / 3);
            var radius = 3 + progress * 43;
            var x = Math.cos(angle) * radius;
            var y = Math.sin(angle) * radius * 0.43;
            var star = document.createElement('i');
            star.className = 'cinematic-galaxy__star';
            star.style.setProperty('--x', x.toFixed(2) + 'vw');
            star.style.setProperty('--y', y.toFixed(2) + 'vh');
            star.style.setProperty('--size', (0.7 + Math.random() * 2.6).toFixed(2) + 'px');
            star.style.setProperty('--delay', (Math.random() * 2200).toFixed(0) + 'ms');
            fragment.appendChild(star);
        }
        elements.galaxy.appendChild(fragment);
    }

    function showInvitation() {
        if (phase !== 'intro') return;
        phase = 'ready';
        elements.root.classList.remove('is-origin-message');
        elements.root.classList.add('is-star-ready');
        elements.originStar.disabled = false;
    }

    function startCreation() {
        if (phase !== 'ready') return;
        phase = 'awakening';
        setCaption('', false);
        elements.originStar.disabled = true;
        elements.root.classList.add('is-awakening');
        if (typeof window.startOpeningMusic === 'function') window.startOpeningMusic();
        emit('cinematicFirstLight');
        emit('openingRitualFirstLight');

        later(function () {
            elements.root.classList.add('is-native-running');
        }, 1150);

        later(showPasswordStage, 9600);
    }

    function showPasswordStage() {
        if (phase !== 'awakening') return;
        phase = 'password';
        elements.root.classList.add('is-password-ready');
        setCaption('只有我们知道的日期，\n\n才能让这片星空靠岸。');
        emit('cinematicPasswordRequested');
    }

    function returnToPassword() {
        if (phase !== 'password') return;
        elements.root.classList.remove('is-native-running');
        elements.root.classList.add('is-password-return');
        setCaption('那串数字，\n\n还在星光里。');
        elements.originStar.disabled = false;
    }

    function reopenPassword() {
        if (phase !== 'password' || !elements.root.classList.contains('is-password-return')) return;
        elements.root.classList.remove('is-password-return');
        elements.originStar.disabled = true;
        emit('cinematicPasswordRequested');
    }

    function completePassword() {
        if (phase !== 'password') return;
        phase = 'home';
        elements.root.classList.remove('is-password-return');
        elements.root.classList.add('is-homeward');
        setCaption('', false);
        later(function () {
            elements.root.classList.add('is-complete');
            emit('cinematicHomeReady');
        }, 1100);
    }

    function beginIntro() {
        phase = 'intro';
        elements.root.classList.add('is-active');
        later(function () { setCaption('有人，\n轻轻想起了你。', true, true); }, 5000);
        later(gatherCaptionIntoStar, 8200);
        later(function () {
            elements.root.classList.add('is-origin-message');
            setCaption('于是，宇宙亮起了第一颗星。');
        }, 9600);
        later(function () {
            setCaption('', false);
            elements.root.classList.remove('is-origin-message');
        }, 14500);
        later(showInvitation, 16000);
    }

    function init() {
        if (initialized) return;
        initialized = true;
        elements = {
            root: document.getElementById('cinematic-opening'),
            caption: document.getElementById('cinematic-caption'),
            originStar: document.getElementById('cinematic-origin-star'),
            starField: document.getElementById('cinematic-star-field'),
            galaxy: document.getElementById('cinematic-galaxy')
        };
        if (!elements.root || !elements.originStar || !elements.starField || !elements.galaxy) return;

        createStars();
        createGalaxy();
        elements.originStar.addEventListener('click', function () {
            if (phase === 'ready') startCreation();
            else reopenPassword();
        });
        beginIntro();
    }

    window.UniverseCinematicOpening = {
        init: init,
        returnToPassword: returnToPassword,
        completePassword: completePassword,
        getPhase: function () { return phase; },
        clearTimeline: clearTimeline
    };
})();
