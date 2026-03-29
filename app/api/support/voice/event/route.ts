import { NextResponse } from "next/server";

import { recordOpenClawVoiceSignal } from "@/lib/server/openclawVoiceSignals";
import type { VoiceSignalRecord } from "@/lib/voice/contracts";

type VoiceEventRequest = Omit<VoiceSignalRecord, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VoiceEventRequest;

    if (!payload || (payload.locale !== "ja" && payload.locale !== "en")) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const record = await recordOpenClawVoiceSignal(payload);
    return NextResponse.json({ success: true, recordId: record.id });
  } catch (error) {
    console.error("voice event route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}

