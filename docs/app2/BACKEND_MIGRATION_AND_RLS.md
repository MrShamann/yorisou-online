# APP-2 — Full-Service Backend: migration, RLS/grant matrices, local infra & cleanup

**Scope:** local, development-only verification of the APP-2 full-service backend
(`supabase/migrations/202607190001_app2_full_service_backend.sql`). This was
built and verified against a **LOCAL** Supabase stack (Colima + Docker). It was
**not** applied to production, not connected to `yorisou-production`, and uses no
production secrets. No hosted/billable Supabase project was created.

---

## 1. What the migration adds (additive only)

Eight new `public.yorisou_*` tables + three aggregate views + five
security-definer RPCs. No existing table is altered or dropped; no existing row
is modified.

| Table | Purpose | Workstream |
|---|---|---|
| `yorisou_guest_migration_jobs` | guest→account migration jobs (idempotent by `idempotency_key`) | WS-E |
| `yorisou_guest_migration_events` | append-only audit of job transitions | WS-E |
| `yorisou_adaptation_state` | account-side mirror of device-local adaptation signals | WS-B |
| `yorisou_service_feedback` | normalized coarse feedback | WS-D |
| `yorisou_service_incidents` | service incidents / failures (safe summaries) | WS-F/G |
| `yorisou_review_queue_items` | review queue (10 governed queue types) | WS-G |
| `yorisou_review_queue_events` | append-only audit of queue lifecycle | WS-G |
| `yorisou_admin_access_logs` | sensitive-admin access log (allowed **and** denied) | WS-H |

Views (aggregates only, `security_invoker`, no PII): `yorisou_migration_funnel`,
`yorisou_review_queue_summary`, `yorisou_service_readiness_overview`.

RPCs (SECURITY DEFINER, `execute` granted to `service_role` only):
`create_yorisou_guest_migration_job` (idempotent), `transition_yorisou_guest_migration_job`
(guarded transitions), `enqueue_yorisou_review_item`, `transition_yorisou_review_item`,
`log_yorisou_admin_access`.

## 2. Reversibility (rollback)

The migration header carries the full non-destructive rollback (drop views →
RPCs → triggers → mutation-guard function → tables in dependency order). No
existing data is touched, so rollback is net-zero.

## 3. RLS matrix

`current_account_id := coalesce(jwt.app_account_id, jwt.sub)`.

| Table | anon | authenticated | service_role |
|---|---|---|---|
| `guest_migration_jobs` | ✗ deny | SELECT own account only | full |
| `guest_migration_events` | ✗ deny | SELECT own account only | insert (append-only) |
| `adaptation_state` | ✗ deny | ALL own account only | full |
| `service_feedback` | ✗ deny | SELECT/INSERT own account only | full |
| `service_incidents` | ✗ deny | ✗ deny (no policy) | full |
| `review_queue_items` | ✗ deny | ✗ deny (no policy) | full |
| `review_queue_events` | ✗ deny | ✗ deny (no policy) | insert (append-only) |
| `admin_access_logs` | ✗ deny | ✗ deny (no policy) | insert (append-only) |

Admin tables have **no** anon or authenticated policy → reachable only by the
server via `service_role`, which performs its own admin authorization
(`requireAdminRequestViewer`). RLS is `force`d so even the owner is subject to
policies during local psql checks.

## 4. Grant matrix (defense-in-depth alongside RLS)

| Table | anon | authenticated | service_role |
|---|---|---|---|
| user-owned (jobs/events/adaptation/feedback) | REVOKE ALL | least verbs only (SELECT [+INSERT/UPDATE where needed]) | full DML |
| admin (incidents/queue/queue events/access logs) | REVOKE ALL | REVOKE ALL | full DML (audit tables: insert only) |

Append-only audit tables (`*_events`, `admin_access_logs`) carry a
`BEFORE UPDATE/DELETE/TRUNCATE` trigger that raises for **every** role, including
`service_role` — they are truly immutable.

## 5. Local verification (evidence)

Run against LOCAL Supabase only:

```bash
LOCAL_DB="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
psql "$LOCAL_DB" -f supabase/migrations/202607190001_app2_full_service_backend.sql
psql "$LOCAL_DB" -f supabase/seeds/app2_local_seed.sql
psql "$LOCAL_DB" -f docs/app2/LOCAL_SUPABASE_VERIFICATION.sql   # each check → PASS/FAIL
```

The captured run (`evidence/aix1-founder-review/app2/local-supabase-verification.txt`)
shows **12/12 PASS** (schema, idempotency, transition audit, illegal-transition
rejection, append-only UPDATE+DELETE blocked, denied-admin-access logged, anon
denied, user isolation, authenticated denied on admin tables, review lifecycle
audit, readiness view). A REST/RPC E2E via the running PostgREST additionally
confirms idempotent create, guarded transition, anon HTTP 401/`42501` denial, and
the readiness funnel — i.e. the exact code path `lib/server/app2ServiceBackend.ts`
uses.

## 6. Local dev infrastructure — installed packages & versions

Installed dev-only via Homebrew (APP-2 §3 authorization). **No production use.**

| Package | Version |
|---|---|
| colima | 0.10.3 |
| docker (CLI) | 29.6.2 |
| docker-compose | 5.3.1 |
| lima (colima dep) | 2.1.4 |
| supabase CLI | 2.106.0 (pre-existing) |

Local Supabase config: `supabase/config.toml` (project_id `yorisou-online`), with
heavy services disabled to respect disk (studio/realtime/storage/imgproxy/
inbucket/edge_runtime/analytics = `enabled = false`). Local endpoints:
API `http://127.0.0.1:54321`, DB `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
(well-known local demo keys only; **never** production secrets).

## 7. Cleanup / uninstall

```bash
# Stop + remove the local Supabase stack and its data volume
supabase stop --no-backup            # or: supabase stop; docker volume rm $(docker volume ls -q --filter label=com.supabase.cli.project=yorisou-online)

# Stop the Colima VM
colima stop

# Fully remove the Colima VM + its disk (reclaims all local dev-infra disk)
colima delete            # prompts; removes the VM entirely

# Uninstall the dev-only packages (only if no longer needed)
brew uninstall colima docker docker-compose
brew uninstall lima      # colima dependency; remove only if nothing else needs it

# Optional: prune any remaining Docker images/volumes
docker system prune -a --volumes
```

To bring the stack back for a Founder Preview: `colima start` then `supabase start`
(images are cached), re-apply the migration + seed as in §5.
