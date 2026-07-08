---
file_id: F02_shokuba_kankyou_fit_shindan_v1_0

test_id: F02
test_name_jp: 職場環境フィット診断
test_name_cn: 职场环境适配诊断
layer: Yorisou Fit / Work
version: v1.0
status: draft_test_spec
codex_ready: false
founder_review_needed: true
trust_risk_review_needed: true
created_for: Yorisou Test Product System
---

# F02_shokuba_kankyou_fit_shindan_v1_0.md

## File Status

output_type: md_review_asset
asset_type: long_form_work_environment_fit_test
test_id: F02
version: v1.0
codex_ready: false
founder_review_needed: true
trust_risk_review_needed: true
implementation_status: not_implemented
publication_status: not_published

## 1. Test Product Summary

test_id: F02
test_name_jp: 職場環境フィット診断
test_name_cn: 职场环境适配诊断
layer: Yorisou Fit / Work
category: work environment fit / self-understanding
primary_role: identify workplace environment tendencies that support stability, focus, collaboration, recovery, and sustainable performance
secondary_role: support Work/Fit test system with F01 and recommendation graph signals
format: 60-question structured self-reflection test
question_count: 60
section_count: 6
questions_per_section: 10
options_per_question: 5
commercial_role: free result, paid report preview, work/environment recommendation signal, routing to F01/C02/main 120-question test
not_a_role: career decision test, company matching test, job change instruction, resignation advice, professional vocational assessment, income prediction, success/failure prediction

F02 is a long-form workplace environment fit test. It helps users reflect on what kinds of work environments may make it easier for them to focus, collaborate, stabilize, recover, and continue. It does not tell users which company, industry, job title, employment form, or career decision they should choose.

F02 must stay distinct from F01:

* F01 = 向いている働き方診断, focused on personal work style, rhythm, and collaboration preference.
* F02 = 職場環境フィット診断, focused on environmental, organizational, team, policy, space, and feedback conditions.

## 2. Landing Page Copy

### Japanese

title: 職場環境フィット診断
subtitle: あなたが力を出しやすい職場環境の傾向を、静かに見てみる。
description: この診断は、会社名や職種を決めるものではありません。音・空間・チーム距離・裁量・評価・回復しやすさなどから、あなたが働きやすい環境の手がかりを整理します。
primary_cta: 診断をはじめる
secondary_cta: 向いている働き方診断を見る
microcopy: 結果は職業判断ではなく、自分を理解し、職場条件を比較するための参考です。

### Chinese

title: 职场环境适配诊断
subtitle: 轻轻看见你更容易发挥的职场环境倾向。
description: 本诊断不会告诉你应该去哪家公司、行业或职位。它会从声音、空间、团队距离、裁量、规则、反馈、恢复方式等角度，整理你更容易稳定发挥的环境线索。
primary_cta: 开始诊断
secondary_cta: 查看适合的工作方式诊断
microcopy: 结果不是职业建议，而是用于自我理解和职场条件比较的参考。

## 3. Consent / Privacy / Boundary Notes

* F02 does not ask for employer name, company name, salary, address, legal name, manager name, coworker name, medical data, or resignation intent.
* Users should not enter confidential workplace information.
* Results must not say the user is suited or unsuited to a specific company, industry, role, remote work, large company, startup, or employment type.
* Results must not tell the user to quit, change jobs, stay, confront someone, or make a financial/career decision.
* Results must not predict income, promotion, success, failure, burnout, or relationship outcomes at work.
* Results may describe likely environment tendencies, possible energy drains, comparison criteria, and self-reflection prompts.
* Results are reference material for self-understanding and career conversations only.
* Paid report copy must avoid pressure, fear, urgency, or career certainty.
* Recommendation signals must remain broad and non-commercial unless separately reviewed.

Japanese boundary copy:
「この診断は、転職・退職・職種選びを決めるものではありません。あなたが力を出しやすい環境の傾向を、自己理解と対話の参考として整理するものです。」

Chinese boundary copy:
「本诊断不会决定你是否应该换工作、离职或选择某个职业。它只是帮助你整理更容易发挥和更容易消耗的环境倾向，作为自我理解与职业对话的参考。」

## 4. Section Structure

### Section 1: 音・空間・集中環境

Focus: sensory environment, space, noise, focus depth, remote/onsite spatial fit.

### Section 2: チーム距離とコミュニケーション

Focus: team distance, communication density, collaboration rhythm, conflict noise.

### Section 3: 裁量・ルール・意思決定

Focus: autonomy, structure, rules, decision speed, role boundaries.

### Section 4: 評価・フィードバック・安心感

Focus: feedback clarity, psychological safety, evaluation rhythm, growth cues.

### Section 5: 変化・スピード・負荷

Focus: change tolerance, workload rhythm, speed, uncertainty, load signals.

### Section 6: 回復・継続・環境調整

Focus: recovery environment, long-term sustainability, adjustment needs, hybrid/remote/on-site fit.

## 5. Human-Readable Question Set

### Section 1: 音・空間・集中環境

#### F02_Q01

id: F02_Q01
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 作業に集中したいとき、まわりの音はどのくらい影響しますか？
prompt_cn: 想集中工作时，周围声音对你影响多大？
primary_dimension: sensory_environment_fit
secondary_dimension: focus_environment_need
sensitivity_level: low
public_private_note: public-safe if aggregated; individual answer is private preference
risk_note: must not imply medical sensory sensitivity
interpretation_boundary: workplace preference only, not diagnosis
options:

* A: label_jp: 音があってもあまり気にならない / label_cn: 有声音也不太在意 / score_tags: [sound_tolerant, open_space_fit] / weights: { sensory_environment_fit: -2, focus_environment_need: -1 }
* B: label_jp: 少し気になるが、慣れれば大丈夫 / label_cn: 有点在意，但习惯后可以 / score_tags: [moderate_sound_tolerance] / weights: { sensory_environment_fit: -1, focus_environment_need: 0 }
* C: label_jp: 内容によって集中しやすさが変わる / label_cn: 会根据声音内容影响集中 / score_tags: [context_sensitive] / weights: { sensory_environment_fit: 1, focus_environment_need: 1 }
* D: label_jp: 静かな場所のほうがかなり集中しやすい / label_cn: 安静场所明显更容易集中 / score_tags: [quiet_preference] / weights: { sensory_environment_fit: 2, focus_environment_need: 2 }
* E: label_jp: 音が多い環境では消耗しやすい / label_cn: 声音多的环境容易消耗 / score_tags: [noise_drain, deep_focus_need] / weights: { sensory_environment_fit: 3, focus_environment_need: 3 }

#### F02_Q02

id: F02_Q02
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 机や席まわりの状態は、仕事の入りやすさにどのくらい関係しますか？
prompt_cn: 桌面和座位周围的状态，对你进入工作有多大影响？
primary_dimension: focus_environment_need
secondary_dimension: recovery_environment_need
sensitivity_level: low
public_private_note: private preference, safe in summary
risk_note: avoid judging neatness as personality
interpretation_boundary: environment tendency only
options:

* A: label_jp: どんな場所でもすぐ始めやすい / label_cn: 基本什么地方都能开始 / score_tags: [portable_focus] / weights: { focus_environment_need: -2, recovery_environment_need: -1 }
* B: label_jp: 最低限の場所があれば大丈夫 / label_cn: 有基本空间就可以 / score_tags: [basic_space_ok] / weights: { focus_environment_need: -1, recovery_environment_need: 0 }
* C: label_jp: 整っていると入りやすい / label_cn: 环境整齐会更容易进入 / score_tags: [space_support] / weights: { focus_environment_need: 1, recovery_environment_need: 1 }
* D: label_jp: 机や席が乱れると集中しにくい / label_cn: 桌面座位混乱会影响集中 / score_tags: [organized_space_need] / weights: { focus_environment_need: 2, recovery_environment_need: 1 }
* E: label_jp: 空間が合わないとかなり消耗する / label_cn: 空间不合适会很消耗 / score_tags: [space_drain] / weights: { focus_environment_need: 3, recovery_environment_need: 2 }

#### F02_Q03

id: F02_Q03
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: オープンスペースでの作業は、あなたにとってどんな感覚ですか？
prompt_cn: 在开放空间工作，对你来说是什么感觉？
primary_dimension: sensory_environment_fit
secondary_dimension: team_distance_preference
sensitivity_level: low
public_private_note: public-safe in aggregate
risk_note: do not frame open office as objectively good/bad
interpretation_boundary: preference only
options:

* A: label_jp: 人の気配があるほうが動きやすい / label_cn: 有人在旁边反而更容易动起来 / score_tags: [open_space_fit, team_energy] / weights: { sensory_environment_fit: -2, team_distance_preference: 2 }
* B: label_jp: ほどよい活気なら合いやすい / label_cn: 适度活跃比较合适 / score_tags: [moderate_open_space] / weights: { sensory_environment_fit: -1, team_distance_preference: 1 }
* C: label_jp: 作業内容によって変わる / label_cn: 根据工作内容变化 / score_tags: [task_dependent] / weights: { sensory_environment_fit: 0, team_distance_preference: 0 }
* D: label_jp: 人の動きが多いと集中しにくい / label_cn: 人的移动多会难集中 / score_tags: [movement_sensitive] / weights: { sensory_environment_fit: 2, team_distance_preference: -1 }
* E: label_jp: 見られている感じが続くと疲れやすい / label_cn: 持续被看见的感觉会疲惫 / score_tags: [visibility_drain, boundary_need] / weights: { sensory_environment_fit: 3, team_distance_preference: -2 }

#### F02_Q04

id: F02_Q04
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 深く考える作業をするとき、必要な環境はどれに近いですか？
prompt_cn: 做深度思考工作时，你需要的环境更接近哪种？
primary_dimension: focus_environment_need
secondary_dimension: remote_onsite_fit
sensitivity_level: low
public_private_note: private work preference
risk_note: remote preference must not become career instruction
interpretation_boundary: work condition reference only
options:

* A: label_jp: 人と話しながら考えるほうが進む / label_cn: 边和人说边想更能推进 / score_tags: [collaborative_focus] / weights: { focus_environment_need: -2, remote_onsite_fit: -1 }
* B: label_jp: 近くに人がいても集中できる / label_cn: 身边有人也能集中 / score_tags: [onsite_focus_ok] / weights: { focus_environment_need: -1, remote_onsite_fit: -1 }
* C: label_jp: 短時間なら場所を選ばない / label_cn: 短时间内不太挑地点 / score_tags: [flexible_focus] / weights: { focus_environment_need: 0, remote_onsite_fit: 0 }
* D: label_jp: 一人でまとまった時間がほしい / label_cn: 需要一个人连续时间 / score_tags: [deep_work_block] / weights: { focus_environment_need: 2, remote_onsite_fit: 1 }
* E: label_jp: 静かな個室や在宅に近い環境がほしい / label_cn: 更需要安静单间或接近居家环境 / score_tags: [private_focus, remote_fit] / weights: { focus_environment_need: 3, remote_onsite_fit: 2 }

#### F02_Q05

id: F02_Q05
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 席の固定・自由席・在宅など、場所の変化についてどう感じますか？
prompt_cn: 对固定座位、自由座位、居家等地点变化，你怎么感受？
primary_dimension: remote_onsite_fit
secondary_dimension: rule_structure_need
sensitivity_level: low
public_private_note: private preference, safe as tendency
risk_note: do not state user must work remote/onsite
interpretation_boundary: environmental fit only
options:

* A: label_jp: 場所が変わるほうが気分が切り替わる / label_cn: 地点变化更容易转换心情 / score_tags: [location_variety_fit] / weights: { remote_onsite_fit: -2, rule_structure_need: -1 }
* B: label_jp: ある程度変わっても問題ない / label_cn: 一定变化也没问题 / score_tags: [location_flexible] / weights: { remote_onsite_fit: -1, rule_structure_need: 0 }
* C: label_jp: 固定と自由のバランスがよい / label_cn: 固定和自由平衡最好 / score_tags: [hybrid_location] / weights: { remote_onsite_fit: 0, rule_structure_need: 1 }
* D: label_jp: ある程度決まった場所のほうが落ち着く / label_cn: 相对固定的地点更安心 / score_tags: [stable_location] / weights: { remote_onsite_fit: 1, rule_structure_need: 2 }
* E: label_jp: 場所が毎回変わると準備だけで疲れる / label_cn: 每次换地点会光准备就疲惫 / score_tags: [location_change_drain] / weights: { remote_onsite_fit: 2, rule_structure_need: 3 }

#### F02_Q06

id: F02_Q06
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 周囲から急に話しかけられる環境は、あなたにとってどうですか？
prompt_cn: 周围随时有人突然搭话的环境，对你来说如何？
primary_dimension: communication_density
secondary_dimension: focus_environment_need
sensitivity_level: low
public_private_note: private preference
risk_note: do not judge sociability
interpretation_boundary: work interruption preference only
options:

* A: label_jp: その場で話せるほうが進みやすい / label_cn: 当场能聊更容易推进 / score_tags: [high_touch_fit] / weights: { communication_density: 3, focus_environment_need: -2 }
* B: label_jp: 短いやりとりなら歓迎できる / label_cn: 简短交流可以接受 / score_tags: [moderate_touch] / weights: { communication_density: 2, focus_environment_need: -1 }
* C: label_jp: 内容とタイミングによる / label_cn: 看内容和时机 / score_tags: [timing_sensitive] / weights: { communication_density: 0, focus_environment_need: 0 }
* D: label_jp: 集中時間には事前に知らせてほしい / label_cn: 集中时间希望提前告知 / score_tags: [protected_focus] / weights: { communication_density: -1, focus_environment_need: 2 }
* E: label_jp: 急な声かけが続くとかなり消耗する / label_cn: 持续突然搭话会很消耗 / score_tags: [interruption_drain] / weights: { communication_density: -2, focus_environment_need: 3 }

#### F02_Q07

id: F02_Q07
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 画面共有・常時オンライン・ステータス表示など、見える状態が続く働き方はどう感じますか？
prompt_cn: 屏幕共享、持续在线、状态可见等持续被看见的工作方式，你怎么感受？
primary_dimension: role_boundary_need
secondary_dimension: psychological_safety_need
sensitivity_level: medium
public_private_note: may reveal monitoring discomfort; keep private
risk_note: avoid legal or workplace rights advice
interpretation_boundary: comfort tendency only
options:

* A: label_jp: 見えるほうが安心して連携できる / label_cn: 可见反而更安心协作 / score_tags: [visibility_fit] / weights: { role_boundary_need: -2, psychological_safety_need: -1 }
* B: label_jp: 必要な範囲なら問題ない / label_cn: 必要范围内没问题 / score_tags: [managed_visibility] / weights: { role_boundary_need: -1, psychological_safety_need: 0 }
* C: label_jp: 目的が明確なら受け入れやすい / label_cn: 目的明确就容易接受 / score_tags: [purpose_based_visibility] / weights: { role_boundary_need: 0, psychological_safety_need: 1 }
* D: label_jp: ずっと見える状態は少し緊張する / label_cn: 持续可见会有点紧张 / score_tags: [visibility_tension] / weights: { role_boundary_need: 2, psychological_safety_need: 2 }
* E: label_jp: 監視される感覚があると力を出しにくい / label_cn: 有被监视感会难以发挥 / score_tags: [monitoring_drain] / weights: { role_boundary_need: 3, psychological_safety_need: 3 }

#### F02_Q08

id: F02_Q08
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 集中するために、どのくらい自分で環境を調整したいですか？
prompt_cn: 为了集中，你有多想自己调整环境？
primary_dimension: autonomy_need
secondary_dimension: focus_environment_need
sensitivity_level: low
public_private_note: safe as preference
risk_note: do not imply entitlement or workplace conflict
interpretation_boundary: environmental adjustment preference
options:

* A: label_jp: 会社やチームの標準に合わせやすい / label_cn: 容易配合公司或团队标准 / score_tags: [standard_fit] / weights: { autonomy_need: -2, focus_environment_need: -1 }
* B: label_jp: 少し調整できれば十分 / label_cn: 能稍微调整就够 / score_tags: [minor_adjustment] / weights: { autonomy_need: -1, focus_environment_need: 0 }
* C: label_jp: 作業内容ごとに変えたい / label_cn: 想按工作内容调整 / score_tags: [task_based_adjustment] / weights: { autonomy_need: 1, focus_environment_need: 1 }
* D: label_jp: イヤホン・席・時間などを選びたい / label_cn: 想选择耳机、座位、时间等 / score_tags: [environment_control_need] / weights: { autonomy_need: 2, focus_environment_need: 2 }
* E: label_jp: 調整できない環境では力を出しにくい / label_cn: 无法调整的环境很难发挥 / score_tags: [high_control_need] / weights: { autonomy_need: 3, focus_environment_need: 3 }

#### F02_Q09

id: F02_Q09
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: オンライン会議が続く日の疲れ方はどれに近いですか？
prompt_cn: 线上会议连续时，你的疲惫更接近哪种？
primary_dimension: communication_density
secondary_dimension: recovery_environment_need
sensitivity_level: low
public_private_note: private energy pattern
risk_note: do not make mental health claim
interpretation_boundary: workload environment tendency only
options:

* A: label_jp: 話すことでむしろリズムが出る / label_cn: 说话反而有节奏 / score_tags: [meeting_energy] / weights: { communication_density: 3, recovery_environment_need: -2 }
* B: label_jp: 適度なら集中が続く / label_cn: 适度的话能维持集中 / score_tags: [meeting_moderate] / weights: { communication_density: 1, recovery_environment_need: -1 }
* C: label_jp: 内容によって疲れ方が違う / label_cn: 根据内容疲惫不同 / score_tags: [meeting_contextual] / weights: { communication_density: 0, recovery_environment_need: 0 }
* D: label_jp: 会議の間に休みがないと重くなる / label_cn: 会议之间没休息会变沉重 / score_tags: [meeting_recovery_need] / weights: { communication_density: -1, recovery_environment_need: 2 }
* E: label_jp: 連続会議はかなり消耗しやすい / label_cn: 连续会议非常容易消耗 / score_tags: [meeting_drain] / weights: { communication_density: -2, recovery_environment_need: 3 }

#### F02_Q10

id: F02_Q10
section: 音・空間・集中環境
question_type: single_select_5
prompt_jp: 一日の中で、集中しやすい場所を選べることはどのくらい大切ですか？
prompt_cn: 一天中可以选择容易集中的地点，对你有多重要？
primary_dimension: remote_onsite_fit
secondary_dimension: autonomy_need
sensitivity_level: low
public_private_note: public-safe as aggregate
risk_note: avoid absolute remote/onsite recommendation
interpretation_boundary: condition preference only
options:

* A: label_jp: 場所よりチームの流れが大事 / label_cn: 比地点更重视团队流动 / score_tags: [team_flow_priority] / weights: { remote_onsite_fit: -2, autonomy_need: -1 }
* B: label_jp: 大きくは気にしない / label_cn: 不太在意 / score_tags: [place_flexible] / weights: { remote_onsite_fit: -1, autonomy_need: 0 }
* C: label_jp: 選べる日があると助かる / label_cn: 有些日子可选择会有帮助 / score_tags: [hybrid_preference] / weights: { remote_onsite_fit: 1, autonomy_need: 1 }
* D: label_jp: 作業ごとに場所を選びたい / label_cn: 想按任务选择地点 / score_tags: [task_place_fit] / weights: { remote_onsite_fit: 2, autonomy_need: 2 }
* E: label_jp: 場所の裁量がないと継続しにくい / label_cn: 没有地点裁量会难以持续 / score_tags: [place_autonomy_need] / weights: { remote_onsite_fit: 3, autonomy_need: 3 }

### Section 2: チーム距離とコミュニケーション

#### F02_Q11

id: F02_Q11
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: チームメンバーとの距離感は、どれくらい近いほうが働きやすいですか？
prompt_cn: 与团队成员的距离感，哪种更让你工作顺畅？
primary_dimension: team_distance_preference
secondary_dimension: communication_density
sensitivity_level: low
public_private_note: private work preference
risk_note: do not judge introversion/extroversion
interpretation_boundary: team environment preference only
options:

* A: label_jp: 近くで一緒に動くほうが力が出る / label_cn: 近距离一起动更能发挥 / score_tags: [close_team_fit] / weights: { team_distance_preference: 3, communication_density: 2 }
* B: label_jp: ほどよく声をかけ合える距離がよい / label_cn: 能适度互相招呼的距离好 / score_tags: [moderate_team_closeness] / weights: { team_distance_preference: 2, communication_density: 1 }
* C: label_jp: 近すぎず遠すぎずがよい / label_cn: 不太近不太远最好 / score_tags: [balanced_distance] / weights: { team_distance_preference: 0, communication_density: 0 }
* D: label_jp: 必要なときだけ関わるほうが集中しやすい / label_cn: 需要时再互动更容易集中 / score_tags: [independent_team] / weights: { team_distance_preference: -2, communication_density: -1 }
* E: label_jp: 距離が近すぎる環境は消耗しやすい / label_cn: 距离太近的环境容易消耗 / score_tags: [close_team_drain] / weights: { team_distance_preference: -3, communication_density: -2 }

#### F02_Q12

id: F02_Q12
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: チャットや通知の多さは、あなたの働きやすさにどう影響しますか？
prompt_cn: 聊天和通知的多少，会怎样影响你的工作感受？
primary_dimension: communication_density
secondary_dimension: focus_environment_need
sensitivity_level: low
public_private_note: private work condition
risk_note: avoid digital health claims
interpretation_boundary: communication load preference only
options:

* A: label_jp: 多いほうが状況をつかみやすい / label_cn: 多一点更容易掌握情况 / score_tags: [high_chat_fit] / weights: { communication_density: 3, focus_environment_need: -2 }
* B: label_jp: ある程度多くても対応できる / label_cn: 一定程度多也能应对 / score_tags: [chat_tolerant] / weights: { communication_density: 2, focus_environment_need: -1 }
* C: label_jp: 量より整理されているかが大事 / label_cn: 比数量更重视是否整理清楚 / score_tags: [structured_chat_need] / weights: { communication_density: 0, focus_environment_need: 1 }
* D: label_jp: 多いと作業に戻るのが大変 / label_cn: 太多会很难回到工作 / score_tags: [chat_interruption] / weights: { communication_density: -1, focus_environment_need: 2 }
* E: label_jp: 通知が多い環境ではかなり疲れる / label_cn: 通知很多的环境会很疲惫 / score_tags: [chat_drain] / weights: { communication_density: -2, focus_environment_need: 3 }

#### F02_Q13

id: F02_Q13
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: 仕事の相談は、どのような形が合いやすいですか？
prompt_cn: 工作咨询或讨论，哪种形式更适合你？
primary_dimension: communication_density
secondary_dimension: psychological_safety_need
sensitivity_level: low
public_private_note: private preference
risk_note: avoid judging help-seeking ability
interpretation_boundary: consultation style only
options:

* A: label_jp: すぐ口頭で相談できるのがよい / label_cn: 能马上口头咨询最好 / score_tags: [instant_verbal_support] / weights: { communication_density: 3, psychological_safety_need: 1 }
* B: label_jp: 短く声をかけて確認したい / label_cn: 想简短开口确认 / score_tags: [quick_check] / weights: { communication_density: 2, psychological_safety_need: 1 }
* C: label_jp: 内容によって口頭と文章を使い分けたい / label_cn: 想按内容区分口头和文字 / score_tags: [mixed_consult] / weights: { communication_density: 0, psychological_safety_need: 1 }
* D: label_jp: 一度整理してから文章で相談したい / label_cn: 想先整理再用文字咨询 / score_tags: [written_consult] / weights: { communication_density: -1, psychological_safety_need: 2 }
* E: label_jp: 相談前に考える時間がないと不安になる / label_cn: 咨询前没有思考时间会不安 / score_tags: [prepared_support_need] / weights: { communication_density: -2, psychological_safety_need: 3 }

#### F02_Q14

id: F02_Q14
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: チーム内で意見が分かれたとき、どんな環境だと動きやすいですか？
prompt_cn: 团队意见不一致时，怎样的环境更容易让你行动？
primary_dimension: conflict_noise_sensitivity
secondary_dimension: psychological_safety_need
sensitivity_level: medium
public_private_note: conflict response is private
risk_note: do not provide conflict mediation advice
interpretation_boundary: environment tendency only
options:

* A: label_jp: 率直に議論できる場があると動きやすい / label_cn: 有直接讨论的场合更容易行动 / score_tags: [open_debate_fit] / weights: { conflict_noise_sensitivity: -2, psychological_safety_need: 0 }
* B: label_jp: 多少の議論は前向きに受け取れる / label_cn: 一定争论能积极接受 / score_tags: [debate_tolerant] / weights: { conflict_noise_sensitivity: -1, psychological_safety_need: 1 }
* C: label_jp: 進め方が決まっていれば大丈夫 / label_cn: 如果流程明确就可以 / score_tags: [structured_conflict] / weights: { conflict_noise_sensitivity: 1, psychological_safety_need: 1 }
* D: label_jp: 感情的な空気が強いと動きにくい / label_cn: 情绪强时会难以行动 / score_tags: [emotional_noise_sensitive] / weights: { conflict_noise_sensitivity: 2, psychological_safety_need: 2 }
* E: label_jp: 対立が多い環境ではかなり消耗する / label_cn: 冲突多的环境很消耗 / score_tags: [conflict_drain] / weights: { conflict_noise_sensitivity: 3, psychological_safety_need: 3 }

#### F02_Q15

id: F02_Q15
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: 雑談や非公式な会話は、働きやすさにどのくらい関係しますか？
prompt_cn: 闲聊或非正式对话，对你的工作舒适度有多大关系？
primary_dimension: team_distance_preference
secondary_dimension: communication_density
sensitivity_level: low
public_private_note: private preference
risk_note: avoid cultural or personality judgment
interpretation_boundary: workplace connection preference only
options:

