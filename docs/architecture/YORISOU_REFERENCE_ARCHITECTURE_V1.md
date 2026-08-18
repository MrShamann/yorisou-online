# YORISOU Reference Architecture v1.0

**Status:** CANONICAL · **Version:** 1.0 · **Date:** 2026-08-18
**Authorization:** Founder package `YORISOU-REFERENCE-ARCHITECTURE-V1-FOUNDATION`
**Verified checkpoint:** `main` @ `5245b10` · production `https://yorisou.online` (release `5245b105c71d`)
**Companions:** [YORISOU_MODULE_CONTRACTS_V1.md](YORISOU_MODULE_CONTRACTS_V1.md) (the 12 capability contracts) ·
[YORISOU_ARCHITECTURE_GAP_AND_EXECUTION_PLAN_V1.md](YORISOU_ARCHITECTURE_GAP_AND_EXECUTION_PLAN_V1.md) (repo audit + execution order)

This document is the target architecture for the Yorisou product refoundation. It does not modify the
active v0.7.0 Project Resources, does not resolve any open Founder decision (D-03 Auto-Memory
Threshold and D-09 Local/Cloud Synchronization remain OPEN), and does not itself change any product
behavior. Where this document and repository/runtime evidence disagree about the *present*, the
repository is the truth and the gap belongs in the gap document — this file describes the *target*.

---

## 1. Product thesis

> **Users live their life; Yorisou operates the Life OS in the background.**

The person is never asked to operate an enterprise Life OS. Complexity — capability modules,
contracts, events, projections, governance — belongs underneath the UX. The consumer surface stays
what production already is today: a calm Japanese-language, mobile-first companion with one primary
action per moment, no dashboards, no KPI walls, no chatbot-first home.

Yorisou helps a person:

| Pillar | Consumer meaning |
|---|---|
| UNDERSTAND | understand myself |
| DISCOVER | encounter something new today |
| LIVE | try, experience, reflect |
| CONNECT | understand and connect with other people |
| CONTINUE | see how I change over time |

These five pillars are design vocabulary, not UI labels. They are never exposed as technical
architecture labels in normal consumer UI.

## 2. Four product engines

