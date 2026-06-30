YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_BATCH_C_Q081_Q120_V0_1

Executive status:
- source protocol: YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_PROTOCOL_V0_1
- source mapping rules: YORISOU_NON_NUMERIC_AXIS_MAPPING_RULES_FOR_SIGNAL_TAGS_V0_1
- source framework: YORISOU_SCOREVECTOR_FRAMEWORK_DESIGN_V0_1
- source signal batch: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_C_Q081_Q120_V0_1
- batch scope: Q081–Q120 only
- application status: DRAFT_READY_FOR_REVIEW
- numeric score assignment: NOT APPROVED
- scoring formula: NOT APPROVED
- implementation readiness: NOT APPROVED
- result taxonomy readiness: NOT_STARTED
- launch readiness: NOT_APPROVED
- authorized next step: Batch C non-numeric option vector application review and refinement
- prohibited next steps: full 120Q application, numeric scoring, formulas, code, result taxonomy, result names, result copy, report copy, launch approval

Batch packaging:
- batchId: BATCH_C_Q081_Q120_NON_NUMERIC_OPTION_VECTOR_APPLICATION_V0_1
- sourceBatch: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_C_Q081_Q120_V0_1
- questionsCovered: Q081–Q120
- optionsCovered: 200 / 200
- applicationScope: Batch C only; Q081–Q120 only; non-numeric option vectors only
- applicationStatus: non_numeric_option_vector_application_draft_ready_for_review
- protocolVersion: YORISOU_NON_NUMERIC_OPTION_VECTOR_APPLICATION_PROTOCOL_V0_1
- mappingRulesVersion: YORISOU_NON_NUMERIC_AXIS_MAPPING_RULES_FOR_SIGNAL_TAGS_V0_1
- frameworkVersion: YORISOU_SCOREVECTOR_FRAMEWORK_DESIGN_V0_1
- sourceSignalBatchVersion: YORISOU_OPTION_LEVEL_SCORING_SIGNAL_DESIGN_BATCH_C_Q081_Q120_V0_1

Batch pre-check:
- all Q081–Q120 present: YES
- all 200 options present: YES
- all signal tags approved: YES
- no numeric fields created: YES
- no formulas created: YES
- no code created: YES
- no public-facing copy generated: YES
- no result taxonomy generated: YES
- no full 120Q processed: YES

Option vectors:

Q081:
  A:
    optionVectorId: Q081_A_NON_NUMERIC_VECTOR
    questionId: Q081
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: core_behavior
    optionId: A
    sourceOptionText: 短い一人時間があると入り直しやすい
    primarySignal: reset_by_quiet
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_quiet nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_quiet remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q081_B_NON_NUMERIC_VECTOR
    questionId: Q081
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: core_behavior
    optionId: B
    sourceOptionText: 小さな用事を終えると区切りがつく
    primarySignal: reset_by_task
    secondarySignals: [boundary_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  C:
    optionVectorId: Q081_C_NON_NUMERIC_VECTOR
    questionId: Q081
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: core_behavior
    optionId: C
    sourceOptionText: 誰かと軽く話すと流れが変わる
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, recovery_margin_need, load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q081_D_NON_NUMERIC_VECTOR
    questionId: Q081
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: core_behavior
    optionId: D
    sourceOptionText: 場所を変えると次に移りやすい
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
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_place remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q081_E_NON_NUMERIC_VECTOR
    questionId: Q081
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: core_behavior
    optionId: E
    sourceOptionText: 予定を少し軽くすると動きやすい
    primarySignal: schedule_reframe
    secondarySignals: [recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q082:
  A:
    optionVectorId: Q082_A_NON_NUMERIC_VECTOR
    questionId: Q082
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 何もしない短い間
    primarySignal: quiet_reset_need
    secondarySignals: [recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent emotional_load conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q082_B_NON_NUMERIC_VECTOR
    questionId: Q082
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 次の予定までのゆるい余白
    primarySignal: recovery_margin_need
    secondarySignals: [schedule_reframe]
    primarySignalRole: native primary driver
    secondarySignalRoles: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, schedule_reframe
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q082_C_NON_NUMERIC_VECTOR
    questionId: Q082
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: ひとつだけ終えた感じ
    primarySignal: reset_by_task
    secondarySignals: [state_notice, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q082_D_NON_NUMERIC_VECTOR
    questionId: Q082
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 人の声が少ない場所
    primarySignal: reset_by_quiet
    secondarySignals: [social_modulation, reset_by_place, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: native auxiliary modifier; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_quiet nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_quiet remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q082_E_NON_NUMERIC_VECTOR
    questionId: Q082
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 先の予定を見直す時間
    primarySignal: schedule_reframe
    secondarySignals: [later_review, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent rhythm_daily_flow conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, later_review, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied

Q083:
  A:
    optionVectorId: Q083_A_NON_NUMERIC_VECTOR
    questionId: Q083
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: social_contextual
    optionId: A
    sourceOptionText: 一人の時間があると戻りやすい
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q083_B_NON_NUMERIC_VECTOR
    questionId: Q083
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: social_contextual
    optionId: B
    sourceOptionText: 別の軽いやりとりで切り替わる
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q083_C_NON_NUMERIC_VECTOR
    questionId: Q083
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: social_contextual
    optionId: C
    sourceOptionText: 場所を離れると戻りやすい
    primarySignal: returnable_distance
    secondarySignals: [social_modulation, reset_by_place]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: native auxiliary modifier
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: returnable_distance: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q083_D_NON_NUMERIC_VECTOR
    questionId: Q083
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: social_contextual
    optionId: D
    sourceOptionText: 話した内容を少し整理したくなる
    primarySignal: load_externalization
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: load_externalization: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q083_E_NON_NUMERIC_VECTOR
    questionId: Q083
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: social_contextual
    optionId: E
    sourceOptionText: そのまま次の予定に入れることもある
    primarySignal: transition_reentry
    secondarySignals: [schedule_reframe, social_modulation]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_reentry nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: transition_reentry: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent rhythm_daily_flow conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; transition_reentry remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied

Q084:
  A:
    optionVectorId: Q084_A_NON_NUMERIC_VECTOR
    questionId: Q084
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 次のことに手をつけやすくなる
    primarySignal: restart_by_micro_step
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: method_shift: native auxiliary modifier
    nativeFamilyContext: primary restart_by_micro_step nativeFamily=action; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: restart_by_micro_step: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent action conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [action_entry_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; restart_by_micro_step remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q084_B_NON_NUMERIC_VECTOR
    questionId: Q084
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 返事や判断を急がなくなる
    primarySignal: response_timing_buffer
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: method_shift: native auxiliary modifier
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: response_timing_buffer: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent boundary conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  C:
    optionVectorId: Q084_C_NON_NUMERIC_VECTOR
    questionId: Q084
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 周りの音や動きが気になりにくくなる
    primarySignal: quiet_reset_need
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: method_shift: native auxiliary modifier
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent emotional_load conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q084_D_NON_NUMERIC_VECTOR
    questionId: Q084
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 小さな用事から始められる
    primarySignal: reset_by_task
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: native auxiliary modifier
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q084_E_NON_NUMERIC_VECTOR
    questionId: Q084
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: まだ軽くしたい予定が見えてくる
    primarySignal: recovery_margin_need
    secondarySignals: [later_review, schedule_reframe, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: native auxiliary modifier
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [recovery_margin_axis, awareness_reflection_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, later_review, schedule_reframe
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied

Q085:
  A:
    optionVectorId: Q085_A_NON_NUMERIC_VECTOR
    questionId: Q085
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: ひとりで静かにする時間
    primarySignal: quiet_reset_need
    secondarySignals: [returnable_distance, recovery_margin_need, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent emotional_load conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, returnable_distance, recovery_margin_need, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q085_B_NON_NUMERIC_VECTOR
    questionId: Q085
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 次に入る前の短い余白
    primarySignal: recovery_margin_need
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q085_C_NON_NUMERIC_VECTOR
    questionId: Q085
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 話して外に出す時間
    primarySignal: load_externalization
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: load_externalization: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent emotional_load conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q085_D_NON_NUMERIC_VECTOR
    questionId: Q085
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 場所や手元を変える時間
    primarySignal: method_shift
    secondarySignals: [social_modulation, reset_by_place, reset_by_task, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: native auxiliary modifier; reset_by_task: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q085_E_NON_NUMERIC_VECTOR
    questionId: Q085
    dimensionCode: RP
    subdimensionCode: RP_RECOVERY_NEED
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 予定を小さく組み直す時間
    primarySignal: schedule_reframe
    secondarySignals: [boundary_awareness, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RECOVERY_NEED source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RECOVERY_NEED source context; does not create independent rhythm_daily_flow conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, boundary_scope_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, boundary_awareness, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RECOVERY_NEED; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review

Q086:
  A:
    optionVectorId: Q086_A_NON_NUMERIC_VECTOR
    questionId: Q086
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: core_behavior
    optionId: A
    sourceOptionText: 静かな場所に移る
    primarySignal: reset_by_place
    secondarySignals: [social_modulation, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_place nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_place remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q086_B_NON_NUMERIC_VECTOR
    questionId: Q086
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: core_behavior
    optionId: B
    sourceOptionText: 手元を片づける
    primarySignal: reset_by_task
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q086_C_NON_NUMERIC_VECTOR
    questionId: Q086
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: core_behavior
    optionId: C
    sourceOptionText: 好きな飲み物や音に触れる
    primarySignal: restoration_cue
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary restoration_cue nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; restoration_cue remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q086_D_NON_NUMERIC_VECTOR
    questionId: Q086
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: core_behavior
    optionId: D
    sourceOptionText: 軽く体を動かす
    primarySignal: reset_by_task
    secondarySignals: [recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_task nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q086_E_NON_NUMERIC_VECTOR
    questionId: Q086
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: core_behavior
    optionId: E
    sourceOptionText: 誰かと短く話す
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
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review

Q087:
  A:
    optionVectorId: Q087_A_NON_NUMERIC_VECTOR
    questionId: Q087
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 深く考えずできる小さな動き
    primarySignal: small_start
    secondarySignals: [recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: small_start: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; small_start remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q087_B_NON_NUMERIC_VECTOR
    questionId: Q087
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 場所を少し変えること
    primarySignal: reset_by_place
    secondarySignals: [social_modulation, recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_place nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_place remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q087_C_NON_NUMERIC_VECTOR
    questionId: Q087
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 目の前をひとつ片づけること
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
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_task remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q087_D_NON_NUMERIC_VECTOR
    questionId: Q087
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 数分だけ静かにすること
    primarySignal: reset_by_quiet
    secondarySignals: [recovery_margin_need]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary reset_by_quiet nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_quiet remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q087_E_NON_NUMERIC_VECTOR
    questionId: Q087
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 次の予定を軽くすること
    primarySignal: schedule_reframe
    secondarySignals: [recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q088:
  A:
    optionVectorId: Q088_A_NON_NUMERIC_VECTOR
    questionId: Q088
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: social_contextual
    optionId: A
    sourceOptionText: 一人の方が戻りやすい
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q088_B_NON_NUMERIC_VECTOR
    questionId: Q088
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: social_contextual
    optionId: B
    sourceOptionText: 誰かと軽く話す方が戻りやすい
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, recovery_margin_need, load_externalization]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q088_C_NON_NUMERIC_VECTOR
    questionId: Q088
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: social_contextual
    optionId: C
    sourceOptionText: どちらでも、短い区切りがあれば戻りやすい
    primarySignal: transition_buffer
    secondarySignals: [boundary_awareness, social_modulation]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary transition_buffer nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: transition_buffer: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent rhythm_daily_flow conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [rhythm_structure_axis, boundary_scope_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; transition_buffer remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q088_D_NON_NUMERIC_VECTOR
    questionId: Q088
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: social_contextual
    optionId: D
    sourceOptionText: その場の距離感で変わりやすい
    primarySignal: returnable_distance
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: returnable_distance: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q088_E_NON_NUMERIC_VECTOR
    questionId: Q088
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: social_contextual
    optionId: E
    sourceOptionText: 人がいる時はあとで戻すことが多い
    primarySignal: delayed_notice
    secondarySignals: [social_modulation, later_review]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent self_observation conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied

Q089:
  A:
    optionVectorId: Q089_A_NON_NUMERIC_VECTOR
    questionId: Q089
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 静かにする代わりに手を動かす
    primarySignal: method_shift
    secondarySignals: [recovery_margin_need, reset_by_task]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier; reset_by_task: native auxiliary modifier
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q089_B_NON_NUMERIC_VECTOR
    questionId: Q089
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 一人でいる代わりに軽く話す
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, returnable_distance, recovery_margin_need, load_externalization, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: native auxiliary modifier
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q089_C_NON_NUMERIC_VECTOR
    questionId: Q089
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 長く取る代わりに短く分ける
    primarySignal: method_shift
    secondarySignals: [boundary_awareness]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  D:
    optionVectorId: Q089_D_NON_NUMERIC_VECTOR
    questionId: Q089
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 場所ではなく音や香りを変える
    primarySignal: restoration_cue
    secondarySignals: [social_modulation, reset_by_place, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: native auxiliary modifier; method_shift: native auxiliary modifier
    nativeFamilyContext: primary restoration_cue nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; restoration_cue remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q089_E_NON_NUMERIC_VECTOR
    questionId: Q089
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 戻すより次の動きを軽くする
    primarySignal: schedule_reframe
    secondarySignals: [recovery_margin_need, method_shift]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: recovery_margin_need: native auxiliary modifier; method_shift: native auxiliary modifier
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied

Q090:
  A:
    optionVectorId: Q090_A_NON_NUMERIC_VECTOR
    questionId: Q090
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 音や人の気配がちょうどよい
    primarySignal: restoration_cue
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary restoration_cue nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; restoration_cue remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q090_B_NON_NUMERIC_VECTOR
    questionId: Q090
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 自分のペースで切り替えられる
    primarySignal: recovery_margin_need
    secondarySignals: [state_notice, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, state_notice, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q090_C_NON_NUMERIC_VECTOR
    questionId: Q090
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 終わった感じが小さくある
    primarySignal: restoration_cue
    secondarySignals: [boundary_awareness, state_notice, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary restoration_cue nativeFamily=recovery_pattern; source dimension nativeFamily=recovery_pattern; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, state_notice, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; restoration_cue remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  D:
    optionVectorId: Q090_D_NON_NUMERIC_VECTOR
    questionId: Q090
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 次にすることが重すぎない
    primarySignal: schedule_reframe
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent rhythm_daily_flow conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q090_E_NON_NUMERIC_VECTOR
    questionId: Q090
    dimensionCode: RP
    subdimensionCode: RP_RESTORATION_TRIGGER
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 無理に急がなくてよい
    primarySignal: response_timing_buffer
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=recovery_pattern; alignment=cross-family
    crossFamilyModifiers: response_timing_buffer: cross-family primary exception bounded by RP_RESTORATION_TRIGGER source context; does not create independent boundary conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: recovery_margin_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by RP_RESTORATION_TRIGGER; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review

Q091:
  A:
    optionVectorId: Q091_A_NON_NUMERIC_VECTOR
    questionId: Q091
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: core_behavior
    optionId: A
    sourceOptionText: できそうな範囲なら引き受けやすい
    primarySignal: boundary_awareness
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  B:
    optionVectorId: Q091_B_NON_NUMERIC_VECTOR
    questionId: Q091
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: core_behavior
    optionId: B
    sourceOptionText: その場の流れで増えやすい
    primarySignal: scope_expansion
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q091_C_NON_NUMERIC_VECTOR
    questionId: Q091
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: core_behavior
    optionId: C
    sourceOptionText: いったん考える時間を取りたくなる
    primarySignal: response_pause
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: non_numeric_option_vector_applied
  D:
    optionVectorId: Q091_D_NON_NUMERIC_VECTOR
    questionId: Q091
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: core_behavior
    optionId: D
    sourceOptionText: 相手によって受け方が変わりやすい
    primarySignal: social_modulation
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: none
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent social_distance conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q091_E_NON_NUMERIC_VECTOR
    questionId: Q091
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: core_behavior
    optionId: E
    sourceOptionText: あとから量の多さに気づくことがある
    primarySignal: delayed_notice
    secondarySignals: [boundary_awareness, later_review]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent self_observation conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review

Q092:
  A:
    optionVectorId: Q092_A_NON_NUMERIC_VECTOR
    questionId: Q092
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: その場を進めるために増えやすい
    primarySignal: scope_expansion
    secondarySignals: [social_modulation, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q092_B_NON_NUMERIC_VECTOR
    questionId: Q092
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 自分の分を確かめてから決めたい
    primarySignal: boundary_awareness
    secondarySignals: [state_notice, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, state_notice
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q092_C_NON_NUMERIC_VECTOR
    questionId: Q092
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: できる部分だけなら受けやすい
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q092_D_NON_NUMERIC_VECTOR
    questionId: Q092
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 相手が困っていると増えやすい
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: social_load_residue: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_load_residue, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q092_E_NON_NUMERIC_VECTOR
    questionId: Q092
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: すぐ決めずに一度置きたくなる
    primarySignal: response_pause
    secondarySignals: [tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review

Q093:
  A:
    optionVectorId: Q093_A_NON_NUMERIC_VECTOR
    questionId: Q093
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い人ほど増えやすい
    primarySignal: scope_expansion
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q093_B_NON_NUMERIC_VECTOR
    questionId: Q093
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: social_contextual
    optionId: B
    sourceOptionText: 役割がある場面では増えやすい
    primarySignal: role_load
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q093_C_NON_NUMERIC_VECTOR
    questionId: Q093
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: social_contextual
    optionId: C
    sourceOptionText: 距離がある相手には範囲を見やすい
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, returnable_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q093_D_NON_NUMERIC_VECTOR
    questionId: Q093
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: social_contextual
    optionId: D
    sourceOptionText: 内容によっては相手に関係なく増える
    primarySignal: scope_expansion
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q093_E_NON_NUMERIC_VECTOR
    questionId: Q093
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: social_contextual
    optionId: E
    sourceOptionText: その日の余白で変わりやすい
    primarySignal: recovery_margin_need
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied

Q094:
  A:
    optionVectorId: Q094_A_NON_NUMERIC_VECTOR
    questionId: Q094
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: まず一つだけ後ろに回す
    primarySignal: schedule_reframe
    secondarySignals: [boundary_awareness, later_review, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent rhythm_daily_flow conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis, pressure_response_axis]
    contentAxes: [rhythm_structure_axis, boundary_scope_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, boundary_awareness, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  B:
    optionVectorId: Q094_B_NON_NUMERIC_VECTOR
    questionId: Q094
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: できる範囲を短く言葉にする
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, response_timing_buffer, load_externalization, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; response_timing_buffer: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation, response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q094_C_NON_NUMERIC_VECTOR
    questionId: Q094
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 手順を分けて小さくする
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  D:
    optionVectorId: Q094_D_NON_NUMERIC_VECTOR
    questionId: Q094
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 誰かに一部だけ共有する
    primarySignal: load_externalization
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: load_externalization: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q094_E_NON_NUMERIC_VECTOR
    questionId: Q094
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 次から確認したい点を残しておく
    primarySignal: later_review
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: later_review: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent self_observation conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, recovery_margin_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied

Q095:
  A:
    optionVectorId: Q095_A_NON_NUMERIC_VECTOR
    questionId: Q095
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: その場を早く進めたくなる
    primarySignal: tension_pressure
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary tension_pressure nativeFamily=emotional_load; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: tension_pressure: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; tension_pressure remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q095_B_NON_NUMERIC_VECTOR
    questionId: Q095
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 相手の困りごとが気になりやすい
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: social_load_residue: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_load_residue, social_modulation, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q095_C_NON_NUMERIC_VECTOR
    questionId: Q095
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 自分の予定を後ろに置きやすい
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, later_review, state_notice, schedule_reframe, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness, later_review, state_notice, schedule_reframe, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  D:
    optionVectorId: Q095_D_NON_NUMERIC_VECTOR
    questionId: Q095
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: できるかより先に返事を考える
    primarySignal: reply_pressure
    secondarySignals: [response_timing_buffer, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: response_timing_buffer: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: reply_pressure: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent social_distance conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [social_distance_axis, boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q095_E_NON_NUMERIC_VECTOR
    questionId: Q095
    dimensionCode: BD
    subdimensionCode: BD_TAKING_ON_TOO_MUCH
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 終わったあとの量が見えにくくなる
    primarySignal: delayed_notice
    secondarySignals: [boundary_awareness, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: delayed_notice: cross-family primary exception bounded by BD_TAKING_ON_TOO_MUCH source context; does not create independent self_observation conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by BD_TAKING_ON_TOO_MUCH; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review

Q096:
  A:
    optionVectorId: Q096_A_NON_NUMERIC_VECTOR
    questionId: Q096
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: core_behavior
    optionId: A
    sourceOptionText: すぐ答える方が流れに乗りやすい
    primarySignal: reply_pressure
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: none
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: reply_pressure: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent social_distance conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q096_B_NON_NUMERIC_VECTOR
    questionId: Q096
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: core_behavior
    optionId: B
    sourceOptionText: 少し考える間があると答えやすい
    primarySignal: response_pause
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q096_C_NON_NUMERIC_VECTOR
    questionId: Q096
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: core_behavior
    optionId: C
    sourceOptionText: 内容によって間の長さが変わる
    primarySignal: response_timing_buffer
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  D:
    optionVectorId: Q096_D_NON_NUMERIC_VECTOR
    questionId: Q096
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: core_behavior
    optionId: D
    sourceOptionText: 相手によってすぐ答えやすさが変わる
    primarySignal: social_modulation
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: none
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent social_distance conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q096_E_NON_NUMERIC_VECTOR
    questionId: Q096
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: core_behavior
    optionId: E
    sourceOptionText: 一度持ち帰る形の方が合いやすい
    primarySignal: response_timing_buffer
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review

Q097:
  A:
    optionVectorId: Q097_A_NON_NUMERIC_VECTOR
    questionId: Q097
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: その場で言える範囲だけ答える
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q097_B_NON_NUMERIC_VECTOR
    questionId: Q097
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 少し間を置けると考えやすい
    primarySignal: response_pause
    secondarySignals: [tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q097_C_NON_NUMERIC_VECTOR
    questionId: Q097
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 相手の急ぎ具合に合わせやすい
    primarySignal: social_modulation
    secondarySignals: [tension_pressure]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent social_distance conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, emotional_load_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q097_D_NON_NUMERIC_VECTOR
    questionId: Q097
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: あとで返す形にしたくなる
    primarySignal: response_timing_buffer
    secondarySignals: [later_review, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q097_E_NON_NUMERIC_VECTOR
    questionId: Q097
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 内容を小さく分けて答えたくなる
    primarySignal: partial_reasoning
    secondarySignals: [boundary_awareness, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent clarity_decision conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [pressure_response_axis]
    contentAxes: [clarity_decision_axis, boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review

Q098:
  A:
    optionVectorId: Q098_A_NON_NUMERIC_VECTOR
    questionId: Q098
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い人には早く答えやすい
    primarySignal: reply_pressure
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: reply_pressure: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q098_B_NON_NUMERIC_VECTOR
    questionId: Q098
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: social_contextual
    optionId: B
    sourceOptionText: 近い人ほど言葉を選びたくなる
    primarySignal: partial_reasoning
    secondarySignals: [social_modulation, response_timing_buffer, load_externalization]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; response_timing_buffer: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, social_modulation, response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q098_C_NON_NUMERIC_VECTOR
    questionId: Q098
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: social_contextual
    optionId: C
    sourceOptionText: 役割がある相手には慎重になりやすい
    primarySignal: role_load
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q098_D_NON_NUMERIC_VECTOR
    questionId: Q098
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: social_contextual
    optionId: D
    sourceOptionText: 距離がある相手には短く答えやすい
    primarySignal: returnable_distance
    secondarySignals: [social_modulation]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: returnable_distance: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [social_context_modulation_axis]
    contentAxes: [social_distance_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q098_E_NON_NUMERIC_VECTOR
    questionId: Q098
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: social_contextual
    optionId: E
    sourceOptionText: 相手より内容の重さで変わりやすい
    primarySignal: scope_expansion
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review

Q099:
  A:
    optionVectorId: Q099_A_NON_NUMERIC_VECTOR
    questionId: Q099
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 次は短く確認してから答える
    primarySignal: response_pause
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q099_B_NON_NUMERIC_VECTOR
    questionId: Q099
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 返事の範囲を小さくする
    primarySignal: boundary_awareness
    secondarySignals: [response_timing_buffer, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: response_timing_buffer: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  C:
    optionVectorId: Q099_C_NON_NUMERIC_VECTOR
    questionId: Q099
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 考える時間を先に伝える形にする
    primarySignal: response_timing_buffer
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  D:
    optionVectorId: Q099_D_NON_NUMERIC_VECTOR
    questionId: Q099
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: すぐ答える内容と後で答える内容を分ける
    primarySignal: partial_reasoning
    secondarySignals: [boundary_awareness, later_review, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent clarity_decision conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis, pressure_response_axis]
    contentAxes: [clarity_decision_axis, boundary_scope_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, boundary_awareness, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  E:
    optionVectorId: Q099_E_NON_NUMERIC_VECTOR
    questionId: Q099
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: その場ごとの自分の余白を見て答える
    primarySignal: recovery_margin_need
    secondarySignals: [social_modulation, state_notice, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, social_modulation, state_notice
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied

Q100:
  A:
    optionVectorId: Q100_A_NON_NUMERIC_VECTOR
    questionId: Q100
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 範囲を決めてから答えたい時
    primarySignal: boundary_awareness
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  B:
    optionVectorId: Q100_B_NON_NUMERIC_VECTOR
    questionId: Q100
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 相手の期待が強く見える時
    primarySignal: social_modulation
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent social_distance conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q100_C_NON_NUMERIC_VECTOR
    questionId: Q100
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 自分の予定への影響を見たい時
    primarySignal: scope_expansion
    secondarySignals: [state_notice, schedule_reframe, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, state_notice, schedule_reframe, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  D:
    optionVectorId: Q100_D_NON_NUMERIC_VECTOR
    questionId: Q100
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 言葉を短くまとめたい時
    primarySignal: partial_reasoning
    secondarySignals: [social_modulation, response_timing_buffer, load_externalization, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; response_timing_buffer: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by BD_HOLDING_RESPONSE source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, boundary_scope_axis, emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, social_modulation, response_timing_buffer, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q100_E_NON_NUMERIC_VECTOR
    questionId: Q100
    dimensionCode: BD
    subdimensionCode: BD_HOLDING_RESPONSE
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 今答える部分と後で答える部分を分けたい時
    primarySignal: response_timing_buffer
    secondarySignals: [boundary_awareness, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer, boundary_awareness, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by BD_HOLDING_RESPONSE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review

Q101:
  A:
    optionVectorId: Q101_A_NON_NUMERIC_VECTOR
    questionId: Q101
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: core_behavior
    optionId: A
    sourceOptionText: 役割に入ると動きやすい
    primarySignal: role_load
    secondarySignals: [social_modulation, role_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q101_B_NON_NUMERIC_VECTOR
    questionId: Q101
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: core_behavior
    optionId: B
    sourceOptionText: 役割が強いと自分の余白が少なくなる
    primarySignal: role_load
    secondarySignals: [social_modulation, recovery_margin_need, state_notice, role_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation, recovery_margin_need, state_notice
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q101_C_NON_NUMERIC_VECTOR
    questionId: Q101
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: core_behavior
    optionId: C
    sourceOptionText: 場面ごとに役割を切り替えたい
    primarySignal: role_distance
    secondarySignals: [social_modulation, role_load]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier
    nativeFamilyContext: primary role_distance nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; role_distance remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q101_D_NON_NUMERIC_VECTOR
    questionId: Q101
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: core_behavior
    optionId: D
    sourceOptionText: 役割より自分のペースを残したい
    primarySignal: role_distance
    secondarySignals: [social_modulation, later_review, state_notice, role_load]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier
    nativeFamilyContext: primary role_distance nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review, state_notice, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; role_distance remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q101_E_NON_NUMERIC_VECTOR
    questionId: Q101
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: core_behavior
    optionId: E
    sourceOptionText: 終わったあとに役割から離れる時間がほしい
    primarySignal: role_aftereffect
    secondarySignals: [social_modulation, returnable_distance, later_review, role_load]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier
    nativeFamilyContext: primary role_aftereffect nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_aftereffect, social_modulation, returnable_distance, later_review, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; role_aftereffect remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive

Q102:
  A:
    optionVectorId: Q102_A_NON_NUMERIC_VECTOR
    questionId: Q102
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 役割に集中して場を進めようとする
    primarySignal: role_load
    secondarySignals: [social_modulation, role_distance, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q102_B_NON_NUMERIC_VECTOR
    questionId: Q102
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 役割の外にある自分の考えも気になる
    primarySignal: role_distance
    secondarySignals: [social_modulation, state_notice, role_load, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_distance nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, state_notice, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; role_distance remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q102_C_NON_NUMERIC_VECTOR
    questionId: Q102
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: その場では役割を優先しやすい
    primarySignal: role_load
    secondarySignals: [social_modulation, role_distance, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q102_D_NON_NUMERIC_VECTOR
    questionId: Q102
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: あとで自分の感じ方を見直したくなる
    primarySignal: later_review
    secondarySignals: [state_notice, role_distance, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by BD_ROLE_DISTANCE source context
    secondarySignalRoles: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: later_review: cross-family primary exception bounded by BD_ROLE_DISTANCE source context; does not create independent self_observation conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [role_distance_axis, awareness_reflection_axis, boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, state_notice
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q102_E_NON_NUMERIC_VECTOR
    questionId: Q102
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 役割の範囲を確かめたくなる
    primarySignal: boundary_awareness
    secondarySignals: [social_modulation, role_load, role_distance, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier; role_distance: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, social_modulation, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive

Q103:
  A:
    optionVectorId: Q103_A_NON_NUMERIC_VECTOR
    questionId: Q103
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い関係ほど役割から離れにくい
    primarySignal: role_load
    secondarySignals: [social_modulation, returnable_distance, role_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q103_B_NON_NUMERIC_VECTOR
    questionId: Q103
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: social_contextual
    optionId: B
    sourceOptionText: 仕事や担当がある場では役割に入りやすい
    primarySignal: role_load
    secondarySignals: [social_modulation, role_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q103_C_NON_NUMERIC_VECTOR
    questionId: Q103
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: social_contextual
    optionId: C
    sourceOptionText: 友人の前では役割を軽くしやすい
    primarySignal: role_distance
    secondarySignals: [social_modulation, recovery_margin_need, role_load]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier
    nativeFamilyContext: primary role_distance nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, recovery_margin_need, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; role_distance remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q103_D_NON_NUMERIC_VECTOR
    questionId: Q103
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: social_contextual
    optionId: D
    sourceOptionText: 場によって自分の出し方を変えやすい
    primarySignal: social_modulation
    secondarySignals: [state_notice, role_distance]
    primarySignalRole: cross-family primary exception bounded by BD_ROLE_DISTANCE source context
    secondarySignalRoles: state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by BD_ROLE_DISTANCE source context; does not create independent social_distance conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, social_distance_axis, awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, state_notice
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q103_E_NON_NUMERIC_VECTOR
    questionId: Q103
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: social_contextual
    optionId: E
    sourceOptionText: 関係より、その時の余白で変わりやすい
    primarySignal: recovery_margin_need
    secondarySignals: [role_distance, social_modulation]
    primarySignalRole: cross-family primary exception bounded by BD_ROLE_DISTANCE source context
    secondarySignalRoles: role_distance: native auxiliary modifier; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary recovery_margin_need nativeFamily=recovery_pattern; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: recovery_margin_need: cross-family primary exception bounded by BD_ROLE_DISTANCE source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [social_context_modulation_axis, recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, recovery_margin_axis, boundary_scope_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; recovery_margin_need remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review

Q104:
  A:
    optionVectorId: Q104_A_NON_NUMERIC_VECTOR
    questionId: Q104
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: ひとりの時間に戻す
    primarySignal: quiet_reset_need
    secondarySignals: [returnable_distance, role_distance, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_ROLE_DISTANCE source context
    secondarySignalRoles: returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by BD_ROLE_DISTANCE source context; does not create independent emotional_load conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, emotional_load_axis, social_distance_axis, boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, returnable_distance
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q104_B_NON_NUMERIC_VECTOR
    questionId: Q104
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 普段の小さな用事に戻る
    primarySignal: routine_anchor
    secondarySignals: [reset_by_task, role_distance, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_ROLE_DISTANCE source context
    secondarySignalRoles: reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary routine_anchor nativeFamily=rhythm_daily_flow; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: routine_anchor: cross-family primary exception bounded by BD_ROLE_DISTANCE source context; does not create independent rhythm_daily_flow conclusion; reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, rhythm_structure_axis, recovery_margin_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; routine_anchor remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing
    applicationStatus: needs_review
  C:
    optionVectorId: Q104_C_NON_NUMERIC_VECTOR
    questionId: Q104
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 役割と関係ない話をする
    primarySignal: reset_by_social_contact
    secondarySignals: [social_modulation, load_externalization, role_load, role_distance, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_ROLE_DISTANCE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier; role_distance: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary reset_by_social_contact nativeFamily=recovery_pattern; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: reset_by_social_contact: cross-family primary exception bounded by BD_ROLE_DISTANCE source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, recovery_margin_axis, social_distance_axis, emotional_load_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; reset_by_social_contact remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q104_D_NON_NUMERIC_VECTOR
    questionId: Q104
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: その場で使った言葉を少し置く
    primarySignal: role_aftereffect
    secondarySignals: [social_modulation, response_timing_buffer, load_externalization, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; response_timing_buffer: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_aftereffect nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_aftereffect, social_modulation, response_timing_buffer
    privateInterpretationBoundary: private/internal signal interpretation only; role_aftereffect remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q104_E_NON_NUMERIC_VECTOR
    questionId: Q104
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 次の予定を軽めにする
    primarySignal: schedule_reframe
    secondarySignals: [recovery_margin_need, role_distance, method_shift]
    primarySignalRole: cross-family primary exception bounded by BD_ROLE_DISTANCE source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=boundary; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by BD_ROLE_DISTANCE source context; does not create independent rhythm_daily_flow conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: boundary_scope_axis
    evidenceRoleAxes: [recovery_adjustment_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, rhythm_structure_axis, recovery_margin_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing
    applicationStatus: needs_review

Q105:
  A:
    optionVectorId: Q105_A_NON_NUMERIC_VECTOR
    questionId: Q105
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 自分の予定が後ろに行きやすい
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, later_review, state_notice, schedule_reframe, role_distance]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, awareness_reflection_axis, rhythm_structure_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness, later_review, state_notice, schedule_reframe
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  B:
    optionVectorId: Q105_B_NON_NUMERIC_VECTOR
    questionId: Q105
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 断るかどうかより先に動いている
    primarySignal: scope_expansion
    secondarySignals: [role_distance, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: role_distance: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review
  C:
    optionVectorId: Q105_C_NON_NUMERIC_VECTOR
    questionId: Q105
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: その場を保つことを優先しやすい
    primarySignal: role_load
    secondarySignals: [social_modulation, role_distance, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q105_D_NON_NUMERIC_VECTOR
    questionId: Q105
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 終わったあとも役割の言葉が残る
    primarySignal: role_aftereffect
    secondarySignals: [social_modulation, response_timing_buffer, later_review, load_externalization, role_load]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; response_timing_buffer: native auxiliary modifier; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_load: native auxiliary modifier
    nativeFamilyContext: primary role_aftereffect nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_aftereffect, social_modulation, response_timing_buffer, later_review, role_load
    privateInterpretationBoundary: private/internal signal interpretation only; role_aftereffect remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q105_E_NON_NUMERIC_VECTOR
    questionId: Q105
    dimensionCode: BD
    subdimensionCode: BD_ROLE_DISTANCE
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 自分の範囲が見えにくくなる
    primarySignal: boundary_awareness
    secondarySignals: [later_review, state_notice, role_distance, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; role_distance: native auxiliary modifier; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=boundary; alignment=native
    crossFamilyModifiers: later_review: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: cross-family auxiliary modifier; does not create independent subdimension conclusion; self_observation_strength: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, pressure_response_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review, state_notice, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by BD_ROLE_DISTANCE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review

Q106:
  A:
    optionVectorId: Q106_A_NON_NUMERIC_VECTOR
    questionId: Q106
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: core_behavior
    optionId: A
    sourceOptionText: 動きがいつもよりゆっくりになる時
    primarySignal: state_notice
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q106_B_NON_NUMERIC_VECTOR
    questionId: Q106
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: core_behavior
    optionId: B
    sourceOptionText: 返事や判断に間が出る時
    primarySignal: response_pause
    secondarySignals: [feedback_filtering]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: feedback_filtering: native auxiliary modifier
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: response_pause: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent boundary conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q106_C_NON_NUMERIC_VECTOR
    questionId: Q106
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: core_behavior
    optionId: C
    sourceOptionText: 人と離れて静かになった時
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance, recovery_margin_need]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance, recovery_margin_need
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q106_D_NON_NUMERIC_VECTOR
    questionId: Q106
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: core_behavior
    optionId: D
    sourceOptionText: 書いたり話したりした時
    primarySignal: load_externalization
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: none
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: load_externalization: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent emotional_load conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: none
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q106_E_NON_NUMERIC_VECTOR
    questionId: Q106
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: core_behavior
    optionId: E
    sourceOptionText: 予定の流れが変わった時
    primarySignal: schedule_reframe
    secondarySignals: []
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: none
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent rhythm_daily_flow conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure
    applicationStatus: non_numeric_option_vector_applied

Q107:
  A:
    optionVectorId: Q107_A_NON_NUMERIC_VECTOR
    questionId: Q107
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 進み方が変わってから気づく
    primarySignal: delayed_notice
    secondarySignals: [later_review, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q107_B_NON_NUMERIC_VECTOR
    questionId: Q107
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 予定を見直す時に気づく
    primarySignal: schedule_reframe
    secondarySignals: [later_review, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: later_review: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent rhythm_daily_flow conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  C:
    optionVectorId: Q107_C_NON_NUMERIC_VECTOR
    questionId: Q107
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: 人から声をかけられて気づく
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation, later_review, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: social_input_sensitive: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_input_sensitive remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q107_D_NON_NUMERIC_VECTOR
    questionId: Q107
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 手が止まった時に気づく
    primarySignal: state_notice
    secondarySignals: [later_review, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q107_E_NON_NUMERIC_VECTOR
    questionId: Q107
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: その時は気づかず、あとで見えてくる
    primarySignal: delayed_notice
    secondarySignals: [later_review, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review

Q108:
  A:
    optionVectorId: Q108_A_NON_NUMERIC_VECTOR
    questionId: Q108
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: social_contextual
    optionId: A
    sourceOptionText: その場では気づきにくく、あとで見える
    primarySignal: delayed_notice
    secondarySignals: [social_modulation, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  B:
    optionVectorId: Q108_B_NON_NUMERIC_VECTOR
    questionId: Q108
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: social_contextual
    optionId: B
    sourceOptionText: 相手に合わせる前に少し気づく
    primarySignal: state_notice
    secondarySignals: [social_modulation, later_review]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, social_modulation, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q108_C_NON_NUMERIC_VECTOR
    questionId: Q108
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: social_contextual
    optionId: C
    sourceOptionText: 話している途中で変化に気づく
    primarySignal: state_notice
    secondarySignals: [later_review, load_externalization, social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, later_review, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q108_D_NON_NUMERIC_VECTOR
    questionId: Q108
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: social_contextual
    optionId: D
    sourceOptionText: 一人になった時に見えやすい
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance, later_review]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q108_E_NON_NUMERIC_VECTOR
    questionId: Q108
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: social_contextual
    optionId: E
    sourceOptionText: 合わせる範囲を考える時に気づく
    primarySignal: boundary_awareness
    secondarySignals: [later_review, social_modulation]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: later_review: native auxiliary modifier; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, later_review, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review

Q109:
  A:
    optionVectorId: Q109_A_NON_NUMERIC_VECTOR
    questionId: Q109
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 次の一つだけを小さくする
    primarySignal: small_start
    secondarySignals: [boundary_awareness, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary small_start nativeFamily=rhythm_daily_flow; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: small_start: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent rhythm_daily_flow conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, boundary_scope_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; small_start remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment
    applicationStatus: needs_review
  B:
    optionVectorId: Q109_B_NON_NUMERIC_VECTOR
    questionId: Q109
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 予定の順番を入れ替える
    primarySignal: schedule_reframe
    secondarySignals: [method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent rhythm_daily_flow conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: public_safe by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: public_safe; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: not_required_but_available_for_internal_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference
    applicationStatus: non_numeric_option_vector_applied
  C:
    optionVectorId: Q109_C_NON_NUMERIC_VECTOR
    questionId: Q109
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 人とのやりとりを短めにする
    primarySignal: response_timing_buffer
    secondarySignals: [social_modulation, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: response_timing_buffer: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q109_D_NON_NUMERIC_VECTOR
    questionId: Q109
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: 場所や手元を変える
    primarySignal: method_shift
    secondarySignals: [social_modulation, reset_by_place, reset_by_task]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: method_shift: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_place: cross-family auxiliary modifier; does not create independent subdimension conclusion; reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis]
    contentAxes: [recovery_margin_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: non_numeric_option_vector_applied
  E:
    optionVectorId: Q109_E_NON_NUMERIC_VECTOR
    questionId: Q109
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: そのまま進みつつ、後ろを軽くする
    primarySignal: schedule_reframe
    secondarySignals: [recovery_margin_need, boundary_awareness, later_review, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent rhythm_daily_flow conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, recovery_margin_need, boundary_awareness, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: needs_review

Q110:
  A:
    optionVectorId: Q110_A_NON_NUMERIC_VECTOR
    questionId: Q110
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 予定が終わって静かになった時
    primarySignal: quiet_reset_need
    secondarySignals: [recovery_margin_need, schedule_reframe, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent emotional_load conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; schedule_reframe: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [awareness_reflection_axis, recovery_adjustment_axis]
    contentAxes: [emotional_load_axis, recovery_margin_axis, rhythm_structure_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, recovery_margin_need, schedule_reframe, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  B:
    optionVectorId: Q110_B_NON_NUMERIC_VECTOR
    questionId: Q110
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 誰かに話して言葉になった時
    primarySignal: load_externalization
    secondarySignals: [social_modulation, feedback_filtering, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: load_externalization: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [feedback_filtering_axis, emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, feedback_filtering, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q110_C_NON_NUMERIC_VECTOR
    questionId: Q110
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: その日の流れを書き出した時
    primarySignal: load_externalization
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary load_externalization nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: load_externalization: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent emotional_load conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; load_externalization remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  D:
    optionVectorId: Q110_D_NON_NUMERIC_VECTOR
    questionId: Q110
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 次の日に同じ感じが残っていた時
    primarySignal: post_event_residue
    secondarySignals: [later_review, state_notice, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SO_NOTICING_STATE source context
    secondarySignalRoles: later_review: native auxiliary modifier; state_notice: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary post_event_residue nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: post_event_residue: cross-family primary exception bounded by SO_NOTICING_STATE source context; does not create independent emotional_load conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [emotional_load_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, state_notice, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; post_event_residue remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_review
  E:
    optionVectorId: Q110_E_NON_NUMERIC_VECTOR
    questionId: Q110
    dimensionCode: SO
    subdimensionCode: SO_NOTICING_STATE
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 何が重かったか一つ見えた時
    primarySignal: state_notice
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_low by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_low; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SO_NOTICING_STATE; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking
    applicationStatus: non_numeric_option_vector_applied

Q111:
  A:
    optionVectorId: Q111_A_NON_NUMERIC_VECTOR
    questionId: Q111
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: core_behavior
    optionId: A
    sourceOptionText: 始めるまでに時間がいる流れ
    primarySignal: pattern_naming
    secondarySignals: []
    primarySignalRole: native primary driver
    secondarySignalRoles: none
    nativeFamilyContext: primary pattern_naming nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; pattern_naming remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q111_B_NON_NUMERIC_VECTOR
    questionId: Q111
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: core_behavior
    optionId: B
    sourceOptionText: 人に合わせると後から残る流れ
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, later_review, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: social_load_residue: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_load_residue, social_modulation, later_review, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q111_C_NON_NUMERIC_VECTOR
    questionId: Q111
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: core_behavior
    optionId: C
    sourceOptionText: 選ぶ前に条件を見たくなる流れ
    primarySignal: criteria_awareness
    secondarySignals: [pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: criteria_awareness: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent clarity_decision conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; criteria_awareness remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q111_D_NON_NUMERIC_VECTOR
    questionId: Q111
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: core_behavior
    optionId: D
    sourceOptionText: 受けすぎてから量に気づく流れ
    primarySignal: scope_expansion
    secondarySignals: [boundary_awareness, later_review, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent boundary conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, boundary_awareness, later_review, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q111_E_NON_NUMERIC_VECTOR
    questionId: Q111
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: core_behavior
    optionId: E
    sourceOptionText: 一度止まると小さく戻る流れ
    primarySignal: restart_by_micro_step
    secondarySignals: [boundary_awareness, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary restart_by_micro_step nativeFamily=action; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: restart_by_micro_step: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent action conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [action_entry_axis, boundary_scope_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; restart_by_micro_step remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive

Q112:
  A:
    optionVectorId: Q112_A_NON_NUMERIC_VECTOR
    questionId: Q112
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: 何が増えていたかを見る
    primarySignal: scope_expansion
    secondarySignals: [pattern_naming, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: pattern_naming: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent boundary conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q112_B_NON_NUMERIC_VECTOR
    questionId: Q112
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: 何を後回しにしたかを見る
    primarySignal: scope_expansion
    secondarySignals: [later_review, pattern_naming, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: later_review: native auxiliary modifier; pattern_naming: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent boundary conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, later_review, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q112_C_NON_NUMERIC_VECTOR
    questionId: Q112
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: どこで止まったかを見る
    primarySignal: state_notice
    secondarySignals: [pattern_naming, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: pattern_naming: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary state_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; state_notice remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q112_D_NON_NUMERIC_VECTOR
    questionId: Q112
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 誰といた時かを見る
    primarySignal: social_modulation
    secondarySignals: [pattern_naming, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: pattern_naming: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent social_distance conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q112_E_NON_NUMERIC_VECTOR
    questionId: Q112
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: 何が終わると軽くなったかを見る
    primarySignal: restoration_cue
    secondarySignals: [recovery_margin_need, pattern_naming, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary restoration_cue nativeFamily=recovery_pattern; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: restoration_cue: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent recovery_pattern conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [recovery_margin_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: recovery_margin_need, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; restoration_cue remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive

Q113:
  A:
    optionVectorId: Q113_A_NON_NUMERIC_VECTOR
    questionId: Q113
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い人には返事を考えすぎる流れ
    primarySignal: reply_pressure
    secondarySignals: [social_modulation, feedback_filtering, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary reply_pressure nativeFamily=social_distance; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: reply_pressure: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, feedback_filtering, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; reply_pressure remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q113_B_NON_NUMERIC_VECTOR
    questionId: Q113
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: social_contextual
    optionId: B
    sourceOptionText: 役割があると引き受けやすい流れ
    primarySignal: role_load
    secondarySignals: [social_modulation, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: role_load: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [role_distance_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q113_C_NON_NUMERIC_VECTOR
    questionId: Q113
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: social_contextual
    optionId: C
    sourceOptionText: 場の空気を見てから動く流れ
    primarySignal: atmosphere_reading
    secondarySignals: [social_modulation, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary atmosphere_reading nativeFamily=social_distance; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: atmosphere_reading: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; atmosphere_reading remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q113_D_NON_NUMERIC_VECTOR
    questionId: Q113
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: social_contextual
    optionId: D
    sourceOptionText: 人と離れてから自分の感じが見える流れ
    primarySignal: delayed_notice
    secondarySignals: [social_modulation, returnable_distance, later_review, state_notice, pattern_naming]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; state_notice: native auxiliary modifier; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, returnable_distance, later_review, state_notice, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q113_E_NON_NUMERIC_VECTOR
    questionId: Q113
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: social_contextual
    optionId: E
    sourceOptionText: 相手より内容の重さで変わる流れ
    primarySignal: scope_expansion
    secondarySignals: [social_modulation, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary scope_expansion nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: scope_expansion: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [boundary_scope_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: scope_expansion, social_modulation, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; scope_expansion remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive

Q114:
  A:
    optionVectorId: Q114_A_NON_NUMERIC_VECTOR
    questionId: Q114
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 次に同じ流れが出た時の目印にする
    primarySignal: pattern_naming
    secondarySignals: [method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary pattern_naming nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; pattern_naming remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q114_B_NON_NUMERIC_VECTOR
    questionId: Q114
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 予定を少し軽くする合図にする
    primarySignal: schedule_reframe
    secondarySignals: [recovery_margin_need, pattern_naming, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary schedule_reframe nativeFamily=rhythm_daily_flow; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: schedule_reframe: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent rhythm_daily_flow conclusion; recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [rhythm_structure_axis, recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: schedule_reframe, recovery_margin_need, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; schedule_reframe remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q114_C_NON_NUMERIC_VECTOR
    questionId: Q114
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 人に説明しすぎない短い言葉にする
    primarySignal: partial_reasoning
    secondarySignals: [social_modulation, feedback_filtering, load_externalization, pattern_naming, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, clarity_decision_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, social_modulation, feedback_filtering, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q114_D_NON_NUMERIC_VECTOR
    questionId: Q114
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: その日のメモにだけ残す
    primarySignal: later_review
    secondarySignals: [load_externalization, pattern_naming, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q114_E_NON_NUMERIC_VECTOR
    questionId: Q114
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 別の言い方に変えられる余地を残す
    primarySignal: method_shift
    secondarySignals: [later_review, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: later_review: native auxiliary modifier; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: method_shift: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent recovery_pattern conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [recovery_margin_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive

Q115:
  A:
    optionVectorId: Q115_A_NON_NUMERIC_VECTOR
    questionId: Q115
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: 違う場面でも同じ流れが出た時
    primarySignal: pattern_naming
    secondarySignals: [social_modulation, later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary pattern_naming nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: pattern_naming, social_modulation, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; pattern_naming remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q115_B_NON_NUMERIC_VECTOR
    questionId: Q115
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 思ったより軽い形で出た時
    primarySignal: later_review
    secondarySignals: [pattern_naming, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: pattern_naming: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, pattern_naming, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q115_C_NON_NUMERIC_VECTOR
    questionId: Q115
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 人が変わると違う出方をした時
    primarySignal: social_modulation
    secondarySignals: [pattern_naming, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: pattern_naming: native auxiliary modifier; later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent social_distance conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, pattern_naming, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q115_D_NON_NUMERIC_VECTOR
    questionId: Q115
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 時間がたって言い方が合わなくなった時
    primarySignal: later_review
    secondarySignals: [pattern_naming, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: pattern_naming: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, pattern_naming, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q115_E_NON_NUMERIC_VECTOR
    questionId: Q115
    dimensionCode: SO
    subdimensionCode: SO_NAMING_PATTERN
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 別の言葉の方が近いと感じた時
    primarySignal: method_shift
    secondarySignals: [social_modulation, feedback_filtering, state_notice, load_externalization, pattern_naming]
    primarySignalRole: cross-family primary exception bounded by SO_NAMING_PATTERN source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; state_notice: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; pattern_naming: native auxiliary modifier
    nativeFamilyContext: primary method_shift nativeFamily=recovery_pattern; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: method_shift: cross-family primary exception bounded by SO_NAMING_PATTERN source context; does not create independent recovery_pattern conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis, recovery_adjustment_axis]
    contentAxes: [feedback_filtering_axis, recovery_margin_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, feedback_filtering, state_notice, pattern_naming
    privateInterpretationBoundary: private/internal signal interpretation only; method_shift remains source-bounded by SO_NAMING_PATTERN; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no result taxonomy; no persona label; no archetype name; no identity descriptor; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive

Q116:
  A:
    optionVectorId: Q116_A_NON_NUMERIC_VECTOR
    questionId: Q116
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: core_behavior
    optionId: A
    sourceOptionText: すぐ使わず、いったん手元に置く
    primarySignal: feedback_filtering
    secondarySignals: [reset_by_task]
    primarySignalRole: native primary driver
    secondarySignalRoles: reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary feedback_filtering nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: reset_by_task: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; feedback_filtering remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q116_B_NON_NUMERIC_VECTOR
    questionId: Q116
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: core_behavior
    optionId: B
    sourceOptionText: 自分の感覚と照らしてみる
    primarySignal: criteria_awareness
    secondarySignals: [state_notice, feedback_filtering]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: state_notice: native auxiliary modifier; feedback_filtering: native auxiliary modifier
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: criteria_awareness: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent clarity_decision conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: state_notice, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; criteria_awareness remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q116_C_NON_NUMERIC_VECTOR
    questionId: Q116
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: core_behavior
    optionId: C
    sourceOptionText: 誰からの言葉かで受け取り方が変わる
    primarySignal: social_input_sensitive
    secondarySignals: [social_modulation, feedback_filtering, load_externalization]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_input_sensitive nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: social_input_sensitive: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, clarity_decision_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; social_input_sensitive remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q116_D_NON_NUMERIC_VECTOR
    questionId: Q116
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: core_behavior
    optionId: D
    sourceOptionText: 短く具体的だと見やすい
    primarySignal: partial_reasoning
    secondarySignals: [feedback_filtering]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: feedback_filtering: native auxiliary modifier
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent clarity_decision conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [baseline_tendency_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, clarity_decision_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q116_E_NON_NUMERIC_VECTOR
    questionId: Q116
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: core_behavior
    optionId: E
    sourceOptionText: その場では受け取りにくく、後で見る
    primarySignal: delayed_notice
    secondarySignals: [social_modulation, later_review, feedback_filtering]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; feedback_filtering: native auxiliary modifier
    nativeFamilyContext: primary delayed_notice nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [baseline_tendency_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: core_behavior evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, later_review, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; delayed_notice remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive

Q117:
  A:
    optionVectorId: Q117_A_NON_NUMERIC_VECTOR
    questionId: Q117
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: scenario_pressure
    optionId: A
    sourceOptionText: その場では短く受け取る
    primarySignal: partial_reasoning
    secondarySignals: [social_modulation, feedback_filtering, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary partial_reasoning nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: partial_reasoning: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, clarity_decision_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: partial_reasoning, social_modulation, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; partial_reasoning remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q117_B_NON_NUMERIC_VECTOR
    questionId: Q117
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: scenario_pressure
    optionId: B
    sourceOptionText: あとで見返せる形にしたくなる
    primarySignal: later_review
    secondarySignals: [feedback_filtering, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: feedback_filtering: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q117_C_NON_NUMERIC_VECTOR
    questionId: Q117
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: scenario_pressure
    optionId: C
    sourceOptionText: すぐには入れず、少し時間を置く
    primarySignal: response_timing_buffer
    secondarySignals: [feedback_filtering, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: feedback_filtering: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_timing_buffer nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: response_timing_buffer: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent boundary conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, boundary_scope_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: response_timing_buffer, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; response_timing_buffer remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q117_D_NON_NUMERIC_VECTOR
    questionId: Q117
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: scenario_pressure
    optionId: D
    sourceOptionText: 具体的な部分だけ拾いやすい
    primarySignal: feedback_filtering
    secondarySignals: [boundary_awareness, tension_pressure]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary feedback_filtering nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, boundary_scope_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: feedback_filtering, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; feedback_filtering remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q117_E_NON_NUMERIC_VECTOR
    questionId: Q117
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: scenario_pressure
    optionId: E
    sourceOptionText: まず今必要なことだけ見る
    primarySignal: boundary_awareness
    secondarySignals: [feedback_filtering, tension_pressure]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: feedback_filtering: native auxiliary modifier; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary boundary_awareness nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: boundary_awareness: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent boundary conclusion; tension_pressure: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [pressure_response_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, boundary_scope_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: scenario_pressure evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; boundary_awareness remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive

Q118:
  A:
    optionVectorId: Q118_A_NON_NUMERIC_VECTOR
    questionId: Q118
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: social_contextual
    optionId: A
    sourceOptionText: 近い人の言葉ほど残りやすい
    primarySignal: social_load_residue
    secondarySignals: [social_modulation, feedback_filtering, later_review, load_externalization]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; later_review: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary social_load_residue nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: social_load_residue: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, emotional_load_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_load_residue, social_modulation, feedback_filtering, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; social_load_residue remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q118_B_NON_NUMERIC_VECTOR
    questionId: Q118
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: social_contextual
    optionId: B
    sourceOptionText: 距離がある人の方が聞きやすいことがある
    primarySignal: returnable_distance
    secondarySignals: [social_modulation, feedback_filtering]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier
    nativeFamilyContext: primary returnable_distance nativeFamily=social_distance; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: returnable_distance: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent social_distance conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: returnable_distance, social_modulation, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; returnable_distance remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q118_C_NON_NUMERIC_VECTOR
    questionId: Q118
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: social_contextual
    optionId: C
    sourceOptionText: 役割がある相手の言葉は慎重に見る
    primarySignal: role_load
    secondarySignals: [social_modulation, feedback_filtering, load_externalization]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary role_load nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: role_load: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, role_distance_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_high by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_high; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: role_load, social_modulation, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; role_load remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no career/work-performance judgment; no family-role judgment; no duty/obligation judgment; no role damage framing; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q118_D_NON_NUMERIC_VECTOR
    questionId: Q118
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: social_contextual
    optionId: D
    sourceOptionText: 誰からでも具体的なら見やすい
    primarySignal: feedback_filtering
    secondarySignals: [social_modulation]
    primarySignalRole: native primary driver
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary feedback_filtering nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, social_distance_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: feedback_filtering, social_modulation
    privateInterpretationBoundary: private/internal signal interpretation only; feedback_filtering remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q118_E_NON_NUMERIC_VECTOR
    questionId: Q118
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: social_contextual
    optionId: E
    sourceOptionText: 相手より、その時の言い方で変わる
    primarySignal: social_modulation
    secondarySignals: [feedback_filtering]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: feedback_filtering: native auxiliary modifier
    nativeFamilyContext: primary social_modulation nativeFamily=social_distance; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: social_modulation: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent social_distance conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, social_distance_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: social_contextual evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; social_modulation remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference
    applicationStatus: needs_human_review_sensitive

Q119:
  A:
    optionVectorId: Q119_A_NON_NUMERIC_VECTOR
    questionId: Q119
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: recovery_adjustment
    optionId: A
    sourceOptionText: 使える部分だけ拾う
    primarySignal: feedback_filtering
    secondarySignals: [boundary_awareness, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary feedback_filtering nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, boundary_scope_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: feedback_filtering, boundary_awareness
    privateInterpretationBoundary: private/internal signal interpretation only; feedback_filtering remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q119_B_NON_NUMERIC_VECTOR
    questionId: Q119
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: recovery_adjustment
    optionId: B
    sourceOptionText: 今は置いて、後で見直す
    primarySignal: later_review
    secondarySignals: [feedback_filtering, method_shift]
    primarySignalRole: native primary driver
    secondarySignalRoles: feedback_filtering: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q119_C_NON_NUMERIC_VECTOR
    questionId: Q119
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: recovery_adjustment
    optionId: C
    sourceOptionText: 自分の感じと違う部分を分ける
    primarySignal: criteria_awareness
    secondarySignals: [boundary_awareness, state_notice, feedback_filtering, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; state_notice: native auxiliary modifier; feedback_filtering: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: criteria_awareness: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent clarity_decision conclusion; boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, clarity_decision_axis, boundary_scope_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: boundary_awareness, state_notice, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; criteria_awareness remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q119_D_NON_NUMERIC_VECTOR
    questionId: Q119
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: recovery_adjustment
    optionId: D
    sourceOptionText: すぐ行動にせず、言葉だけ残す
    primarySignal: response_pause
    secondarySignals: [social_modulation, feedback_filtering, later_review, load_externalization, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; later_review: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary response_pause nativeFamily=boundary; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: response_pause: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent boundary conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, boundary_scope_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, feedback_filtering, later_review
    privateInterpretationBoundary: private/internal signal interpretation only; response_pause remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q119_E_NON_NUMERIC_VECTOR
    questionId: Q119
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: recovery_adjustment
    optionId: E
    sourceOptionText: 一人で考える時間をはさむ
    primarySignal: quiet_reset_need
    secondarySignals: [social_modulation, returnable_distance, feedback_filtering, method_shift]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    nativeFamilyContext: primary quiet_reset_need nativeFamily=emotional_load; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: quiet_reset_need: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent emotional_load conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; returnable_distance: cross-family auxiliary modifier; does not create independent subdimension conclusion; method_shift: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [recovery_adjustment_axis, social_context_modulation_axis, awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, emotional_load_axis, social_distance_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: recovery_adjustment evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: quiet_reset_need, social_modulation, returnable_distance, feedback_filtering
    privateInterpretationBoundary: private/internal signal interpretation only; quiet_reset_need remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive

Q120:
  A:
    optionVectorId: Q120_A_NON_NUMERIC_VECTOR
    questionId: Q120
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: reflection_revisit
    optionId: A
    sourceOptionText: その時より落ち着いて見える
    primarySignal: later_review
    secondarySignals: [recovery_margin_need, feedback_filtering, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: recovery_margin_need: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis, recovery_adjustment_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, recovery_margin_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, recovery_margin_need, feedback_filtering, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no therapy framing; no wellness prescription; no self-care quality judgment; no health-status inference; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  B:
    optionVectorId: Q120_B_NON_NUMERIC_VECTOR
    questionId: Q120
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: reflection_revisit
    optionId: B
    sourceOptionText: 自分には合わない部分が見える
    primarySignal: feedback_filtering
    secondarySignals: [boundary_awareness, later_review, state_notice, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; state_notice: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary feedback_filtering nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: boundary_awareness: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis, boundary_scope_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: feedback_filtering, boundary_awareness, later_review, state_notice, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; feedback_filtering remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no good/bad boundary framing; no assertiveness/refusal-skill judgment; no work/family/duty/role-performance judgment; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  C:
    optionVectorId: Q120_C_NON_NUMERIC_VECTOR
    questionId: Q120
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: reflection_revisit
    optionId: C
    sourceOptionText: 一部だけ役に立つ形で残る
    primarySignal: feedback_filtering
    secondarySignals: [later_review, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary feedback_filtering nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: feedback_filtering, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; feedback_filtering remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive
  D:
    optionVectorId: Q120_D_NON_NUMERIC_VECTOR
    questionId: Q120
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: reflection_revisit
    optionId: D
    sourceOptionText: 誰の言葉だったかより内容を見る
    primarySignal: criteria_awareness
    secondarySignals: [social_modulation, feedback_filtering, load_externalization, later_review, self_observation_strength]
    primarySignalRole: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context
    secondarySignalRoles: social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; feedback_filtering: native auxiliary modifier; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion; later_review: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary criteria_awareness nativeFamily=clarity_decision; source dimension nativeFamily=self_observation; alignment=cross-family
    crossFamilyModifiers: criteria_awareness: cross-family primary exception bounded by SO_FEEDBACK_OPENNESS source context; does not create independent clarity_decision conclusion; social_modulation: cross-family auxiliary modifier; does not create independent subdimension conclusion; load_externalization: cross-family auxiliary modifier; does not create independent subdimension conclusion
    sourceContextContentAxis: awareness_reflection_axis
    evidenceRoleAxes: [awareness_reflection_axis, social_context_modulation_axis]
    contentAxes: [feedback_filtering_axis, clarity_decision_axis, social_distance_axis, awareness_reflection_axis, emotional_load_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: social_modulation, feedback_filtering, later_review, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; criteria_awareness remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment; no reply/no-reply advice; no contact/no-contact advice; no relationship diagnosis; no dependency framing; no partner/family inference; non-clinical emotional-load handling; no burnout/anxiety claim; no disorder/treatment inference
    applicationStatus: needs_human_review_sensitive
  E:
    optionVectorId: Q120_E_NON_NUMERIC_VECTOR
    questionId: Q120
    dimensionCode: SO
    subdimensionCode: SO_FEEDBACK_OPENNESS
    variantType: reflection_revisit
    optionId: E
    sourceOptionText: 前とは違う意味に見えることがある
    primarySignal: later_review
    secondarySignals: [feedback_filtering, self_observation_strength]
    primarySignalRole: native primary driver
    secondarySignalRoles: feedback_filtering: native auxiliary modifier; self_observation_strength: native auxiliary modifier
    nativeFamilyContext: primary later_review nativeFamily=self_observation; source dimension nativeFamily=self_observation; alignment=native
    crossFamilyModifiers: none
    sourceContextContentAxis: not_required_native_context_preserved
    evidenceRoleAxes: [awareness_reflection_axis]
    contentAxes: [feedback_filtering_axis, awareness_reflection_axis]
    controlAxes: confidence_axis: qualitative confidenceContribution preserved only; sensitivity_axis: private_medium by strictest active signal; public_visibility_axis: raw internal/private and share-forbidden; no numeric confidence; no numeric sensitivity; no visibility score
    sensitivityResolution: private_medium; strictest active signal wins; privacy/sensitivity handling only, not severity
    visibilityResolution: rawVectorVisibility: internal_private; privateReportEligibility: eligible_for_private_report_review; publicSummaryEligibility: not_assessed_in_this_stage; shareEligibility: forbidden
    confidenceRole: reflection_revisit evidence preserved qualitatively; confidenceContribution remains interpretive reliability only and is separate from intensity
    intensityRole: qualitative source intensity preserved only; not severity, desirability, importance, maturity, or numeric score
    dominanceControlNotes: broad/high-scope tag present; dominance controlled by source subdimension and primary/secondary role: later_review, feedback_filtering, self_observation_strength
    privateInterpretationBoundary: private/internal signal interpretation only; later_review remains source-bounded by SO_FEEDBACK_OPENNESS; secondarySignals provide context/modifiers only; not user-facing result or report copy
    safetyBoundary: raw option vector private/internal only; share-forbidden; no diagnosis; no therapy/treatment inference; no result taxonomy leakage; no implementation leakage; no commercial recommendation pressure; no maturity/superiority framing; no fixed identity; no insight ranking; no coachability framing; no compliance framing; no defensiveness/openness judgment
    applicationStatus: needs_human_review_sensitive

Batch audit:
- batchAudit: Batch C Q081–Q120 processed only as a 200-option non-numeric option vector application draft. Required fields are present for all vectors. No Q001–Q080 reprocessing, no full 120Q vectors, no numeric scoring, no formulas, no code, no result taxonomy, no result names, no result copy, no report copy, no public output, and no launch action are included.
- safetyAudit: Batch C RP/BD/SO materials are handled as private/internal raw vectors. Recovery signals preserve no therapy framing, no wellness prescription, no self-care quality judgment, and no health-status inference. Boundary and role signals preserve no good/bad boundary framing, no work/family/duty/role-performance judgment, and no role damage framing. Self-observation, pattern, and feedback signals preserve no maturity/superiority framing, no fixed identity, no result taxonomy, no coachability/compliance framing, and no feedback-openness judgment.
- visibilityAudit: All raw vectors use rawVectorVisibility: internal_private, publicSummaryEligibility: not_assessed_in_this_stage, and shareEligibility: forbidden. public_summary_allowed_broad_only is not used as a raw option-vector default. private_report_only/privateReportEligibility does not equal share permission.
- sensitivityAudit: Strictest-signal handling applied. private_medium/private_high RP/BD/SO vectors are routed through needsReviewItems. private_medium/private_high mean privacy and sensitivity handling only, not severity, pathology, danger, or importance.
- signalTagAudit: Approved signal tags only. Unknown signal tags: none. Missing required fields: none. Batch C uses approved RP, BD, and SO signal families with controlled cross-family modifiers.
- protocolComplianceAudit: All required optionVector fields are present: optionVectorId, questionId, dimensionCode, subdimensionCode, variantType, optionId, sourceOptionText, primarySignal, secondarySignals, primarySignalRole, secondarySignalRoles, nativeFamilyContext, crossFamilyModifiers, sourceContextContentAxis, evidenceRoleAxes, contentAxes, controlAxes, sensitivityResolution, visibilityResolution, confidenceRole, intensityRole, dominanceControlNotes, privateInterpretationBoundary, safetyBoundary, and applicationStatus. No truncation markers or placeholders are used.
- crossFamilyModifierSummary:
  - Q081_E_NON_NUMERIC_VECTOR: schedule_reframe in RP_RECOVERY_NEED
  - Q082_A_NON_NUMERIC_VECTOR: quiet_reset_need in RP_RECOVERY_NEED
  - Q082_E_NON_NUMERIC_VECTOR: schedule_reframe in RP_RECOVERY_NEED
  - Q083_A_NON_NUMERIC_VECTOR: quiet_reset_need in RP_RECOVERY_NEED
  - Q083_C_NON_NUMERIC_VECTOR: returnable_distance in RP_RECOVERY_NEED
  - Q083_D_NON_NUMERIC_VECTOR: load_externalization in RP_RECOVERY_NEED
  - Q083_E_NON_NUMERIC_VECTOR: transition_reentry in RP_RECOVERY_NEED
  - Q084_A_NON_NUMERIC_VECTOR: restart_by_micro_step in RP_RECOVERY_NEED
  - Q084_B_NON_NUMERIC_VECTOR: response_timing_buffer in RP_RECOVERY_NEED
  - Q084_C_NON_NUMERIC_VECTOR: quiet_reset_need in RP_RECOVERY_NEED
  - Q085_A_NON_NUMERIC_VECTOR: quiet_reset_need in RP_RECOVERY_NEED
  - Q085_C_NON_NUMERIC_VECTOR: load_externalization in RP_RECOVERY_NEED
  - Q085_E_NON_NUMERIC_VECTOR: schedule_reframe in RP_RECOVERY_NEED
  - Q087_A_NON_NUMERIC_VECTOR: small_start in RP_RESTORATION_TRIGGER
  - Q087_E_NON_NUMERIC_VECTOR: schedule_reframe in RP_RESTORATION_TRIGGER
  - Q088_A_NON_NUMERIC_VECTOR: quiet_reset_need in RP_RESTORATION_TRIGGER
  - Q088_C_NON_NUMERIC_VECTOR: transition_buffer in RP_RESTORATION_TRIGGER
  - Q088_D_NON_NUMERIC_VECTOR: returnable_distance in RP_RESTORATION_TRIGGER
  - Q088_E_NON_NUMERIC_VECTOR: delayed_notice in RP_RESTORATION_TRIGGER
  - Q089_E_NON_NUMERIC_VECTOR: schedule_reframe in RP_RESTORATION_TRIGGER
  - Q090_D_NON_NUMERIC_VECTOR: schedule_reframe in RP_RESTORATION_TRIGGER
  - Q090_E_NON_NUMERIC_VECTOR: response_timing_buffer in RP_RESTORATION_TRIGGER
  - Q091_D_NON_NUMERIC_VECTOR: social_modulation in BD_TAKING_ON_TOO_MUCH
  - Q091_E_NON_NUMERIC_VECTOR: delayed_notice in BD_TAKING_ON_TOO_MUCH
  - Q092_D_NON_NUMERIC_VECTOR: social_load_residue in BD_TAKING_ON_TOO_MUCH
  - Q093_E_NON_NUMERIC_VECTOR: recovery_margin_need in BD_TAKING_ON_TOO_MUCH
  - Q094_A_NON_NUMERIC_VECTOR: schedule_reframe in BD_TAKING_ON_TOO_MUCH
  - Q094_D_NON_NUMERIC_VECTOR: load_externalization in BD_TAKING_ON_TOO_MUCH
  - Q094_E_NON_NUMERIC_VECTOR: later_review in BD_TAKING_ON_TOO_MUCH
  - Q095_A_NON_NUMERIC_VECTOR: tension_pressure in BD_TAKING_ON_TOO_MUCH
  - Q095_B_NON_NUMERIC_VECTOR: social_load_residue in BD_TAKING_ON_TOO_MUCH
  - Q095_D_NON_NUMERIC_VECTOR: reply_pressure in BD_TAKING_ON_TOO_MUCH
  - Q095_E_NON_NUMERIC_VECTOR: delayed_notice in BD_TAKING_ON_TOO_MUCH
  - Q096_A_NON_NUMERIC_VECTOR: reply_pressure in BD_HOLDING_RESPONSE
  - Q096_D_NON_NUMERIC_VECTOR: social_modulation in BD_HOLDING_RESPONSE
  - Q097_C_NON_NUMERIC_VECTOR: social_modulation in BD_HOLDING_RESPONSE
  - Q097_E_NON_NUMERIC_VECTOR: partial_reasoning in BD_HOLDING_RESPONSE
  - Q098_A_NON_NUMERIC_VECTOR: reply_pressure in BD_HOLDING_RESPONSE
  - Q098_B_NON_NUMERIC_VECTOR: partial_reasoning in BD_HOLDING_RESPONSE
  - Q098_D_NON_NUMERIC_VECTOR: returnable_distance in BD_HOLDING_RESPONSE
  - Q099_D_NON_NUMERIC_VECTOR: partial_reasoning in BD_HOLDING_RESPONSE
  - Q099_E_NON_NUMERIC_VECTOR: recovery_margin_need in BD_HOLDING_RESPONSE
  - Q100_B_NON_NUMERIC_VECTOR: social_modulation in BD_HOLDING_RESPONSE
  - Q100_D_NON_NUMERIC_VECTOR: partial_reasoning in BD_HOLDING_RESPONSE
  - Q102_D_NON_NUMERIC_VECTOR: later_review in BD_ROLE_DISTANCE
  - Q103_D_NON_NUMERIC_VECTOR: social_modulation in BD_ROLE_DISTANCE
  - Q103_E_NON_NUMERIC_VECTOR: recovery_margin_need in BD_ROLE_DISTANCE
  - Q104_A_NON_NUMERIC_VECTOR: quiet_reset_need in BD_ROLE_DISTANCE
  - Q104_B_NON_NUMERIC_VECTOR: routine_anchor in BD_ROLE_DISTANCE
  - Q104_C_NON_NUMERIC_VECTOR: reset_by_social_contact in BD_ROLE_DISTANCE
  - Q104_E_NON_NUMERIC_VECTOR: schedule_reframe in BD_ROLE_DISTANCE
  - Q106_B_NON_NUMERIC_VECTOR: response_pause in SO_NOTICING_STATE
  - Q106_C_NON_NUMERIC_VECTOR: quiet_reset_need in SO_NOTICING_STATE
  - Q106_D_NON_NUMERIC_VECTOR: load_externalization in SO_NOTICING_STATE
  - Q106_E_NON_NUMERIC_VECTOR: schedule_reframe in SO_NOTICING_STATE
  - Q107_B_NON_NUMERIC_VECTOR: schedule_reframe in SO_NOTICING_STATE
  - Q107_C_NON_NUMERIC_VECTOR: social_input_sensitive in SO_NOTICING_STATE
  - Q108_D_NON_NUMERIC_VECTOR: quiet_reset_need in SO_NOTICING_STATE
  - Q108_E_NON_NUMERIC_VECTOR: boundary_awareness in SO_NOTICING_STATE
  - Q109_A_NON_NUMERIC_VECTOR: small_start in SO_NOTICING_STATE
  - Q109_B_NON_NUMERIC_VECTOR: schedule_reframe in SO_NOTICING_STATE
  - Q109_C_NON_NUMERIC_VECTOR: response_timing_buffer in SO_NOTICING_STATE
  - Q109_D_NON_NUMERIC_VECTOR: method_shift in SO_NOTICING_STATE
  - Q109_E_NON_NUMERIC_VECTOR: schedule_reframe in SO_NOTICING_STATE
  - Q110_A_NON_NUMERIC_VECTOR: quiet_reset_need in SO_NOTICING_STATE
  - Q110_B_NON_NUMERIC_VECTOR: load_externalization in SO_NOTICING_STATE
  - Q110_C_NON_NUMERIC_VECTOR: load_externalization in SO_NOTICING_STATE
  - Q110_D_NON_NUMERIC_VECTOR: post_event_residue in SO_NOTICING_STATE
  - Q111_B_NON_NUMERIC_VECTOR: social_load_residue in SO_NAMING_PATTERN
  - Q111_C_NON_NUMERIC_VECTOR: criteria_awareness in SO_NAMING_PATTERN
  - Q111_D_NON_NUMERIC_VECTOR: scope_expansion in SO_NAMING_PATTERN
  - Q111_E_NON_NUMERIC_VECTOR: restart_by_micro_step in SO_NAMING_PATTERN
  - Q112_A_NON_NUMERIC_VECTOR: scope_expansion in SO_NAMING_PATTERN
  - Q112_B_NON_NUMERIC_VECTOR: scope_expansion in SO_NAMING_PATTERN
  - Q112_D_NON_NUMERIC_VECTOR: social_modulation in SO_NAMING_PATTERN
  - Q112_E_NON_NUMERIC_VECTOR: restoration_cue in SO_NAMING_PATTERN
  - Q113_A_NON_NUMERIC_VECTOR: reply_pressure in SO_NAMING_PATTERN
  - Q113_B_NON_NUMERIC_VECTOR: role_load in SO_NAMING_PATTERN
  - Q113_C_NON_NUMERIC_VECTOR: atmosphere_reading in SO_NAMING_PATTERN
  - Q113_E_NON_NUMERIC_VECTOR: scope_expansion in SO_NAMING_PATTERN
  - Q114_B_NON_NUMERIC_VECTOR: schedule_reframe in SO_NAMING_PATTERN
  - Q114_C_NON_NUMERIC_VECTOR: partial_reasoning in SO_NAMING_PATTERN
  - Q114_E_NON_NUMERIC_VECTOR: method_shift in SO_NAMING_PATTERN
  - Q115_C_NON_NUMERIC_VECTOR: social_modulation in SO_NAMING_PATTERN
  - Q115_E_NON_NUMERIC_VECTOR: method_shift in SO_NAMING_PATTERN
  - Q116_B_NON_NUMERIC_VECTOR: criteria_awareness in SO_FEEDBACK_OPENNESS
  - Q116_C_NON_NUMERIC_VECTOR: social_input_sensitive in SO_FEEDBACK_OPENNESS
  - Q116_D_NON_NUMERIC_VECTOR: partial_reasoning in SO_FEEDBACK_OPENNESS
  - Q117_A_NON_NUMERIC_VECTOR: partial_reasoning in SO_FEEDBACK_OPENNESS
  - Q117_C_NON_NUMERIC_VECTOR: response_timing_buffer in SO_FEEDBACK_OPENNESS
  - Q117_E_NON_NUMERIC_VECTOR: boundary_awareness in SO_FEEDBACK_OPENNESS
  - Q118_A_NON_NUMERIC_VECTOR: social_load_residue in SO_FEEDBACK_OPENNESS
  - Q118_B_NON_NUMERIC_VECTOR: returnable_distance in SO_FEEDBACK_OPENNESS
  - Q118_C_NON_NUMERIC_VECTOR: role_load in SO_FEEDBACK_OPENNESS
  - Q118_E_NON_NUMERIC_VECTOR: social_modulation in SO_FEEDBACK_OPENNESS
  - Q119_C_NON_NUMERIC_VECTOR: criteria_awareness in SO_FEEDBACK_OPENNESS
  - Q119_D_NON_NUMERIC_VECTOR: response_pause in SO_FEEDBACK_OPENNESS
  - Q119_E_NON_NUMERIC_VECTOR: quiet_reset_need in SO_FEEDBACK_OPENNESS
  - Q120_D_NON_NUMERIC_VECTOR: criteria_awareness in SO_FEEDBACK_OPENNESS
- broadTagSummary:
  - boundary_awareness: Q081_B_NON_NUMERIC_VECTOR, Q085_E_NON_NUMERIC_VECTOR, Q088_C_NON_NUMERIC_VECTOR, Q089_C_NON_NUMERIC_VECTOR, Q090_C_NON_NUMERIC_VECTOR, Q091_A_NON_NUMERIC_VECTOR, Q091_E_NON_NUMERIC_VECTOR, Q092_B_NON_NUMERIC_VECTOR, Q092_C_NON_NUMERIC_VECTOR, Q093_C_NON_NUMERIC_VECTOR, Q094_A_NON_NUMERIC_VECTOR, Q094_B_NON_NUMERIC_VECTOR, Q094_C_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q095_E_NON_NUMERIC_VECTOR, Q097_A_NON_NUMERIC_VECTOR, Q097_E_NON_NUMERIC_VECTOR, Q099_B_NON_NUMERIC_VECTOR, Q099_D_NON_NUMERIC_VECTOR, Q100_A_NON_NUMERIC_VECTOR, Q100_E_NON_NUMERIC_VECTOR, Q102_E_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q105_E_NON_NUMERIC_VECTOR, Q108_E_NON_NUMERIC_VECTOR, Q109_A_NON_NUMERIC_VECTOR, Q109_E_NON_NUMERIC_VECTOR, Q111_D_NON_NUMERIC_VECTOR, Q111_E_NON_NUMERIC_VECTOR, Q117_D_NON_NUMERIC_VECTOR, Q117_E_NON_NUMERIC_VECTOR, Q119_A_NON_NUMERIC_VECTOR, Q119_C_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR
  - feedback_filtering: Q106_B_NON_NUMERIC_VECTOR, Q110_B_NON_NUMERIC_VECTOR, Q113_A_NON_NUMERIC_VECTOR, Q114_C_NON_NUMERIC_VECTOR, Q115_E_NON_NUMERIC_VECTOR, Q116_A_NON_NUMERIC_VECTOR, Q116_B_NON_NUMERIC_VECTOR, Q116_C_NON_NUMERIC_VECTOR, Q116_D_NON_NUMERIC_VECTOR, Q116_E_NON_NUMERIC_VECTOR, Q117_A_NON_NUMERIC_VECTOR, Q117_B_NON_NUMERIC_VECTOR, Q117_C_NON_NUMERIC_VECTOR, Q117_D_NON_NUMERIC_VECTOR, Q117_E_NON_NUMERIC_VECTOR, Q118_A_NON_NUMERIC_VECTOR, Q118_B_NON_NUMERIC_VECTOR, Q118_C_NON_NUMERIC_VECTOR, Q118_D_NON_NUMERIC_VECTOR, Q118_E_NON_NUMERIC_VECTOR, Q119_A_NON_NUMERIC_VECTOR, Q119_B_NON_NUMERIC_VECTOR, Q119_C_NON_NUMERIC_VECTOR, Q119_D_NON_NUMERIC_VECTOR, Q119_E_NON_NUMERIC_VECTOR, Q120_A_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR, Q120_C_NON_NUMERIC_VECTOR, Q120_D_NON_NUMERIC_VECTOR, Q120_E_NON_NUMERIC_VECTOR
  - later_review: Q082_E_NON_NUMERIC_VECTOR, Q084_E_NON_NUMERIC_VECTOR, Q085_A_NON_NUMERIC_VECTOR, Q085_B_NON_NUMERIC_VECTOR, Q085_C_NON_NUMERIC_VECTOR, Q085_D_NON_NUMERIC_VECTOR, Q085_E_NON_NUMERIC_VECTOR, Q088_E_NON_NUMERIC_VECTOR, Q090_A_NON_NUMERIC_VECTOR, Q090_B_NON_NUMERIC_VECTOR, Q090_C_NON_NUMERIC_VECTOR, Q090_D_NON_NUMERIC_VECTOR, Q090_E_NON_NUMERIC_VECTOR, Q091_E_NON_NUMERIC_VECTOR, Q094_A_NON_NUMERIC_VECTOR, Q094_E_NON_NUMERIC_VECTOR, Q095_A_NON_NUMERIC_VECTOR, Q095_B_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q095_D_NON_NUMERIC_VECTOR, Q095_E_NON_NUMERIC_VECTOR, Q097_D_NON_NUMERIC_VECTOR, Q099_D_NON_NUMERIC_VECTOR, Q100_A_NON_NUMERIC_VECTOR, Q100_B_NON_NUMERIC_VECTOR, Q100_C_NON_NUMERIC_VECTOR, Q100_D_NON_NUMERIC_VECTOR, Q100_E_NON_NUMERIC_VECTOR, Q101_D_NON_NUMERIC_VECTOR, Q101_E_NON_NUMERIC_VECTOR, Q102_D_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q105_B_NON_NUMERIC_VECTOR, Q105_C_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR, Q105_E_NON_NUMERIC_VECTOR, Q107_A_NON_NUMERIC_VECTOR, Q107_B_NON_NUMERIC_VECTOR, Q107_C_NON_NUMERIC_VECTOR, Q107_D_NON_NUMERIC_VECTOR, Q107_E_NON_NUMERIC_VECTOR, Q108_A_NON_NUMERIC_VECTOR, Q108_B_NON_NUMERIC_VECTOR, Q108_C_NON_NUMERIC_VECTOR, Q108_D_NON_NUMERIC_VECTOR, Q108_E_NON_NUMERIC_VECTOR, Q109_E_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q110_B_NON_NUMERIC_VECTOR, Q110_C_NON_NUMERIC_VECTOR, Q110_D_NON_NUMERIC_VECTOR, Q110_E_NON_NUMERIC_VECTOR, Q111_B_NON_NUMERIC_VECTOR, Q111_D_NON_NUMERIC_VECTOR, Q112_B_NON_NUMERIC_VECTOR, Q113_D_NON_NUMERIC_VECTOR, Q114_D_NON_NUMERIC_VECTOR, Q114_E_NON_NUMERIC_VECTOR, Q115_A_NON_NUMERIC_VECTOR, Q115_B_NON_NUMERIC_VECTOR, Q115_C_NON_NUMERIC_VECTOR, Q115_D_NON_NUMERIC_VECTOR, Q116_E_NON_NUMERIC_VECTOR, Q117_B_NON_NUMERIC_VECTOR, Q118_A_NON_NUMERIC_VECTOR, Q119_B_NON_NUMERIC_VECTOR, Q119_D_NON_NUMERIC_VECTOR, Q120_A_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR, Q120_C_NON_NUMERIC_VECTOR, Q120_D_NON_NUMERIC_VECTOR, Q120_E_NON_NUMERIC_VECTOR
  - partial_reasoning: Q097_E_NON_NUMERIC_VECTOR, Q098_B_NON_NUMERIC_VECTOR, Q099_D_NON_NUMERIC_VECTOR, Q100_D_NON_NUMERIC_VECTOR, Q114_C_NON_NUMERIC_VECTOR, Q116_D_NON_NUMERIC_VECTOR, Q117_A_NON_NUMERIC_VECTOR
  - pattern_naming: Q111_A_NON_NUMERIC_VECTOR, Q111_B_NON_NUMERIC_VECTOR, Q111_C_NON_NUMERIC_VECTOR, Q111_D_NON_NUMERIC_VECTOR, Q111_E_NON_NUMERIC_VECTOR, Q112_A_NON_NUMERIC_VECTOR, Q112_B_NON_NUMERIC_VECTOR, Q112_C_NON_NUMERIC_VECTOR, Q112_D_NON_NUMERIC_VECTOR, Q112_E_NON_NUMERIC_VECTOR, Q113_A_NON_NUMERIC_VECTOR, Q113_B_NON_NUMERIC_VECTOR, Q113_C_NON_NUMERIC_VECTOR, Q113_D_NON_NUMERIC_VECTOR, Q113_E_NON_NUMERIC_VECTOR, Q114_A_NON_NUMERIC_VECTOR, Q114_B_NON_NUMERIC_VECTOR, Q114_C_NON_NUMERIC_VECTOR, Q114_D_NON_NUMERIC_VECTOR, Q114_E_NON_NUMERIC_VECTOR, Q115_A_NON_NUMERIC_VECTOR, Q115_B_NON_NUMERIC_VECTOR, Q115_C_NON_NUMERIC_VECTOR, Q115_D_NON_NUMERIC_VECTOR, Q115_E_NON_NUMERIC_VECTOR
  - quiet_reset_need: Q082_A_NON_NUMERIC_VECTOR, Q083_A_NON_NUMERIC_VECTOR, Q084_C_NON_NUMERIC_VECTOR, Q085_A_NON_NUMERIC_VECTOR, Q088_A_NON_NUMERIC_VECTOR, Q104_A_NON_NUMERIC_VECTOR, Q106_C_NON_NUMERIC_VECTOR, Q108_D_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q119_E_NON_NUMERIC_VECTOR
  - recovery_margin_need: Q081_C_NON_NUMERIC_VECTOR, Q081_E_NON_NUMERIC_VECTOR, Q082_A_NON_NUMERIC_VECTOR, Q082_B_NON_NUMERIC_VECTOR, Q082_C_NON_NUMERIC_VECTOR, Q082_D_NON_NUMERIC_VECTOR, Q082_E_NON_NUMERIC_VECTOR, Q084_E_NON_NUMERIC_VECTOR, Q085_A_NON_NUMERIC_VECTOR, Q085_B_NON_NUMERIC_VECTOR, Q086_A_NON_NUMERIC_VECTOR, Q086_D_NON_NUMERIC_VECTOR, Q087_A_NON_NUMERIC_VECTOR, Q087_B_NON_NUMERIC_VECTOR, Q087_C_NON_NUMERIC_VECTOR, Q087_D_NON_NUMERIC_VECTOR, Q087_E_NON_NUMERIC_VECTOR, Q088_B_NON_NUMERIC_VECTOR, Q089_A_NON_NUMERIC_VECTOR, Q089_B_NON_NUMERIC_VECTOR, Q089_E_NON_NUMERIC_VECTOR, Q090_B_NON_NUMERIC_VECTOR, Q093_E_NON_NUMERIC_VECTOR, Q099_E_NON_NUMERIC_VECTOR, Q101_B_NON_NUMERIC_VECTOR, Q103_C_NON_NUMERIC_VECTOR, Q103_E_NON_NUMERIC_VECTOR, Q104_E_NON_NUMERIC_VECTOR, Q106_C_NON_NUMERIC_VECTOR, Q109_E_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q112_E_NON_NUMERIC_VECTOR, Q114_B_NON_NUMERIC_VECTOR, Q120_A_NON_NUMERIC_VECTOR
  - response_timing_buffer: Q084_B_NON_NUMERIC_VECTOR, Q090_E_NON_NUMERIC_VECTOR, Q094_B_NON_NUMERIC_VECTOR, Q095_D_NON_NUMERIC_VECTOR, Q096_C_NON_NUMERIC_VECTOR, Q096_E_NON_NUMERIC_VECTOR, Q097_D_NON_NUMERIC_VECTOR, Q098_B_NON_NUMERIC_VECTOR, Q099_B_NON_NUMERIC_VECTOR, Q099_C_NON_NUMERIC_VECTOR, Q100_D_NON_NUMERIC_VECTOR, Q100_E_NON_NUMERIC_VECTOR, Q104_D_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR, Q109_C_NON_NUMERIC_VECTOR, Q117_C_NON_NUMERIC_VECTOR
  - returnable_distance: Q081_A_NON_NUMERIC_VECTOR, Q083_A_NON_NUMERIC_VECTOR, Q083_C_NON_NUMERIC_VECTOR, Q085_A_NON_NUMERIC_VECTOR, Q088_A_NON_NUMERIC_VECTOR, Q088_D_NON_NUMERIC_VECTOR, Q089_B_NON_NUMERIC_VECTOR, Q093_C_NON_NUMERIC_VECTOR, Q098_D_NON_NUMERIC_VECTOR, Q101_E_NON_NUMERIC_VECTOR, Q103_A_NON_NUMERIC_VECTOR, Q104_A_NON_NUMERIC_VECTOR, Q106_C_NON_NUMERIC_VECTOR, Q108_D_NON_NUMERIC_VECTOR, Q113_D_NON_NUMERIC_VECTOR, Q118_B_NON_NUMERIC_VECTOR, Q119_E_NON_NUMERIC_VECTOR
  - role_aftereffect: Q101_E_NON_NUMERIC_VECTOR, Q104_D_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR
  - role_load: Q093_B_NON_NUMERIC_VECTOR, Q098_C_NON_NUMERIC_VECTOR, Q101_A_NON_NUMERIC_VECTOR, Q101_B_NON_NUMERIC_VECTOR, Q101_C_NON_NUMERIC_VECTOR, Q101_D_NON_NUMERIC_VECTOR, Q101_E_NON_NUMERIC_VECTOR, Q102_A_NON_NUMERIC_VECTOR, Q102_B_NON_NUMERIC_VECTOR, Q102_C_NON_NUMERIC_VECTOR, Q102_E_NON_NUMERIC_VECTOR, Q103_A_NON_NUMERIC_VECTOR, Q103_B_NON_NUMERIC_VECTOR, Q103_C_NON_NUMERIC_VECTOR, Q104_C_NON_NUMERIC_VECTOR, Q105_C_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR, Q113_B_NON_NUMERIC_VECTOR, Q118_C_NON_NUMERIC_VECTOR
  - schedule_reframe: Q081_E_NON_NUMERIC_VECTOR, Q082_B_NON_NUMERIC_VECTOR, Q082_E_NON_NUMERIC_VECTOR, Q083_E_NON_NUMERIC_VECTOR, Q084_E_NON_NUMERIC_VECTOR, Q085_E_NON_NUMERIC_VECTOR, Q087_E_NON_NUMERIC_VECTOR, Q089_E_NON_NUMERIC_VECTOR, Q090_D_NON_NUMERIC_VECTOR, Q094_A_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q100_C_NON_NUMERIC_VECTOR, Q104_E_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q106_E_NON_NUMERIC_VECTOR, Q107_B_NON_NUMERIC_VECTOR, Q109_B_NON_NUMERIC_VECTOR, Q109_E_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q114_B_NON_NUMERIC_VECTOR
  - scope_expansion: Q091_B_NON_NUMERIC_VECTOR, Q092_A_NON_NUMERIC_VECTOR, Q092_C_NON_NUMERIC_VECTOR, Q093_A_NON_NUMERIC_VECTOR, Q093_D_NON_NUMERIC_VECTOR, Q094_C_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q098_E_NON_NUMERIC_VECTOR, Q100_C_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q105_B_NON_NUMERIC_VECTOR, Q111_D_NON_NUMERIC_VECTOR, Q112_A_NON_NUMERIC_VECTOR, Q112_B_NON_NUMERIC_VECTOR, Q113_E_NON_NUMERIC_VECTOR
  - self_observation_strength: Q085_A_NON_NUMERIC_VECTOR, Q085_B_NON_NUMERIC_VECTOR, Q085_C_NON_NUMERIC_VECTOR, Q085_D_NON_NUMERIC_VECTOR, Q085_E_NON_NUMERIC_VECTOR, Q090_A_NON_NUMERIC_VECTOR, Q090_B_NON_NUMERIC_VECTOR, Q090_C_NON_NUMERIC_VECTOR, Q090_D_NON_NUMERIC_VECTOR, Q090_E_NON_NUMERIC_VECTOR, Q095_A_NON_NUMERIC_VECTOR, Q095_B_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q095_D_NON_NUMERIC_VECTOR, Q095_E_NON_NUMERIC_VECTOR, Q100_A_NON_NUMERIC_VECTOR, Q100_B_NON_NUMERIC_VECTOR, Q100_C_NON_NUMERIC_VECTOR, Q100_D_NON_NUMERIC_VECTOR, Q100_E_NON_NUMERIC_VECTOR, Q105_B_NON_NUMERIC_VECTOR, Q105_C_NON_NUMERIC_VECTOR, Q105_E_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q110_B_NON_NUMERIC_VECTOR, Q110_C_NON_NUMERIC_VECTOR, Q110_D_NON_NUMERIC_VECTOR, Q110_E_NON_NUMERIC_VECTOR, Q115_A_NON_NUMERIC_VECTOR, Q115_B_NON_NUMERIC_VECTOR, Q115_C_NON_NUMERIC_VECTOR, Q115_D_NON_NUMERIC_VECTOR, Q120_A_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR, Q120_C_NON_NUMERIC_VECTOR, Q120_D_NON_NUMERIC_VECTOR, Q120_E_NON_NUMERIC_VECTOR
  - social_load_residue: Q092_D_NON_NUMERIC_VECTOR, Q095_B_NON_NUMERIC_VECTOR, Q111_B_NON_NUMERIC_VECTOR, Q118_A_NON_NUMERIC_VECTOR
  - social_modulation: Q081_A_NON_NUMERIC_VECTOR, Q081_C_NON_NUMERIC_VECTOR, Q081_D_NON_NUMERIC_VECTOR, Q082_D_NON_NUMERIC_VECTOR, Q083_A_NON_NUMERIC_VECTOR, Q083_B_NON_NUMERIC_VECTOR, Q083_C_NON_NUMERIC_VECTOR, Q083_D_NON_NUMERIC_VECTOR, Q083_E_NON_NUMERIC_VECTOR, Q085_D_NON_NUMERIC_VECTOR, Q086_A_NON_NUMERIC_VECTOR, Q086_E_NON_NUMERIC_VECTOR, Q087_B_NON_NUMERIC_VECTOR, Q088_A_NON_NUMERIC_VECTOR, Q088_B_NON_NUMERIC_VECTOR, Q088_C_NON_NUMERIC_VECTOR, Q088_D_NON_NUMERIC_VECTOR, Q088_E_NON_NUMERIC_VECTOR, Q089_B_NON_NUMERIC_VECTOR, Q089_D_NON_NUMERIC_VECTOR, Q090_A_NON_NUMERIC_VECTOR, Q091_B_NON_NUMERIC_VECTOR, Q091_D_NON_NUMERIC_VECTOR, Q092_A_NON_NUMERIC_VECTOR, Q092_D_NON_NUMERIC_VECTOR, Q093_A_NON_NUMERIC_VECTOR, Q093_B_NON_NUMERIC_VECTOR, Q093_C_NON_NUMERIC_VECTOR, Q093_D_NON_NUMERIC_VECTOR, Q093_E_NON_NUMERIC_VECTOR, Q094_B_NON_NUMERIC_VECTOR, Q094_D_NON_NUMERIC_VECTOR, Q095_A_NON_NUMERIC_VECTOR, Q095_B_NON_NUMERIC_VECTOR, Q096_D_NON_NUMERIC_VECTOR, Q097_A_NON_NUMERIC_VECTOR, Q097_C_NON_NUMERIC_VECTOR, Q098_A_NON_NUMERIC_VECTOR, Q098_B_NON_NUMERIC_VECTOR, Q098_C_NON_NUMERIC_VECTOR, Q098_D_NON_NUMERIC_VECTOR, Q098_E_NON_NUMERIC_VECTOR, Q099_E_NON_NUMERIC_VECTOR, Q100_B_NON_NUMERIC_VECTOR, Q100_D_NON_NUMERIC_VECTOR, Q101_A_NON_NUMERIC_VECTOR, Q101_B_NON_NUMERIC_VECTOR, Q101_C_NON_NUMERIC_VECTOR, Q101_D_NON_NUMERIC_VECTOR, Q101_E_NON_NUMERIC_VECTOR, Q102_A_NON_NUMERIC_VECTOR, Q102_B_NON_NUMERIC_VECTOR, Q102_C_NON_NUMERIC_VECTOR, Q102_E_NON_NUMERIC_VECTOR, Q103_A_NON_NUMERIC_VECTOR, Q103_B_NON_NUMERIC_VECTOR, Q103_C_NON_NUMERIC_VECTOR, Q103_D_NON_NUMERIC_VECTOR, Q103_E_NON_NUMERIC_VECTOR, Q104_C_NON_NUMERIC_VECTOR, Q104_D_NON_NUMERIC_VECTOR, Q105_C_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR, Q106_C_NON_NUMERIC_VECTOR, Q107_C_NON_NUMERIC_VECTOR, Q108_A_NON_NUMERIC_VECTOR, Q108_B_NON_NUMERIC_VECTOR, Q108_C_NON_NUMERIC_VECTOR, Q108_D_NON_NUMERIC_VECTOR, Q108_E_NON_NUMERIC_VECTOR, Q109_C_NON_NUMERIC_VECTOR, Q109_D_NON_NUMERIC_VECTOR, Q110_B_NON_NUMERIC_VECTOR, Q111_B_NON_NUMERIC_VECTOR, Q112_D_NON_NUMERIC_VECTOR, Q113_A_NON_NUMERIC_VECTOR, Q113_B_NON_NUMERIC_VECTOR, Q113_C_NON_NUMERIC_VECTOR, Q113_D_NON_NUMERIC_VECTOR, Q113_E_NON_NUMERIC_VECTOR, Q114_C_NON_NUMERIC_VECTOR, Q115_A_NON_NUMERIC_VECTOR, Q115_C_NON_NUMERIC_VECTOR, Q115_E_NON_NUMERIC_VECTOR, Q116_C_NON_NUMERIC_VECTOR, Q116_E_NON_NUMERIC_VECTOR, Q117_A_NON_NUMERIC_VECTOR, Q118_A_NON_NUMERIC_VECTOR, Q118_B_NON_NUMERIC_VECTOR, Q118_C_NON_NUMERIC_VECTOR, Q118_D_NON_NUMERIC_VECTOR, Q118_E_NON_NUMERIC_VECTOR, Q119_D_NON_NUMERIC_VECTOR, Q119_E_NON_NUMERIC_VECTOR, Q120_D_NON_NUMERIC_VECTOR
  - state_notice: Q082_C_NON_NUMERIC_VECTOR, Q090_B_NON_NUMERIC_VECTOR, Q090_C_NON_NUMERIC_VECTOR, Q092_B_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q099_E_NON_NUMERIC_VECTOR, Q100_C_NON_NUMERIC_VECTOR, Q101_B_NON_NUMERIC_VECTOR, Q101_D_NON_NUMERIC_VECTOR, Q102_B_NON_NUMERIC_VECTOR, Q102_D_NON_NUMERIC_VECTOR, Q103_D_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q105_E_NON_NUMERIC_VECTOR, Q106_A_NON_NUMERIC_VECTOR, Q107_D_NON_NUMERIC_VECTOR, Q108_B_NON_NUMERIC_VECTOR, Q108_C_NON_NUMERIC_VECTOR, Q110_D_NON_NUMERIC_VECTOR, Q110_E_NON_NUMERIC_VECTOR, Q112_C_NON_NUMERIC_VECTOR, Q113_D_NON_NUMERIC_VECTOR, Q115_E_NON_NUMERIC_VECTOR, Q116_B_NON_NUMERIC_VECTOR, Q119_C_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR
- highRiskTagSummary:
  - boundary_awareness: Q081_B_NON_NUMERIC_VECTOR, Q085_E_NON_NUMERIC_VECTOR, Q088_C_NON_NUMERIC_VECTOR, Q089_C_NON_NUMERIC_VECTOR, Q090_C_NON_NUMERIC_VECTOR, Q091_A_NON_NUMERIC_VECTOR, Q091_E_NON_NUMERIC_VECTOR, Q092_B_NON_NUMERIC_VECTOR, Q092_C_NON_NUMERIC_VECTOR, Q093_C_NON_NUMERIC_VECTOR, Q094_A_NON_NUMERIC_VECTOR, Q094_B_NON_NUMERIC_VECTOR, Q094_C_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q095_E_NON_NUMERIC_VECTOR, Q097_A_NON_NUMERIC_VECTOR, Q097_E_NON_NUMERIC_VECTOR, Q099_B_NON_NUMERIC_VECTOR, Q099_D_NON_NUMERIC_VECTOR, Q100_A_NON_NUMERIC_VECTOR, Q100_E_NON_NUMERIC_VECTOR, Q102_E_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q105_E_NON_NUMERIC_VECTOR, Q108_E_NON_NUMERIC_VECTOR, Q109_A_NON_NUMERIC_VECTOR, Q109_E_NON_NUMERIC_VECTOR, Q111_D_NON_NUMERIC_VECTOR, Q111_E_NON_NUMERIC_VECTOR, Q117_D_NON_NUMERIC_VECTOR, Q117_E_NON_NUMERIC_VECTOR, Q119_A_NON_NUMERIC_VECTOR, Q119_C_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR
  - feedback_filtering: Q106_B_NON_NUMERIC_VECTOR, Q110_B_NON_NUMERIC_VECTOR, Q113_A_NON_NUMERIC_VECTOR, Q114_C_NON_NUMERIC_VECTOR, Q115_E_NON_NUMERIC_VECTOR, Q116_A_NON_NUMERIC_VECTOR, Q116_B_NON_NUMERIC_VECTOR, Q116_C_NON_NUMERIC_VECTOR, Q116_D_NON_NUMERIC_VECTOR, Q116_E_NON_NUMERIC_VECTOR, Q117_A_NON_NUMERIC_VECTOR, Q117_B_NON_NUMERIC_VECTOR, Q117_C_NON_NUMERIC_VECTOR, Q117_D_NON_NUMERIC_VECTOR, Q117_E_NON_NUMERIC_VECTOR, Q118_A_NON_NUMERIC_VECTOR, Q118_B_NON_NUMERIC_VECTOR, Q118_C_NON_NUMERIC_VECTOR, Q118_D_NON_NUMERIC_VECTOR, Q118_E_NON_NUMERIC_VECTOR, Q119_A_NON_NUMERIC_VECTOR, Q119_B_NON_NUMERIC_VECTOR, Q119_C_NON_NUMERIC_VECTOR, Q119_D_NON_NUMERIC_VECTOR, Q119_E_NON_NUMERIC_VECTOR, Q120_A_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR, Q120_C_NON_NUMERIC_VECTOR, Q120_D_NON_NUMERIC_VECTOR, Q120_E_NON_NUMERIC_VECTOR
  - pattern_naming: Q111_A_NON_NUMERIC_VECTOR, Q111_B_NON_NUMERIC_VECTOR, Q111_C_NON_NUMERIC_VECTOR, Q111_D_NON_NUMERIC_VECTOR, Q111_E_NON_NUMERIC_VECTOR, Q112_A_NON_NUMERIC_VECTOR, Q112_B_NON_NUMERIC_VECTOR, Q112_C_NON_NUMERIC_VECTOR, Q112_D_NON_NUMERIC_VECTOR, Q112_E_NON_NUMERIC_VECTOR, Q113_A_NON_NUMERIC_VECTOR, Q113_B_NON_NUMERIC_VECTOR, Q113_C_NON_NUMERIC_VECTOR, Q113_D_NON_NUMERIC_VECTOR, Q113_E_NON_NUMERIC_VECTOR, Q114_A_NON_NUMERIC_VECTOR, Q114_B_NON_NUMERIC_VECTOR, Q114_C_NON_NUMERIC_VECTOR, Q114_D_NON_NUMERIC_VECTOR, Q114_E_NON_NUMERIC_VECTOR, Q115_A_NON_NUMERIC_VECTOR, Q115_B_NON_NUMERIC_VECTOR, Q115_C_NON_NUMERIC_VECTOR, Q115_D_NON_NUMERIC_VECTOR, Q115_E_NON_NUMERIC_VECTOR
  - post_event_residue: Q110_D_NON_NUMERIC_VECTOR
  - quiet_reset_need: Q082_A_NON_NUMERIC_VECTOR, Q083_A_NON_NUMERIC_VECTOR, Q084_C_NON_NUMERIC_VECTOR, Q085_A_NON_NUMERIC_VECTOR, Q088_A_NON_NUMERIC_VECTOR, Q104_A_NON_NUMERIC_VECTOR, Q106_C_NON_NUMERIC_VECTOR, Q108_D_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q119_E_NON_NUMERIC_VECTOR
  - recovery_margin_need: Q081_C_NON_NUMERIC_VECTOR, Q081_E_NON_NUMERIC_VECTOR, Q082_A_NON_NUMERIC_VECTOR, Q082_B_NON_NUMERIC_VECTOR, Q082_C_NON_NUMERIC_VECTOR, Q082_D_NON_NUMERIC_VECTOR, Q082_E_NON_NUMERIC_VECTOR, Q084_E_NON_NUMERIC_VECTOR, Q085_A_NON_NUMERIC_VECTOR, Q085_B_NON_NUMERIC_VECTOR, Q086_A_NON_NUMERIC_VECTOR, Q086_D_NON_NUMERIC_VECTOR, Q087_A_NON_NUMERIC_VECTOR, Q087_B_NON_NUMERIC_VECTOR, Q087_C_NON_NUMERIC_VECTOR, Q087_D_NON_NUMERIC_VECTOR, Q087_E_NON_NUMERIC_VECTOR, Q088_B_NON_NUMERIC_VECTOR, Q089_A_NON_NUMERIC_VECTOR, Q089_B_NON_NUMERIC_VECTOR, Q089_E_NON_NUMERIC_VECTOR, Q090_B_NON_NUMERIC_VECTOR, Q093_E_NON_NUMERIC_VECTOR, Q099_E_NON_NUMERIC_VECTOR, Q101_B_NON_NUMERIC_VECTOR, Q103_C_NON_NUMERIC_VECTOR, Q103_E_NON_NUMERIC_VECTOR, Q104_E_NON_NUMERIC_VECTOR, Q106_C_NON_NUMERIC_VECTOR, Q109_E_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q112_E_NON_NUMERIC_VECTOR, Q114_B_NON_NUMERIC_VECTOR, Q120_A_NON_NUMERIC_VECTOR
  - response_timing_buffer: Q084_B_NON_NUMERIC_VECTOR, Q090_E_NON_NUMERIC_VECTOR, Q094_B_NON_NUMERIC_VECTOR, Q095_D_NON_NUMERIC_VECTOR, Q096_C_NON_NUMERIC_VECTOR, Q096_E_NON_NUMERIC_VECTOR, Q097_D_NON_NUMERIC_VECTOR, Q098_B_NON_NUMERIC_VECTOR, Q099_B_NON_NUMERIC_VECTOR, Q099_C_NON_NUMERIC_VECTOR, Q100_D_NON_NUMERIC_VECTOR, Q100_E_NON_NUMERIC_VECTOR, Q104_D_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR, Q109_C_NON_NUMERIC_VECTOR, Q117_C_NON_NUMERIC_VECTOR
  - role_aftereffect: Q101_E_NON_NUMERIC_VECTOR, Q104_D_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR
  - role_distance: Q101_A_NON_NUMERIC_VECTOR, Q101_B_NON_NUMERIC_VECTOR, Q101_C_NON_NUMERIC_VECTOR, Q101_D_NON_NUMERIC_VECTOR, Q102_A_NON_NUMERIC_VECTOR, Q102_B_NON_NUMERIC_VECTOR, Q102_C_NON_NUMERIC_VECTOR, Q102_D_NON_NUMERIC_VECTOR, Q102_E_NON_NUMERIC_VECTOR, Q103_A_NON_NUMERIC_VECTOR, Q103_B_NON_NUMERIC_VECTOR, Q103_C_NON_NUMERIC_VECTOR, Q103_D_NON_NUMERIC_VECTOR, Q103_E_NON_NUMERIC_VECTOR, Q104_A_NON_NUMERIC_VECTOR, Q104_B_NON_NUMERIC_VECTOR, Q104_C_NON_NUMERIC_VECTOR, Q104_E_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q105_B_NON_NUMERIC_VECTOR, Q105_C_NON_NUMERIC_VECTOR, Q105_E_NON_NUMERIC_VECTOR
  - role_load: Q093_B_NON_NUMERIC_VECTOR, Q098_C_NON_NUMERIC_VECTOR, Q101_A_NON_NUMERIC_VECTOR, Q101_B_NON_NUMERIC_VECTOR, Q101_C_NON_NUMERIC_VECTOR, Q101_D_NON_NUMERIC_VECTOR, Q101_E_NON_NUMERIC_VECTOR, Q102_A_NON_NUMERIC_VECTOR, Q102_B_NON_NUMERIC_VECTOR, Q102_C_NON_NUMERIC_VECTOR, Q102_E_NON_NUMERIC_VECTOR, Q103_A_NON_NUMERIC_VECTOR, Q103_B_NON_NUMERIC_VECTOR, Q103_C_NON_NUMERIC_VECTOR, Q104_C_NON_NUMERIC_VECTOR, Q105_C_NON_NUMERIC_VECTOR, Q105_D_NON_NUMERIC_VECTOR, Q113_B_NON_NUMERIC_VECTOR, Q118_C_NON_NUMERIC_VECTOR
  - scope_expansion: Q091_B_NON_NUMERIC_VECTOR, Q092_A_NON_NUMERIC_VECTOR, Q092_C_NON_NUMERIC_VECTOR, Q093_A_NON_NUMERIC_VECTOR, Q093_D_NON_NUMERIC_VECTOR, Q094_C_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q098_E_NON_NUMERIC_VECTOR, Q100_C_NON_NUMERIC_VECTOR, Q105_A_NON_NUMERIC_VECTOR, Q105_B_NON_NUMERIC_VECTOR, Q111_D_NON_NUMERIC_VECTOR, Q112_A_NON_NUMERIC_VECTOR, Q112_B_NON_NUMERIC_VECTOR, Q113_E_NON_NUMERIC_VECTOR
  - self_observation_strength: Q085_A_NON_NUMERIC_VECTOR, Q085_B_NON_NUMERIC_VECTOR, Q085_C_NON_NUMERIC_VECTOR, Q085_D_NON_NUMERIC_VECTOR, Q085_E_NON_NUMERIC_VECTOR, Q090_A_NON_NUMERIC_VECTOR, Q090_B_NON_NUMERIC_VECTOR, Q090_C_NON_NUMERIC_VECTOR, Q090_D_NON_NUMERIC_VECTOR, Q090_E_NON_NUMERIC_VECTOR, Q095_A_NON_NUMERIC_VECTOR, Q095_B_NON_NUMERIC_VECTOR, Q095_C_NON_NUMERIC_VECTOR, Q095_D_NON_NUMERIC_VECTOR, Q095_E_NON_NUMERIC_VECTOR, Q100_A_NON_NUMERIC_VECTOR, Q100_B_NON_NUMERIC_VECTOR, Q100_C_NON_NUMERIC_VECTOR, Q100_D_NON_NUMERIC_VECTOR, Q100_E_NON_NUMERIC_VECTOR, Q105_B_NON_NUMERIC_VECTOR, Q105_C_NON_NUMERIC_VECTOR, Q105_E_NON_NUMERIC_VECTOR, Q110_A_NON_NUMERIC_VECTOR, Q110_B_NON_NUMERIC_VECTOR, Q110_C_NON_NUMERIC_VECTOR, Q110_D_NON_NUMERIC_VECTOR, Q110_E_NON_NUMERIC_VECTOR, Q115_A_NON_NUMERIC_VECTOR, Q115_B_NON_NUMERIC_VECTOR, Q115_C_NON_NUMERIC_VECTOR, Q115_D_NON_NUMERIC_VECTOR, Q120_A_NON_NUMERIC_VECTOR, Q120_B_NON_NUMERIC_VECTOR, Q120_C_NON_NUMERIC_VECTOR, Q120_D_NON_NUMERIC_VECTOR, Q120_E_NON_NUMERIC_VECTOR
  - social_load_residue: Q092_D_NON_NUMERIC_VECTOR, Q095_B_NON_NUMERIC_VECTOR, Q111_B_NON_NUMERIC_VECTOR, Q118_A_NON_NUMERIC_VECTOR
- needsReviewItems:
  - private_high vectors:
    - Q093_B_NON_NUMERIC_VECTOR
    - Q098_C_NON_NUMERIC_VECTOR
    - Q101_A_NON_NUMERIC_VECTOR
    - Q101_B_NON_NUMERIC_VECTOR
    - Q101_C_NON_NUMERIC_VECTOR
    - Q101_D_NON_NUMERIC_VECTOR
    - Q101_E_NON_NUMERIC_VECTOR
    - Q102_A_NON_NUMERIC_VECTOR
    - Q102_B_NON_NUMERIC_VECTOR
    - Q102_C_NON_NUMERIC_VECTOR
    - Q102_E_NON_NUMERIC_VECTOR
    - Q103_A_NON_NUMERIC_VECTOR
    - Q103_B_NON_NUMERIC_VECTOR
    - Q103_C_NON_NUMERIC_VECTOR
    - Q104_C_NON_NUMERIC_VECTOR
    - Q104_D_NON_NUMERIC_VECTOR
    - Q105_C_NON_NUMERIC_VECTOR
    - Q105_D_NON_NUMERIC_VECTOR
    - Q113_B_NON_NUMERIC_VECTOR
    - Q118_C_NON_NUMERIC_VECTOR
  - private_medium RP/BD/SO vectors:
    - Q081_A_NON_NUMERIC_VECTOR
    - Q081_B_NON_NUMERIC_VECTOR
    - Q081_C_NON_NUMERIC_VECTOR
    - Q082_A_NON_NUMERIC_VECTOR
    - Q083_A_NON_NUMERIC_VECTOR
    - Q083_C_NON_NUMERIC_VECTOR
    - Q083_D_NON_NUMERIC_VECTOR
    - Q084_B_NON_NUMERIC_VECTOR
    - Q084_C_NON_NUMERIC_VECTOR
    - Q085_A_NON_NUMERIC_VECTOR
    - Q085_C_NON_NUMERIC_VECTOR
    - Q085_E_NON_NUMERIC_VECTOR
    - Q086_E_NON_NUMERIC_VECTOR
    - Q088_A_NON_NUMERIC_VECTOR
    - Q088_B_NON_NUMERIC_VECTOR
    - Q088_C_NON_NUMERIC_VECTOR
    - Q088_D_NON_NUMERIC_VECTOR
    - Q089_B_NON_NUMERIC_VECTOR
    - Q089_C_NON_NUMERIC_VECTOR
    - Q090_C_NON_NUMERIC_VECTOR
    - Q090_E_NON_NUMERIC_VECTOR
    - Q091_A_NON_NUMERIC_VECTOR
    - Q091_B_NON_NUMERIC_VECTOR
    - Q091_E_NON_NUMERIC_VECTOR
    - Q092_A_NON_NUMERIC_VECTOR
    - Q092_B_NON_NUMERIC_VECTOR
    - Q092_C_NON_NUMERIC_VECTOR
    - Q092_D_NON_NUMERIC_VECTOR
    - Q092_E_NON_NUMERIC_VECTOR
    - Q093_A_NON_NUMERIC_VECTOR
    - Q093_C_NON_NUMERIC_VECTOR
    - Q093_D_NON_NUMERIC_VECTOR
    - Q094_A_NON_NUMERIC_VECTOR
    - Q094_B_NON_NUMERIC_VECTOR
    - Q094_C_NON_NUMERIC_VECTOR
    - Q094_D_NON_NUMERIC_VECTOR
    - Q095_A_NON_NUMERIC_VECTOR
    - Q095_B_NON_NUMERIC_VECTOR
    - Q095_C_NON_NUMERIC_VECTOR
    - Q095_D_NON_NUMERIC_VECTOR
    - Q095_E_NON_NUMERIC_VECTOR
    - Q096_A_NON_NUMERIC_VECTOR
    - Q096_C_NON_NUMERIC_VECTOR
    - Q096_E_NON_NUMERIC_VECTOR
    - Q097_A_NON_NUMERIC_VECTOR
    - Q097_B_NON_NUMERIC_VECTOR
    - Q097_C_NON_NUMERIC_VECTOR
    - Q097_D_NON_NUMERIC_VECTOR
    - Q097_E_NON_NUMERIC_VECTOR
    - Q098_A_NON_NUMERIC_VECTOR
    - Q098_B_NON_NUMERIC_VECTOR
    - Q098_D_NON_NUMERIC_VECTOR
    - Q098_E_NON_NUMERIC_VECTOR
    - Q099_B_NON_NUMERIC_VECTOR
    - Q099_C_NON_NUMERIC_VECTOR
    - Q099_D_NON_NUMERIC_VECTOR
    - Q100_A_NON_NUMERIC_VECTOR
    - Q100_C_NON_NUMERIC_VECTOR
    - Q100_D_NON_NUMERIC_VECTOR
    - Q100_E_NON_NUMERIC_VECTOR
    - Q102_D_NON_NUMERIC_VECTOR
    - Q103_D_NON_NUMERIC_VECTOR
    - Q103_E_NON_NUMERIC_VECTOR
    - Q104_A_NON_NUMERIC_VECTOR
    - Q104_B_NON_NUMERIC_VECTOR
    - Q104_E_NON_NUMERIC_VECTOR
    - Q105_A_NON_NUMERIC_VECTOR
    - Q105_B_NON_NUMERIC_VECTOR
    - Q105_E_NON_NUMERIC_VECTOR
    - Q106_B_NON_NUMERIC_VECTOR
    - Q106_C_NON_NUMERIC_VECTOR
    - Q106_D_NON_NUMERIC_VECTOR
    - Q107_A_NON_NUMERIC_VECTOR
    - Q107_B_NON_NUMERIC_VECTOR
    - Q107_C_NON_NUMERIC_VECTOR
    - Q107_D_NON_NUMERIC_VECTOR
    - Q107_E_NON_NUMERIC_VECTOR
    - Q108_C_NON_NUMERIC_VECTOR
    - Q108_D_NON_NUMERIC_VECTOR
    - Q108_E_NON_NUMERIC_VECTOR
    - Q109_A_NON_NUMERIC_VECTOR
    - Q109_C_NON_NUMERIC_VECTOR
    - Q109_E_NON_NUMERIC_VECTOR
    - Q110_A_NON_NUMERIC_VECTOR
    - Q110_B_NON_NUMERIC_VECTOR
    - Q110_C_NON_NUMERIC_VECTOR
    - Q110_D_NON_NUMERIC_VECTOR
    - Q111_A_NON_NUMERIC_VECTOR
    - Q111_B_NON_NUMERIC_VECTOR
    - Q111_C_NON_NUMERIC_VECTOR
    - Q111_D_NON_NUMERIC_VECTOR
    - Q111_E_NON_NUMERIC_VECTOR
    - Q112_A_NON_NUMERIC_VECTOR
    - Q112_B_NON_NUMERIC_VECTOR
    - Q112_C_NON_NUMERIC_VECTOR
    - Q112_D_NON_NUMERIC_VECTOR
    - Q112_E_NON_NUMERIC_VECTOR
    - Q113_A_NON_NUMERIC_VECTOR
    - Q113_C_NON_NUMERIC_VECTOR
    - Q113_D_NON_NUMERIC_VECTOR
    - Q113_E_NON_NUMERIC_VECTOR
    - Q114_A_NON_NUMERIC_VECTOR
    - Q114_B_NON_NUMERIC_VECTOR
    - Q114_C_NON_NUMERIC_VECTOR
    - Q114_D_NON_NUMERIC_VECTOR
    - Q114_E_NON_NUMERIC_VECTOR
    - Q115_A_NON_NUMERIC_VECTOR
    - Q115_B_NON_NUMERIC_VECTOR
    - Q115_C_NON_NUMERIC_VECTOR
    - Q115_D_NON_NUMERIC_VECTOR
    - Q115_E_NON_NUMERIC_VECTOR
    - Q116_A_NON_NUMERIC_VECTOR
    - Q116_B_NON_NUMERIC_VECTOR
    - Q116_C_NON_NUMERIC_VECTOR
    - Q116_D_NON_NUMERIC_VECTOR
    - Q116_E_NON_NUMERIC_VECTOR
    - Q117_A_NON_NUMERIC_VECTOR
    - Q117_B_NON_NUMERIC_VECTOR
    - Q117_C_NON_NUMERIC_VECTOR
    - Q117_D_NON_NUMERIC_VECTOR
    - Q117_E_NON_NUMERIC_VECTOR
    - Q118_A_NON_NUMERIC_VECTOR
    - Q118_B_NON_NUMERIC_VECTOR
    - Q118_D_NON_NUMERIC_VECTOR
    - Q118_E_NON_NUMERIC_VECTOR
    - Q119_A_NON_NUMERIC_VECTOR
    - Q119_B_NON_NUMERIC_VECTOR
    - Q119_C_NON_NUMERIC_VECTOR
    - Q119_D_NON_NUMERIC_VECTOR
    - Q119_E_NON_NUMERIC_VECTOR
    - Q120_A_NON_NUMERIC_VECTOR
    - Q120_B_NON_NUMERIC_VECTOR
    - Q120_C_NON_NUMERIC_VECTOR
    - Q120_D_NON_NUMERIC_VECTOR
    - Q120_E_NON_NUMERIC_VECTOR
  - role_load vectors:
    - Q093_B_NON_NUMERIC_VECTOR
    - Q098_C_NON_NUMERIC_VECTOR
    - Q101_A_NON_NUMERIC_VECTOR
    - Q101_B_NON_NUMERIC_VECTOR
    - Q101_C_NON_NUMERIC_VECTOR
    - Q101_D_NON_NUMERIC_VECTOR
    - Q101_E_NON_NUMERIC_VECTOR
    - Q102_A_NON_NUMERIC_VECTOR
    - Q102_B_NON_NUMERIC_VECTOR
    - Q102_C_NON_NUMERIC_VECTOR
    - Q102_E_NON_NUMERIC_VECTOR
    - Q103_A_NON_NUMERIC_VECTOR
    - Q103_B_NON_NUMERIC_VECTOR
    - Q103_C_NON_NUMERIC_VECTOR
    - Q104_C_NON_NUMERIC_VECTOR
    - Q105_C_NON_NUMERIC_VECTOR
    - Q105_D_NON_NUMERIC_VECTOR
    - Q113_B_NON_NUMERIC_VECTOR
    - Q118_C_NON_NUMERIC_VECTOR
  - role_aftereffect vectors:
    - Q101_E_NON_NUMERIC_VECTOR
    - Q104_D_NON_NUMERIC_VECTOR
    - Q105_D_NON_NUMERIC_VECTOR
  - role_distance vectors:
    - Q101_A_NON_NUMERIC_VECTOR
    - Q101_B_NON_NUMERIC_VECTOR
    - Q101_C_NON_NUMERIC_VECTOR
    - Q101_D_NON_NUMERIC_VECTOR
    - Q102_A_NON_NUMERIC_VECTOR
    - Q102_B_NON_NUMERIC_VECTOR
    - Q102_C_NON_NUMERIC_VECTOR
    - Q102_D_NON_NUMERIC_VECTOR
    - Q102_E_NON_NUMERIC_VECTOR
    - Q103_A_NON_NUMERIC_VECTOR
    - Q103_B_NON_NUMERIC_VECTOR
    - Q103_C_NON_NUMERIC_VECTOR
    - Q103_D_NON_NUMERIC_VECTOR
    - Q103_E_NON_NUMERIC_VECTOR
    - Q104_A_NON_NUMERIC_VECTOR
    - Q104_B_NON_NUMERIC_VECTOR
    - Q104_C_NON_NUMERIC_VECTOR
    - Q104_E_NON_NUMERIC_VECTOR
    - Q105_A_NON_NUMERIC_VECTOR
    - Q105_B_NON_NUMERIC_VECTOR
    - Q105_C_NON_NUMERIC_VECTOR
    - Q105_E_NON_NUMERIC_VECTOR
  - response_timing_buffer vectors:
    - Q084_B_NON_NUMERIC_VECTOR
    - Q090_E_NON_NUMERIC_VECTOR
    - Q094_B_NON_NUMERIC_VECTOR
    - Q095_D_NON_NUMERIC_VECTOR
    - Q096_C_NON_NUMERIC_VECTOR
    - Q096_E_NON_NUMERIC_VECTOR
    - Q097_D_NON_NUMERIC_VECTOR
    - Q098_B_NON_NUMERIC_VECTOR
    - Q099_B_NON_NUMERIC_VECTOR
    - Q099_C_NON_NUMERIC_VECTOR
    - Q100_D_NON_NUMERIC_VECTOR
    - Q100_E_NON_NUMERIC_VECTOR
    - Q104_D_NON_NUMERIC_VECTOR
    - Q105_D_NON_NUMERIC_VECTOR
    - Q109_C_NON_NUMERIC_VECTOR
    - Q117_C_NON_NUMERIC_VECTOR
  - boundary_awareness broad-tag vectors:
    - Q081_B_NON_NUMERIC_VECTOR
    - Q085_E_NON_NUMERIC_VECTOR
    - Q088_C_NON_NUMERIC_VECTOR
    - Q089_C_NON_NUMERIC_VECTOR
    - Q090_C_NON_NUMERIC_VECTOR
    - Q091_A_NON_NUMERIC_VECTOR
    - Q091_E_NON_NUMERIC_VECTOR
    - Q092_B_NON_NUMERIC_VECTOR
    - Q092_C_NON_NUMERIC_VECTOR
    - Q093_C_NON_NUMERIC_VECTOR
    - Q094_A_NON_NUMERIC_VECTOR
    - Q094_B_NON_NUMERIC_VECTOR
    - Q094_C_NON_NUMERIC_VECTOR
    - Q095_C_NON_NUMERIC_VECTOR
    - Q095_E_NON_NUMERIC_VECTOR
    - Q097_A_NON_NUMERIC_VECTOR
    - Q097_E_NON_NUMERIC_VECTOR
    - Q099_B_NON_NUMERIC_VECTOR
    - Q099_D_NON_NUMERIC_VECTOR
    - Q100_A_NON_NUMERIC_VECTOR
    - Q100_E_NON_NUMERIC_VECTOR
    - Q102_E_NON_NUMERIC_VECTOR
    - Q105_A_NON_NUMERIC_VECTOR
    - Q105_E_NON_NUMERIC_VECTOR
    - Q108_E_NON_NUMERIC_VECTOR
    - Q109_A_NON_NUMERIC_VECTOR
    - Q109_E_NON_NUMERIC_VECTOR
    - Q111_D_NON_NUMERIC_VECTOR
    - Q111_E_NON_NUMERIC_VECTOR
    - Q117_D_NON_NUMERIC_VECTOR
    - Q117_E_NON_NUMERIC_VECTOR
    - Q119_A_NON_NUMERIC_VECTOR
    - Q119_C_NON_NUMERIC_VECTOR
    - Q120_B_NON_NUMERIC_VECTOR
  - recovery_margin_need broad-tag vectors:
    - Q081_C_NON_NUMERIC_VECTOR
    - Q081_E_NON_NUMERIC_VECTOR
    - Q082_A_NON_NUMERIC_VECTOR
    - Q082_B_NON_NUMERIC_VECTOR
    - Q082_C_NON_NUMERIC_VECTOR
    - Q082_D_NON_NUMERIC_VECTOR
    - Q082_E_NON_NUMERIC_VECTOR
    - Q084_E_NON_NUMERIC_VECTOR
    - Q085_A_NON_NUMERIC_VECTOR
    - Q085_B_NON_NUMERIC_VECTOR
    - Q086_A_NON_NUMERIC_VECTOR
    - Q086_D_NON_NUMERIC_VECTOR
    - Q087_A_NON_NUMERIC_VECTOR
    - Q087_B_NON_NUMERIC_VECTOR
    - Q087_C_NON_NUMERIC_VECTOR
    - Q087_D_NON_NUMERIC_VECTOR
    - Q087_E_NON_NUMERIC_VECTOR
    - Q088_B_NON_NUMERIC_VECTOR
    - Q089_A_NON_NUMERIC_VECTOR
    - Q089_B_NON_NUMERIC_VECTOR
    - Q089_E_NON_NUMERIC_VECTOR
    - Q090_B_NON_NUMERIC_VECTOR
    - Q093_E_NON_NUMERIC_VECTOR
    - Q099_E_NON_NUMERIC_VECTOR
    - Q101_B_NON_NUMERIC_VECTOR
    - Q103_C_NON_NUMERIC_VECTOR
    - Q103_E_NON_NUMERIC_VECTOR
    - Q104_E_NON_NUMERIC_VECTOR
    - Q106_C_NON_NUMERIC_VECTOR
    - Q109_E_NON_NUMERIC_VECTOR
    - Q110_A_NON_NUMERIC_VECTOR
    - Q112_E_NON_NUMERIC_VECTOR
    - Q114_B_NON_NUMERIC_VECTOR
    - Q120_A_NON_NUMERIC_VECTOR
  - pattern_naming vectors:
    - Q111_A_NON_NUMERIC_VECTOR
    - Q111_B_NON_NUMERIC_VECTOR
    - Q111_C_NON_NUMERIC_VECTOR
    - Q111_D_NON_NUMERIC_VECTOR
    - Q111_E_NON_NUMERIC_VECTOR
    - Q112_A_NON_NUMERIC_VECTOR
    - Q112_B_NON_NUMERIC_VECTOR
    - Q112_C_NON_NUMERIC_VECTOR
    - Q112_D_NON_NUMERIC_VECTOR
    - Q112_E_NON_NUMERIC_VECTOR
    - Q113_A_NON_NUMERIC_VECTOR
    - Q113_B_NON_NUMERIC_VECTOR
    - Q113_C_NON_NUMERIC_VECTOR
    - Q113_D_NON_NUMERIC_VECTOR
    - Q113_E_NON_NUMERIC_VECTOR
    - Q114_A_NON_NUMERIC_VECTOR
    - Q114_B_NON_NUMERIC_VECTOR
    - Q114_C_NON_NUMERIC_VECTOR
    - Q114_D_NON_NUMERIC_VECTOR
    - Q114_E_NON_NUMERIC_VECTOR
    - Q115_A_NON_NUMERIC_VECTOR
    - Q115_B_NON_NUMERIC_VECTOR
    - Q115_C_NON_NUMERIC_VECTOR
    - Q115_D_NON_NUMERIC_VECTOR
    - Q115_E_NON_NUMERIC_VECTOR
  - feedback_filtering vectors:
    - Q106_B_NON_NUMERIC_VECTOR
    - Q110_B_NON_NUMERIC_VECTOR
    - Q113_A_NON_NUMERIC_VECTOR
    - Q114_C_NON_NUMERIC_VECTOR
    - Q115_E_NON_NUMERIC_VECTOR
    - Q116_A_NON_NUMERIC_VECTOR
    - Q116_B_NON_NUMERIC_VECTOR
    - Q116_C_NON_NUMERIC_VECTOR
    - Q116_D_NON_NUMERIC_VECTOR
    - Q116_E_NON_NUMERIC_VECTOR
    - Q117_A_NON_NUMERIC_VECTOR
    - Q117_B_NON_NUMERIC_VECTOR
    - Q117_C_NON_NUMERIC_VECTOR
    - Q117_D_NON_NUMERIC_VECTOR
    - Q117_E_NON_NUMERIC_VECTOR
    - Q118_A_NON_NUMERIC_VECTOR
    - Q118_B_NON_NUMERIC_VECTOR
    - Q118_C_NON_NUMERIC_VECTOR
    - Q118_D_NON_NUMERIC_VECTOR
    - Q118_E_NON_NUMERIC_VECTOR
    - Q119_A_NON_NUMERIC_VECTOR
    - Q119_B_NON_NUMERIC_VECTOR
    - Q119_C_NON_NUMERIC_VECTOR
    - Q119_D_NON_NUMERIC_VECTOR
    - Q119_E_NON_NUMERIC_VECTOR
    - Q120_A_NON_NUMERIC_VECTOR
    - Q120_B_NON_NUMERIC_VECTOR
    - Q120_C_NON_NUMERIC_VECTOR
    - Q120_D_NON_NUMERIC_VECTOR
    - Q120_E_NON_NUMERIC_VECTOR
  - self_observation_strength vectors:
    - Q085_A_NON_NUMERIC_VECTOR
    - Q085_B_NON_NUMERIC_VECTOR
    - Q085_C_NON_NUMERIC_VECTOR
    - Q085_D_NON_NUMERIC_VECTOR
    - Q085_E_NON_NUMERIC_VECTOR
    - Q090_A_NON_NUMERIC_VECTOR
    - Q090_B_NON_NUMERIC_VECTOR
    - Q090_C_NON_NUMERIC_VECTOR
    - Q090_D_NON_NUMERIC_VECTOR
    - Q090_E_NON_NUMERIC_VECTOR
    - Q095_A_NON_NUMERIC_VECTOR
    - Q095_B_NON_NUMERIC_VECTOR
    - Q095_C_NON_NUMERIC_VECTOR
    - Q095_D_NON_NUMERIC_VECTOR
    - Q095_E_NON_NUMERIC_VECTOR
    - Q100_A_NON_NUMERIC_VECTOR
    - Q100_B_NON_NUMERIC_VECTOR
    - Q100_C_NON_NUMERIC_VECTOR
    - Q100_D_NON_NUMERIC_VECTOR
    - Q100_E_NON_NUMERIC_VECTOR
    - Q105_B_NON_NUMERIC_VECTOR
    - Q105_C_NON_NUMERIC_VECTOR
    - Q105_E_NON_NUMERIC_VECTOR
    - Q110_A_NON_NUMERIC_VECTOR
    - Q110_B_NON_NUMERIC_VECTOR
    - Q110_C_NON_NUMERIC_VECTOR
    - Q110_D_NON_NUMERIC_VECTOR
    - Q110_E_NON_NUMERIC_VECTOR
    - Q115_A_NON_NUMERIC_VECTOR
    - Q115_B_NON_NUMERIC_VECTOR
    - Q115_C_NON_NUMERIC_VECTOR
    - Q115_D_NON_NUMERIC_VECTOR
    - Q120_A_NON_NUMERIC_VECTOR
    - Q120_B_NON_NUMERIC_VECTOR
    - Q120_C_NON_NUMERIC_VECTOR
    - Q120_D_NON_NUMERIC_VECTOR
    - Q120_E_NON_NUMERIC_VECTOR
  - later_review broad-tag vectors:
    - Q082_E_NON_NUMERIC_VECTOR
    - Q084_E_NON_NUMERIC_VECTOR
    - Q085_A_NON_NUMERIC_VECTOR
    - Q085_B_NON_NUMERIC_VECTOR
    - Q085_C_NON_NUMERIC_VECTOR
    - Q085_D_NON_NUMERIC_VECTOR
    - Q085_E_NON_NUMERIC_VECTOR
    - Q088_E_NON_NUMERIC_VECTOR
    - Q090_A_NON_NUMERIC_VECTOR
    - Q090_B_NON_NUMERIC_VECTOR
    - Q090_C_NON_NUMERIC_VECTOR
    - Q090_D_NON_NUMERIC_VECTOR
    - Q090_E_NON_NUMERIC_VECTOR
    - Q091_E_NON_NUMERIC_VECTOR
    - Q094_A_NON_NUMERIC_VECTOR
    - Q094_E_NON_NUMERIC_VECTOR
    - Q095_A_NON_NUMERIC_VECTOR
    - Q095_B_NON_NUMERIC_VECTOR
    - Q095_C_NON_NUMERIC_VECTOR
    - Q095_D_NON_NUMERIC_VECTOR
    - Q095_E_NON_NUMERIC_VECTOR
    - Q097_D_NON_NUMERIC_VECTOR
    - Q099_D_NON_NUMERIC_VECTOR
    - Q100_A_NON_NUMERIC_VECTOR
    - Q100_B_NON_NUMERIC_VECTOR
    - Q100_C_NON_NUMERIC_VECTOR
    - Q100_D_NON_NUMERIC_VECTOR
    - Q100_E_NON_NUMERIC_VECTOR
    - Q101_D_NON_NUMERIC_VECTOR
    - Q101_E_NON_NUMERIC_VECTOR
    - Q102_D_NON_NUMERIC_VECTOR
    - Q105_A_NON_NUMERIC_VECTOR
    - Q105_B_NON_NUMERIC_VECTOR
    - Q105_C_NON_NUMERIC_VECTOR
    - Q105_D_NON_NUMERIC_VECTOR
    - Q105_E_NON_NUMERIC_VECTOR
    - Q107_A_NON_NUMERIC_VECTOR
    - Q107_B_NON_NUMERIC_VECTOR
    - Q107_C_NON_NUMERIC_VECTOR
    - Q107_D_NON_NUMERIC_VECTOR
    - Q107_E_NON_NUMERIC_VECTOR
    - Q108_A_NON_NUMERIC_VECTOR
    - Q108_B_NON_NUMERIC_VECTOR
    - Q108_C_NON_NUMERIC_VECTOR
    - Q108_D_NON_NUMERIC_VECTOR
    - Q108_E_NON_NUMERIC_VECTOR
    - Q109_E_NON_NUMERIC_VECTOR
    - Q110_A_NON_NUMERIC_VECTOR
    - Q110_B_NON_NUMERIC_VECTOR
    - Q110_C_NON_NUMERIC_VECTOR
    - Q110_D_NON_NUMERIC_VECTOR
    - Q110_E_NON_NUMERIC_VECTOR
    - Q111_B_NON_NUMERIC_VECTOR
    - Q111_D_NON_NUMERIC_VECTOR
    - Q112_B_NON_NUMERIC_VECTOR
    - Q113_D_NON_NUMERIC_VECTOR
    - Q114_D_NON_NUMERIC_VECTOR
    - Q114_E_NON_NUMERIC_VECTOR
    - Q115_A_NON_NUMERIC_VECTOR
    - Q115_B_NON_NUMERIC_VECTOR
    - Q115_C_NON_NUMERIC_VECTOR
    - Q115_D_NON_NUMERIC_VECTOR
    - Q116_E_NON_NUMERIC_VECTOR
    - Q117_B_NON_NUMERIC_VECTOR
    - Q118_A_NON_NUMERIC_VECTOR
    - Q119_B_NON_NUMERIC_VECTOR
    - Q119_D_NON_NUMERIC_VECTOR
    - Q120_A_NON_NUMERIC_VECTOR
    - Q120_B_NON_NUMERIC_VECTOR
    - Q120_C_NON_NUMERIC_VECTOR
    - Q120_D_NON_NUMERIC_VECTOR
    - Q120_E_NON_NUMERIC_VECTOR
  - state_notice broad-tag vectors:
    - Q082_C_NON_NUMERIC_VECTOR
    - Q090_B_NON_NUMERIC_VECTOR
    - Q090_C_NON_NUMERIC_VECTOR
    - Q092_B_NON_NUMERIC_VECTOR
    - Q095_C_NON_NUMERIC_VECTOR
    - Q099_E_NON_NUMERIC_VECTOR
    - Q100_C_NON_NUMERIC_VECTOR
    - Q101_B_NON_NUMERIC_VECTOR
    - Q101_D_NON_NUMERIC_VECTOR
    - Q102_B_NON_NUMERIC_VECTOR
    - Q102_D_NON_NUMERIC_VECTOR
    - Q103_D_NON_NUMERIC_VECTOR
    - Q105_A_NON_NUMERIC_VECTOR
    - Q105_E_NON_NUMERIC_VECTOR
    - Q106_A_NON_NUMERIC_VECTOR
    - Q107_D_NON_NUMERIC_VECTOR
    - Q108_B_NON_NUMERIC_VECTOR
    - Q108_C_NON_NUMERIC_VECTOR
    - Q110_D_NON_NUMERIC_VECTOR
    - Q110_E_NON_NUMERIC_VECTOR
    - Q112_C_NON_NUMERIC_VECTOR
    - Q113_D_NON_NUMERIC_VECTOR
    - Q115_E_NON_NUMERIC_VECTOR
    - Q116_B_NON_NUMERIC_VECTOR
    - Q119_C_NON_NUMERIC_VECTOR
    - Q120_B_NON_NUMERIC_VECTOR
  - cross-family primary exceptions:
    - Q081_E_NON_NUMERIC_VECTOR
    - Q082_A_NON_NUMERIC_VECTOR
    - Q082_E_NON_NUMERIC_VECTOR
    - Q083_A_NON_NUMERIC_VECTOR
    - Q083_C_NON_NUMERIC_VECTOR
    - Q083_D_NON_NUMERIC_VECTOR
    - Q083_E_NON_NUMERIC_VECTOR
    - Q084_A_NON_NUMERIC_VECTOR
    - Q084_B_NON_NUMERIC_VECTOR
    - Q084_C_NON_NUMERIC_VECTOR
    - Q085_A_NON_NUMERIC_VECTOR
    - Q085_C_NON_NUMERIC_VECTOR
    - Q085_E_NON_NUMERIC_VECTOR
    - Q087_A_NON_NUMERIC_VECTOR
    - Q087_E_NON_NUMERIC_VECTOR
    - Q088_A_NON_NUMERIC_VECTOR
    - Q088_C_NON_NUMERIC_VECTOR
    - Q088_D_NON_NUMERIC_VECTOR
    - Q088_E_NON_NUMERIC_VECTOR
    - Q089_E_NON_NUMERIC_VECTOR
    - Q090_D_NON_NUMERIC_VECTOR
    - Q090_E_NON_NUMERIC_VECTOR
    - Q091_D_NON_NUMERIC_VECTOR
    - Q091_E_NON_NUMERIC_VECTOR
    - Q092_D_NON_NUMERIC_VECTOR
    - Q093_E_NON_NUMERIC_VECTOR
    - Q094_A_NON_NUMERIC_VECTOR
    - Q094_D_NON_NUMERIC_VECTOR
    - Q094_E_NON_NUMERIC_VECTOR
    - Q095_A_NON_NUMERIC_VECTOR
    - Q095_B_NON_NUMERIC_VECTOR
    - Q095_D_NON_NUMERIC_VECTOR
    - Q095_E_NON_NUMERIC_VECTOR
    - Q096_A_NON_NUMERIC_VECTOR
    - Q096_D_NON_NUMERIC_VECTOR
    - Q097_C_NON_NUMERIC_VECTOR
    - Q097_E_NON_NUMERIC_VECTOR
    - Q098_A_NON_NUMERIC_VECTOR
    - Q098_B_NON_NUMERIC_VECTOR
    - Q098_D_NON_NUMERIC_VECTOR
    - Q099_D_NON_NUMERIC_VECTOR
    - Q099_E_NON_NUMERIC_VECTOR
    - Q100_B_NON_NUMERIC_VECTOR
    - Q100_D_NON_NUMERIC_VECTOR
    - Q102_D_NON_NUMERIC_VECTOR
    - Q103_D_NON_NUMERIC_VECTOR
    - Q103_E_NON_NUMERIC_VECTOR
    - Q104_A_NON_NUMERIC_VECTOR
    - Q104_B_NON_NUMERIC_VECTOR
    - Q104_C_NON_NUMERIC_VECTOR
    - Q104_E_NON_NUMERIC_VECTOR
    - Q106_B_NON_NUMERIC_VECTOR
    - Q106_C_NON_NUMERIC_VECTOR
    - Q106_D_NON_NUMERIC_VECTOR
    - Q106_E_NON_NUMERIC_VECTOR
    - Q107_B_NON_NUMERIC_VECTOR
    - Q107_C_NON_NUMERIC_VECTOR
    - Q108_D_NON_NUMERIC_VECTOR
    - Q108_E_NON_NUMERIC_VECTOR
    - Q109_A_NON_NUMERIC_VECTOR
    - Q109_B_NON_NUMERIC_VECTOR
    - Q109_C_NON_NUMERIC_VECTOR
    - Q109_D_NON_NUMERIC_VECTOR
    - Q109_E_NON_NUMERIC_VECTOR
    - Q110_A_NON_NUMERIC_VECTOR
    - Q110_B_NON_NUMERIC_VECTOR
    - Q110_C_NON_NUMERIC_VECTOR
    - Q110_D_NON_NUMERIC_VECTOR
    - Q111_B_NON_NUMERIC_VECTOR
    - Q111_C_NON_NUMERIC_VECTOR
    - Q111_D_NON_NUMERIC_VECTOR
    - Q111_E_NON_NUMERIC_VECTOR
    - Q112_A_NON_NUMERIC_VECTOR
    - Q112_B_NON_NUMERIC_VECTOR
    - Q112_D_NON_NUMERIC_VECTOR
    - Q112_E_NON_NUMERIC_VECTOR
    - Q113_A_NON_NUMERIC_VECTOR
    - Q113_B_NON_NUMERIC_VECTOR
    - Q113_C_NON_NUMERIC_VECTOR
    - Q113_E_NON_NUMERIC_VECTOR
    - Q114_B_NON_NUMERIC_VECTOR
    - Q114_C_NON_NUMERIC_VECTOR
    - Q114_E_NON_NUMERIC_VECTOR
    - Q115_C_NON_NUMERIC_VECTOR
    - Q115_E_NON_NUMERIC_VECTOR
    - Q116_B_NON_NUMERIC_VECTOR
    - Q116_C_NON_NUMERIC_VECTOR
    - Q116_D_NON_NUMERIC_VECTOR
    - Q117_A_NON_NUMERIC_VECTOR
    - Q117_C_NON_NUMERIC_VECTOR
    - Q117_E_NON_NUMERIC_VECTOR
    - Q118_A_NON_NUMERIC_VECTOR
    - Q118_B_NON_NUMERIC_VECTOR
    - Q118_C_NON_NUMERIC_VECTOR
    - Q118_E_NON_NUMERIC_VECTOR
    - Q119_C_NON_NUMERIC_VECTOR
    - Q119_D_NON_NUMERIC_VECTOR
    - Q119_E_NON_NUMERIC_VECTOR
    - Q120_D_NON_NUMERIC_VECTOR
  - broad-tag dominance candidates:
    - Q081_A_NON_NUMERIC_VECTOR: social_modulation, returnable_distance
    - Q081_B_NON_NUMERIC_VECTOR: boundary_awareness
    - Q081_C_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q081_D_NON_NUMERIC_VECTOR: social_modulation
    - Q081_E_NON_NUMERIC_VECTOR: schedule_reframe, recovery_margin_need
    - Q082_A_NON_NUMERIC_VECTOR: quiet_reset_need, recovery_margin_need
    - Q082_B_NON_NUMERIC_VECTOR: recovery_margin_need, schedule_reframe
    - Q082_C_NON_NUMERIC_VECTOR: state_notice, recovery_margin_need
    - Q082_D_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q082_E_NON_NUMERIC_VECTOR: schedule_reframe, later_review, recovery_margin_need
    - Q083_A_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance
    - Q083_B_NON_NUMERIC_VECTOR: social_modulation
    - Q083_C_NON_NUMERIC_VECTOR: returnable_distance, social_modulation
    - Q083_D_NON_NUMERIC_VECTOR: social_modulation
    - Q083_E_NON_NUMERIC_VECTOR: schedule_reframe, social_modulation
    - Q084_B_NON_NUMERIC_VECTOR: response_timing_buffer
    - Q084_C_NON_NUMERIC_VECTOR: quiet_reset_need
    - Q084_E_NON_NUMERIC_VECTOR: recovery_margin_need, later_review, schedule_reframe
    - Q085_A_NON_NUMERIC_VECTOR: quiet_reset_need, returnable_distance, recovery_margin_need, later_review, self_observation_strength
    - Q085_B_NON_NUMERIC_VECTOR: recovery_margin_need, later_review, self_observation_strength
    - Q085_C_NON_NUMERIC_VECTOR: later_review, self_observation_strength
    - Q085_D_NON_NUMERIC_VECTOR: social_modulation, later_review, self_observation_strength
    - Q085_E_NON_NUMERIC_VECTOR: schedule_reframe, boundary_awareness, later_review, self_observation_strength
    - Q086_A_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q086_D_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q086_E_NON_NUMERIC_VECTOR: social_modulation
    - Q087_A_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q087_B_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q087_C_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q087_D_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q087_E_NON_NUMERIC_VECTOR: schedule_reframe, recovery_margin_need
    - Q088_A_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance
    - Q088_B_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need
    - Q088_C_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation
    - Q088_D_NON_NUMERIC_VECTOR: returnable_distance, social_modulation
    - Q088_E_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q089_A_NON_NUMERIC_VECTOR: recovery_margin_need
    - Q089_B_NON_NUMERIC_VECTOR: social_modulation, returnable_distance, recovery_margin_need
    - Q089_C_NON_NUMERIC_VECTOR: boundary_awareness
    - Q089_D_NON_NUMERIC_VECTOR: social_modulation
    - Q089_E_NON_NUMERIC_VECTOR: schedule_reframe, recovery_margin_need
    - Q090_A_NON_NUMERIC_VECTOR: social_modulation, later_review, self_observation_strength
    - Q090_B_NON_NUMERIC_VECTOR: recovery_margin_need, state_notice, later_review, self_observation_strength
    - Q090_C_NON_NUMERIC_VECTOR: boundary_awareness, state_notice, later_review, self_observation_strength
    - Q090_D_NON_NUMERIC_VECTOR: schedule_reframe, later_review, self_observation_strength
    - Q090_E_NON_NUMERIC_VECTOR: response_timing_buffer, later_review, self_observation_strength
    - Q091_A_NON_NUMERIC_VECTOR: boundary_awareness
    - Q091_B_NON_NUMERIC_VECTOR: scope_expansion, social_modulation
    - Q091_D_NON_NUMERIC_VECTOR: social_modulation
    - Q091_E_NON_NUMERIC_VECTOR: boundary_awareness, later_review
    - Q092_A_NON_NUMERIC_VECTOR: scope_expansion, social_modulation
    - Q092_B_NON_NUMERIC_VECTOR: boundary_awareness, state_notice
    - Q092_C_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness
    - Q092_D_NON_NUMERIC_VECTOR: social_load_residue, social_modulation
    - Q093_A_NON_NUMERIC_VECTOR: scope_expansion, social_modulation
    - Q093_B_NON_NUMERIC_VECTOR: role_load, social_modulation
    - Q093_C_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation, returnable_distance
    - Q093_D_NON_NUMERIC_VECTOR: scope_expansion, social_modulation
    - Q093_E_NON_NUMERIC_VECTOR: recovery_margin_need, social_modulation
    - Q094_A_NON_NUMERIC_VECTOR: schedule_reframe, boundary_awareness, later_review
    - Q094_B_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation, response_timing_buffer
    - Q094_C_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness
    - Q094_D_NON_NUMERIC_VECTOR: social_modulation
    - Q094_E_NON_NUMERIC_VECTOR: later_review
    - Q095_A_NON_NUMERIC_VECTOR: social_modulation, later_review, self_observation_strength
    - Q095_B_NON_NUMERIC_VECTOR: social_load_residue, social_modulation, later_review, self_observation_strength
    - Q095_C_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness, later_review, state_notice, schedule_reframe, self_observation_strength
    - Q095_D_NON_NUMERIC_VECTOR: response_timing_buffer, later_review, self_observation_strength
    - Q095_E_NON_NUMERIC_VECTOR: boundary_awareness, later_review, self_observation_strength
    - Q096_C_NON_NUMERIC_VECTOR: response_timing_buffer
    - Q096_D_NON_NUMERIC_VECTOR: social_modulation
    - Q096_E_NON_NUMERIC_VECTOR: response_timing_buffer
    - Q097_A_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation
    - Q097_C_NON_NUMERIC_VECTOR: social_modulation
    - Q097_D_NON_NUMERIC_VECTOR: response_timing_buffer, later_review
    - Q097_E_NON_NUMERIC_VECTOR: partial_reasoning, boundary_awareness
    - Q098_A_NON_NUMERIC_VECTOR: social_modulation
    - Q098_B_NON_NUMERIC_VECTOR: partial_reasoning, social_modulation, response_timing_buffer
    - Q098_C_NON_NUMERIC_VECTOR: role_load, social_modulation
    - Q098_D_NON_NUMERIC_VECTOR: returnable_distance, social_modulation
    - Q098_E_NON_NUMERIC_VECTOR: scope_expansion, social_modulation
    - Q099_B_NON_NUMERIC_VECTOR: boundary_awareness, response_timing_buffer
    - Q099_C_NON_NUMERIC_VECTOR: response_timing_buffer
    - Q099_D_NON_NUMERIC_VECTOR: partial_reasoning, boundary_awareness, later_review
    - Q099_E_NON_NUMERIC_VECTOR: recovery_margin_need, social_modulation, state_notice
    - Q100_A_NON_NUMERIC_VECTOR: boundary_awareness, later_review, self_observation_strength
    - Q100_B_NON_NUMERIC_VECTOR: social_modulation, later_review, self_observation_strength
    - Q100_C_NON_NUMERIC_VECTOR: scope_expansion, state_notice, schedule_reframe, later_review, self_observation_strength
    - Q100_D_NON_NUMERIC_VECTOR: partial_reasoning, social_modulation, response_timing_buffer, later_review, self_observation_strength
    - Q100_E_NON_NUMERIC_VECTOR: response_timing_buffer, boundary_awareness, later_review, self_observation_strength
    - Q101_A_NON_NUMERIC_VECTOR: role_load, social_modulation
    - Q101_B_NON_NUMERIC_VECTOR: role_load, social_modulation, recovery_margin_need, state_notice
    - Q101_C_NON_NUMERIC_VECTOR: social_modulation, role_load
    - Q101_D_NON_NUMERIC_VECTOR: social_modulation, later_review, state_notice, role_load
    - Q101_E_NON_NUMERIC_VECTOR: role_aftereffect, social_modulation, returnable_distance, later_review, role_load
    - Q102_A_NON_NUMERIC_VECTOR: role_load, social_modulation
    - Q102_B_NON_NUMERIC_VECTOR: social_modulation, state_notice, role_load
    - Q102_C_NON_NUMERIC_VECTOR: role_load, social_modulation
    - Q102_D_NON_NUMERIC_VECTOR: later_review, state_notice
    - Q102_E_NON_NUMERIC_VECTOR: boundary_awareness, social_modulation, role_load
    - Q103_A_NON_NUMERIC_VECTOR: role_load, social_modulation, returnable_distance
    - Q103_B_NON_NUMERIC_VECTOR: role_load, social_modulation
    - Q103_C_NON_NUMERIC_VECTOR: social_modulation, recovery_margin_need, role_load
    - Q103_D_NON_NUMERIC_VECTOR: social_modulation, state_notice
    - Q103_E_NON_NUMERIC_VECTOR: recovery_margin_need, social_modulation
    - Q104_A_NON_NUMERIC_VECTOR: quiet_reset_need, returnable_distance
    - Q104_C_NON_NUMERIC_VECTOR: social_modulation, role_load
    - Q104_D_NON_NUMERIC_VECTOR: role_aftereffect, social_modulation, response_timing_buffer
    - Q104_E_NON_NUMERIC_VECTOR: schedule_reframe, recovery_margin_need
    - Q105_A_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness, later_review, state_notice, schedule_reframe
    - Q105_B_NON_NUMERIC_VECTOR: scope_expansion, later_review, self_observation_strength
    - Q105_C_NON_NUMERIC_VECTOR: role_load, social_modulation, later_review, self_observation_strength
    - Q105_D_NON_NUMERIC_VECTOR: role_aftereffect, social_modulation, response_timing_buffer, later_review, role_load
    - Q105_E_NON_NUMERIC_VECTOR: boundary_awareness, later_review, state_notice, self_observation_strength
    - Q106_A_NON_NUMERIC_VECTOR: state_notice
    - Q106_B_NON_NUMERIC_VECTOR: feedback_filtering
    - Q106_C_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance, recovery_margin_need
    - Q106_E_NON_NUMERIC_VECTOR: schedule_reframe
    - Q107_A_NON_NUMERIC_VECTOR: later_review
    - Q107_B_NON_NUMERIC_VECTOR: schedule_reframe, later_review
    - Q107_C_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q107_D_NON_NUMERIC_VECTOR: state_notice, later_review
    - Q107_E_NON_NUMERIC_VECTOR: later_review
    - Q108_A_NON_NUMERIC_VECTOR: social_modulation, later_review
    - Q108_B_NON_NUMERIC_VECTOR: state_notice, social_modulation, later_review
    - Q108_C_NON_NUMERIC_VECTOR: state_notice, later_review, social_modulation
    - Q108_D_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance, later_review
    - Q108_E_NON_NUMERIC_VECTOR: boundary_awareness, later_review, social_modulation
    - Q109_A_NON_NUMERIC_VECTOR: boundary_awareness
    - Q109_B_NON_NUMERIC_VECTOR: schedule_reframe
    - Q109_C_NON_NUMERIC_VECTOR: response_timing_buffer, social_modulation
    - Q109_D_NON_NUMERIC_VECTOR: social_modulation
    - Q109_E_NON_NUMERIC_VECTOR: schedule_reframe, recovery_margin_need, boundary_awareness, later_review
    - Q110_A_NON_NUMERIC_VECTOR: quiet_reset_need, recovery_margin_need, schedule_reframe, later_review, self_observation_strength
    - Q110_B_NON_NUMERIC_VECTOR: social_modulation, feedback_filtering, later_review, self_observation_strength
    - Q110_C_NON_NUMERIC_VECTOR: later_review, self_observation_strength
    - Q110_D_NON_NUMERIC_VECTOR: later_review, state_notice, self_observation_strength
    - Q110_E_NON_NUMERIC_VECTOR: state_notice, later_review, self_observation_strength
    - Q111_A_NON_NUMERIC_VECTOR: pattern_naming
    - Q111_B_NON_NUMERIC_VECTOR: social_load_residue, social_modulation, later_review, pattern_naming
    - Q111_C_NON_NUMERIC_VECTOR: pattern_naming
    - Q111_D_NON_NUMERIC_VECTOR: scope_expansion, boundary_awareness, later_review, pattern_naming
    - Q111_E_NON_NUMERIC_VECTOR: boundary_awareness, pattern_naming
    - Q112_A_NON_NUMERIC_VECTOR: scope_expansion, pattern_naming
    - Q112_B_NON_NUMERIC_VECTOR: scope_expansion, later_review, pattern_naming
    - Q112_C_NON_NUMERIC_VECTOR: state_notice, pattern_naming
    - Q112_D_NON_NUMERIC_VECTOR: social_modulation, pattern_naming
    - Q112_E_NON_NUMERIC_VECTOR: recovery_margin_need, pattern_naming
    - Q113_A_NON_NUMERIC_VECTOR: social_modulation, feedback_filtering, pattern_naming
    - Q113_B_NON_NUMERIC_VECTOR: role_load, social_modulation, pattern_naming
    - Q113_C_NON_NUMERIC_VECTOR: social_modulation, pattern_naming
    - Q113_D_NON_NUMERIC_VECTOR: social_modulation, returnable_distance, later_review, state_notice, pattern_naming
    - Q113_E_NON_NUMERIC_VECTOR: scope_expansion, social_modulation, pattern_naming
    - Q114_A_NON_NUMERIC_VECTOR: pattern_naming
    - Q114_B_NON_NUMERIC_VECTOR: schedule_reframe, recovery_margin_need, pattern_naming
    - Q114_C_NON_NUMERIC_VECTOR: partial_reasoning, social_modulation, feedback_filtering, pattern_naming
    - Q114_D_NON_NUMERIC_VECTOR: later_review, pattern_naming
    - Q114_E_NON_NUMERIC_VECTOR: later_review, pattern_naming
    - Q115_A_NON_NUMERIC_VECTOR: pattern_naming, social_modulation, later_review, self_observation_strength
    - Q115_B_NON_NUMERIC_VECTOR: later_review, pattern_naming, self_observation_strength
    - Q115_C_NON_NUMERIC_VECTOR: social_modulation, pattern_naming, later_review, self_observation_strength
    - Q115_D_NON_NUMERIC_VECTOR: later_review, pattern_naming, self_observation_strength
    - Q115_E_NON_NUMERIC_VECTOR: social_modulation, feedback_filtering, state_notice, pattern_naming
    - Q116_A_NON_NUMERIC_VECTOR: feedback_filtering
    - Q116_B_NON_NUMERIC_VECTOR: state_notice, feedback_filtering
    - Q116_C_NON_NUMERIC_VECTOR: social_modulation, feedback_filtering
    - Q116_D_NON_NUMERIC_VECTOR: partial_reasoning, feedback_filtering
    - Q116_E_NON_NUMERIC_VECTOR: social_modulation, later_review, feedback_filtering
    - Q117_A_NON_NUMERIC_VECTOR: partial_reasoning, social_modulation, feedback_filtering
    - Q117_B_NON_NUMERIC_VECTOR: later_review, feedback_filtering
    - Q117_C_NON_NUMERIC_VECTOR: response_timing_buffer, feedback_filtering
    - Q117_D_NON_NUMERIC_VECTOR: feedback_filtering, boundary_awareness
    - Q117_E_NON_NUMERIC_VECTOR: boundary_awareness, feedback_filtering
    - Q118_A_NON_NUMERIC_VECTOR: social_load_residue, social_modulation, feedback_filtering, later_review
    - Q118_B_NON_NUMERIC_VECTOR: returnable_distance, social_modulation, feedback_filtering
    - Q118_C_NON_NUMERIC_VECTOR: role_load, social_modulation, feedback_filtering
    - Q118_D_NON_NUMERIC_VECTOR: feedback_filtering, social_modulation
    - Q118_E_NON_NUMERIC_VECTOR: social_modulation, feedback_filtering
    - Q119_A_NON_NUMERIC_VECTOR: feedback_filtering, boundary_awareness
    - Q119_B_NON_NUMERIC_VECTOR: later_review, feedback_filtering
    - Q119_C_NON_NUMERIC_VECTOR: boundary_awareness, state_notice, feedback_filtering
    - Q119_D_NON_NUMERIC_VECTOR: social_modulation, feedback_filtering, later_review
    - Q119_E_NON_NUMERIC_VECTOR: quiet_reset_need, social_modulation, returnable_distance, feedback_filtering
    - Q120_A_NON_NUMERIC_VECTOR: later_review, recovery_margin_need, feedback_filtering, self_observation_strength
    - Q120_B_NON_NUMERIC_VECTOR: feedback_filtering, boundary_awareness, later_review, state_notice, self_observation_strength
    - Q120_C_NON_NUMERIC_VECTOR: feedback_filtering, later_review, self_observation_strength
    - Q120_D_NON_NUMERIC_VECTOR: social_modulation, feedback_filtering, later_review, self_observation_strength
    - Q120_E_NON_NUMERIC_VECTOR: later_review, feedback_filtering, self_observation_strength
  - unknown signal tags: none
  - missing required fields: none
  - visibility escalation conflicts: none

Final decision:
- approve Batch C non-numeric option vector application draft: YES_FOR_REVIEW
- approve full 120Q application: NO
- approve numeric score assignment: NO
- approve scoring formula: NO
- approve implementation: NO
- approve result taxonomy: NO
- approve result copy: NO
- approve report copy: NO
- approve launch: NO
- next authorized task: Batch C non-numeric option vector application review and refinement
