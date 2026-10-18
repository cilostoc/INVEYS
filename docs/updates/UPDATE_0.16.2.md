# INVEYS 0.16.2 — Perombakan Visual Sub-menu Laporan (Reports) ala Monarch Money: Bersih, Berwarna & Interaktif

Tanggal rilis: 13 Oktober 2026. Pembaruan v0.16.2 menghadirkan perombakan total pada sub-menu **Laporan (Reports)** yang terinspirasi langsung dari antarmuka modern **Monarch Money**. Seluruh visualisasi data keuangan kini tampil bersih (*clean*), penuh warna (*colourful*), dilengkapi diagram aliran pita Sankey, grafik donat cincin interaktif, metrik KPI responsif, garis waktu transaksi berkelompok tanggal, serta kartu ringkasan eksekutif beranimasi halus.

| Peningkatan | Status di INVEYS 0.16.2 | Detail & Keunggulan |
|---|---|---|
| **1. 6 Sub-tab Laporan Terintegrasi** | Arus Kas, Pengeluaran, Pendapatan, Kekayaan Bersih, Hutang, Kartu Kredit | Tab bar modern dengan aksen oranye Monarch (`#f26522`), transisi aktif lembut, dan ikon SVG unik |
| **2. Diagram Pita Aliran Arus Kas (Sankey)** | Visualisasi aliran dana multi-warna dinamis (Income ➔ Uses & Net Income) | Pita bezier multi-warna, label persentase, avatar emoji kategori, dan efek pendar saat disorot |
| **3. Grafik Donat / Ring Berwarna-Warni** | Visualisasi komposisi Pengeluaran & Pendapatan 10 palet warna cerah | Total nominal terpusat di tengah cincin, legenda interaktif dengan navigasi drill-down instan |
| **4. 4 Kartu Metrik Ringkasan Utama (KPIs)** | Total Pendapatan, Total Pengeluaran, Pendapatan Bersih, Rasio Tabungan | Kartu responsif berbingkai modern dengan pill nilai berkode warna dan indikator tren finansial |
| **5. Tata Letak Terpisah 2 Kolom (Split Grid)** | Panel Kiri: Garis Waktu Transaksi (~70%) &bull; Panel Kanan: Kartu Ringkasan (~30%) | Header tanggal sticky, subtotal harian, avatar kategori, nama merchant, pill pemilik, serta ringkasan eksekutif & ekspor CSV |

---

## Rincian Perombakan Fitur Laporan (Reports)

### 1. Arus Kas (Cash Flow) dengan Diagram Sankey Penuh Warna
- **Inspirasi Monarch Money:** Memetakan bagaimana seluruh aliran uang masuk mengalir ke pos-pos pengeluaran dan berapa sisa yang menjadi simpanan bersih (*Net Income*).
- **Implementasi di v0.16.2:**
  - **Pita Aliran Multi-Warna:** Aliran bezier dinamis menghubungkan setiap sumber pendapatan dengan pos penggunaannya. Warna pita disesuaikan secara dinamis dari palet cerah (`#00b4d8`, `#2ec4b6`, `#ffb703`, `#e76f51`, `#8338ec`, dll.).
  - **Efek Pendar & Interaksi:** Pita Sankey dilengkapi efek pendar (*hover glow*) saat kursor diarahkan, mempermudah pelacakan jalur dana.
  - **Bar Simpanan Bersih:** Bila pendapatan melebihi pengeluaran, sisa dana divisualisasikan sebagai bar hijau cerah (*Net Income / Savings*) dengan label nominal dan persentase yang jelas.
  - **Tampilan Cadangan Bar Chart:** Pengguna tetap dapat beralih ke tampilan grafik batang bulanan atau diagram donat melalui tombol toggle cepat 1-klik `[🌈 Sankey]`, `[🍩 Donat]`, dan `[📊 Batang]`.

