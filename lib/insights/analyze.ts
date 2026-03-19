import type { InsightAudienceBlock, InsightCategory, InsightContent, Locale } from "@/lib/insights/types";
import type { NormalizedInsightCandidate } from "@/lib/insights/normalize";

const categoryLabels = {
  ja: {
    "aging-society": "高齢社会",
    "community-transport": "地域交通",
    "senior-mobility": "シニアモビリティ",
    "welfare-mobility": "福祉移動",
    "local-transport": "地域の交通課題",
    "micro-mobility": "マイクロモビリティ",
  },
  en: {
    "aging-society": "aging society",
    "community-transport": "community transport",
    "senior-mobility": "senior mobility",
    "welfare-mobility": "welfare mobility",
    "local-transport": "local transport",
    "micro-mobility": "micro mobility",
  },
} as const;

function audienceBlockJa(category: InsightCategory): InsightAudienceBlock {
  return {
    seniors: `${categoryLabels.ja[category]}の話題として、日々の移動負担がどう変わるかを見ることが大切です。`,
    families: "制度や導入の話題でも、実際には送迎や見守り負担にどう影響するかを確認する必要があります。",
    localCommunities: "地域実装の視点では、車両導入だけでなく説明・保管・相談窓口まで含めた設計が重要です。",
    operators: "実証や導入判断では、利用導線・安全運用・継続体制に引き寄せて読むことが求められます。",
  };
}

function audienceBlockEn(category: InsightCategory): InsightAudienceBlock {
  return {
    seniors: `As a ${categoryLabels.en[category]} topic, the key question is how daily movement burden may change in practice.`,
    families: "Even policy or pilot news should be read through its likely effect on accompaniment and family reassurance.",
    localCommunities: "For local implementation, support design matters alongside vehicle introduction.",
    operators: "Pilots and deployment decisions should be read through route fit, safe operation, and continuity.",
  };
}

function summarizeJa(candidate: NormalizedInsightCandidate) {
  const excerpt = candidate.rawExcerpt || candidate.rawTitle;
  return `${candidate.rawTitle}に関する話題です。${excerpt.slice(0, 110)}${excerpt.length > 110 ? "..." : ""}`;
}

function summarizeEn(candidate: NormalizedInsightCandidate) {
  const excerpt = candidate.rawExcerpt || candidate.rawTitle;
  return `This item relates to ${candidate.rawTitle}. ${excerpt.slice(0, 110)}${excerpt.length > 110 ? "..." : ""}`;
}

function whyItMattersJa(category: InsightCategory) {
  const map: Record<InsightCategory, string> = {
    "aging-society": "高齢社会では、短距離移動のしやすさが生活継続の基盤になります。",
    "community-transport": "地域交通の話題は、自治体や施設がどこまで持続的に運用できるかに直結します。",
    "senior-mobility": "シニアモビリティの論点は、ご本人だけでなくご家族の安心や比較判断にも影響します。",
    "welfare-mobility": "福祉移動の改善は、通院や施設利用の実務負担を左右します。",
    "local-transport": "地域の交通課題は、生活導線の分断や移動空白の埋め方と関係します。",
    "micro-mobility": "マイクロモビリティの導入は、地域条件や高齢者利用との相性確認が欠かせません。",
  };
  return map[category];
}

function whyItMattersEn(category: InsightCategory) {
  const map: Record<InsightCategory, string> = {
    "aging-society": "In an aging society, comfortable short-distance mobility supports daily independence.",
    "community-transport": "Community transport topics directly affect whether local programs can operate sustainably.",
    "senior-mobility": "Senior mobility issues shape reassurance and decision-making for both users and families.",
    "welfare-mobility": "Welfare mobility improvements influence the practical burden of clinic and facility access.",
    "local-transport": "Local transport challenges are closely tied to route fragmentation and mobility gaps.",
    "micro-mobility": "Micro mobility topics need to be checked against real local conditions and senior use cases.",
  };
  return map[category];
}

