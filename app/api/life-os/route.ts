import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import {
  LifeOsInputError,
  parseCurrentStateInput,
  parseGoalInput,
  parseReflectionInput,
  GOAL_STATUSES,
  MEMORY_TYPES,
  MEMORY_SOURCES,
  type GoalStatus,
  type MemorySource,
  type MemoryType,
} from "@/lib/life-os/contract";
import { buildMemoryCandidates } from "@/lib/server/lifeOs/aiBoundary";
import {
  confirmMemory,
  createCurrentStateRecord,
  createGoal,
  createReflection,
  deleteMemory,
  getGoal,
  getReflection,
  getUserContext,
  latestCurrentStateRecord,
  listCurrentStateRecords,
  listGoals,
  listMemories,
  listReflections,
  setCurrentStateReflection,
  setGoalStatus,
  upsertUserContext,
} from "@/lib/server/lifeOs/store";

// OSF-1 — the Phase 1 Life OS endpoint.
//
// One route with an explicit `action`, following app/api/experiences/route.ts rather than inventing
// a second convention. Everything here is owner-scoped: the account id comes from the encrypted
// session cookie via getViewerContext() and is never accepted from the request body, so there is no
// parameter a caller could set to read or write someone else's rows.
//
// There is deliberately NO endpoint that stores a memory without confirmation. `confirm_memory` is
// the only memory write, it requires `confirmed === true` AND a digest that matches the content, and
// both checks are repeated inside the SQL RPC.

export const dynamic = "force-dynamic";

async function owner(): Promise<string | null> {
  const viewer = await getViewerContext();
  return viewer.account?.id || viewer.legacyAccount?.id || null;
}

function badRequest(code: string, status = 422) {
  return NextResponse.json({ error: code }, { status });
}

export async function GET(request: Request) {
  const accountId = await owner();
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const view = new URL(request.url).searchParams.get("view") ?? "today";
  try {
    if (view === "today") {
      const [currentState, context] = await Promise.all([
        latestCurrentStateRecord(accountId),
        getUserContext(accountId),
      ]);
      return NextResponse.json({ currentState, context });
    }
    if (view === "state") return NextResponse.json({ records: await listCurrentStateRecords(accountId) });
    if (view === "goals") return NextResponse.json({ goals: await listGoals(accountId) });
    if (view === "reflections") return NextResponse.json({ reflections: await listReflections(accountId) });
    if (view === "memories") return NextResponse.json({ memories: await listMemories(accountId) });
    if (view === "context") return NextResponse.json({ context: await getUserContext(accountId) });
    return badRequest("unknown_view", 400);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "life_os_failed", 500);
  }
}

export async function POST(request: Request) {
  const accountId = await owner();
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest("invalid_json", 400);
  }

  try {
    switch (body.action) {
      case "create_current_state": {
        const id = await createCurrentStateRecord(accountId, parseCurrentStateInput(body.record));
        return NextResponse.json({ id }, { status: 201 });
      }

      case "save_state_reflection": {
        if (typeof body.id !== "string") return badRequest("state_record_id_required");
        if (typeof body.reflection !== "string" || body.reflection.trim().length === 0) {
          return badRequest("reflection_text_required");
        }
        if (body.reflection.trim().length > 1000) return badRequest("reflection_invalid");
        const saved = await setCurrentStateReflection(accountId, body.id, body.reflection.trim());
        if (!saved) return badRequest("state_record_not_open_for_note", 409);
        return NextResponse.json({ ok: true });
      }

      case "create_goal": {
        const id = await createGoal(accountId, parseGoalInput(body.goal));
        // The goal a person just wrote is offered as a memory. Offered — the response carries a
        // candidate, and nothing is stored until they send it back through confirm_memory.
        const goal = await getGoal(accountId, id);
        return NextResponse.json(
          { id, memoryCandidates: goal ? buildMemoryCandidates({ goal }) : [] },
          { status: 201 },
        );
      }

      case "set_goal_status": {
        const status = body.status as GoalStatus;
        if (!GOAL_STATUSES.includes(status)) return badRequest("goal_status_invalid");
        if (typeof body.id !== "string") return badRequest("goal_id_required");
        const updated = await setGoalStatus(accountId, body.id, status);
        if (!updated) return badRequest("goal_not_found", 404);
        return NextResponse.json({ ok: true });
      }

      case "create_reflection": {
        const id = await createReflection(accountId, parseReflectionInput(body.reflection));
        const reflection = await getReflection(accountId, id);
        return NextResponse.json(
          { id, memoryCandidates: reflection ? buildMemoryCandidates({ reflection }) : [] },
          { status: 201 },
        );
      }

      // THE ONLY MEMORY WRITE.
      case "confirm_memory": {
        const candidate = (body.memory ?? {}) as Record<string, unknown>;
        const memoryType = candidate.memoryType as MemoryType;
        const source = candidate.source as MemorySource;
        if (!MEMORY_TYPES.includes(memoryType)) return badRequest("memory_type_invalid");
        if (!MEMORY_SOURCES.includes(source)) return badRequest("memory_source_invalid");
        if (typeof candidate.content !== "string" || candidate.content.trim().length === 0) {
          return badRequest("memory_content_required");
        }
        if (typeof candidate.digest !== "string") return badRequest("memory_digest_required");
        // Refused before any database call. `confirmed !== true` is not a validation nicety — it is
        // the difference between a suggestion and a record the person did not ask for.
        if (body.confirmed !== true) return badRequest("memory_requires_confirmation", 409);
        const subject = (candidate.subject ?? {}) as Record<string, string | undefined>;
        const id = await confirmMemory(accountId, {
          memoryType,
          content: candidate.content,
          source,
          confirmed: true,
          digest: candidate.digest,
          subject: {
            goalId: subject.goalId ?? null,
            experienceId: subject.experienceId ?? null,
            reflectionId: subject.reflectionId ?? null,
          },
        });
        return NextResponse.json({ id }, { status: 201 });
      }

      case "delete_memory": {
        if (typeof body.id !== "string") return badRequest("memory_id_required");
        const deleted = await deleteMemory(accountId, body.id);
        if (!deleted) return badRequest("memory_not_found", 404);
        return NextResponse.json({ ok: true });
      }

      case "save_context": {
        const context = (body.context ?? {}) as Record<string, unknown>;
        await upsertUserContext(accountId, {
          language: context.language as "ja" | "en" | undefined,
          region: typeof context.region === "string" ? context.region : null,
          timezone: typeof context.timezone === "string" ? context.timezone : undefined,
          preferences: (context.preferences ?? {}) as Record<string, unknown>,
        });
        return NextResponse.json({ ok: true });
      }

      default:
        return badRequest("unknown_action", 400);
    }
  } catch (error) {
    if (error instanceof LifeOsInputError) return badRequest(error.code);
    const message = error instanceof Error ? error.message : "life_os_failed";
    // A confirmation mismatch means the content changed between being shown and being confirmed.
    // 409 rather than 422: nothing about the request is malformed, the agreement just no longer holds.
    if (message === "osf1_memory_confirmation_mismatch" || message === "osf1_memory_requires_confirmation") {
      return badRequest(message, 409);
    }
    return badRequest(message, message.startsWith("osf1_") ? 422 : 500);
  }
}
