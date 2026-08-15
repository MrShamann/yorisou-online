# OSF-1 — Phase 1 Activation Runbook


---

## PRECONDITIONS ADDED BY THE INTERNAL BETA READINESS PACKAGE (2026-08-15)

Three gates must be satisfied before any step below is executed. They are preconditions, not advice.

**1. The authenticated accessibility gate — MANDATORY, and it is LOCAL.**

```bash
npm run test:osf1-a11y-authenticated
```

Must report **0 serious, 0 critical** across seven routes at 390×844 and 1440×900. It is not in CI:
the harness needs a `postgrest` binary that GitHub's runner image does not provide, and adding one is
a CI supply-chain decision for Edward (see `PHASE1_INTERNAL_BETA_READINESS.md` §3). Until that
decision, this run is a release gate and its output must be recorded with the activation evidence.

**2. The kill switch must be tested LIVE, before exposure.**

Release & Acceptance Gates v1.0 §3.4 requires it at every Production Release Gate, and it applies to
internal activation too. The kill switch is removing `osf1_life_os_internal` from
`YORISOU_PRIVATE_PILOT_FLAGS`. Test it by turning the feature ON, confirming a Founder/Admin reaches
`/life`, then removing the token and confirming `/life` returns 404 again — **before** any second
person is given access. A switch that has only been reasoned about is not a switch.

**3. Gate 3 must be green on the exact commit being deployed.**

```bash
npm run test:osf1-gate3
```

Rehearses apply → rollback → re-apply. It runs in CI as its own job; confirm the job passed on the
commit, not on an earlier one.

### What INTERNAL now actually requires

Before this package, INTERNAL was inert — `lifeOsAccess()` denies production unconditionally, so the
state existed in name only. It is now wired, and reaching it needs **all** of:

1. the migration applied to the target database;
2. `YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true` (writes stay refused without it, reads still work);
3. `osf1_life_os_internal` present in `YORISOU_PRIVATE_PILOT_FLAGS`;
4. the person signed in **and** resolving as a Founder/Admin through the existing admin records.

Missing any one of them yields a 404 that is identical for every reason, so nothing about the
allowlist is discoverable from outside.

**Package:** YORISOU OS Foundation Phase 1 — Life OS Activation & Capability Completion · **Branch:** `feat/osf1-life-os-activation` · **Migrations:** five, applied **nowhere**

> **Nothing in this package has been applied to any real database.** Not production, not staging, not
> preview. Every command below is written to be run for the first time, by someone who did not write
> the code, possibly at a bad hour. Where a step is dangerous, the danger is stated in the step
> rather than in a preamble.

This runbook covers migration order, feature flags, the activation sequence, rollback, and diagnosis.
It does **not** cover production exposure: `lifeOsAccess()` denies production unconditionally and no
environment variable overrides it. See §2.4.

---

## 0. Before you touch anything

### 0.1 Establish where you are

```bash
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git status --short
```

A dirty tree or an unexpected branch is a stop, not a note. The five migration files are immutable
once applied anywhere, and their sha256 digests are recorded in
`supabase/MIGRATION_SCOPE_MANIFEST.md`; editing one after an apply desynchronises the guard from
every environment at once.

### 0.2 Repository-side gates, all runnable now

```bash
node scripts/validate-migration-scope.mjs
npm run test:osf1-contract
npm run test:osf1-ai-boundary
npm run test:osf1-erasure-coverage
npm run test:osf1-boundaries
npm run test:osf1-regression-repair
npm run test:osf1-activation
npm run test:imairo-snapshot
npx tsc --noEmit -p tsconfig.json
npm run lint
npm run build
```

| Command | A correct answer |
|---|---|
| `validate-migration-scope.mjs` | `{"status":"ok","migrations":59,"onDisk":59,"byScope":{"PRODUCTION_LINEAGE":28,…}}` |
| the six `test:osf1-*` suites | `# pass 13`, `9`, `5`, `6`, `14`, `26` — 73 assertions, `# fail 0` throughout |
| `test:imairo-snapshot` | passes; 8 groups. The Imairo protected assets are untouched by this package and a failure here means something unrelated broke |
| `tsc` / `lint` / `build` | clean, 0 errors, build succeeds |

The two database-backed harnesses need local binaries and take longer. Run them before an apply, not
during one:

```bash
npm run test:osf1-postgres              # needs PostgreSQL 16/17 (default /opt/homebrew/opt/postgresql@17/bin)
npm run test:osf1-a11y-authenticated    # additionally needs a postgrest binary
```

`test:osf1-postgres` builds a disposable cluster with `initdb`, applies all five migrations and runs
125 assertions, including the transactional-audit rollback proof described in §5.1. It destroys the
cluster on exit and refuses any DSN that is not a local database named `osf1_acceptance`.

### 0.3 A naming correction you will meet in other documents

Parts of this package refer to "Project Constitution v0.7.0" and "Technical Architecture v0.7.0".
**No such documents exist in this repository.** The installed corpus is **Governance Pack v0.4.1**
(`resources/governance/current/RESOURCE_MANIFEST.md`), containing
`Yorisou_Project_Constitution_v0.4.0.md` and `Yorisou_Technical_Architecture_v0.4.0.md`. Verify it
yourself before citing a version:

