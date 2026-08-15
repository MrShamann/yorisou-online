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
