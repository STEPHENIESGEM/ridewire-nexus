# Metrics Tracking & KPI Dashboard Guide

## Overview
This guide provides a comprehensive framework for tracking all metrics related to the 1000+ influencer outreach campaign. Use this to build your dashboards, generate reports, and make data-driven decisions.

---

## Key Performance Indicators (KPIs)

### 1. Outreach KPIs

#### Total Influencers Contacted
**Definition**: Number of influencers who have been sent outreach (Status = "Sent")

**Formula**: 
```
COUNT(Status WHERE Status IN ('Sent', 'Replied', 'Ghosted'))
```

**Targets**:
- Week 1: 0 (research only)
- Week 2: 200
- Week 3: 400
- Week 4: 600
- Week 5: 850
- Week 6: 1000+

---

#### Response Rate
**Definition**: Percentage of contacted influencers who responded

**Formula**:
```
(COUNT(Status = 'Replied') / COUNT(Status IN ('Sent', 'Replied', 'Ghosted'))) × 100
```

**Targets**:
- Tier 1: 15-25%
- Tier 2: 20-30%
- Tier 3: 25-35%
- Overall: 20%+

**Google Sheets Formula**:
```
=COUNTIF(Status:Status,"Replied")/COUNTIF(Status:Status,"Sent")*100
```

---

#### Response Rate by Platform
**Formula**:
```
For each platform:
(COUNT(Platform = 'X' AND Status = 'Replied') / COUNT(Platform = 'X' AND Status = 'Sent')) × 100
```

**Google Sheets Formulas**:
```
// YouTube
=COUNTIFS(Platform:Platform,"YouTube",Status:Status,"Replied")/COUNTIFS(Platform:Platform,"YouTube",Status:Status,"Sent")*100

// TikTok
=COUNTIFS(Platform:Platform,"TikTok",Status:Status,"Replied")/COUNTIFS(Platform:Platform,"TikTok",Status:Status,"Sent")*100

// Twitter
=COUNTIFS(Platform:Platform,"Twitter",Status:Status,"Replied")/COUNTIFS(Platform:Platform,"Twitter",Status:Status,"Sent")*100
```

---

#### Average Response Time
**Definition**: Average days between Date_Contacted and Response_Date

**Formula**:
```
AVERAGE(Response_Date - Date_Contacted) WHERE Response_Date IS NOT NULL
```

**Target**: < 3 days (faster = higher interest)

---

### 2. Partnership KPIs

#### Partnership Conversion Rate
**Definition**: Percentage of responses that convert to active partnerships

**Formula**:
```
(COUNT(Partnership_Status = 'Active') / COUNT(Status = 'Replied')) × 100
```

**Targets**:
- Tier 1: 20-40%
- Tier 2: 25-35%
- Tier 3: 30-40%
- Overall: 25%+

**Google Sheets Formula**:
```
=COUNTIF(Partnership_Status:Partnership_Status,"Active")/COUNTIF(Status:Status,"Replied")*100
```

---

#### Active Partnerships
**Definition**: Number of influencers with Partnership_Status = "Active"

**Formula**:
```
COUNT(Partnership_Status = 'Active')
```

**Targets**:
- Month 1: 15-25
- Month 2: 30-50
- Month 3: 50-100+

---

#### Content Posted Rate
**Definition**: Percentage of active partners who have posted content

**Formula**:
```
(COUNT(Content_Posted = 'Yes') / COUNT(Partnership_Status = 'Active')) × 100
```

**Target**: 80%+ (if lower, partners need more support)

**Google Sheets Formula**:
```
=COUNTIF(Content_Posted:Content_Posted,"Yes")/COUNTIF(Partnership_Status:Partnership_Status,"Active")*100
```

---

### 3. Content Performance KPIs

#### Total Reach (Impressions)
**Definition**: Sum of all Reach values from influencer content

**Formula**:
```
SUM(Reach WHERE Content_Posted = 'Yes')
```

**Target**: 100M+ impressions by end of campaign

**Google Sheets Formula**:
```
=SUMIF(Content_Posted:Content_Posted,"Yes",Reach:Reach)
```

---

#### Total Engagement
**Definition**: Sum of all Engagement_Count from influencer content

**Formula**:
```
SUM(Engagement_Count WHERE Content_Posted = 'Yes')
```

**Target**: 5M+ engagements (5% of reach)

---

#### Average Engagement Rate
**Definition**: Average engagement rate across all content

**Formula**:
```
AVERAGE((Engagement_Count / Reach) × 100) WHERE Content_Posted = 'Yes'
```

