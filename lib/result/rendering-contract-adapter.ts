import { readFileSync } from "fs";
import path from "path";

import finalNamingLockJson from "@/docs/yorisou_canonical_final_naming_lock_2026-04-13/yorisou_canonical_final_naming_lock_v1.json";
import resultPayloadContractJson from "@/docs/yorisou_result_payload_contract_2026-04-13/yorisou_result_payload_contract_v1.json";
import liffRenderingContractJson from "@/docs/yorisou_liff_result_rendering_contract_2026-04-13/yorisou_liff_result_rendering_contract_v1.json";
import paymentUnlockFlowSpecJson from "@/docs/yorisou_payment_unlock_flow_spec_2026-04-13/yorisou_payment_unlock_flow_spec_v1.json";
import teaserLayerJson from "@/docs/yorisou_teaser_result_layer_2026-04-13/yorisou_teaser_result_layer_v1.json";
import shareCardLogicJson from "@/docs/yorisou_share_card_logic_2026-04-13/yorisou_share_card_logic_v1.json";
import deepReportScaffoldJson from "@/docs/yorisou_deep_report_scaffold_2026-04-13/yorisou_deep_report_scaffold_v1.json";

const PERSONA_MASTER_PATH = path.join(
  process.cwd(),
  "docs/yorisou_canonical_31_persona_framework_2026-04-13/yorisou_canonical_31_persona_framework_v2_locked_candidate.md",
);

type FinalNamingEntry = {
  persona_id: string;
  working_name: string;
  final_locked_label_jp: string;
  final_locked_subtitle_jp: string;
  short_english_logic_gloss: string;
  structural_summary: string;
  do_not_confuse_with: string;
  structural_preservation_note: string;
  subtitle_mandatory_flag: boolean;
  hotspot_cluster_flag: string | null;
  lock_status: string;
};

type PersonaMasterRow = {
  persona_id: string;
  working_name: string;
  core_defining_dimensions: string[];
  secondary_dimensions: string[];
};

type TeaserPersonaRow = {
  persona_id: string;
  working_name: string;
  upstream_dimension_signature: string;
  structural_teaser_summary: string;
  candidate_teaser_lines_jp: string[];
  recommended_teaser_line_jp: string;
  internal_logic_gloss_en: string;
  teaser_scores: Record<string, number>;
  screenshot_value_note?: string;
};

type ShareCardPersonaRow = {
  persona_id: string;
  working_name: string;
  upstream_dimension_signature: string;
  structural_share_card_summary: string;
  candidate_share_card_lines_jp: string[];
  recommended_share_card_line_jp: string;
  internal_logic_gloss_en: string;
  calibration: Record<string, number>;
};

type DeepReportPersonaRow = {
  persona_id: string;
  working_name: string;
  upstream_dimension_signature: string;
  teaser_handoff_reference?: string;
  share_card_handoff_reference?: string;
  scaffold_summary: string;
  deep_report_function: string;
  deep_report_core_identity: string;
  deep_report_core_tension: string;
  deep_report_hidden_pattern: string;
  deep_report_relational_pattern: string;
  deep_report_strength_pattern: string;
  "deep_report_self-sabotage_or_cost_pattern"?: string;
  deep_report_growth_direction: string;
  deep_report_do_not_confuse_with: string[];
  deep_report_boundary_note: string;
  deep_report_language_constraints: string;
  deep_report_paid_value_note: string;
  future_compatibility_hook_note: string;
  future_progression_hook_note: string;
  section_starters: Record<string, string>;
  recommended_section_skeleton_jp?: string;
  internal_logic_gloss_en?: string;
  lock_dependency_reference?: string;
};

type FinalNamingLockJson = {
  entries: FinalNamingEntry[];
  hotspot_clusters: Record<string, string[]>;
};

type ResultPayloadContractJson = {
  result_object: {
    result_version: string;
    scoring_version: string;
  };
  guardrails: string[];
};

type RenderingContractJson = {
  state_model: Array<{ name: string }>;
  non_override_rules: string[];
  screen_field_contract: {
    guardrails: string;
  };
  canonical_source_references: string[];
};

type PaymentFlowJson = {
  states: Array<{ name: string }>;
  canonical_source_references: string[];
};

type TeaserLayerJson = {
  personas: TeaserPersonaRow[];
};

type ShareCardLogicJson = {
  personas: ShareCardPersonaRow[];
};

type DeepReportScaffoldJson = {
  personas: DeepReportPersonaRow[];
};

export type LabSurfaceMode =
  | "primary"
  | "teaser"
  | "share-card"
  | "deep-report-locked"
  | "deep-report-unlocked"
  | "website-secondary";

export type LabScenario =
  | "loading"
  | "result_ready"
  | "teaser_only"
  | "share_card_ready"
  | "paywall_visible"
  | "checkout_initiated"
  | "checkout_pending"
  | "payment_succeeded"
  | "unlock_granted"
  | "unlock_failed"
  | "deep_report_locked"
  | "deep_report_unlocked"
  | "invalid_or_missing_payload"
  | "version_mismatch_guard"
  | "anonymous_session_mode";

export type SessionAccessState =
  | "anonymous_session_mode"
  | "logged_in_bound_user_mode if applicable later";

export type RenderingState =
  | "loading"
  | "result_ready"
  | "teaser_only"
  | "share_card_ready"
  | "deep_report_locked"
  | "deep_report_unlocked"
  | "invalid_or_missing_payload"
  | "version_mismatch_guard"
  | "anonymous_session_mode"
  | "logged_in_bound_user_mode if applicable later"
  | "checkout_initiated"
  | "checkout_pending"
  | "unlock_failed"
  | "paywall_visible";

