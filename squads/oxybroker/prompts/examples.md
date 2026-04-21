# SaaS Startup Squad - Example Prompts

## 1. MVP SaaS Product
```
/pro:squad saas-startup Build an MVP for a project management SaaS. Need: multi-tenant
architecture, Stripe subscription billing (Free/Pro/Team tiers), user authentication with
team invites, feature gating by plan, and a basic onboarding flow. Target: launch in 4 weeks.
```

## 2. Subscription Billing System
```
/pro:squad saas-startup scaler Implement a complete Stripe billing integration with:
- 3 pricing tiers (Free, Pro $29/mo, Team $79/mo) with annual discount
- Stripe Checkout for payment collection
- Billing portal for self-service management
- Webhook handling for subscription lifecycle events
- Usage metering for API calls with soft/hard limits
- Proration on mid-cycle plan changes
```

## 3. Multi-Tenant Architecture
```
/pro:squad saas-startup tenon Design a multi-tenant architecture for our SaaS platform
with 500+ tenants. Need: shared database with RLS, tenant isolation strategy,
per-tenant rate limiting, custom subdomain support, and a plan for migrating
high-value enterprise tenants to dedicated resources.
```

## 4. Churn Analysis Deep Dive
```
/pro:squad saas-startup pulse Our monthly churn jumped from 3.2% to 5.8% over the last quarter.
MRR is $85K. We have 1,200 customers across Free (800), Pro (320), and Team (80) tiers.
Analyze churn patterns, build a cohort retention heatmap, identify leading indicators,
and recommend interventions to bring churn back below 4%.
```

## 5. Onboarding Flow Redesign
```
/pro:squad saas-startup funnel Redesign our onboarding flow. Current activation rate is 23%
(target: 40%). Our aha moment is "creating first automated workflow."
Current flow: signup > profile > empty dashboard. Need: progressive onboarding checklist,
template gallery, guided first workflow creation, and contextual tooltips.
```

## 6. Feature Flag System
```
/pro:squad saas-startup scaler Build a feature flag system for our product. Need:
boolean and percentage flags, targeting by plan/user/org, A/B test variant support,
real-time flag updates without redeploy, analytics integration for experiment tracking,
and a simple admin UI. Consider PostHog vs. building in-house.
```

## 7. Pricing Page Optimization
```
/pro:squad saas-startup funnel Design and A/B test our pricing page. Current free-to-paid
conversion is 1.8% (industry benchmark: 2-5%). Need: plan comparison redesign,
annual toggle with savings, feature grouping that highlights value, social proof
integration, and enterprise CTA. Design 3 variants to test.
```

## 8. Product Metrics Dashboard
```
/pro:squad saas-startup pulse Build a real-time product metrics dashboard covering:
AARRR funnel, MRR waterfall, cohort retention heatmap, feature adoption rates,
customer health scores, and churn prediction alerts. Data sources: PostgreSQL,
Stripe, Segment, and PostHog events.
```

## 9. Usage-Based Pricing Migration
```
/pro:squad saas-startup Migrate our flat-rate pricing ($49/mo) to usage-based pricing
(base $19/mo + $0.01/API call). Need: usage metering infrastructure, Stripe
metered billing setup, in-app usage dashboard, limit warnings, overage handling,
migration plan for existing customers, and impact analysis on revenue.
```

## 10. PLG Growth Engine
```
/pro:squad saas-startup Build a product-led growth engine. Current metrics: 5K signups/mo,
23% activation, 1.8% conversion, $85K MRR. Need: viral referral system (invite-to-earn),
in-product upgrade prompts at limit hits, PQL scoring for sales handoff,
automated email sequences (onboarding + re-engagement), and a growth metrics dashboard.
```
