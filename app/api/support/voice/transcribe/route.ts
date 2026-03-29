import { NextResponse } from "next/server";

import { createVoiceInteractionId, transcribeSupportVoice } from "@/lib/server/openclawVoiceBridge";
import { recordOpenClawVoiceSignal } from "@/lib/server/openclawVoiceSignals";
import type { SupportAssistantLocale } from "@/lib/ai/support/scenario-engine";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    const locale = formData.get("locale") === "en" ? "en" : "ja";
    const retryCount = Math.max(0, Number(formData.get("retryCount") || 0));

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ success: false, error: "missing_audio_file" }, { status: 400 });
    }

    const interactionId = createVoiceInteractionId();
    const audioBase64 = Buffer.from(await audio.arrayBuffer()).toString("base64");
    const result = await transcribeSupportVoice({
      audioBase64,
      mimeType: audio.type || "audio/webm",
      locale: locale as SupportAssistantLocale,
      fileName: audio.name || null,
      retryCount,
      utteranceIndex: null,
    });

    if (!result.success) {
      await recordOpenClawVoiceSignal({
        interactionId,
        locale,
        eventType: "voice_to_text_fallback",
        interactionMode: "text_only_after_voice",
        provider: null,
        transcriptConfidence: null,
        confidenceLabel: "unknown",
        retryCount,
        correctionCount: 0,
        transcriptLength: null,
        uncertaintyFlags: ["transcription_unavailable"],
        switchedToText: true,
        notes: result.error,
      });
      return NextResponse.json(result, { status: 503 });
    }

    await recordOpenClawVoiceSignal({
      interactionId: result.interactionId || interactionId,
      locale,
      eventType: "transcription_ready",
      interactionMode: "voice_pending_confirmation",
      provider: result.provider,
      transcriptConfidence: result.transcriptConfidence,
      confidenceLabel: result.confidenceLabel,
      retryCount: result.retryCount,
      correctionCount: result.correctionCount,
      transcriptLength: result.transcript.length,
      uncertaintyFlags: result.uncertaintyFlags,
      switchedToText: false,
      notes: result.segmentedUtteranceSuggested ? "segmented_utterance_suggested" : null,
    });

    return NextResponse.json({
      ...result,
      interactionId: result.interactionId || interactionId,
    });
  } catch (error) {
    console.error("voice transcribe route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}

