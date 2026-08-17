# YORISOU Phase 1 — Product Truth

**Written 2026-08-15, finalized 2026-08-17.** Branch `feat/osf1-internal-beta-readiness`, PR #135, base `main` `f6bb81f`.

**Governance:** the active baseline is the **YORISOU v0.7.0 complete replacement** (Founder-confirmed
2026-08-17, 40 active resources). This file was written against Pack v0.4.1 and the correction is
recorded in [OSF1_GOVERNANCE_PRECEDENCE.md](OSF1_GOVERNANCE_PRECEDENCE.md) §2; the delta audit against
the active baseline is [OSF1_V070_GOVERNANCE_DELTA_AUDIT.md](OSF1_V070_GOVERNANCE_DELTA_AUDIT.md) and it
required no code change.

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
| `BLOCKING` | must be resolved before internal exposure; not a code defect, but not optional either |

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
| Both reflection modes end-to-end through a browser | `VERIFIED` | real browser + real PostgreSQL; row, audit reason and timeline classification all checked; non-vacuity proven by sabotage |
| PRIVATE experience undiscoverable; queue excludes deleted/withdrawn | `VERIFIED` | acceptance assertions; a real defect in the queue predicate was found and fixed |
| State ↔ Reflection reference (optional, user-chosen) | `VERIFIED` | 8 acceptance assertions: ownership, no auto-link, null-on-state-delete, audit records presence not content |
| Explicit Memory — candidate → confirm → active | `VERIFIED` | `check (user_confirmed = true)`; unconfirmed insert refused at schema level |
| Memory edit with re-confirmation | `VERIFIED` | acceptance harness |
| Memory suppress / restore | `VERIFIED` | acceptance harness; eligibility split proven (retrieval excludes, management includes) |
| Memory revoke (terminal) | `VERIFIED` | restore-from-revoked and suppress-from-revoked both refused |
| Memory delete + deletion receipt | `VERIFIED` | receipt readable by owner only, content-free |
| Memory keyset pagination | `VERIFIED` | walked against real PostgREST: 5 pages, 30/30 distinct, ties exercised, malformed cursor refused |
| Timeline — chronological view of existing records | `VERIFIED` | keyset pagination and filters walked against real PostgREST: 27/27 across 4 pages, cross-kind ties, cursor bound to its filter |
| Return loop — bounded continuity selection | `VERIFIED` | fixed priority, hard cap of three, deduped by record id, reads no memory at all |
| Reflection Assistant — bounded draft capability | `VERIFIED` | AI-boundary suite (10) + provider suite (24): the nine Japanese boundary prompts, every failure mode normalized, fallback bounded to two attempts inside a 25s budget, no tools in the request, request-scoped with no state |
| Reflection Assistant UX — optional, a draft, nothing auto-saved | `VERIFIED` | driven by keyboard end to end: ask, decline, re-offer, accept-by-append; 「使わない」 exists and the draft is refused rather than truncated when it would not fit |
| Transactional audit for all seven mutations that claim the class | `VERIFIED` | 52 assertions of forced audit failure: each rolls back, retries cleanly and audits exactly once; the transactional set is read from the source so an eighth action cannot go unproven |
| Audit-failure UX — nothing lost, calm message, explicit retry | `VERIFIED` | forced failure in a real browser, then PostgreSQL inspected: no row, no audit event, the text still on screen, no digits in the message, no automatic retry, and exactly one of everything after the retry |
| Append-only audit trail | `VERIFIED` | triggers refuse UPDATE/DELETE/TRUNCATE |
| Account erasure covers Life OS tables | `VERIFIED` | executed against a real cluster after apply/rollback/re-apply |
| One authoritative access resolver | `VERIFIED` | used by 6 pages, the API guard, both navigation surfaces |
| Four activation states OFF/INTERNAL/PREVIEW/PUBLIC | `IMPLEMENTED` | INTERNAL wired to founder-admin resolution |
| Observability — 7 ops events, all with producers, redaction by type | `VERIFIED` | three of the seven had NO producer and were undeliverable; a test now requires one per event. The error-class pattern accepted a JWT and was narrowed |
| Authenticated accessibility, 7 routes + 6 dynamic states × 2 viewports | `VERIFIED` | 32/32, 0 serious, 0 critical — including load-more, filters, suppressed, revoked, the assistant draft, a provider refusal and the audit-failure screen |
| Authenticated accessibility in CI | `VERIFIED` | `.github/workflows/osf1-life-ci.yml` is **green**, against PostgreSQL 17 and pinned PostgREST v12.2.3, driving the same harness the acceptance machine runs: axe 32, keyboard 12, audit-failure E2E 2, both reflection modes 3. `AUTHENTICATED_A11Y_CI: ENABLED` |
| Keyboard-only operation of every Phase 1 action | `VERIFIED` | 12/12 on the real stack: visible focus on every stop, no trap, DOM order, both reflection modes, the assistant, memory suppress/restore/revoke/delete, pagination by Enter and by Space, and revoke proven to need two presses |
| Performance at ~450 rows | `VERIFIED` | 12 checks: no N+1, every read carries a LIMIT, page two costs what page one costs, hub 40 KB / 21 reads — measured from PostgreSQL's own statement log |
| Japanese copy — 247 strings audited from source | `VERIFIED` | eight of ten criteria at zero violations; two terminology collisions and one private failure sentence found and fixed |
| Migration lineage applies, reverses and re-applies | `VERIFIED` | Gate 3, 42 assertions, in CI |
| INTERNAL access, founder vs ordinary account | `INTERNAL_READY` | production deployment context, two real sessions: founder reaches all seven routes + API + a write; ordinary account 404 everywhere, no nav leak; six bypass attempts refused |
| Kill switch | `VERIFIED` | fired live: ON -> KILL -> RESTORE, data intact, no duplicate mutation, still signed in. Recovery class MEASURED as `restart_required` (redeploy-class on Vercel) |

