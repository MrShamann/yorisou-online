# YORISOU PXR-1 — Product Experience Refoundation

Status: **IMPLEMENTED — PR #130 OPEN / UNMERGED / pending final audit.**

This document is the canonical product/design record for PXR-1.

**How to read it.** The document accumulated in layers, and an earlier revision let those layers argue
with each other — §1 described the pre-PXR product in the present tense while §2 described the built
one, and §3 listed as "not yet implemented" things §2 records as shipped and tested. A reader could
take either as current. Every section is now labelled:

| Label | Meaning |
|---|---|
| **INITIAL AUDIT FINDING** | What was observed BEFORE the work. Historical. Not current truth. |
| **DECISION** | What was chosen, including where the choice reversed the initial plan. |
| **FINAL IMPLEMENTED STATE** | What is in the branch now, with evidence. |
| **DEFERRED** | Genuinely not done, with the reason. |

§1, §2d and the "current:" line of §2 are INITIAL AUDIT FINDING throughout. §2b (the REUSE / ADAPT
/ REJECT table) and §2c (per-breakpoint QA during development) are DECISION records. §2e–§2j are
FINAL IMPLEMENTED STATE. §3 is DEFERRED. §2's target model is the DECISION the whole package serves.
Where a decision reversed the plan recorded in §1, the reversal is stated in place rather than by
editing the original away — the reasoning is worth keeping, the stale conclusion is not.

**Scope boundary.** PXR-1 touches product experience only. It does not touch PR #129, PR #127,
Production, the account-deletion executor, or any POR-1 security or recovery BEHAVIOUR.

One POR-1 file did change, and saying "no POR-1 file changed" would be false: `tests/por1/
dump-question-bank.ts` received a mechanical import-path update, and nothing else, because the
canonical 120Q module moved from `app/check-in` to `app/tests/ima-iro`. It is the only file matching
`por1` in `git diff --name-only a05a6256..HEAD`, and its entire diff is the one import line.

---

## 1. Live audit — what the product WAS before this package

**INITIAL AUDIT FINDING. Historical throughout — this section describes the pre-PXR-1 product.**
Everything below is written in the present tense of the day it was audited and has been left that way
deliberately. For what the product is now, read §2e–§2j.

Audited `https://yorisou.online` directly at 375×812, 2026-08-12, before any change landed.

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
  **DECISION — REVERSED.** This finding was half right and the half it got wrong matters. Suppressing
  chrome is correct INSIDE a running assessment and wrong on an outcome. What actually shipped:
  `/tests/ima-iro` keeps a minimal top bar and no tab bar, and `/result` — which previously suppressed
  the shell — now carries it. See §2e (Headspace row) and §2f.
* **It presents 120 questions as the entry experience**, which the brief explicitly forbids (the brief itself is not in this repository) as
  the default first meaningful interaction.

So `/check-in` is not the model for the daily loop. It is a good *test landing page* whose restraint
should be borrowed. Whether it should also give up its route name was the open question §1.4 answered.

### 1.4 Consequences for the route map — DECISION, REVERSING THE INITIAL PLAN

**The initial plan, recorded during the audit, was: `/check-in` becomes the lightweight interaction.
THAT IS NOT WHAT SHIPPED, and the reversal is the single most important correction in this document.**

Why it reversed: every shared link, saved link, bookmark and LINE mini-app entry pointing at
`/check-in` was created when that path meant the 120Q. Handing the path to a 1–2 minute interaction
would keep returning 200 while delivering a different product — the exact drift this package exists to
stop, committed deliberately. Worse than a 404, because nothing tells the person what they saved is
gone.

**FINAL ROUTE TRUTH.** This is the contract; `app/__tests__/pxr1RouteContract.test.ts` and
`lib/server/__tests__/miniAppEntryRouting.test.ts` enforce it.

| Route | Meaning |
|---|---|
| `/` | 今日 — the product home |
| `/today/check-in` | the 1–2 minute NON-DIAGNOSTIC light interaction |
| `/tests/ima-iro` | the canonical 120Q いま色テスト Deep Dive |
| `/check-in` | LEGACY COMPATIBILITY — redirects to the 120Q, carrying the governed LINE entry context |

