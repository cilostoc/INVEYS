# INVEYS — v0.23.0

> **Financial Operating System & Wealth Management untuk Indonesia**  
> *Alternatif Modern Monarch Money & Copilot dengan Arsitektur Local-First, Maskot AI INVI, Diagram Arus Kas Sankey, AI E-Statement Extractor, dan Privasi 100% Terkendali.*

[![Version](https://img.shields.io/badge/version-0.23.0-emerald.svg)](package.json)
[![Architecture](https://img.shields.io/badge/architecture-local--first-blue.svg)](docs/ARCHITECTURE.md)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)](docker-compose.yml)
[![CI/CD](https://img.shields.io/badge/deploy-GitHub%20Actions%20%2B%20Watchtower-purple.svg)](.github/workflows/docker-publish.yml)
[![Tests](https://img.shields.io/badge/tests-344%20passed%20(100%25)-success.svg)](tests/)

---

## 🌟 Sekilas Fitur Unggulan

* **🤖 Maskot AI INVI (The Intelligent Guardian / Financial Copilot)**:
  * Maskot AI interaktif dengan bodi keramik putih gading (*Ivory White*), aksen emas sampanye, jubah *Deep Navy*, dan mata LED kuning keemasan berpendar hangat.
  * Dilengkapi 10+ pose & ekspresi dinamis (*Happy, Thinking, Excited, Confident, Wink, Remind, Analyze, Give Insight, Celebrate, Sleep*).
  * Fisika melayang *dual-sinusoidal* yang sangat *fluid*, pendaran napas LED emas, pelacakan pandangan mata responsif kursor, serta animasi datang (*Spring Teleport*) & pergi (*Departure Slide-Down*).
  * Dilengkapi **Studio Karakter INVI** interaktif dengan pilihan ukuran (90px, 120px, 160px Hero 3D) dan panduan filosofi etika AI (*INVEYS Mascot Soul*).
* **🏦 Ekosistem Perbankan & E-Wallet Indonesia**:
  * Mendukung 14 bank nasional: BCA, Mandiri, BRI, BNI, Bank Jago, Jenius (BTPN), CIMB Niaga, Permata, Danamon, Blu by BCA Digital, SeaBank, dan kartu kredit perbankan.
  * Dukungan penuh dompet digital: GoPay, OVO, DANA, ShopeePay sebagai aset likuid.
* **📊 Monarch-Style Cash Flow Sankey & Calendar**:
  * Visualisasi diagram alir kas multi-tier: memetakan pemasukan bersih ke alokasi kebutuhan pokok, tabungan masa depan, dan gaya hidup.
  * Kalender tagihan visual (*Monarch-style grid & list view*) untuk mengelola jadwal gaji, langganan rutin, dan tanggal jatuh tempo.
* **📄 AI E-Statement Extractor & Smart Capture**:
  * Ekstraksi mutasi rekening dan e-statement PDF secara otomatis tanpa perlu menyerahkan kredensial m-Banking.
  * Dukungan drag & drop batch multi-file, tautan Google Drive, dan validasi inline cerdas dengan koreksi mandiri.
* **📈 Portofolio Multi-Aset, Kripto & Tabungan Emas**:
  * Pelacak portofolio terpadu dengan analisis *drift rebalancing*.
  * Integrasi konektor bursa kripto (Bybit, Binance, Tokocrypto, Indodax via CCXT).
  * Simulasi & pencatatan cicilan emas fisik Pegadaian (Galeri 24) dengan harga spot otomatis.
  * Generator rekap pajak SPT Tahunan DJP Online format resmi Indonesia.
* **🔒 Privasi 100% Terkendali (Local-First)**:
  * Berkas keuangan tersimpan dalam SQLite Vault terenkripsi di perangkat atau server pribadi Anda.
  * Fitur **Ghost Mode** untuk menyamarkan nominal secara instan saat membuka aplikasi di ruang publik.
  * Kunci brankas biometrik / password dengan timer *auto-lock*.
* **🧹 Ramah Pemula & Senior**:
  * Tombol 1-klik untuk membersihkan transaksi contoh (*clear sample data*) sehingga pengguna baru dapat memulai pencatatan dari saldo 0 atau saldo aktual.
  * **Easy Mode** dengan tipografi besar dan kartu aksi cepat untuk kemudahan navigasi senior dan mobile.

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Pilih mode yang paling sesuai dengan kebutuhan Anda:

### Mode 1: Berkas Mandiri Standalone (Paling Cepat / Offline / 0-Install)
Cukup unduh berkas **`inveys-app.html`** dari repositori ini, lalu buka langsung di browser favorit Anda (Google Chrome, Safari, Firefox, Edge).
* Berjalan 100% mandiri tanpa server, tanpa Node.js, dan tanpa internet.
* Dapat disimpan di laptop atau flashdisk dan dibuka saat mode pesawat.
* URL lokal langsung: `file:///Users/muhamadhendrafebriansyah/INVYES/inveys-app.html`

---

### Mode 2: Server Python Lokal & PWA (Pengembangan di Laptop)
Gunakan mode ini jika Anda ingin mengaktifkan sinkronisasi database lokal, parser OCR Tesseract, dan fitur AI Copilot:

```bash
# 1. Kloning repositori
git clone https://github.com/cilostoc/inveys.git
cd inveys

# 2. Instal dependensi Python
python3 -m pip install -r requirements.txt

# 3. Jalankan server lokal
python3 serve.py
# atau
npm start
```

Buka peramban Anda di:
* **Landing Page:** [http://127.0.0.1:3000](http://127.0.0.1:3000)
* **Aplikasi / Dashboard:** [http://127.0.0.1:3000/app](http://127.0.0.1:3000/app)

---

### Mode 3: Deploy VPS / Cloud Docker (Hostinger / Traefik / Produksi)

INVEYS telah siap dijalankan di container Docker dengan sertifikat otomatis SSL/HTTPS dan sistem pembaruan otomatis (*hands-free*).

#### A. Konfigurasi Lingkungan Awal (`.env`)
Salin template konfigurasi lingkungan dan sesuaikan variabel Anda:

```bash
cp .env.example .env
```

Isi berkas `.env` dengan konfigurasi Anda (kunci API bersifat opsional dan dapat diatur langsung di dalam aplikasi):
```env
# Domain & Keamanan Jaringan
DOMAIN=inveys.io
ALLOWED_HOSTS=inveys.io,www.inveys.io,187.77.134.249,127.0.0.1,localhost

# AI Gateway (9Router / Gemini / OpenAI) - Masukkan API Key Anda jika ada
NINEROUTER_API_KEY=
NINEROUTER_MODEL=ag/gemini-3.8-flash
NINEROUTER_BASE_URL=https://9router-uef5.srv2048942.hstgr.cloud/v1

# Opsional: Bot Notifikasi Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

> [!TIP]
> **Pengaturan Kunci API Fleksibel & Mandiri di Aplikasi:**
> Anda dapat mengatur, menguji koneksi (*live test*), dan menyimpan API Key (Google Gemini, OpenAI, 9Router, Meta AI Muse, dan Bot Telegram) secara mandiri kapan saja langsung di UI aplikasi: buka menu **Pengaturan (Settings)** ➔ **Kunci API AI & Telegram Bot** ➔ **Kelola Kunci API & Bot** (atau melalui ikon pengaturan pada Asisten AI).

#### B. Menjalankan via Docker Compose
Jalankan perintah berikut pada server VPS Anda:

```bash
docker compose up -d
```

#### C. Deploy via Hostinger Docker Manager
Jika menggunakan antarmuka web Hostinger:
1. Buka menu **Docker Manager** di hPanel VPS Hostinger.
2. Klik **Compose** → Pilih deploy dari Git Repository.
3. Masukkan tautan repository: `https://github.com/cilostoc/inveys.git`.
4. Masukkan variabel environment pada kolom yang tersedia, lalu klik **Deploy**.
5. Server akan otomatis membaca file [`docker-compose.yml`](docker-compose.yml), mengikat port loopback `127.0.0.1:3000`, dan Traefik host-mode akan otomatis menerbitkan sertifikat SSL HTTPS untuk `inveys.io`.

---

## 🔄 Pembaruan Otomatis 100% Hands-Free (CI/CD)

Proyek ini telah dilengkapi pipeline otomasi penuh:
1. **GitHub Actions**: Setiap ada perubahan kode yang di-push ke branch `main`, GitHub Actions secara otomatis menjalankan seluruh pengujian otomatis (344 tests), meng-compile image Docker, dan mem-publish ke **GitHub Container Registry** (`ghcr.io/cilostoc/inveys:latest`).
2. **Pembaruan 1-Klik / Zero Downtime**: Di server VPS Hostinger Anda, pembaruan versi terbaru dapat ditarik kapan saja cukup dengan menekan tombol **Update / Deploy** di panel Docker Manager, atau via perintah `docker compose pull && docker compose up -d` tanpa merusak database vault (`/data`).

---

## 🌐 Arsitektur Routing Web

| Rute URL | Tampilan | Deskripsi |
| :--- | :--- | :--- |
| **`https://inveys.io/`** | **Landing Page** | Halaman utama publik: showcase fitur, ekosistem bank, keamanan, paket lisensi, dan FAQ. |
| **`https://inveys.io/app`** | **Aplikasi Vault** | Dashboard interaktif: rekening, jurnal transaksi, visualisasi Sankey, forecast, dan copilot. |
| **`https://inveys.io/inveys-app.html`** | **Portable Bundle** | Berkas mandiri yang telah dikompilasi seluruh stylesheet dan skripnya menjadi satu. |
| **`https://inveys.io/api/*`** | **REST Backend** | Layanan backend Python: autentikasi multi-user, backup SQLite, simulasi pembayaran, dan AI gateway. |

---

## 📁 Struktur Direktori Proyek

```text
inveys/
├── docs/                     # Dokumentasi teknis & arsitektur sistem
│   ├── ARCHITECTURE.md       # Arsitektur sistem 4-segmen & skema data
│   ├── DOCKER_DEPLOYMENT.md  # Panduan deployment Docker & VPS lengkap
│   ├── AI_SETUP.md           # Konfigurasi AI Copilot & model
│   ├── INVESTMENT_ENGINE.md  # Formula kalkulasi TWR & rebalancing
│   └── updates/              # Riwayat pembaruan rilis (v0.14 s/d v0.23)
├── src/                      # Kode sumber antarmuka frontend SPA & PWA
│   ├── index.html            # Antarmuka SPA inti aplikasi
│   ├── landing.html          # Kode sumber Landing Page publik
│   ├── styles.css            # Design system & dark mode stylesheet
│   ├── app.js                # Orkestrasi navigasi & maskot AI INVI
│   ├── engine.js             # Financial integer & calculation engine
│   ├── finance.js            # Shared views & proyeksi arus kas
│   ├── investment.js         # Portofolio aset & cicilan emas
│   ├── operations.js         # Audit transaksi & rekonsiliasi kartu
│   └── assistant.js          # Antarmuka AI copilot
├── server/                   # Backend daemon Python & microservices
│   ├── serve.py              # HTTP server, routing, & auth multi-user
│   ├── inveys_ai.py          # Adapter AI (Gemini, OpenAI, 9Router)
│   └── inveys_crypto.py      # CCXT Crypto connector
├── scripts/                  # Skrip otomasi rilis & build
│   └── build.py              # Kompiler single-file HTML mandiri
├── tests/                    # Pengujian otomatis frontend & backend (344 tests)
├── .github/workflows/        # Otomasi CI/CD GitHub Actions
├── Dockerfile                # Multi-stage production container image
├── docker-compose.yml        # Konfigurasi standar produksi & Traefik
├── docker-compose.local.yml  # Konfigurasi Docker mandiri lokal
├── requirements.txt          # Dependensi pustaka Python
├── build.py                  # Runner kompilasi root
├── serve.py                  # Runner server root
├── landing.html              # Berkas kompilasi landing page
└── inveys-app.html           # Berkas kompilasi aplikasi mandiri
```

---

## 🧪 Validasi Kualitas & Pengujian Otomatis

Seluruh logika finansial dan endpoint backend dilindungi oleh rangkaian **344 pengujian otomatis (100% lulus)**:

```bash
# Kompilasi bundel HTML mandiri
python3 build.py

# Menjalankan seluruh tes (Frontend + Calendar + Backend + AI)
npm run test:all

# Atau menjalankan secara terpisah:
npm test                        # 287 unit test frontend
npm run test:calendar           # 7 unit test kalender arus kas
python3 tests/backend_test.py   # 37 test integrasi backend
python3 tests/ai_test.py        # 13 test gateway AI
```

---

## 📖 Prinsip Finansial & Fitur Inti

### 1. Tampilan Bersama (Shared Views)
* Perspektif **seluruh keluarga**, **bersama**, dan masing-masing anggota keluarga tersedia pada Dashboard, Rekening, Transaksi, Arus Kas, Goals, Utang, Kartu Kredit, Reports, dan Forecast.
* Pembagian (*split*) transaksi mendukung nominal pasti atau persentase presisi dengan metode *largest remainder* tanpa mengubah saldo riil akun.

### 2. Laporan & Diagram Arus Kas (Reports & Sankey)
* Mendukung agregasi bulanan, kuartalan, dan tahunan tanpa mencampur transfer internal.
* Diagram alir kas Sankey multi-tier memetakan pemasukan bersih ke alokasi kebutuhan pokok, tabungan masa depan, dan gaya hidup.
* Kalender tagihan bulanan untuk memastikan tidak ada denda keterlambatan pembayaran.
* Ekspor visual tersedia dalam format SVG vektor tajam dan CSV terstruktur.

### 3. Forecast Terpadu & Monte Carlo
* Proyeksi kekayaan masa depan hingga horizon 40 tahun dengan memperhitungkan inflasi, pertumbuhan riil aset, amortisasi utang, serta *life events* (pembelian rumah, jeda karier, kelahiran anak, pensiun).
* Simulasi Monte Carlo menjalankan 1.000–5.000 jalur probabilitas untuk menguji ketahanan portofolio terhadap guncangan pasar.

---

## 📄 Lisensi & Privasi

Dikembangkan oleh Tim Inti INVEYS. Hak cipta dilindungi.  
Dirancang untuk privasi finansial maksimal tanpa ketergantungan pada server pihak ketiga.
