# OSF-1 — D-02 initial persistence scope (INTERNAL beta only)

**Status:** Founder-approved for the INTERNAL beta only · **Recorded:** 2026-08-18
**Authority:** Founder authorization in the hosted-activation package, item (C)
**Scope limit:** This record governs the Founder INTERNAL beta. It is **not** approval for PREVIEW,
for PUBLIC, or for Phase 2.

---

## 1. What this record is

D-02 asks which categories of a person's life the product may durably keep. The v0.7.0 decision
names five candidates — goals, explicit preferences, life events, decisions, reflections — under one
standing constraint:

> Do not default to maximum collection.

Phase 1 shipped six durable objects before that question was formally closed. The Founder has now
declared those six objects to **be** the D-02 initial scope for the INTERNAL beta. This document
records what that actually means field by field, so the scope is auditable rather than implied by
whatever the schema happens to contain.

The schema is the source of this table; it was read from hosted Production after the migration, not
transcribed from the migration files.

## 2. The approved scope, as it exists in the database

| Object | D-02 candidate | What is durably kept |
|---|---|---|
| `yorisou_goals` | goals | `title`, `description`, `status` |
| `yorisou_user_contexts` | explicit preferences | `language`, `region`, `timezone`, `preferences_json` |
| `yorisou_life_reflections` | reflections **and** decisions | the seven-question record (`what_happened`, `goal_at_the_time`, `information_at_hand`, `decision_made`, `why`, `what_followed`, `what_learned`, `next_time`), plus `felt`, `tried`, `options_considered`, `mode` |
| `yorisou_current_state_records` | life events (state at a moment) | `state_tags`, `mood`, `energy`, `situation`, `reflection`, `source` |
| `yorisou_explicit_memories` | — (a cross-cutting store, see §3) | `memory_type`, `content`, `source`, `user_confirmed`, `confirmation_digest`, `lifecycle_state`, and the three subject links |
| `yorisou_life_os_audit_events` | — (operational, not personal) | `actor_fingerprint`, `action`, `entity_kind`, `entity_ref`, `reason`, `detail` |

Every personal object carries `owner_account_id`. The audit table deliberately does **not**: it
carries `actor_fingerprint`, a sha256, so the audit trail survives account erasure while holding no
account identifier. That is verified in Gate 3 (`no raw account id was ever stored in the audit
table`) and again after the hosted migration.

## 3. Where the "do not default to maximum collection" constraint bites

`yorisou_explicit_memories` is the object that could quietly become maximum collection, because a
memory store is exactly the thing that grows by inference if nobody stops it. Three properties stop
it, and all three are schema-level rather than UI-level:

1. **Nothing is remembered without explicit confirmation.** `user_confirmed` plus
   `confirmation_digest` are constrained so an unconfirmed memory is impossible at the schema level.
   Gate 3 asserts this directly.
2. **There is no automatic memory threshold.** Nothing writes a memory because a topic recurred, a
   score crossed a line, or a model judged it important. Automatic thresholding is explicitly *not
   authorized* in the current package and does not exist in the code.
3. **Memories are reversible by the person.** `lifecycle_state` and `yorisou_osf1_memory_delete`
   exist so a memory can be retired or removed, not merely hidden.

## 4. What is deliberately NOT in scope

- **No inferred personality, diagnosis, scoring, or profile.** Nothing derives a persistent
  characterization of a person from their entries.
- **No automatic memory promotion** (see §3.2).
- **No cross-project synchronization.** Nothing here flows to Kakari, Mirai Move, or Asterion.
- **No Companion Core, Specialist Agents, Legacy, or broad Life Graph expansion.** These are named
  as unauthorized in the activation package and have no schema.
- **Retention is still `RETENTION_POLICY_TBD`.** Phase 1 deliberately did not implement retention,
  and this record does not create one. See [OSF1_AUDIT_RETENTION_DECISION.md](OSF1_AUDIT_RETENTION_DECISION.md).

## 5. Erasure

Every one of the five personal families is named in the account-erasure plan
(`yorisou_account_deletion_erase_database_unchecked`), verified against hosted Production after the
migration: 5 of 5 families present. The audit trail survives erasure by design and holds no account
identifier, which is the property that makes that survival acceptable.

## 6. What would require a new decision

Widening this scope — a new durable category, an automatic write path, a retention policy, any
export or sync beyond the person's own account, or exposure beyond INTERNAL — is a fresh Founder
decision, not an extension of this record.
