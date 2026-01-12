# Influencer Database Schema & Usage Guide

## Overview
This database template is designed to track 1000+ influencers across YouTube, TikTok, and X (Twitter) for the RideWire AI Hub outreach campaign.

## Database Structure

### Column Definitions

| Column | Type | Description | Examples |
|--------|------|-------------|----------|
| **Platform** | Text | Social media platform | YouTube, TikTok, Twitter |
| **Tier** | Text | Influencer tier based on followers | Tier 1, Tier 2, Tier 3 |
| **Name** | Text | Influencer full name or channel name | "Tech Insider", "AI Explained" |
| **Handle_URL** | Text | Profile URL or handle | @username, https://youtube.com/@channel |
| **Followers** | Number | Total follower/subscriber count | 500000, 1500000 |
| **Engagement_Rate_%** | Number | Average engagement rate percentage | 8.5, 12.3, 15.7 |
| **Email** | Text | Contact email address | creator@example.com |
| **Category** | Text | Content category/niche | AI Explainers, Tech Reviewers, Automotive |
| **Status** | Text | Current outreach status | Not Contacted, Sent, Replied, Declined, Ghosted |
| **Date_Contacted** | Date | Date of initial outreach | 2024-01-15, 2024-02-03 |
| **Response_Date** | Date | Date of first response | 2024-01-20, 2024-02-08 |
| **Partnership_Status** | Text | Partnership stage | Prospect, Negotiating, Agreed, Active, Declined |
| **Content_Posted** | Text | Whether they posted content | Yes, No, Scheduled |
| **Reach** | Number | Total impressions from their content | 50000, 250000, 1000000 |
| **Engagement_Count** | Number | Total engagements (likes+comments+shares) | 5000, 25000, 100000 |
| **Commission_Rate_%** | Number | Their commission percentage | 10, 15, 20, 30 |
| **Revenue_Generated** | Number | Total revenue from their referrals | 0, 500, 2500, 10000 |
| **Notes** | Text | Additional notes and observations | "Very responsive", "Follow up in 2 weeks" |

## Tier Definitions

### YouTube Tiers
- **Tier 1**: 500k-5M subscribers (AI explainers, major tech channels)
  - Commission Rate: 20-30%
  - Target: 50 influencers
  
- **Tier 2**: 100k-500k subscribers (tech reviewers, niche channels)
  - Commission Rate: 10-15%
  - Target: 150 influencers
  
- **Tier 3**: 10k-100k subscribers (emerging creators, growing channels)
  - Commission Rate: 5-10%
  - Target: 200 influencers

### TikTok Tiers
- **Tier 1**: 1M+ followers (viral AI content, trending creators)
  - Commission Rate: 20-30%
  - Target: 40 influencers
  
- **Tier 2**: 100k-1M followers (tech content, consistent posting)
  - Commission Rate: 10-15%
  - Target: 130 influencers
  
- **Tier 3**: 10k-100k followers (rising stars, high engagement)
  - Commission Rate: 5-10%
  - Target: 180 influencers

### Twitter/X Tiers
- **Tier 1**: 100k+ followers (AI thought leaders, researchers)
  - Commission Rate: 20-30%
  - Target: 80 influencers
  
- **Tier 2**: 10k-100k followers (tech commentators, analysts)
  - Commission Rate: 10-15%
  - Target: 120 influencers
  
- **Tier 3**: 1k-10k followers (community builders, engaged audiences)
  - Commission Rate: 5-10%
  - Target: 50 influencers

## Status Workflow

1. **Not Contacted** → Initial state, research complete
2. **Sent** → Outreach email/DM sent
3. **Replied** → Influencer responded (positive or neutral)
4. **Declined** → Influencer declined partnership
5. **Ghosted** → No response after 3 follow-ups (14 days)

## Partnership Status Workflow

1. **Prospect** → In database, not yet contacted
2. **Negotiating** → In active discussion about terms
3. **Agreed** → Partnership terms accepted, contract signed
4. **Active** → Actively creating content and driving traffic
5. **Declined** → Declined partnership opportunity

## Data Entry Best Practices

### Research Phase
1. Find influencer through platform search or tools
2. Extract follower count and engagement metrics
3. Calculate engagement rate: (Likes + Comments + Shares) / Followers × 100
4. Find contact email (bio, channel description, or business inquiry link)
5. Categorize by content type (AI, tech, automotive, etc.)
6. Assign appropriate tier based on follower count

