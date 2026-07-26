const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('registers the memory archive and love-letter modules', () => {
    const html = read('index.html');
    assert.match(html, /image_carousel\.js\?v=3/);
    assert.match(html, /love_letter\.js\?v=2/);
    assert.match(html, /id="memory-archive"/);
    assert.match(html, /id="module-memory-archive"/);
    assert.doesNotMatch(html, /memory_timeline\.js/);
    assert.match(html, /id="love-letter-modal"/);
});

test('replaces the sixth photo placeholder with a real asset', () => {
    const html = read('index.html');
    assert.doesNotMatch(html, /待替换_图片6\.jpg/);
    assert.match(html, /IMG_20260228\/IMG_\d+_\d+\.jpg/);
});

test('uses a versioned cache for all application scripts', () => {
    const serviceWorker = read('sw.js');
    assert.match(serviceWorker, /our-universe-v69-yuhan-planet-copy/);
    assert.match(serviceWorker, /scripts\/services\/runtime-config\.js\?v=1/);
    assert.match(serviceWorker, /lion_background\.js\?v=5/);
    assert.match(serviceWorker, /scripts\/opening\/cinematic-opening\.js\?v=8/);
    assert.match(serviceWorker, /scripts\/opening\/opening-flow\.js\?v=2/);
    assert.match(serviceWorker, /image_carousel\.js\?v=4/);
    assert.match(serviceWorker, /love_letter\.js\?v=2/);
    assert.match(serviceWorker, /components\/cosmic-envelope\/envelope\.css\?v=8/);
    assert.match(serviceWorker, /components\/cosmic-envelope\/envelope\.js\?v=8/);
    assert.match(serviceWorker, /scripts\/ui\/presence-heart\.js\?v=2/);
    assert.match(serviceWorker, /scripts\/ui\/earth-atlas\.js\?v=13/);
    assert.match(serviceWorker, /scripts\/ui\/stardust-trail\.js\?v=3/);
    assert.match(serviceWorker, /assets\/backgrounds\/celestial-atlas-cloud-drift\.png\?v=2/);
    assert.match(serviceWorker, /assets\/planets\/first-light-v2\.png/);
    assert.match(serviceWorker, /assets\/planets\/dream-realm-moon-v4\.png/);
    assert.match(serviceWorker, /assets\/planets\/heart-trace-v2\.png/);
    assert.match(serviceWorker, /assets\/planets\/eternal-pact-v2\.png/);
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
    assert.match(serviceWorker, /our-universe-v69-yuhan-planet-copy/);
    assert.match(serviceWorker, /isCorePageAsset/);
    assert.match(serviceWorker, /self\.skipWaiting\(\)/);

    const html = read('index.html');
    assert.match(html, /class="presence-heart(?: is-solo)?"/);
    assert.match(html, /scripts\/ui\/presence-heart\.js\?v=2/);
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
    assert.match(cinematic, /function startIntroTimeline/);
    assert.match(cinematic, /document\.visibilityState !== 'visible'/);
    assert.doesNotMatch(cinematic, /gatherCaptionIntoStar/);
    assert.doesNotMatch(cinematic, /fragmentable/);
    assert.match(cinematic, /later\(showInvitation, 9400\)/);
    assert.match(cinematic, /startOpeningMusic/);
});

test('starts music on the first permitted gesture and refreshes moon messages', () => {
    const html = read('index.html');
    assert.match(html, /background-image:\s*url\('assets\/backgrounds\/celestial-atlas-cloud-drift\.png\?v=2'\)/);
    assert.match(html, /rel="preload" as="image" href="assets\/backgrounds\/celestial-atlas-cloud-drift\.png\?v=2"/);
    const cinematic = read('scripts/opening/cinematic-opening.js');
    assert.match(html, /function startOpeningMusic/);
    assert.match(cinematic, /emit\('cinematicFirstLight'\)/);
    assert.match(html, /window\.addEventListener\('cinematicFirstLight', startOpeningMusic, \{ once: true \}\)/);
    assert.match(html, /const OPENING_TRACK = "Music\/如果这份爱 - 罗森涛\.mp3"/);
    assert.match(html, /function createRandomQueue\(excludeTrack\)/);
    assert.match(html, /audio\.dataset\.openingStarted === 'true'/);
    assert.match(html, /开场曲固定播放；之后的下一首永远从其余曲目中随机选择。/);
    assert.match(html, /MUSIC_PLAYLIST[\s\S]*有愧 - LBI利比（时柏尘）\.mp3/);
    assert.match(html, /MUSIC_PLAYLIST[\s\S]*잘 알지도 못하면서 - 림킴/);
    assert.doesNotMatch(html, /MUSIC_PLAYLIST[\s\S]*焦迈奇 - 我的名字\.flac/);
    assert.match(html, /function getMoonQuote/);
    assert.match(html, /function getMoonLetterPool/);
    assert.match(html, /return configured\.length \? configured : LOVE_QUOTES/);
    assert.match(html, /没有专属情书时，始终回退到站内预设文案/);
    assert.match(html, /data-letter-content/);

    const loveLetter = read('love_letter.js');
    assert.match(loveLetter, /window\.getMoonQuote/);
    assert.match(loveLetter, /data-letter-source/);
});

