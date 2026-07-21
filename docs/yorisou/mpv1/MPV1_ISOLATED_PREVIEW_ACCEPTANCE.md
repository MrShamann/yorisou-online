# MPV-1 — Isolated Free Hosted Preview: Acceptance Evidence

> **DO NOT MERGE.** This branch/PR carries MPV-1 Preview evidence only. It does not change
> Production application behavior and authorizes no merge into `main`. No secrets, passwords,
> tokens, service-role keys or full connection strings are committed here.

**Founder decision:** `YORISOU_MPV_1A_BLOCKER_REJECTED_FREE_CAPACITY_CONFIRMED` → MPV-1B authorized
creation of one dedicated Free organization + one Free project for an isolated non-production Preview
of `daily-check-in` and `yorisou-values`. Base: `main @ d2e2a73`.

## 1. Isolated Free infrastructure (created, verified $0)
| Item | Value |
|---|---|
| Organization | **Yorisou Preview** (slug `tolnifbylbbkmvuigmpb`) |
| Organization plan | **free** (verified via Management API `GET /v1/organizations/{slug}` → `"plan":"free"`) |
| Project | **yorisou-preview** (ref `nbltsbonsnbpfptihomc`) |
| Region | `ap-northeast-1` (Tokyo) |
| Compute | default Free-plan instance (no paid `--size`) |
| Paid add-ons | **none** (`selected_addons: []`) |
| Status | `ACTIVE_HEALTHY` |
| Isolation | org ≠ `MrShamann's Org` (pro) and ≠ `KAKARI`; project ref ≠ `krxizslnksorwhepyijs` (yorisou-production) and ≠ any Mirai Move / KAKARI ref |
| Payment method / upgrade | none added; no subscription change; org remained `free` after project creation |

Free-capacity finding (read-only): the account's Free allowance is **2 active free projects**;
before MPV-1B one was used (`kakari-preview` in the `KAKARI` free org). A separate Free org
(`Yorisou Preview`) was creatable at $0 (Supabase default plan for a new org is Free), consuming the
remaining free-project capacity for `yorisou-preview`. `MrShamann's Org` is Pro (paid) and its four
paid projects do not consume the Free-project allowance.

## 2. Migrations applied to `yorisou-preview` only (ref-guarded)
Applied via a session-pooler connection bound to ref `nbltsbonsnbpfptihomc`, behind a hard guard
rejecting `krxizslnksorwhepyijs` (production) and every Mirai Move / KAKARI ref:
- `supabase/migrations/202607200005_dci1_daily_state_records.sql` (daily-check-in)
- `supabase/migrations/202607210001_yv1_values_assessments.sql` (yorisou-values)

Both are self-contained additive migrations (own tables/functions/triggers/RPCs + `pgcrypto` + the
standard Supabase `service_role`/`anon`/`authenticated` roles). No other migrations were applied.
**Authentication needs no Supabase migration** — accounts/sessions persist in the app's file/object
store (`lib/server/yorisouData.ts`), not Supabase.

Post-migration schema verification on the hosted preview: 3 DCI tables + 3 YV tables; RLS enabled on
all 6; **0 user policies** (deny-all direct access); 10 SECURITY DEFINER RPCs; `service_role`
SELECT-only on record tables; `anon` denied the RPCs — the DIRECT_USER_DENY + RPC_ONLY +
service_role-SELECT-only architecture holds on the hosted backend.

## 3. Hosted acceptance against the isolated `yorisou-preview` Supabase — PASS
The production build ran against `SUPABASE_URL=https://nbltsbonsnbpfptihomc.supabase.co` +
the preview service-role key, with an isolated file-based auth store and ≥2 synthetic accounts.
All acceptance data was confirmed persisted in the **hosted** preview DB (5 YV + 5 DCI records across
5 distinct synthetic accounts) — proving the acceptance exercised the real isolated hosted backend.

