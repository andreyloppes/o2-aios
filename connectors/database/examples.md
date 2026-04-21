# Database Connector — Example Prompts

Practical prompts combining Database MCP (SQLite/PostgreSQL) with Claude Master agents.

---

## 1. Schema Analysis with Data Engineer

```
/agents:data-engineer List all tables in my PostgreSQL database.
For each table, show: column count, row count, indexes,
and foreign key relationships. Generate an ER diagram description
in Mermaid format.
```

## 2. Performance Audit with Architect

```
/agents:architect Run EXPLAIN ANALYZE on the top 5 slowest queries
from our application logs. Identify missing indexes,
inefficient joins, and sequential scans on large tables.
Recommend specific index creation statements.
```

## 3. Data Quality Check with QA

```
/agents:qa Run data quality checks on the users table:
- Find duplicate emails
- Find rows with NULL required fields
- Check for invalid date ranges (created_at > updated_at)
- Verify referential integrity with the orders table
Report all issues found with counts and example rows.
```

## 4. Migration Script with Data Engineer

```
/agents:data-engineer I need to add a "status" enum column to the orders table
with values: pending, processing, shipped, delivered, cancelled.
Generate a migration script that: adds the column, backfills existing rows
based on the current boolean "is_completed" field, and adds an index.
```

## 5. Analytics Query with Analyst

```
/agents:analyst Query the database for user engagement metrics:
- Daily active users for the last 30 days
- Average session duration by user segment
- Feature usage frequency (from the events table)
- Cohort retention rates (week 1, week 4, week 12)
Present results as formatted tables.
```

## 6. Backup Verification with DevOps

```
/agents:devops Connect to the SQLite database backup from yesterday.
Compare table counts and schemas with the current production database.
Report any discrepancies: missing tables, schema differences,
or significant row count changes (>5% difference).
```

## 7. User Report with PM

```
/agents:pm Query the database for a customer health report:
- Total registered users and growth rate
- Users active in last 7 days vs 30 days vs 90 days
- Top features used (from activity logs)
- Users approaching plan limits
Format as a product review dashboard.
```

## 8. Security Audit with Architect

```
/agents:architect Audit the database for security concerns:
- Tables with sensitive data (email, phone, payment info) without encryption markers
- Users with superuser/admin privileges
- Tables missing audit columns (created_at, updated_at, deleted_at)
- Foreign keys without ON DELETE constraints
Generate a security findings report with remediation steps.
```

## 9. Data Export for Reporting

```
/agents:data-engineer Query the orders table joined with customers and products.
Export the last quarter's data as a denormalized view with columns:
order_id, order_date, customer_name, customer_email, product_name,
quantity, unit_price, total, status.
Create a materialized view for future reporting.
```

## 10. Local SQLite Development Database

```
/agents:dev Create a SQLite development database with seed data:
- users table: 50 sample users with realistic data
- products table: 20 products with categories and prices
- orders table: 200 orders linked to users and products
- Generate realistic timestamps spanning the last 6 months
Use INSERT statements, not just CREATE TABLE.
```
