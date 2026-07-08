---

file_id: C02_ima_no_watashi_check_v1_0
test_id: C02
test_name_jp: 今のわたしチェック
test_name_cn: 现在的我状态检查
version: v1.0
status: draft_test_spec
layer: Yorisou Core
codex_ready: false
founder_review_needed: true
trust_risk_review_needed: true
created_for: Yorisou Test Product System
----------------------------------------

# C02 今のわたしチェック v1.0

## 0. File Status

This file is a review-ready Markdown specification for Founder review, trust-risk review, and later possible Codex handoff package creation.

This is not a Codex instruction.
This is not a site integration file.
This is not a backend, auth, payment, database, or LINE webhook implementation request.
This test is not live.

## 1. Test Product Summary

| field                    | value                                               |
| ------------------------ | --------------------------------------------------- |
| test_id                  | C02                                                 |
| test_name_jp             | 今のわたしチェック                                           |
| test_name_cn             | 现在的我状态检查                                            |
| version                  | v1.0                                                |
| layer                    | Yorisou Core                                        |
| commercial_role          | Core anchor、120問ライフステート診断導流、状態タグ沉淀、R01/F01/S01 推荐分流 |
| target_user              | 最近の自分の状態がよく分からない、動きたいけど動けない、人との距離や次の一歩を整理したい用户      |
| expected_completion_time | 约 7–10 分钟                                           |
| question_count           | 36                                                  |
| section_count            | 4                                                   |
| questions_per_section    | 9                                                   |
| output_status            | draft_test_spec                                     |
| codex_ready              | false                                               |

### Business Questions Answered

1. 用户为什么会点？
   因为“今のわたし”比“性格”更贴近日常状态，低压力但有自我理解钩子。

2. 用户为什么会做完？
   36 题比轻娱乐更有可信度，但不会像 120 题一样重。

3. 用户为什么会相信？
   它读取当前状态、距离感、行动方式、恢复方式，不做人格定论。

4. 用户为什么会分享？
   结果可分享“今の状態タイプ + 一句安全描述”，不暴露脆弱点。

5. 用户为什么会回来？
   当前状态会变化，适合每 2–4 周复测，也适合 LINE 回访。

6. 能卖什么报告？
   「今のわたし深掘りレポート」「Life-State 入門レポート」「月の状態ふりかえり」。

7. 能推荐什么？
   120 問 Life-State 主测试、R01 恋爱相性、F01 工作方式、S01 今日おみくじ、恢复/选择/生活节奏模块。

8. 能留下什么 Recommendation Graph / Demand Signal？
   内侧温度、人际距离、安全感需求、行动能量、迷い方、恢复需求、下一步准备度。

9. 如何导流到 Yorisou Core？
   免费结果页明确说明：C02 是“今の状態の入口”，若想看更深的 Life-State，进入 120 問主测试。

10. 如何避免变成测试超市？
    结果页只出现 2 个主 CTA：120 問主测试 + 与当前状态最相关的一个模块推荐。

## 2. Landing Page Copy

### Landing Headline

今のわたしは、どんな状態にいる？

### Landing Subheadline

元気がないわけではない。
でも、少し立ち止まりたい。
36問で、今の内側の温度、人との距離、動き出し方、次の一歩を整理します。

### Trust Note

これは性格を決めつける診断ではありません。
今のあなたの状態を、やさしく見える形にするためのチェックです。

### Time / Question Count Note

全36問・約7〜10分。
4つのセクションで、今の自分の状態を見ていきます。

### Primary CTA

今のわたしをチェックする

### Secondary CTA

120問の深い診断を見る

### Privacy / Boundary Short Note

回答は今の状態傾向を整理するために使われます。
このチェックは医療・心理診断ではありません。

## 3. Consent / Privacy / Boundary Notes

* This test does not diagnose mental health, personality disorder, depression, anxiety, trauma, burnout, or any clinical condition.
* This test does not tell the user what life decision to make.
* This test does not predict future success, relationship outcome, work outcome, or recovery outcome.
* It uses “今の状態,” “傾向,” “見え方,” and “参考” language.
* Share cards must not expose emotional vulnerability, stress level, relationship insecurity, loneliness, or private answers.
* LINE/Web save and reminders require separate opt-in.
* Recommendations must be framed as “next self-understanding step,” not therapy, coaching, or expert intervention.

## 4. Section Structure

### Section A：今の内側の温度

Focus: inner energy, emotional temperature, clarity, heaviness/lightness.

section_break_copy_jp:
ここまでで、今の内側の温度が少し見えてきました。次は、人との距離と安心感を見ていきます。

section_break_copy_cn:
到这里，你现在内在的温度已经开始显现。接下来会看你和他人的距离与安心感。

UX purpose:
Let users feel seen without making the test diagnostic.

### Section B：人との距離と安心感

Focus: interpersonal distance, connection needs, reassurance, boundaries.

section_break_copy_jp:
人との距離の取り方が見えてきました。次は、動き出し方と迷い方を見ていきます。

section_break_copy_cn:
你和他人的距离方式已经开始显现。接下来会看你如何行动、如何犹豫。

UX purpose:
Bridge from inner state to external interaction.

### Section C：動き出し方と迷い方

Focus: action energy, decision rhythm, hesitation, direction.

section_break_copy_jp:
今のあなたが動き出しやすい条件が見えてきました。最後に、回復と次の一歩を見ていきます。

section_break_copy_cn:
你现在更容易行动的条件已经开始显现。最后会看恢复方式和下一步。

UX purpose:
Help users see inertia without shame.

### Section D：回復・選択・次の一歩

Focus: recovery needs, small choices, next-step readiness, return path.

section_break_copy_jp:
回答ありがとうございます。結果では、今のあなたの状態タイプと、次に見るとよい診断を整理します。

section_break_copy_cn:
感谢回答。结果会整理你现在的状态类型，以及下一步适合看的测试。

UX purpose:
Prepare result reveal and recommendation.

## 5. Human-Readable Question Set

### Section A：今の内側の温度

### C02_Q01

* section: A
* question_type: scale
* prompt_jp: 最近、自分の気持ちの温度が少し分かりにくい。
* prompt_cn: 最近，我有点不太清楚自己内心的温度。
* primary_dimension: inner_temperature
* secondary_dimension: emotional_clarity
* sensitivity_level: medium
* public_private_note: aggregate only; do not expose in share card
* risk_note: Could imply emotional confusion; keep non-clinical.
* interpretation_boundary: Interpret as current self-awareness state, not mental health diagnosis.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | inner_temperature, emotional_clarity | { inner_temperature: 5, emotional_clarity: 1 } |
| B   | やや近い      | 比较符合     | inner_temperature, emotional_clarity | { inner_temperature: 4, emotional_clarity: 2 } |
| C   | どちらともいえない | 说不清      | inner_temperature                    | { inner_temperature: 3, emotional_clarity: 3 } |
| D   | あまり近くない   | 不太符合     | emotional_clarity                    | { inner_temperature: 2, emotional_clarity: 4 } |
| E   | まったく近くない  | 完全不符合    | emotional_clarity                    | { inner_temperature: 1, emotional_clarity: 5 } |

### C02_Q02

* section: A
* question_type: scale
* prompt_jp: 何かを頑張る前に、まず少し整える時間がほしい。
* prompt_cn: 在努力做什么之前，我想先有一点整理自己的时间。
* primary_dimension: recovery_need
* secondary_dimension: action_energy
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; preparation and recovery preference only.
* interpretation_boundary: Interpret as pacing need, not inability to act.

#### Options

| key | label_jp  | label_cn | score_tags                   | weights                                |
| --- | --------- | -------- | ---------------------------- | -------------------------------------- |
| A   | とても近い     | 非常符合     | recovery_need, action_energy | { recovery_need: 5, action_energy: 1 } |
| B   | やや近い      | 比较符合     | recovery_need, action_energy | { recovery_need: 4, action_energy: 2 } |
| C   | どちらともいえない | 说不清      | recovery_need                | { recovery_need: 3, action_energy: 3 } |
| D   | あまり近くない   | 不太符合     | action_energy                | { recovery_need: 2, action_energy: 4 } |
| E   | まったく近くない  | 完全不符合    | action_energy                | { recovery_need: 1, action_energy: 5 } |

### C02_Q03

* section: A
* question_type: scale
* prompt_jp: 今は、外に向かう力よりも内側を見たい気持ちが強い。
* prompt_cn: 现在，比起向外行动，我更想看看自己的内在。
* primary_dimension: reflection_need
* secondary_dimension: action_energy
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; reflective orientation only.
* interpretation_boundary: Interpret as current attention direction, not social withdrawal.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                  |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------- |
| A   | とても近い     | 非常符合     | reflection_need, action_energy | { reflection_need: 5, action_energy: 1 } |
| B   | やや近い      | 比较符合     | reflection_need, action_energy | { reflection_need: 4, action_energy: 2 } |
| C   | どちらともいえない | 说不清      | reflection_need                | { reflection_need: 3, action_energy: 3 } |
| D   | あまり近くない   | 不太符合     | action_energy                  | { reflection_need: 2, action_energy: 4 } |
| E   | まったく近くない  | 完全不符合    | action_energy                  | { reflection_need: 1, action_energy: 5 } |

### C02_Q04

* section: A
* question_type: scale
* prompt_jp: 小さなことにも、少し反応しやすくなっている。
* prompt_cn: 我最近对一些小事也更容易有反应。
* primary_dimension: emotional_sensitivity
* secondary_dimension: recovery_need
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Could touch sensitivity; avoid clinical interpretation.
* interpretation_boundary: Interpret as current sensitivity, not symptom or disorder.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                              |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------------- |
| A   | とても近い     | 非常符合     | emotional_sensitivity, recovery_need | { emotional_sensitivity: 5, recovery_need: 4 }       |
| B   | やや近い      | 比较符合     | emotional_sensitivity, recovery_need | { emotional_sensitivity: 4, recovery_need: 3 }       |
| C   | どちらともいえない | 说不清      | emotional_sensitivity                | { emotional_sensitivity: 3 }                         |
| D   | あまり近くない   | 不太符合     | emotional_stability                  | { emotional_sensitivity: 2, emotional_stability: 4 } |
| E   | まったく近くない  | 完全不符合    | emotional_stability                  | { emotional_sensitivity: 1, emotional_stability: 5 } |

### C02_Q05

* section: A
* question_type: scale
* prompt_jp: 今の自分に必要なものを、言葉にするのが少し難しい。
* prompt_cn: 我现在有点难把自己需要什么说清楚。
* primary_dimension: emotional_clarity
* secondary_dimension: core_need_signal
* sensitivity_level: medium
* public_private_note: aggregate only; not share-card visible
* risk_note: Could imply confusion; avoid deficit framing.
* interpretation_boundary: Interpret as language clarity, not competence.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | emotional_clarity, core_need_signal | { emotional_clarity: 1, core_need_signal: 5 } |
| B   | やや近い      | 比较符合     | emotional_clarity, core_need_signal | { emotional_clarity: 2, core_need_signal: 4 } |
| C   | どちらともいえない | 说不清      | core_need_signal                    | { emotional_clarity: 3, core_need_signal: 3 } |
| D   | あまり近くない   | 不太符合     | emotional_clarity                   | { emotional_clarity: 4, core_need_signal: 2 } |
| E   | まったく近くない  | 完全不符合    | emotional_clarity                   | { emotional_clarity: 5, core_need_signal: 1 } |

### C02_Q06

* section: A
* question_type: scale
* prompt_jp: 最近の私は、少し急かされるとペースが乱れやすい。
* prompt_cn: 最近的我，如果被催促，节奏容易被打乱。
* primary_dimension: pace_sensitivity
* secondary_dimension: recovery_need
* sensitivity_level: medium
* public_private_note: aggregate only
* risk_note: Could touch stress response; keep non-clinical.
* interpretation_boundary: Interpret as pace sensitivity, not stress disorder.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                   |
| --- | --------- | -------- | ------------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | pace_sensitivity, recovery_need | { pace_sensitivity: 5, recovery_need: 4 } |
| B   | やや近い      | 比较符合     | pace_sensitivity, recovery_need | { pace_sensitivity: 4, recovery_need: 3 } |
| C   | どちらともいえない | 说不清      | pace_sensitivity                | { pace_sensitivity: 3 }                   |
| D   | あまり近くない   | 不太符合     | action_energy                   | { pace_sensitivity: 2, action_energy: 4 } |
| E   | まったく近くない  | 完全不符合    | action_energy                   | { pace_sensitivity: 1, action_energy: 5 } |

