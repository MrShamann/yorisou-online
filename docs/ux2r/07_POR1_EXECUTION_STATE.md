# POR-1 — Execution State (durable)

> Resume point for `YORISOU_POR_1_FULL_PRODUCTION_OPERATIONALIZATION`.
> Read this and `06_POR1_MIGRATION_PROMOTION_ARCHAEOLOGY.md`. Do **not** repeat completed archaeology.

## Position

```
Branch      : feat/ux2-integrated-core-experience
PR          : #126 (DRAFT / OPEN / UNMERGED, base main)
HEAD        : 81f1a69c6adedf528beaa50c90c1eac68dd34747
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

## Not yet done — exact remaining sequence

1. **Account-deletion application layer.** Orchestrator in `lib/server/` driving the saga; narrow
   permanent identity-store adapter over the existing `sharedDeleteJson` / `deleteSession`
   primitives (allowlisted key patterns only: `phase1/accounts/by-id`, `accounts/by-email`,
   `sessions`, LINE lookup, consultations, password-reset); API routes; authenticated UI with
   explicit scope disclosure, reconfirmation and reauthentication; cancel-before-erasure.
   **No arbitrary object-path deletion, no generic storage admin, no temporary secret route.**
2. **Runtime activation controls.** `CANONICAL_CORE`, `ACCOUNT_DELETION_EXECUTOR`,
   `CANONICAL_RECOMMENDATIONS`, `LINE_CANONICAL_RETURN` — server-side, default OFF in Production,
   ON in Preview, fail closed when unset, each independently stoppable. Then prove
   `FLAG_OFF_BASELINE_EQUIVALENCE` before merge.
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
next_action: build the account-deletion application layer (item 1 above), starting with the
  orchestrator + identity-store adapter in lib/server/, then routes, then UI.
next_command: (after that layer exists) apply nothing new to Preview — 202607300002 and
  202607300003 are ALREADY applied — deploy the branch and run:
  EXPECTED_GIT_SHA=<sha> PLAYWRIGHT_BASE_URL=<preview-url>
  VERCEL_AUTOMATION_BYPASS_SECRET=<project bypass> SUPABASE_URL=<preview>
  SUPABASE_SERVICE_ROLE_KEY=<preview> npm run test:cpc1-acceptance
production_mutation_state: NONE. main c8d8a8ad, 12 migrations, 42 tables, canonical objects absent.
rollback_state: nothing to roll back; every change so far is branch-local or Preview-only.
lock_state: released at session boundary (see lock file).
```
