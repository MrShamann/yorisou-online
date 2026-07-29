# CPC-1 — Execution State (durable, same-package handoff)

> **Read this first.** It is the resume point. Do **not** repeat broad archaeology.
> Authorization: `YORISOU_CPC1_CANONICAL_CORE_PRODUCT_CUTOVER_AND_FOUNDER_ACCEPTANCE_AUTHORIZED`,
> continued by the Founder's 2026-07-29 terminal package (remote reconciliation + hosted terminal acceptance).

## Position

```
Branch : feat/ux2-integrated-core-experience
PR     : #126 (DRAFT — do not merge, do not mark ready; body updated 2026-07-29 to the truthful
         pre-hosted-acceptance state: 11 migrations, full evidence, hosted gates explicitly NOT RUN)
HEAD   : code HEAD 34adc28b466f834d45d12a54642fe756fabd16f5; the commit carrying this file is its
         docs-only descendant — `git rev-parse HEAD` is authoritative and must equal the remote
         branch head and PR #126 head
Base   : main @ c8d8a8ad6a72949c248adb098a626d1ab9d6a579  (Production, unchanged, re-verified read-only)
Env    : Preview only (yorisou-preview / nbltsbonsnbpfptihomc)
Status : YORISOU_CPC1_GENUINE_BLOCKER — every deployment-independent gate green at HEAD;
         the ONLY remaining gates require Preview access behind Vercel Authentication.
```

## 2026-07-29 terminal session — remote reconciliation + CI recovery COMPLETE

**Repository-truth reconciliation (Case A).** Local HEAD `4a2f0cb` was a clean 7-commit fast-forward
descendant of remote `75d8c78`; every claimed artifact was verified in the actual commits
(`git log --reverse --stat`, `git diff --check` clean) before push. No recovery, no cherry-picks,
no force-push. Pushed fast-forward; then two REAL CI-blocking defects surfaced and were fixed:

1. **`package-lock.json` drift (commit `10959a6`).** `package.json` required
   `@axe-core/playwright@^4.12.1`; the lock never recorded it. Every CI job died at `npm ci`
   with EUSAGE before a single test ran — local runs masked it because `node_modules` already
   satisfied the tree. Lock regenerated; `npm ci --dry-run` exit 0.
2. **Secret-scan false positives (commit `34adc28`).** With install fixed, CI reached the
   CPV1-CM0 gitleaks hard gate for the first time on this branch: 3 `generic-api-key` matches =
   the sessionStorage key names `yorisou.result.pending-claim.v1` / `pending-intent.v1` (public,
   shipped to every browser) and a fixed documentation UUID in a unit test. Allowlisted by exact
   value only in `.gitleaks.toml`; default ruleset intact; branch range now scans clean.

**CI at HEAD `34adc28`: ALL SUCCESS** — DCI-1, YV-1, CPV1-CM0 (incl. secret scan), Yorisou Check,
Migration Scope Guard.

**Fresh Preview deployment exists for the exact HEAD**: GitHub deployment `5659941617`,
environment Preview, state success — `yorisou-online-95qtz2wqa-shigeru-naganos-projects.vercel.app`
(branch alias `yorisou-online-git-feat-ux2-int-48a43e-shigeru-naganos-projects.vercel.app`).
`/api/build-identity` could not be read anonymously — it sits behind the same wall (evidence below).

**Terminal deployment-independent battery re-run at `34adc28`: ALL GREEN.**
tsc 0 (app) · tsc 0 (tests) · ESLint 0 errors · clean build exit 0 (one attempt hit the known
`next/font` network transient; rerun clean) · scope guard `{12,4,11}` · 21/21 unit+contract suites ·
YV / DCI / agent-runtime PostgreSQL integration ALL PASS on a fresh disposable local Postgres 16
container (note: the agent-runtime harness is not re-entrant on a reused database — migration
202607100001 has no `if not exists`; always give it a fresh database) · gitleaks branch range clean.
Container removed and Colima stopped at closeout.

**Production non-regression VERIFIED read-only (Supabase Management API, query endpoint only):**
- migration history = exactly the 12 `PRODUCTION_LINEAGE` versions; no CPC-1 version present;
- 42 public tables (baseline);
- `yorisou_assessment_attempts` / `yorisou_assessment_results` ABSENT;
- CPC-1 distinguishing objects ABSENT from the legacy `202607110003` recommendation tables
  (`sequence_no` column and `yorisou_recommendation_actions_idem` index both `[]`);
- no `entry_source` column anywhere in public schema → no CPC-1 synthetic fixture data possible;
- DCI 0 rows · YV 0 assessments / 0 versions; the 2 `yorisou_values_assessment_events` rows are
  the documented content-free `deleted` tombstones from the 2026-07-27 PPR-1 closeout;
- `yorisou.online` root 200, `/tests` 200. No write of any kind was issued.

## Implementation state (carried from the 2026-07-29 continuation session, re-audited this session)

