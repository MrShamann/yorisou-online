import "server-only";

// OSF-1 PHASE E + F — the chronological timeline, and the return view.
//
// ─────────────────────────────────────────────────────────────────────────────
// THIS IS A CHRONOLOGICAL VIEW. IT IS NOT A LIFE GRAPH.
// ─────────────────────────────────────────────────────────────────────────────
//
// The distinction is the whole constraint, so it is worth being exact about where the line is:
//
//   A view SORTS records that already exist, by a timestamp they already carry, and stores nothing.
//   A graph ASSERTS RELATIONSHIPS between records — edges, inferred links, "this reflection is about
//   that goal" — and that assertion is a new claim about a person that has to be stored, governed
//   and erased.
//
// So there is no relationships table, no edge, no inference, and no persistence here. Every function
// reads owner-scoped rows and orders them by created_at. The one link that appears —
// reflection.experience_id — is a foreign key the PERSON created by choosing to reflect on an
// experience; it is not derived.
//
// ASSESSMENT RESULTS ARE EXCLUDED, DELIBERATELY. lib/life-os/boundaries.ts states that a
// CurrentStateRecord and an Imairo Result must never auto-convert, overwrite or replace each other,
// and osf1Boundaries.test.ts fails if an OSF-1 module imports an assessment module. A timeline that
// mixed a two-tap check-in with a 120-question methodology result would present them as the same
// kind of evidence — which is exactly the confusion that boundary exists to prevent. Adding them is
// a methodology change requiring its own Founder authorization.
//
// BOUNDED READS. Personal_Archive_and_Memory_Governance §4 prohibits bulk memory reads. Every query
// here carries an explicit limit and the memory slice is the smallest of them; nothing offers "all".

import {
  listCurrentStateRecords,
  listGoals,
  listEligibleMemories,
  listReflections,
} from "@/lib/server/lifeOs/store";
import { continuitySchemaReady } from "@/lib/yorisou/continuity/access";
import { continuityRepository } from "@/lib/server/continuity/store";
import { readTimelinePage } from "@/lib/server/platform/continuityCore/service";
import type {
  ContinuitySourceFamily,
  TimelineMoment,
} from "@/lib/platform/continuityCore";
import { reflectionQuestionsFor } from "@/lib/life-os/contract";
import type {
  CurrentStateRecord,
  ExplicitMemory,
  Goal,
  LifeReflection,
  ReflectionField,
} from "@/lib/life-os/contract";

export type TimelineEntry =
  | { kind: "current_state"; at: string; id: string; record: CurrentStateRecord }
  | { kind: "goal"; at: string; id: string; record: Goal }
  | { kind: "reflection"; at: string; id: string; record: LifeReflection }
  | { kind: "memory"; at: string; id: string; record: ExplicitMemory }
  | { kind: "experience"; at: string; id: string; record: { id: string; title: string | null; situation: string | null } };

/** Deliberately modest. A timeline is for recognising a thread, not for auditing a life. */
const DEFAULT_LIMIT = 20;

type ExperienceRow = { id: string; title: string | null; situation: string | null; created_at: string };

async function ownExperiences(ownerAccountId: string, limit: number): Promise<ExperienceRow[]> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return [];
  const params = new URLSearchParams({
    select: "id,title,situation,created_at",
    owner_account_id: `eq.${ownerAccountId}`,
    deleted_at: "is.null",
    withdrawn_at: "is.null",
    order: "created_at.desc",
    limit: String(limit),
  });
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/yorisou_experience_cards?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) return [];
  return (await response.json()) as ExperienceRow[];
}

/**
 * The person's own records, newest first, across five kinds.
 *
 * Each slice is fetched independently and failure-tolerant: one unreachable table yields an empty
 * slice rather than an empty timeline, because a partial thread is still worth showing.
 */
