// Platform tier — the Module Contract schema as types.
//
// This file is the machine mirror of the module-contracts document §1 (the *_MODULE_CONTRACTS_V1
// file under docs/architecture/ — not named here because the platform tier is brand-free, and the
// guard test holds this file to its own rule). Keys are snake_case ON PURPOSE: the documented
// schema and the type must correspond field-for-field, so a reviewer can diff one against the
// other without a mental rename table.
//
// GOVERNANCE COMPATIBILITY. This schema is a COMPATIBLE SUPERSET of the active v0.7.0 Module
// Contract Standard's normative minimum (§4 of that standard). Three fields are carried under
// normalized names — input_schema→input_contracts, output_schema→output_contracts,
// rollback_method→rollback_strategy — and one V1 name was retired in favor of the governance name
// (agent_dependencies→agent_requirements). The mapping is DATA here (V070_FIELD_MAPPING), so the
// superset property is machine-checked, not asserted: the guard test proves every v0.7.0 field
// maps to a real key of this type. There is exactly one module-contract standard in this
// repository, and it is this superset.
//
// BRAND-FREE BY CONTRACT (iron rule 3): nothing in lib/platform/ may name the product, a product
// asset, or a product domain string. test:platform-contracts enforces this mechanically, which is
// why the rule can be stated once here instead of policed in review.
//
// Types and declared data only. No runtime behavior, no I/O, imported by nothing in the
// application tier today — adopting a contract is an explicit act in a later implementation
// package, never a side effect of this file existing.

/** Capability module identity: `<family>.core` (e.g. `state.core`). */
export type CapabilityModuleId = `${string}.core`;

/**
 * V1 repository-adoption truth, DISTINCT from the governance lifecycle below. `declared` = the
 * boundary exists on paper only. `partial` = the product realizes part of the capability WITHOUT
 * this boundary yet. `implemented` = code conforms to the contract. Never a completion claim.
 */
export type ModuleAdoptionStatus = "declared" | "partial" | "implemented" | "deprecated";

/**
 * The v0.7.0 governance lifecycle, verbatim vocabulary (Module Contract Standard annex §7):
 * a state must be stored or evidenced explicitly, never inferred from marketing copy.
 */
export type ModuleLifecycleState =
  | "IDEA"
  | "DEFINED"
  | "PROTOTYPE"
  | "VALIDATED"
  | "INSTALLED"
  | "ENABLED"
  | "SUSPENDED"
  | "RETIRED";

/**
 * Verification is a separate gate from lifecycle (annex rule 7: "No module may be activated
 * because code exists; validation and activation are separate gates").
 */
export type ModuleVerificationState = "not_verified" | "validated" | "founder_approved";

/** Privacy / user-harm exposure class of the capability as a whole. */
export type RiskClass = "low" | "medium" | "high";

/**
 * Sensitivity class of the module's OWNED records. V1-declared vocabulary (the v0.7.0 corpus
 * requires the field but does not enumerate values); refining it is a governance act, not an
 * implementation act.
 */
export type PrivacyClass = "personal_sensitive" | "personal" | "operational" | "public_derivative";

/**
 * Governed-memory posture. `candidates_only` may PROPOSE (PossibleMemoryCandidate) and never
 * reads or writes confirmed memory; confirmed durable memory is a Kernel concern behind explicit
 * user confirmation (D-03 remains OPEN — no automatic threshold exists anywhere).
 */
export type MemoryAccess = "none" | "candidates_only" | "read_confirmed" | "read_write_confirmed";

/** Commercial posture of the module (standard §16). All V1 modules are non_commercial. */
export type CommercialStatus =
  | "non_commercial"
  | "free_tier"
  | "premium"
  | "subscription"
  | "partner_revenue"
  | "transaction_revenue"
  | "enterprise_service";

/** Contract semver — versions the CONTRACT, not any implementation. */
export type ContractVersion = `${number}.${number}.${number}`;

/** The small, stable set of Kernel services a module may declare it needs. */
export type KernelService =
  | "identity"
  | "auth"
  | "consent"
  | "permissions"
  | "memory"
  | "events"
  | "ownership"
  | "localization"
  | "audit"
  | "data_lifecycle"
  | "module_registry";

/** Reusable presentation frames a module's surfaces may declare. */
export type UiShellId =
  | "experience-shell"
  | "result-shell"
  | "reflection-shell"
  | "share-shell"
  | "compare-shell"
  | "collection-shell";

import type { DomainEventName } from "./events";

/**
 * The standard Module Contract — the single standard, a compatible superset of the v0.7.0
 * normative minimum. The authoritative per-module instances live in the contracts document; the
 * registry carries the summary tier.
 *
 * DATA-OWNERSHIP SEMANTICS (binding on every field that mentions "own"): the person owns their
 * personal data, always. A module's `owned_data` and `data_owner` describe OPERATIONAL CUSTODY —
 * mutation responsibility and canonical persistence responsibility for specific records — never
 * ownership of the person or their data. Modules are capability owners, not owners of the user.
 */
export interface ModuleContract {
  // ── identity ────────────────────────────────────────────────────────────────
  module_id: CapabilityModuleId;
  name: string;
  version: ContractVersion;
  category: string;
  description: string;
  purpose: string;

  // ── product grounding (v0.7.0) ─────────────────────────────────────────────
  user_problem: string;
  target_users: string;

  // ── adoption + governance lifecycle (distinct axes, both required) ─────────
  adoption_status: ModuleAdoptionStatus;
  lifecycle_state: ModuleLifecycleState;
  verification_state: ModuleVerificationState;