| Engine | Purpose (in the user's words) | Primary examples |
|---|---|---|
| **Recognition** | 「ちょっと自分っぽい。」 | Imairo, structured tests, relationship/work/rhythm tests |
| **Novelty** | 「今日、Yorisouは何をくれる？」 | 今日のひとつ (Daily Discovery): symbolic draw, three-question check, visual choice, binary intuition, mini story, seasonal |
| **Continuity** | 「Yorisouは私の歴史をだんだん分かってくれる。」 | Quick Check-in, Daily Response, Small Next Step, Evening Return, Reflection, Timeline, Weekly/Monthly Reflection, Pattern, user-confirmed durable memory |
| **Connection** | 「私は他の人とどう似ていて、どう違う？」 | shareable results, Daily Discovery sharing, friend invite, pair comparison, same-result perspectives, complementary perspectives, structured community, shared experiences |

## 3. Main navigation

The conceptual main navigation is locked to five items:

| # | Item | Meaning |
|---|---|---|
| 1 | **今日** | current day / current need |
| 2 | **気づく** | what has recently changed |
| 3 | **探す** | tests, guided discovery, possibilities |
| 4 | **つながる** | share, compare, pair, community, connection |
| 5 | **わたし** | evolving picture of the user + controls |

Production today ships four of the five (今日・気づく・探す・わたし); つながる is the missing item
and arrives with the Connection engine (gap doc §3).

**Never exposed as main consumer navigation concepts:** Life Graph, Memory Kernel, Experience
Objects, Reflection Engine, Module Runtime, Agents.

## 4. The 20 canonical screens

Screen **archetypes**, not routes. Several archetypes may share a route; an archetype may span a
flow. Do not create 20 pages because 20 archetypes exist.

| # | Screen | Group |
|---|---|---|
| 01 | Public Landing | PUBLIC / ENTRY |
| 02 | Start / Entry | PUBLIC / ENTRY |
| 03 | Quick Check-in | TODAY |
| 04 | Daily Response | TODAY |
| 05 | Today Home | TODAY |
| 08 | Small Next Step | TODAY |
| 09 | Evening Return | TODAY |
| 19 | Daily Discovery / 今日のひとつ | TODAY |
| 06 | Guided Reflection | NOTICE |
| 07 | AI Reflection | NOTICE |
| 10 | Insights Home | NOTICE |
| 11 | Timeline | NOTICE |
| 12 | Weekly Reflection | NOTICE |
| 13 | Pattern Detail | NOTICE |
| 14 | Explore | EXPLORE |
| 15 | Imairo Test | EXPLORE |
| 16 | Imairo Result | EXPLORE |
| 17 | Me / わたし | ME |
| 18 | Data & Memory Control | ME |
| 20 | Connect Hub | CONNECT |

### Screen principles (binding)

- **Today** combines two motivations — utility (`今の自分を残す`) and curiosity (`今日のひとつ`).
  Not a dashboard: no KPI wall, no feature grid, no chatbot-first home.
- **Quick Check-in** is lightweight state capture, completable in seconds. It is not personality
  assessment, mood diagnosis, a journal requirement, or a Life Graph form. (Production already does
  this: a two-step tap flow, verified on mobile 2026-08-18.)
- **Daily Response** creates one small meaningful response — not an AI analysis report, diagnosis,
  or long chat.
- **Small Next Step** offers at most a few low-friction possibilities — not a task manager,
  productivity system, or streak system.
- **Evening Return** asks what happened afterward and never frames non-completion as failure.
- **Insights / Pattern**: patterns are temporary observations. Pattern ≠ identity. Pattern ≠ durable
  Memory.
- **Timeline** shows human moments, not database events.
- **Imairo** is a protected product asset (§10) and its result is a *Recognition Moment*, not a
  permanent identity declaration.
- **Me** is a composition surface, never a second profile database. It shows, separately: current
  state · Imairo · user-confirmed durable context · Yorisou observations/patterns · user-confirmed
  values.
- **Data & Memory Control** makes memory/data visible, correctable, deletable, permissioned, and
  understandable — with no database jargon.
- **Connect** starts as sharing/invite/pair/perspectives — not an open social network (§7).

## 5. Daily Discovery (今日のひとつ)

A **universal discovery shell** with rotating finite pattern families:

`symbol_draw` · `visual_choice` · `binary_choice` · `three_question` · `mini_story` · `seasonal` ·
future original patterns.

Rules:

1. Traditional or global symbolic systems may inspire *interaction mechanics*, but every question,
   symbol, result name, result text, scoring rule, and visual identity is **original Yorisou
   content**. Never copy copyrighted/proprietary tests, tarot decks, commercial assessments, branded
   systems, or their result copy.
2. Ritual and mystery are welcome; claims are not. Never claim fate, destiny, supernatural truth,
   guaranteed prediction, or psychological diagnosis. (Production's own register — 「診断ではありま
   せん」 — already sets this tone.)
3. Symbolic discovery defaults to `memory_write = false` and `life_graph_write = false`. A daily
   symbolic result is entertainment-adjacent reflection material, never silently a fact about the
   person (§8).
4. Discovery is **finite**: a day's discovery completes. No endless feed.

## 6. Social and share model

Sharing is product infrastructure, not an afterthought.

**Share object families:** 1. Imairo Result Card · 2. Daily Discovery Card · 3. Pair Result Card ·
4. Monthly Story Card (where explicitly chosen).

**The one share flow:**

```
PRIVATE SOURCE → PUBLIC-SAFE DERIVATIVE → PREVIEW → EXPLICIT SHARE → DEEP LINK
```

Private notes, raw answers, sensitive state, durable memory, longitudinal insight, and private
reports never leak into public share objects. The derivative is built from an allowlist, not by
redacting the private object.

**Pair language.** Pair experiences emphasize: similarities · differences · where differences may
work well · where friction may occur · one shared question. Never default to soulmate language,
"perfect match", deterministic compatibility, or arbitrary percentage compatibility.

**Same-result groups are not tribes.** The language is 「近い結果だった人」 — people who *received a
similar result* — never people who permanently *are* a type.

## 7. Daily Discovery + community loops

Target loop: user receives a daily result → shares with a friend → friend participates → pair
comparison → optional return.

Community may also run 「今日の問い」: the user answers first, then sees similar perspectives and
different perspectives. Always finite; no endless feed.

**V1 social exclusions (binding):** no unrestricted DM, no follower competition, no creator ranking,
no infinite social feed, no popularity-driven ranking. The initial social model is not an open
dating/social network.

## 8. Data semantics — the knowledge-type truth model

Yorisou distinguishes, at minimum, these knowledge types:

`FACT` · `USER_STATEMENT` · `USER_PREFERENCE` · `GOAL` · `CURRENT_STATE` · `TEST_INFERENCE` ·
`AI_INFERENCE` · `SYMBOLIC_INTERPRETATION` · `EXPERIENCE` · `REFLECTION` · `PATTERN_CANDIDATE` ·
`CONFIRMED_MEMORY` · `WISDOM`

**Critical inequalities (binding, and already partially enforced in code —
`lib/server/__tests__/osf1Boundaries.test.ts` enforces `no_auto_convert / no_overwrite /
no_replace` between assessment output and daily-life state):**

- AI inference ≠ fact.
- Symbolic interpretation ≠ current state.
- Test result ≠ durable identity.
- Reflection ≠ historical proof.
- Pattern ≠ Memory.
- Daily Discovery result ≠ Current State.
- Ordinary interaction never silently becomes confirmed durable memory.

**D-03 (Auto-Memory Threshold) is OPEN.** Therefore durable memory is created by **explicit
confirmation only** — which is exactly what the shipped schema enforces (`user_confirmed` +
`confirmation_digest`; an unconfirmed memory is impossible at the schema level). This architecture
designs *around* D-03 and does not resolve it.

## 9. The four-tier modular architecture

```
PRODUCT APPLICATION      (Yorisou: routes, navigation, Japanese consumer UX)
        ↓
PRODUCT PACKS            (yorisou.imairo, yorisou.daily-symbols, yorisou.ja-copy, …)
        ↓
CAPABILITY MODULES       (state.core, assessment.core, … — brand-free, reusable)
        ↓
SHARED KERNEL            (identity, consent, permissions, memory, events, audit, lifecycle)
```

Yorisou is the first consumer product built on reusable human-experience capabilities. **Yorisou is
not the capability itself** — the product is a composition of packs over brand-free modules over a
small Kernel.

### 9.1 Modular monolith (binding strategy)

Logical separation first; physical separation later. V1 runs as **one application, one deployment,
one PostgreSQL/Supabase project, in-process typed events** — while preserving data ownership, module
interfaces, event contracts, isolation, and portability. No microservices per capability. No
over-engineering: explicit interfaces over abstractions without users.

### 9.2 Shared Kernel

Small and stable. Kernel-level responsibilities: identity · authentication · consent · permissions ·
governed memory · event contract runtime · object ownership · localization · audit · data lifecycle
(including erasure) · module registry.

**The Kernel must not know what Imairo is.** No Yorisou-specific business logic in Kernel. The
repository already holds strong Kernel seeds (viewer context, deployment-context gates, production
pilot flags, the audit-event pattern, the declarative erasure plan with per-family coverage tests) —
mapped in the gap document.

### 9.3 The 12 capability modules

Full contracts in [YORISOU_MODULE_CONTRACTS_V1.md](YORISOU_MODULE_CONTRACTS_V1.md).

| # | Module | Purpose (one line) |
|---|---|---|
| 01 | `state.core` | current moment/state capture |
| 02 | `assessment.core` | generic structured assessment runtime |
| 03 | `discovery.core` | finite rotating lightweight discovery experiences |
| 04 | `experience.core` | generic Situation → Action → Outcome model |
| 05 | `reflection.core` | turn allowed context into user reflection |
| 06 | `continuity.core` | connect meaningful events across time |
| 07 | `comparison.core` | generic A ↔ B comparison |
| 08 | `sharing.core` | private objects → explicit public-safe derivatives |
| 09 | `connection.core` | explicit person-to-person connection and pair context |
| 10 | `community.core` | low-pressure structured multi-user experience |
| 11 | `matching.core` | eligible match candidates from allowed context |
| 12 | `recommendation.core` | finite set of relevant next options |

### 9.4 Iron rules (binding on every module)

1. **OWN YOUR DATA** — a module directly writes only data it owns.
2. **READ THROUGH CONTRACT** — never directly query another capability's private tables.
3. **BRAND-FREE CORE** — capability modules never hardcode `Yorisou`, `Imairo`, `yorisou.online`,
   result codes such as `P01/P02/…`, or Japanese Yorisou-specific copy.
4. **NO SILENT PRIVILEGE** — installing a module grants no automatic access to Memory, private
   reflection, sensitive assessment data, or another project's data.
5. **DISABLE INDEPENDENTLY** — disabling `community.core` must not break Imairo or Today.

### 9.5 Product Packs

The runtime capability is portable; the Yorisou Product Pack may be proprietary and non-portable.

`yorisou.imairo` · `yorisou.daily-symbols` · `yorisou.daily-3q` · `yorisou.visual-choice` ·
`yorisou.seasonal` · `yorisou.relationship-tests` · `yorisou.community-prompts` ·
`yorisou.pair-copy` · `yorisou.ja-copy` · `yorisou.visual-system`

Canonical example: `assessment.core` is portable; `yorisou.imairo` (methodology, taxonomy, result
copy, persona visual identity) is Yorisou product IP. **Imairo = `assessment.core` + the
`yorisou.imairo` Product Pack.**

### 9.6 UI Shells

Reusable presentation frames. Documented here; no forced UI refactor in this package.

| Shell | Responsibility | Inputs → outputs | Used by screens |
|---|---|---|---|
| `experience-shell` | run a stepped interactive flow (progress, one question per view, resume) | flow definition + session → completed answers | 03, 06, 15, 19 |
| `result-shell` | present a result as a recognition moment (headline, body, save/next actions) | result reference + pack copy → rendered result, chosen action | 04, 16, 19 |
| `reflection-shell` | prompt → free response → gentle close (never grading) | prompt set + prior context → reflection record | 06, 07, 09, 12 |
| `share-shell` | preview a public-safe derivative and require explicit consent to share | share candidate → confirmed ShareObject or cancel | 16, 19, 20 |
| `compare-shell` | present A↔B similarities/differences/complementarity/friction + one shared question | comparison output → rendered pair view | 16 (pair), 20 |
| `collection-shell` | finite scrollable collection of human moments (never infinite) | projection list + cursor → rendered collection | 10, 11, 13, 14, 17 |

## 10. Protected assets (unchanged by this architecture)

Imairo's governed baseline — **120 fixed questions, 8 dimensions, 24 subdimensions, 24 formal public
results, 6 clans** — plus question order, response scale, scoring, taxonomy, result names, governed
result assets and protected result copy are **untouchable** without a separate explicit Founder
authorization. Also protected: LINE provider/channel configuration, production auth assumptions,
payments, production secrets, Digital Legacy, cross-project user-data sharing, and the open Founder
decisions (D-03, D-09).

## 11. Event architecture

Typed, versioned domain events: `family.event.vN`. In-process (modular monolith), with the envelope
and names defined once in `lib/platform/events.ts` so they cannot drift per module.

**Canonical V1 event families:**

```
state.checkin_completed.v1

assessment.started.v1          assessment.completed.v1

discovery.presented.v1         discovery.completed.v1        discovery.saved.v1

experience.created.v1          experience.action_recorded.v1 experience.outcome_recorded.v1

reflection.created.v1

memory.confirmed.v1            memory.corrected.v1           memory.deleted.v1

public_result.created.v1

share.preview_created.v1       share.created.v1              share.opened.v1

connection.invited.v1          connection.accepted.v1

comparison.created.v1

community.response_created.v1  community.reaction_added.v1

recommendation.generated.v1    recommendation.shown.v1       recommendation.feedback.v1
```

The contracts document adds the intra-module lifecycle events (e.g. `state.checkin_started.v1`,
`assessment.progressed.v1`, `discovery.dismissed.v1`, `pattern.candidate_created.v1`,
`weekly_reflection.created.v1`). Names may be refined during implementation where repository
constraints justify it — by changing the single canonical list, never by ad-hoc local names.

**Forbidden:** meaningless universal events (`user_intelligence_updated` and its relatives). An
event names one thing that happened in one module.

## 12. Projection rule

Never copy whole source records across modules. `continuity.core` does not duplicate assessment
results; it holds a `TimelineProjection`:

```
TimelineProjection { source_module, source_object_id, display_type, minimal display-safe metadata }
```

Source deletion or correction must invalidate or update dependent projections.

## 13. Delete propagation

Deletion is a first-class architecture requirement, with business semantics — never only opaque DB
cascades:

```
assessment deleted → invalidate continuity projections
                   → invalidate dependent comparisons (where required)
                   → revoke derived share objects (where applicable)
```

The repository's declarative account-erasure plan (every personal family named in one audited
function, with a coverage test) is the Kernel-level foundation this generalizes; per-object delete
propagation across modules is the target the gap document schedules.

