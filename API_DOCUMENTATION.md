# RideWire AI Hub - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limits](#rate-limits)
6. [Code Examples](#code-examples)
7. [WebSocket Support](#websocket-support)

---

## Overview

The RideWire AI Hub API provides a RESTful interface for multi-AI agent orchestration, user authentication, encrypted message storage, and diagnostic query processing. All API endpoints return JSON responses.

**Base URL**: `http://localhost:3000` (development) or your deployed domain (production)

**API Version**: 1.1.0

**Protocol**: HTTPS (production), HTTP (development)

### Quick Start

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword"}'

# 2. Login to get JWT token
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword"}'

# 3. Use the token for authenticated requests
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query":"What does engine code P0300 mean?"}'
```

---

## Authentication

RideWire AI Hub uses **JSON Web Tokens (JWT)** for authentication. Tokens are issued upon successful login or registration and must be included in the `Authorization` header for all protected endpoints.

### Authentication Flow

1. **Register** or **Login** to obtain a JWT token
2. Include token in request headers: `Authorization: Bearer <token>`
3. Tokens expire after **24 hours**
4. Re-authenticate when token expires

### Token Structure

```json
{
  "id": 123,
  "iat": 1707742800,
  "exp": 1707829200
}
```

**Important Security Notes:**
- Store tokens securely (e.g., httpOnly cookies, secure storage)
- Never expose tokens in URLs or logs
- Implement token refresh mechanism for production
- Use HTTPS in production to prevent token interception

### Example: Using JWT Token

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const response = await fetch('http://localhost:3000/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ query: 'Diagnose engine issue' })
});
```

---

## API Endpoints

### Authentication Endpoints

#### POST /register

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 123
}
```

**Error Responses:**
- `400 Bad Request`: Email or password missing
- `500 Internal Server Error`: Database error or email already exists

**Example:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "mySecurePassword"
  }'
```

---

#### POST /login

Authenticate existing user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 123
}
```

**Error Responses:**
- `400 Bad Request`: Email or password missing
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

**Example:**
```javascript
const response = await fetch('http://localhost:3000/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'mySecurePassword'
  })
});

const { token, userId } = await response.json();
localStorage.setItem('authToken', token);
```

---

### Message & Query Endpoints

#### POST /messages

Store an encrypted message in the database.

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "ciphertext": "base64_encoded_ciphertext",
  "nonce": "base64_encoded_nonce",
  "salt": "base64_encoded_salt",
  "hash": "base64_encoded_hash",
  "session_id": "uuid-v4-session-id"
}
```

**Response (201 Created):**
```json
{
  "message": "Message stored successfully",
  "messageId": 456
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Database error

**Example:**
```javascript
// Client-side encryption using encryption.js module
const encrypted = await encryptionModule.encryptMessage(
  message,
  sessionKey
);

const response = await fetch('http://localhost:3000/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    ciphertext: encrypted.ciphertext,
    nonce: encrypted.nonce,
    salt: encrypted.salt,
    hash: encrypted.hash,
    session_id: sessionId
  })
});
```

---

#### GET /messages

Retrieve all encrypted messages for the authenticated user.

**Authentication:** Required (JWT)

**Query Parameters:**
- `session_id` (optional): Filter by specific session
- `limit` (optional): Maximum number of messages (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": 456,
      "user_id": 123,
      "session_id": "uuid-v4-session-id",
      "ciphertext": "base64_encoded_ciphertext",
      "nonce": "base64_encoded_nonce",
      "salt": "base64_encoded_salt",
      "hash": "base64_encoded_hash",
      "timestamp": "2026-02-12T10:30:00.000Z"
    }
  ],
  "total": 42,
  "limit": 100,
  "offset": 0
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Database error

**Example:**
```bash
curl -X GET "http://localhost:3000/messages?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### POST /api/query

