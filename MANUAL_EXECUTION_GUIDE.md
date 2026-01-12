# RideWire AI Hub - Manual Execution Guide

**Version**: 1.0  
**Last Updated**: January 8, 2026  
**Purpose**: Guide for tasks requiring manual execution with credentials

---

## 🎯 Overview

This guide outlines tasks mentioned in the deployment plan that **require manual execution** because they need credentials, third-party access, or actions outside the ridewire-ai-hub repository. The automation scripts have been created to handle everything that can be automated.

---

## ✅ What Has Been Automated

The following have been **completed and are ready to use**:

### 1. Deployment Automation ✅
- **Script**: `scripts/deploy-all.sh`
- **Status**: Complete and tested
- **Run**: `./scripts/deploy-all.sh --dry-run` (then without flag for real deployment)

### 2. COCO Content Generation Framework ✅
- **Script**: `scripts/coco-automation.sh`
- **Status**: Complete with content generation logic
- **Run**: `./scripts/coco-automation.sh generate`

### 3. Gumroad Product Catalog ✅
- **Script**: `scripts/gumroad-sync.sh`
- **Status**: Complete with 34-product catalog
- **Run**: `./scripts/gumroad-sync.sh sync`

### 4. Project Tracking ✅
- **Script**: `scripts/complete-all-issues.sh`
- **Status**: Complete with status reporting
- **Run**: `./scripts/complete-all-issues.sh report`

### 5. Documentation ✅
- **Guide**: `AUTOMATION_GUIDE.md`
- **Status**: Complete with detailed instructions
- **Contents**: Usage, troubleshooting, best practices

---

## ⚠️ What Requires Manual Execution

### Priority 1: GitHub Pull Request Management

**⚠️ REQUIRES**: GitHub repository access credentials

#### Recommended PRs to Merge:

1. **PR #28** - Gumroad Product Expansion (34 products)
   - ✅ Recommended choice
   - Contains comprehensive 34-product catalog
   - Revenue target: $27K-$161K Year 1

2. **PR #30** - COCO AI Influencer System Launch
   - ✅ Ready for activation
   - YouTube content generation
   - Target: $500/month by week 4

3. **PR #32** - Indian Motorcycle Partnership Materials
   - ✅ Recommended choice (16 docs, more focused)
   - Test 1 demo materials
   - OneDrive video integration

#### PRs to Close (Alternatives):
- **PR #27** - Alternative to PR #28 (close if merging #28)
- **PR #31** - Alternative to PR #32 (close if merging #32)

#### How to Merge PRs:

**Option A: GitHub Web Interface**
```
1. Navigate to: https://github.com/STEPHENIESGEM/ridewire-ai-hub/pulls
2. Review each PR:
   - Check for merge conflicts
   - Review changes
   - Ensure tests pass (if applicable)
3. Click "Merge pull request"
4. Select merge strategy (recommend: Squash and merge)
5. Confirm merge
```

**Option B: GitHub CLI (if installed)**
```bash
# Install GitHub CLI if needed
# Visit: https://cli.github.com/

# Authenticate
gh auth login

# Merge recommended PRs
gh pr merge 28 --repo STEPHENIESGEM/ridewire-ai-hub --squash
gh pr merge 30 --repo STEPHENIESGEM/ridewire-ai-hub --squash
gh pr merge 32 --repo STEPHENIESGEM/ridewire-ai-hub --squash

# Close alternative PRs
gh pr close 27 --repo STEPHENIESGEM/ridewire-ai-hub
gh pr close 31 --repo STEPHENIESGEM/ridewire-ai-hub
```

---

### Priority 2: GitHub Issue Management

**⚠️ REQUIRES**: GitHub repository access credentials

#### High Priority Issues (ridewire-ai-hub):

**Issue #2** - App completion roadmap
```
Action: Create roadmap document
Status: Can use AUTOMATION_GUIDE.md as starting point
Close when: Documentation is complete
```

**Issue #11** - Upload Jupyter notebooks
```
Action: Upload notebooks to repository
Files needed:
  - Business Dashboard notebook
  - AI Framework notebook
  - Funding Strategy notebook
Close when: All notebooks uploaded with README
```

**Issue #12** - Create comprehensive documentation
```
Action: Expand documentation
Status: AUTOMATION_GUIDE.md covers automation
Need: User guides, API docs, tutorials
Close when: Documentation complete
```

#### Chain Prompt Issues (#7-#10):

These issues are tracked in `STRATEGY-EXECUTION-PLAN.md` and `NEXT-ACTIONS.md`. Update progress as phases complete.

**How to Update Issues:**

