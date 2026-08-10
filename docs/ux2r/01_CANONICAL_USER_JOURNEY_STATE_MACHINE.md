# CPC-1 · 01 — Canonical User Journey State Machine

> **FROZEN.** Derived from current repository truth (branch `feat/ux2-integrated-core-experience`,
> Preview migrations 202607270001–202607270004). Implementation may not re-decide these semantics
> ad hoc; changing them requires an explicit Founder decision.

## 1. Attempt lifecycle

```
(none)
  └─ start ────────────────► IN_PROGRESS (anonymous, claim_token_hash set, expires_at = +72h)
                                │
                                ├─ save progress (expiry enforced) ──► IN_PROGRESS
                                ├─ abandon(user_restarted) ─────────► ABANDONED (answers erased, token dead)
                                ├─ expire (expires_at ≤ now) ───────► unreadable / unwritable
                                └─ complete (coverage == required) ─► COMPLETED ──► creates RESULT
```

**Invariants (DB-enforced):** `answered_count = jsonb key count`; `answered_count ≤ required_count`;
`status='completed'` ⇒ full coverage; anonymous writes AND reads require `expires_at > now()`;
ABANDONED is never resumable, writable, completable or claimable.

## 2. Ownership

```
ANONYMOUS  (owner_account_id NULL, proven by sha256(claim token) in an httpOnly cookie)
   └─ claim (authenticated) ─► CLAIMED (owner set, token spent, expiry cleared)
```

Claim is **single-use**, **expiry-checked**, **idempotent for the same owner**, and can never
re-target an attempt that already has a different owner.

## 3. Interpretation state

```
UNANSWERED ──┬─ confirm ──► CONFIRMED
             ├─ correct ──► CORRECTED
             ├─ reject  ──► REJECTED
             └─ defer   ──► DEFERRED
```

Responses are **append-only**; a later response **supersedes** an earlier one without deleting it.
Supersession may never cross results.

| state | acceptedResultId | recommendation | continuity |
|---|---|---|---|
| UNANSWERED | `null` | denied | denied |
| CONFIRMED | original `result_id` | permitted | permitted |
| CORRECTED | bounded `corrected_result_id` | permitted | permitted |
| REJECTED | `null` | denied | denied |
| DEFERRED | `null` | denied | denied |

**Silence is not consent. "Later" is not consent.** Only CONFIRMED and CORRECTED create accepted
understanding.

## 4. Erasure (terminal)

```
LIVE result ── erase(owner-scoped) ──► TOMBSTONE
```

After erasure: `result_id`, `original_result_id`, `overlay_id`, `owner_account_id`,
`scoring_version`, `result_schema_version` = **NULL**; `dimension_output` = `{}`; all interpretation
responses **deleted**; attempt answers `{}`, token dead, status ABANDONED.
Retained: opaque row id, opaque attempt id, `method_id`/`method_version`, `produced_at`,
`deleted_at`. A tombstone **cannot receive new responses** and is excluded from every owner listing.

## 5. Channel rule

Web and LINE traverse **exactly this machine** through the same backend contracts. No channel has a
private completion, result identity or storage path.
