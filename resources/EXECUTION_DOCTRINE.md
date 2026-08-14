# YORISOU Project Execution Doctrine

**Version:** v1.1  
**Status:** Execution discipline / anti-drift standard  
**Owner:** Edward  
**Scope:** Project contributors, implementation agents, Codex, Claude Code, automation, and any future agent or collaborator  
**Effective role:** Operational guidance only; this document does not create governance authority or grant execution permissions.

---

## 0. Authority, precedence, and non-authority clause

This document is **not** the YORISOU Project Constitution and is **not** part of the active governance pack unless it is separately adopted through the effective governance change process.

The active governance source of truth is:

`resources/governance/current/`

If this document conflicts with any effective YORISOU governance document, Founder authorization, release gate, safety rule, privacy rule, consent rule, incident rule, or execution-authority rule, the higher-authority source wins and this document must be corrected.

This document defines **how authorized work should be executed**. It does not define who is authorized to act.

> **Capability is not permission. Access is not authorization.**

Repository write access, shell access, cloud credentials, browser sessions, API keys, production credentials, tool availability, model capabilities, or the technical ability to perform an action do not by themselves authorize that action.

Before any write, deployment, migration, merge, release, rollback, destructive operation, or production action, the actor must resolve its current authorization under the effective Agent Execution Authority and Founder-authorized scope.

---

## 1. Highest execution objective

The primary execution objective is not to make the project appear complete. It is to make authorized core capabilities work reliably in the intended real environment and to produce verifiable evidence of that fact.

Every implementation, modification, refactor, test, deployment, investigation, or design task should be able to explain how it advances an authorized project objective.

Work that cannot explain this connection is presumed lower priority unless separately authorized.

---

## 2. Authorized truth vs observed truth

Two different forms of truth must never be confused.

### 2.1 Authorized truth

Authorized truth defines what the system **is allowed and expected to do**.

Priority order:

1. Effective governance and Founder-authorized constraints
2. Approved contracts, specifications, release gates, and safety/privacy/consent requirements
3. Authorized implementation
4. Runtime behavior

If runtime behavior violates effective governance or an approved contract, the runtime is not automatically correct. It is a **runtime deviation, defect, drift, or incident**.

### 2.2 Observed truth

Observed truth defines what the system **is actually doing now**.

For claims about current behavior, prefer direct runtime evidence over assumptions from code or documentation.

A code path that exists but has not been demonstrated in the target environment is not evidence that the capability is running.

A document that says a capability exists is not evidence that it currently works.

---

## 3. Capability-state model

Use explicit states. Do not collapse design, code, deployment, and real operation into one label.

- **PLANNED** — requirement or idea exists; implementation has not begun.
- **DESIGNED** — architecture, interface, or workflow is defined; implementation is incomplete or absent.
- **IMPLEMENTED** — relevant code exists and passes the task's implementation checks; target integration is not yet proven.
- **INTEGRATED** — connected to the intended surrounding system and validated in an integration environment.
- **DEPLOYED** — deployed to the named target environment; successful behavior is not yet proven.
- **VERIFIED** — exercised in the named environment with sufficiently recent evidence and expected results.
- **DEGRADED** — capability works partially or unreliably.
- **BLOCKED** — a known blocker prevents required execution or verification.
- **DISABLED** — implementation exists but is intentionally unavailable through feature flag, kill switch, permissions, configuration, or policy.
- **RETIRED** — capability previously existed but is intentionally no longer supported.

Never report a historical success as proof of current `VERIFIED` status without checking that the evidence still applies to the current environment and deployed version.

---

## 4. Priority order

When priorities conflict, use the following default ordering unless effective governance specifies otherwise:

1. Effective governance and Founder authorization
2. User safety, dignity, consent, privacy, and legal/security constraints
3. Data integrity and incident containment
4. Production correctness and recoverability
5. Core runtime reliability
6. Core user execution loop
7. Authorized feature expansion
8. UX/UI refinement
9. Architectural elegance and optimization
10. Presentation, packaging, and speculative future infrastructure

