# MTF-1 — YORISOU Test Originalization Standard (Test Pattern Forge)

**Binding standard.** Every new YORISOU method — and every `YORISOU_ORIGINAL_REBUILD_CANDIDATE` — MUST pass through the **Test Pattern Forge** workflow below before implementation. No step may be skipped; each step produces a recorded artifact in the method's spec folder. Founder review gates activation at the end — content production alone never activates anything (CPV1 evidence-gated model).

## The Test Pattern Forge — 20 mandatory steps

| # | Step | Required artifact |
|---|---|---|
| 1 | **User-need extraction** — the real Japanese user need in the user's own words; the situation, not the instrument | need statement (JA) + situations list |
| 2 | **Source classification** — where the concept space comes from (first-party / abstract pattern / public domain / traditional system / licensed) | source statement with provenance |
| 3 | **Rights classification** — exactly one primary route from the eight in `MTF1_METHOD_SOURCE_RIGHTS_MATRIX.md` | rights row + unresolved fields |
| 4 | **Abstract-pattern extraction ONLY** — what may be reused is the abstract shape (e.g. "two-person gap comparison", "5-point self-report", "periodic check-in"); NEVER concrete items, labels, keys, or copy | pattern note naming exactly what is reused and why it is unprotectable |
| 5 | **Benchmark and format decision** (MTF-1.1 — MANDATORY before any question count, item structure, or completion time is frozen) — compare at minimum: **24-item multi-choice · 48-item A/B · 60-item A/B · 72-item A/B · 84-item A/B**; evaluate target user intent, mobile completion burden, abandonment risk, retest frequency, free-result credibility, deep-report information requirement, scoring stability, accessibility, content-production cost, sensitivity/fatigue, and whether a quick, main, or deep assessment is appropriate. **Do NOT preselect 24 questions or 6–8 archetypes merely because existing tests use that shape.** Until this step is recorded, every count in any planning document is `benchmark_pending` / a non-binding hypothesis. | recorded benchmark decision with rationale (format, item count, expected completion time, assessment tier) |
| 6 | **Original Japanese product naming** — a new JA-first name; no borrowed or "sound-alike" naming of existing products | name + naming rationale |
| 7 | **Original dimensions** — dimension set authored for the Japanese need; not a re-labelled copy of any existing instrument's factors | dimension sheet (id, JA name, definition, behavioral anchors) |
| 8 | **Original question structure** — section plan, ordering logic, completion-time budget, all consistent with the step-5 benchmark decision (item count comes FROM step 5, never assumed) | structure sheet |
| 9 | **Original answer options** — option scales/choices written fresh; trade-off options must trade REAL things | option style guide + examples |
| 10 | **Original scoring** — scoring logic designed from the dimension sheet (weights, rules, tie-breaks, fallback); versioned from day one | scoring spec (versioned) |
| 11 | **Original result model** (MTF-1.2 — replaces the archetype-only step) — FIRST select the result variant from the Dynamic Test Engine contract (`ArchetypeResult` / `StateRecordResult` / `DimensionProfileResult` / `SymbolicReflectionResult` / `ImportedExternalResult` / entertainment-only output), justified by the method's ACTUAL user need — never by template habit. Then produce the variant-specific artifacts (see "Result-model production requirements" below). A method may legitimately have **no archetype, no deep report, a timeline instead of a report, a profile instead of a type, or an acknowledgement instead of an interpretation.** The Forge must never force content solely to satisfy a template. | result-model decision + variant artifact set |
| 12 | **Original free-result copy** — result-variant-aware: recognition/acknowledgement line, share-safe line, and (where the variant defines them) highlights and gentle next step — current-state framed; per result entry for archetype/profile/symbolic variants, per state-set for state records | free-copy sheet (variant-appropriate) |
| 13 | **Original deep-output structure** — result-variant-aware: report skeleton where the variant warrants a report; change-over-time timeline for state records; profile explanation for dimension profiles; NO mandatory report for every method; private-by-default | deep-output skeleton (or a recorded "no deep output" decision) |
| 14 | **Recommendation tags** — which service families each result may route to; tags are suggestions, never verdicts | tag map |
| 15 | **Japanese cultural adaptation** — pass the full `MTF1_JAPAN_LOCALIZATION_STANDARD.md` checklist | localization checklist result |
| 16 | **Public/private copy separation** — explicit split: screenshot-safe public copy vs private-only copy; nothing sensitive in URLs or share cards | copy-boundary sheet |
| 17 | **Repeat-test design** — retest cadence, what changes between takes, how history is presented without "you got worse" framing | cadence spec |
| 18 | **Trust-risk review** — clinical-adjacency, vulnerable-moment reading paths, safety copy, boundary statements (「〜ではありません」lines) | trust-risk record |
| 19 | **Implementation contract** — mapping to the Dynamic Test Engine contract (`MTF1_DYNAMIC_TEST_ENGINE_CONTRACT.md`): formats, scoring class, result variant (polymorphic `EngineResult`), persistence needs | engine-contract mapping |
| 20 | **Founder review before activation** — the CPV1 gate: founder decision ref + deployment evidence required for `public_active`; content completion NEVER auto-activates | founder decision record |

