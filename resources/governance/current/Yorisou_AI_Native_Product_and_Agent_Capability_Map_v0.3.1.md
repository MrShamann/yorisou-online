# Yorisou AI-Native Product and Agent Capability Map v0.3.1

**Status:** Approved  
**Owner / Approver:** Edward  
**Version:** v0.3.1
**Market:** Japan  
**Brand / Domain:** YORISOU / yorisou.online

## 1. Purpose

This document maps YORISOU's user-facing AI capabilities, internal Agent capabilities, runtime layers, data graphs, activation stages, and governance dependencies.

## 2. Platform Orchestration

- Akari: platform orchestration, task routing, workflow state, budgets, review escalation, daily operating brief.
- Hinata: user continuity across state, memory, companion, experience, recommendation, and LINE follow-up.
- OpenClaw: runtime, schedules, event processing, queues, retries, and long-running tasks.
- Hermes: Provider Router, tool connector, schema validator, retry/fallback, cost and artifact Harness.
- Codex: sole formal production-repository implementation Agent.

## 3. Capability Layers

### Layer A — State and Methodology
- State understanding
- Dynamic state summary
- Test execution
- Test-question candidate generation
- Methodology evaluation

### Layer B — Memory and Companion
- Personal Memory Graph
- AI Friend
- AI Pet
- Quiet Guide
- LINE follow-up
- Memory correction and forgetting

### Layer C — Experience and Content
- Experience-card structuring
- Privacy assistance
- Topic synthesis
- Weekly summaries
- Provenance labeling

### Layer D — Recommendation and Resource Discovery
- Books
- Music
- Podcasts
- Video
- Articles
- Tools
- Products
- Public resources
- Local places and activities
- Explainable matching

### Layer E — Community and Local
- State-topic formation
- Similar-experience grouping
- Low-pressure responses
- Local discovery
- Social-intensity matching

### Layer F — Product and Commercial Intelligence
- Demand signal analysis
- Product opportunity discovery
- Concept design
- Price hypothesis
- Waitlist and pre-commerce drafts
- Partner and supplier candidates

### Layer G — Digital Legacy
- Legacy planning
- Memory archive
- Source-grounded Q&A
- Authorized simulation
- Recipient and administrator governance

### Layer H — Safety, Quality, and Governance
- Moderation
- Evidence verification
- Commercial disclosure
- Agent evaluation
- Cost and provider controls
- Human review and pause

## 4. Activation Stages

### Current / First Build
- Akari
- Hinata foundation
- State Understanding
- Experience Structuring
- Resource Discovery
- Recommendation Matching
- Evidence and Quality
- Trust and Moderation
- Demand Intelligence
- basic Memory Graph

### Next
- AI Friend / Pet / Quiet Guide
- dynamic memory-based follow-up
- local discovery
- state-topic synthesis
- test evolution sandbox

### Later
- product concept and pre-commerce automation
- dynamic community orchestration
- advanced voice and multimodal companion

### Strategic Future
- Digital Legacy and authorized Legacy Companion

## 5. Activation Rule

A capability may move from Planned to Active only when it has:

- a named owner;
- a versioned Agent contract;
- validated input and output schemas;
- approved data access;
- provider and tool route;
- evaluation metrics;
- cost and stop limits;
- rollback or pause mechanism;
- necessary user controls and disclosure.

## 6. Channel Capability Layer

The governed channel layer includes:

- responsive Web;
- LINE/LIFF entry, linking, reminder, and return flows;
- planned iOS App Store client;
- planned Android Google Play client;
- email identity, recovery, and service communication;
- shared deep-link, notification-policy, account-linking, and client-version compatibility services.

Channel availability is separate from capability definition. iOS and Android remain Planned until implementation and store approval are complete.


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
