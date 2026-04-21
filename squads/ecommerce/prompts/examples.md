# E-commerce Squad - Example Prompts

## 1. Complete Online Store
```
/pro:squad ecommerce Build a complete e-commerce store for a Brazilian fashion brand.
Product catalog: 200 SKUs across clothing and accessories with color/size variants.
Need: product pages, cart, checkout with Pix/card/boleto, inventory management,
abandoned cart emails, and an admin dashboard. Target: 2% conversion rate.
```

## 2. Product Catalog System
```
/pro:squad ecommerce catalog Design and build a product catalog system for a marketplace
with 10,000+ SKUs from multiple vendors. Need: flexible variant system (color, size,
material, custom attributes), hierarchical categories, faceted search with Algolia,
bulk import via CSV, and inventory tracking per vendor per warehouse.
```

## 3. Checkout Optimization
```
/pro:squad ecommerce gate Our checkout abandonment rate is 78% (industry avg: 70%).
Redesign our checkout flow. Current: 5-step checkout with account required.
Need: guest checkout, single-page option, Pix integration, address autocomplete
via CEP, installment display for cards, and express checkout (Apple/Google Pay).
```

## 4. Conversion Rate Analysis
```
/pro:squad ecommerce convert Our store gets 50K monthly visitors but only 0.8% conversion rate.
Funnel data: 50K sessions > 8K product views > 2K add-to-cart > 800 begin checkout > 400 purchase.
Analyze each funnel stage, identify the biggest drop-offs, and create an A/B test
roadmap with 10 high-impact experiments to reach 2% conversion.
```

## 5. Payment Integration
```
/pro:squad ecommerce gate Implement a full payment system for a Brazilian e-commerce:
- Credit/debit cards via Stripe (with installments up to 12x)
- Pix with QR code and copy/paste
- Boleto bancario with 3-day expiration
- PayPal for international customers
- Apple Pay and Google Pay express checkout
Include webhook handling, fraud detection, and refund processing.
```

## 6. Product Search & Filtering
```
/pro:squad ecommerce shelf Build a product search and filtering system using Meilisearch.
Catalog: 5,000 products with attributes (category, brand, color, size, price, rating).
Need: instant search with autocomplete and product thumbnails, faceted filtering,
sort by relevance/price/rating/newest, URL-synced filters for SEO, and typo tolerance.
```

## 7. Abandoned Cart Recovery
```
/pro:squad ecommerce convert Design and implement an abandoned cart recovery system.
Current: no recovery in place. Estimate 3,000 abandoned carts/month at avg R$180 AOV.
Need: email sequence (1h, 24h, 72h), exit-intent popup, retargeting pixel setup,
SMS recovery (with consent), and a dashboard to track recovery rate and revenue recovered.
```

## 8. Inventory Management System
```
/pro:squad ecommerce catalog Build an inventory management system for a multi-warehouse
e-commerce operation (3 warehouses + 2 retail stores). Need: real-time stock tracking,
stock reservation on checkout, automatic reorder alerts, stock transfer between locations,
inventory count workflow, and dead stock reports. Must prevent overselling.
```

## 9. Product Recommendation Engine
```
/pro:squad ecommerce shelf Build a product recommendation system with:
- "Frequently bought together" (order history-based)
- "You might also like" (browsing history + similar products)
- "Trending now" (recent sales velocity)
- "Recently viewed" (session-based)
- Personalized homepage based on user segment
Track click-through and conversion rates per recommendation type.
```

## 10. E-commerce Analytics Dashboard
```
/pro:squad ecommerce convert Build a real-time e-commerce analytics dashboard covering:
- Revenue (hourly/daily/weekly/monthly with comparison)
- Conversion funnel with drop-off analysis
- Top products by revenue, units, and conversion rate
- Cart abandonment rate with recovery metrics
- Traffic sources with conversion attribution
- Customer RFM segmentation
- Product performance matrix (high view/low purchase flagging)
- Inventory health (stock levels, turnover rate, dead stock)
```
