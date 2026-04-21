#!/bin/bash
# ==============================================================================
# Slack & Discord MCP Connector — Setup Script
# ==============================================================================
# Installs and configures Slack and/or Discord MCP servers for Claude Code.
#
# Prerequisites:
#   - Node.js 18+ and npm
#   - Slack Bot Token (xoxb-...) and/or Discord Bot Token
#
# Usage:
#   ./setup.sh                                    # Interactive setup
#   SLACK_BOT_TOKEN=xoxb-xxx ./setup.sh           # Slack only
#   DISCORD_BOT_TOKEN=xxx ./setup.sh              # Discord only
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_JSON="${HOME}/.claude.json"

# --- Colors -------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $*"; }

header() {
    echo ""
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Slack & Discord MCP Connector — Setup${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# --- Preflight Checks --------------------------------------------------------

check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v node &>/dev/null; then
        log_error "Node.js is required. Install with: brew install node"
        exit 1
    fi

    local node_version
    node_version=$(node -v | sed 's/v//' | cut -d. -f1)
    if [[ "$node_version" -lt 18 ]]; then
        log_error "Node.js 18+ required. Current: $(node -v)"
        exit 1
    fi
    log_ok "Node.js $(node -v)"

    if ! command -v jq &>/dev/null; then
        log_error "jq is required. Install with: brew install jq"
        exit 1
    fi
    log_ok "jq available"
}

# --- Platform Selection -------------------------------------------------------

SETUP_SLACK=false
SETUP_DISCORD=false

select_platforms() {
    # Auto-detect from environment
    if [[ -n "${SLACK_BOT_TOKEN:-}" ]]; then
        SETUP_SLACK=true
    fi
    if [[ -n "${DISCORD_BOT_TOKEN:-}" ]]; then
        SETUP_DISCORD=true
    fi

    # If nothing in env, ask interactively
    if [[ "$SETUP_SLACK" == "false" && "$SETUP_DISCORD" == "false" ]]; then
        echo "Which platforms do you want to configure?"
        echo ""
        echo "  1) Slack only"
        echo "  2) Discord only"
        echo "  3) Both Slack and Discord"
        echo ""
        read -rp "Choice [1/2/3]: " choice

        case "$choice" in
            1) SETUP_SLACK=true ;;
            2) SETUP_DISCORD=true ;;
            3) SETUP_SLACK=true; SETUP_DISCORD=true ;;
            *) log_error "Invalid choice"; exit 1 ;;
        esac
    fi
}

# --- Slack Setup --------------------------------------------------------------

setup_slack() {
    echo ""
    echo -e "${CYAN}--- Slack Configuration ---${NC}"

    if [[ -z "${SLACK_BOT_TOKEN:-}" ]]; then
        echo ""
        echo "A Slack Bot Token is required."
        echo "Steps to create one:"
        echo "  1. Go to https://api.slack.com/apps"
        echo "  2. Create a new app (or use existing)"
        echo "  3. Go to OAuth & Permissions"
        echo "  4. Add scopes: channels:read, chat:write, users:read, channels:history"
        echo "  5. Install to workspace and copy the Bot User OAuth Token (xoxb-...)"
        echo ""
        read -rp "Slack Bot Token (xoxb-...): " SLACK_BOT_TOKEN
    fi

    if [[ -z "$SLACK_BOT_TOKEN" ]]; then
        log_error "Slack token cannot be empty"
        return 1
    fi

    if [[ ! "$SLACK_BOT_TOKEN" =~ ^xoxb- ]]; then
        log_warn "Token does not start with 'xoxb-' — may not be a valid bot token"
    fi

    # Optional team ID
    local slack_team_id="${SLACK_TEAM_ID:-}"
    if [[ -z "$slack_team_id" ]]; then
        read -rp "Slack Team/Workspace ID (optional, press Enter to skip): " slack_team_id
    fi

    log_info "Verifying MCP package: slack-mcp-server..."
    if npm view "slack-mcp-server" version &>/dev/null 2>&1; then
        local pkg_version
        pkg_version=$(npm view "slack-mcp-server" version 2>/dev/null)
        log_ok "Package slack-mcp-server@$pkg_version found on npm"
    else
        log_error "Package slack-mcp-server not found on npm registry"
        log_error "Check https://www.npmjs.com/package/slack-mcp-server"
        exit 1
    fi

    # Build config
    local mcp_config
    if [[ -n "$slack_team_id" ]]; then
        mcp_config=$(jq -n \
            --arg token "$SLACK_BOT_TOKEN" \
            --arg team "$slack_team_id" \
            '{
                command: "npx",
                args: ["-y", "slack-mcp-server"],
                env: {
                    SLACK_BOT_TOKEN: $token,
                    SLACK_TEAM_ID: $team
                }
            }')
    else
        mcp_config=$(jq -n \
            --arg token "$SLACK_BOT_TOKEN" \
            '{
                command: "npx",
                args: ["-y", "slack-mcp-server"],
                env: {
                    SLACK_BOT_TOKEN: $token
                }
            }')
    fi

    # Inject into claude.json
    local tmp_file
    tmp_file=$(mktemp)

    jq --argjson config "$mcp_config" '
        .mcpServers //= {} |
        .mcpServers["slack"] = $config
    ' "$CLAUDE_JSON" > "$tmp_file"

    mv "$tmp_file" "$CLAUDE_JSON"
    chmod 600 "$CLAUDE_JSON"
    log_ok "MCP server 'slack' added to $CLAUDE_JSON"
    log_info "Set file permissions to 600 on $CLAUDE_JSON"

    # Test
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
        "https://slack.com/api/auth.test" 2>/dev/null || echo "000")

    if [[ "$response" == "200" ]]; then
        log_ok "Slack API connection successful"
    else
        log_warn "Could not verify Slack token (HTTP $response). Config saved anyway."
    fi
}

