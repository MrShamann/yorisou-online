# CPV1-CM0 — Dependency Map

Branch `feat/cpv1-clean-main-foundation`, branched **directly from clean `main` @ `70da80a0`** (NOT from
PR #113 / PR #114). This map classifies every part of the CPV1 foundation by provenance.

## Inherited from production `main` (unchanged)
- The entire clean-`main` app + libs + the existing migration chain (`…202607160002`). CM0 adds to it;
  it changes **no** existing `main` file except `package.json` (one added `test:cpv1` script).
- The 9 product routes (`app/check-in`, `app/tests/{c02,relationship-fatigue,f01,f02,love-distance,work-rhythm,local-life,name-impression}`) exist on `main` (git-verified: `git cat-file -e origin/main:<route>`). CM0 does **not** modify them and does **not** activate them.

## Selectively extracted (unchanged) — the CPV1 contract lib
`lib/cpv1/{methods,rights,consent,history,understanding,deploymentContext,flags}.ts` — a **closed,
self-contained** dependency set: each imports only its CPV1 siblings (`methods→flags,rights`;
`flags→deploymentContext`; the rest import nothing). **Zero** branch-only imports. Ported verbatim from
`feat/cpv1-integrated-platform` (final R1.1A versions).

## Rewritten for clean-main compatibility
- `supabase/migrations/202607200001_cpv1_foundation_prereqs.sql` — **NEW.** Defines CPV1-OWNED helpers
  `yorisou_cpv1_current_account_id()` + `yorisou_cpv1_block_mutation()` (+ pgcrypto). Replaces the APP-2
  helpers that the stacked-branch CPV1 schema depended on (`public.yorisou_current_account_id` /
  `public.yorisou_app2_block_mutation` from APP-2's `202607190001`, which is **not on clean main**).
- `202607200002_cpv1_understanding_history_consent.sql` — the CPV1 tables (from stacked `…190002`) with
  the helper references rewritten to the CPV1-owned helpers; renumbered; header notes self-containment.
- `202607200003…` / `202607200004…` — renumbered from stacked `…190003/190004`; internal dependency
  references updated to the CM0 numbering. No APP-2 dependency.
- `lib/cpv1/__tests__/cpv1Contract.test.ts` — **NEW clean test**, stripped of every branch-only-dependent
  check (see CM0_EXTRACTION_REGISTER).
- `scripts/validate-cpv1-migrations.mjs` — extracted; globs the CM0 CPV1 migrations.

## Locally verified
- tsc (whole clean-main project) · focused eslint · **CPV1 contract test (60 checks)** · migration guard ·
  **isolated disposable-DB migration/RLS (25/25)** · changed-content gitleaks · `next build` · clean-main
  regression (`test:c02`, `test:relationship-fatigue`). See CM0_CONTRACT_VERIFICATION / CM0_MIGRATION_RLS.

## Remote-CI verified
- `CPV1-CM0 CI` on the new branch/PR — run URL + conclusion in CM0_CI.md.

## Deliberately NOT ported (forbidden dependency inheritance — CM0 §5)
- APP-2 migration `202607190001_app2_full_service_backend.sql` and its helpers — replaced by CPV1-owned.
- The A1–A5 P0-correction tests (import `@/app/result/reveal/revealContent`, `@/app/data/productCards`,
  `@/lib/app2/lineCallbackContract`) — branch-only application deps.
- The §5 route-file-reading + flow-mount tests (read `app/**` markup).
- All stacked-branch CPV1 docs (`00`, `11`–`19`, `90`, `91`, `92`) and the R1 evidence tree — stacked-branch
  evidence, NOT clean-main truth. CM0 has its own `docs/cpv1/evidence/cm0/`.
- Every UI / app / component change from AIX / APP-1 / APP-2 / SR / LINE / Founder-dashboards / desktop-PWA.

## Not implemented / not deployed
- No CPV1 user-facing UI; no method activation; no external-method content; no Companion / Community /
  Recommendation UI / Life Archive / Legacy. No deploy; no production or hosted-DB mutation. `public_active` = 0.
