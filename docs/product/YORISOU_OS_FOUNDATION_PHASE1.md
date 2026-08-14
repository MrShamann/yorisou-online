# YORISOU OS Foundation v0.7.0 — Phase 1 Life OS Foundation MVP

**Status:** Implemented, awaiting Founder review. Not merged. Not deployed. No Production migration applied.
**Branch:** `feat/os-foundation-phase1-life-os` · **Base:** `main` @ `2d84d1985f4b68b1a28a14d85c2e4cdcd2c45e52`
**Authorization:** Founder package "YORISOU OS Foundation v0.7.0 — Phase 1 Life OS Foundation MVP"
**Implementation agent:** Claude Code, per `resources/governance/current/annex/AGENT_EXECUTION_AUTHORITY_MATRIX.md`

**Companion records:**
`docs/yorisou/osf1/OSF1_FOUNDER_DECISIONS.md` — the PRIVATE-card visibility decision and the
`clearFields` contract · `docs/yorisou/osf1/OSF1_TRUST_RISK_REVIEW.md` — the non-blocking risk
register · `lib/life-os/boundaries.ts` — the CurrentStateRecord ↔ Imairo Result boundary.

---

## 1. What this is, in one paragraph

Phase 1 gives Yorisou somewhere to keep a person's own account of their life: how things are now, what
direction they want to hold, what they tried, what they made of it, and the few things they asked the
product to remember. Six entities were named in the package. **Two of them already existed and were
reused rather than rebuilt**, four were genuinely absent and were created, and the memory entity was
built with its confirmation requirement enforced by a database constraint rather than by convention.

## 2. The governance the package is measured against

The package said "follow existing YORISOU v0.7.0 governance resources". There is no pack numbered
v0.7.0; the effective governance is **Pack v0.4.0/v0.4.1**, activated on `main` by PR #106
(`7c37ca1 Governance: activate YORISOU governance pack v0.4.0`). The binding documents that constrain
this work:

| Document | What it required here |
|---|---|
| `annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` | the 18-entity model; the bounded DCI/YV pilot schema authority; the hard rule that no existing user data is reinterpreted as memory or consent |
| `Yorisou_Consent_Based_Personal_Context_Governance_v1.0.md` | capture → candidate → confirmed; saving never implies use; deletion honoured absolutely |
| `Yorisou_Personal_Archive_and_Memory_Governance_v1.0.md` | unconfirmed candidates expire; no agent/system writes to memory; no bulk memory read API |
| `annex/ARCHITECTURE_TO_CODE_MAPPING_AUTHORITY.md` | service boundaries for Core Systems 3 and 4 |
| `annex/RELEASE_GATE_DEFINITIONS.md` | Gate 2 (architecture + privacy check), Gate 3 (additive-only migrations), Gate 4 (Edward merges) |
| `docs/report-main-state-mode-writing-rules-v0.2.md` | no goal-setting language that pressures commitment |

### 2.1 One conflict, stated plainly

**The package asks for a `Goal` entity. The approved 18-entity data model does not contain one, and
the writing rules treat goal-framing as a defect** — the report quality gate asks for "an orienting
direction (not a goal list)" and the writing rules prohibit "goal-setting language that pressures
commitment".

Precedence in `AGENT_EXECUTION_AUTHORITY_MATRIX.md` is *Edward > governance pack > package
authorization*, so the Founder's instruction governs and the entity is built. It is built to be
compatible with the doctrine rather than in spite of it:

- statuses are `active | paused | achieved | released` — **there is no `failed` and no `overdue`**;
  `released`(手放した) sits beside `achieved`(届いた) as an equal outcome;
- there is **no progress field, no percentage, no due date, no reminder and no streak**;
- the surface copy is 向かいたい方向 ("a direction to move toward"), and says in as many words that it
  is not for achieving things.

`lib/server/__tests__/osf1Contract.test.ts` asserts `failed` and `overdue` are unreachable, so the
constraint survives someone later "completing" the status list.

This is flagged for the reviewer as a governance decision, not resolved unilaterally.

## 3. Reuse decisions — what was NOT built

The package said: *"Reuse existing patterns. Do not create duplicate systems."* The repository was
inspected before any code was written; four of the six proposed entities already existed in some
form. Each decision and its reason:

| Phase 1 entity | Decision | Why |
|---|---|---|
| **Experience** | **REUSE** `yorisou_experience_cards` | A complete, Production-tracked vertical with 9 companion tables (revisions, consents, invites, reports, blocks, moderation) and a de-identification scan. Phase 1 adds the two columns it lacked — `title`, `lesson` — and maps `action_taken`→`action_tried`, `outcome`→`perceived_outcome`. **No second experience table exists.** |
| **CurrentStateRecord** | **NEW table**, DCI-1's *pattern* only | `yorisou_daily_state_records` exists but is a **bounded private-pilot domain** under the data-model annex, which states the six DCI/YV tables are "not a general-purpose memory subsystem" and that converting them into another domain "requires explicit user action and a separately authorized package". It is also Production-CLOSED (`dailyCheckInAccess` → `denied_production`, route 404s). Phase 1 therefore copies its access architecture and touches none of its rows. |
| **Reflection** | **NEW table** | `yorisou_ai_reflections` is *AI-generated commentary on a saved test result*, triple-gated off by default. Phase 1's reflection is *written by the person, about something that happened*. Same English word, different record. |
| **Memory** | **NEW table** | `yorisou_private_memory_items` is anchored to `saved_result_id`/`reflection_id` with a nine-value vocabulary about test-result interactions. Widening it to also mean life-OS memory would have required four new type values and three foreign keys on a Production table whose meaning is "private AI notes about a test result". The two stores remain separate and neither reads the other. |
| **Goal** | **NEW table** | Does not exist anywhere. See §2.1. |
| **UserContext** | **NEW table** | Does not exist. Today's pieces are scattered: a path-derived `yorisou_locale` cookie, a `primaryLocale` field that is hardcoded `null` at every writer, and per-record browser timezones. None is user-chosen. |

**No existing user data is read, converted, migrated or backfilled into any table created here.** Every
new table starts empty and only accepts rows created by a live user action. That satisfies the
cross-cutting hard rule structurally rather than by policy.

## 4. Changed files

### New — schema
- `supabase/migrations/202608140001_osf1_life_os_foundation.sql`
- `supabase/migrations/202608140002_osf1_erasure_plan_registration.sql`

### New — domain and server
- `lib/life-os/contract.ts` — vocabularies, types, input validation (client-safe)
- `lib/life-os/client.ts` — browser client for `/api/life-os`
- `lib/server/lifeOs/store.ts` — service-role PostgREST repository; all writes via RPC
- `lib/server/lifeOs/aiBoundary.ts` — the enforced AI boundary + memory-candidate builder
- `app/api/life-os/route.ts` — the Phase 1 endpoint

### New — surfaces
- `app/TodaySavedState.tsx` — account-backed current state on 今日
- `app/life/page.tsx` — わたしの記録 hub
- `app/life/SignInRequired.tsx`
- `app/life/MemoryConfirmation.tsx` — 「覚えておきますか」
- `app/life/reflect/page.tsx`, `app/life/reflect/ReflectionFlow.tsx` — the seven-question flow
- `app/life/goals/page.tsx`, `app/life/goals/GoalsPanel.tsx`
- `app/life/experience/page.tsx`, `app/life/experience/ExperienceForm.tsx`
- `app/life/memories/page.tsx`, `app/life/memories/MemoryList.tsx`

### New — tests
- `lib/server/__tests__/osf1Contract.test.ts` (13)
- `lib/server/__tests__/osf1AiBoundary.test.ts` (9)
- `lib/server/__tests__/osf1ErasureCoverage.test.ts` (5)
- `tests/life-os/postgres-acceptance.sh` (37 assertions against a real PostgreSQL)

### Modified
- `app/page.tsx` — renders `TodaySavedState`
- `app/me/page.tsx` — one link through to `/life`
- `app/today/check-in/CurrentStateCheckIn.tsx` — server persistence + the optional note; the
  completion line now states where the record actually went
- `lib/server/experienceCards.ts` — `title`/`lesson`; sharing-context fields required only when
  shared; **AI structuring output now passes the boundary check**
- `supabase/MIGRATION_SCOPE_MANIFEST.md` — the two new migrations, PRODUCTION_LINEAGE
- `package.json` — four `test:osf1-*` scripts
- `.github/workflows/yorisou-check.yml` — an OSF-1 step (nothing in this repo is auto-discovered)

