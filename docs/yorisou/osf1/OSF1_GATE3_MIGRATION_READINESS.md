# OSF-1 — Gate 3 Migration Readiness

**Lineage:** the five OSF-1 migrations on `main` @ `f6bb81f` · **Rehearsed:** 2026-08-15
**Harness:** `tests/life-os/gate3-migration-rehearsal.sh` · **Result: PASS, 40 assertions**
**Environment:** disposable PostgreSQL 17 cluster built by `initdb`. No hosted staging was reachable
and Docker is not running, so §2B's sanctioned fallback applies. **Production was never touched.**

> **This document is not an authorization to apply anything.** It reports that the lineage applies,
> reverses and re-applies against a real PostgreSQL. Applying to any hosted database — staging or
> production — remains a separate Founder act.

---

## 1. What this rehearsal proves that the acceptance harness did not

`tests/life-os/postgres-acceptance.sh` proves the lineage **applies** and that the resulting schema
behaves. It had never once executed the **reverse** path. Every OSF-1 migration carries a `ROLLBACK`
comment, and until this rehearsal every one of them was an untested assertion — a procedure written
by someone who was not going to be the person running it during an incident.

The rehearsal executes the full cycle:

```
baseline (pre-OSF-1)  →  apply lineage  →  validate  →  documented rollback
                      →  validate       →  RE-APPLY  →  validate identically
```

The re-apply is the step that earns the gate. A rollback that leaves a stale overload, drops a
constraint it does not recreate, or a re-apply that assumes a column is absent will pass a one-way
test and fail here.

## 2. Migration dependency analysis

| Migration | Purpose | Depends on | Objects created / changed | Rollback | Pre-OSF compatibility |
|---|---|---|---|---|---|
| `202608140001_osf1_life_os_foundation` | The five Life OS tables and their RPCs | pre-OSF-1 `yorisou_experience_cards` | 5 tables; 9 RPCs; RLS on all; adds `title`/`lesson` to experience cards; relaxes four sharing-context columns from `NOT NULL` to required-when-shared | drop tables + functions (lossy) | **Additive.** Verified: the baseline stands alone with zero Life OS tables |
| `202608140002_osf1_erasure_plan_registration` | Registers the five tables in POR-1 erasure | `140001`; POR-1 erasure function | Re-declares `yorisou_account_deletion_erase_database_unchecked` with 5 entries at the head of `v_plan` | re-apply the prior POR-1 body | Byte-identical otherwise; verified by the erasure test below |
| `202608150001_osf1_life_os_audit_events` | Append-only audit trail | `pgcrypto` | `yorisou_life_os_audit_events`; append-only triggers (UPDATE/DELETE/TRUNCATE); `yorisou_osf1_audit_write`; `RETENTION_POLICY_TBD` | drop function + table | Independent |
| `202608150002_osf1_reflection_five_question_flow` | Light reflection columns | `140001` | Adds `felt`, `tried`; **drops** the 10-arg reflection RPC and creates the 12-arg one | drop + re-create prior | Additive columns |
| `202608160001_osf1_phase1_completion` | Mode, options, `lesson`, memory edit, transactional audit | all above | Adds `mode`, `options_considered`; widens memory-type check; **drops 3 RPCs by exact signature** and recreates them with the audit insert inside; adds `yorisou_osf1_memory_update` | documented in-file, **rehearsed below** | Additive columns; RPC signatures change, so code must not precede it |

**The one-file rule, verified.** `202608160001` drops each affected function by its exact old
signature before recreating it. PostgreSQL overloads by signature, so a split across two migrations
would leave the earlier overload alive, un-granted and audit-less, with PostgREST free to dispatch to
it. Assertion D1 checks `pg_proc` for duplicates after both apply and re-apply: **zero**.

## 3. §2D verification results

Each check runs twice — after apply and after re-apply — and must give the same answer both times.

