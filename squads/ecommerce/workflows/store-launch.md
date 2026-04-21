---
name: workflows:ecommerce:store-launch
description: "Multi-phase workflow for building and launching an e-commerce store from catalog design through conversion-optimized launch"
---

You are now executing the **Store Setup & Launch** workflow for building a complete e-commerce storefront from product catalog through optimized checkout.

## Workflow Overview

This workflow takes an e-commerce store from product catalog design through a conversion-optimized, payment-ready launch.

**Participants:** Convert (analyst) > Catalog (data-engineer) > Gate (architect) > Shelf (dev) > Convert (analyst)

---

## Phase 1: Market & Conversion Analysis (Agent: Convert)

**Objective:** Define store requirements, conversion targets, and customer experience strategy.

**Inputs:**
- Product catalog overview (categories, SKU count, variant complexity)
- Target market and customer personas
- Competitive analysis
- Business goals (revenue targets, conversion targets)

**Activities:**
1. Analyze target market and define customer personas
2. Map ideal customer journey (discovery > browse > purchase > retention)
3. Define conversion funnel with target metrics per stage
4. Identify key conversion levers (AOV optimization, cart recovery, upsell opportunities)
5. Define product discovery strategy (search, filtering, collections, recommendations)
6. Analyze competitor checkout flows and identify best practices
7. Set pricing strategy (discounting rules, bundle opportunities, free shipping threshold)
8. Define KPI dashboard requirements

**Outputs:**
- Customer persona documents
- Conversion funnel with target metrics
- Customer journey map with optimization points
- Competitive analysis summary
- E-commerce PRD using `templates/prd-store.md`

**Transition Criteria:** Business goals and conversion targets approved

---

## Phase 2: Catalog & Data Design (Agent: Catalog)

**Objective:** Design the product data model, inventory system, and search architecture.

**Inputs:**
- Product catalog requirements (from Phase 1)
- Product data (spreadsheets, existing system export)
- Inventory management requirements

**Activities:**
1. Design product schema using `templates/product-schema.md`
2. Define variant structure (options, values, SKU naming convention)
3. Design category taxonomy (hierarchy, URL structure, faceted navigation)
4. Design inventory tracking model (multi-location, reservations, alerts)
5. Plan product search indexing strategy (Algolia/Meilisearch/Typesense)
6. Define pricing model (base prices, compare-at, tiers, multi-currency)
7. Design product import pipeline (CSV/API/manual entry)
8. Plan product image management (CDN, optimization, responsive sizes)

**Outputs:**
- Complete database schema (DDL scripts)
- SKU naming convention document
- Category taxonomy map
- Search index configuration
- Product data import template
- Data migration plan

**Transition Criteria:** Schema review approved, sample data validated

---

## Phase 3: Checkout Architecture (Agent: Gate)

**Objective:** Design the payment processing, order management, and fulfillment systems.

**Inputs:**
- Business requirements (payment methods, shipping, tax)
- Product data model from Phase 2
- Compliance requirements (PCI-DSS, tax, consumer protection)

**Activities:**
1. Select payment gateway and compliance level (SAQ A vs. SAQ A-EP)
2. Design checkout flow using `templates/checkout-flow.md`
3. Design order management system (lifecycle, states, transitions)
4. Design payment flow (authorize > capture pattern, webhook handling)
5. Integrate shipping rate calculation (carrier APIs)
6. Design tax calculation integration (Stripe Tax or regional tax service)
7. Design fraud detection rules and manual review workflow
8. Plan refund and return processing flow
9. Design Pix and Boleto flows for Brazilian market (if applicable)

**Outputs:**
- Checkout flow specification
- Order management system design
- Payment integration architecture
- Shipping and tax integration plan
- Fraud detection rule set
- Refund/return workflow

**Transition Criteria:** Architecture review passed, PCI-DSS compliance plan approved

---

## Phase 4: Storefront Build (Agent: Shelf)

**Objective:** Build the complete storefront with optimized product pages, cart, and checkout.

**Inputs:**
- Product schema and data from Phase 2
- Checkout architecture from Phase 3
- Conversion strategy from Phase 1
- Design mockups/brand guidelines

**Activities:**
1. Set up project (Next.js/Astro + headless CMS or custom backend)
2. Build product listing pages (grid, filters, search, pagination)
3. Build product detail pages (gallery, variants, reviews, add-to-cart)
4. Build shopping cart (drawer + full page, upsell, free shipping threshold)
5. Build checkout flow (information, shipping, payment)
6. Integrate payment methods (Stripe Elements, PayPal, Pix)
7. Build order confirmation and tracking pages
8. Build account/order history pages
9. Implement SEO (JSON-LD, meta tags, sitemap, Open Graph)
10. Implement analytics tracking (GA4 e-commerce events, Meta Pixel)
11. Implement abandoned cart recovery (email triggers)
12. Performance optimization (Core Web Vitals targets: LCP<2.5s, FID<100ms, CLS<0.1)

**Outputs:**
- Complete storefront (product listing, PDP, cart, checkout, confirmation)
- Payment processing verified with test transactions
- SEO and analytics tracking verified
- Abandoned cart recovery system active
- Performance audit passing Core Web Vitals

**Transition Criteria:** All pages functional, payment processing verified, performance targets met

---

## Phase 5: Conversion Optimization (Agent: Convert)

**Objective:** Verify conversion readiness, set up A/B tests, and launch with monitoring.

**Inputs:**
- Complete storefront from Phase 4
- Analytics tracking data
- Conversion targets from Phase 1

**Activities:**
1. Conduct conversion audit of entire funnel (friction points, missing trust signals)
2. Verify analytics tracking for all funnel events
3. Test checkout flow on all devices (desktop, mobile, tablet)
4. Verify abandoned cart recovery emails (trigger timing, content, tracking)
5. Set up initial A/B tests (checkout flow, product page elements, cart upsells)
6. Configure real-time conversion monitoring dashboard
7. Set up alerts for conversion rate drops and checkout errors
8. Final pre-launch checklist (all payment methods, edge cases, error handling)
9. Launch store and monitor first 48 hours closely
10. Produce launch report with initial metrics vs. targets

**Outputs:**
- Conversion audit report with recommendations
- A/B test roadmap (first 90 days)
- Live monitoring dashboard
- Launch confirmation with initial metrics
- Optimization backlog for post-launch

**Transition Criteria:** Store live, conversion tracking verified, no critical issues in first 48 hours

---

## Post-Launch Optimization Cycle

After launch, enter a continuous optimization loop:
1. **Weekly**: Review funnel metrics, check A/B test results
2. **Bi-weekly**: Analyze abandoned cart recovery performance, adjust email timing/content
3. **Monthly**: Product performance review, dead stock identification, pricing optimization
4. **Quarterly**: Full conversion audit, competitive analysis update, major UX improvements
