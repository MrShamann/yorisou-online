import "server-only";

// OSF-1 — server-only Life OS persistence repository.
//
// Same shape as lib/server/dailyCheckInStore.ts: service-role PostgREST for reads, bounded
// SECURITY DEFINER RPCs for every write. Reads are owner-filtered here AND the tables grant
// service_role SELECT only, so a bug in this file cannot turn into a write; a bug in the owner
// filter cannot turn into a cross-account read without also defeating the RPC's own owner checks.
//
// Errors are named, never numeric-only: the RPCs raise `osf1_*` exceptions and rpc() lifts them out
// of the PostgREST error body so an API route can map them to a status without parsing prose.

import {
  memoryDigest,
} from "@/lib/server/lifeOs/aiBoundary";
import { REFLECTION_FIELDS } from "@/lib/life-os/contract";
import type {
  CurrentStateInput,
  CurrentStateRecord,
  ExplicitMemory,
  Goal,
  GoalStatus,
  LifeReflection,
  LifeReflectionInput,
  MemorySource,
  MemoryType,
  UserContext,
  UserContextInput,
} from "@/lib/life-os/contract";

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("life_os_persistence_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit) {
  const { url, key } = config();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  if (!response.ok) {
    // Surface the RPC's own named exception (osf1_memory_requires_confirmation, …) and nothing else.
    // The raw body can quote the offending content, which must not reach a log line.
    const text = await response.text().catch(() => "");
    const known = /osf1_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `life_os_persistence_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

async function select<T>(table: string, params: URLSearchParams): Promise<T[]> {
  const response = await request(`${table}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`life_os_persistence_failed:${response.status}`);
  return (await response.json()) as T[];
}

// ── UserContext ──────────────────────────────────────────────────────────────

const CONTEXT_COLUMNS = "id,language,region,timezone,preferences_json,created_at,updated_at";

export async function getUserContext(ownerAccountId: string): Promise<UserContext | null> {
  const rows = await select<UserContext>(
    "yorisou_user_contexts",
    new URLSearchParams({ select: CONTEXT_COLUMNS, owner_account_id: `eq.${ownerAccountId}`, limit: "1" }),
  );
  return rows[0] ?? null;
}

export async function upsertUserContext(ownerAccountId: string, input: UserContextInput): Promise<string> {
  return rpc<string>("yorisou_osf1_user_context_upsert", {
    p_owner_account_id: ownerAccountId,
    p_language: input.language ?? null,
    p_region: input.region ?? null,
    p_timezone: input.timezone ?? null,
    p_preferences_json: input.preferences ?? {},
  });
}

// ── CurrentStateRecord ───────────────────────────────────────────────────────
//
// TEMPORAL DAILY USER STATE, not a methodology result. Nothing in this section may ever read or
// write yorisou_assessment_results / yorisou_test_results, and nothing there may read these rows:
// a two-tap answer must not be presentable as a 120-question finding, and a 120-question finding
// must not be silently rewritable by a tap. The boundary is stated in full at
// supabase/migrations/202608140001 §2.

const CURRENT_STATE_COLUMNS = "id,state_tags,mood,energy,situation,reflection,source,created_at";

export async function createCurrentStateRecord(ownerAccountId: string, input: CurrentStateInput): Promise<string> {
  return rpc<string>("yorisou_osf1_current_state_create", {
    p_owner_account_id: ownerAccountId,
    p_state_tags: input.stateTags,
    p_mood: input.mood ?? null,
    p_energy: input.energy ?? null,
    p_situation: input.situation ?? null,
    p_reflection: input.reflection ?? null,
    p_source: input.source,
  });
}

/**
 * Add the optional note to a check-in that does not have one yet.
 *
 * Returns false when the record already carries a note or is not this person's — the RPC's `where`
 * clause covers both, so a caller cannot use this to overwrite what was written earlier.
 */
