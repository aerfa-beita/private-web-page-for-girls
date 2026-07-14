(function(){
    /* =================================================================
       lion_background.js V3 — 私人狮子座开场系统
       包含：克制深空 / 固定狮子座 / 月亮 / 隐藏情书入口
       ================================================================= */

    // 是否为移动端（降低粒子数）
    var isMobile = window.innerWidth < 600;
    var INTRO_TIMELINE = {
        starsEnd: 2,
        galaxyStart: 1,
        galaxyEnd: 3,
        leoStart: 2,
        leoEnd: 4,
        titleStart: 4,
        titleEnd: 6,
        leoFadeStart: 6,
        finish: 8
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

    function createLeoConstellation(scene) {
        leoGroup = new THREE.Group();
        leoGroup.name = 'leoConstellation';
        leoGroup.userData = { targetOpacity: 0, starPoints: [], haloPoints: [], linePoints: [] };
        leoGroup.position.set(-10, 8, 20);
        leoGroup.scale.setScalar(isMobile ? 0.78 : 1.08);

        var starData = [
            { name:'Rasalas',       pos:[-168, 154, 0], mag:3.8, color:0xD8B36A },
            { name:'Adhafera',      pos:[-122, 102, 0], mag:3.4, color:0xD8B36A },
            { name:'Algieba',       pos:[ -72,  58, 0], mag:2.0, color:0xF8F4EA },
            { name:'Regulus',       pos:[ -28,   0, 0], mag:1.4, color:0xF8F4EA },
            { name:'Zosma',         pos:[  86,  42, 0], mag:2.6, color:0xD8B36A },
            { name:'Chertan',       pos:[ 142, -78, 0], mag:3.3, color:0xD8B36A },
            { name:'Denebola',      pos:[ 222, -22, 0], mag:2.1, color:0xF8F4EA },
            { name:'AsellusBorealis', pos:[-118, -82, 0], mag:3.9, color:0xD8B36A },
            { name:'EtaLeonis',     pos:[ -76,-166, 0], mag:3.5, color:0xD8B36A }
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
            leoGroup.userData.starPoints.push({ mesh: pt, baseSize: size });

            var hg = new THREE.BufferGeometry();
            hg.setAttribute('position', new THREE.Float32BufferAttribute(s.pos, 3));
            var hm = new THREE.PointsMaterial({
                color: s.color, size: size * 2.25,
                blending: THREE.AdditiveBlending, depthWrite: false,
                transparent: true, opacity: 0
            });
            var halo = new THREE.Points(hg, hm);
            leoGroup.add(halo);
            leoGroup.userData.haloPoints.push({ mesh: halo, baseSize: size * 2.25 });
        });

        var connections = [[0,1],[1,2],[2,3],[3,4],[4,6],[4,5],[5,6],[3,7],[7,8]];
        connections.forEach(function(pair){
            var a = starData[pair[0]].pos;
            var b = starData[pair[1]].pos;
            var lg = new THREE.BufferGeometry();
            lg.setAttribute('position', new THREE.Float32BufferAttribute([a[0],a[1],a[2], b[0],b[1],b[2]], 3));
            var lm = new THREE.LineBasicMaterial({
                color: 0xD8B36A, transparent: true, opacity: 0,
                blending: THREE.AdditiveBlending, depthWrite: false
            });
            var line = new THREE.Line(lg, lm);
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
        var moonMat = new THREE.MeshBasicMaterial({ color: 0xfff8e7 });
        moonGroup.add(new THREE.Mesh(moonGeo, moonMat));

        var h1g = new THREE.SphereGeometry(38, 32, 32);
        var h1m = new THREE.MeshBasicMaterial({ color: 0xfff8e7, transparent: true, opacity: 0, depthWrite: false });
        moonGroup.add(new THREE.Mesh(h1g, h1m));

        var h2g = new THREE.SphereGeometry(52, 32, 32);
        var h2m = new THREE.MeshBasicMaterial({ color: 0xa8d8ff, transparent: true, opacity: 0, depthWrite: false });
        moonGroup.add(new THREE.Mesh(h2g, h2m));

        moonGroup.userData = { targetOpacity: 0 };
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
            var geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0, 0,0,0], 3));
            var mat = new THREE.LineBasicMaterial({
                color: 0xffffff, transparent: true, opacity: 0,
                blending: THREE.AdditiveBlending, depthWrite: false
            });
            var meteor = new THREE.Line(geo, mat);
            meteor.visible = false;
            meteor.userData = { active: false, life: 0, maxLife: 0, vx: 0, vy: 0, vz: 0, startX: 0, startY: 0, startZ: 0, len: 0 };
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
                m.material.opacity = 0.8;
                var pos = m.geometry.attributes.position;
                pos.array[0] = x; pos.array[1] = y; pos.array[2] = z || 0;
                pos.array[3] = x - vx * 8; pos.array[4] = y - vy * 8; pos.array[5] = (z || 0) - (vz || 0) * 8;
                pos.needsUpdate = true;
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
                m.material.opacity = 0;
                meteorsActive.splice(i, 1);
                continue;
            }
            var progress = 1 - (m.userData.life / m.userData.maxLife);
            if (progress < 0.1) { m.material.opacity = progress / 0.1 * 0.8; }
            else if (progress > 0.7) { m.material.opacity = (1 - progress) / 0.3 * 0.8; }
            else { m.material.opacity = 0.8; }
            var pos = m.geometry.attributes.position;
            pos.array[0] += m.userData.vx;
            pos.array[1] += m.userData.vy;
            pos.array[2] += (m.userData.vz || 0);
            pos.array[3] = pos.array[0] - m.userData.vx * 8;
            pos.array[4] = pos.array[1] - m.userData.vy * 8;
            pos.array[5] = pos.array[2] - (m.userData.vz || 0) * 8;
            pos.needsUpdate = true;
        }
    }

    /* =================================================================
       6. 旧爱心星团（保留渲染兼容，不再触发）
       ================================================================= */
    function createHeartStars(scene) {
        var count = 200;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(count * 3);
        var colorsArr = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
            var t = (i / count) * Math.PI * 2;
            var sx = 16 * Math.pow(Math.sin(t), 3);
            var sy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            var spread = 0.6;
            positions[i * 3]     = -sx * 3 + (Math.random() - 0.5) * spread * 30;
            positions[i * 3 + 1] =  sy * 3 + (Math.random() - 0.5) * spread * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 20;
            var pink = Math.random();
            colorsArr[i * 3] = 1.0;
            colorsArr[i * 3 + 1] = 0.4 + pink * 0.3;
            colorsArr[i * 3 + 2] = 0.5 + pink * 0.4;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
        var material = new THREE.PointsMaterial({
            size: 3.5, vertexColors: true,
            blending: THREE.AdditiveBlending, depthWrite: false,
            transparent: true, opacity: 0
        });
        var heart = new THREE.Points(geometry, material);
        heart.name = 'heartStars';
        heart.userData = { opacity: 0, targetOpacity: 0, timer: 0, phase: 'idle' };
        scene.add(heart);
        return heart;
    }

    /* =================================================================
       7. 开场控制器
       ================================================================= */
    function introAnimation(galaxy, leoGroup, moon, heart, stars, callback) {
        var startTime = performance.now() / 1000;
        var textShown = false;
        var readyDispatched = false;

        var textOverlay = document.createElement('div');
        textOverlay.id = 'intro-text-overlay';
        textOverlay.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
            'pointer-events:none;z-index:10;opacity:0;transition:opacity 1.5s ease;';
        textOverlay.innerHTML =
            '<p style="font-family:Georgia,serif;font-size:clamp(22px,4vw,34px);color:#f8f4ea;text-align:center;' +
            'letter-spacing:0.22em;line-height:1.7;text-shadow:0 0 30px rgba(216,179,106,0.18);">' +
            '我们的宇宙<br><span style="font-size:10px;letter-spacing:0.34em;color:#d8b36a;">OUR LITTLE UNIVERSE</span>' +
            '<br><span style="font-family:serif;font-size:13px;letter-spacing:0.12em;color:#a8a6b3;">两个人的小世界</span></p>';
        document.body.appendChild(textOverlay);

        var leoLabel = document.createElement('div');
        leoLabel.style.cssText =
            'position:fixed;left:50%;top:65%;transform:translateX(-50%);pointer-events:none;' +
            'z-index:10;text-align:center;color:#d8b36a;font:11px Georgia,serif;letter-spacing:0.26em;' +
            'line-height:1.8;opacity:0;transition:opacity 1s ease;';
        leoLabel.innerHTML = 'LEO<br><span style="font-family:serif;color:#a8a6b3;letter-spacing:0.1em;">狮子座</span>';
        document.body.appendChild(leoLabel);

        function revealLeo(progress) {
            var stars = leoGroup.userData.starPoints;
            var halos = leoGroup.userData.haloPoints;
            var lines = leoGroup.userData.linePoints;
            leoGroup.userData.targetOpacity = progress;
            stars.forEach(function(star, index) {
                star.mesh.material.opacity = Math.max(0, Math.min(1, progress * stars.length - index)) * 0.82;
                halos[index].mesh.material.opacity = star.mesh.material.opacity * 0.28;
            });
            lines.forEach(function(line, index) {
                line.material.opacity = Math.max(0, Math.min(1, progress * lines.length - index - 3)) * 0.3;
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

        function setMoonOpacity(val) {
            moon.userData.targetOpacity = val;
            moon.traverse(function(child){
                if (child.material && child.material.transparent) {
                    if (child.material.color && child.material.color.getHex() === 0xfff8e7 && child.material.opacity !== undefined) {
                        child.material.opacity = val * 0.9;
                    } else if (child.material.opacity !== undefined) {
                        child.material.opacity = val * 0.12;
                    }
                }
            });
        }

        function introTick() {
            var elapsed = performance.now() / 1000 - startTime;

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

            // 2~4s：固定星点依次亮起，再连接为狮子座
            if (elapsed >= INTRO_TIMELINE.leoStart && elapsed < INTRO_TIMELINE.leoEnd) {
                revealLeo(Math.min((elapsed - INTRO_TIMELINE.leoStart) / (INTRO_TIMELINE.leoEnd - INTRO_TIMELINE.leoStart), 1));
            }

            // 4~6s：月亮与星座名称只作轻微提示
            if (elapsed >= INTRO_TIMELINE.titleStart && elapsed < INTRO_TIMELINE.titleEnd) {
                setMoonOpacity(Math.min((elapsed - INTRO_TIMELINE.titleStart) / (INTRO_TIMELINE.titleEnd - INTRO_TIMELINE.titleStart), 1));
                leoLabel.style.opacity = '1';
            }

            // 6~8s：星图与标题缓慢消失，为密码锁留出静默空间
            if (elapsed >= INTRO_TIMELINE.leoFadeStart && elapsed < INTRO_TIMELINE.finish) {
                var fadeProgress = (elapsed - INTRO_TIMELINE.leoFadeStart) / (INTRO_TIMELINE.finish - INTRO_TIMELINE.leoFadeStart);
                fadeLeo(1 - fadeProgress);
                leoLabel.style.opacity = String(1 - fadeProgress);
                textOverlay.style.opacity = String(1 - fadeProgress);
            }

            // 4s：标题出现
            if (elapsed >= INTRO_TIMELINE.titleStart && !textShown) {
                textShown = true;
                textOverlay.style.opacity = '1';
            }

            // 8s：标题与星座名称渐隐，显示密码锁
            if (elapsed >= INTRO_TIMELINE.finish && !readyDispatched) {
                readyDispatched = true;
                textOverlay.style.opacity = '0';
                leoLabel.style.opacity = '0';
                setTimeout(function(){
                    if (textOverlay.parentNode) textOverlay.parentNode.removeChild(textOverlay);
                    if (leoLabel.parentNode) leoLabel.parentNode.removeChild(leoLabel);
                }, 1500);
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
    var moonClickCount = 0;
    var heartRef = null;

    function triggerLoveLetter() {
        window.dispatchEvent(new CustomEvent('loveLetterRequested'));
    }

    function updateHeart() {
        if (!heartRef) return;
        var h = heartRef.userData;
        if (h.phase === 'idle' && h.targetOpacity === 0) {
            heartRef.material.opacity += (0 - heartRef.material.opacity) * 0.1;
            return;
        }
        h.timer += 0.016;
        if (h.phase === 'appearing') {
            heartRef.material.opacity += (h.targetOpacity - heartRef.material.opacity) * 0.08;
            var s = 1.5 - Math.min(h.timer / 0.8, 1) * 0.7;
            heartRef.scale.setScalar(Math.max(s, 0.8));
            if (h.timer > 2.0) { h.phase = 'holding'; h.timer = 0; }
        } else if (h.phase === 'holding') {
            heartRef.material.opacity += (h.targetOpacity - heartRef.material.opacity) * 0.05;
            heartRef.scale.setScalar(heartRef.scale.x + (1.0 - heartRef.scale.x) * 0.05);
            if (h.timer > 2.0) { h.phase = 'fading'; h.timer = 0; }
        } else if (h.phase === 'fading') {
            h.targetOpacity = 0;
            heartRef.material.opacity += (0 - heartRef.material.opacity) * 0.03;
            heartRef.scale.setScalar(heartRef.scale.x + (2.0 - heartRef.scale.x) * 0.02);
            if (h.timer > 1.5) { h.phase = 'idle'; h.timer = 0; h.targetOpacity = 0; heartRef.material.opacity = 0; heartRef.scale.setScalar(1.0); }
        }
    }

    /* =================================================================
       主入口
       ================================================================= */
    function initLionBackground(){
        var oldStarfield = document.getElementById('starfield');
        if (oldStarfield) oldStarfield.style.display = 'none';

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
            var moon = createMoon(scene);
            heartRef = createHeartStars(scene);
            initMeteorPool(scene);

            var freeMode = false;
            var cameraTargetZ = 900;
            var randomMeteorCooldown = 0;

            function animate(){
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

                updateHeart();
                renderer.render(scene, camera);
            }

            introAnimation(galaxy, leoGroup, moon, heartRef, starLayers, function(){
                freeMode = true;
            });

            // ★ 启动渲染循环（必须在 introAnimation 之后立即调用）
            animate();

            window.addEventListener('resize', function(){
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            // 月亮点击五次打开隐藏情书
            window.addEventListener('click', function(e){
                if (!freeMode) return;
                var mx = e.clientX / window.innerWidth;
                var my = e.clientY / window.innerHeight;
                if (mx > 0.65 && my < 0.3) {
                    moonClickCount++;
                    if (moonClickCount >= 5) {
                        moonClickCount = 0;
                        triggerLoveLetter();
                    }
                }
            });
        });
    }

    window.initLionBackground = initLionBackground;
})();
