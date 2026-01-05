# Email Automation Guide - RideWire AI Hub

Complete guide for setting up email automation, routing, and management for all 7 stepheniesgem.io email addresses.

---

## 📋 Quick Reference

| Email | Purpose | Auto-Reply | Routing | Priority |
|-------|---------|------------|---------|----------|
| `coco@stepheniesgem.io` | Founder | ❌ No | Stephanie | 🔴 High |
| `hello@stepheniesgem.io` | General | ✅ Yes | Support Team | 🟡 Medium |
| `aihub@stepheniesgem.io` | Technical | ✅ Yes | Dev Team | 🟡 Medium |
| `support@stepheniesgem.io` | Support | ✅ Yes | Support Team | 🔴 High |
| `investors@stepheniesgem.io` | Funding | ✅ Yes | Stephanie + CFO | 🔴 High |
| `press@stepheniesgem.io` | Media | ✅ Yes | PR Team | 🟡 Medium |
| `team@stepheniesgem.io` | Internal | ❌ No | All Staff | 🟢 Low |

---

## 🚀 Setup Instructions

### Step 1: DNS Configuration

Add these MX records to your `stepheniesgem.io` domain:

```
Priority  Host              Points To
10        @                 mail.stepheniesgem.io
20        @                 mail2.stepheniesgem.io (backup)
```

Or if using a third-party email provider (e.g., Google Workspace, Microsoft 365):

#### Google Workspace
```
Priority  Host    Points To
1         @       ASPMX.L.GOOGLE.COM
5         @       ALT1.ASPMX.L.GOOGLE.COM
5         @       ALT2.ASPMX.L.GOOGLE.COM
10        @       ALT3.ASPMX.L.GOOGLE.COM
10        @       ALT4.ASPMX.L.GOOGLE.COM
```

#### Microsoft 365
```
Priority  Host    Points To
0         @       stepheniesgem-io.mail.protection.outlook.com
```

#### Other SPF/DKIM Records
```
TXT  @  v=spf1 include:_spf.google.com ~all
TXT  @  v=DMARC1; p=quarantine; rua=mailto:team@stepheniesgem.io
```

**DNS Propagation Time**: 24-48 hours

---

### Step 2: Create Email Accounts

Create these 7 email accounts in your email provider:

1. `coco@stepheniesgem.io`
2. `hello@stepheniesgem.io`
3. `aihub@stepheniesgem.io`
4. `support@stepheniesgem.io`
5. `investors@stepheniesgem.io`
6. `press@stepheniesgem.io`
7. `team@stepheniesgem.io`

---

### Step 3: Configure Forwarding Rules

#### hello@stepheniesgem.io
**Forward to:**
- `support@stepheniesgem.io` (primary)
- `team@stepheniesgem.io` (CC)

**Filter Rules:**
- If subject contains "support" or "help" → Forward to support@
- If subject contains "partnership" → Forward to coco@
- If subject contains "api" or "integration" → Forward to aihub@

#### support@stepheniesgem.io
**Forward to:**
- Support team members (add specific emails)
- `team@stepheniesgem.io` (CC for tracking)

**Filter Rules:**
- If subject contains "urgent" or "critical" → Flag as high priority
- If subject contains "login" → Tag as "account-access"
- If subject contains "diagnostic" → Tag as "technical-support"

#### aihub@stepheniesgem.io
**Forward to:**
- Development team members
- `team@stepheniesgem.io` (CC)

**Filter Rules:**
- If subject contains "api" → Tag as "api-inquiry"
- If subject contains "integration" → Tag as "integration-request"
- If subject contains "bug" → Forward to GitHub issues

#### investors@stepheniesgem.io
**Forward to:**
- `coco@stepheniesgem.io` (Stephanie - primary)
- CFO email (when hired)

**Filter Rules:**
- All emails → Flag as high priority
- If subject contains "term sheet" → Flag as urgent
- If from known investor domain → Auto-tag "warm-lead"

#### press@stepheniesgem.io
**Forward to:**
- PR team (when hired) or `coco@stepheniesgem.io`
- `team@stepheniesgem.io` (CC)

**Filter Rules:**
- If from media domain (.com/.net news sites) → Tag "media-verified"
- If subject contains "interview" → Flag for quick response

#### team@stepheniesgem.io
**Forward to:**
- All team members (distribution list)

**No filtering** - used for internal broadcasts

#### coco@stepheniesgem.io
**No forwarding** - Stephanie's personal inbox

---

### Step 4: Auto-Reply Setup

#### hello@stepheniesgem.io Auto-Reply
```
Subject: Thank you for contacting RideWire AI Hub

Hello!

Thank you for reaching out to RideWire AI Hub. We've received your message and our team will respond within 24 hours.

In the meantime:
• Visit our platform: https://ridewire.tech
• Check our FAQ: https://ridewire.tech/faq

For urgent support: support@stepheniesgem.io

Best regards,
The RideWire AI Hub Team
```

**When to send:**
- Always send on first contact
- Don't send if reply to existing thread
- Don't send if email is from team@ domain