export type UnlockState =
  | "not_eligible"
  | "teaser_only"
  | "paywall_visible"
  | "checkout_initiated"
  | "checkout_pending"
  | "payment_succeeded"
  | "unlock_granted"
  | "unlock_failed"
  | "deep_report_available"
  | "restore_purchase_available if applicable later"
  | "version_guard_blocked"
  | "invalid_session_blocked";

export type ValidationIssue = {
  code: string;
  message: string;
};

export type PersonaIdentitySubobject = {
  persona_id: string;
  working_name: string;
  final_locked_label_jp: string;
  final_locked_subtitle_jp: string;
  core_dimension_signature: string[];
  supporting_dimensions: string[];
  neighboring_persona_risk_flags: string[];
  hotspot_cluster_flag: string | boolean | null;
  structural_summary?: string;
  lock_reference?: string;
};

export type TeaserPayloadSubobject = {
  teaser_result: string;
  teaser_state: string;
  teaser_line_jp?: string;
  teaser_line_en_logic_gloss?: string;
  teaser_score?: number;
};

export type ShareCardPayloadSubobject = {
  share_card_result: string;
  share_card_state: string;
  share_card_line_jp?: string;
  share_card_line_en_logic_gloss?: string;
  share_card_score?: number;
};

export type DeepReportPayloadSubobject = {
  deep_report_stub: string;
  deep_report_unlock_state: string;
  deep_report_sections?: Record<string, string>;
  unlock_reason?: string;
  premium_state?: string;
};

export type PaywallPayloadSubobject = {
  paywall_state: string;
  entitlement_state?: string;
  price_state?: string;
  unlock_offer_state?: string;
};

export type ProgressionPayloadSubobject = {
  progression_state: string;
  next_session_recommendation?: string;
  repeat_sequence_state?: string;
  retention_state?: string;
};

export type AnalyticsMetadataSubobject = {
  session_id: string;
  result_version: string;
  scoring_version: string;
  created_at: string;
  updated_at: string;
  variant_id?: string;
  experiment_id?: string;
  trace_id?: string;
  device_class?: string;
  source_surface?: string;
  scenario?: LabScenario;
  persona_id?: string;
};

export type RenderingGuardrailsSubobject = {
  locked_source_reference: string[];
  non_override_rules: string[];
  hotspot_warning_flags?: string[];
  subtitle_mandatory_flags?: string[];
};

export type ResultSubobjects = {
  persona_identity: PersonaIdentitySubobject;
  teaser_payload: TeaserPayloadSubobject;
  share_card_payload: ShareCardPayloadSubobject;
  deep_report_payload: DeepReportPayloadSubobject;
  paywall_payload: PaywallPayloadSubobject;
  progression_payload: ProgressionPayloadSubobject;
  analytics_metadata: AnalyticsMetadataSubobject;
  rendering_guardrails: RenderingGuardrailsSubobject;
};

export type CanonicalResultPayload = {
  session_id: string;
  user_id_or_anonymous_session_key: string;
  result_version: string;
  scoring_version: string;
  persona_id: string;
  final_locked_label_jp: string;
  final_locked_subtitle_jp: string;
  working_name: string;
  teaser_result: {
    teaser_state: string;
    teaser_line_jp?: string;
    teaser_line_en_logic_gloss?: string;
    teaser_summary?: string;
    screenshot_value_note?: string;
  };
  share_card_result: {
    share_card_state: string;
    share_card_line_jp?: string;
    share_card_line_en_logic_gloss?: string;
    share_card_summary?: string;
  };
  deep_report_stub: {
    deep_report_state: string;
    deep_report_title_jp?: string;
    deep_report_intro_jp?: string;
  };
  core_dimension_signature: string[];
  supporting_dimensions: string[];
  neighboring_persona_risk_flags: string[];
  hotspot_cluster_flag: string | boolean | null;
  confidence_or_distinction_signal: number | string;
  paywall_state: {
    status: UnlockState;
    can_checkout?: boolean;
    can_restore?: boolean;
    preview_jp?: string;
  };
  deep_report_unlock_state: {
    status: UnlockState;
    can_render?: boolean;
    reason?: string;
  };
  share_card_state: {
    status: string;
    can_share?: boolean;
  };
  progression_state: {
    status: string;
    next_action_label_jp?: string;
  };
  created_at: string;
  updated_at: string;
  rendering_guardrails?: RenderingGuardrailsSubobject;
  subobjects: ResultSubobjects;
};

export type ResultValidation = {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  canonicalEntry: FinalNamingEntry | null;
};

export type ResultLabSnapshot = {
  personaId: string;
  surfaceMode: LabSurfaceMode;
  scenario: LabScenario;
  sessionMode: SessionAccessState;
  validation: ResultValidation;
  renderingState: RenderingState;
  unlockState: UnlockState;
  payload: CanonicalResultPayload | null;
  checkoutTransitions: CheckoutTransition[];
};

export type CheckoutTransition = {
  action: "initiateCheckout" | "markCheckoutPending" | "markUnlockGranted" | "markUnlockFailed" | "restorePurchasePlaceholder";
  allowed: boolean;
  nextUnlockState: UnlockState;
  nextRenderingState: RenderingState;
  note: string;
};

export type CheckoutStubContext = {
  sessionId: string;
  personaId: string;
  currentUnlockState: UnlockState;
  currentRenderingState: RenderingState;
  surfaceMode: LabSurfaceMode;
  canRestore?: boolean;
};

const finalNamingLock = finalNamingLockJson as FinalNamingLockJson;
const resultPayloadContract = resultPayloadContractJson as ResultPayloadContractJson;
const renderingContract = liffRenderingContractJson as RenderingContractJson;
const paymentFlowSpec = paymentUnlockFlowSpecJson as PaymentFlowJson;
const teaserLayer = teaserLayerJson as TeaserLayerJson;
const shareCardLayer = shareCardLogicJson as ShareCardLogicJson;
const deepReportLayer = deepReportScaffoldJson as DeepReportScaffoldJson;

