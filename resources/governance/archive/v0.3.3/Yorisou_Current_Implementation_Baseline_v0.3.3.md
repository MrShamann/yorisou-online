# Yorisou Current Implementation Baseline v0.3.3

**Status:** Approved  
**Approved Date:** 2026-07-11  
**Owner / Approver:** Edward  
**Evidence Basis:** Current-architecture asset reconciliation and Phase 2A verification, 2026-07-11, against `MrShamann/yorisou-online` `origin/main` and production deployment configuration.

## 1. Purpose

This document records the verified implementation-of-record for YORISOU as of 2026-07-11. Where earlier governance wording assigned runtime or harness implementation to other systems, this baseline states where each capability is actually implemented and operated. It changes implementation attribution only; it does not change product judgment, scoring, persona, approval, isolation, or data rules.

## 2. Verified implementation statuses

| Capability | Status | Evidence anchor |
|---|---|---|
| YORISOU Agent Runtime (durable PostgreSQL task queue, task attempts, runs, artifacts, review records, leases, bounded retry, failed/dead-letter behavior, pause and kill-switch controls, `project_id = yorisou` isolation) | CURRENT_REQUIRED | `supabase/migrations/202607100001_agent_runtime_phase1.sql`; `lib/server/agent-runtime/taskQueue.ts`; production Supabase configuration |
| YORISOU Provider Harness (provider routing, structured-output validation, bounded retry and fallback, provider/model/cost/latency metadata) | CURRENT_REQUIRED | `lib/server/privateAiProviderResolver.ts`; production primary/fallback provider alias configuration (`gemini_shared` primary; `groq_shared`, `mistral_shared`, `openrouter_shared`, `nvidia_nim_shared` fallbacks) |
| Vercel Web runtime (production host of record, yorisou.online) | CURRENT_REQUIRED | Vercel project `yorisou-online`, production domain binding |
| Supabase/PostgreSQL (`yorisou-production`) | CURRENT_REQUIRED | `supabase/migrations/`; production Supabase configuration |
| AWS S3 shared/artifact storage | CURRENT_REQUIRED | `lib/server/openclawArtifactStore.ts` (local implementation writing YORISOU-owned storage), `lib/server/dteLaunchEventStore.ts`, `lib/server/dynamicTestCompletionStore.ts`; production shared-store configuration |
| Private AI reflection, Experience Graph, Recommendation Graph | CURRENT_REQUIRED | `supabase/migrations/202607110001_private_ai_state_and_harness.sql`, `202607110002_experience_cards.sql`, `202607110003_recommendation_graph.sql` |
| OpenClaw task runtime for YORISOU task execution | SUPERSEDED_BY_YORISOU_RUNTIME | No OpenClaw task-queue variables in production; queue/lease/retry/dead-letter implemented in-repo. OpenClaw as a platform is not declared obsolete. |
| OpenClaw Voice bridge | CURRENT_OPTIONAL / HEALTH_UNVERIFIED | `lib/server/openclawVoiceBridge.ts` with graceful degradation; production voice endpoint variables present; runtime health not verified. No activation or retirement is stated. |
| OpenClaw knowledge sidecar configuration | LEGACY_CONFIG / ZERO_CODE_REFERENCE | Five production configuration names have zero references in current `origin/main`, including dynamic-access and build/deploy paths |
| OpenClaw local repository working copy | MIXED_ASSET_REQUIRES_SPLIT | Local/remote history divergence with local-only voice source; split plan recorded in Phase 2A reconciliation report |
| Hermes separate runtime | UNCONFIRMED / NOT_REQUIRED | No implementation, no configured endpoint, no process evidence; the Hermes harness role is fulfilled by the YORISOU Provider Harness. No statement is made that a separate Hermes runtime exists. |
| AWS Amplify | HISTORICAL_EVIDENCE | `amplify.yml` retained as legacy/unknown deployment path marker; not the production host of record |
| Shared provider credentials | SHARED_CREDENTIAL_ONLY | Account-level provider credential sharing approved by Edward; runtime context, task queues, memory, artifacts, logs, and cost ledgers remain project-isolated |

## 3. Interpretation rules

1. Role names (Akari, Hinata, OpenClaw, Hermes) remain valid governance vocabulary. Where implementation moved into `yorisou-online`, the role name is retained and the implementation-of-record is this repository.
2. No specialist Agent may create a hidden permanent dependency on one provider. Provider aliases and fallback order are configuration, not doctrine.
3. Statements in earlier documents that OpenClaw executes YORISOU scheduled/queued/long-running work, or that a separate Hermes service provides the provider harness, are historical implementation attribution and are superseded by this baseline. The associated boundaries and safety rules remain in force.
4. This baseline must be revised through the approved governance workflow before any change to the statuses above (including Voice bridge activation or retirement).
