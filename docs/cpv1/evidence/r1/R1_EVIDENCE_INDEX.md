# CPV1-R1 — Final Evidence Package (§15)

Truth, Contract and Verification Hardening of the CPV1 integrated preview (draft PR #114). All
work is local/Preview only; production is untouched.

## Repository state

| Item | Value |
|---|---|
| R1 starting HEAD | `57a9fff` (CPV1 final, before R1 §3) |
| Part-A final HEAD | `b6a92e0` |
| Part-B final HEAD | `0810956` (updated at closeout) |
| Branch | `feat/cpv1-integrated-platform` |
| Working tree | clean (only the two untracked audit/export files, untouched) |
| PR | #114 — OPEN, **draft**, base `feat/aix-1-ai-native-experience` (NOT main), NOT merged, NOT ready |
| PR #113 | OPEN, unmerged, unchanged (protected APP-2 baseline) |
| production `main` / `origin/main` | `70da80a09491b375c0e066be60bfe6411dc7cabc` — UNCHANGED |
| Production boundary | no merge, no deploy, no production migration/secrets/data, no real payment, no supplier contact, no public method/Legacy activation. Codex excluded. |
| Writer lock | held by this CPV1-R1 session throughout; released only at closeout after evidence + handoff |

## Rights and maturity

- **Rights-route matrix + per-route fixtures** — `lib/cpv1/rights.ts` (`ROUTE_RULES`,
  `rightsResolutionReport`); contract tests `cpv1Completion.test.ts` §3 (per-route pass/fail).
- **Seven maturity dimensions** — `methodMaturity()` (implementation · rights · content · privacy ·
  tests · route · founderActivation · publicRoute); `methodActivationState` ∈ `public_active |
  implemented_route_verified | implemented_private | gated | retired` (no collapsed `rights_blocked`;
  route/deployment/Founder-activation are separate — R1.1 §4). Tests §4.
- **Corrected count (R1.1 §4)** — **0 `public_active`** (no evidenced Founder activation; `publicMethods()`===0); **9 `implemented_route_verified`** (`productionRouteVerifiedMethods()`===9); 18 gated. See METHOD_STATE_TRUTH_TABLE_R1.1.
  See [`RUNTIME_TRUTH_R1.md`](./RUNTIME_TRUTH_R1.md) and `92_CPV1_METHOD_RUNTIME_RECONCILIATION.md`.

## Runtime truth (per method)

[`RUNTIME_TRUTH_R1.md`](./RUNTIME_TRUTH_R1.md) — all 27 methods with route / reachability / input /
calculation / result / report / save-history / tests / maturity / public-route decision. 9 `implemented_route_verified`
(real non-redirect routes + flows), 3 unbuilt originals + 15 external all `gated` (route: none).

## History, consent and deletion

- **Composite identity (11A.1)** — `stableIdentity(kind+methodId+methodVersion+objectRef)`; version /
  method / kind isolation + null-safe. Tests: same-id/diff-version, diff-method, obs-vs-result, null-safe,
  prior-versions-visible.
- **Exact version isolation** — `buildChangeView` confirmation keyed on composite identity only.
- **Permission independence (§9)** — `consent.ts` independent `purposes` + `visibility`; tests.
- **Immediate revocation** — §12 DB check 11 (revoke community → next read false; report independent).
- **Safe deletion tombstone (§8)** — `makeTombstone` (fixed non-personal detail); `tombstoneCarriesNoPersonalContent`.
- **Data-rights audit rejects personal free text (11A.2)** — `recordDataRightsEvent` reason-coded, no
  free-text param; `dataRightsEventCarriesNoFreeText`; DB CHECK (migration 004). §12 checks 13a/b/c.
- **Downstream exclusion after reject/delete/revoke** — `canUseDownstream` (understanding.ts); §12 check 12.

## Preview authorization

[`PREVIEW_AUTH_R1.md`](./PREVIEW_AUTH_R1.md) — **`CONTRACT_ONLY_NOT_RUNTIME_WIRED`**.
- Fail-closed unknown environment (11A.3) + exact required flag (11A.4); production + unknown always deny.
- local/test/Preview/production/unknown matrix + auth/admin matrix — `cpv1Completion.test.ts` §10.
- Runtime-consumer inventory: **zero** server routes consume `cpv1PreviewAccess`; no CPV1 route exists.

## Migration / RLS

[`MIGRATION_RLS_R1.md`](./MIGRATION_RLS_R1.md) + [`cpv1_rls_verify.sh`](./cpv1_rls_verify.sh) /
[`cpv1_rls_verify.out`](./cpv1_rls_verify.out) — **25/25 checks in an isolated disposable DB** (dropped
afterward; dev DB untouched): apply/order, grants, policies, inserts, user isolation, forged-id denial,
append-only, deletion/revocation, teardown, reapply, cleanup. Rollback = `LOCAL_DISPOSABLE_SCHEMA_ROLLBACK`.

## Accessibility

[`AXE_A11Y_R1.md`](./AXE_A11Y_R1.md) — **`LOCAL_PRODUCTION_BUILD_AXE_VERIFIED`** (0 critical + 0 serious,
24 runs, [`./axe/`](./axe)). **Hosted Vercel Preview axe NOT verified** — blocked by Vercel SSO deployment
protection (exact blocker recorded, not bypassed).

## Remote CI

[`REMOTE_CI_R1.md`](./REMOTE_CI_R1.md) + closeout report — `CPV1-R1 CI` workflow.
- **Hard gates**: tsc, focused lint (R1/CPV1), migration-SQL guard, secret-pattern grep, **changed-content
  gitleaks (`origin/main..HEAD`, 11A.8)**, fresh axe. **Report-only**: full-repo eslint, full-history gitleaks.
- **Final HEAD `231aa7e`**: PR-check run (tied to the final HEAD) = `pull_request` run
  [29693246945](https://github.com/MrShamann/yorisou-online/actions/runs/29693246945) — SUCCESS; the
  `push` run [29693245585](https://github.com/MrShamann/yorisou-online/actions/runs/29693245585) is also
  SUCCESS on 231aa7e. Both bindings GitHub-verified.

## Capability matrix and blockers (separated)

- **Corrected matrix** — `90_CPV1_CAPABILITY_MATRIX.md`, `91_CPV1_COMPLETION_REPORT.md`.
- **Blocker classes** (kept distinct): implementation (external unbuilt) · content (not authored) · rights
  (`review_required`) · privacy (not reviewed) · tests (not run) · security (RLS/append-only enforced,
  verified) · legal (Legacy) · operational (Founder activation) · hosted-verification (Vercel SSO blocks
  hosted axe) · Founder activation (public method/Legacy gates).
