import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { sharingOperational } from "@/lib/yorisou/sharing/access";
import { buildSharePreview } from "@/lib/server/platform/sharingCore/service";
import { buildOwnedImairoShareCandidate } from "@/lib/server/sharing/imairoShareSource";
import { validateImairoSharePayload } from "@/packs/yorisou/imairo/share";

export const dynamic = "force-dynamic";

// SHR-1 — mandatory preview, step one of the formal share flow. Input: the caller's OWN persisted
// result row id, nothing else. Output: the exact public-safe derivative that WOULD be published,
// plus the digest that locks it. Nothing persists here; a preview is a look, not a draft.
export async function POST(request: Request) {
  if (!sharingOperational()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const resultRowId = typeof body.resultRowId === "string" ? body.resultRowId : "";
  if (!resultRowId) return NextResponse.json({ error: "result_row_id_required" }, { status: 422 });

  const source = await buildOwnedImairoShareCandidate({ resultRowId });
  if (!source.ok) {
    // "Not found" and "not yours" are indistinguishable on purpose.
    if (source.refusal === "source_not_publishable") {
      return NextResponse.json({ error: "share_source_not_publishable" }, { status: 422 });
    }
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const preview = buildSharePreview(source.candidate, validateImairoSharePayload);
  // The client receives the payload (to render the preview) and the digest — never the source_ref
  // back-channel: it already knows its own resultRowId, and nothing else private exists here.
  return NextResponse.json({
    payload: preview.candidate.payload,
    template_version: preview.candidate.template_version,
    payload_version: preview.candidate.payload_version,
    digest: preview.digest,
  });
}
