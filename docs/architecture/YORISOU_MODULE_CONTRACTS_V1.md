# YORISOU Module Contracts v1.0

**Status:** CANONICAL · **Version:** 1.0 · **Date:** 2026-08-18
**Parent:** [YORISOU_REFERENCE_ARCHITECTURE_V1.md](YORISOU_REFERENCE_ARCHITECTURE_V1.md)
**Machine mirror:** `lib/platform/moduleContract.ts` (types), `lib/platform/events.ts` (event names),
`lib/platform/registry.ts` (declared registry) — guarded by `npm run test:platform-contracts`.

Twelve capability contracts over one standard schema. A contract is a **declaration of boundaries**,
not an implementation claim: `status: declared` means the boundary exists on paper; `partial` means
the repository already realizes part of the capability *without* the contract boundary (the gap
document maps exactly what). Per the completion truth model, nothing here is evidence that code
exists.

---

## 1. The standard Module Contract schema

Every capability module is described by exactly this schema (machine type:
`ModuleContract` in `lib/platform/moduleContract.ts`):

```yaml
module_id:                # "<family>.core"
version:                  # semver of the CONTRACT, not the code
status:                   # declared | partial | implemented | deprecated

purpose:                  # one sentence
responsibilities: []      # what this module answers for
non_responsibilities: []  # what it must never absorb

required_kernel_services: []   # identity | auth | consent | permissions | memory | events |
                               # ownership | localization | audit | data_lifecycle | module_registry

input_contracts: []       # named interfaces this module accepts
output_contracts: []      # named interfaces this module provides

owned_data: []            # conceptual objects only this module writes
readable_external_data: []# other modules' OUTPUT contracts it may read (never their tables)
forbidden_data: []        # data it must never read or hold

events_consumed: []       # typed event names
events_emitted: []        # typed event names

permissions_required: []  # kernel permission grants needed at runtime

ui_shells: []             # experience-shell | result-shell | reflection-shell | share-shell |
                          # compare-shell | collection-shell
product_pack_interfaces: []  # what a pack must supply to productize this capability

localization_requirements: []# what must be localizable (copy always arrives via packs)

external_dependencies: [] # third-party services (declared, never assumed)
agent_dependencies: []    # bounded agents that may attach (scope = this module only)

risk_class:               # low | medium | high  (privacy/user-harm exposure)

portable: true|false      # intended to leave Yorisou one day
portable_test_required:   # true → portability gate must pass before extraction

disable_behavior:         # what the product does when this module is off
migration_strategy:       # how existing product data moves INTO the module boundary
rollback_strategy:        # how to retreat without losing user data

observability: []         # bounded, non-identifying signals
audit_requirements: []    # which mutations write audit events, and their delivery class
```

**Shared rules inherited by all 12 contracts** (stated once, binding everywhere):

- Iron rules 1–5 (own your data · read through contract · brand-free core · no silent privilege ·
  disable independently).
- All personal objects carry `owner` scoping and join the Kernel erasure plan + coverage test in the
  same change that creates them.
- All mutations go through the Kernel data-access substrate (server-side, owner-scoped, RPC-only).
- Consumer copy arrives through Product Packs; modules ship no Japanese product copy.
- `AI_INFERENCE ≠ FACT`; nothing a module infers becomes durable memory without explicit user
  confirmation (D-03 OPEN).

---

## 2. The twelve contracts

### 01 · state.core

