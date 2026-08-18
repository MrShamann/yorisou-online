# YORISOU Module Contracts v1.1

**Status:** CANONICAL · **Version:** 1.1 · **Date:** 2026-08-18
**Parent:** [YORISOU_REFERENCE_ARCHITECTURE_V1.md](YORISOU_REFERENCE_ARCHITECTURE_V1.md)
**Machine mirror:** `lib/platform/moduleContract.ts` (types + the v0.7.0 field mapping as data),
`lib/platform/events.ts` (event names + governed envelope), `lib/platform/registry.ts` (declared
registry) — guarded by `npm run test:platform-contracts`.

Twelve capability contracts over **one** standard schema. That schema is a **compatible superset of
the active v0.7.0 Module Contract Standard's normative minimum** (§1.1 carries the field-by-field
mapping; the same mapping exists as data in the machine mirror, so the superset property is
test-enforced, not asserted). There are not two module-contract standards: the v0.7.0 Standard
remains the governance authority, and this document instantiates it — plus the V1 architectural
fields — for the twelve capability modules.

A contract is a **declaration of boundaries**, not an implementation claim: `adoption_status:
declared` means the boundary exists on paper; `partial` means the repository already realizes part
of the capability *without* the contract boundary (the gap document maps exactly what). Per the
completion truth model, nothing here is evidence that code exists.

---

## 1. The standard Module Contract schema

Every capability module is described by exactly this schema (machine type: `ModuleContract` in
`lib/platform/moduleContract.ts`; the guard test verifies every module block below carries every
field):

```yaml
# ── identity ──────────────────────────────────────────────────────────────────
module_id:                # "<family>.core"
name:                     # human-readable capability name (brand-free)
version:                  # semver of the CONTRACT, not the code
category:                 # capability family label
description:              # what this capability is, in one short paragraph
purpose:                  # one sentence

# ── product grounding (v0.7.0) ────────────────────────────────────────────────
user_problem:             # the human problem this capability answers
target_users:             # who it serves

# ── adoption + governance lifecycle (three DISTINCT axes) ────────────────────
adoption_status:          # declared | partial | implemented | deprecated   (V1 repo truth)
lifecycle_state:          # IDEA | DEFINED | PROTOTYPE | VALIDATED | INSTALLED | ENABLED |
                          # SUSPENDED | RETIRED                             (v0.7.0 governance)
verification_state:       # not_verified | validated | founder_approved     (separate gate)

# ── boundaries ────────────────────────────────────────────────────────────────
responsibilities: []      # what this module answers for
non_responsibilities: []  # what it must never absorb
required_kernel_services: []   # identity | auth | consent | permissions | memory | events |
                               # ownership | localization | audit | data_lifecycle | module_registry
input_contracts: []       # named typed interfaces this module accepts   (v0.7.0 input_schema)
output_contracts: []      # named typed interfaces this module provides  (v0.7.0 output_schema)
owned_data: []            # records this module has OPERATIONAL CUSTODY of (see §1.2)
readable_external_data: []# other modules' OUTPUT contracts it may read (never their tables)
forbidden_data: []        # data it must never read or hold

# ── governed memory (v0.7.0) ──────────────────────────────────────────────────
memory_access:            # none | candidates_only | read_confirmed | read_write_confirmed
memory_write_scope:       # what may be written into governed memory ("none" everywhere in V1)

# ── events ────────────────────────────────────────────────────────────────────
events_consumed: []       # typed event names (canonical list only)
events_emitted: []        # typed event names (canonical list only)

# ── permissions (v0.7.0 scope + concrete grants) ─────────────────────────────
permission_scope:         # governance statement of the widest permission this module may hold
permissions_required: []  # concrete kernel grants requested at runtime, within permission_scope

# ── composition ───────────────────────────────────────────────────────────────
ui_shells: []             # experience-shell | result-shell | reflection-shell | share-shell |
                          # compare-shell | collection-shell
product_pack_interfaces: []  # what a pack must supply to productize this capability

# ── localization (v0.7.0) ─────────────────────────────────────────────────────
localization_requirements: []# what must be localizable (copy always arrives via packs)
regional_adapters: []     # region-specific adapters this capability anticipates

# ── dependencies ──────────────────────────────────────────────────────────────
module_dependencies: []   # other capability modules required (v0.7.0 "dependencies")
external_dependencies: [] # third-party services (declared, never assumed)
agent_requirements: []    # bounded agents that may attach (scope = this module only)

# ── classification (v0.7.0) ───────────────────────────────────────────────────
data_owner:               # ownership semantics — see §1.2 (the person owns their data)
privacy_class:            # personal_sensitive | personal | operational | public_derivative
risk_class:               # low | medium | high  (user-harm exposure)
commercial_status:        # non_commercial | free_tier | premium | subscription |
                          # partner_revenue | transaction_revenue | enterprise_service
revenue_model:            # "none" until a commercial decision exists

# ── portability ───────────────────────────────────────────────────────────────
portable:                 # true|false — intended to leave the product one day
portable_test_required:   # true → portability gate must pass before extraction

# ── operations ────────────────────────────────────────────────────────────────
disable_behavior:         # what the product does when this module is off
migration_strategy:       # how existing product data moves INTO the module boundary
rollback_strategy:        # how to retreat without losing user data (v0.7.0 rollback_method)
observability: []         # bounded, non-identifying signals
audit_requirements: []    # which mutations write audit events, and their delivery class
```

