import { readOpenClawOperatorSummary } from "@/lib/server/openclawQueue";

export type OpenClawLiveSafeOutput = {
  kind: string;
  family: string;
  locale?: "ja" | "en";
  itemId?: string | null;
  title: string;
  copy: string;
  subtitle?: string | null;
  hookLine?: string | null;
  whyThisFits?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  screenshotGoal?: string | null;
  sourceArtifactKey?: string | null;
  sourceArtifactPath?: string | null;
  score?: number | null;
  publishedAt?: string | null;
};

export type OpenClawLiveSafeRegistry = {
  source: string;
  generatedAt: string | null;
  outputs: OpenClawLiveSafeOutput[];
};

export const DEFAULT_LIVE_SAFE_OUTPUTS: OpenClawLiveSafeOutput[] = [
  {
    kind: "welcome",
    family: "line-reply",
    locale: "ja",
    title: "Yorisou Companion",
    copy:
      "Yorisou Companionです。LINEで、33問のチェックをここから始められます。LINE MINI Appを開いて「はじめる」を押してください: https://miniapp.line.me/2009793294-hILBjsXB",
  },
  {
    kind: "start_test",
    family: "line-reply",
    locale: "ja",
    title: "Yorisou Companion",
    copy:
      "33問のチェックはこちらから始められます。LINE MINI Appを開いて、最初の質問へ進んでください: https://miniapp.line.me/2009793294-hILBjsXB",
  },
  {
    kind: "post_result",
    family: "line-reply",
    locale: "ja",
    title: "Yorisou Companion",
    copy:
      "結果は出ています。次は「深掘り」「続ける」「戻る」のどれかで進めます。LINE MINI Appを開いて続けてください: https://miniapp.line.me/2009793294-hILBjsXB",
  },
  {
    kind: "return_prompt",
    family: "line-reply",
    locale: "ja",
    title: "Yorisou Companion",
    copy:
      "前回の続きに戻れます。LINE MINI Appを開くと、同じ流れのまま再開できます: https://miniapp.line.me/2009793294-hILBjsXB",
  },
  {
    kind: "fallback",
    family: "line-reply",
    locale: "ja",
    title: "Yorisou Companion",
    copy:
      "Yorisou Companionです。「はじめる」「つづける」「もどる」のいずれかを送ってください。入口はこちらです: https://miniapp.line.me/2009793294-hILBjsXB",
  },
];

export async function readOpenClawLiveSafeRegistry(): Promise<OpenClawLiveSafeRegistry> {
  try {
    const operatorSummary = await readOpenClawOperatorSummary();
    const latestOutputs =
      operatorSummary.operatingLoop?.latestLoop?.frontSafeRegistry?.outputs ||
      operatorSummary.operatingLoop?.latestLoop?.liveSafeRegistry?.outputs;

    if (Array.isArray(latestOutputs) && latestOutputs.length > 0) {
      return {
        source: "operating-loop",
        generatedAt:
          operatorSummary.operatingLoop?.latestLoop?.frontSafeRegistry?.generatedAt ||
          operatorSummary.operatingLoop?.latestLoop?.liveSafeRegistry?.generatedAt ||
          null,
        outputs: latestOutputs as OpenClawLiveSafeOutput[],
      };
    }
  } catch {
    // fall back to the fixed, live-safe defaults if the store is unavailable
  }

  return {
    source: "defaults",
    generatedAt: null,
    outputs: DEFAULT_LIVE_SAFE_OUTPUTS,
  };
}

export async function resolveOpenClawLiveSafeReplyText(input: {
  kind: "welcome" | "start_test" | "post_result" | "return_prompt" | "fallback";
  locale?: "ja" | "en";
  fallbackText: string;
}) {
  const registry = await readOpenClawLiveSafeRegistry();
  const resolved = registry.outputs.find((output) => output.kind === input.kind && (!output.locale || output.locale === input.locale));
  return resolved?.copy || input.fallbackText;
}
