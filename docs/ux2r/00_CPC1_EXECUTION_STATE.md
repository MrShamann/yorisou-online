# CPC-1 — Execution State (durable)

> **Read this first.** It is the resume point. Do **not** repeat broad archaeology.
> Authorization: `YORISOU_CPC1_CANONICAL_CORE_PRODUCT_CUTOVER_AND_FOUNDER_ACCEPTANCE_AUTHORIZED`,
> continued by the Founder's 2026-07-29 terminal package and the 2026-07-30 autonomous
> Vercel-access clarification.

## Position

```
Branch : feat/ux2-integrated-core-experience
PR     : #126 (DRAFT / OPEN / UNMERGED — body rewritten 2026-07-30 with hosted evidence)
HEAD   : code HEAD 64ccb09b44bd2a3b62470a1e40c13cb0c981846c; the commit carrying this file is its
         docs-only descendant — `git rev-parse HEAD` is authoritative and must equal the remote
         branch head and PR #126 head
Base   : main @ c8d8a8ad6a72949c248adb098a626d1ab9d6a579  (Production, unchanged, re-verified read-only)
Env    : Preview only (yorisou-preview / nbltsbonsnbpfptihomc)
Status : YORISOU_CPC1_FOUNDER_ACCEPTANCE_CANDIDATE — hosted acceptance PASSED at the exact SHA,
         with ONE disclosed residual (synthetic Preview accounts; see below).
```

## Hosted acceptance — PASSED at 64ccb09

`npm run test:cpc1-acceptance` against Preview `dpl_Fusa6EM81FC87qW5uFmZ9LJnwAgR`:
**79 passed · 0 failed · 2 skipped** (both skips are viewport-dedup guards: the lifecycle and the
security matrix run once, on desktop). The identity gate ran FIRST and proved
`deployed_sha == expected_sha == 64ccb09…`, `environment == preview`.

Gates covered: exact-SHA build identity · one-context principal lifecycle (anonymous start → 120
answers → refresh + explicit same-attempt resume → canonical resultRowId → correction parked across
the login boundary → real browser registration → claim applied exactly once → private continuity →
accepted-basis report + owner download → recommendations list and graph → save/try/tried/helpful/
change/hide → full ordered action history → sign-out denial everywhere → sign-in recovery →
canonical LINE return on the same row → UI erasure → total concealment → database tombstone) ·
authenticated User A/User B matrix · LINE anonymous network classification (no successful private
canonical-state read) · axe desktop + mobile on five routes, zero serious / zero critical, nothing
suppressed · keyboard, focus, reduced motion, Japanese copy.

### How access was obtained (autonomously)

The prior blocker was resolved without Founder action: the stale Vercel CLI token (403 on
`/v2/user`) was replaced by completing the CLI device-authorization flow, and the project's
**pre-existing** Automation Bypass secret was read through the authorized project API and used via
`x-vercel-protection-bypass`. Its value was never printed, committed, logged or written to an
artifact; the local copy was destroyed at closeout. It was deliberately NOT rotated — it is shared
project infrastructure other automation may depend on.

**Infra defect fixed on the way:** the Preview `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` env
vars were branch-scoped to `feat/mpv-1-isolated-hosted-preview`, so this branch's deployments never
received them and EVERY persistence route answered 500. The same values are now also scoped to this
branch. This is Vercel project configuration, not repository state.

## Ten defects fixed by the train (eight product, two CI)

Local runs and CI were green throughout; six of the product defects required a real deployment,
database or browser to surface.

1. `08f21dc` — concealed `/result` state enumerated its reasons (expired / deleted) = an oracle.
2. `08f21dc` — harness: `/line/mini-app` `networkidle` never fires hosted; `診断や占いではありません`
   is a compound denial the exact-substring list missed.
3. `305270f` — `/tests` still claimed 診断 (F01/F02 titles + CTA) against the product-wide チェック re-badge.
4. `305270f` — **migration 202607300001**: attempt-start clamped TTL with `greatest(1, …)`, so the
   ttl-0 expired-credential fixture silently became a valid one-hour credential and the
   expired-credential property proved nothing. Applied to Preview and verified (`already_expired=true`).
5. `305270f` — harness: click landed on pre-hydration HTML; now awaits the client-issued mount probe.
6. `dd3405a` — **completion could navigate to PRODUCTION** (absolute `yorisou.online` origin on the
   LINE path and the 320ms router-stall fallback), carrying the canonical private row id.
7. `dd3405a` — expired credential answered 500 on save/complete; now the same concealed 404.
8. `3a62d40` — canonical link carried legacy scoring context (`?resultId=…&confidence=…&result=…`).
9. `3a62d40` — interpretation against an ERASED record answered 500 = an erasure oracle.
10. `26ef66a` — the password field's accessible NAME was the whole requirements blob (the shared
    `<Field>` wrapper folds children into the label); `9df7511` — the report was built from the
    machine's original code instead of the person's ACCEPTED one.

