---
name: workflows:marketing-agency:campaign-cycle
description: "Multi-phase workflow for creating and executing marketing campaigns from brief to performance analysis"
---

You are now executing the **Campaign Creation Cycle** workflow for planning, building, launching, and optimizing a marketing campaign.

## Workflow Overview

This workflow takes a campaign from initial client brief through launch, optimization, and performance reporting.

**Participants:** Campfire (pm) > Dash (analyst) > Prism (ux) > Pixel (dev) > Dash (analyst)

---

## Phase 1: Brief & Strategy (Agent: Campfire)

**Objective:** Capture campaign requirements and develop channel strategy.

**Inputs:**
- Client objectives and business goals
- Target audience description
- Budget and timeline
- Brand guidelines and past campaign data

**Activities:**
1. Conduct client kickoff meeting
2. Define campaign objectives with measurable KPIs
3. Identify target audience segments (demographics, psychographics, behaviors)
4. Select channels based on audience presence and budget
5. Develop messaging framework (key messages, value propositions, CTAs)
6. Create budget allocation across channels using 70/20/10 framework
7. Build content calendar using `templates/content-calendar.md`
8. Define approval workflow and timeline

**Outputs:**
- Campaign brief document using `templates/prd-campaign.md`
- Channel strategy with budget allocation
- Content calendar with deadlines
- Approval workflow diagram

**Transition Criteria:** Client approves brief and budget allocation

---

## Phase 2: Analytics Setup (Agent: Dash)

**Objective:** Configure tracking infrastructure before any content goes live.

**Inputs:**
- Campaign brief with KPIs
- Channel list with expected conversion events
- Client's existing analytics setup

**Activities:**
1. Define UTM naming convention for all campaign URLs
2. Configure GA4 events and conversions for campaign KPIs
3. Set up Meta Pixel events and custom conversions
4. Configure platform-specific tracking (TikTok Pixel, LinkedIn Insight Tag)
5. Set up server-side tracking via Conversions API where applicable
6. Create pre-launch tracking verification checklist
7. Build real-time monitoring dashboard
8. Define attribution model for the campaign

**Outputs:**
- UTM taxonomy document
- Tracking implementation guide
- Pre-launch verification checklist
- Monitoring dashboard
- Attribution model documentation

**Transition Criteria:** All tracking verified in staging/test environment

---

## Phase 3: Creative Production (Agent: Prism)

**Objective:** Design all campaign assets following brand guidelines.

**Inputs:**
- Campaign brief with messaging framework
- Content calendar with asset requirements
- Brand guidelines
- Platform-specific specifications

**Activities:**
1. Create campaign visual identity (within brand guidelines)
2. Design social media assets for each platform (correct dimensions)
3. Design email templates (responsive, dark-mode tested)
4. Design landing page wireframes and visual mockups
5. Create ad variations for A/B testing (2-3 variants per ad group)
6. Prepare design assets with specifications for development
7. Client review and revision cycle (max 2 rounds)

**Outputs:**
- Complete asset library (all formats and sizes)
- Email templates (MJML or HTML)
- Landing page designs (Figma/design files)
- Ad creative variations
- Asset specification document for developers

**Transition Criteria:** Client approves all creative assets

---

## Phase 4: Build & Launch (Agent: Pixel)

**Objective:** Implement landing pages, email campaigns, and deploy ads.

**Inputs:**
- Approved creative assets
- Tracking implementation guide
- Content calendar with scheduling
- Platform credentials and access

**Activities:**
1. Build landing pages with responsive design and SEO optimization
2. Implement tracking pixels, UTM parameters, and conversion events
3. Set up email campaigns with proper segmentation and scheduling
4. Configure social media ad campaigns with targeting and budgets
5. Implement A/B tests with proper variant distribution
6. Run pre-launch checklist (tracking verification, link testing, mobile testing)
7. Execute phased launch per content calendar
8. Monitor first 24-48 hours for technical issues

**Outputs:**
- Live landing pages with verified tracking
- Configured and scheduled email campaigns
- Active ad campaigns across platforms
- A/B tests running with proper measurement
- Launch confirmation with initial metrics

**Transition Criteria:** All campaign elements live, tracking verified, no technical issues

---

## Phase 5: Analyze & Optimize (Agent: Dash)

**Objective:** Monitor performance, optimize campaigns, and deliver reporting.

**Inputs:**
- Live campaign data from all channels
- KPI targets from campaign brief
- A/B test results
- Budget allocation

**Activities:**
1. Daily performance monitoring (spend pacing, anomaly detection)
2. Weekly A/B test analysis (declare winners at statistical significance)
3. Funnel analysis per channel (identify drop-off points)
4. Budget reallocation recommendations (shift from underperforming to high-ROAS channels)
5. Audience insight analysis (which segments convert best)
6. Bi-weekly optimization recommendations
7. End-of-campaign performance report using `templates/analytics-report.md`
8. Insights and recommendations for next campaign cycle

**Outputs:**
- Weekly performance snapshots
- A/B test result reports with recommendations
- Budget reallocation recommendations
- Final campaign performance report
- Strategic insights for future campaigns

**Transition Criteria:** Campaign period ends; final report delivered and presented to client

---

## Iteration Protocol

During Phase 5 (active campaign):
1. **Daily**: Automated alerts for spend anomalies, performance drops, technical issues
2. **Weekly**: Performance review, A/B test decisions, minor optimizations
3. **Bi-weekly**: Strategy review, budget reallocation, creative refresh decisions
4. **Monthly**: Comprehensive report, client presentation, next-period planning

**Escalation Triggers:**
- Spend pacing >120% or <80% of daily budget
- CPA exceeds target by >50%
- Conversion tracking discrepancy >20%
- Landing page downtime or errors
