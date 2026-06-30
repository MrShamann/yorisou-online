# Yorisou 120Q Master Question Bank — Corrected Full Three-Batch Embedded Consolidation Input

Status: CORRECTED_CONSOLIDATION_INPUT_PACKAGE  
Purpose: Give the downstream Agent one clean Markdown file containing the true Batch 1, Batch 2, Batch 3 source texts, polish notes, and consolidation instructions.  
Important: This file is for methodology consolidation only. It is not implementation approval.

---

## 0. Operating Status

```text
Batch 1 Q001–Q040: PASS_WITH_POLISH_NOTES
Batch 2 Q041–Q080: PASS_WITH_POLISH_NOTES
Batch 3 Q081–Q120: PASS_WITH_POLISH_NOTES
120Q Master Bank: READY_FOR_MASTER_CONSOLIDATION_POLISH
Implementation: NOT APPROVED
Scoring: NOT STARTED
Result taxonomy: NOT STARTED
Launch: NOT APPROVED
```

---

## 1. Task for Downstream Agent

You are the Yorisou Master Question Bank Consolidation Agent.

TASK MODE: FULL 120Q MASTER CONSOLIDATION + CROSS-BATCH POLISH PASS — USE ONLY THIS MARKDOWN FILE.

You must consolidate the embedded Batch 1, Batch 2, and Batch 3 question banks into one coherent Yorisou 120Q Master Question Bank candidate.

Do not ask for external files.  
Do not rely on chat history.  
Do not rely on hidden attachments.  
Do not write code.  
Do not change repo files.  
Do not create scoring weights.  
Do not create result taxonomy.  
Do not write result copy.  
Do not create report copy.  
Do not approve implementation.  
Do not approve launch.

---

## 2. Approved Polish Fixes

### Batch 1

Q021:
- change option D from `早く動き出せること`
- to `次の判断がしやすいこと`

Q025:
- change prompt phrase from `自分らしく選べた`
- to `あとから納得して選べたと感じる時`

Q029:
- replace `疲れ`
- with `少し引っかかりが残る時`

Q034:
- change option E from `やる意味をもう一度思い出す`
- to `何のために少し進めたいかを思い出す`

### Batch 2

Q055:
- change option C from `体より先に頭の中が忙しくなる`
- to `先に考えごとが増えている`

Q064:
- change option D from `次に同じ形になりにくい置き場所を作る`
- to `次に見返しやすい場所に置く`

Q070:
- change option D from `その場の安全な距離を見たい時`
- to `その場で無理のない距離を見たい時`

Q079:
- change prompt from `いつもの戻り方が重く感じる時`
- to `いつもの戻り方が少し大きく感じる時、軽い形にするならどれですか。`

### Batch 3

Q084:
- replace `休む時間や切り替える時間`
- with `区切りの時間や切り替える時間`

Q089:
- change `別の形にするなら`
- to `形が変わるなら`

Q099:
- change `早く答えすぎた、または遅くなったと感じたあと`
- to `答えるタイミングが合わなかったと感じたあと`

Q104:
- change `役割に入りすぎた感じ`
- to `役割の時間が長く続いた感じ`

Q105:
- change `役割が近くなりすぎる`
- to `役割の影響が残りやすい`

Q114:
- reframe toward observation rather than use/application.
- Avoid making the question sound instructional.

---

## 3. Consolidation Requirements

The consolidated output must:

1. contain exactly Q001–Q120
2. preserve all 8 dimensions
3. preserve all 24 subdimensions
4. preserve 5 variants per subdimension
5. preserve scenario-based A–E answers
6. preserve 24Q and 72Q eligibility markings
7. preserve boundaryMetadata
8. apply all approved polish fixes
9. reduce cross-batch wording repetition
10. normalize metadata vocabulary
11. keep all safety, public/private, and share boundaries intact

---

## 4. Global Wording De-duplication

Reduce unnecessary repetition of:

```text
戻る
戻り方
流れ
余白
気づく
整える
少し
```

Do not remove these words where they are useful. Only reduce overuse where natural alternatives are available.

Acceptable alternatives:

```text
入り直す
切り替わる
次に移る
区切りがつく
見えてくる
手がかりになる
保ちやすい
軽くなる
扱いやすくなる
間を取る
ひと呼吸置く
```

Use alternatives only when they remain natural Japanese.

---

## 5. Safety Boundaries

Clinical boundary:
- no diagnosis
- no symptom language
- no therapy
- no treatment
- no medicalized recovery wording

Relationship boundary:
- no reply/no-reply advice
- no contact/no-contact advice
- no partner inference
- no relationship decision implication

Work / role boundary:
- no career advice
- no work-performance judgment
- no family-role judgment
- no advice to reject, accept, confront, withdraw, or change roles

Self-observation boundary:
- no therapy tone
- no mindfulness authority
- no self-improvement pressure
- no fixed identity

Feedback boundary:
- no compliance
- no obedience
- no coachability
- no implication that accepting feedback is superior

Commercial/recommendation boundary:
- recommendationTags must remain internal and optional
- no product-push wording
- no coaching-drift recommendation language

---

## 6. Metadata Normalization Format

Every question must use this structure:

```text
- questionId:
- dimensionCode:
- subdimensionCode:
- variantType:
- eligibilityFor24Q:
- eligibilityFor72Q:
- eligibilityFor120Q:
- rotationGroup:
- prompt:
- options:
  A:
  B:
  C:
  D:
  E:
- scoringIntent:
- riskFlags:
- reportTags:
- recommendationTags:
- boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
- consolidationNotes:
```

`consolidationNotes` must use one or more of:

```text
unchanged
polished
metadata-normalized
candidate-selection-reviewed
```

Batch 1 currently uses `publicPrivateBoundary: private-only`; normalize it to the Batch 2/3 `boundaryMetadata` model during consolidation.

---

## 7. Candidate Audit

24Q:
- exactly one candidate per subdimension
- normally Variant 1
- total 24 candidates

72Q:
- normally Variant 1 + Variant 2 + Variant 4 per subdimension
- total 72 candidates

Do not change candidate selection unless necessary.

---

## 8. Required Output

Return exactly:

```text
YORISOU_120Q_MASTER_BANK_CONSOLIDATION_POLISH_COMPLETE

Executive status:
- source batches:
- consolidation status:
- implementation readiness:
- scoring readiness:
- launch readiness:
- major changes applied:
- unresolved issues:

Consolidation summary:
- total questions:
- total dimensions:
- total subdimensions:
- variants per subdimension:
- 24Q candidates:
- 72Q candidates:
- 120Q full-bank questions:
- boundaryMetadata status:

Applied polish log:
Q021:
- before:
- after:
- reason:

[repeat only for changed questions]

Global wording normalization:
- repeated wording reviewed:
- phrases reduced:
- phrases preserved:
- remaining repetition risk:

24Q candidate audit:
- total candidates:
- candidate list:
- issues:

72Q candidate audit:
- total candidates:
- candidate list:
- issues:

Metadata normalization audit:
- boundaryMetadata:
- riskFlags:
- reportTags:
- recommendationTags:
- remaining metadata issues:

Safety audit:
- clinical/recovery:
- relationship/reply:
- boundary/role:
- self-observation:
- feedback/compliance:
- commercial/recommendation:
- public/share:
- remaining safety issues:

Consolidated 120Q master bank:

Q001:
- questionId:
- dimensionCode:
- subdimensionCode:
- variantType:
- eligibilityFor24Q:
- eligibilityFor72Q:
- eligibilityFor120Q:
- rotationGroup:
- prompt:
- options:
  A:
  B:
  C:
  D:
  E:
- scoringIntent:
- riskFlags:
- reportTags:
- recommendationTags:
- boundaryMetadata:
  answerData:
  resultUse:
  shareUse:
  questionSurface:
- consolidationNotes:

[repeat Q002 through Q120]

Final self-check:
- exactly 120 questions:
- exactly 8 dimensions:
- exactly 24 subdimensions:
- exactly 5 variants per subdimension:
- exactly 24 questions eligible for 24Q:
- exactly 72 questions eligible for 72Q:
- all questions eligible for 120Q:
- all questions have A–E scenario-based options:
- no agreement-scale options:
- boundaryMetadata present for all:
- no implementation code:
- no scoring weights:
- no result taxonomy:
- ready for final methodology review:
```

If output length is too large, split into:

Part 1:
- Executive status
- audits
- Q001–Q060

Part 2:
- Q061–Q120
- final self-check

---

## 9. Embedded Source Batches

---

## Batch 1 — Q001–Q040

YORISOU_120Q_JAPANESE_MASTER_QUESTION_BANK_BATCH_1_Q001_Q040_COMPLETE

Batch scope:

* covered question IDs: Q001–Q040
* covered dimensions: DR, CL, AR
* covered subdimensions: DR_STARTING_POINT, DR_TRANSITION, DR_ROUTINE_ANCHOR, CL_OPTION_LOAD, CL_CRITERIA, CL_EXPLANATION_PRESSURE, AR_STARTABILITY, AR_CONTINUATION
* total questions generated: 40
* architecture status: 120Q master-first draft, not implementation-approved

Global notes:

* tone: natural, restrained, mobile-readable Japanese
* answer model: 5 scenario-based current-state choices per question
* safety boundaries: non-clinical, non-directive, non-invasive
* 24Q eligibility approach: Variant 1 marked candidate
* 72Q eligibility approach: Variant 1 + Variant 2 + Variant 4 marked candidate

Question bank:

Q001:

* dimensionCode: DR
* subdimensionCode: DR_STARTING_POINT
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_STARTING_POINT
* prompt: 朝や一日の始まりに近い時間、あなたはどんな入り方になりやすいですか。
* options:
  A: まず小さく手をつけると流れに入りやすい
  B: 少し様子を見てから動き始めることが多い
  C: 予定よりも気分や体の重さに左右されやすい
  D: 人や連絡があると始まりやすい
  E: 始める前に頭の中を整える時間がほしい
* scoringIntent: daily start activation baseline
* riskFlags: low; productivity moralizing avoid
* reportTags: rhythm_start, entry_pattern
* recommendationTags: small_start, morning_anchor
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 一日の入り方を責めずに、自然な始動パターンとして拾える。

Q002:

* dimensionCode: DR
* subdimensionCode: DR_STARTING_POINT
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_STARTING_POINT
* prompt: 時間に余裕がない日の始まりは、どの形に近いですか。
* options:
  A: 最初の一つだけ決めると動ける
  B: 急ぐほど何から始めるか迷いやすい
  C: とりあえず動きながら整えていく
  D: 先に連絡や確認を片づけたくなる
  E: 少し止まって全体を見ないと入りにくい
* scoringIntent: start pattern under time pressure
* riskFlags: low
* reportTags: pressure_start, rhythm_friction
* recommendationTags: first_step, pacing_support
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 忙しい場面での始動のゆれを、短い選択肢で見分けられる。

Q003:

* dimensionCode: DR
* subdimensionCode: DR_STARTING_POINT
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: DR_STARTING_POINT
* prompt: 誰かが待っている予定がある日の始まりは、どうなりやすいですか。
* options:
  A: 待っている人がいると切り替えやすい
  B: 気になって早めに準備しすぎる
  C: 相手に合わせる分、自分の流れが後回しになる
  D: 連絡の有無で気持ちの入り方が変わる
  E: 一人の時間が少しないと落ち着いて入れない
* scoringIntent: social influence on daily start
* riskFlags: relationship directive avoid
* reportTags: social_rhythm, start_context
* recommendationTags: schedule_buffer, self_pacing
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 他者がいる時の始まり方を、関係判断ではなく生活リズムとして扱える。

Q004:

* dimensionCode: DR
* subdimensionCode: DR_STARTING_POINT
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_STARTING_POINT
* prompt: 朝や始まりが重かったあと、持ち直す時はどれに近いですか。
* options:
  A: すぐできる用事から始めると戻りやすい
  B: 予定を少し減らすと戻りやすい
  C: 人と話すと流れに入り直しやすい
  D: ひと息置くと次に向かいやすい
  E: その日の流れを組み直すと戻りやすい
* scoringIntent: restart after slow start
* riskFlags: low
* reportTags: adjustment_start, recovery_rhythm
* recommendationTags: reset_step, schedule_adjust
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 始まりの重さではなく、戻り方の違いを拾える。

