# MTF-2A — Package Index

**Package:** Daily Check-in + Values Launch-Core content production · **Base:** `main @ d992a6e` (MTF-1..1.3 merged standards) · **Scope:** content/spec artifacts + one non-runtime validator ONLY. No runtime, no UI, no persistence, no scoring code, no migrations, no activation.

Both methods completed the full **20-step Test Pattern Forge** (`MTF1_TEST_ORIGINALIZATION_STANDARD.md`), including the mandatory Benchmark stage (step 5), the execution-model artifact (step 10) and the polymorphic result model (step 11). The two methods deliberately exercise **two different MTF-1.3 execution models** and do NOT share a questionnaire/result structure.

| Method | Execution model | Result variant | Format decided at benchmark |
|---|---|---|---|
| `daily-check-in` 「きょうの空模様」 | `recorded_state` | `StateRecordResult` (no archetype, no score) | 5-input, one-screen, ~45s, opt-in private memo |
| `yorisou-values` 「いま大事にしたいことチェック」 | `scored` | `ArchetypeResult` | 48-item A/B forced trade-off, main tier, ~8 min |

## Inventory

| File | Content |
|---|---|
| `daily-check-in.v1.json` | **Canonical machine-readable spec** — identity, recorded_state definition, state schema (5 fields + opt-in memo), acknowledgement rules (13 entries), copy bundles, StateRecordResult contract |
| `yorisou-values.v1.json` | **Canonical machine-readable spec** — identity, scored definition, benchmark decision, 7 dimensions, complete 48-item bank, scoring v1, result-model benchmark, 8 complete results, report outline, recommendations |
| `MTF2A_DAILY_CHECK_IN_BENCHMARK.md` | Forge step-5 record (formats compared, selection, rationale) |
| `MTF2A_DAILY_CHECK_IN_PRODUCT_SPEC.md` | Product spec (identity, state schema, recording model, timeline semantics, deep output) |
| `MTF2A_DAILY_CHECK_IN_COPY_SYSTEM.md` | Complete Japanese copy system incl. acknowledgement set |
| `MTF2A_VALUES_BENCHMARK.md` | Forge step-5 + step-11 result-model benchmark records |
| `MTF2A_VALUES_PRODUCT_SPEC.md` | Product spec (construct model, scoring, result assembly, report outline) |
| `MTF2A_VALUES_QUESTION_BANK.md` | Human-readable full 48-item bank (canonical data lives in the JSON) |
| `MTF2A_VALUES_RESULT_COPY.md` | Human-readable full 8-result copy (canonical data lives in the JSON) |
| `MTF2A_SOURCE_AND_ORIGINALITY_REGISTER.md` | Forge steps 2/3/4 + originality reviews for both methods |
| `MTF2A_JAPANESE_EDITORIAL_REVIEW.md` | Step-15 editorial pass record |
| `MTF2A_TRUST_RISK_REVIEW.md` | Step-18 trust-risk record + escalation items |
| `MTF2A_STRUCTURED_REVIEW_RECORD.md` | §12 production-loop roles + resolutions + genuinely open Founder decisions |
| `scripts/validate-mtf2a-content.mjs` | Non-runtime content validator (imported by nothing) |

**Canonicity rule:** the two `.v1.json` files are the single source of truth for IDs, items, options, rules and copy; the Markdown documents present and justify them. The validator cross-checks that every JSON item/result ID appears in its Markdown counterpart.

**Activation truth:** both methods remain `gated` (CPV1 evidence-gated model). Content authoring does NOT activate anything; Founder review is Forge step 20.
