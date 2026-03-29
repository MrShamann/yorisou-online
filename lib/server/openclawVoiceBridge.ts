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
const supportChatUrl = process.env.OPENCLOUD_SUPPORT_CHAT_URL?.trim() || "";
const supportChatToken = process.env.OPENCLOUD_SUPPORT_CHAT_TOKEN?.trim() || "";

export class OpenClawVoiceBridgeError extends Error {
  constructor(
    message: string,
    public readonly code: "not_configured" | "unreachable" | "request_failed" | "invalid_response",
    public readonly remoteError?: string,
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

function getVoiceBridgeToken() {
  return voiceToken || supportChatToken;
}

function getVoiceBridgeBaseCandidates() {
  if (voiceBaseUrl) {
    return [voiceBaseUrl];
  }

  if (!supportChatUrl) {
    return [];
  }

  try {
    const source = new URL(supportChatUrl);
    const candidates = new Set<string>();
    const normalizedPath = source.pathname.replace(/\/+$/, "");
    const pathVariants = new Set<string>([""]);

    if (normalizedPath) {
      pathVariants.add(normalizedPath);
      pathVariants.add(normalizedPath.replace(/\/support\/chat$/i, ""));
      pathVariants.add(normalizedPath.replace(/\/chat$/i, ""));

      const lastSlash = normalizedPath.lastIndexOf("/");
      if (lastSlash > 0) {
        pathVariants.add(normalizedPath.slice(0, lastSlash));
      }
    }

    for (const variant of pathVariants) {
      const path = variant.replace(/\/+$/, "");
      candidates.add(`${source.origin}${path}`);
    }

    return Array.from(candidates).filter(Boolean);
  } catch {
    return [];
  }
}

function requireVoiceBridgeConfig() {
  if (getVoiceBridgeBaseCandidates().length === 0) {
    throw new OpenClawVoiceBridgeError("voice bridge base URL is not configured", "not_configured");
  }
}

async function performVoiceBridgeRequest<T>(pathname: string, payload: unknown) {
  requireVoiceBridgeConfig();
  const token = getVoiceBridgeToken();
  const candidates = getVoiceBridgeBaseCandidates();
  let lastError: OpenClawVoiceBridgeError | null = null;

  for (const candidate of candidates) {
    let response: Response;
    try {
      response = await fetch(`${candidate}${pathname}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    } catch (error) {
      lastError = new OpenClawVoiceBridgeError(
        `voice bridge is unreachable for ${pathname}: ${error instanceof Error ? error.message : "unknown fetch error"}`,
        "unreachable",
      );
      continue;
    }

    if (!response.ok) {
      let errorPayload: { error?: string; fallbackMessage?: string } | null = null;

      try {
        errorPayload = (await response.json()) as { error?: string; fallbackMessage?: string } | null;
      } catch {
        errorPayload = null;
      }

      const errorCode = errorPayload?.error || "";
      if (errorCode === "voice_stt_not_configured" || errorCode === "voice_tts_not_configured") {
        throw new OpenClawVoiceBridgeError(`voice bridge not configured: ${errorCode}`, "not_configured", errorCode);
      }

      if (errorCode === "voice_audio_too_short" || errorCode === "voice_backend_unreachable" || errorCode === "voice_transcript_unrecognizable") {
        throw new OpenClawVoiceBridgeError(`voice bridge request failed: ${response.status} ${errorCode}`, "request_failed", errorCode);
      }

      if (response.status === 401 || response.status === 403 || response.status === 404) {
        lastError = new OpenClawVoiceBridgeError(
          `voice bridge request failed: ${response.status}${errorCode ? ` ${errorCode}` : ""}`,
          "request_failed",
          errorCode || undefined,
        );
        continue;
      }

      throw new OpenClawVoiceBridgeError(
        `voice bridge request failed: ${response.status}${errorCode ? ` ${errorCode}` : ""}`,
        "request_failed",
        errorCode || undefined,
      );
    }

    const result = (await response.json()) as T | null;
    if (!result) {
      lastError = new OpenClawVoiceBridgeError("voice bridge returned an empty response", "invalid_response");
      continue;
    }

    return result;
  }

  if (lastError) {
    throw lastError;
  }

  throw new OpenClawVoiceBridgeError("voice bridge base URL is not configured", "not_configured");
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
  if (getVoiceBridgeBaseCandidates().length === 0) {
    throw new OpenClawVoiceBridgeError("voice bridge base URL is not configured", "not_configured");
  }
  return new HttpOpenClawSpeechToTextProvider();
}

function getTextToSpeechProvider() {
  if (getVoiceBridgeBaseCandidates().length === 0) {
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
    if (error instanceof OpenClawVoiceBridgeError) {
      if (error.code === "not_configured") {
        return {
          success: false,
          error: "voice_backend_not_configured",
          fallbackMessage: "Voice transcription is not configured yet. Please keep using text for now.",
        };
      }

      if (error.code === "unreachable") {
        return {
          success: false,
          error: "voice_backend_unreachable",
          fallbackMessage: "The voice transcription service is not reachable yet. Please retry or continue in text.",
        };
      }

      if (error.remoteError === "voice_audio_too_short") {
        return {
          success: false,
          error: "voice_audio_too_short",
          fallbackMessage: "That recording was too short to transcribe. Please try again with a slightly longer phrase.",
        };
      }

      if (error.remoteError === "voice_backend_unreachable") {
        return {
          success: false,
          error: "voice_backend_unreachable",
          fallbackMessage: "The voice transcription service is not reachable yet. Please retry or continue in text.",
        };
      }

      if (error.remoteError === "voice_transcript_unrecognizable") {
        return {
          success: false,
          error: "voice_transcript_unrecognizable",
          fallbackMessage: "We could not understand that recording clearly enough yet. Please retry, or edit after a clearer attempt.",
        };
      }
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
  if (getVoiceBridgeBaseCandidates().length === 0) {
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
