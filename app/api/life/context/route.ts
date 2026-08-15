import { NextResponse } from "next/server";
import { getUserContext, upsertUserContext } from "@/lib/server/lifeOs/store";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { PREFERENCE_KEYS, type ContextLanguage } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  try {
    return NextResponse.json({ context: await getUserContext(gate.viewer.accountId) });
  } catch (error) {
    return lifeApiError(error);
  }
}

export async function PUT(request: Request) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  try {
    const preferences = (body.preferences ?? {}) as Record<string, unknown>;
    await upsertUserContext(gate.viewer.accountId, {
      language: body.language as ContextLanguage | undefined,
      region: typeof body.region === "string" ? body.region : null,
      timezone: typeof body.timezone === "string" ? body.timezone : undefined,
      preferences,
    });
    // Audit carries COUNTS AND KEY NAMES ONLY — never a preference value, which could be anything.
    await auditLifeOs({
      ownerAccountId: gate.viewer.accountId,
      action: "yorisou.life.context.updated",
      entityKind: "user_context",
      reason: "user_edit",
      detail: { preference_keys: Object.keys(preferences).filter((k) => (PREFERENCE_KEYS as readonly string[]).includes(k)).length },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return lifeApiError(error);
  }
}
