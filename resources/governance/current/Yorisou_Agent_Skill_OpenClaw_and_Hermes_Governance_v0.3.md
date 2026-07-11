# YORISOU Agent, Skill, OpenClaw, and Hermes Governance v0.3

**Status:** Approved  
**Owner / Approver:** Edward  
**Market:** Japan  
**Project Namespace:** `yorisou`

## 1. Purpose

This document governs the runtime, tool, provider, skill, and cross-Agent operating boundaries for YORISOU.

## 2. Platform Roles

- **Akari** is the YORISOU Platform Orchestrator.
- **Hinata** coordinates user continuity across state, memory, companion, experience, recommendation, and LINE follow-up.
- **OpenClaw** runs scheduled, queued, event-driven, and long-running Agent work.
- **Hermes** provides the governed Harness for provider routing, tool execution, schema validation, retry, fallback, cost control, and artifact handling.
- **Codex** is the sole formal production-repository implementation Agent.
- **Shigeru** remains exclusive to Mirai Move and is outside the YORISOU namespace.

## 3. Isolation

YORISOU must not share with Mirai Move by default:

- memory;
- prompts;
- task queues;
- artifacts;
- logs;
- cost ledgers;
- credentials;
- provider routing context;
- governance context.

Every run and artifact must carry `project_id = yorisou` or an equivalent hard namespace.

## 4. Agent Activation

An Agent may be activated only when it has:

- a versioned contract;
- a named owner;
- defined triggers, inputs, and outputs;
- approved tools and providers;
- data classification and access limits;
- automatic-action limits;
- review requirements;
- cost and retry limits;
- quality metrics;
- stop and pause conditions.

Capability definition does not equal runtime activation.

## 5. Skill Governance

Skills may package repeatable methods, schemas, prompts, validators, and tools. Skills must not silently expand an Agent's authority. A skill inherits the Agent's data, tool, cost, and review boundaries.

Production-changing skills may be used only through Codex and the approved repository workflow.

## 6. OpenClaw Runtime Rules

OpenClaw may:

- execute approved workflows;
- run schedules and event subscriptions;
- maintain task state;
- retry bounded failures;
- write approved artifacts and operating records;
- pause workflows on policy, cost, or provider failures.

OpenClaw may not change governance, create unbounded Agents, expose secrets, or directly modify production code.

## 7. Hermes Harness Rules

Hermes must:

- normalize task envelopes;
- route providers according to sensitivity, Japanese quality, task fit, cost, latency, reliability, and provider terms;
- validate structured outputs;
- record provider and cost decisions;
- support bounded retry and fallback;
- minimize or redact data before external provider calls where required;
- preserve artifact provenance.

No specialist Agent may create a hidden permanent dependency on one provider.

## 8. Automatic Action Levels

- **A0 — Generate only:** internal candidate or draft.
- **A1 — Internal update:** low-risk internal record or queue update.
- **A2 — User-visible reversible action:** bounded recommendation, summary, or assistant response with logging and user controls.
- **A3 — External or commercial action:** requires explicit approval unless separately authorized by governance.
- **A4 — Governance, payment, contract, production code, or Digital Legacy activation:** founder approval and appropriate human process required.

## 9. Audit and Pause

All active workflows must support:

- run logs;
- prompt and contract version references;
- provider and tool records;
- cost records;
- error classification;
- user-impact traceability where applicable;
- pause and rollback.

---

## v0.3.3 Evidence Amendment (2026-07-11)

**Amendment approval:** Edward, Phase 2B-1 governance authorization, 2026-07-11.

This document remains Approved. The implementation-of-record statements below take precedence over any conflicting runtime-implementation wording in this document. Role definitions, boundaries, isolation rules, data rules, and approval rules remain in force.

- YORISOU Agent Runtime (Supabase/PostgreSQL durable task queue, task attempts, runs, artifacts, review records, leases, bounded retry, failed/dead-letter behavior, pause and kill-switch controls, `project_id = yorisou` isolation): CURRENT_REQUIRED. Implemented in `yorisou-online` (`supabase/migrations/202607100001_agent_runtime_phase1.sql`, `lib/server/agent-runtime/`).
- YORISOU Provider Harness (`lib/server/privateAiProviderResolver.ts`; `gemini_shared` primary route; `groq_shared`, `mistral_shared`, `openrouter_shared`, `nvidia_nim_shared` fallback routes; provider/model/cost/latency metadata): CURRENT_REQUIRED.
- Vercel Web runtime: CURRENT_REQUIRED.
- Supabase/PostgreSQL (`yorisou-production`): CURRENT_REQUIRED.
- AWS S3 shared/artifact storage: CURRENT_REQUIRED.
- OpenClaw task runtime for YORISOU task execution: SUPERSEDED_BY_YORISOU_RUNTIME. OpenClaw as a platform is not declared obsolete by this amendment.
- OpenClaw Voice bridge: CURRENT_OPTIONAL / HEALTH_UNVERIFIED. This amendment neither activates, retires, nor migrates it.
- OpenClaw knowledge sidecar configuration: LEGACY_CONFIG / ZERO_CODE_REFERENCE.
- OpenClaw local repository working copy: MIXED_ASSET_REQUIRES_SPLIT.
- Hermes separate runtime: UNCONFIRMED / NOT_REQUIRED. The Hermes harness role is fulfilled by the YORISOU Provider Harness. No statement is made that a separate Hermes runtime exists.
- AWS Amplify: HISTORICAL_EVIDENCE.
- Shared provider credentials: SHARED_CREDENTIAL_ONLY. Account-level sharing is approved; runtime context, task queues, memory, artifacts, logs, and cost ledgers remain project-isolated.

Authoritative evidence detail: `Yorisou_Current_Implementation_Baseline_v0.3.3.md`. Decision record: `Yorisou_Founder_Decision_Record_v0.3.3.md`. Migration mechanics: `Yorisou_Governance_Migration_Note_v0.3.3.md`.
