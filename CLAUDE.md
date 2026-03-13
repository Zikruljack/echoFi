# CLAUDE.md — echoFi Prototype

## TENTANG PROJECT

echoFi adalah **alat deteksi fraud portable untuk nasabah bank**. User punya device kecil (ESP32), tempelkan ke mesin ATM sebelum transaksi, device scan pakai Wi-Fi CSI untuk deteksi apakah ada skimmer/kamera tersembunyi/keypad palsu terpasang.

**Ini prototype web untuk demo hackathon.** Tidak ada backend, tidak ada database, tidak ada framework. Pure HTML + CSS + JS yang bisa langsung buka di browser. Semua data dummy hardcoded di JS.

---

## TECH STACK

- HTML5
- CSS3 (vanilla, atau boleh pakai Tailwind CDN kalau mempercepat)
- JavaScript vanilla (ES6+)
- Chart.js via CDN (untuk gauge/chart)
- Leaflet.js + OpenStreetMap via CDN (untuk peta)
- Google Fonts (Inter + JetBrains Mono)
- **TIDAK ADA:** Node.js, npm, framework, backend, database, build tool

---

## STRUKTUR FILE

```
echofi/
├── index.html              # Landing page
├── scan.html               # Halaman scan ATM (HERO FEATURE)
├── result.html             # Hasil scan (atau bisa jadi section di scan.html)
├── map.html                # Peta ATM crowd-sourced
├── history.html            # Riwayat scan
├── how-it-works.html       # Penjelasan teknis untuk juri
├── css/
│   └── style.css           # Semua styling
├── js/
│   ├── data.js             # Dummy data ATM, scan results, dll (hardcoded)
│   ├── scan.js             # Logika scan: animasi, waveform, reveal hasil
│   ├── map.js              # Inisialisasi peta Leaflet + markers
│   ├── history.js          # Render riwayat scan
│   ├── waveform.js         # Canvas animation untuk gelombang CSI
│   └── app.js              # Shared utilities, navigation, theme
└── assets/
    └── img/
        └── atm-silhouette.svg  # SVG mesin ATM untuk visualisasi scan
```

---

## KONSEP PRODUK

Nasabah bawa device ESP32 kecil → tempel ke ATM → device scan pakai gelombang Wi-Fi CSI → analisis pantulan gelombang → deteksi benda asing (skimmer, kamera, keypad palsu) → hasil: AMAN atau ANCAMAN.

Seperti metal detector tapi untuk fraud device, pakai gelombang Wi-Fi bukan medan magnet.

Web prototype ini simulasikan pengalaman scan tersebut.

---

## DUMMY DATA (js/data.js)

Semua data hardcoded dalam satu file JS sebagai array/object.

### ATM List (50 ATM)

```js
const ATM_DATA = [
  {
    id: 1,
    code: "ATM-JKT-001",
    bank: "Bank Mandiri",
    location: "Mall Grand Indonesia Lt. B1",
    address: "Jl. MH Thamrin No.1, Jakarta Pusat",
    city: "Jakarta Pusat",
    lat: -6.1954,
    lng: 106.8223,
    isCompromised: false,
    threatType: null,
    threatDescription: null,
    lastScanned: "2026-03-10T14:23:00",
    totalScans: 12,
  },
  {
    id: 7,
    code: "ATM-JKT-007",
    bank: "BCA",
    location: "SPBU Cikini",
    address: "Jl. Cikini Raya No.55, Jakarta Pusat",
    city: "Jakarta Pusat",
    lat: -6.1872,
    lng: 106.8432,
    isCompromised: true,
    threatType: "deep_insert_skimmer",
    threatDescription:
      "Skimmer super tipis terdeteksi di dalam slot kartu. Pola pantulan CSI menunjukkan material asing logam tipis yang tidak sesuai profil mesin standar.",
    lastScanned: "2026-03-12T22:15:00",
    totalScans: 8,
  },
  // ... dst 50 ATM total, 7 compromised
];
```

**7 ATM compromised:**

1. `deep_insert_skimmer` — SPBU malam, Jakarta
2. `deep_insert_skimmer` — ATM pinggir jalan, Surabaya
3. `overlay_skimmer` — Mall sepi, Bandung
4. `overlay_skimmer` — Minimarket, Semarang
5. `hidden_camera` — Dekat pasar, Medan
6. `fake_keypad` — Area kampus, Makassar
7. `multi_threat` — Lokasi terpencil, Denpasar

