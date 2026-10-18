# INVEYS 0.21.0 — Konsolidasi Submenu Modern, Penyelarasan Membership (Plus, Pro, Ultra), dan Mesin Kecerdasan Finansial Personal & Auto-Correction

Tanggal rilis: 14 Oktober 2026. Pembaruan v0.21.0 merupakan lompatan besar pada arsitektur antarmuka (UX), model tiering membership, dan kecerdasan asisten finansial INVEYS. Rilis ini menjawab dua kebutuhan utama:
1. **Penyederhanaan dan Konsolidasi Submenu**: Menggabungkan 22 submenu yang sebelumnya terfragmentasi menjadi 5 Hub Fungsional Terpadu yang dilengkapi bilah *Sub-Module Switcher Bar* di interior halaman, serta menyelaraskan pembagian fitur basic vs. advance dengan jenis paket membership (**Plus, Pro, Ultra**).
2. **Kecerdasan Finansial Personal & Auto-Correction**: Menghubungkan INVEYS dengan model AI terkemuka (**Google Gemini, OpenAI ChatGPT/GPT-4o, Anthropic Claude via 9Router/OpenRouter, Meta AI Muse Spark**) yang diperkaya grounding profil aset dan preferensi pengguna (*personal intelligence*), mesin deteksi anomali/duplikat, pembersihan nama merchant otomatis, serta jaminan keamanan transaksi berbasis **Read-Only Ledger mutlak**.

| Area Pembaruan | Kondisi Sebelumnya | Peningkatan & Solusi di v0.21.0 |
|---|---|---|
| **1. Konsolidasi Hub Submenu** | 22 menu terpisah di navigasi membuat antarmuka terasa ramai dan memerlukan bolak-balik klik | Disederhanakan menjadi 5 Hub Terpadu dengan bilah navigasi tab instan 1-klik di bagian atas setiap halaman interior (*Accounts, Transactions, Cash Flow, Planning, Shared*) |
| **2. Penyelarasan Fitur & Membership Tier** | Batasan fitur belum terpetakan jelas antara tier gratis dengan tier berbayar | Penyelarasan transparan: **Core/Starter** (Fitur dasar selamanya), **Plus** (Smart Capture OCR, Kalender Tagihan, Budget Rollover, Otomasi Aturan), **Pro** (Smart Rebalancing, Skenario Finansial, Monte Carlo), **Ultra** (Konektor CEX CCXT, Multi-Provider AI tanpa batas) |
| **3. Lencana Visual Tier Interaktif** | Indikator tier fitur tidak memiliki identitas warna yang konsisten | Penambahan kelas CSS `.badge.plus`, `.badge.pro`, `.badge.ultra` dengan palet warna elegan yang adaptif terhadap tema terang (*Light Mode*) dan gelap (*Dark Mode*) |
| **4. Grounding Kecerdasan Personal AI** | Prompt AI bersifat generik dan belum mengingat preferensi/karakteristik keuangan pengguna | Grounding context prompt tingkat lanjut di `inveys_ai.py` yang menghubungkan riwayat portofolio, pola pengeluaran, dan preferensi pengguna dengan nama model terpadu (Gemini, ChatGPT, Claude via 9Router, Muse, Lokal) |
| **5. Mesin Koreksi Otomatis Transaksi** | Transaksi yang diinput mentah sering mengandung nama merchant berantakan, typo, atau anomali lonjakan | Mesin *Auto-Correction* cerdas untuk deteksi anomali pengeluaran (*outliers*), pencegahan transaksi duplikat, dan standardisasi otomatis nama merchant (misal: `GOPAY*TRANSJABODETABEK` -> `GoPay / Transjakarta`) |
| **6. Keamanan Ledger Read-Only Mutlak** | Risiko AI pihak ketiga melakukan manipulasi data buku besar secara liar | Arsitektur keamanan ketat: Asisten AI hanya memiliki akses baca (*Read-Only*) terhadap buku besar; tidak dapat menambah/mengedit/menghapus mutasi kas tanpa konfirmasi persetujuan pengguna |

---

## 1. Konsolidasi Submenu Terpadu (Sub-Module Switcher Bars)

Untuk menjaga kepatuhan navigasi tanpa merusak alur bookmark/URL, kini interior setiap halaman inti dilengkapi bilah tab switcher instan (*Sub-Module Switcher Bar*). Pengguna dapat berpindah antar halaman terkait hanya dengan 1 klik tanpa perlu membuka sidebar:

1. **Hub Akun & Saldo (`accountSwitcher`)**:
   - `accounts`: Ringkasan Akun & Saldo Kas (*Core*)
   - `cards`: Kartu Kredit & Pemantauan Limit (*Core*)
   - `debt`: Manajemen Pinjaman & Amortisasi Hutang (*Plus*)
2. **Hub Buku Besar & Transaksi (`transactionSwitcher`)**:
   - `transactions`: Buku Besar & Riwayat Mutasi (*Core*)
   - `capture`: Smart OCR & Scan Struk Belanja (*Plus*)
   - `categories`: Master Kategori Pengeluaran & Pemasukan (*Core*)
   - `operations`: Operasi Batch & Perapian Data Massal (*Plus*)
3. **Hub Arus Kas & Anggaran (`cashflowSwitcher`)**:
   - `cashflow`: Diagram Alir Kas Sankey Multi-Tier (*Core*)
   - `budget`: Anggaran Kategori Fleksibel & Rollover (*Plus*)
   - `calendar`: Kalender Arus Kas & Pengingat Tagihan (*Plus*)
