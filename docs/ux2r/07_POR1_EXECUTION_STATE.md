# POR-1 — Execution State (durable)

> Resume point for `YORISOU_POR1_TERMINAL_EXECUTION_CONTRACT`.
> Read this and `06_POR1_MIGRATION_PROMOTION_ARCHAEOLOGY.md`. Do **not** repeat completed archaeology.

## Active package — YORISOU_POR1_TERMINAL_EXECUTION_CONTRACT (Founder, 2026-07-31)

One integrated release train. It **supersedes every earlier POR-1 continuation prompt**, including
the `next_action` this file carried before 2026-07-31 and the `next_package` recorded in the lock's
2026-07-30 release block. It terminates only at
`YORISOU_POR1_PRODUCTION_OPERATIONAL_AND_VERIFIED` or a proven
`YORISOU_POR1_GENUINE_EXTERNAL_BLOCKER`; a context boundary is a continuation, not a new package,
and does not require re-authorization.

Workstreams (internal units of ONE package, not separate approvals):

```
A truth reconciliation + this ledger          H Production promotion migrations
B canonical LINE activity model               I Production-equivalent rehearsal
C atomic truthful registration provisioning   J PR #126 truth + exact-head merge
D identity mutation graph re-audit            K Production release order + activation
E local proofs + five-green CI                L Production terminal acceptance + cleanup
F exact-SHA hosted Preview acceptance         M observability, rollback, closeout
G Preview cleanup + Production store audit
```

## Position — verified at package start, 2026-07-31

```
Branch      : feat/ux2-integrated-core-experience
PR          : #126 OPEN / DRAFT / UNMERGED / MERGEABLE, base main @ c8d8a8ad
HEAD        : b85caaf698eb538f83545151069d435b2c093c14 — local == origin == PR head
Working tree: 0 tracked modifications; 2 pre-existing untracked docs, classified NOT POR-1
CI at HEAD  : five workflows SUCCESS, read at b85caaf, not inherited
              Migration Scope Guard 30556141681 · Yorisou Check 30556141693
              CPV1-CM0 CI 30556141673 · YV-1 CI 30556141451 · DCI-1 CI 30556141468
Production  : main @ c8d8a8ad — UNTOUCHED. 42 public tables, 12 Production-lineage migrations,
              0 POR-1 canonical objects, no POR-1 deployment, no POR-1 activation.
Preview DB  : yorisou-preview (nbltsbonsnbpfptihomc)
Migrations  : PRODUCTION_LINEAGE 12 · LOCAL_ONLY 4 · PREVIEW_ONLY 16 (32 total, validator green)
              (…300002 namespace · 300003 lifecycle · 300004 fence · 300005 resume engine, applied)
Preview SHA : f6f50a6 was the last HOSTED-tested deployment. b85caaf is CI-green but has NOT been
              hosted-tested. Do NOT inherit an exact-SHA hosted claim from f6f50a6.
Status      : POR-1 in execution. No merge, no Production migration, no Production deployment.
```

## Superseded statements — corrected, not deleted

These were true when written and are false now. They are listed because an earlier reader acting on
any one of them would do harm.

| Stale statement | Correction |
| --- | --- |
| `202607300005` is not implemented | Implemented, applied to Preview, verified there — see the section below |
| the execution cursor is not authoritative | It is authoritative and means exactly one thing: the next stage that must execute |
| the mutation fence is only structurally present | Complete and runtime-unforgeable (module-private `WeakSet`), 11 DB scenarios pass |
| remote CI still needs checking | Read at `b85caaf`; five green, run ids above |
| the next fix is to reorder the two writes in `establishLineActivity` | **Explicitly forbidden.** That treats a symptom. The array is replaced — WS-B |
| the LINE index failure is a test-observability problem | Wrong, and wrong in the dangerous direction. It is a lost-update data-model defect — WS-B |
| increase the retry window / add retries | Forbidden as a final repair (contract §21) |

## Open defects carried into this package

1. **The shared LINE recent-subject array (WS-B).** `phase1/line-events/admin-recent-subjects.json`
   is ONE cross-user mutable JSON array updated by read-modify-write on a transport with no
   read-after-write consistency. Measured visibility lag on this key is a distribution — 4.5s, 5.4s,
   11s on three probes; reproduced outside Playwright as invisible for ten consecutive 1s reads,
   then present at read 11. Two concurrent writers can each read a stale document and each write
   back one missing the other's entry. It is also unusable as deletion evidence: absence in a stale
   read is indistinguishable from erasure. `pruneRecentLineWebhookSubjects` re-reading until
   provably absent and throwing `recent_line_subject_prune_unconfirmed` is containment, not repair.
2. **Registration returns 200 over a failed canonical write (WS-C).** `app/api/auth/register/route.ts`
   catches the foundation-sync error, logs it, and still returns success. The 2026-07-30 session
   fixed the transport *underneath* it but not the swallow. A 200 that does not mean the canonical
   identity exists is a capability-honesty violation.
3. **Registration latency (WS-C).** Isolated Preview went ~7s → ~11–14s once the foundation
   transport was repaired, because the canonical mirror is now actually written. One transient 500
   was observed, followed by three 200s. The route's duration ceiling must be checked before
   Production activation — and the fix is to remove real duplicated work, never to make canonical
   completion best-effort.
4. **Production identity-store audit never run (WS-G).** No AWS credentials exist locally or in
   Preview (both present-but-empty). Production holds real ones. It must be run from the Production
   runtime through a permanent narrow operator mechanism — its absence locally is not a blocker.

## Completed gates

**G1 — governance preflight.** Workspace, repo, branch, HEADs, PR state, lock re-verified. Writer
lock held by this session and released at each boundary.

**G2 — schema deconfliction (CTO-approved architecture).** The CPC-1 recommendation family moved to
`yorisou_canonical_recommendation_{sets,items,actions}`; the legacy family is untouched and keeps
serving the legacy graph with its real Production rows.

- `202607300002_por1_canonical_recommendation_namespace.sql` — **forward-only**, no applied
  migration amended, so Preview checksums stay stable. Guards the expected CPC-1 shape and aborts
  loudly on a legacy or mixed schema; renames tables, constraints and indexes; recreates the four
  affected functions against the canonical tables; drops the superseded RPC names; verifies its own
  post-condition. Function bodies were read back with `pg_get_functiondef` and mechanically
  re-pointed, so the accumulated semantics of `202607280004..07` survive exactly.
- Applied to Preview. Verified: canonical tables and RPCs only; no pre-rename object survives;
  `yorisou_assessment_result_erase` now clears canonical rows and holds no legacy reference.
- Consumers repointed: `lib/server/recommendationStore.ts`, `tests/cpc1-acceptance/fixtures.ts`,
  `scripts/ux2/preview-cleanup.sql`.
- **Permanent CI guard** `npm run test:por1-namespace` (6 properties): canonical adapter must not
  touch legacy tables; legacy adapter must not touch canonical tables; no file may address both
  families; no bare `create table if not exists` on a canonical name in any migration; no migration
  after the rename may perform DDL on the pre-rename names; no migration before it may reference
  canonical names (i.e. history was not rewritten).

**G3 — account-deletion saga and database executor.** `202607300003_por1_account_deletion_lifecycle.sql`,
applied to Preview and smoke-tested end to end.

- Durable saga `yorisou_account_deletion_jobs`: `requested → identity_verified → locked →
  database_erasure → storage_erasure → identity_erasure → verifying → completed`, plus
  `failed_retryable`, `failed_terminal`, `cancelled`, `legal_hold`. Guarded transitions; cancellation
  impossible once erasure has begun; resumable after a process restart.
- Declarative delete plan behind a `to_regclass` guard so the same executor is correct in Preview
  (subset) and Production (26 identity-linked tables), recording *absent* rather than pretending to
  erase. Covers **both** recommendation families.
- Results erased through the owner-scoped contract (content-free tombstone retained); attempts, which
  hold raw answers, removed outright; parent-reachable child rows handled explicitly.
