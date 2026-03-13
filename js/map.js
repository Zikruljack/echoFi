// SENTINEL-FI — Map Controller

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("map")) return;

  // Init Leaflet map centered on Indonesia
  const map = L.map("map", {
    center: [-2.5, 118],
    zoom: 5,
    zoomControl: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  // State
  let cityFilter   = "all";
  let bankFilter   = "all";
  let statusFilter = "all";
  let markersLayer = L.layerGroup().addTo(map);

  // Custom circle marker factory
  function makeIcon(atm) {
    let color, label;
    if (atm.isCompromised) {
      color = "#ef4444"; label = "ANCAMAN";
    } else if (atm.lastScanned) {
      color = "#22c55e"; label = "AMAN";
    } else {
      color = "#64748b"; label = "BELUM SCAN";
    }

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="34" viewBox="0 0 28 34">
        <filter id="drop-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.4"/>
        </filter>
        <circle cx="14" cy="14" r="11" fill="${color}" opacity="0.2" filter="url(#drop-shadow)"/>
        <circle cx="14" cy="14" r="7" fill="${color}"/>
        <circle cx="14" cy="14" r="3" fill="white" opacity="0.9"/>
        <polygon points="14,28 10,22 18,22" fill="${color}"/>
      </svg>`;

    return L.divIcon({
      html: svgIcon,
      className: "",
      iconSize: [28, 34],
      iconAnchor: [14, 34],
      popupAnchor: [0, -36],
    });
  }

  function makePopupHTML(atm) {
    const badge = renderATMStatusBadge(atm);
    const scanInfo = atm.lastScanned
      ? `<p style="margin:0;font-size:12px;color:#94a3b8">Scan terakhir: ${formatDateShort(atm.lastScanned)}</p>`
      : `<p style="margin:0;font-size:12px;color:#64748b">Belum pernah di-scan</p>`;

    return `
      <div style="font-family:'Inter',sans-serif;min-width:200px;color:#e2e8f0">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px">${atm.code}</div>
        <div style="font-size:13px;color:#94a3b8;margin-bottom:2px">${atm.bank}</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:8px">${atm.location}, ${atm.city}</div>
        <div style="margin-bottom:6px">${badge}</div>
        ${atm.isCompromised ? `<div style="font-size:11px;color:#ef4444;margin-bottom:6px">⚠️ ${THREAT_LABELS[atm.threatType]?.name || atm.threatType}</div>` : ""}
        ${scanInfo}
        <a href="scan.html?atmId=${atm.id}" style="display:block;margin-top:10px;text-align:center;background:#00d4aa;color:#0f1117;font-weight:700;font-size:12px;padding:6px 12px;border-radius:6px;text-decoration:none">
          🔍 Scan ATM Ini
        </a>
      </div>`;
  }

  function renderMarkers() {
    markersLayer.clearLayers();
    let total = 0, scanned = 0, threats = 0;

    ATM_DATA.forEach(atm => {
      // Filter
      if (cityFilter   !== "all" && atm.city !== cityFilter) return;
      if (bankFilter   !== "all" && atm.bank !== bankFilter) return;
      if (statusFilter === "aman"       && (atm.isCompromised || !atm.lastScanned)) return;
      if (statusFilter === "ancaman"    && !atm.isCompromised) return;
      if (statusFilter === "belum_scan" && atm.lastScanned) return;

      total++;
      if (atm.lastScanned) scanned++;
      if (atm.isCompromised) threats++;

      const marker = L.marker([atm.lat, atm.lng], { icon: makeIcon(atm) });
      marker.bindPopup(makePopupHTML(atm), {
        className: "sentinel-popup",
        maxWidth: 260,
      });
      marker.addTo(markersLayer);
    });

    updateStats(total, scanned, threats);
  }

  function updateStats(total, scanned, threats) {
    const els = {
      "stat-total":   total,
      "stat-scanned": scanned,
      "stat-threats": threats,
    };
    Object.entries(els).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });
  }

  // Filter controls
  const citySelect   = document.getElementById("filter-city");
  const bankSelect   = document.getElementById("filter-bank");
  const statusBtns   = document.querySelectorAll("[data-status]");

  // Populate city filter
  if (citySelect) {
    citySelect.innerHTML = `<option value="all">Semua Kota</option>`;
    CITIES.forEach(c => { citySelect.innerHTML += `<option value="${c}">${c}</option>`; });
    citySelect.addEventListener("change", e => { cityFilter = e.target.value; renderMarkers(); });
  }

  // Populate bank filter
  if (bankSelect) {
    bankSelect.innerHTML = `<option value="all">Semua Bank</option>`;
    BANKS.forEach(b => { bankSelect.innerHTML += `<option value="${b}">${b}</option>`; });
    bankSelect.addEventListener("change", e => { bankFilter = e.target.value; renderMarkers(); });
  }

  statusBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      statusBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      statusFilter = btn.dataset.status;
      renderMarkers();
    });
  });

  // Panel toggle (mobile)
  const panelToggle = document.getElementById("panel-toggle");
  const mapPanel    = document.getElementById("map-panel");
  if (panelToggle && mapPanel) {
    panelToggle.addEventListener("click", () => mapPanel.classList.toggle("open"));
  }

  // Initial render
  renderMarkers();
});