* A: label_jp: 雑談があるほうがチームに入りやすい / label_cn: 有闲聊更容易进入团队 / score_tags: [smalltalk_fit] / weights: { team_distance_preference: 3, communication_density: 2 }
* B: label_jp: 少しあると安心する / label_cn: 有一点会安心 / score_tags: [light_smalltalk] / weights: { team_distance_preference: 2, communication_density: 1 }
* C: label_jp: あってもなくても大きく変わらない / label_cn: 有没有都差不多 / score_tags: [smalltalk_neutral] / weights: { team_distance_preference: 0, communication_density: 0 }
* D: label_jp: 多すぎると切り替えにくい / label_cn: 太多会难切换 / score_tags: [smalltalk_limit] / weights: { team_distance_preference: -1, communication_density: -1 }
* E: label_jp: 非公式な空気が濃いと疲れやすい / label_cn: 非正式氛围太浓会疲惫 / score_tags: [informal_drain] / weights: { team_distance_preference: -2, communication_density: -2 }

#### F02_Q16

id: F02_Q16
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: チームの情報共有は、どのくらい細かいほうが安心しますか？
prompt_cn: 团队信息共享多细，你会更安心？
primary_dimension: feedback_clarity_need
secondary_dimension: communication_density
sensitivity_level: low
public_private_note: safe as preference
risk_note: do not imply mistrust
interpretation_boundary: information clarity preference
options:

* A: label_jp: 大枠だけわかれば自分で進められる / label_cn: 知道大方向就能自己推进 / score_tags: [low_detail_ok] / weights: { feedback_clarity_need: -2, communication_density: -1 }
* B: label_jp: 必要な点だけ共有されればよい / label_cn: 只共享必要点就好 / score_tags: [essential_info] / weights: { feedback_clarity_need: -1, communication_density: -1 }
* C: label_jp: 重要な背景は知っておきたい / label_cn: 想知道重要背景 / score_tags: [context_need] / weights: { feedback_clarity_need: 1, communication_density: 0 }
* D: label_jp: 判断理由まで共有されると安心する / label_cn: 连判断理由也共享会安心 / score_tags: [reason_clarity] / weights: { feedback_clarity_need: 2, communication_density: 1 }
* E: label_jp: 情報が見えない環境では不安が強くなる / label_cn: 信息不可见会强烈不安 / score_tags: [info_gap_anxiety] / weights: { feedback_clarity_need: 3, communication_density: 2 }

#### F02_Q17

id: F02_Q17
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: 一人で進める時間と、チームで合わせる時間の比率はどれが合いそうですか？
prompt_cn: 独自推进时间和团队同步时间的比例，哪种更适合你？
primary_dimension: team_distance_preference
secondary_dimension: autonomy_need
sensitivity_level: low
public_private_note: private work preference
risk_note: do not imply performance ability
interpretation_boundary: collaboration rhythm only
options:

* A: label_jp: チームで合わせる時間が多いほうがよい / label_cn: 团队同步时间多更好 / score_tags: [team_heavy_fit] / weights: { team_distance_preference: 3, autonomy_need: -2 }
* B: label_jp: チーム時間がやや多いほうが安心 / label_cn: 团队时间稍多会安心 / score_tags: [team_supported] / weights: { team_distance_preference: 2, autonomy_need: -1 }
* C: label_jp: 半分ずつくらいがよい / label_cn: 大约各一半最好 / score_tags: [balanced_work_ratio] / weights: { team_distance_preference: 0, autonomy_need: 0 }
* D: label_jp: 一人で進める時間が多いほうがよい / label_cn: 独自推进时间多更好 / score_tags: [independent_work_fit] / weights: { team_distance_preference: -2, autonomy_need: 2 }
* E: label_jp: 自分で進める時間がないと力を出しにくい / label_cn: 没有独自推进时间会难发挥 / score_tags: [solo_time_need] / weights: { team_distance_preference: -3, autonomy_need: 3 }

#### F02_Q18

id: F02_Q18
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: 仕事上の人間関係は、どのくらい私的な距離まで近いほうが合いますか？
prompt_cn: 工作中的人际关系，接近到多私人的距离更适合你？
primary_dimension: role_boundary_need
secondary_dimension: team_distance_preference
sensitivity_level: medium
public_private_note: private boundary preference
risk_note: do not judge personal openness
interpretation_boundary: professional boundary preference only
options:

* A: label_jp: 私的な話もあるほうが働きやすい / label_cn: 有私人话题更容易工作 / score_tags: [personal_closeness_fit] / weights: { role_boundary_need: -3, team_distance_preference: 3 }
* B: label_jp: 少し近い関係だと安心する / label_cn: 稍微亲近会安心 / score_tags: [warm_team_fit] / weights: { role_boundary_need: -2, team_distance_preference: 2 }
* C: label_jp: 相手や場面による / label_cn: 取决于对象和场景 / score_tags: [boundary_contextual] / weights: { role_boundary_need: 0, team_distance_preference: 0 }
* D: label_jp: 仕事と私生活はある程度分けたい / label_cn: 工作和私生活想适度分开 / score_tags: [professional_boundary] / weights: { role_boundary_need: 2, team_distance_preference: -1 }
* E: label_jp: 近すぎる関係性は消耗しやすい / label_cn: 过近关系容易消耗 / score_tags: [boundary_protection_need] / weights: { role_boundary_need: 3, team_distance_preference: -2 }

#### F02_Q19

id: F02_Q19
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: 上司やリーダーとの関わり方は、どれが合いやすいですか？
prompt_cn: 与上司或领导的互动方式，哪种更适合你？
primary_dimension: feedback_clarity_need
secondary_dimension: autonomy_need
sensitivity_level: medium
public_private_note: may reveal management preference; keep private
risk_note: avoid workplace advice or judging manager
interpretation_boundary: support style preference
options:

* A: label_jp: こまめに見てもらえると進みやすい / label_cn: 经常被看见和确认更容易推进 / score_tags: [close_manager_support] / weights: { feedback_clarity_need: 3, autonomy_need: -2 }
* B: label_jp: 定期的に確認があると安心 / label_cn: 定期确认会安心 / score_tags: [regular_checkin] / weights: { feedback_clarity_need: 2, autonomy_need: -1 }
* C: label_jp: 節目ごとに相談できればよい / label_cn: 关键节点能咨询就好 / score_tags: [milestone_support] / weights: { feedback_clarity_need: 1, autonomy_need: 1 }
* D: label_jp: 基本は任せてもらいたい / label_cn: 基本希望被信任放手 / score_tags: [trusted_autonomy] / weights: { feedback_clarity_need: -1, autonomy_need: 2 }
* E: label_jp: 細かく見られると力を出しにくい / label_cn: 被细看会难发挥 / score_tags: [micromanagement_drain] / weights: { feedback_clarity_need: -2, autonomy_need: 3 }

#### F02_Q20

id: F02_Q20
section: チーム距離とコミュニケーション
question_type: single_select_5
prompt_jp: チームの空気が忙しそうなとき、あなたはどうなりやすいですか？
prompt_cn: 团队氛围看起来很忙时，你容易变成怎样？
primary_dimension: conflict_noise_sensitivity
secondary_dimension: workload_rhythm_fit
sensitivity_level: medium
public_private_note: private stress response preference
risk_note: avoid stress diagnosis
interpretation_boundary: environment signal only
options:

* A: label_jp: その勢いに乗って動ける / label_cn: 能跟着势头动起来 / score_tags: [busy_energy_fit] / weights: { conflict_noise_sensitivity: -2, workload_rhythm_fit: 2 }
* B: label_jp: ある程度なら集中できる / label_cn: 一定程度可以集中 / score_tags: [busy_tolerant] / weights: { conflict_noise_sensitivity: -1, workload_rhythm_fit: 1 }
* C: label_jp: 自分の役割が見えれば動ける / label_cn: 只要看清自己角色就能动 / score_tags: [role_clarity_in_busy] / weights: { conflict_noise_sensitivity: 1, workload_rhythm_fit: 0 }
* D: label_jp: 空気に引っぱられて焦りやすい / label_cn: 容易被氛围带着焦虑 / score_tags: [busy_air_sensitive] / weights: { conflict_noise_sensitivity: 2, workload_rhythm_fit: -1 }
* E: label_jp: 忙しさの圧が強いと消耗しやすい / label_cn: 忙碌压力强会容易消耗 / score_tags: [busy_pressure_drain] / weights: { conflict_noise_sensitivity: 3, workload_rhythm_fit: -2 }

### Section 3: 裁量・ルール・意思決定

#### F02_Q21

id: F02_Q21
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 仕事の進め方は、どのくらい自分で決めたいですか？
prompt_cn: 工作推进方式，你有多想自己决定？
primary_dimension: autonomy_need
secondary_dimension: rule_structure_need
sensitivity_level: low
public_private_note: private work preference
risk_note: do not equate autonomy with ability
interpretation_boundary: preference only
options:

* A: label_jp: 決まった進め方があるほうが安心 / label_cn: 有固定推进方式更安心 / score_tags: [structured_process_fit] / weights: { autonomy_need: -3, rule_structure_need: 3 }
* B: label_jp: 大枠は決まっているほうがよい / label_cn: 大框架固定更好 / score_tags: [guided_process] / weights: { autonomy_need: -1, rule_structure_need: 2 }
* C: label_jp: 大枠と自由のバランスがよい / label_cn: 框架和自由平衡最好 / score_tags: [balanced_autonomy] / weights: { autonomy_need: 0, rule_structure_need: 1 }
* D: label_jp: 方法はかなり任せてほしい / label_cn: 希望方法上较多被放手 / score_tags: [method_autonomy] / weights: { autonomy_need: 2, rule_structure_need: -1 }
* E: label_jp: 自分で設計できる環境で力が出る / label_cn: 能自己设计环境时更能发挥 / score_tags: [high_autonomy_fit] / weights: { autonomy_need: 3, rule_structure_need: -2 }

#### F02_Q22

id: F02_Q22
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: ルールや手順が細かい環境について、どう感じますか？
prompt_cn: 对规则和流程很细的环境，你怎么感受？
primary_dimension: rule_structure_need
secondary_dimension: autonomy_need
sensitivity_level: low
public_private_note: safe as preference
risk_note: do not judge compliance
interpretation_boundary: structure preference only
options:

* A: label_jp: 細かいほうが安心して動ける / label_cn: 细一点更安心行动 / score_tags: [detailed_rule_fit] / weights: { rule_structure_need: 3, autonomy_need: -2 }
* B: label_jp: 手順があると助かる / label_cn: 有流程会有帮助 / score_tags: [procedure_support] / weights: { rule_structure_need: 2, autonomy_need: -1 }
* C: label_jp: 必要な部分だけ明確ならよい / label_cn: 只要必要部分明确就好 / score_tags: [essential_rules] / weights: { rule_structure_need: 1, autonomy_need: 0 }
* D: label_jp: 細かすぎると動きにくい / label_cn: 太细会难行动 / score_tags: [rule_friction] / weights: { rule_structure_need: -1, autonomy_need: 2 }
* E: label_jp: 裁量が少ない環境ではかなり窮屈 / label_cn: 裁量少的环境会很压抑 / score_tags: [low_autonomy_drain] / weights: { rule_structure_need: -2, autonomy_need: 3 }

#### F02_Q23

id: F02_Q23
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 意思決定のスピードは、どれくらいが合いやすいですか？
prompt_cn: 决策速度多快更适合你？
primary_dimension: decision_speed_fit
secondary_dimension: change_tolerance
sensitivity_level: low
public_private_note: private preference
risk_note: do not judge decisiveness
interpretation_boundary: decision environment fit only
options:

* A: label_jp: 速く決めて動く環境が合う / label_cn: 快速决定并行动的环境适合 / score_tags: [fast_decision_fit] / weights: { decision_speed_fit: 3, change_tolerance: 2 }
* B: label_jp: ある程度スピードがあるほうがよい / label_cn: 有一定速度更好 / score_tags: [moderate_fast_decision] / weights: { decision_speed_fit: 2, change_tolerance: 1 }
* C: label_jp: 内容によって速度を変えたい / label_cn: 想根据内容调整速度 / score_tags: [adaptive_decision] / weights: { decision_speed_fit: 0, change_tolerance: 0 }
* D: label_jp: 考える時間があるほうが安心 / label_cn: 有思考时间更安心 / score_tags: [deliberate_decision] / weights: { decision_speed_fit: -2, change_tolerance: -1 }
* E: label_jp: 速すぎる決定が続くと消耗する / label_cn: 过快决策持续会消耗 / score_tags: [fast_decision_drain] / weights: { decision_speed_fit: -3, change_tolerance: -2 }

#### F02_Q24

id: F02_Q24
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 役割や担当範囲は、どのくらい明確なほうが働きやすいですか？
prompt_cn: 角色和负责范围多明确时，你更容易工作？
primary_dimension: role_boundary_need
secondary_dimension: rule_structure_need
sensitivity_level: low
public_private_note: private preference
risk_note: do not imply refusal to collaborate
interpretation_boundary: role clarity preference only
options:

* A: label_jp: あいまいでも柔軟に動ける / label_cn: 模糊也能灵活行动 / score_tags: [fluid_role_fit] / weights: { role_boundary_need: -3, rule_structure_need: -2 }
* B: label_jp: 多少あいまいでも問題ない / label_cn: 稍微模糊也没问题 / score_tags: [role_flexible] / weights: { role_boundary_need: -1, rule_structure_need: -1 }
* C: label_jp: 基本の担当が見えていればよい / label_cn: 能看见基本负责范围即可 / score_tags: [basic_role_clarity] / weights: { role_boundary_need: 1, rule_structure_need: 1 }
* D: label_jp: 範囲が明確なほうが安心 / label_cn: 范围明确更安心 / score_tags: [clear_role_need] / weights: { role_boundary_need: 2, rule_structure_need: 2 }
* E: label_jp: 境界があいまいだと抱え込みやすい / label_cn: 边界模糊时容易背太多 / score_tags: [boundary_overload] / weights: { role_boundary_need: 3, rule_structure_need: 3 }

#### F02_Q25

id: F02_Q25
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 新しい提案や改善案を出す環境について、どれが近いですか？
prompt_cn: 对提出新建议或改善案的环境，你更接近哪种？
primary_dimension: growth_environment_need
secondary_dimension: psychological_safety_need
sensitivity_level: medium
public_private_note: private expression preference
risk_note: avoid judging initiative
interpretation_boundary: proposal environment preference
options:

* A: label_jp: 自由に提案できる環境で伸びやすい / label_cn: 能自由提案的环境更容易成长 / score_tags: [proposal_autonomy_fit] / weights: { growth_environment_need: 3, psychological_safety_need: 1 }
* B: label_jp: 受け止めてもらえるなら出しやすい / label_cn: 如果能被接住就容易提出 / score_tags: [proposal_safety] / weights: { growth_environment_need: 2, psychological_safety_need: 2 }
* C: label_jp: 場やタイミングがあれば出せる / label_cn: 有场合和时机就能提出 / score_tags: [proposal_timing] / weights: { growth_environment_need: 1, psychological_safety_need: 1 }
* D: label_jp: 根拠を整えてから出したい / label_cn: 想整理依据后再提出 / score_tags: [prepared_proposal] / weights: { growth_environment_need: 0, psychological_safety_need: 2 }
* E: label_jp: 否定されやすい空気では出しにくい / label_cn: 容易被否定的氛围下很难提出 / score_tags: [proposal_safety_need] / weights: { growth_environment_need: 1, psychological_safety_need: 3 }

#### F02_Q26

id: F02_Q26
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 判断に迷ったとき、どんな支えがあると動きやすいですか？
prompt_cn: 判断迷茫时，有什么支持会更容易行动？
primary_dimension: feedback_clarity_need
secondary_dimension: decision_speed_fit
sensitivity_level: low
public_private_note: private preference
risk_note: do not imply dependence
interpretation_boundary: decision support style only
options:

* A: label_jp: 自分で決められる余地がほしい / label_cn: 希望有自己决定的余地 / score_tags: [self_decision_space] / weights: { feedback_clarity_need: -2, decision_speed_fit: 2 }
* B: label_jp: 大枠だけ確認できれば進める / label_cn: 只需确认大框架就能推进 / score_tags: [light_decision_support] / weights: { feedback_clarity_need: -1, decision_speed_fit: 1 }
* C: label_jp: 選択肢を一緒に整理したい / label_cn: 想一起整理选项 / score_tags: [decision_sorting] / weights: { feedback_clarity_need: 1, decision_speed_fit: 0 }
* D: label_jp: 判断基準を明確にしてほしい / label_cn: 希望判断标准明确 / score_tags: [criteria_need] / weights: { feedback_clarity_need: 2, decision_speed_fit: -1 }
* E: label_jp: 基準がないまま決めるのはかなり不安 / label_cn: 没有标准就决定会很不安 / score_tags: [criteria_gap_drain] / weights: { feedback_clarity_need: 3, decision_speed_fit: -2 }

#### F02_Q27

id: F02_Q27
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 「まずやってみる」文化は、あなたにとってどうですか？
prompt_cn: “先试试看”的文化，对你来说如何？
primary_dimension: change_tolerance
secondary_dimension: decision_speed_fit
sensitivity_level: low
public_private_note: safe as preference
risk_note: do not judge courage
interpretation_boundary: experimentation fit only
options:

* A: label_jp: 試しながら進むほうが合う / label_cn: 边试边推进更适合 / score_tags: [experiment_fit] / weights: { change_tolerance: 3, decision_speed_fit: 3 }
* B: label_jp: 小さく試すなら合いやすい / label_cn: 小规模试的话适合 / score_tags: [small_experiment] / weights: { change_tolerance: 2, decision_speed_fit: 1 }
* C: label_jp: リスクが見えていれば試せる / label_cn: 看见风险就能试 / score_tags: [bounded_experiment] / weights: { change_tolerance: 1, decision_speed_fit: 0 }
* D: label_jp: 事前整理がないと不安になる / label_cn: 事前不整理会不安 / score_tags: [preparation_need] / weights: { change_tolerance: -1, decision_speed_fit: -2 }
* E: label_jp: 試行錯誤が多すぎる環境は消耗する / label_cn: 试错过多的环境会消耗 / score_tags: [experiment_drain] / weights: { change_tolerance: -3, decision_speed_fit: -3 }

#### F02_Q28

id: F02_Q28
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: マニュアルやテンプレートは、あなたにとってどんな存在ですか？
prompt_cn: 手册和模板，对你来说是什么样的存在？
primary_dimension: rule_structure_need
secondary_dimension: growth_environment_need
sensitivity_level: low
public_private_note: safe
risk_note: avoid ability judgment
interpretation_boundary: support tool preference
options:

* A: label_jp: 自由に作るほうがやりやすい / label_cn: 自由创建更好做 / score_tags: [low_template_need] / weights: { rule_structure_need: -3, growth_environment_need: 2 }
* B: label_jp: 参考程度にあるとよい / label_cn: 有参考程度就好 / score_tags: [template_reference] / weights: { rule_structure_need: -1, growth_environment_need: 1 }
* C: label_jp: 基本形があると助かる / label_cn: 有基本形式会有帮助 / score_tags: [basic_template] / weights: { rule_structure_need: 1, growth_environment_need: 0 }
* D: label_jp: 手順があると安心して進める / label_cn: 有步骤会安心推进 / score_tags: [manual_support] / weights: { rule_structure_need: 2, growth_environment_need: -1 }
* E: label_jp: 何も型がない環境では迷いやすい / label_cn: 完全没框架的环境容易迷茫 / score_tags: [structure_gap_drain] / weights: { rule_structure_need: 3, growth_environment_need: -2 }

#### F02_Q29

id: F02_Q29
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 予定や優先順位が変わるとき、どんな伝え方だと受け取りやすいですか？
prompt_cn: 日程或优先级变化时，怎样传达你更容易接受？
primary_dimension: change_tolerance
secondary_dimension: feedback_clarity_need
sensitivity_level: low
public_private_note: private preference
risk_note: do not imply rigidity
interpretation_boundary: change communication preference
options:

* A: label_jp: すぐ変えて動ければよい / label_cn: 能马上改变行动就好 / score_tags: [rapid_change_fit] / weights: { change_tolerance: 3, feedback_clarity_need: -1 }
* B: label_jp: 変更点がわかれば対応できる / label_cn: 知道变化点就能应对 / score_tags: [change_point_ok] / weights: { change_tolerance: 2, feedback_clarity_need: 0 }
* C: label_jp: 理由も少し知りたい / label_cn: 也想稍微知道理由 / score_tags: [change_reason_need] / weights: { change_tolerance: 0, feedback_clarity_need: 1 }
* D: label_jp: 影響範囲まで共有されると安心 / label_cn: 连影响范围也共享会安心 / score_tags: [change_impact_clarity] / weights: { change_tolerance: -1, feedback_clarity_need: 2 }
* E: label_jp: 理由なく急に変わるとかなり疲れる / label_cn: 没理由突然变化会很累 / score_tags: [sudden_change_drain] / weights: { change_tolerance: -3, feedback_clarity_need: 3 }

#### F02_Q30

id: F02_Q30
section: 裁量・ルール・意思決定
question_type: single_select_5
prompt_jp: 自分の担当外のことを頼まれる環境について、どう感じますか？
prompt_cn: 被请求做负责范围外的事情，你怎么感受？
primary_dimension: role_boundary_need
secondary_dimension: workload_rhythm_fit
sensitivity_level: medium
public_private_note: private boundary and load preference
risk_note: do not provide refusal advice
interpretation_boundary: role boundary tendency only
options:

* A: label_jp: 必要なら柔軟に動きたい / label_cn: 必要时想灵活行动 / score_tags: [role_flex_fit] / weights: { role_boundary_need: -3, workload_rhythm_fit: 1 }
* B: label_jp: たまになら問題ない / label_cn: 偶尔的话没问题 / score_tags: [role_flex_moderate] / weights: { role_boundary_need: -1, workload_rhythm_fit: 0 }
* C: label_jp: 優先順位が見えれば対応できる / label_cn: 看见优先级就能应对 / score_tags: [boundary_with_priority] / weights: { role_boundary_need: 1, workload_rhythm_fit: 1 }
* D: label_jp: 担当範囲を確認してから受けたい / label_cn: 想确认负责范围后再接 / score_tags: [role_check_need] / weights: { role_boundary_need: 2, workload_rhythm_fit: -1 }
* E: label_jp: 境界なく頼まれる環境では抱え込みやすい / label_cn: 没边界地被请求会容易背太多 / score_tags: [role_overload_drain] / weights: { role_boundary_need: 3, workload_rhythm_fit: -2 }

### Section 4: 評価・フィードバック・安心感

#### F02_Q31

id: F02_Q31
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 自分の仕事へのフィードバックは、どのくらい欲しいですか？
prompt_cn: 对自己的工作，你希望得到多少反馈？
primary_dimension: feedback_clarity_need
secondary_dimension: growth_environment_need
sensitivity_level: low
public_private_note: private growth preference
risk_note: avoid evaluating competence
interpretation_boundary: feedback environment preference only
options:

* A: label_jp: 必要なときだけで十分 / label_cn: 只在必要时就足够 / score_tags: [low_feedback_need] / weights: { feedback_clarity_need: -3, growth_environment_need: -1 }
* B: label_jp: 節目で少しもらえればよい / label_cn: 关键节点稍微有就好 / score_tags: [milestone_feedback] / weights: { feedback_clarity_need: -1, growth_environment_need: 0 }
* C: label_jp: よかった点と改善点を知りたい / label_cn: 想知道优点和改善点 / score_tags: [balanced_feedback] / weights: { feedback_clarity_need: 1, growth_environment_need: 1 }
* D: label_jp: こまめに方向確認があると伸びやすい / label_cn: 经常确认方向更容易成长 / score_tags: [frequent_feedback] / weights: { feedback_clarity_need: 2, growth_environment_need: 2 }
* E: label_jp: 反応が少ない環境では不安になりやすい / label_cn: 反馈少的环境容易不安 / score_tags: [feedback_gap_drain] / weights: { feedback_clarity_need: 3, growth_environment_need: 2 }

#### F02_Q32

id: F02_Q32
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 評価基準は、どのくらい明確なほうが働きやすいですか？
prompt_cn: 评价标准多明确时，你更容易工作？
primary_dimension: feedback_clarity_need
secondary_dimension: psychological_safety_need
sensitivity_level: medium
public_private_note: private evaluation preference
risk_note: avoid workplace legal advice
interpretation_boundary: evaluation clarity preference
options:

* A: label_jp: 大きな方向だけで動ける / label_cn: 有大方向就能动 / score_tags: [broad_evaluation_ok] / weights: { feedback_clarity_need: -2, psychological_safety_need: -1 }
* B: label_jp: 重要な点がわかればよい / label_cn: 知道重点即可 / score_tags: [key_criteria] / weights: { feedback_clarity_need: -1, psychological_safety_need: 0 }
* C: label_jp: 基準がある程度見えているとよい / label_cn: 标准一定程度可见更好 / score_tags: [moderate_criteria] / weights: { feedback_clarity_need: 1, psychological_safety_need: 1 }
* D: label_jp: 何を見られるか明確だと安心 / label_cn: 明确知道被看什么会安心 / score_tags: [clear_evaluation_need] / weights: { feedback_clarity_need: 2, psychological_safety_need: 2 }
* E: label_jp: 基準があいまいだと力を出しにくい / label_cn: 标准模糊会难以发挥 / score_tags: [ambiguous_evaluation_drain] / weights: { feedback_clarity_need: 3, psychological_safety_need: 3 }

#### F02_Q33

