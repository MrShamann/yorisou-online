import { NextResponse } from "next/server";
import { updateMemory, setMemoryLifecycle } from "@/lib/server/lifeOs/store";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { LifeOsInputError, parseMemoryUpdateInput, parseMemoryLifecycleInput, parseUuid } from "@/lib/life-os/contract";

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
  const { id: rawId } = await context.params;
  // A path segment is caller-supplied like any other input. Validating it here keeps an unparseable
  // id from reaching PostgREST, where it becomes a 400 the store cannot classify and the API would
  // return as a 500.
  let id: string;
  try {
    id = parseUuid(rawId, "memory_id_required");
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    throw error;
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  // TWO DISTINCT ACTS ON ONE RESOURCE, dispatched on which one the caller asked for. A lifecycle
  // change alters what the product may DO with the memory; a content edit alters what it SAYS.
  // Folding them into one payload would let a caller do both in a request that only looked like one.
  const wantsLifecycle = typeof (body as Record<string, unknown> | null)?.lifecycle === "string";
  try {
    if (wantsLifecycle) {
      const { lifecycle } = parseMemoryLifecycleInput(body);
      // Audited inside the RPC transaction. The RPC also refuses to bring a REVOKED memory back:
      // withdrawing authorization is a decision, not a toggle.
      const changed = await setMemoryLifecycle(gate.viewer.accountId, id, lifecycle);
      if (!changed) return NextResponse.json({ error: "memory_not_found" }, { status: 404 });
      return NextResponse.json({ ok: true, lifecycle });
    }
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