## 14. Screen × Module × Event matrix

| # | Screen | Primary capability | Secondary | Product pack(s) | Primary reads | Primary writes | Main events | Phase |
|---|---|---|---|---|---|---|---|---|
| 01 | Public Landing | product shell | sharing.core (deep-link landing) | yorisou.visual-system, yorisou.ja-copy | public share objects | — | share.opened.v1 | V1 (live) |
| 02 | Start / Entry | product shell (routing) | state / assessment / discovery routing | yorisou.ja-copy | eligibility | — | — | V1 (live) |
| 03 | Quick Check-in | state.core | — | yorisou.ja-copy | state vocabulary | StateEntry, snapshot | state.checkin_started/completed.v1, state.snapshot_created.v1 | V1 (live) |
| 04 | Daily Response | state.core | reflection-lite, recommendation-lite | yorisou.ja-copy | current snapshot | — | recommendation.generated/shown.v1 | V1 (partial) |
| 05 | Today Home | state.core | discovery.core, continuity-lite, recommendation-lite | yorisou.ja-copy | snapshot, today's discovery, return refs | — | discovery.presented.v1 | V1 (partial) |
| 06 | Guided Reflection | reflection.core | experience.core | yorisou.ja-copy | allowed context | Reflection | reflection.started/created.v1 | V1 (live, INTERNAL) |
| 07 | AI Reflection | reflection.core | continuity.core | yorisou.ja-copy | allowed context | Reflection (user-approved) | reflection.created.v1 | V1 (live, INTERNAL) |
| 08 | Small Next Step | recommendation.core-lite | state.core, experience.core | yorisou.ja-copy | eligible candidates | RecommendationFeedback | recommendation.shown/feedback.v1 | V1 (partial) |
| 09 | Evening Return | experience.core | state.core, reflection.core | yorisou.ja-copy | today's attempts | Outcome | experience.outcome_recorded.v1 | V1 (live, INTERNAL) |
| 10 | Insights Home | continuity.core | reflection.core | yorisou.ja-copy | projections, candidates | — | — | V1 basic → V1.5 |
| 11 | Timeline | continuity.core | — | yorisou.ja-copy | TimelineProjections | — | continuity.moment_created.v1 | V1 (live, INTERNAL) |
| 12 | Weekly Reflection | reflection.core | continuity.core | yorisou.ja-copy | week's projections | WeeklyReflectionArtifact | weekly_reflection.created.v1 | V1.5 |
| 13 | Pattern Detail | continuity.core | reflection.core | yorisou.ja-copy | PatternCandidate | pattern feedback | pattern.candidate_created.v1, pattern.feedback_received.v1 | V1.5 |
| 14 | Explore | recommendation.core | assessment.core, discovery.core | yorisou.ja-copy | catalog, eligibility | — | recommendation.shown.v1 | V1 (live) |
| 15 | Imairo Test | assessment.core | — | **yorisou.imairo** | protected question bank | AssessmentSession/Answers | assessment.started/progressed/completed.v1 | V1 (live) |
| 16 | Imairo Result | assessment.core | sharing.core, comparison.core, connection.core | **yorisou.imairo**, yorisou.pair-copy | result reference | ShareObject (explicit) | public_result.created.v1, share.preview_created/created.v1 | V1 (live; share/pair partial) |
| 17 | Me / わたし | continuity.core | state.core, assessment.core, governed Memory (Kernel) | yorisou.ja-copy | composition reads | — | — | V1 (live basic) |
| 18 | Data & Memory | Kernel (memory, consent, permissions, audit) | — | yorisou.ja-copy | memory receipts, audit | memory confirm/correct/delete | memory.confirmed/corrected/deleted.v1 | V1 (live, INTERNAL) |
| 19 | Daily Discovery | discovery.core | sharing.core, continuity-lite | yorisou.daily-symbols / daily-3q / visual-choice / seasonal | schedule, eligibility, cooldown | DiscoverySession/Save | discovery.presented/started/completed/saved/dismissed.v1 | **V1 (missing)** |
| 20 | Connect Hub | connection.core | comparison.core, sharing.core → community.core (V1.5) → matching.core (V2) | yorisou.pair-copy, yorisou.community-prompts | connections, pairs, shared objects | Invitation, Connection, Pair | connection.invited/accepted.v1, comparison.created.v1 | **V1 (missing)** |

