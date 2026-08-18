import "server-only";

// ARCH-P2 — the state.core facade: the ONE import point for state persistence.
//
// Application consumers import state operations from HERE, never from the legacy repositories
// directly. Behind this boundary sit exactly two adapters — one per persistence family — and the
// two legacy stores remain the persistence authorities:
//
//   current_moment   → currentStateAdapter → lib/server/lifeOs/store (current-state section)
//   versioned_daily  → dailyStateAdapter   → lib/server/dailyCheckInStore
//
// The facade deliberately does NOT export a merged read ("give me the latest state from either
// family"), a generic update, or a generic delete. The two families have different lifecycles, and
// a consumer must say which one it means — that explicitness is the module boundary working, not a
// missing convenience.
//
// KNOWN, DELIBERATE EXCEPTION: lib/server/lifeOs/timeline.ts still reads source stores directly.
// That is continuity.core's P6 projection gap (gap doc §3.6), not a state.core adoption miss, and
// it is allowlisted by name in archP2StateCoreAdapter.test.ts so it cannot silently widen.
//
// Rollback: consumers restore their previous direct import paths and this directory is removed.
// No data rollback can ever be needed — ARCH-P2 migrated nothing.

export {
  // current-moment family (OSF-1 current-state), original names preserved
  createCurrentStateRecord,
  latestCurrentStateRecord,
  listCurrentStateRecords,
  setCurrentStateReflection,
  currentMomentState,
  currentMomentProvenance,
  bindCurrentMomentState,
} from "./currentStateAdapter";
export type { CurrentStateInput, CurrentStateRecord } from "./currentStateAdapter";

export {
  // versioned-daily family (DCI-1 daily check-in), original names preserved
  createDailyRecord,
  correctDailyRecord,
  deleteDailyRecord,
  getDailyRecordForOwner,
  listDailyRecordsForOwner,
  ownerHasAnyDailyRecord,
  versionedDailyState,
  versionedDailyProvenance,
  bindVersionedDailyState,
} from "./dailyStateAdapter";
export type { DailyStateRecord, DailyCreateInput, DailyCorrectInput } from "./dailyStateAdapter";
