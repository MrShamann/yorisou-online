# DCI-1 — Architecture Decision Record & Repository Dependency Map

**Package:** DCI-1 daily-check-in「きょうの空模様」recorded-state vertical slice · **Base:** `main @ cf9aee9` · **Founder decision:** `DAILY_CHECK_IN_VERTICAL_SLICE_FIRST` · **Status:** implementation candidate, `FOUNDER_APPROVED_IMPLEMENTATION_GATED`, activation `gated`.

## 1. Canonical source & loading strategy (§4)

Single source of truth: `docs/yorisou/mtf2a/daily-check-in.v1.json` (UNTOUCHED; hash `4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3`). Strategy: **deterministic generation of a runtime artifact**:

- Generator: `scripts/generate-daily-check-in-runtime.mjs` — verifies the pinned canonical hash BEFORE generation (hard exit on mismatch), distills exactly the runtime-needed subset (no Japanese copy rewritten), emits `lib/yorisou/methods/daily-check-in/definition.generated.ts`.
- The artifact is marked GENERATED, embeds the source hash, records the regeneration command (`npm run generate:daily-check-in`) and the `--check` drift mode.
- Drift fails validation: the contract test executes `--check` (byte comparison) and independently re-derives the canonical hash.

## 2. Recorded-state runtime boundary (§7) — NOT a Dynamic Test Engine

`lib/yorisou/method-runtime/recordedState.ts` — channel-neutral, single execution model:

- Concepts: `MethodRuntimeDefinition`, `RecordedStateInput`, `RecordedStateExecution`, `RecordedStateResultEnvelope`, `RecordedStateProvenance`, `MethodRuntimeValidationError`.
- Supports ONLY `executionModel: "recorded_state"`; any other model returns `unsupported_execution_model` (test-covered). No scored executor, no archetype engine, no universal score, no persona logic, no LINE logic, no route business logic.
- Envelope: `StateRecordResult` · `producedAt` (never `computedAt`) · provenance `{kind, schemaVersion, methodVersion, yorisouScoring: null}` · `confirmation.required: true`.
- Extension path: a future scored executor adds its OWN executor beside this one behind the same definition/envelope discipline — deliberately not implemented in DCI-1.

## 3. Repository dependency map (§6 preflight — what the slice builds on)

| Concern | Clean-main mechanism used |
|---|---|
| Auth | `lib/server/yorisouAuth.ts` `getViewerContext()` (encrypted-cookie sessions; fails closed to anonymous); owner id = `account.id \|\| legacyAccount.id`; 401 before any store access (imairo route pattern) |
| Persistence | service-role PostgREST repository pattern (`lib/server/testResults.ts` precedent) → new `lib/server/dailyCheckInStore.ts`; multi-row invariants via SECURITY DEFINER RPCs (CIF-1A precedent) |
| Governance | `lib/cpv1/methods.ts` registry + activation model; `lib/cpv1/deploymentContext.ts` fail-closed context + exact dev flags |
| Anonymous continuation | RTR-1 pending-save/login-return pattern (`app/result/pendingSave.ts` precedent) → `app/tests/daily-check-in/pendingEntry.ts` (sessionStorage, 10-min TTL, taken once) |
| Local DB verification | `tests/agent-runtime/postgres-integration.sh` harness pattern → `tests/daily-check-in/postgres-integration.sh` |
| Events | `lib/server/relationship-intelligence` exists but is open-testing-scoped with a closed name union → DCI-1 records the event CONTRACT and DEFERS emission (§19; no new analytics subsystem) |
| UI conventions | thin server page + client flow under `app/tests/<id>/`; house tokens (`--bg-base`, `--surface`, `--cta-main`, `.surface-panel`); Playwright smoke under `tests/smoke/` |

PR #113/#114 were consulted as REFERENCE ONLY; nothing was cherry-picked (no branch `lib/cpv1/**`, no branch CPV1/APP-2 migrations, no dormant DTE, no `DynamicTestEngineFlow.tsx`). `git log` contains no cherry-picks; the diff is authored against clean main.

## 4. Registry reconciliation (§8)

