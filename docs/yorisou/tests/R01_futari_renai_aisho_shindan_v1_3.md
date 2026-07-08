# R01 ふたり恋愛相性診断 v1.3

**Status:** `review_required`  
**codex_ready:** `false`  
**test_id:** `R01`  
**version:** `v1.3`  
**Owner:** Edward / Yorisou  
**Created for:** Yorisou Phase 1 Public Test Suite repair  
**Target route:** `/tests/r01`  
**Language:** Japanese user-facing copy / English internal notes where useful  

---

## 0. Controller Note

This file replaces the contaminated `R01_futari_renai_aisho_shindan_v1_2.md` asset that incorrectly contained duplicated current-state question-ID content.

This v1.3 file is a complete original R01 Markdown source for Codex import. It is not a launch approval. It remains `codex_ready: false` and `review_required` until Founder / trust-risk review is complete.

Codex must treat this Markdown as the source of truth for R01 implementation. Codex must not invent missing questions, rewrite Japanese copy, merge C02 content, or silently alter scoring/result definitions.

---

## 1. Test Product Summary

- **test name:** ふたり恋愛相性診断
- **test_id:** R01
- **category:** relationship compatibility / pair reflection
- **target user:** Japan-first mobile consumer users who want a light but meaningful two-person relationship rhythm check
- **entry hook:** ふたりの距離感、連絡の温度、話し合い方。好きの強さではなく、関係が続きやすいリズムを見てみる。
- **commercial role:** free public-safe result + paid compatibility report intent later
- **expected completion time:** 6-9 minutes total when both people answer on one device
- **question count:** 60 total / 30 per person
- **answer format:** two-choice self-reflection questions
- **output status:** review_required

---

## 2. Source Handling

- **inspiration source type:** internal founder brief + Yorisou original relationship-distance methodology
- **allowed use:** original self-reflection and pair rhythm questions; relationship communication and compatibility framing
- **prohibited use:** fortune-telling, destiny, name divination, marriage prediction, breakup/reunion probability, clinical/psychological diagnosis
- **originality notes:** All questions, result names, scoring tags, and report outline are original Yorisou copy for v1.3.
- **clinical/copyright risk:** low, if kept as non-clinical reflection and not represented as professional assessment
- **escalation needed:** yes before public launch or paid report activation

---

## 3. Funnel Copy

### 3.1 Landing Headline

ふたりの「合う・合わない」より、続きやすいリズムを見てみる。

### 3.2 Landing Subheadline

連絡の頻度、近づくペース、話し合い方、ひとり時間。  
ふたりの答えから、関係の温度差と安心の作り方をやさしく整理します。

### 3.3 Chips / Badges

- ふたりで回答
- 約6〜9分
- 結果は公開しやすい表現だけ
- 診断・占いではありません

### 3.4 Primary CTA

ふたりでチェックする

### 3.5 Safety Note

これは恋愛の結論を決めるものではありません。  
相性を断定するのではなく、ふたりの距離感や関係リズムを振り返るためのチェックです。

### 3.6 Result CTA

ふたりのリズムを見る

### 3.7 Paid Report CTA

もっと深く読む：ふたりの距離感レポート

### 3.8 Recommendation CTA

次におすすめ：今のわたしチェック / 職場環境フィット診断

---

## 4. Question Set

Each person answers the same 30 questions. Codex must preserve the person split as `A` and `B` or equivalent participant-safe structure.

### ひとり目の質問（30問）

#### R01_Q01_A. 連絡の頻度でいちばん落ち着くのは？
- A. 毎日少しでもつながっていたい
- B. 必要なときに自然に話せればいい

#### R01_Q02_A. 会う予定を決めるとき、近い感覚は？
- A. 早めに決めて安心したい
- B. その時の流れで決めたい

#### R01_Q03_A. 好きな人への愛情表現は？
- A. 言葉やメッセージでちゃんと伝えたい
- B. 行動や態度で伝わればいい

#### R01_Q04_A. 相手が少し元気なさそうなときは？
- A. すぐ気づいて声をかけたい
- B. 少し様子を見て、必要なら支えたい

#### R01_Q05_A. デートで心地いいのは？
- A. 落ち着いた場所でゆっくり話す
- B. 新しい場所や体験を一緒に楽しむ

#### R01_Q06_A. ひとり時間について近いのは？
- A. 恋人がいてもかなり大事にしたい
- B. できれば一緒に過ごす時間を多めにしたい

#### R01_Q07_A. 小さな違和感があるときは？
- A. 早めに言葉にして整えたい
- B. 自分の中で整理してから話したい

#### R01_Q08_A. 恋愛で安心するのは？
- A. 約束や態度が安定していること
- B. 楽しく自然体でいられること

#### R01_Q09_A. 返信が遅い相手に対しては？
- A. 少し不安になりやすい
- B. 理由があればあまり気にしない

#### R01_Q10_A. 相手との距離が近づくタイミングは？
- A. 早い段階で深く知りたい
- B. 時間をかけて自然に近づきたい

#### R01_Q11_A. 恋人との予定が急に変わったら？
- A. 少し乱れるので説明がほしい
- B. 大きな理由がなければ柔軟に合わせる

#### R01_Q12_A. 記念日や節目については？
- A. 大切にすると関係が深まると思う
- B. 自然で無理がなければ十分だと思う

#### R01_Q13_A. 恋人に頼ることについては？
- A. 困ったときはちゃんと頼り合いたい
- B. まず自分で整えてから相談したい

#### R01_Q14_A. 相手の交友関係については？
- A. ある程度知っていると安心する
- B. 信頼して、それぞれ自由でいたい

#### R01_Q15_A. 話し合いで大事だと思うのは？
- A. 曖昧にせず、言葉で確認すること
- B. 責めずに空気を悪くしすぎないこと

#### R01_Q16_A. 恋愛の楽しさはどこにある？
- A. 日常の中で安心が増えること
- B. 新しい自分や世界が広がること

#### R01_Q17_A. 相手にしてもらうと嬉しいのは？
- A. 気持ちを言葉で伝えてくれる
- B. 具体的に助けたり動いてくれる

#### R01_Q18_A. 忙しい時期の関係で近いのは？
- A. 短くても連絡を保ちたい
- B. 忙しい時期はお互い集中したい

