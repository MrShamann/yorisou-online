# CORP-v1.4R1 — AI-native benchmark: what happens *after* the hero

`CORP_V12R3_SIGNATURE_BENCHMARK.md` studied frame zero and produced the hero this site now has. The
v1.4 audit's finding was that the hero was the only part that inherited it: *"AI-native は Hero に
しか生きていない"*. So this benchmark asks the question R1 actually needs answered — **what do these
sites do in the two viewports after the hero?**

## Capture

Captured 2026-09-01, headless Chromium, 1440×900, `animations: "disabled"`, three frames per site at
scroll offsets 0 / 1.05vh / 2.1vh.

| Site | Captured | Note |
|---|---|---|
| Linear | ✅ 3 frames | |
| Anthropic | ✅ 3 frames | |
| Vercel | ❌ | screenshot never stabilised (continuous animation); **not studied, not described** |
| Stripe | ❌ | same |

Two sites is a small sample and it is stated as such. Nothing below is asserted about Vercel or
Stripe, and nothing is carried over from the v1.2R3 table except where explicitly cited.

## What the frames show

### Linear, frame 1 — the hero does not end at the fold

The product surface from frame 0 is still bleeding past the top of the viewport. Below it: a logo
wall, then a **typographic statement at roughly 64px running nearly the full container width**, two
weights in one sentence (white for the claim, grey for the qualification). No container, no card, no
figure. The type is the section.

### Linear, frame 2 — three-up, and not one box

Three columns: a line-art isometric figure, a 15px title, two lines of body. Separated by **vertical
hairlines**. There is no border, no fill, no radius, no shadow, no number badge. Then immediately
below, a two-column editorial split — an oversized two-line heading on the left, a three-line
paragraph at body size on the right.

### Anthropic, frame 1 — cards, but they are records

"Latest releases": **three boxed cards**, filled, with a border and a radius. This is the finding
that matters, because it contradicts the lazy reading of the audit. Look at what is inside one:

- title
- three-line body
- a "Model details →" link
- **a rule-separated field table: `DATE ─ July 24, 2026` / `CATEGORY ─ Announcements`**
- a filled button

The card is not a blurb in a box. It is a **record**: labelled fields, aligned, with a rule between
each, carrying data that varies per item. The box is legitimate because there is something
box-shaped inside it.

## The three findings R1 acts on

**1. The problem was never "cards". It was cards with nothing in them but prose.** Anthropic — the
most restrained site in the v1.2R3 sample — ships three bordered cards one viewport below its hero.
They work because each one carries labelled fields. YORISOU's cards carried a number, a title and a
sentence. That is a paragraph wearing a rectangle, and the fix is not to ban the shape; it is to
either put state in it or stop drawing the box.

**2. A rule does the work of a border.** Linear's three-up is the same information architecture as a
three-card row and reads as an order of magnitude calmer, because the separation is a 1px vertical
line rather than four borders per item. Where R1 keeps a three-part structure, it separates with
rules — the venture rows on Home, the venture index on Company, the stage rail on How We Build.

**3. Density is allowed to change violently between adjacent sections.** Linear goes: cropped
product surface → logo wall → 64px statement → line-art three-up → editorial two-column. Nothing
about that is uniform, and none of it is decoration. The v1.4 site went Band → h2 → paragraph →
cards ten times at one width. Alternation is the instrument the audit was actually asking for.

## What this benchmark does NOT license

- It does not license animation. Neither captured site animates anything load-bearing; both are
  fully legible in a still frame, which is how these captures were taken at all.
- It does not license a dashboard. Anthropic's field table carries dates that are true. Nothing in
  either capture displays a metric that is not real.
- It does not license copying either layout. Linear shows its product because it has one. YORISOU
  has no product screenshot it may honestly show — that constraint from v1.2R3 is unchanged, and
  the formation system remains the only proof surface the evidence permits.

## Applied in R1

| Finding | Where it landed |
|---|---|
| Cards need fields, or no box | `PublicVentureSurface` — rows carrying stage, next step, formation state; `VentureIndex` on Company — rows, no boxes |
| A rule beats a border | venture rows, venture index, Foundry spine rail, participation panel |
| Density must alternate | Home: hero → rail → quiet → **dark system surface** → quiet → continuity field → decision object → founder → facts → CTA |
| Legible in a still frame | every object here is a server component with no JavaScript; the radio groups change what is *selected*, never what is *legible* |