const CANONICAL_RENDERING_STATES: readonly RenderingState[] = renderingContract.state_model.map((item) => item.name as RenderingState);
const CANONICAL_UNLOCK_STATES: readonly UnlockState[] = paymentFlowSpec.states.map((item) => item.name as UnlockState);

const TEASER_LOOKUP = new Map(teaserLayer.personas.map((item) => [item.persona_id, item]));
const SHARE_CARD_LOOKUP = new Map(shareCardLayer.personas.map((item) => [item.persona_id, item]));
const DEEP_REPORT_LOOKUP = new Map(deepReportLayer.personas.map((item) => [item.persona_id, item]));
const FINAL_NAMING_LOOKUP = new Map(finalNamingLock.entries.map((item) => [item.persona_id, item]));

let cachedPersonaMasterRows: PersonaMasterRow[] | null = null;

export const LAB_SCENARIOS: LabScenario[] = [
  "loading",
  "result_ready",
  "teaser_only",
  "share_card_ready",
  "paywall_visible",
  "checkout_initiated",
  "checkout_pending",
  "payment_succeeded",
  "unlock_granted",
  "unlock_failed",
  "deep_report_locked",
  "deep_report_unlocked",
  "invalid_or_missing_payload",
  "version_mismatch_guard",
  "anonymous_session_mode",
];

export const LAB_SURFACE_MODES: LabSurfaceMode[] = [
  "primary",
  "teaser",
  "share-card",
  "deep-report-locked",
  "deep-report-unlocked",
  "website-secondary",
];

export const LAB_SESSION_MODES: SessionAccessState[] = [
  "anonymous_session_mode",
  "logged_in_bound_user_mode if applicable later",
];

export const LAB_VERSION_MODES = ["valid", "mismatch"] as const;

export function getCanonicalPersonaOptions() {
  return parsePersonaMasterRows().map((row) => {
    const entry = getFinalNamingEntry(row.persona_id);
    return {
      personaId: row.persona_id,
      workingName: row.working_name,
      finalLabel: entry?.final_locked_label_jp || row.working_name,
      subtitle: entry?.final_locked_subtitle_jp || "",
    };
  });
}

export function getLabScenarioOptions() {
  return LAB_SCENARIOS.map((scenario) => ({ value: scenario, label: scenario }));
}

export function getSurfaceOptions() {
  return LAB_SURFACE_MODES.map((surface) => ({ value: surface, label: surface }));
}

export function getSessionModeOptions() {
  return LAB_SESSION_MODES.map((mode) => ({ value: mode, label: mode }));
}

export function getVersionModeOptions() {
  return LAB_VERSION_MODES.map((mode) => ({ value: mode, label: mode }));
}

export function buildResultLabSnapshot(input: {
  personaId?: string;
  scenario?: LabScenario;
  surfaceMode?: LabSurfaceMode;
  sessionMode?: "anonymous" | "bound";
  versionMode?: "valid" | "mismatch";
}): ResultLabSnapshot {
  const personaId = normalizePersonaId(input.personaId);
  const scenario = normalizeScenario(input.scenario);
  const surfaceMode = normalizeSurfaceMode(input.surfaceMode);
  const sessionMode = input.sessionMode === "bound" ? "logged_in_bound_user_mode if applicable later" : "anonymous_session_mode";
  const versionMode = input.versionMode === "mismatch" ? "mismatch" : "valid";

  if (scenario === "loading") {
    const loadingValidation: ResultValidation = {
      ok: false,
      errors: [{ code: "loading", message: "Payload is intentionally unavailable in loading state." }],
      warnings: [],
      canonicalEntry: null,
    };
    return {
      personaId,
      surfaceMode,
      scenario,
      sessionMode,
      validation: loadingValidation,
      renderingState: "loading",
      unlockState: "teaser_only",
      payload: null,
      checkoutTransitions: [],
    };
  }

  const basePayload = buildCanonicalResultPayloadFixture(personaId, scenario, sessionMode, versionMode);
  const validation = validateCanonicalResultPayload(basePayload);
  const unlockState = deriveUnlockState(basePayload, validation);
  const renderingState = deriveRenderingState(basePayload, validation, surfaceMode, unlockState);
  const checkoutTransitions = createCheckoutStub().summaries({
    sessionId: basePayload?.session_id || "",
    personaId,
    currentUnlockState: unlockState,
    currentRenderingState: renderingState,
    surfaceMode,
    canRestore: basePayload?.paywall_state.can_restore,
  });

  return {
    personaId,
    surfaceMode,
    scenario,
    sessionMode,
    validation,
    renderingState,
    unlockState,
    payload: basePayload,
    checkoutTransitions,
  };
}