```yaml
module_id: state.core
version: 0.1.0
status: partial            # two state stores exist today without this boundary (gap doc §3.1)
purpose: Capture the person's current moment/state, cheaply and reversibly.
responsibilities:
  - lightweight state capture (seconds, tap-first)
  - current-state snapshots and their correction/deletion
  - a state vocabulary stable enough for other modules to reference
non_responsibilities:
  - personality or identity claims
  - durable Memory
  - Pattern detection
  - Recommendation
required_kernel_services: [identity, ownership, audit, data_lifecycle, events, localization]
input_contracts: [StateCaptureRequest]
output_contracts: [CurrentStateSnapshot, StateVocabulary]
owned_data: [StateEntry, StateSignal, CurrentStateSnapshot, StateContextReference]
readable_external_data: []
forbidden_data: [assessment methodology identity (result ids, personas, scores), durable memory,
                 private reflection text]
events_consumed: []
events_emitted: [state.checkin_started.v1, state.checkin_completed.v1,
                 state.snapshot_created.v1, state.corrected.v1, state.deleted.v1]
permissions_required: [write:own_state, read:own_state]
ui_shells: [experience-shell, result-shell]
product_pack_interfaces: [state vocabulary labels + copy (ja), check-in flow copy]
localization_requirements: [all vocabulary labels, all flow copy]
external_dependencies: []
agent_dependencies: []
risk_class: medium         # state is sensitive but transient
portable: true
portable_test_required: true
disable_behavior: check-in surfaces close; existing snapshots remain readable via continuity
                  projections; nothing else breaks.
migration_strategy: adopt the existing daily-state and current-state stores behind one contract
                    without rewriting rows (adapter first, schema convergence later).
rollback_strategy: contract layer removed; underlying stores keep operating as today.
observability: [checkin completion rate (bounded, non-identifying), error classes]
audit_requirements: [state deletion/correction → audit event (asynchronous class)]
```

### 02 · assessment.core

```yaml
module_id: assessment.core
version: 0.1.0
status: partial            # three runtimes exist today (gap doc §3.2); rule-based engine is brand-free
purpose: Run any structured assessment: sessions, answers, versioned scoring, result references.
responsibilities:
  - assessment session lifecycle (start, progress, resume, abandon, retake)
  - answer capture against a versioned instrument
  - producing a result REFERENCE (the pack owns result meaning and copy)
non_responsibilities:
  - Imairo methodology, taxonomy, result copy, persona visual identity
  - turning results into durable identity or current state (no_auto_convert)
required_kernel_services: [identity, ownership, audit, data_lifecycle, events]
input_contracts: [InstrumentDefinition (from pack), AssessmentStartRequest]
output_contracts: [AssessmentResultReference, AssessmentSessionState]
owned_data: [AssessmentSession, AssessmentAnswer, AssessmentResultReference, AssessmentVersion]
readable_external_data: []
forbidden_data: [current state, durable memory, reflections]
events_consumed: []
events_emitted: [assessment.started.v1, assessment.progressed.v1, assessment.completed.v1,
                 assessment.abandoned.v1, assessment.retaken.v1]
permissions_required: [write:own_assessment, read:own_assessment]
ui_shells: [experience-shell, result-shell]
product_pack_interfaces: [instrument definition (questions, scale, order — protected for Imairo),
                          scoring adapter, result copy + visual identity]
localization_requirements: [instrument copy, result copy — pack-supplied]
external_dependencies: []
agent_dependencies: []
risk_class: medium
portable: true
portable_test_required: true
disable_behavior: test surfaces close; existing result references stay readable; Today/Life OS
                  unaffected (boundary already schema-enforced).
migration_strategy: catalog the existing engines (120q generated runtime, rule-based engine, method
                    runtimes) under one session/answer/result-reference contract; Imairo instrument
                    bytes NEVER change (protected asset).
rollback_strategy: engines keep operating as today; contract layer is additive.
observability: [completion/abandon rates per instrument (non-identifying)]
audit_requirements: [result deletion → audit event; retake → session lineage kept]
```

### 03 · discovery.core