**43 ATM sisanya:** `isCompromised: false`

Kota: Jakarta Pusat, Jakarta Selatan, Surabaya, Bandung, Medan, Makassar, Semarang, Denpasar. Distribusi merata. Gunakan koordinat nyata.

### Scan History (15 entries)

```js
const SCAN_HISTORY = [
  {
    id: 1,
    atmId: 7,
    atmCode: "ATM-JKT-007",
    bank: "BCA",
    location: "SPBU Cikini",
    city: "Jakarta Pusat",
    date: "2026-03-12T22:15:00",
    result: "threat_detected",
    threatType: "deep_insert_skimmer",
    confidence: 0.891,
    duration: 6.4,
    components: {
      card_slot: { score: 0.89, status: "danger" },
      keypad: { score: 0.08, status: "safe" },
      front_panel: { score: 0.11, status: "safe" },
      camera_area: { score: 0.05, status: "safe" },
    },
  },
  {
    id: 2,
    atmId: 1,
    atmCode: "ATM-JKT-001",
    bank: "Bank Mandiri",
    location: "Mall Grand Indonesia Lt. B1",
    city: "Jakarta Pusat",
    date: "2026-03-12T14:23:00",
    result: "safe",
    threatType: null,
    confidence: 0.972,
    duration: 5.8,
    components: {
      card_slot: { score: 0.04, status: "safe" },
      keypad: { score: 0.06, status: "safe" },
      front_panel: { score: 0.03, status: "safe" },
      camera_area: { score: 0.05, status: "safe" },
    },
  },
  // ... dst 15 entries
];
```

### Waveform Data

```js
// Pola waveform normal — stabil di sekitar baseline
function generateNormalWaveform(length = 100) {
  const baseline = 38.0;
  return Array.from({ length }, () => baseline + (Math.random() - 0.5) * 1.5);
}

// Pola waveform anomali — naik tajam lalu fluktuatif tinggi
function generateAnomalyWaveform(length = 100) {
  const baseline = 38.0;
  return Array.from({ length }, (_, i) => {
    if (i < 10) return baseline + (Math.random() - 0.5) * 1.5;
    const spike = baseline + 25 + (Math.random() - 0.5) * 10;
    return spike;
  });
}
```

### Threat Type Labels

```js
const THREAT_LABELS = {
  deep_insert_skimmer: {
    name: "Deep Insert Skimmer",
    component: "card_slot",
    icon: "💳",
    desc: "Alat skimmer super tipis terdeteksi di dalam slot kartu.",
  },
  overlay_skimmer: {
    name: "Overlay Skimmer",
    component: "card_slot",
    icon: "🔲",
    desc: "Perangkat pembaca kartu palsu ditempel di atas card reader asli.",
  },
  hidden_camera: {
    name: "Hidden Camera",
    component: "camera_area",
    icon: "📷",
    desc: "Kamera pinhole tersembunyi terdeteksi di area atas keypad.",
  },
  fake_keypad: {
    name: "Fake Keypad Overlay",
    component: "keypad",
    icon: "⌨️",
    desc: "Overlay keypad palsu terdeteksi di atas keypad asli.",
  },
  multi_threat: {
    name: "Multiple Threats",
    component: "card_slot",
    icon: "⚠️",
    desc: "Beberapa perangkat fraud terdeteksi sekaligus pada mesin ini.",
  },
};
```

---

## HALAMAN DETAIL

### 1. LANDING PAGE — `index.html`

Simpel, langsung ke poin.

**Konten:**

- Navbar: logo echoFi, link ke Scan / Peta / Riwayat / Cara Kerja
- Hero: tagline "Scan ATM Anda. Deteksi Fraud Sebelum Terjadi."
- Tombol besar: "MULAI SCAN" → ke scan.html
- 3 langkah: Dekatkan Device → Scan → Hasil Instan (dengan ikon sederhana)
- Quick stats dummy: "2,847 ATM di-scan" / "23 ancaman terdeteksi" / "99.2% akurasi"
- Footer minimal

---

### 2. SCAN ATM — `scan.html` (HERO FEATURE, prioritas utama)

Ini yang ditunjukkan ke juri. Harus terlihat canggih tapi tetap jelas.

