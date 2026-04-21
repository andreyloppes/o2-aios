# Product Data Schema Template

## Overview
Complete data model for e-commerce product catalog including products, variants, inventory, categories, and related entities.

---

## Entity Relationship Diagram

```
Products ──1:N──> Variants ──1:N──> Inventory Levels
    │                 │                    │
    │                 └── N:1 ── Locations ─┘
    │
    ├──1:N──> Product Images
    ├──1:N──> Product Options ──1:N──> Option Values
    ├──N:M──> Categories
    ├──N:M──> Collections
    └──N:1──> Brands

Orders ──1:N──> Order Items ──N:1──> Variants
  │
  ├──1:1──> Shipping Info
  ├──1:1──> Payment Info
  └──N:1──> Customers
```

---

## Core Entities

### Product
The logical product item.

```typescript
interface Product {
  id: string;                    // UUID
  slug: string;                  // URL-friendly identifier (unique)
  name: string;                  // Product name (max 500 chars)
  description: string;           // Rich text/HTML description
  descriptionPlain: string;      // Plain text for search indexing
  brandId?: string;              // Reference to Brand
  productType: 'physical' | 'digital' | 'service' | 'gift_card' | 'bundle';
  status: 'draft' | 'active' | 'archived';
  tags: string[];                // Searchable tags
  vendor?: string;               // Supplier/vendor name

  // SEO
  seoTitle?: string;             // Max 70 chars
  seoDescription?: string;       // Max 160 chars
  seoHandle?: string;            // Custom URL slug

  // Metadata
  metadata: Record<string, any>; // Flexible custom attributes
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
```

### Variant
A specific purchasable version of a product.

```typescript
interface Variant {
  id: string;                    // UUID
  productId: string;             // Parent product reference
  sku: string;                   // Stock Keeping Unit (unique)
  barcode?: string;              // UPC/EAN/ISBN
  title: string;                 // Generated: "Blue / Medium"

  // Pricing (all in smallest currency unit, e.g., centavos)
  priceCents: number;            // Current selling price
  compareAtPriceCents?: number;  // Original/comparison price
  costCents?: number;            // Cost of goods (for margin calc)
  currency: string;              // ISO 4217 (BRL, USD)

  // Physical attributes (for shipping)
  weightGrams?: number;          // Weight in grams
  length?: number;               // cm
  width?: number;                // cm
  height?: number;               // cm

  // Options
  option1?: string;              // First option value (e.g., "Blue")
  option2?: string;              // Second option value (e.g., "Medium")
  option3?: string;              // Third option value (e.g., "Cotton")

  // State
  isActive: boolean;
  requiresShipping: boolean;
  isTaxable: boolean;
  taxCode?: string;              // Tax classification code
  imageId?: string;              // Variant-specific image
  position: number;              // Display order

  createdAt: string;
  updatedAt: string;
}
```

### Inventory Level
Stock tracking per variant per location.

```typescript
interface InventoryLevel {
  id: string;
  variantId: string;             // Reference to Variant
  locationId: string;            // Reference to Location

  available: number;             // Units available for sale (>= 0)
  reserved: number;              // Units reserved in active carts/orders (>= 0)
  committed: number;             // Units in confirmed orders awaiting fulfillment
  onHand: number;                // Total physical stock (available + reserved + committed)

  safetyStock: number;           // Minimum reserve (not available for sale)
  lowStockThreshold: number;     // Alert when available <= this value
  allowBackorder: boolean;       // Allow purchase when out of stock

  updatedAt: string;
}
```

### Category
Hierarchical product categorization.

```typescript
interface Category {
  id: string;
  parentId?: string;             // Parent category (null for root)
  slug: string;                  // URL-friendly identifier
  name: string;
  description?: string;
  imageUrl?: string;
  position: number;              // Display order within parent
  depth: number;                 // Nesting level (0 for root)
  path: string;                  // Materialized path: "fashion/men/tops"
  isActive: boolean;
  productCount: number;          // Cached count of products
}
```

