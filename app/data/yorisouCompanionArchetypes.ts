export const COMPANION_ARCHETYPE_IDS = [
  "quiet-fox",
  "round-dog",
  "light-hedgehog",
  "wind-squirrel",
  "rain-bird",
  "sleepy-penguin",
  "thread-cat",
  "stone-turtle",
] as const;

export type CompanionArchetypeId = (typeof COMPANION_ARCHETYPE_IDS)[number];

export const COMPANION_OPTION_IDS = [
  "sort_lightly",
  "see_recommendation",
  "review_last_result",
  "look_only_today",
] as const;

export type CompanionOptionId = (typeof COMPANION_OPTION_IDS)[number];

export const COMPANION_INTENT_TYPES = [
  "weekly_reflection_interest",
  "consider_after_details",
  "free_only_for_now",
] as const;

export type CompanionIntentType = (typeof COMPANION_INTENT_TYPES)[number];

export type CompanionRiskBoundary =
  | "no_mind_reading"
  | "no_dependency_praise"
  | "no_pressure"
  | "no_passive_compliance"
  | "no_recovery_promise"
  | "no_health_diagnosis"
  | "no_psychological_analysis"
  | "no_productivity_moralizing";

export type YorisouCompanionArchetype = {
  id: CompanionArchetypeId;
  displayNameJa: string;
  shortDescriptionJa: string;
  motifEmoji: string;
  motifToken: string;
  visualToken: string;
  toneTags: string[];
  stateTags: string[];
  recommendedActionTypes: string[];
  riskBoundary: CompanionRiskBoundary;
  safeCopyNote: string;
  noGoClaims: string[];
};

