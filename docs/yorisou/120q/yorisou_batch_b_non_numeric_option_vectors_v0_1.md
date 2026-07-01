YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_BATCH_B_Q041_Q080_V0_1

Executive status:
- source protocol: YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_PROTOCOL_V0_1
- source mapping rules: YORISOU_NON_NUMERIC_AXIS_MAPPING_RULES_FOR_SIGNAL_TAGS_V0_1
- source framework: YORISOU_SCOREVECTOR_FRAMEWORK_DESIGN_V0_1
- source signal batch: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_B_Q041_Q080_V0_1
- batch scope: Q041–Q080 only
- application status: DRAFT_READY_FOR_REVIEW
- numeric score assignment: NOT APPROVED
- scoring formula: NOT APPROVED
- implementation readiness: NOT APPROVED
- result taxonomy readiness: NOT_STARTED
- launch readiness: NOT_APPROVED
- authorized next step: Batch B non-numeric option vector application review and refinement
- prohibited next steps: Batch C application, full 120Q application, numeric scoring, formulas, code, result taxonomy, result names, result copy, report copy, launch approval

Batch packaging:
- batchId: BATCH_B_Q041_Q080_NON_NUMERIC_OPTION_VECTOR_APPLICATION_V0_1
- sourceBatch: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_B_Q041_Q080_V0_1
- questionsCovered: Q041–Q080
- optionsCovered: 200 / 200
- applicationScope: Batch B only; Q041–Q080 only; non-numeric option vectors only
- applicationStatus: non_numeric_option_vector_application_draft_ready_for_review
- protocolVersion: YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_PROTOCOL_V0_1
- mappingRulesVersion: YORISOU_NON_NUMERIC_AXIS_MAPPING_RULES_FOR_SIGNAL_TAGS_V0_1
- frameworkVersion: YORISOU_SCOREVECTOR_FRAMEWORK_DESIGN_V0_1
- sourceSignalBatchVersion: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_B_Q041_Q080_V0_1

Batch pre-check:
- all Q041–Q080 present: YES
- all 200 options present: YES
- all signal tags approved: YES
- no numeric fields created: YES
- no formulas created: YES
- no code created: YES
- no public-facing copy generated: YES
- no result taxonomy generated: YES
- no Batch C processed: YES
- no full 120Q processed: YES

Option vectors:

