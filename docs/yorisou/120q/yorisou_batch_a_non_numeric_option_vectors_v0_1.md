YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_BATCH_A_Q001_Q040_V0_1

Executive status:
- source protocol: YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_PROTOCOL_V0_1
- source mapping rules: YORISOU_NON_NUMERIC_AXIS_MAPPING_RULES_FOR_SIGNAL_TAGS_V0_1
- source framework: YORISOU_SCOREVECTOR_FRAMEWORK_DESIGN_V0_1
- source signal batch: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_A_Q001_Q040_V0_1
- batch scope: Q001–Q040 only
- application status: DRAFT_READY_FOR_REVIEW
- numeric score assignment: NOT APPROVED
- scoring formula: NOT APPROVED
- implementation readiness: NOT APPROVED
- result taxonomy readiness: NOT_STARTED
- launch readiness: NOT_APPROVED
- authorized next step: Batch A non-numeric option vector application review and refinement
- prohibited next steps: Batch B application, Batch C application, full 120Q application, numeric scoring, formulas, code, result taxonomy, result names, result copy, report copy, launch approval

Batch packaging:
- batchId: BATCH_A_Q001_Q040_NON_NUMERIC_OPTION_VECTOR_APPLICATION_V0_1
- sourceBatch: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_A_Q001_Q040_V0_1
- questionsCovered: Q001–Q040
- optionsCovered: 200 / 200
- applicationScope: Batch A only; Q001–Q040 only; non-numeric option vectors only
- applicationStatus: non_numeric_option_vector_application_draft_ready_for_review
- protocolVersion: YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_PROTOCOL_V0_1
- mappingRulesVersion: YORISOU_NON_NUMERIC_AXIS_MAPPING_RULES_FOR_SIGNAL_TAGS_V0_1
- frameworkVersion: YORISOU_SCOREVECTOR_FRAMEWORK_DESIGN_V0_1
- sourceSignalBatchVersion: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_A_Q001_Q040_V0_1

Batch pre-check:
- all Q001–Q040 present: YES
- all 200 options present: YES
- all signal tags approved: YES
- no numeric fields created: YES
- no formulas created: YES
- no code created: YES
- no public-facing copy generated: YES
- no result taxonomy generated: YES

Option vectors:

