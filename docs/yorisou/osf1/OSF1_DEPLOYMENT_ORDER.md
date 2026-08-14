# OSF-1 — Deployment Order and Activation Runbook

**Package:** OSF-1 YORISOU OS Foundation v0.7.0 Phase 1 · **PR:** [#132](https://github.com/MrShamann/yorisou-online/pull/132) · **Status:** `OPEN_UNMERGED`. No migration applied in any environment.

> **The migration must be applied before the Life OS accepts a single write.** This document exists
> because that ordering was not merely undocumented — the code enforced the opposite, and the
> activation audit proved it against a real database. It is now enforced in code as well as written
> here, which is the only reason a runbook is enough.

---

## 1. What went wrong, so the rule is not mistaken for ceremony

`payload()` in `lib/server/experienceCards.ts` named `title` and `lesson` on **every** experience-card
insert. Those columns exist only after `202608140001`. Against a database where that migration has not
run — which is every environment today — PostgREST rejects the whole statement.

The damage was not confined to the new feature. `/experiences` is a **pre-existing, live, ungated**
surface whose own client never sends `title` or `lesson`; it would have broken as collateral the
moment this code deployed. Proven on a real PostgreSQL 17 with all 23 non-OSF-1 migrations applied and
the OSF-1 pair withheld:

```
columns found: 0
insert naming title/lesson   -> ERROR: column "title" of relation "yorisou_experience_cards" does not exist
insert without them          -> INSERT 0 1
```

## 2. What now enforces the ordering

Three independent mechanisms, so the runbook is a description rather than the safeguard:

| Mechanism | Where | What it prevents |
|---|---|---|
| `payload()` emits `title`/`lesson` **only when supplied** | `lib/server/experienceCards.ts` | the code is deployable against either schema; `/experiences` cannot break |
| `lifeOsAccess()` — route gate, **default closed** | `lib/life-os/access.ts` | `/life/*` and `/api/life-os` 404 in production and unknown contexts |
| `lifeOsMutationAccess()` — write gate, **strictly narrower** | `lib/life-os/access.ts` | no Life OS write is attempted until an operator declares the migration applied |

The write gate is the load-bearing one. Reads degrade to an empty state when the tables are absent;
writes cannot degrade — they fail, and someone who has just typed a seven-question reflection loses
it. So a write is refused up front with a named `503 life_os_not_accepting_entries:*`, before the
person is invited to type anything.

## 3. The order

```
1. MERGE            (Founder only)
                    Nothing changes for users: lifeOsAccess is closed in production.
                    /experiences keeps working — payload() no longer names the new columns.

2. APPLY 202608140001 and 202608140002   (Gate 3)
                    Additive-only. Up/down tested on a staging copy. Data-integrity assertions.
                    Backup snapshot reference recorded. DO NOT set any env var in this step.

3. VERIFY           Confirm the five tables and the two new columns exist in the target database,
                    and that the erasure plan names all five:
                      select count(*) from information_schema.columns
                       where table_name='yorisou_experience_cards' and column_name in ('title','lesson');
                      -- expect 2
                    npm run test:osf1-erasure-coverage   (repository-side)

4. DECLARE SCHEMA READY
                    Set YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true in that environment, and ONLY after
                    step 3 passes there. This variable is not a feature switch: setting it while the
                    migration has not run re-creates precisely the failure it exists to prevent.

5. OPEN THE ROUTE   Preview: add the dev flag `osf1_life_os_preview` to YORISOU_CPV1_DEV_FLAGS.
                    Production: requires a Gate 5 decision and a code change — lifeOsAccess denies
                    production unconditionally today, by design. There is no production env var.
```

**Reversing steps 2 and 4 is the failure mode.** Declaring the schema ready before applying the
migration is the one action that defeats every safeguard above.

## 4. Rollback at each stage

| If you are here | Roll back by |
|---|---|
| after merge, before migration | `git revert` the merge. The migrations are inert files; nothing was applied |
| after migration, before schema-ready | unset nothing — the Life OS is still refusing writes. To undo the schema, run the ROLLBACK block at the head of `202608140001` (**this destroys the five tables' data**; they are empty at this point) |
| after schema-ready | unset `YORISOU_OSF1_LIFE_OS_SCHEMA_READY`. Writes stop immediately; existing rows are untouched and remain erasable by account deletion |
| after route open (Preview) | remove `osf1_life_os_preview` from `YORISOU_CPV1_DEV_FLAGS`. The routes 404 again |

## 5. What is NOT covered by this runbook

Production exposure. `lifeOsAccess()` returns `denied_production` unconditionally and no environment
variable overrides it — opening the Life OS in production requires a code change plus a Gate 5
decision (staged rollout plan, kill switches tested live, consent-comprehension copy verified,
Founder acceptance recorded). That is deliberate: the audit found the original package had no way to
stage a rollout at all, and a runbook that could be followed all the way to public exposure would
reintroduce the same gap in prose.

---

## Version history

- **v1.0 (2026-08-14)** — written during the regression-repair package, after the activation audit
  proved the ordering defect against a real un-migrated schema.