**Targets**:
- YouTube: 8-12%
- TikTok: 12-18%
- Twitter: 2-5%

**Google Sheets Formula**:
```
=AVERAGE((Engagement_Count:Engagement_Count/Reach:Reach)*100)
```

---

#### Viral Content Count
**Definition**: Number of pieces with Reach ≥ 100,000

**Formula**:
```
COUNT(Reach ≥ 100000 AND Content_Posted = 'Yes')
```

**Target**: 5-10 viral pieces per month

**Google Sheets Formula**:
```
=COUNTIFS(Content_Posted:Content_Posted,"Yes",Reach:Reach,">=100000")
```

---

### 4. Financial KPIs

#### Total Revenue from Influencers
**Definition**: Sum of all revenue generated from influencer referrals

**Formula**:
```
SUM(Revenue_Generated)
```

**Targets**:
- Month 1: $1k-5k
- Month 2: $5k-15k
- Month 3: $10k-30k

**Google Sheets Formula**:
```
=SUM(Revenue_Generated:Revenue_Generated)
```

---

#### Total Commissions Paid
**Definition**: Sum of all commissions paid to influencers

**Formula**:
```
SUM(Revenue_Generated × Commission_Rate_% / 100)
```

**Google Sheets Formula**:
```
=SUMPRODUCT(Revenue_Generated:Revenue_Generated,Commission_Rate_%:Commission_Rate_%)/100
```

---

#### Average Revenue Per Partner
**Definition**: Average revenue generated per active partnership

**Formula**:
```
SUM(Revenue_Generated) / COUNT(Partnership_Status = 'Active')
```

**Target**: $200-500 per partner per month

**Google Sheets Formula**:
```
=SUM(Revenue_Generated:Revenue_Generated)/COUNTIF(Partnership_Status:Partnership_Status,"Active")
```

---

#### ROI (Return on Investment)
**Definition**: Net profit from influencer channel / total costs

**Formula**:
```
((Total Revenue - Total Commissions - Total Costs) / Total Costs) × 100
```

**Calculation**:
```
Revenue: $10,000
Commissions: $2,000 (20% avg)
Tools/Automation: $250
Total Costs: $2,250
Net Profit: $7,750
ROI: ($7,750 / $2,250) × 100 = 344%
```

**Target**: 300%+ ROI

---

### 5. Operational KPIs

#### Ghosted Rate
**Definition**: Percentage of outreach that gets no response after 14 days

**Formula**:
```
(COUNT(Status = 'Ghosted') / COUNT(Status IN ('Sent', 'Replied', 'Ghosted'))) × 100
```

**Target**: < 60% (if higher, improve templates)

---

#### Follow-Up Effectiveness
**Definition**: Response rate after Day 5 or Day 10 follow-ups

**Formula**:
```
(COUNT(Replied after Day 5 follow-up) / COUNT(Day 5 follow-ups sent)) × 100
```

**Target**: 10-20% additional responses from follow-ups

---

#### Payout Accuracy Rate
**Definition**: Percentage of payouts processed without errors

**Formula**:
```
(COUNT(Successful payouts) / COUNT(Total payouts attempted)) × 100
```

**Target**: 99%+ (errors should be rare)

---

## Dashboard Setup

### Google Sheets Dashboard Template

**Sheet 1: Master Database**
- All influencer data (imported from CSV template)

**Sheet 2: Summary Metrics**
```
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total Contacted | =COUNTIF(Database!Status:Status,"Sent") | 1000 | ✅/❌ |
| Response Rate | =[Formula from above] | 20% | ✅/❌ |
| Active Partnerships | =COUNTIF(Database!Partnership_Status:Partnership_Status,"Active") | 50 | ✅/❌ |
| Total Revenue | =SUM(Database!Revenue_Generated:Revenue_Generated) | $10,000 | ✅/❌ |
```

**Sheet 3: Platform Breakdown**
```
| Platform | Contacted | Replied | Response Rate | Partnerships | Revenue |
|----------|-----------|---------|---------------|--------------|---------|
| YouTube  | [Formula] | [Formula] | [Formula] | [Formula] | [Formula] |
| TikTok   | [Formula] | [Formula] | [Formula] | [Formula] | [Formula] |
| Twitter  | [Formula] | [Formula] | [Formula] | [Formula] | [Formula] |
```

