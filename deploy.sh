#!/usr/bin/env bash
# deploy.sh — FilePro one-command VPS setup for Hostinger Ubuntu 22.04
# Usage: sudo bash deploy.sh yourdomain.com your@email.com
set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────
DOMAIN="${1:-}"
EMAIL="${2:-}"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Usage: sudo bash deploy.sh yourdomain.com your@email.com"
  exit 1
fi

echo ""
echo "================================================"
echo "  FilePro deploy → $DOMAIN"
echo "================================================"
echo ""

# ── 1. System packages ─────────────────────────────────────────────────────────
echo "[1/7] Installing system dependencies..."
apt-get update -qq
apt-get install -y -qq curl git certbot ufw

# ── 2. Docker ─────────────────────────────────────────────────────────────────
echo "[2/7] Installing Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | bash
fi
if ! command -v docker &>/dev/null; then
  apt-get install -y -qq docker.io
fi
# Install Docker Compose plugin (v2)
if ! docker compose version &>/dev/null 2>&1; then
  apt-get install -y -qq docker-compose-plugin || \
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
      -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
fi

# ── 3. Firewall ────────────────────────────────────────────────────────────────
echo "[3/7] Configuring firewall..."
ufw --force enable
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp

# ── 4. SSL certificate ─────────────────────────────────────────────────────────
echo "[4/7] Obtaining SSL certificate for $DOMAIN..."
mkdir -p /var/www/certbot

# Stop anything using port 80 before standalone certbot
docker ps -q --filter "name=filepro-nginx" | xargs -r docker stop || true

certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" || {
    echo ""
    echo "WARNING: certbot failed. This is usually because:"
    echo "  - DNS A record for $DOMAIN doesn't point to this server yet"
    echo "  - Port 80 is blocked by Hostinger firewall rules"
    echo ""
    echo "Fix DNS/firewall, then re-run:  certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN"
    echo "Then restart services:          DOMAIN=$DOMAIN docker compose up -d"
    echo ""
    echo "Continuing without SSL for now (HTTP only)..."
    SSL_FAILED=1
  }

# ── 5. Nginx config — replace DOMAIN placeholder ──────────────────────────────
echo "[5/7] Configuring Nginx..."
sed -i "s/DOMAIN/$DOMAIN/g" nginx/nginx.conf

if [[ "${SSL_FAILED:-0}" == "1" ]]; then
  # Temporarily serve HTTP only (no redirect, no TLS blocks)
  cat > nginx/nginx.conf <<NGINX
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    client_max_body_size 510M;
    upstream frontend { server frontend:3000; }
    upstream backend  { server backend:5000;  }
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_read_timeout 300s;
        }
        location /api/health { proxy_pass http://backend; access_log off; }
    }
}
NGINX
fi

# ── 6. Environment files ───────────────────────────────────────────────────────
echo "[6/7] Setting up environment files..."

if [[ ! -f backend/.env ]]; then
  cp backend/.env.example backend/.env
  # Set domain-specific values
  sed -i "s|yourdomain.com|$DOMAIN|g" backend/.env

  # Generate a random Redis password and JWT secret
  REDIS_PASS=$(openssl rand -hex 24)
  sed -i "s|changeme_redis_password|$REDIS_PASS|g" backend/.env
  echo "REDIS_PASSWORD=$REDIS_PASS" >> backend/.env
fi

if [[ ! -f frontend/.env ]]; then
  cp frontend/.env.example frontend/.env
  sed -i "s|yourdomain.com|$DOMAIN|g" frontend/.env
fi

# Export DOMAIN and REDIS_PASSWORD for docker-compose
REDIS_PASSWORD=$(grep REDIS_PASSWORD backend/.env | cut -d= -f2 | head -1)
export DOMAIN REDIS_PASSWORD

# ── 7. Build & start ───────────────────────────────────────────────────────────
echo "[7/7] Building and starting containers..."

# Try docker compose (v2) first, fall back to docker-compose (v1)
if docker compose version &>/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

DOMAIN=$DOMAIN REDIS_PASSWORD=$REDIS_PASSWORD $COMPOSE up -d --build

# ── Auto-renew SSL ─────────────────────────────────────────────────────────────
CRON_LINE="0 3 * * * certbot renew --quiet && $COMPOSE -f $(pwd)/docker-compose.yml restart nginx"
( crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_LINE" ) | crontab -

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "================================================"
echo "  Deploy complete!"
echo "================================================"
echo ""
echo "  Site:    https://$DOMAIN"
echo "  Health:  https://$DOMAIN/api/health"
echo ""
echo "  Useful commands:"
echo "    View logs:    DOMAIN=$DOMAIN $COMPOSE logs -f"
echo "    Restart all:  DOMAIN=$DOMAIN $COMPOSE restart"
echo "    Update app:   git pull && DOMAIN=$DOMAIN $COMPOSE up -d --build"
echo ""
if [[ "${SSL_FAILED:-0}" == "1" ]]; then
  echo "  NOTE: SSL setup failed. Fix DNS first, then run:"
  echo "    certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN"
  echo "    cp nginx/nginx.conf.bak nginx/nginx.conf  (or restore the SSL version)"
  echo "    DOMAIN=$DOMAIN $COMPOSE restart nginx"
  echo ""
fi
