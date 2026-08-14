# OSF-1 — Staging Activation Report

**Package:** YORISOU Phase 1 Life OS Activation & Capability Completion · **Base:** `main @ 84d1439b3b1be45024057727203e08f89ad0b419` · **Executed:** 2026-08-14

> **No hosted database was touched.** This procedure ran against a disposable PostgreSQL 17 cluster
> built by `initdb`, used, and destroyed. Production, Preview and every hosted Supabase project are
> unchanged. Migrations remain **applied nowhere**.

---

## 1. What this report is, and what it is not

**It is:** a full rehearsal of the activation sequence — baseline, apply, verify, RLS, erasure,
rollback — executed end to end against a real PostgreSQL 17 server running the repository's actual
migration lineage, with every result reproduced below.

**It is not:** evidence from a hosted staging environment. **This repository has no verified hosted
staging database.** The Preview Supabase project (`nbltsbonsnbpfptihomc`) failed its own control
probe during the activation audit — `yorisou_experience_cards` returned 404 there, so that project
does not carry the migration lineage and cannot serve as staging without a separate decision.

Reproduce with:

```bash
bash tests/life-os/staging-activation.sh
```

## 2. Environment

| | |
|---|---|
| PostgreSQL | 17.10 (Homebrew), disposable cluster, `initdb` → used → destroyed |
| Roles | `service_role` (login, bypassrls), `anon`, `authenticated` — as Supabase provisions them |
| Baseline | 23 migrations (every migration on main **except** the OSF-1 pair) |
| Under test | `202608140001_osf1_life_os_foundation.sql`, `202608140002_osf1_erasure_plan_registration.sql` |

## 3. Results

### Step 1 — baseline

23 baseline migrations applied. **OSF-1 tables present before activation: 0.** The precondition
holds: the apply is being tested against a genuinely un-migrated schema.

### Step 2–3 — apply, in order

| Migration | Result |
|---|---|
| `202608140001_osf1_life_os_foundation` | **APPLIED CLEANLY** |
| `202608140002_osf1_erasure_plan_registration` | **APPLIED CLEANLY** |

Applied in lineage order under `ON_ERROR_STOP=1`; neither produced a warning.

### Step 4 — table verification

The package's expected entity list, mapped to the tables that actually exist:

| Package name | Actual table | Result |
|---|---|---|
| user_context | `yorisou_user_contexts` | exists |
| current_state | `yorisou_current_state_records` | exists |
| goals | `yorisou_goals` | exists |
| reflections | `yorisou_life_reflections` | exists |
| memories | `yorisou_explicit_memories` | exists |
| experience (reused) | `yorisou_experience_cards` `+title +lesson` | **2 of 2** columns present |
| **life relationships** | — | **does not exist, and is not created** |

**On "life relationships":** no such table exists and none is added. Phase E of this package asks for
a *chronological* timeline and explicitly says not to build a Life Graph engine. A relationships
table is the Life Graph's first primitive, so creating one here would cross the line the package
draws. The timeline is assembled by ordering existing records by `created_at`; it stores no edges.

### Step 5 — RLS and the privilege matrix

| Table | RLS | `anon` SELECT | `service_role` INSERT |
|---|---|---|---|
| `yorisou_user_contexts` | **t** | f | f |
| `yorisou_current_state_records` | **t** | f | f |
| `yorisou_goals` | **t** | f | f |
| `yorisou_life_reflections` | **t** | f | f |
| `yorisou_explicit_memories` | **t** | f | f |

Row level security enabled on all five. `anon` cannot read. **`service_role` cannot INSERT** — every
write goes through a `SECURITY DEFINER` RPC, so application code holding the service-role key cannot
write to these tables directly.

### Step 6 — account erasure, executed

Two owners seeded; POR-1's real erasure body invoked for owner A only.

| | |
|---|---|
| owner A rows before | **5** (one per table) |
| owner A rows after | **0** |
| owner B rows | **1** — untouched |

### Step 7 — rollback

| Step | Result |
|---|---|
| `202608140002` → re-apply `202608010110` verbatim | **OK** — restores the previous erasure plan; removes no data, drops no object |
| `202608140001` → the ROLLBACK block at the head of that file | **OK** |
| OSF-1 tables after rollback | **0** |
| `yorisou_experience_cards` after rollback | **intact** — the pre-existing table survives, only `title`/`lesson` and the added constraint are removed |

The last row is the one that matters: rollback must not take the pre-existing experience vertical
with it.

## 4. What this does not prove

1. **No hosted staging.** Everything above is a local disposable cluster. Applying to a hosted
   database is a Gate 3 action requiring up/down on a staging copy, data-integrity assertions and a
   recorded backup snapshot reference — none of which a local rehearsal can supply.
2. **Empty-table rollback only.** The rollback dropped tables holding a handful of synthetic rows.
   Against a database with real user data the same block **destroys that data**. It is a schema
   rollback, not a data-preserving one.
3. **No concurrency.** Single-connection, no load, no competing migration.
4. **`service_role` here is `bypassrls`**, as in Supabase — so the RLS result above demonstrates the
   grant matrix, not policy enforcement against a JWT. That is the correct model for this codebase
   (no user JWT reaches PostgREST) but it is worth stating rather than implying more.

## 5. Activation sequence (unchanged)

The ordering in `OSF1_DEPLOYMENT_ORDER.md` stands and this rehearsal confirms each step is
executable. In particular: **apply the migrations, verify, and only then set
`YORISOU_OSF1_LIFE_OS_SCHEMA_READY`.** Declaring schema-ready before applying is the single action
that defeats every safeguard in the code.

---

## Version history

- **v1.0 (2026-08-14)** — Phase A of the activation package. Rehearsal only; no hosted apply.