"live" = exists in production today at `5245b10` (some behind the Founder-only INTERNAL gate);
"partial" = a related surface exists but not yet in this archetype's shape; "missing" = does not
exist. Details and evidence: gap document §2–§3.

## 15. Staged scope — V1 / V1.5 / V2

### V1 — prove Recognition + Novelty + Continuity + Sharing/Pair

Capability slices: Kernel minimum · `state.core` · `assessment.core` · `discovery.core` ·
`experience.core` · `reflection.core-lite` · `continuity.core-lite` · `sharing.core` ·
`connection.core-lite` · `comparison.core-lite` · `recommendation.core-lite`.

Consumer scope: Landing · Imairo → Result → Share → Invite → Pair compare · Today (Quick Check-in →
Daily Response → Small Next Step → Evening Return) · Daily Discovery · basic Timeline / Me / Data
Controls.

**Not in V1:** full Community, algorithmic Matching.

### V1.5 — deepen Continuity + open Community

Add `reflection.core-full`, `continuity.core-full`, `community.core`.
Products: Weekly Reflection, Pattern Detail, Monthly Story, 今日の問い, same-result perspectives,
different perspectives, structured experience community.

### V2 — Matching + full comparison/connection + portability proof

Add `matching.core`, `recommendation.core-full`, `comparison.core-full`, `connection.core-full`.
Products: 自分に近い人, 違いが活きる人, longitudinal pair experiences, broader community discovery,
context-aware discovery/recommendation.

