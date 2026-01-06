/**
 * COCO Script Generator - GPT-4 Integration
 * 
 * Generates video scripts with COCO's personality using GPT-4
 */

const axios = require('axios');
require('dotenv').config();

/**
 * Generate video script using GPT-4
 * @param {string} topic - Video topic
 * @param {Object} config - COCO configuration
 * @returns {Promise<Object>} Generated script with metadata
 */
async function generateScript(topic, config) {
  console.log(`   Generating script for: "${topic}"`);
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  const systemPrompt = config.ai_tools.openai.system_prompt;
  const catchphrases = config.persona.personality.catchphrases.join(', ');
  
  const userPrompt = `
Create a video script for a ${config.content_strategy.video_specs.target_length_minutes[0]}-${config.content_strategy.video_specs.target_length_minutes[1]} minute YouTube video on the topic: "${topic}"

Requirements:
1. Start with one of these catchphrases: ${catchphrases}
2. Structure: Intro (hook) → Problem explanation → RideWire multi-AI diagnosis → Solution → Call-to-action
3. Include specific technical details and diagnostic codes where relevant
4. Demonstrate multi-AI consensus (mention ChatGPT, Claude, Gemini collaboration)
5. Be educational but entertaining, slightly sarcastic tone
6. End with call-to-action: subscribe and visit RideWire with discount code COCO20
7. Include timestamps for chapter markers
8. Add legal disclaimer: "Educational purposes only, consult licensed mechanic"

Format the output as JSON:
{
  "title": "video title",
  "script": "full script text with [TIMESTAMP: 00:00] markers",
  "description": "YouTube description with links and hashtags",
  "tags": ["tag1", "tag2"],
  "chapters": [{"time": "0:00", "title": "Intro"}],
  "estimatedDuration": 7,
  "wordCount": 1050
}
  `.trim();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: config.ai_tools.openai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: config.ai_tools.openai.temperature,
        max_tokens: config.ai_tools.openai.max_tokens
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Try to parse as JSON
    let scriptData;
    try {
      scriptData = JSON.parse(content);
    } catch (parseError) {
      // If not valid JSON, create structured response
      console.warn('   ⚠️  GPT-4 response was not valid JSON, structuring manually');
      scriptData = {
        title: topic,
        script: content,
        description: generateDefaultDescription(topic, config),
        tags: generateDefaultTags(topic, config),
        chapters: [],
        estimatedDuration: Math.ceil(content.split(' ').length / 150), // ~150 words per minute
        wordCount: content.split(' ').length
      };
    }

    // Add legal disclaimer to description
    scriptData.description = addLegalDisclaimer(scriptData.description, config);

    console.log(`   ✓ Script generated: ${scriptData.wordCount} words, ~${scriptData.estimatedDuration} min`);
    
    return {
      ...scriptData,
      text: scriptData.script,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    if (error.response) {
      console.error('   ❌ OpenAI API Error:', error.response.data);
      throw new Error(`OpenAI API error: ${error.response.data.error?.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response from OpenAI API - check network connection');
    } else {
      throw new Error(`Script generation failed: ${error.message}`);
    }
  }
}

/**
 * Generate default YouTube description
 */
function generateDefaultDescription(topic, config) {
  const affiliateLink = buildAffiliateLink(config);
  
  return `
${topic}

Hey wrenchers! 🔧 Today we're diving into ${topic.toLowerCase()} using RideWire's multi-AI consensus technology. We'll show you how ChatGPT, Claude, and Gemini work together to diagnose this issue.

🤖 Try RideWire AI Hub: ${affiliateLink}
💰 Use code COCO20 for 20% off!

📚 Chapters:
0:00 - Intro
0:30 - Problem Overview
2:00 - Multi-AI Diagnosis
4:00 - Solution Steps
6:00 - Wrap Up

🔗 Links:
• RideWire Platform: ${affiliateLink}
• Subscribe: https://youtube.com/@coco-ai-mechanic

#RideWire #AIdiagnostics #MotorcycleRepair #HarleyDavidson

${config.legal.disclaimer}

${config.legal.professional_services_disclaimer}
  `.trim();
}

/**
 * Generate default tags
 */
function generateDefaultTags(topic, config) {
  const baseTags = config.youtube.upload_defaults.tags;
  const topicTags = topic.toLowerCase().split(' ').slice(0, 3);
  return [...baseTags, ...topicTags];
}

/**
 * Build affiliate link with UTM parameters
 */
function buildAffiliateLink(config) {
  const affiliate = config.revenue_tracking.affiliate_links.ridewire_platform;
  return `${affiliate.base_url}?utm_source=${affiliate.utm_source}&utm_medium=${affiliate.utm_medium}&utm_campaign=${affiliate.utm_campaign}&discount=${affiliate.discount_code}`;
}

/**
 * Add legal disclaimers to description
 */
function addLegalDisclaimer(description, config) {
  const disclaimers = `

⚠️ LEGAL DISCLAIMER:
${config.legal.disclaimer}

${config.legal.professional_services_disclaimer}
`;
  
  return description + disclaimers;
}

module.exports = {
  generateScript,
  generateDefaultDescription,
  buildAffiliateLink
};