Q005:

* dimensionCode: DR
* subdimensionCode: DR_STARTING_POINT
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: DR_STARTING_POINT
* prompt: あとから振り返ると、始まりやすい日は何が違うことが多いですか。
* options:
  A: 最初にやることが小さく決まっている
  B: 前の日から少し見通しがある
  C: 誰かとの約束や区切りがある
  D: 体や気持ちに余白がある
  E: その日の優先順位を言葉にできている
* scoringIntent: awareness of start conditions
* riskFlags: low
* reportTags: self_observation, start_condition
* recommendationTags: reflection_prompt, preparation_anchor
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 再訪時に比較しやすい、始動条件の自己観察を促せる。

Q006:

* dimensionCode: DR
* subdimensionCode: DR_TRANSITION
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_TRANSITION
* prompt: 一つのことから次のことへ移る時、あなたはどれに近いですか。
* options:
  A: 区切りが見えると自然に移りやすい
  B: 前のことが残って、少し時間がかかる
  C: 次の予定が決まっていると移りやすい
  D: 気持ちより先に体を動かして移る
  E: 間に短い空白があると移りやすい
* scoringIntent: baseline transition pattern
* riskFlags: low
* reportTags: transition_style, rhythm_shift
* recommendationTags: transition_buffer, task_boundary
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 切り替えの速さではなく、移り方の条件を自然に測れる。

Q007:

* dimensionCode: DR
* subdimensionCode: DR_TRANSITION
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_TRANSITION
* prompt: 急に予定が変わった時、次の動きへ移る感じはどうなりやすいですか。
* options:
  A: すぐ次の手順を探し始める
  B: 一度止まって状況を確かめたくなる
  C: 予定変更の理由がわかると移りやすい
  D: 先に気持ちを落ち着ける時間がいる
  E: 誰かの動きに合わせると移りやすい
* scoringIntent: transition under disruption
* riskFlags: low
* reportTags: change_response, transition_pressure
* recommendationTags: change_notice, pause_buffer
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 予定変更時の切り替えを、柔軟性の順位づけにせず把握できる。

Q008:

* dimensionCode: DR
* subdimensionCode: DR_TRANSITION
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: DR_TRANSITION
* prompt: 誰かの都合で予定の流れが変わる時、あなたはどうなりやすいですか。
* options:
  A: 相手の流れに合わせてすぐ動く
  B: 合わせるけれど、自分の中では少し残る
  C: 変更点がはっきりすると受け入れやすい
  D: 自分の予定を組み直す時間がほしい
  E: その場では合わせて、あとで整える
* scoringIntent: social context effect on transition
* riskFlags: relationship directive avoid
* reportTags: social_transition, adjustment_context
* recommendationTags: boundary_buffer, plan_reframe
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 他者起点の変更を、対人評価ではなく流れの変化として扱える。

Q009:

* dimensionCode: DR
* subdimensionCode: DR_TRANSITION
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_TRANSITION
* prompt: 切り替えがうまくいかなかったあと、戻りやすい形はどれですか。
* options:
  A: 次の一つだけに絞ると戻りやすい
  B: 短く休むと流れをつかみ直せる
  C: 書き出すと次へ移りやすい
  D: 誰かと確認すると動きやすい
  E: 前のことを一度終わらせると戻れる
* scoringIntent: recovery after transition friction
* riskFlags: low
* reportTags: transition_recovery, rhythm_repair
* recommendationTags: micro_reset, task_closure
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 切り替えの失速後に、どの支えが働くかを見られる。

Q010:

* dimensionCode: DR
* subdimensionCode: DR_TRANSITION
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: DR_TRANSITION
* prompt: 振り返ると、切り替えがしやすい時には何があることが多いですか。
* options:
  A: 前のことに区切りがついている
  B: 次のことの入口が見えている
  C: 間に短い余白がある
  D: 周りの動きが落ち着いている
  E: 自分のペースを少し保てている
* scoringIntent: awareness of transition supports
* riskFlags: low
* reportTags: transition_awareness, rhythm_condition
* recommendationTags: buffer_design, closure_cue
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 次回比較に使える切り替え条件を、やわらかく言語化できる。

Q011:

* dimensionCode: DR
* subdimensionCode: DR_ROUTINE_ANCHOR
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_ROUTINE_ANCHOR
* prompt: 毎日の中で、小さな決まった流れはあなたにとってどんな存在ですか。
* options:
  A: あると一日の土台になりやすい
  B: あると楽だが、崩れても別の形を探す
  C: 決まりすぎると少し窮屈に感じる
  D: 人や予定に合わせて変わることが多い
  E: 意識していないが、実は似た流れがある
* scoringIntent: baseline routine-anchor reliance
* riskFlags: low
* reportTags: routine_anchor, daily_structure
* recommendationTags: anchor_design, flexible_routine
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: ルーティンへの依存度と柔軟さを、良し悪しなしで拾える。

Q012:

* dimensionCode: DR
* subdimensionCode: DR_ROUTINE_ANCHOR
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_ROUTINE_ANCHOR
* prompt: 忙しい日が続くと、いつもの小さな流れはどうなりやすいですか。
* options:
  A: 逆にいつもの流れを頼りにする
  B: 短くした形で残そうとする
  C: いったん崩れて、あとで戻す
  D: その場の予定に合わせて変えていく
  E: 崩れたことに気づくのが少し後になる
* scoringIntent: routine stability under load
* riskFlags: low
* reportTags: routine_pressure, load_response
* recommendationTags: minimum_anchor, routine_rebuild
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 忙しさの中で残る支えと崩れ方を自然に見られる。

Q013:

* dimensionCode: DR
* subdimensionCode: DR_ROUTINE_ANCHOR
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: DR_ROUTINE_ANCHOR
* prompt: 誰かと過ごす時間が多い日は、自分の小さな流れはどうなりやすいですか。
* options:
  A: 相手に合わせながらも少し残す
  B: 相手の流れに入りやすい
  C: 後で一人の時間に取り戻す
  D: その日はあまり気にしない
  E: 自分の流れが崩れると落ち着きにくい
* scoringIntent: routine change in shared time
* riskFlags: relationship directive avoid
* reportTags: shared_rhythm, anchor_context
* recommendationTags: personal_buffer, routine_boundary
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 生活の共有場面で、個人の支えがどう変わるかを測れる。

Q014:

* dimensionCode: DR
* subdimensionCode: DR_ROUTINE_ANCHOR
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: DR_ROUTINE_ANCHOR
* prompt: いつもの流れが崩れたあと、戻す時はどれに近いですか。
* options:
  A: 一番小さい習慣だけ戻す
  B: 次の日から自然に戻るのを待つ
  C: 時間や場所を変えて作り直す
  D: 誰かとの予定をきっかけに戻す
  E: いったん別の流れとして組み直す
* scoringIntent: rebuilding anchor after disruption
* riskFlags: low
* reportTags: routine_recovery, anchor_rebuild
* recommendationTags: small_anchor, reset_routine
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: ルーティン回復を硬い継続ではなく、戻り方の差として扱える。

Q015:

* dimensionCode: DR
* subdimensionCode: DR_ROUTINE_ANCHOR
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: DR_ROUTINE_ANCHOR
* prompt: 振り返ると、自分を支えている小さな流れはどれに近いですか。
* options:
  A: 朝や夜の決まった動き
  B: 飲み物や場所などの小さな合図
  C: 書く、並べる、片づけるような手順
  D: 誰かとの短いやりとり
  E: はっきり決めていない余白の時間
* scoringIntent: recognition of routine anchors
* riskFlags: low
* reportTags: anchor_awareness, daily_support
* recommendationTags: anchor_prompt, rhythm_marker
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 支えになっている日常要素を、押しつけずに見つけられる。

Q016:

* dimensionCode: CL
* subdimensionCode: CL_OPTION_LOAD
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_OPTION_LOAD
* prompt: 選択肢がいくつもある時、あなたはどんな状態になりやすいですか。
* options:
  A: まず大きく分けると考えやすい
  B: それぞれ気になって決めるまで時間がかかる
  C: 直感で一つ選んでから確かめる
  D: 誰かの意見を聞くと整理しやすい
  E: いったん置くと見え方が変わる
* scoringIntent: baseline option-load response
* riskFlags: low
* reportTags: option_load, clarity_pattern
* recommendationTags: choice_narrowing, decision_pause
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 選択肢の多さへの反応を、判断力の評価にせず把握できる。

Q017:

* dimensionCode: CL
* subdimensionCode: CL_OPTION_LOAD
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_OPTION_LOAD
* prompt: 早めに選ばないといけない時、選択肢の見え方はどうなりやすいですか。
* options:
  A: 条件を一つ決めると選びやすい
  B: 急ぐほどどれも気になってくる
  C: まず無理の少ないものを選ぶ
  D: 誰かに確認してから進めたくなる
  E: あとで変えられるかを考える
* scoringIntent: option load under urgency
* riskFlags: low
* reportTags: urgency_choice, clarity_pressure
* recommendationTags: criteria_prompt, reversible_choice
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 急ぎの選択で何を手がかりにするかを見られる。

Q018:

* dimensionCode: CL
* subdimensionCode: CL_OPTION_LOAD
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: CL_OPTION_LOAD
* prompt: 周りからいろいろな意見が入る時、あなたの選び方はどうなりやすいですか。
* options:
  A: 参考にしつつ、自分の条件に戻す
  B: 意見が増えるほど迷いやすい
  C: 一番強く言われたものが気になりやすい
  D: いったん一人で考える時間がほしい
  E: 誰の意見かによって重みが変わる
* scoringIntent: social input effect on option load
* riskFlags: relationship/work directive avoid
* reportTags: social_input, choice_context
* recommendationTags: input_filter, quiet_review
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 他者意見の影響を、従うべきかではなく選択状態として扱える。

Q019:

* dimensionCode: CL
* subdimensionCode: CL_OPTION_LOAD
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_OPTION_LOAD
* prompt: 選択肢が多くて止まったあと、整理し直す時はどれに近いですか。
* options:
  A: まず選ばないものを外す
  B: 今いちばん大事な条件を一つ置く
  C: 紙やメモに出すと見えやすい
  D: 少し時間をあけて見直す
  E: 誰かに話して言葉にする
* scoringIntent: recovery from option overload
* riskFlags: low
* reportTags: choice_recovery, clarity_rebuild
* recommendationTags: exclude_options, memo_sort
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 迷いから戻る具体的な整理手段を拾える。

Q020:

* dimensionCode: CL
* subdimensionCode: CL_OPTION_LOAD
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: CL_OPTION_LOAD
* prompt: 振り返ると、選択肢が多い時に助けになるものはどれですか。
* options:
  A: 比べる軸が少ないこと
  B: 時間に少し余裕があること
  C: 選んだあとに直せる余地があること
  D: 信頼できる人に話せること
  E: 自分が何を避けたいか見えていること
* scoringIntent: awareness of option-load supports
* riskFlags: low
* reportTags: clarity_support, option_awareness
* recommendationTags: decision_aid, revisit_prompt
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 選択時の支えを後から比較可能な形で言語化できる。

Q021:

* dimensionCode: CL
* subdimensionCode: CL_CRITERIA
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_CRITERIA
* prompt: 何かを選ぶ時、あなたは何を手がかりにしやすいですか。
* options:
  A: 今の自分に無理が少ないこと
  B: 後で納得しやすいこと
  C: 周りとの流れが合うこと
  D: 早く動き出せること
  E: 長く続けやすそうなこと
* scoringIntent: baseline choice criteria
* riskFlags: low
* reportTags: criteria_style, decision_basis
* recommendationTags: criteria_map, choice_filter
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 判断基準の種類を、価値づけせずに自然な選択肢で拾える。

Q022:

* dimensionCode: CL
* subdimensionCode: CL_CRITERIA
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_CRITERIA
* prompt: 情報が足りないまま選ぶ必要がある時、どれを手がかりにしやすいですか。
* options:
  A: 今わかっている範囲で一番小さい選択
  B: 後で変えやすい選択
  C: 信頼できる人の見方
  D: 自分の負担が増えにくい選択
  E: まず試せる形にすること
* scoringIntent: criteria stability under uncertainty
* riskFlags: low
* reportTags: uncertainty_choice, criteria_pressure
* recommendationTags: trial_step, reversible_option
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 不確かな場面での判断軸を、リスク判断ではなく状態把握にできる。