WS1 one-context principal lifecycle (30 steps, no placeholders, single context) · WS2 governed
fixtures (per-run passwords, real-route drivers, env-gated read-only DB reads, ttl-0 mint,
idempotent cleanup) · WS3 authenticated User A/User B matrix (22 steps incl. pairing attack,
replay/conflict, monotonic sequence, unrecoverable erasure) · WS4 contrast fixed at source with
local axe 10/10 zero serious/critical · WS5 battery green — all COMPLETE and now REMOTELY TRUE
(pushed, CI-verified). Product fixes live on the branch: `/result/return` pure-claim path
(peek → claim → acknowledge), `SignOutControl.tsx` on every authenticated outcome,
contrast tokens. The two `test.skip` calls in the acceptance specs are viewport-dedup guards
(run-once-on-desktop), not skipped properties.

## Hosted verification boundary — the ONLY remaining work (verified external condition)

Anonymous `GET` to the Preview URL (root and `/api/build-identity`) → `HTTP 302` to
`https://vercel.com/sso-api?...` + `_vercel_sso_nonce` cookie: the deployment is behind
**Vercel Authentication**. `VERCEL_AUTOMATION_BYPASS_SECRET` was checked ONCE this session
(shell env, repo `.env*` — none exist, `~/.vercel` absent): **absent**, and rechecked once at the
terminal decision point: still absent. Not retrieved, not rotated, not printed. The Vercel API
remains 403 for the CLI token (prior session's finding; not re-queried).

Blocked gates: hosted principal lifecycle · hosted authenticated matrix · LINE anonymous network
classification (`lineAnonymousNetwork.spec.ts` — committed, still UNCLASSIFIED) · hosted axe
desktop/mobile + keyboard/focus/reduced-motion · Web + LINE erasure acceptance · fixture cleanup
proof · exact-SHA build-identity read.

Operator action (Founder or Vercel admin): restore the token's project access OR inject a valid
`VERCEL_AUTOMATION_BYPASS_SECRET` at runtime. Then, in order (never `--prod`):
1. confirm/refresh the exact-SHA Preview deployment; 2. `previewReachable.setup.ts` enforces
   deployed_sha == HEAD and env == preview; 3. LINE anonymous-network capture; 4. full hosted axe;
5. one-context principal lifecycle; 6. `authenticatedSecurityMatrix.spec.ts` + erasure (supply
   Preview `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` for the env-gated tombstone/sequence/
   expiry checks); 7. full battery re-run; 8. LAST: final PR #126 body + this file's rewrite with
   hosted evidence.

Run:
```
EXPECTED_GIT_SHA=<application-sha> PLAYWRIGHT_BASE_URL=<deployment-url> \
  VERCEL_AUTOMATION_BYPASS_SECRET=<supplied> \
  SUPABASE_URL=<preview-url> SUPABASE_SERVICE_ROLE_KEY=<supplied> \
  npm run test:cpc1-acceptance
```

## Standing accuracy notes (do not relitigate)

- Erasure semantics: 202607270004 was a LIVE OVER-RETENTION fix, never an erasure failure.
- Canonical persisted payload: `{"v":"pds-v1"}` only, enforced at write/DB/read.
- Supporting Signals is WITHDRAWN, not deferred. Do not invent labels.
- Preview migrations: 11 PREVIEW_ONLY (…270001–…280007); Production untouched at 12.
- Known-good DB invariants proven on the real Preview DB in prior sessions: idempotent
  completion · claim single-use/owner-scoped · correction preserves original · rejection/defer
  withhold permissions · expiry denied · append-only outside erasure · content-free tombstone ·
  abandon kills token.
- The `yorisou_recommendation_*` table names collide with legacy PRODUCTION_LINEAGE migration
  202607110003 (`create table if not exists` in 202607280004 would silently no-op if the legacy
  tables ever existed on Preview). Prior hosted materialization worked, so Preview holds the new
  shapes — but verify against the live schema before trusting fixtures after any Preview reset.
- Production `yorisou_recommendation_sets` exists and is the LEGACY 202607110003 table —
  its presence is baseline, not contamination (distinguishing-object absence proves it).

## CONTINUATION_CURSOR

```
implementation_state: COMPLETE and REMOTELY TRUE at 34adc28 (pushed, CI green, PR #126 head).
pending: hosted verification only (items 1–8 above), then the FINAL hosted-evidence rewrite of
  the PR body and this file.
external_condition: Preview behind Vercel Authentication (302 → vercel.com/sso-api, captured);
  VERCEL_AUTOMATION_BYPASS_SECRET absent from the execution environment; Vercel API 403.
next_file: none to write — next ACTION is the hosted run sequence above.
deployment_identity_rule: after ANY change under app/, lib/, supabase/, redeploy and require
  deployed_sha == new application sha, environment == preview.
known_real_blockers: hosted access only.
lock_state: released at end of session (see lock file).
```
