#!/usr/bin/env bash
# O2-AIOS dev — sobe engine + dashboard apontados pro workspace
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUN="${BUN:-$HOME/.bun/bin/bun}"

# Mata processos antigos se estiverem nas portas
for port in 4002 5173; do
  pid=$(lsof -ti:"$port" 2>/dev/null || true)
  [ -n "$pid" ] && { echo "▶ matando PID $pid em :$port"; kill "$pid" 2>/dev/null || true; }
done
sleep 1

# Engine em background
echo "▶ engine → http://localhost:4002"
cd "$ROOT/engine"
AIOS_PROJECT_ROOT="$ROOT" "$BUN" src/index.ts > /tmp/o2-engine.log 2>&1 &
ENGINE_PID=$!
echo "  pid=$ENGINE_PID log=/tmp/o2-engine.log"

# Dashboard em foreground
echo "▶ dashboard → http://localhost:5173"
cd "$ROOT/dashboard"
"$BUN" run dev
