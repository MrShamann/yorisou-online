---

file_id: F01_muiteiru_hatarakikata_shindan_v1_0
test_id: F01
test_name_jp: 向いている働き方診断
test_name_cn: 适合的工作方式诊断
version: v1.0
status: draft_test_spec
layer: Yorisou Fit / Work
codex_ready: false
founder_review_needed: true
trust_risk_review_needed: true
created_for: Yorisou Test Product System
----------------------------------------

# F01 向いている働き方診断 v1.0

## 0. File Status

This file is a review-ready Markdown specification for Founder review, trust-risk review, and later possible Codex handoff package creation.

This is not a Codex instruction.
This is not a site integration file.
This is not a backend, auth, payment, database, or LINE webhook implementation request.
This test is not live.

## 1. Test Product Summary

| field                    | value                                |
| ------------------------ | ------------------------------------ |
| test_id                  | F01                                  |
| test_name_jp             | 向いている働き方診断                           |
| test_name_cn             | 适合的工作方式诊断                            |
| version                  | v1.0                                 |
| layer                    | Yorisou Fit / Work                   |
| commercial_role          | 工作方式深度报告、职业节奏报告、推荐信号、Yorisou Core 导流 |
| target_user              | 工作中迷茫、疲惫、想换节奏、想理解自己适合怎样工作方式的用户       |
| expected_completion_time | 约 12–18 分钟                           |
| question_count           | 60                                   |
| section_count            | 6                                    |
| questions_per_section    | 10                                   |
| output_status            | draft_test_spec                      |
| codex_ready              | false                                |

### Business Questions Answered

1. 用户为什么会点？
   因为“我是不是不适合现在这种工作方式？”是强现实痛点。

2. 用户为什么会做完？
   60 题带来认真感，分 section 的节奏让用户觉得结果有可信度。

3. 用户为什么会相信？
   测试不判断职业，而是读取能量、协作、反馈、节奏、压力反应和环境适配。

4. 用户为什么会分享？
   免费结果可用“工作方式类型 + 安全一句话”分享，不暴露压力和脆弱点。

5. 用户为什么会回来？
   工作状态会随岗位、团队、项目、季节变化，适合 30–90 天复测。

6. 能卖什么报告？
   「働き方リズム深掘りレポート」「職業リズムレポート」「仕事環境フィットレポート」。

7. 能推荐什么？
   Core 主测试、职场环境测试 F02、恢复方式测试、学习方式测试、工作沟通内容、工具/书/课程方向。

8. 能留下什么 Recommendation Graph / Demand Signal？
   工作节奏、反馈需求、自由度需求、压力反应、协作偏好、环境敏感度、成长动机。

9. 如何导流到 Yorisou Core？
   结果页提示“工作方式背后也和今の状態有关”，导向 C02 或 120 题主测试。

10. 如何避免变成测试超市？
    结果页只推荐 1–2 个下一步：Core anchor + one relevant work follow-up.

## 2. Landing Page Copy

### Landing Headline

あなたに合う働き方は、どんなリズム？

### Landing Subheadline

集中しやすい環境、力が出るペース、人との関わり方、安心できるフィードバック。
60問で、あなたが力を出しやすい「働き方の型」を見ていきます。

### Trust Note

これは職業を決める診断ではありません。
あなたに合いやすい働き方・環境・ペースを知るための参考チェックです。

### Time / Question Count Note

全60問・約12〜18分。
6つのセクションで、仕事のエネルギー、集中、協働、評価、ストレス、成長環境を見ていきます。

### Primary CTA

自分に合う働き方を見る

### Secondary CTA

まず今の状態チェックを見る

### Privacy / Boundary Short Note

回答はあなたの働き方傾向を見るために使われます。
この診断は、転職・退職・職業選択を決めるものではありません。

## 3. Consent / Privacy / Boundary Notes

* This test does not recommend a specific job title.
* This test does not tell users to quit, stay, change jobs, start a business, or choose a company.
* This test does not predict income, success, promotion, or future career outcome.
* This test does not diagnose burnout, depression, ADHD, anxiety, or any medical/psychological condition.
* Share cards must not expose stress, vulnerability, low confidence, or workplace conflict details.
* Recommendations must be framed as “worth comparing,” “may fit,” or “direction to explore.”
* If LINE/Web save or reminder is offered, it requires separate consent.

## 4. Section Structure

### Section A：エネルギーの出どころ

Focus: what gives the user energy at work.

section_break_copy_jp:
ここまでで、あなたが仕事で力を出しやすい「エネルギーの出どころ」が少し見えてきました。次は、集中しやすいペースを見ていきます。

section_break_copy_cn:
到这里，你在工作中更容易产生能量的来源已经开始显现。接下来会看你的集中方式和节奏。

UX purpose:
Help users feel seen early and motivate completion.

### Section B：集中とペース

Focus: concentration, pacing, schedule rhythm.

section_break_copy_jp:
あなたの集中しやすいリズムが見えてきました。次は、人との働き方を見ていきます。

section_break_copy_cn:
你的集中节奏正在显现。接下来会看你和别人一起工作的方式。

UX purpose:
Shift from individual work rhythm to collaboration.

### Section C：人との働き方

Focus: collaboration, communication, role preference.

section_break_copy_jp:
人との関わり方や、力を出しやすいチームの形が見えてきました。次は、評価やフィードバックとの相性を見ていきます。

section_break_copy_cn:
你与他人协作时更容易发挥的方式正在显现。接下来会看你和评价、反馈的关系。

UX purpose:
Prepare user for feedback and psychological safety questions without clinical framing.

### Section D：評価・フィードバック・安心感

Focus: feedback needs, recognition, clarity, psychological safety.

section_break_copy_jp:
あなたが安心して力を出すために必要な feedback の形が見えてきました。次は、ストレスと回復のパターンを見ていきます。

section_break_copy_cn:
你为了安心发挥所需要的反馈形式正在显现。接下来会看压力和恢复模式。

UX purpose:
Frame feedback needs as work-style fit, not weakness.

### Section E：ストレスと回復

Focus: stress response, recovery, overload signals.

section_break_copy_jp:
負荷が高い時の反応と、戻りやすい方法が見えてきました。最後に、成長・自由度・環境フィットを見ていきます。

section_break_copy_cn:
负荷高时的反应和恢复方式正在显现。最后会看成长、自由度和环境适配。

UX purpose:
Keep stress non-clinical and work-contextual.

### Section F：成長・自由度・環境フィット

Focus: growth motivation, autonomy, environment fit, execution.

section_break_copy_jp:
回答ありがとうございます。結果では、あなたが力を出しやすい働き方と、比較してみるとよい環境の方向を整理します。

section_break_copy_cn:
感谢回答。结果会整理你更容易发挥的工作方式，以及值得比较的环境方向。

UX purpose:
Transition to results while avoiding career-decision language.

## 5. Human-Readable Question Set

### Section A：エネルギーの出どころ

### F01_Q01

* section: A
* question_type: scale
* prompt_jp: 新しい仕事に入る時、まず全体像をつかめると動きやすい。
* prompt_cn: 开始一项新工作时，如果先掌握整体图景，我会更容易行动。
* primary_dimension: structure_need
* secondary_dimension: execution_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; work-start preference only.
* interpretation_boundary: Interpret as work-start style, not ability or intelligence.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                   |
| --- | --------- | -------- | ------------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | structure_need, execution_style | { structure_need: 5, execution_style: 4 } |
| B   | やや近い      | 比较符合     | structure_need, execution_style | { structure_need: 4, execution_style: 3 } |
| C   | どちらともいえない | 说不清      | structure_need                  | { structure_need: 3 }                     |
| D   | あまり近くない   | 不太符合     | autonomy_need, action_start     | { structure_need: 2, autonomy_need: 3 }   |
| E   | まったく近くない  | 完全不符合    | autonomy_need, action_start     | { structure_need: 1, autonomy_need: 4 }   |

### F01_Q02

* section: A
* question_type: scale
* prompt_jp: 人と話しながら考えると、仕事のアイデアが出やすい。
* prompt_cn: 边和别人讨论边思考时，我更容易产生工作想法。
* primary_dimension: collaboration_style
* secondary_dimension: energy_source
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; idea-generation style only.
* interpretation_boundary: Interpret as collaboration preference, not extroversion judgment.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | collaboration_style, energy_source | { collaboration_style: 5, energy_source: 5 } |
| B   | やや近い      | 比较符合     | collaboration_style, energy_source | { collaboration_style: 4, energy_source: 4 } |
| C   | どちらともいえない | 说不清      | collaboration_style                | { collaboration_style: 3 }                   |
| D   | あまり近くない   | 不太符合     | focus_style, autonomy_need         | { collaboration_style: 2, focus_style: 4 }   |
| E   | まったく近くない  | 完全不符合    | focus_style, autonomy_need         | { collaboration_style: 1, focus_style: 5 }   |

### F01_Q03

* section: A
* question_type: scale
* prompt_jp: ひとりで深く考える時間があると、仕事の質が上がりやすい。
* prompt_cn: 有独自深入思考的时间时，我的工作质量更容易提高。
* primary_dimension: focus_style
* secondary_dimension: autonomy_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; concentration style only.
* interpretation_boundary: Interpret as focus condition, not social preference judgment.

#### Options

| key | label_jp  | label_cn | score_tags                 | weights                                    |
| --- | --------- | -------- | -------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | focus_style, autonomy_need | { focus_style: 5, autonomy_need: 4 }       |
| B   | やや近い      | 比较符合     | focus_style, autonomy_need | { focus_style: 4, autonomy_need: 3 }       |
| C   | どちらともいえない | 说不清      | focus_style                | { focus_style: 3 }                         |
| D   | あまり近くない   | 不太符合     | collaboration_style        | { focus_style: 2, collaboration_style: 3 } |
| E   | まったく近くない  | 完全不符合    | collaboration_style        | { focus_style: 1, collaboration_style: 4 } |

### F01_Q04

* section: A
* question_type: scale
* prompt_jp: 誰かの役に立っている実感があると、仕事のやる気が出やすい。
* prompt_cn: 感到自己对别人有帮助时，我更容易产生工作动力。
* primary_dimension: contribution_drive
* secondary_dimension: feedback_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; motivation source only.
* interpretation_boundary: Interpret as contribution motivation, not self-worth.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | contribution_drive, feedback_need | { contribution_drive: 5, feedback_need: 4 } |
| B   | やや近い      | 比较符合     | contribution_drive, feedback_need | { contribution_drive: 4, feedback_need: 3 } |
| C   | どちらともいえない | 说不清      | contribution_drive                | { contribution_drive: 3 }                   |
| D   | あまり近くない   | 不太符合     | autonomy_need                     | { contribution_drive: 2, autonomy_need: 3 } |
| E   | まったく近くない  | 完全不符合    | autonomy_need                     | { contribution_drive: 1, autonomy_need: 4 } |

### F01_Q05

