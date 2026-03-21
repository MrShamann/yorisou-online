import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { updateSupportProfile, type LineBindingStatus } from "@/lib/server/yorisouData";

type SupportPreferencesPayload = {
  lineBindingStatus?: LineBindingStatus;
  lineDisplayName?: string;
  lineNotificationsEnabled?: boolean;
  familyContactName?: string;
  familyContactRelation?: string;
  familyContactMethod?: string;
  familyContactValue?: string;
  familyShareNote?: string;
};

export async function POST(request: Request) {
  try {
    const viewer = await getViewerContext();

    if (!viewer.account) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const payload = (await request.json()) as SupportPreferencesPayload;
    const account = await updateSupportProfile(viewer.account.id, {
      lineBindingStatus: payload.lineBindingStatus,
      lineDisplayName: payload.lineDisplayName?.trim(),
      lineNotificationsEnabled: payload.lineNotificationsEnabled,
      familyContactName: payload.familyContactName?.trim(),
      familyContactRelation: payload.familyContactRelation?.trim(),
      familyContactMethod: payload.familyContactMethod?.trim(),
      familyContactValue: payload.familyContactValue?.trim(),
      familyShareNote: payload.familyShareNote?.trim(),
    });

    return NextResponse.json({ success: true, supportProfile: account?.supportProfile || null });
  } catch (error) {
    console.error("support preferences route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
