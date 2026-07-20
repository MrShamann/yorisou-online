# CPV1-CM0 — Contract verification (clean-main, self-contained)

All run on `feat/cpv1-clean-main-foundation` (from clean `main` @ `70da80a0`). The CPV1 foundation builds
and tests independently of PR #113 / PR #114.

| Check | Result |
|---|---|
| `tsc --noEmit` (whole clean-main project + CPV1 lib) | 0 errors |
| Focused eslint (`lib/cpv1`, validator) | clean |
| **CPV1 clean-main contract test** (`lib/cpv1/__tests__/cpv1Contract.test.ts`, pure `lib/cpv1` only) | **62 checks passed** |
| — CM0.1 cross-layer parity: DB `activation_state` set === TS `METHOD_ACTIVATION_STATES` (5); no obsolete states; registry maturity fields + constraints present | ✓ |
| — includes rights gate §3, maturity §4, activation-state R1.1A + **8 negative gates §7** | ✓ |
| — includes understanding §7/11A.6, consent §9, history §8/11A.1/11A.2, deployment §10/11A.3/11A.4 | ✓ |
| Migration-SQL guard (4 CM0 migrations; CM0.1 obsolete-state hard gate) | PASS (forward additive; LOCAL_DISPOSABLE_SCHEMA_ROLLBACK; rejects `rights_blocked`/`contract_only`) |
| Isolated disposable-DB migration/RLS + registry schema-contract | **45/45** (see CM0_MIGRATION_RLS.md) |
| Changed-content gitleaks (extracted files) | no leaks |
| `next build` (clean main + CPV1 foundation) | ✓ Compiled successfully |
| Clean-main regression `test:c02`, `test:relationship-fatigue` | pass (no CPV1 regression on main) |

## Activation-state truth (preserved from R1.1A)
`public_active = 0` · `productionRouteVerifiedMethods() = 9` · 18 gated. No inferred Founder activation; no
inferred production deployment; enum-without-evidence not accepted; external methods multi-dimension gated;
no external calculation/interpretation content. The 9 product routes are NOT converted into CPV1 public activation.

## Accessibility
Not applicable — CM0 changes **no** user-facing route or rendered markup (only `lib/cpv1`, self-contained
migrations, the pure contract test, the CI workflow, `package.json` test script, and `docs/cpv1/evidence/cm0/`).
