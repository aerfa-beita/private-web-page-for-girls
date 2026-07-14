const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('registers the memory timeline and love-letter modules', () => {
    const html = read('index.html');
    assert.match(html, /memory_timeline\.js/);
    assert.match(html, /love_letter\.js/);
    assert.match(html, /id="memory-timeline"/);
    assert.match(html, /id="love-letter-modal"/);
});

test('replaces the sixth photo placeholder with a real asset', () => {
    const html = read('index.html');
    assert.doesNotMatch(html, /待替换_图片6\.jpg/);
    assert.match(html, /IMG_20260228\/IMG_\d+_\d+\.jpg/);
});

test('uses a versioned cache for all application scripts', () => {
    const serviceWorker = read('sw.js');
    assert.match(serviceWorker, /CACHE_NAME = 'our-universe-v2'/);
    assert.match(serviceWorker, /lion_background\.js/);
    assert.match(serviceWorker, /image_carousel\.js/);
    assert.match(serviceWorker, /memory_timeline\.js/);
    assert.match(serviceWorker, /love_letter\.js/);
});

test('keeps AI requests behind a configured same-origin service endpoint', () => {
    const aiService = read('ai_service.js');
    assert.match(aiService, /AI_ENDPOINT/);
    assert.match(aiService, /credentials: 'same-origin'/);
    assert.doesNotMatch(aiService, /sk-[A-Za-z0-9]/);
});

test('uses the V3 editorial hero and restrained gold-space palette', () => {
    const html = read('index.html');
    assert.match(html, /OUR LITTLE UNIVERSE/);
    assert.match(html, /点亮星河/);
    assert.match(html, /--gold:\s*#D8B36A/);
    assert.match(html, /class="hero-kicker"/);

    const background = read('lion_background.js');
    assert.match(background, /INTRO_TIMELINE/);
    assert.match(background, /leoLabel/);
});

test('adds a post-unlock constellation observatory with three memory stars', () => {
    const html = read('index.html');
    assert.match(html, /id="constellation-observatory"/);
    assert.match(html, /2025\.01\.29/);
    assert.match(html, /2025\.07\.06/);
    assert.match(html, /2026\.02\.10/);
    assert.match(html, /我们第一次走进彼此的心里/);
    assert.match(html, /我们在沙漠里奔跑/);
    assert.match(html, /重庆的灯亮起时/);

    const background = read('lion_background.js');
    assert.match(background, /leoFadeStart/);
    assert.match(background, /0xD8B36A/i);
});

test('keeps the observatory chart readable with a nebula layer and drag rotation', () => {
    const html = read('index.html');
    assert.match(html, /class="observatory-nebula"/);
    assert.match(html, /id="leo-chart-group"/);
    assert.match(html, /initConstellationDrag/);
    assert.match(html, /observatory-memory-notes/);
});

test('waits for a user gesture before opening the password lock', () => {
    const html = read('index.html');
    assert.match(html, /id="unlock-prompt"/);
    assert.match(html, /waitForUnlockGesture/);
    assert.match(html, /grid-template-columns:\s*1fr/);
});
