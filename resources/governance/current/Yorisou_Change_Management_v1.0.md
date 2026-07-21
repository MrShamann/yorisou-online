# YORISOU Change Management v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Single procedure for changing any governed thing.

## 2. Scope
Governance documents, gates, thresholds, roles, retention schedules, architecture refinements.

## 3. Binding rules
1. Change classes: CONSTITUTIONAL (Edward only, decision record, pack re-release) / GOVERNED-DOCUMENT (proposal → required reviews → Edward approval → pack amendment with regenerated checksums, prior text archived) / OPERATIONAL (delegable per Founder Authority, still recorded).
2. Every change states: what, why, evidence, affected documents, rollback of the change itself.
3. The pack is versioned; amendments append version history in-place; superseded texts archive, never delete.
4. Emergency changes follow the kill-switch-first rule with same-day records.
5. This document itself changes only as CONSTITUTIONAL class.

## 4. Prohibited behavior
Unrecorded changes; direct edits to effective governance without checksum regeneration; deletion of superseded text.

## 5. Decision authority
Per change class as stated.

## 6. Required evidence
Decision records; pack version history; checksum PRs.

## 7. Exceptions
None.

## 8. Change control
Self-governed (CONSTITUTIONAL class).

## 9. Relationship to predecessor documents
New document; formalizes the amendment mechanism proven by the v0.3.3 Evidence Amendment.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