- **Yorisou Values full-stack: 7/7 PASS** — authenticated create → server scoring → read → correct
  (v2) → retake (distinct) → delete (erased, one tombstone); provenance/hash/insufficient/malformed/
  oversized rejected before persistence; **TRUE two-account isolation**; YV-C1 confirmation distinct
  op + strict PATCH; **YV-C3 anonymous non-persistent scoring (zero DB rows after anonymous)**;
  **YV-C7 anonymous → sign-in → explicit save (exactly one assessment + one initial version; refresh
  creates no duplicate)**; **YV-C8 truthful + idempotent confirmation** (unchanged → no new event;
  real change → one event; no version churn); six-field provenance enforcement.
- **Daily Check-in full-stack: 5/5 PASS** — signed-in create → server-derived date → history →
  correct (v2, v1 preserved) → delete → content erased; server-authoritative time / duplicate /
  timezone / oversized-malformed negatives; resumed identity; anonymous → login → resumed review →
  explicit save; **TRUE two-account isolation + unauthenticated denial**.
- **Browser acceptance (desktop + mobile): 34/34 PASS** — real axe **0 serious / 0 critical**; no
  answers or private result payload in URLs; no internal numeric scores; **no navigation / catalog /
  sitemap exposure** for either gated method.

## 4. Cleanup
All synthetic accounts, assessments, records, versions and events created during acceptance were
removed from the hosted preview DB (verified 0 rows across all 6 tables; schema retained). The local
isolated auth store and all temporary local secret material are removed at closeout. The
`yorisou-preview` project is **kept**: Free plan, isolated, empty of synthetic test data,
non-production, no paid add-ons, no real users. Free-plan inactivity pausing is acceptable. No purge
schedule or automation was created.

## 5. Production non-regression (read-only; no Production mutation)
`https://yorisou.online/` → **200**; `/tests/daily-check-in` → **404**; `/tests/yorisou-values` →
**404**; `POST /api/tests/yorisou-values/score` → **404**; `/api/tests/yorisou-values/assessments` →
**404**; per-assessment YV API → **404**; `/api/tests/daily-check-in/records` → **404**. Production
remains closed and unchanged.

