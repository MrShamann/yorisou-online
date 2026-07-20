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
| E-6 | daily start-page first draft 「あなたの心の状態を記録しましょう」 | 心の状態 = clinical adjacency; ましょう = pushy | 「1分だけ、きょうのわたしを記録します。点数は出ません。」（当時は30秒表記／MTF-2A.1で1分に訂正） |
| E-7 | values MIXED hook first draft 「迷いの中にいます」 | judgmental framing of ties | 「大事なものが入れ替わっている途中」（当時）→ MTF-2A.1でさらに事実ベースへ再訂正（下記A1-6） |
| E-8 | mobile-length audit | 3 value prompts > 30 chars | shortened (Q43 kept at 23 chars + context clause — verified single-screen safe at 390px with the house type scale) |

## Register verification

- Preferred current-state phrasing present throughout (いまの/最近の選び方/〜しやすい/少しだけ); zero occurrences of 本当の性格・あなたの本質・完全診断・正確に判断・運命・絶対・科学的に証明 in any user-facing string (validator-enforced).
- Boundary lines (「〜ではありません」) present on: product subtitles, every dimension notMeaning, interpretation limits, confidence boundary.
- No imported therapy jargon (バウンダリー/セルフケア等 not used; ordinary words 距離感/休み方 used instead).
- Politeness register: です/ます on flow copy; plain forms inside option labels (house convention from shipped tests).

## Outcome

**PASS after rewrites E-1..E-8.** All canonical strings in the two JSON files reflect the post-editorial state; no draft-stage wording survives.

## MTF-2A.1 editorial corrections (second pass, recorded honestly)

| # | Location | Issue at `b8d8338` | Action |
|---|---|---|---|
| A1-1 | daily subtitle/start 「30秒」 | benchmark selected 45–60s — the 30-second claim was untrue | 「1分のじぶん記録」／「1分だけ…」; no sub-minute promise |
| A1-2 | daily privacy 「だれにも見えません」「共有されることはありません」 | absolute claims exceed what any service can promise | accurate boundaries: 非公開が基本／他の利用者に公開されない／中身は共有カード・URLに載らない／保存・処理はプライバシーポリシーに基づく／活用には同意が必要 |
| A1-3 | 7 acknowledgements | future predictions (風はずっとは吹きません), outcome guarantees (景色は変わります・うまくいきます), it-will-work claims (効きそうです), mobility assumption (道を歩く), unrequested advice | rewritten per the risk pass (keep 4 / polish 2 / rewrite 7 — decisions recorded in the JSON) |
| A1-4 | PACE result 「取り戻したい」 | assumes something was previously lost | 「自分のペースを守りたい時期」 |
| A1-5 | share lines all 「いまは「〜」でした。」 | single template across 8 results | 8 individually authored constructions |
| A1-6 | MIXED result copy | inferred transition/life-change/future configuration/relationship instability from a close score | renamed 「大事なことが並ぶ時期」; copy states only what the answers show (top axes close; context-dependent choices; no clear first) |
| A1-7 | private layers | recovery-route claim (TSUNAGARI), unmeasured guilt (YAKUWARI), needs-claim (JIKKAN) | rewritten traceable-to-answers |

**Outcome: PASS after A1-1..A1-7.** Canonical JSONs reflect the corrected state.
