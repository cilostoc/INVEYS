#!/usr/bin/env bash
# ==============================================================================
# INVEYS Automated Docker Deployment & Update Script for VPS
# Compatible with Ubuntu 20.04/22.04/24.04 LTS, Debian, Hostinger KVM, etc.
# ==============================================================================

set -e

# ANSI Color Codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=====================================================${NC}"
echo -e "${CYAN}    INVEYS Docker VPS Deployment & Update Pipeline   ${NC}"
echo -e "${CYAN}=====================================================${NC}"

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

# 1. Check Docker Installation
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker belum terpasang di sistem ini.${NC}"
    echo -e "Silakan instal Docker terlebih dahulu dengan perintah:"
    echo -e "${YELLOW}curl -fsSL https://get.docker.com | sh${NC}"
    exit 1
fi

# Check Docker Compose (plugin or standalone)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo -e "${RED}[ERROR] Docker Compose belum terpasang.${NC}"
    exit 1
fi

echo -e "${GREEN}[✓] Docker Engine & Compose terdeteksi.${NC}"

# 2. Check or Create .env configuration
if [ ! -f .env ]; then
    echo -e "${YELLOW}[!] Berkas .env tidak ditemukan. Menyalin dari .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}[✓] Berkas .env berhasil dibuat. Silakan sesuaikan isinya jika diperlukan.${NC}"
fi

# 3. Mode Selection (Default: Standalone or Production with Caddy)
DEPLOY_MODE="${1:-standalone}"
COMPOSE_FILE="docker-compose.yml"

if [ "$DEPLOY_MODE" == "prod" ] || [ "$DEPLOY_MODE" == "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo -e "${CYAN}[i] Menjalankan mode: Production HTTPS (Caddy Reverse Proxy)${NC}"
else
    echo -e "${CYAN}[i] Menjalankan mode: Standalone HTTP (Port 3000)${NC}"
fi

# 4. Git pull latest changes if inside a git repository
if [ -d .git ] && command -v git &> /dev/null; then
    echo -e "${CYAN}[i] Memeriksa pembaruan kode dari repositori Git...${NC}"
    git pull --ff-only || echo -e "${YELLOW}[!] Gagal git pull (mungkin ada local edits). Melanjutkan build...${NC}"
fi

# 5. Build and Deploy Container
echo -e "${CYAN}[i] Memulai proses kompilasi image dan startup kontainer...${NC}"
$DOCKER_COMPOSE -f "$COMPOSE_FILE" build --pull
$DOCKER_COMPOSE -f "$COMPOSE_FILE" up -d

# 6. Wait and Verify Healthcheck
echo -e "${CYAN}[i] Menunggu status kesiapan kontainer (Healthcheck)...${NC}"
ATTEMPTS=0
MAX_ATTEMPTS=12
HEALTHY=false

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    STATUS=$(docker inspect --format='{{json .State.Health.Status}}' inveys-app 2>/dev/null || echo '"unknown"')
    if [ "$STATUS" == '"healthy"' ]; then
        HEALTHY=true
        break
    fi
    echo -n "."
    sleep 3
    ATTEMPTS=$((ATTEMPTS+1))
done
echo ""

if [ "$HEALTHY" = true ]; then
    echo -e "${GREEN}=====================================================${NC}"
    echo -e "${GREEN}    [SUKSES] Kontainer INVEYS Berjalan & Sehat!     ${NC}"
    echo -e "${GREEN}=====================================================${NC}"
    if [ "$DEPLOY_MODE" == "prod" ] || [ "$DEPLOY_MODE" == "production" ]; then
        echo -e "Aplikasi dapat diakses dengan aman di:"
        echo -e "  1. Domain Resmi : ${CYAN}https://${DOMAIN:-inveys.io}${NC}"
        echo -e "  2. VPS Direct IP: ${CYAN}https://${SERVER_IP:-187.77.134.249}:3000${NC}"
    else
        echo -e "Aplikasi dapat diakses di: ${CYAN}http://IP-VPS-ANDA:3000${NC} atau ${CYAN}http://localhost:3000${NC}"
    fi
    echo -e "Volume Database Persisten: ${YELLOW}inveys_vault_data${NC} (Tersimpan aman di host Docker)"
    echo -e "Periksa logs kontainer kapan saja dengan: ${YELLOW}$DOCKER_COMPOSE -f $COMPOSE_FILE logs -f${NC}"
else
    echo -e "${YELLOW}[PERINGATAN] Kontainer berjalan tetapi healthcheck belum berstatus 'healthy'.${NC}"
    echo -e "Periksa log dengan perintah: ${YELLOW}$DOCKER_COMPOSE -f $COMPOSE_FILE logs${NC}"
fi
