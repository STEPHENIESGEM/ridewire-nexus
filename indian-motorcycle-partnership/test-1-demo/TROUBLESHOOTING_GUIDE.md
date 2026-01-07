# Troubleshooting Guide - Indian Motorcycle Demo
## Quick Fixes for Common Technical Issues

---

## Emergency Contact Information

**Technical Support:**
- Phone: [Your Phone Number]
- Email: tech@ridewire.ai
- Slack: #emergency-support

**Demo Lead:**
- Name: [Your Name]
- Phone: [Your Phone Number]
- Backup: [Backup Person]

---

## Critical Pre-Demo Checklist

Before starting the demo, verify these are working:

```bash
# 1. Server is running
curl http://localhost:3000/health
# Expected: {"status":"ok"}

# 2. Database is accessible
psql -U postgres -d ridewire_demo -c "SELECT COUNT(*) FROM users;"
# Expected: Should return count without error

# 3. AI APIs are responsive
# Test OpenAI
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
# Expected: 200

# 4. Authentication works
# Login and get token (save this)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@indian-motorcycle.com","password":"IndianDemo2026!"}'
# Expected: Returns JWT token

# 5. Test query works
curl -X POST http://localhost:3000/api/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
# Expected: Returns AI responses
```

**If any of these fail, DO NOT start the demo until fixed!**

---

## Issue #1: Server Won't Start

### Symptoms
- `npm start` fails
- Error: "Port 3000 already in use"
- Error: "Cannot find module"

### Quick Fixes

**Solution A: Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000
# Or on Windows:
netstat -ano | findstr :3000

# Kill the process
kill -9 [PID]
# Or on Windows:
taskkill /PID [PID] /F

# Start server again
npm start
```

**Solution B: Use Different Port**
```bash
# Start on port 3001 instead
PORT=3001 npm start

# Update browser to http://localhost:3001
```

**Solution C: Dependencies Missing**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Try starting again
npm start
```

**Solution D: Environment Variables Missing**
```bash
# Check .env file exists
ls -la .env

# Verify required variables are set
cat .env | grep -E "DATABASE_URL|JWT_SECRET|OPENAI_API_KEY"

# If missing, copy from backup
cp .env.backup .env
```

**Time to Fix:** 2-5 minutes  
**Backup Plan:** Use pre-recorded demo video while fixing

---

## Issue #2: Database Connection Failed

### Symptoms
- Error: "ECONNREFUSED" or "database connection failed"
- Queries fail to save
- Login doesn't work

### Quick Fixes

**Solution A: PostgreSQL Not Running**
```bash
# Check if PostgreSQL is running
pg_isready

# If not, start it
# On macOS:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql

# On Windows:
net start postgresql-x64-12
```

**Solution B: Wrong Database URL**
```bash
# Test connection manually
psql -U postgres -d ridewire_demo -c "SELECT 1;"

# If fails, check .env DATABASE_URL
nano .env

# Should look like:
# DATABASE_URL=postgresql://user:password@localhost:5432/ridewire_demo
```

**Solution C: Use Remote Database (Backup)**
```bash
# Switch to cloud database in .env
DATABASE_URL=postgresql://user:pass@remote-db.com:5432/ridewire_demo

# Restart server
npm start
```

**Solution D: Create Database on the Fly**
```bash
# Create database if it doesn't exist
createdb ridewire_demo

# Run schema
psql -U postgres -d ridewire_demo -f schema.sql

# Restart server
npm start
```

**Time to Fix:** 3-10 minutes  
**Backup Plan:** Use cached demo data (show previous queries)

---

## Issue #3: AI API Calls Failing

### Symptoms
- Error: "API key invalid"
- Error: "Rate limit exceeded"
- Empty AI responses
- Timeout errors

### Quick Fixes

**Solution A: API Key Invalid or Expired**
```bash
# Test each API key individually
# OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Anthropic
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-opus-20240229","max_tokens":10,"messages":[{"role":"user","content":"test"}]}'

# If errors, check API keys in .env
nano .env

# Use backup API keys
OPENAI_API_KEY=sk-backup-key-here
```

**Solution B: Rate Limit Hit**
```bash
# Check rate limit headers
curl -I https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  | grep -i rate

# Wait 60 seconds and retry
# OR switch to backup API account
```

