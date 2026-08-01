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

## The repair — canonical identity links (202607310004 + 202607310005)

Both halves of §9, because neither alone closes the hole.

**4A — the scope can only widen.** `yorisou_canonical_identity_links` is the strongly consistent
record of which account owns which identity, committed inside the same governed mutation that binds
it. `putSharedAccountRecord` — the one funnel through which every identity key family is written —
commits the link **before** the mirror objects and **throws** on failure. The order is the safety
property: a link without an object makes a manifest wider (harmless, deleting an absent key is
success), an object without a link makes it narrower (a live login route). `buildDeletionManifest`
takes the **union** of the registry and whatever the record showed, so a stale read can no longer
narrow anything.

**4B — verification stopped trusting the manifest.** Lookup keys now come from the frozen union, and
two checks consult no manifest field at all: active links counted by owner **fingerprint** (which
outlives the account id, so the question can still be asked after erasure) and the reachability
question a LINE login actually asks. Deliberately **not** gated on readiness — an unready deployment
reporting clean over surviving identity is the exact failure being closed.

The invariant the object store could never enforce is a partial unique index: at most one ACTIVE
account owns a given identity. Erasure leaves tombstones a CHECK proves are content-free, and an
erased address or subject is claimable again — refusing forever would mean a deleted person's
identity could never be used by anyone, including them.

Digests only. Both key families are addressed by `sha256(value)`, so no raw email or LINE id is kept,
and CHECK constraints refuse `@` or whitespace in the opaque kinds.

### One defect the repair introduced, found by running it

At the five-green SHA `0a5967f` the hosted train answered **500** for the second executor. The runtime
log said `assessment_persistence_failed:400` — the signature of a raise whose code is not in the
bounded allowlist. Two causes, both real:

1. **A same-owner race raised a raw `23505`.** Every account write calls the sync, so a person with
   several requests in flight has two syncs for ONE account in flight. Both run the `exists`
   pre-check, both see nothing (the other's insert is uncommitted and therefore invisible), both
   insert, and the loser dies on the partial unique index. The pre-check could never have fixed it:
   `select ... for update` locks a row that does not exist yet. **The index is the serialization
   point and the code was not listening to it.** Repaired forward-only in `202607310005` by catching
   the violation and then INTERPRETING it under the winner's lock — same owner is a no-op, different
   owner is the bounded conflict. Not `on conflict do nothing`, which would merge those two facts and
   swallow a genuine identity conflict.
2. **`identity_link*` was missing from the `rpc()` bounded-code allowlist** — the third time this
   package has hit that exact shape. A caller that cannot name the failure can only guess, and "the
   system is working correctly" and "the system crashed" became the same answer again.

`202607310004` was **not** amended. It was already applied to Preview, and an applied migration is
immutable; a later `create or replace` is how this project changes behaviour without rewriting
history.

### A second defect the repair introduced — and it was the same mistake, one layer up

`yorisou_identity_links_sync` took "the COMPLETE set of links this account should hold" and retired
anything absent from it. That contract is only safe if the caller knows the whole truth, and it does
not: `putSharedAccountRecord` derives the set from `identityLinksForAccount(account)`, and `account`
came from the very object read that can be served stale for tens of seconds.

**So a stale account record — one written before a LINE binding — produced a link set with no LINE
subject, and the sync ERASED the strongly consistent record of a binding that had really happened.**
The registry became destroyable by the cache it exists to be independent of.

Observed across two hosted runs at two SHAs, which is what made it unambiguous:

```
09:23  job 9d73b498  canonicalIdentityLinkCount=2  identityLookupKeys=2  manifest named LINE ✓
09:40  job c0764ea9  canonicalIdentityLinkCount=1  identityLookupKeys=1  manifest named LINE ✗
```

Same code path, same fixture. The only difference was which copy of the account object the writer
happened to read.

The rule the whole design rests on is that **a stale read may only ever WIDEN, never narrow.** The
manifest obeyed it; the writer did not — and a writer that can narrow the authority is worse than no
authority, because everything downstream now trusts it.

`202607310006` makes the sync **additive**: it never retires. A retirement is a deliberate act with
its own entry point, called from the one place that can genuinely observe an unbind — the account
writer comparing the PREVIOUS record's LINE subject against the new one, which is a comparison of two
known values rather than an inference from an absence. It is owner-scoped (retiring a link you do not
own would cut a living person off from their own login) and replayable. The migration asserts against
the **live** function definition that the sync no longer retires, so a later `create or replace`
cannot silently reinstate it.

### The repair is PROVEN HOSTED — defect 4 is closed

At `b024dfd`, five workflows green, deployed and identity-gated, the deletion **completed on the
first attempt**:

```
job ff1c010a   state=completed   cursor=completed   attempt_count=1   last_error=null
               manifest_named_line=TRUE   identityLookupKeys=2   canonicalIdentityLinkCount=2
```

The manifest named the LINE lookup — supplied by the registry through the union — the absence sweep
passed for every family, and **no orphaned `accounts/by-line-user/` object was left behind**. The
three that survive in Preview all pre-date the repair:

```
05:40:57  never subject to a deletion at all — ordinary synthetic residue
06:01:25  the ORIGINAL orphan (manifest named no LINE scope) — preserved evidence
09:40:21  the orphan from the additive-sync defect, before 202607310006
```

Three consecutive runs at one SHA are still required before WS-F can be called done; this is one
clean run, not three.

### STILL OPEN — a surviving cookie is still answered after erasure

The same run then failed **later**, at post-deletion denial, and this is a different defect that
predates the identity-link work:

```
GET /api/account/deletion-status   with User A's cookie, after A was erased
expected 401   received 200
```

The session cookie is self-contained (AES-256-GCM over the account), so a route that trusts it
without confirming the account still resolves will answer an erased person. Every other denial in
that block — login, password reset, reports, downloads, recommendations — has not been re-checked
past this assertion, because the test stops here.

**This is the next action.** It is a real post-deletion denial defect, not a test artifact: contract
§14 requires `cookie restoration denied`, and a 200 from an account-scoped route is the opposite.

## WS-D — the identity mutation graph re-audit, COMPLETE

The §11 invariant, restated so it can be checked rather than admired:

> A mutation legally begun before gate draining may finish while deletion waits. A mutation beginning
> after draining starts cannot acquire authority. Nothing may recreate identity-linked state after
> deletion completes.

**How each clause is actually enforced**, not where it is described:

| clause | mechanism | proof |
| --- | --- | --- |
| a legally-begun mutation may finish | the execution grace window in `yorisou_account_mutation_begin`, with an injected clock rather than real waiting | postgres scenarios (grace cases) |
| a post-drain mutation cannot acquire authority | `yorisou_account_deletion_close_mutation_gate` + lease refusal | scenario 50, and the fence scenarios |
| nothing recreates identity-linked state | every account-linked writer demands an `AccountWriteContext`, and only `accountMutationLease.ts` can mint one | runtime `WeakSet` (unforgeable) + the source guard |

### The 23 families, and where each one is written

Audited by call graph, not by reading the module headers. Every family below reaches its store
through a writer that takes a lease or a deletion context.

```
compatibility account ┐
email lookup          ├─ putSharedAccountRecord (ONE funnel; assertAccountWriteContext at entry)
LINE lookup           ┘
canonical identity links  syncCanonicalIdentityLinks, called from that same funnel — NEW, and the
                          source guard now requires the call rather than the import
UserProfile           ┐
email AuthIdentity    ├─ foundation/identityService.ts, 8 lease/context sites
LINE AuthIdentity     ┘
session               ┐
principal landing     ├─ touchSession / putSharedSessionRecord, both context-demanding;
                      │  bindSessionToUser takes the lease around the whole read-transform-write
password reset        ┘
recovery                  updateAccountPassword, which accepts a caller-held context so recovery
                          holds ONE window across validate -> password -> token retirement
provisioning saga         identityProvisioning.ts, single-writer by bounded claim
consultation              assignSessionConsultationsToUser, inside the session-binding lease
support conversation      foundation/repositories.ts, 3 context sites
canonical LINE event  ┐
LINE subject state    ┘   recordCanonicalLineEvent / eraseCanonicalLineSubjects, subject row locked FIRST
assessment ownership  ┐
legacy private state  ├─ database-side, owner-scoped RPCs; erased by the declarative delete plan
canonical recs        │  under a `to_regclass` guard, which records *absent* rather than pretending
legacy rec linkage    ┘
report access         ┐
download access       ┘   derived from ownership; denied once the owner row is gone (no separate store)
```

### What the re-audit actually changed

Three findings, all now closed:

1. **`syncCanonicalIdentityLinks` and `eraseCanonicalIdentityLinks` were new ungoverned primitives.**
   Added to the source guard with exact path allowlists (14 → 16 guarded symbols).
2. **A future caller could reach past the adapter straight to `rpc("yorisou_identity_links_sync")`**
   and satisfy every symbol rule while being a second, ungoverned writer of the table the deletion
   manifest now trusts. The RPC names are guarded by name, with no allowlist beyond their one adapter.
3. **`/consultations/` and `/line-events/` were missing from the identity key families** (5 → 7) —
   not because anyone decided they were safe, but because the fence work reached them later. Both are
   account-linked state the manifest names.

Plus a **wiring check**: `putSharedAccountRecord` must *call* `syncCanonicalIdentityLinks`, not merely
import it. An import that is never invoked looks identical to a repair that was never made — which is
the same reasoning that shaped the delete-classifier rule.

All three new rules are **negative-controlled**: each was deliberately broken, the guard was confirmed
to fire, and the tree was restored. A guard that has never been seen to fail is a guard nobody has
tested.

### Two false positives, recorded so the next reader does not re-chase them

- `app/api/auth/login/route.ts` and `app/api/line/auth/callback/route.ts` call `bindSessionToUser`
  without naming a lease. `bindSessionToUser` takes the lease **internally**, around the whole
  read-transform-write window including the consultation rebind (`yorisouAuth.ts:804`).
- `yorisou_canonical_identity_links` is deliberately **not** in `yorisou_account_deletion_erase_database`.
  Database erasure runs at `database_erasure`, several stages before `identity_erasure`; erasing the
  links there would destroy the scope the later stages still need. They are erased last, after every
  object they describe, and verified separately by fingerprint.

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
workstream: A complete - B complete - C complete - D COMPLETE (the full graph re-audit, §11)
            - E complete for this candidate
            - F IN PROGRESS: the deletion property now COMPLETES on the first attempt with a
              complete manifest and leaves no orphan; the run then fails at the post-deletion
              DENIAL block (surviving cookie answered 200)
            - G..M not started

next_action: DEFECT 4 IS CLOSED — root-caused, repaired architecturally, and PROVEN HOSTED at
  b024dfd (job ff1c010a: completed, first attempt, manifest named the LINE lookup, no orphan left).
  The full record, including the two defects the repair itself introduced and how each was found by
  RUNNING it, is in the sections above.

  THE NEXT ACTION IS THE NEW OPEN DEFECT: after a completed erasure, User A's surviving cookie is
  answered 200 by `GET /api/account/deletion-status` where §14 requires denial. The cookie is
  self-contained AES-256-GCM over the account, so a route that trusts it without confirming the
  account still resolves will answer an erased person. This predates the identity-link work and is
  not a test artifact.

    1. Fix the denial at the route/session-resolution seam, not in the test.
    2. Re-check the rest of the §14 denial block, which the run has never reached: login, cookie
       restoration, password reset, recovery, LINE resolution, reports, downloads, recommendations.
    3. THEN the concurrency property three consecutive times at one SHA — one clean run is not three.
    4. 20 consecutive registrations with p50/p95/max.
    5. The full hosted train with 0 serious / 0 critical axe.
    6. Cleanup twice, the second deleting nothing.

hosted_progress: the deletion completes under four concurrent adversaries, the second executor is
  refused with a bounded 202, the stale writers are answered rather than faulted, and — new at
  b024dfd — the manifest is COMPLETE (LINE lookup named from the registry union) and the absence
  sweep passes for every family with no orphan left behind. The run now reaches the post-deletion
  denial block for the first time, and stops there.
last_green_candidate_sha: b024dfd — five workflows SUCCESS read at that exact SHA
  (Migration Scope Guard 30621401191 · Yorisou Check 30621401184 · CPV1-CM0 30621401141
   YV-1 30621401187 · DCI-1 30621401198)
  Earlier five-green candidates this session, each read at its own SHA:
   991c7ec (30617643252/242/481/237/224) · 0a5967f (30618735300/297/285/280/278)
   f3293ea (30620390509/535/523/568/549)
last_deployed_preview_sha: b024dfd — isolated-preview, projectMatch true, FOUR readiness facts true
  and four capabilities true, all read back as the literal string `on` (never `[SENSITIVE]`).
  NOTE worth carrying: the git-triggered deployment of 0a5967f attested CANONICAL_IDENTITY_LINKS
  FALSE because it was built before the variable existed, and the identity gate REFUSED it. That is
  the gate working. A redeploy of the same SHA picked the variable up. Set the variable BEFORE the
  push that will build against it.
last_accepted_candidate_sha: NONE. No SHA has passed the full hosted exact-SHA acceptance for POR-1.
  b024dfd is the first to pass the deletion property end to end (completed, first attempt, no
  orphan) and it then fails at the post-deletion denial block on the surviving-cookie assertion.
preview_synthetic_state: NOT CLEAN. The pre-repair inventory was 21 jobs / 4 manifests / 53 store
  objects; this session's hosted runs added more (67 store objects at last count, 3 surviving
  by-line-user of which 2 are pre-repair orphans and 1 was never deleted). The two orphans are the
  EVIDENCE for defect 4 and the §10 negative control, and the repair that removes them is now
  proven — so WS-G may clean, and must then prove zero residue twice.
