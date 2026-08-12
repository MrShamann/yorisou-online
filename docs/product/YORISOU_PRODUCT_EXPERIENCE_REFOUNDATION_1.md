# YORISOU PXR-1 — Product Experience Refoundation

Status: **IN PROGRESS.** This document is the canonical product/design record for PXR-1. It is written
from a first-hand audit of the live product, not from repository code.

Scope boundary: PXR-1 touches product experience only. It does not touch POR-1, PR #129, PR #127, the
account-deletion executor, or Production.

---

## 1. Live audit — what the product actually is today

Audited `https://yorisou.online` directly at 375×812, 2026-08-12.

### 1.1 The home surface is a project explainer

The first screen is a marketing manifesto: eyebrow (`AIと整える、わたしの毎日。`), a three-line headline,
a paragraph of supporting copy, **two** competing CTAs (`無料でセルフチェックを始める` / `チェックを選ぶ`),
and a disclaimer — before any product state appears.

Below it, in order: a five-step `体験の流れ` explainer, a six-card `YORISOUでできること` capability grid,
a `YORISOU AI` section, and a `LINEで続ける` section.

Nothing on the first screen answers *"what is useful to me today?"*. The page explains the product
instead of being it. This is the core finding, and it matches the brief.

### 1.2 A bottom navigation ALREADY EXISTS — this is a refactor, not a build

The live product already ships a four-item bottom navigation:

```
ホーム · 今を知る · おすすめ · わたしの今
```

That is materially closer to the target than the brief assumes. The work is renaming and
re-scoping toward `今日 · 気づく · 探す · わたし`, not introducing mobile navigation from nothing.
`わたしの今` → `わたし` and `おすすめ` → `探す` are the substantive changes; `ホーム` → `今日` is the
change that carries the product-model shift.

### 1.3 CORRECTION TO THE BRIEF — `/check-in` is not a lightweight daily check-in

The brief describes `/check-in` as "closer to the correct consumer product structure: single task,
low cognitive burden, one clear action." Half of that holds; the rest does not.

What `/check-in` actually serves is the **いま色テスト landing page** — `120問・無料・ログインなし`,
h1 `今のあなたの"いま色"を見てみる`, one primary CTA, then a `このあと受け取れるもの` explainer card.

What is genuinely right about it, and must be preserved:

* exactly one dominant action above the fold
* low density, no competing CTAs
* honest framing (`診断ではありません`)
* explicit duration and cost

What is wrong with it, and was not in the brief:

* **It is a different design language.** Dark-green accent and a serif display face, against the
  home surface's violet accent and sans-serif. Two visual systems in one product.
* **It drops the app shell.** No bottom navigation on this route, so it reads as a separate
  microsite rather than a surface of one product.
* **It presents 120 questions as the entry experience**, which §8 of the brief explicitly forbids as
  the default first meaningful interaction.

So `/check-in` is not the model for the daily loop. It is a good *test landing page* whose restraint
should be borrowed, occupying a route name that the product model needs for something else.

### 1.4 Consequences for the route map

`/check-in` currently means "start the 120Q test". The target model needs `/check-in` to mean "a
1–2 minute lightweight current-state interaction". These cannot both own the route.

Resolution recorded here, to be implemented and then verified against real traffic:

* the 120Q deep dive keeps a stable, explicitly-named route of its own
* `/check-in` becomes the lightweight interaction
* the existing URL must not 404 for anyone holding it — an explicit, tested redirect or a preserved
  alias is required, not an incidental one

### 1.5 Element disposition

| Element | Disposition |
|---|---|
| Bottom navigation (4 items) | **KEEP**, relabel and re-scope |
| `/check-in` restraint: one CTA, low density, honest framing | **KEEP** as a pattern |
| いま色テスト 120Q system | **KEEP**, reposition as Deep Dive, not entry |
| Home hero manifesto | **REFACTOR** into a state-aware Today hero |
| `体験の流れ` five-step explainer | **MOVE_BACKSTAGE** — belongs in `/about` |
| `YORISOUでできること` six-card grid | **REMOVE_FROM_PRIMARY_NAV** — becomes contextual |
| `YORISOU AI` section | **MOVE_BACKSTAGE** |
| `LINEで続ける` home section | **REFACTOR** into contextual continuity |
| Serif/dark-green visual system on `/check-in` | **DEPRECATE** — one system, not two |
| Violet gradient blob on home | **DEPRECATE** — the AI-gradient anti-pattern §29 rejects |

