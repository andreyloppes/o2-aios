# Slack & Discord MCP Connector

Connect Claude Code to Slack and/or Discord for messaging, channel management, and team communication directly from your terminal.

## What It Does

### Slack
- **Send messages** to channels and users
- **Read** channel history and threads
- **List** channels, users, and workspaces
- **Search** messages across the workspace
- **React** to messages with emojis
- **Upload** files to channels

### Discord
- **Send messages** to channels
- **Read** channel history
- **List** servers, channels, and members
- **Manage** channels and permissions

## Prerequisites

1. **Node.js 18+** — `brew install node`
2. **jq** — `brew install jq`
3. **Slack Bot Token** and/or **Discord Bot Token**

### Creating a Slack Bot

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"** > "From scratch"
3. Name it (e.g., "Claude Code Bot")
4. Go to **OAuth & Permissions** and add scopes:
   - `channels:read`, `channels:history`
   - `chat:write`, `chat:write.public`
   - `users:read`, `reactions:write`
   - `files:write` (optional, for uploads)
5. Click **"Install to Workspace"**
6. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
7. Invite the bot to channels: `/invite @Claude Code Bot`

### Creating a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a **New Application**
3. Go to **Bot** section and click "Add Bot"
4. Enable **Privileged Gateway Intents**:
   - Message Content Intent
   - Server Members Intent
5. Copy the **Bot Token**
6. Generate an invite URL (OAuth2 > URL Generator):
   - Scopes: `bot`
   - Permissions: Send Messages, Read Message History, etc.
7. Open the invite URL to add the bot to your server

## Setup

### Quick Setup

```bash
# Slack only
SLACK_BOT_TOKEN=xoxb-your-token ./setup.sh

# Discord only
DISCORD_BOT_TOKEN=your-token ./setup.sh

# Both
SLACK_BOT_TOKEN=xoxb-xxx DISCORD_BOT_TOKEN=yyy ./setup.sh
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
    "slack": {
      "command": "npx",
      "args": ["-y", "slack-mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "T0123456789"
      }
    },
    "discord": {
      "command": "npx",
      "args": ["-y", "discord-mcp"],
      "env": {
        "DISCORD_BOT_TOKEN": "your-discord-bot-token"
      }
    }
  }
}
```

## Usage

After setup, restart Claude Code.

```
> Send "Deploy complete!" to #deployments on Slack
> Read the last 20 messages from #general
> List all channels in my Slack workspace
> Send a summary of today's work to my Discord #dev-log channel
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "not_in_channel" | Invite the bot to the channel with `/invite` |
| "invalid_auth" | Check your bot token in `~/.claude.json` |
| "missing_scope" | Add required OAuth scopes and reinstall the app |
| Discord "Missing Permissions" | Check bot role permissions in server settings |

## Security Notes

- Bot tokens grant access to all channels the bot is invited to
- Use separate bots for development and production
- Never commit tokens to version control
- Regularly audit which channels the bot can access
