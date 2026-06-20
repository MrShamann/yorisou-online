# Yorisou Automation Foundation

## Overview

This document describes the automation infrastructure for the Yorisou repo.
The goal is a safe, incremental foundation that can later integrate with OpenClaw, Hermes, Telegram, and external schedulers — without connecting production credentials or activating autonomous actions prematurely.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 / React 19 / Tailwind v4 |
| Deployment | AWS Amplify |
| Data persistence | AWS S3 + local filesystem fallback |
| Automation targets | OpenClaw, Hermes, Telegram (future) |

## Local Commands

| Command | What it does |
|---|---|
| `npm run check:yorisou` | Full project health check (node, deps, env, lint, tsc) |
| `npm run check:env` | Env var audit — informational, never prints secret values |
| `npm run lint` | ESLint |
| `npm run build` | Next.js production build |
| `npm run test:smoke` | Playwright browser smoke tests (requires running dev server) |
| `npm run test:smoke:headed` | Same, with visible browser |
| `npm run smoke:openclaw` | Ping OpenClaw webhook — skips if OPENCLAW_WEBHOOK_URL not set |
| `npm run smoke:hermes` | Ping Hermes webhook — skips if HERMES_WEBHOOK_URL not set |
| `npm run verify:automation` | Run check:env + smoke:openclaw + smoke:hermes in sequence |

## Required Env Vars (production)

```
YORISOU_SHARED_STORE_BUCKET   # S3 bucket name
YORISOU_SHARED_STORE_REGION   # default: us-east-2
AWS_ACCESS_KEY_ID             # if not using Amplify IAM role
AWS_SECRET_ACCESS_KEY         # if not using Amplify IAM role
```

## Optional / Integration Env Vars

```
# OpenClaw
OPENCLAW_VOICE_BASE_URL
OPENCLAW_VOICE_TOKEN
OPENCLAW_ARTIFACT_READ_TOKEN
OPENCLAW_WEBHOOK_URL          # future webhook integration
OPENCLAW_WEBHOOK_TOKEN

# Hermes
HERMES_WEBHOOK_URL            # future webhook integration
HERMES_WEBHOOK_TOKEN

# Telegram
TELEGRAM_BOT_TOKEN            # operator notifications / approvals
TELEGRAM_CHAT_ID

# AI
OPENAI_API_KEY
MISTRAL_API_KEY
```

## Verification Status

| Check | Result | Notes |
|---|---|---|
| `npm run lint` | ✔ passes | 9 pre-existing warnings, 0 errors |
| `npm run build` | ✔ passes | Requires build stabilization fixes — see `fix: stabilize Yorisou Next.js 16 build on iCloud Drive` commit |
| `npm run check:env` | ✔ passes | Informational — reports missing vars, does not fail |
| `npm run smoke:openclaw` | ✔ skips cleanly | URL not set → no request sent, exits 0 |
| `npm run smoke:hermes` | ✔ skips cleanly | URL not set → no request sent, exits 0 |
| `npm run test:smoke` | ⚠ intermittent locally | See caveat below |

### Local iCloud Drive Caveat

This repo lives inside `~/Documents` which is synced by iCloud Drive. During local development, intermittent 500 errors can occur on cold page loads because:

1. The local data store (`data/phase1-*.json`) is read during server-side rendering
2. On a cold webpack compile, iCloud Drive file I/O can race with JSON reads, producing `SyntaxError: Unexpected end of JSON input`
3. Turbopack's PostCSS subprocess can also time out on complex arbitrary CSS values in this environment

**These are not smoke-test logic bugs.** The smoke tests correctly detect real errors. In production and in CI (AWS Amplify), the S3 data store is used and no local JSON files are involved, so these failures do not apply.

**For reliable local smoke verification:** Use the webpack dev server (`npm run dev:webpack`) rather than the default Turbopack, and re-run if a route returns 500 on first cold compile.

**For reliable CI smoke verification:** Use a non-iCloud working directory (e.g. `/tmp` or a repo checked out outside `~/Documents`).

## Running Smoke Tests

Browser smoke tests require a running dev server:

```bash
# Use webpack dev server to avoid Turbopack CSS parse issues on iCloud Drive
npm run dev:webpack   # terminal 1
npm run test:smoke    # terminal 2
```

Or against a deployed URL (most reliable):

```bash
PLAYWRIGHT_BASE_URL=https://your-deployment.amplifyapp.com npm run test:smoke
```

## GitHub Actions

The workflow at `.github/workflows/yorisou-check.yml` runs on push/PR to main:

1. **check** job — always runs: install, lint, tsc, env check, build
2. **smoke-openclaw** job — runs only when `OPENCLAW_SMOKE_ENABLED=true` repo variable is set
3. **smoke-hermes** job — runs only when `HERMES_SMOKE_ENABLED=true` repo variable is set

To enable webhook smoke in CI:
1. Add repository variable `OPENCLAW_SMOKE_ENABLED=true` in GitHub Settings → Variables
2. Add repository secrets `OPENCLAW_WEBHOOK_URL` and `OPENCLAW_WEBHOOK_TOKEN`

## Automation Architecture (Target State)

```
External trigger (scheduler / GitHub Action / manual)
  │
  ▼
Yorisou automation script (scripts/)
  │
  ├─► OpenClaw webhook  →  OpenClaw processes task
  │                          │
  │                          └─► Telegram: result notification
  │
  └─► Hermes webhook   →  Hermes processes task
                            │
                            └─► Telegram: approval request
                                  │
                                  └─► Human approves → action executes
```

Yorisou owns the trigger layer. OpenClaw and Hermes own their own runtimes.
Destructive or external-facing actions require Telegram approval before execution.

## Files Added

```
scripts/yorisou-check.sh              # one-command project health check
scripts/yorisou-env-check.mjs         # env var audit
scripts/openclaw-webhook-smoke.mjs    # OpenClaw ping smoke test
scripts/hermes-webhook-smoke.mjs      # Hermes ping smoke test
tests/smoke/yorisou-smoke.spec.ts     # Playwright browser smoke tests
playwright.config.ts                  # Playwright config
.github/workflows/yorisou-check.yml  # CI workflow
docs/YORISOU_AUTOMATION.md           # this file
docs/OPENCLAW_HERMES_INTEGRATION.md  # integration architecture doc
```
