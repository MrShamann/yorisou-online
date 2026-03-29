"use client";

import { useEffect, useRef, useState } from "react";

import type { SupportAssistantLocale } from "@/lib/ai/support/scenario-engine";
import type { SupportVoiceTranscribeResponse, VoiceConfidenceLabel, VoiceSignalRecord } from "@/lib/voice/contracts";

type SupportVoiceEntryProps = {
  locale: SupportAssistantLocale;
  disabled?: boolean;
  onUseTranscript: (transcript: string) => void;
  onSendTranscript: (transcript: string) => Promise<void>;
};

type VoiceStatus = "idle" | "recording" | "transcribing" | "ready";

const copy = {
  ja: {
    title: "声で話す",
    subtitle: "話した内容を確認してから送れます。",
    unsupported: "この端末では音声入力がまだ使えません。文字入力はそのまま使えます。",
    record: "録音を始める",
    stop: "録音を止める",
    transcribing: "音声を文字にしています…",
    preview: "認識された内容",
    editHint: "送り間違いを避けるため、送信前に確認や修正ができます。",
    lowConfidence: "聞き取りがあいまいそうです。短く区切って話すか、そのまま直して送ってください。",
    retry: "録り直す",
    useDraft: "下書きに入れる",
    sendNow: "この内容で送る",
    sendFallback: "文字で続ける",
    permissionError: "マイクにアクセスできませんでした。文字入力に切り替えられます。",
    transcribeError: "音声の文字起こしがまだ使えません。文字入力で続けられます。",
  },
  en: {
    title: "Speak to Hinata",
    subtitle: "You can confirm the transcript before sending.",
    unsupported: "Voice input is not available on this device yet. Text is still available.",
    record: "Start recording",
    stop: "Stop recording",
    transcribing: "Transcribing your recording…",
    preview: "Transcript draft",
    editHint: "You can confirm or edit the transcript before sending.",
    lowConfidence: "Recognition looks uncertain. A shorter retry or a quick edit is recommended.",
    retry: "Retry",
    useDraft: "Use as draft",
    sendNow: "Send transcript",
    sendFallback: "Continue in text",
    permissionError: "We could not access the microphone. You can continue in text.",
    transcribeError: "Voice transcription is not ready yet. You can continue in text.",
  },
} as const;

function confidenceNeedsExtraConfirmation(confidenceLabel: VoiceConfidenceLabel, uncertaintyFlags: string[]) {
  return confidenceLabel === "low" || uncertaintyFlags.length > 0;
}

