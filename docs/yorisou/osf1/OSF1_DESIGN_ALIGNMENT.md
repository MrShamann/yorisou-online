# OSF-1 — Design Alignment Record

**PR:** [#134](https://github.com/MrShamann/yorisou-online/pull/134) · **Reviewed:** 2026-08-14 · **Status:** aligned; PR remains OPEN and unmerged

Five architectural decisions reviewed at Founder request. One required a code change; the rest
required a decision written down where it will be found.

---

## 1. Reflection structure — TWO MODES, both retained

**Required change, made.** A previous pass replaced the seven-question flow with a five-question one.
That was a mistake of category: it treated them as versions of the same thing.

| | LIGHT REFLECTION | DEEP POSTMORTEM |
|---|---|---|
| Questions | 5 | 7 |
| Asks | what happened · how it felt · what you tried · what followed · what you take forward | what happened · what you **wanted** · what you **knew** · what you **decided** and why · what followed · what you learned · what you would do next time |
| Purpose | keep the day before it blurs | separate the **decision** from the **outcome** |
| When | same day, no distance needed | deliberately, with distance |
| Entry | `/life/reflect` (default) | `/life/reflect?mode=postmortem` |

**Why both, and why neither can stand in for the other.** The light flow cannot separate a decision
from its result — it never asks what you knew at the time, so every outcome reads as a verdict on the
choice. That is the specific error a postmortem exists to prevent: telling a bad call from bad luck
requires knowing what information was available *before* the result arrived. Conversely, asking the
deep questions on a hard day gets one of two things: an abandoned flow, or a tidy story invented
after the fact, because reconstructing a past state of mind is real work.

**Storage.** Same table, same columns, no migration. `202608140001` created all eight answer columns
and `202608150002` added `felt` and `tried`; the light mode writes five, the postmortem writes seven.
The mode is not stored as a column — the audit event records which flow ran (`reason: light |
postmortem`), because an all-null postmortem and a light reflection are otherwise indistinguishable.

Defined in `lib/life-os/contract.ts` as `LIGHT_REFLECTION_QUESTIONS` and
`POSTMORTEM_REFLECTION_QUESTIONS`, selected by `reflectionQuestionsFor(mode)`.

Two consequences of the split were caught while verifying it, and both are fixed:

- `/life/reflect` metadata claimed "七つの問い" for every visitor. Metadata is static and cannot vary
  by mode, so it no longer names a number.
- signing in from the postmortem link dropped the mode and returned the person to the light flow
  without saying so. `next` now carries `?mode=postmortem` through the round trip.

## 2. Audit event reliability — classes decided, transactional NOT implemented

Full reasoning in **`OSF1_AUDIT_DELIVERY_CLASSES.md`**. In short:

**TRANSACTIONAL required** for memory deletion (after a hard delete the audit row is the *only*
evidence the memory existed), memory confirmation (it is a consent act, and consent governance
requires an audit event for *every* consent-relevant mutation), and reflection persistence. Life
Graph mutation is listed for completeness — **no Life Graph exists**, so there is no such event.

**ASYNCHRONOUS is correct** for context, state, goal and assistant events: each is self-evidencing
and none destroys anything.

**All ten are asynchronous today.** Making the four transactional means moving the audit insert
inside the mutation RPC — a signature change, a migration, its own Gate 3, and a product decision the
Founder must make: whether a person should lose a reflection because the audit table was
unavailable. Recorded, specified, not built. Until then the presence of an audit row is not proof,
and its absence is not proof of absence.

## 3. Audit retention — RETENTION_POLICY_TBD

**24 months is not assumed and is not the policy.** The annex proposes it and says plainly that
"Retention values are proposals pending Edward's retention approval"; retention schedules are among
the sole non-delegable Founder rights.

`RETENTION_POLICY_TBD` is written into the migration header **and into the table comment**, where an
operator reading the schema will meet it. The consequence is stated rather than left to inference:
rows currently have **no expiry**, the table grows without bound, and nothing removes a row.
Inventing a purge would be deciding the policy, so none exists.

## 4. Terminology — Timeline View ≠ Life Graph

**Verified; no unqualified claim exists anywhere in the repository.** Every occurrence of "Life
Graph" in code or docs is a negation — a statement that it is *not* built.

The distinction, stated once so it can be cited:

- A **Timeline View** *sorts records that already exist* by a timestamp they already carry, and
  stores nothing. It asserts no relationship.
- A **Life Graph** *asserts relationships* — edges, inferred links, "this reflection is about that
  goal". An assertion is a new claim about a person, and it must be stored, governed and erased.

`lib/server/lifeOs/timeline.ts` is the former. It creates no relationships table, writes nothing, and
a test fails if this package's migrations ever create a table whose name contains
`relationship|edge|graph|link`. The one link that appears — a reflection's `experience_id` — is a
foreign key **the person created** by choosing to reflect on an experience; it is not derived.

**No full Life Graph implementation is claimed, and none exists.**

## 5. Reflection Assistant — a bounded capability

**It is:** a bounded capability that reorganises text the person typed *in the same request*.

**It is NOT:** an autonomous Agent, the Companion Core, or a Specialist Agent. Specifically it has
none of the properties that would make it one:

| Property of an agent | Reflection Assistant |
|---|---|
| acts on its own initiative | **no** — runs only when the person presses 整理してもらう |
| persists state or memory between calls | **no** — holds nothing; every call is complete in itself |
| reads the person's stored records | **no** — reads no memory, reflection, goal or context |
| takes actions with side effects | **no** — writes nothing; returns a draft in the response |
| has goals of its own | **no** — one function, one output shape |
| output applied automatically | **no** — the person applies it explicitly, or discards it |

The read restriction is not a limitation worked around; it is what makes the capability buildable
today. Reflection governance requires any reference to a stored memory to pass an eligibility check
by a shared permission service, and that service (`use_permission` / `permissionCheckService`) does
**not exist** in this codebase. An assistant that read stored memories would have no governed read
gate to pass through — so it reads nothing, and the question does not arise.

Every provider response passes `assertAiOutputWithinBoundary` before it can reach a surface; a
violation discards the whole draft rather than editing it, and is audited as
`yorisou.life.assistant.refused`.

**Companion Core, Platform Orchestrator and Specialist Agents remain unactivated and untouched.**

---

## Version history

- **v1.0 (2026-08-14)** — design alignment review of PR #134.
