# OSF-1 Phase 1 — Internal Beta Readiness Gap Matrix

**Produced:** 2026-08-15, before any code change, per §0.5 of the Internal Beta Readiness package.
**Base:** `main` @ `f6bb81f` · **Branch:** `feat/osf1-internal-beta-readiness`
**Method:** every row derives from reading the merged implementation, not from earlier reports.

---

## 0. Preflight findings that change the package's premises

**Governance version.** The package names "YORISOU v0.7.0 governance". No such pack exists. The
effective corpus is **Governance Pack v0.4.1** (`resources/governance/current/RESOURCE_MANIFEST.md`),
containing Project Constitution **v0.4.0** and Technical Architecture **v0.4.0**. The only `v0.7.0`
strings in the repository are in OSF-1 *product* docs, where it is the name of the product package,
not of a governance pack. This work follows the real corpus. Third time this mismatch has surfaced;
worth correcting in the package template.

**Two binding rules bear directly on this package and were not named in it:**

- *Data & Privacy v1.0 §3.4* — "Test-product data keeps its existing consent basis and NEVER crosses
  into companion memory (hard rule, restated)." The Imairo/assessment boundary is therefore a
  **governance hard rule**, not merely a design preference. It needs an explicit regression test.
- *Release & Acceptance Gates v1.0 §3.4* — "Kill switches must be live-tested at every Production
  Release Gate before exposure." Internal activation must therefore include a live kill-switch test
  in the runbook, not just a flag flip.

**Memory governance divergence, pre-existing.** *Personal Archive & Memory Governance v1.0 §3.1*
names `memoryLifecycleService` as the sole write path and `permissionCheckService` as the sole read
gate. Neither exists. The implementation achieves the *substance* (single write path through a
`SECURITY DEFINER` RPC, owner-scoped reads) under different names. §3.2 additionally requires that
users can "view, correct, suppress, revoke, delete — each with visible confirmation and (for
deletion) a **receipt**". View/correct/delete exist; **suppress, revoke and the deletion receipt do
not.** This is a real governance gap, pre-existing, and larger than this package's brief.

**Environment.** No hosted staging is reachable from here and Docker is not running, so §2B's
sanctioned fallback applies: disposable PostgreSQL + PostgREST 16.1, both present locally.
Production is never used for rehearsal.

---

## 1. Gap matrix

Status key: **OK** = already satisfied, no change · **GAP** = required work · **DECISION** = needs
Edward · **RISK-ONLY** = documented, not fixed in this package.

