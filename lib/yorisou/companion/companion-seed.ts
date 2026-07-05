import {
  getCompanionArchetype,
  type CompanionArchetypeId,
  type CompanionIntentType,
  type CompanionOptionId,
} from "@/app/data/yorisouCompanionArchetypes";
import type { RecommendationActionId } from "@/lib/server/relationship-intelligence/types";
import type { RecommendationActionType } from "@/app/data/yorisouRecommendationActions";
import type { RecommendationMemorySummary } from "@/lib/server/relationship-intelligence/recommendation-memory";
import type { RecommendationPackage } from "@/lib/server/relationship-intelligence/recommendation-orchestrator";
import type {
  RecommendationRiskBoundary,
} from "@/app/data/yorisouRecommendationGraph";
import type { RecommendationSignalRecord, RecommendationSignalTestId } from "@/lib/server/relationship-intelligence/types";

export type CompanionSeedSource = "result_page" | "return_session" | "fallback";
export type CompanionSeedConfidence = "low" | "emerging" | "strong";

export type CompanionBoundedOption = {
  id: CompanionOptionId;
  label: string;
  reply: string;
};

export type CompanionSubscriptionChoice = {
  id: CompanionIntentType;
  label: string;
  signalType: "companion_subscription_interest_clicked" | "companion_subscription_not_now_clicked";
};

export type CompanionSeedAction = {
  actionId: RecommendationActionId | null;
  href: string;
  label: string;
  actionType: RecommendationActionType | "return_to_line" | "safe_fallback";
};

export type CompanionSeed = {
  seedId: string;
  archetypeId: CompanionArchetypeId;
  displayNameJa: string;
  motifEmoji: string;
  motifToken: string;
  shortMessageJa: string;
  stateSummaryJa: string;
  recommendedCta: CompanionSeedAction;
  lineReturnCta: CompanionSeedAction | null;
  boundedQuestion: string | null;
  boundedOptions: CompanionBoundedOption[];
  subscriptionProbe: {
    question: string;
    choices: CompanionSubscriptionChoice[];
    show: boolean;
  } | null;
  riskBoundaryNote: string;
  generatedAt: string;
  confidence: CompanionSeedConfidence;
  source: CompanionSeedSource;
  isFallback: boolean;
};

export type CompanionSeedInput = {
  testId: RecommendationSignalTestId;
  resultId?: string | null;
  recommendationPackage?: RecommendationPackage | null;
  recommendationMemory?: RecommendationMemorySummary | null;
  recentSignals?: RecommendationSignalRecord[];
  source?: CompanionSeedSource;
};

const DEFAULT_OPTIONS: CompanionBoundedOption[] = [
  { id: "sort_lightly", label: "少し整理したい", reply: "今日は整理しやすい入口を先に見ていきます。" },
  { id: "see_recommendation", label: "次のおすすめを見る", reply: "次に試しやすい入口をそのまま見られるようにします。" },
  { id: "review_last_result", label: "前回の結果を見返す", reply: "前回の流れを思い出しやすい場所から戻ります。" },
  { id: "look_only_today", label: "今日は軽く見るだけ", reply: "今日は負担を増やさず、軽く見られる入口に留めます。" },
];

const SUBSCRIPTION_CHOICES: CompanionSubscriptionChoice[] = [
  {
    id: "weekly_reflection_interest",
    label: "使ってみたい",
    signalType: "companion_subscription_interest_clicked",
  },
  {
    id: "consider_after_details",
    label: "内容を見てから考えたい",
    signalType: "companion_subscription_interest_clicked",
  },
  {
    id: "free_only_for_now",
    label: "今は無料だけでいい",
    signalType: "companion_subscription_not_now_clicked",
  },
];

function nowIso() {
  return new Date().toISOString();
}

function createSeedId(input: CompanionSeedInput, archetypeId: CompanionArchetypeId) {
  return [
    "companion",
    input.testId,
    input.resultId || "none",
    archetypeId,
    input.recommendationMemory?.memoryState || "memory-none",
  ].join("_");
}

function inferConfidence(input: CompanionSeedInput): CompanionSeedConfidence {
  if (input.recommendationMemory?.confidence === "strong") {
    return "strong";
  }
  if (input.recommendationMemory?.confidence === "emerging" || input.recommendationPackage?.confidence === "emerging") {
    return "emerging";
  }
  return input.recommendationPackage?.confidence === "strong" ? "strong" : "low";
}

function chooseArchetype(input: CompanionSeedInput): CompanionArchetypeId {
  if (input.testId === "work-rhythm") {
    return "sleepy-penguin";
  }
  if (input.testId === "name-impression") {
    return "thread-cat";
  }
  if (input.testId === "local-life") {
    return "stone-turtle";
  }
  if (input.testId === "love-distance") {
    return "round-dog";
  }

  const packageLayer = input.recommendationPackage?.primaryAction.productLayer;
  if (packageLayer === "report") return "quiet-fox";
  if (packageLayer === "community") return "round-dog";
  if (packageLayer === "design") return "wind-squirrel";
  if (packageLayer === "local_life") return "stone-turtle";
  if (input.recommendationMemory?.memoryState === "no_memory") return "rain-bird";
  return "light-hedgehog";
}