**Solution C: Network/Firewall Blocking API**
```bash
# Test internet connectivity to AI providers
ping api.openai.com
ping api.anthropic.com

# Test HTTPS access
curl -I https://api.openai.com

# If blocked, use mobile hotspot
# Or configure proxy/VPN
```

**Solution D: Use Cached Responses (Emergency)**
```javascript
// In multiAIOrchestrator.js, add fallback responses
const cachedResponses = {
  'Indian Scout': 'Check O2 sensor wiring, test sensor voltage...',
  // Add more cached responses for demo queries
};

// Return cached response if API fails
```

**Time to Fix:** 1-5 minutes  
**Backup Plan:** Use pre-recorded API responses, show screenshots

---

## Issue #4: Login/Authentication Not Working

### Symptoms
- Login button doesn't work
- "Invalid credentials" error
- JWT token errors
- Auto-logout immediately after login

### Quick Fixes

**Solution A: Demo User Doesn't Exist**
```bash
# Create demo user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@indian-motorcycle.com",
    "password": "IndianDemo2026!"
  }'

# Verify user exists
psql -U postgres -d ridewire_demo -c \
  "SELECT email FROM users WHERE email='demo@indian-motorcycle.com';"
```

**Solution B: JWT Secret Mismatch**
```bash
# Check JWT_SECRET in .env
echo $JWT_SECRET

# If empty, set it
JWT_SECRET=$(openssl rand -hex 32)
echo "JWT_SECRET=$JWT_SECRET" >> .env

# Restart server
npm start
```

**Solution C: Browser Cookie Issues**
```bash
# Clear browser cache and cookies
# Chrome: Ctrl+Shift+Delete
# Or use incognito mode

# Try logging in again
```

**Solution D: Use Pre-Authenticated Session**
```bash
# Generate JWT token manually
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: 1, email: 'demo@indian-motorcycle.com' },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
console.log(token);
"

# Use this token in Authorization header
# Set in browser localStorage:
localStorage.setItem('auth_token', 'YOUR_TOKEN');
```

**Time to Fix:** 2-5 minutes  
**Backup Plan:** Use browser's developer tools to bypass login (demo only)

---

## Issue #5: Slow Query Responses

### Symptoms
- AI responses take 20+ seconds
- Browser shows "Loading..." indefinitely
- Timeout errors

### Quick Fixes

**Solution A: Slow Internet Connection**
```bash
# Test internet speed
curl -o /dev/null -s -w "Speed: %{speed_download} bytes/sec\n" \
  https://www.google.com

# If <500,000 bytes/sec, switch to better connection
# Use mobile hotspot with 4G/5G
```

**Solution B: Increase Timeout Settings**
```javascript
// In multiAIOrchestrator.js
const TIMEOUT = 30000; // Increase from default 10000

// In server.js
app.use((req, res, next) => {
  req.setTimeout(60000); // 60 second timeout
  next();
});
```

**Solution C: Run Queries in Parallel (Not Sequential)**
```javascript
// Verify queries are parallel in multiAIOrchestrator.js
async queryAllAgents(query) {
  // Should use Promise.all(), not sequential awaits
  const [chatGPT, claude, gemini] = await Promise.all([
    this.queryChatGPT(query),
    this.queryClaude(query),
    this.queryGemini(query)
  ]);
}
```

**Solution D: Pre-Load Demo Queries**
```bash
# Before demo, submit queries and cache results
curl -X POST http://localhost:3000/api/query \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"Indian Scout P0131"}' > /tmp/cached1.json

# During demo, show cached results if live query is slow
```

**Time to Fix:** 1-3 minutes  
**Backup Plan:** Explain that production deployment would be faster, show cached results

---

## Issue #6: Browser Interface Issues

### Symptoms
- Dashboard won't load
- Chat interface broken
- CSS not loading (plain HTML)
- JavaScript errors in console

### Quick Fixes

**Solution A: Clear Browser Cache**
```bash
# In browser:
# Chrome: Ctrl+Shift+Delete → Clear cache
# Firefox: Ctrl+Shift+Delete → Clear cache
# Safari: Cmd+Option+E

# Or use incognito/private mode
# Chrome: Ctrl+Shift+N
# Firefox: Ctrl+Shift+P
```

**Solution B: Rebuild Frontend**
```bash
# Rebuild React app
npm run build

# Restart server
npm start

# Refresh browser (Ctrl+F5 for hard refresh)
```

