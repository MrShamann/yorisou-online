# YORISOU Release Gate Definitions (Binding Annex) v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Annex of:** `Yorisou_Release_and_Acceptance_Gates_v1.0.md` · **Approver:** Edward

This annex is binding effective governance. If it conflicts with a v0.4.0 primary governance
document, the primary document outranks this annex. This annex authorizes nothing beyond
Package A; Packages B–G and production release require their own future Founder authorizations.

## Gate 1 — Governance Activation Gate

Pass requires ALL: Founder-signed/recorded activation decision; the v0.4.0 pack complete and
installed in `resources/governance/current/`; runtime checksums regenerated and validated in the
activation PR; v0.3.3 archived (not deleted) at `resources/governance/archive/v0.3.3/`; conflict
decisions recorded; the agent-authority matrix (`annex/AGENT_EXECUTION_AUTHORITY_MATRIX.md`)
accepted; no open BLOCKING review item. Output: activation record + baseline amendment.

## Gate 2 — Production Implementation Gate (per package)

Pass requires: governance active; the package AUTHORIZED_FOR_EXECUTION (Founder-recorded); scope
frozen; architecture-consistency check against `annex/ARCHITECTURE_TO_CODE_MAPPING_AUTHORITY.md`;
privacy check against `annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` including the hard rule that no
existing user data is reinterpreted as memory or consent; dependencies (prior phases) accepted;
rollback plan reviewed. No code before this gate.

## Gate 3 — Migration Gate (per schema change)

Pass requires: additive-only verified (or documented exception + Founder sign-off); up/down
tested on a staging copy; data-integrity assertions (row counts, FK orphans = 0); NO
reinterpretation of existing user data (explicit checklist item, evidence attached); backup
snapshot reference recorded.

## Gate 4 — PR Merge Gate (every PR)

Pass requires: package-scope audit (no out-of-scope diff); unit + integration + browser tests
green in CI; permission-matrix suite green (Package B onward); no external endpoint introduced
(scan); no credential in diff; Migration Gate (if schema); reviewer = Edward (merge authority is
his alone); evidence links in the PR description.

## Gate 5 — Production Release Gate (per phase activation)

Pass requires: staged rollout plan (flag percentage or cohort); kill switches tested LIVE
(toggle + verify) before exposure; consent-comprehension copy verified verbatim against the
accepted build (Packages B/C); security pass (authorization on all new endpoints); Founder
acceptance recorded; support/ops note written.

## Gate 6 — Post-Release Verification Gate (within 48h of exposure)

Pass requires: production smoke script green; audit events flowing and sampled; zero
resurfacing-detector hits (Package D onward); error budget respected; no unresolved CRITICAL
incident; baseline amendment merged. Fail → Gate 7.

## Gate 7 — Rollback Gate

Trigger: failed Post-Release Verification Gate, CRITICAL incident, or Founder decision. Pass
requires: flag-off or revert executed; user-data integrity verified post-rollback (no orphaned
consent/memory rows); protective states preserved (never rolled back); incident record + evidence
bundle; root-cause task opened before any retry.

## Common rules

No gate may be skipped; the only emergency path is kill-switch-first with same-day retroactive
gate processing. Gate results are recorded with evidence bundles under
`resources/governance/evidence/`. Gate definition changes: Edward only, via Change Management v1.0.
