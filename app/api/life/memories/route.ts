import { NextResponse } from "next/server";
import { confirmMemory, deleteMemory, listMemories } from "@/lib/server/lifeOs/store";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { MEMORY_SOURCES, MEMORY_TYPES, type MemorySource, type MemoryType } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

// THE ONLY MEMORY WRITE IS A CONFIRM. There is no create-without-confirm counterpart on this route
// or anywhere else, and the database refuses one regardless: yorisou_explicit_memories carries
// `check (user_confirmed = true)`.

export async function GET() {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  try {
    return NextResponse.json({ memories: await listMemories(gate.viewer.accountId) });
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
        goalId: subject.goalId ?? null,
        experienceId: subject.experienceId ?? null,
        reflectionId: subject.reflectionId ?? null,
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
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "memory_id_required" }, { status: 422 });
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
