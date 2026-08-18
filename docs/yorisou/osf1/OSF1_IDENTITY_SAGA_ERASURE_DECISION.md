# OSF-1 — `yorisou_identity_provisioning_sagas` erasure decision

**Status: FOUNDER_DECISION_REQUIRED.** Prepared 2026-08-15 from schema and code, with the survival
behaviour proven against a disposable PostgreSQL 17 cluster. No law is invented here and no
irreversible change was made.

---

## 1. The proven fact

A provisioning saga row was created for `acct_saga`, a POR-1 deletion job opened, and
`yorisou_account_deletion_erase_database_unchecked` run to completion:

```
sagas rows before deletion: 1
erasure ran
sagas rows AFTER deletion:  1
account_id still readable:  acct_saga
```

**A direct account identifier survives account deletion.** The table is absent from `v_plan` in
`202608140002`, so nothing in the erasure path touches it.

## 2. What the table contains

From `202608010103_por1_canonical_identity_and_provisioning.sql`:

| Column | Nature |
|---|---|
| `provisioning_key` | sha256 digest, enforced by `yorisou_provisioning_key_digest_check` — pseudonymous |
| **`account_id`** | **direct account identifier — the personal data in question** |
| `owner_fingerprint`, `session_fingerprint` | sha256 — pseudonymous |
| `state`, `provisioning_cursor`, `contract_version` | lifecycle position |
| `attempt_count`, `failure_class`, `last_error_code` | retry/diagnostic |
| `executor_token_hash`, `executor_generation`, `executor_claimed_at`, `executor_expires_at` | executor lease — security material, not personal data |
| `requested_at`, `completed_at`, `updated_at` | timing |

Everything except `account_id` is already pseudonymous, a lifecycle marker, or a lease.

## 3. The nine questions, answered

**What is the security purpose?** Saga state for POR-1 account provisioning: it makes account
creation resumable and gives an incident review the record of how an account came to exist. The
executor lease columns prevent two workers claiming the same provisioning.

**Are there foreign keys?** **No.** Nothing in the migration lineage references the table. Deleting
a row cannot cascade or orphan anything.

**Are rows queried after successful provisioning?** **Not by the application.** The only references
outside migrations are two test files and `scripts/por1/promotion-plan.mjs`, an operator tool. No
runtime path reads it once provisioning has completed.

**Retry / recovery dependencies?** Only while a saga is in flight. A completed saga is a historical
record, not an input to anything.

**Is `account_id` needed after account deletion?** **No functional need is demonstrable.** Every
operational use — resume, lease, reconciliation — keys on `provisioning_key` or `owner_fingerprint`.
`account_id` is a convenience join to a row that, after erasure, no longer exists.

**What breaks if deleted?** The record that an account was ever provisioned. POR-1 incident review
has previously relied on saga history to reconstruct identity-provisioning incidents; that capability
is lost for deleted accounts.

**What breaks if pseudonymized?** Nothing identified. Lifecycle, timing, retry and lease information
all survive, and `owner_fingerprint` still correlates rows for the same (now-deleted) owner.

**What audit/security value remains after pseudonymization?** Effectively all of it. The questions an
operator asks — did provisioning succeed, how many attempts, which failure class, when — are answered
by the columns that remain.

**How long could rows technically be needed?** In flight: minutes to hours. For incident
reconstruction: the same window as any operational trace, which is exactly the unresolved retention
question in `OSF1_AUDIT_RETENTION_DECISION.md`. **No legal minimum is claimed.**

## 4. Options

### A. DELETE — register the table in the POR-1 erasure plan

- **Privacy:** strongest. Nothing survives.
- **Security:** neutral; no FK, no runtime dependency.
- **Recovery:** loses the record that a deleted account was ever provisioned. An incident spanning
  the deletion becomes harder to reconstruct.
- **Cost:** one line in `v_plan`, in a POR-1 migration.
- **Failure mode:** deleting an *in-flight* saga mid-provisioning. The plan runs under a deletion
  job, so this is unlikely but not impossible.

### B. PSEUDONYMIZE — null `account_id` at erasure, keep the row  ← **recommended**

- **Privacy:** removes the identifier, which is the entire defect. `owner_fingerprint` remains, and
  it is the same construction the OSF-1 audit table already relies on for exactly this trade-off.
- **Security:** unchanged.
- **Recovery:** fully preserved — every operational column survives.
- **Cost:** an `update … set account_id = null` step in the POR-1 erasure body; slightly more than A
  because the plan is currently a delete-only `v_plan` and would need an update-capable entry.
- **Failure mode:** if any future code joins on `account_id`, it silently stops matching for deleted
  accounts. Mitigated by there being no such code today.

### C. EXPLICIT RETENTION EXEMPTION — keep as-is, with a stated basis

- **Privacy:** worst. A direct identifier outlives deletion, which Data & Privacy v1.0 §3.2 (explicit,
  enforced retention) and §6 (deletion reconciliation) do not accommodate.
- **Security / recovery:** unchanged.
- **Cost:** zero code; requires a written, Edward-approved basis.
- **Failure mode:** the product cannot truthfully say deletion removes a person's identifiers.

## 5. Recommendation

**Option B.** It removes the only personal data at stake while preserving every operational property
the table exists for, and it resolves the tension the same way the OSF-1 audit table already does —
fingerprint, never identifier. Option A is defensible but discards real incident-review value for no
additional privacy gain over B. Option C requires a basis nobody has stated.

## 6. Why this package did not implement it

The table belongs to POR-1. Changing another subsystem's erasure semantics from inside a Life OS
package would be the scope creep the governance forbids, and it needs POR-1's own Gate 3. The
erasure-coverage guard's classification has been moved from a bare `UNRESOLVED` to
**FOUNDER_DECISION_REQUIRED** pointing at this document.
