# YORISOU Consent-Based Personal Context Governance v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Bind the Consent Layer V1.2 doctrine as the cross-cutting law of all personal-context handling.

## 2. Scope
Every system, service, surface, and agent that touches user personal context.

## 3. Binding rules
1. Lifecycle law: capture → MemoryCandidate (reviewable, expiring if unconfirmed) → ConfirmedMemory (accepted content) → separate purpose-scoped, revocable UsePermission → correction / suppression / revocation / deletion with receipts.
2. **ConfirmedMemory and UsePermission remain separate**; saving never implies use; permission checks occur at every read via one shared service.
3. Deletion is honored absolutely inside YORISOU; deletion receipts are content-free; **deleted-memory resurfacing is a CRITICAL production incident** triggering automatic protective response (see Trust Repair governance and Incident Response).
4. **No existing or historical user data (tests, results, chats, LINE history, private-AI state) is ever interpreted, converted, migrated, or backfilled into memory or consent records.** Companion memory begins empty for every user.
5. Consent-bearing actions occur on Web surfaces only; nothing consent-relevant happens silently in LINE.
6. No external-source memory ingestion (connectors) exists or may be added without a new Founder decision and its own governance amendment.

## 4. Prohibited behavior
Implied consent; bundled consent; consent by inactivity; monetization of consent; reinterpretation of old data; bulk memory read APIs; agent writes to memory.

## 5. Decision authority
Consent-model changes: Edward only, with privacy review.

## 6. Required evidence
Audit event for every consent-relevant mutation; deletion receipts; permission-check references on every memory reference.

## 7. Exceptions
None. This document has no exception path.

## 8. Change control
Change Management v1.0 with mandatory privacy review.

## 9. Relationship to predecessor documents
Succeeds Data_Privacy_Consent_and_Social_Visibility_Governance_v0.3.1 for personal-context matters (SUPERSEDE); social-visibility clauses archived with the UGC deferral. Elevates Consent Layer V1.2 (frozen source) into governance.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