```yaml
module_id: discovery.core
version: 0.1.0
status: declared           # 今日のひとつ does not exist yet
purpose: Deliver finite, rotating, lightweight discovery experiences (今日のひとつ).
responsibilities:
  - discovery scheduling, eligibility, cooldown
  - session lifecycle for generic patterns (symbol_draw, visual_choice, binary_choice,
    three_question, mini_story, seasonal, future originals)
  - explicit save of a discovery result the person wants to keep
non_responsibilities:
  - writing memory or life-graph data (memory_write=false, life_graph_write=false by default)
  - claiming fate/destiny/diagnosis (pack copy is bound by the same rule)
  - infinite feeds
required_kernel_services: [identity, ownership, events, localization]
input_contracts: [DiscoveryPatternDefinition (from pack), DiscoveryRequest]
output_contracts: [DiscoveryResultReference, DiscoveryScheduleView]
owned_data: [DiscoverySession, DiscoverySchedule, DiscoveryEligibility, DiscoveryResultReference,
             DiscoverySave, CooldownState]
readable_external_data: [CurrentStateSnapshot (optional, consented, for seasonal/contextual flavor)]
forbidden_data: [durable memory, private reflections, assessment raw answers]
events_consumed: []
events_emitted: [discovery.presented.v1, discovery.started.v1, discovery.completed.v1,
                 discovery.saved.v1, discovery.dismissed.v1]
permissions_required: [write:own_discovery, read:own_discovery]
ui_shells: [experience-shell, result-shell, share-shell]
product_pack_interfaces: [pattern content (original questions/symbols/results — Yorisou-original
                          only), rotation/seasonal calendars, visual identity]
localization_requirements: [all pattern copy]
external_dependencies: []
agent_dependencies: []
risk_class: low
portable: true
portable_test_required: true
disable_behavior: Today loses its curiosity half gracefully (utility half unaffected); saved
                  discoveries stay visible via continuity projections.
migration_strategy: greenfield; no existing data to adopt.
rollback_strategy: disable flag; sessions/saves remain, erasable via the Kernel plan.
observability: [participation/save rates per pattern family (non-identifying)]
audit_requirements: [discovery save/delete → audit event (asynchronous class)]
```

### 04 · experience.core

```yaml
module_id: experience.core
version: 0.1.0
status: partial            # experience cards + OSF-1 experience linkage exist (gap doc §3.4)
purpose: Model lived attempts generically: Situation → Action → Outcome.
responsibilities:
  - experience records and their lifecycle (create, update, record action, record outcome, delete)
  - being the factual substrate reflection and community build on
non_responsibilities:
  - interpretation (reflection.core's job)
  - visibility/moderation of shared experiences (community.core's job)
required_kernel_services: [identity, ownership, audit, data_lifecycle, events]
input_contracts: [ExperienceDraft]
output_contracts: [ExperienceView]
owned_data: [Experience, Situation, ActionAttempt, Outcome]
readable_external_data: [CurrentStateSnapshot (as situation context, by reference)]
forbidden_data: [assessment methodology identity, durable memory]
events_consumed: []
events_emitted: [experience.created.v1, experience.action_recorded.v1,
                 experience.outcome_recorded.v1, experience.updated.v1, experience.deleted.v1]
permissions_required: [write:own_experience, read:own_experience]
ui_shells: [experience-shell, reflection-shell]
product_pack_interfaces: [experience prompts + copy (ja)]
localization_requirements: [all prompts]
external_dependencies: []
agent_dependencies: []
risk_class: medium
portable: true
portable_test_required: true
disable_behavior: experience capture closes; existing records readable via projections; Evening
                  Return degrades to state-only.
migration_strategy: adopt the existing experience-card store behind the contract; the sharing/
                    moderation halves migrate toward community.core, not here.
rollback_strategy: contract layer removed; store keeps operating.
observability: [outcome-recorded rate (non-identifying)]
audit_requirements: [delete/visibility-relevant mutations → audit (delivery classes per the
                     existing audit delivery map)]
```

### 05 · reflection.core

