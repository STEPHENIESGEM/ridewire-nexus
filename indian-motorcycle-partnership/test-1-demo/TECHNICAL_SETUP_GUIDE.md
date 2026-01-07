# Technical Setup Guide - Indian Motorcycle Shop Demo
## RideWire AI Hub On-Site Configuration

---

## Prerequisites

### Hardware Requirements
- **Laptop/Tablet:** Minimum Intel i5 or equivalent, 8GB RAM
- **Display:** 13" or larger screen (15" recommended for shop visibility)
- **Internet:** Stable connection with 5+ Mbps (mobile hotspot as backup)
- **Power:** Fully charged battery + charger/power bank
- **Optional:** External monitor for larger audience viewing

### Software Requirements
- **Node.js:** Version 16+ installed
- **PostgreSQL:** Version 12+ (or remote database access)
- **Web Browser:** Chrome, Firefox, or Edge (latest version)
- **Operating System:** Windows 10+, macOS 11+, or Linux

### Account Requirements
- **RideWire Demo Account:** Pre-configured user account
- **API Keys:** Active keys for OpenAI, Anthropic, Google Gemini
- **Database Access:** Connection string for demo database
- **JWT Secret:** Configured for authentication

---

## Pre-Departure Setup (Complete at Home/Office)

### Step 1: Clone and Install RideWire

```bash
# Clone repository (if not already done)
git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
cd ridewire-ai-hub

# Install dependencies
npm install

# Verify installation
npm --version
node --version
```

### Step 2: Configure Environment Variables

Create `.env` file in root directory:

```bash
# Copy template
cp .env.example .env

# Edit .env with demo credentials
nano .env
```

**Required environment variables:**

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/ridewire_demo

# JWT Authentication
JWT_SECRET=your_secure_random_secret_here

# AI API Keys (DEMO KEYS - Replace with production for live demo)
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GOOGLE_API_KEY=your-google-gemini-key-here

# Server Configuration
PORT=3000
NODE_ENV=production

# Encryption Keys (for message encryption)
ENCRYPTION_KEY=your_32_byte_hex_encryption_key_here
```

### Step 3: Initialize Database

```bash
# Create database schema (if using local PostgreSQL)
psql -U postgres -d ridewire_demo -f schema.sql

# Or use npm script
npm run db:init
```

**Verify database tables exist:**

```sql
-- Connect to database
psql -U postgres -d ridewire_demo

-- List tables
\dt

-- Should show:
-- users
-- messages
-- queries
-- consensus_results
```

### Step 4: Create Demo User Account

```bash
# Start server temporarily
npm start

# In another terminal, create demo user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@indian-motorcycle.com",
    "password": "IndianDemo2026!"
  }'
```

**Save credentials securely:**
- Email: `demo@indian-motorcycle.com`
- Password: `IndianDemo2026!`

### Step 5: Pre-Load Demo Queries

Create sample diagnostic queries to show immediate results:

```bash
# Login to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@indian-motorcycle.com",
    "password": "IndianDemo2026!"
  }'

# Save the returned token
TOKEN="your_jwt_token_here"

# Submit sample queries
curl -X POST http://localhost:3000/api/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Indian Scout Bobber 2021 - Code P0131 O2 sensor low voltage. Possible causes?"
  }'
```

### Step 6: Test Multi-AI Orchestrator

```bash
# Run test query to verify all AI APIs are working
node -e "
const orchestrator = require('./multiAIOrchestrator.js');
const testQuery = 'Test Indian Scout diagnostic';
orchestrator.queryAllAgents(testQuery, 'test-session')
  .then(result => console.log('AI Test Success:', result))
  .catch(err => console.error('AI Test Failed:', err));
"
```

**Expected output:**
- ChatGPT response received
- Claude response received
- Gemini response received
- Consensus calculated

### Step 7: Backup Materials Preparation

```bash
# Create offline backup folder
mkdir -p /tmp/indian-demo-backup

# Copy essential files
cp -r frontend /tmp/indian-demo-backup/
cp server.js multiAIOrchestrator.js encryption.js /tmp/indian-demo-backup/
cp .env /tmp/indian-demo-backup/.env.backup