- `daily-check-in` ADDED to `CPV1_METHOD_UNIVERSE` as the concrete `recorded_state` method (family `yorisou_state`, role `reflection_cadence`, `StateRecordResult`, version `daily-check-in-v1.0`).
- `reflection-cadence` RETAINED unmodified in identity — documented as the UMBRELLA planning entry (weekly/monthly/seasonal/annual); relationship exported as `DAILY_CHECK_IN_RECONCILIATION` and contract-tested (no duplicate method identity).
- Truthful maturity on this branch: `implementation: "in_progress"` (candidate pending Founder Review — deliberately NOT "complete" so the derived activation state is exactly **`gated`**), `routeEvidence: "none"` (route NOT on production main), `founderActivation: "closed"` (content approval ≠ public activation), `deploymentStatus: "unverified"`, `devFlagged: true`. `public_active` / `implemented_route_verified` / `production_verified` are NOT claimed (no evidence exists).

## 5. Persistence decision (§12)

`yorisou_test_results` REJECTED for daily state: its CHECK-constrained `test_id`, one-active-row idempotency and result-shaped columns would force fake answers/result fields, destructive updates, no entry-local-date identity and no version history. Dedicated additive migration `supabase/migrations/202607200005_dci1_daily_state_records.sql`:

- `yorisou_daily_state_records` — current visible entry; unique `(owner_account_id, entry_local_date)`; identity = INITIAL `produced_at` (UTC, never overwritten by corrections) + `entry_local_date` + IANA `timezone` (+ optional `utc_offset_minutes`); memo ≤140; method CHECK `daily-check-in`. (DCI-1.1: the erased-row deletion model replaced the DCI-1 `deleted_at` soft-hide columns.)
- `yorisou_daily_state_record_versions` — append-only content history while the record exists (DCI-1.1: `yorisou_dci_block_mutation()` guard — UPDATE/TRUNCATE never; DELETE only under the governed-erase flag inside the deletion RPC); `reason_code in ('initial','user_correction')`.
- `yorisou_daily_state_history_events` — append-only audit/tombstone events; **structurally carries NO state and NO memo columns**.
- Atomic RPCs (SECURITY DEFINER, service-role execute only, fixed `search_path=public`): `yorisou_daily_record_create` / `_correct` / `_delete` — record + version + event mutate together or not at all; the definer-owner performs the internal writes (DCI-1.1: application code holding the service-role key CANNOT write any table directly).
- Access (DCI-1.1 corrected terminology): **RLS enabled · direct user access denied · service repository owner-scoped · RPC-only mutation** — NOT user-JWT owner RLS (no authenticated-user policies exist, intentionally); service_role holds SELECT only; all writes go through the RPCs.
- **No hosted/production apply. LOCAL DISPOSABLE-DATABASE VERIFICATION ONLY.** Rollback classification: `LOCAL_DISPOSABLE_SCHEMA_ROLLBACK` — the documented drop statements were EXECUTED and verified in the disposable DB; **no production rollback is claimed** (no production migration occurred).

## 6. Correction & deletion semantics (§13/§14)

- One visible record per `entryLocalDate`; correction = new version (prior versions preserved; `current_version` pointer updates atomically in the RPC transaction); correction reason is the bounded code `user_correction` (free-text reasons rejected).
- Timezone rule: corrections keep the ORIGINAL `entryLocalDate` + captured timezone — past entries never re-bucket; server validation rejects date/timezone mismatches (`entry_date_timezone_mismatch`).
- Deletion (DCI-1.1 §8 — supersedes the DCI-1 soft-hide model, defect DCI-C5): the user 消す action performs governed **PRIVATE-CONTENT ERASURE**: the deletion RPC removes ALL version content rows and the current record row under a transaction-local governed-erase flag, then appends ONE content-free tombstone event (record id, owner ref, last version count, deletion time, bounded reason code, `retention_expires_at` = 12 months). No raw structured state, option value, memo, acknowledgement copy or recommendation tag survives anywhere (DB-swept in tests AND in the full-stack browser harness). Tombstone retention class: bounded audit metadata; after expiry the account-level data-rights purge path removes it; no indefinite-retention claim is made. Deletion is never converted into a correction; second delete is a no-op; a new entry for the date is allowed afterwards. UI copy states the erasure truthfully (「内容（選んだ状態とメモ）は消去され、復元できません」).

## 7. Route & feature gating (§9)

`/tests/daily-check-in` + `/api/tests/daily-check-in/**`, ALL gated server-side by `lib/yorisou/methods/daily-check-in/access.ts` (pure module over `deploymentContext`):