`/check-in` is not reclaimed. Reclaiming it later is a migration decision that needs inbound-link
evidence, not a rename.

### 1.5 Element disposition

| Element | Disposition |
|---|---|
| Bottom navigation (4 items) | **KEEP**, relabel and re-scope |
| `/check-in` restraint: one CTA, low density, honest framing | **KEEP** as a pattern. Note: the surface described here is now served at `/tests/ima-iro`; `/check-in` renders nothing and only redirects. |
| いま色テスト 120Q system | **KEEP**, reposition as Deep Dive, not entry |
| Home hero manifesto | **REFACTOR** into a state-aware Today hero |
| `体験の流れ` five-step explainer | **MOVE_BACKSTAGE** — belongs in `/about`. **EXECUTED AS A DELETION, not a move:** it was removed from the home surface and `/about` never received it. Recorded in §3 as deferred rather than quietly counted as done. |
| `YORISOUでできること` six-card grid | **REMOVE_FROM_PRIMARY_NAV** — becomes contextual |
| `YORISOU AI` section | **MOVE_BACKSTAGE** |
| `LINEで続ける` home section | **REFACTOR** into contextual continuity |
| Serif/dark-green visual system on `/check-in` | **DEPRECATE** — one system, not two. Done for that surface's frame, type and primary action; see §3 for the components where it survives. |
| Violet gradient blob on home | **DEPRECATE** — the AI-gradient anti-pattern the brief rejects |

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

So the non-diagnostic rule applies: `lib/yorisou/today/currentStateCheckIn.ts` implements a NON-DIAGNOSTIC state capture
that follows DCI-1's pattern — bounded predefined choices, authored lookup copy, zero computation
about the person — with its own small versioned device-local contract. Nine tests pin that boundary,
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

**INITIAL AUDIT FINDING. Historical.** The five defects below are stated in the present tense of the
audit and were all subsequently fixed — see §2f, §2g and the §2i matrix. Read from
`app/result/page.tsx` at the base commit (309 lines; the file is longer now) and its real data path,
not a mock. The canonical data is already well-shaped and must be preserved exactly:

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
   distinct badge treatments before any action, which the brief lists as an explicit above-the-fold
   violation.
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
| **LINE** | Meet people in the surface they already have open; returning must cost nothing. | **ADOPTED, and repaired** | An earlier revision of this row claimed the LINE path was "untouched by this package". That was FALSE and it hid a real regression: moving the 120Q off `/check-in` turned the mini-app entry into a redirect that dropped the query string, and the 120Q runtime reads `entry_source` / `source` / `nav` from it to decide `isMiniAppEntry` — which changes how completion navigates. New Japanese entries now target `/tests/ima-iro` directly, and `/check-in` carries the governed context across the redirect. See §2f. |
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

**CTA hierarchy.** Today, the light check-in and the 120Q entry each have exactly one primary action,
in one colour, at one weight — the accent pill. Secondary paths are accent-coloured text. The 120Q's
primary was `#173B35` with its own shadow before this.

**The Result is deliberately different, and an earlier revision of this paragraph described it
wrongly.** Its accent pill — 「今の詳しいレポートを読む」, previously `#173B35` — exists, but it is in the
つぎの一歩 stage — the source name for the section a reader sees titled 「このあと読めるもの」 — NOT in
the first viewport. The first viewport ends on a sentence:

> 今できること — 今日は、気になったことをひとつだけ言葉にしてみてください。

That is `gentleNextStep`, and it is **a behavioural next step, not a call-to-action**. All 24 approved
variants end 〜てみてください: they invite something away from the screen. The hero stage contains no
anchor, button or handler, and that is the design — the first thing a person meets after being
recognised should not be a button, and reading the paid report must not become the first-screen CTA
merely to make a sentence about CTA hierarchy true.

