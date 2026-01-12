# 🤖 RideWire AI Hub - Automation System README

## Overview

This document provides a comprehensive guide to the RideWire AI Hub automation infrastructure, including COCO AI content generation, Gumroad product management, analytics tracking, and system monitoring.

---

## 🎯 Quick Start

### Initialize All Systems
```bash
# 1. Install dependencies
npm install

# 2. Activate COCO AI system
./scripts/automation/activate-coco.sh

# 3. Initialize Gumroad products
node scripts/gumroad/product-sync.js

# 4. Check system status
node scripts/automation/master-control.js

# 5. View live dashboard
cat AUTOMATION_STATUS.md
```

---

## 📁 Directory Structure

```
ridewire-ai-hub/
├── scripts/
│   ├── coco/                     # COCO AI content generation
│   │   ├── generate-content.js  # Video script & content generator
│   │   ├── content-calendar.js  # Mon/Wed/Fri scheduling
│   │   ├── youtube-uploader.js  # Auto-upload to YouTube
│   │   └── analytics-tracker.js # Revenue & views tracking
│   │
│   ├── gumroad/                  # Gumroad product management
│   │   ├── product-sync.js      # Sync products to Gumroad
│   │   ├── revenue-tracker.js   # Track sales & revenue
│   │   └── pricing-optimizer.js # A/B test pricing
│   │
│   ├── automation/               # System automation & monitoring
│   │   ├── activate-coco.sh     # COCO activation script
│   │   ├── coco-monitor.js      # Hourly health checks
│   │   └── master-control.js    # Central control hub
│   │
│   └── partnership/              # Indian Motorcycle partnership
│       └── demo-setup.sh         # Demo environment setup
│
├── indian-motorcycle-partnership/
│   ├── PARTNERSHIP-PROPOSAL.md   # Full partnership proposal
│   └── docs/
│       └── demo-script.md        # Detailed demo script
│
├── .github/workflows/            # GitHub Actions automation
│   ├── coco-content.yml          # Mon/Wed/Fri content generation
│   ├── daily-automation.yml      # Daily tasks
│   └── health-check.yml          # Hourly monitoring
│
├── data/                         # Generated data (gitignored)
│   ├── coco-calendar.json       # Content schedule
│   ├── coco-topics.json         # Video topic queue
│   ├── coco-analytics.json      # YouTube analytics
│   ├── gumroad-products.json    # Product catalog
│   └── gumroad-revenue.json     # Sales tracking
│
└── output/                       # Generated content (gitignored)
    └── coco-videos/             # Video files & metadata
```

---

## 🎬 COCO AI Content Generation

### What It Does
Generates automotive diagnostic educational videos using:
- **OpenAI**: Script writing
- **ElevenLabs**: Voice generation
- **D-ID**: AI avatar video
- **YouTube API**: Auto-upload

### Schedule
**Monday, Wednesday, Friday at 9:00 AM** (configured in GitHub Actions)

### Usage

#### Generate Content Manually
```bash
# Generate video on specific topic
node scripts/coco/generate-content.js "Check Engine Light Quick Fix P0300"

# With custom duration (in minutes)
node scripts/coco/generate-content.js "Harley Davidson Codes" 5
```

#### Manage Content Calendar
```bash
# View current schedule
node scripts/coco/content-calendar.js

# Schedule next 4 videos
node scripts/coco/content-calendar.js --schedule 4

# Get next topic from queue
node scripts/coco/content-calendar.js --next
```

#### Track Analytics
```bash
# View current analytics
node scripts/coco/analytics-tracker.js

# Update analytics from YouTube
node scripts/coco/analytics-tracker.js --update

# Track new video
node scripts/coco/analytics-tracker.js --track VIDEO_ID

# Export to CSV
node scripts/coco/analytics-tracker.js --export analytics.csv
```

#### Upload to YouTube
```bash
# Upload video with metadata
node scripts/coco/youtube-uploader.js output/coco-videos/coco-2024-metadata.json

# Schedule upload for future
node scripts/coco/youtube-uploader.js metadata.json --schedule "2024-01-15T09:00:00Z"

# Add to playlist
node scripts/coco/youtube-uploader.js metadata.json --playlist PLxxxxxxxx
```

