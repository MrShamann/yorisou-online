# CPC-1 — Execution State (durable, same-package handoff)

> **Read this first.** It is the resume point. Do **not** repeat broad archaeology.
> Authorization: `YORISOU_CPC1_CANONICAL_CORE_PRODUCT_CUTOVER_AND_FOUNDER_ACCEPTANCE_AUTHORIZED`.

## Position

```
Branch : feat/ux2-integrated-core-experience
PR     : #126 (DRAFT — do not merge, do not mark ready)
HEAD   : (authoritative = `git rev-parse HEAD`; this file is written inside the checkpoint commit,
         so any HEAD quoted here is its pre-handoff parent. Parent at last write: 2dae63fa…)
Base   : main @ c8d8a8ad6a72949c248adb098a626d1ab9d6a579  (unchanged)
Env    : Preview only (yorisou-preview / nbltsbonsnbpfptihomc)
Status : YORISOU_CPC1_CONTINUATION_REQUIRED
```

## Workstream status

| WS | scope | status |
|---|---|---|
| 0 | Architecture freeze (5 contracts in `docs/ux2r/`) | **DONE** |
| 1 | Canonical result cutover (Wave A) | **DESTINATION CUTOVER DONE for result / recommendations / graph / report page / report download**; LINE not audited |
| 2 | Stable identity propagation + legacy retirement | **NOT STARTED** (this is ICP-1 defect #4) |
| 3 | Authentication continuity | **DONE for the interpretation loop** — claim + pending intent with peek/acknowledge lifecycle and DB-enforced exactly-once. Login/register surface polish outstanding |
| 4 | Interpretation + Living Understanding Field | **API ONLY** — response RPC + endpoint done; no UI |
| 5 | Private continuity (`/private-state`) | **NOT STARTED** |
| 6 | Recommendation + action loop | **NOT STARTED** (Preview lacks `yorisou_recommendation_*`; migration required) |
| 7 | Core UX + route consolidation | **NOT STARTED** |
| 8 | Acceptance train | **NOT STARTED** |

## Preview migrations applied (all PREVIEW_ONLY, none in Production)

| id | content |
|---|---|
| `202607270001` | attempts / results / interpretation_responses + 6 RPCs + RLS forced + service_role SELECT-only |
| `202607270002` | compensating rollback |
| `202607270003` | expiry on every anonymous write, deferred≠consent, first erasure, DB invariants |
| `202607270004` | nullable result identifiers + lifecycle constraint, **true content-free tombstone**, governed `attempt_abandon` |

Guard: `PRODUCTION_LINEAGE=12` (unchanged), `LOCAL_ONLY=4`, `PREVIEW_ONLY=4`.

## Persisted payload contract (2026-07-28) — READ BEFORE TOUCHING dimension_output

`scoringOutput.groupedBySubdimension` is `Record<SubdimensionCode, OptionScore[]>` over **24**
codes (`AR_CONTINUATION`, `BD_ROLE_DISTANCE`, …) — **not** the Yorisou Values keys
(`anshin`/`pace`/…), which belong to a different method. Every `OptionScore` carries `questionId`
and `optionId`, so persisting it verbatim keeps the answer trail reconstructable even after
`answers` is erased.

**ACCURACY — this was a LIVE OVER-RETENTION defect, NOT an erasure failure.** Migration
`202607270004`'s erase RPC already cleared `dimension_output`, `answers`, identifiers and owner
linkage, with a lifecycle constraint enforcing it. The defect was that reconstructable data was
retained for the row's lifetime without an approved use. Keep this distinction exact in all
reporting; do not overstate it as erasure failure.

**Canonical persisted payload is `PersistedResultEnvelopeV1` = `{"v":"pds-v1"}` — a version marker
only.** An intermediate `{answeredRows, formulaStatus, dimensionCounts}` was rejected as retention
without purpose: a completed 120Q always answers every item, formulaStatus is methodology metadata,
and `dimensionCode` is a FIXED bank property, so counts describe bank structure rather than the
person. The outcome lives in `result_id`; provenance in the dedicated version columns.

**Enforced at three boundaries, not by caller discipline:** WRITE (`completeAttempt` takes the typed
envelope and validates), DATABASE (migration `202607280001` — `yorisou_attempt_complete` rejects any
payload that is not exactly one key `v='pds-v1'`), READ (`loadPersistedAssessmentResult` uses the
strict reader → typed envelope or null). The reader **rejects rather than sanitises**.

**Supporting Signals is WITHDRAWN and is NOT part of any remaining scope** — it is not deferred,
not pending and not a Wave B item. The repo has no governed public-safe labels for the 24
subdimension codes and no approved relative-strength derivation (bucket length mostly reflects
fixed bank structure). It would only ever return under a separate Founder-authorized methodology
package. Do **not** invent labels, and do not treat this paragraph as an open task.

## Exact next action

**Wave A is complete.** Delivered, in order:
0. Canonical `{"v":"pds-v1"}` envelope + three-boundary enforcement.
1. `PersistedResultMode` split from `LegacyCompatibilityResultMode` (`app/result/resultMode.ts`) —
   the two authorities are now distinct types produced by one resolver, so a legacy value can no
   longer fill a persisted null anywhere a ternary was forgotten.
2. `/report-loading` is an honest stable-identity transition: the four fake analysis steps and the
   3.9s/4.4s artificial delays are gone, `?result` is preserved, and the copy states plainly that
   nothing is being computed there.
3. Identity propagation (`app/result/resultIdentityRoutes.ts`): private continuity routes carry the
   stable identity ALONE; the share surface is structurally incapable of carrying the private row
   id. Persisted-mode `PrivateResultSave` CLAIMS the canonical record instead of creating a second
   one, and the duplicate `/saved/tests/<id>` presentation is retired in persisted mode.

## Correction to a claim I made

I previously reported **"Wave A complete"**. That was not accurate. What Wave A shipped was
identity **transport** — /result learned to attach `?result=<row-id>` to every private link. It did
not ship identity **consumption**: the destinations kept reading `resultId`/`overlayId`/`payloadKey`
and ignored the row id, so a persisted user arrived with a correct link at a page that did not
understand it and fell through to generic content. Worse, hiding the recommendation link on
/result was the *only* thing between an unanswered result and its recommendations — and hiding a
link is not authorization.

The durable status now reads **transport complete / destination cutover in progress**.

## Wave B — in progress

**The interpretation loop is now wired.** The RPC and API for confirm / correct / reject / defer
existed and were proven against the real Preview DB, but nothing in the product ever called them:
the assessment spoke and the person could only accept it by silence. `InterpretationResponse`
gives the person an answer, and the answer has consequences:

- **Deferred is not consent, in the product and not only in the database.** Without an accepting
  answer the recommendation entry is not offered — on the primary action AND on the secondary link
  in the open-testing notice, so the withheld entry is not reachable one card lower. The reason is
  stated rather than the control silently vanishing.
- **Rejection does not delete.** It stops the interpretation being presented as accepted
  understanding; erasure stays a separate, explicit act, and the copy says so.
- **A correction preserves the original.** `original_result_id` never changes.
- Answering is owner-scoped; before the record is claimed the surface says so instead of offering
  a control that would fail.

`deriveCurrentUnderstanding` moved to `lib/server/currentUnderstanding.ts`, free of `server-only`,
so `test:ux2-consent` exercises the REAL rule instead of restating it — a restatement cannot catch
the rule being softened.

### Added in the closed-loop tranche

- **One canonical result-context loader** (`lib/server/canonicalResultContext.ts`). Every private
  destination calls it; none re-implements the rules. It distinguishes *unavailable* (concealed —
  one state for invalid/missing/expired/erased/unauthorized/cross-owner) from *withheld* (the
  viewer owns the result; the gate is their own answer, and saying so is the point).
- **`/recommendations` cut over and SERVER-enforced.** `?result` selects canonical mode; typing the
  URL obeys the same rule as clicking the button. A correction is honoured — the accepted result is
  used, not the machine's original. `resultRowId` survives the hop to `/recommendations/graph`
  and `/saved`.
- **Permission derivation hardened.** `recommendationUsePermitted` / `continuityUsePermitted` were
  returned straight from the stored columns, so a malformed row with `permitted = true` beside
  `response_type = 'rejected'` would have granted access. The response type now decides and the
  stored flag can only narrow. The test asserts the permission fields, not only `resolved`.
- **Consent is reactive.** The response API's canonical understanding is consumed (rather than the
  rule being recomputed client-side) and `router.refresh()` re-renders the server tree, so the
  surrounding CTAs react in BOTH directions without a manual reload.
