# OSF-1 Phase 1 — hosted migration and Founder INTERNAL activation

**Date:** 2026-08-18 · **Target:** `yorisou-production` (`krxizslnksorwhepyijs`, ap-northeast-1, PostgreSQL 17.6)
**Release:** `5245b105c71d` (main HEAD; verified against the deployed `data-release` marker)
**Result:** migration APPLIED · schema-ready ON · activation state **INTERNAL** · PREVIEW disabled · PUBLIC unreachable

> **One thing is not done and is not claimed done.** The hosted Founder smoke — signing in as the
> Founder and exercising the Life OS against real Production — could not be performed by the agent,
> because doing so would require authenticating as Edward. It requires Edward. §8 says exactly what
> remains and how to run it.

---

## 1. Pre-activation state, established before any mutation

The hosted migration state was determined by two independent transports that agreed:

| Transport | Result |
|---|---|
| PostgREST OpenAPI root (`GET /rest/v1/`) | 0 of 6 OSF-1 tables, 0 of 13 OSF-1 RPCs |
| `pg_catalog` via the Management API | 0 of 6 OSF-1 tables |

**Controls matter more than the finding.** Four pre-existing tables
(`yorisou_experience_cards`, `yorisou_test_results`, `yorisou_daily_state_records`,
`yorisou_private_memory_items`) were probed by the same mechanism and all returned PRESENT. Without
that, an "absent" result cannot be distinguished from a broken probe.

**Verdict: A. PRE_OSF1.** Not partially applied, so no blind repair was in question.

### A correction worth recording

An earlier probe in this session returned 401 on every table and was reported as `PRE_OSF1`. That
was wrong and was retracted: the pre-existing controls also returned 401, which proves an auth
failure rather than missing tables. The root cause was a defect in the agent's own `.env` parser —
`vercel env pull` escapes newlines as a literal `\n`, and stripping the quotes without unescaping
left every value carrying a trailing backslash-n. That produced a bogus `/n` URL path, a hash
mismatch against the project's issued keys, and a false "the Production service-role key is stale"
finding. **The Production credentials were healthy the whole time.** Nothing was changed in response
to the false finding.

## 2. Recovery evidence, established before the migration

Production migration was gated on a trustworthy recovery path. Four independent pieces:

1. **Every OSF-1 migration carries a reviewed ROLLBACK block**, written with the specific hazard in
   view — 202608160001's block explains that `create or replace` with an old parameter list *adds*
   an overload rather than replacing, so the drops must use exact new signatures and the column
   drops must come last.
2. **Gate 3 rehearsal PASS** on a disposable PostgreSQL 17: apply all six → validate → execute the
   documented rollback → re-apply → account erasure. It also proved the pre-OSF-1 experience card
   survives the whole cycle and the legacy `/experiences` write path keeps working.
3. **Pre-migration catalogue frozen**: `catalogue_hash f21dca5ec71da798`, 57 tables / 108 functions
   / 143 indexes / 18 triggers, stored at
   [osf1-production-catalogue-pre-migration.json](evidence/osf1-production-catalogue-pre-migration.json).
   It reads `pg_catalog` only — no rows, no credentials.
4. **Backup reference**: daily automatic backup `2026-08-17T19:35:04Z`, status COMPLETED.

**Stated honestly: PITR is not enabled on this project** (`pitr_enabled: false`). Recovery
granularity is the daily snapshot, so a snapshot restore has an RPO of up to 24 hours. That is why
the precise recovery path here is the structural rollback, with the snapshot as a backstop — and why
that ordering is acceptable for this particular migration is the subject of the next section.

## 3. Why this migration was safe to apply to live data

The six migrations contain **zero migration-time DML**. Every `delete`/`update` in the set sits
inside a function body that runs only when that function is called. Verified statement by statement.

The only pre-existing table touched is `yorisou_experience_cards`, and every change to it widens:

- two **nullable** columns added (`title`, `lesson`)
- `NOT NULL` **dropped** on `state_context`, `limitations`, `may_fit`, `may_not_fit`
- CHECK constraints added that every existing row already satisfies — confirmed against real data
  before applying: 1 row, 0 rows with any null sharing column, so the new
  `shared_context_chk` validates trivially

The only pre-existing function redefined is
`yorisou_account_deletion_erase_database_unchecked(text)`. Its live pre-migration definition was
captured first (md5 `5d3bf43749a90edefe26ee232b31ab36`, 6645 bytes) and its documented rollback is
to re-apply 202608010110 verbatim.

## 4. The migration

Applied in order through the Management API query endpoint — the same transport the POR-1 promotion
tooling uses — each file all-or-nothing, each verified before the next:

| # | Migration | Result |
|---|---|---|
| 1 | `202608140001_osf1_life_os_foundation` | APPLIED |
| 2 | `202608140002_osf1_erasure_plan_registration` | APPLIED |
| 3 | `202608150001_osf1_life_os_audit_events` | APPLIED |
| 4 | `202608150002_osf1_reflection_five_question_flow` | APPLIED |
| 5 | `202608160001_osf1_phase1_completion` | APPLIED |
| 6 | `202608170001_osf1_phase1_finalization` | APPLIED |

`supabase_migrations.schema_migrations` now holds 29 rows (23 pre-existing + 6).

Two incidents during the apply, both recorded because neither is invisible in the result:

- **A malformed history row.** The first apply wrote version `202608140001_o` because the agent
  sliced 14 characters where this project uses 12-digit versions. The schema change itself was
  correct; the bookkeeping row was deleted and rewritten as `202608140001 / osf1_life_os_foundation`.
- **A connect timeout before migration 5.** The request failed at TCP connect, so it could not have
  reached the server — but that was *verified rather than assumed* before retrying: no history row,
  no `options_considered` column, no `yorisou_osf1_memory_update` function. A clean boundary, then a
  retry.

## 5. Structural verification against hosted Production

| Check | Expected | Actual |
|---|---|---|
| Life OS tables | 6 | **6** |
| RLS enabled on all of them | 6 | **6** |
| Duplicate RPC overloads | 0 | **0** |
| OSF-1 functions | 13 | **13** |
| PUBLIC EXECUTE on a SECURITY DEFINER RPC | 0 | **0** |
| `anon` EXECUTE on a SECURITY DEFINER RPC | 0 | **0** |
| `authenticated` EXECUTE on a SECURITY DEFINER RPC | 0 | **0** |
| `service_role` EXECUTE on all 12 SECURITY DEFINER RPCs | 12 | **12** |
| `anon`/`authenticated` table privileges on Life OS tables | 0 | **0** |
| Erasure plan names all 5 personal families | 5 | **5** |
| Audit-table immutability triggers | 2 | **2** |
| New `yorisou_experience_cards` columns | 2 | **2** |