Q023:

* dimensionCode: CL
* subdimensionCode: CL_CRITERIA
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: CL_CRITERIA
* prompt: 自分の考えと周りの見方が少し違う時、選ぶ基準はどうなりやすいですか。
* options:
  A: 自分の基準を確かめ直す
  B: 周りの見方も入れて考え直す
  C: その場では周りに合わせやすい
  D: すぐ決めずに距離を置く
  E: どちらも残して小さく試す
* scoringIntent: criteria shift with social input
* riskFlags: relationship/work directive avoid
* reportTags: criteria_context, social_clarity
* recommendationTags: perspective_sort, small_trial
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 周囲との違いを対立ではなく、基準の揺れとして扱える。

Q024:

* dimensionCode: CL
* subdimensionCode: CL_CRITERIA
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_CRITERIA
* prompt: 何を基準に選べばいいか見えにくくなった時、戻し方はどれに近いですか。
* options:
  A: 今いちばん困っていることから考える
  B: 選んだ後の自分を想像してみる
  C: 優先しないことを先に決める
  D: 一度、人の意見から離れて考える
  E: 期限や負担など現実の条件に戻す
* scoringIntent: rebuilding criteria after confusion
* riskFlags: low
* reportTags: criteria_recovery, clarity_rebuild
* recommendationTags: priority_reset, condition_sort
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 判断基準を取り戻す手順の違いを、具体的に見られる。

Q025:

* dimensionCode: CL
* subdimensionCode: CL_CRITERIA
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: CL_CRITERIA
* prompt: あとから「自分らしく選べた」と感じる時、何が残っていることが多いですか。
* options:
  A: 無理をしすぎなかった感じ
  B: 迷っても理由を言葉にできる感じ
  C: 周りと自分の両方を見られた感じ
  D: 小さくても動けた感じ
  E: 次につながる余地がある感じ
* scoringIntent: reflective criteria recognition
* riskFlags: fixed identity language avoid
* reportTags: decision_reflection, criteria_awareness
* recommendationTags: reflective_prompt, choice_review
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 「自分らしさ」を決めつけず、選択後の納得感として扱える。

Q026:

* dimensionCode: CL
* subdimensionCode: CL_EXPLANATION_PRESSURE
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_EXPLANATION_PRESSURE
* prompt: 自分の選び方を説明する場面では、どんな状態になりやすいですか。
* options:
  A: 理由を整理すると自分でも見えやすくなる
  B: 説明しようとすると迷いが増える
  C: 相手に伝わる形を先に考える
  D: 短く言えれば十分だと感じる
  E: まだ言葉にならない部分が残りやすい
* scoringIntent: baseline response to explanation pressure
* riskFlags: low
* reportTags: explanation_pressure, clarity_expression
* recommendationTags: reason_notes, simple_explanation
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 説明への反応を、話し上手かどうかではなく見通しの状態として拾える。

Q027:

* dimensionCode: CL
* subdimensionCode: CL_EXPLANATION_PRESSURE
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_EXPLANATION_PRESSURE
* prompt: まだ迷いがあるのに理由を聞かれた時、あなたはどうなりやすいですか。
* options:
  A: 今言える範囲だけ伝える
  B: うまく言おうとして考え込む
  C: 相手が納得しそうな言い方を探す
  D: 少し時間をもらいたくなる
  E: 話しながら自分の考えを確かめる
* scoringIntent: explanation under uncertainty
* riskFlags: relationship/work directive avoid
* reportTags: uncertain_explanation, pressure_clarity
* recommendationTags: time_buffer, partial_reason
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 未整理の状態で説明を求められた時の自然な反応を見られる。

Q028:

* dimensionCode: CL
* subdimensionCode: CL_EXPLANATION_PRESSURE
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: CL_EXPLANATION_PRESSURE
* prompt: 相手によって、説明のしやすさはどう変わりやすいですか。
* options:
  A: 近い人ほど言葉にしやすい
  B: 近い人ほど気をつかって言いにくい
  C: 距離がある人の方が短く伝えやすい
  D: 立場が上の人には慎重になりやすい
  E: 相手よりも場の空気で変わりやすい
* scoringIntent: social variation in explanation pressure
* riskFlags: relationship/work authority avoid
* reportTags: explanation_context, social_clarity
* recommendationTags: audience_filter, wording_buffer
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 説明の負荷を相手の種類で見つつ、行動指示にはしない。

Q029:

* dimensionCode: CL
* subdimensionCode: CL_EXPLANATION_PRESSURE
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: CL_EXPLANATION_PRESSURE
* prompt: 説明したあとに少し疲れが残る時、戻りやすい形はどれですか。
* options:
  A: 自分の中で言い直して整理する
  B: 別のことをして気持ちを切り替える
  C: 相手に伝わった部分を確認する
  D: 一人の時間で落ち着く
  E: 次は短く言える形を考える
* scoringIntent: recovery after explanation pressure
* riskFlags: low
* reportTags: explanation_recovery, clarity_aftereffect
* recommendationTags: debrief_note, quiet_reset
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 説明後の余韻と戻り方を、対人評価なしで測れる。

Q030:

* dimensionCode: CL
* subdimensionCode: CL_EXPLANATION_PRESSURE
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: CL_EXPLANATION_PRESSURE
* prompt: 振り返ると、説明しやすかった時には何があったことが多いですか。
* options:
  A: 自分の中で理由が短くまとまっていた
  B: 相手が急がせない雰囲気だった
  C: 全部ではなく一部だけ話せばよかった
  D: 先に考える時間があった
  E: 完成した答えでなくてもよかった
* scoringIntent: awareness of explanation supports
* riskFlags: low
* reportTags: explanation_awareness, clarity_condition
* recommendationTags: prep_time, simple_reason
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 説明のしやすさを支える条件を、次回比較に使える形で拾える。

Q031:

* dimensionCode: AR
* subdimensionCode: AR_STARTABILITY
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: AR_STARTABILITY
* prompt: 何かを始める時、あなたの入り方はどれに近いですか。
* options:
  A: 小さな入口が見えると始めやすい
  B: 全体が見えてから始めたい
  C: 気持ちが乗るまで少し時間がいる
  D: 誰かと一緒だと始めやすい
  E: 先に環境を整えると動きやすい
* scoringIntent: baseline startability
* riskFlags: productivity moralizing avoid
* reportTags: action_start, start_condition
* recommendationTags: small_step, environment_setup
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 行動の入り口を、能力評価ではなく条件差として測れる。

Q032:

* dimensionCode: AR
* subdimensionCode: AR_STARTABILITY
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: AR_STARTABILITY
* prompt: まだ準備が十分でない時に始めるなら、どの形が近いですか。
* options:
  A: まず試す範囲を小さくする
  B: 足りない部分を確認してから動く
  C: 誰かに一度見てもらうと動きやすい
  D: 期限が近いと動き出せる
  E: 途中で直せる形なら始めやすい
* scoringIntent: starting under incomplete conditions
* riskFlags: low
* reportTags: incomplete_start, action_pressure
* recommendationTags: trial_scope, repairable_step
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 準備不足の場面で、始める条件を自然に見分けられる。

Q033:

* dimensionCode: AR
* subdimensionCode: AR_STARTABILITY
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: AR_STARTABILITY
* prompt: 人に見られている、または期待されている時、始め方はどう変わりやすいですか。
* options:
  A: 背中を押されて始めやすい
  B: かえって慎重になりやすい
  C: 相手の期待を先に考えてしまう
  D: 一人で少し進めてから見せたい
  E: 場の流れに乗ると始めやすい
* scoringIntent: social context effect on startability
* riskFlags: work/performance ranking avoid
* reportTags: observed_start, social_action
* recommendationTags: private_trial, expectation_buffer
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 見られる場面での動き出しを、評価ではなく状態として扱える。

Q034:

* dimensionCode: AR
* subdimensionCode: AR_STARTABILITY
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: AR_STARTABILITY
* prompt: なかなか始められなかったあと、動き出すきっかけはどれに近いですか。
* options:
  A: ほんの少しだけやると決める
  B: 場所や道具を変える
  C: 誰かに一言だけ共有する
  D: 時間を区切って始める
  E: やる意味をもう一度思い出す
* scoringIntent: finding a first step after delay
* riskFlags: productivity shame avoid
* reportTags: start_recovery, action_restart
* recommendationTags: micro_action, time_box
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 始められなかった後の回復手段を、責めずに拾える。

Q035:

* dimensionCode: AR
* subdimensionCode: AR_STARTABILITY
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: AR_STARTABILITY
* prompt: 振り返ると、始めやすかった時に共通していたものはどれですか。
* options:
  A: 最初の一歩が小さかった
  B: 使うものがすぐ近くにあった
  C: 完成形を求められていなかった
  D: 誰かとの軽い約束があった
  E: 自分の中で目的が見えていた
* scoringIntent: awareness of startability supports
* riskFlags: low
* reportTags: action_awareness, start_support
* recommendationTags: setup_cue, low_pressure_start
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 動き出しの支えを再利用可能な形で言語化できる。

Q036:

* dimensionCode: AR
* subdimensionCode: AR_CONTINUATION
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: AR_CONTINUATION
* prompt: 一度始めたことを続ける時、あなたはどんな形になりやすいですか。
* options:
  A: 流れに乗るとそのまま続きやすい
  B: 途中で意味を確かめたくなる
  C: 小さな区切りがあると続けやすい
  D: 誰かとの関わりがあると続きやすい
  E: 気分や余力に合わせて波が出やすい
* scoringIntent: baseline continuation pattern
* riskFlags: productivity moralizing avoid
* reportTags: continuation_style, action_sustain
* recommendationTags: progress_marker, social_anchor
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 続け方の違いを、根性や成果の話にせず把握できる。

Q037:

* dimensionCode: AR
* subdimensionCode: AR_CONTINUATION
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: AR_CONTINUATION
* prompt: 思ったより進みがゆっくりな時、続け方はどうなりやすいですか。
* options:
  A: 小さい進みを確認すると続けやすい
  B: 先が長く見えて手が止まりやすい
  C: いったんやり方を変えてみる
  D: 誰かに途中経過を話すと続きやすい
  E: 少し離れてから戻る方が続けやすい
* scoringIntent: continuation under slow progress
* riskFlags: performance ranking avoid
* reportTags: slow_progress, sustain_pressure
* recommendationTags: progress_check, method_shift
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 進みが遅い時の持続条件を、成果評価なしで見られる。

Q038:

* dimensionCode: AR
* subdimensionCode: AR_CONTINUATION
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: AR_CONTINUATION
* prompt: 途中で人から反応や感想をもらうと、続け方はどう変わりやすいですか。
* options:
  A: 反応があると続ける力になりやすい
  B: 気になって手が止まりやすい
  C: 取り入れる部分を選びたくなる
  D: 少し時間を置いてから戻りたい
  E: 誰の反応かで受け取り方が変わる
* scoringIntent: feedback effect on continuation
* riskFlags: work/career authority avoid
* reportTags: feedback_context, continuation_social
* recommendationTags: feedback_filter, return_buffer
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 反応を受けた後の持続変化を、評価や助言にせず扱える。

Q039:

* dimensionCode: AR
* subdimensionCode: AR_CONTINUATION
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: AR_CONTINUATION
* prompt: 途中で流れが切れたあと、続きに戻る時はどれに近いですか。
* options:
  A: 前回の続きが見えると戻りやすい
  B: 少しだけやる形にすると戻りやすい
  C: 予定に入れ直すと戻りやすい
  D: 誰かと共有すると戻りやすい
  E: なぜ続けたいか思い出すと戻りやすい
* scoringIntent: resuming continuation after interruption
* riskFlags: low
* reportTags: continuation_recovery, action_return
* recommendationTags: restart_marker, schedule_reentry
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 継続が切れた後の戻り方を、失敗扱いせずに拾える。

Q040:

* dimensionCode: AR
* subdimensionCode: AR_CONTINUATION
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: AR_CONTINUATION
* prompt: 振り返ると、続けやすかった時には何があったことが多いですか。
* options:
  A: 進み具合が少し見えていた
  B: 完成までの形が細かく分かれていた
  C: 自分のペースで調整できた
  D: 誰かとの軽いつながりがあった
  E: 途中で休んでも戻れる感じがあった
