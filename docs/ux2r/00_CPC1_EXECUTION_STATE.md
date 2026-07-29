# CPC-1 — Execution State (durable, same-package handoff)

> **Read this first.** It is the resume point. Do **not** repeat broad archaeology.
> Authorization: `YORISOU_CPC1_CANONICAL_CORE_PRODUCT_CUTOVER_AND_FOUNDER_ACCEPTANCE_AUTHORIZED`.

## Position

```
Branch : feat/ux2-integrated-core-experience
PR     : #126 (DRAFT — do not merge, do not mark ready; body rewrite is gated to AFTER hosted acceptance)
HEAD   : (authoritative = `git rev-parse HEAD`; this file is written inside the checkpoint commit)
Base   : main @ c8d8a8ad6a72949c248adb098a626d1ab9d6a579  (unchanged)
Env    : Preview only (yorisou-preview / nbltsbonsnbpfptihomc)
Status : YORISOU_CPC1_IMPLEMENTATION_COMPLETE_HOSTED_VERIFICATION_EXTERNALLY_BLOCKED
```

## 2026-07-29 session — all five deployment-independent workstreams COMPLETE

**WS1 — one-context principal lifecycle: COMPLETE, no placeholders.**
`tests/cpc1-acceptance/verticalJourney.spec.ts` now runs the frozen journey end-to-end in one
browser context: anonymous 120Q completion → corrected interpretation parked across the 401 →
pending intent proven (bounded/typed/nonced) → real browser registration of a unique synthetic
Preview user → return trip claims + applies the parked correction → exactly-once proven (empty
replay + 1-entry answer history) → private-state continuity → accepted-result report + owner
download → corrected-basis recommendations (list + graph) → save/try/tried/helpful → feedback
change → hide → complete action history with the full `記録: A ← B` chain → sign-out through the
REAL UI control → denial on every surface → browser sign-in recovery → canonical LINE return
showing the SAME record → UI erasure stating its consequences → all surfaces concealed → DB
tombstone check against migration 202607270004's lifecycle constraint (env-gated; recorded as an
explicit annotation when Preview DB access is absent — never silently skipped).
The spec previously referenced an UNDEFINED `canonicalRowId` (tests are excluded from app tsc);
two tests would have thrown ReferenceError. Fixed; the whole suite now type-checks via
`npm run typecheck:cpc1-tests` (tsconfig.tests.json).

**WS2 — governed fixtures: COMPLETE.** `tests/cpc1-acceptance/fixtures.ts`: synthetic identities
(per-run generated passwords, nothing committed or logged), attempt/result/interpretation/
recommendation drivers through the REAL routes, governed app-boundary cleanup, env-gated
read-only Preview-DB reads (`SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` at runtime only), and a
ttl-0 expired-attempt mint that is impossible through the app. Registration is immediate by
design (cookie-session over an object store, no email confirmation exists), so browser-UI
registration needs no external mail — the recorded "email delivery" limitation does not apply.

**WS3 — authenticated security matrix: COMPLETE (authored + type-checked; hosted run pending).**
`tests/cpc1-acceptance/authenticatedSecurityMatrix.spec.ts`: all cross-owner denials concealed as
the same 404 an outsider sees (read/claim/interpretation/report/download/materialize/action —
including the owned-result pairing attack — /erase/LINE), wrong-credential 403 on an unclaimed
record, env-gated expired-credential denial, claim + interpretation replay idempotency to the
ORIGINAL rows, 409 on conflicting interpretation nonce reuse, concealed-404 on conflicting
recommendation key reuse (route maps the RPC conflict into concealment by design), monotonic
action sequence (API order + env-gated raw sequence_no), sign-out closes every boundary, sign-in
restores only owner data, erased state unrecoverable through every boundary after fresh auth.

**WS4 — contrast: FIXED AT SOURCE with exact-ratio attribution, locally PROVEN.**
- bg `#067A34` @ 3.38 = `--yorisou-color-deep-900` text on AppHeader's LINE buttons → `text-white` (5.47).
- bg `#FBFAF6` @ 2.99 = `#9A9088` → `#6F6760` (5.31); also `#B0A89E` (2.25) and `#9A918B` (2.96).
- bg `#FFFFFF` @ 4.28 = `#8A7764` on /tests → `#7A664F` (5.47); `#8A7F78` (3.73–3.90) in result
  reveal → `#6F625C`.
