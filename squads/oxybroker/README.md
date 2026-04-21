# SaaS Startup Squad

Specialized squad for building scalable SaaS products with multi-tenant architecture, subscription billing, product-led growth, and data-driven feature development.

## Agents

| Agent | Name | Base | Specialty |
|-------|------|------|-----------|
| growth-dev | Scaler | dev | Feature flags, A/B testing, Stripe, onboarding flows |
| product-analyst | Pulse | analyst | PLG metrics, cohort analysis, churn prediction, NPS |
| saas-architect | Tenon | architect | Multi-tenant, subscription billing, feature gating |
| onboarding-ux | Funnel | ux | Conversion optimization, activation metrics, progressive disclosure |

## Workflow

**Feature Development & Launch Cycle** (`workflows/feature-launch.md`)
Multi-phase workflow: Hypothesis > Design > Build > Gate > Launch > Measure

## Templates

- **SaaS PRD** — Product requirements with metrics, pricing tiers, and growth hypotheses
- **Churn Analysis** — Churn investigation template with cohort analysis
- **Feature Flag Spec** — Feature flag specification with rollout strategy

## Usage

```
/pro:squad saas-startup — Load the full SaaS startup squad
/pro:squad saas-startup scaler — Load only the growth developer overlay
```

## Key Patterns

- Product-Led Growth (PLG) with self-serve onboarding
- Subscription billing via Stripe (Checkout, Billing Portal, Webhooks)
- Feature gating by plan tier
- Usage-based pricing and metering
- Multi-tenant data isolation (shared DB with tenant_id vs. schema-per-tenant)