**Step 1 — Pilih ATM:**

- Dropdown search/filter ATM dari `ATM_DATA`
- Filter by kota dan bank
- Saat ATM dipilih, tampilkan card info: kode, bank, lokasi, alamat
- Tombol besar: "🔍 SCAN SEKARANG"

**Step 2 — Animasi Scan (5-8 detik):**

Saat tombol ditekan:

- Tampilkan area visualisasi scan
- **SVG Silhouette ATM** di tengah — gambar mesin ATM tampak depan
- **Scanning effect:** garis horizontal bergerak dari atas ke bawah berulang (seperti barcode scanner / MRI scan)
- **4 komponen di-highlight bergantian:**
  - Detik 0-2: Slot kartu menyala → "Memindai Slot Kartu..."
  - Detik 2-4: Keypad menyala → "Memindai Keypad..."
  - Detik 4-5: Panel depan menyala → "Memindai Panel Depan..."
  - Detik 5-6: Area kamera menyala → "Memindai Area Kamera..."
  - Detik 6-7: "Menganalisis data CSI..." + AI spinner
- **Waveform canvas** di samping/bawah ATM silhouette — garis sinusoidal bergerak real-time (pakai `<canvas>` + `requestAnimationFrame`)
- **Angka teknis** berubah-ubah selama scan:
  - Signal Strength: 42.3 dBm (berfluktuasi)
  - Phase Variance: 0.023 (berfluktuasi)
  - Anomaly Score: 0.00 → naik pelan kalau ada ancaman
  - Subcarriers: 52/56 active

**Step 3 — Hasil:**

Setelah animasi selesai, transisi ke tampilan hasil.

_Hasil AMAN:_

- Background hijau/teal glow
- Icon besar ✅
- "ATM AMAN — Tidak ditemukan anomali"
- Confidence: 97.2%
- Breakdown 4 komponen: semua centang hijau
- Tombol: "Scan ATM Lain" / "Lihat Detail"

_Hasil ANCAMAN:_

- Background merah glow + pulse
- Icon besar 🔴
- "ANCAMAN TERDETEKSI — [nama threat]"
- Terdeteksi di: [komponen]
- Confidence: 89.1%
- Deskripsi ancaman
- Rekomendasi: JANGAN gunakan ATM ini, hubungi bank
- Breakdown 4 komponen: yang bermasalah merah, sisanya hijau
- Tombol: "LAPORKAN" / "Cari ATM Aman Terdekat"

_Detail Teknis (expandable, untuk juri):_

- Chart bar: anomaly score per komponen (normal vs scan ini)
- Waveform perbandingan: baseline normal vs waveform scan
- Raw data JSON (toggle show/hide)

**Mekanisme:**

- Saat user tekan SCAN, lookup ATM dari `ATM_DATA` by id
- Hasil sudah ditentukan dari `isCompromised` — bukan random
- Animasi tetap jalan 5-8 detik untuk efek dramatis
- Simpan hasil ke `SCAN_HISTORY` (in-memory, hilang saat refresh — tidak apa-apa)

---

### 3. PETA ATM — `map.html`

**Peta crowd-sourced status ATM.**

- Peta fullscreen pakai Leaflet.js + OpenStreetMap tile (gratis, tanpa API key)
- Default view: Indonesia (zoom level ~5)
- Marker setiap ATM dari `ATM_DATA`:
  - 🟢 Hijau: aman (`isCompromised: false` dan pernah di-scan)
  - 🔴 Merah: ancaman (`isCompromised: true`)
  - ⚪ Abu-abu: belum pernah di-scan
- Click marker → popup: kode ATM, bank, lokasi, status, tombol "Scan ATM Ini"
- Panel atas/samping: filter by kota, by bank, by status
- Stats ringkas: total ATM, berapa yang sudah di-scan, berapa ancaman

---

### 4. RIWAYAT SCAN — `history.html`

- Tabel/list dari `SCAN_HISTORY`
- Kolom: tanggal, ATM, bank, lokasi, hasil (badge hijau/merah), confidence
- Click row → expand detail atau modal dengan breakdown komponen
- Filter sederhana: semua / aman / ancaman

---

### 5. CARA KERJA — `how-it-works.html`

Halaman informatif untuk juri. Scrollable single page.

**Sections:**

