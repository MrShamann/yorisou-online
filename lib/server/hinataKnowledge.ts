import { promises as fs } from "fs";
import path from "path";

import elderNeedsTaxonomy from "@/data/hinata-domain-needs-taxonomy-v1.json";
import domainExamples from "@/data/hinata-domain-examples-v1.json";
import matchingPlaybook from "@/data/hinata-matching-playbook-v1.json";
import productServiceCatalog from "@/data/hinata-product-service-catalog-v1.json";
import type { SupportScenarioResult } from "@/lib/ai/support/scenario-engine";
import { extractNeedsSignalFromConversation } from "@/lib/server/openclawNeedsInsight";

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

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function compact(text: string, limit = 150) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit - 3)}...` : normalized;
}

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

function scoreNeedEntry(entry: {
  id: string;
  title: string;
  description: string;
  common_user_expressions: string[];
  hidden_underlying_need: string;
  recommended_conversational_stance: string;
  when_product_service_discussion_should_be_delayed: string;
}, scenario: SupportScenarioResult, userMessage: string) {
  const hay = normalize(
    [
      entry.id,
      entry.title,
      entry.description,
      ...entry.common_user_expressions,
      entry.hidden_underlying_need,
      entry.recommended_conversational_stance,
    ].join(" "),
  );
  let score = 0;
  const signal = extractNeedsSignalFromConversation({ latestUserMessage: userMessage });
  if (signal.needCategory && signal.needCategory === entry.id) score += 8;
  if (scenario.scenario === "family_mobility_support" && entry.id === "family_worry_about_parent") score += 4;
  if (scenario.scenario === "elder_mobility_anxiety" && ["mobility_anxiety_general", "fear_of_falling", "low_distance_mobility_difficulty", "reduced_confidence"].includes(entry.id)) score += 3;
  if (scenario.scenario === "product_guidance" && ["unclear_needed_help", "need_for_trial_and_explanation", "low_distance_mobility_difficulty"].includes(entry.id)) score += 2;
  for (const token of normalize(userMessage).split(/\s+/).filter(Boolean)) {
    if (token.length >= 2 && hay.includes(token)) score += 1;
  }
  return score;
}

function scorePlaybookEntry(entry: {
  id: string;
  scenario_pattern: string;
  likely_need_layers: string[];
  hinata_response_posture: string;
  when_to_move_into_solution_discussion: string;
  when_to_offer_action_next_steps: string;
}, scenario: SupportScenarioResult, userMessage: string) {
  let score = 0;
  const lower = normalize(userMessage);
  if (scenario.scenario === "family_mobility_support" && entry.id === "playbook_family_worry_without_fit") score += 4;
  if (scenario.scenario === "product_guidance" && entry.id === "playbook_product_fit_explicit") score += 4;
  if (scenario.scenario === "consultation_booking" && entry.id === "playbook_process_or_subsidy_question") score += 2;
  if (/(trial|試|説明|explain)/i.test(userMessage) && entry.id === "playbook_trial_or_demo_request") score += 5;
  if (/(続き|さっき|earlier|following up|about what i said)/i.test(lower) && entry.id === "playbook_continuity_answering_previous_question") score += 5;
  if (/(line|ログイン|あとで|later)/i.test(lower) && entry.id === "playbook_continuation_channel_later") score += 2;
  return score;
}

function scoreCatalogEntry(entry: {
  id: string;
  name: string;
  category: string;
  certainty: string;
  what_problem_it_addresses: string[];
  likely_barriers_or_hesitation_points: string[];
  when_it_is_appropriate_to_bring_it_up: string;
  when_it_is_too_early_to_bring_it_up: string;
}, scenario: SupportScenarioResult, userMessage: string) {
  const lower = normalize(userMessage);
  let score = 0;
  const explicitProductIntent = /(製品|どれが合う|compare|product|trial|試して)/i.test(userMessage);
  if (!explicitProductIntent && scenario.scenario !== "product_guidance") {
    return 0;
  }
  if (entry.certainty === "placeholder_low_certainty") score -= 2;
  if (scenario.scenario === "product_guidance") score += 2;
  if (lower.includes("trial") || lower.includes("試")) {
    if (entry.id === "service_trial_demo_guided_intro") score += 6;
  }
  if (lower.includes("family") || lower.includes("家族")) {
    if (entry.id === "service_family_explanation_support" || entry.category === "family_practicality_oriented") score += 3;
  }
  if (lower.includes("line") || lower.includes("あとで") || lower.includes("later")) {
    if (entry.id === "service_line_continuation") score += 3;
  }
  if (lower.includes("通院") || lower.includes("clinic") || lower.includes("買い物") || lower.includes("shopping")) {
    if (entry.category === "mobility_devices_light_mobility") score += 2;
  }
  return score;
}

function scoreDomainExample(entry: {
  language: string;
  need_category: string;
  user_input: string;
  ideal_hinata_reply: string;
  tags: string[];
}, userMessage: string, scenario: SupportScenarioResult) {
  let score = 0;
  const signal = extractNeedsSignalFromConversation({ latestUserMessage: userMessage });
  if (signal.needCategory && signal.needCategory === entry.need_category) score += 5;
  if (entry.language === "ja" && /[\u3040-\u30ff\u3400-\u9fff]/.test(userMessage)) score += 1;
  if (entry.language === "en" && /[A-Za-z]/.test(userMessage) && !/[\u3040-\u30ff\u3400-\u9fff]/.test(userMessage)) score += 1;
  if (scenario.scenario === "family_mobility_support" && entry.tags.includes("family")) score += 2;
  return score;
}

export async function getHinataKnowledgePacket(input: {
  scenario: SupportScenarioResult;
  userMessage: string;
}): Promise<HinataKnowledgePacket | null> {
  const snippets: HinataKnowledgeSnippet[] = [];
  const signal = extractNeedsSignalFromConversation({ latestUserMessage: input.userMessage });

  try {
    const raw = await fs.readFile(draftsPath, "utf8");
    const drafts = JSON.parse(raw) as InsightDraft[];
    snippets.push(
      ...drafts
        .map((draft) => ({ draft, score: scoreDraft(draft, input.scenario, input.userMessage) }))
        .filter((entry) => entry.score > 0 && entry.draft.content?.ja?.title && entry.draft.content?.ja?.summary)
        .sort((a, b) => b.score - a.score)
        .slice(0, 1)
        .map((entry) => ({
          title: entry.draft.content?.ja?.title || "",
          summary: entry.draft.content?.ja?.summary || "",
          whyItMatters: entry.draft.content?.ja?.whyItMatters || "",
        })),
    );
  } catch {
    // Insight drafts are optional for runtime grounding.
  }

  const topNeed = (elderNeedsTaxonomy as Array<{
    id: string;
    title: string;
    description: string;
    common_user_expressions: string[];
    hidden_underlying_need: string;
    recommended_conversational_stance: string;
    when_product_service_discussion_should_be_delayed: string;
  }>)
    .map((entry) => ({ entry, score: scoreNeedEntry(entry, input.scenario, input.userMessage) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (topNeed) {
    snippets.push({
      title: `Need lens: ${topNeed.entry.title}`,
      summary: compact(`${topNeed.entry.hidden_underlying_need} / ${topNeed.entry.recommended_conversational_stance}`),
      whyItMatters: compact(`Delay product talk when needed: ${topNeed.entry.when_product_service_discussion_should_be_delayed}`),
    });
  }

  const topPlaybook = (matchingPlaybook as Array<{
    id: string;
    scenario_pattern: string;
    likely_need_layers: string[];
    hinata_response_posture: string;
    when_to_move_into_solution_discussion: string;
    when_to_offer_action_next_steps: string;
  }>)
    .map((entry) => ({ entry, score: scorePlaybookEntry(entry, input.scenario, input.userMessage) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (topPlaybook) {
    snippets.push({
      title: `Conversation cue: ${topPlaybook.entry.scenario_pattern}`,
      summary: compact(`${topPlaybook.entry.hinata_response_posture} / Need layers: ${topPlaybook.entry.likely_need_layers.join(" / ")}`),
      whyItMatters: compact(`Move into solutions only when: ${topPlaybook.entry.when_to_move_into_solution_discussion}`),
    });
  }

  const topCatalog = (productServiceCatalog as Array<{
    id: string;
    name: string;
    category: string;
    certainty: string;
    what_problem_it_addresses: string[];
    likely_barriers_or_hesitation_points: string[];
    when_it_is_appropriate_to_bring_it_up: string;
    when_it_is_too_early_to_bring_it_up: string;
  }>)
    .map((entry) => ({ entry, score: scoreCatalogEntry(entry, input.scenario, input.userMessage) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (topCatalog) {
    snippets.push({
      title: `Support option hint: ${topCatalog.entry.name}`,
      summary: compact(`${topCatalog.entry.what_problem_it_addresses.join(" / ")} / barriers: ${topCatalog.entry.likely_barriers_or_hesitation_points.join(" / ")}`),
      whyItMatters: compact(`Bring up only when appropriate: ${topCatalog.entry.when_it_is_appropriate_to_bring_it_up}`),
    });
  }

  const topExample = (domainExamples as Array<{
    language: string;
    need_category: string;
    user_input: string;
    ideal_hinata_reply: string;
    tags: string[];
  }>)
    .map((entry) => ({ entry, score: scoreDomainExample(entry, input.userMessage, input.scenario) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (topExample && signal.readinessForSolutionDiscussion === "not_ready") {
    snippets.push({
      title: "Reply style cue",
      summary: compact(`User pattern: ${topExample.entry.user_input}`),
      whyItMatters: compact(`Ideal direction: ${topExample.entry.ideal_hinata_reply}`),
    });
  }

  const unique = new Map<string, HinataKnowledgeSnippet>();
  for (const snippet of snippets) {
    if (!snippet.title || !snippet.summary) {
      continue;
    }
    unique.set(snippet.title, snippet);
  }

  const finalSnippets = Array.from(unique.values()).slice(0, 4);
  return finalSnippets.length > 0 ? { snippets: finalSnippets } : null;
}