test('keeps the moon letter path ordered from a long press to an opened paper', () => {
    const html = read('index.html');
    const background = read('lion_background.js');
    const loveLetter = read('love_letter.js');
    const envelope = read('components/cosmic-envelope/envelope.js');
    const envelopeMarkup = read('components/cosmic-envelope/envelope.html');

    assert.match(background, /setTimeout\(function\(\) \{[\s\S]*triggerLoveLetter\(\);[\s\S]*\}, 1200\)/);
    assert.match(background, /new CustomEvent\('loveLetterRequested'\)/);
    assert.match(html, /data-accept-letter>收下这句话/);
    assert.doesNotMatch(html, /data-close-letter/);
    assert.match(loveLetter, /window\.addEventListener\('loveLetterRequested', openLoveLetter\)/);
    assert.match(loveLetter, /function acceptLoveLetter\(\)/);
    assert.match(loveLetter, /function dismissLoveLetter\(\)/);
    assert.match(loveLetter, /if \(event\.target === modal\) dismissLoveLetter\(\);/);
    assert.match(loveLetter, /cosmicEnvelopeReady/);
    assert.match(loveLetter, /window\.showEnvelope\(\);/);
    assert.match(html, /<button class="envelope-seal" id="envelopeSeal" type="button" aria-label="打开这封信">/);
    assert.match(envelopeMarkup, /<button class="envelope-seal" id="envelopeSeal" type="button" aria-label="打开这封信">/);
    assert.match(envelope, /var typingStartTimer = null;/);
    assert.match(envelope, /window\.dispatchEvent\(new Event\('cosmicEnvelopeReady'\)\)/);
    assert.match(envelope, /typingStartTimer = setTimeout/);
    assert.match(envelope, /if \(typingStartTimer\) \{ clearTimeout\(typingStartTimer\); typingStartTimer = null; \}/);
    assert.doesNotMatch(envelope, /contentEl\.innerHTML/);
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
    assert.match(html, /lion_background\.js\?v=5[\s\S]*scripts\/opening\/cinematic-opening\.js\?v=8[\s\S]*scripts\/opening\/opening-flow\.js\?v=2/);
    assert.match(openingFlow, /cinematicPasswordRequested/);
    assert.match(cinematic, /cinematicFirstLight/);
    assert.match(cinematic, /setCaption\('', false\);/);
    assert.match(cinematic, /openingRitualFirstLight/);
    assert.match(cinematic, /is-native-running/);
    assert.match(cinematic, /cinematicPasswordRequested/);
    assert.match(cinematic, /cinematicHomeReady/);
    assert.match(serviceWorker, /scripts\/opening\/cinematic-opening\.js\?v=8/);
    assert.match(html, /grid-template-columns:\s*1fr/);
});