#### R01_Q19_A. 将来の話をするタイミングは？
- A. ある程度早めに方向感を知りたい
- B. 関係が育ってから自然に話したい

#### R01_Q20_A. 相手と意見が違うときは？
- A. 違いを整理して着地点を探したい
- B. 無理に結論を急がず、少し置きたい

#### R01_Q21_A. 恋愛で苦手なのは？
- A. 距離が読めず不安になること
- B. 期待されすぎて自由が減ること

#### R01_Q22_A. 一緒にいる時間で重視するのは？
- A. 深く話せること
- B. 気楽に笑えること

#### R01_Q23_A. 相手への小さな不満は？
- A. 溜めずに少しずつ伝える
- B. 自分で消化できるものは流す

#### R01_Q24_A. 旅行や遠出の計画は？
- A. 細かく決めると楽しめる
- B. 余白があるほうが楽しい

#### R01_Q25_A. 恋人に期待する距離感は？
- A. 近くにいてくれる安心感
- B. 近すぎず信頼できる自由さ

#### R01_Q26_A. 感情が揺れたときは？
- A. その場で共有したくなる
- B. 落ち着いてから伝えたい

#### R01_Q27_A. 相手が新しい提案をしてきたら？
- A. 面白そうなら乗ってみたい
- B. 無理がないか確認してから決めたい

#### R01_Q28_A. 関係が長く続く鍵は？
- A. 安心できる習慣を積み上げること
- B. 変化を楽しみながら飽きさせないこと

#### R01_Q29_A. 相手にわかってほしいことは？
- A. 気持ちは言葉にしないと伝わりにくい
- B. 言葉より空気や行動で伝わる部分もある

#### R01_Q30_A. 理想の恋愛の温度感は？
- A. 近くてあたたかい関係
- B. 近いけれど余白もある関係
### ふたり目の質問（30問）

#### R01_Q01_B. 連絡の頻度でいちばん落ち着くのは？
- A. 毎日少しでもつながっていたい
- B. 必要なときに自然に話せればいい

#### R01_Q02_B. 会う予定を決めるとき、近い感覚は？
- A. 早めに決めて安心したい
- B. その時の流れで決めたい

#### R01_Q03_B. 好きな人への愛情表現は？
- A. 言葉やメッセージでちゃんと伝えたい
- B. 行動や態度で伝わればいい

#### R01_Q04_B. 相手が少し元気なさそうなときは？
- A. すぐ気づいて声をかけたい
- B. 少し様子を見て、必要なら支えたい

#### R01_Q05_B. デートで心地いいのは？
- A. 落ち着いた場所でゆっくり話す
- B. 新しい場所や体験を一緒に楽しむ

#### R01_Q06_B. ひとり時間について近いのは？
- A. 恋人がいてもかなり大事にしたい
- B. できれば一緒に過ごす時間を多めにしたい

#### R01_Q07_B. 小さな違和感があるときは？
- A. 早めに言葉にして整えたい
- B. 自分の中で整理してから話したい

#### R01_Q08_B. 恋愛で安心するのは？
- A. 約束や態度が安定していること
- B. 楽しく自然体でいられること

#### R01_Q09_B. 返信が遅い相手に対しては？
- A. 少し不安になりやすい
- B. 理由があればあまり気にしない

#### R01_Q10_B. 相手との距離が近づくタイミングは？
- A. 早い段階で深く知りたい
- B. 時間をかけて自然に近づきたい

#### R01_Q11_B. 恋人との予定が急に変わったら？
- A. 少し乱れるので説明がほしい
- B. 大きな理由がなければ柔軟に合わせる

#### R01_Q12_B. 記念日や節目については？
- A. 大切にすると関係が深まると思う
- B. 自然で無理がなければ十分だと思う

#### R01_Q13_B. 恋人に頼ることについては？
- A. 困ったときはちゃんと頼り合いたい
- B. まず自分で整えてから相談したい

#### R01_Q14_B. 相手の交友関係については？
- A. ある程度知っていると安心する
- B. 信頼して、それぞれ自由でいたい

#### R01_Q15_B. 話し合いで大事だと思うのは？
- A. 曖昧にせず、言葉で確認すること
- B. 責めずに空気を悪くしすぎないこと

#### R01_Q16_B. 恋愛の楽しさはどこにある？
- A. 日常の中で安心が増えること
- B. 新しい自分や世界が広がること

#### R01_Q17_B. 相手にしてもらうと嬉しいのは？
- A. 気持ちを言葉で伝えてくれる
- B. 具体的に助けたり動いてくれる

#### R01_Q18_B. 忙しい時期の関係で近いのは？
- A. 短くても連絡を保ちたい
- B. 忙しい時期はお互い集中したい

#### R01_Q19_B. 将来の話をするタイミングは？
- A. ある程度早めに方向感を知りたい
- B. 関係が育ってから自然に話したい

#### R01_Q20_B. 相手と意見が違うときは？
- A. 違いを整理して着地点を探したい
- B. 無理に結論を急がず、少し置きたい

#### R01_Q21_B. 恋愛で苦手なのは？
- A. 距離が読めず不安になること
- B. 期待されすぎて自由が減ること

#### R01_Q22_B. 一緒にいる時間で重視するのは？
- A. 深く話せること
- B. 気楽に笑えること

#### R01_Q23_B. 相手への小さな不満は？
- A. 溜めずに少しずつ伝える
- B. 自分で消化できるものは流す

#### R01_Q24_B. 旅行や遠出の計画は？
- A. 細かく決めると楽しめる
- B. 余白があるほうが楽しい

#### R01_Q25_B. 恋人に期待する距離感は？
- A. 近くにいてくれる安心感
- B. 近すぎず信頼できる自由さ

#### R01_Q26_B. 感情が揺れたときは？
- A. その場で共有したくなる
- B. 落ち着いてから伝えたい

#### R01_Q27_B. 相手が新しい提案をしてきたら？
- A. 面白そうなら乗ってみたい
- B. 無理がないか確認してから決めたい

#### R01_Q28_B. 関係が長く続く鍵は？
- A. 安心できる習慣を積み上げること
- B. 変化を楽しみながら飽きさせないこと

