# Capability Package 4 — private AI reflection

This capability is a YORISOU-only, owner-scoped path:

`saved C02/F01/F02 result → Akari task envelope → bounded provider harness → schema validation → private reflection → finite recommendations → わたしの今`

Deterministic test output remains authoritative. The provider receives only test/version, result metadata, summary, and scored dimensions; it never receives an account identifier, LINE identifier, email, raw answers, token, or unrelated state.

## Active workflow

`test_result_reflection` (`hinata.private_reflection.v1`) is user-triggered only. The same input hash is idempotent per owner/result/workflow version. The web worker uses the existing leased task queue; no schedule, polling loop, outbound LINE message, or cross-project dependency is enabled.

Akari owns task/risk/cost routing. Hinata owns bounded reflection continuity. The only active provider order is Mistral, then OpenRouter when individually enabled. Both are server-only, time-bounded, JSON-schema validated, and cost-capped. A disabled provider is not called.

## Controls and operational safety

`yorisou_ai_runtime_controls` is private to the deployment service role. `global_enabled`, `reflection_enabled`, and each provider flag are kill switches. The initial migration leaves every flag disabled. Production activation must set a nonzero reflection budget and explicitly enable only the selected provider.

All Package 4 tables have RLS enabled, no browser policies, and no PUBLIC/anon/authenticated database access. API routes resolve the owner server-side. Deleting a saved result withdraws its derived reflection, deletes linked memory, and cancels its check-in plan.

The package intentionally does not activate proactive messaging, background scheduling, OpenClaw, Mirai Move, Shigeru, commercial recommendations, public sharing, or unrestricted memory.