export function validateCanonicalResultPayload(input: unknown): ResultValidation {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!input || typeof input !== "object") {
    return {
      ok: false,
      errors: [{ code: "missing_payload", message: "Result payload is missing or not an object." }],
      warnings,
      canonicalEntry: null,
    };
  }

  const payload = input as Partial<CanonicalResultPayload>;
  const personaId = typeof payload.persona_id === "string" ? payload.persona_id.trim() : "";
  const canonicalEntry = getFinalNamingEntry(personaId);

  if (!canonicalEntry) {
    errors.push({ code: "invalid_persona", message: `Unknown persona_id: ${personaId || "<empty>"}` });
  }

  if (!isNonEmptyString(payload.session_id)) {
    errors.push({ code: "missing_session_id", message: "session_id is required." });
  }

  if (!isNonEmptyString(payload.user_id_or_anonymous_session_key)) {
    errors.push({ code: "missing_user_key", message: "user_id_or_anonymous_session_key is required." });
  }

  if (!isNonEmptyString(payload.result_version)) {
    errors.push({ code: "missing_result_version", message: "result_version is required." });
  }

  if (!isNonEmptyString(payload.scoring_version)) {
    errors.push({ code: "missing_scoring_version", message: "scoring_version is required." });
  }

  if (!isNonEmptyString(payload.final_locked_label_jp)) {
    errors.push({ code: "missing_locked_label", message: "final_locked_label_jp is required." });
  }

  if (!isNonEmptyString(payload.final_locked_subtitle_jp)) {
    errors.push({ code: "missing_locked_subtitle", message: "final_locked_subtitle_jp is required." });
  }

  if (!isNonEmptyString(payload.working_name)) {
    errors.push({ code: "missing_working_name", message: "working_name is required." });
  }

  if (!Array.isArray(payload.core_dimension_signature) || !payload.core_dimension_signature.every(isDimensionCode)) {
    errors.push({ code: "invalid_core_dimensions", message: "core_dimension_signature must be a list of Dxx codes." });
  }

  if (!Array.isArray(payload.supporting_dimensions) || !payload.supporting_dimensions.every(isDimensionCode)) {
    errors.push({ code: "invalid_supporting_dimensions", message: "supporting_dimensions must be a list of Dxx codes." });
  }

  if (!Array.isArray(payload.neighboring_persona_risk_flags) || !payload.neighboring_persona_risk_flags.every(isPersonaCode)) {
    errors.push({ code: "invalid_neighbor_flags", message: "neighboring_persona_risk_flags must be a list of Pxx codes." });
  }

  if (payload.hotspot_cluster_flag === undefined) {
    errors.push({ code: "missing_hotspot_flag", message: "hotspot_cluster_flag is required." });
  }

  if (!payload.teaser_result || typeof payload.teaser_result !== "object") {
    errors.push({ code: "missing_teaser_result", message: "teaser_result must be present." });
  }

  if (!payload.share_card_result || typeof payload.share_card_result !== "object") {
    errors.push({ code: "missing_share_card_result", message: "share_card_result must be present." });
  }

  if (!payload.deep_report_stub || typeof payload.deep_report_stub !== "object") {
    errors.push({ code: "missing_deep_report_stub", message: "deep_report_stub must be present." });
  }

  if (!payload.paywall_state || typeof payload.paywall_state !== "object") {
    errors.push({ code: "missing_paywall_state", message: "paywall_state must be present." });
  }

  if (!payload.deep_report_unlock_state || typeof payload.deep_report_unlock_state !== "object") {
    errors.push({ code: "missing_unlock_state", message: "deep_report_unlock_state must be present." });
  }

  if (!payload.share_card_state || typeof payload.share_card_state !== "object") {
    errors.push({ code: "missing_share_card_state", message: "share_card_state must be present." });
  }

  if (!payload.progression_state || typeof payload.progression_state !== "object") {
    errors.push({ code: "missing_progression_state", message: "progression_state must be present." });
  }

  if (!isIsoTimestamp(payload.created_at)) {
    errors.push({ code: "invalid_created_at", message: "created_at must be ISO-8601." });
  }

  if (!isIsoTimestamp(payload.updated_at)) {
    errors.push({ code: "invalid_updated_at", message: "updated_at must be ISO-8601." });
  }

  if (canonicalEntry) {
    if (payload.final_locked_label_jp !== canonicalEntry.final_locked_label_jp) {
      errors.push({ code: "locked_label_mismatch", message: "final_locked_label_jp does not match the canonical final naming lock." });
    }
    if (payload.final_locked_subtitle_jp !== canonicalEntry.final_locked_subtitle_jp) {
      errors.push({ code: "locked_subtitle_mismatch", message: "final_locked_subtitle_jp does not match the canonical final naming lock." });
    }
    if (payload.working_name !== canonicalEntry.working_name) {
      errors.push({ code: "working_name_mismatch", message: "working_name does not match the canonical final naming lock." });
    }
  }

  const versionExpected = resultPayloadContract.result_object.result_version;
  const scoringExpected = resultPayloadContract.result_object.scoring_version;
  if (payload.result_version !== versionExpected || payload.scoring_version !== scoringExpected) {
    errors.push({ code: "version_mismatch", message: `Expected result_version=${versionExpected} and scoring_version=${scoringExpected}.` });
  }

  const renderGuardrails = payload.rendering_guardrails;
  if (renderGuardrails && typeof renderGuardrails === "object") {
    const lockedSources = (renderGuardrails as RenderingGuardrailsSubobject).locked_source_reference;
    if (!Array.isArray(lockedSources) || lockedSources.length === 0) {
      warnings.push({ code: "missing_locked_source_reference", message: "rendering_guardrails.locked_source_reference should list the locked source files." });
    }
  }

  const validUnlockState = normalizeUnlockState((payload.paywall_state as { status?: string } | undefined)?.status);
  if (!validUnlockState) {
    errors.push({ code: "invalid_paywall_state", message: "paywall_state.status must match a canonical unlock state." });
  }

  const validDeepUnlockState = normalizeUnlockState((payload.deep_report_unlock_state as { status?: string } | undefined)?.status);
  if (!validDeepUnlockState) {
    errors.push({ code: "invalid_deep_report_unlock_state", message: "deep_report_unlock_state.status must match a canonical unlock state." });
  }

  if (payload.subobjects && typeof payload.subobjects === "object") {
    if (!payload.subobjects.persona_identity || payload.subobjects.persona_identity.persona_id !== personaId) {
      errors.push({ code: "persona_identity_mismatch", message: "persona_identity must mirror the root persona fields." });
    }
  } else {
    errors.push({ code: "missing_subobjects", message: "subobjects must be present." });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    canonicalEntry: canonicalEntry || null,
  };
}

