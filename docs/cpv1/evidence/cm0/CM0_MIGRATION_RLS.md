# CPV1-CM0 — Migration / RLS verification (isolated disposable DB)

Self-contained CM0 migrations verified in a **throwaway** database `cpv1cm0_verify` in the local Supabase
Postgres cluster, dropped afterward. Script: [`cm0_rls_verify.sh`](./cm0_rls_verify.sh) · log:
[`cm0_rls_verify.out`](./cm0_rls_verify.out). **No production. Dev DB untouched** (separate database, dropped).

## Self-containment (CM0 §6)
The CM0 CPV1 schema depends ONLY on CPV1-owned helpers defined by
`202607200001_cpv1_foundation_prereqs.sql` (`yorisou_cpv1_current_account_id()` +
`yorisou_cpv1_block_mutation()` + pgcrypto). **No APP-2 dependency** — the disposable DB had NO
`yorisou_current_account_id` / `yorisou_app2_block_mutation`, and the migrations still applied (check 2).

## Repository-portable verification (MR0 §4)
`cm0_rls_verify.sh` carries **no hardcoded user-specific filesystem path**: it derives the repository root
from its own location (`git -C "$SCRIPT_DIR" rev-parse --show-toplevel`) and reads the Supabase container
from `SUPABASE_DB_CONTAINER` (default `supabase_db_yorisou-online`). It runs from any working directory on
any clone. It remains **disposable-only** — it creates a throwaway local database and drops it, and never
connects to a hosted database. Re-run under MR0 from a non-repo working directory (with the container var
set) reproduced the **exact 45/45** result; the tracked `cm0_rls_verify.out` is the pure re-run output.

## Rollback classification
`LOCAL_DISPOSABLE_SCHEMA_ROLLBACK` — dropping the CPV1 tables/columns/functions destroys their data; safe
only in an isolated disposable local/test DB; **NOT a production rollback**; no production migration
authorized. Enforced by the migration validator (fails on a drop-based rollback lacking the classification
or claiming "non-destructive").

## Result — 45 checks, 0 failures (CM0.1: 25 migration/RLS + 20 registry schema-contract)
1. migrations apply in order (200001 prereqs → 002 → 003 → 004), SELF-CONTAINED. 2. CPV1-owned helpers
present (2), APP-2 helpers absent (0). 3–4. RLS enabled + forced on all 4 CPV1 tables. 5. grants: anon none;
authenticated SELECT-only on history. 6. anon denied. 7. user isolation (A sees 1 of 2). 8. forged-id
denied (WITH CHECK, via CPV1-owned account resolver). 9. exact identity persists. 10–11. independent consent
+ revocation on next read. 12. deleted flag. 13. data-rights audit rejects personal free text (a/b denied,
c OK). 14–15. append-only UPDATE/DELETE blocked by `yorisou_cpv1_block_mutation`. 16. registry snapshot
admin/service-role only. **CM0.1 §7 registry schema-contract (20 checks):** all 5 activation states
accepted under valid dimensions; `rights_blocked`/`contract_only` rejected; `implemented_route_verified`
rejected when rights uncleared / content incomplete / privacy unreviewed / tests not passing / no
production-main route; `public_active` rejected when deployment unverified / verified-without-evidence-ref /
Founder unverified-or-closed / Founder-open-without-decision-ref; a fully-valid `public_active` row
accepted; authenticated denied + service_role retains registry access. 17. teardown. 18. reapplication.
19. disposable DB dropped (0 rows survive).
