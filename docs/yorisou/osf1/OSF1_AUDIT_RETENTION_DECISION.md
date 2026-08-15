# OSF-1 — Audit retention decision brief

**Status: FOUNDER_DECISION_REQUIRED.** Prepared 2026-08-15. **Nothing is implemented.** The code
still carries `RETENTION_POLICY_TBD` and no expiry mechanism exists, deliberately.

**No legal minimum is asserted anywhere in this document.** Data & Privacy v1.0 §3.5 reserves
retention decisions to Edward with privacy review; this brief exists to make that decision cheap, not
to pre-empt it.

---

## 1. Why a decision is owed

Data & Privacy v1.0 §3.2: retention schedules are "explicit per entity … expiry is enforced, not
aspirational". `yorisou_life_os_audit_events` currently has **no schedule and no expiry**. That is a
live divergence from the corpus, held open on purpose rather than closed by invention.

## 2. The row shape, measured not guessed

From `202608150001`:

| Column | Type | Typical size |
|---|---|---|
| `id` | uuid | 16 B |
| `actor_fingerprint` | text, 64 hex chars | 65 B |
| `action` | text, `yorisou.life.<domain>.<verb>` | ~32 B |
| `entity_kind` | text, one of seven | ~12 B |
| `entity_ref` | uuid, nullable | 16 B |
| `reason` | text, ≤64, bounded by check | ~16 B |
| `detail` | jsonb, ≤2048 by check, in practice a few keys | ~60 B typical |
| `created_at` | timestamptz | 8 B |

≈ **225 B of column data**, plus ~24 B row header and alignment ≈ **250 B/row**. Two indexes
(`actor_fingerprint, created_at desc` and `action, created_at desc`) roughly **double** it in
practice. **Working figure: ~500 B per event, all-in.**

## 3. Event volume

Ten action types today. Per active user in a month, a realistic engaged pattern:

| Action | Est. events / active user / month |
|---|---|
| `state.created` | 20 (roughly daily check-in) |
| `state.annotated` | 5 |
| `reflection.created` | 8 |
| `goal.created` / `.status_changed` | 2 |
| `memory.confirmed` | 4 |
| `memory.suppressed` / `.restored` / `.revoked` / `.updated` | 1 |
| `memory.deleted` | 1 |
| `experience.created` / `.updated` | 3 |
| `assistant.drafted` / `.refused` | 6 |
| `context.updated` | 1 |
| **Total** | **≈ 50 events / active user / month** |

Deliberately an engaged-user figure. A quieter median would roughly halve it; using the higher number
means the estimate below errs toward over-provisioning rather than surprise.

## 4. Storage at scale

At ~500 B/event and ~50 events/MAU/month:

| MAU | Events / month | Growth / month | **12 months** | **24 months** | **60 months** |
|---|---|---|---|---|---|
| 1,000 | 50 k | 25 MB | **0.3 GB** | 0.6 GB | 1.5 GB |
| 10,000 | 500 k | 250 MB | **3 GB** | 6 GB | 15 GB |
| 100,000 | 5 M | 2.5 GB | **30 GB** | 60 GB | 150 GB |

**The honest conclusion: storage is not the constraint.** Even 100k MAU for five years is 150 GB —
unremarkable for managed PostgreSQL. Retention here is a **privacy and governance** decision, not a
cost one, and it should be argued on that basis. Query performance is likewise not a driver: both
indexes lead with a selective column.

## 5. What retention buys and costs

**Operational value** — highest in the first 7–30 days. Almost every "what happened to this person's
save" question is asked within days.

**Incident-response value** — the long tail. An access or integrity incident discovered late needs
history from *before* discovery, which is the only argument for months rather than weeks.

**Deletion receipts** — a genuinely different case. `memory.deleted` events are the receipt
(`yorisou_osf1_memory_receipts` reads them), and Memory Governance §3.2 requires the receipt to
exist. **Expiring these expires the receipt**, so their retention is a product commitment, not an ops
setting. This is the strongest argument for tiering.

**Privacy cost** — bounded but real. Rows hold no content and no account id, only a fingerprint. The
fingerprint is unsalted sha256 of the account id, so anyone holding both the table and a candidate id
can confirm a match. That is a correlation risk, not a disclosure one, and it does not decay.

**Interaction with account deletion** — the trace deliberately **survives** erasure, because it never
held an identifier. Retention is therefore the *only* mechanism that ever removes these rows.

## 6. Options

| | Window | Best argument | Cost |
|---|---|---|---|
| **SHORT** | 30–90 days | Minimises correlation risk; covers virtually all operational need | Late-discovered incidents unreconstructable; **deletion receipts vanish** |
| **MEDIUM** | 12 months | Covers a full annual cycle and late incidents | Receipts still expire; a year of correlatable fingerprints |
| **LONG** | 24+ months | Maximum forensic depth | Weakest privacy story; needs a stated justification the corpus does not currently supply |
| **TIERED** | by action class | Matches retention to why each event exists | One purge job with a class map; the only option needing per-class reasoning |

## 7. Recommendation

**TIERED, if a recommendation is wanted** — the evidence supports it and it is the only option that
does not force a bad trade:

- `memory.deleted` — **retain indefinitely or until the account is deleted.** It is a user-facing
  receipt the governance requires; expiring it silently breaks a promise.
- `memory.confirmed` / `.suppressed` / `.restored` / `.revoked` / `reflection.created` — **medium**
  (12 months). These are consent and permission records; a person disputing one is most likely to do
  so within a year.
- `state.*`, `goal.*`, `context.updated`, `experience.*`, `assistant.*` — **short** (90 days). Purely
  operational; self-evidencing rows already carry the fact.

This is a recommendation from technical evidence only. **Edward decides**, and until then the code
stays `RETENTION_POLICY_TBD` with no purge — which is the correct state, because a purge is precisely
the irreversible act that should not precede the decision.

## 8. Future Legacy implication, flagged not resolved

Life Continuity and Legacy Governance contemplates records outliving the person. If Legacy is ever
activated, "retain until account deletion" stops being a terminus. Any retention decision taken now
should be revisited then rather than assumed to carry over.
