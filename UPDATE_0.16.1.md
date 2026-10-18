# INVEYS 0.16.1 — UI Ringkas & Proporsional, Integrasi Beranimasi, Chatbox Cerdas & Navigasi Ramping

Tanggal rilis: 13 Oktober 2026. Pembaruan v0.16.1 menghadirkan 5 penyempurnaan utama berdasarkan masukan pengguna: formulir penambahan transaksi yang lebih proporsional & bebas scroll vertikal, navigasi kategori yang dipindahkan ke Pengaturan (Settings), penggabungan sub-menu Skenario & Monte Carlo, perombakan Chatbox Tanya INVEYS ala ChatGPT/Gemini dengan dukungan lampiran multi-media (file/gambar/dokumen/audio/video), serta tampilan halaman Integrasi yang lebih simpel dilengkapi animasi topologi koneksi data.

| Peningkatan | Status di INVEYS 0.16.1 | Detail & Keunggulan |
|---|---|---|
| **1. Modal Tambah Transaksi Ringkas** | Desain 2-kolom seimbang, tinggi dialog < 440px tanpa perlu scroll | Input berpasangan: Nominal + Pedagang, Tanggal + Rekening, Kategori + Target, Catatan + Tags |
| **2. Kategori Dipindahkan ke Pengaturan** | Sub-menu Kategori dipindahkan dari menu Keuangan ke Pengaturan | Navigasi samping lebih ringkas; Manajer Kategori tetap dapat diakses penuh di menu Pengaturan |
| **3. Skenario & Monte Carlo Bersatu** | Digabung dalam 1 sub-menu navigasi di bawah Perencanaan | Header dilengkapi sub-tab switcher 1-klik untuk beralih instan antara Skenario dan Simulasi Monte Carlo |
| **4. Chatbox Tanya INVEYS Generasi Baru** | Pengalaman mirip ChatGPT / Gemini dengan typing shimmer & chip starter | Mendukung lampiran multi-format: File, Gambar, Dokumen/PDF, Audio, dan Video (< 8 MB) |
| **5. Integrasi Simpel & Animasi Topologi** | 4 kartu modular terpadu + diagram topologi SVG interaktif berdenyut | Aliran data beranimasi menghubungkan Hub INVEYS dengan AI, Telegram, Live FX, dan Python Core |

---

## Rincian 5 Pembaruan Utama

### 1. Form Modal Penambahan Transaksi Lebih Proporsional & Bebas Scroll
- **Tantangan Sebelumnya:** Modal formulir transaksi memanjang ke bawah sehingga pengguna di laptop atau layar resolusi standar harus menggulir (scroll) ke bawah untuk menekan tombol simpan.
- **Solusi di v0.16.1:**
  - Formulir dirombak menggunakan tata letak CSS Grid 2-kolom (`gap: 9px 12px`).
  - Elemen dipasangkan secara logis:
    - Kolom 1 & 2: Nominal Transaksi & Nama Pedagang / Merchant.
    - Kolom 3 & 4: Tanggal Transaksi & Akun / Rekening Sumber.
    - Kolom 5 & 6: Kategori (Popover Flyout) & Alokasi Target Sasaran.
    - Kolom 7 & 8: Catatan Singkat & Chip Label/Tag Interaktif.
  - Kartu penyesuaian saldo (*Adjust balance switch*) dan tombol aksi dibuat ringkas.
  - Total tinggi modal terjaga di bawah 440px sehingga seluruh kontrol tampak langsung tanpa perlu scroll.

### 2. Sub-menu Kategori Dipindahkan ke Menu Pengaturan (Settings)
- **Tantangan Sebelumnya:** Sidebar Keuangan memiliki terlalu banyak sub-menu yang membuat navigasi terasa padat.
- **Solusi di v0.16.1:**
  - Sub-menu `Kategori` dipindahkan keluar dari grup Keuangan pada sidebar utama.
  - Pengelolaan kelompok kategori dan pembuatan kategori kustom kini dipusatkan di halaman **Pengaturan (Settings)** pada kartu *Kategori & Pengelompokan Finansial*.
  - Akses cepat ke Manajer Kategori juga tetap tersedia melalui tombol shortcut di halaman Transaksi dan dialog pemilih kategori.

