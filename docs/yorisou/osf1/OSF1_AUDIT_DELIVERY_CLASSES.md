# OSF-1 — Audit Delivery Classes

**PR:** [#135](https://github.com/MrShamann/yorisou-online/pull/135) · **v2.1, 2026-08-17** · the authoritative inventory, built by reading every mutation in the source — and then corrected by two rounds of adversarial review (see §3)

> **This document is now an INVENTORY, not a proposal.** v1.x recorded a decision and then that the
> decision was implemented. v2.0 replaces the argument with the complete list: every Life OS mutation
> that exists, which class it is delivered with, where in the code, and what happens when the audit
> write fails. The reasoning is kept, moved to §5, because a table of classes with no argument behind
> it is a table nobody can correct.
>
> **Retention is still `RETENTION_POLICY_TBD`.** Nothing here implements or implies an expiry. See
> [OSF1_AUDIT_RETENTION_DECISION.md](OSF1_AUDIT_RETENTION_DECISION.md) — `FOUNDER_DECISION_REQUIRED`.

---

## 1. The three classes

| Class | Meaning | When it is correct |
|---|---|---|
| `TRANSACTIONAL_REQUIRED` | The audit insert is inside the mutation's own `SECURITY DEFINER` transaction. Either both land or neither does. **If the audit table is unavailable, the person's save fails.** | The audit answers a question the surviving data cannot — most importantly *what used to be here*, and *whether someone agreed*. |
| `ASYNC_ALLOWED` | The audit write is attempted after the mutation and its failure is swallowed (and counted as `life_os.audit.write_failed`). A dropped row is invisible. | The mutation is self-evidencing: the row itself is the record and nothing was destroyed. |
| `NOT_AUDITED_WITH_REASON` | No Life OS audit event exists. The reason is stated, not omitted. | Reads; and the pre-OSF-1 experience surface, which has its own separate trail. |

The classes are machine-readable in `AUDIT_DELIVERY_CLASS` (`lib/server/lifeOs/audit.ts`), and
`auditLifeOs()` **throws** if handed a transactional action — the database has already written that
row, and the table is append-only, so a duplicate could never be removed.

## 2. The inventory

`SUBJECT` is what the audit row identifies. The audit table stores **no account id**: the owner is
sha256-fingerprinted inside the RPC, so account deletion leaves nothing personal behind.
`CONTENT` is whether any of the person's own words may appear in the row — **the answer is `no`
everywhere, without exception.**

### Transactional — 7 actions

| ACTION | ENTITY | CODE / RPC PATH | AUDIT REASON | SUBJECT | CONTENT | ON AUDIT FAILURE |
|---|---|---|---|---|---|---|
| `yorisou.life.reflection.created` | reflection | `store.createReflection` → `yorisou_osf1_reflection_create` (`202608170001:184`) | the mode (`light` / `postmortem`) | `entity_ref` = reflection id, fingerprint | **no** — `detail` is `{answered: n, about_state: bool}` | reflection **rolled back**; UI keeps the text, offers 「もう一度保存する」 |
| `yorisou.life.memory.confirmed` | memory | `store.confirmMemory` → `yorisou_osf1_memory_confirm` (`202608160001:314`) | the `source` | `entity_ref` = memory id, fingerprint | **no** — `detail` is `{memory_type}` | memory **rolled back**; 「何も残っていません」 is then literally true |
| `yorisou.life.memory.updated` | memory | `store.updateMemory` → `yorisou_osf1_memory_update` (`202608160001:403`) | `user_edited` | `entity_ref` = memory id, fingerprint | **no** — neither the old nor the new sentence | edit **rolled back**; the original sentence survives |
| `yorisou.life.memory.suppressed` | memory | `store.setMemoryLifecycle` → `yorisou_osf1_memory_set_lifecycle` (`202608170001:250`) | the state it came FROM | `entity_ref` = memory id, fingerprint | **no** — `detail` is `{to: state}` | state change **rolled back** |
| `yorisou.life.memory.restored` | memory | same RPC | the state it came FROM | same | **no** | state change **rolled back** |
| `yorisou.life.memory.revoked` | memory | same RPC | the state it came FROM | same | **no** | state change **rolled back** |
| `yorisou.life.memory.deleted` | memory | `store.deleteMemory` → `yorisou_osf1_memory_delete` (`202608160001:351`) | `user_requested` | `entity_ref` = memory id, fingerprint | **no** — `detail` is `{memory_type}` | delete **rolled back**; the memory survives and **no receipt is written** |

All seven are proven by executed fault injection — `tests/life-os/audit-failure.sh`, 55 assertions,
plus a browser end-to-end for reflection and memory confirmation
(`tests/smoke/osf1-audit-failure-e2e.spec.ts`).

### Asynchronous — 9 actions

| ACTION | ENTITY | CODE PATH | AUDIT REASON | SUBJECT | CONTENT | ON AUDIT FAILURE |
|---|---|---|---|---|---|---|
| `yorisou.life.context.updated` | user_context | `app/api/life/context/route.ts:39` | `user_edit` | fingerprint only | **no** | mutation stands; `life_os.audit.write_failed` counted |
| `yorisou.life.state.created` | current_state | `app/api/life/state/route.ts:57` | the source (`today_check_in` / `manual`) | `entity_ref` = state id | **no** — tags are a closed vocabulary, the note is not logged | as above |
| `yorisou.life.state.annotated` | current_state | `app/api/life/state/route.ts:46` | `user_note` | `entity_ref` = state id | **no** — presence only, never the sentence | as above |
| `yorisou.life.goal.created` | goal | `app/api/life/goals/route.ts:36` | `user_created` | `entity_ref` = goal id | **no** — not the title | as above |
| `yorisou.life.goal.status_changed` | goal | `app/api/life/goals/route.ts:79` | the new status | `entity_ref` = goal id | **no** | as above |
| `yorisou.life.experience.created` | experience | `app/api/life/experiences/route.ts:48` | `private_draft` | `entity_ref` = card id | **no** | as above |
| `yorisou.life.experience.updated` | experience | `app/api/life/experiences/[id]/route.ts:122` | `visibility_expanded` / `visibility_narrowed` / `content_updated` — the post-change visibility is in `detail.to_visibility`, not in `reason` | `entity_ref` = card id | **no** | as above |
| `yorisou.life.assistant.drafted` | assistant | `app/api/life/assistant/route.ts:73` | `draft_offered` | fingerprint only — **no entity, because nothing was stored** | **no** — `detail` is `{provider, model}`; never the prompt or the draft | as above |
| `yorisou.life.assistant.refused` | assistant | `app/api/life/assistant/route.ts:46` | `boundary_violation` | fingerprint only | **no** — not the offending output | as above |

**The asymmetry worth naming:** `assistant.refused` is the event an incident review would most want,
and it is the one most able to go missing. It is asynchronous anyway, because it gates nothing and
destroys nothing — but a lost one is a real cost, which is why `life_os.assistant.provider_failed`
now exists as a second, independent signal (§4).

### Not audited, with reason

| MUTATION | WHY NO LIFE OS AUDIT EVENT |
|---|---|
| Reflection Assistant **invocation** that produced no draft | `assistant_unavailable` and `nothing_written` are not events. The first is this product's ordinary state (providers are off by default); the second is a person changing their mind. Every other outcome emits `life_os.assistant.provider_failed`. |
| Every `GET` — `/api/life/{state,goals,reflections,memories,timeline,context,experiences}`, `memories/receipts` | Reads. Auditing a person reading their own records would build the surveillance log this product exists not to keep. |
| `/api/experiences/*` — the **pre-OSF-1** surface (`POST`, `PATCH`, `DELETE`) | Has its **own** trail, older and separate: `yorisou_experience_events`, `yorisou_experience_revisions`, `yorisou_experience_visibility_events`, `yorisou_experience_consents`. Not folded into the Life OS trail because they are a different domain with a different retention story — and rewriting a working audit path was not this package's business. `/api/life/experiences/*` is the OSF-1 surface and IS in the Life OS trail. |
| `moderateExperience` (Founder moderation) | `yorisou_experience_moderation_events` + `yorisou_experience_events`, same reason. Anomalies now also emit `life_os.moderation.anomaly`. |
| **Life Graph mutation** | **There is no Life Graph and no relationships table**, so there is no such mutation. Listed so the requirement is not lost if one is ever built: an asserted relationship is a claim about a person, and a claim needs a `TRANSACTIONAL_REQUIRED` record of who made it. |

## 3. Verified invariants

Each was executed, not reasoned about. `A` = `tests/life-os/postgres-acceptance.sh`,
`F` = `tests/life-os/audit-failure.sh`, `G` = `tests/life-os/gate3-migration-rehearsal.sh`,
`E` = the browser end-to-end specs, `N` = the node suites.

| | Invariant | Where |
|---|---|---|
| A | **No double audit.** `auditLifeOs()` throws on a transactional action, so a call site cannot write a second copy of a row the database already wrote. | `N` |
| B | **No missing critical audit.** All 7 transactional actions roll back their mutation when the audit insert fails — including the two that write it *conditionally*. | `F` (52), `G` |
| C | **No raw Reflection content** in any audit row. | `E`, `A` |
| D | **No raw Memory body** — the deletion receipt, which IS the audit row, carries only the type. | `F`, `A` |
| E | **No PRIVATE Experience body**; the card is undiscoverable and its text is not in the trail. | `A` |
| F | **No hidden AI prompt.** `detail` carries `{provider, model}`; the prompt has no path to the row. | `N` |
| G | **Actor fingerprint correct** — `sha256(owner)`, identical to `actorFingerprint()` in TypeScript. | `A`, `E` |
| H | **Mode correct** — the reflection audit's `reason` is `light` / `postmortem`, and it was wrong once. | `E` |
| I | **Append-only** — triggers refuse UPDATE, DELETE and TRUNCATE. | `A`, `G` |
| J | **Receipt only on real deletion** — an unmatched delete records nothing, so no one can manufacture a `memory.deleted` row for an id they do not own. | `F`, `A` |
| K | **A failed delete cannot create a receipt.** | `F` (see the correction below) |
| L | **A retry cannot duplicate a receipt** — exactly one, after failure + retry. | `F` |
| M | **Source / module correct** — every action is in the `yorisou.life.*` namespace, never the canonical `yorisou.exp.*` dictionary. | `N` |

### A correction this inventory owes its own readers

Two rounds of adversarial review were run against this document, and it did not survive them intact.
The findings are recorded because a document whose only claim to authority is "built by reading the
source" has to be checkable against the source, and twice it was not:

1. **Two of the seven transactional rows cited the wrong migration line**, and one of them pointed into
   code that `202608170001` explicitly DROPS — the superseded `yorisou_osf1_reflection_create`. A
   consistent off-by-one-row shift. Corrected above.
2. **Five of the nine asynchronous rows stated an `AUDIT REASON` the code does not write** — `upsert`
   for `user_edit`, `created` for `user_created`, "the visibility" for `private_draft`, and so on. An
   operator querying the trail by those values would have got zero rows. Corrected above.
3. **Six of the 52 assertions in `tests/life-os/audit-failure.sh` could not fail.** Every "no audit row
   exists after the failed attempt" check ran while the fault was ARMED, and while armed the trigger
   refuses every insert — so the absence was true by construction and could not distinguish a
   rolled-back mutation from a mutation that committed with no audit row. That is the entire
   distinction the harness exists to make. Fixed by moving each check to after the fault is disarmed
   and before the retry; `memory.confirmed` had no such check at all and now has one. The harness now
   reports **55** assertions, and the six are real.
4. **Invariant D's leak check inspected only `detail`.** `reason` is the other column a sentence could
   occupy. Both are inspected now.

The headline claim — all seven roll back — survived every round. The over-claims were in the
bookkeeping, which is exactly where a document like this fails.

## 4. The second channel: operational events

The audit trail records what a person did. It does not record that the system failed — an audit row
that was never written cannot describe its own absence. That is what
`lib/server/lifeOs/observability.ts` is for, and **three of its seven declared events had no producer
until this package**: `assistant.provider_failed`, `erasure.failed` and `moderation.anomaly` were in
the vocabulary, asserted by a test that only checked the list, and emitted by nothing.

`lib/server/__tests__/osf1Observability.test.ts` now requires every declared event to have a real
`recordLifeOsOps` call in a named file, so a declared-but-undeliverable signal fails a test.

**One scope limit, stated rather than implied.** `life_os.erasure.failed` is emitted from the
`database_erasure` stage only — the stage that removes the Life OS tables, which is the one this
package owns. Failures in `storage_erasure` and `identity_erasure` emit nothing through this channel;
they are POR-1 stages with their own job-audit trail (`yorisou_account_deletion_audit`), and widening
this event to cover them would be reaching into a subsystem outside this package. So "erasure failing
is detectable" means **Life OS erasure**, not every stage of account deletion.

That suite also found a **live redaction defect**: the error-class pattern was
`/^[a-z0-9_.:-]{1,64}$/i`, and **a JWT matches it** — letters, digits and dots inside 64 characters.
A service-role key or session token inside an `error.message` would have been written to the log in
full, by the one module whose purpose is that this cannot happen. Fixed: lowercase only, and no
opaque run longer than 24 characters, which also closes the all-lowercase hex-secret case.

## 5. The reasoning, kept

**Why deletion is transactional.** After a hard delete the row is gone; the audit event is the *only*
remaining evidence the memory existed or that the person asked for it to go. If the audit write drops,
the product cannot answer "did you delete my memory?" at all — and deletion is precisely the act a
person is most entitled to see proof of.

**Why confirmation is transactional.** `check (user_confirmed = true)` proves a row *was* confirmed,
but not when, by which flow, or from which candidate. If someone later disputes having agreed, the
audit row is the record of the agreement, and consent governance requires an event for *every*
consent-relevant mutation. Best-effort does not satisfy "every".

**Why reflection is transactional.** The mode is not recoverable from the row: an all-null postmortem
is indistinguishable from a light reflection. The audit row is the only place that fact lives.

**Why the edit is transactional.** An edit destroys the previous sentence, and afterwards nothing else
records that it was ever different — the deletion argument, one step short.

**Why the three permission changes are transactional.** Each changes what the product is *permitted*
to do with something the person told it. The record of a permission change must not be able to go
missing separately from the change.

**The cost, accepted deliberately.** A person can lose a reflection because the audit table was
unavailable. That trade-off was made in the completion package and it is the shipped behaviour. §10 of
the finalization package is the work that makes it survivable rather than merely correct: the text
stays on screen, the message says what happened without a status code, the retry is explicit, and
nothing retries on its own.

**One refinement the original specification did not anticipate:** the delete and update audits are
conditional on a row actually changing. Auditing an unmatched delete would let anyone manufacture a
`memory.deleted` record for an id they do not own, in a table from which nothing can be removed.

## 6. What may and may not be inferred

For the seven transactional actions the audit row and the mutation stand or fall together: the
presence of the row **is** evidence the mutation committed, and its absence **is** evidence it did
not. That is the property the class was built for.

For every asynchronous action the caveat holds in full — a dropped row is invisible, so **absence
proves nothing**. Any operator process or user-facing claim must keep the two apart.

---

## Version history

- **v1.0 (2026-08-14)** — decision recorded during the PR #134 design alignment review.
- **v1.1 (2026-08-15)** — implemented by `202608160001`; `memory.updated` added to the transactional set.
- **v2.1 (2026-08-17)** — adversarial review corrections: two migration line citations, five audit
  reasons, and the six vacuous harness assertions those citations were vouching for.
- **v2.0 (2026-08-17)** — rebuilt as the authoritative inventory from source. The three permission
  changes were already transactional in code and had never been listed here. Invariants A–M recorded
  with the harness that proves each. §4 added: three ops events had no producer, and the error-class
  pattern accepted a JWT.
