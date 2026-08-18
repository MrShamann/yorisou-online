# OSF-1 — PR #135 governance-delta audit against the v0.7.0 active baseline

**2026-08-17** · PR [#135](https://github.com/MrShamann/yorisou-online/pull/135), head `6143d8d`, base
`main` `f6bb81f` · **delta audit only — no implementation was rebuilt**

---

## 0. THE LIMIT OF THIS AUDIT, STATED BEFORE ITS FINDINGS

**The v0.7.0 documents are not in this repository, and I have not read them.** They are installed at
the Founder's Project Resources layer, which this repository cannot see — that is the whole substance
of the correction in [OSF1_GOVERNANCE_PRECEDENCE.md](OSF1_GOVERNANCE_PRECEDENCE.md) §2.

So this audit is against **the requirement list Edward supplied in the correction instruction** (its
§3 A–G and §4 D-numbers), not against document text I verified. Every row below cites repository
evidence for the *implementation* claim, which is what tier 5 authority is for. What no row can do is
prove the requirement was quoted correctly — and a document claiming otherwise would repeat, in a
smaller way, the exact error being corrected here: treating what I could reach as the whole of what is
true.

**What that means for the verdict.** Where a row says the implementation satisfies a requirement, the
implementation fact is evidenced and the requirement is as-stated-by-the-Founder. If any v0.7.0
requirement is stricter than the summary Edward gave, this audit will not have caught it, and the
honest place to catch it is a Founder read of §1–§2 below rather than a further assertion from me.

## 1. A. Life Graph / Memory / Continuity

| Requirement (as stated) | Finding | Evidence |
|---|---|---|
| User-controlled continuity | **SATISFIED.** The Return loop is a bounded offer, never a queue: fixed priority, hard cap of three, deduped by record id, and it reads **no memory at all**. Named 「書きかけ」, not 「未完了」. | `lib/server/lifeOs/timeline.ts` `lifeReturnSelection`, `RETURN_MAX_ITEMS = 3`; acceptance harness |
| Current State ≠ permanent identity | **SATISFIED.** `yorisou_current_state_records` is append-only temporal rows with a `created_at`; there is no "profile" or "type" column, nothing overwrites a previous state, and the history surface says 「どれも、その時の記録です。」 The AI boundary refuses `permanent_identity` and `personality_definition` in model output. | `202608140001`; `app/life/StateHistory.tsx`; `aiBoundary.ts` RULES 2–3 |
| Selective Memory | **SATISFIED.** `check (user_confirmed = true)` — an unconfirmed memory cannot exist in the table. The route refuses anything that is not exactly `confirmed: true` (409). Candidates are quotes of what the person wrote, never inferences, and have no row until confirmed. | `202608140001:265`; `app/api/life/memories/route.ts:50`; `buildMemoryCandidates` |
| Correction / deletion controls | **SATISFIED.** View, correct (with re-confirmation), suppress, restore, revoke (terminal), delete (hard, with a content-free receipt). All six proven. | `yorisou_osf1_memory_update` / `_set_lifecycle` / `_delete` / `_receipts`; acceptance 156; audit-failure 55 |
| Reflection vs fact separation | **SATISFIED.** A reflection is the person's own words in its own table; the State↔Reflection link is optional, user-chosen, never automatic, and nulls on state deletion. The audit records *that* a link exists, never its content. | `current_state_record_id` nullable; 8 acceptance assertions |
| Personal Postmortem boundaries | **SATISFIED.** Seven questions that separate the decision from what followed; the organising instruction for the deep mode explicitly keeps them apart, because folding them together reads the outcome as a verdict on the choice. 「Postmortem」 never reaches a screen. | `ORGANISING_BY_MODE.postmortem`; reflection E2E asserts `toHaveCount(0)` |
| Timeline ≠ full Life Graph | **SATISFIED, structurally.** There is **no relationships table, no edge table, no graph table** in any migration — verified by search. The timeline is a merged chronological read over four existing sources; two optional foreign keys the person chose are not a graph. A test fails if a relationships table is created. | `grep "create table.*(relationship\|edge\|graph)"` → none; `osf1Boundaries.test.ts` |

## 2. B–G

### B. Privacy / consent

| Requirement | Finding | Evidence |
|---|---|---|
| Private by default | **SATISFIED.** Experience cards default PRIVATE; Life OS records have no sharing surface at all. `robots: index false` on the hub. | `payload()`; `app/life/page.tsx` |
| Explicit sharing | **SATISFIED.** Every widening is a ranked comparison requiring preview confirmation — including INVITE_ONLY → ANONYMOUS_SHARED, which a boolean check had previously let through. | `isVisibilityExpansion`; acceptance assertions |
| Approved processing systems | **SATISFIED.** All model calls route through the Provider Harness resolver; no direct provider call exists. Providers are OFF by default, so the ordinary outcome is `assistant_unavailable`. | `resolvePrivateReflectionProviders`; assistant suite 25 |
| Memory user control | **SATISFIED.** See §1. | |
| Experience visibility | **SATISFIED.** PRIVATE cards are undiscoverable; the moderation queue excludes deleted and withdrawn cards (a real defect found and fixed). | `moderationQueue()`; acceptance |
| No silent cross-project data pooling | **SATISFIED.** The test-product boundary is a hard rule and is enforced: Imairo data never crosses into Life OS memory, and the protected baseline proves 8 groups unchanged. No Kakari / Mirai Move / Asterion integration exists. | `osf1Boundaries.test.ts`; Imairo snapshot 8 groups |

### C. AI usage — Reflection Assistant

**SATISFIED, and the strongest-tested area in the package.** Bounded (input capped per field by the
contract; output refused-not-truncated at the column's own bound; two provider attempts inside one 25s
budget; `maxDuration = 30` so the platform cannot cut the designed refusal short). User-controlled
(offered on one screen, only after something is written, only when pressed; 「使わない」 declines;
applying is explicit and appends). No diagnosis (`inspectAiOutput` discards the **whole** draft on any
boundary violation and does not retry against another provider). No factual invention (the prompt
forbids adding facts; the boundary scans output, never the person's own words). No automatic publish,
no automatic Memory, no autonomous follow-up — the draft exists in one HTTP response and nowhere else.

**One finding worth recording rather than smoothing:** an adversarial review demonstrated that a
multi-line answer could forge a second instruction block in the prompt, so the earlier claim of "no
instruction channel" was structurally false. Fixed (each answer is serialized onto one line, verbatim)
and pinned by a regression test that asserts by lines rather than substrings. Impact had been
self-directed — the prompt carries no other person's data, no tools and no retrieval.

Evidence: `lib/server/__tests__/osf1AssistantProvider.test.ts` (25), `osf1AiBoundary.test.ts` (10).

### D. Product / UX

**SATISFIED.** Calm Japanese consumer UX — 247 strings audited from source, zero SaaS / productivity /
mystical / clinical-claim / absolute-claim violations, zero unnecessary English, and 「あなたは〜です」
appears nowhere. Private value without social participation: every Life OS surface is useful with no
sharing whatsoever. No infinite feed (Return caps at three; the timeline paginates by an explicit
link). No productivity pressure (no streak, no percentage, no deadline; 「達成するためのものではありません。」
is the sentence that holds Direction in place). State, not fixed identity (§1). Reversible
participation (suppress/restore, and revoke leaves the text while stopping use).

Evidence: [PHASE1_JAPANESE_COPY_AUDIT.md](PHASE1_JAPANESE_COPY_AUDIT.md),
[PHASE1_UX_COHERENCE_REVIEW.md](PHASE1_UX_COHERENCE_REVIEW.md), axe 32/32, keyboard 12/12.

### E. Technical architecture

**SATISFIED.** Shared primitives are reused, not duplicated: identity is the existing
`getViewerContext()` (**no second identity system** — the Life OS has no user table), persistence is
the existing PostgREST service-role client, and every mutation goes through a `SECURITY DEFINER` RPC
under the established `DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION`
rule. **No duplicate Memory system** — one table, one write path. **No shadow data copies** — the
timeline and Return read the source tables and store nothing. Audit and observability present (16
audit actions in two delivery classes; 7 ops events, each now with a real producer). Modularity
preserved: six new tables, all `yorisou_*`-prefixed, all behind one activation resolver.

Evidence: [OSF1_AUDIT_DELIVERY_CLASSES.md](OSF1_AUDIT_DELIVERY_CLASSES.md) v2.1, Gate 3 (42),
acceptance (156), `osf1Observability.test.ts` (9).

### F. Agent boundary

**CONFIRMED.** The Reflection Assistant is capability code and **activates nothing**. It has no
scheduler, no queue, no background process, no tool definitions in its request body, no memory of
prior calls, and reads no stored record. Companion Core, Platform Orchestrator, Specialist Agents and
any autonomous runtime remain **NOT_AUTHORIZED and untouched** by this PR.

Evidence: "the assistant is request-scoped: no state survives a call" and "the request body carries no
tools, no functions, and no tool choice" — `osf1AssistantProvider.test.ts`.

### G. Legacy

**CONFIRMED.** Nothing in PR #135 activates Digital Legacy, synthetic identity, or deceased-person
representation. No such table, route, surface or capability is created.

**One word-collision to name so nobody mis-reads a grep:** the diff contains `viewer.legacyAccount`.
That is the **pre-existing authentication** concept — an older account cookie shape carried by
`getViewerContext()` — and has nothing to do with Digital Legacy. It is read-only and predates this
package.

## 3. Open Founder decisions cross-check

`02_YORISOU_OPEN_FOUNDER_DECISIONS_2026-08-14.md` is not in this repository, so this checks the four
decisions Edward named, against the same evidence standard as §0.

| | Decision | Does PR #135 resolve it? | Why |
|---|---|---|---|
| **D-01** | Module activation sequence | **NO** | The PR **enables nothing**. Production Life OS is OFF (every `/life` route 404s, verified live), PREVIEW is not enabled, and INTERNAL needs four independent preconditions of which one is a pilot flag only Edward sets. Sequencing remains entirely a Founder act. |
| **D-02** | Life Graph initial persistence scope | **NO — and the decision point is preserved deliberately** | Six tables exist **as code**; the migrations are **NOT APPLIED** anywhere. Nothing is persisted. **The apply IS the D-02 decision moment**, which is why the status is `READY_FOR_FOUNDER_AUTHORIZED_APPLY` and not "ready". Separately, no relationships/edge/graph table exists in any migration, so this cannot constitute a Life Graph scope even once applied. |
| **D-03** | Auto-memory threshold | **NO — and this is the one to check hardest** | PR #135 implements **no threshold at all**, which is the only way not to pre-empt the decision. `check (user_confirmed = true)` makes an unconfirmed memory impossible at the schema level; the route refuses anything that is not exactly `confirmed: true`; candidates are quotes of the person's own sentences with no row behind them, discarded if the tab closes. **Explicit-confirmation behaviour does not establish an auto-memory policy** — it establishes that there is none, and any future threshold would have to be added against a schema constraint that currently forbids it. |
| **D-09** | Local / cloud synchronization | **NO** | No sync engine, no offline store, no replica and no local-first path is created or touched — verified by filename search over the whole diff. The Life OS writes to one database through the existing client. (The macOS wrapper work is PR #127, out of scope and untouched.) |

**Nothing in PR #135 crosses an open Founder decision.** The strongest of these is D-02, and the reason
it stays uncrossed is a state rather than an intention: the migrations are not applied, so no
persistence scope has been established.

## 4. Was a code change required?

**No.** The v0.7.0 delta audit found **no compliance defect** requiring a code change.

Stated precisely, because "no changes needed" is the kind of conclusion that deserves suspicion: the
audit ran against the implementation as of `6143d8d`, after the four adversarial reviewers of §26 had
already forced eight code corrections in this same package. The defects that existed were found by that
pass, not by this one. This audit is a **governance-truth correction**, and its findings are documentary.

The only changes in this correction are: six documents' governance records, this audit, a product-truth
restatement, and one new guard test.

## 5. Divergences that remain, restated against the correct authority

| | Status |
|---|---|
| Audit retention (`RETENTION_POLICY_TBD`, no expiry) | `FOUNDER_DECISION_REQUIRED` — brief prepared, nothing invented, no purge job exists |
| `yorisou_identity_provisioning_sagas` survives erasure | `FOUNDER_DECISION_REQUIRED` — POR-1 owns the fix; pseudonymize recommended |
| PRIVATE-flagged content may reach moderation | `FOUNDER_DECISION_REQUIRED` — policy unchanged; the disclosure now names the trigger before typing, and the queue emits a countable anomaly signal |
| `memoryLifecycleService` / `permissionCheckService` named in governance, absent by name | Naming divergence; substance implemented. Recorded, not hidden |
| `ExperienceForm` destroys a sharing draft when another card's preview opens | `FOUNDER_DECISION_REQUIRED` — pre-existing data loss; wants a per-card draft map, not a bounded patch |

---

## Version history

- **v1.0 (2026-08-17)** — first audit of PR #135 against the v0.7.0 active baseline, following the
  governance-truth correction. Evidence limit stated in §0: the v0.7.0 documents are not in this
  repository and were not read.
