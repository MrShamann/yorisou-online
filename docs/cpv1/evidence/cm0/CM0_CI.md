# CPV1-CM0 — Remote CI

Workflow `CPV1-CM0 CI` (`.github/workflows/cpv1-cm0-ci.yml`) on `feat/cpv1-clean-main-foundation` + the new
draft PR to `main`.

- **Hard gates:** tsc, focused lint (`lib/cpv1`), migration-SQL guard, secret-pattern grep, changed-content
  gitleaks (`origin/main..HEAD`), the clean CPV1 contract test, clean-main regression (`test:c02`,
  `test:relationship-fatigue`), and the independent `next build`.
- **Report-only:** full-history gitleaks (pre-existing `main` localStorage/save-state false positives).
- **No axe** — CM0 changes no user-facing route markup.

**Recorded run tied to the final HEAD:** see the final report / PR comment (URL + conclusion + head SHA),
GitHub-verified via `gh run view`.
