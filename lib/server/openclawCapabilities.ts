import type { SupportConversationPolicy } from "@/lib/ai/support/conversation-policy";
import type { SupportScenarioResult } from "@/lib/ai/support/scenario-engine";
import type { HinataMemorySnapshot } from "@/lib/server/hinataMemory";

export type OpenClawCapabilityId =
  | "companion_listening"
  | "state_reflection"
  | "relationship_reflection"
  | "daily_life_reflection"
  | "continuity_planning"
  | "consent_memory"
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
  companion_listening: {
    id: "companion_listening",
    label: "静かに聞く",
    purpose: "解決を急がず、利用者の最新の言葉を受け取る。",
    whenToUse: "すべての対話の基盤として使う。",
  },
  state_reflection: {
    id: "state_reflection",
    label: "いまの状態を見る",
    purpose: "利用者自身が、いまの感覚や揺れを言葉にできるよう手伝う。",
    whenToUse: "自分の状態を整理したいときに使う。",
  },
  relationship_reflection: {
    id: "relationship_reflection",
    label: "人との距離を見る",
    purpose: "関係の良し悪しを決めつけず、本人が感じている距離や負荷を見つめる。",
    whenToUse: "友人・恋人・家族など人間関係の話題で使う。",
  },
  daily_life_reflection: {
    id: "daily_life_reflection",
    label: "日々の調子を見る",
    purpose: "仕事、学び、生活リズムなど日常の変化を静かに振り返る。",
    whenToUse: "仕事・学び・生活の話題で使う。",
  },
  continuity_planning: {
    id: "continuity_planning",
    label: "あとで続ける",
    purpose: "本人が望む場合だけ、次回に戻りやすい形を整える。",
    whenToUse: "会話を後で続けたい意図が明確なときに使う。",
  },
  consent_memory: {
    id: "consent_memory",
    label: "本人が選んで残す",
    purpose: "記憶を自動化せず、本人が何を残すかを選べる状態にする。",
    whenToUse: "本人が覚えてほしい、残したいと明示したときだけ使う。",
  },
  reflection_logging: {
    id: "reflection_logging",
    label: "改善観測",
    purpose: "対話品質の改善に必要な最小限の観測を、治理と同意の範囲内で行う。",
    whenToUse: "有効な治理・同意・データ境界の範囲内でのみ使う。",
  },
};

export function buildOpenClawCapabilityPlan(input: {
  scenario: SupportScenarioResult;
  policy: SupportConversationPolicy;
  memory?: HinataMemorySnapshot | null;
}): OpenClawCapabilityPlan {
  let primary: OpenClawCapabilityId = "companion_listening";

  if (input.scenario.scenario === "reflect_on_relationship") primary = "relationship_reflection";
  else if (input.scenario.scenario === "reflect_on_work" || input.scenario.scenario === "reflect_on_daily_life") primary = "daily_life_reflection";
  else if (input.scenario.scenario === "understand_my_state" || input.scenario.scenario === "decide_next_small_step") primary = "state_reflection";
  else if (input.scenario.scenario === "remember_something") primary = "consent_memory";
  else if (input.scenario.scenario === "revisit_previous_state" || input.scenario.scenario === "continue_previous_conversation") primary = "continuity_planning";

  const secondary = new Set<OpenClawCapabilityId>(["companion_listening"]);
  if (input.scenario.scenario === "remember_something") secondary.add("consent_memory");
  if (
    input.memory?.profile?.relationshipStage === "continuing" ||
    input.memory?.profile?.relationshipStage === "follow_up_ready" ||
    input.scenario.scenario === "continue_previous_conversation"
  ) {
    secondary.add("continuity_planning");
  }

  const notes = [
    `主軸は「${REGISTRY[primary].label}」。`,
    `質問は「${input.policy.followUpStyle}」。`,
    "何も勧めないことを正常な結果として扱う。",
  ];

  return {
    primary,
    secondary: Array.from(secondary).filter((id) => id !== primary),
    notes,
    capabilities: [REGISTRY[primary], ...Array.from(secondary).filter((id) => id !== primary).map((id) => REGISTRY[id])],
  };
}
