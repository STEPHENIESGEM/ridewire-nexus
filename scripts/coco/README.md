# COCO AI Influencer - Technical Documentation

## Overview

COCO (Conversational Optimized Consensus Orchestrator) is an AI-powered YouTube influencer system that autonomously generates, uploads, and manages video content for RideWire's marketing efforts.

## Architecture

### Content Pipeline Flow

```
Topic Input
    ↓
GPT-4 Script Generation (script-generator.js)
    ↓
ElevenLabs Voice Synthesis (voice-synthesis.js)
    ↓
D-ID Avatar Animation (avatar-animator.js)
    ↓
FFmpeg Video Assembly (video-assembler.js)
    ↓
AI Thumbnail Generation (thumbnail-generator.js)
    ↓
YouTube Upload (youtube-uploader.js)
    ↓
Analytics Tracking (analytics-tracker.js)
```

## Module Documentation

### 1. generate-content.js
**Purpose:** Main orchestrator that coordinates the entire pipeline

**Usage:**
```bash
node scripts/coco/generate-content.js --topic "Your Topic" [--upload]
```

**Key Functions:**
- `initialize()` - Loads configuration
- `generateContent(topic, options)` - Runs full pipeline
- `saveVideoHistory(pipeline)` - Saves generation metadata

**Output:**
- Final video: `data/coco/videos/{videoId}_final.mp4`
- Thumbnail: `data/coco/thumbnails/{videoId}.jpg`
- History: Updates `data/coco/video-history.json`

---

### 2. script-generator.js
**Purpose:** Generates video scripts using GPT-4 with COCO personality

**Key Functions:**
- `generateScript(topic, config)` - Creates script from topic
- `buildAffiliateLink(config)` - Builds tracking URLs
- `addLegalDisclaimer(description, config)` - Adds required disclaimers

**API Requirements:**
- OpenAI API key (GPT-4 access)
- Temperature: 0.7
- Max tokens: 2000

**Cost:** ~$0.03-0.10 per script

---

### 3. voice-synthesis.js
**Purpose:** Converts script text to audio using ElevenLabs

**Key Functions:**
- `synthesize(text, videoId, config)` - Creates audio file
- `estimateCost(text)` - Calculates API cost

**API Requirements:**
- ElevenLabs API key
- Voice ID configured in coco-config.json
- Creator plan recommended ($22/month)

**Cost:** ~$0.30 per 1000 characters (~$0.50-1.50 per video)

**Fallback:** Creates mock audio if API not configured

---

### 4. avatar-animator.js
**Purpose:** Animates COCO avatar with synchronized lip-sync

**Key Functions:**
- `animate(audioPath, videoId, config)` - Creates talking avatar video
- `pollTalkStatus(talkId, apiKey, config)` - Waits for D-ID processing

**API Requirements:**
- D-ID API key (Basic Auth)
- Avatar image URL configured
- Pro plan recommended ($29/month)

**Processing Time:** 5-10 minutes per video

**Cost:** ~$0.60-1.00 per video (1 credit per video)

**Fallback:** Creates mock video if API not configured

---

### 5. video-assembler.js
**Purpose:** Assembles final video with watermarks and encoding

**Key Functions:**
- `assemble(params)` - Creates final video with FFmpeg
- `addIntroOutro(mainVideo, introPath, outroPath)` - Concatenates segments
- `getVideoDuration(videoPath)` - Gets video length

**Requirements:**
- FFmpeg installed and in PATH
- Sufficient disk space (500MB+ per video)

**Encoding Settings:**
- Codec: H.264
- Resolution: 1920x1080
- FPS: 30
- Video bitrate: 5000k
- Audio bitrate: 192k

**Fallback:** Creates mock video if FFmpeg not available

---

### 6. thumbnail-generator.js
**Purpose:** Generates eye-catching thumbnails using DALL-E

**Key Functions:**
- `generate(topic, script, videoId, config)` - Creates thumbnail
- `createThumbnailPrompt(topic, config)` - Builds AI prompt

**API Requirements:**
- OpenAI API key (DALL-E 3)
- HD quality, 1792x1024 resolution

**Cost:** ~$0.04 per thumbnail

**Fallback:** Creates mock thumbnail if API not configured

**Style Guidelines:**
- Bold, high-contrast design
- Large readable text
- Illustrated avatar (not photorealistic)
- Vibrant colors (red, yellow, blue)

---

### 7. youtube-uploader.js
**Purpose:** Uploads videos to YouTube with metadata

