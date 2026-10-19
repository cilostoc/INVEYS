# Panduan Deployment INVEYS Berbasis Docker di Server VPS

Panduan resmi deployment aplikasi **INVEYS** di server VPS (Hostinger KVM, DigitalOcean, Hetzner, AWS EC2, dll.) menggunakan arsitektur kontainer **Docker & Docker Compose**.

---

## 1. Arsitektur Kontainer & Keamanan

Arsitektur Docker INVEYS dirancang dengan prinsip **Stateless Container + Stateful Volume**:

```text
┌─────────────────────────────────────────────────────────────┐
│                 HOST VPS (Hostinger KVM / Ubuntu)           │
│                                                             │
│   Port 80/443 (HTTPS)                Port 3000 (HTTP)       │
│        ▲                                   ▲                │
│        │                                   │                │
│   ┌────┴────────────────────────┐          │                │
│   │   Kontainer Caddy Proxy     │          │                │
│   │   (Otomatis SSL TLS 1.3)    │          │                │
│   └────┬────────────────────────┘          │                │
│        │ (Internal Bridge Network)         │                │
│        ▼                                   ▼                │
│   ┌─────────────────────────────────────────────────────┐   │
│   │   Kontainer Utama (inveys-app)                      │   │
│   │   - Python 3.11 Slim (serve.py API Gateway)         │   │
│   │   - Non-Root User (UID: 1000 'inveys')              │   │
│   │   - Tesseract OCR, Poppler (PDF), FFmpeg (Audio)    │   │
│   │   - Pre-compiled Bundle (inveys-app.html)           │   │
│   └───────────────────────┬─────────────────────────────┘   │
│                           │ Mount Path: /data               │
│                           ▼                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │   Docker Volume: inveys_vault_data                  │   │
│   │   - Database SQLite WAL (inbox.sqlite3)             │   │
│   │   - Workspaces, Sesi, Auth PBKDF2 & Rolling Backups │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

* **Keamanan Non-Root**: Kontainer berjalan di bawah pengguna `inveys` (UID 1000), bukan `root`, mencegah *container breakout*.
* **Isolasi Database**: Basis data SQLite tersimpan di Docker Named Volume (`inveys_vault_data`), sehingga data finansial **100% aman dan kebal terhapus** saat kontainer diperbarui, di-rebuild, atau dihentikan.
* **Perangkat Bawaan**: Gambar kontainer sudah mencakup `tesseract-ocr` (baca nota/struk), `poppler-utils` (ekstraksi PDF e-statement), dan `ffmpeg` (transcoding suara mono WAV 24kHz).

---

## 2. Persyaratan Minimum VPS

* **Sistem Operasi**: Ubuntu 22.04 LTS / 24.04 LTS atau Debian 11/12 (Rekomendasi: Hostinger KVM 1 atau lebih tinggi).
* **CPU & RAM**: 1 vCPU, 1 GB RAM (Disarankan 2 GB RAM jika memproses banyak file OCR berukuran besar).
* **Penyimpanan**: Minimal 10 GB SSD.

---

## 3. Langkah Instalasi Cepat (Quick Start)

### Langkah 1: Kloning Repositori di VPS
Masuk ke terminal VPS Anda via SSH dan clone proyek:

```bash
git clone https://github.com/cilostoc/INVYES.git
cd INVYES
```

### Langkah 2: Instalasi Docker & Docker Compose (Jika belum terpasang)
Jika VPS Anda belum memiliki Docker, instal langsung via skrip resmi:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

### Langkah 3: Konfigurasi File `.env`
Salin template konfigurasi dan edit sesuai kebutuhan Anda:

```bash
cp .env.example .env
nano .env
```

Atur parameter penting:
```env
# Nama domain Anda (atau gunakan 'localhost' / IP server)
DOMAIN=keuangan.domainanda.com
ALLOWED_HOSTS=keuangan.domainanda.com,127.0.0.1,localhost

# Model AI (Opsional)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-3.8-flash