### Product Image
```typescript
interface ProductImage {
  id: string;
  productId: string;
  url: string;                   // CDN URL
  altText: string;               // SEO and accessibility
  width: number;
  height: number;
  position: number;              // Display order (0 = primary)
  variants: {                    // Responsive image variants
    thumbnail: string;           // 150x150
    small: string;               // 300x300
    medium: string;              // 600x600
    large: string;               // 1200x1200
    zoom: string;                // 2400x2400
  };
}
```

---

## Pricing & Discounts

### Price Rule
```typescript
interface PriceRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number;                 // Percentage (10 = 10%) or cents
  targetType: 'all' | 'product' | 'collection' | 'customer_group';
  targetIds: string[];           // IDs of targeted entities
  minimumRequirement?: {
    type: 'amount' | 'quantity';
    value: number;               // Minimum cart amount (cents) or quantity
  };
  usageLimit?: number;           // Max total uses
  usageLimitPerCustomer?: number;
  startsAt: string;
  endsAt?: string;
  isActive: boolean;
}

interface DiscountCode {
  id: string;
  code: string;                  // "VERAO20" (unique, uppercase)
  priceRuleId: string;
  usageCount: number;
  isActive: boolean;
}
```

### Installment Pricing (Brazil)
```typescript
interface InstallmentPlan {
  installments: number;          // 1-12
  installmentAmount: number;     // Per-installment amount (cents)
  totalAmount: number;           // Total with interest (cents)
  interestRate: number;          // Monthly interest rate (0 for interest-free)
  isInterestFree: boolean;
}

// Example: R$ 120,00 in 3x sem juros = 3 x R$ 40,00
// Example: R$ 120,00 in 6x com juros = 6 x R$ 22,50 (total R$ 135,00)
```

---

## Search Index Schema

### Product Search Document
```typescript
interface ProductSearchDocument {
  id: string;
  name: string;
  description: string;          // Plain text
  brand: string;
  category: string[];           // Full hierarchy: ["Fashion", "Men", "Tops"]
  tags: string[];
  priceMin: number;             // Lowest variant price (for range filter)
  priceMax: number;             // Highest variant price
  inStock: boolean;             // Any variant in stock
  rating: number;               // Average rating
  reviewCount: number;
  salesCount: number;           // For popularity sort
  createdAt: number;            // Timestamp for recency sort
  imageUrl: string;             // Primary image thumbnail

  // Filterable attributes
  colors: string[];             // All available colors
  sizes: string[];              // All available sizes
  materials: string[];          // If applicable

  // Facets
  _tags: string[];              // For faceted search
}
```

---

## Data Import Format

### Product CSV Import
```csv
handle,title,body_html,vendor,type,tags,published,option1_name,option1_value,option2_name,option2_value,variant_sku,variant_price,variant_compare_at_price,variant_weight,variant_inventory_qty,image_src,image_alt
classic-tee,"Classic T-Shirt","<p>100% cotton</p>",BrandX,Apparel,"cotton,basics",true,Color,Blue,Size,M,BX-TEE-BLU-M,8990,12990,250,100,https://cdn.example.com/tee-blue.jpg,"Blue Classic T-Shirt"
```

### Required Fields for Import
| Field | Required | Notes |
|-------|----------|-------|
| handle (slug) | Yes | URL-friendly, unique |
| title | Yes | Product name |
| variant_sku | Yes | Unique SKU |
| variant_price | Yes | In centavos (8990 = R$89.90) |
| variant_inventory_qty | Yes | Initial stock quantity |
| image_src | Yes (1+) | At least one product image |
| image_alt | Yes | Alt text for accessibility |

---

## Validation Rules

| Entity | Rule | Error Message |
|--------|------|---------------|
| Product | slug must be unique | "Product URL already exists" |
| Variant | SKU must be unique globally | "SKU already in use" |
| Variant | price must be > 0 | "Price must be greater than zero" |
| Variant | compare_at_price must be > price (if set) | "Compare-at price must be higher than selling price" |
| Inventory | available cannot be negative | "Insufficient stock" |
| Category | slug must be unique | "Category URL already exists" |
| Category | max depth of 4 | "Category nesting too deep" |
| Discount | code must be unique (case-insensitive) | "Discount code already exists" |
| Image | at least 1 image per product | "At least one product image required" |
