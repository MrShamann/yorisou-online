# CPV1-R1 §11 / 11A.7 — Accessibility evidence (axe)

**Date:** 2026-07-19 · **Branch:** `feat/cpv1-integrated-platform`

## Evidence classification (11A.7)

- **`LOCAL_PRODUCTION_BUILD_AXE_VERIFIED`** — the run below is against a **local production build** (`next build` + `next start` on `127.0.0.1:3000`), NOT a hosted deployment.
- **`HOSTED_PREVIEW_AXE_BLOCKED`** — the actual Vercel Preview for PR #114 (`https://yorisou-online-git-feat-cpv1-in-75fc71-shigeru-naganos-projects.vercel.app`) is behind **Vercel Authentication (SSO deployment protection)**: an unauthenticated request to `/reports` returns a redirect to `vercel.com/login?next=/sso-api?...`. Running axe there requires authenticating into the `shigeru-naganos-projects` Vercel org, which this session must not do (entering credentials is prohibited; it is the Founder's account). **This is an isolated external hosted-verification blocker, not a concealed product defect** — the same surfaces pass the fresh local-production-build axe run below, and no route markup changed in R1. Hosted Preview axe is **NOT** claimed as verified. To close it, the Founder can either disable Vercel deployment protection for this Preview or run axe from an authenticated session.

**Runner (local):** local production build, Playwright + axe-core injected. Fresh for R1 — not inherited from a prior package's harness. Spec: [`tests/smoke/cpv1r1-axe.spec.ts`](../../../../tests/smoke/cpv1r1-axe.spec.ts). Raw per-run JSON: [`./axe/`](./axe) (24 files).

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
