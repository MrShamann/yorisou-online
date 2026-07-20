# MTF-2A — Yorisou Values「いま大事にしたいことチェック」Product Specification

Canonical machine spec: [`yorisou-values.v1.json`](./yorisou-values.v1.json). This document explains and justifies it.

## 1. Identity (fixed per MTF-2A §7.1)

`yorisou-values` · family `yorisou_original_assessment` · `method_evidence_class: yorisou_original_reflection` · **`execution_model: scored`** · result `ArchetypeResult` · `understanding_policy: method_derived_eligible` · rights `YORISOU_ORIGINAL_REBUILD_CANDIDATE` → `YORISOU_ORIGINAL_AUTHORED_PENDING_FOUNDER_REVIEW` · **`activation_state: gated`** · **`confidence_policy: none_stated`**.

**Name:** 「いま大事にしたいことチェック」／subtitle 「最近の選び方から、いまの優先順位を見てみる」。The product explores the priorities and tensions currently shaping choices. It is NOT a permanent values diagnosis, a moral ranking, a scientific psychometric claim, a copy of any named framework, or a compatibility score.

## 2. Original construct model (7 dimensions)

Derived from Japanese everyday decision contexts (転職・引っ越し・週末・誘い・頼まれごと・夜のリズム — the situations in the bank), NOT from any external factor list. The §7.3 example list was a prompt, not a template: e.g. "responsibility/contribution" were merged into 役に立つ実感; "freedom" was split between 自分のペース (autonomy of pace) and 心が動く瞬間 (aliveness) because they trade off differently in the bank scenarios; "security" became 見通しの安心 (predictability, not safety).

| ID | JA name | Definition (short) | Common tension |
|---|---|---|---|
| `anshin` | 見通しの安心 | 先が読めること・足場が揺らがないこと | seicho / jikkan |
| `pace` | 自分のペース | 自分で選び、自分の速度で進むこと | tsunagari / yakuwari |
| `tsunagari` | つながりの温度 | あたたかい関わりを近くに置くこと | pace / totonoi |
| `seicho` | のびしろの手応え | できることが増えていく感覚 | anshin / totonoi |
| `yakuwari` | 役に立つ実感 | だれかの力になれている実感 | pace / totonoi |
| `totonoi` | 暮らしの整い | 生活のリズムと余白 | tsunagari / jikkan |
| `jikkan` | 心が動く瞬間 | 楽しさ・面白さ・心が動く体験 | anshin / totonoi |

Each dimension carries behavioral anchors, a 「〜ではありません」 not-meaning line, and public/private suitability (all public_safe) — full records in the JSON.

## 3. Question bank (values-bank-v1.0)

**48 items · A/B forced trade-off · all 21 dimension pairs ×2 (items 1–42, sides balanced) + 6 third-pass pairs (43–48).** Appearances: anshin/tsunagari/seicho/totonoi/jikkan 14 · pace/yakuwari 13 (denominator-normalized). All items P1 (no financial/medical/legal/intimate detail); `work_context` flagged items use neutral workplace situations, never employer-screening framing. Full bank: `MTF2A_VALUES_QUESTION_BANK.md` + JSON.

## 4. Scoring (values-scoring-v1.0 — execution-model artifact; MTF-2A.2 final)

- **Pairwise win-rate:** each answered item adds one win to the chosen dimension; `dimensionScore = wins / appearances` among answered items (method-local normalization only).
- **Primary/secondary:** highest / second-highest win-rate; the secondary ALWAYS renders as a named signal, never a second result.
- **Mixed rule (pair-independent):** gap(top1, top2) < 0.05 → `VAL_R_MIXED`. The threshold sits below the smallest single-answer increment (1/14), so identical normalized relationships classify identically regardless of which pair is on top — the former head-to-head conjunct was removed because three-comparison pairs could never satisfy a direct tie at full completion. Tie-break is now a SEPARATE concept (secondary-signal ordering only, by bank declaration order).
- **Insufficient coverage (MTF-2A.1):** a canonical result requires ALL 48 answers (identical 13/14 exposure for every result — scoring integrity, not scientific validation); 0-47 answers → `insufficient_coverage`: no primary/secondary/Mixed, resume offered, exact remaining count shown, no imputation, no partial win-rate interpretation.
- **Internal numerics truth:** method-local win rates exist internally; they are never user-facing ranking scores, never exposed, never used to compare people.
- **Deterministic + reproducible:** same (bankVersion, scoringVersion, answers) ⇒ same result on every channel; bank content hash pinned at implementation.
- **No universal score. No cross-method numeric comparison. `confidence_policy: none_stated`** with the natural-language boundary: 「このテストは、統計的に検証された確信度スコアを提供するものではありません。」

## 5. Results (8) & rendering

7 dimension-led results (「〜たい時期」 current-priority naming) + `VAL_R_MIXED` 「大事なことが並ぶ時期」 (renamed in MTF-2A.1); PACE renamed 「自分のペースを守りたい時期」. Count derivation and rejected alternatives: `MTF2A_VALUES_BENCHMARK.md` §B. Secondary signal (v1.1, honest non-graded): 「もうひとつ近かった軸」 — name + one recognition line, NO strength bands or thresholds in V1; equal seconds resolve by bank declaration order; MIXED shows the close set; insufficient_coverage shows nothing. Full public+private copy: `MTF2A_VALUES_RESULT_COPY.md` + JSON.

Collision check (against 24 public archetypes, 31 personas both name layers, RF 7, LD 7, C02/F01/F02 8×3, R01 8, WR/NI 4+4, companions 8): the 「〜たい時期」 pattern and all eight names are new coinages with zero collisions.

## 6. Deep report (outline only — no content generated beyond outline, per §7.8)

9 modules (now_matters / visible_invisible / tensions / decision_patterns / relationships / work_learning / changing / reflection_prompts / limits). **No payment, pricing, checkout, or locked content exists or is implemented**, and the report itself states this.

## 7. Recommendations & follow-ups

Governed tags only (8-tag list in the JSON); hints, never verdicts; no commercial/affiliate/sponsored content. Follow-up methods restricted to frozen-universe IDs: `c02-current-state`, `daily-check-in`, `work-rhythm`, `relationship-fatigue-24q`, `f01-work-fit`.

## 8. Interpretation limits (user-facing)

「いまの選び方の傾向の整理です。性格の診断でも、優劣の判定でもありません。統計的に検証された確信度スコアは提供しません。結果は状況とともに変わります。採用・配属・評価・選考など、第三者による判断の材料には使えません。」

## 9. Usage boundary (MTF-2A.1 — anti-screening, Founder decision 3.3)

「この結果は、本人がじぶんの選び方をふり返るためのものです。採用・配属・人事評価・入学選考・保険や与信の判断など、第三者が人を選んだり評価したりする目的には適していません。使わないでください。」 — carried canonically in `usageBoundaryJa` and merged into the interpretation limits. A Terms-of-Use clause prohibiting screening use is REQUIRED at implementation (register FD-3).
