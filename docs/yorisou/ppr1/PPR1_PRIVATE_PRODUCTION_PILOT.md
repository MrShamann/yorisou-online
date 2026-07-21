# PPR-1 — DCI + Yorisou Values PRIVATE Production Pilot (Founder/Admin-only)

> **Founder authorization:** `YORISOU_PPR_1_PRIVATE_PRODUCTION_PILOT_AUTHORIZED`.
> This is a **private** Founder/Admin-only Production pilot — **NOT** public activation. Neither
> `daily-check-in` nor `yorisou-values` becomes public; both remain gated/404 for anonymous and
> non-admin callers, and absent from navigation, catalog, sitemap and share surfaces. The Method
> Registry continues to report both methods as non-public.
>
> **Founder session decision (recorded):** the Production private-pilot acceptance (§12.3) requires an
> authorized Founder/Admin session on `yorisou.online`, which the executor cannot obtain safely (no
> stored admin session; forbidden from entering a password, fabricating an identity, or granting admin).
> The Founder selected **Option 4**: merge the verified private-pilot gate with the pilot flag **absent**
> (routes stay 404), apply the two authorized additive migrations to `yorisou-production`, verify the
> dormant schema, **do not** set `YORISOU_PRIVATE_PILOT_FLAGS`, **do not** activate, **do not** touch
> Founder credentials, and **do not** run authenticated acceptance — then return
> **`YORISOU_PPR_1_BLOCKED_NO_AUTHORIZED_FOUNDER_ADMIN_SESSION`** with the schema left dormant.

Starting `main`: `798407b9084dd929f3714824eda4ff64fe39af1e`. Branch: `feat/ppr-1-private-production-pilot`.

## 1. The Production private-pilot gate (separate from the Preview gate)

A **new, pure, server-only** gate authorizes ONLY true production, under a SEPARATE env var and separate
exact tokens, and never weakens the existing Preview gate.

- `lib/cpv1/productionPilot.ts` — pure gate (no admin identifiers, no secrets):
  - `YORISOU_PRIVATE_PILOT_FLAGS` env var; EXACT tokens only:
    `dci_daily_check_in_private_pilot`, `yorisou_values_private_pilot`. Unknown values / `true` / `1` /
    typos / client params never authorize.
  - `isProductionPilotFlagEnabled(flag)` is **false in every non-production context** regardless of the
    env var — the pilot can never turn on outside production.
  - `cpv1ProductionPilotAccess(...)` returns **allowed only when ALL hold**: `deploymentContext ===
    "production"` AND exact required flag AND `authenticated` AND `isFounderAdmin` AND `routeAuthorized`.
- `lib/cpv1/pilotRouteAccess.ts` — server-only async resolver that composes the gates per request:
  - **non-production** (local / test / vercel_preview): the existing Preview gate governs, **UNCHANGED**;
  - **production**: the Preview gate denies (`denied_production`), so only the pilot gate applies —
    Founder/Admin resolved via the existing `viewerHasAdminAccess(getViewerContext())` mechanism (email
    allow-list; never query params / client state / unvalidated cookies / route secrecy / Preview creds).
  - There is **no fallback between the two gates**: production is served only by the pilot gate; the pilot
    gate denies preview.

### Resolver truth table (production pilot gate)

| context | flag | authenticated | Founder/Admin | routeAuthorized | result |
|---|---|---|---|---|---|
| production | on (exact) | yes | yes | yes | **allowed** |
| local / test / vercel_preview / unknown | (any) | (any) | (any) | (any) | denied_not_production |
| production | off / wrong flag | — | — | — | denied_flag_off |
| production | on | no | — | — | denied_unauthenticated |
| production | on | yes | no | — | denied_not_admin |
| production | on | yes | yes | no | denied_route_unauthorized |

Independence: the Preview gate (`dailyCheckInAccess`/`yorisouValuesAccess`) still returns
`denied_production` in production (unchanged); the pilot gate returns `denied_not_production` on preview.

