# Zapier/Make Automation Workflows

## Overview
This document details all automation workflows for the 1000+ influencer outreach campaign. These automations will save 100+ hours/week and ensure consistent execution.

---

## Workflow 1: Automated Email Outreach

### Trigger: New Row in Google Sheets (Influencer Database)

**When**: New influencer added to master database with Status = "Ready to Contact"

**Actions**:
1. **Gmail: Send Email**
   - To: {{Email}}
   - Subject: Template based on {{Platform}} and {{Tier}}
   - Body: Personalized template with merge tags
   - From: partnerships@ridewire.ai

2. **Google Sheets: Update Row**
   - Status: "Sent"
   - Date_Contacted: {{Current Date}}
   
3. **Airtable: Create Task**
   - Task: "Follow up with {{Name}}"
   - Due Date: {{Date_Contacted + 5 days}}
   - Assigned To: Marketing Team

4. **Slack: Send Notification**
   - Channel: #influencer-outreach
   - Message: "✅ Outreach sent to {{Name}} ({{Platform}}, {{Tier}})"

**Rate Limit**: 50 emails/day (avoid Gmail spam filters)

---

## Workflow 2: Follow-Up Sequence (Day 5)

### Trigger: Google Sheets - Scheduled Search (Daily at 9am)

**Filter**: Status = "Sent" AND Date_Contacted = {{Today - 5 days}} AND Response_Date = blank

**Actions**:
1. **Gmail: Send Follow-Up Email #1**
   - Subject: "Re: {{Original Subject}}"
   - Body: Follow-up template (shorter, casual)
   
2. **Google Sheets: Update Row**
   - Add Note: "Follow-up #1 sent on {{Date}}"

---

## Workflow 3: Follow-Up Sequence (Day 10)

### Trigger: Google Sheets - Scheduled Search (Daily at 9am)

**Filter**: Status = "Sent" AND Date_Contacted = {{Today - 10 days}} AND Response_Date = blank

**Actions**:
1. **Gmail: Send Follow-Up Email #2**
   - Subject: "Last chance: {{Original Subject}}"
   - Body: Final follow-up with deadline
   
2. **Google Sheets: Update Row**
   - Add Note: "Follow-up #2 sent on {{Date}}"

---

## Workflow 4: Mark as Ghosted (Day 14)

### Trigger: Google Sheets - Scheduled Search (Daily at 10am)

**Filter**: Status = "Sent" AND Date_Contacted = {{Today - 14 days}} AND Response_Date = blank

**Actions**:
1. **Google Sheets: Update Row**
   - Status: "Ghosted"
   - Partnership_Status: "Declined"
   - Add Note: "No response after 3 touches. Marked as ghosted."
   
2. **Airtable: Close Task**
   - Mark follow-up task as "Completed - No Response"

---

## Workflow 5: Response Detection & Notification

### Trigger: Gmail - New Reply Received

**Filter**: Email is reply to influencer outreach thread

**Actions**:
1. **Google Sheets: Update Row**
   - Status: "Replied"
   - Response_Date: {{Date of Reply}}
   
2. **Slack: Send Notification**
   - Channel: #influencer-outreach
   - Message: "🎉 {{Name}} replied! Check inbox: {{Email}}"
   - Priority: High
   
3. **Airtable: Create Task**
   - Task: "Respond to {{Name}} - URGENT"
   - Due Date: {{Today + 2 hours}}
   - Assigned To: Marketing Lead

---

## Workflow 6: Commission Tracking & Payout

### Trigger: Stripe - New Payment Received

**Filter**: Payment metadata contains influencer_code

**Actions**:
1. **Google Sheets: Update Row**
   - Revenue_Generated: += {{Payment Amount × Commission Rate}}
   
2. **Zapier: Calculate Commission**
   - Commission = {{Payment Amount}} × {{Commission_Rate_%}} / 100
   
3. **Google Sheets: Log Transaction**
   - Create new row in "Transactions" sheet
   - Influencer: {{Name}}
   - Customer: {{Customer Email}}
   - Revenue: {{Payment Amount}}
   - Commission: {{Calculated Commission}}
   - Date: {{Current Date}}
   
4. **Email: Send Commission Notification**
   - To: {{Influencer Email}}
   - Subject: "You earned ${{Commission}} from RideWire!"
   - Body: "Great news! Your referral just converted. You earned ${{Commission}}. Total this month: ${{Monthly Total}}"

---

## Workflow 7: Weekly Payout (Fridays at 5pm)

### Trigger: Schedule - Every Friday at 5pm EST

**Actions**:
1. **Google Sheets: Calculate Weekly Commissions**
   - Query: Sum all commissions from {{Last Friday}} to {{This Friday}}
   - Filter: Commission_Paid = "No"
   
2. **Stripe Connect: Mass Payout**
   - For each influencer with commission ≥ $50:
   - Transfer: {{Commission Amount}} to their Stripe account
   
3. **Google Sheets: Mark as Paid**
   - Commission_Paid: "Yes"
   - Payout_Date: {{Current Date}}
   
4. **Email: Send Payout Confirmation**
   - To: Each influencer with payout
   - Subject: "Weekly Payout: ${{Amount}} sent to your account"
   - Body: Receipt with breakdown

