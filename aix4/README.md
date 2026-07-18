# AIX-4 — Product-First Experience Unification & Share System

Founder-review evidence for **AIX-4**. The Founder rejected AIX-3D for merge on
three product-level findings; AIX-4 corrects all three on the existing PR #113
(preview only). Feature branch `feat/aix-1-ai-native-experience` @ `befe87a`.
Production untouched (`main` @ `70da80a`).

## Findings addressed

- **A — one coherent experience system:** semantic `--yr-*` token layer + a dark
  Product-Focus mode (`.yr-focus`); the shared result/recommendation/conversion
  components are now **theme-aware** (one code path renders dark in the flows and
  light on the LINE mini-app); all retained test flows unified onto the dark
  Product-Focus surface with matching dark header/footer. No question/scoring/
  result-id/logic change.
- **B — real share-card system:** a public-safe share model, generated
  `ImageResponse` cards in three formats (square 1080², story 1080×1920, OG
  1200×630) with the BrandMark + crisp Japanese typography, a share UI
  (`navigator.share({files})` + download / copy fallbacks + privacy preview),
  wired across all nine retained result types via one architecture.
- **C — product-first homepage:** SEO title + hero lead with the platform
  ("今の状態から、次の選択まで。"), state-based CTA, free/no-login as a subtle note (no
  hero-level 120問), and the six-domain connected system map in the first screen.

## Shots

| # | File | What it shows |
|---|------|---------------|
| 01 | `01-home-first.jpg` | Homepage first screen — platform headline + six-domain system map |
| 02 | `02-home-full.jpg` | Full-height homepage — promise → map → loop → example → partner → CTA |
| 03 | `03-home-mobile.jpg` | Homepage (mobile, full height) |
| 05 | `05-tests-catalogue.jpg` | `/tests` catalogue (immersive dark entry) |
| 06 | `06-c02-intro.jpg` | `/tests/c02` — dark Product-Focus flow with matching dark header/footer |
| 07 | `07-rf-mobile.jpg` | `/tests/relationship-fatigue` (mobile, dark) |
| 08 | `08-work-rhythm-result.jpg` | Dark result — theme-aware Companion + RecommendationSlot + **結果をシェア** actions |
| 09 | `09-share-square.jpg` | Generated **square** share card (1080²) — JP renders crisply |
| 10 | `10-share-story.jpg` | Generated **story** share card (1080×1920) |
| 11 | `11-share-og.jpg` | Generated **Open Graph** card (1200×630) |
| 12 | `12-result-imairo.jpg` | imairo `/result` reveal (YRR-1 preserved) with the unified share actions |

## Before / after (Finding A)

Before AIX-4 (AIX-3D-2, evidence `aix3d2/`), the test flows + embedded components
were a **pale cream light** surface distinct from the dark product — the exact
inconsistency the Founder flagged. After AIX-4 (shot 06 / 08), the same flows are
the dark Product-Focus surface, and the shared components render dark inline via
tokens (no hardcoded-light clash).

## Validation (@ `befe87a`)

tsc 0 · eslint 0 (7 pre-existing warnings) · build ✓ · contracts test:aix3/3b/3c/3d/
3d2/**4** + logic suites · Playwright aix2 smoke 24/24 · axe 0 serious/critical
(dark flows + homepage + LINE) · gitleaks clean.

Protected boundaries intact (questions/answers/scoring/weighting/activation/result
IDs/protected copy/recommendation logic/privacy semantics/auth/LINE identity/DB/
payments unchanged). YRR-1 + RTR-1 preserved.

## Notes

- The share-image route embeds a request-time Japanese font with a system-font
  fallback (macOS Hiragino renders JP for local evidence, shots 09–11). OS-level
  native share sheets cannot be fully simulated in CI; the file-share path uses
  `navigator.canShare({files})` with download/copy fallbacks.
- `/company` legal metadata remains founder/legal-verify-required (carried from
  AIX-3D-2; not changed).
