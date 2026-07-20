# MTF-1 — Method Source & Rights Matrix

One **primary** rights/originality route per method (the eight canonical routes). Where a route requires review, the unresolved fields are listed explicitly — an unresolved field means the method CANNOT advance past Test Pattern Forge step 3 until it is resolved and recorded.

Routes: `YORISOU_ORIGINAL_EXISTING` · `YORISOU_ORIGINAL_REBUILD_CANDIDATE` · `PUBLIC_DOMAIN_REIMPLEMENTATION_REVIEW` · `OPEN_LICENSE_REVIEW` · `LICENSED_INTEGRATION_REQUIRED` · `OFFICIAL_HANDOFF_OR_USER_IMPORT_ONLY` · `TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW` · `BLOCKED_OR_NOT_RECOMMENDED`

## A. YORISOU_ORIGINAL_EXISTING (first-party, provenance verifiable in-repo)

| method_id | Provenance evidence | Notes |
|---|---|---|
| imairo-120q | `data/yorisou/120q-question-bank.generated.json` + `docs/yorisou/120q/` embedded batches; scoring master 600 rows | generator itself is founder-held (T20) — provenance for REGENERATION, not ownership, is the open item |
| c02-current-state | `lib/yorisou-tests/generated/C02_…v1_0.ts` | first-party bank |
| f01-work-fit / f02-workplace-fit | `generated/F01_… / F02_…` | first-party banks |
| relationship-fatigue-24q | `app/tests/relationship-fatigue/data.ts` | first-party |
| love-distance | `app/tests/love-distance/data.ts` | first-party |
| work-rhythm / name-impression / local-life | `app/data/yorisouQuestionSets.ts` | first-party |
| s01-omikuji | `generated/S01_…` — 48 original verses | omikuji is a cultural FORM (unprotectable); the verses are first-party originals; classification `traditional_symbolic_entertainment` fixed (§3.4) |
| (R01 / R04 production banks) | `generated/R01_…v1_3 / R04_…` | first-party; retained on Production; successors are separate rebuilds |

## B. YORISOU_ORIGINAL_REBUILD_CANDIDATE (all content newly created; only abstract patterns reused)

| method_id | Abstract pattern permitted | Must be newly created |
|---|---|---|
| daily-check-in | periodic self-report check-in (generic) | inputs, states, copy, cadence model, history presentation |
| relationship-pair-check | first-party R01 structural patterns ONLY (two-person flow, pair-dimension comparison, gap interpretation, pair rendering) — §3.2 | all questions, dimensions, results, copy; two-person consent design |
| name-pair-impression | first-party R04/NI structural patterns (name input + optional questions + impression rendering) — §3.3 | all content; boundary copy (not 姓名判断/fate/certainty/marriage/science) |
| yorisou-values / yorisou-motivation | 5-point + trade-off self-report (generic) | dimensions, items, options, scoring, archetypes, copy |
| communication-rhythm / recovery-rest | scenario-choice self-report (generic) | everything |
| image-color-reflection | color/image selection reflection (generic) | original color fields / abstract original imagery (no third-party image); selection model; copy |
| yorisou-symbolic-cards | card-draw reflection (generic form) | ORIGINAL deck art + meanings (no copied/imitated deck) |
| dream-reflection | guided journaling prompts (generic) | all prompts (no third-party dream dictionary) |

## C. PUBLIC_DOMAIN_REIMPLEMENTATION_REVIEW

| method_id | source_text | school/variant | calculation_engine | translation_route | commentary_ownership | commercial_permission | attribution | public_claim_boundary | raw_input_sensitivity | retention |
|---|---|---|---|---|---|---|---|---|---|---|
| big-five-ipip | UNRESOLVED — exact IPIP item set + hosting source to be verified | UNRESOLVED — which IPIP inventory (e.g. 50/100/120-item pools) | scoring keys published with pool — verify per-set | UNRESOLVED — original JA translation required (no third-party translation reuse) | interpretation copy must be YORISOU-original | UNRESOLVED — verify PD/commercial terms per item set + jurisdiction | follow source requirements once verified | non-clinical preference reflection only; NO diagnosis; profile ≠ verdict | answers only (P1) | standard result retention |
| numerology | reduction rules (Pythagorean vs Chaldean) — UNRESOLVED which | system must be explicit | trivial deterministic | n/a | ALL interpretation text YORISOU-original | rules unprotectable once verified | none required | symbolic only; no fate/certainty | birth date + name (P4) | UNRESOLVED — define birth-data retention |
| i-ching | classical 易経 text PD; edition UNRESOLVED | commentary tradition UNRESOLVED | hexagram draw trivial | UNRESOLVED — modern JA translations are protected; need original rendering or verified-PD edition | commentary must be YORISOU-original or verified PD | verify edition status | edition citation | symbolic entry point only; no decision authority | selection only (P1) | standard |
| chinese-zodiac | sign mapping (calendar provenance UNRESOLVED — solar vs lunar boundary handling) | n/a | trivial | n/a | ALL interpretation YORISOU-original | mapping unprotectable | none | symbolic only | birth date (P4) | UNRESOLVED retention |

