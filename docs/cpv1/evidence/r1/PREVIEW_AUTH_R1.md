# CPV1-R1 11A.5 — Preview authorization maturity classification

## Classification: `CONTRACT_ONLY_NOT_RUNTIME_WIRED`

`cpv1PreviewAccess()` (in [`lib/cpv1/deploymentContext.ts`](../../../../lib/cpv1/deploymentContext.ts)) is a **real, pure, fully-tested** authorization decision (fail-closed context + exact-flag + auth + Founder/Admin + route authorization; 11A.3/11A.4). It is **NOT** wired into any runtime consumer.

### Runtime-consumer inventory (verified 2026-07-19)

```
grep -rn "cpv1PreviewAccess" app/ lib/server   → (zero server routes/components/handlers/middleware)
grep -rln "from .*lib/cpv1"    app/             → (zero — NO app route imports lib/cpv1 at all)
```

The only reference to `cpv1PreviewAccess` outside its own module + the contract test is a **comment** in `lib/cpv1/flags.ts`. No server route, server component, route handler, or middleware calls it.

### Why it is not wired (and why no surface was fabricated)

There is **no existing private CPV1 route** in the app. Wiring the gate would require creating a new CPV1 user-facing surface, which 11A.5 explicitly forbids: *"Do not create a fake private product surface solely to claim completion."* The existing `app/admin/*` routes are APP-2/SR admin surfaces, not CPV1 surfaces; attaching a CPV1 preview gate to one would expand product scope and manufacture a CPV1 surface that the program has not been authorized to build.

Therefore the honest maturity is **contract-only**: the access-control logic exists and is proven by unit tests (the 11A.3/11A.4 preview-access matrix, including `denied_unknown_context`, `denied_production`, exact-flag `denied_flag_off`), but no product route consumes it yet. It is **not** called "implemented access control."

### To promote it to runtime-wired (future, out of this program's scope)

When a genuine private CPV1 surface is built (e.g. an admin CPV1 registry-preview panel or the understanding-model dev UI), its server entrypoint should call `cpv1PreviewAccess({ authenticated, isFounderAdmin, routeAuthorized, requiredFlag })` with server-resolved identity and deny before rendering. A direct-access test against that route would then move this to `RUNTIME_WIRED`.
