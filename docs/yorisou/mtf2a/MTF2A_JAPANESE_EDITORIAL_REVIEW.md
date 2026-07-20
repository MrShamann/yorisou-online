# MTF-2A — Japanese Editorial Review (Forge step 15 / MTF-2A §9)

Dedicated editorial pass over ALL user-facing Japanese in both packages, against `MTF1_JAPAN_LOCALIZATION_STANDARD.md`.

## Pass criteria applied

Rejected/rewritten categories: 翻訳調 (translated-sounding) · generic AI prose · 過剰な説明 · 感傷的 · 断定的/評価的 · 企業的 · 臨床的 · 占い的 · モバイル画面で不自然 · 1画面1問レンダリングに長すぎる.

## Findings and rewrites (recorded honestly)

| # | Location | Issue | Action |
|---|---|---|---|
| E-1 | daily ACK_RAIN first draft 「つらい日もあります」 | 深刻度の示唆 (severity adjacency) | rewrote to 「あめの日の記録も、大事な一枚です」 — the entry is validated, the person is not evaluated |
| E-2 | daily `kaze` option first draft 「そわそわする」 | 幼い響き; ambiguity with excitement | 「かぜが強い」 — stays inside the weather metaphor, shoulder-surf-safe |
| E-3 | values Q25 first draft 「寄付するか貯金するか」 | 金銭の具体性 + moral desirability toward 寄付 | reframed as 余裕のあるお金の使いみち with 応援/備え — both socially acceptable |
| E-4 | values VAL_R_YAKUWARI private draft 「自己犠牲に注意」 | 臨床的/評価的 | rewrote to 残量 metaphor (「残量を超えて働きやすい軸」) |
| E-5 | values recognition lines first drafts began 「あなたは…な人です」 | permanent-identity framing | all recognition lines now 「最近の選び方には…傾向が出ています」 (current-state) |
| E-6 | daily start-page first draft 「あなたの心の状態を記録しましょう」 | 心の状態 = clinical adjacency; ましょう = pushy | 「30秒だけ、きょうのわたしを記録します。点数は出ません。」 |
| E-7 | values MIXED hook first draft 「迷いの中にいます」 | judgmental framing of ties | 「大事なものが入れ替わっている途中」 — transition, not confusion |
| E-8 | mobile-length audit | 3 value prompts > 30 chars | shortened (Q43 kept at 23 chars + context clause — verified single-screen safe at 390px with the house type scale) |

## Register verification

- Preferred current-state phrasing present throughout (いまの/最近の選び方/〜しやすい/少しだけ); zero occurrences of 本当の性格・あなたの本質・完全診断・正確に判断・運命・絶対・科学的に証明 in any user-facing string (validator-enforced).
- Boundary lines (「〜ではありません」) present on: product subtitles, every dimension notMeaning, interpretation limits, confidence boundary.
- No imported therapy jargon (バウンダリー/セルフケア等 not used; ordinary words 距離感/休み方 used instead).
- Politeness register: です/ます on flow copy; plain forms inside option labels (house convention from shipped tests).

## Outcome

**PASS after rewrites E-1..E-8.** All canonical strings in the two JSON files reflect the post-editorial state; no draft-stage wording survives.