## 2. Server-side route/API enforcement (route-concealing 404)

Every pilot surface enforces the resolver server-side and returns a route-concealing **404** to
unauthorized production callers (never 401/403 — the pilot's existence is not confirmed). No UI hiding is
relied on; no authorization decision or Founder/Admin identifier is sent to client bundles.

- Pages: `app/tests/daily-check-in/page.tsx`, `app/tests/yorisou-values/page.tsx` → `notFound()`.
- DCI APIs: `records/route.ts` (GET, POST), `records/[date]/route.ts` (PATCH, DELETE).
- YV APIs: `assessments/route.ts` (GET, POST), `assessments/[id]/route.ts` (GET, PATCH, DELETE), and the
  **anonymous** `score/route.ts` (POST). On Preview `score` stays anonymous; in Production it requires an
  authenticated Founder/Admin, so anonymous Production scoring is **404** during the private pilot.

Preview acceptance behavior is unchanged: on Preview under the existing `YORISOU_CPV1_DEV_FLAGS`, the
routes behave exactly as before (anonymous → still 401 on the persisted APIs; anonymous `score` still
works).

## 3. Public activation remains closed

No method changed to `public_active`; no `founderActivation: open`; no public-availability claim. The
private Production pilot status is distinct from public method availability and is not derivable from
route code on `main`, Production deployment, applied schema, successful private access, or Founder
private-pilot authorization.

## 4. Authorized migrations (inspection — §8)

The ONLY two Production migrations authorized, applied in timestamp order to `yorisou-production`
(ref `krxizslnksorwhepyijs`):

| # | file | sha256 |
|---|---|---|
| 1 | `supabase/migrations/202607200005_dci1_daily_state_records.sql` | `fb130d49e2417f04377ec055a942a0602716bd112dddcda9a2162976593908b0` |
| 2 | `supabase/migrations/202607210001_yv1_values_assessments.sql` | `1f76f01e050a9c19eb156a45c556f943ae9f9b76e1fc3fa9658723b8051f004f` |

Inspection: both are **purely additive** — `create extension if not exists pgcrypto`; 3 tables each
(records/versions/events; assessments/versions/events) + indexes; append-only `*_block_mutation()`
trigger function + BEFORE UPDATE/DELETE/TRUNCATE triggers; RLS **enabled** on all 6 tables; `revoke all`
from public/anon/authenticated; `grant select` to `service_role` only; bounded SECURITY DEFINER RPCs for
all mutation (create/correct/delete + retention purge). **No top-level DROP/TRUNCATE/DELETE** — the
`drop …` lines are inside the `--` ROLLBACK comment block; `truncate` appears only in append-only trigger
DDL (the guard) and in comments; `delete from` appears only inside the governed deletion RPC bodies
(private-content erasure scoped by record/assessment id). No unrelated tables are touched. The
architecture preserved is `DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION`
with `service_role` SELECT-only — identical to the disposable-DB verification (CM0) and the isolated
Preview apply (MPV-1B).

**Stale header note (superseded):** both files carry an authoring-time comment ("no hosted/production
apply is authorized" / "LOCAL DISPOSABLE-DATABASE VERIFICATION ONLY"). That reflected their pre-PPR-1
state; the current PPR-1 Founder authorization explicitly authorizes applying these exact two files to
`yorisou-production`. The files are applied **unmodified** (checksums above preserved).

## 5. Validation (local, pre-merge)

- `tsc --noEmit`: clean.
- focused ESLint (all changed files): 0 problems.
- `production build`: success.
- `test:production-pilot`: **12/12** (gate truth table, exact-token parsing, cross-gate independence,
  route/API wiring, no admin identifiers/secrets).
- Preview gate regression: `test:cpv1` **62/62**; `test:daily-check-in` **45/45**; `test:yorisou-values`
  **27/27**; `test:shared-store` **15/15**.
- changed-content secret scan: clean.

_(Remote CI, Preview smoke/axe, merge, Production 404 verification, and Production migration/schema
verification are appended below as they complete.)_
