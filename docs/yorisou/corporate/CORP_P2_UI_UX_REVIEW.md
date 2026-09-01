# CORP-P2 — UI/UX Review

**Package:** CORP-P2 · **Date:** 2026-08-24 · **Reviewed build:** production build (`next build` →
`next start`), six routes under `/prototype/corporate`.

## Verdict

> ## `SHIP_TO_FOUNDER_REVIEW`

The six routes meet every blocking criterion in the CORP-P2 mandate with machine evidence, and the
two defects found during the package were fixed rather than suppressed. The verdict is
*ship to Founder review*, not *ship* — §5 lists what is still open, and none of it is a design
defect.

## 1. Validation evidence

Six routes × five widths (320 / 390 / 768 / 1280 / 1440) = **30 combinations**, run twice with
identical results.

| Criterion | Requirement | Result |
|---|---|---|
| axe WCAG 2.0/2.1/**2.2** A + AA | 0 serious/critical | **0 violations, 0 serious/critical — all 30** |
| Horizontal overflow | none at 320px | **0 pages overflow — all 30** |
| Touch targets | ≥ 44px | **0 under 44px — all 30** |
| External network requests | 0 | **0 — all 30** |
| Supabase / auth / analytics / API / form submission | 0 | **0 — all 30** |
| Console errors | 0 attributable | **0 — all 30** |
| `prefers-reduced-motion: reduce` | complete | **0 animated elements across all six routes** |
| Prohibited claims | 0 rendered | **0** |
| HTTP status | 200 | **200 — all 30** |
| `npx tsc --noEmit` | clean | **exit 0, zero diagnostics** |
| `npx eslint app/prototype/corporate --max-warnings=0` | clean | **exit 0** |
| `npm run build` | success | **exit 0, "Compiled successfully"**; all six routes in the manifest |

Harness: `test-results/corp-p2-validate.mjs` (git-ignored), re-runnable with
`node test-results/corp-p2-validate.mjs`.

## 2. Design assessment

**Five-second hierarchy — pass.** Thesis, then the two fields as linked chips, then per-product stage
labels. A reader learns company kind → domains → maturity before scrolling.

**Product distinction — pass.** Alternating grounds, separate routes and H1s, different field lines,
different stage truths, and two structurally different diagrams (a network of parties vs a sequence
of steps). No card grid anywhere.

**Honesty as craft — pass.** Stage labels sit above the descriptions; boundary blocks carry full
visual weight; blocked routes are designed pending states with visible blocker identifiers rather
than empty pages or apologies. `/contact` has no form, which is the correct answer when no verified
destination exists.

**Japanese typography — pass.** Leading 2.00, measure 34–36em, Noto Sans JP with correct fallbacks,
no Latin-tuned tracking.

**Navigation — pass, and improved on Phase 1.** Six routes are all reachable at 320px because the nav
wraps instead of hiding; skip link present; plain anchors, so keyboard operation needs no JavaScript;
`aria-current="page"` on the active route.

**Restraint — pass.** No gradients, glassmorphism, AI imagery, stock photography, fake dashboards, or
metrics. Accent is signal-only.

## 3. Defects found and fixed during CORP-P2

1. **`/about` enumerated prohibited nouns inside a negation.** The sentence
   「導入数、利用者数、取引先、提携先、受賞歴を掲載していません」 was a *negation*, but it put
   `提携先` and `受賞` on the page. Rewritten to 「数値や企業名を用いた実績の紹介を掲載していません」 —
   same meaning, no enumeration. **The page was fixed, not the scanner.**
2. **The claim scanner itself was defective.** Its first value-aware form **missed
   `代表取締役 Jin Yang`** — precisely the defect live on `/company`. Corrected to an ABSOLUTE list
   (never allowed in any form) plus a VALUE-GATED list (field labels allowed, values not), and proved
   against six cases including the live `/company` text.

Carried from Phase 1 and still holding: `--c-mineral` contrast raised from 3.08:1 to 5.00:1, and the
infinite pulse replaced with a finite settle.

## 4. Weaknesses I would not hide

- **The site is honest but thin.** With both products pre-launch and no company facts, there is
  little for a visitor to *do*. That is correct for today, and it does mean the site converts nobody
  until `/contact` has a real destination.
- **Route diagrams are decorative.** They separate the products well but carry no information a
  reader could not get from the caption. Acceptable; not load-bearing.
- **`/about` is method-only.** No history, team, or founder — because none is verifiable. It reads
  slightly abstract as a result. The alternative was invention.
- **Screenshots are full-page captures**, not curated crops. Good for review, not for presentation.

## 5. Open items — none of them design defects

| # | Item | Blocks |
|---|---|---|
| 1 | `COMPANY_REGISTRATION_SOURCE_REQUIRED` — no 履歴事項全部証明書 / 定款 | `/company` content |
| 2 | `VERIFIED_CORPORATE_CONTACT_REQUIRED` — no verified channel | `/contact` content |
| 3 | Consumer-route disposition undecided | Any public launch |
| 4 | **Live `/company` publishes 代表取締役 and unverified values today** | Independent of launch — highest priority |
| 5 | No `robots.txt`, no `sitemap.xml` on production | Any public launch |
| 6 | Site-wide metadata is still consumer-product metadata | Any public launch |

## 6. Screenshots

`test-results/corp-p2-screens/` — nine full-page captures, 3 routes × 3 widths:
`home-390.png` · `home-768.png` · `home-1440.png` · `mirai-move-390.png` · `mirai-move-768.png` ·
`mirai-move-1440.png` · `kakari-390.png` · `kakari-768.png` · `kakari-1440.png`.
