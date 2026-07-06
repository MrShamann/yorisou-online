import type { RecommendationInterestId, YorisouTestId } from "./yorisouRecommendationSignals";

export type YorisouEntryMode = "live-diagnostic" | "light-check" | "interest-check" | "symbolic-check";

export type YorisouTestEntry = {
  id: YorisouTestId;
  title: string;
  category: string;
  status: string;
  mode: YorisouEntryMode;
  route: string;
  estimatedTime: string;
  hook: string;
  outcome: string;
  nextLayer: string;
  label: string;
  availableNow: boolean;
  allowedInterestActions: RecommendationInterestId[];
  trustBoundaryNote: string;
};

export const YORISOU_TEST_ENTRIES: readonly YorisouTestEntry[] = [
  {
    id: "current-state",
    title: "いまのあなたタイプ診断",
    category: "自分を知る",
    status: "公開中",
    mode: "live-diagnostic",
    route: "/open-testing",
    estimatedTime: "約3分",
    hook: "今の気分や人との向き合い方から、あなたの現在地を見つけます。",
    outcome: "今の状態タイプ、短い解説、LINE保存、レポートの見本、おすすめの入口",
    nextLayer: "結果ページから、レポート・LINE保存・別の入口へ続けられます。",
    label: "診断をはじめる",
    availableNow: true,
    allowedInterestActions: ["report-preview", "line-save", "related-test"],
    trustBoundaryNote: "医療・心理診断ではありません。今の状態を見るための入口です。",
  },
  {
    id: "love-distance",
    title: "恋愛の距離感診断",
    category: "恋愛・人間関係",
    status: "公開中",
    mode: "live-diagnostic",
    route: "/tests/love-distance",
    estimatedTime: "約3〜5分",
    hook: "近づきたい気持ちと、自分のペース。その間にある、あなたらしい距離感を見つけます。",
    outcome: "距離感タイプ、関係のリズム、レポート案内、次に整えたいこと",
    nextLayer: "答えを急がず、レポートや別の診断につなげられます。",
    label: "チェックを始める",
    availableNow: true,
    allowedInterestActions: ["report-preview", "line-save", "community-interest"],
    trustBoundaryNote: "相手の気持ちや関係の結論を決めるものではありません。",
  },
  {
    id: "work-rhythm",
    title: "仕事のリズム診断",
    category: "仕事・選び方",
    status: "公開中",
    mode: "light-check",
    route: "/tests/work-rhythm",
    estimatedTime: "約2〜3分",
    hook: "集中しやすい環境、疲れやすい関わり方、動き出しやすいペースを軽く整理します。",
    outcome: "仕事リズムタイプ、向きやすい環境、Select/Designにつながるヒント",
    nextLayer: "結果から、道具・読みもの・つくりたい案への関心を送れます。",
    label: "小さく試す",
    availableNow: true,
    allowedInterestActions: ["report-preview", "select-info", "design-interest", "line-save"],
    trustBoundaryNote: "適職や能力を断定するものではなく、今の仕事リズムを見る入口です。",
  },
  {
    id: "name-impression",
    title: "名前の印象チェック",
    category: "名前・象徴チェック",
    status: "公開中",
    mode: "symbolic-check",
    route: "/tests/name-impression",
    estimatedTime: "約2〜3分",
    hook: "名前から受ける印象をきっかけに、自分らしさの見え方を軽く振り返ります。",
    outcome: "印象の方向、自己紹介のヒント、関連する診断の入口",
    nextLayer: "自分らしさの見え方から、別の入口やレポートの見本につなげられます。",
    label: "印象を見てみる",
    availableNow: true,
    allowedInterestActions: ["related-test", "report-preview", "line-save", "community-interest"],
    trustBoundaryNote: "運命や相性を占うものではありません。見え方を整理する小さな入口です。",
  },
  {
    id: "local-life",
    title: "暮らしの関心チェック",
    category: "暮らし・地域",
    status: "公開中",
    mode: "interest-check",
    route: "/tests/local-life",
    estimatedTime: "約2分",
    hook: "生活リズム、気持ちの戻り方、人との距離感、小さな次の一歩を、今の関心として軽く整理します。",
    outcome: "今の関心テーマ、受け取りたい案内、次に見たい入口",
    nextLayer: "サービス提供の約束ではなく、今の関心を次の案内や改善につなげる入口です。",
    label: "関心を整理する",
    availableNow: true,
    allowedInterestActions: ["local-life-interest", "community-interest", "design-interest"],
    trustBoundaryNote: "生活支援や専門サービスの提供ではなく、今の関心や戻り方を整理する入口です。",
  },
] as const;
