// Platform tier — the declared capability-module registry.
//
// The summary tier of the twelve contracts: identity, contract version, honest status, one-line
// purpose. The full per-module contracts live in the contracts document; this registry exists so
// code (and tests) have one queryable truth for "which capabilities exist and what state is their
// boundary in".
//
// STATUSES ARE DECLARATIONS, NOT COMPLETION CLAIMS. `partial` means the product already realizes
// part of the capability WITHOUT the contract boundary; `declared` means the boundary exists on
// paper only. Nothing here asserts conformant code exists (completion truth model).

import type { CapabilityModuleId, ContractVersion, ModuleStatus } from "./moduleContract";

export interface ModuleRegistryEntry {
  module_id: CapabilityModuleId;
  version: ContractVersion;
  status: ModuleStatus;
  purpose: string;
}

export const CAPABILITY_MODULES: readonly ModuleRegistryEntry[] = [
  {
    module_id: "state.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Capture the person's current moment/state, cheaply and reversibly.",
  },
  {
    module_id: "assessment.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Run any structured assessment: sessions, answers, versioned scoring, result references.",
  },
  {
    module_id: "discovery.core",
    version: "0.1.0",
    status: "declared",
    purpose: "Deliver finite, rotating, lightweight discovery experiences.",
  },
  {
    module_id: "experience.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Model lived attempts generically: situation, action, outcome.",
  },
  {
    module_id: "reflection.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Turn allowed context into user reflection the person authors and owns.",
  },
  {
    module_id: "continuity.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Connect meaningful events across time into human-readable continuity.",
  },
  {
    module_id: "comparison.core",
    version: "0.1.0",
    status: "declared",
    purpose: "Generic A-to-B comparison with humane outputs.",
  },
  {
    module_id: "sharing.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Convert private objects into explicit public-safe derivatives, and nothing else.",
  },
  {
    module_id: "connection.core",
    version: "0.1.0",
    status: "declared",
    purpose: "Explicit person-to-person connection and pair context.",
  },
  {
    module_id: "community.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Low-pressure, structured, finite multi-user experience.",
  },
  {
    module_id: "matching.core",
    version: "0.1.0",
    status: "declared",
    purpose: "Generate eligible match candidates from allowed context, with explanations.",
  },
  {
    module_id: "recommendation.core",
    version: "0.1.0",
    status: "partial",
    purpose: "Select a finite set of relevant next options from eligible candidates.",
  },
] as const;

/** Look up one capability's registry entry, or null when the id is not a declared capability. */
export function getCapabilityModule(moduleId: string): ModuleRegistryEntry | null {
  return CAPABILITY_MODULES.find((entry) => entry.module_id === moduleId) ?? null;
}