- **Continuity gated separately** from recommendation, per the frozen contract.
- **Correction UI** bounded to the governed archetype taxonomy — no free text, no self-described
  diagnosis.
- **Pending interpretation intent** (§4): the ANSWER, not just the row, survives login. Bounded to
  an opaque row id, governed response type, governed corrected code, bounded reason code, nonce and
  expiry; consumed on read so it cannot be replayed; re-validated on the way back in.
- **Canonical `/private-state` panel** with original vs accepted shown separately, append-only
  answer history, per-attempt entries (never collapsed), and an **erasure control** that states
  exactly what is removed.

**Wave B remaining:** report route and `/recommendations/graph` destination cutover; LINE
continuity audit; recommendation generation/feedback persistence (Wave C); the full Preview
acceptance journey (§10).

## Durable state accuracy note

An earlier version of this file understated completed work (it still listed report/graph as not cut
over, four Preview migrations, and interpretation as API-only). Corrected here, inside a runtime
checkpoint rather than as a documentation-only edit.

## Current Preview migrations: 7 (`PREVIEW_ONLY`)

`202607270001` tables+RPCs · `202607270002` grants · `202607270003` lifecycle/expiry/erasure ·
`202607270004` true tombstone + abandon · `202607280001` envelope guard ·
`202607280002` interpretation idempotency · `202607280003` idempotency hardening.