* scoringIntent: awareness of continuation supports
* riskFlags: low
* reportTags: sustain_awareness, continuation_support
* recommendationTags: progress_marker, flexible_pace
* publicPrivateBoundary: private-only
* whyThisQuestionWorks: 続けやすさを支える条件を、次回設計や比較に使える形で拾える。

Batch self-check:

* exactly 40 questions: yes
* all 8 required subdimensions covered: yes
* 5 variants per subdimension: yes
* all questions have 5 scenario-based options: yes
* no agreement-scale options: yes
* no prohibited wording: yes
* no clinical framing: yes
* no relationship directive: yes
* no work/career authority: yes
* no invasive personal data: yes
* 24Q candidates marked: yes
* 72Q candidates marked: yes
* ready for methodology review: yes

---

## Batch 2 — Q041–Q080

YORISOU_120Q_JAPANESE_MASTER_QUESTION_BANK_BATCH_2_Q041_Q080_COMPLETE

Batch scope:

covered question IDs: Q041–Q080

covered dimensions: AR, EL, SD, RP

covered subdimensions: AR_RESTART, EL_INNER_WEIGHT, EL_TENSION, EL_AFTER_EFFECT, SD_REPLY_PRESSURE, SD_ATMOSPHERE_READING, SD_RETURNABLE_DISTANCE, RP_RESET_METHOD

total questions generated: 40

architecture status: 120Q master-first draft, not implementation-approved

Global notes:

tone: natural, restrained, mobile-readable Japanese

answer model: 5 scenario-based current-state choices per question

safety boundaries: non-clinical, non-directive, non-invasive

boundary metadata model: answerData / resultUse / shareUse / questionSurface

24Q eligibility approach: Variant 1 marked candidate

72Q eligibility approach: Variant 1 + Variant 2 + Variant 4 marked candidate

Question bank:

Q041:

dimensionCode: AR

subdimensionCode: AR_RESTART

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: AR_RESTART

prompt: 一度止まったことをまた始める時、あなたはどんな入り方になりやすいですか。

options:
A: 途中から少しだけ再開すると戻りやすい
B: もう一度、最初の形を見直してから戻る
C: きっかけが来るまで少し置いておく
D: 誰かに軽く共有すると戻りやすい
E: 今の自分に合う形へ小さく変えて戻る

scoringIntent: baseline restart pattern after stopping

riskFlags: low; productivity shame avoid

reportTags: restart_pattern, action_return

recommendationTags: small_reentry, restart_cue

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 再開のしやすさを、意志の強さではなく戻り方の違いとして拾える。

Q042:

dimensionCode: AR

subdimensionCode: AR_RESTART

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: AR_RESTART

prompt: 間が空いたり、途中で迷ったりしたあとに再開するなら、どれが近いですか。

options:
A: できる部分だけに範囲をしぼる
B: どこで止まったかを確かめる
C: いったん別の入り口を探す
D: 締切や区切りが見えると戻りやすい
E: 前と同じ形にこだわらず始める

scoringIntent: restart after delay or ambiguity

riskFlags: low

reportTags: delayed_restart, restart_pressure

recommendationTags: restart_scope, entry_shift

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 遅れや迷いの後の再開条件を、責めずに区別できる。

Q043:

dimensionCode: AR

subdimensionCode: AR_RESTART

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: AR_RESTART

prompt: 止まっていたことを周りも知っている時、再開の感じはどうなりやすいですか。

options:
A: 知られている方が戻るきっかけになる
B: 見られている感じがあり、少し慎重になる
C: まず一人で少し進めてから共有したい
D: 短く説明できると戻りやすい
E: 周りの反応より、自分の間合いを優先したい

scoringIntent: restart when pause is socially visible

riskFlags: relationship/work directive avoid

reportTags: social_restart, visible_pause

recommendationTags: private_reentry, light_share

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 周囲の目がある再開場面を、評価ではなく状態変化として扱える。

Q044:

dimensionCode: AR

subdimensionCode: AR_RESTART

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: AR_RESTART

prompt: 再開する時、ちょうどよい大きさを選ぶならどれに近いですか。

options:
A: まず一分だけ触れるくらいにする
B: 一つの手順だけ進める
C: 前より軽い形に変える
D: 誰かに見せる前の下書きにする
E: 今日は入口を作るだけにする

scoringIntent: choosing restart scale

riskFlags: low

reportTags: restart_scale, action_adjustment

recommendationTags: micro_restart, draft_step

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 再開の負荷を下げる方法を、具体的なスケール差で測れる。

Q045:

dimensionCode: AR

subdimensionCode: AR_RESTART

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: AR_RESTART

prompt: 振り返ると、再開しやすい時にあるものはどれですか。

options:
A: 戻る場所がはっきりしている
B: 小さく始めてもよい空気がある
C: 前と同じ形でなくてもよいと思える
D: 少しだけ見てくれる人がいる
E: 再開したあとの一歩が見えている

scoringIntent: noticing personal restart cues

riskFlags: low

reportTags: restart_awareness, return_condition

recommendationTags: restart_marker, next_step

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 再開の合図を自己観察でき、再訪時の比較にも使える。

Q046:

dimensionCode: EL

subdimensionCode: EL_INNER_WEIGHT

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_INNER_WEIGHT

prompt: 日々の中で、内側に重さを感じる時はどんな形に近いですか。

options:
A: やることが多いと内側にたまりやすい
B: 理由がはっきりしないまま重くなることがある
C: 人に合わせたあとに重さが出やすい
D: 少し静かな時間があると軽くなりやすい
E: 重さに気づくまで少し時間がかかる

scoringIntent: baseline inner weight pattern

riskFlags: clinical framing avoid

reportTags: inner_weight, emotional_load

recommendationTags: quiet_space, load_notice

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 内側の重さを状態として扱い、医療的な意味づけを避けられる。

Q047:

dimensionCode: EL

subdimensionCode: EL_INNER_WEIGHT

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_INNER_WEIGHT

prompt: 用事や考えることが重なった時、内側の重さはどう出やすいですか。

options:
A: 先に何かを減らしたくなる
B: どれから触れるか決めにくくなる
C: 表では動けても内側に残りやすい
D: 一つ終わると少し軽くなる
E: 全体を見直すまで重さが続きやすい

scoringIntent: inner weight during stacked demands

riskFlags: clinical framing avoid

reportTags: stacked_load, inner_weight_pressure

recommendationTags: load_sort, reduce_one

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 重なりによる内側の変化を、能力評価にせず把握できる。

Q048:

dimensionCode: EL

subdimensionCode: EL_INNER_WEIGHT

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: EL_INNER_WEIGHT

prompt: 人からの期待を感じる場面では、内側の重さはどう変わりやすいですか。

options:
A: 期待に応えようとして重くなりやすい
B: 期待が見える方が動きやすいこともある
C: 期待の中身があいまいだと重くなりやすい
D: 自分の範囲が見えると軽くなりやすい
E: その場では気づかず、あとで重さが出る

scoringIntent: inner weight around others’ expectations

riskFlags: relationship/work directive avoid

reportTags: expectation_load, social_weight

recommendationTags: scope_notice, expectation_sort

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 期待を受ける場面での重さを、対人助言にせず測れる。

Q049:

dimensionCode: EL

subdimensionCode: EL_INNER_WEIGHT

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_INNER_WEIGHT

prompt: 内側に重さが残ったあと、少し扱いやすくなる形はどれですか。

options:
A: 何が重いのか一つだけ言葉にする
B: その場から少し離れる
C: 小さな用事を終えて区切りを作る
D: 誰かに短く話して外に出す
E: すぐ軽くしようとせず、少し持っておく

scoringIntent: lightening or carrying inner weight after pressure

riskFlags: clinical/treatment framing avoid

reportTags: weight_adjustment, emotional_recovery

recommendationTags: name_one, quiet_distance

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 重さの扱い方を複数の自然なパターンとして捉えられる。

Q050:

dimensionCode: EL

subdimensionCode: EL_INNER_WEIGHT

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: EL_INNER_WEIGHT

prompt: 振り返ると、内側の重さに気づきやすいのはどんな時ですか。

options:
A: 予定が終わって静かになった時
B: いつもの動きが少し重く感じた時
C: 人と離れて一人になった時
D: 書いたり話したりして外に出した時
E: 何を後回しにしているか見えた時

scoringIntent: noticing when inner weight appears

riskFlags: clinical framing avoid

reportTags: weight_awareness, state_notice

recommendationTags: reflection_time, externalize_note

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 内側の重さに気づく場面を、非侵襲的に言語化できる。

Q051:

dimensionCode: EL

subdimensionCode: EL_TENSION

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_TENSION

prompt: 日々の中で、内側に張りが出る時はどれに近いですか。

options:
A: 予定や役割が重なると張りやすい
B: 人の反応を読む時に張りやすい
C: 早く決める場面で張りやすい
D: 表には出さず内側に残りやすい
E: 張りに気づく前に動き続けていることがある

scoringIntent: baseline inner tension pattern

riskFlags: clinical framing avoid

reportTags: inner_tension, emotional_load

recommendationTags: tension_notice, pace_check

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 張りの出やすい場面を、医療的ではない日常語で拾える。

Q052:

dimensionCode: EL

subdimensionCode: EL_TENSION

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_TENSION

prompt: 急ぎの用事や意見の違いがある時、内側の張りはどうなりやすいですか。

options:
A: 先に場を整えようとして張りやすい
B: 早く結論を出そうとして張りやすい
C: 相手の反応を見ながら張りが増えやすい
D: 一度止まると少し張りがゆるみやすい
E: 終わったあとに張りが残りやすい

scoringIntent: tension under urgency or conflict

riskFlags: relationship/work directive avoid

reportTags: tension_pressure, conflict_context

recommendationTags: pause_space, conclusion_buffer

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 急ぎや意見差による張りを、対処指示なしで把握できる。

Q053:

dimensionCode: EL

subdimensionCode: EL_TENSION

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: EL_TENSION

prompt: 周りの空気を読もうとする時、内側の張りはどう変わりやすいですか。

options:
A: 空気が読めるほど動きやすくなる
B: 読もうとするほど張りが増えやすい
C: 誰の気配を読むかで変わりやすい
D: 読んだあと、一人で整える時間がほしい
E: 読みすぎているか後から気づくことがある

scoringIntent: tension when reading others

riskFlags: partner inference avoid

reportTags: atmosphere_tension, social_reading

recommendationTags: reading_boundary, quiet_reset

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 空気読みと張りの関係を、相手の本意の推測にせず扱える。

Q054:

dimensionCode: EL

subdimensionCode: EL_TENSION

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_TENSION

prompt: 内側の張りが出たあと、少し整いやすい形はどれですか。

options:
A: 短く息をつける間がある
B: やることを一つ減らす
C: 場所を少し変える
D: 誰かに短く確認する
E: 張りが残ったままでも進める範囲にする

scoringIntent: how tension settles or remains

riskFlags: clinical/treatment framing avoid

reportTags: tension_adjustment, state_settling

recommendationTags: space_shift, reduce_one

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 張りを消す前提ではなく、扱いやすくなる条件として測れる。

Q055:

dimensionCode: EL

subdimensionCode: EL_TENSION

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: EL_TENSION

prompt: 振り返ると、張りが強くなる前に出やすい小さな合図はどれですか。

options:
A: 返事や判断を急ぎたくなる
B: 周りの様子がいつもより気になる
C: 体より先に頭の中が忙しくなる
D: 一つのことを何度も考え直す
E: 余白のある時間を後回しにする

scoringIntent: noticing tension before it builds

riskFlags: clinical framing avoid

reportTags: tension_signal, early_notice

recommendationTags: early_marker, pace_notice

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 張りの前触れを日常的な合図として扱い、深刻化表現を避けられる。

Q056:

dimensionCode: EL

subdimensionCode: EL_AFTER_EFFECT

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_AFTER_EFFECT

prompt: 何かが終わったあと、その余韻はあなたの中にどう残りやすいですか。

options:
A: すぐ次に移れることが多い
B: 少し時間を置いてから切り替わる
C: 会話や出来事の一部が後まで残る
D: 一人になると余韻に気づきやすい
E: 何が残っているか言葉にしたくなる

