# INVEYS — MVP 0.15.0

INtelligent VElocity for Your Financial System.

Financial Operating System lokal untuk rekening, transaksi, Shared Views, Reports, Forecast, tujuan, utang, kartu kredit, serta koordinasi rumah tangga. Data awal adalah contoh.

## Membuka aplikasi

Unduh dan buka `inveys-app.html` di browser. Fitur finansial inti berjalan mandiri. Kurs otomatis memerlukan internet; OCR, Telegram, dan Muse memerlukan server lokal dalam paket sumber.

Untuk penyimpanan browser yang lebih konsisten, jalankan proyek sumber dengan Python 3:

```sh
python3 serve.py
# atau
npm start
```

Buka http://127.0.0.1:3000. Server hanya mendengarkan koneksi lokal.

## Struktur Direktori Proyek

Proyek INVEYS menggunakan arsitektur modular yang rapi sesuai *best practice*:

```text
INVYES/
├── docs/                     # Dokumentasi teknis & panduan sistem
│   ├── README.md             # Indeks dokumentasi lengkap
│   ├── ARCHITECTURE.md       # Arsitektur sistem 4-segmen & skema data
│   ├── AI_SETUP.md           # Panduan konfigurasi model AI (Gemini, OpenAI, Muse)
│   ├── INVESTMENT_ENGINE.md  # Spesifikasi mesin investasi & formula TWR
│   ├── MONETIZATION.md       # Spesifikasi tier & model lokal
│   ├── VERIFICATION.md       # Prosedur QA & verifikasi keamanan
│   └── updates/              # Arsip rilis historis (v0.14.0 s/d v0.23.0)
├── src/                      # Frontend web client & aset PWA
│   ├── index.html            # Antarmuka SPA utama
│   ├── styles.css            # Stylesheet design system
│   ├── app.js                # Orkestrasi UI & navigasi aplikasi
│   ├── engine.js             # Financial integer & calculation engine
│   ├── finance.js            # Shared views & life-event projection
│   ├── investment.js         # Portofolio sekuritas & cicilan emas Pegadaian
│   ├── operations.js         # Aturan transaksi & kartu kredit
│   ├── assistant.js          # Antarmuka AI copilot lokal
│   ├── recording.js          # Parser input struk, audio, & statement
│   ├── plans.js              # Manajemen tier preview
│   ├── appearance.js         # Tema & personalisasi visual
│   ├── i18n.js               # Lokalisasi bahasa (ID / EN)
│   ├── releases.js           # Changelog UI viewer
│   ├── releases.json         # Metadata rilis & riwayat fitur
│   ├── manifest.webmanifest  # Konfigurasi PWA
│   ├── sw.js                 # Service worker untuk offline caching
│   └── icon.svg              # Logo & ikon vektor aplikasi
├── server/                   # Python backend daemon & micro-services
│   ├── serve.py              # Server HTTP & API gateway
│   ├── inveys_ai.py          # Multimodal AI adapters (Gemini, OpenAI, Muse)
│   └── inveys_crypto.py      # CCXT crypto connector
├── scripts/                  # Otomasi build & rilis
│   ├── build.py              # Kompiler single-file standalone HTML
│   └── build-manifest.json   # Checksum integritas rilis
├── tests/                    # Pengujian otomatis (Unit, render, backend, & AI)
├── .gitignore                # Filter berkas Git standar
├── package.json              # Konfigurasi skrip Node.js (test runner)
├── requirements.txt          # Dependensi Python
├── serve.py                  # Entry point server utama (root runner)
├── build.py                  # Entry point build mandiri (root runner)
└── inveys-app.html           # Berkas kompilasi mandiri (standalone app)
```

## Mulai dengan versi 0.4.0

1. Buka **Tampilan bersama / Shared Views** dan periksa pemilik akun, utang, arus rutin, serta tujuan. Migrasi akun mengenali label yang cocok dengan nama anggota; label yang tidak dikenali menjadi **Bersama**, tanpa mengubah label asli atau saldo.
2. Gunakan bilah perspektif untuk memilih seluruh keluarga, seorang anggota, atau bersama. Checkbox **Sertakan milik bersama** menambahkan record bersama pada perspektif anggota. Tampilan pribadi yang menyertakan record bersama dapat saling tumpang tindih; jangan menjumlahkannya untuk membuat total keluarga.
3. Buka **Reports**, pilih periode dan jenis laporan, lalu klik kelompok grafik/tabel untuk melihat transaksi sumber. Simpan konfigurasi filter jika ingin mengulang laporan.
4. Buka **Forecast**. Periksa baseline, usia asumsi, horizon, pertumbuhan, inflasi, dan akun yang disertakan. Tambahkan life events lalu simpan skenario alternatif sebelum mengubah asumsi pembanding.
5. Simpan snapshot posisi dari Dashboard/Reports agar riwayat kekayaan bersih nyata mulai terkumpul. Atur widget Dashboard melalui **Atur dashboard**.

## Shared Views

- Perspektif **seluruh keluarga**, **bersama**, dan masing-masing anggota tersedia pada Dashboard, Accounts, Transactions, Cash Flow, Goals, Debt, Cards, Reports, Forecast, Scenarios, Monte Carlo, serta Copilot.
- Pemilik akun/utang/tujuan/arus rutin memakai `ownerId` anggota atau `shared`. ID tetap stabil ketika nama anggota berubah. Kepemilikan analisis tidak menyatakan perubahan kepemilikan hukum.
- Transaksi default **Ikuti akun**: pemiliknya mengikuti akun secara dinamis. Owner eksplisit tetap dipertahankan ketika pemilik akun berubah. Ubah melalui tombol **Pemilik / Split** pada jurnal.
- Split nominal atau persentase dapat mencakup beberapa anggota dan bagian bersama. Jumlah nominal harus sama persis dengan transaksi asli; persentase harus tepat 100%. Sisa satuan terkecil dialokasikan dengan metode largest remainder. Split tidak mengubah saldo dan tidak membuat transaksi tambahan. Transfer tidak diperlakukan sebagai pengeluaran yang bisa di-split.
- **Editor kepemilikan** dan **Edit transaksi massal** tersedia pada Shared Views. Edit massal mengubah seluruh transaksi sumber yang dipilih dan menghapus split sebelumnya; dialog menjelaskan hal itu sebelum disimpan.
- Saved Views menyimpan owner, opsi menyertakan bersama, dan mata uang laporan. Anggota baru dapat dibuat sebagai identitas lokal; tidak mengirim undangan.
- **Ini bukan berbagi akses multi-pengguna.** Semua pengguna profil browser tersebut masih dapat melihat seluruh data. Tidak ada per-member private account, login terpisah, undangan, atau sinkronisasi lintas perangkat. Fitur akses tersebut memerlukan backend autentikasi dan otorisasi tersendiri.

## Reports

### Laporan historis

Tab **Cash Flow**, **Spending**, dan **Income** memakai transaksi historis pada periode terpilih. Filter: tanggal, akun, kategori, pencarian deskripsi; grouping: kategori, merchant/deskripsi, pemilik, akun, atau bulan.

Transfer internal dikecualikan. Split dihitung berdasarkan porsi pemilik, tanpa menggandakan transaksi. Konversi memakai kurs pelaporan tersimpan saat ini, dengan alokasi pembulatan per owner agar kelompok laporan tetap menjumlah tepat ke total. Ringkasan income/expense mencakup record yang cocok dengan filter; tab Spending/Income menampilkan kelompok dan baris jenisnya saja.

Grafik **bars**, **Sankey** untuk cash flow, dan **treemap** untuk komposisi tersedia. Klik batang/blok atau tombol tabel untuk drill-down. Diagram Sankey memiliki tooltip; rincian transaksi dibuka melalui tabel kelompok. Diagram menggambarkan income versus expenses; surplus/defisit adalah selisih, bukan saldo rekening. Merchant masih menggunakan deskripsi transaksi, belum entity merchant terstandar.

Saved Reports menyimpan nama, filter, perspektif, dan mata uang; membukanya menghitung ulang dari jurnal terbaru. Ekspor CSV mengikuti transaksi/porsi yang sedang ditampilkan. Ekspor grafik SVG menyediakan grafik batang atas kelompok yang sedang dilaporkan. Output menangani karakter XML dan formula CSV.

### Laporan posisi

- **Net Worth** menggunakan snapshot posisi yang benar-benar disimpan melalui tombol Dashboard/Reports. Snapshot menyimpan saldo native, pemilik pada saat snapshot, serta kurs tanggal tersebut. Satu tanggal memiliki satu snapshot; menyimpan ulang memperbarui tanggal yang sama. Riwayat tidak direkonstruksi dari jurnal parsial. Riwayat demo tetap ditandai ilustratif.
- **Debt** dan **Credit Cards** menggunakan saldo/metadata saat ini dengan perspektif kepemilikan. Estimasi payoff memakai engine utang bunga tetap.
- Filter yang tidak berlaku dinonaktifkan pada laporan posisi. Net Worth menggunakan rentang tanggal; laporan utang/kartu adalah posisi saat ini, bukan laporan saldo historis.

## Forecast terpadu

### Model

Proyeksi dimulai dari snapshot akun dan utang saat ini. Periode pertama adalah bulan penuh berikutnya, tanpa membuat proyeksi palsu untuk bulan yang sudah lewat. Horizon 1–40 tahun; rincian bulanan dan agregat setiap 12 periode tersedia. Tahun proyeksi tidak selalu sama dengan tahun kalender.

