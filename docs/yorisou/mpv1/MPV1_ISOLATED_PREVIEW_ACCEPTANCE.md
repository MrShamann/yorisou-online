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

**Architectural limitation (why the Vercel-hosted authenticated Preview is not completed here):**
the app's accounts/sessions persist through `lib/server/yorisouData.ts`, which uses either a local
filesystem store or an **AWS S3 shared object store** (`@aws-sdk/client-s3`, gated by
`YORISOU_SHARED_STORE_BUCKET`). On Vercel **serverless**, the filesystem (`/tmp`) is ephemeral and
per-instance, so authenticated flows require an **isolated AWS S3 bucket + AWS credentials**.
Provisioning an isolated S3 bucket is a **separate cloud resource** outside MPV-1B's authorization
(which covers an isolated Supabase Preview + Vercel Preview), and Production's shared bucket must not
be reused. Consequently the fully-hosted Vercel Preview **authenticated** acceptance is not completed
in this package — while the identical authenticated behavior is **fully verified against the same
isolated hosted `yorisou-preview` Supabase** (§3). The anonymous `yorisou-values` `/score` flow needs
no auth store and would function on a Vercel Preview with only `YORISOU_CPV1_DEV_FLAGS` set.

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

## 8. Outcome
Isolated Free hosted **Supabase** Preview infrastructure created and **fully accepted** for both
methods; the **Vercel-deployment-hosted authenticated** Preview is incomplete pending an isolated
shared object store (out of MPV-1B scope). Classification: **`YORISOU_MPV_1_PARTIAL`**.
