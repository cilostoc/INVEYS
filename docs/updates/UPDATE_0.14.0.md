# INVEYS 0.14.0 — Implementasi mekanisme Monarch + INVEYS

Tanggal rilis: 6 Oktober 2026. Ini adalah peningkatan aplikasi lokal yang
berfungsi, bukan klaim seluruh layanan produksi Monarch telah direplikasi.
Implementasi dibuat pada engine INVEYS sendiri.

| Kemampuan | Status di INVEYS 0.14.0 | Batas praktis |
|---|---|---|
| Rules merchant, kategori, owner, tag, reviewer, hide, split | Berjalan untuk pencatatan baru; preview dan konfirmasi jurnal lama | Urutan mengikuti daftar; tidak mengubah nominal/akun/jenis |
| Review transaksi | Pending/posted, penanggung jawab lokal, tanda reviewed | Anggota lokal bukan user login terpisah |
| Rekonsiliasi saldo | Mode ledger/snapshot, delta, sumber dan snapshot posisi | Saldo statement masih input manual |
| Akuntansi kartu | Belanja menambah utang; pembayaran transfer; migrasi jurnal lama | Statement manual; refund kartu melalui rekonsiliasi |
| Refund | Mengurangi kategori expense semula, partial/capped, split dan FX pelaporan | Akun/mata uang sama dengan expense asli |
| Struk cocok dengan transaksi | Pilihan pasangan berdasarkan akun/currency/amount/tanggal | Metadata hasil capture; file asli/itemization tidak disimpan |
| Deteksi transaksi rutin | Usulan mingguan, bulanan, tahunan; konfirmasi ke cash-flow plan | Tidak melakukan debit/tagihan atau reminder background |
| Ringkasan dan insights | Ringkasan tujuh hari dan antrean review berbasis jurnal | Kalkulasi lokal; bukan email/AI recap terjadwal |
| Jejak perubahan | Maksimal 1.000 kejadian lokal, detail sebelum/sesudah | Dapat diubah melalui backup; bukan audit server menyeluruh |
| Forecast yang lebih fleksibel | Pembagi sejarah tersedia, inflation-linked flows, staged returns, withdrawal rank/start year | Proyeksi bulanan dari bulan penuh berikutnya; annual rolling |
| Skenario dan Monte Carlo | Engine lama diperluas dengan asumsi akun baru | FX tetap, shock investasi bersama; pajak/penalti belum dimodelkan |
| Reports dan dashboard | Sankey, bar termasuk nilai refund negatif, filter/saved report, widget lama | Pelaporan memakai kurs tersimpan; belum laporan pajak resmi |
| Investment dan benchmark | Holdings, cost basis, gain/loss, allocation, TWR, S&P 500/VTI/BND/BTC/IHSG | Data/harga historis diimpor manual; tidak ada broker feed baru |
| IDR dan multi-currency | Dipertahankan; konversi dan kurs referensi tersedia | Feed referensi bukan kurs eksekusi bank |
| Shared Views | Owner/split dan analisis perspektif dipertahankan | Bukan privacy boundary atau undangan cloud |
| AI/multimodal | Chat global, review draft, suara/gambar/dokumen, adapter server lama | API key/consent diperlukan; tidak melatih model sendiri |
| Plus/Pro/Ultra | Katalog, preview dan batas UI dipertahankan | Billing dan entitlement produksi belum diaktifkan |
| Bank/broker/crypto otomatis | Belum aktif | Memerlukan adapter, akun provider, credential dan rekonsiliasi feed |
| Login, MFA, household invitation | Belum diimplementasikan | Memerlukan identity dan authorization server |
| Cloud multi-device dan background sync | Belum diimplementasikan | Memerlukan database, worker, token lifecycle dan conflict model |
| Security produksi | Proteksi server lokal yang ada dipertahankan | Financial workspace masih browser storage tanpa enkripsi aplikasi |

## Alur penggunaan

1. Backup melalui Settings & data sebelum memperbarui kode.
2. Tinjau journal kartu setelah migrasi: pembayaran lama menjadi transfer.
3. Buka **Kelola → Operations**, buat aturan, lalu preview jurnal jika perlu.
4. Pilih mode saldo. Rekonsiliasi dengan statement menjadikan jurnal terkait
   historis tanpa replay saldo. Transfer terkait juga menjadi historis di kedua sisi.
5. Tinjau pending dan post setelah diverifikasi. Mark reviewed untuk transaksi
   yang sudah selesai; current Shared Views menyaring antrean dan recap.
6. Capture struk/statement seperti biasa. Jika pasangan tersedia, pilih
   **Cocokkan struk** untuk menautkan metadata, bukan mencatat pengeluaran kedua.
7. Konfirmasi pola rutin yang benar. Nilai menjadi asumsi bulanan Forecast.
8. Pada Forecast, pilih kebijakan history, growth mode, dan asumsi akun.
   Contoh jadwal `1=6, 10=4` berarti 6% dari tahun proyeksi pertama dan 4%
   mulai tahun proyeksi kesepuluh; ini asumsi, bukan prediksi pasar.

## Tahap lanjutan yang diperlukan untuk seluruh cakupan produksi

Urutan dependency berikut menjaga fitur lokal tetap dapat dipakai sementara
layanan produksi dikembangkan. Tahap ini belum aktif pada rilis ini.

1. **Identity dan penyimpanan server:** workspace/household IDs, autentikasi,
   MFA, sesi, permission checks, encrypted persistence, migrasi dan backup.
2. **Feed keuangan:** normalisasi provider ID, pending→posted reconciliation,
   tombstones, multi-currency snapshot, checkpoint, retries, monitoring, dan
   read-only bank/broker/crypto adapters. Tidak memakai key trading/withdrawal.
3. **Kolaborasi dan otomasi:** invitations, shared review assignment, scheduler,
   Telegram/recap background dengan preferensi penerima, conflict handling.
4. **Investment dan planning:** historis kuantitas/lot/price/dividend, total-return
   benchmark yang konsisten, pajak/penalti berbasis yurisdiksi, kalender tahunan
   eksplisit dan Monte Carlo dengan korelasi/FX yang dapat dipilih.
5. **Monetisasi dan operasi:** checkout provider, webhook idempotency,
   entitlement server, pembatalan/refund, observability, restore drills,
   migration/rollback dan rollout versi yang terkontrol.

Diperlukan pengembangan tambahan, konfigurasi infrastruktur, serta credential
provider untuk tahap-tahap tersebut. Menambahkan API key saja belum cukup untuk
menjadikan aplikasi cloud yang aman atau mengaktifkan koneksi bank.

## Verifikasi

Pengujian otomatis meliputi engine uang, rollback koreksi, source deduplication,
refund/split/Sankey, kartu, history policy, withdrawal schedule, recurring,
DOM smoke interactions dan endpoint server lokal. DOM adapter bukan browser
nyata; tidak membuktikan hasil layout/perangkat/kamera. Provider eksternal
menggunakan mock pada tests dan belum dites dengan akun bank/broker live.
