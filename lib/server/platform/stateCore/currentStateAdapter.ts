import "server-only";

// ARCH-P2 — the current-moment adapter: binds the state.core `current_moment` family to the
// EXISTING OSF-1 current-state repository. The repository stays the persistence authority; this
// file adds a contract-conformant surface over it and changes nothing about what it does.
//
// THE ONE RULE THIS FILE ENFORCES BY CONSTRUCTION: it imports exactly one persistence family. A
// current-moment operation can only ever reach `yorisou_current_state_records` through the
// existing store — there is no code path here that could touch the daily-state family, so
// "no dual write" is a property of the import graph, not of reviewer vigilance
// (archP2StateCoreAdapter.test.ts asserts it structurally).
//
// Functions are re-exported under their ORIGINAL names on purpose: adopting the boundary is an
// import-path change for consumers, never a call-site rewrite — which is also what keeps the
// ARCH-P1 seam test's structural assertions true without touching them, and what makes rollback
// "restore the old import path" and nothing more.

import {
  createCurrentStateRecord,
  latestCurrentStateRecord,
  listCurrentStateRecords,
  setCurrentStateReflection,
} from "@/lib/server/lifeOs/store";
import type { CurrentStateInput, CurrentStateRecord } from "@/lib/life-os/contract";
import type { CurrentMomentStateOperations, StateProvenance } from "@/lib/platform/stateCore";

export { createCurrentStateRecord, latestCurrentStateRecord, listCurrentStateRecords, setCurrentStateReflection };
export type { CurrentStateInput, CurrentStateRecord };

/**
 * Normalized provenance for a current-moment record: family + record ref + capture instant.
 * Never the owner — `owner_account_id` does not cross the contract boundary.
 */
export function currentMomentProvenance(record: Pick<CurrentStateRecord, "id" | "created_at">): StateProvenance {
  return { family: "current_moment", record_ref: record.id, captured_at: record.created_at };
}

/**
 * Build the contract-conformant operations object over an injectable repository. The default
 * export below binds the real store; tests inject fakes to prove the mapping is lossless without
 * a database. The binding is 1:1 — no argument is reshaped, no semantic is added or removed.
 */
export function bindCurrentMomentState(repository: {
  createCurrentStateRecord: typeof createCurrentStateRecord;
  setCurrentStateReflection: typeof setCurrentStateReflection;
  listCurrentStateRecords: typeof listCurrentStateRecords;
  latestCurrentStateRecord: typeof latestCurrentStateRecord;
}): CurrentMomentStateOperations<CurrentStateRecord, CurrentStateInput> {
  return {
    family: "current_moment",
    create: (ownerRef, input) => repository.createCurrentStateRecord(ownerRef, input),
    annotate: (ownerRef, recordRef, reflection) =>
      repository.setCurrentStateReflection(ownerRef, recordRef, reflection),
    list: (ownerRef, limit) =>
      limit === undefined
        ? repository.listCurrentStateRecords(ownerRef)
        : repository.listCurrentStateRecords(ownerRef, limit),
    latest: (ownerRef) => repository.latestCurrentStateRecord(ownerRef),
    provenanceOf: currentMomentProvenance,
  };
}

/** The current-moment family, bound to the real repository. */
export const currentMomentState = bindCurrentMomentState({
  createCurrentStateRecord,
  setCurrentStateReflection,
  listCurrentStateRecords,
  latestCurrentStateRecord,
});
