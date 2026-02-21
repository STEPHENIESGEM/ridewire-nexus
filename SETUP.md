# 🚀 RideWire AI Hub - Setup & Deployment Guide

> **Professional deployment guide for production and development environments**

---

## 🎯 Quick Start (Local Development)

### Prerequisites

Ensure your development environment meets these requirements:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/STEPHENIESGEM/ridewire-ai-hub.git
cd ridewire-ai-hub
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create your environment configuration file:

```bash
cp .env.example .env
```

Edit `.env` with your API keys and configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ridewire

# AI API Keys (Required)
OPENAI_API_KEY=sk-your_openai_key_here
ANTHROPIC_API_KEY=sk-ant-your_claude_key_here
GOOGLE_API_KEY=AIza-your_gemini_key_here

# Authentication & Security
JWT_SECRET=your_secure_jwt_secret_change_this
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Payment Integration
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

> **⚠️ Security Note**: Never commit the `.env` file to version control. Keep your API keys confidential.

### Step 4: Initialize the Database

Create the required database schema:

```bash
npm run db:init
```

This command will:
- Create the `users` table for authentication
- Create the `messages` table for encrypted diagnostic history
- Set up database indexes for optimal performance
- Configure default constraints and relationships

### Step 5: Start the Application

**Option A - Backend Only:**
```bash
npm start
```

**Option B - Full Stack (Backend + Frontend):**
```bash
npm run dev
```

The application will start with hot-reloading enabled for development.

---

## 🌐 Access the Application

Once the server is running, access the platform at:

- **Frontend Dashboard**: http://localhost:3000
- **API Endpoints**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

---

## 🚀 Production Deployment

### Hosting Platform Options

RideWire AI Hub can be deployed to various cloud platforms. Choose the option that best fits your infrastructure needs.

---

#### Option 1: Heroku

**Deployment Steps:**

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create application
heroku create ridewire-ai-hub

# Configure environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set ANTHROPIC_API_KEY=sk-ant-...
heroku config:set GOOGLE_API_KEY=AIza...
heroku config:set JWT_SECRET=your-secure-secret
heroku config:set NODE_ENV=production

# Add PostgreSQL database
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

---

#### Option 2: Railway

**Deployment Steps:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up
```

**Web Dashboard**: Configure environment variables in the Railway dashboard under "Variables"

---

#### Option 3: Vercel (Frontend) + Railway (Backend)

**Frontend Deployment (Vercel):**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel deploy --prod
```

**Backend Deployment (Railway):**
Deploy the backend separately to Railway using the steps above.

---

#### Option 4: DigitalOcean App Platform

**Deployment Steps:**

1. Navigate to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App" and connect your GitHub repository
3. Configure environment variables in the settings panel
4. Select a pricing plan and deploy

**Recommended Configuration:**
- **Instance Size**: Basic (1 GB RAM, 1 vCPU)
- **Database**: Managed PostgreSQL cluster
- **Auto-scaling**: Enable for production workloads

---

## 💳 Payment Integration (Stripe)

### Stripe Configuration

