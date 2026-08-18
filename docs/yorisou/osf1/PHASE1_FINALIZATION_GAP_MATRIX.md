# OSF-1 Phase 1 Finalization — Gap Matrix

**Produced 2026-08-15 before any code change**, per §0. Base: PR #135 head `afc624a`, main `f6bb81f`.
Every row verified from source in this session, not from prior narrative.
Governance precedence used: `OSF1_GOVERNANCE_PRECEDENCE.md`. **Corrected 2026-08-17:** the active
governance is the **v0.7.0 complete replacement baseline** (Founder-confirmed). Pack v0.4.1 is
historical; its requirements remain implementation constraints where compatible. What this line said
before, kept because a deleted wrong record cannot be learned from:

> **SUPERSEDED TEXT, preserved verbatim — not a current claim:**
>
> Pack v0.4.1 binding; the package's v0.7.0 reference is strategic, not an in-repo execution authority.

---

## Scope reality, stated before the table

This package specifies **31 sections**, several of which are multi-day items on their own (a full UX
coherence pass, a full Japanese copy audit, CI PostgREST adoption, performance smoke, four new
Founder-facing documents, plus two new schema capabilities and a browser E2E suite).

It cannot honestly be completed in one working session. Rather than silently scaling it down — which
is Edward's call, not mine — the matrix below marks each item with the sequence position it needs,
and the delivery report states exactly what was completed and what was not. Nothing is reported as
done that was not executed.

**Dependency-forced ordering:** §2 and §3 both change the same tables and RPCs, so they must land in
**one** migration (the same overload trap that forced one file in `202608160001`). §21's final Gate 3
rehearsal must run **after** that migration is final. Everything else is independent.

---

## Matrix