id: F02_Q33
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: ミスや遅れが出たとき、どんな空気だと立て直しやすいですか？
prompt_cn: 出现失误或延迟时，怎样的氛围更容易恢复？
primary_dimension: psychological_safety_need
secondary_dimension: recovery_environment_need
sensitivity_level: medium
public_private_note: private safety preference
risk_note: avoid legal/HR advice
interpretation_boundary: psychological safety preference, not clinical
options:

* A: label_jp: すぐ原因と対策に進める空気 / label_cn: 马上进入原因和对策的氛围 / score_tags: [solution_fast_fit] / weights: { psychological_safety_need: -1, recovery_environment_need: -1 }
* B: label_jp: 落ち着いて確認できれば大丈夫 / label_cn: 能冷静确认就可以 / score_tags: [calm_check] / weights: { psychological_safety_need: 1, recovery_environment_need: 0 }
* C: label_jp: 責めずに状況整理できる空気 / label_cn: 不责备地整理情况的氛围 / score_tags: [non_blame_structure] / weights: { psychological_safety_need: 2, recovery_environment_need: 1 }
* D: label_jp: 次にどうするか一緒に見てもらえる空気 / label_cn: 能一起看下一步的氛围 / score_tags: [repair_support] / weights: { psychological_safety_need: 3, recovery_environment_need: 2 }
* E: label_jp: 強い責めがある環境ではかなり消耗する / label_cn: 强烈责备的环境会很消耗 / score_tags: [blame_drain] / weights: { psychological_safety_need: 3, recovery_environment_need: 3 }

#### F02_Q34

id: F02_Q34
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 褒められる・認められることは、働きやすさにどのくらい関係しますか？
prompt_cn: 被肯定或认可，对你的工作舒适度有多大关系？
primary_dimension: feedback_clarity_need
secondary_dimension: growth_environment_need
sensitivity_level: low
public_private_note: private motivation preference
risk_note: avoid validation dependency framing
interpretation_boundary: recognition preference only
options:

* A: label_jp: なくても自分で判断しやすい / label_cn: 即使没有也能自己判断 / score_tags: [self_validation] / weights: { feedback_clarity_need: -3, growth_environment_need: -1 }
* B: label_jp: たまにあると十分 / label_cn: 偶尔有就足够 / score_tags: [low_recognition_need] / weights: { feedback_clarity_need: -1, growth_environment_need: 0 }
* C: label_jp: 何がよかったか知れると助かる / label_cn: 能知道哪里好会有帮助 / score_tags: [specific_recognition] / weights: { feedback_clarity_need: 1, growth_environment_need: 1 }
* D: label_jp: 認められる機会があると伸びやすい / label_cn: 有被认可机会更容易成长 / score_tags: [recognition_growth] / weights: { feedback_clarity_need: 2, growth_environment_need: 2 }
* E: label_jp: 反応がない環境では自信を保ちにくい / label_cn: 没反应的环境难维持自信 / score_tags: [recognition_gap_drain] / weights: { feedback_clarity_need: 3, growth_environment_need: 2 }

#### F02_Q35

id: F02_Q35
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 成長できる環境として、どれが近いですか？
prompt_cn: 对你来说，能成长的环境更接近哪种？
primary_dimension: growth_environment_need
secondary_dimension: feedback_clarity_need
sensitivity_level: low
public_private_note: private growth preference
risk_note: do not promise growth outcome
interpretation_boundary: growth condition tendency
options:

* A: label_jp: 大きな裁量の中で自分で伸びたい / label_cn: 想在大裁量中自己成长 / score_tags: [autonomous_growth] / weights: { growth_environment_need: 3, feedback_clarity_need: -2 }
* B: label_jp: 挑戦の機会が多いと伸びやすい / label_cn: 挑战机会多更容易成长 / score_tags: [challenge_growth] / weights: { growth_environment_need: 3, feedback_clarity_need: -1 }
* C: label_jp: 挑戦とサポートの両方がほしい / label_cn: 希望挑战和支持都有 / score_tags: [balanced_growth] / weights: { growth_environment_need: 2, feedback_clarity_need: 1 }
* D: label_jp: 段階的に学べる環境がよい / label_cn: 阶段性学习的环境更好 / score_tags: [stepwise_growth] / weights: { growth_environment_need: 1, feedback_clarity_need: 2 }
* E: label_jp: 何を伸ばすか明確でないと迷いやすい / label_cn: 不明确要成长什么会迷茫 / score_tags: [growth_clarity_need] / weights: { growth_environment_need: 1, feedback_clarity_need: 3 }

#### F02_Q36

id: F02_Q36
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 人前でフィードバックされることについて、どう感じますか？
prompt_cn: 在他人面前被反馈，你怎么感受？
primary_dimension: psychological_safety_need
secondary_dimension: conflict_noise_sensitivity
sensitivity_level: medium
public_private_note: private sensitivity
risk_note: avoid trauma or clinical framing
interpretation_boundary: feedback delivery preference only
options:

* A: label_jp: 公開の場でも前向きに受け取れる / label_cn: 公开场合也能积极接收 / score_tags: [public_feedback_ok] / weights: { psychological_safety_need: -2, conflict_noise_sensitivity: -2 }
* B: label_jp: 内容が建設的なら大丈夫 / label_cn: 内容建设性就可以 / score_tags: [constructive_public_ok] / weights: { psychological_safety_need: -1, conflict_noise_sensitivity: -1 }
* C: label_jp: 内容と相手による / label_cn: 看内容和对象 / score_tags: [feedback_contextual] / weights: { psychological_safety_need: 1, conflict_noise_sensitivity: 1 }
* D: label_jp: 個別に伝えてもらうほうが受け取りやすい / label_cn: 单独传达更容易接收 / score_tags: [private_feedback_need] / weights: { psychological_safety_need: 2, conflict_noise_sensitivity: 2 }
* E: label_jp: 人前の指摘が続くとかなり消耗する / label_cn: 持续在人前被指出会很消耗 / score_tags: [public_critique_drain] / weights: { psychological_safety_need: 3, conflict_noise_sensitivity: 3 }

#### F02_Q37

id: F02_Q37
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 期待値やゴールが変わるとき、何があると安心しますか？
prompt_cn: 期待值或目标变化时，有什么会让你安心？
primary_dimension: feedback_clarity_need
secondary_dimension: change_tolerance
sensitivity_level: low
public_private_note: private preference
risk_note: avoid management advice
interpretation_boundary: clarity condition only
options:

* A: label_jp: すぐ共有されれば対応できる / label_cn: 马上共享就能应对 / score_tags: [fast_goal_update] / weights: { feedback_clarity_need: 0, change_tolerance: 2 }
* B: label_jp: 変更点がわかればよい / label_cn: 知道变化点即可 / score_tags: [goal_delta_clarity] / weights: { feedback_clarity_need: 1, change_tolerance: 1 }
* C: label_jp: 背景と優先順位が知りたい / label_cn: 想知道背景和优先级 / score_tags: [goal_context_need] / weights: { feedback_clarity_need: 2, change_tolerance: 0 }
* D: label_jp: 自分の役割への影響まで見たい / label_cn: 想看到对自己角色的影响 / score_tags: [goal_impact_need] / weights: { feedback_clarity_need: 3, change_tolerance: -1 }
* E: label_jp: 期待値が急に変わる環境は消耗する / label_cn: 期待值突然变化的环境会消耗 / score_tags: [goal_shift_drain] / weights: { feedback_clarity_need: 3, change_tolerance: -3 }

#### F02_Q38

id: F02_Q38
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 相談しやすい雰囲気は、あなたにとってどのくらい大切ですか？
prompt_cn: 容易咨询的氛围，对你有多重要？
primary_dimension: psychological_safety_need
secondary_dimension: communication_density
sensitivity_level: medium
public_private_note: private support preference
risk_note: do not imply vulnerability judgment
interpretation_boundary: support environment preference
options:

* A: label_jp: 自分で進めるほうが力が出る / label_cn: 自己推进更能发挥 / score_tags: [self_support] / weights: { psychological_safety_need: -2, communication_density: -2 }
* B: label_jp: 必要なとき相談できればよい / label_cn: 必要时能咨询即可 / score_tags: [available_support] / weights: { psychological_safety_need: 0, communication_density: -1 }
* C: label_jp: 相談の入口があると安心 / label_cn: 有咨询入口会安心 / score_tags: [support_entry] / weights: { psychological_safety_need: 1, communication_density: 1 }
* D: label_jp: 日常的に相談できる空気がほしい / label_cn: 希望日常就能咨询的氛围 / score_tags: [daily_support_need] / weights: { psychological_safety_need: 2, communication_density: 2 }
* E: label_jp: 相談しにくい環境では抱え込みやすい / label_cn: 难咨询的环境容易自己扛太多 / score_tags: [support_gap_drain] / weights: { psychological_safety_need: 3, communication_density: 2 }

#### F02_Q39

id: F02_Q39
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 評価や成果が数字で見える環境について、どう感じますか？
prompt_cn: 评价或成果以数字可见的环境，你怎么感受？
primary_dimension: feedback_clarity_need
secondary_dimension: psychological_safety_need
sensitivity_level: medium
public_private_note: private evaluation preference
risk_note: do not imply sales/metric suitability
interpretation_boundary: metric environment preference only
options:

* A: label_jp: 数字があるほうが燃えやすい / label_cn: 有数字更容易被激发 / score_tags: [metric_energy] / weights: { feedback_clarity_need: 2, psychological_safety_need: -2 }
* B: label_jp: 目安としてあるとわかりやすい / label_cn: 作为参考会更清楚 / score_tags: [metric_reference] / weights: { feedback_clarity_need: 2, psychological_safety_need: -1 }
* C: label_jp: 数字と内容の両方が見たい / label_cn: 数字和内容都想看 / score_tags: [balanced_metric] / weights: { feedback_clarity_need: 2, psychological_safety_need: 0 }
* D: label_jp: 数字だけだと緊張しやすい / label_cn: 只有数字容易紧张 / score_tags: [metric_tension] / weights: { feedback_clarity_need: 1, psychological_safety_need: 2 }
* E: label_jp: 数字で常に比べられる環境は消耗する / label_cn: 持续被数字比较的环境会消耗 / score_tags: [metric_comparison_drain] / weights: { feedback_clarity_need: 0, psychological_safety_need: 3 }

#### F02_Q40

id: F02_Q40
section: 評価・フィードバック・安心感
question_type: single_select_5
prompt_jp: 「まだできていないこと」を指摘されるとき、どんな伝え方が合いますか？
prompt_cn: 被指出“还没做到的事”时，怎样传达更适合你？
primary_dimension: psychological_safety_need
secondary_dimension: growth_environment_need
sensitivity_level: medium
public_private_note: private feedback preference
risk_note: avoid clinical sensitivity framing
interpretation_boundary: feedback delivery preference only
options:

* A: label_jp: はっきり言われるほうが動ける / label_cn: 清楚直接说更能行动 / score_tags: [direct_feedback_fit] / weights: { psychological_safety_need: -2, growth_environment_need: 2 }
* B: label_jp: 具体的なら受け取りやすい / label_cn: 具体的话容易接收 / score_tags: [specific_feedback] / weights: { psychological_safety_need: 0, growth_environment_need: 2 }
* C: label_jp: よい点と一緒に聞けると助かる / label_cn: 和好的点一起听会有帮助 / score_tags: [balanced_feedback_delivery] / weights: { psychological_safety_need: 1, growth_environment_need: 1 }
* D: label_jp: 次の一歩まで示されると安心 / label_cn: 如果指出下一步会安心 / score_tags: [next_step_feedback] / weights: { psychological_safety_need: 2, growth_environment_need: 1 }
* E: label_jp: 指摘だけが続くと力を出しにくい / label_cn: 只有指出问题持续时很难发挥 / score_tags: [critique_only_drain] / weights: { psychological_safety_need: 3, growth_environment_need: -1 }

### Section 5: 変化・スピード・負荷

#### F02_Q41

id: F02_Q41
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 変化の多い職場環境は、あなたにとってどんな感覚ですか？
prompt_cn: 变化很多的职场环境，对你来说是什么感觉？
primary_dimension: change_tolerance
secondary_dimension: workload_rhythm_fit
sensitivity_level: low
public_private_note: private preference
risk_note: do not imply startup or large company fit
interpretation_boundary: change environment tendency only
options:

* A: label_jp: 変化があるほうが目が覚める / label_cn: 有变化反而醒神 / score_tags: [change_energy] / weights: { change_tolerance: 3, workload_rhythm_fit: 2 }
* B: label_jp: ある程度の変化は楽しめる / label_cn: 一定变化可以享受 / score_tags: [change_tolerant] / weights: { change_tolerance: 2, workload_rhythm_fit: 1 }
* C: label_jp: 変化と安定の両方がほしい / label_cn: 变化和稳定都需要 / score_tags: [change_stability_balance] / weights: { change_tolerance: 0, workload_rhythm_fit: 0 }
* D: label_jp: 変化が続くと準備が必要になる / label_cn: 变化持续时需要准备 / score_tags: [change_preparation_need] / weights: { change_tolerance: -1, workload_rhythm_fit: -1 }
* E: label_jp: 変化が多すぎる環境では消耗しやすい / label_cn: 变化过多的环境容易消耗 / score_tags: [change_drain] / weights: { change_tolerance: -3, workload_rhythm_fit: -2 }

#### F02_Q42

id: F02_Q42
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 短い期限が続く働き方について、どう感じますか？
prompt_cn: 持续短期限的工作方式，你怎么感受？
primary_dimension: workload_rhythm_fit
secondary_dimension: recovery_environment_need
sensitivity_level: medium
public_private_note: workload response is private
risk_note: avoid burnout/health claims
interpretation_boundary: workload rhythm preference only
options:

* A: label_jp: 締切が近いほうが集中しやすい / label_cn: 截止近更容易集中 / score_tags: [deadline_energy] / weights: { workload_rhythm_fit: 3, recovery_environment_need: -2 }
* B: label_jp: 短期集中なら合う / label_cn: 短期集中可以适合 / score_tags: [sprint_fit] / weights: { workload_rhythm_fit: 2, recovery_environment_need: -1 }
* C: label_jp: 繁忙と余白の波があればよい / label_cn: 有忙碌和余白的波动即可 / score_tags: [wave_rhythm] / weights: { workload_rhythm_fit: 1, recovery_environment_need: 1 }
* D: label_jp: 短い期限が続くと回復が必要 / label_cn: 短期限持续会需要恢复 / score_tags: [deadline_recovery_need] / weights: { workload_rhythm_fit: -1, recovery_environment_need: 2 }
* E: label_jp: 常に急ぎの環境では続きにくい / label_cn: 总是紧急的环境难持续 / score_tags: [constant_urgency_drain] / weights: { workload_rhythm_fit: -3, recovery_environment_need: 3 }

#### F02_Q43

id: F02_Q43
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 複数の案件を同時に動かす環境は、あなたにとってどうですか？
prompt_cn: 同时推进多个项目的环境，对你来说如何？
primary_dimension: workload_rhythm_fit
secondary_dimension: focus_environment_need
sensitivity_level: low
public_private_note: private work preference
risk_note: do not imply multitasking ability
interpretation_boundary: task load preference
options:

* A: label_jp: 複数あるほうがリズムが出る / label_cn: 多个任务反而有节奏 / score_tags: [multi_project_fit] / weights: { workload_rhythm_fit: 3, focus_environment_need: -2 }
* B: label_jp: 整理されていれば対応できる / label_cn: 如果整理清楚就能应对 / score_tags: [organized_multi] / weights: { workload_rhythm_fit: 1, focus_environment_need: 0 }
* C: label_jp: 数と優先順位による / label_cn: 看数量和优先级 / score_tags: [priority_dependent] / weights: { workload_rhythm_fit: 0, focus_environment_need: 1 }
* D: label_jp: 一つずつ集中できるほうがよい / label_cn: 更适合一个个集中处理 / score_tags: [single_focus_preference] / weights: { workload_rhythm_fit: -2, focus_environment_need: 2 }
* E: label_jp: 同時進行が多いとかなり消耗する / label_cn: 同时推进太多会很消耗 / score_tags: [multi_project_drain] / weights: { workload_rhythm_fit: -3, focus_environment_need: 3 }

#### F02_Q44

id: F02_Q44
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 急な依頼や差し込み作業が入る環境について、どう感じますか？
prompt_cn: 突然插入请求或临时工作，对你来说如何？
primary_dimension: change_tolerance
secondary_dimension: role_boundary_need
sensitivity_level: medium
public_private_note: private workload boundary
risk_note: avoid refusal advice
interpretation_boundary: interruption/change preference
options:

* A: label_jp: 差し込みがあるほうが動きが出る / label_cn: 有插入任务反而有动感 / score_tags: [ad_hoc_fit] / weights: { change_tolerance: 3, role_boundary_need: -2 }
* B: label_jp: たまになら対応できる / label_cn: 偶尔可以应对 / score_tags: [ad_hoc_tolerant] / weights: { change_tolerance: 1, role_boundary_need: -1 }
* C: label_jp: 優先順位が見えれば対応できる / label_cn: 看见优先级就能应对 / score_tags: [ad_hoc_with_priority] / weights: { change_tolerance: 0, role_boundary_need: 1 }
* D: label_jp: 頻繁だと予定が崩れて疲れやすい / label_cn: 频繁会打乱计划而疲惫 / score_tags: [ad_hoc_fatigue] / weights: { change_tolerance: -2, role_boundary_need: 2 }
* E: label_jp: 差し込みが多い環境では力を出しにくい / label_cn: 插入任务多的环境难发挥 / score_tags: [ad_hoc_drain] / weights: { change_tolerance: -3, role_boundary_need: 3 }

#### F02_Q45

id: F02_Q45
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 忙しい時期と落ち着く時期の波について、どれが近いですか？
prompt_cn: 对忙碌期和稳定期的波动，你更接近哪种？
primary_dimension: workload_rhythm_fit
secondary_dimension: recovery_environment_need
sensitivity_level: low
public_private_note: private rhythm preference
risk_note: avoid health advice
interpretation_boundary: workload wave tendency only
options:

* A: label_jp: 波があるほうが飽きにくい / label_cn: 有波动更不容易厌倦 / score_tags: [wave_energy] / weights: { workload_rhythm_fit: 3, recovery_environment_need: -1 }
* B: label_jp: 忙しい時期があっても切り替えられる / label_cn: 有忙期也能切换 / score_tags: [wave_tolerant] / weights: { workload_rhythm_fit: 2, recovery_environment_need: 0 }
* C: label_jp: 忙しさと回復の見通しがあればよい / label_cn: 有忙碌和恢复预期就好 / score_tags: [wave_with_recovery] / weights: { workload_rhythm_fit: 1, recovery_environment_need: 1 }
* D: label_jp: 波が大きいとリズムを戻すのに時間がいる / label_cn: 波动大时需要时间找回节奏 / score_tags: [wave_recovery_need] / weights: { workload_rhythm_fit: -1, recovery_environment_need: 2 }
* E: label_jp: 波が激しい環境では継続しにくい / label_cn: 波动剧烈的环境难持续 / score_tags: [wave_drain] / weights: { workload_rhythm_fit: -3, recovery_environment_need: 3 }

#### F02_Q46

id: F02_Q46
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 新しいツールや仕組みがよく変わる環境は、あなたにとってどうですか？
prompt_cn: 工具或机制经常变化的环境，对你来说如何？
primary_dimension: change_tolerance
secondary_dimension: growth_environment_need
sensitivity_level: low
public_private_note: safe as preference
risk_note: do not judge learning ability
interpretation_boundary: adaptation preference only
options:

* A: label_jp: 新しいものを試すのが楽しい / label_cn: 尝试新东西很有趣 / score_tags: [tool_change_energy] / weights: { change_tolerance: 3, growth_environment_need: 2 }
* B: label_jp: 便利になるなら歓迎できる / label_cn: 如果更方便可以欢迎 / score_tags: [tool_change_positive] / weights: { change_tolerance: 2, growth_environment_need: 1 }
* C: label_jp: 使い方がわかれば大丈夫 / label_cn: 知道用法就可以 / score_tags: [tool_support_need] / weights: { change_tolerance: 0, growth_environment_need: 1 }
* D: label_jp: 変わる前に説明がほしい / label_cn: 变化前希望有说明 / score_tags: [tool_change_clarity] / weights: { change_tolerance: -1, growth_environment_need: 0 }
* E: label_jp: 仕組みが頻繁に変わると消耗する / label_cn: 机制频繁变化会消耗 / score_tags: [tool_change_drain] / weights: { change_tolerance: -3, growth_environment_need: -1 }

#### F02_Q47

id: F02_Q47
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: スピード感のあるチームで働くとき、あなたはどうなりやすいですか？
prompt_cn: 在速度感很强的团队工作时，你容易怎样？
primary_dimension: decision_speed_fit
secondary_dimension: workload_rhythm_fit
sensitivity_level: low
public_private_note: private preference
risk_note: avoid performance prediction
interpretation_boundary: speed environment tendency only
options:

* A: label_jp: その速さで目が覚める / label_cn: 会被这种速度激活 / score_tags: [speed_energy] / weights: { decision_speed_fit: 3, workload_rhythm_fit: 2 }
* B: label_jp: 目的が見えていれば乗れる / label_cn: 看见目的就能跟上 / score_tags: [purpose_speed_fit] / weights: { decision_speed_fit: 2, workload_rhythm_fit: 1 }
* C: label_jp: 速さと整理の両方がほしい / label_cn: 速度和整理都需要 / score_tags: [speed_structure_balance] / weights: { decision_speed_fit: 0, workload_rhythm_fit: 0 }
* D: label_jp: 速いだけだと確認したくなる / label_cn: 只有快的话会想确认 / score_tags: [speed_check_need] / weights: { decision_speed_fit: -1, workload_rhythm_fit: -1 }
* E: label_jp: 速さが強すぎると置いていかれた感覚になる / label_cn: 速度太强会有被落下感 / score_tags: [speed_drain] / weights: { decision_speed_fit: -3, workload_rhythm_fit: -2 }

#### F02_Q48

id: F02_Q48
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 仕事量が増えたとき、環境に何があると保ちやすいですか？
prompt_cn: 工作量增加时，环境中有什么更容易让你维持住？
primary_dimension: recovery_environment_need
secondary_dimension: workload_rhythm_fit
sensitivity_level: medium
public_private_note: workload condition is private
risk_note: avoid health or burnout prediction
interpretation_boundary: sustainability support preference
options:

* A: label_jp: 自分で優先順位を変えられる裁量 / label_cn: 能自己调整优先级的裁量 / score_tags: [load_autonomy] / weights: { recovery_environment_need: 1, workload_rhythm_fit: 2 }
* B: label_jp: チームで分担を見直せる場 / label_cn: 团队能重新分担的场合 / score_tags: [load_team_support] / weights: { recovery_environment_need: 2, workload_rhythm_fit: 1 }
* C: label_jp: 期限や範囲を確認できること / label_cn: 能确认期限和范围 / score_tags: [load_scope_clarity] / weights: { recovery_environment_need: 2, workload_rhythm_fit: 0 }
* D: label_jp: 休む時間や空白が確保されること / label_cn: 能确保休息时间和空白 / score_tags: [load_recovery_space] / weights: { recovery_environment_need: 3, workload_rhythm_fit: -1 }
* E: label_jp: 増えたまま放置されるとかなり消耗する / label_cn: 增加后被放置会很消耗 / score_tags: [load_unmanaged_drain] / weights: { recovery_environment_need: 3, workload_rhythm_fit: -3 }

#### F02_Q49

id: F02_Q49
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 先が読めないプロジェクトに入るとき、どんな環境なら動けますか？
prompt_cn: 进入前景不确定的项目时，怎样的环境能让你行动？
primary_dimension: change_tolerance
secondary_dimension: psychological_safety_need
sensitivity_level: medium
public_private_note: private uncertainty preference
risk_note: avoid anxiety diagnosis
interpretation_boundary: uncertainty support preference
options:

* A: label_jp: 不確実なほうが面白い / label_cn: 不确定反而有意思 / score_tags: [uncertainty_energy] / weights: { change_tolerance: 3, psychological_safety_need: -1 }
* B: label_jp: 試せる余地があれば動ける / label_cn: 有试的余地就能动 / score_tags: [uncertainty_experiment] / weights: { change_tolerance: 2, psychological_safety_need: 0 }
* C: label_jp: 仮説と次の確認点があれば動ける / label_cn: 有假设和下个确认点就能动 / score_tags: [uncertainty_structure] / weights: { change_tolerance: 0, psychological_safety_need: 1 }
* D: label_jp: 役割や撤退条件が見えると安心 / label_cn: 看见角色和退出条件会安心 / score_tags: [uncertainty_boundary] / weights: { change_tolerance: -1, psychological_safety_need: 2 }
* E: label_jp: 不確実なまま進む環境は消耗しやすい / label_cn: 在不确定中推进的环境容易消耗 / score_tags: [uncertainty_drain] / weights: { change_tolerance: -3, psychological_safety_need: 3 }

#### F02_Q50

id: F02_Q50
section: 変化・スピード・負荷
question_type: single_select_5
prompt_jp: 忙しさの中で、何が一番あると助かりますか？
prompt_cn: 忙碌中，最有帮助的是什么？
primary_dimension: workload_rhythm_fit
secondary_dimension: recovery_environment_need
sensitivity_level: low
public_private_note: private preference
risk_note: avoid productivity prescription
interpretation_boundary: support condition preference
options:

