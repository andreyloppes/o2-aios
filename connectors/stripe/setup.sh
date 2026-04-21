#!/bin/bash
# ==============================================================================
# Stripe MCP Connector — Setup Script
# ==============================================================================
# Installs and configures the Stripe MCP server for Claude Code.
#
# Prerequisites:
#   - Node.js 18+ and npm
#   - Stripe Secret Key (sk_test_... or sk_live_...)
#
# Usage:
#   ./setup.sh                                       # Interactive setup
#   STRIPE_SECRET_KEY=sk_test_xxx ./setup.sh         # Non-interactive
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONNECTOR_NAME="stripe"
MCP_PACKAGE="@stripe/mcp"
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
    echo -e "${BLUE}  Stripe MCP Connector — Setup${NC}"
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
    if [[ -n "${STRIPE_SECRET_KEY:-}" ]]; then
        log_ok "Using STRIPE_SECRET_KEY from environment"
    else
        echo ""
        echo "A Stripe Secret Key is required."
        echo "Steps to get one:"
        echo "  1. Go to https://dashboard.stripe.com/apikeys"
        echo "  2. Copy your Secret Key"
        echo "  3. For testing, use a test key (sk_test_...)"
        echo "  4. For production, use a live key (sk_live_...)"
        echo ""
        echo -e "${YELLOW}WARNING: Use test keys for development. Live keys access real data!${NC}"
        echo ""
        read -rp "Stripe Secret Key (sk_...): " STRIPE_SECRET_KEY
    fi

    if [[ -z "$STRIPE_SECRET_KEY" ]]; then
        log_error "API key cannot be empty"
        exit 1
    fi

    if [[ "$STRIPE_SECRET_KEY" =~ ^sk_live_ ]]; then
        echo ""
        echo -e "${RED}WARNING: You are using a LIVE Stripe key!${NC}"
        echo -e "${RED}This will access real customer and payment data.${NC}"
        read -rp "Are you sure you want to continue? [y/N] " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            log_info "Aborted. Use a test key (sk_test_...) for development."
            exit 0
        fi
    elif [[ "$STRIPE_SECRET_KEY" =~ ^sk_test_ ]]; then
        log_ok "Using test mode key (safe for development)"
    elif [[ ! "$STRIPE_SECRET_KEY" =~ ^sk_ ]]; then
        log_warn "Key does not start with 'sk_' — may not be a valid Stripe secret key"
        read -rp "Continue anyway? [y/N] " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            exit 1
        fi
    fi

    log_ok "Stripe key accepted"
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
        --arg key "$STRIPE_SECRET_KEY" \
        '{
            command: "npx",
            args: ["-y", "@stripe/mcp"],
            env: {
                STRIPE_SECRET_KEY: $key
            }
        }')

    local tmp_file
    tmp_file=$(mktemp)

    jq --argjson config "$mcp_config" '
        .mcpServers //= {} |
        .mcpServers["stripe"] = $config
    ' "$CLAUDE_JSON" > "$tmp_file"

    mv "$tmp_file" "$CLAUDE_JSON"
    chmod 600 "$CLAUDE_JSON"
    log_ok "MCP server 'stripe' added to $CLAUDE_JSON"
    log_info "Set file permissions to 600 on $CLAUDE_JSON"
}

# --- Test Connection ----------------------------------------------------------

test_connection() {
    log_info "Testing connection to Stripe API..."

    local response
    response=$(curl -s -w "\n%{http_code}" \
        -u "$STRIPE_SECRET_KEY:" \
        "https://api.stripe.com/v1/balance" 2>/dev/null)

    local http_code
    http_code=$(echo "$response" | tail -1)
    local body
    body=$(echo "$response" | head -n -1)

    if [[ "$http_code" == "200" ]]; then
        log_ok "Stripe API connection successful!"

        # Show balance for confirmation
        local currency amount
        currency=$(echo "$body" | jq -r '.available[0].currency // "usd"' 2>/dev/null)
        amount=$(echo "$body" | jq -r '.available[0].amount // 0' 2>/dev/null)
        local formatted_amount
        formatted_amount=$(python3 -c "print(f'{int(${amount:-0})/100:.2f}')" 2>/dev/null || echo "0.00")
        log_info "Account balance: ${formatted_amount} ${currency^^}"
    elif [[ "$http_code" == "401" ]]; then
        log_error "Invalid API key (401 Unauthorized)"
        return 1
    else
        log_warn "Stripe API returned HTTP $http_code. Config saved; verify key manually."
    fi

    echo ""
    log_ok "Stripe connector is configured!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart Claude Code to load the MCP server"
    echo "  2. Try: 'Show me the last 10 Stripe payments'"
    echo "  3. Try: 'List all active subscriptions'"
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
