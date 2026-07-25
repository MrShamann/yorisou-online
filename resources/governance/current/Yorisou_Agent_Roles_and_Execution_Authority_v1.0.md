# YORISOU Agent Roles and Execution Authority v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Drafted:** 2026-07-13 · **Approved as activation candidate:** 2026-07-14 · **Approver:** Edward

## 1. Purpose
Fix who may do what, permanently removing execution ambiguity.

## 2. Scope
Edward, Claude Code, Codex, Akari, Hinata, and any future agent.

## 3. Binding rules
1. The Agent Execution Authority Matrix (binding annex `annex/AGENT_EXECUTION_AUTHORITY_MATRIX.md` of this pack) is binding; default is PROHIBITED for unlisted actions.
2. Claude Code: authorized to implement approved repository changes; authorized to create migrations, tests, evidence and pull requests; limited strictly to the Founder-authorized package and scope; bound by package prohibited-lists and the no-reinterpretation rule; also performs audit, analysis, governance preparation, planning, and isolated non-production validation systems.
3. Codex: has no authorization in the current Package A execution; may only participate under a separate future Founder authorization.
4. Edward: authorizes governance activation; authorizes implementation packages; approves merges; authorizes production releases; authorizes rollback and scope changes; sole authority for research launch.
5. Akari (platform orchestration) and Hinata (user intelligence/companion) operate within Agent Runtime governance and this document; retained role specs v0.2 continue beneath it.
6. OpenClaw/Hermes statuses continue per the retained v0.3 skill-governance document.

## 4. Prohibited behavior
Role self-expansion; repository or production action by any agent outside a Founder-authorized package and scope; merge, release, or rollback execution by any agent; agents editing effective governance outside Founder-approved change management.

## 5. Decision authority
Role changes: Edward only.

## 6. Required evidence
Package authorization records; PR authorship audit; agent contract records (retained standard v0.1).

## 7. Exceptions
None.

## 8. Change control
Change Management v1.0.

## 9. Relationship to predecessor documents
Succeeds the execution-authority clauses of Agent_Operating_System_Execution_Blueprint_v0.3 (blueprint retained for runtime mechanics); Akari/Hinata/OpenClaw docs retained beneath.

## 10. Effective status
Approved (v0.4.0 activation candidate, 2026-07-14). This document is installed on the
activation branch and becomes governance-effective on main at the moment Edward merges PR-1
(`Governance: activate YORISOU governance pack v0.4.0`). Until that merge, v0.3.3 — archived
byte-for-byte at `resources/governance/archive/v0.3.3/` — remains the effective governance.