production_mutation_state: NONE. main c8d8a8ad, 12 migrations, 42 tables, canonical objects absent.
production_activation_state: NONE. All four POR-1 controls unset in Production.
pr_126_state: OPEN / DRAFT / UNMERGED, body still STALE — WS-J.
rollback_state: nothing to roll back; every change is branch-local or Preview-only.
```

---

## WS-F segment 5 — the surviving cookie is CLOSED; three defects fixed by running it

Continuation of the same Founder package. HEAD `c1b42e3` → `8e67b17`, three commits, five workflows
SUCCESS read at each code SHA at that SHA. Production untouched throughout.

### Defect 5 — `GET /api/account/deletion-status` answered 200 to an erased person. FIXED.

**The record already existed. Nothing was asking it.**

`yorisou_account_deletion_status` falls back to `owner_fingerprint` once
`yorisou_account_deletion_finalize_step` sets `owner_account_id = null`, so the database can still
answer "this account was erased" about an account it deliberately no longer names.
`evaluateAuthenticationLock` has consulted that answer at the login door since WS5.

`getViewerContext` never consulted it at all. Both of its account-cookie fallbacks —
`(await findAccountById(id)) || accountCookie` on the session path, and the bare `accountCookie` on
the no-session path — returned a fully authoritative `AccountRecord` decrypted from the browser's
own cookie. The only check applied was `sessionMayActAsAccount`, which reads `deletionLockedAt`: a
field that was `null` when the cookie was minted and that the server can never update in a cookie it
no longer writes. So every surface behind `getViewerContext` authenticated an erased identity for the
180-day life of `yorisou_account` — the deletion surface was simply where it was noticed.

**NO MIGRATION.** The durable fact was already there. This is application-side only.

The repair, in one gate:

- `decideCookieRestoredViewer` (pure, in `accountDeletionLock.ts`) — the cookie is demoted to a
  LOOKUP HINT. Store decides when it can; the durable record decides when it cannot.
- `accountDeletionAuthority.ts` — the two reads that feed it. **`status`, never `resume_state`**:
  only `status` has the fingerprint fallback, so `resume_state` reports "no job" about exactly the
  deletions this gate has to refuse. Proven in the Postgres harness, not inferred.
- `resolveAccountForViewer` in `yorisouAuth.ts` — the extra reads fire ONLY on a store miss, so the
  hot path and anonymous viewers are untouched.
- `evaluateAuthenticationLock` now delegates to the same gate rather than reimplementing it.

Both requirements survive, because they need different answers:

```
A  held account, AND the identity_erasure/verifying window where the record is already gone
   → the deletion surface resolves; the job is the only thing left that can speak for the person
B  completed → refused on EVERY surface, whatever the cookie carries
```

**Closed in the same pass, same missing question:** a job that failed TERMINALLY past the crossing is
neither `ERASED_OR_ERASING` nor `HELD`, so the state string alone said "allow" about an account whose
identity was already destroyed. The gate consults `irreversible_started_at` — the recorded fact.

**Preserved deliberately:** a store miss with NO job still resolves. The Cloudflare-cached read path
genuinely serves stale reads; refusing every miss would trade this defect for a worse one.

### Defect 6 — a second confirm was told the deletion FAILED while it was succeeding. FIXED.

Found by RUNNING the property, not by reading the code: `the second executor must be answered, not
faulted (got 500)`.

`advance` initialises the cursor at `identity_verified` then refuses all further forward motion.
Confirm decides whether to open from a READ, so two confirms both see `requested` and only one can
win; the loser got `advance_superseded_by_cursor` or `illegal_transition_locked_to_identity_verified`
and both landed in the generic catch as a 500. The route already had the right answer one branch
further down — `in_progress` → 202. It never got there.

`isDeletionOpeningSuperseded` classifies exactly those two shapes; everything else still throws, and
a test asserts that `job_not_found`, `manifest_missing`, `irreversible`, `identity_residue` and
`mutation_denied` are NOT absorbed. A blanket catch would turn a contract violation into a silent 202.

### Defect 7 — an absent table was a thrown error, not unproven erasure. FIXED (harness).

`yorisou_private_recommendations` is real Production-lineage schema (`202607110001`) and the deletion
plan names it, but the isolated Preview is a deliberate SUBSET and does not have it. PostgREST
answers 404, and the count helper treated that as a failed query.

Absence is now a third outcome (`null`). The spec records the absent set in the run log and asserts
it is a subset of the known Preview gap — so a table that goes missing unexpectedly still fails, and
one added back becomes a live assertion again instead of staying quietly skipped.

**Carried forward:** erasure of `yorisou_private_recommendations` is UNPROVEN in Preview, by
construction. It must be proven in the Production-equivalent rehearsal (WS-I), which is built from
the full Production lineage and is the only place the assertion can mean anything.

### Permanent proofs added

```
lib/server/__tests__/por1DeletionSurfaceAuthorization.test.ts   33 assertions in test:por1-deletion
  incl. a NEGATIVE CONTROL that reproduces the pre-fix 200 by showing the marker check passes an
  erased account, and that the new gate refuses the same input
