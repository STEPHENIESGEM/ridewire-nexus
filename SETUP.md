# RideWire AI Hub - Setup & Deployment Guide

## Quick Start (Local Development)

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v12.0 or higher (for production) or SQLite (for development)
- **Git**: Latest stable version

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
cd ridewire-ai-hub
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment

Create your environment configuration file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# AI Service API Keys
OPENAI_API_KEY=sk-...                # Your OpenAI API key
ANTHROPIC_API_KEY=sk-ant-...         # Your Anthropic Claude API key
GOOGLE_API_KEY=AIza...               # Your Google Gemini API key

# Security Configuration
JWT_SECRET=your_secure_jwt_secret    # Generate with: openssl rand -base64 32

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ridewire  # PostgreSQL
# OR
DB_PATH=./data/ridewire.db          # SQLite (development only)

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### 4. Initialize the Database

For PostgreSQL:
```bash
npm run db:init
```

For SQLite (development):
```bash
node -e "require('./schema.sql')"
```

#### 5. Start the Application

**Backend only:**
```bash
npm start
```

**Full stack (Backend + Frontend with hot reload):**
```bash
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **API Endpoints**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

---

## Production Deployment

### Recommended Hosting Platforms

#### Option 1: Railway (Recommended)

Railway provides the simplest deployment experience with automatic PostgreSQL provisioning:

```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Deploy via web interface
# 1. Visit https://railway.app
# 2. Connect your GitHub repository
# 3. Add PostgreSQL from the marketplace
# 4. Configure environment variables
# 5. Deploy automatically
```

#### Option 2: Heroku

Traditional platform-as-a-service with excellent PostgreSQL integration:

```bash
# Install Heroku CLI
# Visit https://devcenter.heroku.com/articles/heroku-cli

# Login and create application
heroku login
heroku create ridewire-ai-hub

# Add PostgreSQL database
heroku addons:create heroku-postgresql:hobby-dev

# Configure environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set ANTHROPIC_API_KEY=sk-ant-...
heroku config:set GOOGLE_API_KEY=AIza...
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Deploy
git push heroku main
```

#### Option 3: Vercel (Frontend) + Railway (Backend)

Split deployment for optimal performance:

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel deploy
```

**Backend (Railway):**
Deploy backend separately using Railway's GitHub integration.

#### Option 4: DigitalOcean App Platform

Containerized deployment with managed database:

1. Connect your GitHub repository at [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Add managed PostgreSQL database
3. Configure environment variables in the dashboard
4. Deploy with automatic CI/CD

---

## Payment Integration (Revenue Generation)

### Stripe Setup

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Obtain API Keys**: Navigate to Developers → API keys
3. **Configure Environment**: Add to `.env`:

```env
STRIPE_PUBLIC_KEY=pk_live_...    # Use pk_test_... for development
STRIPE_SECRET_KEY=sk_live_...    # Use sk_test_... for development
```

### Subscription Tiers

Configure your pricing model:

- **Free Tier**: 50 messages/month (limited to single AI)
- **Pro Tier**: $9.99/month (500 messages, multi-AI consensus)
- **Enterprise Tier**: $99/month (unlimited messages, API access, custom integrations)

---

## Project Architecture

```
ridewire-ai-hub/
├── server.js                      # Express backend & API routes
├── encryption.js                  # Zero-knowledge encryption module
├── multiAIOrchestrator.js         # Multi-AI consensus engine
├── schema.sql                     # Database schema (PostgreSQL/SQLite)
├── package.json                   # Dependencies & npm scripts
├── .env.example                   # Environment configuration template
├── webpack.config.js              # Frontend build configuration
└── frontend/
    ├── App.jsx                    # React root component & routing
    ├── components/                # Reusable React components
    │   ├── Chat.jsx              # Multi-AI chat interface
    │   ├── Login.jsx             # User authentication
    │   ├── Register.jsx          # User registration
    │   ├── Dashboard.jsx         # User dashboard
    │   └── Pricing.jsx           # Subscription tiers
    ├── styles/                    # CSS stylesheets
    │   ├── Auth.css
    │   ├── Chat.css
    │   └── Dashboard.css
    └── public/
        └── index.html             # HTML entry point
```

---

## Key Features

✅ **Multi-AI Consensus Engine**: Combines ChatGPT, Claude, and Gemini for validated insights  
✅ **Zero-Knowledge Encryption**: Client-side AES-256 encryption for all user data  
✅ **JWT Authentication**: Secure session management with token expiration  
✅ **PostgreSQL/SQLite Support**: Production-ready database with development fallback  
✅ **Production-Ready Frontend**: Modern React interface with responsive design  
✅ **Subscription Management**: Stripe integration for tiered pricing  
✅ **RESTful API**: Well-documented endpoints for all operations

---

## Support & Issues

### Getting Help

- **GitHub Issues**: [Report bugs and request features](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues)
- **Technical Support**: support@ridewireai.com
- **Documentation**: Comprehensive guides in the `/docs` directory
- **Security Issues**: security@ridewireai.com (see [SECURITY.md](SECURITY.md))

---

## License

MIT License - See [LICENSE](LICENSE) file for complete details
