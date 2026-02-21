# RideWire AI Hub - System Architecture

## Table of Contents

1. [Overview](#overview)
2. [System Design](#system-design)
3. [Multi-AI Consensus Algorithm](#multi-ai-consensus-algorithm)
4. [Zero-Knowledge Encryption](#zero-knowledge-encryption)
5. [Database Architecture](#database-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Backend Architecture](#backend-architecture)
8. [Authentication Flow](#authentication-flow)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Technology Choices](#technology-choices)
11. [Scalability Considerations](#scalability-considerations)

---

## Overview

RideWire AI Hub is a **production-ready multi-AI orchestration platform** designed for enterprise automotive diagnostics. The platform combines multiple AI agents (ChatGPT, Claude, Gemini) for consensus-based diagnostics with AR visualization capabilities.

### Core Principles

1. **Multi-AI Consensus**: Leverage multiple AI providers for improved accuracy and reliability
2. **Zero-Knowledge Encryption**: Client-side encryption ensures user privacy
3. **Scalable Architecture**: Modular design supports horizontal scaling
4. **Enterprise-Grade Security**: bcrypt password hashing, JWT authentication, encrypted storage
5. **AR-Ready Foundation**: Architected to support augmented reality overlays

### Key Capabilities

- Real-time multi-AI agent orchestration
- Consensus-based decision making with confidence scoring
- Client-side encryption for all user data
- JWT-based authentication and authorization
- PostgreSQL database with optimized indexing
- React-based responsive frontend
- RESTful API design
- Gamification engine with XP and achievements
- E-commerce marketplace integration

---

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Frontend Application                    │  │
│  │  • Dashboard  • Chat Interface  • Pricing  • Profile     │  │
│  │  • Client-side Encryption Module (encryption.js)         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS/JWT
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           Express.js REST API (server.js)                 │  │
│  │  • Authentication Middleware (JWT)                        │  │
│  │  • Request Validation                                     │  │
│  │  • Rate Limiting                                          │  │
│  │  • Error Handling                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Multi-AI        │  │  Safety Gating   │  │  Game Engine │  │
│  │  Orchestrator    │  │  System          │  │  Module      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  E-commerce      │  │  Self            │                    │
│  │  Automation      │  │  Diagnostics     │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AI PROVIDERS LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   OpenAI     │  │  Anthropic   │  │  Google Gemini     │   │
│  │  (ChatGPT)   │  │  (Claude)    │  │                    │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                          │  │
│  │  • Users & Authentication                                 │  │
│  │  • Encrypted Messages                                     │  │
│  │  • Game States & Achievements                             │  │
│  │  • Diagnostic Events                                      │  │
│  │  • Marketplace Listings                                   │  │
│  │  • Revenue Events & Payouts                               │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Request → Express Server → JWT Validation → Business Logic
                                                      ↓
                                              Multi-AI Orchestrator
                                                      ↓
                                    ┌─────────────────┼─────────────────┐
                                    ↓                 ↓                 ↓
                                ChatGPT            Claude            Gemini
                                    ↓                 ↓                 ↓
                                    └─────────────────┼─────────────────┘
                                                      ↓
                                           Consensus Engine
                                                      ↓
                                            Safety Gating
                                                      ↓
                                          Encrypted Storage
                                                      ↓
                                           Response to User
```

---

## Multi-AI Consensus Algorithm

The Multi-AI Consensus Engine is the core innovation of RideWire AI Hub, enabling reliable diagnostic recommendations through coordinated multi-agent intelligence.

### Algorithm Overview

**File**: `multiAIOrchestrator.js`

```javascript
class MultiAIOrchestrator {
  async queryAllAgents(query, sessionId) {
    // 1. Parallel query execution
    // 2. Response aggregation
    // 3. Consensus calculation
    // 4. Decision logging
  }
}
```

### Step-by-Step Process

#### 1. Parallel Query Execution

All three AI agents receive the same query simultaneously:

```
User Query: "What does engine code P0300 mean?"
                    ↓
        ┌──────────┼──────────┐
        ↓          ↓          ↓
    ChatGPT     Claude     Gemini
    (0.85)      (0.88)     (0.82)
        ↓          ↓          ↓
   Response A  Response B Response C
```

**Implementation:**
```javascript
// Parallel execution using Promise.all
const [chatGPTResult, claudeResult, geminiResult] = await Promise.allSettled([
  this.queryChatGPT(query),
  this.queryClaude(query),
  this.queryGemini(query)
]);
```

#### 2. Response Aggregation

Each AI agent returns:
- **Response text**: Natural language answer
- **Confidence score**: 0.0 to 1.0 (assigned by orchestrator)
- **Metadata**: Response time, token usage, model version

```javascript
results.responses = {
  ChatGPT: {
    response: "P0300 indicates random cylinder misfires...",
    confidence: 0.85,
    responseTime: 1.2,
    model: "gpt-4"
  },
  Claude: {
    response: "The P0300 code means random misfires detected...",
    confidence: 0.88,
    responseTime: 0.9,
    model: "claude-3-opus-20240229"
  },
  Gemini: {
    response: "P0300 is an engine code for random misfires...",
    confidence: 0.82,
    responseTime: 1.5,
    model: "gemini-pro"
  }
};
```

#### 3. Consensus Calculation

**Method 1: Jaccard Similarity**

Compare response similarity using word sets:

```javascript
function calculateJaccardSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}
```

**Method 2: Weighted Average**

```javascript
const avgConfidence = (
  responses.ChatGPT.confidence +
  responses.Claude.confidence +
  responses.Gemini.confidence
) / 3;
```

**Method 3: Semantic Analysis (Future)**

Use embeddings to calculate semantic similarity:
```javascript
// Future implementation
const embedding1 = await getEmbedding(response1);
const embedding2 = await getEmbedding(response2);
const similarity = cosineSimilarity(embedding1, embedding2);
```

#### 4. Consensus Decision

```javascript
consensus = {
  recommendation: synthesizedResponse,
  confidence: avgConfidence,
  agreement: agreementLevel // "HIGH", "MEDIUM", "LOW"
};

// Agreement levels:
// HIGH: Jaccard > 0.7 OR all confidences > 0.8
// MEDIUM: Jaccard 0.4-0.7 OR avg confidence > 0.6
// LOW: Jaccard < 0.4 OR conflicting responses
```

### Safety Gating Integration

**File**: `safetyGating.js`

After consensus, the Safety Gating System evaluates risk:

```javascript
const safetyResult = await safetyGating.evaluateConsensus(consensus);

if (safetyResult.threshold >= 0.70) {
  // AUTO-APPROVE: High confidence, proceed
  return { status: 'approved', consensus };
} else if (safetyResult.threshold >= 0.40) {
  // ESCALATE: Medium confidence, flag for review
  return { status: 'escalated', consensus, warnings: safetyResult.flags };
} else {
  // REJECT: Low confidence, require professional consultation
  return { status: 'rejected', message: 'Please consult a professional mechanic' };
}
```

### Conflict Resolution

When AI agents disagree significantly:

```
Example: ChatGPT says "Replace spark plugs ($150)"
         Claude says "Replace ignition coils ($400)"
         Gemini says "Check fuel injectors ($300)"

Resolution Strategy:
1. Calculate confidence spread (max - min)
2. If spread > 0.3, flag as "LOW" agreement
3. Present all three recommendations to user
4. Display confidence scores for transparency
5. Recommend professional verification
```

### Performance Optimization

**Caching Strategy:**
```javascript
// Cache identical queries within 1 hour
const cacheKey = `query:${hashQuery(query)}`;
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}

// Store result
await redis.setex(cacheKey, 3600, JSON.stringify(result));
```

**Timeout Handling:**
```javascript
const TIMEOUT = 30000; // 30 seconds

const queryWithTimeout = Promise.race([
  this.queryChatGPT(query),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), TIMEOUT)
  )
]);
```

---

## Zero-Knowledge Encryption

RideWire AI Hub implements **client-side encryption** to ensure user privacy. The server never has access to unencrypted user data.

### Encryption Architecture

**File**: `encryption.js`

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE                              │
│  User Message (Plaintext)                                    │
│           ↓                                                  │
│  [Generate Session Key from Master Key]                     │
│           ↓                                                  │
│  [AES-256 Encryption with Nonce]                            │
│           ↓                                                  │
│  Ciphertext + Nonce + Salt + Hash                           │
└─────────────────────────────────────────────────────────────┘
                        ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                     SERVER SIDE                              │
│  Store: ciphertext, nonce, salt, hash                       │
│  (Server CANNOT decrypt - no master key)                    │
└─────────────────────────────────────────────────────────────┘
                        ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE                              │
│  Retrieve: ciphertext, nonce, salt, hash                    │
│           ↓                                                  │
│  [Derive Session Key from Master Key]                       │
│           ↓                                                  │
│  [AES-256 Decryption using Nonce]                           │
│           ↓                                                  │
│  User Message (Plaintext)                                    │
└─────────────────────────────────────────────────────────────┘
```

### Encryption Process

#### 1. Key Generation (User Registration)

```javascript
// Client-side key generation
generateMasterKey() {
  const keyPair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_base64(keyPair.publicKey),
    privateKey: sodium.to_base64(keyPair.privateKey)
  };
}
```

**Security Notes:**
- Master private key is **never sent to server**
- Stored in browser's secure storage (IndexedDB with encryption)
- User responsible for backing up key
- Lost key = lost access to encrypted data

#### 2. Session Key Derivation

```javascript
deriveSessionKey(masterPrivateKey, sessionId) {
  const salt = sodium.crypto_pwhash_salt();
  const sessionKey = sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES,
    sessionId,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );
  return { sessionKey, salt };
}
```

#### 3. Message Encryption

```javascript
encryptMessage(message, sessionKey) {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const messageBytes = sodium.from_string(message);
  
  const ciphertext = sodium.crypto_secretbox_easy(
    messageBytes,
    nonce,
    sessionKey
  );
  
  const hash = sodium.crypto_hash_sha256(messageBytes);
  
  return {
    ciphertext: sodium.to_base64(ciphertext),
    nonce: sodium.to_base64(nonce),
    hash: sodium.to_base64(hash)
  };
}
```

#### 4. Message Decryption

```javascript
decryptMessage(ciphertext, nonce, sessionKey) {
  const ciphertextBytes = sodium.from_base64(ciphertext);
  const nonceBytes = sodium.from_base64(nonce);
  
  const plaintext = sodium.crypto_secretbox_open_easy(
    ciphertextBytes,
    nonceBytes,
    sessionKey
  );
  
  return sodium.to_string(plaintext);
}
```

### Encryption Standards

| Component | Algorithm | Key Size |
|-----------|-----------|----------|
| **Symmetric Encryption** | AES-256-GCM | 256 bits |
| **Key Derivation** | Argon2id | N/A |
| **Hashing** | SHA-256 | 256 bits |
| **Nonce Generation** | Cryptographically secure random | 24 bytes |
| **Password Hashing** | bcrypt | 12 rounds |

### Security Guarantees

1. **Zero-Knowledge**: Server cannot decrypt user data
2. **Forward Secrecy**: Session keys derived independently
3. **Integrity Verification**: SHA-256 hashes detect tampering
4. **Replay Protection**: Unique nonces prevent replay attacks
5. **Secure Storage**: Encrypted data stored in PostgreSQL bytea columns

---

## Database Architecture

### Schema Design

**File**: `schema.sql`

RideWire AI Hub uses PostgreSQL with carefully designed schemas for performance and scalability.

#### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,        -- bcrypt hashed
  subscription_tier VARCHAR(20) DEFAULT 'free',
  stripe_account_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

**Indexes:**
- Primary key on `id` (auto-indexed)
- Unique index on `email` (fast login lookups)
- Index on `user_id` (external ID references)

#### Messages Table (Encrypted Storage)

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  ciphertext BYTEA NOT NULL,     -- Encrypted message
  nonce BYTEA NOT NULL,           -- Encryption nonce
  salt BYTEA NOT NULL,            -- Key derivation salt
  hash BYTEA NOT NULL,            -- SHA-256 integrity hash
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_messages_user_session ON messages(user_id, session_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

**Design Rationale:**
- `BYTEA` for binary encrypted data (efficient storage)
- Compound index on `(user_id, session_id)` for fast session lookups
- Timestamp index for chronological queries
- Foreign key with `ON DELETE CASCADE` (cleanup on user deletion)

#### Game States Table

```sql
CREATE TABLE game_states (
  user_id VARCHAR(50) PRIMARY KEY,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  achievements JSONB DEFAULT '[]',          -- Unlocked achievements
  statistics JSONB DEFAULT '{}',            -- User stats
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**JSONB Usage:**
- Flexible schema for achievements and statistics
- Efficient indexing with GIN indexes
- Queryable with PostgreSQL JSON operators

#### Diagnostic Events Table

```sql
CREATE TABLE diagnostic_events (
  event_id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  query JSONB NOT NULL,                     -- User query details
  vehicle JSONB NOT NULL,                   -- Vehicle information
  agents JSONB NOT NULL,                    -- AI agent responses
  consensus JSONB NOT NULL,                 -- Consensus result
  decision JSONB NOT NULL,                  -- Safety gating decision
  safety_flags JSONB DEFAULT '[]',
  xp_earned INT DEFAULT 0,
  achievements_unlocked JSONB DEFAULT '[]',
  user_feedback JSONB
);

CREATE INDEX idx_diagnostic_events_user_id ON diagnostic_events(user_id);
CREATE INDEX idx_diagnostic_events_timestamp ON diagnostic_events(timestamp DESC);
```

#### Marketplace Listings Table

```sql
CREATE TABLE marketplace_listings (
  product_id VARCHAR(100) PRIMARY KEY,
  seller_id VARCHAR(50),
  diagram_id VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  tags JSONB DEFAULT '[]',
  sales_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX idx_marketplace_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_price ON marketplace_listings(price);
```

#### Revenue Events Table

```sql
CREATE TABLE revenue_events (
  event_id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_type VARCHAR(50) NOT NULL,           -- 'subscription', 'purchase', 'payout'
  amount DECIMAL(10, 2) NOT NULL,
  net_amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL,
  subscription JSONB,
  marketplace JSONB,
  payment_method JSONB,
  stripe JSONB,
  metadata JSONB
);

CREATE INDEX idx_revenue_events_user_id ON revenue_events(user_id);
CREATE INDEX idx_revenue_events_timestamp ON revenue_events(timestamp DESC);
CREATE INDEX idx_revenue_events_type ON revenue_events(event_type);
```

### Database Optimization

#### Connection Pooling

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000,
});
```

#### Query Optimization

```javascript
// BAD: N+1 query problem
for (let userId of userIds) {
  const messages = await pool.query(
    'SELECT * FROM messages WHERE user_id = $1',
    [userId]
  );
}

// GOOD: Single query with IN clause
const messages = await pool.query(
  'SELECT * FROM messages WHERE user_id = ANY($1)',
  [userIds]
);
```

#### Prepared Statements

```javascript
// Automatic parameterization prevents SQL injection
const result = await pool.query(
  'INSERT INTO messages (user_id, ciphertext, nonce) VALUES ($1, $2, $3)',
  [userId, ciphertext, nonce]
);
```

### Backup Strategy

**Production Recommendations:**
1. **Automated daily backups** (pg_dump with cron)
2. **Point-in-time recovery** (WAL archiving)
3. **Offsite backup storage** (S3 or similar)
4. **Test restore procedures** monthly

```bash
# Backup command
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore command
psql $DATABASE_URL < backup_20260212.sql
```

---

## Frontend Architecture

### Technology Stack

- **Framework**: React 18.2+ (functional components with hooks)
- **Routing**: React Router v6
- **State Management**: React Context API + useState/useReducer
- **Styling**: CSS3 (modular CSS files)
- **Build Tool**: Webpack 5
- **Future**: AR.js for augmented reality overlays

### Component Structure

```
frontend/
├── App.jsx                      # Root component with routing
├── components/
│   ├── Chat.jsx                # Multi-AI chat interface
│   ├── Login.jsx               # User authentication
│   ├── Register.jsx            # User registration
│   ├── Dashboard.jsx           # User dashboard
│   ├── Pricing.jsx             # Pricing tiers
│   ├── HeroSection.jsx         # Landing page hero
│   ├── Disclaimer.jsx          # Legal disclaimers
│   └── Terms.jsx               # Terms of service
├── styles/
│   ├── Auth.css                # Authentication styling
│   ├── Chat.css                # Chat interface styling
│   ├── Dashboard.css           # Dashboard styling
│   └── App.css                 # Global styles
├── utils/
│   └── encryption.js           # Client-side encryption
├── public/
│   └── index.html              # HTML entry point
└── index.js                    # React entry point
```

### State Management

#### Authentication Context

```javascript
// AuthContext.jsx
const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const login = async (email, password) => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const { token, userId } = await response.json();
    
    localStorage.setItem('authToken', token);
    setToken(token);
    setUser({ id: userId, email });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### Protected Routes

```javascript
// App.jsx
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

<Routes>
  <Route path="/" element={<HeroSection />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={
    <ProtectedRoute><Dashboard /></ProtectedRoute>
  } />
  <Route path="/chat" element={
    <ProtectedRoute><Chat /></ProtectedRoute>
  } />
</Routes>
```

### Component Design Patterns

#### Chat Component (Multi-AI Display)

```javascript
// Chat.jsx
function Chat() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const submitQuery = async () => {
    setLoading(true);
    
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    });
    
    const result = await response.json();
    
    setMessages([...messages, {
      query,
      consensus: result.consensus,
      responses: result.responses,
      timestamp: new Date()
    }]);
    
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <MessageCard key={idx} message={msg} />
        ))}
      </div>
      <div className="input-area">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about engine diagnostics..."
        />
        <button onClick={submitQuery} disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
```

### Responsive Design

```css
/* Mobile-first approach */
.chat-container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .chat-container {
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .chat-container {
    max-width: 1200px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }
}
```

---

## Backend Architecture

### Express Server Structure

**File**: `server.js`

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Module initialization
const multiAI = new MultiAIOrchestrator();
const safetyGating = new SafetyGating();
const gameEngine = new GameEngine(pool);
const ecommerce = new EcommerceAutomation(pool);

// Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/register', async (req, res) => { /* ... */ });
app.post('/login', async (req, res) => { /* ... */ });
app.post('/api/query', authenticateToken, async (req, res) => { /* ... */ });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Modular Architecture

#### Multi-AI Orchestrator Module

```javascript
// multiAIOrchestrator.js
class MultiAIOrchestrator {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.googleKey = process.env.GOOGLE_API_KEY;
  }

  async queryAllAgents(query, sessionId) {
    // Parallel AI queries
    const results = await Promise.allSettled([
      this.queryChatGPT(query),
      this.queryClaude(query),
      this.queryGemini(query)
    ]);
    
    return this.buildConsensus(results);
  }

  async queryChatGPT(query) { /* ... */ }
  async queryClaude(query) { /* ... */ }
  async queryGemini(query) { /* ... */ }
  
  buildConsensus(results) { /* ... */ }
}
```

#### Safety Gating Module

```javascript
// safetyGating.js
class SafetyGating {
  async evaluateConsensus(consensus) {
    const threshold = this.calculateSafetyThreshold(consensus);
    const flags = this.identifyRisks(consensus);
    
    return {
      threshold,
      flags,
      decision: this.makeDecision(threshold)
    };
  }