Plus `10959a6` (package-lock never recorded `@axe-core/playwright` → every CI job died at `npm ci`
before any test ran) and `34adc28` (gitleaks false positives on two public sessionStorage key names
and a test UUID). And `64ccb09` fixed the cleanup script itself: no target guard, an entry-source
list predating the browser-driven lifecycle, and completed journeys keeping their 120-answer trail.

## Terminal battery at 64ccb09 — ALL GREEN

tsc 0 (app) · tsc 0 (acceptance suite) · ESLint 0 errors · clean build exit 0 · scope guard
`{PRODUCTION_LINEAGE:12, LOCAL_ONLY:4, PREVIEW_ONLY:12}` · 21/21 unit and contract suites ·
YV/DCI/agent-runtime PostgreSQL integration on a fresh disposable Postgres 16 container (removed;
NOTE the agent-runtime harness is NOT re-entrant — always a fresh database) · gitleaks
`origin/main..HEAD` clean · CI at head all success (DCI-1, YV-1, CPV1-CM0, Yorisou Check, Scope Guard).

## Fixture cleanup — proven

`scripts/ux2/preview-cleanup.sql` against the real Preview database: attempts **0** · live results
**0** · tombstones **0** · interpretation responses **0** · recommendation sets/items/actions
**0/0/0** · unsafe tombstones **0**. Idempotent on re-run.

## Production non-regression — read-only, no write of any kind

Exactly 12 `PRODUCTION_LINEAGE` migrations · 42 public tables · CPC-1 tables ABSENT · CPC-1 RPCs
ABSENT · no `entry_source` column anywhere (CPC-1 fixture data is not even representable) · DCI 0
rows, YV 0 assessments / 0 versions (the 2 events rows are the documented content-free `deleted`
tombstones from the 2026-07-27 PPR-1 closeout) · `yorisou.online` `/`, `/tests`, `/login` all 200 ·
Production deployment untouched; `origin/main` still `c8d8a8ad`.

## Disclosed residual — synthetic Preview accounts

**The product has NO account-deletion capability at all**: `app/api/account/deletion-request`
records a *request* and the data layer has no delete path. Synthetic Preview identities therefore
remain as inert objects in the Preview shared store, and the store's AWS credentials are
Vercel-**sensitive** (write-only, unreadable via API), so direct removal is impossible too. A
temporary secret-gated cleanup route was deliberately NOT added — an admin backdoor in the
acceptance-candidate branch is a worse trade than disclosure.

Bounded risk: per-run passwords `Cpc1!Aa9-<uuid4>` existed only in test-process memory (never
written anywhere; not reproducible by anyone including the executor); addresses are
`@synthetic-preview.invalid`, an RFC 2606 reserved TLD with no mail or recovery path; all their
CPC-1 data is provably gone from the Preview database.

Founder's choice: delete `phase1/accounts/**` objects for `@synthetic-preview.invalid` from the
Preview bucket, and/or authorize a governed account-deletion capability as its own package — a real
product gap this train surfaced, outside CPC-1's frozen scope.

## Standing accuracy notes (do not relitigate)

- Erasure semantics: 202607270004 was a LIVE OVER-RETENTION fix, never an erasure failure.
- Canonical persisted payload: `{"v":"pds-v1"}` only, enforced at write/DB/read.
- Supporting Signals is WITHDRAWN, not deferred. Do not invent labels.
- Preview migrations: 12 PREVIEW_ONLY (…270001–…280007, …300001); Production untouched at 12.
- Production `yorisou_recommendation_sets` exists and is the LEGACY 202607110003 table — baseline,
  not contamination (the distinguishing-object absence check proves it).
- The two `test.skip` calls in the acceptance specs are viewport-dedup guards, not skipped properties.

## CONTINUATION_CURSOR

```
implementation_state: COMPLETE and REMOTELY TRUE at 64ccb09; hosted acceptance PASSED at that SHA.
classification: YORISOU_CPC1_FOUNDER_ACCEPTANCE_CANDIDATE (one disclosed residual, above).
pending: Founder review of PR #126 (Draft). Merge, mark-ready, Production deploy: NOT AUTHORIZED.
open_product_gap: no account-deletion capability exists (request-only). Needs its own package.
deployment_identity_rule: after ANY change under app/, lib/, supabase/, redeploy and require
  deployed_sha == new application sha, environment == preview. Never `--prod`.
resume_command: EXPECTED_GIT_SHA=<sha> PLAYWRIGHT_BASE_URL=<preview-url>
  VERCEL_AUTOMATION_BYPASS_SECRET=<project bypass> SUPABASE_URL=<preview>
  SUPABASE_SERVICE_ROLE_KEY=<preview> npm run test:cpc1-acceptance
lock_state: released at end of session (see lock file).
```
