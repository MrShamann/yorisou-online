import { NextResponse } from "next/server";

import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { evaluateOpenTestingFollowUps, getOpenTestingDashboardSnapshot } from "@/lib/server/relationship-intelligence/service";

export async function GET() {
  const viewer = await requireAdminRequestViewer();

  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const [dashboard, followUps] = await Promise.all([
    getOpenTestingDashboardSnapshot(),
    evaluateOpenTestingFollowUps(),
  ]);

  return NextResponse.json({
    ok: true,
    dashboard,
    followUps,
  });
}
