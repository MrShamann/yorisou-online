import { buildInsightContent } from "@/lib/insights/analyze";
import type { NormalizedInsightCandidate } from "@/lib/insights/normalize";
import type { InsightContent } from "@/lib/insights/types";

export type MobilityKnowledgePresentation = {
  ja: InsightContent;
  en: InsightContent;
};

export async function buildMobilityKnowledgePresentation(candidate: NormalizedInsightCandidate): Promise<MobilityKnowledgePresentation> {
  const [ja, en] = await Promise.all([buildInsightContent(candidate, "ja"), buildInsightContent(candidate, "en")]);
  return { ja, en };
}
