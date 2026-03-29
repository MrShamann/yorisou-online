import type { SupportAssistantLocale } from "@/lib/ai/support/scenario-engine";

export type HinataVoiceLocale = SupportAssistantLocale;

export type VoiceConfidenceLabel = "high" | "medium" | "low" | "unknown";

export type VoiceSignalEventType =
  | "recording_started"
  | "transcription_ready"
  | "transcript_retry_requested"
  | "transcript_confirmed"
  | "transcript_corrected"
  | "voice_reply_requested"
  | "voice_reply_played"
  | "voice_to_text_fallback";

export type VoiceInteractionMode = "voice_pending_confirmation" | "voice_to_text" | "text_only_after_voice" | "playback_only";

export type VoiceTranscriptionInput = {
  audioBase64: string;
  mimeType: string;
  locale: HinataVoiceLocale;
  fileName?: string | null;
  retryCount: number;
  utteranceIndex?: number | null;
};

export type VoiceTranscriptionResult = {
  interactionId: string;
  provider: string;
  transcript: string;
  transcriptConfidence: number | null;
  confidenceLabel: VoiceConfidenceLabel;
  uncertaintyFlags: string[];
  requiresConfirmation: true;
  segmentedUtteranceSuggested: boolean;
  correctionCount: number;
  retryCount: number;
};

export type VoiceSynthesisInput = {
  text: string;
  locale: HinataVoiceLocale;
  voiceStyle: "hinata_calm_support";
};

export type VoiceSynthesisResult = {
  provider: string;
  audioBase64: string;
  mimeType: string;
  playbackHints: {
    pacing: "slow" | "steady";
    sentencePauseMs: number;
  };
};

export type VoiceSignalRecord = {
  id: string;
  createdAt: string;
  interactionId: string | null;
  locale: HinataVoiceLocale;
  eventType: VoiceSignalEventType;
  interactionMode: VoiceInteractionMode;
  provider: string | null;
  transcriptConfidence: number | null;
  confidenceLabel: VoiceConfidenceLabel;
  retryCount: number;
  correctionCount: number;
  transcriptLength: number | null;
  uncertaintyFlags: string[];
  switchedToText: boolean;
  notes: string | null;
};

export type SupportVoiceTranscribeResponse =
  | ({ success: true } & VoiceTranscriptionResult)
  | { success: false; error: string; fallbackMessage?: string };

export type SupportVoiceSpeakResponse =
  | ({ success: true } & VoiceSynthesisResult)
  | { success: false; error: string; fallbackMessage?: string };