A safety, privacy, consent, security, or data-integrity issue may interrupt the current task even if it is not the original blocker.

---

## 5. Current execution posture

Unless the Founder explicitly changes the priority, prefer the following sequence:

### P0 — Audit the real operating state

Determine what is actually deployed and running, which agent/tool paths execute, where the current blockers are, and which claimed capabilities are only implemented, designed, or planned.

### P1 — Establish the shortest safe real execution loop

Prioritize a complete, evidence-backed path:

`User input → authorized agent decision → authorized tool/action → real result → evidence`

One working end-to-end capability is more valuable than many partially connected capabilities.

### P2 — Reliability and control

Prioritize error handling, observability, timeouts, retries where safe, permissions, state consistency, secrets/configuration correctness, rollback, kill switches, and failure-path clarity.

### P3 — Capability expansion

Add new tools, agents, providers, workflows, or integrations only after the relevant core path is stable enough to justify expansion.

### P4 — Product refinement

Improve UX, UI, visual polish, and broad front-end restructuring after the underlying behavior is trustworthy.

### P5 — Peripheral packaging

Patent packaging, promotional material, fundraising packaging, speculative scale architecture, and non-critical presentation work are lower priority unless explicitly authorized.

---

## 6. Shortest safe path principle

When several approaches can solve a problem, prefer the smallest reliable change that proves the intended capability **without violating governance, authorization, safety, privacy, consent, security, data integrity, release gates, or rollback requirements**.

Prefer the shortest **safe and authorized** path, not merely the shortest path.

Do not introduce complexity for hypothetical future needs without current evidence.

Default anti-patterns include:

- premature microservices
- premature multi-cloud architecture
- unnecessary abstraction layers
- speculative event systems
- premature Kubernetes adoption
- duplicated frameworks or parallel subsystems
- optimization without a measured bottleneck
- large refactors justified only by aesthetics
- infrastructure designed for unvalidated scale

---

## 7. Scope discipline

Every task should have one clearly testable core objective.

Do not silently expand the task.

Examples:

- Fixing a tool invocation does not authorize a full agent rewrite.
- Auditing an EC2 runtime does not authorize cloud migration.
- Fixing an API call does not authorize unrelated front-end redesign.

Larger problems discovered during execution should be recorded separately unless they are:

1. required to complete the authorized task safely, or
2. an S0/S1 issue that must interrupt the task.

> **Discovering a problem does not grant permission to modify it.**

---

## 8. Severity and interruption rules

Classify newly discovered issues:

- **S0 — Critical governance/safety/privacy/consent/security/data-integrity incident**  
  Immediate containment takes priority over the current task.

- **S1 — Production-critical failure or severe corruption/recoverability risk**  
  Escalate and contain promptly under the applicable incident/release rules.

- **S2 — Core execution blocker**  
  Prevents the authorized primary flow from completing.

- **S3 — Reliability defect**  
  Flow works but is unstable, degraded, or operationally unsafe to rely on.

- **S4 — Feature or UX defect**  
  Important but does not break core execution or critical controls.

- **S5 — Optimization / cleanup / speculative improvement**

Normal task focus rules do not override S0/S1 response obligations.

---

## 9. Agent execution protocol

Any AI agent participating in authorized work should use this sequence:

1. **Resolve Authority** — confirm what actions the agent is allowed to perform now.
2. **Resolve Scope** — identify the exact authorized objective and prohibited expansion.
3. **Inspect** — observe repository, runtime, configuration, evidence, and current state.
4. **Establish Baseline** — record what is working and failing before modification.
5. **Diagnose** — identify the narrowest evidence-supported cause.
6. **Define Minimal Change** — state the smallest safe modification that addresses the cause.
7. **Modify** — only if the current authority permits it.
8. **Test** — test the changed behavior at the appropriate layer.
9. **Verify** — verify the intended real behavior where authorized and applicable.
10. **Record Evidence** — preserve enough evidence for another reviewer to understand the result.
11. **Report Residual Risk** — explicitly state what remains unverified, degraded, blocked, or out of scope.

