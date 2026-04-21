# Database MCP Connector

Connect Claude Code to SQLite and PostgreSQL databases for querying, analyzing, and managing data directly from your terminal.

## What It Does

### SQLite
- **Query** local SQLite databases with full SQL support
- **Read** table schemas and metadata
- **Insert/Update/Delete** records
- **Create** tables and indexes
- **Analyze** data with aggregations and joins

### PostgreSQL
- **Query** remote or local PostgreSQL databases
- **Read** schemas, tables, views, and functions
- **Execute** complex SQL with CTEs and window functions
- **Inspect** indexes, constraints, and relationships
- **Analyze** performance with EXPLAIN plans

## Prerequisites

1. **Node.js 18+** — `brew install node`
2. **jq** — `brew install jq`
3. **SQLite database file** and/or **PostgreSQL connection URL**

### For SQLite
- Just need a `.db` or `.sqlite` file path
- If the file does not exist, it will be created

### For PostgreSQL
- A running PostgreSQL server (local or remote)
- Connection URL format: `postgresql://user:password@host:port/database`
- Optional: `psql` CLI for connection testing (`brew install postgresql`)

## Setup

### Quick Setup

```bash
# SQLite
SQLITE_DB_PATH=/path/to/database.db ./setup.sh

# PostgreSQL
DATABASE_URL=postgresql://postgres:secret@localhost:5432/mydb ./setup.sh

# Both
SQLITE_DB_PATH=/path/to/db.sqlite DATABASE_URL=postgresql://... ./setup.sh
```

### Interactive Setup

```bash
./setup.sh
```

## Manual Configuration

Add to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "mcp-sqlite"],
      "env": {
        "SQLITE_DB_PATH": "/absolute/path/to/database.db"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "mcp-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname"
      }
    }
  }
}
```

## Usage

After setup, restart Claude Code. Database tools will be available automatically.

```
> Show all tables in my database
> Query: SELECT * FROM users WHERE created_at > '2026-01-01' LIMIT 20
> What is the schema for the orders table?
> Show me the top 10 customers by total order value
> Create an index on users(email)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Database not found" (SQLite) | Check the file path is absolute and correct |
| "Connection refused" (Postgres) | Verify PostgreSQL is running and accepting connections |
| "Authentication failed" | Check username/password in DATABASE_URL |
| "Permission denied" | Ensure the database user has required privileges |
| "SSL required" | Append `?sslmode=require` to DATABASE_URL |

## Security Notes

- **Never use production database credentials in development**
- Consider using read-only database users for analytics
- PostgreSQL: Use SSL connections for remote databases
- SQLite: The database file should have appropriate file permissions
- Never commit connection URLs with passwords to version control
- For PostgreSQL, consider using `.pgpass` file or environment variables