### Video Topics
10 default topics in queue:
1. Check Engine Light Quick Fix P0300
2. Harley Davidson Diagnostic Codes Explained
3. AI Multi-Agent Consensus for Brake Problems
4. Top 5 OBD-II Scanner Features to Look For
5. How to Read Transmission Fault Codes
6. Electric Vehicle Diagnostic Basics
7. Understanding ABS Brake System Warning Lights
8. AI-Powered Engine Diagnostics: The Future is Here
9. Common Ford F-150 Diagnostic Issues
10. Diesel Engine Diagnostic Codes: A Complete Guide

---

## 🛒 Gumroad Product Management

### What It Does
Manages 34 digital products across 3 tiers:
- **Tier 1**: 5 products ($17.99-$29.99) - Ready to launch
- **Tier 2**: To be added in Month 2
- **Tier 3**: To be added in Month 3

### Tier 1 Products
1. **RideWire AI Prompt Library** - $17.99
   - 200+ tested AI prompts for diagnostics
   
2. **Multi-AI Diagnostic Report Templates** - $19.99
   - Professional templates for consensus reports
   
3. **OBD-II Code Reference Database** - $29.99
   - 5000+ codes with AI explanations
   
4. **Complete Shop Marketing Kit** - $29.99
   - Social media, email, and ad templates
   
5. **Automotive Shop Pricing Calculator** - $24.99
   - Excel-based pricing and profit tools

### Usage

#### Product Management
```bash
# View product stats
node scripts/gumroad/product-sync.js --stats

# Sync products to Gumroad
node scripts/gumroad/product-sync.js
```

#### Revenue Tracking
```bash
# View revenue report
node scripts/gumroad/revenue-tracker.js

# Update with latest sales
node scripts/gumroad/revenue-tracker.js --update

# Export to CSV
node scripts/gumroad/revenue-tracker.js --export revenue.csv
```

#### Pricing Optimization
```bash
# View current recommendations
node scripts/gumroad/pricing-optimizer.js

# Run pricing optimization analysis
node scripts/gumroad/pricing-optimizer.js --optimize
```

---

## 🏥 System Monitoring

### Master Control System
Central hub for all automation systems.

```bash
# Run system health check
node scripts/automation/master-control.js

# This checks:
# - COCO AI content generation
# - Gumroad product sync
# - Analytics tracking
# - Data storage
# - Overall system health
```

### COCO System Monitor
Hourly health checks for COCO AI.

```bash
# Run COCO health check
node scripts/automation/coco-monitor.js

# This checks:
# - Environment variables
# - Content calendar status
# - Video generation capacity
# - Upload queue
# - Analytics tracking
# - Disk space usage
```

### Automation Status Dashboard
Real-time dashboard showing system status.

```bash
# View dashboard
cat AUTOMATION_STATUS.md

# Dashboard is auto-updated by master-control.js
# Shows:
# - System health
# - Video stats
# - Revenue metrics
# - Next actions
```

---

## 🤝 Indian Motorcycle Partnership

### Materials Available
1. **Partnership Proposal** - `indian-motorcycle-partnership/PARTNERSHIP-PROPOSAL.md`
   - Executive summary
   - Technology overview
   - Partnership models
   - ROI analysis
   - Pricing structure

2. **Demo Script** - `indian-motorcycle-partnership/docs/demo-script.md`
   - 30-minute demo flow
   - 3 diagnostic scenarios
   - Q&A responses
   - Technical backup plans

3. **Demo Setup** - `scripts/partnership/demo-setup.sh`
   - Prepares demo environment
   - Creates test scenarios
   - Validates system

### Demo Scenarios
1. **Thunderstroke 111** - Check Engine Light (P0300)
2. **PowerPlus Engine** - Electrical Issue (intermittent)
3. **Scout Bobber** - Performance Issue (modified bike)

