import { NextResponse } from "next/server";

import { createVoiceInteractionId, transcribeSupportVoice } from "@/lib/server/openclawVoiceBridge";
import { interpretSupportVoiceTranscription } from "@/lib/server/openclawVoiceInterpretation";
import { recordOpenClawVoiceSignal } from "@/lib/server/openclawVoiceSignals";
import type { SupportAssistantLocale } from "@/lib/ai/support/scenario-engine";
import type { SupportVoiceTranscribeErrorCode } from "@/lib/voice/contracts";

function getErrorStatus(error: SupportVoiceTranscribeErrorCode) {
  switch (error) {
    case "missing_audio_file":
    case "voice_audio_too_short":
      return 400;
    case "voice_transcript_unrecognizable":
      return 422;
    case "voice_backend_not_configured":
    case "voice_backend_unreachable":
      return 503;
    case "voice_transcription_failed":
    default:
      return 502;
  }
}

function getFallbackUncertaintyFlags(error: SupportVoiceTranscribeErrorCode) {
  switch (error) {
    case "voice_audio_too_short":
      return ["audio_too_short"];
    case "voice_backend_not_configured":
      return ["backend_not_configured"];
    case "voice_backend_unreachable":
      return ["backend_unreachable"];
    case "voice_transcript_unrecognizable":
      return ["transcript_unrecognizable"];
    case "missing_audio_file":
      return ["missing_audio_file"];
    case "voice_transcription_failed":
    default:
      return ["transcription_unavailable"];
  }
}

function truncateForNotes(value: string, maxLength = 160) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

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
        uncertaintyFlags: getFallbackUncertaintyFlags(result.error),
        switchedToText: true,
        notes: result.error,
      });
      return NextResponse.json(result, { status: getErrorStatus(result.error) });
    }

    const interpreted = interpretSupportVoiceTranscription(locale as SupportAssistantLocale, result);
    const resolvedInteractionId = interpreted.result.interactionId || interactionId;
    await recordOpenClawVoiceSignal({
      interactionId: resolvedInteractionId,
      locale,
      eventType: "transcription_ready",
      interactionMode: interpreted.result.requiresConfirmation ? "voice_pending_confirmation" : "voice_auto_send",
      provider: interpreted.result.provider,
      transcriptConfidence: interpreted.result.transcriptConfidence,
      confidenceLabel: interpreted.result.confidenceLabel,
      retryCount: interpreted.result.retryCount,
      correctionCount: interpreted.result.correctionCount,
      transcriptLength: interpreted.result.transcript.length,
      uncertaintyFlags: interpreted.result.uncertaintyFlags,
      switchedToText: false,
      notes: JSON.stringify({
        state: interpreted.result.requiresConfirmation ? "review_required" : "auto_send_ready",
        segmentedUtteranceSuggested: interpreted.result.segmentedUtteranceSuggested,
        rawTranscript: truncateForNotes(interpreted.rawTranscript),
        effectiveTranscript: truncateForNotes(interpreted.result.transcript),
      }),
    });

    return NextResponse.json({
      ...interpreted.result,
      interactionId: resolvedInteractionId,
    });
  } catch (error) {
    console.error("voice transcribe route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
