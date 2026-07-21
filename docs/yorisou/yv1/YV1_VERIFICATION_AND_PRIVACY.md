# YV-1 — Verification Evidence & Privacy/Consent Review

> **Updated by YV-1.1.** The contract-suite row below now reflects the corrected,
> genuine scoring proofs (concrete real-bank Mixed fixture, exact 0.05 boundary,
> side-swapped A/B inversion) that replaced three previously vacuous tests, plus
> the new provenance / confirmation / anonymous / strict-field coverage. See
> §"YV-1.1 corrective evidence" below and `YV1_TEST_INVENTORY.md`.

## Verification battery (all on this branch)
| Check | Result |
|---|---|
| Canonical bank-hash reproduction + generator drift (`--check`) | PASS (`919f1725…`) |
| YV-1 contract suite (`npm run test:yorisou-values`) | **27 checks passed** — canonical integrity; 48 unique IDs; 7 dimensions; 14/13/14/14/13/14/14 appearances; 8 results; coverage (0 & 1..47 → insufficient); every dimension-led result reachable; **concrete real-bank VAL_R_MIXED fixture (gap<0.05, closeSet both tops, resultId MIXED)**; **exact 0.05 boundary through the real runtime (0.05 not / 0.04 Mixed / 0.06 not, internal gap asserted)**; **genuine side-swapped-bank A/B inversion**; answer-order invariance + determinism; secondary signal + declaration-order tie; malformed/unknown-item/unknown-side/hash-mismatch/unsupported-model rejected; NO internal numerics in output; consent-gated private hints; gate matrix; registry non-public; resume provenance matrix; **six-field provenance gate — ALL SIX incl. `method_id`, drifted independently + strict-field allowlists** |
| Disposable-DB harness (`npm run test:yorisou-values:db`) | **ALL CHECKS PASSED** — privilege matrix (service_role SELECT-only; all direct writes fail under SET ROLE); RPC create; retake = distinct record; **answer-correction (10-arg provenance sig) → v2, confirmation unchanged, one `corrected` event; byte-equal rejected; stale provenance rejected**; **`set_confirmation`: grant matrix, no version increment, one `confirmation_changed` event per change, invalid/stale/cross-owner rejected**; append-only enforced; deletion = content erasure + EXACTLY ONE tombstone (12-month expiry, confirmation events erased too); whole-DB answer sweep; purge matrix; two-owner isolation; executed rollback (both new RPC signatures dropped) |
| Full-stack acceptance (`bash tests/yorisou-values/fullstack-local.sh`) | **7/7 PASSED** (disposable Postgres + PostgREST + real app + cookie auth): authenticated create → server scoring (VAL_R_ANSHIN) → read → correct (v2) → retake (distinct) → delete (erased, one tombstone); provenance/hash/insufficient/malformed/oversized rejected before persistence; TRUE two-account isolation; unauthenticated four-method denial; **YV-C1 confirmation is a distinct op (no version bump, one `confirmation_changed` event) + strict PATCH (empty/ambiguous/unknown → 400, byte-equal → 409)**; **YV-C3 anonymous non-persistent `POST /score` (saved:false, no id, no numerics, nothing persisted; stale/insufficient → 422; confirmation field → 400) + YV-C4 create rejects unknown fields**; **YV-C7 anonymous→login return journey (48 anon → non-persistent result → sign-in-to-save → return opens completed review directly, not Q48 → no auto-persist → ONE explicit save = one assessment + one version → pending cleared only after save → refresh no duplicate)**; **YV-C8 truthful/idempotent confirmation (first → 1 event; identical repeat → no added event; genuine change → +1 event; answers/result/version unchanged)**. Complete teardown verified. |
| Browser smoke (`tests/smoke/yorisou-values.spec.ts`) | **18/18** (desktop + mobile) — intro + interpretation limits, one-pair-per-screen + progress + back, insufficient-coverage resume, **anonymous completion shows a result WITHOUT saving then explicit sign-in-to-save (persistence still 401; `/score` non-persistent; answers never in URL)**, **YV-C7 resume with 48 answers opens the completed review directly (not Q48), pending peeked-not-consumed**, **YV-C7 stale pending discarded + truthful notice**, all API methods auth-gated + provenance mismatch, anonymous history explanation, no catalog exposure |
| Real axe (desktop + mobile) | **0 serious / 0 critical** across intro, question, anonymous-result states |
| Regression: MTF-1 67/67 · MTF-2A default + scope 0 failures · CPV1 62/62 · DCI-1 45/45 · DCI DB harness · migration guard · other suites | all green |
| tsc / eslint / build / secret scan | 0 / 0 / clean / clean (secret scan on CI) |
| Dependency review | **zero dependencies added** |

## Privacy & consent review (§10/§11/§15/§18)
- Persisted answers and private result content are **private by default** (P1); server repository owner-scoped in every query; anonymous cannot read/mutate anything (401 before store; RLS deny-all direct + RPC-only mutation).
- **Internal win rates are never surfaced** anywhere — verified: `assembleYorisouValuesResult` strips the runtime `internal` field; contract test asserts no `winRate`/`wins`/score tokens in public/private/secondary/close payloads; full-stack asserts the same on the live API response; no numeric score in share-safe copy; answers never in URL (smoke-asserted).
- No state/answers in client or server logs (bounded error CODES only, allowlisted `RPC_ERROR_MAP`); no analytics emission; no AI/LLM call; **no cross-method understanding update** (nothing writes to CPV1 observations); no supplier/external access; no moderator surface.
- Consent separation: (1) saving the private assessment; (2) cross-method understanding = **not implemented** in YV-1; (3) recommendation hints = separate user-initiated reveal (default `no_recommendation`, private-only). Not bundled.
- Anonymous continuation: device-local sessionStorage only, 24h expiry, provenance-gated, discardable, never silently merged into an account.
- Anti-screening: interpretation limits + non-scientific boundary prominent; `usageBoundaryJa` at completion; ToU clause added (bounded).

