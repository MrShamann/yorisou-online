"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";
import type {
  SupportAssistantLocale,
  SupportConversationMessage,
  SupportIdentity,
  SupportIssueType,
  SupportScenarioResult,
} from "@/lib/ai/support/scenario-engine";
import type {
  SupportVoiceTranscribeErrorCode,
  SupportVoiceTranscribeResponse,
  VoiceConfidenceLabel,
  VoiceSignalRecord,
} from "@/lib/voice/contracts";

type ScenarioSupportAssistantProps = {
  locale: SupportAssistantLocale;
  onConversationStateChange?: (started: boolean) => void;
};

type SendMessageOptions = {
  voiceInteractionId?: string | null;
  originatedFromVoice?: boolean;
};

type SupportChatResponse = {
  success: true;
  assistantMessage: string;
  scenarioResult: SupportScenarioResult;
  recommendedActions: SupportRecommendedAction[];
  modelUsage?: {
    provider: string;
    model: string;
  };
};

type ChatAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  apiContent: string;
  attachments: ChatAttachment[];
  voiceInteractionId?: string | null;
};

type VoiceStatus = "idle" | "recording" | "transcribing" | "sending" | "review";

const starters = {
  ja: [
    "最近の外出が少し不安です",
    "親の通院をどう支えたらよいですか",
    "この資料も見ながら相談したいです",
  ],
  en: [
    "Going out has started to feel difficult.",
    "How can I better support a parent's mobility?",
    "I want to talk while sharing this document too.",
  ],
} as const;

const copy = {
  ja: {
    assistantLabel: "ひなた",
    userLabel: "あなた",
    emptyTitle: "そのまま話しかけてください",
    emptyBody: "入力、音声、資料の添付をひとつの会話で続けられます。",
    typing: "ひなたが考えています…",
    placeholder: "メッセージを入力",
    attachmentTitle: "添付したファイル",
    attachmentButton: "ファイルを追加",
    send: "送信",
    voiceRecording: "録音中…",
    voiceTranscribing: "音声を聞き取っています…",
    voiceSending: "ひなたに伝えています…",
    reviewTitle: "確認が必要そうな聞き取りです",
    reviewHint: "短く直して送るか、録り直してください。",
    retry: "録り直す",
    useDraft: "入力欄に入れる",
    sendTranscript: "この内容で送る",
    unsupportedVoice: "この端末では音声入力がまだ使えません。",
    attachmentOnlyMessage: "この添付ファイルも見ながら相談したいです。",
    attachmentContextTitle: "添付ファイル",
    error: "ご案内の準備に失敗しました。少し時間をおいて、もう一度お試しください。",
    voicePlayback: "音声で聞く",
    voicePlaybackLoading: "音声を準備しています…",
    voicePlaybackError: "ひなたの音声をまだ準備できませんでした。文字の返信はそのまま読めます。",
    actionsTitle: "このまま進めるなら",
    voiceErrors: {
      missing_audio_file: "録音データが確認できませんでした。もう一度録音してください。",
      voice_audio_too_short: "録音が短すぎました。もう少し長めに話してみてください。",
      voice_backend_not_configured: "音声の文字起こし設定がまだ準備中です。今は文字入力で続けられます。",
      voice_backend_unreachable: "音声の文字起こし先に今つながっていません。少し待ってからお試しください。",
      voice_transcript_unrecognizable: "うまく聞き取れませんでした。短く区切って話すか、文字入力で続けてください。",
      voice_transcription_failed: "音声の文字起こしに失敗しました。録り直すか、文字入力で続けられます。",
    },
  },
  en: {
    assistantLabel: "Hinata",
    userLabel: "You",
    emptyTitle: "Start naturally",
    emptyBody: "Type, speak, or attach a file in one continuous conversation.",
    typing: "Hinata is thinking…",
    placeholder: "Message Hinata",
    attachmentTitle: "Attached files",
    attachmentButton: "Add files",
    send: "Send",
    voiceRecording: "Recording…",
    voiceTranscribing: "Transcribing…",
    voiceSending: "Passing that to Hinata…",
    reviewTitle: "This transcript needs a quick check",
    reviewHint: "You can edit it, retry, or send it as is.",
    retry: "Retry",
    useDraft: "Use as draft",
    sendTranscript: "Send transcript",
    unsupportedVoice: "Voice input is not available on this device yet.",
    attachmentOnlyMessage: "I want to talk while also sharing these attached files.",
    attachmentContextTitle: "Attached files",
    error: "We could not prepare guidance. Please try again.",
    voicePlayback: "Play voice",
    voicePlaybackLoading: "Preparing audio…",
    voicePlaybackError: "Hinata voice playback is not ready yet. The text reply is still available.",
    actionsTitle: "Helpful next steps",
    voiceErrors: {
      missing_audio_file: "We could not find the recording. Please try again.",
      voice_audio_too_short: "That recording was too short. Please try again with a slightly longer phrase.",
      voice_backend_not_configured: "Voice transcription is not configured yet. You can continue in text for now.",
      voice_backend_unreachable: "The voice transcription service is not reachable right now. Please try again or continue in text.",
      voice_transcript_unrecognizable: "We could not understand that recording clearly enough. A shorter retry or text fallback is recommended.",
      voice_transcription_failed: "We could not transcribe that recording yet. Please retry or continue in text.",
    },
  },
} as const;

