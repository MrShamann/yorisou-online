import { resolveOpenClawLiveSafeReplyText } from "@/lib/server/openclawLiveSafeRegistry";

type CompanionReplyInput = {
  eventType: "follow" | "message" | "postback";
  accountMatched: boolean;
  locale?: "ja" | "en";
  messageText?: string | null;
  postbackData?: string | null;
};

const MINI_APP_ENTRY_URL = "https://miniapp.line.me/2009793294-hILBjsXB";

function normalizeReplySignal(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

function resolveReplyKind(input: CompanionReplyInput) {
  const signal = `${normalizeReplySignal(input.messageText)} ${normalizeReplySignal(input.postbackData)}`.trim();

  if (input.eventType === "follow") {
    return "welcome" as const;
  }

  if (/戻|返|再開|re-entry|return|back|再訪/.test(signal)) {
    return "return_prompt" as const;
  }

  if (/結果|完了|深掘|続|result|report|unlock/.test(signal)) {
    return "post_result" as const;
  }

  if (input.eventType === "postback" || /はじめ|start|開始|テスト/.test(signal)) {
    return "start_test" as const;
  }

  return "fallback" as const;
}

export async function buildYorisouCompanionLineReply(input: CompanionReplyInput) {
  const locale = input.locale || "ja";
  const kind = resolveReplyKind(input);

  if (locale === "en") {
    switch (kind) {
      case "welcome":
        return resolveOpenClawLiveSafeReplyText({
          kind: "welcome",
          locale,
          fallbackText: input.accountMatched
            ? `Welcome back. Yorisou Companion is ready in LINE. Open the Mini App to resume your 33-question check: ${MINI_APP_ENTRY_URL}`
            : `Yorisou Companion is ready in LINE. Open the Mini App to start your 33-question check: ${MINI_APP_ENTRY_URL}`,
        });
      case "start_test":
        return resolveOpenClawLiveSafeReplyText({
          kind: "start_test",
          locale,
          fallbackText: `Start the 33-question check in the LINE Mini App: ${MINI_APP_ENTRY_URL}`,
        });
      case "post_result":
        return resolveOpenClawLiveSafeReplyText({
          kind: "post_result",
          locale,
          fallbackText: `Your result is ready. Open the LINE Mini App to continue, deepen, or return: ${MINI_APP_ENTRY_URL}`,
        });
      case "return_prompt":
        return resolveOpenClawLiveSafeReplyText({
          kind: "return_prompt",
          locale,
          fallbackText: `You can return to the same flow in the LINE Mini App: ${MINI_APP_ENTRY_URL}`,
        });
      default:
        return resolveOpenClawLiveSafeReplyText({
          kind: "fallback",
          locale,
          fallbackText: `If you want to begin, continue, or return, open the LINE Mini App here: ${MINI_APP_ENTRY_URL}`,
        });
    }
  }

  switch (kind) {
    case "welcome":
      return resolveOpenClawLiveSafeReplyText({
        kind: "welcome",
        locale,
        fallbackText: input.accountMatched
          ? `Yorisou Companionです。おかえりなさい。前回の続きから、33問のチェックをすぐ始められます。LINE MINI Appを開いて「はじめる」を押してください: ${MINI_APP_ENTRY_URL}`
          : `Yorisou Companionです。LINEで、33問のチェックをここから始められます。LINE MINI Appを開いて「はじめる」を押してください: ${MINI_APP_ENTRY_URL}`,
      });
    case "start_test":
      return resolveOpenClawLiveSafeReplyText({
        kind: "start_test",
        locale,
        fallbackText: `33問のチェックはこちらから始められます。LINE MINI Appを開いて、最初の質問へ進んでください: ${MINI_APP_ENTRY_URL}`,
      });
    case "post_result":
      return resolveOpenClawLiveSafeReplyText({
        kind: "post_result",
        locale,
        fallbackText: `結果は出ています。次は「深掘り」「続ける」「戻る」のどれかで進めます。LINE MINI Appを開いて続けてください: ${MINI_APP_ENTRY_URL}`,
      });
    case "return_prompt":
      return resolveOpenClawLiveSafeReplyText({
        kind: "return_prompt",
        locale,
        fallbackText: `前回の続きに戻れます。LINE MINI Appを開くと、同じ流れのまま再開できます: ${MINI_APP_ENTRY_URL}`,
      });
    default:
      return resolveOpenClawLiveSafeReplyText({
        kind: "fallback",
        locale,
        fallbackText: `Yorisou Companionです。「はじめる」「つづける」「もどる」のいずれかを送ってください。入口はこちらです: ${MINI_APP_ENTRY_URL}`,
      });
  }
}

export function buildYorisouCompanionVoiceFallbackReply(input: { accountMatched: boolean; locale?: "ja" | "en" }) {
  const locale = input.locale || "ja";

  if (locale === "en") {
    return input.accountMatched
      ? `Yorisou Companion is ready. If the audio is unclear, send a short text instead. Open here: ${MINI_APP_ENTRY_URL}`
      : `Yorisou Companion is ready. If the audio is unclear, send a short text instead. Open here: ${MINI_APP_ENTRY_URL}`;
  }

  return input.accountMatched
    ? `Yorisou Companionです。音声が不明瞭な場合は短いテキストでも大丈夫です。入口はこちら: ${MINI_APP_ENTRY_URL}`
    : `Yorisou Companionです。音声が不明瞭な場合は短いテキストでも大丈夫です。入口はこちら: ${MINI_APP_ENTRY_URL}`;
}
