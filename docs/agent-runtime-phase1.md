# YORISOU Agent Runtime Phase 1 — Resource Loader and Task Queue

## Scope

This foundation is server-only and inactive: it starts no Agents, schedules, providers, external actions, or migrations. Governance files remain the source of truth at `resources/governance/current/` and are never Skills, prompts, memory, or a shared index.

## Governance loader

`lib/server/agent-runtime/governanceResources.ts` reads only the approved README allowlist, requires exactly 28 files, validates realpath containment and SHA-256 metadata, rejects hidden/unlisted/symlink/inactive files, and supports deterministic filename/type/domain/keyword/priority lookup. Validation includes the approved channel, Shigeru, and Digital Legacy assertions.

## Queue model and security

`supabase/migrations/202607100001_agent_runtime_phase1.sql` is unapplied SQL for five YORISOU-only tables: tasks, attempts, artifacts, reviews, and pause records. Every row is constrained to `project_id = 'yorisou'`. RLS is enabled with no user policies: only a server-side service role should call the queue/RPC. Never put provider credentials in task payloads or artifact records.

The claim RPC uses `FOR UPDATE SKIP LOCKED`, priority/availability ordering, a 1–20 batch bound, leases, and stale-lease recovery. States are `queued`, `scheduled`, `ready`, `claimed`, `running`, `waiting_for_review`, `retry_wait`, `completed`, `failed`, `cancelled`, `paused`, and `dead_letter`. Transitions are validated in the server contract; failures have bounded attempts and must move to dead-letter rather than retry indefinitely. Review records preserve Edward as the required approver.

## Apply and rollback

Do not apply the migration in this phase. After founder approval, apply it only through the approved Supabase migration process in a non-production environment, then generate database types through that same process. Rollback is to disable the server role/RPC and stop task creation; retain audit records. A destructive SQL rollback requires a separate approved migration.

## Local validation

Run `npm run test:agent-runtime`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. No test performs a provider call, external action, or database mutation.
