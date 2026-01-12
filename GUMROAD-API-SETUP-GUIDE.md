# 🔑 Gumroad API Setup Guide

Complete step-by-step guide to obtain your Gumroad API access token and integrate with RideWire.

---

## 📋 Prerequisites

✅ You already have:
- Gumroad account created
- Product created: https://ridewire.gumroad.com/l/mxgew
- RideWire automation code ready (`ecommerceAutomation.js`)

---

## 🚀 Step 1: Get Your API Access Token

### Method 1: Gumroad Dashboard (Recommended)

1. **Log in to Gumroad**
   - Go to: https://app.gumroad.com/
   - Sign in with your credentials

2. **Navigate to Settings**
   - Click your profile icon (top right)
   - Select **"Settings"**

3. **Access Advanced Settings**
   - Scroll down to **"Advanced"** section
   - Click **"Advanced"** or **"Developer"**

4. **Generate Access Token**
   - Look for **"Application Access Token"** or **"API Access Token"**
   - Click **"Create application"** or **"Generate new token"**
   - Name it: `RideWire Automation`
   - Click **"Create"**

5. **Copy Token**
   - You'll see a token like: `gumroad_access_token_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **⚠️ COPY IT NOW** - You won't see it again!
   - Store it securely

### Method 2: Direct API Link

If the settings path is unclear, try:
- https://app.gumroad.com/settings/advanced
- https://app.gumroad.com/application

### Method 3: Gumroad API Documentation

1. Go to: https://app.gumroad.com/api
2. Follow the authentication instructions
3. Generate an OAuth access token

---

## 🔧 Step 2: Configure RideWire

### 2.1 Add Token to Environment File

```bash
# Navigate to your project directory
cd /home/runner/work/ridewire-ai-hub/ridewire-ai-hub

# Open or create .env file
nano .env

# Add this line (replace with your actual token):
GUMROAD_ACCESS_TOKEN=your_actual_token_here

# Example:
# GUMROAD_ACCESS_TOKEN=gumroad_access_token_abc123def456ghi789jkl012mno345
```

### 2.2 Verify Configuration

```bash
# Check that the token is set
grep GUMROAD_ACCESS_TOKEN .env

# Should output:
# GUMROAD_ACCESS_TOKEN=your_actual_token_here
```

---

## ✅ Step 3: Test Integration

### 3.1 Test API Connection

```bash
# Run the test script
node -e "
const axios = require('axios');
const token = process.env.GUMROAD_ACCESS_TOKEN || 'your_token_here';

axios.get('https://api.gumroad.com/v2/user', {
  params: { access_token: token }
})
.then(res => console.log('✅ Connected! User:', res.data.user.name))
.catch(err => console.error('❌ Error:', err.response?.data || err.message));
"
```

Expected output:
```
✅ Connected! User: STEPHENIESGEM
```

### 3.2 Test Product Listing

```bash
# List your products
node -e "
const axios = require('axios');
const token = process.env.GUMROAD_ACCESS_TOKEN || 'your_token_here';

axios.get('https://api.gumroad.com/v2/products', {
  params: { access_token: token }
})
.then(res => console.log('✅ Products:', res.data.products.map(p => p.name)))
.catch(err => console.error('❌ Error:', err.response?.data || err.message));
"
```

---

## 🎯 Step 4: Enable Automation

### 4.1 Update Product Settings

1. Go to your product: https://ridewire.gumroad.com/l/mxgew
2. Click **"Edit product"**
3. Enable these settings:
   - ✅ **API access** (allows programmatic listing)
   - ✅ **Webhooks** (for real-time sales notifications)
   - ✅ **Digital product** (automatic delivery)

### 4.2 Configure Webhook (Optional but Recommended)

```bash
# Set up webhook for sale notifications
curl -X POST https://api.gumroad.com/v2/resource_subscriptions \
  -d "access_token=your_token_here" \
  -d "post_url=https://yourdomain.com/api/gumroad/webhook" \
  -d "resource_name=sale"
```

Our webhook endpoint is already coded in `ecommerceAutomation.js`:
- Endpoint: `POST /api/gumroad/webhook`
- Handles: Sale notifications, refunds, disputes
- Actions: Records revenue, queues payouts, awards XP

---

## 🚀 Step 5: Launch First Product

### 5.1 Create a Test Listing

```bash
# Start the server
npm start

# In another terminal, test the auto-listing API:
curl -X POST http://localhost:3000/api/marketplace/list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "P0300 Random Misfire - Honda Civic 2018",
    "description": "AI-generated diagnostic diagram with 95% consensus",
    "price": 14.99,
    "diagram_url": "https://storage.ridewire.com/diagrams/p0300-civic-2018.pdf",
    "auto_publish_gumroad": true
  }'
```

