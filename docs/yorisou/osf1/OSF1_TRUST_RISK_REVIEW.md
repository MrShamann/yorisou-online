# OSF-1 — Trust-Risk Review and Non-Blocking Risk Register

**Package:** OSF-1 YORISOU OS Foundation v0.7.0 Phase 1 Life OS Foundation MVP · **PR:** [#132](https://github.com/MrShamann/yorisou-online/pull/132) @ `9705179` · **Status:** `OPEN_UNMERGED`. No migration applied in any environment.

> Every item below is **non-blocking for merge** and was found by the pre-merge governance audit or
> the hardening pass. None is a data-loss, authorization or privacy defect in the merged diff; the
> two that were (a crash regression in `/api/experiences?mode=discover`, and a PATCH that nulled
> unmentioned fields) were fixed and are not listed here. This document exists so that "known and
> accepted" is written down rather than remembered.

Severity scale: **low / medium / high** — the impact if the risk is realised, not the likelihood.

---

## 1. Risk table

| # | Risk | Severity | Present state | Mitigation / decision | Stop condition |
|---|---|---|---|---|---|
| 1 | **`yorisou_identity_provisioning_sagas` is in no erasure path.** It carries `account_id` and is named in neither POR-1's `v_plan` nor any erasure stage this repository defines. A deleted account may leave provisioning-saga rows behind. | Medium | **Pre-existing** (POR-1 `202608010103`), untouched by OSF-1. Previously invisible to tooling: the erasure-coverage guard's `OWNER_COLUMNS` omitted `account_id`. | `account_id` and `user_id` added to `OWNER_COLUMNS`, so the guard now sees the table and forces a decision. Recorded as an explicit `UNRESOLVED` exemption in `lib/server/__tests__/osf1ErasureCoverage.test.ts` rather than silently omitted. Content is transient identity-provisioning state, not user-authored content. | A saga row is found to contain user-authored content, an email, or a LINE subject id → treat as a POR-1 privacy defect and open an incident. |
| 2 | **Memory list is capped at 50 with no pagination.** `listMemories(owner, 50)` is the only read path; `/life/memories` renders what it returns. A person with more than 50 confirmed memories cannot see or delete the older ones through any surface. | Medium | Introduced by OSF-1. Unreachable today (zero rows in every environment). | Deliberately not fixed in a documentation-only pass. The 51st memory requires ~51 separate confirmations, so the cap is not reachable by accident. Deletion remains possible via `POST /api/life-os {action:"delete_memory", id}` for any id the owner knows. Account erasure removes **all** rows regardless of the cap — `yorisou_explicit_memories` is in `v_plan`, proven by executed erasure in CI. | Any account reaches 45 confirmed memories → pagination becomes required before further exposure. Also blocking for any public activation of `/life/memories`. |
| 3 | **A non-UUID row id returns HTTP 500.** `/api/life-os` validates client-supplied ids with `typeof === "string"` only; the RPC parameters are `uuid`, so a malformed id produces a Postgres `22P02` cast error that carries no `osf1_` token and falls through to 500 instead of 404/422. | Low | Introduced by OSF-1. | Not reachable from any product path: every id originates server-side (create responses, list views) and is passed through `encodeURIComponent`. Reaching it requires a hand-edited URL or a hostile client. No information is disclosed — the response body is `life_os_persistence_failed:<status>` with no content echo (verified: `rpc()` discards the PostgREST body and extracts at most an `osf1_[a-z_]+` token). | A 500 rate above baseline on `/api/life-os`, or any report of a user hitting it → add UUID-shape validation before the store call. |
| 4 | **No accessibility audit on `/life/*`.** Five new surfaces (`/life`, `/life/reflect`, `/life/goals`, `/life/experience`, `/life/memories`) have no axe run. `tests/smoke/pxr1-a11y.spec.ts` enumerates its surfaces explicitly and does not crawl, so they are simply absent from it. | Medium | Introduced by OSF-1. | The surfaces reuse the PXR-1 token set and component patterns that passed 14/14 axe checks at 390/1440 after the `--pxr-text-muted` contrast correction, so the most likely class of failure (contrast) is already addressed at the token level. All interactive controls use `min-h-[var(--pxr-touch-target)]` (48px) and every input carries a label. This is unverified, not unconsidered. | **Blocking for any exposure beyond the Founder.** Adding the five routes to the axe spec requires a running server and is the first task of the activation package. |

---

## 2. Risks explicitly accepted, with the reason

### 2.1 Operator visibility of flagged private cards

See `OSF1_FOUNDER_DECISIONS.md` §1. The clinical-flag promotion of a PRIVATE card to
`moderation_status='limited'` — which puts it in the Founder moderation queue at full content — is
**disclosed rather than narrowed**. Severity would be **high** if undisclosed; the UI now names the
trigger before the person types, which is what moves it to accepted.

**The stronger fix remains open:** skip the promotion when `visibility === 'PRIVATE'`, so a private
note never reaches a human. That is a change to Experience behaviour and belongs to its own package.

### 2.2 Two current-state stores coexist

The device-local PXR-1 record and `yorisou_current_state_records` both exist. The device record is
still the only one an anonymous visitor gets, and existing device records are **not** uploaded when
someone signs in — backfilling them would be converting existing user data, which
`Yorisou_Consent_Based_Personal_Context_Governance_v1.0.md` §3.4 prohibits without explicit user
action. Unifying them is a product decision, not a defect.

### 2.3 No `use_permission` / `provenance` / `deletion_receipt`

`annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` specifies a seven-entity memory subsystem for Core System
3 (Package B, the strictest gate). OSF-1 is an explicit-memory MVP: rows are `owner_only`, no
inference path reads them, and deletion is a hard delete. Building half of Package B under a Phase 1
authorization would have been a scope change.

### 2.4 `/life/*` has no feature flag

`robots: { index: false }` only. Any signed-in person reaching the URL can use the surfaces. A staged
rollout is a Gate 5 decision (`annex/RELEASE_GATE_DEFINITIONS.md`).

---

## 3. What was verified rather than assumed

Recorded so a future reader does not re-litigate the settled parts.

| Property | Evidence |
|---|---|
| RLS enabled on all five Life OS tables; `anon`/`authenticated` hold nothing; `service_role` SELECT only | executed in CI, `OSF-1 Life OS PostgreSQL Acceptance` |
| Every mutation goes through a `SECURITY DEFINER` RPC; all eight signature strings match their functions exactly | audit focus area 3 + the privilege assertions in the harness |
| No client `user_id` trust anywhere on `/api/life-os`; owner scope in the database `WHERE` clause on every id-taking operation; no existence oracle | audit focus area 6 |
| An unconfirmed memory row cannot exist, including by direct INSERT | executed in CI |
| A deleted account loses every Life OS row; another account's rows are untouched | executed in CI (owner A 6 rows → 0, owner B 5 → 5) |
| Migration `202608140002` is byte-identical to the erasure body it replaces apart from five `v_plan` entries | mechanical line-by-line diff, audit focus area 4 |
| Every owner-linked table in `supabase/migrations` (42) is registered for erasure or carries a written exemption | `test:osf1-erasure-coverage`, including a formatting-shape meta-test |
| CurrentStateRecord and Imairo Result share no import in either direction; the current-state table declares no methodology identity | `test:osf1-boundaries` |
| No surface claims absolute user-only visibility | `test:osf1-boundaries` |

---

## Version history

- **v1.0 (2026-08-14)** — initial register, written at Founder request during PR #132 final closeout.

---

## Risks added or reclassified by the Internal Beta Readiness package (2026-08-15)

**RESOLVED — the reflection flow disclosed after the fact.** The privacy sentence appeared only on the
finished screen, telling people where their words had gone after they had written them. Now on the
first question, before any input. Pinned by `osf1PrivacyCopy.test.ts`.

**RESOLVED — `/experiences` disclosed nothing.** The older hub wrote to the same table through the same
`trustFlags` path with no disclosure at all. It now carries the same promise, above the input fields.

**RESOLVED — memories past the fiftieth were unreachable.** A fixed cap with no cursor meant the
product had quietly stopped showing people their own records. Keyset pagination, verified against a
real PostgREST by walking every page of a 30-row set with deliberate timestamp ties.

**RESOLVED — a caller typo returned 500.** No id was validated; a non-UUID reached PostgREST and came
back as an unclassifiable error. Validated at the edge, 422.

**NEW, ACCEPTED — a person can lose a reflection if the audit table is unavailable.** This is the
direct consequence of the transactional audit the package required, and it is the reversal that
`OSF1_AUDIT_DELIVERY_CLASSES.md` flagged as needing a Founder decision. The decision was made; the
consequence is now live and is stated here so it is not rediscovered during an incident.

**NEW, OPEN — `yorisou_identity_provisioning_sagas` survives account deletion with `account_id`
readable.** Proven against a disposable cluster. Personal data outliving erasure is a real privacy
defect. POR-1 owns the table, so the fix needs POR-1's own gate. Evidence and options in
`OSF1_FOUNDER_DECISIONS.md` §3.

**NEW, OPEN — Memory governance §3.2 is not fully met.** Users can view, correct and delete. They
cannot *suppress* or *revoke*, and deletion produces no *receipt*, all three of which the governance
requires. Pre-existing and larger than this package's brief.

**CARRIED — the Life OS has never run against hosted Supabase.** Every rehearsal is a disposable
cluster. Role sets and extension schemas differ; that is why the audit RPC uses built-in `sha256`
rather than pgcrypto's `digest`. The first hosted apply remains a first.

**CARRIED — `GET /api/life/assistant` returns 405 where every sibling returns 404**, disclosing that
the path exists. No data or capability is exposed. Not fixed here: it predates this package and was
outside its brief.

---

# RISK REGISTER — closed statuses, 2026-08-15

Every risk carries exactly one status. **No vague OPEN.** `ACCEPTED_FOR_INTERNAL` means the risk is
real, understood, and tolerable for a Founder-only internal beta — not that it is acceptable publicly.

| # | Risk | Status | Basis |
|---|---|---|---|
| 1 | Audit retention undefined | `FOUNDER_DECISION_REQUIRED` | `OSF1_AUDIT_RETENTION_DECISION.md` — storage is not the constraint (30 GB at 100k MAU / 12 months); tiered recommended; code stays TBD |
| 2 | `yorisou_identity_provisioning_sagas` survives erasure with `account_id` readable | `FOUNDER_DECISION_REQUIRED` | `OSF1_IDENTITY_SAGA_ERASURE_DECISION.md` — proven; no FK, no runtime reader; pseudonymize recommended; POR-1 owns the fix |
| 3 | PRIVATE flagged content may reach moderation | `FOUNDER_DECISION_REQUIRED` | Policy unchanged. Disclosure now names the trigger **before** typing, on both surfaces |
| 4 | Transactional audit means a person can lose a reflection if the audit table is unavailable | `ACCEPTED_FOR_INTERNAL` | The deliberate reversal, and now a SURVIVABLE one: 52 assertions prove all seven actions roll back and retry cleanly, and the failure screen is proven in a browser with PostgreSQL inspected after it. The trade-off stands; the cost to the person is bounded to one retry. See #12 |
| 5 | Assistant provider readiness | `CLOSED` | 24 assertions against a deterministic fake supplied as a PARAMETER (no env var can select one): the nine Japanese boundary prompts, every failure mode normalized and distinct, fallback bounded to two attempts inside a 25s budget, no tools in the request, nothing persisted, nothing retrieved. Plus a browser E2E of the draft and the provider-failure screen through a disposable provider reached the way every provider is reached |
| 6 | Authenticated a11y not in CI | `CLOSED` | **The stated blocker was not real.** PostgREST has run in this repository's CI since `dci-1-ci.yml` — v12.2.3, pinned, in Docker. The blocker was Docker on the ACCEPTANCE MACHINE, never a property of CI. `osf1-life-ci.yml` now runs the same harness against PostgreSQL 17 and the pinned image; 32/32, 0 serious / 0 critical, including six dynamic states. No new supply-chain decision was needed |
| 7 | Malformed IDs returned 500 | `CLOSED` | Validated at the edge on all five id-taking routes plus the reflection link; 422 |
| 8 | Memory pagination unreachable past 50 | `CLOSED` | Keyset cursor, walked against real PostgREST: 5 pages, 30/30 distinct, ties exercised |
| 9 | Timeline fixed limit of 20 | `CLOSED` | Superseded by #22: merged keyset pagination, walked against real PostgREST, and page two proven to cost what page one costs at 450 rows |
| 10 | Return loop boundedness implicit | `CLOSED` | Superseded by #23: fixed priority, hard cap of three, deduped by record id, reads no memory at all |
| 11 | Neither reflection mode has a browser E2E | `CLOSED` | Both modes now driven through a real browser against a real PostgreSQL, verifying THE ROW. Non-vacuity proven: forcing p_mode to light fails the deep test on exactly the intended assertion |
| 12 | Transactional audit failure UX | `CLOSED` | Forced audit failure in a real browser, then PostgreSQL read: no row, no audit event, every answer still on screen, the message carries no digits so no status code can leak into it, nothing retries on its own, and the retry produces exactly one reflection and exactly one audit event. The retry is reachable by keyboard from the failure screen |
| 13 | State ↔ Reflection link | `CLOSED` | 8 acceptance assertions: ownership, no auto-link, null-on-delete, audit records presence not content |
| 14 | Kill switch never fired | `CLOSED` | **Fired, in a production deployment context.** ON -> KILL -> RESTORE, with data intact and no duplicated mutation. Recovery class MEASURED as `restart_required`: changing the variable does not affect the running process, so on Vercel the switch is redeploy-class, not instant. Recorded in the runbook |
| 21 | INTERNAL access unproven end to end in a production context | `CLOSED` | Founder/Admin reaches all seven routes, the API and a write; an ordinary account gets 404 everywhere with no navigation leak; six bypass attempts (role query param, body claim, admin headers, forged cookie, unauthenticated call, copied URL) all refused. 42 assertions |
| 25 | Kill switch is redeploy-class, not instant | `ACCEPTED_FOR_INTERNAL` | Measured, not assumed. Acceptable for a single-Founder beta; the runbook names the faster levers (edge block, or roll back to the previous deployment) for anything wider |
| 22 | Timeline pagination | `CLOSED` | Merged keyset verified against real PostgREST: 27/27 across 4 pages, cross-kind ties exercised, filter bound to the cursor |
| 23 | Return loop boundedness | `CLOSED` | Fixed priority, hard cap of three, deduped by record id, reads no memory at all |
| 24 | Memory lifecycle transitions | `CLOSED` | Every illegal transition refused and proven: restore-from-revoked, suppress-from-revoked, unknown state, cross-owner |
| 15 | Audit redaction | `CLOSED` | Redaction is a property of the ops record type — there is no field a reflection could occupy. **And a real leak was found in the field that DOES take a string:** the error-class pattern was `/^[a-z0-9_.:-]{1,64}$/i`, which a JWT satisfies, so a service-role key inside an `error.message` would have been logged in full. Narrowed to lowercase with no opaque run over 24 characters, which also closes the hex-secret case. Eight redaction assertions |
| 16 | Moderation queue included deleted and withdrawn cards | `CLOSED` | **Real defect, found and fixed.** The query filtered only on moderation_status, so cards a person deleted or withdrew were queued for human review anyway — the two acts that most clearly mean "stop looking at this". Now excluded at the query, with acceptance assertions proving the excluded rows still exist rather than being destroyed |
| 17 | Memory governance §3.2 suppress/revoke/receipt missing | `CLOSED` | All three implemented and verified; revocation terminal by design |
| 18 | Life OS has never run against hosted Supabase | `ACCEPTED_FOR_INTERNAL` | Every rehearsal is a disposable cluster. The first hosted apply is still a first — which is why the runbook stages it |
| 19 | `GET /api/life/assistant` returns 405 where siblings return 404 | `ACCEPTED_FOR_INTERNAL` | Discloses that a path exists; no data or capability exposed |
| 26 | Keyboard accessibility never tested | `CLOSED` | 12/12 on the real stack. **It found a real defect:** a control disabled while its request was in flight is blurred by the browser, so pressing 「下書きを見る」 threw focus to the document body and a keyboard user met the failure at the top of the page. Fixed across five surfaces — in-flight is `aria-busy` and the re-entry guard moved into the handler |
| 27 | Japanese copy never audited as a whole | `CLOSED` | 247 strings enumerated from source; eight of ten criteria at zero violations. Two terminology collisions fixed — the timeline showed 体験 and 経験 for one thing at once, and 「振り返り」 was the NARROWER of the two reflection filters despite the broader name |
| 28 | Performance never measured at volume | `CLOSED` | 12 checks at 450 rows from PostgreSQL's own statement log: no N+1, every read carries a LIMIT, page two costs what page one costs, hub 40 KB. The first run reported an N+1 that was not there — PostgREST's per-request BEGIN/SET LOCAL/COMMIT inflated the count fivefold |
| 29 | Three declared ops events had no producer | `CLOSED` | `assistant.provider_failed`, `erasure.failed` and `moderation.anomaly` were in the vocabulary, asserted by a test that only checked the list, and emitted by nothing. Each has a producer, and a test now requires one per declared event |
| 30 | Reaching pagination by keyboard in a long memory list takes ~130 Tab presses | `ACCEPTED_FOR_INTERNAL` | Measured, not assumed: every row carries four or five controls. The control IS reachable and the keyboard gate proves it. The fix is a skip affordance, which is a design addition rather than a bounded repair — and irrelevant at one Founder's data volume |
| 31 | The Life hub issues 21 database reads to render one page | `ACCEPTED_FOR_INTERNAL` | Measured at 450 rows: five or six each for reflections, directions and states. Bounded by the number of SECTIONS, not by the amount of data, so it does not degrade — the performance smoke asserts that. Consolidation is a worthwhile refactor, not a Phase 1 defect |
| 32 | Attach-mode `drop schema public cascade` was guarded by a two-token denylist | `CLOSED` | **A blocking defect in this package's own test harness, found by adversarial review.** `case "$DSN" in *supabase*|*amazonaws*)` let through every other hosted provider, a developer's own local database, any loopback tunnel, and — decisively — `PGHOST`, `service=` and keyword-form DSNs, which libpq reinterprets and a string match never sees. Replaced with an allowlist that asks the SERVER what it reached: loopback, the exact disposable database name, no foreign tables, version 16/17 |
| 33 | The ops error-class pattern admitted credential shapes | `CLOSED` | Two rounds. The first found a JWT satisfies `/^[a-z0-9_.:-]{1,64}$/i`; the second, after lowercase and a 24-char segment bound were added, found a UUID (122 bits) and three dot-joined 20-char hex runs (240 bits) still pass. Now also rejects any 16+ hex run and the UUID shape. `guard.ts` had its own copy of the original pattern and uses the shared check |
| 34 | A multi-line answer escaped the assistant's prompt bullet block | `CLOSED` | **The claim of "no instruction channel" was structurally false.** `boundedText` trims only the ends, so interior newlines survived and one answer forged a second 「利用者が書いたこと:」 label, a second JSON instruction and three lines at column zero. Impact was self-directed — no other person's data, no tools, no retrieval — which bounds the severity without making the claim true. Each answer is now JSON-serialized onto one line, verbatim, and a regression test asserts the property by LINES rather than substrings |
| 35 | Global guards where the removed `disabled` was per-row | `CLOSED` | **A regression this package introduced.** Moving the in-flight guard from `disabled` into the handler widened it: `if (pending) return` made every OTHER row's controls a silent no-op — including a hard delete and a card's visibility control, where a refused press with no message is the worst shape a mistake can take. Per-row and per-card now |
| 36 | 「入力した内容はこの画面に残っています」 was shown where nothing had been typed | `CLOSED` | `ExperienceForm`'s local message helper defaulted to the save wording, and its other caller is a VISIBILITY CHANGE — a consent surface told someone their input was preserved when there was none, and never said whether the card was still shared. `kind` is now a required parameter there |
| 37 | A successful retry left a message asserting the record had not changed | `CLOSED` | `changeLifecycle` cleared one failure slot and not the other, and the success path cleared neither — so 「記録はそのままです」 sat beside a row that had just changed. Enabled by making the pressed button the retry, which is what makes retry-after-failure the ordinary path |
| 38 | 「何も残っていません」 was asserted where the client cannot know | `CLOSED` | A rejected `fetch` includes a request that reached the server and committed with the response lost. The transactional class makes "nothing was written" a fact about a SERVER-side failure only. `network_unavailable` now stops asserting and asks the person to reload — which matters because `yorisou_explicit_memories` has no unique constraint on (owner, digest), so a blind retry would store it twice |
| 39 | `ExperienceForm` destroys a sharing draft when another card's preview is opened | `FOUNDER_DECISION_REQUIRED` | **Pre-existing, not introduced here, and real data loss:** one `draft` is held for the whole section and re-seeded whenever `draftId !== card.id`, so writing four paragraphs in card A's preview and then opening card B's discards them with no warning. Fixing it properly means a per-card draft map, which is beyond a bounded copy-and-coherence pass. Recorded rather than quietly left: it wants its own change |
| 40 | Governance names services (`memoryLifecycleService`, `permissionCheckService`) that do not exist | `ACCEPTED_FOR_INTERNAL` | Substance achieved under different names — single RPC write path, owner-scoped reads. A naming divergence, recorded not hidden |

**NOTHING IS `BLOCKING`.** #14 and #21 were the two blockers and both are now CLOSED: the
production-context rehearsal runs, and the kill switch has been watched closing the feature and
reopening it. Release Gates v1.0 §3.4 is satisfied by an executed test rather than by an argument.

The blocker was diagnosed rather than declared impossible. It was never really "we need MinIO": the
identity store turned out to be object-store backed, a disposable S3-compatible server covers it, and
the last mile was that an empty `ListObjectsV2` made every lookup-by-enumeration return nothing —
which surfaced as `missing_user_profile` and a 503 that looked like a missing service.

#3 (the PRIVATE moderation policy) remains `FOUNDER_DECISION_REQUIRED` and must be settled before
anyone who is not Edward writes about a diagnosis.

---

## Finalization, 2026-08-17

**Every risk now carries exactly one of four statuses. `DEFERRED` no longer appears anywhere in this
register** — each of the four risks that held it has either been closed by executed work (#9, #10, #12,
plus #5 and #6 which had been accepted rather than deferred) or restated as an accepted, measured
condition with the measurement attached.

| | Count |
|---|---|
| `CLOSED` | 29 |
| `ACCEPTED_FOR_INTERNAL` | 9 |
| `FOUNDER_DECISION_REQUIRED` | 6 |
| `BLOCKING` | **0** |

Nine of those rows — #32 to #39, plus #6 — were opened AND closed by §26's adversarial review, in the
same pass. Four independent reviewers were run against this package's own work with instructions to
refute rather than confirm, and they found:

- **one blocking defect in the harness itself** (#32): the guard on the most destructive line in the
  repository was a two-token denylist, when a correct allowlist already existed twelve directories away
  in `postgres-acceptance.sh` — which even states the threat model in words;
- **three regressions this package introduced** (#35, #36, #37): widening an in-flight guard from
  per-row to global, a message that told someone their input was preserved on a surface with no input,
  and a stale failure message left beside a row that had just changed;
- **two claims of structural impossibility that were false** (#33, #34): the redaction pattern admitted
  credential shapes, and a multi-line answer escaped the assistant's prompt block;
- **one piece of copy asserting more than the client can know** (#38);
- **one pre-existing data-loss path** worth its own change rather than a bounded fix (#39).

Every one of those was found by reading work that had already passed its own tests. That is the
argument for the section: a review that only confirms is not a review, and the three regressions in
particular were introduced BY a fix and were invisible to every gate that fix was written against.

**Four of the closures came from a test finding a real defect rather than confirming an intention.**
Worth naming, because a gate that only ever agrees with you is not a gate:

1. The keyboard smoke found that disabling a control mid-request throws focus to the document body — so
   every failure screen started at the top of the page for a keyboard user.
2. The redaction suite found that the ops error-class pattern accepts a JWT, in the one module whose
   whole purpose is that a credential cannot reach a log.
3. The copy audit found the timeline naming one concept two ways at once, and a filter whose broader
   name showed the narrower set.
4. The a11y CI attempt found that the recorded blocker — "PostgREST on the runner" — had never been
   true of CI. It had been carried forward through two packages unexamined.

**The lesson worth keeping from #6:** a blocker recorded once gets cited rather than re-tested. This one
cost nothing to disprove — a grep of the repository's own workflows — and it had been holding an
accessibility gate out of CI for two packages.
