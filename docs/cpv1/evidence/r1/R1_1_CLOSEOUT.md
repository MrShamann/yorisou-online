# CPV1-R1.1 — Evidence Truth & Activation-State Correction — Closeout (§7)

Bounded corrective continuation of CPV1-R1. Local/Preview only; production untouched. No new
workstream, no user-facing features, no external methods, no merge/deploy.

## Repository state
- **Starting HEAD (R1.1):** `231aa7e` · **R1.1 code/docs HEAD:** `46df783` (this closeout adds one docs
  commit; its own CI verified green at closeout).
- Branch `feat/cpv1-integrated-platform`; working tree clean (only the two untracked audit/export files,
  untouched).
- PR #114 OPEN, **draft**, base `feat/aix-1-ai-native-experience` — **retitled**
  *"CPV1-R1 — Contract, Schema and Runtime-Truth Foundation (stacked draft; DO NOT MERGE)"*. Not ready, not merged.
- PR #113 OPEN, unmerged, unchanged (`head 8483333…`).
- Production `main` / `origin/main` UNCHANGED at `70da80a0`.

## §2 — Final CI run reference (corrected)
GitHub-verified (`gh run view`): on final HEAD `231aa7e` **two** `CPV1-R1 CI` runs are green —
the **PR-check run tied to the final HEAD is the `pull_request` run `29693246945`** (SUCCESS), and the
`push` run `29693245585` is also SUCCESS. The R1.1 HEAD `46df783` is likewise green on both its
`pull_request` run `29711833719` and `push` run `29711832401`. Evidence files updated to cite the
`pull_request` PR-check run and list both; no reference now attributes a run to the final HEAD without a
verified `headSha` match.

## §3 — Rollback terminology (corrected)
Every "non-destructive" claim was removed from the CPV1 rollback surface: workflow step name, the
validator success message, and migration `002`/`003` headers now say **structurally + data destructive**.
Canonical classification **`LOCAL_DISPOSABLE_SCHEMA_ROLLBACK`**: forward migration is **additive**; the
rollback **may be structurally and data destructive**; rollback verification is permitted **only in a
disposable local database**; it is **not a production rollback**. `scripts/validate-cpv1-migrations.mjs`
was inspected and now (a) never reports a false "non-destructive" classification and (b) actively FAILS
if a migration whose rollback drops tables/columns lacks the `LOCAL_DISPOSABLE_SCHEMA_ROLLBACK` label or
claims "non-destructive" (negative-control verified; the guard caught and forced correction of the
prior "NOT non-destructive" phrasing).

## §4 — `public_active` semantics (resolved) + 9-method truth table
Implementation status, route existence+environment, deployment, Founder public-activation, and public
availability are now **separate** contract concepts (`lib/cpv1/methods.ts`): new `RouteStatus`,
`FounderActivationStatus` gains `unverified`, `MethodMaturity.route`, an **explicit** registry
`founderActivation` field (no longer inferred from the `originalActive` constructor — renamed
`originalRouteVerified`). `methodActivationState` adds `implemented_route_verified` and returns
`public_active` only when public availability is derived true, which requires an **explicit evidenced
Founder activation** AND a production-main route.

**Result:** **0 `public_active`** (`publicMethods()`===0 — no evidenced Founder activation); **9
`implemented_route_verified`** (`productionRouteVerifiedMethods()`===9 — routes git-verified present on
production `main`); **18 `gated`**. Full 9-method truth table against the 8 conditions:
[`METHOD_STATE_TRUTH_TABLE_R1.1.md`](./METHOD_STATE_TRUTH_TABLE_R1.1.md) — conditions 1/3/4/6/7 evidenced,
5 asserted-only, **2 (live production deployment) and 8 (explicit Founder activation) not evidenced**, so
none may be `public_active`. Tests, docs (00/90/91/92), and evidence updated accordingly.

## §5 — PR positioning (corrected)
Title + opening status rewritten to *Contract, Schema and Runtime-Truth Foundation* — explicitly: stacked
on PR #113; not a clean-`main` production candidate; **no wired CPV1 UI**; Preview authorization
`CONTRACT_ONLY_NOT_RUNTIME_WIRED`; Production unchanged. It no longer implies a complete integrated
user-facing Preview.

## §6 — Verification
- **Contract suite: 58 checks** (added the §4 route/Founder-activation separation tests). Regression
  aix4/aix5/sr1/sr2/app1/app2 + c02/relationship-fatigue/result-reveal all pass. `tsc` 0.
- Focused lint (R1/CPV1 surface) clean; migration validator PASS; changed-content gitleaks
  (`origin/main..HEAD`) clean.
- **Fresh local axe: not re-run — not affected.** R1.1 changed no `app/**` route markup (only
  `lib/cpv1/methods.ts`, tests, validator, workflow, migration comments, docs; `git diff 231aa7e..46df783
  -- app/` is empty). The `LOCAL_PRODUCTION_BUILD_AXE_VERIFIED` evidence (0 critical + 0 serious) still
  holds; **hosted Preview axe remains NOT verified** (Vercel SSO blocker, unchanged).
- **Remote CI:** `CPV1-R1 CI` SUCCESS on `46df783` — PR-check `pull_request` run
  [29711833719](https://github.com/MrShamann/yorisou-online/actions/runs/29711833719); `push` run
  [29711832401](https://github.com/MrShamann/yorisou-online/actions/runs/29711832401) also green.

## Production-boundary + lock
Production unchanged; PR #113 unchanged; PR #114 draft; no deploy/prod-migration/secrets/data; Codex
excluded; untracked audit/export files untouched. Writer lock released at closeout after evidence +
handoff.

**Status:** `CPV1_R1_1_TRUTH_CORRECTIONS_READY_FOR_FOUNDER_REVIEW`
