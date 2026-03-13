// EchoFi — Spatial Radar (Three.js)

class SpatialRadar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || !window.THREE) return;

    this.isThreat = false;
    this.animId   = null;
    this.skimmerMesh = null;
    this._coloredMats = [];

    this.TEAL = 0x00d4aa;
    this.RED  = 0xef4444;

    this._init();
  }

  _init() {
    const w = this.container.clientWidth  || 600;
    const h = this.container.clientHeight || 360;

    // ── Scene ──
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1117);
    this.scene.fog = new THREE.FogExp2(0x0d1117, 0.045);

    // ── Camera ──
    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
    this.camera.position.set(0, 6.5, 9.5);
    this.camera.lookAt(0, 0.5, 0);

    // ── Renderer ──
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.container.appendChild(this.renderer.domElement);

    // ── Orbit Controls ──
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping  = true;
      this.controls.dampingFactor  = 0.07;
      this.controls.minDistance    = 4;
      this.controls.maxDistance    = 20;
      this.controls.maxPolarAngle  = Math.PI / 2.1;
      this.controls.target.set(0, 1, 0);
    }

    this._buildScene();
    this._animate();
    this._resizeObs = () => this._onResize();
    window.addEventListener('resize', this._resizeObs);
  }

  // ─────────────── helpers ───────────────
  _lm(hex, opacity = 1) {
    return new THREE.LineBasicMaterial({ color: hex, opacity, transparent: opacity < 1 });
  }
  _wm(hex, opacity = 1) {
    return new THREE.MeshBasicMaterial({ color: hex, wireframe: true, opacity, transparent: opacity < 1 });
  }
  _pm(hex, opacity = 1) {
    return new THREE.MeshBasicMaterial({ color: hex, opacity, transparent: opacity < 1, side: THREE.DoubleSide });
  }

  // ─────────────── scene ───────────────
  _buildScene() {
    const c = this.TEAL;

    // ── Radar floor ──
    for (let r = 1; r <= 5; r++) {
      const geo = new THREE.RingGeometry(r - 0.007, r, 96);
      const mat = this._pm(c, r === 5 ? 0.22 : 0.1);
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = -Math.PI / 2;
      this.scene.add(ring);
      this._coloredMats.push(mat);
    }
    for (let i = 0; i < 12; i++) {
      const a   = (i / 12) * Math.PI * 2;
      const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 5.2, 0, Math.sin(a) * 5.2)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = this._lm(c, 0.07);
      this.scene.add(new THREE.Line(geo, mat));
      this._coloredMats.push(mat);
    }

    // ── ATM body ──
    this.atmGroup = new THREE.Group();

    const addEdge = (geo, y, x = 0, z = 0, opacity = 1) => {
      const mat  = this._lm(c, opacity);
      const mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat);
      mesh.position.set(x, y, z);
      this.atmGroup.add(mesh);
      this._coloredMats.push(mat);
      return mesh;
    };

    addEdge(new THREE.BoxGeometry(1.15, 2.3, 0.92), 1.15);           // chassis
    addEdge(new THREE.BoxGeometry(0.66, 0.46, 0.01), 1.55, 0, 0.47); // screen border

    // Screen fill (semi-transparent)
    const sMat = this._pm(c, 0.2);
    const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.63, 0.43), sMat);
    sMesh.position.set(0, 1.55, 0.47);
    this.atmGroup.add(sMesh);
    this._coloredMats.push(sMat);

    addEdge(new THREE.BoxGeometry(0.33, 0.065, 0.045), 1.0, 0, 0.46);  // card slot
    addEdge(new THREE.BoxGeometry(0.52, 0.36, 0.04),  0.65, 0, 0.47);  // keypad
    addEdge(new THREE.BoxGeometry(0.56, 0.09, 0.04),  0.22, 0, 0.47);  // cash slot

    // Top camera pip
    const pipMat = this._lm(c);
    const pipMesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.SphereGeometry(0.05, 6, 4)),
      pipMat
    );
    pipMesh.position.set(0.4, 2.15, 0.35);
    this.atmGroup.add(pipMesh);
    this._coloredMats.push(pipMat);

    this.scene.add(this.atmGroup);

    // ── Human figure ──
    this.humanGroup = new THREE.Group();
    this._buildHuman(c);
    this.humanGroup.position.set(1.35, 0, 0.9);
    this.humanGroup.rotation.y = -0.55;
    this.scene.add(this.humanGroup);

    // ── Label connector line (ATM top → human label) ──
    const lGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 2.5, 0),
      new THREE.Vector3(1.35, 2.1, 0.9)
    ]);
    const lMat = this._lm(c, 0.45);
    this.labelLine = new THREE.Line(lGeo, lMat);
    this.scene.add(this.labelLine);
    this._coloredMats.push(lMat);

    // ── Pulse rings ──
    this.pulseRings = [];
    for (let i = 0; i < 3; i++) {
      const mat   = this._pm(c, 0.7);
      const pulse = new THREE.Mesh(new THREE.RingGeometry(0.01, 0.04, 48), mat);
      pulse.rotation.x    = -Math.PI / 2;
      pulse.userData.offs = i / 3;
      this.scene.add(pulse);
      this.pulseRings.push({ mesh: pulse, mat });
      this._coloredMats.push(mat);
    }
  }

  _buildHuman(c) {
    const add = (geo, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const mat  = this._wm(c);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      this.humanGroup.add(mesh);
      this._coloredMats.push(mat);
      return mesh;
    };

    // Head
    add(new THREE.SphereGeometry(0.14, 8, 6), 0, 1.78, 0);

    // Torso
    add(new THREE.CylinderGeometry(0.13, 0.11, 0.65, 6), 0, 1.1, 0);

    // Left arm (relaxed)
    add(new THREE.CylinderGeometry(0.04, 0.035, 0.52, 5),
        -0.25, 1.08, 0, 0, 0, 0.28);

    // Right arm (reaching toward ATM)
    this.rArm = add(new THREE.CylinderGeometry(0.04, 0.035, 0.52, 5),
                    0.25, 1.15, 0, -0.4, 0, -0.75);

    // Legs
    add(new THREE.CylinderGeometry(0.06, 0.05, 0.72, 5), -0.13, 0.41, 0);
    add(new THREE.CylinderGeometry(0.06, 0.05, 0.72, 5),  0.13, 0.41, 0);
  }

  // ─────────────── public API ───────────────
  setThreatMode(isThreat) {
    this.isThreat = isThreat;
    const hex = isThreat ? this.RED : this.TEAL;
    this._coloredMats.forEach(m => { if (m.color) m.color.setHex(hex); });

    if (isThreat && !this.skimmerMesh) {
      // Skimmer device overlaid on card slot
      const mat  = this._lm(this.RED);
      const mesh = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.4, 0.12, 0.09)),
        mat
      );
      mesh.position.set(0, 1.0, 0.52);
      this.atmGroup.add(mesh);
      this.skimmerMesh = mesh;
    } else if (!isThreat && this.skimmerMesh) {
      this.atmGroup.remove(this.skimmerMesh);
      this.skimmerMesh = null;
    }

    // Update label element color
    const lbl = document.getElementById('radar-obj-label');
    if (lbl) lbl.style.color = isThreat ? '#ef4444' : '#00d4aa';
    const badge = document.getElementById('radar-badge');
    if (badge) {
      badge.textContent = isThreat ? '⚠ ANCAMAN' : '● LIVE';
      badge.style.color = isThreat ? '#ef4444' : '#00d4aa';
    }
  }

  // ─────────────── loop ───────────────
  _animate() {
    this.animId = requestAnimationFrame(() => this._animate());
    const t = Date.now() * 0.001;

    // Expanding pulse rings
    this.pulseRings.forEach(({ mesh, mat }) => {
      const p = ((t * 0.5 + mesh.userData.offs) % 1);
      mesh.scale.setScalar(p * 4.2 + 0.05);
      mat.opacity = 0.55 * (1 - p);
    });

    // Human idle bob
    if (this.humanGroup) {
      this.humanGroup.position.y = Math.sin(t * 1.3) * 0.022;
    }

    // Arm slight reach animation
    if (this.rArm) {
      this.rArm.rotation.z = -0.75 + Math.sin(t * 1.5) * 0.1;
    }

    // Skimmer pulse
    if (this.skimmerMesh) {
      const op = 0.55 + Math.sin(t * 5) * 0.45;
      this.skimmerMesh.material.opacity = Math.max(0.1, op);
      this.skimmerMesh.material.transparent = true;
    }

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight || 360;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this._resizeObs);
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}
