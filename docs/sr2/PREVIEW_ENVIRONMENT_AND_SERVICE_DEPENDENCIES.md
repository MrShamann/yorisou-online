# SR-2 — Preview Environment & Service Dependencies

Records, per external dependency, its status in this environment and its launch
implication (§10). SR-2 may use local/isolated non-production backends and
deterministic contract adapters, but **may not** touch production secrets,
production migrations, production user data, or production LINE/email channels.

## This environment (machine-verified)
- `supabase` CLI: **present** (2.106.0).
- Docker: **NOT installed / not running** → `supabase start` (local Supabase
  stack) **cannot run here**. No isolated Preview/staging Supabase is connected
  (no `.env` / `.env.local` in the repo).
- Account store: a **file-based** JSON store (`lib/mvpAccountStorage.ts`) with a
  local-file/tmp fallback (S3 in prod). Result/feedback/event stores similarly
  fall back to local file without S3.

## Dependency matrix
| Dependency | Local | Preview | Production | Configured here | Fallback | Test evidence | Launch implication |
|---|---|---|---|---|---|---|---|
| **Device-local storage** (guest journey, saved result, 120Q progress, feedback signals) | ✅ works | ✅ | ✅ | **yes** (browser localStorage) | n/a | Playwright + node contracts | The stranger-ready anonymous core is fully functional and verified. |
| **Supabase** (recommendation graph, experience cards) | ⛔ needs Docker | ⛔ not connected | required | **no** | honest recovery states + device-local support plan | recovery-state contracts/UI | Provision Supabase for the account-backed discover graph. |
| **Shared-S3 store** (account/feedback/event persistence, dashboard aggregates) | ⚠️ file fallback | ⚠️ file fallback | required | **no** | local-file/tmp (ephemeral) | store-mode reported in /admin | Provision `YORISOU_SHARED_STORE_BUCKET` + AWS creds so accounts/events/dashboards persist. |
| **Resend** (password reset + feedback email) | ⛔ | ⛔ | required | **no** | record-then-honest-notice (no fake "sent") | contact/reset contracts | Provision `RESEND_API_KEY` + from/to; verify one real delivery. |
| **LINE** (messaging + login/OAuth) | ⛔ | ⛔ | required | **no** | graceful `not_configured`; deterministic callback contract | application-side adapter contract | Provision LINE channels; verify the real sandbox callback. |
| **LLM key** (private AI reflection, experience structuring) | ⛔ | ⛔ | optional | **no** | deterministic fallback replies | fallback verified | Optional; provision for AI reflection. |

## What SR-2 completed against this environment
- **WS-A (result parity)** and **WS-B (120Q resume)** are entirely **device-local**
  → fully built and verified here (contracts + Playwright + axe).
- **Backend-dependent workstreams** (guest-to-account/LINE E2E against a real
  backend, the Founder dashboard/queues with real aggregates, sensitive-admin
  access-logging verified against the DB, unified server feedback) require a
  running Supabase/S3 stack. **Docker is unavailable in this environment**, so a
  local Supabase cannot be started and there is no connected Preview Supabase.
  These are recorded here as **infrastructure-gated** — the application-side
  contracts/adapters can be built deterministically, but end-to-end verification
  against a real backend is an outstanding external/infra item, not a defect of
  the anonymous stranger-ready product.

## Boundary honored
No production secrets, no production migration, no production user data, no
production LINE/email mutation, no destructive operations. Where a real external
provider is unavailable, the application degrades to an honest recovery state for
the anonymous visitor (never a misleading dead-end), per the SR-1 recovery system.
