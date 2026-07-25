# YORISOU Agent Execution Authority Matrix (Binding Annex) v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Annex of:** `Yorisou_Agent_Roles_and_Execution_Authority_v1.0.md` · **Approver:** Edward

This annex is binding effective governance. If it conflicts with a v0.4.0 primary governance
document, the primary document outranks this annex. This annex authorizes nothing beyond
Package A; Packages B–G require future per-package Founder authorizations.

## Authority matrix

| Action | Claude Code | Codex | Edward | Akari/Hinata (runtime) |
|---|---|---|---|---|
| Audits, analysis, local capability packages | EXECUTE | — | ACCEPT | — |
| Governance drafting/preparation | EXECUTE | — | APPROVE/ACTIVATE | — |
| Repository analysis (read-only) | EXECUTE | — | — | — |
| Implementation planning and briefs | EXECUTE | — | APPROVE | — |
| Isolated non-production validation systems | EXECUTE | — | ACCEPT | — |
| Approved repository changes: code, migrations, tests, evidence, PRs | **EXECUTE (within the Founder-authorized package and scope only)** | not authorized this cycle | AUTHORIZE + MERGE | — |
| Governance activation | PROHIBITED | PROHIBITED | **sole** | — |
| PR merge | PROHIBITED | PROHIBITED | **sole** | — |
| Production release / rollback trigger | PROHIBITED | PROHIBITED | **sole** | kill-switch auto-triggers allowed within governed rules |
| Scope changes to an authorized package | PROHIBITED | PROHIBITED | **sole** | — |
| Production runtime task execution | — | — | oversight | EXECUTE within Agent Runtime governance |
| Research launch / participant contact | PROHIBITED | PROHIBITED | **sole** | PROHIBITED |

Precedence: Edward > governance pack > package authorization > agent discretion (none for
production). Any action not listed = PROHIBITED until added via Change Management v1.0.

## Current execution-cycle authorization state

1. Claude Code is the current authorized implementation agent: authorized to implement approved
   repository changes; authorized to create migrations, tests, evidence and pull requests;
   limited strictly to the Founder-authorized package and scope.
2. Edward (Founder) authorizes governance activation; authorizes implementation packages;
   approves merges; authorizes production releases; authorizes rollback and scope changes.
3. Codex has no authorization in the current Package A execution; it may only participate under
   a separate future Founder authorization.
4. Package A is authorized. Packages B–G are not authorized. Production release is not
   authorized; it remains separately gated by `annex/RELEASE_GATE_DEFINITIONS.md` and
   `Yorisou_Release_and_Acceptance_Gates_v1.0.md`.
