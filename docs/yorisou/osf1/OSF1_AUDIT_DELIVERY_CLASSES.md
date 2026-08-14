# OSF-1 — Audit Delivery Classes

**Package:** Phase 1 Life OS · **PR:** [#134](https://github.com/MrShamann/yorisou-online/pull/134) · **Decided:** 2026-08-14 · **Status:** decision recorded; the transactional class is **NOT IMPLEMENTED**

> **Every Life OS audit event is delivered asynchronously today.** Four of them should not be. This
> document names which, says why, and states what implementing the transactional class would take —
> so the gap is enumerable rather than remembered.

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
| Life Graph mutation | **TRANSACTIONAL** *(no such event exists)* | Listed in the review for completeness. **There is no Life Graph and no relationships table**, so there is no such mutation and no event for it. Recorded here so the requirement is not lost if one is ever built: an asserted relationship is a claim about a person, and a claim needs a record of who made it and when. |
| `yorisou.life.context.updated` | asynchronous | The row holds the current values; the previous ones were preferences, not content. |
| `yorisou.life.state.created` / `.annotated` | asynchronous | Self-evidencing: the record is the evidence, and nothing is destroyed. |
| `yorisou.life.goal.created` / `.status_changed` | asynchronous | The goal row carries its own status and `updated_at`. A lost audit row loses history, not the fact. |
| `yorisou.life.assistant.drafted` / `.refused` | asynchronous | Operational telemetry about a capability, not about a person's data. Note the asymmetry: `.refused` is the one an incident review would most want, so its loss is a real cost — but it gates nothing and destroys nothing. |

Declared in code as `AUDIT_DELIVERY_CLASS` in `lib/server/lifeOs/audit.ts`, so the four are
enumerable from the source rather than only from this document.

## 3. Why the transactional class is not implemented here

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

This review permits no implementation beyond what it requires. So: **decision recorded, mechanism
specified, not built.**

## 4. What must not be inferred in the meantime

Until the transactional class exists, the presence of an audit row is **not proof** the mutation
happened, and its absence is **not proof** the mutation did not. Any operator process, incident
review, or user-facing claim built on these rows must carry that caveat. In particular, the product
must not tell a person "we have no record of that deletion, so it did not happen".

---

## Version history

- **v1.0 (2026-08-14)** — decision recorded during the PR #134 design alignment review.