- `finalize` re-verifies every scoped table and refuses to complete on residue; only a clean
  verification drops the raw account id for a one-way fingerprint. Audit is content-free by
  construction with a hard size ceiling.
- Smoke proof: idempotent open · illegal jump to `completed` rejected · full progression · verified
  finalize · id dropped · 9 audit rows · status still resolvable by fingerprint. Smoke row removed.

**G4 — account-deletion application layer (WS1-WS5) and runtime controls (WS6), with WS7 tests.**

- `lib/server/accountDeletionOrchestrator.ts` drives the saga and is resumable: every step is either
  idempotent or rejected by the database state machine, so a crashed run is recoverable rather than
  a permanently half-deleted account.
- `lib/server/accountIdentityDeletion.ts` + `lib/server/identityKeyScope.ts` — the narrow adapter.
  Five allowlisted identity families; traversal and empty segments refused; a person's CONTENT is
  out of scope and is erased only by the database saga. No arbitrary path deletion, no generic
  bucket admin, no secret-gated route.
- Four API routes (`deletion-request` / `-confirm` / `-status` / `-cancel`). `-confirm` is the
  irreversible boundary: session-resolved account only, unexpected body fields rejected, typed
  `削除します` confirmation, password reauthentication, capability-gated, cookies cleared on
  completion. It is retry-safe — a confirm after `failed_retryable` resumes rather than re-running
  the opening transition, which the state machine would have classified as terminal.
- `app/private-state/AccountDeletionPanel.tsx` — the authenticated UI. States: idle, disclosure,
  processing (polled, survives a closed tab), completed, retryable failure, terminal failure. It
  never renders a failure as success.
- WS5 lock/session semantics, `lib/server/accountDeletionLock.ts`. Two real defects closed:
  (a) the session cookie is self-contained and `getViewerContext` fabricates a synthetic session
  from it, so deleting session objects did **not** end a session — a held account now resolves as
  absent; (b) `/api/auth/login` falls back to the `yorisou_account` cookie when the store misses,
  which would have let an erased account log back in — the durable job now distinguishes an erasure
  from a store blip, and that path fails closed. LINE login obeys the same hold. Status and cancel
  use a deliberately lock-tolerant resolver, because blinding someone to their own in-flight
  deletion is not a safety property.
- **Defect found and corrected against the applied migration:** the application listed `locked` as
  cancellable while the database allows `cancelled` only from `requested` / `identity_verified`.
  That combination would have shown a cancel button whose RPC always throws and released the hold on
  an account whose job was still live. The application now mirrors the database.
- WS6 controls wired at every canonical entry point via `canonicalRowIdWhenEnabled`: with a control
  unset the row id is dropped and the pre-existing legacy branch runs, which is what makes flag-off
  equivalent to today's Production rather than a new refusal screen.
- WS7 permanent tests: `npm run test:por1-controls` (5), `npm run test:por1-deletion` (12),
  `npm run test:por1-namespace` (6).
- **`npm run gate:por1-flag-off-baseline`** — FLAG_OFF_BASELINE_EQUIVALENCE, 12 source-level checks.
  Scope is stated in the script: it proves nothing new is *reachable* with the controls unset; it
  does **not** prove rendered-output equivalence. That claim belongs to the hosted exact-SHA run.
  Both failure modes were exercised deliberately (helper imported but not called; capability
  mis-assigned) and the gate rejects each.

## Preview identity isolation — REPAIRED (CTO decision, not a Founder decision)

The earlier classification of this as a Founder decision was wrong and was corrected by the CTO.
The scope architecture was already authorized; only the engineering remained.

**What was wrong.** The isolated Preview store was configured as a BRANCH-SCOPED Vercel variable
set. Every other Preview branch inherited a Preview-wide default naming the Production bucket with
no endpoint, which `resolveSharedStoreMode` maps to plain AWS S3. Preview wrote account identities
there while its assessment records went to the isolated Preview database. Nothing failed.

**What was done.**

1. Branch-scoped isolated store configured for `feat/ux2-integrated-core-experience`.
2. `lib/server/sharedStoreBoundary.ts` — the boundary as a property of the code, asserted at module
   initialization so it throws before the first identity write. 13 permanent tests
   (`npm run test:por1-boundary`), the first of which is the exact configuration that shipped.
3. `/api/build-identity` attests `sharedStoreMode` / `sharedStoreBoundary` / `sharedStoreProjectMatch`
   — bounded, non-secret. The acceptance identity gate reads it BEFORE registering anyone.
4. Preview-wide default replaced with the isolated store. All three Preview scopes now verified:
   `(default)`, `feat/ux2-integrated-core-experience`, `feat/mpv-1-isolated-hosted-preview` →
   `yorisou-preview-auth`. Production and Development scopes untouched.
5. `npm run audit:por1-preview-env-isolation` — operator-runnable matrix audit. Bucket and endpoint
   are now stored readable (they are infrastructure identifiers, not secrets) so the audit can
   actually check them; an encrypted one is a FAILURE, not a note. The first version of this script
   passed on exactly the two scopes that mattered — corrected before commit.

**Proof, at deployment `8b7c323`:** attestation `isolated-preview`, project match true. Register →
account/email/session objects appear in `yorisou-preview-auth`; governed deletion → all gone;
re-login 401. A branch with NO override resolves to the isolated store (verified by resolving the
effective variable set, which is the same mechanism a deployment uses — Vercel did not auto-deploy
the throwaway branch, so this is a configuration-resolution proof, not a running-deployment one).

**Defects the repair made visible** (each existed before; the production bucket was simply never
observable):

- Session revocation, target enumeration and erasure verification all matched sessions on `userId`
  alone, while CPV1 moved session identity into the principal-landing contract. A live session
  naming a deleted person survived every deletion. Fixed in all three; the orphan left by the
  pre-fix probe was removed through the adapter by ACCOUNT ID, verified idempotent.
- Verification trusted the object listing, which is not immediately consistent. Candidates are now
  confirmed by key.
- The durable failure recorded only `identity_residue` with no family, costing a deploy-and-rerun
  cycle per diagnosis. It now records the families.

## Erasure correctness — three CTO findings fixed, one defect isolated

**Fixed at `9847559`, each confirmed against repository truth before changing anything:**

- **The LINE lookup was never deleted.** The store writes `accounts/by-line-user/<sha256(lineUserId)>`;
  deletion built `accounts/by-line/<raw lineUserId>`. Erasing a LINE-bound account left the real
  index — a live login route to a deleted person — and put a RAW LINE id in an object key. The
  allowlist named the same fiction. No acceptance identity had ever been LINE-bound, so nothing
  caught it.
- **The retry re-locked, and the lock is an UPSERT.** `executeDeletion` treated `failed_retryable`
  exactly like `identity_verified`, so a retry re-ran `setAccountDeletionLock` — a read-modify-upsert
  that rewrites the account record and its email index from a stale copy. Past the irreversible
  boundary that resurrects what was just deleted. Retries now resume without re-locking.
- **Existence could not fail safely.** `sharedIdentityObjectExists` caught every error and answered
  `false`, so a timeout, 403, 429, 5xx or malformed response all read as "gone" — the one wrong
  answer that lets a deletion finalize over data it never removed. `false` now means proven absent;
  anything undetermined throws.

**Hypothesis REJECTED:** `ensureSharedStoreReady()` cannot re-seed in `supabase-rest` mode —
`getSharedStoreClient()` returns null and `migrateLegacyFilesToSharedStore()` returns immediately.

### The mutation fence — implemented (CTO ruling: a pre-write check is TOCTOU-vulnerable)

A check before the write only moves the race — read state, deletion happens, write the stale copy.
So the database is now the serialization point, under row locks.

**`202607300004_por1_account_mutation_fence.sql`** — forward-only, PREVIEW_ONLY, applied to Preview
and registered in the scope manifest (31 migrations, validator green). Adds:

- `execution_cursor`, `irreversible_started_at`, `mutation_gate_closed_at` on the deletion job.
  `failed_retryable` alone could not say WHERE a run failed, which is what let a retry walk back
  through a stage that writes identity. Irreversibility is now a durable fact, not a state-string
  inference.
- `yorisou_account_mutation_gates` — one per account, `open → draining → closed → completed`, with a
  GENERATION so a lease issued microseconds before a close cannot authorise a write after it.
- `yorisou_account_mutation_leases` — bounded, content-free, closed enum of operation codes.
- RPCs: `mutation_begin` / `mutation_release` / `close_mutation_gate` / `mutation_gate_status` /
  `mark_cursor` / `gate_finalize`. RLS enabled and forced, service_role SELECT only, writes only
  through the functions.
- **Execution grace of 180s** before an unreleased lease is abandoned — three times the 60s route
  ceiling. Expiry alone is not proof that no write can still land; the process may still be running.

**Application side.** `lib/server/accountMutationLease.ts` wraps it. `withAccountMutationLease`
takes the lease BEFORE the read, deliberately: taking it just before the write leaves exactly the
window this closes. It fails CLOSED — if the fence cannot be consulted, "we could not check" must
never read as "go ahead".

**Wired:** `updateAccountPassword`, `updateSupportProfile`, `bindLineIdentity` (all three are
read-modify-write, now leased end to end) and the `restoreAccountFromCookie` write in
`yorisouAuth` — that one is a ready-made resurrection without a lease, since a browser holding a
stale account cookie could write it back after an erasure.

**Deletion executor:** `identity_verified → close gate → drain → locked → lock marker → erase`.
When leases are still outstanding it returns retryable WITHOUT erasing anything, and the cursor
records that erasure never began. At completion the gate stops naming a person, like the job.

Verified locally: tsc 0 · build ok · ESLint 0 errors · por1-deletion 17/17 · por1-boundary 13/13 ·
migration scope 31/31.

### CORRECTION — remote CI at `36eb903` was NOT green

I reported five green workflows. Verified at that HEAD:

```
success  Migration Scope Guard · Yorisou Check · CPV1-CM0 CI
failure  YV-1 CI · DCI-1 CI
```

Both failed in the authenticated full-stack harness with
`AccountMutationDenied: account_mutation_unavailable` — the fence RPCs live in a Preview-only
migration and the current Production-lineage CI databases do not have them, so login failed and
downstream 422s became 401s. I had carried the status forward instead of checking it at my own HEAD.

### Rollout compatibility — schema readiness is NOT activation

`lib/server/accountMutationFenceRollout.ts` (pure, tested directly):

```
ready=false, executor=off → legacy_no_schema  (exact previous behaviour, NO RPC attempted)
ready=false, executor=on  → fail_closed       (deletion can run, fence cannot — refuse the write)
ready=true,  executor=off → fenced            (kill-switching DELETION must not reopen writes)
ready=true,  executor=on  → fenced
```

Readiness is `YORISOU_POR1_ACCOUNT_MUTATION_FENCE_SCHEMA_READY` — a deployment FACT, never inferred
from a runtime error. A missing RPC, schema-cache miss, timeout or 5xx is not evidence of an old
schema, so none of them grants permission to write. Set to `on` for the POR-1 Preview branch, which
has `202607300004` applied; absent everywhere else, which is what restores YV-1 and DCI-1 without
softening the fence. Deliberately NOT a fifth capability — infrastructure readiness, so it stays out
of the four controls and the flag-off baseline gate.

4 permanent tests (`npm run test:por1-fence`).

### CI at `43186db` — five green, verified at that exact HEAD

The readiness contract did restore the two suites the fence had broken. Confirmed by querying the
runs at the SHA rather than by carrying a status forward:

```
success  Migration Scope Guard · Yorisou Check · CPV1-CM0 CI · YV-1 CI · DCI-1 CI
```

The earlier correction above stands as the record of how that went wrong the first time; the rule it
produced — read the status at your own HEAD, never inherit it — is the reason this line can be
written at all.

## `202607300005` — the deletion resume engine

The three items below were the outstanding blockers. All three are now implemented and proven; what
remains outstanding is the HOSTED run, which is a different claim and is stated as such at the end.

### 1. The cursor is authoritative, and means exactly one thing

```
execution_cursor = THE NEXT STAGE THAT MUST EXECUTE
```

Not "the last stage that completed", which is what `202607300004` documented while the orchestrator
wrote the opposite. A field with two meanings is a field with none, and that ambiguity is what let a
run which failed at VERIFICATION resume from `locked` — replaying session revocation and the account
hold, re-writing the identity it had just erased.

Nine stages, ranked, with movement restricted to exactly one step forward:

```
mutation_draining → lock_marker → session_revocation → database_erasure
→ storage_erasure → identity_erasure → verifying → finalizing → completed
```

`lock_marker` and `session_revocation` were previously both hidden inside `locked`, which is
precisely why a retry could replay them. A retryable failure now PRESERVES the cursor —
`record_retryable_error` deliberately does not touch it — and a retry executes that stage directly.
Nothing infers a resume point from `failed_retryable` any more; it is a note about the previous
attempt, never an instruction about where to start.

`202607300004`'s unguarded `mark_cursor` is retired in place: it took no executor, no expected value
and no legality check, so leaving it callable would have left a way around every invariant below.

### 2. The executor is single-writer

A bounded claim — token hash, generation, expiry — is required to move the cursor at all. Every step
validates six things in ONE statement under a row lock: executor ownership, executor generation, the
expected current cursor, a legal next cursor, the mutation-lease invariant, and irreversibility.

`p_expected_cursor` is what makes two concurrent runs safe: the second one's expectation no longer
matches, so it is refused rather than repeating a completed stage. Two confirm requests no longer
drive one saga; the second is told `in_progress`, which is the honest answer to a double-click.

`irreversible_started_at` is set ONCE, at the crossing into `lock_marker`, after the gate is proven
closed and drained. After that: cancellation denied, cursor monotonic, and no retry can clear it —
and cancellation is refused on the recorded FACT, not on a state string, so a job sitting in
`failed_retryable` half-way through erasure is correctly not cancellable.

### 3. The fence is complete, and unforgeable at runtime

A TypeScript brand is a compile-time fiction: `{} as AccountMutationContext` satisfies it. So a write
context is an opaque object recorded in a module-private `WeakSet` at mint time, and every low-level
writer checks MEMBERSHIP rather than shape. A literal, a clone, a `JSON.parse` result and a spread of
a real context all fail. Contexts are REVOKED when their window closes, so one captured in a closure
and replayed later fails exactly as a forged one does.

Three kinds, because three different things authorise them: `mutation` and `provisioning` by a lease,
`deletion` by the executor claim (a deletion cannot lease against its own closed gate).

Now fenced as ONE window each — the previous split is what left half of each outside the fence:

- `ensureCanonicalUserForAccount` — UserProfile + email AuthIdentity + LINE AuthIdentity
- `updateCanonicalSupportProfile` — foundation save AND the legacy mirror, re-read inside the window
- `bindLineIdentityToUserProfile` / email attachment — including the activity rebind
- `resolveOrCreateLinePrimaryUser` — account record + mirror + binding, per branch
- account registration, password-reset issuance, account recovery, cookie restoration
- account-linked session creation, binding, and the principal-landing migration

`getViewerContext` NO LONGER WRITES. It used to `touchSession` on every authenticated request,
folding the cookie's `userId` and landing contract back into the stored record — a write-on-read, and
the cleanest resurrection path in the product, on a path far too hot to lease. The merge still
happens, in memory; what no longer happens is persisting it.

Enforcement has two halves. The runtime half is the context. The source half is
`scripts/por1-raw-write-source-guard.mjs`: EXACT path + symbol allowlists over nine guarded symbols
and five identity key families, with no directory-level exemptions, plus a self-check that fails if a
rule stops matching real code. Verified by negative control — a probe file using
`upsertAccountRecord` and building an `accounts/by-id/` key was caught on both rules.

### The durable target manifest