```bash
# Using GitHub CLI
gh issue comment 2 --repo STEPHENIESGEM/ridewire-ai-hub --body "Documentation created in AUTOMATION_GUIDE.md"
gh issue close 2 --repo STEPHENIESGEM/ridewire-ai-hub

# Or via GitHub web interface:
# 1. Navigate to: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues
# 2. Click on issue
# 3. Add comment with progress update
# 4. Click "Close issue" when complete
```

---

### Priority 3: Production Deployment

**⚠️ REQUIRES**: Production hosting credentials and database access

#### Steps:

1. **Choose Hosting Platform**
   - Options: Heroku, Railway, DigitalOcean, AWS, Vercel
   - Recommendation: Railway (easy Node.js + PostgreSQL)

2. **Set Up PostgreSQL Database**
   ```bash
   # Example for Railway:
   # 1. Create new project
   # 2. Add PostgreSQL service
   # 3. Copy DATABASE_URL from settings
   ```

3. **Configure Environment Variables**
   ```
   On hosting platform dashboard, set:
   - DATABASE_URL (from database service)
   - JWT_SECRET (generate: openssl rand -base64 32)
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY
   - GOOGLE_API_KEY
   - NODE_ENV=production
   - PORT=3000
   ```

4. **Deploy Application**
   ```bash
   # Example for Railway:
   # 1. Connect GitHub repository
   # 2. Select branch (main or deployment branch)
   # 3. Railway auto-detects Node.js and deploys
   
   # Or manual deployment:
   git push railway main
   ```

5. **Initialize Database**
   ```bash
   # SSH into production server or use database client
   psql $DATABASE_URL -f schema.sql
   ```

6. **Verify Deployment**
   ```bash
   # Test endpoints
   curl https://your-app.railway.app/
   curl https://your-app.railway.app/api/dashboard/stats
   ```

---

### Priority 4: YouTube/COCO System Activation

**⚠️ REQUIRES**: YouTube API credentials and channel access

#### Steps:

1. **Create/Access YouTube Channel**
   - Log in to YouTube
   - Create channel for RideWire content
   - Note Channel ID

2. **Set Up YouTube Data API**
   ```
   1. Go to: https://console.cloud.google.com/
   2. Create new project or select existing
   3. Enable YouTube Data API v3
   4. Create credentials (API key)
   5. Copy API key
   ```

3. **Configure COCO System**
   ```bash
   # Add to .env file
   echo "YOUTUBE_API_KEY=your_api_key_here" >> .env
   echo "YOUTUBE_CHANNEL_ID=your_channel_id" >> .env
   ```

4. **Generate Content**
   ```bash
   # Generate topics and scripts
   ./scripts/coco-automation.sh generate
   
   # Review generated content in:
   # - content/videos/ (scripts)
   # - data/coco/ (topics and metadata)
   ```

5. **Record and Upload Videos**
   ```
   Manual steps:
   1. Record voiceover from generated scripts
   2. Create visuals/screen recordings
   3. Edit video (use FFmpeg, Adobe Premiere, or similar)
   4. Upload to YouTube via web interface or API
   5. Add generated descriptions and affiliate links
   ```

6. **Schedule Future Content**
   ```bash
   # Set up cron job for automatic generation
   crontab -e
   
   # Add line (generates content weekly on Sunday):
   0 0 * * 0 cd /path/to/ridewire-ai-hub && ./scripts/coco-automation.sh generate
   ```

---

### Priority 5: Gumroad Product Creation

**⚠️ REQUIRES**: Gumroad account and API access

#### Steps:

1. **Create Gumroad Account**
   - Sign up at: https://gumroad.com/
   - Complete seller profile
   - Set up payment processing

2. **Get API Access**
   ```
   1. Log in to Gumroad
   2. Go to Settings → Advanced → Applications
   3. Create new application
   4. Copy Access Token
   ```

3. **Configure Gumroad Sync**
   ```bash
   # Add to .env file
   echo "GUMROAD_ACCESS_TOKEN=your_token_here" >> .env
   ```

4. **Review Product Catalog**
   ```bash
   # Generate catalog file
   ./scripts/gumroad-sync.sh create
   
   # Review catalog at:
   # data/gumroad/product-catalog.json
   ```

5. **Create Products**
   ```bash
   # With API token set:
   ./scripts/gumroad-sync.sh sync
   
   # Or manually via Gumroad web interface:
   # 1. Log in to Gumroad
   # 2. Click "Create a product"
   # 3. Use catalog as reference for:
   #    - Product names
   #    - Prices
   #    - Descriptions
   # 4. Set up affiliate program (30-45% commission)
   ```

6. **Monitor Sales**
   ```bash
   # Generate sales report
   ./scripts/gumroad-sync.sh report
   ```

---

### Priority 6: Indian Motorcycle Partnership

**⚠️ REQUIRES**: Business credentials and meeting coordination

#### Steps:

