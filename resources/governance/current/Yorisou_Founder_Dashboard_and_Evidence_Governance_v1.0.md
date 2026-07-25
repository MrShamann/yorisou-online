# YORISOU Founder Dashboard and Evidence Governance v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Govern the Founder's operations/evidence surface and all evidence handling.

## 2. Scope
Validation-mode dashboard (isolated system), production-mode dashboard (Phase F), evidence stores.

## 3. Binding rules
1. Classifications preserved: FOUNDER_OPERATIONS_AND_EVIDENCE_SURFACE; NOT a Core System, parent engine, or user-facing product center.
2. Production mode is minimum-access: aggregates and pseudonymized queue items; raw memory content visible only per-incident, per-item, logged.
3. Every dashboard access to user-linked data writes an audit event; access logs reviewed at least weekly.
4. CRITICAL incidents surface within one operational day and cannot be dismissed without a recorded decision.
5. Evidence discipline: every gate and release stores its evidence bundle with checksums; synthetic evidence is always labeled as such.

## 4. Prohibited behavior
Unrestricted raw-data views; unaudited access; using the dashboard as a product surface; deleting evidence.

## 5. Decision authority
Access-model changes: Edward.

## 6. Required evidence
Access audit events; evidence bundles per gate.

## 7. Exceptions
None.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
New document; absorbs dashboard aspects previously implicit in admin practice; validated dashboard (V1.1 system) remains the design reference for the production subset.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