scoringIntent: baseline lingering after-effect

riskFlags: clinical framing avoid

reportTags: after_effect, emotional_residue

recommendationTags: transition_space, reflection_note

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 出来事後の残り方を、重い意味づけなしに測れる。

Q057:

dimensionCode: EL

subdimensionCode: EL_AFTER_EFFECT

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_AFTER_EFFECT

prompt: 密度の高い予定や難しいやりとりのあと、どんな残り方になりやすいですか。

options:
A: すぐには切り替わらず、少し尾を引く
B: 終わった安心感の方が大きい
C: あとから細かい場面を思い返す
D: 別の用事に入ると自然に薄まる
E: 一度整理しないと次に入りにくい

scoringIntent: after-effect following dense or difficult moments

riskFlags: clinical framing avoid

reportTags: dense_event_aftereffect, emotional_load

recommendationTags: debrief_space, task_shift

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 密度の高い場面後の余韻を、自然な複数パターンで拾える。

Q058:

dimensionCode: EL

subdimensionCode: EL_AFTER_EFFECT

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: EL_AFTER_EFFECT

prompt: 人との会話のあと、残りやすいものはどれに近いですか。

options:
A: 話せたことで軽くなる感じ
B: 言えなかったことが少し残る感じ
C: 相手の反応を後から思い返す感じ
D: 会話の内容より場の空気が残る感じ
E: 何も残さず次へ移れる感じ

scoringIntent: after-effect after conversations

riskFlags: partner inference/reply advice avoid

reportTags: conversation_aftereffect, social_residue

recommendationTags: post_conversation_space, wording_note

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 会話後の残り方を、相手の意図推測ではなく自分側の余韻として扱える。

Q059:

dimensionCode: EL

subdimensionCode: EL_AFTER_EFFECT

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: EL_AFTER_EFFECT

prompt: 何かの余韻が残ったあと、少し整いやすい形はどれですか。

options:
A: 短く書き出して外に置く
B: 別の小さな行動に移る
C: 静かな時間で自然に薄まるのを待つ
D: 誰かに短く話して区切る
E: そのまま持ちながら、次を軽めにする

scoringIntent: clearing or carrying residue

riskFlags: clinical/treatment framing avoid

reportTags: aftereffect_adjustment, residue_handling

recommendationTags: write_out, light_next_step

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 余韻を消す前提にせず、残し方と整え方の違いを測れる。

Q060:

dimensionCode: EL

subdimensionCode: EL_AFTER_EFFECT

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: EL_AFTER_EFFECT

prompt: 振り返ると、あとまで残りやすい出来事にはどんな特徴がありますか。

options:
A: 言葉にしきれない部分があった
B: 人の反応を何度も思い返した
C: 急に切り替える必要があった
D: 自分の範囲を少し越えていた
E: 大事にしたいものが含まれていた

scoringIntent: noticing what leaves an after-effect

riskFlags: clinical framing avoid

reportTags: aftereffect_awareness, residue_trigger

recommendationTags: boundary_notice, reflection_marker

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 残りやすい出来事の性質を、深掘りしすぎず把握できる。

Q061:

dimensionCode: SD

subdimensionCode: SD_REPLY_PRESSURE

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_REPLY_PRESSURE

prompt: 連絡に返す場面では、あなたはどんな状態になりやすいですか。

options:
A: すぐ短く返す方が楽なことが多い
B: 内容を考えてから返したくなる
C: 相手との距離で返し方が変わる
D: いったん置いてから返す方が整いやすい
E: 返す前に気持ちの余白がほしい

scoringIntent: baseline reply-pressure pattern

riskFlags: no reply/no-reply advice

reportTags: reply_pressure, social_distance

recommendationTags: reply_buffer, short_response

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 返信行動を指示せず、返す場面の内側の距離感を測れる。

Q062:

dimensionCode: SD

subdimensionCode: SD_REPLY_PRESSURE

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_REPLY_PRESSURE

prompt: 余裕が少ない時に連絡が来たら、どんな形になりやすいですか。

options:
A: まず短く返して区切りを作る
B: 返す内容を考えるまで置きたくなる
C: 返せる範囲だけ返したくなる
D: 相手を待たせている感じが気になりやすい
E: 落ち着いた時間に返したくなる

scoringIntent: reply pressure when capacity is low

riskFlags: no reply/no-reply advice; relationship directive avoid

reportTags: reply_pressure_low_margin, social_load

recommendationTags: reply_scope, timing_buffer

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 余裕が少ない時の返信圧を、行動の正解なしで把握できる。

Q063:

dimensionCode: SD

subdimensionCode: SD_REPLY_PRESSURE

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: SD_REPLY_PRESSURE

prompt: 連絡の相手によって、返す時の感じはどう変わりやすいですか。

options:
A: 近い人ほど早く返したくなる
B: 近い人ほど言葉を選びたくなる
C: 距離がある人には短く返しやすい
D: 役割がある相手には慎重になりやすい
E: 相手より内容の重さで変わりやすい

scoringIntent: reply pressure by relationship type

riskFlags: no partner inference; no reply advice

reportTags: reply_context, social_distance

recommendationTags: wording_buffer, relationship_context

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 相手別の圧を扱うが、関係の判断や返信指示には踏み込まない。

Q064:

dimensionCode: SD

subdimensionCode: SD_REPLY_PRESSURE

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_REPLY_PRESSURE

prompt: 返すまでに時間が空いたあと、整えやすい形はどれですか。

options:
A: 短い一文から始める
B: まず内容だけ下書きする
C: 返す範囲を小さくする
D: 次に同じ形になりにくい置き場所を作る
E: 時間が空いたことを重くしすぎない形にする

scoringIntent: resetting after delayed reply

riskFlags: no reply/no-reply advice

reportTags: delayed_reply_adjustment, social_reentry

recommendationTags: draft_reply, reply_scope

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 遅れた後の戻り方を、相手への対応指示ではなく自己調整として測れる。

Q065:

dimensionCode: SD

subdimensionCode: SD_REPLY_PRESSURE

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: SD_REPLY_PRESSURE

prompt: 振り返ると、返す時の圧が強くなりやすいのはどんな時ですか。

options:
A: すぐ返す空気を感じる時
B: 言葉を選ぶ内容の時
C: 相手との距離が近い時
D: 返したあとも続きそうな時
E: 自分の余白が少ない時

scoringIntent: noticing reply-pressure triggers

riskFlags: no reply advice; partner inference avoid

reportTags: reply_trigger, social_pressure_awareness

recommendationTags: reply_notice, boundary_cue

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 返信圧の出どころを、非侵襲的に自己観察できる。

Q066:

dimensionCode: SD

subdimensionCode: SD_ATMOSPHERE_READING

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_ATMOSPHERE_READING

prompt: その場の空気や小さな反応を読む時、あなたはどれに近いですか。

options:
A: 自然に読み取りながら動くことが多い
B: 読み取るほど動き方を迷いやすい
C: 必要な分だけ見るようにしている
D: 後から「あれを読んでいた」と気づく
E: 空気より自分の予定を保ちたい

scoringIntent: baseline atmosphere-reading pattern

riskFlags: no partner inference

reportTags: atmosphere_reading, social_distance

recommendationTags: reading_scope, self_pace

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 空気読みを良し悪しにせず、使い方の差として拾える。

Q067:

dimensionCode: SD

subdimensionCode: SD_ATMOSPHERE_READING

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_ATMOSPHERE_READING

prompt: 場の流れがはっきりしない時、あなたはどうなりやすいですか。

options:
A: 少し様子を見てから動く
B: 誰かの反応を手がかりにする
C: 自分から流れを作ろうとする
D: 迷いながらもできる範囲で合わせる
E: 一度距離を置いて見直したくなる

scoringIntent: atmosphere reading under uncertainty

riskFlags: no relationship directive

reportTags: uncertain_atmosphere, social_reading_pressure

recommendationTags: observe_pause, distance_check

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: あいまいな場での読み方を、支配や回避ではなく選択肢として測れる。

Q068:

dimensionCode: SD

subdimensionCode: SD_ATMOSPHERE_READING

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: SD_ATMOSPHERE_READING

prompt: 周りの空気に合わせる時、あなたの動きはどう変わりやすいですか。

options:
A: 声の大きい人に合わせやすい
B: 静かな人の様子も気になりやすい
C: 場全体が落ち着く形を探しやすい
D: 自分の考えを少し後ろに置きやすい
E: 合わせる範囲を決めておきたくなる

scoringIntent: adjustment based on perceived atmosphere

riskFlags: social inference caution

reportTags: atmosphere_adjustment, social_context

recommendationTags: scope_boundary, group_reading

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 空気への合わせ方を細分化し、相手の内面推測にはしない。

Q069:

dimensionCode: SD

subdimensionCode: SD_ATMOSPHERE_READING

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_ATMOSPHERE_READING

prompt: 空気を読みすぎた感じが残ったあと、戻りやすい形はどれですか。

options:
A: 一人で短く整える時間を取る
B: 自分の予定や用事に戻る
C: 何を気にしていたか一つだけ見る
D: 別の人と軽く話して切り替える
E: 次は見る範囲を少し狭くする

scoringIntent: returning after over-reading atmosphere

riskFlags: no therapy framing

reportTags: reading_recovery, social_reset

recommendationTags: reading_limit, self_return

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 読みすぎ後の戻り方を、反省ではなく調整として扱える。

Q070:

dimensionCode: SD

subdimensionCode: SD_ATMOSPHERE_READING

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: SD_ATMOSPHERE_READING

prompt: 振り返ると、空気を読むことが助けになるのはどんな時ですか。

options:
A: 場の流れをつかみたい時
B: 誰かの負担を増やしたくない時
C: 自分の出方を少し調整したい時
D: その場の安全な距離を見たい時
E: 読みすぎない範囲が見えている時

scoringIntent: noticing when reading helps or drains

riskFlags: social inference caution

reportTags: reading_awareness, atmosphere_function

recommendationTags: helpful_reading, reading_scope

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 空気読みが助けになる条件を、過剰に肯定せず整理できる。

Q071:

dimensionCode: SD

subdimensionCode: SD_RETURNABLE_DISTANCE

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_RETURNABLE_DISTANCE

prompt: 人との距離を取る時、あなたにとって戻りやすい距離はどれに近いですか。

options:
A: 少し離れても、短く戻れる距離
B: 一度しっかり離れて整える距離
C: 連絡だけは残しておく距離
D: 相手に気づかれにくい小さな距離
E: 自分の中で区切りが見える距離

scoringIntent: baseline returnable distance pattern

riskFlags: no relationship directive

reportTags: returnable_distance, social_boundary

recommendationTags: distance_scope, return_cue

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 距離を取る行動を関係判断ではなく、戻れる範囲の感覚として測れる。

Q072:

dimensionCode: SD

subdimensionCode: SD_RETURNABLE_DISTANCE

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_RETURNABLE_DISTANCE

prompt: やりとりの中で少し引っかかりがある時、距離の取り方はどうなりやすいですか。

options:
A: その場では近い距離を保とうとする
B: 少し返事や反応をゆっくりにする
C: 一人で考える時間を取りたくなる
D: 何に引っかかったか見てから戻る
E: 距離を変えずに内側だけ少し引く

scoringIntent: distance during discomfort or conflict

riskFlags: no reply/no-reply advice; no relationship directive

reportTags: distance_pressure, relational_friction

recommendationTags: pause_distance, inner_boundary

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 引っかかりの場面でも、関係の結論ではなく距離の調整を測れる。

Q073:

dimensionCode: SD

subdimensionCode: SD_RETURNABLE_DISTANCE

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: SD_RETURNABLE_DISTANCE

prompt: 相手との関係によって、取りやすい距離はどう変わりますか。

options:
A: 近い人ほど距離を取りにくい
B: 近い人ほど短く離れる時間が必要になる
C: 役割がある相手には距離を保ちにくい
D: 距離がある相手には境目を作りやすい
E: 関係より、その時の余白で変わりやすい

scoringIntent: distance across close, casual, and role-based ties

riskFlags: no relationship advice; no work authority

reportTags: distance_context, social_boundary

recommendationTags: role_distance, margin_check

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 関係種別による距離感を扱いながら、行動指示や相手評価を避けられる。

Q074:

dimensionCode: SD

