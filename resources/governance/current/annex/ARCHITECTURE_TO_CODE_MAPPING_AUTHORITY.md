# YORISOU Architecture-to-Code Mapping Authority (Binding Annex) v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Annex of:** `Yorisou_Technical_Architecture_v0.4.0.md` · **Approver:** Edward

This annex is binding effective governance. If it conflicts with a v0.4.0 primary governance
document, the primary document outranks this annex. It defines service boundaries for future
authorized packages; it authorizes no implementation itself — Packages B–G are not authorized by
this annex.

## Consent-Based Personal Context Layer (CROSS-CUTTING — not a system)

Implemented as constraints inside every service:
1. consent entity + service (Phase A) is the only consent record source;
2. permissionCheckService is the ONLY memory-read path (all six systems);
3. UI consent surfaces are Web-only (LINE boundary);
4. deletion doctrine (receipts, cascade, resurfacing detector) enforced at the data layer;
5. audit_event required for every consent-relevant mutation;
6. connector/import blocking: no external-source memory ingestion exists in A–G (hard rule).
Tests: the cross-system permission-matrix suite runs in EVERY phase gate.

## Core System 1 — Emotional Value

| Aspect | Target |
|---|---|
| Product surfaces | value proposition on entry (validated copy), meaning explanation step, "why appeared" transparency, reflection choices |
| Services | emotionalValueCopy service (governed copy registry); no scoring engine (calm doctrine) |
| State machines | none of its own — expressed through memory + companion states |
| DB entities | reflection (choice enum), recommendation (feedback) |
| Events | landing_viewed, meaning_explained, reflection_started, memory_control_actioned (canonical dictionary) |
| APIs | none new beyond memory/reflection APIs |
| Agent responsibilities | Hinata: tone-governed reflection prompts within permission checks |
| Permission checks | every value expression referencing a memory passes the shared permission service |
| Audit | reflection records + audit_events on referenced memories |
| Tests | copy-governance lint, reflection-flow browser tests (port validated e2e patterns) |
| Dashboard metrics | felt-understood aggregates (from optional in-product feedback later), return-reason rate |
| Release gate | inside Phase C gate |

## Core System 2 — Relationship & Companion

| Aspect | Target |
|---|---|
| Product surfaces | Quiet Presence, presence indicator (validated restrained concept), companion status visibility, mode selection (post-MVP) |
| Services | companionStateService (state machine authority), quietPresenceService |
| State machines | operating_condition: NORMAL/QUIET_PERIOD/LIMITED_PERMISSION/REPAIR_REQUIRED/PAUSED → production port of validated NORMAL/LMM/REPAIRED/RESTRICTED axes; interaction modes enum (Quiet Presence first, others flag-gated) |
| DB entities | companion_state |
| Events | quiet_presence_previewed, voluntary_return_started, safe_exit_completed |
| APIs | GET companion/state; internal transitions only (no client-driven state jumps) |
| Agents | Hinata operates ONLY within operating_condition constraints |
| Permission checks | proactive references blocked outside NORMAL/repaired conditions (validated rule) |
| Audit | every condition transition = audit_event |
| Tests | state-machine unit tests (port ALL-states-reachable test), browser flows |
| Dashboard | condition distribution, LMM entries, repair completion |
| Release gate | Phase C + D gates |

## Core System 3 — Personal Archive & Memory

| Aspect | Target |
|---|---|
| Surfaces | capture → candidate review → confirm → separate UsePermission → controls (correct/suppress/revoke/delete) + deletion receipt view — 1:1 port of the validated Phase-1.2 flows and copy |
| Services | memoryLifecycleService (sole write path), permissionCheckService (sole read gate), deletionService (receipts + cascade) |
| State machines | candidate→confirmed→(suppressed/conflict/deleted) × permission (undecided/granted/revoked) — the validated two-axis model |
| DB entities | memory_candidate, confirmed_memory, use_permission, provenance, suppression, revocation, deletion_receipt |
| Events | meaningful_moment_started, meaning_explained, memory_candidate_reviewed, confirmed_memory_decided, use_permission_selected, memory_control_actioned |
| APIs | REST/actions for lifecycle; NO bulk read API |
| Agents | agents may READ only via permissionCheckService; may never write memory |
| Permission checks | the single service; resurfacing detector at every read |
| Audit | every lifecycle mutation |
| Tests | lifecycle unit (port deterministic suite), browser e2e (port 38-assertion suite), deletion-cascade DB tests |
| Dashboard | lifecycle counts (aggregate), deletion receipt issuance, zero-resurfacing monitor |
| Release gate | Phase B gate (the strictest: consent comprehension copy verbatim from the validated build) |

