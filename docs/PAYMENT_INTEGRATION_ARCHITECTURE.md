# Payment Integration Architecture
## RideWire Oasis Coin App - Technical Specification

**Document Version**: 1.0  
**Last Updated**: December 9, 2025  
**Status**: Architecture Proposal

---

## System Overview

The RideWire Oasis payment system implements a multi-layered architecture combining traditional payment processing (Stripe) with optional blockchain integration (Polygon) and AI-powered fraud detection.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                             │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │ Web Dashboard  │  │ Mobile App     │  │ Checkout Page       │  │
│  │ (React)        │  │ (Future)       │  │ (Stripe Elements)   │  │
│  └────────────────┘  └────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Express.js)                        │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │ Authentication │  │ Rate Limiting  │  │ Request Validation  │  │
│  │ (JWT)          │  │ (10 req/min)   │  │ (Schema Checks)     │  │
│  └────────────────┘  └────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    PAYMENT PROCESSING LAYER                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Payment Router                            │  │
│  │  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │  │
│  │  │ Stripe API  │    │ Crypto Layer │    │ Wallet Connect│  │  │
│  │  │ (Primary)   │    │ (Phase 2)    │    │ (Phase 3)     │  │  │
│  │  └─────────────┘    └──────────────┘    └───────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│               MULTI-AI FRAUD DETECTION ENGINE                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              Multi-AI Orchestrator (Existing)              │    │
│  │                                                            │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │    │
│  │  │  ChatGPT     │  │   Claude     │  │   Gemini     │    │    │
│  │  │              │  │              │  │              │    │    │
│  │  │ Risk: 0.12   │  │ Risk: 0.08   │  │ Risk: 0.15   │    │    │
│  │  │ (Low)        │  │ (Low)        │  │ (Low)        │    │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │    │
│  │                                                            │    │
│  │                   Consensus Algorithm                     │    │
│  │           Weighted Score: 0.11 → APPROVED                 │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                          │
│                                                                      │
│  ┌─────────────────────┐         ┌─────────────────────────────┐   │
│  │  PostgreSQL DB      │         │  Redis Cache                │   │
│  │                     │         │                             │   │
│  │  ├─ users           │         │  ├─ session_tokens          │   │
│  │  ├─ transactions    │         │  ├─ rate_limit_counters     │   │
│  │  ├─ ai_consensus    │         │  └─ transaction_cache       │   │
│  │  ├─ fraud_logs      │         │                             │   │
│  │  └─ audit_trail     │         └─────────────────────────────┘   │
│  │                     │                                            │
│  └─────────────────────┘                                            │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER (Phase 2/3)                      │
│                                                                      │
│  ┌────────────────────────┐      ┌──────────────────────────────┐  │
│  │  Polygon Network       │      │  Smart Contracts             │  │
│  │                        │      │                              │  │
│  │  ├─ USDC Stablecoin   │      │  ├─ ERC-1155 NFT Minting     │  │
│  │  ├─ Gas Optimization  │      │  ├─ Loyalty Token (ERC-20)   │  │
│  │  └─ Transaction Logs  │      │  └─ Affiliate Payouts        │  │
│  │                        │      │                              │  │
│  └────────────────────────┘      └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. User Interface Layer

#### Web Dashboard (Existing)
- **Technology**: React.js
- **Features**: 
  - Product catalog (Avatar outfits $10-50)
  - Shopping cart
  - Purchase history
  - Account management
- **API Endpoints Used**:
  - `GET /api/products` - List available items
  - `POST /api/checkout` - Initiate purchase
  - `GET /api/orders/:id` - Retrieve order status

#### Stripe Checkout (New)
- **Integration**: Stripe Elements (PCI DSS compliant)
- **Payment Methods**: Credit/Debit cards, Apple Pay, Google Pay
- **Flow**:
  1. User selects avatar outfit
  2. Redirected to Stripe-hosted checkout
  3. Payment processed by Stripe
  4. Webhook callback to RideWire API
  5. Order fulfillment triggered

---

### 2. API Gateway Layer

#### Express.js Server (Existing)
- **File**: `server.js`
- **Port**: 3000
- **Middleware**:
  - `express.json()` - JSON body parsing
  - JWT authentication (existing)
  - CORS (Cross-Origin Resource Sharing)
  