const familyHints = ["親", "母", "父", "祖母", "祖父", "家族", "夫", "妻"];
const institutionHints = ["自治体", "施設", "介護", "事業者", "病院", "地域", "導入", "連携"];
const bookingHints = ["相談したい", "予約", "面談", "話を聞いてほしい", "直接"];
const productHints = ["製品", "車いす", "電動", "カート", "何が合う", "比較"];
const browserVoiceEnabled = process.env.NEXT_PUBLIC_HINATA_BROWSER_TTS !== "0";
const ACCEPTED_FILE_TYPES =
  "image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.rtf,.odt,.ods,.ppt,.pptx,.json,.log";
const hinataPreferredJapaneseVoicePatterns = [/google\s*日本語/i, /nanami/i, /sayaka/i, /haruka/i, /kyoko/i, /ja[-_]?jp/i];
const hinataAvoidJapaneseVoicePatterns = [/otoya/i, /ichiro/i, /male/i, /man/i];

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }
  return `${size} B`;
}

function getVoiceDescriptor(voice: SpeechSynthesisVoice | null) {
  if (!voice) {
    return "browser_speech:default";
  }

  return `browser_speech:${voice.name}`;
}

async function loadSpeechVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [] as SpeechSynthesisVoice[];
  }

  const initial = window.speechSynthesis.getVoices();
  if (initial.length > 0) {
    return initial;
  }

  await new Promise((resolve) => window.setTimeout(resolve, 250));
  return window.speechSynthesis.getVoices();
}

function selectHinataBrowserVoice(voices: SpeechSynthesisVoice[], locale: SupportAssistantLocale) {
  const localePrefix = locale === "ja" ? "ja" : "en";
  const localeVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(localePrefix));
  const candidates = localeVoices.length > 0 ? localeVoices : voices;

  if (locale !== "ja") {
    return candidates[0] || null;
  }

  const filtered = candidates.filter((voice) => {
    const descriptor = `${voice.name} ${voice.voiceURI}`.toLowerCase();
    return hinataAvoidJapaneseVoicePatterns.every((pattern) => !pattern.test(descriptor));
  });
  const preferredPool = filtered.length > 0 ? filtered : candidates;

  for (const pattern of hinataPreferredJapaneseVoicePatterns) {
    const match = preferredPool.find((voice) => pattern.test(`${voice.name} ${voice.voiceURI}`));
    if (match) {
      return match;
    }
  }

  return preferredPool[0] || null;
}

function inferIdentityFromMessage(message: string): SupportIdentity {
  if (institutionHints.some((keyword) => message.includes(keyword))) {
    return "institution";
  }
  if (familyHints.some((keyword) => message.includes(keyword))) {
    return "family";
  }
  return "self";
}

