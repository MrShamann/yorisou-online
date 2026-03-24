import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { supportCaseService } from "@/lib/server/foundation/supportCaseService";
import type { SupportCaseStatus } from "@/lib/server/foundation/schema";

const ALLOWED_STATUSES: SupportCaseStatus[] = ["new", "open", "pending", "resolved"];

async function updateCaseStatus(
  request: Request,
  context: { params: Promise<{ supportCaseId: string }> },
  status: SupportCaseStatus | undefined,
) {
  const viewer = await requireAdminRequestViewer();

  if (!viewer?.account) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const { supportCaseId } = await context.params;
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ success: false, error: "invalid_status" }, { status: 400 });
  }

  const supportCase = await supportCaseService.updateStatus({
    supportCaseId,
    status,
    actorUserProfileId: viewer.account.id,
    actorAuthIdentityId: null,
  });

  if (!supportCase) {
    return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, supportCase });
}

export async function PATCH(request: Request, context: { params: Promise<{ supportCaseId: string }> }) {
  const payload = (await request.json()) as { status?: SupportCaseStatus };
  return updateCaseStatus(request, context, payload.status);
}

export async function POST(request: Request, context: { params: Promise<{ supportCaseId: string }> }) {
  const formData = await request.formData();
  const status = String(formData.get("status") || "") as SupportCaseStatus;
  const response = await updateCaseStatus(request, context, status);

  if (response.ok) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: request.headers.get("referer") || "/admin",
      },
    });
  }

  return response;
}