# Create demo video/screenshots (if possible)
# Store in /tmp/indian-demo-backup/media/
```

---

## On-Site Setup (15 Minutes Before Demo)

### Step 1: Physical Setup

1. **Find suitable location:**
   - Near power outlet
   - Good Wi-Fi signal or use mobile hotspot
   - Visible screen angle for audience
   - Quiet enough to present

2. **Connect equipment:**
   - Plug in laptop/charger
   - Connect to internet (test speed)
   - External monitor if available
   - Close unnecessary applications

3. **Test audio/visual:**
   - Adjust screen brightness for shop lighting
   - Test audio if playing demo video
   - Ensure no glare on screen

### Step 2: Internet Connection

**Option A: Shop Wi-Fi (Preferred)**

```bash
# Test connection speed
curl -o /dev/null -s -w "Download: %{speed_download} bytes/sec\n" \
  https://www.google.com

# Should be at least 500,000 bytes/sec (5 Mbps)
```

**Option B: Mobile Hotspot (Backup)**

1. Enable hotspot on phone
2. Connect laptop to hotspot
3. Verify internet access
4. Monitor data usage if limited plan

**Test connectivity to AI APIs:**

```bash
# Test OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Test Anthropic (Claude)
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY"

# Should receive valid responses (not errors)
```

### Step 3: Start RideWire Server

```bash
# Navigate to project directory
cd /path/to/ridewire-ai-hub

# Start server in production mode
NODE_ENV=production npm start

# Verify server is running
curl http://localhost:3000/health
# Should return: {"status":"ok"}
```

**Keep terminal open to monitor logs during demo.**

### Step 4: Open Dashboard in Browser

1. Open Chrome/Firefox (incognito mode recommended)
2. Navigate to: `http://localhost:3000/dashboard`
3. Login with demo credentials:
   - Email: `demo@indian-motorcycle.com`
   - Password: `IndianDemo2026!`
4. Verify dashboard loads correctly

### Step 5: Pre-Load Demo State

**Open multiple browser tabs:**

1. **Tab 1:** Dashboard (`/dashboard`)
2. **Tab 2:** Chat interface (`/chat`)
3. **Tab 3:** Pricing page (`/pricing`)
4. **Tab 4:** Technical docs (this guide, for reference)

**In chat tab, prepare sample queries:**

```
1. "Indian Scout Bobber 2021 - Code P0131 O2 sensor low voltage. Possible causes?"
2. "Indian Chief Dark Horse - Intermittent stalling at idle. Fuel pump or IAC valve?"
3. "Indian Challenger - ABS warning light on after brake fluid change. Reset procedure?"
```

**Have these ready to paste quickly.**

### Step 6: Final Checklist

- [ ] Server running without errors
- [ ] Dashboard accessible and logged in
- [ ] Chat interface loads
- [ ] Internet connection stable
- [ ] API keys valid (test one query)
- [ ] Backup materials accessible
- [ ] Browser notifications silenced
- [ ] Unnecessary tabs/windows closed
- [ ] Full screen or zoom adjusted for visibility

---

## During Demo: Technical Management

### Monitoring Server Health

**Keep terminal visible (minimize but accessible):**

```bash
# Watch server logs in real-time
tail -f server.log

# Check for errors
grep -i error server.log | tail -20
```

### Running Live Queries

**Best practices during demo:**

1. **Use clear, descriptive queries:** Mention Indian model, year, symptoms
2. **Wait for full responses:** Don't interrupt AI thinking
3. **Show consensus panel:** Highlight agreement between AIs
4. **Explain confidence scores:** Higher = more agreement
5. **Show message encryption:** Point out security indicators

### Handling Technical Issues

**If query fails:**

```bash
# Check API rate limits
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -I | grep -i rate

# Retry query with error handling
# Have backup cached responses ready
```

**If server crashes:**

```bash
# Quick restart
npm start

# Or reload from backup
cd /tmp/indian-demo-backup
npm start
```

**If internet drops:**

- Switch to mobile hotspot immediately
- Show pre-recorded video/screenshots
- Focus on printed materials
- Offer to do remote follow-up demo

---

## Post-Demo: Technical Cleanup

### Save Demo Data

```bash
# Export demo queries for analysis
psql -U postgres -d ridewire_demo -c \
  "COPY (SELECT * FROM messages WHERE created_at > '2026-01-07') TO '/tmp/demo-queries.csv' CSV HEADER;"

# Export consensus results
psql -U postgres -d ridewire_demo -c \
  "COPY (SELECT * FROM consensus_results WHERE created_at > '2026-01-07') TO '/tmp/demo-consensus.csv' CSV HEADER;"
```

### Review Server Logs

```bash
# Check for errors during demo
grep -i error server.log > demo-errors.log

# Check API call statistics
grep "API call" server.log | wc -l  # Count total API calls
grep "ChatGPT" server.log | wc -l  # Count ChatGPT calls
grep "Claude" server.log | wc -l    # Count Claude calls
grep "Gemini" server.log | wc -l    # Count Gemini calls
```

