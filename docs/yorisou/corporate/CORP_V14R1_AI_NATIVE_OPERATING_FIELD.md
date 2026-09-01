# CORP-v1.4R1 — the AI-native operating field

**Preview only.** Not merged, not deployed, no DNS change, no Production environment touched.
Branch `product/corporate-v14-business-model-global`, base `main@279cacd`, PR #157 (DRAFT).

## What this package answers

A third-party UI/UX audit of v1.4 returned:

> CONTENT PASS · MULTILINGUAL PASS · VISUAL SYSTEM PARTIAL · AI-NATIVE PARTIAL ·
> BIG-COMPANY FEEL NOT YET · MERGE NO

with one core diagnosis: **AI-native は Hero にしか生きていない** — after the hero the site returns
to `Band → Heading → Paragraph → Cards`, ten times, at one container width.

That diagnosis is correct and it is a UI/UX architecture problem, not a content problem. v1.4's
words were accepted. **No business-model narrative was rewritten in R1.**

## The instrument

Four system objects in one new module, `app/_corporate/p5r2/OperatingField.tsx`, sharing one
vocabulary — **node, line, state, boundary** — inherited from the hero:

| Object | Replaces | States something the repository can evidence |
|---|---|---|
| `PublicVentureSurface` | three project cards inside the standard container | each venture's real Foundry stage, from `ventureState.ts` |
| `ValueContinuityField` | a heading and two paragraphs | the shapes a venture may take, and that **none is decided** |
| `ParticipationEntry` | a `<details>` accordion of six lanes | what each lane offers **and what it cannot promise** |
| `FoundrySpine` | eight cards | eight stages as one rail, with each venture pinned at its real stage |

### What they are not

No dashboard. No fake telemetry. No percentage of completion. No "LIVE". No matching, ranking or
recommendation. No new colour was introduced — no purple AI gradient, no neon, no mesh, no blobs,
no particles. Every state shown is a **named stage** taken from each venture's own repository
evidence, or it is not shown.

### Interaction is a native radio group

Both interactive objects are `<fieldset>` + hidden `<input type="radio">` + `:checked ~` sibling
selectors. Consequences, all of them deliberate:

- **zero JavaScript** — every object is a server component; no hydration cost, no new dependency
- **arrow keys work** because the browser provides them, not because we wrote a key handler
- **`display:none` on unselected panels** gives real tab/panel semantics to assistive technology —
  exactly one stage panel and one lane panel is in the accessibility tree at a time (verified)
- **reduced motion has nothing to disable** — selection is a state change, not an animation

Keyboard tab stops fell from 154 to 136 across the nine routes. That is the accordion becoming a
radio group: one tab stop into the group, arrow keys within it. Traversal is verified by real `Tab`
presses, not `el.focus()` — see the harness note in `tests/corporate-qa/README.md`.

## Structural census

Measured against baseline `de552d0`.

| | baseline | now |
|---|---|---|
| `<Cards>` on Home | 2 | **0** |
| `<Cards>` on Company | 1 | **0** |
| `<Cards>` on How We Build | 1 | **0** |
| `styles.project` on Home | 10 | **0** |
| `engageCell` on Home | 1 | **0** |
| `<Band>` on Home | 10 | 9 |
| `<Band>` on Company | 7 | 6 |
| `<Band>` on How We Build | 7 | 5 |

`<Cards>` survives on Contact and on the individual venture pages, where the items genuinely are
peer records of the same kind. The component was not deleted; it stopped being the default answer.

## The three edits that came out of looking, not planning

Each was found by opening a screenshot, not by reasoning about the code.

**1. The grid was on the `<fieldset>`.** `display: grid` sat on `.spine` and `.entry`, whose
children are the legend, eight radio inputs and the body — so the eight inputs consumed eight grid
cells and the panel column rendered empty. Moved to `.spineBody` / `.entryBody`.

**2. Miniature diagrams were decoration.** The Home venture rows render the same three system
diagrams the venture pages use, at about a third of the width. Their captions are authored at
8–10.5px against a 300-unit viewBox, so they resolved to roughly 4px — present, unreadable, and
therefore exactly the decoration this package forbids. `systems.tsx` gained a `compact` mode that
omits the captions and reframes the viewBox around what survives. It is owned by the drawing, not
faked with a CSS `text { display: none }` override, and the non-compact rendering on the venture
pages is unchanged. The glyph column then needed a **fixed box**: the three compact viewBoxes have
very different aspect ratios and `.svgBlock` derives height from width, so Kakari's inherently
portrait procedure made its row ~470px tall until each glyph was fitted (`xMidYMid meet`) into one
132px box.