```bash
head -6 resources/governance/current/RESOURCE_MANIFEST.md
```

Cite the version that exists. A governance citation to a document nobody can open is worse than none.

---

## 1. Migration order

### 1.1 The five, in lineage order

Apply in exactly this order. All five are `PRODUCTION_LINEAGE` in
`supabase/MIGRATION_SCOPE_MANIFEST.md` and all five live under `supabase/migrations/`.

| # | Version | What it does | Hard dependency |
|---|---|---|---|
| 1 | `202608140001_osf1_life_os_foundation` | 5 tables, 9 RPCs, the privilege matrix; adds `title`/`lesson` to `yorisou_experience_cards` and converts four NOT NULLs into a shared-only CHECK | none |
| 2 | `202608140002_osf1_erasure_plan_registration` | adds the five tables to POR-1's hardcoded erasure plan array | none — it skips absent tables rather than raising |
| 3 | `202608150001_osf1_life_os_audit_events` | the append-only audit table and `yorisou_osf1_audit_write` | none |
| 4 | `202608150002_osf1_reflection_five_question_flow` | `felt` + `tried` columns; replaces the 10-argument `reflection_create` with a 12-argument one | **1** |
| 5 | `202608160001_osf1_phase1_completion` | `mode` + `options_considered`; `lesson` in the memory vocabulary; drops and recreates three RPCs with the audit insert **inside** the transaction; adds `yorisou_osf1_memory_update` | **1, 3, 4** |

Step 5 is one file on purpose. PostgreSQL overloads by signature, `create or replace function` with a
different parameter list creates a *second* function rather than replacing the first, and every grant
in this project is a hardcoded signature string. Split in two, the first overload would survive
un-granted and audit-less, and PostgREST could dispatch to it.

### 1.2 Hazard one — the code must not lead the schema

