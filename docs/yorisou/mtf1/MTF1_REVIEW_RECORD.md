# MTF-1 / MTF-1.1 / MTF-1.2 — Structured Review Record (§7, corrected)

This record supersedes the initial MTF-1 review, which incorrectly reported blanket PASS across all dimensions while the package still contained contract defects. The corrected record distinguishes: **(a)** defects present at the initial MTF-1 HEAD `51a3916`, **(b)** corrections applied in MTF-1.1, **(a2)** defects still present at the MTF-1.1 HEAD `9e74b15`, **(b2)** corrections applied in MTF-1.2, **(c)** remaining genuine future implementation gates, and **(d)** the invariant that no runtime code and no CPV1 code was mutated in any of the three packages.

## (a) Defects present at MTF-1 HEAD `51a3916` (found by Founder review, fixed in MTF-1.1)

| # | Defect | Where it was |
|---|---|---|
| DF-1 | Method-level classification used the name `evidenceClass`/`evidence_class`, colliding with CPV1's observation-level `EvidenceClass` — the initial review flagged this only as a "future finding" (F-2) instead of correcting the package's own vocabulary | universe YAML (31 entries), engine contract identity block |
| DF-2 | The engine contract **blanket-excluded all `traditional_symbolic*` methods** from understanding contribution, erasing the intended distinction between rights-cleared symbolic reflection and entertainment output | contract §7 bullet |
| DF-3 | `EngineResult` mandated a primary archetype for every method — structurally unable to represent `daily-check-in` (state log), Big-Five (dimension profile), symbolic readings, or imports; a `multiResult: boolean` flag was insufficient for multi-dimension output | contract §4 + `EngineScoringMeta` |
| DF-4 | The Forge had **no benchmark stage** — unbuilt methods carried preselected shapes ("~24Q", "6–8 archetypes", "2×~20Q") copied from existing tests without any recorded format decision | standard (19 steps), universe entries, content queue |
| DF-5 | `family: string` was unrestricted in the engine identity — arbitrary family strings were possible despite the frozen 7-family universe | contract identity block |
| DF-6 | Mixed-language typo `24результ` in the imairo `implementation_truth` | universe YAML |
| DF-7 | The initial Review Record itself claimed all dimensions PASS despite DF-1..DF-6 | this file's previous revision |

## (b) Corrections applied in MTF-1.1

| # | Correction |
|---|---|
| A | Canonical rename: `method_evidence_class` (docs/YAML) / `methodEvidenceClass` (TS) everywhere method-level classification appears; explicit two-axis mapping rule documented (method-level class NEVER replaces the CPV1 observation `EvidenceClass`; every observation carries both; axes never collapsed). CPV1 runtime untouched. |
| B | Two-class symbolic boundary replaces the blanket exclusion: `traditional_symbolic` → source-separated private symbolic/cultural reflection layer ONLY (source class `symbolic_reflection` / `chinese_cultural_interpretation`; never psychology/scientific/clinical evidence; never universal-scored or silently averaged; confirmation/correction/rejection mandatory; purpose-level consent before any downstream use; public boundary copy; no high-stakes authority; no fate/certainty/health/financial/legal/marriage/career prediction). `traditional_symbolic_entertainment` (s01-omikuji) stays FULLY excluded from Understanding Graph, evidence, dimensions, compatibility, synthesis, recommendations, and Companion memory. The classes are structurally distinct and never equivalent. |
| C | Polymorphic `EngineResult` tagged union: shared `EngineResultBase` + `ArchetypeResult` / `StateRecordResult` (no archetype; no forced personality interpretation) / `DimensionProfileResult` (real multi-dimension structure; qualitative bands or validated numerics only) / `SymbolicReflectionResult` (source/school/version; no scientific weighting; distinct from entertainment) / `ImportedExternalResult` (original provider label; structurally NO YORISOU re-scoring; no framework-ownership claim). `multiResult: boolean` removed. Binding universe mapping recorded. |
| D | Mandatory Forge step 5 "**Benchmark and format decision**" (Forge is now 20 steps): compare ≥ {24-item multi-choice, 48/60/72/84-item A/B}; evaluate intent, mobile burden, abandonment, retest frequency, credibility, report requirement, scoring stability, accessibility, production cost, sensitivity/fatigue, quick/main/deep tier; recorded decision with rationale required before any count/structure/time freeze. All unbuilt-method count claims relabelled `benchmark_pending`; `benchmark_status` field added to all 31 universe entries (`verified_actual_count` × 10 shipped, `benchmark_pending` × 21 unbuilt); shipped methods keep verified actual counts. |
| E | Strict `EngineMethodFamily` union (7 values) replaces `family: string`; documented: first five exist in CPV1 today, `relationship_compatibility` + `japanese_cultural_symbolic` are frozen MTF-1 additions whose runtime registration requires a later additive CPV1 extension package; arbitrary strings prohibited; DB free text does not remove TypeScript governance. Former finding F-1 is now a **documented implementation prerequisite** with the exact target union, not an open question. |
| F | Typo/consistency sweep: `24результ` → "24 results"; zero Cyrillic remains; stale `multi-result` phrasing → `DimensionProfileResult`; catalog-reconciliation state-8 wording aligned to the two-class boundary. |
| G | Validator expanded from 12 to 27 checks covering all of the above (see `scripts/validate-mtf1-docs.mjs` output). |

