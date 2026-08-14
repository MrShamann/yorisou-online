import { NextResponse } from "next/server";
import { draftReflection } from "@/lib/server/lifeOs/reflectionAssistant";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { requireLifeViewer } from "@/lib/server/lifeOs/guard";
import type { ReflectionField } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

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
  const answers = (body.answers ?? {}) as Partial<Record<ReflectionField, string>>;
  const outcome = await draftReflection(answers);
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
