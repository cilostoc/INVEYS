# INVEYS 0.18.0 — Rilis Tahap 2: Flexible Category Budgeting (Rollover), Spending Pace Indicator & Transaction Automation Rules Engine

Tanggal rilis: 14 Oktober 2026. Pembaruan v0.18.0 merupakan rilis **Tahap 2 (Skala Prioritas Utama / P1)** dalam roadmap adopsi fitur unggulan aplikasi personal finance modern (Monarch Money). Pembaruan ini memperkenalkan sistem penganggaran bulanan yang fleksibel dengan dukungan *Rollover* surplus/defisit, pelacak laju pengeluaran waktu-nyata (*Spending Pace Indicator*), serta mesin aturan otomatisasi mutasi transaksi 1-klik (*Automation Rules Engine*).

| Area Pembaruan | Masalah / Kebutuhan Sebelumnya | Solusi & Peningkatan di v0.18.0 |
|---|---|---|
| **1. Sistem Anggaran Kategori Fleksibel (Gaya Monarch Money)** | Anggaran bulanan sebelumnya bersifat kaku, tanpa batas per kategori dan tanpa akumulasi sisa dana bulan sebelumnya | Membagi anggaran ke dalam **Fleksibel (*Discretionary Pool*)** vs **Biaya Tetap (*Fixed Bills*)**, lengkap dengan sakelar **Rollover** 1-klik untuk meneruskan surplus atau memperhitungkan defisit bulan lalu |
| **2. Pelacak Laju Pengeluaran (*Spending Pace Indicator*)** | Pengguna kesulitan mengetahui apakah pengeluaran mereka terlalu cepat di awal/tengah bulan sebelum uang habis | Menampilkan banner visual laju pengeluaran dengan perbandingan hari kalender berjalan vs % anggaran terpakai, status **Sesuai Target (*On Track*)**, **Melaju Cepat (*Pacing Fast*)**, atau **Melebihi Anggaran (*Over Budget*)**, serta *dual-track progress bar* |
| **3. Aturan Otomatis Transaksi 1-Klik (*⚡ Automation Rules*)** | Nama transaksi bank sering berantakan dan harus dikategorikan atau diganti namanya secara manual berulang-ulang | Tombol kilat (`⚡`) pada setiap baris mutasi untuk membuat aturan otomatis instan (standarisasi nama merchant, kategori, penugasan pemilik, dan tag) |
| **4. Pusat Kelola Aturan & Penerapan Retroaktif** | Pengguna tidak memiliki tempat terpadu untuk melihat aturan yang aktif atau menerapkan aturan pada transaksi lama | Modal Manajemen Aturan di toolbar Transaksi dengan fitur pratinjau (*preview*) dan penerapan retroaktif instan ke transaksi historis tanpa mengubah saldo akun |

---

## Rincian Fitur Baru & Peningkatan

### 1. Flexible Category Budgeting & Rollover Engine
* **Halaman Anggaran Terdedikasi (`Budget`)**:
  * Ditambahkan ke bilah navigasi menu utama grup *Keuangan* (`budget`).
  * Menyediakan navigasi bulanan interaktif (bulan sebelumnya, bulan berikutnya, dan tombol cepat "Bulan Ini").
  * Filter pil kategori: *Semua Kategori*, *Pengeluaran Fleksibel*, dan *Biaya Tetap & Tagihan*.
* **Pengelompokan Anggaran ala Monarch Money**:
  * **Fleksibel (*Discretionary Pool*)**: Kategori belanja variabel seperti Makanan, Hiburan, Belanja, Transportasi, dan Gaya Hidup.
  * **Biaya Tetap & Komitmen (*Fixed Bills*)**: Pengeluaran rutin wajib seperti Sewa Rumah, Utilitas, Asuransi, dan Langganan.
* **Fitur Rollover Surplus / Defisit Otomatis**:
  * Saat diaktifkan pada kategori tertentu, sisa anggaran bulan lalu otomatis ditambahkan ke daya belanja bulan ini (`+Rollover`).
  * Jika bulan lalu terjadi pembengkakan (*overspending*), defisit otomatis mengurangi batas aman bulan ini (`−Rollover`).