tests/por1/postgres-integration.sh   the asymmetry the gate rests on, asserted against the LIVE
  functions: status('user-a')=completed · resume_state('user-a')=none · status(other)=none
tests/cpc1-acceptance/por1DeletionConcurrency.spec.ts   A's cookies are CAPTURED while they work and
  REPLAYED into fresh contexts — account alone, session alone, both — against deletion-status,
  deletion-cancel, deletion-request and /api/private-state. A still-open second context is not the
  same test; a cleared jar proves nothing.
```

### UI/polling contract

The panel was discarding non-ok status reads silently, so an erased person kept seeing
「削除の処理中です」 and kept polling forever. A 401 is now terminal for the view and renders as a
refusal that claims neither success nor failure. Completion is taken ONLY from the confirm response —
the one place the browser observes the transition while still authenticated.

## Hosted evidence at this boundary — stated precisely, not rounded up

```
5-green CI at 8e67b17 : Migration Scope Guard 30627257883 · Yorisou Check 30627257946
                        CPV1-CM0 30627257832 · YV-1 30627257828 · DCI-1 30627257789
Preview deployment    : dpl 9lh52w1bg @ 8e67b17 — preview · isolated-preview · projectMatch true
                        4 readiness true · 4 capabilities true
```

**ONE hosted run has passed the post-deletion denial block AND the new stale-cookie replay** — the
run at `2ad2e3a` (identical application code; `8e67b17` is a test-only descendant). That run then
failed further along, at the absent-table count, which is defect 7 and is now fixed.

**THAT IS ONE RUN, NOT THREE, AND NOT AT THE CURRENT SHA.** The §9 requirement — three consecutive
passes at one SHA and one deployment — is NOT met and is NOT claimed.

## Open, and blocking the three-run requirement

1. **A session object read as surviving, once.** One run at `8e67b17` failed
   `session sess_178…  must be revoked` at the absence sweep, a step EARLIER than the denial block
   and one that has passed in every prior run. NOT reproduced. Not characterised: the isolated store's
   read path is documented to serve a deleted key as present for 25–30s (`cf-cache-status: HIT`), so
   this is either that lag or a real survival, and the two must be told apart before either is
   believed. **Do not "fix" this with a retry until it has been reproduced and read from the store
   directly** — the sweep's whole value is that it does not retry into a pass.
2. **Registration returns a truthful `provisioning_retryable` 503 under contention.** Measured
   SERIALLY at this deployment: **10/10 success, p50 15.7s, p95 18.9s, max 18.9s** — so the route is
   healthy on its own. It failed once in the property (which registers A and B nearly together) and
   once in a back-to-back probe. The class is HONEST (WS-C working: no 200 over an unproven canonical
   identity), but `registerSyntheticUser` does not retry a retryable class, so the property dies at
   setup. Fix the contention or give the fixture a bounded retry for `provisioning_retryable` ONLY —
   never for an unclassified failure.
3. Everything from §9 step 9 onward is untouched: three-run stability, 20 registrations, the full
   train, accessibility, cleanup twice, and the whole Production package (WS-G..WS-M).

---

## WS-F segment 6 — PRIORITY A IS CLASSIFIED: the read is stale, the objects are gone

HEAD `da1869c` → `a0a1c84`, five commits, five workflows SUCCESS read at each SHA at that SHA.
Production untouched; its Supabase credentials were deliberately not used.

### The classification, with the evidence that produced it

```
STALE_CACHED_READ_OF_A_DELETED_OBJECT     ← proven
REAL_SESSION_SURVIVAL                     ← refuted for this signature
```

Deletion job `2026-07-31T13:41:39`, audit trail from the database:

```
13:42:01  storage_erasure  ok        ← sessions, lookups and linked objects DELETED here
13:42:06  verifying        ok  (from identity_erasure)
13:42:24  verifying        failed    identity_residue:sessions,password_reset,
                                     foundation_auth_identity,foundation_user_profile
```

Read back afterwards through the AUTHORITATIVE listing (`POST /object/list`, not a cacheable
method), with no erasure having run in between — the job never completed, so nothing else deleted
anything:

```
sessions naming that erased owner : 0   (of 57 session objects listed)
account record                    : absent from the listing AND 400 on the fixed URL
```

So the objects were already gone at 13:42:01, and the product's own `verifyIdentityErasure` reported
them as present 23 seconds later. **The residue report was a stale read, not a survival.** 23s sits
squarely inside the 25–30s staleness previously measured on this transport.

Controlled experiment run first, so the discriminator itself is evidence rather than assumption —
write, warm, delete, then probe both reads in lockstep, 3 rounds:

```
fixed-URL GET with service-role auth : cf-cache-status: DYNAMIC, delete visible at t=0, 3/3
```

The FIXTURE's read path is therefore not cached. The RUNTIME's is the one that goes stale, which is
why the product's verification sees residue the test does not.

### What this does NOT claim

The previous segment's single fixture-side observation of a surviving session is still
unreproduced. It is no longer able to fail a run for the wrong reason — the absence sweep now
asserts on the authoritative listing and records any disagreement with the cached read — but it has
not been positively explained, and this section does not pretend otherwise.

### ⛔ THE NEXT ACTION — verification must stop asking a cacheable question

`verifyIdentityErasure` confirms absence with `sharedIdentityObjectExists`, a per-key GET on a
stable URL: the cacheable path. Its tolerance is `5 attempts × 800ms = 4s` against a read path
measured stale for 25–30s, so a SUCCESSFUL erasure is recorded as `failed_retryable` and the person
is told their deletion failed while it is in fact complete.

The repair is NOT a longer retry, a sleep, or cache-busting-as-authority. It is to prove physical
deletion with the strongest evidence the store offers — the authoritative listing.

**Measure before switching.** The comment above the session check
(`accountIdentityDeletion.ts`, "the object-store list is not immediately consistent") records an
EARLIER measurement that contradicts this segment's. One of the two is stale. Establish which, from
the runtime's own path, before making the listing the authority — do not swap one unproven
assumption for another.

### Three product defects fixed by running it

1. **`localeCompare` on the deletion manifest path, intermittently.**
   `admin-recent-subjects.json` lives inside `phase1/line-events/`, so listing that prefix returned
   the recent-subject INDEX — an array — alongside the events, and
   `b.receivedAt.localeCompare(a.receivedAt)` dereferences the right-hand operand only. Harmless
   while the sort held it in `a`, fatal the moment it landed in `b`. Erased four accounts cleanly,
   then failed 41 consecutive attempts inside `buildDeletionManifest`. Index excluded by KEY (not by
   shape — that would hide a genuinely malformed event); comparator made total.
2. **The same class in `sortByCreatedAtDesc`**, which backs accounts, sessions, consultations AND
   password-resets — every family the manifest enumerates. `T extends { createdAt: string }` is a
   claim about a type, not about bytes in an object store. Exposed by a probe artifact of MINE (a
   session object with no `createdAt`), which has been removed from Preview. One malformed object
   anywhere in those families made erasure unreachable, not slower.
3. **`yorisou_account_deletion_open` raced itself** — `select`-then-`insert` with no lock on a
   UNIQUE column, so two concurrent confirms both inserted and the loser got a raw 23505 answered as
   500. FOURTH occurrence of this exact shape in this package. Repaired forward-only in
   `202607310007`, applied to Preview and verified BY SCHEMA INSPECTION. Proven both ways in the
   harness as latched scenario 54 — the pre-repair definition restored reproduces
   `duplicate key value violates unique constraint`, the repaired one gives 0 errors, 1 job, same id
   to both callers, one audit row, and still refuses a legal hold.

### Priority B — classified, product path NOT yet repaired, NO fixture retry added

Reproduced under contention: 1 of 4 concurrent registration pairs returned the governed 503. The
durable sagas table gives the class:

```
failed_retryable   session_binding_failed   cursor=session_binding
```

`last_error_code` was being handed `failureClass` a second time, so the DETAIL — which separates
`session_insert_failed` from `bind_returned_null` from `session_not_stored`, three defects wanting
three different repairs — existed only in a console line this deployment does not expose. It is now
persisted (bounded six-value enum, no PII) and deployed, so the next reproduction is decisive.

**No bounded retry has been added to `registerSyntheticUser`**, deliberately: §6 requires the
underlying path be repaired unless the class is expected bounded contention, and that cannot be
decided until the detail is read. Serial baseline at this deployment: **10/10, p50 15.7s, p95 18.9s,
max 18.9s** — the route is healthy alone.

Note the likely connection: `session_not_stored` is a READ-BACK failure, the same read path that
Priority A just showed going stale in the other direction. Do not assume it; read the detail.

---

## WS-F1/F3/F4 CLOSED — the cached body was the whole story; WS-F5 found a broken download

HEAD `2a3ed55` → `dc22575`. Five workflows SUCCESS at `dc22575`. Production untouched.

### WS-F1 — erasure verification no longer trusts a cacheable read. CLOSED.

Archaeology first, and it overturned the obvious answer: `sharedRestReadJson` and the fixture probe
are **byte-identical** — same URL, same service-role headers, same `cache: "no-store"`, same POST
list. The difference is not the code, it is where the request originates, so no probe from a laptop
could settle which read lags. That is why the repair landed with the measurement built in.

Four states replace one boolean. `AUTHORITATIVELY_ABSENT` and `STALE_BODY_VISIBLE_BUT_UNLISTED`
finalize; `PHYSICAL_RESIDUE_CONFIRMED` and `AUTHORITY_UNAVAILABLE` block. The GET is authoritative
only when it says ABSENT, so the listing is consulted solely in the case in doubt and a healthy
erasure costs nothing extra.

**THE MEASUREMENT, from inside the lambda, on the real erasure path** (deletion audit,
`finalizing` rows across the three passing runs):

```
AUTHORITATIVELY_ABSENT          : 6 / 3 / 4
STALE_BODY_VISIBLE_BUT_UNLISTED : 6 / 9 / 8
PHYSICAL_RESIDUE_CONFIRMED      : 0
AUTHORITY_UNAVAILABLE           : 0
```

**23 of 35 object questions were answered by a stale body.** Every one would have been reported as
residue by the old model — which is exactly why deletions were failing. The listing was correct in
all 23.

**§7.2's contradiction is settled.** The earlier in-code comment claiming the list is not
immediately consistent is not supported by any evidence gathered here. The listing is the authority;
the per-key GET is the stale read.

**A correction to this ledger's own previous entry.** Segment 6 recorded that the FIXTURE path is
not cached (`cf-cache-status: DYNAMIC`, delete visible at t=0, 3/3). The acceptance runs show
otherwise once the key has been warmed by the run itself:

```
[por1] absence family=session key=…9fcc817a7.json authoritativeListed=false fixedRead=200 cf=HIT
       class=cached_read_of_deleted_object
