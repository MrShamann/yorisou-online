# OSF-1 Phase 1 — Internal Beta Readiness

**Base:** `main` @ `f6bb81f` · **Branch:** `feat/osf1-internal-beta-readiness` · **Written:** 2026-08-15
**State transition:** `MERGED_NOT_ACTIVATED` → **`INTERNAL_BETA_READY`** (code), with migration and
activation still awaiting Edward.

> This document authorizes nothing. It records what is implemented, what was tested, what is still
> open, and what only Edward can decide.

---

## 1. Governance the package named, and what actually binds

The package cites "YORISOU v0.7.0 governance". **No v0.7.0 governance pack exists.** The effective
corpus is **Governance Pack v0.4.1** (`resources/governance/current/RESOURCE_MANIFEST.md`), holding
Project Constitution **v0.4.0** and Technical Architecture **v0.4.0**. The only `v0.7.0` strings in
the repository are in OSF-1 *product* docs, where it names the product package. This work follows the
real corpus. The mismatch has now surfaced three times and is worth correcting in the template.

Two binding rules the package did not name, but which bear directly on it:

- **Data & Privacy v1.0 §3.4** — "Test-product data … NEVER crosses into companion memory (hard
  rule, restated)." The Imairo boundary is a governance hard rule, not a design preference. Now
  asserted directly against the read paths (`osf1InternalBeta.test.ts`).
- **Release & Acceptance Gates v1.0 §3.4** — "Kill switches must be live-tested at every Production
  Release Gate before exposure." Internal activation therefore requires a **live** kill-switch test,
  not a flag flip. Recorded in the runbook as a precondition.

**A pre-existing governance divergence, larger than this package's brief.** Personal Archive & Memory
Governance v1.0 §3.1 names `memoryLifecycleService` as the sole write path and
`permissionCheckService` as the sole read gate. **Neither exists.** The implementation achieves the
substance — one write path through a `SECURITY DEFINER` RPC, owner-scoped reads — under different
names. §3.2 also requires that users can "view, correct, suppress, revoke, delete — each with visible
confirmation and (for deletion) a **receipt**". View, correct and delete exist. **Suppress, revoke
and the deletion receipt do not.** This is a real gap and it is Edward's call whether internal beta
proceeds without them.

## 2. What this package changed

### Gate 3 — migration readiness (§2)
`tests/life-os/gate3-migration-rehearsal.sh`, **40 assertions, PASS**. Rehearses baseline → apply →
validate → documented rollback → validate → **re-apply** → validate identically, against a disposable
PostgreSQL 17 cluster. Full evidence in `OSF1_GATE3_MIGRATION_READINESS.md`. Now runs in CI as its own
job. The reverse path had never been executed before this package.

### Transactional audit (§3)
Already implemented by `202608160001`; this package **proved** it. A trigger forces the audit insert
to fail; the reflection and memory rows are then confirmed absent; the trigger is dropped and the same
call succeeds with exactly one audit row. Without that last control the test would only have proven
the function was broken. A delete matching nothing writes **no** audit row, so nobody can manufacture
a deletion record for an id they do not own. `RETENTION_POLICY_TBD` is unchanged and no period was
invented.

### Private experience trust model (§4)
Three real defects fixed:
- the reflection flow disclosed **after** the person had written everything — the one moment a
  disclosure cannot inform a decision. It is now on the first question, before any input.
- the older `/experiences` hub disclosed **nothing**, while writing to the same table through the
  same `trustFlags` path. It now carries the same promise, above the input fields.
- `privacyCopy.ts` named a test file that **did not exist**. `osf1PrivacyCopy.test.ts` exists now, 6
  assertions, and pins the before-typing property, parity across both surfaces, and the absence of
  absolute-visibility claims.

The policy itself is unchanged: a PRIVATE card containing 診断/治療 language can still reach the
moderation queue. The copy names that trigger explicitly rather than hinting at it.

### Access architecture and internal beta (§14, §15)
The four-state model was **declared but inert**: `lifeOsAccess()` denies production unconditionally,
so INTERNAL behaved exactly like OFF, and `lifeOsInternalAccess()` had zero call sites outside its own
test. Internal beta was unreachable by anyone, including Edward.

`lib/server/lifeOs/routeAccess.ts` is now the single authority, used by all six pages, the API guard
and both navigation surfaces. Founder/Admin is resolved by `viewerHasAdminAccess` over the validated
session — the same mechanism `pilotRouteAccess.ts` already uses for the DCI/YV pilots. There is no
role claim a caller can supply because no code reads one. Every denial collapses to one 404, so the
response is not an oracle for who is on the allowlist. **PUBLIC remains unreachable by construction.**

### API hardening (§12)
No id was validated anywhere: a non-UUID reached PostgREST, returned a 400 the store could not
classify, and left as a **500**. All five id-taking routes plus the reflection's experience link now
validate at the edge and return 422.

### Memory (§9)
`listMemories` capped at 50 with no cursor, so a fifty-first memory was **unreachable** — the product
had quietly stopped showing someone their own records. Replaced with keyset pagination, not a larger
cap (Memory governance §4 prohibits bulk reads). Keyset rather than OFFSET because offset pagination
over a deletable list silently skips rows. Ordering is `(created_at desc, id desc)`; the id tiebreak
is what makes the cursor stable.