| Context | Behavior (verified) |
|---|---|
| `local` / `test` | renders; full local acceptance runs |
| `vercel_preview` | requires EXACT flag `dci_daily_check_in_preview` in `YORISOU_CPV1_DEV_FLAGS` (new `Cpv1DevFlag` token; no Vercel env var added by this package) |
| `production` | **404** (default closed) |
| `unknown` | **404** (fail closed) — proven live against the production build with no trusted marker: route 404, API 404, home 200 |

No navigation card, no `/tests` catalog listing (smoke-tested: zero links), no sitemap entry, `robots: noindex`, no LINE entry point. Client-only hiding is never the gate.

## 8. Events (§19)

Bounded contract recorded in `lib/yorisou/methods/daily-check-in/events.ts` (6 names; ISO timestamp only; NO raw selections/memo/result content). **Emission deferred** — the existing governed event infra is open-testing-scoped; widening it would be an unrelated-subsystem change. A future package wires emission against this contract.


---

# DCI-1.1 — Storage Integrity, Server-Authoritative Time & Full-Stack Corrections

## Defects present at `1a59eaa` (recorded honestly)

| # | Defect | Correction |
|---|---|---|
| DCI-C1 | service-role direct writes could bypass atomic RPC invariants (INSERT/UPDATE grants existed) | ALL table writes revoked from service_role (SELECT only); mutation is possible EXCLUSIVELY through the SECURITY DEFINER RPCs; every direct write path (INSERT/UPDATE/DELETE/TRUNCATE × 3 tables) proven to fail under `SET ROLE service_role` |
| DCI-C2 | create timestamp and local date were client-authoritative | Server generates `producedAt` and derives `entryLocalDate` from the validated IANA timezone; client `producedAt`/`entryLocalDate` fields are REJECTED (422 `time_identity_is_server_authoritative`); no backdated or future records |
| DCI-C3 | correction validated against the old timestamp but stored a new one under the same field | Coherent contract: record identity keeps the INITIAL `produced_at` (never overwritten); each version row carries its own server instant; content validated against the stored identity |
| DCI-C4 | anonymous continuation dropped the original completion time and timezone | Pending contract v2 preserves `completedAt` + original timezone + method/schema versions; server accepts them only within 10 min (+120s skew); local date derives from the ORIGINAL timezone (midnight-crossing + timezone-change tested); expired time returns a bounded error, never a silent backdate |
| DCI-C5 | user deletion retained raw private state and memo indefinitely | Governed private-content ERASURE (see §6 above) with a 12-month-retention content-free tombstone |
| DCI-C6 | authenticated browser-to-real-backend round-trip not executed | Full-stack local harness (below) executed and PASSED; also runs in the DCI CI workflow |
| DCI-C7 | remote CI did not execute DCI-specific gates | `.github/workflows/dci-1-ci.yml` runs every DCI gate remotely, including the DB harness and the authenticated full-stack browser harness against CI service containers |

## Access architecture (correct terminology)

`DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION` — RLS enabled; direct user access denied (no policies exist, intentionally — this is NOT user-JWT owner RLS); the server repository is owner-scoped in every query; database mutation is RPC-only. Note on Supabase parity: hosted `service_role` carries BYPASSRLS, so read access rests on the SELECT-only grant and write denial rests on grants (privilege checks precede RLS); disposable test stacks create `service_role` with BYPASSRLS to match.

## Database privilege matrix (final)

| Role | records | versions | events | RPCs |
|---|---|---|---|---|
| public | none | none | none | none |
| anon | none | none | none | none |
| authenticated | none | none | none | none |
| service_role | SELECT | SELECT | SELECT | EXECUTE (create/correct/delete) |
| definer owner (inside RPCs only) | bounded insert/update/governed delete | insert + governed erase | insert | — |

Append-only guards: versions UPDATE/TRUNCATE always blocked, DELETE only under the transaction-local governed-erase flag set inside the deletion RPC; events immutable forever; records TRUNCATE blocked.

## Server-authoritative time contract

Standard create: `producedAt = server now`; `entryLocalDate = localDate(producedAt, submitted valid IANA tz)`; UTC offset derived server-side. Resumed create: original `completedAt` + original timezone preserved iff valid ISO, ≤10 min old, ≤120s future skew; date derived by the server from `completedAt` in the ORIGINAL timezone. Correction: accepted only while `serverNow` in the record's STORED timezone still equals `entryLocalDate` — enforced in the API AND inside the database RPC (`daily_record_correction_window_closed`), never only by UI hiding.

