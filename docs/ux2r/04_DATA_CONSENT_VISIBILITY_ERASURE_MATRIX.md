# CPC-1 · 04 — Data, Consent, Visibility and Erasure Matrix

> **FROZEN.** Preview project `nbltsbonsnbpfptihomc` only. Production is protected.

## Access architecture

`DIRECT_USER_DENY` + `SERVER_REPOSITORY_OWNER_SCOPE` + `RPC_ONLY_DATABASE_MUTATION`

RLS enabled **and forced**; `anon`/`authenticated` hold **no grants**; `service_role` is **SELECT
only**; all mutation flows through bounded `SECURITY DEFINER` RPCs.

## Data classes

| data | class | storage | erasure |
|---|---|---|---|
| raw answers | private user content | `yorisou_assessment_attempts.answers` | erased to `{}` |
| result identifier | derived user content | `results.result_id` | **nulled** |
| original result | provenance + user content | `results.original_result_id` | **nulled** |
| dimension output | derived user content | `results.dimension_output` | `{}` |
| interpretation responses | private user content | `yorisou_interpretation_responses` | **deleted** |
| owner linkage | identifying | `owner_account_id` | **nulled** |
| method id/version | governed provenance | retained | retained |
| timestamps | audit | retained | retained |
| governed result copy | protected asset | **never stored in the DB** | n/a |

## Consent / downstream permission

Downstream use is **opt-in by an explicit accepting response**:

```
recommendation_use_permitted = continuity_use_permitted = (response ∈ {CONFIRMED, CORRECTED})
```

Never defaulted to true. Never inferred from inactivity.

## Visibility

`private` (default) — owner only. `link_shared` exists in the schema but is **not activated** in
this package; no visibility option is exposed unless it is server-enforced.

## Erasure guarantee

True erasure, not a soft hide. The API reports `{erased, answersErased, responsesErased}` and that
wording matches the data. The append-only rule yields **only** inside a transaction-local,
owner-scoped, single-result erasure context — never a global trigger disable, never an
unrestricted runtime cleanup function.
