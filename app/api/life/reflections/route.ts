import { NextResponse } from "next/server";
import { createReflection, getReflection, listReflections } from "@/lib/server/lifeOs/store";
import { buildMemoryCandidates } from "@/lib/server/lifeOs/aiBoundary";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { LifeOsInputError, parseReflectionInput, REFLECTION_FIELDS } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  try {
    return NextResponse.json({ reflections: await listReflections(gate.viewer.accountId) });
  } catch (error) {
    return lifeApiError(error);
  }
}

export async function POST(request: Request) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  try {
    const input = parseReflectionInput(body);
    const id = await createReflection(gate.viewer.accountId, input);
    await auditLifeOs({
      ownerAccountId: gate.viewer.accountId,
      action: "yorisou.life.reflection.created",
      entityKind: "reflection",
      entityRef: id,
      reason: input.mode === "postmortem" ? "postmortem" : "light",
      // A count of answered questions — never the answers.
      detail: { answered: REFLECTION_FIELDS.filter((f) => (input[f.field] ?? "") !== "").length, about_experience: Boolean(input.experienceId) },
    });
    const reflection = await getReflection(gate.viewer.accountId, id);
    return NextResponse.json(
      { id, memoryCandidates: reflection ? buildMemoryCandidates({ reflection }) : [] },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    return lifeApiError(error);
  }
}
