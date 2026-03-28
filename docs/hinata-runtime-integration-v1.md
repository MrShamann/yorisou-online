# Hinata Runtime Integration Notes v1

- Behavior spec: use [lib/ai/support/hinataBehaviorSpec.ts](/Users/yangjin/yorisou-online/lib/ai/support/hinataBehaviorSpec.ts) as the source of truth when editing persona prompts, early-turn policy, language-follow policy, and action timing.
- Training set: use [data/hinata-training-set-v1.json](/Users/yangjin/yorisou-online/data/hinata-training-set-v1.json) as a grounding/reference bank for regression checks, prompt edits, and future OpenClaw skill/routing design.
- Eval suite: use [data/hinata-eval-suite-v1.json](/Users/yangjin/yorisou-online/data/hinata-eval-suite-v1.json) to check first-turn behavior, language-follow, continuity, and premature action risk before changing `/api/support/chat`.
- Reflection stub: use `diagnoseOpenClawConversationSample(...)` in [lib/server/openclawReflection.ts](/Users/yangjin/yorisou-online/lib/server/openclawReflection.ts) for offline diagnostics or future OpenClaw reflection jobs; do not auto-modify production prompts from it.