One function — `yorisou_osf1_state_vocabulary()` — *is* executable by `public`/`anon`/`authenticated`.
That is correct and not an exception being waved through: it is `IMMUTABLE`, it is **not**
`SECURITY DEFINER` (so it runs with the caller's rights), and `anon`/`authenticated` hold zero table
privileges. It is a vocabulary lookup that cannot read or write a row. An initial broader check
counted it as a failure; the check was wrong, not the grant.

## 6. Data safety

**210 live rows in the public schema before the migration. 210 after.** No row was added, removed,
or rewritten. The pre-existing experience card is intact; all six Life OS tables are empty.

## 7. Activation

Performed in the required order, each step its own deployment so the ordering is real rather than
asserted:

1. **Schema-ready** — `YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true`, deployed, then verified that it
   opened nothing: `/life`, `/life/reflect` and every `/api/life/*` route still 404, public surfaces
   still 200.
2. **INTERNAL** — `osf1_life_os_internal` appended to `YORISOU_PRIVATE_PILOT_FLAGS`, preserving the
   two existing pilot tokens, then deployed.

State after activation, probed anonymously against `https://yorisou.online`:

| Surface | Anonymous result |
|---|---|
| `/life`, `/life/reflect` | 404 |
| `/api/life/context`, `/goals`, `/timeline`, `/state`, `/reflections`, `/memories` | 404 |
| `POST /api/life/goals` | 404 `{"error":"not_found"}` |
| `/`, `/experiences`, `/me`, `/explore` | 200 |

INTERNAL is a statement about the environment, never about the person: `resolveLifeOsRouteAccess()`
consults the environment *before* the session, so a closed deployment answers identically to
signed-in and signed-out callers and reveals nothing about who is asking.

Two probe results that look alarming and are not, both checked rather than assumed:

- `POST /api/life-os` returned **200**. That path is not a route at all; the response carries
  `x-matched-path: /_not-found` and Next's 404 page. `POST /api/health` and a nonsense path behave
  identically. The real routes are `/api/life/*`, and they return 404.
- A **garbage session cookie** produced no different response and no cookie-clearing. That is the
  absence of an oracle, which is the desired behavior.

## 8. Kill switch — what was proven, and what was not

The switch was exercised for real against Production: `osf1_life_os_internal` was removed, deployed,
verified, then restored and deployed again.

**Engaged (token absent):** `/life` and `/api/life/*` 404; `/`, `/experiences`, `/me`, `/explore`
all 200; the DCI and Yorisou-Values pilot tokens untouched.
**Restored:** all three tokens present, schema-ready still `true`, release still `5245b105c71d`.

**What this does not prove.** To an unauthenticated probe, OFF and INTERNAL are indistinguishable —
deliberately, because the route is concealed rather than merely forbidden. So the switch's effect
*on an authenticated Founder session* was not observed on hosted infrastructure. It is evidenced
instead by 43 passing tests over the exact deployed code (`osf1Activation.test.ts` 29,
`osf1RegressionRepair.test.ts` 14), which cover the Founder/Admin-authenticated branches directly.
That is real evidence about the code and weaker evidence about the deployment, and it is recorded
that way on purpose.

### What still requires Edward

Sign in at `https://yorisou.online` as `jy.edward@gmail.com`, then:

1. `/life` renders (not 404) — this alone proves INTERNAL end-to-end, since it is the one thing no
   unauthenticated probe can establish.
2. Walk the surfaces: `/life/reflect`, `/life/goals`, `/life/memories`, `/life/timeline`,
   `/life/experience`.
3. Write one goal and one reflection, confirm they persist across a reload, then delete them.
4. Confirm a signed-out browser still gets 404 at `/life`.

Founder/Admin resolution needs no configuration: `getAdminEmails()` carries a hardcoded production
fallback of `jy.edward@gmail.com` and `shigeru.nagano1111@gmail.com`, so the absence of
`YORISOU_ADMIN_EMAILS` from the Production environment does **not** block access. (An earlier note
in this session claimed it would. That claim was wrong and is withdrawn.)

## 9. Boundaries held

- **PREVIEW disabled** — `YORISOU_CPV1_DEV_FLAGS` is absent from Production; `osf1_life_os_preview`
  is set nowhere.
- **PUBLIC unreachable by construction** — no environment variable in this codebase returns it.
- **PR #127 untouched.**
- **No Production secret printed** anywhere in this package; pulled environment files were deleted
  from the working scratchpad.
- **No account erasure executed** against any real account.
- **No unrelated user record touched** — proven by the unchanged row count.

## 10. Residual risks

| Risk | Standing |
|---|---|
| PITR is off; snapshot RPO is up to 24h | Accepted for this migration (zero DML, additive, rehearsed rollback). Worth enabling before real beta data accumulates. |
| Hosted Founder path unverified end-to-end | Open until §8 is run by Edward. |
| Two admin emails are hardcoded in `getAdminEmails()` | Pre-existing; outside this package's authorization. Worth revisiting. |
| Retention is `RETENTION_POLICY_TBD` | Deliberate. Life OS rows accumulate with no retention rule until a decision is made. |
