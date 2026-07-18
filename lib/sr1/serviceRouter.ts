// SR-1 — service router (deterministic, explainable, testable).
//
// The router begins from ORDINARY user needs (not internal test names) and maps
// each need — plus a minimal pace/returning signal — to a real, working
// destination and one or two alternatives. Every destination explains WHY it is
// suggested, HOW LONG it takes, WHAT the visitor will receive, whether data
// STAYS ON THE DEVICE, and whether LOGIN IS OPTIONAL (§8.3). The routing logic
// is a pure function so it is fully unit-testable and never depends on an opaque
// classifier (§8.2). No AI classification is a launch dependency.

import type { GuestNeedId, GuestPace } from "./guestJourney";

export type ServiceStatus = "current" | "prototype";

export type ServiceDestinationId =
  | "quick-reflection"
  | "full-check"
  | "relationship-check"
  | "love-distance-check"
  | "work-rhythm-check"
  | "local-life-check"
  | "name-impression-check"
  | "recommendations"
  | "experiences"
  | "reports"
  | "return-home";

export type ServiceDestination = {
  id: ServiceDestinationId;
  title: string;
  href: string;
  estimatedTime: string;
  why: string; // why this fits the stated need (filled per-need at route time)
  receive: string; // what the visitor will receive
  dataStaysOnDevice: boolean;
  loginOptional: boolean; // true = no login required to get value
  status: ServiceStatus;
};

