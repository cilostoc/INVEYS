# INVEYS 0.20.0 — Rilis Integrasi API Crypto Exchange Multi-Platform (CCXT Engine)

Tanggal rilis: 14 Oktober 2026. Pembaruan v0.20.0 menghadirkan integrasi bursa mata uang kripto (*Cryptocurrency Exchange API Integration*) menggunakan pustaka standar industri **CCXT (CryptoCurrency eXchange Trading Library)**. Pembaruan ini memungkinkan portofolio investasi crypto di INVEYS terisi dan tersinkronisasi secara otomatis dari exchange terkemuka dunia dan Indonesia (Bybit, Binance, OKX, Gate.io, Bitget, Indodax, Tokocrypto, KuCoin) dengan arsitektur keamanan ketat berbasis **Read-Only**.

| Area Pembaruan | Masalah / Kebutuhan Sebelumnya | Solusi & Peningkatan di v0.20.0 |
|---|---|---|
| **1. Integrasi API Multi-Exchange (CCXT Standard)** | Portofolio koin crypto harus dicatat secara manual satu per satu, rentan lupa saat terjadi akumulasi atau rebalancing di exchange | Menghubungkan INVEYS ke 8 exchange terkemuka via CCXT: **Bybit, Binance, OKX, Gate.io, Bitget, Indodax, Tokocrypto, dan KuCoin** |
| **2. Keamanan Kredensial & Privasi Lokal (Read-Only)** | Kekhawatiran keamanan terhadap potensi penyalahgunaan API key untuk penarikan (*withdrawal*) atau transaksi liar | Sistem **hanya meminta dan mengizinkan izin baca saldo (Read-Only)**. Izin transfer, penarikan, dan trading ditolak secara arsitektural. Kredensial hanya diproses di server lokal tanpa pihak ketiga |
| **3. Valuasi Multi-Koin Otomatis (USD & IDR)** | Koin di exchange sering dinilai dalam USDT, menyulitkan pelacakan total kekayaan bersih dalam IDR | Mengonversi saldo koin (BTC, ETH, SOL, altcoin, stablecoin) secara live ke nilai **USD dan IDR** terintegrasi kurs harian Frankfurter FX dan tabel harga cadangan cerdas (*intelligent fallback*) |
| **4. Penyaring Debu Koin (*Dust Filter*) & Dialog Tinjau** | Saldo mikro bernilai pecahan sen/rupiah (*dust*) sering mengotori daftar inventaris aset portofolio | Menyediakan ambang batas saldo minimum (*dust threshold*, default $1.00 USD) serta tabel peninjauan interaktif dengan kotak centang (*checkbox*) untuk memilih koin yang ingin diimpor |
| **5. Mode Simulasi Demo 1-Klik (*No Real API Needed*)** | Pengguna ingin menguji tampilan dan alur sinkronisasi sebelum membuat API key di exchange | Tombol **Mode Demo** instan yang mengisi kredensial simulasi realistis untuk menguji deteksi koin, valuasi, dan impor holding tanpa API key asli |
| **6. Dukungan HTTP/SOCKS Proxy untuk ISP Terbatas** | Akses langsung ke beberapa domain API bursa global (seperti Binance/Bybit) dapat dibatasi oleh ISP di Indonesia | Menyediakan parameter input **Proxy HTTP/SOCKS** di antarmuka sinkronisasi serta deteksi variabel lingkungan `HTTP_PROXY` / `HTTPS_PROXY` |

---

## Rincian Fitur Baru & Peningkatan

### 1. Engine Penghubung Exchange Crypto (`inveys_crypto.py`)
* **Pustaka CCXT Terpadu**: Menggunakan `ccxt>=4.0.0` untuk standardisasi pemanggilan API ke ratusan bursa crypto dunia.
* **8 Exchange Didukung Penuh**:
  1. 🟡 **Bybit**: Bursa derivatif dan spot global utama.
  2. 🔶 **Binance**: Penyedia likuiditas crypto terbesar di dunia.
  3. ⬛ **OKX**: Akun terpadu (*Unified Account*) & ekosistem Web3 (mendukung parameter passphrase).
  4. 🔵 **Gate.io**: Bursa altcoin terlengkap.
  5. 🔷 **Bitget**: Bursa spot dan copy-trading populer (mendukung parameter passphrase).
  6. 🇮🇩 **Indodax**: Gerbang utama pertukaran crypto fiat Rupiah (IDR) berizin di Indonesia.
  7. 🇮🇩 **Tokocrypto**: Bursa crypto teregulasi Indonesia terafiliasi ekosistem Binance Cloud.
  8. 🟢 **KuCoin**: Bursa crypto global dengan likuiditas tinggi (mendukung parameter passphrase).
