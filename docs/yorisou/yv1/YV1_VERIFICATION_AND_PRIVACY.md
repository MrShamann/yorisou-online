# YV-1 — Verification Evidence & Privacy/Consent Review

## Verification battery (all on this branch)
| Check | Result |
|---|---|
| Canonical bank-hash reproduction + generator drift (`--check`) | PASS (`919f1725…`) |
| YV-1 contract suite (`npm run test:yorisou-values`) | **25 checks passed** — canonical integrity; 48 unique IDs; 7 dimensions; 14/13/14/14/13/14/14 appearances; 8 results; coverage (0 & 1..47 → insufficient); every dimension-led result reachable; VAL_R_MIXED reachable; exact 0.05 boundary (synthetic runtime); A/B inversion + answer-order invariance + determinism; secondary signal + declaration-order tie; malformed/unknown-item/unknown-side/hash-mismatch/unsupported-model rejected; NO internal numerics in output; consent-gated private hints; gate matrix; registry non-public; resume provenance matrix |
| Disposable-DB harness (`npm run test:yorisou-values:db`) | **ALL CHECKS PASSED** — privilege matrix (service_role SELECT-only; all direct writes fail under SET ROLE); RPC create; retake = distinct record; correction → v2 with v1 answers preserved; append-only enforced; deletion = content erasure + EXACTLY ONE tombstone (12-month expiry); whole-DB answer sweep; purge matrix (pre-expiry 0 / expired 1 / non-expired survives / limit rejection / role denial); two-owner isolation; executed rollback |
| Full-stack acceptance (`bash tests/yorisou-values/fullstack-local.sh`) | **3/3 PASSED** (disposable Postgres + PostgREST + real app + cookie auth): authenticated create → server scoring (VAL_R_ANSHIN) → read → correct (v2) → retake (distinct) → delete (erased, one tombstone); provenance/hash/insufficient/malformed/oversized rejected before persistence; TRUE two-account isolation (B cannot read/correct/delete A's real record — bounded 404; A unchanged, no tombstone); unauthenticated four-method denial. Complete teardown verified. |
| Browser smoke (`tests/smoke/yorisou-values.spec.ts`) | **14/14** (desktop + mobile) — intro + interpretation limits, one-pair-per-screen + progress + back, insufficient-coverage resume, anonymous 401 + login continuation (answers never in URL), all API methods auth-gated + provenance mismatch, anonymous history explanation, no catalog exposure |
| Real axe (desktop + mobile) | **0 serious / 0 critical** across intro, question, review+login states |
| Regression: MTF-1 67/67 · MTF-2A default + scope 0 failures · CPV1 62/62 · DCI-1 45/45 · DCI DB harness · migration guard · other suites | all green |
| tsc / eslint / build / secret scan | 0 / 0 / clean / clean |
| Dependency review | **zero dependencies added** (axe = existing transitive; package.json diff = 3 script commands) |

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
- Local test evidence: contract 25, DB harness, full-stack 3, browser 14, axe 0/0.
- CI evidence: `.github/workflows/yv-1-ci.yml` (recorded on PR).
- Hosted state: NONE — no hosted migration applied, no hosted Supabase contact, no Vercel change, `yorisou_values_preview` not enabled.
- Public state: CLOSED — `/tests/yorisou-values` 404 in production/unknown; no nav/catalog/sitemap.

## NOT claimed
Hosted migration applied · public route available · Preview accepted · production data verified · live retention purge operational · public activation · LINE/app support · paid report availability · generalized Dynamic Test Engine completion.

## Genuinely unresolved Founder decisions
- **FD-YV-1** — accept/reject the implementation candidate (Founder Review of the PR); acceptance authorizes flipping `implementation` to `complete` and a merge package.
- **FD-YV-2** — optional hosted-Preview acceptance (flag + isolated backend).
- **FD-YV-3** — retention/purge activation + anti-screening ToU legal finalization at hosted apply.
