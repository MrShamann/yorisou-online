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
| 1 | Canonical result cutover (Wave A) | **DONE** — exclusive persisted mode + concealed unavailable state; minimal `{"v":"pds-v1"}` envelope enforced at write/DB/read; `PersistedResultMode` split from `LegacyCompatibilityResultMode`; honest `/report-loading`; identity propagation with public-safe share; save = claim (no duplicate saved record) |
| 2 | Stable identity propagation + legacy retirement | **NOT STARTED** (this is ICP-1 defect #4) |
| 3 | Authentication continuity | **PARTIAL** — claim-by-result API done incl. replay cookie rule; persisted-mode pending CLAIM INTENT (opaque row id only) crosses the login boundary via `/result/return`. Login/register surface bridges not yet reworked (Wave B) |
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

**Next: Wave B** — ownership, interpretation and private continuity, continuing without an
intervening report.

## Verification state

tsc **0** · ESLint clean · production build passes · migration-scope guard passes ·
`npm run test:ux2-envelope` **9/9 against the real governed runtime** ·
`npm run test:ux2-routes` **8/8** (route-continuity + share-safety contract) · Preview round trip proven:
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
