# INVEYS 0.16.5 — Visualisasi Investasi Interaktif, Data Pasar Otomatis & Generator Portofolio Contoh

Tanggal rilis: 14 Oktober 2026. Pembaruan v0.16.5 merupakan rilis signifikan untuk modul **Investments** di INVEYS yang menghadirkan generator data contoh satu-klik, endpoint backend penarikan harga pasar otomatis (EOD) berbasis standar web, serta sinkronisasi harga pasar live tanpa ketergantungan API pihak ketiga berbayar.

| Area Pembaruan | Masalah / Kebutuhan | Perbaikan & Peningkatan di v0.16.5 |
|---|---|---|
| **1. Visualisasi Investasi Instan (1-Klik)** | Halaman investasi kosong memerlukan entri manual banyak aset dan puluhan harga historis sebelum grafik muncul | Menambahkan generator data contoh 1-klik (`Muat data contoh`) dengan 4 aset riil (`VOO`, `AAPL`, `BND`, `BBCA`), 52 riwayat harga, 5 benchmark, dan 13 snapshot |
| **2. Kurva Kinerja TWR & Benchmark** | Grafik performa membutuhkan data benchmark yang cocok pada tanggal yang sama | Otomatis menyertakan data acuan S&P 500, US Total Stock, US Bond, Bitcoin, dan IHSG terdistribusi bulanan untuk aktivasi instan |
| **3. Endpoint Data Pasar Otomatis** | Tidak ada endpoint bawaan untuk menarik harga pasar terbaru | Menambahkan route `/api/market-history` di `serve.py` berbasis Yahoo Finance API tanpa dependensi library eksternal tambahan |
| **4. Sinkronisasi Harga Langsung** | Pengguna harus mengedit harga holding satu per satu setiap hari | Tombol `Sinkron harga live` di panel Data & Riwayat memperbarui harga penutupan seluruh aset aktif secara otomatis |
| **5. Berkas CSV Siap Pakai** | Kebutuhan pengujian impor mandiri via spreadsheet | Menyediakan file `inveys-investment-sample.csv` terformat resmi untuk simulasi impor portofolio dan benchmark |

---

## Rincian Fitur Baru & Peningkatan

### 1. Generator Data Contoh Portofolio Investasi
* Pada kotak kondisi kosong (*empty state*) menu Investment, kini tersedia tombol utama **`Muat data contoh`** (dengan ikon ✨ *sparkles*).
* Tombol ini juga dapat diakses kapan saja melalui kelompok tombol di panel **Data & riwayat**.
* Data yang dihasilkan:
  * **4 Posisi Holdings Beragam**:
    * `VOO` (Vanguard S&P 500 ETF, Kategori *Large Blend*, USD)
    * `AAPL` (Apple Inc., Saham Ekuitas Teknologi AS, USD)
    * `BND` (Vanguard Total Bond Market, Obligasi / *Fixed Income*, USD)
    * `BBCA` (PT Bank Central Asia Tbk, Saham Perbankan Indonesia, IDR)
  * **52 Titik Observasi Harga**: Riwayat harga 12 bulan terakhir untuk masing-masing aset, memastikan perhitungan *Time-Weighted Return (TWR)* dan *Capital Value* dapat langsung digambar oleh modul `InveysInvestment.chartGeometry`.
  * **5 Benchmark Pembanding Lengkap**: S&P 500, US Stock (VTI), US Bond (BND), Bitcoin (BTC), dan IHSG (IDX Composite) pada tanggal observasi yang seragam.
  * **13 Snapshot Posisi Bulanan**: Mendukung grafik garis *Unrealized Gains & Losses History* di tab Advanced.

### 2. Endpoint Backend Python (`/api/market-history`)
* Menambahkan handler `/api/market-history?symbol=...&range=1y` di `serve.py`.
* Menggunakan modul standar Python `urllib.request` dan `json`, sehingga server tidak memerlukan instalasi paket tambahan (`pip install`).
* Mendukung deteksi otomatis saham Indonesia: simbol 4 huruf kapital (seperti `BBCA`, `BBRI`, `TLKM`, `ASII`) otomatis dipetakan ke akhiran bursa `.JK`.
* Mengembalikan array terstruktur berformat JSON: `[{ "date": "YYYY-MM-DD", "price": 10500 }]`.

### 3. Aksi Sinkronisasi Harga Langsung di Frontend
* Ditambahkan fungsi `syncInvestmentPrices()` yang mengiterasi seluruh aset di `state.holdings`.
* Menarik harga historis 1 tahun dan harga penutupan terkini, lalu menyimpannya ke `state.holdingPrices` dan `holding.price`.
* Melakukan validasi otomatis via `InveysInvestment.validatePrices` sebelum persistensi ke penyimpanan lokal.

---

## Status Pengujian & Verifikasi

- **Node Unit Tests:** Seluruh 231 tes lulus 100% (`npm test`).
- **Validasi Kalkulasi Finansial:**
  - `validateHoldings`: Lulus tanpa anomali.
  - `validate(investmentHistory)`: Lulus validasi konsistensi basis, kurs FX historis, dan tanggal.
  - `performance` & `chartGeometry`: Menghasilkan geometri SVG garis dan area area tertutup sempurna dengan 13 observasi kalender.
- **Kompilasi Standalone:** File `inveys-app.html` berhasil dibuild secara independen tanpa ketergantungan runtime luar.
