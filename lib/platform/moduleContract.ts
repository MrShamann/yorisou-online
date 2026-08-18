// Platform tier — the Module Contract schema as types.
//
// This file is the machine mirror of the module-contracts document §1 (the *_MODULE_CONTRACTS_V1
// file under docs/architecture/ — not named here because the platform tier is brand-free, and the
// guard test holds this file to its own rule). Keys are snake_case ON PURPOSE: the documented
// schema and the type must correspond field-for-field, so a reviewer can diff one against the
// other without a mental rename table.
//
// BRAND-FREE BY CONTRACT (iron rule 3): nothing in lib/platform/ may name the product, a product
// asset, or a product domain string. test:platform-contracts enforces this mechanically, which is
// why the rule can be stated once here instead of policed in review.
//
// Types only. No runtime behavior, no I/O, imported by nothing in the application tier today —
// adopting a contract is an explicit act in a later implementation package, never a side effect of
// this file existing.

/** Capability module identity: `<family>.core` (e.g. `state.core`). */
export type CapabilityModuleId = `${string}.core`;

/**
 * A contract's lifecycle. `declared` = the boundary exists on paper only. `partial` = the product
 * realizes part of the capability WITHOUT this boundary yet. `implemented` = code conforms to the
 * contract. A status is a declaration of boundaries, never evidence that code exists.
 */
export type ModuleStatus = "declared" | "partial" | "implemented" | "deprecated";

/** Privacy / user-harm exposure class of the capability as a whole. */
export type RiskClass = "low" | "medium" | "high";

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
 * The standard Module Contract. One schema for all twelve capability modules; the authoritative
 * per-module instances live in the contracts document, and the registry carries the summary tier.
 */
export interface ModuleContract {
  module_id: CapabilityModuleId;
  version: ContractVersion;
  status: ModuleStatus;

  purpose: string;
  responsibilities: readonly string[];
  non_responsibilities: readonly string[];

  required_kernel_services: readonly KernelService[];

  input_contracts: readonly string[];
  output_contracts: readonly string[];

  owned_data: readonly string[];
  readable_external_data: readonly string[];
  forbidden_data: readonly string[];

  events_consumed: readonly DomainEventName[];
  events_emitted: readonly DomainEventName[];

  permissions_required: readonly string[];

  ui_shells: readonly UiShellId[];
  product_pack_interfaces: readonly string[];

  localization_requirements: readonly string[];

  external_dependencies: readonly string[];
  agent_dependencies: readonly string[];

  risk_class: RiskClass;

  portable: boolean;
  portable_test_required: boolean;

  disable_behavior: string;
  migration_strategy: string;
  rollback_strategy: string;

  observability: readonly string[];
  audit_requirements: readonly string[];
}
