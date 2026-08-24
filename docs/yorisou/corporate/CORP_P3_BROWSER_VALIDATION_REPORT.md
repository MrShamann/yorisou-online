# CORP-P3 — Browser Validation Report

**Package:** CORP-P3 · **Date:** 2026-08-24 · **Target:** local production build on `:3311`
(`next build` → `next start`). No authentication, no Production session, no external account.

> ## Verdict: `PASS`

Every blocking gate passed. Two real defects were found *by* these gates and fixed before this
report was written; both are recorded in §3 rather than omitted.

## 1. Commands and results

| # | Command | Observed | Verdict |
|---|---|---|---|
| G16a | `npx tsc --noEmit` | exit 0, zero diagnostics | **PASS** |
| G16b | `npx eslint app/prototype/corporate --max-warnings=0` | exit 0, no output | **PASS** |
| G16c | `npm run build` | exit 0, "✓ Compiled successfully"; all six corporate routes in the manifest | **PASS** |
| G1–G14 | `node test-results/corp-p3-validate.mjs` | 30 combinations; totals below | **PASS** |
| G15 | `CHROME_PATH=… npx lighthouse … --preset=desktop --screenEmulation.mobile` × 3 routes | scores below | **PASS** |

### Aggregate over 30 route × viewport combinations

```
axe=0  serious=0  ext+api=0  consoleErr=0  overflow=0  tap<44=0
clipped=0  heroOrphan=0  punctOnlyLine=0  よりそいSplit=0  prohibited=0
```

All six routes returned HTTP 200 at all five widths.

## 2. Gate-by-gate

| Gate | Result | Verdict |
|---|---|---|
| G1 Smoke | 6 routes × 5 widths, all HTTP 200 | PASS |
| G2 Responsive | 0 horizontal overflow at 320/390/768/1280/1440 | PASS |
| G3 Clipped text | 0 clipped elements | PASS |
| G4 Japanese layout | 0 single-char orphan · 0 punctuation-only line · 0 split inside 「よりそい」 | PASS |
| G5 axe WCAG 2.2 AA | **0 violations, 0 serious, 0 critical** across all 30 | PASS |
| G6 Touch targets | 0 elements under 44px (incl. `<summary>`) | PASS |
| G7 Interaction | flows 1–5 all complete — see §4 | PASS |
| G8 Keyboard | **13/13 focusable stops have visible focus**; order sane; no trap; menu operable by Enter | PASS |
| G9 Reduced motion | **0 animated elements** across all 6 routes; **0 layout jump** | PASS |
| G10 Network isolation | **0 external, 0 Supabase/auth/analytics/API, 0 form submissions** | PASS |
| G11 Console | 0 attributable errors | PASS |
| G12 Claim ledger | **0 prohibited claims** | PASS |
| G13 Visual comparison | every material change adjudicated in the Founder visual review | PASS |
| G14 Trace | `test-results/corp-p3-traces/mobile-nav.zip` (3.9 MB) | PASS |
| G15 Lighthouse | §5 | PASS (SEO advisory) |

## 3. Defects found by these gates and fixed

1. **The open mobile menu was not clickable.** The interaction flow failed with
   `<span class="unit">人と社会のあいだに、</span> … intercepts pointer events`. Root cause: `.header`
   was `position: static`, so its `z-index: 40` established **no stacking context** and `<main>`
   painted over the disclosure panel. The menu looked correct and was inoperable. Fixed by making the
   header `position: relative`. **axe did not and could not catch this** — it is a pointer-events
   defect, which is exactly why interaction flows are a required gate.
2. **Harness selector defect (not a page defect).** Flow 3's unscoped
   `a[href="…/mirai-move"].first()` resolved to the `display:none` desktop nav link at 390px. Scoped
   to `main`. Recorded because a green run obtained by testing the wrong element is worse than a red
   one.

A third item was investigated and dismissed: the keyboard sweep initially reported "focus visible on
all 14 stops: false". The failing stop was `BODY` — the tab cycle wrapping out of the document into
browser UI, not a page control. The harness now excludes it, and reports **13/13 real stops PASS**.

## 4. Interaction findings (G7)

| Flow | Observed | Verdict |
|---|---|---|
| 1 — menu → Mirai Move | closed `details.open=false` → click → `true` → navigated to `/prototype/corporate/mirai-move` | PASS |
| 2 — menu → Kakari | navigated to `/prototype/corporate/kakari` | PASS |
| 3 — home → product → cross-link | home → mirai-move → kakari | PASS |
| 4 — keyboard traversal | 本文へスキップ → Yorisou → メニュー → Mirai Move chip → Kakari chip → in-page links → footer links | PASS |
| 5 — pending states | `/company` and `/contact` render their blocker identifiers; no form, no submission | PASS |

**Mobile navigation:** header height closed = **64px, one row** (CORP-P2 exposed two rows).
Panel exposes **5 links**. `<summary>` opens on **Enter** and closes on **Enter** (`open` true→false).
No focus trap — native `<details>` keeps focus in document order.

## 5. Lighthouse (mobile screen emulation, simulated throttling)

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/prototype/corporate` | **100** | **100** | **100** | 60 | 1.1 s | **0** | **0 ms** |
| `/prototype/corporate/mirai-move` | **100** | **100** | **100** | 60 | 0.9 s | **0** | **0 ms** |
| `/prototype/corporate/kakari` | **100** | **100** | **100** | 60 | 1.0 s | **0** | **0 ms** |

Budgets: perf ≥90 ✅ · a11y ≥95 ✅ · BP ≥90 ✅ · LCP ≤2.5s ✅ · CLS <0.1 ✅ · TBT <200ms ✅.

**SEO 60 is advisory and intended.** The single failing audit is `is-crawlable — Page is blocked from
indexing`, which is the deliberate `robots: { index: false, follow: false }` on every Preview route.
Preview isolation was **not** weakened to raise this score.

## 6. Network and privacy

0 external requests, 0 Supabase, 0 auth, 0 analytics, 0 API, 0 form submissions — across all 30
combinations. All resources are same-origin static assets. No client component, no hydration, no
`fetch`.

## 7. Artefacts

- Screenshots — `test-results/corp-p3-screens/` : `home-390/768/1440.png`,
  `mirai-move-390/768/1440.png`, `kakari-390/768/1440.png`,
  `mobile-menu-closed-390.png`, `mobile-menu-open-390.png`
- Trace — `test-results/corp-p3-traces/mobile-nav.zip`
- Lighthouse JSON — `test-results/corp-p3-lighthouse/{home,mirai-move,kakari}.json`
- Heights — `test-results/corp-p3-heights.json`
- Before-state (untouched) — `test-results/corp-p2-screens/`