#### support@stepheniesgem.io Auto-Reply
```
Subject: RideWire Support - We're Here to Help!

Hi there,

Your support request has been received (Ticket #{{AUTO_INCREMENT}}).

Expected response time:
• Critical Issues: 2-4 hours
• General Questions: 12-24 hours
• Feature Requests: 24-48 hours

Need immediate help? https://ridewire.tech/help

RideWire Support Team
```

**When to send:**
- Always send on new tickets
- Generate unique ticket number
- Track ticket in support system

#### aihub@stepheniesgem.io Auto-Reply
```
Subject: RideWire AI Hub - Technical Inquiry Received

Hello,

Thank you for your technical inquiry. Our development team will respond within 24-48 hours.

Technical Resources:
• API Docs: https://ridewire.tech/api-docs
• GitHub: https://github.com/STEPHENIESGEM/ridewire-ai-hub

Best regards,
RideWire AI Hub Development Team
```

#### investors@stepheniesgem.io Auto-Reply
```
Subject: RideWire AI Hub - Investment Inquiry

Dear {{NAME}},

Thank you for your interest in RideWire AI Hub. Your inquiry will be reviewed by our founding team within 48 hours.

About RideWire AI Hub:
• Multi-AI diagnostic platform
• LLC in good standing (New Mexico, USA)
• Production-ready architecture

Best regards,
Stephanie
Founder, RideWire AI Hub
```

**Special handling:**
- Use name from email if available
- Flag all emails for Stephanie's attention
- Track in investment pipeline

#### press@stepheniesgem.io Auto-Reply
```
Subject: RideWire AI Hub - Media Inquiry Received

Dear Media Professional,

Thank you for your interest. We'll respond to media requests within 24 hours.

Press Kit: [LINK]

Best regards,
RideWire AI Hub Communications Team
```

---

### Step 5: Email Ticketing System

#### Option A: Simple (Gmail/Outlook Labels)

**Labels to create:**
- `support-open`
- `support-in-progress`
- `support-resolved`
- `investors-warm`
- `investors-cold`
- `press-pending`
- `technical-api`
- `technical-bug`

**Automation:**
- Auto-apply labels based on keywords
- Move to archive when resolved
- Flag urgent emails

#### Option B: Help Desk Software (Recommended for Scale)

**Options:**
- **Freshdesk** (Free up to 10 agents)
- **Zendesk** ($19/agent/month)
- **Help Scout** ($20/agent/month)
- **Intercom** ($39/month)

**Features to enable:**
- Ticket numbering
- Auto-routing by topic
- Response templates
- Analytics/reporting
- SLA tracking

---

### Step 6: Integration with RideWire Platform

#### Email Notification Settings

Add to `.env`:
```bash
# Email Configuration
SMTP_HOST=smtp.stepheniesgem.io
SMTP_PORT=587
SMTP_USER=noreply@stepheniesgem.io
SMTP_PASS=<your_secure_password>
SMTP_FROM_NAME=RideWire AI Hub

# Email Addresses
EMAIL_SUPPORT=support@stepheniesgem.io
EMAIL_HELLO=hello@stepheniesgem.io
EMAIL_AIHUB=aihub@stepheniesgem.io
EMAIL_TEAM=team@stepheniesgem.io
```

#### Send Notifications From Platform

**New user registration:**
```javascript
// Send welcome email
await sendEmail({
  to: user.email,
  from: 'hello@stepheniesgem.io',
  subject: 'Welcome to RideWire AI Hub!',
  template: 'welcome',
  data: { name: user.name }
});

// Notify team
await sendEmail({
  to: 'team@stepheniesgem.io',
  from: 'noreply@stepheniesgem.io',
  subject: 'New User Registration',
  template: 'new-user-notification',
  data: { email: user.email, timestamp: Date.now() }
});
```

**Support ticket from platform:**
```javascript
// User submits support request in app
await sendEmail({
  to: 'support@stepheniesgem.io',
  from: user.email,
  subject: `Support Request: ${issue.title}`,
  template: 'support-ticket',
  data: { 
    userName: user.name,
    issue: issue.description,
    priority: issue.priority
  }
});
```

---

### Step 7: Monitoring & Analytics

#### Key Metrics to Track

1. **Response Time**
   - Target: < 24 hours for general inquiries
   - Target: < 4 hours for critical support
   - Target: < 48 hours for investor inquiries

2. **Email Volume**
   - Track incoming emails per day/week
   - Identify trends (spike in support requests?)
   - Plan staffing accordingly

3. **Resolution Rate**
   - % of support tickets resolved
   - Average time to resolution
   - Customer satisfaction score

4. **Bounce Rate**
   - Monitor failed deliveries
   - Check spam folder placement
   - Verify DNS/SPF configuration

#### Tools for Monitoring

**Free options:**
- Gmail analytics (if using Google Workspace)
- Outlook insights (if using Microsoft 365)
- Manual tracking in spreadsheet

**Paid options:**
- MixMax (email tracking, templates)
- Mailchimp (if sending newsletters)
- SendGrid (transactional email analytics)

---

### Step 8: Email Security

#### Anti-Spam Configuration