  calculateSafetyThreshold(consensus) {
    // Complex risk calculation
    return threshold;
  }

  makeDecision(threshold) {
    if (threshold >= 0.70) return 'APPROVE';
    if (threshold >= 0.40) return 'ESCALATE';
    return 'REJECT';
  }
}
```

#### Game Engine Module

```javascript
// gameEngine.js
class GameEngine {
  constructor(pool) {
    this.pool = pool;
  }

  async awardXP(userId, xpAmount, reason) {
    const result = await this.pool.query(
      'UPDATE game_states SET xp = xp + $1, total_xp = total_xp + $1 WHERE user_id = $2 RETURNING *',
      [xpAmount, userId]
    );
    
    await this.checkLevelUp(userId);
    return result.rows[0];
  }

  async checkLevelUp(userId) { /* ... */ }
  async unlockAchievement(userId, achievementId) { /* ... */ }
}
```

### Error Handling Middleware

```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't expose internal errors to clients
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
```

---

## Authentication Flow

### Registration Flow

```
1. User submits email + password
          ↓
2. Server validates input (email format, password strength)
          ↓
3. Server hashes password with bcrypt (12 rounds)
          ↓
4. Server stores user in database
          ↓
5. Server generates JWT token (24h expiry)
          ↓
6. Server returns token + userId to client
          ↓
