/**
 * COCO Video Assembler - FFmpeg Integration
 * 
 * Assembles final video with intro, outro, and b-roll using FFmpeg
 */

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');

const execPromise = util.promisify(exec);

/**
 * Assemble final video using FFmpeg
 * @param {Object} params - Assembly parameters
 * @returns {Promise<string>} Path to final video
 */
async function assemble(params) {
  const { avatarVideo, audio, videoId, config } = params;
  
  console.log('   Assembling video with FFmpeg...');
  
  const outputPath = path.join(__dirname, '../../data/coco/videos', `${videoId}_final.mp4`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Check if FFmpeg is available
  try {
    await execPromise('ffmpeg -version');
  } catch (error) {
    console.warn('   ⚠️  FFmpeg not found, creating mock final video');
    return createMockFinalVideo(videoId, avatarVideo);
  }

  // Check if input files exist
  try {
    await fs.access(avatarVideo);
  } catch (error) {
    throw new Error(`Avatar video not found: ${avatarVideo}`);
  }

  const videoSpecs = config.content_strategy.video_specs;

  try {
    // Basic assembly: avatar video with watermark and end screen
    const watermarkText = config.youtube.branding.watermark_text;
    
    // FFmpeg command to:
    // 1. Add watermark
    // 2. Ensure proper encoding for YouTube
    // 3. Add metadata
    const ffmpegCommand = `
      ffmpeg -i "${avatarVideo}" \
        -vf "drawtext=text='${watermarkText}':fontsize=24:fontcolor=white@0.8:x=w-tw-10:y=h-th-10" \
        -c:v libx264 \
        -preset medium \
        -crf 23 \
        -b:v ${videoSpecs.video_bitrate} \
        -c:a aac \
        -b:a ${videoSpecs.audio_bitrate} \
        -ar 48000 \
        -pix_fmt yuv420p \
        -movflags +faststart \
        -metadata title="${videoId}" \
        -metadata artist="COCO - The AI Mechanic" \
        -metadata comment="Powered by RideWire AI Hub" \
        -y "${outputPath}"
    `.replace(/\s+/g, ' ').trim();

    console.log('   Running FFmpeg...');
    const { stdout, stderr } = await execPromise(ffmpegCommand, {
      maxBuffer: 50 * 1024 * 1024 // 50MB buffer
    });

    // Check if output file was created
    await fs.access(outputPath);
    
    const stats = await fs.stat(outputPath);
    console.log(`   ✓ Video assembled: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    return outputPath;

  } catch (error) {
    console.error('   ❌ FFmpeg error:', error.message);
    throw new Error(`Video assembly failed: ${error.message}`);
  }
}

/**
 * Create mock final video for testing
 */
async function createMockFinalVideo(videoId, avatarVideo) {
  const outputPath = path.join(__dirname, '../../data/coco/videos', `${videoId}_final_mock.mp4`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // Copy avatar video as mock final video
  try {
    await fs.copyFile(avatarVideo, outputPath);
    console.log('   ✓ Mock final video created (FFmpeg not available)');
  } catch (error) {
    // If avatar is also mock, create new mock
    const mockMp4 = Buffer.from('MOCK_FINAL_VIDEO_DATA');
    await fs.writeFile(outputPath, mockMp4);
    console.log('   ✓ Mock final video created');
  }
  
  return outputPath;
}

/**
 * Add intro and outro to video
 * @param {string} mainVideo - Main video path
 * @param {string} introPath - Intro video path (optional)
 * @param {string} outroPath - Outro video path (optional)
 * @returns {Promise<string>} Path to concatenated video
 */
async function addIntroOutro(mainVideo, introPath, outroPath, outputPath) {
  console.log('   Adding intro and outro...');
  
  const parts = [];
  if (introPath) parts.push(introPath);
  parts.push(mainVideo);
  if (outroPath) parts.push(outroPath);

  if (parts.length === 1) {
    // No intro/outro, just copy main video
    await fs.copyFile(mainVideo, outputPath);
    return outputPath;
  }

  // Create concat file
  const concatListPath = path.join(path.dirname(outputPath), 'concat_list.txt');
  const concatContent = parts.map(p => `file '${path.resolve(p)}'`).join('\n');
  await fs.writeFile(concatListPath, concatContent);

  try {
    const command = `ffmpeg -f concat -safe 0 -i "${concatListPath}" -c copy -y "${outputPath}"`;
    await execPromise(command);
    await fs.unlink(concatListPath); // Clean up
    console.log('   ✓ Intro/outro added');
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to add intro/outro: ${error.message}`);
  }
}

/**
 * Get video duration
 * @param {string} videoPath - Path to video file
 * @returns {Promise<number>} Duration in seconds
 */
async function getVideoDuration(videoPath) {
  try {
    const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
    const { stdout } = await execPromise(command);
    return parseFloat(stdout.trim());
  } catch (error) {
    console.warn('   ⚠️  Could not determine video duration');
    return 0;
  }
}

module.exports = {
  assemble,
  addIntroOutro,
  getVideoDuration
};
