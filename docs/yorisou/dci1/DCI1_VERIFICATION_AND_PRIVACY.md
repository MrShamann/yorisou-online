# DCI-1 — Verification Evidence, Privacy/Consent Review & Test Inventory

## 1. Validation battery results (all executed on this branch)

| Check | Result |
|---|---|
| DCI canonical/runtime/ack/longitudinal/hint/registry/gate contract (`npm run test:daily-check-in`) | **34 checks passed** |
| Canonical hash reproduction (independent sha256) + artifact drift (`--check`) | PASS (hash `4107f004…a8bd3`) |
| Disposable-DB migration/RLS harness (`npm run test:daily-check-in:db`) | **ALL CHECKS PASSED** — apply + idempotent re-apply; RLS on ×3; zero policies; PUBLIC/anon/authenticated denied (tables + RPCs); service-role scoped grants; create→record+v1+event; duplicate-day → `daily_record_exists`; correction→v2 with v1 content untouched + atomic pointer + event; append-only enforced (update/delete/truncate blocked); delete→hidden + content-free tombstone + re-create allowed; cross-owner correction denied; memo-length/owner-required/method CHECKs; fixed `search_path`; **rollback statements executed and verified (LOCAL_DISPOSABLE_SCHEMA_ROLLBACK)** |
| CPV1 contract (`npm run test:cpv1`) | 62 checks passed (registry change absorbed) |
| Existing suites (c02 / relationship-fatigue / result-reveal / imairo-snapshot / candidate-intake / agent-runtime) | all passing |
| MTF-1 validator | 67/67 |
| MTF-2A validator (default mode, context-corrected) | 93 labeled + 25 fixtures + 1 gate (2 N/A) · 0 failures |
| MTF-2A validator (historical scope `d992a6e..cf9aee9`) | 93 + 25 + **3 gates** · 0 failures |
| `npx tsc --noEmit` | 0 errors |
| eslint (all changed paths) | 0 errors |
| `npm run build` | success (production build) |
| Playwright full smoke vs the PRODUCTION build (test context, port 3100) | **52/52 passed** (desktop + Pixel 5 mobile; includes all pre-existing specs — no regression) |
| Changed-content secret scan | clean |
| Dependency review | **zero dependencies added/changed** (axe = existing transitive `node_modules/axe-core`; package.json diff = 3 test/generate script commands only) |

## 2. Accessibility proof (§20) — REAL axe engine

`tests/smoke/daily-check-in.spec.ts` injects the actual `node_modules/axe-core/axe.js` and runs `axe.run(document)` on: entry state, validation state, acknowledgement state, and the authentication-continuation state — on BOTH desktop and mobile projects. Gate: **0 serious, 0 critical violations — PASS (8 axe executions)**. Additional checks: keyboard operability (radio focus/Space/Enter submit), no horizontal overflow at 390px, memo default-off, no streak/countdown/pressure vocabulary. Evidence class: real-axe-engine-local-run (not a hosted-Preview run; no Preview deployment exists for this branch gate).

## 3. Browser acceptance (§22)

16 scenario executions (8 × desktop + mobile): one-screen canonical flow render · empty-submit rejection · memo-only rejection · deterministic canonical acknowledgement (no score vocabulary) · anonymous API 401 (POST/PATCH/DELETE/GET all auth-gated) · pending-entry continuation (sessionStorage only; state never in URL; login link `/login?next=/tests/daily-check-in`) · anonymous history explanation (no fake data) · keyboard flow · `/tests` catalog non-exposure. Authenticated save/history/correction/deletion round-trips are covered end-to-end at the DB layer (harness above) and at the API validation layer; a full browser round-trip with a signed-in session against a local backend was NOT executed in this package run (no local Supabase REST stack was brought up) — recorded honestly as an unresolved verification item below.

## 4. Longitudinal & acknowledgement determinism (§15/§16)

Longitudinal: 10 deterministic test groups — rain / low-battery / swirl / repeated-need ({need} label fill) / need ties (「と」, canonical order) / sunny (≥4) / mixed-weather (≥4 distinct) / field-valid exclusion of unanswered fields / insufficiency copy (<3 days; 30-day <7 days) / max-2-simultaneous in priority order — all against canonical `daily-longitudinal-v1` semantics; no streak/worsening/score concepts (asserted). Acknowledgements: exact 13 canonical records (byte-equal copy), first-match cascade order verified, all 13 reachable, default always available, version `daily-ack-v1.2`.

## 5. Privacy & consent review (§17/§18)

- Persisted records private by default; server repository owner-scoped in every query; anonymous users cannot read or mutate anything (401 before store access; RLS enabled with direct user access denied — deny-all direct access + RPC-only mutation, not user-JWT owner RLS).
- No state field or memo in share cards or URLs (no share surface exists for this method; smoke asserts URL cleanliness); no state/memo in client or server logs (error paths log bounded error CODES only — reviewed line-by-line); no analytics emission at all in DCI-1 (event contract deferred); memo never used in hints (hints read `kyou_hoshii` only); no AI/LLM call anywhere in the slice; NO cross-method understanding update (nothing writes to CPV1 observations/understanding); no supplier/external access; no moderator surface.
- Purpose separation: (1) private save = the explicit save action; (2) cross-method understanding = **disabled in DCI-1** (not implemented); (3) recommendation hints = separate user-initiated reveal (「…ヒントを見る（任意）」) shown only AFTER a successful private save — never automatic, never bundled into the save consent. Hint output carries fitReason + source option + private-only boundary; unanswered need → explicit `no_recommendation`; no commercial content.
- Anonymous continuation: device-local sessionStorage only, 10-minute TTL, taken exactly once; anonymous state is never silently merged into an account — the user explicitly signs in and the resumed entry is shown for review before any save.