## 5. Database changes

### 5.1 New tables (all: RLS enabled, public/anon/authenticated denied, `service_role` SELECT only, all mutation via `SECURITY DEFINER` RPC)

| Table | Columns beyond `id`/`owner_account_id`/timestamps |
|---|---|
| `yorisou_user_contexts` | `language`(ja/en), `region`, `timezone`, `preferences_json` (object, ≤4 KB, key allowlist) — unique per owner |
| `yorisou_current_state_records` | `state_tags text[]` (1–5, bounded vocabulary), `mood`, `energy`, `situation`(≤500), `reflection`(≤1000), `source` |
| `yorisou_goals` | `title`(≤120), `description`(≤1000), `status` |
| `yorisou_life_reflections` | `experience_id`→cards `on delete set null`, `what_happened`(required) + 7 optional answers |
| `yorisou_explicit_memories` | `memory_type`, `content`(≤2000), `source`, `user_confirmed`, `confirmation_digest`, three nullable subject FKs |

### 5.2 Altered — `yorisou_experience_cards`
- `+ title text` (nullable, ≤120), `+ lesson text` (nullable, ≤1000)
- `state_context`, `limitations`, `may_fit`, `may_not_fit`: `NOT NULL` → conditional check
  `visibility = 'PRIVATE' or (all four not null)`.
  Those four fields exist so a stranger cannot mistake someone's account of what helped them for
  advice. A private card has no reader but its author. **Nothing about what a SHARED card must
  contain is relaxed**, and every existing row satisfies the new constraint.

### 5.3 RPCs (service-role execute only)
`yorisou_osf1_state_vocabulary`, `_user_context_upsert`, `_current_state_create`,
`_current_state_set_reflection`, `_goal_create`, `_goal_set_status`, `_reflection_create`,
`_memory_confirm`, `_memory_delete`.

### 5.4 Account erasure — the part that would have been missed

POR-1 erasure **does not discover tables**. `yorisou_account_deletion_erase_database_unchecked`
carries a literal `v_plan text[][]` and deletes exactly what it names; a table absent from that array
is skipped in silence and the job still records `outcome = ok`. Without registration, a person could
delete their account, be told it succeeded, and keep a current-state history, their goals, their
reflections and their memories on the server.

`202608140002` re-declares the function with the five OSF-1 tables added to `v_plan` and **nothing
else changed**. `tests/life-os/postgres-acceptance.sh` proves the outcome by inserting rows for two
people, running the real erasure body, and checking that one person's rows are gone and the other's
are untouched.

The pre-existing coverage test could not have caught this: `por1ProductionDeletionCoverage.test.ts`
reads the **preview-only** migration and compares against a checked-in snapshot of the Production
catalogue dated 2026-08-01, so a table added afterwards appears on neither side and the test stays
green. `osf1ErasureCoverage.test.ts` closes that: it scans every migration for owner-linked tables
and fails unless each is either in the shipped plan or carries a **written** justification.

## 6. User flows

**Today (`/`, `/today/check-in`).** The two bounded questions are unchanged — no new question, no free
text added to the flow itself. On completion the device-local record is written first and
unconditionally (this is what makes the check-in work with no account and no database), then a server
record is attempted for a signed-in person. The completion line now says which happened; it previously
said 「この記録はこの端末にだけ保存されます。」 unconditionally, which stops being true once a
signed-in person's check-in reaches their account. An optional 「書き残しておく」 note is offered after
the fact, write-once. `/` shows the last saved state for signed-in people and renders nothing
otherwise.

**Reflection (`/life/reflect`).** Seven questions, one per screen. Question 4 carries two inputs (the
decision and the reason for it) so the count stays at seven. **Only the first is required**; every
other screen has とばす, and ここまでで残す finishes early. On save, the person's own sentences are
offered back as memory candidates.

**Experience (`/life/experience`).** Four questions → the existing card table, always `PRIVATE`. The
sharing controls stay on `/experiences` where they are a deliberate separate decision; offering
"share this publicly" at the bottom of a private-note form is how private things get published by
accident. On save, 「この経験を振り返る」 links into the reflection flow with the experience attached.