## Full-stack authenticated local acceptance (DCI-C6)

One documented command: `bash tests/daily-check-in/fullstack-local.sh` — disposable PostgreSQL (ephemeral initdb) + PostgREST (local supabase/postgrest image) + /rest/v1 prefix proxy + production app build + isolated auth file-store; executes tests/smoke/daily-check-in-fullstack.spec.ts through the real browser → gated route → cookie auth/session layer → API handlers → server repository → PostgREST REST/RPC → migrated database. Result: **5/5 PASSED**, then full teardown (all test data removed). Covered: signed-in create → server-derived date → history → same-day correction (v2; v1 preserved pre-deletion) → delete → DB-swept content erasure + tombstone; API negatives (time overrides, expired/future resumed time, invalid timezone, duplicate → 409, past-date PATCH, malformed 400, oversized 413); resumed identity preserved across login incl. a UTC+14 timezone whose local date differs from the server's UTC date; anonymous UI completion → login → single-use resumed review → explicit save (with a visible discard control); unauthenticated denial of all four methods. *(HISTORICAL CORRECTION, DCI-C8: the DCI-1.1 "two-account isolation" test only probed a fixed unknown date (2020-01-01) — it did NOT target another account's real record and is not classified as cross-account proof; the true proof landed in DCI-1.2 below.)*


---

# DCI-1.2 — True Cross-Account Isolation, Tombstone Lifecycle & Resume-Provenance

## Defects present at `cb8e92a` (recorded honestly)

| # | Defect | Correction |
|---|---|---|
| DCI-C8 | the full-stack cross-account test PATCHed a fixed unknown date (2020-01-01) — an unknown-date 404 is NOT cross-account proof | TRUE isolation fixture: two authenticated accounts with REAL persisted records in Pacific/Honolulu (UTC-10) vs Pacific/Kiritimati (UTC+14) — local dates guaranteed different, independent of the runner's UTC date. B's GET excludes A's record (and its content); B's PATCH/DELETE against A's ACTUAL entryLocalDate return the same bounded 404 body as an unknown date (no existence leak); B's own record stays readable/mutable (→v2); then A's record is re-verified byte-unchanged (same state JSON, version 1, ZERO deletion tombstones) |
| DCI-C9 | deletion left the record's prior created/corrected audit events indefinitely, and no executable expiry purge existed (the evidence implied an operating account-level purge path — it was not) | deletion RPC now also removes all prior created/corrected events → EXACTLY ONE retained DCI object (the content-free tombstone); new `yorisou_daily_tombstone_purge_expired(p_limit)` (SECURITY DEFINER, fixed search_path, service-role only, bounded 1..5000, deleted-events-only, expiry-only, deterministic count); tested pre-expiry (0), post-expiry (1), non-expired survives, created events ineligible, invalid limits rejected, direct DELETE still denied |
| DCI-C10 | pending method/schema provenance was stored but never validated (a stale payload could be applied and saved) | client: `checkPendingCompatibility` gates the resume BEFORE any UI application (contract marker, exact method/schema versions, field/option validity; stale → honest JA note, no prefill, no coercion); server: `resumed: true` requires EXACT canonical `methodVersion` + `schemaVersion` else 422 `resumed_contract_version_mismatch` with NO record created (DB-count-verified) |
| DCI-C11 | the DCI workflow had no automatic post-merge main-push execution, and the secret scan assumed `origin/main...HEAD` | workflow now triggers on path-filtered pushes to `main` as well; secret scan is context-aware (PR: `origin/<base>...HEAD`; main push: `event.before..sha` with all-zero-before fallback; feature push: explicit `merge-base origin/main`..HEAD) |

## Tombstone lifecycle (final contract)

User deletion leaves exactly one DCI row: `event_type='deleted'` with event id, former record id, owner ref, last version count, deletion timestamp, `user_deleted` reason code, `retention_expires_at`. It contains NO structured state, option values, memo, acknowledgement id/copy, hint tag, timezone or result copy (id/version/timestamps only — schema-verified). **Retention status (truthful):** the 12-month expiry is a GATED IMPLEMENTATION CANDIDATE only — no hosted migration has occurred, NO purge schedule is active anywhere, and no already-operating account-level purge path is claimed; hosted apply and public activation require a later Founder-approved privacy and operations decision. The purge function makes expiry EXECUTABLE (one bounded call), nothing more.
