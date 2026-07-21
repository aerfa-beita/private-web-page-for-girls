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
    assert.match(serviceWorker, /CACHE_NAME = 'our-universe-v38-main-media-mp3'/);
    assert.match(serviceWorker, /scripts\/services\/runtime-config\.js\?v=1/);
    assert.match(serviceWorker, /lion_background\.js\?v=5/);
    assert.match(serviceWorker, /scripts\/opening\/cinematic-opening\.js\?v=7/);
    assert.match(serviceWorker, /scripts\/opening\/opening-flow\.js\?v=2/);
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
    assert.match(serviceWorker, /our-universe-v38-main-media-mp3/);
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

test('keeps a return path from the star-point password gate', () => {
    const html = read('index.html');
    const openingFlow = read('scripts/opening/opening-flow.js');
    assert.match(html, /id="lock-back-btn"/);
    assert.match(html, /lockBackBtn\.addEventListener/);
    assert.match(html, /回到星光里/);
    assert.match(openingFlow, /returnToCinematic/);
    assert.match(openingFlow, /UniverseCinematicOpening\.returnToPassword/);
});

test('uses a silent black-screen opening before revealing the first star', () => {
    const html = read('index.html');
    const cinematic = read('scripts/opening/cinematic-opening.js');
    assert.match(html, /id="cinematic-opening"/);
    assert.match(html, /id="cinematic-origin-star"/);
    assert.doesNotMatch(cinematic, /is-distant-star/);
    assert.doesNotMatch(html, /translate3d\(-30vw, -19vh, 0\)/);
    assert.match(cinematic, /is-origin-centered/);
    assert.match(cinematic, /function gatherCaptionIntoStar/);
    assert.match(cinematic, /later\(gatherCaptionIntoStar, 8200\)/);
    assert.match(html, /cinematic-caption__glyph/);
    assert.match(html, /captionMirrorShardA/);
    assert.match(html, /captionMirrorShardB/);
    assert.match(cinematic, /shard-x/);
    assert.match(cinematic, /later\(showInvitation, 16000\)/);
    assert.match(cinematic, /startOpeningMusic/);
});

test('starts music on the first permitted gesture and refreshes moon messages', () => {
    const html = read('index.html');
    const cinematic = read('scripts/opening/cinematic-opening.js');
    assert.match(html, /function startOpeningMusic/);
    assert.match(cinematic, /window\.startOpeningMusic\(\);/);
    assert.match(html, /MUSIC_PLAYLIST[\s\S]*有愧\(1\)\.mp3/);
    assert.match(html, /MUSIC_PLAYLIST[\s\S]*잘 알지도 못하면서\.mp3/);
    assert.doesNotMatch(html, /MUSIC_PLAYLIST[\s\S]*焦迈奇 - 我的名字\.flac/);
    assert.match(html, /function getMoonQuote/);
    assert.match(html, /MOON_LETTERS/);
    assert.match(html, /v1\.hitokoto\.cn/);
    assert.match(html, /data-letter-content/);

    const loveLetter = read('love_letter.js');
    assert.match(loveLetter, /window\.getMoonQuote/);
    assert.match(loveLetter, /data-letter-source/);
});