`lib/server/lifeOs/store.ts` sends `p_mode`, `p_options_considered` and `p_audit_detail` on every
`yorisou_osf1_reflection_create` call. Against a database without `202608160001`, no function matches
those argument names, PostgREST answers 404 (`PGRST202`, "could not find the function … in the schema
cache"), and `rpc()` in `store.ts` raises `life_os_persistence_failed:404`, which
`lifeApiError()` maps to **HTTP 500**. Every reflection save fails outright. Memory *edit* fails the
same way for a simpler reason: `yorisou_osf1_memory_update` does not exist at all before
`202608160001`.

Memory confirm and delete are the exception, and the exception is worse than the failure. `store.ts`
sends exactly the argument names the pre-completion signatures carry — nine for
`yorisou_osf1_memory_confirm`, two for `yorisou_osf1_memory_delete` — so PostgREST resolves them
against `202608140001`'s functions and both **succeed**, writing no audit row and honouring no
`lesson` memory type. A confirmation and a hard deletion would then happen with no trace, which is
precisely the property `202608160001` exists to guarantee.

**Therefore the migration goes first.** There is no version of this ordering where the code leads.

### 1.3 Hazard two — the inverse, and why it is now harmless

The experience-card columns carry the opposite risk, and it was proved against a real un-migrated
schema during the activation audit (`OSF1_DEPLOYMENT_ORDER.md` §1). `payload()` in
`lib/server/experienceCards.ts` once named `title` and `lesson` on **every** insert. `/experiences`
is a pre-existing, live, **ungated** surface whose own client never sends those fields — so deploying
that code to an un-migrated database broke a surface that had nothing to do with the Life OS:

```
columns found: 0
insert naming title/lesson   -> ERROR: column "title" of relation "yorisou_experience_cards" does not exist
insert without them          -> INSERT 0 1
```

Two properties now make the ordering safe in both directions, and both are worth confirming rather
than trusting:

- **Code ahead of schema is safe.** `payload()` emits `title`/`lesson` only when supplied
  (`lib/server/experienceCards.ts`, the `MIGRATION-ORDERING SAFETY` note), so the deployed bundle
  works against either schema.
- **Schema ahead of code is safe.** `202608140001` drops the NOT NULL on `state_context`,
  `limitations`, `may_fit` and `may_not_fit` and replaces it with
  `yorisou_experience_cards_shared_context_chk`, whose shared branch is exactly the old requirement.
  Already-deployed code always supplies those fields, so it satisfies the new constraint unchanged.

The asymmetry is one of blast radius. Hazard 1 breaks a feature that is closed by default and behind
its own write gate. Hazard 2 broke a live surface used by people who never asked for the Life OS.
That is why the fix went into the code and not into a sentence in a runbook.

### 1.4 Hazard three — the silent one: skipping a migration in the middle

Out-of-order application fails loudly where it touches a table that does not exist yet. It fails
**silently at apply time** in two places, because PostgreSQL does not resolve a `plpgsql` body when
the function is created:

| Mistake | What happens at apply | What happens later |
|---|---|---|
| `202608160001` without `202608150001` | applies cleanly | every reflection and memory mutation fails at the first call — `yorisou_osf1_audit_write` does not exist |
| `202608160001` without `202608150002` | applies cleanly | `202608160001` drops the **12-argument** `reflection_create`, so `202608140001`'s **10-argument** version survives — granted to `service_role`, reachable by PostgREST, and writing no audit row. The insert into `felt`/`tried` also fails, because those columns were never added |

Both are caught by the overload check in §3.2, which is why that check is not optional.

### 1.5 How to apply — and why not `supabase db push`

**Do not run `supabase db push` against production for this package.** Production
(`yorisou-production` `krxizslnksorwhepyijs`) records **7** versions in `schema_migrations`, through
`202607110003`. Five later `PRODUCTION_LINEAGE` versions (`202607120001`, `202607160001`,
`202607160002`, `202607200005`, `202607210001`) are **applied-but-untracked**: their objects exist,
their history rows do not. `db push` would try to run them again. Reconciling that history is a
separate Founder-authorized operation — see `supabase/MIGRATION_SCOPE_MANIFEST.md` §"Remote-history
reconciliation status" and `docs/yorisou/ppr1/PPR1_COMPLETION_PHASE_1.md`.

Apply the five explicitly instead, one statement stream each, stopping on the first error:

```bash
export OSF1_TARGET_DSN='postgres://…'          # the target database, set deliberately, never a default

# Confirm the target before writing to it. Read the host off the DSN, and the database off the server.
psql "$OSF1_TARGET_DSN" -X -t -A -c "select current_database() || ' @ ' || version();"

for m in 202608140001_osf1_life_os_foundation \
         202608140002_osf1_erasure_plan_registration \
         202608150001_osf1_life_os_audit_events \
         202608150002_osf1_reflection_five_question_flow \
         202608160001_osf1_phase1_completion; do
  echo "== $m"
  psql "$OSF1_TARGET_DSN" -X -v ON_ERROR_STOP=1 -f "supabase/migrations/$m.sql" || break
done
```

`ON_ERROR_STOP=1` and the `|| break` are the point: the loop must not carry on past a failure into a
later migration that assumes the earlier one landed.

If the target's history *is* reconciled and you are using the CLI, list before you push and confirm
that the only pending versions are these five:

```bash
supabase migration list --linked     # expect exactly the five OSF-1 versions pending
supabase db push --dry-run           # any unexpected output is a blocker
```

---

## 2. Feature flags

Every value below is read by `lib/life-os/access.ts` and `lib/cpv1/deploymentContext.ts`. None of
them is `NEXT_PUBLIC_`, so a client bundle sees an empty environment and every gate fails closed
there too.

### 2.1 The variables

| Variable | Read by | Accepted values | Effect |
|---|---|---|---|
| `VERCEL_ENV` | `deploymentContext()` | `production` / `preview` / `development` | the trusted context marker. Set by Vercel; never set it by hand |
| `NODE_ENV` | `deploymentContext()` | `test` → context `test`; `development` → context `local` | `next dev` sets `development`; `next start` sets `production`, which alone is **not** trusted as local |
| `YORISOU_CI_TEST` | `deploymentContext()` | `1` | forces context `test`. Used by `tests/life-os/fullstack-a11y.sh` to open the Life OS for an acceptance run |
| `VITEST` | `deploymentContext()` | any non-empty | forces context `test` |
| `YORISOU_LOCAL_DEV` | `deploymentContext()` | `1` | forces context `local` |
| `YORISOU_CPV1_DEV_FLAGS` | `parseDevFlags()` | comma-separated **exact** tokens | contains `osf1_life_os_preview` → the Life OS routes open on Vercel Preview |
| `YORISOU_OSF1_LIFE_OS_SCHEMA_READY` | `lifeOsMutationAccess()` | the literal string `true`, trimmed and lower-cased | the operator's declaration that the migrations have been applied to the database *this deployment talks to*. Without it, every write is refused |
| `YORISOU_PRIVATE_PILOT_FLAGS` | `parseProductionPilotFlags()` | comma-separated exact tokens | contains `osf1_life_os_internal` → `lifeOsActivationState()` **reports** INTERNAL. It opens nothing; see §2.4 |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `lib/server/lifeOs/store.ts` | — | absent → every read and write throws `life_os_persistence_not_configured` |
| `YORISOU_PRIVATE_AI_PROVIDER_PRIMARY` (+ `…_FALLBACKS`, and the matching provider key) | `resolvePrivateReflectionProviders()` | `gemini_shared` / `groq_shared` / `mistral_shared` / `openrouter_shared` / `nvidia_nim_shared` | optional. Absent → the Reflection Assistant answers `{ok:false, reason:"assistant_unavailable"}` with HTTP 200. That is a normal state, not a failure |

Two parsing rules matter operationally. Unknown tokens in either flag list are **dropped**, so a typo
authorizes nothing and produces no warning. And `YORISOU_CPV1_DEV_FLAGS` is shared with seven other
surfaces — **append** to it, never replace it.

### 2.2 Which combination yields which state

`lifeOsActivationState()` reports the state; `lifeOsAccess()` is the single authority on whether the
non-production routes actually open.

| State | Environment | Route gate | Write gate |
|---|---|---|---|
| **OFF** | anything not listed below — including `VERCEL_ENV=production`, and including a bare `next start` with no marker | 404 | refused |
| **PREVIEW** | `VERCEL_ENV=preview` **and** `YORISOU_CPV1_DEV_FLAGS` contains `osf1_life_os_preview`. Also reported for a trusted `local` or `test` context | open | open only if `YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true` |
| **INTERNAL** | `VERCEL_ENV=production` **and** `YORISOU_PRIVATE_PILOT_FLAGS` contains `osf1_life_os_internal` | **still 404** — see §2.4 | refused |
| **PUBLIC** | nothing sets it | — | — |

The read gate and the write gate are deliberately different widths. Reads degrade to an empty state
when the tables are absent; writes cannot degrade — they fail, and somebody who has just typed a
seven-question postmortem loses it. So a write is refused up front with a named 503, before the
person is invited to type anything.

### 2.3 Unknown contexts fail closed

`deploymentContext()` returns `unknown` for anything without an explicit trusted marker: a
misconfigured Vercel project, a CI runner with no markers, a self-hosted `next start` with
`NODE_ENV=production`. `unknown` is treated exactly like `production` — denied. There is no value of
any Life OS variable that opens an unknown context.

The corollary is a real hazard: `YORISOU_LOCAL_DEV=1` or `YORISOU_CI_TEST=1` set on a hosted box
turns that box into a trusted context and opens `/life` for every signed-in account. Neither belongs
in a hosted environment's variables. Check for them before and after any deploy.

### 2.4 INTERNAL is defined but not wired, and PUBLIC is unreachable

Say this plainly to anyone who asks for a production pilot: **setting
`YORISOU_PRIVATE_PILOT_FLAGS=osf1_life_os_internal` in production opens nothing.** Every `/life` page
and `lib/server/lifeOs/guard.ts` call `lifeOsAccess()`, which returns `denied_production`
unconditionally. `lifeOsInternalAccess()` and `lifeOsActivationState()` have no call site outside
`lib/server/__tests__/osf1Activation.test.ts` — you can confirm that in one command:

```bash
grep -rn "lifeOsInternalAccess\|lifeOsActivationState" app lib --include=*.ts --include=*.tsx | grep -v __tests__
```

The correct answer is: only the definitions in `lib/life-os/access.ts`. The state machine is complete
and testable; the wiring is not built. Opening production requires a code change plus a Gate 5
decision — staged rollout plan, kill switches tested live, consent-comprehension copy verified,
Founder acceptance recorded. PUBLIC is unreachable by construction: no environment variable in this
codebase returns it, and adding one is a Founder act.

---

## 3. Activation sequence

Four stages, each with a verification that must pass before the next begins. The invariant the whole
sequence protects is one sentence: **`YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true` must never be set in an
environment whose database has not had all five migrations applied.** Reversing stages 1 and 4 is the
single action that defeats every safeguard in the code.

### Stage 1 — Apply the migrations

Run §1.5 against the target. Record the backup snapshot reference first; a Gate 3 apply requires it,
and §4 of this runbook cannot restore data that was never snapshotted.

**Verification — schema.** Run all of these against the same DSN.

```bash
psql "$OSF1_TARGET_DSN" -X -c "
select table_name from information_schema.tables
 where table_schema='public' and table_name in (
   'yorisou_user_contexts','yorisou_current_state_records','yorisou_goals',
   'yorisou_life_reflections','yorisou_explicit_memories','yorisou_life_os_audit_events')
 order by 1;"
```
*Correct:* six rows.

```bash
psql "$OSF1_TARGET_DSN" -X -c "
select column_name from information_schema.columns
 where table_name='yorisou_life_reflections'
   and column_name in ('felt','tried','mode','options_considered') order by 1;"
```
*Correct:* four rows — `felt`, `mode`, `options_considered`, `tried`. Fewer than four means a
migration in the middle was skipped (§1.4).

```bash
psql "$OSF1_TARGET_DSN" -X -t -A -c "
select count(*) from information_schema.columns
 where table_name='yorisou_experience_cards' and column_name in ('title','lesson');"
```
*Correct:* `2`.

```bash
psql "$OSF1_TARGET_DSN" -X -t -A -c "
select pg_get_constraintdef(oid) from pg_constraint
 where conname='yorisou_explicit_memories_type_chk';"
```
*Correct:* a CHECK naming five values including `'lesson'`.

**Verification — exactly one overload per function.** This is the check that catches §1.4.

```bash
psql "$OSF1_TARGET_DSN" -X -c "
select p.oid::regprocedure as signature
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
 where n.nspname='public' and p.proname in (
   'yorisou_osf1_reflection_create','yorisou_osf1_memory_confirm',
   'yorisou_osf1_memory_delete','yorisou_osf1_memory_update','yorisou_osf1_audit_write')
 order by 1;"
```

*Correct:* exactly five rows, one per name, with these argument counts:

| Function | Arguments |
|---|---|
| `yorisou_osf1_reflection_create` | 15 (`text, uuid, text ×12, jsonb`) |
| `yorisou_osf1_memory_confirm` | 10 (`text ×5, boolean, uuid ×3, jsonb`) |
| `yorisou_osf1_memory_delete` | 3 (`text, uuid, jsonb`) |
| `yorisou_osf1_memory_update` | 5 (`text, uuid, text, text, jsonb`) |
| `yorisou_osf1_audit_write` | 6 (`text ×3, uuid, text, jsonb`) |

Six rows means an overload survived. Stop and remove it before anything writes: PostgREST dispatches
on the JSON key set it is sent, so an unintended overload is not dormant.

**Verification — privileges, RLS and erasure.**

```bash
psql "$OSF1_TARGET_DSN" -X -c "
select relname, relrowsecurity from pg_class
 where relname in ('yorisou_user_contexts','yorisou_current_state_records','yorisou_goals',
                   'yorisou_life_reflections','yorisou_explicit_memories',
                   'yorisou_life_os_audit_events') order by 1;"
```
*Correct:* `t` for all six.

```bash
psql "$OSF1_TARGET_DSN" -X -c "
select has_table_privilege('service_role','public.yorisou_life_os_audit_events','select') as can_read,
       has_table_privilege('service_role','public.yorisou_life_os_audit_events','insert') as can_write;"
```
*Correct:* `can_read = t`, `can_write = f`. Every write goes through a `SECURITY DEFINER` RPC, so
application code holding the service-role key cannot insert directly.

```bash
psql "$OSF1_TARGET_DSN" -X -t -A -c "
select count(*) from pg_proc
 where proname='yorisou_account_deletion_erase_database_unchecked'
   and prosrc like '%yorisou_explicit_memories%'
   and prosrc like '%yorisou_life_reflections%'
   and prosrc like '%yorisou_current_state_records%'
   and prosrc like '%yorisou_goals%'
   and prosrc like '%yorisou_user_contexts%';"
```
*Correct:* `1`. Anything else means `202608140002` did not land, and a person who deletes their
account will keep their reflections and memories on the server while being told the deletion
succeeded.

Repository-side, confirm the guard that prevents this class of defect recurring:

```bash
npm run test:osf1-erasure-coverage       # 5 assertions, 0 failures
```

### Stage 2 — Deploy the code with every flag off

Deploy the branch. Do **not** set `YORISOU_OSF1_LIFE_OS_SCHEMA_READY`. Do **not** add
`osf1_life_os_preview` to `YORISOU_CPV1_DEV_FLAGS`.

Nothing changes for users at this stage. `/life` 404s, `/api/life/*` 404s, and `/experiences` keeps
working because `payload()` no longer names the new columns.

### Stage 3 — Verify closed

An anonymous request tells you exactly which gate you are behind, because `requireLifeViewer()`
checks the feature gate, then the write gate, then the session — in that order.

```bash
HOST=https://<the-deployment-host>
curl -s -o /dev/null -w 'life:%{http_code}\n'     "$HOST/life"
curl -s -o /dev/null -w 'timeline:%{http_code}\n' "$HOST/api/life/timeline"
curl -s -w '\n%{http_code}\n' -X POST "$HOST/api/life/reflections" \
     -H 'content-type: application/json' -d '{}'
```

| Response to the anonymous POST | Means |
|---|---|
| `404 {"error":"not_found"}` | the route gate is closed. **This is the correct answer at stage 3** |
| `503 {"error":"life_os_not_accepting_entries:denied_schema_not_ready"}` | the route is open, the schema-ready declaration is absent or is not exactly `true` |
| `401 {"error":"authentication_required"}` | both gates are open and the surface is accepting entries from signed-in people |

`denied_route_closed` is unreachable over HTTP by construction — the route gate answers 404 first, so
a closed route reveals nothing about who is asking or about whether writes would have been allowed.

If `/life` returns 200 at this stage, the deployment has a trusted-context marker it should not have.
Check `YORISOU_LOCAL_DEV`, `YORISOU_CI_TEST` and `VERCEL_ENV` in that environment's variables (§2.3)
before doing anything else.

### Stage 4 — Open, in two separate acts

The two are separate on purpose and must not be combined into one deploy.

**4a. Declare the schema ready.** Only after stage 1 passed *in this environment*:

```
YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true
```

This is not a feature switch. It is an operator asserting, out of band, that the migrations ran
against the database this deployment talks to. Setting it while they have not re-creates precisely
the failure it exists to prevent.

*Verification:* the anonymous POST from stage 3 now answers `401 authentication_required`. If it
still answers `503 …denied_schema_not_ready`, the variable did not reach the running process — a
redeploy is usually required for an environment-variable change to take effect.

**4b. Open the route.** Preview only:

```
YORISOU_CPV1_DEV_FLAGS=<existing tokens>,osf1_life_os_preview
```

Append. Replacing the value silently closes whichever other preview surfaces were listed.

*Verification:* `/life` answers 200, and so do `/life/timeline`, `/life/reflect`,
`/life/reflect?mode=postmortem`, `/life/goals`, `/life/experience`, `/life/memories`. Signed out,
each renders the sign-in prompt at 200 rather than 404.

**Production is not part of stage 4 and cannot be reached from this runbook.** There is no production
environment variable. See §2.4.

### Stage 5 — Post-activation smoke, signed in

Do this once, as a real account, before telling anyone the feature is available.

1. Save a **light** reflection at `/life/reflect`. It should succeed.
2. Save a **postmortem** at `/life/reflect?mode=postmortem`.
3. Confirm both landed with the right mode — this is the defect this package fixed, where every
   postmortem was recorded as a light reflection:

   ```bash
   psql "$OSF1_TARGET_DSN" -X -c "
   select mode, count(*) from public.yorisou_life_reflections group by 1 order by 1;"
   ```
   *Correct:* one row per mode you saved, with `postmortem` present.

4. Confirm the transactional audit rows exist, and that they carry a fingerprint rather than an
   account id:

   ```bash
   psql "$OSF1_TARGET_DSN" -X -c "
   select action, reason, entity_kind, created_at
     from public.yorisou_life_os_audit_events
    where action like 'yorisou.life.reflection%' order by created_at desc limit 5;"
   ```
   *Correct:* one `yorisou.life.reflection.created` row per saved reflection, with `reason` equal to
   the mode. `actor_fingerprint` is a 64-character hex string; the table stores no account id and no
   user text.

5. Confirm the append-only enforcement is live:

   ```bash
   psql "$OSF1_TARGET_DSN" -X -c "delete from public.yorisou_life_os_audit_events;"
   ```
   *Correct:* `ERROR: append_only: DELETE on yorisou_life_os_audit_events is not permitted`. If this
   succeeds, the trigger from `202608150001` is missing and the audit trail is not append-only.

---

## 4. Rollback

### 4.1 Order, and what each stage costs

Always roll back flags first. It is instant, needs no database access, and it stops new writes before
you touch a schema that has people's text in it.

| Stage you are at | Roll back by | Lossy? |
|---|---|---|
| route open (Preview) | remove `osf1_life_os_preview` from `YORISOU_CPV1_DEV_FLAGS`; redeploy. The routes 404 again | no |
| schema declared ready | unset `YORISOU_OSF1_LIFE_OS_SCHEMA_READY`. Writes stop immediately; existing rows are untouched and remain erasable by account deletion | no |
| code deployed, migrations applied | redeploy the previous build. The five tables keep their rows; nothing reads them | no |
| migrations applied | the per-migration blocks in §4.2, in reverse order: `160001` → `150002` → `150001` → `140002` → `140001` | **yes — see each** |
| merged, nothing applied | `git revert` the merge. The migrations are inert files | no |

Two-thirds of the rollbacks anyone will actually need are the first two rows. Reach for §4.2 only when
the schema itself is the problem.

### 4.2 The migration rollback blocks, as each file carries them

Each block below is the one written into the head of the migration it names, with one correction
noted where it is made.

**`202608160001_osf1_phase1_completion` — LOSSY, and it also reverses a governance property.**

The file's own ROLLBACK line names
`yorisou_osf1_memory_update(text, uuid, text, text, text, jsonb)` — six arguments. No such function
exists; the one the file creates takes five, and the six-argument `drop … if exists` silently drops
nothing. Use this instead:

```sql
drop function if exists public.yorisou_osf1_memory_update(text, uuid, text, text, jsonb);
-- then re-apply 202608140001 §8 and 202608150002 to restore the previous function bodies;
-- the two added columns are additive and may be left in place.
alter table public.yorisou_life_reflections drop column if exists options_considered;
alter table public.yorisou_life_reflections drop column if exists mode;
```

Read the file's own advice: **the two added columns are additive and may be left in place.** Dropping
`options_considered` deletes postmortem question 4 for every reflection that answered it. Dropping
`mode` deletes the record of which flow wrote each row — and that fact is not recoverable from
anywhere else, because an abandoned postmortem and a light reflection are byte-identical across the
answer columns. Drop them only if you have decided that data does not matter.

The function part is not merely a schema change. Re-applying the previous bodies moves
`reflection.created`, `memory.confirmed` and `memory.deleted` back to best-effort delivery — after
which the presence of an audit row is not proof the mutation happened, and its absence is not proof
it did not. If you do this, say so; do not leave the four rows in `AUDIT_DELIVERY_CLASS`
(`lib/server/lifeOs/audit.ts`) claiming "transactional" while the database no longer writes them.
`auditLifeOs()` will still throw `life_os_audit_transactional_action_not_writable_here:<action>` for
those four, so the application will not silently start writing them again.

**`202608150002_osf1_reflection_five_question_flow` — LOSSY.**

```sql
alter table public.yorisou_life_reflections drop column if exists tried;
alter table public.yorisou_life_reflections drop column if exists felt;
```

These are questions 2 and 3 of the light flow — "how it felt" and "what you tried". Dropping them
deletes what somebody wrote. The migration's own note that "no row exists anywhere" was true when it
was written and stops being true the moment stage 5 succeeds.

**`202608150001_osf1_life_os_audit_events` — LOSSY, and dangerous out of order.**

```sql
drop function if exists public.yorisou_osf1_audit_write(text, text, text, uuid, text, jsonb);
drop table if exists public.yorisou_life_os_audit_events;
```

Two things to know before running this.

First, **roll back `202608160001`'s functions first.** Dropping the audit table while the transactional
RPCs are live succeeds without complaint — PostgreSQL does not track the dependency through a
`plpgsql` body — and then every reflection save, memory confirmation, deletion and edit fails at
runtime. This is the fastest way to turn a rollback into an outage.

Second, the table is append-only and there is no selective removal: the triggers block `UPDATE`,
`DELETE` and `TRUNCATE`. Dropping the table is the only way to remove anything from it, and it removes
everything, including the only surviving evidence that any deleted memory ever existed. **RETENTION_POLICY_TBD** —
no retention period is set or assumed anywhere in this package. Twenty-four months is an unapproved
proposal, not the policy. Rows have no expiry and nothing removes them; inventing a purge here would
be deciding a policy that is a non-delegable Founder decision.

**`202608140002_osf1_erasure_plan_registration` — not lossy, but never roll it back alone.**

> ROLLBACK: re-apply `202608010110` verbatim. That restores the previous plan array; it removes no
> data and drops no object.

It also removes the five OSF-1 tables from POR-1's erasure plan. POR-1 does not discover tables — it
deletes exactly what the hardcoded array names, and reports `outcome = ok` either way. So rolling this
back while the five tables still hold rows means account deletion silently leaves a person's
current-state history, goals, reflections and memories on the server. Roll it back only as part of
dropping those tables.

**`202608140001_osf1_life_os_foundation` — the most destructive block in the package.**

```sql
drop function if exists public.yorisou_osf1_memory_delete(text, uuid);
drop function if exists public.yorisou_osf1_memory_confirm(text, text, text, text, text, boolean, uuid, uuid, uuid);
drop function if exists public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text);
drop function if exists public.yorisou_osf1_goal_set_status(text, uuid, text);
drop function if exists public.yorisou_osf1_goal_create(text, text, text);
drop function if exists public.yorisou_osf1_current_state_set_reflection(text, uuid, text);
drop function if exists public.yorisou_osf1_current_state_create(text, text[], text, text, text, text, text);
drop function if exists public.yorisou_osf1_user_context_upsert(text, text, text, text, jsonb);
drop function if exists public.yorisou_osf1_state_vocabulary();
drop table if exists public.yorisou_explicit_memories;
drop table if exists public.yorisou_life_reflections;
drop table if exists public.yorisou_goals;
drop table if exists public.yorisou_current_state_records;
drop table if exists public.yorisou_user_contexts;
alter table public.yorisou_experience_cards drop constraint if exists yorisou_experience_cards_shared_context_chk;
-- restoring the NOT NULLs requires no PRIVATE card to hold a null in them; see §Rollback in the doc
alter table public.yorisou_experience_cards drop column if exists lesson;
alter table public.yorisou_experience_cards drop column if exists title;
```

Three warnings.

1. The five `drop table` statements **destroy every row people wrote**. The staging rehearsal that
   proved this block works ran against tables holding a handful of synthetic rows
   (`STAGING_ACTIVATION_REPORT.md` §4, item 2). It is a schema rollback, not a data-preserving one.
2. The last two statements drop `title` and `lesson` from `yorisou_experience_cards`, a
   **pre-existing, live, production-tracked** table. Anything anyone wrote into those two fields is
   deleted. The rest of that table survives — the staging rehearsal verified specifically that
   rollback does not take the experience vertical with it.
3. The commented-out line is not decoration. Restoring the four NOT NULLs will fail if any PRIVATE
   card was created without `state_context`, `limitations`, `may_fit` or `may_not_fit` — which is
   exactly what this package made possible. Check before attempting it:

   ```bash
   psql "$OSF1_TARGET_DSN" -X -t -A -c "
   select count(*) from public.yorisou_experience_cards
    where state_context is null or limitations is null or may_fit is null or may_not_fit is null;"
   ```
   Anything above `0` means the NOT NULLs cannot be restored without deciding what to do with those
   cards. Leaving the columns nullable is the safe answer.

---

## 5. What to check if something is wrong

### 5.1 Reflections and memories fail to save; goals and state still work

**This is the signature of a transactional-audit failure, and it is new in this package.**

Four mutations now write their audit row inside the same database transaction as the mutation:
`yorisou.life.reflection.created`, `yorisou.life.memory.confirmed`, `yorisou.life.memory.deleted`,
`yorisou.life.memory.updated`. If the audit insert raises, the whole transaction rolls back. **A
person can lose a reflection because the audit table was unavailable.** That trade-off is deliberate —
after a hard delete the audit row is the only remaining evidence a memory existed — but it means an
audit-table problem presents to a user as "my reflection would not save".

The other nine events are asynchronous and best-effort: written by `auditLifeOs()` after the fact,
with failures swallowed. So the diagnostic shape is unusually clean:

| Symptom | Reading |
|---|---|
| reflection save, memory confirm, memory delete and memory edit all fail; goals, state, context, experiences and the timeline all work | the **audit** path is broken, not the database connection |
| everything fails, including goals and state | the connection, the credentials, or the whole schema — not the audit table |
| the assistant answers `{ok:false, reason:"assistant_unavailable"}` while everything else works | no AI provider is configured. Normal, not a fault |

The API surfaces both audit failure and a missing migration as **HTTP 500** with a body of the shape
`{"error":"life_os_persistence_failed:<status>"}` — `rpc()` in `store.ts` lifts out only the RPC's own
`osf1_*` named exceptions, and neither of these is one. So the HTTP response does not tell you which
it is. These three queries do:

```bash
# 1. Does the audit function exist at all?  (missing => 202608150001 was skipped or rolled back)
psql "$OSF1_TARGET_DSN" -X -t -A -c "
select count(*) from pg_proc where proname='yorisou_osf1_audit_write';"

# 2. Does the current reflection signature exist? (0 => 202608160001 not applied: the code is ahead
#    of the schema, §1.2)
psql "$OSF1_TARGET_DSN" -X -t -A -c "
select count(*) from pg_proc where proname='yorisou_osf1_reflection_create' and pronargs=15;"

# 3. Can the audit path actually write? Run it end to end. This inserts one real audit row.
psql "$OSF1_TARGET_DSN" -X -c "
select public.yorisou_osf1_audit_write(
  'runbook-probe','yorisou.life.state.created','current_state',null,'probe','{}'::jsonb);"
```

*Correct:* `1`, `1`, and a returned uuid. Query 3 failing while 1 and 2 return `1` isolates the fault
to the audit table itself — permissions, disk, a constraint, or a trigger someone added.

Query 3 writes a row you cannot delete: the table is append-only by trigger. `runbook-probe` is
fingerprinted like any other actor, so the row carries no account id, but it is permanent. Use it when
you need the answer, not routinely.

The rollback behaviour itself is proven, not assumed. `tests/life-os/postgres-acceptance.sh` installs
a trigger that forces the audit insert to raise, asserts that no reflection, memory, deletion or edit
survives, then removes the trigger and asserts the same call persists — the control that shows the
first result was the rollback and not a broken harness.

### 5.2 Every `/life` route 404s after you opened it

The route gate, not a missing route. In order of likelihood:

```bash
# On the deployment, confirm what the context actually resolves to.
# VERCEL_ENV=preview is required for the dev flag to be read at all.
echo "$VERCEL_ENV" "$YORISOU_CPV1_DEV_FLAGS"
```

- `VERCEL_ENV` is `production` → denied unconditionally. Nothing opens it (§2.4).
- `VERCEL_ENV` is empty and no marker is set → context `unknown` → denied (§2.3).
- The flag token is misspelled → dropped silently by `parseDevFlags()`. It must be exactly
  `osf1_life_os_preview`.
- The flag was set but the deployment was not rebuilt → environment-variable changes need a redeploy.
- `YORISOU_CPV1_DEV_FLAGS` was **replaced** rather than appended to, and now lists only the OSF-1
  token — check whether other preview surfaces went dark at the same moment.

### 5.3 `503 life_os_not_accepting_entries:denied_schema_not_ready`

The route is open and the write gate is not. The comparison is exact after trimming and
lower-casing, so `TRUE` and ` True ` are accepted while `1`, `yes`, `on` and `"true"` with the quotes
included all fail. Set it to the literal `true`, redeploy, and re-run the anonymous POST from stage
3 — a `401` means it took effect.

Before setting it, confirm the migrations really did run against **this deployment's** database, not
against a different one. `SUPABASE_URL` is the thing to check, and it is the mistake this variable
exists to catch.

### 5.4 `/experiences` broke after the deploy

This should be impossible — `payload()` emits `title`/`lesson` only when supplied. If it happened,
the deployed bundle predates that fix. Confirm against the running code, not the branch:

```bash
grep -n "MIGRATION-ORDERING SAFETY" -A 6 lib/server/experienceCards.ts
npm run test:osf1-regression-repair      # 14 assertions cover this ordering directly
```

Roll the deploy back rather than rushing the migration forward. `/experiences` is ungated and is used
by people who never asked for the Life OS.

### 5.5 Duplicate audit rows, or `life_os_audit_transactional_action_not_writable_here`

That error means application code called `auditLifeOs()` with one of the four transactional actions.
It is a guard, not a bug: the database already wrote that row inside the mutation's transaction, and
the audit table is append-only, so a duplicate could never be removed. Remove the call site. If
duplicates already exist, they are permanent — record that in the incident rather than attempting a
cleanup the schema forbids.

### 5.6 Things that will not help, and one that will hurt

- **Do not** set `YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true` to make a 503 go away. It is a statement of
  fact about the database, and setting it falsely produces the failure it exists to prevent.
- **Do not** run `supabase migration repair` for the OSF-1 versions. Repair rewrites history metadata
  and executes no SQL; using it here would mark migrations applied that were not.
- **Do not** `supabase db push` against production while the history reconciliation in
  `supabase/MIGRATION_SCOPE_MANIFEST.md` is outstanding (§1.5).
- **Do not** truncate or delete from `yorisou_life_os_audit_events` to reclaim space. The triggers
  refuse, and the only mechanism that would work is dropping the table (§4.2).

---

## 6. What this package does not contain

State these plainly if anyone asks, because the package name invites the opposite assumption.

- **No Life Graph and no relationships table.** The timeline sorts records that already exist by a
  timestamp they already carry, stores nothing, and asserts no relationship. A test fails if any
  migration in this package creates a table whose name contains `relationship`, `edge`, `graph` or
  `link`.
- **No autonomous agents.** No Companion Core, no Specialist Agents, no Legacy, no marketplace, no
  cross-project integration. The Reflection Assistant reads nothing stored, persists nothing, runs
  only when a person presses a button, and its output is never applied automatically.
- **No retention policy for the audit trail.** RETENTION_POLICY_TBD, written into the migration header
  and into the table comment where an operator will meet it.
- **No production exposure.** No migration applied, no flag set, every `/life` route 404s in
  production.

---

## Version history

- **v1.0 (2026-08-15)** — written for the Phase 1 completion package, against migrations
  `202608140001` through `202608160001`. No hosted apply has occurred; every verification in §3 is
  written to be run for the first time.