```

`cf=HIT` on the fixture path. The earlier experiment used freshly-written keys, which Cloudflare had
no reason to hold. So the previous segment's single unreproduced fixture-side observation is now
EXPLAINED rather than merely unrepeated: same mechanism, same transport, observed from the test side.

### WS-F3 — three consecutive passes. CLOSED.

```
SHA        dc225750df17725a4bd6d9f360890e6647d6af8a
deployment dpl 3zmeddoaf — preview · isolated-preview · projectMatch true · 4 readiness · 4 caps
runs       3 / 3 PASSED, 0 failed, same SHA, same deployment
```

Each run also served as a live negative control: `disagreements=3 / 2 / 4`, all
`cached_read_of_deleted_object`. The old model would have failed all three.

### WS-F4 — 20-registration acceptance. CLOSED.

```
attempts 20 · successful 20 · retry attempts 0 · failure classes NONE
p50 17.0s · p95 40.2s · max 40.2s   (the max is the first cold start)
missing canonical email link 0 · duplicate link 0 · saga not completed 0
duplicate saga 0 · duplicate account ids 0
```

Read-back proved from the durable record, not the response: the provisioning saga must be
`completed` (which the product sets only after reading the canonical identity back) AND the registry
must hold exactly one active email link per owner.

**Priority B did not reproduce.** 32 registrations on this SHA, including 6 concurrent pairs, with
zero governed retryable responses. It is NOT claimed as fixed — nothing was changed in that path.
The bounded detail is deployed, so the next occurrence classifies itself. The bounded governed retry
in the WS-F4 harness was never exercised (0 retries).

### WS-F5 — full train run. 87 passed / 2 failed / 4 skipped. NOT closed.

**FAILURE 1 — the report download is broken for EVERY report.** Not a corrected-result edge case:

```
code MS-KI (valid taxonomy code), no `result` param, so the continuity guard is skipped entirely
  page     200
  download 404
```

`loader.ts` does `fs.readFileSync(path.join(CONTENT_DIR, `${publicCode}.md`))` at REQUEST time. The
page is prerendered (`generateStaticParams`), so its files exist at build. The download route is
dynamic and runs in a lambda where the content directory is not traced into the serverless bundle,
so the read throws — and the route's blanket `catch { return 404 }` reports that as "no such
report". A person is told their report does not exist because a file was not bundled.

Two defects, and both need repair:

```
1. the report content is not available to the dynamic route at runtime
2. an internal failure is rendered as ABSENCE — the same collapse this package has fixed repeatedly
```

The concealment property must survive the fix: a genuinely missing report still 404s. An internal
failure must not.

**FAILURE 2 — `read ETIMEDOUT` on a deletion-confirm retry under full-suite load.** The confirm runs
the saga inline with `maxDuration = 60`; under two workers the client hit its own timeout. The spec
already retries, but `page.request.post` THROWS on timeout instead of returning a status, so the
retry loop never saw it. Distinct from the standalone runs, which passed 3/3.

**HYGIENE FINDING.** Playwright's failure call-log prints full `yorisou_session` and `yorisou_account`
cookie values into run output and trace files. `test-results/` is gitignored, so nothing reached the
repository, but run logs must not be pasted anywhere and traces must not be attached to an artifact.

### ⛔ EXACT NEXT ACTIONS, in order

1. Make report content reachable from the dynamic route (bundle-trace the content dir, or import it
   statically, or serve the download from the prerendered artifact). Then remove the blanket catch:
   absence 404s, an internal failure does not masquerade as absence.
2. Make the concurrency spec's confirm-retry tolerate a THROWN client timeout, not only a returned
   status. Do not raise `maxDuration` to hide it.
3. Re-run WS-F5 whole. A code change invalidates the WS-F3 3/3 and WS-F4 20/20 above — both must be
   re-run at the new SHA before any candidate is accepted.
4. Then WS-F6 axe, WS-G cleanup twice, WS-H..WS-K.

---

## WS-F CLOSED — full Hosted Preview acceptance passes at `0307571`

HEAD `8b37de8` → `0307571`, three commits. Production untouched.

### R1 — the report download was broken for every report. FIXED and PROVEN HOSTED.

`loader.ts` resolved `process.cwd() + content/…` and `fs.readFileSync` it AT REQUEST TIME. The page
is prerendered so its files exist; the dynamic download route runs in a lambda where they do not.
The blanket `catch { 404 }` reported that as absence — invisible, because 404 is also the correct
answer for a report that legitimately does not exist.

Not solved with `outputFileTracingIncludes`: this project builds with Turbopack, and a tracing rule
that silently stops matching fails the same invisible way. The markdown is embedded by a generator,
so a missing module fails the BUILD. The markdown stays the one canonical source; the registry is
generated, never hand-edited, and `check:report-registry` fails CI on drift.

Proven locally BY DELETING THE CONTENT DIRECTORY and serving the built output — the lambda's
condition exactly — then proven hosted:

```
24 / 24 governed report codes  ->  200 with content
invalid code ZZ-ZZ             ->  404 (concealment intact)
headers: text/markdown; charset=utf-8 · attachment; filename=…
internal metadata: purchaseStatus / contentStatus / codexExecutableNow / createdFor /
                   visibility  ALL ABSENT from the downloaded document
```

Error taxonomy split: an unknown code still gets the indistinguishable 404; a report that EXISTS and
cannot be produced is an internal failure and says so. Telemetry moved AFTER the content is in hand
and is best-effort — it used to be awaited first inside the same catch, so a failed analytics write
produced "report not found" for a report sitting right there.

### R2 — a thrown timeout escaped the retry loop. FIXED.

`page.request.post` throws on `ETIMEDOUT`; the loop only inspected RETURNED responses, so the
exception escaped the whole step. `driveDeletionToTerminal` reconciles instead: a thrown timeout
means the outcome is UNKNOWN, so the durable record is read BEFORE deciding whether another confirm
is legal, mid-erasure jobs are polled rather than contended with, `failed_terminal` stops
immediately, and the budget is bounded in attempts and wall clock. `maxDuration` untouched.

### PRIORITY B — CLASSIFIED AND GENUINELY REPAIRED. Two unsound proofs, one stage apart.

The durable DETAIL added in the previous segment is what named it:

```
class=session_binding_failed   DETAIL=session_landing_missing   cursor=session_binding
```

`bindAndProve` proved its work by re-reading the session — a GET on the key just written, on a
transport that serves superseded copies. It got the pre-landing version and refused a registration
that had succeeded. The saga was HONEST (no 200 over an unproven identity — WS-C working); the PROOF
was unsound.

The re-read existed to catch the IN-MEMORY FALLBACK, and `touchSession` is update-only and returns
null in exactly that case — so the WRITE already knew, and was discarding that into a fallback
shaped like success. `switchSessionToPrincipalLandingTruthWithProof` now reports `persisted`.

Fixing that moved the failure ONE STAGE, not away:

```
class=verification_incomplete   cursor=verification
```

`proveCanonicalIdentity` re-read the same session and re-checked the same landing. Existence is
still asked of the store; the CONTRACT is now read from the record the write returned. The
independent half is deliberately untouched — account, UserProfile and email AuthIdentity are still
read back from their own stores, because nothing in the request can vouch for them. The missing
family is now persisted as a bounded code (`missing:user_profile`, `missing:session`, …).

```
before: 1 non-200 in 16 concurrent registrations
after : 0 non-200 in 20 concurrent registrations
```

### R3 — credentials in test evidence. CONTAINED.

Playwright attaches its call log to a thrown request, headers verbatim. R2 removes the dominant
source. `check:evidence-hygiene` is the backstop: refuses retained trace archives outright, reports
the FINDING without printing the matched text, and its `--selftest` plants a canary and fails both if
the scanner misses it and if it fires on a cookie NAME with no value. Verified 0 findings after a
full passing train.

## THE GATES, replayed from zero at `0307571`

```
candidate SHA  0307571 1269e0f31e58d79b25a2ca690f4047589
deployment     dpl 8uucv4cl5 — preview · isolated-preview · projectMatch true · 4 readiness · 4 caps
CI             Migration Scope Guard 30650702757 · Yorisou Check 30650702881 ·
               CPV1-CM0 30650704575 · DCI-1 30650704751 · YV-1 30650702978   ALL SUCCESS