export async function setCurrentStateReflection(
  ownerAccountId: string,
  recordId: string,
  reflection: string,
): Promise<boolean> {
  return rpc<boolean>("yorisou_osf1_current_state_set_reflection", {
    p_owner_account_id: ownerAccountId,
    p_record_id: recordId,
    p_reflection: reflection,
  });
}

export async function listCurrentStateRecords(ownerAccountId: string, limit = 30): Promise<CurrentStateRecord[]> {
  return select<CurrentStateRecord>(
    "yorisou_current_state_records",
    new URLSearchParams({
      select: CURRENT_STATE_COLUMNS,
      owner_account_id: `eq.${ownerAccountId}`,
      order: "created_at.desc",
      limit: String(limit),
    }),
  );
}

/** The most recent check-in, which is what Today shows. */
export async function latestCurrentStateRecord(ownerAccountId: string): Promise<CurrentStateRecord | null> {
  const rows = await listCurrentStateRecords(ownerAccountId, 1);
  return rows[0] ?? null;
}

// ── Goal ─────────────────────────────────────────────────────────────────────
//
// A Goal here is LIFE DIRECTION / INTENTION — something a person chose to hold in view. It is NOT
// task management, and this repository is where that stops being a slogan:
//
//   there is no due date, no reminder, no notification, no progress value, no completion
//   percentage, no streak, no counter, no priority, and no ordering that implies rank;
//   listGoals sorts by created_at only, because sorting by anything else is a ranking;
//   the status vocabulary has no `failed` and no `overdue`, and `released` (手放した) is an equal
//   outcome to `achieved` (届いた).
//
// Adding any of those would turn this into the pressure device the approved writing rules prohibit
// ("goal-setting language that pressures commitment"). If a future package needs reminders, that is
// a product decision with its own authorization — not a field added here in passing.

const GOAL_COLUMNS = "id,title,description,status,created_at,updated_at";

export async function createGoal(ownerAccountId: string, input: { title: string; description: string | null }): Promise<string> {
  return rpc<string>("yorisou_osf1_goal_create", {
    p_owner_account_id: ownerAccountId,
    p_title: input.title,
    p_description: input.description,
  });
}

export async function setGoalStatus(ownerAccountId: string, goalId: string, status: GoalStatus): Promise<boolean> {
  return rpc<boolean>("yorisou_osf1_goal_set_status", {
    p_owner_account_id: ownerAccountId,
    p_goal_id: goalId,
    p_status: status,
  });
}

export async function listGoals(ownerAccountId: string, limit = 50): Promise<Goal[]> {
  return select<Goal>(
    "yorisou_goals",
    new URLSearchParams({
      select: GOAL_COLUMNS,
      owner_account_id: `eq.${ownerAccountId}`,
      order: "created_at.desc",
      limit: String(limit),
    }),
  );
}

export async function getGoal(ownerAccountId: string, goalId: string): Promise<Goal | null> {
  const rows = await select<Goal>(
    "yorisou_goals",
    new URLSearchParams({
      select: GOAL_COLUMNS,
      owner_account_id: `eq.${ownerAccountId}`,
      id: `eq.${goalId}`,
      limit: "1",
    }),
  );
  return rows[0] ?? null;
}

// ── Reflection ───────────────────────────────────────────────────────────────

const REFLECTION_COLUMNS =
  "id,experience_id,mode,what_happened,felt,tried,what_followed,next_time,goal_at_the_time,information_at_hand,options_considered,decision_made,why,what_learned,created_at";

/**
 * Create a reflection. The RPC writes the audit row INSIDE this transaction (202608160001 §3), so
 * there is no second call here and no `auditLifeOs` on the route — a best-effort write on top would
 * double-enter an append-only table that has no way to remove the duplicate.
 */
