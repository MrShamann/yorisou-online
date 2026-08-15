import { NextResponse } from "next/server";
import {
  ACTIVE_VISIBILITIES,
  isVisibilityExpansion,
  ownerCard,
  updateExperience,
  type ClearableExperienceField,
  type ExperienceUpdateInput,
  type ExperienceVisibility,
} from "@/lib/server/experienceCards";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";

export const dynamic = "force-dynamic";

// REUSE, NOT A SECOND MODEL — the same statement the collection route makes. This is a Life-OS-shaped
// door onto ONE existing yorisou_experience_card: the same updateExperience, the same revisions,
// consents and de-identification scan as /api/experiences/[id]. What it adds is the feature gate, the
// Life OS audit event, and a body it actually parses.
//
// A PATCH IS NOT A REPLACE. An absent field means leave it alone; it never means null. The rule lives
// in updateExperience (see its CLEARABLE_FIELDS note) and this route's whole job on that point is to
// not undo it — which means never turning a key the caller omitted into a value. `text()` below
// returns undefined for anything that is not a string, so omission survives the trip intact, and
// clearing stays possible only through an explicit clearFields entry.
//
// NOT YOURS ANSWERS LIKE NOT THERE. ownerCard is owner-scoped, so a card belonging to someone else is
// indistinguishable from one that does not exist: an id cannot be used to probe for cards.

/** undefined for anything the caller did not send as a string — see the note above on omission. */
const text = (value: unknown) => (typeof value === "string" ? value : undefined);

/**
 * Map an experienceCards error onto a status and a BOUNDED code.
 *
 * The field-scoped family carries `:<field>`, and for clearFields that field came from the request —
 * so the response names the code alone. Anything unrecognised falls through to lifeApiError, which is
 * the shared mapper for every /api/life/* route.
 */
const BOUNDED_REFUSALS = [
  "invalid_experience_card",
  "identifying_detail_detected",
  "invalid_saved_result_source",
  "experience_field_too_long",
  "experience_field_not_clearable",
  "experience_field_set_and_cleared",
  "experience_field_required_when_shared",
];
function experienceApiError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "";
  if (message === "experience_not_found") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (message === "preview_confirmation_required") {
    return NextResponse.json({ error: message }, { status: 409 });
  }
  const code = message.split(":")[0];
  if (BOUNDED_REFUSALS.includes(code)) return NextResponse.json({ error: code }, { status: 422 });
  return lifeApiError(error);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const visibility = body.visibility === undefined ? undefined : (body.visibility as ExperienceVisibility);
  if (visibility !== undefined && !ACTIVE_VISIBILITIES.includes(visibility)) {
    return NextResponse.json({ error: "invalid_experience_card" }, { status: 422 });
  }
  // Only an explicit list clears anything. Which names are clearable is decided by the store's own
  // CLEARABLE_FIELDS, so this narrows the type and leaves that check where it lives.
  const clearFields = Array.isArray(body.clearFields)
    ? (body.clearFields.filter((field) => typeof field === "string") as ClearableExperienceField[])
    : undefined;
  try {
    const current = await ownerCard(gate.viewer.accountId, id);
    if (!current) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const expanded = visibility !== undefined && isVisibilityExpansion(current.visibility, visibility);
    // WIDENING IS REFUSED BEFORE ANYTHING IS WRITTEN. updateExperience refuses it too — that is the
    // authority — but refusing here means a request that would widen without confirmation never
    // reaches the merge, and the person's other edits are not half-applied on the way to a 409.
    //
    // `!== true` and not truthiness: the confirmation is the evidence that someone saw a preview of
    // what would become visible, and "yes", 1 and {} are not that evidence.
    if (expanded && body.previewConfirmed !== true) {
      return NextResponse.json({ error: "preview_confirmation_required" }, { status: 409 });
    }
    const patch: ExperienceUpdateInput = {
      title: text(body.title),
      situation: text(body.situation),
      actionTried: text(body.actionTried),
      perceivedOutcome: text(body.perceivedOutcome),
      lesson: text(body.lesson),
      stateContext: text(body.stateContext),
      limitations: text(body.limitations),
      mayFit: text(body.mayFit),
      mayNotFit: text(body.mayNotFit),
      visibility,
      clearFields,
      previewConfirmed: body.previewConfirmed === true,
    };
    const row = await updateExperience(gate.viewer.accountId, id, patch);
    // Asynchronous delivery (AUDIT_DELIVERY_CLASS): the card and its revision row are the record, and
    // nothing here destroys anything. detail carries enum values and a count only — never the text.
    await auditLifeOs({
      ownerAccountId: gate.viewer.accountId,
      action: "yorisou.life.experience.updated",
      entityKind: "experience",
      entityRef: String(row.id),
      reason: expanded
        ? "visibility_expanded"
        : visibility !== undefined && visibility !== current.visibility
          ? "visibility_narrowed"
          : "content_updated",
      detail: {
        from_visibility: current.visibility,
        to_visibility: row.visibility,
        expanded,
        cleared_fields: clearFields?.length ?? 0,
      },
    });
    return NextResponse.json({ experience: row });
  } catch (error) {
    return experienceApiError(error);
  }
}
