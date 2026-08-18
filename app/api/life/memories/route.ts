import { NextResponse } from "next/server";
import { confirmMemory, deleteMemory, listMemoryPage, MEMORY_PAGE_SIZE } from "@/lib/server/lifeOs/store";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { MEMORY_SOURCES, MEMORY_TYPES, type MemorySource, type MemoryType, parseUuid, parseOptionalUuid, LifeOsInputError } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

// THE ONLY MEMORY WRITE IS A CONFIRM. There is no create-without-confirm counterpart on this route
// or anywhere else, and the database refuses one regardless: yorisou_explicit_memories carries
// `check (user_confirmed = true)`.

export async function GET(request: Request) {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  const params = new URL(request.url).searchParams;
  const rawLimit = Number.parseInt(params.get("limit") ?? "", 10);
  try {
    // Paginated rather than capped. The previous fixed limit of 50 made a person's fifty-first
    // memory unreachable — not hidden behind a control they could find, simply absent.
    const page = await listMemoryPage(gate.viewer.accountId, {
      cursor: params.get("cursor"),
      limit: Number.isFinite(rawLimit) ? rawLimit : MEMORY_PAGE_SIZE,
    });
    return NextResponse.json(page);
  } catch (error) {
    return lifeApiError(error);
  }
}

export async function POST(request: Request) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const candidate = (body.memory ?? {}) as Record<string, unknown>;
  const memoryType = candidate.memoryType as MemoryType;
  const source = candidate.source as MemorySource;
  if (!MEMORY_TYPES.includes(memoryType)) return NextResponse.json({ error: "memory_type_invalid" }, { status: 422 });
  if (!MEMORY_SOURCES.includes(source)) return NextResponse.json({ error: "memory_source_invalid" }, { status: 422 });
  if (typeof candidate.content !== "string" || candidate.content.trim().length === 0) {
    return NextResponse.json({ error: "memory_content_required" }, { status: 422 });
  }
  if (typeof candidate.digest !== "string") return NextResponse.json({ error: "memory_digest_required" }, { status: 422 });
  // Refused before any database call. This is the difference between a suggestion and a record the
  // person did not ask for.
  if (body.confirmed !== true) return NextResponse.json({ error: "memory_requires_confirmation" }, { status: 409 });
  const subject = (candidate.subject ?? {}) as Record<string, string | undefined>;
  try {
    const id = await confirmMemory(gate.viewer.accountId, {
      memoryType,
      content: candidate.content,
      source,
      confirmed: true,
      digest: candidate.digest,
      subject: {
        goalId: parseOptionalUuid(subject.goalId, "memory_subject_invalid"),
        experienceId: parseOptionalUuid(subject.experienceId, "memory_subject_invalid"),
        reflectionId: parseOptionalUuid(subject.reflectionId, "memory_subject_invalid"),
      },
    });
    // Audited inside the RPC transaction (202608160001 §4) — confirming a memory is a consent act,
    // and the record of the agreement must not be able to go missing separately from the agreement.
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return lifeApiError(error);
  }
}

export async function DELETE(request: Request) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  let id: string;
  try {
    id = parseUuid(new URL(request.url).searchParams.get("id"), "memory_id_required");
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    throw error;
  }
  try {
    // Audited inside the RPC transaction, and only when a row was actually removed — after a hard
    // delete that audit row is the only remaining evidence the memory existed. A 404 here means
    // nothing was deleted and nothing was recorded, which is why an id that is not yours cannot be
    // used to manufacture a deletion record.
    const deleted = await deleteMemory(gate.viewer.accountId, id);
    if (!deleted) return NextResponse.json({ error: "memory_not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return lifeApiError(error);
  }
}