- One composite case only a rendered run could catch: the mini-app 準備中 chip composites
  `rgba(129,122,150,0.1)` over `#FBFAF6` to `#E8E6E7`, where `#6F6760` is 4.46 → `#5F5750` (5.70).
**Local evidence: 10/10 — zero serious/critical axe violations** on `/`, `/check-in`, `/tests`,
`/line/mini-app`, `/result?resultId=MS-KI` at desktop+mobile against the locally served
production build, same AxeBuilder machinery and thresholds as the hosted gate. No rules
suppressed, no nodes excluded, no thresholds lowered. Hosted axe proof still pending.

**WS5 — deployment-independent battery: ALL GREEN at this HEAD.**
tsc 0 · tests-tsc 0 · ESLint 0 errors (8 pre-existing warnings) · clean `next build` exit 0
(one attempt failed on the known `next/font/google` network transient; clean rebuild passed) ·
migration-scope guard `PRODUCTION_LINEAGE=12 / LOCAL_ONLY=4 / PREVIEW_ONLY=11` ·
ux2 suites: envelope 9 · routes 8 · consent 7 · intent 8 · gate 8 · reason 7 · line 6 — 0 fail ·
cpv1 62 · recommendation-graph 16 · imairo-snapshot 8 · result-reveal 7 · c02 24 ·
relationship-fatigue · daily-check-in 46 · yorisou-values 27 · candidate-intake 9 ·
experience-cards 8 · shared-store 15 · production-pilot 12 · private-ai-providers 6 ·
DB integration on a DISPOSABLE local Postgres (Colima): yorisou-values ALL PASS ·
daily-check-in ALL PASS · agent-runtime full pass (script asserts under ON_ERROR_STOP; exit 0).

**Product fixes shipped this session (all Preview-branch only):**
1. `/result/return` pure-claim path: the pending claim was consumed and never executed, so
   save-then-login dead-ended at 「見つかりませんでした」. Now peek → claim → acknowledge, same
   lifecycle as the intent; 5xx keeps the record for resume (`app/result/pendingSave.ts`,
   `app/result/return/page.tsx`).
2. Sign-out exists: `app/private-state/SignOutControl.tsx` on every AUTHENTICATED outcome of
   /private-state (including read failure — ending the session must not depend on the results
   read). Verified locally: absent when anonymous, click ends the server session → /login.
   Previously /api/auth/logout had ZERO call sites in the product.
3. Contrast tokens as above.

## Hosted verification boundary — the ONLY remaining work (externally blocked)

`GET https://api.vercel.com/v9/projects/yorisou-online` returns 403 for the CLI token; the
automation bypass cannot be retrieved and every hosted run hits the SSO wall. The identity gate
refuses an empty secret rather than running vacuously. **Do not retrieve/print/rotate secrets.**
A Founder or authorized operator restores access or supplies a non-empty
`VERCEL_AUTOMATION_BYPASS_SECRET` at runtime. Checked once this session: absent.

When access returns, in order (never `--prod`):
1. fresh Preview deployment; 2. deployed_sha == HEAD application sha, env == preview
   (`previewReachable.setup.ts` enforces); 3. focused LINE anonymous-network capture (code
   committed at `lineAnonymousNetwork.spec.ts` — still UNCLASSIFIED, no run has reached it);
4. full axe evidence (expected clean; token fixes locally proven); 5. one-context principal
   lifecycle; 6. `authenticatedSecurityMatrix.spec.ts` + erasure (supply `SUPABASE_URL` +
   `SUPABASE_SERVICE_ROLE_KEY` at runtime for the env-gated tombstone/sequence/expiry checks);
7. full battery re-run; 8. LAST: complete rewrite of PR #126 body and this file (PR body still
   says 5 migrations; actual 11).

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

## CONTINUATION_CURSOR

```
implementation_state: COMPLETE for WS1–WS5 of the 2026-07-29 continuation directive.
pending: hosted verification only (items 1–8 above), plus the PR-body/doc rewrite gated behind it.
external_condition: Vercel API 403 / no VERCEL_AUTOMATION_BYPASS_SECRET in the environment.
next_file: none to write — next ACTION is the hosted run sequence above.
deployment_identity_rule: after ANY change under app/, lib/, supabase/, redeploy and require
  deployed_sha == new application sha, environment == preview.
known_real_blockers: hosted access only.
lock_state: released at end of session (see lock file).
```
