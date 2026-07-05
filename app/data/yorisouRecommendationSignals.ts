export const YORISOU_TEST_IDS = [
  "current-state",
  "love-distance",
  "work-rhythm",
  "name-impression",
  "local-life",
] as const;

export type YorisouTestId = (typeof YORISOU_TEST_IDS)[number];

export const RECOMMENDATION_SIGNAL_TYPES = [
  "test_started",
  "test_completed",
  "recommendation_package_shown",
  "recommendation_action_clicked",
  "return_surface_viewed",
  "return_recommendation_shown",
  "return_recommendation_clicked",
  "companion_card_viewed",
  "companion_cta_clicked",
  "companion_line_return_clicked",
  "companion_return_block_viewed",
  "companion_question_answered",
  "companion_option_clicked",
  "companion_subscription_interest_clicked",
  "companion_subscription_not_now_clicked",
  "recommendation_interest_clicked",
  "report_interest_clicked",
  "select_interest_clicked",
  "design_interest_clicked",
  "community_interest_clicked",
  "local_life_interest_clicked",
  "line_save_interest_clicked",
  "related_test_clicked",
] as const;

export type RecommendationSignalType = (typeof RECOMMENDATION_SIGNAL_TYPES)[number];

export const RECOMMENDATION_SIGNAL_SOURCES = [
  "tests_page",
  "open_testing_page",
  "companion_card",
  "line_mini_app",
  "love_distance_flow",
  "work_rhythm_flow",
  "name_impression_flow",
  "local_life_flow",
  "result_page",
  "report_preview_page",
  "full_report_page",
] as const;

export type RecommendationSignalSource = (typeof RECOMMENDATION_SIGNAL_SOURCES)[number];

export const RECOMMENDATION_INTEREST_IDS = [
  "report-preview",
  "line-save",
  "related-test",
  "select-info",
  "design-interest",
  "community-interest",
  "local-life-interest",
] as const;

export type RecommendationInterestId = (typeof RECOMMENDATION_INTEREST_IDS)[number];

export const RECOMMENDATION_ACTION_IDS = [
  "report-preview-sample",
  "line-save-entry",
  "select-hint",
  "design-interest-entry",
  "community-interest-entry",
  "local-life-signal-entry",
  "test-love-distance",
  "test-work-rhythm",
  "test-name-impression",
  "test-local-life",
  "open-testing-guide",
] as const;

export type RecommendationActionId = (typeof RECOMMENDATION_ACTION_IDS)[number];

export const RECOMMENDATION_ACTION_ROLES = [
  "primary",
  "secondary",
  "suppressed",
] as const;

export type RecommendationActionRole = (typeof RECOMMENDATION_ACTION_ROLES)[number];

export const RECOMMENDATION_MODES = [
  "immediate_result",
  "return_session",
  "line_save",
  "local_life_inquiry",
  "select_design_interest",
] as const;

export type RecommendationMode = (typeof RECOMMENDATION_MODES)[number];

export type RecommendationNextAction = {
  id: RecommendationInterestId;
  title: string;
  description: string;
  href: string;
  signalType: RecommendationSignalType;
};

export const RECOMMENDATION_NEXT_ACTIONS: Record<RecommendationInterestId, RecommendationNextAction> = {
  "report-preview": {
    id: "report-preview",
    title: "レポートの見本を見る",
    description: "今の整理を、もう少し深く読む入口です。",
    href: "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low",
    signalType: "report_interest_clicked",
  },
  "line-save": {
    id: "line-save",
    title: "LINEで保存する",
    description: "あとで見返しやすい入口につなげます。",
    href: "/line/mini-app",
    signalType: "line_save_interest_clicked",
  },
  "related-test": {
    id: "related-test",
    title: "関連する診断を見る",
    description: "別の角度から今の状態を見直せます。",
    href: "/tests",
    signalType: "related_test_clicked",
  },
  "select-info": {
    id: "select-info",
    title: "Yorisou Select の案内を見る",
    description: "今の状態に合いそうな読みものや道具の方向を確認できます。",
    href: "/#yorisou-select",
    signalType: "select_interest_clicked",
  },
  "design-interest": {
    id: "design-interest",
    title: "Yorisou Design に関心を送る",
    description: "あると助かるものの案を育てる入口です。",
    href: "/contact?topic=design-interest",
    signalType: "design_interest_clicked",
  },
  "community-interest": {
    id: "community-interest",
    title: "Community / Co-creation に関心を送る",
    description: "試用やフィードバック参加の入口です。",
    href: "/contact?topic=community-interest",
    signalType: "community_interest_clicked",
  },
  "local-life-interest": {
    id: "local-life-interest",
    title: "暮らしの困りごとを送る",
    description: "生活の声や地域の困りごとを送る入口です。",
    href: "/tests/local-life",
    signalType: "local_life_interest_clicked",
  },
};
