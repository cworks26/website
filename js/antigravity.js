// ============================================================
// Antigravity — Vanilla JS / Three.js port
// Creates one independent instance per canvas/section.
// ============================================================

function waitForThree(cb) {
  if (window.THREE) { cb(); return; }
  const id = setInterval(function () {
    if (window.THREE) { clearInterval(id); cb(); }
  }, 50);
}

function createAntigravity(canvasId, config) {
  const CFG = Object.assign({
    count:            300,
    magnetRadius:     6,
    ringRadius:       7,
    waveSpeed:        0.4,
    waveAmplitude:    1,
    particleSize:     1.5,
    lerpSpeed:        0.05,
    color:            '#5227FF',
    autoAnimate:      true,
    particleVariance: 1,
    rotationSpeed:    0,
    depthFactor:      1,
    pulseSpeed:       3,
    particleShape:    'capsule',
    fieldStrength:    10
  }, config);

  waitForThree(function () {
    const THREE  = window.THREE;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // --------------------------------------------------------
    // SCENE / CAMERA / RENDERER
    // --------------------------------------------------------
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // --------------------------------------------------------
    // GEOMETRY
    // --------------------------------------------------------
    const geometry = THREE.CapsuleGeometry
      ? new THREE.CapsuleGeometry(0.1, 0.4, 4, 8)
      : new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);

    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(CFG.color) });
    const mesh     = new THREE.InstancedMesh(geometry, material, CFG.count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    // --------------------------------------------------------
    // VIEWPORT in world units
    // --------------------------------------------------------
    function getViewport() {
      const fovRad = (camera.fov * Math.PI) / 180;
      const h      = 2 * Math.tan(fovRad / 2) * camera.position.z;
      return { width: h * camera.aspect, height: h };
    }

    let vp = getViewport();

    // --------------------------------------------------------
    // PARTICLES
    // --------------------------------------------------------
    const particles = [];
    for (let i = 0; i < CFG.count; i++) {
      const x = (Math.random() - 0.5) * vp.width;
      const y = (Math.random() - 0.5) * vp.height;
      const z = (Math.random() - 0.5) * 20;
      particles.push({
        t:                  Math.random() * 100,
        speed:              0.01 + Math.random() / 200,
        mx: x, my: y, mz: z,
        cx: x, cy: y, cz: z,
        randomRadiusOffset: (Math.random() - 0.5) * 2
      });
    }

    // --------------------------------------------------------
    // POINTER — tracks mouse only when over this section's canvas
    // --------------------------------------------------------
    const pointer           = { x: 0, y: 0 };
    const lastMousePos      = { x: 0, y: 0 };
    let   lastMouseMoveTime = 0;
    const virtualMouse      = { x: 0, y: 0 };

    function updatePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top  && clientY <= rect.bottom) {
        pointer.x =  ((clientX - rect.left) / rect.width)  * 2 - 1;
        pointer.y = -((clientY - rect.top)  / rect.height) * 2 + 1;
      }
    }

    window.addEventListener('mousemove', function (e) {
      updatePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (e.touches.length) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // --------------------------------------------------------
    // RESIZE
    // --------------------------------------------------------
    window.addEventListener('resize', function () {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      vp = getViewport();
    });

    // --------------------------------------------------------
    // ANIMATION LOOP
    // --------------------------------------------------------
    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed   = clock.getElapsedTime();
      const mouseDist = Math.hypot(pointer.x - lastMousePos.x, pointer.y - lastMousePos.y);

      if (mouseDist > 0.001) {
        lastMouseMoveTime = Date.now();
        lastMousePos.x    = pointer.x;
        lastMousePos.y    = pointer.y;
      }

      let destX = (pointer.x * vp.width)  / 2;
      let destY = (pointer.y * vp.height) / 2;

      if (CFG.autoAnimate && Date.now() - lastMouseMoveTime > 2000) {
        destX = Math.sin(elapsed * 0.5)     * (vp.width  / 4);
        destY = Math.cos(elapsed * 0.5 * 2) * (vp.height / 4);
      }

      virtualMouse.x += (destX - virtualMouse.x) * 0.05;
      virtualMouse.y += (destY - virtualMouse.y) * 0.05;

      const targetX        = virtualMouse.x;
      const targetY        = virtualMouse.y;
      const globalRotation = elapsed * CFG.rotationSpeed;

      for (let i = 0; i < CFG.count; i++) {
        const p = particles[i];
        p.t += p.speed / 2;

        const projFactor       = 1 - p.cz / 50;
        const projectedTargetX = targetX * projFactor;
        const projectedTargetY = targetY * projFactor;

        const dx   = p.mx - projectedTargetX;
        const dy   = p.my - projectedTargetY;
        const dist = Math.hypot(dx, dy);

        let tpx = p.mx;
        let tpy = p.my;
        let tpz = p.mz * CFG.depthFactor;

        if (dist < CFG.magnetRadius) {
          const angle = Math.atan2(dy, dx) + globalRotation;
          const wave  = Math.sin(p.t * CFG.waveSpeed + angle) * (0.5 * CFG.waveAmplitude);
          const dev   = p.randomRadiusOffset * (5 / (CFG.fieldStrength + 0.1));
          const rr    = CFG.ringRadius + wave + dev;

          tpx = projectedTargetX + rr * Math.cos(angle);
          tpy = projectedTargetY + rr * Math.sin(angle);
          tpz = p.mz * CFG.depthFactor + Math.sin(p.t) * CFG.waveAmplitude * CFG.depthFactor;
        }

        p.cx += (tpx - p.cx) * CFG.lerpSpeed;
        p.cy += (tpy - p.cy) * CFG.lerpSpeed;
        p.cz += (tpz - p.cz) * CFG.lerpSpeed;

        dummy.position.set(p.cx, p.cy, p.cz);
        dummy.lookAt(projectedTargetX, projectedTargetY, p.cz);
        dummy.rotateX(Math.PI / 2);

        const curDist      = Math.hypot(p.cx - projectedTargetX, p.cy - projectedTargetY);
        const distFromRing = Math.abs(curDist - CFG.ringRadius);
        const scale        = Math.max(0, Math.min(1, 1 - distFromRing / 10));
        const finalScale   = scale * (0.8 + Math.sin(p.t * CFG.pulseSpeed) * 0.2 * CFG.particleVariance) * CFG.particleSize;

        dummy.scale.setScalar(finalScale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    }

    animate();
  });
}