**Goals (`/life/goals`)** and **memories (`/life/memories`)** — see §2.1 and §7.

## 7. The AI boundary

**Permitted:** summarise user input · organise reflection · suggest memory candidates · ask reflection
questions. **Prohibited:** diagnose · define personality · create permanent identity · infer sensitive
traits · create memory without confirmation.

Three mechanisms make this enforced rather than described:

1. **`inspectAiOutput` / `assertAiOutputWithinBoundary`** (`lib/server/lifeOs/aiBoundary.ts`) — a
   deterministic scanner over five categories. It is wired into `structureExperience`, which
   previously sent 「診断や断定は禁止です」 in the prompt and checked nothing: a model returning
   「あなたは不安障害の傾向があります」 would have been handed straight to the person as their own
   organised card. A violation rejects the whole candidate rather than editing it, because a
   sanitised sentence still carries the provenance of a model that just broke the rule.

   **It scans model output only, never what a person wrote.** Someone writing 「うつ病と診断されて休職
   した」 in their own reflection is describing their life; a product that refuses to store that has
   decided they may not talk about themselves. The test suite pins seven real pieces of Yorisou copy
   that must NOT be flagged, because an over-eager scanner gets switched off and then protects nothing.

2. **Memory candidates are quotes, not conclusions.** `buildMemoryCandidates` returns sentences the
   person already wrote, wrapped in minimal framing. Nothing is inferred, so nothing new is put in
   front of someone to confirm. It calls no provider, which is why the whole confirm-before-save flow
   works with every AI provider off — their current state.

3. **Confirmation is structural.** `yorisou_explicit_memories` carries
   `check (user_confirmed = true)`: an unconfirmed memory row **cannot exist**. There is no pending
   state and no candidate row — an unconfirmed suggestion lives only in one HTTP response and the
   dialog on screen, and is gone if the person navigates away. `confirmation_digest` is the sha256 of
   the exact sentence shown; the RPC recomputes it and rejects a mismatch, so a caller cannot display
   one sentence and store another.

## 8. Tests executed

### Real database — `bash tests/life-os/postgres-acceptance.sh` → **PASS, 34 assertions**
Builds its own throwaway PostgreSQL 17 cluster, applies all 56 migrations, then:

| Package requirement | Result |
|---|---|
| creating CurrentStateRecord | ok, + unrecognised tag refused, + write-once note |
| creating Goal | ok, + `released` reachable, + `failed` refused |
| creating Experience | ok on the existing table, + `title`/`lesson` present, + **no second experience table** |
| creating Reflection | ok with seven answers, ok with only the first, refused with none |
| confirming Memory | ok |
| **rejecting Memory creation without confirmation** | `confirmed=false` refused · `confirmed=null` refused · **digest mismatch refused** · **direct INSERT with `user_confirmed=false` refused by the check constraint** |
| permission boundary checks | RLS on all five · anon/authenticated have no select/insert/update/delete · service_role SELECT only · RPCs not executable by anon/authenticated · a reflection cannot reference another person's experience · a memory cannot reference another person's reflection |
| (beyond the requirement) account erasure | A's six rows all gone; B's five untouched |

### Node — all green
- `npm run test:osf1-contract` → 13/13
- `npm run test:osf1-ai-boundary` → 9/9
- `npm run test:osf1-erasure-coverage` → 3/3
- `npm run test:experience-cards` → 8 assertions (non-regression on the modified file)

### Repository gates
- `npx tsc --noEmit` → clean
- `npm run lint` → 0 errors, 13 warnings, **all pre-existing**; none in OSF-1 files
- `npm run build` → exit 0
- `node scripts/validate-migration-scope.mjs` → `{"status":"ok","migrations":56,"onDisk":56}`

## 9. Verification commands

```bash
npm run test:osf1-contract
npm run test:osf1-ai-boundary
npm run test:osf1-erasure-coverage
npm run test:osf1-postgres          # needs /opt/homebrew/opt/postgresql@17/bin; no Docker, no Supabase
npm run test:experience-cards
npx tsc --noEmit && npm run build
node scripts/validate-migration-scope.mjs
```

## 10. Known limitations

1. **Not merged, not deployed, no Production migration applied.** Both migrations are
   PRODUCTION_LINEAGE and unapplied anywhere. Gate 3 (up/down on a staging copy, backup snapshot
   reference) and Gate 5 remain open and are the Founder's.