**Sheet 4: Tier Breakdown**
```
| Tier | Contacted | Response Rate | Partnerships | Avg Commission | Revenue |
|------|-----------|---------------|--------------|----------------|---------|
| Tier 1 | [Formula] | [Formula] | [Formula] | [Formula] | [Formula] |
| Tier 2 | [Formula] | [Formula] | [Formula] | [Formula] | [Formula] |
| Tier 3 | [Formula] | [Formula] | [Formula] | [Formula] | [Formula] |
```

**Sheet 5: Top Performers**
```sql
Top 10 by Revenue:
=QUERY(Database!A:Z, "SELECT Name, Platform, Revenue_Generated, Reach ORDER BY Revenue_Generated DESC LIMIT 10")

Top 10 by Reach:
=QUERY(Database!A:Z, "SELECT Name, Platform, Reach, Engagement_Count ORDER BY Reach DESC LIMIT 10")
```

**Sheet 6: Weekly Trends**
```
| Week | Contacted | Responses | Partnerships | Revenue | Commissions |
|------|-----------|-----------|--------------|---------|-------------|
| Week 1 | 0 | 0 | 0 | $0 | $0 |
| Week 2 | 200 | [Count] | [Count] | [Sum] | [Sum] |
| Week 3 | 400 | [Count] | [Count] | [Sum] | [Sum] |
```

---

## Google Data Studio Integration (Optional)

### Step 1: Connect Google Sheets to Data Studio
1. Go to datastudio.google.com
2. Create new report
3. Add data source: Google Sheets
4. Select your "RideWire Influencer Database" sheet

### Step 2: Create Visualizations

**Visualization 1: Response Rate Over Time**
- Chart type: Line chart
- X-axis: Week
- Y-axis: Response Rate %
- Breakdown: Platform

**Visualization 2: Partnership Funnel**
- Chart type: Funnel chart
- Stages: Contacted → Replied → Negotiating → Active
- Color code by conversion rate

**Visualization 3: Revenue by Platform**
- Chart type: Pie chart or Bar chart
- Dimension: Platform
- Metric: SUM(Revenue_Generated)

**Visualization 4: Top Performers Table**
- Chart type: Table
- Columns: Name, Platform, Followers, Revenue, Reach
- Sort: Revenue (descending)
- Limit: Top 20

**Visualization 5: Geographic Heatmap** (if you track location)
- Chart type: Geo map
- Dimension: Country or State
- Metric: COUNT(Partnerships)

---

## Weekly Reporting Template

### Week [X] Performance Report

**Date Range**: [Start] to [End]

#### Outreach Summary
- **Total Contacted This Week**: [Number]
- **Cumulative Contacted**: [Number] / 1000 goal
- **Response Rate This Week**: [%]
- **Cumulative Response Rate**: [%]

#### Partnership Progress
- **New Partnerships This Week**: [Number]
- **Total Active Partnerships**: [Number]
- **Content Posted This Week**: [Number] pieces
- **Cumulative Content**: [Number] pieces

#### Content Performance
- **Total Reach This Week**: [Number] impressions
- **Cumulative Reach**: [Number] / 100M goal
- **Total Engagement This Week**: [Number]
- **Viral Content This Week**: [Number] (100k+ views)

#### Financial Performance
- **Revenue This Week**: $[Amount]
- **Cumulative Revenue**: $[Amount]
- **Commissions Paid This Week**: $[Amount]
- **Cumulative Commissions**: $[Amount]
- **Net Profit This Week**: $[Amount]

#### Top Performers This Week
1. **[Name]** - $[Revenue], [Reach] impressions
2. **[Name]** - $[Revenue], [Reach] impressions
3. **[Name]** - $[Revenue], [Reach] impressions

#### Insights & Learnings
- **What Worked**: [Observations]
- **What Didn't Work**: [Observations]
- **Optimizations Made**: [Changes]

#### Next Week Goals
- Contact [Number] new influencers
- Achieve [%] response rate
- Onboard [Number] new partnerships
- Generate $[Amount] revenue

---

## Monthly Reporting Template

### Month [X] Performance Report

**Campaign Month**: [Month]

#### Executive Summary
- **Influencers Contacted**: [Number] / 1000 goal ([%] complete)
- **Response Rate**: [%] (Target: 20%+)
- **Active Partnerships**: [Number] (Target: 50+)
- **Total Revenue**: $[Amount] (Target: $10k-30k)
- **Total Reach**: [Number]M impressions (Target: 100M)
- **ROI**: [%] (Target: 300%+)