Existing completed methods retain their verified actual counts (120/36/60/60/24/18/6/5/4 and the R01/R04/S01 pools) — the benchmark stage governs NEW and REBUILD methods, not retroactive changes to shipped banks.

## Result-model production requirements (Forge step 11, MTF-1.2)

The selected variant determines EXACTLY what content is produced. Producing archetype-shaped content for a non-archetype method is a Forge violation.

**Archetype result** — produce: result IDs; Japanese result names (collision-checked per the naming rule); recognition lines; secondary signals or modifiers; per-result free copy; report structure where applicable.

**State record result** (daily check-in and similar) — produce: structured state fields; allowed values; acknowledgement copy; optional private-reflection design; cadence; change-over-time presentation. **No mandatory archetype. No forced personality interpretation.**

**Dimension profile result** — produce: dimension definitions; qualitative bands; validated numeric handling ONLY if a real validation exists; profile explanation; method-local comparison rules. **No mandatory single primary type.**

**Symbolic reflection result** (rights-cleared traditional/symbolic) — produce: source/school/version record; symbol or interpretation entries; symbolic boundary copy; confirmation/correction/rejection behavior. **No scientific weighting. No deterministic life prediction.**

**Imported external result** — produce ONLY: provider mapping; import mode; label-display rules; ownership and trademark boundary; user-confirmation flow. **No new YORISOU type. No YORISOU re-scoring. No copied report content.**

**Entertainment-only output** (`traditional_symbolic_entertainment`) — produce: entertainment output model; share-safe copy; return behavior; and the explicit exclusion from Understanding Graph, recommendation, and Companion memory (carried structurally as `understandingPolicy: "excluded_entertainment"`).

## Absolute prohibitions

The following are prohibited in every step, with no "small amount is fine" exception:

- **Translating competitor questions** (any language → JA or otherwise).
- **Paraphrasing proprietary question banks** — item-by-item "rewording" is copying.
- **Copying scoring keys** or weight tables from any proprietary instrument.
- **Copying result labels / type names** (including trademarked four-letter type codes).
- **Copying report structures too closely** — a section-by-section mirror of a proprietary report is a copy even with new words.
- **Copying card art or visual identity** — no modern tarot/oracle deck, illustration set, or color-system artwork may be reproduced or closely imitated.
- **Reverse-engineering proprietary tests** — reconstructing items/keys from public result descriptions is prohibited.
- **Using "inspired by" to conceal adaptation** — if a method derives from a protected source, the derivation must be named in step 2 and resolved in step 3; "inspired by" is never a rights answer.
- **Clinical claims** — no diagnosis, screening, severity, disorder, or treatment language.
- **Fate or certainty claims** — no 運命/確実/絶対 framing; symbolic methods are entry points to reflection only.
- **Fabricated validation or accuracy** — no invented reliability/validity numbers, no "scientifically proven", no fake confidence statistics (see the 120Q confidence rule in `MTF1_FOUNDER_DECISIONS.md` D-3.5).
- **Invented user counts or testimonials** — no fabricated social proof anywhere.

## What "original" concretely means at YORISOU

A method is original when: the questions could not be aligned item-for-item against any existing instrument; the dimensions were derived from the Japanese user need (step 1), not from another test's factor list; the result names are new coinages in YORISOU's naming style (current-state, non-labelling, e.g. 「〜期」「〜モード」 rather than person-typing nouns); and the scoring was designed forward from the dimension sheet rather than backward from another instrument's key.

The existing nine shipped methods (120Q, C02, F01, F02, RF, LD, WR, NI, LL) and the R01/R04/S01 banks are the house style reference: fixed first-party banks, versioned scoring, honest interpretation-limit lines (「診断ではありません」「判定ではありません」), and boundary disclaimers (R04's explicit 姓名判断 denial). New methods must meet or exceed that bar.

## Naming-collision rule

Before finalizing any archetype/result name, check against: the 24 public archetypes (6 clans), the 31 canonical persona names (both Annex-A and naming-lock layers — they already conflict, T1/T2), the 7 RF + 7 LD archetypes, the 8 companion archetypes, and all C02/F01/F02/R01 result names. New names must not collide with ANY layer, including the dormant ones.
