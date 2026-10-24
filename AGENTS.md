# Repository Guidelines & Automation Rules

## 1. Always Sync to GitHub (Mandatory)
Setiap kali ada perubahan, penambahan fitur, perbaikan bug, atau update pada kode di repository ini:
- **Build Single HTML Bundle**: Jalankan `python3 build.py` jika ada perubahan pada file di `src/`, `server/`, atau asset aplikasi agar `inveys-app.html` selalu tersinkronisasi.
- **Run Tests**: Pastikan semua tes lulus dengan menjalankan:
  - `npm test`
  - `python3 tests/backend_test.py`
- **Commit & Push to GitHub**:
  - Stage file yang relevan (`git add ...`).
  - Buat commit dengan pesan yang jelas dan deskriptif mengikuti format conventional commit (contoh: `feat(...)`, `fix(...)`, `chore(...)`, `refactor(...)`).
  - Push commit ke remote repository GitHub (`git push origin <branch>`).
  - Selalu laporkan status push dan commit hash kepada pengguna setelah selesai.

## 2. Integrity & Quality
- Pertahankan semua tes existing agar tetap lulus 100%.
- Jangan pernah menghapus data atau merusak riwayat git tanpa konfirmasi eksplisit dari pengguna.
- Jaga agar aplikasi single-file standalone `inveys-app.html` selalu dapat dijalankan langsung di browser secara offline maupun via container Docker/Caddy.
