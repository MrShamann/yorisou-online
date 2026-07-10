# UESoul inheritance and C02 vertical-slice plan

## Canonical assets

| Asset | Location | Classification | Action |
| --- | --- | --- | --- |
| C02 source questions, rules and result mapping | `lib/yorisou-tests/generated/C02_ima_no_watashi_check_v1_0.ts` | RETAIN_UNCHANGED | Keep C02 v1.0 and `C02_Q01` through `C02_Q36` as the sole question source. |
| C02 runtime adapter | `lib/yorisou-tests/c02.ts` | RETAIN_WITH_ADAPTER | Add provenance and private-result capability metadata without copying questions. |
| Deterministic scoring | `lib/yorisou-tests/scoring.ts` | RETAIN_WITH_ADAPTER | Validate answers before scoring and retain source rule/fallback behavior. |
| C02 route and flow | `app/tests/c02/page.tsx`, `app/tests/_components/SpecAssessmentFlow.tsx` | RETAIN_WITH_ADAPTER | Preserve the public route and add save, return and private-result actions only for C02. |
| Account and identity foundation | `lib/server/yorisouAuth.ts`, `lib/server/yorisouData.ts` | RETAIN_WITH_ADAPTER | Use the verified YORISOU account/principal as the private-result owner. |
| LINE OAuth/linking | `app/api/line/auth/*`, `lib/server/yorisouLine.ts` | RETAIN_WITH_ADAPTER | Allow a validated C02 result return path after login or linking. |
| Browser-local save | `app/result/saveState.ts`, `app/result/LocalResultSave.tsx` | MIGRATE | Leave existing users unchanged; C02 uses owned server persistence instead. |
| Hinata/OpenClaw provider gateway | `lib/ai/support/model-gateway.ts` | DEFER | C02 remains deterministic and makes no Provider call. |

## Selected vertical slice

`C02` - 今のわたしチェック, version `v1.0`, route `/tests/c02`.

The existing source provides 36 ordered Japanese questions, deterministic weights, result rules and a non-clinical boundary. C02 describes a current state only. It does not assign a permanent identity, diagnosis, fate or public profile.

## Target architecture

```text
C02 v1.0 source
  -> validated deterministic scorer
  -> governed Japanese result
  -> optional YORISOU account or LINE login
  -> private Supabase result record
  -> authorized retrieval and safe return path
```

## Expected changes

- C02 definition/validation and executable scoring tests.
- C02 result API, owned-result repository and private result route.
- C02-only save UI and safe LINE return handling.
- One additive Supabase migration with RLS and no public policy.
- Focused CI/database checks and route smoke coverage.

## Explicit exclusions

No other legacy tests, 120-question redesign, permanent personas, Provider execution, Hinata, Akari, OpenClaw, workers, schedules, webhooks, broadcast messaging, paid reports, community features, Digital Legacy, Mirai Move, or Shigeru systems are part of this package.