export function deriveUnlockState(payload: CanonicalResultPayload | null, validation: ResultValidation): UnlockState {
  if (!payload) {
    return "invalid_session_blocked";
  }

  if (!validation.ok && validation.errors.some((issue) => issue.code === "version_mismatch")) {
    return "version_guard_blocked";
  }

  if (!validation.ok && validation.errors.some((issue) => issue.code.startsWith("missing_") || issue.code.includes("invalid") || issue.code.includes("mismatch"))) {
    return "invalid_session_blocked";
  }

  const paywallState = normalizeUnlockState(payload.paywall_state.status);
  const deepUnlockState = normalizeUnlockState(payload.deep_report_unlock_state.status);

  if (deepUnlockState === "restore_purchase_available if applicable later") {
    return deepUnlockState;
  }

  if (deepUnlockState === "unlock_granted" || deepUnlockState === "payment_succeeded" || deepUnlockState === "deep_report_available") {
    return deepUnlockState;
  }

  if (paywallState === "checkout_initiated" || paywallState === "checkout_pending" || paywallState === "unlock_failed") {
    return paywallState;
  }

  if (paywallState === "paywall_visible") {
    return "paywall_visible";
  }

  if (paywallState === "teaser_only") {
    return "teaser_only";
  }

  if (paywallState === "not_eligible") {
    return "not_eligible";
  }

  return "teaser_only";
}

export function deriveRenderingState(
  payload: CanonicalResultPayload | null,
  validation: ResultValidation,
  surfaceMode: LabSurfaceMode,
  unlockState?: UnlockState,
): RenderingState {
  if (!payload) {
    return "loading";
  }

  if (!validation.ok && validation.errors.some((issue) => issue.code === "version_mismatch")) {
    return "version_mismatch_guard";
  }

  if (!validation.ok) {
    return "invalid_or_missing_payload";
  }

  const effectiveUnlockState = unlockState || deriveUnlockState(payload, validation);

  if (surfaceMode === "teaser") {
    return normalizeRenderingState("teaser_only");
  }

  if (surfaceMode === "share-card") {
    return normalizeRenderingState(payload.share_card_state.status === "share_card_ready" ? "share_card_ready" : "teaser_only");
  }

  if (surfaceMode === "deep-report-locked") {
    return normalizeRenderingState(
      effectiveUnlockState === "unlock_granted" || effectiveUnlockState === "payment_succeeded" || effectiveUnlockState === "deep_report_available"
        ? "deep_report_unlocked"
        : "deep_report_locked",
    );
  }

  if (surfaceMode === "deep-report-unlocked") {
    return normalizeRenderingState(
      effectiveUnlockState === "unlock_granted" || effectiveUnlockState === "payment_succeeded" || effectiveUnlockState === "deep_report_available"
        ? "deep_report_unlocked"
        : "deep_report_locked",
    );
  }

  if (surfaceMode === "website-secondary") {
    return normalizeRenderingState("result_ready");
  }

  if (effectiveUnlockState === "checkout_initiated") {
    return normalizeRenderingState("checkout_initiated");
  }

  if (effectiveUnlockState === "checkout_pending") {
    return normalizeRenderingState("checkout_pending");
  }

  if (effectiveUnlockState === "unlock_failed") {
    return normalizeRenderingState("unlock_failed");
  }

  if (effectiveUnlockState === "paywall_visible") {
    return normalizeRenderingState("paywall_visible");
  }

  if (effectiveUnlockState === "teaser_only") {
    return normalizeRenderingState("teaser_only");
  }

  if (effectiveUnlockState === "unlock_granted" || effectiveUnlockState === "payment_succeeded" || effectiveUnlockState === "deep_report_available") {
    return normalizeRenderingState("deep_report_unlocked");
  }

  return normalizeRenderingState("result_ready");
}

export function createCheckoutStub() {
  return {
    initiateCheckout(context: CheckoutStubContext): CheckoutTransition {
      return buildCheckoutTransition(context, "initiateCheckout", "checkout_initiated", "paywall_visible", true, "Prepare a provider-agnostic checkout handoff.");
    },
    markCheckoutPending(context: CheckoutStubContext): CheckoutTransition {
      return buildCheckoutTransition(context, "markCheckoutPending", "checkout_pending", "paywall_visible", true, "Await provider callback without changing payload identity.");
    },
    markUnlockGranted(context: CheckoutStubContext): CheckoutTransition {
      return buildCheckoutTransition(context, "markUnlockGranted", "unlock_granted", "deep_report_unlocked", true, "Unlock premium reading without mutating the canonical result text.");
    },
    markUnlockFailed(context: CheckoutStubContext): CheckoutTransition {
      return buildCheckoutTransition(context, "markUnlockFailed", "unlock_failed", "deep_report_locked", true, "Return to locked premium state and preserve the teaser/share surfaces.");
    },
    restorePurchasePlaceholder(context: CheckoutStubContext): CheckoutTransition {
      const nextUnlockState = "restore_purchase_available if applicable later" as UnlockState;
      return {
        action: "restorePurchasePlaceholder",
        allowed: Boolean(context.canRestore),
        nextUnlockState,
        nextRenderingState: context.currentRenderingState === "deep_report_unlocked" ? "deep_report_unlocked" : "deep_report_locked",
        note: "Future restore path placeholder only; no provider binding or entitlement mutation yet.",
      };
    },
    summaries(context: CheckoutStubContext): CheckoutTransition[] {
      return [
        this.initiateCheckout(context),
        this.markCheckoutPending(context),
        this.markUnlockGranted(context),
        this.markUnlockFailed(context),
        this.restorePurchasePlaceholder(context),
      ];
    },
  };
}

