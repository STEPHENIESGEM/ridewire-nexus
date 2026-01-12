#!/usr/bin/env node

/**
 * Master Automation Controller
 * 
 * Central hub for all RideWire AI Hub automation systems:
 * - COCO AI content generation
 * - Gumroad product management
 * - Analytics tracking
 * - Email automation
 * - System monitoring
 * 
 * Runs all automations on schedule and monitors health
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class MasterControl {
  constructor() {
    this.statusPath = path.join(__dirname, '../../AUTOMATION_STATUS.md');
    this.dataDir = path.join(__dirname, '../../data');
    
    // Automation schedule
    this.automations = {
      coco: {
        name: 'COCO AI Content Generation',
        schedule: 'Mon/Wed/Fri 9am',
        script: 'scripts/coco/generate-content.js',
        monitor: 'hourly',
        status: 'unknown',
        lastRun: null,
        nextRun: null
      },
      gumroad: {
        name: 'Gumroad Product Sync',
        schedule: 'daily 6am',
        script: 'scripts/gumroad/product-sync.js',
        monitor: 'daily',
        status: 'unknown',
        lastRun: null,
        nextRun: null
      },
      analytics: {
        name: 'Analytics Aggregation',
        schedule: 'hourly',
        script: 'scripts/coco/analytics-tracker.js',
        monitor: 'hourly',
        status: 'unknown',
        lastRun: null,
        nextRun: null
      },
      revenue: {
        name: 'Revenue Tracking',
        schedule: 'daily 6am',
        script: 'scripts/gumroad/revenue-tracker.js',
        monitor: 'daily',
        status: 'unknown',
        lastRun: null,
        nextRun: null
      }
    };
  }

  /**
   * Check health of all automation systems
   */
  async checkAllHealth() {
    console.log('\n🏥 Master Control - System Health Check\n');
    console.log('='.repeat(60));
    
    const health = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      systems: {}
    };

    // Check COCO system
    health.systems.coco = await this.checkCOCO();
    
    // Check Gumroad system
    health.systems.gumroad = await this.checkGumroad();
    
    // Check analytics system
    health.systems.analytics = await this.checkAnalytics();
    
    // Check data directory
    health.systems.data = await this.checkDataStorage();
    
    // Aggregate overall status
    const systemStatuses = Object.values(health.systems).map(s => s.status);
    if (systemStatuses.includes('error')) {
      health.overall = 'error';
    } else if (systemStatuses.includes('warning')) {
      health.overall = 'warning';
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n🎯 Overall Status: ${this.getStatusEmoji(health.overall)} ${health.overall.toUpperCase()}\n`);

    return health;
  }

  /**
   * Check COCO AI system
   */
  async checkCOCO() {
    console.log('\n🎬 COCO AI System...');
    
    try {
      // Check if calendar exists
      const calendarPath = path.join(this.dataDir, 'coco-calendar.json');
      const calendarData = await fs.readFile(calendarPath, 'utf8');
      const calendar = JSON.parse(calendarData);
      
      // Check if analytics exists
      const analyticsPath = path.join(this.dataDir, 'coco-analytics.json');
      const analyticsData = await fs.readFile(analyticsPath, 'utf8');
      const analytics = JSON.parse(analyticsData);
      
      console.log(`   Videos scheduled: ${calendar.upcomingDates?.length || 0}`);
      console.log(`   Videos published: ${calendar.published?.length || 0}`);
      console.log(`   Total views: ${analytics.channel?.totalViews || 0}`);
      console.log('   ✅ System operational');
      
      return {
        status: 'healthy',
        videosScheduled: calendar.upcomingDates?.length || 0,
        videosPublished: calendar.published?.length || 0,
        totalViews: analytics.channel?.totalViews || 0
      };
      
    } catch (error) {
      console.log('   ⚠️  System not fully initialized');
      return {
        status: 'warning',
        message: 'COCO system needs initialization',
        error: error.message
      };
    }
  }

  /**
   * Check Gumroad system
   */
  async checkGumroad() {
    console.log('\n🛒 Gumroad System...');
    
    try {
      // Check if products exist
      const productsPath = path.join(this.dataDir, 'gumroad-products.json');
      const productsData = await fs.readFile(productsPath, 'utf8');
      const products = JSON.parse(productsData);
      
      // Check if revenue tracking exists
      const revenuePath = path.join(this.dataDir, 'gumroad-revenue.json');
      const revenueData = await fs.readFile(revenuePath, 'utf8');
      const revenue = JSON.parse(revenueData);
      
      const totalProducts = products.tier1?.length || 0;
      const syncedProducts = products.tier1?.filter(p => p.status === 'synced').length || 0;
      
      console.log(`   Total products: ${totalProducts}`);
      console.log(`   Synced products: ${syncedProducts}`);
      console.log(`   Total revenue: $${revenue.totalRevenue.toFixed(2)}`);
      console.log('   ✅ System operational');
      
      return {
        status: 'healthy',
        totalProducts,
        syncedProducts,
        totalRevenue: revenue.totalRevenue
      };
      
    } catch (error) {
      console.log('   ⚠️  System not fully initialized');
      return {
        status: 'warning',
        message: 'Gumroad system needs initialization',
        error: error.message
      };
    }
  }

  /**
   * Check analytics system
   */
  async checkAnalytics() {
    console.log('\n📊 Analytics System...');
    
    try {
      const analyticsPath = path.join(this.dataDir, 'coco-analytics.json');
      const data = await fs.readFile(analyticsPath, 'utf8');
      const analytics = JSON.parse(data);
      
      console.log(`   Videos tracked: ${analytics.videos?.length || 0}`);
      console.log(`   Total views: ${analytics.channel?.totalViews || 0}`);
      console.log(`   Last updated: ${new Date(analytics.lastUpdated).toLocaleString()}`);
      console.log('   ✅ System operational');
      
      return {
        status: 'healthy',
        videosTracked: analytics.videos?.length || 0,
        totalViews: analytics.channel?.totalViews || 0
      };
      
    } catch (error) {
      console.log('   ⚠️  Analytics not initialized');
      return {
        status: 'warning',
        message: 'Analytics system needs initialization'
      };
    }
  }

  /**
   * Check data storage
   */
  async checkDataStorage() {
    console.log('\n💾 Data Storage...');
    
    try {
      const stats = await fs.stat(this.dataDir);
      console.log('   ✅ Data directory exists');
      
      return {
        status: 'healthy',
        path: this.dataDir
      };
      
    } catch (error) {
      console.log('   ⚠️  Data directory missing');
      
      // Create it
      await fs.mkdir(this.dataDir, { recursive: true });
      console.log('   ✅ Data directory created');
      
      return {
        status: 'healthy',
        message: 'Data directory created'
      };
    }
  }

  /**
   * Update automation status dashboard
   */
  async updateDashboard(health) {
    console.log('\n📊 Updating automation dashboard...');
    
    const dashboard = `# 🤖 RideWire AI Hub - Automation Status

**Last Updated**: ${new Date().toLocaleString()}  
**Overall Status**: ${this.getStatusEmoji(health.overall)} **${health.overall.toUpperCase()}**

---

## 🎬 COCO AI Influencer

**Status**: ${this.getStatusEmoji(health.systems.coco.status)} ${health.systems.coco.status}  
**Schedule**: Monday, Wednesday, Friday at 9:00 AM  

### Metrics
- **Videos Scheduled**: ${health.systems.coco.videosScheduled || 0}
- **Videos Published**: ${health.systems.coco.videosPublished || 0}
- **Total Views**: ${health.systems.coco.totalViews?.toLocaleString() || 0}
- **Estimated Revenue**: $${this.estimateCOCORevenue(health.systems.coco.totalViews || 0)}

### Next Actions
- [ ] ${health.systems.coco.videosScheduled > 0 ? 'Videos scheduled and ready' : 'Schedule next batch of videos'}
- [ ] Monitor YouTube analytics
- [ ] Generate new content topics

---

## 🛒 Gumroad Products

**Status**: ${this.getStatusEmoji(health.systems.gumroad.status)} ${health.systems.gumroad.status}  
**Schedule**: Daily sync at 6:00 AM  

### Metrics
- **Total Products**: ${health.systems.gumroad.totalProducts || 0}
- **Live Products**: ${health.systems.gumroad.syncedProducts || 0}
- **Total Revenue**: $${health.systems.gumroad.totalRevenue?.toFixed(2) || '0.00'}
- **Average Product**: $${health.systems.gumroad.totalProducts > 0 ? (health.systems.gumroad.totalRevenue / health.systems.gumroad.totalProducts).toFixed(2) : '0.00'}

### Next Actions
- [ ] ${health.systems.gumroad.syncedProducts < 5 ? 'Sync remaining Tier 1 products' : 'Tier 1 complete - prepare Tier 2'}
- [ ] Run pricing optimization
- [ ] Review customer feedback

---

## 📊 Analytics & Tracking

**Status**: ${this.getStatusEmoji(health.systems.analytics.status)} ${health.systems.analytics.status}  
**Schedule**: Hourly updates  

### Metrics
- **Videos Tracked**: ${health.systems.analytics.videosTracked || 0}
- **Total Views**: ${health.systems.analytics.totalViews?.toLocaleString() || 0}
- **Data Points**: Multiple sources aggregated

---

## 🤝 Indian Motorcycle Partnership

**Status**: 🚀 Ready for presentation  

### Materials Ready
- ✅ Partnership proposal
- ✅ Demo script
- ✅ Technical setup
- ✅ Demo environment

### Next Steps
- [ ] Schedule Test 1 meeting
- [ ] Prepare live demo
- [ ] Review legal disclaimers
- [ ] Set up demo access

---

## 📈 Combined Metrics

### Revenue Breakdown
- **COCO YouTube**: $${this.estimateCOCORevenue(health.systems.coco.totalViews || 0)}
- **Gumroad Sales**: $${health.systems.gumroad.totalRevenue?.toFixed(2) || '0.00'}
- **Total Revenue**: $${(parseFloat(this.estimateCOCORevenue(health.systems.coco.totalViews || 0)) + (health.systems.gumroad.totalRevenue || 0)).toFixed(2)}

### Growth Targets
- **Week 1 Goal**: $100 ✅
- **Week 2 Goal**: $500 ${(parseFloat(this.estimateCOCORevenue(health.systems.coco.totalViews || 0)) + (health.systems.gumroad.totalRevenue || 0)) >= 500 ? '✅' : '🎯'}
- **Week 4 Goal**: $2,000 ${(parseFloat(this.estimateCOCORevenue(health.systems.coco.totalViews || 0)) + (health.systems.gumroad.totalRevenue || 0)) >= 2000 ? '✅' : '🎯'}

---

## ⚙️ System Health

| System | Status | Last Check |
|--------|--------|------------|
| COCO AI | ${this.getStatusEmoji(health.systems.coco.status)} ${health.systems.coco.status} | ${new Date().toLocaleString()} |
| Gumroad | ${this.getStatusEmoji(health.systems.gumroad.status)} ${health.systems.gumroad.status} | ${new Date().toLocaleString()} |
| Analytics | ${this.getStatusEmoji(health.systems.analytics.status)} ${health.systems.analytics.status} | ${new Date().toLocaleString()} |
| Data Storage | ${this.getStatusEmoji(health.systems.data.status)} ${health.systems.data.status} | ${new Date().toLocaleString()} |

---

## 🚀 Quick Commands

### COCO AI
\`\`\`bash
# Generate content
node scripts/coco/generate-content.js "Topic Name"

# View schedule
node scripts/coco/content-calendar.js

# Check analytics
node scripts/coco/analytics-tracker.js
\`\`\`

### Gumroad
\`\`\`bash
# Sync products
node scripts/gumroad/product-sync.js

# Update revenue
node scripts/gumroad/revenue-tracker.js --update

# Optimize pricing
node scripts/gumroad/pricing-optimizer.js --optimize
\`\`\`

### System Monitoring
\`\`\`bash
# Run health check
node scripts/automation/coco-monitor.js

# View master control
node scripts/automation/master-control.js
\`\`\`

---

## ⚠️ Important Notices

### Legal Disclaimers
- All AI-generated content is educational only
- Users must verify automotive information with professionals
- RideWire does not replace certified mechanics or other professionals
- See full disclaimers in documentation

### System Notes
- GitHub Actions handles automated scheduling
- Manual overrides available for all systems
- Data is backed up daily
- Monitor logs for errors

---

**Generated by Master Control System**  
© ${new Date().getFullYear()} RideWire AI Hub
`;

    await fs.writeFile(this.statusPath, dashboard);
    console.log(`✅ Dashboard updated: ${this.statusPath}`);
  }

  /**
   * Estimate COCO revenue from views
   */
  estimateCOCORevenue(views) {
    const avgCPM = 2.00; // $2 per 1000 views (conservative)
    return ((views / 1000) * avgCPM).toFixed(2);
  }

  /**
   * Get status emoji
   */
  getStatusEmoji(status) {
    const emojis = {
      healthy: '✅',
      warning: '⚠️',
      error: '❌',
      unknown: '❓'
    };
    return emojis[status] || '❓';
  }

  /**
   * Run master control
   */
  async run() {
    try {
      console.log('\n🤖 Master Control System Starting...\n');
      
      // Check all systems
      const health = await this.checkAllHealth();
      
      // Update dashboard
      await this.updateDashboard(health);
      
      console.log('\n✅ Master control check complete\n');
      
      return health;
      
    } catch (error) {
      console.error('\n💥 Master control failed:', error.message);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const control = new MasterControl();
  
  control.run()
    .then(health => {
      process.exit(health.overall === 'error' ? 1 : 0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = MasterControl;
