#!/bin/bash
# ==============================================================================
# Google Sheets MCP Connector — Setup Script
# ==============================================================================
# Installs and configures the Google Sheets MCP server for Claude Code.
#
# Prerequisites:
#   - Node.js 18+ and npm
#   - Google Cloud service account with Sheets API enabled
#   - Service account JSON key file
#
# Usage:
#   ./setup.sh                              # Interactive setup
#   GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/key.json ./setup.sh  # Non-interactive
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONNECTOR_NAME="google-sheets"
MCP_PACKAGE="mcp-google-sheets"
CLAUDE_JSON="${HOME}/.claude.json"

# --- Colors (inline for standalone use) ---------------------------------------
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
    echo -e "${BLUE}  Google Sheets MCP Connector — Setup${NC}"
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

    if ! command -v npx &>/dev/null; then
        log_error "npx is required (comes with npm)"
        exit 1
    fi
    log_ok "npx available"

    if ! command -v jq &>/dev/null; then
        log_error "jq is required. Install with: brew install jq"
        exit 1
    fi
    log_ok "jq available"
}

# --- Service Account Key ------------------------------------------------------

resolve_service_account_key() {
    if [[ -n "${GOOGLE_SERVICE_ACCOUNT_KEY:-}" ]]; then
        if [[ ! -f "$GOOGLE_SERVICE_ACCOUNT_KEY" ]]; then
            log_error "Service account key file not found: $GOOGLE_SERVICE_ACCOUNT_KEY"
            exit 1
        fi
        log_ok "Using service account key: $GOOGLE_SERVICE_ACCOUNT_KEY"
        return
    fi

    echo ""
    echo "A Google Cloud service account key (JSON) is required."
    echo "Steps to create one:"
    echo "  1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts"
    echo "  2. Create a service account (or use existing)"
    echo "  3. Create a JSON key and download it"
    echo "  4. Enable Google Sheets API in your project"
    echo "  5. Share your spreadsheets with the service account email"
    echo ""

    read -rp "Path to service account JSON key: " GOOGLE_SERVICE_ACCOUNT_KEY

    if [[ ! -f "$GOOGLE_SERVICE_ACCOUNT_KEY" ]]; then
        log_error "File not found: $GOOGLE_SERVICE_ACCOUNT_KEY"
        exit 1
    fi

    # Validate it's a valid service account JSON
    if ! jq -e '.type == "service_account"' "$GOOGLE_SERVICE_ACCOUNT_KEY" &>/dev/null; then
        log_warn "File does not appear to be a Google service account key"
        read -rp "Continue anyway? [y/N] " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            exit 1
        fi
    fi

    # Convert to absolute path
    GOOGLE_SERVICE_ACCOUNT_KEY="$(cd "$(dirname "$GOOGLE_SERVICE_ACCOUNT_KEY")" && pwd)/$(basename "$GOOGLE_SERVICE_ACCOUNT_KEY")"
    log_ok "Service account key: $GOOGLE_SERVICE_ACCOUNT_KEY"
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

    # Create claude.json if it doesn't exist
    if [[ ! -f "$CLAUDE_JSON" ]]; then
        echo '{}' > "$CLAUDE_JSON"
        log_info "Created $CLAUDE_JSON"
    fi

    # Build the MCP server config
    local mcp_config
    mcp_config=$(jq -n \
        --arg key "$GOOGLE_SERVICE_ACCOUNT_KEY" \
        '{
            command: "npx",
            args: ["-y", "mcp-google-sheets"],
            env: {
                GOOGLE_SERVICE_ACCOUNT_KEY: $key
            }
        }')

    # Inject into claude.json under mcpServers
    local tmp_file
    tmp_file=$(mktemp)

    jq --argjson config "$mcp_config" '
        .mcpServers //= {} |
        .mcpServers["google-sheets"] = $config
    ' "$CLAUDE_JSON" > "$tmp_file"

    mv "$tmp_file" "$CLAUDE_JSON"
    chmod 600 "$CLAUDE_JSON"
    log_ok "MCP server 'google-sheets' added to $CLAUDE_JSON"
    log_info "Set file permissions to 600 on $CLAUDE_JSON"
}

# --- Test Connection ----------------------------------------------------------

test_connection() {
    log_info "Testing connection..."

    # Verify the config is in claude.json
    local configured
    configured=$(jq -r '.mcpServers["google-sheets"].command // empty' "$CLAUDE_JSON" 2>/dev/null)

    if [[ "$configured" == "npx" ]]; then
        log_ok "Configuration verified in $CLAUDE_JSON"
    else
        log_error "Configuration not found in $CLAUDE_JSON"
        return 1
    fi

    # Verify the service account key is readable
    if [[ -f "$GOOGLE_SERVICE_ACCOUNT_KEY" ]]; then
        local email
        email=$(jq -r '.client_email // empty' "$GOOGLE_SERVICE_ACCOUNT_KEY" 2>/dev/null)
        if [[ -n "$email" ]]; then
            log_ok "Service account: $email"
        fi
    fi

    echo ""
    log_ok "Google Sheets connector is configured!"
    echo ""
    echo "Next steps:"
    echo "  1. Share your Google Sheets with the service account email"
    echo "  2. Restart Claude Code to load the MCP server"
    echo "  3. Try: 'Read the data from my Google Sheet [SHEET_URL]'"
    echo ""
}

# --- Main ---------------------------------------------------------------------

main() {
    header
    check_prerequisites
    resolve_service_account_key
    install_mcp_package
    inject_config
    test_connection
}

main "$@"