Do not skip authority resolution because a tool is technically available.

Do not skip inspection and jump directly to refactoring.

---

## 10. Verification hierarchy

Verification should match the claim being made.

For runtime capability claims, stronger evidence generally includes:

1. Real target-environment execution
2. End-to-end or integration verification
3. Direct API/tool invocation in the intended environment
4. Automated functional tests
5. Unit tests
6. Build/lint/static checks

Lower-layer tests cannot by themselves prove a higher-layer runtime claim.

`HTTP 200`, a screenshot, or a passing unit test may be useful evidence, but none alone proves end-to-end business correctness.

---

## 11. Evidence quality standard

Important evidence should identify, where applicable:

- environment
- timestamp
- deployed version / commit SHA / artifact identifier
- action performed
- expected result
- observed result
- evidence location
- reproduction method
- whether the evidence is real, synthetic, mocked, or manually assisted

Evidence must be sufficiently recent to support the claim being made.

A capability may not remain `VERIFIED` solely because it worked on an older deployment.

Never represent synthetic, mocked, staged, or manually completed behavior as live autonomous production behavior.

---

## 12. Completion and release states

Do not use one `DONE` label to mean implementation, production verification, and governance acceptance.

### Task completion

A task may be marked **TASK-DONE** when its authorized acceptance criteria are satisfied at the layer requested by the task.

Examples include implementation, test creation, documentation repair, analysis, or a validated migration script.

### Capability verification

A capability is **VERIFIED** only when the relevant behavior has been exercised in the named environment with acceptable evidence.

### Production acceptance

Production acceptance, release approval, merge approval, governance activation, and release-gate passage are separate states controlled by the effective YORISOU governance and release process.

> **TASK-DONE does not equal RELEASE-APPROVED.**  
> **DEPLOYED does not equal VERIFIED.**  
> **VERIFIED does not automatically equal GOVERNANCE-ACCEPTED.**

---

## 13. Incident and root-cause discipline

For normal defects:

`Diagnose root cause → minimal fix → regression verification`

For incidents or S0/S1 conditions:

`Contain / kill switch if required → preserve evidence → stabilize → root-cause analysis → permanent fix → regression verification → required incident/release records`

Do not delay containment merely to obtain a perfect root-cause explanation.

Do not let a temporary containment become a permanent architecture by accident.

---

## 14. Temporary workaround control

Any temporary workaround must include:

- label: `TEMPORARY`
- reason
- owner
- date introduced
- known risk
- removal condition
- review or expiry date where practical
- tracking issue or equivalent record

A workaround without a removal condition is presumed permanent technical debt and must be treated accordingly.

---

## 15. Refactoring rule

Do not perform unrelated or aesthetic refactors while solving a scoped problem.

A larger refactor is justified only when at least one of the following is true:

- the current defect cannot be safely fixed locally
- the existing structure is a demonstrated root cause
- a security, privacy, consent, data-integrity, or reliability requirement demands it
- the refactor is explicitly authorized as the task itself

Even then, scope the refactor to the smallest defensible boundary and re-verify affected core paths.

---

## 16. Dependency discipline

Before adding a material dependency, service, provider, model, or infrastructure component, evaluate:

- explicit problem solved
- why existing capabilities are insufficient
- runtime complexity
- security posture
- permissions and secrets required
- data processing and residency impact
- privacy/consent impact
- license and usage restrictions
- maintenance health
- supply-chain risk
- vendor lock-in and exit strategy
- upgrade burden
- observability
- cost
- new failure modes

Do not add a dependency when its marginal value does not clearly exceed its operational and governance burden.

