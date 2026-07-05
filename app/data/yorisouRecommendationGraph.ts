import type {
  RecommendationInterestId,
  RecommendationSignalSource,
  RecommendationSignalTestId,
  RecommendationSignalType,
} from "@/lib/server/relationship-intelligence/types";

export const RECOMMENDATION_PRODUCT_LAYERS = [
  "report",
  "line_companion",
  "select",
  "design",
  "community",
  "local_life",
  "public_value",
  "partner_research",
  "content_resource",
] as const;

export type RecommendationProductLayer = (typeof RECOMMENDATION_PRODUCT_LAYERS)[number];

export const RECOMMENDATION_OPPORTUNITY_CATEGORIES = [
  "deepen_report",
  "create_content_resource",
  "validate_select_candidate",
  "validate_design_candidate",
  "invite_feedback",
  "local_life_research",
  "public_value_memo_candidate",
  "partner_research_candidate",
  "no_action_yet",
] as const;

export type RecommendationOpportunityCategory = (typeof RECOMMENDATION_OPPORTUNITY_CATEGORIES)[number];

export const RECOMMENDATION_CONFIDENCE_TIERS = [
  "low",
  "emerging",
  "strong",
] as const;

export type RecommendationConfidenceTier = (typeof RECOMMENDATION_CONFIDENCE_TIERS)[number];

export const RECOMMENDATION_REVIEW_STATUSES = [
  "watch",
  "founder_review_candidate",
  "blocked_by_risk",
  "needs_more_signal",
] as const;

export type RecommendationReviewStatus = (typeof RECOMMENDATION_REVIEW_STATUSES)[number];

export const RECOMMENDATION_RISK_BOUNDARIES = [
  "normal",
  "sensitive_local_life",
  "care_welfare_mobility_boundary",
  "product_claim_boundary",
  "clinical_or_fortune_boundary",
] as const;

export type RecommendationRiskBoundary = (typeof RECOMMENDATION_RISK_BOUNDARIES)[number];

export type RecommendationGraphRule = {
  id: string;
  title: string;
  testId?: RecommendationSignalTestId;
  signalType?: RecommendationSignalType;
  interestId?: RecommendationInterestId;
  source?: RecommendationSignalSource;
  resultId?: string;
  productLayer: RecommendationProductLayer;
  opportunityCategory: RecommendationOpportunityCategory;
  recommendedFounderAction: string;
  defaultConfidenceTier: RecommendationConfidenceTier;
  defaultReviewStatus: RecommendationReviewStatus;
  riskBoundary: RecommendationRiskBoundary;
  why: string;
};

