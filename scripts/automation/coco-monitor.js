#!/usr/bin/env node

/**
 * COCO AI Influencer - System Monitor
 * 
 * Monitors COCO AI system health and status:
 * - Content generation status
 * - Upload queue status
 * - API availability
 * - Error detection
 * - Performance metrics
 * 
 * Runs hourly via cron or GitHub Actions
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class COCOMonitor {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.logPath = path.join(this.dataDir, 'coco-monitor-log.json');
    this.statusPath = path.join(this.dataDir, 'coco-status.json');
  }

  /**
   * Check system health
   */
  async checkHealth() {
    const health = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {},
      errors: [],
      warnings: []
    };

    console.log('🏥 COCO AI Health Check\n');
    console.log('='.repeat(60));

    // Check 1: Environment variables
    health.checks.environment = await this.checkEnvironment();
    
    // Check 2: Content calendar
    health.checks.calendar = await this.checkCalendar();
    
    // Check 3: Video generation capacity
    health.checks.generation = await this.checkGenerationCapacity();
    
    // Check 4: Upload queue
    health.checks.uploadQueue = await this.checkUploadQueue();
    
    // Check 5: Analytics tracking
    health.checks.analytics = await this.checkAnalytics();
    
    // Check 6: Disk space
    health.checks.diskSpace = await this.checkDiskSpace();

    // Aggregate status
    const allChecks = Object.values(health.checks);
    const hasErrors = allChecks.some(c => c.status === 'error');
    const hasWarnings = allChecks.some(c => c.status === 'warning');

    if (hasErrors) {
      health.status = 'error';
      health.errors = allChecks.filter(c => c.status === 'error').map(c => c.message);
    } else if (hasWarnings) {
      health.status = 'warning';
      health.warnings = allChecks.filter(c => c.status === 'warning').map(c => c.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n🏥 Overall Status: ${this.getStatusEmoji(health.status)} ${health.status.toUpperCase()}\n`);

    if (health.errors.length > 0) {
      console.log('❌ Errors:');
      health.errors.forEach(err => console.log(`   - ${err}`));
      console.log();
    }

    if (health.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      health.warnings.forEach(warn => console.log(`   - ${warn}`));
      console.log();
    }

    return health;
  }

  /**
   * Check environment configuration
   */
  async checkEnvironment() {
    console.log('\n🔍 Checking environment configuration...');
    
    const required = ['OPENAI_API_KEY', 'ELEVENLABS_API_KEY', 'DID_API_KEY'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.log(`   ❌ Missing: ${missing.join(', ')}`);
      return {
        status: 'warning',
        message: `Missing API keys: ${missing.join(', ')}`,
        details: { missing }
      };
    }

    console.log('   ✅ All API keys configured');
    return {
      status: 'healthy',
      message: 'Environment configured correctly',
      details: { configured: required }
    };
  }

  /**
   * Check content calendar status
   */
  async checkCalendar() {
    console.log('\n📅 Checking content calendar...');
    
    try {
      const calendarPath = path.join(this.dataDir, 'coco-calendar.json');
      const data = await fs.readFile(calendarPath, 'utf8');
      const calendar = JSON.parse(data);

      const upcomingCount = calendar.upcomingDates.length;
      const publishedCount = calendar.published.length;

      if (upcomingCount === 0) {
        console.log('   ⚠️  No upcoming videos scheduled');
        return {
          status: 'warning',
          message: 'No videos scheduled in calendar',
          details: { upcomingCount, publishedCount }
        };
      }

      console.log(`   ✅ ${upcomingCount} videos scheduled, ${publishedCount} published`);
      return {
        status: 'healthy',
        message: `${upcomingCount} videos scheduled`,
        details: { upcomingCount, publishedCount }
      };

    } catch (error) {
      console.log('   ❌ Calendar not found or invalid');
      return {
        status: 'error',
        message: 'Calendar not initialized',
        details: { error: error.message }
      };
    }
  }

  /**
   * Check video generation capacity
   */
  async checkGenerationCapacity() {
    console.log('\n🎬 Checking video generation capacity...');
    
    try {
      const outputDir = path.join(__dirname, '../../output/coco-videos');
      
      try {
        const files = await fs.readdir(outputDir);
        const videoFiles = files.filter(f => f.endsWith('.mp4'));
        const metadataFiles = files.filter(f => f.endsWith('-metadata.json'));

        console.log(`   ✅ ${videoFiles.length} videos generated, ${metadataFiles.length} metadata files`);
        return {
          status: 'healthy',
          message: `${videoFiles.length} videos ready`,
          details: { videoFiles: videoFiles.length, metadataFiles: metadataFiles.length }
        };

      } catch {
        // Directory doesn't exist yet
        console.log('   ℹ️  Output directory not created yet');
        return {
          status: 'healthy',
          message: 'No videos generated yet (normal for new setup)',
          details: { videoFiles: 0 }
        };
      }

    } catch (error) {
      console.log('   ❌ Error checking generation capacity');
      return {
        status: 'error',
        message: 'Failed to check video generation',
        details: { error: error.message }
      };
    }
  }

  /**
   * Check upload queue
   */
  async checkUploadQueue() {
    console.log('\n📤 Checking upload queue...');
    
    try {
      const outputDir = path.join(__dirname, '../../output/coco-videos');
      
      try {
        const files = await fs.readdir(outputDir);
        const metadataFiles = files.filter(f => f.endsWith('-metadata.json') && !f.includes('upload-record'));
        
        let readyForUpload = 0;
        for (const file of metadataFiles) {
          const data = await fs.readFile(path.join(outputDir, file), 'utf8');
          const metadata = JSON.parse(data);
          if (metadata.status === 'ready_for_upload') {
            readyForUpload++;
          }
        }

        console.log(`   ✅ ${readyForUpload} videos ready for upload`);
        return {
          status: 'healthy',
          message: `${readyForUpload} videos in upload queue`,
          details: { readyForUpload, total: metadataFiles.length }
        };

      } catch {
        console.log('   ℹ️  No videos in queue yet');
        return {
          status: 'healthy',
          message: 'Upload queue empty',
          details: { readyForUpload: 0 }
        };
      }

    } catch (error) {
      console.log('   ❌ Error checking upload queue');
      return {
        status: 'error',
        message: 'Failed to check upload queue',
        details: { error: error.message }
      };
    }
  }

  /**
   * Check analytics tracking
   */
  async checkAnalytics() {
    console.log('\n📊 Checking analytics tracking...');
    
    try {
      const analyticsPath = path.join(this.dataDir, 'coco-analytics.json');
      const data = await fs.readFile(analyticsPath, 'utf8');
      const analytics = JSON.parse(data);

      const videosTracked = analytics.videos.length;
      const totalViews = analytics.channel.totalViews;

      console.log(`   ✅ Tracking ${videosTracked} videos, ${totalViews} total views`);
      return {
        status: 'healthy',
        message: `Tracking ${videosTracked} videos`,
        details: { videosTracked, totalViews }
      };

    } catch (error) {
      console.log('   ⚠️  Analytics not initialized yet');
      return {
        status: 'warning',
        message: 'Analytics not initialized',
        details: { error: error.message }
      };
    }
  }

  /**
   * Check disk space
   */
  async checkDiskSpace() {
    console.log('\n💾 Checking disk space...');
    
    try {
      const outputDir = path.join(__dirname, '../../output/coco-videos');
      
      try {
        const files = await fs.readdir(outputDir);
        let totalSize = 0;

        for (const file of files) {
          const stat = await fs.stat(path.join(outputDir, file));
          totalSize += stat.size;
        }

        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        if (totalSize > 1024 * 1024 * 1024) { // > 1GB
          console.log(`   ⚠️  Using ${sizeMB} MB (consider cleanup)`);
          return {
            status: 'warning',
            message: `High disk usage: ${sizeMB} MB`,
            details: { sizeMB }
          };
        }

        console.log(`   ✅ Using ${sizeMB} MB`);
        return {
          status: 'healthy',
          message: `Disk usage: ${sizeMB} MB`,
          details: { sizeMB }
        };

      } catch {
        console.log('   ℹ️  No output directory yet');
        return {
          status: 'healthy',
          message: 'No disk space used yet',
          details: { sizeMB: 0 }
        };
      }

    } catch (error) {
      console.log('   ❌ Error checking disk space');
      return {
        status: 'error',
        message: 'Failed to check disk space',
        details: { error: error.message }
      };
    }
  }

  /**
   * Get status emoji
   */
  getStatusEmoji(status) {
    const emojis = {
      healthy: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return emojis[status] || '❓';
  }

  /**
   * Save health check to log
   */
  async saveHealthCheck(health) {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      // Load existing log
      let log = [];
      try {
        const data = await fs.readFile(this.logPath, 'utf8');
        log = JSON.parse(data);
      } catch {
        // Log doesn't exist yet
      }

      // Add new entry
      log.push(health);

      // Keep only last 168 entries (7 days of hourly checks)
      if (log.length > 168) {
        log = log.slice(-168);
      }

      await fs.writeFile(this.logPath, JSON.stringify(log, null, 2));

      // Update current status
      await fs.writeFile(this.statusPath, JSON.stringify(health, null, 2));

      console.log(`📝 Health check logged to: ${this.logPath}`);

    } catch (error) {
      console.error('❌ Failed to save health check:', error.message);
    }
  }

  /**
   * Send alert if needed
   */
  async sendAlert(health) {
    if (health.status === 'error') {
      console.log('\n🚨 ALERT: System has errors!');
      console.log('Errors:', health.errors.join(', '));
      
      // In production, send email/Slack notification here
      // await sendEmailAlert(health);
      // await sendSlackAlert(health);
    }
  }

  /**
   * Run complete monitoring cycle
   */
  async run() {
    try {
      const health = await this.checkHealth();
      await this.saveHealthCheck(health);
      await this.sendAlert(health);
      
      return health;

    } catch (error) {
      console.error('\n💥 Monitor failed:', error.message);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new COCOMonitor();
  
  monitor.run()
    .then(health => {
      process.exit(health.status === 'error' ? 1 : 0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = COCOMonitor;