#### R01_Q29_B. 相手にわかってほしいことは？
- A. 気持ちは言葉にしないと伝わりにくい
- B. 言葉より空気や行動で伝わる部分もある

#### R01_Q30_B. 理想の恋愛の温度感は？
- A. 近くてあたたかい関係
- B. 近いけれど余白もある関係

---

## 5. Scoring Model

### 5.1 Dimensions

| Dimension ID | Japanese Label | Meaning |
|---|---|---|
| `pace` | 関係ペース | 距離を縮める速度、返事の速さ、会う頻度の心地よさ |
| `expression` | 愛情表現 | 言葉・行動・接触・気配りなど、好意の伝え方 |
| `autonomy` | 自分時間 | ひとり時間、予定の自由度、干渉されなさの必要度 |
| `conflict` | すれ違い対応 | 違和感・不満・沈黙・話し合いへの向き合い方 |
| `stability` | 安心設計 | 約束、将来感、生活リズム、信頼の積み上げ方 |
| `stimulation` | 刺激と遊び心 | 新しさ、外出、変化、イベント、楽しさへの欲求 |
| `care` | 気遣い密度 | 相手の変化に気づく力、支える/支えられる感覚 |
| `decision` | 決め方 | 予定・お金・暮らし・次の一歩の決め方 |

### 5.2 Scoring Method

1. Score participant A and participant B separately across the eight dimensions.
2. For each dimension, calculate:
   - `participant_a_score`
   - `participant_b_score`
   - `pair_average_score`
   - `gap_score = absolute difference between A and B`
3. Select candidate result types using strongest `pair_average_score` on the result's trigger dimensions.
4. If several `gap_score` values are high, reduce confidence and prefer `R01_RES_BALANCE_BLEND` unless another result is clearly dominant.
5. Do not produce negative or blaming compatibility language.
6. Public result should show only safe pair-level interpretation, not private answer-by-answer comparison.

### 5.3 Tie-Break Rule

Tie-break order:

1. `R01_RES_BALANCE_BLEND`
2. `R01_RES_STABLE_HOME`
3. `R01_RES_WARM_PACE`
4. `R01_RES_DEEP_TALK`
5. `R01_RES_CARE_MIRROR`
6. `R01_RES_DECISION_TEAM`
7. `R01_RES_GENTLE_DISTANCE`
8. `R01_RES_SPARK_PAIR`

### 5.4 Confidence Rule

- `high`: one result trigger cluster clearly dominates and major gap count is low.
- `medium`: result is clear but one or two dimension gaps should be interpreted carefully.
- `low`: no clear dominant result or multiple large gaps. Use reflective wording and avoid strong claims.

### 5.5 Fallback Result

`R01_RES_BALANCE_BLEND`

---

## 6. Result Archetypes

### R01_RES_STABLE_HOME — 安心を育てるふたり

**One-line recognition:** 派手さよりも、日々の信頼を少しずつ積み上げる相性。

**Public-safe bullets:**
- 約束や態度の安定が関係の土台になりやすい
- 急な変化より、予測できるやさしさが効きやすい
- 小さな確認を重ねるほど安心が深まる

**Private insight direction:** ふたりの関係は、刺激よりも「ちゃんと戻れる場所」を作ることで強くなります。曖昧な不安を放置せず、生活リズムや連絡の温度を早めに合わせると、関係が静かに安定します。

**Paid report angle:** 安心の作り方、約束の扱い、すれ違い時の戻り方を中心に深掘り。

**Recommendation tags:** `stability, care`

### R01_RES_SPARK_PAIR — 刺激でひらくふたり

**One-line recognition:** 新しい体験や軽い遊び心が、距離を自然に縮める相性。

**Public-safe bullets:**
- 一緒に新しい場所へ行くと関係が動きやすい
- 重い確認より、楽しい体験から本音が出やすい
- マンネリを避ける工夫が関係の栄養になる

**Private insight direction:** ふたりは「楽しいから近づく」力が強い組み合わせです。ただし勢いだけで大事な確認を飛ばすと、あとで温度差が出やすい。遊び心の中に小さな約束を混ぜると安定します。

**Paid report angle:** 刺激・予定・自由度・安心確認のバランスを分析。

**Recommendation tags:** `stimulation, pace`

### R01_RES_GENTLE_DISTANCE — 余白を守るふたり

**One-line recognition:** 近すぎない距離が、むしろ信頼を育てやすい相性。

**Public-safe bullets:**
- それぞれの時間を尊重できるほど関係が続きやすい
- 束縛より信頼のルールが効きやすい
- 連絡や予定は少なめでも質が大事

**Private insight direction:** ふたりに必要なのは、常に一緒にいることではなく、離れていても疑わなくてよい設計です。自由を放置に見せないために、最低限の共有ルールを持つと誤解が減ります。

**Paid report angle:** 自分時間、連絡頻度、自由と安心の線引きを整理。

**Recommendation tags:** `autonomy, stability`

### R01_RES_DEEP_TALK — 言葉で深まるふたり

**One-line recognition:** 気持ちや違和感を言葉にするほど、関係が整いやすい相性。

**Public-safe bullets:**
- 話し合いで距離が縮まりやすい
- 小さな違和感を早めに言語化すると強い
- 沈黙より確認が安心につながる

**Private insight direction:** ふたりは、黙って察するよりも言葉で橋をかけるほうが合っています。ただし正しさの確認に寄りすぎると疲れやすい。話す時間と、ただ一緒にいる時間の両方が必要です。

**Paid report angle:** 言葉の温度、話し合いの順序、確認しすぎを防ぐ設計を深掘り。

**Recommendation tags:** `expression, conflict`

### R01_RES_CARE_MIRROR — 気づき合うふたり

**One-line recognition:** 相手の小さな変化に気づき、支え合うことで育つ相性。

**Public-safe bullets:**
- 細かな気遣いが信頼に変わりやすい
- 相手の調子を読む力が関係の強みになる
- 支えすぎ・察しすぎには注意が必要

**Private insight direction:** ふたりは、言葉にならない変化を拾う力があります。一方で、察する側が疲れたり、察してもらう前提になったりするとズレます。やさしさを言葉で確認する習慣が必要です。

**Paid report angle:** 気遣いの偏り、支え方、頼り方、疲れのサインを分析。