Submit a query to the multi-AI orchestrator for consensus-based analysis.

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "query": "What does engine code P0300 mean?",
  "context": {
    "vehicle": {
      "make": "Ford",
      "model": "F-150",
      "year": 2020
    }
  }
}
```

**Response (200 OK):**
```json
{
  "sessionId": "uuid-v4-session-id",
  "timestamp": "2026-02-12T10:30:00.000Z",
  "consensus": {
    "recommendation": "P0300 indicates a random misfire detected. Check spark plugs, ignition coils, or fuel injectors.",
    "confidence": 0.85,
    "agreement": "HIGH"
  },
  "responses": {
    "ChatGPT": {
      "response": "P0300 is a random cylinder misfire code...",
      "confidence": 0.85
    },
    "Claude": {
      "response": "The P0300 code indicates random misfires...",
      "confidence": 0.88
    },
    "Gemini": {
      "response": "P0300 means your engine has random misfires...",
      "confidence": 0.82
    }
  },
  "errors": {}
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: Query missing or invalid
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: AI service error

**Example:**
```javascript
const response = await fetch('http://localhost:3000/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: 'What causes engine oil to turn black?',
    context: {
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2018
      }
    }
  })
});

const result = await response.json();
console.log('Consensus:', result.consensus.recommendation);
```

---

#### GET /api/consensus/:queryId

Retrieve the consensus result for a specific query.

**Authentication:** Required (JWT)

**URL Parameters:**
- `queryId`: The session ID of the query

**Response (200 OK):**
```json
{
  "queryId": "uuid-v4-session-id",
  "consensus": {
    "recommendation": "P0300 indicates random misfires...",
    "confidence": 0.85,
    "agreement": "HIGH"
  },
  "timestamp": "2026-02-12T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Query ID not found
- `500 Internal Server Error`: Database error

---

### Dashboard Endpoints

#### GET /api/dashboard/stats

Get usage statistics for the authenticated user.

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "userId": 123,
  "statistics": {
    "totalQueries": 42,
    "totalMessages": 168,
    "subscriptionTier": "pro",
    "queriesThisMonth": 15,
    "lastQueryDate": "2026-02-12T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Database error

---

#### GET /api/dashboard/pricing

Get pricing tier information (public endpoint).

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "tiers": [
    {
      "name": "Free",
      "price": 0,
      "features": [
        "Single AI diagnostics (ChatGPT only)",
        "50 queries per month",
        "Basic support"
      ]
    },
    {
      "name": "Pro",
      "price": 29,
      "currency": "USD",
      "interval": "month",
      "features": [
        "Multi-AI consensus",
        "500 queries per month",
        "Basic AR overlays",
        "Priority support",
        "Encrypted message history"
      ]
    },
    {
      "name": "Enterprise",
      "price": 99,
      "currency": "USD",
      "interval": "month",
      "features": [
        "Full AR diagnostic suite",
        "Unlimited queries",
        "Custom integrations",
        "API access",
        "Dedicated support"
      ]
    }
  ]
}
```

---

## Error Handling

### Error Response Format

All errors follow a consistent JSON format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional context"
  }
}
```

### HTTP Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters or body |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |
| `503` | Service Unavailable | AI service temporarily unavailable |

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `AUTH_REQUIRED` | Authentication token missing | Include JWT token in Authorization header |
| `INVALID_TOKEN` | JWT token invalid or expired | Re-authenticate and get new token |
| `MISSING_FIELD` | Required field missing | Check request body for required fields |
| `INVALID_EMAIL` | Email format invalid | Provide valid email address |
| `WEAK_PASSWORD` | Password too weak | Use stronger password (8+ characters) |
| `USER_EXISTS` | Email already registered | Use different email or login |
| `INVALID_CREDENTIALS` | Login credentials incorrect | Check email and password |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait before retrying |
| `AI_SERVICE_ERROR` | AI provider unavailable | Try again later |
| `DATABASE_ERROR` | Database connection failed | Contact support |

### Example: Error Handling

```javascript
try {
  const response = await fetch('http://localhost:3000/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query: 'Diagnose issue' })
  });

  if (!response.ok) {
    const error = await response.json();
    
    if (response.status === 401) {
      // Token expired - redirect to login
      window.location.href = '/login';
    } else if (response.status === 429) {
      // Rate limited - show message
      alert('Too many requests. Please wait a moment.');
    } else {
      console.error('API Error:', error);
    }
    return;
  }

  const data = await response.json();
  console.log('Success:', data);
} catch (err) {
  console.error('Network error:', err);
}
```

---

## Rate Limits

To ensure fair usage and prevent abuse, the RideWire AI Hub API implements rate limiting.

### Rate Limit Policies

| Tier | Queries/Hour | Queries/Day | Queries/Month |
|------|--------------|-------------|---------------|
| **Free** | 10 | 20 | 50 |
| **Pro** | 100 | 200 | 500 |
| **Enterprise** | Unlimited | Unlimited | Unlimited |

### Rate Limit Headers

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707745200
```