---

## Workflow 8: Content Posted Detection

### Trigger: YouTube API - New Video Uploaded (by partner channels)

**Filter**: Video description or title contains "RideWire" or affiliate link

**Actions**:
1. **Google Sheets: Update Row**
   - Content_Posted: "Yes"
   - Content_URL: {{Video URL}}
   - Content_Date: {{Publish Date}}
   
2. **YouTube API: Get Video Stats (24 hours later)**
   - Views: {{View Count}}
   - Likes: {{Like Count}}
   - Comments: {{Comment Count}}
   
3. **Google Sheets: Calculate Engagement**
   - Reach: {{Views}}
   - Engagement_Count: {{Likes + Comments}}
   
4. **Slack: Celebrate**
   - Channel: #influencer-wins
   - Message: "🎉 {{Name}} posted content! {{Views}} views so far. [Watch]({{URL}})"

---

## Workflow 9: Viral Content Bonus

### Trigger: Google Sheets - Scheduled Check (Every 6 hours)

**Filter**: Content_Posted = "Yes" AND Reach ≥ 100,000 AND Bonus_Paid = "No"

**Actions**:
1. **Stripe: Send Bonus Payment**
   - Amount: $100 (for 100k+ views) or $500 (for 1M+ views)
   - Recipient: {{Influencer Stripe Account}}
   
2. **Google Sheets: Update Row**
   - Bonus_Paid: "Yes"
   - Bonus_Amount: {{$100 or $500}}
   
3. **Email: Congratulations**
   - To: {{Influencer Email}}
   - Subject: "VIRAL! 🔥 Your RideWire content hit {{Views}} views - Bonus Inside"
   - Body: "Your content went viral! We're sending you a ${{Bonus}} bonus on top of your commission. Thank you for crushing it!"

---

## Workflow 10: Social Media Amplification

### Trigger: Google Sheets - Content_Posted = "Yes" (New Entry)

**Actions**:
1. **Buffer: Schedule Tweet**
   - Content: "🙌 Shoutout to @{{TwitterHandle}} for the amazing RideWire content! Check it out: {{Content_URL}} #AI #MultiAI"
   - Schedule: Next available slot (9am, 2pm, or 7pm)
   
2. **Buffer: Schedule LinkedIn Post**
   - Content: Similar to tweet but professional tone
   
3. **Email: Request Retweet from Team**
   - To: team@ridewire.ai
   - Subject: "New influencer content - please amplify!"
   - Body: "{{Name}} posted content. Please RT/like: {{Content_URL}}"

---

## Workflow 11: Performance Dashboard Update

### Trigger: Schedule - Every Hour

**Actions**:
1. **Google Sheets: Aggregate Metrics**
   - Total Influencers Contacted: COUNT(Status = "Sent" OR "Replied" OR "Ghosted")
   - Response Rate: COUNT(Status = "Replied") / COUNT(Status = "Sent") × 100
   - Active Partnerships: COUNT(Partnership_Status = "Active")
   - Total Revenue: SUM(Revenue_Generated)
   - Total Commissions Paid: SUM(Commission_Paid)
   
2. **Google Data Studio: Refresh Dashboard**
   - Auto-refresh live metrics dashboard
   
3. **Slack: Daily Summary (9am)**
   - Channel: #influencer-metrics
   - Message: Daily snapshot of key metrics

---

## Workflow 12: High-Value Influencer Alert

### Trigger: Google Sheets - Revenue_Generated Updated

**Filter**: Revenue_Generated ≥ $1,000 (lifetime) AND VIP_Status = "No"

**Actions**:
1. **Google Sheets: Update Row**
   - VIP_Status: "Yes"
   - Commission_Rate_%: += 5% (upgrade tier)
   
2. **Email: VIP Upgrade Notification**
   - To: {{Influencer Email}}
   - Subject: "You're now a RideWire VIP Partner! 🌟"
   - Body: "You've generated ${{Revenue_Generated}} in referrals! We're upgrading you to VIP status with {{New Commission Rate}}% commission and priority support."
   
3. **Slack: Notify Leadership**
   - Channel: #leadership
   - Message: "🌟 {{Name}} hit $1k+ in referrals! Upgraded to VIP partner."

---

## Workflow 13: Referral Conversion Tracking

### Trigger: Website - New User Signup

**Filter**: Signup URL contains UTM parameter with influencer_code

**Actions**:
1. **Google Sheets: Create Conversion Log**
   - Influencer: {{Influencer Code}}
   - User Email: {{New User Email}}
   - Signup Date: {{Current Date}}
   - Plan: {{Free/Pro/Enterprise}}
   
2. **Google Sheets: Update Influencer Row**
   - Total_Referrals: += 1
   
3. **Webhook: Notify Influencer (if first referral)**
   - Email: "🎉 Your first RideWire referral just signed up!"

---

## Workflow 14: Monthly Performance Review

### Trigger: Schedule - Last Day of Month at 11pm

**Actions**:
1. **Google Sheets: Generate Monthly Report**
   - Top 10 performers by revenue
   - Response rates by platform/tier
   - Content performance (views, engagement)
   - Revenue generated vs. commissions paid
   
