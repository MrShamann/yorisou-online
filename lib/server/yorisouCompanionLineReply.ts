type CompanionReplyInput = {
  eventType: "follow" | "message" | "postback";
  accountMatched: boolean;
  locale?: "ja" | "en";
};

const MINI_APP_ENTRY_URL = "https://yorisou.online/line/mini-app";

export function buildYorisouCompanionLineReply(input: CompanionReplyInput) {
  const locale = input.locale || "ja";

  if (locale === "en") {
    if (input.eventType === "follow") {
      return input.accountMatched
        ? `Yorisou Companion is ready. Open the formal LINE Mini App here: ${MINI_APP_ENTRY_URL}`
        : `Yorisou Companion is ready. Start from the formal LINE Mini App here: ${MINI_APP_ENTRY_URL}`;
    }

    return `Yorisou Companion is here. Open the formal LINE Mini App here: ${MINI_APP_ENTRY_URL}`;
  }

  if (input.eventType === "follow") {
    return input.accountMatched
      ? `Yorisou Companionです。正式なLINE Mini App入口はこちらです。\n${MINI_APP_ENTRY_URL}`
      : `Yorisou Companionです。まずは正式なLINE Mini App入口はこちらです。\n${MINI_APP_ENTRY_URL}`;
  }

  return `Yorisou Companionです。正式なLINE Mini App入口はこちらです。\n${MINI_APP_ENTRY_URL}`;
}

export function buildYorisouCompanionVoiceFallbackReply(input: { accountMatched: boolean; locale?: "ja" | "en" }) {
  const locale = input.locale || "ja";

  if (locale === "en") {
    return input.accountMatched
      ? `Yorisou Companion is ready. If the audio is unclear, please send a short text instead. Open the Mini App here: ${MINI_APP_ENTRY_URL}`
      : `Yorisou Companion is ready. If the audio is unclear, please send a short text instead. Open the Mini App here: ${MINI_APP_ENTRY_URL}`;
  }

  return input.accountMatched
    ? `Yorisou Companionです。音声が不明瞭な場合は、短いテキストでも大丈夫です。正式なLINE Mini App入口はこちらです。\n${MINI_APP_ENTRY_URL}`
    : `Yorisou Companionです。音声が不明瞭な場合は、短いテキストでも大丈夫です。正式なLINE Mini App入口はこちらです。\n${MINI_APP_ENTRY_URL}`;
}
