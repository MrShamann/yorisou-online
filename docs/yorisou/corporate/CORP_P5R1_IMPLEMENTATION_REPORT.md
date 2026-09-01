# CORP-P5R1 — Implementation report

**Starting HEAD:** `c0b296554e7466ce6f53aa6b7b78d2b229e4b44d` (CORP-P5, PR #154 — preserved, untouched)
**New branch:** `product/corporate-p5r1-ai-native-home`
**Scope:** homepage `/` only. PREVIEW ONLY. No merge, no Production.

## Files changed

| File | Change |
|---|---|
| `app/page.tsx` | **modified** — 4 insertions, 7 deletions; renders `HomeP5R1` instead of `Shell`+`HomeView` |
| `app/_corporate/p5r1/p5r1.module.css` | new — the P5R1 visual system |
| `app/_corporate/p5r1/HomeP5R1.tsx` | new — homepage composition (server component) |
| `app/_corporate/p5r1/SystemField.tsx` | new — hero topology (SVG, inert) |
| `app/_corporate/p5r1/ProjectSystems.tsx` | new — NETWORK and PROCEDURE grammars |
| `app/_corporate/p5r1/Reveal.tsx` | new — the only client boundary (IntersectionObserver) |
| `docs/yorisou/corporate/CORP_P5R1_*.md` | new — teardown, visual language, this report |

**`git diff --stat c0b2965` on tracked files is exactly one line: `app/page.tsx | 11 +++----`.**

## Benchmark findings

Six sites rendered headlessly, measured, screenshotted and **looked at**. All six reachable (Linear
and Scale needed a 60s `commit` wait after timing out at 35s).

The finding that reframed the work: **five of six are light-background sites; only Linear is dark.**
The dominant pattern is a **light editorial field with a dark computational surface inset as a
distinct object** — Palantir and Scale set their hero over a dark panel, Anthropic insets one below.
Anthropic runs **zero** animations and reads as the most authoritative of the six. SVG, not canvas,
is the system medium (Linear 180 SVGs, Vercel 45, Anthropic 44; only two sites use a canvas at all).

Ten transferable principles are recorded in `CORP_P5R1_BENCHMARK_TEARDOWN.md`.

## Visual principles applied

Light human field / dark system surface / seam between them — which is the company's own 人 / 仕組み
thesis. Five depth layers. Light means state, never mood. Four motion primitives only. AI is never
drawn; it is inferred from context, relationship, routing, state and boundary. Full system in
`CORP_P5R1_VISUAL_LANGUAGE.md`.

## What changed on the homepage

| | CORP-P5 | CORP-P5R1 |
|---|---|---|
| Hero | Text on paper, thin seam line | Human field **and** a dark system surface carrying a live topology |
| Depth | Effectively one plane | Five layers: environmental lattice → topology → object surfaces → editorial → focus |
| Portfolio | Two small glyphs above text | Two **dark system surfaces** with genuinely different grammars |
| Approach | Rows on paper | Rendered **on the system surface** as operating constraints |
| Company | Another band | A deliberately calmer resolve band, lower contrast, no motion |
| Motion | One seam draw | Four semantic primitives, all finite, scroll-triggered |

## What was deliberately preserved

Copy, thesis, narrative order, information architecture, portfolio composition, both product
positionings, stage strings, the 士業 boundary wording, company philosophy, claim discipline — all
carried verbatim from the approved CORP-P5 content source. **Nothing was rewritten to make the
redesign easier.**

## Motion grammar as implemented

| Primitive | Where | Mechanism |
|---|---|---|
| SIGNAL | Eyebrows, thesis, lead, human chips | opacity + 8px rise, 620ms, once |
| CONNECT | Hero relations, Kakari step rules | `stroke-dashoffset` draw, 760ms, staggered |
| RESOLVE | Nodes, problem rows, constraints | settle from offset, 900ms, staggered |
| HAND-OFF | Kakari boundary | a dot travels an `offset-path` to the boundary rule and stops |

All finite. All scroll-**triggered**, never scroll-driven — browser scrolling untouched, no
scroll-jacking, no rAF loop, no pointer capture. `document.getAnimations()` reports **0 running**
after the page settles at every viewport.

## Responsive behaviour

Designed at 1440 / 1280 / 768 / 430 / 390 / 375. Two columns at ≥1024; the dark surface stacks below
the editorial on mobile with the topology simplified but never removed. Zero horizontal overflow and
zero fragmented Japanese units at all six widths.

## Accessibility

axe WCAG 2.0/2.1/2.2 A+AA: **0 violations** at all six viewports. 14/14 keyboard stops have a visible
focus ring. Every decorative layer is `aria-hidden` **and** `pointer-events: none`, verified per
viewport. All pointer targets ≥44px. Under `prefers-reduced-motion` the field resolves to its
completed state — 13/13 relations drawn, 23/23 resolve elements visible, 15/15 signals visible,
**0 animations running** — a complete composition, never an empty one. No accessibility
certification is claimed.

## Performance

| | CORP-P5 | CORP-P5R1 |
|---|---|---|
| Performance | 88 | **90** |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 3.6 s | **3.5 s** |
| CLS | 0 | 0 |
| TBT | 30 ms | **10 ms** |

No material regression; marginally better. **LCP still misses the 2.5s target.** The cause is
unchanged and structural: `unused-css-rules ≈ 690ms` from the legacy consumer global CSS bundle that
every corporate route still loads. Fixing it is the route-group separation recorded as CORP-P4B D-2,
which this package is explicitly not authorized to perform. No image, video, animation library or
third-party script was added.

## Tests

`tsc --noEmit` clean · `eslint` clean · `next build` clean · route-policy suites **35/35 pass** ·
the CORP-P4AR2R1 dynamic-404 contract suite **skips** (needs its own server) rather than passing.

## Known failures

**CI "Lint, Build & Env Check" is expected to fail**, exactly as on PR #154. The subtest
`archP3DailyDiscovery` L/M asserts the consumer Today page lives at `app/page.tsx`. It passes on
`main` and has failed on this line of work since CORP-P4A. It is the consumer guard correctly
detecting that `/` is no longer the Today page. **It was not silenced, weakened, skipped or
rewritten.** Resolving it is the corporate/consumer topology decision, which this package may not make.

## Known limitations

- LCP above target (above).
- Homepage only. The other five corporate routes are untouched CORP-P5 baseline by design.
- The Preview is behind Vercel team authentication; project protection was not changed.
- No Founder acceptance. This is a review artefact, not an approved design.

## Other-route non-regression evidence

Source: `git diff --stat c0b2965` = `app/page.tsx` only. Every other corporate file reports
**0 references to `p5r1`** and **no diff** against the baseline commit.
Rendered at 1440: `/mirai-move`, `/kakari`, `/about`, `/company`, `/contact` each render
1 `h1` / 1 header / 1 footer, background `rgb(251,250,246)`, and **`usesP5R1 = false`**.
Legacy consumer routes still return 200.

## Production verification

`origin/main` = `b5521141b6b0863ce2e3451278cc8756f1e6c27d`; Production deployment ref =
`b5521141b6b0863ce2e3451278cc8756f1e6c27d`. Unchanged. No merge, no Production deploy, no Vercel
setting change, no DNS/Supabase/env/migration/auth change, PR #127 and PR #154 untouched.
