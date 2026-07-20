# CPV1-CM0 — Clean-Main Foundation Extraction — Final Report (§12)

First post-R1 implementation-foundation package: an independently buildable CPV1 contract/schema/
verification foundation extracted from clean production `main`, without merging or inheriting the PR #113 /
PR #114 stacked branches.

## Repository state
- **Starting `main` HEAD:** `70da80a09491b375c0e066be60bfe6411dc7cabc` (clean).
- **Final branch HEAD:** `49f4b69` (this report adds one docs commit; its own CI verified green at closeout).
- **Branch:** `feat/cpv1-clean-main-foundation` (from clean `main`; NOT from PR #113/#114).
- **Draft PR:** **#115** → base `main`, OPEN, **draft**, unmerged.
- Working tree clean (the two untracked audit/export files were never staged; Supabase CLI `.branches`/
  `.temp` cache never staged).

## Extraction register summary
- **Ported verbatim (self-contained):** `lib/cpv1/{methods,rights,consent,history,understanding,
  deploymentContext,flags}.ts` — a closed dependency set, zero branch-only imports. Plus
  `scripts/validate-cpv1-migrations.mjs`.
- **Rewritten for clean main:** 4 self-contained migrations `202607200001..004` (own CPV1 helpers, no
  APP-2 dependency); a NEW clean contract test; the CM0 CI workflow; a `test:cpv1` script.
- **Deliberately NOT ported:** APP-2 `202607190001` + its helpers; A1–A5 / route-file / LINE test checks;
  all stacked-branch CPV1 docs + R1 evidence; all AIX/APP/SR/LINE/dashboard/PWA UI. See
  `CM0_EXTRACTION_REGISTER.md` / `CM0_DEPENDENCY_MAP.md`.

## Files ported / not ported / dependency removals
- **Ported:** 7 `lib/cpv1` modules + validator.
- **Not ported:** APP-2 migration + helpers, branch-only test checks, stacked-branch docs, all UI/app.
- **Dependency removals:** APP-2 helper dependency (`yorisou_current_account_id` /
  `yorisou_app2_block_mutation`) → CPV1-owned `yorisou_cpv1_*`; branch-only test imports
  (`revealContent` / `productCards` / `lineCallbackContract`) → removed.

## Migration / RLS results
**25/25** checks in an isolated disposable DB (`cpv1cm0_verify`, dropped): self-contained apply,
CPV1-owned helpers present (APP-2 absent), RLS enabled+forced, grants, anon denial, user isolation,
forged-id denial, exact identity, independent consent + revocation, deleted flag, data-rights
no-free-text, append-only, registry admin-only, teardown, reapply, cleanup. Rollback =
`LOCAL_DISPOSABLE_SCHEMA_ROLLBACK`. See `CM0_MIGRATION_RLS.md`.

## Test results
`tsc` 0 · focused eslint clean · **CPV1 clean-main contract test 60 checks** (pure `lib/cpv1`; incl. 8
R1.1A negative activation-state gates) · migration guard PASS · changed-content gitleaks clean · `next
build` ✓ · clean-main regression `test:c02` + `test:relationship-fatigue` pass. See
`CM0_CONTRACT_VERIFICATION.md`.

## Final method-state counts
**`public_active` = 0** · `productionRouteVerifiedMethods()` = **9** · **18 gated**. No inferred Founder
activation; no inferred production deployment; enum-without-evidence not accepted; external methods
multi-dimension gated; no external calculation/interpretation content. The 9 product routes are NOT
converted into CPV1 public activation.

## CI run tied to final HEAD
`CPV1-CM0 CI` SUCCESS on `49f4b69` — PR-check `pull_request` run
[29713878435](https://github.com/MrShamann/yorisou-online/actions/runs/29713878435) + `push` run
[29713860844](https://github.com/MrShamann/yorisou-online/actions/runs/29713860844). The main-targeting
"Yorisou Check" full suite also passed on the PR (run 29713878489) — confirming no regression to `main`.
(This report's docs commit CI is verified green at closeout; URL in the PR #115 comment.)

## Invariants
- **Production `main` UNCHANGED** at `70da80a0`.
- **PR #113** OPEN, unmerged, unchanged (`head 8483333`). **PR #114** OPEN, draft, unmerged, unchanged
  (`head b16fa1f`).
- **PR #115** OPEN, **draft**, unmerged (base `main`).
- No deploy; no production / hosted-DB / LINE / secrets / real-user-data mutation; no method activation;
  no CPV1 UI. Codex excluded.

## Writer-lock + handoff
Writer lock released at closeout after evidence + handoff; handoff records the remaining scope (build the
CPV1 UI/product surfaces, external-method rights + content, Companion/Community/Legacy — none in CM0).

**Status:** `CPV1_CM0_CLEAN_MAIN_FOUNDATION_READY_FOR_FOUNDER_REVIEW`
