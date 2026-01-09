/**
 * COCO Email Agent - Main Orchestrator
 * Automated email outreach and management system
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const emailTemplates = require('./email-templates');
const targetList = require('./target-list.json');
const fs = require('fs').promises;
const path = require('path');

class CocoEmailAgent {
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
    
    this.contacts = targetList.contacts;
    this.emailQueue = [];
    this.pendingApprovals = [];
  }

  /**
   * Generate personalized email using Azure OpenAI
   * @param {Object} contact - Contact information
   * @param {string} templateName - Template to use
   * @returns {Promise<Object>} Generated email
   */
  async generatePersonalizedEmail(contact, templateName = 'initialOutreach') {
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // For standard templates, use template functions
    if (template.body && typeof template.body === 'function') {
      const subject = template.subject(contact);
      const body = template.body(contact);
      
      return {
        to: contact.email,
        subject,
        body,
        contactId: contact.id,
        templateUsed: templateName,
        generatedAt: new Date().toISOString(),
        status: 'pending_approval'
      };
    }
    
    // For custom replies, use Azure OpenAI
    return await this.generateAIReply(contact);
  }

  /**
   * Generate AI-powered reply using Azure OpenAI
   * @param {Object} contact - Contact information
   * @param {string} incomingMessage - Optional incoming message to reply to
   * @returns {Promise<Object>} Generated reply
   */
  async generateAIReply(contact, incomingMessage = null) {
    const conversationContext = contact.conversationHistory
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n\n');

    const systemPrompt = `You are COCO, an AI email assistant for Stephenie N. Lacy, Founder of RIDEWIRE LLC.
You help draft professional, personalized emails for business development.

Company: RIDEWIRE LLC
Service: Multi-AI validated intelligence reports using Azure OpenAI
USP: Flip-flop adversarial system - reports are attacked and validated before delivery
Price: $9,999 for 30-40 page technical analysis
Focus: Climate tech (DAC, cultivated meat, renewable energy)
Contact: hello@stepheniesgem.io

Write concise, friendly, professional emails. Keep it brief. No fluff.`;

    let userPrompt;
    if (incomingMessage) {
      userPrompt = `Generate a reply to this email from ${contact.firstName} at ${contact.companyName}:

Incoming message:
${incomingMessage}

Previous conversation:
${conversationContext}

Draft a professional reply that:
1. Addresses their specific question/request
2. Maintains friendly but professional tone
3. Moves the conversation forward
4. Keeps it under 150 words`;
    } else {
      userPrompt = `Generate a personalized outreach email to ${contact.firstName} at ${contact.companyName}.

Context:
- Company: ${contact.companyName}
- Personalization: ${contact.personalizationDetail}
- Topic: ${contact.relevantTopic}

Draft an initial outreach email that introduces our service naturally.`;
    }

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

    const generatedBody = response.choices[0].message.content;

    // Extract subject line if present, otherwise generate one
    let subject = `Re: ${contact.relevantTopic}`;
    if (generatedBody.includes('Subject:')) {
      const subjectMatch = generatedBody.match(/Subject: (.+)/);
      if (subjectMatch) {
        subject = subjectMatch[1];
      }
    }

    return {
      to: contact.email,
      subject,
      body: generatedBody.replace(/Subject: .+\n\n?/, ''), // Remove subject line from body
      contactId: contact.id,
      templateUsed: 'customReply',
      generatedAt: new Date().toISOString(),
      status: 'pending_approval',
      aiGenerated: true
    };
  }

  /**
   * Queue email for sending (with scheduling)
   * @param {Object} email - Email object
   * @param {Date} scheduledFor - Optional scheduled send time
   */
  queueEmail(email, scheduledFor = null) {
    const queuedEmail = {
      ...email,
      queuedAt: new Date().toISOString(),
      scheduledFor: scheduledFor || new Date().toISOString(),
      status: 'queued'
    };
    
    this.emailQueue.push(queuedEmail);
    return queuedEmail;
  }

  /**
   * Add email to approval queue for Stephenie's review
   * @param {Object} email - Email object
   */
  addToApprovalQueue(email) {
    this.pendingApprovals.push({
      ...email,
      addedToQueueAt: new Date().toISOString()
    });
    return this.pendingApprovals.length - 1; // Return queue position
  }

  /**
   * Approve email for sending
   * @param {number} approvalId - ID in approval queue
   * @param {Object} edits - Optional edits to apply
   * @returns {Object} Approved email
   */
  approveEmail(approvalId, edits = {}) {
    const email = this.pendingApprovals[approvalId];
    
    if (!email) {
      throw new Error('Email not found in approval queue');
    }
    
    // Apply any edits
    const finalEmail = {
      ...email,
      ...edits,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: 'Stephenie N. Lacy'
    };
    
    // Remove from approval queue
    this.pendingApprovals.splice(approvalId, 1);
    
    // Queue for sending
    return this.queueEmail(finalEmail);
  }

  /**
   * Reject email
   * @param {number} approvalId - ID in approval queue
   * @param {string} reason - Rejection reason
   */
  rejectEmail(approvalId, reason = '') {
    const email = this.pendingApprovals[approvalId];
    
    if (!email) {
      throw new Error('Email not found in approval queue');
    }
    
    email.status = 'rejected';
    email.rejectionReason = reason;
    email.rejectedAt = new Date().toISOString();
    
    // Remove from approval queue
    this.pendingApprovals.splice(approvalId, 1);
    
    return email;
  }

  /**
   * Get all pending approvals
   * @returns {Array} Pending emails
   */
  getPendingApprovals() {
    return this.pendingApprovals;
  }

  /**
   * Get email queue
   * @returns {Array} Queued emails
   */
  getEmailQueue() {
    return this.emailQueue;
  }

  /**
   * Process follow-ups for contacts
   * Checks if follow-ups are needed and generates them
   */
  async processFollowUps() {
    const now = new Date();
    const followUpsNeeded = [];

    for (const contact of this.contacts) {
      if (!contact.nextFollowUp || contact.status === 'replied' || contact.status === 'closed') {
        continue;
      }

      const followUpDate = new Date(contact.nextFollowUp);
      
      if (now >= followUpDate) {
        // Determine which follow-up template to use
        const daysSinceLastContact = Math.floor(
          (now - new Date(contact.lastContact)) / (1000 * 60 * 60 * 24)
        );
        
        let templateName;
        if (daysSinceLastContact >= 7) {
          templateName = 'followUp7Days';
        } else if (daysSinceLastContact >= 3) {
          templateName = 'followUp3Days';
        } else {
          continue; // Too soon for follow-up
        }

        // Generate follow-up email
        const followUpEmail = await this.generatePersonalizedEmail(contact, templateName);
        followUpsNeeded.push(followUpEmail);
        
        // Add to approval queue
        this.addToApprovalQueue(followUpEmail);
      }
    }

    return followUpsNeeded;
  }

  /**
   * Update contact status
   * @param {number} contactId - Contact ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data to update
   */
  async updateContact(contactId, status, additionalData = {}) {
    const contact = this.contacts.find(c => c.id === contactId);
    
    if (!contact) {
      throw new Error('Contact not found');
    }

    contact.status = status;
    contact.lastContact = new Date().toISOString();
    
    // Set next follow-up if needed
    if (status === 'contacted' && !additionalData.replied) {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 3); // Follow up in 3 days
      contact.nextFollowUp = followUpDate.toISOString();
    }

    // Merge additional data
    Object.assign(contact, additionalData);

    // Save updated contacts
    await this.saveContacts();
    
    return contact;
  }

  /**
   * Save contacts to file
   */
  async saveContacts() {
    const data = {
      contacts: this.contacts,
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalContacts: this.contacts.length,
        company: 'RIDEWIRE LLC',
        owner: 'Stephenie N. Lacy'
      }
    };

    const filePath = path.join(__dirname, 'target-list.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Add message to conversation history
   * @param {number} contactId - Contact ID
   * @param {string} sender - 'user' or 'contact'
   * @param {string} content - Message content
   */
  async addToConversationHistory(contactId, sender, content) {
    const contact = this.contacts.find(c => c.id === contactId);
    
    if (!contact) {
      throw new Error('Contact not found');
    }

    if (!contact.conversationHistory) {
      contact.conversationHistory = [];
    }

    contact.conversationHistory.push({
      sender,
      content,
      timestamp: new Date().toISOString()
    });

    await this.saveContacts();
  }
}

module.exports = CocoEmailAgent;
