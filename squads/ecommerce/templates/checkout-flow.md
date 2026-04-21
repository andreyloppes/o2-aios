# Checkout Flow Specification

## Overview
Complete checkout flow specification covering customer information, shipping, payment, and order confirmation.

---

## Checkout Stages

```
Cart → [Guest/Login] → Information → Shipping → Payment → Confirmation
```

---

## Stage 1: Cart Review

### Entry Points
- "Proceed to Checkout" button on cart page
- "Checkout" button on cart drawer
- Express checkout buttons (Apple Pay, Google Pay, PayPal) — skip to payment

### Cart Summary (Persistent Sidebar)
| Element | Description |
|---------|-------------|
| Item List | Product image, name, variant, quantity, unit price, line total |
| Subtotal | Sum of all line items |
| Discount | Applied coupon/discount (show code + amount) |
| Shipping | "Calculated at next step" or estimated if known |
| Tax | "Calculated at next step" or estimated |
| Total | Grand total (update dynamically) |
| Promo Code | Input field with "Apply" button |

### Validation Before Proceeding
- [ ] All items are in stock (check real-time inventory)
- [ ] Cart is not empty
- [ ] All item prices are current (re-validate against catalog)
- [ ] Coupon code is still valid (not expired, usage limit not reached)

---

## Stage 2: Customer Information

### Guest vs. Registered
- Default: Guest checkout (email only)
- Option: "Already have an account? Log in" link
- Post-purchase: "Create account to track your order" (optional)

### Fields
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Email | email | Yes | Valid email format, real-time validation |
| First Name | text | Yes | 2-50 characters |
| Last Name | text | Yes | 2-50 characters |
| Phone | tel | Yes (Brazil) | Valid phone format with country code |
| CPF | text | Yes (Brazil) | Valid CPF with check digit (11 digits) |
| Newsletter Opt-in | checkbox | No | Unchecked by default (LGPD) |

### Shipping Address
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| CEP (ZIP) | text | Yes | 8 digits, auto-fill address via ViaCEP API |
| Street | text | Yes | Auto-filled from CEP |
| Number | text | Yes | Numeric |
| Complement | text | No | Apartment, suite, etc. |
| Neighborhood | text | Yes | Auto-filled from CEP |
| City | text | Yes | Auto-filled from CEP |
| State | select | Yes | Auto-filled from CEP |
| Country | select | Yes | Default: Brazil |

### CEP Auto-Fill Flow
```
User enters CEP → API call to ViaCEP → Auto-fill street, neighborhood, city, state
                                      → User fills number + complement
                                      → Proceed to shipping
```

### Billing Address
- Default: "Same as shipping address" (checked)
- Option to enter different billing address

---

## Stage 3: Shipping Method

### Shipping Rate Calculation
```
Input: destination CEP + cart items (weight, dimensions)
  → Carrier API (Correios, Jadlog, etc.)
  → Return: available methods with price and delivery estimate
```

### Display Format
| Method | Example | Fields |
|--------|---------|--------|
| Standard | PAC - Correios | R$ 15,90 - 5 to 8 business days |
| Express | SEDEX - Correios | R$ 29,90 - 2 to 3 business days |
| Same Day | Motoboy (local) | R$ 12,00 - Today by 6PM |
| Free | Free Shipping | R$ 0,00 - 7 to 10 business days |
| Pickup | Store Pickup | Free - Available in 2 hours |

### Free Shipping Logic
```
if (subtotal >= FREE_SHIPPING_THRESHOLD) {
  add free shipping option as first choice;
  show "Free shipping!" badge;
} else {
  show "Add R$ X more for free shipping" in cart;
}
```

### Validation
- [ ] At least one shipping method available for the destination
- [ ] Shipping method selected before proceeding
- [ ] Items comply with carrier restrictions (weight, dimensions, prohibited items)

---

## Stage 4: Payment

### Payment Methods

#### Credit/Debit Card (Stripe Elements)
| Element | Description |
|---------|-------------|
| Card Number | Stripe CardNumber Element with real-time validation |
| Expiry | Stripe CardExpiry Element |
| CVC | Stripe CardCvc Element |
| Card Holder Name | Text input |
| Installments | Select: 1x to 12x (calculate with/without interest) |

**Flow:**
```
1. Create PaymentIntent server-side (amount, currency: BRL)
2. Render Stripe Elements
3. User fills card details
4. stripe.confirmCardPayment(clientSecret)
5. Handle 3D Secure if required
6. Webhook: payment_intent.succeeded → create order
```