function buildMessage(input: CompanionSeedInput, archetypeId: CompanionArchetypeId) {
  const archetype = getCompanionArchetype(archetypeId);

  if (input.testId === "work-rhythm") {
    return "いまのペースを急がず、ひとつ動きやすい入口だけを灯します。";
  }
  if (input.testId === "name-impression") {
    return "見え方を決めつけず、今ほどきやすい糸口だけを置いておきます。";
  }
  if (input.testId === "local-life") {
    return "暮らしの声を抱え込まず、戻りやすい足場だけをここに置きます。";
  }
  if (input.testId === "love-distance") {
    return "関係の答えを急がず、今の距離感を落ち着いて見直す入口にします。";
  }
  if (input.recommendationMemory?.memoryState === "no_memory") {
    return "まだ材料が少ないので、まずは戻りやすい入口をひとつだけ残します。";
  }

  return `${archetype.displayNameJa}が、今日は戻りやすい入口をひとつだけ示します。`;
}

function buildStateSummary(input: CompanionSeedInput, archetypeId: CompanionArchetypeId) {
  if (input.recommendationMemory?.memoryState === "no_memory" && input.testId === "current-state") {
    return "まだ相棒をつくる材料が少ないようです。まずはチェックをひとつ終えると、今の動き方に近いカードが出ます。";
  }

  if (input.recommendationMemory?.recentTests?.length) {
    const recent = input.recommendationMemory.recentTests.slice(0, 2).join(" / ");
    return `最近は「${recent}」の入口が近くにあります。そこから今日戻りやすい場所を選んでいます。`;
  }

  if (input.testId === "local-life") {
    return "サービスの約束ではなく、声や関心を安全に置き直すためのカードです。";
  }

  if (input.testId === "name-impression") {
    return "名前の印象を占いにはせず、今の見え方を軽く並べ直すためのカードです。";
  }

  if (input.testId === "work-rhythm") {
    return "適職や能力を決めず、今のリズムで戻りやすい入口だけを前に出しています。";
  }

  if (input.testId === "love-distance") {
    return "相手の本心を決めず、自分の距離感を落ち着いて思い出すためのカードです。";
  }

  return `${getCompanionArchetype(archetypeId).shortDescriptionJa} 今日の戻り先を静かに思い出すためのカードです。`;
}

function buildRiskBoundaryNote(boundary: RecommendationRiskBoundary, testId: RecommendationSignalTestId) {
  if (boundary === "care_welfare_mobility_boundary" || testId === "local-life") {
    return "この相棒は、暮らしの困りごとを直接引き受けるサービスではありません。";
  }
  if (boundary === "clinical_or_fortune_boundary" || testId === "love-distance") {
    return "この相棒は、相手の気持ちや関係の結論を判断するものではありません。";
  }
  return "この相棒は、相談相手や診断ではありません。今の状態を思い出すための小さな表示です。";
}

function buildRecommendedCta(input: CompanionSeedInput): CompanionSeedAction {
  const primary = input.recommendationPackage?.primaryAction;
  if (primary) {
    return {
      actionId: primary.actionId,
      href: primary.href,
      label: "今日の入口をひとつ見る",
      actionType: primary.actionType,
    };
  }

  if (input.testId === "current-state") {
    return {
      actionId: null,
      href: "/tests",
      label: "今日の入口をひとつ見る",
      actionType: "safe_fallback",
    };
  }

  return {
    actionId: null,
    href: "/open-testing",
    label: "今日の入口をひとつ見る",
    actionType: "safe_fallback",
  };
}

function buildLineReturnCta(input: CompanionSeedInput): CompanionSeedAction | null {
  if (input.source === "return_session") {
    return null;
  }

  return {
    actionId: "line-save-entry",
    href: "/line/mini-app",
    label: "LINEでまた見られるようにする",
    actionType: "return_to_line",
  };
}

export function buildCompanionSeed(input: CompanionSeedInput): CompanionSeed {
  const archetypeId = chooseArchetype(input);
  const archetype = getCompanionArchetype(archetypeId);
  const confidence = inferConfidence(input);
  const source =
    input.source ||
    (input.testId === "current-state" ? "return_session" : input.resultId ? "result_page" : "fallback");
  const isFallback =
    input.testId === "current-state" &&
    input.recommendationMemory?.memoryState === "no_memory" &&
    !input.recommendationMemory?.recentTests.length;

  return {
    seedId: createSeedId(input, archetypeId),
    archetypeId,
    displayNameJa: archetype.displayNameJa,
    motifEmoji: archetype.motifEmoji,
    motifToken: archetype.motifToken,
    shortMessageJa: buildMessage(input, archetypeId),
    stateSummaryJa: buildStateSummary(input, archetypeId),
    recommendedCta: buildRecommendedCta(input),
    lineReturnCta: buildLineReturnCta(input),
    boundedQuestion: "今いちばん近いのはどれですか？",
    boundedOptions: DEFAULT_OPTIONS,
    subscriptionProbe:
      source === "return_session" && !isFallback
        ? {
            question: "この相棒の週次ふりかえりがあったら、使ってみたいですか？",
            choices: SUBSCRIPTION_CHOICES,
            show: true,
          }
        : null,
    riskBoundaryNote: buildRiskBoundaryNote(
      input.recommendationPackage?.riskBoundary || "normal",
      input.testId,
    ),
    generatedAt: nowIso(),
    confidence,
    source,
    isFallback,
  };
}