2. **Device-local check-ins are not uploaded.** A signed-in person's *new* check-ins reach their
   account; records already in `localStorage` stay there. Backfilling them would be converting
   existing user data, which the consent governance prohibits without explicit user action.
3. **Two current-state stores now coexist** — the device-local PXR-1 record and the server record.
   The device record is still the only one an anonymous visitor gets. Unifying them is a product
   decision this package did not have authority to make.
4. **The AI boundary scanner is pattern-based**, so it is a floor, not a proof. It is deliberately
   narrow to avoid false positives on ordinary feeling words; a novel phrasing of a prohibited claim
   can pass. It is one of three mechanisms, and the confirmation guarantee (§7.3) does not depend on it.
5. **No `use_permission` / `provenance` / `deletion_receipt` entities.** Governance specifies a
   seven-entity memory subsystem for Core System 3 (Package B, the strictest gate). Phase 1 is an
   explicit-memory MVP: memories are `owner_only`, are not read by any inference path, and are hard
   deleted. Building half of Package B under a Phase 1 authorization would have been a scope change.
6. **`/life/*` is `robots: noindex` but has no feature flag.** Any signed-in person reaching the URL
   can use it. If a staged rollout is wanted, that is a Gate 5 decision.
7. **English copy is untranslated.** All Life OS surfaces are Japanese only.
8. **No axe run on `/life/*`.** The surfaces reuse existing tokens and components, and the a11y suite
   (`tests/smoke/pxr1-a11y.spec.ts`) enumerates its surfaces explicitly rather than crawling; adding
   the new routes to it needs a running server and is worth doing before exposure.

## 10a. Pre-merge governance and architecture audit (2026-08-14)

Founder-requested audit of this PR across six focus areas, run as twelve independent agents — six
auditors, then a refuter per area instructed to default to "refuted" without independent
confirmation. Four claims were withdrawn on refutation. What survived:

**One BLOCKING defect, found and fixed.** Making `state_context` nullable for PRIVATE cards meant a
card written on `/life/experience` stores NULL there. `discoverExperiences` read every own card's
`state_context` with no null filter, typed it `string`, and called `.replace` on it — so
`GET /api/experiences?mode=discover` threw a TypeError for anyone who had used the new form. The GET
handler has no try/catch, so it 500'd, and `app/experiences/view.tsx` swallows a failed response, so
`/experiences` silently rendered an empty 今読める体験 section instead of showing an error. Fixed with
a `state_context=not.is.null` filter, a null-tolerant tokeniser and an honest type; three assertions
added to the acceptance harness.

**The erasure guard was weaker than its own header claimed.** Its scanner anchored the owner-column
match to a line start and required `public.` qualification, so it saw 28 of the repository's 42
owner-linked tables — every densely-formatted CREATE TABLE in `202607110002_experience_cards.sql` and
`202607110003_recommendation_graph.sql` was invisible. All fourteen were already in the erasure plan,
so no data was ever at risk, but the guard's coverage claim was false for a third of the schema and
the next table added to either file would have escaped it. Rewritten: formatting-agnostic scanner,
`ALTER TABLE ADD COLUMN` owner columns detected, `account_id`/`user_id` added to the recognised
names, identifiers lowercased, plan file selected by definition rather than mention. Two properties
the guard never asserted are now tested — that the scanner can see nine SQL formatting shapes, and
that every registered plan entry names a **column the table actually has** (the runtime skips a
wrong column in silence). Coverage: 42 of 42.

**Comment-accuracy defects, corrected.** Three comments cited two test files that do not exist. The
confirmation digest was described in three places as making it impossible for "a caller to show one
sentence and save another" — it is unkeyed and the same caller supplies both halves, so it rules out
an accident, not an adversary; the load-bearing guarantee is the check constraint. The RPC-permission
section implied every function is service-role-only; `yorisou_osf1_state_vocabulary()` keeps PUBLIC
EXECUTE and now says so.

**Requested documentation added.** The CurrentStateRecord ↔ Imairo Result boundary is now stated in
the migration, the SQL table comment, the domain type and the store (temporal daily user state vs
methodology assessment output, never converted in either direction), together with the three-way
`reflection` naming collision. The Goal-is-Life-Direction-not-task-management statement is now in the
store, the API route and the goals page alongside the existing ones.

