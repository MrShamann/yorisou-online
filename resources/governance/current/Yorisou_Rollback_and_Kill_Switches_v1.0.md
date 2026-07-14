# YORISOU Rollback and Kill Switches v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Guarantee every risky capability has a tested off-switch and a data-safe rollback.

## 2. Scope
All production kill switches, feature flags, and rollback procedures.

## 3. Binding rules
1. Mandatory kill switches from Phase A: memory_read_kill (stops all memory reads product-wide), notify_kill, provider_kill — extending the existing Agent Runtime pause/kill pattern; toggles are logged and Founder-controlled (automatic triggers per Incident Response).
2. Feature flags per phase (companion_v1, memory_v1, legacy_social, notify_v1, dashboard_prod_v1) with defaults preserving current behavior.
3. Rollback never deletes user data and never lowers protective trust states; flags-off is the first rollback tool, revert second, snapshot restore last (with documented RPO).
4. Every phase package ships its rollback plan; rollback rehearsal on staging is a Migration Gate item.
5. Governance rollback: v0.3.3 restore runbook (installation set 03_) is the tested path.

## 4. Prohibited behavior
Untested kill switches; rollbacks that touch protective states or user data; flagless risky features.

## 5. Decision authority
Kill-switch policy: Edward; automatic triggers per Incident Response.

## 6. Required evidence
Live-test records at release gates; rollback rehearsal logs.

## 7. Exceptions
None.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
New document; generalizes the kill-switch capability already implemented in the Agent Runtime (v0.3.3 baseline) to product scope.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