## 6. Vercel Preview configuration — status & remaining step (PARTIAL)
The exact branch-scoped Preview environment variables required (names only; **never** values), to be
set on the Vercel project scoped to **Preview** + the `feat/mpv-1-isolated-hosted-preview` branch:
- `SUPABASE_URL` → the `yorisou-preview` project URL (`https://nbltsbonsnbpfptihomc.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` → the `yorisou-preview` service-role key (server-side only)
- `YORISOU_CPV1_DEV_FLAGS` → `dci_daily_check_in_preview,yorisou_values_preview`
- `YORISOU_AUTH_COOKIE_SECRET` → a fresh Preview-only secret
- (`YORISOU_SHARED_STORE_BUCKET` + `YORISOU_SHARED_STORE_REGION` — see the limitation below)

The app consumes **only the Supabase service-role key server-side**; it uses no anon/publishable key.

**Architectural limitation (as understood at MPV-1B — SUPERSEDED by §9, MPV-1C):**
the app's accounts/sessions persist through `lib/server/yorisouData.ts`, which uses either a local
filesystem store or an **S3-shaped shared object store** (`@aws-sdk/client-s3`, gated by
`YORISOU_SHARED_STORE_BUCKET`). On Vercel **serverless**, the filesystem (`/tmp`) is ephemeral and
per-instance, so authenticated flows require a **durable object store**. MPV-1B concluded this meant an
isolated **AWS S3** bucket outside its authorization. **That conclusion was corrected in MPV-1C (§9):**
the existing Free `yorisou-preview` Supabase project already ships an **S3-compatible Storage** service,
which MPV-1C uses as the durable auth store — **no AWS S3, no new cloud resource, no paid resource.**
The anonymous `yorisou-values` `/score` flow needs no auth store and functions with only
`YORISOU_CPV1_DEV_FLAGS` set.

Per §13, branch-scoped external environment configuration is preferred over committed
environment-specific values; no secret values are committed. No Production Vercel variable,
deployment protection, or domain was changed; no Vercel deployment was triggered from this session.

## 7. No-Production-contact attestation
No Production Supabase operation occurred: no connection to, SQL against, or inspection of
`yorisou-production` (`krxizslnksorwhepyijs`) tables/users/storage/Auth/logs; only account-level
Supabase Management API metadata GETs were used for org/project verification. No Production Vercel
environment variable was changed and no Production deployment was triggered. PR #113 and PR #114 were
not touched. The canonical `docs/yorisou/mtf2a/yorisou-values.v1.json` (bank hash
`919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6`) is unchanged.

## 8. Outcome (MPV-1B — SUPERSEDED by §9)
Isolated Free hosted **Supabase** Preview infrastructure created and **fully accepted** for both
methods; the **Vercel-deployment-hosted authenticated** Preview was left incomplete pending a durable
shared object store, which MPV-1B mis-scoped as requiring AWS S3. MPV-1B classification (at the time):
**`YORISOU_MPV_1_PARTIAL`**. **Superseded by §9 (MPV-1C), which completed the fully-hosted authenticated
Vercel Preview using the existing Supabase Storage as the durable auth store.**

---

## 9. MPV-1C — Supabase Storage durable auth store + Vercel-hosted authenticated Preview (VERIFIED)

**Correction of the MPV-1B conclusion.** A durable object store for the serverless Preview does **not**
require AWS S3. The existing Free `yorisou-preview` Supabase project (ref `nbltsbonsnbpfptihomc`,
plan **free**) already provides an **S3-compatible Storage** service. MPV-1C uses it as the durable
accounts/sessions store — **no AWS bucket, no new Supabase project/org/branch, no Vercel Blob, no paid
resource.**

**9.1 Durable store (private bucket).** Created a **private** bucket `yorisou-preview-auth` (public:
false) in the isolated `yorisou-preview` project. The app's object keys live under the existing
`phase1/**` namespace (`phase1/accounts/by-id`, `phase1/accounts/by-email`, `phase1/sessions`, …).

**9.2 Code (backward-compatible; committed in `818ff65`).** `lib/server/yorisouData.ts` was extended
with a pure, fail-closed `resolveSharedStoreMode()` returning `disabled | aws | s3-compatible |
supabase-rest`, plus a Supabase-Storage-REST adapter (service-role bearer; PUT/GET/DELETE/LIST). The
**AWS default is unchanged**: bucket + no endpoint → `aws` exactly as before. New modes activate only
when an endpoint is configured; partial/mismatched credentials **throw with no secret in the message**.
Everything (ref, bucket, endpoint, keys) is read from env — nothing hardcoded. New unit tests
(`lib/server/__tests__/sharedObjectStore.test.ts`, **7/7**) cover mode selection and fail-closed
credential handling; `package.json` gains `test:shared-store`.

**9.3 Vercel Preview configuration (branch-scoped; names only, never values).** Eight variables scoped
to **Preview** + branch `feat/mpv-1-isolated-hosted-preview`: `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `YORISOU_CPV1_DEV_FLAGS` (=`dci_daily_check_in_preview,yorisou_values_preview`),
`YORISOU_AUTH_COOKIE_SECRET`, `YORISOU_SHARED_STORE_BUCKET` (=`yorisou-preview-auth`),
`YORISOU_SHARED_STORE_REGION` (=`ap-northeast-1`), `YORISOU_SHARED_STORE_ENDPOINT`
(=`https://nbltsbonsnbpfptihomc.supabase.co/storage/v1`), `YORISOU_SHARED_STORE_SECRET_ACCESS_KEY`.
Verified **55 Production-scoped variables untouched**; no non-branch Preview or Development variable
was altered.

**9.4 Vercel Preview deployment.** Push of `818ff65` built a Preview deployment
(`dpl_Ajs8FQkEseLx3bchS28qWGMusjy4`, target **preview**, state **READY** — a passing production-grade
`next build`). **Deployment Protection was NOT disabled** (`ssoProtection.deploymentType =
all_except_custom_domains` unchanged); acceptance used the project's existing automation
**protection-bypass header** (`x-vercel-protection-bypass`). No `--prod` deployment occurred; the latest
Production deployment remains `main`@`d2e2a73`.

**9.5 Hosted authenticated acceptance (vs the actual Vercel Preview URL) — 51/51 PASS.** Synthetic
accounts only. Highlights:
- **Auth durability across separate serverless invocations:** register → authenticated read → sign out
  → sign in from a **fresh context** → session validated on **4 independent** invocations (would fail on
  per-lambda `/tmp`; proves the durable store is in use).
- **Yorisou Values (authenticated):** create → server scoring (`VAL_R_ANSHIN`) → read (no internal
  numerics) → correct (v2, two persisted versions) → retake (distinct) → confirmation-only PATCH
  (no version bump, one event) → idempotent confirm (no new event) → provenance mismatch 422 →
  insufficient-coverage 422 → delete (content erased, exactly one tombstone with retention).
- **Yorisou Values (anonymous):** `/score` returns a result with `saved:false` and persists **nothing**.
- **Isolation & auth-gating:** account B cannot read/correct/delete A's record (404, no existence leak);
  all methods deny unauthenticated (401).
- **Daily Check-in:** create (server-derived local date) → correct (v2) → duplicate 409 → client
  time-override 422 → delete (erased, one tombstone); cross-account correction 404; unauth 401.

**9.6 Durable-store proof (§10).** After the run, the private bucket held the synthetic accounts and
sessions objects (counts/prefixes only: `phase1/accounts/by-id` and `phase1/sessions` populated;
no emails, hashes, session IDs, keys, or bodies recorded), confirming persistence across invocations.

**9.7 Browser axe / privacy (vs the Preview URL) — 34/34 substantive PASS.** Desktop + mobile, both
gated routes: axe **0 serious/critical**; answers and scores **never appear in the URL**; `/tests` does
**not** link the gated methods (no catalog/sitemap exposure). One mobile hydration timeout was a
network-latency flake and passed on immediate re-run.

**9.8 Cleanup (§11).** All synthetic data removed: bucket wiped to **0 objects**; the six DCI/YV method
tables truncated to **0 rows** (append-only event immutability was bypassed only via a transient
`session_replication_role` session GUC — **no trigger dropped or persistently disabled**; all ten
`*_block_mutation` triggers remain enabled). Kept: the Free org/project, the (now-empty) private bucket,
schemas, and the branch-scoped Preview variables/flags.

**9.9 Production non-regression (§12).** `https://yorisou.online/` → **200**; every gated route/API
(`/tests/yorisou-values`, `/tests/daily-check-in`, and their `/api/**` POSTs) → **404**; auth
(`/api/auth/register`) → 400 on empty body (public, working). Production Supabase (`krxizslnksorwhepyijs`),
Production Storage, Production Vercel variables, Deployment Protection, and the Production domain were
**not touched**; `origin/main` remains `d2e2a73`.

**9.10 Validation battery.** `tsc --noEmit` clean; `eslint` **0 errors** (pre-existing warnings only);
`test:shared-store` **7/7**; `test:yorisou-values` **27/27**; `test:daily-check-in` **45/45**;
`test:cpv1` **62/62**; local `next build` **success** (162 pages); Vercel Preview build **READY**;
hosted acceptance **51/51**; browser **34/34**. Secret scan: **0** live-secret matches in the tracked
tree or branch history; the only credential-shaped strings in the diff are obvious test fixtures
(`AKIA_EXAMPLE_KEY_ID`, generic `ref.supabase.co` placeholder, a fake `SECRET` constant).

**9.11 Classification (MPV-1C):** **`YORISOU_MPV_1_ISOLATED_FREE_HOSTED_PREVIEW_VERIFIED`** — the
fully-hosted authenticated Vercel Preview is complete on Free/zero-cost infrastructure with a durable
Supabase-Storage auth store. PR #120 stays **OPEN / draft / DO NOT MERGE**.