So the accurate statement is: **one suggested step above the fold, and the report CTA below it.**
"One call-to-action further down" would also be wrong: below the hero the Result carries the accent
pill, an accent text link to 今のヒントを見る, `OpenTestingNotice`'s filled `--cta-main` primary, and a
second link to the SAME report destination. §3 lists those; the accurate scope of the PASS in §2i is
the hero, not the page. §3 records the Result surfaces where a second colour and weight still survive.

**Cross-surface link truth.** Fourteen internal links promised one product and opened another, because
`/check-in` is now a compatibility redirect to the 120Q. Labels wording a short interaction
(「クイックチェック」「またチェックインする」「もう一度チェックする」) now go to `/today/check-in`; labels
about the assessment go to `/tests/ima-iro`. The 120Q's own analytics still reported
`route: "/check-in"`; it reports where it actually is.

**The stale 24-question claim, corrected properly the second time.** An earlier revision said two
`/about` labels were "corrected rather than merely re-pointed". Only the two LABELS had been changed;
the number survived in the prose beside them and in eight other places, including the site-wide
fallback metadata rendered on every page that sets none of its own. All of it is now corrected against
the canonical counts (`currentStateQuestions.length` = 120, `PUBLIC_ARCHETYPE_TAXONOMY.length` = 24):

| File | Was | Now |
|---|---|---|
| `app/layout.tsx` title | `今の自分を知る24問チェック` | the approved 今日 title — a site-level title should name the product, not one assessment |
| `app/layout.tsx` description | `…24問でふり返り…` | the count removed, the non-diagnostic clause kept |
| `app/about/page.tsx` | `最初の入口は、24問チェックです` | `…いま色テストです` |
| `app/about/page.tsx` | `今の状態を、短くふり返ってみる` + `まずは24問チェックから。` | 短く removed and the test named — the button beside it opens 120 questions, and 短く now belongs to `/today/check-in` |
| `app/methodology/page.tsx` ×5 | `24問…` incl. `6つの公開結果` | the approved test name; the result count corrected to 24 |
| `app/data/productCards.ts` | `24問` badge, `/check-in` placeholder | `120問`, `/tests/ima-iro` |

24問 correctly remains in the relationship-fatigue surfaces, which really are 24 questions. A scoped
assertion in `app/__tests__/pxr1RouteContract.test.ts` walks the `.ts`/`.tsx` files under `app/` and
`lib/`, skipping test directories, and fails on any 24問 line unless its path or the line itself names
relationship-fatigue.

That exemption is per LINE, and the first version of it was per FILE — which made the guard useless
for the defect it was written after. `app/data/productCards.ts` holds cards for both tests, so
matching the name anywhere in it exempted the whole file, including the badge this package had just
corrected; sixteen files under `app/` were exempt the same way. Proven empirically: with the
file-wide rule, re-introducing the exact corrected badge passed. With the per-line rule, that
regression, one in an unrelated `app/` surface, and one in `lib/` are all caught.

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

(28 and 14 count different things and both are stated here so the pair is not read as a shrinking
denominator: 7 surfaces × 2 widths = 14 cases, run under both Playwright projects on the first pass
and under `--project=desktop` alone thereafter — the assertions are identical, so one project is
sufficient and is what `npm run test:pxr1-a11y` pins.)

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
| Result (Pass B) | PASS — each fact once in the hero; one suggested step above the fold, the report CTA further down (§2f) | PASS | PASS |

Interaction verified in the browser rather than inferred from the code: 保存する writes and the label
becomes 保存済み; the item then appears under わたし → 保存したもの; 今は違う replaces the card with a
「今は表示しません」 row carrying もどす; and なぜこれ？ opens the frozen disclosure. Today was re-checked
WITH a check-in record present, which is how the crash in §2g was found.

## 2j. Delivery state — PR #130

Branch `feat/pxr-1-product-experience-refoundation`, based on `main` `a05a6256`.
**PR #130 is OPEN and UNMERGED. Nothing was deployed to Production. The merge decision is the
Founder's.** PR #129 (`b65a947`), PR #127 and `main` are untouched — verified against the remote refs
before and after every push.

