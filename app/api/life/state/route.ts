import { NextResponse } from "next/server";
import { createCurrentStateRecord, listCurrentStateRecords, setCurrentStateReflection } from "@/lib/server/lifeOs/store";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { deliverStateCheckinCompleted, stateCheckinCompletedEvent } from "@/lib/server/platform/stateCheckinEvent";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { LifeOsInputError, parseCurrentStateInput, parseUuid } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  try {
    return NextResponse.json({ records: await listCurrentStateRecords(gate.viewer.accountId) });
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
  try {
    // Adding the optional note to an existing check-in, rather than creating one.
    if (body.id !== undefined && body.id !== null) {
      let recordId: string;
      try {
        recordId = parseUuid(body.id, "state_record_id_invalid");
      } catch (error) {
        if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
        throw error;
      }
      if (typeof body.reflection !== "string" || body.reflection.trim().length === 0) {
        return NextResponse.json({ error: "reflection_text_required" }, { status: 422 });
      }
      if (body.reflection.trim().length > 1000) return NextResponse.json({ error: "reflection_invalid" }, { status: 422 });
      const saved = await setCurrentStateReflection(gate.viewer.accountId, recordId, body.reflection.trim());
      if (!saved) return NextResponse.json({ error: "state_record_not_open_for_note" }, { status: 409 });
      await auditLifeOs({
        ownerAccountId: gate.viewer.accountId,
        action: "yorisou.life.state.annotated",
        entityKind: "current_state",
        entityRef: recordId,
        reason: "user_note",
      });
      return NextResponse.json({ ok: true });
    }
    const input = parseCurrentStateInput(body.record ?? body);
    const id = await createCurrentStateRecord(gate.viewer.accountId, input);
    // ARCH-P1 — the Today check-in traverses the canonical typed-event seam: persistence success
    // above is what makes the completion event constructible at all, and delivery feeds the SAME
    // asynchronous audit sink as before. Every other source keeps the direct call. Either branch:
    // exactly ONE audit write, unchanged failure semantics, unchanged response.
    const completion = stateCheckinCompletedEvent({
      ownerAccountId: gate.viewer.accountId,
      stateRecordId: id,
      source: input.source,
      tagCount: input.stateTags.length,
    });
    if (completion) {
      await deliverStateCheckinCompleted(completion, gate.viewer.accountId);
    } else {
      await auditLifeOs({
        ownerAccountId: gate.viewer.accountId,
        action: "yorisou.life.state.created",
        entityKind: "current_state",
        entityRef: id,
        reason: input.source,
        detail: { tags: input.stateTags.length },
      });
    }
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    return lifeApiError(error);
  }
}
