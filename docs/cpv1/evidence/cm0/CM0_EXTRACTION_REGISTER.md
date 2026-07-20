# CPV1-CM0 — Extraction Register

Source branch for all extractions: **`feat/cpv1-integrated-platform` @ `b16fa1f`** (the accepted R1.1A
foundation). Destination branch: **`feat/cpv1-clean-main-foundation`** (from clean `main` @ `70da80a0`).

## Ported verbatim (self-contained; no clean-main modification required)

| Object | Source file | Source commit | Destination | Dependencies | Modifications | Validation |
|---|---|---|---|---|---|---|
| Method + maturity + activation contract | `lib/cpv1/methods.ts` | `5a44d0f` | same | `./flags`, `./rights` | none | tsc, contract test §4/§7 |
| Rights + route-gate contract | `lib/cpv1/rights.ts` | `e46ba43` | same | none | none | tsc, contract test §3 |
| Consent contract | `lib/cpv1/consent.ts` | `71c50c6` | same | none | none | tsc, contract test §9 |
| History + data-rights contract | `lib/cpv1/history.ts` | `7407827` | same | none | none | tsc, contract test §8/11A.1/11A.2 |
| Understanding + relation contract | `lib/cpv1/understanding.ts` | `7407827` | same | none | none | tsc, contract test §7/11A.6 |
| Deployment-context + flags gate | `lib/cpv1/deploymentContext.ts` | `7407827` | same | none | none | tsc, contract test §10/11A.3/11A.4 |
| Dev-flag adapter | `lib/cpv1/flags.ts` | `7407827` | same | `./deploymentContext` | none | tsc, contract test 11A.4 |
| Migration validator | `scripts/validate-cpv1-migrations.mjs` | `46df783` | same | none | none | run PASS (4 files) |

## Rewritten for clean-main compatibility

| Object | Source | Destination | Modification (why) | Validation |
|---|---|---|---|---|
| CPV1 prereq helpers | (was APP-2 `202607190001`) | `202607200001_cpv1_foundation_prereqs.sql` (**NEW**) | Define CPV1-OWNED `yorisou_cpv1_current_account_id()` + `yorisou_cpv1_block_mutation()` + pgcrypto — APP-2's helpers are NOT on clean main | disposable-DB apply PASS |
| CPV1 tables/RLS/grants | `…190002` | `202607200002_…` | Helper refs `yorisou_current_account_id`→`yorisou_cpv1_current_account_id`, `yorisou_app2_block_mutation`→`yorisou_cpv1_block_mutation`; renumbered; self-containment header | disposable-DB RLS 25/25 |
| Relations/permissions/data-rights | `…190003` | `202607200003_…` | Renumbered; internal dep refs updated | disposable-DB PASS |
| Data-rights reason codes | `…190004` | `202607200004_…` | Renumbered; internal dep refs updated | disposable-DB checks 13a/b/c |
| Clean CPV1 contract test | `lib/yorisou-tests/__tests__/cpv1Completion.test.ts` | `lib/cpv1/__tests__/cpv1Contract.test.ts` (**NEW**) | Removed all branch-only-dependent checks; condensed §5 to registry-only | 60 checks PASS |
| CM0 CI workflow | (new) | `.github/workflows/cpv1-cm0-ci.yml` | focused CI for the CM0 branch | CI green (CM0_CI.md) |
| `test:cpv1` script | (new) | `package.json` | point at the clean CPV1 contract test | run PASS |

## Deliberately NOT ported (dependency removals)

| Object | Reason |
|---|---|
| APP-2 `202607190001_app2_full_service_backend.sql` + `yorisou_current_account_id`/`yorisou_app2_block_mutation` | APP-2-only; replaced by CPV1-owned prereq helpers |
| A1–A5 P0-correction test checks | import `@/app/result/reveal/revealContent`, `@/app/data/productCards`, `@/lib/app2/lineCallbackContract` (branch-only) |
| §5 route-file-reading + flow-mount test checks | read `app/**` markup (app layer, not CPV1 lib) |
| Stacked-branch CPV1 docs `00`/`11`–`19`/`90`/`91`/`92` + R1 evidence tree | stacked-branch evidence, not clean-main truth |
| All AIX/APP-1/APP-2/SR/LINE/Founder-dashboard/desktop-PWA UI + libs | forbidden dependency inheritance (CM0 §5) |

**No object was copied merely because it exists in PR #114.** No stacked-branch completion claim or
branch-specific evidence was carried over as current clean-main truth.

## CM0.1 corrections (schema/contract parity — same branch, no new PR)

| Object | Change |
|---|---|
| `202607200002` registry snapshot | activation_state enum → the 5 TS states (drop `rights_blocked`/`contract_only`; add `implemented_route_verified`/`gated`); added 10 explicit maturity fields + 4 consistency constraints (evidence-gated deployment/Founder; public_active=10; implemented_route_verified=6) |
| `202607200002` comments | corrected stale APP-2 dependency (→ `202607200001`) + history-guard (→ `yorisou_cpv1_block_mutation`) |
| `lib/cpv1/methods.ts` | exported canonical `METHOD_ACTIVATION_STATES` |
| `lib/cpv1/__tests__/cpv1Contract.test.ts` | +2 parity checks (DB set === TS set; fields+constraints present) — 62 checks |
| `scripts/validate-cpv1-migrations.mjs` | hard-gate: obsolete `rights_blocked`/`contract_only` in executable SQL fails (negative-control verified) |
| `docs/cpv1/evidence/cm0/cm0_rls_verify.sh` | +20 registry schema-contract checks — 45/45 |
