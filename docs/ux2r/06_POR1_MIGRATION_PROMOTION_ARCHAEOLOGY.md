# POR-1 — Migration promotion archaeology (blocking finding)

> Produced by the POR-1 §6.1 mandated archaeology, 2026-07-30, before any Production mutation.
> **Production was not touched.** Status: promotion BLOCKED pending the resolution below.

## Finding: the three `yorisou_recommendation_*` names carry two incompatible schemas, and both are live

The 12 `PREVIEW_ONLY` migrations cannot be promoted to Production lineage as they stand. Three table
names collide with legacy `PRODUCTION_LINEAGE` migration `202607110003` (the governed recommendation
graph, merged as PR #100), and the collision is **structural, not cosmetic**.

Verified against the two live databases (read-only):

| table | Production (`202607110003`, **holds real data**) | Preview (CPC-1) |
|---|---|---|
| `yorisou_recommendation_sets` | `project_id, request_key, request_context, inputs_used, excluded_inputs, policy_version, provider, model, estimated_cost_cents, status` | `result_row_id, accepted_result_id, original_result_id, eligibility_basis, content_version, source_surface, generated_at, lifecycle_state` |
| `yorisou_recommendation_items` | `project_id, recommendation_set_id, resource_id, experience_id, ranking_factors, disclosure, lifecycle_status` | `set_id, owner_account_id, result_row_id, recommendation_key, source_class, commercial_status, reason_code, limitations_code` |
| `yorisou_recommendation_actions` | `project_id, recommendation_item_id, idempotency_key, note` | `item_id, set_id, result_row_id, intent_nonce, sequence_no` |

Beyond `id`, `owner_account_id` and `created_at` there is essentially no overlap.

Production currently holds **5 recommendation sets, 9 recommendation actions** (plus 5
`yorisou_test_results`, 5 `yorisou_private_recommendations`, 1 `yorisou_ai_reflections`,
1 `yorisou_experience_cards`, 1 `yorisou_ai_runs`). Production is **not** an empty database.

### Both consumers are live in the same application

- `lib/server/recommendationGraph.ts` — legacy, in Production today, uses the legacy shape.
- `lib/server/recommendationStore.ts` — CPC-1, new on this branch, uses the CPC-1 shape.

`app/api/recommendations/route.ts` and `app/api/recommendations/[id]/route.ts` import **both**. One
set of table names cannot satisfy both shapes.

### Why following the package literally would have broken Production

The CPC-1 migrations create these tables with `create table if not exists`:

1. On Production the statements would **silently no-op** (the legacy tables already exist), the
   migration would report success, and every CPC-1 recommendation path would then fail at runtime on
   missing `set_id` / `result_row_id` / `sequence_no` / `lifecycle_state` — a latent production
   outage that a green migration ledger would have concealed.
2. `202607280006`/`202607280007` would `add column ... sequence_no` and create an idempotency index
   **on the legacy table holding 9 real rows**, merging two unrelated schemas in place.
3. Had the CPC-1 shapes instead been forced to win, `/recommendations/graph`'s legacy path and the
   5 existing sets / 9 existing actions of real Production data would have been orphaned.

Preview never exhibited this because Preview never had the legacy `202607110003` recommendation
tables — the CPC-1 migrations created all three from scratch there, so the CPC-1 shape won by
default and the hosted acceptance train passed honestly against it.

## Required resolution (rename the NEW side)

The legacy objects stay as they are: they are in Production, they hold real data, and they back a
working surface. The CPC-1 objects exist only in Preview and can be recreated freely. Therefore the
CPC-1 recommendation objects must be renamed before promotion — proposed
`yorisou_canonical_recommendation_{sets,items,actions}`, mirroring how the canonical result spine is
already named distinctly from the legacy result surface.

Work required, in order:

1. **Migrations** — rename in `202607280004`, `202607280005`, `202607280006`, `202607280007`, plus any
   reference from the erase path in `202607270004`. Verify the CPC-1 RPC names
   (`yorisou_recommendation_eligibility` / `_materialize` / `_act`) against the legacy
   `record_yorisou_recommendation_action`; they do not currently collide, but they should be renamed
   with the tables so the two families stay legible.
2. **Application** — `lib/server/recommendationStore.ts` (the only CPC-1 consumer of the raw names).
3. **Harness** — `tests/cpc1-acceptance/fixtures.ts`, `scripts/ux2/preview-cleanup.sql`.
4. **Preview database** — drop the CPC-1 recommendation objects and re-apply the renamed chain.
5. **Re-validate** — full deployment-independent battery, exact-SHA Preview deployment, and the
   complete hosted acceptance train re-run. The renamed objects must be proven, not assumed.
6. **Only then** — build the Production-lineage promotion delta with new canonical timestamps, run
   the §6.3 fresh-database rehearsal from full Production lineage + delta, and proceed to merge.

## Standing constraint discovered alongside it

`main` is the Vercel production branch (`productionBranch: main`), so **merging PR #126 deploys to
Production immediately**. The POR-1 literal order (merge → Production migration → Production
deployment) would therefore put the new application in front of users before its schema exists. The
safe order is:

```
implement → feature flag default OFF → apply the additive Production migration
→ merge (auto-deploys; flag off, no behaviour change) → verify Production healthy
→ enable the flag → Production acceptance
```

## State at the time of this document

Production **untouched**: 12 migrations, 42 tables, CPC-1 tables and RPCs absent, `main` still
`c8d8a8ad6a72949c248adb098a626d1ab9d6a579`, no deployment triggered, no write of any kind issued.
PR #126 remains DRAFT / OPEN / UNMERGED at `de40edd`.

---

# Addendum — the promotion compiler withheld a grant it never revoked (2026-08-05)

**Package:** POR-1-PROMOTION-PRIVILEGE-REPAIR-1. **Found by:** LOCAL-LAUNCHER-REFRESH-1, applying
the promotion lineage to a real Supabase-shaped database for the first time.

## The failure

`202608010108` refused the promotion:

```
POR-1: yorisou_line_subject_lock is a lock building block, not an entry point   (SQLSTATE P0001)
```

The assertion was right. `service_role` really did hold `EXECUTE` on the helper.

## Why every previous rehearsal passed

`NO_SERVICE_ROLE_EXECUTE` is honoured in `scripts/por1/compile-promotion.mjs` by **not emitting a
grant**, with a comment recording the intent. That is sufficient only where the sole route to the
privilege is `PUBLIC` — which is true of bare PostgreSQL, and therefore true of
`scripts/por1/rehearse-promotion.sh` and `tests/por1/catalogue-baseline.sh`, which create the three
platform roles but no default privileges.

A Supabase project carries:

```sql
alter default privileges in schema public grant execute on functions to service_role;
```

so `create function` in `public` grants `service_role` EXECUTE **directly**. The generated
`revoke ... from public` cannot remove a directly-held privilege, and the intent in the comment was
never enforced. **Not granting is not the same as not granted.**

The Preview lineage had this right by hand: `202607310002` revokes the helper from `public`, `anon`,
`authenticated` **and** `service_role`. Live Preview still reads `service_role EXECUTE = false`. The
compiler — which deliberately re-derives grants rather than copying them, because the Preview grants
had a real hole (`202608010001`) — lost that fourth revoke in translation.

## The repair

The exception is now **asserted, not merely skipped**. For every function in
`NO_SERVICE_ROLE_EXECUTE` the generator emits a role-conditional explicit revoke; ordinary entry
points keep their grant, and no blanket service-role revoke was introduced. `202608010108` was **not
weakened** — the fix is upstream of the assertion that caught it.

Regenerated from the same catalogue inputs, the change is four lines in
`202608010104_por1_canonical_line_activity.sql` and nothing else (`--check` reported `drift: 0`
before the compiler edit, proving the inputs reproduce the checked-in set byte-for-byte, and
`drift: 1` after — that single file).

## Proof

Both rehearsals ran on disposable PostgreSQL 17 clusters carrying the Supabase default privilege:

| | original P4 | regenerated P4 |
| --- | --- | --- |
| P4 applies | yes | yes |
| `service_role` EXECUTE on helper after P4 | **true** | **false** |
| P8 | **fails P0001** | passes |
| P9 · P10 · P11 | not reached | pass |

Effective privilege on the helper after the fixed run: `PUBLIC`, `anon`, `authenticated`,
`service_role` all false. Across the promoted set, 91 `yorisou_*` functions remain
service-role-executable and exactly three do not — the lock helper plus
`yorisou_account_deletion_erase_database_unchecked` and `yorisou_account_erase_append_only_families`,
which 109–111 already withhold correctly. `anon_executable_definer` is 0. Re-applying P4 leaves the
privilege state unchanged and P8 still passes, so the block is idempotent as the migration claims.

## Recorded, not fixed here

- The manual `revoke ... from service_role` issued against the local database during
  LOCAL-LAUNCHER-REFRESH-1 was an **incident workaround**. This compiler change is the durable fix;
  the local database already holds the corrected end-state, so nothing was replayed to reach it.
- `tests/por1/populated-lineage-rehearsal.sh` fails two assertions —
  `yorisou_account_deletion_erase_database(p_owner_account_id text)` missing, and an
  `executor_claim` body differing from the promoted contract. **Both reproduce identically at
  `a1cf81c` with this package's changes stashed**, so they are pre-existing: the contract is derived
  from Preview, while 110 and 111 change which signatures exist. Out of scope here.
- `npm run por1:promotion-verify` against the live Preview catalogue reports two sequences usable by
  `anon`/`authenticated`. Also pre-existing Preview state, untouched by this package.

## Environments

Production and governed Preview were **read only**. Production's ledger records no `2026080101*`
version and has no `yorisou_line_subject_lock`, so P4 was still an unpromoted Draft migration and
regenerating it in place was safe. Preview has no `supabase_migrations` ledger; its objects come
from the Preview lineage, not from P4. No hosted migration was applied, no environment variable
changed, no deployment triggered.