## D. LICENSED_INTEGRATION_REQUIRED

| method_id | unresolved fields |
|---|---|
| astrology-natal | ephemeris data licence (source, terms, commercial use); house system + tropical/sidereal choice; ALL interpretation YORISOU-original; birth date/time/location = P4 with UNRESOLVED retention policy; claim boundary: symbolic reference only, never authority for 医療・法律・金融・雇用・関係 decisions |
| tarot | deck decision: commercial licence for an existing deck OR a fully-original YORISOU deck (which would re-route to REBUILD — a future Founder decision, not made in MTF-1); spread + interpretation authorship; no modern deck art may be copied or closely imitated |

## E. OFFICIAL_HANDOFF_OR_USER_IMPORT_ONLY

| method_id | rule |
|---|---|
| mbti-import-handoff | Trademarked instrument. YORISOU may accept a user-entered result or hand off to an official provider. **Embedding, recreating, paraphrasing, or "inspired-by" cloning of the instrument is prohibited.** Imported results are user-declared observations (CPV1 `user_declared` evidence class), never YORISOU findings. |

## F. TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW

| method_id | source_text | school/variant | calculation_engine | translation_route | commentary_ownership | commercial_permission | attribution | public_claim_boundary | raw_input_sensitivity | retention |
|---|---|---|---|---|---|---|---|---|---|---|
| ziwei-dou-shu | UNRESOLVED | UNRESOLVED (classical vs modern schools) | UNRESOLVED (star-placement rules vary by school) | UNRESOLVED | must be original once school fixed | UNRESOLVED | school citation | symbolic only; no fate/diagnosis/high-stakes authority | birth date+time (P4) | UNRESOLVED |
| bazi-four-pillars | UNRESOLVED | UNRESOLVED | calendar/timezone conversion provenance UNRESOLVED | UNRESOLVED | original once fixed | UNRESOLVED | school citation | same | birth date+time (P4) | UNRESOLVED |
| cheng-gu | weighting-table variant UNRESOLVED | variant UNRESOLVED | table lookup | verse translation UNRESOLVED | verse text ownership UNRESOLVED | UNRESOLVED | citation | same | birth date+time (P4) | UNRESOLVED |
| five-elements | mapping model UNRESOLVED | UNRESOLVED | trivial once fixed | n/a | original corpus required | mapping unprotectable | none | same | birth date (P4) | UNRESOLVED |
| name-hanzi-reflection | stroke/meaning model UNRESOLVED (do NOT copy 姓名判断 tables) | school UNRESOLVED | stroke counting variant-dependent | n/a | meaning corpus must be original | UNRESOLVED | none | not 姓名判断; symbolic view only | name (P2) | name-retention policy required |

## G. BLOCKED_OR_NOT_RECOMMENDED (standing)

- Any clinical/diagnostic instrument (depression/anxiety screens, attachment CLINICAL scales, personality disorder inventories) — YORISOU is non-clinical by identity.
- Unlicensed embedding of any trademarked instrument (MBTI et al.).
- Copying any modern tarot/oracle deck art, dream dictionary, or proprietary interpretation corpus.
- Any method whose value depends on deception (fake precision, fabricated validation).

## Cross-cutting verification (asserted for the whole matrix)

Verified in MTF-0 (2026-07-20): no proprietary questions, translations, labels, scoring tables, report copy, or card art exist anywhere on `main` or in git history; the only trademark-adjacent entry (MBTI) is already constrained to import/handoff; every gated registry entry carries an explicit `rightsSource` statement instead of content. This matrix carries that state forward and makes it binding for all future methods.