1. **Sign up at Stripe**
   - Create an account at [stripe.com](https://stripe.com)
   - Complete account verification for production use

2. **Retrieve API Keys**
   - Navigate to Developers → API Keys
   - Copy your Publishable Key and Secret Key

3. **Add to Environment Configuration**

```env
# Add these to your .env file
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Subscription Tiers

RideWire AI Hub offers three pricing tiers:

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/month | 50 diagnostic queries/month, Single AI agent |
| **Pro** | $9.99/month | 500 queries/month, Multi-AI consensus, Priority support |
| **Enterprise** | $99/month | Unlimited queries, Custom AI training, Dedicated account manager |

### Testing Payment Integration

Use Stripe's test mode to validate payment flows:

```bash
# Test card numbers (do not use in production)
# Success: 4242 4242 4242 4242
# Declined: 4000 0000 0000 0002
```

---

## 📁 Project Architecture

```
ridewire-ai-hub/
├── server.js                      # Express backend & API routes
├── encryption.js                  # AES-256 encryption module
├── multiAIOrchestrator.js        # Multi-AI consensus engine
├── schema.sql                     # PostgreSQL database schema
├── package.json                   # Dependencies & npm scripts
├── .env.example                   # Environment configuration template
├── .gitignore                     # Files to exclude from version control
│
├── frontend/                      # React application
│   ├── App.jsx                   # Root React component
│   ├── components/               # Reusable UI components
│   │   ├── Chat.jsx             # Multi-AI chat interface
│   │   ├── Login.jsx            # Authentication form
│   │   ├── Register.jsx         # User registration
│   │   ├── Dashboard.jsx        # User dashboard
│   │   └── Pricing.jsx          # Subscription pricing page
│   ├── styles/                   # CSS stylesheets
│   │   ├── Auth.css             # Authentication styling
│   │   └── Chat.css             # Chat interface styling
│   └── public/                   # Static assets
│       └── index.html            # HTML entry point
│
├── scripts/                       # Automation & deployment scripts
│   ├── deploy-all.sh             # Complete deployment automation
│   ├── coco-automation.sh        # Content generation scripts
│   ├── gumroad-sync.sh           # Product catalog management
│   └── test-links.js             # Route testing utility
│
├── docs/                          # Documentation
│   ├── api/                      # API documentation
│   ├── architecture/             # System architecture diagrams
│   └── guides/                   # User guides & tutorials
│
└── schemas/                       # JSON schemas for validation
    ├── user.schema.json
    └── diagnostic.schema.json
```

---

## ✅ Production-Ready Features

RideWire AI Hub includes comprehensive capabilities for enterprise deployment:

✅ **Multi-AI Consensus Engine** - ChatGPT, Claude, and Gemini working in parallel  
✅ **Client-Side Encryption** - AES-256 encryption for all diagnostic data  
✅ **JWT Authentication** - Secure token-based user sessions  
✅ **PostgreSQL Database** - Enterprise-grade relational database with indexes  
✅ **Production-Ready React Frontend** - Modern, responsive UI optimized for all devices  
✅ **Subscription Management** - Integrated Stripe payment processing  
✅ **RESTful API** - Comprehensive API with OpenAPI documentation  
✅ **Automated Deployment Scripts** - One-command deployment to major cloud platforms  
✅ **Security Auditing** - Complete audit trail for compliance  
✅ **Rate Limiting** - API protection against abuse  

---

## 🆘 Support & Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Verify PostgreSQL is running
psql --version
pg_ctl status

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**Missing Environment Variables**
```bash
# Verify all required variables are set
npm run check-env
```

**API Key Issues**
- Ensure API keys are valid and have proper permissions
- Check API rate limits and quotas
- Verify keys are correctly formatted (no extra spaces)

### Getting Help

- 📧 **Technical Support**: [support@ridewireai.com](mailto:support@ridewireai.com)
- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues)
- 💬 **Community Discussions**: [GitHub Discussions](https://github.com/STEPHENIESGEM/ridewire-ai-hub/discussions)
- 📚 **Documentation**: Check `/docs/` directory for detailed guides

---

## 📚 Additional Documentation

### Essential Guides
- **[README.md](README.md)** - Project overview and feature highlights
- **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** - Advanced deployment strategies
- **[SECURITY.md](SECURITY.md)** - Security policy and vulnerability reporting
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)** - Automation script documentation

### API Documentation
- Full API reference available in `/docs/api/`
- Interactive API playground at `/api/docs` (when server is running)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.

---

## 🎯 Next Steps After Installation

1. **Create Your First Account** - Register at http://localhost:3000/register
2. **Explore the Dashboard** - Familiarize yourself with the interface
3. **Submit a Test Query** - Try asking: "What does engine code P0300 mean?"
4. **Review AI Responses** - See how multi-AI consensus works
5. **Customize Configuration** - Adjust settings in `.env` for your needs
6. **Deploy to Production** - Follow the deployment guides above

---

**Need Help?** Contact our support team at [support@ridewireai.com](mailto:support@ridewireai.com)

**Ready for Production?** Check out our [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for enterprise deployment strategies.

---

© 2026 RideWire AI Hub. All rights reserved.