* A: label_jp: その場で決めて進むスピード / label_cn: 当场决定推进的速度 / score_tags: [busy_speed_support] / weights: { workload_rhythm_fit: 3, recovery_environment_need: -1 }
* B: label_jp: チームで声をかけ合うこと / label_cn: 团队互相招呼 / score_tags: [busy_team_support] / weights: { workload_rhythm_fit: 2, recovery_environment_need: 1 }
* C: label_jp: 優先順位が見えること / label_cn: 能看见优先级 / score_tags: [busy_priority] / weights: { workload_rhythm_fit: 1, recovery_environment_need: 1 }
* D: label_jp: 一人で集中する時間 / label_cn: 一个人集中的时间 / score_tags: [busy_focus_block] / weights: { workload_rhythm_fit: -1, recovery_environment_need: 2 }
* E: label_jp: 回復できる余白 / label_cn: 能恢复的余白 / score_tags: [busy_recovery_need] / weights: { workload_rhythm_fit: -2, recovery_environment_need: 3 }

### Section 6: 回復・継続・環境調整

#### F02_Q51

id: F02_Q51
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 仕事の合間に回復するには、どんな環境が必要ですか？
prompt_cn: 工作间隙恢复时，你需要怎样的环境？
primary_dimension: recovery_environment_need
secondary_dimension: sensory_environment_fit
sensitivity_level: low
public_private_note: private recovery preference
risk_note: do not give health advice
interpretation_boundary: recovery condition preference only
options:

* A: label_jp: 人と話すことで切り替わる / label_cn: 和人说话能切换 / score_tags: [social_recovery] / weights: { recovery_environment_need: -2, sensory_environment_fit: -1 }
* B: label_jp: 軽い雑談や移動で戻れる / label_cn: 轻闲聊或移动能回来 / score_tags: [light_recovery] / weights: { recovery_environment_need: -1, sensory_environment_fit: 0 }
* C: label_jp: 少し静かな時間があるとよい / label_cn: 有一点安静时间会好 / score_tags: [quiet_recovery] / weights: { recovery_environment_need: 1, sensory_environment_fit: 1 }
* D: label_jp: 一人になれる時間が必要 / label_cn: 需要一个人的时间 / score_tags: [solo_recovery] / weights: { recovery_environment_need: 2, sensory_environment_fit: 2 }
* E: label_jp: 回復できる場所がないと続きにくい / label_cn: 没有恢复场所会难持续 / score_tags: [recovery_place_need] / weights: { recovery_environment_need: 3, sensory_environment_fit: 3 }

#### F02_Q52

id: F02_Q52
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 長く続けやすい環境として、どれが近いですか？
prompt_cn: 对你来说，容易长期持续的环境更接近哪种？
primary_dimension: recovery_environment_need
secondary_dimension: workload_rhythm_fit
sensitivity_level: low
public_private_note: safe as tendency
risk_note: do not predict retention or career outcome
interpretation_boundary: sustainability preference only
options:

* A: label_jp: 刺激や変化がある環境 / label_cn: 有刺激和变化的环境 / score_tags: [stimulus_sustain] / weights: { recovery_environment_need: -2, workload_rhythm_fit: 2 }
* B: label_jp: 挑戦と休みの波がある環境 / label_cn: 有挑战和休息波动的环境 / score_tags: [wave_sustain] / weights: { recovery_environment_need: 1, workload_rhythm_fit: 2 }
* C: label_jp: 役割とペースが見える環境 / label_cn: 角色和节奏可见的环境 / score_tags: [clear_pace_sustain] / weights: { recovery_environment_need: 1, workload_rhythm_fit: 0 }
* D: label_jp: 無理なく調整できる環境 / label_cn: 可以无压力调整的环境 / score_tags: [adjustable_sustain] / weights: { recovery_environment_need: 2, workload_rhythm_fit: -1 }
* E: label_jp: 余白と境界を守れる環境 / label_cn: 能守住余白和边界的环境 / score_tags: [boundary_sustain] / weights: { recovery_environment_need: 3, workload_rhythm_fit: -2 }

#### F02_Q53

id: F02_Q53
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 働く時間帯やペースを調整できることは、どのくらい重要ですか？
prompt_cn: 可以调整工作时间段和节奏，对你有多重要？
primary_dimension: autonomy_need
secondary_dimension: recovery_environment_need
sensitivity_level: low
public_private_note: private preference
risk_note: avoid claiming flexible work requirement
interpretation_boundary: schedule autonomy preference
options:

* A: label_jp: 決まった時間のほうが安定する / label_cn: 固定时间更稳定 / score_tags: [fixed_schedule_fit] / weights: { autonomy_need: -3, recovery_environment_need: -1 }
* B: label_jp: 基本は決まっているほうがよい / label_cn: 基本固定更好 / score_tags: [mostly_fixed_schedule] / weights: { autonomy_need: -2, recovery_environment_need: 0 }
* C: label_jp: 一部調整できると助かる / label_cn: 部分可调整会有帮助 / score_tags: [partial_schedule_flex] / weights: { autonomy_need: 1, recovery_environment_need: 1 }
* D: label_jp: 集中や回復に合わせて調整したい / label_cn: 想按集中和恢复调整 / score_tags: [rhythm_based_schedule] / weights: { autonomy_need: 2, recovery_environment_need: 2 }
* E: label_jp: 時間の裁量がないと継続しにくい / label_cn: 没有时间裁量会难持续 / score_tags: [schedule_autonomy_need] / weights: { autonomy_need: 3, recovery_environment_need: 3 }

#### F02_Q54

id: F02_Q54
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 在宅・出社・ハイブリッドについて、今のあなたに近い感覚はどれですか？
prompt_cn: 关于居家、到岗、混合办公，现在你的感觉更接近哪种？
primary_dimension: remote_onsite_fit
secondary_dimension: team_distance_preference
sensitivity_level: low
public_private_note: private preference
risk_note: must not say user should choose remote/onsite
interpretation_boundary: current fit tendency only
options:

* A: label_jp: 出社で人の流れがあるほうが合う / label_cn: 到岗有人的流动更适合 / score_tags: [onsite_energy] / weights: { remote_onsite_fit: -3, team_distance_preference: 3 }
* B: label_jp: 出社中心でも問題ない / label_cn: 以到岗为主也没问题 / score_tags: [onsite_ok] / weights: { remote_onsite_fit: -2, team_distance_preference: 1 }
* C: label_jp: ハイブリッドが合いやすい / label_cn: 混合办公更合适 / score_tags: [hybrid_fit] / weights: { remote_onsite_fit: 1, team_distance_preference: 0 }
* D: label_jp: 在宅や静かな場所があると力が出る / label_cn: 有居家或安静地点更能发挥 / score_tags: [remote_focus] / weights: { remote_onsite_fit: 2, team_distance_preference: -1 }
* E: label_jp: 自分で場所を選べることが大切 / label_cn: 能自己选择地点很重要 / score_tags: [location_choice_need] / weights: { remote_onsite_fit: 3, team_distance_preference: -1 }

#### F02_Q55

id: F02_Q55
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 仕事の終わり方として、どれがあると翌日に戻りやすいですか？
prompt_cn: 工作结束方式中，哪种会让你第二天更容易回来？
primary_dimension: recovery_environment_need
secondary_dimension: role_boundary_need
sensitivity_level: low
public_private_note: private recovery preference
risk_note: do not give sleep/health advice
interpretation_boundary: closure preference
options:

* A: label_jp: 終わりを決めず流れで進めるほうが楽 / label_cn: 不固定结束，顺着流动更轻松 / score_tags: [fluid_closure] / weights: { recovery_environment_need: -2, role_boundary_need: -2 }
* B: label_jp: 大きな区切りだけあればよい / label_cn: 有大区分就好 / score_tags: [simple_closure] / weights: { recovery_environment_need: -1, role_boundary_need: -1 }
* C: label_jp: 明日の入口を残せるとよい / label_cn: 能留下明天入口会好 / score_tags: [next_entry_closure] / weights: { recovery_environment_need: 1, role_boundary_need: 1 }
* D: label_jp: 終了時間や範囲を決めたい / label_cn: 想决定结束时间和范围 / score_tags: [clear_closure] / weights: { recovery_environment_need: 2, role_boundary_need: 2 }
* E: label_jp: 終わりがない環境では休みにくい / label_cn: 没有结束感的环境很难休息 / score_tags: [no_closure_drain] / weights: { recovery_environment_need: 3, role_boundary_need: 3 }

#### F02_Q56

id: F02_Q56
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 環境が合わないと感じたとき、何があると調整しやすいですか？
prompt_cn: 感到环境不合适时，有什么会更容易调整？
primary_dimension: psychological_safety_need
secondary_dimension: autonomy_need
sensitivity_level: medium
public_private_note: private workplace adjustment preference
risk_note: do not instruct user to negotiate or complain
interpretation_boundary: adjustment support preference only
options:

* A: label_jp: 自分で工夫できる余地 / label_cn: 自己能想办法的余地 / score_tags: [self_adjustment] / weights: { psychological_safety_need: 0, autonomy_need: 3 }
* B: label_jp: 小さく試せる制度 / label_cn: 可以小范围尝试的制度 / score_tags: [trial_adjustment] / weights: { psychological_safety_need: 1, autonomy_need: 2 }
* C: label_jp: 相談できる窓口や相手 / label_cn: 可以咨询的窗口或对象 / score_tags: [adjustment_support] / weights: { psychological_safety_need: 2, autonomy_need: 1 }
* D: label_jp: 理由を説明しやすい空気 / label_cn: 容易说明理由的氛围 / score_tags: [adjustment_safety] / weights: { psychological_safety_need: 3, autonomy_need: 1 }
* E: label_jp: 変えられない環境では消耗が残りやすい / label_cn: 无法改变的环境容易留下消耗 / score_tags: [adjustment_block_drain] / weights: { psychological_safety_need: 3, autonomy_need: 2 }

#### F02_Q57

id: F02_Q57
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 仕事で疲れがたまったとき、どんなサインが出やすいですか？
prompt_cn: 工作疲惫累积时，你容易出现什么信号？
primary_dimension: recovery_environment_need
secondary_dimension: workload_rhythm_fit
sensitivity_level: medium
public_private_note: private self-observation
risk_note: non-clinical; no health interpretation
interpretation_boundary: self-reflection signal only
options:

* A: label_jp: 少し休めばすぐ戻る / label_cn: 稍微休息就能回来 / score_tags: [quick_recovery] / weights: { recovery_environment_need: -2, workload_rhythm_fit: 1 }
* B: label_jp: 集中が浅くなる / label_cn: 集中变浅 / score_tags: [focus_fatigue] / weights: { recovery_environment_need: 1, workload_rhythm_fit: 0 }
* C: label_jp: 返事や判断が重くなる / label_cn: 回复和判断变重 / score_tags: [decision_fatigue] / weights: { recovery_environment_need: 2, workload_rhythm_fit: -1 }
* D: label_jp: 音や人の動きが気になりやすくなる / label_cn: 更在意声音和人的动静 / score_tags: [sensory_fatigue] / weights: { recovery_environment_need: 2, workload_rhythm_fit: -2 }
* E: label_jp: 回復の時間がないと続けにくくなる / label_cn: 没有恢复时间会难以持续 / score_tags: [recovery_debt] / weights: { recovery_environment_need: 3, workload_rhythm_fit: -3 }

#### F02_Q58

id: F02_Q58
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 職場で「自分らしく働けている」と感じるのは、どんなときですか？
prompt_cn: 在职场中，你什么时候会觉得“比较像自己地工作”？
primary_dimension: growth_environment_need
secondary_dimension: autonomy_need
sensitivity_level: medium
public_private_note: private self-understanding
risk_note: avoid identity diagnosis
interpretation_boundary: self-perceived fit cue only
options:

* A: label_jp: 新しいことに挑戦できるとき / label_cn: 能挑战新事物时 / score_tags: [challenge_self_fit] / weights: { growth_environment_need: 3, autonomy_need: 2 }
* B: label_jp: 自分の工夫が活かせるとき / label_cn: 自己的办法能被活用时 / score_tags: [craft_self_fit] / weights: { growth_environment_need: 2, autonomy_need: 3 }
* C: label_jp: 役割が見えて安心して動けるとき / label_cn: 看见角色并安心行动时 / score_tags: [role_self_fit] / weights: { growth_environment_need: 1, autonomy_need: 0 }
* D: label_jp: 人と協力して前に進めるとき / label_cn: 与人协作推进时 / score_tags: [team_self_fit] / weights: { growth_environment_need: 1, autonomy_need: -1 }
* E: label_jp: 無理なく続けられる余白があるとき / label_cn: 有能无压力持续的余白时 / score_tags: [sustainable_self_fit] / weights: { growth_environment_need: 1, autonomy_need: 1 }

#### F02_Q59

id: F02_Q59
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: 職場環境を比較するとき、あなたが一番見たい条件はどれですか？
prompt_cn: 比较职场环境时，你最想看的条件是哪一个？
primary_dimension: role_boundary_need
secondary_dimension: feedback_clarity_need
sensitivity_level: low
public_private_note: safe as preference
risk_note: do not create job recommendation
interpretation_boundary: comparison lens only
options:

* A: label_jp: 裁量や自由度 / label_cn: 裁量和自由度 / score_tags: [compare_autonomy] / weights: { role_boundary_need: -1, feedback_clarity_need: -1 }
* B: label_jp: チームの距離感 / label_cn: 团队距离感 / score_tags: [compare_team_distance] / weights: { role_boundary_need: 0, feedback_clarity_need: 0 }
* C: label_jp: 評価や期待値の明確さ / label_cn: 评价和期待值的明确度 / score_tags: [compare_feedback] / weights: { role_boundary_need: 1, feedback_clarity_need: 3 }
* D: label_jp: 境界や役割の明確さ / label_cn: 边界和角色的明确度 / score_tags: [compare_boundary] / weights: { role_boundary_need: 3, feedback_clarity_need: 1 }
* E: label_jp: 回復や継続のしやすさ / label_cn: 恢复和持续的容易度 / score_tags: [compare_recovery] / weights: { role_boundary_need: 2, feedback_clarity_need: 1 }

#### F02_Q60

id: F02_Q60
section: 回復・継続・環境調整
question_type: single_select_5
prompt_jp: この診断結果を、どんな用途で受け取りたいですか？
prompt_cn: 你希望把本诊断结果用于什么用途？
primary_dimension: growth_environment_need
secondary_dimension: recovery_environment_need
sensitivity_level: low
public_private_note: user intent signal; keep private
risk_note: must not create career instruction
interpretation_boundary: routing signal only
options:

* A: label_jp: 自分に合う環境をざっくり知りたい / label_cn: 想大致了解适合自己的环境 / score_tags: [free_result_fit] / weights: { growth_environment_need: 1, recovery_environment_need: 0 }
* B: label_jp: 今の職場との違和感を整理したい / label_cn: 想整理与当前职场的不适感 / score_tags: [c02_bridge_signal] / weights: { growth_environment_need: 0, recovery_environment_need: 2 }
* C: label_jp: 働き方そのものも見たい / label_cn: 也想看自己的工作方式 / score_tags: [f01_bridge_signal] / weights: { growth_environment_need: 1, recovery_environment_need: 1 }
* D: label_jp: 深いレポートで条件を比較したい / label_cn: 想用深度报告比较条件 / score_tags: [paid_report_interest] / weights: { growth_environment_need: 2, recovery_environment_need: 1 }
* E: label_jp: 自分全体の状態とつなげて見たい / label_cn: 想和整体自我状态连接来看 / score_tags: [main_120_bridge_signal] / weights: { growth_environment_need: 2, recovery_environment_need: 2 }

## 6. Dimensions and Scoring Model

### Core Dimensions

* sensory_environment_fit: sensitivity or comfort with sound, visual movement, open space, sensory load.
* focus_environment_need: need for protected deep work, quiet space, and uninterrupted blocks.
* team_distance_preference: preferred closeness or distance with team members.
* communication_density: preferred amount and rhythm of communication, chat, meetings, and casual exchange.
* autonomy_need: need for discretion over method, schedule, place, and decision-making.
* rule_structure_need: need for clear rules, templates, procedures, and stable structure.
* decision_speed_fit: fit with fast, adaptive, or deliberate decision environments.
* feedback_clarity_need: need for explicit expectations, evaluation criteria, and feedback.
* psychological_safety_need: need for non-blaming, consultable, emotionally safe work atmosphere.
* change_tolerance: comfort with change, experimentation, uncertainty, and shifting priorities.
* workload_rhythm_fit: fit with sprint, wave, steady, or low-interruption workload rhythms.
* recovery_environment_need: need for breaks, closure, quiet, recovery spaces, and sustainable pacing.
* conflict_noise_sensitivity: sensitivity to emotional conflict, debate intensity, and busy team atmosphere.
* role_boundary_need: need for clear role boundaries, personal/professional distance, and scope protection.
* growth_environment_need: preferred growth conditions such as challenge, support, clarity, and experimentation.
* remote_onsite_fit: fit tendencies around onsite, remote, hybrid, place stability, and location choice.

### Scoring Notes

* Each answer contributes weighted signals to one primary and one secondary dimension.
* Result assignment should combine top dimensions, drain dimensions, and stabilizing dimensions.
* No dimension should be interpreted as ability, diagnosis, employability, personality disorder, career destiny, or job performance.
* Scores should be normalized internally and shown externally as gentle tendencies, not hard rankings.
* Public result should show 2-3 top environment tendencies and 1 possible drain signal.
* Private/paid report may show deeper comparison conditions and self-reflection prompts.

## 7. Result Types

### F02_RESULT_01

result_type_id: F02_RESULT_01
name_jp: 静かに深まる環境
name_cn: 安静深入型环境
core_fit: quiet, protected, deep-focus environments
likely_supports: concentrated work, thoughtful output, low-noise routines
likely_drains: constant noise, sudden interruptions, visible busyness
primary_dimensions: [sensory_environment_fit, focus_environment_need, recovery_environment_need]
public_summary_jp: あなたは、静かに集中できる環境で力を出しやすい傾向があります。音や中断が少ないほど、考えが深まりやすいタイプです。
private_note_jp: 深い集中のためには、場所・時間・通知の調整が重要な条件になりやすいです。

### F02_RESULT_02

result_type_id: F02_RESULT_02
name_jp: 近いチームで動く環境
name_cn: 近距离团队行动型环境
core_fit: close team rhythm, quick exchange, shared movement
likely_supports: fast coordination, shared energy, immediate support
likely_drains: isolation, information gaps, overly silent environments
primary_dimensions: [team_distance_preference, communication_density, psychological_safety_need]
public_summary_jp: あなたは、人の気配やチームの動きがある環境でリズムを作りやすい傾向があります。
private_note_jp: 連携の近さが力になる一方で、相談しやすさと情報整理の質も大切です。

### F02_RESULT_03

result_type_id: F02_RESULT_03
name_jp: 裁量で伸びる環境
name_cn: 裁量成长型环境
core_fit: autonomy, method choice, flexible decision space
likely_supports: self-directed projects, creative methods, ownership
likely_drains: micromanagement, rigid procedures, narrow role control
primary_dimensions: [autonomy_need, growth_environment_need, decision_speed_fit]
public_summary_jp: あなたは、自分で考え、方法を選べる環境で力を伸ばしやすい傾向があります。
private_note_jp: 裁量があるほど伸びやすい一方で、期待値の確認点もあると安定しやすいです。

### F02_RESULT_04

result_type_id: F02_RESULT_04
name_jp: ルールで安定する環境
name_cn: 规则稳定型环境
core_fit: clear structure, procedures, role clarity, criteria
likely_supports: steady execution, reliable planning, reduced ambiguity
likely_drains: vague expectations, sudden changes, unclear responsibility
primary_dimensions: [rule_structure_need, role_boundary_need, feedback_clarity_need]
public_summary_jp: あなたは、ルールや役割、評価基準が見える環境で安定して動きやすい傾向があります。
private_note_jp: 明確さは安心の土台になりやすく、曖昧さが多い環境では消耗信号が出やすいです。

### F02_RESULT_05

result_type_id: F02_RESULT_05
name_jp: 変化で目が覚める環境
name_cn: 变化激活型环境
core_fit: change, speed, experimentation, dynamic priorities
likely_supports: quick decisions, new tools, project shifts, challenge
likely_drains: repetitive routines, slow decisions, overly fixed systems
primary_dimensions: [change_tolerance, decision_speed_fit, workload_rhythm_fit]
public_summary_jp: あなたは、変化やスピードのある環境で目が覚め、動き出しやすい傾向があります。
private_note_jp: 変化が力になる一方で、回復の波や優先順位の整理があると続きやすくなります。

### F02_RESULT_06

result_type_id: F02_RESULT_06
name_jp: 余白で続く環境
name_cn: 余白持续型环境
core_fit: recovery, sustainable pace, closure, flexible adjustment
likely_supports: long-term consistency, self-maintenance, careful work
likely_drains: constant urgency, no closure, recovery gaps
primary_dimensions: [recovery_environment_need, workload_rhythm_fit, role_boundary_need]
public_summary_jp: あなたは、余白と回復のある環境で長く力を保ちやすい傾向があります。
private_note_jp: 忙しさそのものより、終わり方・休み方・境界の見え方が重要になりやすいです。

### F02_RESULT_07

result_type_id: F02_RESULT_07
name_jp: フィードバックで整う環境
name_cn: 反馈校准型环境
core_fit: explicit feedback, clear expectations, consultable support
likely_supports: growth, confidence, direction correction
likely_drains: silence, ambiguous evaluation, unclear standards
primary_dimensions: [feedback_clarity_need, psychological_safety_need, growth_environment_need]
public_summary_jp: あなたは、期待値やフィードバックが見える環境で安心して整いやすい傾向があります。
private_note_jp: 反応があることで方向確認がしやすく、成長の手がかりも受け取りやすくなります。

### F02_RESULT_08

result_type_id: F02_RESULT_08
name_jp: 境界を守る環境
name_cn: 边界守护型环境
core_fit: role clarity, professional boundaries, protected time and space
likely_supports: stable contribution, clear responsibility, reduced overextension
likely_drains: blurred roles, excessive closeness, unmanaged requests
primary_dimensions: [role_boundary_need, team_distance_preference, psychological_safety_need]
public_summary_jp: あなたは、役割や距離の境界が守られる環境で力を出しやすい傾向があります。
private_note_jp: 境界が見えるほど、自分の担当に集中しやすく、抱え込みを減らしやすいです。

## 8. Result Assignment Rules

Primary assignment:

* Identify the top 3 normalized dimensions.
* Identify the top 2 drain signals from high sensitivity to noise, ambiguity, conflict, urgency, or boundary blur.
* Assign result type by the strongest matching dimension cluster.

Cluster rules:

* 静かに深まる環境: high sensory_environment_fit + high focus_environment_need + high recovery_environment_need.
* 近いチームで動く環境: high team_distance_preference + high communication_density.
* 裁量で伸びる環境: high autonomy_need + high growth_environment_need + lower rule_structure_need.
* ルールで安定する環境: high rule_structure_need + high feedback_clarity_need + high role_boundary_need.
* 変化で目が覚める環境: high change_tolerance + high decision_speed_fit + positive workload_rhythm_fit.
* 余白で続く環境: high recovery_environment_need + lower workload_rhythm_fit for constant urgency.
* フィードバックで整う環境: high feedback_clarity_need + high psychological_safety_need.
* 境界を守る環境: high role_boundary_need + lower team_distance_preference for excessive closeness.

Tie-breakers:

* If recovery_environment_need is high and workload_rhythm_fit is negative, prefer 余白で続く環境.
* If feedback_clarity_need and psychological_safety_need are both high, prefer フィードバックで整う環境.
* If role_boundary_need is high and team_distance_preference is low, prefer 境界を守る環境.
* If autonomy_need is high and rule_structure_need is low, prefer 裁量で伸びる環境.
* If change_tolerance is high and decision_speed_fit is high, prefer 変化で目が覚める環境.

Output rules:

* Do not show hard scores as proof.
* Do not say the user should change jobs, quit, stay, or choose a specific employer.
* Do not rank companies, industries, roles, or work styles.
* Show environment tendencies and comparison conditions only.

## 9. Free Result Structure

Free result screen must include:

* Result type name
* One public-safe recognition line
* Top 2-3 supportive environment signals
* One likely drain signal
* "Worth comparing" workplace conditions
* CTA to F01
* CTA to C02
* CTA to main 120-question test
* Paid report preview block
* Boundary microcopy

Example free result block:

* あなたは「静かに深まる環境」タイプの傾向があります。
* 力を出しやすい条件: 静かな集中時間 / 中断の少なさ / 回復できる余白
* 消耗しやすい信号: 通知や声かけが連続する環境
* 比較してみたい条件: 席の選びやすさ、会議の密度、集中時間の守られ方

Boundary copy:
「この結果は職業判断ではなく、働く環境を比較するための自己理解メモです。」

## 10. Paid Report Outline

Paid report role: deeper self-understanding and workplace condition comparison.

Paid report sections:

1. Your core environment fit pattern
2. Focus and sensory environment map
3. Team distance and communication map
4. Autonomy, rules, and decision environment map
5. Feedback and psychological safety map
6. Change, speed, and workload rhythm map
7. Recovery and sustainability map
8. Workplace condition comparison checklist
9. Conversation prompts for career discussion
10. Recommended next Yorisou checks

Paid report must not include:

* specific company recommendations
* resignation or job-change advice
* salary prediction
* success/failure prediction
* diagnosis or professional assessment claims
* hidden affiliate product recommendations
* urgent paid pressure

Paid preview copy:
「深いレポートでは、あなたが力を出しやすい環境条件と、消耗しやすい環境信号をもう少し細かく整理します。転職判断ではなく、職場条件を比較するためのメモとして使えます。」

## 11. Share Card Logic

Share card must be public-safe.

Share card includes:

* test_name_jp: 職場環境フィット診断
* result_type_name_jp
* public-safe recognition line
* 2 supportive environment tags
* one boundary microcopy
* Yorisou mark/name

Share card must not include:

* private work stress details
* current employer implication
* "you should quit/change jobs"
* specific company, industry, role, salary, promotion, success/failure language
* paid report teaser with anxiety pressure
* raw answers or scores