**V2 must include a real PORTABILITY PROOF:** at least one mature capability module moved into
another project with no Yorisou data or brand coupling.

## 16. Portability gate (future acceptance gate, binding at extraction time)

A capability is not portable unless it passes all five:

1. **Brand isolation** — core package contains no hardcoded `Yorisou`, `Imairo`, `yorisou.online`.
2. **Data isolation** — project namespaces cannot cross-read by default.
3. **Adapter replacement** — a different Product Pack can use the capability without modifying core.
4. **UI replacement** — another product can supply its own visual adapter without changing
   capability logic.
5. **Independent disable** — disabling the capability does not break unrelated product surfaces.

## 17. Agent / AI boundary

There is no universal "Yorisou super-agent". Future agents attach to **bounded capabilities** and
receive only that capability's declared permissions and data scope:

- `reflection.core` → Reflection Agent (already real: the reflection assistant is provider-routed,
  input-bounded, and draft-only — the user approves every word that persists)
- `community.core` → Moderation Agent
- `recommendation.core` → Recommendation Agent

No agent automatically receives the complete user Life Graph. Agent access is a permission grant in
the module contract, auditable like any other.

## 18. Non-goals

This architecture explicitly does **not** include: microservices per capability · a second profile
database · an open social network, unrestricted DM, follower/creator ranking, or any infinite feed ·
complex ML ranking (V1 recommendation is rule-based) · automatic memory promotion (D-03 OPEN) ·
cross-project user-data sharing · Companion Core, Specialist Agents, Digital Legacy ·
Kakari/Mirai Move/Asterion integration · resolution of any open Founder decision.

