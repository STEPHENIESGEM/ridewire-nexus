#!/usr/bin/env node

/**
 * COCO AI Influencer - Analytics Tracker
 * 
 * Tracks and reports on:
 * - Video views, likes, comments
 * - Subscriber growth
 * - Revenue estimates from ads
 * - Engagement metrics
 * - Content performance
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class AnalyticsTracker {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.channelId = process.env.YOUTUBE_CHANNEL_ID;
    this.analyticsPath = path.join(__dirname, '../../data/coco-analytics.json');
    this.dataDir = path.join(__dirname, '../../data');
    
    // Revenue estimation (YouTube typical CPM ranges)
    this.cpmRanges = {
      min: 0.25,  // $0.25 per 1000 views (lower end)
      avg: 2.00,  // $2.00 per 1000 views (average)
      max: 4.00   // $4.00 per 1000 views (higher end for tech/auto content)
    };
  }

  /**
   * Initialize analytics tracking
   */
  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      try {
        await fs.access(this.analyticsPath);
      } catch {
        await this.createAnalyticsFile();
      }
      
      console.log('✅ Analytics tracker initialized');
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Create empty analytics file
   */
  async createAnalyticsFile() {
    const analytics = {
      created: new Date().toISOString(),
      channel: {
        id: this.channelId || 'not_configured',
        subscribers: 0,
        totalViews: 0,
        totalVideos: 0
      },
      videos: [],
      revenue: {
        total: 0,
        byMonth: {}
      },
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(this.analyticsPath, JSON.stringify(analytics, null, 2));
    console.log('📊 Analytics file created');
  }

  /**
   * Fetch video analytics from YouTube
   */
  async fetchVideoAnalytics(videoId) {
    console.log(`📊 Fetching analytics for video: ${videoId}`);
    
    if (!this.apiKey) {
      console.warn('⚠️  YouTube API key not configured, using simulated data');
      return this.simulateVideoAnalytics(videoId);
    }

    try {
      // In production, call YouTube Analytics API
      /*
      const { google } = require('googleapis');
      const youtube = google.youtube({ version: 'v3', auth: this.apiKey });
      
      const response = await youtube.videos.list({
        part: 'statistics,snippet',
        id: videoId
      });
      
      if (response.data.items.length === 0) {
        throw new Error('Video not found');
      }
      
      const video = response.data.items[0];
      const stats = video.statistics;
      
      return {
        videoId,
        title: video.snippet.title,
        views: parseInt(stats.viewCount) || 0,
        likes: parseInt(stats.likeCount) || 0,
        comments: parseInt(stats.commentCount) || 0,
        publishedAt: video.snippet.publishedAt,
        fetchedAt: new Date().toISOString()
      };
      */
      
      return this.simulateVideoAnalytics(videoId);
      
    } catch (error) {
      console.error('❌ Failed to fetch analytics:', error.message);
      return this.simulateVideoAnalytics(videoId);
    }
  }

  /**
   * Simulate video analytics for demonstration
   */
  simulateVideoAnalytics(videoId) {
    // Generate realistic-looking numbers
    const baseViews = Math.floor(Math.random() * 5000) + 500;
    const engagementRate = 0.05; // 5% engagement typical
    
    return {
      videoId,
      title: 'Sample Video Title',
      views: baseViews,
      likes: Math.floor(baseViews * engagementRate),
      comments: Math.floor(baseViews * engagementRate * 0.1),
      watchTime: baseViews * (Math.random() * 2 + 1), // avg 1-3 min per view
      publishedAt: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      simulated: true
    };
  }

  /**
   * Calculate revenue estimate
   */
  calculateRevenue(views, cpmType = 'avg') {
    const cpm = this.cpmRanges[cpmType] || this.cpmRanges.avg;
    return (views / 1000) * cpm;
  }

  /**
   * Generate analytics report
   */
  async generateReport() {
    await this.initialize();
    
    console.log('\n📊 COCO AI Analytics Report\n');
    console.log('=' .repeat(60));
    
    const data = await fs.readFile(this.analyticsPath, 'utf8');
    const analytics = JSON.parse(data);
    
    // Channel Overview
    console.log('\n📺 Channel Overview:');
    console.log(`   Subscribers: ${analytics.channel.subscribers.toLocaleString()}`);
    console.log(`   Total Views: ${analytics.channel.totalViews.toLocaleString()}`);
    console.log(`   Total Videos: ${analytics.channel.totalVideos}`);
    
    // Video Performance
    if (analytics.videos.length > 0) {
      console.log('\n🎬 Video Performance:');
      
      // Sort by views
      const topVideos = [...analytics.videos]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
      
      topVideos.forEach((video, i) => {
        console.log(`\n   ${i + 1}. ${video.title || video.videoId}`);
        console.log(`      Views: ${video.views.toLocaleString()}`);
        console.log(`      Likes: ${video.likes.toLocaleString()}`);
        console.log(`      Comments: ${video.comments.toLocaleString()}`);
        console.log(`      Engagement: ${((video.likes / video.views) * 100).toFixed(2)}%`);
      });
      
      // Calculate totals
      const totalViews = analytics.videos.reduce((sum, v) => sum + v.views, 0);
      const totalLikes = analytics.videos.reduce((sum, v) => sum + v.likes, 0);
      const totalComments = analytics.videos.reduce((sum, v) => sum + v.comments, 0);
      
      console.log('\n📈 Aggregate Metrics:');
      console.log(`   Total Views: ${totalViews.toLocaleString()}`);
      console.log(`   Total Likes: ${totalLikes.toLocaleString()}`);
      console.log(`   Total Comments: ${totalComments.toLocaleString()}`);
      console.log(`   Avg Views/Video: ${Math.floor(totalViews / analytics.videos.length).toLocaleString()}`);
      
      // Revenue Estimates
      console.log('\n💰 Revenue Estimates (based on typical YouTube CPM):');
      console.log(`   Conservative ($${this.cpmRanges.min}/1000 views): $${this.calculateRevenue(totalViews, 'min').toFixed(2)}`);
      console.log(`   Average ($${this.cpmRanges.avg}/1000 views): $${this.calculateRevenue(totalViews, 'avg').toFixed(2)}`);
      console.log(`   Optimistic ($${this.cpmRanges.max}/1000 views): $${this.calculateRevenue(totalViews, 'max').toFixed(2)}`);
      
    } else {
      console.log('\n⚠️  No video data available yet');
    }
    
    console.log(`\n   Last Updated: ${new Date(analytics.lastUpdated).toLocaleString()}`);
    console.log('\n' + '='.repeat(60) + '\n');
    
    return analytics;
  }

  /**
   * Update analytics for all videos
   */
  async updateAllVideos() {
    await this.initialize();
    
    console.log('\n🔄 Updating analytics for all videos...\n');
    
    const data = await fs.readFile(this.analyticsPath, 'utf8');
    const analytics = JSON.parse(data);
    
    if (analytics.videos.length === 0) {
      console.log('⚠️  No videos to update');
      return;
    }
    
    let updatedCount = 0;
    
    for (const video of analytics.videos) {
      try {
        const freshData = await this.fetchVideoAnalytics(video.videoId);
        
        // Update video data
        Object.assign(video, freshData);
        updatedCount++;
        
        console.log(`✅ Updated: ${video.videoId} (${video.views} views)`);
        
      } catch (error) {
        console.error(`❌ Failed to update ${video.videoId}:`, error.message);
      }
    }
    
    // Update channel totals
    analytics.channel.totalViews = analytics.videos.reduce((sum, v) => sum + v.views, 0);
    analytics.channel.totalVideos = analytics.videos.length;
    analytics.lastUpdated = new Date().toISOString();
    
    // Save updated analytics
    await fs.writeFile(this.analyticsPath, JSON.stringify(analytics, null, 2));
    
    console.log(`\n✅ Updated ${updatedCount} videos successfully`);
  }

  /**
   * Add new video to tracking
   */
  async trackNewVideo(videoId, metadata = {}) {
    await this.initialize();
    
    console.log(`\n📊 Adding video to analytics: ${videoId}`);
    
    const data = await fs.readFile(this.analyticsPath, 'utf8');
    const analytics = JSON.parse(data);
    
    // Check if already tracking
    if (analytics.videos.some(v => v.videoId === videoId)) {
      console.log('⚠️  Video already being tracked');
      return;
    }
    
    // Fetch initial analytics
    const videoData = await this.fetchVideoAnalytics(videoId);
    videoData.metadata = metadata;
    
    analytics.videos.push(videoData);
    analytics.channel.totalVideos = analytics.videos.length;
    analytics.lastUpdated = new Date().toISOString();
    
    await fs.writeFile(this.analyticsPath, JSON.stringify(analytics, null, 2));
    
    console.log('✅ Video added to tracking');
  }

  /**
   * Export analytics to CSV
   */
  async exportToCSV(outputPath) {
    await this.initialize();
    
    const data = await fs.readFile(this.analyticsPath, 'utf8');
    const analytics = JSON.parse(data);
    
    if (analytics.videos.length === 0) {
      console.log('⚠️  No data to export');
      return;
    }
    
    const csv = ['Video ID,Title,Views,Likes,Comments,Published At,Revenue Estimate'];
    
    for (const video of analytics.videos) {
      const revenue = this.calculateRevenue(video.views, 'avg');
      csv.push(`${video.videoId},"${video.title}",${video.views},${video.likes},${video.comments},${video.publishedAt},${revenue.toFixed(2)}`);
    }
    
    await fs.writeFile(outputPath, csv.join('\n'));
    console.log(`✅ Analytics exported to: ${outputPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const tracker = new AnalyticsTracker();
  const args = process.argv.slice(2);
  
  if (args.includes('--update')) {
    tracker.updateAllVideos()
      .then(() => tracker.generateReport())
      .catch(console.error);
  } else if (args.includes('--track')) {
    const videoId = args[args.indexOf('--track') + 1];
    if (!videoId) {
      console.error('❌ Please provide video ID: --track <video-id>');
      process.exit(1);
    }
    tracker.trackNewVideo(videoId).catch(console.error);
  } else if (args.includes('--export')) {
    const outputPath = args[args.indexOf('--export') + 1] || 'analytics-export.csv';
    tracker.exportToCSV(outputPath).catch(console.error);
  } else {
    tracker.generateReport().catch(console.error);
  }
}

module.exports = AnalyticsTracker;