**Key Functions:**
- `upload(params)` - Uploads video to YouTube
- `updateMetadata(videoId, updates)` - Updates existing video
- `getAnalytics(videoId)` - Fetches performance metrics

**API Requirements:**
- YouTube Data API v3 credentials
- OAuth 2.0 refresh token
- Quota: 10,000 units/day (~6 uploads)

**Upload Metadata:**
- Title, description, tags from script
- Privacy status: public
- Category: Autos & Vehicles (2)
- Thumbnail auto-uploaded

**Cost:** Free (within quota)

**Fallback:** Creates mock upload if credentials not configured

---

### 8. analytics-tracker.js
**Purpose:** Tracks video performance and revenue metrics

**Key Functions:**
- `track(data)` - Records generation event
- `updateMetrics(videoId, metrics)` - Updates performance data
- `getSummary()` - Gets aggregate statistics
- `getTopVideos(limit)` - Returns best performers

**Data Tracked:**
- Pipeline success/failure
- Video metadata (title, ID, URL)
- Performance metrics (views, likes, comments)
- Revenue (affiliate clicks, conversions)

**Storage:**
- `data/coco/analytics.json` - Full history
- `data/coco/analytics-summary.json` - Aggregated stats

---

### 9. content-calendar.js
**Purpose:** Manages content scheduling and planning

**Key Functions:**
- `generateCalendar(config, weeksAhead)` - Creates schedule
- `getTodaysContent()` - Gets today's scheduled content
- `getUpcomingContent(days)` - Lists future content
- `markCompleted(date, videoId)` - Updates completion status
- `suggestTopics(contentType)` - Returns topic ideas

**Schedule:**
- 3x per week: Monday, Wednesday, Friday
- Upload time: 9:00 AM ET
- Content types rotate: quick_fix, ai_diagnostics, product_review, troubleshooting

**Storage:** `data/coco/content-calendar.json`

---

## Configuration

### coco-config.json Structure

```json
{
  "persona": {
    "name": "COCO",
    "personality": {
      "traits": ["direct", "sarcastic", "educational"],
      "catchphrases": ["Hey wrenchers!", "Let's fix this"]
    },
    "voice": {
      "provider": "ElevenLabs",
      "voice_id": "YOUR_VOICE_ID"
    }
  },
  "youtube": {
    "channel_name": "COCO - The AI Mechanic",
    "upload_defaults": {
      "privacy_status": "public",
      "tags": ["motorcycle repair", "AI diagnostics"]
    }
  },
  "content_strategy": {
    "upload_schedule": {
      "frequency": "3x per week",
      "days": ["Monday", "Wednesday", "Friday"],
      "time": "09:00:00"
    },
    "video_specs": {
      "target_length_minutes": [5, 10],
      "resolution": "1920x1080"
    }
  },
  "revenue_tracking": {
    "affiliate_links": {
      "ridewire_platform": {
        "discount_code": "COCO20",
        "utm_parameters": {}
      }
    }
  },
  "legal": {
    "disclaimer": "AI-generated content disclaimer...",
    "professional_services_disclaimer": "Educational purposes only..."
  }
}
```

---

## Error Handling

All modules implement comprehensive error handling:

1. **API Failures:** Fallback to mock mode with warnings
2. **Network Errors:** Retry with exponential backoff
3. **File I/O Errors:** Create directories as needed
4. **Invalid Configuration:** Clear error messages with guidance

**Example Error Output:**
```
❌ OpenAI API Error: Rate limit exceeded
⚠️  Retrying in 5 seconds...
✅ Retry successful
```

---

## Testing

### Manual Testing

Test individual modules:

```bash
# Test script generation
node -e "require('./scripts/coco/script-generator').generateScript('Test Topic', require('./config/coco-config.json')).then(console.log)"

# Test calendar generation
npm run coco:calendar

# Test analytics
npm run coco:analytics

# Full pipeline test (no upload)
npm run coco:generate -- --topic "Test Video"
```

### Integration Testing

Run full pipeline with all APIs:

```bash
# Set up test environment
cp .env.example .env
# Add real API keys

# Generate test video
npm run coco:generate -- --topic "Integration Test" --upload
```

---

## Performance Metrics

### Typical Generation Times