### Usage
```bash
# Prepare demo environment
./scripts/partnership/demo-setup.sh

# Start server for demo
npm start

# Demo available at: http://localhost:3000
```

---

## ⚙️ GitHub Actions Automation

### Workflows

#### 1. COCO Content Generation (`coco-content.yml`)
**Schedule**: Monday, Wednesday, Friday at 9:00 AM UTC
**Actions**:
- Get next topic from calendar
- Generate video content
- Upload to YouTube
- Update analytics
- Commit metadata

#### 2. Daily Automation (`daily-automation.yml`)
**Schedule**: Daily at 6:00 AM UTC
**Actions**:
- Update content calendar
- Sync Gumroad products
- Update analytics
- Generate revenue report
- Run health check
- Export analytics

#### 3. Hourly Health Check (`health-check.yml`)
**Schedule**: Every hour
**Actions**:
- Run COCO system monitor
- Update status file
- Alert on critical errors

### Required GitHub Secrets
Add these in repository settings:
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `DID_API_KEY`
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_CHANNEL_ID`
- `GUMROAD_API_KEY`
- `DATABASE_URL`
- `JWT_SECRET`

---

## 🔐 Security & Legal

### Important Disclaimers
⚠️ **All generated content includes:**
- Educational purposes disclaimer
- Professional consultation requirement
- No liability for following recommendations
- Verification by qualified mechanics

### Data Security
- All user data encrypted (AES-256)
- API keys stored as environment variables
- No sensitive data in logs or commits
- GDPR/CCPA compliant

### API Key Management
- Rotate keys every 90 days
- Use separate keys for dev/production
- Monitor API usage and costs
- Set up billing alerts

---

## 📊 Success Metrics

### Week 1 Goals
- ✅ 3 COCO videos published (Mon/Wed/Fri)
- ✅ 5 Gumroad products live
- ✅ Indian Motorcycle materials ready
- ✅ Revenue: First $100

### Week 2 Goals
- ✅ 6 videos total
- ✅ 10 products live
- ✅ Revenue: $500+

### Month 1 Goals
- ✅ 12 videos, 1000+ subscribers
- ✅ 15 products live
- ✅ Indian Motorcycle pilot agreement
- ✅ Revenue: $2,000+

---

## 🐛 Troubleshooting

### COCO Content Generation Issues
```bash
# Check API keys
echo $OPENAI_API_KEY
echo $ELEVENLABS_API_KEY
echo $DID_API_KEY

# Test content generation
node scripts/coco/generate-content.js "Test Video"

# Check logs
tail -f logs/coco-generation.log
```

### Gumroad Sync Issues
```bash
# Test API connection
curl -H "Authorization: Bearer $GUMROAD_API_KEY" \
  https://api.gumroad.com/v2/user

# Check product status
node scripts/gumroad/product-sync.js --stats
```

### YouTube Upload Issues
```bash
# Verify OAuth tokens
# Go to: https://console.cloud.google.com/

# Check quota usage
# YouTube allows 10,000 units/day

# Test upload
node scripts/coco/youtube-uploader.js --test
```

### System Health Issues
```bash
# Run full diagnostic
node scripts/automation/master-control.js

# Check individual systems
node scripts/automation/coco-monitor.js
```

---

## 📞 Support

### Documentation
- **Main README**: `README.md`
- **Deployment Guide**: `DEPLOYMENT-GUIDE.md`
- **Security Policy**: `SECURITY.md`
- **This Document**: `AUTOMATION-README.md`

### Contact
- **Email**: hello@stepheniesgem.io
- **GitHub Issues**: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues

---

## 🚀 Next Steps

1. **Configure API Keys** - Add all required keys to `.env`
2. **Initialize Systems** - Run activation scripts
3. **Test Locally** - Verify all scripts work
4. **Configure GitHub Actions** - Add repository secrets
5. **Deploy to Production** - Follow deployment guide
6. **Monitor Systems** - Check dashboard regularly

---

**Automation System Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Production Ready

© 2026 RideWire AI Hub. All rights reserved.
