import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { sharingOperational } from "@/lib/yorisou/sharing/access";
import { publishShare } from "@/lib/server/platform/sharingCore/service";
import { sharingRepository } from "@/lib/server/sharing/store";
import { buildOwnedImairoShareCandidate } from "@/lib/server/sharing/imairoShareSource";
import { validateImairoSharePayload } from "@/packs/yorisou/imairo/share";

export const dynamic = "force-dynamic";

// SHR-1 — explicit publish, the ONLY step that makes anything public. The client sends its own
// result row id and the digest it previewed — never card copy, never a payload. The server
// RELOADS the source, REBUILDS the derivative, recomputes the digest, and refuses staleness; a
// match publishes ONE idempotent immutable snapshot with its transactional audit row.
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
  const previewDigest = typeof body.previewDigest === "string" ? body.previewDigest : "";
  if (!resultRowId || !/^[0-9a-f]{64}$/.test(previewDigest)) {
    return NextResponse.json({ error: "share_publish_input_invalid" }, { status: 422 });
  }

  const source = await buildOwnedImairoShareCandidate({ resultRowId });
  if (!source.ok) {
    if (source.refusal === "source_not_publishable") {
      return NextResponse.json({ error: "share_source_not_publishable" }, { status: 422 });
    }
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const published = await publishShare({
      ownerAccountId,
      candidate: source.candidate,
      previewDigest,
      validate: validateImairoSharePayload,
      repository: sharingRepository,
    });
    return NextResponse.json({
      public_id: published.reference.public_id,
      share_path: `/share/${published.reference.public_id}`,
      reused: published.reused,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "share_preview_stale") {
      return NextResponse.json({ error: "share_preview_stale" }, { status: 409 });
    }
    return NextResponse.json({ error: "share_unavailable" }, { status: 503 });
  }
}
