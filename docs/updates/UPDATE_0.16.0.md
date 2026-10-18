# INVEYS 0.16.0 — Form Transaksi & Kategori (Monarch Money), Kalender Tagihan + Keamanan VPS Hostinger

Tanggal rilis: 13 Oktober 2026. Pembaruan besar ini menambahkan formulir Tambah Transaksi modern terinspirasi Monarch Money, popover pemilih kategori interaktif dengan avatar emoji, halaman manajer kategori terstruktur, kalender visual tagihan & langganan, pengamanan master password untuk VPS Hostinger KVM, serta sinkronisasi database SQLite persisten.

| Kemampuan | Status di INVEYS 0.16.0 | Batas praktis & Detail |
|---|---|---|
| Modal Tambah Transaksi (Monarch Style) | Segmented toggle Debit/Kredit/Transfer, input nominal besar dengan simbol mata uang dinamis, autocomplete nama pedagang (merchant), dan switch penyesuaian saldo akun | Terintegrasi penuh dengan audit trail, status pending/posted, dan kebijakan saldo |
| Popover Flyout Pemilih Kategori | Pencarian instan kategori, visualisasi avatar emoji kategori, dan pengelompokan lengkap (Income, Bills & Utilities, Food & Dining, Auto & Transport, Housing, Gifts & Donations, Travel & Lifestyle) | Menampilkan emoji kategori pada tombol trigger dan menutup otomatis saat kategori dipilih |
| Halaman Kelola Kategori (Categories Manager) | Halaman khusus pengorganisasian kelompok kategori ala Monarch Money, hitungan transaksi per kategori, pembuatan kategori baru dengan pilihan emoji kustom, dan pembuatan kelompok baru | Akses via menu samping Keuangan → Kategori atau tombol di jurnal transaksi |
| Visual Avatar Kategori pada Jurnal | Avatar bulat ikon emoji kategori di samping nama transaksi di jurnal transaksi | Mempermudah identifikasi visual jenis transaksi secara cepat |
| Kalender Visual Tagihan & Langganan | Grid kalender 7 kolom per bulan dengan chip status interaktif | Sinkron dengan data langganan lokal; navigasi bulan penuh |
| Tampilan Ganda Kalender & Daftar | Beralih antara visual grid kalender dan daftar grup (Overdue, Due in 7 Days, Later this Month, Paid) | Responsive layout di mobile dan desktop |
| Ringkasan Metrik Finansial | Kartu metrik: Total Tagihan, Terbayar, Sisa Jatuh Tempo, dan Langganan Aktif | Dihitung dinamis per bulan yang sedang dipilih |
| Pencatatan Pembayaran Instan | Tombol tandai lunas ("Tandai Lunas") langsung mencatat pengeluaran ke rekening likuid | Membuat entri jurnal expense atomik dengan tanggal & nominal tagihan |
| CRUD Tagihan & Langganan | Tambah, ubah, dan hapus langganan dengan pemilih emoji, kategori, dan siklus bulanan/tahunan | Tersimpan dalam workspace lokal dan ikut dalam backup JSON |
| Autentikasi Master Password | Modal lock screen saat mengakses via server / VPS dengan verifikasi token sesi | Sandi dikonfigurasi via environment variable `INVEYS_MASTER_PASSWORD` |
| Sinkronisasi SQLite Persisten | Server Python (`serve.py`) otomatis menyimpan snapshot workspace ke SQLite | Database lokal file `inveys.db`, aman saat reboot server atau container restart |
| Deploy Hostinger KVM 4 Ready | Skrip systemd daemon service dan konfigurasi reverse proxy Nginx | Siap deploy dengan Python 3 native tanpa dependensi nodejs berat |
| Riwayat & Release Center | Versi 0.16.0 terdokumentasi lengkap di halaman Version Updates (`/api/updates`) | Tersedia dalam Bahasa Indonesia dan English |

## Alur Penggunaan Fitur Monarch Money

### 1. Tambah Transaksi (Add Transaction Modal)
- Klik tombol **+ Add transaction** pada menu samping atau halaman Transaksi.
- Pilih jenis transaksi di bagian atas: **Debit** (pengeluaran), **Kredit** (pemasukan), atau **Transfer**.
- Masukkan nominal dengan format mata uang otomatis (misal: `Rp 50.000` atau `$ 25.00`).
- Masukkan nama pedagang/toko dengan bantuan autocomplete riwayat transaksi.
- Klik pemilih kategori untuk membuka flyout popover:
  - Cari kategori secara langsung di kolom pencarian.
  - Pilih dari kelompok kategori yang rapi dengan ikon emoji intuitif.
  - Atau buat kategori baru dengan tombol `+ Buat kategori baru`.
- Tentukan apakah transaksi ingin ditautkan ke Sasaran Simpanan (Goal).
- Tambahkan label / tags (ketik lalu tekan Enter untuk membuat chip tag).
- Kartu **Sesuaikan Saldo Akun**:
  - Biarkan ON untuk memutasi saldo akun normal.
  - Ubah menjadi OFF jika memasukkan data historis manual tanpa ingin mengubah saldo akun saat ini.

### 2. Kelola Kategori (Categories Manager)
- Buka menu **Keuangan → Kategori** (atau klik tombol **Kategori** di header transaksi).
- Pantau seluruh kelompok kategori (Income, Bills & Utilities, Food & Dining, Auto & Transport, Housing, Gifts & Donations, Travel & Lifestyle).
- Lihat jumlah transaksi yang terkait di setiap kategori.
- Tambah kategori baru ke dalam kelompok tertentu atau buat kelompok kustom baru.

### 3. Kalender Tagihan & Langganan (Bills & Subscriptions)
- Buka menu **Keuangan → Bills & Subscriptions**.
- Pantau ringkasan tagihan bulanan: Total Estimasi, Sudah Terbayar, Sisa Tagihan, dan Langganan Aktif.
- Gunakan tampilan Grid Kalender bulanan 7 kolom atau Tampilan Daftar terkelompok.
- Klik **Tandai Lunas** untuk mencatat pembayaran langsung ke rekening likuid secara otomatis.

---

## Panduan Deployment di Hostinger KVM 4 VPS

1. Unggah file `inveys-v0.16.0-vps-ready.zip` ke VPS Hostinger Anda (misal ke direktori `/var/www/inveys`).
2. Ekstrak file:
   ```bash
   unzip inveys-v0.16.0-vps-ready.zip
   ```
3. Atur Master Password di file environment atau systemd:
   ```bash
   export INVEYS_MASTER_PASSWORD="PasswordKuatAnda123!"
   ```
4. Jalankan server Python:
   ```bash
   python3 serve.py 8000
   ```
   Atau gunakan unit file systemd (`inveys.service`) agar berjalan otomatis saat VPS reboot.
5. Konfigurasikan Nginx sebagai reverse proxy ke port 8000 dengan SSL (Let's Encrypt / Certbot).