| Step | Duration | Bottleneck |
|------|----------|------------|
| Script Generation | 10-30s | GPT-4 API |
| Voice Synthesis | 20-60s | ElevenLabs processing |
| Avatar Animation | 5-10 min | D-ID queue time |
| Video Assembly | 30-90s | FFmpeg encoding |
| Thumbnail Generation | 10-20s | DALL-E API |
| YouTube Upload | 1-5 min | File size/bandwidth |
| **Total** | **8-15 min** | D-ID processing |

### Optimization Tips

1. **Parallel Processing:** D-ID animation is the bottleneck—generate multiple videos in parallel
2. **Caching:** Reuse thumbnails/intros across similar content
3. **Batch Processing:** Generate multiple scripts at once
4. **Pre-generation:** Create videos ahead of schedule

---

## Security Considerations

### API Key Management

1. **Never commit API keys** to version control
2. Store in `.env` file (gitignored)
3. Use environment-specific keys (dev vs prod)
4. Rotate keys quarterly
5. Monitor API usage for anomalies

### Content Security

1. **Legal Disclaimers:** Always included automatically
2. **Copyright:** Use only licensed/generated content
3. **Data Privacy:** Don't store user PII in videos
4. **Brand Safety:** Review generated content before upload

### Access Control

1. Limit YouTube API credentials to necessary scopes
2. Use separate OAuth tokens for dev/prod
3. Implement rate limiting on automation
4. Log all generation attempts

---

## Monitoring & Alerts

### Key Metrics to Monitor

- **Success Rate:** % of videos successfully generated
- **API Costs:** Track spending per video
- **Upload Failures:** YouTube quota issues
- **Video Performance:** Views, engagement, revenue

### Recommended Alerts

1. **Pipeline Failure:** Email on 3 consecutive failures
2. **API Budget:** Alert at 80% of monthly budget
3. **YouTube Quota:** Warn when approaching daily limit
4. **Low Performance:** Flag videos with <100 views after 48 hours

---

## Troubleshooting Guide

### Common Issues

**Problem:** "OPENAI_API_KEY not found"
```bash
# Solution: Check .env file
cat .env | grep OPENAI_API_KEY
```

**Problem:** "FFmpeg not found"
```bash
# Solution: Install FFmpeg
brew install ffmpeg  # macOS
sudo apt install ffmpeg  # Ubuntu
```

**Problem:** "D-ID processing timeout"
```bash
# Solution: Increase polling attempts in avatar-animator.js
# Or wait and retry - D-ID queues can be slow
```

**Problem:** "YouTube quota exceeded"
```bash
# Solution: Wait until midnight Pacific Time for quota reset
# Or request quota increase in Google Cloud Console
```

---

## Future Enhancements

### Planned Features

1. **Multi-language Support:** Generate content in Spanish, French
2. **Live Streaming:** COCO live Q&A sessions
3. **Shorts Generation:** Auto-create YouTube Shorts from videos
4. **A/B Testing:** Test multiple thumbnails/titles
5. **Sponsor Integration:** Automated product placement
6. **Community Posts:** Auto-generate YouTube community updates

### Infrastructure Improvements

1. **Queue System:** RabbitMQ for async processing
2. **Distributed Processing:** Multiple workers for parallel generation
3. **Cloud Storage:** S3/GCS for video files
4. **CDN:** Faster thumbnail delivery
5. **Database:** PostgreSQL for analytics

---

## Cost Analysis

### Monthly Operating Costs (12 videos/month)

| Service | Cost |
|---------|------|
| OpenAI (GPT-4) | $5-15 |
| ElevenLabs | $22 |
| D-ID | $29 |
| DALL-E | $0.50 |
| YouTube API | Free |
| **Total** | **$56.50-66.50** |

### Cost Per Video: $4.71-5.54

### Break-Even Analysis

- **10 affiliate conversions @ $20:** $200 revenue
- **Costs:** $70
- **Profit:** $130/month
- **Break-even:** Month 1 (with marketing)

---

## Contributing

### Code Standards

1. Use async/await (no callbacks)
2. Comprehensive error handling
3. JSDoc comments for functions
4. Console logging for pipeline tracking
5. Store sensitive data in .env only

### Testing Requirements

1. Test with mock APIs first
2. Verify error handling paths
3. Check legal disclaimers present
4. Validate output file quality

---

## Support & Resources

- **Documentation:** `/docs/COCO_SETUP_GUIDE.md`
- **Templates:** `/templates/`
- **Configuration:** `/config/coco-config.json`
- **Issues:** GitHub Issues

---

**Last Updated:** 2026-01-06
**Version:** 1.0.0
**Maintainer:** RideWire AI Hub Team
