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

## Recorded runs (final HEAD `f99a22c`, GitHub-verified)

| Run | Workflow | Event | Head SHA | Conclusion |
|---|---|---|---|---|
| 29714805258 | CPV1-CM0 CI (PR-check) | pull_request | f99a22c | success |
| 29714803873 | CPV1-CM0 CI | push | f99a22c | success |
| 29714805285 | Yorisou Check (main full suite — bonus non-regression) | pull_request | f99a22c | success |

- URL: https://github.com/MrShamann/yorisou-online/actions/runs/29714805258
- The clean-main branch additionally passes `main`'s own full CI ("Yorisou Check"), confirming no
  regression to production `main`.
- (Prior CM0 final HEAD `aec9d93` runs were CPV1-CM0 CI `29714007641` + Yorisou Check `29714007605`;
  CM0.1 supersedes them with the `f99a22c` runs above.)
