#!/bin/bash
# ==============================================================================
# Database MCP Connector — Setup Script
# ==============================================================================
# Installs and configures SQLite and/or PostgreSQL MCP servers for Claude Code.
#
# Prerequisites:
#   - Node.js 18+ and npm
#   - SQLite database file path OR PostgreSQL connection URL
#
# Usage:
#   ./setup.sh                                                     # Interactive
#   SQLITE_DB_PATH=/path/to/db.sqlite ./setup.sh                   # SQLite
#   DATABASE_URL=postgresql://user:pass@host:5432/db ./setup.sh    # PostgreSQL
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
    echo -e "${BLUE}  Database MCP Connector — Setup${NC}"
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

# --- Database Selection -------------------------------------------------------

SETUP_SQLITE=false
SETUP_POSTGRES=false

select_database() {
    # Auto-detect from environment
    if [[ -n "${SQLITE_DB_PATH:-}" ]]; then
        SETUP_SQLITE=true
    fi
    if [[ -n "${DATABASE_URL:-}" ]]; then
        SETUP_POSTGRES=true
    fi

    if [[ "$SETUP_SQLITE" == "false" && "$SETUP_POSTGRES" == "false" ]]; then
        echo "Which database(s) do you want to configure?"
        echo ""
        echo "  1) SQLite (local file database)"
        echo "  2) PostgreSQL (remote/local server)"
        echo "  3) Both SQLite and PostgreSQL"
        echo ""
        read -rp "Choice [1/2/3]: " choice

        case "$choice" in
            1) SETUP_SQLITE=true ;;
            2) SETUP_POSTGRES=true ;;
            3) SETUP_SQLITE=true; SETUP_POSTGRES=true ;;
            *) log_error "Invalid choice"; exit 1 ;;
        esac
    fi
}

# --- SQLite Setup -------------------------------------------------------------

