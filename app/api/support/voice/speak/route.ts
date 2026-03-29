import { NextResponse } from "next/server";

import { synthesizeSupportVoice } from "@/lib/server/openclawVoiceBridge";
import { recordOpenClawVoiceSignal } from "@/lib/server/openclawVoiceSignals";
import type { VoiceSignalRecord } from "@/lib/voice/contracts";

type VoiceSpeakRequest = {
  text?: string;
  locale?: "ja" | "en";
  interactionId?: string | null;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VoiceSpeakRequest;
    const text = typeof payload.text === "string" ? payload.text.trim() : "";
    const locale = payload.locale === "en" ? "en" : "ja";

    if (!text) {
      return NextResponse.json({ success: false, error: "missing_text" }, { status: 400 });
    }

    const signalBase: Omit<VoiceSignalRecord, "id" | "createdAt"> = {
      interactionId: payload.interactionId || null,
      locale,
      eventType: "voice_reply_requested",
      interactionMode: "playback_only",
      provider: null,
      transcriptConfidence: null,
      confidenceLabel: "unknown",
      retryCount: 0,
      correctionCount: 0,
      transcriptLength: text.length,
      uncertaintyFlags: [],
      switchedToText: false,
      notes: null,
    };
    await recordOpenClawVoiceSignal(signalBase);

    const result = await synthesizeSupportVoice({
      text,
      locale,
      voiceStyle: "hinata_calm_support",
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 503 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("voice speak route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
