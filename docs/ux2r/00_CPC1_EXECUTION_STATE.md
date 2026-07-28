# CPC-1 — Execution State (durable, same-package handoff)

> **Read this first.** It is the resume point. Do **not** repeat broad archaeology.
> Authorization: `YORISOU_CPC1_CANONICAL_CORE_PRODUCT_CUTOVER_AND_FOUNDER_ACCEPTANCE_AUTHORIZED`.

## Position

```
Branch : feat/ux2-integrated-core-experience
PR     : #126 (DRAFT — do not merge, do not mark ready)
HEAD   : b36f06011b44cbae7e8c7f111729dfd53a2d5438
Base   : main @ c8d8a8ad6a72949c248adb098a626d1ab9d6a579  (unchanged)
Env    : Preview only (yorisou-preview / nbltsbonsnbpfptihomc)
Status : YORISOU_CPC1_CONTINUATION_REQUIRED
```

## Workstream status

| WS | scope | status |
|---|---|---|
| 0 | Architecture freeze (5 contracts in `docs/ux2r/`) | **DONE** |
| 1 | Canonical result cutover | **PARTIAL** — exclusive persisted mode + concealed unavailable state + `dimensionOutput` on the view model **done**; persisted dimensions not yet *rendered*; `/report-loading` not yet honest; persisted/legacy component split not done |
| 2 | Stable identity propagation + legacy retirement | **NOT STARTED** (this is ICP-1 defect #4) |
| 3 | Authentication continuity | **PARTIAL** — claim-by-result API done incl. replay cookie rule; pending-intent, login/register bridges not done |
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

## Exact next action

**WS1 →** render persisted `dimensionOutput` in the result surface (Evidence / Constellation), split
`PersistedResultMode` from `LegacyCompatibilityResultMode`, and make `/report-loading` an honest
transition that preserves `?result` and never simulates computation.
**Then WS2 →** route `resultRowId` through share / report / recommendation / save; stop
`PrivateResultSave` creating a second result (in persisted mode "save" = claim).

## Verification state

tsc **0** · ESLint clean · production build passes · migration-scope guard passes.
No Preview-backed E2E exists yet. No a11y run yet for the new surfaces.
Production non-regression at this HEAD: **42 tables / 12 migrations / 0 leaked**, PR #113 and #125
untouched.

## Known-good invariants already proven against the real Preview DB

idempotent completion · claim single-use + owner-scoped · correction preserves the original ·
rejection and defer withhold both permissions · expiry denied at save/complete/read ·
append-only enforced outside the erasure context · true content-free tombstone ·
abandon kills token + blocks resume/save/complete/claim.
