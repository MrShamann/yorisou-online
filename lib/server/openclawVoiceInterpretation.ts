import type { SupportAssistantLocale } from "@/lib/ai/support/scenario-engine";
import type { VoiceConfidenceLabel, VoiceTranscriptionResult } from "@/lib/voice/contracts";

const AUTO_SEND_RULES: Record<
  SupportAssistantLocale,
  {
    allowedConfidence: Set<VoiceConfidenceLabel>;
    minTranscriptChars: number;
    allowedFlags: Set<string>;
  }
> = {
  ja: {
    allowedConfidence: new Set<VoiceConfidenceLabel>(["high", "medium"]),
    minTranscriptChars: 2,
    allowedFlags: new Set<string>(["provider_language_missing", "spoken_japanese_normalized"]),
  },
  en: {
    allowedConfidence: new Set<VoiceConfidenceLabel>(["high"]),
    minTranscriptChars: 3,
    allowedFlags: new Set<string>(),
  },
};

const JAPANESE_FILLER_PREFIX = /^(?:(?:えっと|えーと|ええと|あの|あのですね|その|なんか|えー+|あー+|うーん)[、。！？\s]*)+/u;
const JAPANESE_CHAR_BOUNDARY = /(?<=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〆ヵヶ])\s+(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〆ヵヶ])/gu;
const JAPANESE_PUNCTUATION_BOUNDARY = /(?<=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〆ヵヶ])\s+(?=[、。！？])/gu;
const JAPANESE_POST_PUNCTUATION_BOUNDARY = /(?<=[、。！？])\s+(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々〆ヵヶ])/gu;

export type InterpretedVoiceTranscription = {
  result: VoiceTranscriptionResult;
  rawTranscript: string;
  interpretationApplied: boolean;
};

function normalizeTranscriptWhitespace(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function normalizeJapaneseTranscript(rawTranscript: string) {
  let next = normalizeTranscriptWhitespace(rawTranscript);
  next = next.replace(JAPANESE_FILLER_PREFIX, "");
  next = next.replace(JAPANESE_CHAR_BOUNDARY, "");
  next = next.replace(JAPANESE_PUNCTUATION_BOUNDARY, "");
  next = next.replace(JAPANESE_POST_PUNCTUATION_BOUNDARY, "");
  next = next.replace(/([、。！？])\1+/g, "$1");
  next = next.replace(/^[、。！？\s]+|[、。！？\s]+$/g, "").trim();
  return next;
}

function getEffectiveTranscript(locale: SupportAssistantLocale, rawTranscript: string) {
  if (locale === "ja") {
    return normalizeJapaneseTranscript(rawTranscript);
  }

  return normalizeTranscriptWhitespace(rawTranscript);
}

export function interpretSupportVoiceTranscription(
  locale: SupportAssistantLocale,
  transcription: VoiceTranscriptionResult,
): InterpretedVoiceTranscription {
  const rawTranscript = transcription.transcript.trim();
  const effectiveTranscript = getEffectiveTranscript(locale, rawTranscript) || rawTranscript;
  const interpretationApplied = effectiveTranscript !== rawTranscript;
  const nextFlags = new Set(transcription.uncertaintyFlags);

  if (interpretationApplied) {
    nextFlags.add("spoken_japanese_normalized");
  }

  const rules = AUTO_SEND_RULES[locale];
  const hasOnlyAllowedFlags = Array.from(nextFlags).every((flag) => rules.allowedFlags.has(flag));
  const requiresConfirmation =
    !rules.allowedConfidence.has(transcription.confidenceLabel) ||
    effectiveTranscript.length < rules.minTranscriptChars ||
    hasOnlyAllowedFlags === false;

  return {
    rawTranscript,
    interpretationApplied,
    result: {
      ...transcription,
      transcript: effectiveTranscript,
      uncertaintyFlags: Array.from(nextFlags),
      requiresConfirmation,
    },
  };
}