## (a2) Defects still present at the MTF-1.1 HEAD `9e74b15` (found by Founder review, fixed in MTF-1.2)

These defects existed at `9e74b15`; the MTF-1.1 review did not catch them.

| # | Defect |
|---|---|
| DF-8 | **Forge archetype-only production steps remained after result polymorphism** — the contract gained the tagged union (Correction C) but Forge steps 11–13 still mandated "Original result archetypes", "per archetype" free copy, and a report for every method, forcing archetype-shaped content onto state-record/profile/symbolic/imported methods. |
| DF-9 | **Universal scoring/reproducibility fields contradicted recorded and imported variants** — `EngineResultBase` forced `bankVersion`, `scoringVersion`, and `reproducibility.deterministic: true` onto ALL variants, which is false for `StateRecordResult` (no scoring occurred) and `ImportedExternalResult` (no YORISOU computation occurred). |
| DF-10 | **Entertainment isolation relied partly on convention** — S01's exclusion was expressed via empty `recommendationTags` and its `methodEvidenceClass`, not by an explicit structural result policy; downstream consumers had no single field to enforce. |
| DF-11 | **Daily-state cross-method semantics were ambiguous** — `comparisonEligibility.crossMethod: false` could be read as "invisible to the Understanding Graph", contradicting the intended source-separated current-state context role. |

## (b2) Corrections applied in MTF-1.2

