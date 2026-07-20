# MTF-1 — Catalog Reconciliation Specification

**Specification only — no runtime catalog is changed in MTF-1.**

## 1. The current catalogs and their mismatches (MTF-0 verified, main @ `0bd76b3`)

| Catalog | Location | Members | Mismatch vs reality |
|---|---|---|---|
| CPV1 method registry | `lib/cpv1/methods.ts` `CPV1_METHOD_UNIVERSE` | 27 (9 route-verified, 18 gated) | **Omits R01/R04/S01** — production-active flows with no registry row; includes 18 methods with no assets |
| `PHASE1_TEST_CATALOG` | `lib/yorisou-tests/catalog.ts` | 3 (C02/F01/F02) | What `/tests` renders — omits 9 other live flows |
| Open-testing entries | `app/data/yorisouTests.ts` | 5 (current-state, LD, WR, NI, LL) | Different subset; omits C02/F01/F02/RF/R01/R04/S01 |
| Product cards | `app/data/productCards.ts` | 5 cards | Carries the false 「24問」 badge (T4); marketing layer, not a registry |
| **Actual Production routes** | HTTP-verified 2026-07-20 | **12 live flows** (all 200) | The only complete list — and it exists nowhere as data |

No two catalogs agree; none equals production truth. This is the reconciliation target.

## 2. Future canonical model — one registry, many projections

**Principle:** ONE canonical method registry (the CPV1 registry, extended to cover ALL production methods including R01/R04/S01 under their canonical IDs `r01-pair-love` *(registration id TBD at implementation)* / `r04-name-pair` / `s01-omikuji`), from which every user-facing catalog is a **projection with an explicit filter**, never a hand-maintained list:

- `/tests` index = projection: `activation_state ∈ {public_active, implemented_route_verified} AND navigation_flag`.
- Marketing cards = projection + editorial copy layer (copy must pass the truth rule: advertised count == served count).
- LINE mini-app entries = projection with `channel ⊇ line_liff`.
- Admin readiness = full registry, no filter.

Hand-maintained duplicate lists (`yorisouTests.ts`-style) are retired at implementation time. Until then, the four existing catalogs remain untouched and this document is the reconciliation map.

## 3. The eight distinct states (must never be conflated)

| # | State | Meaning | Example today |
|---|---|---|---|
| 1 | **Route exists** | A page/module for the method exists in the repo | all 12 flows + `/en/result` lab |
| 2 | **Route publicly reachable** | The route serves 200 on Production | all 12 flows (R01/R04/S01 included) |
| 3 | **Method implemented** | Bank + scoring + result assembly verified | the 12; NOT the 18 gated registry rows |
| 4 | **Rights-cleared** | Rights route resolved with evidence | the first-party 12; NOT big-five/traditional entries |
| 5 | **Founder-activated** | CPV1 `public_active`: all 10 dimensions incl. deployment evidence ref + founder decision ref | **0 methods today** |
| 6 | **Launch Core member** | Product-planning group in the frozen universe | 10 methods (incl. 3 unbuilt) |
| 7 | **Appears in navigation** | Linked from `/tests`, home, or LINE surfaces | subsets per catalog — currently inconsistent |
| 8 | **May contribute to private understanding** | method_evidence_class permits understanding contribution (two-class symbolic boundary) | `traditional_symbolic` → symbolic-reflection layer only; `traditional_symbolic_entertainment` fully excluded; per-purpose consent required |

A method can be publicly reachable (2) without being Founder-activated (5) — that is today's actual production state for all 12 flows, and it is the central distinction the old catalogs blur. Conversely a Launch Core member (6) can be entirely unbuilt (daily-check-in). Navigation (7) is a channel decision, not an activation. Understanding contribution (8) is a consent + evidence-class decision, orthogonal to all of the above.

## 4. Migration path (later package)

1. Register R01/R04/S01 in the CPV1 registry with truthful states (implemented, route-verified, founder-activation unverified; S01 with `traditional_symbolic_entertainment` + empty recommendation role).
2. Add a `navigation_flag`/channel field to the registry snapshot (schema-additive; separate migration package).
3. Re-point `/tests`, cards, and LINE entries at registry projections; delete the hand lists.
4. Contract-test: every projection ⊆ registry; advertised counts == served counts; no projection shows a `gated` method.
