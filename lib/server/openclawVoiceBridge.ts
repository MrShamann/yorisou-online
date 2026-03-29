import { randomUUID } from "crypto";

import type {
  SupportVoiceSpeakResponse,
  SupportVoiceTranscribeResponse,
  VoiceSignalRecord,
  VoiceSynthesisInput,
  VoiceSynthesisResult,
  VoiceTranscriptionInput,
  VoiceTranscriptionResult,
} from "@/lib/voice/contracts";

const voiceBaseUrl = process.env.OPENCLAW_VOICE_BASE_URL?.trim() || "";
const voiceToken = process.env.OPENCLAW_VOICE_TOKEN?.trim() || "";

export class OpenClawVoiceBridgeError extends Error {
  constructor(
    message: string,
    public readonly code: "not_configured" | "request_failed" | "invalid_response",
  ) {
    super(message);
  }
}

export interface OpenClawSpeechToTextProvider {
  readonly providerId: string;
  transcribe(input: VoiceTranscriptionInput): Promise<VoiceTranscriptionResult>;
}

export interface OpenClawTextToSpeechProvider {
  readonly providerId: string;
  synthesize(input: VoiceSynthesisInput): Promise<VoiceSynthesisResult>;
}

function requireVoiceBridgeConfig() {
  if (!voiceBaseUrl) {
    throw new OpenClawVoiceBridgeError("voice bridge base URL is not configured", "not_configured");
  }
}

async function performVoiceBridgeRequest<T>(pathname: string, payload: unknown) {
  requireVoiceBridgeConfig();

  const response = await fetch(`${voiceBaseUrl}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(voiceToken ? { Authorization: `Bearer ${voiceToken}` } : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    let errorPayload: { error?: string } | null = null;

    try {
      errorPayload = (await response.json()) as { error?: string } | null;
    } catch {
      errorPayload = null;
    }

    const errorCode = errorPayload?.error || "";
    if (errorCode === "voice_stt_not_configured" || errorCode === "voice_tts_not_configured") {
      throw new OpenClawVoiceBridgeError(`voice bridge not configured: ${errorCode}`, "not_configured");
    }

    throw new OpenClawVoiceBridgeError(`voice bridge request failed: ${response.status}`, "request_failed");
  }

  const result = (await response.json()) as T | null;
  if (!result) {
    throw new OpenClawVoiceBridgeError("voice bridge returned an empty response", "invalid_response");
  }

  return result;
}

class HttpOpenClawSpeechToTextProvider implements OpenClawSpeechToTextProvider {
  readonly providerId = "openclaw_http_proxy";

  async transcribe(input: VoiceTranscriptionInput) {
    return performVoiceBridgeRequest<VoiceTranscriptionResult>("/voice/transcribe", input);
  }
}

class HttpOpenClawTextToSpeechProvider implements OpenClawTextToSpeechProvider {
  readonly providerId = "openclaw_http_proxy";

  async synthesize(input: VoiceSynthesisInput) {
    return performVoiceBridgeRequest<VoiceSynthesisResult>("/voice/speak", input);
  }
}

function getSpeechToTextProvider() {
  if (!voiceBaseUrl) {
    throw new OpenClawVoiceBridgeError("voice bridge base URL is not configured", "not_configured");
  }
  return new HttpOpenClawSpeechToTextProvider();
}

function getTextToSpeechProvider() {
  if (!voiceBaseUrl) {
    throw new OpenClawVoiceBridgeError("voice bridge base URL is not configured", "not_configured");
  }
  return new HttpOpenClawTextToSpeechProvider();
}

export async function transcribeSupportVoice(input: VoiceTranscriptionInput): Promise<SupportVoiceTranscribeResponse> {
  try {
    const provider = getSpeechToTextProvider();
    const result = await provider.transcribe(input);
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof OpenClawVoiceBridgeError && error.code === "not_configured") {
      return {
        success: false,
        error: "voice_backend_not_configured",
        fallbackMessage: "Voice transcription is not configured yet. Please keep using text for now.",
      };
    }

    console.error("transcribeSupportVoice error:", error);
    return {
      success: false,
      error: "voice_transcription_failed",
      fallbackMessage: "We could not transcribe that recording yet. You can retry or continue in text.",
    };
  }
}

export async function synthesizeSupportVoice(input: VoiceSynthesisInput): Promise<SupportVoiceSpeakResponse> {
  try {
    const provider = getTextToSpeechProvider();
    const result = await provider.synthesize(input);
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof OpenClawVoiceBridgeError && error.code === "not_configured") {
      return {
        success: false,
        error: "voice_backend_not_configured",
        fallbackMessage: "Hinata voice playback is not configured yet. The text reply is still available.",
      };
    }

    console.error("synthesizeSupportVoice error:", error);
    return {
      success: false,
      error: "voice_synthesis_failed",
      fallbackMessage: "We could not prepare voice playback yet. The text reply is still available.",
    };
  }
}

export async function forwardVoiceSignalToOpenClaw(signal: VoiceSignalRecord) {
  if (!voiceBaseUrl) {
    return false;
  }

  try {
    await performVoiceBridgeRequest<{ success: true }>("/voice/signals", signal);
    return true;
  } catch (error) {
    console.error("forwardVoiceSignalToOpenClaw error:", error);
    return false;
  }
}

export function createVoiceInteractionId() {
  return `voice_${randomUUID()}`;
}
