# Phase 3 120Q Check-In Runtime Replacement Report

## Scope

This pass replaced the active `/check-in` runtime with the canonical 120Q foundation while preserving the existing check-in UI structure as much as possible.

## Replaced legacy runtime

- active import of `app/check-in/t6QuestionBank.ts`
- active import of `app/check-in/t6Scoring.ts`
- active 24Q fixed-count assumptions inside `app/check-in/currentStateCheckV1.ts`
- active 24Q progress/copy assumptions inside `app/check-in/MiniTestFlow.tsx`

## What changed

- `app/check-in/currentStateCheckV1.ts` now adapts the generated 120Q question bank and generated scoring master into the existing check-in runtime API.
- `app/check-in/MiniTestFlow.tsx` now runs over 120 questions with A-E options while keeping the existing visual structure.
- `app/check-in/page.tsx` metadata now reflects 120Q.
- `app/report-loading/page.tsx` loading copy now reflects 120Q.
- generated client-safe data snapshots were added:
  - `data/yorisou/120q-question-bank.generated.json`
  - `data/yorisou/120q-scoring-master.generated.json`

## 120Q runtime behavior

- `/check-in` now uses Q001-Q120.
- each question presents A-E options only.
- completion requires all 120 answers in the active flow.
- selected answers map through the corrected 600-row scoring master using `questionId + optionId`.
- the active runtime uses the non-formula aggregation skeleton and safety-routing summary only.

## Result output status

- Final result taxonomy is not approved.
- Final public result naming is not approved.
- The runtime currently returns a safe placeholder result object marked `RESULT_TAXONOMY_NOT_APPROVED`.
- Raw scoring data is not exposed publicly and is not stored in the result payload.

## Legacy retirement status

- `t6QuestionBank` and `t6Scoring` are no longer used by the active check-in runtime.
- old T6 result helpers remain in the repo because legacy result pages still import `t6ResultModel` route helpers outside the runtime-replacement scope of this pass.
- old files were left in place, not deleted blindly.

## Not touched

- no visual redesign
- no payment/auth/database/env/deployment changes
- no LINE webhook/callback changes
- no final scoring formula approval
- no result taxonomy implementation
- no paid report copy

## Validation

- internal foundation validation passed
- active check-in runtime validation passed
- lint passed for `lib/yorisou/scoring` and `app/check-in`

## Remaining decisions

- approve final result taxonomy and public output contract
- approve whether legacy result surfaces should be updated next to remove old 24Q/T6 presentation assumptions
- decide whether now-unused T6 files should be archived or deleted in a later cleanup pass