- Baseline **plan** memakai arus rutin yang ditetapkan pengguna. Baseline **history** memakai jumlah income/expense dalam 12 bulan kalender lengkap sebelum bulan saat ini, dibagi 12. Jumlah bulan yang memiliki record ditampilkan. Bulan tanpa record dianggap nol secara matematis, bukan bukti tidak ada aktivitas. Transfer dikecualikan.
- Inflasi mengubah nominal menjadi daya beli hari ini. Pertumbuhan expense dan income adalah asumsi tersendiri. Mengatur inflasi tidak otomatis mengubah expense growth.
- Account assumptions menyediakan return efektif tahunan dan toggle include. Return default mengikuti jenis akun: investasi, properti, atau kas. Akun yang dikecualikan tidak dimasukkan ke aset awal; utang tetap dihitung.
- Growth bulanan deterministik memakai `(1 + annualRate)^(1/12)` lalu pembulatan ke satuan terkecil. Growth dihitung sebelum arus bulan tersebut.
- Debt interest menggunakan APR/12, dibulatkan per bulan. Pembayaran dibatasi sisa principal plus interest; pembayaran berhenti ketika lunas. Utang dengan pembayaran lebih kecil daripada bunga dapat meningkat.
- Income setelah biaya dan pembayaran utang masuk kas. Defisit menarik kas terlebih dahulu, kemudian investasi sesuai urutan akun. Properti tidak dijual otomatis. Kekurangan setelahnya dicatat sebagai **unfunded obligations**, dikurangkan dari net worth model; ini bukan kredit atau pinjaman yang benar-benar dibuat. Model tidak menambahkan bunga pada gap tersebut.
- Transfer investasi bulanan berasal dari kas yang tersedia setelah pencadangan tujuan. Transfer tidak menaikkan total aset. Alokasi tujuan awal tetap berada di aset; kontribusi baru dibatasi target dan kemampuan kas. Pengeluaran untuk tujuan harus dibuat sebagai life event, bukan diasumsikan otomatis ketika jatuh tempo.
- Nominal target/transfer rencana memiliki mata uang native rencana, sehingga pergantian mata uang laporan mengonversi nilai dan tidak mengganti denominasi tersimpan.
- Usia awal adalah asumsi yang dapat diedit; belum ditarik dari identitas atau tanggal lahir pengguna. Kejadian memakai tanggal kalender.

### Life Events

Jenis yang tersedia:

| Jenis | Perlakuan |
|---|---|
| Pembelian/biaya satu kali | Mengurangi kas sekali pada bulan kejadian. |
| Biaya rutin/pendidikan | Biaya bulanan dari bulan mulai hingga bulan selesai, inklusif. |
| Tambahan income/pekerjaan baru | Menambahkan income bulanan; bukan otomatis mengganti salary lama. |
| Pensiun | Menghentikan income baseline pemilik terpilih, menambahkan replacement income bulanan. |
| Jeda karier | Seperti pensiun selama periode aktif; baseline income kembali setelah selesai. |
| Beli rumah | Membuat aset properti dan utang pembiayaan; uang muka serta pembayaran loan mengurangi kas. |

Event owner **shared** pada pensiun/jeda karier menghentikan seluruh income baseline yang termasuk dalam perspektif, sedangkan owner anggota hanya menghentikan income baseline anggota tersebut. Income tambahan dari event lain tetap terpisah. Parameter rumah mencakup harga, uang muka, APR, dan tenor. Pembayaran pertama dimodelkan pada bulan pembelian. Properti mulai tumbuh pada periode setelah pembelian. Biaya transaksi, pajak, asuransi, pemeliharaan, dan biaya tambahan rumah harus dimasukkan sebagai event terpisah.

Kejadian satu kali dari editor harus dimulai bulan berikutnya atau setelahnya. Kejadian satu kali yang sudah lewat pada rencana impor tidak diputar ulang. Kejadian rutin yang masih aktif tetap dapat memengaruhi proyeksi. Marker grafik menampilkan maksimal 12 kejadian mendatang; daftar kejadian lengkap tetap tersedia di bawahnya.

### Skenario dan perbandingan

**Simpan skenario baru** menyalin asumsi/event rencana terpilih tanpa mengubah baseline atau catatan aktual. Maksimum 20 skenario. Edit horizon, akun, dan life events per skenario. Grafik membandingkan skenario dengan baseline pada horizon yang sama, disertai selisih nilai akhir. Nominal atau daya beli hari ini bisa dipilih. Klik baris tahun untuk melihat saldo akun, utang, dan arus bulanan. Ekspor proyeksi sebagai CSV.

### Monte Carlo terpadu

Tombol di Forecast menjalankan engine yang sama dengan variasi return investasi. Akun, arus rutin, amortisasi, life events, transfer, penarikan, dan shortfall tetap digunakan untuk setiap jalur. Tersedia 100–1.000 jalur, seed, P10/P50/P90, peluang memenuhi target real, dan peluang mengalami shortfall pada periode mana pun, termasuk gap yang kemudian terbayar. Hasil dibatalkan ketika input rencana/sumber data berubah.

Return investasi lognormal dengan drift `(ln(1 + return) - volatility²/2)/12` dan guncangan `volatility/sqrt(12)`. Semua akun investasi memakai shock pasar yang sama per bulan (korelasi 1). Properti/kas tetap deterministik. Nilai persentil disesuaikan inflasi. Monte Carlo standalone versi sebelumnya tetap tersedia untuk simulasi portofolio sederhana; hasilnya bukan pengganti Forecast terpadu.

**Batas model:** kurs masa depan tetap; pajak, fee investasi, future FX risk, volatilitas properti, risiko default, account withdrawal restrictions, dan distribusi return berekor ekstrem tidak dimodelkan. Asumsi default bersifat ilustratif. Shortfall adalah kebutuhan pendanaan, bukan persetujuan kredit. Prediksi tidak menjamin hasil.

## Integrasi dari versi 0.3.0

### Menjalankan integrasi

Python 3.10+ dan Pillow untuk validasi/konversi gambar. OCR memerlukan Tesseract dengan bahasa `eng`; PDF memerlukan Poppler (`pdftotext`); audio memerlukan `ffmpeg`. Instal alat tersebut melalui package manager sistem. Tidak perlu Node untuk menjalankan aplikasi, hanya untuk tes JavaScript.

```sh
python3 -m pip install -r requirements.txt
export TELEGRAM_BOT_TOKEN='isi-token-bot-Anda'
export TELEGRAM_CHAT_ID='isi-private-chat-id-Anda'
export MODEL_API_KEY='isi-api-key-Meta-Anda'
python3 serve.py
```

Nilai di atas adalah placeholder. Kredensial dimasukkan melalui environment pada komputer Anda; jangan memasukkannya ke chat, HTML, workspace JSON, atau repositori. Server tidak membaca `.env` secara otomatis. Hanya aktifkan variabel integrasi yang ingin digunakan. Buka http://127.0.0.1:3000 → Integrasi → Periksa konfigurasi. Status “configured” berarti kredensial tersedia, bukan bahwa koneksi sudah tervalidasi. Jangan membuka port ini ke internet.

### Telegram

Buat bot melalui BotFather, mulai private chat dengan bot, dan konfigurasi ID private chat tersebut. INVEYS menggunakan Bot API resmi. Bot yang sudah memiliki webhook tidak dapat memakai `getUpdates` sekaligus; gunakan bot khusus atau konfigurasi webhook di luar aplikasi ini. Tidak ada pengambilalihan webhook otomatis.

- **Ambil inbox** mengambil maksimal 100 update per permintaan. Teks/caption dari private chat yang diizinkan masuk antrean draft; chat lain tidak diterima.
- Antrean memakai SQLite dan ID update unik agar polling ulang tidak menggandakan inbox. ID baris sumber mencegah pencatatan ulang transaksi Telegram yang sudah disimpan.
- Tinjau nominal, akun, tanggal, dan jenis sebelum menyimpan. Inbox diakui sebagai selesai hanya ketika seluruh draft sumber sudah disimpan. Baris yang tidak dipilih tidak langsung diakui sebagai selesai.
- Foto/voice/file yang dikirim lewat Telegram **belum diunduh otomatis**. Unggah file aslinya melalui Capture.
- **Kirim pesan/pengingat** membuka pratinjau yang bisa diedit. Pengguna menyetujui pesan sebelum pengiriman ke chat yang dikonfigurasi. Pengingat kartu dapat dikirim lewat alur ini.
- Polling dan pengiriman berjalan sesuai tindakan pengguna; belum ada scheduler/server cloud yang mengirim pengingat ketika aplikasi tertutup.

### Muse sebagai asisten AI

Sesuai pilihan asisten AI, integrasi menggunakan **Meta Muse Spark**, bukan layanan arsip video muse.ai. Endpoint resmi `https://api.meta.ai/v1/chat/completions`, model `muse-spark-1.3`, dan kredensial `MODEL_API_KEY`. Akses dan biaya bergantung pada akun/provider.

Menu **Tanya Muse** menampilkan ringkasan yang akan dikirim: mata uang pelaporan, kekayaan bersih, income, expense, pembayaran utang, alokasi tujuan, kapasitas tersedia, tanggal/sumber kurs, beserta pertanyaan. Nama rekening, nomor kartu, file asli, dan jurnal lengkap tidak disertakan. Pengguna wajib menyetujui ringkasan itu sebelum dikirim. Jawaban ditampilkan sebagai teks yang di-escape; AI tidak punya akses tulis ledger, pembayaran, atau eksekusi kode. Percakapan sementara tidak disertakan dalam ekspor.

### Capture: gambar, statement, teks, dan suara