## Deletion retention rule
Tombstone: bounded audit metadata only (assessment id, owner ref, method id, version count, deletion instant, reason code, expiry). NO answers/result copy/tags (schema-verified). Expiry `retention_expires_at` = deletion + 12 months — a GATED IMPLEMENTATION CANDIDATE; executable purge exists but NO schedule is configured or authorized; hosted operationalization is a separate Founder privacy/ops decision.

## State separation (truthful)
- Canonical authored truth: `docs/yorisou/mtf2a/yorisou-values.v1.json` (frozen).
- Implemented runtime truth: scored runtime + assembly + gated route + persistence candidate.
- Local test evidence: contract 27, DB harness, full-stack 7, browser 18, axe 0/0.
- CI evidence: `.github/workflows/yv-1-ci.yml` (recorded on PR).
- Hosted state: NONE — no hosted migration applied, no hosted Supabase contact, no Vercel change, `yorisou_values_preview` not enabled.
- Public state: CLOSED — `/tests/yorisou-values` 404 in production/unknown; no nav/catalog/sitemap.

## YV-1.1 corrective evidence (provenance, confirmation, anonymous, test integrity)
Applied on draft PR #119 by amending migration `202607210001` in place (never hosted/merged). No canonical JSON / question / dimension / scoring / result copy changed; the `< 0.05` Mixed rule is unchanged.
- **YV-C1** confirmation is a separate mutation: `set_confirmation` RPC (no version increment, one `confirmation_changed` event, reason `user_confirmed`/`user_not_quite`/`user_skipped`); `correct` no longer writes confirmation and rejects a byte-equivalent no-op answer change; API PATCH takes answers XOR confirmation. DB-harness + full-stack + browser verified.
- **YV-C2** stored-record provenance enforced in the locked transaction (no TOCTOU) and at the API read/write boundary; drift → bounded `values_record_contract_version_mismatch` (409/RPC exception); a stale record is never reinterpreted but stays deletable. (YV-1.1 verified FIVE fields; `method_id` was added in YV-1.2 — see below.)
- **YV-C3** anonymous non-persistent scoring endpoint `POST /api/tests/yorisou-values/score` (gated, no auth, no DB, answers never logged, `saved:false`, no internal numerics). Full-stack proves zero persistence; browser proves the signed-out result-then-explicit-save flow.
- **YV-C4** strict API contracts on create/score/PATCH (unknown fields rejected; PATCH also rejects empty + ambiguous). Contract + full-stack verified.
- **YV-C5** three previously vacuous scoring tests replaced with genuine proofs (concrete real-bank Mixed fixture; exact 0.05 boundary via a synthetic 1/100-grid bank; side-swapped-bank A/B inversion); provenance/confirmation/strict/anonymous coverage added at DB, contract, and full-stack levels.

## YV-1.2 final corrective evidence (six-field provenance, login continuation, truthful/idempotent confirmation)
Applied on draft PR #119 by amending migration `202607210001` in place (never hosted/merged). No canonical JSON, questions, dimensions, scoring, result IDs/copy, the `< 0.05` Mixed rule, registry activation state, route identity, persistence ownership, or deletion architecture changed. Bank hash remains `919f1725…`.
- **YV-C6** all SIX provenance fields now enforced — `method_id` added to `CANONICAL_VALUES_PROVENANCE`, to `recordProvenanceMatchesCanonical`, and as an explicit `p_expected_method_id` argument verified inside BOTH mutation RPCs against the locked row. The `method_id` CHECK constraint is not treated as a substitute. Contract test drifts each of the six fields independently; DB harness proves a wrong expected `method_id` is rejected by both RPCs. This corrects the YV-1.1 claim that "all six" were checked — only five were.
- **YV-C7** complete anonymous→authenticated explicit-save continuation. Resume PEEKS pending progress (no consume-on-read); a completed (48-answer) pending opens directly on the review/save state — never back to question 48 — with no automatic persistence; one explicit save creates exactly one owned assessment + one initial version; pending is cleared only on explicit discard, a successful save, or a stale entry (truthful notice); a failed save keeps pending recoverable; duplicate submits guarded. Full-stack proves the 13-step journey incl. no-duplicate-on-refresh; browser proves resume-into-review + peek-not-consumed + stale-discard.
- **YV-C8** truthful + idempotent confirmation. Client updates the displayed confirmation only on `response.ok`, shows truthful JA error copy otherwise, and blocks concurrent clicks; the RPC no-ops on an unchanged confirmation (no added event, no `updated_at` bump, no version change) and emits exactly one event on a genuine change. DB harness + full-stack verified.

## NOT claimed
Hosted migration applied · public route available · Preview accepted · production data verified · live retention purge operational · public activation · LINE/app support · paid report availability · generalized Dynamic Test Engine completion.

## Genuinely unresolved Founder decisions
- **FD-YV-1** — accept/reject the implementation candidate (Founder Review of the PR); acceptance authorizes flipping `implementation` to `complete` and a merge package.
- **FD-YV-2** — optional hosted-Preview acceptance (flag + isolated backend).
- **FD-YV-3** — retention/purge activation + anti-screening ToU legal finalization at hosted apply.
