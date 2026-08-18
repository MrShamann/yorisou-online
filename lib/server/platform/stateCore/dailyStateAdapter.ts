import "server-only";

// ARCH-P2 — the versioned-daily adapter: binds the state.core `versioned_daily` family to the
// EXISTING DCI-1 daily-check-in repository. The repository stays the persistence authority; every
// DCI rule it encodes — local-date identity, server-authoritative time, same-local-day versioned
// correction, governed erasure — passes through UNCHANGED. Nothing here generalizes those rules
// into generic CRUD, because generalizing them would be removing them.
//
// Imports exactly one persistence family (see currentStateAdapter.ts for why that is the
// no-dual-write proof), and re-exports the store functions under their ORIGINAL names so adoption
// is an import-path change and rollback is the reverse.
//
// Method-specific truth — runtime definition, acknowledgement selection, correction windows,
// timezone validation, response copy — deliberately does NOT live here. The contract carries the
// lifecycle; the DCI method keeps its meaning.

import {
  createDailyRecord,
  correctDailyRecord,
  deleteDailyRecord,
  getDailyRecordForOwner,
  listDailyRecordsForOwner,
  ownerHasAnyDailyRecord,
  type DailyStateRecord,
} from "@/lib/server/dailyCheckInStore";
import type { StateProvenance, VersionedDailyStateOperations } from "@/lib/platform/stateCore";

export {
  createDailyRecord,
  correctDailyRecord,
  deleteDailyRecord,
  getDailyRecordForOwner,
  listDailyRecordsForOwner,
  ownerHasAnyDailyRecord,
};
export type { DailyStateRecord };

export type DailyCreateInput = Parameters<typeof createDailyRecord>[0];
export type DailyCorrectInput = Parameters<typeof correctDailyRecord>[0];

/**
 * Normalized provenance for a versioned-daily record: family + record ref + the produced instant.
 * Never the owner — `owner_account_id` does not cross the contract boundary.
 */
export function versionedDailyProvenance(record: Pick<DailyStateRecord, "id" | "produced_at">): StateProvenance {
  return { family: "versioned_daily", record_ref: record.id, captured_at: record.produced_at };
}

/**
 * Build the contract-conformant operations object over an injectable repository. The default
 * export below binds the real store; tests inject fakes to prove the mapping is lossless without
 * a database. The binding is 1:1 — `correct` stays local-date/version-specific, `erase` stays the
 * governed erasure, and no generic update/delete exists to hide behind.
 */
export function bindVersionedDailyState(repository: {
  createDailyRecord: typeof createDailyRecord;
  correctDailyRecord: typeof correctDailyRecord;
  deleteDailyRecord: typeof deleteDailyRecord;
  listDailyRecordsForOwner: typeof listDailyRecordsForOwner;
  getDailyRecordForOwner: typeof getDailyRecordForOwner;
  ownerHasAnyDailyRecord: typeof ownerHasAnyDailyRecord;
}): VersionedDailyStateOperations<DailyStateRecord, DailyCreateInput, DailyCorrectInput> {
  return {
    family: "versioned_daily",
    create: (input) => repository.createDailyRecord(input),
    correct: (input) => repository.correctDailyRecord(input),
    erase: (ownerRef, entryLocalDate) => repository.deleteDailyRecord(ownerRef, entryLocalDate),
    listSince: (ownerRef, sinceLocalDate, limit) =>
      limit === undefined
        ? repository.listDailyRecordsForOwner(ownerRef, sinceLocalDate)
        : repository.listDailyRecordsForOwner(ownerRef, sinceLocalDate, limit),
    getForDate: (ownerRef, entryLocalDate) => repository.getDailyRecordForOwner(ownerRef, entryLocalDate),
    hasAny: (ownerRef) => repository.ownerHasAnyDailyRecord(ownerRef),
    provenanceOf: versionedDailyProvenance,
  };
}

/** The versioned-daily family, bound to the real repository. */
export const versionedDailyState = bindVersionedDailyState({
  createDailyRecord,
  correctDailyRecord,
  deleteDailyRecord,
  listDailyRecordsForOwner,
  getDailyRecordForOwner,
  ownerHasAnyDailyRecord,
});
