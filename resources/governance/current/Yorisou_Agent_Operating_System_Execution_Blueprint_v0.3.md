# YORISOU Agent Operating System Execution Blueprint v0.3

**Status:** Approved  
**Owner / Approver:** Edward

## 1. Operating Model

YORISOU operates as a governed AI-native platform with two coordinated control layers:

- **Akari:** platform and company-operation orchestration;
- **Hinata:** user-continuity and companion orchestration.

OpenClaw executes workflows. Hermes provides provider and tool Harness services. Codex implements formal repository changes.

## 2. Core Loop

> Observe -> Classify -> Plan -> Route -> Execute -> Verify -> Review -> Publish or Queue -> Learn -> Measure

Each step must create traceable operating records.

## 3. Event Sources

Events may include:

- test completion;
- user state update;
- experience-card draft or publication;
- save, try, helpful, hide, and report signals;
- companion interaction;
- LINE follow-up permission or response;
- new external resource candidate;
- local event or public-resource update;
- repeated unmet demand signal;
- scheduled daily or weekly workflow;
- provider, quality, safety, or cost alert.

## 4. Initial Active Agents

Initial activation target:

1. Akari;
2. Hinata;
3. State Understanding Agent;
4. Memory Agent;
5. Experience Structuring Agent;
6. Resource Discovery Agent;
7. Recommendation Matching Agent;
8. Evidence and Quality Agent;
9. Trust and Moderation Agent;
10. Demand Intelligence Agent;
11. Governance Auditor.

Other defined capabilities remain Planned or Dormant.

## 5. Workflow Classes

### User-value workflows
- state summary;
- experience structuring;
- finite recommendation;
- companion response;
- LINE follow-up;
- memory correction or forgetting.

### Platform-maintenance workflows
- resource freshness check;
- broken-link and availability check;
- test-candidate generation;
- topic synthesis;
- local-resource refresh;
- quality and safety review.

### Business-intelligence workflows
- demand clustering;
- product-opportunity candidate generation;
- concept and pre-commerce draft generation;
- partner and supplier candidate discovery.

## 6. Review Routing

Low-risk reversible user value may be automated when contract, evaluation, and rollback controls exist.

The following must be queued for human approval unless separately authorized:

- public claims based on weak evidence;
- commercial commitment;
- external outreach;
- supplier selection;
- paid pre-sale launch;
- material methodology change;
- core test production update;
- Digital Legacy activation;
- production-code change.

## 7. Provider and Cost Control

Agents call providers only through Hermes. Every workflow must have a budget class, timeout, retry policy, and fallback rule. Akari may pause a workflow when cost or quality exceeds its approved envelope.

## 8. Evaluation

Evaluation must include:

- Japanese quality;
- factual and source accuracy;
- privacy and policy compliance;
- recommendation usefulness;
- user correction and rejection rate;
- cost per useful outcome;
- failure and retry rate;
- over-notification and dependency risk for companion workflows.

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