## 6. API contract (§21)

`GET/POST /api/tests/daily-check-in/records`, `PATCH/DELETE /api/tests/daily-check-in/records/[date]` — all: server-side feature gate (404 when closed) → `getViewerContext()` owner gate (401) → schema/method/timezone validation via the recorded-state runtime (422 with bounded codes) → atomic RPC. 409 `record_exists_use_correction` for duplicate-day POST (idempotent guidance); 503 `backend_unavailable` truthful state; no service-role secret in client code (repo is `server-only`); no enumeration (owner-scoped filters only, bounded 62-day window); no memo in error logs. Rate limiting: none added — consistent with the existing test-save endpoints (no repository rate-limit pattern exists); recorded as a platform-level follow-up.

## 7. CI & Production non-mutation

- CI on the final HEAD: see PR #118 checks (recorded in the closeout).
- Production: NOT deployed, NOT configured; no hosted migration applied; `https://yorisou.online` untouched by this package; the route does not exist on production main (verified 404 pre-existing) and the gate closes production regardless.

## 8. Unresolved items (honest)

1. **Authenticated browser round-trip against a live local backend** (create→history→correct→delete through the UI with a signed-in session + local Supabase REST): the persistence semantics are fully proven at the DB layer and the API layer is validation-tested, but the combined browser+backend pass awaits a local-stack session (or the Founder-authorized Preview with an isolated backend).
2. **Event emission** deferred by design (§19) — contract recorded.
3. **Rate limiting** — no per-route limiter exists repository-wide; follow-up belongs to a platform package.
4. **JS-failure degradation**: the flow requires JavaScript (controlled client component). The page renders content and an honest static form skeleton without JS, but submission needs JS — consistent with every existing test flow in the repository.

## 9. Genuinely unresolved Founder decisions (only)

- **FD-DCI-1**: accept/reject this implementation candidate (Founder Review of PR #118) — acceptance would authorize flipping registry `implementation` to `complete` and scheduling the merge package.
- **FD-DCI-2**: whether/when to authorize an isolated-Preview acceptance run (requires setting `dci_daily_check_in_preview` + a Preview backend — both outside this package's authority).


---

# DCI-1.1 — Verification Addendum

## Corrected results (final DCI-1.1 state)

| Check | Result |
|---|---|
| DCI contract suite (`npm run test:daily-check-in`) | **41 checks passed** (adds the server-authoritative time contract: server identity, resumed windows, midnight crossing, timezone-change no-re-bucket, correction window) |
| Disposable-DB harness (`npm run test:daily-check-in:db`) | **ALL CHECKS PASSED** — DCI-1.1 additions: every direct write (INSERT/UPDATE/DELETE/TRUNCATE × 3 tables) FAILS under `SET ROLE service_role` while the RPCs succeed; initial `produced_at` never overwritten; version rows carry their own server timestamps; past-local-date correction rejected in-database; governed erasure sweeps (record row gone, zero version rows, memo string absent database-wide, content-free tombstone with 12-month retention); **two concurrent corrections serialize to exactly v3 with three distinct version rows**; rollback executed (incl. dropping `yorisou_dci_block_mutation`) |
| Full-stack authenticated acceptance (`bash tests/daily-check-in/fullstack-local.sh`) | **5/5 PASSED** — see the architecture doc's DCI-1.1 section for the exact coverage |
| API negatives | malformed JSON → 400; >16KB body → 413; client `producedAt`/`entryLocalDate` → 422 `time_identity_is_server_authoritative`; expired/future resumed time → 422 bounded codes; duplicate day → 409; correction after local midnight → 409 `correction_window_closed`; internal Postgres text never exposed (allowlisted `RPC_ERROR_MAP` only) |
| DCI-focused remote CI | `.github/workflows/dci-1-ci.yml` — generator drift, contract suite, MTF validators (both modes), migration guard, DB harness (CI service Postgres), tsc, focused eslint, secret scan, build, focused browser tests, authenticated full-stack harness (CI PostgREST + real app) |

## Deletion retention rule (canonical)

Tombstone purpose: bounded deletion audit + duplicate/idempotency handling. Retention class: metadata-only (record id, owner ref, method id via record linkage, last version count, deletion instant, reason code). Expiry: `retention_expires_at` = deletion + 12 months; purge path: the account-level data-rights flow (`yorisou_account_deletion_requests`); access boundary: service-role SELECT only, never served to any user surface. No documented legal basis exists for indefinite retention, so none is claimed.

## Status of DCI-1's unresolved items

1. Authenticated browser round-trip vs a live local backend — **CLOSED (DCI-C6)** by the full-stack harness (local + CI).
2. Event emission — still deferred by design (contract recorded); unchanged.
3. Rate limiting — still a platform-level follow-up (no repository-wide limiter pattern exists); unchanged.
4. JS-failure degradation — unchanged (consistent with every existing test flow).
