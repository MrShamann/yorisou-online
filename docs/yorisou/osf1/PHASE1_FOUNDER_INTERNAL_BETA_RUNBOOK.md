# YORISOU Phase 1 — Founder Internal Beta Runbook

**Rehearsed 2026-08-17** against a disposable production-context stack:
`tests/life-os/internal-access.sh`, **42 assertions, PASS**. Every step below has been executed at
least once somewhere other than production.

> **No secrets in this document.** It names variables, never values.

---

## MEASURED: the kill-switch recovery class is `restart_required`

This was measured, not assumed. With the app running, the pilot-flag environment variable was
changed and the founder's `/life` **still answered 200** — the running process does not observe the
change. Only after a restart did access close.

**What that means operationally:** on Vercel, changing an environment variable takes effect on the
**next deployment**, so the kill switch is *redeploy-class*, not instant. If you need immediate
closure and cannot wait for a redeploy, the faster lever is to make the route unreachable at the edge
(or roll back to the previous deployment, which does not carry the flag).

Recovery-time class: **minutes (one redeploy)**, not seconds. Plan the beta around that.

---

## 1. ACTIVATE INTERNAL

Four conditions, all required. Missing any one yields a 404 identical to the feature being off.

1. Migration applied to the target database — the OSF-1 lineage, in order. Gate 3 evidence:
   `OSF1_GATE3_MIGRATION_READINESS.md`.
2. `YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true` — reads work without it; **writes are refused**.
3. `osf1_life_os_internal` present in `YORISOU_PRIVATE_PILOT_FLAGS`.
4. The signing-in person's email present in `YORISOU_ADMIN_EMAILS`.

Then deploy, because of the recovery class above.

## 2. VERIFY ON

As the Founder/Admin account:

- `/me` shows the Life entry point
- `/life`, `/life/timeline`, `/life/reflect`, `/life/reflect?mode=postmortem`, `/life/goals`,
  `/life/experience`, `/life/memories` all load
- `GET /api/life/timeline` answers 200
- one write succeeds (creating a direction is the cheapest)

As an ordinary account, in a separate browser profile:

- **no** Life link anywhere on `/me`
- every `/life` route returns 404
- every `/api/life/*` route returns 404
- a write returns 404

**Failure signal:** the ordinary account seeing a link, or any 200. Stop and kill.

## 3. KILL

Remove `osf1_life_os_internal` from `YORISOU_PRIVATE_PILOT_FLAGS`, then **redeploy** (see the
recovery class — editing the variable alone changes nothing for the running process).

## 4. VERIFY OFF

For the Founder/Admin account:

- Life navigation gone from `/me`
- all `/life` routes 404, including URLs you had open a moment ago
- `GET /api/life/*` 404
- write APIs 404
- **you are still signed in** — `/me` still loads. The switch closes a feature, it does not sign
  anyone out.
- non-Life surfaces (`/`, `/today/check-in`, `/experiences`, `/tests/ima-iro`) all unaffected

**Failure signals, any of which is BLOCKING:** the UI closing while an API stays open; reads closing
while writes stay open; one route bypassing the guard; PUBLIC becoming reachable; data disappearing.

## 5. RESTORE

Put `osf1_life_os_internal` back, redeploy.

## 6. VERIFY RECOVERY

- the Founder/Admin reaches every route again
- the navigation entry returns
- **the ordinary account is still refused** — restoring must not widen access
- data written before the kill is still there
- nothing written during the cycle was duplicated

All six are asserted in the rehearsal.

## 7. ROLLBACK

The kill in §3 *is* the rollback for exposure — it needs no database change and destroys nothing.

To roll back further:

- **schema-ready off** (`YORISOU_OSF1_LIFE_OS_SCHEMA_READY`) refuses writes while leaving reads
  working. Useful if writes are misbehaving but you want to keep looking.
- **the migration** has a rehearsed, documented reverse path — apply → rollback → re-apply, proven in
  Gate 3 (42 assertions). The column drops in it are LOSSY and come last, if at all.

## 8. Preconditions carried from earlier passes

- **The authenticated accessibility gate is a mandatory local run** and is not in CI:
  `npm run test:osf1-a11y-authenticated` must report 0 serious and 0 critical.
- Release & Acceptance Gates v1.0 §3.4 requires the live kill-switch test before exposure. It is
  satisfied by `npm run test:osf1-internal-access`, which must be green on the commit being deployed.

## 9. Reproducing the whole rehearsal

```bash
npm run test:osf1-internal-access
```

Builds a disposable PostgreSQL + PostgREST + S3-compatible identity store + production Next build in
a **production deployment context**, registers a Founder/Admin and an ordinary account through the
real auth layer, and runs the full ON → bypass-attempts → KILL → RESTORE cycle. Touches nothing
hosted; every process and directory is torn down on exit.
