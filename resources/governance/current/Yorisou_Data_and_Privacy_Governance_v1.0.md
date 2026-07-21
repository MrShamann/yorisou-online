# YORISOU Data and Privacy Governance v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
General data law for everything beyond the Consent Layer's personal-context scope.

## 2. Scope
All data collection, storage, processing, retention, and access.

## 3. Binding rules
1. Data minimization: collect only what a governed feature needs; broad bands over precise values where possible.
2. Retention schedules are explicit per entity (data model tables) and require Edward's approval; expiry is enforced, not aspirational.
3. Access follows least privilege; Founder Dashboard access rules per its governance; every access to user-linked data is audited.
4. Test-product data keeps its existing consent basis and NEVER crosses into companion memory (hard rule, restated).
5. No third-party analytics, ad tech, or data sale. First-party aggregates only.
6. Backups are enumerated, encrypted, and included in deletion reconciliation.

## 4. Prohibited behavior
Silent scope creep of collection; shadow copies; analytics vendors; cross-purpose reuse without new consent.

## 5. Decision authority
Retention and category changes: Edward with privacy review.

## 6. Required evidence
Retention enforcement logs; deletion reconciliation; access audit samples at phase gates.

## 7. Exceptions
Legal-hold style exceptions require documented Founder decision.

## 8. Change control
Change Management v1.0 + privacy review.

## 9. Relationship to predecessor documents
Succeeds the general-privacy half of Data_Privacy_Consent_and_Social_Visibility_Governance_v0.3.1 (personal-context half → Consent Governance v1.0; social-visibility clauses archived).

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
