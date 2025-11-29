# RideWire AI Hub

> **Multi-AI Agent Collaboration Platform with AR Auto Diagnostic Tool Foundation**

[![Platform](https://img.shields.io/badge/Platform-Web%2B%2FMobile-blue)](#) [![License](https://img.shields.io/badge/License-MIT-green)](#) [![Status](https://img.shields.io/badge/Status-Active%20Development-orange)](#)

---

## 🚀 What is RideWire AI Hub?

RideWire AI Hub is a cutting-edge platform that orchestrates multiple AI agents (ChatGPT, Claude, Gemini, and more) to collaborate, debate, and reach **consensus** on user queries. Built as a foundation for AR auto diagnostic tools, it enables real-time multi-AI analysis with encrypted message storage, user authentication, and a polished dashboard UI.

### Core Features

- **Multi-AI Collaboration**: Three independent AI agents analyze queries simultaneously and reach consensus
- **AR Auto Diagnostic Foundation**: Ready for integration with AR overlays for vehicle diagnostics
- **Secure Message Storage**: Client-side encryption for all communications
- **User Authentication**: Session-based login with secure credential handling
- **Real-Time Consensus**: Dynamic resolution of conflicting AI recommendations
- **Responsive Dashboard**: Modern UI for chat, diagnostics, and pricing tiers
- **Encryption Module**: End-to-end encrypted message storage with secure keys

---

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, CSS3, AR.js (foundation) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL with indexed schemas |
| **AI Integration** | OpenAI (ChatGPT), Anthropic (Claude), Google (Gemini) |
| **Security** | Client-side AES-256 encryption, bcrypt password hashing |
| **Authentication** | JWT tokens, session management |

---

## 🎯 Architecture Overview

```
User Query
    ↓
[RideWire AI Hub]
    ↓
┌─────────────────────────────────────┐
│  Multi-AI Orchestrator              │
│  ├─ ChatGPT Agent                   │
│  ├─ Claude Agent                    │
│  └─ Gemini Agent                    │
└─────────────────────────────────────┘
    ↓
[Consensus Engine]
    ├─ Compare Responses
    ├─ Resolve Conflicts
    └─ Generate Final Answer
    ↓
[Encrypted Storage]
    ├─ User Messages
    ├─ AI Responses
    └─ Audit Log
    ↓
Dashboard Display
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- API keys for: OpenAI, Anthropic, Google Gemini

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
   cd ridewire-ai-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database URL
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   # This runs schema.sql and creates users/messages tables
   ```

5. **Start the server**
   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

6. **Access the dashboard**
   ```
   Open browser → http://localhost:3000/dashboard
   ```

---

## 📦 Project Structure

```
ridewire-ai-hub/
├── frontend/                  # React dashboard & chat interface
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── index.html
├── server.js                  # Express backend & authentication
├── multiAIOrchestrator.js     # Multi-AI agent orchestration logic
├── encryption.js              # Client-side encryption module
├── schema.sql                 # PostgreSQL database schema
├── package.json               # Dependencies & scripts
└── .env.example               # Template for environment variables
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/logout` - User logout

### Messages & Queries
- `POST /api/query` - Submit query to multi-AI hub (requires auth)
- `GET /api/messages` - Retrieve user message history (encrypted)
- `GET /api/consensus/:queryId` - Get consensus result for a specific query

### Dashboard
- `GET /api/dashboard/stats` - User statistics & query count
- `GET /api/dashboard/pricing` - Pricing tier information

---

## 🛡️ Security Features

- **Encryption**: All messages encrypted client-side with AES-256 before storage
- **Password Hashing**: Passwords hashed with bcrypt (12 rounds)
- **JWT Tokens**: Session tokens expire after 24 hours
- **Database Indexes**: Optimized queries on user_id, created_at for performance
- **Audit Logging**: All queries and consensus results stored with timestamps

---

## 🚗 AR Auto Diagnostic Foundation

The platform is architected to support AR diagnostics:

1. **Query Input**: User asks about vehicle issue (e.g., "Check engine light meaning")
2. **Multi-AI Analysis**: All three AIs analyze the question
3. **Consensus Result**: Combined diagnostic recommendation
4. **AR Integration Ready**: Output can be mapped to AR overlays for visual display
5. **Encrypted Storage**: Diagnostic history stored securely for future reference

*Example*: "Engine code P0300" → ChatGPT + Claude + Gemini analyze → Consensus: "Random misfire detected, check spark plugs" → AR displays parts overlay on vehicle.

---

## 📊 What This Does Today

✅ **Users can**:
- Register and log in securely
- Submit diagnostic queries to the hub
- Receive real-time responses from 3 independent AI agents
- See consensus recommendations
- View encrypted message history in dashboard
- Explore pricing tier information
- Auto-logout after 24 hours

✅ **Backend handles**:
- Multi-threaded AI agent requests (no blocking)
- Conflict resolution between AI responses
- Encryption/decryption of all stored messages
- Database persistence with audit trails
- Session & token management

---

## 📝 Usage Example

```javascript
// Frontend: Submit query
const response = await fetch('/api/query', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ query: 'What does P0300 code mean?' })
});
const { consensus, aiResponses } = await response.json();
console.log('Consensus:', consensus);
```

---

## 🔮 Roadmap

- [ ] AR.js integration for vehicle diagnostics
- [ ] Real-time collaborative debugging sessions
- [ ] Advanced conflict resolution with weighted voting
- [ ] Support for 5+ AI providers
- [ ] Mobile app (React Native)
- [ ] WebSocket for live query updates
- [ ] Admin dashboard for monitoring hub health

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

**Stephenie's Gem** ([GitHub](https://github.com/STEPHENIESGEM))

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

Have questions? Open an [Issue](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues) on GitHub or check our [Wiki](https://github.com/STEPHENIESGEM/ridewire-ai-hub/wiki).

---

**Built with ❤️ for the future of AI-powered automotive diagnostics.**
