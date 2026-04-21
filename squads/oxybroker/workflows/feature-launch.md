---
name: workflows:saas-startup:feature-launch
description: "Multi-phase workflow for developing, gating, launching, and measuring SaaS features with data-driven decision making"
---

You are now executing the **Feature Development & Launch Cycle** workflow for building and shipping SaaS features with metrics-driven validation.

## Workflow Overview

This workflow takes a feature from hypothesis through development, controlled rollout, and post-launch measurement.

**Participants:** Pulse (analyst) > Funnel (ux) > Tenon (architect) > Scaler (dev) > Pulse (analyst)

---

## Phase 1: Hypothesis & Metrics (Agent: Pulse)

**Objective:** Define the feature hypothesis, success metrics, and measurement plan.

**Inputs:**
- Feature request or product initiative
- Current product metrics baseline
- Customer feedback / support data
- Competitive analysis

**Activities:**
1. Define feature hypothesis: "If we build [X], then [metric] will improve by [Y%]"
2. Identify primary metric (north star for this feature)
3. Define secondary metrics (engagement, adoption, revenue impact)
4. Set guardrail metrics (performance, error rate, support volume)
5. Analyze current baseline for all metrics
6. Determine minimum detectable effect (MDE) and sample size for A/B test
7. Define target customer segments for initial rollout
8. Create measurement plan with data sources and tracking events

**Outputs:**
- Feature hypothesis document
- Metrics definition (primary, secondary, guardrail)
- Baseline metrics snapshot
- A/B test plan (sample size, duration, segments)
- Measurement plan with event tracking specification

**Transition Criteria:** Hypothesis and metrics approved by product team

---

## Phase 2: UX Design (Agent: Funnel)

**Objective:** Design the feature experience with onboarding and discovery in mind.

**Inputs:**
- Feature hypothesis and metrics
- Target user segments
- Current product UX and information architecture
- User feedback and pain points

**Activities:**
1. Map user journey for the new feature (from discovery to habitual use)
2. Design feature entry points (navigation, empty states, contextual prompts)
3. Design the core feature interaction flows
4. Design onboarding for the feature (first-use experience, tooltips, guided tour)
5. Design upgrade prompts for gated features (if plan-restricted)
6. Design A/B test variants (if testing UX variations)
7. Ensure mobile responsiveness and accessibility
8. Create interaction specifications for development

**Outputs:**
- User journey map with entry points
- Wireframes / mockups for all feature screens
- Onboarding flow design (first-use experience)
- Feature discovery design (how users find it)
- Upgrade prompt design (if gated)
- A/B test variant designs
- Interaction specification document

**Transition Criteria:** UX designs approved by product team

---

## Phase 3: Architecture & Gating (Agent: Tenon)

**Objective:** Design the technical architecture with multi-tenancy and feature gating.

**Inputs:**
- Feature requirements and UX designs
- Current system architecture
- Plan/tier structure
- Expected load and scaling requirements

**Activities:**
1. Design data model changes with tenant isolation (RLS)
2. Define feature gating rules (which plans get access)
3. Design API endpoints with rate limiting per tenant
4. Plan migration strategy (zero-downtime, backward compatible)
5. Design event tracking integration points
6. Define feature flag configuration using `templates/feature-flag-spec.md`
7. Plan rollout stages (canary > beta > GA)
8. Review for compliance (data handling, tenant isolation)

**Outputs:**
- Architecture design document
- Database migration plan
- Feature flag specification
- API design with gating rules
- Rollout plan with stages
- Performance and scaling considerations

**Transition Criteria:** Architecture review passed, feature flag spec approved

---

## Phase 4: Build & Gate (Agent: Scaler)

**Objective:** Implement the feature behind feature flags with full instrumentation.

**Inputs:**
- UX designs and interaction specs
- Architecture design and migration plan
- Feature flag specification
- Event tracking specification

**Activities:**
1. Create feature flag with targeting rules (initially off for all)
2. Implement database migrations (backward compatible)
3. Build API endpoints with feature gating middleware
4. Build frontend components with feature flag checks
5. Implement event tracking for all measurement points
6. Build onboarding/discovery UI components
7. Implement upgrade prompts and plan checks
8. Write unit tests, integration tests, and feature flag tests
9. Deploy to staging behind feature flag (still off)
10. Run QA with feature flag enabled in staging

**Outputs:**
- Feature implemented behind feature flag
- All events tracking verified
- Test suite passing
- Feature flag configured for staged rollout
- Staging environment verified

**Transition Criteria:** All tests passing, staging QA complete, tracking verified

---

## Phase 5: Launch & Measure (Agent: Pulse)

**Objective:** Execute staged rollout, monitor metrics, and make data-driven decisions.

**Inputs:**
- Deployed feature behind feature flag
- Measurement plan with baseline metrics
- A/B test configuration
- Rollout plan

**Activities:**
1. **Canary (5%)**: Enable for internal team + 5% of target segment
   - Monitor error rates, performance, support volume (24-48 hours)
   - Go/No-Go decision based on guardrail metrics
2. **Beta (25%)**: Expand to 25% of target segment
   - Begin A/B test measurement (minimum 2 weeks)
   - Weekly metric snapshots
   - Collect qualitative feedback from beta users
3. **GA Rollout (100%)**: Full rollout if metrics meet targets
   - Monitor for 2 additional weeks at full rollout
   - Declare A/B test winner with statistical significance
4. **Post-Launch Analysis**:
   - Compare actual metrics vs. hypothesis
   - Analyze cohort impact (users with feature vs. without)
   - Calculate revenue/engagement lift
   - Document learnings for future features
   - Create feature flag cleanup ticket (remove flag, keep feature)

**Outputs:**
- Canary monitoring report
- Beta A/B test results
- GA launch metrics report
- Post-launch analysis with hypothesis validation
- Feature flag cleanup ticket
- Learnings document

**Transition Criteria:** Feature at 100% rollout, post-launch analysis complete, hypothesis validated or invalidated

---

## Rollback Protocol

At any stage, if guardrail metrics are breached:
1. Immediately disable feature flag (0% rollout)
2. Investigate root cause
3. Fix issues and re-deploy to staging
4. Restart rollout from Canary (5%)

**Guardrail Breach Thresholds:**
- Error rate increase >0.5%
- P95 latency increase >200ms
- Support ticket volume increase >20%
- Revenue impact: any negative revenue signal

**Maximum Rollout Iterations:** 3 full cycles before feature reassessment