export async function createReflection(ownerAccountId: string, input: LifeReflectionInput): Promise<string> {
  return rpc<string>("yorisou_osf1_reflection_create", {
    p_owner_account_id: ownerAccountId,
    p_experience_id: input.experienceId ?? null,
    p_mode: input.mode ?? "light",
    p_what_happened: input.what_happened,
    p_felt: input.felt ?? null,
    p_tried: input.tried ?? null,
    p_what_followed: input.what_followed ?? null,
    p_next_time: input.next_time ?? null,
    // Written by the deep postmortem mode; left null by the light flow. See contract.ts.
    p_goal_at_the_time: input.goal_at_the_time ?? null,
    p_information_at_hand: input.information_at_hand ?? null,
    p_options_considered: input.options_considered ?? null,
    p_decision_made: input.decision_made ?? null,
    // Retained columns: no flow asks them any more, and nothing may silently invent a value.
    p_why: null,
    p_what_learned: null,
    p_audit_detail: {
      // Answered QUESTIONS only. Counting Object.values(input) swept in `mode` and `experienceId`,
      // which are not answers — every reflection reported at least one more than it had.
      answered: REFLECTION_FIELDS.filter((f) => ((input[f.field] ?? "") as string).trim().length > 0).length,
    },
  });
}

export async function listReflections(ownerAccountId: string, limit = 30): Promise<LifeReflection[]> {
  return select<LifeReflection>(
    "yorisou_life_reflections",
    new URLSearchParams({
      select: REFLECTION_COLUMNS,
      owner_account_id: `eq.${ownerAccountId}`,
      order: "created_at.desc",
      limit: String(limit),
    }),
  );
}

export async function getReflection(ownerAccountId: string, reflectionId: string): Promise<LifeReflection | null> {
  const rows = await select<LifeReflection>(
    "yorisou_life_reflections",
    new URLSearchParams({
      select: REFLECTION_COLUMNS,
      owner_account_id: `eq.${ownerAccountId}`,
      id: `eq.${reflectionId}`,
      limit: "1",
    }),
  );
  return rows[0] ?? null;
}

// ── Memory ───────────────────────────────────────────────────────────────────

const MEMORY_COLUMNS = "id,memory_type,content,source,user_confirmed,created_at,updated_at";

/**
 * The only write path for a memory, and it is a CONFIRM, not a create.
 *
 * There is no companion function that stores an unconfirmed memory, and adding one would fail at the
 * database: yorisou_explicit_memories carries `check (user_confirmed = true)`. `confirmed` is passed
 * through to the RPC rather than hardcoded to true here on purpose — a caller that forgot to collect
 * confirmation must be rejected, not silently corrected into a save.
 */
export async function confirmMemory(
  ownerAccountId: string,
  input: {
    memoryType: MemoryType;
    content: string;
    source: MemorySource;
    confirmed: boolean;
    digest: string;
    subject?: { goalId?: string | null; experienceId?: string | null; reflectionId?: string | null };
  },
): Promise<string> {
  // Trimmed here so the digest the database recomputes is taken over the same bytes; see
  // memoryDigest's note on btrim vs String.prototype.trim.
  const content = input.content.trim();
  if (input.digest !== memoryDigest(content)) throw new Error("osf1_memory_confirmation_mismatch");
  return rpc<string>("yorisou_osf1_memory_confirm", {
    // The audit row is written inside this RPC's transaction — see createReflection's note.
    p_owner_account_id: ownerAccountId,
    p_memory_type: input.memoryType,
    p_content: content,
    p_source: input.source,
    p_confirmation_digest: input.digest,
    p_user_confirmed: input.confirmed,
    p_subject_goal_id: input.subject?.goalId ?? null,
    p_subject_experience_id: input.subject?.experienceId ?? null,
    p_subject_reflection_id: input.subject?.reflectionId ?? null,
  });
}

export async function deleteMemory(ownerAccountId: string, memoryId: string): Promise<boolean> {
  return rpc<boolean>("yorisou_osf1_memory_delete", {
    p_owner_account_id: ownerAccountId,
    p_memory_id: memoryId,
  });
}

/**
 * Edit the sentence of a memory that already exists. Returns false when the id is not this person's,
 * which is the same answer as "no such memory" — a caller must not be able to tell the difference.
 *
 * Only the content changes. The type, the source and every subject link are fixed for the life of
 * the row; the RPC does not accept them and the database would not apply them if it did.
 *
 * The digest is recomputed here from the text that will be stored, and the RPC recomputes it again
 * before writing. It is an integrity check on the write path — NOT proof that a person read the
 * sentence. The consent guarantee is `confirmed: true`, checked at the route before this is reached.
 */