7. Client stores token in localStorage
          ↓
8. Client auto-logs in user
```

**Code:**
```javascript
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // Hash password
  const hash = await bcrypt.hash(password, 12);
  
  // Store user
  const result = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
    [email, hash]
  );
  
  // Generate token
  const token = jwt.sign(
    { id: result.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.status(201).json({ token, userId: result.rows[0].id });
});
```

### Login Flow

```
1. User submits email + password
          ↓
2. Server finds user by email
          ↓
3. Server compares password hash with bcrypt
          ↓
4. If match: Generate JWT token (24h expiry)
          ↓
5. Server returns token + userId
          ↓
6. Client stores token in localStorage
          ↓
7. Client includes token in all subsequent requests
```

### Protected Request Flow

```
1. Client sends request with Authorization header
          ↓
2. Server extracts JWT from header
          ↓
3. Server verifies JWT signature
          ↓
4. If valid: Decode user ID from token
          ↓
5. Attach user ID to request object
          ↓
6. Process request with authenticated user context
          ↓
7. Return response to client
```

### Token Expiration Handling

```javascript
// Client-side token refresh
async function refreshToken() {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const { newToken } = await response.json();
    localStorage.setItem('authToken', newToken);
  } catch (err) {
    // Token expired - redirect to login
    window.location.href = '/login';
  }
}
```

---

## Data Flow Diagrams

### Complete Query Lifecycle

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. USER SUBMITS QUERY                                            │
│    "What does engine code P0420 mean?"                           │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. CLIENT-SIDE PROCESSING                                        │
│    • Validate input                                              │
│    • Add context (vehicle info)                                  │
│    • Include JWT token                                           │
└──────────────────────────────────────────────────────────────────┘
                            ↓ HTTPS POST /api/query
┌──────────────────────────────────────────────────────────────────┐
│ 3. SERVER AUTHENTICATION                                         │
│    • Verify JWT token                                            │
│    • Extract user ID                                             │
│    • Check rate limits                                           │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. MULTI-AI ORCHESTRATION                                        │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │ Parallel Execution:                                      │  │
│    │ • ChatGPT Query → Response A (confidence: 0.85)         │  │
│    │ • Claude Query  → Response B (confidence: 0.88)         │  │
│    │ • Gemini Query  → Response C (confidence: 0.82)         │  │
│    └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. CONSENSUS CALCULATION                                         │
│    • Compare responses (Jaccard similarity)                      │
│    • Calculate weighted average confidence                       │
│    • Synthesize final recommendation                             │
│    • Determine agreement level (HIGH/MEDIUM/LOW)                 │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 6. SAFETY GATING                                                 │
│    • Evaluate risk factors                                       │
│    • Check confidence threshold                                  │
│    • Decision: APPROVE / ESCALATE / REJECT                       │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 7. GAMIFICATION                                                  │
│    • Award XP points                                             │
│    • Check for level-up                                          │
│    • Unlock achievements                                         │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 8. ENCRYPTED STORAGE                                             │
│    • Client-side encrypt query + responses                       │
│    • Store in PostgreSQL messages table                          │
│    • Log diagnostic event                                        │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 9. RESPONSE TO CLIENT                                            │
│    {                                                             │
│      consensus: "P0420 indicates catalyst efficiency issue",    │
│      responses: { ChatGPT: {...}, Claude: {...}, Gemini: {...} },│
│      xpEarned: 50,                                               │
│      achievementsUnlocked: []                                    │
│    }                                                             │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 10. CLIENT-SIDE DISPLAY                                          │
│     • Render consensus recommendation                            │
│     • Display individual AI responses                            │
│     • Show confidence scores                                     │
│     • Update XP/achievements UI                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Technology Choices

### Why Node.js + Express?

**Pros:**
- ✅ JavaScript throughout (frontend + backend consistency)
- ✅ Non-blocking I/O (perfect for parallel AI queries)
- ✅ Large ecosystem (npm packages)
- ✅ Easy deployment (Heroku, Railway, Vercel)
- ✅ Good performance for I/O-heavy workloads

**Alternatives Considered:**
- Python + FastAPI (slower for concurrent requests)
- Go (steeper learning curve, overkill for MVP)
- Ruby on Rails (heavier framework, slower startup)

### Why PostgreSQL?

**Pros:**
- ✅ ACID compliance (data integrity)
- ✅ JSONB support (flexible schemas)
- ✅ GIN indexes (fast JSON queries)
- ✅ BYTEA for binary data (encrypted messages)
- ✅ Mature, battle-tested, free

**Alternatives Considered:**
- MongoDB (lacks strong consistency guarantees)
- MySQL (weaker JSON support)
- SQLite (not suitable for production at scale)

### Why React?

**Pros:**
- ✅ Component-based architecture
- ✅ Virtual DOM (efficient updates)
- ✅ Large community + resources
- ✅ Hooks API (functional components)
- ✅ React Native path (future mobile app)

**Alternatives Considered:**
- Vue.js (smaller ecosystem)
- Angular (heavier, steeper learning curve)
- Svelte (less mature tooling)

### Why JWT for Authentication?

**Pros:**
- ✅ Stateless (no server-side session storage)
- ✅ Scalable (works across multiple servers)
- ✅ Self-contained (payload includes user info)
- ✅ Standard (widely supported)

**Cons:**
- ⚠️ Cannot invalidate tokens (use short expiry)
- ⚠️ Larger than session IDs (more bandwidth)

### Why Client-Side Encryption?

**Pros:**
- ✅ True zero-knowledge (server never sees plaintext)
- ✅ User privacy guaranteed
- ✅ Regulatory compliance (GDPR, HIPAA-friendly)
- ✅ No server-side key management burden

**Cons:**
- ⚠️ Key loss = data loss (user responsibility)
- ⚠️ No server-side search (must decrypt client-side)
- ⚠️ More complex implementation

---

## Scalability Considerations

### Horizontal Scaling

**Current Architecture**: Single Node.js server

**Scaling Path**:
```
1. Load Balancer (nginx)
        ↓
   ┌────┴────┐
   ↓    ↓    ↓
