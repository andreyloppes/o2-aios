# Stripe Connector — Example Prompts

Practical prompts combining Stripe MCP with Claude Master agents.

---

## 1. Revenue Report with Analyst

```
/agents:analyst Query Stripe for all payments from the last 30 days.
Calculate total revenue, average transaction value, and top 10 customers
by spend. Break down revenue by product/price and identify growth trends.
```

## 2. Subscription Health with PM

```
/agents:pm List all active subscriptions in Stripe. Group them by plan
(monthly/yearly). Calculate MRR, annual run rate, and identify
subscriptions expiring in the next 30 days. Flag any past-due subscriptions.
```

## 3. Churn Analysis with Analyst

```
/agents:analyst Query Stripe for all canceled subscriptions in the last
90 days. Analyze churn rate by: month, plan type, and customer lifetime.
Calculate average customer lifetime value (LTV) and revenue impact of churn.
```

## 4. Invoice Reconciliation with Data Engineer

```
/agents:data-engineer List all unpaid invoices in Stripe older than 30 days.
Cross-reference with our database to identify discrepancies.
Generate a reconciliation report showing: invoice ID, customer, amount,
days overdue, and last payment attempt status.
```

## 5. Customer Onboarding Check with PM

```
/agents:pm Query Stripe for customers created in the last 7 days.
For each new customer, check: do they have an active subscription?
Have they made a payment? What plan did they choose?
Create a "New Customer Onboarding" summary report.
```

## 6. Pricing Analysis

```
/agents:analyst List all products and prices in Stripe.
Analyze the pricing structure: number of plans, price points,
billing intervals. Compare monthly vs yearly conversion rates.
Suggest pricing optimizations based on the data.
```

## 7. Failed Payment Recovery with DevOps

```
/agents:devops Query Stripe for all failed payment attempts in the last week.
Group failures by error code (card_declined, insufficient_funds, etc.).
Calculate the total revenue at risk and identify customers with
repeated failures that need manual outreach.
```

## 8. Financial Dashboard Data

```
/agents:analyst Pull from Stripe: total revenue (MTD), total customers,
active subscriptions, net new MRR, churn MRR, average revenue per user (ARPU).
Format as a JSON dashboard payload I can use in our reporting tool.
```

## 9. Refund Analysis with QA

```
/agents:qa Query Stripe for all refunds in the last 60 days.
Analyze: total refund amount, refund rate, most common refund reasons,
products with highest refund rates. Flag any anomalies
(e.g., sudden spike in refunds for a specific product).
```

## 10. Cost Tracking for SaaS Metrics

```
/agents:analyst Query Stripe for the complete financial picture:
gross revenue, refunds, disputes, and net revenue for the last 3 months.
Calculate key SaaS metrics: gross margin, net revenue retention,
quick ratio (new MRR + expansion MRR / churned MRR + contraction MRR).
```
