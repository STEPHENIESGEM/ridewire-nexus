/**
 * Reply Detector Module for COCO Email Automation
 * Monitors inbox for replies and detects intent
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');

class ReplyDetector {
  constructor() {
    // Azure OpenAI Service configuration
    this.azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    this.azureKey = process.env.AZURE_OPENAI_KEY;
    this.deploymentGPT4 = process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || 'gpt-4';
    
    // Initialize Azure OpenAI client
    this.client = new OpenAIClient(
      this.azureEndpoint,
      new AzureKeyCredential(this.azureKey)
    );

    this.detectedReplies = [];
  }

  /**
   * Analyze email reply intent using Azure OpenAI
   * @param {string} emailBody - Email body text
   * @param {Object} contact - Contact information
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeReplyIntent(emailBody, contact) {
    const systemPrompt = `You are an email intent analyzer. Analyze the following email reply and classify it.

Categories:
- "interested" - They want to learn more or are interested in the service
- "meeting_request" - They want to schedule a call/meeting
- "not_interested" - They are not interested
- "needs_info" - They have questions and need more information
- "out_of_office" - Auto-reply, out of office
- "unsubscribe" - They want to stop receiving emails
- "forward" - They forwarded to someone else
- "positive" - Positive response but no clear action
- "neutral" - Neutral response
- "negative" - Negative response

Also extract:
- sentiment (positive/neutral/negative)
- urgency (high/medium/low)
- key_points (array of main points from the email)
- suggested_action (what should we do next)`;

    const userPrompt = `Analyze this reply from ${contact.firstName} at ${contact.companyName}:

${emailBody}

Return a JSON object with: intent, sentiment, urgency, key_points, suggested_action`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const response = await this.client.getChatCompletions(
        this.deploymentGPT4,
        messages,
        {
          temperature: 0.3, // Low temperature for more consistent classification
          maxTokens: 500
        }
      );

      const analysisText = response.choices[0].message.content;
      
      // Parse JSON response
      let analysis;
      try {
        // Try to extract JSON from response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback if no JSON found
          analysis = {
            intent: 'neutral',
            sentiment: 'neutral',
            urgency: 'low',
            key_points: [],
            suggested_action: 'Review and respond manually'
          };
        }
      } catch (parseError) {
        // Fallback parsing
        analysis = {
          intent: this.extractIntent(analysisText),
          sentiment: this.extractSentiment(analysisText),
          urgency: 'medium',
          key_points: [analysisText],
          suggested_action: 'Review and respond'
        };
      }

      return {
        ...analysis,
        contactId: contact.id,
        analyzedAt: new Date().toISOString(),
        rawResponse: analysisText
      };
    } catch (error) {
      console.error('Error analyzing reply intent:', error);
      return {
        intent: 'unknown',
        sentiment: 'neutral',
        urgency: 'medium',
        key_points: [],
        suggested_action: 'Review manually',
        error: error.message
      };
    }
  }

  /**
   * Extract intent from text (fallback method)
   * @param {string} text - Text to analyze
   * @returns {string} Intent
   */
  extractIntent(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('meeting') || lowerText.includes('call') || lowerText.includes('schedule')) {
      return 'meeting_request';
    }
    if (lowerText.includes('interested') || lowerText.includes('tell me more')) {
      return 'interested';
    }
    if (lowerText.includes('not interested') || lowerText.includes('no thank')) {
      return 'not_interested';
    }
    if (lowerText.includes('unsubscribe') || lowerText.includes('remove')) {
      return 'unsubscribe';
    }
    if (lowerText.includes('out of office') || lowerText.includes('auto')) {
      return 'out_of_office';
    }
    
    return 'neutral';
  }

  /**
   * Extract sentiment from text (fallback method)
   * @param {string} text - Text to analyze
   * @returns {string} Sentiment
   */
  extractSentiment(text) {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ['great', 'interested', 'yes', 'perfect', 'excellent', 'thank you'];
    const negativeWords = ['not interested', 'no', 'unsubscribe', 'stop', 'remove'];
    
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative) return 'negative';
    return 'neutral';
  }

  /**
   * Detect if email contains meeting request
   * @param {string} emailBody - Email body
   * @returns {Object} Meeting detection result
   */
  detectMeetingRequest(emailBody) {
    const lowerBody = emailBody.toLowerCase();
    const meetingKeywords = [
      'meeting', 'call', 'schedule', 'calendar', 'available',
      'zoom', 'teams', 'phone', 'chat', 'connect', 'discuss'
    ];
    
    const hasMeetingKeyword = meetingKeywords.some(keyword => 
      lowerBody.includes(keyword)
    );
    
    // Try to extract proposed times
    const timePatterns = [
      /\d{1,2}:\d{2}\s?(am|pm)/gi,
      /\d{1,2}\s?(am|pm)/gi,
      /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi,
      /(tomorrow|today|next week|this week)/gi
    ];
    
    const proposedTimes = [];
    timePatterns.forEach(pattern => {
      const matches = emailBody.match(pattern);
      if (matches) {
        proposedTimes.push(...matches);
      }
    });
    
    return {
      isMeetingRequest: hasMeetingKeyword,
      confidence: hasMeetingKeyword ? 0.8 : 0.2,
      proposedTimes: proposedTimes.length > 0 ? proposedTimes : null,
      detectedAt: new Date().toISOString()
    };
  }

  /**
   * Check if email is out of office auto-reply
   * @param {string} emailBody - Email body
   * @param {Object} headers - Email headers
   * @returns {boolean} True if out of office
   */
  isOutOfOffice(emailBody, headers = {}) {
    const lowerBody = emailBody.toLowerCase();
    const oooKeywords = [
      'out of office',
      'out of the office',
      'away from',
      'automatic reply',
      'auto-reply',
      'will be back',
      'on vacation',
      'currently unavailable'
    ];
    
    const hasOOOKeyword = oooKeywords.some(keyword => 
      lowerBody.includes(keyword)
    );
    
    // Check headers for auto-reply indicators
    const hasAutoReplyHeader = 
      headers['auto-submitted'] === 'auto-replied' ||
      headers['x-autorespond'] ||
      headers['precedence'] === 'auto_reply';
    
    return hasOOOKeyword || hasAutoReplyHeader;
  }

  /**
   * Monitor inbox for new replies (placeholder - integrate with email service)
   * @param {Function} callback - Callback function to execute when reply detected
   */
  async monitorInbox(callback) {
    // This would integrate with an email service provider (SendGrid, Mailgun, etc.)
    // or use IMAP to monitor inbox
    // For now, this is a placeholder that would be called by webhook or polling
    
    console.log('Reply detector monitoring active...');
    console.log('Note: Integrate with email service provider for production use');
    
    // Example integration pattern:
    // 1. Set up webhook with email service
    // 2. When email received, call analyzeReplyIntent
    // 3. Execute callback with analysis results
  }

  /**
   * Record detected reply
   * @param {Object} reply - Reply object
   */
  recordReply(reply) {
    this.detectedReplies.push({
      ...reply,
      recordedAt: new Date().toISOString()
    });
  }

  /**
   * Get all detected replies
   * @param {number} contactId - Optional contact ID filter
   * @returns {Array} Detected replies
   */
  getDetectedReplies(contactId = null) {
    if (contactId) {
      return this.detectedReplies.filter(reply => reply.contactId === contactId);
    }
    return this.detectedReplies;
  }
}

module.exports = ReplyDetector;