Frozen before the crossing, immutable in the database (a second write is a no-op, never an
overwrite). Erasure destroys the record that names everything else, so a later stage that re-enumerated
would find nothing and report "nothing to erase" — indistinguishable from success, and the most
dangerous possible failure mode for a deletion.

Hashes and stable ids only: no raw password, cookie, email address or LINE id. The email and LINE id
appear solely inside the hashed lookup keys the store itself uses.

Erasure inventory now also covers password-reset tokens, consultations, LINE events, the foundation
UserProfile and both AuthIdentities, and support conversations. The shared recent-LINE-subject index
is PRUNED IN PLACE rather than deleted — it is one array covering every subject, so deleting it to
erase one person would erase everyone's — and `identityKeyScope` refuses that key by name so a future
caller cannot reach for the simpler, wrong operation.

### Deterministic concurrency proof

`tests/por1/postgres-integration.sh`, against a disposable local database. All eleven required
scenarios pass. The genuinely concurrent cases run TWO PERSISTENT SESSIONS WITH AN EXPLICIT LATCH:
session A opens a transaction and stops, the harness confirms via `pg_stat_activity` that B is blocked
on the row lock, and only then does A commit. Nothing sleeps waiting for a race.

The two grace-period cases use an INJECTED CLOCK (`yorisou.deletion_clock_skew_seconds`, unset in
every deployed environment) rather than 180 seconds of real waiting — proving both that an
expired-but-in-grace lease still blocks at 175s of a 180s grace, and that it drains at 200s.

```
1-3  stale account / foundation / session writer versus deletion
4    two deletion executors against one job — refused, and latched under contention
5    crash after every external action, before cursor advancement — cursor preserved, no replay
6    lease denial during draining, closed and completed (the last via fingerprint)
7    released, drained and stale-generation lease replay denial
8    expired lease inside grace remains blocking
9    expired lease after grace drains
10   verification performs no identity write — proven by snapshotting every governed table
11   user B unchanged, and still able to write
```

### Local gates at this commit

```
tsc 0 · acceptance-suite tsc 0 · ESLint 0 errors · build ok
migration scope 32/32 · flag-off baseline 12 · raw-write source guard (9 symbols, negative-controlled)
por1-deletion 18 · por1-boundary 13 · por1-fence 4 · por1-controls 5 · por1-namespace 6 · por1-context 7
POR-1 resume/fence DB proofs: all 11 scenarios · YV-1 DB · DCI-1 DB
```

### ⛔ STILL UNPROVEN — the hosted run

Everything above is proven locally and in a disposable database. The HOSTED exact-SHA acceptance —
isolated Preview identity store, four capabilities on, at least two workers, a fully populated
synthetic account, and the four concurrent adversaries running during a real deletion — has NOT been
run. Do not treat the fence as hosted-verified until it has.

## WS-B — the canonical LINE activity model (`202607310001`)

The shared mutable array is replaced, not patched. `phase1/line-events/admin-recent-subjects.json`
is no longer written in canonical mode and is no longer the index.

**The table.** `yorisou_canonical_line_events` — ONE ROW PER EVENT, addressed by the event's own
identity. Two subjects never touch the same row, so the read-modify-write that lost entries has no
shared state left to lose. "Recent subjects" is DERIVED (`distinct on (line_subject_hash)`), so it
cannot drift from the events it summarises and there is no second object to keep consistent.

**Idempotency is a constraint.** A partial unique index on `webhook_event_id` makes a redelivery
land on the same row. The record RPC takes the row lock FIRST, so two concurrent deliveries of one
event and a delivery racing an erasure are both decided under the lock rather than by whoever writes
last. Outcomes are distinguishable — `recorded` / `repeated` / `erased` — and reuse of one event
identity for a DIFFERENT subject RAISES rather than rebinding someone else's activity.

**Erasure is row-scoped.** Matched by `line_subject_hash`, so erasing one person cannot rewrite
another's — the structural defect that made the array's prune a whole-document rewrite. It leaves a
CONTENT-FREE TOMBSTONE rather than deleting the row, so a redelivery arriving after the deletion is
absorbed instead of resurrecting the activity. A database CHECK enforces the tombstone's emptiness;
it is not left to the erase RPC to be careful.

**Verification stopped being ambiguous.** Residue is a COUNT from the same row-locked table the
erasure wrote. The family this replaces could not be verified at all: its evidence was a re-read of
an object whose reads are not consistent, where "absent" and "we read a stale copy" are the same
observation.

**Addressing is by digest.** `line_subject_hash` is the only thing that keys, indexes, scopes an
erasure or appears in audit output, and both entry points refuse a raw identifier (proved). The raw
id survives in ONE ordinary column because the admin timeline must resolve a canonical identity from
it, and it is nulled by the tombstone.

**Two further defects found on the way, both fixed:**

- `buildDeletionManifest` derived the LINE erasure scope by LISTING that same array. An entry
  invisible at manifest time would have been left out of the manifest, and therefore never erased
  and never missed. The subject is a property of the account, so it now comes from the account.
- `rpc()` surfaced only an allowlist of bounded codes, and neither the fence's nor the deletion's
  codes were in it. Every one arrived as `assessment_persistence_failed:400`, which `classify()`
  reduced to `account_mutation_unavailable` — fail-closed, so never unsafe, but it made "this
  account is being deleted" and "the fence could not be reached" the same answer.

**Rollout.** `YORISOU_POR1_CANONICAL_LINE_ACTIVITY_SCHEMA_READY`, the same readiness-not-activation
contract as the fence: a deployment predating the migration keeps its exact previous behaviour and
attempts no RPC that cannot succeed. Deliberately NOT a fifth capability. Per-event objects
(`phase1/line-events/<id>.json`) are still written in BOTH modes — they were always row-addressable
and never had the defect — which is what keeps an application rollback safe.

**Proofs.** Scenarios 12-18 in `tests/por1/postgres-integration.sh`, on the existing two-session
latch: the exact overlap that lost an entry in the array; concurrent same-subject writes; redelivery
idempotence; refusal of conflicting identity reuse; A erased while B keeps receiving; tombstone
content-freeness; idempotent re-erase absorbing a late redelivery; raw identifiers refused at both
entry points. 18 scenarios total. Plus `npm run test:por1-line` (6 rollout-rule properties).

## WS-B HARDENING — the subject-level LINE erasure barrier (`202607310002`)

`202607310001` is correct about everything it claims. One row per event, addressed by the event's
own identity, protects redelivery of an EXISTING event, reuse of an EXISTING event identity, and
replay against an event-level tombstone. It does not protect the case a deletion has to survive:

```
account deleted -> every event row for that subject tombstoned
LINE delivers a BRAND-NEW event id for the SAME subject
the record RPC finds no existing row, so it INSERTS an active one
```

**Proved against a database holding only `202607310001`:** outcome `recorded`, one live row, and the
raw LINE id back in the table. An event tombstone is not a subject tombstone; erasure was a property
of whichever rows happened to exist at deletion time, and LINE decides when the next event id exists.

**The barrier.** `yorisou_canonical_line_subjects` — keyed by digest, `active | erased`, erased
TERMINAL. Every event record locks that row FIRST and reads the state under the lock, so the SUBJECT
row (not the event row) is the serialization point for event-versus-erasure. Erasure transitions the
subject and then sweeps its rows in one transaction: a row that does not exist yet is covered by the
state, not by the sweep. Erasing a subject never seen still creates an `erased` row, so an account
deleted before its first webhook is as protected as one deleted after its thousandth. An absorbed
delivery writes NO row — there is no tombstone for content to survive in.

`yorisou_line_activity_erase` is RETIRED IN PLACE by delegating to the subject erasure, so an
un-updated caller gets the stronger guarantee rather than the weaker one, and the source guard now
refuses the name in new code (a new `RETIRED_RPCS` rule, with a self-check that the names still
exist in the migrations so the rule cannot become decorative).

