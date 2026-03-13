// EchoFi — Spatial Radar (Three.js) — Multi-Target + Scenario System
// Ported from F2cell.html (RadarScene3D) ke vanilla JS OOP

class SpatialRadar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || !window.THREE) return;

    this.isThreat    = false;
    this.animId      = null;
    this.skimmerMesh = null;
    this.scenario    = 'IDLE';
    this.targets     = {};
    this.scanLines   = {};
    this._labels     = {};
    this._overlay    = null;
    this._coloredMats = [];

    this.TEAL = 0x00d4aa;
    this.RED  = 0xef4444;

    this._init();
  }

  // ─── material helpers ───────────────────────────────────────────
  _lm(hex, opacity = 1) {
    return new THREE.LineBasicMaterial({ color: hex, opacity, transparent: opacity < 1 });
  }
  _wm(hex, opacity = 1) {
    return new THREE.MeshBasicMaterial({ color: hex, wireframe: true, opacity, transparent: opacity < 1 });
  }
  _pm(hex, opacity = 1) {
    return new THREE.MeshBasicMaterial({ color: hex, opacity, transparent: opacity < 1, side: THREE.DoubleSide });
  }

  // ─── init ───────────────────────────────────────────────────────
  _init() {
    const w = this.container.clientWidth  || 600;
    const h = this.container.clientHeight || 360;
    const isMobile = window.innerWidth < 768;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1117);
    this.scene.fog = new THREE.FogExp2(0x0d1117, 0.038);

    // Camera
    this.camera = new THREE.PerspectiveCamera(isMobile ? 55 : 48, w / h, 0.1, 100);
    this.camera.position.set(0, isMobile ? 8.5 : 6.5, isMobile ? 13 : 9.5);
    this.camera.lookAt(0, 0.5, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Orbit Controls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping  = true;
      this.controls.dampingFactor  = 0.07;
      this.controls.minDistance    = 4;
      this.controls.maxDistance    = 22;
      this.controls.maxPolarAngle  = Math.PI / 2.1;
      this.controls.target.set(0, 1, 0);
    }

    this._buildScene();
    this._buildLabels();
    this._animate();

    this._resizeObs = () => this._onResize();
    window.addEventListener('resize', this._resizeObs);
    setTimeout(() => this._onResize(), 100);
    setTimeout(() => this._onResize(), 500);
  }

  // ─── scene construction ─────────────────────────────────────────
  _buildScene() {
    const c = this.TEAL;

    // Radar floor rings
    for (let r = 1; r <= 5; r++) {
      const mat  = this._pm(c, r === 5 ? 0.22 : 0.1);
      const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.007, r, 96), mat);
      ring.rotation.x = -Math.PI / 2;
      this.scene.add(ring);
      this._coloredMats.push(mat);
    }
    for (let i = 0; i < 12; i++) {
      const a   = (i / 12) * Math.PI * 2;
      const pts = [new THREE.Vector3(0,0,0), new THREE.Vector3(Math.cos(a)*5.2, 0, Math.sin(a)*5.2)];
      const mat = this._lm(c, 0.07);
      this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
      this._coloredMats.push(mat);
    }

    // Sensor core octahedron (dari F2cell)
    const sensorMat = new THREE.MeshBasicMaterial({ color: c, wireframe: true });
    this.sensorCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), sensorMat);
    this.sensorCore.position.set(0, 3.5, -0.8);
    this.scene.add(this.sensorCore);
    this._coloredMats.push(sensorMat);

    // ATM body
    this.atmGroup = new THREE.Group();
    const addEdge = (geo, y, x = 0, z = 0) => {
      const mat  = this._lm(c);
      const mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat);
      mesh.position.set(x, y, z);
      this.atmGroup.add(mesh);
      this._coloredMats.push(mat);
      return mesh;
    };
    addEdge(new THREE.BoxGeometry(1.15, 2.3,   0.92),  1.15);
    addEdge(new THREE.BoxGeometry(0.66, 0.46,  0.01),  1.55, 0, 0.47);
    const sMat = this._pm(c, 0.2);
    const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.63, 0.43), sMat);
    sMesh.position.set(0, 1.55, 0.47);
    this.atmGroup.add(sMesh);
    this._coloredMats.push(sMat);
    addEdge(new THREE.BoxGeometry(0.33, 0.065, 0.045), 1.0,  0, 0.46);
    addEdge(new THREE.BoxGeometry(0.52, 0.36,  0.04),  0.65, 0, 0.47);
    addEdge(new THREE.BoxGeometry(0.56, 0.09,  0.04),  0.22, 0, 0.47);
    const pipMat = this._lm(c);
    const pip    = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.SphereGeometry(0.05, 6, 4)), pipMat);
    pip.position.set(0.4, 2.15, 0.35);
    this.atmGroup.add(pip);
    this._coloredMats.push(pipMat);
    this.scene.add(this.atmGroup);

    // 3 human targets
    this.targets.t1 = this._buildHuman(this.TEAL);
    this.targets.t1.group.position.set(1.35, 0, 2.0);
    this.targets.t1.group.rotation.y = -0.55;

    this.targets.t2 = this._buildHuman(this.RED);
    this.targets.t2.group.position.set(2.0, 0, 2.5);
    this.targets.t2.group.rotation.y = -0.7;
    this.targets.t2.group.visible = false;

    // t3 = anak kecil (scale 0.6)
    this.targets.t3 = this._buildHuman(this.TEAL);
    this.targets.t3.group.position.set(0.9, 0, 1.8);
    this.targets.t3.group.scale.set(0.6, 0.6, 0.6);
    this.targets.t3.group.rotation.y = -0.4;
    this.targets.t3.group.visible = false;

    // Scan lines: sensor → head (1 per target)
    ['t1', 't2', 't3'].forEach(id => {
      const mat = this._lm(this.TEAL, 0.35);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0, 0,0,0], 3));
      const line = new THREE.Line(geo, mat);
      this.scene.add(line);
      this.scanLines[id] = { line, mat };
    });

    // Pulse rings
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

  _buildHuman(colorHex) {
    const group = new THREE.Group();
    const parts = {};

    const add = (geo, x, y, z) => {
      const mat  = this._wm(colorHex, 0.85);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      group.add(mesh);
      this._coloredMats.push(mat);
      return mesh;
    };

    parts.head  = add(new THREE.SphereGeometry(0.14, 8, 6),             0,     1.78, 0);
    parts.torso = add(new THREE.CylinderGeometry(0.13, 0.11, 0.65, 6),  0,     1.1,  0);
    add(new THREE.CylinderGeometry(0.04, 0.035, 0.52, 5), -0.25, 1.08, 0); // left arm
    parts.rArm  = add(new THREE.CylinderGeometry(0.04, 0.035, 0.52, 5), 0.25,  1.15, 0);
    add(new THREE.CylinderGeometry(0.06, 0.05, 0.72, 5), -0.13, 0.41,  0); // left leg
    add(new THREE.CylinderGeometry(0.06, 0.05, 0.72, 5),  0.13, 0.41,  0); // right leg

    this.scene.add(group);
    return { group, parts };
  }

  // ─── HTML labels overlay (ported dari F2cell label system) ──────
  _buildLabels() {
    const parent = this.container.parentElement;
    if (!parent) return;

    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    // Bersihkan overlay lama jika ada
    parent.querySelectorAll('.sr-labels').forEach(el => el.remove());

    const overlay = document.createElement('div');
    overlay.className = 'sr-labels';
    overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden';
    parent.appendChild(overlay);
    this._overlay = overlay;

    const defs = [
      { id: 't1', color: '#00d4aa', border: 'rgba(0,212,170,0.45)' },
      { id: 't2', color: '#ef4444', border: 'rgba(239,68,68,0.45)'  },
      { id: 't3', color: '#00d4aa', border: 'rgba(0,212,170,0.45)' },
    ];
    defs.forEach(({ id, color, border }) => {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute;top:0;left:0;display:none',
        `color:${color}`,
        'font:bold 10px "JetBrains Mono",monospace',
        'background:rgba(13,17,23,0.85)',
        `border:1px solid ${border}`,
        'padding:3px 8px;border-radius:4px',
        'white-space:nowrap',
        'box-shadow:0 2px 8px rgba(0,0,0,0.5)',
        'line-height:1.4',
      ].join(';');
      overlay.appendChild(el);
      this._labels[id] = el;
    });
  }

  // ─── public API ─────────────────────────────────────────────────

  /**
   * Atur skenario deteksi. Dipanggil dari scan.js berdasarkan threat type ATM.
   * Scenarios: 'IDLE' | 'NORMAL' | 'SHOULDER_SURFING' | 'SKIMMING' | 'CHILD_PARENT' | 'ELDERLY_SLOW'
   */
  setScenario(scenario) {
    this.scenario = scenario;
    const { t1, t2, t3 } = this.targets;
    if (!t1) return;

    // Reset semua target
    t1.group.visible = true;
    t2.group.visible = false;
    t3.group.visible = false;
    t1.group.scale.set(1, 1, 1);
    t1.group.rotation.y = -0.55;
    t2.group.rotation.y = -0.7;

    if (scenario === 'IDLE' || scenario === 'NORMAL') {
      t1.group.position.set(1.35, 0, 2.2);
    } else if (scenario === 'SHOULDER_SURFING') {
      t1.group.position.set(1.35, 0, 2.2);
      t2.group.position.set(2.0,  0, 2.8);
      t2.group.visible = true;
    } else if (scenario === 'SKIMMING') {
      t1.group.position.set(1.35, 0, 2.2);
    } else if (scenario === 'CHILD_PARENT') {
      t1.group.position.set(1.35, 0, 2.2);
      t3.group.position.set(0.9,  0, 2.0);
      t3.group.visible = true;
    } else if (scenario === 'ELDERLY_SLOW') {
      t1.group.position.set(1.35, 0, 3.2);
    }
  }

  /** Aktifkan/nonaktifkan mode ancaman — mengubah warna seluruh scene & tampilkan skimmer */
  setThreatMode(isThreat) {
    this.isThreat = isThreat;
    const hex = isThreat ? this.RED : this.TEAL;
    this._coloredMats.forEach(m => { if (m.color) m.color.setHex(hex); });

    if (isThreat && !this.skimmerMesh) {
      const mat  = this._lm(this.RED);
      const mesh = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.4, 0.12, 0.09)), mat
      );
      mesh.position.set(0, 1.0, 0.52);
      this.atmGroup.add(mesh);
      this.skimmerMesh = mesh;
    } else if (!isThreat && this.skimmerMesh) {
      this.atmGroup.remove(this.skimmerMesh);
      this.skimmerMesh = null;
    }

    // Update label warna t1 & badge
    if (this._labels.t1) this._labels.t1.style.color = isThreat ? '#ef4444' : '#00d4aa';
    const badge = document.getElementById('radar-badge');
    if (badge) {
      badge.textContent = isThreat ? '⚠ ANCAMAN' : '● LIVE';
      badge.style.color  = isThreat ? '#ef4444' : '#00d4aa';
    }
  }

  // ─── animation loop ─────────────────────────────────────────────
  _animate() {
    this.animId = requestAnimationFrame(() => this._animate());
    const t = Date.now() * 0.001;

    // Sensor core berputar
    if (this.sensorCore) this.sensorCore.rotation.y += 0.02;

    // Pulse rings melebar
    this.pulseRings.forEach(({ mesh, mat }) => {
      const p = ((t * 0.5 + mesh.userData.offs) % 1);
      mesh.scale.setScalar(p * 4.2 + 0.05);
      mat.opacity = 0.55 * (1 - p);
    });

    this._tickScenario(t);
    this._updateLabels();

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /** Gerakkan target menuju destinasi, kembalikan jarak sisa */
  _walk(group, destX, destZ, speed, t) {
    const dx   = destX - group.position.x;
    const dz   = destZ - group.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 0.04) {
      group.position.x += dx * speed;
      group.position.z += dz * speed;
      group.position.y  = Math.abs(Math.sin(t * 5)) * 0.035; // bob saat jalan
    } else {
      group.position.y = 0;
    }
    return dist;
  }

  _tickScenario(t) {
    const { t1, t2, t3 } = this.targets;
    if (!t1) return;

    const AX = 0.2, AZ = 0.58; // posisi depan ATM

    switch (this.scenario) {
      case 'IDLE':
        if (t1.parts.rArm) t1.parts.rArm.rotation.z = -0.75 + Math.sin(t * 0.9) * 0.06;
        break;

      case 'NORMAL':
        this._walk(t1.group, AX, AZ, 0.03, t);
        if (t1.parts.rArm) t1.parts.rArm.rotation.z = -0.75 + Math.sin(t * 1.5) * 0.1;
        break;

      case 'SHOULDER_SURFING':
        this._walk(t1.group, AX, AZ,          0.03, t);
        this._walk(t2.group, AX + 0.38, AZ + 0.28, 0.02, t); // mendekat dari belakang
        if (t1.parts.rArm) t1.parts.rArm.rotation.z = -0.75 + Math.sin(t * 1.5) * 0.1;
        if (t2.parts.rArm) t2.parts.rArm.rotation.z = -0.75 + Math.sin(t * 1.3) * 0.08;
        break;

      case 'SKIMMING': {
        const dist = this._walk(t1.group, AX, AZ, 0.04, t);
        // Jongkok saat sudah dekat ATM
        if (dist < 0.08) {
          t1.group.scale.y = Math.max(0.48, t1.group.scale.y - 0.007);
        }
        break;
      }

      case 'CHILD_PARENT':
        this._walk(t1.group, AX,        AZ,        0.03, t);
        this._walk(t3.group, AX - 0.45, AZ + 0.2,  0.03, t);
        if (t1.parts.rArm) t1.parts.rArm.rotation.z = -0.75 + Math.sin(t * 1.5) * 0.1;
        break;

      case 'ELDERLY_SLOW':
        this._walk(t1.group, AX, AZ, 0.006, t); // sangat lambat
        if (t1.parts.rArm) t1.parts.rArm.rotation.z = -0.75 + Math.sin(t * 0.7) * 0.07;
        break;
    }
  }

  /** Update posisi HTML label mengikuti kepala target (ported dari F2cell animate loop) */
  _updateLabels() {
    if (!this._overlay || !this.container) return;
    const cw = this.container.clientWidth;
    const ch = this.container.clientHeight;

    const NAMES = { t1: 'OBJ-ALPHA', t2: 'OBJ-BRAVO', t3: 'OBJ-MINOR' };

    Object.entries(this.targets).forEach(([id, target]) => {
      const label = this._labels[id];
      if (!target || !label) return;

      if (!target.group.visible) { label.style.display = 'none'; return; }

      // Posisi kepala di dunia
      const headPos = new THREE.Vector3();
      target.parts.head.getWorldPosition(headPos);

      // Estimasi tinggi: kepala di y≈1.78 → 170 cm
      const heightCm = Math.max(Math.round((headPos.y / 1.78) * 170), 0);

      // Proyeksikan ke layar
      const screenPos = headPos.clone();
      screenPos.y += 0.3;
      screenPos.project(this.camera);

      if (screenPos.z > 1) { label.style.display = 'none'; return; }

      const x = (screenPos.x *  0.5 + 0.5) * cw;
      const y = (screenPos.y * -0.5 + 0.5) * ch;
      label.innerHTML = `<div>${NAMES[id]}</div><div style="font-size:9px;opacity:0.75;margin-top:1px">Pos: ${heightCm} cm</div>`;
      label.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
      label.style.display   = 'block';

      // Update scan line: sensor → kepala
      const sl = this.scanLines[id];
      if (sl && this.sensorCore) {
        const sPos = new THREE.Vector3();
        this.sensorCore.getWorldPosition(sPos);
        const pos = sl.line.geometry.attributes.position;
        pos.setXYZ(0, sPos.x,    sPos.y,    sPos.z);
        pos.setXYZ(1, headPos.x, headPos.y, headPos.z);
        pos.needsUpdate = true;
      }
    });
  }

  // ─── resize ─────────────────────────────────────────────────────
  _onResize() {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight || 360;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ─── cleanup ────────────────────────────────────────────────────
  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this._resizeObs);
    if (this._overlay) { this._overlay.remove(); this._overlay = null; }
    if (this.controls) this.controls.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }
}