# Telegram Bot (Opsional)
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=987654321
```

---

## 4. Dua Pilihan Mode Deployment

### Opsi A: Mode Standalone HTTP (Port 3000)
Cocok jika Anda ingin menguji langsung atau sudah memiliki Nginx/Cloudflare tersendiri di depan VPS.

Jalankan perintah:
```bash
./scripts/deploy-docker.sh
# Atau secara manual:
docker compose up -d --build
```
Aplikasi langsung dapat diakses di `http://IP-VPS-ANDA:3000`.

---

### Opsi B: Mode Production dengan Otomatis HTTPS SSL (Caddy Reverse Proxy)
Cocok untuk domain publik. Caddy akan secara otomatis menerbitkan dan memperbarui sertifikat SSL Let's Encrypt secara gratis tanpa konfigurasi sertifikat manual!

1. Pastikan DNS Record domain Anda (tipe `A`) sudah diarahkan ke alamat IP publik VPS.
2. Pastikan port 80 dan 443 terbuka di firewall VPS:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```
3. Jalankan skrip dengan mode `prod`:
   ```bash
   ./scripts/deploy-docker.sh prod
   # Atau secara manual:
   docker compose -f docker-compose.prod.yml up -d --build
   ```
Aplikasi kini dapat diakses dengan protokol terenkripsi di `https://keuangan.domainanda.com`.

---

### Opsi C: Mode Traefik Reverse Proxy (Jika VPS Sudah Memiliki Traefik)
Gunakan opsi ini jika di VPS Anda sudah berjalan **Traefik** (mengelola port 80 & 443). Anda **tidak boleh** menjalankan Caddy agar tidak terjadi tabrakan port (*port collision*).

1. Pastikan DNS `A Record` untuk `inveys.io` dan `www.inveys.io` sudah mengarah ke IP publik VPS Anda.
2. Periksa nama Docker network yang digunakan oleh kontainer Traefik Anda:
   ```bash
   docker network ls
   ```
   *(Umumnya bernama `traefik_default`, `proxy`, atau `web`)*.
3. Jalankan kontainer INVEYS dengan konfigurasi Traefik:
   ```bash
   # Ganti TRAEFIK_NETWORK sesuai nama network Traefik Anda (default: traefik_default)
   TRAEFIK_NETWORK=traefik_default docker compose -f docker-compose.traefik.yml up -d --build
   ```
Traefik akan secara otomatis mendeteksi label Docker kontainer `inveys-app`, merouting hostname `inveys.io`, dan menerbitkan sertifikat SSL TLS HTTPS.

---

## 5. Pemeliharaan & Perintah Esensial

### 1. Memeriksa Status Kontainer & Healthcheck
```bash
docker ps -a
# Periksa health status:
docker inspect --format='{{json .State.Health.Status}}' inveys-app
```

### 2. Memantau Log Aplikasi Secara Real-time
```bash
docker compose logs -f inveys
# Atau untuk mode production Caddy:
docker compose -f docker-compose.prod.yml logs -f
```

### 3. Menghentikan atau Merestart Layanan
```bash
# Restart
docker compose restart
# Hentikan kontainer
docker compose down
```

---

## 6. Prosedur Cadangan & Pemulihan (*Backup & Restore*)

Karena data tersimpan di volume `inveys_vault_data` (`/data/inbox.sqlite3`), Anda dapat mencadangkan seluruh data finansial ke host VPS dalam satu baris:

### Membuat Cadangan Database:
```bash
docker run --rm -v inveys_vault_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/inveys-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### Memulihkan Cadangan (*Restore*):
```bash
docker run --rm -v inveys_vault_data:/data -v $(pwd):/backup alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/inveys-backup-20261018.tar.gz -C /data"
```

---

## 7. Pembaruan Versi 1-Klik (*Zero-Downtime Update*)

Jika ada rilis kode baru di repositori GitHub, cukup jalankan skrip deploy kembali:

```bash
cd INVYES
./scripts/deploy-docker.sh
# Atau untuk mode production:
./scripts/deploy-docker.sh prod
```

Skrip ini akan secara otomatis:
1. Melakukan `git pull` untuk menarik versi terbaru.
2. Membangun ulang gambar Docker dengan aset terkompilasi baru.
3. Melakukan *rolling restart* kontainer tanpa merusak atau menghapus database `inbox.sqlite3`.