### 3. Penggabungan Sub-menu Skenario & Monte Carlo
- **Tantangan Sebelumnya:** Skenario perencanaan dan simulasi probabilitas Monte Carlo terpisah di sidebar meski keduanya merupakan satu kesatuan analisis perencanaan keuangan.
- **Solusi di v0.16.1:**
  - Keduanya disatukan ke dalam satu sub-menu terpadu di bawah menu **Perencanaan**.
  - Ditambahkan **Sub-tab Switcher Interaktif** di bagian atas halaman:
    - Tombol **Skenario Perencanaan** (penyesuaian delta pemasukan, pengeluaran, dan biaya 1x).
    - Tombol **Simulasi Monte Carlo** (proyeksi probabilitas pasar berbasis deviasi standar).
  - Navigasi berpindah secara instan 1-klik tanpa me-reload aplikasi.

### 4. Chatbox Tanya INVEYS Lebih Efisien & Bertenaga (Ala ChatGPT & Gemini)
- **Tantangan Sebelumnya:** Chatbox asisten perlu tampilan yang lebih efisien, responsif, dan fleksibel dalam menerima lampiran dokumen maupun multimedia.
- **Solusi di v0.16.1:**
  - **Tampilan Percakapan Modern:** Gelembung percakapan dengan tipografi jelas, status online hijau berdenyut, dan efek *typing shimmer dots* saat asisten sedang memproses jawaban.
  - **Starter Prompt Chips:** Menampilkan rekomendasi pertanyaan cepat saat riwayat chat kosong (*Kekayaan Bersih*, *Arus Kas Bulan Ini*, *Target Tabungan*).
  - **Multi-Media & File Attachments:**
    - Mendukung format: Gambar (`image/*`), Dokumen/PDF (`application/pdf`, `text/*`), Audio (`audio/*`), dan Video (`video/mp4`, `video/webm`, `video/quicktime`).
    - Badge tag visual interaktif dengan ikon spesifik (`🖼️ Gambar`, `🎬 Video`, `🎙️ Audio`, `📑 PDF`, `📄 Dokumen`).
    - Menu popover lampiran (`+`) yang cepat untuk memilih sumber berkas atau kamera.
    - Pembatasan ukuran aman (< 8 MB) untuk mencegah beban berlebih pada browser/server.
  - **Efisiensi Input:** Mendukung tombol Enter untuk langsung mengirim dan Shift+Enter untuk baris baru.

### 5. Halaman Integrasi Lebih Simpel dengan Animasi Aliran Data
- **Tantangan Sebelumnya:** Halaman integrasi memerlukan visualisasi yang lebih jelas dan mudah dipahami oleh pengguna awam mengenai bagaimana layanan luar terhubung ke INVEYS.
- **Solusi di v0.16.1:**
  - **Visual Topology Diagram (SVG):** Menampilkan diagram arsitektur interaktif dengan node pusat **INVEYS Hub** yang terhubung ke 4 satellite node:
    1. **AI Provider:** Integrasi model LLM (OpenAI, Anthropic, Gemini, Groq, DeepSeek).
    2. **Telegram Bot:** Notifikasi transaksi & rekonsiliasi instan via Telegram.
    3. **Live FX Rates:** Pembaruan kurs valuta asing otomatis untuk multi-currency.
    4. **Python Core Engine:** Otentikasi sesi aman dan penyimpanan persisten SQLite.
  - **Garis Denyut Beranimasi (Animated Pulse Data Stream):** Efek CSS stroke berdenyut yang mengalir di sepanjang garis koneksi menggambarkan pertukaran data yang aktif.
  - **Tombol Simulasi Ping Real-Time:** Tombol *"Tes Status Semua Integrasi"* menyimulasikan uji latensi ms secara instan ke seluruh modul integrasi.
  - **4 Kartu Modular Sederhana:** Tata letak kartu rapi dengan status indikator (*Online* / *Siap Dikonfigurasi*) dan tombol aksi langsung.

---

## Panduan Update & Jalankan di VPS / Lokal

1. Ekstrak arsip rilis `inveys-v0.16.1-vps-ready.zip`:
   ```bash
   unzip inveys-v0.16.1-vps-ready.zip -d /var/www/inveys
   ```
2. Restart layanan INVEYS pada systemd (jika di VPS):
   ```bash
   sudo systemctl restart inveys
   ```
3. Atau jalankan langsung secara lokal:
   ```bash
   python3 serve.py
   ```
4. Buka peramban di `http://localhost:3000` (atau IP/Domain VPS Anda).