**No head of THIS branch is pinned in this document, deliberately.** Any commit that edits this file
changes it, so a "final head SHA" written here is stale the moment it is written. The exact head lives
in the PR, in CI, and in the governed handoff.

`b65a947` above is the tip of another branch, cited to say what was observed as untouched. It is a
live tip too, so treat it as *observed at the time of writing*, not as a fixed point. Every other SHA
below appears in the form *validation evidence at `<sha>`*, which stays true permanently.

### Gate results — validation evidence at the merge-readiness remediation head

| Gate | Result |
|---|---|
| `tsc --noEmit` | 0 errors |
| `eslint` | 0 errors (13 pre-existing warnings, none in PXR-1 files) |
| `next build`, cold, clean `.next` | compiled successfully, 0 font-fetch errors |
| local suites | 66 / 66 |
| axe, 7 surfaces × 2 widths | 14 / 14, serious + critical = 0 |
| CI at the exact head | see the PR — required green before merge |

Earlier validation evidence at `484250b` recorded 64 / 64 local suites; the two additional suites are
`test:pxr1-line-compat` and `test:checkin-runtime`, the second of which existed in the repository but
was wired to no npm script and no workflow, so nothing ran it. Both now run locally and in
**Yorisou Check**.

### LINE mini-app entry — end-to-end evidence

Run against a production build (`next build` then `next start`), because the compatibility contract is
an HTTP redirect and a unit test alone would not prove the route wiring:

| Request | Response |
|---|---|
| `/check-in?source=line&entry_source=line-mini-app&nav=hard&v=20260702-pr61&line_status=linked&utm_campaign=spam&redirect=https%3A%2F%2Fevil.example.com` | `307 → /tests/ima-iro?source=line&entry_source=line-mini-app&nav=hard&v=20260702-pr61&line_status=linked` — governed context kept, `utm_campaign` and `redirect` dropped |
| `/check-in` | `307 → /tests/ima-iro` — clean, no query, no loop |
| `/check-in?nav=hard` | `307 → /tests/ima-iro?nav=hard` — a single `isMiniAppEntry` trigger survives alone |
| `/online-check-in?entry_source=line-mini-app&junk=1` | `307 → /check-in?…` and then filtered by the allowlist on the second hop |
| `/en/check-in?source=line&entry_source=line-mini-app` | `307 → /check-in?entry_source=line-mini-app` — English unchanged, and now better than before, since `/check-in` no longer discards what it is handed |
| following redirects from a full LINE entry | final URL `/tests/ima-iro?source=line&entry_source=line-mini-app&nav=hard&v=20260702-pr61`, `200` |

### The one open blocker, and what it actually is

**The Vercel Preview deployment fails. It is a hosting-configuration defect, not a defect in this
branch — and the previous revision of this section got that wrong twice.**

The build log was reached with the Vercel CLI already authorised on this machine (`vercel whoami`,
`vercel inspect --logs`, `vercel env ls` — read-only). The failure, verbatim:

```
shared-store boundary refused: preview_shared_store_not_isolated — database project could not be identified
Error: preview_shared_store_not_isolated
> Build error occurred
Error: Failed to collect page data for /admin-entry/reset
Error: Command "npm run build" exited with 1
```

Compilation and TypeScript both PASS. The failure is at Next.js page-data collection.

**Mechanism.** `lib/server/yorisouData.ts:293` asserts the POR-1 shared-store boundary at module top
level and reads `process.env.SUPABASE_URL` at line 298. On Vercel `VERCEL_ENV=preview` selects the
strict branch. The unscoped Preview environment supplies `YORISOU_SHARED_STORE_BUCKET`, `_ENDPOINT`,
`_SECRET_ACCESS_KEY` and `_REGION` — so mode, bucket and endpoint all pass — and then
`lib/server/sharedStoreBoundary.ts:122` fails because `SUPABASE_URL` has no unscoped Preview entry.
`vercel env ls` shows it scoped to four other branches plus Production, and **zero variables scoped to
`feat/pxr-1-product-experience-refoundation`**. Importing that module through
`app/admin-entry/reset/route.ts` → `lib/server/yorisouAuth.ts:19` aborts the build.