WS-F3   3 / 3 consecutive, same SHA and deployment, 0 failed
        each run a live negative control: disagreements 3 / 1 / 4,
        all cached_read_of_deleted_object
        confirm_drive: completed / denied / completed, transport_timeouts 0

WS-F4   20 / 20 · retries 0 · failure classes NONE · p50 16.3s · p95 35.9s · max 35.9s
        missing link 0 · duplicate link 0 · saga incomplete 0 · duplicate saga 0 · duplicate ids 0

WS-F5   89 passed · 0 FAILED · 4 skipped
        the 4 skips are the same lifecycle tests on MOBILE only; each declares "a lifecycle runs
        once; viewport coverage comes from the other suites" and all four ran on desktop.
        Intentional, documented, non-overlapping.

WS-F6   axe desktop AND mobile across /, /check-in, /tests, /line/mini-app, /result
        0 serious · 0 critical · nothing suppressed
```

## ⛔ NOT YET DONE — and why the candidate is not yet recorded as accepted

`last_accepted_candidate_sha` stays NONE until WS-G passes, per the controller's own ordering.

1. **WS-G cleanup twice.** The governed script `scripts/por1-preview-synthetic-cleanup.ts` is
   Preview-guarded and drives the real saga, but it only matches `@synthetic-preview.invalid`.
   The probe and WS-F4 registrations this segment used **`@example.com`**, which it will NOT catch.
   Extend its scope before running, or the second run will not be able to prove zero residue.
   Preview residue grew substantially: 3 concurrency runs, 20 registrations, ~36 probe
   registrations, and a full train.
2. WS-H Production read-only audit · WS-I full-lineage rehearsal (must prove
   `yorisou_private_recommendations` erasure, which isolated Preview cannot) · WS-J activation and
   rollback rehearsal · WS-K PR replacement body.

---

## WS-G — cleanup gap closed, tool hardened, and the RUN DID NOT PASS

HEAD `c2aa51c` → `33a37ad`. Five workflows SUCCESS at `33a37ad`. Production untouched.

### The classifier — the gap was real, and the obvious fix was the dangerous one

Live Preview inventory was **149 accounts: 40 `cpc1-*@synthetic-preview.invalid` + 109
`por1*@example.com`**. The tool matched only the first suffix, so a run would have reported success
while leaving 109 behind.

`email.endsWith("@example.com")` would have destroyed the `shadow-*` and `switch-*` accounts that
`scripts/verify-session-auth-*.ts` create. Membership is now a CONJUNCTION — reserved domain AND the
generated local-part shape, both anchored and requiring entropy. Matched **149/149, 0 unclassified**.
The negative control asserts the naive rule selects the collateral and the governed one refuses it.

Tool hardened: dry-run by DEFAULT, `--execute` required, `--max-candidates=<n>` required and taken
from the dry run the operator just read, unknowns preserved and reported by id prefix only. A
share-based ceiling was rejected in code with its reason: an isolated Preview is legitimately ~100%
synthetic, so "refuse if most of it matches" would block every real cleanup.

Pacing added after MEASURING it: back-to-back over a hundred accounts the failure rate reached
**84 unresolved in one pass** (`fetch failed` plus executor claims from an interrupted run). The
operator loop now paces; the next pass ran 0 unresolved. Nothing about a real deletion changed.

### WS-G7 — the Hosted evidence is preserved, and that was verified

```
diff 0307571 -> 33a37ad
  docs/ux2r/07_POR1_EXECUTION_STATE.md        DOCS_ONLY
  .github/workflows/yorisou-check.yml         GOVERNANCE_ONLY (CI config, not deployed)
  package.json                                GOVERNANCE_ONLY (scripts only; NO dependency change)
  scripts/por1-preview-synthetic-cleanup.ts   NON_RUNTIME_OPERATOR
  lib/server/previewSyntheticClassifier.ts    NON_RUNTIME_OPERATOR (0 importers outside scripts/tests)
  lib/server/__tests__/…Classifier.test.ts    TEST_ONLY

HOSTED_RUNTIME_AFFECTING = 0
```

So the acceptance at `0307571` (3/3 · 20/20 · 89/0/4 · axe clean · 24/24 downloads) stands without a
third replay.

### ⛔ WS-G DID NOT PASS — and run 2 "removing nothing" is true for the WRONG REASON

Account erasure itself converged: **149 → 0 account objects, 0 email lookups, 0 password resets,
sagas 148 → 1**, and the final pass reported `unresolved: 0`.

But an independent authoritative sweep — not the tool's own output — shows orphans:

```
AS DESIGNED   identity links: 184 `erased` (content-free tombstones)
              deletion jobs : 173 `completed` (de-identified audit)
              sessions      : 21 ANONYMOUS (no owner — outside an account-scoped tool by nature)

REAL RESIDUE  identity links: 1 ACTIVE
              deletion jobs : 12 failed_retryable, 13 still NAMING AN OWNER
              sessions      : 3 OWNER-LINKED
              accounts/by-line-user: 2 · foundation user-profiles: 1 · auth-identities: 2
              line-events   : 5
```

**THE MODEL IS THE DEFECT.** The tool derives candidates from surviving ACCOUNTS. Every account
object is gone, so it sees zero candidates and reports "nothing to clean" — while a job still names
an owner, a link is still active, and three sessions still point at erased accounts. That is exactly
the wrong-reason pass this gate exists to catch, and it would have been reported as an idempotency
proof if the verification had trusted the tool.

The orphans were produced by my own interrupted passes: a killed process mid-saga leaves a job at
`failed_retryable` after `identity_erasure` removed the account object but before finalization, so
the satellites survive with nothing left to enumerate them from.

### ⛔ EXACT NEXT ACTION

1. **Derive cleanup candidates from the DURABLE JOBS as well as from accounts.** A job that still
   names an owner is a deletion that has not finished, and resuming it through the governed saga is
   the only correct way to collect the orphans — the manifest is frozen in the job, which is
   precisely what an account-derived scan cannot reconstruct.
2. Re-run run 1 to convergence, then run 2, and re-verify INDEPENDENTLY. The pass condition is the
   authoritative sweep above reading `0` for every REAL RESIDUE row — not the tool's exit code.
3. Then record `last_accepted_candidate_sha: 0307571…` and continue to WS-I..WS-K.

## WS-H — Production read-only audit. COMPLETE.

```
project      krxizslnksorwhepyijs · yorisou-production · ap-northeast-1 · ACTIVE_HEALTHY
lineage      12 migrations · 42 public tables
POR-1 objects  NONE (no deletion jobs, identity links, provisioning sagas, mutation gates,
               canonical line events or canonical recommendation tables)
legacy       yorisou_account_deletion_requests present — pre-POR-1, unrelated to the saga
             yorisou_private_recommendations PRESENT — confirms it must be proven in WS-I
deployment   dpl_9Dg5XMiEXds8gTwNanajYFEGx9G7 · READY · target=production · 2026-07-27, unchanged
```

Control names resolved FROM CODE (`por1RuntimeControls.ts`, prefix `YORISOU_POR1_`), not assumed:

```
YORISOU_POR1_CANONICAL_CORE                        production UNSET · preview SET
YORISOU_POR1_CANONICAL_RECOMMENDATIONS             production UNSET · preview SET
YORISOU_POR1_LINE_CANONICAL_RETURN                 production UNSET · preview SET
YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR             production UNSET · preview SET
YORISOU_POR1_*_SCHEMA_READY  (4 flags)             production UNSET · preview SET
```

Two Production env vars matched a POR-1-shaped grep and are NOT POR-1 controls:
`YORISOU_CANONICAL_LINE_WEBHOOK_SHADOW_ENABLED` and `…SELECTIVE_ENABLE_ENABLED` — pre-existing
CPV1-era LINE webhook flags.

## WS-I1 — promotion archaeology

23 PREVIEW_ONLY migrations, ~6,300 lines. Production's lineage contains NONE of them, so every one
requires promotion authoring. WS-I2..WS-I6, WS-J and WS-K are untouched.

---

## WS-G8 — the cleanup model is repaired; WS-G still does not pass

HEAD `58aaac6` → (this commit). Production untouched.

### The model defect, and the live negative control that proves it fixed

Cleanup derived every candidate from surviving ACCOUNTS. That holds until `identity_erasure` removes
one — after which a failing job leaves satellites with nothing left to enumerate them.

The durable job outlives the account BY DESIGN and the manifest is FROZEN before the crossing, and
`executeDeletion` already resumes from the cursor against that manifest without re-deriving targets.
So no new machinery was needed: the job simply had to become a candidate source in its own right.

Proven against live Preview data, in one dry run:

```
syntheticCandidates : 0     <- the OLD model's entire candidate source
ownerNamedJobs      : 13
jobDerivedCandidates: 12    <- the NEW model
byJobClass: CANCELLED_PRE_IRREVERSIBLE 1 · FAILED_RETRYABLE_PRE_IRREVERSIBLE 6 ·
            FAILED_RETRYABLE_POST_IRREVERSIBLE 6
