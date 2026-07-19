import { NextResponse } from "next/server";

import {
  enqueueReviewItem,
  getReviewQueueSummary,
  listReviewItems,
  logAdminAccess,
  transitionReviewItem,
} from "@/lib/server/app2ServiceBackend";
import { requireAdminRequestViewer } from "@/lib/server/foundation/access";

// WS-G — review-queue admin API. Admin-only. Every call is access-logged (WS-H),
// including denied attempts by anonymous / non-admin callers.

export async function GET(request: Request) {
  const viewer = await requireAdminRequestViewer();
  if (!viewer) {
    await logAdminAccess({
      actor: "unknown",
      actorType: "anonymous",
      scope: "review_queue",
      action: "list",
      route: "/api/admin/review-queues",
      allowed: false,
      outcome: "denied_unauthorized",
    }).catch(() => {});
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? undefined;
  const queueType = url.searchParams.get("queueType") ?? undefined;
  try {
    const [items, summary] = await Promise.all([
      listReviewItems({ status, queueType }),
      getReviewQueueSummary(),
    ]);
    await logAdminAccess({
      actor: viewer.account?.id ?? "unknown",
      scope: "review_queue",
      action: "list",
      route: "/api/admin/review-queues",
      allowed: true,
      outcome: "allowed",
    }).catch(() => {});
    return NextResponse.json({ items, summary });
  } catch {
    return NextResponse.json({ error: "backend_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const viewer = await requireAdminRequestViewer();
  const actor = viewer?.account?.id;
  if (!actor) {
    await logAdminAccess({
      actor: "unknown",
      actorType: "anonymous",
      scope: "review_queue",
      action: "mutate",
      route: "/api/admin/review-queues",
      allowed: false,
      outcome: "denied_unauthorized",
    }).catch(() => {});
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as ({ kind?: string } & Record<string, unknown>) | null;
  if (!body?.kind) return NextResponse.json({ error: "missing_kind" }, { status: 400 });
  try {
    if (body.kind === "enqueue") {
      const item = await enqueueReviewItem({
        queueType: String(body.queueType ?? ""),
        severity: body.severity ? String(body.severity) : undefined,
        safeSummary: String(body.safeSummary ?? ""),
        evidenceRef: body.evidenceRef ? String(body.evidenceRef) : null,
        actor,
        detail: body.detail ? String(body.detail) : null,
      });
      await logAdminAccess({
        actor,
        scope: "review_queue",
        action: "enqueue",
        safeObjectRef: `item:${item.id}`,
        route: "/api/admin/review-queues",
        allowed: true,
        outcome: "created",
      }).catch(() => {});
      return NextResponse.json({ item }, { status: 201 });
    }
    if (body.kind === "transition") {
      const item = await transitionReviewItem({
        itemId: String(body.itemId ?? ""),
        toStatus: String(body.toStatus ?? "") as "reviewing" | "resolved" | "dismissed" | "reopened" | "open",
        actor,
        resolutionNote: body.resolutionNote ? String(body.resolutionNote) : null,
        detail: body.detail ? String(body.detail) : null,
      });
      await logAdminAccess({
        actor,
        scope: "review_queue",
        action: `transition:${item.status}`,
        safeObjectRef: `item:${item.id}`,
        route: "/api/admin/review-queues",
        allowed: true,
        outcome: "updated",
      }).catch(() => {});
      return NextResponse.json({ item });
    }
    return NextResponse.json({ error: "unknown_kind" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