**Proof that the code is not the variable.** Deployments `dpl_5GJmtQofyLDZLNBWSpD5a2P3HCew` (Error,
19:28:29) and `dpl_AgCEMMRKeZmsFvcunScnGkchaAPh` (Ready, 19:48:34) are the **same commit `3c8b021` on
the same branch, twenty minutes apart**. Identical source, opposite outcomes. What changed between
them was Vercel environment configuration.

**TWO CORRECTIONS TO THIS DOCUMENT'S OWN PRIOR CLAIMS.** Both were written by the implementing session
and both were wrong:

1. *"Its logs need Vercel credentials that are not available in this environment."* **False, and false
   when written.** A linked project, an installed CLI and a live session were all present. The session
   concluded the logs were unreachable without checking `~/Library/Application Support/com.vercel.cli`
   or running `vercel whoami`. Everything that followed from it — "the cause is not established", the
   throwaway-PR bisect that was declined — followed from an unchecked assumption.
2. *"reproducible and specific to this branch."* **False.** The identical signature — same error code,
   same detail string, same failing route — hit `fix/por1-production-incident-classification-2` on
   2026-08-11 and `fix/por1-production-deletion-recovery-1` on 2026-08-10. Both went green after
   acquiring branch-scoped Preview variables. The two green builds cited as evidence of other branches
   being healthy were on `fix/por1-production-incident-classification-2`, not on this branch.

**Why green CI carried no information here.** No workflow sets `VERCEL_ENV`, and none sets
`YORISOU_SHARED_STORE_BUCKET`, so `resolveSharedStoreMode` returns `disabled` and the boundary
resolves to `local-development` at `sharedStoreBoundary.ts:152-156`. The strict preview branch at
line 80 is never entered. The four CI build jobs could not have caught this, and citing them as
evidence about the Preview was a category error. `scripts/yorisou-env-check.mjs` requires only the two
`YORISOU_SHARED_STORE_*` variables and never mentions `SUPABASE_URL`, so the nominal env guard cannot
catch it either.

**Remediation — NOT APPLIED, needs Founder authorisation.** It is a Vercel project setting, outside
what this package may change:

> Add `SUPABASE_URL` (and `SUPABASE_SERVICE_ROLE_KEY`, scoped identically) to the **unscoped Preview**
> environment, pointing at the same Supabase project the unscoped Preview
> `YORISOU_SHARED_STORE_ENDPOINT` already targets — `sharedStoreBoundary.ts:124` requires the store
> project ref and the database project ref to MATCH.

Unscoped rather than branch-scoped on purpose: `sharedStoreBoundary.ts:3-8` records that
branch-scoped Vercel variables caused the original POR-1 incident, so fixing this branch with another
branch-scoped variable would reproduce the pattern the module exists to prevent and guarantee the next
new branch fails the same way.

**Consequence for merge.** `main` auto-deploys. Merging a branch whose Preview build fails is the one
thing this state forbids, and the hosted Preview audit is UNRUN until the deployment is green. Nothing
here is a source change, so no further code fix will move it.

Also corrected: the deployment id `DfwHsdwAR86jVrtiv8cBPiASKD7f` only resolves with the `dpl_` prefix.

### One expected local skip

**Three POR-1 shared-database suites are ordering-sensitive.** `test:por1-catalogue-baseline`,
`test:por1-store-ownership` and `test:por1-append-only-erasure` operate on one local Postgres and can
fail a precondition when run back to back; each was observed passing in isolation, and each prints its
own PASS verdict. They are excluded from the local suite count rather than counted as passes. Nothing
in this branch touches `supabase/migrations`. `test:cpc1-acceptance` requires a hosted Preview URL and
is excluded for the same reason.

## 2k. What the merge-readiness pass found in its OWN work

An independent audit passed the architecture and named four blockers. Fixing them and then verifying
the fixes adversarially found five more, four of them created or missed by the fix itself. Recorded
because "the remediation introduced a defect" is the finding most likely to be quietly dropped.

