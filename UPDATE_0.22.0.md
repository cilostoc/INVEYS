# INVEYS 0.22.0 — Arsitektur 4 Segmen VPS, 1-Klik Pembaruan Otomatis, Visualisasi Heatmap Treemap, Penyempurnaan Sankey Cash Flow, dan Standarisasi Penamaan Versi

Tanggal rilis: 17 Oktober 2026. Pembaruan **v0.22.0** merupakan tonggak penting dalam keandalan deployment produksi (*VPS Operations*), modernisasi visualisasi data finansial, kehalusan antarmuka interaktif, dan pembentukan protokol baku penamaan versi aplikasi (*Automated Semantic Versioning*).

---

## Ringkasan Matriks Pembaruan v0.22.0

| Pilar Pembaruan | Kondisi Sebelumnya (v0.21.0) | Peningkatan & Solusi di v0.22.0 |
|---|---|---|
| **1. Arsitektur 4 Segmen VPS & 1-Klik Update** | Update VPS dilakukan manual; risiko penimpaan file database dan potensi downtime | Pengelompokan arsitektur ke 4 segmen terisolasi (*Client, Backend, Vault, Pipeline*) dan tombol 1-Klik Update dengan snapshot backup SQLite otomatis, kompilasi mandiri, verifikasi SHA-256, dan hot-reload aman tanpa downtime |
| **2. Standarisasi Penamaan Versi (Semantic Versioning)** | Penamaan versi tersebar di beberapa file secara manual | Standardisasi baku `vMAJOR.MINOR.PATCH` tersinkronisasi di seluruh file inti (`serve.py`, `package.json`, `build-manifest.json`, `releases.json`, `releases.js`, `sw.js`, `CHANGELOG.md`) |
| **3. Visualisasi Financial Heatmap Treemap** | Heatmap memerlukan scroll vertikal/horizontal yang melelahkan; tombol toggle sistem 1-klik terpisah | Heatmap proporsional berbasis Treemap adaptif tanpa scroll; antarmuka Reports ditingkatkan dengan menu dropdown pilihan visualisasi (*Sankey, Donut, Bar, Heatmap*) |
| **4. Diagram Alir Kas Sankey Multi-Tier** | Garis aliran tipis saling menyilang (*criss-crossing*); teks hub vertikal miring -90°; teks label kategori bertumpukan | Aliran lurus tanpa silang (*Zero Criss-Crossing*); pita aliran volumetrik kubik Bezier bergradien warna halus; kartu badge horizontal total inflow; tata letak lapang bebas tumpukan teks |
| **5. Grafik Investasi Vibrant & Gain/Loss Dinamis** | Grafik kurva investasi kurang kontras; warna teks gain/loss statis | Peningkatan vibransi kurva performa investasi dan warna teks dinamis otomatis (*vibrant emerald* saat untung, *vibrant coral red* saat rugi) |
| **6. Sakelar Geser Interaktif (Slide Switch)** | Ghost mode dan tema Dark/Light menggunakan tombol klik statis | Sistem sakelar geser horizontal (*Slide Switch*) dengan pegangan handle mulus dan aksesibilitas ARIA penuh |
| **7. Pembersihan Jurnal Transaksi** | Transaksi sumber memiliki status dot lingkaran dan konversi nominal ganda | Menghilangkan status dot dan nominal ganda sehingga tabel transaksi tampil bersih, rapi, dan mudah dibaca |
| **8. Perapihan Navigasi Sidebar Planning** | Terdapat sub-tombol nested `[ Scenarios | Monte Carlo ]` di sidebar yang mengganggu kerapihan | Menghilangkan sub-tombol dari sidebar; opsi simulasi tetap diakses nyaman melalui tab pengalih di dalam halaman |

---

## 1. Standarisasi Penamaan Versi & Siklus Rilis (SOP Versioning)

Untuk memastikan kelanjutan penamaan aplikasi pada setiap update versi berikutnya, INVEYS menerapkan konvensi versi semantik terpadu:

### Format: `vMAJOR.MINOR.PATCH`
1. **MAJOR (v1.0.0, v2.0.0, ...)**:
   - Perubahan arsitektur sistem skala besar, migrasi database yang mengubah skema secara fundamental, atau peluncuran edisi multi-tenant komersial publik.
2. **MINOR (v0.21.0, v0.22.0, v0.23.0, ...)**:
   - Penambahan modul/fitur baru, perombakan visualisasi data, integrasi eksternal baru (seperti CEX, AI provider), atau peningkatan arsitektur deployment.
3. **PATCH (v0.22.1, v0.22.2, ...)**:
   - Perbaikan bug fungsional (*bug fixes*), penyesuaian estetika mikro, perbaikan keamanan, atau optimasi kinerja tanpa mengubah alur kerja utama.