export function getCanonicalRenderingGuardrails() {
  return {
    canonicalSourceReferences: [
      "docs/yorisou_canonical_final_naming_lock_2026-04-13/yorisou_canonical_final_naming_lock_v1.md",
      "docs/yorisou_result_payload_contract_2026-04-13/yorisou_result_payload_contract_v1.md",
      "docs/yorisou_liff_result_rendering_contract_2026-04-13/yorisou_liff_result_rendering_contract_v1.md",
      "docs/yorisou_payment_unlock_flow_spec_2026-04-13/yorisou_payment_unlock_flow_spec_v1.md",
    ],
    nonOverrideRules: renderingContract.non_override_rules,
    hotspotWarnings: finalNamingLock.entries
      .filter((entry) => Boolean(entry.hotspot_cluster_flag))
      .map((entry) => `${entry.persona_id}:${entry.hotspot_cluster_flag}`),
    subtitleMandatoryFlags: finalNamingLock.entries.filter((entry) => entry.subtitle_mandatory_flag).map((entry) => entry.persona_id),
  };
}

function buildCanonicalResultPayloadFixture(
  personaId: string,
  scenario: LabScenario,
  sessionMode: SessionAccessState,
  versionMode: "valid" | "mismatch",
): CanonicalResultPayload | null {
  if (scenario === "loading") {
    return null;
  }

  const normalizedPersonaId = getKnownPersonaId(personaId);
  const masterRow = getPersonaMasterRow(normalizedPersonaId) || getPersonaMasterRow("P01")!;
  const namingEntry = getFinalNamingEntry(normalizedPersonaId) || getFinalNamingEntry("P01")!;
  const teaserEntry = getTeaserEntry(normalizedPersonaId) || getTeaserEntry("P01")!;
  const shareEntry = getShareEntry(normalizedPersonaId) || getShareEntry("P01")!;
  const deepEntry = getDeepEntry(normalizedPersonaId) || getDeepEntry("P01")!;
  const now = new Date().toISOString();
  const sessionId = `lab_${normalizedPersonaId}_${scenario}_${Date.now().toString(36)}`;
  const userKey = sessionMode === "anonymous_session_mode" ? `anonymous_${normalizedPersonaId}` : `bound_${normalizedPersonaId}`;
  const resultVersion = versionMode === "mismatch" ? "v0" : resultPayloadContract.result_object.result_version;
  const scoringVersion = versionMode === "mismatch" ? "v0" : resultPayloadContract.result_object.scoring_version;
  const guardrails = getCanonicalRenderingGuardrails();

  const paywallState = buildPaywallStateForScenario(scenario);
  const unlockState = buildUnlockStateForScenario(scenario);
  const shareState = buildShareCardStateForScenario(scenario);
  const progressionState = buildProgressionStateForScenario(scenario);

  const deepReportSections = scenario === "deep_report_unlocked" || scenario === "payment_succeeded" || scenario === "unlock_granted"
    ? deepEntry.section_starters
    : undefined;

  const payload: CanonicalResultPayload = {
    session_id: sessionId,
    user_id_or_anonymous_session_key: userKey,
    result_version: resultVersion,
    scoring_version: scoringVersion,
    persona_id: normalizedPersonaId,
    final_locked_label_jp: namingEntry.final_locked_label_jp,
    final_locked_subtitle_jp: namingEntry.final_locked_subtitle_jp,
    working_name: namingEntry.working_name,
    teaser_result: {
      teaser_state: shareState === "share_card_ready" ? "result_ready" : paywallState === "teaser_only" ? "teaser_only" : "result_ready",
      teaser_line_jp: teaserEntry.recommended_teaser_line_jp,
      teaser_line_en_logic_gloss: teaserEntry.internal_logic_gloss_en,
      teaser_summary: teaserEntry.structural_teaser_summary,
      screenshot_value_note: teaserEntry.screenshot_value_note,
    },
    share_card_result: {
      share_card_state: shareState,
      share_card_line_jp: shareEntry.recommended_share_card_line_jp,
      share_card_line_en_logic_gloss: shareEntry.internal_logic_gloss_en,
      share_card_summary: shareEntry.structural_share_card_summary,
    },
    deep_report_stub: {
      deep_report_state: unlockState === "unlock_granted" || unlockState === "payment_succeeded" || unlockState === "deep_report_available"
        ? "deep_report_unlocked"
        : "deep_report_locked",
      deep_report_title_jp: deepEntry.deep_report_core_identity,
      deep_report_intro_jp: deepEntry.scaffold_summary,
    },
    core_dimension_signature: masterRow?.core_defining_dimensions || [],
    supporting_dimensions: masterRow?.secondary_dimensions || [],
    neighboring_persona_risk_flags: namingEntry.do_not_confuse_with.split(",").map((item) => item.trim()).filter(Boolean),
    hotspot_cluster_flag: namingEntry.hotspot_cluster_flag,
    confidence_or_distinction_signal: scenario === "deep_report_unlocked" || scenario === "payment_succeeded" || scenario === "unlock_granted" ? 0.96 : 0.9,
    paywall_state: {
      status: paywallState,
      can_checkout: paywallState === "paywall_visible" || paywallState === "checkout_initiated" || paywallState === "checkout_pending",
      can_restore: true,
      preview_jp: scenario === "paywall_visible" ? "詳細レポートはロック中です" : undefined,
    },
    deep_report_unlock_state: {
      status: unlockState,
      can_render: unlockState === "unlock_granted" || unlockState === "payment_succeeded" || unlockState === "deep_report_available",
      reason:
        unlockState === "unlock_failed"
          ? "unlock_failed"
          : unlockState === "version_guard_blocked"
            ? "version_guard_blocked"
            : unlockState === "invalid_session_blocked"
              ? "invalid_session_blocked"
              : undefined,
    },
    share_card_state: {
      status: shareState,
      can_share: shareState === "share_card_ready",
    },
    progression_state: {
      status: progressionState,
      next_action_label_jp: "次のチェックへ",
    },
    created_at: now,
    updated_at: now,
    rendering_guardrails: {
      locked_source_reference: guardrails.canonicalSourceReferences,
      non_override_rules: guardrails.nonOverrideRules,
      hotspot_warning_flags: guardrails.hotspotWarnings,
      subtitle_mandatory_flags: guardrails.subtitleMandatoryFlags,
    },
    subobjects: {
      persona_identity: {
        persona_id: normalizedPersonaId,
        working_name: namingEntry.working_name,
        final_locked_label_jp: namingEntry.final_locked_label_jp,
        final_locked_subtitle_jp: namingEntry.final_locked_subtitle_jp,
        core_dimension_signature: masterRow?.core_defining_dimensions || [],
        supporting_dimensions: masterRow?.secondary_dimensions || [],
        neighboring_persona_risk_flags: namingEntry.do_not_confuse_with.split(",").map((item) => item.trim()).filter(Boolean),
        hotspot_cluster_flag: namingEntry.hotspot_cluster_flag,
        structural_summary: namingEntry.structural_summary,
        lock_reference: "canonical final naming lock",
      },
      teaser_payload: {
        teaser_result: teaserEntry.recommended_teaser_line_jp,
        teaser_state: paywallState === "teaser_only" ? "teaser_only" : "result_ready",
        teaser_line_jp: teaserEntry.recommended_teaser_line_jp,
        teaser_line_en_logic_gloss: teaserEntry.internal_logic_gloss_en,
        teaser_score: teaserEntry.teaser_scores.screenshot_potential,
      },
      share_card_payload: {
        share_card_result: shareEntry.recommended_share_card_line_jp,
        share_card_state: shareState,
        share_card_line_jp: shareEntry.recommended_share_card_line_jp,
        share_card_line_en_logic_gloss: shareEntry.internal_logic_gloss_en,
        share_card_score: shareEntry.calibration.compression_safety,
      },
      deep_report_payload: {
        deep_report_stub: deepEntry.deep_report_core_identity,
        deep_report_unlock_state: unlockState,
        deep_report_sections: deepReportSections,
        unlock_reason: unlockState,
        premium_state: unlockState === "unlock_granted" || unlockState === "payment_succeeded" || unlockState === "deep_report_available" ? "unlocked" : "locked",
      },
      paywall_payload: {
        paywall_state: paywallState,
        entitlement_state: unlockState === "not_eligible" ? "free_only" : "eligible",
        price_state: "provider_agnostic",
        unlock_offer_state: unlockState === "not_eligible" ? "hidden" : "visible",
      },
      progression_payload: {
        progression_state: progressionState,
        next_session_recommendation: "続きは次回の小さなチェックで確認できます。",
        repeat_sequence_state: sessionMode === "anonymous_session_mode" ? "anonymous_revisit" : "bound_revisit",
        retention_state: "placeholder",
      },
      analytics_metadata: {
        session_id: sessionId,
        result_version: resultVersion,
        scoring_version: scoringVersion,
        created_at: now,
        updated_at: now,
        variant_id: `lab_${scenario}`,
        experiment_id: "result_rendering_lab",
        trace_id: `${sessionId}_trace`,
        device_class: "mobile",
        source_surface: surfaceLabelFromScenario(scenario),
        scenario,
        persona_id: normalizedPersonaId,
      },
      rendering_guardrails: {
        locked_source_reference: guardrails.canonicalSourceReferences,
        non_override_rules: guardrails.nonOverrideRules,
        hotspot_warning_flags: guardrails.hotspotWarnings,
        subtitle_mandatory_flags: guardrails.subtitleMandatoryFlags,
      },
    },
  };

  if (scenario === "invalid_or_missing_payload") {
    return {
      ...payload,
      session_id: "",
      final_locked_label_jp: `${payload.final_locked_label_jp}（override attempt）`,
      teaser_result: { ...payload.teaser_result, teaser_line_jp: "override attempt" },
      subobjects: {
        ...payload.subobjects,
        persona_identity: {
          ...payload.subobjects.persona_identity,
          final_locked_label_jp: `${payload.final_locked_label_jp}（override attempt）`,
        },
      },
    };
  }

  if (scenario === "anonymous_session_mode") {
    return {
      ...payload,
      user_id_or_anonymous_session_key: `anonymous_${normalizedPersonaId}`,
    };
  }

  if (scenario === "version_mismatch_guard") {
    return {
      ...payload,
      result_version: "v0",
      scoring_version: "v0",
      subobjects: {
        ...payload.subobjects,
        analytics_metadata: {
          ...payload.subobjects.analytics_metadata,
          result_version: "v0",
          scoring_version: "v0",
        },
      },
    };
  }

  return payload;
}

