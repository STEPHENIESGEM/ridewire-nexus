/**
 * Scheduler Module for COCO Email Automation
 * Handles follow-up timing and automatic scheduling
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

class EmailScheduler {
  constructor() {
    this.scheduledTasks = [];
    this.followUpIntervals = {
      first: 3, // days
      second: 7 // days from first
    };
  }

  /**
   * Schedule follow-up for a contact
   * @param {Object} contact - Contact object
   * @param {number} followUpNumber - 1 for first follow-up, 2 for second
   * @returns {Date} Scheduled date
   */
  scheduleFollowUp(contact, followUpNumber = 1) {
    const now = new Date();
    const daysToAdd = followUpNumber === 1 
      ? this.followUpIntervals.first 
      : this.followUpIntervals.second;
    
    const scheduledDate = new Date(now);
    scheduledDate.setDate(now.getDate() + daysToAdd);
    
    // Don't schedule on weekends
    const dayOfWeek = scheduledDate.getDay();
    if (dayOfWeek === 0) { // Sunday
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    } else if (dayOfWeek === 6) { // Saturday
      scheduledDate.setDate(scheduledDate.getDate() + 2);
    }
    
    // Schedule during business hours (9 AM - 5 PM)
    scheduledDate.setHours(9 + Math.floor(Math.random() * 8)); // Random hour between 9 AM - 5 PM
    scheduledDate.setMinutes(Math.floor(Math.random() * 60)); // Random minute
    
    return scheduledDate;
  }

  /**
   * Batch schedule emails to avoid sending all at once
   * @param {Array} emails - Array of email objects
   * @param {number} batchSize - Number of emails per batch
   * @param {number} delayMinutes - Delay between batches in minutes
   * @returns {Array} Scheduled emails with send times
   */
  batchScheduleEmails(emails, batchSize = 10, delayMinutes = 30) {
    const scheduledEmails = [];
    const now = new Date();
    
    for (let i = 0; i < emails.length; i++) {
      const batchNumber = Math.floor(i / batchSize);
      const sendTime = new Date(now);
      sendTime.setMinutes(now.getMinutes() + (batchNumber * delayMinutes));
      
      // Add random variance (0-15 minutes) to make it more natural
      const randomVariance = Math.floor(Math.random() * 15);
      sendTime.setMinutes(sendTime.getMinutes() + randomVariance);
      
      scheduledEmails.push({
        ...emails[i],
        scheduledFor: sendTime.toISOString(),
        batchNumber
      });
    }
    
    return scheduledEmails;
  }

  /**
   * Calculate optimal send time based on contact's timezone and industry
   * @param {Object} contact - Contact object
   * @returns {Date} Optimal send time
   */
  calculateOptimalSendTime(contact) {
    const now = new Date();
    const sendTime = new Date(now);
    
    // Default: Send within next 24 hours during business hours
    sendTime.setDate(now.getDate() + 1);
    
    // Set to morning hours (9-11 AM) for better open rates
    sendTime.setHours(9 + Math.floor(Math.random() * 2));
    sendTime.setMinutes(Math.floor(Math.random() * 60));
    sendTime.setSeconds(0);
    
    // Adjust for timezone if available
    if (contact.timezone) {
      // Timezone adjustment logic would go here
      // For now, we'll use UTC
    }
    
    return sendTime;
  }

  /**
   * Check if it's a good time to send an email
   * @param {Date} time - Time to check
   * @returns {boolean} True if good time to send
   */
  isGoodSendTime(time) {
    const hour = time.getHours();
    const dayOfWeek = time.getDay();
    
    // Don't send on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
    
    // Only send during business hours (9 AM - 6 PM)
    if (hour < 9 || hour >= 18) {
      return false;
    }
    
    return true;
  }

  /**
   * Get emails that should be sent now
   * @param {Array} emailQueue - Queue of scheduled emails
   * @returns {Array} Emails ready to send
   */
  getEmailsToSendNow(emailQueue) {
    const now = new Date();
    
    return emailQueue.filter(email => {
      const scheduledTime = new Date(email.scheduledFor);
      return scheduledTime <= now && this.isGoodSendTime(now);
    });
  }

  /**
   * Reschedule email to next business day/time
   * @param {Object} email - Email object
   * @returns {Object} Rescheduled email
   */
  rescheduleToNextBusinessTime(email) {
    const now = new Date();
    let nextSendTime = new Date(now);
    
    // If currently outside business hours, schedule for next business day at 9 AM
    if (!this.isGoodSendTime(now)) {
      nextSendTime.setDate(now.getDate() + 1);
      nextSendTime.setHours(9);
      nextSendTime.setMinutes(0);
      nextSendTime.setSeconds(0);
      
      // Skip weekends
      while (nextSendTime.getDay() === 0 || nextSendTime.getDay() === 6) {
        nextSendTime.setDate(nextSendTime.getDate() + 1);
      }
    }
    
    return {
      ...email,
      scheduledFor: nextSendTime.toISOString(),
      rescheduled: true,
      originalSchedule: email.scheduledFor
    };
  }

  /**
   * Stop follow-up sequence for a contact
   * @param {number} contactId - Contact ID
   * @param {string} reason - Reason for stopping (e.g., 'replied', 'unsubscribed')
   */
  stopFollowUpSequence(contactId, reason) {
    this.scheduledTasks = this.scheduledTasks.filter(
      task => task.contactId !== contactId
    );
    
    return {
      contactId,
      sequenceStopped: true,
      reason,
      stoppedAt: new Date().toISOString()
    };
  }

  /**
   * Get scheduled tasks for a contact
   * @param {number} contactId - Contact ID
   * @returns {Array} Scheduled tasks
   */
  getScheduledTasks(contactId = null) {
    if (contactId) {
      return this.scheduledTasks.filter(task => task.contactId === contactId);
    }
    return this.scheduledTasks;
  }

  /**
   * Add task to schedule
   * @param {Object} task - Task object
   */
  addTask(task) {
    this.scheduledTasks.push({
      ...task,
      createdAt: new Date().toISOString()
    });
  }
}

module.exports = EmailScheduler;
