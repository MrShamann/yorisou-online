// Platform tier — the declared capability-module registry.
//
// The summary tier of the twelve contracts: identity, contract version, the THREE distinct state
// axes (repo adoption, governance lifecycle, verification), privacy class, one-line purpose. The
// full per-module contracts live in the contracts document; this registry exists so code (and
// tests) have one queryable truth for "which capabilities exist and what state is their boundary
// in".
//
// STATES ARE DECLARATIONS, NOT COMPLETION CLAIMS. `adoption_status: partial` means the product
// already realizes part of the capability WITHOUT the contract boundary; `declared` means the
// boundary exists on paper only. Every module's governance lifecycle is `DEFINED` (contract and
// risk class exist — and nothing more is claimed) and `verification_state` is `not_verified`:
// validation and activation are separate gates, and neither has run for any module as a
// contract-conformant unit.

import type {
  CapabilityModuleId,
  ContractVersion,
  ModuleAdoptionStatus,
  ModuleLifecycleState,
  ModuleVerificationState,
  PrivacyClass,
} from "./moduleContract";

export interface ModuleRegistryEntry {
  module_id: CapabilityModuleId;
  version: ContractVersion;
  adoption_status: ModuleAdoptionStatus;
  lifecycle_state: ModuleLifecycleState;
  verification_state: ModuleVerificationState;
  privacy_class: PrivacyClass;
  purpose: string;
}

const DEFINED: ModuleLifecycleState = "DEFINED";
const NOT_VERIFIED: ModuleVerificationState = "not_verified";

export const CAPABILITY_MODULES: readonly ModuleRegistryEntry[] = [
  {
    module_id: "state.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal_sensitive",
    purpose: "Capture the person's current moment/state, cheaply and reversibly.",
  },
  {
    module_id: "assessment.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal_sensitive",
    purpose: "Run any structured assessment: sessions, answers, versioned scoring, result references.",
  },
  {
    module_id: "discovery.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Deliver finite, rotating, lightweight discovery experiences.",
  },
  {
    module_id: "experience.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Model lived attempts generically: situation, action, outcome.",
  },
  {
    module_id: "reflection.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal_sensitive",
    purpose: "Turn allowed context into user reflection the person authors and owns.",
  },
  {
    module_id: "continuity.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Connect meaningful events across time into human-readable continuity.",
  },
  {
    module_id: "comparison.core",
    version: "0.2.0",
    adoption_status: "declared",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Generic A-to-B comparison with humane outputs.",
  },
  {
    module_id: "sharing.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "public_derivative",
    purpose: "Convert private objects into explicit public-safe derivatives, and nothing else.",
  },
  {
    module_id: "connection.core",
    version: "0.2.0",
    adoption_status: "declared",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Explicit person-to-person connection and pair context.",
  },
  {
    module_id: "community.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Low-pressure, structured, finite multi-user experience.",
  },
  {
    module_id: "matching.core",
    version: "0.2.0",
    adoption_status: "declared",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Generate eligible match candidates from allowed context, with explanations.",
  },
  {
    module_id: "recommendation.core",
    version: "0.2.0",
    adoption_status: "partial",
    lifecycle_state: DEFINED,
    verification_state: NOT_VERIFIED,
    privacy_class: "personal",
    purpose: "Select a finite set of relevant next options from eligible candidates.",
  },
] as const;

/** Look up one capability's registry entry, or null when the id is not a declared capability. */
export function getCapabilityModule(moduleId: string): ModuleRegistryEntry | null {
  return CAPABILITY_MODULES.find((entry) => entry.module_id === moduleId) ?? null;
}