Example share line:
「わたしは『余白で続く環境』タイプ。回復できる余白があるほど、力を保ちやすいみたい。」

## 12. Recommendation Mapping

Primary routes:

* F01 向いている働き方診断:

  * when user wants to understand personal work rhythm, collaboration style, or how they work.
* C02 今のわたしチェック:

  * when result suggests fatigue, uncertainty, current mismatch feeling, or self-state reflection.
* Main 120-question test:

  * when user wants deeper life-state understanding beyond work.
* S01 今日のおみくじ:

  * light return path after completing F02.

Recommendation graph signals:

* High sensory_environment_fit: quiet tools, focus routines, workspace comparison content.
* High communication_density: team communication content, meeting rhythm reflection.
* High autonomy_need: self-management tools, planning content, F01 bridge.
* High rule_structure_need: checklist templates, expectation-setting content.
* High feedback_clarity_need: feedback conversation guides, manager 1on1 preparation content.
* High recovery_environment_need: recovery rhythm content, sustainable work pacing content.
* High role_boundary_need: boundary reflection content, scope clarification prompts.
* High change_tolerance: change-friendly work rhythm content.

Commercial boundary:

* Do not present recommendations as a marketplace, affiliate shelf, job board, or product catalog in v1.0.
* All recommendation labels must be disclosure-ready if commercial relationships are added later.

## 13. LINE / Web Return Path

LINE save path:

* User taps: LINEで結果を保存する
* Show consent: 「診断結果をLINEに保存し、あとで見返せます。職場名や個人情報は保存しません。」
* Opt-in must be optional.
* User can continue without LINE save.

Web return path:

* User can save result locally or copy URL.
* Saved result may show result type, top environment tendencies, comparison checklist, and next recommended test.
* Saved archive must not imply career tracking, job suitability certification, or employer evaluation.

Return copy:
「あとで職場条件を比べるときのメモとして保存できます。」

## 14. UX Implementation Notes

Mobile-first screen order:

1. Header and test title
2. Boundary microcopy
3. Progress indicator by section
4. Question card
5. Five answer buttons
6. Section transition summary
7. Result loading
8. Free result card
9. F01/C02/main test CTA
10. Paid report preview
11. Share/save row
12. Privacy and boundary note

Component notes:

* Use calm, work-focused design.
* Do not use corporate stock imagery that implies job placement.
* Do not use ranking meters, company-fit scores, resignation prompts, or career decision labels.
* Show section names clearly.
* Keep question copy short for mobile.
* Allow users to pause and resume if implementation later supports save state.
* Results should feel like a self-understanding memo, not an assessment certificate.
* Paid preview must be curiosity-based, not fear-based.

Japanese readability:

* Use やすい / 傾向 / 手がかり / 比較条件 / 参考.
* Avoid べき, 絶対, 向いていない, 辞めたほうがいい, 成功する, 失敗する.
* Avoid diagnosing stress, burnout, disorder, or mental health state.
* Avoid implying employer fault.

## 15. Trust-Risk Review

Risk category: work/career-adjacent self-understanding with medium trust sensitivity.

Key risks:

* User may interpret result as job-change advice.
* Result may imply current workplace is bad or unsuitable.
* Environment fit may be mistaken for career destiny.
* Workload/recovery questions may drift into health or burnout claims.
* Recommendations may drift into job marketplace or affiliate products.
* Paid report may feel like pressure during career uncertainty.

Mitigations:

* Repeatedly state that F02 is not career advice or professional assessment.
* Do not mention quitting, changing jobs, salary, promotion, success, failure, or company suitability as conclusions.
* Keep result language as tendencies and comparison conditions.
* Keep employer/company names out of inputs.
* Keep recommendation graph broad, content/tool/module oriented, and non-commercial in v1.0.
* Route personal work style to F01 and current state to C02.
* Require trust-risk review before implementation.

Review needed before implementation:

* Founder review for F02/F01 distinction.
* Trust-risk review for career-adjacent boundaries.
* UI/UX review for long-test mobile completion.
* Copy review for non-directive Japanese.
* Data spec review before Codex handoff.

## 16. Complete TypeScript-Friendly Data Spec