```

`classifyRecoverableDeletionJob` is pure and exhaustive over 11 classes. Four outcomes, because a
job under a live claim is genuinely none of clean/resumable/escalated — contending with it is the
second-executor defect this package already fixed, so it is `revisit`ed instead. A test asserts no
classification can be silently dropped.

Automation refuses, by design: `FAILED_TERMINAL`, `CANCELLED_INVALID_AFTER_IRREVERSIBLE`,
`UNCLASSIFIED_CORRUPT`, and above all **past the crossing with no frozen manifest** — the manifest is
the only record of what was owned, and guessing from surviving objects is precisely the mistake that
produced these orphans.

### Recovery result

```
failed_retryable jobs      12 -> 0
completed jobs            173 -> 179   (6 orphaned deletions carried to completion)
jobs naming an owner       13 -> 7
accounts / email lookups / password resets    0 (unchanged)
```

Six `FAILED_RETRYABLE_PRE_IRREVERSIBLE` jobs became `FAILED_TERMINAL`: the saga refused them with
`account_deletion_manifest_missing` — no account AND no frozen manifest, so it cannot prove what it
erased and correctly will not call that success. They are pre-irreversible, so they destroyed
nothing; their accounts were erased by earlier passes before these jobs froze a manifest.

### ⛔ WS-G STILL DOES NOT PASS

```
REMAINING   6 FAILED_TERMINAL jobs naming an owner   (needsHuman by design)
            1 CANCELLED_PRE_IRREVERSIBLE job naming an owner
            1 ACTIVE canonical identity link
            2 accounts/by-line-user · 1 UserProfile · 2 AuthIdentities
            24 sessions (21 previously classified anonymous; owner-linkage needs re-checking)

CORRECT BY DESIGN   184 erased identity-link tombstones · 179 de-identified completed jobs
```

### ⛔ EXACT NEXT ACTION — and the decision it requires

The 6 terminal jobs cannot be resumed by the saga: both the account and the manifest are gone, which
is exactly the state `executeDeletion` is built to refuse. They never erased anything, and what they
still do is NAME A PERSON in the database.

That is a genuine design decision, not a mechanical fix, and it was deliberately NOT taken under
context pressure because it touches the deletion state machine:

```
OPTION A  a governed terminal de-identification — drop owner_account_id, keep owner_fingerprint,
          exactly as finalization already does. Destroys no data, removes a name, and needs a new
          legal transition because `advance` refuses forward motion once a cursor is set.
OPTION B  leave them for a human, as the classifier currently insists.
```

Option A is the better privacy outcome and is probably right, but it must be authored as a
forward-only migration with its own proof, not improvised.

Then: re-check the 24 sessions for owner linkage, resolve the 1 ACTIVE link and the LINE/foundation
orphans against their owning job, re-run to convergence, and only then run the idempotency pass and
the second authoritative sweep. WS-I..WS-K remain untouched.

---

## WS-G CLOSED — terminal de-identification (Option A) and Preview orphan remediation

Founder decision: **Option A**. A failed deletion may stop naming the person, and never claims it
succeeded.

### The transition — `202607310008`, PREVIEW_ONLY, forward-only

```
FAILED_TERMINAL_DEIDENTIFIED  is NOT completed · is NOT a successful erasure · is NOT cancelled
```

State stays `failed_terminal`; `owner_account_id` and the executor claim are dropped;
`owner_fingerprint`, `last_error_code`, `terminal_deidentified_at` and a bounded reason are kept.

`yorisou_account_deletion_jobs_owner_shape` was **extended by exactly one case**, not relaxed — a
`failed_terminal` job that has NOT been de-identified must still name its owner, because that id is
the join key the whole recovery model depends on. A second constraint,
`..._terminal_deid_shape`, re-expresses every eligibility rule as a table invariant, so even a direct
UPDATE cannot forge this state for a job that crossed the irreversible boundary.

Eligibility is re-evaluated INSIDE the transaction under a row lock. Five independent refusals: wrong
state, past the crossing, cursor contradicting the crossing, frozen manifest present (it can still be
RESUMED, and resuming is strictly better), live executor claim, unrecognised reason.

**Harness scenario 55**, 55/55 passing, includes the negative control: before the transition existed
the constraint itself refused to null the owner, and a forged post-crossing de-identification is
still refused by the table.

### Preview orphan remediator — operator-only, Preview-only

Satellites became unreachable once their accounts and manifests were gone. The remediator derives
candidates from **dangling owner references** and removes them through the SAME narrow adapters the
product's own erasure uses (`eraseCanonicalIdentityLinks`, `deleteFoundationRecord`,
`deleteSharedIdentityObject`). It accepts no id, key, prefix, table or email.

Its safety argument is re-checked at runtime rather than assumed: it **refuses to run at all** if any
unclassified Preview account exists, because "every account here was synthetic, so a dangling owner
was synthetic" is the only thing making the removals safe.

### Sequencing correction, recorded rather than glossed

The controller warned not to de-identify before remediating satellites, since it can destroy the only
join key. **I de-identified first.** It was recoverable only because the satellites carry their own
owner references (`owner_account_id` on the link row, `legacyAccountId` on foundation records,
`accountId` in the LINE lookup), so enumeration ran from the satellites instead of the jobs. The
order in §9 is the safer one and should be kept.

### The seventh job

Classified authoritatively as `cancelled`, pre-irreversible, cursor null — a legitimate cancellation.
But its account was gone, so it could not be a *live* cancellation. Driven through the governed path
(reopen → advance → execute, which refused with `manifest_missing` and landed terminal) and then
de-identified. No hand-editing.

### WS-G PASS — independent authoritative sweep, not the tools' own output

```
synthetic account objects        0     ACTIVE identity links            0
synthetic email lookups          0     jobs retaining owner identity    0
synthetic LINE lookups           0     failed_retryable jobs            0
synthetic password resets        0     owner-linked sessions            0
foundation UserProfiles          0
foundation AuthIdentities        0

RETAINED, CORRECT BY DESIGN
  185 erased identity-link tombstones (content-free)
  179 de-identified completed deletion audits
    7 terminal-deidentified failure audits  <- new, and deliberately NOT "completed"
   21 anonymous unowned sessions
    1 provisioning saga, account_id de-identified — content-free, names nobody
```

Both idempotency runs are clean: the cleanup reports "nothing to clean" against **both** sources
(`surviving_accounts`, `durable_owner_named_jobs`) and the remediator finds 0 dangling orphans.

### Hosted evidence preserved — proven, not assumed

```
HOSTED_RUNTIME_AFFECTING = 0

.github/workflows/…            GOVERNANCE_ONLY
docs/…                         DOCS_ONLY
lib/server/__tests__/…         TEST_ONLY
lib/server/deletionJobRecovery.ts        OPERATOR_ONLY  (0 importers outside scripts/tests)
lib/server/previewSyntheticClassifier.ts OPERATOR_ONLY  (0 importers outside scripts/tests)
package.json                   GOVERNANCE_ONLY (scripts only, no dependency change)
scripts/…                      OPERATOR_ONLY
supabase/MIGRATION_SCOPE_MANIFEST.md     GOVERNANCE_ONLY
202607310008_…sql              DATABASE_OPERATOR_ONLY — 0 app-runtime callers of the new RPC,
                               defines exactly ONE new function and redefines none, and the
                               owner_shape predicate is unchanged for every job the runtime
                               writes (terminal_deidentified_at is always null there)
tests/por1/postgres-integration.sh       TEST_ONLY
```

```
accepted_application_sha    03075711269e0f31e58d79b25a2ca690f4047589
last_accepted_candidate_sha 03075711269e0f31e58d79b25a2ca690f4047589
```

WS-I2..WS-I12, WS-J and WS-K remain.

---

## WS-I2 — the Production promotion contract, extracted and classified

Production drift reconciled first, read-only: **12 migrations · 42 public tables · 0 POR-1 objects ·
`yorisou_private_recommendations` present**. No drift since the WS-H audit.

### The promotion delta, computed rather than assumed

Diffing the live Preview and Production catalogues gives the exact set — not "the 23 Preview
migrations", which is a history, not a contract:

```
TABLES  15   in Preview, absent from Production
  yorisou_assessment_attempts · yorisou_assessment_results · yorisou_interpretation_responses
  yorisou_canonical_recommendation_sets / _items / _actions
  yorisou_canonical_identity_links · yorisou_identity_provisioning_sagas
  yorisou_canonical_line_events · yorisou_canonical_line_subjects
  yorisou_account_mutation_gates · yorisou_account_mutation_leases
  yorisou_account_deletion_jobs · yorisou_account_deletion_audit
  yorisou_account_deletion_manifests

FUNCTIONS  74   (Preview 86 yorisou_* − Production 12)
  26 account deletion · 12 canonical LINE activity · 11 assessment core
  11 identity provisioning · 7 mutation fence · 6 canonical identity links
   4 interpretation · 3 canonical recommendations
