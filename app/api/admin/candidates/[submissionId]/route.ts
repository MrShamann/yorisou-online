import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import {
  getCandidateSubmission,
  listCandidateEvents,
  transitionCandidateSubmission,
} from "@/lib/server/candidateIntake";
import { CANDIDATE_SUBMISSION_STATUSES, type CandidateSubmissionStatus } from "@/lib/candidate-intake/stateMachine";

// CIF-1 admin API — one submission: view (with event history) + governed
// state transition. Admin only. A mandatory reason is enforced for material
// decisions by both this layer and the DB function.

export async function GET(_request: Request, context: { params: Promise<{ submissionId: string }> }) {
  const viewer = await requireAdminRequestViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { submissionId } = await context.params;
  const submission = await getCandidateSubmission(submissionId);
  if (!submission) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ submission, events: await listCandidateEvents(submissionId) });
}

export async function POST(request: Request, context: { params: Promise<{ submissionId: string }> }) {
  const viewer = await requireAdminRequestViewer();
  const actor = viewer?.account?.id;
  if (!actor) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { submissionId } = await context.params;
  const body = (await request.json().catch(() => null)) as { toStatus?: string; reason?: string } | null;
  const toStatus = body?.toStatus;
  if (!toStatus || !CANDIDATE_SUBMISSION_STATUSES.includes(toStatus as CandidateSubmissionStatus)) {
    return NextResponse.json({ error: "invalid_target_status" }, { status: 400 });
  }
  const result = await transitionCandidateSubmission({
    submissionId,
    toStatus: toStatus as CandidateSubmissionStatus,
    reason: body?.reason ?? null,
    actor,
    actorType: "admin",
  });
  if (!result.ok) {
    const status = result.code === "not_found" ? 404 : 422;
    return NextResponse.json({ error: result.code }, { status });
  }
  return NextResponse.json({ ok: true });
}