---

## 2. Product model

```
current:  Test → Result → Report → Exit
target:   Sense → Understand → Act → Save → Return → Discover
```

Primary navigation:

| Label | Concept | Owns |
|---|---|---|
| 今日 | TODAY | what is useful to this person now |
| 気づく | NOTICE | lightweight state interaction |
| 探す | EXPLORE | discovery across all object types |
| わたし | MY YORISOU | continuity: saved, history, state |

Business architecture — Yorisou Select, Yorisou Design, Community — is **not** consumer navigation.
It surfaces contextually, when relevant, in the recommendation system.

---

## 2b. Historical lightweight-flow recovery (REUSE / ADAPT / REJECT)

Required before inventing anything. Git history and the current tree were both searched.

| Candidate | Found | Decision | Why |
|---|---|---|---|
| Legacy 24Q runtime (`a77df84`, `104a296`) | replaced by the 120Q foundation | **REJECT** | It is a shorter DIAGNOSTIC with its own scoring and persona assignment. Reviving it would conflict with current canonical methodology and re-introduce a second assessment system. |
| `feat: add Yorisou check-in mini flow` (`07498c3`) | superseded | **REJECT** | Its product logic is the 24Q lineage above. |
| **DCI-1 `lib/yorisou/methods/daily-check-in`** | present and governed | **ADAPT (pattern only)** | Exactly the right contract — its acknowledgement cascade "picks COPY — it computes nothing about the person. No scoring, no AI generation, no prediction, no prescription." Finite authored copy, deterministic first-match, bounded options. |

**Why DCI-1's code is NOT imported.** It is a gated pilot that is **default CLOSED in Production**:
`dailyCheckInAccess` returns `denied_production`, the route calls `notFound()`, and the page is
`robots: noindex`. Wiring Today's primary action to it would dead-end for every real visitor, and
promoting another package's deliberately-closed pilot is not a decision PXR-1 gets to make.

So §5 applies: `lib/yorisou/today/currentStateCheckIn.ts` implements a NON-DIAGNOSTIC state capture
that follows DCI-1's pattern — bounded predefined choices, authored lookup copy, zero computation
about the person — with its own small versioned device-local contract. Eight tests pin that boundary,
including that it references no score, dimension, persona or archetype, performs no server sync, and
does not import the gated pilot.

**COPY_REFINEMENT_REQUIRED** — its reflection lines are minimal neutral Japanese placeholders for
Yorisou Agent refinement, not approved canonical copy.

## 2c. Visual QA findings

Per-breakpoint, during development rather than at the end.

**Today @ 390×844 — PASS.** One dominant action, no competing CTAs, rows on hairline dividers rather
than cards, real negative space, renders correctly with zero history.

**Today @ 1440 — TWO DEFECTS FOUND AND FIXED.**

1. The desktop header still carried the pre-PXR-1 IA (`今を知る / おすすめ / 体験を見つける / わたしの今`)
   while the bottom navigation already used the new one. Two navigations disagreeing about what the
   product contains is worse than either being wrong alone: the same person gets a different mental
   model depending on window width. Now identical across breakpoints, guarded by a test in both
   directions.
2. The primary action spanned the full 560px editorial column, which reads as an unfinished layout.
   Full-width where a thumb needs it, intrinsic width once there is room.

The mobile view was correct and revealed neither. That is the argument for per-breakpoint QA.

**`/today/check-in` @ 390×844 — PASS.** One question per screen, five large targets, 気づく correctly
active, back control on step 2.

## 2d. Canonical Result — audit of the real implementation

Read from `app/result/page.tsx` (309 lines) and its real data path, not a mock. The canonical data is
already well-shaped and must be preserved exactly:

`compatibility.assignment.nickname` · `publicTypeLabel` · `recognitionLine` · `heroChips` ·
`highlights` · `gentleNextStep` · `secondaryBadge` · `brandedTestName` · `currentStateNote`

Rendering runs through `RevealExperience` with stages hero → evidence → constellation → limits →
actions. **That progression is already close to the target hierarchy** (今のあなた → 気づいたこと →
今できること), which means this is a re-composition rather than a rewrite. Methodology and copy stay
untouched.

### Defects found above the fold at 390

1. **`recognitionLine` renders twice.** Once inside the hero gradient block and again immediately
   below in the 今の見え方 box. The same sentence appearing twice in the first viewport reads as a
   rendering bug and costs the space the primary action needs.