**Recommendation tags:** `care, expression`

### R01_RES_DECISION_TEAM — 一緒に決めるふたり

**One-line recognition:** 予定や選択を一緒に整理するほど、安心と納得が増える相性。

**Public-safe bullets:**
- 結論までのプロセスを共有すると強い
- 曖昧なまま進めるより、選択肢を並べるほうが合う
- 決め方の癖を知ると衝突が減る

**Private insight direction:** ふたりは、感情だけでなく「どう決めるか」を共有すると関係が安定します。どちらかが主導しすぎるより、選択肢・期限・譲れる点を見える化するのが有効です。

**Paid report angle:** 予定、将来感、お金、暮らしの決め方を中心に整理。

**Recommendation tags:** `decision, conflict`

### R01_RES_WARM_PACE — 温度を合わせるふたり

**One-line recognition:** 近づきたい気持ちと安心確認のバランスが鍵になる相性。

**Public-safe bullets:**
- 連絡や会う頻度の温度合わせが重要
- 好意を隠しすぎないほど安心しやすい
- 急ぎすぎると片方が息切れする可能性

**Private insight direction:** ふたりは好意の温度が見えるほど安心します。ただし、近づく速度がずれると不安や重さに変わりやすい。関係の初期ほど「どのくらいが心地いいか」を軽く確認するとよいです。

**Paid report angle:** 連絡頻度、愛情表現、初期の温度差、近づき方を深掘り。

**Recommendation tags:** `pace, expression`

### R01_RES_BALANCE_BLEND — 違いを活かすふたり

**One-line recognition:** 似ている部分と違う部分を、対立ではなく役割に変えられる相性。

**Public-safe bullets:**
- 完全一致より、補い合いで安定しやすい
- 違いを早めに言葉にすると強みに変わる
- 一方に合わせすぎない設計が大事

**Private insight direction:** ふたりは、全てが同じだから合うというより、違いを扱えると強くなる組み合わせです。大事なのは勝ち負けにしないこと。役割分担と確認の仕方を決めるほど、関係の余白が整います。

**Paid report angle:** 相違点、補完関係、摩擦ポイント、関係ルールを整理。

**Recommendation tags:** `balanced`

---

## 7. Free Result Structure

The free result may show:

1. Result type name.
2. One-line recognition.
3. Three public-safe bullets.
4. Compatibility rhythm summary.
5. One light next step.
6. CTA to save, retake, or read a deeper paid report preview.

The free result must not show:

- participant-specific blame,
- private vulnerabilities,
- answer-level comparison,
- breakup/marriage/reunion probability,
- destiny or fate language,
- paid report core sections.

---

## 8. Paid Report Outline

### Report Title

ふたりの距離感レポート

### Sections

1. **はじめに：このレポートの読み方**  
   相性を決めるものではなく、ふたりの関係リズムを整理するための読み物であることを明記。

2. **ふたりの基本リズム**  
   ペース、連絡、会う頻度、安心の作り方。

3. **近づき方の違い**  
   どちらが早い/遅いではなく、違いが起きやすい場面を整理。

4. **愛情表現の見え方**  
   言葉、行動、気遣い、予定、接触などの表現差。

5. **すれ違いやすい場面**  
   返信、予定変更、沈黙、不安、話し合いのタイミング。

6. **安心を作る小さなルール**  
   連絡頻度、予定の決め方、ひとり時間、違和感の共有方法。

7. **ふたりで話すための問い**  
   責めない確認質問を5〜8個。

8. **次におすすめのチェック**  
   C02 今のわたしチェック、F01 向いている働き方診断、S01 今日のおみくじなど。

9. **Limitations**  
   診断、占い、カウンセリング、結婚判断、別れ/復縁判断ではないこと。

---

## 9. Share Card Copy

### Share Title

ふたりは「{result_name}」タイプ

### Share Subtitle

好きの強さより、続きやすいリズムを見てみる。

### Share Safe Footer

診断・占いではなく、関係リズムのふり返りです。

---

## 10. Recommendation Mapping

### Primary Next Tests

- `C02` 今のわたしチェック — 自分の今の状態を先に整えたい人へ
- `S01` 今日のおみくじ — 軽く戻ってくる daily check-in
- `F01` 向いている働き方診断 — 生活/仕事リズムも含めて見たい人へ

### Recommendation Tags

- relationship_distance
- communication_rhythm
- emotional_expression
- autonomy_boundary
- conflict_repair
- pair_reflection
- public_safe_compatibility
- paid_report_intent

---

## 11. UX Implementation Notes

### Mobile-First Funnel Sequence

1. `/tests/r01` landing page.
2. Short explanation + safety note.
3. Participant A answers 30 questions.
4. Soft transition screen: 次はふたり目の回答です。
5. Participant B answers 30 questions.
6. Result loading/reveal screen.
7. Public-safe free result.
8. CTA: save/share/retake/deeper report preview.
9. Related tests section.

### Required UX Boundaries

- Do not force login.
- Do not require real names.
- Allow nicknames only if already supported; otherwise use ひとり目 / ふたり目.
- Do not display private answer differences in public result.
- Keep result copy safe enough for screenshot.
- Do not add payment flow in this PR.
- Do not add LINE webhook in this PR.

---

## 12. Trust-Risk Check

- **paid-funnel ethics:** no fear conversion, no fake urgency, no hidden insecurity trigger
- **fake discount/countdown check:** none
- **MBTI/trademark/copyright check:** no third-party type system used
- **blocked claims removed:** yes
- **source/copyright risk:** low
- **clinical risk:** low if framed as reflective and non-clinical
- **privacy/data sensitivity:** medium because it involves two-person relationship context; keep no-login and public-safe
- **public/private boundary:** must be preserved
- **commercial/recommendation boundary:** only owned report preview / related tests; no affiliate/sponsored claims
- **escalation required:** yes before public push and paid report launch
- **final verdict:** review_required, implementation allowed as frontend-only review asset

---

## 13. Codex-Ready Data Spec