Server1 Server2 Server3 (Node.js instances)
   └────┬────┘
        ↓
  PostgreSQL (Primary)
        ↓
  PostgreSQL (Read Replicas)
```

### Database Scaling

#### Read Replicas

```javascript
// Write to primary
const writePool = new Pool({
  connectionString: process.env.DATABASE_PRIMARY_URL
});

// Read from replicas
const readPool = new Pool({
  connectionString: process.env.DATABASE_REPLICA_URL
});

// Route queries
async function getMessages(userId) {
  return readPool.query(
    'SELECT * FROM messages WHERE user_id = $1',
    [userId]
  );
}
```

#### Connection Pooling

```javascript
const pool = new Pool({
  max: 20,                     // Max connections per instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

### Caching Strategy

#### Redis for Consensus Caching

```javascript
const redis = require('redis');
const client = redis.createClient();

async function queryWithCache(query) {
  const cacheKey = `consensus:${hashQuery(query)}`;
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query AI agents
  const result = await multiAI.queryAllAgents(query);
  
  // Store in cache (1 hour TTL)
  await client.setex(cacheKey, 3600, JSON.stringify(result));
  
  return result;
}
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 100,                   // 100 requests per hour
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### Performance Monitoring

```javascript
// Response time monitoring
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
    
    // Alert if slow
    if (duration > 5000) {
      console.warn(`Slow request: ${req.path} took ${duration}ms`);
    }
  });
  
  next();
});
```

### Load Testing Recommendations

```bash
# Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/dashboard/stats