setup_sqlite() {
    echo ""
    echo -e "${CYAN}--- SQLite Configuration ---${NC}"

    if [[ -z "${SQLITE_DB_PATH:-}" ]]; then
        echo ""
        echo "Enter the path to your SQLite database file."
        echo "If the file does not exist, it will be created on first use."
        echo ""
        read -rp "SQLite database path: " SQLITE_DB_PATH
    fi

    if [[ -z "$SQLITE_DB_PATH" ]]; then
        log_error "Database path cannot be empty"
        return 1
    fi

    # Convert to absolute path
    if [[ "$SQLITE_DB_PATH" != /* ]]; then
        SQLITE_DB_PATH="$(pwd)/$SQLITE_DB_PATH"
    fi

    # Check if the parent directory exists
    local parent_dir
    parent_dir=$(dirname "$SQLITE_DB_PATH")
    if [[ ! -d "$parent_dir" ]]; then
        log_error "Parent directory does not exist: $parent_dir"
        return 1
    fi

    if [[ -f "$SQLITE_DB_PATH" ]]; then
        local size
        size=$(ls -lh "$SQLITE_DB_PATH" | awk '{print $5}')
        log_ok "Database found: $SQLITE_DB_PATH ($size)"
    else
        log_info "Database will be created: $SQLITE_DB_PATH"
    fi

    log_info "Verifying MCP package: mcp-sqlite..."
    if npm view "mcp-sqlite" version &>/dev/null 2>&1; then
        local pkg_version
        pkg_version=$(npm view "mcp-sqlite" version 2>/dev/null)
        log_ok "Package mcp-sqlite@$pkg_version found on npm"
    else
        log_error "Package mcp-sqlite not found on npm registry"
        log_error "Check https://www.npmjs.com/package/mcp-sqlite"
        exit 1
    fi

    local mcp_config
    mcp_config=$(jq -n \
        --arg path "$SQLITE_DB_PATH" \
        '{
            command: "npx",
            args: ["-y", "mcp-sqlite"],
            env: {
                SQLITE_DB_PATH: $path
            }
        }')

    local tmp_file
    tmp_file=$(mktemp)

    jq --argjson config "$mcp_config" '
        .mcpServers //= {} |
        .mcpServers["sqlite"] = $config
    ' "$CLAUDE_JSON" > "$tmp_file"

    mv "$tmp_file" "$CLAUDE_JSON"
    chmod 600 "$CLAUDE_JSON"
    log_ok "MCP server 'sqlite' added to $CLAUDE_JSON"
    log_info "Set file permissions to 600 on $CLAUDE_JSON"

    # Test with sqlite3 if available
    if command -v sqlite3 &>/dev/null && [[ -f "$SQLITE_DB_PATH" ]]; then
        local table_count
        table_count=$(sqlite3 "$SQLITE_DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null || echo "?")
        log_info "Database has $table_count table(s)"
    fi
}

# --- PostgreSQL Setup ---------------------------------------------------------

setup_postgres() {
    echo ""
    echo -e "${CYAN}--- PostgreSQL Configuration ---${NC}"

    if [[ -z "${DATABASE_URL:-}" ]]; then
        echo ""
        echo "Enter your PostgreSQL connection URL."
        echo "Format: postgresql://user:password@host:port/database"
        echo ""
        echo "Examples:"
        echo "  postgresql://postgres:secret@localhost:5432/mydb"
        echo "  postgresql://user:pass@db.example.com:5432/production"
        echo ""
        read -rp "DATABASE_URL: " DATABASE_URL
    fi

    if [[ -z "$DATABASE_URL" ]]; then
        log_error "Database URL cannot be empty"
        return 1
    fi

    if [[ ! "$DATABASE_URL" =~ ^postgres(ql)?:// ]]; then
        log_warn "URL does not start with postgresql:// — may not be valid"
        read -rp "Continue anyway? [y/N] " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            return 1
        fi
    fi

    log_info "Verifying MCP package: mcp-postgres..."
    if npm view "mcp-postgres" version &>/dev/null 2>&1; then
        local pkg_version
        pkg_version=$(npm view "mcp-postgres" version 2>/dev/null)
        log_ok "Package mcp-postgres@$pkg_version found on npm"
    else
        log_error "Package mcp-postgres not found on npm registry"
        log_error "Check https://www.npmjs.com/package/mcp-postgres"
        exit 1
    fi

    local mcp_config
    mcp_config=$(jq -n \
        --arg url "$DATABASE_URL" \
        '{
            command: "npx",
            args: ["-y", "mcp-postgres"],
            env: {
                DATABASE_URL: $url
            }
        }')

    local tmp_file
    tmp_file=$(mktemp)

    jq --argjson config "$mcp_config" '
        .mcpServers //= {} |
        .mcpServers["postgres"] = $config
    ' "$CLAUDE_JSON" > "$tmp_file"

    mv "$tmp_file" "$CLAUDE_JSON"
    chmod 600 "$CLAUDE_JSON"
    log_ok "MCP server 'postgres' added to $CLAUDE_JSON"
    log_info "Set file permissions to 600 on $CLAUDE_JSON"

    # Test connection with psql if available
    if command -v psql &>/dev/null; then
        log_info "Testing PostgreSQL connection..."
        if psql "$DATABASE_URL" -c "SELECT 1;" &>/dev/null 2>&1; then
            log_ok "PostgreSQL connection successful!"
        else
            log_warn "Could not connect with psql. Config saved; verify URL manually."
        fi
    else
        log_info "psql not found — skipping connection test. Config saved."
    fi
}

# --- Summary ------------------------------------------------------------------

print_summary() {
    echo ""
    log_ok "Database connector(s) configured!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart Claude Code to load the MCP server(s)"

    if [[ "$SETUP_SQLITE" == "true" ]]; then
        echo "  2. Try: 'Show all tables in my SQLite database'"
        echo "     Try: 'Query SELECT * FROM users LIMIT 10'"
    fi

    if [[ "$SETUP_POSTGRES" == "true" ]]; then
        echo "  2. Try: 'List all tables in my PostgreSQL database'"
        echo "     Try: 'Show the schema for the users table'"
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

    select_database

    if [[ "$SETUP_SQLITE" == "true" ]]; then
        setup_sqlite
    fi

    if [[ "$SETUP_POSTGRES" == "true" ]]; then
        setup_postgres
    fi

    print_summary
}

main "$@"