* **Modal Atur & Salin Anggaran (1-Klik)**:
  * Tombol *Atur Anggaran* memungkinkan konfigurasi batas nominal, grup, dan sakelar Rollover dengan bantuan *autocomplete* kategori.
  * Tombol *Salin Bulan Lalu* otomatis menghasilkan alokasi anggaran berdasarkan rata-rata pola belanja transaksi sebelumnya.

### 2. Spending Pace Tracker & Visual Dual-Track Bar
* **Perhitungan Laju Pengeluaran Real-Time**:
  * Mengomparasikan persentase hari kalender yang telah berjalan (`Hari X dari Y`) terhadap persentase batas anggaran yang telah dibelanjakan.
* **Status Laju & Pesan Edukatif**:
  * **✓ Sesuai Target (*On Track*)**: Pengeluaran berada di bawah atau sebanding dengan hari berjalan (indikator hijau).
  * **⚡ Melaju Cepat (*Pacing Fast*)**: Belanja melaju lebih cepat dari laju hari kalender (indikator amber/oranye peringatan dini).
  * **⚠ Melebihi Anggaran (*Over Budget*)**: Total belanja telah melampaui 100% dari alokasi anggaran (indikator merah).
* **Dual-Track Progress Bar**:
  * Menampilkan dua garis visual berdampingan: garis waktu hari kalender berjalan dan garis realisasi pengeluaran aktual.

### 3. Mesin Aturan Otomatis Transaksi 1-Klik (*Automation Rules Engine*)
* **Tombol Cepat `⚡` pada Baris Mutasi**:
  * Terdapat tombol kilat (`⚡`) pada kolom aksi setiap baris tabel transaksi.
  * Mengklik tombol ini otomatis membuka modal konfigurasi aturan yang telah terisi (*pre-filled*) dengan nama merchant, jenis transaksi, akun, dan kategori.
* **Pembersihan Nama Merchant (*Clean Merchant Renaming*)**:
  * Memungkinkan pembersihan deskripsi mutasi bank yang panjang/acak menjadi nama merchant yang rapi (misal: `"KCP JAKARTA PT INDOMARCO PRISMATAMA"` menjadi `"Indomaret"`).
  * Menyimpan nama asli (*original description*) untuk keperluan pelacakan dan audit.
* **Penerapan Retroaktif Instan dengan Pratinjau**:
  * Setelah aturan disimpan, sistem otomatis mendeteksi transaksi historis yang cocok dan menawarkan opsi: *"Terapkan aturan sekarang? X transaksi yang cocok dapat diperbarui"*.
  * Pembaruan retroaktif hanya memutakhirkan metadata (nama merchant, kategori, tag) tanpa memodifikasi saldo akun atau integritas buku besar.

### 4. Pusat Kelola Aturan Otomatis (*Rules Manager*)
* **Akses Cepat dari Toolbar Transaksi**:
  * Tombol *"⚡ Aturan otomatis"* pada *header* halaman Transaksi membuka jendela manajemen seluruh aturan yang ada.
* **Fitur Manajemen Lengkap**:
  * Melihat daftar semua aturan aktif/nonaktif.
  * Mengedit kriteria kondisi (`AND`: teks deskripsi, akun, mata uang, tipe mutasi) dan aksi perubahan (kategori, nama bersih, tag, visibilitas laporan, *split* kepemilikan).
  * Menghapus aturan yang tidak lagi dibutuhkan.
  * Menjalankan pratinjau (*preview*) dampak aturan ke seluruh jurnal transaksi.

---

## Status Pengujian & Verifikasi

- **Node Unit & Render Tests:** Seluruh 240 tes lulus 100% (`npm test`).
  - `setCategoryBudget creates and updates category budget allocations with validation`: Lulus.
  - `monthlyBudgetSummary computes category actuals, rollover surplus, and pace indicator`: Lulus.
  - `budget page renders flexible budget groups, progress bars and spending pace tracker`: Lulus.
  - `budget setup modal creates category budget and persists in state`: Lulus.
  - `tx-rule action opens auto-rule modal pre-filled and rules-manage lists rules`: Lulus.
- **Kompilasi Standalone:** File `inveys-app.html` berhasil dibundel ulang dengan manifest integritas SHA-256 terbaru.
- **VPS Ready:** Server Python `serve.py` dan Service Worker PWA `sw.js` diperbarui ke v0.18.0.
