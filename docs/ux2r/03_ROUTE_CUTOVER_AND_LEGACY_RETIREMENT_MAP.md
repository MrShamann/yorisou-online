# CPC-1 · 03 — Route Cutover and Legacy Retirement Map

> **FROZEN.** Classification governs the cutover. No route is deleted before the canonical path works.

## Result-context classification

| class | meaning |
|---|---|
| `CANONICAL_RESULT_ID_REQUIRED` | must carry `resultRowId`; private |
| `PUBLIC_SAFE_DERIVATIVE` | governed public content only; must NOT carry the private UUID |
| `NO_RESULT_CONTEXT` | independent of any result |
| `LEGACY_COMPATIBILITY_ONLY` | works only when no `?result` is present; temporary |
| `DEPRECATE` | retire after cutover |

## Map

| route | class | action |
|---|---|---|
| `/check-in` | `NO_RESULT_CONTEXT` | RETAIN — canonical entry (attempt lifecycle) |
| `/report-loading` | `CANONICAL_RESULT_ID_REQUIRED` | ADAPT — honest transition, preserve identity, no simulated computation |
| `/result` | `CANONICAL_RESULT_ID_REQUIRED` | ADAPT — persisted mode exclusive |
| `/result` (no `?result`) | `LEGACY_COMPATIBILITY_ONLY` | bounded, temporary |
| `/result/share` | `PUBLIC_SAFE_DERIVATIVE` | ADAPT — governed public content only; private UUID NOT shared by default |
| `/result/return` | `CANONICAL_RESULT_ID_REQUIRED` | ADAPT — claim-by-result return anchor |
| `/saved` | — | MERGE — one canonical system; legacy local labelled or retired |
| `/saved/tests/[id]` | `LEGACY_COMPATIBILITY_ONLY` | ADAPT — must not be required for core actions |
| `/private-state` | `CANONICAL_RESULT_ID_REQUIRED` | ADAPT — becomes the actionable continuity surface |
| `/recommendations` | — | MERGE into the server-backed graph (localStorage-only surface retired) |
| `/recommendations/graph` | `CANONICAL_RESULT_ID_REQUIRED` | RETAIN — real persisted feedback loop |
| `/login`, `/register` | `NO_RESULT_CONTEXT` + safe return | RETAIN — internal relative returns only |
| LINE entry/return | same contracts as Web | RETAIN — no private completion path |
| `/prototype/**` | — | INTERNAL_ONLY — never a user destination |
| `/admin/**` | — | INTERNAL_ONLY |

## Cutover rules

1. No duplicate Saved systems visible to a user.
2. No duplicate Recommendation systems visible to a user.
3. No duplicate result authority.
4. No dead-end authentication return.
5. Redirects preserve auth, intended destination and the canonical result identity.
