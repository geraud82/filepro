# FilePro Deployment Guide

## Prerequisites

Before deploying FilePro, ensure you have:

- **Node.js** 18+ LTS installed
- **Docker** and **Docker Compose** installed
- **Git** for version control
- A **VPS** with Ubuntu 22.04 (minimum 2GB RAM, 20GB storage)
- A **domain name** (for production deployment)
- **Stripe account** for payment processing (optional)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
cd FilePro

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start Services Locally

#### Option A: Using Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Redis: localhost:6379

#### Option B: Manual Setup

**Terminal 1 - Redis:**
```bash
redis-server
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Worker:**
```bash
cd backend
npm run worker
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

## Production Deployment on VPS

### Step 1: Prepare Your VPS

```bash
# Connect to your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install Node.js (optional, for manual setup)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install system dependencies
apt install -y ffmpeg ghostscript libreoffice
```

### Step 2: Clone Repository

```bash
# Create application directory
mkdir -p /var/www
cd /var/www

# Clone repository
git clone <your-repo-url> filepro
cd filepro
```

### Step 3: Configure Environment Variables

```bash
# Backend configuration
cd backend
cp .env.example .env
nano .env
```

Update the following in `backend/.env`:
```env
NODE_ENV=production
PORT=5000
REDIS_HOST=redis
REDIS_PORT=6379

# File storage limits
MAX_FILE_SIZE_FREE=20971520
MAX_FILE_SIZE_PREMIUM=524288000

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
JWT_SECRET=your_very_secure_random_string

# Frontend URL
FRONTEND_URL=https://yourdomain.com
API_BASE_URL=https://yourdomain.com
```

```bash
# Frontend configuration
cd ../frontend
cp .env.example .env
nano .env
```

Update `frontend/.env`:
```env
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

### Step 4: Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be saved to:
# /etc/letsencrypt/live/yourdomain.com/
```

Update `nginx/nginx.conf` to uncomment SSL configuration and update paths.

### Step 5: Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### Step 6: Setup Auto-Renewal for SSL

```bash
# Test renewal
certbot renew --dry-run

# Add cron job for auto-renewal
crontab -e

# Add this line:
0 3 * * * certbot renew --quiet && docker-compose restart nginx
```

### Step 7: Verify Deployment

```bash
# Check if services are running
docker-compose ps

# Test backend API
curl http://localhost:5000/health

# Test Redis connection
docker exec -it filepro-redis redis-cli ping
```

## Domain Configuration

### DNS Settings

Add these DNS records to your domain:

```
Type    Name    Value               TTL
A       @       your-vps-ip         3600
A       www     your-vps-ip         3600
```

### Nginx Configuration

Update `nginx/nginx.conf` server_name:

```nginx
server_name yourdomain.com www.yourdomain.com;
```

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f worker
docker-compose logs -f frontend

# Backend application logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart worker
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Cleanup Old Files

Files are automatically deleted after 1 hour, but you can manually clean up:

```bash
# Clean old uploads
find backend/uploads -type f -mtime +1 -delete

# Clean old outputs
find backend/outputs -type f -mtime +1 -delete
```

### Database Backup (Redis)

```bash
# Backup Redis data
docker exec filepro-redis redis-cli BGSAVE

# Copy backup
docker cp filepro-redis:/data/dump.rdb ./backup-$(date +%Y%m%d).rdb
```

## Performance Optimization

### Increase Worker Concurrency

Edit `backend/src/workers/processor.js`:

```javascript
concurrency: 10, // Increase based on server resources
```

### Enable Redis Persistence

Already configured in `docker-compose.yml`:

```yaml
command: redis-server --appendonly yes
```

### Optimize Nginx

Already included in `nginx/nginx.conf`:
- Gzip compression
- File size limits (500MB)
- Connection timeouts

## Troubleshooting

### Service Won't Start

```bash
# Check Docker logs
docker-compose logs backend

# Check if ports are in use
netstat -tlnp | grep :5000
netstat -tlnp | grep :3000
```

### File Processing Fails

```bash
# Check worker logs
docker-compose logs worker

# Verify dependencies are installed
docker exec -it filepro-backend ffmpeg -version
docker exec -it filepro-backend gs --version
docker exec -it filepro-backend soffice --version
```

### Redis Connection Issues

```bash
# Test Redis connection
docker exec -it filepro-redis redis-cli ping

# Check Redis logs
docker-compose logs redis
```

### High Memory Usage

```bash
# Check Docker resource usage
docker stats

# Limit container memory in docker-compose.yml
services:
  backend:
    mem_limit: 1g
```

## Security Checklist

- ✅ HTTPS enabled with valid SSL certificate
- ✅ Environment variables configured (no sensitive data in code)
- ✅ File size limits enforced
- ✅ Rate limiting enabled
- ✅ Files automatically deleted after 1 hour
- ✅ CORS configured for frontend domain only
- ✅ Helmet.js security headers enabled
- ✅ Redis password set (optional but recommended)

### Set Redis Password

Update `docker-compose.yml`:

```yaml
redis:
  command: redis-server --requirepass your_redis_password --appendonly yes
```

Update backend `.env`:

```env
REDIS_PASSWORD=your_redis_password
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or cloud load balancer
2. **Multiple Workers**: Scale worker containers
3. **Shared Storage**: Use NFS or S3 for file storage
4. **Redis Cluster**: For high availability

### Vertical Scaling

1. **Increase RAM**: 4GB+ recommended for heavy usage
2. **More CPU Cores**: Improves concurrent processing
3. **SSD Storage**: Faster file operations

## Backup Strategy

### Daily Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d)

# Backup Redis
docker exec filepro-redis redis-cli BGSAVE
docker cp filepro-redis:/data/dump.rdb $BACKUP_DIR/redis-$DATE.rdb

# Backup environment files
cp backend/.env $BACKUP_DIR/backend-env-$DATE
cp frontend/.env $BACKUP_DIR/frontend-env-$DATE

# Remove old backups (keep 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete
```

### Cron Job

```bash
crontab -e

# Add:
0 2 * * * /var/www/filepro/backup.sh
```

## Support and Maintenance

### Health Check Endpoints

- Backend: `https://yourdomain.com/health`
- Returns: `{"status":"ok","timestamp":"..."}`

### Monitoring Tools (Optional)

- **PM2**: Process manager for Node.js
- **Uptime Robot**: External monitoring
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring

## Cost Estimation

### VPS Requirements

- **Basic**: 2GB RAM, 2 CPU, 50GB storage - $10-15/month
- **Recommended**: 4GB RAM, 2 CPU, 80GB storage - $20-30/month
- **Production**: 8GB RAM, 4 CPU, 160GB storage - $40-60/month

### Additional Costs

- Domain: $10-15/year
- SSL: Free (Let's Encrypt)
- Stripe: 2.9% + $0.30 per transaction
- Backup storage: Optional

## Next Steps

1. ✅ Complete setup and test locally
2. ✅ Deploy to staging environment
3. ✅ Test all features thoroughly
4. ✅ Configure domain and SSL
5. ✅ Deploy to production
6. ✅ Setup monitoring and backups
7. ✅ Configure Stripe for payments
8. ✅ Add Google AdSense
9. ✅ Submit sitemap to search engines
10. ✅ Monitor and optimize performance

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review documentation
- Check GitHub issues (if applicable)

---

**Last Updated**: January 2026
