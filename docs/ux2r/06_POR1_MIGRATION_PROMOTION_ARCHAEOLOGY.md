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
