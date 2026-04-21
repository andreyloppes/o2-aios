# Notion MCP Connector

Connect Claude Code to Notion for reading, creating, and managing pages and databases directly from your terminal.

## What It Does

This connector enables Claude Code to:

- **Read** pages, blocks, and database entries
- **Create** new pages and database entries
- **Update** existing pages and properties
- **Search** across your workspace
- **Query** databases with filters and sorts
- **Manage** page content (text, headings, lists, code blocks)

## Prerequisites

1. **Node.js 18+** — `brew install node`
2. **jq** — `brew install jq`
3. **Notion Integration API Key**

### Creating a Notion Integration

1. Go to [My Integrations](https://www.notion.so/my-integrations)
2. Click **"New integration"**
3. Name it (e.g., "Claude Code")
4. Select your workspace
5. Set capabilities:
   - Read content
   - Update content
   - Insert content
6. Copy the **Internal Integration Secret** (starts with `ntn_`)
7. **Share pages** with the integration:
   - Open a page in Notion
   - Click "..." menu > "Add connections" > Select your integration

## Setup

### Quick Setup (Non-interactive)

```bash
NOTION_API_KEY=ntn_xxxxxxxxxxxxx ./setup.sh
```

### Interactive Setup

```bash
./setup.sh
```

The script will:
1. Verify prerequisites
2. Ask for the API key
3. Validate the key against Notion API
4. Add the MCP server config to `~/.claude.json`
5. Confirm the connection

## Manual Configuration

Add this to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "ntn_your_key_here"
      }
    }
  }
}
```

## Usage

After setup, restart Claude Code. Notion tools will be available automatically.

```
> Search my Notion workspace for pages about "Q4 Planning"
> Create a new page in my "Projects" database with title "Claude Master PRO"
> Read the content of page [PAGE_URL]
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Object not found" | Share the page/database with the integration |
| "Unauthorized" | Check your API key in `~/.claude.json` |
| "Rate limited" | Wait a moment and retry (Notion has rate limits) |
| MCP server not loading | Restart Claude Code after setup |

## Security Notes

- The API key grants access to all pages shared with the integration
- Only share necessary pages with the integration
- Rotate the key periodically via Notion's integration settings
- Never commit the API key to version control