### 2. Pengeluaran (Spending) & Pendapatan (Income) dengan Grafik Donat Interaktif
- **Grafik Donat / Ring Cincin Modern:**
  - Menggantikan tampilan daftar monoton dengan diagram donat SVG bersudut presisi dan beranimasi halus saat dimuat.
  - Pusat cincin menampilkan total nominal pengeluaran/pendapatan dalam font tebal yang mudah dibaca.
  - 10 irisan kategori menggunakan palet warna kontras yang hidup dan ramah mata.
- **Legenda Interaktif dengan Drill-down:**
  - Menampilkan daftar kategori lengkap dengan avatar emoji, nama, persentase dari total, dan nominal rupiah.
  - Mengklik kategori di legenda akan langsung memfilter (*drill-down*) garis waktu transaksi ke kategori tersebut.

### 3. 4 Kartu Metrik Ringkasan Utama (Top Metric Cards)
- Terletak tepat di bawah navigasi tab laporan untuk memberikan ringkasan instan kondisi keuangan:
  1. **Total Income:** Diberi aksen hijau cerah (`#10b981`) menunjukkan total pemasukan pada periode yang dipilih.
  2. **Total Expenses:** Diberi aksen merah koral (`#f43f5e`) menunjukkan total pengeluaran.
  3. **Total Net Income:** Diberi aksen biru langit (`#38bdf8`) menunjukkan selisih positif/negatif arus kas.
  4. **Savings Rate:** Diberi pill persentase dinamis yang menunjukkan rasio tabungan terhadap pendapatan.

### 4. Tata Letak Split Grid: Garis Waktu Transaksi & Kartu Ringkasan Periode
- **Panel Kiri (~70%): Garis Waktu Transaksi Berkelompok Tanggal**
  - Transaksi dikelompokkan berdasarkan tanggal dengan header sticky elegan yang mencantumkan nama hari, tanggal lengkap, dan subtotal pengeluaran hari tersebut.
  - Setiap baris transaksi dilengkapi:
    - Avatar bulat dengan ikon emoji kategori (*Groceries* 🍏, *Coffee* ☕, *Shopping* 🛍️, dll.).
    - Nama merchant atau deskripsi tebal dan mudah dibaca.
    - Pill pemilik akun (*Me*, *Partner*, dll.).
    - Badge rekening/metode pembayaran (*💳 BCA*, *💳 BRI*, dll.).
    - Nominal transaksi berkode warna (`.expense-amount` merah muda cerah untuk pengeluaran, hijau untuk pemasukan).
- **Panel Kanan (~30%): Kartu Ringkasan Periode (Monarch Period Summary Card)**
  - Kartu ringkasan eksekutif yang menyajikan data analitik mendalam:
    - Total transaksi dalam periode.
    - Transaksi pengeluaran terbesar (*Largest Expense*) beserta nama merchant.
    - Rata-rata pengeluaran per hari (*Daily Average*).
    - Rentang tanggal laporan yang sedang aktif.
    - Tombol aksi **Unduh CSV Transaksi** untuk ekspor langsung data yang sedang difilter.

### 5. Harmonisasi Tampilan Tab Posisi Keuangan Lainnya
- Tab **Kekayaan Bersih (Net Worth)**, **Hutang (Debt)**, dan **Kartu Kredit (Cards)** telah disesuaikan agar menggunakan bahasa desain yang sama:
  - Kartu metrik posisi terkini di bagian atas.
  - Kartu konten bersih dengan bayangan lembut (*soft elevation shadows*).
  - Skema warna yang serasi baik pada mode Terang (Light Mode) maupun Gelap (Dark Mode).

---

## Petunjuk Pembaruan & Deployment VPS

1. Ekstrak arsip rilis `inveys-v0.16.2-vps-ready.zip` ke server VPS Anda:
   ```bash
   unzip -o inveys-v0.16.2-vps-ready.zip -d /var/www/inveys
   ```
2. Restart layanan server INVEYS melalui systemd:
   ```bash
   sudo systemctl restart inveys
   ```
3. Buka peramban Anda dan lakukan hard-refresh (`Ctrl+F5` atau `Cmd+Shift+R`). Periksa footer aplikasi untuk memastikan versi aktif adalah **v0.16.2**.
