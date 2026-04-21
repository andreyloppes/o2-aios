# E-commerce Squad

Specialized squad for building online stores, product catalogs, shopping cart/checkout systems, and conversion-optimized e-commerce experiences.

## Agents

| Agent | Name | Base | Specialty |
|-------|------|------|-----------|
| storefront-dev | Shelf | dev | Product pages, cart, checkout, payment integration |
| catalog-data-engineer | Catalog | data-engineer | SKU management, inventory, variants, categories |
| conversion-analyst | Convert | analyst | Funnel analysis, abandoned cart, upsell strategies |
| checkout-architect | Gate | architect | PCI-DSS, payment gateways, order fulfillment |

## Workflow

**Store Setup & Launch** (`workflows/store-launch.md`)
Multi-phase workflow: Catalog Design > Checkout Architecture > Storefront Build > Optimization > Launch

## Templates

- **E-commerce PRD** — Store requirements with product, order, and fulfillment features
- **Product Schema** — Product data model with variants, pricing, and inventory
- **Checkout Flow** — Checkout process specification with payment and shipping

## Usage

```
/pro:squad ecommerce — Load the full e-commerce squad
/pro:squad ecommerce shelf — Load only the storefront developer overlay
```

## Payment Methods Supported

- Credit/Debit Cards (Stripe, Adyen)
- PayPal
- Pix (Brazil)
- Boleto (Brazil)
- Apple Pay / Google Pay
- Buy Now, Pay Later (Klarna, Afterpay)