1. **A CI gate that asserted nothing.** `test:checkin-runtime` was added to Yorisou Check to prove the
   LINE contract. The file only EXPORTS `runCheckInRuntimeValidationTest()`; nothing invoked it, and
   `node --import tsx <file>` merely imports. It exited 0 having executed zero assertions — and when
   actually invoked it FAILED, because four of its assertions still demanded a client-built absolute
   result URL that UX-2 had deliberately removed. So a permanently-green no-op was wired in and
   described as a gate. It is now registered with `node:test`, the four stale assertions were restored
   to the contract the code actually implements, and the whole ~40-assertion contract runs.

2. **A repeated parameter demoted a real LINE visitor.** The first fix dropped EVERY array value and a
   test justified it as refusing ambiguity. `?nav=hard&nav=hard` is not ambiguous, and LIFF produces
   exactly that shape by appending a launch query onto an endpoint URL that already carries it. The
   guard against the defect reintroduced the defect. Repeats that agree now resolve; only genuine
   disagreement is refused.

3. **The two sides agreed on keys and disagreed on values.** The builder copied the four optional LINE
   context fields verbatim from arbitrary upstream input while the legacy route validated them, so a
   value the builder happily minted could be silently dropped one redirect later. Both sides now run
   the same check, so anything emitted survives by construction.

4. **The stale-truth guard exempted the file it was written for.** Covered in §2f.

5. **A half-edited page.** `app/methodology` had its CTA re-pointed at the 120Q while its lead still
   said 「まずはチェックインから始めて」 and its title still promised 「軽く試してみる」 — byte-for-byte the
   defect removed from `/about` in the same pass, one file over. Also corrected there: a
   「4つの状態ラベル」 claim with no four-value set anywhere in the code, sitting one line below the
   count that had just been fixed. The number was dropped rather than replaced, because any
   replacement would have been invented.

## 3. DEFERRED — what is genuinely not done

This section previously carried the package's ORIGINAL to-do list, written before any code existed,
alongside a later paragraph saying most of it was implemented. Both were in the same section, and a
reader had no way to tell which was current. The original list is gone; what follows is only what is
actually outstanding.

**Product**

* **First-run progressive disclosure** beyond ordering 気づく shortest-first. No multi-step onboarding
  was built; one needs approved copy this package does not have.
* **`BASED_ON_EXPLICIT_INTEREST`** has a reason class, a frozen disclosure and tests, but no surface
  writes an explicit interest yet. A contract waiting for a feature, stated as such rather than faked.
* **`体験の流れ`** was recorded in §1.5 as MOVE_BACKSTAGE to `/about`. It was removed from the home
  surface and `/about` never received it. Either move it or retire the disposition.
* **`/services`** is a redirect-only alias into the assessment, and `/about` links to it labelled
  「サービスの流れを見る」 — a label promising an explainer and delivering a 120-question test. Same class
  as the fourteen links §2f repointed; left alone because choosing its destination is a product
  decision, not a compatibility fix.
* **`/private-state`** is titled 「わたしの今」, a pre-PXR-1 IA label for the concept now called わたし at
  `/me`. Renaming a live surface is a product decision.
* **The `/en` tree** still routes 「Quick Check」 to `/en/check-in`. There is no English light
  interaction, and inventing one would mean writing unapproved English copy. `/en/check-in` reaches
  the 120Q through `/check-in`, which now preserves the entry context instead of discarding it.
  `app/en/about/page.tsx` and `app/en/page.tsx` additionally promise "a short check-in" above links
  that resolve to the 120 questions — the same broken promise corrected on the Japanese `/about`, left
  because correcting English copy is a content decision. No number is involved, so the 24問 guard
  cannot catch it either.
* **LIFF `liff.state`** entries are not carried. LINE can deliver the launch query nested inside
  `?liff.state=…`; the allowlist does not unwrap it, so that shape reaches the 120Q without its entry
  context. This is NOT a regression — before this package `/check-in` rendered the flow directly and
  the parameters were equally absent from the top-level query — but it is a real LINE URL shape that
  lands on the web completion path.
