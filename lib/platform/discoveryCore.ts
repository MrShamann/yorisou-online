// Platform tier — the discovery.core capability contract and its pure runtime helpers.
//
// Daily Discovery is FINITE by contract: a scheduled, eligibility-gated, cooldown-bounded
// experience that completes. Nothing here supports a feed, a reroll, a streak, or a score — those
// are not missing features, they are refused shapes.
//
// The capability/pack split is the whole point of this file: the capability owns scheduling,
// eligibility, cooldown and deterministic selection AS MECHANICS; a Product Pack owns every result
// id, every line of consumer copy, the calendar timezone, and the cooldown depth AS CONTENT. This
// file therefore knows no pack, no result, no product, no storage — and the guard suite keeps it
// that way mechanically.
//
// A discovery result is SYMBOLIC_INTERPRETATION in the knowledge-type truth model. It is not a
// current state, not a test inference, not a memory, and nothing in this contract can write any of
// those (memory_access: none / memory_write_scope: none).

/** The canonical pattern-family vocabulary. Declarative: naming a family is not implementing it. */
export const DISCOVERY_PATTERN_FAMILIES = [
  "symbol_draw",
  "visual_choice",
  "binary_choice",
  "three_question",
  "mini_story",
  "seasonal",
] as const;

export type DiscoveryPatternFamily = (typeof DISCOVERY_PATTERN_FAMILIES)[number];

/**
 * What a Product Pack must declare for the capability to run it. Content stays in the pack; the
 * definition carries only the mechanics the runtime needs.
 */
export interface DiscoveryPatternDefinition<TResultId extends string = string> {
  pack_ref: string;
  pack_version: string;
  pattern_family: DiscoveryPatternFamily;
  /** IANA timezone whose calendar day bounds "today" for this pack. */
  calendar_timezone: string;
  /** The full, finite result-id pool. Order is presentation-neutral; selection sorts internally. */
  result_ids: readonly TResultId[];
  /** How many most-recent results are excluded from today's pool (0 disables the cooldown). */
  recent_exclusion_window: number;
}

/** One completed discovery, as a portable reference: mechanics only, no owner, no copy. */
export interface DiscoveryResultReference {
  pattern_family: DiscoveryPatternFamily;
  pack_ref: string;
  pack_version: string;
  result_ref: string;
  completed_at: string;
}

/** Opaque reference to a stored session alongside its result reference. */
export interface DiscoverySessionReference {
  session_ref: string;
  result: DiscoveryResultReference;
}

/** Today's schedule for one owner and one pack: the local date and whether it is already spent. */
export interface DiscoveryScheduleView {
  local_date: string;
  completed: boolean;
}

/**
 * The calendar day of `instant` in `timeZone`, as YYYY-MM-DD. The pack's timezone — never the
 * client's — bounds a discovery day, so "one per day" cannot be replayed by lying about locale.
 */
export function localDateForTimezone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/**
 * Today's eligible candidate pool: the full pool minus the `window` most recent result ids —
 * falling back to the FULL pool when the cooldown would exclude everything. The fallback is a
 * contract guarantee: a small pack must degrade to repetition, never to "nothing today".
 */
export function eligibleCandidates<TResultId extends string>(
  all: readonly TResultId[],
  recent: readonly string[],
  window: number,
): readonly TResultId[] {
  const excluded = new Set(recent.slice(0, Math.max(0, window)));
  const eligible = all.filter((id) => !excluded.has(id));
  return eligible.length > 0 ? eligible : all;
}

/**
 * Deterministic selection: the same seed and the same candidate pool always select the same
 * candidate, on any runtime. FNV-1a over the seed; candidates are sorted first so pool ORDER never
 * changes the outcome, only pool MEMBERSHIP does. Deliberately not random and never presented as
 * fate — determinism is what makes "revisiting today returns the same result" a property instead
 * of a database trick.
 */
export function selectDeterministic<TResultId extends string>(
  seed: string,
  candidates: readonly TResultId[],
): TResultId {
  if (candidates.length === 0) throw new Error("discovery_selection_pool_empty");
  const pool = [...candidates].sort();
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return pool[hash % pool.length];
}
