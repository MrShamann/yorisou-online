# MTF-1 — YORISOU Test Originalization Standard (Test Pattern Forge)

**Binding standard.** Every new YORISOU method — and every `YORISOU_ORIGINAL_REBUILD_CANDIDATE` — MUST pass through the **Test Pattern Forge** workflow below before implementation. No step may be skipped; each step produces a recorded artifact in the method's spec folder. Founder review gates activation at the end — content production alone never activates anything (CPV1 evidence-gated model).

## The Test Pattern Forge — 19 mandatory steps

| # | Step | Required artifact |
|---|---|---|
| 1 | **User-need extraction** — the real Japanese user need in the user's own words; the situation, not the instrument | need statement (JA) + situations list |
| 2 | **Source classification** — where the concept space comes from (first-party / abstract pattern / public domain / traditional system / licensed) | source statement with provenance |
| 3 | **Rights classification** — exactly one primary route from the eight in `MTF1_METHOD_SOURCE_RIGHTS_MATRIX.md` | rights row + unresolved fields |
| 4 | **Abstract-pattern extraction ONLY** — what may be reused is the abstract shape (e.g. "two-person gap comparison", "5-point self-report", "periodic check-in"); NEVER concrete items, labels, keys, or copy | pattern note naming exactly what is reused and why it is unprotectable |
| 5 | **Original Japanese product naming** — a new JA-first name; no borrowed or "sound-alike" naming of existing products | name + naming rationale |
| 6 | **Original dimensions** — dimension set authored for the Japanese need; not a re-labelled copy of any existing instrument's factors | dimension sheet (id, JA name, definition, behavioral anchors) |
| 7 | **Original question structure** — section plan, item counts, ordering logic, completion-time budget | structure sheet |
| 8 | **Original answer options** — option scales/choices written fresh; trade-off options must trade REAL things | option style guide + examples |
| 9 | **Original scoring** — scoring logic designed from the dimension sheet (weights, rules, tie-breaks, fallback); versioned from day one | scoring spec (versioned) |
| 10 | **Original result archetypes** — result set (count, ids, JA names) authored fresh; names must not collide with any existing YORISOU taxonomy (see naming-collision register T1/T2) | archetype sheet |
| 11 | **Original free-result copy** — recognition line, highlights, gentle next step, share line — per archetype, current-state framed | free-copy sheet |
| 12 | **Original deep-report structure** — section skeleton + editorial intent per section; private-by-default | report skeleton |
| 13 | **Recommendation tags** — which service families each result may route to; tags are suggestions, never verdicts | tag map |
| 14 | **Japanese cultural adaptation** — pass the full `MTF1_JAPAN_LOCALIZATION_STANDARD.md` checklist | localization checklist result |
| 15 | **Public/private copy separation** — explicit split: screenshot-safe public copy vs private-only copy; nothing sensitive in URLs or share cards | copy-boundary sheet |
| 16 | **Repeat-test design** — retest cadence, what changes between takes, how history is presented without "you got worse" framing | cadence spec |
| 17 | **Trust-risk review** — clinical-adjacency, vulnerable-moment reading paths, safety copy, boundary statements (「〜ではありません」lines) | trust-risk record |
| 18 | **Implementation contract** — mapping to the Dynamic Test Engine contract (`MTF1_DYNAMIC_TEST_ENGINE_CONTRACT.md`): formats, scoring class, result object, persistence needs | engine-contract mapping |
| 19 | **Founder review before activation** — the CPV1 gate: founder decision ref + deployment evidence required for `public_active`; content completion NEVER auto-activates | founder decision record |

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