```

Six Preview `yorisou_*` tables are NOT in the delta — the DCI-1 and YV-1 families are already
Production lineage (`202607200005`, `202607210001`).

### THE KEY EXTRACTION INSIGHT

The 24 Preview migrations are a HISTORY: 9 of them create tables, and the other 15 are almost
entirely `create or replace function`. A later migration silently supersedes an earlier definition,
so **the last definition wins and the intermediate ones are dead**. Promoting the sequence would ship
every superseded version and then overwrite it — 6,300 lines to arrive at a state the live Preview
catalogue already holds exactly.

So the Production set is derived from the FINAL PREVIEW CATALOGUE, which is the state the accepted
application (`0307571`) was actually proven against, with the migration history used only for intent
and for the invariants each correction was written to protect.

### Classification of all 24 PREVIEW_ONLY migrations

```
CONSOLIDATE_INTO_FINAL_CONTRACT — the 9 table-creating migrations contribute their final table
  shape; the 15 function-only ones contribute only their FINAL surviving definitions:
    202607270001 (3 tables, 7 fns) · 202607280004 (3 tables, 4 fns)
    202607300003 (2 tables, 7 fns) · 202607300004 (2 tables, 7 fns)
    202607300005 (1 table, 19 fns) · 202607310001 (1 table, 8 fns)
    202607310002 (1 table, 7 fns) · 202607310003 (1 table, 11 fns)
    202607310004 (1 table, 5 fns)

SUPERSEDED (intent retained, SQL not promoted — each redefines a function a later migration or the
  final catalogue replaces):
    202607270003 · 202607270004 · 202607280001 · 202607280002 · 202607280003
    202607280005 · 202607280006 · 202607280007 · 202607300001 · 202607300002
    202607310005 · 202607310006 · 202607310007 · 202607310008

    NOTE: superseded means the SQL text is not copied. Every INVARIANT these introduced is a
    promotion requirement in its own right, because each was written to close a specific defect:
    the same-owner identity-link race (005), additive-only link sync (006), the deletion-open race
    (007) and terminal de-identification (008). The promotion set must carry the FINAL function
    bodies that contain those repairs, and the permanent proofs must survive promotion.

PREVIEW_FIXTURE_ONLY / DO_NOT_PROMOTE:
    202607270002 (0 objects — a Preview persistence rollback step, no contract)
```

### The rehearsal baseline is NOT the Preview schema

`yorisou_private_recommendations` is present in Production and absent from isolated Preview, so the
disposable rehearsal must be built from the **12 Production migrations + fixtures + the new promotion
set** — never from the Preview schema, which cannot prove that table's erasure.

## ⛔ REMAINING — honestly scoped

WS-I3 onward is the largest single body of work left in the package, and it is now precisely
measured rather than estimated:

```
author  15 tables + 74 functions + indexes + RLS + FORCE RLS + grants as clean
        PRODUCTION_LINEAGE migrations, grouped by dependency / lock / rollback boundary
then    Production-shape fixtures (4 principals) · fresh rehearsal x2 from destroyed infrastructure
        populated-legacy rehearsal · old-app compatibility at main c8d8a8ad in a separate worktree
        new-app controls-off · readiness matrix · capability dependency matrix · full POR-1 journey
        all-family erasure · yorisou_private_recommendations proof · terminal-deidentification
        against the PRODUCTION contract · legacy preservation · failure injection · rollback matrix
        kill switches · observability · release sequence · Production synthetic plan
        PR #126 body · final dossier
```

---

## WS-I overlay discovery — the deletion plan was ALREADY written against Production

The controller's concern was that a byte-equivalent Preview catalogue would miss
`yorisou_private_recommendations`. The audit says the concern is right in principle and the coverage
already exists — the gap is in the PROOF, not the plan.

### The audit

```
Production tables carrying an owner-ish column      27
Production ACCOUNT-owner-linked tables              26
  (owner_account_id / actor_account_id / reporter_account_id / blocker_account_id)
covered by the deletion plan in 202607300003        26
GAPS                                                 0
```

`202607300003` names the FULL Production family list and guards each with `to_regclass`, which is
why `yorisou_private_recommendations` is in the plan despite being absent from Preview: the guard
skips it there. So the plan is Production-complete, and the Preview acceptance run simply never
exercised those families.

**`yorisou_resource_sources` is classified NOT_OWNER_LINKED**, with its reason recorded: `owner_name`
sits alongside `domain`, `source_type` and `commercial_status` — a publisher/organisation attribution
in a resource catalogue, not a link to a user account.

### Families the Preview suite can never have proven

Absent from Preview, therefore skipped by `to_regclass`, therefore erased by nothing that any green
Preview run has ever demonstrated:

```
yorisou_private_recommendations · yorisou_private_memory_items · yorisou_private_check_in_plans
yorisou_ai_reflections · yorisou_ai_runs · yorisou_test_results   (and the experience_* family)
```

Only the full Production-lineage rehearsal can close this. "The Preview train passed" says nothing
about them.

### The permanent guard

`supabase/contracts/por1-production-owner-linked-families.json` is a checked-in snapshot of the
READ-ONLY Production catalogue, so CI needs no database connectivity.
`test:por1-production-coverage` fails if any listed family stops being named by the deletion plan.

Coverage was already complete when the guard was written — so this is not a repair, it is what keeps
a NEW Production owner-linked table from being invisible: absent from Preview, skipped by the guard
clause, and named by no failing test.

## M1 — PROMOTION COMPILER AND STATIC PRODUCTION MIGRATION SET (complete)

### It is 75 functions, not 74

The 74 recorded earlier was taken before `202607310008` added
`yorisou_account_deletion_terminal_deidentify`. The delta, measured against both live catalogues:

```
15 tables · 75 functions · 2 sequences · 2 triggers · 0 policies
11 functions common to both projects, ZERO with a drifted body
no extension is required that Production lacks
```

The two sequences (`yorisou_interpretation_responses_seq`, `yorisou_recommendation_actions_seq`) and
the two append-only triggers on `yorisou_interpretation_responses` were absent from every earlier
count. Nothing in pg_depend links a free-standing counter to the table that advances it, so a
tables-and-functions diff reports a complete contract while every `nextval` fails at runtime.

### THE DEFECT THIS PHASE FOUND — seven SECURITY DEFINER functions were executable by `anon`

`has_function_privilege('anon', oid, 'EXECUTE')` was TRUE in Preview for:

```
yorisou_identity_links_erase(text)                      ← erases an owner's canonical links
yorisou_identity_links_sync(text, text, jsonb)          ← writes them
yorisou_identity_links_retire(text, text, text)         ← retires one
yorisou_identity_link_owner(text, text)                 ← link digest  → owner account id
yorisou_identity_links_for_owner(text)                  ← owner account id → links
yorisou_identity_links_residue(text)                    ← probes by owner fingerprint
yorisou_account_deletion_terminal_deidentify(text,text) ← forces terminal de-identification
```

PostgREST publishes public-schema functions as `POST /rest/v1/rpc/<name>` and the anon key is public
by construction, so each was one unauthenticated call away from erasing, writing or disclosing
canonical identity for any account id a caller could name.

**Two independent root causes, which is why one fix would not have been enough.**

1. `202607310004` contains NO function grant statement at all — only a table grant block.
   `CREATE FUNCTION` grants EXECUTE to PUBLIC by default, so the six identity-link functions simply
   kept it. The migration is not wrong about anything it says; it is silent, and silence defaults to
   open.
2. `202607310008` revoked from `anon` and from `authenticated` and granted `service_role` — which
   reads exactly like the correct block and is not. **Revoking from a role does not remove a
   privilege the role holds through PUBLIC.** Both revokes succeeded, changed nothing, and reported
   success.

Repaired in Preview by `202608010001` (PREVIEW_ONLY, applied and verified: 0 SECURITY DEFINER
functions anon-executable). Production never had these functions, so Production was never exposed —
and the promotion set is built so it cannot inherit the hole.

`yorisou_line_subject_lock` keeps EXECUTE for nobody but its owner, deliberately: 202607310002
states it is a row-lock building block, not an entry point. Recorded so a future blanket grant
cannot quietly undo it.

`yorisou_dci_block_mutation` / `yorisou_values_block_mutation` remain PUBLIC-executable and were NOT
touched: they already exist in Production with this exact shape, so they are legacy lineage, and
their entire body raises. Recorded, not bundled into a POR-1 change.

### The compiler

```
scripts/por1/extract-catalogue.mjs      catalogue → sanitized contract (Management API or local psql)
scripts/por1/normalize-sql.mjs          associative-boolean normalization (13 unit tests)
scripts/por1/promotion-plan.mjs         the ONLY hand-authored input: grouping + reviewed decisions
scripts/por1/compile-promotion.mjs      contract → static PRODUCTION_LINEAGE SQL
scripts/por1/verify-promoted-contract.mjs  live catalogue vs contract
scripts/por1/rehearse-promotion.sh      destroy → 12 baseline → 8 promotion → shape
```

Derivation is from the FINAL catalogue via `pg_get_functiondef`, never from the 24-migration Preview
history — `create or replace` means only the last definition is live, so promoting the history would
promote bodies that were already replaced, including the ones replaced BECAUSE they were wrong.

**Ordering is not a preference; PostgreSQL enforces it.** A plpgsql body is compiled at CREATE time
and every relation it names is resolved then, so a function cannot precede the tables it reads —
this is not a plpgsql-is-lazy situation, and assuming otherwise cost one failed apply. Four
functions genuinely cross domains and are deferred by fixpoint to a cross-domain migration:

```
yorisou_account_deletion_erase_database · yorisou_account_mutation_begin
yorisou_account_mutation_gate_finalize  · yorisou_assessment_result_erase
```

A CHECK constraint calling a promoted function (`yorisou_jsonb_object_length`) forced the opposite
rule inside a group: functions the table DDL needs are emitted BEFORE the tables.

### The emitted set

```
202608010101  P1  assessment attempts / results / interpretation   3 tables · 11 fn · 1 seq · 2 trg
202608010102  P2  canonical recommendations                        3 tables ·  3 fn · 1 seq
202608010103  P3  canonical identity links + provisioning saga     2 tables · 17 fn
202608010104  P4  canonical LINE subjects / events                 2 tables · 12 fn
202608010105  P5  account mutation gates and leases                2 tables ·  3 fn
202608010106  P6  deletion jobs / manifests / audit                3 tables · 25 fn
202608010107  P7  cross-domain functions                                    ·  4 fn
202608010108  P8  whole-contract assertion
```

All eight registered PRODUCTION_LINEAGE. Additive only — no drop, no alter, no backfill, no write to
an existing Production table — so with the capability controls unset the schema is inert and the
incident response is to disable the capability and roll back the application, not to unwind schema.

### Tables are created under a shape guard, never `create table if not exists`

A pre-existing repository guard (`test:por1-namespace`) rejected the first emitted set, and it was
right to. `create table if not exists` is SILENT when the name is already held by a differently
shaped table: green ledger, and every function that reads it failing at runtime on a missing column.

That hazard is not hypothetical here. Production holds `yorisou_recommendation_{sets,items,actions}`
from the legacy recommendation graph (202607110003) with real rows, and `202607300002` exists
precisely because promoting the CPC-1 family on top of them would have no-opped. The direction is
worth stating exactly, because the first reading of it was wrong: the Preview canonical tables are
NOT Production's legacy tables renamed. They are the CPC-1 tables, created under the legacy NAMES on
Preview (where Production's legacy family does not exist) and then renamed into the canonical
namespace to get out of the way. So in Production the canonical names are genuinely absent, the
promotion genuinely creates, and Production's legacy recommendation graph is never touched.

Every promoted table is now created inside a guard that creates when the name is free and RAISES,
naming the differing columns, when it is not. Proven by negative control — a squatter table under
`yorisou_canonical_recommendation_sets` with two columns:

```
POR-1: yorisou_canonical_recommendation_sets already exists with a different shape
       (differing column(s): accepted_result_id, content_version, created_at, eligibility_basis,
        generated_at, lifecycle_state, original_result_id, owner_account_id, project_id,
        result_row_id, source_surface). Refusing to promote onto it.
