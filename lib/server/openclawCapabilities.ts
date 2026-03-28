import type { SupportConversationPolicy } from "@/lib/ai/support/conversation-policy";
import type { SupportScenarioResult } from "@/lib/ai/support/scenario-engine";
import type { HinataMemorySnapshot } from "@/lib/server/hinataMemory";

export type OpenClawCapabilityId =
  | "support_reasoning"
  | "family_support_explainer"
  | "product_matching"
  | "continuity_planning"
  | "knowledge_retrieval"
  | "reflection_logging";

export type OpenClawCapability = {
  id: OpenClawCapabilityId;
  label: string;
  purpose: string;
  whenToUse: string;
};

export type OpenClawCapabilityPlan = {
  primary: OpenClawCapabilityId;
  secondary: OpenClawCapabilityId[];
  notes: string[];
  capabilities: OpenClawCapability[];
};

const REGISTRY: Record<OpenClawCapabilityId, OpenClawCapability> = {
  support_reasoning: {
    id: "support_reasoning",
    label: "支援整理",
    purpose: "移動と暮らしの不安を短く整理し、次の一歩を静かに選ぶ。",
    whenToUse: "すべての相談の基盤として使う。",
  },
  family_support_explainer: {
    id: "family_support_explainer",
    label: "家族向け説明",
    purpose: "ご家族の負担や共有のしやすさを踏まえて説明する。",
    whenToUse: "ご家族相談や共有ニーズが強いときに使う。",
  },
  product_matching: {
    id: "product_matching",
    label: "支え方・製品照合",
    purpose: "製品を押し売りせず、暮らしに合う支え方や候補を見る。",
    whenToUse: "製品比較や合うもの探しの相談で使う。",
  },
  continuity_planning: {
    id: "continuity_planning",
    label: "継続支援",
    purpose: "次回の会話やLINE・アカウント継続に備えて要点を残す。",
    whenToUse: "相談が少し進み、継続した支援が自然なときに使う。",
  },
  knowledge_retrieval: {
    id: "knowledge_retrieval",
    label: "知識参照",
    purpose: "読みものや現場知見から短い背景材料を取り出す。",
    whenToUse: "制度・地域交通・導入背景が関係する相談に使う。",
  },
  reflection_logging: {
    id: "reflection_logging",
    label: "改善観測",
    purpose: "繰り返しや失敗を記録し、後で prompt や skill 改善につなげる。",
    whenToUse: "すべての対話の裏側で静かに行う。",
  },
};

export function buildOpenClawCapabilityPlan(input: {
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  memory?: HinataMemorySnapshot | null;
}): OpenClawCapabilityPlan {
  const primary: OpenClawCapabilityId =
    input.scenario.scenario === "product_guidance"
      ? "product_matching"
      : input.scenario.scenario === "family_mobility_support"
        ? "family_support_explainer"
        : "support_reasoning";

  const secondary = new Set<OpenClawCapabilityId>(["reflection_logging", "support_reasoning"]);

  if (input.scenario.scenario === "institutional_inquiry") {
    secondary.add("knowledge_retrieval");
  }
  if (input.scenario.scenario === "product_guidance") {
    secondary.add("product_matching");
  }
  if (input.scenario.scenario === "family_mobility_support") {
    secondary.add("family_support_explainer");
  }
  if (
    input.memory?.profile?.relationshipStage === "continuing" ||
    input.memory?.profile?.relationshipStage === "follow_up_ready"
  ) {
    secondary.add("continuity_planning");
  }

  const notes = [
    `主軸 capability は「${REGISTRY[primary].label}」です。`,
    `質問スタイルは「${input.policy.followUpStyle}」を守ります。`,
  ];

  if (secondary.has("continuity_planning")) {
    notes.push("継続前提なら、今回の要点と開いている問いを短く残します。");
  }
  if (secondary.has("knowledge_retrieval")) {
    notes.push("必要なら読みもの・地域交通知見を短く参照します。");
  }

  return {
    primary,
    secondary: Array.from(secondary).filter((id) => id !== primary),
    notes,
    capabilities: [REGISTRY[primary], ...Array.from(secondary).filter((id) => id !== primary).map((id) => REGISTRY[id])],
  };
}
