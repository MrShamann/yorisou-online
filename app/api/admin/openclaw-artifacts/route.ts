import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { getOpenClawArtifactStoreStatus } from "@/lib/server/openclawArtifactStore";
import { buildNeedsInsightAggregate, deriveNeedsFeedbackCandidates, readNeedsSignalArtifacts } from "@/lib/server/openclawNeedsInsight";
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

function getSince(value: string | null) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function filterArtifactsByQuery<T extends { id: string; createdAt: string }>(input: {
  artifacts: T[];
  artifactId: string | null;
  since: string | null;
  limit: number;
}) {
  return input.artifacts
    .filter((artifact) => (input.artifactId ? artifact.id === input.artifactId : true))
    .filter((artifact) => (input.since ? artifact.createdAt >= input.since : true))
    .slice(0, input.limit);
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
  const since = getSince(url.searchParams.get("since"));
  const artifactId = url.searchParams.get("id");

  const [reflections, needsSignals] = await Promise.all([
    type === "needs-signal" ? Promise.resolve([]) : readOpenClawReflectionArtifacts(),
    type === "reflection" ? Promise.resolve([]) : readNeedsSignalArtifacts(),
  ]);

  const filteredReflections = filterArtifactsByQuery({
    artifacts: reflections,
    artifactId,
    since,
    limit,
  });
  const filteredNeedsSignals = filterArtifactsByQuery({
    artifacts: needsSignals,
    artifactId,
    since,
    limit,
  });

  const needsAggregate =
    filteredNeedsSignals.length > 0
      ? buildNeedsInsightAggregate({
          signals: filteredNeedsSignals.map((artifact) => artifact.signal),
          startAt: filteredNeedsSignals[filteredNeedsSignals.length - 1]?.createdAt || new Date().toISOString(),
          endAt: filteredNeedsSignals[0]?.createdAt || new Date().toISOString(),
          label: "filtered_recent_signals",
        })
      : null;
  const feedbackCandidates = needsAggregate ? deriveNeedsFeedbackCandidates({ aggregate: needsAggregate }).slice(0, 3) : [];

  return NextResponse.json({
    success: true,
    filters: {
      type,
      limit,
      since,
      id: artifactId,
    },
    accessMode: viewer ? "admin_session" : "artifact_token",
    store: getOpenClawArtifactStoreStatus(),
    summary: {
      reflectionCount: filteredReflections.length,
      needsSignalCount: filteredNeedsSignals.length,
      latestReflectionAt: filteredReflections[0]?.createdAt || null,
      latestNeedsSignalAt: filteredNeedsSignals[0]?.createdAt || null,
      topNeedCategories: needsAggregate
        ? Object.entries(needsAggregate.needCategoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([category, count]) => ({ category, count }))
        : [],
      feedbackCandidates,
    },
    reflections: filteredReflections,
    needsSignals: filteredNeedsSignals,
  });
}
