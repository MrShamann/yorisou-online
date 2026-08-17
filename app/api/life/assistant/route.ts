import { NextResponse } from "next/server";
import { draftReflection } from "@/lib/server/lifeOs/reflectionAssistant";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { newCorrelationId, recordLifeOsOps } from "@/lib/server/lifeOs/observability";
import { LifeOsInputError, parseAssistantInput } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";
// THE PLATFORM MUST OUTLIVE THE BUDGET. draftReflection allows itself 25 seconds in total (two provider
// attempts inside one deadline). If the host's default function timeout is shorter, the platform kills
// the request first: the person gets a platform error mid-reflection instead of the designed
// `200 {ok:false}` they can continue from, AND no `life_os.assistant.provider_failed` is emitted — the
// signal is missing in exactly the failure mode it was added for. 30 > 25, stated rather than assumed.
export const maxDuration = 30;

// PHASE D — the Reflection Assistant endpoint.
//
// It takes the text the person just typed and returns a DRAFT. It stores nothing: there is no
// assistant table, no draft row, no history. The person accepts the draft by saving a reflection
// through /api/life/reflections, which is the same explicit-save path as before.
//
// Marked `mutation: true` even though it writes no row of the person's, because it spends a provider
// call and is only meaningful when the Life OS is actually activated — and because a capability that
// reached a model while the feature was notionally off would be exactly the wrong surprise.

export async function POST(request: Request) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  // Bounded before it reaches a provider. Everything here is text the person typed moments ago, but
  // "the person typed it" is a property of the flow, not of the request — an unbounded body would
  // reach the model just as readily.
  let parsed;
  try {
    parsed = parseAssistantInput(body);
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    throw error;
  }
  const outcome = await draftReflection(parsed.answers, parsed.mode);
  if (!outcome.ok) {
    // A refusal is recorded too — a boundary violation is the single most important thing this
    // capability can produce, and it must not be invisible just because nothing was shown.
    if (outcome.reason === "boundary_violation") {
      await auditLifeOs({
        ownerAccountId: gate.viewer.accountId,
        action: "yorisou.life.assistant.refused",
        entityKind: "assistant",
        reason: outcome.reason,
      });
    }
    // THE PROVIDER FAILURE SIGNAL. `life_os.assistant.provider_failed` was declared in the ops
    // vocabulary and emitted by nothing, so a provider that had started answering with malformed
    // JSON for every request would have looked, from outside, exactly like a product where the
    // assistant is switched off. The normalized reason is the error class, which is why
    // draftReflection distinguishes empty from malformed from oversized from timeout.
    //
    // `assistant_unavailable` and `nothing_written` are NOT logged: no provider configured is this
    // product's ordinary state, and an empty request is a person changing their mind.
    if (outcome.reason !== "assistant_unavailable" && outcome.reason !== "nothing_written") {
      recordLifeOsOps({
        event: "life_os.assistant.provider_failed",
        correlationId: newCorrelationId(),
        ownerAccountId: gate.viewer.accountId,
        errorClass: outcome.reason,
      });
    }
    // 200 with a reason, not an error status: for the person this is "the assistant isn't available",
    // which is an ordinary state of the flow, not a failure of what they were doing.
    return NextResponse.json({ ok: false, reason: outcome.reason });
  }
  await auditLifeOs({
    ownerAccountId: gate.viewer.accountId,
    action: "yorisou.life.assistant.drafted",
    entityKind: "assistant",
    reason: "draft_offered",
    detail: { provider: outcome.draft.provider, model: outcome.draft.model },
  });
  return NextResponse.json({ ok: true, draft: outcome.draft });
}
