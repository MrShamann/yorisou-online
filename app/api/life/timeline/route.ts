import { NextResponse } from "next/server";
import { lifeReturnView, lifeTimeline } from "@/lib/server/lifeOs/timeline";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";

export const dynamic = "force-dynamic";

// Read-only, and read-only on purpose: a timeline that could write would be asserting relationships,
// which is the Life Graph this phase is explicitly not building.

export async function GET(request: Request) {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  const view = new URL(request.url).searchParams.get("view");
  try {
    if (view === "return") return NextResponse.json({ returnView: await lifeReturnView(gate.viewer.accountId) });
    return NextResponse.json({ timeline: await lifeTimeline(gate.viewer.accountId) });
  } catch (error) {
    return lifeApiError(error);
  }
}
