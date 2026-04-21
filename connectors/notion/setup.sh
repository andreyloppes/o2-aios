#!/bin/bash
# ==============================================================================
# Notion MCP Connector — Setup Script
# ==============================================================================
# Installs and configures the Notion MCP server for Claude Code.
#
# Prerequisites:
#   - Node.js 18+ and npm
#   - Notion integration API key
#
# Usage:
#   ./setup.sh                                    # Interactive setup
#   NOTION_API_KEY=ntn_xxxxx ./setup.sh           # Non-interactive
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONNECTOR_NAME="notion"
MCP_PACKAGE="@notionhq/notion-mcp-server"
CLAUDE_JSON="${HOME}/.claude.json"

# --- Colors -------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $*"; }

header() {
    echo ""
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Notion MCP Connector — Setup${NC}"
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

# --- API Key ------------------------------------------------------------------

resolve_api_key() {
    if [[ -n "${NOTION_API_KEY:-}" ]]; then
        log_ok "Using NOTION_API_KEY from environment"
        return
    fi

    echo ""
    echo "A Notion Internal Integration API key is required."
    echo "Steps to create one:"
    echo "  1. Go to https://www.notion.so/my-integrations"
    echo "  2. Click 'New integration'"
    echo "  3. Name it (e.g., 'Claude Code') and select your workspace"
    echo "  4. Copy the 'Internal Integration Secret' (starts with ntn_)"
    echo "  5. Share the pages/databases you want to access with the integration"
    echo ""

    read -rp "Notion API Key (ntn_...): " NOTION_API_KEY

    if [[ -z "$NOTION_API_KEY" ]]; then
        log_error "API key cannot be empty"
        exit 1
    fi

    if [[ ! "$NOTION_API_KEY" =~ ^ntn_ ]] && [[ ! "$NOTION_API_KEY" =~ ^secret_ ]]; then
        log_warn "Key does not start with 'ntn_' — this may not be a valid Notion API key"
        read -rp "Continue anyway? [y/N] " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            exit 1
        fi
    fi

    log_ok "API key accepted"
}

# --- Install MCP Package -----------------------------------------------------

install_mcp_package() {
    log_info "Verifying MCP package: $MCP_PACKAGE..."

    if npm view "$MCP_PACKAGE" version &>/dev/null 2>&1; then
        local pkg_version
        pkg_version=$(npm view "$MCP_PACKAGE" version 2>/dev/null)
        log_ok "Package $MCP_PACKAGE@$pkg_version found on npm"
    else
        log_error "Package $MCP_PACKAGE not found on npm registry"
        log_error "Check https://www.npmjs.com/package/$MCP_PACKAGE"
        exit 1
    fi
}

# --- Inject Config into claude.json ------------------------------------------

inject_config() {
    log_info "Configuring MCP server in $CLAUDE_JSON..."

    if [[ ! -f "$CLAUDE_JSON" ]]; then
        echo '{}' > "$CLAUDE_JSON"
        log_info "Created $CLAUDE_JSON"
    fi

    local mcp_config
    mcp_config=$(jq -n \
        --arg key "$NOTION_API_KEY" \
        '{
            command: "npx",
            args: ["-y", "@notionhq/notion-mcp-server"],
            env: {
                NOTION_API_KEY: $key
            }
        }')

    local tmp_file
    tmp_file=$(mktemp)

    jq --argjson config "$mcp_config" '
        .mcpServers //= {} |
        .mcpServers["notion"] = $config
    ' "$CLAUDE_JSON" > "$tmp_file"

    mv "$tmp_file" "$CLAUDE_JSON"
    chmod 600 "$CLAUDE_JSON"
    log_ok "MCP server 'notion' added to $CLAUDE_JSON"
    log_info "Set file permissions to 600 on $CLAUDE_JSON"
}

# --- Test Connection ----------------------------------------------------------

test_connection() {
    log_info "Testing connection..."

    local configured
    configured=$(jq -r '.mcpServers["notion"].command // empty' "$CLAUDE_JSON" 2>/dev/null)

    if [[ "$configured" == "npx" ]]; then
        log_ok "Configuration verified in $CLAUDE_JSON"
    else
        log_error "Configuration not found in $CLAUDE_JSON"
        return 1
    fi

    # Quick API validation
    log_info "Validating API key with Notion API..."
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $NOTION_API_KEY" \
        -H "Notion-Version: 2022-06-28" \
        "https://api.notion.com/v1/users/me" 2>/dev/null || echo "000")

    if [[ "$response" == "200" ]]; then
        log_ok "API key is valid — connection successful!"
    elif [[ "$response" == "401" ]]; then
        log_error "API key is invalid (401 Unauthorized)"
        log_error "Please check your Notion integration secret"
        return 1
    elif [[ "$response" == "000" ]]; then
        log_warn "Could not reach Notion API (network issue?). Config saved anyway."
    else
        log_warn "Notion API returned HTTP $response. Config saved; verify key manually."
    fi

    echo ""
    log_ok "Notion connector is configured!"
    echo ""
    echo "Next steps:"
    echo "  1. Share your Notion pages/databases with the integration"
    echo "  2. Restart Claude Code to load the MCP server"
    echo "  3. Try: 'List all pages in my Notion workspace'"
    echo ""
}

# --- Main ---------------------------------------------------------------------

main() {
    header
    check_prerequisites
    resolve_api_key
    install_mcp_package
    inject_config
    test_connection
}

main "$@"