| § | Area | Current state (verified) | Expected state | Blocker | Change required | Test required |
|---|---|---|---|---|---|---|
| 2 | State ↔ Reflection link | **No column.** `yorisou_life_reflections` has exactly one FK, `experience_id`. Confirmed by grep across all OSF-1 migrations and `contract.ts`. | Optional, user-chosen reference; no auto-link, no inferred causality | none | `current_state_record_id` column + ownership guard in the reflection RPC + contract/API/UI | ownership, erasure, audit, "not auto-linked" |
| 3 | Memory suppress / restore / revoke / receipt | **None exist.** No lifecycle state column; only confirm/update/delete. Governance §3.2 requires all of them plus a deletion receipt. | Full lifecycle CREATE→CONFIRM→ACTIVE→SUPPRESS/RESTORE→REVOKE/DELETE + human-readable receipt | Semantics must come from the corpus, not invented | lifecycle state column, RPCs, retrieval exclusion, receipt surface | 8 listed in §3, incl. suppressed excluded from retrieval |
| 4 | Memory pagination | Keyset implemented **and verified against real PostgREST** (5 pages, 30/30, ties exercised, malformed cursor refused) | Add deletion-between-pages and insertion-between-pages semantics | none | extend the existing harness | two new cases |
| 5 | Timeline pagination + filters | **Fixed `DEFAULT_LIMIT = 20`**, applied after merging five sources | Bounded keyset pagination + type filters | Per-source cursors over a merged list is the hard part | cursor model + filter param | order stability, no dupes/skips |
| 6 | Return loop selection | Fixed-limit, mode-aware since #134 | Deliberate bounded policy with reason labels | none | make the policy explicit and testable | selection + empty states |
| 7 | Postmortem browser E2E | **Absent.** Proved at contract/store/DB/audit only | Real authenticated browser run, non-vacuous | none | new spec + mutation proof | must fail if mode parsing is removed |
| 8 | Light reflection E2E | Absent | 5 questions, mode light, postmortem fields null | none | new spec | audit class correct |
| 9 | Experience privacy | A and B done in #135. C, E, F, G **unverified** | Queue excludes deleted/withdrawn; PRIVATE undiscoverable; browser-level privacy test | none | audit queue query + browser test | one browser privacy expectation |
| 10 | Sagas erasure decision | Proven to survive deletion; recorded in `OSF1_FOUNDER_DECISIONS.md` §3 | Dedicated analysis doc with the nine questions answered | none | `OSF1_IDENTITY_SAGA_ERASURE_DECISION.md` | n/a (analysis) |
| 11 | Audit retention brief | `RETENTION_POLICY_TBD` in code, no brief | Decision brief with growth/storage estimates and option classes | none | new brief; keep TBD in code | n/a (analysis) |
| 12 | Transactional audit failure UX | Mutation fails; user sees a generic failure | Safe localized message, no false success, typed text preserved, explicit retry | none | client + copy | failure-state render |
| 13 | Assistant provider readiness | Bounded; providers resolved through existing infra; no fake provider path | INTERNAL readiness audit + fake provider for E2E | none | reuse existing provider infra; add test provider | provider abstraction test |
| 14 | Assistant UX copy | Copy is already draft-framed | Verify against the "helps me think" principle | none | bounded copy review | copy assertions |
| 15 | Full UX coherence | **Not done** — explicitly incomplete in #135 | Four journeys walked as one product | none | bounded fixes only | manual + a11y |
| 16 | Japanese copy audit incl. "Postmortem" term | Partial. **UI already says 「じっくり振り返る」**, not "Postmortem" — verify no raw term is user-visible | Full audit of every OSF-1 string | none | audit + bounded fixes | user-visible-term assertion |
| 17 | a11y in CI | **Local only.** Blocker documented: no `postgrest` on the runner | Pinned PostgREST in CI, or a truthful single answer | Supply-chain decision | attempt CI; if flaky, keep local gate | must not be flaky |
| 18 | a11y scope | 7 routes × 2 viewports passing | Add postmortem path, pagination controls, disclosure, failure state, keyboard smoke | none | extend spec | 0 serious / 0 critical |
| 19 | Internal beta access E2E | **Absent.** Architecture ready since #135 | Founder sees it, normal user gets 404 with no nav leak | Needs two seeded identities | new spec | no client role, no param bypass |
| 20 | Kill switch | Architecture supports env-driven off; **never rehearsed** | ON → access; OFF → immediate loss | none | rehearsal + document redeploy need | live test |
| 21 | Gate 3 final rehearsal | Passing at 40 assertions on the current set | Rerun on the **final** migration set incl. §2/§3 | Must follow the new migration | extend + rerun | all D-checks |
| 22 | Observability | 7 events, redaction by type, wired at 4 sites | Add assistant/erasure/migration-readiness/moderation emitters | none | extend | redaction tests |
| 23 | Performance smoke | Never run | Seed ~450 rows; look for N+1 / unbounded responses | none | seed + measure | obvious pathologies only |
| 24 | `PHASE1_PRODUCT_TRUTH.md` | Absent | Per-capability IMPLEMENTED/VERIFIED/DEFERRED/NOT_AUTHORIZED | none | new doc | n/a |
| 25 | Internal beta runbook | Preconditions added to the existing runbook | Dedicated 10-step runbook with per-stage rollback | none | new doc | n/a |
| 26 | Founder test script | Absent | 20–30 minute human script, 15 scenarios | none | new doc | n/a |
| 27 | Risk register closure | Partly narrative | Every risk CLOSED / ACCEPTED_FOR_INTERNAL / FOUNDER_DECISION_REQUIRED / DEFERRED / BLOCKING | none | rewrite with explicit statuses | n/a |
| 28 | Adversarial review | Done for #135's diff | Nine lenses over the final diff | Must follow implementation | independent review + verification | verify each finding |
| 29 | Final battery | Green at #135 scope | Rerun everything incl. new suites | Must be last | execute | report real counts |

## Items that are already satisfied and must not be redone

Transactional audit (implemented and rollback-proven), the single access authority, UUID validation,
memory keyset pagination, assistant input bounds and output ceiling, the privacy disclosure timing and
parity, the Gate 3 rehearsal harness, and the observability core. This package **extends** them; it
does not rebuild them.