#### Platform Breakdown
| Platform | Contacted | Response Rate | Partnerships | Revenue | Reach |
|----------|-----------|---------------|--------------|---------|-------|
| YouTube  | [#] | [%] | [#] | $[Amount] | [#] |
| TikTok   | [#] | [%] | [#] | $[Amount] | [#] |
| Twitter  | [#] | [%] | [#] | $[Amount] | [#] |
| **Total** | **[#]** | **[%]** | **[#]** | **$[Amount]** | **[#]** |

#### Tier Performance
| Tier | Partnerships | Avg Commission | Revenue | ROI |
|------|--------------|----------------|---------|-----|
| Tier 1 | [#] | [%] | $[Amount] | [%] |
| Tier 2 | [#] | [%] | $[Amount] | [%] |
| Tier 3 | [#] | [%] | $[Amount] | [%] |

#### Top 10 Performers (Lifetime)
1. **[Name]** ([Platform]) - $[Revenue], [Reach] impressions
2-10. [...]

#### Financial Summary
- **Total Revenue**: $[Amount]
- **Total Commissions**: $[Amount]
- **Campaign Costs**: $[Amount]
- **Net Profit**: $[Amount]
- **Profit Margin**: [%]

#### Content Highlights
- **Total Content Posted**: [Number] pieces
- **Viral Content**: [Number] (100k+ views)
- **Best Performing Content**: [Description]
- **Average Engagement Rate**: [%]

#### Key Learnings
1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

#### Optimizations Implemented
1. [Change 1]
2. [Change 2]
3. [Change 3]

#### Next Month Goals
- Contact remaining [Number] influencers
- Achieve [Number] total partnerships
- Generate $[Amount] revenue
- Hit [Number]M impressions milestone

---

## Alerting & Monitoring

### Set Up Alerts For:

**Low Response Rate Alert**
- Trigger: If weekly response rate < 10%
- Action: Review and revise templates immediately

**High Ghosted Rate Alert**
- Trigger: If ghosted rate > 70%
- Action: Improve outreach quality or targeting

**Payout Error Alert**
- Trigger: Any failed Stripe payout
- Action: Manually resolve within 24 hours

**Viral Content Alert**
- Trigger: Any content hits 100k+ views
- Action: Send bonus to influencer, amplify content

**High Revenue Partner Alert**
- Trigger: Any influencer generates $1k+ lifetime revenue
- Action: Upgrade to VIP status, increase commission

---

## Data Quality Checklist

Weekly data hygiene:
- [ ] Remove duplicate entries
- [ ] Verify all emails are valid (no bounces)
- [ ] Update Status for all contacted influencers
- [ ] Log Response_Date for all replies
- [ ] Update Partnership_Status for progressing leads
- [ ] Verify Revenue_Generated matches Stripe data
- [ ] Mark Content_Posted = "Yes" when content goes live
- [ ] Calculate and update Reach + Engagement_Count

---

## Formulas Cheat Sheet

```excel
// Response Rate
=COUNTIF(Status:Status,"Replied")/COUNTIF(Status:Status,"Sent")*100

// Partnership Conversion Rate
=COUNTIF(Partnership_Status:Partnership_Status,"Active")/COUNTIF(Status:Status,"Replied")*100

// Total Revenue
=SUM(Revenue_Generated:Revenue_Generated)

// Total Commissions
=SUMPRODUCT(Revenue_Generated:Revenue_Generated,Commission_Rate_%:Commission_Rate_%)/100

// Average Revenue Per Partner
=SUM(Revenue_Generated:Revenue_Generated)/COUNTIF(Partnership_Status:Partnership_Status,"Active")

// Platform-Specific Response Rate (YouTube example)
=COUNTIFS(Platform:Platform,"YouTube",Status:Status,"Replied")/COUNTIFS(Platform:Platform,"YouTube",Status:Status,"Sent")*100

// Tier-Specific Partnership Count
=COUNTIFS(Tier:Tier,"Tier 1",Partnership_Status:Partnership_Status,"Active")

// Viral Content Count
=COUNTIFS(Content_Posted:Content_Posted,"Yes",Reach:Reach,">=100000")

// Average Engagement Rate
=AVERAGE((Engagement_Count:Engagement_Count/Reach:Reach)*100)
```

---

**File Location**: `campaigns/influencer-outreach/guides/METRICS_TRACKING_GUIDE.md`

**Next Steps**:
1. Set up Google Sheets with these formulas
2. Create weekly report template
3. Schedule weekly review meetings
4. Set up automated alerts (via Zapier)
5. Build Data Studio dashboard (optional but recommended)