```yaml
module_id: reflection.core
version: 0.1.0
status: partial            # OSF-1 reflections + assistant exist behind INTERNAL (gap doc §3.5)
purpose: Turn allowed context into user reflection the person authors and owns.
responsibilities:
  - reflection prompts and responses (guided and AI-assisted)
  - weekly reflection artifacts (V1.5)
  - emitting candidates (PossibleInsightCandidate, PossibleMemoryCandidate) that are NEVER
    auto-promoted (candidate ≠ ConfirmedMemory; D-03 OPEN)
non_responsibilities:
  - deciding what becomes durable memory (Kernel + explicit user confirmation only)
  - pattern detection over time (continuity.core)
required_kernel_services: [identity, ownership, audit, data_lifecycle, events, consent]
input_contracts: [ReflectionPromptSet (from pack), ReflectionContextGrant]
output_contracts: [ReflectionView, PossibleInsightCandidate, PossibleMemoryCandidate]
owned_data: [Reflection, ReflectionPrompt, ReflectionResponse, WeeklyReflectionArtifact]
readable_external_data: [ExperienceView, CurrentStateSnapshot (granted context only)]
forbidden_data: [assessment raw answers, other users' data, ungranted context]
events_consumed: [experience.outcome_recorded.v1 (as reflection invitations)]
events_emitted: [reflection.started.v1, reflection.created.v1, reflection.corrected.v1,
                 reflection.dismissed.v1, weekly_reflection.created.v1]
permissions_required: [write:own_reflection, read:own_reflection, read:granted_context]
ui_shells: [reflection-shell]
product_pack_interfaces: [prompt sets + copy (ja), assistant tone rules]
localization_requirements: [all prompts and assistant-facing copy]
external_dependencies: [AI provider routes (bounded, draft-only, injection-defended — as shipped)]
agent_dependencies: [Reflection Agent — draft-only; the user approves every persisted word]
risk_class: high           # most intimate free text in the product
portable: true
portable_test_required: true
disable_behavior: reflection surfaces close; existing reflections readable; assistant OFF
                  independently of manual reflection.
migration_strategy: existing OSF-1 reflections already match this boundary; formalize the interface.
rollback_strategy: assistant can be disabled alone; manual flow alone; both without data loss.
observability: [assistant failure classes (bounded, as shipped); reflection completion rate]
audit_requirements: [reflection create/correct/delete → audit (transactional class where shipped)]
```

### 06 · continuity.core

```yaml
module_id: continuity.core
version: 0.1.0
status: partial            # timeline exists via direct multi-store reads (gap doc §3.6)
purpose: Connect meaningful events across time into human-readable continuity.
responsibilities:
  - TimelineProjection maintenance (projection rule: minimal display-safe metadata, by reference)
  - PatternCandidate detection and user feedback (pattern ≠ identity, ≠ Memory)
  - return references (evening return, revisit prompts)
  - continuity summaries and historical comparisons
non_responsibilities:
  - owning durable Memory
  - duplicating source records (projection rule is binding)
required_kernel_services: [identity, ownership, events, data_lifecycle]
input_contracts: [ProjectionSource (each module's output contract)]
output_contracts: [TimelineMoment, PatternCandidate, HistoricalComparison, ReturnPromptCandidate,
                   ContinuitySummary]
owned_data: [TimelineProjection, PatternCandidate, ReturnReference, ContinuitySummary]
readable_external_data: [output contracts of state/assessment/discovery/experience/reflection —
                         never their tables]
forbidden_data: [full source records (projection rule), other users' data]
events_consumed: [state.snapshot_created.v1, assessment.completed.v1, discovery.saved.v1,
                  experience.outcome_recorded.v1, reflection.created.v1, memory.confirmed.v1,
                  memory.deleted.v1, state.deleted.v1, experience.deleted.v1]
events_emitted: [continuity.moment_created.v1, pattern.candidate_created.v1,
                 pattern.feedback_received.v1, return.reference_created.v1]
permissions_required: [read:own_projections, write:own_projections]
ui_shells: [collection-shell]
product_pack_interfaces: [timeline copy (ja), pattern presentation copy]
localization_requirements: [all continuity copy]
external_dependencies: []
agent_dependencies: []
risk_class: medium
portable: true
portable_test_required: true
disable_behavior: timeline/insights close; source modules unaffected (projections are derived data).
migration_strategy: introduce projections next to today's direct-read timeline, then switch reads;
                    source deletion invalidates projections from day one.
rollback_strategy: drop projections and return to direct reads; no source data at risk.
observability: [projection lag, invalidation counts (non-identifying)]
audit_requirements: [pattern feedback → audit (asynchronous class)]
```

### 07 · comparison.core

