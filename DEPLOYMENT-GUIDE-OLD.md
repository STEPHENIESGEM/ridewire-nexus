# 🚀 RideWire AI Hub - Deployment Guide

## Overview

This guide walks through deploying the RideWire AI Hub automation infrastructure in production, including COCO AI content generation, Gumroad product management, and Indian Motorcycle partnership materials.

---

## Prerequisites

### System Requirements
- **Server**: Ubuntu 20.04+ or similar Linux distribution
- **Node.js**: v16.x or higher
- **PostgreSQL**: v12+ 
- **RAM**: Minimum 4GB, recommended 8GB
- **Disk**: Minimum 50GB for video storage
- **Network**: Stable internet with good upload speed for YouTube

### Required Accounts
1. **OpenAI** (ChatGPT) - https://platform.openai.com/
2. **Anthropic** (Claude) - https://console.anthropic.com/
3. **Google AI** (Gemini) - https://makersuite.google.com/
4. **ElevenLabs** (Voice) - https://elevenlabs.io/
5. **D-ID** (Avatar) - https://studio.d-id.com/
6. **YouTube** (Google Cloud Console) - https://console.cloud.google.com/
7. **Gumroad** - https://gumroad.com/
8. **Stripe** (Optional) - https://stripe.com/

---

## Step 1: Server Setup

### Clone Repository
```bash
git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
cd ridewire-ai-hub
```

### Install Dependencies
```bash
npm install --production
```

### Create Data Directories
```bash
mkdir -p data output/coco-videos assets/gumroad
chmod 755 data output assets
```

---

## Step 2: Environment Configuration

### Copy Production Environment Template
```bash
cp .env.production .env
chmod 600 .env  # Secure file permissions
```

### Configure All API Keys
Edit `.env` and replace all placeholder values:

#### Critical Settings (MUST CHANGE)
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `OPENAI_API_KEY` - From OpenAI dashboard
- `ELEVENLABS_API_KEY` - From ElevenLabs dashboard
- `DID_API_KEY` - From D-ID dashboard
- `YOUTUBE_CLIENT_ID` - From Google Cloud Console
- `YOUTUBE_CLIENT_SECRET` - From Google Cloud Console
- `GUMROAD_API_KEY` - From Gumroad settings

#### Email Settings
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`
- Configure your email provider (e.g., SendGrid, AWS SES, Gmail)

#### Security Settings
- `SESSION_SECRET` - Generate with: `openssl rand -base64 32`
- `CORS_ORIGIN` - Your production domain(s)

---

## Step 3: Database Setup

### Initialize PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ridewire_production;

# Create user
CREATE USER ridewire WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE ridewire_production TO ridewire;
```

### Run Schema
```bash
psql -U ridewire -d ridewire_production -f schema.sql
```

### Verify Tables
```bash
psql -U ridewire -d ridewire_production -c "\dt"
```

---

## Step 4: YouTube API Setup

### Enable YouTube Data API v3
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/oauth2callback`

### Get OAuth Tokens
```bash
# Run OAuth flow (first time only)
node scripts/coco/youtube-auth-setup.js

# Follow prompts to authorize
# Tokens will be saved to .env automatically
```

---

## Step 5: COCO AI Activation

### Initialize System
```bash
# Run activation script
./scripts/automation/activate-coco.sh

# This will:
# - Check environment
# - Create content calendar
# - Generate demo content
# - Initialize analytics
```

### Verify Setup
```bash
# Check calendar
node scripts/coco/content-calendar.js

# Check monitoring
node scripts/automation/coco-monitor.js

# View master control
node scripts/automation/master-control.js
```

---

## Step 6: Gumroad Product Setup

### Initialize Products
```bash
# Create product catalog
node scripts/gumroad/product-sync.js

# This creates 5 Tier 1 products
```

### Generate Product Assets
```bash
# Products are created as drafts
# Assets must be created manually:
# 1. PDFs for each product
# 2. Preview images
# 3. Marketing materials

# Place assets in: assets/gumroad/
```

### Sync to Gumroad
```bash
# Once assets are ready
node scripts/gumroad/product-sync.js

# Products will be created as drafts on Gumroad
# Manually publish through Gumroad dashboard
```

---

## Step 7: GitHub Actions Setup

### Add Repository Secrets
Go to: `https://github.com/STEPHENIESGEM/ridewire-ai-hub/settings/secrets/actions`

Add these secrets:
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `DID_API_KEY`
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_CHANNEL_ID`
- `GUMROAD_API_KEY`
- `DATABASE_URL`
- `JWT_SECRET`

### Enable Workflows
```bash
# Workflows are in .github/workflows/
# They will run automatically on schedule:
# - coco-content.yml: Mon/Wed/Fri 9am
# - daily-automation.yml: Daily 6am
# - health-check.yml: Hourly
```

### Test Workflows Manually
1. Go to Actions tab in GitHub
2. Select a workflow
3. Click "Run workflow"
4. Monitor execution

---

## Step 8: Production Server Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name ridewire-hub

# Configure startup
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs ridewire-hub
```