### 1.1 v0.7.0 governance-field compatibility mapping

Every field of the active v0.7.0 Module Contract Standard §4 normative schema maps losslessly into
this superset. Renames are explicit; nothing was dropped. (Machine form: `V070_FIELD_MAPPING` in
`lib/platform/moduleContract.ts`, test-enforced.)

| v0.7.0 governance field | V1 contract field | Note |
|---|---|---|
| `module_id` | `module_id` | identical |
| `name` | `name` | identical |
| `version` | `version` | identical |
| `category` | `category` | identical |
| `description` | `description` | identical |
| `purpose` | `purpose` | identical |
| `user_problem` | `user_problem` | identical |
| `target_users` | `target_users` | identical |
| `input_schema` | `input_contracts` | renamed — inputs are named typed interfaces |
| `output_schema` | `output_contracts` | renamed — outputs are named typed interfaces |
| `required_kernel_services` | `required_kernel_services` | identical |
| `memory_access` | `memory_access` | identical |
| `memory_write_scope` | `memory_write_scope` | identical |
| `permission_scope` | `permission_scope` | identical; `permissions_required` additionally lists the concrete grants inside that scope |
| `agent_requirements` | `agent_requirements` | identical (the earlier V1 name `agent_dependencies` is retired) |
| `localization_requirements` | `localization_requirements` | identical |
| `regional_adapters` | `regional_adapters` | identical |
| `external_dependencies` | `external_dependencies` | identical |
| `data_owner` | `data_owner` | identical field; semantics fixed in §1.2 |
| `privacy_class` | `privacy_class` | identical field; V1 declares the value vocabulary (§1.3) |
| `risk_class` | `risk_class` | identical |
| `commercial_status` | `commercial_status` | identical |
| `revenue_model` | `revenue_model` | identical |
| `dependencies` (annex rule 2) | `module_dependencies` | renamed — scoped to capability-module dependencies; external ones live in `external_dependencies` |
| `lifecycle_state` | `lifecycle_state` | identical, verbatim annex §7 vocabulary |
| `verification_state` | `verification_state` | identical field; V1 declares the value vocabulary (§1.3) |
| `rollback_method` | `rollback_strategy` | renamed — same meaning |

V1-only architectural fields (additive, no governance conflict): `adoption_status`,
`responsibilities`, `non_responsibilities`, `owned_data`, `readable_external_data`,
`forbidden_data`, `events_consumed`, `events_emitted`, `permissions_required`, `ui_shells`,
`product_pack_interfaces`, `portable`, `portable_test_required`, `disable_behavior`,
`migration_strategy`, `observability`, `audit_requirements`.

### 1.2 Data-ownership semantics (binding)

