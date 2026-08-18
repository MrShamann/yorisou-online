# OSF-1 — INTERNAL access E2E and kill-switch rehearsal: verified blocker

**Status: RESOLVED 2026-08-17.** `tests/life-os/internal-access.sh` now passes with **42 assertions**,
including the live kill-switch cycle. This document is kept as the diagnosis record, because the way
the blocker dissolved is more instructive than the blocker was.

**What it actually took — and what it did NOT take.** The earlier conclusion, "this needs MinIO or an
equivalent S3 service, which is a supply-chain decision for Edward", was wrong in an interesting way.
Three things were needed, and none of them was a new dependency:

1. **A real four-verb S3 server.** `tests/life-os/disposable-s3.mjs`, ~60 lines of node. The identity
   store is object-store backed (`phase1/foundation-v1/…`), not PostgreSQL — which is why the
   diagnostic showed `user_profiles` and `auth_identities` as `n/a`: those tables never existed.
2. **The POR-1 schema-ready flags.** In a production context registration goes through canonical
   identity provisioning, which is gated the same way the Life OS is. Without them the failure class
   was `canonical_identity_failed`, which the first attempt mis-attributed to the object store.
3. **A REAL `ListObjectsV2`.** This was the last mile and the most instructive. The first version of
   the S3 server answered listings with `KeyCount 0` as a "harmless simplification". The foundation
   store finds records by enumerating a prefix, so an empty listing made every lookup return
   nothing — surfacing as `missing_user_profile` and a 503 that looked exactly like a missing service.

The general lesson, recorded because it will recur: **a stub that is wrong in a plausible direction
costs more than no stub at all.** Two of the three dead ends here were caused by a fake that answered
confidently instead of failing loudly.

---

## Historical record — the blocker as it stood on 2026-08-15

---

## What was attempted

A true-production INTERNAL rehearsal on a disposable stack: PostgreSQL 17 + PostgREST + a production
Next build started with

```
VERCEL_ENV=production
YORISOU_PRIVATE_PILOT_FLAGS=osf1_life_os_internal
YORISOU_ADMIN_EMAILS=<founder>
YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true
```

`VERCEL_ENV=production` is required and not negotiable: `lifeOsInternalAccess()` returns
`not_production` in every other context, so INTERNAL simply cannot be exercised outside a production
deployment context. There is no test flag that opens it, by design.

## What actually happened, in two stages

**First: the app would not boot.** Every route returned 500 with
`production_shared_store_not_production` from `lib/server/sharedStoreBoundary.ts:143` — a real safety
guard: a production context with no shared store configured is refused at module load.

Satisfying it with a production-shaped configuration (a non-Preview bucket, a non-Supabase endpoint)
got the app to boot. **Then registration returned 503.** The identity store cannot write to a stubbed
endpoint, so no session can be created.

## Why that is fatal to the test rather than a detail

Everything the rehearsal asserts distinguishes a founder from an ordinary account. **With no session
at all, both get 404** — so every "the ordinary account is refused" and every "the bypass fails"
assertion passes while proving nothing. An earlier run of this harness produced exactly that: a
screen of green ticks underneath a founder who was never signed in, and a kill-switch "measurement"
taken against a 404 that had nothing to do with the kill switch.

The harness now aborts at the precondition. It reports one `BLOCKED` line and exits 2.

## What would unblock it

A production-shaped **identity store** the auth layer can actually write to — in practice an
S3-compatible service such as MinIO, run disposably alongside PostgreSQL and PostgREST.

That is the same class of decision as PostgREST in CI: adding a binary or container to the test
supply chain, which is Edward's call rather than something to slip in. It is a few hours of work once
the decision is made, and the harness is already written to use it — only the store is missing.

## What is consequently NOT proven

- that a Founder/Admin reaches the Life OS in true production while an ordinary account gets 404;
- that no query parameter, body field, header or forged cookie grants authority **in production**
  (the same attempts are refused in the test context, but that context does not exercise
  `lifeOsInternalAccess`);
- **that the kill switch works.** Release & Acceptance Gates v1.0 §3.4 requires a live test before
  exposure. It has still never been fired, and its recovery class — no restart, process restart, or
  redeploy — remains **unmeasured**.

## What IS proven, and should not be confused with the above

The access *decision* is unit-tested (`osf1Activation.test.ts`): INTERNAL is decided by
`lifeOsInternalAccess` over `viewerHasAdminAccess`, no client-supplied role reaches it, PUBLIC is
unreachable, and every denial collapses to one 404. The routes, APIs and mutations all work for a
signed-in person in a trusted test context, verified by the authenticated accessibility suite.

None of that substitutes for the production-context rehearsal, and this document exists so that it
is never reported as if it did.
