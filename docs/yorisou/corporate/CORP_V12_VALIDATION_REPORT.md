# CORP-v1.2 — validation report

All figures are observed results from the **production build** (`npm run build` + `next start`),
not from the dev server and not targets. Date: 2026-08-30.

## Build and code

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | **PASS** — no output |
| Lint | `npx eslint app/_corporate tests/corporate-p5r2 app/ventures app/build-with-us app/chigamo …` | **PASS** — exit 0 |
| Unit / guard tests | `node --import tsx --test tests/corporate-p5r2/*.test.ts` | **PASS — 11/11**, 0 fail |
| Production build | `npm run build` | **PASS** — compiled successfully |

### Guard tests (11)

Claim guard (4): no unsupported claim in locale copy · none in the view layer · Asterion never listed
as a venture · every locale keeps the Asterion independence boundary.
Token guard (3): no internal token in copy · none in the view layer · private mailbox absent.
Locale guard (4): all published locales load · no missing string vs the Japanese source · no locale
echoes the Japanese · every locale declares direction, endonym and script.

## Routes × locales

**189 / 189 = HTTP 200.** 9 corporate routes × 21 published locales.

`/` · `/ventures` · `/mirai-move` · `/kakari` · `/chigamo` · `/about` · `/build-with-us` ·
`/company` · `/contact`

## Locale correctness

- **21/21** correct `<html lang>`, `dir` and `data-script`. Arabic is the only `rtl`.
- **0** silent fallbacks — no route serves Japanese or English in place of a published locale.
- Locale propagates across every corporate link; selection is non-sticky by design.

## Leakage

**189 rendered pages scanned.** Internal tokens: **0**. Private mailbox: **0**.
"Powered by Asterion" (any form): **0**.

## Accessibility

- **axe: 0 violations across 56 page/locale combinations** (7 routes × 8 locales:
  ja en ar ko de ru hi th), WCAG 2.2 AA ruleset.
- Keyboard: language selector opens on Enter, focus moves into the dialog, Escape closes it and
  focus returns to the trigger. **All four assertions pass.**
- Reduced motion: 0 elements still animating, 0 stuck invisible.
- `document.documentElement.lang` / `dir` asserted per locale — see above.
- Lighthouse Accessibility: **100** on all three targets.

## Responsive

**210 combinations clean** — 7 viewports (1440 / 1280 / 1024 / 768 / 430 / 390 / 375) × 6 locales
(ja en de ar ru th) × 5 routes. Zero horizontal overflow, zero elements bleeding past the viewport,
zero narrow-column text fragmentation.

## Consumer non-regression

| Check | Result |
|---|---|
| `/en` | 200, `lang=en` — unchanged |
| `/methodology` `/privacy` `/explore` `/insights` | 200, `lang=ja` — unchanged |
| `/concept` `/legal` `/partners` `/check-in` | 307 → 200, `lang=ja`. **Pre-existing app redirects**, untouched by this package (`git diff` vs `0e4b2a3` is empty for those paths) |
| Unknown path `/definitely-not-a-route` | **404** |
| Dynamic unknown `/connect/pair-nonexistent` | **404** |
| 120Q runtime, scoring, taxonomy | **Not touched.** No file under the assessment runtime is in this diff |

## Performance (Lighthouse, local `next start`, mobile throttling)

| Target | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home ja | 61 | **100** | **100** | **100** | 7.7 s | 0 | 0 ms |
| Home ar | 87 | **100** | **100** | 63 | 3.8 s | 0 | 10 ms |
| Company ja | 62 | **100** | **100** | 63 | 7.2 s | 0 | 0 ms |

**Reading these honestly.** Accessibility and best practices are 100 everywhere; CLS is 0 and TBT is
effectively 0. Performance is **not** at the ≥90 mobile target on Japanese pages, and that is
reported as a miss rather than dressed up. Two contributing factors are identified and neither is
fixed here: the Japanese pages load a heavier web-font payload than the Arabic page (87 vs 61 on the
same server), and these numbers come from a local `next start` under Lighthouse's mobile throttling
rather than from a CDN. The correct next step is to measure on the Vercel Preview before optimising.

**SEO 63 on `/company` and `home-ar` is the crawl policy working, not a defect**: `/company` is in
`CORPORATE_BLOCKED` and `?lang=` URLs do not match the anchored `Allow: /$` rule. `robots.ts` is
unchanged by this package.

Locale bundles remain per-locale dynamic imports — one locale's content per visitor, not all 21.

## Known CI failure — pre-existing

`Lint, Build & Env Check` fails on `archP3DailyDiscovery.test.ts` assertion L/M, which requires
`app/page.tsx` to be the consumer "Today" surface. The root route stopped being Today at `9f0e8ff`;
PRs #154 and #155 fail the identical check. **The guard was not weakened, skipped or rewritten.**
See `CORP_V12_RELEASE_BLOCKERS.md` §8.
