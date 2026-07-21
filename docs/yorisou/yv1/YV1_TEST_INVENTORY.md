# YV-1 — Test Inventory

> Updated by **YV-1.1** (provenance, confirmation, anonymous completion, and
> test-integrity correction). Three previously vacuous scoring tests were
> replaced with genuine proofs; counts and descriptions below are current.

## Contract suite — `lib/yorisou/methods/yorisou-values/__tests__/yorisouValues.test.ts` (26 checks)
Canonical integrity (hash, generator drift, identity/versions, 48 unique IDs, pair/choice consistency, 7 dimensions, appearance counts, 8 results + copy) · scoring:
- 48/48 required; 0 & 1..47 → insufficient with exact remaining;
- every dimension-led result reachable via a favoring set;
- **YV-C5 CONCRETE 48-answer VAL_R_MIXED fixture** built from the real bank
  (`answersFavoringTwo("seicho","jikkan")`), asserted through the real runtime:
  gap `< 0.05`, `isMixed === true`, `closeSet` holds both tops, assembled
  `resultId === "VAL_R_MIXED"` (the prior test asserted nothing — `void a`);
- **YV-C5 EXACT 0.05 boundary** via a synthetic 100/100/200-appearance bank so
  win rates land on a 1/100 grid: gap `0.05` → NOT Mixed, gap `0.04` → Mixed
  (closeSet `[a,b]`), gap `0.06` → NOT Mixed, each with the internal gap asserted
  to 1e-9 (the prior test only compared 0.0 vs 1.0, never the boundary);
- **YV-C5 GENUINE A/B inversion**: a physically side-swapped bank (choiceA↔choiceB,
  pair reversed) with every answer inverted yields an identical envelope
  (primary/secondary/isMixed/closeSet) across three targets — the swap is proven
  non-trivial (the prior test rebuilt an equivalent object, a no-op);
- answer-order invariance + determinism; secondary signal; declaration-order
  tie-break; malformed/unknown-item/unknown-side/hash-mismatch rejected;
  unsupported execution model rejected.

Privacy (no internal numerics in output; consent-gated private hints;
interpretation + anti-screening present) · gate + registry (production/unknown
404, local/test open, preview needs exact flag; yorisou-values gated non-public;
daily-check-in unchanged) · resume provenance (valid compatible; stale
method/bank/scoring/schema/hash/expiry/malformed rejected).

**YV-1.1 API contract gate (pure `contract.ts`)** — provenance gate: canonical
record matches; EACH of the 6 stored provenance fields, drifted independently,
fails closed. Strict-field helper: unknown key reported; allowlisted keys pass;
empty object passes; `score` allowlist rejects `confirmation`.

## Disposable-DB harness — `tests/yorisou-values/postgres-integration.sh`
Privilege matrix + direct-write denial (SET ROLE service_role) + RPC success ·
retake distinct · **YV-C1/YV-C2 answer-correction** (new 10-arg provenance
signature): recompute → v2, confirmation UNCHANGED, exactly one `corrected`
event; byte-equivalent answers rejected (`values_no_answer_change`); stale
provenance rejected (`values_record_contract_version_mismatch`); cross-owner
denied · **YV-C1 `set_confirmation`**: grant matrix (anon denied / service
allowed); confirmation change with NO version increment and NO new version row;
one `confirmation_changed` event per change (`user_confirmed` / `user_not_quite`);
invalid confirmation, stale provenance, and cross-owner all rejected · append-only
enforcement · deletion content-erasure + exactly-one-tombstone (erases
confirmation events too) + whole-DB answer sweep · purge matrix · two-owner
isolation · executed rollback (drops both new RPC signatures).

## Full-stack acceptance — `tests/smoke/yorisou-values-fullstack.spec.ts` (via `tests/yorisou-values/fullstack-local.sh`, 5 tests)
Authenticated create→score→read→correct→retake→delete; provenance/insufficient/
malformed/oversized rejection with no-persistence proof; TRUE two-account
isolation + unauthenticated denial · **YV-C1 confirmation is a distinct op**
(current version stays 1, one `confirmation_changed` event, no new version row) +
strict PATCH contract (empty → 400, answers+confirmation ambiguous → 400, unknown
field → 400, byte-equal answers → 409) · **YV-C3 anonymous non-persistent
scoring** (`POST /score` returns a result with `saved:false`, no `assessmentId`,
no internal numerics, DB row count unchanged; stale provenance / insufficient →
422; `confirmation` field → 400) + **YV-C4 create rejects unknown fields**. Real
app/auth/API/repository/PostgREST/database path; disposable, torn down.

## Browser smoke — `tests/smoke/yorisou-values.spec.ts` (7 scenarios × desktop+mobile = 14)
Intro + limits (axe) · one-pair-per-screen + progress + back (axe) ·
insufficient-coverage resume · **YV-C3 anonymous completion shows a result
WITHOUT saving, then offers explicit sign-in-to-save** (persistence endpoint still
401; `/score` returns a non-persistent result; UI shows `yv-result` +
`yv-anonymous-save`; save CTA stores on-device progress and routes to
`/login?next=…`; answers never in URL; axe-clean) · all API methods auth-gated +
provenance mismatch · anonymous history · no catalog exposure. Real axe engine:
0 serious / 0 critical.

## Remote CI — `.github/workflows/yv-1-ci.yml`
push (feature + main, path-filtered) · PR (main) · dispatch. Runs: generator
drift, contract suite, MTF-1, MTF-2A (default + scope), migration guard,
disposable-DB harness (CI service Postgres), tsc, focused lint, context-aware
secret scan, build, browser acceptance, authenticated full-stack harness (CI
PostgREST + real app).
