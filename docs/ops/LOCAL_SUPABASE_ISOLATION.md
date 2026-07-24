# YORISOU local Supabase — permanent project isolation

**Incident prevention, not product functionality.** No YORISOU product behaviour changes here.

## Why
On 2026-07-24 another local project (mirai-move) applied its migrations to **this
project's local database**: both projects defaulted to the shared Supabase ports
(54321/54322), and tooling connected to "whatever process owned the port".
The contamination was surgically removed and **all YORISOU local data was preserved**
(see the incident record in AI-Workspace). This change closes the systemic root cause.

## What changed
1. **Explicit repository-owned identity** — `supabase/config.toml` now pins
   `project_id = "yorisou-online"` and a **dedicated, non-overlapping port range**:

   | project | range |
   |---|---|
   | mirai-move | 5532x / 5533x |
   | **yorisou-online** | **5534x** (`[db].port = 55342`, api 55341, shadow 55340) |
   | defaults 5432x | deliberately unused |

2. **Target-verification guard** — `scripts/verify-local-supabase-target.mjs`
   refuses any target unless: repo is yorisou-online; config `project_id` matches;
   the URL port equals the **exact `[db].port`** (an `[api]` port is never accepted)
   and sits in the dedicated range; host is local; database and user are expected;
   **exactly one** container publishes the port (ambiguity fails closed); the
   container's Supabase CLI label / name identifies YORISOU and **not** mirai/kakari.
   Credentials are never printed and **no fallback target is ever attempted**.

3. **Two-stage bootstrap** — `--bootstrap` runs every check *except* the DB marker
   and is the **only** mode permitted to create it, closing the
   connect-then-verify window. Full mode additionally requires
   `public.yorisou_local_project_identity = 'yorisou-online'`
   (local-environment metadata only; not product schema).

4. **Guarded wrapper** — `scripts/yorisou-local-db.mjs`:
   `bootstrap | verify | migrate | reset | e2e`. Every mutating local-DB operation
   must go through it. `reset` is destructive and additionally requires
   `--yes-destroy-local-data`.

   > **Do not** run raw `supabase db reset`, `psql -f`, or `pg_restore` against the
   > local database — those connect to whatever owns the port.

## Verification performed
- New dedicated stack started on 55342; container identity verified.
- Remediated data carried over on the preserved volume: **all row counts preserved**
  (12 base tables), 3 views, 7 yorisou functions, 8 RLS policies, **0 mirai objects**.
- Post-remediation backup taken **and proven restorable** into a disposable DB.
- Cross-project refusal proven live **in both directions**: the Mirai guard refuses
  this DB (55342) and this guard refuses a Mirai-range target (55322).
- 8 isolation tests: `npm run test:isolation`.

## Scope
No product code, no schema migration, no remote/Production Supabase, no reset of the
remediated database, and the full migration chain was **not** applied (the local DB was
intentionally left at its actual remediated state).
