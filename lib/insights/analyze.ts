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

const categoryLensJa: Record<InsightCategory, { concern: string; action: string; partner: string }> = {
  "aging-society": {
    concern: "日常の短距離移動が生活維持そのものに直結する点",
    action: "移動手段の有無だけでなく、どの場面で負担が集中しているかを見極める",
    partner: "自治体や地域支援者が生活導線の空白を把握しやすくなる",
  },
  "community-transport": {
    concern: "地域内で移動支援が継続運用できるかどうか",
    action: "導入前に窓口・保管・説明・安全確認の役割分担を整える",
    partner: "地域交通の実証や小規模導入の現実性を判断しやすくなる",
  },
  "senior-mobility": {
    concern: "ご本人の使いやすさとご家族の安心が両立するかどうか",
    action: "試乗時に操作感だけでなく説明の分かりやすさや保管性も確認する",
    partner: "相談現場で比較軸を整理しやすくなる",
  },
  "welfare-mobility": {
    concern: "通院や施設利用の前後にある細かな移動負担",
    action: "入口から受付までの導線や付き添い負担まで含めて確認する",
    partner: "福祉・医療の現場で実務的な導入論点を共有しやすくなる",
  },
  "local-transport": {
    concern: "地域ごとの交通空白や生活導線の分断",
    action: "利用頻度、時間帯、目的地の偏りを具体的に捉える",
    partner: "地域の運行設計や実証テーマを具体化しやすくなる",
  },
  "micro-mobility": {
    concern: "地域条件に合わない導入が定着しないこと",
    action: "道路環境や保管条件を前提に、役割を限定して評価する",
    partner: "実証時に“どこで、誰が、どう使うか”を明確にしやすくなる",
  },
};

function summarizeJa(candidate: NormalizedInsightCandidate) {
  const excerpt = candidate.rawExcerpt.trim();
  const firstSentence = excerpt.split(/(?<=[。！？])/)[0]?.trim() || "";

  if (firstSentence) {
    return `${candidate.rawTitle}に関する動きです。${firstSentence}`;
  }

  return `${candidate.rawTitle}について、${categoryLabels.ja[candidate.category]}の観点から確認しておきたい論点が含まれています。`;
}

function whyItMattersJa(category: InsightCategory) {
  const lens = categoryLensJa[category];
  return `${categoryLabels.ja[category]}の論点では、${lens.concern}が重要です。制度や発表の内容を追うだけでなく、現場でどの負担が減るのかを具体的に見る必要があります。`;
}

function yorisouViewJa(category: InsightCategory, candidate: NormalizedInsightCandidate): string[] {
  const lens = categoryLensJa[category];
  return [
    `Yorisouでは、この話題を${categoryLabels.ja[category]}における実務上の示唆として捉えます。`,
    `${candidate.rawTitle}のような動きは、利用者側の利便性だけでなく、${lens.concern}を見直すきっかけになります。`,
    `ご本人、ご家族、地域の関係者は、${lens.action}という視点で読み解くことが重要です。`,
  ];
}

function takeawaysJa(category: InsightCategory): string[] {
  const lens = categoryLensJa[category];
  return [
    `${lens.concern}を、利用場面ごとに言語化しておく。`,
    `${lens.action}という順番で相談や比較を進める。`,
    `${lens.partner}ため、実証や試乗では現場条件を必ず合わせて確認する。`,
  ];
}

function audienceBlockJa(category: InsightCategory): InsightAudienceBlock {
  const lens = categoryLensJa[category];
  return {
    seniors: `ご本人にとっては、${lens.concern}が日々の外出意欲や安心感にどう影響するかを見ておくことが大切です。`,
    families: `ご家族は、${lens.action}という視点で、送迎や見守り負担がどう変わるかを確認すると判断しやすくなります。`,
    localCommunities: `地域側では、${lens.partner}ための運用設計や説明体制まで含めて整理することが重要です。`,
    operators: `運営者や実証パートナーは、${lens.action}という観点で導入条件と継続運用の両方を確認する必要があります。`,
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

function summarizeEn(candidate: NormalizedInsightCandidate) {
  const excerpt = candidate.rawExcerpt || candidate.rawTitle;
  return `This item relates to ${candidate.rawTitle}. ${excerpt.slice(0, 110)}${excerpt.length > 110 ? "..." : ""}`;
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

function yorisouViewEn(category: InsightCategory): string[] {
  return [
    `Yorisou reads this as a practical ${categoryLabels.en[category]} issue.`,
    "In Japan, the real question is not only whether something can be introduced, but whether it can remain usable in daily life.",
    "Users, families, and local partners should review operating context and support setup alongside specifications.",
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
          yorisouView: yorisouViewJa(candidate.category, candidate),
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
