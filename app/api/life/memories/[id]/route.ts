import { NextResponse } from "next/server";
import { updateMemory } from "@/lib/server/lifeOs/store";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { LifeOsInputError, parseMemoryUpdateInput } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

// AN EDIT IS A CONFIRM. It replaces the sentence the person agreed to, so it carries the same
// requirement creation does: `confirmed: true` or no write. parseMemoryUpdateInput enforces that
// before the store is reached, and the RPC refuses the row again on its own.
//
// The sentence is the only thing this route can change. Type, source and every subject link are what
// the memory IS — the RPC has no parameters for them, so there is nothing to guard here.

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  try {
    const input = parseMemoryUpdateInput(body);
    // Audited inside the RPC transaction (202608160001 §4) — `yorisou.life.memory.updated` is
    // TRANSACTIONAL, and auditLifeOs throws by design if called with it. The record of the edit
    // must not be able to go missing separately from the edit.
    //
    // Owner scope lives in the RPC's WHERE clause: `false` means not found OR not yours, and this
    // response cannot tell those apart. Someone else's id is not discoverable through here.
    const updated = await updateMemory(gate.viewer.accountId, id, input.content);
    if (!updated) return NextResponse.json({ error: "memory_not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    return lifeApiError(error);
  }
}