```

### Verified, not asserted

```
compiler determinism        recompile → drift 0
Rehearsal A (PG 17.10)      12 baseline + 8 promotion applied from a DESTROYED database
Rehearsal B (PG 17.10)      independently destroyed and recreated
catalogue hash A == B       91b67372b04becc4…  IDENTICAL
re-apply onto Rehearsal A  catalogue hash unchanged
shape-guard negative ctrl   refuses to promote onto a wrong-shaped squatter
contract verification       15 tables · 75 functions · 2 sequences · 2 triggers · 0 failures
anon-executable DEFINER     0
RLS enabled AND forced      15 / 15
```

The rehearsal runs on **PostgreSQL 17**, matching Production and Preview (both 17.6). The local
default was 16.14; a constraint compared unequal, and rather than normalize the difference away it
was checked — the same difference appeared on 17, so it was associativity, not the version. Both
were fixed: the rehearsal now refuses any major other than 17, and the normalizer flattens ONLY
parentheses whose removal associativity guarantees. Its negative controls are the point: `(A OR B)
AND C` and `A OR (B AND C)` must stay unequal.

### What is proven, and what is only named

`test:por1-promotion-contract` (16 tests) and `test:por1-sql-normalizer` (13 tests) run in CI with no
database. They prove the promoted contract's shape, privileges, `search_path`, RLS, additivity, and
that the promoted bodies still carry the corrections their superseded versions were replaced for.

They do NOT prove erasure. The Production-only families are still named by the plan and exercised by
nothing. That remains M4's job and nothing static substitutes for it.

## M2 — POPULATED PRODUCTION-LINEAGE REHEARSAL (migration + fixture portion COMPLETE)

`tests/por1/populated-lineage-rehearsal.sh` — disposable PostgreSQL 17 (own initdb, own port,
destroyed on exit) → 12 Production baseline migrations → two principals seeded across every
owner-linked contract family → 8 promotion migrations onto POPULATED data → negative controls.

```
owner-linked contract families      26 / 26 for Principal A AND Principal B
promotion onto populated data       all 8 applied
pre-existing tables unchanged       YES — row counts AND full-content md5 fingerprints identical
promoted contract                   15 tables · 75 functions · 2 sequences · 2 triggers · 0 failures
anon / authenticated / PUBLIC executable SECURITY DEFINER    0 / 0 / 0
RLS enabled and forced              15 / 15
negative controls                   6 / 6 rejected for the intended reason
```

### The rule the fixture now states

```
Generic where structurally safe; explicit domain overrides where relational invariants exist.
```

The introspective seeder fills each column independently. That is right for a table whose columns
are independent and wrong for one whose constraint RELATES two of them.
`yorisou_recommendation_items` carries

```
check ((resource_id is not null)::int + (experience_id is not null)::int = 1)
```

an XOR encoding a domain fact — an item recommends a resource OR an experience, never both, never
neither — which is not recoverable from column types. Making the seeder cleverer could not fix that
honestly. `tests/por1/fixture-override-registry.sql` declares the five tables that need explicit
construction, each with its reason, required parents and invariant; `tests/por1/fixture-overrides.sql`
builds one semantically coherent graph per principal:

```
owner → recommendation set → resource-backed item (rank 1) → action + report
```

No constraint is disabled, no schema altered, no check suppressed.

### The two seeders must not both touch a table

Splitting the registry into its own file was not tidiness. With both seeders live, the generic pass
for Principal B found the item Principal A's override had just created and attached B's
recommendation action to A's item. The cross-principal assertion caught it — but a fixture whose
halves can produce a cross-owner reference at all is not one to trust. The generic seeder now skips
every table in the override registry.

### Counts are reported separately, never conflated

```
owner-linked contract families unpopulated   → FATAL (a hole in the erasure proof)
supporting non-owner tables unpopulated      → classified and reported, not fatal
declared overrides inserting zero rows       → FATAL (a false green)
```

Seven supporting tables remain unpopulated with explicit reasons (a singleton control table, four
awaiting parents outside the owner-linked set, two format-checked columns). None is a contract
family.

### Negative controls — why the coverage claim means something

A fixture that builds a legal graph proves only that a legal graph is buildable. Each control must
fail for the INTENDED reason; a NOT NULL violation standing in for a cross-column check would be a
false pass. One of them caught exactly that on first run — the rejection was correct and my expected
constraint name was not.

```
item with BOTH resource_id and experience_id      → yorisou_recommendation_items_check
item with NEITHER                                 → yorisou_recommendation_items_check
item with rank outside 1..5                       → rank_check
action with a too-short idempotency key           → idempotency_key_check
duplicate report for the same (owner, item)       → unique violation
por1a action against por1b's item                 → the FIXTURE assertion
```

The last is the important one: the database does NOT forbid a cross-principal pairing — no
constraint relates an action's owner to its item's set owner — so only the fixture's own assertion
stands between a plausible-looking 26/26 and an erasure proof built on someone else's rows.

### Three seeder defects found and fixed on the way

Each had made the run look better than it was:

```
lifted the first quoted literal from EVERY check — in `input_hash ~ '^[a-f0-9]{64}$'` that literal
  IS the pattern (4 families); the constraint's SHAPE is now classified first
kept the PREVIOUS column's parent key when a lookup found nothing, writing a stale value into an
  unrelated foreign key (5 families)
skipped a family whose parent did not exist yet WITHOUT recording it, then reported "0 failed" —
  the exact mistake this fixture exists to prevent
```

### Not yet done in M2

```
old-application compatibility at main c8d8a8ad in a temporary worktree
new-application controls-off run
PostgreSQL 17 parameterization of tests/yorisou-values/fullstack-local.sh
Principals C and D
```

## ⛔ REMAINING — finish M2, then M3 onward





```
M2  per-table fixture overrides for cross-column checks (recommendation_items and its two
    owner-linked children) · Principals C and D · old-app compatibility · new-app controls-off
M3  old-app compatibility at main c8d8a8ad in a temporary worktree · new-app controls-off
    readiness matrix · capability dependency matrix
M4  full POR-1 journey · security matrix · ALL-FAMILY erasure including the Production-only
    families above · no-recreation · terminal de-identification · legacy preservation
M5  failure injection · rollback classification · kill switches · observability · release runbook
M6  PR #126 body replacement · final dossier · governance closeout
```
