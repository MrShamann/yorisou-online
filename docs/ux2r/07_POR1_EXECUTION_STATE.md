# POR-1 — Execution State (durable)

> Resume point for `YORISOU_POR_1_FULL_PRODUCTION_OPERATIONALIZATION`.
> Read this and `06_POR1_MIGRATION_PROMOTION_ARCHAEOLOGY.md`. Do **not** repeat completed archaeology.

## Position

```
Branch      : feat/ux2-integrated-core-experience
PR          : #126 (DRAFT / OPEN / UNMERGED, base main)
HEAD        : see `git rev-parse HEAD` — last recorded: a78c4e5 + this commit (WS1-WS7)
Production  : main @ c8d8a8ad6a72949c248adb098a626d1ab9d6a579 — UNTOUCHED
Preview DB  : yorisou-preview (nbltsbonsnbpfptihomc)
Migrations  : PRODUCTION_LINEAGE 12 · LOCAL_ONLY 4 · PREVIEW_ONLY 14
Status      : POR-1 in execution. No merge, no Production migration, no Production deployment.
```

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

### ⛔ OPEN — the residue is CONCURRENCY-dependent

Isolated by bisection, and this is the fact the next session should start from:

```
accountDeletion.spec.ts, --workers=1  → 10 passed
full train,              --workers=2  → identity_residue:account_record,account_resolvable
```

Also established by direct probe against the hosted deployment: a plain deletion completes, and a
deletion after request→cancel completes. Neither the data shape nor the cancel path reproduces it.

So an account record is being written back by a CONCURRENT in-flight request that loaded it before
the lock. That is exactly the stale-write resurrection the CTO directive anticipates, and the fix is
the ordinary-account-mutation guard: once the durable deletion state is at or past `locked`, every
ordinary account write is denied — support profile, password, LINE binding, upsert, session upgrade,
recovery — with only the deletion executor's own narrow lock/delete operations permitted.

Do NOT attempt this with a request-body flag or a generic privileged upsert.

## Remaining CTO sequence (D onward)

```
D. stale-write mutation guard          <- START HERE; the isolated defect above
B. durable retry cursor migration      (forward-only, after 202607300003)
E. canonical key module (lib/server/sharedIdentityKeys.ts)
G. complete deletion target inventory  (password-resets, consultations, LINE events/index)
H. durable target manifest             (resume without re-reading a deleted account)
J. focused isolated-store transport proof, per family
K. fully populated deletion lifecycle  (LINE-bound, multi-session, reset token, consultation)
L. complete exact-SHA hosted train
M-W. cleanup, bucket audit, WS9 promotion delta, rehearsal, merge, activation, closeout
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

## CONTINUATION_CURSOR

```
next_action: D — the ordinary-account-mutation guard. The residue is concurrency-dependent
  (serial 10/10, concurrent fails); a stale in-flight write resurrects the account after the lock.
last_full_train: 86 passed / 2 failed at 9847559 (both failures are the same residue defect).
last_serial_deletion_run: 10/10 at 9847559.
preview_isolation_state: REPAIRED and proven at object level. All three Preview scopes isolated.
  Permanent runtime guard + acceptance gate + env audit in place.
production_mutation_state: NONE. main c8d8a8ad, 12 migrations, 42 tables, canonical objects absent.
rollback_state: nothing to roll back; every change so far is branch-local or Preview-only.
lock_state: released at session boundary (see lock file).
```
