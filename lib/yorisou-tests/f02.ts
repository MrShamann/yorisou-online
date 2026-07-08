import { f02ShokubaKankyouFitShindanV10 } from "./generated/F02_shokuba_kankyou_fit_shindan_v1_0";
import type { RuleBasedRuntime, TestCatalogEntry } from "./types";

export const f02CatalogEntry: TestCatalogEntry = {
  slug: "f02",
  testId: "F02",
  title: "職場環境フィット診断",
  description: "音、距離感、裁量、回復のしやすさから、合いやすい環境の方向を見つめる入口です。",
  estimatedTime: "約12〜18分",
  category: "職場環境",
  boundaryNote: "職業判断ではなく、働く環境を比較するための自己理解メモです。",
  ctaLabel: "診断を始める",
  route: "/tests/f02",
  status: "available",
};

export const f02Runtime: RuleBasedRuntime = {
  slug: "f02",
  testId: "F02",
  title: "職場環境フィット診断",
  introTitle: "合いやすい職場環境を、\n感覚の相性から見る。",
  introDescription:
    "集中しやすい音や空間、チームとの距離、裁量の幅、回復のしやすさを比べながら、今の自分に合いやすい環境の方向を整理します。",
  estimatedTime: f02CatalogEntry.estimatedTime,
  questionCount: f02ShokubaKankyouFitShindanV10.format.question_count,
  questions: f02ShokubaKankyouFitShindanV10.questions,
  sections: f02ShokubaKankyouFitShindanV10.sections,
  resultTypes: f02ShokubaKankyouFitShindanV10.result_types,
  resultRules: Object.fromEntries(
    f02ShokubaKankyouFitShindanV10.result_types.map((resultType) => [
      resultType.result_type_id,
      {
        display_name_jp: resultType.name_jp,
        primary_trigger_dimensions: resultType.primary_dimensions,
      },
    ]),
  ),
  dimensionLabels: {
    sensory_environment_fit: "音や刺激との相性",
    focus_environment_need: "集中しやすい空間の条件",
    team_distance_preference: "チームとの距離感",
    communication_density: "会話の密度のしっくり感",
    autonomy_need: "裁量の必要度",
    rule_structure_need: "ルールや構造の見えやすさ",
    decision_speed_fit: "決めるスピードの相性",
    feedback_clarity_need: "期待値や反応の明確さ",
    psychological_safety_need: "安心して話せる土台",
    change_tolerance: "変化への強さ",
    workload_rhythm_fit: "負荷の波との相性",
    recovery_environment_need: "回復できる余白の必要度",
    conflict_noise_sensitivity: "ぶつかりや雑音への敏感さ",
    role_boundary_need: "役割や境界の明確さ",
    growth_environment_need: "伸びやすい環境条件",
    remote_onsite_fit: "場所の自由さとの相性",
  },
  boundaryNote: f02ShokubaKankyouFitShindanV10.free_result_structure.boundary_microcopy_jp,
  paidPreviewCopy: "職場環境を比べるときに見たい条件や、無理が出やすいポイントをもう少し丁寧に整理できます。",
  shareLabel: "この環境タイプをメモする",
  relatedRoutes: [
    { href: "/tests/f01", label: "働き方の入口を見る" },
    { href: "/tests/c02", label: "今の状態を見る" },
    { href: "/open-testing", label: "120問の入口を見る" },
  ],
};
