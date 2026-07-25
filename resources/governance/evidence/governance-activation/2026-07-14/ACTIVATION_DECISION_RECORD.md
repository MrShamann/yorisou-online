# Governance Activation Decision Record — PR-1 (v0.4.0)

**Date:** 2026-07-14
**Authority:** Edward (Founder)

## Authorization

Edward authorized the execution of Package A PR-1 (Governance Activation) by direct Founder
instruction on 2026-07-14, under task
`YORISOU_PACKAGE_A_PR1_GOVERNANCE_ACTIVATION`. The authorization covers PR-1 only: governance
installation, archive, validation, and supporting governance tests. Activation becomes
governance-effective only when Edward merges PR-1 into `main`; opening the PR is authorized,
merging it is reserved to Edward.

## Source package

`YORISOU_FINAL_GOVERNANCE_INSTALLATION_AND_PACKAGE_A_AUTHORIZATION_V1`
SHA-256 `34a9fa175add0a0374a7fa6537fd17522bce1d4ebd6c4f7f57684862b4a6124b`
Top-level SHA256SUMS: 52/52 PASS · governance-pack SHA256SUMS: 30/30 PASS (verified 2026-07-14).

## Agent-authority correction (Founder-directed)

The audited package's proposed v0.4.0 documents named Codex as the sole production-code executor.
By Founder direction of 2026-07-14, the effective v0.4.0 governance is corrected before
activation, and the corresponding checkbox model of the unsigned
`FOUNDER_FINAL_GOVERNANCE_AND_PACKAGE_A_DECISION` document (including its
`AUTHORIZE_CODEX_PACKAGE_A` authorization line) is superseded by this record:

- **Claude Code** — authorized to implement approved repository changes; authorized to create
  migrations, tests, evidence and pull requests; limited strictly to the Founder-authorized
  package and scope.
- **Edward** — authorizes governance activation; authorizes implementation packages; approves
  merges; authorizes production releases; authorizes rollback and scope changes.
- **Codex** — has no authorization in the current Package A execution; may only participate
  under a separate future Founder authorization.

Historical archived v0.3.3 files retain their original text as historical evidence.

## Scope state at this decision

- Package A: authorized (PR-1 execution now; PR-2…PR-6 pending separate Founder go-ahead).
- Packages B–G: NOT authorized.
- Production release: NOT authorized (separately gated by the Release Gates).