  // ── boundaries ─────────────────────────────────────────────────────────────
  responsibilities: readonly string[];
  non_responsibilities: readonly string[];

  required_kernel_services: readonly KernelService[];

  /** v0.7.0 `input_schema`, carried as named typed interfaces. */
  input_contracts: readonly string[];
  /** v0.7.0 `output_schema`, carried as named typed interfaces. */
  output_contracts: readonly string[];

  /** Operational custody only — see the data-ownership semantics above. */
  owned_data: readonly string[];
  readable_external_data: readonly string[];
  forbidden_data: readonly string[];

  // ── governed memory (v0.7.0) ───────────────────────────────────────────────
  memory_access: MemoryAccess;
  /** What the module may write into governed memory. "none" everywhere in V1 (D-03 OPEN). */
  memory_write_scope: string;

  // ── events ─────────────────────────────────────────────────────────────────
  events_consumed: readonly DomainEventName[];
  events_emitted: readonly DomainEventName[];

  // ── permissions (v0.7.0 scope + concrete grants) ───────────────────────────
  /** Governance statement of the widest permission this module may hold. */
  permission_scope: string;
  /** The concrete Kernel grants requested at runtime, all within permission_scope. */
  permissions_required: readonly string[];

  // ── composition ────────────────────────────────────────────────────────────
  ui_shells: readonly UiShellId[];
  product_pack_interfaces: readonly string[];

  // ── localization (v0.7.0) ──────────────────────────────────────────────────
  localization_requirements: readonly string[];
  regional_adapters: readonly string[];

  // ── dependencies ───────────────────────────────────────────────────────────
  /** Other capability modules this one requires (v0.7.0 annex "dependencies"). */
  module_dependencies: readonly CapabilityModuleId[];
  external_dependencies: readonly string[];
  agent_requirements: readonly string[];

  // ── classification (v0.7.0) ────────────────────────────────────────────────
  data_owner: string;
  privacy_class: PrivacyClass;
  risk_class: RiskClass;
  commercial_status: CommercialStatus;
  revenue_model: string;

  // ── portability ────────────────────────────────────────────────────────────
  portable: boolean;
  portable_test_required: boolean;

  // ── operations ─────────────────────────────────────────────────────────────
  disable_behavior: string;
  migration_strategy: string;
  /** v0.7.0 `rollback_method`. */
  rollback_strategy: string;

  observability: readonly string[];
  audit_requirements: readonly string[];
}

/**
 * Every key of ModuleContract, as data, so the guard test can check documents and mappings
 * against the schema. The two compile-time checks below keep this list exact in both directions.
 */
export const MODULE_CONTRACT_FIELDS = [
  "module_id",
  "name",
  "version",
  "category",
  "description",
  "purpose",
  "user_problem",
  "target_users",
  "adoption_status",
  "lifecycle_state",
  "verification_state",
  "responsibilities",
  "non_responsibilities",
  "required_kernel_services",
  "input_contracts",
  "output_contracts",
  "owned_data",
  "readable_external_data",
  "forbidden_data",
  "memory_access",
  "memory_write_scope",
  "events_consumed",
  "events_emitted",
  "permission_scope",
  "permissions_required",
  "ui_shells",
  "product_pack_interfaces",
  "localization_requirements",
  "regional_adapters",
  "module_dependencies",
  "external_dependencies",
  "agent_requirements",
  "data_owner",
  "privacy_class",
  "risk_class",
  "commercial_status",
  "revenue_model",
  "portable",
  "portable_test_required",
  "disable_behavior",
  "migration_strategy",
  "rollback_strategy",
  "observability",
  "audit_requirements",
] as const satisfies readonly (keyof ModuleContract)[];

// Reverse completeness: if a ModuleContract key is missing from the list above, this line fails
// to compile (the type below collapses to the missing key names instead of `true`).
type MissingFromFieldList = Exclude<keyof ModuleContract, (typeof MODULE_CONTRACT_FIELDS)[number]>;
export const MODULE_CONTRACT_FIELDS_EXHAUSTIVE: MissingFromFieldList extends never ? true : never = true;

/**
 * The lossless mapping from the active v0.7.0 Module Contract Standard's normative §4 schema to
 * this superset — the machine form of the compatibility table in the contracts document. The
 * guard test proves every target is a real ModuleContract key, so the superset rule cannot drift.
 */
export const V070_FIELD_MAPPING = {
  module_id: "module_id",
  name: "name",
  version: "version",
  category: "category",
  description: "description",
  purpose: "purpose",
  user_problem: "user_problem",
  target_users: "target_users",
  input_schema: "input_contracts",
  output_schema: "output_contracts",
  required_kernel_services: "required_kernel_services",
  memory_access: "memory_access",
  memory_write_scope: "memory_write_scope",
  permission_scope: "permission_scope",
  agent_requirements: "agent_requirements",
  localization_requirements: "localization_requirements",
  regional_adapters: "regional_adapters",
  external_dependencies: "external_dependencies",
  data_owner: "data_owner",
  privacy_class: "privacy_class",
  risk_class: "risk_class",
  commercial_status: "commercial_status",
  revenue_model: "revenue_model",
  dependencies: "module_dependencies",
  lifecycle_state: "lifecycle_state",
  verification_state: "verification_state",
  rollback_method: "rollback_strategy",
} as const satisfies Record<string, keyof ModuleContract>;
