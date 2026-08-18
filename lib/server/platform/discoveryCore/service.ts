import "server-only";

// ARCH-P3 — the generic discovery runtime. Capability mechanics ONLY:
//
//   derive the pack's calendar day
//   → return today's canonical session if one exists (revisiting never re-draws)
//   → cooldown-filter the candidate pool (fall back to the full pool, never to nothing)
//   → select deterministically (same owner + day + pack version + eligible set → same result)
//   → persist ONE idempotent session (the repository's conflict rule makes the first write canonical)
//
// The pack owns content; the repository owns persistence; this service owns the sequence. It reads
// nothing personal beyond the discovery repository itself — no state, no memory, no reflection, no
// assessment — and the guard suite asserts that import graph stays empty.
//
// The client selects NOTHING. Result id, pack identity, version, date and timezone are all derived
// or configured server-side; the only caller-supplied fact is the authenticated owner.

import { createHash } from "crypto";

import {
  eligibleCandidates,
  localDateForTimezone,
  selectDeterministic,
  type DiscoveryPatternDefinition,
} from "@/lib/platform/discoveryCore";

/** What the runtime needs from a persistence repository. Concrete stores live in the product tier. */
export interface DiscoverySessionRow {
  id: string;
  local_date: string;
  pack_id: string;
  pack_version: string;
  pattern_family: string;
  result_id: string;
  completed_at: string;
}

export interface DiscoveryRepository {
  getSessionForDate(ownerAccountId: string, localDate: string, packId: string): Promise<DiscoverySessionRow | null>;
  /** Most recent result ids for this owner+pack, newest first, bounded by `limit`. */
  listRecentResultIds(ownerAccountId: string, packId: string, limit: number): Promise<string[]>;
  /**
   * Idempotent completion: insert-if-absent for (owner, local_date, pack), then return the
   * CANONICAL row for that day — the first writer's row, never the retry's.
   */
  completeSession(input: {
    ownerAccountId: string;
    localDate: string;
    calendarTimezone: string;
    packId: string;
    packVersion: string;
    patternFamily: string;
    resultId: string;
    completedAt: string;
  }): Promise<DiscoverySessionRow>;
}

/** Today's schedule for one owner: the pack-calendar date and the canonical session if spent. */
export async function readTodaysDiscovery(input: {
  ownerAccountId: string;
  definition: DiscoveryPatternDefinition;
  repository: DiscoveryRepository;
  now?: Date;
}): Promise<{ localDate: string; session: DiscoverySessionRow | null }> {
  const localDate = localDateForTimezone(input.now ?? new Date(), input.definition.calendar_timezone);
  const session = await input.repository.getSessionForDate(
    input.ownerAccountId,
    localDate,
    input.definition.pack_ref,
  );
  return { localDate, session };
}

/**
 * Complete today's discovery for this owner — or return the already-canonical session unchanged.
 * The seed hashes the owner (fingerprint, never raw), the day, the pack@version, and the eligible
 * set, so the same inputs always reproduce the same selection and a cooldown change legitimately
 * changes it.
 */
export async function completeTodaysDiscovery(input: {
  ownerAccountId: string;
  definition: DiscoveryPatternDefinition;
  repository: DiscoveryRepository;
  now?: Date;
}): Promise<DiscoverySessionRow> {
  const { definition, repository, ownerAccountId } = input;
  const nowInstant = input.now ?? new Date();
  const localDate = localDateForTimezone(nowInstant, definition.calendar_timezone);

  const existing = await repository.getSessionForDate(ownerAccountId, localDate, definition.pack_ref);
  if (existing) return existing;

  const recent = await repository.listRecentResultIds(
    ownerAccountId,
    definition.pack_ref,
    definition.recent_exclusion_window,
  );
  const eligible = eligibleCandidates(definition.result_ids, recent, definition.recent_exclusion_window);

  const ownerFingerprint = createHash("sha256").update(ownerAccountId).digest("hex");
  const seed = [
    ownerFingerprint,
    localDate,
    `${definition.pack_ref}@${definition.pack_version}`,
    [...eligible].sort().join(","),
  ].join(":");
  const resultId = selectDeterministic(seed, eligible);

  return repository.completeSession({
    ownerAccountId,
    localDate,
    calendarTimezone: definition.calendar_timezone,
    packId: definition.pack_ref,
    packVersion: definition.pack_version,
    patternFamily: definition.pattern_family,
    resultId,
    completedAt: nowInstant.toISOString(),
  });
}
