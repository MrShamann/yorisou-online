# YORISOU Agent Runtime Phase 1 — Resource Loader and Task Queue

## Scope

This foundation is server-only and inactive: it starts no Agents, schedules, providers, external actions, or migrations. Governance files remain the source of truth at `resources/governance/current/` and are never Skills, prompts, memory, or a shared index.

## Governance loader

`lib/server/agent-runtime/governanceResources.ts` reads only the approved README allowlist, requires exactly 28 directory entries, validates realpath containment and every SHA-256 against the runtime-owned immutable `governance-checksums.json` manifest, rejects hidden/unlisted/symlink/inactive files, and supports deterministic filename/type/domain/keyword/priority lookup. The checksum manifest is runtime integrity metadata, not governance authority, and is never regenerated at runtime. Validation includes the approved channel, Shigeru, and Digital Legacy assertions.

## Queue model and security

`supabase/migrations/202607100001_agent_runtime_phase1.sql` is unapplied SQL for five YORISOU-only tables: tasks, attempts, artifacts, reviews, and pause records. Every row is constrained to `project_id = 'yorisou'`. RLS is enabled with no user policies: only a server-side service role should call the queue/RPC. Never put provider credentials in task payloads or artifact records.

Promotion and claiming are separate: the bounded promotion RPC moves due `queued`, `scheduled`, and `retry_wait` tasks to `ready`; the claim RPC claims only `ready` tasks using `FOR UPDATE SKIP LOCKED`, priority/availability ordering, and a 1–20 batch bound. Claims record a validated non-secret `claimed_by` worker ID and lease. Stale recovery clears ownership and requeues/retries according to state. States are `queued`, `scheduled`, `ready`, `claimed`, `running`, `waiting_for_review`, `retry_wait`, `completed`, `failed`, `cancelled`, `paused`, and `dead_letter`; transitions are guarded in PostgreSQL and the server contract.

All security-definer RPCs use a fixed `search_path` and have execute revoked from `public`, `anon`, and `authenticated`. The deployment must grant only its named server-side role in a separately approved environment migration; this repository deliberately does not guess that role name.

## Apply and rollback

Do not apply the migration in this phase. After founder approval, apply it only through the approved Supabase migration process in a non-production environment, then generate database types through that same process. Rollback is to disable the server role/RPC and stop task creation; retain audit records. A destructive SQL rollback requires a separate approved migration.

## Local validation

Run `npm run test:agent-runtime`, `npm run test:agent-runtime:db`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`. The database command refuses absent, non-localhost, Supabase, or non-test database URLs. GitHub Actions supplies an ephemeral PostgreSQL 16 service with workflow-local credentials; it applies the migration only there. Local database RPC execution remains unavailable in the Codex sandbox. This is validation infrastructure, not production runtime architecture; the migration and final deployment-role grant remain unapplied/deferred.

The database harness executes core schema, promotion, ready-only claim, ownership, stale recovery, illegal-transition, PUBLIC-permission, idempotency, payload-limit, and two-client concurrent-claim checks. The concurrency check launches two independent `psql` sessions against two ready rows and requires distinct claimed IDs. It uses only the disposable CI database.