Deletion verification counts the BARRIER, not just the rows: a subject whose events are all
tombstoned but whose state is still `active` is residue, and so is a subject with no registry row —
unknown must never mean absent. The manifest freezes the subject identity, state and counts.

**Behaviour change, stated rather than discovered later:** same-subject event writers now SERIALIZE
on the subject row. That is the barrier's cost and it is per subject; two different subjects still
overlap freely (scenario 12 proves it, scenario 13 proves the serialization).

## WS-C — atomic truthful registration provisioning (`202607310003`)

THREE false-success paths, not two, and all three ended in an authenticated cookie:

```
if (!deterministicPrincipal.ok) { console.error(...) }        <- logged, then continued
catch (foundationError)         { console.error(...) }        <- logged, then continued
(await bindSessionToUser(...)) || { ...session, userId }       <- fabricated a bound session
```

The third is the quietest: `bindSessionToUser` returns null when the write does not land, and the
cookie was then minted from an in-memory object no store had ever seen.

Repairing the swallow alone is not enough. Once the response is honest the failure becomes a 5xx on
a multi-write operation with no record of how far it got, so a retry either duplicates the account or
gives up. The honest answer and the resumable one had to arrive together.

**The saga.** ONE durable row per registration INTENT, keyed by a digest of the normalized email — so
"one normalized email -> one active principal" is the PRIMARY KEY, not a check someone remembered.
ONE cursor meaning THE NEXT STEP THAT MUST EXECUTE, the deletion engine's rule for the deletion
engine's reason. Single writer by the same bounded claim: token, generation, expiry. Every transition
validates six things in one statement under a row lock, and the account binding is immutable once
written, because the one way this could create two accounts is by forgetting which one it made.

**What a 200 now means.** Account, canonical UserProfile, email AuthIdentity, session and
principal-landing contract, each READ BACK after being written. The old code called every one of
those functions too; what was missing was anybody asking afterwards whether they had worked.

**Response contract.** 200 completed only - 409 approved identity conflict - 503 retryable (a
double-submit is retryable, not a conflict) - 500 for a genuinely unclassified failure, now a small
set. The account-existence oracle is unchanged: `email_exists` keeps its existing wording, and the
password-reset suppression sits inside the unconditional uniform response.

**Readiness gates DURABILITY, not HONESTY.** `YORISOU_POR1_IDENTITY_PROVISIONING_SCHEMA_READY`. A
deployment without the saga table runs the same stages with the same proof and the same refusals and
only loses the resume cursor. Gating truthfulness on a schema flag would mean the old deployment kept
lying and nobody could tell which deployments were which. Deliberately NOT a fifth capability.

**Incomplete identities** are refused at login, password-reset issuance and LINE binding. The scope
limit is stated in the code: with no saga table there is no durable record of an incomplete
registration, so the gate can only allow there.

**Deletion** purges provisioning state and verification counts it. That also RELEASES THE EMAIL — a
saga keyed by an address that outlived the account would make it unregisterable forever.

### Three defects found in my own work, each proved before being fixed

1. **A saga that created nothing poisoned the address.** Attempting to register an already-taken
   email opened a saga, created nothing, and recorded `failed_terminal`. That row has neither an
   account id nor a fingerprint, so no purge could ever find it: the address became permanently
   unregisterable, including by its real owner after deleting their account. It is now abandoned.
2. **Anyone could lock any account out of login.** The access gate read any live saga as "this email
   has an incomplete registration". Combined with (1), submitting someone's address to the
   registration form denied them login. The gate now refuses only a saga that NAMES that account —
   a pure function, tested exhaustively rather than through a database.
3. **The session proof demanded a row the design does not guarantee.** Found by YV-1 CI at `935a8d1`,
   not by me. The session cookie is SELF-CONTAINED and `getViewerContext` fabricates a synthetic
   session from it, so `ensureViewerSession()` can return an id the store has never seen and
   `touchSession` — update-only — returns null. The old fabricated-session fallback is exactly why
   nobody had seen it. `insertSessionRecordIfAbsent` creates the row KEEPING THE ID (a new id would
   break anonymous->register continuity); insert-only, because an upsert on the session table is a
   resurrection primitive.

### Proofs

`tests/por1/postgres-integration.sh` — 43 scenarios on the existing two-session latch:

```
12-18  canonical LINE activity (as before)
19-29  the subject barrier: new event id and new webhook id after erasure absorbed; nothing stored;
       residue counts the barrier; a never-seen subject barred; idempotent re-erase with an
       immutable erased_at; the record RPC unable to reopen the state; an event transaction and an
       erasure resolving to one legal serial order; two new events blocked on the barrier and both
       absorbed; A erased while B keeps receiving; the retired name performing the full erasure
30-42  the provisioning saga: privilege posture, closed failure vocabulary, six-way transition
       validation, immutable account binding, cursor preserved across a retryable failure,
       generation takeover refusing the superseded executor, full progression, a completed saga
       terminal in both directions, two concurrent opens for one email LATCHED on the row lock,
       purge by fingerprint releasing the email, and defect (1) above
```

Plus `npm run test:por1-provisioning` (18), which exercises the pure access decision and the response
contract directly rather than through a database.

## Remaining CTO sequence (D onward) — CLOSED, superseded by the terminal package

Retained as the record of how the work was sequenced. Every item below is done; do **not** treat
`D <- START HERE` as live guidance.

```
D. stale-write mutation guard          DONE (202607300004 + the runtime fence)
B. durable retry cursor migration      DONE (202607300005)
E. canonical key module                DONE (lib/server/identityKeyScope.ts)
G. complete deletion target inventory  DONE (resets, consultations, LINE events/index, foundation)
H. durable target manifest             DONE (frozen pre-crossing, immutable)
J. isolated-store transport proof       DONE (and it found the foundation transport defect)
K. fully populated deletion lifecycle   PARTIAL — the fixture exists; the hosted run is WS-F
L. complete exact-SHA hosted train      WS-F
M-W. cleanup, bucket audit, promotion delta, rehearsal, merge, activation, closeout  WS-G..WS-M
```

## Not yet done — exact remaining sequence

1. ~~**Account-deletion application layer.**~~ **DONE — see G4.** Original scope, for the record: Orchestrator in `lib/server/` driving the saga; narrow
   permanent identity-store adapter over the existing `sharedDeleteJson` / `deleteSession`
   primitives (allowlisted key patterns only: `phase1/accounts/by-id`, `accounts/by-email`,
   `sessions`, LINE lookup, consultations, password-reset); API routes; authenticated UI with
   explicit scope disclosure, reconfirmation and reauthentication; cancel-before-erasure.
   **No arbitrary object-path deletion, no generic storage admin, no temporary secret route.**
2. ~~**Runtime activation controls.**~~ **DONE — see G4.** Remaining part of this item: setting the
   four `YORISOU_POR1_*` variables to `on` in the Preview environment (they are unset there today,
   so Preview currently serves the flag-off baseline). Production stays unset.
3. **Full Preview acceptance at the new namespace.** The historical 79/0 predates the rename and no
   longer counts. Requires: exact-SHA deploy, build-identity check, the complete hosted train, the
   account-deletion lifecycle, the User A/User B deletion matrix, deletion of the existing
   `@synthetic-preview.invalid` identities through the governed path, cleanup idempotency, and the
   full deployment-independent battery.
4. **Production promotion delta.** New immutable Production-lineage migrations with new timestamps
   creating the final canonical schema **from the beginning** — never by copying the Preview files,
   never with a bare `create table if not exists` on a shared name. Must assert absence or an exact
   compatible shape and abort loudly on collision.
5. **Production-equivalent rehearsal.** Fresh database from full Production lineage + legacy
   recommendation rows + the delta; prove flags-OFF equivalence, flags-ON capability, legacy row
   preservation, interruption recovery, and application-rollback safety.
6. **Merge → Production migration → deployment → controlled activation → Production acceptance →
   synthetic cleanup → observability → rollback evidence → governance closeout**, in the order fixed
   below.

## Fixed ordering constraint (do not reorder)

