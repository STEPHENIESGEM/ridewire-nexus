/**
 * CRM Tracker Module for COCO Email Automation
 * Tracks all email interactions and conversation status
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

const fs = require('fs').promises;
const path = require('path');

class CRMTracker {
  constructor() {
    this.interactions = [];
    this.pipeline = {
      new: [],
      contacted: [],
      replied: [],
      meeting_scheduled: [],
      proposal_sent: [],
      closed_won: [],
      closed_lost: []
    };
    this.stats = {
      emailsSent: 0,
      repliesReceived: 0,
      meetingsScheduled: 0,
      dealsInPipeline: 0,
      totalRevenue: 0
    };
  }

  /**
   * Track email sent
   * @param {Object} email - Email object
   * @param {Object} contact - Contact object
   */
  trackEmailSent(email, contact) {
    const interaction = {
      id: this.interactions.length + 1,
      type: 'email_sent',
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      company: contact.companyName,
      email: email,
      timestamp: new Date().toISOString(),
      templateUsed: email.templateUsed
    };

    this.interactions.push(interaction);
    this.stats.emailsSent++;

    // Update pipeline stage
    if (!this.pipeline.contacted.find(c => c.id === contact.id)) {
      this.moveToStage(contact, 'contacted');
    }

    return interaction;
  }

  /**
   * Track reply received
   * @param {Object} reply - Reply object
   * @param {Object} contact - Contact object
   * @param {Object} analysis - Reply analysis
   */
  trackReplyReceived(reply, contact, analysis) {
    const interaction = {
      id: this.interactions.length + 1,
      type: 'reply_received',
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      company: contact.companyName,
      reply: reply,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      timestamp: new Date().toISOString()
    };

    this.interactions.push(interaction);
    this.stats.repliesReceived++;

    // Update pipeline stage based on intent
    if (analysis.intent === 'meeting_request' || analysis.intent === 'interested') {
      this.moveToStage(contact, 'replied');
    } else if (analysis.intent === 'not_interested') {
      this.moveToStage(contact, 'closed_lost');
    }

    return interaction;
  }

  /**
   * Track meeting scheduled
   * @param {Object} meeting - Meeting details
   * @param {Object} contact - Contact object
   */
  trackMeetingScheduled(meeting, contact) {
    const interaction = {
      id: this.interactions.length + 1,
      type: 'meeting_scheduled',
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      company: contact.companyName,
      meeting: meeting,
      timestamp: new Date().toISOString()
    };

    this.interactions.push(interaction);
    this.stats.meetingsScheduled++;
    this.moveToStage(contact, 'meeting_scheduled');

    return interaction;
  }

  /**
   * Track proposal sent
   * @param {Object} proposal - Proposal details
   * @param {Object} contact - Contact object
   */
  trackProposalSent(proposal, contact) {
    const interaction = {
      id: this.interactions.length + 1,
      type: 'proposal_sent',
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      company: contact.companyName,
      proposal: proposal,
      value: 9999, // Standard price
      timestamp: new Date().toISOString()
    };

    this.interactions.push(interaction);
    this.moveToStage(contact, 'proposal_sent');
    this.stats.dealsInPipeline++;

    return interaction;
  }

  /**
   * Track deal closed (won or lost)
   * @param {Object} contact - Contact object
   * @param {string} outcome - 'won' or 'lost'
   * @param {number} value - Deal value (if won)
   */
  trackDealClosed(contact, outcome, value = 0) {
    const interaction = {
      id: this.interactions.length + 1,
      type: 'deal_closed',
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      company: contact.companyName,
      outcome: outcome,
      value: value,
      timestamp: new Date().toISOString()
    };

    this.interactions.push(interaction);

    if (outcome === 'won') {
      this.moveToStage(contact, 'closed_won');
      this.stats.totalRevenue += value;
      this.stats.dealsInPipeline--;
    } else {
      this.moveToStage(contact, 'closed_lost');
      this.stats.dealsInPipeline--;
    }

    return interaction;
  }

  /**
   * Move contact to different pipeline stage
   * @param {Object} contact - Contact object
   * @param {string} newStage - New stage name
   */
  moveToStage(contact, newStage) {
    // Remove from all stages
    Object.keys(this.pipeline).forEach(stage => {
      this.pipeline[stage] = this.pipeline[stage].filter(c => c.id !== contact.id);
    });

    // Add to new stage
    if (this.pipeline[newStage]) {
      this.pipeline[newStage].push({
        id: contact.id,
        name: `${contact.firstName} ${contact.lastName}`,
        company: contact.companyName,
        email: contact.email,
        movedToStageAt: new Date().toISOString()
      });
    }

    contact.pipelineStage = newStage;
  }

  /**
   * Get dashboard statistics
   * @returns {Object} Dashboard stats
   */
  getDashboardStats() {
    const recentInteractions = this.interactions.slice(-10).reverse();
    
    // Calculate response rate
    const responseRate = this.stats.emailsSent > 0 
      ? ((this.stats.repliesReceived / this.stats.emailsSent) * 100).toFixed(1)
      : 0;

    // Calculate meeting conversion rate
    const meetingRate = this.stats.repliesReceived > 0
      ? ((this.stats.meetingsScheduled / this.stats.repliesReceived) * 100).toFixed(1)
      : 0;

    return {
      emailsSent: this.stats.emailsSent,
      repliesReceived: this.stats.repliesReceived,
      meetingsScheduled: this.stats.meetingsScheduled,
      dealsInPipeline: this.stats.dealsInPipeline,
      totalRevenue: this.stats.totalRevenue,
      responseRate: `${responseRate}%`,
      meetingRate: `${meetingRate}%`,
      pipelineSummary: {
        new: this.pipeline.new.length,
        contacted: this.pipeline.contacted.length,
        replied: this.pipeline.replied.length,
        meeting_scheduled: this.pipeline.meeting_scheduled.length,
        proposal_sent: this.pipeline.proposal_sent.length,
        closed_won: this.pipeline.closed_won.length,
        closed_lost: this.pipeline.closed_lost.length
      },
      recentInteractions
    };
  }

  /**
   * Get interactions for a specific contact
   * @param {number} contactId - Contact ID
   * @returns {Array} Contact interactions
   */
  getContactInteractions(contactId) {
    return this.interactions.filter(i => i.contactId === contactId);
  }

  /**
   * Get pipeline stage details
   * @param {string} stage - Stage name
   * @returns {Array} Contacts in stage
   */
  getPipelineStage(stage) {
    return this.pipeline[stage] || [];
  }

  /**
   * Get contacts needing action
   * @returns {Array} Contacts that need attention
   */
  getContactsNeedingAction() {
    const needingAction = [];

    // Contacts with pending approvals (tracked separately)
    // Contacts that replied but no follow-up sent
    const repliedContacts = this.pipeline.replied;
    
    repliedContacts.forEach(contact => {
      const lastInteraction = this.interactions
        .filter(i => i.contactId === contact.id)
        .slice(-1)[0];
      
      if (lastInteraction && lastInteraction.type === 'reply_received') {
        const hoursSinceReply = (Date.now() - new Date(lastInteraction.timestamp)) / (1000 * 60 * 60);
        
        if (hoursSinceReply > 24) {
          needingAction.push({
            ...contact,
            reason: 'Reply received over 24 hours ago, no follow-up sent',
            urgency: 'high',
            hoursSinceReply: Math.floor(hoursSinceReply)
          });
        }
      }
    });

    return needingAction;
  }

  /**
   * Generate weekly report
   * @returns {Object} Weekly report data
   */
  generateWeeklyReport() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyInteractions = this.interactions.filter(i => 
      new Date(i.timestamp) >= oneWeekAgo
    );

    const emailsSentThisWeek = weeklyInteractions.filter(i => i.type === 'email_sent').length;
    const repliesThisWeek = weeklyInteractions.filter(i => i.type === 'reply_received').length;
    const meetingsThisWeek = weeklyInteractions.filter(i => i.type === 'meeting_scheduled').length;

    return {
      period: 'Last 7 days',
      emailsSent: emailsSentThisWeek,
      repliesReceived: repliesThisWeek,
      meetingsScheduled: meetingsThisWeek,
      interactions: weeklyInteractions,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Alert Stephenie when action needed
   * @returns {Array} Alerts
   */
  getAlerts() {
    const alerts = [];

    // High-value contacts that need follow-up
    const needingAction = this.getContactsNeedingAction();
    if (needingAction.length > 0) {
      alerts.push({
        type: 'action_needed',
        priority: 'high',
        message: `${needingAction.length} contact(s) need follow-up`,
        contacts: needingAction
      });
    }

    // Meetings scheduled soon (next 24 hours)
    const upcomingMeetings = this.interactions
      .filter(i => i.type === 'meeting_scheduled')
      .filter(i => {
        const meetingTime = new Date(i.meeting.scheduledTime);
        const hoursUntilMeeting = (meetingTime - Date.now()) / (1000 * 60 * 60);
        return hoursUntilMeeting > 0 && hoursUntilMeeting < 24;
      });

    if (upcomingMeetings.length > 0) {
      alerts.push({
        type: 'upcoming_meetings',
        priority: 'medium',
        message: `${upcomingMeetings.length} meeting(s) scheduled in next 24 hours`,
        meetings: upcomingMeetings
      });
    }

    return alerts;
  }

  /**
   * Save tracking data to file
   */
  async saveData() {
    const data = {
      interactions: this.interactions,
      pipeline: this.pipeline,
      stats: this.stats,
      lastSaved: new Date().toISOString()
    };

    const filePath = path.join(__dirname, 'crm-data.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Load tracking data from file
   */
  async loadData() {
    try {
      const filePath = path.join(__dirname, 'crm-data.json');
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);

      this.interactions = parsed.interactions || [];
      this.pipeline = parsed.pipeline || this.pipeline;
      this.stats = parsed.stats || this.stats;
    } catch (error) {
      // File doesn't exist yet, start fresh
      console.log('No existing CRM data found, starting fresh');
    }
  }
}

module.exports = CRMTracker;
