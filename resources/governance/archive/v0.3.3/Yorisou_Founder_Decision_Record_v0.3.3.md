# Yorisou Founder Decision Record v0.3.3

**Status:** Approved  
**Approved Date:** 2026-07-11  
**Owner / Approver:** Edward

## Decisions recorded

- **D-0333-01 — Governance evidence amendment.** YORISOU governance is amended to v0.3.3 as one coherent release recording the verified implementation-of-record (see `Yorisou_Current_Implementation_Baseline_v0.3.3.md`). Product judgment, scoring, persona, approval, isolation, and data rules are unchanged.
- **D-0333-02 — Runtime attribution.** The YORISOU Agent Runtime and Provider Harness implemented inside `yorisou-online` are the current required execution and provider layers for YORISOU. The OpenClaw task runtime is superseded for YORISOU task execution; OpenClaw as a platform is not declared obsolete.
- **D-0333-03 — Voice bridge.** The OpenClaw Voice bridge remains CURRENT_OPTIONAL with health unverified. Activation, retirement, or migration requires a separate founder decision.
- **D-0333-04 — Hermes.** No separate Hermes runtime is confirmed or required. The Hermes harness role is fulfilled by the YORISOU Provider Harness. Any future separate Hermes deployment requires a new approved decision.
- **D-0333-05 — Shared provider credentials.** Temporary account-level provider credential sharing across projects remains approved. Runtime context sharing remains prohibited. Credential storage hardening and rotation are scheduled separately and are not part of this release.
- **D-0333-06 — Repository hygiene.** Deletion of 47 automated test repositories and of merged, revalidated branches in `yorisou-online` and `mirai-move` is approved under fail-closed verification. OpenClaw branches are excluded.
- **D-0333-07 — Legacy configuration.** The five OpenClaw knowledge-sidecar production configuration names are recorded as LEGACY_CONFIG / ZERO_CODE_REFERENCE. Their removal is a separate, later action and is not performed by this release.

## Boundaries reaffirmed

- Codex remains the sole formal production-code execution Agent for YORISOU.
- Shigeru remains exclusive to Mirai Move.
- YORISOU and Mirai Move remain isolated at runtime (`project_id = yorisou`).