test('keeps the public message board graceful while preserving its Firebase test path', () => {
    const html = read('index.html');
    const firebaseConfig = read('firebase-config.js');
    assert.match(html, /firebase-config\.js/);
    assert.match(firebaseConfig, /FIREBASE_CONFIG/);
    assert.match(firebaseConfig, /projectId/);
    assert.match(html, /firebase-auth-compat\.js/);
    assert.match(html, /waitForMessageBoard\(auth\.signInAnonymously\(\)\)/);
    assert.match(html, /authorId: auth\.currentUser\.uid/);
    assert.match(html, /读取留言失败/);
    assert.match(html, /还没有留言，写下第一句吧/);
    assert.match(html, /MESSAGE_BOARD_TIMEOUT_MS = 12000/);
    assert.match(html, /留言加载超时，请检查网络后重试/);
    assert.match(html, /message-retry-btn/);
    assert.match(html, /stopMessageBoardSubscription/);
    assert.match(html, /isLocalMessageTestHost/);
    assert.match(html, /ENABLE_MESSAGE_TESTING = isLocalMessageTestHost && rawConfig\.ENABLE_MESSAGE_TESTING === true/);
    assert.match(html, /id="message-testing-panel" hidden/);
    assert.match(html, /function initMemoryArchive\(\)/);
    assert.match(html, /messageWall\.hidden = !HAS_FIREBASE_CONFIG/);
    assert.match(html, /id="module-memory-archive"/);
    assert.match(html, /function hidePublicMessageBoard\(\)/);
    assert.match(html, /MESSAGE_PAGE_SIZE = 12/);
    assert.match(html, /appendOlderMessagesButton/);
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

test('reloads an existing page only after a new service worker takes control', () => {
    const html = read('index.html');

    assert.match(html, /const hadServiceWorkerController = Boolean\(navigator\.serviceWorker\.controller\)/);
    assert.match(html, /navigator\.serviceWorker\.addEventListener\('controllerchange'/);
    assert.match(html, /if \(!hadServiceWorkerController \|\| reloadedForNewController\) return/);
    assert.match(html, /const activateNewWorker = \(worker\)/);
    assert.match(html, /等待接管后刷新/);
});

test('initializes the memory archive only when its own module is opened', () => {
    const html = read('index.html');
    const carousel = read('image_carousel.js');

    assert.match(html, /id="module-memory-archive"/);
    assert.match(html, /if \(target === 'memory-archive'\) initMemoryArchive\(\);/);
    assert.match(html, /function initMemoryArchive\(\)/);
    assert.match(html, /window\.initImageCarousel\(\);/);
    assert.match(carousel, /var isInitialized = false;/);
    assert.match(carousel, /if \(isInitialized\) return true;/);
    assert.match(carousel, /window\.initImageCarousel = initImageCarousel;/);
    assert.match(carousel, /document\.getElementById\('memory-archive'\)/);
    assert.doesNotMatch(carousel, /DOMContentLoaded', initImageCarousel/);
});

test('loads all 93 remembered photos from Vercel static assets without depending on Firebase', () => {
    const carousel = read('image_carousel.js');
    const firestoreRules = read('firebase/firestore.rules');
    const storageRules = read('firebase/storage.rules');
    const migration = read('scripts/media/migrate-archive-to-firebase.js');

    assert.match(carousel, /function getFallbackImages\(\)/);
    assert.match(carousel, /window\.UNIVERSE_PHOTOS/);
    assert.match(carousel, /var STATIC_ARCHIVE_FILES = \[/);
    assert.match(carousel, /function getStaticArchiveImages\(\)/);
    assert.match(carousel, /return staticImages\.length \? staticImages/);
    const staticArchive = carousel.match(/var STATIC_ARCHIVE_FILES = \[([\s\S]*?)\n    \];/);
    assert.ok(staticArchive);
    assert.equal((staticArchive[1].match(/\.jpg/g) || []).length, 93);
    assert.match(carousel, /db\.collection\('archivePhotos'\)/);
    assert.match(carousel, /orderBy\('sortOrder', 'asc'\)/);
    assert.doesNotMatch(carousel, /var ALL_IMAGES/);
    assert.match(firestoreRules, /match \/archivePhotos\/\{photoId\}/);
    assert.match(storageRules, /match \/archive\/\{fileName\}/);
    assert.match(migration, /--execute/);
    assert.match(migration, /firebaseStorageDownloadTokens/);
});

test('returns the CSS background and uses a flowing milky-way with planet secrets after unlock', () => {
    const html = read('index.html');
    const earthAtlas = read('scripts/ui/earth-atlas.js');
    const lionBackground = read('lion_background.js');

    assert.match(html, /id="module-earth-atlas"/);
    assert.match(html, /module-earth-atlas"\><\/div\>/);
    assert.match(html, /scripts\/ui\/earth-atlas\.js\?v=13/);
    assert.match(html, /celestial-atlas-cloud-drift\.png\?v=2/);
    assert.match(html, /starfield\.style\.display = ''/);
    assert.match(lionBackground, /restoredStarfield\.style\.display = ''/);
    assert.match(html, /window\.switchModule = switchModule/);
    assert.match(earthAtlas, /class="space"/);
    assert.match(earthAtlas, /id="stars"/);
    assert.match(earthAtlas, /galaxy-flow-canvas/);
    assert.match(earthAtlas, /function buildStars/);
    assert.match(earthAtlas, /starCount = window\.matchMedia\('\(max-width: 700px\)'\)\.matches \? 220 : 450/);
    assert.match(earthAtlas, /star\.y -= star\.speed/);
    assert.match(earthAtlas, /rgba\(255,255,255,/);
    assert.match(earthAtlas, /function buildGalaxyDust/);
    assert.match(earthAtlas, /dustCount = window\.matchMedia\('\(max-width: 700px\)'\)\.matches \? 360 : 960/);
    assert.match(earthAtlas, /dust\.x \+= dust\.speed/);
    assert.match(earthAtlas, /GALAXY_PLANETS/);
    assert.match(earthAtlas, /【小花先生改行星文案与位置】/);
    assert.match(earthAtlas, /已经朝向钰涵大人。/);
    assert.doesNotMatch(earthAtlas, /已经朝向小花先生。/);
    assert.match(earthAtlas, /planet-card/);
    assert.match(earthAtlas, /planet-light/);
    assert.match(earthAtlas, /planet-asset/);
    assert.match(earthAtlas, /assets\/planets\/first-light-v2\.png/);
    assert.match(earthAtlas, /assets\/planets\/dream-realm-moon-v4\.png/);
    assert.match(earthAtlas, /assets\/planets\/heart-trace-v2\.png/);
    assert.match(earthAtlas, /assets\/planets\/eternal-pact-v2\.png/);
    assert.match(earthAtlas, /planet-light/);
    assert.match(earthAtlas, /orbit/);
    assert.match(earthAtlas, /planet-info/);
    assert.match(earthAtlas, /planet\.cardClass/);
    assert.match(earthAtlas, /星辰手记/);
    assert.match(earthAtlas, /object-fit: contain/);
    assert.match(earthAtlas, /planet-card:hover \.planet-asset/);
    assert.match(earthAtlas, /planet-four \.orbit \{ width: 148%/);
    assert.match(earthAtlas, /function explodeAtViewport/);
    assert.match(earthAtlas, /planetCards\.forEach/);
    assert.match(earthAtlas, /window\.addEventListener\('pointermove', moveSpace/);
    assert.match(earthAtlas, /scale\(1\.03\)/);
    assert.match(earthAtlas, /#module-earth-atlas\.module-page \{ width: 100%; max-width: none/);
    assert.match(earthAtlas, /earth-drawer-tab/);
});

test('creates a non-blocking gold and silver stardust trail after unlock', () => {
    const html = read('index.html');
    const stardustTrail = read('scripts/ui/stardust-trail.js');

    assert.match(html, /id="stardust-trail-canvas"/);
    assert.match(html, /scripts\/ui\/stardust-trail\.js\?v=3/);
    assert.match(html, /#stardust-trail-canvas[\s\S]*?pointer-events: none/);
    assert.match(stardustTrail, /PARTICLE_LIFETIME_MIN = 3200/);
    assert.match(stardustTrail, /PARTICLE_LIFETIME_MAX = 5000/);
    assert.match(stardustTrail, /pointermove/);
    assert.match(stardustTrail, /getCoalescedEvents/);
    assert.match(stardustTrail, /PARTICLE_LIMIT/);
    assert.match(stardustTrail, /SAMPLE_DISTANCE = 42/);
    assert.match(stardustTrail, /SAMPLE_INTERVAL = 80/);
    assert.match(stardustTrail, /PARTICLE_LIMIT = window\.matchMedia\('\(max-width: 700px\)'\)\.matches \? 52 : 82/);
    assert.match(stardustTrail, /samplePoint\(points\[points\.length - 1\]\)/);
    assert.match(stardustTrail, /appMain\.classList\.contains\('active'\)/);
});

test('degrades optional Firebase and weather services without invalid requests', () => {
    const html = read('index.html');
    const runtimeConfig = read('scripts/services/runtime-config.js');

    assert.match(html, /scripts\/services\/runtime-config\.js\?v=1/);
    assert.match(html, /function refreshRuntimeConfig\(\)/);
    assert.match(html, /let HAS_FIREBASE_CONFIG = false;/);
    assert.match(html, /let ENABLE_MESSAGE_TESTING = false;/);
    assert.match(html, /if \(HAS_FIREBASE_CONFIG\) initMessageBoard\(\);/);
    assert.match(html, /if \(!HAS_WEATHER_API_KEY\) \{/);
    assert.match(html, /天空暂时留白/);
    assert.match(html, /firebaseReadyPromise\.then\(\(\) => \{\s*initOnlineStatus\(\);\s*initSecretBase\(\);/);
    assert.match(runtimeConfig, /hasRequiredFirebaseFields/);
    assert.match(runtimeConfig, /hasWeather: Boolean\(weatherApiKey\)/);
});

test('keeps the memory projector upload copy readable before its service is ready', () => {
    const carousel = read('image_carousel.js');
    assert.match(carousel, /把这一刻留在放映机/);
    assert.match(carousel, /\.carousel-upload-button:disabled[\s\S]*?opacity: 1;/);
});

test('uses the particle heart only after a verified second active visitor', () => {
    const html = read('index.html');
    const presenceHeart = read('scripts/ui/presence-heart.js');

    assert.match(html, /const together = activeVisitors\.length >= 2;/);
    assert.match(html, /window\.renderPresenceHeart\(together\)/);
    assert.match(html, /window\.hidePresenceHeart\(\)/);
    assert.match(presenceHeart, /presence-heart/);
    assert.match(presenceHeart, /此刻，心跳同频/);
    assert.match(presenceHeart, /另一颗星光，正在路上/);
    assert.match(presenceHeart, /panel\.classList\.toggle\('is-together'/);
    assert.match(html, /presence-heart-left/);
    assert.match(html, /presence-heart-right/);
    assert.match(html, /presence-pulse-left/);
    assert.match(html, /presence-pulse-right/);
    assert.match(html, /presence-heartbeat-signal/);
    assert.match(html, /@keyframes heartbeatTravel/);
    assert.match(html, /@keyframes heartReceive/);
    assert.match(html, /weather-illustration/);
    assert.match(html, /WEATHER_CITY_NOTES/);
});

test('uses a fixed six-photo polaroid preview and a separate full archive', () => {
    const html = read('index.html');

    assert.match(html, /photos\.slice\(0, 6\)/);
    assert.match(html, /className = 'photo-card polaroid-card'/);
    assert.match(html, /#module-memory-archive/);
    assert.match(html, /grid-template-columns:\s*minmax\(0, 1fr\)/);
    assert.match(html, /border: 22px solid #0a1d36/);
    assert.match(html, /grid-template-columns: 156px minmax\(210px, \.85fr\) minmax\(0, 1\.45fr\)/);
    assert.match(html, /className = 'photo-copy'/);
    assert.doesNotMatch(html, /id="memory-archive-open"/);
    assert.doesNotMatch(html, /autoCarouselTimer/);
    assert.doesNotMatch(html, /data-module="image-carousel"/);
});

test('keeps Firebase presence alive without counting browser tabs twice', () => {
    const html = read('index.html');

    assert.match(html, /const HEARTBEAT_INTERVAL_MS = 45 \* 1000;/);
    assert.match(html, /firebase\.database\.ServerValue\.TIMESTAMP/);
    assert.match(html, /statusRef\.child\(browserId\)\.child\(tabId\)/);
    assert.match(html, /Object\.values\(visitor\)\.some/);
    assert.match(html, /myRef\.onDisconnect\(\)\.remove\(\)/);
    assert.doesNotMatch(html, /statusRef\.update\(updates\)/);
});

test('loads remote configuration without blocking the opening and excludes it from SW caches', () => {
    const html = read('index.html');
    const serviceWorker = read('sw.js');
    const apiConfig = read('api/config.js');
    const gitignore = read('.gitignore');

    assert.match(html, /fetch\('\/api\/config'/);
    assert.match(html, /universeRemoteConfigReady/);
    assert.doesNotMatch(html, /xhr\.open\('GET', '\/api\/config', false\)/);
    assert.doesNotMatch(html, /remote\.SECRET_CODE/);
    assert.match(serviceWorker, /requestUrl\.pathname\.startsWith\('\/api\/'\)/);
    assert.doesNotMatch(apiConfig, /SECRET_CODE/);
    assert.match(gitignore, /!api\/config\.js/);
    assert.match(gitignore, /node_modules\//);
});

test('times out Firebase SDK and weather requests instead of leaving loading states forever', () => {
    const html = read('index.html');

    assert.match(html, /const FIREBASE_SDK_TIMEOUT_MS = 12000;/);
    assert.match(html, /function fetchWithTimeout/);
    assert.match(html, /const WEATHER_REQUEST_TIMEOUT_MS = 8000;/);
    assert.match(html, /fetchWithTimeout\(url, \{ cache: 'no-store' \}, WEATHER_REQUEST_TIMEOUT_MS\)/);
    assert.match(html, /firebaseSdkReady/);
});

test('cleans up the birthday petal animation and resize listener when closed', () => {
    const html = read('index.html');

    assert.match(html, /let petalResizeHandler = null;/);
    assert.match(html, /function closeBirthdayModal\(\)/);
    assert.match(html, /window\.removeEventListener\('resize', petalResizeHandler\)/);
    assert.match(html, /petalResizeHandler = null;/);
});
