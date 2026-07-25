(() => {
    'use strict';

    const canvas = document.getElementById('stardust-trail-canvas');
    const appMain = document.getElementById('app-main');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!canvas || !appMain || reducedMotion.matches) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const PARTICLE_LIFETIME_MIN = 3200;
    const PARTICLE_LIFETIME_MAX = 5000;
    const SAMPLE_DISTANCE = 42;
    const SAMPLE_INTERVAL = 80;
    const PARTICLE_LIMIT = window.matchMedia('(max-width: 700px)').matches ? 52 : 82;
    const COLORS = ['#f6cf78', '#e4edf8'];

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let lastSampleTime = 0;
    let lastPoint = null;
    let colorIndex = 0;
    const particles = [];

    function resizeCanvas() {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function canDraw() {
        return document.visibilityState === 'visible' && appMain.classList.contains('active');
    }

    function createParticle(x, y, speed) {
        const color = COLORS[colorIndex++ % COLORS.length];
        const angle = Math.random() * Math.PI * 2;
        const drift = 0.012 + Math.random() * 0.032;
        const lifetime = PARTICLE_LIFETIME_MIN + Math.random() * (PARTICLE_LIFETIME_MAX - PARTICLE_LIFETIME_MIN);

        particles.push({
            x: x + (Math.random() - 0.5) * 5,
            y: y + (Math.random() - 0.5) * 5,
            vx: Math.cos(angle) * drift + speed.x * 0.018,
            vy: Math.sin(angle) * drift + speed.y * 0.018 - (0.008 + Math.random() * 0.018),
            size: 0.7 + Math.random() * 1.55,
            bornAt: performance.now(),
            lifetime,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.003,
            color,
            sparkle: Math.random() > 0.9
        });

        if (particles.length > PARTICLE_LIMIT) particles.splice(0, particles.length - PARTICLE_LIMIT);
    }

    function releaseDust(x, y, velocity) {
        createParticle(x, y, velocity);
        if (!animationFrame) animationFrame = requestAnimationFrame(render);
    }

    function drawSparkle(size) {
        context.beginPath();
        context.moveTo(0, -size * 1.8);
        context.lineTo(size * 0.38, -size * 0.38);
        context.lineTo(size * 1.8, 0);
        context.lineTo(size * 0.38, size * 0.38);
        context.lineTo(0, size * 1.8);
        context.lineTo(-size * 0.38, size * 0.38);
        context.lineTo(-size * 1.8, 0);
        context.lineTo(-size * 0.38, -size * 0.38);
        context.closePath();
        context.fill();
    }

    function render(now) {
        animationFrame = 0;
        context.clearRect(0, 0, width, height);
        context.globalCompositeOperation = 'lighter';

        for (let index = particles.length - 1; index >= 0; index -= 1) {
            const particle = particles[index];
            const progress = (now - particle.bornAt) / particle.lifetime;

            if (progress >= 1) {
                particles.splice(index, 1);
                continue;
            }

            const fade = Math.pow(1 - progress, 1.35);
            particle.x += particle.vx * 16;
            particle.y += particle.vy * 16;
            particle.vy += 0.0006;
            particle.rotation += particle.rotationSpeed * 16;

            context.save();
            context.translate(particle.x, particle.y);
            context.rotate(particle.rotation);
            context.globalAlpha = fade * (particle.sparkle ? 0.94 : 0.72);
            context.fillStyle = particle.color;
            context.shadowBlur = particle.size * 3;
            context.shadowColor = particle.color;

            if (particle.sparkle) {
                drawSparkle(particle.size);
            } else {
                context.beginPath();
                context.arc(0, 0, particle.size, 0, Math.PI * 2);
                context.fill();
            }
            context.restore();
        }

        context.globalCompositeOperation = 'source-over';
        if (particles.length && document.visibilityState === 'visible') {
            animationFrame = requestAnimationFrame(render);
        }
    }

    function samplePoint(point) {
        if (!canDraw()) {
            lastPoint = null;
            return;
        }

        const now = performance.now();
        if (!lastPoint) {
            lastPoint = { x: point.clientX, y: point.clientY, time: now };
            return;
        }

        const dx = point.clientX - lastPoint.x;
        const dy = point.clientY - lastPoint.y;
        const distance = Math.hypot(dx, dy);
        if (distance < SAMPLE_DISTANCE && now - lastSampleTime < SAMPLE_INTERVAL) return;

        const elapsed = Math.max(1, now - lastPoint.time);
        const steps = Math.min(2, Math.max(1, Math.ceil(distance / SAMPLE_DISTANCE)));
        const velocity = { x: dx / elapsed, y: dy / elapsed };

        for (let index = 1; index <= steps; index += 1) {
            const ratio = index / steps;
            releaseDust(lastPoint.x + dx * ratio, lastPoint.y + dy * ratio, velocity);
        }

        lastPoint = { x: point.clientX, y: point.clientY, time: now };
        lastSampleTime = now;
    }

    function handlePointerMove(event) {
        const points = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [event];
        samplePoint(points[points.length - 1]);
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('blur', () => { lastPoint = null; });
    document.addEventListener('visibilitychange', () => {
        lastPoint = null;
        if (document.visibilityState !== 'visible') particles.length = 0;
    });

    resizeCanvas();
})();