Q041:
  A:
    optionVectorId: Q041_A_NON_NUMERIC_VECTOR
    questionId: Q041
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: core_behavior
    optionId: A
    sourceOptionText: 途中から少しだけ再開すると戻りやすい
    primarySignal: restart_by_micro_step
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary restart_by_micro_step nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; restart_by_micro_step remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q041_B_NON_NUMERIC_VECTOR
    questionId: Q041
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: core_behavior
    optionId: B
    sourceOptionText: もう一度、最初の形を見直してから戻る
    primarySignal: restart_by_reframe
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary restart_by_reframe nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; restart_by_reframe remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q041_C_NON_NUMERIC_VECTOR
    questionId: Q041
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: core_behavior
    optionId: C
    sourceOptionText: きっかけが来るまで少し置いておく
    primarySignal: delayed_entry
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: none
    nativeFamilyContext: primary delayed_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: delayed_entry: cross-family primary exception bounded by AR_RESTART source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_entry remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q041_D_NON_NUMERIC_VECTOR
    questionId: Q041
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: core_behavior
    optionId: D
    sourceOptionText: 誰かに軽く共有すると戻りやすい
    primarySignal: social_start_support
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_start_support remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q041_E_NON_NUMERIC_VECTOR
    questionId: Q041
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: core_behavior
    optionId: E
    sourceOptionText: 今の自分に合う形へ小さく変えて戻る
    primarySignal: method_shift
    secondarySignals: [small_start]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: method_shift: cross-family primary exception bounded by AR_RESTART source context; does not create independent recovery_pattern conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, rhythm_structure_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q042:
  A:
    optionVectorId: Q042_A_NON_NUMERIC_VECTOR
    questionId: Q042
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: できる部分だけに範囲をしぼる
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by AR_RESTART source context; does not create independent boundary conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q042_B_NON_NUMERIC_VECTOR
    questionId: Q042
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: どこで止まったかを確かめる
    primarySignal: action_restart_marker
    secondarySignals: [later_review, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary action_restart_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; action_restart_marker remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q042_C_NON_NUMERIC_VECTOR
    questionId: Q042
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: いったん別の入り口を探す
    primarySignal: contextual_entry
    secondarySignals: [recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary contextual_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: contextual_entry: cross-family primary exception bounded by AR_RESTART source context; does not create independent rhythm_daily_flow conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; contextual_entry remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q042_D_NON_NUMERIC_VECTOR
    questionId: Q042
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 締切や区切りが見えると戻りやすい
    primarySignal: continuation_by_marker
    secondarySignals: [boundary_awareness, later_review, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_by_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [action_entry_axis, boundary_scope_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; continuation_by_marker remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q042_E_NON_NUMERIC_VECTOR
    questionId: Q042
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 前と同じ形にこだわらず始める
    primarySignal: restart_by_reframe
    secondarySignals: [recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary restart_by_reframe nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [action_entry_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; restart_by_reframe remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q043:
  A:
    optionVectorId: Q043_A_NON_NUMERIC_VECTOR
    questionId: Q043
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: social_contextual
    optionId: A
    sourceOptionText: 知られている方が戻るきっかけになる
    primarySignal: social_start_support
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_start_support remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q043_B_NON_NUMERIC_VECTOR
    questionId: Q043
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: social_contextual
    optionId: B
    sourceOptionText: 見られている感じがあり、少し慎重になる
    primarySignal: atmosphere_reading
    secondarySignals: [inner_weight_accumulation, social_modulation]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: atmosphere_reading: cross-family primary exception bounded by AR_RESTART source context; does not create independent social_distance conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q043_C_NON_NUMERIC_VECTOR
    questionId: Q043
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: social_contextual
    optionId: C
    sourceOptionText: まず一人で少し進めてから共有したい
    primarySignal: response_timing_buffer
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: response_timing_buffer: cross-family primary exception bounded by AR_RESTART source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q043_D_NON_NUMERIC_VECTOR
    questionId: Q043
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: social_contextual
    optionId: D
    sourceOptionText: 短く説明できると戻りやすい
    primarySignal: explanation_recovery
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_recovery nativeFamily=clarity_decision; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: explanation_recovery: cross-family primary exception bounded by AR_RESTART source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; explanation_recovery remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q043_E_NON_NUMERIC_VECTOR
    questionId: Q043
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: social_contextual
    optionId: E
    sourceOptionText: 周りの反応より、自分の間合いを優先したい
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by AR_RESTART source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied

Q044:
  A:
    optionVectorId: Q044_A_NON_NUMERIC_VECTOR
    questionId: Q044
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: まず一分だけ触れるくらいにする
    primarySignal: small_start
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: small_start: cross-family primary exception bounded by AR_RESTART source context; does not create independent rhythm_daily_flow conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; small_start remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q044_B_NON_NUMERIC_VECTOR
    questionId: Q044
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 一つの手順だけ進める
    primarySignal: restart_by_micro_step
    secondarySignals: [small_start, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary restart_by_micro_step nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; restart_by_micro_step remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q044_C_NON_NUMERIC_VECTOR
    questionId: Q044
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 前より軽い形に変える
    primarySignal: method_shift
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: none
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: method_shift: cross-family primary exception bounded by AR_RESTART source context; does not create independent recovery_pattern conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q044_D_NON_NUMERIC_VECTOR
    questionId: Q044
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かに見せる前の下書きにする
    primarySignal: partial_reasoning
    secondarySignals: [social_modulation, load_externalization, method_shift]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by AR_RESTART source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, emotional_load_axis, recovery_margin_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q044_E_NON_NUMERIC_VECTOR
    questionId: Q044
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 今日は入口を作るだけにする
    primarySignal: low_friction_start
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary low_friction_start nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; low_friction_start remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q045:
  A:
    optionVectorId: Q045_A_NON_NUMERIC_VECTOR
    questionId: Q045
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 戻る場所がはっきりしている
    primarySignal: action_restart_marker
    secondarySignals: [social_modulation, reset_by_place, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary action_restart_marker nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [action_entry_axis, social_distance_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; action_restart_marker remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q045_B_NON_NUMERIC_VECTOR
    questionId: Q045
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 小さく始めてもよい空気がある
    primarySignal: small_start
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by AR_RESTART source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=action; alignment=cross-family
    crossFamilyModifiers: small_start: cross-family primary exception bounded by AR_RESTART source context; does not create independent rhythm_daily_flow conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: action_entry_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, awareness_reflection_axis, action_entry_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; small_start remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q045_C_NON_NUMERIC_VECTOR
    questionId: Q045
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 前と同じ形でなくてもよいと思える
    primarySignal: restart_by_reframe
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary restart_by_reframe nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; restart_by_reframe remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q045_D_NON_NUMERIC_VECTOR
    questionId: Q045
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 少しだけ見てくれる人がいる
    primarySignal: social_start_support
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_start_support remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q045_E_NON_NUMERIC_VECTOR
    questionId: Q045
    dimensionCode: AR
    subdimensionCode: AR_RESTART
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 再開したあとの一歩が見えている
    primarySignal: continuation_reentry
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_reentry nativeFamily=action; source dimension nativeFamily=action; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; continuation_reentry remains source-bounded by AR_RESTART; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q046:
  A:
    optionVectorId: Q046_A_NON_NUMERIC_VECTOR
    questionId: Q046
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: core_behavior
    optionId: A
    sourceOptionText: やることが多いと内側にたまりやすい
    primarySignal: inner_weight_accumulation
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary inner_weight_accumulation nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; inner_weight_accumulation remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q046_B_NON_NUMERIC_VECTOR
    questionId: Q046
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: core_behavior
    optionId: B
    sourceOptionText: 理由がはっきりしないまま重くなることがある
    primarySignal: unclear_load
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier
    nativeFamilyContext: primary unclear_load nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; unclear_load remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q046_C_NON_NUMERIC_VECTOR
    questionId: Q046
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: core_behavior
    optionId: C
    sourceOptionText: 人に合わせたあとに重さが出やすい
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, inner_weight_accumulation, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q046_D_NON_NUMERIC_VECTOR
    questionId: Q046
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: core_behavior
    optionId: D
    sourceOptionText: 少し静かな時間があると軽くなりやすい
    primarySignal: quiet_reset_need
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q046_E_NON_NUMERIC_VECTOR
    questionId: Q046
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: core_behavior
    optionId: E
    sourceOptionText: 重さに気づくまで少し時間がかかる
    primarySignal: delayed_notice
    secondarySignals: [inner_weight_accumulation, later_review]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent self_observation conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q047:
  A:
    optionVectorId: Q047_A_NON_NUMERIC_VECTOR
    questionId: Q047
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 先に何かを減らしたくなる
    primarySignal: recovery_margin_need
    secondarySignals: [boundary_awareness, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent recovery_pattern conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q047_B_NON_NUMERIC_VECTOR
    questionId: Q047
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: どれから触れるか決めにくくなる
    primarySignal: option_overload
    secondarySignals: [tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary option_overload nativeFamily=clarity_decision; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: option_overload: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent clarity_decision conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; option_overload remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q047_C_NON_NUMERIC_VECTOR
    questionId: Q047
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 表では動けても内側に残りやすい
    primarySignal: post_event_residue
    secondarySignals: [inner_weight_accumulation, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q047_D_NON_NUMERIC_VECTOR
    questionId: Q047
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 一つ終わると少し軽くなる
    primarySignal: continuation_by_marker
    secondarySignals: [small_start, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary continuation_by_marker nativeFamily=action; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: continuation_by_marker: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent action conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis, rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; continuation_by_marker remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q047_E_NON_NUMERIC_VECTOR
    questionId: Q047
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 全体を見直すまで重さが続きやすい
    primarySignal: whole_picture_needed
    secondarySignals: [inner_weight_accumulation, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary whole_picture_needed nativeFamily=action; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: whole_picture_needed: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent action conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [action_entry_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; whole_picture_needed remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive

Q048:
  A:
    optionVectorId: Q048_A_NON_NUMERIC_VECTOR
    questionId: Q048
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: social_contextual
    optionId: A
    sourceOptionText: 期待に応えようとして重くなりやすい
    primarySignal: social_load_residue
    secondarySignals: [inner_weight_accumulation, social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q048_B_NON_NUMERIC_VECTOR
    questionId: Q048
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: social_contextual
    optionId: B
    sourceOptionText: 期待が見える方が動きやすいこともある
    primarySignal: social_start_support
    secondarySignals: [later_review, social_modulation]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_start_support nativeFamily=action; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: social_start_support: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent action conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_start_support remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q048_C_NON_NUMERIC_VECTOR
    questionId: Q048
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: social_contextual
    optionId: C
    sourceOptionText: 期待の中身があいまいだと重くなりやすい
    primarySignal: unclear_load
    secondarySignals: [inner_weight_accumulation, social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary unclear_load nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; unclear_load remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q048_D_NON_NUMERIC_VECTOR
    questionId: Q048
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: social_contextual
    optionId: D
    sourceOptionText: 自分の範囲が見えると軽くなりやすい
    primarySignal: boundary_awareness
    secondarySignals: [later_review, social_modulation]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent boundary conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q048_E_NON_NUMERIC_VECTOR
    questionId: Q048
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: social_contextual
    optionId: E
    sourceOptionText: その場では気づかず、あとで重さが出る
    primarySignal: post_event_residue
    secondarySignals: [social_modulation, inner_weight_accumulation, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q049:
  A:
    optionVectorId: Q049_A_NON_NUMERIC_VECTOR
    questionId: Q049
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 何が重いのか一つだけ言葉にする
    primarySignal: load_externalization
    secondarySignals: [inner_weight_accumulation, small_start, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q049_B_NON_NUMERIC_VECTOR
    questionId: Q049
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: その場から少し離れる
    primarySignal: returnable_distance
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: returnable_distance: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q049_C_NON_NUMERIC_VECTOR
    questionId: Q049
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 小さな用事を終えて区切りを作る
    primarySignal: reset_by_task
    secondarySignals: [small_start, boundary_awareness, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: reset_by_task: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent recovery_pattern conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, rhythm_structure_axis, boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q049_D_NON_NUMERIC_VECTOR
    questionId: Q049
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かに短く話して外に出す
    primarySignal: load_externalization
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q049_E_NON_NUMERIC_VECTOR
    questionId: Q049
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: すぐ軽くしようとせず、少し持っておく
    primarySignal: recovery_margin_need
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent recovery_pattern conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q050:
  A:
    optionVectorId: Q050_A_NON_NUMERIC_VECTOR
    questionId: Q050
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 予定が終わって静かになった時
    primarySignal: quiet_reset_need
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q050_B_NON_NUMERIC_VECTOR
    questionId: Q050
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: いつもの動きが少し重く感じた時
    primarySignal: state_notice
    secondarySignals: [inner_weight_accumulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: state_notice: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent self_observation conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q050_C_NON_NUMERIC_VECTOR
    questionId: Q050
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 人と離れて一人になった時
    primarySignal: returnable_distance
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: returnable_distance: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q050_D_NON_NUMERIC_VECTOR
    questionId: Q050
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 書いたり話したりして外に出した時
    primarySignal: load_externalization
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q050_E_NON_NUMERIC_VECTOR
    questionId: Q050
    dimensionCode: EL
    subdimensionCode: EL_INNER_WEIGHT
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 何を後回しにしているか見えた時
    primarySignal: delayed_notice
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_INNER_WEIGHT source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by EL_INNER_WEIGHT source context; does not create independent self_observation conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by EL_INNER_WEIGHT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q051:
  A:
    optionVectorId: Q051_A_NON_NUMERIC_VECTOR
    questionId: Q051
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: core_behavior
    optionId: A
    sourceOptionText: 予定や役割が重なると張りやすい
    primarySignal: tension_pressure
    secondarySignals: [social_modulation, inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: native auxiliary modifier
    nativeFamilyContext: primary tension_pressure nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; tension_pressure remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q051_B_NON_NUMERIC_VECTOR
    questionId: Q051
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: core_behavior
    optionId: B
    sourceOptionText: 人の反応を読む時に張りやすい
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, inner_weight_accumulation]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: native auxiliary modifier
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: atmosphere_reading: cross-family primary exception bounded by EL_TENSION source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q051_C_NON_NUMERIC_VECTOR
    questionId: Q051
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: core_behavior
    optionId: C
    sourceOptionText: 早く決める場面で張りやすい
    primarySignal: decision_pause
    secondarySignals: [social_modulation, inner_weight_accumulation]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: native auxiliary modifier
    nativeFamilyContext: primary decision_pause nativeFamily=clarity_decision; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: decision_pause: cross-family primary exception bounded by EL_TENSION source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; decision_pause remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q051_D_NON_NUMERIC_VECTOR
    questionId: Q051
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: core_behavior
    optionId: D
    sourceOptionText: 表には出さず内側に残りやすい
    primarySignal: post_event_residue
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q051_E_NON_NUMERIC_VECTOR
    questionId: Q051
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: core_behavior
    optionId: E
    sourceOptionText: 張りに気づく前に動き続けていることがある
    primarySignal: delayed_notice
    secondarySignals: [inner_weight_accumulation, later_review]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by EL_TENSION source context; does not create independent self_observation conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q052:
  A:
    optionVectorId: Q052_A_NON_NUMERIC_VECTOR
    questionId: Q052
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 先に場を整えようとして張りやすい
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, inner_weight_accumulation, quiet_reset_need, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: native auxiliary modifier; quiet_reset_need: native auxiliary modifier; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: atmosphere_reading: cross-family primary exception bounded by EL_TENSION source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation, quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q052_B_NON_NUMERIC_VECTOR
    questionId: Q052
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 早く結論を出そうとして張りやすい
    primarySignal: tension_pressure
    secondarySignals: [inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier
    nativeFamilyContext: primary tension_pressure nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; tension_pressure remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q052_C_NON_NUMERIC_VECTOR
    questionId: Q052
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 相手の反応を見ながら張りが増えやすい
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, inner_weight_accumulation, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; inner_weight_accumulation: native auxiliary modifier; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q052_D_NON_NUMERIC_VECTOR
    questionId: Q052
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 一度止まると少し張りがゆるみやすい
    primarySignal: response_pause
    secondarySignals: [inner_weight_accumulation, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: response_pause: cross-family primary exception bounded by EL_TENSION source context; does not create independent boundary conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q052_E_NON_NUMERIC_VECTOR
    questionId: Q052
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 終わったあとに張りが残りやすい
    primarySignal: post_event_residue
    secondarySignals: [inner_weight_accumulation, later_review, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q053:
  A:
    optionVectorId: Q053_A_NON_NUMERIC_VECTOR
    questionId: Q053
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: social_contextual
    optionId: A
    sourceOptionText: 空気が読めるほど動きやすくなる
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: atmosphere_reading: cross-family primary exception bounded by EL_TENSION source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q053_B_NON_NUMERIC_VECTOR
    questionId: Q053
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: social_contextual
    optionId: B
    sourceOptionText: 読もうとするほど張りが増えやすい
    primarySignal: tension_pressure
    secondarySignals: [inner_weight_accumulation, social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary tension_pressure nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; tension_pressure remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q053_C_NON_NUMERIC_VECTOR
    questionId: Q053
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: social_contextual
    optionId: C
    sourceOptionText: 誰の気配を読むかで変わりやすい
    primarySignal: social_modulation
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: none
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by EL_TENSION source context; does not create independent social_distance conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q053_D_NON_NUMERIC_VECTOR
    questionId: Q053
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: social_contextual
    optionId: D
    sourceOptionText: 読んだあと、一人で整える時間がほしい
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q053_E_NON_NUMERIC_VECTOR
    questionId: Q053
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: social_contextual
    optionId: E
    sourceOptionText: 読みすぎているか後から気づくことがある
    primarySignal: later_review
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: later_review: cross-family primary exception bounded by EL_TENSION source context; does not create independent self_observation conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q054:
  A:
    optionVectorId: Q054_A_NON_NUMERIC_VECTOR
    questionId: Q054
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 短く息をつける間がある
    primarySignal: transition_buffer
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: transition_buffer: cross-family primary exception bounded by EL_TENSION source context; does not create independent rhythm_daily_flow conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; transition_buffer remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q054_B_NON_NUMERIC_VECTOR
    questionId: Q054
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: やることを一つ減らす
    primarySignal: recovery_margin_need
    secondarySignals: [small_start, boundary_awareness, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by EL_TENSION source context; does not create independent recovery_pattern conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, rhythm_structure_axis, boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q054_C_NON_NUMERIC_VECTOR
    questionId: Q054
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 場所を少し変える
    primarySignal: reset_by_place
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_place nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: reset_by_place: cross-family primary exception bounded by EL_TENSION source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_place remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q054_D_NON_NUMERIC_VECTOR
    questionId: Q054
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かに短く確認する
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: social_input_sensitive: cross-family primary exception bounded by EL_TENSION source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_input_sensitive remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q054_E_NON_NUMERIC_VECTOR
    questionId: Q054
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 張りが残ったままでも進める範囲にする
    primarySignal: scope_expansion
    secondarySignals: [inner_weight_accumulation, boundary_awareness, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: inner_weight_accumulation: native auxiliary modifier; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by EL_TENSION source context; does not create independent boundary conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive

Q055:
  A:
    optionVectorId: Q055_A_NON_NUMERIC_VECTOR
    questionId: Q055
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 返事や判断を急ぎたくなる
    primarySignal: reply_pressure
    secondarySignals: [reply_delay_buffer, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: reply_pressure: cross-family primary exception bounded by EL_TENSION source context; does not create independent social_distance conclusion; reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q055_B_NON_NUMERIC_VECTOR
    questionId: Q055
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 周りの様子がいつもより気になる
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: atmosphere_reading: cross-family primary exception bounded by EL_TENSION source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q055_C_NON_NUMERIC_VECTOR
    questionId: Q055
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 体より先に頭の中が忙しくなる
    primarySignal: unclear_load
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary unclear_load nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; unclear_load remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q055_D_NON_NUMERIC_VECTOR
    questionId: Q055
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 一つのことを何度も考え直す
    primarySignal: later_review
    secondarySignals: [small_start, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: later_review: cross-family primary exception bounded by EL_TENSION source context; does not create independent self_observation conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q055_E_NON_NUMERIC_VECTOR
    questionId: Q055
    dimensionCode: EL
    subdimensionCode: EL_TENSION
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 余白のある時間を後回しにする
    primarySignal: recovery_margin_need
    secondarySignals: [quiet_reset_need, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_TENSION source context
    secondarySignalRoles: quiet_reset_need: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by EL_TENSION source context; does not create independent recovery_pattern conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, quiet_reset_need, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by EL_TENSION; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q056:
  A:
    optionVectorId: Q056_A_NON_NUMERIC_VECTOR
    questionId: Q056
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: core_behavior
    optionId: A
    sourceOptionText: すぐ次に移れることが多い
    primarySignal: transition_reentry
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: none
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: transition_reentry: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; transition_reentry remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q056_B_NON_NUMERIC_VECTOR
    questionId: Q056
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: core_behavior
    optionId: B
    sourceOptionText: 少し時間を置いてから切り替わる
    primarySignal: transition_buffer
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: none
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: transition_buffer: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; transition_buffer remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q056_C_NON_NUMERIC_VECTOR
    questionId: Q056
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: core_behavior
    optionId: C
    sourceOptionText: 会話や出来事の一部が後まで残る
    primarySignal: post_event_residue
    secondarySignals: [load_externalization, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: load_externalization: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q056_D_NON_NUMERIC_VECTOR
    questionId: Q056
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: core_behavior
    optionId: D
    sourceOptionText: 一人になると余韻に気づきやすい
    primarySignal: delayed_notice
    secondarySignals: [social_modulation, returnable_distance, post_event_residue]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; post_event_residue: native auxiliary modifier
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent self_observation conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance, post_event_residue
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q056_E_NON_NUMERIC_VECTOR
    questionId: Q056
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: core_behavior
    optionId: E
    sourceOptionText: 何が残っているか言葉にしたくなる
    primarySignal: load_externalization
    secondarySignals: [post_event_residue]
    primarySignalRole: native primary driver
    secondarySignalRoles: post_event_residue: native auxiliary modifier
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive

Q057:
  A:
    optionVectorId: Q057_A_NON_NUMERIC_VECTOR
    questionId: Q057
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: すぐには切り替わらず、少し尾を引く
    primarySignal: post_event_residue
    secondarySignals: [tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q057_B_NON_NUMERIC_VECTOR
    questionId: Q057
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 終わった安心感の方が大きい
    primarySignal: recovery_margin_need
    secondarySignals: [tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent recovery_pattern conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q057_C_NON_NUMERIC_VECTOR
    questionId: Q057
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: あとから細かい場面を思い返す
    primarySignal: later_review
    secondarySignals: [social_modulation, reply_delay_buffer, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: later_review: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent self_observation conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q057_D_NON_NUMERIC_VECTOR
    questionId: Q057
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 別の用事に入ると自然に薄まる
    primarySignal: reset_by_task
    secondarySignals: [tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: reset_by_task: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent recovery_pattern conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q057_E_NON_NUMERIC_VECTOR
    questionId: Q057
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 一度整理しないと次に入りにくい
    primarySignal: transition_buffer
    secondarySignals: [tension_pressure]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: tension_pressure: native auxiliary modifier
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: transition_buffer: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; transition_buffer remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference
    applicationStatus: needs_human_review_sensitive

Q058:
  A:
    optionVectorId: Q058_A_NON_NUMERIC_VECTOR
    questionId: Q058
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: social_contextual
    optionId: A
    sourceOptionText: 話せたことで軽くなる感じ
    primarySignal: load_externalization
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q058_B_NON_NUMERIC_VECTOR
    questionId: Q058
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: social_contextual
    optionId: B
    sourceOptionText: 言えなかったことが少し残る感じ
    primarySignal: post_event_residue
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q058_C_NON_NUMERIC_VECTOR
    questionId: Q058
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: social_contextual
    optionId: C
    sourceOptionText: 相手の反応を後から思い返す感じ
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, reply_delay_buffer, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q058_D_NON_NUMERIC_VECTOR
    questionId: Q058
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: social_contextual
    optionId: D
    sourceOptionText: 会話の内容より場の空気が残る感じ
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, post_event_residue, load_externalization]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; post_event_residue: native auxiliary modifier; load_externalization: native auxiliary modifier
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: atmosphere_reading: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation, post_event_residue
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q058_E_NON_NUMERIC_VECTOR
    questionId: Q058
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: social_contextual
    optionId: E
    sourceOptionText: 何も残さず次へ移れる感じ
    primarySignal: transition_reentry
    secondarySignals: [post_event_residue, social_modulation]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: post_event_residue: native auxiliary modifier; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: transition_reentry: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent rhythm_daily_flow conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; transition_reentry remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive

Q059:
  A:
    optionVectorId: Q059_A_NON_NUMERIC_VECTOR
    questionId: Q059
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 短く書き出して外に置く
    primarySignal: load_externalization
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q059_B_NON_NUMERIC_VECTOR
    questionId: Q059
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 別の小さな行動に移る
    primarySignal: reset_by_task
    secondarySignals: [small_start, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: reset_by_task: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent recovery_pattern conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, rhythm_structure_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q059_C_NON_NUMERIC_VECTOR
    questionId: Q059
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 静かな時間で自然に薄まるのを待つ
    primarySignal: quiet_reset_need
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q059_D_NON_NUMERIC_VECTOR
    questionId: Q059
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かに短く話して区切る
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, load_externalization, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: reset_by_social_contact: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q059_E_NON_NUMERIC_VECTOR
    questionId: Q059
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: そのまま持ちながら、次を軽めにする
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, method_shift]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent boundary conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied

Q060:
  A:
    optionVectorId: Q060_A_NON_NUMERIC_VECTOR
    questionId: Q060
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 言葉にしきれない部分があった
    primarySignal: unclear_load
    secondarySignals: [load_externalization, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: load_externalization: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary unclear_load nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; unclear_load remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q060_B_NON_NUMERIC_VECTOR
    questionId: Q060
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 人の反応を何度も思い返した
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, reply_delay_buffer, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=emotional_load; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reply_delay_buffer: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q060_C_NON_NUMERIC_VECTOR
    questionId: Q060
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 急に切り替える必要があった
    primarySignal: transition_buffer
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: transition_buffer: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent rhythm_daily_flow conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; transition_buffer remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q060_D_NON_NUMERIC_VECTOR
    questionId: Q060
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 自分の範囲を少し越えていた
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent boundary conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q060_E_NON_NUMERIC_VECTOR
    questionId: Q060
    dimensionCode: EL
    subdimensionCode: EL_AFTER_EFFECT
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 大事にしたいものが含まれていた
    primarySignal: purpose_recall
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by EL_AFTER_EFFECT source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary purpose_recall nativeFamily=action; source dimension nativeFamily=emotional_load; alignment=cross-family
    crossFamilyModifiers: purpose_recall: cross-family primary exception bounded by EL_AFTER_EFFECT source context; does not create independent action conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: emotional_load_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; purpose_recall remains source-bounded by EL_AFTER_EFFECT; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q061:
  A:
    optionVectorId: Q061_A_NON_NUMERIC_VECTOR
    questionId: Q061
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: core_behavior
    optionId: A
    sourceOptionText: すぐ短く返す方が楽なことが多い
    primarySignal: reply_delay_buffer
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary reply_delay_buffer nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reply_delay_buffer remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q061_B_NON_NUMERIC_VECTOR
    questionId: Q061
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: core_behavior
    optionId: B
    sourceOptionText: 内容を考えてから返したくなる
    primarySignal: decision_pause
    secondarySignals: [reply_delay_buffer]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier
    nativeFamilyContext: primary decision_pause nativeFamily=clarity_decision; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: decision_pause: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent clarity_decision conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; decision_pause remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q061_C_NON_NUMERIC_VECTOR
    questionId: Q061
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: core_behavior
    optionId: C
    sourceOptionText: 相手との距離で返し方が変わる
    primarySignal: social_modulation
    secondarySignals: [reply_delay_buffer, returnable_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier; returnable_distance: native auxiliary modifier
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q061_D_NON_NUMERIC_VECTOR
    questionId: Q061
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: core_behavior
    optionId: D
    sourceOptionText: いったん置いてから返す方が整いやすい
    primarySignal: reply_delay_buffer
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary reply_delay_buffer nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reply_delay_buffer remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q061_E_NON_NUMERIC_VECTOR
    questionId: Q061
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: core_behavior
    optionId: E
    sourceOptionText: 返す前に気持ちの余白がほしい
    primarySignal: recovery_margin_need
    secondarySignals: [reply_delay_buffer, quiet_reset_need]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent recovery_pattern conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive

Q062:
  A:
    optionVectorId: Q062_A_NON_NUMERIC_VECTOR
    questionId: Q062
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: まず短く返して区切りを作る
    primarySignal: reply_delay_buffer
    secondarySignals: [boundary_awareness, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_delay_buffer nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reply_delay_buffer remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q062_B_NON_NUMERIC_VECTOR
    questionId: Q062
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 返す内容を考えるまで置きたくなる
    primarySignal: response_timing_buffer
    secondarySignals: [reply_delay_buffer, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: response_timing_buffer: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent boundary conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q062_C_NON_NUMERIC_VECTOR
    questionId: Q062
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 返せる範囲だけ返したくなる
    primarySignal: boundary_awareness
    secondarySignals: [reply_delay_buffer, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent boundary conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q062_D_NON_NUMERIC_VECTOR
    questionId: Q062
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 相手を待たせている感じが気になりやすい
    primarySignal: reply_pressure
    secondarySignals: [social_modulation, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q062_E_NON_NUMERIC_VECTOR
    questionId: Q062
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 落ち着いた時間に返したくなる
    primarySignal: quiet_reset_need
    secondarySignals: [reply_delay_buffer, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent emotional_load conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive

Q063:
  A:
    optionVectorId: Q063_A_NON_NUMERIC_VECTOR
    questionId: Q063
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い人ほど早く返したくなる
    primarySignal: reply_pressure
    secondarySignals: [social_modulation, reply_delay_buffer]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; reply_delay_buffer: native auxiliary modifier
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q063_B_NON_NUMERIC_VECTOR
    questionId: Q063
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: social_contextual
    optionId: B
    sourceOptionText: 近い人ほど言葉を選びたくなる
    primarySignal: response_pause
    secondarySignals: [social_modulation, load_externalization]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: response_pause: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent boundary conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q063_C_NON_NUMERIC_VECTOR
    questionId: Q063
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: social_contextual
    optionId: C
    sourceOptionText: 距離がある人には短く返しやすい
    primarySignal: reply_delay_buffer
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier
    nativeFamilyContext: primary reply_delay_buffer nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; reply_delay_buffer remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q063_D_NON_NUMERIC_VECTOR
    questionId: Q063
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: social_contextual
    optionId: D
    sourceOptionText: 役割がある相手には慎重になりやすい
    primarySignal: role_load
    secondarySignals: [social_modulation, inner_weight_accumulation]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: role_load: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent boundary conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q063_E_NON_NUMERIC_VECTOR
    questionId: Q063
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: social_contextual
    optionId: E
    sourceOptionText: 相手より内容の重さで変わりやすい
    primarySignal: unclear_load
    secondarySignals: [social_modulation, inner_weight_accumulation]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary unclear_load nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: unclear_load: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent emotional_load conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; unclear_load remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive

Q064:
  A:
    optionVectorId: Q064_A_NON_NUMERIC_VECTOR
    questionId: Q064
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 短い一文から始める
    primarySignal: small_start
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: small_start: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent rhythm_daily_flow conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; small_start remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q064_B_NON_NUMERIC_VECTOR
    questionId: Q064
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: まず内容だけ下書きする
    primarySignal: partial_reasoning
    secondarySignals: [load_externalization, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent clarity_decision conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q064_C_NON_NUMERIC_VECTOR
    questionId: Q064
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 返す範囲を小さくする
    primarySignal: scope_expansion
    secondarySignals: [reply_delay_buffer, small_start, boundary_awareness, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent boundary conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q064_D_NON_NUMERIC_VECTOR
    questionId: Q064
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 次に同じ形になりにくい置き場所を作る
    primarySignal: environment_setup
    secondarySignals: [social_modulation, reset_by_place, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; reset_by_place: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary environment_setup nativeFamily=action; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: environment_setup: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent action conclusion; reset_by_place: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [action_entry_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; environment_setup remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q064_E_NON_NUMERIC_VECTOR
    questionId: Q064
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 時間が空いたことを重くしすぎない形にする
    primarySignal: explanation_recovery
    secondarySignals: [inner_weight_accumulation, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_recovery nativeFamily=clarity_decision; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: explanation_recovery: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent clarity_decision conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; explanation_recovery remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive

Q065:
  A:
    optionVectorId: Q065_A_NON_NUMERIC_VECTOR
    questionId: Q065
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: すぐ返す空気を感じる時
    primarySignal: reply_pressure
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q065_B_NON_NUMERIC_VECTOR
    questionId: Q065
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 言葉を選ぶ内容の時
    primarySignal: explanation_pressure
    secondarySignals: [load_externalization, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary explanation_pressure nativeFamily=clarity_decision; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: explanation_pressure: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent clarity_decision conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, emotional_load_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; explanation_pressure remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q065_C_NON_NUMERIC_VECTOR
    questionId: Q065
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 相手との距離が近い時
    primarySignal: returnable_distance
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q065_D_NON_NUMERIC_VECTOR
    questionId: Q065
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 返したあとも続きそうな時
    primarySignal: post_event_residue
    secondarySignals: [reply_pressure, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: reply_pressure: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent emotional_load conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q065_E_NON_NUMERIC_VECTOR
    questionId: Q065
    dimensionCode: SD
    subdimensionCode: SD_REPLY_PRESSURE
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 自分の余白が少ない時
    primarySignal: recovery_margin_need
    secondarySignals: [quiet_reset_need, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_REPLY_PRESSURE source context
    secondarySignalRoles: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by SD_REPLY_PRESSURE source context; does not create independent recovery_pattern conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, emotional_load_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, quiet_reset_need, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by SD_REPLY_PRESSURE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q066:
  A:
    optionVectorId: Q066_A_NON_NUMERIC_VECTOR
    questionId: Q066
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: core_behavior
    optionId: A
    sourceOptionText: 自然に読み取りながら動くことが多い
    primarySignal: atmosphere_reading
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q066_B_NON_NUMERIC_VECTOR
    questionId: Q066
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: core_behavior
    optionId: B
    sourceOptionText: 読み取るほど動き方を迷いやすい
    primarySignal: social_modulation
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q066_C_NON_NUMERIC_VECTOR
    questionId: Q066
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: core_behavior
    optionId: C
    sourceOptionText: 必要な分だけ見るようにしている
    primarySignal: boundary_awareness
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: none
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent boundary conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q066_D_NON_NUMERIC_VECTOR
    questionId: Q066
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: core_behavior
    optionId: D
    sourceOptionText: 後から「あれを読んでいた」と気づく
    primarySignal: delayed_notice
    secondarySignals: [later_review]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent self_observation conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q066_E_NON_NUMERIC_VECTOR
    questionId: Q066
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: core_behavior
    optionId: E
    sourceOptionText: 空気より自分の予定を保ちたい
    primarySignal: schedule_reframe
    secondarySignals: [social_modulation, boundary_awareness]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent rhythm_daily_flow conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, social_modulation, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied

Q067:
  A:
    optionVectorId: Q067_A_NON_NUMERIC_VECTOR
    questionId: Q067
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 少し様子を見てから動く
    primarySignal: delayed_entry
    secondarySignals: [recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_entry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: delayed_entry: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent rhythm_daily_flow conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_entry remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q067_B_NON_NUMERIC_VECTOR
    questionId: Q067
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 誰かの反応を手がかりにする
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q067_C_NON_NUMERIC_VECTOR
    questionId: Q067
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 自分から流れを作ろうとする
    primarySignal: social_modulation
    secondarySignals: [recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q067_D_NON_NUMERIC_VECTOR
    questionId: Q067
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 迷いながらもできる範囲で合わせる
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent boundary conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q067_E_NON_NUMERIC_VECTOR
    questionId: Q067
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 一度距離を置いて見直したくなる
    primarySignal: returnable_distance
    secondarySignals: [recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive

Q068:
  A:
    optionVectorId: Q068_A_NON_NUMERIC_VECTOR
    questionId: Q068
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: social_contextual
    optionId: A
    sourceOptionText: 声の大きい人に合わせやすい
    primarySignal: social_modulation
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q068_B_NON_NUMERIC_VECTOR
    questionId: Q068
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: social_contextual
    optionId: B
    sourceOptionText: 静かな人の様子も気になりやすい
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, quiet_reset_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation, quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q068_C_NON_NUMERIC_VECTOR
    questionId: Q068
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: social_contextual
    optionId: C
    sourceOptionText: 場全体が落ち着く形を探しやすい
    primarySignal: social_modulation
    secondarySignals: [quiet_reset_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q068_D_NON_NUMERIC_VECTOR
    questionId: Q068
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: social_contextual
    optionId: D
    sourceOptionText: 自分の考えを少し後ろに置きやすい
    primarySignal: scope_expansion
    secondarySignals: [later_review, social_modulation]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: native auxiliary modifier
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent boundary conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, later_review, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q068_E_NON_NUMERIC_VECTOR
    questionId: Q068
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: social_contextual
    optionId: E
    sourceOptionText: 合わせる範囲を決めておきたくなる
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: social_modulation: native auxiliary modifier
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent boundary conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied

Q069:
  A:
    optionVectorId: Q069_A_NON_NUMERIC_VECTOR
    questionId: Q069
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 一人で短く整える時間を取る
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent emotional_load conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q069_B_NON_NUMERIC_VECTOR
    questionId: Q069
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 自分の予定や用事に戻る
    primarySignal: schedule_reframe
    secondarySignals: [reset_by_task, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent rhythm_daily_flow conclusion; reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q069_C_NON_NUMERIC_VECTOR
    questionId: Q069
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 何を気にしていたか一つだけ見る
    primarySignal: state_notice
    secondarySignals: [small_start, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: state_notice: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent self_observation conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, rhythm_structure_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q069_D_NON_NUMERIC_VECTOR
    questionId: Q069
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 別の人と軽く話して切り替える
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, load_externalization, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: reset_by_social_contact: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent recovery_pattern conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q069_E_NON_NUMERIC_VECTOR
    questionId: Q069
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 次は見る範囲を少し狭くする
    primarySignal: boundary_awareness
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent boundary conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied

Q070:
  A:
    optionVectorId: Q070_A_NON_NUMERIC_VECTOR
    questionId: Q070
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 場の流れをつかみたい時
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: atmosphere_reading, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q070_B_NON_NUMERIC_VECTOR
    questionId: Q070
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 誰かの負担を増やしたくない時
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: social_load_residue: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent emotional_load conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q070_C_NON_NUMERIC_VECTOR
    questionId: Q070
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 自分の出方を少し調整したい時
    primarySignal: social_modulation
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q070_D_NON_NUMERIC_VECTOR
    questionId: Q070
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: その場の安全な距離を見たい時
    primarySignal: returnable_distance
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q070_E_NON_NUMERIC_VECTOR
    questionId: Q070
    dimensionCode: SD
    subdimensionCode: SD_ATMOSPHERE_READING
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 読みすぎない範囲が見えている時
    primarySignal: boundary_awareness
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_ATMOSPHERE_READING source context; does not create independent boundary conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_ATMOSPHERE_READING; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Q071:
  A:
    optionVectorId: Q071_A_NON_NUMERIC_VECTOR
    questionId: Q071
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: core_behavior
    optionId: A
    sourceOptionText: 少し離れても、短く戻れる距離
    primarySignal: returnable_distance
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q071_B_NON_NUMERIC_VECTOR
    questionId: Q071
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: core_behavior
    optionId: B
    sourceOptionText: 一度しっかり離れて整える距離
    primarySignal: quiet_reset_need
    secondarySignals: [returnable_distance]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: returnable_distance: native auxiliary modifier
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent emotional_load conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q071_C_NON_NUMERIC_VECTOR
    questionId: Q071
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: core_behavior
    optionId: C
    sourceOptionText: 連絡だけは残しておく距離
    primarySignal: reply_delay_buffer
    secondarySignals: [social_modulation, returnable_distance, inner_weight_accumulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_delay_buffer nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; reply_delay_buffer remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q071_D_NON_NUMERIC_VECTOR
    questionId: Q071
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: core_behavior
    optionId: D
    sourceOptionText: 相手に気づかれにくい小さな距離
    primarySignal: distance_after_friction
    secondarySignals: [social_modulation, returnable_distance, small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary distance_after_friction nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; distance_after_friction remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q071_E_NON_NUMERIC_VECTOR
    questionId: Q071
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: core_behavior
    optionId: E
    sourceOptionText: 自分の中で区切りが見える距離
    primarySignal: boundary_awareness
    secondarySignals: [returnable_distance, later_review]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: returnable_distance: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent boundary conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, returnable_distance, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q072:
  A:
    optionVectorId: Q072_A_NON_NUMERIC_VECTOR
    questionId: Q072
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: その場では近い距離を保とうとする
    primarySignal: social_modulation
    secondarySignals: [returnable_distance, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: returnable_distance: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q072_B_NON_NUMERIC_VECTOR
    questionId: Q072
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 少し返事や反応をゆっくりにする
    primarySignal: reply_delay_buffer
    secondarySignals: [social_modulation, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_delay_buffer nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reply_delay_buffer remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q072_C_NON_NUMERIC_VECTOR
    questionId: Q072
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 一人で考える時間を取りたくなる
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent emotional_load conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q072_D_NON_NUMERIC_VECTOR
    questionId: Q072
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 何に引っかかったか見てから戻る
    primarySignal: state_notice
    secondarySignals: [recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: state_notice: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent self_observation conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q072_E_NON_NUMERIC_VECTOR
    questionId: Q072
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 距離を変えずに内側だけ少し引く
    primarySignal: distance_after_friction
    secondarySignals: [returnable_distance, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: returnable_distance: native auxiliary modifier; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary distance_after_friction nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; distance_after_friction remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive

Q073:
  A:
    optionVectorId: Q073_A_NON_NUMERIC_VECTOR
    questionId: Q073
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い人ほど距離を取りにくい
    primarySignal: distance_after_friction
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier
    nativeFamilyContext: primary distance_after_friction nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; distance_after_friction remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q073_B_NON_NUMERIC_VECTOR
    questionId: Q073
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: social_contextual
    optionId: B
    sourceOptionText: 近い人ほど短く離れる時間が必要になる
    primarySignal: recovery_margin_need
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent recovery_pattern conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q073_C_NON_NUMERIC_VECTOR
    questionId: Q073
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: social_contextual
    optionId: C
    sourceOptionText: 役割がある相手には距離を保ちにくい
    primarySignal: role_load
    secondarySignals: [social_modulation, returnable_distance, boundary_awareness]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: role_load: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent boundary conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q073_D_NON_NUMERIC_VECTOR
    questionId: Q073
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: social_contextual
    optionId: D
    sourceOptionText: 距離がある相手には境目を作りやすい
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent boundary conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q073_E_NON_NUMERIC_VECTOR
    questionId: Q073
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: social_contextual
    optionId: E
    sourceOptionText: 関係より、その時の余白で変わりやすい
    primarySignal: recovery_margin_need
    secondarySignals: [quiet_reset_need, social_modulation]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: native auxiliary modifier
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent recovery_pattern conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, quiet_reset_need, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive

Q074:
  A:
    optionVectorId: Q074_A_NON_NUMERIC_VECTOR
    questionId: Q074
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 短い言葉で再開する
    primarySignal: social_reentry
    secondarySignals: [small_start, load_externalization, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_reentry nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, rhythm_structure_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; social_reentry remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q074_B_NON_NUMERIC_VECTOR
    questionId: Q074
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: いつもの話題から戻る
    primarySignal: routine_anchor
    secondarySignals: [load_externalization, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: routine_anchor: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent rhythm_daily_flow conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, emotional_load_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; routine_anchor remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q074_C_NON_NUMERIC_VECTOR
    questionId: Q074
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 自分の中で区切りがついてから戻る
    primarySignal: boundary_awareness
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent boundary conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q074_D_NON_NUMERIC_VECTOR
    questionId: Q074
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 相手の反応を見すぎず戻る
    primarySignal: social_modulation
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q074_E_NON_NUMERIC_VECTOR
    questionId: Q074
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 戻る前に距離の理由を自分で整理する
    primarySignal: state_notice
    secondarySignals: [returnable_distance, method_shift]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: returnable_distance: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: state_notice: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent self_observation conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q075:
  A:
    optionVectorId: Q075_A_NON_NUMERIC_VECTOR
    questionId: Q075
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 返せる余白が残っていること
    primarySignal: recovery_margin_need
    secondarySignals: [reply_delay_buffer, inner_weight_accumulation, quiet_reset_need, later_review]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: reply_delay_buffer: native auxiliary modifier; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent recovery_pattern conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, quiet_reset_need, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q075_B_NON_NUMERIC_VECTOR
    questionId: Q075
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 一人になる時間が少しあること
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; returnable_distance: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent emotional_load conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q075_C_NON_NUMERIC_VECTOR
    questionId: Q075
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 相手に合わせすぎない境目があること
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: social_modulation: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent boundary conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q075_D_NON_NUMERIC_VECTOR
    questionId: Q075
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 戻るきっかけが残っていること
    primarySignal: returnable_distance
    secondarySignals: [inner_weight_accumulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=social_distance; alignment=native
    crossFamilyModifiers: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q075_E_NON_NUMERIC_VECTOR
    questionId: Q075
    dimensionCode: SD
    subdimensionCode: SD_RETURNABLE_DISTANCE
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 近さと静けさの両方があること
    primarySignal: quiet_reset_need
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=social_distance; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SD_RETURNABLE_DISTANCE source context; does not create independent emotional_load conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: social_distance_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SD_RETURNABLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q076:
  A:
    optionVectorId: Q076_A_NON_NUMERIC_VECTOR
    questionId: Q076
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: core_behavior
    optionId: A
    sourceOptionText: 場所を少し変える
    primarySignal: reset_by_place
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_place nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_place remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q076_B_NON_NUMERIC_VECTOR
    questionId: Q076
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: core_behavior
    optionId: B
    sourceOptionText: 小さな用事を一つ終える
    primarySignal: reset_by_task
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q076_C_NON_NUMERIC_VECTOR
    questionId: Q076
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: core_behavior
    optionId: C
    sourceOptionText: 静かな時間を短く取る
    primarySignal: reset_by_quiet
    secondarySignals: [quiet_reset_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_quiet nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_quiet remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q076_D_NON_NUMERIC_VECTOR
    questionId: Q076
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: core_behavior
    optionId: D
    sourceOptionText: 誰かと軽く話す
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q076_E_NON_NUMERIC_VECTOR
    questionId: Q076
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: core_behavior
    optionId: E
    sourceOptionText: 書く、並べる、片づけるなど手を動かす
    primarySignal: load_externalization
    secondarySignals: [reset_by_task]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: reset_by_task: native auxiliary modifier
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: load_externalization: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent emotional_load conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q077:
  A:
    optionVectorId: Q077_A_NON_NUMERIC_VECTOR
    questionId: Q077
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: まず一人で短く整える
    primarySignal: reset_by_quiet
    secondarySignals: [social_modulation, returnable_distance, quiet_reset_need, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_quiet nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance, quiet_reset_need, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_quiet remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q077_B_NON_NUMERIC_VECTOR
    questionId: Q077
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 次の予定を軽めにする
    primarySignal: schedule_reframe
    secondarySignals: [boundary_awareness, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent rhythm_daily_flow conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, boundary_awareness, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q077_C_NON_NUMERIC_VECTOR
    questionId: Q077
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 目の前のものを少し片づける
    primarySignal: reset_by_task
    secondarySignals: [recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q077_D_NON_NUMERIC_VECTOR
    questionId: Q077
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 誰かに短く話して区切る
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, load_externalization, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q077_E_NON_NUMERIC_VECTOR
    questionId: Q077
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: その日は無理に戻さず、流れを小さくする
    primarySignal: recovery_margin_need
    secondarySignals: [small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q078:
  A:
    optionVectorId: Q078_A_NON_NUMERIC_VECTOR
    questionId: Q078
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: social_contextual
    optionId: A
    sourceOptionText: 人がいても自分の小さな動作で整える
    primarySignal: reset_by_task
    secondarySignals: [social_modulation, quiet_reset_need, small_start]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q078_B_NON_NUMERIC_VECTOR
    questionId: Q078
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: social_contextual
    optionId: B
    sourceOptionText: 一人になる時間が少し必要になる
    primarySignal: reset_by_quiet
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_quiet nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_quiet remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q078_C_NON_NUMERIC_VECTOR
    questionId: Q078
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: social_contextual
    optionId: C
    sourceOptionText: 誰かと軽く話す方が整いやすい
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q078_D_NON_NUMERIC_VECTOR
    questionId: Q078
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: social_contextual
    optionId: D
    sourceOptionText: 周りの流れに合わせながら整える
    primarySignal: social_modulation
    secondarySignals: [quiet_reset_need]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent social_distance conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q078_E_NON_NUMERIC_VECTOR
    questionId: Q078
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: social_contextual
    optionId: E
    sourceOptionText: その場では保って、あとで整える
    primarySignal: post_event_residue
    secondarySignals: [social_modulation, quiet_reset_need, later_review]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; quiet_reset_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, social_modulation, quiet_reset_need, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive

Q079:
  A:
    optionVectorId: Q079_A_NON_NUMERIC_VECTOR
    questionId: Q079
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 時間を短くする
    primarySignal: schedule_reframe
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: method_shift: native auxiliary modifier
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q079_B_NON_NUMERIC_VECTOR
    questionId: Q079
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 場所だけ変える
    primarySignal: reset_by_place
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: native auxiliary modifier
    nativeFamilyContext: primary reset_by_place nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_place remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q079_C_NON_NUMERIC_VECTOR
    questionId: Q079
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: やることを一つにしぼる
    primarySignal: scope_expansion
    secondarySignals: [small_start, boundary_awareness, method_shift]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: native auxiliary modifier
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent boundary conclusion; small_start: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q079_D_NON_NUMERIC_VECTOR
    questionId: Q079
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かに話す量を少なくする
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, load_externalization, method_shift]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: native auxiliary modifier
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no boundary coaching; no work/family-role judgment
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q079_E_NON_NUMERIC_VECTOR
    questionId: Q079
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 戻ろうとするより、次を軽くする
    primarySignal: method_shift
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q080:
  A:
    optionVectorId: Q080_A_NON_NUMERIC_VECTOR
    questionId: Q080
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: すぐ始められる小ささ
    primarySignal: small_start
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: small_start: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent rhythm_daily_flow conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; small_start remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q080_B_NON_NUMERIC_VECTOR
    questionId: Q080
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 人に見せなくてもできること
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no boundary coaching; no work/family-role judgment; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q080_C_NON_NUMERIC_VECTOR
    questionId: Q080
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 終わった感じが少し残ること
    primarySignal: post_event_residue
    secondarySignals: [inner_weight_accumulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent emotional_load conclusion; inner_weight_accumulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: post_event_residue, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; non-clinical emotional-load handling; no burnout/anxiety claim; no treatment/therapy inference; no maturity/superiority framing; no fixed identity
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q080_D_NON_NUMERIC_VECTOR
    questionId: Q080
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 場所や時間を選びすぎないこと
    primarySignal: routine_flexibility
    secondarySignals: [social_modulation, reset_by_place, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_flexibility nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: routine_flexibility: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent rhythm_daily_flow conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; routine_flexibility remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q080_E_NON_NUMERIC_VECTOR
    questionId: Q080
    dimensionCode: RP
    subdimensionCode: RP_RESET_METHOD
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 次の動きにつながること
    primarySignal: continuation_reentry
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RESET_METHOD source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary continuation_reentry nativeFamily=action; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: continuation_reentry: cross-family primary exception bounded by RP_RESET_METHOD source context; does not create independent action conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [action_entry_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; continuation_reentry remains source-bounded by RP_RESET_METHOD; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no maturity/superiority framing; no fixed identity
    applicationStatus: non_numeric_option_vector_applied

Batch audit:
- batchAudit: Batch B Q041–Q080 processed only as a 200-option non-numeric option vector application draft. Required fields are present for all vectors. No Q001–Q040 reprocessing, no Q081–Q120 processing, no Batch C vectors, no full 120Q vectors, no numeric scoring, no formulas, no code, no result taxonomy, no result names, no result copy, no report copy, and no launch action are included.
- safetyAudit: Batch B high-sensitivity EL/SD/RP materials are handled as private/internal raw vectors. EL signals remain non-clinical and non-diagnostic with no burnout/anxiety claim and no treatment/therapy inference. SD signals preserve no reply/no-reply advice, no contact/no-contact advice, no relationship diagnosis, no dependency framing, and no partner/family inference. RP signals preserve no therapy framing, no wellness prescription, no self-care quality judgment, and no health-status inference.
- visibilityAudit: All raw vectors use rawVectorVisibility: internal_private, publicSummaryEligibility: not_assessed_in_this_stage, and shareEligibility: forbidden. public_summary_allowed_broad_only is not used as a raw option-vector default. private_report_only/privateReportEligibility does not equal share permission.
- sensitivityAudit: Strictest-signal handling applied. private_medium EL/SD vectors and all private_high vectors are routed through needsReviewItems. private_medium/private_high mean privacy and sensitivity handling only, not severity, pathology, danger, or importance.
- signalTagAudit: Approved signal tags only. Unknown signal tags: none. Missing required fields: none. Batch B uses approved AR, EL, SD, and RP signal families with controlled cross-family modifiers.
- protocolComplianceAudit: All required optionVector fields are present: optionVectorId, questionId, dimensionCode, subdimensionCode, variantType, optionId, sourceOptionText, primarySignal, secondarySignals, primarySignalRole, secondarySignalRoles, nativeFamilyContext, crossFamilyModifiers, sourceContextContentAxis, evidenceRoleAxes, contentAxes, controlAxes, sensitivityResolution, visibilityResolution, confidenceRole, intensityRole, dominanceControlNotes, privateInterpretationBoundary, safetyBoundary, and applicationStatus. No truncation markers or placeholders are used.
- crossFamilyModifierSummary:
  - Q041_C_NON_NUMERIC_VECTOR: delayed_entry in AR_RESTART
  - Q041_E_NON_NUMERIC_VECTOR: method_shift in AR_RESTART
  - Q042_A_NON_NUMERIC_VECTOR: scope_expansion in AR_RESTART
  - Q042_C_NON_NUMERIC_VECTOR: contextual_entry in AR_RESTART
  - Q043_B_NON_NUMERIC_VECTOR: atmosphere_reading in AR_RESTART
  - Q043_C_NON_NUMERIC_VECTOR: response_timing_buffer in AR_RESTART
  - Q043_D_NON_NUMERIC_VECTOR: explanation_recovery in AR_RESTART
  - Q043_E_NON_NUMERIC_VECTOR: boundary_awareness in AR_RESTART
  - Q044_A_NON_NUMERIC_VECTOR: small_start in AR_RESTART
  - Q044_C_NON_NUMERIC_VECTOR: method_shift in AR_RESTART
  - Q044_D_NON_NUMERIC_VECTOR: partial_reasoning in AR_RESTART
  - Q045_B_NON_NUMERIC_VECTOR: small_start in AR_RESTART
  - Q046_E_NON_NUMERIC_VECTOR: delayed_notice in EL_INNER_WEIGHT
  - Q047_A_NON_NUMERIC_VECTOR: recovery_margin_need in EL_INNER_WEIGHT
  - Q047_B_NON_NUMERIC_VECTOR: option_overload in EL_INNER_WEIGHT
  - Q047_D_NON_NUMERIC_VECTOR: continuation_by_marker in EL_INNER_WEIGHT
  - Q047_E_NON_NUMERIC_VECTOR: whole_picture_needed in EL_INNER_WEIGHT
  - Q048_B_NON_NUMERIC_VECTOR: social_start_support in EL_INNER_WEIGHT
  - Q048_D_NON_NUMERIC_VECTOR: boundary_awareness in EL_INNER_WEIGHT
  - Q049_B_NON_NUMERIC_VECTOR: returnable_distance in EL_INNER_WEIGHT
  - Q049_C_NON_NUMERIC_VECTOR: reset_by_task in EL_INNER_WEIGHT
  - Q049_E_NON_NUMERIC_VECTOR: recovery_margin_need in EL_INNER_WEIGHT
  - Q050_B_NON_NUMERIC_VECTOR: state_notice in EL_INNER_WEIGHT
  - Q050_C_NON_NUMERIC_VECTOR: returnable_distance in EL_INNER_WEIGHT
  - Q050_E_NON_NUMERIC_VECTOR: delayed_notice in EL_INNER_WEIGHT
  - Q051_B_NON_NUMERIC_VECTOR: atmosphere_reading in EL_TENSION
  - Q051_C_NON_NUMERIC_VECTOR: decision_pause in EL_TENSION
  - Q051_E_NON_NUMERIC_VECTOR: delayed_notice in EL_TENSION
  - Q052_A_NON_NUMERIC_VECTOR: atmosphere_reading in EL_TENSION
  - Q052_D_NON_NUMERIC_VECTOR: response_pause in EL_TENSION
  - Q053_A_NON_NUMERIC_VECTOR: atmosphere_reading in EL_TENSION
  - Q053_C_NON_NUMERIC_VECTOR: social_modulation in EL_TENSION
  - Q053_E_NON_NUMERIC_VECTOR: later_review in EL_TENSION
  - Q054_A_NON_NUMERIC_VECTOR: transition_buffer in EL_TENSION
  - Q054_B_NON_NUMERIC_VECTOR: recovery_margin_need in EL_TENSION
  - Q054_C_NON_NUMERIC_VECTOR: reset_by_place in EL_TENSION
  - Q054_D_NON_NUMERIC_VECTOR: social_input_sensitive in EL_TENSION
  - Q054_E_NON_NUMERIC_VECTOR: scope_expansion in EL_TENSION
  - Q055_A_NON_NUMERIC_VECTOR: reply_pressure in EL_TENSION
  - Q055_B_NON_NUMERIC_VECTOR: atmosphere_reading in EL_TENSION
  - Q055_D_NON_NUMERIC_VECTOR: later_review in EL_TENSION
  - Q055_E_NON_NUMERIC_VECTOR: recovery_margin_need in EL_TENSION
  - Q056_A_NON_NUMERIC_VECTOR: transition_reentry in EL_AFTER_EFFECT
  - Q056_B_NON_NUMERIC_VECTOR: transition_buffer in EL_AFTER_EFFECT
  - Q056_D_NON_NUMERIC_VECTOR: delayed_notice in EL_AFTER_EFFECT
  - Q057_B_NON_NUMERIC_VECTOR: recovery_margin_need in EL_AFTER_EFFECT
  - Q057_C_NON_NUMERIC_VECTOR: later_review in EL_AFTER_EFFECT
  - Q057_D_NON_NUMERIC_VECTOR: reset_by_task in EL_AFTER_EFFECT
  - Q057_E_NON_NUMERIC_VECTOR: transition_buffer in EL_AFTER_EFFECT
  - Q058_D_NON_NUMERIC_VECTOR: atmosphere_reading in EL_AFTER_EFFECT
  - Q058_E_NON_NUMERIC_VECTOR: transition_reentry in EL_AFTER_EFFECT
  - Q059_B_NON_NUMERIC_VECTOR: reset_by_task in EL_AFTER_EFFECT
  - Q059_D_NON_NUMERIC_VECTOR: reset_by_social_contact in EL_AFTER_EFFECT
  - Q059_E_NON_NUMERIC_VECTOR: scope_expansion in EL_AFTER_EFFECT
  - Q060_C_NON_NUMERIC_VECTOR: transition_buffer in EL_AFTER_EFFECT
  - Q060_D_NON_NUMERIC_VECTOR: scope_expansion in EL_AFTER_EFFECT
  - Q060_E_NON_NUMERIC_VECTOR: purpose_recall in EL_AFTER_EFFECT
  - Q061_B_NON_NUMERIC_VECTOR: decision_pause in SD_REPLY_PRESSURE
  - Q061_E_NON_NUMERIC_VECTOR: recovery_margin_need in SD_REPLY_PRESSURE
  - Q062_B_NON_NUMERIC_VECTOR: response_timing_buffer in SD_REPLY_PRESSURE
  - Q062_C_NON_NUMERIC_VECTOR: boundary_awareness in SD_REPLY_PRESSURE
  - Q062_E_NON_NUMERIC_VECTOR: quiet_reset_need in SD_REPLY_PRESSURE
  - Q063_B_NON_NUMERIC_VECTOR: response_pause in SD_REPLY_PRESSURE
  - Q063_D_NON_NUMERIC_VECTOR: role_load in SD_REPLY_PRESSURE
  - Q063_E_NON_NUMERIC_VECTOR: unclear_load in SD_REPLY_PRESSURE
  - Q064_A_NON_NUMERIC_VECTOR: small_start in SD_REPLY_PRESSURE
  - Q064_B_NON_NUMERIC_VECTOR: partial_reasoning in SD_REPLY_PRESSURE
  - Q064_C_NON_NUMERIC_VECTOR: scope_expansion in SD_REPLY_PRESSURE
  - Q064_D_NON_NUMERIC_VECTOR: environment_setup in SD_REPLY_PRESSURE
  - Q064_E_NON_NUMERIC_VECTOR: explanation_recovery in SD_REPLY_PRESSURE
  - Q065_B_NON_NUMERIC_VECTOR: explanation_pressure in SD_REPLY_PRESSURE
  - Q065_D_NON_NUMERIC_VECTOR: post_event_residue in SD_REPLY_PRESSURE
  - Q065_E_NON_NUMERIC_VECTOR: recovery_margin_need in SD_REPLY_PRESSURE
  - Q066_C_NON_NUMERIC_VECTOR: boundary_awareness in SD_ATMOSPHERE_READING
  - Q066_D_NON_NUMERIC_VECTOR: delayed_notice in SD_ATMOSPHERE_READING
  - Q066_E_NON_NUMERIC_VECTOR: schedule_reframe in SD_ATMOSPHERE_READING
  - Q067_A_NON_NUMERIC_VECTOR: delayed_entry in SD_ATMOSPHERE_READING
  - Q067_D_NON_NUMERIC_VECTOR: scope_expansion in SD_ATMOSPHERE_READING
  - Q068_D_NON_NUMERIC_VECTOR: scope_expansion in SD_ATMOSPHERE_READING
  - Q068_E_NON_NUMERIC_VECTOR: boundary_awareness in SD_ATMOSPHERE_READING
  - Q069_A_NON_NUMERIC_VECTOR: quiet_reset_need in SD_ATMOSPHERE_READING
  - Q069_B_NON_NUMERIC_VECTOR: schedule_reframe in SD_ATMOSPHERE_READING
  - Q069_C_NON_NUMERIC_VECTOR: state_notice in SD_ATMOSPHERE_READING
  - Q069_D_NON_NUMERIC_VECTOR: reset_by_social_contact in SD_ATMOSPHERE_READING
  - Q069_E_NON_NUMERIC_VECTOR: boundary_awareness in SD_ATMOSPHERE_READING
  - Q070_B_NON_NUMERIC_VECTOR: social_load_residue in SD_ATMOSPHERE_READING
  - Q070_E_NON_NUMERIC_VECTOR: boundary_awareness in SD_ATMOSPHERE_READING
  - Q071_B_NON_NUMERIC_VECTOR: quiet_reset_need in SD_RETURNABLE_DISTANCE
  - Q071_E_NON_NUMERIC_VECTOR: boundary_awareness in SD_RETURNABLE_DISTANCE
  - Q072_C_NON_NUMERIC_VECTOR: quiet_reset_need in SD_RETURNABLE_DISTANCE
  - Q072_D_NON_NUMERIC_VECTOR: state_notice in SD_RETURNABLE_DISTANCE
  - Q073_B_NON_NUMERIC_VECTOR: recovery_margin_need in SD_RETURNABLE_DISTANCE
  - Q073_C_NON_NUMERIC_VECTOR: role_load in SD_RETURNABLE_DISTANCE
  - Q073_D_NON_NUMERIC_VECTOR: boundary_awareness in SD_RETURNABLE_DISTANCE
  - Q073_E_NON_NUMERIC_VECTOR: recovery_margin_need in SD_RETURNABLE_DISTANCE
  - Q074_B_NON_NUMERIC_VECTOR: routine_anchor in SD_RETURNABLE_DISTANCE
  - Q074_C_NON_NUMERIC_VECTOR: boundary_awareness in SD_RETURNABLE_DISTANCE
  - Q074_E_NON_NUMERIC_VECTOR: state_notice in SD_RETURNABLE_DISTANCE
  - Q075_A_NON_NUMERIC_VECTOR: recovery_margin_need in SD_RETURNABLE_DISTANCE
  - Q075_B_NON_NUMERIC_VECTOR: quiet_reset_need in SD_RETURNABLE_DISTANCE
  - Q075_C_NON_NUMERIC_VECTOR: boundary_awareness in SD_RETURNABLE_DISTANCE
  - Q075_E_NON_NUMERIC_VECTOR: quiet_reset_need in SD_RETURNABLE_DISTANCE
  - Q076_E_NON_NUMERIC_VECTOR: load_externalization in RP_RESET_METHOD
  - Q077_B_NON_NUMERIC_VECTOR: schedule_reframe in RP_RESET_METHOD
  - Q078_D_NON_NUMERIC_VECTOR: social_modulation in RP_RESET_METHOD
  - Q078_E_NON_NUMERIC_VECTOR: post_event_residue in RP_RESET_METHOD
  - Q079_A_NON_NUMERIC_VECTOR: schedule_reframe in RP_RESET_METHOD
  - Q079_C_NON_NUMERIC_VECTOR: scope_expansion in RP_RESET_METHOD
  - Q079_D_NON_NUMERIC_VECTOR: boundary_awareness in RP_RESET_METHOD
  - Q080_A_NON_NUMERIC_VECTOR: small_start in RP_RESET_METHOD
  - Q080_B_NON_NUMERIC_VECTOR: boundary_awareness in RP_RESET_METHOD
  - Q080_C_NON_NUMERIC_VECTOR: post_event_residue in RP_RESET_METHOD
  - Q080_D_NON_NUMERIC_VECTOR: routine_flexibility in RP_RESET_METHOD
  - Q080_E_NON_NUMERIC_VECTOR: continuation_reentry in RP_RESET_METHOD
- broadTagSummary:
  - atmosphere_reading: Q043_B_NON_NUMERIC_VECTOR, Q051_B_NON_NUMERIC_VECTOR, Q052_A_NON_NUMERIC_VECTOR, Q053_A_NON_NUMERIC_VECTOR, Q055_B_NON_NUMERIC_VECTOR, Q058_D_NON_NUMERIC_VECTOR, Q066_A_NON_NUMERIC_VECTOR, Q067_B_NON_NUMERIC_VECTOR, Q068_B_NON_NUMERIC_VECTOR, Q070_A_NON_NUMERIC_VECTOR
  - boundary_awareness: Q042_A_NON_NUMERIC_VECTOR, Q042_D_NON_NUMERIC_VECTOR, Q043_E_NON_NUMERIC_VECTOR, Q047_A_NON_NUMERIC_VECTOR, Q048_D_NON_NUMERIC_VECTOR, Q049_C_NON_NUMERIC_VECTOR, Q054_B_NON_NUMERIC_VECTOR, Q054_E_NON_NUMERIC_VECTOR, Q059_E_NON_NUMERIC_VECTOR, Q060_D_NON_NUMERIC_VECTOR, Q062_A_NON_NUMERIC_VECTOR, Q062_C_NON_NUMERIC_VECTOR, Q064_C_NON_NUMERIC_VECTOR, Q066_C_NON_NUMERIC_VECTOR, Q066_E_NON_NUMERIC_VECTOR, Q067_D_NON_NUMERIC_VECTOR, Q068_E_NON_NUMERIC_VECTOR, Q069_E_NON_NUMERIC_VECTOR, Q070_E_NON_NUMERIC_VECTOR, Q071_E_NON_NUMERIC_VECTOR, Q073_C_NON_NUMERIC_VECTOR, Q073_D_NON_NUMERIC_VECTOR, Q074_C_NON_NUMERIC_VECTOR, Q075_C_NON_NUMERIC_VECTOR, Q077_B_NON_NUMERIC_VECTOR, Q079_C_NON_NUMERIC_VECTOR, Q079_D_NON_NUMERIC_VECTOR, Q080_B_NON_NUMERIC_VECTOR
  - later_review: Q042_B_NON_NUMERIC_VECTOR, Q042_D_NON_NUMERIC_VECTOR, Q045_A_NON_NUMERIC_VECTOR, Q045_B_NON_NUMERIC_VECTOR, Q045_C_NON_NUMERIC_VECTOR, Q045_D_NON_NUMERIC_VECTOR, Q045_E_NON_NUMERIC_VECTOR, Q046_C_NON_NUMERIC_VECTOR, Q046_E_NON_NUMERIC_VECTOR, Q048_B_NON_NUMERIC_VECTOR, Q048_D_NON_NUMERIC_VECTOR, Q048_E_NON_NUMERIC_VECTOR, Q050_A_NON_NUMERIC_VECTOR, Q050_B_NON_NUMERIC_VECTOR, Q050_C_NON_NUMERIC_VECTOR, Q050_D_NON_NUMERIC_VECTOR, Q050_E_NON_NUMERIC_VECTOR, Q051_E_NON_NUMERIC_VECTOR, Q052_E_NON_NUMERIC_VECTOR, Q053_D_NON_NUMERIC_VECTOR, Q053_E_NON_NUMERIC_VECTOR, Q055_A_NON_NUMERIC_VECTOR, Q055_B_NON_NUMERIC_VECTOR, Q055_C_NON_NUMERIC_VECTOR, Q055_D_NON_NUMERIC_VECTOR, Q055_E_NON_NUMERIC_VECTOR, Q056_C_NON_NUMERIC_VECTOR, Q057_C_NON_NUMERIC_VECTOR, Q058_C_NON_NUMERIC_VECTOR, Q060_A_NON_NUMERIC_VECTOR, Q060_B_NON_NUMERIC_VECTOR, Q060_C_NON_NUMERIC_VECTOR, Q060_D_NON_NUMERIC_VECTOR, Q060_E_NON_NUMERIC_VECTOR, Q065_A_NON_NUMERIC_VECTOR, Q065_B_NON_NUMERIC_VECTOR, Q065_C_NON_NUMERIC_VECTOR, Q065_D_NON_NUMERIC_VECTOR, Q065_E_NON_NUMERIC_VECTOR, Q066_D_NON_NUMERIC_VECTOR, Q068_D_NON_NUMERIC_VECTOR, Q070_A_NON_NUMERIC_VECTOR, Q070_B_NON_NUMERIC_VECTOR, Q070_C_NON_NUMERIC_VECTOR, Q070_D_NON_NUMERIC_VECTOR, Q070_E_NON_NUMERIC_VECTOR, Q071_E_NON_NUMERIC_VECTOR, Q075_A_NON_NUMERIC_VECTOR, Q075_B_NON_NUMERIC_VECTOR, Q075_C_NON_NUMERIC_VECTOR, Q075_D_NON_NUMERIC_VECTOR, Q075_E_NON_NUMERIC_VECTOR, Q078_E_NON_NUMERIC_VECTOR, Q080_A_NON_NUMERIC_VECTOR, Q080_B_NON_NUMERIC_VECTOR, Q080_C_NON_NUMERIC_VECTOR, Q080_D_NON_NUMERIC_VECTOR, Q080_E_NON_NUMERIC_VECTOR
  - partial_reasoning: Q044_D_NON_NUMERIC_VECTOR, Q064_B_NON_NUMERIC_VECTOR
  - post_event_residue: Q047_C_NON_NUMERIC_VECTOR, Q048_E_NON_NUMERIC_VECTOR, Q051_D_NON_NUMERIC_VECTOR, Q052_E_NON_NUMERIC_VECTOR, Q056_C_NON_NUMERIC_VECTOR, Q056_D_NON_NUMERIC_VECTOR, Q056_E_NON_NUMERIC_VECTOR, Q057_A_NON_NUMERIC_VECTOR, Q058_B_NON_NUMERIC_VECTOR, Q058_D_NON_NUMERIC_VECTOR, Q058_E_NON_NUMERIC_VECTOR, Q065_D_NON_NUMERIC_VECTOR, Q078_E_NON_NUMERIC_VECTOR, Q080_C_NON_NUMERIC_VECTOR
  - quiet_reset_need: Q046_D_NON_NUMERIC_VECTOR, Q050_A_NON_NUMERIC_VECTOR, Q052_A_NON_NUMERIC_VECTOR, Q053_D_NON_NUMERIC_VECTOR, Q055_E_NON_NUMERIC_VECTOR, Q059_C_NON_NUMERIC_VECTOR, Q061_E_NON_NUMERIC_VECTOR, Q062_E_NON_NUMERIC_VECTOR, Q065_E_NON_NUMERIC_VECTOR, Q068_B_NON_NUMERIC_VECTOR, Q068_C_NON_NUMERIC_VECTOR, Q069_A_NON_NUMERIC_VECTOR, Q071_B_NON_NUMERIC_VECTOR, Q072_C_NON_NUMERIC_VECTOR, Q073_E_NON_NUMERIC_VECTOR, Q075_A_NON_NUMERIC_VECTOR, Q075_B_NON_NUMERIC_VECTOR, Q075_E_NON_NUMERIC_VECTOR, Q076_C_NON_NUMERIC_VECTOR, Q077_A_NON_NUMERIC_VECTOR, Q078_A_NON_NUMERIC_VECTOR, Q078_D_NON_NUMERIC_VECTOR, Q078_E_NON_NUMERIC_VECTOR
  - recovery_margin_need: Q042_A_NON_NUMERIC_VECTOR, Q042_B_NON_NUMERIC_VECTOR, Q042_C_NON_NUMERIC_VECTOR, Q042_D_NON_NUMERIC_VECTOR, Q042_E_NON_NUMERIC_VECTOR, Q047_A_NON_NUMERIC_VECTOR, Q049_E_NON_NUMERIC_VECTOR, Q054_B_NON_NUMERIC_VECTOR, Q055_E_NON_NUMERIC_VECTOR, Q057_B_NON_NUMERIC_VECTOR, Q061_E_NON_NUMERIC_VECTOR, Q062_A_NON_NUMERIC_VECTOR, Q062_B_NON_NUMERIC_VECTOR, Q062_C_NON_NUMERIC_VECTOR, Q062_D_NON_NUMERIC_VECTOR, Q062_E_NON_NUMERIC_VECTOR, Q065_E_NON_NUMERIC_VECTOR, Q067_A_NON_NUMERIC_VECTOR, Q067_B_NON_NUMERIC_VECTOR, Q067_C_NON_NUMERIC_VECTOR, Q067_D_NON_NUMERIC_VECTOR, Q067_E_NON_NUMERIC_VECTOR, Q072_A_NON_NUMERIC_VECTOR, Q072_B_NON_NUMERIC_VECTOR, Q072_C_NON_NUMERIC_VECTOR, Q072_D_NON_NUMERIC_VECTOR, Q072_E_NON_NUMERIC_VECTOR, Q073_B_NON_NUMERIC_VECTOR, Q073_E_NON_NUMERIC_VECTOR, Q075_A_NON_NUMERIC_VECTOR, Q077_A_NON_NUMERIC_VECTOR, Q077_B_NON_NUMERIC_VECTOR, Q077_C_NON_NUMERIC_VECTOR, Q077_D_NON_NUMERIC_VECTOR, Q077_E_NON_NUMERIC_VECTOR
  - returnable_distance: Q043_C_NON_NUMERIC_VECTOR, Q049_B_NON_NUMERIC_VECTOR, Q050_C_NON_NUMERIC_VECTOR, Q053_D_NON_NUMERIC_VECTOR, Q056_D_NON_NUMERIC_VECTOR, Q061_C_NON_NUMERIC_VECTOR, Q063_C_NON_NUMERIC_VECTOR, Q065_C_NON_NUMERIC_VECTOR, Q067_E_NON_NUMERIC_VECTOR, Q069_A_NON_NUMERIC_VECTOR, Q070_D_NON_NUMERIC_VECTOR, Q071_A_NON_NUMERIC_VECTOR, Q071_B_NON_NUMERIC_VECTOR, Q071_C_NON_NUMERIC_VECTOR, Q071_D_NON_NUMERIC_VECTOR, Q071_E_NON_NUMERIC_VECTOR, Q072_A_NON_NUMERIC_VECTOR, Q072_C_NON_NUMERIC_VECTOR, Q072_E_NON_NUMERIC_VECTOR, Q073_A_NON_NUMERIC_VECTOR, Q073_B_NON_NUMERIC_VECTOR, Q073_C_NON_NUMERIC_VECTOR, Q073_D_NON_NUMERIC_VECTOR, Q074_E_NON_NUMERIC_VECTOR, Q075_B_NON_NUMERIC_VECTOR, Q075_D_NON_NUMERIC_VECTOR, Q077_A_NON_NUMERIC_VECTOR, Q078_B_NON_NUMERIC_VECTOR
  - schedule_reframe: Q066_E_NON_NUMERIC_VECTOR, Q069_B_NON_NUMERIC_VECTOR, Q077_B_NON_NUMERIC_VECTOR, Q079_A_NON_NUMERIC_VECTOR
  - scope_expansion: Q042_A_NON_NUMERIC_VECTOR, Q054_E_NON_NUMERIC_VECTOR, Q059_E_NON_NUMERIC_VECTOR, Q060_D_NON_NUMERIC_VECTOR, Q064_C_NON_NUMERIC_VECTOR, Q067_D_NON_NUMERIC_VECTOR, Q068_D_NON_NUMERIC_VECTOR, Q079_C_NON_NUMERIC_VECTOR
  - social_modulation: Q041_D_NON_NUMERIC_VECTOR, Q043_A_NON_NUMERIC_VECTOR, Q043_B_NON_NUMERIC_VECTOR, Q043_C_NON_NUMERIC_VECTOR, Q043_D_NON_NUMERIC_VECTOR, Q043_E_NON_NUMERIC_VECTOR, Q044_D_NON_NUMERIC_VECTOR, Q045_A_NON_NUMERIC_VECTOR, Q045_B_NON_NUMERIC_VECTOR, Q045_D_NON_NUMERIC_VECTOR, Q046_C_NON_NUMERIC_VECTOR, Q048_A_NON_NUMERIC_VECTOR, Q048_B_NON_NUMERIC_VECTOR, Q048_C_NON_NUMERIC_VECTOR, Q048_D_NON_NUMERIC_VECTOR, Q048_E_NON_NUMERIC_VECTOR, Q049_B_NON_NUMERIC_VECTOR, Q049_D_NON_NUMERIC_VECTOR, Q050_C_NON_NUMERIC_VECTOR, Q051_A_NON_NUMERIC_VECTOR, Q051_B_NON_NUMERIC_VECTOR, Q051_C_NON_NUMERIC_VECTOR, Q052_A_NON_NUMERIC_VECTOR, Q052_C_NON_NUMERIC_VECTOR, Q053_A_NON_NUMERIC_VECTOR, Q053_B_NON_NUMERIC_VECTOR, Q053_C_NON_NUMERIC_VECTOR, Q053_D_NON_NUMERIC_VECTOR, Q053_E_NON_NUMERIC_VECTOR, Q054_C_NON_NUMERIC_VECTOR, Q054_D_NON_NUMERIC_VECTOR, Q055_B_NON_NUMERIC_VECTOR, Q056_D_NON_NUMERIC_VECTOR, Q057_C_NON_NUMERIC_VECTOR, Q058_A_NON_NUMERIC_VECTOR, Q058_B_NON_NUMERIC_VECTOR, Q058_C_NON_NUMERIC_VECTOR, Q058_D_NON_NUMERIC_VECTOR, Q058_E_NON_NUMERIC_VECTOR, Q059_D_NON_NUMERIC_VECTOR, Q060_B_NON_NUMERIC_VECTOR, Q061_C_NON_NUMERIC_VECTOR, Q062_D_NON_NUMERIC_VECTOR, Q063_A_NON_NUMERIC_VECTOR, Q063_B_NON_NUMERIC_VECTOR, Q063_C_NON_NUMERIC_VECTOR, Q063_D_NON_NUMERIC_VECTOR, Q063_E_NON_NUMERIC_VECTOR, Q064_D_NON_NUMERIC_VECTOR, Q065_A_NON_NUMERIC_VECTOR, Q065_C_NON_NUMERIC_VECTOR, Q066_B_NON_NUMERIC_VECTOR, Q066_E_NON_NUMERIC_VECTOR, Q067_B_NON_NUMERIC_VECTOR, Q067_C_NON_NUMERIC_VECTOR, Q068_A_NON_NUMERIC_VECTOR, Q068_B_NON_NUMERIC_VECTOR, Q068_C_NON_NUMERIC_VECTOR, Q068_D_NON_NUMERIC_VECTOR, Q068_E_NON_NUMERIC_VECTOR, Q069_A_NON_NUMERIC_VECTOR, Q069_D_NON_NUMERIC_VECTOR, Q070_A_NON_NUMERIC_VECTOR, Q070_B_NON_NUMERIC_VECTOR, Q070_C_NON_NUMERIC_VECTOR, Q070_D_NON_NUMERIC_VECTOR, Q071_C_NON_NUMERIC_VECTOR, Q071_D_NON_NUMERIC_VECTOR, Q072_A_NON_NUMERIC_VECTOR, Q072_B_NON_NUMERIC_VECTOR, Q072_C_NON_NUMERIC_VECTOR, Q073_A_NON_NUMERIC_VECTOR, Q073_B_NON_NUMERIC_VECTOR, Q073_C_NON_NUMERIC_VECTOR, Q073_D_NON_NUMERIC_VECTOR, Q073_E_NON_NUMERIC_VECTOR, Q074_D_NON_NUMERIC_VECTOR, Q075_B_NON_NUMERIC_VECTOR, Q075_C_NON_NUMERIC_VECTOR, Q076_A_NON_NUMERIC_VECTOR, Q076_D_NON_NUMERIC_VECTOR, Q077_A_NON_NUMERIC_VECTOR, Q077_D_NON_NUMERIC_VECTOR, Q078_A_NON_NUMERIC_VECTOR, Q078_B_NON_NUMERIC_VECTOR, Q078_C_NON_NUMERIC_VECTOR, Q078_D_NON_NUMERIC_VECTOR, Q078_E_NON_NUMERIC_VECTOR, Q079_B_NON_NUMERIC_VECTOR, Q079_D_NON_NUMERIC_VECTOR, Q080_B_NON_NUMERIC_VECTOR, Q080_D_NON_NUMERIC_VECTOR
  - state_notice: Q050_B_NON_NUMERIC_VECTOR, Q069_C_NON_NUMERIC_VECTOR, Q072_D_NON_NUMERIC_VECTOR, Q074_E_NON_NUMERIC_VECTOR
- highRiskTagSummary:
  - distance_after_friction: Q071_D_NON_NUMERIC_VECTOR, Q072_E_NON_NUMERIC_VECTOR, Q073_A_NON_NUMERIC_VECTOR
  - inner_weight_accumulation: Q043_B_NON_NUMERIC_VECTOR, Q046_A_NON_NUMERIC_VECTOR, Q046_B_NON_NUMERIC_VECTOR, Q046_C_NON_NUMERIC_VECTOR, Q046_E_NON_NUMERIC_VECTOR, Q047_C_NON_NUMERIC_VECTOR, Q047_E_NON_NUMERIC_VECTOR, Q048_A_NON_NUMERIC_VECTOR, Q048_C_NON_NUMERIC_VECTOR, Q048_E_NON_NUMERIC_VECTOR, Q049_A_NON_NUMERIC_VECTOR, Q050_B_NON_NUMERIC_VECTOR, Q051_A_NON_NUMERIC_VECTOR, Q051_B_NON_NUMERIC_VECTOR, Q051_C_NON_NUMERIC_VECTOR, Q051_D_NON_NUMERIC_VECTOR, Q051_E_NON_NUMERIC_VECTOR, Q052_A_NON_NUMERIC_VECTOR, Q052_B_NON_NUMERIC_VECTOR, Q052_C_NON_NUMERIC_VECTOR, Q052_D_NON_NUMERIC_VECTOR, Q052_E_NON_NUMERIC_VECTOR, Q053_B_NON_NUMERIC_VECTOR, Q054_E_NON_NUMERIC_VECTOR, Q063_D_NON_NUMERIC_VECTOR, Q063_E_NON_NUMERIC_VECTOR, Q064_E_NON_NUMERIC_VECTOR, Q071_C_NON_NUMERIC_VECTOR, Q075_A_NON_NUMERIC_VECTOR, Q075_D_NON_NUMERIC_VECTOR, Q080_C_NON_NUMERIC_VECTOR
  - post_event_residue: Q047_C_NON_NUMERIC_VECTOR, Q048_E_NON_NUMERIC_VECTOR, Q051_D_NON_NUMERIC_VECTOR, Q052_E_NON_NUMERIC_VECTOR, Q056_C_NON_NUMERIC_VECTOR, Q056_D_NON_NUMERIC_VECTOR, Q056_E_NON_NUMERIC_VECTOR, Q057_A_NON_NUMERIC_VECTOR, Q058_B_NON_NUMERIC_VECTOR, Q058_D_NON_NUMERIC_VECTOR, Q058_E_NON_NUMERIC_VECTOR, Q065_D_NON_NUMERIC_VECTOR, Q078_E_NON_NUMERIC_VECTOR, Q080_C_NON_NUMERIC_VECTOR
  - reply_delay_buffer: Q055_A_NON_NUMERIC_VECTOR, Q057_C_NON_NUMERIC_VECTOR, Q058_C_NON_NUMERIC_VECTOR, Q060_B_NON_NUMERIC_VECTOR, Q061_A_NON_NUMERIC_VECTOR, Q061_B_NON_NUMERIC_VECTOR, Q061_C_NON_NUMERIC_VECTOR, Q061_D_NON_NUMERIC_VECTOR, Q061_E_NON_NUMERIC_VECTOR, Q062_A_NON_NUMERIC_VECTOR, Q062_B_NON_NUMERIC_VECTOR, Q062_C_NON_NUMERIC_VECTOR, Q062_E_NON_NUMERIC_VECTOR, Q063_A_NON_NUMERIC_VECTOR, Q063_C_NON_NUMERIC_VECTOR, Q064_C_NON_NUMERIC_VECTOR, Q071_C_NON_NUMERIC_VECTOR, Q072_B_NON_NUMERIC_VECTOR, Q075_A_NON_NUMERIC_VECTOR
  - reply_pressure: Q055_A_NON_NUMERIC_VECTOR, Q062_D_NON_NUMERIC_VECTOR, Q063_A_NON_NUMERIC_VECTOR, Q065_A_NON_NUMERIC_VECTOR, Q065_D_NON_NUMERIC_VECTOR
  - returnable_distance: Q043_C_NON_NUMERIC_VECTOR, Q049_B_NON_NUMERIC_VECTOR, Q050_C_NON_NUMERIC_VECTOR, Q053_D_NON_NUMERIC_VECTOR, Q056_D_NON_NUMERIC_VECTOR, Q061_C_NON_NUMERIC_VECTOR, Q063_C_NON_NUMERIC_VECTOR, Q065_C_NON_NUMERIC_VECTOR, Q067_E_NON_NUMERIC_VECTOR, Q069_A_NON_NUMERIC_VECTOR, Q070_D_NON_NUMERIC_VECTOR, Q071_A_NON_NUMERIC_VECTOR, Q071_B_NON_NUMERIC_VECTOR, Q071_C_NON_NUMERIC_VECTOR, Q071_D_NON_NUMERIC_VECTOR, Q071_E_NON_NUMERIC_VECTOR, Q072_A_NON_NUMERIC_VECTOR, Q072_C_NON_NUMERIC_VECTOR, Q072_E_NON_NUMERIC_VECTOR, Q073_A_NON_NUMERIC_VECTOR, Q073_B_NON_NUMERIC_VECTOR, Q073_C_NON_NUMERIC_VECTOR, Q073_D_NON_NUMERIC_VECTOR, Q074_E_NON_NUMERIC_VECTOR, Q075_B_NON_NUMERIC_VECTOR, Q075_D_NON_NUMERIC_VECTOR, Q077_A_NON_NUMERIC_VECTOR, Q078_B_NON_NUMERIC_VECTOR
  - role_load: Q063_D_NON_NUMERIC_VECTOR, Q073_C_NON_NUMERIC_VECTOR
  - social_load_residue: Q046_C_NON_NUMERIC_VECTOR, Q048_A_NON_NUMERIC_VECTOR, Q052_C_NON_NUMERIC_VECTOR, Q058_C_NON_NUMERIC_VECTOR, Q060_B_NON_NUMERIC_VECTOR, Q070_B_NON_NUMERIC_VECTOR
  - tension_pressure: Q047_A_NON_NUMERIC_VECTOR, Q047_B_NON_NUMERIC_VECTOR, Q047_C_NON_NUMERIC_VECTOR, Q047_D_NON_NUMERIC_VECTOR, Q047_E_NON_NUMERIC_VECTOR, Q051_A_NON_NUMERIC_VECTOR, Q052_A_NON_NUMERIC_VECTOR, Q052_B_NON_NUMERIC_VECTOR, Q052_C_NON_NUMERIC_VECTOR, Q052_D_NON_NUMERIC_VECTOR, Q052_E_NON_NUMERIC_VECTOR, Q053_B_NON_NUMERIC_VECTOR, Q057_A_NON_NUMERIC_VECTOR, Q057_B_NON_NUMERIC_VECTOR, Q057_C_NON_NUMERIC_VECTOR, Q057_D_NON_NUMERIC_VECTOR, Q057_E_NON_NUMERIC_VECTOR
  - unclear_load: Q046_B_NON_NUMERIC_VECTOR, Q048_C_NON_NUMERIC_VECTOR, Q055_C_NON_NUMERIC_VECTOR, Q060_A_NON_NUMERIC_VECTOR, Q063_E_NON_NUMERIC_VECTOR
- needsReviewItems:
  - private_high vectors:
    - Q063_D_NON_NUMERIC_VECTOR
    - Q071_D_NON_NUMERIC_VECTOR
    - Q072_E_NON_NUMERIC_VECTOR
    - Q073_A_NON_NUMERIC_VECTOR
    - Q073_C_NON_NUMERIC_VECTOR
  - private_medium EL/SD vectors:
    - Q043_B_NON_NUMERIC_VECTOR
    - Q043_C_NON_NUMERIC_VECTOR
    - Q046_A_NON_NUMERIC_VECTOR
    - Q046_B_NON_NUMERIC_VECTOR
    - Q046_C_NON_NUMERIC_VECTOR
    - Q046_D_NON_NUMERIC_VECTOR
    - Q046_E_NON_NUMERIC_VECTOR
    - Q047_A_NON_NUMERIC_VECTOR
    - Q047_B_NON_NUMERIC_VECTOR
    - Q047_C_NON_NUMERIC_VECTOR
    - Q047_D_NON_NUMERIC_VECTOR
    - Q047_E_NON_NUMERIC_VECTOR
    - Q048_A_NON_NUMERIC_VECTOR
    - Q048_C_NON_NUMERIC_VECTOR
    - Q048_E_NON_NUMERIC_VECTOR
    - Q049_A_NON_NUMERIC_VECTOR
    - Q049_B_NON_NUMERIC_VECTOR
    - Q049_D_NON_NUMERIC_VECTOR
    - Q050_A_NON_NUMERIC_VECTOR
    - Q050_B_NON_NUMERIC_VECTOR
    - Q050_C_NON_NUMERIC_VECTOR
    - Q050_D_NON_NUMERIC_VECTOR
    - Q051_A_NON_NUMERIC_VECTOR
    - Q051_B_NON_NUMERIC_VECTOR
    - Q051_C_NON_NUMERIC_VECTOR
    - Q051_D_NON_NUMERIC_VECTOR
    - Q051_E_NON_NUMERIC_VECTOR
    - Q052_A_NON_NUMERIC_VECTOR
    - Q052_B_NON_NUMERIC_VECTOR
    - Q052_C_NON_NUMERIC_VECTOR
    - Q052_D_NON_NUMERIC_VECTOR
    - Q052_E_NON_NUMERIC_VECTOR
    - Q053_B_NON_NUMERIC_VECTOR
    - Q053_D_NON_NUMERIC_VECTOR
    - Q054_E_NON_NUMERIC_VECTOR
    - Q055_A_NON_NUMERIC_VECTOR
    - Q055_C_NON_NUMERIC_VECTOR
    - Q055_E_NON_NUMERIC_VECTOR
    - Q056_C_NON_NUMERIC_VECTOR
    - Q056_D_NON_NUMERIC_VECTOR
    - Q056_E_NON_NUMERIC_VECTOR
    - Q057_A_NON_NUMERIC_VECTOR
    - Q057_B_NON_NUMERIC_VECTOR
    - Q057_C_NON_NUMERIC_VECTOR
    - Q057_D_NON_NUMERIC_VECTOR
    - Q057_E_NON_NUMERIC_VECTOR
    - Q058_A_NON_NUMERIC_VECTOR
    - Q058_B_NON_NUMERIC_VECTOR
    - Q058_C_NON_NUMERIC_VECTOR
    - Q058_D_NON_NUMERIC_VECTOR
    - Q058_E_NON_NUMERIC_VECTOR
    - Q059_A_NON_NUMERIC_VECTOR
    - Q059_C_NON_NUMERIC_VECTOR
    - Q059_D_NON_NUMERIC_VECTOR
    - Q060_A_NON_NUMERIC_VECTOR
    - Q060_B_NON_NUMERIC_VECTOR
    - Q061_C_NON_NUMERIC_VECTOR
    - Q061_E_NON_NUMERIC_VECTOR
    - Q062_D_NON_NUMERIC_VECTOR
    - Q062_E_NON_NUMERIC_VECTOR
    - Q063_A_NON_NUMERIC_VECTOR
    - Q063_B_NON_NUMERIC_VECTOR
    - Q063_C_NON_NUMERIC_VECTOR
    - Q063_E_NON_NUMERIC_VECTOR
    - Q064_B_NON_NUMERIC_VECTOR
    - Q064_E_NON_NUMERIC_VECTOR
    - Q065_A_NON_NUMERIC_VECTOR
    - Q065_B_NON_NUMERIC_VECTOR
    - Q065_C_NON_NUMERIC_VECTOR
    - Q065_D_NON_NUMERIC_VECTOR
    - Q065_E_NON_NUMERIC_VECTOR
    - Q067_E_NON_NUMERIC_VECTOR
    - Q068_B_NON_NUMERIC_VECTOR
    - Q068_C_NON_NUMERIC_VECTOR
    - Q069_A_NON_NUMERIC_VECTOR
    - Q069_D_NON_NUMERIC_VECTOR
    - Q070_B_NON_NUMERIC_VECTOR
    - Q070_D_NON_NUMERIC_VECTOR
    - Q071_A_NON_NUMERIC_VECTOR
    - Q071_B_NON_NUMERIC_VECTOR
    - Q071_C_NON_NUMERIC_VECTOR
    - Q071_E_NON_NUMERIC_VECTOR
    - Q072_A_NON_NUMERIC_VECTOR
    - Q072_C_NON_NUMERIC_VECTOR
    - Q073_B_NON_NUMERIC_VECTOR
    - Q073_D_NON_NUMERIC_VECTOR
    - Q073_E_NON_NUMERIC_VECTOR
    - Q074_A_NON_NUMERIC_VECTOR
    - Q074_B_NON_NUMERIC_VECTOR
    - Q074_E_NON_NUMERIC_VECTOR
    - Q075_A_NON_NUMERIC_VECTOR
    - Q075_B_NON_NUMERIC_VECTOR
    - Q075_D_NON_NUMERIC_VECTOR
    - Q075_E_NON_NUMERIC_VECTOR
    - Q077_A_NON_NUMERIC_VECTOR
    - Q078_B_NON_NUMERIC_VECTOR
    - Q078_E_NON_NUMERIC_VECTOR
    - Q080_C_NON_NUMERIC_VECTOR
  - reply/contact/distance-sensitive vectors:
    - Q043_C_NON_NUMERIC_VECTOR
    - Q049_B_NON_NUMERIC_VECTOR
    - Q050_C_NON_NUMERIC_VECTOR
    - Q053_D_NON_NUMERIC_VECTOR
    - Q055_A_NON_NUMERIC_VECTOR
    - Q056_D_NON_NUMERIC_VECTOR
    - Q057_C_NON_NUMERIC_VECTOR
    - Q058_C_NON_NUMERIC_VECTOR
    - Q060_B_NON_NUMERIC_VECTOR
    - Q061_A_NON_NUMERIC_VECTOR
    - Q061_B_NON_NUMERIC_VECTOR
    - Q061_C_NON_NUMERIC_VECTOR
    - Q061_D_NON_NUMERIC_VECTOR
    - Q061_E_NON_NUMERIC_VECTOR
    - Q062_A_NON_NUMERIC_VECTOR
    - Q062_B_NON_NUMERIC_VECTOR
    - Q062_C_NON_NUMERIC_VECTOR
    - Q062_D_NON_NUMERIC_VECTOR
    - Q062_E_NON_NUMERIC_VECTOR
    - Q063_A_NON_NUMERIC_VECTOR
    - Q063_C_NON_NUMERIC_VECTOR
    - Q064_C_NON_NUMERIC_VECTOR
    - Q065_A_NON_NUMERIC_VECTOR
    - Q065_C_NON_NUMERIC_VECTOR
    - Q065_D_NON_NUMERIC_VECTOR
    - Q067_E_NON_NUMERIC_VECTOR
    - Q069_A_NON_NUMERIC_VECTOR
    - Q070_D_NON_NUMERIC_VECTOR
    - Q071_A_NON_NUMERIC_VECTOR
    - Q071_B_NON_NUMERIC_VECTOR
    - Q071_C_NON_NUMERIC_VECTOR
    - Q071_D_NON_NUMERIC_VECTOR
    - Q071_E_NON_NUMERIC_VECTOR
    - Q072_A_NON_NUMERIC_VECTOR
    - Q072_B_NON_NUMERIC_VECTOR
    - Q072_C_NON_NUMERIC_VECTOR
    - Q072_E_NON_NUMERIC_VECTOR
    - Q073_A_NON_NUMERIC_VECTOR
    - Q073_B_NON_NUMERIC_VECTOR
    - Q073_C_NON_NUMERIC_VECTOR
    - Q073_D_NON_NUMERIC_VECTOR
    - Q074_A_NON_NUMERIC_VECTOR
    - Q074_E_NON_NUMERIC_VECTOR
    - Q075_A_NON_NUMERIC_VECTOR
    - Q075_B_NON_NUMERIC_VECTOR
    - Q075_D_NON_NUMERIC_VECTOR
    - Q077_A_NON_NUMERIC_VECTOR
    - Q078_B_NON_NUMERIC_VECTOR
  - social_load_residue vectors:
    - Q046_C_NON_NUMERIC_VECTOR
    - Q048_A_NON_NUMERIC_VECTOR
    - Q052_C_NON_NUMERIC_VECTOR
    - Q058_C_NON_NUMERIC_VECTOR
    - Q060_B_NON_NUMERIC_VECTOR
    - Q070_B_NON_NUMERIC_VECTOR
  - distance_after_friction vectors:
    - Q071_D_NON_NUMERIC_VECTOR
    - Q072_E_NON_NUMERIC_VECTOR
    - Q073_A_NON_NUMERIC_VECTOR
  - recovery_margin_need broad-tag vectors:
    - Q042_A_NON_NUMERIC_VECTOR
    - Q042_B_NON_NUMERIC_VECTOR
    - Q042_C_NON_NUMERIC_VECTOR
    - Q042_D_NON_NUMERIC_VECTOR
    - Q042_E_NON_NUMERIC_VECTOR
    - Q047_A_NON_NUMERIC_VECTOR
    - Q049_E_NON_NUMERIC_VECTOR
    - Q054_B_NON_NUMERIC_VECTOR
    - Q055_E_NON_NUMERIC_VECTOR
    - Q057_B_NON_NUMERIC_VECTOR
    - Q061_E_NON_NUMERIC_VECTOR
    - Q062_A_NON_NUMERIC_VECTOR
    - Q062_B_NON_NUMERIC_VECTOR
    - Q062_C_NON_NUMERIC_VECTOR
    - Q062_D_NON_NUMERIC_VECTOR
    - Q062_E_NON_NUMERIC_VECTOR
    - Q065_E_NON_NUMERIC_VECTOR
    - Q067_A_NON_NUMERIC_VECTOR
    - Q067_B_NON_NUMERIC_VECTOR
    - Q067_C_NON_NUMERIC_VECTOR
    - Q067_D_NON_NUMERIC_VECTOR
    - Q067_E_NON_NUMERIC_VECTOR
    - Q072_A_NON_NUMERIC_VECTOR
    - Q072_B_NON_NUMERIC_VECTOR
    - Q072_C_NON_NUMERIC_VECTOR
    - Q072_D_NON_NUMERIC_VECTOR
    - Q072_E_NON_NUMERIC_VECTOR
    - Q073_B_NON_NUMERIC_VECTOR
    - Q073_E_NON_NUMERIC_VECTOR
    - Q075_A_NON_NUMERIC_VECTOR
    - Q077_A_NON_NUMERIC_VECTOR
    - Q077_B_NON_NUMERIC_VECTOR
    - Q077_C_NON_NUMERIC_VECTOR
    - Q077_D_NON_NUMERIC_VECTOR
    - Q077_E_NON_NUMERIC_VECTOR
  - social_modulation broad-tag vectors:
    - Q041_D_NON_NUMERIC_VECTOR
    - Q043_A_NON_NUMERIC_VECTOR
    - Q043_B_NON_NUMERIC_VECTOR
    - Q043_C_NON_NUMERIC_VECTOR
    - Q043_D_NON_NUMERIC_VECTOR
    - Q043_E_NON_NUMERIC_VECTOR
    - Q044_D_NON_NUMERIC_VECTOR
    - Q045_A_NON_NUMERIC_VECTOR
    - Q045_B_NON_NUMERIC_VECTOR
    - Q045_D_NON_NUMERIC_VECTOR
    - Q046_C_NON_NUMERIC_VECTOR
    - Q048_A_NON_NUMERIC_VECTOR
    - Q048_B_NON_NUMERIC_VECTOR
    - Q048_C_NON_NUMERIC_VECTOR
    - Q048_D_NON_NUMERIC_VECTOR
    - Q048_E_NON_NUMERIC_VECTOR
    - Q049_B_NON_NUMERIC_VECTOR
    - Q049_D_NON_NUMERIC_VECTOR
    - Q050_C_NON_NUMERIC_VECTOR
    - Q051_A_NON_NUMERIC_VECTOR
    - Q051_B_NON_NUMERIC_VECTOR
    - Q051_C_NON_NUMERIC_VECTOR
    - Q052_A_NON_NUMERIC_VECTOR
    - Q052_C_NON_NUMERIC_VECTOR
    - Q053_A_NON_NUMERIC_VECTOR
    - Q053_B_NON_NUMERIC_VECTOR
    - Q053_C_NON_NUMERIC_VECTOR
    - Q053_D_NON_NUMERIC_VECTOR
    - Q053_E_NON_NUMERIC_VECTOR
    - Q054_C_NON_NUMERIC_VECTOR
    - Q054_D_NON_NUMERIC_VECTOR
    - Q055_B_NON_NUMERIC_VECTOR
    - Q056_D_NON_NUMERIC_VECTOR
    - Q057_C_NON_NUMERIC_VECTOR
    - Q058_A_NON_NUMERIC_VECTOR
    - Q058_B_NON_NUMERIC_VECTOR
    - Q058_C_NON_NUMERIC_VECTOR
    - Q058_D_NON_NUMERIC_VECTOR
    - Q058_E_NON_NUMERIC_VECTOR
    - Q059_D_NON_NUMERIC_VECTOR
    - Q060_B_NON_NUMERIC_VECTOR
    - Q061_C_NON_NUMERIC_VECTOR
    - Q062_D_NON_NUMERIC_VECTOR
    - Q063_A_NON_NUMERIC_VECTOR
    - Q063_B_NON_NUMERIC_VECTOR
    - Q063_C_NON_NUMERIC_VECTOR
    - Q063_D_NON_NUMERIC_VECTOR
    - Q063_E_NON_NUMERIC_VECTOR
    - Q064_D_NON_NUMERIC_VECTOR
    - Q065_A_NON_NUMERIC_VECTOR
    - Q065_C_NON_NUMERIC_VECTOR
    - Q066_B_NON_NUMERIC_VECTOR
    - Q066_E_NON_NUMERIC_VECTOR
    - Q067_B_NON_NUMERIC_VECTOR
    - Q067_C_NON_NUMERIC_VECTOR
    - Q068_A_NON_NUMERIC_VECTOR
    - Q068_B_NON_NUMERIC_VECTOR
    - Q068_C_NON_NUMERIC_VECTOR
    - Q068_D_NON_NUMERIC_VECTOR
    - Q068_E_NON_NUMERIC_VECTOR
    - Q069_A_NON_NUMERIC_VECTOR
    - Q069_D_NON_NUMERIC_VECTOR
    - Q070_A_NON_NUMERIC_VECTOR
    - Q070_B_NON_NUMERIC_VECTOR
    - Q070_C_NON_NUMERIC_VECTOR
    - Q070_D_NON_NUMERIC_VECTOR
    - Q071_C_NON_NUMERIC_VECTOR
    - Q071_D_NON_NUMERIC_VECTOR
    - Q072_A_NON_NUMERIC_VECTOR
    - Q072_B_NON_NUMERIC_VECTOR
    - Q072_C_NON_NUMERIC_VECTOR
    - Q073_A_NON_NUMERIC_VECTOR
    - Q073_B_NON_NUMERIC_VECTOR
    - Q073_C_NON_NUMERIC_VECTOR
    - Q073_D_NON_NUMERIC_VECTOR
    - Q073_E_NON_NUMERIC_VECTOR
    - Q074_D_NON_NUMERIC_VECTOR
    - Q075_B_NON_NUMERIC_VECTOR
    - Q075_C_NON_NUMERIC_VECTOR
    - Q076_A_NON_NUMERIC_VECTOR
    - Q076_D_NON_NUMERIC_VECTOR
    - Q077_A_NON_NUMERIC_VECTOR
    - Q077_D_NON_NUMERIC_VECTOR
    - Q078_A_NON_NUMERIC_VECTOR
    - Q078_B_NON_NUMERIC_VECTOR
    - Q078_C_NON_NUMERIC_VECTOR
    - Q078_D_NON_NUMERIC_VECTOR
    - Q078_E_NON_NUMERIC_VECTOR
    - Q079_B_NON_NUMERIC_VECTOR
    - Q079_D_NON_NUMERIC_VECTOR
    - Q080_B_NON_NUMERIC_VECTOR
    - Q080_D_NON_NUMERIC_VECTOR
  - returnable_distance broad-tag vectors:
    - Q043_C_NON_NUMERIC_VECTOR
    - Q049_B_NON_NUMERIC_VECTOR
    - Q050_C_NON_NUMERIC_VECTOR
    - Q053_D_NON_NUMERIC_VECTOR
    - Q056_D_NON_NUMERIC_VECTOR
    - Q061_C_NON_NUMERIC_VECTOR
    - Q063_C_NON_NUMERIC_VECTOR
    - Q065_C_NON_NUMERIC_VECTOR
    - Q067_E_NON_NUMERIC_VECTOR
    - Q069_A_NON_NUMERIC_VECTOR
    - Q070_D_NON_NUMERIC_VECTOR
    - Q071_A_NON_NUMERIC_VECTOR
    - Q071_B_NON_NUMERIC_VECTOR
    - Q071_C_NON_NUMERIC_VECTOR
    - Q071_D_NON_NUMERIC_VECTOR
    - Q071_E_NON_NUMERIC_VECTOR
    - Q072_A_NON_NUMERIC_VECTOR
    - Q072_C_NON_NUMERIC_VECTOR
    - Q072_E_NON_NUMERIC_VECTOR
    - Q073_A_NON_NUMERIC_VECTOR
    - Q073_B_NON_NUMERIC_VECTOR
    - Q073_C_NON_NUMERIC_VECTOR
    - Q073_D_NON_NUMERIC_VECTOR
    - Q074_E_NON_NUMERIC_VECTOR
    - Q075_B_NON_NUMERIC_VECTOR
    - Q075_D_NON_NUMERIC_VECTOR
    - Q077_A_NON_NUMERIC_VECTOR
    - Q078_B_NON_NUMERIC_VECTOR
  - cross-family primary exceptions:
    - Q041_C_NON_NUMERIC_VECTOR
    - Q041_E_NON_NUMERIC_VECTOR
    - Q042_A_NON_NUMERIC_VECTOR
    - Q042_C_NON_NUMERIC_VECTOR
    - Q043_B_NON_NUMERIC_VECTOR
    - Q043_C_NON_NUMERIC_VECTOR
    - Q043_D_NON_NUMERIC_VECTOR
    - Q043_E_NON_NUMERIC_VECTOR
    - Q044_A_NON_NUMERIC_VECTOR
    - Q044_C_NON_NUMERIC_VECTOR
    - Q044_D_NON_NUMERIC_VECTOR
    - Q045_B_NON_NUMERIC_VECTOR
    - Q046_E_NON_NUMERIC_VECTOR
    - Q047_A_NON_NUMERIC_VECTOR
    - Q047_B_NON_NUMERIC_VECTOR
    - Q047_D_NON_NUMERIC_VECTOR
    - Q047_E_NON_NUMERIC_VECTOR
    - Q048_B_NON_NUMERIC_VECTOR
    - Q048_D_NON_NUMERIC_VECTOR
    - Q049_B_NON_NUMERIC_VECTOR
    - Q049_C_NON_NUMERIC_VECTOR
    - Q049_E_NON_NUMERIC_VECTOR
    - Q050_B_NON_NUMERIC_VECTOR
    - Q050_C_NON_NUMERIC_VECTOR
    - Q050_E_NON_NUMERIC_VECTOR
    - Q051_B_NON_NUMERIC_VECTOR
    - Q051_C_NON_NUMERIC_VECTOR
    - Q051_E_NON_NUMERIC_VECTOR
    - Q052_A_NON_NUMERIC_VECTOR
    - Q052_D_NON_NUMERIC_VECTOR
    - Q053_A_NON_NUMERIC_VECTOR
    - Q053_C_NON_NUMERIC_VECTOR
    - Q053_E_NON_NUMERIC_VECTOR
    - Q054_A_NON_NUMERIC_VECTOR
    - Q054_B_NON_NUMERIC_VECTOR
    - Q054_C_NON_NUMERIC_VECTOR
    - Q054_D_NON_NUMERIC_VECTOR
    - Q054_E_NON_NUMERIC_VECTOR
    - Q055_A_NON_NUMERIC_VECTOR
    - Q055_B_NON_NUMERIC_VECTOR
    - Q055_D_NON_NUMERIC_VECTOR
    - Q055_E_NON_NUMERIC_VECTOR
    - Q056_A_NON_NUMERIC_VECTOR
    - Q056_B_NON_NUMERIC_VECTOR
    - Q056_D_NON_NUMERIC_VECTOR
    - Q057_B_NON_NUMERIC_VECTOR
    - Q057_C_NON_NUMERIC_VECTOR
    - Q057_D_NON_NUMERIC_VECTOR
    - Q057_E_NON_NUMERIC_VECTOR
    - Q058_D_NON_NUMERIC_VECTOR
    - Q058_E_NON_NUMERIC_VECTOR
    - Q059_B_NON_NUMERIC_VECTOR
    - Q059_D_NON_NUMERIC_VECTOR
    - Q059_E_NON_NUMERIC_VECTOR
    - Q060_C_NON_NUMERIC_VECTOR
    - Q060_D_NON_NUMERIC_VECTOR
    - Q060_E_NON_NUMERIC_VECTOR
    - Q061_B_NON_NUMERIC_VECTOR
    - Q061_E_NON_NUMERIC_VECTOR
    - Q062_B_NON_NUMERIC_VECTOR
    - Q062_C_NON_NUMERIC_VECTOR
    - Q062_E_NON_NUMERIC_VECTOR
    - Q063_B_NON_NUMERIC_VECTOR
    - Q063_D_NON_NUMERIC_VECTOR
    - Q063_E_NON_NUMERIC_VECTOR
    - Q064_A_NON_NUMERIC_VECTOR
    - Q064_B_NON_NUMERIC_VECTOR
    - Q064_C_NON_NUMERIC_VECTOR
    - Q064_D_NON_NUMERIC_VECTOR
    - Q064_E_NON_NUMERIC_VECTOR
    - Q065_B_NON_NUMERIC_VECTOR
    - Q065_D_NON_NUMERIC_VECTOR
    - Q065_E_NON_NUMERIC_VECTOR
    - Q066_C_NON_NUMERIC_VECTOR
    - Q066_D_NON_NUMERIC_VECTOR
    - Q066_E_NON_NUMERIC_VECTOR
    - Q067_A_NON_NUMERIC_VECTOR
    - Q067_D_NON_NUMERIC_VECTOR
    - Q068_D_NON_NUMERIC_VECTOR
    - Q068_E_NON_NUMERIC_VECTOR
    - Q069_A_NON_NUMERIC_VECTOR
    - Q069_B_NON_NUMERIC_VECTOR
    - Q069_C_NON_NUMERIC_VECTOR
    - Q069_D_NON_NUMERIC_VECTOR
    - Q069_E_NON_NUMERIC_VECTOR
    - Q070_B_NON_NUMERIC_VECTOR
    - Q070_E_NON_NUMERIC_VECTOR
    - Q071_B_NON_NUMERIC_VECTOR
    - Q071_E_NON_NUMERIC_VECTOR
    - Q072_C_NON_NUMERIC_VECTOR
    - Q072_D_NON_NUMERIC_VECTOR
    - Q073_B_NON_NUMERIC_VECTOR
    - Q073_C_NON_NUMERIC_VECTOR
    - Q073_D_NON_NUMERIC_VECTOR
    - Q073_E_NON_NUMERIC_VECTOR
    - Q074_B_NON_NUMERIC_VECTOR
    - Q074_C_NON_NUMERIC_VECTOR
    - Q074_E_NON_NUMERIC_VECTOR
    - Q075_A_NON_NUMERIC_VECTOR
    - Q075_B_NON_NUMERIC_VECTOR
    - Q075_C_NON_NUMERIC_VECTOR
    - Q075_E_NON_NUMERIC_VECTOR
    - Q076_E_NON_NUMERIC_VECTOR
    - Q077_B_NON_NUMERIC_VECTOR
    - Q078_D_NON_NUMERIC_VECTOR
    - Q078_E_NON_NUMERIC_VECTOR
    - Q079_A_NON_NUMERIC_VECTOR
    - Q079_C_NON_NUMERIC_VECTOR
    - Q079_D_NON_NUMERIC_VECTOR
    - Q080_A_NON_NUMERIC_VECTOR
    - Q080_B_NON_NUMERIC_VECTOR
    - Q080_C_NON_NUMERIC_VECTOR
    - Q080_D_NON_NUMERIC_VECTOR
    - Q080_E_NON_NUMERIC_VECTOR
  - broad-tag dominance candidates:
    - Q041_D_NON_NUMERIC_VECTOR: social_modulation
    - Q042_A_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness, recovery_margin_need
    - Q042_B_NON_NUMERIC_VECTOR: later_review, recovery_margin_need
    - Q042_C_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q042_D_NON_NUMERIC_VECTOR: boundary_awareness, later_review, recovery_margin_need
    - Q042_E_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q043_A_NON_NUMERIC_VECTOR: social_modulation
    - Q043_B_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation
    - Q043_C_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q043_D_NON_NUMERIC_VECTOR: social_modulation
    - Q043_E_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation
    - Q044_D_NON_NUMERIC_VECTOR: partial_reasoning, social_modulation
    - Q045_A_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q045_B_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q045_C_NON_NUMERIC_VECTOR: later_review
    - Q045_D_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q045_E_NON_NUMERIC_VECTOR: later_review
    - Q046_C_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q046_D_NON_NUMERIC_VECTOR: quiet_reset_need
    - Q046_E_NON_NUMERIC_VECTOR: later_review
    - Q047_A_NON_NUMERIC_VECTOR: recovery_margin_need, boundary_awareness
    - Q047_C_NON_NUMERIC_VECTOR: post_event_residue
    - Q048_A_NON_NUMERIC_VECTOR: social_modulation
    - Q048_B_NON_NUMERIC_VECTOR: later_review, social_modulation
    - Q048_C_NON_NUMERIC_VECTOR: social_modulation
    - Q048_D_NON_NUMERIC_VECTOR: boundary_awareness, later_review, social_modulation
    - Q048_E_NON_NUMERIC_VECTOR: post_event_residue, social_modulation, later_review
    - Q049_B_NON_NUMERIC_VECTOR: returnable_distance, social_modulation
    - Q049_C_NON_NUMERIC_VECTOR: boundary_awareness
    - Q049_D_NON_NUMERIC_VECTOR: social_modulation
    - Q049_E_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q050_A_NON_NUMERIC_VECTOR: quiet_reset_need, later_review
    - Q050_B_NON_NUMERIC_VECTOR: state_notice, later_review
    - Q050_C_NON_NUMERIC_VECTOR: returnable_distance, social_modulation, later_review
    - Q050_D_NON_NUMERIC_VECTOR: later_review
    - Q050_E_NON_NUMERIC_VECTOR: later_review
    - Q051_A_NON_NUMERIC_VECTOR: social_modulation
    - Q051_B_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation
    - Q051_C_NON_NUMERIC_VECTOR: social_modulation
    - Q051_D_NON_NUMERIC_VECTOR: post_event_residue
    - Q051_E_NON_NUMERIC_VECTOR: later_review
    - Q052_A_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation, quiet_reset_need
    - Q052_C_NON_NUMERIC_VECTOR: social_modulation
    - Q052_E_NON_NUMERIC_VECTOR: post_event_residue, later_review
    - Q053_A_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation
    - Q053_B_NON_NUMERIC_VECTOR: social_modulation
    - Q053_C_NON_NUMERIC_VECTOR: social_modulation
    - Q053_D_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance, later_review
    - Q053_E_NON_NUMERIC_VECTOR: later_review, social_modulation
    - Q054_B_NON_NUMERIC_VECTOR: recovery_margin_need, boundary_awareness
    - Q054_C_NON_NUMERIC_VECTOR: social_modulation
    - Q054_D_NON_NUMERIC_VECTOR: social_modulation
    - Q054_E_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness
    - Q055_A_NON_NUMERIC_VECTOR: later_review
    - Q055_B_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation, later_review
    - Q055_C_NON_NUMERIC_VECTOR: later_review
    - Q055_D_NON_NUMERIC_VECTOR: later_review
    - Q055_E_NON_NUMERIC_VECTOR: recovery_margin_need, quiet_reset_need, later_review
    - Q056_C_NON_NUMERIC_VECTOR: post_event_residue, later_review
    - Q056_D_NON_NUMERIC_VECTOR: social_modulation, returnable_distance, post_event_residue
    - Q056_E_NON_NUMERIC_VECTOR: post_event_residue
    - Q057_A_NON_NUMERIC_VECTOR: post_event_residue
    - Q057_B_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q057_C_NON_NUMERIC_VECTOR: later_review, social_modulation
    - Q058_A_NON_NUMERIC_VECTOR: social_modulation
    - Q058_B_NON_NUMERIC_VECTOR: post_event_residue, social_modulation
    - Q058_C_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q058_D_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation, post_event_residue
    - Q058_E_NON_NUMERIC_VECTOR: post_event_residue, social_modulation
    - Q059_C_NON_NUMERIC_VECTOR: quiet_reset_need
    - Q059_D_NON_NUMERIC_VECTOR: social_modulation
    - Q059_E_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness
    - Q060_A_NON_NUMERIC_VECTOR: later_review
    - Q060_B_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q060_C_NON_NUMERIC_VECTOR: later_review
    - Q060_D_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness, later_review
    - Q060_E_NON_NUMERIC_VECTOR: later_review
    - Q061_C_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q061_E_NON_NUMERIC_VECTOR: recovery_margin_need, quiet_reset_need
    - Q062_A_NON_NUMERIC_VECTOR: boundary_awareness, recovery_margin_need
    - Q062_B_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q062_C_NON_NUMERIC_VECTOR: boundary_awareness, recovery_margin_need
    - Q062_D_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q062_E_NON_NUMERIC_VECTOR: quiet_reset_need, recovery_margin_need
    - Q063_A_NON_NUMERIC_VECTOR: social_modulation
    - Q063_B_NON_NUMERIC_VECTOR: social_modulation
    - Q063_C_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q063_D_NON_NUMERIC_VECTOR: social_modulation
    - Q063_E_NON_NUMERIC_VECTOR: social_modulation
    - Q064_B_NON_NUMERIC_VECTOR: partial_reasoning
    - Q064_C_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness
    - Q064_D_NON_NUMERIC_VECTOR: social_modulation
    - Q065_A_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q065_B_NON_NUMERIC_VECTOR: later_review
    - Q065_C_NON_NUMERIC_VECTOR: returnable_distance, social_modulation, later_review
    - Q065_D_NON_NUMERIC_VECTOR: post_event_residue, later_review
    - Q065_E_NON_NUMERIC_VECTOR: recovery_margin_need, quiet_reset_need, later_review
    - Q066_A_NON_NUMERIC_VECTOR: atmosphere_reading
    - Q066_B_NON_NUMERIC_VECTOR: social_modulation
    - Q066_C_NON_NUMERIC_VECTOR: boundary_awareness
    - Q066_D_NON_NUMERIC_VECTOR: later_review
    - Q066_E_NON_NUMERIC_VECTOR: schedule_reframe, social_modulation, boundary_awareness
    - Q067_A_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q067_B_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation, recovery_margin_need
    - Q067_C_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q067_D_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness, recovery_margin_need
    - Q067_E_NON_NUMERIC_VECTOR: returnable_distance, recovery_margin_need
    - Q068_A_NON_NUMERIC_VECTOR: social_modulation
    - Q068_B_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation, quiet_reset_need
    - Q068_C_NON_NUMERIC_VECTOR: social_modulation, quiet_reset_need
    - Q068_D_NON_NUMERIC_VECTOR: scope_expansion, later_review, social_modulation
    - Q068_E_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation
    - Q069_A_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance
    - Q069_B_NON_NUMERIC_VECTOR: schedule_reframe
    - Q069_C_NON_NUMERIC_VECTOR: state_notice
    - Q069_D_NON_NUMERIC_VECTOR: social_modulation
    - Q069_E_NON_NUMERIC_VECTOR: boundary_awareness
    - Q070_A_NON_NUMERIC_VECTOR: atmosphere_reading, social_modulation, later_review
    - Q070_B_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q070_C_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q070_D_NON_NUMERIC_VECTOR: returnable_distance, social_modulation, later_review
    - Q070_E_NON_NUMERIC_VECTOR: boundary_awareness, later_review
    - Q071_A_NON_NUMERIC_VECTOR: returnable_distance
    - Q071_B_NON_NUMERIC_VECTOR: quiet_reset_need, returnable_distance
    - Q071_C_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q071_D_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q071_E_NON_NUMERIC_VECTOR: boundary_awareness, returnable_distance, later_review
    - Q072_A_NON_NUMERIC_VECTOR: social_modulation, returnable_distance, recovery_margin_need
    - Q072_B_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q072_C_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance, recovery_margin_need
    - Q072_D_NON_NUMERIC_VECTOR: state_notice, recovery_margin_need
    - Q072_E_NON_NUMERIC_VECTOR: returnable_distance, recovery_margin_need
    - Q073_A_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q073_B_NON_NUMERIC_VECTOR: recovery_margin_need, social_modulation, returnable_distance
    - Q073_C_NON_NUMERIC_VECTOR: social_modulation, returnable_distance, boundary_awareness
    - Q073_D_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation, returnable_distance
    - Q073_E_NON_NUMERIC_VECTOR: recovery_margin_need, quiet_reset_need, social_modulation
    - Q074_C_NON_NUMERIC_VECTOR: boundary_awareness
    - Q074_D_NON_NUMERIC_VECTOR: social_modulation
    - Q074_E_NON_NUMERIC_VECTOR: state_notice, returnable_distance
    - Q075_A_NON_NUMERIC_VECTOR: recovery_margin_need, quiet_reset_need, later_review
    - Q075_B_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance, later_review
    - Q075_C_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation, later_review
    - Q075_D_NON_NUMERIC_VECTOR: returnable_distance, later_review
    - Q075_E_NON_NUMERIC_VECTOR: quiet_reset_need, later_review
    - Q076_A_NON_NUMERIC_VECTOR: social_modulation
    - Q076_C_NON_NUMERIC_VECTOR: quiet_reset_need
    - Q076_D_NON_NUMERIC_VECTOR: social_modulation
    - Q077_A_NON_NUMERIC_VECTOR: social_modulation, returnable_distance, quiet_reset_need, recovery_margin_need
    - Q077_B_NON_NUMERIC_VECTOR: schedule_reframe, boundary_awareness, recovery_margin_need
    - Q077_C_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q077_D_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q077_E_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q078_A_NON_NUMERIC_VECTOR: social_modulation, quiet_reset_need
    - Q078_B_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q078_C_NON_NUMERIC_VECTOR: social_modulation
    - Q078_D_NON_NUMERIC_VECTOR: social_modulation, quiet_reset_need
    - Q078_E_NON_NUMERIC_VECTOR: post_event_residue, social_modulation, quiet_reset_need, later_review
    - Q079_A_NON_NUMERIC_VECTOR: schedule_reframe
    - Q079_B_NON_NUMERIC_VECTOR: social_modulation
    - Q079_C_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness
    - Q079_D_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation
    - Q080_A_NON_NUMERIC_VECTOR: later_review
    - Q080_B_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation, later_review
    - Q080_C_NON_NUMERIC_VECTOR: post_event_residue, later_review
    - Q080_D_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q080_E_NON_NUMERIC_VECTOR: later_review
  - pattern_naming risks: none
  - feedback_filtering risks: none
  - unknown signal tags: none
  - missing required fields: none
  - visibility escalation conflicts: none

Final decision:
- approve Batch B non-numeric option vector application draft: YES_FOR_REVIEW
- approve Batch C application: NO
- approve full 120Q application: NO
- approve numeric score assignment: NO
- approve scoring formula: NO
- approve implementation: NO
- approve result taxonomy: NO
- approve result copy: NO
- approve report copy: NO
- approve launch: NO
- next authorized task: Batch B non-numeric option vector application review and refinement
