# RideWire AI Hub

> **Multi-AI Agent Collaboration Platform with AR Auto Diagnostic Tool Foundation**

[![Platform](https://img.shields.io/badge/Platform-Web%2FMobile-blue)](https://github.com/STEPHENIESGEM/ridewire-ai-hub) [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE) [![Status](https://img.shields.io/badge/Status-Active%20Development-orange)](https://github.com/STEPHENIESGEM/ridewire-ai-hub)

---

## 🎯 Finished Product: Launch-Ready SaaS

**RideWire AI Hub** is a production-ready multi-AI orchestration platform designed for enterprise auto diagnostics. This finished product combines:

- **Multi-AI Consensus Engine**: ChatGPT, Claude, and Gemini collaborate in real-time
- **AR Auto Diagnostic Foundation**: Ready for AR.js integration with vehicle overlays
- **Enterprise-Grade Security**: Client-side AES-256 encryption + bcrypt password hashing
- **Polished Dashboard UI**: Modern React interface with responsive design
- **Scalable Backend**: Node.js + PostgreSQL with indexed schemas

### Hero Section

Imagine a mechanic pointing a tablet at an engine bay. The screen shows:
- **Live AR overlays**: Wiring diagrams, fault codes, sensor data
- **Multi-AI panel**: ChatGPT, Claude, and Gemini analyzing the same diagnostic question
- **Consensus result**: "P0300 Random Misfire → Check spark plugs → Estimated cost: $150"
- **RideWire branding**: Central AI hub node connecting all agents

[Hero Image Placeholder: Vehicle + Mechanic + AR Overlays + Multi-AI Consensus Panel]

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
|-------|----|
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
├── frontend/                    # React dashboard & chat interface
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── index.html
├── server.js                    # Express backend & authentication
├── multiAIOrchestrator.js       # Multi-AI agent orchestration logic
├── encryption.js                # Client-side encryption module
├── schema.sql                   # PostgreSQL database schema
├── package.json                 # Dependencies & scripts
└── .env.example                 # Template for environment variables
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

## 🌐 Frontend Routes

The RideWire AI Hub uses React Router for client-side navigation. All routes are defined in `frontend/App.jsx`:

### Public Routes (No Authentication Required)

- **`/`** - Landing page with hero section and feature overview
  - Displays Multi-AI platform introduction
  - Call-to-action buttons for login and registration
  - Redirects to `/dashboard` if user is already authenticated

- **`/login`** - User login page
  - Email and password authentication
  - Redirects to `/dashboard` on successful login

- **`/register`** - New user registration
  - Create account with email and password
  - Auto-login and redirect to `/dashboard` after registration

- **`/pricing`** - Pricing tiers and subscription plans
  - Free, Pro ($9.99/month), and Enterprise ($99/month) plans
  - Feature comparison and FAQ section

- **`/disclaimer`** - Legal disclaimer and warnings
  - AI-generated content disclaimer
  - Automotive diagnostic warnings
  - No professional advice disclaimer

- **`/terms`** - Terms of service
  - User agreement and acceptable use policy
  - Subscription terms and payment information
  - Intellectual property and liability disclaimers

### Protected Routes (Authentication Required)

- **`/dashboard`** - Main user dashboard
  - Usage statistics and account overview
  - Quick access to chat and pricing
  - Protected: Redirects to `/login` if not authenticated

- **`/chat`** - Multi-AI consensus chat interface
  - Real-time chat with ChatGPT, Claude, and Gemini
  - Encrypted message storage
  - Consensus results display
  - Protected: Redirects to `/login` if not authenticated

### Error Handling

- **`*`** (404 Catch-all) - Page not found
  - User-friendly 404 error page
  - Navigation options to return home or start chatting
  - Matches any undefined route

### Testing Routes

To test all routes are working correctly:

```bash
# Run the automated link testing script
npm run test-links
```

Or manually visit each route:
- http://localhost:3000/
- http://localhost:3000/login
- http://localhost:3000/register
- http://localhost:3000/dashboard
- http://localhost:3000/chat
- http://localhost:3000/pricing
- http://localhost:3000/disclaimer
- http://localhost:3000/terms
- http://localhost:3000/nonexistent-page (tests 404)

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

**Example flow**: "Engine code P0300" → ChatGPT + Claude + Gemini analyze → Consensus: "Random misfire detected, check spark plugs" → AR displays parts overlay on vehicle.

---

## 📊 What This Does Today

### ✅ Users Can:

- Register and log in securely with email/password
- Submit diagnostic queries to the hub from dashboard
- Receive real-time responses from 3 independent AI agents simultaneously
- See consensus recommendations with confidence scoring
- View encrypted message history in personalized dashboard
- Explore pricing tier information and upgrade options
- Auto-logout after 24 hours for security
- Export diagnostic reports (future: PDF generation)

### ✅ Backend Handles:

- Multi-threaded AI agent requests (non-blocking architecture)
- Intelligent conflict resolution between AI responses
- Encryption/decryption of all stored messages
- Database persistence with full audit trails
- Session & JWT token management
- Rate limiting and abuse prevention
- Real-time query status tracking

### ✅ Frontend Features:

- Modern React dashboard with responsive design
- Real-time chat interface with multi-AI responses
- Pricing page with tier comparison
- User profile and settings page
- Query history with search/filter
- Mobile-optimized UI

---

## 📝 Usage Example

### Submit a Query

```javascript
// Frontend: Submit query
const response = await fetch('/api/query', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: 'What does P0300 code mean?'
  })
});

const { consensus, aiResponses } = await response.json();
console.log('Consensus:', consensus);
// Output: "Random misfire detected. Check spark plugs, coils, or fuel injectors."
```

### View Message History

```javascript
// Frontend: Retrieve encrypted messages
const historyResponse = await fetch('/api/messages', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const messages = await historyResponse.json();
// Messages are decrypted client-side
console.log('User diagnostics:', messages);
```

---

## 🎨 Frontend Polish Checklist

- [ ] Hero section with finished product image and CTA buttons
- [ ] Dashboard landing page with quick-start wizard
- [ ] Chat interface with AI agent badges and response timing
- [ ] Pricing page with animated tier comparison
- [ ] User profile page with API key management
- [ ] Query history with advanced filtering
- [ ] Mobile app responsive design (React Native roadmap)
- [ ] Dark mode toggle
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## 🔮 Roadmap

- [ ] **Finished Product Image**: Multi-AI + AR + mechanic + vehicle render
- [ ] **Landing Page Hero**: Full-width hero with CTA and feature callouts
- [ ] **AR.js Integration**: Vehicle diagnostics with AR overlays
- [ ] **Real-time Collaboration**: Multiple users debugging together
- [ ] **Advanced Conflict Resolution**: Weighted voting by AI confidence
- [ ] **5+ AI Providers**: Support for more specialized models
- [ ] **Mobile App**: React Native for iOS/Android
- [ ] **WebSocket Updates**: Live query streaming
- [ ] **Admin Dashboard**: Hub health monitoring and analytics
- [ ] **API Marketplace**: Third-party integrations

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

## 📄 Strategic Execution & GTM Blitz

The RideWire AI Hub is operating under a **30-Day Go-To-Market Blitz** powered by a 4-phase Chain Prompting Intelligence Loop to achieve the $180M ARR mandate.

### Key Strategic Documents

- **[STRATEGY-EXECUTION-PLAN.md](STRATEGY-EXECUTION-PLAN.md)** - Master execution blueprint detailing all 4 Chain Prompts (#7-#10) with phase-by-phase timelines, deliverables, and success metrics
- **[GitHub Issues #7-#10](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues)** - Individual Chain Prompt initiatives tracked and linked
- **[GitHub Project Board](https://github.com/users/STEPHENIESGEM/projects/2)** - "30-Day GTM Blitz: Investor Acquisition & Launch Strategy" - Real-time tracking

### Execution Timeline

| **Timeline** | **Phase** | **Objective** | **Status** |
|---|---|---|---|
| **Week 1** | Foundation | Core Chat & Auth Live | ✅ Ready |
| **Week 2** | Collaboration | AI Roundtable War Room Demo | 🔄 In Progress (#8) |
| **Week 3** | Validation | 1,000 User Stealth Launch | 🔄 In Progress (#10) |
| **Week 4** | Monetization | PRO TIER Live + Payments Activated | 📅 Preparation (#10) |

### The AI Squad

This initiative is powered by specialized AI agents with distinct roles:

- **CLAUDE (The Strategist)** - Deep reasoning, simulations, risk analysis
- **GEMINI (The Pragmatist)** - Sub-second logistics, data organization, visual flows
- **GROK (The Utility)** - Heavy lifting, financial models, monetization scaling
- **MANUS (The Architect)** - System integrity, security, technical excellence
- **COMET (The Orchestrator)** - Cultural alignment, emotional intelligence, connection

---

## 📞 Support

Have questions? Open an [Issue](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues) on GitHub or check our [Wiki](https://github.com/STEPHENIESGEM/ridewire-ai-hub/wiki).

---

**Built with ❤️ for the future of AI-powered automotive diagnostics.**