Q001:
  A:
    optionVectorId: Q001_A_NON_NUMERIC_VECTOR
    questionId: Q001
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: core_behavior
    optionId: A
    sourceOptionText: まず小さく手をつけると流れに入りやすい
    primarySignal: small_start
    secondarySignals: [schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; small_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q001_B_NON_NUMERIC_VECTOR
    questionId: Q001
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: core_behavior
    optionId: B
    sourceOptionText: 少し様子を見てから動き始めることが多い
    primarySignal: delayed_entry
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary delayed_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; delayed_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q001_C_NON_NUMERIC_VECTOR
    questionId: Q001
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: core_behavior
    optionId: C
    sourceOptionText: 予定よりも気分や体の重さに左右されやすい
    primarySignal: contextual_entry
    secondarySignals: [inner_weight_accumulation, schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary contextual_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; contextual_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q001_D_NON_NUMERIC_VECTOR
    questionId: Q001
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: core_behavior
    optionId: D
    sourceOptionText: 人や連絡があると始まりやすい
    primarySignal: socially_triggered_entry
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary socially_triggered_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; socially_triggered_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q001_E_NON_NUMERIC_VECTOR
    questionId: Q001
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: core_behavior
    optionId: E
    sourceOptionText: 始める前に頭の中を整える時間がほしい
    primarySignal: preparation_needed
    secondarySignals: [criteria_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q002:
  A:
    optionVectorId: Q002_A_NON_NUMERIC_VECTOR
    questionId: Q002
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 最初の一つだけ決めると動ける
    primarySignal: small_start
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; small_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q002_B_NON_NUMERIC_VECTOR
    questionId: Q002
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 急ぐほど何から始めるか迷いやすい
    primarySignal: delayed_entry
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary delayed_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; delayed_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q002_C_NON_NUMERIC_VECTOR
    questionId: Q002
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: とりあえず動きながら整えていく
    primarySignal: contextual_entry
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary contextual_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; contextual_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q002_D_NON_NUMERIC_VECTOR
    questionId: Q002
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 先に連絡や確認を片づけたくなる
    primarySignal: socially_triggered_entry
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary socially_triggered_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; socially_triggered_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q002_E_NON_NUMERIC_VECTOR
    questionId: Q002
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 少し止まって全体を見ないと入りにくい
    primarySignal: preparation_needed
    secondarySignals: [inner_weight_accumulation, criteria_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis, clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied

Q003:
  A:
    optionVectorId: Q003_A_NON_NUMERIC_VECTOR
    questionId: Q003
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: social_contextual
    optionId: A
    sourceOptionText: 待っている人がいると切り替えやすい
    primarySignal: small_start
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; small_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q003_B_NON_NUMERIC_VECTOR
    questionId: Q003
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: social_contextual
    optionId: B
    sourceOptionText: 気になって早めに準備しすぎる
    primarySignal: delayed_entry
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary delayed_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; delayed_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q003_C_NON_NUMERIC_VECTOR
    questionId: Q003
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: social_contextual
    optionId: C
    sourceOptionText: 相手に合わせる分、自分の流れが後回しになる
    primarySignal: contextual_entry
    secondarySignals: [social_modulation, schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary contextual_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; contextual_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q003_D_NON_NUMERIC_VECTOR
    questionId: Q003
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: social_contextual
    optionId: D
    sourceOptionText: 連絡の有無で気持ちの入り方が変わる
    primarySignal: socially_triggered_entry
    secondarySignals: [social_modulation, inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary socially_triggered_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; socially_triggered_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q003_E_NON_NUMERIC_VECTOR
    questionId: Q003
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: social_contextual
    optionId: E
    sourceOptionText: 一人の時間が少しないと落ち着いて入れない
    primarySignal: preparation_needed
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied

Q004:
  A:
    optionVectorId: Q004_A_NON_NUMERIC_VECTOR
    questionId: Q004
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: すぐできる用事から始めると戻りやすい
    primarySignal: small_start
    secondarySignals: [transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: transition_reentry: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; small_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q004_B_NON_NUMERIC_VECTOR
    questionId: Q004
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 予定を少し減らすと戻りやすい
    primarySignal: delayed_entry
    secondarySignals: [schedule_reframe, transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: native auxiliary modifier; transition_reentry: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; delayed_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q004_C_NON_NUMERIC_VECTOR
    questionId: Q004
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 人と話すと流れに入り直しやすい
    primarySignal: contextual_entry
    secondarySignals: [social_start_support, social_modulation, schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_start_support: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary contextual_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_start_support: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; contextual_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q004_D_NON_NUMERIC_VECTOR
    questionId: Q004
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: ひと息置くと次に向かいやすい
    primarySignal: socially_triggered_entry
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary socially_triggered_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; socially_triggered_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q004_E_NON_NUMERIC_VECTOR
    questionId: Q004
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: その日の流れを組み直すと戻りやすい
    primarySignal: preparation_needed
    secondarySignals: [schedule_reframe, transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: native auxiliary modifier; transition_reentry: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q005:
  A:
    optionVectorId: Q005_A_NON_NUMERIC_VECTOR
    questionId: Q005
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 最初にやることが小さく決まっている
    primarySignal: small_start
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; small_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q005_B_NON_NUMERIC_VECTOR
    questionId: Q005
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 前の日から少し見通しがある
    primarySignal: delayed_entry
    secondarySignals: [criteria_awareness, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; delayed_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q005_C_NON_NUMERIC_VECTOR
    questionId: Q005
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 誰かとの約束や区切りがある
    primarySignal: contextual_entry
    secondarySignals: [social_modulation, continuation_by_marker, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary contextual_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, later_review
    privateInterpretationBoundary: private/internal interpretation only; contextual_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q005_D_NON_NUMERIC_VECTOR
    questionId: Q005
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 体や気持ちに余白がある
    primarySignal: socially_triggered_entry
    secondarySignals: [inner_weight_accumulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary socially_triggered_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; socially_triggered_entry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q005_E_NON_NUMERIC_VECTOR
    questionId: Q005
    dimensionCode: DR
    subdimensionCode: DR_STARTING_POINT
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: その日の優先順位を言葉にできている
    primarySignal: preparation_needed
    secondarySignals: [load_externalization, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q006:
  A:
    optionVectorId: Q006_A_NON_NUMERIC_VECTOR
    questionId: Q006
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: core_behavior
    optionId: A
    sourceOptionText: 区切りが見えると自然に移りやすい
    primarySignal: transition_buffer
    secondarySignals: [continuation_by_marker, transition_reentry]
    primarySignalRole: native primary driver
    secondarySignalRoles: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: native auxiliary modifier
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q006_B_NON_NUMERIC_VECTOR
    questionId: Q006
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: core_behavior
    optionId: B
    sourceOptionText: 前のことが残って、少し時間がかかる
    primarySignal: post_event_residue
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=rhythm_daily_flow; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; post_event_residue is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q006_C_NON_NUMERIC_VECTOR
    questionId: Q006
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: core_behavior
    optionId: C
    sourceOptionText: 次の予定が決まっていると移りやすい
    primarySignal: routine_anchor
    secondarySignals: [schedule_reframe, transition_reentry]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: native auxiliary modifier; transition_reentry: native auxiliary modifier
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q006_D_NON_NUMERIC_VECTOR
    questionId: Q006
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: core_behavior
    optionId: D
    sourceOptionText: 気持ちより先に体を動かして移る
    primarySignal: transition_reentry
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_reentry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q006_E_NON_NUMERIC_VECTOR
    questionId: Q006
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: core_behavior
    optionId: E
    sourceOptionText: 間に短い空白があると移りやすい
    primarySignal: transition_buffer
    secondarySignals: [transition_reentry]
    primarySignalRole: native primary driver
    secondarySignalRoles: transition_reentry: native auxiliary modifier
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q007:
  A:
    optionVectorId: Q007_A_NON_NUMERIC_VECTOR
    questionId: Q007
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: すぐ次の手順を探し始める
    primarySignal: transition_buffer
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q007_B_NON_NUMERIC_VECTOR
    questionId: Q007
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 一度止まって状況を確かめたくなる
    primarySignal: post_event_residue
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=rhythm_daily_flow; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; post_event_residue is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q007_C_NON_NUMERIC_VECTOR
    questionId: Q007
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 予定変更の理由がわかると移りやすい
    primarySignal: routine_anchor
    secondarySignals: [criteria_awareness, schedule_reframe, transition_reentry]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier; transition_reentry: native auxiliary modifier
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis, clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q007_D_NON_NUMERIC_VECTOR
    questionId: Q007
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 先に気持ちを落ち着ける時間がいる
    primarySignal: transition_reentry
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_reentry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q007_E_NON_NUMERIC_VECTOR
    questionId: Q007
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 誰かの動きに合わせると移りやすい
    primarySignal: transition_buffer
    secondarySignals: [social_modulation, transition_reentry]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: native auxiliary modifier
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied

Q008:
  A:
    optionVectorId: Q008_A_NON_NUMERIC_VECTOR
    questionId: Q008
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: social_contextual
    optionId: A
    sourceOptionText: 相手の流れに合わせてすぐ動く
    primarySignal: transition_buffer
    secondarySignals: [social_modulation, schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q008_B_NON_NUMERIC_VECTOR
    questionId: Q008
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: social_contextual
    optionId: B
    sourceOptionText: 合わせるけれど、自分の中では少し残る
    primarySignal: post_event_residue
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=rhythm_daily_flow; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; post_event_residue is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q008_C_NON_NUMERIC_VECTOR
    questionId: Q008
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: social_contextual
    optionId: C
    sourceOptionText: 変更点がはっきりすると受け入れやすい
    primarySignal: routine_anchor
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q008_D_NON_NUMERIC_VECTOR
    questionId: Q008
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: social_contextual
    optionId: D
    sourceOptionText: 自分の予定を組み直す時間がほしい
    primarySignal: transition_reentry
    secondarySignals: [schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; transition_reentry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q008_E_NON_NUMERIC_VECTOR
    questionId: Q008
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: social_contextual
    optionId: E
    sourceOptionText: その場では合わせて、あとで整える
    primarySignal: transition_buffer
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q009:
  A:
    optionVectorId: Q009_A_NON_NUMERIC_VECTOR
    questionId: Q009
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 次の一つだけに絞ると戻りやすい
    primarySignal: transition_buffer
    secondarySignals: [small_start, transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: native auxiliary modifier; transition_reentry: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q009_B_NON_NUMERIC_VECTOR
    questionId: Q009
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 短く休むと流れをつかみ直せる
    primarySignal: post_event_residue
    secondarySignals: [schedule_reframe, method_shift]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: schedule_reframe: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=rhythm_daily_flow; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; post_event_residue is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q009_C_NON_NUMERIC_VECTOR
    questionId: Q009
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 書き出すと次へ移りやすい
    primarySignal: routine_anchor
    secondarySignals: [load_externalization, transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q009_D_NON_NUMERIC_VECTOR
    questionId: Q009
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かと確認すると動きやすい
    primarySignal: transition_reentry
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; transition_reentry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q009_E_NON_NUMERIC_VECTOR
    questionId: Q009
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 前のことを一度終わらせると戻れる
    primarySignal: transition_buffer
    secondarySignals: [continuation_by_marker, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, action_entry_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q010:
  A:
    optionVectorId: Q010_A_NON_NUMERIC_VECTOR
    questionId: Q010
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 前のことに区切りがついている
    primarySignal: transition_buffer
    secondarySignals: [continuation_by_marker, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q010_B_NON_NUMERIC_VECTOR
    questionId: Q010
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 次のことの入口が見えている
    primarySignal: post_event_residue
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=rhythm_daily_flow; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; post_event_residue is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q010_C_NON_NUMERIC_VECTOR
    questionId: Q010
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 間に短い余白がある
    primarySignal: routine_anchor
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q010_D_NON_NUMERIC_VECTOR
    questionId: Q010
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 周りの動きが落ち着いている
    primarySignal: transition_reentry
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; transition_reentry is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q010_E_NON_NUMERIC_VECTOR
    questionId: Q010
    dimensionCode: DR
    subdimensionCode: DR_TRANSITION
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 自分のペースを少し保てている
    primarySignal: transition_buffer
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; transition_buffer is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q011:
  A:
    optionVectorId: Q011_A_NON_NUMERIC_VECTOR
    questionId: Q011
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: core_behavior
    optionId: A
    sourceOptionText: あると一日の土台になりやすい
    primarySignal: routine_anchor
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q011_B_NON_NUMERIC_VECTOR
    questionId: Q011
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: core_behavior
    optionId: B
    sourceOptionText: あると楽だが、崩れても別の形を探す
    primarySignal: routine_flexibility
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q011_C_NON_NUMERIC_VECTOR
    questionId: Q011
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: core_behavior
    optionId: C
    sourceOptionText: 決まりすぎると少し窮屈に感じる
    primarySignal: routine_disruption
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_disruption nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_disruption is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q011_D_NON_NUMERIC_VECTOR
    questionId: Q011
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: core_behavior
    optionId: D
    sourceOptionText: 人や予定に合わせて変わることが多い
    primarySignal: social_rhythm_modulation
    secondarySignals: [social_modulation, schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary social_rhythm_modulation nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; social_rhythm_modulation is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q011_E_NON_NUMERIC_VECTOR
    questionId: Q011
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: core_behavior
    optionId: E
    sourceOptionText: 意識していないが、実は似た流れがある
    primarySignal: schedule_reframe
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; schedule_reframe is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q012:
  A:
    optionVectorId: Q012_A_NON_NUMERIC_VECTOR
    questionId: Q012
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 逆にいつもの流れを頼りにする
    primarySignal: routine_anchor
    secondarySignals: [schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q012_B_NON_NUMERIC_VECTOR
    questionId: Q012
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 短くした形で残そうとする
    primarySignal: routine_flexibility
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q012_C_NON_NUMERIC_VECTOR
    questionId: Q012
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: いったん崩れて、あとで戻す
    primarySignal: routine_disruption
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_disruption nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_disruption is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q012_D_NON_NUMERIC_VECTOR
    questionId: Q012
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: その場の予定に合わせて変えていく
    primarySignal: social_rhythm_modulation
    secondarySignals: [schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary social_rhythm_modulation nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; social_rhythm_modulation is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q012_E_NON_NUMERIC_VECTOR
    questionId: Q012
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 崩れたことに気づくのが少し後になる
    primarySignal: schedule_reframe
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; schedule_reframe is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q013:
  A:
    optionVectorId: Q013_A_NON_NUMERIC_VECTOR
    questionId: Q013
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: social_contextual
    optionId: A
    sourceOptionText: 相手に合わせながらも少し残す
    primarySignal: routine_anchor
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q013_B_NON_NUMERIC_VECTOR
    questionId: Q013
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: social_contextual
    optionId: B
    sourceOptionText: 相手の流れに入りやすい
    primarySignal: routine_flexibility
    secondarySignals: [social_modulation, schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q013_C_NON_NUMERIC_VECTOR
    questionId: Q013
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: social_contextual
    optionId: C
    sourceOptionText: 後で一人の時間に取り戻す
    primarySignal: routine_disruption
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_disruption nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; routine_disruption is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q013_D_NON_NUMERIC_VECTOR
    questionId: Q013
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: social_contextual
    optionId: D
    sourceOptionText: その日はあまり気にしない
    primarySignal: social_rhythm_modulation
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary social_rhythm_modulation nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_rhythm_modulation is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q013_E_NON_NUMERIC_VECTOR
    questionId: Q013
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: social_contextual
    optionId: E
    sourceOptionText: 自分の流れが崩れると落ち着きにくい
    primarySignal: schedule_reframe
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; schedule_reframe is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q014:
  A:
    optionVectorId: Q014_A_NON_NUMERIC_VECTOR
    questionId: Q014
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 一番小さい習慣だけ戻す
    primarySignal: routine_anchor
    secondarySignals: [small_start, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q014_B_NON_NUMERIC_VECTOR
    questionId: Q014
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 次の日から自然に戻るのを待つ
    primarySignal: routine_flexibility
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q014_C_NON_NUMERIC_VECTOR
    questionId: Q014
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 時間や場所を変えて作り直す
    primarySignal: routine_disruption
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_disruption nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_disruption is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q014_D_NON_NUMERIC_VECTOR
    questionId: Q014
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かとの予定をきっかけに戻す
    primarySignal: social_rhythm_modulation
    secondarySignals: [social_modulation, schedule_reframe, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_rhythm_modulation nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; social_rhythm_modulation is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q014_E_NON_NUMERIC_VECTOR
    questionId: Q014
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: いったん別の流れとして組み直す
    primarySignal: schedule_reframe
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; schedule_reframe is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q015:
  A:
    optionVectorId: Q015_A_NON_NUMERIC_VECTOR
    questionId: Q015
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 朝や夜の決まった動き
    primarySignal: routine_anchor
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; routine_anchor is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q015_B_NON_NUMERIC_VECTOR
    questionId: Q015
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 飲み物や場所などの小さな合図
    primarySignal: routine_flexibility
    secondarySignals: [small_start, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q015_C_NON_NUMERIC_VECTOR
    questionId: Q015
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 書く、並べる、片づけるような手順
    primarySignal: routine_disruption
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_disruption nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; routine_disruption is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q015_D_NON_NUMERIC_VECTOR
    questionId: Q015
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 誰かとの短いやりとり
    primarySignal: social_rhythm_modulation
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_rhythm_modulation nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, later_review
    privateInterpretationBoundary: private/internal interpretation only; social_rhythm_modulation is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q015_E_NON_NUMERIC_VECTOR
    questionId: Q015
    dimensionCode: DR
    subdimensionCode: DR_ROUTINE_ANCHOR
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: はっきり決めていない余白の時間
    primarySignal: schedule_reframe
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=rhythm_daily_flow; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe, later_review
    privateInterpretationBoundary: private/internal interpretation only; schedule_reframe is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q016:
  A:
    optionVectorId: Q016_A_NON_NUMERIC_VECTOR
    questionId: Q016
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: core_behavior
    optionId: A
    sourceOptionText: まず大きく分けると考えやすい
    primarySignal: criteria_based_choice
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q016_B_NON_NUMERIC_VECTOR
    questionId: Q016
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: core_behavior
    optionId: B
    sourceOptionText: それぞれ気になって決めるまで時間がかかる
    primarySignal: option_overload
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary option_overload nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; option_overload is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q016_C_NON_NUMERIC_VECTOR
    questionId: Q016
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: core_behavior
    optionId: C
    sourceOptionText: 直感で一つ選んでから確かめる
    primarySignal: reversible_choice
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q016_D_NON_NUMERIC_VECTOR
    questionId: Q016
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: core_behavior
    optionId: D
    sourceOptionText: 誰かの意見を聞くと整理しやすい
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q016_E_NON_NUMERIC_VECTOR
    questionId: Q016
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: core_behavior
    optionId: E
    sourceOptionText: いったん置くと見え方が変わる
    primarySignal: decision_pause
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary decision_pause nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; decision_pause is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q017:
  A:
    optionVectorId: Q017_A_NON_NUMERIC_VECTOR
    questionId: Q017
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 条件を一つ決めると選びやすい
    primarySignal: criteria_based_choice
    secondarySignals: [criteria_awareness, small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: native auxiliary modifier; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q017_B_NON_NUMERIC_VECTOR
    questionId: Q017
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 急ぐほどどれも気になってくる
    primarySignal: option_overload
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary option_overload nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; option_overload is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q017_C_NON_NUMERIC_VECTOR
    questionId: Q017
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: まず無理の少ないものを選ぶ
    primarySignal: reversible_choice
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q017_D_NON_NUMERIC_VECTOR
    questionId: Q017
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 誰かに確認してから進めたくなる
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q017_E_NON_NUMERIC_VECTOR
    questionId: Q017
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: あとで変えられるかを考える
    primarySignal: decision_pause
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary decision_pause nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; decision_pause is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q018:
  A:
    optionVectorId: Q018_A_NON_NUMERIC_VECTOR
    questionId: Q018
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: social_contextual
    optionId: A
    sourceOptionText: 参考にしつつ、自分の条件に戻す
    primarySignal: criteria_based_choice
    secondarySignals: [criteria_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: native auxiliary modifier
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q018_B_NON_NUMERIC_VECTOR
    questionId: Q018
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: social_contextual
    optionId: B
    sourceOptionText: 意見が増えるほど迷いやすい
    primarySignal: option_overload
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary option_overload nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; option_overload is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q018_C_NON_NUMERIC_VECTOR
    questionId: Q018
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: social_contextual
    optionId: C
    sourceOptionText: 一番強く言われたものが気になりやすい
    primarySignal: reversible_choice
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q018_D_NON_NUMERIC_VECTOR
    questionId: Q018
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: social_contextual
    optionId: D
    sourceOptionText: いったん一人で考える時間がほしい
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q018_E_NON_NUMERIC_VECTOR
    questionId: Q018
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: social_contextual
    optionId: E
    sourceOptionText: 誰の意見かによって重みが変わる
    primarySignal: decision_pause
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary decision_pause nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; decision_pause is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied

Q019:
  A:
    optionVectorId: Q019_A_NON_NUMERIC_VECTOR
    questionId: Q019
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: まず選ばないものを外す
    primarySignal: criteria_based_choice
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q019_B_NON_NUMERIC_VECTOR
    questionId: Q019
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 今いちばん大事な条件を一つ置く
    primarySignal: option_overload
    secondarySignals: [criteria_awareness, small_start, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: native auxiliary modifier; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary option_overload nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; option_overload is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q019_C_NON_NUMERIC_VECTOR
    questionId: Q019
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 紙やメモに出すと見えやすい
    primarySignal: reversible_choice
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q019_D_NON_NUMERIC_VECTOR
    questionId: Q019
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 少し時間をあけて見直す
    primarySignal: social_input_sensitive
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q019_E_NON_NUMERIC_VECTOR
    questionId: Q019
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 誰かに話して言葉にする
    primarySignal: decision_pause
    secondarySignals: [social_start_support, social_modulation, load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_start_support: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary decision_pause nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_start_support: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, action_entry_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; decision_pause is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied

Q020:
  A:
    optionVectorId: Q020_A_NON_NUMERIC_VECTOR
    questionId: Q020
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 比べる軸が少ないこと
    primarySignal: criteria_based_choice
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q020_B_NON_NUMERIC_VECTOR
    questionId: Q020
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 時間に少し余裕があること
    primarySignal: option_overload
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary option_overload nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; option_overload is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q020_C_NON_NUMERIC_VECTOR
    questionId: Q020
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 選んだあとに直せる余地があること
    primarySignal: reversible_choice
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q020_D_NON_NUMERIC_VECTOR
    questionId: Q020
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 信頼できる人に話せること
    primarySignal: social_input_sensitive
    secondarySignals: [social_start_support, social_modulation, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_start_support: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_start_support: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, action_entry_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, later_review
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q020_E_NON_NUMERIC_VECTOR
    questionId: Q020
    dimensionCode: CL
    subdimensionCode: CL_OPTION_LOAD
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 自分が何を避けたいか見えていること
    primarySignal: decision_pause
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary decision_pause nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; decision_pause is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q021:
  A:
    optionVectorId: Q021_A_NON_NUMERIC_VECTOR
    questionId: Q021
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: core_behavior
    optionId: A
    sourceOptionText: 今の自分に無理が少ないこと
    primarySignal: criteria_based_choice
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q021_B_NON_NUMERIC_VECTOR
    questionId: Q021
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: core_behavior
    optionId: B
    sourceOptionText: 後で納得しやすいこと
    primarySignal: whole_picture_needed
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=clarity_decision; alignment=cross-family
    crossFamilyModifiers: whole_picture_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q021_C_NON_NUMERIC_VECTOR
    questionId: Q021
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: core_behavior
    optionId: C
    sourceOptionText: 周りとの流れが合うこと
    primarySignal: social_input_sensitive
    secondarySignals: [schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q021_D_NON_NUMERIC_VECTOR
    questionId: Q021
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: core_behavior
    optionId: D
    sourceOptionText: 早く動き出せること
    primarySignal: criteria_awareness
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q021_E_NON_NUMERIC_VECTOR
    questionId: Q021
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: core_behavior
    optionId: E
    sourceOptionText: 長く続けやすそうなこと
    primarySignal: reversible_choice
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q022:
  A:
    optionVectorId: Q022_A_NON_NUMERIC_VECTOR
    questionId: Q022
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 今わかっている範囲で一番小さい選択
    primarySignal: criteria_based_choice
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q022_B_NON_NUMERIC_VECTOR
    questionId: Q022
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 後で変えやすい選択
    primarySignal: whole_picture_needed
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=clarity_decision; alignment=cross-family
    crossFamilyModifiers: whole_picture_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q022_C_NON_NUMERIC_VECTOR
    questionId: Q022
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 信頼できる人の見方
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q022_D_NON_NUMERIC_VECTOR
    questionId: Q022
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 自分の負担が増えにくい選択
    primarySignal: criteria_awareness
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q022_E_NON_NUMERIC_VECTOR
    questionId: Q022
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: まず試せる形にすること
    primarySignal: reversible_choice
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q023:
  A:
    optionVectorId: Q023_A_NON_NUMERIC_VECTOR
    questionId: Q023
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: social_contextual
    optionId: A
    sourceOptionText: 自分の基準を確かめ直す
    primarySignal: criteria_based_choice
    secondarySignals: [criteria_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: native auxiliary modifier
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q023_B_NON_NUMERIC_VECTOR
    questionId: Q023
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: social_contextual
    optionId: B
    sourceOptionText: 周りの見方も入れて考え直す
    primarySignal: whole_picture_needed
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=clarity_decision; alignment=cross-family
    crossFamilyModifiers: whole_picture_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q023_C_NON_NUMERIC_VECTOR
    questionId: Q023
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: social_contextual
    optionId: C
    sourceOptionText: その場では周りに合わせやすい
    primarySignal: social_input_sensitive
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q023_D_NON_NUMERIC_VECTOR
    questionId: Q023
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: social_contextual
    optionId: D
    sourceOptionText: すぐ決めずに距離を置く
    primarySignal: criteria_awareness
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q023_E_NON_NUMERIC_VECTOR
    questionId: Q023
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: social_contextual
    optionId: E
    sourceOptionText: どちらも残して小さく試す
    primarySignal: reversible_choice
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q024:
  A:
    optionVectorId: Q024_A_NON_NUMERIC_VECTOR
    questionId: Q024
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 今いちばん困っていることから考える
    primarySignal: criteria_based_choice
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q024_B_NON_NUMERIC_VECTOR
    questionId: Q024
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 選んだ後の自分を想像してみる
    primarySignal: whole_picture_needed
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=clarity_decision; alignment=cross-family
    crossFamilyModifiers: whole_picture_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q024_C_NON_NUMERIC_VECTOR
    questionId: Q024
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 優先しないことを先に決める
    primarySignal: social_input_sensitive
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q024_D_NON_NUMERIC_VECTOR
    questionId: Q024
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 一度、人の意見から離れて考える
    primarySignal: criteria_awareness
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q024_E_NON_NUMERIC_VECTOR
    questionId: Q024
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 期限や負担など現実の条件に戻す
    primarySignal: reversible_choice
    secondarySignals: [criteria_awareness, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q025:
  A:
    optionVectorId: Q025_A_NON_NUMERIC_VECTOR
    questionId: Q025
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 無理をしすぎなかった感じ
    primarySignal: criteria_based_choice
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_based_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; criteria_based_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q025_B_NON_NUMERIC_VECTOR
    questionId: Q025
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 迷っても理由を言葉にできる感じ
    primarySignal: whole_picture_needed
    secondarySignals: [criteria_awareness, load_externalization, later_review]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: criteria_awareness: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=clarity_decision; alignment=cross-family
    crossFamilyModifiers: whole_picture_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, clarity_decision_axis, emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q025_C_NON_NUMERIC_VECTOR
    questionId: Q025
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 周りと自分の両方を見られた感じ
    primarySignal: social_input_sensitive
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q025_D_NON_NUMERIC_VECTOR
    questionId: Q025
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 小さくても動けた感じ
    primarySignal: criteria_awareness
    secondarySignals: [small_start, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q025_E_NON_NUMERIC_VECTOR
    questionId: Q025
    dimensionCode: CL
    subdimensionCode: CL_CRITERIA
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 次につながる余地がある感じ
    primarySignal: reversible_choice
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reversible_choice nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; reversible_choice is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q026:
  A:
    optionVectorId: Q026_A_NON_NUMERIC_VECTOR
    questionId: Q026
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: core_behavior
    optionId: A
    sourceOptionText: 理由を整理すると自分でも見えやすくなる
    primarySignal: partial_reasoning
    secondarySignals: [criteria_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: native auxiliary modifier
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: partial_reasoning
    privateInterpretationBoundary: private/internal interpretation only; partial_reasoning is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q026_B_NON_NUMERIC_VECTOR
    questionId: Q026
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: core_behavior
    optionId: B
    sourceOptionText: 説明しようとすると迷いが増える
    primarySignal: explanation_pressure
    secondarySignals: [load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_pressure nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; explanation_pressure is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q026_C_NON_NUMERIC_VECTOR
    questionId: Q026
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: core_behavior
    optionId: C
    sourceOptionText: 相手に伝わる形を先に考える
    primarySignal: criteria_awareness
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q026_D_NON_NUMERIC_VECTOR
    questionId: Q026
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: core_behavior
    optionId: D
    sourceOptionText: 短く言えれば十分だと感じる
    primarySignal: social_input_sensitive
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q026_E_NON_NUMERIC_VECTOR
    questionId: Q026
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: core_behavior
    optionId: E
    sourceOptionText: まだ言葉にならない部分が残りやすい
    primarySignal: explanation_recovery
    secondarySignals: [load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_recovery nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; explanation_recovery is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied

Q027:
  A:
    optionVectorId: Q027_A_NON_NUMERIC_VECTOR
    questionId: Q027
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 今言える範囲だけ伝える
    primarySignal: partial_reasoning
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: partial_reasoning
    privateInterpretationBoundary: private/internal interpretation only; partial_reasoning is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q027_B_NON_NUMERIC_VECTOR
    questionId: Q027
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: うまく言おうとして考え込む
    primarySignal: explanation_pressure
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary explanation_pressure nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; explanation_pressure is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q027_C_NON_NUMERIC_VECTOR
    questionId: Q027
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 相手が納得しそうな言い方を探す
    primarySignal: criteria_awareness
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q027_D_NON_NUMERIC_VECTOR
    questionId: Q027
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 少し時間をもらいたくなる
    primarySignal: social_input_sensitive
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q027_E_NON_NUMERIC_VECTOR
    questionId: Q027
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 話しながら自分の考えを確かめる
    primarySignal: explanation_recovery
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary explanation_recovery nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; explanation_recovery is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q028:
  A:
    optionVectorId: Q028_A_NON_NUMERIC_VECTOR
    questionId: Q028
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い人ほど言葉にしやすい
    primarySignal: partial_reasoning
    secondarySignals: [social_modulation, load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: partial_reasoning, social_modulation
    privateInterpretationBoundary: private/internal interpretation only; partial_reasoning is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q028_B_NON_NUMERIC_VECTOR
    questionId: Q028
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: social_contextual
    optionId: B
    sourceOptionText: 近い人ほど気をつかって言いにくい
    primarySignal: explanation_pressure
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_pressure nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; explanation_pressure is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q028_C_NON_NUMERIC_VECTOR
    questionId: Q028
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: social_contextual
    optionId: C
    sourceOptionText: 距離がある人の方が短く伝えやすい
    primarySignal: criteria_awareness
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q028_D_NON_NUMERIC_VECTOR
    questionId: Q028
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: social_contextual
    optionId: D
    sourceOptionText: 立場が上の人には慎重になりやすい
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation, inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q028_E_NON_NUMERIC_VECTOR
    questionId: Q028
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: social_contextual
    optionId: E
    sourceOptionText: 相手よりも場の空気で変わりやすい
    primarySignal: explanation_recovery
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_recovery nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; explanation_recovery is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied

Q029:
  A:
    optionVectorId: Q029_A_NON_NUMERIC_VECTOR
    questionId: Q029
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 自分の中で言い直して整理する
    primarySignal: partial_reasoning
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: partial_reasoning
    privateInterpretationBoundary: private/internal interpretation only; partial_reasoning is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q029_B_NON_NUMERIC_VECTOR
    questionId: Q029
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 別のことをして気持ちを切り替える
    primarySignal: explanation_pressure
    secondarySignals: [inner_weight_accumulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_pressure nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; explanation_pressure is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q029_C_NON_NUMERIC_VECTOR
    questionId: Q029
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 相手に伝わった部分を確認する
    primarySignal: criteria_awareness
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q029_D_NON_NUMERIC_VECTOR
    questionId: Q029
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 一人の時間で落ち着く
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q029_E_NON_NUMERIC_VECTOR
    questionId: Q029
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 次は短く言える形を考える
    primarySignal: explanation_recovery
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_recovery nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; explanation_recovery is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q030:
  A:
    optionVectorId: Q030_A_NON_NUMERIC_VECTOR
    questionId: Q030
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 自分の中で理由が短くまとまっていた
    primarySignal: partial_reasoning
    secondarySignals: [criteria_awareness, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: criteria_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: partial_reasoning, later_review
    privateInterpretationBoundary: private/internal interpretation only; partial_reasoning is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q030_B_NON_NUMERIC_VECTOR
    questionId: Q030
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 相手が急がせない雰囲気だった
    primarySignal: explanation_pressure
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_pressure nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, later_review
    privateInterpretationBoundary: private/internal interpretation only; explanation_pressure is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q030_C_NON_NUMERIC_VECTOR
    questionId: Q030
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 全部ではなく一部だけ話せばよかった
    primarySignal: criteria_awareness
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; criteria_awareness is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q030_D_NON_NUMERIC_VECTOR
    questionId: Q030
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 先に考える時間があった
    primarySignal: social_input_sensitive
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; social_input_sensitive is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q030_E_NON_NUMERIC_VECTOR
    questionId: Q030
    dimensionCode: CL
    subdimensionCode: CL_EXPLANATION_PRESSURE
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 完成した答えでなくてもよかった
    primarySignal: explanation_recovery
    secondarySignals: [continuation_by_marker, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_recovery nativeFamily=clarity_decision; source dimension nativeFamily=clarity_decision; alignment=native
    crossFamilyModifiers: continuation_by_marker: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; explanation_recovery is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q031:
  A:
    optionVectorId: Q031_A_NON_NUMERIC_VECTOR
    questionId: Q031
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: core_behavior
    optionId: A
    sourceOptionText: 小さな入口が見えると始めやすい
    primarySignal: low_friction_start
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary low_friction_start nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; low_friction_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q031_B_NON_NUMERIC_VECTOR
    questionId: Q031
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: core_behavior
    optionId: B
    sourceOptionText: 全体が見えてから始めたい
    primarySignal: whole_picture_needed
    secondarySignals: [inner_weight_accumulation, criteria_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; criteria_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis, emotional_load_axis, clarity_decision_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q031_C_NON_NUMERIC_VECTOR
    questionId: Q031
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: core_behavior
    optionId: C
    sourceOptionText: 気持ちが乗るまで少し時間がいる
    primarySignal: social_start_support
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q031_D_NON_NUMERIC_VECTOR
    questionId: Q031
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: core_behavior
    optionId: D
    sourceOptionText: 誰かと一緒だと始めやすい
    primarySignal: environment_setup
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary environment_setup nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; environment_setup is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q031_E_NON_NUMERIC_VECTOR
    questionId: Q031
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: core_behavior
    optionId: E
    sourceOptionText: 先に環境を整えると動きやすい
    primarySignal: preparation_needed
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: preparation_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q032:
  A:
    optionVectorId: Q032_A_NON_NUMERIC_VECTOR
    questionId: Q032
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: まず試す範囲を小さくする
    primarySignal: low_friction_start
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary low_friction_start nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; low_friction_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q032_B_NON_NUMERIC_VECTOR
    questionId: Q032
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 足りない部分を確認してから動く
    primarySignal: whole_picture_needed
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q032_C_NON_NUMERIC_VECTOR
    questionId: Q032
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 誰かに一度見てもらうと動きやすい
    primarySignal: social_start_support
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q032_D_NON_NUMERIC_VECTOR
    questionId: Q032
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 期限が近いと動き出せる
    primarySignal: environment_setup
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary environment_setup nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; environment_setup is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q032_E_NON_NUMERIC_VECTOR
    questionId: Q032
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 途中で直せる形なら始めやすい
    primarySignal: preparation_needed
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: preparation_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q033:
  A:
    optionVectorId: Q033_A_NON_NUMERIC_VECTOR
    questionId: Q033
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: social_contextual
    optionId: A
    sourceOptionText: 背中を押されて始めやすい
    primarySignal: low_friction_start
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary low_friction_start nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; low_friction_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q033_B_NON_NUMERIC_VECTOR
    questionId: Q033
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: social_contextual
    optionId: B
    sourceOptionText: かえって慎重になりやすい
    primarySignal: whole_picture_needed
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis, emotional_load_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_medium; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no burnout/anxiety claims; no clinical emotional-load inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q033_C_NON_NUMERIC_VECTOR
    questionId: Q033
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: social_contextual
    optionId: C
    sourceOptionText: 相手の期待を先に考えてしまう
    primarySignal: social_start_support
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q033_D_NON_NUMERIC_VECTOR
    questionId: Q033
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: social_contextual
    optionId: D
    sourceOptionText: 一人で少し進めてから見せたい
    primarySignal: environment_setup
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary environment_setup nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; environment_setup is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q033_E_NON_NUMERIC_VECTOR
    questionId: Q033
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: social_contextual
    optionId: E
    sourceOptionText: 場の流れに乗ると始めやすい
    primarySignal: preparation_needed
    secondarySignals: [schedule_reframe]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: preparation_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q034:
  A:
    optionVectorId: Q034_A_NON_NUMERIC_VECTOR
    questionId: Q034
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: ほんの少しだけやると決める
    primarySignal: low_friction_start
    secondarySignals: [small_start, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary low_friction_start nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; low_friction_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q034_B_NON_NUMERIC_VECTOR
    questionId: Q034
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 場所や道具を変える
    primarySignal: whole_picture_needed
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q034_C_NON_NUMERIC_VECTOR
    questionId: Q034
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 誰かに一言だけ共有する
    primarySignal: social_start_support
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q034_D_NON_NUMERIC_VECTOR
    questionId: Q034
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 時間を区切って始める
    primarySignal: environment_setup
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary environment_setup nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; environment_setup is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q034_E_NON_NUMERIC_VECTOR
    questionId: Q034
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: やる意味をもう一度思い出す
    primarySignal: preparation_needed
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: preparation_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q035:
  A:
    optionVectorId: Q035_A_NON_NUMERIC_VECTOR
    questionId: Q035
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 最初の一歩が小さかった
    primarySignal: low_friction_start
    secondarySignals: [small_start, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary low_friction_start nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; low_friction_start is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q035_B_NON_NUMERIC_VECTOR
    questionId: Q035
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 使うものがすぐ近くにあった
    primarySignal: whole_picture_needed
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; whole_picture_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q035_C_NON_NUMERIC_VECTOR
    questionId: Q035
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 完成形を求められていなかった
    primarySignal: social_start_support
    secondarySignals: [continuation_by_marker, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: continuation_by_marker: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q035_D_NON_NUMERIC_VECTOR
    questionId: Q035
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 誰かとの軽い約束があった
    primarySignal: environment_setup
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary environment_setup nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, later_review
    privateInterpretationBoundary: private/internal interpretation only; environment_setup is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q035_E_NON_NUMERIC_VECTOR
    questionId: Q035
    dimensionCode: AR
    subdimensionCode: AR_STARTABILITY
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 自分の中で目的が見えていた
    primarySignal: preparation_needed
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary preparation_needed nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: preparation_needed: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; preparation_needed is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q036:
  A:
    optionVectorId: Q036_A_NON_NUMERIC_VECTOR
    questionId: Q036
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: core_behavior
    optionId: A
    sourceOptionText: 流れに乗るとそのまま続きやすい
    primarySignal: continuation_by_flow
    secondarySignals: [schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_by_flow nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_flow is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q036_B_NON_NUMERIC_VECTOR
    questionId: Q036
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: core_behavior
    optionId: B
    sourceOptionText: 途中で意味を確かめたくなる
    primarySignal: continuation_by_marker
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary continuation_by_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_marker is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q036_C_NON_NUMERIC_VECTOR
    questionId: Q036
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: core_behavior
    optionId: C
    sourceOptionText: 小さな区切りがあると続けやすい
    primarySignal: routine_flexibility
    secondarySignals: [small_start, continuation_by_marker]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; continuation_by_marker: native auxiliary modifier
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: routine_flexibility: cross-family auxiliary modifier; does not create independent subdimension conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q036_D_NON_NUMERIC_VECTOR
    questionId: Q036
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: core_behavior
    optionId: D
    sourceOptionText: 誰かとの関わりがあると続きやすい
    primarySignal: social_start_support
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q036_E_NON_NUMERIC_VECTOR
    questionId: Q036
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: core_behavior
    optionId: E
    sourceOptionText: 気分や余力に合わせて波が出やすい
    primarySignal: purpose_recall
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary purpose_recall nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; purpose_recall is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q037:
  A:
    optionVectorId: Q037_A_NON_NUMERIC_VECTOR
    questionId: Q037
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 小さい進みを確認すると続けやすい
    primarySignal: continuation_by_flow
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_by_flow nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_flow is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q037_B_NON_NUMERIC_VECTOR
    questionId: Q037
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 先が長く見えて手が止まりやすい
    primarySignal: continuation_by_marker
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary continuation_by_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_marker is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q037_C_NON_NUMERIC_VECTOR
    questionId: Q037
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: いったんやり方を変えてみる
    primarySignal: routine_flexibility
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: routine_flexibility: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q037_D_NON_NUMERIC_VECTOR
    questionId: Q037
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 誰かに途中経過を話すと続きやすい
    primarySignal: social_start_support
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q037_E_NON_NUMERIC_VECTOR
    questionId: Q037
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 少し離れてから戻る方が続けやすい
    primarySignal: purpose_recall
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary purpose_recall nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; purpose_recall is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q038:
  A:
    optionVectorId: Q038_A_NON_NUMERIC_VECTOR
    questionId: Q038
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: social_contextual
    optionId: A
    sourceOptionText: 反応があると続ける力になりやすい
    primarySignal: continuation_by_flow
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary continuation_by_flow nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_flow is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q038_B_NON_NUMERIC_VECTOR
    questionId: Q038
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: social_contextual
    optionId: B
    sourceOptionText: 気になって手が止まりやすい
    primarySignal: continuation_by_marker
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary continuation_by_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_marker is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q038_C_NON_NUMERIC_VECTOR
    questionId: Q038
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: social_contextual
    optionId: C
    sourceOptionText: 取り入れる部分を選びたくなる
    primarySignal: routine_flexibility
    secondarySignals: []
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: none
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: routine_flexibility: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q038_D_NON_NUMERIC_VECTOR
    questionId: Q038
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: social_contextual
    optionId: D
    sourceOptionText: 少し時間を置いてから戻りたい
    primarySignal: social_start_support
    secondarySignals: [transition_reentry]
    primarySignalRole: native primary driver
    secondarySignalRoles: transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q038_E_NON_NUMERIC_VECTOR
    questionId: Q038
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: social_contextual
    optionId: E
    sourceOptionText: 誰の反応かで受け取り方が変わる
    primarySignal: purpose_recall
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary purpose_recall nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; purpose_recall is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q039:
  A:
    optionVectorId: Q039_A_NON_NUMERIC_VECTOR
    questionId: Q039
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 前回の続きが見えると戻りやすい
    primarySignal: continuation_by_flow
    secondarySignals: [transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_by_flow nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_flow is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q039_B_NON_NUMERIC_VECTOR
    questionId: Q039
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 少しだけやる形にすると戻りやすい
    primarySignal: continuation_by_marker
    secondarySignals: [small_start, transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_by_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_marker is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q039_C_NON_NUMERIC_VECTOR
    questionId: Q039
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 予定に入れ直すと戻りやすい
    primarySignal: routine_flexibility
    secondarySignals: [schedule_reframe, transition_reentry, method_shift]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: routine_flexibility: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: schedule_reframe
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q039_D_NON_NUMERIC_VECTOR
    questionId: Q039
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かと共有すると戻りやすい
    primarySignal: social_start_support
    secondarySignals: [social_modulation, transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q039_E_NON_NUMERIC_VECTOR
    questionId: Q039
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: なぜ続けたいか思い出すと戻りやすい
    primarySignal: purpose_recall
    secondarySignals: [transition_reentry, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary purpose_recall nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: transition_reentry: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: public_safe; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal interpretation only; purpose_recall is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied

Q040:
  A:
    optionVectorId: Q040_A_NON_NUMERIC_VECTOR
    questionId: Q040
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 進み具合が少し見えていた
    primarySignal: continuation_by_flow
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_by_flow nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_flow is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q040_B_NON_NUMERIC_VECTOR
    questionId: Q040
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 完成までの形が細かく分かれていた
    primarySignal: continuation_by_marker
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_by_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; continuation_by_marker is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q040_C_NON_NUMERIC_VECTOR
    questionId: Q040
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 自分のペースで調整できた
    primarySignal: routine_flexibility
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception within source subdimension context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: routine_flexibility: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; routine_flexibility is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q040_D_NON_NUMERIC_VECTOR
    questionId: Q040
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 誰かとの軽いつながりがあった
    primarySignal: social_start_support
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: social_modulation, later_review
    privateInterpretationBoundary: private/internal interpretation only; social_start_support is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no reply/contact advice; no relationship diagnosis; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q040_E_NON_NUMERIC_VECTOR
    questionId: Q040
    dimensionCode: AR
    subdimensionCode: AR_CONTINUATION
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 途中で休んでも戻れる感じがあった
    primarySignal: purpose_recall
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary purpose_recall nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: preserves qualitative confidenceContribution only; sensitivity_axis: private_low; public_visibility_axis: raw internal/private; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal applied
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit with source confidenceContribution preserved qualitatively; confidence is interpretive reliability, not intensity
    intensityRole: source qualitative intensity preserved; not severity, desirability, or numeric strength
    dominanceControlNotes: broad tag present; treated as modifier unless primary/native: later_review
    privateInterpretationBoundary: private/internal interpretation only; purpose_recall is descriptive signal evidence; secondarySignals modify context only; not public-facing copy
    safetyBoundary: no diagnosis; no therapy/treatment inference; no result taxonomy; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Batch audit:
- batchAudit: Q001–Q040 processed only; 40 questions and 200 options represented; no Batch B/C vectors generated
- safetyAudit: PASS; prohibited interpretations blocked at optionVector safetyBoundary level
- visibilityAudit: PASS; rawVectorVisibility internal_private and shareEligibility forbidden for all vectors
- sensitivityAudit: PASS; strictest-signal rule applied; private_high items routed to needs_human_review_sensitive where present
- signalTagAudit: PASS; no unknown signal tags introduced
- protocolComplianceAudit: PASS; required fields present; no numeric scores, formulas, code, taxonomy, result copy, report copy, or public output generated
- crossFamilyModifierSummary: Q001_C: inner_weight_accumulation; Q001_D: social_modulation; Q001_E: criteria_awareness; Q002_D: social_modulation; Q002_E: inner_weight_accumulation, criteria_awareness; Q003_A: social_modulation; Q003_C: social_modulation; Q003_D: social_modulation, inner_weight_accumulation; Q003_E: social_modulation; Q004_A: method_shift; Q004_B: method_shift; Q004_C: social_start_support, social_modulation; Q004_D: method_shift; Q004_E: method_shift; Q005_A: later_review, self_observation_strength; Q005_B: criteria_awareness, later_review, self_observation_strength; Q005_C: social_modulation, continuation_by_marker, later_review; Q005_D: inner_weight_accumulation, later_review, self_observation_strength; Q005_E: load_externalization, later_review, self_observation_strength; Q006_A: continuation_by_marker; Q006_B: post_event_residue; Q006_D: inner_weight_accumulation; Q007_B: post_event_residue; Q007_C: criteria_awareness; Q007_D: inner_weight_accumulation; Q007_E: social_modulation; Q008_A: social_modulation; Q008_B: post_event_residue, inner_weight_accumulation; Q009_A: method_shift; Q009_B: post_event_residue, method_shift; Q009_C: load_externalization, method_shift; Q009_D: social_modulation, method_shift; Q009_E: continuation_by_marker, method_shift; Q010_A: continuation_by_marker, later_review, self_observation_strength; Q010_B: post_event_residue, later_review, self_observation_strength; Q010_C: later_review, self_observation_strength; Q010_D: later_review, self_observation_strength; Q010_E: later_review, self_observation_strength; Q011_D: social_modulation; Q013_A: social_modulation; Q013_B: social_modulation; Q013_C: social_modulation; Q014_A: method_shift; Q014_B: method_shift; Q014_C: method_shift; Q014_D: social_modulation, method_shift; Q014_E: method_shift; Q015_A: later_review, self_observation_strength; Q015_B: later_review, self_observation_strength; Q015_C: later_review, self_observation_strength; Q015_D: social_modulation, later_review, self_observation_strength; Q015_E: later_review, self_observation_strength; Q016_C: small_start; Q016_D: social_modulation; Q017_A: small_start; Q017_D: social_modulation; Q018_D: social_modulation; Q018_E: inner_weight_accumulation; Q019_A: method_shift; Q019_B: small_start, method_shift; Q019_C: method_shift; Q019_D: method_shift; Q019_E: social_start_support, social_modulation, load_externalization; Q020_A: later_review, self_observation_strength; Q020_B: later_review, self_observation_strength; Q020_C: later_review, self_observation_strength; Q020_D: social_start_support, social_modulation, later_review; Q020_E: later_review, self_observation_strength; Q021_B: whole_picture_needed; Q021_C: schedule_reframe; Q022_A: small_start; Q022_B: whole_picture_needed; Q022_C: social_modulation; Q023_B: whole_picture_needed; Q023_E: small_start; Q024_A: method_shift; Q024_B: whole_picture_needed, method_shift; Q024_C: method_shift; Q024_D: social_modulation, method_shift; Q024_E: method_shift; ...
- broadTagSummary: Q001_A: schedule_reframe; Q001_C: schedule_reframe; Q001_D: social_modulation; Q002_D: social_modulation; Q003_A: social_modulation; Q003_C: social_modulation, schedule_reframe; Q003_D: social_modulation; Q003_E: social_modulation; Q004_B: schedule_reframe; Q004_C: social_modulation, schedule_reframe; Q004_E: schedule_reframe; Q005_A: later_review; Q005_B: later_review; Q005_C: social_modulation, later_review; Q005_D: later_review; Q005_E: later_review; Q006_C: schedule_reframe; Q007_C: schedule_reframe; Q007_E: social_modulation; Q008_A: social_modulation, schedule_reframe; Q008_D: schedule_reframe; Q009_B: schedule_reframe; Q009_D: social_modulation; Q010_A: later_review; Q010_B: later_review; Q010_C: later_review; Q010_D: later_review; Q010_E: later_review; Q011_D: social_modulation, schedule_reframe; Q011_E: schedule_reframe; Q012_A: schedule_reframe; Q012_D: schedule_reframe; Q012_E: schedule_reframe; Q013_A: social_modulation; Q013_B: social_modulation, schedule_reframe; Q013_C: social_modulation; Q013_E: schedule_reframe; Q014_D: social_modulation, schedule_reframe; Q014_E: schedule_reframe; Q015_A: later_review; Q015_B: later_review; Q015_C: later_review; Q015_D: social_modulation, later_review; Q015_E: schedule_reframe, later_review; Q016_D: social_modulation; Q017_D: social_modulation; Q018_D: social_modulation; Q019_E: social_modulation; Q020_A: later_review; Q020_B: later_review; Q020_C: later_review; Q020_D: social_modulation, later_review; Q020_E: later_review; Q021_C: schedule_reframe; Q022_C: social_modulation; Q024_D: social_modulation; Q025_A: later_review; Q025_B: later_review; Q025_C: later_review; Q025_D: later_review; Q025_E: later_review; Q026_A: partial_reasoning; Q026_C: social_modulation; Q027_A: partial_reasoning; Q027_C: social_modulation; Q028_A: partial_reasoning, social_modulation; Q028_B: social_modulation; Q028_C: social_modulation; Q028_D: social_modulation; Q028_E: social_modulation; Q029_A: partial_reasoning; Q029_C: social_modulation; Q029_D: social_modulation; Q030_A: partial_reasoning, later_review; Q030_B: social_modulation, later_review; Q030_C: later_review; Q030_D: later_review; Q030_E: later_review; Q031_D: social_modulation; Q032_C: social_modulation; ...
- highRiskTagSummary: Q001_C: inner_weight_accumulation; Q002_E: inner_weight_accumulation; Q003_D: inner_weight_accumulation; Q005_D: inner_weight_accumulation; Q006_B: post_event_residue; Q006_D: inner_weight_accumulation; Q007_B: post_event_residue; Q007_D: inner_weight_accumulation; Q008_B: post_event_residue, inner_weight_accumulation; Q009_B: post_event_residue; Q010_B: post_event_residue; Q018_E: inner_weight_accumulation; Q028_D: inner_weight_accumulation; Q029_B: inner_weight_accumulation; Q031_B: inner_weight_accumulation; Q031_C: inner_weight_accumulation; Q033_B: inner_weight_accumulation
- needsReviewItems: none

Final decision:
- approve Batch A non-numeric option vector application draft: YES_FOR_REVIEW
- approve Batch B application: NO
- approve Batch C application: NO
- approve full 120Q application: NO
- approve numeric score assignment: NO
- approve scoring formula: NO
- approve implementation: NO
- approve result taxonomy: NO
- approve result copy: NO
- approve report copy: NO
- approve launch: NO
- next authorized task: Batch A non-numeric option vector application review and refinement