export default function SupportVoiceEntry({ locale, disabled = false, onUseTranscript, onSendTranscript }: SupportVoiceEntryProps) {
  const t = copy[locale];
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [interactionId, setInteractionId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [confidenceLabel, setConfidenceLabel] = useState<VoiceConfidenceLabel>("unknown");
  const [uncertaintyFlags, setUncertaintyFlags] = useState<string[]>([]);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
        typeof MediaRecorder !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia),
    );
  }, []);

  async function logEvent(payload: Omit<VoiceSignalRecord, "id" | "createdAt">) {
    try {
      await fetch("/api/support/voice/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Best-effort only.
    }
  }

  function resetDraft() {
    setStatus("idle");
    setTranscript("");
    setOriginalTranscript("");
    setConfidenceLabel("unknown");
    setUncertaintyFlags([]);
    setProvider(null);
    setInteractionId(null);
    setError("");
  }

  async function transcribeRecording(blob: Blob) {
    setStatus("transcribing");
    setError("");

    const formData = new FormData();
    formData.append("audio", new File([blob], "hinata-voice.webm", { type: blob.type || "audio/webm" }));
    formData.append("locale", locale);
    formData.append("retryCount", String(retryCount));

    try {
      const response = await fetch("/api/support/voice/transcribe", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as SupportVoiceTranscribeResponse;

      if (!response.ok || !result.success) {
        setStatus("idle");
        setError(result.success ? t.transcribeError : result.fallbackMessage || t.transcribeError);
        await logEvent({
          interactionId: interactionId,
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
          notes: "transcribe_route_unavailable",
        });
        return;
      }

      setStatus("ready");
      setInteractionId(result.interactionId);
      setTranscript(result.transcript);
      setOriginalTranscript(result.transcript);
      setConfidenceLabel(result.confidenceLabel);
      setUncertaintyFlags(result.uncertaintyFlags);
      setProvider(result.provider);
    } catch {
      setStatus("idle");
      setError(t.transcribeError);
    }
  }

  async function startRecording() {
    if (!isSupported || disabled) {
      return;
    }

    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        if (blob.size > 0) {
          await transcribeRecording(blob);
        } else {
          setStatus("idle");
        }
      };

      await logEvent({
        interactionId,
        locale,
        eventType: "recording_started",
        interactionMode: "voice_pending_confirmation",
        provider,
        transcriptConfidence: null,
        confidenceLabel: "unknown",
        retryCount,
        correctionCount: 0,
        transcriptLength: null,
        uncertaintyFlags: [],
        switchedToText: false,
        notes: null,
      });
      recorder.start();
      setStatus("recording");
    } catch {
      setError(t.permissionError);
      setStatus("idle");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  async function handleRetry() {
    await logEvent({
      interactionId,
      locale,
      eventType: "transcript_retry_requested",
      interactionMode: "voice_pending_confirmation",
      provider,
      transcriptConfidence: null,
      confidenceLabel,
      retryCount,
      correctionCount: 0,
      transcriptLength: transcript.length || null,
      uncertaintyFlags,
      switchedToText: false,
      notes: "retry_requested",
    });
    setRetryCount((current) => current + 1);
    resetDraft();
  }

  async function finalizeTranscript(mode: "draft" | "send") {
    const nextTranscript = transcript.trim();
    const correctionCount = nextTranscript && nextTranscript !== originalTranscript ? 1 : 0;

    await logEvent({
      interactionId,
      locale,
      eventType: correctionCount > 0 ? "transcript_corrected" : "transcript_confirmed",
      interactionMode: "voice_to_text",
      provider,
      transcriptConfidence: null,
      confidenceLabel,
      retryCount,
      correctionCount,
      transcriptLength: nextTranscript.length,
      uncertaintyFlags,
      switchedToText: true,
      notes: mode === "draft" ? "copied_to_text_draft" : "sent_after_confirmation",
    });

    if (mode === "draft") {
      onUseTranscript(nextTranscript);
    } else {
      await onSendTranscript(nextTranscript);
    }

    resetDraft();
  }

  return (
    <div className="mb-3 rounded-[1.3rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.92)] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-[var(--text)]">{t.title}</div>
          <div className="mt-1 text-sm leading-7 text-[var(--muted)]">{t.subtitle}</div>
        </div>
        {isSupported && (
          <button
            type="button"
            disabled={disabled || status === "transcribing"}
            onClick={() => (status === "recording" ? stopRecording() : void startRecording())}
            className={`rounded-full px-4 py-2.5 text-sm transition ${
              status === "recording"
                ? "bg-[#9A3B2F] text-white"
                : "border border-[color:var(--line-sage)] bg-white text-[var(--accent-sage-text)]"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {status === "recording" ? t.stop : t.record}
          </button>
        )}
      </div>

      {!isSupported && <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{t.unsupported}</p>}
      {status === "transcribing" && <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{t.transcribing}</p>}
      {error && <p className="mt-3 text-sm text-[#9A3B2F]">{error}</p>}

      {status === "ready" && (
        <div className="mt-4 rounded-[1rem] bg-[var(--surface-sage)]/70 px-4 py-4">
          <div className="text-sm text-[var(--accent-sage-text)]">{t.preview}</div>
          <textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            className="mt-3 min-h-[88px] w-full resize-none rounded-[1rem] border border-[color:var(--line-sage)] bg-white px-3 py-3 text-sm leading-8 text-[var(--text)] outline-none"
          />
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            {confidenceNeedsExtraConfirmation(confidenceLabel, uncertaintyFlags) ? t.lowConfidence : t.editHint}
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => void handleRetry()}
              className="rounded-full border border-[color:var(--line-sage)] bg-white px-4 py-2.5 text-sm text-[var(--accent-sage-text)]"
            >
              {t.retry}
            </button>
            <button
              type="button"
              onClick={() => void finalizeTranscript("draft")}
              className="rounded-full border border-[color:var(--line-sage)] bg-white px-4 py-2.5 text-sm text-[var(--accent-sage-text)]"
            >
              {t.useDraft}
            </button>
            <button
              type="button"
              disabled={disabled || transcript.trim().length === 0}
              onClick={() => void finalizeTranscript("send")}
              className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t.sendNow}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