// ============================================================
// MOUNT — hero, team, contact (all bg-primary dark sections)
// ============================================================

createAntigravity('antigravity-hero', {
  count:         300,
  magnetRadius:  6,
  ringRadius:    7,
  waveSpeed:     0.4,
  waveAmplitude: 1,
  particleSize:  1.5,
  lerpSpeed:     0.05,
  color:         '#5227FF',
  autoAnimate:   true,
  particleShape: 'capsule',
  fieldStrength: 10,
  pulseSpeed:    3
});

createAntigravity('antigravity-team', {
  count:         300,
  magnetRadius:  6,
  ringRadius:    7,
  waveSpeed:     0.4,
  waveAmplitude: 1,
  particleSize:  1.5,
  lerpSpeed:     0.05,
  color:         '#5227FF',
  autoAnimate:   true,
  particleShape: 'capsule',
  fieldStrength: 10,
  pulseSpeed:    3
});

createAntigravity('antigravity-contact', {
  count:         300,
  magnetRadius:  6,
  ringRadius:    7,
  waveSpeed:     0.4,
  waveAmplitude: 1,
  particleSize:  1.5,
  lerpSpeed:     0.05,
  color:         '#5227FF',
  autoAnimate:   true,
  particleShape: 'capsule',
  fieldStrength: 10,
  pulseSpeed:    3
});