### C02_Q07

* section: A
* question_type: scale
* prompt_jp: まだ形になっていないけれど、変わりたい感じがある。
* prompt_cn: 虽然还没成形，但我有一种想要改变的感觉。
* primary_dimension: change_readiness
* secondary_dimension: next_step_readiness
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; change intention only.
* interpretation_boundary: Interpret as readiness signal, not promise of change.

#### Options

| key | label_jp  | label_cn | score_tags                            | weights                                         |
| --- | --------- | -------- | ------------------------------------- | ----------------------------------------------- |
| A   | とても近い     | 非常符合     | change_readiness, next_step_readiness | { change_readiness: 5, next_step_readiness: 4 } |
| B   | やや近い      | 比较符合     | change_readiness, next_step_readiness | { change_readiness: 4, next_step_readiness: 3 } |
| C   | どちらともいえない | 说不清      | change_readiness                      | { change_readiness: 3 }                         |
| D   | あまり近くない   | 不太符合     | stability_need                        | { change_readiness: 2, stability_need: 4 }      |
| E   | まったく近くない  | 完全不符合    | stability_need                        | { change_readiness: 1, stability_need: 5 }      |

### C02_Q08

* section: A
* question_type: scale
* prompt_jp: 今は、大きな決断よりも小さな確認を重ねたい。
* prompt_cn: 现在，比起做大决定，我更想一点点确认。
* primary_dimension: decision_style
* secondary_dimension: reassurance_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; decision rhythm only.
* interpretation_boundary: Interpret as decision pacing, not inability to decide.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                    |
| --- | --------- | -------- | -------------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | decision_style, reassurance_need | { decision_style: 5, reassurance_need: 4 } |
| B   | やや近い      | 比较符合     | decision_style, reassurance_need | { decision_style: 4, reassurance_need: 3 } |
| C   | どちらともいえない | 说不清      | decision_style                   | { decision_style: 3 }                      |
| D   | あまり近くない   | 不太符合     | action_energy                    | { decision_style: 2, action_energy: 4 }    |
| E   | まったく近くない  | 完全不符合    | action_energy                    | { decision_style: 1, action_energy: 5 }    |

### C02_Q09

* section: A
* question_type: scale
* prompt_jp: 今の自分を、誰かに少し分かってほしい気持ちがある。
* prompt_cn: 我现在有一点希望有人理解我。
* primary_dimension: reassurance_need
* secondary_dimension: relationship_focus
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Could reveal vulnerability; never expose in share card.
* interpretation_boundary: Interpret as current reassurance need, not loneliness diagnosis.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | reassurance_need, relationship_focus | { reassurance_need: 5, relationship_focus: 4 } |
| B   | やや近い      | 比较符合     | reassurance_need, relationship_focus | { reassurance_need: 4, relationship_focus: 3 } |
| C   | どちらともいえない | 说不清      | reassurance_need                     | { reassurance_need: 3 }                        |
| D   | あまり近くない   | 不太符合     | autonomy_need                        | { reassurance_need: 2, autonomy_need: 4 }      |
| E   | まったく近くない  | 完全不符合    | autonomy_need                        | { reassurance_need: 1, autonomy_need: 5 }      |

### Section B：人との距離と安心感

### C02_Q10

* section: B
* question_type: scale
* prompt_jp: 人と一緒にいる時間があると、気持ちが戻りやすい。
* prompt_cn: 和人在一起时，我的状态更容易回来。
* primary_dimension: connection_need
* secondary_dimension: recovery_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; connection preference only.
* interpretation_boundary: Interpret as recovery preference, not dependence.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                  |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------- |
| A   | とても近い     | 非常符合     | connection_need, recovery_need | { connection_need: 5, recovery_need: 4 } |
| B   | やや近い      | 比较符合     | connection_need, recovery_need | { connection_need: 4, recovery_need: 3 } |
| C   | どちらともいえない | 说不清      | connection_need                | { connection_need: 3 }                   |
| D   | あまり近くない   | 不太符合     | autonomy_need                  | { connection_need: 2, autonomy_need: 4 } |
| E   | まったく近くない  | 完全不符合    | autonomy_need                  | { connection_need: 1, autonomy_need: 5 } |

### C02_Q11

* section: B
* question_type: scale
* prompt_jp: 今は、ひとりで静かに戻る時間も大切にしたい。
* prompt_cn: 现在，我也想重视一个人安静恢复的时间。
* primary_dimension: autonomy_need
* secondary_dimension: recovery_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; solitude preference only.
* interpretation_boundary: Interpret as recovery space, not isolation.

#### Options

| key | label_jp  | label_cn | score_tags                   | weights                                  |
| --- | --------- | -------- | ---------------------------- | ---------------------------------------- |
| A   | とても近い     | 非常符合     | autonomy_need, recovery_need | { autonomy_need: 5, recovery_need: 4 }   |
| B   | やや近い      | 比较符合     | autonomy_need, recovery_need | { autonomy_need: 4, recovery_need: 3 }   |
| C   | どちらともいえない | 说不清      | autonomy_need                | { autonomy_need: 3 }                     |
| D   | あまり近くない   | 不太符合     | connection_need              | { autonomy_need: 2, connection_need: 4 } |
| E   | まったく近くない  | 完全不符合    | connection_need              | { autonomy_need: 1, connection_need: 5 } |

### C02_Q12

* section: B
* question_type: scale
* prompt_jp: 連絡の間が空くと、少し気持ちが揺れやすい。
* prompt_cn: 如果联系中断一段时间，我的心情容易有点摇晃。
* primary_dimension: reassurance_need
* secondary_dimension: relationship_focus
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Relationship reassurance sensitivity; avoid blaming others.
* interpretation_boundary: Interpret as reassurance rhythm, not relationship judgment.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | reassurance_need, relationship_focus | { reassurance_need: 5, relationship_focus: 4 } |
| B   | やや近い      | 比较符合     | reassurance_need, relationship_focus | { reassurance_need: 4, relationship_focus: 3 } |
| C   | どちらともいえない | 说不清      | reassurance_need                     | { reassurance_need: 3 }                        |
| D   | あまり近くない   | 不太符合     | autonomy_need                        | { reassurance_need: 2, autonomy_need: 4 }      |
| E   | まったく近くない  | 完全不符合    | autonomy_need                        | { reassurance_need: 1, autonomy_need: 5 }      |

### C02_Q13

* section: B
* question_type: scale
* prompt_jp: 人に合わせすぎて、自分の本音が後回しになることがある。
* prompt_cn: 我有时会太配合别人，把自己的真实想法放到后面。
* primary_dimension: boundary_need
* secondary_dimension: emotional_clarity
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Could expose boundary vulnerability; no share-card use.
* interpretation_boundary: Interpret as boundary tendency, not weakness or blame.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                    |
| --- | --------- | -------- | -------------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | boundary_need, emotional_clarity | { boundary_need: 5, emotional_clarity: 2 } |
| B   | やや近い      | 比较符合     | boundary_need, emotional_clarity | { boundary_need: 4, emotional_clarity: 3 } |
| C   | どちらともいえない | 说不清      | boundary_need                    | { boundary_need: 3 }                       |
| D   | あまり近くない   | 不太符合     | autonomy_need                    | { boundary_need: 2, autonomy_need: 4 }     |
| E   | まったく近くない  | 完全不符合    | autonomy_need                    | { boundary_need: 1, autonomy_need: 5 }     |

### C02_Q14

* section: B
* question_type: scale
* prompt_jp: 今は、深い話よりも軽くそばにいてくれる感じがちょうどいい。
* prompt_cn: 现在，比起很深的对话，轻轻陪在身边的感觉更刚好。
* primary_dimension: light_support_need
* secondary_dimension: connection_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; support style only.
* interpretation_boundary: Interpret as preferred support style, not emotional avoidance.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | light_support_need, connection_need | { light_support_need: 5, connection_need: 4 } |
| B   | やや近い      | 比较符合     | light_support_need, connection_need | { light_support_need: 4, connection_need: 3 } |
| C   | どちらともいえない | 说不清      | light_support_need                  | { light_support_need: 3 }                     |
| D   | あまり近くない   | 不太符合     | reflection_need                     | { light_support_need: 2, reflection_need: 4 } |
| E   | まったく近くない  | 完全不符合    | reflection_need                     | { light_support_need: 1, reflection_need: 5 } |

### C02_Q15

* section: B
* question_type: scale
* prompt_jp: 誰かに相談する前に、自分の中で少し整理したい。
* prompt_cn: 在找人商量之前，我想先自己整理一下。
* primary_dimension: reflection_need
* secondary_dimension: autonomy_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; reflection preference only.
* interpretation_boundary: Interpret as processing style, not refusal to connect.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                    |
| --- | --------- | -------- | ------------------------------ | ------------------------------------------ |
| A   | とても近い     | 非常符合     | reflection_need, autonomy_need | { reflection_need: 5, autonomy_need: 4 }   |
| B   | やや近い      | 比较符合     | reflection_need, autonomy_need | { reflection_need: 4, autonomy_need: 3 }   |
| C   | どちらともいえない | 说不清      | reflection_need                | { reflection_need: 3 }                     |
| D   | あまり近くない   | 不太符合     | connection_need                | { reflection_need: 2, connection_need: 4 } |
| E   | まったく近くない  | 完全不符合    | connection_need                | { reflection_need: 1, connection_need: 5 } |

### C02_Q16

* section: B
* question_type: scale
* prompt_jp: 今の自分には、はっきりした助言よりも受け止めてもらう時間が必要だ。
* prompt_cn: 对现在的我来说，比起明确建议，更需要被接住的时间。
* primary_dimension: reassurance_need
* secondary_dimension: light_support_need
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Support need; avoid therapeutic framing.
* interpretation_boundary: Interpret as support preference, not therapy need.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | reassurance_need, light_support_need | { reassurance_need: 5, light_support_need: 5 } |
| B   | やや近い      | 比较符合     | reassurance_need, light_support_need | { reassurance_need: 4, light_support_need: 4 } |
| C   | どちらともいえない | 说不清      | reassurance_need                     | { reassurance_need: 3 }                        |
| D   | あまり近くない   | 不太符合     | action_energy                        | { reassurance_need: 2, action_energy: 4 }      |
| E   | まったく近くない  | 完全不符合    | action_energy                        | { reassurance_need: 1, action_energy: 5 }      |

### C02_Q17

* section: B
* question_type: scale
* prompt_jp: 人との関係で、少し距離を測り直したい相手がいる。
* prompt_cn: 在人际关系里，我有想重新衡量距离的人。
* primary_dimension: boundary_need
* secondary_dimension: relationship_focus
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Relationship boundary signal; avoid relationship judgment.
* interpretation_boundary: Interpret as distance recalibration, not advice to cut ties.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | boundary_need, relationship_focus | { boundary_need: 5, relationship_focus: 4 } |
| B   | やや近い      | 比较符合     | boundary_need, relationship_focus | { boundary_need: 4, relationship_focus: 3 } |
| C   | どちらともいえない | 说不清      | boundary_need                     | { boundary_need: 3 }                        |
| D   | あまり近くない   | 不太符合     | connection_need                   | { boundary_need: 2, connection_need: 4 }    |
| E   | まったく近くない  | 完全不符合    | connection_need                   | { boundary_need: 1, connection_need: 5 }    |

### C02_Q18

* section: B
* question_type: scale
* prompt_jp: 今は、人との関係よりも自分の足元を整えたい。
* prompt_cn: 现在，比起人际关系，我更想整理好自己的脚下。
* primary_dimension: core_need_signal
* secondary_dimension: autonomy_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; focus direction only.
* interpretation_boundary: Interpret as current priority, not rejection of relationships.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                        |
| --- | --------- | -------- | ------------------------------- | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | core_need_signal, autonomy_need | { core_need_signal: 5, autonomy_need: 4 }      |
| B   | やや近い      | 比较符合     | core_need_signal, autonomy_need | { core_need_signal: 4, autonomy_need: 3 }      |
| C   | どちらともいえない | 说不清      | core_need_signal                | { core_need_signal: 3 }                        |
| D   | あまり近くない   | 不太符合     | relationship_focus              | { core_need_signal: 2, relationship_focus: 4 } |
| E   | まったく近くない  | 完全不符合    | relationship_focus              | { core_need_signal: 1, relationship_focus: 5 } |

