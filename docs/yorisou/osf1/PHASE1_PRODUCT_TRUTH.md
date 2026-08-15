# YORISOU Phase 1 — Product Truth

**Written 2026-08-15.** Branch `feat/osf1-internal-beta-readiness`, PR #135, base `main` `f6bb81f`.

> **This file exists to stop future claims that outrun the code.** If a report, a prompt or an agent
> says YORISOU has a Life Graph, an autonomous agent, a public beta, Legacy, a marketplace, or
> complete long-term memory intelligence — **it is wrong**, and this table is the answer. Every row
> carries exactly one status, and a status is only `VERIFIED` when a test that could fail was run.

**Status vocabulary**

| | |
|---|---|
| `IMPLEMENTED` | code exists and typechecks |
| `VERIFIED` | implemented **and** proven by an executed test that could have failed |
| `INTERNAL_READY` | verified and reachable in INTERNAL mode; not exposed publicly |
| `NOT_ENABLED` | built, deliberately switched off |
| `DEFERRED` | consciously out of scope for Phase 1 |
| `NOT_AUTHORIZED` | must not be built or turned on without a Founder act |
| `FOUNDER_DECISION_REQUIRED` | blocked on a decision only Edward can make |

---

## What exists

| Capability | Status | Evidence |
|---|---|---|
| Current State record (temporal, not an assessment result) | `VERIFIED` | acceptance harness; boundary regression in `osf1InternalBeta.test.ts` |
| State history surface | `IMPLEMENTED` | `app/life/StateHistory.tsx`; rendered under the hub's state section |
| Experience — create, read, update, visibility | `VERIFIED` | `experienceCards` suite (8 assertions); PATCH semantics in the acceptance harness |
| Visibility expansion requires preview confirmation | `VERIFIED` | ranked comparison in `experienceCards.ts`; acceptance assertions |
| Light Reflection — 5 questions | `VERIFIED` | contract suite; acceptance harness stores `mode='light'` |
| Deep Reflection (じっくり振り返る) — 7 questions | `VERIFIED` | contract suite; acceptance harness stores `mode='postmortem'`, `options_considered` round-trips |
| Reflection mode persisted on the row | `VERIFIED` | `mode` column; acceptance asserts light, postmortem, invalid-refused, null-defaults |
| State ↔ Reflection reference (optional, user-chosen) | `VERIFIED` | 8 acceptance assertions: ownership, no auto-link, null-on-state-delete, audit records presence not content |
| Explicit Memory — candidate → confirm → active | `VERIFIED` | `check (user_confirmed = true)`; unconfirmed insert refused at schema level |
| Memory edit with re-confirmation | `VERIFIED` | acceptance harness |
| Memory suppress / restore | `VERIFIED` | acceptance harness; eligibility split proven (retrieval excludes, management includes) |
| Memory revoke (terminal) | `VERIFIED` | restore-from-revoked and suppress-from-revoked both refused |
| Memory delete + deletion receipt | `VERIFIED` | receipt readable by owner only, content-free |
| Memory keyset pagination | `VERIFIED` | walked against real PostgREST: 5 pages, 30/30 distinct, ties exercised, malformed cursor refused |
| Timeline — chronological view of existing records | `IMPLEMENTED` | five sources, sorted, stores nothing |
| Return loop — bounded continuity | `IMPLEMENTED` | mode-aware unfinished list |
| Reflection Assistant — bounded draft capability | `VERIFIED` | AI-boundary suite (10 assertions); reads nothing stored, writes nothing, output refused not truncated |
| Transactional audit for the seven destructive/permission mutations | `VERIFIED` | forced audit failure proves rollback, with a control proving the function still works |
| Append-only audit trail | `VERIFIED` | triggers refuse UPDATE/DELETE/TRUNCATE |
| Account erasure covers Life OS tables | `VERIFIED` | executed against a real cluster after apply/rollback/re-apply |
| One authoritative access resolver | `VERIFIED` | used by 6 pages, the API guard, both navigation surfaces |
| Four activation states OFF/INTERNAL/PREVIEW/PUBLIC | `IMPLEMENTED` | INTERNAL wired to founder-admin resolution |
| Observability — 7 ops events, redaction by type | `VERIFIED` | redaction asserted against the type, not caller discipline |
| Authenticated accessibility, 7 routes × 2 viewports | `VERIFIED` | 14/14, 0 serious, 0 critical, on a real stack with seeded data |
| Migration lineage applies, reverses and re-applies | `VERIFIED` | Gate 3, 42 assertions, in CI |

## What is off, deferred, or forbidden

| | Status | Note |
|---|---|---|
| Production Life OS | `NOT_ENABLED` | every `/life` route 404s in production; verified live |
| PREVIEW cohort | `NOT_ENABLED` | dev flag absent |
| PUBLIC | `NOT_AUTHORIZED` | **unreachable in code** — nothing returns the state; reaching it is a Gate 5 act |
| INTERNAL in production | `NOT_ENABLED` | implemented; requires migration + schema-ready + pilot flag + a founder-admin account |
| Timeline keyset pagination + filters | `DEFERRED` | fixed limit of 20 still in place |
| Return loop explicit selection policy | `DEFERRED` | bounded today, but the policy is implicit |
| Browser E2E for either reflection mode | `DEFERRED` | proven at contract, store, database and audit levels; **not** through a browser |
| INTERNAL access E2E (founder vs normal user) | `DEFERRED` | architecture verified by unit and source assertions only |
| Kill-switch live rehearsal | `DEFERRED` | mechanism exists; **never executed** |
| Authenticated a11y in CI | `DEFERRED` | mandatory local gate instead; blocker is PostgREST on the runner |
| Performance smoke at ~450 rows | `DEFERRED` | never run |
| Audit retention | `FOUNDER_DECISION_REQUIRED` | `RETENTION_POLICY_TBD`; brief with estimates and a tiered recommendation |
| `yorisou_identity_provisioning_sagas` erasure | `FOUNDER_DECISION_REQUIRED` | proven to survive deletion; three options, pseudonymize recommended |
| PRIVATE-flagged content reaching moderation | `FOUNDER_DECISION_REQUIRED` | policy unchanged; disclosure names the trigger before typing |
| Memory suppress/revoke/receipt vs governance §3.2 | `IMPLEMENTED` | the three missing rights now exist |
| Full Life Graph | `NOT_AUTHORIZED` | no relationships table; a test fails if one is created |
| Autonomous agents / Companion Core / Specialist Agents | `NOT_AUTHORIZED` | untouched |
| Legacy | `NOT_AUTHORIZED` | untouched |
| Module marketplace | `NOT_AUTHORIZED` | untouched |
| Kakari / Mirai Move / Asterion integration | `NOT_AUTHORIZED` | untouched |
| Long-term memory intelligence | `NOT_AUTHORIZED` | memory is explicit and user-confirmed only; nothing infers, ranks or personalises from it |

## Five sentences no honest report may contain

1. "YORISOU has a Life Graph." — There is no relationships table. Two optional foreign keys the person
   chose are not a graph, and a test fails if one is added.
2. "The Life OS is live." — Every route 404s in production, verified against the live domain.
3. "An agent maintains the user's memory." — Nothing writes a memory without an explicit confirmation;
   the database refuses an unconfirmed row.
4. "The assistant knows the user." — It reads no stored record. Every call is complete in itself.
5. "Phase 1 is fully tested end to end." — There is no browser E2E for either reflection mode, no
   INTERNAL access E2E, and the kill switch has never been fired.
