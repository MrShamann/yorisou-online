# POR-1 — Founder decision: append-only families and account erasure

```
YORISOU_POR1_APPEND_ONLY_ERASURE_DECISION_GOVERNED_DELETE_WITH_CONTENT_FREE_TOMBSTONE
```

Decided 2026-08-04 by the Founder, after M4 executed the real governed deletion and it failed.

## The conflict

M4 reached `database_erasure` and hit:

```
append_only: DELETE on yorisou_daily_state_history_events is not permitted
```

Six tables refuse DELETE through append-only triggers. Two are in the 26-family deletion contract,
and one — `yorisou_interpretation_responses` — is a promoted POR-1 table. `erase_database` is one
function, so a single raise aborted the whole transaction and **nothing** was erased.

Two governed guarantees pointed in opposite directions: history that cannot be rewritten, and a
person who asks to be deleted being deleted.

## The decision

**Append-only is a guarantee about the ORDINARY application path.** It exists so a record of what
someone reported cannot be silently altered. It was never a promise to keep their content after they
asked to be forgotten. So the original rows are physically removed, and a new content-free tombstone
records that a deletion happened.

Rejected, each for a reason:

| Not chosen | Why |
|---|---|
| in-place de-identification | an UPDATE on an append-only row is the exact rewrite the trigger exists to prevent, and it leaves altered remnants of the original content |
| excluding these families from erasure | "it is append-only" is not a privacy basis for retaining content |
| a general trigger bypass | a bypass reachable from ordinary code is a larger hole than the one it closes |

## Per family

| Family | Decision |
|---|---|
| `daily_state_history_events` | delete all content events; write one content-free `deleted` tombstone per erased record |
| `daily_state_record_versions` | physically delete every version; no tombstone — the daily-state tombstone is the artifact |
| `values_assessment_events` | delete all content events; write one content-free `deleted` tombstone per erased assessment |
| `values_assessment_versions` | physically delete every version; no tombstone |
| `interpretation_responses` | physically delete the whole response history including the supersession chain; no interpretation-specific tombstone |
| `candidate_events` | **no bypass.** Classified separately below |

### `candidate_events` — classified, not exempted

It carries no `owner_account_id`, `erase_database` does not target it, and Principal C has no row in
it. Classification: `NOT_APPLICABLE_TO_ACCOUNT_ERASURE`. Ordinary append-only protection is unchanged.
It was not given a bypass merely because it shares a trigger shape with tables that needed one.

### `interpretation_responses` — already correct

It already had a governed, result-scoped erasure exception
(`yorisou.erasure_context = <result_row_id>`), and `erase_database` reaches it through
`yorisou_assessment_result_erase`. It was never the blocker. No second mechanism was introduced.

## The tombstone contract

May contain only:

```
event_type = deleted · opaque record reference · reason_code = user_deleted
version = 0 · retention_expires_at (12 months, the existing DCI precedent)
```

Must never contain:

```
owner_account_id · email · answers · scores · result code · correction or reason text
state content · free text · session, token or channel identity
```

`owner_account_id` was `NOT NULL` on both event tables. Rather than dropping the constraint outright
— which would let an *ordinary* event be written with no owner — the column became nullable and a
shape constraint restores the rule for every row that is not a tombstone:

```sql
check (owner_account_id is not null or event_type = 'deleted')
```

The same pattern `yorisou_account_deletion_jobs_owner_shape` already uses.

## Authorization

A transaction-local setting is a signal, not an authorization: `set_config` is reachable from any SQL
a role can run. So the trigger consults `yorisou_account_erasure_authorized(owner)`, which re-derives
from durable state whether a real deletion is genuinely in progress **for that row's owner**:

```
the job exists and belongs to this owner
a manifest was FROZEN — the scope was fixed before anything was destroyed
the irreversible boundary was crossed
the cursor is exactly database_erasure
```

Forging the setting therefore accomplishes nothing.

## Proven, not asserted — `npm run test:por1-append-only-erasure`

```
ordinary path      direct DELETE, UPDATE and TRUNCATE all still denied
forged context     random uuid · non-uuid · real job not crossed · crossed but wrong cursor ·
                   right cursor but no frozen manifest — all denied
scope isolation    A's FULLY VALID context cannot delete B's row, nor run an unscoped DELETE
erasure            A's content and versions reach 0; B is untouched
tombstones         content-free, owner absent, retention bound present
```

**Every negative control asserts rows existed first.** A `BEFORE DELETE ... FOR EACH ROW` trigger
only fires per row, so a control run against an empty table passes without testing anything. That
produced two false "bypass!" results and one worthless "held" result while this was being built.
Vacuity in either direction is the failure mode, so `expect_rows` guards every case.

## Migration

`supabase/migrations/202608010109_por1_append_only_erasure_contract.sql`

```
PRODUCTION_LINEAGE · FORWARD_ONLY · CONTROLS_OFF_INERT
MUST_APPLY_BEFORE_DELETION_EXECUTOR_ACTIVATION
```

Rollback class: `SCHEMA_REVERSIBLE_WHILE_FLAGS_OFF`. It replaces function bodies and relaxes one
NOT NULL behind a shape constraint; with the deletion executor off, nothing invokes it.
