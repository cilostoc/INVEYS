# INVEYS 0.17.0 — Rilis Tahap 1: Ghost Mode (Privasi), Kalender Arus Kas (Payday Grid) & Belanja dari Target Tabungan

Tanggal rilis: 14 Oktober 2026. Pembaruan v0.17.0 merupakan rilis **Tahap 1 (Skala Prioritas Krusial / P0)** dalam roadmap adopsi fitur unggulan aplikasi personal finance modern (Monarch Money). Pembaruan ini fokus pada proteksi privasi pengguna, visibilitas arus kas waktu-nyata (*cash timing*), dan fleksibilitas pendanaan belanja dari tabungan tanpa merusak anggaran operasional bulanan.

| Area Pembaruan | Masalah / Kebutuhan | Perbaikan & Peningkatan di v0.17.0 |
|---|---|---|
| **1. Ghost Mode / Sembunyikan Saldo (1-Klik)** | Pengguna sering ragu membuka aplikasi atau membagikan screenshot karena nominal saldo dan kekayaan bersih terbuka | Tombol privasi 1-klik (`👁` / `🔒`) di topbar global yang mengaburkan (*blur mask*) seluruh angka sensitif di semua halaman dan tersimpan di `localStorage` |
| **2. Kalender Arus Kas & Payday Grid** | Kalender tagihan sebelumnya hanya menampilkan pengeluaran/tagihan (*bills*), sehingga pengguna tidak bisa melihat kesenjangan likuiditas sebelum hari gajian (*payday*) | Menampilkan jadwal pemasukan terencana dalam chip hijau (*income chip*) berdampingan dengan tagihan, lengkap dengan metrik **Net Kas Proyeksi** (`Inflows - Outflows`) |
| **3. Belanja dari Target Tabungan (*Spend From Goal*)** | Ketika membeli barang yang sudah ditabung lama (misal: laptop, renovasi, liburan), pengeluaran tersebut membengkakkan anggaran belanja operasional bulanan (*budget blowout*) | Menghubungkan transaksi pengeluaran langsung ke sasaran tabungan (*Save-up Goal*), memotong saldo cadangan tabungan (`goal.saved`) tanpa menggandakan pencatatan aset |
| **4. Pemulihan Cadangan Otomatis (*Auto-Restore*)** | Jika transaksi belanja dari target dihapus atau diubah, nominal tabungan sebelumnya berisiko hilang atau tidak sinkron | Modul akuntansi `InveysFinance` otomatis mengembalikan dana ke sasaran tabungan saat transaksi dihapus atau menghitung selisih nominal saat diedit |

---

## Rincian Fitur Baru & Peningkatan

### 1. Global Ghost Mode / Sembunyikan Saldo (Gaya Monarch Money)
* **Akses Cepat 1-Klik**: Ikon mata (`👁`) terintegrasi langsung pada bilah preferensi di *topbar header* di samping opsi Bahasa, Mata Uang, dan Tema Tampilan.
* **Masking Visual Menyeluruh (`.privacy-on`)**:
  * Mengaburkan (*blur mask*) seluruh elemen nominal mata uang: metrik ringkasan, angka besar kekayaan bersih (*big-number*), baris mutasi transaksi, saldo akun, chip kalender, dan kartu utang/investasi.
  * Tetap mempertahankan visual struktur dan persentase sehingga pengguna tetap dapat menganalisis grafik dan tren tanpa mengungkap nominal rupiah secara publik.
* **Persistensi State**: Status privasi disimpan ke `localStorage` (`inveys_hide_money`), sehingga mode privasi tetap bertahan saat berpindah halaman maupun saat memuat ulang (*reload*) aplikasi.

### 2. Kalender Arus Kas Rutin & Payday Grid (Visual Arus Kas Bulanan)
* **Chip Pemasukan Hijau (*Income Chips*)**: Setiap jadwal pemasukan dari `flows` (seperti gaji, dividen rutin, pendapatan sewa) ditampilkan dengan chip hijau pada sel tanggal kalender.
* **Status Diterima / Menunggu**:
  * Chip otomatis terverifikasi diterima jika ditemukan transaksi pemasukan nyata pada bulan tersebut.
  * Pengguna juga dapat menandai pemasukan manual (*toggle received*) atau mencatat transaksi masuk secara instan via modal popover.
* **Indikator Net Kas Proyeksi (*Cash Flow Buffer*)**:
  * Menampilkan 4 kartu ringkasan di atas kalender:
    1. **Pemasukan terencana** (*Expected inflows*)
    2. **Estimasi tagihan** (*Expected bills*)
    3. **Net kas proyeksi** (`Pemasukan - Tagihan`)
    4. **Sisa tagihan belum lunas** (*Remaining due*)
  * Membantu mendeteksi kesenjangan kas (*cash gap*) sebelum tanggal jatuh tempo tagihan besar tiba.
* **Tampilan Daftar Terpadu**: Di samping visual kalender kotak, mode *Daftar* kini memuat dua seksi terpisah: *Jadwal Pemasukan Mendatang* dan *Daftar Tagihan & Komitmen*.

### 3. Belanja dari Sasaran Tabungan (*Spend From Goal*)
* **Pilihan Sasaran Tabungan pada Formulir Transaksi**:
  * Saat mencatat pengeluaran (`expense`), pengguna dapat memilih sasaran tabungan pada bidang `Sasaran (Goal)`.
  * Sistem memotong langsung cadangan dana tabungan (`goal.saved`) via `InveysEngine.spendFromGoal`.
* **Mencegah Distorsi Anggaran Operasional**:
  * Karena dana sudah disisihkan berbulan-bulan sebelumnya, pembelanjaan ini tidak dianggap sebagai pembengkakan gaya hidup bulanan biasa.
  * Menampilkan badge sasaran `🎯 [Nama Goal]` pada tabel riwayat transaksi.
  * Kartu sasaran tabungan pada halaman *Goals & Plans* kini menampilkan informasi realisasi belanja: `Dibelanjakan dari target: −Rp X.XXX.XXX`.
* **Integritas Akuntansi Presisi**:
  * Saat transaksi dihapus: dana belanja langsung dikembalikan ke saldo target tabungan.
  * Saat transaksi diedit: selisih nominal otomatis disesuaikan secara proporsional.

---

## Status Pengujian & Verifikasi

- **Node Unit Tests:** Seluruh 235 tes lulus 100% (`npm test`).
  - `spendFromGoal deducts from goal savings without moving assets`: Lulus.
  - `privacy toggle enables ghost mode and persists preference without altering financial balances`: Lulus.
  - `recurring cash flow calendar renders scheduled income paydays, bill chips and net cash`: Lulus.
  - `addTransaction with goalId deducts from goal savings reserve without changing assets`: Lulus.
- **Kompilasi Standalone:** File `inveys-app.html` berhasil dibundel ulang dengan manifest integritas SHA-256 terbaru.
- **VPS Ready:** Server Python `serve.py` dan Service Worker PWA `sw.js` diperbarui ke v0.17.0.