```yaml
module_id: comparison.core
version: 0.1.0
status: declared
purpose: Generic A ↔ B comparison with humane outputs.
responsibilities:
  - comparisons of Person↔Person (consented pairs), CurrentSelf↔PastSelf, Month↔Month,
    Assessment↔Assessment
  - producing exactly: Similarities, Differences, PossibleComplementarity, PossibleFriction,
    SharedQuestion
non_responsibilities:
  - Imairo-specific meaning (an Imairo comparison adapter in the pack supplies it —
    ふたりのImairo = comparison.core + Imairo adapter)
  - compatibility percentages, soulmate/perfect-match language, deterministic claims
required_kernel_services: [identity, ownership, consent, events]
input_contracts: [ComparisonRequest (two consented references), ComparisonAdapter (from pack)]
output_contracts: [ComparisonView]
owned_data: [ComparisonRecord]
readable_external_data: [AssessmentResultReference, CurrentStateSnapshot, ContinuitySummary —
                         each side by explicit grant]
forbidden_data: [non-participant data (both people must participate), raw answers, private text]
events_consumed: [connection.accepted.v1]
events_emitted: [comparison.created.v1]
permissions_required: [read:granted_comparison_inputs, write:own_comparisons]
ui_shells: [compare-shell]
product_pack_interfaces: [comparison adapters per instrument, pair copy (ja) obeying the pair
                          language rules]
localization_requirements: [all pair copy]
external_dependencies: []
agent_dependencies: []
risk_class: medium
portable: true
portable_test_required: true
disable_behavior: pair views close; connections and shares unaffected.
migration_strategy: greenfield.
rollback_strategy: disable flag; comparison records erasable per plan.
observability: [comparison completion rate (non-identifying)]
audit_requirements: [comparison creation over a pair → audit (asynchronous class)]
```

### 08 · sharing.core

```yaml
module_id: sharing.core
version: 0.1.0
status: partial            # Imairo public-result snapshot + /result/share exist (gap doc §3.8)
purpose: Convert private objects into explicit public-safe derivatives, and nothing else.
responsibilities:
  - the one share flow: PRIVATE → SAFE DERIVATIVE → PREVIEW → EXPLICIT SHARE → DEEP LINK
  - share object lifecycle including revocation
  - allowlist-built derivatives (never redaction of the private object)
non_responsibilities:
  - deciding what is shareable (each source module's output contract declares its share candidates)
  - social distribution mechanics beyond the deep link
forbidden_data: [private notes, raw answers, sensitive state, durable memory, longitudinal insight,
                 private reports — never in a ShareObject]
required_kernel_services: [identity, ownership, consent, audit, data_lifecycle, events]
input_contracts: [ShareCandidate (from source modules), ShareTemplateReference (from pack)]
output_contracts: [ShareObjectView, DeepLink]
owned_data: [ShareObject, ShareTemplateReference, DeepLink, ShareAccessPolicy, ShareEvent]
readable_external_data: [declared share candidates only]
events_consumed: [assessment.completed.v1, discovery.completed.v1, comparison.created.v1]
events_emitted: [share.preview_created.v1, share.created.v1, share.opened.v1]
permissions_required: [write:own_shares, read:own_shares]
ui_shells: [share-shell]
product_pack_interfaces: [share card templates (Imairo Result Card, Daily Discovery Card,
                          Pair Result Card, Monthly Story Card), OG imagery, copy (ja)]
localization_requirements: [card copy]
external_dependencies: []
agent_dependencies: []
risk_class: high           # the privacy boundary crosses here, on purpose, explicitly
portable: true
portable_test_required: true
disable_behavior: new shares stop; existing deep links can be revoked wholesale; nothing private
                  is affected.
migration_strategy: generalize the shipped Imairo public-result snapshot into ShareObject; existing
                    snapshots become the first ShareObjects.
rollback_strategy: revoke-and-disable; private sources untouched.
observability: [share/open counts per family (non-identifying)]
audit_requirements: [share create/revoke → audit (transactional class — a publish is a boundary
                     crossing)]
```

### 09 · connection.core

