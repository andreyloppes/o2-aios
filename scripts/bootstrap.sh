#!/usr/bin/env bash
# O2-AIOS bootstrap — instala deps do engine e do dashboard
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Detecta bun
BUN="${BUN:-$HOME/.bun/bin/bun}"
if [ ! -x "$BUN" ]; then
  BUN="$(command -v bun 2>/dev/null || true)"
fi
if [ -z "$BUN" ]; then
  echo "❌ bun não encontrado. Instale com: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

echo "▶ bun: $BUN"
echo "▶ root: $ROOT"

echo "━━━ engine deps ━━━"
cd "$ROOT/engine" && "$BUN" install

echo "━━━ dashboard deps ━━━"
cd "$ROOT/dashboard" && "$BUN" install

echo "✓ bootstrap completo. Rode ./scripts/dev.sh pra subir tudo."
