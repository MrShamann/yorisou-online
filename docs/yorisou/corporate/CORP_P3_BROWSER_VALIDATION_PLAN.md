# CORP-P3 — Browser Validation Plan

**Package:** CORP-P3 · **Date:** 2026-08-24 · **Target:** local **production build** (`next build` →
`next start` on `:3311`), never the dev server alone. No authentication, no Production session, no
external account.

Harness: `test-results/corp-p3-validate.mjs` (git-ignored, re-runnable), using the repository's
existing `@playwright/test` + `@axe-core/playwright`. **No dependency was installed.**

## Matrix

**Viewports** (all `locale: ja-JP`): 320 · 390 · 768 · 1280 · 1440
**Routes:** `/prototype/corporate` · `/mirai-move` · `/kakari` · `/about` · `/company` · `/contact`
→ **30 route × viewport combinations per run.**

## Gates

| # | Gate | Method | Pass condition |
|---|---|---|---|
| G1 | Smoke | `page.goto`, status + render | HTTP 200, all 6 routes |
| G2 | Responsive matrix | `scrollWidth > innerWidth` at 5 widths | 0 horizontal overflow |
| G3 | Clipped text | per-element `scrollWidth > clientWidth` with non-visible overflow | 0 clipped |
| G4 | Japanese layout | measure rendered H1 line boxes by unit top offset | 0 single-char orphan, 0 punctuation-only line, 0 split inside 「よりそい」 |
| G5 | axe WCAG 2.2 AA | `AxeBuilder` tags `wcag2a/2aa/21a/21aa/22aa`, after `getAnimations()` settle | 0 serious, 0 critical |
| G6 | Touch targets | bounding height of `a`, `button`, `summary` | 0 under 44px |
| G7 | Interaction — mobile menu | 5 flows (below) | all complete |
| G8 | Keyboard | 14 × `Tab`, record tag/text/outline; Enter on `<summary>` | visible focus on every focusable stop, sane order, no trap, menu operable |
| G9 | Reduced motion | `reducedMotion: 'reduce'` on all 6 routes | 0 animated elements, 0 layout jump |
| G10 | Network isolation | capture every request per route/viewport | 0 external, 0 Supabase/auth/analytics/API, 0 form submissions |
| G11 | Console | `console` + `pageerror` listeners | 0 attributable errors |
| G12 | Claim ledger | ABSOLUTE + VALUE-GATED scan of rendered text | 0 prohibited claims |
| G13 | Visual comparison | full-page heights vs CORP-P2 baseline | every material change maps to an intended correction |
| G14 | Trace | `context.tracing` over the mobile navigation flow | trace written |
| G15 | Lighthouse | `--preset=desktop` with mobile screen emulation, 3 routes | perf ≥90, a11y ≥95, BP ≥90, LCP ≤2.5s, CLS <0.1, TBT <200ms |
| G16 | Build | `tsc --noEmit`, `eslint --max-warnings=0`, `next build` | all exit 0 |

## Interaction flows (G7)

1. mobile menu closed → open → navigate to **Mirai Move**
2. mobile menu closed → open → navigate to **Kakari**
3. homepage product entry → product page → cross-link to the other product
4. keyboard-only traversal of header, primary content links and footer
5. `/company` and `/contact` pending-state review

Flow 3 is scoped to `main`, because at 390px the desktop nav links exist in the DOM but are
`display: none` — an unscoped selector resolves to a hidden element and fails for the wrong reason.

## SEO

Advisory only. All Preview routes set `robots: { index: false, follow: false }`, so Lighthouse SEO
is expected to be capped by `is-crawlable`. **Preview isolation must not be weakened to raise it.**

## Baselines

CORP-P2 screenshots in `test-results/corp-p2-screens/` are the before-state and **must not be
overwritten**. CORP-P3 captures go to `test-results/corp-p3-screens/`. Baselines are never blindly
accepted: each material difference is adjudicated in `CORP_P3_FOUNDER_VISUAL_REVIEW.md`.

## Artefacts

Screenshots `test-results/corp-p3-screens/` (9 route captures + 2 menu states) ·
trace `test-results/corp-p3-traces/mobile-nav.zip` ·
Lighthouse JSON `test-results/corp-p3-lighthouse/` · heights `test-results/corp-p3-heights.json`.
