# Stripe MCP Connector

Connect Claude Code to Stripe for querying payments, customers, subscriptions, and financial data directly from your terminal.

## What It Does

This connector enables Claude Code to:

- **Query** payments, charges, and refunds
- **List** customers and their payment history
- **View** subscriptions and recurring revenue
- **Read** invoices and line items
- **Check** account balance and payouts
- **Analyze** revenue trends and metrics
- **Search** across Stripe objects

## Prerequisites

1. **Node.js 18+** — `brew install node`
2. **jq** — `brew install jq`
3. **Stripe Secret Key** (test or live)

### Getting Your Stripe Key

1. Go to [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
2. For development: Copy the **Secret key** from Test mode (starts with `sk_test_`)
3. For production: Copy the **Secret key** from Live mode (starts with `sk_live_`)

**Always start with test mode keys for development.**

## Setup

### Quick Setup (Non-interactive)

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here ./setup.sh
```

### Interactive Setup

```bash
./setup.sh
```

The script will:
1. Verify prerequisites
2. Ask for the Stripe secret key
3. Warn if using a live key
4. Add the MCP server config to `~/.claude.json`
5. Test the connection by fetching account balance

## Manual Configuration

Add to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_key_here"
      }
    }
  }
}
```

## Usage

After setup, restart Claude Code. Stripe tools will be available automatically.

```
> Show me the last 10 payments
> List all customers who signed up this month
> What is the total revenue for January 2026?
> Show all active subscriptions with their MRR
> Find the invoice for customer cus_xxxxx
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API Key" | Verify the key in `~/.claude.json` starts with `sk_` |
| "No such customer" | Check the customer ID format (cus_xxx) |
| Rate limited | Stripe has generous limits; wait and retry |
| Test data empty | Create test data in the Stripe Dashboard or use Stripe CLI |

## Security Notes

- **NEVER use live keys in development** — always start with `sk_test_`
- Live keys access real customer payment data
- Restrict key permissions using Stripe's restricted keys feature
- Never commit keys to version control
- Rotate keys regularly via the Stripe Dashboard
- Consider using read-only restricted keys for analytics use cases
