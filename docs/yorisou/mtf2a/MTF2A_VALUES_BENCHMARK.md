# MTF-2A — Yorisou Values: Benchmark Records (Forge steps 5 & 11)

## A. Format benchmark (step 5 — mandatory ladder)

| Format | Completion | Free-result credibility | Coverage | Verdict |
|---|---|---|---|---|
| 24-item multi-choice | ~5 min | moderate | 21 pairs cannot each be measured even once with per-item MC | **rejected** — multi-choice invites socially-desirable middle answers on values; the trade-off pressure IS the construct |
| **48-item A/B** | **~8 min (10s/item)** | **strong — every one of the 21 dimension pairs measured ≥2×** | 21×2 + 6 third passes | **SELECTED** |
| 60-item A/B | ~10 min | marginal gain (2.9× vs 2.3× per pair) | — | rejected — crosses the casual-mobile ceiling for a retakeable check |
| 72-item A/B | ~12 min | deep-tier burden | — | rejected — wrong tier |
| 84-item A/B | ~14 min | — | — | rejected — competes with the 120Q deep anchor |

Evaluation axes (§7.2): mobile burden (8 min holds attention one commute), completion time, free-result credibility (48 answers justify a substantive reading), deep-report density (pairwise data feeds the tensions module), dimension coverage (7 dims × 13–14 appearances), scoring stability (each pair ≥2 measurements; 6 highest-relevance pairs get a 3rd), repeated use (re-take in a season is reasonable), JP consumer expectations (共通の「どっち派」形式は自然、ただし文言は全て新規), share appeal (「〜たい時期」 result names), LINE delivery (one A/B pair per LIFF screen), production burden (48 scenarios authored + maintained; 60+ raises maintenance without product gain).

**Decision (recorded):** 48-item A/B forced trade-off · one pair per screen · **main tier** · ~8 minutes. 選定は製品判断であり、科学的に検証された最適値という主張ではない。

## B. Result-model benchmark (step 11 — after the construct/question model, per MTF-1.1 rule "do not default to 6–8")

| Structure | Verdict |
|---|---|
| 7 single-dimension results | rejected — loses the secondary priority, which is the most interesting part of a values reading |
| 21 unordered top-2 pair results | rejected — copy fragments into thin variants; small answer changes flip pair identity on retest (churn); ~3× maintenance |
| 14 (7 × 2 flavors) | rejected — duplicates copy without adding recognition value |
| **7 dimension-led + 1 mixed, secondary as a live signal** | **SELECTED** |

**Count derivation (explicitly not a default):** the result count follows the **7-dimension construct** — result identity = the currently-leading priority; texture comes from `secondarySignals` (native to `ArchetypeResult`), not from result multiplication. The mixed result exists because the normalized top dimensions are close and the method does not have sufficient basis to force one clear primary — **Mixed is a valid scored outcome, not an incomplete state, and does not by itself prove transition, conflict or indecision.** Total **8 result records**.

**Retest interpretation:** 結果が変わるのは自然なこと。前回との違いは「変化した点」としてことばで示し、優劣・悪化では示さない。

Canonical records: `yorisou-values.v1.json` → `benchmarkDecision`, `resultModelBenchmark`.
