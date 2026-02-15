# RideWire AI Hub - Setup & Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js v18+ 
- npm v9+
- Git

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

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
GOOGLE_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
DB_PATH=./data/ridewire.db
PORT=3000
NODE_ENV=development
```

4. **Initialize database**
```bash
node -e "require('./schema.sql')"
```

5. **Start the application**

Option A - Backend only:
```bash
npm start
```

Option B - Full stack (Backend + Frontend):
```bash
npm run dev
```

### Access the application
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

---

## Production Deployment

### Hosting Options

#### Option 1: Heroku
```bash
heroku create ridewire-ai-hub
heroku config:set OPENAI_API_KEY=your_key
heroku config:set ANTHROPIC_API_KEY=your_key
heroku config:set GOOGLE_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### Option 2: Railway
```bash
railway link
railway up
```

#### Option 3: Vercel (Frontend) + Railway (Backend)
```bash
vercel deploy
# Deploy backend to Railway
```

#### Option 4: DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Deploy

---

## Payment Integration (Revenue)

### Stripe Setup
1. Sign up at https://stripe.com
2. Get API keys
3. Add to `.env`:
```
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Subscription Tiers
- **Free**: 50 messages/month
- **Pro**: $9.99/month (500 messages)
- **Enterprise**: $99/month (unlimited)

---

## Architecture

```
ridewire-ai-hub/
├── server.js                 # Express backend
├── encryption.js             # Zero-knowledge encryption
├── multiAIOrchestrator.js   # AI consensus logic
├── schema.sql               # Database schema
├── package.json             # Dependencies
├── .env.example            # Configuration template
└── frontend/
    ├── App.jsx             # React root component
    ├── components/         # React components
    │   ├── Chat.jsx       # Chat interface
    │   ├── Login.jsx      # Auth
    │   └── Register.jsx   # Registration
    ├── styles/            # CSS files
    │   ├── Auth.css
    │   └── Chat.css
    └── public/
        └── index.html      # HTML entry point
```

---

## Key Features

✅ Multi-AI Consensus (ChatGPT, Claude, Gemini)
✅ Zero-Knowledge Encryption
✅ JWT Authentication
✅ SQLite Database
✅ Production-Ready React Frontend
✅ Subscription Management
✅ RESTful API

---

## Support & Issues

- GitHub Issues: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues
- Email: support@ridewireai.com

---

## License

MIT License - See LICENSE file