| # | Correction |
|---|---|
| A2 | Forge step 11 → **"Original result model"**: variant selection first (justified by user need), then variant-specific production requirements (archetype / state-record / dimension-profile / symbolic-reflection / imported-external / entertainment-only, each with its own artifact list); steps 12–13 made result-variant-aware; a method may legitimately have no archetype, no deep report, a timeline instead of a report, a profile instead of a type, or an acknowledgement instead of an interpretation; the Forge never forces content to satisfy a template. |
| B2 | `EngineComputationProvenance` tagged union (`scored` / `recorded_state` / `symbolic` / `imported_external`); scoring-specific fields removed from `EngineResultBase`; each result carries the variant-appropriate provenance; fake values (`"none"` scoring version, `"external"` bank version, `deterministic: true` without computation) prohibited; `RecordedStateProvenance.yorisouScoring: null` and `ImportedExternalProvenance.yorisouBankVersion/yorisouScoringVersion/yorisouRescoring: null` are structural. |
| C2 | `UnderstandingPolicy` (`method_derived_eligible` / `symbolic_private_only` / `imported_user_confirmed_only` / `excluded_entertainment`) — exactly one per result, carried on `EngineResultBase`; S01's exclusion is now **structural** (`excluded_entertainment` covering Understanding Graph, psychological/personality observations, compatibility synthesis, recommendation, Companion memory, Community matching, and archive-derived identity summaries; sharing/casual-return/consented non-personal analytics remain permitted); binding universe mapping table records variant + provenance + policy per method class. |
| D2 | Daily-state semantics made explicit: `comparisonPolicy: "method_local_timeline_only"` (never numerically compared or averaged with another method; no universal score) SEPARATED from `understandingPolicy: "method_derived_eligible"` (may provide source-separated current-state context — timing/context relations — inside CPV1); `crossMethod: false` no longer exists to be misread. |
| E2 | Validator expanded 27 → 47 labeled checks (§7 list); adapter map S01 row aligned to the structural policy. |

## (c) Remaining genuine future gates (NOT defects of this package)

1. **CPV1 MethodFamily additive extension** — required before registering `relationship_compatibility` / `japanese_cultural_symbolic` methods (implementation prerequisite; exact union specified in the contract).
2. **ND-2 birth-data retention policy** and **ND-3 name retention policy** — Founder policies gating every P4/P2-retention method's Forge step 3.
3. **G-1/G-2 protected-copy corrections** (120Q confidence copy, 24問 badge) — separately Founder-gated runtime package.
4. Engine implementation itself (all of it) — later package; nothing in MTF-1/1.1 is runtime code.
5. Two-person consent transport design; `repeated_check` cadence/history capability; image/color/card formats; `DimensionProfileResult` rendering — engine-package work items.

## (d) Non-mutation invariant (all three packages)

No file under `app/`, `lib/`, `content/`, `data/`, `public/`, or `supabase/` changed; no migration changed; `lib/cpv1` untouched (all CPV1 references are documentation comparisons); Production `main` untouched; PR #113/#114 untouched; across MTF-1, MTF-1.1 and MTF-1.2 the only non-doc file is the non-runtime docs validator `scripts/validate-mtf1-docs.mjs`, imported by nothing.

## Dimension review (post-correction status)

| Dimension | Initial MTF-1 truth | Post-MTF-1.1 status |
|---|---|---|
| Product coherence | PASS (composition sound) | PASS |
| Originality | PASS with DF-4 (preselected shapes) | PASS — benchmark stage closes DF-4 |
| Copyright/trademark | PASS | PASS |
| Traditional-source risk | PASS with DF-2 (over-broad exclusion masked the real layered model) | PASS — two-class boundary explicit |
| Clinical/diagnostic risk | PASS | PASS |
| Privacy & two-person consent | PASS with open ND-2/ND-3 | PASS with the same open Founder policies (unchanged, genuinely future) |
| Japanese localization | PASS with DF-6 (typo) | PASS |
| Dynamic-engine feasibility | **FAIL at `51a3916`** (DF-3 — result model could not represent the frozen universe) | PASS — polymorphic union |
| Channel compatibility | PASS | PASS |
| CPV1 contract compatibility | PASS with DF-1/DF-5 (name collision + unrestricted family carried into the package's own vocabulary) | PASS — two-axis rule + strict union; CPV1 untouched |
| Scope control | PASS | PASS |

**MTF-1.2 note on the dimension table:** the "Post-MTF-1.1 status" column above reflects what was believed at `9e74b15`; DF-8..DF-11 show that the engine-feasibility and CPV1-compatibility rows were still not fully sound at that HEAD (archetype-forced Forge, contradictory universal provenance, convention-based entertainment isolation, ambiguous daily-state semantics). Post-MTF-1.2, those four defects are corrected as A2–D2; the remaining gates in (c) are unchanged.