`main` is the Vercel `productionBranch`, so **merging deploys**. The additive migration must land
*before* the merge, with canonical flags OFF, or the new application reaches users before its schema
exists:

```
implement → flags OFF → apply additive Production migration → verify old app still healthy
→ merge (auto-deploys; flags off, behaviour unchanged) → verify deployed SHA + health
→ activate capabilities in order → Production acceptance → cleanup → closeout
```

## Standing facts (verified, do not re-derive)

- Production is **not** empty: 5 `yorisou_test_results`, 5 `yorisou_private_recommendations`,
  5 legacy recommendation sets, 9 legacy recommendation actions, 1 reflection, 1 experience card,
  1 ai run. The delta must be additive and must not touch these.
- 26 identity-linked Production tables; the deletion plan is derived from the live schema.
- The identity store **has** a delete primitive (`sharedDeleteJson`, already used by
  `deleteSession`). The earlier "unmanageable identity store" residual was a local-credential
  limitation only.
- Preview `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are branch-scoped; this branch has its own
  copies. Hosted runs need the project's pre-existing Automation Bypass via
  `x-vercel-protection-bypass`.
- `sha256()` (pg_catalog), not pgcrypto `digest()`, in any function pinned to `search_path = public`.

## Preview promotion state — 2026-07-31, VERIFIED at the project

The three POR-1 migrations are APPLIED to `nbltsbonsnbpfptihomc` and verified by schema inspection,
not by the apply call returning without error:

```
202607310001_por1_canonical_line_activity          applied
202607310002_por1_line_subject_erasure_barrier     applied
202607310003_por1_identity_provisioning_saga       applied

public tables            17 -> 20
yorisou_canonical_line_events        present, RLS enabled AND forced
yorisou_canonical_line_subjects      present, RLS enabled AND forced
yorisou_identity_provisioning_sagas  present, RLS enabled AND forced
POR-1 functions          18/18 present
```

All seven Preview facts are set on the branch scope `feat/ux2-integrated-core-experience` and were
READ BACK as the literal string `on`:

```
readiness (infrastructure, not capabilities)
  YORISOU_POR1_ACCOUNT_MUTATION_FENCE_SCHEMA_READY    on
  YORISOU_POR1_CANONICAL_LINE_ACTIVITY_SCHEMA_READY   on
  YORISOU_POR1_IDENTITY_PROVISIONING_SCHEMA_READY     on
product controls
  YORISOU_POR1_CANONICAL_CORE                         on
  YORISOU_POR1_CANONICAL_RECOMMENDATIONS              on
  YORISOU_POR1_LINE_CANONICAL_RETURN                  on
  YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR              on
```

**A correction to an earlier note.** This file previously recorded the four product controls as
"unset in Preview". They were already set, 21h before this session. Verified rather than assumed.

**The two new readiness variables were first created SENSITIVE and were recreated non-sensitive.**
A sensitive variable is injected at runtime but cannot be read back, and a readiness fact an
operator cannot verify is not evidence — the same rule the Preview-isolation audit arrived at when
it required the bucket and endpoint to be readable. `[SENSITIVE]` is a FAILURE of this check, not
a note.

**Deployment — the WS-F starting state, attested rather than assumed.**

`/api/build-identity` now also reports `por1SchemaReadiness` and `por1Capabilities`, so a run can
prove which MODEL the deployment serves rather than only which commit. Read at the deployment:

```
https://yorisou-online-byfjt7q8t-shigeru-naganos-projects.vercel.app

commitSha        f657f47987fe2ad313474a7b24c0a66fb43917a0   (five-green at this exact SHA)
commitRef        feat/ux2-integrated-core-experience
environment      preview
sharedStoreMode  supabase-rest
sharedStoreBoundary  isolated-preview        sharedStoreProjectMatch  true
por1SchemaReadiness  ACCOUNT_MUTATION_FENCE true - CANONICAL_LINE_ACTIVITY true
                     IDENTITY_PROVISIONING true
por1Capabilities     CANONICAL_CORE true - CANONICAL_RECOMMENDATIONS true
                     LINE_CANONICAL_RETURN true - ACCOUNT_DELETION_EXECUTOR true
```

An earlier deployment of `f193d4c` predated the readiness variables and is NOT a valid target: with
readiness off the deployment serves the legacy shared array and the inline provisioning path, and an
acceptance against it passes on the code those migrations replaced.

**Hosted access.** The Preview sits behind Vercel Authentication. The bypass secret is the single
key of `protectionBypass` from `GET /v9/projects/<projectId>?teamId=<orgId>`; the CLI token in
`auth.json` EXPIRES and is refreshed by running any `vercel` command, so a 403 there means "run the
CLI once", not "the token does not work".

## WS-F — the hosted train, STARTED. Four defects found by running it.

The exact-SHA hosted acceptance had never reached the concurrency property. It does now, and each
failure below was a REAL defect the local proofs could not have found, fixed at root with a permanent
gate rather than patched at the call site.

### 1 + 2. Supabase answers 400, not 404, for an object already deleted — in TWO delete paths

Measured against the isolated Preview bucket rather than inferred:

```
DELETE .../an-object-that-does-not-exist
HTTP 400  {"statusCode":"404","error":"not_found","message":"Object not found","code":"NoSuchKey"}
```

`sharedRestDeleteJson` (identity store) and `deleteSharedObject` (foundation transport) both special-
cased only 404. Deleting something twice is the NORMAL shape of a resumable erasure, so the first key
a previous attempt had already removed threw and `storage_erasure` could never complete. One hosted
job reached **attempt 41**, a second **attempt 42** — the same defect, written twice, with the same
correct intent and the same wrong check. The foundation one's comment even said "a missing object is
the desired end state, not a failure to retry".

The repair is `classifySharedStoreDelete`, a pure function returning `deleted | already_absent |
failed`, and the discrimination is the BODY. A blanket "400 means gone" is the fail-open version of
the same bug: a malformed or unauthorized request also answers 400, and reading that as absence is
how a deletion finalizes over data it never removed.

**Permanent gate**, because fixing two instances is not the repair — a third writer would reach for
`!== 404` for the same plausible reason, and the defect is invisible until a deletion is RESUMED. The
source guard now requires any `lib/server` file issuing an object-store DELETE to go through the
classifier, plus a wiring check that it is actually CALLED in at least two files. Shaped as "use the
classifier" rather than "don't write `!== 404`", because a forbidden-pattern rule is evaded by
rephrasing the comparison. Both rules negative-controlled.

### 3. The fence refusing a write was reported as a crash

Every route performing an account-linked write ends in `catch (error) { ... 500 }`, and
`AccountMutationDenied` is thrown when the account is being deleted, when the gate is draining, or
when the fence cannot be consulted — all of which are the system working. The stale writer racing the
erasure answered **500**, so the acceptance could not tell a correct refusal from a fault. Same shape
as the earlier `rpc()` defect: fail-closed, never unsafe, and useless to anyone reading it.

Now `409` for deleted/erasing (final — inviting a retry loop against an erasure is worse than saying
so) and `503` for gate/unavailable (genuinely retryable). 500 keeps its meaning.

DELIBERATELY NOT applied to `forgot-password`, which answers `{ success: true }` unconditionally so a
caller cannot distinguish a registered address from an unregistered one. A 409 there would hand back
exactly that oracle, about someone mid-deletion. The omission is documented in the route and asserted
by the test so a future reader cannot "fix" it into a leak.

### 4. OPEN — the deletion manifest froze with NO LINE scope for a LINE-bound account

**Root-caused 2026-07-31 (4th segment) by a bounded read-only inventory of the Preview database and
identity store. The inventory CORRECTED the record: two statements written into this file and into
`CURRENT_HANDOFF.md` after the hosted run were wrong, and acting on either would have sent the repair
in the wrong direction.**

#### The record as written, and what the evidence actually says

| Recorded after the hosted run | What the Preview database and store actually hold |
| --- | --- |
| the deletion that lost the LINE scope **COMPLETED and reported clean** | the job whose manifest omitted the LINE scope is `failed_retryable`, cursor `verifying`, `identity_residue:sessions,password_reset`. It never completed. |
| the **completed** job's manifest had `lineLookupKey: null` | the completed job's manifest **named** the LINE lookup, and that lookup **was deleted** — along with the account record, the email lookup, 4 sessions and the reset token. That deletion was genuinely complete. |
| the run stops at the absence sweep on `line_lookup` | no job ever reported `line_lookup` residue. The surviving lookup was never *looked at* — see defect 4B. |

There was no false clean finalization. The two facts are still bad, and they are different facts.

#### Four frozen manifests, compared against the store as it stands

Job fingerprints are `sha256(job_id)[0:8]`; no identifier, key or body was read into the record.

```
job 1c516bfa  failed_retryable  cursor=storage_erasure  attempts=41  frozen 05:03:15
              line lookup NAMED · account record survives (the 400-is-not-404 defect, since fixed)