## 19. Engineering guardrails

1. **RPC-only database mutation stays.** The shipped discipline — `DIRECT_USER_DENY +
   SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION`, SECURITY DEFINER RPCs, owner-scoped
   reads — is the Kernel's data-access substrate. Modules sit on top of it, never around it.
2. **Default closed.** Every new surface ships behind the existing gate pattern (deployment context
   → dev flag / production pilot flag → viewer facts), exactly as the Life OS INTERNAL activation
   proved end-to-end.
3. **Explicit confirmation for durable memory** (D-03 OPEN; schema-enforced today).
4. **Knowledge types never silently convert** (§8; boundary tests are the enforcement pattern).
5. **The share flow is the only path to public content** (§6).
6. **Erasure coverage is a test, not a hope** — every new personal data family joins the declarative
   erasure plan and its coverage test in the same change that creates it.
7. **Contract before code** — a capability module lands only with its contract entry
   (`lib/platform/`), and the platform guard tests (brand isolation, no core→product import
   inversion, event naming) stay green.
8. **Japan-first** — consumer copy is Japanese, produced through packs (`yorisou.ja-copy`), never
   hardcoded in capability modules.
9. **One-person-company realism** — prefer the smallest structure that preserves the contract;
   document instead of building speculative abstraction.

---

*Version history: v1.0 (2026-08-18) — initial canonical reference architecture, authorized by
`YORISOU-REFERENCE-ARCHITECTURE-V1-FOUNDATION`.*