### Section C：動き出し方と迷い方

### C02_Q19

* section: C
* question_type: scale
* prompt_jp: やりたいことはあるのに、最初の一歩が重く感じる。
* prompt_cn: 明明有想做的事，但第一步感觉很重。
* primary_dimension: action_energy
* secondary_dimension: decision_style
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Could imply low energy; not clinical.
* interpretation_boundary: Interpret as action-start state, not inability or disorder.

#### Options

| key | label_jp  | label_cn | score_tags                    | weights                                 |
| --- | --------- | -------- | ----------------------------- | --------------------------------------- |
| A   | とても近い     | 非常符合     | action_energy, decision_style | { action_energy: 1, decision_style: 5 } |
| B   | やや近い      | 比较符合     | action_energy, decision_style | { action_energy: 2, decision_style: 4 } |
| C   | どちらともいえない | 说不清      | action_energy                 | { action_energy: 3, decision_style: 3 } |
| D   | あまり近くない   | 不太符合     | action_energy                 | { action_energy: 4, decision_style: 2 } |
| E   | まったく近くない  | 完全不符合    | action_energy                 | { action_energy: 5, decision_style: 1 } |

### C02_Q20

* section: C
* question_type: scale
* prompt_jp: 今は、考えるより先に少し動いてみたい気持ちがある。
* prompt_cn: 现在，我有一点想先动起来而不是继续思考。
* primary_dimension: action_energy
* secondary_dimension: next_step_readiness
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; action readiness only.
* interpretation_boundary: Interpret as readiness, not instruction to act.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | action_energy, next_step_readiness | { action_energy: 5, next_step_readiness: 5 } |
| B   | やや近い      | 比较符合     | action_energy, next_step_readiness | { action_energy: 4, next_step_readiness: 4 } |
| C   | どちらともいえない | 说不清      | action_energy                      | { action_energy: 3 }                         |
| D   | あまり近くない   | 不太符合     | reflection_need                    | { action_energy: 2, reflection_need: 4 }     |
| E   | まったく近くない  | 完全不符合    | reflection_need                    | { action_energy: 1, reflection_need: 5 }     |

### C02_Q21

* section: C
* question_type: scale
* prompt_jp: 選択肢が多いと、どれが自分に合うのか分からなくなりやすい。
* prompt_cn: 选择太多时，我容易不知道哪个适合自己。
* primary_dimension: decision_style
* secondary_dimension: emotional_clarity
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; decision style only.
* interpretation_boundary: Interpret as choice processing, not decisiveness judgment.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | decision_style, emotional_clarity | { decision_style: 5, emotional_clarity: 2 } |
| B   | やや近い      | 比较符合     | decision_style, emotional_clarity | { decision_style: 4, emotional_clarity: 3 } |
| C   | どちらともいえない | 说不清      | decision_style                    | { decision_style: 3 }                       |
| D   | あまり近くない   | 不太符合     | emotional_clarity                 | { decision_style: 2, emotional_clarity: 4 } |
| E   | まったく近くない  | 完全不符合    | emotional_clarity                 | { decision_style: 1, emotional_clarity: 5 } |

### C02_Q22

* section: C
* question_type: scale
* prompt_jp: 小さく試せる形があると、動き出しやすい。
* prompt_cn: 如果能以小规模尝试的方式开始，我更容易行动。
* primary_dimension: next_step_readiness
* secondary_dimension: action_energy
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; trial preference only.
* interpretation_boundary: Interpret as action design, not advice or instruction.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                        |
| --- | --------- | -------- | ---------------------------------- | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | next_step_readiness, action_energy | { next_step_readiness: 5, action_energy: 4 }   |
| B   | やや近い      | 比较符合     | next_step_readiness, action_energy | { next_step_readiness: 4, action_energy: 3 }   |
| C   | どちらともいえない | 说不清      | next_step_readiness                | { next_step_readiness: 3 }                     |
| D   | あまり近くない   | 不太符合     | reflection_need                    | { next_step_readiness: 2, reflection_need: 4 } |
| E   | まったく近くない  | 完全不符合    | reflection_need                    | { next_step_readiness: 1, reflection_need: 5 } |

### C02_Q23

* section: C
* question_type: scale
* prompt_jp: 今の迷いは、情報不足というより自分の気持ちの確認に近い。
* prompt_cn: 我现在的犹豫，比起信息不足，更像是在确认自己的心情。
* primary_dimension: emotional_clarity
* secondary_dimension: reflection_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; reflection signal only.
* interpretation_boundary: Interpret as inner confirmation need, not indecision flaw.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | emotional_clarity, reflection_need | { emotional_clarity: 2, reflection_need: 5 } |
| B   | やや近い      | 比较符合     | emotional_clarity, reflection_need | { emotional_clarity: 3, reflection_need: 4 } |
| C   | どちらともいえない | 说不清      | reflection_need                    | { emotional_clarity: 3, reflection_need: 3 } |
| D   | あまり近くない   | 不太符合     | action_energy                      | { emotional_clarity: 4, action_energy: 4 }   |
| E   | まったく近くない  | 完全不符合    | action_energy                      | { emotional_clarity: 5, action_energy: 5 }   |

### C02_Q24

* section: C
* question_type: scale
* prompt_jp: 誰かに背中を押されると、今なら少し動けそうだ。
* prompt_cn: 如果有人轻轻推我一下，现在我也许能动起来。
* primary_dimension: reassurance_need
* secondary_dimension: next_step_readiness
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; encouragement preference only.
* interpretation_boundary: Interpret as support for action, not dependence.

#### Options

| key | label_jp  | label_cn | score_tags                            | weights                                         |
| --- | --------- | -------- | ------------------------------------- | ----------------------------------------------- |
| A   | とても近い     | 非常符合     | reassurance_need, next_step_readiness | { reassurance_need: 5, next_step_readiness: 4 } |
| B   | やや近い      | 比较符合     | reassurance_need, next_step_readiness | { reassurance_need: 4, next_step_readiness: 3 } |
| C   | どちらともいえない | 说不清      | reassurance_need                      | { reassurance_need: 3 }                         |
| D   | あまり近くない   | 不太符合     | autonomy_need                         | { reassurance_need: 2, autonomy_need: 4 }       |
| E   | まったく近くない  | 完全不符合    | autonomy_need                         | { reassurance_need: 1, autonomy_need: 5 }       |

### C02_Q25

* section: C
* question_type: scale
* prompt_jp: 今は、正解を探すよりも違和感を減らしたい。
* prompt_cn: 现在，比起寻找正确答案，我更想减少违和感。
* primary_dimension: core_need_signal
* secondary_dimension: decision_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; decision comfort only.
* interpretation_boundary: Interpret as fit-seeking, not truth or certainty.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                    |
| --- | --------- | -------- | -------------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | core_need_signal, decision_style | { core_need_signal: 5, decision_style: 4 } |
| B   | やや近い      | 比较符合     | core_need_signal, decision_style | { core_need_signal: 4, decision_style: 3 } |
| C   | どちらともいえない | 说不清      | core_need_signal                 | { core_need_signal: 3 }                    |
| D   | あまり近くない   | 不太符合     | action_energy                    | { core_need_signal: 2, action_energy: 4 }  |
| E   | まったく近くない  | 完全不符合    | action_energy                    | { core_need_signal: 1, action_energy: 5 }  |

### C02_Q26

* section: C
* question_type: scale
* prompt_jp: 仕事や役割のことが、今の状態に影響している感じがある。
* prompt_cn: 我感觉工作或角色正在影响我现在的状态。
* primary_dimension: work_focus
* secondary_dimension: core_need_signal
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Work-state signal; no career advice.
* interpretation_boundary: Interpret as work relevance, not job diagnosis or resignation cue.

#### Options

| key | label_jp  | label_cn | score_tags                   | weights                                  |
| --- | --------- | -------- | ---------------------------- | ---------------------------------------- |
| A   | とても近い     | 非常符合     | work_focus, core_need_signal | { work_focus: 5, core_need_signal: 4 }   |
| B   | やや近い      | 比较符合     | work_focus, core_need_signal | { work_focus: 4, core_need_signal: 3 }   |
| C   | どちらともいえない | 说不清      | work_focus                   | { work_focus: 3 }                        |
| D   | あまり近くない   | 不太符合     | relationship_focus           | { work_focus: 2, relationship_focus: 3 } |
| E   | まったく近くない  | 完全不符合    | relationship_focus           | { work_focus: 1, relationship_focus: 4 } |

### C02_Q27

* section: C
* question_type: scale
* prompt_jp: 恋愛や大切な人との関係が、今の状態に影響している感じがある。
* prompt_cn: 我感觉恋爱或重要关系正在影响我现在的状态。
* primary_dimension: relationship_focus
* secondary_dimension: core_need_signal
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Relationship-state signal; no compatibility judgment.
* interpretation_boundary: Interpret as relationship relevance, not relationship outcome prediction.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | relationship_focus, core_need_signal | { relationship_focus: 5, core_need_signal: 4 } |
| B   | やや近い      | 比较符合     | relationship_focus, core_need_signal | { relationship_focus: 4, core_need_signal: 3 } |
| C   | どちらともいえない | 说不清      | relationship_focus                   | { relationship_focus: 3 }                      |
| D   | あまり近くない   | 不太符合     | work_focus                           | { relationship_focus: 2, work_focus: 3 }       |
| E   | まったく近くない  | 完全不符合    | work_focus                           | { relationship_focus: 1, work_focus: 4 }       |

### Section D：回復・選択・次の一歩

### C02_Q28

* section: D
* question_type: scale
* prompt_jp: 今の自分には、まず休むよりも方向を決めることが必要に感じる。
* prompt_cn: 对现在的我来说，比起先休息，我感觉更需要确定方向。
* primary_dimension: next_step_readiness
* secondary_dimension: recovery_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; direction vs rest preference only.
* interpretation_boundary: Interpret as current felt need, not recommendation to ignore rest.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | next_step_readiness, recovery_need | { next_step_readiness: 5, recovery_need: 1 } |
| B   | やや近い      | 比较符合     | next_step_readiness, recovery_need | { next_step_readiness: 4, recovery_need: 2 } |
| C   | どちらともいえない | 说不清      | next_step_readiness                | { next_step_readiness: 3, recovery_need: 3 } |
| D   | あまり近くない   | 不太符合     | recovery_need                      | { next_step_readiness: 2, recovery_need: 4 } |
| E   | まったく近くない  | 完全不符合    | recovery_need                      | { next_step_readiness: 1, recovery_need: 5 } |

### C02_Q29

* section: D
* question_type: scale
* prompt_jp: 今の自分には、方向を決めるよりも回復する時間が必要に感じる。
* prompt_cn: 对现在的我来说，比起确定方向，我感觉更需要恢复时间。
* primary_dimension: recovery_need
* secondary_dimension: next_step_readiness
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Recovery signal; avoid health or treatment framing.
* interpretation_boundary: Interpret as recovery preference, not medical need.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | recovery_need, next_step_readiness | { recovery_need: 5, next_step_readiness: 1 } |
| B   | やや近い      | 比较符合     | recovery_need, next_step_readiness | { recovery_need: 4, next_step_readiness: 2 } |
| C   | どちらともいえない | 说不清      | recovery_need                      | { recovery_need: 3, next_step_readiness: 3 } |
| D   | あまり近くない   | 不太符合     | next_step_readiness                | { recovery_need: 2, next_step_readiness: 4 } |
| E   | まったく近くない  | 完全不符合    | next_step_readiness                | { recovery_need: 1, next_step_readiness: 5 } |

### C02_Q30

* section: D
* question_type: scale
* prompt_jp: 生活のリズムを少し整えると、気持ちも戻りやすそうだ。
* prompt_cn: 如果稍微整理生活节奏，我的心情也更容易回来。
* primary_dimension: rhythm_reset_need
* secondary_dimension: recovery_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; lifestyle rhythm signal only.
* interpretation_boundary: Interpret as rhythm support, not health advice.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                    |
| --- | --------- | -------- | -------------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | rhythm_reset_need, recovery_need | { rhythm_reset_need: 5, recovery_need: 4 } |
| B   | やや近い      | 比较符合     | rhythm_reset_need, recovery_need | { rhythm_reset_need: 4, recovery_need: 3 } |
| C   | どちらともいえない | 说不清      | rhythm_reset_need                | { rhythm_reset_need: 3 }                   |
| D   | あまり近くない   | 不太符合     | action_energy                    | { rhythm_reset_need: 2, action_energy: 4 } |
| E   | まったく近くない  | 完全不符合    | action_energy                    | { rhythm_reset_need: 1, action_energy: 5 } |

