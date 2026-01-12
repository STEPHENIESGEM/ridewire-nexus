# RideWire AI Hub - Automation Guide

**Version**: 1.0  
**Last Updated**: January 8, 2026  
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Available Automation Scripts](#available-automation-scripts)
3. [Quick Start](#quick-start)
4. [Detailed Usage](#detailed-usage)
5. [Integration Guide](#integration-guide)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Overview

The RideWire AI Hub includes a comprehensive suite of automation scripts designed to streamline deployment, content generation, product management, and project tracking. These scripts reduce manual effort and ensure consistent, reliable operations.

### Benefits

- **Faster Deployment**: Automated validation and deployment reduces setup time from hours to minutes
- **Consistent Operations**: Standardized procedures eliminate human error
- **Revenue Generation**: Automated content and product management drive passive income
- **Better Tracking**: Real-time monitoring and reporting keep projects on track

### System Requirements

- **Operating System**: Linux, macOS, or WSL on Windows
- **Shell**: Bash 4.0 or higher
- **Node.js**: 16+ (for deployment scripts)
- **PostgreSQL**: 12+ (for database operations)
- **Optional**: GitHub CLI (`gh`) for enhanced issue/PR management

---

## Available Automation Scripts

### 1. 🚀 deploy-all.sh - Complete Deployment Automation

**Purpose**: Orchestrates complete application deployment with validation, security checks, and database initialization.

**Features**:
- Prerequisites validation (Node.js, npm, PostgreSQL)
- Environment configuration validation
- Security scanning (hardcoded secrets detection)
- Dependency installation
- Application building
- Database schema initialization
- Automated testing
- Production deployment

**Location**: `scripts/deploy-all.sh`

### 2. 🎥 coco-automation.sh - YouTube Content Generation

**Purpose**: Manages autonomous YouTube content generation for marketing campaigns.

**Features**:
- AI-powered video topic generation
- Script writing assistance
- Upload scheduling (Mon/Wed/Fri at 9am)
- Revenue tracking and analytics
- Cost monitoring ($66-76/month target)
- Performance reporting

**Location**: `scripts/coco-automation.sh`

### 3. 💰 gumroad-sync.sh - Product Catalog Management

**Purpose**: Automates Gumroad product creation, pricing optimization, and sales tracking.

**Features**:
- 34-product catalog management
- Automated product creation via API
- Pricing optimization analysis
- Sales and revenue reporting
- Affiliate tracking
- Year 1 revenue projections ($27K-$161K)

**Location**: `scripts/gumroad-sync.sh`

### 4. ✅ complete-all-issues.sh - Project Tracking

**Purpose**: Helps manage GitHub issues and pull requests with status reporting and completion tracking.

**Features**:
- Issue status tracking
- PR readiness validation
- Completion checklist generation
- Comprehensive status reports
- Progress monitoring

**Location**: `scripts/complete-all-issues.sh`

---

## Quick Start

### Installation

All scripts are included in the repository and require no additional installation:

```bash
cd ridewire-ai-hub
ls -l scripts/

# Verify scripts are executable
chmod +x scripts/*.sh
```

### Basic Usage

```bash
# 1. Deploy application (dry run first)
./scripts/deploy-all.sh --dry-run

# 2. Generate content for COCO system
./scripts/coco-automation.sh generate

# 3. Sync Gumroad products
./scripts/gumroad-sync.sh sync

# 4. Check project status
./scripts/complete-all-issues.sh status
```

---

## Detailed Usage

### deploy-all.sh - Deployment Script

#### Command Options

```bash
./scripts/deploy-all.sh [options]

OPTIONS:
  --dry-run         Run validation checks only (no deployment)
  --skip-tests      Skip automated testing (not recommended)
  --skip-db-init    Skip database initialization
  --help            Show help message
```

#### Usage Examples

**1. Validate Environment (Pre-Deployment Check)**
```bash
./scripts/deploy-all.sh --dry-run
```
This performs all validation checks without making changes:
- ✅ Prerequisites check
- ✅ Environment variables validation
- ✅ Security scanning
- ✅ Dependencies check

**2. Full Deployment**
```bash
./scripts/deploy-all.sh
```
Performs complete deployment:
1. Validates prerequisites
2. Checks environment configuration
3. Scans for security issues
4. Installs dependencies
5. Builds application
6. Initializes database
7. Runs tests
8. Starts server

**3. Deploy Without Database Initialization**
```bash
./scripts/deploy-all.sh --skip-db-init
```
Useful when database is already configured.

#### Environment Variables Required

Create a `.env` file with these variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ridewire

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# Server
NODE_ENV=production
PORT=3000
```

#### Success Indicators

✅ Deployment complete when you see:
```
╔════════════════════════════════════════════════════════════════╗
║           RideWire AI Hub Deployment Complete                 ║
╚════════════════════════════════════════════════════════════════╝
```

---

### coco-automation.sh - Content Generation

#### Command Options

```bash
./scripts/coco-automation.sh [command]

COMMANDS:
  generate    Generate video content for upcoming schedule
  upload      Upload pending videos to YouTube
  schedule    Show upcoming video schedule
  report      Generate revenue and analytics report
  monitor     Start continuous monitoring mode
  --help      Show help message
```

#### Usage Examples

**1. Generate Video Topics and Scripts**
```bash
./scripts/coco-automation.sh generate
```
Creates:
- Video topic ideas (automotive AI content)
- Full video scripts with hooks, demos, CTAs
- Affiliate link templates
- SEO-optimized titles and tags

**2. View Upload Schedule**
```bash
./scripts/coco-automation.sh schedule
```
Shows:
- Next 4 weeks of scheduled uploads
- Upload days (Monday, Wednesday, Friday)
- Upload time (9:00 AM local)
- Monthly targets (cost and revenue)

**3. Generate Revenue Report**
```bash
./scripts/coco-automation.sh report
```
Displays:
- Total views and watch time
- Ad revenue and affiliate commissions
- Subscriber growth
- ROI calculations
- Cost breakdown

**4. Continuous Monitoring**
```bash
./scripts/coco-automation.sh monitor
```
Starts real-time dashboard showing:
- Content queue status
- Videos pending upload
- Next scheduled upload
- API connection status

#### Environment Variables

```bash
# YouTube API (required for upload)
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id

# Content AI (uses existing keys)
OPENAI_API_KEY=sk-...
```

#### Revenue Targets

- **Monthly Cost**: $66-76 (API usage, tools, hosting)
- **Monthly Revenue**: $500 by week 4
- **Content Volume**: 3 videos per week (12 per month)
- **Target ROI**: 568%+

---

### gumroad-sync.sh - Product Management

#### Command Options

```bash
./scripts/gumroad-sync.sh [command]

COMMANDS:
  create       Create all products from catalog
  update       Update existing product listings
  pricing      Optimize pricing based on analytics
  report       Generate sales and revenue report
  sync         Full synchronization (create + update)
  --help       Show help message
```

#### Usage Examples

**1. Create Product Catalog**
```bash
./scripts/gumroad-sync.sh create
```
Creates 34 products across 7 categories:
- Diagnostic Tools & Software (5 products)
- Training & Educational Materials (5 products)
- AR Overlay Templates (6 products)
- Workflow Tools & Integrations (5 products)
- Specialized Diagnostic Modules (5 products)
- Business & Shop Resources (4 products)
- Premium Bundles (4 products)

**2. Pricing Optimization Analysis**
```bash
./scripts/gumroad-sync.sh pricing
```
Analyzes:
- Current pricing tiers
- Market positioning
- Revenue projections (conservative, moderate, optimistic)
- Optimization recommendations

**3. Sales Report**
```bash
./scripts/gumroad-sync.sh report
```
Shows:
- Total sales and conversion rate
- Gross and net revenue
- Top-selling products
- Year 1 trajectory vs targets
- Actionable recommendations

**4. Full Synchronization**
```bash
./scripts/gumroad-sync.sh sync
```
Complete workflow:
1. Creates/updates product catalog
2. Runs pricing optimization
3. Generates sales report

#### Environment Variables

```bash
# Gumroad API
GUMROAD_ACCESS_TOKEN=your-gumroad-token
```

#### Revenue Projections

| Scenario | Sales/Month | Avg Price | Monthly Revenue | Year 1 Total |
|----------|------------|-----------|----------------|--------------|
| Conservative | 10 | $225 | $2,250 | $27,000 |
| Moderate | 30 | $300 | $9,000 | $108,000 |
| Optimistic | 50 | $270 | $13,500 | $162,000 |

---

### complete-all-issues.sh - Project Management

#### Command Options

```bash
./scripts/complete-all-issues.sh [command]

COMMANDS:
  status      Show overall project status
  issues      List all open issues with details
  prs         List all open pull requests
  checklist   Generate completion checklist
  report      Generate comprehensive status report
  --help      Show help message
```

#### Usage Examples

**1. Quick Status Check**
```bash
./scripts/complete-all-issues.sh status
```
Shows:
- Open issues summary
- PR status and recommendations
- Quick action items

**2. Issue List**
```bash
./scripts/complete-all-issues.sh issues
```
Lists all issues with:
- Issue numbers and titles
- Priority levels
- Current status

**3. PR Status**
```bash
./scripts/complete-all-issues.sh prs
```
Shows:
- PRs ready to merge
- PRs needing review
- Alternative PRs to close
- Merge instructions

**4. Generate Completion Checklist**
```bash
./scripts/complete-all-issues.sh checklist
```
Creates detailed checklist covering:
- PR management tasks
- Issue resolution steps
- Deployment checklist
- Integration tasks
- Monitoring setup

**5. Comprehensive Status Report**
```bash
./scripts/complete-all-issues.sh report
```
Generates full report with:
- Executive summary
- Current status overview
- PR and issue summaries
- Automation status
- Revenue targets
- Next actions
- Risk assessment

#### Output Location

Reports are saved to: `reports/`
- `completion-checklist-YYYYMMDD.md`
- `status-report-YYYYMMDD-HHMMSS.md`

---

## Integration Guide

### CI/CD Integration

#### GitHub Actions

```yaml
name: Deploy RideWire AI Hub

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Deploy Application
        run: ./scripts/deploy-all.sh --skip-tests
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

#### Cron Jobs

Schedule automatic content generation:

```bash
# Edit crontab
crontab -e

# Add COCO content generation (weekly on Sunday at midnight)
0 0 * * 0 cd /path/to/ridewire-ai-hub && ./scripts/coco-automation.sh generate

# Add Gumroad sync (daily at 2 AM)
0 2 * * * cd /path/to/ridewire-ai-hub && ./scripts/gumroad-sync.sh sync

# Add status report (daily at 9 AM)
0 9 * * * cd /path/to/ridewire-ai-hub && ./scripts/complete-all-issues.sh report
```

### Monitoring Integration

#### Slack Notifications

Modify scripts to send alerts:

```bash
# Add to end of deploy-all.sh
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"✅ RideWire deployment complete!"}'
```

#### Email Reports

```bash
# Email status report
./scripts/complete-all-issues.sh report | \
  mail -s "RideWire Status Report" admin@example.com
```

---

## Troubleshooting

### Common Issues

#### 1. Permission Denied

**Problem**: `./scripts/deploy-all.sh: Permission denied`

**Solution**:
```bash
chmod +x scripts/*.sh
```

#### 2. Environment Variables Not Found

**Problem**: `Error: DATABASE_URL not set`

**Solution**:
```bash
# Create .env file
cp .env.example .env

# Edit with your values
nano .env

# Source before running
source .env
./scripts/deploy-all.sh
```

#### 3. Node.js Version Mismatch

**Problem**: `Error: Node.js version too old`

**Solution**:
```bash
# Check version
node --version

# Upgrade with nvm
nvm install 16
nvm use 16
```

#### 4. Database Connection Failed

**Problem**: `Error: Could not connect to database`

**Solution**:
```bash
# Test connection
psql $DATABASE_URL

# Check PostgreSQL is running
systemctl status postgresql

# Verify DATABASE_URL format
# postgresql://user:password@host:port/database
```

#### 5. API Key Invalid

**Problem**: `Error: Invalid API key`

**Solution**:
```bash
# Verify keys are correct
echo $OPENAI_API_KEY | head -c 10

# Regenerate keys if needed
# - OpenAI: https://platform.openai.com/api-keys
# - Anthropic: https://console.anthropic.com/
# - Google: https://ai.google.dev/
```

### Debug Mode

Enable verbose logging:

```bash
# Set debug mode
export DEBUG=true

# Run script
./scripts/deploy-all.sh

# Or use bash -x
bash -x scripts/deploy-all.sh
```

### Log Files

Scripts generate logs in:
- `deployment-YYYYMMDD-HHMMSS.log` (deploy-all.sh)
- `logs/coco/coco-YYYYMMDD.log` (coco-automation.sh)
- `logs/gumroad/gumroad-sync-YYYYMMDD.log` (gumroad-sync.sh)

View recent logs:
```bash
tail -f deployment-*.log
```

---

## Best Practices

### 1. Always Test First

```bash
# Dry run before production
./scripts/deploy-all.sh --dry-run

# Review output before proceeding
```

### 2. Keep Environment Secure

```bash
# Never commit .env
echo ".env" >> .gitignore

# Use strong JWT secrets (32+ characters)
openssl rand -base64 32

# Rotate API keys regularly
```

### 3. Monitor Regularly

```bash
# Daily status check
./scripts/complete-all-issues.sh status

# Weekly revenue report
./scripts/gumroad-sync.sh report
./scripts/coco-automation.sh report
```

### 4. Backup Before Changes

```bash
# Backup database before deployment
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Keep backups for 30 days
find . -name "backup-*.sql" -mtime +30 -delete
```

### 5. Version Control

```bash
# Commit after successful deployment
git add .
git commit -m "Successful deployment $(date)"
git tag -a v1.0.0 -m "Production release"
```

### 6. Document Changes

- Update CHANGELOG.md with each deployment
- Document configuration changes
- Track API usage and costs
- Keep deployment notes

### 7. Review Logs

```bash
# Check for errors after deployment
grep -i error deployment-*.log

# Monitor API usage
grep -i "API" logs/coco/*.log | tail -20
```

---

## Advanced Usage

### Parallel Execution

Run multiple scripts simultaneously:

```bash
# Generate content while syncing products
./scripts/coco-automation.sh generate &
./scripts/gumroad-sync.sh sync &
wait
echo "All tasks complete"
```

### Custom Workflows

Create custom automation workflows:

```bash
#!/bin/bash
# custom-workflow.sh

echo "Starting daily automation workflow..."

# 1. Check project status
./scripts/complete-all-issues.sh status

# 2. Generate content if needed
if [ $(date +%u) -eq 7 ]; then  # Sunday
    ./scripts/coco-automation.sh generate
fi

# 3. Sync products
./scripts/gumroad-sync.sh sync

# 4. Generate reports
./scripts/complete-all-issues.sh report > reports/daily-$(date +%Y%m%d).md

echo "Workflow complete!"
```

### Integration with Other Tools

**Slack Integration**:
```bash
# Send deployment notification
DEPLOY_RESULT=$(./scripts/deploy-all.sh 2>&1)
curl -X POST $SLACK_WEBHOOK \
  -d "{\"text\":\"Deployment: $DEPLOY_RESULT\"}"
```

**Discord Webhook**:
```bash
# Send revenue report to Discord
REVENUE=$(./scripts/gumroad-sync.sh report)
curl -X POST $DISCORD_WEBHOOK \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"$REVENUE\"}"
```

---

## Support and Maintenance

### Getting Help

1. **Documentation**: Check this guide and related docs
2. **Script Help**: Run any script with `--help` flag
3. **Logs**: Review log files for detailed error messages
4. **GitHub Issues**: Open issue at repository

### Maintenance Tasks

**Weekly**:
- Review deployment logs
- Check API usage and costs
- Monitor revenue metrics
- Update product pricing if needed

**Monthly**:
- Rotate API keys
- Review security audit logs
- Update dependencies
- Backup configurations

**Quarterly**:
- Full security audit
- Review automation efficiency
- Update documentation
- Optimize workflows

---

## Conclusion

These automation scripts provide a comprehensive solution for managing the RideWire AI Hub platform. By following this guide and best practices, you can:

- ✅ Deploy confidently and consistently
- ✅ Generate revenue through automated content
- ✅ Manage products efficiently
- ✅ Track progress systematically

For questions or issues, refer to the troubleshooting section or open a GitHub issue.

---

**Last Updated**: January 8, 2026  
**Maintained By**: RideWire AI Hub Team  
**Version**: 1.0
