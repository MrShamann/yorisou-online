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

Nothing in this list has been implemented yet. The branch currently contains this document only.