## What is off, deferred, or forbidden

| | Status | Note |
|---|---|---|
| Production Life OS | `NOT_ENABLED` | every `/life` route 404s in production; verified live |
| PREVIEW cohort | `NOT_ENABLED` | dev flag absent |
| PUBLIC | `NOT_AUTHORIZED` | **unreachable in code** — nothing returns the state; reaching it is a Gate 5 act |
| INTERNAL in production | `NOT_ENABLED` | implemented; requires migration + schema-ready + pilot flag + a founder-admin account |

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
5. "The assistant can be pointed at a fake in production." — The deterministic fake is a PARAMETER of
   `draftReflection`, passed by no shipped caller. There is no environment variable and no provider
   alias that selects it.

---

## Phase 1 is a module, not the product

**YORISOU's strategic architecture is broader than Phase 1, and this table describes only Phase 1.**
The Canonical Current State defines YORISOU as a modular Personal Life Operating System; what is built
here is the first module of it. Six statements follow, and each is a `NOT` for a reason — the failure
mode this file exists to prevent is a Phase 1 capability being cited as the whole system:

| Phase 1 is NOT | What Phase 1 actually is |
|---|---|
| the full **Personal Life Graph** | six owner-scoped tables and two optional foreign keys the person chose. **No relationships table, no edge table, no graph table exists in any migration** — a test fails if one is created |
| the full **Memory Kernel** | one table that cannot hold an unconfirmed row, with view / correct / suppress / restore / revoke / delete and a content-free deletion receipt. No inference, no ranking, no personalisation, no retrieval |
| the full **Life Continuity Engine** | a bounded Return offer: fixed priority, hard cap of three, deduped, and it reads no memory at all |
| **Companion Core** | a Reflection Assistant that reads nothing stored, writes nothing, keeps no state between calls, offers no tools, and is off by default |
| an autonomous **YORISOU Agent runtime** | no scheduler, no queue, no background process. Companion Core, Platform Orchestrator and Specialist Agents are `NOT_AUTHORIZED` and untouched |
| **Digital Legacy** | `NOT_AUTHORIZED`. No table, route, surface or capability. (`viewer.legacyAccount` in the diff is a pre-existing *authentication* cookie shape, an unrelated word collision) |

**Cross-project integration — Kakari, Mirai Move, Asterion — remains UNACTIVATED.** No shared table, no
shared identity, no data path. The test-product boundary is a hard rule and is enforced: Imairo data
never crosses into Life OS memory, and the protected baseline proves 8 groups byte-unchanged.

## Phase 1 status, as of 2026-08-17

| | |
|---|---|
| **CODE** | `PHASE1_FINALIZED` — every finalization section of the closeout package is executed, not argued |
| **INTERNAL** | `READY` — proven in a production deployment context, founder versus ordinary account, six bypass attempts refused |
| **PREVIEW** | `NOT_ENABLED` — the dev flag is absent |
| **PUBLIC** | `NOT_AUTHORIZED` — unreachable in code; nothing returns the state |
| **PRODUCTION Life OS** | `OFF` — every `/life` route 404s, verified against the live domain |
| **MIGRATIONS** | `READY_FOR_FOUNDER_AUTHORIZED_APPLY` — the lineage applies, reverses and re-applies (Gate 3, 42 assertions). **Not applied.** |

**What `PHASE1_FINALIZED` does and does not mean.** It means the work in this package's scope is done
and evidenced: the audit-failure path, the assistant's provider contract and safety boundary, the
authenticated accessibility gate in CI, the keyboard gate, the copy audit, the UX coherence pass, the
performance smoke, the observability producers. It does **not** mean Phase 1 is live, that any
migration has run, or that anything is enabled. Those are Founder acts and none of them has been taken.

**Three Founder decisions remain open** and none of them blocks internal exposure: audit retention
(`RETENTION_POLICY_TBD`), identity-saga erasure, and whether PRIVATE-flagged content may reach
moderation. Each has a brief with evidence and a recommendation; none has been pre-empted in code.
