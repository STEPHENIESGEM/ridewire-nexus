/**
 * COCO Analytics Tracker
 * 
 * Tracks video performance, revenue, and engagement metrics
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Track video analytics and performance
 * @param {Object} data - Analytics data to track
 */
async function track(data) {
  const { videoId, topic, pipeline, config } = data;
  
  console.log('   Tracking analytics...');

  const analyticsPath = path.join(__dirname, '../../data/coco/analytics.json');
  await fs.mkdir(path.dirname(analyticsPath), { recursive: true });

  const entry = {
    videoId,
    topic,
    generatedAt: new Date().toISOString(),
    pipeline: {
      scriptGeneration: pipeline.steps.script?.status,
      voiceSynthesis: pipeline.steps.voice?.status,
      avatarAnimation: pipeline.steps.avatar?.status,
      thumbnailGeneration: pipeline.steps.thumbnail?.status,
      videoAssembly: pipeline.steps.assembly?.status,
      upload: pipeline.steps.upload?.status
    },
    youtubeId: pipeline.steps.upload?.youtubeId || null,
    youtubeUrl: pipeline.steps.upload?.url || null,
    status: pipeline.errors.length > 0 ? 'failed' : 'success',
    errors: pipeline.errors,
    performance: {
      views: 0,
      likes: 0,
      comments: 0,
      subscribers_gained: 0,
      revenue: 0,
      lastUpdated: new Date().toISOString()
    },
    affiliate: {
      clicks: 0,
      conversions: 0,
      revenue: 0
    }
  };

  try {
    // Load existing analytics
    let analytics = [];
    try {
      const existingData = await fs.readFile(analyticsPath, 'utf8');
      analytics = JSON.parse(existingData);
    } catch (err) {
      // File doesn't exist yet
    }

    analytics.push(entry);
    await fs.writeFile(analyticsPath, JSON.stringify(analytics, null, 2));
    
    console.log('   ✓ Analytics tracked');

    // Generate summary report
    await generateSummaryReport(analytics);

  } catch (error) {
    console.error('   ⚠️  Analytics tracking failed:', error.message);
  }
}

/**
 * Generate summary analytics report
 */
async function generateSummaryReport(analytics) {
  const reportPath = path.join(__dirname, '../../data/coco/analytics-summary.json');

  const summary = {
    totalVideos: analytics.length,
    successfulUploads: analytics.filter(a => a.status === 'success' && a.youtubeId).length,
    failedGenerations: analytics.filter(a => a.status === 'failed').length,
    totalViews: analytics.reduce((sum, a) => sum + (a.performance.views || 0), 0),
    totalLikes: analytics.reduce((sum, a) => sum + (a.performance.likes || 0), 0),
    totalRevenue: analytics.reduce((sum, a) => sum + (a.performance.revenue || 0), 0),
    affiliateClicks: analytics.reduce((sum, a) => sum + (a.affiliate.clicks || 0), 0),
    affiliateConversions: analytics.reduce((sum, a) => sum + (a.affiliate.conversions || 0), 0),
    affiliateRevenue: analytics.reduce((sum, a) => sum + (a.affiliate.revenue || 0), 0),
    lastGeneration: analytics[analytics.length - 1]?.generatedAt,
    generatedAt: new Date().toISOString()
  };

  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2));
}

/**
 * Update video performance metrics
 * @param {string} videoId - Video identifier
 * @param {Object} metrics - Updated metrics
 */
async function updateMetrics(videoId, metrics) {
  console.log(`   Updating metrics for ${videoId}...`);

  const analyticsPath = path.join(__dirname, '../../data/coco/analytics.json');

  try {
    const data = await fs.readFile(analyticsPath, 'utf8');
    const analytics = JSON.parse(data);

    const videoIndex = analytics.findIndex(a => a.videoId === videoId);
    if (videoIndex === -1) {
      console.warn('   ⚠️  Video not found in analytics');
      return;
    }

    // Update performance metrics
    analytics[videoIndex].performance = {
      ...analytics[videoIndex].performance,
      ...metrics,
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(analyticsPath, JSON.stringify(analytics, null, 2));
    await generateSummaryReport(analytics);

    console.log('   ✓ Metrics updated');

  } catch (error) {
    console.error('   ❌ Metrics update failed:', error.message);
  }
}

/**
 * Get analytics summary
 * @returns {Promise<Object>} Analytics summary
 */
async function getSummary() {
  const reportPath = path.join(__dirname, '../../data/coco/analytics-summary.json');

  try {
    const data = await fs.readFile(reportPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {
      totalVideos: 0,
      successfulUploads: 0,
      failedGenerations: 0,
      totalViews: 0,
      totalLikes: 0,
      totalRevenue: 0,
      error: 'No analytics data available'
    };
  }
}

/**
 * Get top performing videos
 * @param {number} limit - Number of videos to return
 * @returns {Promise<Array>} Top videos
 */
async function getTopVideos(limit = 10) {
  const analyticsPath = path.join(__dirname, '../../data/coco/analytics.json');

  try {
    const data = await fs.readFile(analyticsPath, 'utf8');
    const analytics = JSON.parse(data);

    return analytics
      .sort((a, b) => (b.performance.views || 0) - (a.performance.views || 0))
      .slice(0, limit)
      .map(a => ({
        videoId: a.videoId,
        topic: a.topic,
        views: a.performance.views,
        likes: a.performance.likes,
        revenue: a.performance.revenue,
        url: a.youtubeUrl
      }));

  } catch (error) {
    return [];
  }
}

module.exports = {
  track,
  updateMetrics,
  getSummary,
  getTopVideos
};
