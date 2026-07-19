# CPV1-R1 §5 — Method Runtime Reconciliation

Runtime-truth audit: every method previously classified public-active was checked
for an **actual runtime chain** (route → flow → result), not a registry
declaration. A registry entry is not evidence of implementation. Methods whose
full runtime chain could not be proven were downgraded. **Corrected count: 9
public-active (was 10).**

## Public-active — PROVEN (9)

Each has a real route on **production `main @ 70da80a`** mounting a real flow
component (verified: route file exists, is not a redirect, mounts a `*Flow`), with
real questions/scoring/result. Live-verified in the CPV1 Preview build.

| Registry ID | Route | Runtime call path | Impl evidence | Tests | Reachable | 7-dim maturity | Public route |
|---|---|---|---|---|---|---|---|
| `imairo-120q` | `/check-in` | `MiniTestFlow` → 120Q bank → scoring → `/result` | `app/check-in/MiniTestFlow.tsx`, live screenshot | sr2 + resultReveal + cpv1 §5 | yes | impl=complete rights=cleared content=authored privacy=reviewed tests=passing gate=open | **available (production)** |
| `c02-current-state` | `/tests/c02` | `RuleBasedTestFlow` + `c02Runtime` | `lib/yorisou-tests/c02` | sr2 + cpv1 §5 | yes | all pass | **available (production)** |
| `relationship-fatigue-24q` | `/tests/relationship-fatigue` | flow + `data.ts` (459L) | real 24Q data | sr2 + cpv1 §5 | yes | all pass | **available (production)** |
| `f01-work-fit` | `/tests/f01` | `RuleBasedTestFlow` | real runtime | sr2 + cpv1 §5 | yes | all pass | **available (production)** |
| `f02-workplace-fit` | `/tests/f02` | `RuleBasedTestFlow` | real runtime | sr2 + cpv1 §5 | yes | all pass | **available (production)** |
| `love-distance` | `/tests/love-distance` | flow | real runtime | sr2 + cpv1 §5 | yes | all pass | **available (production)** |
| `work-rhythm` | `/tests/work-rhythm` | flow | real runtime | sr2 + cpv1 §5 | yes | all pass | **available (production)** |
| `local-life` | `/tests/local-life` | flow | real runtime | sr2 + cpv1 §5 | yes | all pass | **available (production)** |
| `name-impression` | `/tests/name-impression` | flow | real runtime | sr2 + cpv1 §5 | yes | all pass | **available (production)** |

## Downgraded — DISCREPANCIES

| Registry ID | Claimed (before audit) | Route | Runtime | Evidence | Corrected 7-dim maturity | Corrected public route | Discrepancy | Corrective action |
|---|---|---|---|---|---|---|---|---|
| `yorisou-values` | `public_active` | **NONE** (`/tests/values` does not exist) | **none** | nothing outside the registry references it | impl=not_started rights=review_required content=not_authored privacy=not_reviewed tests=not_run gate=closed | **unavailable** | classified public-active on a registry declaration alone; not built | **DONE** — downgraded to unbuilt + dev-flagged; removed from public count |
| `reflection-cadence` | `contract_only` (impl in_progress) | none | none | none | impl=not_started tests=not_run | unavailable | over-stated `in_progress` for an unbuilt method | **DONE** — corrected to `not_started` |
| `yorisou-motivation` | `contract_only` (impl in_progress) | none | none | none | impl=not_started tests=not_run | unavailable | over-stated `in_progress` for an unbuilt method | **DONE** — corrected to `not_started` |

## Inherited routes audited (not registered as active methods)

| Route | Runtime | State | Registered? |
|---|---|---|---|
| `/tests/r01`, `/tests/r04`, `/tests/s01` | `redirect("/tests")` | redirect-only (engine preserved in `lib/`; positioning-retired) | No — correctly absent from the registry |

## Result

- **Public-active method count corrected everywhere: 9** (not 10). The registry,
  `publicMethods()`, the capability matrix, and the evidence now use 9.
- No protected questions, scoring, taxonomy, result IDs, or report mappings were
  changed — only the maturity classification of unbuilt methods.
- Enforced by `cpv1Completion.test.ts` §5 (exactly 9 public, each with a real
  non-redirect route + flow; `yorisou-values` downgraded; redirect-only routes
  unregistered).
