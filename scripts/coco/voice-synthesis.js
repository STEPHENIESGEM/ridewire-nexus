/**
 * COCO Voice Synthesis - ElevenLabs Integration
 * 
 * Synthesizes COCO's voice using ElevenLabs API
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

/**
 * Synthesize voice from text using ElevenLabs
 * @param {string} text - Script text to synthesize
 * @param {string} videoId - Video identifier
 * @param {Object} config - COCO configuration
 * @returns {Promise<string>} Path to generated audio file
 */
async function synthesize(text, videoId, config) {
  console.log('   Synthesizing voice...');
  
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn('   ⚠️  ELEVENLABS_API_KEY not found, using mock audio');
    return createMockAudio(videoId);
  }

  const voiceId = config.persona.voice.voice_id;
  if (voiceId === 'YOUR_ELEVENLABS_VOICE_ID_HERE') {
    console.warn('   ⚠️  ElevenLabs voice ID not configured, using mock audio');
    return createMockAudio(videoId);
  }

  const endpoint = `${config.ai_tools.elevenlabs.api_endpoint}/text-to-speech/${voiceId}`;
  const outputPath = path.join(__dirname, '../../data/coco/audio', `${videoId}.mp3`);

  // Ensure output directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  try {
    const response = await axios.post(
      endpoint,
      {
        text: text,
        model_id: config.persona.voice.model,
        voice_settings: {
          stability: config.persona.voice.stability,
          similarity_boost: config.persona.voice.similarity_boost,
          style: config.persona.voice.style,
          use_speaker_boost: config.persona.voice.use_speaker_boost
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 120000 // 2 minute timeout for long scripts
      }
    );

    await fs.writeFile(outputPath, response.data);
    console.log(`   ✓ Voice synthesized: ${outputPath}`);
    
    return outputPath;

  } catch (error) {
    if (error.response) {
      console.error('   ❌ ElevenLabs API Error:', error.response.status, error.response.statusText);
      throw new Error(`ElevenLabs API error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No response from ElevenLabs API - check network connection');
    } else {
      throw new Error(`Voice synthesis failed: ${error.message}`);
    }
  }
}

/**
 * Create mock audio file for testing
 */
async function createMockAudio(videoId) {
  const outputPath = path.join(__dirname, '../../data/coco/audio', `${videoId}_mock.mp3`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Create a minimal valid MP3 file (silence)
  const mockMp3 = Buffer.from('SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'base64');
  
  await fs.writeFile(outputPath, mockMp3);
  console.log('   ✓ Mock audio created (ElevenLabs not configured)');
  
  return outputPath;
}

/**
 * Get voice synthesis cost estimate
 * @param {string} text - Text to estimate
 * @returns {Object} Cost estimate
 */
function estimateCost(text) {
  const characterCount = text.length;
  // ElevenLabs pricing: ~$0.30 per 1000 characters (varies by model)
  const costPer1000 = 0.30;
  const estimatedCost = (characterCount / 1000) * costPer1000;
  
  return {
    characters: characterCount,
    estimatedCost: estimatedCost.toFixed(4),
    currency: 'USD'
  };
}

module.exports = {
  synthesize,
  estimateCost
};
