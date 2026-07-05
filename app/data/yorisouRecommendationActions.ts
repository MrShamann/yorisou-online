import type {
  RecommendationActionId,
  RecommendationInterestId,
  RecommendationMode,
  RecommendationSignalTestId,
  RecommendationSignalType,
} from "@/lib/server/relationship-intelligence/types";
import type { RecommendationProductLayer, RecommendationRiskBoundary } from "@/app/data/yorisouRecommendationGraph";

export const RECOMMENDATION_ACTION_TYPES = [
  "start_related_test",
  "view_report_sample",
  "save_to_line",
  "view_select_hint",
  "send_design_interest",
  "send_community_interest",
  "send_local_life_signal",
  "read_content_resource",
  "no_action_safe_fallback",
] as const;

export type RecommendationActionType = (typeof RECOMMENDATION_ACTION_TYPES)[number];

export type RecommendationActionContext = {
  testId: RecommendationSignalTestId;
  resultId?: string | null;
  mode: RecommendationMode;
};

export type RecommendationActionDefinition = {
  id: RecommendationActionId;
  title: string;
  description: string;
  actionType: RecommendationActionType;
  productLayer: RecommendationProductLayer;
  riskBoundary: RecommendationRiskBoundary;
  buildHref: (context: RecommendationActionContext) => string;
  legacyInterestId?: RecommendationInterestId;
  legacySignalType?: RecommendationSignalType;
  relatedTestId?: RecommendationSignalTestId;
};

export const YORISOU_RECOMMENDATION_ACTIONS: Record<RecommendationActionId, RecommendationActionDefinition> = {
  "report-preview-sample": {
    id: "report-preview-sample",
    title: "レポートの見本を見る",
    description: "今の整理をもう少し深く読む入口です。",
    actionType: "view_report_sample",
    productLayer: "report",
    riskBoundary: "normal",
    buildHref: () => "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low",
    legacyInterestId: "report-preview",
    legacySignalType: "report_interest_clicked",
  },
  "line-save-entry": {
    id: "line-save-entry",
    title: "LINEで保存する",
    description: "あとで見返したいときの入口です。",
    actionType: "save_to_line",
    productLayer: "line_companion",
    riskBoundary: "normal",
    buildHref: () => "/line/mini-app",
    legacyInterestId: "line-save",
    legacySignalType: "line_save_interest_clicked",
  },
  "select-hint": {
    id: "select-hint",
    title: "Yorisou Select の案内を見る",
    description: "今の状態に合いそうな読みものや道具の方向を確認できます。",
    actionType: "view_select_hint",
    productLayer: "select",
    riskBoundary: "normal",
    buildHref: () => "/#yorisou-select",
    legacyInterestId: "select-info",
    legacySignalType: "select_interest_clicked",
  },
  "design-interest-entry": {
    id: "design-interest-entry",
    title: "Design の関心を送る",
    description: "あると助かる案を小さく伝える入口です。",
    actionType: "send_design_interest",
    productLayer: "design",
    riskBoundary: "product_claim_boundary",
    buildHref: () => "/contact?topic=design-interest",
    legacyInterestId: "design-interest",
    legacySignalType: "design_interest_clicked",
  },
  "community-interest-entry": {
    id: "community-interest-entry",
    title: "Community の関心を送る",
    description: "試用や声を送りたいときの入口です。",
    actionType: "send_community_interest",
    productLayer: "community",
    riskBoundary: "normal",
    buildHref: () => "/contact?topic=community-interest",
    legacyInterestId: "community-interest",
    legacySignalType: "community_interest_clicked",
  },
  "local-life-signal-entry": {
    id: "local-life-signal-entry",
    title: "暮らしの声を送る",
    description: "生活の困りごとや関心を短く整理して送る入口です。",
    actionType: "send_local_life_signal",
    productLayer: "local_life",
    riskBoundary: "care_welfare_mobility_boundary",
    buildHref: () => "/tests/local-life",
    legacyInterestId: "local-life-interest",
    legacySignalType: "local_life_interest_clicked",
  },
  "test-love-distance": {
    id: "test-love-distance",
    title: "恋愛の距離感チェックを見る",
    description: "関係の近さや待ち方を別の角度から整理できます。",
    actionType: "start_related_test",
    productLayer: "content_resource",
    riskBoundary: "clinical_or_fortune_boundary",
    buildHref: () => "/tests/love-distance",
    legacyInterestId: "related-test",
    legacySignalType: "related_test_clicked",
    relatedTestId: "love-distance",
  },
  "test-work-rhythm": {
    id: "test-work-rhythm",
    title: "仕事のリズム診断を見る",
    description: "動きやすい環境や今の仕事リズムを軽く整理できます。",
    actionType: "start_related_test",
    productLayer: "content_resource",
    riskBoundary: "normal",
    buildHref: () => "/tests/work-rhythm",
    legacyInterestId: "related-test",
    legacySignalType: "related_test_clicked",
    relatedTestId: "work-rhythm",
  },
  "test-name-impression": {
    id: "test-name-impression",
    title: "名前の印象チェックを見る",
    description: "見え方の輪郭を軽く整理する入口です。",
    actionType: "start_related_test",
    productLayer: "content_resource",
    riskBoundary: "normal",
    buildHref: () => "/tests/name-impression",
    legacyInterestId: "related-test",
    legacySignalType: "related_test_clicked",
    relatedTestId: "name-impression",
  },
  "test-local-life": {
    id: "test-local-life",
    title: "暮らしの困りごとを整理する",
    description: "生活の声や地域の困りごとを整理する入口です。",
    actionType: "start_related_test",
    productLayer: "local_life",
    riskBoundary: "care_welfare_mobility_boundary",
    buildHref: () => "/tests/local-life",
    legacyInterestId: "related-test",
    legacySignalType: "related_test_clicked",
    relatedTestId: "local-life",
  },
  "open-testing-guide": {
    id: "open-testing-guide",
    title: "公開テストの案内を見る",
    description: "今の公開範囲や進め方を先に確認できます。",
    actionType: "no_action_safe_fallback",
    productLayer: "content_resource",
    riskBoundary: "normal",
    buildHref: () => "/open-testing",
  },
};

export function getRecommendationActionDefinition(actionId: RecommendationActionId) {
  return YORISOU_RECOMMENDATION_ACTIONS[actionId];
}
