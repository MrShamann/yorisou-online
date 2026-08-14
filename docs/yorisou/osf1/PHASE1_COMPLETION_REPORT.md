# OSF-1 — Phase 1 Life OS Completion Report

**Package:** Phase 1 Life OS · **PR:** [#134](https://github.com/MrShamann/yorisou-online/pull/134), OPEN and unmerged · **Branch:** `feat/osf1-life-os-activation`, head `a6305f0` · **Base:** `main` @ `84d1439` · **Written:** 2026-08-15

> **This package is not committed yet.** `a6305f0` is the branch head and does not contain it:
> `202608160001`, the two `[id]` route directories, `app/life/StateHistory.tsx`, the two a11y harness
> files and these three documents are untracked, and 22 tracked files carry uncommitted edits. Every
> measurement below was taken against the working tree, and PR #134 does not yet show any of it.

> **Nothing here has been applied to a database.** Five migrations exist in the repository's
> production lineage and **none of them has run** — not in Production, not in Preview, not in any
> hosted staging project. Every `/life` route answers 404 in production, and no Life OS write is
> attempted anywhere until an operator declares out of band that the schema is present. This document
> describes code that is complete and tested, in an environment where it is switched off.

---

## 1. What the Phase 1 Life OS is

It is a place to keep a person's own account of their life, and a loop that runs through it. Six
steps, each with a surface that serves it and nothing that serves it invisibly:

| Step | What it is | Where it happens |
|---|---|---|
| **Understand** | what is true right now — a bounded state record: one to five tags from the Today check-in's own vocabulary, an optional mood, energy, situation and note | written at `/today/check-in`, the only surface that creates one; read back on `/life` (いまの状態, and 前に残した状態 below it) · `POST /api/life/state` |
| **Record** | what actually happened — an experience, written as a private card | `/life/experience` · `POST /api/life/experiences` |
| **Reflect** | what to make of it — five questions on the day, or seven with distance | `/life/reflect` · `/life/reflect?mode=postmortem` |
| **Remember** | the few sentences the person explicitly asked to keep | the confirmation dialog that follows a reflection or a new goal · `/life/memories` |
| **Review** | what has accumulated, in the order it happened | `/life/timeline` |
| **Return** | what they left, shown when they come back | 前にいたところ on `/life` · `GET /api/life/timeline?view=return` |

Alongside the loop, not inside it, sits **direction**: a goal is something a person chose to hold in
view, kept at `/life/goals` and surfaced in the return view as the one direction currently marked
active. It is deliberately not a task. There is no due date, no reminder, no progress value, no
streak, no counter, no priority, and the status vocabulary has no `failed` and no `overdue` —
`released`（手放した）is an equal outcome to `achieved`（届いた）. `listGoals` sorts by `created_at`
alone, because sorting by anything else is a ranking.

The same restraint governs the return view. It shows the last thing written, an answer that was
started and left empty, the active direction, and the most recent experience — each a link back to
the person's own words. It computes nothing about them, counts nothing, and when there is nothing to
show it renders nothing rather than inventing an encouragement.

## 2. Architecture

### 2.1 Identity

The account id comes from the encrypted session cookie and from nowhere else. No route reads an
owner from a request body, a query parameter or a header — there is no parameter a caller could set
to act as someone else. `requireLifeViewer()` in `lib/server/lifeOs/guard.ts` is the single place all
ten route files resolve who is asking, which is what stops ten routes from drifting into ten
different answers.

Its order is load-bearing. The feature gate is checked **before** the session, so a closed route
answers identically for a signed-in and a signed-out caller and reveals nothing about who asked. The
mutation gate is checked **before the request body is read**, so a write that cannot succeed is
refused before the person's text has been accepted and then dropped.

Below the API, the database never sees a raw account id in the audit trail: `yorisou_osf1_audit_write`
stores `sha256(owner_account_id)` as `actor_fingerprint`. That single decision is why the audit table
needs no erasure-plan entry — there is nothing to pseudonymize at account deletion because nothing
was ever identified.

### 2.2 RPC-only mutation

The access model is DCI-1.1's, applied unchanged:

```
DIRECT_USER_DENY  +  SERVER_REPOSITORY_OWNER_SCOPE  +  RPC_ONLY_DATABASE_MUTATION
```

RLS is enabled on all five tables. There are intentionally **no** authenticated-user policies,
because app auth is cookie-based and no user JWT ever reaches PostgREST. `public`, `anon` and
`authenticated` have no access at all; `service_role` has `SELECT` and nothing else. Every write goes
through a bounded `SECURITY DEFINER` RPC — ten of them: eight from `202608140001`, plus
`yorisou_osf1_audit_write` and `yorisou_osf1_memory_update`. (`202608140001` defines a ninth
function, `yorisou_osf1_state_vocabulary()`, which is an immutable SQL read and not a write path.)
Each validates its own inputs in the
database, not only in the API route, so a future caller cannot widen the contract by forgetting a
check.

The consequence worth stating: application code holding the service-role key **cannot** insert,
update or delete a row in any Life OS table directly. A bug in `lib/server/lifeOs/store.ts` cannot
become a write.

### 2.3 The access gate

Four states, declared in `lib/life-os/access.ts`, default OFF:

| State | Where it applies | What opens it |
|---|---|---|
| `OFF` | everywhere, by default | nothing — routes 404 and no write is attempted |
| `INTERNAL` | true production, Founder/Admin only | the existing production-pilot token `osf1_life_os_internal`, **plus** an authenticated Founder/Admin proven by the caller |
| `PREVIEW` | non-production only | the dev flag `osf1_life_os_preview` |
| `PUBLIC` | everyone | **not implementable from this module.** It is named so the state machine is complete and testable; no environment variable in this codebase returns it |

`deploymentContext()` fails closed: production is denied and an unknown context is denied. Local and
test are open, for implementation acceptance.

**The mutation gate is strictly narrower than the read gate, and deliberately so.** Reads degrade to
an empty state when the database has no Life OS tables. Writes cannot degrade — they fail, and
someone who has just typed a seven-question reflection loses it. So `lifeOsMutationAccess()`
additionally requires `YORISOU_OSF1_LIFE_OS_SCHEMA_READY === "true"`, an operator's out-of-band
assertion that the migration ran. That is what makes deploying this code against an un-migrated
database safe rather than merely unlikely to be noticed. A refusal is a named 503
(`life_os_not_accepting_entries:denied_schema_not_ready`), not a PostgREST error surfaced as a 500.

### 2.4 Audit delivery — two classes, both now real

`OSF1_AUDIT_DELIVERY_CLASSES.md` recorded which events required transactional delivery and stated
that implementing it needed a Founder decision, because it reverses a trade-off. This package makes
the decision. Both classes now exist:

| Class | Written by | Actions |
|---|---|---|
| **Transactional** | the mutation RPC itself, inside the same transaction | `reflection.created`, `memory.confirmed`, `memory.deleted`, `memory.updated` |
| **Asynchronous** | `auditLifeOs()`, after the fact, failure swallowed | `context.updated`, `state.created`, `state.annotated`, `goal.created`, `goal.status_changed`, `experience.created`, `experience.updated`, `assistant.drafted`, `assistant.refused` |

`AUDIT_DELIVERY_CLASS` in `lib/server/lifeOs/audit.ts` is now a statement of fact rather than of
intent, and `auditLifeOs()` **throws** if handed a transactional action. That is not defensiveness:
the database has already written that row, and the audit table is append-only, so a duplicate could
never be removed.

**The trade-off, stated plainly.** For those four actions the audit insert happens inside the
mutation's transaction. If the audit table is unavailable, **the mutation fails**. A person can lose
a reflection because its record could not be written. That is the deliberate choice — for these four
the record of what happened is judged as important as the thing itself, most sharply for deletion,
where after a hard delete the audit row is the only remaining evidence the memory ever existed.

The delete audit is conditional on a row actually having been removed. Auditing an unmatched delete
would let anyone manufacture a `memory.deleted` record for an id they do not own simply by asking
for it — in a table that has no way to remove the false entry.

## 3. Database

### 3.1 The five tables

Created by `202608140001`. Every one carries `owner_account_id` and is hard-deleted at account
deletion by the POR-1 erasure plan, which `202608140002` extends to name them.

| Table | What it holds | The constraint that matters |
|---|---|---|
| `yorisou_user_contexts` | language, region, timezone, and a closed set of preferences | `preferences_json` accepts only four keys; an open bag would become a behavioural profile within a release or two |
| `yorisou_current_state_records` | one temporal statement about right now | state tags come from the Today check-in's own option ids — there is no way to record a state the product does not already offer, and no free text where a tag belongs |
| `yorisou_goals` | direction, not tasks | status is `active \| paused \| achieved \| released` — no `failed`, no `overdue` |
| `yorisou_life_reflections` | the person's own guided reflection | `what_happened` required; every other answer optional and capped at 2000 characters |
| `yorisou_explicit_memories` | the sentences the person asked to keep | `check (user_confirmed = true)` — an unconfirmed memory cannot be stored, by the schema and not by convention |

Two things are **reused, not rebuilt**. Experience is the existing `yorisou_experience_cards` vertical
with its revisions, consents, invites and moderation; `202608140001` adds only the two columns it
genuinely lacked (`title`, `lesson`). And `yorisou_ai_reflections` — AI commentary on a saved test
result — is untouched and is a different record from a Life OS reflection despite sharing the English
word.

A sixth table, `yorisou_life_os_audit_events`, was added by `202608150001`: append-only, enforced by
a trigger that raises on UPDATE and DELETE, with no foreign key to anything it audits, because an
audit row that cascades away with its subject is not a trace.

A `CurrentStateRecord` is **not** an Imairo Result. An Imairo Result is a methodology assessment
output from the 120-question pipeline, carrying method identity, a scoring version and a named
result, living in `yorisou_assessment_results` behind its own acceptance and erasure contract. A
current-state record carries none of that and never becomes one: nothing here is scored, no code
converts between the two, and `osf1Boundaries.test.ts` fails if an OSF-1 module imports an assessment
module.

### 3.2 The lineage

```
202608140001  osf1_life_os_foundation          5 tables, 9 RPCs, the privilege matrix
202608140002  osf1_erasure_plan_registration   the five tables added to the POR-1 erasure plan
202608150001  osf1_life_os_audit_events        append-only audit table + yorisou_osf1_audit_write
202608150002  osf1_reflection_five_question_flow   the `felt` and `tried` columns
202608160001  osf1_phase1_completion           this package
```

All five are `PRODUCTION_LINEAGE` in `supabase/MIGRATION_SCOPE_MANIFEST.md`. All five are unapplied.

### 3.3 What `202608160001` changes

Four things, and all four land on the same three functions:

1. **`options_considered`** — the postmortem's missing fourth question. Nothing existing was a
   substitute: `decision_made` is what was chosen, not what was available to choose from. Recording
   the options is the whole mechanism by which a postmortem separates a decision from its outcome, because
   a choice can only be judged against the alternatives that existed at the time.
2. **`mode`** — `light` or `postmortem`, defaulting to `light`, stored on the row. The mode was
   previously carried only as an audit reason and it never arrived (§3.4). Storing it also makes it
   recoverable, which the audit trail alone never was: an abandoned postmortem and a light reflection
   are byte-identical across the answer columns.
3. **`lesson`** added to the memory-type vocabulary. What someone concluded is not a preference, a
   goal, an experience or a reflection, and it is the kind of memory a reflection most often produces.
4. **Transactional audit**, plus a new `yorisou_osf1_memory_update` so a memory can be edited. An
   edit re-confirms: the digest of the *new* sentence must be supplied and must match what gets
   stored, exactly as at creation, because an edit replaces the sentence the person agreed to. There
   is deliberately no way to edit `memory_type`, `source` or any subject link — those are what the
   memory *is*, and changing them under a stable id would turn one memory into a different one.

`why` and `what_learned` are **retained columns**. No flow asks them any more, rows written by the
earlier flow still hold them, and nothing drops them — dropping a column deletes what somebody wrote.

**Why it is one file.** PostgreSQL overloads by signature: `create or replace function` with a
different parameter list creates a *second* function rather than replacing the first. Every grant in
this project is a hardcoded signature string. Split across two migrations, the second would leave the
first one's overload alive, un-granted and audit-less — and PostgREST would dispatch to whichever
overload happened to match the JSON key set it was sent. So: one file, every affected function
dropped by its exact old signature and recreated once. The Postgres acceptance suite asserts each of
the four names resolves to exactly one function.

### 3.4 The defect this package fixed

`parseReflectionInput()` returned only the answer fields. `input.mode` was therefore always
`undefined` downstream, and **every postmortem was audited as a light reflection** — the one fact the
audit row existed to carry was the one fact it did not. The mode now survives parsing, is validated
against `REFLECTION_MODES`, and is written to a column.

## 4. API

Every route calls `requireLifeViewer({ mutation })` as its first statement, before reading a body.

| Method | Path | What it does |
|---|---|---|
| `GET` | `/api/life/context` | the account's context, or null |
| `PUT` | `/api/life/context` | upsert language, region, timezone, bounded preferences |
| `GET` | `/api/life/state` | recent state records, newest first |
| `POST` | `/api/life/state` | create a state record — or, when `id` is present, add the optional note to one that does not have one yet |
| `GET` | `/api/life/goals` | goals, newest first |
| `POST` | `/api/life/goals` | create a goal |
| `PATCH` | `/api/life/goals` | change a goal's status |
| `GET` | `/api/life/experiences` | the person's own cards |
| `POST` | `/api/life/experiences` | create a card, always `PRIVATE` |
| `PATCH` | `/api/life/experiences/[id]` | patch semantics; visibility expansion requires `previewConfirmed: true` |
| `GET` | `/api/life/reflections` | reflections, newest first |
| `POST` | `/api/life/reflections` | create a reflection; returns memory candidates |
| `GET` | `/api/life/memories` | confirmed memories |
| `POST` | `/api/life/memories` | confirm a candidate — `confirmed: true` or a 409 |
| `DELETE` | `/api/life/memories?id=` | hard-delete a memory |
| `PATCH` | `/api/life/memories/[id]` | edit the sentence, which re-confirms |
| `POST` | `/api/life/assistant` | one draft from the text just typed; stores nothing |
| `GET` | `/api/life/timeline` | the chronological view; `?view=return` returns the return view instead |

Three properties hold across the table:

**A PATCH is not a replace.** On `/api/life/experiences/[id]` an absent field means leave it alone;
it never means null. Clearing is possible only through an explicit `clearFields` entry, checked
against the store's own list. Widening visibility is refused *before* anything is written, so a
request that would widen without confirmation never reaches the merge and the person's other edits
are not half-applied on the way to a 409.

**Not yours answers like not there.** Owner scope lives in the RPC's `WHERE` clause or in
`ownerCard`'s owner filter. A memory or card belonging to someone else is indistinguishable from one
that does not exist, so an id cannot be used to probe for records.

**Errors are named, never numeric-only.** The RPCs raise `osf1_*` exceptions; `rpc()` lifts the named
exception out of the PostgREST error body and discards the rest, because the raw body can quote the
offending content and that must not reach a log line.

Creation on `/api/life/experiences` is always `PRIVATE`. Sharing is a separate, deliberate decision
made afterwards in the `書きとめたもの` list below the form on `/life/experience`, through
`PATCH /api/life/experiences/[id]` — that is where the visibility control and the preview
confirmation live. Offering a visibility choice at the bottom of a note-taking form would put the
most consequential control in this product where nobody reads.

## 5. UI

| Route | What it is |
|---|---|
| `/life` | わたしの記録 — the hub. Five quiet rows, each showing at most three recent entries and one link; the return section above them, and 前に残した状態 inside いまの状態 |
| `/life/timeline` | これまで — every record in order |
| `/life/reflect` | the light flow, five questions, one field per screen |
| `/life/reflect?mode=postmortem` | the deep flow, seven questions |
| `/life/goals` | 向かいたい方向 |
| `/life/experience` | 経験を書く, and 書きとめたもの with the visibility control |
| `/life/memories` | 覚えていること — edit or delete, per memory |

Every page carries `robots: { index: false }` and calls `lifeOsAccess()` before any session lookup or
database read, so a closed route 404s without touching the database.

The hub is deliberately **not a dashboard**: no counts, no streaks, no charts, no "you have completed
4 of 7". `StateHistory` (new in this package) is a list of moments and nothing more — no chart, no
average, no trend, no comparison between one day and the next. Each of those turns a record of how
someone *was* into a measurement of how they are *doing*, and the reading it invites — "I am getting
worse" — is a claim this product does not get to make about anyone. Six heavy days are six days.

Two consequences of the mode split are handled rather than left to break: `/life/reflect` metadata is
mode-neutral because metadata is static and cannot vary by mode, and signing in from the postmortem
link carries `?mode=postmortem` through the round trip, so someone who chose the deep flow does not
come back to the light one without being told.

On visibility, the surfaces say what is true. Not 「あなただけが見られます」 — a claim about everyone,
which the code does not enforce — but 「ほかの利用者に表示されることはありません」, a claim about other
users, which it does, paired with a separate sentence about internal handling. On experience cards a
third sentence names the safety-review trigger explicitly, because someone deciding whether to write
about a diagnosis deserves to know it. It is on the same screen but below the fields and the save
button, which is weaker than naming it above them would be. The prohibited absolute phrasings are listed in
`lib/life-os/privacyCopy.ts` and a test fails if any surface reintroduces one.

## 6. Test evidence

Measured on this tree, not asserted.

| Gate | Result | How to run |
|---|---|---|
| Node suites, six | **73 assertions, 73 pass, 0 fail** — `osf1Contract` 13, `osf1AiBoundary` 9, `osf1ErasureCoverage` 5, `osf1Boundaries` 6, `osf1RegressionRepair` 14, `osf1Activation` 26 | `npm run test:osf1-contract`, and the same for `-ai-boundary`, `-erasure-coverage`, `-boundaries`, `-regression-repair`, `-activation` |
| PostgreSQL acceptance | **125 assertions, all passing**, on a disposable `initdb` cluster with every migration applied | `npm run test:osf1-postgres` |
| Authenticated accessibility | **14 axe checks, 0 serious, 0 critical** — 7 surfaces × 390×844 and 1440×900 | `npm run test:osf1-a11y-authenticated` |
| Typecheck | `tsc --noEmit` clean | `npx tsc --noEmit` |
| Lint | 0 errors across `app/api/life`, `app/life`, `lib/life-os`, `lib/server/lifeOs` and the a11y spec | `npx eslint …` |
| Build | `next build` passes; all ten API routes and six `/life` pages emit as dynamic | `npm run build` |
| Migration scope | `{"status":"ok","migrations":59,"onDisk":59}` | `node scripts/validate-migration-scope.mjs` |
| Imairo protected assets | untouched — 8 groups pass | `npm run test:imairo-snapshot` |

Three of these deserve more than a row.

**The rollback is proven, not argued.** `postgres-acceptance.sh` installs a `before insert` trigger on
the audit table that forces the insert to raise, calls each of the four transactional mutations, and
asserts that no row survives — with a control showing the same call persists when the audit table
works. That is the transactional claim in §2.4 demonstrated against a real PostgreSQL rather than
inferred from the SQL. The harness also asserts the append-only trigger refuses both UPDATE and
DELETE, that a delete matching nothing writes no audit row, that a refused edit writes no audit row,
and that the four completion RPCs are single-signature, denied to `anon` and `authenticated`, and
granted to `service_role`.

**The accessibility harness scans the real product.** The pre-existing signed-out spec
(`tests/smoke/osf1-life-a11y.spec.ts`) reached only `SignInRequired` — a heading, two short paragraphs
and two links — so it was green about the wrong page. `tests/life-os/fullstack-a11y.sh` builds a disposable
PostgreSQL + PostgREST + `next start` stack, registers a real account, seeds a current state, a goal,
an experience, both reflection modes and two memories through the real `/api/life/*` endpoints, then
runs axe. An empty page hides most accessibility defects; what axe sees here is a populated product.
The bar is serious = 0 and critical = 0; moderate and minor are logged rather than failed, because a
gate noisy enough to be ignored is not a gate.

**The erasure check is real.** `osf1ErasureCoverage` does not grep the migration for table names — it
scans every migration for owner-linked tables and fails if one is not registered in the POR-1 plan,
and the Postgres harness inserts rows for two people, runs POR-1's actual erasure body, and looks at
what is left.

## 7. Limitations

This is the section to read if you were not here. Everything below is a real gap, verified in the
code rather than remembered.

**No migration has been applied anywhere.** Not Production, not Preview, not staging. There is no
verified hosted staging database in this repository: the Preview Supabase project failed its own
control probe during the activation audit, so it does not carry the migration lineage and cannot
serve as staging without a separate decision. Every result in §6 comes from disposable local
clusters. "The acceptance suite passes" and "the schema works in a hosted environment" are different
claims and only the first is made here.

**Production is closed and every `/life` route 404s there.** `deploymentContext()` denies production
and denies unknown contexts; no environment variable in this package opens it. Mutations additionally
require `YORISOU_OSF1_LIFE_OS_SCHEMA_READY`, which is set nowhere.

**The `INTERNAL` activation state is defined and tested but not wired to anything.**
`lifeOsActivationState()` and `lifeOsInternalAccess()` are imported only by
`osf1Activation.test.ts` — no page and no route calls either. Every surface consults `lifeOsAccess()`,
which denies production unconditionally. So setting the `osf1_life_os_internal` pilot token in
production today would change nothing: the routes would still 404. Reaching Founder/Admin access in
production requires wiring that has not been done.

**The transactional audit can cost someone a reflection.** If `yorisou_life_os_audit_events` is
unavailable, `reflection.created`, `memory.confirmed`, `memory.deleted` and `memory.updated` all
fail with their mutations. This is the intended behaviour and it is the reversal the Founder decision
authorised, but the cost falls on the person: they typed seven answers and the save failed for a
reason that has nothing to do with what they wrote. Nothing retries, and nothing preserves the draft
server-side.

**Retention is undecided: `RETENTION_POLICY_TBD`.** No retention period is set or assumed. Twenty-four
months is an unapproved proposal in the annex, not the policy, and retention schedules are a
non-delegable Founder right. The consequence is stated rather than left to inference: audit rows have
**no expiry**, the table grows without bound, and nothing removes a row. Inventing a purge would be
deciding the policy, so none exists.

**The authenticated accessibility harness is a local gate and is not wired into CI.** The six Node
suites and the Postgres acceptance suite run in `.github/workflows/yorisou-check.yml`; the
authenticated a11y run does not. The reason is PostgREST: the harness needs a real PostgREST process
in front of the database to exercise the API routes, GitHub's runners have no Homebrew PostgreSQL and
no PostgREST binary, and the repository's own precedent for containerised PostgREST (Docker) is not
available on the acceptance machine. So it is run by hand, and a regression in `/life` accessibility
would not be caught by a pull request. The signed-out spec that *is* runnable in CI
(`npm run test:osf1-a11y`) scans only the sign-in notice and is not evidence about these surfaces.

**There is no Life Graph, and none is claimed.** `lib/server/lifeOs/timeline.ts` sorts records that
already exist by a timestamp they already carry and stores nothing. It creates no relationships
table, no edge, no inference, and asserts no relationship between records; a test fails if a
migration in this package ever creates a table whose name contains `relationship|edge|graph|link`.
The one link that appears — a reflection's `experience_id` — is a foreign key the person created by
choosing to reflect on an experience. Assessment results are excluded from the timeline deliberately:
mixing a two-tap check-in with a 120-question methodology result would present them as the same kind
of evidence.

**The Reflection Assistant reads nothing stored, and providers are off by default.** It works only on
text typed in the same request, holds no state between calls, persists nothing, runs only when the
person presses 整理してもらう, and its output is never applied automatically. That is not a limitation
worked around — governance requires any reference to a stored memory to pass an eligibility check by
a shared permission service (`use_permission` / `permissionCheckService`), and that service does not
exist in this codebase. Separately, `resolvePrivateReflectionProviders()` returns no routes unless
providers are configured, so the ordinary outcome today is `assistant_unavailable` and the flow is
built to complete without it.

**The assistant does not see postmortem answers.** `prompt()` in `reflectionAssistant.ts` iterates
`REFLECTION_QUESTIONS`, which is the *light* set. `parseAssistantInput()` accepts every field of both
modes, and the postmortem UI sends them, but `goal_at_the_time`, `information_at_hand`,
`options_considered` and `decision_made` are silently dropped before the prompt is built. In a
postmortem the assistant therefore works from `what_happened`, `what_followed` and `next_time` only —
it never sees the four answers that make the flow a postmortem. Nothing fails and nothing is
mis-stored; the draft is simply built from a fraction of what was written.

**The reflection-derived memory candidate is dead code in practice.**
`buildMemoryCandidates()` offers a `reflection`-type candidate from `what_learned`, but
`createReflection()` hardcodes `p_what_learned: null` because no flow asks that question any more. So
for every reflection written by either current mode, only the `preference` candidate from `next_time`
can appear. The `lesson` memory type added by this migration is likewise offered by no surface: it is
reachable only by a caller that posts `memoryType: "lesson"` to `/api/life/memories` directly, which
is what the a11y harness does to seed one.

**Reflections cannot be edited or deleted individually.** `yorisou_life_reflections` has no
`updated_at` column and there is no update or delete RPC for it. Memories can be edited and
hard-deleted; current-state records can be annotated once and never changed again; goals can change
status but cannot be removed. Everything else leaves only at account deletion. If someone writes
something they regret in a reflection, the product has no answer for them short of deleting the
account.

**The user context has an API and no interface.** `GET` and `PUT /api/life/context` are implemented,
gated and audited, but nothing in `app/` calls either. Language, region, timezone and the four
preference keys — including `reduced_motion` and `text_size` — cannot be set by a person through any
screen in this package.

**The audit action vocabulary is enforced in TypeScript, not in the database.** The table's check
constraint is the pattern `^yorisou\.life\.[a-z_]+\.[a-z_]+$`. `LIFE_OS_AUDIT_ACTIONS` is the real
list, and a caller reaching the RPC by another path could write an action outside it.

**The timeline is bounded and has no pagination.** Twenty entries by default, each slice fetched
independently and failure-tolerant, so an unreachable table yields an empty slice rather than an
empty timeline. There is no way to page back further. That is deliberate — bulk memory reads are
prohibited by governance and a timeline is for recognising a thread, not for auditing a life — but it
means older records become unreachable through the UI as newer ones accumulate.

**A private experience card can still reach a human.** `trustFlags()` in
`lib/server/experienceCards.ts` flags text containing 診断 / 治療 / 必ず治る / 絶対に効く and sets
`moderation_status='limited'` *including for a PRIVATE card*, and `moderationQueue()` selects those
rows with `select=*`. So a private note describing a diagnosis appears in full in the Founder
moderation queue. The surfaces say so — that is why `SAFETY_REVIEW_TRIGGER` exists and why no surface
claims 「あなただけが見られます」 — but it is a real limit on what "private" means here, and it applies
to anything written through `/life/experience`.

**The governance version named by the package does not exist.** The package is titled "YORISOU OS
Foundation v0.7.0" and refers to a Project Constitution and Technical Architecture at v0.7.0. **There
is no v0.7.0 pack in this repository.** The corpus that exists is **Governance Pack v0.4.1**
(`resources/governance/current/RESOURCE_MANIFEST.md`), containing
`Yorisou_Project_Constitution_v0.4.0.md` and `Yorisou_Technical_Architecture_v0.4.0.md`. Nothing under
`resources/governance/` matches `v0.7.0`. This work is measured against v0.4.0/v0.4.1; anyone citing
v0.7.0 is citing a document that is not here.

---

## Version history

- **v1.0 (2026-08-15)** — Phase 1 completion, recorded against the working tree on
  `feat/osf1-life-os-activation` (head `a6305f0`; the package itself is not yet committed).
