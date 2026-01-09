/**
 * Email Templates for COCO Email Automation System
 * Built on Azure OpenAI Service and Microsoft infrastructure
 * 
 * Company: RIDEWIRE LLC
 * Founder: Stephenie N. Lacy
 * Contact: hello@stepheniesgem.io
 */

const emailTemplates = {
  /**
   * Template 1: Initial Outreach (Climate Tech Startups)
   */
  initialOutreach: {
    name: 'Initial Outreach - Climate Tech',
    subject: (data) => `Multi-AI validated climate tech intelligence - ${data.personalizedHook}`,
    body: (data) => `Hi ${data.firstName},

I saw ${data.companyName} is ${data.personalizationDetail}. 

I built something that might help: Multi-AI validated intelligence reports using Azure OpenAI. Our flip-flop adversarial system means reports are attacked and validated before you see them - reducing investment risk.

30-40 page technical analysis on ${data.relevantTopic}. $9,999. Preview available on request.

Would you be open to a brief call this week?

Best,
Stephenie N. Lacy
Founder, RIDEWIRE LLC
hello@stepheniesgem.io`,
    variables: ['firstName', 'companyName', 'personalizationDetail', 'relevantTopic', 'personalizedHook']
  },

  /**
   * Template 2: Follow-up (No Reply After 3 Days)
   */
  followUp3Days: {
    name: 'Follow-up - 3 Days',
    subject: (data) => `Re: Multi-AI validated climate tech intelligence`,
    body: (data) => `Hi ${data.firstName},

Following up on my note from ${data.daysAgo} days ago. 

I know inboxes are busy. If intelligence on ${data.topic} isn't a priority right now, no problem - but if it is, happy to send a preview deck.

Quick question: Is this the right time, or should I follow up in a few months?

Best,
Stephenie`,
    variables: ['firstName', 'daysAgo', 'topic']
  },

  /**
   * Template 3: Follow-up (No Reply After 7 Days)
   */
  followUp7Days: {
    name: 'Follow-up - 7 Days',
    subject: (data) => `Re: Multi-AI validated climate tech intelligence`,
    body: (data) => `Hi ${data.firstName},

Last note from me - just wanted to check if ${data.topic} intelligence is something ${data.companyName} needs right now.

If timing isn't right, I understand completely. If you'd like to stay in touch for future reports, let me know.

Best,
Stephenie N. Lacy
hello@stepheniesgem.io`,
    variables: ['firstName', 'topic', 'companyName']
  },

  /**
   * Template 4: Reply to "Tell Me More"
   */
  replyTellMeMore: {
    name: 'Reply - Tell Me More',
    subject: (data) => `Re: Multi-AI validated climate tech intelligence`,
    body: (data) => `Hi ${data.firstName},

Great to hear from you!

Quick overview:
- We use Azure OpenAI to run adversarial validation on all intelligence reports
- "Flip-flop" method: AI agents attack conclusions before you see them
- Result: 95%+ confidence scores, validated findings
- Current focus: Climate tech (DAC, cultivated meat, renewable energy)

I can send a 5-page preview deck showing methodology and sample findings. Would that be helpful?

Also happy to jump on a 15-minute call if you prefer - here's my calendar: ${data.calendarLink}

Best,
Stephenie`,
    variables: ['firstName', 'calendarLink']
  },

  /**
   * Template 5: Meeting Request Response
   */
  meetingRequest: {
    name: 'Meeting Request Response',
    subject: (data) => `Re: Let's schedule a call`,
    body: (data) => `Hi ${data.firstName},

Perfect! I'd love to connect.

Here are a few times that work for me:
${data.suggestedTimes}

Does any of these work for you? If not, feel free to suggest alternatives.

I'll send a calendar invite once we confirm.

Looking forward to it!

Best,
Stephenie N. Lacy
Founder, RIDEWIRE LLC
hello@stepheniesgem.io`,
    variables: ['firstName', 'suggestedTimes']
  },

  /**
   * Template 6: Preview Deck Delivery
   */
  previewDeck: {
    name: 'Preview Deck Delivery',
    subject: (data) => `Preview: ${data.topic} Intelligence Report`,
    body: (data) => `Hi ${data.firstName},

As promised, here's a 5-page preview deck showing our methodology and sample findings for ${data.topic}.

[Attachment: Preview Deck]

Key highlights:
- Adversarial validation process
- 95%+ confidence scoring
- Technical depth with actionable insights

The full report is 30-40 pages with detailed technical analysis. If you'd like to proceed, we can discuss next steps.

Happy to answer any questions!

Best,
Stephenie`,
    variables: ['firstName', 'topic']
  },

  /**
   * Template 7: Custom Reply (Azure OpenAI Generated)
   */
  customReply: {
    name: 'Custom AI-Generated Reply',
    subject: (data) => data.subject || 'Re: Your message',
    body: (data) => data.generatedBody,
    variables: ['subject', 'generatedBody']
  }
};

module.exports = emailTemplates;