---

## 17. Single-source-of-truth discipline

Do not invent multiple competing authorities.

At minimum:

- **Active governance:** `resources/governance/current/`
- **Execution discipline:** this file, subordinate to active governance
- **Runtime truth:** direct evidence from the actual named runtime/environment
- **Source implementation:** repository code at the identified commit/ref

Other project-specific registries or manifests may define tool registration, capability status, deployment state, or environment configuration, but their authority must be explicitly documented rather than assumed.

When sources disagree, first identify whether the disagreement is about authorized behavior or observed behavior, then resolve the drift instead of silently choosing the most convenient source.

---

## 18. Demo, mock, and synthetic behavior

Demos and mocks may be used when appropriate, but must be labeled accurately.

Forbidden behavior includes:

- hardcoding a fake success and presenting it as real execution
- hiding an error to manufacture a successful demo
- presenting mock data as real user or market data
- presenting human-assisted steps as autonomous agent execution
- representing staged or synthetic evidence as production validation

---

## 19. Product and governance drift detection

Treat the following as possible drift signals:

### Execution drift

- repeated feature work without real verification
- code capability greatly exceeding runtime capability
- frequent refactors without increased user capability
- increasing architecture complexity without measured need
- unresolved core-loop blockers while peripheral work expands

### Scope drift

- tasks repeatedly expand beyond the authorized objective
- new systems or providers appear without explicit need
- unrelated cleanup is bundled into critical fixes

### Governance drift

- agent behavior exceeds current authorization
- active governance is bypassed or duplicated
- release gates are treated as optional
- documentation silently changes what the project is allowed to do

### Product-identity drift

- product behavior conflicts with current YORISOU product identity or core-system invariants
- engagement optimization begins to override user dignity or safe-to-leave principles
- consent or memory semantics are weakened for convenience

### Consent / privacy drift

- stored data is treated as automatically permitted for use
- inferred consent substitutes for explicit consent
- deleted or disallowed information resurfaces
- production debugging exposes data beyond authorized need

When drift is detected:

`Stop unauthorized expansion → identify authority → establish actual state → classify severity → correct the smallest safe root cause → verify → record evidence`

---

## 20. Decision priorities

When two execution choices conflict, prefer:

**Governance and authorization > safety/privacy/consent/security > data integrity > production correctness > runtime reliability > core user loop > feature count > UX polish > architectural elegance > packaging.**

Also apply:

- evidence > assumption
- minimal safe change > broad rewrite
- current validated need > hypothetical future need
- core loop > feature count
- explicit unknown > fabricated certainty
- reversible change > irreversible change, when outcomes are otherwise equivalent

---

## 21. Change control for this doctrine

This file is subordinate to effective governance.

Changes to this doctrine must not be used to bypass active governance or alter Agent execution authority.

Material changes should record:

- version
- date
- owner / approver
- what changed
- why
- affected execution behavior
- relationship to active governance

If this doctrine is ever promoted into the formal governance pack, its future changes must follow the applicable YORISOU Change Management process and checksum/archive requirements.

---

## 22. Mandatory end-of-task report

For substantial implementation or investigation work, report at least:

- **Authorized objective**
- **Observed starting state**
- **Changes made**
- **Evidence obtained**
- **Capability state after work**
- **What remains unverified**
- **Known residual risks**
- **New issues discovered but intentionally left out of scope**
- **Next blocker, if any**

Do not use vague success language when verification is incomplete.

---

# Final anti-drift test

When uncertain what to do next, answer these questions in order:

1. **What authority applies, and am I authorized to act?**
2. **What does active governance require or prohibit?**
3. **What is actually running now, based on current evidence?**
4. **What is the single current blocker or objective?**
5. **What is the smallest safe, authorized, reversible change that advances it?**
6. **How will the result be verified?**
7. **What will remain unverified afterward?**

Then do only the authorized work necessary to answer the current objective.
