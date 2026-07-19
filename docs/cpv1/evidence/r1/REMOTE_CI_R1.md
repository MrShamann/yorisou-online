# CPV1-R1 §11 — Remote CI evidence (recorded successful run)

**Workflow:** `CPV1-R1 CI` ([`.github/workflows/cpv1-r1-ci.yml`](../../../../.github/workflows/cpv1-r1-ci.yml)) · id `316191987`
**Recorded run:** [`29689729276`](https://github.com/MrShamann/yorisou-online/actions/runs/29689729276)
**Event:** `push` · **Branch:** `feat/cpv1-integrated-platform` · **Head SHA:** `8439b86de76a37c9b47847be8eea89b3b82eb4aa`
**Conclusion:** ✅ `success` · **Window:** 2026-07-19T13:52:51Z → 13:55:47Z

This satisfies the §11 rule: GitHub Actions success is claimed **only** against a recorded run whose head SHA equals the pushed Part-A HEAD (`git rev-parse HEAD` = `8439b86…`, identical to the run's `headSha`). A second run (`pull_request` event) also fired for PR #114.

## Job 1 — Contracts, types, migration + secret guards → success

| Step | Result |
|---|---|
| TypeScript check (`tsc --noEmit`) | success |
| Focused lint (R1/CPV1 surface — **hard gate**) | success |
| Full-repo lint (report-only — pre-existing `origin/main` debt) | success |
| Migration-SQL guard (`validate-cpv1-migrations.mjs`) | success |
| Secret-pattern **hard gate** (`git grep` sk-/eyJ/sbp_) | success |
| gitleaks (report-only — pre-existing localStorage/save-state FPs) | success |
| CPV1 foundation contract (rights gate + §3–§10, 49 checks) | success |
| AIX regression (AIX-4, AIX-5) | success |
| Stranger-Ready regression (SR-1, SR-2) | success |
| App-platform regression (APP-1, APP-2) | success |
| Core product regression (c02, relationship-fatigue, result-reveal) | success |

## Job 2 — Fresh axe accessibility gate (0 critical + 0 serious) → success

| Step | Result |
|---|---|
| Install Playwright Chromium | success |
| Build (safe env defaults) | success |
| Start production server | success |
| Fresh axe (mobile/tablet/desktop × default/reduced-motion) | success |
| Upload axe evidence (artifact `cpv1-r1-axe-evidence`) | success |

## Honesty notes

- **Full-repo lint** and **gitleaks** are report-only, matching the repo's established treatment of pre-existing `origin/main` debt (the existing `Yorisou Check` workflow keeps lint report-only for the same reason). The R1/CPV1 surface is **hard-gated** by the focused-lint step and the secret-pattern hard gate, both green.
- The **migration guard is static** (no DB in CI). The DB apply + reversibility proof ran separately on local Supabase (5/5) — see [`CPV1_LOCAL_SUPABASE_VERIFICATION.sql`](../../CPV1_LOCAL_SUPABASE_VERIFICATION.sql).
- No production, `main`, or PR #113 state is touched by this workflow; it only reads the branch and runs checks.