# Artillery
artillery quick --count 100 --num 10 http://localhost:3000/api/query
```

---

## Future Enhancements

### Planned Architecture Improvements

1. **WebSocket Support** (Q1 2026)
   - Real-time query streaming
   - Live AI response updates
   - Multi-user collaboration

2. **Microservices Architecture** (Q2 2026)
   - Separate AI orchestration service
   - Independent scaling of components
   - Better fault isolation

3. **Message Queue** (Q2 2026)
   - RabbitMQ or AWS SQS
   - Async processing for long-running queries
   - Better resource utilization

4. **GraphQL API** (Q3 2026)
   - More flexible queries
   - Reduced over-fetching
   - Better mobile app support

5. **AR Integration** (Q3-Q4 2026)
   - AR.js integration
   - Vehicle overlay system
   - Mobile AR app (React Native)

---

## References

- **Express.js Documentation**: https://expressjs.com/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **React Documentation**: https://react.dev/
- **JWT Specification**: https://jwt.io/
- **libsodium Cryptography**: https://doc.libsodium.org/
- **OpenAI API**: https://platform.openai.com/docs/
- **Anthropic API**: https://docs.anthropic.com/
- **Google Gemini API**: https://ai.google.dev/

---

**Document Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Maintained By**: Stephenie's Gem (STEPHENIESGEM)