**Verified clean, no change needed.** RLS on all five tables; anon/authenticated hold nothing;
service_role SELECT only; all eight mutation RPC signature strings match their functions exactly;
no client `user_id` trust anywhere; owner scope enforced in the database WHERE clause on every
id-taking operation; no existence oracle; no PostgREST injection; `check (user_confirmed = true)`
unbypassable and the RPC the only INSERT path; JS/SQL digest provably identical (btrim's strip set is
a strict subset of JS trim's); no deadline, streak, ranking, progress or completion mechanic anywhere
in Goal; 202608140002 byte-identical to the erasure body it replaces apart from the five plan entries.

**Referred, not fixed here** (out of the audit's permitted scope, each with a written finding):
private cards enter the admin moderation queue with `moderation_status='draft'` while the page
promises 「あなただけが見られます」 — pre-existing behaviour, operator-only, no public leak; `payload()`
is shared with `updateExperience`, so a partial PATCH can null fields; a non-UUID row id returns 500
rather than 404/422; `yorisou_identity_provisioning_sagas` is in no erasure path (POR-1, pre-existing
— now visible to the guard and recorded as UNRESOLVED); the check-in writes to the account before any
sentence says so; memories beyond the 50 most recent are unreachable; the PostgreSQL harness is still
not wired into CI.

## 10b. Final hardening (2026-08-14)

Five Founder-specified items, after the audit.

**1. The CurrentStateRecord ↔ Imairo Result boundary is now a named artefact.**
`lib/life-os/boundaries.ts` states both definitions and the three prohibitions — *never auto-convert,
never overwrite, never replace* — with the concrete reason each matters: two taps and 120 answered
questions are not the same evidence, so a check-in appearing where a result belongs claims a method
found something when nothing was measured, and a result appearing where a check-in belongs presents a
weeks-old conclusion as today. `lib/server/__tests__/osf1Boundaries.test.ts` enforces it in both
directions: no Life OS module may reference an assessment module or table, and
`yorisou_current_state_records` may not declare `result_id`, `method_id`, `method_version`,
`scoring_version`, `archetype`, `persona` or `score`. A fourth test asserts the boundary is still
documented in the four files a maintainer is standing in when they would break it.

**2. The private-visibility wording is now true.**
Five surfaces said 「あなただけが見られます」. That is false for a real and ordinary case:
`trustFlags()` flags text containing 診断 / 治療 / 必ず治る / 絶対に効く, `createExperience()` then sets
`moderation_status='limited'` **including for a PRIVATE card**, and `moderationQueue()` serves limited
cards to operators with `select=*`. So someone writing 「うつ病と診断されて休職した」 as a private note
had it in the Founder moderation queue, in full, on a screen that had just promised otherwise.

The wording now separates the claim that is provable from the one that is not.
`lib/life-os/privacyCopy.ts` holds three constants: 「ほかの利用者に表示されることはありません」 (a
statement about other users, which `discoverExperiences` / `sharedCard` / `invitedCard` and the
anon/authenticated grants all enforce), a separate sentence about internal handling, and — for
experience cards only — the named trigger, so someone hesitating over whether to mention a diagnosis
knows before they type. `/experiences` also had 「非公開（自分だけ）」 in its visibility selector;
corrected. A test fails if any surface reintroduces one of six absolute phrasings.

**3. Experience PATCH is a patch.**
`updateExperience` shared `payload()` with create, which always returns all nine content keys
`clean()`-ed to null. A patch naming three fields therefore wrote the other six to NULL — the caller
never asked to erase them, it just did not mention them. Before OSF-1 made those columns nullable the
same request was rejected outright, so the nullability relaxation is what turned "invalid" into
"silently destroys the owner's own text".

Now: **absent means untouched**, and only an explicit `clearFields` entry nulls anything. Clearing is
refused for `situation` / `action_tried` / `perceived_outcome` (NOT NULL in the schema), refused for a
field also being set in the same request, and refused for the four sharing-context fields unless the
card is PRIVATE. An empty string is an error, not a clear. Visibility is optional on a patch, and when
a card becomes shared the **merged** row — not the patch — must satisfy the full sharing contract.
`ExperienceUpdateInput` is a distinct type, so the compiler now stops a caller handing update a
create-shaped object. `/experiences` also rendered `String(null)` as the literal text `null` in its
editor, which `clean()` would have accepted as real content on save; coalesced at the boundary.

**4. The PostgreSQL acceptance runs in CI.**
New job `OSF-1 Life OS PostgreSQL Acceptance` on a `postgres:17` service container. It covers all four
requested properties in one harness because they are one setup: migration execution in lineage order
first (so a migration that fails to apply fails before any assertion), then RLS and the privilege
matrix, account erasure executed for real, and the memory-confirmation constraint. The harness takes
`OSF1_DATABASE_URL` for CI and still self-builds a throwaway cluster locally; the supplied DSN is
guarded with the same three clauses the repository's four other harnesses use (not Supabase, is
localhost, names `osf1_acceptance`), so it cannot be repointed at a real database by editing the URL.

**5. Documentation** — this section, plus the boundary and Goal statements from §10a.

Unchanged, as instructed: Life Graph architecture (still absent), the Experience model (same table,
same nine companion tables, no new entity), Memory governance (same single confirmed-only table and
constraint), and every protected methodology asset — scoring, taxonomy, result assets, LINE
boundaries. The `title`/`lesson` columns and the visibility-conditional constraint from the original
package are unchanged by this pass.

## 10c. Governance closeout (2026-08-14)

Documentation and governance closure only — no code behaviour changed in this pass.

**Decisions recorded** in `docs/yorisou/osf1/OSF1_FOUNDER_DECISIONS.md`, following the DCI-1/YV-1
house convention (`docs/yorisou/<package>/`):

- **§1 PRIVATE Experience Cards.** Not visible to other users, with the four read paths and the
  clauses that enforce it. Platform safety processing may occur under a named trigger — `trustFlags()`
  on 診断 / 治療 / 必ず治る / 絶対に効く promotes even a PRIVATE card to `moderation_status='limited'`,
  which `moderationQueue()` serves to allowlisted operators at full content. UI wording must not imply
  absolute personal-only storage; the approved and prohibited sentences are constants in
  `lib/life-os/privacyCopy.ts` and a test fails the build on six absolute phrasings. §1.4 records what
  the decision deliberately does **not** do: it discloses the trigger rather than narrowing it.
- **§2 `clearFields`.** A bounded PATCH capability, not a user-facing feature, with the eight-rule
  contract and the reason it exists — the nullability relaxation this package introduced is what
  turned an invalid request into one that silently destroyed the owner's own text. No UI sends it; a
  user-facing clear control is explicitly out of scope and would need its own package.

**Risks registered** in `docs/yorisou/osf1/OSF1_TRUST_RISK_REVIEW.md`, in the house risk-table format
with severity, present state, mitigation and a stop condition each: provisioning-saga erasure coverage
(medium, pre-existing), the 50-item memory cap (medium, unreachable today), non-UUID id → 500 (low,
unreachable from any product path), and the missing axe audit on `/life/*` (medium, **blocking for any
exposure beyond the Founder**). §2 records four risks accepted with reasons; §3 lists what was
verified rather than assumed, so the settled parts are not re-litigated.

The prose list in §10 above remains the reading summary; the register is the governed record.

## 11. Rollback

**Before merge:** close the PR. Nothing is applied anywhere.

**After merge, before any migration is applied:** `git revert` the merge commit. The migrations are
inert files.

**After `202608140002` is applied:** re-apply `202608010110` verbatim. It restores the previous
`v_plan`; it removes no data and drops no object.

**After `202608140001` is applied:** run the block at the head of that migration
(§ROLLBACK). It drops the nine OSF-1 functions and the five OSF-1 tables — **this destroys the data in
them** — and drops `title`/`lesson` and the shared-context constraint from
`yorisou_experience_cards`. Restoring the four `NOT NULL`s additionally requires that no PRIVATE card
holds a null in them; if any does, that card must be completed or removed first. Everything else on
`yorisou_experience_cards` is untouched by both the migration and the rollback.

**Application-only rollback (no schema change):** reverting the code leaves the tables in place and
unreferenced. They stay registered for account erasure, so no orphaned personal data results.