export async function lifeTimeline(ownerAccountId: string, limit = DEFAULT_LIMIT): Promise<TimelineEntry[]> {
  const [states, goals, reflections, memories, experiences] = await Promise.all([
    listCurrentStateRecords(ownerAccountId, limit).catch(() => []),
    listGoals(ownerAccountId, limit).catch(() => []),
    listReflections(ownerAccountId, limit).catch(() => []),
    listEligibleMemories(ownerAccountId, limit).catch(() => []),
    ownExperiences(ownerAccountId, limit).catch(() => []),
  ]);

  const entries: TimelineEntry[] = [
    ...states.map((record) => ({ kind: "current_state" as const, at: record.created_at, id: record.id, record })),
    ...goals.map((record) => ({ kind: "goal" as const, at: record.created_at, id: record.id, record })),
    ...reflections.map((record) => ({ kind: "reflection" as const, at: record.created_at, id: record.id, record })),
    ...memories.map((record) => ({ kind: "memory" as const, at: record.created_at, id: record.id, record })),
    ...experiences.map((row) => ({
      kind: "experience" as const,
      at: row.created_at,
      id: row.id,
      record: { id: row.id, title: row.title, situation: row.situation },
    })),
  ];

  return entries
    .filter((entry) => typeof entry.at === "string")
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// KEYSET PAGINATION over the merged timeline
// ─────────────────────────────────────────────────────────────────────────────
//
// WHY THIS IS NOT JUST A BIGGER LIMIT. A fixed cap hides everything past it, exactly the way the
// memory list hid a person's fifty-first memory. The timeline is worse, because it merges five
// sources: a naive cap silently favours whichever kind happens to be newest.
//
// HOW A MERGED KEYSET WORKS HERE. Each source is asked for at most `limit + 1` rows that fall after
// the cursor. Merging those gives at least `limit` correct rows whenever `limit` exist, because no
// source can contribute more than `limit + 1` before the merge cuts it. Bounded work: five queries
// of `limit + 1`, never the whole history, and never a client-side slice of everything.
//
// The sort key is (occurred_at DESC, id DESC). The id is the tie-break and it is not decoration —
// five sources produce ties routinely, and a cursor into an undefined order is not stable.
//
// SUPPORTED KINDS. Current State, Experience, Reflection (light), Deep Reflection, Direction. Memory
// is deliberately NOT a timeline kind: a memory is a standing note with its own surface and its own
// lifecycle controls, not something that happened at a moment. It was previously merged in; removing
// it is the intended Phase 1 shape, not an omission.

export const TIMELINE_FILTERS = ["ALL", "STATE", "EXPERIENCE", "REFLECTION", "POSTMORTEM", "DIRECTION"] as const;
export type TimelineFilter = (typeof TIMELINE_FILTERS)[number];

/** Natural Japanese for the consumer control. Internal ids stay English. */
export const TIMELINE_FILTER_LABELS: Record<TimelineFilter, string> = {
  ALL: "すべて",
  STATE: "状態",
  // 経験, not 体験. The two words were used for one thing ON THE SAME PAGE: this chip said 体験 while
  // every entry it filtered was labelled 経験, and the hub, the page title, the memory type and the
  // Return section all say 経験 too. 体験 belongs to the older /experiences vertical (体験カード) and is
  // still correct there; inside the Life OS this is the outlier, so it moves.
  EXPERIENCE: "経験",
  // かるく振り返る, not 振り返り — and this one is a COMPREHENSION fix, not a tidying one.
  //
  // The two chips read 「振り返り」 and 「じっくり振り返る」, which says: reflections, and deep reflections.
  // That is not what they do. REFLECTION shows ONLY light reflections and deliberately excludes
  // postmortems (the reflection end-to-end test asserts exactly that), so the broader-sounding name
  // was the narrower filter, and someone pressing it to see everything they had written would find
  // half of it missing with no way to tell why.
  //
  // Named as its own act, the pair is symmetric and each chip means what its entries are labelled:
  // かるく振り返る / じっくり振り返る, the same two words the hub offers.
  REFLECTION: "かるく振り返る",
  POSTMORTEM: "じっくり振り返る",
  DIRECTION: "方向",
};

export function parseTimelineFilter(value: unknown): TimelineFilter {
  if (value === undefined || value === null || value === "") return "ALL";
  if (typeof value !== "string" || !TIMELINE_FILTERS.includes(value as TimelineFilter)) {
    throw new Error("osf1_timeline_filter_invalid");
  }
  return value as TimelineFilter;
}

export type TimelinePage = { entries: TimelineEntry[]; nextCursor: string | null; filter: TimelineFilter };

function encodeTimelineCursor(entry: TimelineEntry, filter: TimelineFilter): string {
  // The filter travels INSIDE the cursor. A cursor minted under one filter cannot be replayed under
  // another: the position it describes is meaningless in a differently-composed list, and silently
  // accepting it would skip or repeat rows with no error anywhere.
  return Buffer.from(`${filter}|${entry.at}|${entry.id}`, "utf8").toString("base64url");
}

function decodeTimelineCursor(cursor: string, filter: TimelineFilter): { at: string; id: string } | null {
  try {
    const [encodedFilter, at, id] = Buffer.from(cursor, "base64url").toString("utf8").split("|");
    if (encodedFilter !== filter) return null;
    if (!at || !id || !/^[0-9a-f-]{36}$/i.test(id)) return null;
    if (Number.isNaN(Date.parse(at))) return null;
    return { at, id };
  } catch {
    return null;
  }
}

/** The keyset predicate every source shares, expressed as PostgREST's `or=` form. */
function afterCursor(params: URLSearchParams, at: string, id: string): void {
  params.set("or", `(created_at.lt.${at},and(created_at.eq.${at},id.lt.${id}))`);
}

async function pageOf<T>(table: string, select: string, owner: string, limit: number,
                         cursor: { at: string; id: string } | null,
                         extra: Record<string, string> = {}): Promise<T[]> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return [];
  const params = new URLSearchParams({
    select,
    owner_account_id: `eq.${owner}`,
    order: "created_at.desc,id.desc",
    limit: String(limit + 1),
    ...extra,
  });
  if (cursor) afterCursor(params, cursor.at, cursor.id);
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) return [];
  return (await response.json()) as T[];
}