#### New Endpoints Required

```javascript
// Payment initiation
POST /api/payment/create-checkout-session
Request:
{
  "product_id": "avatar_outfit_legendary",
  "quantity": 1,
  "user_id": "123"
}
Response:
{
  "session_id": "cs_test_...",
  "checkout_url": "https://checkout.stripe.com/..."
}

// Stripe webhook
POST /api/webhooks/stripe
Headers: stripe-signature
Body: Stripe event payload
Response: 200 OK

// AI consensus validation
POST /api/payment/validate
Request:
{
  "transaction_id": "txn_...",
  "amount": 50.00,
  "user_email": "user@example.com"
}
Response:
{
  "status": "APPROVED",
  "confidence": 0.87,
  "ai_responses": { ... }
}

// Order status
GET /api/orders/:order_id
Response:
{
  "order_id": "ord_123",
  "status": "completed",
  "items": [...],
  "total": 50.00,
  "consensus_result": { ... }
}
```

---

### 3. Payment Processing Layer

#### Stripe Integration (Phase 1)

**Setup**:
```javascript
// Validate Stripe API key before initialization
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create checkout session
app.post('/api/payment/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Avatar Outfit - Legendary',
        },
        unit_amount: 5000, // $50.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });

  res.json({ url: session.url });
});
```

**Webhook Handler**:
```javascript
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill the order
    fulfillOrder(session);
  }

  res.json({received: true});
});
```

#### Crypto Layer (Phase 2 - Future)

**Technology**: Coinbase Commerce or BitPay
**Supported Tokens**: USDC, USDT (stablecoins)
**Network**: Polygon (low gas fees)

**Flow**:
1. User selects "Pay with Crypto"
2. Coinbase Commerce generates payment address
3. User sends USDC to address
4. Coinbase webhook confirms payment
5. Order fulfilled

---

### 4. Multi-AI Fraud Detection

#### Integration with Existing `multiAIOrchestrator.js`

**New Method**:
```javascript
/**
 * Validate payment transaction using AI consensus
 * @param {Object} transaction - Transaction details
 * @returns {Promise<Object>} Consensus validation result
 */
async validateTransaction(transaction) {
  const query = `
    Analyze this payment transaction for fraud risk:
    - Amount: $${transaction.amount}
    - User: ${transaction.user_email}
    - IP: ${transaction.ip_address}
    - Time: ${transaction.timestamp}
    - Previous transactions: ${transaction.user_history_count}
    
    Is this transaction legitimate? Rate risk from 0 (safe) to 1 (fraud).
  `;

  const aiResponses = await this.queryAllAgents(query, transaction.session_id);
  
  // Extract risk scores from AI responses
  const riskScores = {
    ChatGPT: extractRiskScore(aiResponses.responses.ChatGPT),
    Claude: extractRiskScore(aiResponses.responses.Claude),
    Gemini: extractRiskScore(aiResponses.responses.Gemini)
  };

  // Calculate weighted consensus
  const consensusRisk = 
    (riskScores.ChatGPT * 0.35) +
    (riskScores.Claude * 0.40) +
    (riskScores.Gemini * 0.25);

  return {
    status: consensusRisk < 0.3 ? 'APPROVED' : consensusRisk < 0.7 ? 'REVIEW' : 'DECLINED',
    riskScore: consensusRisk,
    aiScores: riskScores,
    recommendation: consensusRisk < 0.3 ? 'Process payment' : 'Flag for manual review'
  };
}
```

**Fraud Detection Criteria**:
- Transaction velocity (>5 purchases in 10 minutes)
- Geographical mismatch (IP vs. billing address)
- Email pattern (disposable email domains)
- Unusual amount (>$500 for new user)
- Previous chargebacks

---

### 5. Database Schema

#### New Tables Required