function buildPaywallStateForScenario(scenario: LabScenario): UnlockState {
  switch (scenario) {
    case "teaser_only":
      return "teaser_only";
    case "paywall_visible":
    case "deep_report_locked":
      return "paywall_visible";
    case "checkout_initiated":
      return "checkout_initiated";
    case "checkout_pending":
      return "checkout_pending";
    case "payment_succeeded":
      return "payment_succeeded";
    case "unlock_granted":
    case "deep_report_unlocked":
      return "unlock_granted";
    case "unlock_failed":
      return "unlock_failed";
    case "version_mismatch_guard":
      return "version_guard_blocked";
    case "invalid_or_missing_payload":
      return "invalid_session_blocked";
    case "anonymous_session_mode":
      return "not_eligible";
    default:
      return "not_eligible";
  }
}

function buildUnlockStateForScenario(scenario: LabScenario): UnlockState {
  switch (scenario) {
    case "paywall_visible":
      return "paywall_visible";
    case "checkout_initiated":
      return "checkout_initiated";
    case "checkout_pending":
      return "checkout_pending";
    case "payment_succeeded":
      return "payment_succeeded";
    case "unlock_granted":
      return "unlock_granted";
    case "unlock_failed":
      return "unlock_failed";
    case "deep_report_locked":
      return "deep_report_available";
    case "deep_report_unlocked":
      return "deep_report_available";
    case "version_mismatch_guard":
      return "version_guard_blocked";
    case "invalid_or_missing_payload":
      return "invalid_session_blocked";
    case "anonymous_session_mode":
      return "not_eligible";
    case "teaser_only":
      return "teaser_only";
    default:
      return "not_eligible";
  }
}