job 66213e2c  failed_retryable  cursor=storage_erasure  attempts=42  frozen 05:24:14
              line lookup NAMED · account record survives (same, since fixed)
job 8e108939  completed         cursor=completed        attempts=1   frozen 05:46:11
              line lookup NAMED and DELETED · account, email, 4 sessions, 1 reset all absent
job 0fdee7d0  failed_retryable  cursor=verifying        attempts=2   frozen 06:01:39
              line lookup NOT NAMED · 0 line events · 0 subjects · 0 recent subjects · 3 sessions
              account record and email lookup DELETED — accounts/by-line-user/<sha256> SURVIVES
```

The single orphaned LINE lookup that matters was created at **06:01:25** and resolves to the account
owned by job `0fdee7d0` (owner fingerprint `d3aba4a9`), whose account record is gone. **It is a live
LINE login route to an erased account.** (A second surviving `by-line-user` object resolves to an
account that was never subject to a deletion at all — ordinary synthetic residue, not a defect.)

#### The timing, at full precision — this excludes the race hypothesis

```
06:01:25.xxx   LINE lookup object created      ) the binding completes
06:01:26.xxx   LINE event object created       )
06:01:27.952   deletion requested                <- 2.0s AFTER the binding finished
06:01:30.887   identity verified
06:01:36.489   mutation gate closed
06:01:39.958   MANIFEST FROZEN  -> lineLookupKey NOT NAMED, 14.0s after the binding
06:01:40.173   locked / irreversible crossing
```

The binding did not race an open deletion, and the fence had nothing to refuse: the binding was
complete and legitimate **before the deletion was requested**. The manifest simply could not see a
write that had finished fourteen seconds earlier. Measured visibility lag on this bucket was already
recorded as a distribution of 4.5s / 5.4s / 11s; 14.0s is that distribution's tail.

Evidence against the fixture-artifact alternative, though it is not yet formally excluded: the three
other runs, produced by the same fixture, all left `lineUserId` **present** on the account record,
with the record's `updated_at` equal to the second the lookup object was created. The fixture does
write the account record, and does it in the same operation.

#### 4A — the destructive scope is derived from ONE eventually-consistent read

`lib/server/accountIdentityDeletion.ts:145` — `buildDeletionManifest` opens with
`const account = await findAccountById(accountId)`, and every LINE field is derived from that one
object: `lineLookupKey` (`:195`), `lineEventIds` (`:203`), `recentSubjectFingerprints` and
`lineSubjectInventory` (`:172`). A stale copy therefore **narrows** the manifest — the unsafe
direction — and what the manifest never names is never erased and never missed.

This is not specific to LINE. `emailLookupKey` has the same derivation, and `sessionIds` has the same
shape through a different lagging read: `listSessions()` (`:149`) plus `sessionBelongsToAccount`
(`:124`). A session created seconds before the freeze can be invisible to that list.

**This is verbatim the defect already fixed once in this package** for the shared LINE recent-subject
array — the fix moved the LINE subject *out* of a lagging list and onto the account record, which is
itself a lagging read. The class of defect survived the repair.

#### 4B — verification is scoped BY the manifest, so an omission is invisible

`verifyIdentityErasure` (`:328`) checks the LINE lookup only when the manifest named one:

```ts
if (manifest.lineLookupKey && (await sharedIdentityObjectExists(manifest.lineLookupKey))) {
  residue.push("line_lookup");
}
```

Sessions (`:348`), reset tokens (`:355`), consultations (`:361`), LINE events (`:367`), canonical LINE
activity (`:386`, gated on `manifest.recentSubjectFingerprints.length > 0`) and the foundation
identities (`:411`) are all iterated **out of the manifest**. Only `findAccountById` (`:424`) is
manifest-independent.

So a family the manifest omits is not merely unerased — it is **unlooked-at**, and `clean` can be
returned for it. Job `0fdee7d0` proves it: it reported residue in two families and never mentioned
the LINE lookup that was sitting there the whole time. This violates contract §9 ("a manifest
omission must not make a target family invisible") by construction, and it holds **whatever** caused
the omission. 4B must be repaired even if 4A turns out to be a fixture artifact.

#### Also observed, not a data-protection defect

`0fdee7d0` reported residue for `sessions` and `password_reset` on manifest-named keys that are all
absent now. `sharedIdentityObjectExists` can therefore still see a just-deleted key. That is
fail-closed and safe — it costs a retry, it cannot let a deletion finalize early — and it is recorded
here so a future reader does not mistake it for a second erasure failure.

#### The discriminating experiment — run, controlled, and repeated

Three probes, 20 overwrite rounds, against the isolated Preview bucket through the **exact** endpoint,
headers and cache directive `lib/server/sharedObjectTransport.ts` uses (`GET /object/<bucket>/<key>`,
`cache: "no-store"`). Every read was issued from a **fresh process** with no connection reuse. Only a
throwaway `phase1/por1-lag-probe/` prefix was written; all of it was deleted, and the preserved
evidence was re-counted afterwards and is unchanged (8/6/2/14/5/1).

**Result — a NEW key is visible in ~1.3-2.0s, every time. An OVERWRITTEN key can be served stale for
longer than the whole budget, repeatedly.**

```
probe 1  plain polling            4/6 overwrites fresh in ~1.1-2.1s · 2/6 STALE past 30s (54, 59 reads)
probe 2  + write-status control   5/6 fresh · 1/6 STALE past 25s
probe 3  + response headers       8/8 STALE past 25s (41-49 reads each)
```

Two controls, because a probe that measures its own bug proves nothing:

- **C1 — did the overwrite actually happen?** Every write returned HTTP 200, and the store's own
  listing reported the NEW object size (66 bytes, the larger v2 body) in every round, including the
  rounds whose reads never saw v2. The store had the new version the whole time.
- **C2 — is it the store or the read path?** Reading the same key with a cache-busting query string,
  interleaved in the same loop, returned v2 in ~1.0-1.2s while the runtime's own URL was still
  returning v1 twenty-five seconds later.

**The mechanism, named rather than guessed:** the stale responses carry `cf-cache-status: HIT`. The
first read after an overwrite is a `MISS` that populates a Cloudflare cache entry from the OLD
object, and every later read of that URL is served from it. `cache-control: no-cache` on the response
and a `Cache-Control: no-store` REQUEST header do not prevent it; a distinct query string does,
because it is a different cache key. The staleness rate depends on the read pattern, which is why the
three probes disagree on rate and agree on kind — one unlucky `MISS` pins a stale entry.

So the store is durable and consistent; **the runtime's read path is not**. `findAccountById` at
`accountIdentityDeletion.ts:145` is exactly that read path.

**Hypothesis A (fixture artifact) is refuted as the cause**, by code and by data:
`bindLineIdentityInPreviewStore` (`tests/cpc1-acceptance/fixtures.ts:561`) writes the account record
unconditionally and *then* the lookup, and would reject before the deletion if either write failed;
and the three other hosted runs all left `lineUserId` present on the account record with `updated_at`
equal to the second the lookup was created. **Hypothesis B is confirmed.**

One finding from A's territory survives and is worth fixing anyway: the fixture writes objects
**directly**, bypassing the governed binding transaction, so it can construct a state the product
cannot. §9's fixture-integrity gate is warranted on its own merits, not as the root cause.

#### Scope of 4A — Preview transport, not proven in Production

`resolveSharedStoreMode` (`lib/server/yorisouData.ts:245`) returns `aws` when no endpoint is
configured, and Production configures none: Production reads S3 through the AWS SDK, which has been
strongly read-after-write consistent — including overwrites — since December 2020. **The staleness
measured above is a property of the `supabase-rest` transport and its Cloudflare front, and this
record does NOT claim Production deletions have been losing LINE lookups.** That claim is not
evidenced and must not be made.

What IS true in both environments:

- **4B is transport-independent.** Verification iterating the manifest is pure logic; a manifest
  omission is invisible in Production exactly as it is in Preview, whatever produced the omission.
- **4A is a real architectural fragility everywhere.** A destructive scope derived from one read of a
  mirror is correct only for as long as the mirror's consistency guarantee holds. It is not a
  property the deletion contract should be resting on, and Production's guarantee is a vendor
  property that a transport change would silently remove — exactly the kind of change this project
  made for Preview.
- **The Preview staleness affects far more than deletion.** Any read-modify-write against an account
  object on this transport can read a stale copy and write back a document missing a recent change.
  That is a lost-update hazard across the identity store and a source of hosted-acceptance flakiness
  unrelated to product defects.

#### The repair this evidence requires

Not a retry, not a sleep, not a re-read. The destructive scope must stop being derivable from a
single read of an eventually-consistent store, and finalization must stop taking the manifest's word
for which families exist. Both halves are required; neither alone closes the hole.

### Also corrected: the acceptance was testing the model it replaced

`establishLineActivity` fell back to seeding the LEGACY shared array whenever Preview had no LINE
channel secret — which it deliberately never has. So the canonical LINE family and the subject
barrier were entirely unexercised by the hosted run, while it reported green. It now records through
the CANONICAL SERVICE SEAM: the same governed RPC the application calls, with the service-role key the
test process already holds. No public route, no admin endpoint, nothing added to the deployment. The
precondition asserts the model actually in use, since canonical mode deliberately stops writing that
array, and the run prints which origin was used.

The identity gate also now refuses a deployment whose `por1SchemaReadiness` or `por1Capabilities` are
not all true — proving the commit stopped being sufficient once the model went behind readiness flags.

## Preview synthetic residue — bounded inventory, 2026-07-31T15:5x+08:00 (read-only, nothing removed)

Counted BEFORE any cleanup, because the orphaned LINE lookup is the evidence for defect 4. No PII was
read into this record: identifiers appear only as `sha256(...)[0:8]` fingerprints, and no object key,
email address, LINE id, session id, token or body was printed at any point.

```
database (nbltsbonsnbpfptihomc)
  deletion jobs            21   completed 10 · failed_retryable 10 · cancelled 1
                                of the 10 failed: 6 pre-date the 400-is-not-404 fix (07-30),
                                2 are the attempts-41/42 storage_erasure jobs, 1 is 0fdee7d0
  frozen manifests          4   (only jobs that reached the crossing freeze one)
  public tables            20   RLS enabled AND forced on all POR-1 tables

