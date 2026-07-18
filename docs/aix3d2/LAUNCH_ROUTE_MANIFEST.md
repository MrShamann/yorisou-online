# YORISOU — Final Launch Route Manifest (AIX-3D-2)

Authoritative, machine-verified disposition of every launch-relevant public route,
produced by the AIX-3D-2 full-route crawl (Playwright, desktop + mobile) against a
local production build at feature HEAD on `feat/aix-1-ai-native-experience`.

- **No launch route remains in the `legacy` family.**
- **0 crane / raster logo** on any public route.
- **0 axe-core (wcag2a + wcag2aa) serious/critical** across all 94 crawled routes.
- All redirects resolve once to a canonical destination (verified 307 at the edge;
  the crawl follows the redirect, so the HTTP column shows the destination's 200 and
  the `→ Canonical` column names the target).
- Internal `/admin/*`, `/admin-entry`, `/dev/*` and `/api/*` are engineering/admin
  surfaces, excluded from the public launch crawl (family `internal`).

## Approved route families

| Family | Count | Meaning |
|---|---|---|
| immersive | 11 | dark "Living Intelligence" product shell (home, catalogue, AIX-3C domains) |
| understand | 10 | AIX-3D-2 calm branded-light per-test flows under `/tests/*` |
| editorial | 27 | calm branded-light trust / info / legal / English pages |
| focus | 11 | shell-suppressed flow surfaces (check-in, result, report, auth) |
| line-context | 1 | `/line/mini-app` LINE continuity surface |
| redirect | 32 | duplicate / obsolete / superseded routes → canonical destination |
| retired | 2 | intentionally inert (`/insights/[slug]`, `/en/insights/[slug]` → 404) |
| internal | (not crawled) | `/admin/*`, `/admin-entry`, `/dev/*`, `/api/*` |

## Test-route dispositions (AIX-3D-2 focus)

- **Canonical catalogue:** `/tests` (immersive dark entry).
- **Canonical flow (flagship):** `/check-in` (imairo 120Q, focus/dark).
- **Canonical test flows (Understand, light):** `/tests/c02`, `/tests/f01`,
  `/tests/f02`, `/tests/relationship-fatigue`, `/tests/love-distance`,
  `/tests/local-life`, `/tests/work-rhythm`, `/tests/name-impression`.
- **Canonical flow utilities:** `/tests/*/return`, `/tests/[testId]/return`
  (transient private-save handlers, Understand ground).
- **Redirect → `/tests`:** `/tests/r01` (相性診断), `/tests/r04` (名前相性),
  `/tests/s01` (今日のおみくじ) — divination-adjacent, catalogue-absent, and
  referenced only by internal engine cross-links; consolidated per the platform's
  non-divination positioning. The underlying engines remain in `lib/`.

## Count accuracy (§10)

Each retained flow states its own real, distinct count — none stale:
imairo/`/check-in` **120問**, C02 **36問**, F01/F02 **60問**, relationship-fatigue
**24問** (a genuine distinct 24Q flow, preserved), love-distance **18問**,
work-rhythm **6問**, name-impression **5問**, local-life (4Q, no count claim).

## Intentional design decision — dark catalogue, light flows

`/tests` (catalogue) and `/check-in` (imairo) are the dark immersive product
entries; the secondary reflective test flows are the calm branded-**light**
Understand surface. This is deliberate: those flows embed the shared, hardcoded-light
recommendation/conversion components (`YorisouCompanionCard`,
`YorisouRecommendationSlot`, `ResultConversionCommunity`) that also render on the
light LINE mini-app, so the whole test-flow surface is one coherent light grammar.
The shared BrandLockup header/footer provides continuity across the dark→light
boundary (the same pattern as dark home → light trust pages).

## Legal / company metadata (§15)

The public company page (`/company`) states: 会社名 寄り添う（Yorisou）; 所在地
福岡県福岡市; 設立 2026年; 代表取締役 Jin Yang（ジン ヤン）; 事業内容
セルフリフレクションサービス等。 These are founder-supplied and internally
consistent; the workspace's machine-readable records (`PROJECT_MANIFEST.yaml`,
`PROJECT_IDENTITY.md`) carry **no** company legal metadata to verify against, so
these facts were **not** changed. **Action required (founder/legal):** confirm the
legal entity name, representative, address and establishment date before any legal
reliance. This is conservative and not materially launch-unsafe, so it is documented
rather than treated as a blocker.

## Full crawl

HTTP shown is the crawl's followed-redirect status (redirects are 307 at the edge);
`console` 401/404 entries are expected auth-gated-data fetches on unauthenticated
pages and intentional inert routes, not defects.