2. **Email: Send Report to Team**
   - To: team@ridewire.ai
   - Subject: "Monthly Influencer Campaign Report - {{Month}}"
   - Attachment: PDF report
   
3. **Email: Send Report to Influencers**
   - To: All active partners
   - Subject: "Your RideWire Performance - {{Month}}"
   - Body: Personalized report with their stats

---

## Workflow 15: Abandoned Cart Recovery (Future)

### Trigger: Website - User starts checkout but doesn't complete

**Filter**: User came from influencer referral link

**Actions**:
1. **Email: Cart Abandonment Reminder**
   - To: {{User Email}}
   - Subject: "Don't forget your RideWire discount!"
   - Body: "You started checking out but didn't finish. Use code {{Influencer Code}} for {{Discount}}% off!"
   
2. **Wait 24 Hours**
   
3. **Email: Final Reminder**
   - Body: "Last chance! Your discount expires in 48 hours."

---

## Setup Instructions

### Prerequisites:
1. **Zapier Premium Account** ($49/month for unlimited workflows)
2. **Google Workspace Account** (for Sheets + Gmail integration)
3. **Stripe Connect Account** (for payouts)
4. **Airtable Account** (for task management)
5. **Buffer Account** (for social media automation)
6. **Slack Workspace** (for team notifications)

### Step 1: Connect All Apps to Zapier
- ✅ Google Sheets
- ✅ Gmail
- ✅ Stripe
- ✅ Airtable
- ✅ Slack
- ✅ Buffer
- ✅ YouTube API (optional)
- ✅ Twitter API (optional)
- ✅ TikTok API (optional)

### Step 2: Import Workflows
1. Create each workflow ("Zap") in Zapier dashboard
2. Test each workflow with sample data
3. Turn on workflows one at a time
4. Monitor for errors in first 48 hours

### Step 3: Set Up Rate Limits
- Gmail: Max 50 emails/day (avoid spam filters)
- Stripe: No more than 100 payouts/day
- Social media: Buffer will handle scheduling limits

### Step 4: Create Error Handling
- If workflow fails → Send Slack notification
- If email bounces → Mark influencer as "Invalid Email"
- If Stripe payout fails → Create manual task in Airtable

---

## Cost Breakdown

### Monthly Automation Costs:
- **Zapier Premium**: $49/month (unlimited workflows)
- **Airtable Pro**: $20/month (for task management)
- **Buffer Business**: $100/month (for social scheduling)
- **Google Workspace**: $12/month (for business Gmail + Sheets)
- **Stripe Connect**: 0.25% per payout (variable cost)

**Total Fixed Cost**: ~$180/month  
**Total Variable Cost**: ~$50-200/month (based on payout volume)

**Time Saved**: ~100 hours/month  
**ROI**: If campaign generates $10k/month, automation costs = 2% overhead

---

## Testing Checklist

Before going live with 1000 influencers:

- [ ] Test Workflow 1 with 10 test emails
- [ ] Verify follow-up sequences trigger correctly
- [ ] Test commission calculation with dummy Stripe payment
- [ ] Confirm payout workflow sends money to test Stripe account
- [ ] Check Slack notifications are working
- [ ] Verify Google Sheets updates correctly
- [ ] Test social media amplification with test content
- [ ] Run end-to-end test: Add influencer → Send email → Track response → Simulate conversion → Payout

---

## Monitoring & Maintenance

### Daily Tasks:
1. Check Zapier dashboard for errors (5 min)
2. Review Slack notifications for responses (10 min)
3. Manually respond to high-priority influencers (30 min)

### Weekly Tasks:
1. Review commission payouts (Fridays, 10 min)
2. Optimize email templates based on response rates (30 min)
3. Check automation costs and adjust if needed (10 min)

### Monthly Tasks:
1. Generate performance report (automated)
2. Review top/bottom performers (1 hour)
3. Optimize workflows based on data (2 hours)

---

## Alternative: Make.com (Integromat)

If Zapier is too expensive, use **Make.com** (formerly Integromat):

### Advantages:
- ✅ Cheaper: $9-29/month for similar features
- ✅ More powerful (visual automation builder)
- ✅ Better error handling

### Disadvantages:
- ❌ Steeper learning curve
- ❌ Fewer pre-built integrations

**Recommendation**: Start with Zapier (easier), switch to Make.com if you need to scale beyond 1000 influencers.

---

## Security & Privacy

⚠️ **IMPORTANT**: 
- Never store API keys in Zapier directly (use environment variables)
- Enable 2FA on all connected accounts
- Regularly audit workflow logs for suspicious activity
- Don't send sensitive data to influencers via automated emails
- Comply with GDPR/CAN-SPAM when sending automated emails

---

**File Location**: `campaigns/influencer-outreach/automation/ZAPIER_WORKFLOWS.md`

**Next Steps**:
1. Set up Zapier account and connect all apps
2. Build Workflow 1 (automated email outreach) first
3. Test with 10 influencers before scaling
4. Add remaining workflows incrementally
5. Monitor performance and optimize