export async function updateMemory(ownerAccountId: string, memoryId: string, content: string): Promise<boolean> {
  const next = content.trim();
  return rpc<boolean>("yorisou_osf1_memory_update", {
    p_owner_account_id: ownerAccountId,
    p_memory_id: memoryId,
    p_content: next,
    p_confirmation_digest: memoryDigest(next),
  });
}

/**
 * KEYSET PAGINATION over memories.
 *
 * `listMemories` caps at 50 and takes no offset, so a person who confirmed a fifty-first memory
 * simply could not reach it — the product had quietly stopped showing them their own records. The
 * fix is not a larger number: Memory governance §4 prohibits bulk memory reads, so raising the cap
 * moves in the wrong direction. It is a cursor.
 *
 * Keyset rather than OFFSET, because offset pagination over a list that can be deleted from skips
 * rows: remove one memory on page 1 and the first row of page 2 shifts up past the window and is
 * never shown. That is the same defect as the 50-cap, just harder to notice.
 *
 * The sort is (created_at desc, id desc). The id is not decoration — two memories confirmed in the
 * same millisecond would otherwise have no defined order, and a cursor into an undefined order is
 * not stable. The cursor encodes both halves for exactly that reason.
 */
export const MEMORY_PAGE_SIZE = 25;

export type MemoryPage = { memories: ExplicitMemory[]; nextCursor: string | null };

/** Opaque to the caller by construction: it is the sort key, not an index into anything. */
function encodeCursor(row: ExplicitMemory): string {
  return Buffer.from(`${row.created_at}|${row.id}`, "utf8").toString("base64url");
}

function decodeCursor(cursor: string): { createdAt: string; id: string } | null {
  try {
    const [createdAt, id] = Buffer.from(cursor, "base64url").toString("utf8").split("|");
    // A malformed cursor is refused, never coerced into "start from the beginning" — silently
    // restarting a list is how a person scrolls forever without noticing they are seeing page 1.
    if (!createdAt || !id || !/^[0-9a-f-]{36}$/i.test(id)) return null;
    if (Number.isNaN(Date.parse(createdAt))) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}

export async function listMemoryPage(
  ownerAccountId: string,
  options: { cursor?: string | null; limit?: number } = {},
): Promise<MemoryPage> {
  const limit = Math.min(Math.max(options.limit ?? MEMORY_PAGE_SIZE, 1), 100);
  const params = new URLSearchParams({
    select: MEMORY_COLUMNS,
    owner_account_id: `eq.${ownerAccountId}`,
    order: "created_at.desc,id.desc",
    // One more than asked for. Its presence is what tells us another page exists, without a second
    // round trip and without a count query over the whole table.
    limit: String(limit + 1),
  });
  if (options.cursor) {
    const decoded = decodeCursor(options.cursor);
    if (!decoded) throw new Error("osf1_memory_cursor_invalid");
    params.set(
      "or",
      `(created_at.lt.${decoded.createdAt},and(created_at.eq.${decoded.createdAt},id.lt.${decoded.id}))`,
    );
  }
  const rows = await select<ExplicitMemory>("yorisou_explicit_memories", params);
  const hasMore = rows.length > limit;
  const memories = hasMore ? rows.slice(0, limit) : rows;
  return {
    memories,
    nextCursor: hasMore && memories.length > 0 ? encodeCursor(memories[memories.length - 1]) : null,
  };
}

export async function listMemories(ownerAccountId: string, limit = 50): Promise<ExplicitMemory[]> {
  return select<ExplicitMemory>(
    "yorisou_explicit_memories",
    new URLSearchParams({
      select: MEMORY_COLUMNS,
      owner_account_id: `eq.${ownerAccountId}`,
      order: "created_at.desc",
      limit: String(limit),
    }),
  );
}