| Route | Disposition | Family | HTTP | → Canonical | Brand(desktop) | axe | crane | console | mobile |
|---|---|---|---|---|---|---|---|---|---|
| `/` | canonical | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/about` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/ai-advisor` | redirect | redirect | 200 | /support | Y | 0 | none | 0 | 200 |
| `/business` | redirect | redirect | 200 | / | Y | 0 | none | 0 | 200 |
| `/check-in` | canonical-flow | focus | 200 | — | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/co-design` | canonical | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/company` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/concept` | redirect | redirect | 200 | /methodology | Y | 0 | none | 0 | 200 |
| `/contact` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/dashboard/open-testing` | redirect | redirect | 200 | /login | Y | 0 | none | 0 | 200 |
| `/en` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/about` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/ai-advisor` | redirect | redirect | 200 | /en/support | Y | 0 | none | 0 | 200 |
| `/en/check-in` | redirect | redirect | 200 | /check-in | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/en/contact` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/forgot-password` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/insights` | redirect | redirect | 200 | /en | Y | 0 | none | 0 | 200 |
| `/en/insights/sample` | retired | retired | 404 | — | Y | 0 | none | 1 (auth-401/404 expected) | 404 |
| `/en/legal` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/line/mini-app/result` | redirect | redirect | 200 | /check-in | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/en/line/result` | redirect | redirect | 200 | /en/result | Y | 0 | none | 0 | 200 |
| `/en/login` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/partners` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/pilot` | redirect | redirect | 200 | /en | Y | 0 | none | 0 | 200 |
| `/en/privacy` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/product` | redirect | redirect | 200 | /en | Y | 0 | none | 0 | 200 |
| `/en/products` | redirect | redirect | 200 | /en | Y | 0 | none | 0 | 200 |
| `/en/progress` | redirect | redirect | 200 | /en | Y | 0 | none | 0 | 200 |
| `/en/register` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/reservation-mobility-support` | redirect | redirect | 200 | /en | Y | 0 | none | 0 | 200 |
| `/en/reset-password` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/result` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/result/continue` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/en/services` | redirect | redirect | 200 | /en | Y | 0 | none | 0 | 200 |
| `/en/support` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/experiences` | canonical | immersive | 200 | — | Y | 0 | none | 2 (auth-401/404 expected) | 200 |
| `/experiences/invite/demo` | canonical | editorial | 200 | — | Y | 0 | none | 1 (auth-401/404 expected) | 200 |
| `/forgot-password` | canonical | focus | 200 | — | Y | 0 | none | 0 | 200 |
| `/formal-check` | redirect | redirect | 200 | /check-in | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/insights` | redirect | redirect | 200 | /tests | Y | 0 | none | 0 | 200 |
| `/insights/sample` | retired | retired | 404 | — | Y | 0 | none | 1 (auth-401/404 expected) | 404 |
| `/legal` | redirect | redirect | 200 | /terms | Y | 0 | none | 0 | 200 |
| `/line/mini-app` | canonical | line-context | 200 | — | Y | 0 | none | 0 | 200 |
| `/line/mini-app/result` | redirect | redirect | 200 | /check-in | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/line/result` | redirect | redirect | 200 | /result | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/login` | canonical | focus | 200 | — | Y | 0 | none | 0 | 200 |
| `/methodology` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/online-check-in` | redirect | redirect | 200 | /check-in | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/open-testing` | canonical | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/partners` | canonical | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/pilot` | redirect | redirect | 200 | /contact | Y | 0 | none | 0 | 200 |
| `/privacy` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/private-state` | canonical | immersive | 200 | — | Y | 0 | none | 1 (auth-401/404 expected) | 200 |
| `/product` | redirect | redirect | 200 | / | Y | 0 | none | 0 | 200 |
| `/products` | redirect | redirect | 200 | / | Y | 0 | none | 0 | 200 |
| `/progress` | redirect | redirect | 200 | / | Y | 0 | none | 0 | 200 |
| `/recommendations` | canonical | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/recommendations/graph` | canonical | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/register` | canonical | focus | 200 | — | Y | 0 | none | 0 | 200 |
| `/report-loading` | canonical | focus | 200 | — | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/report-preview` | canonical | focus | 200 | — | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/reports` | canonical | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/reports/love-distance` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/reports/relationship-fatigue` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/reports/sample` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/reports/self` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/reports/self-understanding/EM-AK` | canonical | focus | 200 | — | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/reservation-mobility-support` | redirect | redirect | 200 | / | Y | 0 | none | 0 | 200 |
| `/reset-password` | canonical | focus | 200 | — | Y | 0 | none | 0 | 200 |
| `/result` | canonical | focus | 200 | — | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/result/continue` | redirect | redirect | 200 | /saved | Y | 0 | none | 1 (auth-401/404 expected) | 200 |
| `/result/return` | canonical-flow-utility | focus | 200 | — | Y | 0 | none | 0 | 200 |
| `/result/share` | canonical | focus | 200 | — | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/saved` | canonical | immersive | 200 | — | Y | 0 | none | 1 (auth-401/404 expected) | 200 |
| `/saved/c02/demo` | canonical | editorial | 200 | — | Y | 0 | none | 1 (auth-401/404 expected) | 200 |
| `/saved/tests/demo` | canonical | editorial | 200 | — | Y | 0 | none | 1 (auth-401/404 expected) | 200 |
| `/services` | redirect | redirect | 200 | /check-in | —(shell-suppressed/redirect) | 0 | none | 0 | 200 |
| `/support` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/terms` | canonical | editorial | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests` | canonical-catalogue | immersive | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/c02` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/c02/return` | canonical-flow-utility | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/f01` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/f02` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/local-life` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/love-distance` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/name-impression` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/r01` | redirect | redirect | 200 | /tests | Y | 0 | none | 0 | 200 |
| `/tests/r04` | redirect | redirect | 200 | /tests | Y | 0 | none | 0 | 200 |
| `/tests/relationship-fatigue` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/relationship-fatigue/return` | canonical-flow-utility | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/tests/s01` | redirect | redirect | 200 | /tests | Y | 0 | none | 0 | 200 |
| `/tests/work-rhythm` | canonical-test-flow | understand | 200 | — | Y | 0 | none | 0 | 200 |
| `/vision` | redirect | redirect | 200 | /methodology | Y | 0 | none | 0 | 200 |

