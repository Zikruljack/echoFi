# echoFi

**Deteksi Fraud ATM Sebelum Terjadi — Powered by Wi-Fi CSI**

echoFi adalah alat deteksi fraud portable untuk nasabah bank. Bawa device kecil berbasis ESP32, tempelkan ke mesin ATM sebelum transaksi, dan dalam 7 detik device akan memindai menggunakan gelombang Wi-Fi CSI untuk mendeteksi skimmer, kamera tersembunyi, atau keypad palsu.

> Seperti metal detector, tapi untuk fraud device — menggunakan gelombang Wi-Fi, bukan medan magnet.

---

## Demo

Buka `index.html` langsung di browser. Tidak perlu server, tidak perlu instalasi apapun.

**Halaman utama:**
- `index.html` — Landing page
- `scan.html` — **Hero feature:** Simulasi scan ATM dengan animasi CSI
- `map.html` — Peta crowd-sourced status ATM se-Indonesia
- `history.html` — Riwayat scan
- `how-it-works.html` — Penjelasan teknis untuk juri

---

## Cara Kerja

```
Nasabah tempelkan device ke ATM
        ↓
Device kirim sinyal Wi-Fi CSI
        ↓
Sinyal memantul → pola pantulan dianalisis
        ↓
Edge AI (CNN-LSTM) deteksi anomali
        ↓
Hasil: AMAN ✅ atau ANCAMAN 🔴
```

Objek asing seperti skimmer atau overlay keypad mengubah pola pantulan gelombang Wi-Fi secara terukur. echoFi mendeteksi perubahan ini tanpa memerlukan kamera atau koneksi internet.

---

## Jenis Ancaman yang Terdeteksi

| Ancaman | Komponen | Deskripsi |
|---------|----------|-----------|
| Deep Insert Skimmer | Slot kartu | Alat skimmer tipis di dalam card reader |
| Overlay Skimmer | Slot kartu | Pembaca kartu palsu di atas card reader asli |
| Hidden Camera | Area kamera | Kamera pinhole tersembunyi di atas keypad |
| Fake Keypad Overlay | Keypad | Overlay keypad palsu di atas keypad asli |
| Multi-Threat | Beberapa area | Beberapa perangkat fraud sekaligus |

---

## Tech Stack

- **HTML5 + CSS3 + JavaScript vanilla** — tanpa framework, tanpa build tool
- **Chart.js** (CDN) — visualisasi anomaly score
- **Leaflet.js + OpenStreetMap** (CDN) — peta ATM gratis tanpa API key
- **Google Fonts** — Inter + JetBrains Mono

Semua data adalah dummy hardcoded di `js/data.js` (50 ATM, 15 riwayat scan, 7 ATM compromised).

---

## Struktur Proyek

```
echofi/
├── index.html
├── scan.html
├── map.html
├── history.html
├── how-it-works.html
├── css/
│   └── style.css
├── js/
│   ├── data.js        # Dummy data (50 ATM, 15 scan history)
│   ├── scan.js        # Logika scan + animasi
│   ├── map.js         # Peta Leaflet
│   ├── history.js     # Tabel riwayat
│   ├── waveform.js    # Canvas animation gelombang CSI
│   └── app.js         # Shared utilities
└── assets/
    └── img/
        └── atm-silhouette.svg
```

---

## Keunggulan vs Solusi Existing

| Fitur | echoFi | CCTV | Anti-Skimming Konvensional |
|-------|--------|------|---------------------------|
| Deteksi sebelum transaksi | ✓ | ✗ | ~ |
| Deteksi deep insert skimmer | ✓ | ✗ | ✗ |
| Privasi (tanpa kamera) | ✓ | ✗ | ✓ |
| Portabel (dibawa pengguna) | ✓ | ✗ | ✗ |
| Offline / Edge AI | ✓ | ✗ | ✓ |
| Crowdsourced database | ✓ | ✗ | ✗ |

---

## Hardware Target

- **Device:** ESP32 (Wi-Fi CSI capable)
- **Model AI:** CNN-LSTM, berjalan ondevice (edge computing)
- **Form factor:** Kartu tipis, muat di dompet
- **Target harga:** Rp 150.000/unit

---

## Roadmap

1. **Sekarang** — Prototype web (hackathon demo)
2. **Q2 2026** — Hardware MVP (ESP32 fisik)
3. **Q3 2026** — Pilot dengan bank mitra
4. **Q4 2026** — Produksi massal

---

*Dibuat untuk hackathon SENTINEL-FI 2026. Prototype demo — bukan produk production.*