```yaml
module_id: connection.core
version: 0.1.0
status: declared           # only experience-scoped invites exist today
purpose: Explicit person-to-person connection and pair context.
responsibilities:
  - invitations, accepted connections, pairs, relationship context, connection preferences
  - the consent substrate for comparison and community interactions
non_responsibilities:
  - analyzing a non-participating third party (forbidden absolutely)
  - discovery of strangers (matching.core, V2)
  - messaging (no unrestricted DM in V1/V1.5)
required_kernel_services: [identity, ownership, consent, audit, data_lifecycle, events]
input_contracts: [InvitationRequest]
output_contracts: [ConnectionView, PairContext]
owned_data: [Invitation, Connection, Pair, RelationshipContext, ConnectionPreference]
readable_external_data: []
forbidden_data: [the other person's private objects (connection grants comparison CONSENT, not data
                 access), any non-participant's data]
events_consumed: [share.opened.v1 (invite deep links)]
events_emitted: [connection.invited.v1, connection.accepted.v1]
permissions_required: [write:own_connections, read:own_connections]
ui_shells: [share-shell, compare-shell]
product_pack_interfaces: [invite copy (ja), relationship-context vocabulary]
localization_requirements: [all invite/relationship copy]
external_dependencies: []
agent_dependencies: []
risk_class: high           # two people's expectations meet here
portable: true
portable_test_required: true
disable_behavior: invites/pairs close; existing comparisons stay readable to their participants;
                  sharing unaffected.
migration_strategy: greenfield (experience invites stay in their current scope until community.core
                    absorbs that surface).
rollback_strategy: disable flag; connections erasable per plan on either side.
observability: [invite→accept conversion (non-identifying)]
audit_requirements: [invite/accept/dissolve → audit (transactional class)]
```

### 10 · community.core

```yaml
module_id: community.core
version: 0.1.0
status: partial            # /experiences shared cards + moderation are the seed (gap doc §3.10)
purpose: Low-pressure, structured, finite multi-user experience.
responsibilities:
  - topics, community prompts (今日の問い), structured responses, bounded reactions
  - visibility and moderation state
  - same-result / different-perspective views (「近い結果だった人」, never identity tribes)
non_responsibilities:
  - blank social posting as the primary model
  - feeds, follower graphs, rankings
  - person-to-person connection (connection.core)
required_kernel_services: [identity, ownership, consent, audit, data_lifecycle, events,
                           permissions]
input_contracts: [CommunityPromptDefinition (from pack), CommunityResponseDraft]
output_contracts: [CommunityPromptView, PerspectiveCollection]
owned_data: [Topic, CommunityPrompt, CommunityResponse, Reaction, Visibility, ModerationState]
readable_external_data: [share-safe derivatives only (a community response is authored content,
                         never an auto-surfaced private object)]
forbidden_data: [private objects of any user, durable memory, raw assessment answers]
events_consumed: [discovery.completed.v1 (same-day perspective grouping)]
events_emitted: [community.response_created.v1, community.reaction_added.v1]
permissions_required: [write:own_community_content, read:visible_community_content, moderate (role)]
ui_shells: [collection-shell, reflection-shell]
product_pack_interfaces: [prompt calendars (yorisou.community-prompts), reaction vocabulary,
                          moderation copy (ja)]
localization_requirements: [all community copy]
external_dependencies: []
agent_dependencies: [Moderation Agent — bounded to visibility/moderation state]
risk_class: high
portable: true
portable_test_required: true
disable_behavior: community surfaces close; Imairo and Today unaffected (iron rule 5, verbatim
                  requirement).
migration_strategy: the shared-experience surface (visibility, moderation, reports) migrates from
                    experience-adjacent code into this boundary in V1.5.
rollback_strategy: close visibility (everything reverts to private); no content loss.
observability: [response/reaction rates per prompt (non-identifying), moderation queue depth]
audit_requirements: [visibility change, moderation action, report → audit (transactional class,
                     as the experience surface already does)]
```

### 11 · matching.core

