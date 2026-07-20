# MTF-1 — Founder Decision Record

## Fixed decisions (FINAL for this package — recorded, not reopenable here)

| ID | Decision |
|---|---|
| D-3.1 | YORISOU is a **multi-method platform**; 120Q is one deep method among peers; no fixed Persona architecture governs the product; methods remain source-separated; symbolic/cultural methods never presented as scientific evidence, diagnosis, fate, certainty, or high-stakes authority. |
| D-3.2 | **R01** is neither mechanically deleted nor blindly retained. Successor: **ふたりの関係チェック** (`relationship-pair-check`). Only safe first-party structural patterns may be reused (two-person flow, pair-dimension comparison, distance/gap interpretation, pair-result rendering). Successor requires originality + privacy review before implementation. Production R01 route untouched in MTF-1. |
| D-3.3 | **R04** successor: **名前から受ける関係印象チェック** (`name-pair-impression`) — name-impression + interaction-reflection. NOT 姓名判断, fate prediction, compatibility certainty, marriage prediction, or scientific personality evidence. Production R04 route untouched in MTF-1. |
| D-3.4 | **S01** remains a lightweight Japanese cultural entertainment surface, classified `traditional_symbolic_entertainment`. It must never update psychology evidence, personality dimensions, relationship compatibility, universal user scores, or clinical/professional recommendations. **Launch Supporting, not Core.** Production S01 route untouched in MTF-1. |
| D-3.5 | **120Q confidence:** no new statistical confidence formula is invented or approved. The false 「回答数がまだ少ないため…」 explanation MUST be corrected later; until separately validated, the permitted statement is conceptually 「このバージョンは統計的に検証された確信度スコアを提供しません」. Protected runtime copy is NOT changed in MTF-1; the correction is a **separately gated implementation item** (see below). |
| D-3.6 | `yorisou-values` → **Launch Core**. `yorisou-motivation` → **Launch Supporting**. |
| D-3.7 | Original visual/symbolic methods approved architecturally. Custom card-deck artwork is **not** an App V1 blocker. No third-party tarot, oracle, illustration, or image asset may be copied. |
| D-3.8 | PR #113 `app2/familyReports.ts` may be **inspected as reference only**; wholesale copy into `main` prohibited. Any future port requires: content-by-content extraction register, Japanese editorial review, methodology review, originality review, result differentiation, trust-risk review. |
| D-3.9 | PR #113 and PR #114 remain open as reference; not merged/closed/retargeted/updated/commented in MTF-1. Clean-main CPV1 contract is canonical; `lib/cpv1` and CPV1 migrations are NEVER ported from PR #114. |
| D-4 | Launch Test Universe V1 composition is **frozen** exactly as `MTF1_LAUNCH_TEST_UNIVERSE.md` (Core 10 / Supporting 9 / Rights Review 7 / Later Cultural 5+open). No silent group moves; corrections only via a new Founder-decision request. |

## Separately gated implementation items (created by fixed decisions; NOT executed in MTF-1)

| Item | Gate |
|---|---|
| G-1 | **120Q confidence-copy correction** (T5): replace the false "insufficient answers" explanation with the honest no-validated-confidence statement (D-3.5 wording, conceptually). Touches protected runtime copy (`app/result/reveal/revealContent.ts`, `currentStateCheckV1.ts`) → requires its own Founder-authorized package. |
| G-2 | **T4 badge correction** (「24問」→ truthful 120問 on `app/data/productCards.ts:27`): trivial but touches a protected marketing surface → same later package as G-1 is recommended. |
| G-3 | **R01/R04 successor transition** (route swap/retirement timing after successors ship) → separate package after both successors pass Founder review. |

## New decisions discovered during MTF-1 (genuinely open — NOT decided here)

| ID | Decision needed | Context |
|---|---|---|
| ND-1 | **Tarot deck route**: commercial licence for an existing deck vs commissioning a fully-original YORISOU deck (which would re-route tarot from `LICENSED_INTEGRATION_REQUIRED` to `YORISOU_ORIGINAL_REBUILD_CANDIDATE`). | Only relevant when Later Cultural Systems are scheduled; no urgency. |
| ND-2 | **Birth-data retention policy** (P4 class): a single platform-wide policy for birth date/time/location retention (store vs compute-and-discard vs user-choice) is needed before ANY Rights-Review-Queue or Later-Cultural method using birth data can pass Forge step 3. | Affects numerology, chinese-zodiac, astrology-natal, ziwei, bazi, cheng-gu, five-elements. |
| ND-3 | **Name retention policy** (P2 class): how long name inputs are retained for name-impression / name-pair-impression / name-hanzi (compute-and-discard is the privacy-preferred default; confirm). | Affects three methods; blocks name-pair-impression content package. |
| ND-4 | **DTE dormant engine disposition**: keep `lib/yorisou/dte/` as a dormant reference (status quo), or formally retire it with a removal package once the Dynamic Test Engine contract is implemented. | MTF-1 adapter map recommends "retain-dormant, do not build on it"; formal retirement is a later choice. |
| ND-5 | **`/en/result` 31-persona lab disposition**: keep as lab, gate it, or remove — it can display results no user earned and is the origin of the T1/T2 naming conflicts. | Not blocking App V1; recommend deciding before store submission. |

No other decision from §3/§4 is reopened.
