# RideWire AI Hub - Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables Reference](#environment-variables-reference)
4. [Database Setup](#database-setup)
5. [Production Deployment Options](#production-deployment-options)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive instructions for deploying RideWire AI Hub in both development and production environments. The platform supports multiple deployment strategies from simple single-server setups to scalable cloud deployments.

### System Requirements

**Minimum Requirements:**
- Node.js 16+ (18+ recommended)
- PostgreSQL 12+ (14+ recommended)
- 2GB RAM (4GB+ for production)
- 10GB disk space (50GB+ for production with media)
- HTTPS-capable domain (production only)

**Recommended Requirements:**
- Node.js 18 LTS
- PostgreSQL 14+
- 4GB+ RAM
- 50GB+ SSD storage
- CDN for static assets

---

## Local Development Setup

### Step 1: Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version
node --version  # Should be 16.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check PostgreSQL
psql --version  # Should be 12.x or higher
```

### Step 2: Clone Repository

```bash
git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
cd ridewire-ai-hub
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs all required packages:
- express (web server)
- pg (PostgreSQL client)
- jsonwebtoken (JWT authentication)
- bcrypt (password hashing)
- dotenv (environment variables)
- react & react-dom (frontend)
- And more...

### Step 4: Configure Environment

Create your environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Database Configuration
DATABASE_URL=postgres://username:password@localhost:5432/ridewire

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# AI Provider API Keys
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GOOGLE_API_KEY=your-google-api-key-here

# Payment Integration (optional for development)
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key

# Gumroad (optional for development)
GUMROAD_ACCESS_TOKEN=your-gumroad-token
```

### Step 5: Database Initialization

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ridewire;

# Create user (optional)
CREATE USER ridewire_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ridewire TO ridewire_user;

# Exit psql
\q
```

#### Run Schema

```bash
# Method 1: Using psql
psql -U postgres -d ridewire -f schema.sql

# Method 2: Using npm script
npm run db:init
```

#### Verify Tables

```bash
psql -U postgres -d ridewire -c "\dt"
```

You should see:
- users
- messages
- game_states
- diagnostic_events
- marketplace_listings
- revenue_events
- payout_queue
- notifications

### Step 6: Start Development Server

**Backend Only:**

```bash
npm start
```

Server will start on `http://localhost:3000`

**Full Stack (Backend + Frontend with Hot Reload):**

```bash
npm run dev
```

This starts:
- Backend server on port 3000
- Webpack dev server on port 3001 (configured in webpack.config.js)

### Step 7: Verify Installation

Open your browser and test:

1. **Landing Page**: http://localhost:3000
2. **Registration**: http://localhost:3000/register
3. **Login**: http://localhost:3000/login
4. **API Health**: http://localhost:3000/api/dashboard/pricing

You should see the RideWire AI Hub interface.

### Step 8: Create Test User

Using the web interface:
1. Navigate to http://localhost:3000/register
2. Enter email and password
3. Click "Register"
4. You'll be auto-logged in and redirected to dashboard

Or using curl:

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/ridewire` | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT signing | `your_random_secret_key` | ✅ Yes |
| `PORT` | Server port | `3000` | ✅ Yes |
| `NODE_ENV` | Environment mode | `development` or `production` | ✅ Yes |

### AI Provider Keys

| Variable | Description | Where to Get | Required |
|----------|-------------|--------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | https://platform.openai.com/api-keys | ✅ Yes |
| `ANTHROPIC_API_KEY` | Anthropic (Claude) API key | https://console.anthropic.com/keys | ✅ Yes |
| `GOOGLE_API_KEY` | Google (Gemini) API key | https://makersuite.google.com/app/apikey | ✅ Yes |

### Payment Integration (Optional)

| Variable | Description | Where to Get | Required |
|----------|-------------|--------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | https://dashboard.stripe.com/apikeys | ❌ No |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | https://dashboard.stripe.com/apikeys | ❌ No |
| `GUMROAD_ACCESS_TOKEN` | Gumroad API token | https://gumroad.com/settings/advanced | ❌ No |

### Automation (Optional)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `AUTOMATION_ACTIVE` | Enable automation features | `false` | ❌ No |
| `COCO_ENABLED` | Enable COCO content generation | `false` | ❌ No |
| `GUMROAD_SYNC_ENABLED` | Enable Gumroad sync | `false` | ❌ No |

### Generating Secure Secrets

**JWT Secret:**
```bash
# Generate random secret
openssl rand -base64 32
```

**Strong Password:**
```bash
# Generate random password
openssl rand -base64 24
```

---

## Database Setup

### PostgreSQL Configuration

#### Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download installer from https://www.postgresql.org/download/windows/

#### Configuration

Edit PostgreSQL configuration for better performance:

```bash
# Ubuntu/Debian
sudo nano /etc/postgresql/14/main/postgresql.conf

# macOS
nano /usr/local/var/postgres/postgresql.conf
```

Recommended settings for development:

```conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
```

### Schema Details

The database schema includes:

#### Core Tables

**users** - User authentication and profiles
- Stores email, bcrypt password hash, subscription tier
- Indexes on email for fast lookup

**messages** - Encrypted message storage
- Stores encrypted user messages with nonces and salts
- Compound index on (user_id, session_id)
- Timestamp index for chronological queries

**game_states** - Gamification data
- User levels, XP, achievements
- JSONB columns for flexible achievement tracking

**diagnostic_events** - Query history
- Complete diagnostic query and consensus data
- JSONB columns for flexible schema

**marketplace_listings** - E-commerce products
- Product catalog for marketplace features
- Indexes on seller_id, status, price

**revenue_events** - Payment tracking
- All revenue transactions
- Supports subscriptions and one-time purchases

### Backup and Restore

#### Automated Backups

Create backup script:

```bash
#!/bin/bash
# File: /opt/scripts/backup-ridewire.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/ridewire"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_$DATE.sql"

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

Make executable:
```bash
chmod +x /opt/scripts/backup-ridewire.sh
```

Schedule with cron (daily at 2am):
```bash
crontab -e
# Add line:
0 2 * * * /opt/scripts/backup-ridewire.sh
```

#### Manual Backup

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Compressed backup
pg_dump $DATABASE_URL | gzip > backup.sql.gz

# Backup specific tables
pg_dump -t users -t messages $DATABASE_URL > backup_partial.sql
```

#### Restore

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Restore from compressed backup
gunzip < backup.sql.gz | psql $DATABASE_URL
```

### Database Migrations

For schema changes, create migration files:

```sql
-- migrations/001_add_user_avatar.sql
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);

-- migrations/002_add_message_metadata.sql
ALTER TABLE messages ADD COLUMN metadata JSONB DEFAULT '{}';
```

Apply migrations:
```bash
psql $DATABASE_URL -f migrations/001_add_user_avatar.sql
psql $DATABASE_URL -f migrations/002_add_message_metadata.sql
```

---

## Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Best for**: Quick deployment, serverless architecture

#### Vercel (Frontend)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel deploy
   ```

3. **Configure Environment Variables** in Vercel dashboard:
   - `REACT_APP_API_URL` - Backend API URL
   - No backend variables needed on Vercel

#### Railway (Backend + Database)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize**:
   ```bash
   railway init
   ```

4. **Add PostgreSQL**:
   ```bash
   railway add postgresql
   ```

5. **Set Environment Variables**:
   ```bash
   railway variables set JWT_SECRET=your_secret
   railway variables set OPENAI_API_KEY=your_key
   # ... add all required variables
   ```

6. **Deploy**:
   ```bash
   railway up
   ```

7. **Get URL**:
   ```bash
   railway domain
   ```

**Pros**: Easy setup, automatic SSL, managed database  
**Cons**: Can be expensive at scale

---

### Option 2: Heroku

**Best for**: Established platform, good add-ons ecosystem

#### Steps

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create App**:
   ```bash
   heroku create ridewire-ai-hub
   ```

4. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set Environment Variables**:
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set ANTHROPIC_API_KEY=your_key
   heroku config:set GOOGLE_API_KEY=your_key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

7. **Open App**:
   ```bash
   heroku open
   ```

8. **View Logs**:
   ```bash
   heroku logs --tail
   ```

**Pros**: Simple deployment, good documentation, many add-ons  
**Cons**: More expensive than alternatives, limited free tier

---

### Option 3: DigitalOcean App Platform

**Best for**: Balance of simplicity and control

#### Steps

1. **Connect GitHub**:
   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Connect GitHub repository

2. **Configure Build**:
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`

3. **Add Database**:
   - Add PostgreSQL database component
   - Copy DATABASE_URL

4. **Set Environment Variables**:
   Add all required variables in the App Platform console

5. **Deploy**:
   - Review and deploy
   - Monitor build process

**Pros**: Predictable pricing, good performance, managed database  
**Cons**: Less flexible than raw VPS

---

### Option 4: Self-Hosted VPS (DigitalOcean/AWS/Linode)

**Best for**: Maximum control, cost optimization at scale

#### Server Setup (Ubuntu 22.04)

1. **Update System**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Install PostgreSQL**:
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   ```

4. **Create User**:
   ```bash
   sudo adduser ridewire
   sudo usermod -aG sudo ridewire
   ```

5. **Install Application**:
   ```bash
   sudo su - ridewire
   git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
   cd ridewire-ai-hub
   npm install --production
   ```

6. **Configure Environment**:
   ```bash
   cp .env.example .env
   nano .env
   # Add production values
   ```

7. **Setup Database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE ridewire_prod;
   CREATE USER ridewire WITH ENCRYPTED PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE ridewire_prod TO ridewire;
   \q
   
   psql -U ridewire -d ridewire_prod -f schema.sql
   ```

#### Process Manager (PM2)

1. **Install PM2**:
   ```bash
   sudo npm install -g pm2
   ```

2. **Start Application**:
   ```bash
   pm2 start server.js --name ridewire-hub
   ```

3. **Configure Startup**:
   ```bash
   pm2 startup systemd
   # Run the command it outputs
   pm2 save
   ```

4. **Monitor**:
   ```bash
   pm2 status
   pm2 logs ridewire-hub
   pm2 monit
   ```

#### Nginx Reverse Proxy

1. **Install Nginx**:
   ```bash
   sudo apt install nginx
   ```

2. **Configure**:
   ```bash
   sudo nano /etc/nginx/sites-available/ridewire
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ridewire /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

**Pros**: Full control, cost-effective at scale, flexible  
**Cons**: Requires server management, more setup time

---

## SSL/TLS Configuration

### Using Let's Encrypt (Free SSL)

**For Nginx:**

1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-Renewal**:
   Certbot automatically adds a cron job. Verify:
   ```bash
   sudo certbot renew --dry-run
   ```

**For Apache:**

1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-apache
   ```

2. **Obtain Certificate**:
   ```bash
   sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
   ```

### SSL Best Practices

**Nginx SSL Configuration:**

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Strong SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;

    # Other security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        # ... other proxy settings
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring and Logging

### Application Logs

**Using PM2:**

```bash
# View logs
pm2 logs ridewire-hub

# Save logs to file
pm2 logs ridewire-hub --out logs/out.log --error logs/error.log

# Clear logs
pm2 flush
```

**Using Node.js console:**

```javascript
// server.js
console.log('[INFO]', 'Server started on port', port);
console.error('[ERROR]', 'Database connection failed:', error);
console.warn('[WARN]', 'API rate limit exceeded for user:', userId);
```

### Database Monitoring

**Query Performance:**

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s
SELECT pg_reload_conf();

-- View slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Connection Monitoring:**

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
```

### Health Checks

Create health check endpoint:

```javascript
// server.js
app.get('/health', async (req, res) => {
  try {
    // Check database
    await pool.query('SELECT 1');
    
    // Check AI services (optional)
    const aiStatus = await checkAIServices();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      aiServices: aiStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### Monitoring Services

**Recommended Tools:**

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Application Monitoring**: New Relic, Datadog
- **Log Management**: Loggly, Papertrail
- **Error Tracking**: Sentry, Rollbar

**Example: Setting up Sentry:**

```bash
npm install @sentry/node
```

```javascript
// server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Fails

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

#### 2. Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

#### 3. JWT Token Invalid

**Symptoms:**
```
403 Forbidden: Invalid token
```

**Solutions:**
- Verify JWT_SECRET matches between client and server
- Check token hasn't expired (24h default)
- Clear browser localStorage and re-login
- Verify Authorization header format: `Bearer <token>`

#### 4. AI API Errors

**Symptoms:**
```
Error: OpenAI API error: 401 Unauthorized
```

**Solutions:**
```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check API quota/billing
# Visit provider dashboard
```

#### 5. npm install Fails

**Symptoms:**
```
Error: EACCES: permission denied
```

**Solutions:**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Performance Issues

#### Slow API Responses

**Diagnosis:**
```javascript
// Add timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

**Solutions:**
- Add database indexes
- Implement caching (Redis)
- Optimize AI queries (parallel execution)
- Use connection pooling
- Enable gzip compression

#### High Memory Usage

**Diagnosis:**
```bash
# Monitor memory
pm2 monit

# Node.js heap dump
node --inspect server.js
# Then use Chrome DevTools
```

**Solutions:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in PM2
pm2 start server.js --max-memory-restart 1G
```

### Security Issues

#### Suspected Security Breach

1. **Immediately**:
   - Rotate all API keys
   - Change JWT_SECRET
   - Force logout all users
   - Check logs for suspicious activity

2. **Investigation**:
   ```bash
   # Check access logs
   sudo tail -f /var/log/nginx/access.log
   
   # Check failed login attempts
   SELECT * FROM users WHERE last_login IS NULL;
   
   # Review database activity
   SELECT * FROM pg_stat_activity;
   ```

3. **Prevention**:
   - Enable 2FA
   - Implement rate limiting
   - Add IP whitelisting for admin
   - Regular security audits

---

## Production Checklist

Before deploying to production:

### Security
- [ ] All environment variables set correctly
- [ ] JWT_SECRET is strong and unique
- [ ] Database password is strong
- [ ] HTTPS enabled with valid SSL certificate
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] No sensitive data in logs
- [ ] Regular backups scheduled

### Performance
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Caching strategy implemented
- [ ] Gzip compression enabled
- [ ] Static assets on CDN (if applicable)

### Monitoring
- [ ] Health check endpoint working
- [ ] Error tracking configured
- [ ] Log management setup
- [ ] Uptime monitoring active
- [ ] Alert system configured

### Documentation
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Backup/restore procedures documented
- [ ] Incident response plan created

---

## Support & Resources

### Documentation
- **README**: [README.md](README.md)
- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)

### Community
- **GitHub Issues**: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues
- **GitHub Discussions**: https://github.com/STEPHENIESGEM/ridewire-ai-hub/discussions

### Contact
- **Technical Support**: support@stepheniesgem.io
- **General Inquiries**: hello@stepheniesgem.io
- **Security Issues**: security@stepheniesgem.io

---

**Document Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Maintained By**: Stephenie's Gem (STEPHENIESGEM)
