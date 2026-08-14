import { NextResponse } from "next/server";
import { createExperience, listOwnerCards } from "@/lib/server/experienceCards";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";

export const dynamic = "force-dynamic";

// REUSE, NOT A SECOND MODEL. This route is a Life-OS-shaped door onto the EXISTING
// yorisou_experience_cards vertical (lib/server/experienceCards.ts) — the same table, the same
// revisions, consents, moderation and de-identification machinery. It creates no experience entity
// of its own, and it exists only so the Life OS surfaces have a consistent /api/life/* namespace
// and so experience writes are audited alongside the other four domains.
//
// Always PRIVATE. Sharing is a separate, deliberate decision made on /experiences, where the
// preview-confirmation and visibility controls live. Offering a visibility choice here would put
// the most consequential control in this product at the bottom of a note-taking form.

export async function GET() {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  try {
    return NextResponse.json({ experiences: await listOwnerCards(gate.viewer.accountId) });
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
    const row = await createExperience(gate.viewer.accountId, {
      title: typeof body.title === "string" ? body.title : null,
      situation: String(body.situation ?? ""),
      actionTried: String(body.actionTried ?? ""),
      perceivedOutcome: String(body.perceivedOutcome ?? ""),
      lesson: typeof body.lesson === "string" ? body.lesson : null,
      visibility: "PRIVATE",
    });
    await auditLifeOs({
      ownerAccountId: gate.viewer.accountId,
      action: "yorisou.life.experience.created",
      entityKind: "experience",
      entityRef: String(row.id),
      reason: "private_draft",
    });
    return NextResponse.json({ experience: row }, { status: 201 });
  } catch (error) {
    return lifeApiError(error);
  }
}