### Handling Rate Limits

When rate limited (HTTP 429), the response includes retry information:

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 3600
}
```

**Best Practices:**
- Implement exponential backoff for retries
- Cache responses when appropriate
- Monitor rate limit headers
- Upgrade tier if consistently hitting limits

---

## Code Examples

### Complete Authentication & Query Flow

```javascript
// 1. Register new user
async function registerUser(email, password) {
  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data.token;
}

// 2. Login existing user
async function loginUser(email, password) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data.token;
}

// 3. Query multi-AI hub
async function queryAI(token, query) {
  const response = await fetch('http://localhost:3000/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });
  
  const result = await response.json();
  return result;
}

// Usage
(async () => {
  const token = await loginUser('user@example.com', 'password123');
  const result = await queryAI(token, 'What does P0420 mean?');
  console.log('Consensus:', result.consensus.recommendation);
})();
```

### Python Example

```python
import requests
import json

BASE_URL = "http://localhost:3000"

# Login
def login(email, password):
    response = requests.post(
        f"{BASE_URL}/login",
        json={"email": email, "password": password}
    )
    return response.json()["token"]

# Query AI
def query_ai(token, query):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    response = requests.post(
        f"{BASE_URL}/api/query",
        headers=headers,
        json={"query": query}
    )
    return response.json()

# Usage
token = login("user@example.com", "password123")
result = query_ai(token, "Diagnose engine code P0171")
print(f"Consensus: {result['consensus']['recommendation']}")
```

### cURL Examples

```bash
# Register
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Login
TOKEN=$(curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}' \
  | jq -r '.token')

# Query
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"What causes P0300 code?"}'

# Get messages
curl -X GET http://localhost:3000/messages \
  -H "Authorization: Bearer $TOKEN"
```

---

## WebSocket Support

**Status**: 🚧 Coming Soon (Q1 2026)

WebSocket support for real-time query streaming and live updates is planned for a future release.

### Planned Features

- Real-time streaming of AI responses
- Live consensus updates as agents respond
- Multi-user collaboration support
- Server-sent events for notifications

### Example (Future):

```javascript
// Future WebSocket implementation
const ws = new WebSocket('ws://localhost:3000/api/stream');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Streaming response:', data);
};

ws.send(JSON.stringify({
  query: 'Diagnose engine issue',
  token: authToken
}));
```

---

## SDK Support

**Status**: 🚧 Coming Soon

Official SDKs for common languages are planned:

- **JavaScript/TypeScript**: `ridewire-js`
- **Python**: `ridewire-python`
- **Ruby**: `ridewire-ruby`
- **Go**: `ridewire-go`

---

## Support & Resources

- **GitHub Issues**: [https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues)
- **Technical Support**: support@stepheniesgem.io
- **API Questions**: aihub@stepheniesgem.io
- **Documentation**: See [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Legal & Compliance

### Disclaimers

**IMPORTANT**: This platform provides diagnostic assistance tools ONLY.

- AI-generated diagnostics are for **informational purposes only**
- Users should **consult qualified mechanics** and automotive professionals
- RideWire does **not replace professional automotive repair services**
- **No liability** for damages from following AI recommendations
- Users are **responsible for verifying** all diagnostic information

### Data Privacy

- All user data is encrypted with **AES-256**
- API keys must **never be committed** to repositories
- User authentication uses **secure JWT tokens** with expiration
- Passwords are hashed with **bcrypt** (12+ rounds)
- All diagnostic data is **sensitive** and treated accordingly

### Third-Party AI Services

- Responses from OpenAI, Anthropic, and Google are subject to **their terms of service**
- AI model outputs are **not guaranteed to be accurate**
- Platform aggregates multiple AI opinions for improved reliability but **cannot guarantee correctness**

---

**Last Updated**: February 12, 2026  
**API Version**: 1.1.0  
**Documentation Version**: 1.0.0
