# YORISOU Personal Archive and Memory Governance v1.0 (Core System 3)

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Govern the memory lifecycle implementation of the Consent Layer law.

## 2. Scope
Memory entities, services, surfaces, and any feature reading or displaying memories.

## 3. Binding rules
1. The 18-entity production data model (binding annex `annex/PRODUCTION_DATA_MODEL_AUTHORITY.md`) is the design authority; memoryLifecycleService is the sole write path; permissionCheckService the sole read gate.
2. Users can always: view state, correct, suppress, revoke, delete — each with visible confirmation and (for deletion) a receipt.
3. Unconfirmed MemoryCandidates expire (proposed 30 days) and are hard-deleted.
4. Memory content is never used for advertising, profiling beyond the product's own governed features, model training, or sale — categorically.
5. The resurfacing detector runs at every read; a hit is a CRITICAL incident (Incident Response v1.0).

## 4. Prohibited behavior
Bulk memory reads; agent/system writes to memory; retention beyond schedule; any secondary use of memory content.

## 5. Decision authority
Data-model changes: Edward with privacy review.

## 6. Required evidence
Lifecycle audit events; deletion receipt reconciliation; zero-resurfacing monitor.

## 7. Exceptions
None.

## 8. Change control
Change Management v1.0 + privacy review.

## 9. Relationship to predecessor documents
Implements Consent Governance v1.0 for Core System 3; no direct v0.3.x predecessor (new capability).

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
