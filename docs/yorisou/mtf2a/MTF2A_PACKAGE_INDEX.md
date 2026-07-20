# MTF-2A — Package Index

**Package:** Daily Check-in + Values Launch-Core content production · **Base:** `main @ d992a6e` (MTF-1..1.3 merged standards) · **Scope:** content/spec artifacts + one non-runtime validator ONLY. No runtime, no UI, no persistence, no scoring code, no migrations, no activation.

Both methods completed **Forge steps 1–19** of the 20-step Test Pattern Forge (`MTF1_TEST_ORIGINALIZATION_STANDARD.md`), including the mandatory Benchmark stage (step 5), the execution-model artifact (step 10) and the polymorphic result model (step 11). **Step 20 (Founder acceptance) is PENDING** — content authoring and validation do not themselves complete Step 20. The two methods deliberately exercise **two different MTF-1.3 execution models** and do NOT share a questionnaire/result structure.

## Canonical versions (MTF-2A.2 final)

| Method | Package spec | Component versions | Content hash (sha256, canonical serialization) |
|---|---|---|---|
| daily-check-in | `mtf2a-daily-check-in-v1.2.0` | method `daily-check-in-v1.0` · schema `daily-state-schema-v1.1` · acknowledgement `daily-ack-v1.2` · longitudinal `daily-longitudinal-v1` · record contract `daily-record-contract-v1` | `4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3` |
| yorisou-values | `mtf2a-yorisou-values-v1.2.0` | method `values-v1.0` · bank `values-bank-v1.0` · scoring `values-scoring-v1.0` · result schema `values-result-v1.0` · report outline `values-report-outline-v1.0` | `919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6` |

| Method | Execution model | Result variant | Format decided at benchmark |
|---|---|---|---|
| `daily-check-in` 「きょうの空模様」 | `recorded_state` | `StateRecordResult` (no archetype, no score) | 5-input, one-screen, ~45-60s (user claim: 1分), opt-in private memo |
| `yorisou-values` 「いま大事にしたいことチェック」 | `scored` | `ArchetypeResult` | 48-item A/B forced trade-off, main tier, ~8 min |

## Inventory

| File | Content |
|---|---|
| `daily-check-in.v1.json` | **Canonical spec `mtf2a-daily-check-in-v1.2.0`** — identity (1分), record contract v1 (UTC+local date+timezone, versioned corrections), state schema v1.1, ack rules **v1.2** (twice risk-passed, non-directive), longitudinal v1 (field-valid denominators, 7/30-day + prompts), governed recommendation mapping, content hash |
| `yorisou-values.v1.json` | **Canonical spec `mtf2a-yorisou-values-v1.2.0`** — identity, scored definition + content hash, benchmark, 7 dimensions, 48-item bank v1.0 (blinded-audited; Q04/Q25 final), scoring **v1.0** (pair-independent Mixed, 48/48 coverage, insufficient_coverage), 8 results (distinct share lines), privateRenderingContract + resultReasons, non-graded secondary, anti-screening boundary |
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

**Activation truth:** both methods remain `gated` (CPV1 evidence-gated model). Neither method is implemented, activated, published or deployed. Content authoring does NOT activate anything; Founder review is Forge step 20 (pending).

**Inventory truth (MTF-2A.2 final):** the branch package is exactly **15 files** — the 14 listed above under `docs/yorisou/mtf2a/` plus `scripts/validate-mtf2a-content.mjs`. This inventory reflects the final MTF-2A.2 state (version-coherent specs, 48/48 coverage, canonical scorer + genuine fixtures, field-valid longitudinal system, answer-traceable private copy). (An earlier PR-body claim of 16 files was incorrect and was corrected in MTF-2A.1.)