export const YORISOU_COMPANION_ARCHETYPES: Record<CompanionArchetypeId, YorisouCompanionArchetype> = {
  "quiet-fox": {
    id: "quiet-fox",
    displayNameJa: "静かなきつね",
    shortDescriptionJa: "雰囲気や小さな違和感を、静かに見つけ直す相棒です。",
    motifEmoji: "🦊",
    motifToken: "fox-mist",
    visualToken: "mist-amber",
    toneTags: ["quiet", "noticing", "short"],
    stateTags: ["atmosphere", "noticing", "state-reading"],
    recommendedActionTypes: ["view_report_sample", "start_related_test"],
    riskBoundary: "no_mind_reading",
    safeCopyNote: "見抜く相手ではなく、今の空気を思い出す目印として扱います。",
    noGoClaims: ["あなたを見抜いている", "本当の気持ちを知っている"],
  },
  "round-dog": {
    id: "round-dog",
    displayNameJa: "まるい犬",
    shortDescriptionJa: "受け取り方や支え方を、やわらかく整える相棒です。",
    motifEmoji: "🐶",
    motifToken: "round-dog",
    visualToken: "warm-sand",
    toneTags: ["warm", "simple", "grounded"],
    stateTags: ["support", "distance", "receiving"],
    recommendedActionTypes: ["start_related_test", "save_to_line"],
    riskBoundary: "no_dependency_praise",
    safeCopyNote: "依存や自己犠牲を促す相手ではなく、距離感を落ち着いて見直す目印です。",
    noGoClaims: ["ずっとそばにいる", "何でも受け止める"],
  },
  "light-hedgehog": {
    id: "light-hedgehog",
    displayNameJa: "灯りハリネズミ",
    shortDescriptionJa: "小さな一歩だけを、そっと点ける相棒です。",
    motifEmoji: "🦔",
    motifToken: "hedgehog-light",
    visualToken: "ember-glow",
    toneTags: ["small-action", "protected", "gentle"],
    stateTags: ["ignition", "expression", "small-step"],
    recommendedActionTypes: ["view_report_sample", "save_to_line"],
    riskBoundary: "no_pressure",
    safeCopyNote: "勢いをつけすぎず、今日ひとつだけ見やすい入口を示します。",
    noGoClaims: ["今すぐ変わろう", "もっと頑張れる"],
  },
  "wind-squirrel": {
    id: "wind-squirrel",
    displayNameJa: "風受けリス",
    shortDescriptionJa: "入り口を軽く選び直す方向感を持つ相棒です。",
    motifEmoji: "🐿️",
    motifToken: "squirrel-wind",
    visualToken: "leaf-breeze",
    toneTags: ["light", "flexible", "directional"],
    stateTags: ["transition", "direction", "incoming-signal"],
    recommendedActionTypes: ["start_related_test", "no_action_safe_fallback"],
    riskBoundary: "no_passive_compliance",
    safeCopyNote: "流されるためではなく、自分で向きを選び直す入口として扱います。",
    noGoClaims: ["流れに任せればいい", "誰かに合わせればいい"],
  },
  "rain-bird": {
    id: "rain-bird",
    displayNameJa: "雨の日の鳥",
    shortDescriptionJa: "乱れたあとに、静かに戻るきっかけを持つ相棒です。",
    motifEmoji: "🐦",
    motifToken: "bird-rain",
    visualToken: "rain-sky",
    toneTags: ["restart", "quiet", "low-pressure"],
    stateTags: ["reset", "disturbed", "return"],
    recommendedActionTypes: ["no_action_safe_fallback", "view_report_sample"],
    riskBoundary: "no_recovery_promise",
    safeCopyNote: "回復を約束せず、戻りやすい場所を思い出すためのカードに留めます。",
    noGoClaims: ["回復させる", "治していく"],
  },
  "sleepy-penguin": {
    id: "sleepy-penguin",
    displayNameJa: "眠そうなペンギン",
    shortDescriptionJa: "急がず、余白を残したまま進める相棒です。",
    motifEmoji: "🐧",
    motifToken: "penguin-margin",
    visualToken: "midnight-ice",
    toneTags: ["slow", "low-pressure", "margin"],
    stateTags: ["fatigue", "rhythm", "rest-adjacent"],
    recommendedActionTypes: ["view_report_sample", "start_related_test"],
    riskBoundary: "no_health_diagnosis",
    safeCopyNote: "体調や睡眠を診断せず、ペースの置き場だけを見直します。",
    noGoClaims: ["眠りを治す", "健康状態がわかる"],
  },
  "thread-cat": {
    id: "thread-cat",
    displayNameJa: "糸まき猫",
    shortDescriptionJa: "絡まった印象や考えを、ひと筋ずつほどく相棒です。",
    motifEmoji: "🐈",
    motifToken: "cat-thread",
    visualToken: "thread-rose",
    toneTags: ["reframing", "sorting", "gentle"],
    stateTags: ["complexity", "sorting", "reframe"],
    recommendedActionTypes: ["view_report_sample", "start_related_test"],
    riskBoundary: "no_psychological_analysis",
    safeCopyNote: "分析しきるのではなく、今ほどきたい糸口だけを置きます。",
    noGoClaims: ["心の奥まで分析する", "本質を見抜く"],
  },
  "stone-turtle": {
    id: "stone-turtle",
    displayNameJa: "石を持つカメ",
    shortDescriptionJa: "戻る場所や足場を、静かに置き直す相棒です。",
    motifEmoji: "🐢",
    motifToken: "turtle-stone",
    visualToken: "stone-moss",
    toneTags: ["steady", "plain", "grounded"],
    stateTags: ["footing", "accumulation", "return-marker"],
    recommendedActionTypes: ["no_action_safe_fallback", "save_to_line"],
    riskBoundary: "no_productivity_moralizing",
    safeCopyNote: "進み方を評価せず、戻れる印だけを置いておきます。",
    noGoClaims: ["積み上げないとだめ", "生産的であるべき"],
  },
};

export function getCompanionArchetype(archetypeId: CompanionArchetypeId) {
  return YORISOU_COMPANION_ARCHETYPES[archetypeId];
}
