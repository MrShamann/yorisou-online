# YORISOU Recommendation and Reflection Governance v1.0 (Core System 4)

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Govern reflection sessions and governed recommendations.

## 2. Scope
reflectionService, recommendationGraph (existing), any surface referencing memories or suggesting resources.

## 3. Binding rules
1. Reflection may reference only memories passing the full eligibility rule: confirmed + reflection permission + permitting relationship condition (validated rule, verbatim).
2. Provider-generated reflection content must reference only supplied permitted memories (structured-output validation + reference whitelist; hallucination = HIGH incident).
3. Recommendations remain governed by the existing resource-matching policy (retained), plus: recommendations may use memory signals only with reflection-grade permission.
4. Users can hide any recommendation and see why it appeared.
5. No recommendation may be commercial placement disguised as reflection (see Revenue & Ethics).

## 4. Prohibited behavior
Ungoverned generative output; memory-based targeting without permission; undisclosed sponsorship.

## 5. Decision authority
Rule changes: Edward. Graph content: change-managed per the retained matching policy.

## 6. Required evidence
permission_check_ref on every reference; provider logs; hide-rate on dashboard.

## 7. Exceptions
None.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
Merges AI_Usage_and_Recommendation_Governance_v0.3 (MERGE) with Consent-Layer constraints; Recommendation_and_Resource_Matching_Policy_v0.3 is retained beneath it (amended).

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