- Unggah PNG/JPEG/WebP atau PDF, maksimal 8 MB. **OCR file** memakai Tesseract lokal dengan model English. PDF teks memakai `pdftotext`, maksimal 30 halaman pertama. PDF scan tanpa teks harus diekspor menjadi gambar terlebih dahulu. Teks hasil ekstraksi dibatasi 100.000 karakter.
- File asli diproses sementara dan dibersihkan setelah permintaan. File asli tidak disimpan ke workspace. Hasil teks/transkrip tetap di memori halaman sampai draft dibuang/disimpan atau halaman ditutup.
- Parser statement mendukung baris `YYYY-MM-DD deskripsi nominal CR/DR`. CR adalah pemasukan; DR, nilai negatif, atau tanpa penanda dianggap pengeluaran. Parser ini belum mencakup seluruh layout bank, kolom saldo berjalan, atau transfer yang dipasangkan. Bandingkan draft dengan dokumen sumber; baris lain dapat tidak dikenali.
- Nominal format `1.234,50` maupun `1,234.50` didukung. Pemisah tunggal tiga digit dianggap pemisah ribuan. Nominal yang ambigu harus dikoreksi. Mata uang eksplisit Rp/IDR atau ISO yang didukung dikenali; selain itu memakai mata uang akun yang dipilih. Akun dengan mata uang berbeda ditolak saat simpan, tanpa konversi tersembunyi.
- Struk memakai baris TOTAL/JUMLAH, menghindari subtotal. Hasil tetap harus ditinjau karena OCR bisa keliru. Draft batch dibatasi 100 baris.
- **Input suara** memakai Web Speech API pada browser yang mendukung. Pengguna diberi konfirmasi bahwa layanan browser dapat menerima audio. Alternatif: unggah audio lalu **Transkripsi audio dengan Muse** setelah persetujuan. Server mengonversi audio menjadi mono PCM WAV 24 kHz, maksimum 120 detik, kemudian mengirim ke endpoint Muse ASR resmi. Tidak ada perekaman terus-menerus.
- Parser suara menerima nominal numerik seperti “beli kopi 25 ribu” atau “terima gaji 5 juta”. Ejaan nominal yang tidak dikenali dapat dikoreksi melalui kolom teks.
- Draft memiliki tanggal, akun, jenis, nominal, status pilihan, dan opsi perbarui saldo. **Statement historis default jurnal saja**, agar snapshot saldo akun tidak dihitung dua kali. Struk/suara default memperbarui saldo. Periksa opsi ini untuk setiap baris.
- Penyimpanan batch dilakukan pada salinan workspace dan divalidasi sebelum dipersistenkan; kegagalan salah satu baris tidak mengubah sebagian saldo.

### Indikator duplikasi

Indikator muncul pada review draft dan jurnal ketika akun, mata uang, nominal, jenis, dan tanggal (selisih maksimal dua hari) cocok. Ini sinyal untuk ditinjau, bukan kepastian duplikasi. Draft yang sudah terindikasi tidak dipilih otomatis; untuk menyimpannya pengguna harus memasukkan alasan. Alasan dipertahankan pada record. Transaksi yang sah tidak dihapus otomatis. Source key Telegram yang sudah tercatat tetap tidak dapat diimpor ulang, meskipun alasan diberikan.

### Kurs otomatis

Kurs referensi harian Frankfurter diperbarui saat aplikasi dibuka, maksimal sekali per 8 jam, atau melalui **Perbarui sekarang**. Bisa dinonaktifkan dengan checkbox. Layanan memakai `v2/rates?base=IDR&quotes=USD,EUR,GBP,SGD,AUD,JPY`; quote API dibalik agar penyimpanan konsisten sebagai IDR per unit mata uang. Semua quote harus lengkap dan positif sebelum kurs baru diterima.

Kurs referensi bukan kurs jual/beli bank atau harga intraday. Tanggal dan sumber terlihat. Jika gagal, kurs tersimpan dipertahankan dan kegagalan ditampilkan. HTML portabel mencoba endpoint publik secara langsung; keberhasilan bergantung pada jaringan/CORS browser. Pengaturan kurs manual tetap tersedia. Konversi pelaporan tidak mengubah nominal jurnal asli atau snapshot transfer lama.

### Pembaruan versi

Menu **Pembaruan versi** menampilkan versi 0.4.0 dan riwayat 0.1/0.2/0.3/0.4 dalam dua bahasa. **Periksa pembaruan** memeriksa manifest server lokal. Distribusi rilis cloud dan pemasangan otomatis belum disediakan. Setiap rilis memperbarui `package.json`, manifest, changelog, dokumentasi, build HTML, serta verifikasi. Ekspor backup, ganti paket aplikasi, lalu jalankan kembali. Skema workspace v1 tetap kompatibel; berpindah origin/path browser dapat memerlukan impor backup.

### Batas keamanan dan penyimpanan server

API menerima Host loopback yang ditentukan; mutasi memerlukan Origin lokal dan token CSRF yang diperoleh dari server. Tidak ada CORS lintas origin. Static serving memakai daftar file yang diizinkan: source Python, credential files, dan database tidak dilayani. Ukuran file/permintaan dan waktu OCR/audio dibatasi; error provider tidak menampilkan kredensial; request tidak dicatat ke log.

Inbox Telegram tersimpan di `~/.inveys/inbox.sqlite3` (atau direktori `INVEYS_DATA_DIR`) dengan izin file pemilik. Database tidak dienkripsi, tidak disertakan dalam ZIP, dan terpisah dari localStorage. Menghapus workspace browser tidak menghapus inbox server; untuk menghapusnya sepenuhnya, hentikan server dan hapus database tersebut. Jangan gunakan komputer/profil browser bersama untuk data sensitif. Ini belum sistem autentikasi atau otorisasi produksi.