* section: A
* question_type: scale
* prompt_jp: 難しい課題ほど、自分の力を試せる感じがして燃えやすい。
* prompt_cn: 任务越难，我越容易觉得能测试自己的能力而更有动力。
* primary_dimension: growth_motivation
* secondary_dimension: stress_response
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; challenge motivation only.
* interpretation_boundary: Interpret as challenge preference, not performance promise.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | growth_motivation, stress_response | { growth_motivation: 5, stress_response: 4 } |
| B   | やや近い      | 比较符合     | growth_motivation, stress_response | { growth_motivation: 4, stress_response: 3 } |
| C   | どちらともいえない | 说不清      | growth_motivation                  | { growth_motivation: 3 }                     |
| D   | あまり近くない   | 不太符合     | stability_need                     | { growth_motivation: 2, stability_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | stability_need                     | { growth_motivation: 1, stability_need: 4 }  |

### F01_Q06

* section: A
* question_type: scale
* prompt_jp: 決まった役割がある方が、安心して力を出しやすい。
* prompt_cn: 有明确角色时，我更容易安心发挥。
* primary_dimension: structure_need
* secondary_dimension: stability_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; role clarity preference only.
* interpretation_boundary: Interpret as role clarity need, not lack of flexibility.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                  |
| --- | --------- | -------- | -------------------------------- | ---------------------------------------- |
| A   | とても近い     | 非常符合     | structure_need, stability_need   | { structure_need: 5, stability_need: 5 } |
| B   | やや近い      | 比较符合     | structure_need, stability_need   | { structure_need: 4, stability_need: 4 } |
| C   | どちらともいえない | 说不清      | structure_need                   | { structure_need: 3 }                    |
| D   | あまり近くない   | 不太符合     | autonomy_need, growth_motivation | { structure_need: 2, autonomy_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | autonomy_need, growth_motivation | { structure_need: 1, autonomy_need: 4 }  |

### F01_Q07

* section: A
* question_type: scale
* prompt_jp: 自分で工夫できる余白があると、仕事に前向きになりやすい。
* prompt_cn: 有可以自己发挥和调整的空间时，我更容易对工作积极。
* primary_dimension: autonomy_need
* secondary_dimension: growth_motivation
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; autonomy preference only.
* interpretation_boundary: Interpret as need for discretion, not rejection of rules.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                    |
| --- | --------- | -------- | -------------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | autonomy_need, growth_motivation | { autonomy_need: 5, growth_motivation: 4 } |
| B   | やや近い      | 比较符合     | autonomy_need, growth_motivation | { autonomy_need: 4, growth_motivation: 3 } |
| C   | どちらともいえない | 说不清      | autonomy_need                    | { autonomy_need: 3 }                       |
| D   | あまり近くない   | 不太符合     | structure_need                   | { autonomy_need: 2, structure_need: 3 }    |
| E   | まったく近くない  | 完全不符合    | structure_need                   | { autonomy_need: 1, structure_need: 4 }    |

### F01_Q08

* section: A
* question_type: scale
* prompt_jp: 目の前の作業に集中して、ひとつずつ終わらせる時に力が出やすい。
* prompt_cn: 专注眼前任务并逐个完成时，我更容易发挥。
* primary_dimension: execution_style
* secondary_dimension: focus_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; execution style only.
* interpretation_boundary: Interpret as task execution preference, not speed or ability.

#### Options

| key | label_jp  | label_cn | score_tags                   | weights                                   |
| --- | --------- | -------- | ---------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | execution_style, focus_style | { execution_style: 5, focus_style: 4 }    |
| B   | やや近い      | 比较符合     | execution_style, focus_style | { execution_style: 4, focus_style: 3 }    |
| C   | どちらともいえない | 说不清      | execution_style              | { execution_style: 3 }                    |
| D   | あまり近くない   | 不太符合     | ideation_style               | { execution_style: 2, ideation_style: 3 } |
| E   | まったく近くない  | 完全不符合    | ideation_style               | { execution_style: 1, ideation_style: 4 } |

### F01_Q09

* section: A
* question_type: scale
* prompt_jp: 新しい可能性を考える時間があると、仕事への熱量が上がりやすい。
* prompt_cn: 有时间思考新可能性时，我对工作的热情更容易提升。
* primary_dimension: ideation_style
* secondary_dimension: growth_motivation
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; ideation preference only.
* interpretation_boundary: Interpret as idea energy, not entrepreneurship fit.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | ideation_style, growth_motivation | { ideation_style: 5, growth_motivation: 4 } |
| B   | やや近い      | 比较符合     | ideation_style, growth_motivation | { ideation_style: 4, growth_motivation: 3 } |
| C   | どちらともいえない | 说不清      | ideation_style                    | { ideation_style: 3 }                       |
| D   | あまり近くない   | 不太符合     | execution_style                   | { ideation_style: 2, execution_style: 3 }   |
| E   | まったく近くない  | 完全不符合    | execution_style                   | { ideation_style: 1, execution_style: 4 }   |

### F01_Q10

* section: A
* question_type: scale
* prompt_jp: 仕事の意味や目的が見えると、多少大変でも続けやすい。
* prompt_cn: 如果能看见工作的意义或目的，即使辛苦也更容易坚持。
* primary_dimension: purpose_drive
* secondary_dimension: stress_response
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; purpose motivation only.
* interpretation_boundary: Interpret as purpose-driven motivation, not moral value.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                  |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------- |
| A   | とても近い     | 非常符合     | purpose_drive, stress_response | { purpose_drive: 5, stress_response: 4 } |
| B   | やや近い      | 比较符合     | purpose_drive, stress_response | { purpose_drive: 4, stress_response: 3 } |
| C   | どちらともいえない | 说不清      | purpose_drive                  | { purpose_drive: 3 }                     |
| D   | あまり近くない   | 不太符合     | stability_need                 | { purpose_drive: 2, stability_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | stability_need                 | { purpose_drive: 1, stability_need: 4 }  |

### Section B：集中とペース

### F01_Q11

* section: B
* question_type: scale
* prompt_jp: まとまった時間がないと、深い仕事に入りにくい。
* prompt_cn: 如果没有整块时间，我很难进入深度工作。
* primary_dimension: focus_style
* secondary_dimension: pace_stability
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; focus condition only.
* interpretation_boundary: Interpret as concentration condition, not productivity diagnosis.

#### Options

| key | label_jp  | label_cn | score_tags                  | weights                                    |
| --- | --------- | -------- | --------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | focus_style, pace_stability | { focus_style: 5, pace_stability: 4 }      |
| B   | やや近い      | 比较符合     | focus_style, pace_stability | { focus_style: 4, pace_stability: 3 }      |
| C   | どちらともいえない | 说不清      | focus_style                 | { focus_style: 3 }                         |
| D   | あまり近くない   | 不太符合     | switching_tolerance         | { focus_style: 2, switching_tolerance: 3 } |
| E   | まったく近くない  | 完全不符合    | switching_tolerance         | { focus_style: 1, switching_tolerance: 4 } |

### F01_Q12

* section: B
* question_type: scale
* prompt_jp: 複数のタスクを切り替えながら進める方が、気分が乗りやすい。
* prompt_cn: 在多个任务之间切换推进时，我更容易进入状态。
* primary_dimension: switching_tolerance
* secondary_dimension: ideation_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; task-switching preference only.
* interpretation_boundary: Interpret as switching comfort, not attention ability.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | switching_tolerance, ideation_style | { switching_tolerance: 5, ideation_style: 4 } |
| B   | やや近い      | 比较符合     | switching_tolerance, ideation_style | { switching_tolerance: 4, ideation_style: 3 } |
| C   | どちらともいえない | 说不清      | switching_tolerance                 | { switching_tolerance: 3 }                    |
| D   | あまり近くない   | 不太符合     | focus_style                         | { switching_tolerance: 2, focus_style: 3 }    |
| E   | まったく近くない  | 完全不符合    | focus_style                         | { switching_tolerance: 1, focus_style: 4 }    |

### F01_Q13

* section: B
* question_type: scale
* prompt_jp: 締切が近い方が、集中力が一気に上がりやすい。
* prompt_cn: 截止日期临近时，我的集中力更容易一下子提高。
* primary_dimension: pressure_activation
* secondary_dimension: stress_response
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; deadline response only.
* interpretation_boundary: Interpret as pressure activation, not chronic stress pattern.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | pressure_activation, stress_response | { pressure_activation: 5, stress_response: 4 } |
| B   | やや近い      | 比较符合     | pressure_activation, stress_response | { pressure_activation: 4, stress_response: 3 } |
| C   | どちらともいえない | 说不清      | pressure_activation                  | { pressure_activation: 3 }                     |
| D   | あまり近くない   | 不太符合     | pace_stability                       | { pressure_activation: 2, pace_stability: 3 }  |
| E   | まったく近くない  | 完全不符合    | pace_stability                       | { pressure_activation: 1, pace_stability: 4 }  |

### F01_Q14

* section: B
* question_type: scale
* prompt_jp: 毎日少しずつ積み上げる方が、安定して成果を出しやすい。
* prompt_cn: 每天一点点积累时，我更容易稳定产出成果。
* primary_dimension: pace_stability
* secondary_dimension: execution_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; pace preference only.
* interpretation_boundary: Interpret as work rhythm, not discipline level.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                       |
| --- | --------- | -------- | ------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | pace_stability, execution_style | { pace_stability: 5, execution_style: 4 }     |
| B   | やや近い      | 比较符合     | pace_stability, execution_style | { pace_stability: 4, execution_style: 3 }     |
| C   | どちらともいえない | 说不清      | pace_stability                  | { pace_stability: 3 }                         |
| D   | あまり近くない   | 不太符合     | pressure_activation             | { pace_stability: 2, pressure_activation: 3 } |
| E   | まったく近くない  | 完全不符合    | pressure_activation             | { pace_stability: 1, pressure_activation: 4 } |

### F01_Q15

* section: B
* question_type: scale
* prompt_jp: 作業の優先順位がはっきりしていると、迷わず進めやすい。
* prompt_cn: 工作优先级明确时，我更容易不迷茫地推进。
* primary_dimension: structure_need
* secondary_dimension: execution_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; prioritization preference only.
* interpretation_boundary: Interpret as need for clarity, not weakness.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                   |
| --- | --------- | -------- | ------------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | structure_need, execution_style | { structure_need: 5, execution_style: 5 } |
| B   | やや近い      | 比较符合     | structure_need, execution_style | { structure_need: 4, execution_style: 4 } |
| C   | どちらともいえない | 说不清      | structure_need                  | { structure_need: 3 }                     |
| D   | あまり近くない   | 不太符合     | autonomy_need                   | { structure_need: 2, autonomy_need: 3 }   |
| E   | まったく近くない  | 完全不符合    | autonomy_need                   | { structure_need: 1, autonomy_need: 4 }   |

### F01_Q16

* section: B
* question_type: scale
* prompt_jp: 予定が細かく決まりすぎていると、動きにくく感じる。
* prompt_cn: 安排过于细致时，我会觉得不容易行动。
* primary_dimension: autonomy_need
* secondary_dimension: structure_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; structure tolerance only.
* interpretation_boundary: Interpret as autonomy preference, not resistance to planning.

#### Options

| key | label_jp  | label_cn | score_tags                    | weights                                 |
| --- | --------- | -------- | ----------------------------- | --------------------------------------- |
| A   | とても近い     | 非常符合     | autonomy_need, structure_need | { autonomy_need: 5, structure_need: 1 } |
| B   | やや近い      | 比较符合     | autonomy_need, structure_need | { autonomy_need: 4, structure_need: 2 } |
| C   | どちらともいえない | 说不清      | autonomy_need                 | { autonomy_need: 3 }                    |
| D   | あまり近くない   | 不太符合     | structure_need                | { autonomy_need: 2, structure_need: 4 } |
| E   | まったく近くない  | 完全不符合    | structure_need                | { autonomy_need: 1, structure_need: 5 } |

### F01_Q17

* section: B
* question_type: scale
* prompt_jp: 朝・昼・夜で、仕事のしやすさにかなり差がある。
* prompt_cn: 早上、中午、晚上之间，我的工作状态差异很大。
* primary_dimension: pace_stability
* secondary_dimension: environment_sensitivity
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; rhythm sensitivity only.
* interpretation_boundary: Interpret as time-of-day fit, not health or sleep diagnosis.

#### Options

| key | label_jp  | label_cn | score_tags                              | weights                                           |
| --- | --------- | -------- | --------------------------------------- | ------------------------------------------------- |
| A   | とても近い     | 非常符合     | pace_stability, environment_sensitivity | { pace_stability: 5, environment_sensitivity: 4 } |
| B   | やや近い      | 比较符合     | pace_stability, environment_sensitivity | { pace_stability: 4, environment_sensitivity: 3 } |
| C   | どちらともいえない | 说不清      | pace_stability                          | { pace_stability: 3 }                             |
| D   | あまり近くない   | 不太符合     | stability_need                          | { pace_stability: 2, stability_need: 3 }          |
| E   | まったく近くない  | 完全不符合    | stability_need                          | { pace_stability: 1, stability_need: 4 }          |

### F01_Q18

* section: B
* question_type: scale
* prompt_jp: 仕事中に話しかけられることが多いと、集中が戻りにくい。
* prompt_cn: 工作中经常被打断时，我很难恢复集中。
* primary_dimension: focus_style
* secondary_dimension: environment_sensitivity
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; interruption sensitivity only.
* interpretation_boundary: Interpret as focus environment preference, not social ability.

#### Options

| key | label_jp  | label_cn | score_tags                               | weights                                        |
| --- | --------- | -------- | ---------------------------------------- | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | focus_style, environment_sensitivity     | { focus_style: 5, environment_sensitivity: 5 } |
| B   | やや近い      | 比较符合     | focus_style, environment_sensitivity     | { focus_style: 4, environment_sensitivity: 4 } |
| C   | どちらともいえない | 说不清      | focus_style                              | { focus_style: 3 }                             |
| D   | あまり近くない   | 不太符合     | switching_tolerance, collaboration_style | { focus_style: 2, switching_tolerance: 3 }     |
| E   | まったく近くない  | 完全不符合    | switching_tolerance, collaboration_style | { focus_style: 1, switching_tolerance: 4 }     |

### F01_Q19

* section: B
* question_type: scale
* prompt_jp: まず動いてみてから考える方が、仕事が前に進みやすい。
* prompt_cn: 先行动再思考时，我的工作更容易推进。
* primary_dimension: action_start
* secondary_dimension: autonomy_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; action style only.
* interpretation_boundary: Interpret as starting style, not recklessness.

#### Options

| key | label_jp  | label_cn | score_tags                  | weights                                |
| --- | --------- | -------- | --------------------------- | -------------------------------------- |
| A   | とても近い     | 非常符合     | action_start, autonomy_need | { action_start: 5, autonomy_need: 4 }  |
| B   | やや近い      | 比较符合     | action_start, autonomy_need | { action_start: 4, autonomy_need: 3 }  |
| C   | どちらともいえない | 说不清      | action_start                | { action_start: 3 }                    |
| D   | あまり近くない   | 不太符合     | structure_need              | { action_start: 2, structure_need: 3 } |
| E   | まったく近くない  | 完全不符合    | structure_need              | { action_start: 1, structure_need: 4 } |

### F01_Q20

* section: B
* question_type: scale
* prompt_jp: じっくり準備してから動く方が、安心して成果を出しやすい。
* prompt_cn: 充分准备之后再行动时，我更容易安心产出成果。
* primary_dimension: structure_need
* secondary_dimension: pace_stability
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; preparation style only.
* interpretation_boundary: Interpret as preparation preference, not slowness.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                  |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------- |
| A   | とても近い     | 非常符合     | structure_need, pace_stability | { structure_need: 5, pace_stability: 4 } |
| B   | やや近い      | 比较符合     | structure_need, pace_stability | { structure_need: 4, pace_stability: 3 } |
| C   | どちらともいえない | 说不清      | structure_need                 | { structure_need: 3 }                    |
| D   | あまり近くない   | 不太符合     | action_start                   | { structure_need: 2, action_start: 3 }   |
| E   | まったく近くない  | 完全不符合    | action_start                   | { structure_need: 1, action_start: 4 }   |

### Section C：人との働き方

### F01_Q21

* section: C
* question_type: scale
* prompt_jp: チームで相談しながら進める方が、安心して働きやすい。
* prompt_cn: 和团队商量着推进时，我更容易安心工作。
* primary_dimension: collaboration_style
* secondary_dimension: feedback_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; team preference only.
* interpretation_boundary: Interpret as collaboration fit, not dependence.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | collaboration_style, feedback_need | { collaboration_style: 5, feedback_need: 4 } |
| B   | やや近い      | 比较符合     | collaboration_style, feedback_need | { collaboration_style: 4, feedback_need: 3 } |
| C   | どちらともいえない | 说不清      | collaboration_style                | { collaboration_style: 3 }                   |
| D   | あまり近くない   | 不太符合     | autonomy_need, focus_style         | { collaboration_style: 2, autonomy_need: 3 } |
| E   | まったく近くない  | 完全不符合    | autonomy_need, focus_style         | { collaboration_style: 1, autonomy_need: 4 } |

### F01_Q22

* section: C
* question_type: scale
* prompt_jp: ひとりで任せてもらえる方が、責任感を持って進めやすい。
* prompt_cn: 被独立交付任务时，我更容易带着责任感推进。
* primary_dimension: autonomy_need
* secondary_dimension: execution_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; responsibility style only.
* interpretation_boundary: Interpret as autonomy fit, not rejection of teamwork.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                      |
| --- | --------- | -------- | ------------------------------ | -------------------------------------------- |
| A   | とても近い     | 非常符合     | autonomy_need, execution_style | { autonomy_need: 5, execution_style: 4 }     |
| B   | やや近い      | 比较符合     | autonomy_need, execution_style | { autonomy_need: 4, execution_style: 3 }     |
| C   | どちらともいえない | 说不清      | autonomy_need                  | { autonomy_need: 3 }                         |
| D   | あまり近くない   | 不太符合     | collaboration_style            | { autonomy_need: 2, collaboration_style: 3 } |
| E   | まったく近くない  | 完全不符合    | collaboration_style            | { autonomy_need: 1, collaboration_style: 4 } |

### F01_Q23

* section: C
* question_type: scale
* prompt_jp: 会議では、話しながら考えがまとまることが多い。
* prompt_cn: 在会议中，我常常边说边整理想法。
* primary_dimension: collaboration_style
* secondary_dimension: ideation_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; meeting style only.
* interpretation_boundary: Interpret as thinking style, not communication skill.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | collaboration_style, ideation_style | { collaboration_style: 5, ideation_style: 4 } |
| B   | やや近い      | 比较符合     | collaboration_style, ideation_style | { collaboration_style: 4, ideation_style: 3 } |
| C   | どちらともいえない | 说不清      | collaboration_style                 | { collaboration_style: 3 }                    |
| D   | あまり近くない   | 不太符合     | focus_style                         | { collaboration_style: 2, focus_style: 3 }    |
| E   | まったく近くない  | 完全不符合    | focus_style                         | { collaboration_style: 1, focus_style: 4 }    |

### F01_Q24

* section: C
* question_type: scale
* prompt_jp: 会議の前に考える時間がある方が、自分の意見を出しやすい。
* prompt_cn: 开会前有思考时间时，我更容易表达自己的意见。
* primary_dimension: focus_style
* secondary_dimension: structure_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; preparation preference only.
* interpretation_boundary: Interpret as meeting preparation fit, not confidence level.

#### Options

| key | label_jp  | label_cn | score_tags                  | weights                                    |
| --- | --------- | -------- | --------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | focus_style, structure_need | { focus_style: 5, structure_need: 4 }      |
| B   | やや近い      | 比较符合     | focus_style, structure_need | { focus_style: 4, structure_need: 3 }      |
| C   | どちらともいえない | 说不清      | focus_style                 | { focus_style: 3 }                         |
| D   | あまり近くない   | 不太符合     | collaboration_style         | { focus_style: 2, collaboration_style: 3 } |
| E   | まったく近くない  | 完全不符合    | collaboration_style         | { focus_style: 1, collaboration_style: 4 } |

### F01_Q25

* section: C
* question_type: scale
* prompt_jp: 誰が何を担当するかが曖昧だと、仕事が進めにくい。
* prompt_cn: 如果谁负责什么不明确，我会觉得工作难推进。
* primary_dimension: structure_need
* secondary_dimension: collaboration_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; role clarity preference only.
* interpretation_boundary: Interpret as collaboration clarity need, not rigidity.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | structure_need, collaboration_style | { structure_need: 5, collaboration_style: 4 } |
| B   | やや近い      | 比较符合     | structure_need, collaboration_style | { structure_need: 4, collaboration_style: 3 } |
| C   | どちらともいえない | 说不清      | structure_need                      | { structure_need: 3 }                         |
| D   | あまり近くない   | 不太符合     | autonomy_need                       | { structure_need: 2, autonomy_need: 3 }       |
| E   | まったく近くない  | 完全不符合    | autonomy_need                       | { structure_need: 1, autonomy_need: 4 }       |

### F01_Q26

* section: C
* question_type: scale
* prompt_jp: 人の間に立って調整する役割を任されることが多い。
* prompt_cn: 我经常被交付在不同人之间协调的角色。
* primary_dimension: collaboration_style
* secondary_dimension: repair_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; coordination pattern only.
* interpretation_boundary: Interpret as coordination tendency, not obligation to mediate.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | collaboration_style, repair_style | { collaboration_style: 5, repair_style: 4 } |
| B   | やや近い      | 比较符合     | collaboration_style, repair_style | { collaboration_style: 4, repair_style: 3 } |
| C   | どちらともいえない | 说不清      | collaboration_style               | { collaboration_style: 3 }                  |
| D   | あまり近くない   | 不太符合     | focus_style                       | { collaboration_style: 2, focus_style: 3 }  |
| E   | まったく近くない  | 完全不符合    | focus_style                       | { collaboration_style: 1, focus_style: 4 }  |

### F01_Q27

* section: C
* question_type: scale
* prompt_jp: 雑談や小さな会話がある職場の方が、働きやすい。
* prompt_cn: 有闲聊和小对话的职场，我更容易工作。
* primary_dimension: collaboration_style
* secondary_dimension: environment_sensitivity
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; social environment preference only.
* interpretation_boundary: Interpret as social environment fit, not personality type.

#### Options

| key | label_jp  | label_cn | score_tags                                   | weights                                                |
| --- | --------- | -------- | -------------------------------------------- | ------------------------------------------------------ |
| A   | とても近い     | 非常符合     | collaboration_style, environment_sensitivity | { collaboration_style: 5, environment_sensitivity: 4 } |
| B   | やや近い      | 比较符合     | collaboration_style, environment_sensitivity | { collaboration_style: 4, environment_sensitivity: 3 } |
| C   | どちらともいえない | 说不清      | collaboration_style                          | { collaboration_style: 3 }                             |
| D   | あまり近くない   | 不太符合     | focus_style                                  | { collaboration_style: 2, focus_style: 3 }             |
| E   | まったく近くない  | 完全不符合    | focus_style                                  | { collaboration_style: 1, focus_style: 4 }             |

### F01_Q28

* section: C
* question_type: scale
* prompt_jp: 静かで必要な時だけ話せる環境の方が、力を出しやすい。
* prompt_cn: 安静、只在必要时沟通的环境，更容易让我发挥。
* primary_dimension: focus_style
* secondary_dimension: environment_sensitivity
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; environment preference only.
* interpretation_boundary: Interpret as work environment preference, not anti-social tendency.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | focus_style, environment_sensitivity | { focus_style: 5, environment_sensitivity: 4 } |
| B   | やや近い      | 比较符合     | focus_style, environment_sensitivity | { focus_style: 4, environment_sensitivity: 3 } |
| C   | どちらともいえない | 说不清      | focus_style                          | { focus_style: 3 }                             |
| D   | あまり近くない   | 不太符合     | collaboration_style                  | { focus_style: 2, collaboration_style: 3 }     |
| E   | まったく近くない  | 完全不符合    | collaboration_style                  | { focus_style: 1, collaboration_style: 4 }     |

### F01_Q29

* section: C
* question_type: scale
* prompt_jp: チームの雰囲気が悪いと、自分のパフォーマンスにも影響しやすい。
* prompt_cn: 团队氛围不好时，我的表现也容易受影响。
* primary_dimension: environment_sensitivity
* secondary_dimension: collaboration_style
* sensitivity_level: medium
* public_private_note: aggregate only
* risk_note: Could touch workplace stress; keep non-diagnostic.
* interpretation_boundary: Interpret as environment sensitivity, not mental health or company judgment.

#### Options

| key | label_jp  | label_cn | score_tags                                   | weights                                                |
| --- | --------- | -------- | -------------------------------------------- | ------------------------------------------------------ |
| A   | とても近い     | 非常符合     | environment_sensitivity, collaboration_style | { environment_sensitivity: 5, collaboration_style: 4 } |
| B   | やや近い      | 比较符合     | environment_sensitivity, collaboration_style | { environment_sensitivity: 4, collaboration_style: 3 } |
| C   | どちらともいえない | 说不清      | environment_sensitivity                      | { environment_sensitivity: 3 }                         |
| D   | あまり近くない   | 不太符合     | autonomy_need                                | { environment_sensitivity: 2, autonomy_need: 3 }       |
| E   | まったく近くない  | 完全不符合    | autonomy_need                                | { environment_sensitivity: 1, autonomy_need: 4 }       |

### F01_Q30

* section: C
* question_type: scale
* prompt_jp: 相手の反応を見ながら進める仕事の方が、やりがいを感じやすい。
* prompt_cn: 能一边看对方反应一边推进的工作，更容易让我感到有意义。
* primary_dimension: feedback_need
* secondary_dimension: collaboration_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; feedback interaction preference only.
* interpretation_boundary: Interpret as interaction preference, not validation dependency.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | feedback_need, collaboration_style | { feedback_need: 5, collaboration_style: 4 } |
| B   | やや近い      | 比较符合     | feedback_need, collaboration_style | { feedback_need: 4, collaboration_style: 3 } |
| C   | どちらともいえない | 说不清      | feedback_need                      | { feedback_need: 3 }                         |
| D   | あまり近くない   | 不太符合     | autonomy_need                      | { feedback_need: 2, autonomy_need: 3 }       |
| E   | まったく近くない  | 完全不符合    | autonomy_need                      | { feedback_need: 1, autonomy_need: 4 }       |

### Section D：評価・フィードバック・安心感

### F01_Q31

* section: D
* question_type: scale
* prompt_jp: 良かった点を具体的に伝えてもらえると、次も頑張りやすい。
* prompt_cn: 如果对方具体告诉我做得好的地方，我下次更容易继续努力。
* primary_dimension: feedback_need
* secondary_dimension: reassurance_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; feedback style only.
* interpretation_boundary: Interpret as feedback preference, not self-esteem diagnosis.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                   |
| --- | --------- | -------- | ------------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | feedback_need, reassurance_need | { feedback_need: 5, reassurance_need: 4 } |
| B   | やや近い      | 比较符合     | feedback_need, reassurance_need | { feedback_need: 4, reassurance_need: 3 } |
| C   | どちらともいえない | 说不清      | feedback_need                   | { feedback_need: 3 }                      |
| D   | あまり近くない   | 不太符合     | autonomy_need                   | { feedback_need: 2, autonomy_need: 3 }    |
| E   | まったく近くない  | 完全不符合    | autonomy_need                   | { feedback_need: 1, autonomy_need: 4 }    |

### F01_Q32

* section: D
* question_type: scale
* prompt_jp: 細かく見られすぎると、自分らしく動きにくくなる。
* prompt_cn: 被看得太细时，我会难以按自己的方式行动。
* primary_dimension: autonomy_need
* secondary_dimension: feedback_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; supervision preference only.
* interpretation_boundary: Interpret as autonomy boundary, not resistance to feedback.

#### Options

| key | label_jp  | label_cn | score_tags                    | weights                                |
| --- | --------- | -------- | ----------------------------- | -------------------------------------- |
| A   | とても近い     | 非常符合     | autonomy_need, feedback_need  | { autonomy_need: 5, feedback_need: 1 } |
| B   | やや近い      | 比较符合     | autonomy_need, feedback_need  | { autonomy_need: 4, feedback_need: 2 } |
| C   | どちらともいえない | 说不清      | autonomy_need                 | { autonomy_need: 3 }                   |
| D   | あまり近くない   | 不太符合     | feedback_need, structure_need | { autonomy_need: 2, feedback_need: 4 } |
| E   | まったく近くない  | 完全不符合    | feedback_need, structure_need | { autonomy_need: 1, feedback_need: 5 } |

### F01_Q33

* section: D
* question_type: scale
* prompt_jp: 期待されている基準が見えると、安心して取り組める。
* prompt_cn: 如果能看见被期待的标准，我会更安心地投入。
* primary_dimension: structure_need
* secondary_dimension: feedback_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; expectation clarity only.
* interpretation_boundary: Interpret as clarity need, not insecurity.

#### Options

| key | label_jp  | label_cn | score_tags                    | weights                                 |
| --- | --------- | -------- | ----------------------------- | --------------------------------------- |
| A   | とても近い     | 非常符合     | structure_need, feedback_need | { structure_need: 5, feedback_need: 4 } |
| B   | やや近い      | 比较符合     | structure_need, feedback_need | { structure_need: 4, feedback_need: 3 } |
| C   | どちらともいえない | 说不清      | structure_need                | { structure_need: 3 }                   |
| D   | あまり近くない   | 不太符合     | autonomy_need                 | { structure_need: 2, autonomy_need: 3 } |
| E   | まったく近くない  | 完全不符合    | autonomy_need                 | { structure_need: 1, autonomy_need: 4 } |

### F01_Q34

* section: D
* question_type: scale
* prompt_jp: 結果だけでなく、過程も見てもらえると力が出やすい。
* prompt_cn: 不只结果，如果过程也被看见，我更容易发挥。
* primary_dimension: feedback_need
* secondary_dimension: contribution_drive
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; recognition style only.
* interpretation_boundary: Interpret as recognition preference, not need for praise.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | feedback_need, contribution_drive | { feedback_need: 5, contribution_drive: 4 } |
| B   | やや近い      | 比较符合     | feedback_need, contribution_drive | { feedback_need: 4, contribution_drive: 3 } |
| C   | どちらともいえない | 说不清      | feedback_need                     | { feedback_need: 3 }                        |
| D   | あまり近くない   | 不太符合     | autonomy_need                     | { feedback_need: 2, autonomy_need: 3 }      |
| E   | まったく近くない  | 完全不符合    | autonomy_need                     | { feedback_need: 1, autonomy_need: 4 }      |

### F01_Q35

* section: D
* question_type: scale
* prompt_jp: 厳しい指摘でも、改善点が具体的なら受け止めやすい。
* prompt_cn: 即使是严格指出，如果改善点具体，我也比较容易接受。
* primary_dimension: feedback_need
* secondary_dimension: growth_motivation
* sensitivity_level: medium
* public_private_note: aggregate only
* risk_note: Feedback sensitivity; avoid harsh evaluation framing.
* interpretation_boundary: Interpret as actionable feedback preference, not toughness.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                    |
| --- | --------- | -------- | -------------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | feedback_need, growth_motivation | { feedback_need: 5, growth_motivation: 4 } |
| B   | やや近い      | 比较符合     | feedback_need, growth_motivation | { feedback_need: 4, growth_motivation: 3 } |
| C   | どちらともいえない | 说不清      | feedback_need                    | { feedback_need: 3 }                       |
| D   | あまり近くない   | 不太符合     | reassurance_need                 | { feedback_need: 2, reassurance_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | reassurance_need                 | { feedback_need: 1, reassurance_need: 4 }  |

### F01_Q36

* section: D
* question_type: scale
* prompt_jp: 自分の判断を信じて任せてもらえると、やる気が出やすい。
* prompt_cn: 当对方信任我的判断并交给我时，我更容易有动力。
* primary_dimension: autonomy_need
* secondary_dimension: feedback_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; trust preference only.
* interpretation_boundary: Interpret as autonomy support, not dislike of management.

#### Options

| key | label_jp  | label_cn | score_tags                   | weights                                 |
| --- | --------- | -------- | ---------------------------- | --------------------------------------- |
| A   | とても近い     | 非常符合     | autonomy_need, feedback_need | { autonomy_need: 5, feedback_need: 3 }  |
| B   | やや近い      | 比较符合     | autonomy_need, feedback_need | { autonomy_need: 4, feedback_need: 3 }  |
| C   | どちらともいえない | 说不清      | autonomy_need                | { autonomy_need: 3 }                    |
| D   | あまり近くない   | 不太符合     | structure_need               | { autonomy_need: 2, structure_need: 3 } |
| E   | まったく近くない  | 完全不符合    | structure_need               | { autonomy_need: 1, structure_need: 4 } |

### F01_Q37

* section: D
* question_type: scale
* prompt_jp: ほめられるより、次にどう良くするかを知りたい。
* prompt_cn: 比起被表扬，我更想知道下一步如何做得更好。
* primary_dimension: growth_motivation
* secondary_dimension: feedback_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; growth feedback preference only.
* interpretation_boundary: Interpret as improvement orientation, not dissatisfaction.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                       |
| --- | --------- | -------- | -------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | growth_motivation, feedback_need | { growth_motivation: 5, feedback_need: 4 }    |
| B   | やや近い      | 比较符合     | growth_motivation, feedback_need | { growth_motivation: 4, feedback_need: 3 }    |
| C   | どちらともいえない | 说不清      | growth_motivation                | { growth_motivation: 3 }                      |
| D   | あまり近くない   | 不太符合     | reassurance_need                 | { growth_motivation: 2, reassurance_need: 3 } |
| E   | まったく近くない  | 完全不符合    | reassurance_need                 | { growth_motivation: 1, reassurance_need: 4 } |

### F01_Q38

* section: D
* question_type: scale
* prompt_jp: 何も反応がない状態が続くと、進め方が合っているか不安になりやすい。
* prompt_cn: 如果一直没有反馈，我容易不安自己推进方式是否正确。
* primary_dimension: feedback_need
* secondary_dimension: reassurance_need
* sensitivity_level: medium
* public_private_note: aggregate only
* risk_note: May surface work reassurance need.
* interpretation_boundary: Interpret as feedback cadence need, not anxiety diagnosis.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                   |
| --- | --------- | -------- | ------------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | feedback_need, reassurance_need | { feedback_need: 5, reassurance_need: 5 } |
| B   | やや近い      | 比较符合     | feedback_need, reassurance_need | { feedback_need: 4, reassurance_need: 4 } |
| C   | どちらともいえない | 说不清      | feedback_need                   | { feedback_need: 3 }                      |
| D   | あまり近くない   | 不太符合     | autonomy_need                   | { feedback_need: 2, autonomy_need: 3 }    |
| E   | まったく近くない  | 完全不符合    | autonomy_need                   | { feedback_need: 1, autonomy_need: 4 }    |

### F01_Q39

* section: D
* question_type: scale
* prompt_jp: 数字や成果が見えると、自分の成長を感じやすい。
* prompt_cn: 能看到数字或成果时，我更容易感到自己的成长。
* primary_dimension: feedback_need
* secondary_dimension: growth_motivation
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; progress signal preference only.
* interpretation_boundary: Interpret as measurable feedback preference, not income or success prediction.

#### Options

| key | label_jp  | label_cn | score_tags                       | weights                                    |
| --- | --------- | -------- | -------------------------------- | ------------------------------------------ |
| A   | とても近い     | 非常符合     | feedback_need, growth_motivation | { feedback_need: 5, growth_motivation: 4 } |
| B   | やや近い      | 比较符合     | feedback_need, growth_motivation | { feedback_need: 4, growth_motivation: 3 } |
| C   | どちらともいえない | 说不清      | feedback_need                    | { feedback_need: 3 }                       |
| D   | あまり近くない   | 不太符合     | purpose_drive                    | { feedback_need: 2, purpose_drive: 3 }     |
| E   | まったく近くない  | 完全不符合    | purpose_drive                    | { feedback_need: 1, purpose_drive: 4 }     |

### F01_Q40

* section: D
* question_type: scale
* prompt_jp: 自分の仕事が誰に届いているか見えると、続けやすい。
* prompt_cn: 能看到自己的工作传递给谁时，我更容易持续。
* primary_dimension: contribution_drive
* secondary_dimension: purpose_drive
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; impact visibility preference only.
* interpretation_boundary: Interpret as impact motivation, not career worth.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                     |
| --- | --------- | -------- | --------------------------------- | ------------------------------------------- |
| A   | とても近い     | 非常符合     | contribution_drive, purpose_drive | { contribution_drive: 5, purpose_drive: 4 } |
| B   | やや近い      | 比较符合     | contribution_drive, purpose_drive | { contribution_drive: 4, purpose_drive: 3 } |
| C   | どちらともいえない | 说不清      | contribution_drive                | { contribution_drive: 3 }                   |
| D   | あまり近くない   | 不太符合     | autonomy_need                     | { contribution_drive: 2, autonomy_need: 3 } |
| E   | まったく近くない  | 完全不符合    | autonomy_need                     | { contribution_drive: 1, autonomy_need: 4 } |

### Section E：ストレスと回復

### F01_Q41

* section: E
* question_type: scale
* prompt_jp: 忙しさが続くと、まず集中力から落ちやすい。
* prompt_cn: 忙碌持续时，我通常先从集中力开始下降。
* primary_dimension: stress_response
* secondary_dimension: focus_style
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Workload sensitivity; not health diagnosis.
* interpretation_boundary: Interpret as workload response, not medical or mental health symptom.

#### Options

| key | label_jp  | label_cn | score_tags                   | weights                                        |
| --- | --------- | -------- | ---------------------------- | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | stress_response, focus_style | { stress_response: 5, focus_style: 4 }         |
| B   | やや近い      | 比较符合     | stress_response, focus_style | { stress_response: 4, focus_style: 3 }         |
| C   | どちらともいえない | 说不清      | stress_response              | { stress_response: 3 }                         |
| D   | あまり近くない   | 不太符合     | pressure_activation          | { stress_response: 2, pressure_activation: 3 } |
| E   | まったく近くない  | 完全不符合    | pressure_activation          | { stress_response: 1, pressure_activation: 4 } |

### F01_Q42

* section: E
* question_type: scale
* prompt_jp: 負荷が高い時ほど、やることを整理すると落ち着きやすい。
* prompt_cn: 负荷高时，把要做的事整理清楚会让我更容易稳定下来。
* primary_dimension: stress_response
* secondary_dimension: structure_need
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Stress-related but non-clinical.
* interpretation_boundary: Interpret as work-load management preference, not treatment advice.

#### Options

| key | label_jp  | label_cn | score_tags                      | weights                                   |
| --- | --------- | -------- | ------------------------------- | ----------------------------------------- |
| A   | とても近い     | 非常符合     | stress_response, structure_need | { stress_response: 5, structure_need: 5 } |
| B   | やや近い      | 比较符合     | stress_response, structure_need | { stress_response: 4, structure_need: 4 } |
| C   | どちらともいえない | 说不清      | stress_response                 | { stress_response: 3 }                    |
| D   | あまり近くない   | 不太符合     | autonomy_need                   | { stress_response: 2, autonomy_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | autonomy_need                   | { stress_response: 1, autonomy_need: 4 }  |

### F01_Q43

* section: E
* question_type: scale
* prompt_jp: 人と話すことで、仕事の疲れが軽くなることがある。
* prompt_cn: 和别人聊一聊时，工作疲惫有时会减轻。
* primary_dimension: recovery_style
* secondary_dimension: collaboration_style
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Recovery style only; avoid mental health framing.
* interpretation_boundary: Interpret as recovery preference, not therapy or treatment.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | recovery_style, collaboration_style | { recovery_style: 5, collaboration_style: 4 } |
| B   | やや近い      | 比较符合     | recovery_style, collaboration_style | { recovery_style: 4, collaboration_style: 3 } |
| C   | どちらともいえない | 说不清      | recovery_style                      | { recovery_style: 3 }                         |
| D   | あまり近くない   | 不太符合     | autonomy_need, focus_style          | { recovery_style: 2, autonomy_need: 3 }       |
| E   | まったく近くない  | 完全不符合    | autonomy_need, focus_style          | { recovery_style: 1, autonomy_need: 4 }       |

### F01_Q44

* section: E
* question_type: scale
* prompt_jp: ひとりになる時間があると、仕事の疲れを戻しやすい。
* prompt_cn: 有独处时间时，我更容易从工作疲惫中恢复。
* primary_dimension: recovery_style
* secondary_dimension: autonomy_need
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Recovery preference only.
* interpretation_boundary: Interpret as recovery style, not isolation or avoidance.

#### Options

| key | label_jp  | label_cn | score_tags                    | weights                                       |
| --- | --------- | -------- | ----------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | recovery_style, autonomy_need | { recovery_style: 5, autonomy_need: 4 }       |
| B   | やや近い      | 比较符合     | recovery_style, autonomy_need | { recovery_style: 4, autonomy_need: 3 }       |
| C   | どちらともいえない | 说不清      | recovery_style                | { recovery_style: 3 }                         |
| D   | あまり近くない   | 不太符合     | collaboration_style           | { recovery_style: 2, collaboration_style: 3 } |
| E   | まったく近くない  | 完全不符合    | collaboration_style           | { recovery_style: 1, collaboration_style: 4 } |

### F01_Q45

* section: E
* question_type: scale
* prompt_jp: 急な変更が続くと、仕事のペースを立て直しにくい。
* prompt_cn: 突发变更持续时，我很难重新建立工作节奏。
* primary_dimension: environment_sensitivity
* secondary_dimension: pace_stability
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Change sensitivity; keep non-diagnostic.
* interpretation_boundary: Interpret as change tolerance and rhythm fit, not adaptability judgment.

#### Options

| key | label_jp  | label_cn | score_tags                              | weights                                                |
| --- | --------- | -------- | --------------------------------------- | ------------------------------------------------------ |
| A   | とても近い     | 非常符合     | environment_sensitivity, pace_stability | { environment_sensitivity: 5, pace_stability: 5 }      |
| B   | やや近い      | 比较符合     | environment_sensitivity, pace_stability | { environment_sensitivity: 4, pace_stability: 4 }      |
| C   | どちらともいえない | 说不清      | environment_sensitivity                 | { environment_sensitivity: 3 }                         |
| D   | あまり近くない   | 不太符合     | switching_tolerance                     | { environment_sensitivity: 2, switching_tolerance: 3 } |
| E   | まったく近くない  | 完全不符合    | switching_tolerance                     | { environment_sensitivity: 1, switching_tolerance: 4 } |

### F01_Q46

* section: E
* question_type: scale
* prompt_jp: 変化が多い状況でも、その場で考えながら進める方が得意だ。
* prompt_cn: 即使变化很多，我也比较擅长边应对边推进。
* primary_dimension: switching_tolerance
* secondary_dimension: stress_response
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; change response only.
* interpretation_boundary: Interpret as change comfort, not guaranteed crisis performance.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                        |
| --- | --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | switching_tolerance, stress_response | { switching_tolerance: 5, stress_response: 4 } |
| B   | やや近い      | 比较符合     | switching_tolerance, stress_response | { switching_tolerance: 4, stress_response: 3 } |
| C   | どちらともいえない | 说不清      | switching_tolerance                  | { switching_tolerance: 3 }                     |
| D   | あまり近くない   | 不太符合     | pace_stability                       | { switching_tolerance: 2, pace_stability: 3 }  |
| E   | まったく近くない  | 完全不符合    | pace_stability                       | { switching_tolerance: 1, pace_stability: 4 }  |

### F01_Q47

* section: E
* question_type: scale
* prompt_jp: 忙しい時ほど、周りに頼るより自分で抱えやすい。
* prompt_cn: 越忙的时候，比起依靠别人，我越容易自己扛着。
* primary_dimension: stress_response
* secondary_dimension: autonomy_need
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Workload coping; avoid clinical framing.
* interpretation_boundary: Interpret as load-sharing tendency, not unhealthy coping diagnosis.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                        |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------------- |
| A   | とても近い     | 非常符合     | stress_response, autonomy_need | { stress_response: 5, autonomy_need: 5 }       |
| B   | やや近い      | 比较符合     | stress_response, autonomy_need | { stress_response: 4, autonomy_need: 4 }       |
| C   | どちらともいえない | 说不清      | stress_response                | { stress_response: 3 }                         |
| D   | あまり近くない   | 不太符合     | collaboration_style            | { stress_response: 2, collaboration_style: 3 } |
| E   | まったく近くない  | 完全不符合    | collaboration_style            | { stress_response: 1, collaboration_style: 4 } |

### F01_Q48

* section: E
* question_type: scale
* prompt_jp: 早めに相談できる相手がいると、負荷が高い時も崩れにくい。
* prompt_cn: 有能早些商量的人时，即使负荷高也不容易被压垮。
* primary_dimension: recovery_style
* secondary_dimension: collaboration_style
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Work support preference only.
* interpretation_boundary: Interpret as support preference, not dependency or mental health need.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | recovery_style, collaboration_style | { recovery_style: 5, collaboration_style: 5 } |
| B   | やや近い      | 比较符合     | recovery_style, collaboration_style | { recovery_style: 4, collaboration_style: 4 } |
| C   | どちらともいえない | 说不清      | recovery_style                      | { recovery_style: 3 }                         |
| D   | あまり近くない   | 不太符合     | autonomy_need                       | { recovery_style: 2, autonomy_need: 3 }       |
| E   | まったく近くない  | 完全不符合    | autonomy_need                       | { recovery_style: 1, autonomy_need: 4 }       |

### F01_Q49

* section: E
* question_type: scale
* prompt_jp: 仕事の後に気持ちを切り替える時間がないと、疲れが残りやすい。
* prompt_cn: 工作后如果没有切换心情的时间，我容易残留疲惫。
* primary_dimension: recovery_style
* secondary_dimension: environment_sensitivity
* sensitivity_level: medium
* public_private_note: private aggregate only
* risk_note: Recovery and fatigue; not health diagnosis.
* interpretation_boundary: Interpret as decompression need, not medical or psychological symptom.

#### Options

| key | label_jp  | label_cn | score_tags                              | weights                                           |
| --- | --------- | -------- | --------------------------------------- | ------------------------------------------------- |
| A   | とても近い     | 非常符合     | recovery_style, environment_sensitivity | { recovery_style: 5, environment_sensitivity: 4 } |
| B   | やや近い      | 比较符合     | recovery_style, environment_sensitivity | { recovery_style: 4, environment_sensitivity: 3 } |
| C   | どちらともいえない | 说不清      | recovery_style                          | { recovery_style: 3 }                             |
| D   | あまり近くない   | 不太符合     | pressure_activation                     | { recovery_style: 2, pressure_activation: 3 }     |
| E   | まったく近くない  | 完全不符合    | pressure_activation                     | { recovery_style: 1, pressure_activation: 4 }     |

### F01_Q50

* section: E
* question_type: scale
* prompt_jp: 負荷が高い時でも、目的がはっきりしていると踏ん張りやすい。
* prompt_cn: 即使负荷高，只要目的明确，我更容易坚持。
* primary_dimension: purpose_drive
* secondary_dimension: stress_response
* sensitivity_level: medium
* public_private_note: aggregate only
* risk_note: Stress-related but non-clinical.
* interpretation_boundary: Interpret as purpose support under load, not endurance judgment.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                  |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------- |
| A   | とても近い     | 非常符合     | purpose_drive, stress_response | { purpose_drive: 5, stress_response: 4 } |
| B   | やや近い      | 比较符合     | purpose_drive, stress_response | { purpose_drive: 4, stress_response: 3 } |
| C   | どちらともいえない | 说不清      | purpose_drive                  | { purpose_drive: 3 }                     |
| D   | あまり近くない   | 不太符合     | recovery_style                 | { purpose_drive: 2, recovery_style: 3 }  |
| E   | まったく近くない  | 完全不符合    | recovery_style                 | { purpose_drive: 1, recovery_style: 4 }  |

### Section F：成長・自由度・環境フィット

### F01_Q51

* section: F
* question_type: scale
* prompt_jp: 新しいことを学べる環境だと、仕事への前向きさが続きやすい。
* prompt_cn: 能学习新东西的环境，会让我更容易保持对工作的积极性。
* primary_dimension: growth_motivation
* secondary_dimension: environment_sensitivity
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; learning preference only.
* interpretation_boundary: Interpret as growth environment preference, not career success prediction.

#### Options

| key | label_jp  | label_cn | score_tags                                 | weights                                              |
| --- | --------- | -------- | ------------------------------------------ | ---------------------------------------------------- |
| A   | とても近い     | 非常符合     | growth_motivation, environment_sensitivity | { growth_motivation: 5, environment_sensitivity: 4 } |
| B   | やや近い      | 比较符合     | growth_motivation, environment_sensitivity | { growth_motivation: 4, environment_sensitivity: 3 } |
| C   | どちらともいえない | 说不清      | growth_motivation                          | { growth_motivation: 3 }                             |
| D   | あまり近くない   | 不太符合     | stability_need                             | { growth_motivation: 2, stability_need: 3 }          |
| E   | まったく近くない  | 完全不符合    | stability_need                             | { growth_motivation: 1, stability_need: 4 }          |

### F01_Q52

* section: F
* question_type: scale
* prompt_jp: 変化よりも、安定した環境で力を磨く方が合っている。
* prompt_cn: 比起变化，我更适合在稳定环境中打磨能力。
* primary_dimension: stability_need
* secondary_dimension: growth_motivation
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; stability preference only.
* interpretation_boundary: Interpret as environment fit, not lack of ambition.

#### Options

| key | label_jp  | label_cn | score_tags                          | weights                                       |
| --- | --------- | -------- | ----------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | stability_need, growth_motivation   | { stability_need: 5, growth_motivation: 3 }   |
| B   | やや近い      | 比较符合     | stability_need, growth_motivation   | { stability_need: 4, growth_motivation: 3 }   |
| C   | どちらともいえない | 说不清      | stability_need                      | { stability_need: 3 }                         |
| D   | あまり近くない   | 不太符合     | switching_tolerance, ideation_style | { stability_need: 2, switching_tolerance: 3 } |
| E   | まったく近くない  | 完全不符合    | switching_tolerance, ideation_style | { stability_need: 1, switching_tolerance: 4 } |

### F01_Q53

* section: F
* question_type: scale
* prompt_jp: 自分で決められる範囲が広いほど、仕事に責任を持ちやすい。
* prompt_cn: 自己能决定的范围越大，我越容易对工作有责任感。
* primary_dimension: autonomy_need
* secondary_dimension: execution_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; autonomy and ownership only.
* interpretation_boundary: Interpret as autonomy ownership, not entrepreneurship fit.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                  |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------- |
| A   | とても近い     | 非常符合     | autonomy_need, execution_style | { autonomy_need: 5, execution_style: 4 } |
| B   | やや近い      | 比较符合     | autonomy_need, execution_style | { autonomy_need: 4, execution_style: 3 } |
| C   | どちらともいえない | 说不清      | autonomy_need                  | { autonomy_need: 3 }                     |
| D   | あまり近くない   | 不太符合     | structure_need                 | { autonomy_need: 2, structure_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | structure_need                 | { autonomy_need: 1, structure_need: 4 }  |

### F01_Q54

* section: F
* question_type: scale
* prompt_jp: ルールや手順が整っている環境の方が、安心して成果を出しやすい。
* prompt_cn: 规则和流程清晰的环境，更容易让我安心产出成果。
* primary_dimension: structure_need
* secondary_dimension: stability_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; structured environment preference only.
* interpretation_boundary: Interpret as workflow fit, not dependency on rules.

#### Options

| key | label_jp  | label_cn | score_tags                     | weights                                  |
| --- | --------- | -------- | ------------------------------ | ---------------------------------------- |
| A   | とても近い     | 非常符合     | structure_need, stability_need | { structure_need: 5, stability_need: 5 } |
| B   | やや近い      | 比较符合     | structure_need, stability_need | { structure_need: 4, stability_need: 4 } |
| C   | どちらともいえない | 说不清      | structure_need                 | { structure_need: 3 }                    |
| D   | あまり近くない   | 不太符合     | autonomy_need                  | { structure_need: 2, autonomy_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | autonomy_need                  | { structure_need: 1, autonomy_need: 4 }  |

### F01_Q55

* section: F
* question_type: scale
* prompt_jp: 速く変わる環境にいると、自分の成長を感じやすい。
* prompt_cn: 身处变化快的环境时，我更容易感到自己在成长。
* primary_dimension: switching_tolerance
* secondary_dimension: growth_motivation
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; growth environment preference only.
* interpretation_boundary: Interpret as change-growth fit, not startup or company-size recommendation.

#### Options

| key | label_jp  | label_cn | score_tags                             | weights                                          |
| --- | --------- | -------- | -------------------------------------- | ------------------------------------------------ |
| A   | とても近い     | 非常符合     | switching_tolerance, growth_motivation | { switching_tolerance: 5, growth_motivation: 5 } |
| B   | やや近い      | 比较符合     | switching_tolerance, growth_motivation | { switching_tolerance: 4, growth_motivation: 4 } |
| C   | どちらともいえない | 说不清      | switching_tolerance                    | { switching_tolerance: 3 }                       |
| D   | あまり近くない   | 不太符合     | stability_need                         | { switching_tolerance: 2, stability_need: 3 }    |
| E   | まったく近くない  | 完全不符合    | stability_need                         | { switching_tolerance: 1, stability_need: 4 }    |

### F01_Q56

* section: F
* question_type: scale
* prompt_jp: 仕事の進め方を自分で改善していくのが好きだ。
* prompt_cn: 我喜欢自己改善工作的推进方式。
* primary_dimension: growth_motivation
* secondary_dimension: execution_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; improvement orientation only.
* interpretation_boundary: Interpret as process improvement preference, not job performance.

#### Options

| key | label_jp  | label_cn | score_tags                         | weights                                      |
| --- | --------- | -------- | ---------------------------------- | -------------------------------------------- |
| A   | とても近い     | 非常符合     | growth_motivation, execution_style | { growth_motivation: 5, execution_style: 4 } |
| B   | やや近い      | 比较符合     | growth_motivation, execution_style | { growth_motivation: 4, execution_style: 3 } |
| C   | どちらともいえない | 说不清      | growth_motivation                  | { growth_motivation: 3 }                     |
| D   | あまり近くない   | 不太符合     | structure_need                     | { growth_motivation: 2, structure_need: 3 }  |
| E   | まったく近くない  | 完全不符合    | structure_need                     | { growth_motivation: 1, structure_need: 4 }  |

### F01_Q57

* section: F
* question_type: scale
* prompt_jp: 周囲の音や空気感によって、仕事のしやすさが変わりやすい。
* prompt_cn: 周围声音或氛围会明显影响我工作是否顺手。
* primary_dimension: environment_sensitivity
* secondary_dimension: focus_style
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Environment sensitivity only; not sensory diagnosis.
* interpretation_boundary: Interpret as environment fit, not medical or psychological trait.

#### Options

| key | label_jp  | label_cn | score_tags                           | weights                                                |
| --- | --------- | -------- | ------------------------------------ | ------------------------------------------------------ |
| A   | とても近い     | 非常符合     | environment_sensitivity, focus_style | { environment_sensitivity: 5, focus_style: 4 }         |
| B   | やや近い      | 比较符合     | environment_sensitivity, focus_style | { environment_sensitivity: 4, focus_style: 3 }         |
| C   | どちらともいえない | 说不清      | environment_sensitivity              | { environment_sensitivity: 3 }                         |
| D   | あまり近くない   | 不太符合     | switching_tolerance                  | { environment_sensitivity: 2, switching_tolerance: 3 } |
| E   | まったく近くない  | 完全不符合    | switching_tolerance                  | { environment_sensitivity: 1, switching_tolerance: 4 } |

### F01_Q58

* section: F
* question_type: scale
* prompt_jp: 仕事では、自由さよりも安心して続けられることを重視したい。
* prompt_cn: 工作中，比起自由度，我更重视能安心持续。
* primary_dimension: stability_need
* secondary_dimension: autonomy_need
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; stability-autonomy preference only.
* interpretation_boundary: Interpret as preference, not career ambition or risk tolerance judgment.

#### Options

| key | label_jp  | label_cn | score_tags                    | weights                                 |
| --- | --------- | -------- | ----------------------------- | --------------------------------------- |
| A   | とても近い     | 非常符合     | stability_need, autonomy_need | { stability_need: 5, autonomy_need: 1 } |
| B   | やや近い      | 比较符合     | stability_need, autonomy_need | { stability_need: 4, autonomy_need: 2 } |
| C   | どちらともいえない | 说不清      | stability_need                | { stability_need: 3 }                   |
| D   | あまり近くない   | 不太符合     | autonomy_need                 | { stability_need: 2, autonomy_need: 4 } |
| E   | まったく近くない  | 完全不符合    | autonomy_need                 | { stability_need: 1, autonomy_need: 5 } |

### F01_Q59

* section: F
* question_type: scale
* prompt_jp: 自分の得意なやり方を見つけると、仕事がかなり楽になる。
* prompt_cn: 找到自己擅长的工作方式后，我会觉得工作轻松很多。
* primary_dimension: workstyle_awareness
* secondary_dimension: growth_motivation
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; self-understanding motivation only.
* interpretation_boundary: Interpret as value of workstyle awareness, not cure-all.

#### Options

| key | label_jp  | label_cn | score_tags                             | weights                                          |
| --- | --------- | -------- | -------------------------------------- | ------------------------------------------------ |
| A   | とても近い     | 非常符合     | workstyle_awareness, growth_motivation | { workstyle_awareness: 5, growth_motivation: 4 } |
| B   | やや近い      | 比较符合     | workstyle_awareness, growth_motivation | { workstyle_awareness: 4, growth_motivation: 3 } |
| C   | どちらともいえない | 说不清      | workstyle_awareness                    | { workstyle_awareness: 3 }                       |
| D   | あまり近くない   | 不太符合     | structure_need                         | { workstyle_awareness: 2, structure_need: 3 }    |
| E   | まったく近くない  | 完全不符合    | structure_need                         | { workstyle_awareness: 1, structure_need: 4 }    |

### F01_Q60

* section: F
* question_type: scale
* prompt_jp: 今の働き方が合っているかどうかを、定期的に見直したい。
* prompt_cn: 我想定期回看现在的工作方式是否适合自己。
* primary_dimension: workstyle_awareness
* secondary_dimension: repeat_value
* sensitivity_level: low
* public_private_note: aggregate only
* risk_note: Low risk; review intent only.
* interpretation_boundary: Interpret as review interest, not dissatisfaction with current job.

#### Options

| key | label_jp  | label_cn | score_tags                        | weights                                       |
| --- | --------- | -------- | --------------------------------- | --------------------------------------------- |
| A   | とても近い     | 非常符合     | workstyle_awareness, repeat_value | { workstyle_awareness: 5, repeat_value: 5 }   |
| B   | やや近い      | 比较符合     | workstyle_awareness, repeat_value | { workstyle_awareness: 4, repeat_value: 4 }   |
| C   | どちらともいえない | 说不清      | workstyle_awareness               | { workstyle_awareness: 3 }                    |
| D   | あまり近くない   | 不太符合     | stability_need                    | { workstyle_awareness: 2, stability_need: 3 } |
| E   | まったく近くない  | 完全不符合    | stability_need                    | { workstyle_awareness: 1, stability_need: 4 } |

## 6. Dimensions and Scoring Model

### Dimensions

| dimension               | meaning    |
| ----------------------- | ---------- |
| energy_source           | 工作能量来源     |
| focus_style             | 集中方式       |
| pace_stability          | 节奏稳定性      |
| collaboration_style     | 协作偏好       |
| feedback_need           | 反馈需求       |
| autonomy_need           | 自由度需求      |
| structure_need          | 结构与清晰度需求   |
| stress_response         | 压力反应       |
| recovery_style          | 恢复方式       |
| growth_motivation       | 成长动机       |
| environment_sensitivity | 环境敏感度      |
| execution_style         | 执行方式       |
| purpose_drive           | 意义驱动       |
| contribution_drive      | 贡献感驱动      |
| stability_need          | 稳定需求       |
| switching_tolerance     | 变化与切换适应    |
| workstyle_awareness     | 工作方式自我理解意图 |
| repeat_value            | 复测价值信号     |

### Dimension Weights

| dimension               | weight |
| ----------------------- | -----: |
| energy_source           |     8% |
| focus_style             |     8% |
| pace_stability          |     7% |
| collaboration_style     |     8% |
| feedback_need           |     8% |
| autonomy_need           |     8% |
| structure_need          |     8% |
| stress_response         |     7% |
| recovery_style          |     7% |
| growth_motivation       |     7% |
| environment_sensitivity |     7% |
| execution_style         |     6% |
| purpose_drive           |     4% |
| contribution_drive      |     3% |
| stability_need          |     4% |

### Scoring Logic

* Each option adds weighted signals to one or more dimensions.
* High scores are not “better”; they represent stronger workstyle tendencies.
* Result assignment uses dominant dimensions, pattern combinations, confidence, and high-difference handling.
* The result must not recommend a specific job or career decision.

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

If shown, the score must be labeled as “働き方フィット参考スコア.”
It must not be displayed as career suitability, employability, ability, salary prediction, or company fit certainty.

## 7. Result Types

| result_id | display_name_jp | display_name_cn | short_label_jp | share_card_line_jp    |
| --------- | --------------- | --------------- | -------------- | --------------------- |
| F01_A     | 静かに深める          | 安静深耕型           | 深く集中           | 集中できる環境で、力が深まりやすい。    |
| F01_B     | リズムで積み上げる       | 节奏积累型           | 積み上げ型          | 毎日のリズムが、成果の土台になる。     |
| F01_C     | 人と動かす           | 协作推动型           | チーム推進          | 人と関わるほど、仕事が動き出す。      |
| F01_D     | 自由に広げる          | 自由拓展型           | 自由発想           | 余白があるほど、アイデアが広がる。     |
| F01_E     | 整えて進める          | 结构推进型           | 整理推進           | 見通しがあると、安心して進める。      |
| F01_F     | 反応で伸びる          | 反馈成长型           | 反応成長           | 反応が見えるほど、次に進みやすい。     |
| F01_G     | 変化を楽しむ          | 变化驱动型           | 変化推進           | 変化の中で、力が動き出す。         |
| F01_H     | 安心して力を出す        | 安心发挥型           | 安心安定           | 安心できる土台があるほど、力を出しやすい。 |

## 8. Result Assignment Rules

### F01_A：静かに深める

* primary trigger dimensions: focus_style, autonomy_need
* secondary trigger dimensions: environment_sensitivity, execution_style
* confidence requirement: medium_or_high
* score range tendency: 70–95
* high-difference override: If collaboration_style is also high, add note that quiet focus and selective collaboration both matter.
* low-confidence fallback: F01_H
* tie-break rule: Prefer F01_E if structure_need is stronger than focus_style.
* forbidden interpretation: Do not say the user cannot work with people.

### F01_B：リズムで積み上げる

* primary trigger dimensions: pace_stability, execution_style
* secondary trigger dimensions: stability_need, structure_need
* confidence requirement: medium_or_high
* score range tendency: 68–92
* high-difference override: If pressure_activation is high, add note about deadline bursts.
* low-confidence fallback: F01_H
* tie-break rule: Prefer F01_E if structure_need dominates pace_stability.
* forbidden interpretation: Do not say the user lacks creativity.

### F01_C：人と動かす

* primary trigger dimensions: collaboration_style, contribution_drive
* secondary trigger dimensions: feedback_need, energy_source
* confidence requirement: medium_or_high
* score range tendency: 72–96
* high-difference override: If focus_style is also high, add note about meeting-free deep work time.
* low-confidence fallback: F01_H
* tie-break rule: Prefer F01_F if feedback_need dominates collaboration_style.
* forbidden interpretation: Do not say the user depends on others.

### F01_D：自由に広げる

* primary trigger dimensions: autonomy_need, ideation_style
* secondary trigger dimensions: growth_motivation, switching_tolerance
* confidence requirement: medium_or_high
* score range tendency: 70–94
* high-difference override: If structure_need is high, add note about “自由の中に最低限の枠.”
* low-confidence fallback: F01_H
* tie-break rule: Prefer F01_G if switching_tolerance dominates ideation_style.
* forbidden interpretation: Do not say the user should freelance, start a business, or avoid companies.

### F01_E：整えて進める

* primary trigger dimensions: structure_need, execution_style
* secondary trigger dimensions: pace_stability, feedback_need
* confidence requirement: medium_or_high
* score range tendency: 70–95
* high-difference override: If autonomy_need is high, add note about flexible structure.
* low-confidence fallback: F01_H
* tie-break rule: Prefer F01_B if pace_stability is stronger than structure_need.
* forbidden interpretation: Do not say the user is rigid.

### F01_F：反応で伸びる

* primary trigger dimensions: feedback_need, growth_motivation
* secondary trigger dimensions: contribution_drive, purpose_drive
* confidence requirement: medium_or_high
* score range tendency: 68–93
* high-difference override: If autonomy_need is high, add note about feedback without micromanagement.
* low-confidence fallback: F01_H
* tie-break rule: Prefer F01_C if collaboration_style dominates feedback_need.
* forbidden interpretation: Do not say the user needs praise to work.

### F01_G：変化を楽しむ

* primary trigger dimensions: switching_tolerance, growth_motivation
* secondary trigger dimensions: ideation_style, pressure_activation
* confidence requirement: medium_or_high
* score range tendency: 66–92
* high-difference override: If stress_response is high, add note about recovery design.
* low-confidence fallback: F01_H
* tie-break rule: Prefer F01_D if autonomy_need dominates switching_tolerance.
* forbidden interpretation: Do not say the user must choose startup, high-change, or unstable environments.

### F01_H：安心して力を出す

* primary trigger dimensions: stability_need, reassurance_need, recovery_style
* secondary trigger dimensions: structure_need, environment_sensitivity
* confidence requirement: low_or_medium_or_high
* score range tendency: any
* high-difference override: Use when safety/stability needs are strong or confidence is low.
* low-confidence fallback: F01_H
* tie-break rule: Always prefer F01_H when confidence_score is low.
* forbidden interpretation: Do not say the user is weak, risk-averse, or not ambitious.

## 9. Free Result Structure

Free result page order:

1. 働き方フィット参考スコア
2. 働き方タイプ
3. 力を出しやすい条件 2 个
4. つまずきやすい場面 1 个
5. 比較してみるとよい環境 1 个
6. 深掘りレポート teaser
7. Core 测试导流
8. Share card

### free_result_sample_jp

あなたの働き方タイプは **「整えて進める」** です。
見通しや優先順位が見えている時に、安心して力を出しやすいタイプです。

力を出しやすい条件:

* 役割や期待値がはっきりしている
* 優先順位を整理してから進められる

つまずきやすい場面:

* 急な変更が続き、何を優先すべきか見えにくい時

比較してみるとよい環境:

* ルールや手順がありつつ、自分で改善できる余白がある環境

### paid_teaser_sample_jp

深掘りレポートでは、あなたが力を出しやすい仕事の進め方、合いやすい feedback、負荷が高い時の戻り方、比較してみるとよい職場環境を詳しく整理します。

### core_bridge_copy_jp

働き方の相性は、今の状態とも関係します。
まず自分の Life-State を見ておくと、仕事の悩み方も少し整理しやすくなります。

### share_cta_jp

この働き方タイプをシェアする

## 10. Paid Report Outline

### paid_report_name_jp

働き方リズム深掘りレポート

### paid_report_promise_jp

あなたに合いやすい働き方、力を出しやすい環境、feedback の受け取り方、負荷が高い時の戻り方を整理します。
これは職業を決めるものではなく、働き方を比較するための参考レポートです。

### section_outline_jp

1. あなたの働き方タイプ詳細
2. 力が出やすい仕事の始め方
3. 集中しやすいペースと環境
4. 人との働き方と協働スタイル
5. feedback と安心感の作り方
6. 負荷が高い時の戻り方
7. 成長しやすい環境の特徴
8. 比較してみるとよい職場環境
9. 次に見るとよい Yorisou 診断

### free_vs_paid_boundary

Free includes:

* type
* score
* two strengths
* one friction point
* one environment direction

Paid adds:

* dimension radar
* section-by-section analysis
* feedback fit
* stress/recovery rhythm
* work environment comparison
* recommendation mapping

Paid must not include:

* specific career decision
* resignation advice
* income prediction
* success prediction
* company-size certainty

### sample_paid_cta_jp

あなたが力を出しやすい働き方と、比較してみるとよい環境を深く見る

### forbidden_paid_copy

* あなたはこの職業に向いています
* 今の仕事を辞めるべきです
* 起業すべきです
* 大企業/ベンチャーに行くべきです
* 年収が上がります
* 成功できます
* 今すぐ見ないと損です

## 11. Share Card Logic

### Version A：Type Focus

* card_title_jp: 向いている働き方診断
* visible_fields: type_label, safe_one_line, QR/link
* main_line_jp: 整えて進める
* sub_line_jp: 見通しがあると、安心して進めるタイプ。
* CTA: 自分の働き方タイプを見る
* forbidden_fields: stress details, weak points, private answers, paid report content

### Version B：Score Focus

* card_title_jp: 働き方フィット参考スコア
* visible_fields: score, type label, one safe strength
* main_line_jp: 働き方フィット参考スコア 78 / 100
* sub_line_jp: 力を出しやすい条件が見えてきました。
* CTA: 診断してみる
* forbidden_fields: career advice, weakness, resignation implication, salary implication

### Version C：Core Bridge Focus

* card_title_jp: 仕事のリズムから見る今の自分
* visible_fields: type, core bridge line, CTA
* main_line_jp: 働き方は、今の状態ともつながっている。
* sub_line_jp: 次は Life-State も見てみる。
* CTA: 今のわたしチェックへ
* forbidden_fields: private work stress, exact job fit, urgency copy

## 12. Recommendation Mapping

| recommendation_type | trigger_condition                                          | reason_copy_jp                   | commercial_status            | disclosure_needed |
| ------------------- | ---------------------------------------------------------- | -------------------------------- | ---------------------------- | ----------------- |
| C02 今のわたしチェック       | low confidence or stress/recovery signals high             | 働き方の前に、今の状態も軽く見てみませんか。           | free / core                  | no                |
| 120問ライフステート診断       | strong paid intent or deeper self-understanding click      | 仕事の悩み方の奥にある Life-State を深く見られます。 | free / core or report bridge | no                |
| F02 職場環境フィット診断      | environment_sensitivity or structure/autonomy signals high | 働き方だけでなく、合いやすい職場環境も見てみませんか。      | free / later paid report     | no                |
| 回復方式测试              | stress_response and recovery_style high                    | 負荷が高い時の戻り方を、もう少し具体的に見られます。       | free / module                | no                |
| 学习方式测试              | growth_motivation high                                     | 成長しやすい学び方も見てみませんか。               | free / module                | no                |
| 工作方式深度报告            | paid report CTA click                                      | あなたに合いやすい働き方を、もう少し深く整理できます。      | paid report                  | yes               |
| 内容/书/工具推荐方向         | user chooses recommendation intent                         | 今の働き方タイプに合いやすい内容やツール方向を比較できます。   | recommendation               | yes if commercial |

## 13. LINE / Web Return Path

### Save After Completion

* Show 「結果を保存する」 after result.
* Do not claim account/cloud save unless actually available.
* If only local/session save exists, copy must say temporary or device-based.

### 7-Day Follow-Up

仕事の進め方で、今週少し試せたことはありますか？

### 30-Day Follow-Up

前回の診断から少し時間が経ちました。働き方のリズム、今は変わっているかもしれません。

### Report Follow-Up

深掘りレポートでは、あなたが力を出しやすい環境と feedback の形を詳しく見られます。

### Avoiding Disturbance

* Default reminders off.
* Separate opt-in for save, 7-day reminder, 30-day reminder.
* No fear copy.
* No “career opportunity loss” pressure.

## 14. UX Implementation Notes

| area                   | product / UX note                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------- |
| mobile-first flow      | One question per screen or compact cards.                                           |
| progress behavior      | Show section title and 1/60 progress.                                               |
| section break behavior | Show section break copy after every 10 questions.                                   |
| result reveal behavior | Show type first, then two strengths, one friction point, one environment direction. |
| paid report preview    | Explain concrete additions without pressure.                                        |
| share behavior         | Only share public-safe type and one-line description.                               |
| retake behavior        | Recommend 30–90 day retake or after job/team/project change.                        |
| Core bridge            | Always include C02 or 120-question anchor as next step.                             |
| anti-supermarket rule  | Only show 1–2 next recommendations.                                                 |

## 15. Trust-Risk Review

| risk                           | risk_level | issue_found                                        | required_fix                                                       | final_status                 |
| ------------------------------ | ---------- | -------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------- |
| Specific career decision risk  | high       | Work test could be read as career advice           | Must say work-style reference only; no specific job recommendation | pass_with_boundary           |
| Resignation advice risk        | high       | User may expect “should I quit?”                   | Forbid quit/stay language                                          | pass_with_boundary           |
| Income/success prediction risk | high       | Career tests often imply outcome                   | Forbid salary, success, promotion prediction                       | pass                         |
| Psychological diagnosis risk   | medium     | Stress/recovery questions may sound clinical       | Keep work-contextual; no symptom/screening language                | pass_with_boundary           |
| Workplace blame risk           | medium     | Environment fit could be read as company judgment  | Use “worth comparing” not “bad workplace”                          | pass_with_boundary           |
| Paid anxiety risk              | medium     | Report could exploit work dissatisfaction          | No urgency, fear, scarcity, fake discount                          | pass                         |
| Share privacy risk             | medium     | Work stress could leak                             | Share only public-safe type and one-line                           | pass                         |
| Hidden affiliate risk          | medium     | Tool/course/book recommendations may commercialize | Disclosure required if commercial                                  | pass_with_disclosure         |
| Data/LINE consent risk         | high       | Reminders require consent                          | Separate opt-in required                                           | pass_requires_consent_design |

## 16. Complete TypeScript-Friendly Data Spec

```ts
export const f01MuiteiruHatarakikataShindanV10 = {
  metadata: {
    test_id: "F01",
    version: "v1.0",
    test_name_jp: "向いている働き方診断",
    test_name_cn: "适合的工作方式诊断",
    layer: "Yorisou Fit / Work",
    question_count: 60,
    section_count: 6,
    expected_completion_time: "12-18 minutes",
    output_status: "draft_test_spec",
    codex_ready: false,
    implementation_status: "review_file_only_not_site_integration"
  },

  sections: [
    {
      id: "A",
      title_jp: "エネルギーの出どころ",
      title_cn: "能量来源",
      question_ids: ["F01_Q01","F01_Q02","F01_Q03","F01_Q04","F01_Q05","F01_Q06","F01_Q07","F01_Q08","F01_Q09","F01_Q10"],
      section_break_copy_jp: "ここまでで、あなたが仕事で力を出しやすい「エネルギーの出どころ」が少し見えてきました。次は、集中しやすいペースを見ていきます。"
    },
    {
      id: "B",
      title_jp: "集中とペース",
      title_cn: "集中与节奏",
      question_ids: ["F01_Q11","F01_Q12","F01_Q13","F01_Q14","F01_Q15","F01_Q16","F01_Q17","F01_Q18","F01_Q19","F01_Q20"],
      section_break_copy_jp: "あなたの集中しやすいリズムが見えてきました。次は、人との働き方を見ていきます。"
    },
    {
      id: "C",
      title_jp: "人との働き方",
      title_cn: "与人协作方式",
      question_ids: ["F01_Q21","F01_Q22","F01_Q23","F01_Q24","F01_Q25","F01_Q26","F01_Q27","F01_Q28","F01_Q29","F01_Q30"],
      section_break_copy_jp: "人との関わり方や、力を出しやすいチームの形が見えてきました。次は、評価やフィードバックとの相性を見ていきます。"
    },
    {
      id: "D",
      title_jp: "評価・フィードバック・安心感",
      title_cn: "评价、反馈与安心感",
      question_ids: ["F01_Q31","F01_Q32","F01_Q33","F01_Q34","F01_Q35","F01_Q36","F01_Q37","F01_Q38","F01_Q39","F01_Q40"],
      section_break_copy_jp: "あなたが安心して力を出すために必要な feedback の形が見えてきました。次は、ストレスと回復のパターンを見ていきます。"
    },
    {
      id: "E",
      title_jp: "ストレスと回復",
      title_cn: "压力与恢复",
      question_ids: ["F01_Q41","F01_Q42","F01_Q43","F01_Q44","F01_Q45","F01_Q46","F01_Q47","F01_Q48","F01_Q49","F01_Q50"],
      section_break_copy_jp: "負荷が高い時の反応と、戻りやすい方法が見えてきました。最後に、成長・自由度・環境フィットを見ていきます。"
    },
    {
      id: "F",
      title_jp: "成長・自由度・環境フィット",
      title_cn: "成长、自由度与环境适配",
      question_ids: ["F01_Q51","F01_Q52","F01_Q53","F01_Q54","F01_Q55","F01_Q56","F01_Q57","F01_Q58","F01_Q59","F01_Q60"],
      section_break_copy_jp: "回答ありがとうございます。結果では、あなたが力を出しやすい働き方と、比較してみるとよい環境の方向を整理します。"
    }
  ],

  dimensions: {
    energy_source: "工作能量来源",
    focus_style: "集中方式",
    pace_stability: "节奏稳定性",
    collaboration_style: "协作偏好",
    feedback_need: "反馈需求",
    autonomy_need: "自由度需求",
    structure_need: "结构与清晰度需求",
    stress_response: "压力反应",
    recovery_style: "恢复方式",
    growth_motivation: "成长动机",
    environment_sensitivity: "环境敏感度",
    execution_style: "执行方式",
    purpose_drive: "意义驱动",
    contribution_drive: "贡献感驱动",
    stability_need: "稳定需求",
    switching_tolerance: "变化与切换适应",
    workstyle_awareness: "工作方式自我理解意图",
    repeat_value: "复测价值信号",
    action_start: "行动启动方式",
    ideation_style: "想法生成方式",
    pressure_activation: "压力启动倾向",
    reassurance_need: "安心确认需求",
    repair_style: "调整与修复方式"
  },

  dimension_weights: {
    energy_source: 0.08,
    focus_style: 0.08,
    pace_stability: 0.07,
    collaboration_style: 0.08,
    feedback_need: 0.08,
    autonomy_need: 0.08,
    structure_need: 0.08,
    stress_response: 0.07,
    recovery_style: 0.07,
    growth_motivation: 0.07,
    environment_sensitivity: 0.07,
    execution_style: 0.06,
    purpose_drive: 0.04,
    contribution_drive: 0.03,
    stability_need: 0.04
  },

  questions: [
    {
      id: "F01_Q01",
      section: "A",
      question_type: "scale",
      prompt_jp: "新しい仕事に入る時、まず全体像をつかめると動きやすい。",
      prompt_cn: "开始一项新工作时，如果先掌握整体图景，我会更容易行动。",
      primary_dimension: "structure_need",
      secondary_dimension: "execution_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; work-start preference only.",
      interpretation_boundary: "Interpret as work-start style, not ability or intelligence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["structure_need", "execution_style"], weights: { structure_need: 5, execution_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["structure_need", "execution_style"], weights: { structure_need: 4, execution_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["structure_need"], weights: { structure_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need", "action_start"], weights: { structure_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need", "action_start"], weights: { structure_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q02",
      section: "A",
      question_type: "scale",
      prompt_jp: "人と話しながら考えると、仕事のアイデアが出やすい。",
      prompt_cn: "边和别人讨论边思考时，我更容易产生工作想法。",
      primary_dimension: "collaboration_style",
      secondary_dimension: "energy_source",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; idea-generation style only.",
      interpretation_boundary: "Interpret as collaboration preference, not extroversion judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["collaboration_style", "energy_source"], weights: { collaboration_style: 5, energy_source: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["collaboration_style", "energy_source"], weights: { collaboration_style: 4, energy_source: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["collaboration_style"], weights: { collaboration_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["focus_style", "autonomy_need"], weights: { collaboration_style: 2, focus_style: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["focus_style", "autonomy_need"], weights: { collaboration_style: 1, focus_style: 5 } }
      ]
    },
    {
      id: "F01_Q03",
      section: "A",
      question_type: "scale",
      prompt_jp: "ひとりで深く考える時間があると、仕事の質が上がりやすい。",
      prompt_cn: "有独自深入思考的时间时，我的工作质量更容易提高。",
      primary_dimension: "focus_style",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; concentration style only.",
      interpretation_boundary: "Interpret as focus condition, not social preference judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["focus_style", "autonomy_need"], weights: { focus_style: 5, autonomy_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["focus_style", "autonomy_need"], weights: { focus_style: 4, autonomy_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["focus_style"], weights: { focus_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["collaboration_style"], weights: { focus_style: 2, collaboration_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["collaboration_style"], weights: { focus_style: 1, collaboration_style: 4 } }
      ]
    },
    {
      id: "F01_Q04",
      section: "A",
      question_type: "scale",
      prompt_jp: "誰かの役に立っている実感があると、仕事のやる気が出やすい。",
      prompt_cn: "感到自己对别人有帮助时，我更容易产生工作动力。",
      primary_dimension: "contribution_drive",
      secondary_dimension: "feedback_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; motivation source only.",
      interpretation_boundary: "Interpret as contribution motivation, not self-worth.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["contribution_drive", "feedback_need"], weights: { contribution_drive: 5, feedback_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["contribution_drive", "feedback_need"], weights: { contribution_drive: 4, feedback_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["contribution_drive"], weights: { contribution_drive: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { contribution_drive: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { contribution_drive: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q05",
      section: "A",
      question_type: "scale",
      prompt_jp: "難しい課題ほど、自分の力を試せる感じがして燃えやすい。",
      prompt_cn: "任务越难，我越容易觉得能测试自己的能力而更有动力。",
      primary_dimension: "growth_motivation",
      secondary_dimension: "stress_response",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; challenge motivation only.",
      interpretation_boundary: "Interpret as challenge preference, not performance promise.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["growth_motivation", "stress_response"], weights: { growth_motivation: 5, stress_response: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["growth_motivation", "stress_response"], weights: { growth_motivation: 4, stress_response: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["growth_motivation"], weights: { growth_motivation: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { growth_motivation: 2, stability_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { growth_motivation: 1, stability_need: 4 } }
      ]
    },
    {
      id: "F01_Q06",
      section: "A",
      question_type: "scale",
      prompt_jp: "決まった役割がある方が、安心して力を出しやすい。",
      prompt_cn: "有明确角色时，我更容易安心发挥。",
      primary_dimension: "structure_need",
      secondary_dimension: "stability_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; role clarity preference only.",
      interpretation_boundary: "Interpret as role clarity need, not lack of flexibility.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["structure_need", "stability_need"], weights: { structure_need: 5, stability_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["structure_need", "stability_need"], weights: { structure_need: 4, stability_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["structure_need"], weights: { structure_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need", "growth_motivation"], weights: { structure_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need", "growth_motivation"], weights: { structure_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q07",
      section: "A",
      question_type: "scale",
      prompt_jp: "自分で工夫できる余白があると、仕事に前向きになりやすい。",
      prompt_cn: "有可以自己发挥和调整的空间时，我更容易对工作积极。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "growth_motivation",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; autonomy preference only.",
      interpretation_boundary: "Interpret as need for discretion, not rejection of rules.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need", "growth_motivation"], weights: { autonomy_need: 5, growth_motivation: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need", "growth_motivation"], weights: { autonomy_need: 4, growth_motivation: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["structure_need"], weights: { autonomy_need: 2, structure_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["structure_need"], weights: { autonomy_need: 1, structure_need: 4 } }
      ]
    },
    {
      id: "F01_Q08",
      section: "A",
      question_type: "scale",
      prompt_jp: "目の前の作業に集中して、ひとつずつ終わらせる時に力が出やすい。",
      prompt_cn: "专注眼前任务并逐个完成时，我更容易发挥。",
      primary_dimension: "execution_style",
      secondary_dimension: "focus_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; execution style only.",
      interpretation_boundary: "Interpret as task execution preference, not speed or ability.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["execution_style", "focus_style"], weights: { execution_style: 5, focus_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["execution_style", "focus_style"], weights: { execution_style: 4, focus_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["execution_style"], weights: { execution_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["ideation_style"], weights: { execution_style: 2, ideation_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["ideation_style"], weights: { execution_style: 1, ideation_style: 4 } }
      ]
    },
    {
      id: "F01_Q09",
      section: "A",
      question_type: "scale",
      prompt_jp: "新しい可能性を考える時間があると、仕事への熱量が上がりやすい。",
      prompt_cn: "有时间思考新可能性时，我对工作的热情更容易提升。",
      primary_dimension: "ideation_style",
      secondary_dimension: "growth_motivation",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; ideation preference only.",
      interpretation_boundary: "Interpret as idea energy, not entrepreneurship fit.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["ideation_style", "growth_motivation"], weights: { ideation_style: 5, growth_motivation: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["ideation_style", "growth_motivation"], weights: { ideation_style: 4, growth_motivation: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["ideation_style"], weights: { ideation_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["execution_style"], weights: { ideation_style: 2, execution_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["execution_style"], weights: { ideation_style: 1, execution_style: 4 } }
      ]
    },
    {
      id: "F01_Q10",
      section: "A",
      question_type: "scale",
      prompt_jp: "仕事の意味や目的が見えると、多少大変でも続けやすい。",
      prompt_cn: "如果能看见工作的意义或目的，即使辛苦也更容易坚持。",
      primary_dimension: "purpose_drive",
      secondary_dimension: "stress_response",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; purpose motivation only.",
      interpretation_boundary: "Interpret as purpose-driven motivation, not moral value.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["purpose_drive", "stress_response"], weights: { purpose_drive: 5, stress_response: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["purpose_drive", "stress_response"], weights: { purpose_drive: 4, stress_response: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["purpose_drive"], weights: { purpose_drive: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { purpose_drive: 2, stability_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { purpose_drive: 1, stability_need: 4 } }
      ]
    },
    {
      id: "F01_Q11",
      section: "B",
      question_type: "scale",
      prompt_jp: "まとまった時間がないと、深い仕事に入りにくい。",
      prompt_cn: "如果没有整块时间，我很难进入深度工作。",
      primary_dimension: "focus_style",
      secondary_dimension: "pace_stability",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; focus condition only.",
      interpretation_boundary: "Interpret as concentration condition, not productivity diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["focus_style", "pace_stability"], weights: { focus_style: 5, pace_stability: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["focus_style", "pace_stability"], weights: { focus_style: 4, pace_stability: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["focus_style"], weights: { focus_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["switching_tolerance"], weights: { focus_style: 2, switching_tolerance: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["switching_tolerance"], weights: { focus_style: 1, switching_tolerance: 4 } }
      ]
    },
    {
      id: "F01_Q12",
      section: "B",
      question_type: "scale",
      prompt_jp: "複数のタスクを切り替えながら進める方が、気分が乗りやすい。",
      prompt_cn: "在多个任务之间切换推进时，我更容易进入状态。",
      primary_dimension: "switching_tolerance",
      secondary_dimension: "ideation_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; task-switching preference only.",
      interpretation_boundary: "Interpret as switching comfort, not attention ability.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["switching_tolerance", "ideation_style"], weights: { switching_tolerance: 5, ideation_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["switching_tolerance", "ideation_style"], weights: { switching_tolerance: 4, ideation_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["switching_tolerance"], weights: { switching_tolerance: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["focus_style"], weights: { switching_tolerance: 2, focus_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["focus_style"], weights: { switching_tolerance: 1, focus_style: 4 } }
      ]
    },
    {
      id: "F01_Q13",
      section: "B",
      question_type: "scale",
      prompt_jp: "締切が近い方が、集中力が一気に上がりやすい。",
      prompt_cn: "截止日期临近时，我的集中力更容易一下子提高。",
      primary_dimension: "pressure_activation",
      secondary_dimension: "stress_response",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; deadline response only.",
      interpretation_boundary: "Interpret as pressure activation, not chronic stress pattern.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["pressure_activation", "stress_response"], weights: { pressure_activation: 5, stress_response: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["pressure_activation", "stress_response"], weights: { pressure_activation: 4, stress_response: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["pressure_activation"], weights: { pressure_activation: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["pace_stability"], weights: { pressure_activation: 2, pace_stability: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["pace_stability"], weights: { pressure_activation: 1, pace_stability: 4 } }
      ]
    },
    {
      id: "F01_Q14",
      section: "B",
      question_type: "scale",
      prompt_jp: "毎日少しずつ積み上げる方が、安定して成果を出しやすい。",
      prompt_cn: "每天一点点积累时，我更容易稳定产出成果。",
      primary_dimension: "pace_stability",
      secondary_dimension: "execution_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; pace preference only.",
      interpretation_boundary: "Interpret as work rhythm, not discipline level.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["pace_stability", "execution_style"], weights: { pace_stability: 5, execution_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["pace_stability", "execution_style"], weights: { pace_stability: 4, execution_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["pace_stability"], weights: { pace_stability: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["pressure_activation"], weights: { pace_stability: 2, pressure_activation: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["pressure_activation"], weights: { pace_stability: 1, pressure_activation: 4 } }
      ]
    },
    {
      id: "F01_Q15",
      section: "B",
      question_type: "scale",
      prompt_jp: "作業の優先順位がはっきりしていると、迷わず進めやすい。",
      prompt_cn: "工作优先级明确时，我更容易不迷茫地推进。",
      primary_dimension: "structure_need",
      secondary_dimension: "execution_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; prioritization preference only.",
      interpretation_boundary: "Interpret as need for clarity, not weakness.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["structure_need", "execution_style"], weights: { structure_need: 5, execution_style: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["structure_need", "execution_style"], weights: { structure_need: 4, execution_style: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["structure_need"], weights: { structure_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { structure_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { structure_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q16",
      section: "B",
      question_type: "scale",
      prompt_jp: "予定が細かく決まりすぎていると、動きにくく感じる。",
      prompt_cn: "安排过于细致时，我会觉得不容易行动。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "structure_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; structure tolerance only.",
      interpretation_boundary: "Interpret as autonomy preference, not resistance to planning.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need", "structure_need"], weights: { autonomy_need: 5, structure_need: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need", "structure_need"], weights: { autonomy_need: 4, structure_need: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["structure_need"], weights: { autonomy_need: 2, structure_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["structure_need"], weights: { autonomy_need: 1, structure_need: 5 } }
      ]
    },
    {
      id: "F01_Q17",
      section: "B",
      question_type: "scale",
      prompt_jp: "朝・昼・夜で、仕事のしやすさにかなり差がある。",
      prompt_cn: "早上、中午、晚上之间，我的工作状态差异很大。",
      primary_dimension: "pace_stability",
      secondary_dimension: "environment_sensitivity",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; rhythm sensitivity only.",
      interpretation_boundary: "Interpret as time-of-day fit, not health or sleep diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["pace_stability", "environment_sensitivity"], weights: { pace_stability: 5, environment_sensitivity: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["pace_stability", "environment_sensitivity"], weights: { pace_stability: 4, environment_sensitivity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["pace_stability"], weights: { pace_stability: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { pace_stability: 2, stability_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { pace_stability: 1, stability_need: 4 } }
      ]
    },
    {
      id: "F01_Q18",
      section: "B",
      question_type: "scale",
      prompt_jp: "仕事中に話しかけられることが多いと、集中が戻りにくい。",
      prompt_cn: "工作中经常被打断时，我很难恢复集中。",
      primary_dimension: "focus_style",
      secondary_dimension: "environment_sensitivity",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; interruption sensitivity only.",
      interpretation_boundary: "Interpret as focus environment preference, not social ability.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["focus_style", "environment_sensitivity"], weights: { focus_style: 5, environment_sensitivity: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["focus_style", "environment_sensitivity"], weights: { focus_style: 4, environment_sensitivity: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["focus_style"], weights: { focus_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["switching_tolerance", "collaboration_style"], weights: { focus_style: 2, switching_tolerance: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["switching_tolerance", "collaboration_style"], weights: { focus_style: 1, switching_tolerance: 4 } }
      ]
    },
    {
      id: "F01_Q19",
      section: "B",
      question_type: "scale",
      prompt_jp: "まず動いてみてから考える方が、仕事が前に進みやすい。",
      prompt_cn: "先行动再思考时，我的工作更容易推进。",
      primary_dimension: "action_start",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; action style only.",
      interpretation_boundary: "Interpret as starting style, not recklessness.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["action_start", "autonomy_need"], weights: { action_start: 5, autonomy_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["action_start", "autonomy_need"], weights: { action_start: 4, autonomy_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["action_start"], weights: { action_start: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["structure_need"], weights: { action_start: 2, structure_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["structure_need"], weights: { action_start: 1, structure_need: 4 } }
      ]
    },
    {
      id: "F01_Q20",
      section: "B",
      question_type: "scale",
      prompt_jp: "じっくり準備してから動く方が、安心して成果を出しやすい。",
      prompt_cn: "充分准备之后再行动时，我更容易安心产出成果。",
      primary_dimension: "structure_need",
      secondary_dimension: "pace_stability",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; preparation style only.",
      interpretation_boundary: "Interpret as preparation preference, not slowness.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["structure_need", "pace_stability"], weights: { structure_need: 5, pace_stability: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["structure_need", "pace_stability"], weights: { structure_need: 4, pace_stability: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["structure_need"], weights: { structure_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_start"], weights: { structure_need: 2, action_start: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_start"], weights: { structure_need: 1, action_start: 4 } }
      ]
    },
    {
      id: "F01_Q21",
      section: "C",
      question_type: "scale",
      prompt_jp: "チームで相談しながら進める方が、安心して働きやすい。",
      prompt_cn: "和团队商量着推进时，我更容易安心工作。",
      primary_dimension: "collaboration_style",
      secondary_dimension: "feedback_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; team preference only.",
      interpretation_boundary: "Interpret as collaboration fit, not dependence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["collaboration_style", "feedback_need"], weights: { collaboration_style: 5, feedback_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["collaboration_style", "feedback_need"], weights: { collaboration_style: 4, feedback_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["collaboration_style"], weights: { collaboration_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need", "focus_style"], weights: { collaboration_style: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need", "focus_style"], weights: { collaboration_style: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q22",
      section: "C",
      question_type: "scale",
      prompt_jp: "ひとりで任せてもらえる方が、責任感を持って進めやすい。",
      prompt_cn: "被独立交付任务时，我更容易带着责任感推进。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "execution_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; responsibility style only.",
      interpretation_boundary: "Interpret as autonomy fit, not rejection of teamwork.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need", "execution_style"], weights: { autonomy_need: 5, execution_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need", "execution_style"], weights: { autonomy_need: 4, execution_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["collaboration_style"], weights: { autonomy_need: 2, collaboration_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["collaboration_style"], weights: { autonomy_need: 1, collaboration_style: 4 } }
      ]
    },
    {
      id: "F01_Q23",
      section: "C",
      question_type: "scale",
      prompt_jp: "会議では、話しながら考えがまとまることが多い。",
      prompt_cn: "在会议中，我常常边说边整理想法。",
      primary_dimension: "collaboration_style",
      secondary_dimension: "ideation_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; meeting style only.",
      interpretation_boundary: "Interpret as thinking style, not communication skill.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["collaboration_style", "ideation_style"], weights: { collaboration_style: 5, ideation_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["collaboration_style", "ideation_style"], weights: { collaboration_style: 4, ideation_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["collaboration_style"], weights: { collaboration_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["focus_style"], weights: { collaboration_style: 2, focus_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["focus_style"], weights: { collaboration_style: 1, focus_style: 4 } }
      ]
    },
    {
      id: "F01_Q24",
      section: "C",
      question_type: "scale",
      prompt_jp: "会議の前に考える時間がある方が、自分の意見を出しやすい。",
      prompt_cn: "开会前有思考时间时，我更容易表达自己的意见。",
      primary_dimension: "focus_style",
      secondary_dimension: "structure_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; preparation preference only.",
      interpretation_boundary: "Interpret as meeting preparation fit, not confidence level.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["focus_style", "structure_need"], weights: { focus_style: 5, structure_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["focus_style", "structure_need"], weights: { focus_style: 4, structure_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["focus_style"], weights: { focus_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["collaboration_style"], weights: { focus_style: 2, collaboration_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["collaboration_style"], weights: { focus_style: 1, collaboration_style: 4 } }
      ]
    },
    {
      id: "F01_Q25",
      section: "C",
      question_type: "scale",
      prompt_jp: "誰が何を担当するかが曖昧だと、仕事が進めにくい。",
      prompt_cn: "如果谁负责什么不明确，我会觉得工作难推进。",
      primary_dimension: "structure_need",
      secondary_dimension: "collaboration_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; role clarity preference only.",
      interpretation_boundary: "Interpret as collaboration clarity need, not rigidity.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["structure_need", "collaboration_style"], weights: { structure_need: 5, collaboration_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["structure_need", "collaboration_style"], weights: { structure_need: 4, collaboration_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["structure_need"], weights: { structure_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { structure_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { structure_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q26",
      section: "C",
      question_type: "scale",
      prompt_jp: "人の間に立って調整する役割を任されることが多い。",
      prompt_cn: "我经常被交付在不同人之间协调的角色。",
      primary_dimension: "collaboration_style",
      secondary_dimension: "repair_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; coordination pattern only.",
      interpretation_boundary: "Interpret as coordination tendency, not obligation to mediate.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["collaboration_style", "repair_style"], weights: { collaboration_style: 5, repair_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["collaboration_style", "repair_style"], weights: { collaboration_style: 4, repair_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["collaboration_style"], weights: { collaboration_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["focus_style"], weights: { collaboration_style: 2, focus_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["focus_style"], weights: { collaboration_style: 1, focus_style: 4 } }
      ]
    },
    {
      id: "F01_Q27",
      section: "C",
      question_type: "scale",
      prompt_jp: "雑談や小さな会話がある職場の方が、働きやすい。",
      prompt_cn: "有闲聊和小对话的职场，我更容易工作。",
      primary_dimension: "collaboration_style",
      secondary_dimension: "environment_sensitivity",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; social environment preference only.",
      interpretation_boundary: "Interpret as social environment fit, not personality type.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["collaboration_style", "environment_sensitivity"], weights: { collaboration_style: 5, environment_sensitivity: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["collaboration_style", "environment_sensitivity"], weights: { collaboration_style: 4, environment_sensitivity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["collaboration_style"], weights: { collaboration_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["focus_style"], weights: { collaboration_style: 2, focus_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["focus_style"], weights: { collaboration_style: 1, focus_style: 4 } }
      ]
    },
    {
      id: "F01_Q28",
      section: "C",
      question_type: "scale",
      prompt_jp: "静かで必要な時だけ話せる環境の方が、力を出しやすい。",
      prompt_cn: "安静、只在必要时沟通的环境，更容易让我发挥。",
      primary_dimension: "focus_style",
      secondary_dimension: "environment_sensitivity",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; environment preference only.",
      interpretation_boundary: "Interpret as work environment preference, not anti-social tendency.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["focus_style", "environment_sensitivity"], weights: { focus_style: 5, environment_sensitivity: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["focus_style", "environment_sensitivity"], weights: { focus_style: 4, environment_sensitivity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["focus_style"], weights: { focus_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["collaboration_style"], weights: { focus_style: 2, collaboration_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["collaboration_style"], weights: { focus_style: 1, collaboration_style: 4 } }
      ]
    },
    {
      id: "F01_Q29",
      section: "C",
      question_type: "scale",
      prompt_jp: "チームの雰囲気が悪いと、自分のパフォーマンスにも影響しやすい。",
      prompt_cn: "团队氛围不好时，我的表现也容易受影响。",
      primary_dimension: "environment_sensitivity",
      secondary_dimension: "collaboration_style",
      sensitivity_level: "medium",
      public_private_note: "aggregate only",
      risk_note: "Could touch workplace stress; keep non-diagnostic.",
      interpretation_boundary: "Interpret as environment sensitivity, not mental health or company judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["environment_sensitivity", "collaboration_style"], weights: { environment_sensitivity: 5, collaboration_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["environment_sensitivity", "collaboration_style"], weights: { environment_sensitivity: 4, collaboration_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["environment_sensitivity"], weights: { environment_sensitivity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { environment_sensitivity: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { environment_sensitivity: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q30",
      section: "C",
      question_type: "scale",
      prompt_jp: "相手の反応を見ながら進める仕事の方が、やりがいを感じやすい。",
      prompt_cn: "能一边看对方反应一边推进的工作，更容易让我感到有意义。",
      primary_dimension: "feedback_need",
      secondary_dimension: "collaboration_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; feedback interaction preference only.",
      interpretation_boundary: "Interpret as interaction preference, not validation dependency.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["feedback_need", "collaboration_style"], weights: { feedback_need: 5, collaboration_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["feedback_need", "collaboration_style"], weights: { feedback_need: 4, collaboration_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["feedback_need"], weights: { feedback_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { feedback_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { feedback_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q31",
      section: "D",
      question_type: "scale",
      prompt_jp: "良かった点を具体的に伝えてもらえると、次も頑張りやすい。",
      prompt_cn: "如果对方具体告诉我做得好的地方，我下次更容易继续努力。",
      primary_dimension: "feedback_need",
      secondary_dimension: "reassurance_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; feedback style only.",
      interpretation_boundary: "Interpret as feedback preference, not self-esteem diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["feedback_need", "reassurance_need"], weights: { feedback_need: 5, reassurance_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["feedback_need", "reassurance_need"], weights: { feedback_need: 4, reassurance_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["feedback_need"], weights: { feedback_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { feedback_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { feedback_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q32",
      section: "D",
      question_type: "scale",
      prompt_jp: "細かく見られすぎると、自分らしく動きにくくなる。",
      prompt_cn: "被看得太细时，我会难以按自己的方式行动。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "feedback_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; supervision preference only.",
      interpretation_boundary: "Interpret as autonomy boundary, not resistance to feedback.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need", "feedback_need"], weights: { autonomy_need: 5, feedback_need: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need", "feedback_need"], weights: { autonomy_need: 4, feedback_need: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["feedback_need", "structure_need"], weights: { autonomy_need: 2, feedback_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["feedback_need", "structure_need"], weights: { autonomy_need: 1, feedback_need: 5 } }
      ]
    },
    {
      id: "F01_Q33",
      section: "D",
      question_type: "scale",
      prompt_jp: "期待されている基準が見えると、安心して取り組める。",
      prompt_cn: "如果能看见被期待的标准，我会更安心地投入。",
      primary_dimension: "structure_need",
      secondary_dimension: "feedback_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; expectation clarity only.",
      interpretation_boundary: "Interpret as clarity need, not insecurity.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["structure_need", "feedback_need"], weights: { structure_need: 5, feedback_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["structure_need", "feedback_need"], weights: { structure_need: 4, feedback_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["structure_need"], weights: { structure_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { structure_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { structure_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q34",
      section: "D",
      question_type: "scale",
      prompt_jp: "結果だけでなく、過程も見てもらえると力が出やすい。",
      prompt_cn: "不只结果，如果过程也被看见，我更容易发挥。",
      primary_dimension: "feedback_need",
      secondary_dimension: "contribution_drive",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; recognition style only.",
      interpretation_boundary: "Interpret as recognition preference, not need for praise.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["feedback_need", "contribution_drive"], weights: { feedback_need: 5, contribution_drive: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["feedback_need", "contribution_drive"], weights: { feedback_need: 4, contribution_drive: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["feedback_need"], weights: { feedback_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { feedback_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { feedback_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q35",
      section: "D",
      question_type: "scale",
      prompt_jp: "厳しい指摘でも、改善点が具体的なら受け止めやすい。",
      prompt_cn: "即使是严格指出，如果改善点具体，我也比较容易接受。",
      primary_dimension: "feedback_need",
      secondary_dimension: "growth_motivation",
      sensitivity_level: "medium",
      public_private_note: "aggregate only",
      risk_note: "Feedback sensitivity; avoid harsh evaluation framing.",
      interpretation_boundary: "Interpret as actionable feedback preference, not toughness.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["feedback_need", "growth_motivation"], weights: { feedback_need: 5, growth_motivation: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["feedback_need", "growth_motivation"], weights: { feedback_need: 4, growth_motivation: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["feedback_need"], weights: { feedback_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reassurance_need"], weights: { feedback_need: 2, reassurance_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reassurance_need"], weights: { feedback_need: 1, reassurance_need: 4 } }
      ]
    },
    {
      id: "F01_Q36",
      section: "D",
      question_type: "scale",
      prompt_jp: "自分の判断を信じて任せてもらえると、やる気が出やすい。",
      prompt_cn: "当对方信任我的判断并交给我时，我更容易有动力。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "feedback_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; trust preference only.",
      interpretation_boundary: "Interpret as autonomy support, not dislike of management.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need", "feedback_need"], weights: { autonomy_need: 5, feedback_need: 3 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need", "feedback_need"], weights: { autonomy_need: 4, feedback_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["structure_need"], weights: { autonomy_need: 2, structure_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["structure_need"], weights: { autonomy_need: 1, structure_need: 4 } }
      ]
    },
    {
      id: "F01_Q37",
      section: "D",
      question_type: "scale",
      prompt_jp: "ほめられるより、次にどう良くするかを知りたい。",
      prompt_cn: "比起被表扬，我更想知道下一步如何做得更好。",
      primary_dimension: "growth_motivation",
      secondary_dimension: "feedback_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; growth feedback preference only.",
      interpretation_boundary: "Interpret as improvement orientation, not dissatisfaction.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["growth_motivation", "feedback_need"], weights: { growth_motivation: 5, feedback_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["growth_motivation", "feedback_need"], weights: { growth_motivation: 4, feedback_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["growth_motivation"], weights: { growth_motivation: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reassurance_need"], weights: { growth_motivation: 2, reassurance_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reassurance_need"], weights: { growth_motivation: 1, reassurance_need: 4 } }
      ]
    },
    {
      id: "F01_Q38",
      section: "D",
      question_type: "scale",
      prompt_jp: "何も反応がない状態が続くと、進め方が合っているか不安になりやすい。",
      prompt_cn: "如果一直没有反馈，我容易不安自己推进方式是否正确。",
      primary_dimension: "feedback_need",
      secondary_dimension: "reassurance_need",
      sensitivity_level: "medium",
      public_private_note: "aggregate only",
      risk_note: "May surface work reassurance need.",
      interpretation_boundary: "Interpret as feedback cadence need, not anxiety diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["feedback_need", "reassurance_need"], weights: { feedback_need: 5, reassurance_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["feedback_need", "reassurance_need"], weights: { feedback_need: 4, reassurance_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["feedback_need"], weights: { feedback_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { feedback_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { feedback_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q39",
      section: "D",
      question_type: "scale",
      prompt_jp: "数字や成果が見えると、自分の成長を感じやすい。",
      prompt_cn: "能看到数字或成果时，我更容易感到自己的成长。",
      primary_dimension: "feedback_need",
      secondary_dimension: "growth_motivation",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; progress signal preference only.",
      interpretation_boundary: "Interpret as measurable feedback preference, not income or success prediction.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["feedback_need", "growth_motivation"], weights: { feedback_need: 5, growth_motivation: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["feedback_need", "growth_motivation"], weights: { feedback_need: 4, growth_motivation: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["feedback_need"], weights: { feedback_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["purpose_drive"], weights: { feedback_need: 2, purpose_drive: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["purpose_drive"], weights: { feedback_need: 1, purpose_drive: 4 } }
      ]
    },
    {
      id: "F01_Q40",
      section: "D",
      question_type: "scale",
      prompt_jp: "自分の仕事が誰に届いているか見えると、続けやすい。",
      prompt_cn: "能看到自己的工作传递给谁时，我更容易持续。",
      primary_dimension: "contribution_drive",
      secondary_dimension: "purpose_drive",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; impact visibility preference only.",
      interpretation_boundary: "Interpret as impact motivation, not career worth.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["contribution_drive", "purpose_drive"], weights: { contribution_drive: 5, purpose_drive: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["contribution_drive", "purpose_drive"], weights: { contribution_drive: 4, purpose_drive: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["contribution_drive"], weights: { contribution_drive: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { contribution_drive: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { contribution_drive: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q41",
      section: "E",
      question_type: "scale",
      prompt_jp: "忙しさが続くと、まず集中力から落ちやすい。",
      prompt_cn: "忙碌持续时，我通常先从集中力开始下降。",
      primary_dimension: "stress_response",
      secondary_dimension: "focus_style",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Workload sensitivity; not health diagnosis.",
      interpretation_boundary: "Interpret as workload response, not medical or mental health symptom.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["stress_response", "focus_style"], weights: { stress_response: 5, focus_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["stress_response", "focus_style"], weights: { stress_response: 4, focus_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["stress_response"], weights: { stress_response: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["pressure_activation"], weights: { stress_response: 2, pressure_activation: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["pressure_activation"], weights: { stress_response: 1, pressure_activation: 4 } }
      ]
    },
    {
      id: "F01_Q42",
      section: "E",
      question_type: "scale",
      prompt_jp: "負荷が高い時ほど、やることを整理すると落ち着きやすい。",
      prompt_cn: "负荷高时，把要做的事整理清楚会让我更容易稳定下来。",
      primary_dimension: "stress_response",
      secondary_dimension: "structure_need",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Stress-related but non-clinical.",
      interpretation_boundary: "Interpret as work-load management preference, not treatment advice.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["stress_response", "structure_need"], weights: { stress_response: 5, structure_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["stress_response", "structure_need"], weights: { stress_response: 4, structure_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["stress_response"], weights: { stress_response: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { stress_response: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { stress_response: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q43",
      section: "E",
      question_type: "scale",
      prompt_jp: "人と話すことで、仕事の疲れが軽くなることがある。",
      prompt_cn: "和别人聊一聊时，工作疲惫有时会减轻。",
      primary_dimension: "recovery_style",
      secondary_dimension: "collaboration_style",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Recovery style only; avoid mental health framing.",
      interpretation_boundary: "Interpret as recovery preference, not therapy or treatment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_style", "collaboration_style"], weights: { recovery_style: 5, collaboration_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_style", "collaboration_style"], weights: { recovery_style: 4, collaboration_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_style"], weights: { recovery_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need", "focus_style"], weights: { recovery_style: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need", "focus_style"], weights: { recovery_style: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q44",
      section: "E",
      question_type: "scale",
      prompt_jp: "ひとりになる時間があると、仕事の疲れを戻しやすい。",
      prompt_cn: "有独处时间时，我更容易从工作疲惫中恢复。",
      primary_dimension: "recovery_style",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Recovery preference only.",
      interpretation_boundary: "Interpret as recovery style, not isolation or avoidance.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_style", "autonomy_need"], weights: { recovery_style: 5, autonomy_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_style", "autonomy_need"], weights: { recovery_style: 4, autonomy_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_style"], weights: { recovery_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["collaboration_style"], weights: { recovery_style: 2, collaboration_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["collaboration_style"], weights: { recovery_style: 1, collaboration_style: 4 } }
      ]
    },
    {
      id: "F01_Q45",
      section: "E",
      question_type: "scale",
      prompt_jp: "急な変更が続くと、仕事のペースを立て直しにくい。",
      prompt_cn: "突发变更持续时，我很难重新建立工作节奏。",
      primary_dimension: "environment_sensitivity",
      secondary_dimension: "pace_stability",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Change sensitivity; keep non-diagnostic.",
      interpretation_boundary: "Interpret as change tolerance and rhythm fit, not adaptability judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["environment_sensitivity", "pace_stability"], weights: { environment_sensitivity: 5, pace_stability: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["environment_sensitivity", "pace_stability"], weights: { environment_sensitivity: 4, pace_stability: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["environment_sensitivity"], weights: { environment_sensitivity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["switching_tolerance"], weights: { environment_sensitivity: 2, switching_tolerance: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["switching_tolerance"], weights: { environment_sensitivity: 1, switching_tolerance: 4 } }
      ]
    },
    {
      id: "F01_Q46",
      section: "E",
      question_type: "scale",
      prompt_jp: "変化が多い状況でも、その場で考えながら進める方が得意だ。",
      prompt_cn: "即使变化很多，我也比较擅长边应对边推进。",
      primary_dimension: "switching_tolerance",
      secondary_dimension: "stress_response",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; change response only.",
      interpretation_boundary: "Interpret as change comfort, not guaranteed crisis performance.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["switching_tolerance", "stress_response"], weights: { switching_tolerance: 5, stress_response: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["switching_tolerance", "stress_response"], weights: { switching_tolerance: 4, stress_response: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["switching_tolerance"], weights: { switching_tolerance: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["pace_stability"], weights: { switching_tolerance: 2, pace_stability: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["pace_stability"], weights: { switching_tolerance: 1, pace_stability: 4 } }
      ]
    },
    {
      id: "F01_Q47",
      section: "E",
      question_type: "scale",
      prompt_jp: "忙しい時ほど、周りに頼るより自分で抱えやすい。",
      prompt_cn: "越忙的时候，比起依靠别人，我越容易自己扛着。",
      primary_dimension: "stress_response",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Workload coping; avoid clinical framing.",
      interpretation_boundary: "Interpret as load-sharing tendency, not unhealthy coping diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["stress_response", "autonomy_need"], weights: { stress_response: 5, autonomy_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["stress_response", "autonomy_need"], weights: { stress_response: 4, autonomy_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["stress_response"], weights: { stress_response: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["collaboration_style"], weights: { stress_response: 2, collaboration_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["collaboration_style"], weights: { stress_response: 1, collaboration_style: 4 } }
      ]
    },
    {
      id: "F01_Q48",
      section: "E",
      question_type: "scale",
      prompt_jp: "早めに相談できる相手がいると、負荷が高い時も崩れにくい。",
      prompt_cn: "有能早些商量的人时，即使负荷高也不容易被压垮。",
      primary_dimension: "recovery_style",
      secondary_dimension: "collaboration_style",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Work support preference only.",
      interpretation_boundary: "Interpret as support preference, not dependency or mental health need.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_style", "collaboration_style"], weights: { recovery_style: 5, collaboration_style: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_style", "collaboration_style"], weights: { recovery_style: 4, collaboration_style: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_style"], weights: { recovery_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { recovery_style: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { recovery_style: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q49",
      section: "E",
      question_type: "scale",
      prompt_jp: "仕事の後に気持ちを切り替える時間がないと、疲れが残りやすい。",
      prompt_cn: "工作后如果没有切换心情的时间，我容易残留疲惫。",
      primary_dimension: "recovery_style",
      secondary_dimension: "environment_sensitivity",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Recovery and fatigue; not health diagnosis.",
      interpretation_boundary: "Interpret as decompression need, not medical or psychological symptom.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_style", "environment_sensitivity"], weights: { recovery_style: 5, environment_sensitivity: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_style", "environment_sensitivity"], weights: { recovery_style: 4, environment_sensitivity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_style"], weights: { recovery_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["pressure_activation"], weights: { recovery_style: 2, pressure_activation: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["pressure_activation"], weights: { recovery_style: 1, pressure_activation: 4 } }
      ]
    },
    {
      id: "F01_Q50",
      section: "E",
      question_type: "scale",
      prompt_jp: "負荷が高い時でも、目的がはっきりしていると踏ん張りやすい。",
      prompt_cn: "即使负荷高，只要目的明确，我更容易坚持。",
      primary_dimension: "purpose_drive",
      secondary_dimension: "stress_response",
      sensitivity_level: "medium",
      public_private_note: "aggregate only",
      risk_note: "Stress-related but non-clinical.",
      interpretation_boundary: "Interpret as purpose support under load, not endurance judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["purpose_drive", "stress_response"], weights: { purpose_drive: 5, stress_response: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["purpose_drive", "stress_response"], weights: { purpose_drive: 4, stress_response: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["purpose_drive"], weights: { purpose_drive: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["recovery_style"], weights: { purpose_drive: 2, recovery_style: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["recovery_style"], weights: { purpose_drive: 1, recovery_style: 4 } }
      ]
    },
    {
      id: "F01_Q51",
      section: "F",
      question_type: "scale",
      prompt_jp: "新しいことを学べる環境だと、仕事への前向きさが続きやすい。",
      prompt_cn: "能学习新东西的环境，会让我更容易保持对工作的积极性。",
      primary_dimension: "growth_motivation",
      secondary_dimension: "environment_sensitivity",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; learning preference only.",
      interpretation_boundary: "Interpret as growth environment preference, not career success prediction.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["growth_motivation", "environment_sensitivity"], weights: { growth_motivation: 5, environment_sensitivity: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["growth_motivation", "environment_sensitivity"], weights: { growth_motivation: 4, environment_sensitivity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["growth_motivation"], weights: { growth_motivation: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { growth_motivation: 2, stability_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { growth_motivation: 1, stability_need: 4 } }
      ]
    },
    {
      id: "F01_Q52",
      section: "F",
      question_type: "scale",
      prompt_jp: "変化よりも、安定した環境で力を磨く方が合っている。",
      prompt_cn: "比起变化，我更适合在稳定环境中打磨能力。",
      primary_dimension: "stability_need",
      secondary_dimension: "growth_motivation",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; stability preference only.",
      interpretation_boundary: "Interpret as environment fit, not lack of ambition.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["stability_need", "growth_motivation"], weights: { stability_need: 5, growth_motivation: 3 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["stability_need", "growth_motivation"], weights: { stability_need: 4, growth_motivation: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["stability_need"], weights: { stability_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["switching_tolerance", "ideation_style"], weights: { stability_need: 2, switching_tolerance: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["switching_tolerance", "ideation_style"], weights: { stability_need: 1, switching_tolerance: 4 } }
      ]
    },
    {
      id: "F01_Q53",
      section: "F",
      question_type: "scale",
      prompt_jp: "自分で決められる範囲が広いほど、仕事に責任を持ちやすい。",
      prompt_cn: "自己能决定的范围越大，我越容易对工作有责任感。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "execution_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; autonomy and ownership only.",
      interpretation_boundary: "Interpret as autonomy ownership, not entrepreneurship fit.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need", "execution_style"], weights: { autonomy_need: 5, execution_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need", "execution_style"], weights: { autonomy_need: 4, execution_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["structure_need"], weights: { autonomy_need: 2, structure_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["structure_need"], weights: { autonomy_need: 1, structure_need: 4 } }
      ]
    },
    {
      id: "F01_Q54",
      section: "F",
      question_type: "scale",
      prompt_jp: "ルールや手順が整っている環境の方が、安心して成果を出しやすい。",
      prompt_cn: "规则和流程清晰的环境，更容易让我安心产出成果。",
      primary_dimension: "structure_need",
      secondary_dimension: "stability_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; structured environment preference only.",
      interpretation_boundary: "Interpret as workflow fit, not dependency on rules.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["structure_need", "stability_need"], weights: { structure_need: 5, stability_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["structure_need", "stability_need"], weights: { structure_need: 4, stability_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["structure_need"], weights: { structure_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { structure_need: 2, autonomy_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { structure_need: 1, autonomy_need: 4 } }
      ]
    },
    {
      id: "F01_Q55",
      section: "F",
      question_type: "scale",
      prompt_jp: "速く変わる環境にいると、自分の成長を感じやすい。",
      prompt_cn: "身处变化快的环境时，我更容易感到自己在成长。",
      primary_dimension: "switching_tolerance",
      secondary_dimension: "growth_motivation",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; growth environment preference only.",
      interpretation_boundary: "Interpret as change-growth fit, not startup or company-size recommendation.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["switching_tolerance", "growth_motivation"], weights: { switching_tolerance: 5, growth_motivation: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["switching_tolerance", "growth_motivation"], weights: { switching_tolerance: 4, growth_motivation: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["switching_tolerance"], weights: { switching_tolerance: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { switching_tolerance: 2, stability_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { switching_tolerance: 1, stability_need: 4 } }
      ]
    },
    {
      id: "F01_Q56",
      section: "F",
      question_type: "scale",
      prompt_jp: "仕事の進め方を自分で改善していくのが好きだ。",
      prompt_cn: "我喜欢自己改善工作的推进方式。",
      primary_dimension: "growth_motivation",
      secondary_dimension: "execution_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; improvement orientation only.",
      interpretation_boundary: "Interpret as process improvement preference, not job performance.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["growth_motivation", "execution_style"], weights: { growth_motivation: 5, execution_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["growth_motivation", "execution_style"], weights: { growth_motivation: 4, execution_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["growth_motivation"], weights: { growth_motivation: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["structure_need"], weights: { growth_motivation: 2, structure_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["structure_need"], weights: { growth_motivation: 1, structure_need: 4 } }
      ]
    },
    {
      id: "F01_Q57",
      section: "F",
      question_type: "scale",
      prompt_jp: "周囲の音や空気感によって、仕事のしやすさが変わりやすい。",
      prompt_cn: "周围声音或氛围会明显影响我工作是否顺手。",
      primary_dimension: "environment_sensitivity",
      secondary_dimension: "focus_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Environment sensitivity only; not sensory diagnosis.",
      interpretation_boundary: "Interpret as environment fit, not medical or psychological trait.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["environment_sensitivity", "focus_style"], weights: { environment_sensitivity: 5, focus_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["environment_sensitivity", "focus_style"], weights: { environment_sensitivity: 4, focus_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["environment_sensitivity"], weights: { environment_sensitivity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["switching_tolerance"], weights: { environment_sensitivity: 2, switching_tolerance: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["switching_tolerance"], weights: { environment_sensitivity: 1, switching_tolerance: 4 } }
      ]
    },
    {
      id: "F01_Q58",
      section: "F",
      question_type: "scale",
      prompt_jp: "仕事では、自由さよりも安心して続けられることを重視したい。",
      prompt_cn: "工作中，比起自由度，我更重视能安心持续。",
      primary_dimension: "stability_need",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; stability-autonomy preference only.",
      interpretation_boundary: "Interpret as preference, not career ambition or risk tolerance judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["stability_need", "autonomy_need"], weights: { stability_need: 5, autonomy_need: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["stability_need", "autonomy_need"], weights: { stability_need: 4, autonomy_need: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["stability_need"], weights: { stability_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { stability_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { stability_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "F01_Q59",
      section: "F",
      question_type: "scale",
      prompt_jp: "自分の得意なやり方を見つけると、仕事がかなり楽になる。",
      prompt_cn: "找到自己擅长的工作方式后，我会觉得工作轻松很多。",
      primary_dimension: "workstyle_awareness",
      secondary_dimension: "growth_motivation",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; self-understanding motivation only.",
      interpretation_boundary: "Interpret as value of workstyle awareness, not cure-all.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["workstyle_awareness", "growth_motivation"], weights: { workstyle_awareness: 5, growth_motivation: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["workstyle_awareness", "growth_motivation"], weights: { workstyle_awareness: 4, growth_motivation: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["workstyle_awareness"], weights: { workstyle_awareness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["structure_need"], weights: { workstyle_awareness: 2, structure_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["structure_need"], weights: { workstyle_awareness: 1, structure_need: 4 } }
      ]
    },
    {
      id: "F01_Q60",
      section: "F",
      question_type: "scale",
      prompt_jp: "今の働き方が合っているかどうかを、定期的に見直したい。",
      prompt_cn: "我想定期回看现在的工作方式是否适合自己。",
      primary_dimension: "workstyle_awareness",
      secondary_dimension: "repeat_value",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; review intent only.",
      interpretation_boundary: "Interpret as review interest, not dissatisfaction with current job.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["workstyle_awareness", "repeat_value"], weights: { workstyle_awareness: 5, repeat_value: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["workstyle_awareness", "repeat_value"], weights: { workstyle_awareness: 4, repeat_value: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["workstyle_awareness"], weights: { workstyle_awareness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { workstyle_awareness: 2, stability_need: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { workstyle_awareness: 1, stability_need: 4 } }
      ]
    }
  ],

  result_types: [
    { id:"F01_A", display_name_jp:"静かに深める", display_name_cn:"安静深耕型", short_label_jp:"深く集中", share_card_line_jp:"集中できる環境で、力が深まりやすい。" },
    { id:"F01_B", display_name_jp:"リズムで積み上げる", display_name_cn:"节奏积累型", short_label_jp:"積み上げ型", share_card_line_jp:"毎日のリズムが、成果の土台になる。" },
    { id:"F01_C", display_name_jp:"人と動かす", display_name_cn:"协作推动型", short_label_jp:"チーム推進", share_card_line_jp:"人と関わるほど、仕事が動き出す。" },
    { id:"F01_D", display_name_jp:"自由に広げる", display_name_cn:"自由拓展型", short_label_jp:"自由発想", share_card_line_jp:"余白があるほど、アイデアが広がる。" },
    { id:"F01_E", display_name_jp:"整えて進める", display_name_cn:"结构推进型", short_label_jp:"整理推進", share_card_line_jp:"見通しがあると、安心して進める。" },
    { id:"F01_F", display_name_jp:"反応で伸びる", display_name_cn:"反馈成长型", short_label_jp:"反応成長", share_card_line_jp:"反応が見えるほど、次に進みやすい。" },
    { id:"F01_G", display_name_jp:"変化を楽しむ", display_name_cn:"变化驱动型", short_label_jp:"変化推進", share_card_line_jp:"変化の中で、力が動き出す。" },
    { id:"F01_H", display_name_jp:"安心して力を出す", display_name_cn:"安心发挥型", short_label_jp:"安心安定", share_card_line_jp:"安心できる土台があるほど、力を出しやすい。" }
  ],

  result_assignment_rules: {
    F01_A: {
      display_name_jp: "静かに深める",
      primary_trigger_dimensions: ["focus_style", "autonomy_need"],
      secondary_trigger_dimensions: ["environment_sensitivity", "execution_style"],
      confidence_requirement: "medium_or_high",
      forbidden_interpretation: "Do not say the user cannot work with people."
    },
    F01_B: {
      display_name_jp: "リズムで積み上げる",
      primary_trigger_dimensions: ["pace_stability", "execution_style"],
      secondary_trigger_dimensions: ["stability_need", "structure_need"],
      confidence_requirement: "medium_or_high",
      forbidden_interpretation: "Do not say the user lacks creativity."
    },
    F01_C: {
      display_name_jp: "人と動かす",
      primary_trigger_dimensions: ["collaboration_style", "contribution_drive"],
      secondary_trigger_dimensions: ["feedback_need", "energy_source"],
      confidence_requirement: "medium_or_high",
      forbidden_interpretation: "Do not say the user depends on others."
    },
    F01_D: {
      display_name_jp: "自由に広げる",
      primary_trigger_dimensions: ["autonomy_need", "ideation_style"],
      secondary_trigger_dimensions: ["growth_motivation", "switching_tolerance"],
      confidence_requirement: "medium_or_high",
      forbidden_interpretation: "Do not say the user should freelance, start a business, or avoid companies."
    },
    F01_E: {
      display_name_jp: "整えて進める",
      primary_trigger_dimensions: ["structure_need", "execution_style"],
      secondary_trigger_dimensions: ["pace_stability", "feedback_need"],
      confidence_requirement: "medium_or_high",
      forbidden_interpretation: "Do not say the user is rigid."
    },
    F01_F: {
      display_name_jp: "反応で伸びる",
      primary_trigger_dimensions: ["feedback_need", "growth_motivation"],
      secondary_trigger_dimensions: ["contribution_drive", "purpose_drive"],
      confidence_requirement: "medium_or_high",
      forbidden_interpretation: "Do not say the user needs praise to work."
    },
    F01_G: {
      display_name_jp: "変化を楽しむ",
      primary_trigger_dimensions: ["switching_tolerance", "growth_motivation"],
      secondary_trigger_dimensions: ["ideation_style", "pressure_activation"],
      confidence_requirement: "medium_or_high",
      forbidden_interpretation: "Do not say the user must choose startup, high-change, or unstable environments."
    },
    F01_H: {
      display_name_jp: "安心して力を出す",
      primary_trigger_dimensions: ["stability_need", "reassurance_need", "recovery_style"],
      secondary_trigger_dimensions: ["structure_need", "environment_sensitivity"],
      confidence_requirement: "low_or_medium_or_high",
      forbidden_interpretation: "Do not say the user is weak, risk-averse, or not ambitious."
    }
  },

  free_result_config: {
    order: ["score", "type", "strength_1", "strength_2", "friction_1", "environment_direction", "paid_teaser", "core_bridge", "share_card"],
    score_label_jp: "働き方フィット参考スコア",
    share_cta_jp: "この働き方タイプをシェアする",
    core_bridge_copy_jp: "働き方の相性は、今の状態とも関係します。まず自分の Life-State を見ておくと、仕事の悩み方も少し整理しやすくなります。"
  },

  paid_teaser_config: {
    report_name_jp: "働き方リズム深掘りレポート",
    promise_jp: "あなたに合いやすい働き方、力を出しやすい環境、feedback の受け取り方、負荷が高い時の戻り方を整理します。",
    forbidden_copy: [
      "あなたはこの職業に向いています",
      "今の仕事を辞めるべきです",
      "起業すべきです",
      "年収が上がります",
      "成功できます"
    ]
  },

  share_card_config: {
    versions: {
      type_focus: {
        card_title_jp: "向いている働き方診断",
        visible_fields: ["type_label", "safe_one_line", "qr_or_link"],
        forbidden_fields: ["stress_details", "weak_points", "private_answers", "paid_report_content"]
      },
      score_focus: {
        card_title_jp: "働き方フィット参考スコア",
        visible_fields: ["score", "type_label", "one_safe_strength"],
        forbidden_fields: ["career_advice", "resignation_implication", "salary_implication"]
      }
    }
  },

  consent_copy: {
    boundary_jp: "この診断は、転職・退職・職業選択を決めるものではありません。",
    save_copy_jp: "結果を保存する場合は、保存範囲を確認してください。",
    reminder_opt_in_jp: "リマインドは希望した場合のみ受け取れます。"
  },

  recommendation_mapping: [
    { recommendation_type:"C02 今のわたしチェック", trigger_condition:"low confidence or high stress/recovery signal", reason_copy_jp:"働き方の前に、今の状態も軽く見てみませんか。", commercial_status:"free / core", disclosure_needed:false },
    { recommendation_type:"120問ライフステート診断", trigger_condition:"deep self-understanding intent", reason_copy_jp:"仕事の悩み方の奥にある Life-State を深く見られます。", commercial_status:"free / core or report bridge", disclosure_needed:false },
    { recommendation_type:"F02 職場環境フィット診断", trigger_condition:"high environment_sensitivity or structure/autonomy signal", reason_copy_jp:"働き方だけでなく、合いやすい職場環境も見てみませんか。", commercial_status:"free / later paid report", disclosure_needed:false },
    { recommendation_type:"働き方リズム深掘りレポート", trigger_condition:"paid report CTA click", reason_copy_jp:"あなたに合いやすい働き方を、もう少し深く整理できます。", commercial_status:"paid report", disclosure_needed:true }
  ],

  line_web_return_path: {
    save_after_completion: { copy_jp:"結果を保存する", rule:"Do not claim account/cloud save unless actually available." },
    seven_day_follow_up: { opt_in_required:true, copy_jp:"仕事の進め方で、今週少し試せたことはありますか？" },
    thirty_day_follow_up: { opt_in_required:true, copy_jp:"前回の診断から少し時間が経ちました。働き方のリズム、今は変わっているかもしれません。" },
    disturbance_prevention: ["Default reminders off.", "Separate opt-in required.", "No fear copy."]
  },

  ux_notes: {
    mobile_first_flow: "One question per screen or compact cards.",
    progress_behavior: "Show section title and 1/60 progress.",
    section_break_behavior: "Show section break copy after every 10 questions.",
    result_reveal_behavior: "Show type first, then two strengths, one friction point, one environment direction.",
    share_behavior: "Only share public-safe type and one-line description.",
    retake_behavior: "Recommend 30-90 day retake or after job/team/project change.",
    anti_supermarket_rule: "Only show 1-2 next recommendations."
  },

  risk_notes: [
    "No medical or psychological diagnosis.",
    "No symptom screening.",
    "No treatment advice.",
    "No specific career decision.",
    "No resignation advice.",
    "No income, promotion, or success prediction.",
    "No fake expert claim.",
    "No fake urgency, scarcity, or discount.",
    "No hidden affiliate-style recommendation.",
    "No private vulnerability in share cards."
  ]
};
```

## 17. Final Status

output_status: md_review_file_created
file_name: F01_muiteiru_hatarakikata_shindan_v1_0.md
founder_review_needed: yes
trust_risk_review_needed: yes
codex_needed: no
codex_ready: false
next_recommended_action: founder_and_trust_risk_review_before_next_test_md