**SPF Record:**
```
v=spf1 include:_spf.google.com ~all
```

**DKIM Setup:**
Generate DKIM key from your email provider and add TXT record.

**DMARC Policy:**
```
v=DMARC1; p=quarantine; rua=mailto:team@stepheniesgem.io
```

#### Phishing Protection

**For team:**
- Enable 2FA on all email accounts
- Use strong, unique passwords
- Be wary of impersonation attempts
- Verify sender on sensitive requests

**For customers:**
- Always send from @stepheniesgem.io domain
- Never ask for passwords via email
- Include verification links for account actions

---

### Step 9: Backup & Disaster Recovery

#### Email Backup Strategy

**Daily backups:**
- Export emails to local storage
- Store in encrypted format
- Keep 30 days of history

**Tools:**
- Google Vault (for Google Workspace)
- Microsoft 365 Archive
- Third-party: Backupify, Spanning

#### Account Recovery Plan

**Document:**
- Account passwords (in password manager)
- Recovery email addresses
- 2FA backup codes
- DNS configuration
- Email forwarding rules

**Store securely:**
- Encrypted password manager (1Password, LastPass)
- Secure team wiki
- Physical backup in safe

---

### Step 10: Scaling & Team Growth

#### When to hire support team:
- > 50 support emails per week
- Average response time > 48 hours
- Customer satisfaction < 80%

#### Support team roles:
- **Support Lead**: Manages team, escalations
- **Support Agents**: Handle tier 1 support
- **Technical Support**: Handle API/integration questions

#### Email distribution (at scale):
- `support@` → Round-robin to support agents
- `aihub@` → Dedicated technical support
- `investors@` → Stephanie + VP of Business Development
- `press@` → Dedicated PR manager

---

## 🎯 Implementation Checklist

- [ ] **DNS Setup**
  - [ ] Add MX records to stepheniesgem.io
  - [ ] Add SPF record
  - [ ] Add DKIM record
  - [ ] Add DMARC policy
  - [ ] Verify DNS propagation (24-48 hours)

- [ ] **Email Accounts**
  - [ ] Create coco@stepheniesgem.io
  - [ ] Create hello@stepheniesgem.io
  - [ ] Create aihub@stepheniesgem.io
  - [ ] Create support@stepheniesgem.io
  - [ ] Create investors@stepheniesgem.io
  - [ ] Create press@stepheniesgem.io
  - [ ] Create team@stepheniesgem.io

- [ ] **Forwarding Rules**
  - [ ] Configure hello@ forwarding
  - [ ] Configure support@ forwarding
  - [ ] Configure aihub@ forwarding
  - [ ] Configure investors@ forwarding
  - [ ] Configure press@ forwarding
  - [ ] Set up team@ distribution list

- [ ] **Auto-Replies**
  - [ ] Set up hello@ auto-reply
  - [ ] Set up support@ auto-reply with ticket numbers
  - [ ] Set up aihub@ auto-reply
  - [ ] Set up investors@ auto-reply
  - [ ] Set up press@ auto-reply

- [ ] **Integration**
  - [ ] Add SMTP settings to .env
  - [ ] Test email sending from platform
  - [ ] Configure notification triggers
  - [ ] Set up welcome emails

- [ ] **Monitoring**
  - [ ] Set up email analytics
  - [ ] Create response time dashboards
  - [ ] Configure alerts for urgent emails
  - [ ] Track key metrics weekly

- [ ] **Security**
  - [ ] Enable 2FA on all accounts
  - [ ] Set strong passwords
  - [ ] Configure SPF/DKIM/DMARC
  - [ ] Set up email backups

- [ ] **Documentation**
  - [ ] Train team on email processes
  - [ ] Document escalation procedures
  - [ ] Create response templates
  - [ ] Set up knowledge base

- [ ] **GitHub Integration**
  - [ ] Update GitHub notification email to team@
  - [ ] Configure issue notifications
  - [ ] Set up PR review notifications

---

## 🚨 Common Issues & Troubleshooting

### Email not sending
- Check SMTP credentials
- Verify port (587 for TLS, 465 for SSL)
- Check firewall/security settings
- Verify DNS records propagated

### Email going to spam
- Verify SPF/DKIM/DMARC
- Check email content (avoid spam triggers)
- Warm up new domain gradually
- Request whitelist from recipients

### Auto-reply not working
- Check vacation responder settings
- Verify filter rules aren't blocking
- Test with external email address
- Check for reply-to-reply loops

### Forwarding not working
- Verify forwarding address is correct
- Check for circular forwarding
- Ensure recipient inbox isn't full
- Test with simple email first

---

## 📞 Support Contacts

**Email Provider Support:**
- Google Workspace: https://support.google.com/a
- Microsoft 365: https://support.microsoft.com
- Other: Contact your provider

**DNS Provider Support:**
- Contact your domain registrar
- Typical propagation: 24-48 hours

**RideWire Team:**
- Technical: aihub@stepheniesgem.io
- General: team@stepheniesgem.io

---

*Last Updated: January 5, 2026*
*Version: 1.0.0*