**3. Three ventures with no way in.** The first `PublicVentureSurface` presented all three public
ventures and linked to none of them. The identity is now the link. On Company, the first attempt
put the arrow inside the name link, where it landed after whichever line was widest and the three
arrows stepped raggedly down the column; the row is now the link and the arrow has its own grid
column.

## Header (§17)

The bordered "build with us" action sat **third of five** inside the desktop nav, so a boxed
element interrupted the row of plain links and the header read as five items of competing weight
plus a globe. Desktop now renders the four plain destinations as one even run and seats the action
at the end, beside the language control. Same five destinations, same order on mobile, same
bordered — not filled — treatment: there is no application process behind it and a conversion
button would imply one. It stays inside the `<nav>` landmark, because it is a destination and
moving it out would drop it from navigation for a screen-reader user browsing by landmark.

A hairline separator was tried between the links and the action, and removed: a rule immediately
beside a bordered box is two devices doing one job.

## Company page (§18)

The page that should be the calmest on the site carried seven bands and a dark grid of three
numbered venture cards — a second portfolio pitch, duplicating a presentation the Home operating
field and the Ventures index each do properly.

- the standalone "business areas" band — an eyebrow, a heading and **one sentence** — folded into
  the company overview it was describing. Nothing was cut: the sentence now introduces the
  statutory facts, under its own label.
- its heading key `businessHeading` was a verbatim duplicate of `businessEyebrow` and, once folded,
  was rendered nowhere. Removed from `types.ts` and all 21 locale files rather than left as content
  the site carries and never shows.
- the dark card grid became `VentureIndex`: rows, a rule between, no box, no number, no accent
  panel; the shared identity unit, each venture's own stage in its own words, and a route in.

## Validation

Against a production build (`npm run build && npx next start -p 3111`), Preview only. Exit codes
checked directly, not through a pipe — see the brand-paint note below.

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| `eslint app/_corporate tests/corporate-p5r2` | 0 errors, 0 warnings |
| `npm run build` | compiled |
| corporate guards (`tests/corporate-p5r2`) | **53/53** |
| route contract (`pxr1RouteContract`) | 11/11 |
| ARCH-P3 daily discovery | 21/21 |
| route sweep — status, `lang`, `dir`, title, token leaks | **189/189** |
| responsive — 6 viewports, overflow / clipped text / target size | **1134/1134** |
| axe-core WCAG 2.2 AA — 9 routes × 5 scripts | **0 violations across 45 pages** |
| reduced motion + real `Tab` traversal | clean, 136 tab stops across 9 routes |
| brand paint | **90** venture marks on 18 pages, 0 pre-logo colours painted |
| consumer product untouched | 8/8 |
| 21-locale public access | 21/21, `/en` still legacy consumer, noindex |

### Performance

Lighthouse 12, CLI, default (mobile) preset, three runs, median. **The baseline is not sacrificed.**

| | `de552d0` baseline | R1 |
|---|---|---|
| performance | 90 | **90** |
| accessibility | 100 | **100** |
| best practices | 100 | **100** |
| SEO | 100 | **100** |

Runs: 88 / 90 / 90. Median LCP 3.44s, **CLS 0.000**, **TBT 5ms** — the four operating-field objects
are server components with no JavaScript, so they add no blocking time and no layout shift.

### Two harness results that had to be investigated rather than accepted

**A reported axe violation that was not real.** A first sweep reported `1 violation` —
`/build-with-us [th] label (critical) #bwu-entry-founders`.

- direct DOM inspection: exactly one input with that id, exactly one `<label for>` bound to it,
  text `"ผู้ก่อตั้ง"`, `display:flex`, 67×40px, zero duplicate ids
- the same page audited in isolation, three consecutive runs: **0 violations**
- the full 45-page sweep with a fresh browser context per page: **0 violations**
- the full 45-page sweep re-run **unmodified**: **0 violations**

The command issued immediately after the failing run was killed with **exit 137**, on a machine at
~115MB unused RAM. The shipped harness reuses one page across all 45 navigations and injects a fresh
copy of axe-core each time; under memory exhaustion it audited a page that had not finished
rendering. **The harness was not modified.**

**A real failure that a pipe had hidden.** Running the suite as `node brandpaint.mjs | tail -3`
showed two warning lines and an exit code of 0 — because `tail` was the last command in the pipe.
Run directly, `brandpaint.mjs` exits **1**:

