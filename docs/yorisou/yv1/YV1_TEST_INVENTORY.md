# YV-1 — Test Inventory

## Contract suite — `lib/yorisou/methods/yorisou-values/__tests__/yorisouValues.test.ts` (25 checks)
Canonical integrity (hash, generator drift, identity/versions, 48 unique IDs, pair/choice consistency, 7 dimensions, appearance counts, 8 results + copy) · scoring (48/48 required; 0 & 1..47 insufficient; every dimension-led result reachable; VAL_R_MIXED reachable; exact 0.05 Mixed boundary via synthetic runtime; A/B inversion invariance; answer-order invariance + determinism; secondary signal; declaration-order tie-break; malformed/unknown-item/unknown-side/hash-mismatch rejected; unsupported execution model rejected) · privacy (no internal numerics in output; consent-gated private hints; interpretation + anti-screening present) · gate + registry (production/unknown 404, local/test open, preview needs exact flag; yorisou-values gated non-public; daily-check-in unchanged) · resume provenance (valid compatible; stale method/bank/scoring/schema/hash/expiry/malformed rejected).

## Disposable-DB harness — `tests/yorisou-values/postgres-integration.sh`
Privilege matrix + direct-write denial (SET ROLE service_role) + RPC success · retake distinct · correction versioning with preserved prior answers · append-only enforcement · deletion content-erasure + exactly-one-tombstone + whole-DB answer sweep · purge matrix · two-owner isolation · executed rollback.

## Full-stack acceptance — `tests/smoke/yorisou-values-fullstack.spec.ts` (via `tests/yorisou-values/fullstack-local.sh`, 3 tests)
Authenticated create→score→read→correct→retake→delete; provenance/insufficient/malformed/oversized rejection with no-persistence proof; TRUE two-account isolation + unauthenticated denial. Real app/auth/API/repository/PostgREST/database path; disposable, torn down.

## Browser smoke — `tests/smoke/yorisou-values.spec.ts` (7 scenarios × desktop+mobile = 14)
Intro + limits (axe) · one-pair-per-screen + progress + back (axe) · insufficient-coverage resume · anonymous 401 + login continuation + URL cleanliness (axe) · all API methods auth-gated + provenance mismatch · anonymous history · no catalog exposure. Real axe engine: 0 serious / 0 critical.

## Remote CI — `.github/workflows/yv-1-ci.yml`
push (feature + main, path-filtered) · PR (main) · dispatch. Runs: generator drift, contract suite, MTF-1, MTF-2A (default + scope), migration guard, disposable-DB harness (CI service Postgres), tsc, focused lint, context-aware secret scan, build, browser acceptance, authenticated full-stack harness (CI PostgREST + real app).