### C02_Q31

* section: D
* question_type: scale
* prompt_jp: 今の自分には、少し遊びや余白がある方が戻りやすい。
* prompt_cn: 对现在的我来说，有一点玩心和余白更容易恢复。
* primary_dimension: lightness_need
* secondary_dimension: recovery_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; lightness preference only.
* interpretation_boundary: Interpret as reflective entertainment fit, not avoidance.

#### Options

| key | label_jp  | label_cn | score_tags                    | weights                                   |
| --- | --------- | -------- | ----------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | lightness_need, recovery_need | { lightness_need: 5, recovery_need: 4 }   |
| B   | やや近い      | 比较符合     | lightness_need, recovery_need | { lightness_need: 4, recovery_need: 3 }   |
| C   | どちらともいえない | 说不清      | lightness_need                | { lightness_need: 3 }                     |
| D   | あまり近くない   | 不太符合     | reflection_need               | { lightness_need: 2, reflection_need: 4 } |
| E   | まったく近くない  | 完全不符合    | reflection_need               | { lightness_need: 1, reflection_need: 5 } |

### C02_Q32

* section: D
* question_type: scale
* prompt_jp: 今の状態をもう少し深く知るなら、時間をかけても見てみたい。
* prompt_cn: 如果能更深入理解现在的状态，我愿意花一点时间看。
* primary_dimension: core_depth_intent
* secondary_dimension: reflection_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; deep-test intent only.
* interpretation_boundary: Interpret as 120-question readiness, not paid pressure.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | core_depth_intent, reflection_need | { core_depth_intent: 5, reflection_need: 4 } |
| B   | やや近い      | 比较符合     | core_depth_intent, reflection_need | { core_depth_intent: 4, reflection_need: 3 } |
| C   | どちらともいえない | 说不清      | core_depth_intent                  | { core_depth_intent: 3 }                     |
| D   | あまり近くない   | 不太符合     | lightness_need                     | { core_depth_intent: 2, lightness_need: 4 }  |
| E   | まったく近くない  | 完全不符合    | lightness_need                     | { core_depth_intent: 1, lightness_need: 5 }  |

### C02_Q33

* section: D
* question_type: scale
* prompt_jp: 今は、深い診断よりも今日の小さなヒントがある方が合っている。
* prompt_cn: 现在，比起深度测试，我更适合看看今天的小提示。
* primary_dimension: lightness_need
* secondary_dimension: oracle_return_intent
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; oracle/asobi routing signal only.
* interpretation_boundary: Interpret as light return preference, not fortune belief.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | lightness_need, oracle_return_intent | { lightness_need: 5, oracle_return_intent: 5 } |
| B   | やや近い      | 比较符合     | lightness_need, oracle_return_intent | { lightness_need: 4, oracle_return_intent: 4 } |
| C   | どちらともいえない | 说不清      | lightness_need                       | { lightness_need: 3 }                          |
| D   | あまり近くない   | 不太符合     | core_depth_intent                    | { lightness_need: 2, core_depth_intent: 4 }    |
| E   | まったく近くない  | 完全不符合    | core_depth_intent                    | { lightness_need: 1, core_depth_intent: 5 }    |

### C02_Q34

* section: D
* question_type: scale
* prompt_jp: 自分の状態を、恋愛や人との相性からも見てみたい。
* prompt_cn: 我也想从恋爱或人与人的相性角度看看自己的状态。
* primary_dimension: relationship_focus
* secondary_dimension: recommendation_intent
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Relationship recommendation signal; no outcome prediction.
* interpretation_boundary: Interpret as interest routing to R01, not relationship advice.

#### Options

| key | label_jp  | label_cn | score_tags                                | weights                                             |
| --- | --------- | -------- | ----------------------------------------- | --------------------------------------------------- |
| A   | とても近い     | 非常符合     | relationship_focus, recommendation_intent | { relationship_focus: 5, recommendation_intent: 4 } |
| B   | やや近い      | 比较符合     | relationship_focus, recommendation_intent | { relationship_focus: 4, recommendation_intent: 3 } |
| C   | どちらともいえない | 说不清      | relationship_focus                        | { relationship_focus: 3 }                           |
| D   | あまり近くない   | 不太符合     | work_focus                                | { relationship_focus: 2, work_focus: 3 }            |
| E   | まったく近くない  | 完全不符合    | work_focus                                | { relationship_focus: 1, work_focus: 4 }            |

### C02_Q35

* section: D
* question_type: scale
* prompt_jp: 自分の状態を、働き方や役割の面からも見てみたい。
* prompt_cn: 我也想从工作方式或角色角度看看自己的状态。
* primary_dimension: work_focus
* secondary_dimension: recommendation_intent
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Work recommendation signal; no career advice.
* interpretation_boundary: Interpret as interest routing to F01, not career decision.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | work_focus, recommendation_intent | { work_focus: 5, recommendation_intent: 4 } |
| B   | やや近い      | 比较符合     | work_focus, recommendation_intent | { work_focus: 4, recommendation_intent: 3 } |
| C   | どちらともいえない | 说不清      | work_focus                        | { work_focus: 3 }                           |
| D   | あまり近くない   | 不太符合     | relationship_focus                | { work_focus: 2, relationship_focus: 3 }    |
| E   | まったく近くない  | 完全不符合    | relationship_focus                | { work_focus: 1, relationship_focus: 4 }    |

### C02_Q36

* section: D
* question_type: scale
* prompt_jp: 今の自分には、ひとつだけ小さな次の一歩があるとよさそうだ。
* prompt_cn: 对现在的我来说，如果有一个小小的下一步会很好。
* primary_dimension: next_step_readiness
* secondary_dimension: recommendation_intent
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; next-step preference only.
* interpretation_boundary: Interpret as gentle next-step readiness, not instruction or obligation.

#### Options

| key | label_jp  | label_cn | score_tags                                 | weights                                              |
| --- | --------- | -------- | ------------------------------------------ | ---------------------------------------------------- |
| A   | とても近い     | 非常符合     | next_step_readiness, recommendation_intent | { next_step_readiness: 5, recommendation_intent: 5 } |
| B   | やや近い      | 比较符合     | next_step_readiness, recommendation_intent | { next_step_readiness: 4, recommendation_intent: 4 } |
| C   | どちらともいえない | 说不清      | next_step_readiness                        | { next_step_readiness: 3 }                           |
| D   | あまり近くない   | 不太符合     | recovery_need                              | { next_step_readiness: 2, recovery_need: 4 }         |
| E   | まったく近くない  | 完全不符合    | recovery_need                              | { next_step_readiness: 1, recovery_need: 5 }         |

## 6. Dimensions and Scoring Model

### Dimensions

| dimension             | meaning          |
| --------------------- | ---------------- |
| inner_temperature     | 内在温度不明度 / 状态可感知度 |
| emotional_clarity     | 情绪与需求清晰度         |
| emotional_sensitivity | 当前敏感度            |
| emotional_stability   | 当前稳定感            |
| recovery_need         | 恢复需求             |
| reflection_need       | 内省需求             |
| action_energy         | 行动能量             |
| change_readiness      | 改变准备度            |
| next_step_readiness   | 下一步准备度           |
| decision_style        | 决策节奏             |
| reassurance_need      | 安心确认需求           |
| connection_need       | 连接需求             |
| autonomy_need         | 独处 / 自主空间需求      |
| boundary_need         | 边界重整需求           |
| light_support_need    | 轻陪伴需求            |
| relationship_focus    | 关系主题相关度          |
| work_focus            | 工作 / 角色主题相关度     |
| core_need_signal      | Core 深层理解信号      |
| rhythm_reset_need     | 生活节奏重整需求         |
| lightness_need        | 轻娱乐 / 轻提示需求      |
| core_depth_intent     | 120 问主测试意图       |
| oracle_return_intent  | Oracle / 今日回访意图  |
| recommendation_intent | 推荐 / 下一步接受度      |

### Dimension Weights

| dimension             | weight |
| --------------------- | -----: |
| inner_temperature     |     8% |
| emotional_clarity     |     8% |
| recovery_need         |     8% |
| reflection_need       |     7% |
| action_energy         |     8% |
| next_step_readiness   |     8% |
| reassurance_need      |     7% |
| connection_need       |     5% |
| autonomy_need         |     5% |
| boundary_need         |     5% |
| decision_style        |     6% |
| relationship_focus    |     5% |
| work_focus            |     5% |
| core_depth_intent     |     5% |
| lightness_need        |     5% |
| recommendation_intent |     5% |

### Scoring Logic

* Each option adds weighted signals to one or more dimensions.
* High score does not mean better; it means stronger current-state signal.
* Result assignment is based on dominant dimension patterns and confidence score.
* Results must use “今の状態” language, not fixed identity language.
* Result output must not suggest medical diagnosis, therapy, or any high-stakes decision.

### Confidence Score

confidence_score components:

* completed_all_questions: +40
* non_neutral_answer_rate: +25
* dimension_coverage: +25
* section_completion_integrity: +10

Confidence bands:

* below 60: low confidence
* 60–79: medium confidence
* 80+: high confidence

### Score Display Rule

If shown, the score must be labeled as “今の状態参考スコア.”
It must not be displayed as mental health score, personality score, diagnosis score, or life outcome score.

## 7. Result Types

| result_id | display_name_jp | display_name_cn | short_label_jp | share_card_line_jp      |
| --------- | --------------- | --------------- | -------------- | ----------------------- |
| C02_A     | そっと整える          | 轻轻整理型           | 整える時間          | 今は、少し整えることで戻りやすい状態。     |
| C02_B     | 内側を見たい          | 内在回看型           | 内側確認           | 外へ急ぐより、内側を見たいタイミング。     |
| C02_C     | 小さく動ける          | 小步行动型           | 小さな一歩          | 大きく変えず、小さく試すと動きやすい状態。   |
| C02_D     | 人にほどける          | 关系舒展型           | つながり回復         | 人とのやわらかいつながりで戻りやすい状態。   |
| C02_E     | 距離を測り直す         | 距离重整型           | 距離調整           | 人との距離を少し測り直したい状態。       |
| C02_F     | 方向を探す           | 方向寻找型           | 方向確認           | 正解よりも、自分に合う方向を探している状態。  |
| C02_G     | 余白で戻る           | 余白恢复型           | 余白回復           | 深く考えすぎず、軽い余白で戻りやすい状態。   |
| C02_H     | 深く知りたい          | 深度理解型           | 深掘り準備          | 今の自分を、もう少し深く見てもよさそうな状態。 |

## 8. Result Assignment Rules

### C02_A：そっと整える

* primary trigger dimensions: recovery_need, rhythm_reset_need
* secondary trigger dimensions: pace_sensitivity, emotional_sensitivity
* confidence requirement: medium_or_high
* score range tendency: 65–92
* high-difference override: If action_energy is high, add “整えながら動ける” note.
* low-confidence fallback: C02_F
* tie-break rule: Prefer C02_G if lightness_need is stronger than recovery_need.
* forbidden interpretation: Do not say user needs treatment, rest cure, or medical recovery.

### C02_B：内側を見たい

* primary trigger dimensions: reflection_need, emotional_clarity
* secondary trigger dimensions: core_need_signal, inner_temperature
* confidence requirement: medium_or_high
* score range tendency: 68–94
* high-difference override: If relationship_focus is high, suggest R01 as secondary.
* low-confidence fallback: C02_F
* tie-break rule: Prefer C02_H if core_depth_intent is high.
* forbidden interpretation: Do not say user is withdrawn, closed, or psychologically unstable.

### C02_C：小さく動ける

* primary trigger dimensions: action_energy, next_step_readiness
* secondary trigger dimensions: change_readiness, recommendation_intent
* confidence requirement: medium_or_high
* score range tendency: 70–95
* high-difference override: If recovery_need is high, add “小さく、無理なく” note.
* low-confidence fallback: C02_F
* tie-break rule: Prefer C02_F if decision_style is stronger than action_energy.
* forbidden interpretation: Do not instruct user to make major decisions.

### C02_D：人にほどける