**Solution C: Check Console for Errors**
```bash
# In browser, open developer tools
# Chrome: F12 or Ctrl+Shift+I
# Look at Console tab for red errors

# Common fix: CORS errors
# Add to server.js:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
```

**Solution D: Use Different Browser**
```bash
# Try Chrome, Firefox, or Edge
# One may work better than others

# As last resort, use mobile browser on phone/tablet
```

**Time to Fix:** 2-5 minutes  
**Backup Plan:** Use screenshots/PDF of interface, show functionality via command line

---

## Issue #7: No Internet Connection

### Symptoms
- "Unable to connect"
- AI APIs unreachable
- Dashboard won't load external resources

### Quick Fixes

**Solution A: Switch to Mobile Hotspot**
```bash
# Enable hotspot on phone
# Connect laptop to phone's hotspot
# Verify connection:
ping 8.8.8.8

# Test internet:
curl https://www.google.com
```

**Solution B: Use Shop Wi-Fi**
```bash
# Ask for Wi-Fi credentials
# Connect to shop network
# Test connection

# If firewall blocks APIs, ask IT to whitelist:
# - api.openai.com
# - api.anthropic.com
# - generativelanguage.googleapis.com
```

**Solution C: Offline Demo Mode**
```bash
# Use pre-recorded video demo
# Show screenshots of working system
# Walk through printed pitch deck
# Emphasize will do full live demo remotely later
```

**Time to Fix:** 2-10 minutes  
**Backup Plan:** Offline presentation, reschedule for live demo

---

## Issue #8: Demo Account Locked/Suspended

### Symptoms
- Login fails with account error
- API quota exceeded
- Database connection limit reached

### Quick Fixes

**Solution A: Create New Demo Account on the Fly**
```bash
# Create new user with timestamp
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo2@indian-motorcycle.com",
    "password": "IndianDemo2026!"
  }'

# Login with new account
```

**Solution B: Reset API Quotas**
```bash
# Check API usage in provider dashboards
# OpenAI: https://platform.openai.com/usage
# Anthropic: https://console.anthropic.com/settings/usage

# Switch to backup API keys if quota hit
```

**Solution C: Clear Database Session Locks**
```sql
-- Connect to database
psql -U postgres -d ridewire_demo

-- Kill hanging connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'ridewire_demo' AND pid <> pg_backend_pid();

-- Clear session table if exists
TRUNCATE TABLE sessions;
```

**Time to Fix:** 3-5 minutes  
**Backup Plan:** Use guest/anonymous demo mode (if implemented)

---

## Issue #9: Display/Projector Not Working

### Symptoms
- External monitor won't connect
- Shop projector not detected
- Screen resolution too small/large

### Quick Fixes

**Solution A: Display Settings**
```bash
# Windows: Win+P → Extend/Duplicate
# macOS: System Preferences → Displays → Detect Displays

# Adjust resolution for projector
# Usually 1920x1080 or 1280x720 works best
```

**Solution B: Use Laptop Screen Only**
```bash
# Position laptop so shop team can see
# Increase browser zoom: Ctrl + (plus key)
# Use fullscreen mode: F11
# Make text/UI larger in settings
```

**Solution C: Screen Sharing (if Available)**
```bash
# Use Zoom/Teams screen share to shop's computer
# Join meeting from shop's PC
# Share your screen
# Shop team views on their monitor
```

**Time to Fix:** 2-5 minutes  
**Backup Plan:** Gather team around laptop screen, do intimate demo

---

## Issue #10: Laptop Battery Dying

### Symptoms
- Low battery warning
- Power adapter not working
- No power outlet available

### Quick Fixes

**Solution A: Find Power Outlet**
```bash
# Ask shop for nearest outlet
# Use extension cord if needed
# Pause demo briefly to connect power
```

**Solution B: Power Saving Mode**
```bash
# Reduce screen brightness
# Close unnecessary apps
# Disable Wi-Fi when not needed (use cached data)
# Enable battery saver mode
```

**Solution C: Use Mobile Device**
```bash
# Have backup tablet/phone with demo ready
# Access RideWire from mobile browser
# Continue demo on mobile (better than stopping)
```

**Solution D: Speed Up Demo**
```bash
# Skip less critical sections
# Focus on live diagnostic demo only
# Schedule follow-up for full presentation
# Leave materials for later review
```

**Time to Fix:** 1-2 minutes  
**Backup Plan:** Print materials, finish demo without laptop

---

## Emergency Escalation Process

### If You Can't Fix Issue in 5 Minutes:

