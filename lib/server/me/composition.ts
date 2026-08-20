import "server-only";

// ARCH-P7 — the Yorisou Me composition: which module owns each of the five parts.
//
// THIS FILE IS THE ONLY PLACE THE MAPPING LIVES. The reference architecture §4 says Me shows,
// separately: current state · Imairo · user-confirmed durable context · Yorisou observations and
// patterns · user-confirmed values. Screen 17 names its dependencies: state.core, assessment.core
// and governed Memory in the Kernel. Every line below is that sentence turned into a read, and
// none of it is a new idea about what a person is.
//
// EACH PART IS READ THROUGH THE MODULE THAT OWNS IT, not from a table this file picked. That is
// the whole point of P7: before it, a surface that wanted to show someone their own picture went
// and assembled it from stores itself, which is how two screens end up disagreeing about the same
// person. The composition now has one definition and every surface uses it.
//
// WHAT IS DELIBERATELY NOT HERE:
//   * no storage — nothing about the composition is written, so there is no second profile to
//     drift, to migrate, to leak, or to forget to erase when an account is deleted;
//   * no merging — the parts are returned separately, because a blended portrait is an identity
//     claim and Imairo's own contract calls its result a Recognition Moment, not a declaration;
//   * no observations — pattern detection is a V1.5 capability. It is declared `deferred` by the
//     platform contract rather than faked here, and wiring a reader to it would turn it on.

import { latestCurrentStateRecord } from "@/lib/server/platform/stateCore";
import { listEligibleMemories } from "@/lib/server/lifeOs/store";
import { listSavedTestResultsForOwner } from "@/lib/server/testResults";
import { listValuesAssessmentsForOwner } from "@/lib/server/yorisouValuesStore";
import { IMAIRO_SNAPSHOT_TEST_ID } from "@/lib/yorisou/public-result/snapshot";
import { composeMe, type MePartReaders } from "@/lib/server/platform/meComposition/service";
import type { MeComposition } from "@/lib/platform/meComposition";

/**
 * The five readers.
 *
 * Each returns a REFERENCE or null, and each is owner-scoped by the module it delegates to — this
 * file adds no owner predicate of its own precisely so it cannot become a second, weaker one.
 */
export const YORISOU_ME_READERS: MePartReaders = {
  // 1. current state — state.core (ARCH-P2 already owns this read).
  current_state: async (ownerRef) => {
    const record = await latestCurrentStateRecord(ownerRef);
    return record ? { ref: record.id, at: record.created_at } : null;
  },

  // 2. Imairo — assessment.core.
  //
  // THE STORED ID IS NOT THE METHOD ID, and this cost a real defect to learn. The assessment method
  // contract names the INSTRUMENT (`imairo-120q`); the saved snapshot names the stored ROW
  // (`IMAIRO-120Q`), and the results table's own check constraint only accepts the latter. Matching
  // on the method id compiled, typechecked and returned "no Imairo" forever — the failure mode a
  // composition must never have, because "you have not taken it" is indistinguishable from a bug.
  //
  // So the id comes from the constant the WRITER uses. If the stored identifier ever changes, this
  // read changes with it instead of silently going quiet.
  assessment_recognition: async (ownerRef) => {
    const saved = await listSavedTestResultsForOwner(ownerRef);
    const imairo = saved.find((row) => row.test_id === IMAIRO_SNAPSHOT_TEST_ID);
    return imairo ? { ref: imairo.id, at: imairo.created_at } : null;
  },

  // 3. user-confirmed durable context — governed Memory in the Kernel. `listEligibleMemories` is
  // the ACTIVE-lifecycle read: a memory a person suppressed or revoked is not eligible, so a
  // withdrawn memory cannot reappear as part of the picture they are shown of themselves. That is
  // the entire reason this uses the eligible read rather than the management one.
  confirmed_durable_context: async (ownerRef) => {
    const memories = await listEligibleMemories(ownerRef, 1);
    const newest = memories[0];
    return newest ? { ref: newest.id, at: newest.created_at } : null;
  },

  // 4. observations / patterns — V1.5. No reader, on purpose. See the platform contract.

  // 5. user-confirmed values — YV-1. "Confirmed" is the record's own word: an assessment a person
  // answered but marked `not_quite` or `skipped` is not something they confirmed about themselves,
  // and showing it here would put words in their mouth.
  confirmed_values: async (ownerRef) => {
    const assessments = await listValuesAssessmentsForOwner(ownerRef, 20);
    const confirmed = assessments.find((row) => row.confirmation === "confirmed");
    return confirmed ? { ref: confirmed.id, at: confirmed.produced_at } : null;
  },
};

/** One person's picture of themselves, composed at read time from the modules that own it. */
export function composeYorisouMe(ownerAccountId: string): Promise<MeComposition> {
  return composeMe(ownerAccountId, YORISOU_ME_READERS);
}