// Base destination definitions — real routes only. `why` is a default that the
// router overrides with a need-specific reason.
const DESTINATIONS: Record<ServiceDestinationId, ServiceDestination> = {
  "quick-reflection": {
    id: "quick-reflection",
    title: "2分の振り返り",
    href: "/experiences/guided/grounding-reflection",
    estimatedTime: "約2分",
    why: "考え込まずに、今の気持ちの置き場所を見つけられます。",
    receive: "今の状態のやさしい言語化と、次に選べる小さな一歩",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  "full-check": {
    id: "full-check",
    title: "いま色テスト（120問）",
    href: "/check-in",
    estimatedTime: "約12分",
    why: "今の状態をひととおり見て、続く支援につなげたいときに。",
    receive: "今のあなたの現在地（いま色）と、あなた向けの支援プラン",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  "relationship-check": {
    id: "relationship-check",
    title: "人間関係の疲れチェック",
    href: "/tests/relationship-fatigue",
    estimatedTime: "約3〜5分",
    why: "会う・返す・合わせるのどこに負担が出ているかを整理できます。",
    receive: "今の負担のかかり方と、距離感を整える次の一歩",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  "love-distance-check": {
    id: "love-distance-check",
    title: "恋愛の距離感チェック",
    href: "/tests/love-distance",
    estimatedTime: "約3〜5分",
    why: "近づきたい気持ちと自分のペースの間を見直せます。",
    receive: "距離感のタイプと、関係のリズムを整えるヒント",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  "work-rhythm-check": {
    id: "work-rhythm-check",
    title: "仕事のリズムチェック",
    href: "/tests/work-rhythm",
    estimatedTime: "約2〜3分",
    why: "集中しやすい環境や疲れやすいペースを軽く整理できます。",
    receive: "今の仕事リズムと、動きやすい環境の方向",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  "local-life-check": {
    id: "local-life-check",
    title: "暮らしの関心チェック",
    href: "/tests/local-life",
    estimatedTime: "約2分",
    why: "生活リズムや小さな次の一歩を、今の関心として整理できます。",
    receive: "今の関心テーマと、受け取りたい案内の方向",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  "name-impression-check": {
    id: "name-impression-check",
    title: "名前の印象チェック",
    href: "/tests/name-impression",
    estimatedTime: "約2〜3分",
    why: "自分らしさの見え方を、軽く振り返れます。",
    receive: "印象の方向と、自己紹介のヒント",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  recommendations: {
    id: "recommendations",
    title: "今のあなたに合うヒント",
    href: "/recommendations",
    estimatedTime: "約1分",
    why: "理由つきで、次に試しやすい選択肢を少しだけ見つけられます。",
    receive: "今の状態に合う、理由つきの次の一歩（表示順は買えません）",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  experiences: {
    id: "experiences",
    title: "試せる体験",
    href: "/experiences",
    estimatedTime: "約2〜5分",
    why: "読むだけでなく、小さく試して気持ちを動かせます。",
    receive: "その場でできる小さな体験と、続けかたの選択肢",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  reports: {
    id: "reports",
    title: "深めるレポート",
    href: "/reports",
    estimatedTime: "約5分",
    why: "無料結果より少し具体的に、今の動き方を読み直せます。",
    receive: "今の状態を静かに読み直す読みもの（公開プレビューあり）",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
  "return-home": {
    id: "return-home",
    title: "前回の続き（マイよりそう）",
    href: "/my-yorisou",
    estimatedTime: "すぐ",
    why: "保存した状態やヒントから、続きを選べます。",
    receive: "前回の現在地・保存したもの・次の一歩",
    dataStaysOnDevice: true,
    loginOptional: true,
    status: "current",
  },
};

export type ServiceNeed = {
  id: GuestNeedId;
  label: string; // ordinary-language, what the user says
  helper: string;
};

// The ordinary-language needs the router opens with (§8.1). No test names, no
// internal domain taxonomy, no result taxonomy, no "do you want a report".
export const SERVICE_NEEDS: readonly ServiceNeed[] = [
  { id: "organize-self", label: "今の自分を整理したい", helper: "気持ちや状態をまとめて見てみる" },
  { id: "where-to-start", label: "何から始めればいいか分からない", helper: "まず軽い一歩から" },
  { id: "relationship-distance", label: "人との距離感を見直したい", helper: "会う・返す・合わせるの負担を整理" },
  { id: "work-life-rhythm", label: "仕事や生活のリズムを整えたい", helper: "疲れにくいペースを見直す" },
  { id: "shift-mood", label: "少し気持ちを切り替えたい", helper: "その場でできる小さな切り替え" },
  { id: "find-fit", label: "自分に合う情報や体験を見つけたい", helper: "理由つきの次の一歩" },
  { id: "continue-previous", label: "前回の続きから始めたい", helper: "保存した状態から続ける" },
] as const;

export type ServiceRouteInput = {
  need: GuestNeedId;
  pace?: GuestPace; // "quick" prefers short paths; "deep" prefers the full check
  returning?: boolean; // has an existing saved state to continue
  hasResult?: boolean; // a completed result already exists on this device
};

export type ServiceRoute = {
  primary: ServiceDestination;
  alternatives: ServiceDestination[];
  note: string; // one honest line about the route
};

function withReason(id: ServiceDestinationId, why: string): ServiceDestination {
  return { ...DESTINATIONS[id], why };
}

// Pure, deterministic routing. Same input → same output. Fully unit-testable.
export function routeService(input: ServiceRouteInput): ServiceRoute {
  const quick = input.pace !== "deep";
  const returning = Boolean(input.returning || input.hasResult);

  switch (input.need) {
    case "continue-previous":
      return {
        primary: withReason("return-home", "保存した状態やヒントから、そのまま続きを選べます。"),
        alternatives: [withReason("full-check", "状態が変わっていれば、もう一度見直せます。")],
        note: "続きはこの端末に保存された範囲から始まります。",
      };

    case "relationship-distance":
      return {
        primary: withReason("relationship-check", "会う・返す・合わせるのどこに負担が出ているかを、今の状態として整理できます。"),
        alternatives: [
          withReason("love-distance-check", "恋愛や親密さの距離感を見たいときはこちら。"),
          withReason("full-check", "人との距離も含めて、全体を見たいときに。"),
        ],
        note: "相手の気持ちや関係の結論を決めるものではありません。",
      };

    case "work-life-rhythm":
      return {
        primary: withReason("work-rhythm-check", "集中しやすい環境や疲れやすいペースを、今のリズムとして軽く整理できます。"),
        alternatives: [
          withReason("local-life-check", "生活リズムや暮らしの関心から見たいときはこちら。"),
          withReason("quick-reflection", "まず一息つきたいときは、2分の振り返りから。"),
        ],
        note: "適職や能力を断定するものではありません。今のリズムを見る入口です。",
      };

    case "shift-mood":
      return {
        primary: withReason("quick-reflection", "考え込まずに、今の気持ちの置き場所を見つけられます。"),
        alternatives: [
          withReason("experiences", "他の小さな体験も試したいときに。"),
          withReason("full-check", "落ち着いたら、今の状態をひととおり見てみるのも。"),
        ],
        note: "この振り返りはこの端末だけで完結します。ログインは要りません。",
      };

    case "find-fit":
      return returning
        ? {
            primary: withReason("recommendations", "今のあなたの状態から、理由つきで次に試しやすいものを見つけられます。"),
            alternatives: [
              withReason("experiences", "読むだけでなく、小さく試したいときに。"),
              withReason("reports", "もう少し深く読みたいときに。"),
            ],
            note: "表示順は買えません。合わないものは「今は違う」で調整できます。",
          }
        : {
            primary: withReason("quick-reflection", "まず今の状態を少し見てから、合うものを探すと精度が上がります。"),
            alternatives: [
              withReason("recommendations", "先にヒント一覧を見たいときはこちら。"),
              withReason("experiences", "小さく試せる体験から入るのも。"),
            ],
            note: "少し状態を教えてくれるほど、届くものがあなたに近づきます。",
          };

    case "where-to-start":
      return {
        primary: withReason("quick-reflection", "まずは2分の振り返りから。ここで迷いを少し軽くできます。"),
        alternatives: [
          withReason("full-check", "もう少し腰を据えて見たいときは、いま色テストへ。"),
          withReason("recommendations", "先に次の一歩の候補を見たいときに。"),
        ],
        note: "どれも無料・ログインなしで、この端末だけで始められます。",
      };

    case "organize-self":
    default:
      return quick
        ? {
            primary: withReason("quick-reflection", "まず2分で、今の気持ちを言葉にできます。"),
            alternatives: [
              withReason("full-check", "しっかり整理したくなったら、いま色テストへ。"),
              withReason("recommendations", "次の一歩の候補も見られます。"),
            ],
            note: "短い一歩から始めて、続きはいつでも選べます。",
          }
        : {
            primary: withReason("full-check", "今の状態をひととおり見て、あなた向けの支援プランにつなげられます。"),
            alternatives: [
              withReason("quick-reflection", "時間がないときは、2分の振り返りから。"),
              withReason("reports", "結果のあと、もう少し深く読みたいときに。"),
            ],
            note: "途中で閉じても、この端末に進み具合が残ります。",
          };
  }
}

export function getDestination(id: ServiceDestinationId): ServiceDestination {
  return DESTINATIONS[id];
}
