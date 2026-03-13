// echoFi — Scan Controller

class ScanController {
  constructor() {
    this.state = "select";
    this.selectedATM = null;
    this.waveform = null;
    this.techInterval = null;
    this.scanTimeout = null;
    this.scanResultChart = null;
    this.anomalyScore = 0;

    this.cityFilter = "all";
    this.bankFilter = "all";
    this.searchQuery = "";

    this.init();
  }

  init() {
    this.buildCityFilters();
    this.buildBankFilters();
    this.populateATMList();
    this.bindEvents();

    // Pre-select from URL param
    const paramId = parseInt(getQueryParam("atmId"));
    if (paramId) {
      const sel = document.getElementById("atm-select");
      if (sel) { sel.value = paramId; this.showATMInfo(paramId); }
    }
  }

  buildCityFilters() {
    const container = document.getElementById("city-filters");
    if (!container) return;
    const cities = CITIES;
    let html = `<button class="filter-btn active" data-city="all">Semua</button>`;
    cities.forEach(c => { html += `<button class="filter-btn" data-city="${c}">${c}</button>`; });
    container.innerHTML = html;
    container.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.cityFilter = btn.dataset.city;
        this.populateATMList();
      });
    });
  }

  buildBankFilters() {
    const container = document.getElementById("bank-filters");
    if (!container) return;
    const banks = BANKS;
    let html = `<button class="filter-btn active" data-bank="all">Semua Bank</button>`;
    banks.forEach(b => { html += `<button class="filter-btn" data-bank="${b}">${b}</button>`; });
    container.innerHTML = html;
    container.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.bankFilter = btn.dataset.bank;
        this.populateATMList();
      });
    });
  }

  populateATMList() {
    const sel = document.getElementById("atm-select");
    if (!sel) return;

    let filtered = ATM_DATA;
    if (this.cityFilter !== "all") filtered = filtered.filter(a => a.city === this.cityFilter);
    if (this.bankFilter !== "all") filtered = filtered.filter(a => a.bank === this.bankFilter);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.code.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.bank.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
      );
    }

    // Group by city
    const grouped = {};
    filtered.forEach(a => {
      if (!grouped[a.city]) grouped[a.city] = [];
      grouped[a.city].push(a);
    });

    let html = `<option value="">-- Pilih ATM --</option>`;
    Object.keys(grouped).sort().forEach(city => {
      html += `<optgroup label="${city}">`;
      grouped[city].forEach(a => {
        const status = a.isCompromised ? "⚠" : (a.lastScanned ? "✓" : "○");
        html += `<option value="${a.id}">${status} ${a.code} — ${a.bank} (${a.location})</option>`;
      });
      html += `</optgroup>`;
    });

    sel.innerHTML = html;

    // Restore selection if same ATM still in list
    if (this.selectedATM) {
      const found = filtered.find(a => a.id === this.selectedATM.id);
      if (found) sel.value = this.selectedATM.id;
      else { this.selectedATM = null; this.hideATMInfo(); }
    }
  }

  bindEvents() {
    const sel    = document.getElementById("atm-select");
    const search = document.getElementById("atm-search");
    const btnScan = document.getElementById("btn-scan");
    const btnReset  = document.getElementById("btn-reset");
    const btnReset2 = document.getElementById("btn-reset2");
    const btnReport = document.getElementById("btn-report");
    const btnMap    = document.getElementById("btn-find-safe");
    const btnDetail = document.getElementById("btn-toggle-detail");
    const btnJson   = document.getElementById("btn-toggle-json");

    if (sel)    sel.addEventListener("change", e => { const id = parseInt(e.target.value); if(id) this.showATMInfo(id); else this.hideATMInfo(); });
    if (search) search.addEventListener("input", e => { this.searchQuery = e.target.value; this.populateATMList(); });
    if (btnScan)   btnScan.addEventListener("click",   () => this.startScan());
    if (btnReset)  btnReset.addEventListener("click",  () => this.resetScan());
    if (btnReset2) btnReset2.addEventListener("click", () => this.resetScan());
    if (btnReport) btnReport.addEventListener("click", () => this.reportATM());
    if (btnMap)    btnMap.addEventListener("click", () => navigateTo("map.html"));
    if (btnDetail) btnDetail.addEventListener("click", () => this.toggleDetail());
    if (btnJson)   btnJson.addEventListener("click",   () => this.toggleJson());
  }

  showATMInfo(atmId) {
    this.selectedATM = getATMById(atmId);
    if (!this.selectedATM) return;
    const atm = this.selectedATM;

    const card = document.getElementById("atm-info-card");
    if (!card) return;
    card.innerHTML = `
      <div class="atm-info-row">
        <span class="atm-info-label">Kode ATM</span>
        <span class="atm-info-value mono">${atm.code}</span>
      </div>
      <div class="atm-info-row">
        <span class="atm-info-label">Bank</span>
        <span class="atm-info-value">${atm.bank}</span>
      </div>
      <div class="atm-info-row">
        <span class="atm-info-label">Lokasi</span>
        <span class="atm-info-value">${atm.location}</span>
      </div>
      <div class="atm-info-row">
        <span class="atm-info-label">Alamat</span>
        <span class="atm-info-value">${atm.address}</span>
      </div>
      <div class="atm-info-row">
        <span class="atm-info-label">Terakhir Scan</span>
        <span class="atm-info-value">${formatDate(atm.lastScanned)}</span>
      </div>
      <div class="atm-info-row">
        <span class="atm-info-label">Total Scan</span>
        <span class="atm-info-value">${atm.totalScans} kali</span>
      </div>
      <div class="atm-info-row">
        <span class="atm-info-label">Status Terakhir</span>
        <span class="atm-info-value">${renderATMStatusBadge(atm)}</span>
      </div>
    `;
    card.classList.remove("hidden");

    const btn = document.getElementById("btn-scan");
    if (btn) btn.disabled = false;
  }

  hideATMInfo() {
    this.selectedATM = null;
    const card = document.getElementById("atm-info-card");
    if (card) card.classList.add("hidden");
    const btn = document.getElementById("btn-scan");
    if (btn) btn.disabled = true;
  }

  showSection(id) {
    ["section-select","section-scanning","section-result"].forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.add("hidden");
    });
    const target = document.getElementById(id);
    if (target) { target.classList.remove("hidden"); target.classList.add("fade-in"); }
  }

  startScan() {
    if (!this.selectedATM) return;
    const atm = this.selectedATM;
    this.state = "scanning";
    this.anomalyScore = 0;
    this.showSection("section-scanning");

    // Inject ATM SVG
    this.injectATMSvg();

    // Init waveform
    this.waveform = new WaveformCanvas("waveform-canvas");
    this.waveform.start("normal");

    // Start tech metrics
    this.startTechMetrics(atm.isCompromised);

    // Scanning sequence
    this.runScanSequence(atm);
  }

  injectATMSvg() {
    const container = document.getElementById("atm-svg-container");
    if (!container) return;
    fetch("assets/img/atm-silhouette.svg")
      .then(r => r.text())
      .then(svg => { container.innerHTML = svg; this.activateScanLine(); })
      .catch(() => { container.innerHTML = `<div style="color:var(--text-muted);text-align:center;padding:2rem">ATM SVG</div>`; });
  }

  activateScanLine() {
    const line = document.getElementById("scan-line");
    const glow = document.getElementById("scan-line-glow");
    if (line) line.setAttribute("opacity", "1");
    if (glow) glow.setAttribute("opacity", "1");

    // CSS class triggers animation
    const svg = document.getElementById("atm-svg");
    if (svg) svg.classList.add("scanning");
  }

  highlightArea(areaId) {
    // Remove all highlights
    document.querySelectorAll(".atm-area").forEach(el => {
      el.classList.remove("highlight-scanning","highlight-safe","highlight-danger");
    });
    if (!areaId) return;
    const el = document.getElementById(`area-${areaId}`);
    if (el) el.classList.add("highlight-scanning");
  }

  finalizeAreaHighlights(atm) {
    document.querySelectorAll(".atm-area").forEach(el => {
      el.classList.remove("highlight-scanning");
    });
    // Find result from SCAN_HISTORY (just added)
    const history = SCAN_HISTORY[0];
    if (!history) return;
    const areas = ["card_slot","keypad","front_panel","camera_area"];
    areas.forEach(area => {
      const comp = history.components[area];
      const el = document.getElementById(`area-${area}`);
      if (!el) return;
      if (comp && comp.status === "danger") el.classList.add("highlight-danger");
      else el.classList.add("highlight-safe");
    });
  }

  runScanSequence(atm) {
    const steps = [
      { time: 0,    area: "card_slot",   text: "Memindai Slot Kartu...",    dot: 0 },
      { time: 2000, area: "keypad",      text: "Memindai Keypad...",        dot: 1 },
      { time: 4000, area: "front_panel", text: "Memindai Panel Depan...",   dot: 2 },
      { time: 5000, area: "camera_area", text: "Memindai Area Kamera...",   dot: 3 },
      { time: 6000, area: null,          text: "Menganalisis data CSI...", dot: -1 },
    ];

    const setStatus = (text, showSpinner) => {
      const el = document.getElementById("scan-status-text");
      if (el) el.innerHTML = showSpinner
        ? `<span class="spinner"></span>${text}`
        : text;
    };
    const setDot = (idx) => {
      document.querySelectorAll(".step-dot").forEach((d,i) => {
        d.classList.toggle("active", i === idx);
        d.classList.toggle("done",   i < idx);
      });
    };

    steps.forEach((step, idx) => {
      setTimeout(() => {
        this.highlightArea(step.area);
        setStatus(step.text, step.area === null);
        if (step.dot >= 0) setDot(step.dot);

        // Switch waveform to anomaly at 4s if compromised
        if (step.time === 4000 && atm.isCompromised && this.waveform) {
          this.waveform.setMode("anomaly");
        }
      }, step.time);
    });

    // After 7s → show result
    this.scanTimeout = setTimeout(() => {
      this.stopTechMetrics();
      if (this.waveform) this.waveform.stop();
      this.buildResult(atm);
      this.showSection("section-result");
      this.finalizeAreaHighlights(atm);
      this.state = "result";
    }, 7000);
  }

  startTechMetrics(isCompromised) {
    let tick = 0;
    this.techInterval = setInterval(() => {
      tick++;
      const ss = (40 + Math.random() * 5).toFixed(1);
      const pv = (0.015 + Math.random() * 0.02).toFixed(3);
      let as = this.anomalyScore;
      const sub = 52 + Math.floor(Math.random() * 5);

      // Anomaly score rises after tick 20 (≈4s) if compromised
      if (isCompromised && tick > 20) {
        const targetScore = 0.89;
        const rise = (tick - 20) / 15;
        as = Math.min(targetScore, rise * targetScore + (Math.random() - 0.5) * 0.02);
        this.anomalyScore = as;
      } else if (!isCompromised) {
        as = (Math.random() * 0.05).toFixed(2);
      }

      this.updateMetric("metric-signal", `${ss} dBm`);
      this.updateMetric("metric-phase",  `${pv}`);
      this.updateMetric("metric-anomaly", parseFloat(as).toFixed(2), isCompromised && tick > 20 ? "danger" : "safe");
      this.updateMetric("metric-sub",    `${sub}/56`);
    }, 200);
  }

  updateMetric(id, value, colorClass) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
    if (colorClass === "danger") el.style.color = "var(--danger)";
    else if (colorClass === "safe") el.style.color = "var(--accent)";
  }

  stopTechMetrics() {
    if (this.techInterval) { clearInterval(this.techInterval); this.techInterval = null; }
  }

  buildResult(atm) {
    const isCompromised = atm.isCompromised;
    const threatLabel = isCompromised ? getThreatLabel(atm.threatType) : null;
    const confidence = isCompromised ? 0.891 : 0.972;

    // Build scan history entry
    let components;
    if (isCompromised && threatLabel) {
      components = { card_slot:{score:0.04,status:"safe"}, keypad:{score:0.06,status:"safe"}, front_panel:{score:0.03,status:"safe"}, camera_area:{score:0.05,status:"safe"} };
      components[threatLabel.component] = { score: 0.89, status:"danger" };
      if (atm.threatType === "multi_threat") {
        components.card_slot   = { score:0.91, status:"danger" };
        components.camera_area = { score:0.88, status:"danger" };
        components.keypad      = { score:0.72, status:"danger" };
      }
    } else {
      components = {
        card_slot:   { score:+(Math.random()*0.08).toFixed(2), status:"safe" },
        keypad:      { score:+(Math.random()*0.08).toFixed(2), status:"safe" },
        front_panel: { score:+(Math.random()*0.08).toFixed(2), status:"safe" },
        camera_area: { score:+(Math.random()*0.08).toFixed(2), status:"safe" },
      };
    }

    const scanEntry = {
      atmId: atm.id, atmCode: atm.code, bank: atm.bank,
      location: atm.location, city: atm.city,
      date: new Date().toISOString(),
      result: isCompromised ? "threat_detected" : "safe",
      threatType: atm.threatType,
      confidence, duration: 7.0, components
    };
    addToHistory(scanEntry);

    // Update ATM lastScanned
    atm.lastScanned = scanEntry.date;
    atm.totalScans++;

    // Build result HTML
    const card = document.getElementById("result-card");
    if (!card) return;

    card.className = `result-card ${isCompromised ? "result-threat" : "result-safe"}`;

    const compRows = Object.entries(COMPONENT_LABELS).map(([key, label]) => {
      const comp = components[key];
      const pct = Math.round(comp.score * 100);
      const statusClass = comp.status === "danger" ? "danger" : "safe";
      const icon = comp.status === "danger" ? "⚠️" : "✅";
      return `
        <div class="comp-row">
          <div class="comp-label">${label.icon} ${label.name}</div>
          <div class="comp-bar-wrap">
            <div class="comp-bar comp-bar-${statusClass}" style="width:${pct}%"></div>
          </div>
          <div class="comp-score mono comp-score-${statusClass}">${(comp.score).toFixed(2)}</div>
          <div class="comp-icon">${icon}</div>
        </div>`;
    }).join("");

    card.innerHTML = `
      <div class="result-icon">${isCompromised ? "🚨" : "✅"}</div>
      <div class="result-title">${isCompromised ? "ANCAMAN TERDETEKSI" : "ATM AMAN"}</div>
      <div class="result-subtitle">
        ${isCompromised
          ? `<strong>${threatLabel ? threatLabel.name : "Perangkat Asing"}</strong> terdeteksi di area <strong>${threatLabel ? COMPONENT_LABELS[threatLabel.component]?.name : ""}</strong>`
          : "Tidak ditemukan anomali pada mesin ini"}
      </div>
      <div class="result-confidence">
        <span class="confidence-label">Tingkat Keyakinan</span>
        <span class="confidence-value mono">${formatConfidence(confidence)}</span>
        <div class="confidence-bar-wrap">
          <div class="confidence-bar" style="width:${confidence*100}%;background:${isCompromised?'var(--danger)':'var(--success)'}"></div>
        </div>
      </div>

      ${isCompromised ? `
      <div class="threat-detail-box">
        <div class="threat-type-badge">
          <span>${threatLabel ? threatLabel.icon : "⚠️"}</span>
          <span>${threatLabel ? threatLabel.name : atm.threatType}</span>
        </div>
        <p class="threat-desc">${atm.threatDescription || (threatLabel ? threatLabel.desc : "")}</p>
        <div class="recommendation-box">
          <strong>⛔ REKOMENDASI:</strong> JANGAN gunakan ATM ini. Segera hubungi pihak bank dan laporkan ke pihak berwajib. Jangan masukkan kartu Anda.
        </div>
      </div>` : `
      <div class="safe-message">
        <p>ATM ini aman untuk digunakan. Scan rutin membantu menjaga keamanan bersama.</p>
      </div>`}

      <div class="comp-breakdown">
        <h4 class="comp-breakdown-title">Breakdown Komponen</h4>
        ${compRows}
      </div>

      <div class="result-actions">
        ${isCompromised
          ? `<button class="btn btn-danger" id="btn-report">📣 Laporkan ATM</button>
             <button class="btn btn-outline" id="btn-find-safe">🗺️ Cari ATM Aman</button>`
          : `<button class="btn btn-primary" id="btn-reset2">🔍 Scan ATM Lain</button>
             <a href="history.html" class="btn btn-outline">📋 Lihat Riwayat</a>`}
      </div>

      <div class="accordion">
        <div class="accordion-item">
          <div class="accordion-header" id="btn-toggle-detail">
            <span>Detail Teknis (untuk Juri)</span>
            <span class="accordion-arrow">▾</span>
          </div>
          <div class="accordion-body">
            <div class="tech-charts">
              <div class="tech-chart-container">
                <h5>Anomaly Score per Komponen</h5>
                <canvas id="chart-components" height="160"></canvas>
              </div>
              <div class="tech-waveforms">
                <h5>Perbandingan Waveform CSI</h5>
                <div class="waveform-compare">
                  <div class="waveform-small-wrap">
                    <canvas id="waveform-normal" height="80"></canvas>
                  </div>
                  <div class="waveform-small-wrap">
                    <canvas id="waveform-anomaly" height="80"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div class="raw-data-section">
              <button class="btn btn-ghost btn-sm" id="btn-toggle-json">{ } Tampilkan Raw Data</button>
              <pre class="raw-json hidden" id="raw-json">${JSON.stringify(scanEntry, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    `;

    // Re-bind dynamic buttons
    document.getElementById("btn-report")?.addEventListener("click", () => this.reportATM());
    document.getElementById("btn-find-safe")?.addEventListener("click", () => navigateTo("map.html"));
    document.getElementById("btn-reset2")?.addEventListener("click", () => this.resetScan());
    document.getElementById("btn-toggle-detail")?.addEventListener("click", () => this.toggleDetail());
    document.getElementById("btn-toggle-json")?.addEventListener("click",   () => this.toggleJson());

    // Init accordion open state
    initAccordions();
  }

  toggleDetail() {
    const accordion = document.querySelector(".accordion-item");
    if (!accordion) return;
    const isOpen = accordion.classList.toggle("open");
    if (isOpen) {
      setTimeout(() => this.renderTechCharts(), 100);
    }
  }

  renderTechCharts() {
    const history = SCAN_HISTORY[0];
    if (!history) return;

    // Component bar chart
    const canvas = document.getElementById("chart-components");
    if (canvas && !canvas._chartInit) {
      canvas._chartInit = true;
      const labels = Object.values(COMPONENT_LABELS).map(l => l.name);
      const scores = Object.values(history.components).map(c => parseFloat((c.score*100).toFixed(1)));
      const colors = Object.values(history.components).map(c =>
        c.status === "danger" ? "rgba(239,68,68,0.8)" : "rgba(0,212,170,0.7)"
      );
      new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Anomaly Score (%)",
            data: scores,
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace("0.8","1").replace("0.7","1")),
            borderWidth: 1,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `${ctx.raw}%` } }
          },
          scales: {
            y: { beginAtZero: true, max: 100, grid: { color:"rgba(42,45,58,0.5)" }, ticks: { color:"#94a3b8", callback: v => v+"%"} },
            x: { grid: { display: false }, ticks: { color:"#94a3b8" } }
          }
        }
      });
    }

    // Waveform comparison
    WaveformCanvas.drawComparison("waveform-normal", "waveform-anomaly");
  }

  toggleJson() {
    const el = document.getElementById("raw-json");
    const btn = document.getElementById("btn-toggle-json");
    if (!el) return;
    const hidden = el.classList.toggle("hidden");
    if (btn) btn.textContent = hidden ? "{ } Tampilkan Raw Data" : "{ } Sembunyikan Raw Data";
  }

  reportATM() {
    alert(`Laporan terkirim!\n\nATM ${this.selectedATM?.code} telah dilaporkan ke sistem echoFi dan pihak bank terkait.\n\nNomor laporan: RPT-${Date.now().toString().slice(-8)}`);
  }

  resetScan() {
    this.state = "select";
    if (this.waveform) { this.waveform.stop(); this.waveform = null; }
    this.stopTechMetrics();
    if (this.scanTimeout) { clearTimeout(this.scanTimeout); this.scanTimeout = null; }
    this.selectedATM = null;
    this.anomalyScore = 0;
    this.hideATMInfo();
    document.getElementById("atm-select").value = "";
    document.getElementById("btn-scan").disabled = true;
    this.showSection("section-select");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("section-select")) {
    window._scan = new ScanController();
  }
});
