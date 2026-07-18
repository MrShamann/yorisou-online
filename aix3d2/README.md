# AIX-3D-2 — Per-Test Flow Completion, Final Route Crawl & Founder Evidence

Founder-review evidence for **AIX-3D-2**, the second and final pass of the split
AIX-3D launch-surface package. Together with AIX-3D-1 this completes the public
launch surface for a founder decision on whether to authorize a separate
production-release package.

**Status:** `AIX_3D_LAUNCH_SURFACE_COMPLETE_PREVIEW_READY_FOR_FINAL_FOUNDER_REVIEW`
Feature branch `feat/aix-1-ai-native-experience` @ `c978088`. PR #113 OPEN /
unmerged. Production untouched (`main` @ `70da80a`).

## What AIX-3D-2 completed

- **Every retained per-test route on one coherent Understand grammar** — a shared
  `UnderstandShell` + primitives, a centralized `understand` route family, and the
  five bespoke flows + C02/F01/F02 unified onto one calm branded-light ground
  (`#FBFAF6`). No launch `/tests` route remains `legacy`; the legacy `frontstage`
  shell is gone. Flow logic/scoring preserved verbatim.
- **Consolidation** — `/tests/r01` (相性診断), `/tests/r04` (名前相性), `/tests/s01`
  (今日のおみくじ) redirect to `/tests` (divination-adjacent, catalogue-absent).
- **Final authoritative launch route manifest** (`LAUNCH_ROUTE_MANIFEST.md`, also in
  `docs/aix3d2/` on the app branch): all 94 launch-public routes dispositioned,
  **0 legacy, 0 crane, 0 axe serious/critical**.

## Full-route crawl (Playwright, desktop + mobile)

- 94 launch-public routes crawled. `crawl-summary.json` holds the family / disposition
  counts. **axe-core (wcag2a + wcag2aa): 0 serious/critical across all routes.**
- All redirects resolve once to a canonical destination. 404s are the intentional
  inert insight `[slug]` routes; 401s are expected auth-gated data fetches on
  unauthenticated pages (not defects).

## Shots

Desktop (1280×900) unless noted.

| # | File | Route / state |
|---|------|---------------|
| 01 | `01-home.jpg` | Home (immersive) |
| 02 | `02-tests-catalogue.jpg` | `/tests` catalogue (immersive dark entry) |
| 03 | `03-tests-c02-intro.jpg` | `/tests/c02` — Understand light, shared shell |
| 04 | `04-tests-relationship-fatigue.jpg` | `/tests/relationship-fatigue` (24問) |
| 05 | `05-tests-love-distance.jpg` | `/tests/love-distance` (18問) |
| 06 | `06-tests-local-life.jpg` | `/tests/local-life` (was legacy frontstage) |
| 07 | `07-tests-work-rhythm.jpg` | `/tests/work-rhythm` (6問) |
| 08 | `08-tests-name-impression.jpg` | `/tests/name-impression` (5問) |
| 09 | `09-open-testing.jpg` | `/open-testing` |
| 10 | `10-recommendations.jpg` | `/recommendations` |
| 11 | `11-recommendations-graph.jpg` | `/recommendations/graph` |
| 12 | `12-reports.jpg` | `/reports` |
| 13 | `13-report-preview.jpg` | `/report-preview` |
| 14 | `14-experiences.jpg` | `/experiences` |
| 15 | `15-co-design.jpg` | `/co-design` |
| 16 | `16-partners.jpg` | `/partners` |
| 17 | `17-saved.jpg` | `/saved` |
| 18 | `18-private-state.jpg` | `/private-state` |
| 19 | `19-about.jpg` | `/about` |
| 20 | `20-methodology.jpg` | `/methodology` |
| 21 | `21-contact.jpg` | `/contact` |
| 22 | `22-privacy.jpg` | `/privacy` |
| 23 | `23-terms.jpg` | `/terms` |
| 24 | `24-company.jpg` | `/company` |
| 25 | `25-support.jpg` | `/support` |
| 26 | `26-en-overview.jpg` | `/en` English overview |
| 27 | `27-result-reveal.jpg` | `/result` reveal (YRR-1 preserved) |
| 28 | `28-report-full.jpg` | `/reports/self-understanding/[publicCode]` full report |
| 29 | `29-tests-c02-midtest.jpg` | `/tests/c02` mid-test (question view) |
| 30 | `30-tests-work-rhythm-result.jpg` | `/tests/work-rhythm` **full result** — embedded light Companion + RecommendationSlot coherent on the Understand ground |
| 31 | `31-home-mobile.jpg` | Home (mobile) |
| 32 | `32-tests-c02-mobile.jpg` | `/tests/c02` (mobile) |
| 33 | `33-relationship-fatigue-mobile.jpg` | `/tests/relationship-fatigue` (mobile) |
| 34 | `34-line-mini-app-mobile.jpg` | `/line/mini-app` LINE continuity (mobile) |
| 35 | `35-check-in-mobile.jpg` | `/check-in` imairo flow (mobile) |
| 36 | `36-home-reduced-motion.jpg` | Home under `prefers-reduced-motion` |

## Intentional design decision

The catalogue (`/tests`) and imairo (`/check-in`) are the dark immersive entries;
the secondary reflective flows are the calm branded-light Understand surface —
because they embed the shared, hardcoded-light recommendation/conversion components
(also used on the light LINE mini-app; protected). Shot 30 shows those embedded
components sitting coherently on the light ground. The BrandLockup header/footer
carries continuity across the dark→light boundary.

## Validation (@ `c978088`)

tsc 0 · eslint 0 (7 pre-existing warnings, untouched files) · build ✓ ·
contracts test:aix3/3b/3c/3d/**3d2** + logic suites · Playwright aix2 smoke 24/24 ·
axe 0 serious/critical across all 94 routes · gitleaks clean · CI green.

Protected boundaries (question bank/scoring/taxonomy/personas/result IDs, auth, LINE
identity/linking, recommendation ranking, DB/migrations, candidate intake, payments,
consent) + YRR-1 + RTR-1 intact.
