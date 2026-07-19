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
    assert.match(serviceWorker, /CACHE_NAME = 'our-universe-v22-resilient-opening'/);
    assert.match(serviceWorker, /lion_background\.js\?v=21/);
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
    assert.match(html, /lion_background\.js\?v=21/);
    assert.match(html, /OUR LITTLE UNIVERSE/);
    assert.match(html, /点亮星河/);
    assert.match(html, /--gold:\s*#D8B36A/);
    assert.match(html, /class="hero-kicker"/);

    const background = read('lion_background.js');
    assert.match(background, /INTRO_TIMELINE/);
    assert.match(background, /revealSickle/);
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

test('uses transparent lion linework with memory-star reveals', () => {
    const html = read('index.html');
    assert.match(html, /class="leo-artwork"/);
    assert.match(html, /leo-linework-transparent\.png\?v=15/);
    assert.match(html, /id="memory-reveal"/);
    assert.match(html, /initMemoryStars/);
    assert.match(html, /data-memory="first"/);
    assert.match(html, /data-memory="desert"/);
    assert.match(html, /data-memory="chongqing"/);

    const background = read('lion_background.js');
    assert.match(background, /Xuanyuan Twelve/);
    assert.match(background, /createLionSpirit/);
    assert.match(background, /lionSpiritStart/);
    assert.match(background, /mountMoonLetterTrigger/);
    assert.match(background, /moon-letter-trigger/);
});

test('refreshes cached visuals and uses a cinematic crescent with traced meteors', () => {
    const serviceWorker = read('sw.js');
    assert.match(serviceWorker, /our-universe-v22-resilient-opening/);
    assert.match(serviceWorker, /isCorePageAsset/);
    assert.match(serviceWorker, /self\.skipWaiting\(\)/);

    const html = read('index.html');
    assert.match(html, /presence-dot/);
    assert.doesNotMatch(html, /class="heart">❤️/);

    const background = read('lion_background.js');
    assert.match(background, /moonCore/);
    assert.match(background, /meteorsActive\.push\(m\)/);
    assert.match(background, /var dust = new THREE\.Points/);
    assert.match(background, /leo-linework-transparent\.png\?v=15/);
    assert.match(background, /leo-sickle-overlay/);
    assert.match(background, /mainExperienceEntered/);
    assert.match(background, /data-sickle-trace/);
    assert.match(background, /playOpeningMeteor/);
    assert.match(background, /smoothProgress/);
    assert.match(background, /长按月亮，收一封情书/);
    assert.doesNotMatch(background, /leo-constellation-walking-borderless/);
});

test('keeps a return path from the password gate', () => {
    const html = read('index.html');
    assert.match(html, /id="lock-back-btn"/);
    assert.match(html, /lockBackBtn\.addEventListener/);
    assert.match(html, /返回星空/);
});

test('keeps the completed lion visible while moving the entry prompt below it', () => {
    const html = read('index.html');
    assert.match(html, /bottom: 8vh/);

    const background = read('lion_background.js');
    assert.match(background, /top:4vh/);
    assert.match(background, /Keep the transparent constellation visible/);
    assert.match(background, /revealSickle/);
});

test('starts music on the first permitted gesture and refreshes moon messages', () => {
    const html = read('index.html');
    assert.match(html, /function startOpeningMusic/);
    assert.match(html, /startOpeningMusic\(\);/);
    assert.match(html, /function getMoonQuote/);
    assert.match(html, /MOON_LETTERS/);
    assert.match(html, /v1\.hitokoto\.cn/);
    assert.match(html, /data-letter-content/);

    const loveLetter = read('love_letter.js');
    assert.match(loveLetter, /window\.getMoonQuote/);
    assert.match(loveLetter, /data-letter-source/);
});

test('uses the observatory as an automatic, skippable transition', () => {
    const html = read('index.html');
    assert.match(html, /observatoryExitTimer = setTimeout\(closeConstellationObservatory, 1800\)/);
    assert.match(html, /observatoryDriftAway/);
    assert.match(html, /rotate\(\$\{angle\} 350 350\)/);
});

test('waits for a user gesture before opening the password lock', () => {
    const html = read('index.html');
    assert.match(html, /id="unlock-prompt"/);
    assert.match(html, /waitForUnlockGesture/);
    assert.match(html, /grid-template-columns:\s*1fr/);
});

test('authenticates anonymous visitors before subscribing to Firestore messages', () => {
    const html = read('index.html');
    const firebaseConfig = read('firebase-config.js');
    assert.match(html, /firebase-config\.js/);
    assert.match(firebaseConfig, /FIREBASE_CONFIG/);
    assert.match(firebaseConfig, /projectId/);
    assert.match(html, /firebase-auth-compat\.js/);
    assert.match(html, /await auth\.signInAnonymously\(\)/);
    assert.match(html, /authorId: auth\.currentUser\.uid/);
    assert.match(html, /读取留言失败/);
    assert.match(html, /还没有留言，写下第一句吧/);
});

test('keeps the opening composition when Three.js cannot load', () => {
    const html = read('index.html');
    const background = read('lion_background.js');
    assert.match(html, /id="opening-fallback"/);
    assert.match(html, /fallback-leo/);
    assert.match(html, /function showOpeningFallback/);
    assert.match(background, /window\.showOpeningFallback/);
});
