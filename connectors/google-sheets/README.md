# Google Sheets MCP Connector

Connect Claude Code to Google Sheets for reading, writing, and managing spreadsheet data directly from your terminal.

## What It Does

This connector enables Claude Code to:

- **Read** spreadsheet data (cells, ranges, entire sheets)
- **Write** data to cells and ranges
- **Create** new spreadsheets and sheets
- **Format** cells (bold, colors, borders)
- **Query** data using structured filters
- **Append** rows to existing sheets

## Prerequisites

1. **Node.js 18+** — `brew install node`
2. **jq** — `brew install jq`
3. **Google Cloud Service Account** with Sheets API enabled

### Creating a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable the **Google Sheets API**:
   - Go to APIs & Services > Library
   - Search for "Google Sheets API" and enable it
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Create a service account
   - Create a JSON key and download it
5. **Share your spreadsheets** with the service account email (found in the JSON key file as `client_email`)

## Setup

### Quick Setup (Non-interactive)

```bash
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json ./setup.sh
```

### Interactive Setup

```bash
./setup.sh
```

The script will:
1. Verify prerequisites (Node.js, jq)
2. Ask for the service account key path
3. Validate the key file
4. Add the MCP server config to `~/.claude.json`
5. Test the configuration

## Manual Configuration

Add this to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "npx",
      "args": ["-y", "mcp-google-sheets"],
      "env": {
        "GOOGLE_SERVICE_ACCOUNT_KEY": "/absolute/path/to/service-account.json"
      }
    }
  }
}
```

## Usage

After setup, restart Claude Code. The Google Sheets tools will be available automatically.

```
> Read the data from sheet "Sales Q4" in spreadsheet [SPREADSHEET_ID]
> Add a new row with today's date, "Acme Corp", and $5000 to the Sales sheet
> Create a new spreadsheet called "Weekly Report"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Permission denied" | Share the spreadsheet with the service account email |
| "API not enabled" | Enable Google Sheets API in Google Cloud Console |
| "Invalid credentials" | Check the service account JSON key path |
| MCP server not loading | Restart Claude Code after setup |

## Security Notes

- The service account key file contains sensitive credentials
- Never commit the key file to version control
- Use test/dev spreadsheets during initial setup
- Consider restricting the service account's API access scope
