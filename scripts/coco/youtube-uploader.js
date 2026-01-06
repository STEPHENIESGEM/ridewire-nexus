/**
 * COCO YouTube Uploader - YouTube Data API v3 Integration
 * 
 * Uploads videos to YouTube with metadata and thumbnails
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Upload video to YouTube
 * @param {Object} params - Upload parameters
 * @returns {Promise<Object>} Upload result with video ID and URL
 */
async function upload(params) {
  const { videoPath, thumbnailPath, title, description, tags, config } = params;
  
  console.log('   Uploading to YouTube...');
  console.log(`   Title: ${title}`);

  // Check for YouTube API credentials
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('   ⚠️  YouTube credentials not configured');
    return mockUpload(videoPath, title);
  }

  try {
    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'http://localhost:3000/oauth2callback' // Redirect URI
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // Prepare video metadata
    const videoMetadata = {
      snippet: {
        title: title,
        description: description,
        tags: tags || config.youtube.upload_defaults.tags,
        categoryId: config.youtube.upload_defaults.category_id,
        defaultLanguage: 'en',
        defaultAudioLanguage: 'en'
      },
      status: {
        privacyStatus: config.youtube.upload_defaults.privacy_status,
        embeddable: config.youtube.upload_defaults.embeddable,
        license: config.youtube.upload_defaults.license,
        publicStatsViewable: config.youtube.upload_defaults.public_stats_viewable,
        selfDeclaredMadeForKids: false
      }
    };

    // Upload video
    console.log('   Uploading video file...');
    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: videoMetadata,
      media: {
        body: fs.createReadStream(videoPath)
      }
    });

    const videoId = uploadResponse.data.id;
    console.log(`   ✓ Video uploaded: ${videoId}`);

    // Upload thumbnail if provided
    if (thumbnailPath) {
      try {
        console.log('   Uploading thumbnail...');
        await youtube.thumbnails.set({
          videoId: videoId,
          media: {
            body: fs.createReadStream(thumbnailPath)
          }
        });
        console.log('   ✓ Thumbnail uploaded');
      } catch (thumbError) {
        console.warn('   ⚠️  Thumbnail upload failed:', thumbError.message);
      }
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`   ✓ Video URL: ${videoUrl}`);

    return {
      success: true,
      id: videoId,
      url: videoUrl,
      uploadedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('   ❌ YouTube upload error:', error.message);
    throw new Error(`YouTube upload failed: ${error.message}`);
  }
}

/**
 * Mock upload for testing without YouTube credentials
 */
function mockUpload(videoPath, title) {
  const mockVideoId = 'MOCK_' + Date.now();
  const mockUrl = `https://www.youtube.com/watch?v=${mockVideoId}`;
  
  console.log('   ✓ Mock upload completed');
  console.log(`   Mock URL: ${mockUrl}`);

  return {
    success: true,
    id: mockVideoId,
    url: mockUrl,
    uploadedAt: new Date().toISOString(),
    isMock: true
  };
}

/**
 * Update video metadata
 * @param {string} videoId - YouTube video ID
 * @param {Object} updates - Metadata updates
 */
async function updateMetadata(videoId, updates) {
  console.log(`   Updating video metadata for ${videoId}...`);

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('   ⚠️  YouTube credentials not configured');
    return { success: false, error: 'No credentials' };
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    await youtube.videos.update({
      part: ['snippet'],
      requestBody: {
        id: videoId,
        snippet: updates
      }
    });

    console.log('   ✓ Metadata updated');
    return { success: true };

  } catch (error) {
    console.error('   ❌ Metadata update failed:', error.message);
    throw new Error(`Metadata update failed: ${error.message}`);
  }
}

/**
 * Get video analytics
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Video analytics
 */
async function getAnalytics(videoId) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return { views: 0, likes: 0, comments: 0, isMock: true };
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const response = await youtube.videos.list({
      part: ['statistics'],
      id: [videoId]
    });

    const stats = response.data.items[0]?.statistics || {};

    return {
      views: parseInt(stats.viewCount || 0),
      likes: parseInt(stats.likeCount || 0),
      comments: parseInt(stats.commentCount || 0),
      favorites: parseInt(stats.favoriteCount || 0)
    };

  } catch (error) {
    console.error('   ❌ Analytics fetch failed:', error.message);
    return { views: 0, likes: 0, comments: 0, error: error.message };
  }
}

module.exports = {
  upload,
  updateMetadata,
  getAnalytics
};