```
/about [ja] mark for an unknown venture ""
/about [ar] mark for an unknown venture ""
```

The harness was right. The Foundry spine's new stage markers rendered `<VentureMark>` beside a bare
`{c.name}` text node, so the scan found a venture mark it could not attribute to any venture — which
is exactly the "bare English mark" defect CORP-v1.2R2.1 exists to prevent. Fixed at the source: the
markers now render the shared identity unit (`VentureName`, empty `reading`, new `as="span"` because
a `<p>` is not valid phrasing content inside a `<label>`). 84 → **90** attributed marks, exit 0.

Every subsequent suite run in this package checks `$?` per command.

### Independent source audit

Six read-only lenses (locale parity, public-claim safety, a11y semantics, zero-JS correctness, CSS
and RTL regressions, dead code) ran over the working tree, each finding independently adversarially
verified before being accepted. 32 candidates, **11 confirmed**, all fixed:

| # | Defect | Fix |
|---|---|---|
| 1 | **A false public claim in 21 locales.** `ParticipationEntry` labelled each lane's venture list with `ventures.publicLabel` ("Ventures currently public"). `lane.ventures` is a per-lane *relevance* list and four of the six lanes carry two of the three — so selecting the team, users, research or public lane stated that only two ventures are public, contradicting the section directly above it on the homepage, which carries the identical label over all three. | label changed to `ventures.eyebrow` ("Ventures" / 「事業」) — already translated, states what the list is without asserting completeness |
| 2 | `StageRail`'s wrapper carried `aria-hidden="true"`, which also hid its caption — the venture's Foundry stage name, and the only place that name appears in the row. The stage was a sighted-only fact on the surface built to state it. | `aria-hidden` moved onto the dots; the caption is real text |
| 3 | `VentureIndex` set `aria-label` on the row link, replacing its inner text as the accessible name and deleting the stage sentence for assistive technology. | `aria-label` removed; the link's own content is a better name |
| 4 | `.ventureIndexLink` declared two grid columns below 720px for three children — the arrow wrapped to its own row and the name column could collapse. | explicit placement; stage takes its own row on mobile, arrow pinned to the end of row 1 |
| 5–7 | `.ventureIndexLink:hover .arrow { transform: translateX(3px) }` and its reduced-motion counterpart tie on specificity (0-3-0) with the site-wide RTL mirror `.root[dir="rtl"] .arrow { transform: scaleX(-1) }` and sit later in the file — so hovering a venture row in any of the five RTL locales un-flipped the arrow and slid it the wrong way. | hover nudge removed entirely; RTL arrow verified as `matrix(-1, 0, 0, 1, 0, 0)` in Arabic |
| 8 | Two dead selectors: `.entryRolesWrap` names a class that exists nowhere, and `.entryRole:has(:focus-visible)` can never match — the labels contain no focusable descendant. | removed; the per-index `:focus-visible` rules that actually paint the ring were already present |
| 9–11 | Three i18n keys orphaned by this change: `home.asterionHeading`, `ventures.cards[].status` (3 per locale), and `businessHeading`. | deleted from `types.ts` and all 21 locale files, scoped by block so the identically-named `foundry.asterionHeading` survives; `tsc` clean |

## Constraints honoured

Not merged. Not deployed. DNS untouched. Production environment untouched. PR #127 untouched —
its CI events were declined under the standing Founder hold, each time. Consumer Today untouched.
120Q scoring and taxonomy untouched. Asterion source untouched. Norynto absent. No external message
sent. No new AI colour. No animation added as a substitute for structure. No fake progress, no
"LIVE", no dashboard.

## Open for Founder review

- **The retired guided explainer is retained, not deleted.** `GuidedExplainer.tsx`, its stylesheet
  and eight `home.explainer*` keys in 21 locales are now rendered by nothing. It costs no client
  bytes — `grep` finds neither the component nor its strings in any `.next/static/chunks` file — so
  leaving it is harmless, and deleting Founder-approved copy in twenty-one languages is a content
  decision rather than a UI/UX one. Flagged rather than taken.
- whether the Home `#why` and `#how` bands should stay visually alike. They are the two
  editorial-quiet moments bracketing the dark venture surface and share a numbered-beat device.
  Deliberate rhythm, ~2000px apart with a full dark band between them — but it is the one repeated
  device left on the page, and it is a taste call, not a defect.
- the Chigamo glyph is the sparsest of the three, which is the honest signal of a concept-stage
  venture and also the least legible mark on the surface.
