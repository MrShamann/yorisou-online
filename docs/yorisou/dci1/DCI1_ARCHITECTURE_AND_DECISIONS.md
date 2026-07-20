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

- `yorisou_daily_state_records` — current visible entry; partial unique `(owner_account_id, entry_local_date) where deleted_at is null`; identity = `produced_at` (UTC) + `entry_local_date` + IANA `timezone` (+ optional `utc_offset_minutes`); memo ≤140; method CHECK `daily-check-in`.
- `yorisou_daily_state_record_versions` — append-only content history (block-mutation triggers via clean-main `yorisou_cpv1_block_mutation()`); `reason_code in ('initial','user_correction')`.
- `yorisou_daily_state_history_events` — append-only audit/tombstone events; **structurally carries NO state and NO memo columns**.
- Atomic RPCs (SECURITY DEFINER, service-role execute only, fixed `search_path=public`): `yorisou_daily_record_create` / `_correct` / `_delete` — record + version + event mutate together or not at all.
- RLS: enabled on all three; ALL direct grants revoked from public/anon/authenticated (product-family posture — app auth is cookie-based, no user JWT reaches PostgREST; owner scoping enforced in the server-only repository + API layer).
- **No hosted/production apply. LOCAL DISPOSABLE-DATABASE VERIFICATION ONLY.** Rollback classification: `LOCAL_DISPOSABLE_SCHEMA_ROLLBACK` — the documented drop statements were EXECUTED and verified in the disposable DB; **no production rollback is claimed** (no production migration occurred).

## 6. Correction & deletion semantics (§13/§14)

- One visible record per `entryLocalDate`; correction = new version (prior versions preserved; `current_version` pointer updates atomically in the RPC transaction); correction reason is the bounded code `user_correction` (free-text reasons rejected).
- Timezone rule: corrections keep the ORIGINAL `entryLocalDate` + captured timezone — past entries never re-bucket; server validation rejects date/timezone mismatches (`entry_date_timezone_mismatch`).
- Deletion: soft-hide (`deleted_at`) + content-free `deleted` tombstone event; never converted into a correction; owner-authorized; second delete is a no-op; a new entry for the date is allowed afterwards. Honest boundary: version-content rows REMAIN in the append-only history layer (never served to any user surface) per CPV1 audit policy; physical purge belongs to the existing account-level data-rights flow (`yorisou_account_deletion_requests`), not this RPC.

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
