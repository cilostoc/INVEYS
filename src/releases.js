window.InveysReleases={
  "version": "0.23.0",
  "date": "2026-10-17",
  "history": [
    {
      "version": "0.23.0",
      "changes": [
        "Mesin Pelacak & Simulasi Cicilan Emas Fisik Pegadaian Mulia (50g): modul investasi terdedikasi untuk melacak kontrak pembiayaan emas batangan 24K Galeri 24 secara komprehensif, mencakup 4 kartu KPI langsung (Nilai Pasar Emas 50g, Sisa Pokok Hutang Pembiayaan, Ekuitas Emas Bersih, dan Titik Impas/BEP Rp 3.338.282/gram).",
        "Jadwal Amortisasi 60 Bulan Lengkap: tabel angsuran detail per bulan (September 2026 s/d Agustus 2031) memuat pokok Rp 1.793.557, sewa modal mu'nah Rp 671.002, total angsuran Rp 2.464.559 (bulan ke-60: Rp 2.464.539), status pembayaran lunas/menunggu, dan ekspor jadwal CSV mandiri.",
        "Simulator Harga Emas Live & Proyeksi CAGR 5 Tahun: simulasi real-time keuntungan/kerugian bersih berdasarkan variasi harga spot emas dengan tombol preset cepat (Akad Awal Rp 2.532.080, BEP Rp 3.338.282, Spot Hari Ini, serta proyeksi pertumbuhan 5 tahun +8% Konservatif, +12% Moderat, dan +15% Bullish).",
        "Sinkronisasi 1-Klik ke Buku Kas & Portofolio: integrasi otomatis kontrak cicilan emas ke dalam akun investasi (Pegadaian Mulia - Emas 50g), posisi holding sekuritas (GALERI24-50G), liabilitas utang pembiayaan, pengeluaran kas rutin bulanan, dan target tabungan pelunasan emas.",
        "Pencatatan Angsuran Bulanan Instan: tombol 'Bayar Angsuran Bulan Ini' yang secara otomatis memajukan progres tenor, mengurangi sisa saldo pokok hutang pembiayaan, menambah ekuitas tabungan emas, dan mencatat transaksi mutasi pengeluaran ke buku besar."
      ],
      "changesEn": [
        "Pegadaian Mulia Physical Gold Installment Tracker & Financial Engine: dedicated investment tab for physical 24K Galeri 24 gold contracts featuring 4 live KPI cards (50g Market Valuation, Remaining Loan Principal, Net Gold Equity, and Break-Even Price at Rp 3,338,282/gram).",
        "Complete 60-Month Amortization Schedule: month-by-month payment schedule (Sept 2026 to Aug 2031) displaying principal of Rp 1,793,557, mu'nah sewa modal fee of Rp 671,002, total installment of Rp 2,464,559 (month 60: Rp 2,464,539), paid/pending badges, and 1-click schedule CSV export.",
        "Real-Time Gold Price Simulator & 5-Year CAGR Projections: dynamic net profit/loss simulation with quick-preset buttons (Initial Contract Rp 2,532,080, BEP Rp 3,338,282, Today's Spot, and 5-Year compound annual growth projections of +8% Conservative, +12% Moderate, and +15% Bullish).",
        "1-Click Portfolio & Ledger Synchronization: seamlessly integrates the gold financing contract into investment accounts, security holdings (GALERI24-50G), debt liabilities, monthly recurring bill flows, and payoff savings goals.",
        "Instant Monthly Payment Logger: 1-click 'Pay This Month Installment' button advancing tenor progress, decrementing outstanding loan principal, accumulating gold savings equity, and posting journal expense transactions."
      ]
    },
    {
      "version": "0.22.0",
      "changes": [
        "Pembaruan VPS Otomatis 1-Klik & Modularisasi 4 Segmen: pengelompokan arsitektur sistem ke dalam 4 segmen terisolasi (Web Client/PWA, Python API Gateway, SQLite Data Vault, Pipeline Update) dan tombol 1-klik pembaruan otomatis dengan snapshot backup, rebuild mandiri, verifikasi integritas SHA-256, dan hot-reload tanpa downtime.",
        "Visualisasi Data Heatmap Finansial Treemap: visualisasi alokasi pengeluaran dan aset berbasis treemap proporsional tanpa scroll vertikal/horizontal, serta pembaruan antarmuka submenu Reports dengan pemilih jenis grafik (Sankey, Donut, Bar, Heatmap) berbasis menu seleksi proporsional.",
        "Grafik Portofolio Investasi Vibrant & Gain/Loss Dinamis: peningkatan kontras visual kurva performa investasi dengan penyesuaian warna indikator teks dinamis saat posisi aset untung (vibrant emerald) maupun rugi (vibrant coral red).",
        "Slide Switch Interaktif (Ghost Mode & Tema Dark/Light): transisi sakelar sensor nominal sensitif dan pengalih tema dari tombol satu-klik biasa menjadi slider horizontal geser mulus beranimasi dengan handle modern dan aksesibilitas ARIA penuh.",
        "Perapihan Jurnal Transaksi Sumber: eliminasi indikator lingkaran status dot dan penghapusan nominal duplikat pada baris transaksi sumber demi menjaga kejelasan dan kerapihan buku besar mutasi.",
        "Penyederhanaan Navigasi Perencanaan (Sidebar Planning): penghilangan sub-tombol nested Scenarios & Monte Carlo pada bilah navigasi samping untuk tampilan sidebar yang konsisten, bersih, dan rapi.",
        "Penyempurnaan Total Diagram Alir Kas Sankey Multi-Tier: diagram alir kas multi-jenjang berdesain bebas-silang (Zero Criss-Crossing), pita aliran poligon Bezier volumetrik dengan gradien warna halus, kartu badge horizontal total arus masuk tanpa teks miring, serta tata letak lapang tanpa tumpukan teks label kategori."
      ],
      "changesEn": [
        "1-Click Automated VPS Update Engine & 4-Segment Architecture: structured system into 4 isolated segments (Web Client/PWA, Python API Gateway, SQLite Data Vault, Pipeline Engine) featuring an automated 1-click update with pre-flight snapshot backup, standalone bundle compilation, SHA-256 integrity verification, and zero-downtime hot-reload.",
        "Financial Heatmap Treemap Visualization: proportional full-view expense & asset treemap without vertical or horizontal scrolling, plus upgraded Reports submenu with sleek dropdown selector for chart formats (Sankey, Donut, Bar, Heatmap).",
        "Vibrant Investment Curves & Dynamic Gain/Loss Coloring: enhanced visual contrast for portfolio performance graphs with dynamic text coloring automatically reflecting profitable (emerald) and drawdown (coral) positions.",
        "Interactive Slide Switches (Ghost Mode & Dark/Light Theme): upgraded sensitive amount privacy toggle and theme switcher into smooth horizontal draggable slider toggles with modern pill handles and full ARIA accessibility.",
        "Clean Transaction Journal Presentation: removed obsolete status dots and eliminated duplicate converted amounts from source transaction listings for a decluttered, high-clarity ledger view.",
        "Streamlined Planning Navigation: removed nested sidebar sub-buttons under Scenarios & Simulation to maintain a cohesive, clean sidebar aesthetic.",
        "Multi-Tier Cash Flow Sankey Overhaul: redesigned flow diagram featuring Zero Ribbon Criss-Crossing, volumetric cubic Bezier polygon bands with soft color gradients, a horizontal total inflow badge, and spacious dynamic height preventing label crowding."
      ]
    },
    {
      "version": "0.21.0",
      "changes": [
        "Konsolidasi Submenu Terpadu (Sub-Module Switcher Bars): penyederhanaan navigasi submenu menjadi hub fungsional terintegrasi dengan bilah tab switch instan di interior halaman (Akun & Saldo, Buku Besar Transaksi, Arus Kas & Anggaran, Perencanaan Finansial, dan Kolaborasi Keluarga).",
        "Penyelarasan Fitur Advance & Paket Membership (Plus, Pro, Ultra): pembagian fitur bertingkat yang transparan—Plus (Smart OCR Capture, Kalender Tagihan, Budget Rollover, Aturan Otomasi Transaksi), Pro (Smart Portfolio Rebalancing, Skenario Simulasi, Monte Carlo), dan Ultra (Konektor CEX CCXT, Multi-Provider AI Tanpa Batas).",
        "Lencana Tier Visual Interaktif (.badge.plus, .badge.pro, .badge.ultra): indikator status paket di setiap bilah navigasi dan kartu fitur yang adaptif terhadap tema terang (Light Mode) maupun gelap (Dark Mode).",
        "Kecerdasan Finansial Personal Terarah (Personal Financial Intelligence Grounding): integrasi context prompt tingkat lanjut yang menghubungkan profil aset pengguna ke model AI pilihan (OpenAI ChatGPT/GPT-4o, Google Gemini, Anthropic Claude via 9Router/OpenRouter, Meta AI Muse Spark) dengan pengamanan Read-Only Ledger mutlak.",
        "Mesin Koreksi Otomatis & Normalisasi Transaksi Cerdas (Smart Auto-Correction & Merchant Normalization): deteksi anomali pengeluaran, pencegahan transaksi duplikat, dan standardisasi otomatis nama merchant belanja (contoh: 'GOPAY*TRANS' -> 'GoPay / Transjakarta') berbasis pembelajaran kebiasaan pengguna."
      ],
      "changesEn": [
        "Unified Submenu Consolidation (Sub-Module Switcher Bars): consolidated fragmented submenus into unified functional hubs featuring top 1-click sub-tab switchers across Accounts & Cards, Ledger & Transactions, Cash Flow & Budget, Planning & Projections, and Shared Finance.",
        "Membership & Plans Tier Alignment (Plus, Pro, Ultra): transparent feature tiering mapping Core/Starter essentials, Plus (Smart OCR Capture, Bill Calendar, Budget Rollover, Automated Rules), Pro (Smart Portfolio Rebalancing, Scenario Models, Monte Carlo Simulations), and Ultra (Multi-Exchange CEX CCXT Connectors, Unlimited AI Routing).",
        "Interactive Visual Tier Badges (.badge.plus, .badge.pro, .badge.ultra): clear plan indicators embedded directly in sub-module switchers and settings, fully responsive across Light and Dark themes.",
        "Grounded Personal Financial Intelligence: enhanced prompt grounding connecting user asset context and historical habits to preferred AI engines (OpenAI ChatGPT/GPT-4o, Google Gemini, Anthropic Claude via 9Router, Meta AI Muse Spark) while strictly enforcing Read-Only Ledger safety.",
        "Smart Auto-Correction & Merchant Normalization Engine: intelligent expense outlier detection, automated duplicate transaction prevention, and smart merchant name cleanup based on historical user patterns."
      ]
    },
    {
      "version": "0.20.0",
      "changes": [
        "Konektor Crypto Exchange Multi-Platform (CCXT): integrasi API bursa cryptocurrency terpadu mencakup Bybit, Binance, OKX, Gate.io, Bitget, Indodax, Tokocrypto, dan KuCoin dengan protokol koneksi standar industri.",
        "Sinkronisasi Saldo Read-Only & Privasi Lokal: membaca saldo koin (Spot & Funding) secara otomatis tanpa izin penarikan (withdrawal) atau perdagangan (trade); kredensial API hanya tersimpan di mesin lokal pengguna.",
        "Penilaian Pasar Koin Otomatis (USD & IDR): konversi saldo real-time (BTC, ETH, SOL, stablecoin, altcoin) ke valuasi USD dan IDR terintegrasi kurs Frankfurter FX lokal dengan tabel harga cadangan cerdas.",
        "Penyaring Debu Koin (Dust Filter) & Dialog Tinjau Interaktif: opsi filter saldo mikro (< $1.00 USD) serta tabel seleksi koin interaktif sebelum commit ke portofolio inventaris aset.",
        "Mode Simulasi Demo 1-Klik & Dukungan Proxy: tombol demo instan untuk menguji alur sinkronisasi multi-koin tanpa kunci API asli, serta dukungan HTTP/SOCKS proxy untuk lingkungan ISP dengan batasan akses domain exchange."
      ],
      "changesEn": [
        "Multi-Platform Crypto Exchange Connector (CCXT): unified cryptocurrency exchange API integration supporting Bybit, Binance, OKX, Gate.io, Bitget, Indodax, Tokocrypto, and KuCoin via industry-standard CCXT protocol.",
        "Read-Only Balance Sync & Local Server Privacy: automated balance synchronization (Spot & Funding) strictly read-only without withdrawal or trading permissions; API credentials remain stored on local server.",
        "Live Multi-Coin Valuation (USD & IDR): real-time balance conversion for BTC, ETH, SOL, altcoins, and stablecoins into USD and IDR integrated with Frankfurter reference FX rates and intelligent fallback pricing.",
        "Crypto Dust Filter & Interactive Balance Review: filter out micro-balances (< $1.00 USD) and interactive coin review table with selective checkbox import into investment portfolio holdings.",
        "1-Click Demo Simulation Mode & Proxy Support: instant demo simulation to test multi-coin balance sync workflows without real API keys, plus HTTP/SOCKS proxy support for ISP-restricted network environments."
      ]
    },
    {
      "version": "0.19.0",
      "changes": [
        "Diagram Alir Kas Sankey Interaktif Multi-Tier (Gaya Monarch Money Cash Flow): visualisasi arus kas multi-jenjang dari Sumber Pendapatan -> Hub Inflow Terpadu -> Pilar Alokasi (Sasaran Tabungan, Biaya/Kewajiban Tetap, Pengeluaran Fleksibel) -> Kategori Belanja & Sisa Kas Bebas (Net Cash Surplus/Gap)",
        "Pusat Metrik Tingkat Tabungan (Savings Rate % Indicator): kartu metrik dan lencana tingkat tabungan real-time yang menghitung rasio modal yang berhasil dialokasikan ke masa depan terhadap total pendapatan bulanan",
        "Target Asset Allocation & Drift Scoring Portofolio (Gaya Monarch Investments): tentukan target persentase kelas aset (Equity, Fixed Income, Cash, Commodities, dll.) dengan skor kepatuhan alokasi (Drift Score 0-100) dan deteksi deviasi otomatis (Overweight, Underweight, Balanced)",
        "Kalkulator Smart Rebalancing & Mode Deposit Kas Baru (Cash-Only Rebalance): simulator alokasi cerdas yang menghitung aksi beli/jual untuk penyesuaian target portofolio, serta opsi rebalance tanpa menjual aset (hanya menyalurkan deposit kas baru ke aset yang tertinggal) demi efisiensi biaya dan pajak",
        "4 Model Alokasi Portofolio Populer (1-Klik): preset alokasi standar industri siap pakai meliputi 60/40 Classic Balanced, 80/20 Aggressive Growth, All-Weather Portfolio, dan Conservative Income"
      ],
      "changesEn": [
        "Multi-Tier Interactive Cash Flow Sankey Diagram (Monarch Money Style): hierarchical cash flow visualization tracing Income Sources -> Central Inflow Hub -> Core Allocation Pillars (Goals & Savings, Fixed Obligations, Flexible Spending) -> Detailed Categories & Net Free Cash Surplus/Gap",
        "Savings Rate % Metric & Performance Badge: real-time savings rate indicator calculating the exact proportion of monthly income preserved for future wealth versus consumed",
        "Portfolio Target Asset Allocation & Drift Scoring (Monarch Money Investments Style): set target percentages across asset classes with live Drift Score (0-100) and automated status indicators (Overweight, Underweight, Balanced)",
        "Smart Portfolio Rebalancer & Cash-Only Deposit Simulator: compute exact BUY/SELL amounts to restore target weights, plus Cash-Only Rebalance simulation directing new deposits exclusively to underweight assets without selling winners",
        "4 Industry-Standard Model Allocation Presets: 1-click presets including 60/40 Classic Balanced, 80/20 Aggressive Growth, All-Weather Portfolio, and Conservative Income"
      ]
    },
    {
      "version": "0.18.0",
      "changes": [
        "Sistem Anggaran Fleksibel dengan Rollover (Gaya Monarch Money): alokasi anggaran kategori dengan dukungan rollover surplus/defisit otomatis antar-bulan, memisahkan Pengeluaran Fleksibel (Discretionary Pool) dan Biaya Tetap (Fixed Bills & Commitments)",
        "Spending Pace Indicator & Dual Track Progress Bar: pelacak laju pengeluaran bulanan real-time yang membandingkan hari kalender berjalan terhadap persentase anggaran terpakai (On Track, Pacing Fast, Over Budget)",
        "Aturan Otomatis Transaksi 1-Klik (Automation Rules Engine): tombol kilat (⚡) pada setiap baris riwayat transaksi untuk membuat aturan otomatis instan (pembersihan nama merchant, standarisasi kategori, tag, dan kepemilikan)",
        "Pusat Kelola Aturan Otomatis & Penerapan Retroaktif: modal manajemen aturan langsung dari toolbar transaksi dengan fitur pratinjau (preview) dan penerapan retroaktif instan ke transaksi yang sudah ada tanpa mengubah saldo akun"
      ],
      "changesEn": [
        "Flexible Category Budgeting with Rollover (Monarch Money Style): category budget allocations with automatic monthly surplus/deficit rollover, distinguishing Flexible Expenses (Discretionary Pool) and Fixed Commitments",
        "Spending Pace Indicator & Dual Track Progress Bar: real-time monthly spending pace comparison of elapsed days versus consumed budget (On Track, Pacing Fast, Over Budget)",
        "1-Click Transaction Automation Rules: lightning button (⚡) on each transaction row to instantly create automation rules (merchant renaming, category assignment, tagging, and split ownership)",
        "Rules Manager & Retroactive Application: dedicated rules management accessible from the transactions toolbar with live preview and retroactive updates to historical transactions without balance mutations"
      ]
    },
    {
      "version": "0.17.0",
      "changes": [
        "Mode Privasi Global / Ghost Mode (Ala Monarch Money): tombol privasi 1-klik terpadu pada header navigasi atas untuk mengaburkan/menyembunyikan saldo dan nominal moneter sensitif secara instan di seluruh layar dan bertahan di localStorage",
        "Kalender Arus Kas & Pemasukan Rutin (Payday & Cash Timing Grid): mengintegrasikan jadwal pemasukan/gaji (inflows) dalam chip hijau kalender berdampingan dengan tagihan rutin, lengkap dengan indikator Net Kas Proyeksi bulanan untuk mendeteksi kesenjangan likuiditas sebelum tagihan jatuh tempo",
        "Belanja dari Target Tabungan (Spend From Goal): opsi alokasi sasaran tabungan pada transaksi pengeluaran untuk mendanai pembelian langsung dari cadangan target (goal.saved) tanpa merusak anggaran belanja operasional bulanan",
        "Pemulihan Otomatis Cadangan Tabungan: penghapusan atau pengeditan transaksi bertaut sasaran tabungan secara otomatis mengembalikan atau menyesuaikan nominal dana ke saldo sasaran terkait tanpa distorsi aset total"
      ],
      "changesEn": [
        "Global Ghost Mode / Privacy Toggle (Monarch Money Style): 1-click privacy toggle on the top navigation bar to mask sensitive balances across all screens and persist preference in localStorage",
        "Recurring Cash Flow & Payday Calendar: integrated scheduled inflows and paydays in green chips alongside bill due dates, featuring monthly net cash buffer forecasting to spot liquidity gaps in advance",
        "Spend From Goal: link expense transactions directly to savings goals to spend from accumulated reserves (goal.saved) without distorting operational monthly spending budgets",
        "Automated Goal Reserve Restoration: deleting or modifying transactions linked to savings goals automatically restores or recalculates the goal reserve balance without affecting total assets"
      ]
    },
    {
      "version": "0.16.5",
      "changes": [
        "Visualisasi Investasi Interaktif & Generator Data Contoh (1-Klik): menambahkan tombol 'Muat data contoh' di menu Investment untuk langsung memunculkan grafik kurva performa TWR, perbandingan benchmark, dan diagram donat alokasi secara instan",
        "Endpoint Penarikan Harga Pasar Otomatis (/api/market-history): backend Python kini mendukung penarikan riwayat harga saham AS (VOO, AAPL), saham Indonesia/IHSG (.JK), dan Crypto (BTC-USD) secara gratis tanpa dependensi eksternal",
        "Fitur Sinkronisasi Harga Pasar Langsung (Live Market Sync): tombol 'Sinkron harga live' di panel Data & Riwayat untuk memperbarui harga pasar posisi holdings ke penutupan terkini secara otomatis",
        "Template Data Investasi Siap Impor: menyediakan berkas contoh CSV yang siap diimpor ke workspace lokal kapan pun dibutuhkan"
      ],
      "changesEn": [
        "Interactive Investment Visualizer & 1-Click Sample Data Generator: added 'Load sample data' button to instantly populate realistic holdings, historical prices, TWR performance curves, and asset allocation breakdown",
        "Automated Market Data History Endpoint (/api/market-history): Python backend now fetches daily historical quotes for US equities (VOO, AAPL), IDX Indonesian stocks (.JK), and Crypto (BTC-USD) using standard library HTTP requests",
        "Live Market Price Syncing: added 'Sync live prices' button in the Data & History panel to update active holdings quotes against latest market closing prices without date collisions",
        "Ready-to-import Investment Sample Dataset: provided standardized CSV sample dataset ready for manual import via the investment history modal"
      ]
    },
    {
      "version": "0.16.4",
      "changes": [
        "Audit Menyeluruh Stabilitas & Kelancaran Aplikasi: perbaikan penanganan error modal terhindar dari potensi null crash, serta optimalisasi alur event listener modal dan formulir",
        "Perbaikan Bug Pembuatan Kelompok Kategori Baru: menjamin kelompok kategori baru langsung terdaftar dan terpilih otomatis pada formulir penambahan kategori kustom",
        "Penambahan Fitur Edit Kategori Kustom: menyertakan tombol edit (✏️) pada baris kategori khusus di halaman Pengaturan Kategori untuk mengubah nama, kelompok, atau ikon emoji",
        "Penyempurnaan Heatmap Finansial: penanganan kondisi data kosong yang lebih informatif pada tab Pengeluaran dan Pendapatan, intensitas pengeluaran absolut, dan pesan ekspor SVG yang ramah pengguna",
        "Optimalisasi Interaksi Popover Chatbox & Pemilihan Media: putaran balik otomatis tombol (+) saat memilih menu aksi, filter berkas spesifik untuk Dokumen, Video, dan Audio, serta modal transaksi proporsional anti-clipping"
      ],
      "changesEn": [
        "Comprehensive Stability & Performance Audit: guarded modal error handlers against null crashes and optimized modal event listener lifecycle",
        "Category Group Creation Bug Fix: guaranteed newly created category groups are immediately populated and selected in custom category creation modal",
        "Custom Category Editing: added an inline edit button (✏️) on custom category rows in Settings to update names, groups, or emoji icons",
        "Financial Heatmap Enhancements: friendly empty states for filtered spending/income tabs, absolute volume intensity calculation, and refined SVG export notifications",
        "Chatbox Popover & Attachment Polish: auto-reverse rotation of the (+) button when opening sub-dialogs, specialized file filters for Document, Video, and Audio, and proportional modal height guarding against viewport clipping"
      ]
    },
    {
      "version": "0.16.3",
      "changes": [
        "Tombol Toggle 1-Klik Terpadu pada Pilihan Jenis Chart: menyatukan kontrol pemilihan grafik ke dalam tombol toggle cepat beranimasi (Sankey, Donat, Batang, Heatmap) serta menghapus menu dropdown konvensional yang redundan",
        "Penggantian Treemap Menjadi Heatmap Finansial Interaktif: menghadirkan visualisasi kalender peta panas (Heatmap) sebaran intensitas pengeluaran harian lengkap dengan matriks konsentrasi kategori, drill-down interaktif, dan ekspor SVG",
        "Animasi Berputar Tombol Chatbox (+ ➔ ✕ ➔ +): tombol lampiran berputar mulus 405° (satu putaran penuh) menjadi tanda silang (✕) saat menu terbuka, dan berputar kembali seperti semula setelah memilih/menambahkan dokumen atau file",
        "Popup Menu Lampiran Chatbox Seamless & Elegan: desain kartu popover mengambang yang rapi dengan grid 2x2 ubin media (Kamera, Dokumen, Video, Audio) tanpa terpotong atau overflow vertikal yang kaku"
      ],
      "changesEn": [
        "Unified 1-Click Chart Type Selector: streamlined chart controls into animated toggle buttons (Sankey, Donut, Bar, Heatmap) eliminating duplicate dropdowns",
        "Heatmap Chart replacing Treemap: interactive daily spending activity calendar heatmap with category concentration matrix, drill-down filtering, and direct SVG export",
        "Smooth Chatbox (+) Button Spin Animation: (+) button rotates 405° into an (✕) icon when open, and spins back smoothly once a file or document is attached",
        "Seamless & Floating Chat Attachment Popover: redesigned modern floating popover card with 2x2 media grid (Camera, Document, Video, Audio) preventing viewport clipping and awkward vertical cut-offs"
      ]
    },
    {
      "version": "0.16.2",
      "changes": [
        "Perombakan Visual Sub-menu Laporan (Reports) ala Monarch Money: antarmuka bersih (clean) dan penuh warna (colourful) dengan 6 tab utama beranimasi (Arus Kas / Cash Flow, Pengeluaran / Spending, Pendapatan / Income, Kekayaan Bersih / Net Worth, Hutang / Debt, Kartu Kredit / Cards)",
        "Diagram Aliran Arus Kas Sankey Multi-Warna: visualisasi pita aliran bezier penuh warna dinamis menghubungkan sumber pemasukan ke pos pengeluaran dan simpanan bersih, dilengkapi avatar emoji kategori, persentase kontribusi, dan efek pendar saat disorot",
        "Grafik Donat / Ring Berwarna-Warni Interaktif: tampilan distribusi pengeluaran dan pemasukan 10 palet warna cerah dengan total nominal terpusat di tengah cincin, serta legenda interaktif dengan navigasi drill-down langsung",
        "4 Kartu Metrik Ringkasan Utama: kartu KPI responsif berbingkai modern untuk Total Pendapatan, Total Pengeluaran, Total Pendapatan Bersih, dan Rasio Tabungan (Savings Rate) dengan pill nilai berkode warna",
        "Tata Letak Terpisah 2 Kolom (Split Grid) & Garis Waktu Transaksi: panel kiri menampilkan garis waktu transaksi yang dikelompokkan berdasarkan tanggal dengan avatar emoji kategori, nama merchant, pill kepemilikan, dan badge akun; panel kanan menampilkan Kartu Ringkasan Periode (KPI, transaksi terbesar, rata-rata harian, rentang tanggal, dan tombol unduh CSV)"
      ],
      "changesEn": [
        "Monarch Money-inspired Reports Sub-menu Overhaul: clean, modern and colorful aesthetic featuring 6 animated report tabs (Cash Flow, Spending, Income, Net Worth, Debt, Cards)",
        "Vibrant Flowing Sankey Ribbon Diagram: multi-colored bezier ribbons connecting income sources to category expenses and net income with percentage indicators, category emojis, and interactive ribbon glow transitions",
        "Interactive Multi-colored Donut / Ring Chart: 10 vibrant color slices for Spending and Income distributions, centered total KPI, and interactive legend with instant drill-down filtering",
        "4 Monarch-style Metric KPI Cards: responsive top summary cards (Total Income, Total Expenses, Net Income, Savings Rate) with colored value pills and trend indicators",
        "2-Column Split Grid & Date-grouped Transaction Timeline: left panel features date-grouped transactions with category avatars, merchant titles, owner pills, and account tags; right panel presents an executive Monarch Period Summary card with transaction counts, averages, extremes, and 1-click CSV export"
      ]
    },
    {
      "version": "0.16.1",
      "changes": [
        "Modal Tambah Transaksi Lebih Ringkas & Proporsional: tata letak 2 kolom terstruktur dengan tinggi di bawah 440px tanpa perlu scroll vertikal pada layar standar",
        "Sub-menu Kategori Dipindahkan ke Pengaturan (Settings): menu sidebar Keuangan kini lebih fokus dan rapi, manajemen kategori tetap dapat diakses penuh di Pengaturan",
        "Penyatuan Sub-menu Skenario & Monte Carlo: digabung menjadi satu grup navigasi ringkas di Perencanaan dengan tab switcher 1-klik untuk beralih antara Skenario dan Simulasi Monte Carlo",
        "Chatbox Tanya INVEYS Lebih Efisien ala ChatGPT & Gemini: gelembung percakapan baru, typing shimmer dot, starter prompt pills, serta dukungan lampiran gambar, video (MP4/WebM), PDF/dokumen, dan audio",
        "Halaman Integrasi Simpel & Visual Topologi Beranimasi: 4 kartu modular terpadu dengan diagram topologi SVG interaktif beranimasi aliran data berdenyut dan simulasi uji latensi"
      ],
      "changesEn": [
        "Proportional & Compact Add Transaction Modal: structured 2-column layout keeping dialog height under 440px without vertical scrolling on standard displays",
        "Categories Navigation Moved to Settings: decluttered financial sidebar navigation while preserving full category management access inside Settings",
        "Unified Planning Scenarios & Monte Carlo: consolidated into a single navigation entry under Planning with 1-click header switcher tabs",
        "Powerful Tanya INVEYS Chatbox (Gemini/ChatGPT-style): streamlined conversation UI, typing indicators, quick starter prompt pills, and expanded attachments (images, video, documents, audio)",
        "Simplified Integrations with Animated Connection Topology: 4 clean integration modules, animated SVG pulse stream topology diagram, and interactive latency ping simulation"
      ]
    },
    {
      "version": "0.16.0",
      "changes": [
        "Modal Tambah Transaksi ala Monarch Money: toggle Debit, Kredit & Transfer, input nominal besar dengan simbol mata uang dinamis, autocomplete nama pedagang (merchant), dan switch penyesuaian saldo akun (adjust balance switch)",
        "Kategori Interaktif & Popover Flyout ala Monarch: pencarian instan kategori, visualisasi avatar emoji kategori, dan pengelompokan lengkap (Income, Bills & Utilities, Food & Dining, Auto & Transport, Housing, Gifts & Donations, Travel & Lifestyle)",
        "Halaman Kelola Kategori (Categories Manager): daftar kelompok kategori terstruktur ala Monarch Money, hitungan transaksi per kategori, pembuatan kategori baru dengan pilihan emoji kustom, dan pembuatan kelompok baru",
        "Visual Avatar Kategori pada Jurnal Transaksi: setiap baris transaksi kini dilengkapi avatar bulat ikon emoji kategori yang elegan dan mudah dikenali",
        "Kalender Visual Tagihan & Langganan ala Monarch Money: visual grid bulanan 7 kolom, chip status jatuh tempo/lunas/terlewat, dan ringkasan metrik total estimasi serta sisa tagihan",
        "Mode tampilan ganda Kalender dan Daftar (Terlewat, Jatuh Tempo 7 Hari, Nanti di Bulan Ini, Sudah Terbayar) dengan navigasi bulan interaktif",
        "Tandai lunas instan, pencatatan pembayaran langsung ke rekening likuid, dan formulir tambah/edit langganan baru (emoji, kategori, siklus bulanan/tahunan)",
        "Pengamanan Hostinger KVM VPS: layar otentikasi Master Password, sinkronisasi SQLite otomatis, dan endpoint status"
      ],
      "changesEn": [
        "Monarch Money-style Add Transaction Modal: top segmented toggle (Debit, Credit, Transfer), large currency-aware amount input, merchant autocomplete, and adjust account balance toggle card",
        "Interactive Category Popover Flyout: instant search, emoji category avatars, and structured groups (Income, Bills & Utilities, Food & Dining, Auto & Transport, Housing, Gifts & Donations, Travel & Lifestyle)",
        "Categories Manager Page: Monarch-inspired category groups, transaction counts per category, custom category creator with emoji selector, and custom group support",
        "Visual Category Avatars in Transaction Journal: transactions now display elegant emoji category avatars for fast visual identification",
        "Monarch Money-style Visual Bills & Subscriptions Calendar: 7-column monthly grid, due/paid/overdue status chips, and expected vs remaining summary metrics",
        "Dual Calendar and List views (Overdue, Due in 7 Days, Later this Month, Paid) with interactive month navigation",
        "Instant mark-as-paid, direct payment recording into liquid accounts, and subscription add/edit modals (emoji, category, monthly/annual cadence)",
        "Hostinger KVM VPS security: Master Password lock screen, automatic SQLite sync, and auth status endpoints"
      ]
    },
    {
      "version": "0.15.0",
      "changes": [
        "Grafik Holdings diperbarui: ringkasan nilai, shortcut periode, Return/Nilai, serta kartu benchmark interaktif",
        "Tooltip terpadu dengan crosshair, klik untuk mengunci, sentuhan dan navigasi keyboard",
        "Benchmark yang datanya jarang tidak lagi memperpendek grafik atau mengubah return portofolio",
        "Warna benchmark stabil; data yang hilang tetap kosong dan sumber/metode dapat dibuka",
        "Klik simbol holdings untuk grafik aset; ekspor SVG/CSV mengikuti data dan tampilan baru"
      ],
      "changesEn": [
        "Refreshed Holdings chart: value summary, period shortcuts, Return/Value and interactive benchmark cards",
        "Unified tooltip with crosshair, click-to-pin, touch and keyboard navigation",
        "Sparse benchmark history no longer shortens the portfolio chart or changes its return",
        "Stable benchmark colors; missing values stay empty and methods/sources remain inspectable",
        "Holding symbols open scoped asset charts; SVG/CSV exports follow the new display"
      ]
    },
    {
      "version": "0.14.0",
      "changes": [
        "Operations: aturan merchant/kategori/pemilik/tag/reviewer/visibilitas/split dengan preview jurnal lama",
        "Review pending/posted, rekonsiliasi ledger/snapshot dan riwayat perubahan lokal",
        "Pencocokan metadata struk ke transaksi, perlindungan sumber impor dan deteksi arus rutin",
        "Refund mengurangi kategori belanja; belanja kartu menambah utang dan pembayaran menjadi transfer",
        "Forecast: rata-rata bulan tersedia, inflasi pada arus, prioritas/tahun penarikan dan jadwal return akun"
      ],
      "changesEn": [
        "Operations: merchant/category/owner/tag/reviewer/visibility/split rules with existing-journal preview",
        "Pending/posted review, ledger/snapshot reconciliation and local change history",
        "Receipt metadata matching, import source protection and recurring detection",
        "Refunds reduce spending; card purchases add debt and payments become transfers",
        "Forecast: available-month averaging, inflation-linked flows, withdrawal rank/start year and account return schedules"
      ]
    },
    {
      "version": "0.13.0",
      "changes": [
        "Unggah, ganti dan hapus gambar desain kartu kredit dengan preview realistis",
        "Gambar dioptimasi lokal dan ikut backup JSON; saldo/metadata kartu tetap",
        "Nominal pengeluaran merah pada jurnal, Reports, arus rutin dan draft"
      ],
      "changesEn": [
        "Upload, replace and remove credit-card artwork with realistic preview",
        "Artwork optimized locally and retained in JSON backups without financial changes",
        "Expense amounts red in journal, Reports, recurring rows and drafts"
      ]
    },
    {
      "version": "0.12.0",
      "changes": [
        "Kolom Aksi jurnal dengan ikon edit, simpan, batal dan hapus",
        "Edit langsung di baris; popup centang setelah koreksi tersimpan",
        "Konfirmasi penghapusan dengan pembalikan saldo atomik dan FX historis",
        "Ikon berbeda untuk semua menu/grup/sidebar dan submenu laporan, investasi serta forecast"
      ],
      "changesEn": [
        "Journal Actions column with edit, save, cancel and delete icons",
        "Inline row editing; success popup after persisted correction",
        "Confirmed deletion with atomic balance reversal and historical FX",
        "Distinct icons for sidebar destinations/groups and report, investment and forecast tabs"
      ]
    },
    {
      "version": "0.11.0",
      "changes": [
        "Edit transaksi dengan koreksi saldo atomik, jurnal historis dan transfer lintas mata uang",
        "Chat otomatis minimize saat klik di luar; tombol minimize dan dropdown AI dihapus",
        "Tanya dan Catat menjadi satu input; AI mengklasifikasi intent dan menghasilkan draft review",
        "Konfigurasi asisten dipindahkan ke Integrations dengan adapter gateway 9Router",
        "Chatbot lengkap menggunakan asisten dan riwayat pemilik yang sama"
      ],
      "changesEn": [
        "Transaction editing with atomic balance corrections, historical journal and cross-currency transfer handling",
        "Chat minimizes on outside click; minimize controls and inline provider picker removed",
        "Ask and Record unified; AI classifies intent and returns review drafts",
        "Assistant configuration moved into Integrations with a 9Router gateway adapter",
        "Full copilot shares the configured assistant and owner-scoped conversation history"
      ]
    },
    {
      "version": "0.10.0",
      "changes": [
        "Chat multimodal dengan percakapan, pilihan model, mode Tanya/Catat dan tombol minimize langsung",
        "Unggah gambar, PDF, TXT/CSV atau audio; rekam mikrofon dan kamera perangkat yang didukung",
        "Adapter server OpenAI, Gemini dan Muse Spark; API key tetap di server dan pengiriman memerlukan izin",
        "Memori preferensi dapat ditinjau/dihapus; riwayat dibatasi perspektif pemilik dan AI tidak mengubah jurnal",
        "Caption yang ditandai dihapus; tampilan chat dibuat lebih ringkas dan responsif"
      ],
      "changesEn": [
        "Multimodal conversation, provider selection, Ask/Record modes and explicit minimize control",
        "Image, PDF, TXT/CSV and audio upload; microphone recording and supported device camera capture",
        "Server adapters for OpenAI, Gemini and Muse Spark; server-only keys and explicit data-sharing consent",
        "Editable/removable preferences; owner-scoped conversation history and read-only AI responses",
        "Removed marked caption; refined compact responsive chat layout"
      ]
    },
    {
      "version": "0.9.2",
      "changes": [
        "Header chat dihapus; minimize dan chatbot lengkap dipindahkan ke menu +",
        "Chatbox tersedia di seluruh menu/submenu, dengan draft dan teks yang bertahan saat navigasi",
        "Tombol + membuka kamera perangkat yang didukung atau pemilih gambar/PDF langsung",
        "Lampiran disiapkan tanpa mutasi jurnal; ekstraksi dan review memakai layanan Capture lokal"
      ],
      "changesEn": [
        "Chat header removed; minimize and full chatbot moved into + menu",
        "Chat available on every page, retaining text and drafts across navigation",
        "+ offers supported device camera capture and direct image/PDF file selection",
        "Attachments staged without ledger mutation; extraction/review uses local Capture services"
      ]
    },
    {
      "version": "0.9.1",
      "changes": [
        "Ukuran label About INVEYS dan Settings & data disamakan dengan menu sidebar",
        "Pencatatan cepat menjadi chat mengambang dengan tombol + dan pop-up lampiran / pilihan akun",
        "Minimize / buka kembali tanpa kehilangan draft, input atau akun; mikrofon dan kirim ringkas",
        "Enter untuk mengirim; Shift+Enter untuk baris baru; review draft tetap wajib sebelum simpan"
      ],
      "changesEn": [
        "About INVEYS and Settings & data labels match sidebar menu typography",
        "Quick capture becomes a floating chat with + attachment/account popover",
        "Minimize/reopen preserves input, account and drafts; compact microphone/send controls",
        "Enter sends; Shift+Enter adds a line; drafts still require review before saving"
      ]
    },
    {
      "version": "0.9.0",
      "changes": [
        "Investment dirombak menjadi Holdings (Market / Allocation) dan Advanced (Allocation / Gains & Losses / Funds)",
        "Engine posisi aset individual, unit pecahan, cost basis historis, gain/loss, alokasi, filter akun/pemilik dan IDR/USD",
        "Backtest posisi saat ini dari harga historis; TWR riwayat portofolio lama tetap tersedia sebagai model terpisah",
        "Analisis ETF/reksa dana dengan klasifikasi manual, pie/breakdown, snapshot gain/loss dan ekspor CSV/SVG",
        "Migrasi data lama tanpa mengubah saldo akun; harga pasar live dan klasifikasi Morningstar otomatis belum tersedia"
      ],
      "changesEn": [
        "Investment rebuilt as Holdings (Market / Allocation) and Advanced (Allocation / Gains & Losses / Funds)",
        "Individual holdings engine with fractional units, historical cost FX, unrealized gains, allocations, account/owner filters and IDR/USD",
        "Current-holdings historical price backtest; legacy portfolio-history TWR remains a separate model",
        "ETF/fund analysis with manual classifications, pie/breakdown, gain snapshots and CSV/SVG exports",
        "Legacy migration preserves balances; live quotes and automatic Morningstar classification are not available"
      ]
    },
    {
      "version": "0.8.1",
      "changes": [
        "Fix tab Reports horizontal: Cash flow, Spending, Income, Net worth, Debt, Credit cards",
        "Efek hover/fokus dan underline aktif mengikuti palet; scroll horizontal pada layar sempit",
        "Aturan tab dipisahkan dari navigasi sidebar vertikal; tab Forecast ikut mendapat tata letak horizontal"
      ],
      "changesEn": [
        "Fix horizontal Reports tabs: Cash flow, Spending, Income, Net worth, Debt, Credit cards",
        "Palette-aware hover/focus and active underline; horizontal scrolling on narrow screens",
        "Tab layout overrides vertical sidebar navigation; Forecast tabs also stay horizontal"
      ]
    },
    {
      "version": "0.8.0",
      "changes": [
        "Plus, Pro, Ultra: katalog harga draft IDR bulanan/tahunan, perbandingan fitur, pratinjau paket tanpa tagihan",
        "Typography konsisten, angka tabular, tabel responsif dan heading lebih rapi",
        "Forecast berdasarkan video: setup data/akun/pensiun, tabel lintas tahun Accounts/Cash Flow/Events, pemilih kejadian",
        "Preview batas skenario/kejadian dan akses pembuatan fitur; pembayaran dan otorisasi langganan server belum aktif"
      ],
      "changesEn": [
        "Plus, Pro, Ultra: editable draft IDR monthly/annual pricing, feature comparison and no-charge tier previews",
        "Consistent typography, tabular numbers, responsive data tables and clean headings",
        "Video-inspired Forecast setup, year-by-year Accounts/Cash Flow/Events matrix and event picker",
        "Preview scenario/event limits and creation access; paid checkout and server subscription authorization not active"
      ]
    },
    {
      "version": "0.7.0",
      "changes": [
        "Dark mode charcoal dengan warna panel/teks/aksen konsisten dan grafik mengikuti palet",
        "Palet Forest, Charcoal, Ocean, Violet dan kustom; light/dark independen, validasi kontras",
        "Menu diringkas menjadi kelompok Keuangan, Perencanaan, Analisis, Kelola dengan submenu",
        "Forecast: kurva titik bulanan, penanda kejadian, pembanding skenario, pilihan net worth/aset/arus kas, slider tahun"
      ],
      "changesEn": [
        "Charcoal dark mode with consistent surfaces/text/accent and palette-aware charts",
        "Independent light/dark Forest, Charcoal, Ocean, Violet and custom palettes with contrast checks",
        "Grouped Finances, Planning, Insights and Manage navigation with submenus",
        "Forecast: monthly-point curve, event markers, scenario comparison, net worth/assets/cash flow views and year slider"
      ]
    },
    {
      "version": "0.6.0",
      "changes": [
        "UI lebih ringkas: sidebar ikon, hover overlay, keyboard, pin, dan navigasi mobile dengan backdrop",
        "Reports: kontrol tanggal/filter ringkas, ringkasan pendapatan/pengeluaran/net cash flow/rasio surplus",
        "Pilihan Sankey dan Bar langsung; Bar pendapatan/pengeluaran berdampingan dengan pengelompokan bulan",
        "Sankey proporsional dengan sumber pendapatan, pengeluaran, surplus dan kebutuhan pendanaan; ekspor SVG mengikuti grafik"
      ],
      "changesEn": [
        "Simpler UI: icon rail, hover overlay, keyboard expansion, pin and mobile backdrop navigation",
        "Reports: compact date/filters, income/expenses/net cash flow/surplus ratio summaries",
        "Direct Sankey and Bar controls; side-by-side income/expense bars with monthly grouping",
        "Proportional Sankey with income sources, expenses, surplus and funding gap; SVG export follows selected chart"
      ]
    },
    {
      "version": "0.5.0",
      "changes": [
        "Menu Investment: akun investasi, alokasi berbasis akun, dan riwayat kinerja terpisah",
        "Perbandingan portofolio dengan S&P 500, US Stock (VTI), US Bond (BND), Bitcoin, dan IHSG",
        "Impor CSV, TWR dengan arus akhir periode, kurs historis IDR/USD, tanggal cocok, basis return konsisten",
        "Grafik multi-benchmark, return, excess return, drawdown observasi dan ekspor CSV; feed pasar otomatis belum terhubung"
      ],
      "changesEn": [
        "Investment menu with account allocation and separate performance history",
        "Compare portfolio with S&P 500, US Stock (VTI), US Bond (BND), Bitcoin and IHSG",
        "CSV import, end-period-flow TWR, historical IDR/USD FX, matching dates and consistent return basis",
        "Multi-benchmark chart, returns, excess, observed drawdown and CSV export; automatic market feed not connected"
      ]
    },
    {
      "version": "0.4.1",
      "changes": [
        "Dashboard: pencatatan teks, akses Scan dan suara, pilihan akun eksplisit, dan chatbot perhitungan lokal",
        "Draft ditinjau langsung di dashboard, pemeriksaan duplikasi, mata uang, dan nominal tunggal",
        "Riwayat pertanyaan terhubung dengan halaman Financial Copilot"
      ],
      "changesEn": [
        "Dashboard: text capture, Scan and voice access, explicit account selection, local calculation chatbot",
        "Inline draft review with duplicate, currency and single-amount validation",
        "Questions share conversation history with Financial Copilot"
      ]
    },
    {
      "version": "0.4.0",
      "changes": [
        "Shared Views: pemilik akun/transaksi, split nominal/persentase, editor massal dan tampilan tersimpan",
        "Reports: cash flow, spending, income, snapshot net worth, debt dan credit cards",
        "Grafik batang/Sankey/treemap, drill-down, filter, saved reports dan ekspor CSV/SVG",
        "Forecast bulanan/tahunan, asumsi per akun, kejadian hidup dan perbandingan skenario",
        "Monte Carlo terpadu dengan akun, utang, life events, dan aturan shortfall",
        "Dashboard dapat dikustomisasi dan navigasi terkelompok"
      ],
      "changesEn": [
        "Shared Views: account/transaction owners, amount/percentage splits, bulk editor and saved views",
        "Reports: cash flow, spending, income, net worth snapshots, debt and credit cards",
        "Bars/Sankey/treemap, drill-down, filters, saved reports and CSV/SVG exports",
        "Monthly/annual Forecast, per-account assumptions, life events and scenario comparison",
        "Integrated Monte Carlo with accounts, debt, life events and shortfall rules",
        "Customizable dashboard and grouped navigation"
      ]
    },
    {
      "version": "0.3.0",
      "changes": [
        "Telegram inbox dan pengiriman pesan dengan persetujuan pengguna",
        "Muse Spark: asisten AI dan transkripsi audio",
        "OCR struk/statement, review draft, dan indikator duplikasi",
        "Kurs referensi otomatis dan pusat pembaruan"
      ],
      "changesEn": [
        "Telegram inbox and message sending with user consent",
        "Muse Spark AI assistant and audio transcription",
        "Receipt/statement OCR, draft review and duplicate indicators",
        "Automatic reference rates and release center"
      ]
    },
    {
      "version": "0.2.0",
      "changes": [
        "Bahasa Indonesia/English, multi-currency, tema terang/gelap",
        "Editor owner, Monte Carlo, dashboard kartu kredit"
      ],
      "changesEn": [
        "Indonesian/English, multi-currency and light/dark themes",
        "Owner editor, Monte Carlo and credit card dashboard"
      ]
    },
    {
      "version": "0.1.0",
      "changes": [
        "Financial operating system lokal: akun, transaksi, cash flow, goals, utang"
      ],
      "changesEn": [
        "Local financial OS: accounts, transactions, cash flow, goals and debt"
      ]
    }
  ]
}
;