subdimensionCode: SD_RETURNABLE_DISTANCE

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: SD_RETURNABLE_DISTANCE

prompt: 少し距離を取ったあと、戻りやすい形はどれですか。

options:
A: 短い言葉で再開する
B: いつもの話題から戻る
C: 自分の中で区切りがついてから戻る
D: 相手の反応を見すぎず戻る
E: 戻る前に距離の理由を自分で整理する

scoringIntent: returning after pulling back

riskFlags: no contact advice; no relationship directive

reportTags: distance_return, social_reentry

recommendationTags: light_reentry, boundary_review

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 距離を取った後の戻り方を、連絡指示ではなく内側の整い方として扱える。

Q075:

dimensionCode: SD

subdimensionCode: SD_RETURNABLE_DISTANCE

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: SD_RETURNABLE_DISTANCE

prompt: 振り返ると、自分にとって保ちやすい距離には何がありますか。

options:
A: 返せる余白が残っていること
B: 一人になる時間が少しあること
C: 相手に合わせすぎない境目があること
D: 戻るきっかけが残っていること
E: 近さと静けさの両方があること

scoringIntent: noticing sustainable social distance

riskFlags: no relationship directive

reportTags: sustainable_distance, boundary_awareness

recommendationTags: distance_marker, returnable_boundary

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 持続しやすい距離の条件を、安全に自己観察できる。

Q076:

dimensionCode: RP

subdimensionCode: RP_RESET_METHOD

variantType: core_behavior

eligibilityFor24Q: candidate

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: RP_RESET_METHOD

prompt: 気持ちや流れを切り替えたい時、使いやすい戻り方はどれですか。

options:
A: 場所を少し変える
B: 小さな用事を一つ終える
C: 静かな時間を短く取る
D: 誰かと軽く話す
E: 書く、並べる、片づけるなど手を動かす

scoringIntent: typical reset method

riskFlags: clinical/treatment framing avoid

reportTags: reset_method, recovery_pattern

recommendationTags: place_shift, small_task, quiet_time

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 戻り方を医療的な意味にせず、日常の切り替え方法として測れる。

Q077:

dimensionCode: RP

subdimensionCode: RP_RESET_METHOD

variantType: scenario_pressure

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: RP_RESET_METHOD

prompt: 予定ややることが多く重なったあと、戻り方はどれに近いですか。

options:
A: まず一人で短く整える
B: 次の予定を軽めにする
C: 目の前のものを少し片づける
D: 誰かに短く話して区切る
E: その日は無理に戻さず、流れを小さくする

scoringIntent: reset method after overloaded periods

riskFlags: clinical/treatment framing avoid

reportTags: reset_after_load, recovery_pattern

recommendationTags: light_schedule, tidy_reset

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 重なった後の戻り方を、回復の正解ではなく選び方として拾える。

Q078:

dimensionCode: RP

subdimensionCode: RP_RESET_METHOD

variantType: social_contextual

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: RP_RESET_METHOD

prompt: 人が近くにいる時、流れを整える方法はどう変わりやすいですか。

options:
A: 人がいても自分の小さな動作で整える
B: 一人になる時間が少し必要になる
C: 誰かと軽く話す方が整いやすい
D: 周りの流れに合わせながら整える
E: その場では保って、あとで整える

scoringIntent: reset when others are nearby or involved

riskFlags: relationship directive avoid

reportTags: social_reset, recovery_context

recommendationTags: solo_space, light_talk, later_reset

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 他者がいる時の戻り方を、関係判断ではなく場面差として扱える。

Q079:

dimensionCode: RP

subdimensionCode: RP_RESET_METHOD

variantType: recovery_adjustment

eligibilityFor24Q: no

eligibilityFor72Q: candidate

eligibilityFor120Q: true

rotationGroup: RP_RESET_METHOD

prompt: いつもの戻り方が重く感じる時、軽い形にするならどれですか。

options:
A: 時間を短くする
B: 場所だけ変える
C: やることを一つにしぼる
D: 誰かに話す量を少なくする
E: 戻ろうとするより、次を軽くする

scoringIntent: choosing a lighter reset method when needed

riskFlags: clinical/treatment framing avoid

reportTags: lighter_reset, recovery_adjustment

recommendationTags: reduce_reset, light_next_step

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 戻り方そのものの調整を測れ、押しつけ感を避けられる。

Q080:

dimensionCode: RP

subdimensionCode: RP_RESET_METHOD

variantType: reflection_revisit

eligibilityFor24Q: no

eligibilityFor72Q: no

eligibilityFor120Q: true

rotationGroup: RP_RESET_METHOD

prompt: 振り返ると、自分に合いやすい戻り方には何がありますか。

options:
A: すぐ始められる小ささ
B: 人に見せなくてもできること
C: 終わった感じが少し残ること
D: 場所や時間を選びすぎないこと
E: 次の動きにつながること

scoringIntent: noticing which reset method helps

riskFlags: clinical/treatment framing avoid

reportTags: reset_awareness, recovery_condition

recommendationTags: reset_marker, next_action_link

boundaryMetadata:
answerData: private
resultUse: internal-scoring
shareUse: forbidden
questionSurface: public-entry-safe

whyThisQuestionWorks: 自分に合いやすい戻り方の条件を、非臨床の生活語で整理できる。

Batch self-check:

exactly 40 questions: yes

all 8 required subdimensions covered: yes

5 variants per subdimension: yes

all questions have 5 scenario-based options: yes

no agreement-scale options: yes

no prohibited wording: yes

no clinical framing: yes

no relationship directive: yes

no reply/no-reply advice: yes

no partner inference: yes

no work/career authority: yes

no invasive personal data: yes

boundaryMetadata included: yes

24Q candidates marked: yes

72Q candidates marked: yes

ready for methodology review: yes

---

---

## Batch 3 — Q081–Q120

YORISOU_120Q_JAPANESE_MASTER_QUESTION_BANK_BATCH_3_Q081_Q120_COMPLETE

Batch scope:

* covered question IDs: Q081–Q120
* covered dimensions: RP, BD, SO
* covered subdimensions: RP_RECOVERY_NEED, RP_RESTORATION_TRIGGER, BD_TAKING_ON_TOO_MUCH, BD_HOLDING_RESPONSE, BD_ROLE_DISTANCE, SO_NOTICING_STATE, SO_NAMING_PATTERN, SO_FEEDBACK_OPENNESS
* total questions generated: 40
* architecture status: 120Q master-first draft, not implementation-approved 

Global notes:

* tone: natural, restrained, mobile-readable Japanese
* answer model: 5 scenario-based current-state choices per question
* safety boundaries: non-clinical, non-directive, non-invasive
* boundary metadata model: answerData / resultUse / shareUse / questionSurface
* 24Q eligibility approach: Variant 1 marked candidate
* 72Q eligibility approach: Variant 1 + Variant 2 + Variant 4 marked candidate

Question bank:

Q081:

* dimensionCode: RP
* subdimensionCode: RP_RECOVERY_NEED
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: RP_RECOVERY_NEED
* prompt: 流れを立て直したい時、あなたに合いやすい戻り方はどれですか。
* options:
  A: 短い一人時間があると入り直しやすい
  B: 小さな用事を終えると区切りがつく
  C: 誰かと軽く話すと流れが変わる
  D: 場所を変えると次に移りやすい
  E: 予定を少し軽くすると動きやすい
* scoringIntent: amount or type of return needed
* riskFlags: clinical framing avoid
* reportTags: recovery_need, return_condition
* recommendationTags: quiet_time, light_schedule
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 戻り方の必要量を、生活上の選び方として自然に拾える。

Q082:

* dimensionCode: RP
* subdimensionCode: RP_RECOVERY_NEED
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: RP_RECOVERY_NEED
* prompt: 用事や対応が何度も続いたあと、戻るために欲しくなりやすいものはどれですか。
* options:
  A: 何もしない短い間
  B: 次の予定までのゆるい余白
  C: ひとつだけ終えた感じ
  D: 人の声が少ない場所
  E: 先の予定を見直す時間
* scoringIntent: return need after repeated demands
* riskFlags: clinical framing avoid
* reportTags: repeated_demand_return, margin_need
* recommendationTags: quiet_margin, schedule_review
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 重なった後の戻り方を、深刻化せずに日常の余白として扱える。

Q083:

* dimensionCode: RP
* subdimensionCode: RP_RECOVERY_NEED
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: RP_RECOVERY_NEED
* prompt: 人と長く関わったあと、自分の流れに戻る時はどれに近いですか。
* options:
  A: 一人の時間があると戻りやすい
  B: 別の軽いやりとりで切り替わる
  C: 場所を離れると戻りやすい
  D: 話した内容を少し整理したくなる
  E: そのまま次の予定に入れることもある
* scoringIntent: return need after social exposure
* riskFlags: relationship directive avoid
* reportTags: social_return, recovery_context
* recommendationTags: solo_margin, conversation_sort
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 人との関わり後の戻り方を、関係評価ではなく状態差として測れる。

Q084:

* dimensionCode: RP
* subdimensionCode: RP_RECOVERY_NEED
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: RP_RECOVERY_NEED
* prompt: 休む時間や切り替える時間が足りたかどうかは、何でわかりやすいですか。
* options:
  A: 次のことに手をつけやすくなる
  B: 返事や判断を急がなくなる
  C: 周りの音や動きが気になりにくくなる
  D: 小さな用事から始められる
  E: まだ軽くしたい予定が見えてくる
* scoringIntent: noticing whether return time was enough
* riskFlags: clinical framing avoid
* reportTags: recovery_sufficiency, return_signal
* recommendationTags: readiness_cue, pace_check
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 戻りが足りたかを、評価ではなく合図として扱える。

Q085:

* dimensionCode: RP
* subdimensionCode: RP_RECOVERY_NEED
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: RP_RECOVERY_NEED
* prompt: 自分に必要な戻り方を短く言うなら、どれが近いですか。
* options:
  A: ひとりで静かにする時間
  B: 次に入る前の短い余白
  C: 話して外に出す時間
  D: 場所や手元を変える時間
  E: 予定を小さく組み直す時間
* scoringIntent: naming return needs without overexplaining
* riskFlags: low
* reportTags: recovery_need_naming, return_language
* recommendationTags: return_phrase, margin_design
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 必要な戻り方を過度に説明させず、短い生活語で拾える。

Q086:

* dimensionCode: RP
* subdimensionCode: RP_RESTORATION_TRIGGER
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: RP_RESTORATION_TRIGGER
* prompt: 自分の流れが戻ってきたと感じやすいきっかけはどれですか。
* options:
  A: 静かな場所に移る
  B: 手元を片づける
  C: 好きな飲み物や音に触れる
  D: 軽く体を動かす
  E: 誰かと短く話す
* scoringIntent: what helps the user feel restored
* riskFlags: clinical framing avoid
* reportTags: restoration_trigger, return_cue
* recommendationTags: place_shift, sensory_cue
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 戻るきっかけを、日常の小さな合図として測れる。

Q087:

* dimensionCode: RP
* subdimensionCode: RP_RESTORATION_TRIGGER
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: RP_RESTORATION_TRIGGER
* prompt: 時間や選べることが少ない時、戻るきっかけにしやすいものはどれですか。
* options:
  A: 深く考えずできる小さな動き
  B: 場所を少し変えること
  C: 目の前をひとつ片づけること
  D: 数分だけ静かにすること
  E: 次の予定を軽くすること
* scoringIntent: restoration when time or options are limited
* riskFlags: clinical framing avoid
* reportTags: limited_option_return, restoration_constraint
* recommendationTags: quick_cue, small_shift
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 選択肢が少ない場面でも使える戻りの合図を見分けられる。

Q088:

* dimensionCode: RP
* subdimensionCode: RP_RESTORATION_TRIGGER
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: RP_RESTORATION_TRIGGER
* prompt: 一人の時と誰かといる時で、流れの戻り方はどう変わりますか。
* options:
  A: 一人の方が戻りやすい
  B: 誰かと軽く話す方が戻りやすい
  C: どちらでも、短い区切りがあれば戻りやすい
  D: その場の距離感で変わりやすい
  E: 人がいる時はあとで戻すことが多い
* scoringIntent: restoration alone versus with others
* riskFlags: relationship directive avoid
* reportTags: social_restoration, return_context
* recommendationTags: solo_or_social, distance_context
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 一人・他者同席の違いを、関係判断ではなく戻り方として扱える。