### Assistant (§8)
Output was capped at 4000 characters, but a draft is applied into `next_time`, which stores 2000 — the
assistant could produce a draft the person accepted and then could not save. Both are 2000, and
over-length is **refused, never truncated**. Modes are validated against the closed vocabulary; an
unsupported mode is refused rather than silently downgraded.

### Observability (§17)
Seven operational events, with redaction as a property of the **type**: there is no message, detail or
payload field, so a caller cannot log a reflection because no parameter would accept one. The actor is
the same sha256 fingerprint the audit table stores. Wired into audit-write failure, gate denials,
schema-not-ready and unclassified mutation failures.

### Goal and CurrentState boundaries (§5, §6)
Both were enforced only by comments. Contract tests now reject the prohibited status vocabulary
(`failed`/`overdue`/`missed`/`late`), assert `released` remains an equal outcome to `achieved`, forbid
pressure-bearing fields on the goal write path, and assert the Imairo hard rule against the actual
read paths.

## 3. Accessibility (§16)

**Authenticated, real content, PASS: 14/14, 0 serious, 0 critical.**

`tests/life-os/fullstack-a11y.sh` builds a disposable PostgreSQL + PostgREST + production Next build,
registers a real account through `/api/auth/register`, seeds a current state, goal, experience, light
reflection, postmortem and confirmed memory through the real `/api/life/*` endpoints, then scans:

| Route | 390×844 | 1440×900 |
|---|---|---|
| `/life` | PASS | PASS |
| `/life/timeline` | PASS | PASS |
| `/life/reflect` | PASS | PASS |
| `/life/reflect?mode=postmortem` | PASS | PASS |
| `/life/goals` | PASS | PASS |
| `/life/experience` | PASS | PASS |
| `/life/memories` | PASS | PASS |

Each scan asserts the **authenticated** page rendered — the sign-in prompt absent, a known real
element present. A green scan against an auth wall is worse than no scan, so that guard is the
load-bearing line.

### CI status — the honest position

**The authenticated a11y harness is NOT in CI, and this is a documented blocker, not an oversight.**

The exact blocker: the harness needs a `postgrest` binary. GitHub's `ubuntu-latest` image does not
include one, and PostgREST is not installable from the runner's apt sources. Putting it in CI requires
either downloading a pinned release binary from GitHub and verifying its checksum, or running the
official `postgrest/postgrest` container as a service — **both add a new external dependency to the CI
supply chain, which is Edward's decision to accept, not mine to make quietly.**

Until that decision: **`npm run test:osf1-a11y-authenticated` is a MANDATORY LOCAL RELEASE GATE** and
must be run and recorded before any activation step in the runbook. The test was not weakened, not
stubbed, and not reported as CI-green.

What **was** added to CI: the Gate 3 rehearsal job, which needed no new dependency and was covering
nothing before.

## 4. Test totals

| Suite | Result |
|---|---|
| Node contract/boundary suites (8 files) | see PR body for the executed totals |
| PostgreSQL acceptance | 74+ assertions |
| Gate 3 rehearsal (rollback + re-apply) | 40 assertions |
| Authenticated axe, 7 routes × 2 viewports | 14/14, 0 serious, 0 critical |
| Imairo protected-asset snapshot | unchanged, 8 groups |

## 5. Activation status

| | |
|---|---|
| **Code** | READY |
| **Migration** | READY_FOR_FOUNDER_AUTHORIZED_APPLY — rehearsed forwards and backwards; applied nowhere |
| **Internal access** | READY — implemented and wired; requires the pilot flag plus an admin account |
| **Preview** | NOT ENABLED |
| **Public** | NOT AUTHORIZED, and unreachable in code |
| **Production Life OS** | OFF |

Nothing in this package applied a migration, set a flag, or exposed a route.

## 6. Open Founder decisions

1. **Audit retention.** `RETENTION_POLICY_TBD`. Privacy v1.0 §3.2 requires enforced expiry; the table
   currently has none. Live divergence.
2. **`yorisou_identity_provisioning_sagas` survives account deletion** — *proven*, with
   `account_id` readable afterwards. Evidence and three options in `OSF1_FOUNDER_DECISIONS.md` §3.
   POR-1 owns the table, so the fix needs POR-1's own gate.
3. **Memory governance §3.2 completeness** — suppress, revoke and the deletion receipt do not exist.
   Does internal beta proceed without them?
4. **CI supply chain for PostgREST** — accept a pinned binary or container in CI, or keep the
   authenticated a11y run as a mandatory local gate.

   **Superseded 2026-08-17.** It is in CI — `.github/workflows/osf1-life-ci.yml`, green — and the
   recorded blocker was never a property of CI. See PHASE1_PRODUCT_TRUTH.md and risk #6.
5. **Transactional audit trade-off, now live** — a person can lose a reflection if the audit table is
   unavailable. Implemented as the package directed; flagged because it is a product consequence.

## 7. Known risks carried

- The Life OS has never run against **hosted** Supabase. Role sets and extension schemas differ from
  a disposable cluster; that is why `yorisou_osf1_audit_write` uses built-in `sha256` rather than
  pgcrypto's `digest`. First hosted apply is still a first.
- `GET /api/life/assistant` returns 405 where every sibling returns 404, disclosing that the path
  exists. No data or capability is exposed. Not fixed here — it predates this package and this
  package's brief did not include it.
- Timeline and return-loop reads remain bounded by fixed limits rather than cursors. Reachable today;
  worth revisiting if internal beta produces volume.