1. **Masalah:** Skimming ATM makin canggih, CCTV tidak efektif
2. **Solusi:** Device ESP32 portable yang scan via Wi-Fi CSI
3. **Cara Kerja Wi-Fi CSI:** Diagram sederhana — gelombang dipancarkan → memantul → benda asing mengubah pola pantulan → AI deteksi anomali
4. **Jenis Ancaman:** 5 jenis (skimmer, overlay, kamera, keypad, multi) dengan ikon dan penjelasan
5. **Arsitektur:** Diagram flow: Device → Scan → Edge AI → Hasil → Cloud (opsional)
6. **Keunggulan vs Existing:** Tabel perbandingan echoFi vs CCTV vs Anti-Skimming Device
7. **Roadmap:** Timeline → Prototype Web → Hardware MVP → Pilot → Produksi Massal
8. **Spesifikasi:** ESP32, CNN-LSTM, Privacy compliant (tanpa kamera)

Bisa pakai SVG diagram atau HTML/CSS diagram sederhana. Tidak perlu library tambahan.

---

## DESIGN

### Warna (Dark Theme)

```css
:root {
  --bg: #0f1117;
  --bg-card: #1a1d27;
  --bg-hover: #242836;
  --border: #2a2d3a;
  --accent: #00d4aa; /* teal — primary, scan, tech */
  --accent-glow: rgba(0, 212, 170, 0.15);
  --danger: #ef4444;
  --danger-glow: rgba(239, 68, 68, 0.15);
  --warning: #f59e0b;
  --success: #22c55e;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
}
```

### Font

```css
body {
  font-family: "Inter", system-ui, sans-serif;
}
.mono {
  font-family: "JetBrains Mono", monospace;
}
```

Load dari Google Fonts CDN.

### Prinsip

- **Mobile-first** — user pakai HP di depan ATM
- Tombol besar, spacing lega
- Hasil scan harus langsung jelas: warna tegas, teks besar, tidak ambigu
- Detail teknis di balik toggle/accordion
- Animasi scan harus terlihat "bekerja" — bukan cuma spinner
- Semua halaman konsisten dark theme

### Komponen Visual Utama

**Waveform (canvas):**

- Garis sinusoidal bergerak kiri ke kanan terus-menerus
- Warna hijau saat normal, transisi ke merah saat anomali
- Background grid tipis (kesan monitor medis/teknis)

**ATM Silhouette (SVG):**

- Gambar mesin ATM tampak depan, simplified
- 4 area bisa di-highlight: slot kartu (atas), keypad (tengah), panel depan (bawah), area kamera (sudut atas)
- Saat scan, area yang sedang dipindai glow dengan warna accent
- Setelah scan, area bermasalah glow merah, area aman glow hijau

**Anomaly Gauge:**

- Setengah lingkaran (speedometer style)
- 0 (hijau) → 0.5 (kuning) → 1.0 (merah)
- Jarum bergerak animasi ke posisi final

**Status Badge:**

- Pill shape, warna sesuai status
- "AMAN" hijau, "ANCAMAN" merah, "SCANNING..." teal pulse

---

## BUILD ORDER

### Phase 1: Foundation

1. `style.css` — design system lengkap (warna, font, komponen dasar, layout)
2. `js/data.js` — semua dummy data (50 ATM, 15 scan history, threat labels)
3. `js/app.js` — shared utilities (format tanggal, render badge, navigasi)
4. Template HTML dasar dengan navbar yang konsisten

### Phase 2: Scan Page (HERO — kerjakan paling detail)

5. `scan.html` — layout halaman scan
6. `js/waveform.js` — canvas animation gelombang CSI
7. ATM silhouette SVG dengan area yang bisa di-highlight
8. `js/scan.js` — logika lengkap: pilih ATM → animasi → hasil
9. Detail teknis expandable (chart perbandingan, raw data)

### Phase 3: Supporting Pages

10. `index.html` — landing page
11. `map.html` + `js/map.js` — peta Leaflet dengan markers
12. `history.html` + `js/history.js` — tabel riwayat scan
13. `how-it-works.html` — halaman penjelasan teknis

### Phase 4: Polish

14. Responsive check (terutama scan page di mobile)
15. Animasi transisi antar state
16. Loading state & edge cases
17. Test: scan ATM aman + scan ATM compromised → pastikan flow mulus