1. **Access Partnership Materials**
   - After merging PR #32, review materials in repository
   - Organize 16 documents for presentation

2. **Prepare OneDrive Links**
   - Upload demonstration videos to OneDrive
   - Get shareable links
   - Ensure links are accessible to partners

3. **Schedule Test 1 Demo**
   - Contact Indian Motorcycle shop partners
   - Schedule on-site demonstration
   - Prepare equipment (tablet/phone with RideWire app)

4. **Conduct Demo**
   - Show multi-AI diagnostic capabilities
   - Demonstrate AR overlays (if available)
   - Discuss partnership terms
   - Collect feedback

5. **Follow Up**
   - Send partnership proposal
   - Address questions and concerns
   - Negotiate terms
   - Formalize agreement

---

## 🔄 Tasks for Other Repositories

**⚠️ NOTE**: These repositories are NOT accessible from the ridewire-ai-hub repository.

### -ridewire-ai-hub Repository
- **Issues #2-#12**: Handle separately in that repository
- **Access**: Navigate to that repository's GitHub page

### ridewire Repository
- **PR #9**: Merge to clarify business intelligence scope
- **Access**: Navigate to that repository's GitHub page

### ridewire-site Repository
- **Updates needed**: Homepage, demos, contact info
- **Access**: Navigate to that repository's GitHub page

---

## 📋 Execution Checklist

Use this checklist to track manual tasks:

### GitHub Management
- [ ] Review PR #28 (Gumroad 34 products)
- [ ] Review PR #30 (COCO system)
- [ ] Review PR #32 (Indian Motorcycle)
- [ ] Merge selected PRs
- [ ] Close alternative PRs (#27, #31)
- [ ] Update issue #2 (roadmap)
- [ ] Update issue #11 (notebooks)
- [ ] Update issue #12 (documentation)

### Production Deployment
- [ ] Select hosting platform
- [ ] Create PostgreSQL database
- [ ] Set environment variables
- [ ] Deploy application
- [ ] Initialize database schema
- [ ] Configure domain and SSL
- [ ] Set up monitoring

### COCO System
- [ ] Create YouTube channel
- [ ] Get YouTube API credentials
- [ ] Configure COCO environment variables
- [ ] Generate initial content
- [ ] Record and edit videos
- [ ] Upload to YouTube
- [ ] Set up scheduled generation

### Gumroad Products
- [ ] Create Gumroad account
- [ ] Get API access token
- [ ] Configure Gumroad sync
- [ ] Review product catalog
- [ ] Create all 34 products
- [ ] Set up affiliate program
- [ ] Monitor sales

### Partnerships
- [ ] Review Indian Motorcycle materials
- [ ] Upload demo videos to OneDrive
- [ ] Schedule shop testing meeting
- [ ] Conduct demonstration
- [ ] Follow up on partnership

---

## 🚀 Quick Command Reference

### Check Project Status
```bash
./scripts/complete-all-issues.sh status
```

### Generate Full Status Report
```bash
./scripts/complete-all-issues.sh report > reports/current-status.md
```

### Test Deployment (Dry Run)
```bash
./scripts/deploy-all.sh --dry-run
```

### Generate COCO Content
```bash
./scripts/coco-automation.sh generate
./scripts/coco-automation.sh schedule
```

### Sync Gumroad Catalog
```bash
./scripts/gumroad-sync.sh sync
./scripts/gumroad-sync.sh report
```

---

## 📞 Support Resources

- **Documentation**: AUTOMATION_GUIDE.md
- **Deployment**: DEPLOYMENT_CHECKLIST.md
- **Strategy**: STRATEGY-EXECUTION-PLAN.md
- **Security**: SECURITY.md
- **Setup**: SETUP.md

---

## ✅ Success Criteria

### Week 1: Foundation ✅
- [x] Automation scripts created
- [x] Documentation complete
- [ ] PRs merged
- [ ] Production deployed

### Week 2: Integration
- [ ] COCO system active
- [ ] Gumroad products live
- [ ] Monitoring configured

### Week 3: Validation
- [ ] First YouTube videos published
- [ ] First Gumroad sales
- [ ] Partnership demo complete

### Week 4: Monetization
- [ ] Revenue tracking active
- [ ] $500/month on track (COCO)
- [ ] Products selling consistently

---

## 🎯 Final Notes

1. **Automation is Complete**: All scripts that can be automated have been created
2. **Manual Steps Unavoidable**: Some tasks require credentials and cannot be automated
3. **Follow This Guide**: Use this guide to execute manual steps in order
4. **Track Progress**: Use the checklist to monitor completion
5. **Update Documentation**: Keep docs updated as you complete tasks

**Good luck with the deployment!** 🚀

---

**Last Updated**: January 8, 2026  
**Maintained By**: RideWire AI Hub Team  
**Version**: 1.0