```sql
-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stripe_payment_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    product_id VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI consensus logs
CREATE TABLE ai_consensus_logs (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    chatgpt_risk DECIMAL(5, 4),
    claude_risk DECIMAL(5, 4),
    gemini_risk DECIMAL(5, 4),
    consensus_risk DECIMAL(5, 4),
    decision VARCHAR(50),
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud alerts
CREATE TABLE fraud_alerts (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    alert_type VARCHAR(100),
    severity VARCHAR(20),
    details TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Influencer affiliates
CREATE TABLE affiliates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    affiliate_code VARCHAR(50) UNIQUE,
    commission_rate DECIMAL(5, 2) DEFAULT 15.00,
    total_sales DECIMAL(10, 2) DEFAULT 0.00,
    total_commission DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate commissions
CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(id),
    transaction_id INTEGER REFERENCES transactions(id),
    commission_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_ai_consensus_transaction_id ON ai_consensus_logs(transaction_id);
CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);
```

---

### 6. Security Controls

#### PCI DSS Compliance
- ✅ **No card data storage**: All payment data handled by Stripe
- ✅ **HTTPS required**: SSL certificate on all pages
- ✅ **Tokenization**: Stripe tokens used instead of card numbers

#### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour per IP
  message: 'Too many payment attempts, please try again later'
});

app.use('/api/payment/', paymentLimiter);
```

#### Transaction Limits
- **Per transaction**: $500 maximum
- **Per day**: $1,000 maximum per user
- **Lifetime (new accounts)**: $5,000 until verified

#### Encryption
- **At rest**: AES-256 encryption for sensitive data (existing)
- **In transit**: TLS 1.3 for all API calls
- **Webhook validation**: Stripe signature verification

---

## Integration Points

### Existing RideWire Components

1. **multiAIOrchestrator.js** (Existing)
   - Already implements 3-AI consensus mechanism
   - Add new `validateTransaction()` method
   - Reuse existing `queryAllAgents()` function

2. **server.js** (Existing)
   - Add payment routes
   - Add Stripe webhook handler
   - Add transaction logging middleware

3. **encryption.js** (Existing)
   - Use for storing transaction metadata
   - Encrypt user payment history

4. **Database** (PostgreSQL - Existing)
   - Add new tables for transactions, consensus logs
   - Reuse existing authentication system

---

## Performance Considerations

### Latency Targets
- **Payment processing**: <2 seconds (Stripe API)
- **AI consensus validation**: <5 seconds (parallel AI queries)
- **Database writes**: <100ms
- **Total checkout time**: <10 seconds

### Scalability
- **Concurrent transactions**: 100/second (Stripe limit)
- **Database connections**: 20 pool size (increase if needed)
- **Redis caching**: Transaction results cached for 1 hour

### Monitoring
- **Stripe Dashboard**: Payment success/failure rates
- **Custom Metrics**:
  - AI consensus latency
  - Fraud detection accuracy
  - Transaction approval rate
  - Average order value

---

## Error Handling

### Payment Failures
```javascript
try {
  const session = await stripe.checkout.sessions.create({...});
  res.json({ url: session.url });
} catch (error) {
  console.error('Stripe error:', error);
  res.status(500).json({ 
    error: 'Payment processing failed',
    message: 'Please try again or contact support'
  });
}
```

### AI Consensus Timeouts
- **Timeout**: 10 seconds per AI agent
- **Fallback**: If 2+ AIs timeout, use rule-based fraud detection
- **Retry**: Exponential backoff (1s, 2s, 4s)

### Database Connection Loss
- **Retry logic**: 3 attempts with 1-second delay
- **Fallback**: Log transaction to file, process later
- **Alert**: Email notification to admin

---

## Deployment Checklist

### Phase 1 (Stripe Only)
- [ ] Install Stripe SDK: `npm install stripe`
- [ ] Add environment variables:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] Deploy database migrations
- [ ] Configure Stripe webhook endpoint
- [ ] Test with Stripe test cards
- [ ] Add Terms of Service + Privacy Policy
- [ ] Launch with transaction monitoring

### Phase 2 (AI Consensus)
- [ ] Update `multiAIOrchestrator.js` with `validateTransaction()`
- [ ] Add fraud detection logic
- [ ] Create AI consensus dashboard
- [ ] Test with simulated fraud scenarios

### Phase 3 (Blockchain)
- [ ] Complete legal review
- [ ] Register with FinCEN
- [ ] Deploy Polygon smart contracts
- [ ] Audit contracts (OpenZeppelin)
- [ ] Integrate Coinbase Commerce
- [ ] Test crypto payments on testnet

---

**Document Status**: Ready for Implementation  
**Next Steps**: Proceed with Phase 1 deployment (Stripe-only presale)
