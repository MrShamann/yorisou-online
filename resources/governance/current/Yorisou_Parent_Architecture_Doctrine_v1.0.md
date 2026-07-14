# YORISOU Parent Architecture Doctrine v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Make the frozen Parent Architecture (Core V1.1 + Consent V1.2 + Freeze Packet V1.2r) the binding structural law of implementation.

## 2. Scope
All system design, data modeling, service boundaries, and agent behavior.

## 3. Binding rules
1. Exactly six Core Systems as named in the Constitution; the canonical object map of Freeze Packet V1.2r is the term authority (CompanionIdentity, Interaction Mode, Familiarity State, OperatingCondition, CompanionSharedHistory, MemoryCandidate, ConfirmedMemory, UsePermission, ContextHypothesis…).
2. Relationship Engine and Memory & Archive Engine are parallel parent engines; neither may absorb the other.
3. ContextHypothesis is never treated as confirmed fact; ConfirmedMemory is usable only through UsePermission overlays.
4. OperatingCondition values NORMAL / QUIET_PERIOD / LIMITED_PERMISSION / REPAIR_REQUIRED / PAUSED govern all proactive behavior; production implementations map the validated two-axis state model onto these.
5. Architecture changes require a new Freeze decision by Edward; implementation may refine below the frozen level but never contradict it.

## 4. Prohibited behavior
Adding parent engines/layers; merging engines; bypassing UsePermission overlays; treating hypotheses as facts; architecture drift via implementation convenience.

## 5. Decision authority
Freeze-level changes: Edward. Sub-freeze refinements: change-managed with architecture-consistency review.

## 6. Required evidence
Architecture-consistency check at every phase gate against the freeze sources (Phase 0 audit copies are the recovery reference).

## 7. Exceptions
None at freeze level.

## 8. Change control
Change Management v1.0 plus a new Founder freeze decision for frozen elements.

## 9. Relationship to predecessor documents
Elevates the approved Design Freeze (recorded 2026-07-13 lineage) into governance. No v0.3.x predecessor existed; conflicts with old capability map resolved by superseding it.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
