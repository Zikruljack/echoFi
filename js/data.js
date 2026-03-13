// echoFi — Dummy Data
// Semua data hardcoded, tidak ada backend

const ATM_DATA = [
  // === JAKARTA PUSAT ===
  { id:1,  code:"ATM-JKT-001", bank:"Bank Mandiri", location:"Mall Grand Indonesia Lt. B1",     address:"Jl. MH Thamrin No.1, Jakarta Pusat",        city:"Jakarta Pusat",   lat:-6.1954, lng:106.8223, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-10T14:23:00", totalScans:12 },
  { id:2,  code:"ATM-JKT-002", bank:"BCA",          location:"Plaza Indonesia Lt. 1",            address:"Jl. MH Thamrin Kav.28-30, Jakarta Pusat",   city:"Jakarta Pusat",   lat:-6.1931, lng:106.8218, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-11T09:45:00", totalScans:7  },
  { id:3,  code:"ATM-JKT-003", bank:"BNI",          location:"Stasiun Gambir",                   address:"Jl. Medan Merdeka Tim., Jakarta Pusat",     city:"Jakarta Pusat",   lat:-6.1765, lng:106.8306, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-09T17:10:00", totalScans:21 },
  { id:4,  code:"ATM-JKT-004", bank:"BRI",          location:"Pasar Senen Blok III",             address:"Jl. Pasar Senen, Jakarta Pusat",             city:"Jakarta Pusat",   lat:-6.1756, lng:106.8446, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:5,  code:"ATM-JKT-005", bank:"CIMB Niaga",   location:"Wisma GKBI",                       address:"Jl. Jenderal Sudirman No.28, Jakarta Pusat", city:"Jakarta Pusat",   lat:-6.2050, lng:106.8201, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-08T11:30:00", totalScans:5  },
  { id:6,  code:"ATM-JKT-006", bank:"Danamon",      location:"Indomaret Cikini",                  address:"Jl. Cikini Raya No.12, Jakarta Pusat",      city:"Jakarta Pusat",   lat:-6.1891, lng:106.8401, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:7,  code:"ATM-JKT-007", bank:"BCA",          location:"SPBU Cikini",                      address:"Jl. Cikini Raya No.55, Jakarta Pusat",      city:"Jakarta Pusat",   lat:-6.1872, lng:106.8432, isCompromised:true,  threatType:"deep_insert_skimmer", threatDescription:"Skimmer super tipis terdeteksi di dalam slot kartu. Pola pantulan CSI menunjukkan material asing logam tipis yang tidak sesuai profil mesin standar.", lastScanned:"2026-03-12T22:15:00", totalScans:8 },
  { id:8,  code:"ATM-JKT-008", bank:"Bank Mandiri", location:"RS Cipto Mangunkusumo",             address:"Jl. Diponegoro No.71, Jakarta Pusat",        city:"Jakarta Pusat",   lat:-6.1985, lng:106.8456, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-07T08:20:00", totalScans:3  },

  // === JAKARTA SELATAN ===
  { id:9,  code:"ATM-JKS-001", bank:"BCA",          location:"Mall Pondok Indah Lt. GF",         address:"Jl. Metro Pondok Indah, Jakarta Selatan",    city:"Jakarta Selatan", lat:-6.2656, lng:106.7836, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T13:10:00", totalScans:18 },
  { id:10, code:"ATM-JKS-002", bank:"BNI",          location:"Stasiun MRT Blok M",               address:"Jl. Bulungan, Jakarta Selatan",              city:"Jakarta Selatan", lat:-6.2441, lng:106.7998, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-11T16:45:00", totalScans:11 },
  { id:11, code:"ATM-JKS-003", bank:"BRI",          location:"Gandaria City Mall",               address:"Jl. Sultan Iskandar Muda, Jakarta Selatan",  city:"Jakarta Selatan", lat:-6.2441, lng:106.7833, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-10T10:00:00", totalScans:9  },
  { id:12, code:"ATM-JKS-004", bank:"Permata",      location:"Kemang Village",                   address:"Jl. Kemang Raya, Jakarta Selatan",           city:"Jakarta Selatan", lat:-6.2612, lng:106.8144, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:13, code:"ATM-JKS-005", bank:"Bank Mandiri", location:"Plaza Senayan",                    address:"Jl. Asia Afrika No.8, Jakarta Selatan",      city:"Jakarta Selatan", lat:-6.2253, lng:106.8012, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-09T14:30:00", totalScans:6  },
  { id:14, code:"ATM-JKS-006", bank:"CIMB Niaga",   location:"Minimarket Fatmawati",              address:"Jl. RS Fatmawati No.78, Jakarta Selatan",    city:"Jakarta Selatan", lat:-6.2895, lng:106.7978, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },

  // === SURABAYA ===
  { id:15, code:"ATM-SBY-005", bank:"BRI",          location:"Jl. Raya Darmo (Pinggir Jalan)",   address:"Jl. Raya Darmo No.135, Surabaya",           city:"Surabaya",        lat:-7.2891, lng:112.7341, isCompromised:true,  threatType:"deep_insert_skimmer", threatDescription:"Skimmer terintegrasi dalam slot kartu. CSI mendeteksi lapisan logam asing tipis ~0.3mm di dalam card reader. Terdeteksi malam hari jam 23:00.", lastScanned:"2026-03-11T23:05:00", totalScans:4 },
  { id:16, code:"ATM-SBY-001", bank:"Bank Mandiri", location:"Tunjungan Plaza Lt. B1",           address:"Jl. Embong Malang No.35, Surabaya",         city:"Surabaya",        lat:-7.2574, lng:112.7382, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T10:15:00", totalScans:14 },
  { id:17, code:"ATM-SBY-002", bank:"BCA",          location:"Galaxy Mall",                      address:"Jl. Dharmahusada Indah Tim. No.35, Surabaya", city:"Surabaya",       lat:-7.2669, lng:112.7748, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-10T18:20:00", totalScans:8  },
  { id:18, code:"ATM-SBY-003", bank:"BNI",          location:"Stasiun Surabaya Gubeng",          address:"Jl. Gubeng No.1, Surabaya",                 city:"Surabaya",        lat:-7.2650, lng:112.7519, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-08T07:40:00", totalScans:22 },
  { id:19, code:"ATM-SBY-004", bank:"Danamon",      location:"ITC Surabaya",                     address:"Jl. Gembong No.20, Surabaya",               city:"Surabaya",        lat:-7.2430, lng:112.7405, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:20, code:"ATM-SBY-006", bank:"Permata",      location:"Pakuwon Mall",                     address:"Jl. Puncak Indah Lontar No.2, Surabaya",    city:"Surabaya",        lat:-7.2906, lng:112.6874, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-11T14:00:00", totalScans:6  },

  // === BANDUNG ===
  { id:21, code:"ATM-BDG-001", bank:"BCA",          location:"Paris Van Java Mall",              address:"Jl. Sukajadi No.137-139, Bandung",           city:"Bandung",         lat:-6.8917, lng:107.5944, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T11:30:00", totalScans:10 },
  { id:22, code:"ATM-BDG-002", bank:"BNI",          location:"Stasiun Bandung",                  address:"Jl. Kebon Kawung No.43, Bandung",            city:"Bandung",         lat:-6.9146, lng:107.5993, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-09T09:00:00", totalScans:17 },
  { id:23, code:"ATM-BDG-003", bank:"Bank Mandiri", location:"Bandung Indah Plaza (Mall Sepi)",  address:"Jl. Merdeka No.56, Bandung",                 city:"Bandung",         lat:-6.9147, lng:107.6098, isCompromised:true,  threatType:"overlay_skimmer", threatDescription:"Overlay card reader palsu terdeteksi di atas card reader asli. Material plastik keras dengan magnetik strip reader tersembunyi. CSI mendeteksi ketebalan tambahan 4-5mm.", lastScanned:"2026-03-10T21:40:00", totalScans:3 },
  { id:24, code:"ATM-BDG-004", bank:"BRI",          location:"Trans Studio Mall Bandung",        address:"Jl. Gatot Subroto No.289, Bandung",          city:"Bandung",         lat:-6.9233, lng:107.6411, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:25, code:"ATM-BDG-005", bank:"CIMB Niaga",   location:"Braga City Walk",                  address:"Jl. Braga No.99, Bandung",                  city:"Bandung",         lat:-6.9169, lng:107.6052, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-07T15:55:00", totalScans:5  },
  { id:26, code:"ATM-BDG-006", bank:"Danamon",      location:"Cihampelas Walk",                  address:"Jl. Cihampelas No.160, Bandung",             city:"Bandung",         lat:-6.9029, lng:107.6072, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },

  // === MEDAN ===
  { id:27, code:"ATM-MDN-001", bank:"Bank Mandiri", location:"Sun Plaza Medan",                  address:"Jl. KH Zainul Arifin No.7, Medan",          city:"Medan",           lat:3.5900,  lng:98.6602, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T08:30:00", totalScans:9  },
  { id:28, code:"ATM-MDN-002", bank:"BCA",          location:"Medan Fair Plaza",                 address:"Jl. Gatot Subroto No.30, Medan",             city:"Medan",           lat:3.5955,  lng:98.6724, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-11T12:45:00", totalScans:7  },
  { id:29, code:"ATM-MDN-003", bank:"BNI",          location:"Stasiun Medan",                    address:"Jl. Stasiun No.1, Medan",                   city:"Medan",           lat:3.5896,  lng:98.6694, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:30, code:"ATM-MDN-005", bank:"BRI",          location:"Hermes Palace Mall",               address:"Jl. Kapten Maulana Lubis, Medan",            city:"Medan",           lat:3.5843,  lng:98.6701, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-10T16:10:00", totalScans:4  },
  { id:38, code:"ATM-MDN-004", bank:"BCA",          location:"Pasar Petisah Area",               address:"Jl. Kota Baru, Medan",                      city:"Medan",           lat:3.5952,  lng:98.6722, isCompromised:true,  threatType:"hidden_camera", threatDescription:"Kamera pinhole tersembunyi terdeteksi di sudut atas panel ATM. Ukuran ~2mm, disembunyikan di balik stiker ATM palsu. CSI mendeteksi komponen elektronik asing di area kamera.", lastScanned:"2026-03-12T19:30:00", totalScans:6 },
  { id:32, code:"ATM-MDN-006", bank:"CIMB Niaga",   location:"Ringroad City Walk",               address:"Jl. Ringroad No.1, Medan",                  city:"Medan",           lat:3.5743,  lng:98.6533, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },

  // === SEMARANG ===
  { id:31, code:"ATM-SMG-001", bank:"BNI",          location:"Minimarket Jl. Ahmad Yani",        address:"Jl. Ahmad Yani No.34, Semarang",             city:"Semarang",        lat:-6.9932, lng:110.4203, isCompromised:true,  threatType:"overlay_skimmer", threatDescription:"Overlay keyboard palsu dengan card reader tersembunyi di atas keypad. Terdeteksi di ATM sudut minimarket. Pola CSI menunjukkan lapisan material non-standar setebal 6mm.", lastScanned:"2026-03-11T20:55:00", totalScans:5 },
  { id:33, code:"ATM-SMG-002", bank:"Bank Mandiri", location:"Paragon Mall Semarang",            address:"Jl. Pemuda No.118, Semarang",                city:"Semarang",        lat:-6.9838, lng:110.4133, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T09:20:00", totalScans:11 },
  { id:34, code:"ATM-SMG-003", bank:"BCA",          location:"Simpang Lima",                     address:"Jl. Simpang Lima, Semarang",                 city:"Semarang",        lat:-6.9933, lng:110.4104, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-10T13:00:00", totalScans:8  },
  { id:35, code:"ATM-SMG-004", bank:"BRI",          location:"Stasiun Tawang",                   address:"Jl. Taman Tawang No.1, Semarang",            city:"Semarang",        lat:-6.9665, lng:110.4259, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:36, code:"ATM-SMG-005", bank:"Permata",      location:"DP Mall Semarang",                 address:"Jl. Pemuda No.150, Semarang",                city:"Semarang",        lat:-6.9822, lng:110.4111, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-08T16:30:00", totalScans:3  },

  // === MAKASSAR ===
  { id:37, code:"ATM-MKS-001", bank:"Bank Mandiri", location:"Trans Studio Mall Makassar",       address:"Jl. Boulevard, Makassar",                   city:"Makassar",        lat:-5.1488, lng:119.4328, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T14:50:00", totalScans:7  },
  { id:44, code:"ATM-MKS-002", bank:"BRI",          location:"Kampus UNHAS",                     address:"Jl. Perintis Kemerdekaan KM.10, Makassar",  city:"Makassar",        lat:-5.1477, lng:119.4327, isCompromised:true,  threatType:"fake_keypad", threatDescription:"Overlay keypad palsu terdeteksi di atas keypad asli. Keypad palsu memiliki komponen wireless transmitter tersembunyi. CSI mendeteksi sinyal RF tidak wajar di area keypad.", lastScanned:"2026-03-12T16:20:00", totalScans:9 },
  { id:39, code:"ATM-MKS-003", bank:"BCA",          location:"Mal Panakkukang",                  address:"Jl. Boulevard Panakkukang, Makassar",        city:"Makassar",        lat:-5.1422, lng:119.4461, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-11T11:00:00", totalScans:5  },
  { id:40, code:"ATM-MKS-004", bank:"BNI",          location:"Bandara Sultan Hasanuddin",        address:"Jl. Bandara Lama, Makassar",                 city:"Makassar",        lat:-5.0616, lng:119.5538, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-10T07:15:00", totalScans:13 },
  { id:41, code:"ATM-MKS-005", bank:"CIMB Niaga",   location:"Losari Beach Mall",                address:"Jl. Penghibur No.1, Makassar",               city:"Makassar",        lat:-5.1452, lng:119.4103, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },

  // === DENPASAR ===
  { id:42, code:"ATM-DPS-001", bank:"BCA",          location:"Mal Bali Galeria",                 address:"Jl. Bypass Ngurah Rai No.1, Denpasar",      city:"Denpasar",        lat:-8.7095, lng:115.1771, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T10:40:00", totalScans:16 },
  { id:43, code:"ATM-DPS-002", bank:"BNI",          location:"Bandara I Gusti Ngurah Rai",       address:"Jl. Airport Ngurah Rai, Denpasar",          city:"Denpasar",        lat:-8.7484, lng:115.1671, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-11T06:00:00", totalScans:28 },
  { id:49, code:"ATM-DPS-003", bank:"Bank Mandiri", location:"Jl. Bypass Ngurah Rai (Terpencil)", address:"Jl. Bypass Ngurah Rai No.99, Denpasar",    city:"Denpasar",        lat:-8.7435, lng:115.1812, isCompromised:true,  threatType:"multi_threat", threatDescription:"Beberapa perangkat fraud terdeteksi: overlay card reader + kamera pinhole + wireless skimmer. Lokasi terpencil memudahkan pemasangan. Kondisi mesin sangat berbahaya.", lastScanned:"2026-03-12T01:10:00", totalScans:2 },
  { id:45, code:"ATM-DPS-004", bank:"BRI",          location:"Pasar Badung",                     address:"Jl. Gajah Mada, Denpasar",                  city:"Denpasar",        lat:-8.6524, lng:115.2125, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-09T13:20:00", totalScans:6  },
  { id:46, code:"ATM-DPS-005", bank:"Permata",      location:"Kuta Square",                      address:"Jl. Legian, Kuta, Denpasar",                city:"Denpasar",        lat:-8.7180, lng:115.1717, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
  { id:47, code:"ATM-DPS-006", bank:"Danamon",      location:"Beachwalk Kuta",                   address:"Jl. Pantai Kuta No.1, Denpasar",            city:"Denpasar",        lat:-8.7202, lng:115.1684, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-12T19:00:00", totalScans:4  },

  // === EXTRA JAKARTA PUSAT (lengkap 50) ===
  { id:48, code:"ATM-JKT-009", bank:"BNI",          location:"Mal Taman Anggrek",                address:"Jl. Letjen S. Parman Kav.21, Jakarta",      city:"Jakarta Pusat",   lat:-6.1773, lng:106.7975, isCompromised:false, threatType:null, threatDescription:null, lastScanned:"2026-03-11T15:30:00", totalScans:10 },
  { id:50, code:"ATM-JKT-010", bank:"Bank Mandiri", location:"Kantor Pos Jakarta Pusat",         address:"Jl. Pos No.2, Jakarta Pusat",               city:"Jakarta Pusat",   lat:-6.1714, lng:106.8309, isCompromised:false, threatType:null, threatDescription:null, lastScanned:null,                   totalScans:0  },
];

// Runtime scan history (ditambah saat user scan)
let SCAN_HISTORY = [
  { id:1,  atmId:7,  atmCode:"ATM-JKT-007", bank:"BCA",          location:"SPBU Cikini",                       city:"Jakarta Pusat",   date:"2026-03-12T22:15:00", result:"threat_detected", threatType:"deep_insert_skimmer", confidence:0.891, duration:6.4, components:{ card_slot:{score:0.89,status:"danger"}, keypad:{score:0.08,status:"safe"}, front_panel:{score:0.11,status:"safe"}, camera_area:{score:0.05,status:"safe"} } },
  { id:2,  atmId:1,  atmCode:"ATM-JKT-001", bank:"Bank Mandiri", location:"Mall Grand Indonesia Lt. B1",       city:"Jakarta Pusat",   date:"2026-03-12T14:23:00", result:"safe",             threatType:null,                  confidence:0.972, duration:5.8, components:{ card_slot:{score:0.04,status:"safe"},  keypad:{score:0.06,status:"safe"}, front_panel:{score:0.03,status:"safe"}, camera_area:{score:0.05,status:"safe"} } },
  { id:3,  atmId:15, atmCode:"ATM-SBY-005", bank:"BRI",          location:"Jl. Raya Darmo (Pinggir Jalan)",    city:"Surabaya",        date:"2026-03-11T23:05:00", result:"threat_detected", threatType:"deep_insert_skimmer", confidence:0.876, duration:7.1, components:{ card_slot:{score:0.87,status:"danger"}, keypad:{score:0.06,status:"safe"}, front_panel:{score:0.04,status:"safe"}, camera_area:{score:0.09,status:"safe"} } },
  { id:4,  atmId:16, atmCode:"ATM-SBY-001", bank:"Bank Mandiri", location:"Tunjungan Plaza Lt. B1",            city:"Surabaya",        date:"2026-03-12T10:15:00", result:"safe",             threatType:null,                  confidence:0.951, duration:5.2, components:{ card_slot:{score:0.05,status:"safe"},  keypad:{score:0.04,status:"safe"}, front_panel:{score:0.07,status:"safe"}, camera_area:{score:0.03,status:"safe"} } },
  { id:5,  atmId:23, atmCode:"ATM-BDG-003", bank:"Bank Mandiri", location:"Bandung Indah Plaza (Mall Sepi)",   city:"Bandung",         date:"2026-03-10T21:40:00", result:"threat_detected", threatType:"overlay_skimmer",     confidence:0.834, duration:6.8, components:{ card_slot:{score:0.83,status:"danger"}, keypad:{score:0.12,status:"safe"}, front_panel:{score:0.09,status:"safe"}, camera_area:{score:0.07,status:"safe"} } },
  { id:6,  atmId:21, atmCode:"ATM-BDG-001", bank:"BCA",          location:"Paris Van Java Mall",               city:"Bandung",         date:"2026-03-12T11:30:00", result:"safe",             threatType:null,                  confidence:0.963, duration:5.5, components:{ card_slot:{score:0.06,status:"safe"},  keypad:{score:0.03,status:"safe"}, front_panel:{score:0.05,status:"safe"}, camera_area:{score:0.04,status:"safe"} } },
  { id:7,  atmId:31, atmCode:"ATM-SMG-001", bank:"BNI",          location:"Minimarket Jl. Ahmad Yani",         city:"Semarang",        date:"2026-03-11T20:55:00", result:"threat_detected", threatType:"overlay_skimmer",     confidence:0.812, duration:7.4, components:{ card_slot:{score:0.81,status:"danger"}, keypad:{score:0.15,status:"safe"}, front_panel:{score:0.08,status:"safe"}, camera_area:{score:0.11,status:"safe"} } },
  { id:8,  atmId:33, atmCode:"ATM-SMG-002", bank:"Bank Mandiri", location:"Paragon Mall Semarang",             city:"Semarang",        date:"2026-03-12T09:20:00", result:"safe",             threatType:null,                  confidence:0.944, duration:5.9, components:{ card_slot:{score:0.07,status:"safe"},  keypad:{score:0.05,status:"safe"}, front_panel:{score:0.04,status:"safe"}, camera_area:{score:0.06,status:"safe"} } },
  { id:9,  atmId:38, atmCode:"ATM-MDN-004", bank:"BCA",          location:"Pasar Petisah Area",                city:"Medan",           date:"2026-03-12T19:30:00", result:"threat_detected", threatType:"hidden_camera",       confidence:0.867, duration:6.2, components:{ card_slot:{score:0.08,status:"safe"},  keypad:{score:0.06,status:"safe"}, front_panel:{score:0.09,status:"safe"}, camera_area:{score:0.86,status:"danger"} } },
  { id:10, atmId:27, atmCode:"ATM-MDN-001", bank:"Bank Mandiri", location:"Sun Plaza Medan",                   city:"Medan",           date:"2026-03-12T08:30:00", result:"safe",             threatType:null,                  confidence:0.978, duration:5.3, components:{ card_slot:{score:0.03,status:"safe"},  keypad:{score:0.04,status:"safe"}, front_panel:{score:0.05,status:"safe"}, camera_area:{score:0.02,status:"safe"} } },
  { id:11, atmId:44, atmCode:"ATM-MKS-002", bank:"BRI",          location:"Kampus UNHAS",                      city:"Makassar",        date:"2026-03-12T16:20:00", result:"threat_detected", threatType:"fake_keypad",         confidence:0.849, duration:7.6, components:{ card_slot:{score:0.09,status:"safe"},  keypad:{score:0.84,status:"danger"}, front_panel:{score:0.07,status:"safe"}, camera_area:{score:0.11,status:"safe"} } },
  { id:12, atmId:37, atmCode:"ATM-MKS-001", bank:"Bank Mandiri", location:"Trans Studio Mall Makassar",        city:"Makassar",        date:"2026-03-12T14:50:00", result:"safe",             threatType:null,                  confidence:0.957, duration:5.7, components:{ card_slot:{score:0.05,status:"safe"},  keypad:{score:0.07,status:"safe"}, front_panel:{score:0.04,status:"safe"}, camera_area:{score:0.06,status:"safe"} } },
  { id:13, atmId:49, atmCode:"ATM-DPS-003", bank:"Bank Mandiri", location:"Jl. Bypass Ngurah Rai (Terpencil)", city:"Denpasar",        date:"2026-03-12T01:10:00", result:"threat_detected", threatType:"multi_threat",        confidence:0.923, duration:7.8, components:{ card_slot:{score:0.91,status:"danger"}, keypad:{score:0.72,status:"danger"}, front_panel:{score:0.15,status:"safe"}, camera_area:{score:0.88,status:"danger"} } },
  { id:14, atmId:42, atmCode:"ATM-DPS-001", bank:"BCA",          location:"Mal Bali Galeria",                  city:"Denpasar",        date:"2026-03-12T10:40:00", result:"safe",             threatType:null,                  confidence:0.969, duration:5.6, components:{ card_slot:{score:0.04,status:"safe"},  keypad:{score:0.05,status:"safe"}, front_panel:{score:0.03,status:"safe"}, camera_area:{score:0.04,status:"safe"} } },
  { id:15, atmId:9,  atmCode:"ATM-JKS-001", bank:"BCA",          location:"Mall Pondok Indah Lt. GF",          city:"Jakarta Selatan", date:"2026-03-12T13:10:00", result:"safe",             threatType:null,                  confidence:0.981, duration:5.4, components:{ card_slot:{score:0.02,status:"safe"},  keypad:{score:0.03,status:"safe"}, front_panel:{score:0.04,status:"safe"}, camera_area:{score:0.02,status:"safe"} } },
];

let _nextHistoryId = 16;

const THREAT_LABELS = {
  deep_insert_skimmer: { name:"Deep Insert Skimmer",   component:"card_slot",   icon:"💳", desc:"Alat skimmer super tipis terdeteksi di dalam slot kartu." },
  overlay_skimmer:     { name:"Overlay Skimmer",        component:"card_slot",   icon:"🔲", desc:"Perangkat pembaca kartu palsu ditempel di atas card reader asli." },
  hidden_camera:       { name:"Hidden Camera",           component:"camera_area", icon:"📷", desc:"Kamera pinhole tersembunyi terdeteksi di area atas keypad." },
  fake_keypad:         { name:"Fake Keypad Overlay",    component:"keypad",      icon:"⌨️", desc:"Overlay keypad palsu terdeteksi di atas keypad asli." },
  multi_threat:        { name:"Multiple Threats",        component:"card_slot",   icon:"⚠️", desc:"Beberapa perangkat fraud terdeteksi sekaligus pada mesin ini." },
};

const COMPONENT_LABELS = {
  card_slot:   { name:"Slot Kartu",    icon:"💳" },
  keypad:      { name:"Keypad",        icon:"⌨️" },
  front_panel: { name:"Panel Depan",   icon:"🖥️" },
  camera_area: { name:"Area Kamera",   icon:"📷" },
};

function generateNormalWaveform(length = 100) {
  const baseline = 38.0;
  return Array.from({ length }, () => baseline + (Math.random() - 0.5) * 1.5);
}

function generateAnomalyWaveform(length = 100) {
  const baseline = 38.0;
  return Array.from({ length }, (_, i) => {
    if (i < 10) return baseline + (Math.random() - 0.5) * 1.5;
    return baseline + 25 + (Math.random() - 0.5) * 10;
  });
}

function addToHistory(entry) {
  entry.id = _nextHistoryId++;
  SCAN_HISTORY.unshift(entry);
}

function getATMById(id) {
  return ATM_DATA.find(a => a.id === id);
}

function getHistoryForATM(atmId) {
  return SCAN_HISTORY.filter(h => h.atmId === atmId);
}

// Kota & bank lists
const CITIES = [...new Set(ATM_DATA.map(a => a.city))].sort();
const BANKS  = [...new Set(ATM_DATA.map(a => a.bank))].sort();
