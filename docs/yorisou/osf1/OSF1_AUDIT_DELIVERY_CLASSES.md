# OSF-1 — Audit Delivery Classes

**Package:** Phase 1 Life OS · **PR:** [#134](https://github.com/MrShamann/yorisou-online/pull/134) · **Decided:** 2026-08-14 · **Implemented:** 2026-08-15 · **Status:** the transactional class is **IMPLEMENTED** by `202608160001`

> **This document recorded a gap. The gap is now closed.** Four events are delivered transactionally,
> written inside their mutation's own RPC; the rest remain best-effort. The reasoning below is kept
> as written because it is the reasoning the decision rests on — only the status has moved.

---

## 1. The two classes

**ASYNCHRONOUS (best-effort).** The audit write is attempted after the mutation succeeds and its
failure is swallowed. If it fails, the mutation still stands and no trace exists. Correct when the
mutation is self-evidencing — the row itself is the record, and an operator investigating can read
it directly.

**TRANSACTIONAL.** The audit write happens inside the same database transaction as the mutation, so
either both land or neither does. Correct when the audit answers a question the surviving data
cannot: most importantly, *what used to be here*.

## 2. The decision

| Action | Required class | Why |
|---|---|---|
| `yorisou.life.memory.deleted` | **TRANSACTIONAL** | The strongest case. After a hard delete the row is gone; the audit event is the **only** remaining evidence the memory ever existed or that the person asked for it to go. If the audit write drops, the product cannot answer "did you delete my memory?" at all — and deletion is precisely the action a person is most entitled to see proof of. |
| `yorisou.life.memory.confirmed` | **TRANSACTIONAL** | The confirmation is a consent act. `check (user_confirmed = true)` proves a row was confirmed, but not *when*, by which flow, or from which candidate. If a person later disputes having agreed, the audit row is the record of the agreement. Consent governance requires an audit event for every consent-relevant mutation; best-effort does not satisfy "every". |
| `yorisou.life.reflection.created` | **TRANSACTIONAL** | Reflections are the longest-lived personal content the Life OS holds and the mode (light vs postmortem) is not recoverable from the row — an all-null postmortem is indistinguishable from a light reflection. The audit row is the only place that fact lives. |
| `yorisou.life.memory.updated` | **TRANSACTIONAL** | Added with the memory edit path. An edit destroys the previous sentence, and afterwards nothing else records that it was ever different — the same argument as deletion, one step short of it. |
| Life Graph mutation | **TRANSACTIONAL** *(no such event exists)* | Listed in the review for completeness. **There is no Life Graph and no relationships table**, so there is no such mutation and no event for it. Recorded here so the requirement is not lost if one is ever built: an asserted relationship is a claim about a person, and a claim needs a record of who made it and when. |
| `yorisou.life.context.updated` | asynchronous | The row holds the current values; the previous ones were preferences, not content. |
| `yorisou.life.state.created` / `.annotated` | asynchronous | Self-evidencing: the record is the evidence, and nothing is destroyed. |
| `yorisou.life.goal.created` / `.status_changed` | asynchronous | The goal row carries its own status and `updated_at`. A lost audit row loses history, not the fact. |
| `yorisou.life.assistant.drafted` / `.refused` | asynchronous | Operational telemetry about a capability, not about a person's data. Note the asymmetry: `.refused` is the one an incident review would most want, so its loss is a real cost — but it gates nothing and destroys nothing. |

Declared in code as `AUDIT_DELIVERY_CLASS` in `lib/server/lifeOs/audit.ts`, so the four are
enumerable from the source rather than only from this document.

## 3. How it was implemented, and what it cost

It is a schema change, not a wiring change. The audit write currently happens over PostgREST from the
application, *after* the mutation RPC returns — two round trips, two transactions. Making it
transactional means the audit insert must move **inside** the `SECURITY DEFINER` RPC that performs
the mutation, so it commits or rolls back with it. That means:

- changing the signatures of `yorisou_osf1_memory_confirm`, `yorisou_osf1_memory_delete` and
  `yorisou_osf1_reflection_create` to accept the audit fields;
- deciding what happens when the audit insert fails inside the transaction — almost certainly *abort
  the mutation*, which reverses the current trade-off and means a person can lose a reflection
  because the audit table is unavailable. That reversal is a product decision, not an implementation
  detail, and it needs the Founder;
- a migration, and therefore its own Gate 3.

**All of that was done** by `202608160001_osf1_phase1_completion.sql`, in ONE migration — PostgreSQL
overloads by signature and the grants are hardcoded signature strings, so a split would have left the
old overloads alive, un-granted and audit-less, reachable by PostgREST.

The Founder decision the second bullet asked for was made in the completion package, in the direction
this document predicted: **the mutation aborts.** A person can lose a reflection because the audit
table was unavailable. That is now the shipped behaviour, and the PostgreSQL harness proves it — a
trigger forces the audit insert to raise and the harness asserts no row survives, with a control
showing the same call persists when the audit table works.

One refinement the specification did not anticipate: the delete audit is **conditional on a row
actually being removed**. Auditing an unmatched delete would let anyone manufacture a
`memory.deleted` record for an id they do not own, in a table from which nothing can be removed.

## 4. What may and may not be inferred now

For the four transactional actions, the audit row and the mutation stand or fall together: the
presence of the row IS evidence the mutation committed, and its absence IS evidence the mutation did
not. That is the property the class was built for.

For every asynchronous action the old caveat still holds in full — a dropped row is invisible, so
absence proves nothing. Any operator process or user-facing claim must keep the two classes apart.
`AUDIT_DELIVERY_CLASS` in `lib/server/lifeOs/audit.ts` is the machine-readable answer to which is
which, and `auditLifeOs()` throws if handed a transactional action, so the two paths cannot be
confused at a call site.

---

## Version history

- **v1.0 (2026-08-14)** — decision recorded during the PR #134 design alignment review.
- **v1.1 (2026-08-15)** — implemented by `202608160001`; `memory.updated` added to the transactional
  set; status and §3/§4 updated to describe what was built rather than what was proposed.
