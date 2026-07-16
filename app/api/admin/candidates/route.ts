import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import {
  createCandidateOffering,
  createCandidateOrganization,
  createCandidateSubmission,
  findCandidateSubmissionsByExternalRef,
  findDuplicateOrganizations,
  listCandidateOfferings,
  listCandidateOrganizations,
  listCandidateSubmissions,
} from "@/lib/server/candidateIntake";

// CIF-1 admin API — internal only. Every method requires an admin viewer.
// No public/self-service intake exists.

export async function GET(request: Request) {
  const viewer = await requireAdminRequestViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const organizationId = url.searchParams.get("organizationId");
  if (organizationId) {
    return NextResponse.json({
      offerings: await listCandidateOfferings(organizationId),
      submissions: await listCandidateSubmissions({ organizationId }),
    });
  }
  return NextResponse.json({
    organizations: await listCandidateOrganizations(),
    submissions: await listCandidateSubmissions(),
  });
}

export async function POST(request: Request) {
  const viewer = await requireAdminRequestViewer();
  const actor = viewer?.account?.id;
  if (!actor) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as ({ kind?: string } & Record<string, unknown>) | null;
  if (!body?.kind) return NextResponse.json({ error: "missing_kind" }, { status: 400 });
  try {
    const fields = body as Record<string, unknown>;
    if (body.kind === "organization") {
      const org = await createCandidateOrganization({ ...fields, actor, actorType: "admin" } as Parameters<typeof createCandidateOrganization>[0]);
      const duplicates = await findDuplicateOrganizations({
        externalDomain: org.external_domain,
        externalRef: org.external_ref,
        displayName: org.display_name,
      });
      return NextResponse.json({ organization: org, duplicateCandidates: duplicates.filter((d) => d.id !== org.id) }, { status: 201 });
    }
    if (body.kind === "offering") {
      const offering = await createCandidateOffering({ ...fields, actor, actorType: "admin" } as Parameters<typeof createCandidateOffering>[0]);
      return NextResponse.json({ offering }, { status: 201 });
    }
    if (body.kind === "submission") {
      const submission = await createCandidateSubmission({ ...fields, actor, actorType: "admin" } as Parameters<typeof createCandidateSubmission>[0]);
      const priorByRef = submission.external_ref ? await findCandidateSubmissionsByExternalRef(submission.external_ref) : [];
      return NextResponse.json({ submission, priorSubmissionsSameRef: priorByRef.filter((s) => s.id !== submission.id) }, { status: 201 });
    }
    return NextResponse.json({ error: "unknown_kind" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const status = message.includes("requires_recorded_consent") ? 422 : 500;
    console.error("candidate intake create failed", { kind: body.kind, message });
    return NextResponse.json({ error: status === 422 ? message : "candidate_create_failed" }, { status });
  }
}
