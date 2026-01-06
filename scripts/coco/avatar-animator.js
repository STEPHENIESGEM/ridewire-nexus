/**
 * COCO Avatar Animator - D-ID Integration
 * 
 * Animates COCO's avatar using D-ID API
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

/**
 * Animate avatar with audio using D-ID
 * @param {string} audioPath - Path to audio file
 * @param {string} videoId - Video identifier
 * @param {Object} config - COCO configuration
 * @returns {Promise<string>} Path to generated video file
 */
async function animate(audioPath, videoId, config) {
  console.log('   Animating avatar...');
  
  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) {
    console.warn('   ⚠️  DID_API_KEY not found, using mock video');
    return createMockVideo(videoId);
  }

  const outputPath = path.join(__dirname, '../../data/coco/videos', `${videoId}_avatar.mp4`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Check if audio file exists
  try {
    await fs.access(audioPath);
  } catch (error) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  // In production, you would upload the audio to a CDN or D-ID's servers
  // For now, we'll use a placeholder URL
  const audioUrl = `https://example.com/audio/${videoId}.mp3`;

  try {
    // Step 1: Create talk
    console.log('   Creating D-ID talk...');
    const createResponse = await axios.post(
      `${config.ai_tools.did.api_endpoint}/talks`,
      {
        script: {
          type: 'audio',
          audio_url: audioUrl
        },
        source_url: config.ai_tools.did.presenter.source_url,
        driver_url: config.ai_tools.did.presenter.driver_url,
        config: config.ai_tools.did.config
      },
      {
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const talkId = createResponse.data.id;
    console.log(`   ✓ Talk created: ${talkId}`);

    // Step 2: Poll for completion
    console.log('   Waiting for D-ID processing...');
    const videoUrl = await pollTalkStatus(talkId, apiKey, config);

    // Step 3: Download video
    console.log('   Downloading avatar video...');
    const videoResponse = await axios.get(videoUrl, {
      responseType: 'arraybuffer',
      timeout: 300000 // 5 minute timeout for large videos
    });

    await fs.writeFile(outputPath, videoResponse.data);
    console.log(`   ✓ Avatar animated: ${outputPath}`);
    
    return outputPath;

  } catch (error) {
    if (error.response) {
      console.error('   ❌ D-ID API Error:', error.response.status, error.response.data);
      throw new Error(`D-ID API error: ${error.response.data.message || error.response.status}`);
    } else if (error.request) {
      throw new Error('No response from D-ID API - check network connection');
    } else {
      throw new Error(`Avatar animation failed: ${error.message}`);
    }
  }
}

/**
 * Poll D-ID talk status until completion
 */
async function pollTalkStatus(talkId, apiKey, config, maxAttempts = 60) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

    try {
      const response = await axios.get(
        `${config.ai_tools.did.api_endpoint}/talks/${talkId}`,
        {
          headers: {
            'Authorization': `Basic ${apiKey}`
          }
        }
      );

      const status = response.data.status;
      console.log(`   Status: ${status} (${attempt + 1}/${maxAttempts})`);

      if (status === 'done') {
        return response.data.result_url;
      } else if (status === 'error') {
        throw new Error(`D-ID processing failed: ${response.data.error}`);
      }

    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  throw new Error('D-ID processing timeout - exceeded maximum polling attempts');
}

/**
 * Create mock video for testing
 */
async function createMockVideo(videoId) {
  const outputPath = path.join(__dirname, '../../data/coco/videos', `${videoId}_avatar_mock.mp4`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Create a minimal valid MP4 file marker
  const mockMp4 = Buffer.from('MOCK_VIDEO_DATA');
  await fs.writeFile(outputPath, mockMp4);
  console.log('   ✓ Mock video created (D-ID not configured)');
  
  return outputPath;
}

module.exports = {
  animate,
  pollTalkStatus
};