**The person owns their personal data. Always.** A module's `owned_data` and `data_owner` describe
**operational custody** — mutation responsibility and canonical persistence responsibility for
specific records — never legal or moral ownership of the person or their data. Iron rule 1 ("a
module directly writes only data it owns") therefore reads precisely: *a module directly writes
only the records it operationally custodians*. Modules are capability owners, not owners of the
user. Every personal record remains user-controlled YORISOU data: visible, correctable, deletable
through the Kernel's data-lifecycle services, and covered by the erasure plan.

Accordingly, every contract below carries the same `data_owner` value:

> `user — the module holds operational custody of its owned records, never ownership of the person`

### 1.3 Vocabularies declared by V1 (where v0.7.0 requires the field but not the values)

- `privacy_class`: `personal_sensitive` | `personal` | `operational` | `public_derivative` —
  sensitivity of the module's owned records. Refining this vocabulary is a governance act.
- `verification_state`: `not_verified` | `validated` | `founder_approved` — per the annex,
  validation and activation are separate gates; every module today is `not_verified` as a
  contract-conformant unit, regardless of how much related code exists.
- All three state axes are deliberately distinct: `adoption_status` is repository truth,
  `lifecycle_state` is governance lifecycle (all twelve are `DEFINED` — contract and risk class
  exist, nothing more is claimed), `verification_state` is the evidence gate.

**Shared rules inherited by all 12 contracts** (stated once, binding everywhere):

- Iron rules 1–5 (own your data *operationally* · read through contract · brand-free core · no
  silent privilege · disable independently).
- All personal objects carry owner scoping and join the Kernel erasure plan + coverage test in the
  same change that creates them.
- All mutations go through the Kernel data-access substrate (server-side, owner-scoped, RPC-only).
- Consumer copy arrives through Product Packs; modules ship no Japanese product copy.
- `AI_INFERENCE ≠ FACT`; nothing a module infers becomes durable memory without explicit user
  confirmation. **D-03 OPEN** — no automatic memory threshold exists anywhere, and
  `memory_write_scope: none` holds for every module. A `PossibleMemoryCandidate` is not a
  `ConfirmedMemory` and never becomes one without the person's explicit act through the Kernel.

---

## 2. The twelve contracts

### 01 · state.core

```yaml
module_id: state.core
name: Current State Capture
version: 0.2.0
category: life-state capture
description: Lightweight, reversible capture of how the person is right now — tap-first entries,
  current-state snapshots, and a stable state vocabulary other capabilities can reference.
purpose: Capture the person's current moment/state, cheaply and reversibly.
user_problem: "I want to put my current state into words in seconds, without being assessed."
target_users: any signed-in person; entry point for the daily loop
adoption_status: partial          # two state stores exist today without this boundary (gap doc §3.1)
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - lightweight state capture (seconds, tap-first)
  - current-state snapshots and their correction/deletion
  - a state vocabulary stable enough for other modules to reference
non_responsibilities:
  - personality or identity claims
  - durable Memory
  - Pattern detection
  - Recommendation
required_kernel_services: [identity, ownership, permissions, audit, data_lifecycle, events, localization]
input_contracts: [StateCaptureRequest]
output_contracts: [CurrentStateSnapshot, StateVocabulary]
owned_data: [StateEntry, StateSignal, CurrentStateSnapshot, StateContextReference]
readable_external_data: []
forbidden_data: [assessment methodology identity (result ids, personas, scores), durable memory,
                 private reflection text]
memory_access: none
memory_write_scope: none
events_consumed: []
events_emitted: [state.checkin_started.v1, state.checkin_completed.v1,
                 state.snapshot_created.v1, state.corrected.v1, state.deleted.v1]
permission_scope: read/write the caller's own state records only; no cross-user access, no
  methodology stores, no governed memory
permissions_required: [write:own_state, read:own_state]
ui_shells: [experience-shell, result-shell]
product_pack_interfaces: [state vocabulary labels + copy (ja), check-in flow copy]
localization_requirements: [all vocabulary labels, all flow copy]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal_sensitive
risk_class: medium
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: check-in surfaces close; existing snapshots remain readable via continuity
  projections; nothing else breaks.
migration_strategy: adopt the existing daily-state and current-state stores behind one contract
  without rewriting rows (adapter first, schema convergence later).
rollback_strategy: contract layer removed; underlying stores keep operating as today.
observability: [checkin completion rate (bounded, non-identifying), error classes]
audit_requirements: [state deletion/correction -> audit event (asynchronous class)]
```

### 02 · assessment.core

```yaml
module_id: assessment.core
name: Structured Assessment Runtime
version: 0.2.0
category: structured assessment
description: A generic runtime for any structured assessment — session lifecycle, answer capture
  against a versioned instrument, and result references whose meaning belongs to the pack.
purpose: Run any structured assessment: sessions, answers, versioned scoring, result references.
user_problem: "I want a structured way to recognize something about myself right now."
target_users: any person taking a structured test, from a 2-question check to the flagship instrument
adoption_status: partial          # three runtimes exist today (gap doc §3.2); rule-based engine is brand-free
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - assessment session lifecycle (start, progress, resume, abandon, retake)
  - answer capture against a versioned instrument
  - producing a result REFERENCE (the pack owns result meaning and copy)
non_responsibilities:
  - the flagship instrument's methodology, taxonomy, result copy, persona visual identity
  - turning results into durable identity or current state (no_auto_convert)
required_kernel_services: [identity, ownership, permissions, audit, data_lifecycle, events]
input_contracts: [InstrumentDefinition (from pack), AssessmentStartRequest]
output_contracts: [AssessmentResultReference, AssessmentSessionState]
owned_data: [AssessmentSession, AssessmentAnswer, AssessmentResultReference, AssessmentVersion]
readable_external_data: []
forbidden_data: [current state, durable memory, reflections]
memory_access: none
memory_write_scope: none
events_consumed: []
events_emitted: [assessment.started.v1, assessment.progressed.v1, assessment.completed.v1,
                 assessment.abandoned.v1, assessment.retaken.v1]
permission_scope: read/write the caller's own assessment sessions and result references only;
  instrument definitions are pack-supplied and read-only
permissions_required: [write:own_assessment, read:own_assessment]
ui_shells: [experience-shell, result-shell]
product_pack_interfaces: [instrument definition (questions, scale, order — protected for the
    flagship instrument), scoring adapter, result copy + visual identity]
localization_requirements: [instrument copy, result copy — pack-supplied]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal_sensitive
risk_class: medium
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: test surfaces close; existing result references stay readable; Today/Life OS
  unaffected (boundary already schema-enforced).
migration_strategy: catalog the existing engines (the protected generated runtime, the rule-based
  engine, the method runtimes) under one session/answer/result-reference contract; protected
  instrument bytes NEVER change.
rollback_strategy: engines keep operating as today; contract layer is additive.
observability: [completion/abandon rates per instrument (non-identifying)]
audit_requirements: [result deletion -> audit event; retake -> session lineage kept]
```

### 03 · discovery.core

```yaml
module_id: discovery.core
name: Daily Discovery
version: 0.2.0
category: daily discovery
description: Finite, rotating, lightweight discovery experiences — the curiosity half of Today —
  scheduled, eligibility-gated, cooldown-bounded, and saved only by explicit choice.
purpose: Deliver finite, rotating, lightweight discovery experiences.
user_problem: "What is the product giving me today?" — a small daily novelty with no obligation
target_users: any signed-in person on the Today surface
adoption_status: declared         # the daily-discovery surface does not exist yet
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - discovery scheduling, eligibility, cooldown
  - session lifecycle for generic patterns (symbol_draw, visual_choice, binary_choice,
    three_question, mini_story, seasonal, future originals)
  - explicit save of a discovery result the person wants to keep
non_responsibilities:
  - writing memory or life-graph data (memory_write = false, life_graph_write = false by default)
  - claiming fate/destiny/diagnosis (pack copy is bound by the same rule)
  - infinite feeds
required_kernel_services: [identity, ownership, permissions, consent, events, localization]
input_contracts: [DiscoveryPatternDefinition (from pack), DiscoveryRequest]
output_contracts: [DiscoveryResultReference, DiscoveryScheduleView]
owned_data: [DiscoverySession, DiscoverySchedule, DiscoveryEligibility, DiscoveryResultReference,
             DiscoverySave, CooldownState]
readable_external_data: [CurrentStateSnapshot (optional, consented, for seasonal/contextual flavor)]
forbidden_data: [durable memory, private reflections, assessment raw answers]
memory_access: none               # memory_write = false; life_graph_write = false — architecture default
memory_write_scope: none
events_consumed: []
events_emitted: [discovery.presented.v1, discovery.started.v1, discovery.completed.v1,
                 discovery.saved.v1, discovery.dismissed.v1]
permission_scope: read/write the caller's own discovery sessions and saves only; optional
  state-snapshot read requires an explicit consent grant
permissions_required: [write:own_discovery, read:own_discovery]
ui_shells: [experience-shell, result-shell, share-shell]
product_pack_interfaces: [pattern content (original questions/symbols/results only),
    rotation/seasonal calendars, visual identity]
localization_requirements: [all pattern copy]
regional_adapters: [seasonal calendars may vary by region (pack-supplied)]
module_dependencies: []
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: low
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: Today loses its curiosity half gracefully (utility half unaffected); saved
  discoveries stay visible via continuity projections.
migration_strategy: greenfield; no existing data to adopt.
rollback_strategy: disable flag; sessions/saves remain, erasable via the Kernel plan.
observability: [participation/save rates per pattern family (non-identifying)]
audit_requirements: [discovery save/delete -> audit event (asynchronous class)]
```

### 04 · experience.core

```yaml
module_id: experience.core
name: Lived Experience Record
version: 0.2.0
category: lived experience
description: The generic Situation → Action → Outcome record of things the person actually tried —
  the factual substrate that reflection and community build on, owning no interpretation.
purpose: Model lived attempts generically: situation, action, outcome.
user_problem: "I tried something — I want to keep what happened without being judged on it."
target_users: any signed-in person recording an attempt, especially through Evening Return
adoption_status: partial          # experience cards + life-record linkage exist (gap doc §3.4)
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - experience records and their lifecycle (create, update, record action, record outcome, delete)
  - being the factual substrate reflection and community build on
non_responsibilities:
  - interpretation (reflection.core's job)
  - visibility/moderation of shared experiences (community.core's job)
required_kernel_services: [identity, ownership, permissions, audit, data_lifecycle, events]
input_contracts: [ExperienceDraft]
output_contracts: [ExperienceView]
owned_data: [Experience, Situation, ActionAttempt, Outcome]
readable_external_data: [CurrentStateSnapshot (as situation context, by reference)]
forbidden_data: [assessment methodology identity, durable memory]
memory_access: none
memory_write_scope: none
events_consumed: []
events_emitted: [experience.created.v1, experience.action_recorded.v1,
                 experience.outcome_recorded.v1, experience.updated.v1, experience.deleted.v1]
permission_scope: read/write the caller's own experience records only; no interpretation, no
  visibility decisions
permissions_required: [write:own_experience, read:own_experience]
ui_shells: [experience-shell, reflection-shell]
product_pack_interfaces: [experience prompts + copy (ja)]
localization_requirements: [all prompts]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: medium
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: experience capture closes; existing records readable via projections; Evening
  Return degrades to state-only.
migration_strategy: adopt the existing experience-card store behind the contract; the sharing/
  moderation halves migrate toward community.core, not here.
rollback_strategy: contract layer removed; store keeps operating.
observability: [outcome-recorded rate (non-identifying)]
audit_requirements: [delete/visibility-relevant mutations -> audit (delivery classes per the
    existing audit delivery map)]
```

### 05 · reflection.core

```yaml
module_id: reflection.core
name: Reflection
version: 0.2.0
category: reflection
description: Prompted and AI-assisted reflection the person authors and owns, over context they
  granted — emitting candidates that never self-promote into memory.
purpose: Turn allowed context into user reflection the person authors and owns.
user_problem: "I want to make sense of what happened, in my own words, with gentle help."
target_users: signed-in people reflecting on experiences, state, or a period of time
adoption_status: partial          # reflections + assistant exist behind INTERNAL (gap doc §3.5)
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - reflection prompts and responses (guided and AI-assisted)
  - weekly reflection artifacts (V1.5)
  - emitting candidates (PossibleInsightCandidate, PossibleMemoryCandidate) that are NEVER
    auto-promoted (candidate is not ConfirmedMemory; D-03 OPEN)
non_responsibilities:
  - deciding what becomes durable memory (Kernel + explicit user confirmation only)
  - pattern detection over time (continuity.core)
required_kernel_services: [identity, ownership, permissions, audit, data_lifecycle, events, consent]
input_contracts: [ReflectionPromptSet (from pack), ReflectionContextGrant]
output_contracts: [ReflectionView, PossibleInsightCandidate, PossibleMemoryCandidate]
owned_data: [Reflection, ReflectionPrompt, ReflectionResponse, WeeklyReflectionArtifact]
readable_external_data: [ExperienceView, CurrentStateSnapshot (granted context only)]
forbidden_data: [assessment raw answers, other users' data, ungranted context]
memory_access: candidates_only    # proposes PossibleMemoryCandidate; never reads/writes confirmed memory
memory_write_scope: none
events_consumed: [experience.outcome_recorded.v1 (as reflection invitations)]
events_emitted: [reflection.started.v1, reflection.created.v1, reflection.corrected.v1,
                 reflection.dismissed.v1, weekly_reflection.created.v1]
permission_scope: read/write the caller's own reflections; read only context the person explicitly
  granted; assistant drafts are user-approved before persisting
permissions_required: [write:own_reflection, read:own_reflection, read:granted_context]
ui_shells: [reflection-shell]
product_pack_interfaces: [prompt sets + copy (ja), assistant tone rules]
localization_requirements: [all prompts and assistant-facing copy]
regional_adapters: []
module_dependencies: []
external_dependencies: [AI provider routes (bounded, draft-only, injection-defended — as shipped)]
agent_requirements: [Reflection Agent — draft-only; the user approves every persisted word]
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal_sensitive
risk_class: high                  # most intimate free text in the product
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: reflection surfaces close; existing reflections readable; assistant OFF
  independently of manual reflection.
migration_strategy: existing reflections already match this boundary; formalize the interface.
rollback_strategy: assistant can be disabled alone; manual flow alone; both without data loss.
observability: [assistant failure classes (bounded, as shipped); reflection completion rate]
audit_requirements: [reflection create/correct/delete -> audit (transactional class where shipped)]
```

### 06 · continuity.core

```yaml
module_id: continuity.core
name: Continuity
version: 0.2.0
category: continuity
description: Connects meaningful events across time into human-readable continuity — projections,
  pattern candidates, return references, summaries — always by reference, never by copy.
purpose: Connect meaningful events across time into human-readable continuity.
user_problem: "I want to see how I change over time, as human moments rather than database rows."
target_users: signed-in people viewing timeline, insights, patterns, and returns
adoption_status: partial          # timeline exists via direct multi-store reads (gap doc §3.6)
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - TimelineProjection maintenance (projection rule: minimal display-safe metadata, by reference)
  - PatternCandidate detection and user feedback (pattern is not identity, not Memory)
  - return references (evening return, revisit prompts)
  - continuity summaries and historical comparisons
non_responsibilities:
  - owning durable Memory
  - duplicating source records (projection rule is binding)
required_kernel_services: [identity, ownership, permissions, events, data_lifecycle]
input_contracts: [ProjectionSource (each module's output contract)]
output_contracts: [TimelineMoment, PatternCandidate, HistoricalComparison, ReturnPromptCandidate,
                   ContinuitySummary]
owned_data: [TimelineProjection, PatternCandidate, ReturnReference, ContinuitySummary]
readable_external_data: [output contracts of state/assessment/discovery/experience/reflection —
                         never their tables]
forbidden_data: [full source records (projection rule), other users' data]
memory_access: none
memory_write_scope: none
events_consumed: [state.snapshot_created.v1, assessment.completed.v1, discovery.saved.v1,
                  experience.outcome_recorded.v1, reflection.created.v1, memory.confirmed.v1,
                  memory.deleted.v1, state.deleted.v1, experience.deleted.v1]
events_emitted: [continuity.moment_created.v1, pattern.candidate_created.v1,
                 pattern.feedback_received.v1, return.reference_created.v1]
permission_scope: read/write the caller's own projections only; sources are read through their
  output contracts, never their tables
permissions_required: [read:own_projections, write:own_projections]
ui_shells: [collection-shell]
product_pack_interfaces: [timeline copy (ja), pattern presentation copy]
localization_requirements: [all continuity copy]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: medium
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: timeline/insights close; source modules unaffected (projections are derived data).
migration_strategy: introduce projections next to today's direct-read timeline, then switch reads;
  source deletion invalidates projections from day one.
rollback_strategy: drop projections and return to direct reads; no source data at risk.
observability: [projection lag, invalidation counts (non-identifying)]
audit_requirements: [pattern feedback -> audit (asynchronous class)]
```

### 07 · comparison.core

```yaml
module_id: comparison.core
name: Comparison
version: 0.2.0
category: comparison
description: Generic A ↔ B comparison over consented references, producing exactly the humane
  outputs — similarities, differences, complementarity, friction, one shared question.
purpose: Generic A-to-B comparison with humane outputs.
user_problem: "How am I similar to or different from this person (or my past self)?"
target_users: consented pairs; a person comparing themselves across time
adoption_status: declared
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - comparisons of Person-Person (consented pairs), CurrentSelf-PastSelf, Month-Month,
    Assessment-Assessment
  - producing exactly: Similarities, Differences, PossibleComplementarity, PossibleFriction,
    SharedQuestion
non_responsibilities:
  - flagship-instrument-specific meaning (a comparison adapter in the pack supplies it —
    the pair product = comparison.core + that adapter)
  - compatibility percentages, soulmate/perfect-match language, deterministic claims
required_kernel_services: [identity, ownership, permissions, consent, events]
input_contracts: [ComparisonRequest (two consented references), ComparisonAdapter (from pack)]
output_contracts: [ComparisonView]
owned_data: [ComparisonRecord]
readable_external_data: [AssessmentResultReference, CurrentStateSnapshot, ContinuitySummary —
                         each side by explicit grant]
forbidden_data: [non-participant data (both people must participate), raw answers, private text]
memory_access: none
memory_write_scope: none
events_consumed: [connection.accepted.v1]
events_emitted: [comparison.created.v1]
permission_scope: read only references each participant explicitly granted; write only the
  caller's own comparison records; never a non-participant's data
permissions_required: [read:granted_comparison_inputs, write:own_comparisons]
ui_shells: [compare-shell]
product_pack_interfaces: [comparison adapters per instrument, pair copy (ja) obeying the pair
    language rules]
localization_requirements: [all pair copy]
regional_adapters: []
module_dependencies: [connection.core]
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: medium
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: pair views close; connections and shares unaffected.
migration_strategy: greenfield.
rollback_strategy: disable flag; comparison records erasable per plan.
observability: [comparison completion rate (non-identifying)]
audit_requirements: [comparison creation over a pair -> audit (asynchronous class)]
```

### 08 · sharing.core

```yaml
module_id: sharing.core
name: Sharing
version: 0.2.0
category: sharing
description: The one path by which anything private becomes public — allowlist-built safe
  derivatives, mandatory preview, explicit share, revocable deep links.
purpose: Convert private objects into explicit public-safe derivatives, and nothing else.
user_problem: "I want to share this result with someone — without leaking anything I didn't choose."
target_users: any person explicitly sharing a result, discovery, pair card, or story
adoption_status: partial          # the flagship public-result snapshot flow exists (gap doc §3.8)
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - "the one share flow: PRIVATE -> SAFE DERIVATIVE -> PREVIEW -> EXPLICIT SHARE -> DEEP LINK"
  - share object lifecycle including revocation
  - allowlist-built derivatives (never redaction of the private object)
non_responsibilities:
  - deciding what is shareable (each source module's output contract declares its share candidates)
  - social distribution mechanics beyond the deep link
required_kernel_services: [identity, ownership, permissions, consent, audit, data_lifecycle, events]
input_contracts: [ShareCandidate (from source modules), ShareTemplateReference (from pack)]
output_contracts: [ShareObjectView, DeepLink]
owned_data: [ShareObject, ShareTemplateReference, DeepLink, ShareAccessPolicy, ShareEvent]
readable_external_data: [declared share candidates only]
forbidden_data: [private notes, raw answers, sensitive state, durable memory, longitudinal insight,
                 private reports — never in a ShareObject]
memory_access: none
memory_write_scope: none
events_consumed: [assessment.completed.v1, discovery.completed.v1, comparison.created.v1]
events_emitted: [share.preview_created.v1, share.created.v1, share.opened.v1]
permission_scope: build derivatives only from declared share candidates of the caller's own
  objects; publish only after explicit confirmation; revoke at any time
permissions_required: [write:own_shares, read:own_shares]
ui_shells: [share-shell]
product_pack_interfaces: [share card templates (result card, discovery card, pair card, story
    card), OG imagery, copy (ja)]
localization_requirements: [card copy]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: public_derivative  # owned records are public-safe BY CONSTRUCTION; the boundary crossing is audited
risk_class: high                  # the privacy boundary crosses here, on purpose, explicitly
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: new shares stop; existing deep links can be revoked wholesale; nothing private
  is affected.
migration_strategy: generalize the shipped public-result snapshot into ShareObject; existing
  snapshots become the first ShareObjects.
rollback_strategy: revoke-and-disable; private sources untouched.
observability: [share/open counts per family (non-identifying)]
audit_requirements: [share create/revoke -> audit (transactional class — a publish is a boundary
    crossing)]
```

### 09 · connection.core

```yaml
module_id: connection.core
name: Connection
version: 0.2.0
category: connection
description: Explicit person-to-person connection — invitations, accepted connections, pairs,
  relationship context — the consent substrate for comparison and community.
purpose: Explicit person-to-person connection and pair context.
user_problem: "I want to do this together with a specific person I chose."
target_users: pairs of consenting people (friend, partner, family)
adoption_status: declared         # only experience-scoped invites exist today
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - invitations, accepted connections, pairs, relationship context, connection preferences
  - the consent substrate for comparison and community interactions
non_responsibilities:
  - analyzing a non-participating third party (forbidden absolutely)
  - discovery of strangers (matching.core, V2)
  - messaging (no unrestricted DM in V1/V1.5)
required_kernel_services: [identity, ownership, permissions, consent, audit, data_lifecycle, events]
input_contracts: [InvitationRequest]
output_contracts: [ConnectionView, PairContext]
owned_data: [Invitation, Connection, Pair, RelationshipContext, ConnectionPreference]
readable_external_data: []
forbidden_data: [the other person's private objects (connection grants comparison CONSENT, not data
                 access), any non-participant's data]
memory_access: none
memory_write_scope: none
events_consumed: [share.opened.v1 (invite deep links)]
events_emitted: [connection.invited.v1, connection.accepted.v1]
permission_scope: read/write the caller's own connections and invitations; a connection is mutual
  consent to compare, never access to the other person's data
permissions_required: [write:own_connections, read:own_connections]
ui_shells: [share-shell, compare-shell]
product_pack_interfaces: [invite copy (ja), relationship-context vocabulary]
localization_requirements: [all invite/relationship copy]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: high                  # two people's expectations meet here
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: invites/pairs close; existing comparisons stay readable to their participants;
  sharing unaffected.
migration_strategy: greenfield (experience invites stay in their current scope until community.core
  absorbs that surface).
rollback_strategy: disable flag; connections erasable per plan on either side.
observability: [invite-to-accept conversion (non-identifying)]
audit_requirements: [invite/accept/dissolve -> audit (transactional class)]
```

### 10 · community.core

```yaml
module_id: community.core
name: Structured Community
version: 0.2.0
category: community
description: Low-pressure, structured, finite multi-user experience — prompts, structured
  responses, bounded reactions, visibility and moderation — never a feed.
purpose: Low-pressure, structured, finite multi-user experience.
user_problem: "I want to see how other people experience this — without social pressure."
target_users: people opting into shared perspectives around prompts and experiences
adoption_status: partial          # the shared-experience surface is the seed (gap doc §3.10)
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - topics, community prompts, structured responses, bounded reactions
  - visibility and moderation state
  - same-result / different-perspective views (people who received a similar result — never
    identity tribes)
non_responsibilities:
  - blank social posting as the primary model
  - feeds, follower graphs, rankings
  - person-to-person connection (connection.core)
required_kernel_services: [identity, ownership, consent, audit, data_lifecycle, events, permissions]
input_contracts: [CommunityPromptDefinition (from pack), CommunityResponseDraft]
output_contracts: [CommunityPromptView, PerspectiveCollection]
owned_data: [Topic, CommunityPrompt, CommunityResponse, Reaction, Visibility, ModerationState]
readable_external_data: [share-safe derivatives only (a community response is authored content,
                         never an auto-surfaced private object)]
forbidden_data: [private objects of any user, durable memory, raw assessment answers]
memory_access: none
memory_write_scope: none
events_consumed: [discovery.completed.v1 (same-day perspective grouping)]
events_emitted: [community.response_created.v1, community.reaction_added.v1]
permission_scope: write only the caller's own authored responses/reactions; read only content
  whose visibility includes the caller; moderation is a role-gated grant
permissions_required: [write:own_community_content, read:visible_community_content, moderate (role)]
ui_shells: [collection-shell, reflection-shell]
product_pack_interfaces: [prompt calendars, reaction vocabulary, moderation copy (ja)]
localization_requirements: [all community copy]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: [Moderation Agent — bounded to visibility/moderation state]
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: high
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: community surfaces close; the flagship assessment and Today are unaffected
  (iron rule 5, verbatim requirement).
migration_strategy: the shared-experience surface (visibility, moderation, reports) migrates from
  experience-adjacent code into this boundary in V1.5.
rollback_strategy: close visibility (everything reverts to private); no content loss.
observability: [response/reaction rates per prompt (non-identifying), moderation queue depth]
audit_requirements: [visibility change, moderation action, report -> audit (transactional class,
    as the experience surface already does)]
```

### 11 · matching.core

```yaml
module_id: matching.core
name: Matching
version: 0.2.0
category: matching
description: Eligibility-first candidate generation (person, experience, topic, resource,
  activity) from explicitly consented context, with an explanation for every candidate.
purpose: Generate eligible match candidates from allowed context, with explanations.
user_problem: "Show me people or things that could fit me — and tell me why."
target_users: V2 users opting into contextual discovery of people/resources
adoption_status: declared         # V2 only
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - "the pipeline: Candidate Pool -> Eligibility -> Context Match -> Diversity -> Explanation -> Feedback"
  - explanations for every surfaced candidate
non_responsibilities:
  - ranking by popularity
  - any use of private free text or sensitive inferred vulnerability for social/commercial matching
    (forbidden absolutely)
  - closing the loop (surfacing is recommendation.core's job where the candidate is an option)
required_kernel_services: [identity, ownership, consent, permissions, events]
input_contracts: [CandidateSource (declared, per candidate kind), MatchRequest]
output_contracts: [MatchCandidateSet (with per-candidate explanation)]
owned_data: [MatchCandidate, EligibilityRecord, MatchFeedback]
readable_external_data: [explicitly consented, allowlisted context contracts only]
forbidden_data: [private free text, sensitive inferred vulnerability, non-consented context,
                 other users' private objects]
memory_access: none
memory_write_scope: none
events_consumed: [connection.accepted.v1, community.response_created.v1]
events_emitted: []                # match candidates surface via recommendation events
permission_scope: read only context each person explicitly consented into matching; write only the
  caller's own feedback; person-candidates require symmetric consent
permissions_required: [read:consented_matching_context, write:own_match_feedback]
ui_shells: [collection-shell]
product_pack_interfaces: [candidate-kind adapters, explanation copy (ja)]
localization_requirements: [explanation copy]
regional_adapters: []
module_dependencies: [connection.core]
external_dependencies: []
agent_requirements: []
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: high
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: match-driven surfaces fall back to non-matched finite collections.
migration_strategy: greenfield in V2, over consent machinery proven in V1/V1.5.
rollback_strategy: disable flag; feedback erasable per plan.
observability: [eligibility funnel counts (non-identifying)]
audit_requirements: [person-candidate surfacing -> audit (asynchronous class)]
```

### 12 · recommendation.core

```yaml
module_id: recommendation.core
name: Recommendation
version: 0.2.0
category: recommendation
description: Selects a finite, explained set of next options from eligible candidates under a
  binding priority order in which commercial value is permanently last.
purpose: Select a finite set of relevant next options from eligible candidates.
user_problem: "Given where I am right now, what are a few small things that could help?"
target_users: any signed-in person on Today, Explore, or Small Next Step
adoption_status: partial          # recommendation graph + governed objects exist (gap doc §3.12)
lifecycle_state: DEFINED
verification_state: not_verified
responsibilities:
  - "the priority order, binding: 1 safety/exclusion, 2 explicit intent, 3 context fit,
    4 allowed user history/feedback, 5 quality/provenance, 6 availability,
    7 diversity/non-repetition, 8 commercial value LAST"
  - bounded option sets (a few; never a feed)
  - feedback capture
non_responsibilities:
  - complex ML ranking (V1 is rule-based recommendation-lite, verbatim requirement)
  - generating candidates (sources declare candidates; this module selects)
required_kernel_services: [identity, ownership, permissions, events, audit]
input_contracts: [CandidateSet (from declared sources), RecommendationRequest]
output_contracts: [RecommendationSetView (finite, explained)]
owned_data: [RecommendationSet, RecommendationItem, RecommendationFeedback]
readable_external_data: [CurrentStateSnapshot (context fit), declared candidate contracts]
forbidden_data: [private reflection text, durable memory content, raw assessment answers]
memory_access: none
memory_write_scope: none
events_consumed: [state.checkin_completed.v1, recommendation.feedback.v1]
events_emitted: [recommendation.generated.v1, recommendation.shown.v1, recommendation.feedback.v1]
permission_scope: read the caller's own context and declared candidate contracts; write only the
  caller's own recommendation sets and feedback
permissions_required: [read:own_context, write:own_recommendations]
ui_shells: [collection-shell, result-shell]
product_pack_interfaces: [candidate sources, safety/exclusion rules, copy (ja)]
localization_requirements: [option copy]
regional_adapters: []
module_dependencies: []
external_dependencies: []
agent_requirements: [Recommendation Agent — bounded to selection within declared candidates]
data_owner: user — the module holds operational custody of its owned records, never ownership of the person
privacy_class: personal
risk_class: medium
commercial_status: non_commercial
revenue_model: none
portable: true
portable_test_required: true
disable_behavior: option surfaces show static safe defaults; nothing else breaks.
migration_strategy: adopt the existing recommendation graph + governed recommendation objects
  behind the contract; keep the shipped bounded-return limits.
rollback_strategy: contract layer removed; graph keeps operating.
observability: [shown/feedback rates (non-identifying)]
audit_requirements: [recommendation over sensitive context -> audit (asynchronous class)]
```

---

## 3. Cross-contract invariants (test-backed)

1. **Superset rule**: every v0.7.0 §4 governance field maps to a real field of this schema
   (`V070_FIELD_MAPPING`, test-enforced), and every module block above carries every schema field.
   There is exactly one module-contract standard.
2. **Event names** all match `family.event.vN` and appear in the single canonical list
   (`lib/platform/events.ts`). No module invents local names. No universal event exists.
3. **The governed envelope** structurally supports all fourteen v0.7.0 event-architecture fields
   (identity, both timestamps, opaque subject/actor, correlation, causation, data class, permission
   context, provenance), and `event_version` always equals the version parsed from the name.
4. **Three state axes stay distinct**: `adoption_status` (repo truth) · `lifecycle_state` (v0.7.0
   vocabulary; all `DEFINED` today) · `verification_state` (all `not_verified` today).
5. **Brand isolation**: `lib/platform/` contains no product/brand strings and no Japanese product
   copy (`test:platform-contracts` enforces both; the same test gates capability code as it lands).
6. **No inversion**: platform/capability code never imports product application code.
7. **Permission/consent coherence**: a module declaring `permissions_required` requires the
   `permissions` Kernel service; a module reading consented external data requires `consent`.
8. **Every `owned_data` family** joins the Kernel erasure plan + coverage test with its first
   migration; `data_owner` semantics (§1.2) hold in every contract.
9. **`forbidden_data` is testable**: boundary tests in the pattern of `osf1Boundaries.test.ts`
   accompany each module as it is implemented.
10. **Governed memory posture**: `memory_write_scope: none` everywhere; `discovery.core` keeps
    `memory_write = false` and `life_graph_write = false`; a `PossibleMemoryCandidate` is not a
    `ConfirmedMemory`; **D-03 OPEN**.

*Version history: v1.1 (2026-08-18) — review remediation: schema made an explicit compatible
superset of the v0.7.0 Module Contract Standard with a lossless field mapping; data-ownership
semantics fixed (operational custody, never ownership of the person); lifecycle/verification axes
added with verbatim v0.7.0 vocabulary; permission/consent coherence fixes across all twelve
contracts. v1.0 (2026-08-18) — twelve initial contracts, authorized by
`YORISOU-REFERENCE-ARCHITECTURE-V1-FOUNDATION`.*
