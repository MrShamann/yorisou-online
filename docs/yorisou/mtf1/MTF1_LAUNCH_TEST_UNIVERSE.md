# MTF-1 — Launch Test Universe V1 (FROZEN)

**Package:** YORISOU MTF-1 · **Base:** clean `main @ 0bd76b3` · **Status:** Founder-frozen composition (§4 of the MTF-1 authorization). Group membership may NOT be changed silently; any proposed correction is a Founder-decision request recorded in `MTF1_FOUNDER_DECISIONS.md`, never implemented directly.

YORISOU is a **multi-method human-understanding platform** (MTF-1 §3.1). The 120Q system is one deep method among peers. No fixed Persona architecture governs the product. Methods remain source-separated. Symbolic and cultural methods are never presented as scientific evidence, diagnosis, fate, certainty, or high-stakes decision authority.

## Groups

- **Launch Core (10)** — fully productized before App V1 is considered complete.
- **Launch Supporting (9)** — strengthen retention/variety; do not block first store submission.
- **Rights Review Queue (7)** — architecturally approved; blocked on source/licence/translation resolution.
- **Later Cultural Systems (5 + open class)** — school-dependent traditional systems; represented in architecture; never App V1 blockers. "Other school-dependent traditional systems" beyond the five named enter here by default when proposed.

## Field key

`use_frequency`: once_deep / retake_casual / repeat_weekly / daily / situational.
`privacy_class`: `P1_answers_only` · `P2_name_input` · `P3_two_person` · `P4_birth_data` · `P5_free_text` (higher = more sensitive handling; two-person requires both-party consent design; birth data requires explicit retention policy).
`evidence_class`: `yorisou_original_reflection` (first-party non-clinical reflection) · `psychology_preference_nonclinical` · `public_domain_psychometric_review` · `traditional_symbolic` · `traditional_symbolic_entertainment` (S01 fixed classification, MTF-1 §3.4).
`activation_state` uses the canonical CPV1 5-state vocabulary (`lib/cpv1/methods.ts` `METHOD_ACTIVATION_STATES`); `planned_unbuilt` is a documentation-level pre-state meaning "not yet in the runtime registry"; it maps to CPV1 `gated` on registration.
`implementation_truth` cites the MTF-0 audit (2026-07-20) — never optimistic labels.

## Machine-readable universe (validated by `scripts/validate-mtf1-docs.mjs`)

