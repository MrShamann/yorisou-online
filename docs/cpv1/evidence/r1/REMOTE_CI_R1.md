# CPV1-R1 — Remote CI evidence (recorded successful runs)

**Workflow:** `CPV1-R1 CI` ([`.github/workflows/cpv1-r1-ci.yml`](../../../../.github/workflows/cpv1-r1-ci.yml)) · id `316191987`

## FINAL HEAD `231aa7e` (R1.1-corrected)

GitHub records two green `CPV1-R1 CI` runs on the final HEAD `231aa7e7a8748bcb48044c623e3821aae5d5f339`;
**both are on the final HEAD, both `success`.** The **PR-check run tied to the final HEAD** is the
`pull_request` run:

| Run | Event | Head SHA | Conclusion |
|---|---|---|---|
| [`29693246945`](https://github.com/MrShamann/yorisou-online/actions/runs/29693246945) **(PR-check / final-HEAD)** | `pull_request` | `231aa7e` | ✅ success |
| [`29693245585`](https://github.com/MrShamann/yorisou-online/actions/runs/29693245585) | `push` | `231aa7e` | ✅ success |

Both run→sha bindings were verified from GitHub via `gh run view`. (An earlier evidence draft cited only
the `push` run `29693245585`; R1.1 §2 corrects the canonical reference to the `pull_request` PR-check run
`29693246945`, and lists both.)

## Part-A HEAD `8439b86` (historical, full code surface)

**Recorded run:** [`29689729276`](https://github.com/MrShamann/yorisou-online/actions/runs/29689729276)
**Event:** `push` · **Head SHA:** `8439b86de76a37c9b47847be8eea89b3b82eb4aa` · **Conclusion:** ✅ `success`.
The step tables below are from this Part-A run (the workflow definition is identical on the final HEAD).

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