## Core System 4 — Recommendation & Reflection

| Aspect | Target |
|---|---|
| Surfaces | reflection screen (eligible memory + why-appeared + 4 choices), governed recommendations page (exists — ADAPT) |
| Services | reflectionService (eligibility via permission service), existing recommendationGraph (ADAPT: permission constraint) |
| State machines | none new; consumes memory/companion states |
| DB entities | reflection, recommendation |
| Events | reflection_started, eligible_memory_referenced, memory_control_actioned |
| APIs | reflection session endpoints |
| Agents | Hinata composes reflection prompts from permitted memories ONLY; provider harness with structured-output validation (exists) |
| Permission checks | eligible = confirmed + reflection-permission + condition allows (validated rule verbatim) |
| Audit | every eligible_memory_referenced records permission_check_ref |
| Tests | eligibility matrix unit tests, hallucination guard (provider output must reference only supplied permitted memories) |
| Dashboard | reference counts, revocation-after-reference rate (trust signal) |
| Release gate | Phase B/C gates |

## Core System 5 — Physical–Digital Expression (DORMANT until Phase G)

Deliberately thin: governance placeholder + entity reservations only. No surfaces, services, or
events in A–F. UGC/social re-evaluation happens HERE. The pre-commerce policy applies to any
physical product concept. Gate: separate Founder decision + its own package(s).

## Core System 6 — Life Continuity & Legacy (DORMANT until Phase G)

Governance seed = the retained Digital Legacy & Synthetic Identity doctrine (archived v0.1,
amended by `Yorisou_Life_Continuity_and_Legacy_Governance_v1.0.md`). Entity reservation: legacy
directives attach to user + confirmed_memory with an EXPLICIT separate consent kind.
Synthetic-identity prohibitions carry forward unchanged. No implementation in A–F.

## Canonical Event Dictionary — production target

The 15 validated canonical events become the production dictionary (namespaced `yorisou.exp.*`),
IDs FIXED, never derived from labels (validated discipline):
landing_viewed, quiet_presence_previewed, meaningful_moment_started, meaning_explained,
memory_candidate_reviewed, confirmed_memory_decided, use_permission_selected, safe_exit_completed,
voluntary_return_started, reflection_started, eligible_memory_referenced, memory_control_actioned,
trust_repair_started, trust_repair_completed, limited_memory_mode_entered.
Storage: audit/event stream (Phase A) with pseudonymous user ref; funnel semantics (denominator
event per row) ported from the validated dictionary. New events only via Change Management v1.0.

## Founder Dashboard — operations/evidence surface

Phase F: production mode — aggregates, pseudonymized trust queue, release-gate status, system
health; minimum-access + audit logging; /admin ADAPT. Validation mode remains the isolated
validation system (unchanged, separate). The 14-view structure and gate-table display contract
are the design reference. NOT_USER_FACING_PRODUCT_CENTER preserved (see
`Yorisou_Founder_Dashboard_and_Evidence_Governance_v1.0.md`).

## LINE / Web responsibility

Consent actions are Web-only; LINE is a channel adapter. Code targets: yorisouLine.ts +
lineOAuthStateStore (KEEP), app/line/* entry (ADAPT Phase E: deep-link targets become companion
Web surfaces when `companion_v1` is on), notification service NEW in Phase E (consent-gated,
capped, kill-switched). Enforcement test: an attempted consent action via LINE context must be
impossible (no such endpoint).
