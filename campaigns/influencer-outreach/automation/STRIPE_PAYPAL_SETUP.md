# Stripe Connect & PayPal Payment Setup Guide

## Overview
This guide details how to set up payment infrastructure for influencer commissions and referral payouts. We'll use **Stripe Connect** as the primary method and **PayPal** as a backup/alternative.

---

## Option 1: Stripe Connect (Recommended)

### Why Stripe Connect?
- ✅ Automated payouts to influencers
- ✅ Real-time commission tracking
- ✅ Dashboard for influencers to see earnings
- ✅ Handles tax forms (1099-K for US influencers)
- ✅ API integration with RideWire platform
- ✅ Supports international payouts (190+ countries)

### Architecture Overview

```
Customer signs up with influencer code
         ↓
RideWire charges customer ($29/month)
         ↓
Stripe calculates commission (10-30%)
         ↓
Commission held in escrow
         ↓
Friday payout to influencer's Stripe account
         ↓
Influencer transfers to their bank/PayPal
```

---

## Stripe Connect Setup (Step-by-Step)

### Step 1: Create Stripe Account

1. **Sign up**: https://dashboard.stripe.com/register
2. **Activate account**: Provide business details
3. **Enable Stripe Connect**: Dashboard → Settings → Connect
4. **Choose account type**: "Standard" (recommended for influencers)

**Cost**: 
- 2.9% + $0.30 per transaction (customer payment)
- 0.25% per payout to influencer (max $5)

---

### Step 2: Create Connected Accounts for Influencers

**When influencer agrees to partnership:**

