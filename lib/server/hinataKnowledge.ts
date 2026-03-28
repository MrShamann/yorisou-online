import { promises as fs } from "fs";
import path from "path";

import type { SupportScenarioResult } from "@/lib/ai/support/scenario-engine";

export type HinataKnowledgeSnippet = {
  title: string;
  summary: string;
  whyItMatters: string;
};

export type HinataKnowledgePacket = {
  snippets: HinataKnowledgeSnippet[];
};

type InsightDraft = {
  category?: string;
  tags?: string[];
  content?: {
    ja?: {
      title?: string;
      summary?: string;
      whyItMatters?: string;
    };
  };
};

const draftsPath = path.join(process.cwd(), "data", "insight-drafts.json");

function scoreDraft(draft: InsightDraft, scenario: SupportScenarioResult, userMessage: string) {
  const hay = [
    draft.category || "",
    ...(draft.tags || []),
    draft.content?.ja?.title || "",
    draft.content?.ja?.summary || "",
    draft.content?.ja?.whyItMatters || "",
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  if (scenario.scenario === "institutional_inquiry" && hay.includes("地域交通")) score += 4;
  if (scenario.scenario === "product_guidance" && hay.includes("技術")) score += 2;
  if (scenario.scenario === "family_mobility_support" && hay.includes("家族")) score += 3;
  if (scenario.scenario === "elder_mobility_anxiety" && hay.includes("移動")) score += 3;
  for (const token of userMessage.toLowerCase().split(/\s+/).filter(Boolean)) {
    if (token.length >= 2 && hay.includes(token)) score += 1;
  }
  return score;
}

export async function getHinataKnowledgePacket(input: {
  scenario: SupportScenarioResult;
  userMessage: string;
}): Promise<HinataKnowledgePacket | null> {
  try {
    const raw = await fs.readFile(draftsPath, "utf8");
    const drafts = JSON.parse(raw) as InsightDraft[];
    const snippets = drafts
      .map((draft) => ({ draft, score: scoreDraft(draft, input.scenario, input.userMessage) }))
      .filter((entry) => entry.score > 0 && entry.draft.content?.ja?.title && entry.draft.content?.ja?.summary)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((entry) => ({
        title: entry.draft.content?.ja?.title || "",
        summary: entry.draft.content?.ja?.summary || "",
        whyItMatters: entry.draft.content?.ja?.whyItMatters || "",
      }));

    return snippets.length > 0 ? { snippets } : null;
  } catch {
    return null;
  }
}
