/**
 * COCO Content Generation Pipeline - Main Orchestrator
 * 
 * This script coordinates the entire video generation pipeline:
 * Topic Input → GPT-4 Script → ElevenLabs Voice → D-ID Avatar → FFmpeg Assembly → YouTube Upload
 * 
 * Usage: node scripts/coco/generate-content.js --topic "P0300 Misfire Code Diagnosis"
 */

const fs = require('fs').promises;
const path = require('path');
const scriptGenerator = require('./script-generator');
const voiceSynthesis = require('./voice-synthesis');
const avatarAnimator = require('./avatar-animator');
const videoAssembler = require('./video-assembler');
const thumbnailGenerator = require('./thumbnail-generator');
const youtubeUploader = require('./youtube-uploader');
const analyticsTracker = require('./analytics-tracker');

// Load configuration
const configPath = path.join(__dirname, '../../config/coco-config.json');
let config;

/**
 * Initialize the content generation pipeline
 */
async function initialize() {
  try {
    const configData = await fs.readFile(configPath, 'utf8');
    config = JSON.parse(configData);
    console.log('✅ Configuration loaded successfully');
    console.log(`🤖 COCO Persona: ${config.persona.fullName}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to load configuration:', error.message);
    throw error;
  }
}

/**
 * Main content generation pipeline
 * @param {string} topic - Video topic/title
 * @param {Object} options - Additional options
 */
async function generateContent(topic, options = {}) {
  const startTime = Date.now();
  const videoId = `coco_${Date.now()}`;
  
  console.log('\n🎬 ========================================');
  console.log(`   COCO Content Generation Pipeline`);
  console.log('   ========================================');
  console.log(`📌 Topic: ${topic}`);
  console.log(`🆔 Video ID: ${videoId}`);
  console.log(`⏰ Started: ${new Date().toISOString()}\n`);

  const pipeline = {
    videoId,
    topic,
    startTime,
    steps: {},
    errors: []
  };

  try {
    // Step 1: Generate script with GPT-4
    console.log('📝 Step 1/7: Generating script with GPT-4...');
    const script = await scriptGenerator.generateScript(topic, config);
    pipeline.steps.script = { status: 'success', duration: Date.now() - startTime };
    console.log(`✅ Script generated (${script.wordCount} words, ~${script.estimatedDuration} minutes)`);

    // Step 2: Synthesize voice with ElevenLabs
    console.log('\n🎙️  Step 2/7: Synthesizing voice with ElevenLabs...');
    const audioPath = await voiceSynthesis.synthesize(script.text, videoId, config);
    pipeline.steps.voice = { status: 'success', audioPath };
    console.log(`✅ Voice synthesized: ${audioPath}`);

    // Step 3: Animate avatar with D-ID
    console.log('\n🎭 Step 3/7: Animating avatar with D-ID...');
    const avatarVideoPath = await avatarAnimator.animate(audioPath, videoId, config);
    pipeline.steps.avatar = { status: 'success', videoPath: avatarVideoPath };
    console.log(`✅ Avatar animated: ${avatarVideoPath}`);

    // Step 4: Generate thumbnail
    console.log('\n🖼️  Step 4/7: Generating thumbnail...');
    const thumbnailPath = await thumbnailGenerator.generate(topic, script, videoId, config);
    pipeline.steps.thumbnail = { status: 'success', thumbnailPath };
    console.log(`✅ Thumbnail generated: ${thumbnailPath}`);

    // Step 5: Assemble final video with FFmpeg
    console.log('\n🎬 Step 5/7: Assembling final video with FFmpeg...');
    const finalVideoPath = await videoAssembler.assemble({
      avatarVideo: avatarVideoPath,
      audio: audioPath,
      videoId,
      config
    });
    pipeline.steps.assembly = { status: 'success', videoPath: finalVideoPath };
    console.log(`✅ Video assembled: ${finalVideoPath}`);

    // Step 6: Upload to YouTube (if enabled)
    if (options.upload && config.automation.enable_auto_upload) {
      console.log('\n📤 Step 6/7: Uploading to YouTube...');
      const uploadResult = await youtubeUploader.upload({
        videoPath: finalVideoPath,
        thumbnailPath,
        title: topic,
        description: script.description,
        tags: script.tags,
        config
      });
      pipeline.steps.upload = { status: 'success', youtubeId: uploadResult.id, url: uploadResult.url };
      console.log(`✅ Video uploaded: ${uploadResult.url}`);
    } else {
      console.log('\n⏭️  Step 6/7: YouTube upload skipped (manual review required)');
      pipeline.steps.upload = { status: 'skipped', reason: 'manual_review_required' };
    }

    // Step 7: Track analytics
    console.log('\n📊 Step 7/7: Tracking analytics...');
    await analyticsTracker.track({
      videoId,
      topic,
      pipeline,
      config
    });
    pipeline.steps.analytics = { status: 'success' };
    console.log('✅ Analytics tracked');

    // Save video history
    await saveVideoHistory(pipeline);

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n✅ ========================================');
    console.log(`   Pipeline completed successfully!`);
    console.log(`   Total duration: ${totalDuration}s`);
    console.log('   ========================================\n');

    return {
      success: true,
      videoId,
      finalVideoPath,
      thumbnailPath,
      duration: totalDuration,
      pipeline
    };

  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('   Pipeline failed!');
    console.error('   ========================================');
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}\n`);

    pipeline.errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    await saveVideoHistory(pipeline);

    return {
      success: false,
      error: error.message,
      pipeline
    };
  }
}

/**
 * Save video generation history to JSON file
 */
async function saveVideoHistory(pipeline) {
  try {
    const historyPath = path.join(__dirname, '../../data/coco/video-history.json');
    let history = [];

    try {
      const existingData = await fs.readFile(historyPath, 'utf8');
      history = JSON.parse(existingData);
    } catch (err) {
      // File doesn't exist yet, start with empty array
    }

    history.push({
      ...pipeline,
      completedAt: new Date().toISOString()
    });

    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
    console.log('💾 Video history saved');
  } catch (error) {
    console.error('⚠️  Failed to save video history:', error.message);
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
🤖 COCO Content Generation Pipeline
====================================

Usage: node scripts/coco/generate-content.js --topic "Your Video Topic" [options]

Options:
  --topic "topic"     Video topic/title (required)
  --upload            Upload to YouTube after generation
  --help              Show this help message

Examples:
  node scripts/coco/generate-content.js --topic "P0300 Misfire Diagnosis"
  node scripts/coco/generate-content.js --topic "Quick Fix: Check Engine Light" --upload

⚠️  Legal Disclaimer:
    All AI-generated content includes disclaimers that this is for
    educational purposes only. Always consult a licensed mechanic.
    `);
    process.exit(0);
  }

  const topicIndex = args.indexOf('--topic');
  if (topicIndex === -1 || !args[topicIndex + 1]) {
    console.error('❌ Error: --topic is required');
    process.exit(1);
  }

  const topic = args[topicIndex + 1];
  const upload = args.includes('--upload');

  try {
    await initialize();
    const result = await generateContent(topic, { upload });
    
    if (result.success) {
      console.log('\n📁 Output Files:');
      console.log(`   Video: ${result.finalVideoPath}`);
      console.log(`   Thumbnail: ${result.thumbnailPath}`);
      if (result.pipeline.steps.upload?.youtubeId) {
        console.log(`   YouTube: ${result.pipeline.steps.upload.url}`);
      }
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  initialize,
  generateContent,
  saveVideoHistory
};