function buildShareCardStateForScenario(scenario: LabScenario): string {
  if (scenario === "invalid_or_missing_payload" || scenario === "version_mismatch_guard") {
    return "share_card_unavailable";
  }
  return "share_card_ready";
}

function buildProgressionStateForScenario(scenario: LabScenario): string {
  if (scenario === "deep_report_unlocked" || scenario === "payment_succeeded" || scenario === "unlock_granted") {
    return "continue_available";
  }
  return "idle";
}

function normalizePersonaId(value?: string) {
  const candidate = typeof value === "string" ? value.trim().toUpperCase() : "P01";
  return /^P\d{2}$/.test(candidate) && getFinalNamingEntry(candidate) ? candidate : "P01";
}

function normalizeScenario(value?: string): LabScenario {
  return LAB_SCENARIOS.includes(value as LabScenario) ? (value as LabScenario) : "result_ready";
}

function normalizeSurfaceMode(value?: string): LabSurfaceMode {
  return LAB_SURFACE_MODES.includes(value as LabSurfaceMode) ? (value as LabSurfaceMode) : "primary";
}

function getKnownPersonaId(value: string) {
  const candidate = value.trim().toUpperCase();
  return getFinalNamingEntry(candidate) ? candidate : "P01";
}

function getFinalNamingEntry(personaId: string) {
  return FINAL_NAMING_LOOKUP.get(personaId) || null;
}

function getTeaserEntry(personaId: string) {
  return TEASER_LOOKUP.get(personaId) || null;
}

function getShareEntry(personaId: string) {
  return SHARE_CARD_LOOKUP.get(personaId) || null;
}

function getDeepEntry(personaId: string) {
  return DEEP_REPORT_LOOKUP.get(personaId) || null;
}

function getPersonaMasterRow(personaId: string) {
  return parsePersonaMasterRows().find((row) => row.persona_id === personaId) || null;
}

function parsePersonaMasterRows(): PersonaMasterRow[] {
  if (cachedPersonaMasterRows) {
    return cachedPersonaMasterRows;
  }

  const markdown = readFileSync(PERSONA_MASTER_PATH, "utf8");
  const lines = markdown.split(/\r?\n/);
  const tableStart = lines.findIndex((line) => line.trim().startsWith("| persona_id |"));
  const rows: PersonaMasterRow[] = [];

  if (tableStart < 0) {
    cachedPersonaMasterRows = [];
    return cachedPersonaMasterRows;
  }

  for (let index = tableStart + 2; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith("|")) {
      break;
    }

    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 12) {
      continue;
    }

    rows.push({
      persona_id: cells[0],
      working_name: cells[1],
      core_defining_dimensions: extractDimensionCodes(cells[3]),
      secondary_dimensions: extractDimensionCodes(cells[4]),
    });
  }

  cachedPersonaMasterRows = rows;
  return rows;
}

function extractDimensionCodes(value: string) {
  return (value.match(/D\d{2}/g) || []).filter(Boolean);
}

function isDimensionCode(value: unknown): value is string {
  return typeof value === "string" && /^D\d{2}$/.test(value);
}

function isPersonaCode(value: unknown): value is string {
  return typeof value === "string" && /^P\d{2}$/.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function normalizeUnlockState(value: string | undefined | null): UnlockState | null {
  if (!value) {
    return null;
  }

  return CANONICAL_UNLOCK_STATES.includes(value as UnlockState) ? (value as UnlockState) : null;
}

function normalizeRenderingState(value: RenderingState): RenderingState {
  return CANONICAL_RENDERING_STATES.includes(value) ? value : "invalid_or_missing_payload";
}

function buildCheckoutTransition(
  context: CheckoutStubContext,
  action: CheckoutTransition["action"],
  nextUnlockState: UnlockState,
  nextRenderingState: RenderingState,
  allowed: boolean,
  note: string,
): CheckoutTransition {
  return {
    action,
    allowed,
    nextUnlockState,
    nextRenderingState,
    note: `${note} Session ${context.sessionId || "<missing>"} remains read-only for persona and naming fields.`,
  };
}

function surfaceLabelFromScenario(scenario: LabScenario) {
  switch (scenario) {
    case "teaser_only":
      return "LIFF/mobile teaser result view";
    case "share_card_ready":
      return "LIFF/mobile share-card entry state";
    case "deep_report_locked":
      return "LIFF/mobile deep-report locked state";
    case "deep_report_unlocked":
      return "LIFF/mobile deep-report unlocked state";
    case "version_mismatch_guard":
    case "invalid_or_missing_payload":
      return "LIFF/mobile primary result screen";
    default:
      return "LIFF/mobile primary result screen";
  }
}
