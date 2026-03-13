// EchoFi — Shared Utilities

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function formatDateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function formatConfidence(val) {
  return (val * 100).toFixed(1) + "%";
}

function getThreatLabel(threatType) {
  return THREAT_LABELS[threatType] || null;
}

function renderStatusBadge(result) {
  if (result === "safe" || result === "aman") {
    return `<span class="badge badge-safe">AMAN</span>`;
  } else if (result === "threat_detected" || result === "ancaman") {
    return `<span class="badge badge-danger">ANCAMAN</span>`;
  } else if (result === "scanning") {
    return `<span class="badge badge-scanning">SCANNING...</span>`;
  }
  return `<span class="badge badge-muted">${result}</span>`;
}

function renderATMStatusBadge(atm) {
  if (atm.isCompromised) return `<span class="badge badge-danger">ANCAMAN</span>`;
  if (atm.lastScanned)   return `<span class="badge badge-safe">AMAN</span>`;
  return `<span class="badge badge-muted">BELUM DI-SCAN</span>`;
}

function navigateTo(url) {
  window.location.href = url;
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Navbar active link
function initNavActive() {
  const path = window.location.pathname;
  const filename = path.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === filename || (filename === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// Mobile nav toggle
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu   = document.getElementById("nav-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.classList.toggle("open");
  });
  // Close on link click
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

// Accordion
function initAccordions() {
  document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordion-item");
      const body = item.querySelector(".accordion-body");
      const isOpen = item.classList.contains("open");
      // Close all in same group
      const group = item.closest(".accordion");
      if (group) {
        group.querySelectorAll(".accordion-item").forEach(i => {
          i.classList.remove("open");
        });
      }
      if (!isOpen) item.classList.add("open");
    });
  });
}

// Stat counters animation
function animateCounter(el, target, duration = 1000, decimals = 0) {
  const start = performance.now();
  const startVal = 0;
  function update(ts) {
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;
    el.textContent = decimals > 0
      ? current.toFixed(decimals) + "%"
      : Math.floor(current).toLocaleString("id-ID");
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initStatCounters() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target, 1200, decimals);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

// Init everything on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initNavActive();
  initMobileNav();
  initStatCounters();
});