1. **Generate Stripe Connect Link**
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   const accountLink = await stripe.accountLinks.create({
     account: 'acct_influencer_id',
     refresh_url: 'https://ridewire.ai/connect/refresh',
     return_url: 'https://ridewire.ai/connect/success',
     type: 'account_onboarding',
   });
   
   // Send this link to influencer via email
   console.log(accountLink.url);
   ```

2. **Influencer Completes Onboarding**
   - They enter bank account info
   - Verify identity (required by Stripe)
   - Accept terms of service
   - Set payout schedule

3. **Store Connection in Database**
   ```sql
   CREATE TABLE influencer_payments (
     id SERIAL PRIMARY KEY,
     influencer_id INT REFERENCES influencers(id),
     stripe_account_id VARCHAR(255) UNIQUE,
     connected_at TIMESTAMP DEFAULT NOW(),
     commission_rate DECIMAL(5,2),
     total_earned DECIMAL(10,2) DEFAULT 0,
     last_payout_date DATE
   );
   ```

---

### Step 3: Track Customer Referrals

**When customer signs up with influencer code:**

1. **Create Customer with Metadata**
   ```javascript
   const customer = await stripe.customers.create({
     email: customerEmail,
     metadata: {
       influencer_code: 'INFLUENCER123',
       referral_date: new Date().toISOString(),
     },
   });
   ```

2. **Create Subscription**
   ```javascript
   const subscription = await stripe.subscriptions.create({
     customer: customer.id,
     items: [{ price: 'price_pro_plan' }], // $29/month
     metadata: {
       influencer_code: 'INFLUENCER123',
     },
   });
   ```

3. **Log Referral in Database**
   ```sql
   INSERT INTO referrals (influencer_id, customer_email, plan, date, status)
   VALUES (123, 'customer@example.com', 'Pro', NOW(), 'Active');
   ```

---

### Step 4: Calculate Commissions

**After each successful payment:**

1. **Webhook: Listen for Stripe Events**
   ```javascript
   app.post('/webhooks/stripe', async (req, res) => {
     const event = req.body;
     
     if (event.type === 'invoice.payment_succeeded') {
       const invoice = event.data.object;
       const influencerCode = invoice.metadata.influencer_code;
       
       if (influencerCode) {
         // Calculate commission
         const amount = invoice.amount_paid / 100; // Convert cents to dollars
         const influencer = await getInfluencerByCode(influencerCode);
         const commission = amount * (influencer.commission_rate / 100);
         
         // Store commission
         await logCommission({
           influencer_id: influencer.id,
           customer_id: invoice.customer,
           amount: amount,
           commission: commission,
           date: new Date(),
         });
         
         // Update total earnings
         await updateTotalEarnings(influencer.id, commission);
       }
     }
     
     res.status(200).send('Webhook received');
   });
   ```

2. **Database Schema for Commissions**
   ```sql
   CREATE TABLE commissions (
     id SERIAL PRIMARY KEY,
     influencer_id INT REFERENCES influencers(id),
     customer_id VARCHAR(255),
     transaction_amount DECIMAL(10,2),
     commission_amount DECIMAL(10,2),
     commission_rate DECIMAL(5,2),
     date DATE DEFAULT NOW(),
     paid BOOLEAN DEFAULT FALSE,
     payout_date DATE
   );
   ```

---

### Step 5: Automated Weekly Payouts

**Every Friday at 5pm EST:**

1. **Query Unpaid Commissions**
   ```javascript
   const unpaidCommissions = await db.query(`
     SELECT 
       influencer_id,
       stripe_account_id,
       SUM(commission_amount) as total_commission
     FROM commissions c
     JOIN influencer_payments ip ON c.influencer_id = ip.influencer_id
     WHERE c.paid = FALSE
     GROUP BY influencer_id, stripe_account_id
     HAVING SUM(commission_amount) >= 50.00
   `);
   ```

2. **Transfer Funds via Stripe Connect**
   ```javascript
   for (const influencer of unpaidCommissions) {
     try {
       // Create payout to influencer's Stripe account
       const transfer = await stripe.transfers.create({
         amount: Math.round(influencer.total_commission * 100), // Convert to cents
         currency: 'usd',
         destination: influencer.stripe_account_id,
         description: `Weekly commission payout - ${new Date().toLocaleDateString()}`,
       });
       
       // Mark commissions as paid
       await db.query(`
         UPDATE commissions
         SET paid = TRUE, payout_date = NOW()
         WHERE influencer_id = $1 AND paid = FALSE
       `, [influencer.influencer_id]);
       
       // Send confirmation email
       await sendPayoutEmail(influencer, influencer.total_commission);
       
     } catch (error) {
       console.error(`Payout failed for influencer ${influencer.influencer_id}:`, error);
       // Alert team via Slack
       await sendSlackAlert(`Payout failed: ${influencer.influencer_id}`);
     }
   }
   ```

3. **Minimum Payout Threshold**
   - Only payout if commission ≥ $50
   - Accumulate smaller amounts for next week
   - Influencers can request early payout if balance ≥ $100

---

### Step 6: Influencer Dashboard

**Create dashboard for influencers to track earnings:**

1. **API Endpoint: Get Earnings**
   ```javascript
   app.get('/api/influencer/earnings', authenticateInfluencer, async (req, res) => {
     const influencerId = req.influencer.id;
     
     const earnings = await db.query(`
       SELECT 
         COUNT(*) as total_referrals,
         SUM(transaction_amount) as total_revenue,
         SUM(commission_amount) as total_earned,
         SUM(CASE WHEN paid = TRUE THEN commission_amount ELSE 0 END) as total_paid,
         SUM(CASE WHEN paid = FALSE THEN commission_amount ELSE 0 END) as pending
       FROM commissions
       WHERE influencer_id = $1
     `, [influencerId]);
     
     res.json(earnings.rows[0]);
   });
   ```

2. **Frontend Component**
   ```jsx
   // React component for influencer dashboard
   function InfluencerDashboard() {
     const [earnings, setEarnings] = useState(null);
     
     useEffect(() => {
       fetch('/api/influencer/earnings')
         .then(res => res.json())
         .then(data => setEarnings(data));
     }, []);
     
     return (
       <div>
         <h2>Your Earnings</h2>
         <p>Total Referrals: {earnings?.total_referrals}</p>
         <p>Total Revenue Generated: ${earnings?.total_revenue}</p>
         <p>Total Earned: ${earnings?.total_earned}</p>
         <p>Paid Out: ${earnings?.total_paid}</p>
         <p>Pending (Next Payout): ${earnings?.pending}</p>
       </div>
     );
   }
   ```

---

## Option 2: PayPal Payouts API (Alternative)

### Why PayPal?
- ✅ Many influencers already have PayPal
- ✅ No bank account required
- ✅ Instant transfers (vs. 2-3 day Stripe delay)
- ✅ International support (200+ countries)

### Disadvantages:
- ❌ Higher fees (2% + $0.25 per payout)
- ❌ Less automation than Stripe Connect
- ❌ Requires manual CSV uploads for mass payouts

---

### PayPal Setup (Step-by-Step)

### Step 1: Create PayPal Business Account

1. Sign up: https://www.paypal.com/business
2. Verify business information
3. Enable "Payouts" in account settings
4. Get API credentials (Client ID + Secret)

**Cost**:
- 2% per payout (up to $20 per transaction)
- Minimum: $0.25 per payout

---

### Step 2: Manual Payout Process (Weekly)

**Every Friday:**

1. **Export Commissions from Database**
   ```javascript
   const unpaidCommissions = await db.query(`
     SELECT 
       email,
       SUM(commission_amount) as total
     FROM commissions c
     JOIN influencers i ON c.influencer_id = i.id
     WHERE c.paid = FALSE AND i.payment_method = 'PayPal'
     GROUP BY email
     HAVING SUM(commission_amount) >= 50.00
   `);
   
   // Generate CSV
   const csv = unpaidCommissions.rows.map(row => 
     `${row.email},${row.total},USD`
   ).join('\n');
   
   fs.writeFileSync('payouts.csv', csv);
   ```

2. **Upload CSV to PayPal**
   - Go to PayPal Business dashboard
   - Click "Send & Request" → "Pay multiple recipients"
   - Upload `payouts.csv`
   - Review and approve

3. **Mark as Paid in Database**
   ```javascript
   await db.query(`
     UPDATE commissions
     SET paid = TRUE, payout_date = NOW()
     WHERE paid = FALSE AND influencer_id IN (...)
   `);
   ```

---

### Step 3: Automated PayPal Payouts (Advanced)

**Use PayPal Payouts API:**

```javascript
const paypal = require('@paypal/payouts-sdk');

