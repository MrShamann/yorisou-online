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
  EXPERIENCE: "体験",
  REFLECTION: "振り返り",
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

export async function lifeTimelinePage(
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

export async function lifeReturnView(ownerAccountId: string): Promise<ReturnView> {
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