```yaml
# MTF1-UNIVERSE-V1 (frozen). One entry per method. Parser: constrained YAML (flat key: value pairs).
- method_id: imairo-120q
  name_ja: いま色テスト（120問）
  family: yorisou_original_assessment
  launch_group: launch_core
  user_need: 深く今の自分を理解する（8次元・24側面）
  use_frequency: once_deep
  input_type: answers
  format_category: five_point_scale_fixed_bank
  result_type: archetype_24_of_6_clans
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: anchor_baseline_retakeable
  cross_method_role: primary_understanding_source
  recommendation_role: primary_driver
  mobile_role: deep_session_20min_resume_required
  activation_state: implemented_route_verified
  implementation_truth: production_active_route (/check-in→/result); 120Q/8dim/24sub/24результ — 24 results live; confidence band placeholder-low with false copy (T5); formula FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL; server snapshot save exists
  required_completion_work: T4 badge correction; T5 confidence-copy correction (separately gated, §3.5); wire dormant contract suite (T10); mid-test resume port (SR-2, branch-only today)
  activation_prerequisites: founder decision on T5 wording; no new content needed
- method_id: c02-current-state
  name_ja: 今のわたしチェック
  family: yorisou_state
  launch_group: launch_core
  user_need: 短時間で今の状態を整理する
  use_frequency: retake_casual
  input_type: answers
  format_category: single_choice_weighted_36q
  result_type: archetype_8
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: frequent_snapshot
  cross_method_role: state_context_for_other_methods
  recommendation_role: entry_router
  mobile_role: five_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/c02); 36Q/8 results; server save + LINE return; dim drift T6; stale bank metadata T7
  required_completion_work: reconcile dimension drift (T6); family deep-report content (none on main); fix dangling relatedRoutes (T8)
  activation_prerequisites: dimension reconciliation record
- method_id: relationship-fatigue-24q
  name_ja: 人間関係の疲れチェック
  family: yorisou_state
  launch_group: launch_core
  user_need: 人間関係の負担の傾向を知る
  use_frequency: retake_casual
  input_type: answers
  format_category: scenario_choice_24q
  result_type: archetype_7_plus_state_tags
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: repeat_relationship_check
  cross_method_role: relationship_context
  recommendation_role: relationship_service_router
  mobile_role: five_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/relationship-fatigue); 24Q/6dim/7 archetypes + 7 state tags; server save + LINE return; CI-tested
  required_completion_work: family deep-report content
  activation_prerequisites: none beyond report content
- method_id: love-distance
  name_ja: 恋愛の距離感チェック
  family: yorisou_state
  launch_group: launch_core
  user_need: 恋愛での距離の取り方を整理する
  use_frequency: retake_casual
  input_type: answers
  format_category: scenario_choice_18q
  result_type: archetype_7
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: repeat_relationship_check
  cross_method_role: relationship_context
  recommendation_role: relationship_service_router
  mobile_role: five_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/love-distance); 18Q/6dim/7 archetypes + 2 safety counters; CLIENT-ONLY (no server save, no scoring test)
  required_completion_work: server-save parity; scoring unit test; family deep-report content
  activation_prerequisites: persistence parity
- method_id: work-rhythm
  name_ja: 仕事のリズムチェック
  family: yorisou_state
  launch_group: launch_core
  user_need: 集中と疲れのリズムを知る
  use_frequency: repeat_weekly
  input_type: answers
  format_category: single_choice_6q_micro
  result_type: archetype_4
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: repeat_work_check
  cross_method_role: work_context
  recommendation_role: work_service_router
  mobile_role: one_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/work-rhythm); 6Q/4 results; UNVERSIONED scoring; client-only
  required_completion_work: scoring version; server save; family deep-report content
  activation_prerequisites: versioning + persistence
- method_id: name-impression
  name_ja: 名前の印象チェック
  family: yorisou_state
  launch_group: launch_core
  user_need: 名前から受ける印象を楽しく整理する（姓名判断ではない）
  use_frequency: situational
  input_type: name_plus_answers
  format_category: single_choice_5q_plus_name
  result_type: archetype_4
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P2_name_input
  longitudinal_role: none
  cross_method_role: light_symbolic_entry
  recommendation_role: casual_entry_router
  mobile_role: one_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/name-impression); 5Q+name/4 results; explicit non-姓名判断 disclaimer in copy; unversioned; client-only
  required_completion_work: scoring version; server save decision (name retention policy); family deep-report content
  activation_prerequisites: name-retention policy record
- method_id: daily-check-in
  name_ja: きょうのわたし（毎日チェック）
  family: yorisou_state
  launch_group: launch_core
  user_need: 毎日30秒で状態を記録し変化を見る
  use_frequency: daily
  input_type: mood_energy_note
  format_category: repeated_check_1to3_inputs
  result_type: state_log_no_archetype
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P5_free_text
  longitudinal_role: primary_longitudinal_spine
  cross_method_role: change_over_time_source
  recommendation_role: cadence_based_nudge
  mobile_role: thirty_second_completion_primary_mobile_surface
  activation_state: planned_unbuilt
  implementation_truth: ABSENT — no daily check exists anywhere (MTF-0 B.5); registry carries only the umbrella reflection-cadence contract entry (not_started)
  required_completion_work: full product build — inputs, cadence model, history view, change-over-time report, gentle non-streak design
  activation_prerequisites: engine cadence+history capability; content package; founder review
- method_id: relationship-pair-check
  name_ja: ふたりの関係チェック
  family: relationship_compatibility
  launch_group: launch_core
  user_need: ふたりの関係のリズムと距離を一緒に見る
  use_frequency: situational
  input_type: two_person_answers
  format_category: two_person_paired_questions
  result_type: pair_archetype_set
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P3_two_person
  longitudinal_role: repeatable_relationship_milestone
  cross_method_role: pair_context
  recommendation_role: relationship_service_router
  mobile_role: shared_or_async_two_person_flow
  activation_state: planned_unbuilt
  implementation_truth: R01 successor (MTF-1 §3.2 FIXED). R01 stays untouched on Production in MTF-1. Successor may reuse ONLY first-party structural patterns (two-person flow, pair-dimension comparison, distance/gap interpretation, pair-result rendering); all questions/dimensions/results/copy newly created
  required_completion_work: originality + two-person privacy review; full content package; pair-consent design
  activation_prerequisites: originality review; two-person consent model; founder review
- method_id: yorisou-values
  name_ja: 価値観リフレクション
  family: psychology_preference
  launch_group: launch_core
  user_need: いま大事にしていることを整理する
  use_frequency: retake_casual
  input_type: answers
  format_category: single_choice_with_tradeoff
  result_type: archetype_6to8
  evidence_class: psychology_preference_nonclinical
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P1_answers_only
  longitudinal_role: yearly_or_lifestage_retake
  cross_method_role: preference_context
  recommendation_role: values_based_router
  mobile_role: ten_minute_completion
  activation_state: planned_unbuilt
  implementation_truth: registry entry only (downgraded R1 §5 — declared but unbuilt; no questions, no route)
  required_completion_work: full content package (dimensions, ~24Q, options, scoring, archetypes, copy, report)
  activation_prerequisites: content package; founder review (Launch Core preference method — MTF-1 §3.6 FIXED)
- method_id: image-color-reflection
  name_ja: イメージ・色のふり返り
  family: western_symbolic
  launch_group: launch_core
  user_need: 言葉になりにくい感覚を色とイメージで記録する
  use_frequency: repeat_weekly
  input_type: image_color_selection
  format_category: image_color_choice
  result_type: reflective_record_plus_light_reading
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P1_answers_only
  longitudinal_role: mood_texture_over_time
  cross_method_role: nonverbal_state_signal
  recommendation_role: gentle_entry_router
  mobile_role: visual_first_mobile_native_interaction
  activation_state: planned_unbuilt
  implementation_truth: registry entry only (rights-gated on image assets); no flow, no assets. Founder placed in Launch Core (§4.1 FIXED); custom deck artwork is NOT a V1 blocker (§3.7) — original color fields/abstract original imagery suffice for V1; no third-party image may be copied
  required_completion_work: original visual asset set (colors/abstract images); selection model; reflective copy; engine image-choice format
  activation_prerequisites: original assets authored + rights verified; engine format support; founder review
- method_id: f01-work-fit
  name_ja: 向いている働き方
  family: yorisou_original_assessment
  launch_group: launch_supporting
  user_need: 働き方の向きを整理する
  use_frequency: once_deep
  input_type: answers
  format_category: single_choice_weighted_60q
  result_type: archetype_8
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: lifestage_retake
  cross_method_role: work_context
  recommendation_role: work_service_router
  mobile_role: fifteen_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/f01); 60Q/8 results; shared pending-save key defect (T9); 2 dead-weight dims
  required_completion_work: fix T9; prune dead dims record; family report content
  activation_prerequisites: none blocking
- method_id: f02-workplace-fit
  name_ja: 職場環境フィット
  family: yorisou_original_assessment
  launch_group: launch_supporting
  user_need: 職場環境との相性の傾向を知る
  use_frequency: once_deep
  input_type: answers
  format_category: single_choice_weighted_60q
  result_type: archetype_8
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: job_change_retake
  cross_method_role: work_context
  recommendation_role: work_service_router
  mobile_role: fifteen_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/f02); 60Q/8 results; synthesized assignment (no fallback tier — structural asymmetry vs C02/F01)
  required_completion_work: document/decide fallback asymmetry; family report content
  activation_prerequisites: none blocking
- method_id: local-life
  name_ja: 暮らしの関心チェック
  family: yorisou_state
  launch_group: launch_supporting
  user_need: いまの暮らしの関心を軽く整理する
  use_frequency: situational
  input_type: answers
  format_category: single_choice_4q_micro
  result_type: theme_acknowledgement_5
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: none
  cross_method_role: lifestyle_context
  recommendation_role: local_service_router
  mobile_role: one_minute_completion
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/local-life); 4Q/5 themes (acknowledgement-style, not a result taxonomy); client-only; unversioned
  required_completion_work: keep as micro-reflection; versioning
  activation_prerequisites: none blocking
- method_id: yorisou-motivation
  name_ja: 動機リフレクション
  family: psychology_preference
  launch_group: launch_supporting
  user_need: 動機の傾向を整理する
  use_frequency: retake_casual
  input_type: answers
  format_category: single_choice_with_tradeoff
  result_type: archetype_6to8
  evidence_class: psychology_preference_nonclinical
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P1_answers_only
  longitudinal_role: lifestage_retake
  cross_method_role: preference_context
  recommendation_role: motivation_based_router
  mobile_role: ten_minute_completion
  activation_state: planned_unbuilt
  implementation_truth: registry entry only (not_started); no questions, no route (MTF-1 §3.6 FIXED — Supporting)
  required_completion_work: full content package
  activation_prerequisites: content package; founder review
- method_id: communication-rhythm
  name_ja: 連絡のリズムチェック
  family: yorisou_state
  launch_group: launch_supporting
  user_need: 連絡・返信の心地よいペースを知る
  use_frequency: retake_casual
  input_type: answers
  format_category: scenario_choice
  result_type: archetype_small_set
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P1_answers_only
  longitudinal_role: repeat_relationship_check
  cross_method_role: relationship_context
  recommendation_role: relationship_service_router
  mobile_role: five_minute_completion
  activation_state: planned_unbuilt
  implementation_truth: ABSENT (MTF-0 B.5 — never existed); new original build
  required_completion_work: full content package
  activation_prerequisites: content package; founder review
- method_id: recovery-rest
  name_ja: 休み方チェック
  family: yorisou_state
  launch_group: launch_supporting
  user_need: 自分に合う休み方・回復の傾向を知る
  use_frequency: retake_casual
  input_type: answers
  format_category: scenario_choice
  result_type: archetype_small_set
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P1_answers_only
  longitudinal_role: repeat_recovery_check
  cross_method_role: state_context
  recommendation_role: rest_service_router
  mobile_role: five_minute_completion
  activation_state: planned_unbuilt
  implementation_truth: ABSENT (MTF-0 B.5); new original build; must stay non-clinical (no sleep/health diagnosis)
  required_completion_work: full content package; trust-risk review (health-adjacent tone)
  activation_prerequisites: content package; trust-risk review; founder review
- method_id: name-pair-impression
  name_ja: 名前から受ける関係印象チェック
  family: relationship_compatibility
  launch_group: launch_supporting
  user_need: ふたりの名前の印象から関係の雰囲気を楽しく見る
  use_frequency: situational
  input_type: two_names_plus_answers
  format_category: name_pair_plus_optional_questions
  result_type: impression_reading_original_pool
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P3_two_person
  longitudinal_role: none
  cross_method_role: casual_pair_entry
  recommendation_role: casual_entry_router
  mobile_role: two_minute_completion
  activation_state: planned_unbuilt
  implementation_truth: R04 successor (MTF-1 §3.3 FIXED): name-impression + interaction-reflection product; NOT 姓名判断 / fate / compatibility certainty / marriage prediction / scientific evidence. R04 stays untouched on Production in MTF-1
  required_completion_work: original content pool; second-person name consent handling; boundary copy
  activation_prerequisites: originality review; consent handling for the second name; founder review
- method_id: s01-omikuji
  name_ja: 今日のおみくじ
  family: japanese_cultural_symbolic
  launch_group: launch_supporting
  user_need: 日本の文化的な軽い楽しみとして一日の始まりに引く
  use_frequency: daily
  input_type: optional_mood_inputs
  format_category: deterministic_seeded_draw
  result_type: omikuji_48_pool
  evidence_class: traditional_symbolic_entertainment
  rights_route: YORISOU_ORIGINAL_EXISTING
  privacy_class: P1_answers_only
  longitudinal_role: daily_ritual_entry_only
  cross_method_role: none_entertainment_only
  recommendation_role: none_entertainment_only
  mobile_role: ten_second_interaction
  activation_state: implemented_route_verified
  implementation_truth: production_active (/tests/s01); 48 original verses / 7 levels; seeded deterministic; MTF-1 §3.4 FIXED — traditional_symbolic_entertainment; MUST NOT update psychology evidence, personality dimensions, relationship compatibility, universal scores, or clinical/professional recommendations; Launch Supporting, never Core
  required_completion_work: classification metadata only (no route change in MTF-1)
  activation_prerequisites: registry entry carrying the entertainment classification
- method_id: yorisou-symbolic-cards
  name_ja: YORISOUシンボルカード
  family: western_symbolic
  launch_group: launch_supporting
  user_need: カードを引いて内省の入口にする
  use_frequency: repeat_weekly
  input_type: card_selection
  format_category: card_choice
  result_type: card_meaning_reflection
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P1_answers_only
  longitudinal_role: reflection_ritual
  cross_method_role: nonverbal_state_signal
  recommendation_role: gentle_entry_router
  mobile_role: visual_first_interaction
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; ORIGINAL YORISOU artwork + meanings required (no copied deck — §3.7); custom deck art NOT a V1 blocker
  required_completion_work: original deck (art + meanings); engine card-choice format
  activation_prerequisites: original artwork authored; founder review
- method_id: big-five-ipip
  name_ja: ビッグファイブ（IPIP準拠・検証待ち）
  family: psychology_preference
  launch_group: rights_review_queue
  user_need: 広く知られた5因子の傾向を内省用に見る
  use_frequency: once_deep
  input_type: answers
  format_category: five_point_scale_item_pool
  result_type: five_factor_profile_multi_result
  evidence_class: public_domain_psychometric_review
  rights_route: PUBLIC_DOMAIN_REIMPLEMENTATION_REVIEW
  privacy_class: P1_answers_only
  longitudinal_role: yearly_retake
  cross_method_role: preference_context
  recommendation_role: preference_router
  mobile_role: fifteen_minute_completion
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; IPIP claimed public-domain — source/jurisdiction/translation/commercial-use verification REQUIRED; JA item translation must be original; multi-result profile is an engine gap
  required_completion_work: IPIP source validation; original JA translation; multi-result engine support
  activation_prerequisites: rights review complete; engine multi-result; founder review
- method_id: dream-reflection
  name_ja: 夢のふり返り
  family: western_symbolic
  launch_group: rights_review_queue
  user_need: 夢を手がかりに内省する
  use_frequency: situational
  input_type: free_text
  format_category: free_text_guided_prompts
  result_type: reflective_record
  evidence_class: yorisou_original_reflection
  rights_route: YORISOU_ORIGINAL_REBUILD_CANDIDATE
  privacy_class: P5_free_text
  longitudinal_role: dream_journal_over_time
  cross_method_role: nonverbal_state_signal
  recommendation_role: none
  mobile_role: journaling_interaction
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; original reflective prompts required (no third-party dream dictionary); queue placement = prompt-originality review pending
  required_completion_work: original prompt set; free-text privacy handling
  activation_prerequisites: originality review of prompts; free-text privacy review; founder review
- method_id: numerology
  name_ja: 数秘術
  family: western_symbolic
  launch_group: rights_review_queue
  user_need: 数の象徴で軽く自分を眺める
  use_frequency: situational
  input_type: birth_date_and_name
  format_category: deterministic_calculator
  result_type: symbolic_reading
  evidence_class: traditional_symbolic
  rights_route: PUBLIC_DOMAIN_REIMPLEMENTATION_REVIEW
  privacy_class: P4_birth_data
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: instant_calculation
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; reduction rules simple/PD-claimed (system Pythagorean vs Chaldean must be explicit); ALL interpretation text must be original
  required_completion_work: system selection; original interpretation corpus; birth-data retention policy
  activation_prerequisites: rights review; retention policy; founder review
- method_id: i-ching
  name_ja: 易経
  family: chinese_traditional
  launch_group: rights_review_queue
  user_need: 問いを立てて卦を引き内省の入口にする
  use_frequency: situational
  input_type: selection
  format_category: deterministic_seeded_draw
  result_type: hexagram_reading
  evidence_class: traditional_symbolic
  rights_route: PUBLIC_DOMAIN_REIMPLEMENTATION_REVIEW
  privacy_class: P1_answers_only
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: instant_draw
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; classical text may be PD but modern translations are NOT; edition/translation route unresolved
  required_completion_work: edition selection; original or verified-PD JA rendering; commentary authorship
  activation_prerequisites: rights review; founder review
- method_id: chinese-zodiac
  name_ja: 生肖（十二支）
  family: chinese_traditional
  launch_group: rights_review_queue
  user_need: 生まれ年の象徴を軽く楽しむ
  use_frequency: situational
  input_type: birth_date
  format_category: deterministic_calculator
  result_type: symbolic_reading
  evidence_class: traditional_symbolic
  rights_route: PUBLIC_DOMAIN_REIMPLEMENTATION_REVIEW
  privacy_class: P4_birth_data
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: instant_calculation
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; sign mapping trivial (calendar provenance required); ALL interpretation text must be original
  required_completion_work: original interpretation text; calendar provenance; retention policy
  activation_prerequisites: rights review; founder review
- method_id: name-hanzi-reflection
  name_ja: 姓名・漢字リフレクション
  family: chinese_traditional
  launch_group: rights_review_queue
  user_need: 漢字の意味・成り立ちから名前を眺める
  use_frequency: situational
  input_type: name
  format_category: deterministic_calculator_plus_reflection
  result_type: symbolic_reading
  evidence_class: traditional_symbolic
  rights_route: TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW
  privacy_class: P2_name_input
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: instant_interaction
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; stroke/meaning model must be explicit; do NOT copy 姓名判断 tables; distinct from the shipped name-impression AND from name-pair-impression
  required_completion_work: school/model decision; original meaning corpus
  activation_prerequisites: source+school review; founder review
- method_id: astrology-natal
  name_ja: 占星術・出生図
  family: western_symbolic
  launch_group: rights_review_queue
  user_need: 出生図を象徴的な内省に使う
  use_frequency: once_deep
  input_type: birth_date_time_location
  format_category: deterministic_calculator_ephemeris
  result_type: chart_reading
  evidence_class: traditional_symbolic
  rights_route: LICENSED_INTEGRATION_REQUIRED
  privacy_class: P4_birth_data
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: deep_visual_surface
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; requires LICENSED ephemeris data + original interpretation; house system + zodiac must be explicit
  required_completion_work: ephemeris licence; original interpretation corpus; birth-data retention policy
  activation_prerequisites: licence resolution; retention policy; founder review
- method_id: ziwei-dou-shu
  name_ja: 紫微斗数
  family: chinese_traditional
  launch_group: later_cultural_systems
  user_need: 東洋占星の象徴体系での内省
  use_frequency: once_deep
  input_type: birth_date_time
  format_category: deterministic_calculator_chart
  result_type: chart_reading
  evidence_class: traditional_symbolic
  rights_route: TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW
  privacy_class: P4_birth_data
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: deep_visual_surface
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; school/variant + calculation rules + commentary ownership all unresolved; NOT an App V1 blocker
  required_completion_work: full traditional-source review chain
  activation_prerequisites: source+school review; founder review
- method_id: bazi-four-pillars
  name_ja: 八字・四柱推命
  family: chinese_traditional
  launch_group: later_cultural_systems
  user_need: 四柱の象徴体系での内省
  use_frequency: once_deep
  input_type: birth_date_time
  format_category: deterministic_calculator_chart
  result_type: chart_reading
  evidence_class: traditional_symbolic
  rights_route: TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW
  privacy_class: P4_birth_data
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: deep_visual_surface
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; calendar/timezone provenance + school + interpretation corpus unresolved
  required_completion_work: full traditional-source review chain
  activation_prerequisites: source+school review; founder review
- method_id: cheng-gu
  name_ja: 称骨
  family: chinese_traditional
  launch_group: later_cultural_systems
  user_need: 伝統的な軽い象徴参照
  use_frequency: situational
  input_type: birth_date_time
  format_category: deterministic_table_lookup
  result_type: verse_reading
  evidence_class: traditional_symbolic
  rights_route: TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW
  privacy_class: P4_birth_data
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: instant_lookup
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; table variant + verse text ownership unresolved
  required_completion_work: table-variant decision; verse authorship
  activation_prerequisites: source review; founder review
- method_id: five-elements
  name_ja: 五行
  family: chinese_traditional
  launch_group: later_cultural_systems
  user_need: 五行バランスの象徴で自分を眺める
  use_frequency: situational
  input_type: birth_date
  format_category: deterministic_calculator
  result_type: balance_reading
  evidence_class: traditional_symbolic
  rights_route: TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW
  privacy_class: P4_birth_data
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: instant_calculation
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; mapping model + interpretation corpus unresolved
  required_completion_work: mapping-model decision; original corpus
  activation_prerequisites: source review; founder review
- method_id: tarot
  name_ja: タロット
  family: western_symbolic
  launch_group: later_cultural_systems
  user_need: カードの象徴での内省
  use_frequency: situational
  input_type: card_selection
  format_category: card_choice
  result_type: card_reading
  evidence_class: traditional_symbolic
  rights_route: LICENSED_INTEGRATION_REQUIRED
  privacy_class: P1_answers_only
  longitudinal_role: none
  cross_method_role: none_symbolic_only
  recommendation_role: none
  mobile_role: visual_first_interaction
  activation_state: planned_unbuilt
  implementation_truth: registry entry only; deck artwork + spread + interpretation all unresolved; a fully-original YORISOU deck would re-route this to REBUILD (recorded as a potential future founder decision, not made here); no modern deck may be copied
  required_completion_work: deck decision (licence vs original); interpretation authorship
  activation_prerequisites: deck/licence resolution; founder review
```