Q089:

* dimensionCode: RP
* subdimensionCode: RP_RESTORATION_TRIGGER
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: RP_RESTORATION_TRIGGER
* prompt: いつもの戻り方が合いにくい時、別の形にするならどれですか。
* options:
  A: 静かにする代わりに手を動かす
  B: 一人でいる代わりに軽く話す
  C: 長く取る代わりに短く分ける
  D: 場所ではなく音や香りを変える
  E: 戻すより次の動きを軽くする
* scoringIntent: changing restoration method when it stops working
* riskFlags: clinical/treatment framing avoid
* reportTags: restoration_adjustment, method_shift
* recommendationTags: alternate_cue, light_next
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 一つの戻り方に固定せず、合いにくい時の切り替えを見られる。

Q090:

* dimensionCode: RP
* subdimensionCode: RP_RESTORATION_TRIGGER
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: RP_RESTORATION_TRIGGER
* prompt: 振り返ると、流れが戻りやすい時に共通しているものはどれですか。
* options:
  A: 音や人の気配がちょうどよい
  B: 自分のペースで切り替えられる
  C: 終わった感じが小さくある
  D: 次にすることが重すぎない
  E: 無理に急がなくてよい
* scoringIntent: noticing reliable restoration cues
* riskFlags: low
* reportTags: restoration_awareness, reliable_cue
* recommendationTags: pace_cue, closure_marker
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 戻りやすさの共通条件を、短く比較しやすい形で拾える。

Q091:

* dimensionCode: BD
* subdimensionCode: BD_TAKING_ON_TOO_MUCH
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_TAKING_ON_TOO_MUCH
* prompt: 頼まれごとや役割が増える時、あなたはどんな形になりやすいですか。
* options:
  A: できそうな範囲なら引き受けやすい
  B: その場の流れで増えやすい
  C: いったん考える時間を取りたくなる
  D: 相手によって受け方が変わりやすい
  E: あとから量の多さに気づくことがある
* scoringIntent: tendency to take on more than intended
* riskFlags: boundary coaching tone avoid
* reportTags: taking_on, load_boundary
* recommendationTags: scope_check, pause_before_accept
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 引き受け方を責めず、増え方の自然なパターンとして測れる。

Q092:

* dimensionCode: BD
* subdimensionCode: BD_TAKING_ON_TOO_MUCH
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_TAKING_ON_TOO_MUCH
* prompt: 急ぎの空気や期待がある時、引き受ける量はどうなりやすいですか。
* options:
  A: その場を進めるために増えやすい
  B: 自分の分を確かめてから決めたい
  C: できる部分だけなら受けやすい
  D: 相手が困っていると増えやすい
  E: すぐ決めずに一度置きたくなる
* scoringIntent: taking on more under urgency or expectation
* riskFlags: no refusal/acceptance advice
* reportTags: expectation_load, taking_on_pressure
* recommendationTags: scope_phrase, decision_pause
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 期待や急ぎの場面での受け方を、行動指示なしで把握できる。

Q093:

* dimensionCode: BD
* subdimensionCode: BD_TAKING_ON_TOO_MUCH
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: BD_TAKING_ON_TOO_MUCH
* prompt: 相手や役割によって、引き受ける範囲はどう変わりやすいですか。
* options:
  A: 近い人ほど増えやすい
  B: 役割がある場面では増えやすい
  C: 距離がある相手には範囲を見やすい
  D: 内容によっては相手に関係なく増える
  E: その日の余白で変わりやすい
* scoringIntent: taking on more for specific people or roles
* riskFlags: relationship/work directive avoid
* reportTags: role_load, social_scope
* recommendationTags: role_scope, margin_check
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 人や役割ごとの受け方を、関係判断や仕事評価にしない。

Q094:

* dimensionCode: BD
* subdimensionCode: BD_TAKING_ON_TOO_MUCH
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_TAKING_ON_TOO_MUCH
* prompt: 引き受けた量が多かったと気づいたあと、軽くしやすい形はどれですか。
* options:
  A: まず一つだけ後ろに回す
  B: できる範囲を短く言葉にする
  C: 手順を分けて小さくする
  D: 誰かに一部だけ共有する
  E: 次から確認したい点を残しておく
* scoringIntent: reducing load after over-taking
* riskFlags: no refusal advice; no blame
* reportTags: load_adjustment, scope_repair
* recommendationTags: reduce_one, scope_note
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 多く受けた後の軽くし方を、拒否や対立ではなく調整として測れる。

Q095:

* dimensionCode: BD
* subdimensionCode: BD_TAKING_ON_TOO_MUCH
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: BD_TAKING_ON_TOO_MUCH
* prompt: 振り返ると、引き受ける量が増える前に出やすい合図はどれですか。
* options:
  A: その場を早く進めたくなる
  B: 相手の困りごとが気になりやすい
  C: 自分の予定を後ろに置きやすい
  D: できるかより先に返事を考える
  E: 終わったあとの量が見えにくくなる
* scoringIntent: noticing early signs of over-taking
* riskFlags: no blame; no coaching tone
* reportTags: taking_on_signal, scope_awareness
* recommendationTags: early_scope_cue, load_preview
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 増える前の合図を、責める言葉なしで拾える。

Q096:

* dimensionCode: BD
* subdimensionCode: BD_HOLDING_RESPONSE
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_HOLDING_RESPONSE
* prompt: 何かを頼まれた時、すぐ答える前の間はどれに近いですか。
* options:
  A: すぐ答える方が流れに乗りやすい
  B: 少し考える間があると答えやすい
  C: 内容によって間の長さが変わる
  D: 相手によってすぐ答えやすさが変わる
  E: 一度持ち帰る形の方が合いやすい
* scoringIntent: holding back immediate response
* riskFlags: no accept/refuse advice
* reportTags: response_pause, boundary_response
* recommendationTags: pause_phrase, response_scope
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 返答前の間を、良し悪しではなく自然な答え方として測れる。

Q097:

* dimensionCode: BD
* subdimensionCode: BD_HOLDING_RESPONSE
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_HOLDING_RESPONSE
* prompt: その場で答えを求められる時、あなたはどうなりやすいですか。
* options:
  A: その場で言える範囲だけ答える
  B: 少し間を置けると考えやすい
  C: 相手の急ぎ具合に合わせやすい
  D: あとで返す形にしたくなる
  E: 内容を小さく分けて答えたくなる
* scoringIntent: response holding under request pressure
* riskFlags: no compliance/authority advice
* reportTags: request_pressure, response_timing
* recommendationTags: partial_answer, later_reply_option
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 急かされる場面の答え方を、従う・断るの指示にせず測れる。

Q098:

* dimensionCode: BD
* subdimensionCode: BD_HOLDING_RESPONSE
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: BD_HOLDING_RESPONSE
* prompt: 相手との距離や立場によって、答える前の間はどう変わりますか。
* options:
  A: 近い人には早く答えやすい
  B: 近い人ほど言葉を選びたくなる
  C: 役割がある相手には慎重になりやすい
  D: 距離がある相手には短く答えやすい
  E: 相手より内容の重さで変わりやすい
* scoringIntent: response holding around closeness or authority
* riskFlags: relationship/work authority avoid
* reportTags: response_context, role_distance
* recommendationTags: wording_buffer, context_filter
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 相手別の返答の間を扱うが、関係や立場への助言にはしない。

Q099:

* dimensionCode: BD
* subdimensionCode: BD_HOLDING_RESPONSE
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_HOLDING_RESPONSE
* prompt: 早く答えすぎた、または遅くなったと感じたあと、次につなげやすい形はどれですか。
* options:
  A: 次は短く確認してから答える
  B: 返事の範囲を小さくする
  C: 考える時間を先に伝える形にする
  D: すぐ答える内容と後で答える内容を分ける
  E: その場ごとの自分の余白を見て答える
* scoringIntent: repairing after answering too quickly or too late
* riskFlags: no relationship directive; no coaching tone
* reportTags: response_adjustment, timing_repair
* recommendationTags: response_split, time_phrase
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 返答タイミングのずれを責めず、次の扱い方として測れる。

Q100:

* dimensionCode: BD
* subdimensionCode: BD_HOLDING_RESPONSE
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: BD_HOLDING_RESPONSE
* prompt: 振り返ると、少し間を置いた方が答えやすいのはどんな時ですか。
* options:
  A: 範囲を決めてから答えたい時
  B: 相手の期待が強く見える時
  C: 自分の予定への影響を見たい時
  D: 言葉を短くまとめたい時
  E: 今答える部分と後で答える部分を分けたい時
* scoringIntent: noticing when pause helps
* riskFlags: no refusal/acceptance advice
* reportTags: pause_awareness, response_condition
* recommendationTags: pause_cue, scope_review
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 間を置く場面を、優劣ではなく条件として見られる。

Q101:

* dimensionCode: BD
* subdimensionCode: BD_ROLE_DISTANCE
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_ROLE_DISTANCE
* prompt: 役割や立場がある場面で、自分との距離はどれに近いですか。
* options:
  A: 役割に入ると動きやすい
  B: 役割が強いと自分の余白が少なくなる
  C: 場面ごとに役割を切り替えたい
  D: 役割より自分のペースを残したい
  E: 終わったあとに役割から離れる時間がほしい
* scoringIntent: distance from assigned or expected roles
* riskFlags: work/family role advice avoid
* reportTags: role_distance, boundary_role
* recommendationTags: role_switch, margin_after_role
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 役割との距離を、仕事や家庭への助言にせず状態として測れる。

Q102:

* dimensionCode: BD
* subdimensionCode: BD_ROLE_DISTANCE
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_ROLE_DISTANCE
* prompt: 責任や意見の違いがある場面で、役割との距離はどうなりやすいですか。
* options:
  A: 役割に集中して場を進めようとする
  B: 役割の外にある自分の考えも気になる
  C: その場では役割を優先しやすい
  D: あとで自分の感じ方を見直したくなる
  E: 役割の範囲を確かめたくなる
* scoringIntent: role pressure during responsibility or conflict
* riskFlags: no work/career authority; no confrontation advice
* reportTags: role_pressure, responsibility_context
* recommendationTags: role_scope, after_review
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 責任のある場面での役割距離を、対処指示なしで見られる。

Q103:

* dimensionCode: BD
* subdimensionCode: BD_ROLE_DISTANCE
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: BD_ROLE_DISTANCE
* prompt: 家族、仕事、友人、地域などで、役割との距離はどう変わりやすいですか。
* options:
  A: 近い関係ほど役割から離れにくい
  B: 仕事や担当がある場では役割に入りやすい
  C: 友人の前では役割を軽くしやすい
  D: 場によって自分の出し方を変えやすい
  E: 関係より、その時の余白で変わりやすい
* scoringIntent: role distance across family, work, peers, community
* riskFlags: family/work directive avoid
* reportTags: role_context, social_role_distance
* recommendationTags: context_switch, role_margin
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 複数の場での役割距離を、具体的だが侵襲的でない範囲で扱える。

Q104:

* dimensionCode: BD
* subdimensionCode: BD_ROLE_DISTANCE
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: BD_ROLE_DISTANCE
* prompt: 役割に入りすぎた感じがあるあと、離れやすい形はどれですか。
* options:
  A: ひとりの時間に戻す
  B: 普段の小さな用事に戻る
  C: 役割と関係ない話をする
  D: その場で使った言葉を少し置く
  E: 次の予定を軽めにする
* scoringIntent: stepping back from role over-identification
* riskFlags: no role-change advice; no therapy tone
* reportTags: role_release, role_aftereffect
* recommendationTags: ordinary_task, role_off_cue
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 役割から離れる感覚を、役割放棄ではなく日常への戻りとして測れる。

Q105:

* dimensionCode: BD
* subdimensionCode: BD_ROLE_DISTANCE
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: BD_ROLE_DISTANCE
* prompt: 振り返ると、役割が近くなりすぎる時には何が起きやすいですか。
* options:
  A: 自分の予定が後ろに行きやすい
  B: 断るかどうかより先に動いている
  C: その場を保つことを優先しやすい
  D: 終わったあとも役割の言葉が残る
  E: 自分の範囲が見えにくくなる