2. **Badge saturation.** Two `MvpPill`s, then `heroChips` (a chip row), then `secondaryBadge` — four
   distinct badge treatments before any action. §2 lists "multiple badges" as an explicit
   above-the-fold violation.
3. **No dominant next action in the first viewport.** `gentleNextStep` and the report links sit in the
   `GentleActions` stage, far below. The first screen currently ends on description.
4. **It is the second visual system.** Dark green (`#315F50`, `#4D7A69`), `display-serif`, and its own
   gradients and shadows — the same microsite identity the audit flagged on the 120Q landing. It must
   inherit canvas, spacing, button grammar and base typography from the foundation, keeping persona
   expression as a LAYER (motif, accent, editorial scale).
5. **Cards inside cards.** `MvpCard` wraps a gradient block which wraps a chip row. A card-reduction
   pass applies here more than anywhere else in the product.

### Constraint carried into implementation

Light-outcome and canonical-result semantics stay separate. They may share visual primitives —
section rhythm, recommendation patterns, save controls — but must never collapse into one universal
Result object: one reflects explicit selections and claims nothing, the other carries approved
persona truth. A shared presentation layer is the correct seam, not a shared storage or claim model.

## 2e. Benchmark synthesis — what was taken, and what was deliberately refused

Six products were read for structure, not for looks. Each row states the mechanism, whether Yorisou
adopts it, and why. "Refused" entries matter more than adopted ones: most of what makes these
products feel effortless would be actively harmful here.

| Product | Mechanism worth reading | Verdict | Reasoning |
|---|---|---|---|
| **Headspace** | Home answers "what is useful now", not "what is this app". One dominant action; the library is a tab, not the front door. | **ADOPTED** | This is the entire Today thesis. The old root screen was a five-step 体験の流れ diagram and a six-card capability grid — an answer to a question only a first-time evaluator asks, and only once. |
| **Headspace** | Session chrome is suppressed while you are inside a session. | **ADOPTED** | `/tests/ima-iro` now suppresses the shell; `/result` no longer does. Chrome is suppressed INSIDE something, never on an outcome. |
| **Finch** | Small daily interaction with a warm, non-judgemental acknowledgement; the app never scolds a gap. | **ADOPTED (pattern only)** | `/today/check-in` is 1–2 minutes with a lookup-based reflection. Yorisou adds no pet, no currency, no care-meter — a companion whose wellbeing depends on your input is leverage, and this product's users are tired. |
| **Finch** | Streaks and daily goals. | **REFUSED** | A streak converts rest into failure. 「今日はここまでにする」 already exists on the Result and must stay the emotional ceiling of the product. |
| **Duolingo** | Progress made legible: one clear next step, visible position in a sequence. | **PARTIALLY ADOPTED** | Kept as the 120Q progress bar and 残りN問, which describe a TASK. Rejected everywhere it would describe the PERSON. |
| **Duolingo** | XP, leagues, leaderboards, hearts, loss-aversion notifications. | **REFUSED — explicitly out of scope** | Competitive and punitive mechanics against self-understanding data would be coercive. わたし therefore has no counter, no total, and no chart. |
| **Spotify** | Every shelf states its basis: "Because you listened to…". | **ADOPTED, and hardened** | The direct ancestor of `RecommendationObject`. Yorisou goes further: the reason is a typed CLASS derived from evidence, and evidence that is not present degrades the class rather than keeping the sentence. Spotify can afford a wrong "because"; a product handling self-understanding cannot. |
| **Spotify** | Inferred taste profiles built from passive behaviour. | **REFUSED** | 保存する / 今は違う record what to show and what to stop showing. They are never read as evidence about who someone is, and `recommendationFeedback` is tested to contain no score, weight or affinity. |
| **Pinterest** | Browsing without a goal is legitimate; a grid invites wandering. | **PARTIALLY ADOPTED** | 探す groups by time and depth — the two things a person actually knows in the moment. Refused: infinite feed and a grid of thumbnails. Four honest entries beat forty tiles, and there is no padding inventory. |
| **LINE** | Meet people in the surface they already have open; returning must cost nothing. | **ADOPTED as-is** | The existing LINE return path is untouched by this package. It is a distribution reality, not a design idea to copy. |
| **All six** | A persistent bottom tab bar with 3–5 destinations. | **ADOPTED** | 今日 / 気づく / 探す / わたし, agreeing with the desktop header at every breakpoint — a test enforces both directions after 1440 QA caught them disagreeing. |