export const YORISOU_RECOMMENDATION_GRAPH_RULES: readonly RecommendationGraphRule[] = [
  {
    id: "report-interest",
    title: "深い自己理解レポート関心",
    interestId: "report-preview",
    signalType: "report_interest_clicked",
    productLayer: "report",
    opportunityCategory: "deepen_report",
    recommendedFounderAction: "全文レポート導線と保存意図を継続観察し、深掘りテーマ候補を整理する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "needs_more_signal",
    riskBoundary: "normal",
    why: "軽量テスト後にレポート深掘りの明確な関心が出ています。",
  },
  {
    id: "line-save-interest",
    title: "LINE継続導線関心",
    interestId: "line-save",
    signalType: "line_save_interest_clicked",
    productLayer: "line_companion",
    opportunityCategory: "create_content_resource",
    recommendedFounderAction: "あとで見返す導線と継続伴走の入口需要を観察する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "needs_more_signal",
    riskBoundary: "normal",
    why: "保存・再訪意図が強く、軽い伴走や整理資源への関心が見えています。",
  },
  {
    id: "select-interest",
    title: "Select候補の関心",
    interestId: "select-info",
    signalType: "select_interest_clicked",
    productLayer: "select",
    opportunityCategory: "validate_select_candidate",
    recommendedFounderAction: "読みもの・道具案内の需要仮説を候補単位で確認する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "needs_more_signal",
    riskBoundary: "normal",
    why: "今の状態に合う情報や道具の方向を知りたい意図です。",
  },
  {
    id: "design-interest",
    title: "Design候補の関心",
    interestId: "design-interest",
    signalType: "design_interest_clicked",
    productLayer: "design",
    opportunityCategory: "validate_design_candidate",
    recommendedFounderAction: "助かる案の要件を集めつつ、製品提供の約束に見えない表現を保つ",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "founder_review_candidate",
    riskBoundary: "product_claim_boundary",
    why: "具体的な助かる案への期待があり、過剰な製品約束に見せない注意が必要です。",
  },
  {
    id: "community-interest",
    title: "Community参加関心",
    interestId: "community-interest",
    signalType: "community_interest_clicked",
    productLayer: "community",
    opportunityCategory: "invite_feedback",
    recommendedFounderAction: "参加・共創の意図を整理し、声の集め方を小さく検証する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "needs_more_signal",
    riskBoundary: "normal",
    why: "試用・共創・声を送りたい意図が見えています。",
  },
  {
    id: "local-life-interest",
    title: "暮らしの困りごと関心",
    interestId: "local-life-interest",
    signalType: "local_life_interest_clicked",
    productLayer: "local_life",
    opportunityCategory: "local_life_research",
    recommendedFounderAction: "生活課題の声として扱い、研究メモに留めて慎重に観察する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "founder_review_candidate",
    riskBoundary: "care_welfare_mobility_boundary",
    why: "暮らし・移動・支え合いに関わるため、研究扱いを保つ必要があります。",
  },
  {
    id: "related-test-interest",
    title: "追加テスト探索",
    interestId: "related-test",
    signalType: "related_test_clicked",
    productLayer: "content_resource",
    opportunityCategory: "create_content_resource",
    recommendedFounderAction: "複数入口の導線設計と比較閲覧需要を観察する",
    defaultConfidenceTier: "low",
    defaultReviewStatus: "watch",
    riskBoundary: "normal",
    why: "別角度で自分を見たい探索行動です。",
  },
  {
    id: "local-life-completed",
    title: "暮らしの課題シグナル",
    testId: "local-life",
    signalType: "test_completed",
    productLayer: "local_life",
    opportunityCategory: "local_life_research",
    recommendedFounderAction: "生活課題のテーマ別に件数を見ながら、研究対象として慎重に整理する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "founder_review_candidate",
    riskBoundary: "care_welfare_mobility_boundary",
    why: "暮らしの困りごとに関する完了シグナルで、実サービス化ではなく研究優先です。",
  },
  {
    id: "local-life-public-value",
    title: "支え合いアイデア関心",
    testId: "local-life",
    signalType: "test_completed",
    resultId: "支え合いアイデアへの関心",
    productLayer: "public_value",
    opportunityCategory: "public_value_memo_candidate",
    recommendedFounderAction: "公共性の高いテーマとして、創業者メモに留めて調査仮説化する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "founder_review_candidate",
    riskBoundary: "care_welfare_mobility_boundary",
    why: "支え合い発想への関心は公共価値メモ候補ですが、提供約束には進めません。",
  },
  {
    id: "work-rhythm-completed",
    title: "仕事リズム完了シグナル",
    testId: "work-rhythm",
    signalType: "test_completed",
    productLayer: "report",
    opportunityCategory: "deepen_report",
    recommendedFounderAction: "仕事リズム起点で深掘りレポートや関連入口の相性を見る",
    defaultConfidenceTier: "low",
    defaultReviewStatus: "watch",
    riskBoundary: "normal",
    why: "日常の自己理解を深めたい方向の完了シグナルです。",
  },
  {
    id: "name-impression-completed",
    title: "名前印象完了シグナル",
    testId: "name-impression",
    signalType: "test_completed",
    productLayer: "content_resource",
    opportunityCategory: "create_content_resource",
    recommendedFounderAction: "短く読める見本や関連診断の導線強化候補として観察する",
    defaultConfidenceTier: "low",
    defaultReviewStatus: "watch",
    riskBoundary: "normal",
    why: "印象整理系の軽量コンテンツへの需要を示します。",
  },
  {
    id: "love-distance-completed",
    title: "恋愛距離感完了シグナル",
    testId: "love-distance",
    signalType: "test_completed",
    productLayer: "content_resource",
    opportunityCategory: "create_content_resource",
    recommendedFounderAction: "関係性の読みものや追加チェックへの関心を観察する",
    defaultConfidenceTier: "low",
    defaultReviewStatus: "watch",
    riskBoundary: "clinical_or_fortune_boundary",
    why: "関係性テーマは占い・断定に寄せず、読みもの範囲に留める必要があります。",
  },
  {
    id: "current-state-completed",
    title: "自己理解入口の完了",
    testId: "current-state",
    signalType: "test_completed",
    productLayer: "report",
    opportunityCategory: "deepen_report",
    recommendedFounderAction: "主要導線としてレポート深掘りと保存率を継続観察する",
    defaultConfidenceTier: "emerging",
    defaultReviewStatus: "needs_more_signal",
    riskBoundary: "normal",
    why: "中核入口として自己理解レポートへの橋渡し需要が見えます。",
  },
];
