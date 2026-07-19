(function(){
    /* =================================================================
       lion_background.js V3 — 私人狮子座开场系统
       包含：克制深空 / 固定狮子座 / 月亮 / 隐藏情书入口
       ================================================================= */

    // 是否为移动端（降低粒子数）
    var isMobile = window.innerWidth < 600;
    var INTRO_TIMELINE = {
        meteorStart: 0.12,
        starsEnd: 2.45,
        galaxyStart: 0.9,
        galaxyEnd: 3.25,
        leoStart: 0.85,
        leoEnd: 3.2,
        lionSpiritStart: 3.25,
        lionSpiritEnd: 7.25,
        titleStart: 5.1,
        titleEnd: 7.2,
        leoFadeStart: 7.35,
        finish: 9.4
    };

    // 动态加载 Three.js
    function loadThree(callback) {
        if (window.THREE) { callback(); return; }
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = callback;
        script.onerror = function(){
            console.warn('Three.js CDN 加载失败，回落原生星空');
            var sf = document.getElementById('starfield');
            if (sf) sf.style.display = '';
            if (typeof window.showOpeningFallback === 'function') window.showOpeningFallback();
            window.dispatchEvent(new Event('spaceReady'));
        };
        document.head.appendChild(script);
    }

    function createScene() {
        var scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x080817, 0.00006);
        var camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 4000);
        camera.position.set(0, 20, 1100);
        camera.lookAt(0, 0, 0);
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('lion-background').appendChild(renderer.domElement);
        return { scene: scene, camera: camera, renderer: renderer };
    }

    /* =================================================================
       1. 三层星空系统
       ================================================================= */
    function createStarLayers(scene) {
        var layers = [];
        var count1 = isMobile ? 1500 : 3000;
        layers.push(createStarGroup(scene, count1, 0.4, 2.0, 500, 1200, false));
        var count2 = isMobile ? 250 : 500;
        layers.push(createStarGroup(scene, count2, 0.8, 3.5, 400, 900, true));
        var count3 = isMobile ? 25 : 50;
        layers.push(createSpecialStars(scene, count3));
        return layers;
    }

    function createStarGroup(scene, count, opacity, size, innerR, outerR, bright) {
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
            var radius = innerR + Math.random() * (outerR - innerR);
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3]     = Math.sin(phi) * Math.cos(theta) * radius;
            positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.35;
            positions[i * 3 + 2] = Math.cos(phi) * radius;
            var rnd = Math.random();
            if (bright) {
                colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9 + rnd * 0.1; colors[i * 3 + 2] = 0.7 + rnd * 0.3;
            } else {
                if (rnd < 0.7) { colors[i * 3]=0.95; colors[i * 3 + 1]=0.95; colors[i * 3 + 2]=1.0; }
                else if (rnd < 0.9) { colors[i * 3]=0.7; colors[i * 3 + 1]=0.8; colors[i * 3 + 2]=1.0; }
                else { colors[i * 3]=1.0; colors[i * 3 + 1]=0.9; colors[i * 3 + 2]=0.75; }
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        var material = new THREE.PointsMaterial({
            size: size, vertexColors: true,
            blending: THREE.AdditiveBlending, depthWrite: false,
            transparent: true, opacity: 0  // 初始不可见，由开场动画控制
        });
        material.userDataTarget = opacity;
        var points = new THREE.Points(geometry, material);
        points.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.00004,
            rotSpeedY: (Math.random() - 0.5) * 0.00006
        };
        scene.add(points);
        return points;
    }

    function createSpecialStars(scene, count) {
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        var leoCenter = { x: -20, y: 0, z: 0 };
        var spread = 250;
        for (var i = 0; i < count; i++) {
            positions[i * 3]     = leoCenter.x + (Math.random() - 0.5) * spread * 2;
            positions[i * 3 + 1] = leoCenter.y + (Math.random() - 0.5) * spread;
            positions[i * 3 + 2] = leoCenter.z + (Math.random() - 0.5) * spread * 0.6;
            colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; colors[i * 3 + 2] = 0.5 + Math.random() * 0.3;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        var material = new THREE.PointsMaterial({
            size: 4.5, vertexColors: true,
            blending: THREE.AdditiveBlending, depthWrite: false,
            transparent: true, opacity: 0
        });
        material.userDataTarget = 0.85;
        var points = new THREE.Points(geometry, material);
        points.name = 'specialStars';
        scene.add(points);
        return points;
    }

    /* =================================================================
       2. 银河旋臂
       ================================================================= */
    function createGalaxy(scene) {
        var count = isMobile ? 2000 : 8000;
        var arms = 4;
        var spiralTight = 5.5;
        var coreRadius = 60;
        var armSpread = 0.45;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
            var r, theta;
            if (Math.random() < 0.15) {
                r = Math.random() * coreRadius;
                theta = Math.random() * Math.PI * 2;
            } else {
                r = coreRadius + Math.random() * 500;
                var armIndex = Math.floor(Math.random() * arms);
                var baseAngle = (armIndex / arms) * Math.PI * 2;
                theta = r * (0.008 + Math.random() * 0.004) * spiralTight + baseAngle;
                theta += (Math.random() - 0.5) * armSpread;
                r += (Math.random() - 0.5) * 40;
            }
            var x = Math.cos(theta) * r;
            var z = Math.sin(theta) * r;
            var y = (Math.random() - 0.5) * 30 * (1 - Math.min(r / 500, 1));
            positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
            var dist = Math.sqrt(x*x + z*z) / 500;
            var t = Math.min(dist, 1);
            colors[i * 3] = 0.6 + t * 0.2;
            colors[i * 3 + 1] = 0.5 + t * 0.15;
            colors[i * 3 + 2] = 0.85 + (1-t) * 0.15;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        var material = new THREE.PointsMaterial({
            size: isMobile ? 3.0 : 1.8, vertexColors: true,
            blending: THREE.AdditiveBlending, depthWrite: false,
            transparent: true, opacity: 0
        });
        var galaxy = new THREE.Points(geometry, material);
        galaxy.name = 'galaxy';
        scene.add(galaxy);
        return galaxy;
    }

    /* =================================================================
       3. 狮子座（呼吸发光 + 光晕）
       ================================================================= */
    var leoGroup = null;

    function createLionSpirit(scene) {
        var spirit = new THREE.Group();
        spirit.name = 'lionSpirit';
        spirit.userData = { parts: [] };
        spirit.position.set(-10, 8, 20);
        spirit.scale.setScalar(isMobile ? 0.82 : 1.12);

        function addLine(points, opacity) {
            var geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            var material = new THREE.LineBasicMaterial({
                color: 0xD8B36A, transparent: true, opacity: 0,
                blending: THREE.AdditiveBlending, depthWrite: false
            });
            var line = new THREE.Line(geometry, material);
            line.userData.baseOpacity = opacity;
            spirit.add(line);
            spirit.userData.parts.push(line);
        }

        // Native lion silhouette: all strokes share the WebGL sky instead of sitting on a separate image background.
        addLine([-196,28,0, -228,70,0, -230,112,0, -208,140,0, -178,126,0, -188,96,0, -166,72,0], 0.32);
        addLine([-166,72,0, -116,96,0, -52,100,0, 6,90,0, 58,70,0, 94,42,0, 110,4,0], 0.58);
        addLine([110,4,0, 128,-22,0, 148,-12,0, 164,16,0, 178,48,0, 170,74,0, 150,88,0, 136,112,0], 0.64);
        addLine([112,4,0, 104,-32,0, 122,-44,0, 140,-22,0], 0.42);
        addLine([132,28,0, 148,30,0, 158,24,0], 0.82);
        addLine([150,88,0, 124,110,0, 102,142,0, 92,184,0, 74,216,0, 48,216,0, 44,164,0, 54,124,0], 0.56);
        addLine([54,124,0, 10,116,0, -40,122,0, -78,144,0, -84,198,0, -106,220,0, -132,220,0, -136,166,0, -128,126,0], 0.54);
        addLine([-128,126,0, -158,114,0, -184,134,0, -192,194,0, -214,220,0, -240,220,0, -238,164,0, -220,112,0, -196,28,0], 0.48);
        addLine([98,14,0, 72,-12,0, 58,-48,0, 70,-84,0, 98,-110,0, 118,-142,0], 0.34);
        addLine([106,-2,0, 84,-28,0, 74,-62,0, 82,-96,0], 0.28);
        addLine([86,118,0, 118,106,0, 132,84,0, 120,72,0, 100,82,0], 0.32);

        scene.add(spirit);
        return spirit;
    }

    function createLeoConstellation(scene) {
        leoGroup = new THREE.Group();
        leoGroup.name = 'leoConstellation';
        leoGroup.userData = { targetOpacity: 0, starPoints: [], haloPoints: [], linePoints: [] };
        leoGroup.position.set(-10, 8, 20);
        leoGroup.scale.setScalar(isMobile ? 0.78 : 1.08);

        // Six sickle stars (including Xuanyuan Twelve / Gamma Leonis) appear first; the rest completes the lion.
        var starData = [
            { name:'Rasalas', pos:[  92, 108, 0], mag:3.8, color:0xD8B36A, phase:'sickle' },
            { name:'Adhafera', pos:[ 114, 70, 0], mag:3.4, color:0xD8B36A, phase:'sickle' },
            { name:'Xuanyuan Twelve', pos:[ 126, 28, 0], mag:2.0, color:0xF1C97A, phase:'sickle' },
            { name:'Regulus', pos:[ 110, -16, 0], mag:1.4, color:0xFFF1C9, phase:'sickle' },
            { name:'Eta Leonis', pos:[ 80, -56, 0], mag:3.5, color:0xD8B36A, phase:'sickle' },
            { name:'Algenubi', pos:[ 54, -88, 0], mag:3.0, color:0xD8B36A, phase:'sickle' },
            { name:'Zosma', pos:[ 12, 90, 0], mag:2.6, color:0xD8B36A, phase:'body' },
            { name:'Chertan', pos:[-72, 102, 0], mag:3.3, color:0xD8B36A, phase:'body' },
            { name:'Denebola', pos:[-166, 72, 0], mag:2.1, color:0xF1C97A, phase:'body' },
            { name:'Coxa', pos:[-128, 126, 0], mag:3.8, color:0xD8B36A, phase:'body' },
            { name:'Theta Leonis', pos:[-84, 198, 0], mag:3.5, color:0xD8B36A, phase:'body' },
            { name:'Iota Leonis', pos:[ 54, 124, 0], mag:3.6, color:0xD8B36A, phase:'body' }
        ];

        starData.forEach(function(s){
            var size = (6.5 - s.mag) * 3.1;
            var g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.Float32BufferAttribute(s.pos, 3));
            var m = new THREE.PointsMaterial({
                color: s.color, size: size,
                blending: THREE.AdditiveBlending, depthWrite: false,
                transparent: true, opacity: 0
            });
            var pt = new THREE.Points(g, m);
            leoGroup.add(pt);
            leoGroup.userData.starPoints.push({ mesh: pt, baseSize: size, phase: s.phase });

            var hg = new THREE.BufferGeometry();
            hg.setAttribute('position', new THREE.Float32BufferAttribute(s.pos, 3));
            var hm = new THREE.PointsMaterial({
                color: s.color, size: size * 2.25,
                blending: THREE.AdditiveBlending, depthWrite: false,
                transparent: true, opacity: 0
            });
            var halo = new THREE.Points(hg, hm);
            leoGroup.add(halo);
            leoGroup.userData.haloPoints.push({ mesh: halo, baseSize: size * 2.25, phase: s.phase });
        });

        var connections = [
            { pair:[0,1], phase:'sickle' }, { pair:[1,2], phase:'sickle' }, { pair:[2,3], phase:'sickle' },
            { pair:[3,4], phase:'sickle' }, { pair:[4,5], phase:'sickle' },
            { pair:[0,6], phase:'body' }, { pair:[6,7], phase:'body' }, { pair:[7,8], phase:'body' },
            { pair:[7,9], phase:'body' }, { pair:[9,10], phase:'body' }, { pair:[6,11], phase:'body' }, { pair:[11,3], phase:'body' }
        ];
        connections.forEach(function(connection){
            var pair = connection.pair;
            var a = starData[pair[0]].pos;
            var b = starData[pair[1]].pos;
            var lg = new THREE.BufferGeometry();
            lg.setAttribute('position', new THREE.Float32BufferAttribute([a[0],a[1],a[2], b[0],b[1],b[2]], 3));
            var lm = new THREE.LineBasicMaterial({
                color: 0xD8B36A, transparent: true, opacity: 0,
                blending: THREE.AdditiveBlending, depthWrite: false
            });
            var line = new THREE.Line(lg, lm);
            line.userData.phase = connection.phase;
            leoGroup.add(line);
            leoGroup.userData.linePoints.push(line);
        });

        scene.add(leoGroup);
        return leoGroup;
    }

    /* =================================================================
       4. 月亮
       ================================================================= */
    function createMoon(scene) {
        var moonGroup = new THREE.Group();
        moonGroup.name = 'moon';
        moonGroup.position.set(320, 240, -200);

        var moonGeo = new THREE.SphereGeometry(28, 32, 32);
        var moonMat = new THREE.MeshBasicMaterial({ color: 0xe2ba68, transparent: true, opacity: 0, depthWrite: false });
        var moonCore = new THREE.Mesh(moonGeo, moonMat);
        moonGroup.add(moonCore);

        // Cover part of the disc to make a warm crescent instead of a generic white glowing ball.
        var shadowGeo = new THREE.SphereGeometry(27, 32, 32);
        var shadowMat = new THREE.MeshBasicMaterial({ color: 0x050510, transparent: true, opacity: 0, depthWrite: false });
        var shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.position.set(-12, 4, 8);
        moonGroup.add(shadow);

        var h1g = new THREE.SphereGeometry(38, 32, 32);
        var h1m = new THREE.MeshBasicMaterial({ color: 0xe2ba68, transparent: true, opacity: 0, depthWrite: false });
        moonGroup.add(new THREE.Mesh(h1g, h1m));

        var h2g = new THREE.SphereGeometry(52, 32, 32);
        var h2m = new THREE.MeshBasicMaterial({ color: 0x9c7137, transparent: true, opacity: 0, depthWrite: false });
        moonGroup.add(new THREE.Mesh(h2g, h2m));

        moonGroup.userData = { targetOpacity: 0, core: moonCore, shadow: shadow };
        scene.add(moonGroup);
        return moonGroup;
    }

    /* =================================================================
       5. 流星系统（对象池）
       ================================================================= */
    var MAX_METEORS = isMobile ? 10 : 20;
    var meteorPool = [];
    var meteorsActive = [];

    function initMeteorPool(scene) {
        for (var i = 0; i < MAX_METEORS; i++) {
            var meteor = new THREE.Group();
            var tailGeo = new THREE.BufferGeometry();
            tailGeo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0, 0,0,0], 3));
            var tailMat = new THREE.LineBasicMaterial({
                color: 0xd8b36a, transparent: true, opacity: 0,
                blending: THREE.AdditiveBlending, depthWrite: false
            });
            var tail = new THREE.Line(tailGeo, tailMat);
            meteor.add(tail);

            function addPoint(size, color) {
                var geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0], 3));
                var material = new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
                var point = new THREE.Points(geometry, material);
                meteor.add(point);
                return point;
            }
            var core = addPoint(8, 0xfff1c9);
            var halo = addPoint(22, 0xd8b36a);

            var dustGeo = new THREE.BufferGeometry();
            dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(24), 3));
            var dustMat = new THREE.PointsMaterial({ color: 0xd8b36a, size: 3.4, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
            var dust = new THREE.Points(dustGeo, dustMat);
            meteor.add(dust);
            meteor.visible = false;
            meteor.userData = { active: false, life: 0, maxLife: 0, vx: 0, vy: 0, vz: 0, len: 0, tail: tail, core: core, halo: halo, dust: dust };
            scene.add(meteor);
            meteorPool.push(meteor);
        }
    }

    function spawnMeteor(x, y, z, vx, vy, vz, life, len) {
        for (var i = 0; i < meteorPool.length; i++) {
            var m = meteorPool[i];
            if (!m.userData.active) {
                m.userData.active = true;
                m.userData.life = life;
                m.userData.maxLife = life;
                m.userData.vx = vx;
                m.userData.vy = vy;
                m.userData.vz = vz || 0;
                m.userData.startX = x;
                m.userData.startY = y;
                m.userData.startZ = z || 0;
                m.userData.len = len;
                m.visible = true;
                m.position.set(x, y, z || 0);
                var tailPos = m.userData.tail.geometry.attributes.position;
                tailPos.array[0] = 0; tailPos.array[1] = 0; tailPos.array[2] = 0;
                tailPos.array[3] = -vx * 8; tailPos.array[4] = -vy * 8; tailPos.array[5] = -(vz || 0) * 8;
                tailPos.needsUpdate = true;
                var dustPos = m.userData.dust.geometry.attributes.position;
                for (var d = 0; d < 8; d++) {
                    dustPos.array[d * 3] = -vx * (2 + d * 1.7) + (Math.random() - 0.5) * 10;
                    dustPos.array[d * 3 + 1] = -vy * (2 + d * 1.7) + (Math.random() - 0.5) * 10;
                    dustPos.array[d * 3 + 2] = (Math.random() - 0.5) * 5;
                }
                dustPos.needsUpdate = true;
                m.userData.tail.material.opacity = 0;
                m.userData.core.material.opacity = 0;
                m.userData.halo.material.opacity = 0;
                m.userData.dust.material.opacity = 0;
                meteorsActive.push(m);
                return m;
            }
        }
        return null;
    }

    function updateMeteors() {
        for (var i = meteorsActive.length - 1; i >= 0; i--) {
            var m = meteorsActive[i];
            m.userData.life -= 0.016;
            if (m.userData.life <= 0) {
                m.userData.active = false;
                m.visible = false;
                m.userData.tail.material.opacity = 0;
                m.userData.core.material.opacity = 0;
                m.userData.halo.material.opacity = 0;
                m.userData.dust.material.opacity = 0;
                meteorsActive.splice(i, 1);
                continue;
            }
            var progress = 1 - (m.userData.life / m.userData.maxLife);
            var visibility = progress < 0.14 ? progress / 0.14 : (progress > 0.72 ? (1 - progress) / 0.28 : 1);
            m.userData.tail.material.opacity = visibility * 0.68;
            m.userData.core.material.opacity = visibility;
            m.userData.halo.material.opacity = visibility * 0.18;
            m.userData.dust.material.opacity = visibility * 0.42;
            m.position.x += m.userData.vx;
            m.position.y += m.userData.vy;
            m.position.z += m.userData.vz || 0;
        }
    }

    /* =================================================================
       7. 开场控制器
       ================================================================= */
    function introAnimation(galaxy, leoGroup, lionSpirit, moon, stars, callback) {
        var startTime = performance.now() / 1000;
        var textShown = false;
        var readyDispatched = false;
        var meteorPlayed = false;

        var textOverlay = document.createElement('div');
        textOverlay.id = 'intro-text-overlay';
        textOverlay.style.cssText =
            'position:fixed;top:4vh;left:0;width:100%;height:auto;' +
            'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;' +
            'pointer-events:none;z-index:10;opacity:0;transition:opacity 1.5s ease;';
        textOverlay.innerHTML =
            '<p style="font-family:Georgia,serif;font-size:clamp(20px,3vw,28px);color:#f8f4ea;text-align:center;' +
            'letter-spacing:0.22em;line-height:1.35;text-shadow:0 0 30px rgba(216,179,106,0.18);">' +
            '我们的宇宙<br><span style="font-size:10px;letter-spacing:0.34em;color:#d8b36a;">OUR LITTLE UNIVERSE</span>' +
            '<br><span style="font-family:serif;font-size:12px;letter-spacing:0.12em;color:#a8a6b3;">两个人的小世界</span></p>';
        document.body.appendChild(textOverlay);

        // The six sickle stars are a deliberate prelude, aligned to the final lion's mane.
        var sickleOverlay = document.createElement('div');
        sickleOverlay.id = 'leo-sickle-overlay';
        sickleOverlay.setAttribute('aria-hidden', 'true');
        sickleOverlay.style.cssText = 'position:fixed;left:50%;top:52%;width:min(620px,70vw,56vh);aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none;z-index:9;opacity:0;transition:opacity .7s ease;mix-blend-mode:screen;';
        sickleOverlay.innerHTML = '<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><filter id="sickle-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<g stroke="#D8B36A" stroke-width=".34" stroke-linecap="round" stroke-linejoin="round" filter="url(#sickle-glow)">' +
            '<path data-sickle-trace d="M77.7 23.2 L69.2 31.2 L67.3 39.7 L70.1 42.7 L76.6 54.3 L70.1 59"/>' +
            '</g><g fill="#F6D58B" filter="url(#sickle-glow)">' +
            '<circle data-sickle-star cx="77.7" cy="23.2" r=".75"/><circle data-sickle-star cx="69.2" cy="31.2" r=".9"/><circle data-sickle-star cx="67.3" cy="39.7" r="1.18"/><circle data-sickle-star cx="70.1" cy="42.7" r="1.35"/><circle data-sickle-star cx="76.6" cy="54.3" r=".9"/><circle data-sickle-star cx="70.1" cy="59" r=".78"/>' +
            '</g></svg>';
        document.body.appendChild(sickleOverlay);

        // A purpose-made transparent linework asset: it has no rectangular backdrop to paste over the stars.
        var lionOverlay = document.createElement('img');
        lionOverlay.id = 'leo-linework-overlay';
        lionOverlay.src = 'assets/Leo/leo-linework-transparent.png?v=15';
        lionOverlay.alt = '';
        lionOverlay.setAttribute('aria-hidden', 'true');
        lionOverlay.style.cssText = 'position:fixed;left:50%;top:52%;width:min(620px,70vw,56vh);aspect-ratio:1;object-fit:contain;transform:translate(-50%,-50%);pointer-events:none;z-index:8;opacity:0;transition:none;mix-blend-mode:screen;filter:drop-shadow(0 0 16px rgba(216,179,106,.22));';
        document.body.appendChild(lionOverlay);

        function revealSickle(progress) {
            var stars = sickleOverlay.querySelectorAll('[data-sickle-star]');
            var trace = sickleOverlay.querySelector('[data-sickle-trace]');
            sickleOverlay.style.opacity = '1';
            stars.forEach(function(star, index) {
                star.style.opacity = String(Math.max(0, Math.min(1, progress * 6.4 - index)));
            });
            trace.style.opacity = String(Math.min(1, progress * 1.2) * .82);
            trace.style.strokeDasharray = '52';
            trace.style.strokeDashoffset = String(52 * (1 - progress));
        }

        function revealFullLeo(progress) {
            var stars = leoGroup.userData.starPoints;
            var halos = leoGroup.userData.haloPoints;
            var lines = leoGroup.userData.linePoints;
            leoGroup.userData.targetOpacity = 1;
            stars.forEach(function(star, index) {
                var local = star.phase === 'sickle' ? 1 : Math.max(0, Math.min(1, progress * 6 - (index - 6)));
                star.mesh.material.opacity = local * (index === 3 ? 0.9 : 0.72);
                halos[index].mesh.material.opacity = star.mesh.material.opacity * 0.3;
            });
            lines.forEach(function(line, index) {
                var local = line.userData.phase === 'sickle' ? 1 : Math.max(0, Math.min(1, progress * 7 - (index - 5)));
                line.material.opacity = local * 0.34;
            });
        }

        function fadeLeo(visibility) {
            leoGroup.userData.targetOpacity = visibility;
            leoGroup.userData.starPoints.forEach(function(star, index) {
                star.mesh.material.opacity = (index === 3 ? 0.82 : 0.62) * visibility;
                leoGroup.userData.haloPoints[index].mesh.material.opacity = star.mesh.material.opacity * 0.28;
            });
            leoGroup.userData.linePoints.forEach(function(line) {
                line.material.opacity = 0.3 * visibility;
            });
        }

        function revealLionSpirit(progress) {
            lionSpirit.userData.parts.forEach(function(part, index) {
                var localProgress = Math.max(0, Math.min(1, progress * lionSpirit.userData.parts.length - index));
                part.material.opacity = localProgress * part.userData.baseOpacity;
            });
        }

        function fadeLionSpirit(visibility) {
            lionSpirit.userData.parts.forEach(function(part) {
                part.material.opacity = part.userData.baseOpacity * visibility;
            });
        }

        function setMoonOpacity(val) {
            moon.userData.targetOpacity = val;
            moon.userData.core.material.opacity = val * 0.88;
            moon.userData.shadow.material.opacity = val;
            moon.traverse(function(child){
                if (child.material && child.material.transparent && child !== moon.userData.core && child !== moon.userData.shadow) {
                    child.material.opacity = val * 0.12;
                }
            });
        }

        function playOpeningMeteor() {
            var cue = document.createElement('div');
            cue.id = 'opening-meteor-cue';
            cue.setAttribute('aria-hidden', 'true');
            cue.style.cssText = 'position:fixed;left:-13vw;top:15vh;width:min(260px,28vw);height:3px;z-index:19;pointer-events:none;opacity:0;background:linear-gradient(90deg,transparent,rgba(216,179,106,.62),#fff8dc);box-shadow:0 0 12px rgba(255,232,173,.95),0 0 34px rgba(216,179,106,.48);transform:translate3d(0,0,0) rotate(32deg);transform-origin:right center;transition:transform 1.28s cubic-bezier(.18,.76,.24,1),opacity .12s ease;';
            document.body.appendChild(cue);
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    cue.style.opacity = '1';
                    cue.style.transform = 'translate3d(59vw,33vh,0) rotate(32deg)';
                });
            });
            setTimeout(function() {
                cue.style.opacity = '0';
                setTimeout(function() { cue.remove(); }, 180);
            }, 1360);
        }

        function introTick() {
            var elapsed = performance.now() / 1000 - startTime;

            if (elapsed >= INTRO_TIMELINE.meteorStart && !meteorPlayed) {
                meteorPlayed = true;
                playOpeningMeteor();
            }

            // 0~2s：深空中少量星辰渐显
            if (elapsed < INTRO_TIMELINE.starsEnd) {
                var p = Math.min(elapsed / INTRO_TIMELINE.starsEnd, 1);
                stars.forEach(function(s){
                    s.material.opacity = p * (s.material.userDataTarget || 0.8) * 0.55;
                });
            }

            // 1~3s：极低亮度银河出现
            if (elapsed >= INTRO_TIMELINE.galaxyStart && elapsed < INTRO_TIMELINE.galaxyEnd) {
                var gp = Math.min((elapsed - INTRO_TIMELINE.galaxyStart) / (INTRO_TIMELINE.galaxyEnd - INTRO_TIMELINE.galaxyStart), 1);
                galaxy.material.opacity = gp * 0.24;
            }

            // 2~4s：先点亮六颗“镰刀”星，包含轩辕十二。
            if (elapsed >= INTRO_TIMELINE.leoStart && elapsed < INTRO_TIMELINE.leoEnd) {
                fadeLeo(0);
                fadeLionSpirit(0);
                revealSickle(Math.min((elapsed - INTRO_TIMELINE.leoStart) / (INTRO_TIMELINE.leoEnd - INTRO_TIMELINE.leoStart), 1));
            }

            // 4~7s：同一批星点向外延展，完成完整狮子座轮廓。
            if (elapsed >= INTRO_TIMELINE.lionSpiritStart && elapsed < INTRO_TIMELINE.lionSpiritEnd) {
                var lionProgress = Math.min((elapsed - INTRO_TIMELINE.lionSpiritStart) / (INTRO_TIMELINE.lionSpiritEnd - INTRO_TIMELINE.lionSpiritStart), 1);
                fadeLeo(0);
                fadeLionSpirit(0);
                var smoothProgress = lionProgress * lionProgress * (3 - 2 * lionProgress);
                sickleOverlay.style.opacity = String(.96 - smoothProgress * .34);
                lionOverlay.style.opacity = String(.035 + smoothProgress * .925);
                lionOverlay.style.transform = 'translate(-50%,-50%) scale(' + (.984 + smoothProgress * .016) + ')';
                lionOverlay.style.filter = 'blur(' + ((1 - smoothProgress) * 3.8) + 'px) brightness(' + (.56 + smoothProgress * .44) + ') saturate(' + (.7 + smoothProgress * .3) + ') drop-shadow(0 0 ' + (7 + smoothProgress * 11) + 'px rgba(216,179,106,' + (.1 + smoothProgress * .18) + '))';
            }

            // 4~6s：月亮只作轻微提示
            if (elapsed >= INTRO_TIMELINE.titleStart && elapsed < INTRO_TIMELINE.titleEnd) {
                setMoonOpacity(Math.min((elapsed - INTRO_TIMELINE.titleStart) / (INTRO_TIMELINE.titleEnd - INTRO_TIMELINE.titleStart), 1));
            }

            // Keep the transparent constellation visible; the entry prompt lives below it instead.
            if (elapsed >= INTRO_TIMELINE.leoFadeStart && elapsed < INTRO_TIMELINE.finish) {
                fadeLeo(0);
                fadeLionSpirit(0);
                sickleOverlay.style.opacity = '.62';
                lionOverlay.style.opacity = '0.96';
                lionOverlay.style.transform = 'translate(-50%,-50%) scale(1)';
                lionOverlay.style.filter = 'blur(0) brightness(1) saturate(1) drop-shadow(0 0 18px rgba(216,179,106,.28))';
            }

            // 4s：标题出现
            if (elapsed >= INTRO_TIMELINE.titleStart && !textShown) {
                textShown = true;
                textOverlay.style.opacity = '1';
            }

            // The transparent lion linework and title remain as a still composition until entry.
            if (elapsed >= INTRO_TIMELINE.finish && !readyDispatched) {
                readyDispatched = true;
                window.dispatchEvent(new Event('spaceReady'));
                if (callback) callback();
                return; // 结束 intro tick
            }

            requestAnimationFrame(introTick);
        }

        requestAnimationFrame(introTick);
    }

    /* =================================================================
       8. 月亮隐藏情书逻辑
       ================================================================= */
    function triggerLoveLetter() {
        window.dispatchEvent(new CustomEvent('loveLetterRequested'));
    }

    function mountMoonLetterTrigger() {
        if (document.getElementById('moon-letter-trigger')) return;
        var trigger = document.createElement('button');
        trigger.id = 'moon-letter-trigger';
        trigger.type = 'button';
        trigger.setAttribute('aria-label', '长按月亮，打开隐藏情书');
        trigger.innerHTML = '<span aria-hidden="true"></span><i aria-hidden="true"></i><em>长按月亮，收一封情书</em>';
        trigger.style.cssText =
            'position:fixed;top:8vh;right:9vw;z-index:16;width:74px;height:74px;padding:0;border:0;border-radius:50%;' +
            'background:radial-gradient(circle at 38% 34%,#fffdf3 0 12%,#f8f4ea 31%,#d8b36a 32%,rgba(216,179,106,.13) 56%,transparent 70%);' +
            'box-shadow:0 0 34px rgba(216,179,106,.18);cursor:pointer;color:#d8b36a;transition:transform .4s ease,box-shadow .4s ease;';
        var label = trigger.querySelector('em');
        label.style.cssText = 'position:absolute;top:82px;left:50%;transform:translateX(-50%);width:142px;font:10px Georgia,serif;letter-spacing:.08em;color:#a8a6b3;font-style:normal;opacity:.72;';
        var ring = trigger.querySelector('i');
        ring.style.cssText = 'position:absolute;inset:-5px;border-radius:50%;pointer-events:none;background:conic-gradient(#f6d58b 0deg,rgba(216,179,106,.12) 0deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0);mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 0);opacity:0;transition:opacity .18s ease;';
        document.body.appendChild(trigger);

        var timer = null;
        var holdFrame = null;
        var holdStart = 0;
        var holding = false;
        var opened = false;
        function setRing(progress) {
            ring.style.opacity = progress > 0 ? '1' : '0';
            ring.style.background = 'conic-gradient(#f6d58b ' + (progress * 360) + 'deg,rgba(216,179,106,.12) 0deg)';
        }
        function animateHold() {
            if (!holding) return;
            var progress = Math.min(1, (performance.now() - holdStart) / 1200);
            setRing(progress);
            if (progress < 1) holdFrame = requestAnimationFrame(animateHold);
        }
        function clearHold() {
            if (timer) clearTimeout(timer);
            timer = null;
            holding = false;
            if (holdFrame) cancelAnimationFrame(holdFrame);
            holdFrame = null;
            trigger.style.transform = '';
            trigger.style.boxShadow = '';
            if (!opened) setRing(0);
        }
        function beginHold() {
            if (opened) return;
            holding = true;
            holdStart = performance.now();
            trigger.style.transform = 'scale(1.13)';
            trigger.style.boxShadow = '0 0 54px rgba(216,179,106,.54)';
            label.textContent = '愿望正在靠近…';
            animateHold();
            timer = setTimeout(function() {
                opened = true;
                clearHold();
                setRing(1);
                label.textContent = '情书已抵达';
                triggerLoveLetter();
                setTimeout(function(){ opened = false; label.textContent = '长按月亮，收一封情书'; setRing(0); }, 1500);
            }, 1200);
        }
        trigger.addEventListener('pointerdown', beginHold);
        trigger.addEventListener('pointerup', clearHold);
        trigger.addEventListener('pointerleave', clearHold);
        trigger.addEventListener('pointercancel', clearHold);
        trigger.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') beginHold();
        });
        trigger.addEventListener('keyup', clearHold);
    }

    /* =================================================================
       主入口
       ================================================================= */
    function initLionBackground(){
        var oldStarfield = document.getElementById('starfield');
        if (oldStarfield) oldStarfield.style.display = 'none';
        var fallback = document.getElementById('opening-fallback');
        if (fallback) fallback.classList.remove('active');

        loadThree(function(){
            var oldContainer = document.getElementById('lion-background');
            if (oldContainer) oldContainer.remove();

            var container = document.createElement('div');
            container.id = 'lion-background';
            container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
            document.body.appendChild(container);

            var ctx = createScene();
            var scene = ctx.scene;
            var camera = ctx.camera;
            var renderer = ctx.renderer;

            var starLayers = createStarLayers(scene);
            var galaxy = createGalaxy(scene);
            var leoGroup = createLeoConstellation(scene);
            var lionSpirit = createLionSpirit(scene);
            var moon = createMoon(scene);
            initMeteorPool(scene);

            var freeMode = false;
            var sceneVisible = true;
            var cameraTargetZ = 900;
            var randomMeteorCooldown = 0;

            function dismissOpeningScene() {
                if (!sceneVisible) return;
                sceneVisible = false;

                ['intro-text-overlay', 'leo-sickle-overlay', 'leo-linework-overlay', 'moon-letter-trigger', 'opening-fallback'].forEach(function(id) {
                    var layer = document.getElementById(id);
                    if (!layer) return;
                    layer.style.opacity = '0';
                    setTimeout(function() { layer.remove(); }, 450);
                });

                container.style.transition = 'opacity .45s ease';
                container.style.opacity = '0';
                setTimeout(function() { container.remove(); }, 500);
            }

            window.addEventListener('mainExperienceEntered', dismissOpeningScene, { once: true });

            function animate(){
                if (!sceneVisible) return;
                requestAnimationFrame(animate);

                if (!freeMode) {
                    camera.position.z += (cameraTargetZ - camera.position.z) * 0.008;
                }

                starLayers.forEach(function(layer){
                    layer.rotation.y += layer.userData.rotSpeedY;
                    layer.rotation.x += layer.userData.rotSpeedX;
                });

                if (galaxy.material.opacity > 0.01) {
                    galaxy.rotation.y += 0.00035;
                    galaxy.rotation.x += 0.00005;
                }

                // 狮子座呼吸动画
                if (leoGroup.userData.targetOpacity > 0.01) {
                    var breathe = 1 + Math.sin(performance.now() * 0.001) * 0.04;
                    leoGroup.userData.starPoints.forEach(function(s){
                        s.mesh.material.size = s.baseSize * breathe;
                    });
                    leoGroup.userData.haloPoints.forEach(function(h){
                        h.mesh.material.size = h.baseSize * breathe;
                    });
                }

                moon.position.x += 0.015;
                moon.position.y += 0.005;

                updateMeteors();
                if (freeMode) {
                    if (randomMeteorCooldown > 0) { randomMeteorCooldown--; }
                    else if (meteorsActive.length < Math.floor(MAX_METEORS * 0.3)) {
                        var x = (Math.random() - 0.5) * 1400;
                        var y = 200 + Math.random() * 350;
                        var speed = 5 + Math.random() * 8;
                        spawnMeteor(x, y, 0, -speed * 0.85, -speed * 0.7, 0, 1.0 + Math.random() * 1.5, 40 + Math.random() * 90);
                        randomMeteorCooldown = 60 + Math.floor(Math.random() * 180);
                    }
                }

                renderer.render(scene, camera);
            }

            introAnimation(galaxy, leoGroup, lionSpirit, moon, starLayers, function(){
                freeMode = true;
                mountMoonLetterTrigger();
            });

            // ★ 启动渲染循环（必须在 introAnimation 之后立即调用）
            animate();

            window.addEventListener('resize', function(){
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

        });
    }

    window.initLionBackground = initLionBackground;
})();