* scoringIntent: noticing which roles feel too close
* riskFlags: no blame; no boundary coaching tone
* reportTags: role_closeness_signal, scope_awareness
* recommendationTags: role_signal, scope_marker
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 役割の近さの合図を、改善圧なしに拾える。

Q106:

* dimensionCode: SO
* subdimensionCode: SO_NOTICING_STATE
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_NOTICING_STATE
* prompt: 今の自分の状態に気づくのは、どんな時が多いですか。
* options:
  A: 動きがいつもよりゆっくりになる時
  B: 返事や判断に間が出る時
  C: 人と離れて静かになった時
  D: 書いたり話したりした時
  E: 予定の流れが変わった時
* scoringIntent: noticing current state
* riskFlags: no therapy/mindfulness authority
* reportTags: state_notice, self_observation
* recommendationTags: notice_cue, quiet_check
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 状態への気づきを優劣化せず、日常の場面として測れる。

Q107:

* dimensionCode: SO
* subdimensionCode: SO_NOTICING_STATE
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_NOTICING_STATE
* prompt: やることが多い時、自分の状態にはどう気づきやすいですか。
* options:
  A: 進み方が変わってから気づく
  B: 予定を見直す時に気づく
  C: 人から声をかけられて気づく
  D: 手が止まった時に気づく
  E: その時は気づかず、あとで見えてくる
* scoringIntent: noticing state during busyness or pressure
* riskFlags: clinical framing avoid
* reportTags: state_notice_under_load, delayed_notice
* recommendationTags: pace_marker, later_review
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 忙しい場面での気づき方を、できる・できないの評価にしない。

Q108:

* dimensionCode: SO
* subdimensionCode: SO_NOTICING_STATE
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: SO_NOTICING_STATE
* prompt: 人に合わせている時、自分の状態にはどう気づきやすいですか。
* options:
  A: その場では気づきにくく、あとで見える
  B: 相手に合わせる前に少し気づく
  C: 話している途中で変化に気づく
  D: 一人になった時に見えやすい
  E: 合わせる範囲を考える時に気づく
* scoringIntent: noticing state while adapting to others
* riskFlags: relationship directive avoid
* reportTags: social_state_notice, adaptation_context
* recommendationTags: after_social_check, scope_notice
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 人に合わせる場面の気づきを、対人判断ではなく自分側の見え方として扱える。

Q109:

* dimensionCode: SO
* subdimensionCode: SO_NOTICING_STATE
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_NOTICING_STATE
* prompt: 自分の状態に気づいたあと、動き方を変えるならどれに近いですか。
* options:
  A: 次の一つだけを小さくする
  B: 予定の順番を入れ替える
  C: 人とのやりとりを短めにする
  D: 場所や手元を変える
  E: そのまま進みつつ、後ろを軽くする
* scoringIntent: using noticing to adjust pace
* riskFlags: no self-improvement pressure
* reportTags: state_adjustment, pace_shift
* recommendationTags: small_next, reorder_plan
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 気づきの後を「良くする」ではなく、動き方の小さな変化として測れる。

Q110:

* dimensionCode: SO
* subdimensionCode: SO_NOTICING_STATE
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: SO_NOTICING_STATE
* prompt: 時間がたってから、自分の状態が見えやすくなるのはどんな時ですか。
* options:
  A: 予定が終わって静かになった時
  B: 誰かに話して言葉になった時
  C: その日の流れを書き出した時
  D: 次の日に同じ感じが残っていた時
  E: 何が重かったか一つ見えた時
* scoringIntent: revisiting state after time passes
* riskFlags: clinical framing avoid
* reportTags: delayed_state_notice, revisit_signal
* recommendationTags: later_check, day_review
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 時間差で見える状態を、分析圧なしで自然に拾える。

Q111:

* dimensionCode: SO
* subdimensionCode: SO_NAMING_PATTERN
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_NAMING_PATTERN
* prompt: 自分に繰り返し出る流れを言葉にするなら、どれが近いですか。
* options:
  A: 始めるまでに時間がいる流れ
  B: 人に合わせると後から残る流れ
  C: 選ぶ前に条件を見たくなる流れ
  D: 受けすぎてから量に気づく流れ
  E: 一度止まると小さく戻る流れ
* scoringIntent: ability to name recurring patterns
* riskFlags: fixed identity avoid
* reportTags: pattern_naming, self_observation
* recommendationTags: pattern_phrase, recognition_cue
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 固定的な性格名ではなく、繰り返す流れとして言葉にできる。

Q112:

* dimensionCode: SO
* subdimensionCode: SO_NAMING_PATTERN
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_NAMING_PATTERN
* prompt: 自分の流れが見えにくい時、言葉にしやすい入口はどれですか。
* options:
  A: 何が増えていたかを見る
  B: 何を後回しにしたかを見る
  C: どこで止まったかを見る
  D: 誰といた時かを見る
  E: 何が終わると軽くなったかを見る
* scoringIntent: naming patterns when confused or loaded
* riskFlags: no coaching tone
* reportTags: pattern_entry, unclear_state_naming
* recommendationTags: naming_prompt, event_marker
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 見えにくい状態を深掘りせず、具体的な入口で拾える。

Q113:

* dimensionCode: SO
* subdimensionCode: SO_NAMING_PATTERN
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: SO_NAMING_PATTERN
* prompt: 人や役割が関わる時、自分の流れを言葉にするならどれが近いですか。
* options:
  A: 近い人には返事を考えすぎる流れ
  B: 役割があると引き受けやすい流れ
  C: 場の空気を見てから動く流れ
  D: 人と離れてから自分の感じが見える流れ
  E: 相手より内容の重さで変わる流れ
* scoringIntent: naming patterns affected by people or roles
* riskFlags: relationship/work directive avoid
* reportTags: social_pattern_naming, role_pattern
* recommendationTags: social_cue, role_phrase
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 人や役割に関わる流れを、相手評価ではなく自分側の型として扱える。

Q114:

* dimensionCode: SO
* subdimensionCode: SO_NAMING_PATTERN
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_NAMING_PATTERN
* prompt: 自分の流れに名前をつけたあと、使いやすい形はどれですか。
* options:
  A: 次に同じ流れが出た時の目印にする
  B: 予定を少し軽くする合図にする
  C: 人に説明しすぎない短い言葉にする
  D: その日のメモにだけ残す
  E: 別の言い方に変えられる余地を残す
* scoringIntent: using a name to adjust behavior gently
* riskFlags: no self-improvement pressure
* reportTags: pattern_label_use, gentle_adjustment
* recommendationTags: pattern_marker, short_phrase
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 名前づけを指導的にせず、軽い目印として使えるかを測れる。

Q115:

* dimensionCode: SO
* subdimensionCode: SO_NAMING_PATTERN
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: SO_NAMING_PATTERN
* prompt: 前に言葉にした自分の流れが、あとで変わって見える時はどれですか。
* options:
  A: 違う場面でも同じ流れが出た時
  B: 思ったより軽い形で出た時
  C: 人が変わると違う出方をした時
  D: 時間がたって言い方が合わなくなった時
  E: 別の言葉の方が近いと感じた時
* scoringIntent: renaming patterns after new experience
* riskFlags: fixed identity avoid
* reportTags: pattern_revisit, label_shift
* recommendationTags: rename_cue, flexible_label
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 名前づけを固定せず、再訪時に更新できる前提を保てる。

Q116:

* dimensionCode: SO
* subdimensionCode: SO_FEEDBACK_OPENNESS
* variantType: core_behavior
* eligibilityFor24Q: candidate
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_FEEDBACK_OPENNESS
* prompt: 人から見え方や気づきを伝えられた時、あなたはどう受け取りやすいですか。
* options:
  A: すぐ使わず、いったん手元に置く
  B: 自分の感覚と照らしてみる
  C: 誰からの言葉かで受け取り方が変わる
  D: 短く具体的だと見やすい
  E: その場では受け取りにくく、後で見る
* scoringIntent: openness to gentle feedback or signals
* riskFlags: no compliance/authority framing
* reportTags: feedback_openness, signal_receiving
* recommendationTags: feedback_filter, later_review
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: フィードバックを受け入れるべきものにせず、受け取り方の違いとして測れる。

Q117:

* dimensionCode: SO
* subdimensionCode: SO_FEEDBACK_OPENNESS
* variantType: scenario_pressure
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_FEEDBACK_OPENNESS
* prompt: 余白が少ない時に何かを伝えられたら、受け取り方はどうなりやすいですか。
* options:
  A: その場では短く受け取る
  B: あとで見返せる形にしたくなる
  C: すぐには入れず、少し時間を置く
  D: 具体的な部分だけ拾いやすい
  E: まず今必要なことだけ見る
* scoringIntent: feedback openness under low margin or uncertainty
* riskFlags: no health-coded wording; no compliance framing
* reportTags: feedback_under_pressure, low_margin_receiving
* recommendationTags: later_review, concrete_point
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 余白が少ない時の受け取り方を、拒否や従順さではなく処理量として扱える。

Q118:

* dimensionCode: SO
* subdimensionCode: SO_FEEDBACK_OPENNESS
* variantType: social_contextual
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: SO_FEEDBACK_OPENNESS
* prompt: 誰から伝えられるかによって、受け取り方はどう変わりますか。
* options:
  A: 近い人の言葉ほど残りやすい
  B: 距離がある人の方が聞きやすいことがある
  C: 役割がある相手の言葉は慎重に見る
  D: 誰からでも具体的なら見やすい
  E: 相手より、その時の言い方で変わる
* scoringIntent: feedback openness depending on source
* riskFlags: no authority/compliance framing
* reportTags: feedback_source, social_receiving
* recommendationTags: source_filter, wording_context
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 相手別の受け取り方を、権威への従属や反発にせず扱える。

Q119:

* dimensionCode: SO
* subdimensionCode: SO_FEEDBACK_OPENNESS
* variantType: recovery_adjustment
* eligibilityFor24Q: no
* eligibilityFor72Q: candidate
* eligibilityFor120Q: true
* rotationGroup: SO_FEEDBACK_OPENNESS
* prompt: 伝えられたことを取り入れすぎずに見るなら、どの形が近いですか。
* options:
  A: 使える部分だけ拾う
  B: 今は置いて、後で見直す
  C: 自分の感じと違う部分を分ける
  D: すぐ行動にせず、言葉だけ残す
  E: 一人で考える時間をはさむ
* scoringIntent: integrating feedback without overcorrecting
* riskFlags: no compliance; no coaching tone
* reportTags: feedback_adjustment, selective_receiving
* recommendationTags: feedback_filter, delayed_use
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: 取り入れることを前提にせず、距離を保った受け取り方を測れる。

Q120:

* dimensionCode: SO
* subdimensionCode: SO_FEEDBACK_OPENNESS
* variantType: reflection_revisit
* eligibilityFor24Q: no
* eligibilityFor72Q: no
* eligibilityFor120Q: true
* rotationGroup: SO_FEEDBACK_OPENNESS
* prompt: 時間がたってから、前に伝えられたことを見直す時はどれに近いですか。
* options:
  A: その時より落ち着いて見える
  B: 自分には合わない部分が見える
  C: 一部だけ役に立つ形で残る
  D: 誰の言葉だったかより内容を見る
  E: 前とは違う意味に見えることがある
* scoringIntent: revisiting feedback after time passes
* riskFlags: no authority/compliance framing
* reportTags: feedback_revisit, delayed_receiving
* recommendationTags: revisit_feedback, meaning_shift
* boundaryMetadata:
  answerData: private
  resultUse: internal-scoring
  shareUse: forbidden
  questionSurface: public-entry-safe
* whyThisQuestionWorks: フィードバックを固定的に受け取らず、時間差で見直す余地を保てる。

Batch self-check:

* exactly 40 questions: yes
* all 8 required subdimensions covered: yes
* 5 variants per subdimension: yes
* all questions have 5 scenario-based options: yes
* no agreement-scale options: yes
* no prohibited wording: yes
* no clinical framing: yes
* no relationship directive: yes
* no reply/no-reply advice: yes
* no partner inference: yes
* no work/career authority: yes
* no boundary/coaching tone: yes
* no self-improvement pressure: yes
* no invasive personal data: yes
* boundaryMetadata included: yes
* 24Q candidates marked: yes
* 72Q candidates marked: yes
* ready for methodology review: yes