* **`/line/mini-app/result` and `/en/line/mini-app/result`** call the CHECK-IN handoff builder, so a
  "result entry" opens the assessment. `buildMiniAppResultHandoffHref`, the builder that targets
  `/result`, has no callers at all. Pre-existing and unchanged in outcome by this package; naming the
  right destination is a product decision.

**Visual system — where the second palette survives**

§1.5 marked the dark-green/serif system DEPRECATE. That is done for the 120Q entry's frame, type and
primary action, and for the Result's hero and reveal panels. It is NOT done in the following — a
list that omitted its own largest entry until an independent pass caught it:

* `app/tests/ima-iro/MiniTestFlow.tsx` — the ENTRY frame, type and primary action were converted, but
  the quiz phase behind it was not: `#4D7A69` kickers, a `display-serif` question heading, `#173B35`
  option and advance buttons with their own shadows, and `#315F50` text. The restart-confirm dialog on
  the entry screen is also still `#173B35`. This is the surface §1.5 points at, so the pointer dangled
  at the one file that most needed naming.

* `app/result/reveal/TraitConstellation.tsx` — hard-codes `#4D7A69`, `#315F50`, `#F4FAF7`, `#E9B7C9`,
  `#49615B`, `#6F625C`, no tokens. It is stage 2 of the recomposed Result, so the old palette is
  inside the reveal, not merely below it.
* `app/result/PrivateResultSave.tsx` and `app/result/InterpretationResponse.tsx` — filled `#173B35`
  controls. Below the fold, and touching consent and save UI, so out of scope for a remediation pass.
* `app/components/OpenTestingNotice.tsx` — its primary resolves to `--cta-main: #173b35` with a drop
  shadow, giving the Result a third filled colour. Shared by many pages; restyling it is a
  foundation-wide change.
* `app/result/PersistedResultUnavailable.tsx` — the concealed-record render path for `/result`. Uses
  `container`, `max-w-[34rem]` and hard-coded hexes rather than the PXR frame, and is covered by
  neither the QA matrix nor the a11y spec.

**Result — known, unfixed, and not claimed as fixed**

* When `fullReportHref` exists, `/result` offers the SAME destination twice: 「今の詳しいレポートを読む」
  (the accent pill, in the section titled 「このあと読めるもの」) and 「詳しいレポートへ進む」
  (`OpenTestingNotice`, the stage below). That
  is in tension with "each fact once"; §2i's PASS is scoped to the hero, not to the whole page.
* `heroChips` was dropped from the Result render but still appears on three Result-owned surfaces:
  `app/result/opengraph-image.tsx`, `app/result/share/page.tsx` and
  `app/result/share/opengraph-image.tsx`. Removed from one surface rather than deduplicated across
  them. `secondaryBadge` is no longer rendered as a distinct element anywhere — it survives only as
  `heroChips[1]`.
* No automated test asserts the presence, position, colour or count of any call-to-action. The CTA
  claims in §2f rest on manual QA and cannot regress-detect.

**Foundation**

* **`space-y-*` is inert** wherever a child carries a margin utility — Tailwind v4 emits it at zero
  specificity. PXR surfaces use `grid gap-*`; roughly 300 usages remain across 63 files outside this
  package's scope.
* **Performance validation** was in the original plan and was never run. Not attempted, not claimed.
* **`por1SharedStoreBoundary.test.ts`** has no case for `preview` + `supabaseUrl` undefined — the one
  path that has now failed three Preview deployments in the wild. Adding it would touch a POR-1 test
  file. The scope boundary this package actually followed is about POR-1 BEHAVIOUR, so the honest
  reason is narrower: writing that case means deciding what the boundary should do when a Preview
  build has no database URL, which is the same decision the hosting fix in §2j turns on.

**Release**

* **The hosted Preview audit is UNRUN**, blocked on the Vercel configuration defect diagnosed in §2j.
  It is not a source defect and no code change will clear it.

**Copy**

* Everything marked `COPY_REFINEMENT_REQUIRED` — the check-in reflections, the reason disclosures and
  the discovery inventory — is neutral working Japanese, written to be true rather than final.