### Using systemd
```bash
# Create service file
sudo nano /etc/systemd/system/ridewire.service
```

Add:
```ini
[Unit]
Description=RideWire AI Hub
After=network.target

[Service]
Type=simple
User=ridewire
WorkingDirectory=/opt/ridewire-ai-hub
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable ridewire
sudo systemctl start ridewire
sudo systemctl status ridewire
```

---

## Step 9: Nginx Reverse Proxy (Optional but Recommended)

### Install Nginx
```bash
sudo apt install nginx
```

### Configure
```bash
sudo nano /etc/nginx/sites-available/ridewire
```

Add:
```nginx
server {
    listen 80;
    server_name ridewire.ai www.ridewire.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ridewire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ridewire.ai -d www.ridewire.ai
```

---

## Step 10: Monitoring & Maintenance

### Daily Checks
```bash
# Check system health
node scripts/automation/master-control.js

# View automation status
cat AUTOMATION_STATUS.md

# Check logs
pm2 logs ridewire-hub
# or
journalctl -u ridewire -f
```

### Weekly Tasks
- Review analytics reports
- Check revenue tracking
- Verify API usage/costs
- Review error logs
- Test backup restoration

### Monthly Tasks
- Rotate API keys
- Update dependencies: `npm update`
- Review and optimize pricing
- Analyze content performance
- Plan new product launches

---

## Step 11: Indian Motorcycle Demo Setup

### Prepare Demo Environment
```bash
# Run demo setup
./scripts/partnership/demo-setup.sh

# This creates demo scenarios and configures environment
```

### Test Demo
```bash
# Start server
npm start

# Open browser to http://localhost:3000
# Login with demo credentials
# Test all three scenarios
```

### Demo Checklist
- [ ] Review `indian-motorcycle-partnership/PARTNERSHIP-PROPOSAL.md`
- [ ] Study `indian-motorcycle-partnership/docs/demo-script.md`
- [ ] Test live demo with all scenarios
- [ ] Prepare backup slides
- [ ] Test screen sharing

---

## Troubleshooting

### COCO Content Generation Fails
```bash
# Check API keys
node -e "console.log(require('dotenv').config()); console.log(process.env.OPENAI_API_KEY)"

# Test OpenAI connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check logs
tail -f logs/coco-generation.log
```

### YouTube Upload Fails
```bash
# Verify OAuth tokens
node scripts/coco/youtube-uploader.js --test

# Re-authenticate
node scripts/coco/youtube-auth-setup.js

# Check quota
# Go to https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
```

### Gumroad Sync Issues
```bash
# Test API connection
curl -H "Authorization: Bearer $GUMROAD_API_KEY" \
  https://api.gumroad.com/v2/user

# Check product status
node scripts/gumroad/product-sync.js --stats
```

### Database Connection Issues
```bash
# Test connection
psql "$DATABASE_URL"

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

---

## Security Checklist

- [ ] All `.env` files have 600 permissions
- [ ] Database uses strong passwords
- [ ] JWT_SECRET is cryptographically random
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Firewall configured (UFW or iptables)
- [ ] SSH key authentication only (no password)
- [ ] API keys rotated every 90 days
- [ ] Regular security updates applied
- [ ] Backup encryption enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] No sensitive data in logs

---

## Performance Optimization

### Node.js
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

### Database
```bash
# Add indexes for common queries
psql -U ridewire -d ridewire_production

CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### Caching
- Consider adding Redis for session storage
- Cache AI responses when appropriate
- Use CDN for static assets

---

## Backup Strategy

### Automated Backups
```bash
# Create backup script
cat > /opt/scripts/backup-ridewire.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump "$DATABASE_URL" > /backups/ridewire_$DATE.sql
tar -czf /backups/ridewire_data_$DATE.tar.gz data/
find /backups -type f -mtime +30 -delete
EOF

chmod +x /opt/scripts/backup-ridewire.sh

# Add to cron
crontab -e
# Add: 0 2 * * * /opt/scripts/backup-ridewire.sh
```

### Test Restoration
```bash
# Regularly test backup restoration
psql -U ridewire -d ridewire_test < /backups/ridewire_YYYYMMDD.sql
```

---

## Support & Resources

### Documentation
- Main README: `README.md`
- API Documentation: `docs/API.md`
- Security Policy: `SECURITY.md`

### Community
- GitHub Issues: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues
- Email: hello@stepheniesgem.io

### Emergency Contacts
- Technical Lead: (contact information)
- DevOps: (contact information)
- Security: (contact information)

---

**Deployment Guide Version**: 1.0  
**Last Updated**: January 2026  
**For**: RideWire AI Hub Production Deployment

© 2026 RideWire AI Hub. All rights reserved.
