# Phase 3.6 TypeScript Build Hang Repair Report

## Root cause

The build hang was not caused by the 120Q generated JSON files themselves.

The reproducible hang pattern came from local TypeScript / Next write activity inside a repo located under `~/Documents`, which is synced by iCloud on this machine:

- `npm run build` compiled successfully, reached `Running TypeScript ...`, and then failed to exit
- `npx tsc --noEmit --pretty false --extendedDiagnostics` also failed to exit when incremental caching was left on
- `npx tsc --noEmit --pretty false --extendedDiagnostics --incremental false` completed normally in about 13 seconds and surfaced a real TS error

That isolated the hang to local incremental/cache/type-output writes rather than to infinite type analysis.

## Additional TypeScript issue found

Once incremental caching was bypassed, TypeScript reported a real error in:

- `lib/yorisou/scoring/aggregator.ts`

This was a cast-safety issue in `createBucketMap(...)`. It was repaired with an explicit `unknown` bridge cast so strict `tsc` can complete.

## Large generated JSON assessment

Inspected:

- `data/yorisou/120q-question-bank.generated.json`
- `data/yorisou/120q-scoring-master.generated.json`
- imports from `app/check-in/currentStateCheckV1.ts`

Observed sizes:

- question bank: `92,173` bytes
- scoring master: `696,833` bytes

Assessment:

- these files do increase module/type load
- they were not the root cause of the build hang
- `tsc --incremental false` completed successfully while those imports remained in place

No question text, option text, or score values were changed.

## Client/server boundary assessment

Current state:

- `app/check-in/MiniTestFlow.tsx` is a client component
- it consumes `app/check-in/currentStateCheckV1.ts`
- that shared module still imports the generated question/scoring JSON

Assessment:

- this is not ideal from a payload/boundary perspective
- it was not the blocker for build/typecheck completion
- no client/server boundary refactor was required to restore successful build completion in this pass

## Files changed

- `lib/yorisou/scoring/aggregator.ts`
- `tsconfig.json`
- `next.config.ts`

## What was not changed

- no product behavior changes
- no new features
- no result taxonomy
- no result names
- no result copy
- no paid report copy
- no payment/auth/database/env/LINE/deployment changes
- no question text changes
- no option text changes
- no score value changes

## Repair summary

1. Fixed the strict TypeScript cast issue in `aggregator.ts`
2. Moved TypeScript incremental cache output to `/tmp/yorisou-next/tsconfig.tsbuildinfo`
3. Made local Next builds use `/tmp/yorisou-next/.next` automatically when the repo is running from a `~/Documents` workspace, while preserving default CI behavior

## Command results

- `node --import tsx lib/yorisou/scoring/__tests__/run.ts`  
  Passed

- `npm run lint -- lib/yorisou/scoring app/check-in app/en/check-in app/result app/report-preview app/report-loading app/saved app/recommendations`  
  Passed

- `npx tsc --noEmit --pretty false`  
  Passed

- `npm run build`  
  Passed

## Remaining risks

- the active check-in runtime still imports large generated JSON from a module used by a client flow; this is now build-safe, but may still be worth slimming later for bundle hygiene
- prior docs from Phase 3 / 3.5 still describe historical T6 state and should be read as historical records, not current runtime status
