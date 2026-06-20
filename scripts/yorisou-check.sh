#!/usr/bin/env bash
# Yorisou one-command project health check.
# Runs non-destructive checks: env, lint, build, and optional smoke test.
# Does not call AWS, OpenClaw, Hermes, or Telegram.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✔${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC}  $1"; }
fail() { echo -e "${RED}✘${NC} $1"; }

echo ""
echo "═══════════════════════════════════════"
echo "  Yorisou Project Check"
echo "═══════════════════════════════════════"
echo ""

# --- Node / npm ---
echo "▸ Runtime"
node_ver=$(node --version 2>/dev/null) && pass "node $node_ver" || fail "node not found"
npm_ver=$(npm --version 2>/dev/null) && pass "npm $npm_ver" || fail "npm not found"
echo ""

# --- Dependencies ---
echo "▸ Dependencies"
if [ -d node_modules ]; then
  pass "node_modules present"
else
  warn "node_modules missing — run: npm ci"
fi
echo ""

# --- Env check ---
echo "▸ Environment"
node --input-type=module <<'EOF'
import { createRequire } from 'module';
const required = [
  'YORISOU_SHARED_STORE_BUCKET',
  'YORISOU_SHARED_STORE_REGION',
];
const optional = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'LINE_CHANNEL_ID',
  'LINE_CHANNEL_SECRET',
  'RESEND_API_KEY',
  'OPENAI_API_KEY',
  'OPENCLAW_VOICE_BASE_URL',
  'OPENCLAW_VOICE_TOKEN',
  'OPENCLAW_ARTIFACT_READ_TOKEN',
  'OPENCLAW_WEBHOOK_URL',
  'OPENCLAW_WEBHOOK_TOKEN',
  'HERMES_WEBHOOK_URL',
  'HERMES_WEBHOOK_TOKEN',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
];
let missingRequired = 0;
for (const k of required) {
  if (process.env[k]) {
    console.log(`  \x1b[32m✔\x1b[0m ${k}`);
  } else {
    console.log(`  \x1b[33m⚠\x1b[0m  ${k} — not set (required for production)`);
    missingRequired++;
  }
}
for (const k of optional) {
  if (process.env[k]) {
    console.log(`  \x1b[32m✔\x1b[0m ${k}`);
  } else {
    console.log(`  \x1b[90m○\x1b[0m  ${k} — not set (optional)`);
  }
}
if (missingRequired > 0) {
  console.log(`\n  ${missingRequired} required var(s) unset — S3 store will use local fallback.`);
}
EOF
echo ""

# --- TypeScript ---
echo "▸ TypeScript"
if npx tsc --noEmit 2>&1 | tail -5; then
  pass "tsc clean"
else
  warn "tsc reported issues (see above)"
fi
echo ""

# --- Lint ---
echo "▸ Lint"
if npm run lint --silent 2>&1 | tail -5; then
  pass "lint clean"
else
  warn "lint reported issues"
fi
echo ""

echo "═══════════════════════════════════════"
echo "  Check complete."
echo "  Run 'npm run test:smoke' for browser smoke tests."
echo "  Run 'npm run smoke:openclaw' to test OpenClaw webhook (requires OPENCLAW_WEBHOOK_URL)."
echo "═══════════════════════════════════════"
echo ""
