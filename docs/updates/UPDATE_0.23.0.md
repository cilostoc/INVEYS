# INVEYS 0.23.0 — Modul Pelacak & Simulasi Cicilan Emas Fisik Pegadaian Mulia (50g)

Tanggal rilis: 17 Oktober 2026. Pembaruan **v0.23.0** menghadirkan modul investasi terdedikasi untuk melacak, mensimulasikan, dan mengintegrasikan program **Cicilan Emas Batangan Fisik 24K Pegadaian Mulia** secara langsung ke dalam portofolio kekayaan bersih (*Net Worth*), buku besar mutasi kas (*General Ledger*), liabilitas pembiayaan (*Debt Tracking*), serta rencana finansial masa depan pengguna.

Data kontrak resmi dari **PT Pegadaian (Persero)** telah dimuat secara terstandarisasi langsung ke dalam mesin komputasi finansial INVEYS.

---

## Ringkasan Matriks Pembaruan v0.23.0

| Fitur / Komponen | Kondisi Sebelumnya (v0.22.0) | Peningkatan & Solusi di v0.23.0 |
|---|---|---|
| **1. Modul Cicilan Emas Fisik** | Investasi emas hanya dapat dicatat manual sebagai aset kas umum tanpa pelacakan akad pembiayaan, tenor, maupun beban sewa modal | Modul terdedikasi di tab **Investasi ➔ Cicilan Emas** dengan banner kontrak resmi, pelacak tenor interaktif, dan visualisasi amortisasi detail |
| **2. Data Kontrak Resmi Pegadaian** | Pengguna harus menghitung manual sisa pokok dan bunga di luar aplikasi | Data kontrak asli (50g Galeri 24, DP Rp 19,04 Juta, Pokok Rp 107,61 Juta, Angsuran Rp 2,46 Juta/bulan x 60) terintegrasi langsung |
| **3. Perhitungan Titik Impas (BEP)** | Tidak ada acuan harga jual kembali minimum untuk mencapai keuntungan | Metrik Titik Impas (*Break-Even Price*) otomatis dihitung: **Rp 3.338.282 / gram** (memperhitungkan total DP, pokok, dan sewa modal mu'nah) |
| **4. Simulator Spot Emas & Skenario CAGR** | Portofolio emas statis mengikuti harga input manual | Simulator harga pasar live dengan slider interaktif, tombol preset cepat, serta proyeksi pertumbuhan majemuk 5 tahun (+8%, +12%, +15%) |
| **5. Sinkronisasi 1-Klik ke Buku Kas** | Pembiayaan dan aset emas harus dibuat terpisah secara manual di 4 menu berbeda | Tombol **"⚡ Sinkronkan ke Portofolio & Buku Kas"** yang otomatis menghubungkan Akun Investasi, Holding Sekuritas, Utang Pembiayaan, Pengeluaran Rutin, dan Target Tabungan |
| **6. Pencatatan Angsuran Instan** | Pembayaran bulanan harus dicatat manual di jurnal transaksi dan sisa utang harus diedit manual | Tombol **"Bayar Angsuran Bulan Ini"** yang otomatis memajukan tenor, mengurangi saldo pokok utang, menambah ekuitas emas, dan mencatat transaksi mutasi |
| **7. Ekspor Jadwal Amortisasi CSV** | Jadwal angsuran hanya tersedia dalam lembar cetak fisik | Tombol unduh mandiri `inveys-pegadaian-cicilan-emas-schedule.csv` memuat seluruh rincian 60 bulan pembayaran |

---

## 1. Rincian Data Kontrak Resmi Pegadaian Mulia (50 Gram)

Berdasarkan dokumen akad pembiayaan resmi nasabah **Muhamad Hendra Febriansyah**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 KONTRAK PEMBIAYAAN EMAS BATANGAN PEGADAIAN                   │
├──────────────────────────┬──────────────────────────────────────────────────┤
│ Produk & Program         │ Pegadaian Mulia Ultimate (Fisik Batangan 24K)    │
│ Produsen / Vendor Logam  │ PT Pegadaian Galeri 24                           │
│ Berat / Keping           │ 1 Keping @ 50.0 Gram (Kadar Kemurnian 99.99%)    │
│ Nomor Kontrak            │ 1379326370001000                                 │
│ Nomor Aplikasi           │ 0217881506505922                                 │
│ Nomor CIF Nasabah        │ 1011695038                                       │
│ Tanggal Akad Pembiayaan  │ 31 Agustus 2026                                  │
│ Tanggal Jatuh Tempo      │ 31 Agustus 2031 (Tenor: 60 Bulan)                │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ Harga Pembelian Awal     │ Rp 126.604.000  (Rp 2.532.080 / gram)            │
│ Uang Muka (DP 15%)       │ Rp 18.990.600                                    │
│ Biaya Administrasi       │ Rp 50.000                                        │
│ Total Pembayaran DP      │ Rp 19.040.600                                    │
│ Uang Pinjaman (Pokok)    │ Rp 107.613.400                                   │
│ Tarif Sewa Modal (Mu'nah)│ ~0.53% flat per bulan                            │
│ Total Sewa Modal (60 Bln)│ Rp 40.260.120  (Rp 671.002 / bulan)              │
│ Angsuran Pokok Bulanan   │ Rp 1.793.557 / bulan  (Bulan ke-60: Rp 1.793.537)│
│ Total Angsuran Bulanan   │ Rp 2.464.559 / bulan  (Bulan ke-60: Rp 2.464.539)│
│ Total Pelunasan Angsuran │ Rp 147.873.520                                   │
│ Total Komitmen Finansial │ Rp 166.914.120  (DP Rp 19,04 Jt + 60x Angsuran)  │
│ Titik Impas (BEP)        │ Rp 3.338.282 / gram                              │
└──────────────────────────┴──────────────────────────────────────────────────┘
```

---

## 2. Fitur & Kemampuan Modul Cicilan Emas

### A. 4 Kartu Indikator Kinerja Utama (KPI Cards)
1. **Valuasi Pasar Emas (50g)**: Menghitung nilai pasar terkini dari keping emas 50g berdasarkan harga spot simulasi yang dipilih.
2. **Sisa Pokok Hutang Pembiayaan**: Menampilkan saldo pokok pinjaman yang masih harus dilunasi kepada Pegadaian (berkurang sebesar Rp 1.793.557 setiap kali angsuran dicatat).
3. **Ekuitas Emas Bersih (*Net Gold Equity*)**: Dihitung dari `Valuasi Pasar - Sisa Pokok Hutang`. Menggambarkan nilai riil yang sudah menjadi hak milik nasabah.
4. **Titik Impas (*Break-Even Price / BEP*)**: Menampilkan target harga emas batangan per gram (**Rp 3.338.282**) di mana total komitmen dana yang telah disetorkan impas dengan nilai pasar emas 50g.

### B. Garis Waktu Tenor & Progres Kepemilikan Interaktif
- Slider interaktif yang memungkinkan pengguna melihat posisi finansial pada bulan ke-0 hingga bulan ke-60.
- Menampilkan persentase tenor yang sudah diselesaikan, gram emas yang secara efektif telah terakumulasi, serta total dana cicilan yang sudah dibayarkan.

### C. Simulator Harga Spot Emas & Proyeksi 5 Tahun (CAGR)
- Slider harga spot dinamis dari Rp 1.800.000 hingga Rp 4.500.000 per gram dengan kotak input angka langsung.
- 4 Tombol Preset Cepat:
  - **Akad Awal**: Rp 2.532.080/g
  - **Titik Impas (BEP)**: Rp 3.338.282/g
  - **Spot Saat Ini**: Rp 2.750.000/g
  - **Target Tenor Lunas (+12% CAGR)**: Rp 4.462.435/g
- Matriks Proyeksi Pertumbuhan Majemuk 5 Tahun:
  - **Konservatif (+8% per tahun)**: Estimasi Rp 3.720.457/g ➔ Valuasi Rp 186.022.836 ➔ Net Profit: +Rp 19.108.716
  - **Moderat (+12% per tahun)**: Estimasi Rp 4.462.435/g ➔ Valuasi Rp 223.121.758 ➔ Net Profit: +Rp 56.207.638
  - **Bullish (+15% per tahun)**: Estimasi Rp 5.092.688/g ➔ Valuasi Rp 254.634.398 ➔ Net Profit: +Rp 87.720.278

### D. Tabel Amortisasi 60 Bulan Lengkap
- Menampilkan jadwal pembayaran bulan ke-1 (September 2026) hingga bulan ke-60 (Agustus 2031).
- Kolom mencakup: Tanggal Jatuh Tempo, Porsi Pokok, Sewa Modal (*Mu'nah*), Total Tagihan, Sisa Pokok Pinjaman, dan Status (Lunas / Menunggu).
- Tersedia tombol ekspor ke berkas spreadsheet CSV (`inveys-pegadaian-cicilan-emas-schedule.csv`).

### E. Integrasi 1-Klik ke Seluruh Sistem INVEYS
Menekan tombol **"⚡ Sinkronkan ke Portofolio & Buku Kas"** akan secara otomatis merefleksikan cicilan emas ke 5 subsistem:
1. **Akun Portofolio**: Akun `acc-gold-pegadaian` bertipe *Investment* dengan nama "Pegadaian Mulia - Emas 50g".
2. **Holding Sekuritas**: Simbol `GALERI24-50G` sejumlah 50 unit gram dengan cost basis Rp 126.604.000.
3. **Liabilitas Utang**: Rekening kewajiban `debt-pegadaian-mulia` bersaldo sisa pokok pinjaman dengan tagihan minimum Rp 2.464.559/bulan.
4. **Arus Kas Bulanan**: Jadwal pengeluaran rutin `flow-pegadaian-angsuran` tanggal 28 setiap bulan.
5. **Target Finansial (*Goal*)**: Sasaran tabungan `goal-gold-50g` untuk pelunasan emas 50g dengan progress bar otomatis.

---

## 3. Verifikasi & Pengujian Sistem

Semua pengujian fungsional dan integritas telah diverifikasi secara ketat:
- **Unit Test Node.js**: 255 pengujian (`node --test tests/*.test.js`) ➔ **100% Lulus (0 Error, 0 Gagal)**.
- **Backend Test Python**: 15 pengujian (`python3 tests/backend_test.py` dan `python3 tests/ai_test.py`) ➔ **100% Lulus**.
- **Kompilasi Mandiri**: `python3 build.py` menghasilkan `inveys-app.html` berukuran 934 KB dengan checksum SHA-256 terdaftar di `build-manifest.json`.

---

## 4. Panduan Pembaruan ke Server VPS (inveys.io)

Pembaruan v0.23.0 telah dikemas ke dalam arsip siap pasang:
**`inveys-v0.23.0-vps-ready.zip`**

### Metode A: Melalui Dashboard Web INVEYS (1-Klik Update)
1. Buka peramban dan login ke situs `https://inveys.io`.
2. Masuk ke menu **Sistem ➔ Pembaruan VPS**.
3. Klik tombol **"Periksa Pembaruan & Pasang Otomatis"**. Sistem akan otomatis melakukan snapshot backup database SQLite, memverifikasi SHA-256, dan me-reload layanan secara instan.

### Metode B: Melalui Terminal SSH VPS
```bash
# 1. Masuk ke direktori aplikasi di VPS
cd /var/www/inveys

# 2. Ambil berkas rilis v0.23.0
# (atau unggah inveys-v0.23.0-vps-ready.zip melalui SFTP/SCP ke direktori /var/www/inveys)
unzip -o inveys-v0.23.0-vps-ready.zip

# 3. Jalankan build dan restart service
python3 build.py
sudo systemctl restart inveys
sudo systemctl reload nginx

# 4. Verifikasi status aplikasi
curl http://127.0.0.1:8000/api/status
```
Layanan akan membalas dengan status:
`{"status":"ok","version":"0.23.0","mode":"production"}`