```json
{
  "test_id": "R01",
  "version": "v1.3",
  "codex_ready": false,
  "review_status": "review_required",
  "test_name_jp": "ふたり恋愛相性診断",
  "slug": "futari-renai-aisho-shindan",
  "category": "relationship_compatibility",
  "route": "/tests/r01",
  "language": "ja-JP",
  "market": "Japan first / mobile first",
  "question_count_total": 60,
  "question_count_per_person": 30,
  "answer_format": "two_choice_per_question",
  "dimensions": [
    {
      "id": "pace",
      "label": "関係ペース",
      "description": "距離を縮める速度、返事の速さ、会う頻度の心地よさ"
    },
    {
      "id": "expression",
      "label": "愛情表現",
      "description": "言葉・行動・接触・気配りなど、好意の伝え方"
    },
    {
      "id": "autonomy",
      "label": "自分時間",
      "description": "ひとり時間、予定の自由度、干渉されなさの必要度"
    },
    {
      "id": "conflict",
      "label": "すれ違い対応",
      "description": "違和感・不満・沈黙・話し合いへの向き合い方"
    },
    {
      "id": "stability",
      "label": "安心設計",
      "description": "約束、将来感、生活リズム、信頼の積み上げ方"
    },
    {
      "id": "stimulation",
      "label": "刺激と遊び心",
      "description": "新しさ、外出、変化、イベント、楽しさへの欲求"
    },
    {
      "id": "care",
      "label": "気遣い密度",
      "description": "相手の変化に気づく力、支える/支えられる感覚"
    },
    {
      "id": "decision",
      "label": "決め方",
      "description": "予定・お金・暮らし・次の一歩の決め方"
    }
  ],
  "questions": [
    {
      "id": "R01_Q01_A",
      "person": "A",
      "prompt": "連絡の頻度でいちばん落ち着くのは？",
      "options": [
        {
          "label": "A",
          "text": "毎日少しでもつながっていたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "必要なときに自然に話せればいい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q02_A",
      "person": "A",
      "prompt": "会う予定を決めるとき、近い感覚は？",
      "options": [
        {
          "label": "A",
          "text": "早めに決めて安心したい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "その時の流れで決めたい",
          "score": {
            "stimulation": 1,
            "autonomy": 1,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q03_A",
      "person": "A",
      "prompt": "好きな人への愛情表現は？",
      "options": [
        {
          "label": "A",
          "text": "言葉やメッセージでちゃんと伝えたい",
          "score": {
            "expression": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "行動や態度で伝わればいい",
          "score": {
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q04_A",
      "person": "A",
      "prompt": "相手が少し元気なさそうなときは？",
      "options": [
        {
          "label": "A",
          "text": "すぐ気づいて声をかけたい",
          "score": {
            "care": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "少し様子を見て、必要なら支えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q05_A",
      "person": "A",
      "prompt": "デートで心地いいのは？",
      "options": [
        {
          "label": "A",
          "text": "落ち着いた場所でゆっくり話す",
          "score": {
            "stability": 1,
            "care": 1,
            "stimulation": -1
          }
        },
        {
          "label": "B",
          "text": "新しい場所や体験を一緒に楽しむ",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q06_A",
      "person": "A",
      "prompt": "ひとり時間について近いのは？",
      "options": [
        {
          "label": "A",
          "text": "恋人がいてもかなり大事にしたい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        },
        {
          "label": "B",
          "text": "できれば一緒に過ごす時間を多めにしたい",
          "score": {
            "pace": 1,
            "care": 1,
            "autonomy": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q07_A",
      "person": "A",
      "prompt": "小さな違和感があるときは？",
      "options": [
        {
          "label": "A",
          "text": "早めに言葉にして整えたい",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "自分の中で整理してから話したい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q08_A",
      "person": "A",
      "prompt": "恋愛で安心するのは？",
      "options": [
        {
          "label": "A",
          "text": "約束や態度が安定していること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "楽しく自然体でいられること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q09_A",
      "person": "A",
      "prompt": "返信が遅い相手に対しては？",
      "options": [
        {
          "label": "A",
          "text": "少し不安になりやすい",
          "score": {
            "pace": 1,
            "care": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "理由があればあまり気にしない",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q10_A",
      "person": "A",
      "prompt": "相手との距離が近づくタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "早い段階で深く知りたい",
          "score": {
            "pace": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "時間をかけて自然に近づきたい",
          "score": {
            "stability": 1,
            "autonomy": 1,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q11_A",
      "person": "A",
      "prompt": "恋人との予定が急に変わったら？",
      "options": [
        {
          "label": "A",
          "text": "少し乱れるので説明がほしい",
          "score": {
            "stability": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "大きな理由がなければ柔軟に合わせる",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q12_A",
      "person": "A",
      "prompt": "記念日や節目については？",
      "options": [
        {
          "label": "A",
          "text": "大切にすると関係が深まると思う",
          "score": {
            "expression": 1,
            "stability": 2
          }
        },
        {
          "label": "B",
          "text": "自然で無理がなければ十分だと思う",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q13_A",
      "person": "A",
      "prompt": "恋人に頼ることについては？",
      "options": [
        {
          "label": "A",
          "text": "困ったときはちゃんと頼り合いたい",
          "score": {
            "care": 2,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "まず自分で整えてから相談したい",
          "score": {
            "autonomy": 2,
            "care": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q14_A",
      "person": "A",
      "prompt": "相手の交友関係については？",
      "options": [
        {
          "label": "A",
          "text": "ある程度知っていると安心する",
          "score": {
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "信頼して、それぞれ自由でいたい",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q15_A",
      "person": "A",
      "prompt": "話し合いで大事だと思うのは？",
      "options": [
        {
          "label": "A",
          "text": "曖昧にせず、言葉で確認すること",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "責めずに空気を悪くしすぎないこと",
          "score": {
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q16_A",
      "person": "A",
      "prompt": "恋愛の楽しさはどこにある？",
      "options": [
        {
          "label": "A",
          "text": "日常の中で安心が増えること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "新しい自分や世界が広がること",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q17_A",
      "person": "A",
      "prompt": "相手にしてもらうと嬉しいのは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちを言葉で伝えてくれる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "具体的に助けたり動いてくれる",
          "score": {
            "care": 1,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q18_A",
      "person": "A",
      "prompt": "忙しい時期の関係で近いのは？",
      "options": [
        {
          "label": "A",
          "text": "短くても連絡を保ちたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "忙しい時期はお互い集中したい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q19_A",
      "person": "A",
      "prompt": "将来の話をするタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "ある程度早めに方向感を知りたい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "関係が育ってから自然に話したい",
          "score": {
            "pace": -1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q20_A",
      "person": "A",
      "prompt": "相手と意見が違うときは？",
      "options": [
        {
          "label": "A",
          "text": "違いを整理して着地点を探したい",
          "score": {
            "conflict": 2,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "無理に結論を急がず、少し置きたい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q21_A",
      "person": "A",
      "prompt": "恋愛で苦手なのは？",
      "options": [
        {
          "label": "A",
          "text": "距離が読めず不安になること",
          "score": {
            "pace": 1,
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "期待されすぎて自由が減ること",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q22_A",
      "person": "A",
      "prompt": "一緒にいる時間で重視するのは？",
      "options": [
        {
          "label": "A",
          "text": "深く話せること",
          "score": {
            "care": 1,
            "expression": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "気楽に笑えること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q23_A",
      "person": "A",
      "prompt": "相手への小さな不満は？",
      "options": [
        {
          "label": "A",
          "text": "溜めずに少しずつ伝える",
          "score": {
            "conflict": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "自分で消化できるものは流す",
          "score": {
            "autonomy": 1,
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q24_A",
      "person": "A",
      "prompt": "旅行や遠出の計画は？",
      "options": [
        {
          "label": "A",
          "text": "細かく決めると楽しめる",
          "score": {
            "stability": 1,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "余白があるほうが楽しい",
          "score": {
            "stimulation": 2,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q25_A",
      "person": "A",
      "prompt": "恋人に期待する距離感は？",
      "options": [
        {
          "label": "A",
          "text": "近くにいてくれる安心感",
          "score": {
            "pace": 1,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近すぎず信頼できる自由さ",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q26_A",
      "person": "A",
      "prompt": "感情が揺れたときは？",
      "options": [
        {
          "label": "A",
          "text": "その場で共有したくなる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "落ち着いてから伝えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q27_A",
      "person": "A",
      "prompt": "相手が新しい提案をしてきたら？",
      "options": [
        {
          "label": "A",
          "text": "面白そうなら乗ってみたい",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "無理がないか確認してから決めたい",
          "score": {
            "stability": 1,
            "decision": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q28_A",
      "person": "A",
      "prompt": "関係が長く続く鍵は？",
      "options": [
        {
          "label": "A",
          "text": "安心できる習慣を積み上げること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "変化を楽しみながら飽きさせないこと",
          "score": {
            "stimulation": 2,
            "expression": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q29_A",
      "person": "A",
      "prompt": "相手にわかってほしいことは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちは言葉にしないと伝わりにくい",
          "score": {
            "expression": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "言葉より空気や行動で伝わる部分もある",
          "score": {
            "care": 1,
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q30_A",
      "person": "A",
      "prompt": "理想の恋愛の温度感は？",
      "options": [
        {
          "label": "A",
          "text": "近くてあたたかい関係",
          "score": {
            "pace": 2,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近いけれど余白もある関係",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q01_B",
      "person": "B",
      "prompt": "連絡の頻度でいちばん落ち着くのは？",
      "options": [
        {
          "label": "A",
          "text": "毎日少しでもつながっていたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "必要なときに自然に話せればいい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q02_B",
      "person": "B",
      "prompt": "会う予定を決めるとき、近い感覚は？",
      "options": [
        {
          "label": "A",
          "text": "早めに決めて安心したい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "その時の流れで決めたい",
          "score": {
            "stimulation": 1,
            "autonomy": 1,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q03_B",
      "person": "B",
      "prompt": "好きな人への愛情表現は？",
      "options": [
        {
          "label": "A",
          "text": "言葉やメッセージでちゃんと伝えたい",
          "score": {
            "expression": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "行動や態度で伝わればいい",
          "score": {
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q04_B",
      "person": "B",
      "prompt": "相手が少し元気なさそうなときは？",
      "options": [
        {
          "label": "A",
          "text": "すぐ気づいて声をかけたい",
          "score": {
            "care": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "少し様子を見て、必要なら支えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q05_B",
      "person": "B",
      "prompt": "デートで心地いいのは？",
      "options": [
        {
          "label": "A",
          "text": "落ち着いた場所でゆっくり話す",
          "score": {
            "stability": 1,
            "care": 1,
            "stimulation": -1
          }
        },
        {
          "label": "B",
          "text": "新しい場所や体験を一緒に楽しむ",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q06_B",
      "person": "B",
      "prompt": "ひとり時間について近いのは？",
      "options": [
        {
          "label": "A",
          "text": "恋人がいてもかなり大事にしたい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        },
        {
          "label": "B",
          "text": "できれば一緒に過ごす時間を多めにしたい",
          "score": {
            "pace": 1,
            "care": 1,
            "autonomy": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q07_B",
      "person": "B",
      "prompt": "小さな違和感があるときは？",
      "options": [
        {
          "label": "A",
          "text": "早めに言葉にして整えたい",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "自分の中で整理してから話したい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q08_B",
      "person": "B",
      "prompt": "恋愛で安心するのは？",
      "options": [
        {
          "label": "A",
          "text": "約束や態度が安定していること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "楽しく自然体でいられること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q09_B",
      "person": "B",
      "prompt": "返信が遅い相手に対しては？",
      "options": [
        {
          "label": "A",
          "text": "少し不安になりやすい",
          "score": {
            "pace": 1,
            "care": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "理由があればあまり気にしない",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q10_B",
      "person": "B",
      "prompt": "相手との距離が近づくタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "早い段階で深く知りたい",
          "score": {
            "pace": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "時間をかけて自然に近づきたい",
          "score": {
            "stability": 1,
            "autonomy": 1,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q11_B",
      "person": "B",
      "prompt": "恋人との予定が急に変わったら？",
      "options": [
        {
          "label": "A",
          "text": "少し乱れるので説明がほしい",
          "score": {
            "stability": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "大きな理由がなければ柔軟に合わせる",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q12_B",
      "person": "B",
      "prompt": "記念日や節目については？",
      "options": [
        {
          "label": "A",
          "text": "大切にすると関係が深まると思う",
          "score": {
            "expression": 1,
            "stability": 2
          }
        },
        {
          "label": "B",
          "text": "自然で無理がなければ十分だと思う",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q13_B",
      "person": "B",
      "prompt": "恋人に頼ることについては？",
      "options": [
        {
          "label": "A",
          "text": "困ったときはちゃんと頼り合いたい",
          "score": {
            "care": 2,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "まず自分で整えてから相談したい",
          "score": {
            "autonomy": 2,
            "care": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q14_B",
      "person": "B",
      "prompt": "相手の交友関係については？",
      "options": [
        {
          "label": "A",
          "text": "ある程度知っていると安心する",
          "score": {
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "信頼して、それぞれ自由でいたい",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q15_B",
      "person": "B",
      "prompt": "話し合いで大事だと思うのは？",
      "options": [
        {
          "label": "A",
          "text": "曖昧にせず、言葉で確認すること",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "責めずに空気を悪くしすぎないこと",
          "score": {
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q16_B",
      "person": "B",
      "prompt": "恋愛の楽しさはどこにある？",
      "options": [
        {
          "label": "A",
          "text": "日常の中で安心が増えること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "新しい自分や世界が広がること",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q17_B",
      "person": "B",
      "prompt": "相手にしてもらうと嬉しいのは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちを言葉で伝えてくれる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "具体的に助けたり動いてくれる",
          "score": {
            "care": 1,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q18_B",
      "person": "B",
      "prompt": "忙しい時期の関係で近いのは？",
      "options": [
        {
          "label": "A",
          "text": "短くても連絡を保ちたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "忙しい時期はお互い集中したい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q19_B",
      "person": "B",
      "prompt": "将来の話をするタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "ある程度早めに方向感を知りたい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "関係が育ってから自然に話したい",
          "score": {
            "pace": -1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q20_B",
      "person": "B",
      "prompt": "相手と意見が違うときは？",
      "options": [
        {
          "label": "A",
          "text": "違いを整理して着地点を探したい",
          "score": {
            "conflict": 2,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "無理に結論を急がず、少し置きたい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q21_B",
      "person": "B",
      "prompt": "恋愛で苦手なのは？",
      "options": [
        {
          "label": "A",
          "text": "距離が読めず不安になること",
          "score": {
            "pace": 1,
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "期待されすぎて自由が減ること",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q22_B",
      "person": "B",
      "prompt": "一緒にいる時間で重視するのは？",
      "options": [
        {
          "label": "A",
          "text": "深く話せること",
          "score": {
            "care": 1,
            "expression": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "気楽に笑えること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q23_B",
      "person": "B",
      "prompt": "相手への小さな不満は？",
      "options": [
        {
          "label": "A",
          "text": "溜めずに少しずつ伝える",
          "score": {
            "conflict": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "自分で消化できるものは流す",
          "score": {
            "autonomy": 1,
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q24_B",
      "person": "B",
      "prompt": "旅行や遠出の計画は？",
      "options": [
        {
          "label": "A",
          "text": "細かく決めると楽しめる",
          "score": {
            "stability": 1,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "余白があるほうが楽しい",
          "score": {
            "stimulation": 2,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q25_B",
      "person": "B",
      "prompt": "恋人に期待する距離感は？",
      "options": [
        {
          "label": "A",
          "text": "近くにいてくれる安心感",
          "score": {
            "pace": 1,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近すぎず信頼できる自由さ",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q26_B",
      "person": "B",
      "prompt": "感情が揺れたときは？",
      "options": [
        {
          "label": "A",
          "text": "その場で共有したくなる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "落ち着いてから伝えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q27_B",
      "person": "B",
      "prompt": "相手が新しい提案をしてきたら？",
      "options": [
        {
          "label": "A",
          "text": "面白そうなら乗ってみたい",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "無理がないか確認してから決めたい",
          "score": {
            "stability": 1,
            "decision": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q28_B",
      "person": "B",
      "prompt": "関係が長く続く鍵は？",
      "options": [
        {
          "label": "A",
          "text": "安心できる習慣を積み上げること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "変化を楽しみながら飽きさせないこと",
          "score": {
            "stimulation": 2,
            "expression": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q29_B",
      "person": "B",
      "prompt": "相手にわかってほしいことは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちは言葉にしないと伝わりにくい",
          "score": {
            "expression": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "言葉より空気や行動で伝わる部分もある",
          "score": {
            "care": 1,
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q30_B",
      "person": "B",
      "prompt": "理想の恋愛の温度感は？",
      "options": [
        {
          "label": "A",
          "text": "近くてあたたかい関係",
          "score": {
            "pace": 2,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近いけれど余白もある関係",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    }
  ],
  "result_types": [
    {
      "id": "R01_RES_STABLE_HOME",
      "name": "安心を育てるふたり",
      "summary": "派手さよりも、日々の信頼を少しずつ積み上げる相性。",
      "dims": [
        "stability",
        "care"
      ],
      "bullets": [
        "約束や態度の安定が関係の土台になりやすい",
        "急な変化より、予測できるやさしさが効きやすい",
        "小さな確認を重ねるほど安心が深まる"
      ],
      "private": "ふたりの関係は、刺激よりも「ちゃんと戻れる場所」を作ることで強くなります。曖昧な不安を放置せず、生活リズムや連絡の温度を早めに合わせると、関係が静かに安定します。",
      "report": "安心の作り方、約束の扱い、すれ違い時の戻り方を中心に深掘り。"
    },
    {
      "id": "R01_RES_SPARK_PAIR",
      "name": "刺激でひらくふたり",
      "summary": "新しい体験や軽い遊び心が、距離を自然に縮める相性。",
      "dims": [
        "stimulation",
        "pace"
      ],
      "bullets": [
        "一緒に新しい場所へ行くと関係が動きやすい",
        "重い確認より、楽しい体験から本音が出やすい",
        "マンネリを避ける工夫が関係の栄養になる"
      ],
      "private": "ふたりは「楽しいから近づく」力が強い組み合わせです。ただし勢いだけで大事な確認を飛ばすと、あとで温度差が出やすい。遊び心の中に小さな約束を混ぜると安定します。",
      "report": "刺激・予定・自由度・安心確認のバランスを分析。"
    },
    {
      "id": "R01_RES_GENTLE_DISTANCE",
      "name": "余白を守るふたり",
      "summary": "近すぎない距離が、むしろ信頼を育てやすい相性。",
      "dims": [
        "autonomy",
        "stability"
      ],
      "bullets": [
        "それぞれの時間を尊重できるほど関係が続きやすい",
        "束縛より信頼のルールが効きやすい",
        "連絡や予定は少なめでも質が大事"
      ],
      "private": "ふたりに必要なのは、常に一緒にいることではなく、離れていても疑わなくてよい設計です。自由を放置に見せないために、最低限の共有ルールを持つと誤解が減ります。",
      "report": "自分時間、連絡頻度、自由と安心の線引きを整理。"
    },
    {
      "id": "R01_RES_DEEP_TALK",
      "name": "言葉で深まるふたり",
      "summary": "気持ちや違和感を言葉にするほど、関係が整いやすい相性。",
      "dims": [
        "expression",
        "conflict"
      ],
      "bullets": [
        "話し合いで距離が縮まりやすい",
        "小さな違和感を早めに言語化すると強い",
        "沈黙より確認が安心につながる"
      ],
      "private": "ふたりは、黙って察するよりも言葉で橋をかけるほうが合っています。ただし正しさの確認に寄りすぎると疲れやすい。話す時間と、ただ一緒にいる時間の両方が必要です。",
      "report": "言葉の温度、話し合いの順序、確認しすぎを防ぐ設計を深掘り。"
    },
    {
      "id": "R01_RES_CARE_MIRROR",
      "name": "気づき合うふたり",
      "summary": "相手の小さな変化に気づき、支え合うことで育つ相性。",
      "dims": [
        "care",
        "expression"
      ],
      "bullets": [
        "細かな気遣いが信頼に変わりやすい",
        "相手の調子を読む力が関係の強みになる",
        "支えすぎ・察しすぎには注意が必要"
      ],
      "private": "ふたりは、言葉にならない変化を拾う力があります。一方で、察する側が疲れたり、察してもらう前提になったりするとズレます。やさしさを言葉で確認する習慣が必要です。",
      "report": "気遣いの偏り、支え方、頼り方、疲れのサインを分析。"
    },
    {
      "id": "R01_RES_DECISION_TEAM",
      "name": "一緒に決めるふたり",
      "summary": "予定や選択を一緒に整理するほど、安心と納得が増える相性。",
      "dims": [
        "decision",
        "conflict"
      ],
      "bullets": [
        "結論までのプロセスを共有すると強い",
        "曖昧なまま進めるより、選択肢を並べるほうが合う",
        "決め方の癖を知ると衝突が減る"
      ],
      "private": "ふたりは、感情だけでなく「どう決めるか」を共有すると関係が安定します。どちらかが主導しすぎるより、選択肢・期限・譲れる点を見える化するのが有効です。",
      "report": "予定、将来感、お金、暮らしの決め方を中心に整理。"
    },
    {
      "id": "R01_RES_WARM_PACE",
      "name": "温度を合わせるふたり",
      "summary": "近づきたい気持ちと安心確認のバランスが鍵になる相性。",
      "dims": [
        "pace",
        "expression"
      ],
      "bullets": [
        "連絡や会う頻度の温度合わせが重要",
        "好意を隠しすぎないほど安心しやすい",
        "急ぎすぎると片方が息切れする可能性"
      ],
      "private": "ふたりは好意の温度が見えるほど安心します。ただし、近づく速度がずれると不安や重さに変わりやすい。関係の初期ほど「どのくらいが心地いいか」を軽く確認するとよいです。",
      "report": "連絡頻度、愛情表現、初期の温度差、近づき方を深掘り。"
    },
    {
      "id": "R01_RES_BALANCE_BLEND",
      "name": "違いを活かすふたり",
      "summary": "似ている部分と違う部分を、対立ではなく役割に変えられる相性。",
      "dims": [
        "balanced"
      ],
      "bullets": [
        "完全一致より、補い合いで安定しやすい",
        "違いを早めに言葉にすると強みに変わる",
        "一方に合わせすぎない設計が大事"
      ],
      "private": "ふたりは、全てが同じだから合うというより、違いを扱えると強くなる組み合わせです。大事なのは勝ち負けにしないこと。役割分担と確認の仕方を決めるほど、関係の余白が整います。",
      "report": "相違点、補完関係、摩擦ポイント、関係ルールを整理。"
    }
  ],
  "assignment_rules": {
    "method": "score both participants separately, compute pair averaged dimension score and gap score, then select strongest matching result type",
    "primary_score": "highest pair_average among result trigger dimensions",
    "gap_penalty": "if trigger dimension gap is large, reduce confidence and prefer R01_RES_BALANCE_BLEND when multiple gaps are high",
    "tie_break_order": [
      "R01_RES_BALANCE_BLEND",
      "R01_RES_STABLE_HOME",
      "R01_RES_WARM_PACE",
      "R01_RES_DEEP_TALK",
      "R01_RES_CARE_MIRROR",
      "R01_RES_DECISION_TEAM",
      "R01_RES_GENTLE_DISTANCE",
      "R01_RES_SPARK_PAIR"
    ],
    "fallback_result": "R01_RES_BALANCE_BLEND",
    "confidence_labels": [
      "low",
      "medium",
      "high"
    ]
  },
  "trust_boundaries": [
    "This is not fortune-telling or destiny prediction.",
    "This does not decide whether two people should date, marry, break up, or reunite.",
    "This does not expose one participant private answers as blame material.",
    "This is a reflective compatibility check for communication rhythm and relationship distance."
  ]
}
```

---

## 14. Integrity Expectations

Codex must verify after import:

- `test_id` = `R01`
- `R01_Q` question IDs = `60`
- current-state question-ID contamination count = `0`
- result type count = `8`
- route `/tests/r01` active and no longer blocked
- no backend/auth/payment/database/LINE/env/deployment/lockfile changes

---

## 15. Status

This file is complete as a Markdown source asset but remains:

```yaml
codex_ready: false
review_status: review_required
launch_status: not_approved
```

Founder / trust-risk / UIUX review is required before treating the public route as launch-ready.