/**
 * THE PRE-CNT-1 READER. Kept for exactly two reasons, neither of which is "in case the new one is
 * wrong":
 *
 *   1. A deployment whose database has not had 202608200001 applied has no projection index to
 *      read. Until an operator declares the schema ready, this IS the correct answer, not a
 *      fallback from a preferred one.
 *   2. The equivalence proof runs both readers over one fixture and compares them. Deleting this
 *      would delete the only thing the new reader can be checked against.
 *
 * It is NOT authoritative once the schema is ready, and archP6Continuity.test.ts fails if the
 * projection path ever reaches for it.
 */
export async function legacyAggregatedTimelinePage(
  ownerAccountId: string,
  options: { cursor?: string | null; limit?: number; filter?: TimelineFilter } = {},
): Promise<TimelinePage> {
  const filter = options.filter ?? "ALL";
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), 50);
  let cursor: { at: string; id: string } | null = null;
  if (options.cursor) {
    cursor = decodeTimelineCursor(options.cursor, filter);
    // Refused rather than treated as "start again" — silently restarting is how a person scrolls
    // forever without noticing they are re-reading page one.
    if (!cursor) throw new Error("osf1_timeline_cursor_invalid");
  }

  const wants = (kind: TimelineFilter) => filter === "ALL" || filter === kind;
  const [states, goals, reflections, experiences] = await Promise.all([
    wants("STATE")
      ? pageOf<CurrentStateRecord>("yorisou_current_state_records",
          "id,state_tags,mood,energy,situation,reflection,source,created_at", ownerAccountId, limit, cursor).catch(() => [])
      : Promise.resolve([]),
    wants("DIRECTION")
      ? pageOf<Goal>("yorisou_goals", "id,title,description,status,created_at,updated_at",
          ownerAccountId, limit, cursor).catch(() => [])
      : Promise.resolve([]),
    wants("REFLECTION") || wants("POSTMORTEM")
      ? pageOf<LifeReflection>("yorisou_life_reflections",
          "id,experience_id,current_state_record_id,mode,what_happened,felt,tried,what_followed,next_time,goal_at_the_time,information_at_hand,options_considered,decision_made,why,what_learned,created_at",
          ownerAccountId, limit, cursor,
          // The two reflection filters read the same table and differ only by mode, which is the
          // whole reason the mode is a column rather than an audit reason.
          filter === "REFLECTION" ? { mode: "eq.light" } : filter === "POSTMORTEM" ? { mode: "eq.postmortem" } : {},
        ).catch(() => [])
      : Promise.resolve([]),
    wants("EXPERIENCE")
      ? pageOf<ExperienceRow>("yorisou_experience_cards", "id,title,situation,created_at",
          ownerAccountId, limit, cursor, { deleted_at: "is.null", withdrawn_at: "is.null" }).catch(() => [])
      : Promise.resolve([]),
  ]);

  const merged: TimelineEntry[] = [
    ...states.map((record) => ({ kind: "current_state" as const, at: record.created_at, id: record.id, record })),
    ...goals.map((record) => ({ kind: "goal" as const, at: record.created_at, id: record.id, record })),
    ...reflections.map((record) => ({ kind: "reflection" as const, at: record.created_at, id: record.id, record })),
    ...experiences.map((row) => ({
      kind: "experience" as const, at: row.created_at, id: row.id,
      record: { id: row.id, title: row.title, situation: row.situation },
    })),
  ];

  const sorted = merged
    .filter((entry) => typeof entry.at === "string")
    .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  const entries = sorted.slice(0, limit);
  const more = sorted.length > entries.length;
  return {
    entries,
    nextCursor: more && entries.length > 0 ? encodeTimelineCursor(entries[entries.length - 1], filter) : null,
    filter,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARCH-P6 — the timeline reads continuity.core
// ─────────────────────────────────────────────────────────────────────────────
//
// WHAT CHANGED, AND WHAT DELIBERATELY DID NOT.
//
// The index moved; the rendering did not. Order, filtering, paging and identity now come from one
// owner-scoped projection table, and the records themselves are still hydrated from their own
// stores. A person sees exactly what they saw before — same entries, same order, same records.
//
// WHY THAT SPLIT IS THE POINT. The projection carries no title, no body and no answers, so it can
// never become a second, staler copy of a private record. It carries WHICH source, WHEN, and WHICH
// sub-view, which is precisely what an index needs and nothing more. Deletion correctness stops
// being something every reader must remember to filter for and becomes a property of the index: an
// AFTER trigger on each source invalidates the moment in the same transaction that removes the
// source, and invalidation is terminal in SQL, so no delayed writer can bring it back.
//
// THE FIVE CONSUMER FILTERS OVER FOUR SOURCES. Reflection drives two of them, which is why the
// index stores a variant: REFLECTION and POSTMORTEM are one family narrowed by mode, and the index
// can answer that without opening a single reflection.

const FAMILIES_FOR_FILTER: Record<TimelineFilter, readonly ContinuitySourceFamily[]> = {
  ALL: ["current_state", "goal", "reflection", "experience"],
  STATE: ["current_state"],
  DIRECTION: ["goal"],
  REFLECTION: ["reflection"],
  POSTMORTEM: ["reflection"],
  EXPERIENCE: ["experience"],
};

/** Only the one family that drives two views is narrowed further. */
const VARIANT_FOR_FILTER: Record<TimelineFilter, string | null> = {
  ALL: null, STATE: null, DIRECTION: null, EXPERIENCE: null,
  REFLECTION: "light",
  POSTMORTEM: "postmortem",
};

/** The columns each family's entry renders from — identical to what the legacy reader selected. */
const HYDRATION: Record<ContinuitySourceFamily, { table: string; select: string }> = {
  current_state: {
    table: "yorisou_current_state_records",
    select: "id,state_tags,mood,energy,situation,reflection,source,created_at",
  },
  goal: { table: "yorisou_goals", select: "id,title,description,status,created_at,updated_at" },
  reflection: {
    table: "yorisou_life_reflections",
    select:
      "id,experience_id,current_state_record_id,mode,what_happened,felt,tried,what_followed,next_time,goal_at_the_time,information_at_hand,options_considered,decision_made,why,what_learned,created_at",
  },
  experience: { table: "yorisou_experience_cards", select: "id,title,situation,created_at" },
};

async function hydrateByIds<T extends { id: string }>(
  family: ContinuitySourceFamily, owner: string, ids: readonly string[],
): Promise<Map<string, T>> {
  const found = new Map<string, T>();
  if (ids.length === 0) return found;
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return found;
  const { table, select } = HYDRATION[family];
  const params = new URLSearchParams({
    select,
    // OWNER-SCOPED EVEN THOUGH THE IDS CAME FROM AN OWNER-SCOPED INDEX. Two independent predicates
    // rather than one: a defect in the index must not be sufficient, on its own, to read another
    // person's record.
    owner_account_id: `eq.${owner}`,
    id: `in.(${ids.join(",")})`,
    limit: String(ids.length),
  });
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) return found;
  for (const row of (await response.json()) as T[]) found.set(row.id, row);
  return found;
}