```yaml
module_id: matching.core
version: 0.1.0
status: declared           # V2 only
purpose: Generate eligible match candidates (Person, Experience, Topic, Resource, Activity) from
         allowed context.
responsibilities:
  - the pipeline: Candidate Pool → Eligibility → Context Match → Diversity → Explanation → Feedback
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
events_consumed: [connection.accepted.v1, community.response_created.v1]
events_emitted: []          # match candidates surface via recommendation events
permissions_required: [read:consented_matching_context, write:own_match_feedback]
ui_shells: [collection-shell]
product_pack_interfaces: [candidate-kind adapters, explanation copy (ja)]
localization_requirements: [explanation copy]
external_dependencies: []
agent_dependencies: []
risk_class: high
portable: true
portable_test_required: true
disable_behavior: match-driven surfaces fall back to non-matched finite collections.
migration_strategy: greenfield in V2, over consent machinery proven in V1/V1.5.
rollback_strategy: disable flag; feedback erasable per plan.
observability: [eligibility funnel counts (non-identifying)]
audit_requirements: [person-candidate surfacing → audit (asynchronous class)]
```

### 12 · recommendation.core

```yaml
module_id: recommendation.core
version: 0.1.0
status: partial            # recommendation graph + governed objects exist (gap doc §3.12)
purpose: Select a finite set of relevant next options from eligible candidates.
responsibilities:
  - the priority order, binding: 1 safety/exclusion · 2 explicit intent · 3 context fit ·
    4 allowed user history/feedback · 5 quality/provenance · 6 availability ·
    7 diversity/non-repetition · 8 commercial value LAST
  - bounded option sets (a few; never a feed)
  - feedback capture
non_responsibilities:
  - complex ML ranking (V1 is rule-based recommendation-lite, verbatim requirement)
  - generating candidates (sources declare candidates; this module selects)
required_kernel_services: [identity, ownership, events, audit]
input_contracts: [CandidateSet (from declared sources), RecommendationRequest]
output_contracts: [RecommendationSetView (finite, explained)]
owned_data: [RecommendationSet, RecommendationItem, RecommendationFeedback]
readable_external_data: [CurrentStateSnapshot (context fit), declared candidate contracts]
forbidden_data: [private reflection text, durable memory content, raw assessment answers]
events_consumed: [state.checkin_completed.v1, recommendation.feedback.v1]
events_emitted: [recommendation.generated.v1, recommendation.shown.v1, recommendation.feedback.v1]
permissions_required: [read:own_context, write:own_recommendations]
ui_shells: [collection-shell, result-shell]
product_pack_interfaces: [candidate sources, safety/exclusion rules, copy (ja)]
localization_requirements: [option copy]
external_dependencies: []
agent_dependencies: [Recommendation Agent — bounded to selection within declared candidates]
risk_class: medium
portable: true
portable_test_required: true
disable_behavior: option surfaces show static safe defaults; nothing else breaks.
migration_strategy: adopt the existing recommendation graph + governed recommendation objects
                    behind the contract; keep the shipped RETURN_MAX_ITEMS-style bounds.
rollback_strategy: contract layer removed; graph keeps operating.
observability: [shown/feedback rates (non-identifying)]
audit_requirements: [recommendation over sensitive context → audit (asynchronous class)]
```

---

## 3. Cross-contract invariants (test-backed)

1. **Event names** all match `family.event.vN` and appear in the single canonical list
   (`lib/platform/events.ts`). No module invents local names. No universal event exists.
2. **Brand isolation**: `lib/platform/` contains no `Yorisou`/`Imairo` strings
   (`test:platform-contracts` enforces this from day one; the same test gates capability code as it
   lands).
3. **No inversion**: platform/capability code never imports product application code.
4. **Every `owned_data` family** joins the Kernel erasure plan + coverage test with its first
   migration.
5. **`forbidden_data` is testable**: boundary tests in the pattern of
   `osf1Boundaries.test.ts` (no forbidden import, no forbidden column, boundary stated as data)
   accompany each module as it is implemented.

*Version history: v1.0 (2026-08-18) — twelve initial contracts, authorized by
`YORISOU-REFERENCE-ARCHITECTURE-V1-FOUNDATION`.*
