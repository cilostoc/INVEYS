# INVEYS 0.19.0 — Rilis Tahap 3: Diagram Alir Kas Sankey Multi-Tier, Indikator Tingkat Tabungan (Savings Rate) & Target Asset Allocation Rebalancer

Tanggal rilis: 14 Oktober 2026. Pembaruan v0.19.0 merupakan rilis **Tahap 3 (Skala Prioritas Lanjutan / P2)** dalam roadmap adopsi fitur unggulan aplikasi personal finance modern (Monarch Money). Pembaruan ini memperkenalkan visualisasi arus kas multi-jenjang berformat **Diagram Alir Kas Sankey Interaktif (*Multi-Tier Cash Flow Sankey Diagram*)**, indikator metrik **Tingkat Tabungan (*Savings Rate %*)**, serta instrumen **Target Alokasi Aset Portofolio & Kalkulator Smart Rebalancer (*Portfolio Target Asset Allocation & Rebalancer*)** dengan mode deposit kas baru (*Cash-Only Rebalance*).

| Area Pembaruan | Masalah / Kebutuhan Sebelumnya | Solusi & Peningkatan di v0.19.0 |
|---|---|---|
| **1. Diagram Alir Kas Sankey Interaktif Multi-Tier (Gaya Monarch Money)** | Halaman Arus Kas (*Cash Flow*) sebelumnya hanya menampilkan daftar komitmen statis tanpa visualisasi koneksi menyeluruh dari mana uang masuk hingga ke mana uang dibelanjakan | Menghadirkan diagram alir SVG multi-jenjang interaktif: **Sumber Pendapatan -> Hub Inflow Terpadu -> 3 Pilar Utama (Sasaran Tabungan, Biaya/Kewajiban Tetap, Pengeluaran Fleksibel) -> Rincian Kategori Belanja & Sisa Kas Bebas (*Net Surplus/Gap*)** |
| **2. Indikator & Metrik Tingkat Tabungan (*Savings Rate %*)** | Pengguna kesulitan mengetahui berapa porsi pendapatan yang berhasil disisihkan untuk masa depan vs yang habis terpakai dalam periode bulanan | Menyediakan kartu metrik utama dan lencana tingkat tabungan (*Savings Rate %*) secara otomatis di *header* halaman Arus Kas dan panel diagram alir |
| **3. Target Alokasi Aset & Skor Deviasi (*Portfolio Drift Score*)** | Portofolio investasi tidak memiliki target bobot ideal per kelas aset, sehingga pergeseran pasar (*drift*) tidak terukur | Menambahkan konfigurasi Target Alokasi Aset (`s.targetAllocations`), penghitungan bobot riil vs target, lencana deviasi (*Overweight*, *Underweight*, *Balanced*), dan **Skor Keseimbangan Alokasi (Drift Score 0–100)** |
| **4. Kalkulator Smart Rebalancing & Mode Kas Baru (*Cash-Only*)** | Penyeimbangan kembali portofolio sering membingungkan dan menjual aset pemenang dapat memicu biaya transaksi atau pajak modal | Menyediakan kalkulator aksi otomatis (BUY / SELL), serta **Simulator Rebalance Kas Baru (*Cash-Only*)** yang mendistribusikan setoran dana segar hanya ke aset tertinggal tanpa menjual aset lainnya |
| **5. 4 Model Alokasi Portofolio Populer (1-Klik)** | Pengguna pemula sering tidak mengetahui formula alokasi kelas aset yang seimbang | Menyediakan 4 preset alokasi standar industri: **60/40 Classic Balanced**, **80/20 Aggressive Growth**, **All-Weather Portfolio**, dan **Conservative Income** |

---

## Rincian Fitur Baru & Peningkatan

### 1. Diagram Alir Kas Sankey Interaktif Multi-Tier (Monarch Money Style)
* **Visualisasi Multi-Jenjang Arus Kas**:
  * **Tier 1 (Sumber Pendapatan / *Income Sources*)**: Menampilkan seluruh sumber pemasukan (gaji, bisnis, bonus, investasi) dengan nilai nominal dan ikon kategori.
  * **Tier 2 (Hub Inflow Terpadu / *Total Inflow Hub*)**: Titik temu pusat seluruh dana masuk sebelum didistribusikan.
  * **Tier 3 (3 Pilar Alokasi Finansial Utama)**:
    1. *🎯 Sasaran Tabungan & Investasi (Goals & Savings)*: Alokasi untuk dana darurat, pensiun, dan target masa depan.
    2. *🔒 Biaya & Kewajiban Tetap (Fixed Bills & Debts)*: Komitmen rutin wajib seperti sewa, utilitas, cicilan utang.
    3. *🛍️ Pengeluaran Fleksibel (Flexible Spending)*: Anggaran belanja diskresioner harian dan gaya hidup.
  * **Tier 4 (Rincian Kategori Belanja & Sisa Kas)**: Menampilkan kategori belanja aktual serta sisa kas surplus (*Net Surplus*) atau kesenjangan likuiditas (*Funding Gap*).
