# YORISOU AI and Provider Governance v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Govern all model/provider use.

## 2. Scope
Provider Harness, model routing, prompts, outputs, and provider data handling.

## 3. Binding rules
1. All model calls route through the Provider Harness (structured-output validation, retry, fallback, cost/latency metadata) — no direct provider calls.
2. Prompts containing personal context may include ONLY permitted memories (whitelist enforcement); provider accounts remain shared-credential per approved baseline, with project isolation of runtime context.
3. No user content is used to train models; provider data-retention settings must reflect this where controllable.
4. Provider output referencing non-supplied content is a HIGH incident (hallucination guard).
5. Provider kill switch (provider_kill) can disable generation product-wide.

## 4. Prohibited behavior
Direct provider calls; sending unpermitted memory content; silent provider changes; training on user data.

## 5. Decision authority
Provider/routing changes: change-managed with AI review; kill-switch policy: Edward.

## 6. Required evidence
Harness logs, validation stats, incident records.

## 7. Exceptions
None on data rules.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
Merges the AI-usage half of AI_Usage_and_Recommendation_Governance_v0.3 with harness rules from the Agent OS blueprint (both retained beneath as history).

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