* primary trigger dimensions: connection_need, reassurance_need
* secondary trigger dimensions: light_support_need, relationship_focus
* confidence requirement: medium_or_high
* score range tendency: 66–92
* high-difference override: If boundary_need is also high, add note about “近づき方の調整.”
* low-confidence fallback: C02_A
* tie-break rule: Prefer C02_E if boundary_need dominates connection_need.
* forbidden interpretation: Do not say user depends on others or needs relationship intervention.

### C02_E：距離を測り直す

* primary trigger dimensions: boundary_need, autonomy_need
* secondary trigger dimensions: relationship_focus, emotional_clarity
* confidence requirement: medium_or_high
* score range tendency: 66–92
* high-difference override: If reassurance_need high, add note about safe communication.
* low-confidence fallback: C02_F
* tie-break rule: Prefer C02_B if reflection_need dominates boundary_need.
* forbidden interpretation: Do not advise cutting ties, ending relationships, or confronting someone.

### C02_F：方向を探す

* primary trigger dimensions: decision_style, core_need_signal
* secondary trigger dimensions: emotional_clarity, next_step_readiness
* confidence requirement: low_or_medium_or_high
* score range tendency: any
* high-difference override: Use when signals are mixed across sections.
* low-confidence fallback: C02_F
* tie-break rule: Default fallback when confidence is low or no dominant type.
* forbidden interpretation: Do not say user is lost, indecisive, or lacking direction.

### C02_G：余白で戻る

* primary trigger dimensions: lightness_need, oracle_return_intent
* secondary trigger dimensions: recovery_need, light_support_need
* confidence requirement: medium_or_high
* score range tendency: 60–88
* high-difference override: If core_depth_intent high, recommend both S01 and 120問.
* low-confidence fallback: C02_A
* tie-break rule: Prefer C02_A if recovery_need dominates lightness_need.
* forbidden interpretation: Do not frame oracle/asobi as prediction or fate.

### C02_H：深く知りたい

* primary trigger dimensions: core_depth_intent, reflection_need
* secondary trigger dimensions: core_need_signal, emotional_clarity
* confidence requirement: medium_or_high
* score range tendency: 72–96
* high-difference override: If work_focus high, also recommend F01 after 120問.
* low-confidence fallback: C02_F
* tie-break rule: Prefer C02_B if reflection_need high but core_depth_intent moderate.
* forbidden interpretation: Do not pressure user into 120問 or paid report.

## 9. Free Result Structure

Free result page order:

1. 今の状態参考スコア
2. 今のわたしタイプ
3. 今のあなたに見えていること 2 个
4. つまずきやすいところ 1 个
5. 今日ひとつだけ試せる問い 1 个
6. 120問 Life-State 主测试 CTA
7. Relevant next-test recommendation
8. Share card CTA

### free_result_sample_jp

あなたの今の状態タイプは **「方向を探す」** です。
大きな答えをすぐに決めるより、今は「何がしっくりくるか」を少しずつ確かめたい状態です。

今のあなたに見えていること:

* 違和感を減らしながら選びたい
* 小さく確認できる形があると進みやすい

つまずきやすいところ:

* 選択肢が多すぎると、自分の声が見えにくくなる

今日ひとつだけ試せる問い:

* 「今すぐ正解にしなくていいなら、少し楽になる選択肢はどれ？」

### paid_teaser_sample_jp

深掘りレポートでは、今の状態タイプ、迷いやすい場面、戻りやすい方法、次に見るとよい Yorisou 診断を整理します。

### core_bridge_copy_jp

このチェックは、今の状態を見る入口です。
もっと深く自分の Life-State を見たい場合は、120問ライフステート診断へ進めます。

### share_cta_jp

今のわたしタイプをシェアする

## 10. Paid Report Outline

### paid_report_name_jp

今のわたし深掘りレポート

### paid_report_promise_jp

今のあなたの状態、内側の温度、人との距離、動き出しやすい条件、戻りやすい方法を整理します。
これは医療・心理診断ではなく、自分を見つめるための参考レポートです。

### section_outline_jp

1. 今のわたしタイプ詳細
2. 内側の温度と見えにくい気持ち
3. 人との距離と安心感
4. 動き出しやすい条件
5. 迷いやすい時の扱い方
6. 回復しやすい戻り方
7. 今日からできる小さな問い
8. 次に見るとよい Yorisou 診断
9. 120問 Life-State への橋渡し

### free_vs_paid_boundary

Free includes:

* type
* score
* two visible tendencies
* one friction point
* one small question
* next test CTA

Paid adds:

* dimension radar
* section-by-section analysis
* state pattern interpretation
* safer next-step prompts
* recommendation routing
* 7-day reflection prompts

Paid must not include:

* medical diagnosis
* therapy advice
* mental health screening
* high-stakes decisions
* deterministic future prediction
* fear-based urgency

### sample_paid_cta_jp

今の状態を、もう少し深く整理する

### forbidden_paid_copy

* 今すぐ見ないと悪化します
* あなたは危険な状態です
* この結果は専門的な心理診断です
* この通りに行動してください
* これで人生が変わります
* あなたの本当の性格が分かります

## 11. Share Card Logic

### Version A：Type Focus

* card_title_jp: 今のわたしチェック
* visible_fields: type_label, safe_one_line, QR/link
* main_line_jp: 方向を探す
* sub_line_jp: 正解よりも、しっくりくる方向を確かめたい状態。
* CTA: 今のわたしをチェックする
* forbidden_fields: private answers, emotional vulnerability, reassurance need, relationship friction, paid report content

### Version B：Soft Score Focus

* card_title_jp: 今の状態参考スコア
* visible_fields: score, type label, one safe strength
* main_line_jp: 今の状態参考スコア 74 / 100
* sub_line_jp: 今の自分の輪郭が少し見えてきました。
* CTA: チェックしてみる
* forbidden_fields: diagnosis implication, weakness, clinical labels, anxiety language

### Version C：Core Bridge Focus

* card_title_jp: 今のわたしから、深い自分へ
* visible_fields: type, core bridge line, CTA
* main_line_jp: 今の状態は、Life-State の入口。
* sub_line_jp: 次は120問で深く見てみる。
* CTA: 120問診断へ
* forbidden_fields: pressure, urgency, fake authority, paid-only framing

## 12. Recommendation Mapping

| recommendation_type | trigger_condition                           | reason_copy_jp                         | commercial_status                 | disclosure_needed |
| ------------------- | ------------------------------------------- | -------------------------------------- | --------------------------------- | ----------------- |
| 120問ライフステート診断       | core_depth_intent high or C02_H assigned    | 今の状態を、もっと深い Life-State として見てみませんか。     | free / core / later report bridge | no                |
| R01 ふたり恋愛相性診断       | relationship_focus high                     | 今の状態に大切な人との距離が関係していそうなら、ふたりのリズムも見られます。 | free / paid report bridge         | no                |
| F01 向いている働き方診断      | work_focus high                             | 仕事や役割が今の状態に影響していそうなら、働き方のリズムも見てみませんか。  | free / paid report bridge         | no                |
| S01 今日のおみくじ         | lightness_need or oracle_return_intent high | 深く考えすぎず、今日の小さなヒントを見てみるのも合いそうです。        | free / recurring                  | no                |
| 回復方式テスト             | recovery_need high                          | 戻り方のパターンをもう少し具体的に見られます。                | free / module later               | no                |
| 選び方テスト              | decision_style high                         | 迷いやすい時の選び方を、もう少し見てみるのもよさそうです。          | free / module later               | no                |
| 今のわたし深掘りレポート        | paid report CTA click                       | 今の状態を、もう少し丁寧に整理できます。                   | paid report                       | yes               |

## 13. LINE / Web Return Path

### Save After Completion

* Show 「結果を保存する」 after result.
* Do not claim account/cloud save unless actually available.
* If only local/session save exists, copy must say temporary or device-based.

### 3-Day Follow-Up

この前の「今のわたし」から、少し変わった感じはありますか？

### 7-Day Follow-Up

今週のあなたは、整える・動く・話す・休むのどれが近そうですか？

### 30-Day Follow-Up

前回の状態から少し時間が経ちました。今のわたしをもう一度見てみますか？

### Avoiding Disturbance

* Default reminders off.
* Separate opt-in for save, 3-day reminder, 7-day reminder, 30-day reminder.
* No crisis language.
* No “you need help” framing.
* No fake urgency.

## 14. UX Implementation Notes

| area                   | product / UX note                                                       |
| ---------------------- | ----------------------------------------------------------------------- |
| mobile-first flow      | One question per screen or compact stacked cards.                       |
| progress behavior      | Show section title and 1/36 progress.                                   |
| section break behavior | Show section break copy after every 9 questions.                        |
| result reveal behavior | Show type first, then two tendencies, one friction, one small question. |
| paid report preview    | Explain concrete additions without fear or diagnosis.                   |
| share behavior         | Only share public-safe type and one-line description.                   |
| retake behavior        | Recommend 2–4 week retake or when state changes.                        |
| Core bridge            | Always include 120問 Life-State CTA.                                     |
| recommendation rule    | Show only one additional test recommendation based on strongest signal. |
| anti-supermarket rule  | Never show all categories at once from C02 result page.                 |

## 15. Trust-Risk Review

| risk                         | risk_level | issue_found                                                            | required_fix                                                 | final_status                 |
| ---------------------------- | ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| Psychological diagnosis risk | high       | Current-state questions may sound mental-health adjacent               | Must state non-clinical, no diagnosis, no screening          | pass_with_boundary           |
| Emotional vulnerability leak | high       | Some answers reveal reassurance/recovery needs                         | Share cards must only show public-safe labels                | pass_with_boundary           |
| Crisis implication risk      | high       | Low energy/recovery language could be misread                          | No crisis, symptom, or treatment language                    | pass_with_boundary           |
| Relationship judgment risk   | medium     | Relationship-focused items may trigger relationship advice expectation | Recommend R01 only as rhythm reference, not outcome judgment | pass                         |
| Work decision risk           | medium     | Work-focused items may trigger career advice expectation               | Recommend F01 only as work-style reference                   | pass                         |
| Fortune/oracle confusion     | medium     | S01 routing could dilute Core                                          | Label S01 as light reflective hint, not prediction           | pass                         |
| Paid anxiety risk            | medium     | “Deep report” could pressure vulnerable users                          | No urgency/fear/scarcity; report is optional                 | pass                         |
| LINE consent risk            | high       | Follow-ups require clear permission                                    | Separate opt-in required                                     | pass_requires_consent_design |
| Minor user risk              | medium     | Current-state tests may attract minors                                 | Avoid adult/high-stakes advice; add general-use boundary     | review_required              |

## 16. Complete TypeScript-Friendly Data Spec

