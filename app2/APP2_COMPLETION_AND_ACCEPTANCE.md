# APP-2 — Completion Recovery, Local Supabase Authorization & Full Desktop-Ready Service

Corrective continuation of APP-1. APP-1 completed the installable-PWA workstream
but deferred material application work (nine-family reports, explainable
adaptation, LINE application contract) and the Supabase-backed workstreams for
lack of a local backend. APP-2 **removes the infra excuse** (authorized local
Colima + Docker), completes the deferred backend-independent work, and
implements + verifies the Supabase-backed work against a **local** Supabase.

**Governance:** production UNCHANGED at `main @ 70da80a`; PR #113 remains OPEN /
unmerged; no production migration/secrets; no `yorisou-production`; no
Mirai/Kakari infra; no hosted/billable Supabase; no history rewrite; protected
boundaries (questions/scoring/taxonomy/result IDs/methodology/recommendation
logic/privacy/personas/LINE identity/auth/payments/consent) untouched; YRR-1 +
RTR-1 preserved. Claude Code sole executor; Codex not involved.

---

## Workstreams delivered

- **WS-A** — nine-family deeper reports. One shared architecture
  (`app/data/app2/familyReports.ts` + `app/reports/family/[family]/`) with
  family-specific approved content for all 9 families (imairo, c02, f01, f02,
  relationship-fatigue, love-distance, local-life, work-rhythm, name-impression).
  Each: 今わかっていること / 今のパターン / 見えている緊張 / 支えになる条件 /
  つまずきやすいところ / ふり返り / 次の一歩(2–3) / 考え方について(methodology) /
  この結果でできないこと(not-a-diagnosis boundary). JP-natural, mobile-first,
  device-local save + return + feedback, no fake science / clinical claim /
  paywall / locked chapters / placeholder.
- **WS-B** — explainable deterministic adaptation (`lib/app2/adaptation.ts`) wired
  into `/my-yorisou`. Pure, deterministic ordering from device-local signals;
  never repeats hidden/rejected; recognizes tried as done; reason codes + a
  "なぜ表示" why-line on every card; reset control (reversible).
- **WS-C** — LINE application-side signed-callback contract
  (`lib/app2/lineCallbackContract.ts`) + recovery surface (`/line/recovery`).
  signature / state / nonce / expiry / replay / idempotency-duplicate / cancel /
  consent / return-destination (no open redirect) / guest↔account continuity
  (no silent merge) / privacy-safe audit.
- **WS-D** — local Supabase schema (`202607190001_app2_full_service_backend.sql`):
  8 tables, 3 aggregate views, 5 RPCs; reversible; RLS + grants + append-only
  audit. See `BACKEND_MIGRATION_AND_RLS.md`.
- **WS-E** — guest→account migration (`/api/account/guest-migration`): authenticated,
  idempotent, transactional with compensating rollback, no silent identity merge,
  no raw answers in URL.
- **WS-F** — Founder Service Readiness Dashboard (`/admin/service-readiness`):
  Overview / Funnel / Family-coverage / Failure-monitoring; aggregates only,
  truthful empty/unconfigured states.
- **WS-G** — review queues (`/admin/review-queues` + `/api/admin/review-queues`):
  10 queue types, lifecycle open→reviewing→resolved/dismissed→reopened, immutable
  audit.
- **WS-H** — sensitive-admin access logging: allowed AND denied access recorded,
  append-only, no raw payload; wired into the dashboard + queue API.

---

## 20-scenario acceptance matrix

| # | Scenario | Verified by | Result |
|---|---|---|---|
| 1 | All 9 family reports have complete, approved, non-placeholder content | `test:app2` WS-A #2 | PASS |
| 2 | Reports carry methodology + explicit not-a-diagnosis boundary; no fake stats | `test:app2` WS-A #3 | PASS |
| 3 | Report route is theme-registered + unknown family 404s (no fabrication) | `test:app2` WS-A #4 · Playwright `app2` | PASS |
| 4 | Report save/return/feedback are device-local (RTR-1 + SR-1 wiring) | source + Playwright `app2` | PASS |
| 5 | Adaptation is deterministic (same input ⇒ same order) | `test:app2` B1 | PASS |
| 6 | Adaptation reprioritizes by result family + stated need, explained | `test:app2` B2/B3 · Playwright S15 | PASS |
| 7 | Hidden items never reappear | `test:app2` B4 · Playwright | PASS |
| 8 | Rejected ("今は違う") items never repeated | `test:app2` B5 | PASS |
| 9 | Tried items recognized as done + de-prioritized | `test:app2` B6 | PASS |
| 10 | Every surfaced item has a reason code + why-line | `test:app2` B8 | PASS |
| 11 | Adaptation reset is reversible | `test:app2` B-reset | PASS |
| 12 | LINE callback: signature/state/nonce/expiry/replay all enforced | `test:app2` C2–C7 | PASS |
| 13 | LINE callback: idempotent duplicate ≠ replay attack | `test:app2` C8 | PASS |
| 14 | LINE cancel + missing-consent are first-class; no open redirect; audit has no PII | `test:app2` C9/C10/C13/C14 | PASS |
| 15 | Guest↔account continuity is never a silent identity merge | `test:app2` C12 · WS-E route | PASS |
| 16 | Real LOCAL incident → review queue → resolve → immutable audit | `LOCAL_SUPABASE_VERIFICATION.sql` #10 | PASS |
| 17 | Guest→account migration is idempotent (same key ⇒ no double side-effect) | DB #2 + REST E2E-1 | PASS |
| 18 | anon denied on every backend table (RLS + grant); user isolation holds | DB #7/#8 + REST E2E-3/5 | PASS |
| 19 | Admin least-privilege + append-only audit (UPDATE/DELETE blocked for all) | DB #5/#9 | PASS |
| 20 | Installable PWA (APP-1) preserved; whole app builds; contracts non-regressed | `next build` + all `test:*` + `app1-pwa` | PASS |

Backend scenarios (16–19) are machine-verified against **local** Supabase; the
captured output is in `evidence/aix1-founder-review/app2/`.

---

## Validation summary

`tsc` 0 · `eslint` 0 · `next build` ✓ · contracts aix4/aix5/sr1/sr2/app1/**app2**
all pass · Playwright `app2` (reports ×9 + reprioritization + hidden + recovery)
· local Supabase verification 12/12 PASS + REST/RPC E2E · axe 0 violations on new
public surfaces · gitleaks staged clean.

## Local dev infrastructure (dev-only; stopped after validation)

Colima 0.10.3 · Docker 29.6.2 · docker-compose 5.3.1 · lima 2.1.4 · Supabase CLI
2.106.0. Local-only endpoints, well-known demo keys, no production connection.
Install/uninstall/cleanup commands in `BACKEND_MIGRATION_AND_RLS.md §6–7`. The
stack was stopped cleanly after validation (`supabase stop`, `colima stop`).
