# POR-1 — the local JSON store's consistency model

Per-file serialization stops lost updates **within** one file. It does not make an operation that
touches two files transactional. This records what each multi-file operation actually guarantees,
because the difference between "both files were written" and "the API said success" is where an
identity bug hides.

Scope: `lib/server/yorisouData.ts`'s local adapter — **local and test only**. The hosted path uses a
different store with its own concurrency mechanism, and nothing here describes it.

## The measured starting point

Every mutating function in the adapter was mapped to the store files it writes:

```
no function mutates more than ONE store file
```

So there are no multi-file critical sections inside the adapter. The cross-file operations live one
level up, in the callers — which is why an ordered multi-file lock helper would have been
speculative. What these operations need is a declared model and a failure test, not a lock they
would not take.

## The operations

### 1. Registration — accounts, then sessions

`lib/server/identityProvisioning.ts`: `createAccount` (accounts file), then
`insertSessionRecordIfAbsent` → `bindSessionToUser` → `switchSessionToPrincipalLandingTruthWithProof`
(sessions file).

```
classification: SAGA_COMPENSATED (reported, not silently completed)
authoritative:  the account
success point:  the landing contract is applied AND proven persisted
```

The important property is negative: **the API does not report success when session binding fails.**
Each stage returns a typed `failureClass` / `detail` — `session_insert_failed`, `bind_returned_null`,
`session_landing_missing`, `session_not_stored`, `session_account_link_missing` — and the caller
answers a failure. An account may exist without a bound session; a caller that retries registration
converges, because `createAccount` is uniqueness-checked and `insertSessionRecordIfAbsent` keeps the
existing row.

This is exactly what YV-C7 exercised. The write-proof reported `session_not_stored` truthfully; the
defect was that the row really had been erased by a concurrent whole-file write, not that the
reporting was wrong.

An orphaned account with no session is a governed resumable state, not a silent success.

### 2. LINE event, then recent-subject index

`createLineWebhookEvent` writes the event file, then `updateRecentLineWebhookSubjectIndex` writes the
recent-subjects file.

```
classification: DERIVED_SECONDARY_INDEX
authoritative:  the event file (it IS the redelivery idempotency record)
derived:        recent subjects — rebuildable from events
```

The order is deliberate and must not be reversed: the authoritative idempotency record is durable
before anything derived from it. If the derived write fails, the event is still recorded exactly
once and redelivery is still rejected; the index is stale until the next event for that subject
repairs it.

### 3. Account deletion — the durable job is the authority

`lib/server/accountIdentityDeletion.ts` works from the FROZEN MANIFEST captured before the
irreversible boundary, not from whatever the stores currently hold.

```
classification: IDEMPOTENT_RECONCILABLE
authoritative:  the durable deletion job + its frozen manifest
```

This is why deletion needs no cross-file transaction: a partially completed pass resumes from the
execution cursor against the manifest, and re-running an erase that already happened is a no-op.
Security favours denial — a stale session is refused by the deletion-status authority even if its
row survived a failed pass.

### 4. Password reset — consume, then mutate the credential

```
classification: ATOMIC_REQUIRED at the token; SAGA at the credential
authoritative:  the token's single-use consumption
```

Consumption is one file critical section, so exactly one consumer wins. If the credential mutation
then fails, the token is already spent — the user must request a new one. That is the correct
direction to fail: a spent token that changed nothing is recoverable, a reusable token is not.

## What is NOT claimed

- **No ACID across files.** Atomic rename gives per-file atomic replacement and nothing more. A
  crash between two files leaves the first written and the second not.
- **No cross-process locking.** The queues are in-process. Two application processes against one
  local store root are unsupported.
- **No durability claim beyond rename.** No `fsync` is issued; this is a test/local adapter.

## Lock ordering, if a multi-file critical section is ever added

None exists today. If one is introduced, acquire in this order to prevent inversion:

```
accounts → sessions → password reset tokens → line events → recent subjects → consultations
```

Alphabetical-by-canonical-path is the fallback rule for any file not listed.