### Outreach Phase
1. Update Status to "Sent" when outreach is delivered
2. Log Date_Contacted with current date
3. Set reminder for follow-up (Day 5, Day 10)
4. Update Status to "Replied" when they respond
5. Log Response_Date when first response received

### Partnership Phase
1. Update Partnership_Status based on negotiation stage
2. Document agreed commission rate in Commission_Rate_% column
3. Track when they post content (Content_Posted = "Yes")
4. Update Reach and Engagement_Count after 48 hours of post going live
5. Calculate Revenue_Generated from referral tracking

## Google Sheets Formulas

### Response Rate Calculation
```
=COUNTIF(Status:Status,"Replied")/COUNTIF(Status:Status,"Sent")*100
```

### Revenue by Tier
```
=SUMIF(Tier:Tier,"Tier 1",Revenue_Generated:Revenue_Generated)
```

### Average Engagement Rate by Platform
```
=AVERAGEIF(Platform:Platform,"YouTube",Engagement_Rate_%:Engagement_Rate_%)
```

### Conversion Rate (Prospect to Active)
```
=COUNTIF(Partnership_Status:Partnership_Status,"Active")/COUNTA(Name:Name)*100
```

## Filtering & Sorting Tips

### High-Priority Targets
- Filter: Tier = "Tier 1" AND Status = "Not Contacted"
- Sort: Engagement_Rate_% (descending)

### Follow-Up Queue
- Filter: Status = "Sent" AND Date_Contacted < TODAY()-5
- Sort: Date_Contacted (ascending)

### Top Performers
- Filter: Partnership_Status = "Active"
- Sort: Revenue_Generated (descending)

### Ghosted Prospects
- Filter: Status = "Sent" AND Date_Contacted < TODAY()-14 AND Response_Date = blank
- Action: Mark as "Ghosted" and move on

## Data Sources & Research Tools

### YouTube Research
- **TubeBuddy**: Channel analytics, competitor research
- **VidIQ**: Engagement metrics, trending topics
- **YouTube Search**: Keywords like "AI tools", "ChatGPT tutorial", "machine learning"
- **SocialBlade**: Growth tracking, subscriber count verification

### TikTok Research
- **TikTok Creator Marketplace**: Official creator discovery platform
- **HypeAuditor**: Audience quality, engagement rate
- **Hashtag Search**: #AItools, #ChatGPT, #MachineLearning, #TechTok
- **TikTok Analytics**: In-app metrics for public accounts

### Twitter/X Research
- **Twitter Advanced Search**: Find AI researchers, tech journalists
- **Followerwonk**: Audience analytics, influence scoring
- **Social Bearing**: Engagement tracking, follower growth
- **Lists**: Curated Twitter lists of AI/tech influencers

## Automation Integration Points

### Zapier Triggers
- **New Row Added** → Send automated outreach email
- **Status = "Replied"** → Create task in project management tool
- **Revenue_Generated > $100** → Send bonus notification email

### Stripe/Refersion Integration
- Automatically populate Revenue_Generated from payment platform
- Update Commission_Rate_% based on performance tiers
- Track referral conversions in real-time

## Export & Reporting

### Weekly Report Format
1. Response Rate by Platform
2. Top 10 Performers by Revenue
3. Conversion Funnel (Prospect → Active)
4. New Partnerships This Week
5. Follow-Up Queue (overdue)

### Monthly Dashboard Metrics
- Total Influencers Contacted: 1000+
- Response Rate: 20%+ goal
- Active Partnerships: 50+ goal
- Total Reach: 100M+ impressions
- Revenue Generated: $10k-30k/month

## Security & Privacy

⚠️ **IMPORTANT**: This database contains sensitive contact information.

- Store in password-protected Google Sheets
- Limit access to marketing team only
- Never share publicly or commit to GitHub
- Regularly backup to secure cloud storage
- Delete ghosted/declined contacts after 90 days (GDPR compliance)

## File Location
- **CSV Template**: `campaigns/influencer-outreach/database/MASTER_INFLUENCER_DATABASE_TEMPLATE.csv`
- **Google Sheets**: Create from template and store in Google Drive
- **Backup**: Weekly exports to secure folder

---

**Next Steps**:
1. Import this CSV template into Google Sheets
2. Set up conditional formatting for Status columns
3. Create pivot tables for platform/tier analysis
4. Begin research phase (Week 1) to populate 1000+ entries
5. Integrate with outreach automation (Week 2)