function inferIssueTypeFromMessage(message: string): SupportIssueType {
  if (institutionHints.some((keyword) => message.includes(keyword))) {
    return "institutional_inquiry";
  }
  if (bookingHints.some((keyword) => message.includes(keyword))) {
    return "consultation_booking";
  }
  if (productHints.some((keyword) => message.includes(keyword))) {
    return "product_guidance";
  }
  if (familyHints.some((keyword) => message.includes(keyword))) {
    return "family_mobility_support";
  }
  return "mobility_anxiety";
}

function getVoiceErrorFlags(error: SupportVoiceTranscribeErrorCode) {
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

function buildOutgoingMessage(
  locale: SupportAssistantLocale,
  message: string,
  attachments: ChatAttachment[],
) {
  const trimmed = message.trim();
  const base = trimmed || copy[locale].attachmentOnlyMessage;
  if (attachments.length === 0) {
    return { visibleContent: base, apiContent: base };
  }

  const attachmentSummary = attachments
    .map((file) => `- ${file.name} (${file.type || "file"}, ${formatFileSize(file.size)})`)
    .join("\n");
  const attachmentHeader = locale === "ja" ? "添付ファイル" : "Attached files";

  return {
    visibleContent: base,
    apiContent: `${base}\n\n[${attachmentHeader}]\n${attachmentSummary}`,
  };
}

export default function ScenarioSupportAssistant({
  locale,
  onConversationStateChange,
}: ScenarioSupportAssistantProps) {
  const t = copy[locale];
  const threadRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [recommendedActions, setRecommendedActions] = useState<SupportRecommendedAction[]>([]);
  const [scenarioResult, setScenarioResult] = useState<SupportScenarioResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceOriginalTranscript, setVoiceOriginalTranscript] = useState("");
  const [voiceInteractionId, setVoiceInteractionId] = useState<string | null>(null);
  const [voiceRetryCount, setVoiceRetryCount] = useState(0);
  const [voiceConfidenceLabel, setVoiceConfidenceLabel] = useState<VoiceConfidenceLabel>("unknown");
  const [voiceUncertaintyFlags, setVoiceUncertaintyFlags] = useState<string[]>([]);
  const [voiceProvider, setVoiceProvider] = useState<string | null>(null);
  const [voicePlaybackKey, setVoicePlaybackKey] = useState<string | null>(null);

  useEffect(() => {
    setVoiceSupported(
      typeof window !== "undefined" &&
        typeof MediaRecorder !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia),
    );
  }, []);

  useEffect(() => {
    onConversationStateChange?.(messages.length > 0);
  }, [messages.length, onConversationStateChange]);

  useEffect(() => {
    if (!threadRef.current) {
      return;
    }
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, isSubmitting, recommendedActions.length, voiceStatus]);

  useEffect(() => {
    const textarea = composerRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [draft]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      speechSynthesisRef.current = null;
    };
  }, []);

  async function logVoiceEvent(payload: Omit<VoiceSignalRecord, "id" | "createdAt">) {
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

  function resetVoiceDraft(options?: { preserveRetryCount?: boolean }) {
    setVoiceStatus("idle");
    setVoiceTranscript("");
    setVoiceOriginalTranscript("");
    setVoiceInteractionId(null);
    setVoiceConfidenceLabel("unknown");
    setVoiceUncertaintyFlags([]);
    setVoiceProvider(null);
    if (!options?.preserveRetryCount) {
      setVoiceRetryCount(0);
    }
  }

  async function playBrowserVoiceReply(messageKey: string, text: string) {
    if (!browserVoiceEnabled) {
      return { success: false as const, reason: "browser_tts_disabled" };
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      return { success: false as const, reason: "browser_speech_unavailable" };
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      return { success: false as const, reason: "missing_text" };
    }

    audioRef.current?.pause();
    audioRef.current = null;
    window.speechSynthesis.cancel();

    const voices = await loadSpeechVoices();
    const selectedVoice = selectHinataBrowserVoice(voices, locale);

    return await new Promise<
      | { success: true; provider: string }
      | { success: false; reason: string; provider?: string }
    >((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(trimmedText);
        utterance.lang = locale === "ja" ? "ja-JP" : "en-US";
        utterance.rate = locale === "ja" ? 0.96 : 0.98;
        utterance.pitch = locale === "ja" ? 1.04 : 1.0;
        utterance.volume = 1;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        speechSynthesisRef.current = utterance;
        utterance.onend = () => {
          speechSynthesisRef.current = null;
          setVoicePlaybackKey((current) => (current === messageKey ? null : current));
          resolve({ success: true, provider: getVoiceDescriptor(selectedVoice) });
        };
        utterance.onerror = () => {
          speechSynthesisRef.current = null;
          setVoicePlaybackKey((current) => (current === messageKey ? null : current));
          resolve({ success: false, reason: "browser_speech_failed", provider: getVoiceDescriptor(selectedVoice) });
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        speechSynthesisRef.current = null;
        setVoicePlaybackKey((current) => (current === messageKey ? null : current));
        resolve({ success: false, reason: "browser_speech_failed", provider: getVoiceDescriptor(selectedVoice) });
      }
    });
  }

  async function playAssistantReply(
    messageKey: string,
    text: string,
    options?: {
      interactionId?: string | null;
      source?: "manual" | "auto";
      surfaceError?: boolean;
    },
  ) {
    if (!text.trim()) {
      return;
    }

    const source = options?.source || "manual";
    const interactionMode = source === "auto" ? "voice_auto_send" : "playback_only";
    setVoicePlaybackKey(messageKey);
    if (source === "manual") {
      setError("");
    }

    await logVoiceEvent({
      interactionId: options?.interactionId || null,
      locale,
      eventType: "voice_reply_requested",
      interactionMode,
      provider: "browser_speech",
      transcriptConfidence: null,
      confidenceLabel: "unknown",
      retryCount: 0,
      correctionCount: 0,
      transcriptLength: text.length,
      uncertaintyFlags: [],
      switchedToText: false,
      notes: `source=${source}`,
    });

    const playbackResult = await playBrowserVoiceReply(messageKey, text);
    if (playbackResult.success) {
      await logVoiceEvent({
        interactionId: options?.interactionId || null,
        locale,
        eventType: "voice_reply_played",
        interactionMode,
        provider: playbackResult.provider,
        transcriptConfidence: null,
        confidenceLabel: "unknown",
        retryCount: 0,
        correctionCount: 0,
        transcriptLength: text.length,
        uncertaintyFlags: [],
        switchedToText: false,
        notes: `source=${source};message_key=${messageKey}`,
      });
      return;
    }

    await logVoiceEvent({
      interactionId: options?.interactionId || null,
      locale,
      eventType: "voice_reply_failed",
      interactionMode,
      provider: playbackResult.provider || "browser_speech",
      transcriptConfidence: null,
      confidenceLabel: "unknown",
      retryCount: 0,
      correctionCount: 0,
      transcriptLength: text.length,
      uncertaintyFlags: [playbackResult.reason],
      switchedToText: false,
      notes: `source=${source};message_key=${messageKey};reason=${playbackResult.reason}`,
    });
    setVoicePlaybackKey((current) => (current === messageKey ? null : current));

    if (options?.surfaceError) {
      setError(t.voicePlaybackError);
    }
  }

  async function sendMessage(rawMessage: string, options?: SendMessageOptions) {
    const outgoingAttachments = [...attachments];
    const composed = buildOutgoingMessage(locale, rawMessage, outgoingAttachments);

    if ((!composed.visibleContent.trim() && outgoingAttachments.length === 0) || isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);
    setRecommendedActions([]);
    setScenarioResult(null);

    const resolvedIdentity = inferIdentityFromMessage(composed.visibleContent);
    const resolvedIssueType = inferIssueTypeFromMessage(composed.visibleContent);
    const history: SupportConversationMessage[] = messages.map((message) => ({
      role: message.role,
      content: message.apiContent,
    }));

    const userMessage: ChatMessage = {
      id: createId("message"),
      role: "user",
      content: composed.visibleContent,
      apiContent: composed.apiContent,
      attachments: outgoingAttachments,
      voiceInteractionId: options?.voiceInteractionId || null,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft("");
    setAttachments([]);

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          identity: resolvedIdentity,
          issueType: resolvedIssueType,
          message: composed.apiContent,
          messages: history,
        }),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      const result = (await response.json()) as SupportChatResponse;
      const assistantMessage: ChatMessage = {
        id: createId("message"),
        role: "assistant",
        content: result.assistantMessage,
        apiContent: result.assistantMessage,
        attachments: [],
        voiceInteractionId: options?.voiceInteractionId || null,
      };

      setMessages((current) => [...current, assistantMessage]);
      setRecommendedActions(result.recommendedActions);
      setScenarioResult(result.scenarioResult);

      if (options?.originatedFromVoice) {
        void playAssistantReply(assistantMessage.id, result.assistantMessage, {
          interactionId: options.voiceInteractionId,
          source: "auto",
          surfaceError: false,
        });
      }
    } catch {
      setError(t.error);
      setMessages((current) => [
        ...current,
        {
          id: createId("message"),
          role: "assistant",
          content: t.error,
          apiContent: t.error,
          attachments: [],
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function autoSendTranscript(result: Extract<SupportVoiceTranscribeResponse, { success: true }>) {
    setVoiceStatus("sending");
    setVoiceInteractionId(result.interactionId);
    setVoiceTranscript(result.transcript);
    setVoiceOriginalTranscript(result.transcript);
    setVoiceConfidenceLabel(result.confidenceLabel);
    setVoiceUncertaintyFlags(result.uncertaintyFlags);
    setVoiceProvider(result.provider);

    await logVoiceEvent({
      interactionId: result.interactionId,
      locale,
      eventType: "transcript_confirmed",
      interactionMode: "voice_auto_send",
      provider: result.provider,
      transcriptConfidence: result.transcriptConfidence,
      confidenceLabel: result.confidenceLabel,
      retryCount: result.retryCount,
      correctionCount: 0,
      transcriptLength: result.transcript.length,
      uncertaintyFlags: result.uncertaintyFlags,
      switchedToText: false,
      notes: "auto_sent_after_transcription",
    });

    await sendMessage(result.transcript, {
      voiceInteractionId: result.interactionId,
      originatedFromVoice: true,
    });
    resetVoiceDraft();
  }

  async function transcribeRecording(blob: Blob) {
    setVoiceStatus("transcribing");
    setError("");

    const formData = new FormData();
    formData.append("audio", new File([blob], "hinata-voice.webm", { type: blob.type || "audio/webm" }));
    formData.append("locale", locale);
    formData.append("retryCount", String(voiceRetryCount));

    try {
      const response = await fetch("/api/support/voice/transcribe", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as SupportVoiceTranscribeResponse;

      if (!response.ok || !result.success) {
        const errorCode = result.success ? "voice_transcription_failed" : result.error;
        setVoiceStatus("idle");
        setError(result.success ? t.voiceErrors.voice_transcription_failed : t.voiceErrors[errorCode] || result.fallbackMessage || t.voiceErrors.voice_transcription_failed);
        await logVoiceEvent({
          interactionId: voiceInteractionId,
          locale,
          eventType: "voice_to_text_fallback",
          interactionMode: "text_only_after_voice",
          provider: null,
          transcriptConfidence: null,
          confidenceLabel: "unknown",
          retryCount: voiceRetryCount,
          correctionCount: 0,
          transcriptLength: null,
          uncertaintyFlags: getVoiceErrorFlags(errorCode),
          switchedToText: true,
          notes: errorCode,
        });
        return;
      }

      setVoiceInteractionId(result.interactionId);
      setVoiceTranscript(result.transcript);
      setVoiceOriginalTranscript(result.transcript);
      setVoiceConfidenceLabel(result.confidenceLabel);
      setVoiceUncertaintyFlags(result.uncertaintyFlags);
      setVoiceProvider(result.provider);

      if (result.requiresConfirmation) {
        setVoiceStatus("review");
        return;
      }

      await autoSendTranscript(result);
    } catch {
      setVoiceStatus("idle");
      setError(t.voiceErrors.voice_backend_unreachable);
    }
  }

  async function startRecording() {
    if (!voiceSupported || isSubmitting) {
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
          setVoiceStatus("idle");
        }
      };

      await logVoiceEvent({
        interactionId: voiceInteractionId,
        locale,
        eventType: "recording_started",
        interactionMode: "voice_live_capture",
        provider: voiceProvider,
        transcriptConfidence: null,
        confidenceLabel: "unknown",
        retryCount: voiceRetryCount,
        correctionCount: 0,
        transcriptLength: null,
        uncertaintyFlags: [],
        switchedToText: false,
        notes: null,
      });

      recorder.start();
      setVoiceStatus("recording");
    } catch {
      setError(voiceSupported ? t.voiceErrors.voice_transcription_failed : t.unsupportedVoice);
      setVoiceStatus("idle");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  async function handleVoiceRetry() {
    await logVoiceEvent({
      interactionId: voiceInteractionId,
      locale,
      eventType: "transcript_retry_requested",
      interactionMode: "voice_pending_confirmation",
      provider: voiceProvider,
      transcriptConfidence: null,
      confidenceLabel: voiceConfidenceLabel,
      retryCount: voiceRetryCount,
      correctionCount: 0,
      transcriptLength: voiceTranscript.length || null,
      uncertaintyFlags: voiceUncertaintyFlags,
      switchedToText: false,
      notes: "retry_requested",
    });

    setVoiceRetryCount((current) => current + 1);
    resetVoiceDraft({ preserveRetryCount: true });
  }

  async function finalizeVoiceTranscript(mode: "draft" | "send") {
    const nextTranscript = voiceTranscript.trim();
    const correctionCount = nextTranscript && nextTranscript !== voiceOriginalTranscript ? 1 : 0;

    await logVoiceEvent({
      interactionId: voiceInteractionId,
      locale,
      eventType: correctionCount > 0 ? "transcript_corrected" : "transcript_confirmed",
      interactionMode: "voice_to_text",
      provider: voiceProvider,
      transcriptConfidence: null,
      confidenceLabel: voiceConfidenceLabel,
      retryCount: voiceRetryCount,
      correctionCount,
      transcriptLength: nextTranscript.length,
      uncertaintyFlags: voiceUncertaintyFlags,
      switchedToText: mode === "draft",
      notes: mode === "draft" ? "copied_to_text_draft" : "sent_after_confirmation",
    });

    if (mode === "draft") {
      setDraft(nextTranscript);
      composerRef.current?.focus();
      resetVoiceDraft();
      return;
    }

    await sendMessage(nextTranscript, {
      voiceInteractionId,
      originatedFromVoice: true,
    });
    resetVoiceDraft();
  }

  function openAttachmentPicker() {
    fileInputRef.current?.click();
  }

  function handleAttachmentSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files || []).map((file) => ({
      id: createId("attachment"),
      name: file.name,
      size: file.size,
      type: file.type || "file",
    }));

    if (nextFiles.length > 0) {
      setAttachments((current) => [...current, ...nextFiles]);
    }

    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((file) => file.id !== id));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(draft);
  }

  async function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await sendMessage(draft);
    }
  }

  return (
    <section className="flex min-h-[72vh] w-full flex-col bg-transparent md:min-h-[80vh]">
      <div ref={threadRef} className="flex-1 overflow-y-auto px-4 pb-44 pt-4 md:px-8 md:pb-48 md:pt-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {messages.length === 0 ? (
            <div className="flex min-h-[52vh] flex-col items-center justify-center px-2 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-sage)] text-xl text-[var(--accent-sage-text)]">
                ひ
              </div>
              <h2 className="text-2xl text-[var(--text)] md:text-3xl">{t.emptyTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-[var(--muted)] md:text-base">{t.emptyBody}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {starters[locale].map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => void sendMessage(starter)}
                    className="rounded-full border border-[color:var(--line-soft)] bg-white/80 px-4 py-2.5 text-sm text-[var(--accent-sage-text)] transition hover:bg-white"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isAssistant = message.role === "assistant";

              return (
                <div key={message.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                  <div className={`flex max-w-[48rem] gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
                    <div
                      className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                        isAssistant
                          ? "bg-[var(--surface-sage)] text-[var(--accent-sage-text)]"
                          : "bg-[rgba(58,38,33,0.12)] text-[var(--text)]"
                      }`}
                    >
                      {isAssistant ? "ひ" : locale === "ja" ? "あ" : "Y"}
                    </div>
                    <div
                      className={`rounded-[1.6rem] px-4 py-4 text-sm leading-8 md:px-5 ${
                        isAssistant
                          ? "border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.98)] text-[var(--text)] shadow-[0_10px_24px_rgba(47,35,33,0.05)]"
                          : "bg-[var(--accent)] text-white shadow-[0_12px_24px_rgba(47,35,33,0.12)]"
                      }`}
                    >
                      <div className={`text-[11px] tracking-[0.14em] ${isAssistant ? "text-[var(--muted)]" : "text-[rgba(255,255,255,0.72)]"}`}>
                        {isAssistant ? t.assistantLabel : t.userLabel}
                      </div>

                      {message.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className={`rounded-[1rem] border px-3 py-2 text-xs leading-6 ${
                                isAssistant
                                  ? "border-[color:var(--line-soft)] bg-[var(--surface-sage)]/50 text-[var(--accent-sage-text)]"
                                  : "border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.12)] text-white"
                              }`}
                            >
                              <div className="font-medium">{attachment.name}</div>
                              <div className={isAssistant ? "text-[var(--muted)]" : "text-[rgba(255,255,255,0.72)]"}>
                                {formatFileSize(attachment.size)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.content && <p className="mt-2 whitespace-pre-wrap">{message.content}</p>}

                      {isAssistant && (
                        <button
                          type="button"
                          onClick={() =>
                            void playAssistantReply(message.id, message.content, {
                              interactionId: message.voiceInteractionId || null,
                              source: "manual",
                              surfaceError: true,
                            })
                          }
                          className="mt-3 text-xs text-[var(--accent-sage-text)] underline underline-offset-4"
                        >
                          {voicePlaybackKey === message.id ? t.voicePlaybackLoading : t.voicePlayback}
                        </button>
                      )}

                      {isAssistant && messages[messages.length - 1]?.id === message.id && scenarioResult && recommendedActions.length > 0 && !isSubmitting && (
                        <div className="mt-4 border-t border-[color:var(--line-soft)] pt-4">
                          <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">{t.actionsTitle}</div>
                          <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
                            {recommendedActions.map((action) => (
                              <Link
                                key={action.id}
                                href={action.href}
                                className="min-w-[13.5rem] shrink-0 snap-start rounded-[1rem] border border-[color:var(--line-sage)] bg-[var(--surface-sage)]/72 px-3.5 py-3 text-sm text-[var(--accent-sage-text)] transition hover:bg-[var(--surface-sage)]"
                              >
                                <div className="font-medium text-[var(--text)]">{action.title}</div>
                                <div className="mt-1 line-clamp-3 leading-7">{action.description}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isSubmitting && (
            <div className="flex justify-start">
              <div className="flex max-w-[42rem] gap-3">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sage)] text-sm text-[var(--accent-sage-text)]">
                  ひ
                </div>
                <div className="rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.96)] px-4 py-4 text-sm text-[var(--muted)]">
                  {t.typing}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-4 md:px-6 md:pb-6">
        <div className="pointer-events-auto mx-auto max-w-4xl">
          {(error || voiceStatus === "transcribing" || voiceStatus === "sending" || voiceStatus === "recording") && (
            <div className="mb-3 rounded-[1.1rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.96)] px-4 py-3 text-sm shadow-[0_10px_24px_rgba(47,35,33,0.05)]">
              {error ? (
                <p className="text-[#9A3B2F]">{error}</p>
              ) : (
                <p className="text-[var(--muted)]">
                  {voiceStatus === "recording"
                    ? t.voiceRecording
                    : voiceStatus === "transcribing"
                      ? t.voiceTranscribing
                      : t.voiceSending}
                </p>
              )}
            </div>
          )}

          {voiceStatus === "review" && (
            <div className="mb-3 rounded-[1.25rem] border border-[color:var(--line-sage)] bg-[var(--surface-sage)]/76 px-4 py-4 shadow-[0_12px_28px_rgba(47,35,33,0.06)]">
              <div className="text-sm text-[var(--accent-sage-text)]">{t.reviewTitle}</div>
              <textarea
                value={voiceTranscript}
                onChange={(event) => setVoiceTranscript(event.target.value)}
                className="mt-3 min-h-[88px] w-full resize-none rounded-[1rem] border border-[color:var(--line-sage)] bg-white px-3 py-3 text-sm leading-8 text-[var(--text)] outline-none"
              />
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{t.reviewHint}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => void handleVoiceRetry()}
                  className="rounded-full border border-[color:var(--line-sage)] bg-white px-4 py-2.5 text-sm text-[var(--accent-sage-text)]"
                >
                  {t.retry}
                </button>
                <button
                  type="button"
                  onClick={() => void finalizeVoiceTranscript("draft")}
                  className="rounded-full border border-[color:var(--line-sage)] bg-white px-4 py-2.5 text-sm text-[var(--accent-sage-text)]"
                >
                  {t.useDraft}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || voiceTranscript.trim().length === 0}
                  onClick={() => void finalizeVoiceTranscript("send")}
                  className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t.sendTranscript}
                </button>
              </div>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="mb-3 rounded-[1.15rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.96)] px-4 py-3 shadow-[0_10px_24px_rgba(47,35,33,0.05)]">
              <div className="text-xs tracking-[0.14em] text-[var(--muted)]">{t.attachmentTitle}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-soft)] bg-white px-3 py-2 text-sm text-[var(--accent-sage-text)]"
                  >
                    <span className="max-w-[14rem] truncate">{attachment.name}</span>
                    <span className="text-xs text-[var(--muted)]">{formatFileSize(attachment.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-[var(--muted)] transition hover:text-[#9A3B2F]"
                      aria-label={`Remove ${attachment.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.98)] p-3 shadow-[0_18px_44px_rgba(47,35,33,0.08)] backdrop-blur">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_FILE_TYPES}
              className="hidden"
              onChange={handleAttachmentSelection}
            />

            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={openAttachmentPicker}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-white text-[var(--accent-sage-text)] transition hover:bg-[var(--surface-sage)]"
                aria-label={t.attachmentButton}
                title={t.attachmentButton}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>

              <div className="min-w-0 flex-1">
                <textarea
                  ref={composerRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => void handleComposerKeyDown(event)}
                  placeholder={t.placeholder}
                  rows={1}
                  className="max-h-[180px] min-h-[48px] w-full resize-none bg-transparent px-1 py-3 text-sm leading-7 text-[var(--text)] outline-none md:text-base"
                />
              </div>

              <button
                type="button"
                title={voiceStatus === "recording" ? t.voiceRecording : voiceSupported ? t.voiceTranscribing.replace("…", "").replace(" your recording", "") : t.unsupportedVoice}
                aria-label={voiceStatus === "recording" ? t.voiceRecording : voiceSupported ? t.voiceTranscribing.replace("…", "").replace(" your recording", "") : t.unsupportedVoice}
                disabled={!voiceSupported || isSubmitting || voiceStatus === "transcribing" || voiceStatus === "sending"}
                onClick={() => (voiceStatus === "recording" ? stopRecording() : void startRecording())}
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition ${
                  voiceStatus === "recording"
                    ? "border-[#9A3B2F] bg-[#9A3B2F] text-white shadow-[0_10px_24px_rgba(154,59,47,0.2)]"
                    : "border-[color:var(--line-soft)] bg-white text-[var(--accent-sage-text)] hover:bg-[var(--surface-sage)]"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  {voiceStatus === "recording" ? <rect x="7" y="7" width="10" height="10" rx="2" /> : <path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.07A7 7 0 0 1 5 12a1 1 0 1 1 2 0 5 5 0 0 0 10 0Z" />}
                </svg>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || (draft.trim().length === 0 && attachments.length === 0)}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_12px_24px_rgba(47,35,33,0.14)] transition hover:translate-y-[-1px] hover:bg-[var(--cta-main-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={t.send}
                title={t.send}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2 .4 6.4Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
