/**
 * Draft Generator Module for COCO Email Automation
 * Creates AI-powered email drafts for Stephenie's approval
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const emailTemplates = require('./email-templates');

class DraftGenerator {
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

    this.drafts = [];
  }

  /**
   * Generate draft reply based on incoming message and conversation context
   * @param {Object} incomingMessage - Incoming email details
   * @param {Object} contact - Contact information
   * @param {string} replyIntent - Detected intent from ReplyDetector
   * @returns {Promise<Object>} Generated draft
   */
  async generateDraftReply(incomingMessage, contact, replyIntent) {
    const conversationContext = this.buildConversationContext(contact);
    
    // Select appropriate template or generate custom reply
    let draft;
    
    switch (replyIntent.intent) {
      case 'meeting_request':
        draft = await this.generateMeetingReplyDraft(incomingMessage, contact);
        break;
      case 'interested':
      case 'needs_info':
        draft = await this.generateInfoReplyDraft(incomingMessage, contact, replyIntent);
        break;
      case 'not_interested':
        draft = await this.generateGracefulCloseDraft(incomingMessage, contact);
        break;
      case 'out_of_office':
        // No draft needed for out of office
        return {
          draftType: 'no_action_needed',
          reason: 'Out of office auto-reply',
          contactId: contact.id
        };
      default:
        draft = await this.generateCustomDraft(incomingMessage, contact, conversationContext);
    }
    
    // Add draft to collection
    const draftWithMetadata = {
      ...draft,
      contactId: contact.id,
      incomingMessageId: incomingMessage.id,
      replyIntent: replyIntent.intent,
      generatedAt: new Date().toISOString(),
      status: 'pending_review'
    };
    
    this.drafts.push(draftWithMetadata);
    
    return draftWithMetadata;
  }

  /**
   * Generate meeting reply draft
   * @param {Object} incomingMessage - Incoming email
   * @param {Object} contact - Contact info
   * @returns {Promise<Object>} Draft reply
   */
  async generateMeetingReplyDraft(incomingMessage, contact) {
    // Use template with AI-suggested times
    const suggestedTimes = this.generateMeetingTimes();
    
    const template = emailTemplates.meetingRequest;
    const draft = {
      to: contact.email,
      subject: template.subject({ firstName: contact.firstName }),
      body: template.body({
        firstName: contact.firstName,
        suggestedTimes: suggestedTimes.map((time, idx) => 
          `${idx + 1}. ${time.toLocaleString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
          })}`
        ).join('\n')
      }),
      draftType: 'meeting_reply',
      suggestedTimes
    };
    
    return draft;
  }

  /**
   * Generate information reply draft
   * @param {Object} incomingMessage - Incoming email
   * @param {Object} contact - Contact info
   * @param {Object} replyIntent - Reply intent analysis
   * @returns {Promise<Object>} Draft reply
   */
  async generateInfoReplyDraft(incomingMessage, contact, replyIntent) {
    // Check if they want preview deck
    const wantsPreview = incomingMessage.body.toLowerCase().includes('preview') ||
                        incomingMessage.body.toLowerCase().includes('example') ||
                        incomingMessage.body.toLowerCase().includes('show');
    
    if (wantsPreview) {
      const template = emailTemplates.previewDeck;
      return {
        to: contact.email,
        subject: template.subject({ 
          firstName: contact.firstName,
          topic: contact.relevantTopic 
        }),
        body: template.body({
          firstName: contact.firstName,
          topic: contact.relevantTopic
        }),
        draftType: 'preview_deck',
        attachments: ['preview-deck.pdf'] // Would be actual file in production
      };
    }
    
    // Otherwise, use "tell me more" template
    const template = emailTemplates.replyTellMeMore;
    return {
      to: contact.email,
      subject: template.subject({ firstName: contact.firstName }),
      body: template.body({
        firstName: contact.firstName,
        calendarLink: 'https://calendly.com/stepheniesgem' // Would be actual calendar link
      }),
      draftType: 'tell_me_more'
    };
  }

  /**
   * Generate graceful close draft for not interested replies
   * @param {Object} incomingMessage - Incoming email
   * @param {Object} contact - Contact info
   * @returns {Promise<Object>} Draft reply
   */
  async generateGracefulCloseDraft(incomingMessage, contact) {
    const systemPrompt = `You are drafting a brief, graceful closing email for someone who is not interested.
Keep it professional, friendly, and leave the door open for future contact.
Maximum 50 words.`;

    const userPrompt = `Draft a brief closing reply to ${contact.firstName} who indicated they're not interested.
Thank them for their time and leave the door open.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.client.getChatCompletions(
      this.deploymentGPT4,
      messages,
      {
        temperature: 0.7,
        maxTokens: 200
      }
    );

    const body = response.choices[0].message.content;

    return {
      to: contact.email,
      subject: 'Re: Multi-AI validated climate tech intelligence',
      body,
      draftType: 'graceful_close'
    };
  }

  /**
   * Generate custom draft using Azure OpenAI
   * @param {Object} incomingMessage - Incoming email
   * @param {Object} contact - Contact info
   * @param {string} conversationContext - Previous conversation
   * @returns {Promise<Object>} Draft reply
   */
  async generateCustomDraft(incomingMessage, contact, conversationContext) {
    const systemPrompt = `You are COCO, an AI email assistant for Stephenie N. Lacy, Founder of RIDEWIRE LLC.

Company: RIDEWIRE LLC
Service: Multi-AI validated intelligence reports using Azure OpenAI
Process: Flip-flop adversarial system - reports attacked and validated before delivery
Price: $9,999 for 30-40 page technical analysis
Focus: Climate tech (DAC, cultivated meat, renewable energy)
Contact: hello@stepheniesgem.io
Calendar: https://calendly.com/stepheniesgem

Write concise, friendly, professional email replies.
- Keep under 150 words
- Address their specific points
- Move conversation forward
- Sign as "Stephenie" or "Stephenie N. Lacy"`;

    const userPrompt = `Draft a reply to this email from ${contact.firstName} at ${contact.companyName}:

Their message:
${incomingMessage.body}

Previous conversation:
${conversationContext}

Draft a professional reply that addresses their message and moves the conversation forward.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.client.getChatCompletions(
      this.deploymentGPT4,
      messages,
      {
        temperature: 0.7,
        maxTokens: 500
      }
    );

    const body = response.choices[0].message.content;

    // Extract subject if included, otherwise create one
    let subject = `Re: ${contact.relevantTopic}`;
    if (body.includes('Subject:')) {
      const subjectMatch = body.match(/Subject: (.+)/);
      if (subjectMatch) {
        subject = subjectMatch[1];
      }
    }

    return {
      to: contact.email,
      subject,
      body: body.replace(/Subject: .+\n\n?/, ''),
      draftType: 'custom'
    };
  }

  /**
   * Build conversation context from contact history
   * @param {Object} contact - Contact information
   * @returns {string} Formatted conversation context
   */
  buildConversationContext(contact) {
    if (!contact.conversationHistory || contact.conversationHistory.length === 0) {
      return 'No previous conversation';
    }

    return contact.conversationHistory
      .slice(-5) // Last 5 messages
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n\n');
  }

  /**
   * Generate meeting time suggestions (3 options)
   * @returns {Array<Date>} Array of suggested meeting times
   */
  generateMeetingTimes() {
    const times = [];
    const now = new Date();
    
    // Suggest times over the next week during business hours
    for (let i = 0; i < 3; i++) {
      const suggestedTime = new Date(now);
      suggestedTime.setDate(now.getDate() + (i * 2) + 2); // 2, 4, 6 days out
      
      // Skip weekends
      while (suggestedTime.getDay() === 0 || suggestedTime.getDay() === 6) {
        suggestedTime.setDate(suggestedTime.getDate() + 1);
      }
      
      // Set to business hours (10 AM, 2 PM, or 4 PM)
      const hours = [10, 14, 16];
      suggestedTime.setHours(hours[i % 3]);
      suggestedTime.setMinutes(0);
      suggestedTime.setSeconds(0);
      
      times.push(suggestedTime);
    }
    
    return times;
  }

  /**
   * Get all drafts pending review
   * @returns {Array} Pending drafts
   */
  getPendingDrafts() {
    return this.drafts.filter(draft => draft.status === 'pending_review');
  }

  /**
   * Get draft by ID
   * @param {number} draftId - Draft ID
   * @returns {Object} Draft
   */
  getDraft(draftId) {
    return this.drafts[draftId];
  }

  /**
   * Update draft status
   * @param {number} draftId - Draft ID
   * @param {string} status - New status
   * @param {Object} edits - Optional edits
   */
  updateDraftStatus(draftId, status, edits = {}) {
    const draft = this.drafts[draftId];
    
    if (!draft) {
      throw new Error('Draft not found');
    }

    draft.status = status;
    draft.updatedAt = new Date().toISOString();
    
    if (Object.keys(edits).length > 0) {
      Object.assign(draft, edits);
      draft.edited = true;
    }
    
    return draft;
  }
}

module.exports = DraftGenerator;