## Verification state

tsc **0** · ESLint clean · production build passes · migration-scope guard passes ·
`test:ux2-envelope` 9/9 · `test:ux2-routes` 8/8 · `test:ux2-consent` 7/7 · `test:ux2-intent` 8/8 ·
`test:ux2-gate` 8/8 (destination authorization). Preview round trip proven:
(consent gate, against the real derivation) · Preview round trip proven:
raw payload REJECTED, extra-field REJECTED, canonical accepted and stored exactly, erase clears all.
Unsafe legacy Preview rows **found: 0, deleted: 0**.
No Preview-backed E2E exists yet. No a11y run yet for the new surfaces.
Production non-regression at this HEAD: **42 tables / 12 migrations / 0 leaked**, PR #113 and #125
untouched.

## Known-good invariants already proven against the real Preview DB

idempotent completion · claim single-use + owner-scoped · correction preserves the original ·
rejection and defer withhold both permissions · expiry denied at save/complete/read ·
append-only enforced outside the erasure context · true content-free tombstone ·
abandon kills token + blocks resume/save/complete/claim.

## CONTINUATION_CURSOR

```
current_head: (this commit)
last_completed_capability: hosted Preview harness at a VERIFIED deployment (deployed_sha ==
  expected_sha, env=preview). 55 assertions passing across desktop+mobile.

SCOPE CORRECTION: what is passing is NOT the frozen vertical journey. verticalJourney.spec.ts
  answers 3 questions and substitutes a legacy result URL for completion. It does not complete the
  120-question assessment, register, claim, act on recommendations, recover across sign-out/in, or
  erase. Coverage today is unauthenticated routing, concealment, denial and quality assertions.

HOW TO RUN:
  VERCEL_AUTOMATION_BYPASS_SECRET must be supplied securely at runtime. Never commit it, never
  print it, never store the retrieval procedure here.
  npx vercel deploy --scope shigeru-naganos-projects --yes    # Preview only, never --prod
  EXPECTED_GIT_SHA=<application-sha> PLAYWRIGHT_BASE_URL=<deployment-url> \
    VERCEL_AUTOMATION_BYPASS_SECRET=<supplied> npm run test:cpc1-acceptance

next_file: axe contrast fixes across app/ (see exact pairs below), then
  tests/cpc1-acceptance/verticalJourney.spec.ts to run the one-context lifecycle
next_function_or_route: AXE — exact failing pairs captured from the hosted run at the CURRENT app
  commit (LINE green already fixed from 2.25 -> the homepage node is gone):
    bg #067a34, contrastRatio 3.38  <- foreground is NOT pure white; find the actual fg (likely a
                                       translucent/near-white token) and darken bg or solidify fg
    bg #fbfaf6, contrastRatio 2.99  <- page background; the muted text token on it is too light
    bg #ffffff, contrastRatio 4.28  <- just under 4.5; a small darkening of that text token fixes it
  Routes still failing: / , /check-in , /tests , /line/mini-app , /result?resultId=MS-KI
  Re-run with --reporter=line and grep the JSON for "fgColor" to get each foreground token.
  Do NOT suppress rules, exclude nodes or lower the threshold.

  LIFECYCLE — the one-context test is written (test.step, real 続きからはじめる resume, network-
  classified start). It has NOT yet been run to completion. Run it next; startAttempt now reports
  status / content-type / cookie-set / failure-UI / body when it fails, so the next failure is
  self-classifying.
next_command: EXPECTED_GIT_SHA=$(git rev-parse HEAD) PLAYWRIGHT_BASE_URL=<fresh-preview> \
  VERCEL_AUTOMATION_BYPASS_SECRET=<supplied> \
  npx playwright test --config=playwright.cpc1.config.ts --project=desktop -g "principal lifecycle"

FIXED THIS SESSION: LINE brand green contrast on public surfaces (#06C755 -> #067A34, hover
  #05622A; LineBrandIcon keeps the true brand fill as a logo with no text on it); start POST now
  network-classified instead of guessed; null attempt before the final question is a hard failure
  rather than assumed completion; lifecycle converted to ONE browser context with test.step.
CORRECTED: my earlier "hydration / intro step" and "nested spans" explanations were speculation
  stated as fact. There is no intro step; the source renders direct button text.
NOTE: retrieve the bypass with curl, not urllib — local Python lacks CA certs and silently yields
  an empty secret, which then hits the SSO wall.

remaining_terminal_gates:
  - 6 findings; real authenticated lifecycle; authenticated security variants; erasure proof
  - full battery once; complete rewrite of PR #126 body and this file (PR still says 5 migrations;
    actual 11)
deployment_identity_rule: a454d0b remains valid for harness-only changes. After ANY change under
  app/, lib/, supabase/ or other runtime code, redeploy and require deployed_sha == that new
  application sha, environment == preview.
known_real_blockers: none.
lock_state: released
```