```ts
export const c02ImaNoWatashiCheckV10 = {
  metadata: {
    test_id: "C02",
    version: "v1.0",
    test_name_jp: "今のわたしチェック",
    test_name_cn: "现在的我状态检查",
    layer: "Yorisou Core",
    question_count: 36,
    section_count: 4,
    expected_completion_time: "7-10 minutes",
    output_status: "draft_test_spec",
    codex_ready: false,
    implementation_status: "review_file_only_not_site_integration"
  },

  sections: [
    {
      id: "A",
      title_jp: "今の内側の温度",
      title_cn: "现在内在的温度",
      question_ids: ["C02_Q01","C02_Q02","C02_Q03","C02_Q04","C02_Q05","C02_Q06","C02_Q07","C02_Q08","C02_Q09"],
      section_break_copy_jp: "ここまでで、今の内側の温度が少し見えてきました。次は、人との距離と安心感を見ていきます。"
    },
    {
      id: "B",
      title_jp: "人との距離と安心感",
      title_cn: "与人的距离和安心感",
      question_ids: ["C02_Q10","C02_Q11","C02_Q12","C02_Q13","C02_Q14","C02_Q15","C02_Q16","C02_Q17","C02_Q18"],
      section_break_copy_jp: "人との距離の取り方が見えてきました。次は、動き出し方と迷い方を見ていきます。"
    },
    {
      id: "C",
      title_jp: "動き出し方と迷い方",
      title_cn: "行动方式和犹豫方式",
      question_ids: ["C02_Q19","C02_Q20","C02_Q21","C02_Q22","C02_Q23","C02_Q24","C02_Q25","C02_Q26","C02_Q27"],
      section_break_copy_jp: "今のあなたが動き出しやすい条件が見えてきました。最後に、回復と次の一歩を見ていきます。"
    },
    {
      id: "D",
      title_jp: "回復・選択・次の一歩",
      title_cn: "恢复、选择和下一步",
      question_ids: ["C02_Q28","C02_Q29","C02_Q30","C02_Q31","C02_Q32","C02_Q33","C02_Q34","C02_Q35","C02_Q36"],
      section_break_copy_jp: "回答ありがとうございます。結果では、今のあなたの状態タイプと、次に見るとよい診断を整理します。"
    }
  ],

  dimensions: {
    inner_temperature: "内在温度不明度 / 状态可感知度",
    emotional_clarity: "情绪与需求清晰度",
    emotional_sensitivity: "当前敏感度",
    emotional_stability: "当前稳定感",
    recovery_need: "恢复需求",
    reflection_need: "内省需求",
    action_energy: "行动能量",
    change_readiness: "改变准备度",
    next_step_readiness: "下一步准备度",
    decision_style: "决策节奏",
    reassurance_need: "安心确认需求",
    connection_need: "连接需求",
    autonomy_need: "独处 / 自主空间需求",
    boundary_need: "边界重整需求",
    light_support_need: "轻陪伴需求",
    relationship_focus: "关系主题相关度",
    work_focus: "工作 / 角色主题相关度",
    core_need_signal: "Core 深层理解信号",
    rhythm_reset_need: "生活节奏重整需求",
    lightness_need: "轻娱乐 / 轻提示需求",
    core_depth_intent: "120 问主测试意图",
    oracle_return_intent: "Oracle / 今日回访意图",
    recommendation_intent: "推荐 / 下一步接受度"
  },

  dimension_weights: {
    inner_temperature: 0.08,
    emotional_clarity: 0.08,
    recovery_need: 0.08,
    reflection_need: 0.07,
    action_energy: 0.08,
    next_step_readiness: 0.08,
    reassurance_need: 0.07,
    connection_need: 0.05,
    autonomy_need: 0.05,
    boundary_need: 0.05,
    decision_style: 0.06,
    relationship_focus: 0.05,
    work_focus: 0.05,
    core_depth_intent: 0.05,
    lightness_need: 0.05,
    recommendation_intent: 0.05
  },

  questions: [
    {
      id: "C02_Q01",
      section: "A",
      question_type: "scale",
      prompt_jp: "最近、自分の気持ちの温度が少し分かりにくい。",
      prompt_cn: "最近，我有点不太清楚自己内心的温度。",
      primary_dimension: "inner_temperature",
      secondary_dimension: "emotional_clarity",
      sensitivity_level: "medium",
      public_private_note: "aggregate only; do not expose in share card",
      risk_note: "Could imply emotional confusion; keep non-clinical.",
      interpretation_boundary: "Interpret as current self-awareness state, not mental health diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["inner_temperature","emotional_clarity"], weights: { inner_temperature: 5, emotional_clarity: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["inner_temperature","emotional_clarity"], weights: { inner_temperature: 4, emotional_clarity: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["inner_temperature"], weights: { inner_temperature: 3, emotional_clarity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_clarity"], weights: { inner_temperature: 2, emotional_clarity: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_clarity"], weights: { inner_temperature: 1, emotional_clarity: 5 } }
      ]
    },
    {
      id: "C02_Q02",
      section: "A",
      question_type: "scale",
      prompt_jp: "何かを頑張る前に、まず少し整える時間がほしい。",
      prompt_cn: "在努力做什么之前，我想先有一点整理自己的时间。",
      primary_dimension: "recovery_need",
      secondary_dimension: "action_energy",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; preparation and recovery preference only.",
      interpretation_boundary: "Interpret as pacing need, not inability to act.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_need","action_energy"], weights: { recovery_need: 5, action_energy: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_need","action_energy"], weights: { recovery_need: 4, action_energy: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_need"], weights: { recovery_need: 3, action_energy: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { recovery_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { recovery_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q03",
      section: "A",
      question_type: "scale",
      prompt_jp: "今は、外に向かう力よりも内側を見たい気持ちが強い。",
      prompt_cn: "现在，比起向外行动，我更想看看自己的内在。",
      primary_dimension: "reflection_need",
      secondary_dimension: "action_energy",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; reflective orientation only.",
      interpretation_boundary: "Interpret as current attention direction, not social withdrawal.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reflection_need","action_energy"], weights: { reflection_need: 5, action_energy: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reflection_need","action_energy"], weights: { reflection_need: 4, action_energy: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reflection_need"], weights: { reflection_need: 3, action_energy: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { reflection_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { reflection_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q04",
      section: "A",
      question_type: "scale",
      prompt_jp: "小さなことにも、少し反応しやすくなっている。",
      prompt_cn: "我最近对一些小事也更容易有反应。",
      primary_dimension: "emotional_sensitivity",
      secondary_dimension: "recovery_need",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could touch sensitivity; avoid clinical interpretation.",
      interpretation_boundary: "Interpret as current sensitivity, not symptom or disorder.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["emotional_sensitivity","recovery_need"], weights: { emotional_sensitivity: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["emotional_sensitivity","recovery_need"], weights: { emotional_sensitivity: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["emotional_sensitivity"], weights: { emotional_sensitivity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_stability"], weights: { emotional_sensitivity: 2, emotional_stability: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_stability"], weights: { emotional_sensitivity: 1, emotional_stability: 5 } }
      ]
    },
    {
      id: "C02_Q05",
      section: "A",
      question_type: "scale",
      prompt_jp: "今の自分に必要なものを、言葉にするのが少し難しい。",
      prompt_cn: "我现在有点难把自己需要什么说清楚。",
      primary_dimension: "emotional_clarity",
      secondary_dimension: "core_need_signal",
      sensitivity_level: "medium",
      public_private_note: "aggregate only; not share-card visible",
      risk_note: "Could imply confusion; avoid deficit framing.",
      interpretation_boundary: "Interpret as language clarity, not competence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["emotional_clarity","core_need_signal"], weights: { emotional_clarity: 1, core_need_signal: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["emotional_clarity","core_need_signal"], weights: { emotional_clarity: 2, core_need_signal: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_need_signal"], weights: { emotional_clarity: 3, core_need_signal: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_clarity"], weights: { emotional_clarity: 4, core_need_signal: 2 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_clarity"], weights: { emotional_clarity: 5, core_need_signal: 1 } }
      ]
    },
    {
      id: "C02_Q06",
      section: "A",
      question_type: "scale",
      prompt_jp: "最近の私は、少し急かされるとペースが乱れやすい。",
      prompt_cn: "最近的我，如果被催促，节奏容易被打乱。",
      primary_dimension: "pace_sensitivity",
      secondary_dimension: "recovery_need",
      sensitivity_level: "medium",
      public_private_note: "aggregate only",
      risk_note: "Could touch stress response; keep non-clinical.",
      interpretation_boundary: "Interpret as pace sensitivity, not stress disorder.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["pace_sensitivity","recovery_need"], weights: { pace_sensitivity: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["pace_sensitivity","recovery_need"], weights: { pace_sensitivity: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["pace_sensitivity"], weights: { pace_sensitivity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { pace_sensitivity: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { pace_sensitivity: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q07",
      section: "A",
      question_type: "scale",
      prompt_jp: "まだ形になっていないけれど、変わりたい感じがある。",
      prompt_cn: "虽然还没成形，但我有一种想要改变的感觉。",
      primary_dimension: "change_readiness",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; change intention only.",
      interpretation_boundary: "Interpret as readiness signal, not promise of change.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["change_readiness","next_step_readiness"], weights: { change_readiness: 5, next_step_readiness: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["change_readiness","next_step_readiness"], weights: { change_readiness: 4, next_step_readiness: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["change_readiness"], weights: { change_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { change_readiness: 2, stability_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { change_readiness: 1, stability_need: 5 } }
      ]
    },
    {
      id: "C02_Q08",
      section: "A",
      question_type: "scale",
      prompt_jp: "今は、大きな決断よりも小さな確認を重ねたい。",
      prompt_cn: "现在，比起做大决定，我更想一点点确认。",
      primary_dimension: "decision_style",
      secondary_dimension: "reassurance_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; decision rhythm only.",
      interpretation_boundary: "Interpret as decision pacing, not inability to decide.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["decision_style","reassurance_need"], weights: { decision_style: 5, reassurance_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["decision_style","reassurance_need"], weights: { decision_style: 4, reassurance_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["decision_style"], weights: { decision_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { decision_style: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { decision_style: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q09",
      section: "A",
      question_type: "scale",
      prompt_jp: "今の自分を、誰かに少し分かってほしい気持ちがある。",
      prompt_cn: "我现在有一点希望有人理解我。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "relationship_focus",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could reveal vulnerability; never expose in share card.",
      interpretation_boundary: "Interpret as current reassurance need, not loneliness diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 5, relationship_focus: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 4, relationship_focus: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q10",
      section: "B",
      question_type: "scale",
      prompt_jp: "人と一緒にいる時間があると、気持ちが戻りやすい。",
      prompt_cn: "和人在一起时，我的状态更容易回来。",
      primary_dimension: "connection_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; connection preference only.",
      interpretation_boundary: "Interpret as recovery preference, not dependence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["connection_need","recovery_need"], weights: { connection_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["connection_need","recovery_need"], weights: { connection_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["connection_need"], weights: { connection_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { connection_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { connection_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q11",
      section: "B",
      question_type: "scale",
      prompt_jp: "今は、ひとりで静かに戻る時間も大切にしたい。",
      prompt_cn: "现在，我也想重视一个人安静恢复的时间。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; solitude preference only.",
      interpretation_boundary: "Interpret as recovery space, not isolation.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need","recovery_need"], weights: { autonomy_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need","recovery_need"], weights: { autonomy_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["connection_need"], weights: { autonomy_need: 2, connection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["connection_need"], weights: { autonomy_need: 1, connection_need: 5 } }
      ]
    },
    {
      id: "C02_Q12",
      section: "B",
      question_type: "scale",
      prompt_jp: "連絡の間が空くと、少し気持ちが揺れやすい。",
      prompt_cn: "如果联系中断一段时间，我的心情容易有点摇晃。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "relationship_focus",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Relationship reassurance sensitivity; avoid blaming others.",
      interpretation_boundary: "Interpret as reassurance rhythm, not relationship judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 5, relationship_focus: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 4, relationship_focus: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q13",
      section: "B",
      question_type: "scale",
      prompt_jp: "人に合わせすぎて、自分の本音が後回しになることがある。",
      prompt_cn: "我有时会太配合别人，把自己的真实想法放到后面。",
      primary_dimension: "boundary_need",
      secondary_dimension: "emotional_clarity",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could expose boundary vulnerability; no share-card use.",
      interpretation_boundary: "Interpret as boundary tendency, not weakness or blame.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["boundary_need","emotional_clarity"], weights: { boundary_need: 5, emotional_clarity: 2 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["boundary_need","emotional_clarity"], weights: { boundary_need: 4, emotional_clarity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["boundary_need"], weights: { boundary_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { boundary_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { boundary_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q14",
      section: "B",
      question_type: "scale",
      prompt_jp: "今は、深い話よりも軽くそばにいてくれる感じがちょうどいい。",
      prompt_cn: "现在，比起很深的对话，轻轻陪在身边的感觉更刚好。",
      primary_dimension: "light_support_need",
      secondary_dimension: "connection_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; support style only.",
      interpretation_boundary: "Interpret as preferred support style, not emotional avoidance.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["light_support_need","connection_need"], weights: { light_support_need: 5, connection_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["light_support_need","connection_need"], weights: { light_support_need: 4, connection_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["light_support_need"], weights: { light_support_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { light_support_need: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { light_support_need: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q15",
      section: "B",
      question_type: "scale",
      prompt_jp: "誰かに相談する前に、自分の中で少し整理したい。",
      prompt_cn: "在找人商量之前，我想先自己整理一下。",
      primary_dimension: "reflection_need",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; reflection preference only.",
      interpretation_boundary: "Interpret as processing style, not refusal to connect.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reflection_need","autonomy_need"], weights: { reflection_need: 5, autonomy_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reflection_need","autonomy_need"], weights: { reflection_need: 4, autonomy_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reflection_need"], weights: { reflection_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["connection_need"], weights: { reflection_need: 2, connection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["connection_need"], weights: { reflection_need: 1, connection_need: 5 } }
      ]
    },
    {
      id: "C02_Q16",
      section: "B",
      question_type: "scale",
      prompt_jp: "今の自分には、はっきりした助言よりも受け止めてもらう時間が必要だ。",
      prompt_cn: "对现在的我来说，比起明确建议，更需要被接住的时间。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "light_support_need",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Support need; avoid therapeutic framing.",
      interpretation_boundary: "Interpret as support preference, not therapy need.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","light_support_need"], weights: { reassurance_need: 5, light_support_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","light_support_need"], weights: { reassurance_need: 4, light_support_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { reassurance_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { reassurance_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q17",
      section: "B",
      question_type: "scale",
      prompt_jp: "人との関係で、少し距離を測り直したい相手がいる。",
      prompt_cn: "在人际关系里，我有想重新衡量距离的人。",
      primary_dimension: "boundary_need",
      secondary_dimension: "relationship_focus",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Relationship boundary signal; avoid relationship judgment.",
      interpretation_boundary: "Interpret as distance recalibration, not advice to cut ties.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["boundary_need","relationship_focus"], weights: { boundary_need: 5, relationship_focus: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["boundary_need","relationship_focus"], weights: { boundary_need: 4, relationship_focus: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["boundary_need"], weights: { boundary_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["connection_need"], weights: { boundary_need: 2, connection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["connection_need"], weights: { boundary_need: 1, connection_need: 5 } }
      ]
    },
    {
      id: "C02_Q18",
      section: "B",
      question_type: "scale",
      prompt_jp: "今は、人との関係よりも自分の足元を整えたい。",
      prompt_cn: "现在，比起人际关系，我更想整理好自己的脚下。",
      primary_dimension: "core_need_signal",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; focus direction only.",
      interpretation_boundary: "Interpret as current priority, not rejection of relationships.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["core_need_signal","autonomy_need"], weights: { core_need_signal: 5, autonomy_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["core_need_signal","autonomy_need"], weights: { core_need_signal: 4, autonomy_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_need_signal"], weights: { core_need_signal: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["relationship_focus"], weights: { core_need_signal: 2, relationship_focus: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["relationship_focus"], weights: { core_need_signal: 1, relationship_focus: 5 } }
      ]
    },
    {
      id: "C02_Q19",
      section: "C",
      question_type: "scale",
      prompt_jp: "やりたいことはあるのに、最初の一歩が重く感じる。",
      prompt_cn: "明明有想做的事，但第一步感觉很重。",
      primary_dimension: "action_energy",
      secondary_dimension: "decision_style",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could imply low energy; not clinical.",
      interpretation_boundary: "Interpret as action-start state, not inability or disorder.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["action_energy","decision_style"], weights: { action_energy: 1, decision_style: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["action_energy","decision_style"], weights: { action_energy: 2, decision_style: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["action_energy"], weights: { action_energy: 3, decision_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { action_energy: 4, decision_style: 2 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { action_energy: 5, decision_style: 1 } }
      ]
    },
    {
      id: "C02_Q20",
      section: "C",
      question_type: "scale",
      prompt_jp: "今は、考えるより先に少し動いてみたい気持ちがある。",
      prompt_cn: "现在，我有一点想先动起来而不是继续思考。",
      primary_dimension: "action_energy",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; action readiness only.",
      interpretation_boundary: "Interpret as readiness, not instruction to act.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["action_energy","next_step_readiness"], weights: { action_energy: 5, next_step_readiness: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["action_energy","next_step_readiness"], weights: { action_energy: 4, next_step_readiness: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["action_energy"], weights: { action_energy: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { action_energy: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { action_energy: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q21",
      section: "C",
      question_type: "scale",
      prompt_jp: "選択肢が多いと、どれが自分に合うのか分からなくなりやすい。",
      prompt_cn: "选择太多时，我容易不知道哪个适合自己。",
      primary_dimension: "decision_style",
      secondary_dimension: "emotional_clarity",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; decision style only.",
      interpretation_boundary: "Interpret as choice processing, not decisiveness judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["decision_style","emotional_clarity"], weights: { decision_style: 5, emotional_clarity: 2 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["decision_style","emotional_clarity"], weights: { decision_style: 4, emotional_clarity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["decision_style"], weights: { decision_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_clarity"], weights: { decision_style: 2, emotional_clarity: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_clarity"], weights: { decision_style: 1, emotional_clarity: 5 } }
      ]
    },
    {
      id: "C02_Q22",
      section: "C",
      question_type: "scale",
      prompt_jp: "小さく試せる形があると、動き出しやすい。",
      prompt_cn: "如果能以小规模尝试的方式开始，我更容易行动。",
      primary_dimension: "next_step_readiness",
      secondary_dimension: "action_energy",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; trial preference only.",
      interpretation_boundary: "Interpret as action design, not advice or instruction.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["next_step_readiness","action_energy"], weights: { next_step_readiness: 5, action_energy: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["next_step_readiness","action_energy"], weights: { next_step_readiness: 4, action_energy: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["next_step_readiness"], weights: { next_step_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { next_step_readiness: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { next_step_readiness: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q23",
      section: "C",
      question_type: "scale",
      prompt_jp: "今の迷いは、情報不足というより自分の気持ちの確認に近い。",
      prompt_cn: "我现在的犹豫，比起信息不足，更像是在确认自己的心情。",
      primary_dimension: "emotional_clarity",
      secondary_dimension: "reflection_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; reflection signal only.",
      interpretation_boundary: "Interpret as inner confirmation need, not indecision flaw.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["emotional_clarity","reflection_need"], weights: { emotional_clarity: 2, reflection_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["emotional_clarity","reflection_need"], weights: { emotional_clarity: 3, reflection_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reflection_need"], weights: { emotional_clarity: 3, reflection_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { emotional_clarity: 4, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { emotional_clarity: 5, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q24",
      section: "C",
      question_type: "scale",
      prompt_jp: "誰かに背中を押されると、今なら少し動けそうだ。",
      prompt_cn: "如果有人轻轻推我一下，现在我也许能动起来。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; encouragement preference only.",
      interpretation_boundary: "Interpret as support for action, not dependence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","next_step_readiness"], weights: { reassurance_need: 5, next_step_readiness: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","next_step_readiness"], weights: { reassurance_need: 4, next_step_readiness: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q25",
      section: "C",
      question_type: "scale",
      prompt_jp: "今は、正解を探すよりも違和感を減らしたい。",
      prompt_cn: "现在，比起寻找正确答案，我更想减少违和感。",
      primary_dimension: "core_need_signal",
      secondary_dimension: "decision_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; decision comfort only.",
      interpretation_boundary: "Interpret as fit-seeking, not truth or certainty.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["core_need_signal","decision_style"], weights: { core_need_signal: 5, decision_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["core_need_signal","decision_style"], weights: { core_need_signal: 4, decision_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_need_signal"], weights: { core_need_signal: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { core_need_signal: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { core_need_signal: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q26",
      section: "C",
      question_type: "scale",
      prompt_jp: "仕事や役割のことが、今の状態に影響している感じがある。",
      prompt_cn: "我感觉工作或角色正在影响我现在的状态。",
      primary_dimension: "work_focus",
      secondary_dimension: "core_need_signal",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Work-state signal; no career advice.",
      interpretation_boundary: "Interpret as work relevance, not job diagnosis or resignation cue.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["work_focus","core_need_signal"], weights: { work_focus: 5, core_need_signal: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["work_focus","core_need_signal"], weights: { work_focus: 4, core_need_signal: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["work_focus"], weights: { work_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["relationship_focus"], weights: { work_focus: 2, relationship_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["relationship_focus"], weights: { work_focus: 1, relationship_focus: 4 } }
      ]
    },
    {
      id: "C02_Q27",
      section: "C",
      question_type: "scale",
      prompt_jp: "恋愛や大切な人との関係が、今の状態に影響している感じがある。",
      prompt_cn: "我感觉恋爱或重要关系正在影响我现在的状态。",
      primary_dimension: "relationship_focus",
      secondary_dimension: "core_need_signal",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Relationship-state signal; no compatibility judgment.",
      interpretation_boundary: "Interpret as relationship relevance, not relationship outcome prediction.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["relationship_focus","core_need_signal"], weights: { relationship_focus: 5, core_need_signal: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["relationship_focus","core_need_signal"], weights: { relationship_focus: 4, core_need_signal: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["relationship_focus"], weights: { relationship_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["work_focus"], weights: { relationship_focus: 2, work_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["work_focus"], weights: { relationship_focus: 1, work_focus: 4 } }
      ]
    },
    {
      id: "C02_Q28",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、まず休むよりも方向を決めることが必要に感じる。",
      prompt_cn: "对现在的我来说，比起先休息，我感觉更需要确定方向。",
      primary_dimension: "next_step_readiness",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; direction vs rest preference only.",
      interpretation_boundary: "Interpret as current felt need, not recommendation to ignore rest.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["next_step_readiness","recovery_need"], weights: { next_step_readiness: 5, recovery_need: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["next_step_readiness","recovery_need"], weights: { next_step_readiness: 4, recovery_need: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["next_step_readiness"], weights: { next_step_readiness: 3, recovery_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 2, recovery_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 1, recovery_need: 5 } }
      ]
    },
    {
      id: "C02_Q29",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、方向を決めるよりも回復する時間が必要に感じる。",
      prompt_cn: "对现在的我来说，比起确定方向，我感觉更需要恢复时间。",
      primary_dimension: "recovery_need",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Recovery signal; avoid health or treatment framing.",
      interpretation_boundary: "Interpret as recovery preference, not medical need.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_need","next_step_readiness"], weights: { recovery_need: 5, next_step_readiness: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_need","next_step_readiness"], weights: { recovery_need: 4, next_step_readiness: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_need"], weights: { recovery_need: 3, next_step_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["next_step_readiness"], weights: { recovery_need: 2, next_step_readiness: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["next_step_readiness"], weights: { recovery_need: 1, next_step_readiness: 5 } }
      ]
    },
    {
      id: "C02_Q30",
      section: "D",
      question_type: "scale",
      prompt_jp: "生活のリズムを少し整えると、気持ちも戻りやすそうだ。",
      prompt_cn: "如果稍微整理生活节奏，我的心情也更容易回来。",
      primary_dimension: "rhythm_reset_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; lifestyle rhythm signal only.",
      interpretation_boundary: "Interpret as rhythm support, not health advice.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["rhythm_reset_need","recovery_need"], weights: { rhythm_reset_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["rhythm_reset_need","recovery_need"], weights: { rhythm_reset_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["rhythm_reset_need"], weights: { rhythm_reset_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { rhythm_reset_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { rhythm_reset_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q31",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、少し遊びや余白がある方が戻りやすい。",
      prompt_cn: "对现在的我来说，有一点玩心和余白更容易恢复。",
      primary_dimension: "lightness_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; lightness preference only.",
      interpretation_boundary: "Interpret as reflective entertainment fit, not avoidance.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["lightness_need","recovery_need"], weights: { lightness_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["lightness_need","recovery_need"], weights: { lightness_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["lightness_need"], weights: { lightness_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { lightness_need: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { lightness_need: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q32",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の状態をもう少し深く知るなら、時間をかけても見てみたい。",
      prompt_cn: "如果能更深入理解现在的状态，我愿意花一点时间看。",
      primary_dimension: "core_depth_intent",
      secondary_dimension: "reflection_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; deep-test intent only.",
      interpretation_boundary: "Interpret as 120-question readiness, not paid pressure.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["core_depth_intent","reflection_need"], weights: { core_depth_intent: 5, reflection_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["core_depth_intent","reflection_need"], weights: { core_depth_intent: 4, reflection_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_depth_intent"], weights: { core_depth_intent: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["lightness_need"], weights: { core_depth_intent: 2, lightness_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["lightness_need"], weights: { core_depth_intent: 1, lightness_need: 5 } }
      ]
    },
    {
      id: "C02_Q33",
      section: "D",
      question_type: "scale",
      prompt_jp: "今は、深い診断よりも今日の小さなヒントがある方が合っている。",
      prompt_cn: "现在，比起深度测试，我更适合看看今天的小提示。",
      primary_dimension: "lightness_need",
      secondary_dimension: "oracle_return_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; oracle/asobi routing signal only.",
      interpretation_boundary: "Interpret as light return preference, not fortune belief.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["lightness_need","oracle_return_intent"], weights: { lightness_need: 5, oracle_return_intent: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["lightness_need","oracle_return_intent"], weights: { lightness_need: 4, oracle_return_intent: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["lightness_need"], weights: { lightness_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["core_depth_intent"], weights: { lightness_need: 2, core_depth_intent: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["core_depth_intent"], weights: { lightness_need: 1, core_depth_intent: 5 } }
      ]
    },
    {
      id: "C02_Q34",
      section: "D",
      question_type: "scale",
      prompt_jp: "自分の状態を、恋愛や人との相性からも見てみたい。",
      prompt_cn: "我也想从恋爱或人与人的相性角度看看自己的状态。",
      primary_dimension: "relationship_focus",
      secondary_dimension: "recommendation_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Relationship recommendation signal; no outcome prediction.",
      interpretation_boundary: "Interpret as interest routing to R01, not relationship advice.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["relationship_focus","recommendation_intent"], weights: { relationship_focus: 5, recommendation_intent: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["relationship_focus","recommendation_intent"], weights: { relationship_focus: 4, recommendation_intent: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["relationship_focus"], weights: { relationship_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["work_focus"], weights: { relationship_focus: 2, work_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["work_focus"], weights: { relationship_focus: 1, work_focus: 4 } }
      ]
    },
    {
      id: "C02_Q35",
      section: "D",
      question_type: "scale",
      prompt_jp: "自分の状態を、働き方や役割の面からも見てみたい。",
      prompt_cn: "我也想从工作方式或角色角度看看自己的状态。",
      primary_dimension: "work_focus",
      secondary_dimension: "recommendation_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Work recommendation signal; no career advice.",
      interpretation_boundary: "Interpret as interest routing to F01, not career decision.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["work_focus","recommendation_intent"], weights: { work_focus: 5, recommendation_intent: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["work_focus","recommendation_intent"], weights: { work_focus: 4, recommendation_intent: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["work_focus"], weights: { work_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["relationship_focus"], weights: { work_focus: 2, relationship_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["relationship_focus"], weights: { work_focus: 1, relationship_focus: 4 } }
      ]
    },
    {
      id: "C02_Q36",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、ひとつだけ小さな次の一歩があるとよさそうだ。",
      prompt_cn: "对现在的我来说，如果有一个小小的下一步会很好。",
      primary_dimension: "next_step_readiness",
      secondary_dimension: "recommendation_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; next-step preference only.",
      interpretation_boundary: "Interpret as gentle next-step readiness, not instruction or obligation.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["next_step_readiness","recommendation_intent"], weights: { next_step_readiness: 5, recommendation_intent: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["next_step_readiness","recommendation_intent"], weights: { next_step_readiness: 4, recommendation_intent: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["next_step_readiness"], weights: { next_step_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 2, recovery_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 1, recovery_need: 5 } }
      ]
    }
  ],

  result_types: [
    { id: "C02_A", display_name_jp: "そっと整える", display_name_cn: "轻轻整理型", short_label_jp: "整える時間", share_card_line_jp: "今は、少し整えることで戻りやすい状態。" },
    { id: "C02_B", display_name_jp: "内側を見たい", display_name_cn: "内在回看型", short_label_jp: "内側確認", share_card_line_jp: "外へ急ぐより、内側を見たいタイミング。" },
    { id: "C02_C", display_name_jp: "小さく動ける", display_name_cn: "小步行动型", short_label_jp: "小さな一歩", share_card_line_jp: "大きく変えず、小さく試すと動きやすい状態。" },
    { id: "C02_D", display_name_jp: "人にほどける", display_name_cn: "关系舒展型", short_label_jp: "つながり回復", share_card_line_jp: "人とのやわらかいつながりで戻りやすい状態。" },
    { id: "C02_E", display_name_jp: "距離を測り直す", display_name_cn: "距离重整型", short_label_jp: "距離調整", share_card_line_jp: "人との距離を少し測り直したい状態。" },
    { id: "C02_F", display_name_jp: "方向を探す", display_name_cn: "方向寻找型", short_label_jp: "方向確認", share_card_line_jp: "正解よりも、自分に合う方向を探している状態。" },
    { id: "C02_G", display_name_jp: "余白で戻る", display_name_cn: "余白恢复型", short_label_jp: "余白回復", share_card_line_jp: "深く考えすぎず、軽い余白で戻りやすい状態。" },
    { id: "C02_H", display_name_jp: "深く知りたい", display_name_cn: "深度理解型", short_label_jp: "深掘り準備", share_card_line_jp: "今の自分を、もう少し深く見てもよさそうな状態。" }
  ],

  result_assignment_rules: {
    C02_A: {
      display_name_jp: "そっと整える",
      primary_trigger_dimensions: ["recovery_need", "rhythm_reset_need"],
      secondary_trigger_dimensions: ["pace_sensitivity", "emotional_sensitivity"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not say user needs treatment, rest cure, or medical recovery."
    },
    C02_B: {
      display_name_jp: "内側を見たい",
      primary_trigger_dimensions: ["reflection_need", "emotional_clarity"],
      secondary_trigger_dimensions: ["core_need_signal", "inner_temperature"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not say user is withdrawn, closed, or psychologically unstable."
    },
    C02_C: {
      display_name_jp: "小さく動ける",
      primary_trigger_dimensions: ["action_energy", "next_step_readiness"],
      secondary_trigger_dimensions: ["change_readiness", "recommendation_intent"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not instruct user to make major decisions."
    },
    C02_D: {
      display_name_jp: "人にほどける",
      primary_trigger_dimensions: ["connection_need", "reassurance_need"],
      secondary_trigger_dimensions: ["light_support_need", "relationship_focus"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_A",
      forbidden_interpretation: "Do not say user depends on others or needs relationship intervention."
    },
    C02_E: {
      display_name_jp: "距離を測り直す",
      primary_trigger_dimensions: ["boundary_need", "autonomy_need"],
      secondary_trigger_dimensions: ["relationship_focus", "emotional_clarity"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not advise cutting ties, ending relationships, or confronting someone."
    },
    C02_F: {
      display_name_jp: "方向を探す",
      primary_trigger_dimensions: ["decision_style", "core_need_signal"],
      secondary_trigger_dimensions: ["emotional_clarity", "next_step_readiness"],
      confidence_requirement: "low_or_medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not say user is lost, indecisive, or lacking direction."
    },
    C02_G: {
      display_name_jp: "余白で戻る",
      primary_trigger_dimensions: ["lightness_need", "oracle_return_intent"],
      secondary_trigger_dimensions: ["recovery_need", "light_support_need"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_A",
      forbidden_interpretation: "Do not frame oracle/asobi as prediction or fate."
    },
    C02_H: {
      display_name_jp: "深く知りたい",
      primary_trigger_dimensions: ["core_depth_intent", "reflection_need"],
      secondary_trigger_dimensions: ["core_need_signal", "emotional_clarity"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not pressure user into 120問 or paid report."
    }
  },

  free_result_config: {
    order: ["score", "type", "visible_tendency_1", "visible_tendency_2", "friction_1", "small_question", "core_cta", "next_test_recommendation", "share_card"],
    score_label_jp: "今の状態参考スコア",
    share_cta_jp: "今のわたしタイプをシェアする",
    core_bridge_copy_jp: "このチェックは、今の状態を見る入口です。もっと深く自分の Life-State を見たい場合は、120問ライフステート診断へ進めます。"
  },

  paid_teaser_config: {
    report_name_jp: "今のわたし深掘りレポート",
    promise_jp: "今のあなたの状態、内側の温度、人との距離、動き出しやすい条件、戻りやすい方法を整理します。",
    forbidden_copy: [
      "今すぐ見ないと悪化します",
      "あなたは危険な状態です",
      "この結果は専門的な心理診断です",
      "この通りに行動してください",
      "これで人生が変わります",
      "あなたの本当の性格が分かります"
    ]
  },

  share_card_config: {
    versions: {
      type_focus: {
        card_title_jp: "今のわたしチェック",
        visible_fields: ["type_label", "safe_one_line", "qr_or_link"],
        forbidden_fields: ["private_answers", "emotional_vulnerability", "reassurance_need", "relationship_friction", "paid_report_content"]
      },
      soft_score_focus: {
        card_title_jp: "今の状態参考スコア",
        visible_fields: ["score", "type_label", "one_safe_strength"],
        forbidden_fields: ["diagnosis_implication", "weakness", "clinical_labels", "anxiety_language"]
      },
      core_bridge_focus: {
        card_title_jp: "今のわたしから、深い自分へ",
        visible_fields: ["type", "core_bridge_line", "cta"],
        forbidden_fields: ["pressure", "urgency", "fake_authority", "paid_only_framing"]
      }
    }
  },

  consent_copy: {
    boundary_jp: "このチェックは医療・心理診断ではありません。今の状態を整理するための参考です。",
    save_copy_jp: "結果を保存する場合は、保存範囲を確認してください。",
    reminder_opt_in_jp: "リマインドは希望した場合のみ受け取れます。"
  },

  recommendation_mapping: [
    { recommendation_type: "120問ライフステート診断", trigger_condition: "core_depth_intent high or C02_H assigned", reason_copy_jp: "今の状態を、もっと深い Life-State として見てみませんか。", commercial_status: "free / core / later report bridge", disclosure_needed: false },
    { recommendation_type: "R01 ふたり恋愛相性診断", trigger_condition: "relationship_focus high", reason_copy_jp: "今の状態に大切な人との距離が関係していそうなら、ふたりのリズムも見られます。", commercial_status: "free / paid report bridge", disclosure_needed: false },
    { recommendation_type: "F01 向いている働き方診断", trigger_condition: "work_focus high", reason_copy_jp: "仕事や役割が今の状態に影響していそうなら、働き方のリズムも見てみませんか。", commercial_status: "free / paid report bridge", disclosure_needed: false },
    { recommendation_type: "S01 今日のおみくじ", trigger_condition: "lightness_need or oracle_return_intent high", reason_copy_jp: "深く考えすぎず、今日の小さなヒントを見てみるのも合いそうです。", commercial_status: "free / recurring", disclosure_needed: false },
    { recommendation_type: "今のわたし深掘りレポート", trigger_condition: "paid report CTA click", reason_copy_jp: "今の状態を、もう少し丁寧に整理できます。", commercial_status: "paid report", disclosure_needed: true }
  ],

  line_web_return_path: {
    save_after_completion: {
      copy_jp: "結果を保存する",
      rule: "Do not claim account/cloud save unless actually available."
    },
    three_day_follow_up: {
      opt_in_required: true,
      copy_jp: "この前の「今のわたし」から、少し変わった感じはありますか？"
    },
    seven_day_follow_up: {
      opt_in_required: true,
      copy_jp: "今週のあなたは、整える・動く・話す・休むのどれが近そうですか？"
    },
    thirty_day_follow_up: {
      opt_in_required: true,
      copy_jp: "前回の状態から少し時間が経ちました。今のわたしをもう一度見てみますか？"
    },
    disturbance_prevention: [
      "Default reminders off.",
      "Separate opt-in required.",
      "No crisis language.",
      "No fake urgency."
    ]
  },

  ux_notes: {
    mobile_first_flow: "One question per screen or compact stacked cards.",
    progress_behavior: "Show section title and 1/36 progress.",
    section_break_behavior: "Show section break copy after every 9 questions.",
    result_reveal_behavior: "Show type first, then two tendencies, one friction, one small question.",
    paid_report_preview: "Explain concrete additions without fear or diagnosis.",
    share_behavior: "Only share public-safe type and one-line description.",
    retake_behavior: "Recommend 2-4 week retake or when state changes.",
    core_bridge: "Always include 120問 Life-State CTA.",
    recommendation_rule: "Show only one additional test recommendation based on strongest signal.",
    anti_supermarket_rule: "Never show all categories at once from C02 result page."
  },

  risk_notes: [
    "No medical or psychological diagnosis.",
    "No symptom screening.",
    "No treatment advice.",
    "No crisis implication.",
    "No deterministic identity label.",
    "No future prediction.",
    "No relationship outcome judgment.",
    "No career decision advice.",
    "No private vulnerability in share cards.",
    "No fake urgency, scarcity, authority, or accuracy claim.",
    "LINE/Web reminders require separate opt-in."
  ]
};
```

## 17. Final Status

output_status: md_review_file_created
file_name: C02_ima_no_watashi_check_v1_0.md
founder_review_needed: yes
trust_risk_review_needed: yes
codex_needed: no
codex_ready: false
next_recommended_action: founder_and_trust_risk_review_before_next_test_md