### Shutdown Gracefully

```bash
# Stop server (Ctrl+C in terminal)
# Or if running as background process:
pkill -f "node server.js"

# Close database connections
# Clear sensitive data from browser cache
```

---

## Troubleshooting Guide

### Problem: "Cannot connect to database"

**Symptoms:** Server won't start, database errors in logs

**Solutions:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in .env
3. Test connection: `psql -U postgres -d ridewire_demo -c "SELECT 1;"`
4. Use remote database as backup (cloud-hosted)

### Problem: "API key invalid or rate limited"

**Symptoms:** AI responses fail, 401/429 errors in logs

**Solutions:**
1. Verify API keys are correct in .env
2. Check API usage limits in provider dashboards
3. Use cached demo responses as fallback
4. Have backup API keys ready (different account)

### Problem: "Server runs but dashboard won't load"

**Symptoms:** localhost:3000 unreachable, blank page

**Solutions:**
1. Check firewall settings
2. Try different port: `PORT=3001 npm start`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito mode
5. Check if other process using port 3000: `lsof -i :3000`

### Problem: "Slow query responses"

**Symptoms:** AI responses take 10+ seconds

**Solutions:**
1. Check internet speed: `speedtest-cli` or online tool
2. Switch to faster internet connection
3. Reduce timeout settings (temporary)
4. Pre-load responses for key demo queries
5. Explain that production deployment would be faster

### Problem: "Authentication fails"

**Symptoms:** Login won't work, JWT errors

**Solutions:**
1. Verify JWT_SECRET in .env
2. Check user exists in database: `SELECT * FROM users WHERE email='demo@indian-motorcycle.com';`
3. Reset demo password
4. Clear cookies and try again
5. Use backup demo account

---

## Performance Optimization

### For Faster Demos

```bash
# Increase Node.js memory (if needed)
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Use production build
npm run build
NODE_ENV=production npm start

# Pre-warm AI connections (run test query before demo)
curl -X POST http://localhost:3000/api/query \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"Test connection"}' > /dev/null
```

### Database Performance

```sql
-- Add indexes for faster queries (if not already in schema.sql)
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_queries_session_id ON queries(session_id);
```

---

## Security Considerations

### Protecting API Keys During Demo

- **Never show .env file on screen**
- **Don't commit API keys to demo repo**
- **Use demo-specific keys (not production)**
- **Rotate keys after demo if shared**
- **Monitor API usage for abuse**

### Protecting Demo Data

- **Use temporary demo database**
- **Don't store real customer data**
- **Clear demo queries after presentation**
- **Use encryption for any saved data**
- **Don't leave laptop unattended**

---

## Equipment Checklist

### Must-Have
- [ ] Laptop with RideWire installed
- [ ] Power adapter/charger
- [ ] Mobile hotspot (backup internet)
- [ ] Login credentials written down
- [ ] USB drive with backup files

### Nice-to-Have
- [ ] External monitor/adapter
- [ ] Wireless mouse (easier for presenting)
- [ ] Power bank for phone/hotspot
- [ ] Ethernet cable (if shop has wired connection)
- [ ] Extension cord

### Emergency Backup
- [ ] Printed screenshots of working demo
- [ ] Demo video on USB drive
- [ ] Offline presentation (PowerPoint/PDF)
- [ ] Contact info for remote support

---

## Quick Reference: Essential Commands

```bash
# Start server
npm start

# Check server status
curl http://localhost:3000/health

# Login (get JWT token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@indian-motorcycle.com","password":"IndianDemo2026!"}'

# Submit query
curl -X POST http://localhost:3000/api/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"Indian Scout diagnostic question"}'

# View logs
tail -f server.log

# Stop server
Ctrl+C

# Emergency restart
pkill -f node && npm start
```

---

## Contact for Technical Support

**Pre-Demo Support:**
- Email: tech@ridewire.ai
- Phone: [Support Number]
- Slack: #indian-demo-support

**During Demo (Emergency):**
- Have phone ready to call support
- Screen share option via video call
- Remote access pre-approved (if needed)

---

**Setup Time:** 15 minutes on-site  
**Total Prep Time:** 2 hours (first-time setup)  
**Last Updated:** 2026-01-07  
**Version:** 1.0 - Indian Motorcycle Test 1  

**You're technically prepared. Trust your setup, have backups ready, and stay calm if issues arise. The demo will be great! 🏍️**