## Group summary (human view)

| Group | Methods |
|---|---|
| **Launch Core (10)** | imairo-120q · c02-current-state · relationship-fatigue-24q · love-distance · work-rhythm · name-impression · daily-check-in · relationship-pair-check · yorisou-values · image-color-reflection |
| **Launch Supporting (9)** | f01-work-fit · f02-workplace-fit · local-life · yorisou-motivation · communication-rhythm · recovery-rest · name-pair-impression · s01-omikuji · yorisou-symbolic-cards |
| **Rights Review Queue (7)** | big-five-ipip · dream-reflection · numerology · i-ching · chinese-zodiac · name-hanzi-reflection · astrology-natal |
| **Later Cultural Systems (5 + open class)** | ziwei-dou-shu · bazi-four-pillars · cheng-gu · five-elements · tarot (+ any other school-dependent traditional system proposed later) |

## Registry-carried methods outside the launch groups

- `mbti-import-handoff` — remains in the CPV1 registry as **import / official-handoff / licence only**; it is intentionally NOT part of any launch group. Embedding an unlicensed MBTI instrument remains prohibited.
- `reflection-cadence` (registry umbrella) — the **daily slice** is productized as `daily-check-in` (Launch Core). Weekly/monthly/seasonal/annual cadences remain contract-level under the umbrella entry until separately productized.
- Dormant systems (DTE 33Q/21-dim/31-persona engine, oracle lines, `/en/result` lab, companion archetypes) are **not launch methods** — see `MTF1_EXISTING_ENGINE_ADAPTER_MAP.md`.
- **R01 / R04 / S01 production routes are untouched by MTF-1** (§3.2–§3.4): R01 and R04 continue serving on Production unchanged while their successors (`relationship-pair-check`, `name-pair-impression`) are built; their eventual transition is a later, separately-authorized package. S01 continues as-is and is carried forward under the `s01-omikuji` canonical ID.

## Non-negotiable universe rules

1. No universal cross-method score exists or may be introduced.
2. `traditional_symbolic` / `traditional_symbolic_entertainment` output never updates psychology evidence, personality dimensions, relationship compatibility, universal scores, or clinical/professional recommendations.
3. Every method keeps its own result identity; cross-method use happens only through the source-separated CPV1 understanding model (user-confirmable observations), never by merging taxonomies.
4. Activation of ANY method (including Launch Core) follows the CPV1 evidence-gated model on `main` — 10-dimension `public_active` gate with deployment evidence + Founder decision refs. Launch-group membership is a product-planning fact, NOT an activation.