Dokumentasi provider: [Telegram Bot API](https://core.telegram.org/bots/api), [Meta API quickstart](https://dev.meta.ai/docs/quickstart), [Meta speech-to-text](https://dev.meta.ai/docs/speech-to-text), [Frankfurter](https://frankfurter.dev/), dan [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

## Fitur dari versi 0.2

### Bahasa

Pilihan Bahasa Indonesia dan English ada di bagian atas aplikasi. Pilihan disimpan dalam workspace. Format nominal dan bulan mengikuti locale. Nama, catatan, dan nilai input pengguna dipertahankan. Kopilot perhitungan menerima topik yang didukung dalam kedua bahasa.

### Multi-currency dan IDR

Mata uang: IDR, USD, EUR, GBP, SGD, AUD, JPY.

Setiap rekening, utang, arus rutin, dan tujuan memiliki mata uang asli. Mata uang laporan di bagian atas bisa diganti tanpa mengubah nominal asli. Dashboard mengonversi masing-masing record ke mata uang laporan. Rekening dan kartu menampilkan nilai ekuivalen IDR.

Kurs adalah **IDR per satu unit mata uang** dan bisa diedit melalui Pengaturan & data → Edit kurs. Kurs awal merupakan ilustrasi, bukan kurs pasar aktual. Tanggal serta sumber kurs disimpan. Kurs otomatis tersedia melalui menu Integrasi; data awal tetap ilustratif sampai pembaruan pertama berhasil. Tidak ada integrasi harga aset langsung.

Konversi: nominal asli × kurs IDR mata uang asal ÷ kurs IDR mata uang tujuan. Hasil dibulatkan sekali ke satuan penyimpanan terdekat. Nominal disimpan sebagai integer dalam satuan seperseratus mata uang; ringkasan umumnya dibulatkan ke unit penuh, sementara saldo record menampilkan hingga dua desimal. Selisih kecil akibat pembulatan FX dapat terjadi.

Transfer lintas mata uang mencatat nominal sumber, nominal yang diterima, mata uang tujuan, tanggal, dan sumber kurs saat pencatatan. Ini pencatatan manual, bukan transfer bank. Mata uang record lama dikunci di editor agar tidak mengubah denominasi jurnal; gunakan rekening/record baru untuk denominasi berbeda.

### Tema

Tombol matahari/bulan di bagian atas memilih terang atau gelap. Pilihan disimpan dalam workspace, termasuk ketika diekspor. Tidak mengubah nominal atau asumsi.

### Nama owner

Pengaturan & data → Edit nama owner. Perubahan memperbarui profil, sapaan, serta label owner yang cocok pada rekening, tugas, dan kartu. Nama pemilik rekening juga dapat diedit secara individual. Ini label koordinasi lokal, bukan perubahan kepemilikan hukum atau izin akses.

### Monte Carlo

Menu Monte Carlo menyediakan:

- Modal awal, setoran bulanan, dan horizon 1–40 tahun.
- Asumsi imbal hasil, volatilitas, serta inflasi tahunan.
- Target dalam daya beli hari ini.
- 1.000, 2.000, atau 5.000 jalur, dengan seed acak yang dapat diubah.
- Grafik rentang P10–P90, median, peluang mencapai target, dan peluang nilai akhir nominal di bawah total setoran.

Model menggunakan return lognormal bulanan (GBM), return independen, volatilitas tetap, dan setoran nominal pada akhir bulan. Drift bulanan = (ln(1 + asumsi return tahunan) − volatilitas²/2) / 12; volatilitas bulanan = volatilitas tahunan / sqrt(12). Grafik dan peluang target menggunakan hasil yang disesuaikan inflasi. Peluang di bawah total setoran memakai hasil nominal.

Setoran tidak meningkat otomatis bersama inflasi. Pajak, biaya, korelasi antar-aset, risiko kredit, future FX, dan kejadian ekstrem di luar model tidak dihitung. P10–P90 bukan interval kepastian. Asumsi contoh bukan prediksi atau rekomendasi. Simulasi tidak mengubah catatan aktual dan bukan jaminan hasil.

### Dashboard kartu kredit

- Nama kartu, label owner, dan empat digit terakhir saja.
- Limit, utang tercatat, sisa limit, utilization, APR, dan minimum pembayaran.
- Nominal tagihan, pembayaran tercatat, jatuh tempo, serta tanggal review/pengajuan kenaikan limit.
- Pengingat 0–30 hari sebelum tanggal, termasuk status terlambat.
- Hubungkan ke utang yang sudah ada agar liabilitas tidak dihitung dua kali.
- Catat pembayaran aktual: saldo rekening dan utang dikurangi bersama. Aplikasi tidak memindahkan dana.
- Ekspor kalender `.ics` dengan alarm untuk jatuh tempo dan jadwal limit.
- Notifikasi perangkat dengan izin pengguna, jika browser mendukung.

Tanggal pengajuan limit diisi pengguna dan tidak menjamin eligibility atau persetujuan bank. Pengingat perangkat hanya diperiksa ketika aplikasi terbuka; untuk pengingat saat aplikasi tertutup, impor file `.ics` ke kalender dan periksa pengaturannya. Kalender tidak tersinkron otomatis: ekspor ulang saat tanggal berubah.

Tagihan dan tanggal jatuh tempo harus diperbarui setiap siklus; saat memasukkan tagihan baru, reset nominal pembayaran ke 0. Menghapus metadata kartu mempertahankan catatan utang. Utang yang masih terhubung ke kartu tidak dapat dihapus langsung. Nomor kartu lengkap, CVV, dan PIN tidak memiliki tempat penyimpanan.

## Fitur dasar

- Dashboard kekayaan bersih, likuiditas, surplus, dan alokasi tujuan.
- Rekening manual, jurnal transaksi, pencarian, filter, dan ekspor CSV yang menangani formula spreadsheet.
- Proyeksi arus kas enam bulan dari rencana berulang.
- Alokasi tujuan tanpa memindahkan uang atau menciptakan aset baru.
- Proyeksi utang bunga tetap dan perbandingan pembayaran ekstra.
- Skenario pendapatan, biaya bulanan, dan pembelian satu kali.
- Tugas rumah tangga serta kopilot deterministik berbasis catatan.
- Ekspor/impor JSON dengan validasi dan konfirmasi penggantian.
- Migrasi data versi sebelumnya, tanpa mengubah nominal asli.

Saldo rekening merupakan snapshot manual. Transaksi demo awal sudah tercermin dalam saldo contoh. Pembayaran kartu mengurangi principal tercatat; bunga dan biaya baru harus masuk ke saldo utang/tagihan yang diperbarui. Belum ada double-entry ledger lengkap, pencocokan statement bank, transaksi pending/posted, atau pengenaan bunga aktual otomatis.

Rencana arus kas terpisah dari transaksi historis. Minimum pembayaran utang sudah termasuk dalam proyeksi; jangan memasukkannya lagi sebagai pengeluaran rutin. Proyeksi agregat bulanan bukan jaminan saldo pada tanggal tertentu. Slider utang memodelkan utang secara terpisah dan belum menetapkan komitmen gabungan.

## Penyimpanan dan privasi

Data disimpan dalam localStorage pada profil dan origin browser yang digunakan. Pilihan bahasa, tema, nama owner, kurs, kartu, dan catatan ikut dalam ekspor JSON. Simulasi serta percakapan kopilot bersifat sementara.

Data tidak tersinkron antarperangkat, tidak memiliki enkripsi tingkat aplikasi, dan tidak dilindungi login. Anggota rumah tangga memiliki ID stabil untuk atribusi kepemilikan lokal; belum merupakan akun login atau izin akses. Gunakan data contoh untuk evaluasi. Ekspor sebelum membersihkan browser atau berpindah file/origin. Browser dapat membatasi penyimpanan atau notifikasi pada file lokal.

Muse merupakan layanan AI generatif opsional setelah konfigurasi dan persetujuan berbagi data. Tidak ada koneksi bank, pengiriman email, tax filing, trading, atau aksi keuangan otonom.

## Pengembangan dan pengujian

Node.js 18+ untuk tes; Python 3 untuk build/server.

```sh
npm test
python3 build.py
python3 -m unittest discover -s tests -p '*_test.py' -v
```

- `engine.js`: konversi, posisi keuangan, arus kas, utang, Monte Carlo, pengingat, dan pembayaran kartu.
- `i18n.js`: katalog Bahasa Indonesia/English dan lokalisasi tampilan.
- `finance.js`: Shared Views, split, Reports, snapshot historis, Forecast, life events, skenario, dan Monte Carlo terpadu.
- `tests/finance.test.js`: invariant kepemilikan, rekonsiliasi laporan, dan simulasi keuangan terpadu.
- `recording.js`: parser nominal, draft struk/statement/suara, deteksi duplikasi, dan validasi kurs API.
- `serve.py`: API loopback, OCR lokal, Muse, Telegram, inbox SQLite, dan manifest pembaruan.
- `releases.json` / `releases.js`: metadata versi dan changelog.
- `app.js`: workflow dan penyimpanan lokal.
- `styles.css`: tampilan responsif dan tema.
- `tests/engine.test.js`: pengujian invariant dan metode numerik.
- `tests/render.test.js`: smoke test logika render dan handler menggunakan adapter DOM minimal.
- `tests/browser.cjs`: suite Playwright untuk browser nyata; memerlukan Playwright dan Chromium.

Build menggabungkan antarmuka menjadi `inveys-app.html`. Layanan eksternal tidak disertakan dalam HTML portabel. Versi tersebut tetap mendukung pencatatan berbasis teks, review draft, dan suara browser bila tersedia.

Lihat `VERIFICATION.md` untuk hasil aktual dan batas pengujian. Ini MVP lokal yang bisa dievaluasi, bukan layanan keuangan produksi multi-pengguna.

## Dashboard Quick Capture — v0.4.1

Dashboard menyediakan satu composer untuk mencatat atau bertanya kepada chatbot perhitungan lokal. Pilih akun secara eksplisit, lalu masukkan satu nominal per pesan, misalnya `Gajian 10 juta masuk BCA` (akun IDR) atau `Beli kopi 25 ribu`. Nominal ribu/juta menggunakan IDR. Nama akun dalam teks tidak mengubah pilihan akun; nama lengkap akun yang dipilih diabaikan saat mencari nominal agar suffix nomor rekening tidak terbaca sebagai uang. Pesan dengan beberapa nominal/tanggal/nomor lain perlu disederhanakan atau dicatat manual. Transfer menggunakan formulir transaksi khusus.

Draft tampil langsung pada dashboard dan dapat diedit. Saldo berubah setelah tombol Simpan yang dipilih ditekan; kandidat duplikasi tidak dipilih otomatis dan memerlukan alasan bila akan disimpan. Pertanyaan memakai sumber data lokal dan riwayatnya tersedia pada halaman Financial Copilot. Chatbot ini mendukung topik perhitungan yang sudah disediakan, bukan model generatif bebas.

Scan membuka halaman Capture beserta pemilih file. Pilih Statement bank untuk impor historis tanpa mengubah saldo snapshot secara default. OCR memerlukan server lokal. Bicara menggunakan SpeechRecognition jika tersedia, dengan persetujuan terhadap layanan suara browser; transkripsi audio unggahan memakai integrasi server yang sudah ada. Chat dan draft sementara tidak dipersist ke ekspor workspace. Tidak ada eksekusi finansial otonom.

Dashboard composer mendukung tema terang/gelap dan bahasa Indonesia/English. Pengujian DOM tidak menggantikan pemeriksaan visual pada browser; tampilan belum diuji menggunakan browser nyata pada lingkungan ini.

## Investment — v0.5.0

Menu Investment menampilkan saldo akun bertipe Investment dan alokasi per akun untuk seluruh keluarga. Dataset kinerja impor merupakan dataset portofolio agregat yang terpisah; filter Shared Views tidak diterapkan pada dataset ini. Nilai akun investasi tetap berasal dari saldo tersimpan dan sudah masuk net worth. Impor harga atau valuasi historis tidak mengubah akun, utang, jurnal, Forecast, atau net worth. Detail posisi individual, harga otomatis, koneksi broker, serta filter kinerja per anggota belum tersedia.

Benchmark yang tersedia:

| Seri CSV | Tampilan | Definisi / sumber acuan |
|---|---|---|
| portfolio | Portofolio | Valuasi portofolio lengkap, termasuk kas investasi dan arus eksternal |
| sp500 | S&P 500 | [S&P Dow Jones Indices](https://www.spglobal.com/spdji/en/indices/equity/sp-500/) |
| us-stock | US Stock | VTI ETF sebagai proksi pasar saham AS luas; [Vanguard](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) |
| us-bond | US Bond | BND ETF sebagai proksi obligasi investment-grade AS; [Vanguard](https://investor.vanguard.com/investment-products/etfs/profile/bnd) |
| btc | Bitcoin | Harga spot BTC, sumber bursa/fixing harus dinyatakan |
| ihsg | IHSG | IDX Composite; [Bursa Efek Indonesia](https://www.idx.co.id/en/products/index/) |

Sumber acuan mendefinisikan benchmark; tautan tersebut tidak berarti feed harga otomatis terhubung. VTI/BND adalah proksi ETF, bukan seluruh kelas aset. Harga ETF dapat berbeda dari NAV/indeks karena biaya dan premium/discount. Penyedia data historis dan hak penggunaannya harus dipilih saat integrasi feed berikutnya.

### Cara menggunakan

1. Pilih Investment → Template CSV.
2. Isi riwayat valuasi portofolio dan seri benchmark dengan header persis: `series,date,value,flow,currency,fxToIDR,usdToIDR,basis,source`.
3. Gunakan angka dengan desimal titik, tanpa pemisah ribuan. Value dan flow memakai satuan uang asli, bukan sen. Date memakai YYYY-MM-DD. Currency IDR/USD.
4. `flow` positif adalah setoran modal, negatif penarikan; benchmark harus 0. Baris pertama setiap seri harus 0. Jangan masukkan dividen/kupon sebagai setoran modal.
5. `fxToIDR` adalah nilai 1 unit mata uang seri dalam IDR pada tanggal observasi. Untuk IDR nilainya 1; untuk USD nilainya sama dengan `usdToIDR`. `usdToIDR` adalah nilai 1 USD dalam IDR pada tanggal tersebut, konsisten untuk seluruh seri. Kurs saat ini tidak menggantikan kurs historis.
6. `basis` price/total harus konsisten dalam seri dan cocok dengan portofolio. Total-return benchmark harus benar-benar memasukkan reinvestasi distribusi. Dividen/kupon portofolio harus tercakup dalam valuasi dan kebijakan reinvestasi yang didokumentasikan. Source wajib dan konsisten; seri tidak boleh mencampur penyedia/metode.
7. Pilih Impor / edit riwayat. Penyimpanan mengganti seluruh dataset kinerja secara atomik; ekspor workspace JSON terlebih dahulu jika perlu mempertahankan riwayat lama. Maksimal 30.000 observasi, CSV 5 MB.
8. Pilih periode, mata uang dan benchmark. Data kurang, tidak cocok basis, atau tidak memiliki minimal dua tanggal bersama ditampilkan sebagai tidak tersedia.

### Metode dan batas perhitungan

Arus eksternal diasumsikan terjadi pada akhir interval observasi. Return interval = `(nilai akhir - arus eksternal akhir) / nilai sebelumnya - 1`; TWR adalah rantai faktor return. Pendekatan ini tepat untuk asumsi waktu tersebut; setoran tengah periode memerlukan observasi tambahan di tanggal arus untuk pengukuran lebih presisi. Setoran yang tidak tercatat dapat menghasilkan return yang salah. Nilai portofolio harus positif, termasuk sebelum arus akhir; portofolio dengan saldo nol/negatif atau kerugian total memerlukan model lanjutan.

Untuk mata uang IDR/USD, value dan flow dikonversi memakai kurs setiap tanggal observasi sebelum return dihitung. Semua seri memakai tanggal observasi bersama, baseline 0%, tanpa interpolasi harga. Seri yang tidak diimpor atau memiliki basis berbeda dikeluarkan dengan alasan. Menambah benchmark dengan kalender jarang dapat mengurangi titik bersama semua kurva. Kurva tetap menggunakan rantai return penuh sebelum dibatasi pada periode yang dipilih; arus pada titik yang tidak ditampilkan tidak dibuang.

Selisih portofolio = return portofolio dikurangi return benchmark, ditampilkan dalam percentage points. Drawdown adalah penurunan dari puncak pada tanggal bersama yang ditampilkan; data bulanan tidak menggambarkan risiko intrabulan. Grafik dapat merangkum titik untuk rendering, sedangkan tabel dan ekspor menghitung dari seluruh titik yang cocok. Return tidak dianualisasi. Tidak ada return Today, Sharpe, beta atau alpha yang dihitung tanpa data/asumsi tambahan.

Aplikasi tidak menyediakan data pasar otomatis atau angka return contoh pada halaman Investment. Template kosong dan histori harus diimpor. Riwayat menggunakan localStorage dan ikut ekspor/restore JSON workspace. HTML portabel mendukung seluruh perhitungan ini tanpa layanan backend.

## UI/UX & Reports — v0.6.0

Desktop memakai sidebar ikon 76 px. Hover mengembang menjadi 252 px sebagai overlay; isi halaman tidak bergeser. Fokus keyboard yang terlihat juga membuka label. Ikon tetap mempunyai accessible name dan tooltip. Tombol pin mempertahankan sidebar terbuka dan secara eksplisit menyediakan ruang 252 px untuk konten; preferensi pin disimpan terpisah dari catatan keuangan. Navigasi vertikal dapat di-scroll agar seluruh menu tetap terjangkau. Animasi menghormati reduced-motion.

Ponsel (lebar hingga 700 px) memakai tombol menu, sidebar drawer dan backdrop. Sidebar yang tertutup bersifat inert sehingga kontrolnya tidak terjangkau keyboard. Pilihan menu, tombol tutup, backdrop dan Escape menutup drawer. Pada perangkat sentuh berlayar lebih besar, tombol menu juga tersedia.

Reports memakai tab Cash flow/Spending/Income serta laporan posisi yang sudah ada. Kontrol Date dan Filters membuka panel ringkas; tersedia preset 30 hari, tahun ini dan semua tanggal. Form date/account/category/search tetap divalidasi. Grouping serta jenis grafik dapat dipilih langsung di panel grafik. Saat memilih Bar, grouping awal beralih ke bulan, kemudian dapat diganti ke kategori, merchant, akun atau pemilik. Tab selain Cash flow menggunakan Bar/Treemap; Sankey khusus arus kas.

Ringkasan mencakup pendapatan, pengeluaran, arus kas bersih dan rasio surplus. Rasio = (pendapatan - pengeluaran) / pendapatan; saat pendapatan nol, tampil —. Rasio dapat negatif dan tidak dipaksakan ke nol. Ini ukuran surplus jurnal, bukan verifikasi saldo tabungan atau kontribusi investasi.

Sankey menggunakan model `cashFlowGraph` yang memeriksa rekonsiliasi kelompok terhadap total laporan. Sumber pendapatan mengalir ke total dana, kemudian ke pengeluaran dan surplus. Jika pengeluaran melebihi pendapatan, kebutuhan pendanaan muncul sebagai selisih analitis; nilainya bukan pemasukan baru dan tidak menambah transaksi. Lebar aliran proporsional. Maksimal enam kelompok terbesar per sisi, sisanya diringkas sebagai Lainnya; tabel dan drill-down tetap memuat seluruh kelompok.

Bar menampilkan pendapatan dan pengeluaran sebagai dua batang berdampingan, bukan penjumlahan dua jenis transaksi. Bulan diurutkan kronologis; grouping lainnya mengikuti kelompok laporan. Tooltip serta tabel menyediakan angka lengkap. Grafik besar dapat di-scroll horizontal. Data kosong ditampilkan tanpa aliran/return rekaan.

Ekspor SVG mengikuti Sankey/Bar yang dipilih; ekspor Treemap meminta pengguna memilih salah satu grafik SVG tersebut. CSV laporan, saved reports, source journal dan filter Shared Views tetap tersedia. Semua diagram dihitung dari jurnal lokal menggunakan engine INVEYS; tampilan referensi digunakan sebagai inspirasi susunan kontrol.

### Validasi UI

115 tes JavaScript dan 11 backend lulus. Termasuk konservasi aliran Sankey, surplus/defisit, agregasi kategori, pilihan chart/group, ekspor yang sesuai, empty state, accessible label navigasi, pin tanpa perubahan ledger, serta drawer/Escape/inertness. Pengujian adapter DOM tidak memverifikasi rendering CSS; browser nyata tidak tersedia di lingkungan ini. Hover, resize, tema, overlap label dan responsivitas tetap perlu QA browser sebelum rilis produksi.

## Appearance, submenus & Forecast — v0.7.0

Dark mode bawaan memakai Charcoal (latar #171817, panel #222420, teks #f0f2ed, teks pendukung #b0b7ae, aksen #edaa57). Light mode mempertahankan Forest. Kedua mode memakai token tampilan yang sama agar tata letak, tombol, panel, dan hierarki tetap konsisten.

### Mengubah palet

Buka Settings & data → Color palette / Palet warna. Pilih Forest, Charcoal, Ocean atau Violet. Untuk warna kustom, ubah enam color picker dan tekan Simpan warna kustom. Tema aktif menentukan palet yang diedit; light dan dark tersimpan terpisah. Mengganti tema/palet tidak mengubah catatan keuangan. Palet termasuk dalam ekspor/restore JSON workspace.

Validasi membatasi nilai ke #RRGGBB serta memeriksa kontras teks utama, teks pendukung, dan aksen minimal 4,5:1 terhadap latar halaman dan panel. Warna teks tombol dipilih otomatis untuk aksen. Batas ini mempertahankan keterbacaan; pasangan warna yang gagal ditolak tanpa menimpa palet tersimpan. Validasi kontras ini bukan audit aksesibilitas lengkap. Warna semantik seperti income/expense dan jenis kejadian tetap dibedakan dari aksen pengguna.

### Menu lebih ringkas

| Kelompok | Submenu |
|---|---|
| Keuangan | Accounts, Transactions, Capture, Cash flow, Credit cards, Debt management |
| Perencanaan | Forecast, Goals & plans, Scenarios, Monte Carlo |
| Analisis | Reports, Investment, Shared Views |
| Kelola | Household, Integrations, Version updates |

Overview dan Financial Copilot tetap langsung tersedia. Settings & data berada di bagian bawah sidebar. Kelompok halaman aktif terbuka otomatis; kelompok lain bisa dibuka melalui judulnya. Hover/fokus/pin yang sudah ada tetap berlaku, dan sidebar ikon menyembunyikan submenu saat mengecil. Tidak ada halaman atau data yang dihapus karena pengelompokan ini.

### Grafik Forecast

Grafik utama memakai titik proyeksi bulanan dari engine INVEYS, termasuk respons terhadap kejadian hidup dan pembayaran utang. Net worth/aset mengawali kurva dari posisi sekarang. Arus kas bulanan memakai income minus expense minus pembayaran utang dari bulan proyeksi berikutnya; tidak memakai angka nol sebagai data cash flow aktual saat ini.

Pilihan tampilan: net worth, aset, atau arus kas bulanan. Daya beli hari ini membagi nilai bulan terkait dengan faktor inflasi rencana; baseline pembanding memakai inflasi rencana dasar. Skenario tampil sebagai garis utuh dan baseline sebagai garis putus-putus dengan horizon yang sama. Sumbu tahun/usia dan nilai mendukung posisi negatif tanpa menyembunyikan shortfall.

Penanda kejadian memakai tanggal relatif terhadap horizon dan membuka editor kejadian ketika diklik atau diaktifkan dengan Enter/Space. Timeline di bawah grafik tetap menampilkan daftar kejadian lengkap. Label kejadian yang padat bisa bertumpuk; gunakan timeline untuk memilih kejadian tersebut. Slider tahun atau titik tahun di grafik menampilkan tanggal/usia, net worth, aset/utang dan arus kas bulan terkait. Pemilihan titik tidak mengubah rencana.

Asumsi, akun yang disertakan, inflasi, pertumbuhan per akun, retirement, home financing, recurring events, skenario tersimpan, shortfall, Monte Carlo terpadu, tabel dan ekspor tetap memakai model yang sudah ada. Tidak ada akun broker/sumber pasar baru yang dihubungkan. Pajak, future FX dan rincian pensiun spesifik negara belum ditambahkan.

### Referensi dan batas kesetaraan

Susunan grafik, event timeline, asumsi dan perbandingan skenario mengacu pada screenshot pengguna dan [dokumentasi resmi Forecasting Monarch](https://help.monarch.com/hc/en-us/articles/48344305092244-Forecasting-in-Monarch). Halaman app.monarch.com/forecast tidak mengekspos UI dinamis melalui pengambilan web. Engine INVEYS tetap merupakan implementasi sendiri; versi ini tidak mengklaim kesetaraan semua fitur atau hasil perhitungan Monarch. Forecast INVEYS mulai dari saldo hari ini dengan periode pertama bulan penuh berikutnya; metode tahun kalender dan perpajakan berbeda.

122 tes JavaScript + 11 backend lulus (133 total). Pengujian mencakup preset/kontras/custom palette, persistensi dan isolasi light/dark, submenu, pilihan ukuran grafik dan slider tanpa mutasi catatan. Verifikasi visual browser, rendering warna lintas perangkat, label kejadian padat dan sentuhan tetap perlu QA; lingkungan ini tidak menyediakan browser binary.

## Membership & Forecast workflow — v0.8.0

Plans & membership tersedia pada submenu Kelola/Manage. Tiga paket tampil dengan harga draft yang bisa diubah menggunakan Atur harga draft.

| Paket | Draft bulanan | Draft tahunan | Skenario baru tersimpan | Kejadian per rencana |
|---|---:|---:|---:|---:|
| Plus | Rp49.000 | Rp490.000 | 1 | 3 |
| Pro | Rp129.000 | Rp1.290.000 | 5 | 20 |
| Ultra | Rp299.000 | Rp2.990.000 | 20 | 100 |

Harga merupakan asumsi produk yang dapat diedit, bukan harga yang sudah dipublikasikan atau ditagihkan. Pajak, diskon/trial, pembatalan dan refund belum ditetapkan. Harga disimpan sebagai rupiah utuh, tidak dipengaruhi FX pelaporan.

Plus memuat core records/reports dan Forecast; Pro menambah benchmark investasi, Monte Carlo, dan skenario lebih banyak; Ultra menambah akses UI Telegram/AI eksternal. Akses eksternal tetap memerlukan konfigurasi layanan dan persetujuan sesuai alur sebelumnya. Tidak ada klaim kredit AI tanpa batas, sinkronisasi cloud, akun keluarga terpisah, atau koneksi broker yang aktif.

Workspace lama dimigrasi ke Ultra **preview** supaya fitur sebelumnya tidak tiba-tiba hilang. Mengganti preview tidak membuat langganan atau transaksi pembayaran. Data/skenario lama tetap dapat dibaca. Batas diterapkan pada pembuatan skenario, kejadian baru, impor benchmark, Monte Carlo, dan tindakan integrasi dalam UI; ini bukan batas keamanan API. Pengguna tetap dapat memodifikasi localStorage dan JavaScript. Implementasi monetisasi produksi dijelaskan dalam MONETIZATION.md dan membutuhkan login, billing provider, database serta entitlements server.

### Forecast dari video referensi

Kedua rekaman ditinjau pada beberapa timestamp. Pola yang diterapkan: setup bertahap, konfirmasi data, pemilihan akun, pensiun, tabel Accounts/Cash Flow/Events dengan tahun sebagai kolom, dan pilihan jenis kejadian. Mesin INVEYS sendiri tetap memakai saldo saat ini, arus rutin/12 bulan historis, simulasi bulanan, per akun, pembiayaan rumah, pensiun berdasarkan pemilik income, shortfall dan Monte Carlo yang sudah ada.

**Setup forecast** mempunyai tiga langkah:

1. Konfirmasi usia sebagai asumsi, horizon 1–40 tahun, dan sumber arus dasar. Ringkasan saldo/rencana rutin berasal dari perspektif pemilik yang sedang aktif.
2. Pilih akun aset dan return tahunan per akun. Utang tetap dimodelkan meski aset terkait dikecualikan.
3. Opsional tambah/perbarui pensiun pemilik income, usia pensiun dan income pengganti bulanan. Nominal/tanggal tidak diasumsikan sebagai data aktual.

Perubahan wizard hanya masuk rencana pada Finish setelah seluruh kandidat divalidasi dan diproyeksikan. Cancel tidak menyimpan perubahan. Mengganti Shared Views membatalkan draft wizard. Pensiun existing dari pemilik yang dipilih diperbarui, bukan diduplikasi. Tidak mencentang pensiun tidak menghapus kejadian lama. Kejadian di luar horizon tidak muncul pada kurva hingga horizon diperpanjang. Wizard tidak menambahkan data income aktual atau mengubah akun/jurnal. Income dasar tetap dari arus rutin/historis; tidak ada step editor income tahunan seperti produk referensi.

Tabel **Accounts** menampilkan saldo akhir akun/aset, utang, net worth dan unfunded obligations; **Cash Flow** memuat jumlah income, biaya, pembayaran utang, bunga yang sudah menjadi bagian pembayaran, transfer investasi dan cadangan tujuan; **Events** menyediakan daftar edit/hapus. Header kolom membuka rincian tahun/bulan yang sudah ada. Angka disesuaikan inflasi jika Today’s purchasing power aktif. Kolom merupakan setiap 12 bulan proyeksi, bukan selalu akhir tahun kalender.

Add event membuka jenis Home, Retirement, New income, Recurring expense (termasuk anak/pendidikan), Career break, atau One-time cost. User mengisi nominal, pemilik dan tanggal sendiri. Child/education memakai recurring expense yang harus diberi tanggal akhir bila diperlukan; tidak ada model demografis atau biaya anak otomatis. Pembiayaan rumah masih memakai parameter down payment/APR/term yang sudah ada. Social Security/penalty pensiun US, estate/will, penarikan spesifik pajak, dan rekonsiliasi kontribusi per akun belum dimodelkan. Ini referensi alur, bukan kesetaraan hasil engine Monarch.

Font kini memakai skala konsisten, angka tabular, rentang heading/metric yang responsif, label input yang terbaca, dan matriks yang dapat di-scroll dengan label baris sticky. Dark/light/custom palette tetap tersedia.

142 checks pass: 131 JavaScript + 11 backend. Browser visual/mobile pointer QA belum tersedia di lingkungan ini.

## Reports tabs fix — v0.8.1

Tab Cash flow hingga Credit cards kini satu baris horizontal. Pada layar sempit, baris digulir ke samping dan tidak berubah menjadi daftar vertikal. Hover/fokus memberi highlight serta underline; tab aktif mempertahankan underline. Warna mengikuti light/dark/custom palette dan animasi mengikuti reduced-motion. Perbaikan juga berlaku pada tab rincian Forecast. Penyebab sebelumnya adalah `nav { flex-direction: column }` umum yang diwarisi oleh tab halaman. Override kini khusus `nav.report-tabs`; sidebar tetap vertikal. Tidak ada perubahan perhitungan atau catatan keuangan.


## Investment v0.9.0

Menu dirombak berdasarkan gambar dan video yang diberikan: **Holdings → Market / Allocation**, **Advanced → Allocation / Gains & Losses / Funds**. Tab tetap horizontal dan responsif dengan efek hover/focus.

1. Buat akun bertipe Investment di Accounts. Pada Investment pilih **Tambah aset**; isi simbol/nama, jenis, jumlah unit, mata uang, harga terakhir, tanggal dan sumber. Pencarian penyedia sekuritas/harga live belum aktif; input manual tersedia.
2. Isi **total cost basis sisa unit** dalam mata uang sekuritas (bukan harga per unit). Untuk mata uang asing masukkan kurs biaya historis rata-rata tertimbang ke IDR. Biarkan biaya kosong jika belum diketahui; gain/loss tidak dibuat menjadi nol. Nol cost basis menghasilkan gain nominal tetapi persentasenya tidak terdefinisi.
3. Impor **Harga historis aset** memakai template CSV; ID holdings ditampilkan di dialog. Kurs per tanggal wajib dan konsisten. Perubahan harga saat ini tidak otomatis membuat riwayat masa lalu. Backtest memakai kuantitas saat ini tetap, tanpa riwayat pembelian/penjualan, dividends, fees atau taxes. Harga harus split-adjusted dengan satu basis price yang konsisten. Jangan mencampur adjusted close yang memasukkan dividends.
4. Impor benchmark S&P 500, US Stock (VTI proxy), US Bond (BND proxy), Bitcoin dan IHSG melalui riwayat portofolio/benchmark. Backtest memerlukan benchmark basis `price`; model TWR memakai basis `price` atau `total` yang cocok dengan portofolio. Semua kurva menggunakan tanggal bersama yang tepat; tidak ada interpolasi. Benchmark tidak tersedia tidak menjadi return nol.
5. Model **Riwayat portofolio (TWR)** mempertahankan dataset lama dan hanya tersedia untuk seluruh keluarga tanpa filter akun. Dataset itu belum memiliki atribusi per akun/pemilik. Model otomatis memakai backtest jika ada holdings, atau TWR jika tidak ada holdings. Pilih model secara eksplisit untuk mencegah perubahan interpretasi saat mulai mengisi holdings.
6. Advanced menyediakan alokasi kelas aset/akun/sekuritas, unrealized gain/loss, serta analisis ETF/reksa dana saja. Metadata kategori/global category/aggregated category/prospectus objective/index strategy/legal structure diisi manual berdasarkan dokumen fund. Analisis ini mengelompokkan posisi fund, bukan mengurai underlying securities di dalam fund.
7. Simpan snapshot pada tanggal-tanggal berbeda untuk grafik gain/loss historis. Snapshot mempertahankan nilai, biaya, kepemilikan dan USD/IDR saat capture; tanggal yang sama diganti. Snapshot valuasi memakai harga terakhir yang tersimpan (tanggal harga tetap terlihat), bukan jaminan harga live hari snapshot.
8. Ekspor CSV mengikuti filter holdings atau hasil kinerja; gains history CSV mengikuti snapshot pada periode terpilih. Ekspor SVG tersedia untuk line/pie; mode breakdown/bar menyediakan CSV.

**Rekonsiliasi:** holdings adalah detail analisis akun, bukan aset tambahan. Selisih antara snapshot saldo akun dan detail holdings ditampilkan; tidak disesuaikan otomatis. Transaksi jurnal tidak mengubah jumlah sekuritas. Pembelian/penjualan broker, realized gains, tax lots/FIFO, tax filings dan live providers memerlukan pengembangan lanjutan.

Rumus dan asumsi lengkap: `INVESTMENT_ENGINE.md`. Paket tetap merupakan MVP lokal; fitur bukan koneksi privat ke engine Monarch.


## Chat mengambang v0.9.1

Dashboard kini memakai chat mengambang di bawah layar. Tombol **+** membuka menu unggah struk/statement, audio (melalui Capture), input/stop suara dan pilihan akun. Tombol **−** meminimalkan widget; **Tanya INVEYS** membukanya kembali tanpa menghapus teks, akun atau draft. Enter mengirim, Shift+Enter membuat baris baru. Pertanyaan memakai chatbot lokal yang sudah ada; transaksi menjadi draft untuk review, tidak langsung tersimpan. Pengunggahan memakai alur Capture dan konfigurasi/consent layanan yang sama seperti sebelumnya. Shortcut buka chatbot lengkap tersedia di header widget. Popover bisa ditutup dengan klik luar atau Escape.


## Chat global dan lampiran v0.9.2

Chat tersedia di seluruh menu dan submenu. Header judul/tombol minus/panah telah dihapus. Pilihan **Minimize chat** dan **Buka chatbot lengkap** berada dalam menu **+**. Pilih **Ambil foto dari kamera** untuk input kamera native pada browser/perangkat yang mendukung; desktop dapat menampilkan file picker sebagai fallback. **Unggah struk / statement** memilih gambar atau PDF dari direktori tanpa pindah halaman.

Lampiran PNG/JPEG/WebP/PDF maksimal 8 MB disiapkan dalam memori. Setelah memilih akun dan jenis dokumen melalui +, tekan **Ekstrak & tinjau**; layanan lokal melakukan OCR gambar atau ekstraksi PDF berbasis teks dan membuka Capture untuk review. Statement historis default tidak mengubah snapshot saldo. File asli tidak dimasukkan ke localStorage atau ekspor workspace dan hilang saat reload; teks/draft tetap harus direview dan disimpan eksplisit. Kamera perangkat, pemilih file native dan UI visual belum diuji langsung dalam lingkungan ini.


## Asisten multimodal v0.10.0

Chat global kini mempunyai mode Tanya AI / Catat, dropdown penyedia, thread percakapan, tombol minimize langsung, dan rekaman mikrofon. Menu + menyediakan kamera, unggah gambar/PDF/TXT/CSV/audio, pengaturan AI dan percakapan baru. Caption di bawah input dihapus sesuai markup. Panduan konfigurasi dan batas penyedia ada di [AI_SETUP.md](AI_SETUP.md).

Riwayat percakapan tersimpan di workspace browser, dibatasi 60 pesan dan dipisahkan berdasarkan perspektif pemilik/shared. File asli hanya disiapkan di memori. Memori preferensi diisi, diedit atau dihapus pengguna; fitur ini tidak melatih ulang model. Pengiriman membutuhkan izin eksplisit, ringkasan finansial dan memori default tidak disertakan.


## v0.11.0 — Edit transaksi dan chat terpadu

Transactions → **Edit transaction** mengubah deskripsi, nominal penuh, tanggal, jenis, akun dan kategori. Koreksi berdampak saldo membalik dampak lama lalu menerapkan dampak baru sekali pada salinan tervalidasi; jurnal historis (`balanceApplied:false`) tetap tidak mengubah saldo. Metadata transfer mempertahankan kurs/received amount; transfer yang berubah nominal/akun/jenis memakai kurs tersimpan saat koreksi. Transfer lintas mata uang tanpa received amount lama tidak dapat dibalik secara aman dan ditolak. Hapus split melalui Owner / Split sebelum mengubah nominal, jenis atau akun, lalu terapkan kembali split. Koreksi tidak merekonstruksi snapshot historis atau menyimpan riwayat audit koreksi terpisah.

Chat mengecil saat klik di luar dan dibuka kembali melalui Ask INVEYS. Teks, lampiran, riwayat dan draft tetap dipertahankan. Tombol minimize, dropdown penyedia, tab Tanya/Catat dan pengaturan AI pada + telah dihapus. Pengaturan AI/memori ada di **Integrations → INVEYS AI · 9Router**. Dialog aktif dan pemilih file tidak diperlakukan sebagai klik luar chat yang menutup konteks kerja.

Satu input menggunakan klasifikasi intent AI pada penyedia eksternal: pertanyaan dijawab, perintah pencatatan menghasilkan draft yang divalidasi dan harus disimpan eksplisit. Local memakai parser deterministik yang sudah ada. Teks biasa dari model yang tidak mengikuti JSON ditampilkan sebagai jawaban, tanpa pencatatan otomatis. Tidak ada eksekusi jurnal oleh model atau fallback tersembunyi. Instruksi transfer diarahkan ke Add transaction. Lihat [AI_SETUP.md](AI_SETUP.md) untuk 9Router.


## v0.12.0 — Aksi jurnal dan ikon navigasi

Jurnal transaksi mempunyai kolom **Actions / Aksi**. Klik pensil untuk edit langsung di baris; ubah deskripsi, kategori, tanggal, akun, jenis, nominal penuh dan tujuan transfer bila berlaku. Ikon disket menyimpan koreksi; ikon X membatalkan draft edit. Ikon tempat sampah membuka konfirmasi hapus dengan nominal penuh. Popup sukses dengan centang tampil setelah koreksi tersimpan ke localStorage. Kegagalan validasi/penyimpanan mempertahankan catatan asli dan draft edit.

Penghapusan membalik dampak saldo income/expense atau kedua sisi transfer menggunakan received amount historis; jurnal historis tidak mengubah saldo. Transfer lintas mata uang tanpa captured received amount ditolak. Hapus tidak mengubah rekening bank, snapshot historis atau rencana rutin. Penghapusan tidak menyimpan audit/tombstone terpisah. Split ditampilkan per perspektif tetapi edit/hapus menggunakan transaksi penuh. Pencarian dan filter jenis tetap dipertahankan saat render.

Seluruh tujuan sidebar dan empat grup mempunyai ikon SVG berbeda, termasuk Cards, Capture, Monte Carlo, Integrations, Membership, Updates, About dan Settings. Report tabs, Investment Holdings/Advanced dan subtab analisis, serta tab rincian Forecast mempunyai ikon khusus. Label teks, title dan aria-label tetap tersedia; ikon tidak menjadi satu-satunya petunjuk.


## v0.13.0 — Gambar kartu dan pengeluaran merah

Cards → **Upload artwork / Unggah gambar** menerima PNG/JPEG/WebP maksimal 8 MB. Browser mendekode lalu mengecilkan sisi terpanjang menjadi maksimum 960 piksel dan mengubahnya ke JPEG, membuang metadata sumber. Gambar tersimpan hanya setelah validasi dan penyimpanan sukses; kegagalan mempertahankan gambar lama. Replace artwork / Remove artwork tersedia per kartu. Preview mempertahankan seluruh desain; nama/last4 tetap menjadi label terpisah. Gunakan desain tanpa nomor kartu lengkap, CVV atau PIN; aplikasi tidak otomatis menyensor bagian tersebut.

Gambar desain dibatasi 350.000 karakter data URL per kartu, 1.500.000 karakter total, dan dimensi sumber maksimum 20 megapiksel. Artwork tersimpan dalam workspace/localStorage dan ikut backup JSON, berbeda dari lampiran chat sementara. Artwork tidak dikirim ke penyedia AI. Upload/reset mempunyai generation guard agar upload terlambat tidak menulis workspace pengganti. Saldo, utang, tagihan dan last4 tidak berubah ketika gambar diganti/dihapus.

Nominal expense pada jurnal transaksi dan sumber Reports ditandai merah; income tetap hijau dan transfer netral. Arus rutin expense dan input nominal draft expense mengikuti semantik merah pada light/dark. Warna tidak menggantikan label jenis dan tanda minus.

Integrasi exchange crypto masih belum diimplementasikan. Untuk tahap berikutnya tentukan exchange dan lingkup spot/earn/futures. Connector baca-saja sebaiknya menarik balances/positions/trades, memakai kredensial di server, menyimpan cursor/external ID untuk deduplikasi, menampilkan waktu sinkronisasi/status, menghitung valuasi IDR dengan timestamp kurs, dan merekonsiliasi saldo akun serta holdings agar aset tidak dihitung dua kali. Sinkronisasi terjadwal memerlukan server aktif; aplikasi lokal tertutup tidak bisa menjamin update otomatis. Sumber API contoh: https://developers.binance.com/en/docs/catalog/core-trading-spot-trading/api/rest-api/account .


## v0.14.0 — Operations dan engine keuangan terpadu

Buka **Kelola → Operations** untuk rules, review, rekonsiliasi, deteksi rutin,
ringkasan tujuh hari dan riwayat perubahan. Update ini menggabungkan mekanisme
pengelolaan jurnal yang terinspirasi Monarch dengan IDR, multi-currency,
Shared Views, Forecast/Monte Carlo dan asisten multimodal INVEYS.

- Aturan berjalan berurutan pada transaksi baru dari input manual, Capture,
  dan draft AI yang dikonfirmasi. Merchant, kategori, owner, tag, reviewer,
  visibilitas laporan dan split persentase dapat ditetapkan. Pilih **Preview
  jurnal** untuk meninjau sebelum penerapan retroaktif seluruh workspace.
- Pending tidak mengubah saldo/laporan/baseline historis. **Post** menerapkan
  efek sekali, mengikuti kebijakan saldo akun; **Sudah direview** menutup antrean.
- Ledger menghitung perubahan dari jurnal. Snapshot menjaga saldo statement
  independen. Rekonsiliasi menyimpan selisih dan snapshot posisi, tanpa membuat
  income/expense fiktif. Pergantian ke snapshot menjadikan seluruh jurnal
  terkait historis, termasuk kedua sisi transfer; kembali ke ledger tidak
  memutar ulang riwayat. Transfer baru dengan akun snapshot harus journal-only.
- **Cocokkan struk** pada draft menautkan metadata ke transaksi posted dengan
  akun, mata uang, nominal sama dan tanggal berjarak maksimal tiga hari.
  Pengguna memilih pasangan. Ini tidak menyimpan file asli atau itemization.
- Source key impor yang terhapus tetap dicatat sebagai tombstone agar tidak
  masuk ulang diam-diam. Tanpa source key, indikator duplikasi tetap perlu review.
- Deteksi rutin memerlukan minimal tiga tanggal, interval mingguan/bulanan/
  tahunan konsisten dan nominal dalam toleransi 15%. Kandidat perlu konfirmasi
  sebelum menjadi rencana Forecast. Mingguan/tahunan menjadi ekuivalen bulanan.
- Tombol **Refund** pada expense biasa mengembalikan kas dan mengurangi
  kategori pengeluaran semula, bukan income baru. Akumulasi refund maksimal
  nominal asli. Refund kartu belum didukung; rekonsiliasi statement diperlukan.
- **Belanja kartu** menambah utang tanpa mengurangi kas. Rekening yang dipilih
  hanya referensi jurnal. **Record payment** menjadi transfer ke utang dan
  tidak dihitung kembali sebagai spending. Nominal statement masih dimasukkan
  manual, terpisah dari utang outstanding. Pembayaran memerlukan akun ledger.
  Untuk koreksi nominal/akun kartu, hapus lalu catat ulang; edit metadata tersedia.
  Penghapusan purchase yang sudah dilunasi dapat ditolak agar utang tidak negatif.
- Jurnal pembayaran kartu lama dimigrasikan dari expense ke transfer tanpa
  memutar ulang saldo. Laporan lama bisa berubah karena penghitungan ganda diperbaiki.
- Forecast memiliki pilihan pembagi 12 bulan atau rentang bulan lengkap sejak
  catatan pertama (maksimal 12, termasuk bulan kosong di tengah). Mode lama
  tetap 12 bulan sampai diubah. Income/expense dapat mengikuti inflasi.
- Pada **Asumsi akun**, atur prioritas penarikan, tahun mulai (tahun proyeksi,
  bukan tahun kalender), dan jadwal return seperti `1=6, 10=4`. Pengaturan yang
  sama berlaku di Monte Carlo. Pajak, penalti, FX masa depan dan kalender penuh
  belum dimodelkan.
- Riwayat maksimal 1.000 kejadian lokal, mengikuti transaksi, rules,
  rekonsiliasi dan operasi kartu. Tidak mencakup semua perubahan konfigurasi
  lama dan bukan audit server yang tahan manipulasi.

Status kelengkapan dan tahap produksi ada di **UPDATE_0.14.0.md**.

### Update manual di MacBook M1

1. Pada aplikasi lama, **Settings & data → Export workspace**. Simpan JSON.
2. Ekstrak paket terbaru. Ganti folder kode INVEYS dengan folder dari paket
   baru; pertahankan konfigurasi `.env` dan data server `~/.inveys` milik Anda.
   Jangan membagikan file konfigurasi yang berisi API key.
3. Hentikan server lama dengan Control+C. Buka Terminal di folder `inveys`
   baru, aktifkan environment Python yang Anda gunakan, lalu jalankan
   `python3 -m pip install -r requirements.txt` dan `python3 serve.py`.
4. Buka `http://127.0.0.1:3000`, lalu Command+Shift+R. Pastikan menu
   **Version updates** menunjukkan **0.14.0**. Migrasi berjalan otomatis untuk
   workspace yang masih berada di browser dan origin yang sama.
5. Jika profil browser/origin berbeda atau data tidak muncul, impor JSON
   yang diekspor pada langkah pertama. Tinjau saldo dan laporan kartu.

HTML mandiri dapat dibuka untuk fitur lokal; API server memerlukan langkah
server di atas. Lokasi file HTML baru bisa menghasilkan penyimpanan browser
berbeda, sehingga backup/impor tetap diperlukan. Update belum otomatis
mengunduh atau mengganti kode. Simpan versi lama dan backup jika ingin rollback;
restore backup pra-update, bukan workspace baru yang mungkin memakai fitur baru.


## v0.15.0 — Grafik Holdings

Buka **Investment → Holdings → Market**. Grafik kini menempatkan nilai holdings,
return periode, dan tanggal efektif di bagian atas. S&P 500 aktif sebagai pembanding
awal; klik kartu benchmark untuk menampilkan/menyembunyikan garis lainnya.
Warna setiap benchmark tetap sama meskipun pilihan berubah.

- Shortcut periode: 1D, 1W, 1M, 3M, 6M, YTD, 1Y, All dan Custom.
  1D berarti dua observasi terakhir yang tersedia; tidak berarti harga intraday.
- **Return %** menampilkan return kumulatif dari tanggal awal yang sama.
  **Nilai** menampilkan nilai portofolio historis; benchmark tidak digambar pada
  sumbu uang. Nilai riwayat impor termasuk arus dana, sedangkan return TWR
  menetralkan arus eksternal dengan asumsi akhir periode.
- Arahkan kursor atau sentuh grafik untuk detail tanggal dan seri. Klik untuk
  mengunci tanggal. Panah kiri/kanan, Home/End dan Escape tersedia saat grafik
  mendapat fokus. Tombol Back to latest mengembalikan ringkasan periode penuh.
- Klik simbol aset pada tabel untuk membuka grafik aset itu saja. Pilih
  All holdings untuk kembali ke keseluruhan holdings dalam filter akun/pemilik.
- Benchmark tidak lagi mengurangi rentang tanggal portofolio. Benchmark tanpa
  data tanggal awal dikecualikan dengan alasan; data di tengah tetap kosong dan
  memutus garis. Jika tanggal akhir tidak ada, return periode dan excess
  ditampilkan tidak tersedia, bukan memakai tanggal lain diam-diam.
- Kartu Last change menampilkan perbandingan dua observasi beserta tanggalnya;
  label Today tidak dipakai untuk data yang mungkin sudah lama.
- Nilai holdings saat ini memakai harga tersimpan. Nilai tersebut dapat berbeda
  dari titik terakhir grafik yang memakai histori. Tanggal harga ditampilkan.
- Buka Method, data coverage & sources untuk basis, jumlah tanggal cocok,
  drawdown teramati, sumber, serta alasan seri tidak tersedia.

Engine baru memakai tanggal kalender untuk posisi sumbu dan hit testing.
Penyederhanaan garis panjang mempertahankan titik ekstrem dan batas data kosong.
Model backtest tetap memakai jumlah holdings saat ini; riwayat TWR tetap
menggunakan input portofolio yang diimpor. Tidak ada koneksi broker/harga live
baru, tax-lot engine atau harga fiktif yang dimasukkan ke workspace.

Update manual sama dengan petunjuk sebelumnya: export JSON, ganti kode/server,
jalankan ulang, hard refresh, lalu cek Version updates = 0.15.0. Data lama
memakai skema yang sama dan tidak perlu dihapus.
