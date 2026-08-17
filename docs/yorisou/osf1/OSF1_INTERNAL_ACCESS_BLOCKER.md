# OSF-1 — INTERNAL access E2E and kill-switch rehearsal: verified blocker

**Status: BLOCKING for internal-beta exposure.** Established 2026-08-15 by running the harness, not
by reasoning about it. `tests/life-os/internal-access.sh` exists, is complete, and **aborts with
exit 2** rather than reporting anything it did not prove.

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