* **Navigasi Periode & Ekspor Grafik**:
  * Filter pilihan periode: beralih antara **Rencana Bulanan Rutin (*Monthly Plan Baseline*)** dan bulan transaksi aktual (misal: `2026-10`).
  * Tombol **Ekspor SVG**: menghasilkan berkas vektor mandiri `inveys-cashflow-sankey.svg` beresolusi tinggi dengan skema warna yang sesuai dengan tema aktif pengguna (Light / Dark).
  * Kompatibilitas penuh dengan **Mode Privasi Global (*Ghost Mode*)** untuk mengaburkan angka saat presentasi.

### 2. Metrik Tingkat Tabungan (*Savings Rate % Indicator*)
* **Perhitungan Otomatis**:
  $$\text{Savings Rate} = \frac{\text{Alokasi Target Tabungan} + \max(0, \text{Sisa Kas Surplus})}{\text{Total Pendapatan Inflow}} \times 100\%$$
* **Penyajian Visual**:
  * Ditampilkan sebagai kartu metrik utama di bagian atas halaman *Cash Flow*.
  * Tampil sebagai lencana (*badge*) laras visual di *header* panel diagram Sankey.

### 3. Portfolio Target Asset Allocation & Drift Scoring
* **Tab Terdedikasi `Target & Rebalance` pada Menu Investment**:
  * Ikon timbangan (*scale*) yang elegan pada navigasi submenu investasi.
  * Ringkasan statistik: *Total Portofolio*, *Skor Keseimbangan (Drift Score)*, *Total Target Alokasi*, dan *Rekomendasi Aksi*.
* **Skor Deviasi Portofolio (*Drift Score 0–100*)**:
  * Mengukur tingkat keselarasan portofolio riil terhadap target ideal.
  * Dilengkapi status edukatif: *Portofolio Sangat Seimbang (85–100)*, *Pergeseran Moderat (65–84)*, dan *Perlu Rebalancing Segera (<65)*.
* **Tabel Komparasi & Visualisasi Batang Track vs Target**:
  * Kolom nilai saat ini, bobot persentase riil, target %, dan visualisasi grafik batang dengan jarum penanda target ideal (*target marker*).
  * Lencana status deviasi otomatis: **Overweight** (kelebihan bobot), **Underweight** (kekurangan bobot), atau **Balanced** (seimbang dalam toleransi 5%).

### 4. Smart Rebalancer & Mode Deposit Kas Baru (Cash-Only Rebalance)
* **Rebalance Penuh Jual/Beli (*Full Buy/Sell Action*)**:
  * Menghitung nilai tepat yang harus dibeli (BUY) atau dijual (SELL) untuk mengembalikan setiap kelas aset ke persentase target.
* **Simulator Rebalance Kas Baru (*Cash-Only Rebalancing*)**:
  * Masukkan nominal dana kas baru yang ingin diinvestasikan (misal: setoran bulanan Rp 10.000.000).
  * Algoritma secara pintar mengalokasikan kas tersebut secara proporsional **hanya ke aset-aset yang tertinggal (*underweight*)**.
  * Tidak ada aset pemenang yang perlu dijual, menghemat biaya transaksi broker dan menghindari pajak keuntungan modal (*capital gains tax*).

### 5. 4 Preset Alokasi Portofolio Standar Industri (1-Klik)
* **60/40 Classic Balanced**: 60% Saham / Equity, 40% Obligasi / Fixed Income.
* **80/20 Aggressive Growth**: 80% Saham / Equity, 15% Obligasi, 5% Kas.
* **All-Weather Portfolio**: 30% Saham / Equity, 55% Obligasi, 15% Komoditas / Emas.
* **Conservative Income**: 30% Saham, 50% Obligasi, 20% Pasar Uang / Kas.

---

## Verifikasi Kualitas & Integritas Pengujian

* **Node.js Test Suite**: Seluruh **244 pengujian unit dan integrasi lulus 100%** (`tests/engine.test.js`, `tests/recording.test.js`, `tests/finance.test.js`, `tests/investment.test.js`, `tests/appearance.test.js`, `tests/plans.test.js`, `tests/render.test.js`, `tests/assistant.test.js`, `tests/operations.test.js`).
* **Python Backend Test Suite**: 12/12 pengujian backend Python (`tests/backend_test.py`) dan pengujian AI (`tests/ai_test.py`) lulus 100%.
* **Audit Keamanan Data**:
  * Penambahan alokasi target dan rebalancing tidak mengubah saldo buku besar atau mutasi riil transaksi.
  * Dukungan penuh terhadap mode offline PWA (`sw.js` cache `inveys-v0.19.0-cache`).