# --- Discord Setup ------------------------------------------------------------

setup_discord() {
    echo ""
    echo -e "${CYAN}--- Discord Configuration ---${NC}"

    if [[ -z "${DISCORD_BOT_TOKEN:-}" ]]; then
        echo ""
        echo "A Discord Bot Token is required."
        echo "Steps to create one:"
        echo "  1. Go to https://discord.com/developers/applications"
        echo "  2. Create a new application"
        echo "  3. Go to Bot section and create a bot"
        echo "  4. Copy the bot token"
        echo "  5. Enable required Privileged Gateway Intents"
        echo "  6. Invite bot to your server with appropriate permissions"
        echo ""
        read -rp "Discord Bot Token: " DISCORD_BOT_TOKEN
    fi

    if [[ -z "$DISCORD_BOT_TOKEN" ]]; then
        log_error "Discord token cannot be empty"
        return 1
    fi

    log_info "Verifying MCP package: discord-mcp..."
    if npm view "discord-mcp" version &>/dev/null 2>&1; then
        local pkg_version
        pkg_version=$(npm view "discord-mcp" version 2>/dev/null)
        log_ok "Package discord-mcp@$pkg_version found on npm"
    else
        log_error "Package discord-mcp not found on npm registry"
        log_error "Check https://www.npmjs.com/package/discord-mcp"
        exit 1
    fi

    local mcp_config
    mcp_config=$(jq -n \
        --arg token "$DISCORD_BOT_TOKEN" \
        '{
            command: "npx",
            args: ["-y", "discord-mcp"],
            env: {
                DISCORD_BOT_TOKEN: $token
            }
        }')

    local tmp_file
    tmp_file=$(mktemp)

    jq --argjson config "$mcp_config" '
        .mcpServers //= {} |
        .mcpServers["discord"] = $config
    ' "$CLAUDE_JSON" > "$tmp_file"

    mv "$tmp_file" "$CLAUDE_JSON"
    chmod 600 "$CLAUDE_JSON"
    log_ok "MCP server 'discord' added to $CLAUDE_JSON"
    log_info "Set file permissions to 600 on $CLAUDE_JSON"
}

# --- Summary ------------------------------------------------------------------

print_summary() {
    echo ""
    log_ok "Messaging connector(s) configured!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart Claude Code to load the MCP server(s)"

    if [[ "$SETUP_SLACK" == "true" ]]; then
        echo "  2. Invite the Slack bot to channels it should access"
        echo "     Try: 'Send a message to #general saying hello'"
    fi

    if [[ "$SETUP_DISCORD" == "true" ]]; then
        echo "  2. Ensure the Discord bot has channel permissions"
        echo "     Try: 'List all channels in my Discord server'"
    fi
    echo ""
}

# --- Main ---------------------------------------------------------------------

main() {
    header
    check_prerequisites

    if [[ ! -f "$CLAUDE_JSON" ]]; then
        echo '{}' > "$CLAUDE_JSON"
        log_info "Created $CLAUDE_JSON"
    fi

    select_platforms

    if [[ "$SETUP_SLACK" == "true" ]]; then
        setup_slack
    fi

    if [[ "$SETUP_DISCORD" == "true" ]]; then
        setup_discord
    fi

    print_summary
}

main "$@"