identity store (bucket yorisou-preview-auth)
  accounts/by-id            8   3 still carry lineUserId; 2 are targets of stuck jobs
  accounts/by-email         6
  accounts/by-line-user     2   1 = ORPHAN of job 0fdee7d0 (PRESERVE — evidence)
                                1 = account never subject to a deletion (ordinary residue)
  sessions                 14   4 pre-date this package (07-30); all have userId null by design
  password-resets           1   owner 110c07b6, never deleted
  consultations             0
  line-events               5
  foundation-v1/user-profiles   8
  foundation-v1/auth-identities 6
  foundation-v1/audit-logs      3
  TOTAL                    53
```

**Do not clean any of this until the repair is proven.** The orphan, its job, its frozen manifest and
the two stuck attempts-41/42 jobs are the negative control for §10: they are what the pre-repair
architecture produces, and the regression test has to reproduce them before the fix removes them.

## CONTINUATION_CURSOR

```
package: YORISOU_POR1_TERMINAL_EXECUTION_CONTRACT (Founder, 2026-07-31)
workstream: A complete - B complete - C complete - D partial - E complete for this candidate
            - F IN PROGRESS: the concurrency property now reaches the ABSENCE SWEEP; four defects
              found, three fixed at root, one open and diagnosed below
            - G..M not started

next_action: DEFECT 4 IS ROOT-CAUSED (see the section above, which also corrects two wrong statements
  in the previous cursor). The evidence is preserved and nothing has been cleaned.

  PROVEN by the Preview record: the job that lost the LINE scope did NOT complete and did NOT report
  clean; the job that DID complete named its LINE lookup and erased it. The manifest that omitted the
  LINE scope froze 14.0s after a LINE binding that had finished 2.0s BEFORE the deletion was even
  requested — so no race, nothing for the fence to refuse, only a read that could not see a finished
  write. Two structural defects, both required to be repaired:

    4A  buildDeletionManifest derives the whole destructive identity scope from ONE
        eventually-consistent object read (accountIdentityDeletion.ts:145). A stale copy NARROWS the
        manifest. Not LINE-specific — email lookup and sessions have the same shape.
    4B  verifyIdentityErasure iterates the MANIFEST, so a family the manifest omits is never looked
        at and can be reported clean (accountIdentityDeletion.ts:338/348/355/361/367/386/411).
        True regardless of what caused the omission — repair it even if 4A were a fixture artifact.

  REMAINING to distinguish (does not change 4A or 4B, only whether the fixture ALSO needs a gate):
  whether `bindLineIdentityInPreviewStore` always writes the account record. Evidence so far says it
  does — the three other runs all left lineUserId present with updated_at equal to the second the
  lookup was created — but it has not been confirmed by a controlled run.

  REPAIR (contract §9): a strongly consistent canonical identity-link registry in PostgreSQL, written
  inside the same governed mutation/provisioning transaction that binds or creates identity, as the
  serialization point. The manifest derives destructive scope from it; finalization verifies identity
  families from it independently of the manifest. No sleep, no retry-until-visible, no re-read.

  Then finish WS-F: the concurrency property three times at the same SHA - 20 consecutive
  registrations with p50/p95/max - the full hosted train with 0 serious / 0 critical axe - cleanup
  twice with the second deleting nothing.

hosted_progress: the deletion now REACHES COMPLETION under four concurrent adversaries, the second
  executor is refused with a bounded 202, and the stale writers are answered rather than faulted.
  One hosted deletion (job 8e108939) completed with a COMPLETE manifest and erased every family it
  named, including the LINE lookup. The failure mode is an under-populated manifest, not a failed
  erasure.
last_green_candidate_sha: d8e8ac1 — five workflows SUCCESS, read at that exact SHA
last_deployed_preview_sha: d8e8ac1, attesting isolated-preview, three readiness true, four
  capabilities true
last_accepted_candidate_sha: NONE. No SHA has passed hosted exact-SHA acceptance for POR-1.
preview_synthetic_state: NOT CLEAN, and DELIBERATELY PRESERVED — counted in the bounded inventory
  above (21 jobs, 4 manifests, 53 store objects). The orphaned LINE lookup of job 0fdee7d0 is the
  EVIDENCE for defect 4 and the negative control for §10. WS-G cleans it only after the repair is
  proven, then proves zero residue twice.
production_mutation_state: NONE. main c8d8a8ad, 12 migrations, 42 tables, canonical objects absent.
production_activation_state: NONE. All four POR-1 controls unset in Production.
pr_126_state: OPEN / DRAFT / UNMERGED, body still STALE — WS-J.
rollback_state: nothing to roll back; every change is branch-local or Preview-only.
```
