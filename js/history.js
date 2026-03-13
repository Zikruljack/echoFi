// EchoFi — History Controller

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("history-list")) return;

  let currentFilter = "all";

  function updateStats() {
    const total   = SCAN_HISTORY.length;
    const safe    = SCAN_HISTORY.filter(h => h.result === "safe").length;
    const threats = SCAN_HISTORY.filter(h => h.result === "threat_detected").length;
    const elTotal   = document.getElementById("hist-total");
    const elSafe    = document.getElementById("hist-safe");
    const elThreats = document.getElementById("hist-threats");
    if (elTotal)   elTotal.textContent   = total;
    if (elSafe)    elSafe.textContent    = safe;
    if (elThreats) elThreats.textContent = threats;
  }

  function renderHistory() {
    const list  = document.getElementById("history-list");
    const empty = document.getElementById("history-empty");
    if (!list) return;

    let filtered = SCAN_HISTORY;
    if (currentFilter === "safe")   filtered = filtered.filter(h => h.result === "safe");
    if (currentFilter === "threat") filtered = filtered.filter(h => h.result === "threat_detected");

    updateStats();

    if (filtered.length === 0) {
      list.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");

    list.innerHTML = filtered.map(h => buildHistoryCard(h)).join("");

    // Bind expand clicks
    list.querySelectorAll(".history-card").forEach(card => {
      const header  = card.querySelector(".history-card-header");
      const hId     = parseInt(card.dataset.id);
      const hist    = SCAN_HISTORY.find(h => h.id === hId);
      if (!header || !hist) return;

      header.addEventListener("click", () => {
        const isOpen = card.classList.toggle("open");
        if (isOpen) {
          const chartEl = card.querySelector("canvas.history-chart");
          if (chartEl && !chartEl._chartInit) {
            setTimeout(() => renderHistoryChart(chartEl, hist), 50);
          }
        }
      });
    });
  }

  function buildHistoryCard(h) {
    const threatLabel = h.threatType ? THREAT_LABELS[h.threatType] : null;
    const badge = h.result === "safe"
      ? `<span class="badge badge-safe">AMAN</span>`
      : `<span class="badge badge-danger">ANCAMAN</span>`;

    const compRows = Object.entries(COMPONENT_LABELS).map(([key, label]) => {
      const comp = h.components[key];
      const pct  = Math.max(Math.round(comp.score * 100), 2);
      const cls  = comp.status === "danger" ? "danger" : "safe";
      return `
        <div class="comp-row compact">
          <div class="comp-label">${label.icon} ${label.name}</div>
          <div class="comp-bar-wrap">
            <div class="comp-bar comp-bar-${cls}" style="width:${pct}%"></div>
          </div>
          <div class="comp-score mono comp-score-${cls}">${comp.score.toFixed(2)}</div>
        </div>`;
    }).join("");

    return `
      <div class="history-card ${h.result === "threat_detected" ? "history-card-threat" : ""}" data-id="${h.id}">
        <div class="history-card-header">
          <div class="history-card-main">
            <div class="history-card-top">
              ${badge}
              <span class="history-date mono">${formatDate(h.date)}</span>
            </div>
            <div class="history-atm">
              <span class="mono">${h.atmCode}</span> — ${h.bank}
            </div>
            <div class="history-loc">${h.location}, ${h.city}</div>
          </div>
          <div class="history-card-right">
            <div class="history-confidence mono">${formatConfidence(h.confidence)}</div>
            <div class="history-confidence-label">keyakinan</div>
            <span class="expand-arrow">▾</span>
          </div>
        </div>
        <div class="history-card-body">
          <div class="history-detail-grid">
            <div>
              <div class="detail-label">Durasi Scan</div>
              <div class="detail-value mono">${h.duration}s</div>
            </div>
            <div>
              <div class="detail-label">Jenis Ancaman</div>
              <div class="detail-value">${threatLabel ? `${threatLabel.icon} ${threatLabel.name}` : "—"}</div>
            </div>
          </div>
          <div class="comp-breakdown" style="margin-top:12px">
            <div class="comp-breakdown-title">Breakdown Komponen</div>
            ${compRows}
          </div>
          <canvas class="history-chart" height="120" style="margin-top:16px;width:100%"></canvas>
          <div style="text-align:right;margin-top:8px">
            <a href="scan.html?atmId=${h.atmId}" class="btn btn-outline btn-sm">🔍 Scan Ulang ATM Ini</a>
          </div>
        </div>
      </div>`;
  }

  function renderHistoryChart(canvas, hist) {
    if (canvas._chartInit) return;
    canvas._chartInit = true;
    canvas.width = canvas.offsetWidth || 400;

    const labels = Object.values(COMPONENT_LABELS).map(l => l.name);
    const scores = Object.keys(COMPONENT_LABELS).map(k =>
      parseFloat((hist.components[k].score * 100).toFixed(1))
    );
    const colors = Object.keys(COMPONENT_LABELS).map(k =>
      hist.components[k].status === "danger"
        ? "rgba(239,68,68,0.8)"
        : "rgba(0,212,170,0.7)"
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
        responsive: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true, max: 100,
            grid: { color: "rgba(42,45,58,0.5)" },
            ticks: { color: "#94a3b8", callback: v => v + "%" }
          },
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8" }
          }
        }
      }
    });
  }

  // Filter tabs
  document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderHistory();
    });
  });

  renderHistory();
});