**The synthesis, in one line:** take the information architecture and the stated-basis discipline;
refuse every mechanism whose power comes from making a person feel behind.

## 2f. Reduction passes

**Card reduction.** Removed: the `MvpCard` wrapping the whole Result; the gradient block inside it;
the per-highlight card stack inside the evidence panel (now a separated list); the 120Q entry's
shadowed 「このあと受け取れるもの」 panel (now information on the canvas); and the 120Q's decorative
"signal strip", a bordered card whose entire content restated what the hero had said one screen
earlier. Three nesting levels became one.

**Badge reduction.** The Result went from four badge treatments above the fold to zero. Provenance is
NOT lost — the six-type source grammar is unchanged, and `SourceChip` became `SourceLabel`: the same
Japanese label, rendered as quiet text. Removed as pure repetition: an identical 「タイプ解釈」 chip on
every row of a list, and a 「このテストの限界」 chip sitting between a heading that says 限界 and a band
that says how sure the result is.

**CTA hierarchy.** One primary action per screen, in one colour, at one weight: Today, the check-in,
the 120Q entry and the Result now share the accent pill. Secondary paths are accent-coloured text.
The Result's 「今の詳しいレポートを読む」 was `#173B35`; the 120Q's was `#173B35` with its own shadow.

**Cross-surface link truth.** Fourteen internal links promised one product and opened another, because
`/check-in` is now a compatibility redirect to the 120Q. Labels wording a short interaction
(「クイックチェック」「またチェックインする」「もう一度チェックする」) now go to `/today/check-in`; labels
about the assessment go to `/tests/ima-iro`. Two on `/about` said 「24問チェックをはじめる」 for a
120-question test — a stale number, now corrected rather than merely re-pointed. The 120Q's own
analytics still reported `route: "/check-in"`; it reports where it actually is.

## 2g. Defects found by walking the product, not by reading the diff

Recorded because each was invisible in review and each was found by using the surfaces.

1. **Today crashed for every person who had completed a check-in.** `readCurrentStateCheckIn` parsed
   fresh JSON on each call; `useSyncExternalStore` compares snapshots by identity during render, so
   Today re-rendered, re-read, and threw *Maximum update depth exceeded*. The empty state returns a
   stable `null`, which is exactly why review missed it: the only users who could hit the crash were
   the ones the feature exists for. Fixed by caching against the stored string, in the store rather
   than the call site, with a regression test. `app/result/saveState.ts` already did this correctly.
2. **わたし told everyone they had no history.** The page was a static shell with
   「まだ記録はありません」 hard-coded, shown to people who had records. Now a client island over the
   real records.
3. **`highlightSummary` duplicated the evidence panel.** It is the highlights joined into one
   sentence; the recomposition moved it directly above the panel that lists those same highlights
   individually. Same-viewport duplication, reintroduced while fixing a different duplication. It now
   lives only in the screen-reader summary, where a joined sentence is genuinely useful.
4. **`gentleNextStep` rendered twice** — promoted into the hero without removing the original inside
   つぎの一歩.
5. **`space-y-*` is inert wherever a child carries a margin utility.** Tailwind v4 emits
   `:where(.space-y-N > :not(:last-child))` at zero specificity, so a `m-0` on a child wins and the
   gap silently disappears. Found as a collapsed gap in the evidence panel. PXR surfaces use
   `grid gap-*`, which no child margin can defeat. Note: ~300 `space-y-*` usages remain across 63
   files outside this package's scope — a foundation-wide sweep is a separate, mechanical change.
6. **A `<details>` with `display: grid` leaves a dead band under the closed summary.** The UA hides
   non-summary children through a slot rather than removing them from layout, so the grid keeps their
   tracks. Spacing belongs on the children.
7. **Overriding `<summary>` to `inline-flex` removes its `list-item` box**, taking the disclosure
   marker with it. Height now comes from padding.
8. **A whole-card link swallowed the reason line into its accessible name** —
   「よりそうが用意した内容今の気配を見る…はじめる」. The reason is context for the card, not a
   destination, so it sits outside the link.

## 2h. Accessibility gate — and the defect it caught in the design foundation

`tests/smoke/pxr1-a11y.spec.ts` runs axe over all seven refounded surfaces at 390 and 1440, against
`wcag2a / wcag2aa / wcag21a / wcag21aa`. Serious and critical fail the gate; moderate and minor are
printed. Failing on the advisory tiers would make the gate noisy enough to be ignored, which is worse
than not having it.