1. **Acknowledge the issue calmly:**
   - "Looks like we're having a technical glitch. Let me switch to Plan B."

2. **Switch to backup demo:**
   - Show pre-recorded video
   - Walk through printed materials
   - Use screenshots on USB drive

3. **Keep demo moving:**
   - Don't dwell on technical failure
   - Focus on vision and business case
   - Offer to do full live demo remotely

4. **Schedule follow-up:**
   - "Let me set up a remote demo where I can ensure everything works perfectly."
   - Get calendar invite sent before you leave

5. **Document issue for post-mortem:**
   - Note what failed and why
   - Fix before next demo
   - Test extensively

---

## Backup Demo Resources

### On USB Drive (Bring to Demo)
- [ ] RideWire installation files
- [ ] Pre-recorded demo video (MP4)
- [ ] Screenshot folder (working system)
- [ ] PDF pitch deck
- [ ] Offline version of docs

### Cloud Backup (Accessible from Phone)
- [ ] Google Drive/Dropbox with all materials
- [ ] YouTube unlisted demo video link
- [ ] Backup presentation slides
- [ ] Contact information document

---

## Post-Issue Recovery

### After Fixing Technical Issue During Demo:

**What to Say:**
- "Great, we're back online. Thanks for your patience."
- "This is actually a good reminder that we have fallback systems in production."
- "Now, let me show you where we left off..."

**What NOT to Say:**
- "Sorry, this never happens!" (undermines confidence)
- "I don't know why it's broken..." (looks unprepared)
- "Let me try restarting everything..." (wastes time)

### If Issue Can't Be Fixed:

**Pivot to Business Discussion:**
- "While the live demo isn't cooperating today, let me show you the vision..."
- Focus on ROI, partnership benefits, market opportunity
- Show printed materials and screenshots
- Offer detailed remote demo

---

## Prevention Checklist (Use Before Every Demo)

### Night Before Demo
- [ ] Full system test (all features)
- [ ] API key balance check (ensure credits available)
- [ ] Database backup created
- [ ] Backup materials prepared (USB, cloud)
- [ ] Battery fully charged
- [ ] Demo script reviewed

### Morning of Demo
- [ ] Re-test system (quick smoke test)
- [ ] Check internet connection
- [ ] Verify backup materials accessible
- [ ] Pack all equipment (chargers, adapters, USB)
- [ ] Review troubleshooting guide (this doc)

### 30 Minutes Before Demo
- [ ] Run pre-demo checklist (top of this guide)
- [ ] Test one full query end-to-end
- [ ] Verify login works
- [ ] Check battery level
- [ ] Have phone charged (hotspot backup)

---

## Contact Information for Emergency Support

**During Demo Hours:**
- Primary: [Your Phone]
- Backup: [Backup Person Phone]
- Tech Support: [Support Number]

**Escalation Path:**
1. Try troubleshooting guide (5 minutes max)
2. Call backup support (describe issue quickly)
3. Switch to backup demo materials
4. Schedule follow-up for full demo

---

## Common Error Messages and Fixes

### "ECONNREFUSED"
- **Cause:** Database or server not running
- **Fix:** Restart PostgreSQL, then restart Node server

### "401 Unauthorized"
- **Cause:** Invalid JWT token or expired session
- **Fix:** Re-login to get fresh token

### "429 Too Many Requests"
- **Cause:** API rate limit hit
- **Fix:** Wait 60 seconds or use backup API key

### "CORS Error"
- **Cause:** Browser blocking cross-origin request
- **Fix:** Add CORS headers in server.js

### "Module not found"
- **Cause:** npm dependencies missing
- **Fix:** Run `npm install`

### "Port already in use"
- **Cause:** Another process using port 3000
- **Fix:** Kill process or use different port

---

## Success Mantras for Demo Recovery

- ✅ **Stay calm:** Technical issues happen, professionalism matters
- ✅ **Have backup plans:** Always prepare Plan B and C
- ✅ **Pivot quickly:** Don't waste time debugging during demo
- ✅ **Focus on value:** Even without live demo, sell the vision
- ✅ **Learn and improve:** Document issues for next time

**Remember: How you handle problems matters more than the problems themselves. Stay confident! 🏍️**

---

**Last Updated:** 2026-01-07  
**Version:** 1.0 - Indian Motorcycle Test 1  

**Print this guide and keep it handy during the demo. You've got this!**
