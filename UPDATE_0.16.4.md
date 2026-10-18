# INVEYS 0.16.4 — Audit Menyeluruh, Perbaikan Bug, Kelancaran Interaksi & Stabilitas Sistem

Tanggal rilis: 14 Oktober 2026. Pembaruan v0.16.4 merupakan rilis penyempurnaan menyeluruh (*comprehensive stability & polish release*) yang berfokus pada perbaikan bug tersembunyi, pencegahan error runtime, optimasi performa interaksi, dan peningkatan kenyamanan pengguna di seluruh modul INVEYS.

| Area Pembaruan | Masalah / Kebutuhan | Perbaikan & Peningkatan di v0.16.4 |
|---|---|---|
| **1. Penanganan Error Dialog Modal** | Potensi error null jika elemen `#form-error` tidak ada | Guarded error fallback via `$('#form-error', form) \|\| $('#form-error')` dengan fallback ke `toast(err.message)` |
| **2. Pembuatan Kelompok Kategori** | Kelompok baru tidak muncul pada dropdown pembuatan kategori | Otomatis mendaftarkan dan memilih kelompok kategori baru pada `<select name="group">` di modal pembuatan kategori |
| **3. Manajemen Kategori Kustom** | Pengguna hanya dapat menghapus kategori tanpa opsi edit | Menambahkan tombol aksi edit `[✏️]` untuk mengubah nama, kelompok, dan avatar emoji kategori kustom |
| **4. Peta Panas (Heatmap) Finansial** | Tampilan kosong janggal saat berganti tab tanpa transaksi | Penanganan empty state informatif per tab, kalkulasi intensitas volume absolut, dan pesan ekspor SVG yang ramah |
| **5. Interaksi Popover Chatbox** | Popover (+) tetap terbuka saat membuka modal pengaturan/chat baru | Otomatis menutup popover dan memutar balik tombol (+) ke orientasi normal sebelum modal dialog ditampilkan |
| **6. Filter Berkas Media Chatbox** | Semua tombol ubin membuka picker berkas umum | Filter berkas spesifik: Dokumen (`.pdf`, `.csv`, `.txt`, gambar), Video (`.mp4`, `.webm`), Audio (`.m4a`, `.wav`) |
| **7. Modal Tambah Transaksi Monarch** | Terpotong pada layar laptop kecil / mobile browser | Pembatasan proporsional `max-height: min(92vh, 640px)` dengan scrolling internal halus anti-clipping |
| **8. Topologi Koneksi Integrasi** | Rasio aspek SVG statis | Dibuat sepenuhnya responsif dengan `height: auto; aspect-ratio: 720/180;` dan efek pendar sinyal |
| **9. Robustness Backend Python** | Missing Pillow modul pada lingkungan server belum siap | Fallback error `ValueError` informatif pada `serve.py` tanpa unhandled exception |

---

## Rincian Perbaikan & Peningkatan Fitur

### 1. Audit Penanganan Formulir & Modal Dialog
- Memperbaiki fungsi pembuka dialog global [`openModal`](file:///Users/muhamadhendrafebriansyah/.gemini/antigravity/scratch/inveys-v0.15.0-analysis/inveys/app.js) agar aman dari pengecualian `TypeError: Cannot set properties of null (setting 'textContent')`.
- Jika formulir khusus tidak memiliki kontainer `#form-error`, pesan validasi otomatis ditampilkan melalui toast notifikasi.

### 2. Perbaikan Pembuatan Kelompok Kategori & Fitur Edit
- **Pembuatan Kelompok Baru:** Saat pengguna mengeklik `+ Tambah Kelompok`, memasukkan nama kelompok baru, lalu dialihkan ke pembuatan kategori, nama kelompok baru kini langsung tersedia dan terpilih otomatis pada dropdown kelompok.
- **Aksi Edit Kategori:** Setiap baris kategori khusus di halaman Pengaturan Kategori kini dilengkapi tombol edit `[✏️]` untuk memperbarui nama kategori, asosiasi kelompok, maupun ikon emoji.

### 3. Peningkatan Kualitas Visual & Ekspor Heatmap
- Menambahkan penanganan state kosong yang informatif ketika pengguna beralih antar-tab (misalnya tab Pemasukan yang belum memiliki transaksi pada rentang tanggal terpilih).
- Menggunakan nilai absolut untuk menghitung intensitas pengeluaran harian, memastikan penyesuaian nominal atau refund tidak mengacaukan pemetaan warna kalender.
- Memperjelas umpan balik saat melakukan ekspor SVG grafik.

### 4. Optimalisasi Kelancaran Chatbox & Lampiran
- Tombol (+) berputar balik secara mulus ke posisi semula saat pengguna memilih opsi percakapan baru atau membuka konfigurasi AI.
- Masing-masing ubin media (Kamera, Dokumen, Video, Audio) memiliki filter tipe berkas (*accept attribute*) yang tepat sesuai jenis konten yang dipilih.
- Modal penambahan transaksi Monarch Money memiliki batasan tinggi proporsional dan scrolling internal halus sehingga tidak memerlukan scroll luar jendela pada layar dengan viewport terbatas.

---

## Status Verifikasi

- **Node Unit & Integration Tests:** 240 dari 240 tes lulus 100% (`node --test tests/*.test.js`).
- **Python Backend Tests:** 12 dari 12 tes lulus 100% (`python3 tests/backend_test.py`).
- **Syntax & Compilation Check:** 100% lulus tanpa syntax error atau peringatan pada seluruh berkas JavaScript dan Python.
