# PRD: Marketing Campaign

## Document Info
| Field | Value |
|-------|-------|
| Client | [Client Name] |
| Campaign | [Campaign Name] |
| Version | 1.0 |
| Author | [Name] |
| Date | [Date] |
| Status | Draft |

---

## 1. Campaign Overview

### 1.1 Business Objective
[What business goal does this campaign serve? Revenue, brand awareness, lead generation, product launch, customer retention?]

### 1.2 Campaign Summary
| Attribute | Value |
|-----------|-------|
| Type | [Awareness / Lead Gen / Conversion / Retention / Product Launch] |
| Budget | $[Total] |
| Duration | [Start Date] to [End Date] |
| Channels | [List of channels] |
| Target Geography | [Regions/Countries] |
| Target Language | [Languages] |

### 1.3 Key Performance Indicators
| KPI | Target | Measurement Source |
|-----|--------|-------------------|
| Impressions | [Number] | GA4 + Platform analytics |
| Click-Through Rate (CTR) | [%] | Platform analytics |
| Leads Generated | [Number] | CRM / Form submissions |
| Cost Per Lead (CPL) | $[Amount] | Platform spend / leads |
| Conversions (Sales/Signups) | [Number] | GA4 conversions |
| Cost Per Acquisition (CPA) | $[Amount] | Platform spend / conversions |
| Return on Ad Spend (ROAS) | [X.Xx] | Revenue / ad spend |
| Email Open Rate | [%] | Email platform |
| Email Click Rate | [%] | Email platform |

---

## 2. Target Audience

### 2.1 Primary Audience
| Attribute | Description |
|-----------|-------------|
| Demographics | Age: [range], Gender: [all/specific], Income: [range] |
| Geography | [City/State/Country] |
| Job Title/Industry | [If B2B] |
| Interests | [Behavioral interests] |
| Pain Points | [What problems they face] |
| Current Behavior | [How they currently solve the problem] |

### 2.2 Secondary Audience
[Describe secondary audience if applicable]

### 2.3 Audience Segments for Targeting
| Segment | Channel | Targeting Criteria | Budget % |
|---------|---------|-------------------|----------|
| [Segment 1] | [Channel] | [Criteria] | [%] |
| [Segment 2] | [Channel] | [Criteria] | [%] |
| [Retargeting] | [Channel] | [Site visitors, cart abandoners] | [%] |

---

## 3. Channel Strategy

### 3.1 Budget Allocation
| Channel | Budget | % of Total | Primary Objective |
|---------|--------|-----------|-------------------|
| Google Ads (Search) | $[Amount] | [%] | [Intent capture] |
| Google Ads (Display) | $[Amount] | [%] | [Awareness/retargeting] |
| Meta Ads (FB/IG) | $[Amount] | [%] | [Lead gen/awareness] |
| LinkedIn Ads | $[Amount] | [%] | [B2B lead gen] |
| TikTok Ads | $[Amount] | [%] | [Awareness/engagement] |
| Email Marketing | $[Amount] | [%] | [Nurture/conversion] |
| Content/SEO | $[Amount] | [%] | [Organic traffic] |
| Influencer | $[Amount] | [%] | [Social proof/reach] |
| **Total** | **$[Amount]** | **100%** | |

### 3.2 Channel-Specific Strategy
For each channel, define:
- **Objective**: What this channel achieves in the funnel
- **Ad Formats**: Which formats to use (carousel, video, lead form, etc.)
- **Targeting**: Audience segments for this channel
- **Creative Variants**: Number of A/B test variants
- **Bid Strategy**: Manual CPC, target CPA, maximize conversions, etc.
- **Daily Budget**: Daily pacing for this channel

---

## 4. Messaging Framework

### 4.1 Key Messages
| Priority | Message | Supporting Proof |
|----------|---------|-----------------|
| Primary | [Main value proposition] | [Data, testimonial, feature] |
| Secondary | [Supporting benefit] | [Proof point] |
| Tertiary | [Additional benefit] | [Proof point] |

### 4.2 CTA Strategy
| Funnel Stage | CTA Text | Destination |
|-------------|----------|-------------|
| Awareness | "Learn More" | Blog post / Landing page |
| Consideration | "Get Free Guide" / "Watch Demo" | Gated content / Demo page |
| Decision | "Start Free Trial" / "Get Quote" | Signup / Contact form |
| Retention | "Upgrade Now" / "Refer a Friend" | Pricing / Referral page |

### 4.3 Content Themes
| Week | Theme | Key Messages | Content Types |
|------|-------|-------------|---------------|
| 1 | [Theme] | [Messages] | [Post, ad, email] |
| 2 | [Theme] | [Messages] | [Post, ad, email] |
| 3 | [Theme] | [Messages] | [Post, ad, email] |
| 4 | [Theme] | [Messages] | [Post, ad, email] |

---

## 5. Creative Requirements

### 5.1 Asset List
| Asset | Format | Dimensions | Variants | Owner | Deadline |
|-------|--------|-----------|----------|-------|----------|
| Social Post | Image | 1080x1080 | 3 | Design | [Date] |
| Story Ad | Video | 1080x1920 | 2 | Video | [Date] |
| Display Banner | Image | 728x90, 300x250 | 2 | Design | [Date] |
| Email Template | HTML | 600px wide | 1 | Design/Dev | [Date] |
| Landing Page | Web | Responsive | 2 (A/B) | Design/Dev | [Date] |

### 5.2 Brand Guidelines Reference
- Logo usage: [Link to brand guide]
- Color palette: [Primary, secondary, accent colors]
- Typography: [Heading font, body font]
- Tone of voice: [Formal/casual, technical/accessible]

---

## 6. Technical Requirements

### 6.1 Tracking Setup
- [ ] UTM parameters defined for all campaign URLs
- [ ] GA4 events configured for campaign KPIs
- [ ] Meta Pixel events verified (ViewContent, Lead, Purchase)
- [ ] Platform conversion tracking verified
- [ ] Server-side tracking (CAPI) configured where applicable
- [ ] Attribution model selected: [Last Click / Data-Driven / Custom]

### 6.2 Landing Page Requirements
- [ ] Mobile-responsive design
- [ ] Page load <3 seconds
- [ ] Form with progressive profiling
- [ ] Thank you page with conversion tracking
- [ ] Cookie consent banner (GDPR/LGPD)
- [ ] A/B test variant capability

### 6.3 Integrations
- [ ] CRM integration for lead capture (HubSpot/Salesforce/Pipedrive)
- [ ] Email automation triggers on form submission
- [ ] Retargeting pixel fires on key pages
- [ ] Slack/Discord notification on new leads (optional)

---

## 7. Timeline

| Phase | Start | End | Owner |
|-------|-------|-----|-------|
| Brief & Strategy | [Date] | [Date] | Campfire |
| Analytics Setup | [Date] | [Date] | Dash |
| Creative Production | [Date] | [Date] | Prism |
| Build & Launch | [Date] | [Date] | Pixel |
| Optimization (ongoing) | [Date] | [Date] | Dash |
| Final Report | [Date] | [Date] | Dash + Campfire |

---

## 8. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low conversion rate | High | A/B testing, iterative optimization |
| Ad fatigue | Medium | Creative refresh every 2-3 weeks |
| Budget overspend | High | Daily pacing alerts, automated rules |
| Platform policy rejection | Medium | Pre-review against ad policies |
| Tracking failure | Critical | Pre-launch verification, server-side backup |
| Client approval delays | Medium | Clear SLAs, automated reminders |
