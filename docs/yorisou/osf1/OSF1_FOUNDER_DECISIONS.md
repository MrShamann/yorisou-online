# OSF-1 — Founder Decision Record

**Package:** OSF-1 YORISOU OS Foundation v0.7.0 Phase 1 Life OS Foundation MVP · **Base:** `main @ 2d84d198` · **Branch:** `feat/os-foundation-phase1-life-os` · **PR:** [#132](https://github.com/MrShamann/yorisou-online/pull/132) · **Status:** implementation complete, audited, hardened; `OPEN_UNMERGED`, awaiting Founder merge. No migration applied in any environment.

> This document records decisions. It authorizes no migration, no activation and no release. Merge
> authority is Edward's alone (`resources/governance/current/annex/AGENT_EXECUTION_AUTHORITY_MATRIX.md`).

Companion documents: `docs/product/YORISOU_OS_FOUNDATION_PHASE1.md` (the canonical package record),
`OSF1_TRUST_RISK_REVIEW.md` (the non-blocking risk register), `lib/life-os/boundaries.ts` (the
CurrentStateRecord ↔ Imairo Result boundary).

---

## 1. PRIVATE Experience Cards — visibility decision

**Decision:** a PRIVATE experience card is **not visible to other users**, and platform safety
processing **may** occur under defined trust-and-safety triggers. UI wording must not imply absolute
personal-only storage.

### 1.1 What is enforced, and by what

Not visible to other users is a mechanism, not a promise:

| Read path | What excludes a PRIVATE card |
|---|---|
| `discoverExperiences` (`lib/server/experienceCards.ts`) | `visibility=in.(ANONYMOUS_SHARED,SIMILAR_STATE_ONLY)` + `moderation_status=eq.published` + `searchable=eq.true` + `owner_account_id=neq.<viewer>` |
| `sharedCard` (interact / report / block) | the same four clauses |
| `invitedCard` (invite links) | `visibility=eq.INVITE_ONLY` + `moderation_status=eq.published` |
| direct table access by a signed-in user | none exists — `anon` and `authenticated` hold no privileges on any Life OS table, and no user JWT reaches PostgREST |

### 1.2 The trust-and-safety trigger, stated exactly

`trustFlags()` flags text matching `診断` / `治療` / `必ず治る` / `絶対に効く` as
`clinical_or_absolute_claim`. `createExperience()` then sets `moderation_status = 'limited'` — **and
it does this for PRIVATE cards too**. `moderationQueue()` selects
`or=(moderation_status.eq.limited, moderation_status.eq.published)` with `select=*`, so such a card
appears in the Founder moderation surface at full content.

**Audience of that surface:** allowlisted operators only (`requireAdminRequestViewer()` →
`viewerHasAdminAccess()`). Not other users, and not the public: `moderateExperience()` computes
`searchable = action === "restore" && visibility ∈ {ANONYMOUS_SHARED, SIMILAR_STATE_ONLY}`, which is
`false` for a PRIVATE card, and `discoverExperiences` independently requires a shared visibility.

**Why this is recorded rather than quietly relied upon.** The most ordinary sentence a person might
write in a private note on this product — 「うつ病と診断されて休職した」 — contains 診断. So the
trigger does not fire on an edge case; it fires on exactly the disclosure someone would most hesitate
to make. A product that answers that hesitation with 「あなただけが見られます」 has told them something
untrue at the moment it mattered most.

### 1.3 The wording rule

Absolute personal-only claims are prohibited on any surface. `lib/life-os/privacyCopy.ts` holds the
approved sentences and the prohibited list; `lib/server/__tests__/osf1Boundaries.test.ts` fails the
build if any of six absolute phrasings reappears.

| | |
|---|---|
| Permitted, because enforced | 「ほかの利用者に表示されることはありません。」 — a claim about other **users** |
| Required, separately | 「保存先はYorisouのサーバーです。運営が内容を見るのは、安全確認が必要なときに限られます。」 |
| Required on experience surfaces | 「診断や治療にふれる内容は、安全確認の対象になることがあります。そのとき運営が本文を確認します。」 |
| Prohibited | 「あなただけが見られます」 and five near-variants; also 「非公開（自分だけ）」 |

The trigger is **named**, not hinted at, so someone deciding whether to write about a diagnosis knows
before they type. The internal-handling sentence is **separate**, not a qualifier appended to the
reassurance, because a qualifier inside a reassurance is not read.

### 1.4 What this decision does NOT do

It does not narrow the trigger. Promoting a PRIVATE card to `limited` is pre-existing behaviour from
the experience-card package and remains in place; OSF-1 made the product tell the truth about it
rather than changing who can see what, because narrowing it would change the Experience model.

**Open for a follow-up package:** whether the clinical-flag promotion should skip PRIVATE cards
entirely, so a private note never reaches a human at all. That is the stronger fix and it is a
deliberate non-decision here — see `OSF1_TRUST_RISK_REVIEW.md` §1.

---

## 2. `clearFields` — bounded PATCH capability

**Decision:** `clearFields` is a bounded server-side PATCH capability. It is **not a user-facing
feature**. Clearing is **explicit only**. No shared or public card may have a sharing-context field
cleared without authorization.

### 2.1 Why it exists

`updateExperience` shared `payload()` with `createExperience`. `payload()` returns all nine content
keys, each `clean()`-ed to `null` when absent — correct for a create, which supplies everything or is
invalid. For a patch it meant a request naming three fields wrote the other six to `NULL`. The caller
never asked to erase them; it simply did not mention them.

Before OSF-1 made four of those columns nullable, that same request was **rejected** by
`payload()`'s all-or-nothing check. So the nullability relaxation — introduced so a private card need
not be annotated for readers it does not have — is what converted "invalid request" into "silently
destroys the owner's own text". `clearFields` is the replacement for the semantics that were lost.

### 2.2 The contract

| Rule | Enforcement |
|---|---|
| An **absent** field is untouched | `updateBody()` skips `value === undefined`; nothing is written for it |
| An **empty string** is an error, not a clear | `experience_field_empty:<column>` |
| Clearing requires an explicit `clearFields` entry | there is no other path to `null` |
| `situation` / `action_tried` / `perceived_outcome` are never clearable | not in `CLEARABLE_FIELDS`; `NOT NULL` in the schema; `experience_field_not_clearable:<field>` |
| Setting and clearing the same field is refused | `experience_field_set_and_cleared:<field>` |
| **A shared card's sharing-context fields cannot be cleared** | `experience_field_required_when_shared:<field>` in the application, and `yorisou_experience_cards_shared_context_chk` in the database |
| Becoming shared re-checks the **merged** row | `updateExperience` merges patch over current before applying the sharing contract |
| Type-level separation | `ExperienceUpdateInput` is distinct from `ExperienceInput`, so a create-shaped object cannot reach update and get replace semantics |

`clearFields` is limited to the six nullable columns: `title`, `lesson`, `state_context`,
`limitations`, `may_fit`, `may_not_fit`.

### 2.3 Not user-facing

No UI sends `clearFields`. `/experiences` submits all seven content fields from `toForm` and
`/life/experience` creates only. The capability is reachable solely by an authenticated owner calling
`PATCH /api/experiences/[id]` directly, and every clear is recorded in the
`yorisou_experience_events` metadata (`{visibility, cleared}`).

**A user-facing "clear this field" control is out of scope and unauthorized.** Exposing one would
need its own package: a confirmation step, wording that distinguishes clearing a field from deleting
a card, and a decision about whether a cleared field is recoverable from
`yorisou_experience_revisions` (it currently is, which is a property nobody has ruled on).

---

## 3. OPEN — `yorisou_identity_provisioning_sagas` survives account deletion

**Status: AWAITING EDWARD. This is a live privacy gap, not a bookkeeping one.**

### What was proven, not inferred

Against a disposable PostgreSQL 17 cluster with the full migration lineage applied, a provisioning
saga row was created for `acct_saga`, a POR-1 deletion job was opened, and
`yorisou_account_deletion_erase_database_unchecked` was run to completion:

```
sagas rows before deletion: 1
erasure ran
sagas rows AFTER deletion:  1
account_id still readable:  acct_saga
```

The row survives, and `account_id` — a **direct account identifier**, not a fingerprint — remains
fully readable after the person's account has been erased.

### Why it happens

The table is not in the erasure plan. `202608140002`'s `v_plan` names five OSF-1 tables and the
pre-existing POR-1 families; `yorisou_identity_provisioning_sagas` appears in none of them. The
erasure-coverage guard has carried it as a literal `"UNRESOLVED"` exemption since PR #132 — an honest
placeholder that has now outlived its usefulness.

### The technical facts Edward needs

| Question | Answer |
|---|---|
| Does it hold durable user-personal data? | **Yes.** `account_id text` is a direct identifier. `owner_fingerprint` and `session_fingerprint` are pseudonymous; `executor_token_hash` is security material, not personal data. |
| Is it required for security or account lifecycle? | It is POR-1 provisioning **saga state** — the record of how an account was created, used for resume and for incident reconciliation. Its *pseudonymous* columns carry that value; `account_id` is the convenience link. |
| What happens after deletion today? | Nothing. The row persists indefinitely with the identifier intact. |
| Delete, pseudonymize, retain or exempt? | **A policy decision, which is why this is here.** |

### The options, with consequences

1. **Pseudonymize** *(recommended)* — null `account_id` at erasure, keep the row and its fingerprints.
   Preserves lifecycle and incident value; removes the identifier. Matches how the OSF-1 audit table
   already resolves the same tension.
2. **Delete** — register the table in the erasure plan. Cleanest privacy answer; loses the record
   that the account existed, which POR-1 incident review has previously depended on.
3. **Retain as-is** — only defensible with a stated, Edward-approved basis. **No legal retention
   obligation is claimed here**, and none should be invented to justify this option.

### Why this package did not simply fix it

The table belongs to POR-1, not OSF-1. Changing another subsystem's erasure semantics from inside a
Life OS package would be exactly the scope creep the governance forbids, and it needs POR-1's own
Gate 3. The guard's exemption text has been updated from `UNRESOLVED` to a classification that points
here, so the question is recorded rather than carried as a shrug.

**Privacy governance bearing on it:** Data & Privacy v1.0 §3.2 requires retention schedules to be
explicit per entity and approved by Edward, and §6 requires deletion reconciliation. An identifier
that survives deletion with no schedule satisfies neither.

---

## 3. Decisions carried from earlier passes

| Decision | Where recorded |
|---|---|
| `Goal` is built despite the approved 18-entity model containing no Goal entity; precedence is *Edward > pack > package* | `docs/product/YORISOU_OS_FOUNDATION_PHASE1.md` §2.1 |
| Goal = Life Direction / Intention, never task management — no deadline, streak, ranking, progress or failure state | ibid. §2.1, `lib/life-os/contract.ts`, `lib/server/lifeOs/store.ts` |
| CurrentStateRecord and Imairo Result never auto-convert, overwrite or replace each other | `lib/life-os/boundaries.ts` |
| Experience is REUSED (`yorisou_experience_cards`), not duplicated | ibid. §3 |
| Memory is confirmed-only, enforced by `check (user_confirmed = true)` | ibid. §7 |
| Sharing-context fields are required-WHEN-SHARED rather than always | `supabase/migrations/202608140001` §6 |

---

## Version history

- **v1.0 (2026-08-14)** — initial record. Sections 1 and 2 written at Founder request during PR #132
  final closeout, after the pre-merge governance audit and the final hardening pass.
