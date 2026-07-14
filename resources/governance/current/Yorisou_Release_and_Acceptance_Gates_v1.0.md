# YORISOU Release and Acceptance Gates v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Make the seven-gate system binding for all production change.

## 2. Scope
All governance activation, implementation, migration, merge, release, verification, rollback.

## 3. Binding rules
1. The seven gates (Governance Activation; Production Implementation per package; Migration per schema change; PR Merge; Production Release; Post-Release Verification; Rollback) are defined in the binding annex `annex/RELEASE_GATE_DEFINITIONS.md`.
2. No gate may be skipped; the only emergency path is kill-switch-first with same-day retroactive gate processing.
3. Gate results are recorded with evidence bundles; failed gates route to Rollback Gate.
4. Kill switches must be live-tested at every Production Release Gate before exposure.
5. Consent-comprehension copy is verified verbatim against the accepted validated build at B/C releases.

## 4. Prohibited behavior
Skipping gates; merging without Edward; releasing without live kill-switch test; evidence-free gate passage.

## 5. Decision authority
Gate definition changes: Edward.

## 6. Required evidence
Gate records + evidence bundles per gate.

## 7. Exceptions
Emergency path as stated in rule 2 only.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
New document; extends the release discipline previously implicit in v0.3.3's PR practice into explicit law.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