Expected response:
```json
{
  "success": true,
  "listing_id": "abc123",
  "gumroad_product_id": "xyz789",
  "url": "https://ridewire.gumroad.com/l/xyz789"
}
```

### 5.2 Verify on Gumroad

1. Go to: https://app.gumroad.com/products
2. You should see your new product listed
3. Check that the price, description, and download link are correct

---

## 📊 Step 6: Monitor Performance

### 6.1 Check Dashboard

```bash
# View seller dashboard
curl http://localhost:3000/api/revenue/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response shows:
- Total revenue
- Pending payouts
- Recent sales
- Gumroad sync status

### 6.2 Process Weekly Payouts

```bash
# Trigger manual payout (normally runs every Monday)
curl -X POST http://localhost:3000/api/admin/process-payouts \
  -H "Authorization: Bearer YOUR_ADMIN_API_KEY"
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Store token in `.env` file (never commit to git)
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate token every 90 days
- Use HTTPS for all API calls

### ❌ DON'T:
- Commit tokens to GitHub
- Share tokens in Slack/email
- Hardcode tokens in source code
- Use the same token for dev and production
- Expose tokens in client-side JavaScript

---

## 🐛 Troubleshooting

### Error: "Invalid access token"

**Solution:**
```bash
# Verify token format (should start with "gumroad_")
echo $GUMROAD_ACCESS_TOKEN

# Regenerate token from Gumroad dashboard
# Update .env file with new token
```

### Error: "Product not found"

**Solution:**
```bash
# List all products to find correct ID
curl https://api.gumroad.com/v2/products?access_token=YOUR_TOKEN

# Update product ID in listing request
```

### Error: "Rate limit exceeded"

**Solution:**
```bash
# Gumroad limits: 100 requests/minute
# Add delay between bulk operations
# Check rate limit headers in response
```

### Webhook not receiving events

**Solution:**
1. Verify webhook URL is publicly accessible
2. Check webhook subscription status:
```bash
curl https://api.gumroad.com/v2/resource_subscriptions?access_token=YOUR_TOKEN
```
3. Test with Gumroad's webhook tester
4. Check server logs for incoming requests

---

## 📞 Support Resources

### Gumroad Help
- **API Docs**: https://help.gumroad.com/article/280-gumroad-api
- **API Reference**: https://app.gumroad.com/api
- **Support Email**: help@gumroad.com
- **Community**: https://community.gumroad.com

### RideWire Help
- **Implementation Doc**: `GUMROAD-INTEGRATION-PLAN.md`
- **E-Commerce Code**: `ecommerceAutomation.js`
- **API Endpoints**: See `ECOMMERCE-AUTOMATION-IMPLEMENTATION.md`

---

## ✨ Quick Start Checklist

- [ ] Log in to Gumroad dashboard
- [ ] Navigate to Settings → Advanced
- [ ] Generate API access token
- [ ] Copy token (starts with "gumroad_")
- [ ] Add to `.env` file: `GUMROAD_ACCESS_TOKEN=...`
- [ ] Test connection with curl or Node.js
- [ ] Enable API access on your product
- [ ] Configure webhook (optional)
- [ ] Create test listing via API
- [ ] Verify product appears on Gumroad
- [ ] Monitor revenue dashboard
- [ ] Set up weekly payout automation

---

## 🎯 Next Steps After Setup

1. **Bulk Import Products**
   - Use `scripts/import-gumroad-products.js` (to be created)
   - Import 10 initial products from `GUMROAD-INTEGRATION-PLAN.md`

2. **Enable Auto-Publishing**
   - Set `AUTO_PUBLISH_GUMROAD=true` in `.env`
   - All approved diagnostics will auto-list

3. **Launch Marketing Campaign**
   - Announce on Twitter/LinkedIn
   - Email 500+ beta users
   - Share trailer: `trailer.html`

4. **Monitor Metrics**
   - Track sales in real-time
   - Optimize pricing based on conversion
   - A/B test product descriptions

---

## 📈 Expected Timeline

| Time | Action | Expected Result |
|------|--------|-----------------|
| 0h | Get API token | Token saved in `.env` |
| 0.5h | Test connection | ✅ API responding |
| 1h | Create first listing | Product live on Gumroad |
| 2h | Import 10 products | Catalog complete |
| 3h | Configure webhook | Real-time sales tracking |
| 4h | Test purchase flow | End-to-end verified |
| 5h | Launch announcement | Marketing materials sent |
| 6h | Monitor first sale | $14.99+ revenue 🎉 |

---

## 🚀 You're Ready!

Once you have your API token:
1. Add it to `.env`
2. Restart the server
3. Test with a listing
4. Watch the automation work! 🤖💰

**Questions?** The code is already written and waiting for your token. Just plug it in and go! 🎯
