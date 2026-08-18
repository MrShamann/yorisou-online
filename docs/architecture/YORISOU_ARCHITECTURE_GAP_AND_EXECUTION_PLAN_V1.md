# YORISOU Architecture Gap Audit and Execution Plan v1.0

**Status:** CANONICAL · **Version:** 1.0 · **Date:** 2026-08-18
**Parent:** [YORISOU_REFERENCE_ARCHITECTURE_V1.md](YORISOU_REFERENCE_ARCHITECTURE_V1.md)
**Audit basis:** direct repository inspection + live production probes performed 2026-08-18, at the
checkpoint below. Statements about the repository in this document are evidence-backed as of that
checkpoint; nothing here is a completion claim about future work.

---

## 1. Verified checkpoint

| Fact | Value | How verified |
|---|---|---|
| Canonical repository | `/Users/yangjin/Projects/yorisou-online` → symlink → `/Volumes/AI-Work/Projects/yorisou-online` | `ls -ld` + `git rev-parse --show-toplevel`; single repo, no duplicate |
| `main` / `origin/main` | `5245b10` | `git rev-parse` after fetch |
| This package's branch | `architecture/yorisou-reference-v1`, created from `origin/main` @ `5245b10` | `git branch --show-current` |
| PR #136 | OPEN (hosted-activation documentation), **deliberately NOT included** in this branch | branch created from `origin/main`, not from the #136 branch |
| PR #127 | permanently out of scope; untouched | — |
| Production | `https://yorisou.online`, deployed release marker `release:5245b105c71d` = `main` | live `data-release` probe |
| Hosted runtime state | OSF-1 migration APPLIED (29 rows in `schema_migrations`); Life OS **INTERNAL** (Founder/Admin only); PREVIEW disabled; PUBLIC unreachable | this session's activation package (recorded in PR #136); re-probed: `/life` 404 anonymous |
| Stale-doc caution | `PROJECT_START_HERE.md` says "project PAUSED" and cites `334a8057`; on this branch `docs/yorisou/osf1/OSF1_DEPLOYMENT_ORDER.md` still says "No migration applied in any environment" (its correction lives in PR #136) | registry says ACTIVE; runtime evidence above wins over both, per package rule |

### Live product check (2026-08-18T04:20Z, unauthenticated)

| Route | Result |
|---|---|
| `/` | 200 |
| `/me` | 200 |
| `/today/check-in` | 200 |
| `/experiences` | 200 |
| `/tests/ima-iro` | 200 |
| `/explore` | 200 |
| `/notice` | 200 |
| `/tests` | 200 |
| `/check-in` | 307 → `/tests/ima-iro` (legacy redirect, preserved) |
| `/connect` | **404 — Connect Hub does not exist** |
| `/life` | 404 anonymous (correct INTERNAL concealment) |

**Visual state (mobile 375×812, in-app browser, 2026-08-18):** `/` is a calm single-CTA surface
(「今の気配を見る」), explicitly 「診断ではありません」, bottom navigation of **four** items
(今日・気づく・探す・わたし — つながる absent). `/today/check-in` is a two-step tap-only state
capture (「1 / 2 いま、どんな感じですか。」). Home is already not a dashboard. Visual status:
VERIFIED for these two surfaces; all other surfaces HTTP-verified only.

## 2. Current implementation map (evidence → capability)

| Capability | Repo evidence (inspected) | Status |
|---|---|---|
| Kernel: identity | `lib/server/yorisouAuth.ts` (two AES-256-GCM cookies, `getViewerContext()`), `owner_account_id` on every personal table | strong seed |
| Kernel: permissions/gating | `lib/cpv1/deploymentContext.ts`, dev flags, `lib/cpv1/productionPilot.ts` (exact-token pilot flags), `lib/server/lifeOs/routeAccess.ts` (env-before-session composition), `viewerHasAdminAccess` | strong seed, proven live (INTERNAL activation + kill switch) |
| Kernel: audit | `yorisou_life_os_audit_events` (fingerprint actor, immutability triggers, transactional/async delivery classes, `lib/server/lifeOs/audit.ts`), `yorisou_account_deletion_audit` | strong seed (Life-OS-scoped; not yet product-wide) |
| Kernel: data lifecycle | declarative erasure plan `yorisou_account_deletion_erase_database_unchecked` + `test:osf1-erasure-coverage`; deletion lifecycle (jobs, manifests, leases, fence) | strong seed |
| Kernel: events runtime | **absent** — no typed envelope, no bus | gap |
| Kernel: module registry | **absent** (added as scaffolding in this package: `lib/platform/`) | gap → scaffolded |
| `state.core` | DCI-1 `yorisou_daily_state_records` (+versions, +history events, `dailyCheckInStore.ts`) **and** OSF-1 `yorisou_current_state_records` (`lib/server/lifeOs/store.ts`) — **two state stores** | partial, duplicated |
| `assessment.core` | **three runtimes**: Imairo 120q generated runtime (`data/yorisou/120q-*.generated.json`, `lib/yorisou/dte`, `lib/yorisou/method-runtime`) · rule-based engine `lib/yorisou-tests/engine.ts` (+catalog/scoring/types; **0 Imairo references — already brand-free**) · generated method runtimes `lib/yorisou/methods/{daily-check-in,yorisou-values}` | partial, fragmented |
| `discovery.core` | nothing (今日のひとつ absent; `discoveryInventory.ts` under recommendations is resource discovery, not Daily Discovery) | missing |
| `experience.core` | experience cards full lifecycle: `lib/server/experienceCards.ts`, visibility/moderation/reports/revisions/invites/consents/interactions tables; OSF-1 experience linkage | partial (entangled with community half) |
| `reflection.core` | OSF-1 reflections (7-question + felt/tried/options/mode), `reflectionAssistant.ts` (provider routing, timeouts, injection defense, draft-only) | partial, close to contract |
| `continuity.core` | `lib/server/lifeOs/timeline.ts` merges sources **by direct store reads** (documented as deliberate); keyset pagination; per-domain history-event tables | partial, no projections |
| `comparison.core` | nothing | missing |
| `sharing.core` | Imairo public-result snapshot (`202607160001_imairo_public_result_snapshot`, `lib/yorisou/public-result/` with taxonomy/mapping/snapshot), `app/result/share`, share-card docs (2026-04) | partial — the PRIVATE→SAFE-DERIVATIVE flow already exists for one family |
| `connection.core` | experience-scoped invites only (`app/experiences/invite`) | missing (as a person-to-person capability) |
| `community.core` | `/experiences` shared cards: visibility, audience rules, moderation events, reports — a structured, moderated, finite community seed | partial |
| `matching.core` | nothing | missing (V2 by design) |
| `recommendation.core` | recommendation graph (`recommendationGraph.ts`; sets/items/actions/events/returns/reports), `lib/yorisou/recommendations/` (governed, recommendationObject, feedback), `yorisou_private_recommendations`, resources + sources; bounded returns (`RETURN_MAX_ITEMS`) | partial, rule-based (matches recommendation-lite) |

**Existing enforcement precedent worth naming:** `lib/server/__tests__/osf1Boundaries.test.ts`
already enforces, as tests over data and imports: the assessment↔state boundary is stated as data;
`no_auto_convert / no_overwrite / no_replace`; no Life OS module imports assessment stores; the
state table holds no methodology-identity column. **This is the module-contract enforcement pattern,
already alive in CI.** The platform guard tests added in this package generalize it.

## 3. Architecture gaps (numbered; referenced from the contracts doc)

1. **Two state stores** (`state.core`): DCI daily-state and OSF-1 current-state capture overlapping
   truth with different contracts. Neither is wrong; the duplication is the gap. Consolidate behind
   one contract by adapter — no row rewrites.
2. **Three assessment runtimes** (`assessment.core`): the rule-based engine is already brand-free
   and closest to the contract; Imairo's generated runtime is protected and must be *wrapped, never
   modified*; the method runtimes are generated and can be re-targeted at the contract gradually.
3. **Navigation**: つながる (5th item) absent; `/connect` 404. Product gap, arrives with
   connection.core-lite — not a refactor of the existing four.
4. **Experience/community entanglement**: one store serves both the private experience record and
   the shared community surface. The contract split (experience.core owns the record;
   community.core owns visibility/moderation) is documentation now, code in V1.5.
5. **Reflection**: closest to its contract; the gap is formalizing the interface and the
   candidate objects (PossibleMemoryCandidate ≠ ConfirmedMemory), not behavior.
6. **Timeline reads sources directly** (`continuity.core`): no projections, so source deletion
   correctness depends on read-time filtering rather than invalidation. Projection tables are the
   V1-era fix (execution plan P6).
7. **No typed event layer**: per-domain `*_events` DB tables (experience, recommendation, values,
   daily-state-history) are written inline with heterogeneous shapes. They are good audit/history
   rows; they are not a contract. The canonical names now exist in `lib/platform/events.ts`;
   adoption is incremental (P1/P2).
8. **Sharing generalization**: the Imairo snapshot flow is the proof that the allowlist-derivative
   pattern works; it is single-family and Imairo-specific. Generalize to ShareObject (P4).
9. **Brand coupling inside generic server modules**: `lib/server/testResults.ts`,
   `assessmentMethodContract.ts`, `miniAppEntryRouting.ts` hardcode Imairo knowledge. Acceptable in
   the product application tier; the boundary work is extracting the *capability* parts, not
   de-branding these files in place.
10. **Route sprawl vs the 5-nav model**: `app/` carries many legacy/marketing/prototype routes
    (dashboard, reports, prototype, formal-check, online-check-in, ai-advisor, business, company,
    partners, products, vision, concept, …). Out of scope to prune here; the reference architecture
    gives the target IA for a future cleanup package.
11. **Stale canonical docs**: `PROJECT_START_HERE.md` predates the refoundation ("PAUSED",
    `334a8057`); the OSF-1 deployment-order doc's correction is in PR #136. Both need a
    post-refoundation refresh — **deliberately not edited in this package** (PR #136 must not be
    silently included; START_HERE refresh deserves its own reviewed change).
12. **DB namespace** `yorisou_*` everywhere: correct for the modular monolith; at extraction time
    the portability gate (data isolation) forces a namespace strategy. Documented, not actioned.

## 4. What is preserved on purpose (do not "modernize" these)

- **RPC-only mutation discipline** (`DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE +
  RPC_ONLY_DATABASE_MUTATION`), SECURITY DEFINER RPCs, zero broad EXECUTE — verified live in
  Production this week.
- **The gate stack** (deployment context → flags → viewer facts) and the four-state activation
  model with its proven kill switch.
- **The declarative erasure plan + coverage test**; append-only erasure contract; mutation fence.
- **The audit-event pattern** (fingerprint actors, immutability triggers, transactional vs
  asynchronous delivery classes).
- **The protected Imairo runtime** (120q generated JSON, contract-tested) — wrapped by
  assessment.core, never modified.
- **Keyset pagination, bounded returns, calm-UX copy discipline** (`診断ではありません`).
- **The boundary-test pattern** (`osf1Boundaries.test.ts`) — generalized, not replaced.
- **Working consumer surfaces**: nothing in this package or plan rewrites a working route to match
  a naming convention.

## 5. Minimal scaffolding implemented in THIS package (non-user-visible)

| Artifact | What it is | Why it is safe |
|---|---|---|
| `lib/platform/moduleContract.ts` | the Module Contract schema as types (snake_case keys mirror the contracts doc §1 exactly) | types only; imported by nothing in `app/` |
| `lib/platform/events.ts` | `DomainEventName` template type, the canonical V1 event-name list, a minimal envelope type | names + types only; no bus, no runtime behavior |
| `lib/platform/registry.ts` | the 12 capability declarations (id, contract version, honest status, purpose) + lookup | data + lookup only |
| `lib/platform/__tests__/platformContracts.test.ts` | guards: 12 ids exact, event-name grammar, no duplicate names, no universal event, **brand isolation** (no Yorisou/Imairo strings in platform sources), **no import inversion** (platform imports nothing from `app/`, `lib/server/`, `lib/yorisou*`, `lib/life-os`) | test-only |
| `package.json` script `test:platform-contracts` | runs the guard | additive script |

Explicitly **not** implemented (documented only, per package rules): route rewrites, table
migrations, auth changes, community, matching, Imairo changes, new data collection, recommendation
rewrites, payments, LINE changes, deployment, CI wiring of the new test (left to the next package so
this one stays zero-risk).

## 6. V1 implementation packages (recommended dependency order)

Each package is bounded, independently shippable, and ends behind existing gates.

| # | Package | Depends on | Consumer impact | Modules | Non-goals |
|---|---|---|---|---|---|
| **P1** | Platform contract adoption: wire `test:platform-contracts` into CI; emit the first typed events at ONE seam (check-in completion) without changing behavior | this PR | none | Kernel(events), state.core | no bus infrastructure beyond in-process |
| **P2** | `state.core` consolidation: one contract over DCI daily-state + OSF-1 current-state (adapter, no row rewrites); Today reads through it | P1 | none visible (Today groundwork) | state.core | no schema convergence yet |
| **P3** | `discovery.core` + first pack (`yorisou.daily-3q` or `yorisou.daily-symbols`): 今日のひとつ on Today, gated | P1 (P2 preferred) | **new**: Today gains its curiosity half | discovery.core, sharing-lite | no community loop yet; no symbolic memory writes |
| **P4** | `sharing.core` formalization: generalize the Imairo snapshot into ShareObject + preview + deep link; Imairo Result Card first | P1 | share flow becomes uniform; existing share keeps working | sharing.core | no new share families beyond Imairo card |
| **P5** | `connection.core`-lite + `comparison.core`-lite + Imairo pair adapter: invite → accept → ふたりのImairo; つながる nav appears (gated) | P4 | **new**: pair comparison, 5th nav item | connection.core, comparison.core | no community, no DM, no matching |
| **P6** | `continuity.core` projections: TimelineProjection + delete-propagation invalidation; timeline switches reads | P1 | none visible (same timeline, honest deletes) | continuity.core | no pattern detection yet |
| **P7** | Me composition + Data & Memory alignment on module reads | P2, P6 | subtle: わたし becomes the five-part composition | Kernel(memory), continuity, state, assessment | no new profile storage |

V1.5 packages (community.core absorbing the shared-experience surface; weekly reflection; patterns)
and V2 packages (matching.core; portability proof) follow the staged scope in the reference
architecture §15 and are not planned in detail here.

## 7. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Contract layer drifts into ceremony (types nobody uses) | medium | medium | P1 wires the guard test into CI and adopts events at a real seam immediately; each later package must consume, not just declare |
| Two-state-store consolidation breaks a live check-in path | low | high | adapter-only in P2 (no row rewrites, no schema change); existing DCI + OSF-1 test suites stay green as the gate |
| Imairo protection eroded by assessment.core work | low | critical | wrap-never-modify rule; the 120q contract tests + protected-asset checks remain the hard gate; any instrument change requires separate Founder authorization |
| Daily Discovery content drifts into copied/derivative symbolic systems | medium | high | originality rule is in both canon docs; pack review checklist before any pattern ships; no fate/diagnosis claims, `memory_write=false` default |
| Share derivative leaks private fields | low | critical | allowlist-built derivatives only (never redaction); share-shell preview mandatory; audit on share create/revoke; tests per family |
| Connect features create social pressure the product's register forbids | medium | high | V1 exclusions are binding (no DM, no rankings, no feeds); pair-language rules in the pack; same-result groups worded as 「近い結果だった人」 |
| Event taxonomy churns | medium | low | single canonical list in one file; renames are one-file diffs guarded by tests |
| One-person-company overload | high | medium | packages are small and independently shippable; documentation-first where refactor cost is high (explicit package rule) |

## 8. Validation requirements (standing)

- `test:platform-contracts` green (brand isolation, inversion, event grammar) — from this package on.
- Existing gates stay authoritative: typecheck, lint, per-domain suites, Gate-3 migration
  rehearsal, erasure coverage, boundary tests, authenticated a11y in CI.
- Every implementation package: adds boundary tests in the `osf1Boundaries` pattern for its module;
  adds its data families to the erasure plan + coverage test in the same change; ships behind the
  existing gate stack; and runs the portability gate before any extraction (V2).

## 9. Assumptions recorded (smallest safe; per package instruction)

1. **A1 — location**: no prior `docs/architecture/`; created it for the three canonical files.
2. **A2 — scaffolding home**: `lib/platform/` with snake_case contract keys mirroring the doc
   schema exactly (doc↔code correspondence over local naming style).
3. **A3 — statuses are declarations**: registry `status` values are honest boundary declarations,
   never implementation claims (completion truth model).
4. **A4 — branch base**: created from `origin/main` @ `5245b10`; PR #136 not included; its file
   corrections therefore appear "stale" on this branch and are left alone.
5. **A5 — runtime truth**: hosted INTERNAL state is cited from this week's activation evidence and
   re-probed routes, not from any unmerged doc.
6. **A6 — event taxonomy**: adopted verbatim from the Founder package; refinements only ever edit
   the single canonical list.
7. **A7 — CI wiring deferred**: the new guard test is runnable (`npm run test:platform-contracts`)
   but not yet added to CI workflows, keeping this package's blast radius zero; P1 wires it.

## 10. Explicit NON-GOALS of this package (verbatim boundaries honored)

No 20-screen implementation · no broad product redesign · no production deploy · no merge · no route
rewrites · no table migrations · no auth changes · no community/matching implementation · no Imairo
scoring/question/result changes · no new user data collection · no recommendation-logic replacement
· no payments · no LINE behavior changes · no D-03/D-09 resolution · no edits to PR #127 or PR #136
content · no edits to the active v0.7.0 Project Resources.

*Version history: v1.0 (2026-08-18) — initial audit at `5245b10`, authorized by
`YORISOU-REFERENCE-ARCHITECTURE-V1-FOUNDATION`.*