| § | Requirement | Current implementation | Status | Required change | Risk if unfixed | Test |
|---|---|---|---|---|---|---|
| 2 | Migration lineage audited as one lineage, rehearsed with rollback + re-apply | 5 OSF-1 migrations on main, applied cleanly in the disposable harness. No rollback rehearsal has ever been run. `202608160001` documents a rollback procedure but it is untested. | **GAP** | Rehearse baseline→all→rollback→re-apply; verify overloads, grants, RLS, erasure, old `/experiences`; write `OSF1_GATE3_MIGRATION_READINESS.md` with real evidence | A rollback that has never run is a hope, not a procedure; Gate 3 cannot pass on an untested reverse path | New rehearsal harness |
| 3 | Transactional audit for memory create/delete, reflection + postmortem persistence | Implemented in `202608160001`: audit insert inside the RPC for `reflection.created`, `memory.confirmed`, `memory.deleted`, `memory.updated`. `auditLifeOs()` throws if handed a transactional action, preventing double-write. | **OK (verify)** | Prove rollback by forcing the audit insert to fail; confirm no domain row survives. Postmortem is the same RPC as light, so it is covered by construction — assert it explicitly. | A transactional claim that was never negatively tested | Forced-failure rollback test |
| 3 | Audit not editable through app paths; deletion does not cascade audit away | Append-only enforced by trigger (`202608150001`); no FK from audit to its subject | **OK** | none | — | Existing harness |
| 3 | `RETENTION_POLICY_TBD` preserved | Present in migration header and table comment; no expiry column, no purge | **OK** | none — and explicitly do not invent one | Privacy v1.0 §3.2 requires *enforced* expiry, so this remains a live divergence pending Edward | Existing assertion |
| 4 | Private-experience disclosure accurate and shown **before** typing | Needs reverification from code; the standing copy is `LIFE_OS_PRIVACY`. Parity between `/life/experience` and `/experiences` unverified. | **GAP** | Determine real trust-flag behaviour from code; ensure disclosure precedes input on every creation surface; parity across both | Telling someone "only you can see this" when operators may inspect flagged content is the most damaging kind of inaccuracy | Copy + parity test |
| 4 | Moderation queue excludes deleted/withdrawn/ineligible | Unverified | **GAP** | Audit the queue query | Operators reviewing withdrawn content | Query test |
| 5 | Goal ≠ task manager; prohibited vocabulary cannot creep in | Vocabulary has no `failed`/`overdue`; no deadline, streak or progress field. Enforced only by a comment in `store.ts`. | **GAP** | Add a contract test rejecting `failed`/`overdue`/`missed`/`late` and pressure-semantics fields | A future field reintroduces productivity pressure silently | Contract test |
| 6 | CurrentState ≠ Imairo result; history; state↔reflection link; provenance | Boundary documented in `lib/life-os/boundaries.ts`; `StateHistory.tsx` renders history. **No state↔reflection link exists** (`yorisou_life_reflections` has only `experience_id`). | **GAP** | Regression tests for the boundary incl. the privacy §3.4 hard rule. The state↔reflection link needs a column — assess whether it is required for internal beta or deferred. | Boundary erosion is silent and unrecoverable | Boundary regression |
| 7 | Both modes; postmortem 7 questions; mode persisted end-to-end | Mode column added by `202608160001`; parser carries it; contract has the exact 7 | **OK (verify)** | End-to-end regression: browser → parser → store → database → audit event | The previous mode bug was exactly this class and survived every existing test | E2E mode test |
| 8 | Assistant: schema validation, input/output bounds, no stored-record access, draft-only | `parseAssistantInput` bounds the body to known fields at 2000 chars. **Output length is not bounded.** Reads nothing stored; writes nothing. | **GAP** | Bound output length; add allowed-modes; adversarial tests (injection, diagnosis, memory-write, oversized, malformed, unsupported mode) | An unbounded provider response reaches a surface | Adversarial suite |
| 9 | Memory pagination replacing the unreachable 50-item cap | `listMemories(limit = 50)`, route passes no cursor. Memories beyond 50 are **unreachable**. | **GAP** | Cursor pagination with deterministic ordering and a stable cursor; not a bigger magic number | Data a person saved becomes invisible to them — and Memory governance §4 prohibits bulk reads, so raising the cap is the wrong direction | Pagination suite |
| 10 | Timeline is a view, not a graph | Five sources, chronological, stores nothing; a test forbids relationship/edge/graph/link tables | **OK** | Pagination if the cap proves reachable | — | Existing |
| 11 | Return loop: bounded continuity, no streaks | `lifeReturnView()` mode-aware after the completion package | **OK (verify)** | Test selection logic and empty states | — | Selection test |
| 12 | API: server-authoritative identity, no body `user_id`, owner scope, no existence oracle, gates before effects | `requireLifeViewer` enforces gate→mutation→session order; owner comes only from the cookie. **No UUID validation anywhere** — a non-UUID id reaches PostgREST, returns 400, and `lifeApiError` maps it to **500**. | **GAP** | Validate ids at the edge; return the house-convention status; apply consistently | 500s are an availability and information-leak smell, and the package names this explicitly | Malformed-id suite |
| 12 | PostgREST filter interpolation safe | Ids are interpolated into `eq.` filters via `URLSearchParams` (encoded), but unvalidated | **GAP** | Validate before interpolation | Low — encoding holds — but unvalidated input reaching a query builder is the wrong default | Interpolation test |
| 13 | Erasure guard re-run; `yorisou_identity_provisioning_sagas` resolved or classified | Guard passes 5/5 but carries the table as a literal `"UNRESOLVED"` exemption. It holds `account_id text` — a **direct, durable account link** — and is in **no erasure path**. | **DECISION** | Produce technical evidence and a Founder Decision. Do **not** silently change POR-1's erasure semantics from an OSF-1 package. | Personal data survives account deletion. This is a real privacy defect, not a bookkeeping one. | Guard + evidence |
| 14 | One authoritative access function for pages, API, mutation, navigation; OFF/INTERNAL/PREVIEW/PUBLIC | `lifeOsAccess()` is used by 7 pages, the API guard and navigation — genuinely single. **But it never consults INTERNAL**: production returns `denied_production` unconditionally, so INTERNAL behaves exactly like OFF. | **GAP** | Introduce a server-side resolver that composes the env state with server-resolved viewer facts, following the existing `pilotRouteAccess.ts` precedent, and route every surface through it | The four-state model is declared but only two states function; internal beta is unreachable | State-machine tests |
| 14 | PUBLIC unreachable | Nothing returns PUBLIC; reaching it is a Gate 5 act | **OK** | none | — | Existing |
| 15 | Internal allowlist, server-verified, no client role claim, no nav leak | `lifeOsInternalAccess()` exists with **zero call sites**. `isFounderAdmin` is resolved nowhere for the Life OS. | **GAP** | Wire it via `viewerHasAdminAccess()` over the validated session — the same mechanism `pilotRouteAccess.ts` uses. No hardcoded accounts, no secrets. | Internal beta cannot be granted to anyone | Denial + nav-leak tests |
| 16 | Authenticated a11y in CI | `test:osf1-a11y-authenticated` runs locally; **not in any workflow** | **GAP** | Wire into CI on disposable PG + PostgREST + production build, or document the exact blocker and keep a mandatory local gate | A green scan against a sign-in wall is worse than no scan | CI job |
| 17 | Observability for audit failure, mutation failure, gate denial, schema-not-ready, provider failure, erasure failure, moderation anomaly | None. No structured event emission at all. | **GAP** | Minimal structured emitter: event type, correlation id, safe object id, error class, environment, release. Never content or secrets. | An internal beta with no way to see failures | Redaction test |
| 18/19 | UX coherence and Japanese copy quality | Six surfaces built independently across three packages | **GAP** | Review as one path; bounded refinements only | Reads as assembled parts | Manual + a11y |
| 20 | Full test matrix A–H executed | Suites exist for most areas; several claims above are untested | **GAP** | Execute and report only what actually ran | Reporting PASS for something not run is the worst failure available here | — |

---

## 2. Ordering forced by dependencies

1. **Gate 3 rehearsal** first — everything else assumes the lineage applies and reverses.
2. **Access architecture (§14/§15)** next — it changes the signature every page and route calls, so
   later UI work should land on top of it, not be rewritten by it.
3. **API hardening (§12)** and **assistant bounds (§8)** — independent, no schema dependency.
4. **Memory pagination (§9)** — API and UI together.
5. **Observability (§17)** — cross-cutting, lands after the paths it observes are stable.
6. **Tests, UX/copy review, docs, adversarial review** last.

## 3. Explicitly not duplicating

Timeline, return loop, both reflection modes, memory edit, experience PATCH semantics, visibility
expansion confirmation, the transactional audit mechanism and the four-state enum all already exist.
This package verifies and wires them; it does not rebuild them.
