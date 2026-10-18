# INVEYS 0.16.3 — Selector Chart 1-Klik Terpadu, Heatmap Finansial, Animasi Putar (+) ➔ (✕) & Popover Lampiran Seamless

Tanggal rilis: 13 Oktober 2026. Pembaruan v0.16.3 menghadirkan 3 penyempurnaan utama berdasarkan permintaan pengguna:
1. **Penyatuan Selector Jenis Chart 1-Klik & Audit Heatmap:** Menghapus dropdown konvensional yang redundan dan menggantikannya dengan tombol toggle cepat 1-klik beranimasi (`[🌈 Sankey]`, `[🍩 Donat]`, `[📊 Batang]`, `[🗓️ Heatmap]`). Pilihan jenis chart Treemap telah digantikan sepenuhnya dengan **Heatmap Finansial Interaktif** yang diaudit bebas error dan mendukung ekspor SVG.
2. **Animasi Berputar Tombol Chatbox (+ ➔ ✕ ➔ +):** Tombol lampiran chatbox kini berputar mulus 405° (satu putaran penuh) menjadi tanda silang (✕) saat menu lampiran dibuka, dan berputar kembali seperti semula setelah memilih/menambahkan dokumen atau file.
3. **Menu Pilihan Lampiran Chatbox Seamless & Bebas Terpotong:** Redesain kartu popover mengambang dengan grid ubin media 2x2 (Kamera, Dokumen, Video, Audio) yang elegan, modern, dan tidak terpotong oleh batas layar/viewport.

| Peningkatan | Status di INVEYS 0.16.3 | Detail & Keunggulan |
|---|---|---|
| **1. Selector Chart 1-Klik Terpadu** | Dropdown lama dihapus, diganti toggle baris bersih | Tombol interaktif langsung: Sankey (khusus Arus Kas), Donat, Batang, dan Heatmap |
| **2. Heatmap Finansial Interaktif** | Menggantikan Treemap secara menyeluruh | Kalender intensitas transaksi harian (SVG) + Matriks konsentrasi kategori + Ekspor SVG |
| **3. Animasi Berputar Chatbox (+)** | Berputar 405° (+ ➔ ✕) dan kembali (✕ ➔ +) | Transisi kurva bezier halus; otomatis berputar kembali saat file terpilih atau ditutup |
| **4. Popover Lampiran Seamless** | Ubin grid 2x2 rapi + efek blur mengambang | 4 media utama (Kamera 📸, Dokumen 📄, Video 🎬, Audio 🎙️) tanpa clipping/scroll terpotong |

---

## Rincian Pembaruan Fitur

### 1. Tombol Toggle 1-Klik Terpadu pada Pilihan Jenis Chart
- **Sebelumnya:** Terdapat tombol toggle cepat dan menu dropdown `<select>` di sebelahnya yang menampilkan pilihan berulang (redundant).
- **Pembaruan di v0.16.3:**
  - Dropdown konvensional telah dihapus dari tampilan antarmuka visual.
  - Seluruh kontrol jenis chart disatukan ke dalam barisan tombol toggle modern:
    - `[🌈 Sankey]` (tampil otomatis pada tab Arus Kas / Cash Flow)
    - `[🍩 Donat]` (diagram cincin 10 palet warna)
    - `[📊 Batang]` (grafik batang tren bulanan)
    - `[🗓️ Heatmap]` (peta panas intensitas pengeluaran)
  - Di belakang layar, state form tetap sinkron secara otomatis sehingga seluruh unit test, pemfilteran, dan penyimpanan laporan tetap berfungsi 100%.

### 2. Penggantian Treemap Menjadi Heatmap Finansial Interaktif
- **Sebelumnya:** Fitur Treemap memiliki visual kotak monoton tanpa konteks garis waktu.
- **Pembaruan di v0.16.3:**
  - Treemap diganti dengan **Heatmap Finansial (Peta Panas Aktivitas)**:
    1. **Kalender Intensitas Harian (SVG):** Menampilkan matriks grid hari dengan gradien warna intensitas pengeluaran (Rendah: Hijau `#10b981`, Sedang: Amber `#eab308`, Tinggi: Oranye `#f97316`, Puncak: Merah `#f43f5e`). Setiap sel dilengkapi tooltip tanggal, nominal rupiah, dan jumlah transaksi.
    2. **Matriks Konsentrasi Kategori:** Kartu ubin kategori dengan avatar emoji, persentase pengeluaran, nominal total, dan frekuensi transaksi.
    3. **Drill-down Instan:** Mengklik salah satu kartu kategori akan langsung menyaring transaksi pada garis waktu sebelah kiri.
    4. **Dukungan Ekspor SVG:** Tombol unduh SVG kini dapat mengekspor diagram Heatmap secara utuh.

### 3. Animasi Berputar Tombol Chatbox (+ ➔ ✕ ➔ +)
- **Sebelumnya:** Tombol `+` statis saat diklik membuka menu lampiran.
- **Pembaruan di v0.16.3:**
  - Diterapkan transisi rotasi 405° berbasis CSS spring (`cubic-bezier(0.34, 1.56, 0.64, 1)`):
    - Saat diklik buka: Tombol berputar 1 putaran penuh (360°) + 45° sehingga bertransformasi sempurna menjadi tanda silang merah `(✕)`.
    - Saat dokumen/file ditambahkan atau menu ditutup: Tombol otomatis berputar kembali ke orientasi `(+)` semula.

### 4. Popup Pilihan File Chatbox Seamless & Bebas Terpotong
- **Sebelumnya:** Menu lampiran chatbox berupa daftar panjang ke bawah yang sering kali terpotong (*clipped*) oleh batas jendela browser dan memunculkan scrollbar kaku.
- **Pembaruan di v0.16.3:**
  - Dirombak menjadi **Kartu Aksi Mengambang (Floating Action Card)** yang seamless:
    - **Header Ringkas:** Label rapi `✨ Tambah Lampiran & Media`.
    - **Grid Ubin Media 2x2:**
      - 📸 **Kamera / Foto:** Ambil foto langsung melalui kamera perangkat.
      - 📄 **Dokumen / File:** Unggah struk, mutasi bank, PDF, atau CSV.
      - 🎬 **Video Media:** Unggah berkas rekaman video (MP4/WebM).
      - 🎙️ **Audio / Suara:** Unggah rekaman suara untuk dianalisis.
    - **Aksi Cepat:** Tombol Percakapan baru, Input suara, dan Pengaturan Model AI.
    - **Pilihan Rekening Terintegrasi:** Dropdown akun dan tipe dokumen disematkan secara proporsional.
    - **Responsif:** Lebar `320px` dengan animasi pop-in halus (`scale(0.96) ➔ scale(1)`) dan elevasi bayangan modern (`backdrop-filter: blur`).

---

## Petunjuk Deployment VPS

1. Ekstrak rilis `inveys-v0.16.3-vps-ready.zip` ke server VPS:
   ```bash
   unzip -o inveys-v0.16.3-vps-ready.zip -d /var/www/inveys
   ```
2. Restart layanan server INVEYS:
   ```bash
   sudo systemctl restart inveys
   ```
3. Buka peramban Anda dan tekan `Ctrl+F5` atau `Cmd+Shift+R` untuk memuat versi terbaru **v0.16.3**.