```ts
export const f02ShokubaKankyouFitShindanV10 = {
  test_id: "F02",
  test_name_jp: "職場環境フィット診断",
  test_name_cn: "职场环境适配诊断",
  layer: "Yorisou Fit / Work",
  version: "v1.0",
  codex_ready: false,
  founder_review_needed: true,
  trust_risk_review_needed: true,
  format: {
    type: "long_form_work_environment_fit_test",
    question_count: 60,
    section_count: 6,
    questions_per_section: 10,
    options_per_question: 5,
    boundary: "self_understanding_reference_only_not_career_advice"
  },
  dimensions: [
    "sensory_environment_fit",
    "focus_environment_need",
    "team_distance_preference",
    "communication_density",
    "autonomy_need",
    "rule_structure_need",
    "decision_speed_fit",
    "feedback_clarity_need",
    "psychological_safety_need",
    "change_tolerance",
    "workload_rhythm_fit",
    "recovery_environment_need",
    "conflict_noise_sensitivity",
    "role_boundary_need",
    "growth_environment_need",
    "remote_onsite_fit"
  ],
  sections: [
    { id: "S1", title_jp: "音・空間・集中環境", question_ids: ["F02_Q01","F02_Q02","F02_Q03","F02_Q04","F02_Q05","F02_Q06","F02_Q07","F02_Q08","F02_Q09","F02_Q10"] },
    { id: "S2", title_jp: "チーム距離とコミュニケーション", question_ids: ["F02_Q11","F02_Q12","F02_Q13","F02_Q14","F02_Q15","F02_Q16","F02_Q17","F02_Q18","F02_Q19","F02_Q20"] },
    { id: "S3", title_jp: "裁量・ルール・意思決定", question_ids: ["F02_Q21","F02_Q22","F02_Q23","F02_Q24","F02_Q25","F02_Q26","F02_Q27","F02_Q28","F02_Q29","F02_Q30"] },
    { id: "S4", title_jp: "評価・フィードバック・安心感", question_ids: ["F02_Q31","F02_Q32","F02_Q33","F02_Q34","F02_Q35","F02_Q36","F02_Q37","F02_Q38","F02_Q39","F02_Q40"] },
    { id: "S5", title_jp: "変化・スピード・負荷", question_ids: ["F02_Q41","F02_Q42","F02_Q43","F02_Q44","F02_Q45","F02_Q46","F02_Q47","F02_Q48","F02_Q49","F02_Q50"] },
    { id: "S6", title_jp: "回復・継続・環境調整", question_ids: ["F02_Q51","F02_Q52","F02_Q53","F02_Q54","F02_Q55","F02_Q56","F02_Q57","F02_Q58","F02_Q59","F02_Q60"] }
  ],
  result_types: [
    {
      result_type_id: "F02_RESULT_01",
      name_jp: "静かに深まる環境",
      name_cn: "安静深入型环境",
      primary_dimensions: ["sensory_environment_fit","focus_environment_need","recovery_environment_need"],
      public_summary_jp: "あなたは、静かに集中できる環境で力を出しやすい傾向があります。"
    },
    {
      result_type_id: "F02_RESULT_02",
      name_jp: "近いチームで動く環境",
      name_cn: "近距离团队行动型环境",
      primary_dimensions: ["team_distance_preference","communication_density","psychological_safety_need"],
      public_summary_jp: "あなたは、人の気配やチームの動きがある環境でリズムを作りやすい傾向があります。"
    },
    {
      result_type_id: "F02_RESULT_03",
      name_jp: "裁量で伸びる環境",
      name_cn: "裁量成长型环境",
      primary_dimensions: ["autonomy_need","growth_environment_need","decision_speed_fit"],
      public_summary_jp: "あなたは、自分で考え、方法を選べる環境で力を伸ばしやすい傾向があります。"
    },
    {
      result_type_id: "F02_RESULT_04",
      name_jp: "ルールで安定する環境",
      name_cn: "规则稳定型环境",
      primary_dimensions: ["rule_structure_need","role_boundary_need","feedback_clarity_need"],
      public_summary_jp: "あなたは、ルールや役割、評価基準が見える環境で安定して動きやすい傾向があります。"
    },
    {
      result_type_id: "F02_RESULT_05",
      name_jp: "変化で目が覚める環境",
      name_cn: "变化激活型环境",
      primary_dimensions: ["change_tolerance","decision_speed_fit","workload_rhythm_fit"],
      public_summary_jp: "あなたは、変化やスピードのある環境で目が覚め、動き出しやすい傾向があります。"
    },
    {
      result_type_id: "F02_RESULT_06",
      name_jp: "余白で続く環境",
      name_cn: "余白持续型环境",
      primary_dimensions: ["recovery_environment_need","workload_rhythm_fit","role_boundary_need"],
      public_summary_jp: "あなたは、余白と回復のある環境で長く力を保ちやすい傾向があります。"
    },
    {
      result_type_id: "F02_RESULT_07",
      name_jp: "フィードバックで整う環境",
      name_cn: "反馈校准型环境",
      primary_dimensions: ["feedback_clarity_need","psychological_safety_need","growth_environment_need"],
      public_summary_jp: "あなたは、期待値やフィードバックが見える環境で安心して整いやすい傾向があります。"
    },
    {
      result_type_id: "F02_RESULT_08",
      name_jp: "境界を守る環境",
      name_cn: "边界守护型环境",
      primary_dimensions: ["role_boundary_need","team_distance_preference","psychological_safety_need"],
      public_summary_jp: "あなたは、役割や距離の境界が守られる環境で力を出しやすい傾向があります。"
    }
  ],
  questions: [
    {
      id: "F02_Q01",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "作業に集中したいとき、まわりの音はどのくらい影響しますか？",
      prompt_cn: "想集中工作时，周围声音对你影响多大？",
      primary_dimension: "sensory_environment_fit",
      secondary_dimension: "focus_environment_need",
      sensitivity_level: "low",
      public_private_note: "public-safe if aggregated; individual answer is private preference",
      risk_note: "must not imply medical sensory sensitivity",
      interpretation_boundary: "workplace preference only, not diagnosis",
      options: [
        { key: "A", label_jp: "音があってもあまり気にならない", label_cn: "有声音也不太在意", score_tags: ["sound_tolerant","open_space_fit"], weights: { sensory_environment_fit: -2, focus_environment_need: -1 } },
        { key: "B", label_jp: "少し気になるが、慣れれば大丈夫", label_cn: "有点在意，但习惯后可以", score_tags: ["moderate_sound_tolerance"], weights: { sensory_environment_fit: -1, focus_environment_need: 0 } },
        { key: "C", label_jp: "内容によって集中しやすさが変わる", label_cn: "会根据声音内容影响集中", score_tags: ["context_sensitive"], weights: { sensory_environment_fit: 1, focus_environment_need: 1 } },
        { key: "D", label_jp: "静かな場所のほうがかなり集中しやすい", label_cn: "安静场所明显更容易集中", score_tags: ["quiet_preference"], weights: { sensory_environment_fit: 2, focus_environment_need: 2 } },
        { key: "E", label_jp: "音が多い環境では消耗しやすい", label_cn: "声音多的环境容易消耗", score_tags: ["noise_drain","deep_focus_need"], weights: { sensory_environment_fit: 3, focus_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q02",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "机や席まわりの状態は、仕事の入りやすさにどのくらい関係しますか？",
      prompt_cn: "桌面和座位周围的状态，对你进入工作有多大影响？",
      primary_dimension: "focus_environment_need",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "low",
      public_private_note: "private preference, safe in summary",
      risk_note: "avoid judging neatness as personality",
      interpretation_boundary: "environment tendency only",
      options: [
        { key: "A", label_jp: "どんな場所でもすぐ始めやすい", label_cn: "基本什么地方都能开始", score_tags: ["portable_focus"], weights: { focus_environment_need: -2, recovery_environment_need: -1 } },
        { key: "B", label_jp: "最低限の場所があれば大丈夫", label_cn: "有基本空间就可以", score_tags: ["basic_space_ok"], weights: { focus_environment_need: -1, recovery_environment_need: 0 } },
        { key: "C", label_jp: "整っていると入りやすい", label_cn: "环境整齐会更容易进入", score_tags: ["space_support"], weights: { focus_environment_need: 1, recovery_environment_need: 1 } },
        { key: "D", label_jp: "机や席が乱れると集中しにくい", label_cn: "桌面座位混乱会影响集中", score_tags: ["organized_space_need"], weights: { focus_environment_need: 2, recovery_environment_need: 1 } },
        { key: "E", label_jp: "空間が合わないとかなり消耗する", label_cn: "空间不合适会很消耗", score_tags: ["space_drain"], weights: { focus_environment_need: 3, recovery_environment_need: 2 } }
      ]
    },
    {
      id: "F02_Q03",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "オープンスペースでの作業は、あなたにとってどんな感覚ですか？",
      prompt_cn: "在开放空间工作，对你来说是什么感觉？",
      primary_dimension: "sensory_environment_fit",
      secondary_dimension: "team_distance_preference",
      sensitivity_level: "low",
      public_private_note: "public-safe in aggregate",
      risk_note: "do not frame open office as objectively good/bad",
      interpretation_boundary: "preference only",
      options: [
        { key: "A", label_jp: "人の気配があるほうが動きやすい", label_cn: "有人在旁边反而更容易动起来", score_tags: ["open_space_fit","team_energy"], weights: { sensory_environment_fit: -2, team_distance_preference: 2 } },
        { key: "B", label_jp: "ほどよい活気なら合いやすい", label_cn: "适度活跃比较合适", score_tags: ["moderate_open_space"], weights: { sensory_environment_fit: -1, team_distance_preference: 1 } },
        { key: "C", label_jp: "作業内容によって変わる", label_cn: "根据工作内容变化", score_tags: ["task_dependent"], weights: { sensory_environment_fit: 0, team_distance_preference: 0 } },
        { key: "D", label_jp: "人の動きが多いと集中しにくい", label_cn: "人的移动多会难集中", score_tags: ["movement_sensitive"], weights: { sensory_environment_fit: 2, team_distance_preference: -1 } },
        { key: "E", label_jp: "見られている感じが続くと疲れやすい", label_cn: "持续被看见的感觉会疲惫", score_tags: ["visibility_drain","boundary_need"], weights: { sensory_environment_fit: 3, team_distance_preference: -2 } }
      ]
    },
    {
      id: "F02_Q04",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "深く考える作業をするとき、必要な環境はどれに近いですか？",
      prompt_cn: "做深度思考工作时，你需要的环境更接近哪种？",
      primary_dimension: "focus_environment_need",
      secondary_dimension: "remote_onsite_fit",
      sensitivity_level: "low",
      public_private_note: "private work preference",
      risk_note: "remote preference must not become career instruction",
      interpretation_boundary: "work condition reference only",
      options: [
        { key: "A", label_jp: "人と話しながら考えるほうが進む", label_cn: "边和人说边想更能推进", score_tags: ["collaborative_focus"], weights: { focus_environment_need: -2, remote_onsite_fit: -1 } },
        { key: "B", label_jp: "近くに人がいても集中できる", label_cn: "身边有人也能集中", score_tags: ["onsite_focus_ok"], weights: { focus_environment_need: -1, remote_onsite_fit: -1 } },
        { key: "C", label_jp: "短時間なら場所を選ばない", label_cn: "短时间内不太挑地点", score_tags: ["flexible_focus"], weights: { focus_environment_need: 0, remote_onsite_fit: 0 } },
        { key: "D", label_jp: "一人でまとまった時間がほしい", label_cn: "需要一个人连续时间", score_tags: ["deep_work_block"], weights: { focus_environment_need: 2, remote_onsite_fit: 1 } },
        { key: "E", label_jp: "静かな個室や在宅に近い環境がほしい", label_cn: "更需要安静单间或接近居家环境", score_tags: ["private_focus","remote_fit"], weights: { focus_environment_need: 3, remote_onsite_fit: 2 } }
      ]
    },
    {
      id: "F02_Q05",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "席の固定・自由席・在宅など、場所の変化についてどう感じますか？",
      prompt_cn: "对固定座位、自由座位、居家等地点变化，你怎么感受？",
      primary_dimension: "remote_onsite_fit",
      secondary_dimension: "rule_structure_need",
      sensitivity_level: "low",
      public_private_note: "private preference, safe as tendency",
      risk_note: "do not state user must work remote/onsite",
      interpretation_boundary: "environmental fit only",
      options: [
        { key: "A", label_jp: "場所が変わるほうが気分が切り替わる", label_cn: "地点变化更容易转换心情", score_tags: ["location_variety_fit"], weights: { remote_onsite_fit: -2, rule_structure_need: -1 } },
        { key: "B", label_jp: "ある程度変わっても問題ない", label_cn: "一定变化也没问题", score_tags: ["location_flexible"], weights: { remote_onsite_fit: -1, rule_structure_need: 0 } },
        { key: "C", label_jp: "固定と自由のバランスがよい", label_cn: "固定和自由平衡最好", score_tags: ["hybrid_location"], weights: { remote_onsite_fit: 0, rule_structure_need: 1 } },
        { key: "D", label_jp: "ある程度決まった場所のほうが落ち着く", label_cn: "相对固定的地点更安心", score_tags: ["stable_location"], weights: { remote_onsite_fit: 1, rule_structure_need: 2 } },
        { key: "E", label_jp: "場所が毎回変わると準備だけで疲れる", label_cn: "每次换地点会光准备就疲惫", score_tags: ["location_change_drain"], weights: { remote_onsite_fit: 2, rule_structure_need: 3 } }
      ]
    },
    {
      id: "F02_Q06",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "周囲から急に話しかけられる環境は、あなたにとってどうですか？",
      prompt_cn: "周围随时有人突然搭话的环境，对你来说如何？",
      primary_dimension: "communication_density",
      secondary_dimension: "focus_environment_need",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "do not judge sociability",
      interpretation_boundary: "work interruption preference only",
      options: [
        { key: "A", label_jp: "その場で話せるほうが進みやすい", label_cn: "当场能聊更容易推进", score_tags: ["high_touch_fit"], weights: { communication_density: 3, focus_environment_need: -2 } },
        { key: "B", label_jp: "短いやりとりなら歓迎できる", label_cn: "简短交流可以接受", score_tags: ["moderate_touch"], weights: { communication_density: 2, focus_environment_need: -1 } },
        { key: "C", label_jp: "内容とタイミングによる", label_cn: "看内容和时机", score_tags: ["timing_sensitive"], weights: { communication_density: 0, focus_environment_need: 0 } },
        { key: "D", label_jp: "集中時間には事前に知らせてほしい", label_cn: "集中时间希望提前告知", score_tags: ["protected_focus"], weights: { communication_density: -1, focus_environment_need: 2 } },
        { key: "E", label_jp: "急な声かけが続くとかなり消耗する", label_cn: "持续突然搭话会很消耗", score_tags: ["interruption_drain"], weights: { communication_density: -2, focus_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q07",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "画面共有・常時オンライン・ステータス表示など、見える状態が続く働き方はどう感じますか？",
      prompt_cn: "屏幕共享、持续在线、状态可见等持续被看见的工作方式，你怎么感受？",
      primary_dimension: "role_boundary_need",
      secondary_dimension: "psychological_safety_need",
      sensitivity_level: "medium",
      public_private_note: "may reveal monitoring discomfort; keep private",
      risk_note: "avoid legal or workplace rights advice",
      interpretation_boundary: "comfort tendency only",
      options: [
        { key: "A", label_jp: "見えるほうが安心して連携できる", label_cn: "可见反而更安心协作", score_tags: ["visibility_fit"], weights: { role_boundary_need: -2, psychological_safety_need: -1 } },
        { key: "B", label_jp: "必要な範囲なら問題ない", label_cn: "必要范围内没问题", score_tags: ["managed_visibility"], weights: { role_boundary_need: -1, psychological_safety_need: 0 } },
        { key: "C", label_jp: "目的が明確なら受け入れやすい", label_cn: "目的明确就容易接受", score_tags: ["purpose_based_visibility"], weights: { role_boundary_need: 0, psychological_safety_need: 1 } },
        { key: "D", label_jp: "ずっと見える状態は少し緊張する", label_cn: "持续可见会有点紧张", score_tags: ["visibility_tension"], weights: { role_boundary_need: 2, psychological_safety_need: 2 } },
        { key: "E", label_jp: "監視される感覚があると力を出しにくい", label_cn: "有被监视感会难以发挥", score_tags: ["monitoring_drain"], weights: { role_boundary_need: 3, psychological_safety_need: 3 } }
      ]
    },
    {
      id: "F02_Q08",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "集中するために、どのくらい自分で環境を調整したいですか？",
      prompt_cn: "为了集中，你有多想自己调整环境？",
      primary_dimension: "autonomy_need",
      secondary_dimension: "focus_environment_need",
      sensitivity_level: "low",
      public_private_note: "safe as preference",
      risk_note: "do not imply entitlement or workplace conflict",
      interpretation_boundary: "environmental adjustment preference",
      options: [
        { key: "A", label_jp: "会社やチームの標準に合わせやすい", label_cn: "容易配合公司或团队标准", score_tags: ["standard_fit"], weights: { autonomy_need: -2, focus_environment_need: -1 } },
        { key: "B", label_jp: "少し調整できれば十分", label_cn: "能稍微调整就够", score_tags: ["minor_adjustment"], weights: { autonomy_need: -1, focus_environment_need: 0 } },
        { key: "C", label_jp: "作業内容ごとに変えたい", label_cn: "想按工作内容调整", score_tags: ["task_based_adjustment"], weights: { autonomy_need: 1, focus_environment_need: 1 } },
        { key: "D", label_jp: "イヤホン・席・時間などを選びたい", label_cn: "想选择耳机、座位、时间等", score_tags: ["environment_control_need"], weights: { autonomy_need: 2, focus_environment_need: 2 } },
        { key: "E", label_jp: "調整できない環境では力を出しにくい", label_cn: "无法调整的环境很难发挥", score_tags: ["high_control_need"], weights: { autonomy_need: 3, focus_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q09",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "オンライン会議が続く日の疲れ方はどれに近いですか？",
      prompt_cn: "线上会议连续时，你的疲惫更接近哪种？",
      primary_dimension: "communication_density",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "low",
      public_private_note: "private energy pattern",
      risk_note: "do not make mental health claim",
      interpretation_boundary: "workload environment tendency only",
      options: [
        { key: "A", label_jp: "話すことでむしろリズムが出る", label_cn: "说话反而有节奏", score_tags: ["meeting_energy"], weights: { communication_density: 3, recovery_environment_need: -2 } },
        { key: "B", label_jp: "適度なら集中が続く", label_cn: "适度的话能维持集中", score_tags: ["meeting_moderate"], weights: { communication_density: 1, recovery_environment_need: -1 } },
        { key: "C", label_jp: "内容によって疲れ方が違う", label_cn: "根据内容疲惫不同", score_tags: ["meeting_contextual"], weights: { communication_density: 0, recovery_environment_need: 0 } },
        { key: "D", label_jp: "会議の間に休みがないと重くなる", label_cn: "会议之间没休息会变沉重", score_tags: ["meeting_recovery_need"], weights: { communication_density: -1, recovery_environment_need: 2 } },
        { key: "E", label_jp: "連続会議はかなり消耗しやすい", label_cn: "连续会议非常容易消耗", score_tags: ["meeting_drain"], weights: { communication_density: -2, recovery_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q10",
      section: "音・空間・集中環境",
      question_type: "single_select_5",
      prompt_jp: "一日の中で、集中しやすい場所を選べることはどのくらい大切ですか？",
      prompt_cn: "一天中可以选择容易集中的地点，对你有多重要？",
      primary_dimension: "remote_onsite_fit",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "public-safe as aggregate",
      risk_note: "avoid absolute remote/onsite recommendation",
      interpretation_boundary: "condition preference only",
      options: [
        { key: "A", label_jp: "場所よりチームの流れが大事", label_cn: "比地点更重视团队流动", score_tags: ["team_flow_priority"], weights: { remote_onsite_fit: -2, autonomy_need: -1 } },
        { key: "B", label_jp: "大きくは気にしない", label_cn: "不太在意", score_tags: ["place_flexible"], weights: { remote_onsite_fit: -1, autonomy_need: 0 } },
        { key: "C", label_jp: "選べる日があると助かる", label_cn: "有些日子可选择会有帮助", score_tags: ["hybrid_preference"], weights: { remote_onsite_fit: 1, autonomy_need: 1 } },
        { key: "D", label_jp: "作業ごとに場所を選びたい", label_cn: "想按任务选择地点", score_tags: ["task_place_fit"], weights: { remote_onsite_fit: 2, autonomy_need: 2 } },
        { key: "E", label_jp: "場所の裁量がないと継続しにくい", label_cn: "没有地点裁量会难以持续", score_tags: ["place_autonomy_need"], weights: { remote_onsite_fit: 3, autonomy_need: 3 } }
      ]
    },
    {
      id: "F02_Q11",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "チームメンバーとの距離感は、どれくらい近いほうが働きやすいですか？",
      prompt_cn: "与团队成员的距离感，哪种更让你工作顺畅？",
      primary_dimension: "team_distance_preference",
      secondary_dimension: "communication_density",
      sensitivity_level: "low",
      public_private_note: "private work preference",
      risk_note: "do not judge introversion/extroversion",
      interpretation_boundary: "team environment preference only",
      options: [
        { key: "A", label_jp: "近くで一緒に動くほうが力が出る", label_cn: "近距离一起动更能发挥", score_tags: ["close_team_fit"], weights: { team_distance_preference: 3, communication_density: 2 } },
        { key: "B", label_jp: "ほどよく声をかけ合える距離がよい", label_cn: "能适度互相招呼的距离好", score_tags: ["moderate_team_closeness"], weights: { team_distance_preference: 2, communication_density: 1 } },
        { key: "C", label_jp: "近すぎず遠すぎずがよい", label_cn: "不太近不太远最好", score_tags: ["balanced_distance"], weights: { team_distance_preference: 0, communication_density: 0 } },
        { key: "D", label_jp: "必要なときだけ関わるほうが集中しやすい", label_cn: "需要时再互动更容易集中", score_tags: ["independent_team"], weights: { team_distance_preference: -2, communication_density: -1 } },
        { key: "E", label_jp: "距離が近すぎる環境は消耗しやすい", label_cn: "距离太近的环境容易消耗", score_tags: ["close_team_drain"], weights: { team_distance_preference: -3, communication_density: -2 } }
      ]
    },
    {
      id: "F02_Q12",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "チャットや通知の多さは、あなたの働きやすさにどう影響しますか？",
      prompt_cn: "聊天和通知的多少，会怎样影响你的工作感受？",
      primary_dimension: "communication_density",
      secondary_dimension: "focus_environment_need",
      sensitivity_level: "low",
      public_private_note: "private work condition",
      risk_note: "avoid digital health claims",
      interpretation_boundary: "communication load preference only",
      options: [
        { key: "A", label_jp: "多いほうが状況をつかみやすい", label_cn: "多一点更容易掌握情况", score_tags: ["high_chat_fit"], weights: { communication_density: 3, focus_environment_need: -2 } },
        { key: "B", label_jp: "ある程度多くても対応できる", label_cn: "一定程度多也能应对", score_tags: ["chat_tolerant"], weights: { communication_density: 2, focus_environment_need: -1 } },
        { key: "C", label_jp: "量より整理されているかが大事", label_cn: "比数量更重视是否整理清楚", score_tags: ["structured_chat_need"], weights: { communication_density: 0, focus_environment_need: 1 } },
        { key: "D", label_jp: "多いと作業に戻るのが大変", label_cn: "太多会很难回到工作", score_tags: ["chat_interruption"], weights: { communication_density: -1, focus_environment_need: 2 } },
        { key: "E", label_jp: "通知が多い環境ではかなり疲れる", label_cn: "通知很多的环境会很疲惫", score_tags: ["chat_drain"], weights: { communication_density: -2, focus_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q13",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "仕事の相談は、どのような形が合いやすいですか？",
      prompt_cn: "工作咨询或讨论，哪种形式更适合你？",
      primary_dimension: "communication_density",
      secondary_dimension: "psychological_safety_need",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "avoid judging help-seeking ability",
      interpretation_boundary: "consultation style only",
      options: [
        { key: "A", label_jp: "すぐ口頭で相談できるのがよい", label_cn: "能马上口头咨询最好", score_tags: ["instant_verbal_support"], weights: { communication_density: 3, psychological_safety_need: 1 } },
        { key: "B", label_jp: "短く声をかけて確認したい", label_cn: "想简短开口确认", score_tags: ["quick_check"], weights: { communication_density: 2, psychological_safety_need: 1 } },
        { key: "C", label_jp: "内容によって口頭と文章を使い分けたい", label_cn: "想按内容区分口头和文字", score_tags: ["mixed_consult"], weights: { communication_density: 0, psychological_safety_need: 1 } },
        { key: "D", label_jp: "一度整理してから文章で相談したい", label_cn: "想先整理再用文字咨询", score_tags: ["written_consult"], weights: { communication_density: -1, psychological_safety_need: 2 } },
        { key: "E", label_jp: "相談前に考える時間がないと不安になる", label_cn: "咨询前没有思考时间会不安", score_tags: ["prepared_support_need"], weights: { communication_density: -2, psychological_safety_need: 3 } }
      ]
    },
    {
      id: "F02_Q14",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "チーム内で意見が分かれたとき、どんな環境だと動きやすいですか？",
      prompt_cn: "团队意见不一致时，怎样的环境更容易让你行动？",
      primary_dimension: "conflict_noise_sensitivity",
      secondary_dimension: "psychological_safety_need",
      sensitivity_level: "medium",
      public_private_note: "conflict response is private",
      risk_note: "do not provide conflict mediation advice",
      interpretation_boundary: "environment tendency only",
      options: [
        { key: "A", label_jp: "率直に議論できる場があると動きやすい", label_cn: "有直接讨论的场合更容易行动", score_tags: ["open_debate_fit"], weights: { conflict_noise_sensitivity: -2, psychological_safety_need: 0 } },
        { key: "B", label_jp: "多少の議論は前向きに受け取れる", label_cn: "一定争论能积极接受", score_tags: ["debate_tolerant"], weights: { conflict_noise_sensitivity: -1, psychological_safety_need: 1 } },
        { key: "C", label_jp: "進め方が決まっていれば大丈夫", label_cn: "如果流程明确就可以", score_tags: ["structured_conflict"], weights: { conflict_noise_sensitivity: 1, psychological_safety_need: 1 } },
        { key: "D", label_jp: "感情的な空気が強いと動きにくい", label_cn: "情绪强时会难以行动", score_tags: ["emotional_noise_sensitive"], weights: { conflict_noise_sensitivity: 2, psychological_safety_need: 2 } },
        { key: "E", label_jp: "対立が多い環境ではかなり消耗する", label_cn: "冲突多的环境很消耗", score_tags: ["conflict_drain"], weights: { conflict_noise_sensitivity: 3, psychological_safety_need: 3 } }
      ]
    },
    {
      id: "F02_Q15",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "雑談や非公式な会話は、働きやすさにどのくらい関係しますか？",
      prompt_cn: "闲聊或非正式对话，对你的工作舒适度有多大关系？",
      primary_dimension: "team_distance_preference",
      secondary_dimension: "communication_density",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "avoid cultural or personality judgment",
      interpretation_boundary: "workplace connection preference only",
      options: [
        { key: "A", label_jp: "雑談があるほうがチームに入りやすい", label_cn: "有闲聊更容易进入团队", score_tags: ["smalltalk_fit"], weights: { team_distance_preference: 3, communication_density: 2 } },
        { key: "B", label_jp: "少しあると安心する", label_cn: "有一点会安心", score_tags: ["light_smalltalk"], weights: { team_distance_preference: 2, communication_density: 1 } },
        { key: "C", label_jp: "あってもなくても大きく変わらない", label_cn: "有没有都差不多", score_tags: ["smalltalk_neutral"], weights: { team_distance_preference: 0, communication_density: 0 } },
        { key: "D", label_jp: "多すぎると切り替えにくい", label_cn: "太多会难切换", score_tags: ["smalltalk_limit"], weights: { team_distance_preference: -1, communication_density: -1 } },
        { key: "E", label_jp: "非公式な空気が濃いと疲れやすい", label_cn: "非正式氛围太浓会疲惫", score_tags: ["informal_drain"], weights: { team_distance_preference: -2, communication_density: -2 } }
      ]
    },
    {
      id: "F02_Q16",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "チームの情報共有は、どのくらい細かいほうが安心しますか？",
      prompt_cn: "团队信息共享多细，你会更安心？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "communication_density",
      sensitivity_level: "low",
      public_private_note: "safe as preference",
      risk_note: "do not imply mistrust",
      interpretation_boundary: "information clarity preference",
      options: [
        { key: "A", label_jp: "大枠だけわかれば自分で進められる", label_cn: "知道大方向就能自己推进", score_tags: ["low_detail_ok"], weights: { feedback_clarity_need: -2, communication_density: -1 } },
        { key: "B", label_jp: "必要な点だけ共有されればよい", label_cn: "只共享必要点就好", score_tags: ["essential_info"], weights: { feedback_clarity_need: -1, communication_density: -1 } },
        { key: "C", label_jp: "重要な背景は知っておきたい", label_cn: "想知道重要背景", score_tags: ["context_need"], weights: { feedback_clarity_need: 1, communication_density: 0 } },
        { key: "D", label_jp: "判断理由まで共有されると安心する", label_cn: "连判断理由也共享会安心", score_tags: ["reason_clarity"], weights: { feedback_clarity_need: 2, communication_density: 1 } },
        { key: "E", label_jp: "情報が見えない環境では不安が強くなる", label_cn: "信息不可见会强烈不安", score_tags: ["info_gap_anxiety"], weights: { feedback_clarity_need: 3, communication_density: 2 } }
      ]
    },
    {
      id: "F02_Q17",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "一人で進める時間と、チームで合わせる時間の比率はどれが合いそうですか？",
      prompt_cn: "独自推进时间和团队同步时间的比例，哪种更适合你？",
      primary_dimension: "team_distance_preference",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "private work preference",
      risk_note: "do not imply performance ability",
      interpretation_boundary: "collaboration rhythm only",
      options: [
        { key: "A", label_jp: "チームで合わせる時間が多いほうがよい", label_cn: "团队同步时间多更好", score_tags: ["team_heavy_fit"], weights: { team_distance_preference: 3, autonomy_need: -2 } },
        { key: "B", label_jp: "チーム時間がやや多いほうが安心", label_cn: "团队时间稍多会安心", score_tags: ["team_supported"], weights: { team_distance_preference: 2, autonomy_need: -1 } },
        { key: "C", label_jp: "半分ずつくらいがよい", label_cn: "大约各一半最好", score_tags: ["balanced_work_ratio"], weights: { team_distance_preference: 0, autonomy_need: 0 } },
        { key: "D", label_jp: "一人で進める時間が多いほうがよい", label_cn: "独自推进时间多更好", score_tags: ["independent_work_fit"], weights: { team_distance_preference: -2, autonomy_need: 2 } },
        { key: "E", label_jp: "自分で進める時間がないと力を出しにくい", label_cn: "没有独自推进时间会难发挥", score_tags: ["solo_time_need"], weights: { team_distance_preference: -3, autonomy_need: 3 } }
      ]
    },
    {
      id: "F02_Q18",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "仕事上の人間関係は、どのくらい私的な距離まで近いほうが合いますか？",
      prompt_cn: "工作中的人际关系，接近到多私人的距离更适合你？",
      primary_dimension: "role_boundary_need",
      secondary_dimension: "team_distance_preference",
      sensitivity_level: "medium",
      public_private_note: "private boundary preference",
      risk_note: "do not judge personal openness",
      interpretation_boundary: "professional boundary preference only",
      options: [
        { key: "A", label_jp: "私的な話もあるほうが働きやすい", label_cn: "有私人话题更容易工作", score_tags: ["personal_closeness_fit"], weights: { role_boundary_need: -3, team_distance_preference: 3 } },
        { key: "B", label_jp: "少し近い関係だと安心する", label_cn: "稍微亲近会安心", score_tags: ["warm_team_fit"], weights: { role_boundary_need: -2, team_distance_preference: 2 } },
        { key: "C", label_jp: "相手や場面による", label_cn: "取决于对象和场景", score_tags: ["boundary_contextual"], weights: { role_boundary_need: 0, team_distance_preference: 0 } },
        { key: "D", label_jp: "仕事と私生活はある程度分けたい", label_cn: "工作和私生活想适度分开", score_tags: ["professional_boundary"], weights: { role_boundary_need: 2, team_distance_preference: -1 } },
        { key: "E", label_jp: "近すぎる関係性は消耗しやすい", label_cn: "过近关系容易消耗", score_tags: ["boundary_protection_need"], weights: { role_boundary_need: 3, team_distance_preference: -2 } }
      ]
    },
    {
      id: "F02_Q19",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "上司やリーダーとの関わり方は、どれが合いやすいですか？",
      prompt_cn: "与上司或领导的互动方式，哪种更适合你？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "medium",
      public_private_note: "may reveal management preference; keep private",
      risk_note: "avoid workplace advice or judging manager",
      interpretation_boundary: "support style preference",
      options: [
        { key: "A", label_jp: "こまめに見てもらえると進みやすい", label_cn: "经常被看见和确认更容易推进", score_tags: ["close_manager_support"], weights: { feedback_clarity_need: 3, autonomy_need: -2 } },
        { key: "B", label_jp: "定期的に確認があると安心", label_cn: "定期确认会安心", score_tags: ["regular_checkin"], weights: { feedback_clarity_need: 2, autonomy_need: -1 } },
        { key: "C", label_jp: "節目ごとに相談できればよい", label_cn: "关键节点能咨询就好", score_tags: ["milestone_support"], weights: { feedback_clarity_need: 1, autonomy_need: 1 } },
        { key: "D", label_jp: "基本は任せてもらいたい", label_cn: "基本希望被信任放手", score_tags: ["trusted_autonomy"], weights: { feedback_clarity_need: -1, autonomy_need: 2 } },
        { key: "E", label_jp: "細かく見られると力を出しにくい", label_cn: "被细看会难发挥", score_tags: ["micromanagement_drain"], weights: { feedback_clarity_need: -2, autonomy_need: 3 } }
      ]
    },
    {
      id: "F02_Q20",
      section: "チーム距離とコミュニケーション",
      question_type: "single_select_5",
      prompt_jp: "チームの空気が忙しそうなとき、あなたはどうなりやすいですか？",
      prompt_cn: "团队氛围看起来很忙时，你容易变成怎样？",
      primary_dimension: "conflict_noise_sensitivity",
      secondary_dimension: "workload_rhythm_fit",
      sensitivity_level: "medium",
      public_private_note: "private stress response preference",
      risk_note: "avoid stress diagnosis",
      interpretation_boundary: "environment signal only",
      options: [
        { key: "A", label_jp: "その勢いに乗って動ける", label_cn: "能跟着势头动起来", score_tags: ["busy_energy_fit"], weights: { conflict_noise_sensitivity: -2, workload_rhythm_fit: 2 } },
        { key: "B", label_jp: "ある程度なら集中できる", label_cn: "一定程度可以集中", score_tags: ["busy_tolerant"], weights: { conflict_noise_sensitivity: -1, workload_rhythm_fit: 1 } },
        { key: "C", label_jp: "自分の役割が見えれば動ける", label_cn: "只要看清自己角色就能动", score_tags: ["role_clarity_in_busy"], weights: { conflict_noise_sensitivity: 1, workload_rhythm_fit: 0 } },
        { key: "D", label_jp: "空気に引っぱられて焦りやすい", label_cn: "容易被氛围带着焦虑", score_tags: ["busy_air_sensitive"], weights: { conflict_noise_sensitivity: 2, workload_rhythm_fit: -1 } },
        { key: "E", label_jp: "忙しさの圧が強いと消耗しやすい", label_cn: "忙碌压力强会容易消耗", score_tags: ["busy_pressure_drain"], weights: { conflict_noise_sensitivity: 3, workload_rhythm_fit: -2 } }
      ]
    },
    {
      id: "F02_Q21",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "仕事の進め方は、どのくらい自分で決めたいですか？",
      prompt_cn: "工作推进方式，你有多想自己决定？",
      primary_dimension: "autonomy_need",
      secondary_dimension: "rule_structure_need",
      sensitivity_level: "low",
      public_private_note: "private work preference",
      risk_note: "do not equate autonomy with ability",
      interpretation_boundary: "preference only",
      options: [
        { key: "A", label_jp: "決まった進め方があるほうが安心", label_cn: "有固定推进方式更安心", score_tags: ["structured_process_fit"], weights: { autonomy_need: -3, rule_structure_need: 3 } },
        { key: "B", label_jp: "大枠は決まっているほうがよい", label_cn: "大框架固定更好", score_tags: ["guided_process"], weights: { autonomy_need: -1, rule_structure_need: 2 } },
        { key: "C", label_jp: "大枠と自由のバランスがよい", label_cn: "框架和自由平衡最好", score_tags: ["balanced_autonomy"], weights: { autonomy_need: 0, rule_structure_need: 1 } },
        { key: "D", label_jp: "方法はかなり任せてほしい", label_cn: "希望方法上较多被放手", score_tags: ["method_autonomy"], weights: { autonomy_need: 2, rule_structure_need: -1 } },
        { key: "E", label_jp: "自分で設計できる環境で力が出る", label_cn: "能自己设计环境时更能发挥", score_tags: ["high_autonomy_fit"], weights: { autonomy_need: 3, rule_structure_need: -2 } }
      ]
    },
    {
      id: "F02_Q22",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "ルールや手順が細かい環境について、どう感じますか？",
      prompt_cn: "对规则和流程很细的环境，你怎么感受？",
      primary_dimension: "rule_structure_need",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "safe as preference",
      risk_note: "do not judge compliance",
      interpretation_boundary: "structure preference only",
      options: [
        { key: "A", label_jp: "細かいほうが安心して動ける", label_cn: "细一点更安心行动", score_tags: ["detailed_rule_fit"], weights: { rule_structure_need: 3, autonomy_need: -2 } },
        { key: "B", label_jp: "手順があると助かる", label_cn: "有流程会有帮助", score_tags: ["procedure_support"], weights: { rule_structure_need: 2, autonomy_need: -1 } },
        { key: "C", label_jp: "必要な部分だけ明確ならよい", label_cn: "只要必要部分明确就好", score_tags: ["essential_rules"], weights: { rule_structure_need: 1, autonomy_need: 0 } },
        { key: "D", label_jp: "細かすぎると動きにくい", label_cn: "太细会难行动", score_tags: ["rule_friction"], weights: { rule_structure_need: -1, autonomy_need: 2 } },
        { key: "E", label_jp: "裁量が少ない環境ではかなり窮屈", label_cn: "裁量少的环境会很压抑", score_tags: ["low_autonomy_drain"], weights: { rule_structure_need: -2, autonomy_need: 3 } }
      ]
    },
    {
      id: "F02_Q23",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "意思決定のスピードは、どれくらいが合いやすいですか？",
      prompt_cn: "决策速度多快更适合你？",
      primary_dimension: "decision_speed_fit",
      secondary_dimension: "change_tolerance",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "do not judge decisiveness",
      interpretation_boundary: "decision environment fit only",
      options: [
        { key: "A", label_jp: "速く決めて動く環境が合う", label_cn: "快速决定并行动的环境适合", score_tags: ["fast_decision_fit"], weights: { decision_speed_fit: 3, change_tolerance: 2 } },
        { key: "B", label_jp: "ある程度スピードがあるほうがよい", label_cn: "有一定速度更好", score_tags: ["moderate_fast_decision"], weights: { decision_speed_fit: 2, change_tolerance: 1 } },
        { key: "C", label_jp: "内容によって速度を変えたい", label_cn: "想根据内容调整速度", score_tags: ["adaptive_decision"], weights: { decision_speed_fit: 0, change_tolerance: 0 } },
        { key: "D", label_jp: "考える時間があるほうが安心", label_cn: "有思考时间更安心", score_tags: ["deliberate_decision"], weights: { decision_speed_fit: -2, change_tolerance: -1 } },
        { key: "E", label_jp: "速すぎる決定が続くと消耗する", label_cn: "过快决策持续会消耗", score_tags: ["fast_decision_drain"], weights: { decision_speed_fit: -3, change_tolerance: -2 } }
      ]
    },
    {
      id: "F02_Q24",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "役割や担当範囲は、どのくらい明確なほうが働きやすいですか？",
      prompt_cn: "角色和负责范围多明确时，你更容易工作？",
      primary_dimension: "role_boundary_need",
      secondary_dimension: "rule_structure_need",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "do not imply refusal to collaborate",
      interpretation_boundary: "role clarity preference only",
      options: [
        { key: "A", label_jp: "あいまいでも柔軟に動ける", label_cn: "模糊也能灵活行动", score_tags: ["fluid_role_fit"], weights: { role_boundary_need: -3, rule_structure_need: -2 } },
        { key: "B", label_jp: "多少あいまいでも問題ない", label_cn: "稍微模糊也没问题", score_tags: ["role_flexible"], weights: { role_boundary_need: -1, rule_structure_need: -1 } },
        { key: "C", label_jp: "基本の担当が見えていればよい", label_cn: "能看见基本负责范围即可", score_tags: ["basic_role_clarity"], weights: { role_boundary_need: 1, rule_structure_need: 1 } },
        { key: "D", label_jp: "範囲が明確なほうが安心", label_cn: "范围明确更安心", score_tags: ["clear_role_need"], weights: { role_boundary_need: 2, rule_structure_need: 2 } },
        { key: "E", label_jp: "境界があいまいだと抱え込みやすい", label_cn: "边界模糊时容易背太多", score_tags: ["boundary_overload"], weights: { role_boundary_need: 3, rule_structure_need: 3 } }
      ]
    },
    {
      id: "F02_Q25",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "新しい提案や改善案を出す環境について、どれが近いですか？",
      prompt_cn: "对提出新建议或改善案的环境，你更接近哪种？",
      primary_dimension: "growth_environment_need",
      secondary_dimension: "psychological_safety_need",
      sensitivity_level: "medium",
      public_private_note: "private expression preference",
      risk_note: "avoid judging initiative",
      interpretation_boundary: "proposal environment preference",
      options: [
        { key: "A", label_jp: "自由に提案できる環境で伸びやすい", label_cn: "能自由提案的环境更容易成长", score_tags: ["proposal_autonomy_fit"], weights: { growth_environment_need: 3, psychological_safety_need: 1 } },
        { key: "B", label_jp: "受け止めてもらえるなら出しやすい", label_cn: "如果能被接住就容易提出", score_tags: ["proposal_safety"], weights: { growth_environment_need: 2, psychological_safety_need: 2 } },
        { key: "C", label_jp: "場やタイミングがあれば出せる", label_cn: "有场合和时机就能提出", score_tags: ["proposal_timing"], weights: { growth_environment_need: 1, psychological_safety_need: 1 } },
        { key: "D", label_jp: "根拠を整えてから出したい", label_cn: "想整理依据后再提出", score_tags: ["prepared_proposal"], weights: { growth_environment_need: 0, psychological_safety_need: 2 } },
        { key: "E", label_jp: "否定されやすい空気では出しにくい", label_cn: "容易被否定的氛围下很难提出", score_tags: ["proposal_safety_need"], weights: { growth_environment_need: 1, psychological_safety_need: 3 } }
      ]
    },
    {
      id: "F02_Q26",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "判断に迷ったとき、どんな支えがあると動きやすいですか？",
      prompt_cn: "判断迷茫时，有什么支持会更容易行动？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "decision_speed_fit",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "do not imply dependence",
      interpretation_boundary: "decision support style only",
      options: [
        { key: "A", label_jp: "自分で決められる余地がほしい", label_cn: "希望有自己决定的余地", score_tags: ["self_decision_space"], weights: { feedback_clarity_need: -2, decision_speed_fit: 2 } },
        { key: "B", label_jp: "大枠だけ確認できれば進める", label_cn: "只需确认大框架就能推进", score_tags: ["light_decision_support"], weights: { feedback_clarity_need: -1, decision_speed_fit: 1 } },
        { key: "C", label_jp: "選択肢を一緒に整理したい", label_cn: "想一起整理选项", score_tags: ["decision_sorting"], weights: { feedback_clarity_need: 1, decision_speed_fit: 0 } },
        { key: "D", label_jp: "判断基準を明確にしてほしい", label_cn: "希望判断标准明确", score_tags: ["criteria_need"], weights: { feedback_clarity_need: 2, decision_speed_fit: -1 } },
        { key: "E", label_jp: "基準がないまま決めるのはかなり不安", label_cn: "没有标准就决定会很不安", score_tags: ["criteria_gap_drain"], weights: { feedback_clarity_need: 3, decision_speed_fit: -2 } }
      ]
    },
    {
      id: "F02_Q27",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "「まずやってみる」文化は、あなたにとってどうですか？",
      prompt_cn: "“先试试看”的文化，对你来说如何？",
      primary_dimension: "change_tolerance",
      secondary_dimension: "decision_speed_fit",
      sensitivity_level: "low",
      public_private_note: "safe as preference",
      risk_note: "do not judge courage",
      interpretation_boundary: "experimentation fit only",
      options: [
        { key: "A", label_jp: "試しながら進むほうが合う", label_cn: "边试边推进更适合", score_tags: ["experiment_fit"], weights: { change_tolerance: 3, decision_speed_fit: 3 } },
        { key: "B", label_jp: "小さく試すなら合いやすい", label_cn: "小规模试的话适合", score_tags: ["small_experiment"], weights: { change_tolerance: 2, decision_speed_fit: 1 } },
        { key: "C", label_jp: "リスクが見えていれば試せる", label_cn: "看见风险就能试", score_tags: ["bounded_experiment"], weights: { change_tolerance: 1, decision_speed_fit: 0 } },
        { key: "D", label_jp: "事前整理がないと不安になる", label_cn: "事前不整理会不安", score_tags: ["preparation_need"], weights: { change_tolerance: -1, decision_speed_fit: -2 } },
        { key: "E", label_jp: "試行錯誤が多すぎる環境は消耗する", label_cn: "试错过多的环境会消耗", score_tags: ["experiment_drain"], weights: { change_tolerance: -3, decision_speed_fit: -3 } }
      ]
    },
    {
      id: "F02_Q28",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "マニュアルやテンプレートは、あなたにとってどんな存在ですか？",
      prompt_cn: "手册和模板，对你来说是什么样的存在？",
      primary_dimension: "rule_structure_need",
      secondary_dimension: "growth_environment_need",
      sensitivity_level: "low",
      public_private_note: "safe",
      risk_note: "avoid ability judgment",
      interpretation_boundary: "support tool preference",
      options: [
        { key: "A", label_jp: "自由に作るほうがやりやすい", label_cn: "自由创建更好做", score_tags: ["low_template_need"], weights: { rule_structure_need: -3, growth_environment_need: 2 } },
        { key: "B", label_jp: "参考程度にあるとよい", label_cn: "有参考程度就好", score_tags: ["template_reference"], weights: { rule_structure_need: -1, growth_environment_need: 1 } },
        { key: "C", label_jp: "基本形があると助かる", label_cn: "有基本形式会有帮助", score_tags: ["basic_template"], weights: { rule_structure_need: 1, growth_environment_need: 0 } },
        { key: "D", label_jp: "手順があると安心して進める", label_cn: "有步骤会安心推进", score_tags: ["manual_support"], weights: { rule_structure_need: 2, growth_environment_need: -1 } },
        { key: "E", label_jp: "何も型がない環境では迷いやすい", label_cn: "完全没框架的环境容易迷茫", score_tags: ["structure_gap_drain"], weights: { rule_structure_need: 3, growth_environment_need: -2 } }
      ]
    },
    {
      id: "F02_Q29",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "予定や優先順位が変わるとき、どんな伝え方だと受け取りやすいですか？",
      prompt_cn: "日程或优先级变化时，怎样传达你更容易接受？",
      primary_dimension: "change_tolerance",
      secondary_dimension: "feedback_clarity_need",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "do not imply rigidity",
      interpretation_boundary: "change communication preference",
      options: [
        { key: "A", label_jp: "すぐ変えて動ければよい", label_cn: "能马上改变行动就好", score_tags: ["rapid_change_fit"], weights: { change_tolerance: 3, feedback_clarity_need: -1 } },
        { key: "B", label_jp: "変更点がわかれば対応できる", label_cn: "知道变化点就能应对", score_tags: ["change_point_ok"], weights: { change_tolerance: 2, feedback_clarity_need: 0 } },
        { key: "C", label_jp: "理由も少し知りたい", label_cn: "也想稍微知道理由", score_tags: ["change_reason_need"], weights: { change_tolerance: 0, feedback_clarity_need: 1 } },
        { key: "D", label_jp: "影響範囲まで共有されると安心", label_cn: "连影响范围也共享会安心", score_tags: ["change_impact_clarity"], weights: { change_tolerance: -1, feedback_clarity_need: 2 } },
        { key: "E", label_jp: "理由なく急に変わるとかなり疲れる", label_cn: "没理由突然变化会很累", score_tags: ["sudden_change_drain"], weights: { change_tolerance: -3, feedback_clarity_need: 3 } }
      ]
    },
    {
      id: "F02_Q30",
      section: "裁量・ルール・意思決定",
      question_type: "single_select_5",
      prompt_jp: "自分の担当外のことを頼まれる環境について、どう感じますか？",
      prompt_cn: "被请求做负责范围外的事情，你怎么感受？",
      primary_dimension: "role_boundary_need",
      secondary_dimension: "workload_rhythm_fit",
      sensitivity_level: "medium",
      public_private_note: "private boundary and load preference",
      risk_note: "do not provide refusal advice",
      interpretation_boundary: "role boundary tendency only",
      options: [
        { key: "A", label_jp: "必要なら柔軟に動きたい", label_cn: "必要时想灵活行动", score_tags: ["role_flex_fit"], weights: { role_boundary_need: -3, workload_rhythm_fit: 1 } },
        { key: "B", label_jp: "たまになら問題ない", label_cn: "偶尔的话没问题", score_tags: ["role_flex_moderate"], weights: { role_boundary_need: -1, workload_rhythm_fit: 0 } },
        { key: "C", label_jp: "優先順位が見えれば対応できる", label_cn: "看见优先级就能应对", score_tags: ["boundary_with_priority"], weights: { role_boundary_need: 1, workload_rhythm_fit: 1 } },
        { key: "D", label_jp: "担当範囲を確認してから受けたい", label_cn: "想确认负责范围后再接", score_tags: ["role_check_need"], weights: { role_boundary_need: 2, workload_rhythm_fit: -1 } },
        { key: "E", label_jp: "境界なく頼まれる環境では抱え込みやすい", label_cn: "没边界地被请求会容易背太多", score_tags: ["role_overload_drain"], weights: { role_boundary_need: 3, workload_rhythm_fit: -2 } }
      ]
    },
    {
      id: "F02_Q31",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "自分の仕事へのフィードバックは、どのくらい欲しいですか？",
      prompt_cn: "对自己的工作，你希望得到多少反馈？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "growth_environment_need",
      sensitivity_level: "low",
      public_private_note: "private growth preference",
      risk_note: "avoid evaluating competence",
      interpretation_boundary: "feedback environment preference only",
      options: [
        { key: "A", label_jp: "必要なときだけで十分", label_cn: "只在必要时就足够", score_tags: ["low_feedback_need"], weights: { feedback_clarity_need: -3, growth_environment_need: -1 } },
        { key: "B", label_jp: "節目で少しもらえればよい", label_cn: "关键节点稍微有就好", score_tags: ["milestone_feedback"], weights: { feedback_clarity_need: -1, growth_environment_need: 0 } },
        { key: "C", label_jp: "よかった点と改善点を知りたい", label_cn: "想知道优点和改善点", score_tags: ["balanced_feedback"], weights: { feedback_clarity_need: 1, growth_environment_need: 1 } },
        { key: "D", label_jp: "こまめに方向確認があると伸びやすい", label_cn: "经常确认方向更容易成长", score_tags: ["frequent_feedback"], weights: { feedback_clarity_need: 2, growth_environment_need: 2 } },
        { key: "E", label_jp: "反応が少ない環境では不安になりやすい", label_cn: "反馈少的环境容易不安", score_tags: ["feedback_gap_drain"], weights: { feedback_clarity_need: 3, growth_environment_need: 2 } }
      ]
    },
    {
      id: "F02_Q32",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "評価基準は、どのくらい明確なほうが働きやすいですか？",
      prompt_cn: "评价标准多明确时，你更容易工作？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "psychological_safety_need",
      sensitivity_level: "medium",
      public_private_note: "private evaluation preference",
      risk_note: "avoid workplace legal advice",
      interpretation_boundary: "evaluation clarity preference",
      options: [
        { key: "A", label_jp: "大きな方向だけで動ける", label_cn: "有大方向就能动", score_tags: ["broad_evaluation_ok"], weights: { feedback_clarity_need: -2, psychological_safety_need: -1 } },
        { key: "B", label_jp: "重要な点がわかればよい", label_cn: "知道重点即可", score_tags: ["key_criteria"], weights: { feedback_clarity_need: -1, psychological_safety_need: 0 } },
        { key: "C", label_jp: "基準がある程度見えているとよい", label_cn: "标准一定程度可见更好", score_tags: ["moderate_criteria"], weights: { feedback_clarity_need: 1, psychological_safety_need: 1 } },
        { key: "D", label_jp: "何を見られるか明確だと安心", label_cn: "明确知道被看什么会安心", score_tags: ["clear_evaluation_need"], weights: { feedback_clarity_need: 2, psychological_safety_need: 2 } },
        { key: "E", label_jp: "基準があいまいだと力を出しにくい", label_cn: "标准模糊会难以发挥", score_tags: ["ambiguous_evaluation_drain"], weights: { feedback_clarity_need: 3, psychological_safety_need: 3 } }
      ]
    },
    {
      id: "F02_Q33",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "ミスや遅れが出たとき、どんな空気だと立て直しやすいですか？",
      prompt_cn: "出现失误或延迟时，怎样的氛围更容易恢复？",
      primary_dimension: "psychological_safety_need",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "medium",
      public_private_note: "private safety preference",
      risk_note: "avoid legal/HR advice",
      interpretation_boundary: "psychological safety preference, not clinical",
      options: [
        { key: "A", label_jp: "すぐ原因と対策に進める空気", label_cn: "马上进入原因和对策的氛围", score_tags: ["solution_fast_fit"], weights: { psychological_safety_need: -1, recovery_environment_need: -1 } },
        { key: "B", label_jp: "落ち着いて確認できれば大丈夫", label_cn: "能冷静确认就可以", score_tags: ["calm_check"], weights: { psychological_safety_need: 1, recovery_environment_need: 0 } },
        { key: "C", label_jp: "責めずに状況整理できる空気", label_cn: "不责备地整理情况的氛围", score_tags: ["non_blame_structure"], weights: { psychological_safety_need: 2, recovery_environment_need: 1 } },
        { key: "D", label_jp: "次にどうするか一緒に見てもらえる空気", label_cn: "能一起看下一步的氛围", score_tags: ["repair_support"], weights: { psychological_safety_need: 3, recovery_environment_need: 2 } },
        { key: "E", label_jp: "強い責めがある環境ではかなり消耗する", label_cn: "强烈责备的环境会很消耗", score_tags: ["blame_drain"], weights: { psychological_safety_need: 3, recovery_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q34",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "褒められる・認められることは、働きやすさにどのくらい関係しますか？",
      prompt_cn: "被肯定或认可，对你的工作舒适度有多大关系？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "growth_environment_need",
      sensitivity_level: "low",
      public_private_note: "private motivation preference",
      risk_note: "avoid validation dependency framing",
      interpretation_boundary: "recognition preference only",
      options: [
        { key: "A", label_jp: "なくても自分で判断しやすい", label_cn: "即使没有也能自己判断", score_tags: ["self_validation"], weights: { feedback_clarity_need: -3, growth_environment_need: -1 } },
        { key: "B", label_jp: "たまにあると十分", label_cn: "偶尔有就足够", score_tags: ["low_recognition_need"], weights: { feedback_clarity_need: -1, growth_environment_need: 0 } },
        { key: "C", label_jp: "何がよかったか知れると助かる", label_cn: "能知道哪里好会有帮助", score_tags: ["specific_recognition"], weights: { feedback_clarity_need: 1, growth_environment_need: 1 } },
        { key: "D", label_jp: "認められる機会があると伸びやすい", label_cn: "有被认可机会更容易成长", score_tags: ["recognition_growth"], weights: { feedback_clarity_need: 2, growth_environment_need: 2 } },
        { key: "E", label_jp: "反応がない環境では自信を保ちにくい", label_cn: "没反应的环境难维持自信", score_tags: ["recognition_gap_drain"], weights: { feedback_clarity_need: 3, growth_environment_need: 2 } }
      ]
    },
    {
      id: "F02_Q35",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "成長できる環境として、どれが近いですか？",
      prompt_cn: "对你来说，能成长的环境更接近哪种？",
      primary_dimension: "growth_environment_need",
      secondary_dimension: "feedback_clarity_need",
      sensitivity_level: "low",
      public_private_note: "private growth preference",
      risk_note: "do not promise growth outcome",
      interpretation_boundary: "growth condition tendency",
      options: [
        { key: "A", label_jp: "大きな裁量の中で自分で伸びたい", label_cn: "想在大裁量中自己成长", score_tags: ["autonomous_growth"], weights: { growth_environment_need: 3, feedback_clarity_need: -2 } },
        { key: "B", label_jp: "挑戦の機会が多いと伸びやすい", label_cn: "挑战机会多更容易成长", score_tags: ["challenge_growth"], weights: { growth_environment_need: 3, feedback_clarity_need: -1 } },
        { key: "C", label_jp: "挑戦とサポートの両方がほしい", label_cn: "希望挑战和支持都有", score_tags: ["balanced_growth"], weights: { growth_environment_need: 2, feedback_clarity_need: 1 } },
        { key: "D", label_jp: "段階的に学べる環境がよい", label_cn: "阶段性学习的环境更好", score_tags: ["stepwise_growth"], weights: { growth_environment_need: 1, feedback_clarity_need: 2 } },
        { key: "E", label_jp: "何を伸ばすか明確でないと迷いやすい", label_cn: "不明确要成长什么会迷茫", score_tags: ["growth_clarity_need"], weights: { growth_environment_need: 1, feedback_clarity_need: 3 } }
      ]
    },
    {
      id: "F02_Q36",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "人前でフィードバックされることについて、どう感じますか？",
      prompt_cn: "在他人面前被反馈，你怎么感受？",
      primary_dimension: "psychological_safety_need",
      secondary_dimension: "conflict_noise_sensitivity",
      sensitivity_level: "medium",
      public_private_note: "private sensitivity",
      risk_note: "avoid trauma or clinical framing",
      interpretation_boundary: "feedback delivery preference only",
      options: [
        { key: "A", label_jp: "公開の場でも前向きに受け取れる", label_cn: "公开场合也能积极接收", score_tags: ["public_feedback_ok"], weights: { psychological_safety_need: -2, conflict_noise_sensitivity: -2 } },
        { key: "B", label_jp: "内容が建設的なら大丈夫", label_cn: "内容建设性就可以", score_tags: ["constructive_public_ok"], weights: { psychological_safety_need: -1, conflict_noise_sensitivity: -1 } },
        { key: "C", label_jp: "内容と相手による", label_cn: "看内容和对象", score_tags: ["feedback_contextual"], weights: { psychological_safety_need: 1, conflict_noise_sensitivity: 1 } },
        { key: "D", label_jp: "個別に伝えてもらうほうが受け取りやすい", label_cn: "单独传达更容易接收", score_tags: ["private_feedback_need"], weights: { psychological_safety_need: 2, conflict_noise_sensitivity: 2 } },
        { key: "E", label_jp: "人前の指摘が続くとかなり消耗する", label_cn: "持续在人前被指出会很消耗", score_tags: ["public_critique_drain"], weights: { psychological_safety_need: 3, conflict_noise_sensitivity: 3 } }
      ]
    },
    {
      id: "F02_Q37",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "期待値やゴールが変わるとき、何があると安心しますか？",
      prompt_cn: "期待值或目标变化时，有什么会让你安心？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "change_tolerance",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "avoid management advice",
      interpretation_boundary: "clarity condition only",
      options: [
        { key: "A", label_jp: "すぐ共有されれば対応できる", label_cn: "马上共享就能应对", score_tags: ["fast_goal_update"], weights: { feedback_clarity_need: 0, change_tolerance: 2 } },
        { key: "B", label_jp: "変更点がわかればよい", label_cn: "知道变化点即可", score_tags: ["goal_delta_clarity"], weights: { feedback_clarity_need: 1, change_tolerance: 1 } },
        { key: "C", label_jp: "背景と優先順位が知りたい", label_cn: "想知道背景和优先级", score_tags: ["goal_context_need"], weights: { feedback_clarity_need: 2, change_tolerance: 0 } },
        { key: "D", label_jp: "自分の役割への影響まで見たい", label_cn: "想看到对自己角色的影响", score_tags: ["goal_impact_need"], weights: { feedback_clarity_need: 3, change_tolerance: -1 } },
        { key: "E", label_jp: "期待値が急に変わる環境は消耗する", label_cn: "期待值突然变化的环境会消耗", score_tags: ["goal_shift_drain"], weights: { feedback_clarity_need: 3, change_tolerance: -3 } }
      ]
    },
    {
      id: "F02_Q38",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "相談しやすい雰囲気は、あなたにとってどのくらい大切ですか？",
      prompt_cn: "容易咨询的氛围，对你有多重要？",
      primary_dimension: "psychological_safety_need",
      secondary_dimension: "communication_density",
      sensitivity_level: "medium",
      public_private_note: "private support preference",
      risk_note: "do not imply vulnerability judgment",
      interpretation_boundary: "support environment preference",
      options: [
        { key: "A", label_jp: "自分で進めるほうが力が出る", label_cn: "自己推进更能发挥", score_tags: ["self_support"], weights: { psychological_safety_need: -2, communication_density: -2 } },
        { key: "B", label_jp: "必要なとき相談できればよい", label_cn: "必要时能咨询即可", score_tags: ["available_support"], weights: { psychological_safety_need: 0, communication_density: -1 } },
        { key: "C", label_jp: "相談の入口があると安心", label_cn: "有咨询入口会安心", score_tags: ["support_entry"], weights: { psychological_safety_need: 1, communication_density: 1 } },
        { key: "D", label_jp: "日常的に相談できる空気がほしい", label_cn: "希望日常就能咨询的氛围", score_tags: ["daily_support_need"], weights: { psychological_safety_need: 2, communication_density: 2 } },
        { key: "E", label_jp: "相談しにくい環境では抱え込みやすい", label_cn: "难咨询的环境容易自己扛太多", score_tags: ["support_gap_drain"], weights: { psychological_safety_need: 3, communication_density: 2 } }
      ]
    },
    {
      id: "F02_Q39",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "評価や成果が数字で見える環境について、どう感じますか？",
      prompt_cn: "评价或成果以数字可见的环境，你怎么感受？",
      primary_dimension: "feedback_clarity_need",
      secondary_dimension: "psychological_safety_need",
      sensitivity_level: "medium",
      public_private_note: "private evaluation preference",
      risk_note: "do not imply sales/metric suitability",
      interpretation_boundary: "metric environment preference only",
      options: [
        { key: "A", label_jp: "数字があるほうが燃えやすい", label_cn: "有数字更容易被激发", score_tags: ["metric_energy"], weights: { feedback_clarity_need: 2, psychological_safety_need: -2 } },
        { key: "B", label_jp: "目安としてあるとわかりやすい", label_cn: "作为参考会更清楚", score_tags: ["metric_reference"], weights: { feedback_clarity_need: 2, psychological_safety_need: -1 } },
        { key: "C", label_jp: "数字と内容の両方が見たい", label_cn: "数字和内容都想看", score_tags: ["balanced_metric"], weights: { feedback_clarity_need: 2, psychological_safety_need: 0 } },
        { key: "D", label_jp: "数字だけだと緊張しやすい", label_cn: "只有数字容易紧张", score_tags: ["metric_tension"], weights: { feedback_clarity_need: 1, psychological_safety_need: 2 } },
        { key: "E", label_jp: "数字で常に比べられる環境は消耗する", label_cn: "持续被数字比较的环境会消耗", score_tags: ["metric_comparison_drain"], weights: { feedback_clarity_need: 0, psychological_safety_need: 3 } }
      ]
    },
    {
      id: "F02_Q40",
      section: "評価・フィードバック・安心感",
      question_type: "single_select_5",
      prompt_jp: "「まだできていないこと」を指摘されるとき、どんな伝え方が合いますか？",
      prompt_cn: "被指出“还没做到的事”时，怎样传达更适合你？",
      primary_dimension: "psychological_safety_need",
      secondary_dimension: "growth_environment_need",
      sensitivity_level: "medium",
      public_private_note: "private feedback preference",
      risk_note: "avoid clinical sensitivity framing",
      interpretation_boundary: "feedback delivery preference only",
      options: [
        { key: "A", label_jp: "はっきり言われるほうが動ける", label_cn: "清楚直接说更能行动", score_tags: ["direct_feedback_fit"], weights: { psychological_safety_need: -2, growth_environment_need: 2 } },
        { key: "B", label_jp: "具体的なら受け取りやすい", label_cn: "具体的话容易接收", score_tags: ["specific_feedback"], weights: { psychological_safety_need: 0, growth_environment_need: 2 } },
        { key: "C", label_jp: "よい点と一緒に聞けると助かる", label_cn: "和好的点一起听会有帮助", score_tags: ["balanced_feedback_delivery"], weights: { psychological_safety_need: 1, growth_environment_need: 1 } },
        { key: "D", label_jp: "次の一歩まで示されると安心", label_cn: "如果指出下一步会安心", score_tags: ["next_step_feedback"], weights: { psychological_safety_need: 2, growth_environment_need: 1 } },
        { key: "E", label_jp: "指摘だけが続くと力を出しにくい", label_cn: "只有指出问题持续时很难发挥", score_tags: ["critique_only_drain"], weights: { psychological_safety_need: 3, growth_environment_need: -1 } }
      ]
    },
    {
      id: "F02_Q41",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "変化の多い職場環境は、あなたにとってどんな感覚ですか？",
      prompt_cn: "变化很多的职场环境，对你来说是什么感觉？",
      primary_dimension: "change_tolerance",
      secondary_dimension: "workload_rhythm_fit",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "do not imply startup or large company fit",
      interpretation_boundary: "change environment tendency only",
      options: [
        { key: "A", label_jp: "変化があるほうが目が覚める", label_cn: "有变化反而醒神", score_tags: ["change_energy"], weights: { change_tolerance: 3, workload_rhythm_fit: 2 } },
        { key: "B", label_jp: "ある程度の変化は楽しめる", label_cn: "一定变化可以享受", score_tags: ["change_tolerant"], weights: { change_tolerance: 2, workload_rhythm_fit: 1 } },
        { key: "C", label_jp: "変化と安定の両方がほしい", label_cn: "变化和稳定都需要", score_tags: ["change_stability_balance"], weights: { change_tolerance: 0, workload_rhythm_fit: 0 } },
        { key: "D", label_jp: "変化が続くと準備が必要になる", label_cn: "变化持续时需要准备", score_tags: ["change_preparation_need"], weights: { change_tolerance: -1, workload_rhythm_fit: -1 } },
        { key: "E", label_jp: "変化が多すぎる環境では消耗しやすい", label_cn: "变化过多的环境容易消耗", score_tags: ["change_drain"], weights: { change_tolerance: -3, workload_rhythm_fit: -2 } }
      ]
    },
    {
      id: "F02_Q42",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "短い期限が続く働き方について、どう感じますか？",
      prompt_cn: "持续短期限的工作方式，你怎么感受？",
      primary_dimension: "workload_rhythm_fit",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "medium",
      public_private_note: "workload response is private",
      risk_note: "avoid burnout/health claims",
      interpretation_boundary: "workload rhythm preference only",
      options: [
        { key: "A", label_jp: "締切が近いほうが集中しやすい", label_cn: "截止近更容易集中", score_tags: ["deadline_energy"], weights: { workload_rhythm_fit: 3, recovery_environment_need: -2 } },
        { key: "B", label_jp: "短期集中なら合う", label_cn: "短期集中可以适合", score_tags: ["sprint_fit"], weights: { workload_rhythm_fit: 2, recovery_environment_need: -1 } },
        { key: "C", label_jp: "繁忙と余白の波があればよい", label_cn: "有忙碌和余白的波动即可", score_tags: ["wave_rhythm"], weights: { workload_rhythm_fit: 1, recovery_environment_need: 1 } },
        { key: "D", label_jp: "短い期限が続くと回復が必要", label_cn: "短期限持续会需要恢复", score_tags: ["deadline_recovery_need"], weights: { workload_rhythm_fit: -1, recovery_environment_need: 2 } },
        { key: "E", label_jp: "常に急ぎの環境では続きにくい", label_cn: "总是紧急的环境难持续", score_tags: ["constant_urgency_drain"], weights: { workload_rhythm_fit: -3, recovery_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q43",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "複数の案件を同時に動かす環境は、あなたにとってどうですか？",
      prompt_cn: "同时推进多个项目的环境，对你来说如何？",
      primary_dimension: "workload_rhythm_fit",
      secondary_dimension: "focus_environment_need",
      sensitivity_level: "low",
      public_private_note: "private work preference",
      risk_note: "do not imply multitasking ability",
      interpretation_boundary: "task load preference",
      options: [
        { key: "A", label_jp: "複数あるほうがリズムが出る", label_cn: "多个任务反而有节奏", score_tags: ["multi_project_fit"], weights: { workload_rhythm_fit: 3, focus_environment_need: -2 } },
        { key: "B", label_jp: "整理されていれば対応できる", label_cn: "如果整理清楚就能应对", score_tags: ["organized_multi"], weights: { workload_rhythm_fit: 1, focus_environment_need: 0 } },
        { key: "C", label_jp: "数と優先順位による", label_cn: "看数量和优先级", score_tags: ["priority_dependent"], weights: { workload_rhythm_fit: 0, focus_environment_need: 1 } },
        { key: "D", label_jp: "一つずつ集中できるほうがよい", label_cn: "更适合一个个集中处理", score_tags: ["single_focus_preference"], weights: { workload_rhythm_fit: -2, focus_environment_need: 2 } },
        { key: "E", label_jp: "同時進行が多いとかなり消耗する", label_cn: "同时推进太多会很消耗", score_tags: ["multi_project_drain"], weights: { workload_rhythm_fit: -3, focus_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q44",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "急な依頼や差し込み作業が入る環境について、どう感じますか？",
      prompt_cn: "突然插入请求或临时工作，对你来说如何？",
      primary_dimension: "change_tolerance",
      secondary_dimension: "role_boundary_need",
      sensitivity_level: "medium",
      public_private_note: "private workload boundary",
      risk_note: "avoid refusal advice",
      interpretation_boundary: "interruption/change preference",
      options: [
        { key: "A", label_jp: "差し込みがあるほうが動きが出る", label_cn: "有插入任务反而有动感", score_tags: ["ad_hoc_fit"], weights: { change_tolerance: 3, role_boundary_need: -2 } },
        { key: "B", label_jp: "たまになら対応できる", label_cn: "偶尔可以应对", score_tags: ["ad_hoc_tolerant"], weights: { change_tolerance: 1, role_boundary_need: -1 } },
        { key: "C", label_jp: "優先順位が見えれば対応できる", label_cn: "看见优先级就能应对", score_tags: ["ad_hoc_with_priority"], weights: { change_tolerance: 0, role_boundary_need: 1 } },
        { key: "D", label_jp: "頻繁だと予定が崩れて疲れやすい", label_cn: "频繁会打乱计划而疲惫", score_tags: ["ad_hoc_fatigue"], weights: { change_tolerance: -2, role_boundary_need: 2 } },
        { key: "E", label_jp: "差し込みが多い環境では力を出しにくい", label_cn: "插入任务多的环境难发挥", score_tags: ["ad_hoc_drain"], weights: { change_tolerance: -3, role_boundary_need: 3 } }
      ]
    },
    {
      id: "F02_Q45",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "忙しい時期と落ち着く時期の波について、どれが近いですか？",
      prompt_cn: "对忙碌期和稳定期的波动，你更接近哪种？",
      primary_dimension: "workload_rhythm_fit",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "low",
      public_private_note: "private rhythm preference",
      risk_note: "avoid health advice",
      interpretation_boundary: "workload wave tendency only",
      options: [
        { key: "A", label_jp: "波があるほうが飽きにくい", label_cn: "有波动更不容易厌倦", score_tags: ["wave_energy"], weights: { workload_rhythm_fit: 3, recovery_environment_need: -1 } },
        { key: "B", label_jp: "忙しい時期があっても切り替えられる", label_cn: "有忙期也能切换", score_tags: ["wave_tolerant"], weights: { workload_rhythm_fit: 2, recovery_environment_need: 0 } },
        { key: "C", label_jp: "忙しさと回復の見通しがあればよい", label_cn: "有忙碌和恢复预期就好", score_tags: ["wave_with_recovery"], weights: { workload_rhythm_fit: 1, recovery_environment_need: 1 } },
        { key: "D", label_jp: "波が大きいとリズムを戻すのに時間がいる", label_cn: "波动大时需要时间找回节奏", score_tags: ["wave_recovery_need"], weights: { workload_rhythm_fit: -1, recovery_environment_need: 2 } },
        { key: "E", label_jp: "波が激しい環境では継続しにくい", label_cn: "波动剧烈的环境难持续", score_tags: ["wave_drain"], weights: { workload_rhythm_fit: -3, recovery_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q46",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "新しいツールや仕組みがよく変わる環境は、あなたにとってどうですか？",
      prompt_cn: "工具或机制经常变化的环境，对你来说如何？",
      primary_dimension: "change_tolerance",
      secondary_dimension: "growth_environment_need",
      sensitivity_level: "low",
      public_private_note: "safe as preference",
      risk_note: "do not judge learning ability",
      interpretation_boundary: "adaptation preference only",
      options: [
        { key: "A", label_jp: "新しいものを試すのが楽しい", label_cn: "尝试新东西很有趣", score_tags: ["tool_change_energy"], weights: { change_tolerance: 3, growth_environment_need: 2 } },
        { key: "B", label_jp: "便利になるなら歓迎できる", label_cn: "如果更方便可以欢迎", score_tags: ["tool_change_positive"], weights: { change_tolerance: 2, growth_environment_need: 1 } },
        { key: "C", label_jp: "使い方がわかれば大丈夫", label_cn: "知道用法就可以", score_tags: ["tool_support_need"], weights: { change_tolerance: 0, growth_environment_need: 1 } },
        { key: "D", label_jp: "変わる前に説明がほしい", label_cn: "变化前希望有说明", score_tags: ["tool_change_clarity"], weights: { change_tolerance: -1, growth_environment_need: 0 } },
        { key: "E", label_jp: "仕組みが頻繁に変わると消耗する", label_cn: "机制频繁变化会消耗", score_tags: ["tool_change_drain"], weights: { change_tolerance: -3, growth_environment_need: -1 } }
      ]
    },
    {
      id: "F02_Q47",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "スピード感のあるチームで働くとき、あなたはどうなりやすいですか？",
      prompt_cn: "在速度感很强的团队工作时，你容易怎样？",
      primary_dimension: "decision_speed_fit",
      secondary_dimension: "workload_rhythm_fit",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "avoid performance prediction",
      interpretation_boundary: "speed environment tendency only",
      options: [
        { key: "A", label_jp: "その速さで目が覚める", label_cn: "会被这种速度激活", score_tags: ["speed_energy"], weights: { decision_speed_fit: 3, workload_rhythm_fit: 2 } },
        { key: "B", label_jp: "目的が見えていれば乗れる", label_cn: "看见目的就能跟上", score_tags: ["purpose_speed_fit"], weights: { decision_speed_fit: 2, workload_rhythm_fit: 1 } },
        { key: "C", label_jp: "速さと整理の両方がほしい", label_cn: "速度和整理都需要", score_tags: ["speed_structure_balance"], weights: { decision_speed_fit: 0, workload_rhythm_fit: 0 } },
        { key: "D", label_jp: "速いだけだと確認したくなる", label_cn: "只有快的话会想确认", score_tags: ["speed_check_need"], weights: { decision_speed_fit: -1, workload_rhythm_fit: -1 } },
        { key: "E", label_jp: "速さが強すぎると置いていかれた感覚になる", label_cn: "速度太强会有被落下感", score_tags: ["speed_drain"], weights: { decision_speed_fit: -3, workload_rhythm_fit: -2 } }
      ]
    },
    {
      id: "F02_Q48",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "仕事量が増えたとき、環境に何があると保ちやすいですか？",
      prompt_cn: "工作量增加时，环境中有什么更容易让你维持住？",
      primary_dimension: "recovery_environment_need",
      secondary_dimension: "workload_rhythm_fit",
      sensitivity_level: "medium",
      public_private_note: "workload condition is private",
      risk_note: "avoid health or burnout prediction",
      interpretation_boundary: "sustainability support preference",
      options: [
        { key: "A", label_jp: "自分で優先順位を変えられる裁量", label_cn: "能自己调整优先级的裁量", score_tags: ["load_autonomy"], weights: { recovery_environment_need: 1, workload_rhythm_fit: 2 } },
        { key: "B", label_jp: "チームで分担を見直せる場", label_cn: "团队能重新分担的场合", score_tags: ["load_team_support"], weights: { recovery_environment_need: 2, workload_rhythm_fit: 1 } },
        { key: "C", label_jp: "期限や範囲を確認できること", label_cn: "能确认期限和范围", score_tags: ["load_scope_clarity"], weights: { recovery_environment_need: 2, workload_rhythm_fit: 0 } },
        { key: "D", label_jp: "休む時間や空白が確保されること", label_cn: "能确保休息时间和空白", score_tags: ["load_recovery_space"], weights: { recovery_environment_need: 3, workload_rhythm_fit: -1 } },
        { key: "E", label_jp: "増えたまま放置されるとかなり消耗する", label_cn: "增加后被放置会很消耗", score_tags: ["load_unmanaged_drain"], weights: { recovery_environment_need: 3, workload_rhythm_fit: -3 } }
      ]
    },
    {
      id: "F02_Q49",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "先が読めないプロジェクトに入るとき、どんな環境なら動けますか？",
      prompt_cn: "进入前景不确定的项目时，怎样的环境能让你行动？",
      primary_dimension: "change_tolerance",
      secondary_dimension: "psychological_safety_need",
      sensitivity_level: "medium",
      public_private_note: "private uncertainty preference",
      risk_note: "avoid anxiety diagnosis",
      interpretation_boundary: "uncertainty support preference",
      options: [
        { key: "A", label_jp: "不確実なほうが面白い", label_cn: "不确定反而有意思", score_tags: ["uncertainty_energy"], weights: { change_tolerance: 3, psychological_safety_need: -1 } },
        { key: "B", label_jp: "試せる余地があれば動ける", label_cn: "有试的余地就能动", score_tags: ["uncertainty_experiment"], weights: { change_tolerance: 2, psychological_safety_need: 0 } },
        { key: "C", label_jp: "仮説と次の確認点があれば動ける", label_cn: "有假设和下个确认点就能动", score_tags: ["uncertainty_structure"], weights: { change_tolerance: 0, psychological_safety_need: 1 } },
        { key: "D", label_jp: "役割や撤退条件が見えると安心", label_cn: "看见角色和退出条件会安心", score_tags: ["uncertainty_boundary"], weights: { change_tolerance: -1, psychological_safety_need: 2 } },
        { key: "E", label_jp: "不確実なまま進む環境は消耗しやすい", label_cn: "在不确定中推进的环境容易消耗", score_tags: ["uncertainty_drain"], weights: { change_tolerance: -3, psychological_safety_need: 3 } }
      ]
    },
    {
      id: "F02_Q50",
      section: "変化・スピード・負荷",
      question_type: "single_select_5",
      prompt_jp: "忙しさの中で、何が一番あると助かりますか？",
      prompt_cn: "忙碌中，最有帮助的是什么？",
      primary_dimension: "workload_rhythm_fit",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "avoid productivity prescription",
      interpretation_boundary: "support condition preference",
      options: [
        { key: "A", label_jp: "その場で決めて進むスピード", label_cn: "当场决定推进的速度", score_tags: ["busy_speed_support"], weights: { workload_rhythm_fit: 3, recovery_environment_need: -1 } },
        { key: "B", label_jp: "チームで声をかけ合うこと", label_cn: "团队互相招呼", score_tags: ["busy_team_support"], weights: { workload_rhythm_fit: 2, recovery_environment_need: 1 } },
        { key: "C", label_jp: "優先順位が見えること", label_cn: "能看见优先级", score_tags: ["busy_priority"], weights: { workload_rhythm_fit: 1, recovery_environment_need: 1 } },
        { key: "D", label_jp: "一人で集中する時間", label_cn: "一个人集中的时间", score_tags: ["busy_focus_block"], weights: { workload_rhythm_fit: -1, recovery_environment_need: 2 } },
        { key: "E", label_jp: "回復できる余白", label_cn: "能恢复的余白", score_tags: ["busy_recovery_need"], weights: { workload_rhythm_fit: -2, recovery_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q51",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "仕事の合間に回復するには、どんな環境が必要ですか？",
      prompt_cn: "工作间隙恢复时，你需要怎样的环境？",
      primary_dimension: "recovery_environment_need",
      secondary_dimension: "sensory_environment_fit",
      sensitivity_level: "low",
      public_private_note: "private recovery preference",
      risk_note: "do not give health advice",
      interpretation_boundary: "recovery condition preference only",
      options: [
        { key: "A", label_jp: "人と話すことで切り替わる", label_cn: "和人说话能切换", score_tags: ["social_recovery"], weights: { recovery_environment_need: -2, sensory_environment_fit: -1 } },
        { key: "B", label_jp: "軽い雑談や移動で戻れる", label_cn: "轻闲聊或移动能回来", score_tags: ["light_recovery"], weights: { recovery_environment_need: -1, sensory_environment_fit: 0 } },
        { key: "C", label_jp: "少し静かな時間があるとよい", label_cn: "有一点安静时间会好", score_tags: ["quiet_recovery"], weights: { recovery_environment_need: 1, sensory_environment_fit: 1 } },
        { key: "D", label_jp: "一人になれる時間が必要", label_cn: "需要一个人的时间", score_tags: ["solo_recovery"], weights: { recovery_environment_need: 2, sensory_environment_fit: 2 } },
        { key: "E", label_jp: "回復できる場所がないと続きにくい", label_cn: "没有恢复场所会难持续", score_tags: ["recovery_place_need"], weights: { recovery_environment_need: 3, sensory_environment_fit: 3 } }
      ]
    },
    {
      id: "F02_Q52",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "長く続けやすい環境として、どれが近いですか？",
      prompt_cn: "对你来说，容易长期持续的环境更接近哪种？",
      primary_dimension: "recovery_environment_need",
      secondary_dimension: "workload_rhythm_fit",
      sensitivity_level: "low",
      public_private_note: "safe as tendency",
      risk_note: "do not predict retention or career outcome",
      interpretation_boundary: "sustainability preference only",
      options: [
        { key: "A", label_jp: "刺激や変化がある環境", label_cn: "有刺激和变化的环境", score_tags: ["stimulus_sustain"], weights: { recovery_environment_need: -2, workload_rhythm_fit: 2 } },
        { key: "B", label_jp: "挑戦と休みの波がある環境", label_cn: "有挑战和休息波动的环境", score_tags: ["wave_sustain"], weights: { recovery_environment_need: 1, workload_rhythm_fit: 2 } },
        { key: "C", label_jp: "役割とペースが見える環境", label_cn: "角色和节奏可见的环境", score_tags: ["clear_pace_sustain"], weights: { recovery_environment_need: 1, workload_rhythm_fit: 0 } },
        { key: "D", label_jp: "無理なく調整できる環境", label_cn: "可以无压力调整的环境", score_tags: ["adjustable_sustain"], weights: { recovery_environment_need: 2, workload_rhythm_fit: -1 } },
        { key: "E", label_jp: "余白と境界を守れる環境", label_cn: "能守住余白和边界的环境", score_tags: ["boundary_sustain"], weights: { recovery_environment_need: 3, workload_rhythm_fit: -2 } }
      ]
    },
    {
      id: "F02_Q53",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "働く時間帯やペースを調整できることは、どのくらい重要ですか？",
      prompt_cn: "可以调整工作时间段和节奏，对你有多重要？",
      primary_dimension: "autonomy_need",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "avoid claiming flexible work requirement",
      interpretation_boundary: "schedule autonomy preference",
      options: [
        { key: "A", label_jp: "決まった時間のほうが安定する", label_cn: "固定时间更稳定", score_tags: ["fixed_schedule_fit"], weights: { autonomy_need: -3, recovery_environment_need: -1 } },
        { key: "B", label_jp: "基本は決まっているほうがよい", label_cn: "基本固定更好", score_tags: ["mostly_fixed_schedule"], weights: { autonomy_need: -2, recovery_environment_need: 0 } },
        { key: "C", label_jp: "一部調整できると助かる", label_cn: "部分可调整会有帮助", score_tags: ["partial_schedule_flex"], weights: { autonomy_need: 1, recovery_environment_need: 1 } },
        { key: "D", label_jp: "集中や回復に合わせて調整したい", label_cn: "想按集中和恢复调整", score_tags: ["rhythm_based_schedule"], weights: { autonomy_need: 2, recovery_environment_need: 2 } },
        { key: "E", label_jp: "時間の裁量がないと継続しにくい", label_cn: "没有时间裁量会难持续", score_tags: ["schedule_autonomy_need"], weights: { autonomy_need: 3, recovery_environment_need: 3 } }
      ]
    },
    {
      id: "F02_Q54",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "在宅・出社・ハイブリッドについて、今のあなたに近い感覚はどれですか？",
      prompt_cn: "关于居家、到岗、混合办公，现在你的感觉更接近哪种？",
      primary_dimension: "remote_onsite_fit",
      secondary_dimension: "team_distance_preference",
      sensitivity_level: "low",
      public_private_note: "private preference",
      risk_note: "must not say user should choose remote/onsite",
      interpretation_boundary: "current fit tendency only",
      options: [
        { key: "A", label_jp: "出社で人の流れがあるほうが合う", label_cn: "到岗有人的流动更适合", score_tags: ["onsite_energy"], weights: { remote_onsite_fit: -3, team_distance_preference: 3 } },
        { key: "B", label_jp: "出社中心でも問題ない", label_cn: "以到岗为主也没问题", score_tags: ["onsite_ok"], weights: { remote_onsite_fit: -2, team_distance_preference: 1 } },
        { key: "C", label_jp: "ハイブリッドが合いやすい", label_cn: "混合办公更合适", score_tags: ["hybrid_fit"], weights: { remote_onsite_fit: 1, team_distance_preference: 0 } },
        { key: "D", label_jp: "在宅や静かな場所があると力が出る", label_cn: "有居家或安静地点更能发挥", score_tags: ["remote_focus"], weights: { remote_onsite_fit: 2, team_distance_preference: -1 } },
        { key: "E", label_jp: "自分で場所を選べることが大切", label_cn: "能自己选择地点很重要", score_tags: ["location_choice_need"], weights: { remote_onsite_fit: 3, team_distance_preference: -1 } }
      ]
    },
    {
      id: "F02_Q55",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "仕事の終わり方として、どれがあると翌日に戻りやすいですか？",
      prompt_cn: "工作结束方式中，哪种会让你第二天更容易回来？",
      primary_dimension: "recovery_environment_need",
      secondary_dimension: "role_boundary_need",
      sensitivity_level: "low",
      public_private_note: "private recovery preference",
      risk_note: "do not give sleep/health advice",
      interpretation_boundary: "closure preference",
      options: [
        { key: "A", label_jp: "終わりを決めず流れで進めるほうが楽", label_cn: "不固定结束，顺着流动更轻松", score_tags: ["fluid_closure"], weights: { recovery_environment_need: -2, role_boundary_need: -2 } },
        { key: "B", label_jp: "大きな区切りだけあればよい", label_cn: "有大区分就好", score_tags: ["simple_closure"], weights: { recovery_environment_need: -1, role_boundary_need: -1 } },
        { key: "C", label_jp: "明日の入口を残せるとよい", label_cn: "能留下明天入口会好", score_tags: ["next_entry_closure"], weights: { recovery_environment_need: 1, role_boundary_need: 1 } },
        { key: "D", label_jp: "終了時間や範囲を決めたい", label_cn: "想决定结束时间和范围", score_tags: ["clear_closure"], weights: { recovery_environment_need: 2, role_boundary_need: 2 } },
        { key: "E", label_jp: "終わりがない環境では休みにくい", label_cn: "没有结束感的环境很难休息", score_tags: ["no_closure_drain"], weights: { recovery_environment_need: 3, role_boundary_need: 3 } }
      ]
    },
    {
      id: "F02_Q56",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "環境が合わないと感じたとき、何があると調整しやすいですか？",
      prompt_cn: "感到环境不合适时，有什么会更容易调整？",
      primary_dimension: "psychological_safety_need",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "medium",
      public_private_note: "private workplace adjustment preference",
      risk_note: "do not instruct user to negotiate or complain",
      interpretation_boundary: "adjustment support preference only",
      options: [
        { key: "A", label_jp: "自分で工夫できる余地", label_cn: "自己能想办法的余地", score_tags: ["self_adjustment"], weights: { psychological_safety_need: 0, autonomy_need: 3 } },
        { key: "B", label_jp: "小さく試せる制度", label_cn: "可以小范围尝试的制度", score_tags: ["trial_adjustment"], weights: { psychological_safety_need: 1, autonomy_need: 2 } },
        { key: "C", label_jp: "相談できる窓口や相手", label_cn: "可以咨询的窗口或对象", score_tags: ["adjustment_support"], weights: { psychological_safety_need: 2, autonomy_need: 1 } },
        { key: "D", label_jp: "理由を説明しやすい空気", label_cn: "容易说明理由的氛围", score_tags: ["adjustment_safety"], weights: { psychological_safety_need: 3, autonomy_need: 1 } },
        { key: "E", label_jp: "変えられない環境では消耗が残りやすい", label_cn: "无法改变的环境容易留下消耗", score_tags: ["adjustment_block_drain"], weights: { psychological_safety_need: 3, autonomy_need: 2 } }
      ]
    },
    {
      id: "F02_Q57",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "仕事で疲れがたまったとき、どんなサインが出やすいですか？",
      prompt_cn: "工作疲惫累积时，你容易出现什么信号？",
      primary_dimension: "recovery_environment_need",
      secondary_dimension: "workload_rhythm_fit",
      sensitivity_level: "medium",
      public_private_note: "private self-observation",
      risk_note: "non-clinical; no health interpretation",
      interpretation_boundary: "self-reflection signal only",
      options: [
        { key: "A", label_jp: "少し休めばすぐ戻る", label_cn: "稍微休息就能回来", score_tags: ["quick_recovery"], weights: { recovery_environment_need: -2, workload_rhythm_fit: 1 } },
        { key: "B", label_jp: "集中が浅くなる", label_cn: "集中变浅", score_tags: ["focus_fatigue"], weights: { recovery_environment_need: 1, workload_rhythm_fit: 0 } },
        { key: "C", label_jp: "返事や判断が重くなる", label_cn: "回复和判断变重", score_tags: ["decision_fatigue"], weights: { recovery_environment_need: 2, workload_rhythm_fit: -1 } },
        { key: "D", label_jp: "音や人の動きが気になりやすくなる", label_cn: "更在意声音和人的动静", score_tags: ["sensory_fatigue"], weights: { recovery_environment_need: 2, workload_rhythm_fit: -2 } },
        { key: "E", label_jp: "回復の時間がないと続けにくくなる", label_cn: "没有恢复时间会难以持续", score_tags: ["recovery_debt"], weights: { recovery_environment_need: 3, workload_rhythm_fit: -3 } }
      ]
    },
    {
      id: "F02_Q58",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "職場で「自分らしく働けている」と感じるのは、どんなときですか？",
      prompt_cn: "在职场中，你什么时候会觉得“比较像自己地工作”？",
      primary_dimension: "growth_environment_need",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "medium",
      public_private_note: "private self-understanding",
      risk_note: "avoid identity diagnosis",
      interpretation_boundary: "self-perceived fit cue only",
      options: [
        { key: "A", label_jp: "新しいことに挑戦できるとき", label_cn: "能挑战新事物时", score_tags: ["challenge_self_fit"], weights: { growth_environment_need: 3, autonomy_need: 2 } },
        { key: "B", label_jp: "自分の工夫が活かせるとき", label_cn: "自己的办法能被活用时", score_tags: ["craft_self_fit"], weights: { growth_environment_need: 2, autonomy_need: 3 } },
        { key: "C", label_jp: "役割が見えて安心して動けるとき", label_cn: "看见角色并安心行动时", score_tags: ["role_self_fit"], weights: { growth_environment_need: 1, autonomy_need: 0 } },
        { key: "D", label_jp: "人と協力して前に進めるとき", label_cn: "与人协作推进时", score_tags: ["team_self_fit"], weights: { growth_environment_need: 1, autonomy_need: -1 } },
        { key: "E", label_jp: "無理なく続けられる余白があるとき", label_cn: "有能无压力持续的余白时", score_tags: ["sustainable_self_fit"], weights: { growth_environment_need: 1, autonomy_need: 1 } }
      ]
    },
    {
      id: "F02_Q59",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "職場環境を比較するとき、あなたが一番見たい条件はどれですか？",
      prompt_cn: "比较职场环境时，你最想看的条件是哪一个？",
      primary_dimension: "role_boundary_need",
      secondary_dimension: "feedback_clarity_need",
      sensitivity_level: "low",
      public_private_note: "safe as preference",
      risk_note: "do not create job recommendation",
      interpretation_boundary: "comparison lens only",
      options: [
        { key: "A", label_jp: "裁量や自由度", label_cn: "裁量和自由度", score_tags: ["compare_autonomy"], weights: { role_boundary_need: -1, feedback_clarity_need: -1 } },
        { key: "B", label_jp: "チームの距離感", label_cn: "团队距离感", score_tags: ["compare_team_distance"], weights: { role_boundary_need: 0, feedback_clarity_need: 0 } },
        { key: "C", label_jp: "評価や期待値の明確さ", label_cn: "评价和期待值的明确度", score_tags: ["compare_feedback"], weights: { role_boundary_need: 1, feedback_clarity_need: 3 } },
        { key: "D", label_jp: "境界や役割の明確さ", label_cn: "边界和角色的明确度", score_tags: ["compare_boundary"], weights: { role_boundary_need: 3, feedback_clarity_need: 1 } },
        { key: "E", label_jp: "回復や継続のしやすさ", label_cn: "恢复和持续的容易度", score_tags: ["compare_recovery"], weights: { role_boundary_need: 2, feedback_clarity_need: 1 } }
      ]
    },
    {
      id: "F02_Q60",
      section: "回復・継続・環境調整",
      question_type: "single_select_5",
      prompt_jp: "この診断結果を、どんな用途で受け取りたいですか？",
      prompt_cn: "你希望把本诊断结果用于什么用途？",
      primary_dimension: "growth_environment_need",
      secondary_dimension: "recovery_environment_need",
      sensitivity_level: "low",
      public_private_note: "user intent signal; keep private",
      risk_note: "must not create career instruction",
      interpretation_boundary: "routing signal only",
      options: [
        { key: "A", label_jp: "自分に合う環境をざっくり知りたい", label_cn: "想大致了解适合自己的环境", score_tags: ["free_result_fit"], weights: { growth_environment_need: 1, recovery_environment_need: 0 } },
        { key: "B", label_jp: "今の職場との違和感を整理したい", label_cn: "想整理与当前职场的不适感", score_tags: ["c02_bridge_signal"], weights: { growth_environment_need: 0, recovery_environment_need: 2 } },
        { key: "C", label_jp: "働き方そのものも見たい", label_cn: "也想看自己的工作方式", score_tags: ["f01_bridge_signal"], weights: { growth_environment_need: 1, recovery_environment_need: 1 } },
        { key: "D", label_jp: "深いレポートで条件を比較したい", label_cn: "想用深度报告比较条件", score_tags: ["paid_report_interest"], weights: { growth_environment_need: 2, recovery_environment_need: 1 } },
        { key: "E", label_jp: "自分全体の状態とつなげて見たい", label_cn: "想和整体自我状态连接来看", score_tags: ["main_120_bridge_signal"], weights: { growth_environment_need: 2, recovery_environment_need: 2 } }
      ]
    }
  ],
  free_result_structure: {
    required_blocks: [
      "result_type_name",
      "public_safe_recognition_line",
      "top_supportive_environment_signals",
      "likely_drain_signal",
      "workplace_conditions_to_compare",
      "f01_cta",
      "c02_cta",
      "main_120_cta",
      "paid_report_preview",
      "boundary_microcopy"
    ],
    boundary_microcopy_jp: "この結果は職業判断ではなく、働く環境を比較するための自己理解メモです。"
  },
  paid_report_outline: [
    "core_environment_fit_pattern",
    "focus_and_sensory_environment_map",
    "team_distance_and_communication_map",
    "autonomy_rules_and_decision_map",
    "feedback_and_psychological_safety_map",
    "change_speed_and_workload_rhythm_map",
    "recovery_and_sustainability_map",
    "workplace_condition_comparison_checklist",
    "career_conversation_prompts",
    "recommended_next_yorisou_checks"
  ],
  share_card_logic: {
    public_safe: true,
    include_fields: ["test_name_jp","result_type_name_jp","public_safe_recognition_line","supportive_environment_tags","boundary_microcopy"],
    exclude_fields: ["raw_answers","scores","current_employer","private_work_stress","job_change_advice","salary_prediction","success_or_failure_prediction"],
    boundary_microcopy_jp: "職業判断ではなく、環境フィットの自己理解メモ"
  },
  recommendation_mapping: {
    F01: "personal_work_style_and_rhythm",
    C02: "current_state_or_mismatch_reflection",
    MAIN_120: "broader_life_state_understanding",
    S01: "light_daily_return"
  }
} as const;
```

## 17. Final Status

output_status: md_review_file_created
file_name: F02_shokuba_kankyou_fit_shindan_v1_0.md
founder_review_needed: yes
trust_risk_review_needed: yes
codex_needed: no
codex_ready: false
next_recommended_action: founder_and_trust_risk_review_before_batch_codex_handoff