function entryFor(moment: TimelineMoment, record: unknown): TimelineEntry | null {
  const at = moment.occurred_at;
  const id = moment.source_ref;
  switch (moment.source_family) {
    case "current_state": return { kind: "current_state", at, id, record: record as CurrentStateRecord };
    case "goal":          return { kind: "goal", at, id, record: record as Goal };
    case "reflection":    return { kind: "reflection", at, id, record: record as LifeReflection };
    case "experience": {
      const row = record as ExperienceRow;
      return { kind: "experience", at, id, record: { id: row.id, title: row.title, situation: row.situation } };
    }
    default: return null;
  }
}

/**
 * The person's own timeline, one keyset page at a time.
 *
 * Reads the continuity index when the schema is ready, and the pre-CNT-1 direct aggregation when it
 * is not — see lib/yorisou/continuity/access.ts for why that is a migration boundary rather than a
 * feature switch.
 */
export async function lifeTimelinePage(
  ownerAccountId: string,
  options: { cursor?: string | null; limit?: number; filter?: TimelineFilter } = {},
): Promise<TimelinePage> {
  if (!continuitySchemaReady()) return legacyAggregatedTimelinePage(ownerAccountId, options);

  const filter = options.filter ?? "ALL";
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), 50);
  let cursor: { at: string; id: string } | null = null;
  if (options.cursor) {
    cursor = decodeTimelineCursor(options.cursor, filter);
    if (!cursor) throw new Error("osf1_timeline_cursor_invalid");
  }

  let page;
  try {
    page = await readTimelinePage({
      owner_ref: ownerAccountId,
      limit,
      after: cursor ? { occurred_at: cursor.at, source_ref: cursor.id } : null,
      families: FAMILIES_FOR_FILTER[filter],
      variant: VARIANT_FOR_FILTER[filter],
    }, continuityRepository);
  } catch {
    // The legacy reader returned an empty slice for an unreachable source rather than failing the
    // whole page, and equivalence means matching that too — not improving on it inside a change
    // whose contract is "nothing visible changes".
    return { entries: [], nextCursor: null, filter };
  }

  const byFamily = new Map<ContinuitySourceFamily, string[]>();
  for (const moment of page.moments) {
    const list = byFamily.get(moment.source_family) ?? [];
    list.push(moment.source_ref);
    byFamily.set(moment.source_family, list);
  }
  const hydrated = new Map<ContinuitySourceFamily, Map<string, { id: string }>>();
  await Promise.all(
    [...byFamily].map(async ([family, ids]) => {
      hydrated.set(family, await hydrateByIds(family, ownerAccountId, ids));
    }),
  );

  const entries: TimelineEntry[] = [];
  let orphans = 0;
  for (const moment of page.moments) {
    const record = hydrated.get(moment.source_family)?.get(moment.source_ref);
    if (!record) {
      // A LIVE MOMENT WHOSE SOURCE WILL NOT HYDRATE SHOULD BE IMPOSSIBLE — the trigger invalidates
      // in the source's own transaction. If it happens anyway (a partial rollout, a restore from an
      // older dump), the moment is DROPPED, never rendered from stale data, and never repaired
      // here: a read that quietly mutates canonical data is a much worse failure than a short entry
      // list. It is counted and logged so it is visible instead of silent.
      orphans += 1;
      continue;
    }
    const entry = entryFor(moment, record);
    if (entry) entries.push(entry);
  }
  if (orphans > 0) {
    // No owner id, no source reference, no content — the fact and its shape, nothing identifying.
    console.error("continuity: live projections without a hydratable source", {
      filter,
      orphans,
      page: page.moments.length,
    });
  }

  // THE CURSOR ADVANCES PAST THE LAST MOMENT, NOT THE LAST ENTRY. If a dropped orphan were allowed
  // to rewind it, a page whose tail is unhydratable would be requested again forever.
  const last = page.moments[page.moments.length - 1];
  return {
    entries,
    nextCursor:
      page.has_more && last
        ? Buffer.from(`${filter}|${last.occurred_at}|${last.source_ref}`, "utf8").toString("base64url")
        : null,
    filter,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE F — the return view
// ─────────────────────────────────────────────────────────────────────────────
//
// WHAT THIS MUST NOT BECOME. No streak, no counter, no "you haven't written in N days", no
// notification, no scheduled prompt, no daily target. The approved writing rules prohibit
// commitment pressure and the package prohibits addiction mechanics; every one of those devices is
// that pressure with a friendly face.
//
// What it does instead: when someone comes back, show them what they left. Nothing is computed
// about them, nothing is counted, and if there is nothing to show it renders nothing rather than
// inventing an encouragement.

export type ReturnView = {
  lastReflection: LifeReflection | null;
  /**
   * An answer they started and left empty — offered, never nagged about. Field names, not labels:
   * the caller decides how to say them, and the two modes name the same field differently.
   */
  unfinished: { reflectionId: string; missing: string[] } | null;
  activeDirection: Goal | null;
  recentExperience: { id: string; title: string | null } | null;
};

/**
 * The optional answers a reflection left empty, according to the questions IT was asked.
 *
 * The row's own mode decides the set, and the set comes from the contract rather than a second list
 * restated here. A fixed light-flow list was previously measured against every row, so a completed
 * deep reflection always reported unfinished answers: that flow is never asked 感じたこと or
 * 試したこと, and the questions it does ask — options_considered, goal_at_the_time,
 * information_at_hand, decision_made — could never appear however long they were left empty.
 *
 * A row written before the mode column existed reads as `light`, which is what it was.
 */
function unansweredIn(reflection: LifeReflection): ReflectionField[] {
  const missing: ReflectionField[] = [];
  for (const question of reflectionQuestionsFor(reflection.mode)) {
    for (const entry of question.fields) {
      if (!entry.required && !reflection[entry.field]) missing.push(entry.field);
    }
  }
  return missing;
}

/**
 * ARCH-P7 — the newest moments of one family, already hydrated, newest first.
 *
 * The return view asks the same question the timeline asks — "what did this person leave?" — so it
 * must not answer it a second, independent way. It reads the continuity index for identity and
 * order and hydrates from the source stores, exactly as the paginated reader does.
 */
async function newestOfFamily<T extends { id: string }>(
  ownerAccountId: string,
  family: ContinuitySourceFamily,
  count: number,
): Promise<T[]> {
  const page = await readTimelinePage(
    { owner_ref: ownerAccountId, limit: count, after: null, families: [family], variant: null },
    continuityRepository,
  );
  const records = await hydrateByIds<T>(family, ownerAccountId, page.moments.map((m) => m.source_ref));
  // Index order is the answer; a moment that will not hydrate is dropped rather than rendered,
  // the same rule the paginated reader follows.
  return page.moments.map((m) => records.get(m.source_ref)).filter((r): r is T => r !== undefined);
}

/**
 * THE PRE-CNT-1 RETURN VIEW, kept for the same two reasons as the pre-CNT-1 paginated reader: an
 * unmigrated database has no index to read, and the alignment proof needs something to compare
 * against. Not authoritative once the schema is ready.
 */
export async function legacyAggregatedReturnView(ownerAccountId: string): Promise<ReturnView> {
  const [reflections, goals, experiences] = await Promise.all([
    listReflections(ownerAccountId, 1).catch(() => []),
    listGoals(ownerAccountId, 10).catch(() => []),
    ownExperiences(ownerAccountId, 1).catch(() => []),
  ]);

  const lastReflection = reflections[0] ?? null;
  // "Unfinished" is a fact about the record — which optional answers are empty — not a judgement
  // about the person and not a task to complete.
  const missing = lastReflection ? unansweredIn(lastReflection) : [];
  return {
    lastReflection,
    unfinished: lastReflection && missing.length > 0 ? { reflectionId: lastReflection.id, missing } : null,
    activeDirection: goals.find((goal) => goal.status === "active") ?? null,
    recentExperience: experiences[0] ? { id: experiences[0].id, title: experiences[0].title } : null,
  };
}

/**
 * What this person left, composed from continuity.core.
 *
 * WHY THIS MOVED IN P7. It used to read the reflection, goal and experience stores directly — the
 * same aggregation the timeline did before P6, kept in a second place. Two independent derivations
 * of one fact are equal only until something changes one of them, and P6 made exactly such a state
 * reachable: a moment can be invalidated in the index while its source row is untouched. The
 * timeline would drop it and this card would go on offering it, so わたし would show a person
 * something the rest of the product had already stopped showing them.
 *
 * The POLICY is unchanged and still lives here: the newest reflection, the first ACTIVE direction
 * among recent ones, the newest experience. Only the question "which records, in what order" moved
 * to the module that owns it. Status is not in the index and must not be — it is a fact about the
 * goal, so directions are hydrated and then filtered, exactly as before.
 */
export async function lifeReturnView(ownerAccountId: string): Promise<ReturnView> {
  if (!continuitySchemaReady()) return legacyAggregatedReturnView(ownerAccountId);

  let reflections: LifeReflection[] = [];
  let goals: Goal[] = [];
  let experiences: ExperienceRow[] = [];
  try {
    [reflections, goals, experiences] = await Promise.all([
      newestOfFamily<LifeReflection>(ownerAccountId, "reflection", 1),
      // Ten, because "active" is a property of the record rather than of the index; the newest ten
      // is the same window the direct read used.
      newestOfFamily<Goal>(ownerAccountId, "goal", 10),
      newestOfFamily<ExperienceRow>(ownerAccountId, "experience", 1),
    ]);
  } catch {
    // The direct read returned an empty slice for an unreachable source rather than failing the
    // whole card. Matching that is part of "nothing visible changes".
    return { lastReflection: null, unfinished: null, activeDirection: null, recentExperience: null };
  }

  const lastReflection = reflections[0] ?? null;
  const missing = lastReflection ? unansweredIn(lastReflection) : [];
  return {
    lastReflection,
    unfinished: lastReflection && missing.length > 0 ? { reflectionId: lastReflection.id, missing } : null,
    activeDirection: goals.find((goal) => goal.status === "active") ?? null,
    recentExperience: experiences[0] ? { id: experiences[0].id, title: experiences[0].title } : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// §6 — THE RETURN SELECTION POLICY
// ─────────────────────────────────────────────────────────────────────────────
//
// `lifeReturnView` gathers candidates. This decides WHICH of them a person actually sees, and it is
// a policy rather than a rendering accident: previously the surface showed whatever the view
// happened to contain, which is how a continuity card becomes a feed one field at a time.
//
// THREE ITEMS, HARD. Not "about three". The cap is the whole design — returning to four things you
// left unfinished is a backlog, and a backlog is the pressure this product exists not to apply.
//
// FIXED PRIORITY, so the selection is deterministic and therefore testable. The order is not
// preference-ranked or engagement-ranked; there is no score anywhere. It is simply: the thing you
// were in the middle of, then the thing you thought hardest about, then what you said you were
// heading toward, then what happened, then how you were.
//
// WHAT IS DELIBERATELY ABSENT: no streak, no count of days, no "you missed", no comparison to a
// previous week, no completion percentage, and no notification. If nothing qualifies, the selection
// is empty and the surface renders nothing — an empty return is a legitimate state, not a prompt.

export const RETURN_MAX_ITEMS = 3;

export type ReturnItem =
  | { kind: "unfinished_reflection"; reason: string; id: string; missing: string[] }
  | { kind: "deep_reflection"; reason: string; id: string; summary: string }
  | { kind: "active_direction"; reason: string; id: string; summary: string }
  | { kind: "recent_experience"; reason: string; id: string; summary: string }
  | { kind: "recent_state"; reason: string; id: string; summary: string };

/**
 * The bounded continuity selection.
 *
 * Deterministic: same records in, same items out, in the same order. Nothing here reads a memory —
 * suppressed or revoked or otherwise — so a memory a person has withdrawn cannot influence what
 * they are shown on returning, which is the point of withdrawing it.
 */
export async function lifeReturnSelection(ownerAccountId: string): Promise<ReturnItem[]> {
  const [view, states] = await Promise.all([
    lifeReturnView(ownerAccountId),
    // ARCH-P7: through the index too, for the same reason. This was the last place わたし answered
    // "the most recent X" by reaching past the module that owns the answer.
    continuitySchemaReady()
      ? newestOfFamily<CurrentStateRecord>(ownerAccountId, "current_state", 1).catch(() => [])
      : listCurrentStateRecords(ownerAccountId, 1).catch(() => []),
  ]);

  const items: ReturnItem[] = [];
  const used = new Set<string>();
  const take = (item: ReturnItem) => {
    // One record cannot occupy two slots: an unfinished deep reflection is the same row as the most
    // recent one, and showing it twice would read as two separate things left undone.
    if (items.length >= RETURN_MAX_ITEMS || used.has(item.id)) return;
    used.add(item.id);
    items.push(item);
  };

  if (view.unfinished) {
    take({
      kind: "unfinished_reflection",
      reason: "前に考えていたこと",
      id: view.unfinished.reflectionId,
      missing: view.unfinished.missing,
    });
  }
  if (view.lastReflection) {
    take({
      kind: "deep_reflection",
      reason: "最近残した振り返り",
      id: view.lastReflection.id,
      summary: view.lastReflection.what_happened,
    });
  }
  if (view.activeDirection) {
    take({
      kind: "active_direction",
      reason: "今、大切にしている方向",
      id: view.activeDirection.id,
      summary: view.activeDirection.title,
    });
  }
  if (view.recentExperience) {
    take({
      kind: "recent_experience",
      reason: "最近の出来事",
      id: view.recentExperience.id,
      summary: view.recentExperience.title ?? "",
    });
  }
  const state = states[0];
  if (state) {
    take({
      kind: "recent_state",
      reason: "最近の記録",
      id: state.id,
      // Kept local rather than importing the app's renderer: a lib/server module reaching into
      // app/ would invert the dependency and drag a client component into the data layer.
      summary: state.situation ?? state.reflection ?? state.state_tags.join("・"),
    });
  }
  return items;
}
