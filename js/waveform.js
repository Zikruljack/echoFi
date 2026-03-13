// echoFi — Waveform Canvas Animation

class WaveformCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.mode = "normal";
    this.rafId = null;
    this.data = [];
    this.bufferLen = 120;
    this.phase = 0;
    this.transitionProgress = 0;
    this.transitioning = false;
    this._resize();
    window.addEventListener("resize", () => this._resize());
  }

  _resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width  = rect.width  || this.canvas.offsetWidth  || 400;
    this.canvas.height = rect.height || this.canvas.offsetHeight || 160;
    if (this.data.length === 0) {
      this.data = Array(this.bufferLen).fill(0).map(() => this._sampleNormal());
    }
  }

  _sampleNormal() {
    this.phase = (this.phase || 0) + 0.12;
    return 38.0 + Math.sin(this.phase) * 1.2 + (Math.random() - 0.5) * 0.8;
  }

  _sampleAnomaly() {
    this.phase = (this.phase || 0) + 0.18;
    return 38.0 + 25 + Math.sin(this.phase) * 6 + (Math.random() - 0.5) * 8;
  }

  _newSample() {
    if (this.mode === "anomaly") return this._sampleAnomaly();
    return this._sampleNormal();
  }

  start(mode = "normal") {
    this.mode = mode;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this._loop();
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  setMode(mode) {
    if (this.mode !== mode) {
      this.mode = mode;
      this.transitioning = true;
      this.transitionProgress = 0;
    }
  }

  _loop() {
    this.data.shift();
    this.data.push(this._newSample());
    this._draw();
    this.rafId = requestAnimationFrame(() => this._loop());
  }

  _draw() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.canvas;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const c = this.ctx;

    // Background
    c.fillStyle = "#0a0d14";
    c.fillRect(0, 0, w, h);

    // Grid
    c.strokeStyle = "rgba(42, 45, 58, 0.8)";
    c.lineWidth = 1;
    const gridCols = 8;
    const gridRows = 4;
    for (let i = 0; i <= gridCols; i++) {
      const x = (w / gridCols) * i;
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke();
    }
    for (let i = 0; i <= gridRows; i++) {
      const y = (h / gridRows) * i;
      c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
    }

    // Horizontal center reference line
    const minVal = 35, maxVal = 68;
    const normalCenter = (1 - (38 - minVal) / (maxVal - minVal)) * h;
    c.strokeStyle = "rgba(100, 116, 139, 0.3)";
    c.setLineDash([4, 4]);
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, normalCenter); c.lineTo(w, normalCenter); c.stroke();
    c.setLineDash([]);

    // Determine colors
    const isAnomaly = this.mode === "anomaly";
    const lineColor = isAnomaly ? "#ef4444" : "#00d4aa";
    const glowColor = isAnomaly ? "rgba(239,68,68,0.6)" : "rgba(0,212,170,0.6)";
    const fillColorStart = isAnomaly ? "rgba(239,68,68,0.15)" : "rgba(0,212,170,0.12)";
    const fillColorEnd   = "rgba(0,0,0,0)";

    // Map data to canvas coords
    const points = this.data.map((v, i) => ({
      x: (i / (this.bufferLen - 1)) * w,
      y: (1 - (v - minVal) / (maxVal - minVal)) * h
    }));

    // Fill area
    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, fillColorStart);
    grad.addColorStop(1, fillColorEnd);
    c.fillStyle = grad;
    c.beginPath();
    c.moveTo(points[0].x, h);
    points.forEach(p => c.lineTo(p.x, p.y));
    c.lineTo(points[points.length - 1].x, h);
    c.closePath();
    c.fill();

    // Glow pass (thick, transparent)
    c.shadowColor = glowColor;
    c.shadowBlur = 12;
    c.strokeStyle = lineColor;
    c.lineWidth = 3;
    c.lineJoin = "round";
    c.beginPath();
    points.forEach((p, i) => i === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y));
    c.stroke();
    c.shadowBlur = 0;

    // Sharp line on top
    c.strokeStyle = lineColor;
    c.lineWidth = 1.5;
    c.beginPath();
    points.forEach((p, i) => i === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y));
    c.stroke();

    // Current value dot at end
    const lastPt = points[points.length - 1];
    c.fillStyle = lineColor;
    c.shadowColor = glowColor;
    c.shadowBlur = 8;
    c.beginPath();
    c.arc(lastPt.x - 2, lastPt.y, 3, 0, Math.PI * 2);
    c.fill();
    c.shadowBlur = 0;

    // Label top-left
    c.fillStyle = "rgba(148, 163, 184, 0.7)";
    c.font = "10px 'JetBrains Mono', monospace";
    c.fillText("CSI SIGNAL", 8, 14);

    // Value label on right
    const lastVal = this.data[this.data.length - 1];
    c.fillStyle = lineColor;
    c.font = "bold 11px 'JetBrains Mono', monospace";
    c.fillText(lastVal.toFixed(2) + " dBm", w - 90, 14);

    // Mode badge
    if (isAnomaly) {
      c.fillStyle = "rgba(239,68,68,0.15)";
      const badgeW = 80, badgeH = 18;
      const bx = w - badgeW - 8, by = h - badgeH - 8;
      c.beginPath();
      c.roundRect(bx, by, badgeW, badgeH, 4);
      c.fill();
      c.fillStyle = "#ef4444";
      c.font = "bold 9px 'JetBrains Mono', monospace";
      c.fillText("⚠ ANOMALI", bx + 8, by + 13);
    }
  }

  // Static comparison: draw normal baseline + anomaly on two stacked canvases
  static drawComparison(canvasNormalId, canvasAnomalyId) {
    const normal  = document.getElementById(canvasNormalId);
    const anomaly = document.getElementById(canvasAnomalyId);
    if (!normal || !anomaly) return;

    [normal, anomaly].forEach((canvas, idx) => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight || 80;
      const ctx = canvas.getContext("2d");
      const w = canvas.width, h = canvas.height;
      const isAnomaly = idx === 1;

      const data = isAnomaly ? generateAnomalyWaveform(120) : generateNormalWaveform(120);
      const minV = 35, maxV = 68;

      ctx.fillStyle = "#0a0d14"; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(42,45,58,0.6)"; ctx.lineWidth = 1;
      for (let i = 0; i <= 6; i++) { const x = w/6*i; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for (let i = 0; i <= 3; i++) { const y = h/3*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

      const color = isAnomaly ? "#ef4444" : "#00d4aa";
      const pts = data.map((v, i) => ({ x: (i/(data.length-1))*w, y: (1-(v-minV)/(maxV-minV))*h }));

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = isAnomaly ? "rgba(239,68,68,0.5)" : "rgba(0,212,170,0.5)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(148,163,184,0.6)";
      ctx.font = "9px 'JetBrains Mono',monospace";
      ctx.fillText(isAnomaly ? "ANOMALI SCAN" : "BASELINE NORMAL", 6, 12);
    });
  }
}