* **Endpoints Server Baru (`serve.py`)**:
  * `GET /api/crypto/exchanges`: Mengambil daftar exchange yang didukung, status CCXT, kebutuhan passphrase, dan panduan API.
  * `POST /api/crypto/test`: Menguji validitas koneksi API Key, Secret, dan Passphrase secara aman dengan proteksi CSRF.
  * `POST /api/crypto/sync`: Mengambil saldo aset non-zero, menghitung valuasi harga live, dan menyaring debu koin.

### 2. Antarmuka Pengguna & Alur Kerja Terpadu
* **Kartu Konektor Crypto di Halaman Integrasi (`Integrations`)**:
  * Menampilkan lencana status kesiapan engine CCXT lokal.
  * Grid lencana 8 bursa crypto yang didukung dengan ikon visual khas.
  * Tombol aksi cepat: `🔗 Hubungkan & Sinkron Crypto` dan `📋 Info Detail Exchange`.
* **Tombol Cepat di Halaman Investasi (`Investment`)**:
  * Tombol aksen primer `Sinkron Crypto CEX` dengan ikon kilau (*sparkles*) pada bilah alat *Data & riwayat*.
  * Mengakses sinkronisasi saldo langsung dari ruang kerja portofolio aset.
* **Modal Sinkronisasi & Peninjauan Bertahap**:
  1. **Langkah 1 (Input Kredensial & Uji Sinyal)**:
     * Banner edukasi keamanan tegas: *"Penting: Gunakan API Key READ-ONLY"*.
     * Tombol 1-klik simulasi data demo untuk eksplorasi instan.
     * Pemilihan bursa dan akun investasi tujuan (bisa memilih akun yang ada atau otomatis membuat akun *"Bybit Wallet"*).
     * Kolom dinamis: Kolom passphrase otomatis muncul khusus untuk OKX, Bitget, dan KuCoin.
     * Tombol *"⚡ Uji Koneksi Read-Only"* untuk verifikasi kredensial sebelum sinkronisasi penuh.
  2. **Langkah 2 (Tinjau & Konfirmasi Saldo)**:
     * Kartu ringkasan: Nama bursa, jumlah koin terdeteksi, total nilai portofolio dalam USD dan IDR.
     * Pilihan akun investasi tujuan (*target account*).
     * Tabel interaktif dengan centang per koin, jumlah unit terperinci (hingga presisi pecahan tinggi), harga pasar, nilai USD, dan nilai IDR.
     * Kompatibilitas penuh dengan **Mode Privasi Global (*Ghost Mode*)**.
  3. **Langkah 3 (Komitmen ke Portofolio)**:
     * Menggabungkan atau memperbarui posisi di `state.holdings` dengan tipe `crypto` dan kelas aset `Crypto`.
     * Mencatat harga pasar terkini ke `state.holdingPrices` untuk kelengkapan riwayat backtest dan grafik pasar.
     * Tidak mengubah saldo kas buku besar (*ledger*) umum, menjaga integritas akuntansi kas.

---

## Verifikasi Kualitas & Integritas Pengujian

* **Node.js Test Suite**: Seluruh **246 pengujian lulus 100%** (`tests/engine.test.js`, `tests/recording.test.js`, `tests/finance.test.js`, `tests/investment.test.js`, `tests/appearance.test.js`, `tests/plans.test.js`, `tests/render.test.js`, `tests/assistant.test.js`, `tests/operations.test.js`).
* **Python Backend Test Suite**: Seluruh **13 pengujian backend Python lulus 100%** (`tests/backend_test.py`), termasuk pengujian rute `/api/crypto/exchanges`, `/api/crypto/test`, dan `/api/crypto/sync`.
* **Build Standalone**: Bundle distribusi mandiri `inveys-app.html` berhasil dikompilasi dengan hash SHA-256 terverifikasi di `build-manifest.json`.