4. **Hub Perencanaan & Proyeksi Finansial (`planningSwitcher`)**:
   - `forecast`: Proyeksi Pertumbuhan Kekayaan Jangka Panjang (*Core*)
   - `goals`: Target Tabungan & Dana Darurat (*Plus*)
   - `scenarios`: Pemodelan Skenario Finansial & What-If (*Pro*)
   - `montecarlo`: Simulasi Probabilitas Keberhasilan Monte Carlo (*Pro*)
5. **Hub Finansial Bersama & Keluarga (`sharedSwitcher`)**:
   - `shared`: Pelacakan Kas & Portofolio Bersama (*Core*)
   - `household`: Anggaran & Alokasi Rumah Tangga (*Core*)

---

## 2. Matriks Penyelarasan Plans & Membership

Fitur-fitur INVEYS kini terstruktur ke dalam 4 tingkatan tier membership yang transparan (`plans.js`):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INVEYS MEMBERSHIP TIERS                         │
├───────────────┬───────────────┬────────────────┬───────────────────────┤
│ CORE / FREE   │ PLUS          │ PRO            │ ULTRA                 │
│ (Selamanya)   │ (Lifestyle)   │ (Investor)     │ (Multi-Asset & Power) │
├───────────────┼───────────────┼────────────────┼───────────────────────┤
│ • Akun & Kas  │ • OCR Struk   │ • Rebalancing  │ • CCXT Crypto CEX     │
│ • Transaksi   │ • Kalender    │   Portofolio   │   (8 Exchange Live)   │
│ • Sankey Flow │ • Rollover    │ • Skenario     │ • Unlimited AI Router │
│ • Kategori    │   Budgeting   │   Finansial    │   (Claude, GPT, Gemini│
│ • Forecast    │ • Goals &     │ • Simulasi     │ • Advanced Multi-User │
│ • Shared Akun │   Tabungan    │   Monte Carlo  │   & Webhook Sync      │
│               │ • Auto Rules  │ • Health Audit │                       │
└───────────────┴───────────────┴────────────────┴───────────────────────┘
```

Setiap switcher tab dan kartu fitur menampilkan lencana visual eksklusif:
- `.badge.plus`: Lencana ungu lembut (*Purple gradient*)
- `.badge.pro`: Lencana biru cerah (*Blue-indigo accent*)
- `.badge.ultra`: Lencana amber emas (*Gold-amber metallic*)

---

## 3. Kecerdasan Finansial Personal & Auto-Correction Engine

INVEYS v0.21.0 memperluas kemampuan engine asisten finansial (`inveys_ai.py` & `app.js`):

### A. Grounding Personal Intelligence & Preferensi
- **Konteks Holistik**: Saat terhubung dengan AI provider, sistem secara otomatis memasukkan konteks ringkasan keuangan terkini (total kekayaan bersih, tingkat tabungan bulanan, profil risiko, dan tujuan keuangan) ke dalam *system prompt*.
- **Penyedia AI Lengkap & Transparan**:
  - `Google Gemini`: Analisis multimodal cepat dan efisien.
  - `OpenAI (ChatGPT / GPT-4o)`: Kemampuan penalaran finansial mendalam dan penataan rencana anggaran.
  - `9Router / OpenRouter (Anthropic Claude)`: Analisis komparatif beretika dengan nuansa finansial presisi tinggi.
  - `Meta AI (Muse Spark)`: Ringkasan naratif otomatis mingguan/bulanan.
  - `Lokal (Kalkulator Deterministik)`: Komputasi offline 100% tanpa pengiriman data ke server eksternal.

### B. Mesin Auto-Correction & Kebersihan Data Transaksi
- **Pembersihan Nama Merchant**: Mengubah string transaksi mesin EDC/QRIS yang tidak ramah manusia menjadi nama merchant yang rapi (contoh: `INDOMARET POINT TGR-089` -> `Indomaret Point`, `GOPAY*TRANSJABODETABEK` -> `GoPay / Transjakarta`).
- **Deteksi Transaksi Duplikat**: Mengidentifikasi potensi pencatatan ganda berdasarkan kesamaan nominal, tanggal, dan nama merchant dalam jendela waktu sempit.
- **Deteksi Anomali Pengeluaran (*Outlier Spike*)**: Memberi peringatan visual jika ada pengeluaran pada suatu kategori yang melonjak drastis di atas 3x deviasi rata-rata historis bulanan.
- **Saran Kategori Cerdas**: Mengusulkan kategori yang paling sesuai berdasarkan kebiasaan pencatatan pengguna sebelumnya.

### C. Keamanan Ledger Read-Only Mutlak
- Semua interaksi AI beroperasi di bawah prinsip **Read-Only Ledger**.
- AI tidak dapat mengeksekusi operasi penulisan, penghapusan, atau perubahan saldo kas tanpa izin dan konfirmasi eksplisit dari pengguna di antarmuka web.

---

## 4. Hasil Verifikasi & Pengujian Sistem

Seluruh rangkaian pengujian regresi dan endpoint backend dijalankan dan lulus 100%:
- **Node.js Automated Test Suite**: 246 tests passed (0 failed).
- **Python Backend Test Suite**: 14 tests passed (0 failed).
- **Standalone Build**: Kompilasi sukses ke berkas mandiri `inveys-app.html` via `python3 build.py`.
- **Distribusi Siap Pakai**: Berkas arsip kompresi lengkap disimpan di `/Users/muhamadhendrafebriansyah/Downloads/inveys-v0.21.0-vps-ready.zip` dan disinkronkan ke direktori `/Users/muhamadhendrafebriansyah/Downloads/inveys/`.
