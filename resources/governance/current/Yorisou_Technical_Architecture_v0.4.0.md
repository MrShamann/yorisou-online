# YORISOU Technical Architecture v0.4.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Fix the technical implementation-of-record and its extension boundaries.

## 2. Scope
Runtime, hosting, data, agents, and service architecture of yorisou-online.

## 3. Binding rules
1. Implementation-of-record (evidence-anchored, continuing v0.3.3 baseline): Next.js App Router on Vercel (production host of record); Supabase/PostgreSQL (yorisou-production); AWS S3 stores; YORISOU Agent Runtime (durable task queue) and Provider Harness — both CURRENT_REQUIRED.
2. New Core System services extend, not replace, this stack; service boundaries follow the architecture-to-code mappings (binding annex `annex/ARCHITECTURE_TO_CODE_MAPPING_AUTHORITY.md`).
3. One shared permissionCheckService is the only memory read path; memoryLifecycleService the only write path; audit_event infrastructure is append-only.
4. Schema changes are additive-only unless a Founder-signed exception; every migration has a rehearsed down-path or documented irreversibility.
5. The governance pack in resources/governance/current/ is runtime-validated via governance-checksums.json; any pack change ships regenerated checksums in the same PR.

## 4. Prohibited behavior
Second sources of truth for permission logic; destructive migrations without sign-off; new external services without AI/Provider or privacy review; disabling runtime governance validation.

## 5. Decision authority
Stack-level changes: Edward. Service-level: change-managed with architecture review.

## 6. Required evidence
Implementation Baseline amendments with evidence anchors per phase.

## 7. Exceptions
Emergency hotfix path exists but must pass the Rollback Gate retroactively same-day.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
Succeeds Technical_Architecture_and_Execution_Protocol_v0.3.1 (RETAIN_WITH_AMENDMENT): all implementation-of-record statuses retained; adds Core System service boundaries and consent-data rules.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