### Prosedur Sinkronisasi Penamaan Berkas Rilis
Setiap pembaruan versi wajib memperbarui berkas-berkas berikut secara serempak:
1. `package.json` -> Nilai `"version": "X.Y.Z"`
2. `serve.py` -> Konstanta global `VERSION = 'X.Y.Z'`
3. `build-manifest.json` -> Nilai `"version": "X.Y.Z"` dan checksum SHA-256 berkas `inveys-app.html`
4. `sw.js` -> Nama cache `const CACHE_NAME = 'inveys-vX.Y.Z-cache'`
5. `releases.json` & `releases.js` -> Penambahan entri rilis terbaru (versi, tanggal, dan riwayat perubahan dwibahasa ID & EN)
6. `CHANGELOG.md` & `UPDATE_X.Y.Z.md` -> Dokumentasi perubahan teknis dan panduan pengguna
7. `tests/backend_test.py` -> Validasi otomatis endpoint versi `/api/status` dan `/api/vps/update`
8. Berkas distribusi arsip rilis -> `inveys-vX.Y.Z-vps-ready.zip`

---

## 2. Arsitektur 4 Segmen & Pembaruan VPS 1-Klik

Sistem kini terbagi menjadi 4 segmen terisolasi untuk memudahkan pemeliharaan pada server VPS Hostinger (KVM 4) dan server Linux mandiri:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     INVEYS SYSTEM ARCHITECTURE                          │
├───────────────────────┬─────────────────────────────────────────────────┤
│ SEGMEN 1: CLIENT/PWA  │ • inveys-app.html (Bundle mandiri bebas CDN)    │
│                       │ • styles.css, icon.svg, sw.js (Offline PWA)     │
├───────────────────────┼─────────────────────────────────────────────────┤
│ SEGMEN 2: BACKEND     │ • serve.py (Python daemon & API Gateway)        │
│                       │ • inveys_ai.py, inveys_crypto.py, OCR engine    │
├───────────────────────┼─────────────────────────────────────────────────┤
│ SEGMEN 3: DATA VAULT  │ • ~/.inveys/inbox.sqlite3 (Database terisolasi) │
│                       │ • ~/.inveys/backups/ (Snapshot cadangan aman)   │
├───────────────────────┼─────────────────────────────────────────────────┤
│ SEGMEN 4: PIPELINE    │ • build.py & build-manifest.json (Integritas)   │
│                       │ • 1-Klik VPS Update Engine via Admin Dashboard  │
└───────────────────────┴─────────────────────────────────────────────────┘
```

### Alur 1-Klik Pembaruan VPS:
1. **Pre-flight Snapshot**: Membuat salinan cadangan instan seluruh catatan buku besar SQLite ke `~/.inveys/backups/`.
2. **Rebuild Standalone**: Mengompilasi ulang berkas `inveys-app.html` dari kode sumber terbaru.
3. **Checksum Verification**: Menghitung dan mencocokkan SHA-256 untuk memastikan tidak ada berkas yang rusak.
4. **Hot-Reload Services**: Layanan memuat ulang kode baru tanpa downtime dan tanpa memutus koneksi pengguna.

---

## 3. Visualisasi Data Heatmap & Laporan Finansial

- **Financial Heatmap Treemap**: Menghadirkan visualisasi proporsi belanja dan alokasi modal dalam bentuk treemap interaktif satu layar penuh, bebas dari kebutuhan scroll vertikal ataupun horizontal.
- **Pilihan Visualisasi Proporsional**: Pada submenu Reports, pemilihan visualisasi grafik (Sankey, Donut, Bar, Heatmap) diubah dari tombol satu-klik menjadi menu dropdown proporsional yang rapi.

---

## 4. Total Overhaul Diagram Alir Kas Sankey Multi-Tier

Diagram aliran kas pada submenu Cash Flow telah disempurnakan dengan standar visual kelas dunia:
- **Zero Ribbon Criss-Crossing**: Penyelarasan urutan pilar alokasi di Kolom 3 dengan kategori di Kolom 4 menghasilkan aliran horizontal lurus tanpa garis bersilangan.
- **Volumetric Polygon Bands**: Pita aliran cairan bergradien lembut dari warna pilar ke kategori, menggantikan garis kaku satu ketebalan.
- **Horizontal Hub Badge**: Label `TOTAL KAS MASUK` dan nominal disajikan dalam kartu horizontal yang tegak dan mudah dibaca di tengah canvas.
- **Dynamic Vertical Budget**: Spasi vertikal adaptif (`Math.max(540, detailCount * 54 + 110)`) menjamin jarak minimal 30px antar label baris, mengeliminasi tumpukan teks secara total.

---

## 5. Status Verifikasi Kualitas (Quality Assurance)
- **Unit Testing JavaScript**: 253 dari 253 pengujian berhasil (`node --test tests/*.test.js`).
- **Backend & AI Testing Python**: 15 dari 15 pengujian integrasi server berhasil (`python3 tests/backend_test.py && python3 tests/ai_test.py`).
- **Bundle Mandiri**: `inveys-app.html` tervalidasi dengan checksum SHA-256 di `build-manifest.json`.
- **Paket Distribusi**: Arsip kompresi siap pakai tersedia di `/Users/muhamadhendrafebriansyah/Downloads/inveys-v0.22.0-vps-ready.zip` dan tersinkronisasi ke `/Users/muhamadhendrafebriansyah/Downloads/inveys/`.
