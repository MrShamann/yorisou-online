# CPV1-R1 §12 — Migration / RLS verification (isolated disposable DB)

**Date:** 2026-07-19 · **Runner:** local Supabase Postgres cluster (`supabase_db_yorisou-online`), a **throwaway** database `cpv1_r1_verify` created, verified, and dropped. Script: [`cpv1_rls_verify.sh`](./cpv1_rls_verify.sh) · full log: [`cpv1_rls_verify.out`](./cpv1_rls_verify.out). **No production. No touch to the dev database** — verification ran in a separate database that was dropped at the end (0 synthetic rows survive; the dev DB's CPV1 tables were never modified).

## Rollback classification

`LOCAL_DISPOSABLE_SCHEMA_ROLLBACK` — the rollback recipes in migrations 002/003/004 drop CPV1 tables/columns/constraints, which **destroys the data they hold**. This is safe **only** in an isolated disposable local/test database. It is **not** "non-destructive"; it is **not** approved for any persistent environment; **no production migration is authorized**. A persistent-environment change would require a separately approved, data-preserving forward correction. The migration comments were corrected to say exactly this.

## Result — 25 checks, 0 failures (covering all 19 §12 points)

| # | §12 point | Result |
|---|---|---|
| 1 | Migrations apply in the correct order (002→003→004) | ✅ |
| 2 | Reapplication behavior is intentional | ✅ full re-run intentionally errors on the once-only trigger/constraints (migrations run once; column adds are `if not exists`) |
| 3 | RLS is enabled | ✅ all 4 CPV1 tables |
| 4 | Forced RLS configured where required | ✅ `force row level security` on all 4 |
| 5 | Grants match intended operations | ✅ anon has **no** grants; authenticated has SELECT-only on history |
| 6 | Anonymous users are denied | ✅ anon SELECT on observations → permission denied |
| 7 | Authenticated users see only their own rows | ✅ user A sees 1 of 2 rows |
| 8 | Users cannot forge another account id | ✅ inserting `account_id=acctB` as acctA → RLS WITH CHECK violation |
| 9 | Exact result/version confirmation identity persisted | ✅ history row keeps exact `object_ref` + `method_version` |
| 10 | Independent consent permissions persisted | ✅ independent booleans stored |
| 11 | Revocation takes effect on subsequent reads | ✅ `community_use` revoked → `false`; `report_use` independently unchanged |
| 12 | Deleted/rejected observations cannot be consumed downstream | ✅ `deleted` flag persists; `canUseDownstream` (app layer) excludes on this flag |
| 13 | Data-rights audit events cannot contain personal free text | ✅ event without `reason_code` denied; personal free-text `safe_detail` denied; reason-coded fixed message accepted (migration 004 CHECK) |
| 14 | History events inserted only through intended paths | ✅ authenticated cannot insert (SELECT-only grant); service_role inserts |
| 15 | History update/delete restrictions work | ✅ UPDATE + DELETE blocked by the append-only trigger |
| 16 | Registry snapshots remain admin/service-role only | ✅ authenticated denied; service_role reads |
| 17 | Teardown succeeds in the disposable database | ✅ table drops succeed |
| 18 | Reapplication succeeds after teardown | ✅ 002→003→004 re-apply clean |
| 19 | Final cleanup leaves no synthetic CPV1 rows | ✅ disposable database dropped; 0 remain |

## Grant / RLS / expectation audit (no denied-insert described as success)

- Every "append-only event creation" path that a **denied** insert would take is reported as **denied**, never as success (checks 6, 14/15).
- No grant is present that a policy does not intentionally support: anon has zero grants (denied at grant level); authenticated has full CRUD on obs/consent (owner policy) and SELECT-only on history (append-only); service_role has the broader admin/service grants. Registry snapshot has no anon/authenticated grant or policy.