// Configure PayPal client
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Create mass payout
async function sendMassPayout(influencers) {
  let requestBody = {
    sender_batch_header: {
      sender_batch_id: `RideWire_${Date.now()}`,
      email_subject: "You received a payment from RideWire!",
      email_message: "Your weekly commission payout."
    },
    items: influencers.map(inf => ({
      recipient_type: "EMAIL",
      amount: {
        value: inf.commission.toFixed(2),
        currency: "USD"
      },
      receiver: inf.email,
      note: "RideWire commission payout",
      sender_item_id: `influencer_${inf.id}`
    }))
  };

  let request = new paypal.payouts.PayoutsPostRequest();
  request.requestBody(requestBody);

  try {
    let response = await client.execute(request);
    console.log('Payout successful:', response.result.batch_header.payout_batch_id);
    return response.result;
  } catch (error) {
    console.error('Payout failed:', error);
    throw error;
  }
}
```

---

## Option 3: Hybrid Approach (Stripe + PayPal)

**Best of both worlds:**

1. **Offer both options to influencers**
   - During onboarding, ask: "Stripe or PayPal?"
   - Store preference in database

2. **Route payouts accordingly**
   ```javascript
   if (influencer.payment_method === 'Stripe') {
     await stripeTransfer(influencer);
   } else if (influencer.payment_method === 'PayPal') {
     await paypalPayout(influencer);
   }
   ```

3. **Let influencers switch methods**
   - Provide option in dashboard
   - Process change request after next payout

---

## Commission Rate Tiers

### Tier Structure:

| Tier | Follower Range | Commission Rate | Revenue Share Cap |
|------|----------------|-----------------|-------------------|
| **Tier 1** | 500k-5M+ | 20-30% | Uncapped |
| **Tier 2** | 100k-500k | 10-15% | $10k/month |
| **Tier 3** | 10k-100k | 5-10% | $5k/month |
| **VIP** | $1k+ earned | +5% bonus | Uncapped |

### Performance Bonuses:

- **100k+ views on content**: $100 bonus
- **1M+ views on content**: $500 bonus
- **10+ conversions in a month**: 5% commission bump for next month
- **$1k+ lifetime earnings**: Permanent +5% commission rate

---

## Tax Compliance (Important!)

### For US-Based Influencers:

1. **Collect W-9 Forms**
   - Required if they earn $600+ per year
   - Use Stripe's built-in W-9 collection

2. **Issue 1099-K Forms**
   - Due by January 31 following tax year
   - Stripe handles this automatically if using Stripe Connect

3. **Report to IRS**
   - File Form 1099-K with IRS by March 31
   - Stripe handles this automatically

### For International Influencers:

1. **Collect W-8BEN Forms**
   - Required for non-US influencers
   - Exempts them from US tax withholding

2. **No 1099 Required**
   - International influencers are not reported to IRS

---

## Security & Fraud Prevention

### Red Flags:
- ❌ Influencer has suspiciously high conversion rate (>50%)
- ❌ All referrals come from same IP address
- ❌ Referrals signup but never use the platform
- ❌ Chargebacks or payment disputes

### Prevention:
1. **Require email verification** for all signups
2. **Track IP addresses** of referrals
3. **Delay payouts by 30 days** to allow for chargebacks
4. **Manual review** for influencers with >$1k/month earnings

---

## Monitoring & Reporting

### Weekly Payout Report:

```javascript
async function generatePayoutReport(week) {
  const report = await db.query(`
    SELECT 
      i.name,
      i.platform,
      i.tier,
      COUNT(c.id) as conversions,
      SUM(c.transaction_amount) as revenue,
      SUM(c.commission_amount) as commission_paid,
      AVG(c.commission_rate) as avg_commission_rate
    FROM commissions c
    JOIN influencers i ON c.influencer_id = i.id
    WHERE c.payout_date BETWEEN $1 AND $2
    GROUP BY i.name, i.platform, i.tier
    ORDER BY commission_paid DESC
  `, [week.start, week.end]);
  
  return report.rows;
}
```

### Monthly Financial Summary:

- Total revenue from influencer referrals
- Total commissions paid
- Average commission rate
- Top 10 performing influencers
- ROI per platform (YouTube vs TikTok vs Twitter)

---

## Cost Analysis

### Scenario: 50 Active Influencers

**Monthly Revenue from Influencer Channel**: $10,000

**Commission Payouts** (20% average rate): $2,000

**Payment Processing Fees**:
- Stripe: $2,000 × 0.25% = $5
- PayPal: $2,000 × 2% = $40

**Total Cost**: $2,040 (20.4% of revenue)

**Net Profit from Influencer Channel**: $7,960 (79.6% margin)

---

## Timeline to First Payout

### Realistic Timeline:

- **Week 1**: Set up Stripe Connect + onboard first 10 influencers
- **Week 2**: Influencers start promoting (first clicks)
- **Week 3**: First conversions happen (1-5 signups)
- **Week 4**: First payments received from customers
- **Week 5**: First payout to influencers (Friday payout)

**First Money in Influencer's Account**: Day 30-35

---

## Setup Checklist

- [ ] Create Stripe account and enable Stripe Connect
- [ ] Set up webhook endpoint for payment events
- [ ] Create database tables for commissions and payments
- [ ] Build influencer onboarding flow (Stripe Connect link)
- [ ] Create influencer dashboard to track earnings
- [ ] Set up automated weekly payout script
- [ ] Test end-to-end flow with dummy data
- [ ] Create PayPal Business account (backup option)
- [ ] Prepare W-9/W-8BEN forms for tax compliance
- [ ] Set up monitoring and alerting for failed payouts
- [ ] Document payout process for team

---

## Support & FAQs for Influencers

### Common Questions:

**Q: When do I get paid?**  
A: Every Friday at 5pm EST. Minimum payout is $50.

**Q: How do I track my earnings?**  
A: Log in to your RideWire dashboard at ridewire.ai/influencer

**Q: What if I don't have a Stripe account?**  
A: We'll send you a link to create one. It takes 5 minutes.

**Q: Can I use PayPal instead?**  
A: Yes! Let us know and we'll switch your payout method.

**Q: Do I have to pay taxes on this?**  
A: Yes. We'll send you a 1099-K form if you earn $600+ per year.

**Q: What if a customer cancels?**  
A: Commission is only paid on active subscriptions. If they cancel, no commission for that month.

---

**File Location**: `campaigns/influencer-outreach/automation/STRIPE_PAYPAL_SETUP.md`

**Next Steps**:
1. Set up Stripe Connect account
2. Test with 1-2 influencers before scaling
3. Integrate with Zapier for automated payouts
4. Build influencer dashboard in React
5. Prepare tax compliance forms
