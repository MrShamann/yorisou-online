import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { getOpenClawArtifactStoreStatus } from "@/lib/server/openclawArtifactStore";
import { readNeedsSignalArtifacts } from "@/lib/server/openclawNeedsInsight";
import { readOpenClawReflectionArtifacts } from "@/lib/server/openclawReflection";

type ArtifactQueryType = "reflection" | "needs-signal" | "all";

function isAllowedByToken(request: Request) {
  const expected = process.env.OPENCLAW_ARTIFACT_READ_TOKEN?.trim();
  if (!expected) {
    return false;
  }

  const headerToken = request.headers.get("x-openclaw-artifact-token")?.trim();
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return headerToken === expected || bearerToken === expected;
}

function getQueryType(value: string | null): ArtifactQueryType {
  if (value === "reflection" || value === "needs-signal") {
    return value;
  }
  return "all";
}

function getLimit(value: string | null) {
  const parsed = Number.parseInt(value || "20", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 20;
  }
  return Math.min(parsed, 100);
}

export async function GET(request: Request) {
  const viewer = await requireAdminRequestViewer();
  const tokenAllowed = isAllowedByToken(request);

  if (!viewer && !tokenAllowed) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = getQueryType(url.searchParams.get("type"));
  const limit = getLimit(url.searchParams.get("limit"));

  const [reflections, needsSignals] = await Promise.all([
    type === "needs-signal" ? Promise.resolve([]) : readOpenClawReflectionArtifacts(),
    type === "reflection" ? Promise.resolve([]) : readNeedsSignalArtifacts(),
  ]);

  return NextResponse.json({
    success: true,
    filters: {
      type,
      limit,
    },
    accessMode: viewer ? "admin_session" : "artifact_token",
    store: getOpenClawArtifactStoreStatus(),
    reflections: reflections.slice(0, limit),
    needsSignals: needsSignals.slice(0, limit),
  });
}
