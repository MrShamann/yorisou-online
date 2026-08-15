import { NextResponse } from "next/server";
import { lifeReturnView, lifeTimelinePage, parseTimelineFilter } from "@/lib/server/lifeOs/timeline";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";

export const dynamic = "force-dynamic";

// Read-only, and read-only on purpose: a timeline that could write would be asserting relationships,
// which is the Life Graph this phase is explicitly not building.

export async function GET(request: Request) {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  const params = new URL(request.url).searchParams;
  const view = params.get("view");
  try {
    if (view === "return") return NextResponse.json({ returnView: await lifeReturnView(gate.viewer.accountId) });
    // The filter is validated server-side, and the cursor carries the filter it was minted under —
    // replaying a cursor across filters would skip or repeat rows with no error anywhere.
    const filter = parseTimelineFilter(params.get("filter"));
    const rawLimit = Number.parseInt(params.get("limit") ?? "", 10);
    const page = await lifeTimelinePage(gate.viewer.accountId, {
      cursor: params.get("cursor"),
      filter,
      limit: Number.isFinite(rawLimit) ? rawLimit : undefined,
    });
    return NextResponse.json(page);
  } catch (error) {
    // The two bounded timeline errors are caller mistakes, not server faults.
    const message = error instanceof Error ? error.message : "";
    if (message === "osf1_timeline_filter_invalid" || message === "osf1_timeline_cursor_invalid") {
      return NextResponse.json({ error: message }, { status: 422 });
    }
    return lifeApiError(error);
  }
}