#### Pix
| Element | Description |
|---------|-------------|
| QR Code | Generated QR code image (256x256px) |
| Copy/Paste | "Pix Copia e Cola" string with copy button |
| Timer | Expiration countdown (30 minutes default) |
| Status | Real-time polling for payment confirmation |

**Flow:**
```
1. Create PaymentIntent with payment_method_types: ['pix']
2. Display QR code and copy-paste code
3. Start countdown timer (30 minutes)
4. Poll for payment status every 5 seconds
5. On confirmation → redirect to order confirmation
6. On expiration → show "Expired" with option to generate new code
```

#### Boleto Bancario
| Element | Description |
|---------|-------------|
| Boleto | PDF/image of the boleto slip |
| Barcode | Barcode number for manual payment |
| Copy Button | Copy barcode number |
| Deadline | 3 business days to pay |
| Instructions | How to pay via bank app or lottery house |

**Flow:**
```
1. Create PaymentIntent with payment_method_types: ['boleto']
2. Generate boleto (PDF + barcode)
3. Show boleto with instructions
4. Send boleto via email
5. Order status: "Awaiting Payment"
6. Webhook on payment → confirm order
7. If not paid by deadline → cancel order, release inventory
```

#### PayPal
**Flow:**
```
1. Render PayPal Smart Button
2. User clicks → PayPal popup
3. User authenticates and confirms
4. Callback with paymentId
5. Capture payment server-side
6. Create order
```

### Express Checkout (Apple Pay / Google Pay)
Available on product page and cart (skip to payment):
```
1. Check Payment Request API availability
2. Show Apple Pay / Google Pay button
3. User authenticates with biometrics
4. Payment confirmed → create order with address from wallet
```

### Payment Validation
- [ ] Total amount matches cart total (prevent tampering)
- [ ] Currency is correct
- [ ] Idempotency key included on payment request
- [ ] 3D Secure handled for card payments
- [ ] Fraud check passed (Stripe Radar)

---

## Stage 5: Order Confirmation

### Confirmation Page
| Element | Description |
|---------|-------------|
| Order Number | "ORD-2026-00123" with copy button |
| Status | "Order confirmed" with checkmark |
| Items | Summary of purchased items |
| Totals | Subtotal, shipping, tax, discount, total |
| Shipping | Selected method + estimated delivery date |
| Payment | Method used (last 4 digits for card) |
| Tracking | "We'll email you when your order ships" |
| CTA | "Continue Shopping" + "Create Account" (if guest) |

### Confirmation Email
| Section | Content |
|---------|---------|
| Header | Store logo + "Order Confirmed" |
| Order Number | Clickable link to order status page |
| Items | Product images + names + quantities + prices |
| Totals | Subtotal, shipping, tax, discount, total |
| Shipping | Address + method + estimated delivery |
| Payment | Method summary |
| Support | Contact information + FAQ link |
| Footer | Return policy + unsubscribe |

### Post-Order Actions (Server-Side)
```
1. Create order record in database
2. Decrement inventory (available - quantity, committed + quantity)
3. Send confirmation email
4. Trigger analytics events (GA4: purchase, Meta: Purchase)
5. Clear cart
6. Start abandoned review email timer (7 days post-delivery)
7. If Pix/Boleto: start payment expiration monitor
```

---

## Error Handling

| Error | User Message | Action |
|-------|-------------|--------|
| Payment declined | "Payment was declined. Please try another method." | Show payment form again |
| Card requires 3DS | (Handled by Stripe automatically) | Show 3DS modal |
| Insufficient stock | "Sorry, [item] is no longer available in this quantity." | Update cart, re-check |
| Pix expired | "Your Pix code has expired. Generate a new one?" | Offer to regenerate |
| Boleto expired | "Payment deadline passed. Please place a new order." | Redirect to cart |
| Network error | "Connection issue. Your payment was not charged. Please try again." | Retry button |
| Shipping unavailable | "Delivery is not available to this address." | Suggest alternatives |

---

## Security Checklist

- [ ] All checkout pages served over HTTPS
- [ ] No card data touches server (Stripe.js only)
- [ ] CSRF protection on all checkout endpoints
- [ ] Rate limiting on checkout API (prevent brute force)
- [ ] Idempotency keys on all payment API calls
- [ ] Server-side total validation (never trust client-side totals)
- [ ] Order amount verified against cart at payment time
- [ ] Fraud detection enabled (Stripe Radar)
- [ ] Address verification (AVS) enabled
- [ ] CVC verification required