| # | Check | Applied | Re-applied |
|---|---|---|---|
| D1 | No duplicate RPC overload | PASS | PASS |
| D2 | No `PUBLIC EXECUTE` on any `SECURITY DEFINER` mutation RPC | PASS | PASS |
| D3 | `anon` / `authenticated` hold no execute on those functions | PASS | PASS |
| D4 | `service_role` **does** hold execute on all four (grants match intent, not merely deny-all) | PASS | PASS |
| D5 | RLS enabled on every Life OS table | PASS | PASS |
| D6 | Pre-OSF-1 experience card intact; old `/experiences` write path still operates | PASS | PASS |
| D7 | An unconfirmed memory is impossible at the schema level | PASS | PASS |

D2 and D4 are deliberately paired. A migration that revoked everything from everyone would satisfy
D2 and D3 and break the product; D4 is what stops the gate passing on a broken grant set.

`yorisou_osf1_state_vocabulary` is excluded from D2/D3 by name — it is `immutable`, takes no
argument, touches no table, and returns a constant already shipped to every browser. Naming the
exception beats letting the check imply a stricter rule than the code enforces.

## 4. Transactional audit rollback — proven, not asserted

The claim is that the audit insert shares the mutation's transaction. The only honest test is to make
the audit insert **fail** and look for the domain row. The rehearsal installs a trigger that raises
on insert into the audit table, then:

- `yorisou_osf1_reflection_create` → raises, and **the reflection row count is unchanged** (0 → 0).
- `yorisou_osf1_memory_confirm` → raises, and **no memory row exists**.
- The trigger is dropped and the same call is repeated: it **succeeds**, with **exactly one** audit
  row for the new entity. Without this control the two tests above would prove only that the
  function is broken.

## 5. Rollback and re-apply

The rollback executed is the one written in `202608160001`'s own header, minus the two column drops
that migration explicitly marks **LOSSY**. Results:

- the documented rollback **executes cleanly** — the procedure as written is correct;
- **every function it created is removed**; `pg_proc` holds none of the four. No orphan overload;
- the pre-OSF-1 experience card is still intact;
- **rows written before the rollback survive it**, including their stored `mode`. Rolling back
  *functions* must never lose *data*, and it does not;
- `202608160001` **re-applies onto the rolled-back schema**, and the re-applied RPC creates a
  reflection, round-trips `options_considered`, and still fires the transactional audit.

## 6. Account erasure across the whole cycle

After apply → rollback → re-apply, POR-1 erasure removes the Life OS rows, the audit trace
**survives**, and no raw account id was ever stored in it.

**A correction to my own first run.** The initial rehearsal reported that a Life OS row survived
erasure. That was a defect in my test, not in the product: POR-1's erasure is job-scoped and raises
`account_deletion_job_not_found` when called without an existing deletion job — erasure is never a
standalone verb. The harness now creates the job first, as the acceptance harness already did. The
failure was mine; the erasure path is correct.

## 7. Atomicity

Each migration file is applied by `psql -v ON_ERROR_STOP=1` as one unit; `202608160001`'s
drop-and-recreate of three functions is a single file, so a partial apply cannot leave one function
dropped and another recreated. The documented rollback is wrapped in `begin; … commit;`.

**Known limitation, stated:** PostgreSQL cannot run `create index concurrently` or certain `alter
type` operations inside a transaction. None of this lineage uses them, so every file here is
transactional — but that is a property of these five files, not a general guarantee for future ones.

## 8. Reproducing

```bash
bash tests/life-os/gate3-migration-rehearsal.sh
```

Builds its own cluster, applies the real migration files, and destroys the cluster. Refuses any
`OSF1_DATABASE_URL` that is not localhost, is a Supabase host, or does not name the disposable
database — a harness that can be aimed at a real database by setting one variable eventually will be.

## 9. Gate 3 status

**READY FOR FOUNDER-AUTHORIZED APPLY.** The lineage applies, reverses and re-applies against a real
PostgreSQL 17 with 40 passing assertions and no failures.

Not claimed: that it has been applied anywhere; that a hosted database behaves identically to a
disposable cluster (Supabase's role set and extension schema differ, which is why
`yorisou_osf1_audit_write` uses built-in `sha256` rather than pgcrypto's `digest`); or that
applying it is authorized. The apply order and the operator steps are in
`OSF1_DEPLOYMENT_ORDER.md` and `PHASE1_ACTIVATION_RUNBOOK.md`.
