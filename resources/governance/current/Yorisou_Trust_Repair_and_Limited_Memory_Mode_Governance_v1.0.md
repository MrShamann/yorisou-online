# YORISOU Trust Repair and Limited Memory Mode Governance v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Make protective trust behavior mandatory product law.

## 2. Scope
trust incidents, repair flows, Limited Memory Mode, permanent restriction, and their production automation.

## 3. Binding rules
1. Protective transitions are automatic and mandatory: one unresolved critical incident OR two unresolved incidents → Limited Memory Mode (proactive memory use stops); repeated repair failure → permanent restriction (validated machine, normative).
2. Protective states are ratchets: they may never be rolled back by deployment rollback, only resolved through the governed repair path (or Founder review for restriction reversal).
3. Repair language accepts responsibility plainly (validated copy: 「この記憶の出し方が、少し踏み込みすぎていました。」-grade); no blame-shifting to the user.
4. Deleted-memory resurfacing: automatic LMM for the affected user + CRITICAL incident + kill-switch evaluation + Founder queue within one operational day.
5. Users always retain view/correct/delete controls inside protective states.

## 4. Prohibited behavior
Weakening protective transitions for UX or metric reasons; silent repair; dismissing critical incidents without recorded decision.

## 5. Decision authority
Threshold changes: Edward with trust-review evidence.

## 6. Required evidence
Incident, repair, and state-transition audit events; queue SLA metrics.

## 7. Exceptions
None on protective floors.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
New document; elevates the validated trust state machine (Phase 1.2 accepted; gate G-CB1 semantics) into governance.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