function yorisouViewJa(category: InsightCategory): string[] {
  return [
    `Yorisouは、この話題を${categoryLabels.ja[category]}の実務課題として見ています。`,
    "日本では導入可否だけでなく、日常導線に沿って継続利用できるかが重要です。",
    "ご本人・ご家族・地域関係者は、性能だけでなく相談体制や利用環境まで含めて確認する必要があります。",
  ];
}

function yorisouViewEn(category: InsightCategory): string[] {
  return [
    `Yorisou reads this as a practical ${categoryLabels.en[category]} issue.`,
    "In Japan, the real question is not only whether something can be introduced, but whether it can remain usable in daily life.",
    "Users, families, and local partners should review operating context and support setup alongside specifications.",
  ];
}

function takeawaysJa(category: InsightCategory): string[] {
  return [
    "実際の利用導線に引き寄せて読む。",
    "ご家族や付き添い側の負担変化も合わせて考える。",
    `Yorisouでは${categoryLabels.ja[category]}の観点から試乗・導入相談につなげて整理できます。`,
  ];
}

function takeawaysEn(category: InsightCategory): string[] {
  return [
    "Interpret the topic through real daily routes.",
    "Include likely impact on family or accompaniment burden.",
    `This can be translated into trial or consultation questions through a ${categoryLabels.en[category]} lens.`,
  ];
}

async function maybeEnhanceWithOpenAI(locale: Locale, content: InsightContent, candidate: NormalizedInsightCandidate) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const prompt =
      locale === "ja"
        ? `以下のニュース候補に対する要約と分析を、落ち着いた専門的な日本語に整えてください。誇張や断定は避け、Yorisouの視点に沿ってください。\n\n候補:${JSON.stringify(
            candidate
          )}\n\n現状出力:${JSON.stringify(content)}`
        : `Refine this mobility news summary and analysis in calm, professional English aligned with Yorisou's editorial tone. Avoid hype.\n\nCandidate:${JSON.stringify(
            candidate
          )}\n\nCurrent output:${JSON.stringify(content)}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
        temperature: 0.4,
        text: {
          format: {
            type: "json_schema",
            name: "insight_content",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                whyItMatters: { type: "string" },
                yorisouView: { type: "array", items: { type: "string" } },
                practicalTakeaways: { type: "array", items: { type: "string" } },
                whatThisMeans: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    seniors: { type: "string" },
                    families: { type: "string" },
                    localCommunities: { type: "string" },
                    operators: { type: "string" },
                  },
                  required: ["seniors", "families", "localCommunities", "operators"],
                },
              },
              required: ["title", "summary", "whyItMatters", "yorisouView", "practicalTakeaways", "whatThisMeans"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      console.error("OpenAI insight enhancement failed:", await response.text());
      return null;
    }

    const data = (await response.json()) as {
      output_text?: string;
    };

    if (!data.output_text) {
      return null;
    }

    return JSON.parse(data.output_text) as InsightContent;
  } catch (error) {
    console.error("OpenAI insight enhancement error:", error);
    return null;
  }
}

export async function buildInsightContent(candidate: NormalizedInsightCandidate, locale: Locale): Promise<InsightContent> {
  const deterministic: InsightContent =
    locale === "ja"
      ? {
          title: candidate.rawTitle,
          summary: summarizeJa(candidate),
          whyItMatters: whyItMattersJa(candidate.category),
          yorisouView: yorisouViewJa(candidate.category),
          practicalTakeaways: takeawaysJa(candidate.category),
          whatThisMeans: audienceBlockJa(candidate.category),
        }
      : {
          title: candidate.rawTitle,
          summary: summarizeEn(candidate),
          whyItMatters: whyItMattersEn(candidate.category),
          yorisouView: yorisouViewEn(candidate.category),
          practicalTakeaways: takeawaysEn(candidate.category),
          whatThisMeans: audienceBlockEn(candidate.category),
        };

  return (await maybeEnhanceWithOpenAI(locale, deterministic, candidate)) || deterministic;
}
