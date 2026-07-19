# CPV1-R1 §11 — Fresh accessibility evidence (axe)

**Date:** 2026-07-19 · **Branch:** `feat/cpv1-integrated-platform` · **Runner:** local production build (`next build` + `next start`) on `127.0.0.1:3000`, Playwright + axe-core injected.

This is a **fresh** run for R1 — not inherited from a prior package's harness. Spec: [`tests/smoke/cpv1r1-axe.spec.ts`](../../../../tests/smoke/cpv1r1-axe.spec.ts). Raw per-run JSON: [`./axe/`](./axe) (24 files).

## Why these surfaces

R1 §§7–10 changed **only lib/contract modules** (`understanding` / `consent` / `history` / `deploymentContext`) plus a migration and the contract test. `git diff e46ba43^..a659bd4 -- 'app/**/*.tsx' 'app/**/*.ts'` returns **no route files** — no user-facing markup changed. There is therefore **no new private/denial *route*** to audit (the §10 preview-access gate is a server-side pure module, not yet mounted on a page). The gate re-proves the platform's core reflective surfaces are still clean so R1 introduces no accessibility regression.

## Matrix (24 runs = 4 surfaces × 3 viewports × {default, reduced-motion})

| Surface | mobile 390 | tablet 768 | desktop 1280 |
|---|---|---|---|
| `/result` | 0/0 | 0/0 | 0/0 |
| `/reports` | 0/0 | 0/0 | 0/0 |
| `/reports/family/imairo` | 0/0 | 0/0 | 0/0 |
| `/reports/family/relationship-fatigue` | 0/0 | 0/0 | 0/0 |

Cells are **critical / serious** violation counts. Each also run once under `prefers-reduced-motion: reduce`.

## Result

- **Gate:** 0 critical + 0 serious (WCAG 2.0/2.1 A + AA + best-practice tags).
- **Aggregate across all 24 runs:** `critical:0, serious:0, moderate:0, minor:0, total:0`.
- **axe rule families covered** (best-practice + wcag): color-contrast, `page-has-heading-one`, `landmark-one-main`, `region`, `link-name`, `target-size` (touch), plus the full WCAG 2/2.1 A+AA rule set.
- **24 passed** (Playwright, `--project=desktop`, viewports driven inside the spec).

## Not covered here (belongs to the remote CI run, §11 part 2)

The same axe spec is wired into the CPV1-R1 GitHub Actions workflow so it runs on the pushed HEAD in CI; see [`REMOTE_CI_R1.md`](./REMOTE_CI_R1.md) for the recorded workflow-run conclusion.