test('morphs the galaxy into the homepage after a correct password', () => {
    const html = read('index.html');
    const cinematic = read('scripts/opening/cinematic-opening.js');
    assert.match(html, /cinematicHomeReady/);
    assert.match(html, /function enterMainExperience\(\)/);
    assert.match(cinematic, /is-homeward/);
    assert.match(cinematic, /later\(function \(\) \{\s*elements\.root\.classList\.add\('is-complete'\)/);
});

test('uses one origin-star gesture, then a cinematic star-point password gate', () => {
    const html = read('index.html');
    const openingFlow = read('scripts/opening/opening-flow.js');
    const cinematic = read('scripts/opening/cinematic-opening.js');
    const serviceWorker = read('sw.js');
    assert.match(html, /id="cinematic-origin-star"/);
    assert.match(html, /lion_background\.js\?v=5/);
    assert.match(html, /id="pin-stars"/);
    assert.match(html, /这串数字还没有点亮星河。再试一次，月亮在等你。/);
    assert.match(html, /lion_background\.js\?v=5[\s\S]*scripts\/opening\/cinematic-opening\.js\?v=7[\s\S]*scripts\/opening\/opening-flow\.js\?v=2/);
    assert.match(openingFlow, /cinematicPasswordRequested/);
    assert.match(cinematic, /cinematicFirstLight/);
    assert.match(cinematic, /setCaption\('', false\);/);
    assert.match(cinematic, /openingRitualFirstLight/);
    assert.match(cinematic, /is-native-running/);
    assert.match(cinematic, /cinematicPasswordRequested/);
    assert.match(cinematic, /cinematicHomeReady/);
    assert.match(serviceWorker, /scripts\/opening\/cinematic-opening\.js\?v=7/);
    assert.match(html, /grid-template-columns:\s*1fr/);
});

test('authenticates anonymous visitors before subscribing to Firestore messages', () => {
    const html = read('index.html');
    const firebaseConfig = read('firebase-config.js');
    assert.match(html, /firebase-config\.js/);
    assert.match(firebaseConfig, /FIREBASE_CONFIG/);
    assert.match(firebaseConfig, /projectId/);
    assert.match(html, /firebase-auth-compat\.js/);
    assert.match(html, /await waitForMessageBoard\(auth\.signInAnonymously\(\)\)/);
    assert.match(html, /authorId: auth\.currentUser\.uid/);
    assert.match(html, /读取留言失败/);
    assert.match(html, /还没有留言，写下第一句吧/);
    assert.match(html, /MESSAGE_BOARD_TIMEOUT_MS = 12000/);
    assert.match(html, /留言加载超时，请检查网络后重试/);
    assert.match(html, /message-retry-btn/);
    assert.match(html, /stopMessageBoardSubscription/);
});

test('keeps the established Leo sequence while refining the moon composition', () => {
    const html = read('index.html');
    const lionBackground = read('lion_background.js');
    assert.match(html, /lion_background\.js\?v=5/);
    assert.match(html, /window\.initLionBackground\(\)/);
    assert.match(html, /openingRitualFirstLight[\s\S]*window\.initLionBackground\(\)/);
    assert.match(lionBackground, /function createLeoConstellation/);
    assert.match(lionBackground, /leo-linework-transparent\.png/);
    assert.match(lionBackground, /lionOverlay\.style\.opacity = String\(.035 \+ smoothProgress \* \.925\)/);
    assert.match(lionBackground, /moonGroup\.position\.set\(470, 300, -250\)/);
    assert.match(lionBackground, /moonGroup\.scale\.setScalar\(0\.68\)/);
    assert.doesNotMatch(lionBackground, /openingRitualFirstLight/);
});

test('keeps mobile browsers out of fullscreen while preserving desktop fullscreen', () => {
    const html = read('index.html');
    assert.match(html, /function requestDesktopFullscreen/);
    assert.match(html, /min-width: 900px\) and \(pointer: fine\)/);
    assert.match(html, /requestDesktopFullscreen\(\);/);
    assert.match(html, /firebaseReadyPromise\.then\(\(\) => \{\s*initOnlineStatus\(\);\s*initSecretBase\(\);/);
});

test('keeps local previews isolated from PWA caches and preserves UTF-8 offline text', () => {
    const html = read('index.html');
    const serviceWorker = read('sw.js');
    const localServer = read('serve-local.js');

    assert.match(html, /const isLocalPreview = \['127\.0\.0\.1', 'localhost'\]/);
    assert.match(html, /navigator\.serviceWorker\.getRegistrations\(\)/);
    assert.match(serviceWorker, /Content-Type': 'text\/html; charset=utf-8'/);
    assert.match(localServer, /process\.argv\[2\] \|\| process\.env\.PORT \|\| '5173'/);
    assert.match(localServer, /'Cache-Control': 'no-store'/);
});

test('initializes the image carousel only when its module is first opened', () => {
    const html = read('index.html');
    const carousel = read('image_carousel.js');

    assert.match(html, /target === 'image-carousel' && typeof window\.initImageCarousel === 'function'/);
    assert.match(html, /window\.initImageCarousel\(\);/);
    assert.match(carousel, /var isInitialized = false;/);
    assert.match(carousel, /if \(isInitialized\) return true;/);
    assert.match(carousel, /window\.initImageCarousel = initImageCarousel;/);
    assert.doesNotMatch(carousel, /DOMContentLoaded', initImageCarousel/);
});

test('degrades optional Firebase and weather services without invalid requests', () => {
    const html = read('index.html');
    const runtimeConfig = read('scripts/services/runtime-config.js');

    assert.match(html, /scripts\/services\/runtime-config\.js\?v=1/);
    assert.match(html, /const HAS_FIREBASE_CONFIG = Boolean\(RUNTIME_CONFIG\.hasFirebase\);/);
    assert.match(html, /if \(!HAS_FIREBASE_CONFIG\) \{/);
    assert.match(html, /留言服务尚未配置/);
    assert.match(html, /if \(!HAS_WEATHER_API_KEY\) \{/);
    assert.match(html, /天气服务尚未配置/);
    assert.match(html, /firebaseReadyPromise\.then\(\(\) => \{\s*initOnlineStatus\(\);\s*initSecretBase\(\);/);
    assert.match(runtimeConfig, /hasRequiredFirebaseFields/);
    assert.match(runtimeConfig, /hasWeather: Boolean\(weatherApiKey\)/);
});

test('cleans up the birthday petal animation and resize listener when closed', () => {
    const html = read('index.html');

    assert.match(html, /let petalResizeHandler = null;/);
    assert.match(html, /function closeBirthdayModal\(\)/);
    assert.match(html, /window\.removeEventListener\('resize', petalResizeHandler\)/);
    assert.match(html, /petalResizeHandler = null;/);
});