**First run: 28 of 28 failed, all on `color-contrast [serious]`.**

The cause was a single token this package introduced. `--pxr-text-muted` was `#8a847c`, which measures:

| Background | Contrast | AA (4.5:1 for body text) |
|---|---|---|
| `--pxr-surface` `#ffffff` | 3.70:1 | fail |
| `--pxr-canvas` `#faf8f4` | 3.49:1 | fail |
| body background `#f8f4ec` | 3.37:1 | fail |
| `--pxr-surface-emphasis` `#f4f1ea` | 3.28:1 | fail |

That token carries every eyebrow, every timing hint, every provenance label and every quiet
supporting line in the product — so the foundation shipped a systemic contrast failure on every
surface at once, and the surfaces it hit hardest were the ones the reduction passes had made
type-and-space rather than cards. This is the argument for running the gate on a real page rather
than eyeballing a palette: nothing about `#8a847c` looks wrong next to `#faf8f4`.

Corrected to `#6b655d` — 5.11:1 to 5.76:1 across the same four backgrounds, still unmistakably the
quiet tone (`--pxr-text-secondary` sits at 6.99:1 to 7.88:1). `--pxr-text-primary` (15.3:1 to 17.2:1)
and `--pxr-accent` (6.3:1 to 7.1:1) already passed. **Second run: 14 of 14 pass.**

The bottom navigation's inactive label uses `--yorisou-color-neutral-500` (`#635c73`) from the older
token set and was not implicated.

## 2i. Visual QA matrix — final pass

| Surface | 390×844 | 430×932 | 1440×900 |
|---|---|---|---|
| 今日 | PASS | PASS | PASS (after the 1440 IA and CTA-width fixes in §2c) |
| 気づく | PASS — three depth rungs, shortest first | PASS | PASS |
| 探す | PASS | PASS | PASS — cards hold the 560px measure, ▸なぜこれ？ marker present |
| わたし | PASS — real history, not a hard-coded empty state | PASS | PASS |
| 今の気配 (light) | PASS — one question, five large targets | PASS | PASS |
| いま色テスト entry | PASS — product frame and accent | PASS | PASS |
| Result (Pass A) | defects found and fixed — see §2g | — | PASS |
| Result (Pass B) | PASS — each fact once, one action above the fold | PASS | PASS |

Interaction verified in the browser rather than inferred from the code: 保存する writes and the label
becomes 保存済み; the item then appears under わたし → 保存したもの; 今は違う replaces the card with a
「今は表示しません」 row carrying もどす; and なぜこれ？ opens the frozen disclosure. Today was re-checked
WITH a check-in record present, which is how the crash in §2g was found.

## 3. Deferred / not yet implemented

Recorded honestly so the next session does not have to re-derive it:

* design foundation tokens and the AppShell relabel
* Today, Result-as-state-dashboard, Explore, My Yorisou surfaces
* the `RecommendationObject` contract and its save / dismiss / why-recommended interactions
* first-run progressive disclosure replacing 120Q-as-entry
* `/check-in` route resolution with tested legacy compatibility
* benchmark synthesis matrix
* visual QA loop, accessibility and performance validation
* Preview acceptance and PR

**Status as of the current branch head.** Implemented: the design foundation tokens and AppShell
relabel; Today; the light `/today/check-in`; the recomposed canonical Result; `RecommendationObject`
with its five reason classes and なぜこれ？ / 保存する / 今は違う; 探す; わたし; the history read model;
route resolution with tested legacy compatibility; the benchmark synthesis above; the reduction
passes; and per-breakpoint visual QA at 390 / 430 / 1440.

Still deferred, and honestly so:

* **first-run progressive disclosure** beyond ordering 気づく shortest-first — no multi-step onboarding
  was built, because one would need approved copy this package does not have;
* **`BASED_ON_EXPLICIT_INTEREST`** has a class, a disclosure and a test, but no surface yet writes an
  explicit interest. It is a contract waiting for a feature, not a claim being made;
* **the `/en` tree** still routes 「Quick Check」 to `/en/check-in`. There is no English light
  interaction, and inventing one would mean writing unapproved English copy;
* **`OpenTestingNotice`** keeps the old palette. It is shared by many pages outside this package, so
  restyling it is a foundation-wide change, not a PXR-1 one;
* **all copy marked `COPY_REFINEMENT_REQUIRED`** — the check-in reflections, the reason disclosures and
  the discovery inventory are neutral working Japanese, written to be true rather than final.
