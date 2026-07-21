# YORISOU Governance Pack v0.4.0 — Approved

**Status:** Approved
**Approved as activation candidate:** 2026-07-14
**Owner / Approver:** Edward
**Current Market:** Japan
**Current Product Language:** Japanese
**Current Surfaces:** Responsive Web and LINE/LIFF
**Planned Store Surfaces:** iOS App Store and Android Google Play
**Brand / Domain:** YORISOU / yorisou.online

## Authority

This directory is the single current source of truth for YORISOU governance. Governance
activation occurs at the moment Edward merges PR-1 (`Governance: activate YORISOU governance
pack v0.4.0`); until that merge, this pack is an activation candidate and v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.

Precedence inside the pack: (1) Implementation Baseline amendments (per-phase, evidence-anchored)
→ (2) amendment sections → (3) document bodies. Primary governance documents outrank the binding
annexes in `annex/` if a conflict exists. Runtime validation via
`lib/server/agent-runtime/governance-checksums.json` continues; any pack change ships regenerated
checksums in the same PR.

## Agent execution authority (current cycle)

Claude Code is the current authorized implementation agent (approved repository changes,
migrations, tests, evidence, pull requests — strictly within the Founder-authorized package and
scope). Edward authorizes governance activation, implementation packages, merges, production
releases, rollback and scope changes. Codex has no authorization in the current Package A
execution. Package A is authorized; Packages B–G are not authorized; production release is not
authorized. See `Yorisou_Agent_Roles_and_Execution_Authority_v1.0.md` and
`annex/AGENT_EXECUTION_AUTHORITY_MATRIX.md`.

## Document index

- `RESOURCE_MANIFEST.md`
- `Yorisou_AI_and_Provider_Governance_v1.0.md`
- `Yorisou_Agent_Roles_and_Execution_Authority_v1.0.md`
- `Yorisou_Change_Management_v1.0.md`
- `Yorisou_Community_and_Real_World_Connection_v0.4.0.md`
- `Yorisou_Companion_and_Relationship_Governance_v1.0.md`
- `Yorisou_Consent_Based_Personal_Context_Governance_v1.0.md`
- `Yorisou_Data_and_Privacy_Governance_v1.0.md`
- `Yorisou_Emotional_Value_Governance_v1.0.md`
- `Yorisou_Experience_Architecture_Doctrine_v1.0.md`
- `Yorisou_External_Representation_v0.4.0.md`
- `Yorisou_Founder_Authority_and_Decision_Rights_v1.0.md`
- `Yorisou_Founder_Dashboard_and_Evidence_Governance_v1.0.md`
- `Yorisou_Incident_Response_v1.0.md`
- `Yorisou_Life_Continuity_and_Legacy_Governance_v1.0.md`
- `Yorisou_Parent_Architecture_Doctrine_v1.0.md`
- `Yorisou_Personal_Archive_and_Memory_Governance_v1.0.md`
- `Yorisou_Physical_Digital_Expression_Governance_v1.0.md`
- `Yorisou_Product_Identity_and_Scope_v0.4.0.md`
- `Yorisou_Project_Constitution_v0.4.0.md`
- `Yorisou_Public_Value_and_Partnerships_v1.0.md`
- `Yorisou_Recommendation_and_Reflection_Governance_v1.0.md`
- `Yorisou_Release_and_Acceptance_Gates_v1.0.md`
- `Yorisou_Research_Validation_and_Marketing_Claims_v1.0.md`
- `Yorisou_Revenue_and_Commercial_Ethics_v0.4.0.md`
- `Yorisou_Rollback_and_Kill_Switches_v1.0.md`
- `Yorisou_Technical_Architecture_v0.4.0.md`
- `Yorisou_Trust_Repair_and_Limited_Memory_Mode_Governance_v1.0.md`
- `annex/AGENT_EXECUTION_AUTHORITY_MATRIX.md`
- `annex/ARCHITECTURE_TO_CODE_MAPPING_AUTHORITY.md`
- `annex/PRODUCTION_DATA_MODEL_AUTHORITY.md`
- `annex/RELEASE_GATE_DEFINITIONS.md`

## Retained-beneath documents (v0.3.x, archived but referenced)

Akari v0.2, Hinata v0.2, Nightly SOP v0.2, OpenClaw/Hermes v0.3, Agent Contract v0.1, register
templates v0.3, Recommendation/Matching v0.3, Content/Methodology v0.3, Concept/Pre-Commerce v0.3,
Demand Intelligence v0.3, Participation/Reward v0.3, Stakeholder Communication v0.3.1 — archived
at `resources/governance/archive/v0.3.3/`; these continue to apply where not contradicted, per
the migration matrix.

## Non-negotiable invariants (restated)

Six Core Systems only · Consent Layer cross-cutting, not a system · Founder Dashboard not a
product center · Calm Emotional Companionship is the core identity · tests/reports subordinate ·
social/UGC deferred+constrained · no old-data reinterpretation as memory/consent ·
ConfirmedMemory ≠ UsePermission · deleted-memory resurfacing = CRITICAL · synthetic evidence
never claimed as human/market validation.

## Resource rule

Only files in this `current` directory may be used as active governance. Superseded and archived
copies must not remain active beside this release.
