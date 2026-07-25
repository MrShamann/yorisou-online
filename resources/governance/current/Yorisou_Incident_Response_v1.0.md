# YORISOU Incident Response v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Define production incident classes and mandatory responses.

## 2. Scope
All production incidents affecting users, data, trust, or availability.

## 3. Binding rules
1. Classes: CRITICAL (deleted-memory resurfacing; deletion failure; consent mismatch; data corruption; unauthorized access) / HIGH (provider hallucination; LINE boundary breach; protective-state malfunction) / MEDIUM / LOW.
2. CRITICAL: automatic protective response where defined (LMM for affected users; kill-switch evaluation), Founder notification same day, user notification where the user is affected in a way they can act on, incident record with evidence, root-cause before retry.
3. Deleted-memory resurfacing is ALWAYS CRITICAL — no reclassification permitted.
4. Every incident links to gate/rollback records; recurring incidents trigger change-management review of the underlying rule.
5. Honest-communication rule: incident descriptions state what happened plainly; no euphemism in user-facing notices.

## 4. Prohibited behavior
Silent incident closure; reclassifying resurfacing; retry before root cause on CRITICAL.

## 5. Decision authority
Response-policy changes: Edward.

## 6. Required evidence
Incident records; queue SLA metrics; post-incident reviews.

## 7. Exceptions
None on CRITICAL floors.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
New document; production analogue of the validated incident semantics (gate G-CB1/G-F4 lineage).

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
