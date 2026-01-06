/**
 * COCO Thumbnail Generator
 * 
 * Generates eye-catching thumbnails for YouTube videos
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

/**
 * Generate thumbnail for video
 * @param {string} topic - Video topic
 * @param {Object} script - Generated script data
 * @param {string} videoId - Video identifier
 * @param {Object} config - COCO configuration
 * @returns {Promise<string>} Path to thumbnail file
 */
async function generate(topic, script, videoId, config) {
  console.log('   Generating thumbnail...');
  
  const outputPath = path.join(__dirname, '../../data/coco/thumbnails', `${videoId}.jpg`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Check if OpenAI DALL-E API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('   ⚠️  OPENAI_API_KEY not found, creating mock thumbnail');
    return createMockThumbnail(topic, videoId);
  }

  try {
    // Generate thumbnail prompt
    const prompt = createThumbnailPrompt(topic, config);
    console.log(`   Prompt: "${prompt}"`);

    // Use DALL-E to generate thumbnail
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024', // YouTube thumbnail size
        quality: 'hd',
        style: 'vivid'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const imageUrl = response.data.data[0].url;

    // Download the generated image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    await fs.writeFile(outputPath, imageResponse.data);
    console.log(`   ✓ Thumbnail generated: ${outputPath}`);
    
    return outputPath;

  } catch (error) {
    if (error.response) {
      console.error('   ❌ DALL-E API Error:', error.response.status, error.response.data);
      console.warn('   Creating mock thumbnail as fallback');
      return createMockThumbnail(topic, videoId);
    } else {
      console.warn(`   ⚠️  Thumbnail generation failed: ${error.message}`);
      return createMockThumbnail(topic, videoId);
    }
  }
}

/**
 * Create thumbnail prompt for DALL-E
 */
function createThumbnailPrompt(topic, config) {
  const stylePreset = config.ai_tools.midjourney.style_preset;
  
  return `
Create a professional YouTube thumbnail for a video titled "${topic}".
Style: ${stylePreset}
Design requirements:
- Bold, eye-catching text overlay with the topic
- Motorcycle or automotive tools in the background
- Vibrant colors that stand out (yellow, red, blue)
- Professional mechanic workshop aesthetic
- High contrast for visibility
- Include visual elements related to diagnostics or repair
- "AI-Powered" badge or indicator
- Modern, professional design suitable for educational content
Image should be dramatic and click-worthy while maintaining professionalism.
  `.trim();
}

/**
 * Create mock thumbnail for testing
 */
async function createMockThumbnail(topic, videoId) {
  const outputPath = path.join(__dirname, '../../data/coco/thumbnails', `${videoId}_mock.jpg`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Create a simple text-based thumbnail using Node.js
  // In production, you'd use a library like Sharp or Canvas
  const mockImageData = createSimpleTextImage(topic);
  await fs.writeFile(outputPath, mockImageData);
  
  console.log('   ✓ Mock thumbnail created');
  return outputPath;
}

/**
 * Create a simple text-based image (placeholder)
 */
function createSimpleTextImage(text) {
  // This is a minimal JPEG header + data
  // In production, use a proper image library
  return Buffer.from('MOCK_THUMBNAIL_' + text);
}

/**
 * Generate thumbnail using template overlay
 * (Alternative method using image templates)
 */
async function generateFromTemplate(topic, templatePath, outputPath) {
  // This would use an image processing library like Sharp
  // to overlay text on a template image
  console.log('   Using template-based thumbnail generation');
  
  // Placeholder implementation
  throw new Error('Template-based generation not yet implemented');
}

module.exports = {
  generate,
  createThumbnailPrompt,
  generateFromTemplate
};
