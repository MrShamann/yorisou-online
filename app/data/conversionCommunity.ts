export type ModuleId = "relationship-fatigue" | "love-distance";

export type CommunityVoice = { text: string };

export type ReportPreviewData = {
  reportName: string;
  headline: string;
  teaserText: string;
  lockedSections: readonly string[];
  limitationNote: string;
  noFearCta: string;
};

export type NextCheckLink = {
  href: string;
  label: string;
  hint: string;
};

export type ModuleConversionData = {
  communityVoices: readonly CommunityVoice[];
  reportPreview: ReportPreviewData;
  nextChecks: readonly NextCheckLink[];
  lineSaveCopy: string;
};

export const CONVERSION_DATA: Record<ModuleId, ModuleConversionData> = {
  "relationship-fatigue": {
    communityVoices: [
      { text: "人が嫌いなわけではなくても、返すことや合わせることが重い日がある。" },
      { text: "会ったあとは楽しかったのに、帰ってからどっと疲れることがある。" },
      { text: "断るほどではないけれど、少し予定を減らしたい時期がある。" },
    ],
    reportPreview: {
      reportName: "人間関係の疲れを深く読むレポート",
      headline: "返信・予定・気づかいの負担を小さく分けて見ます。",
      teaserText: "人間関係を切るためではなく、今どこに負担が出ているかを整理するレポートです。必要なときに、自分のペースで読めます。",
      lockedSections: [
        "今の人間関係疲れの中心",
        "返信・予定・気づかいの負担",
        "距離を整えたいサイン",
        "回復しやすい関わり方",
        "7日間の小さな回復アクション",
      ],
      limitationNote: "このレポートは医療的・専門的判断、対人関係の専門助言ではありません。相手を評価したり、関係の結論を決めたりするものではありません。",
      noFearCta: "疲れをもう少し分けて読みたいときに",
    },
    nextChecks: [
      { href: "/tests/love-distance", label: "恋愛距離感チェック", hint: "恋愛の距離感も気になる方へ" },
      { href: "/check-in", label: "今の自分チェック", hint: "今の状態を広く見たい方へ" },
    ],
    lineSaveCopy: "結果をあとで見返しやすくする",
  },
  "love-distance": {
    communityVoices: [
      { text: "返事を待つ時間に、自分の気持ちまで揺れてしまうことがある。" },
      { text: "近づきたいけれど、急ぎすぎるのも少し怖い。" },
      { text: "伝える前に、まず自分の言葉を整えたいときがある。" },
    ],
    reportPreview: {
      reportName: "恋愛の距離感を深く読むレポート",
      headline: "待ち方、距離感、伝える前に整えたいことを整理します。",
      teaserText: "相手の気持ちを読むものではなく、あなた自身の距離感を整理するレポートです。連絡や関係の結論を急がず、今の自分を少し落ち着いて見たいときに。",
      lockedSections: [
        "今の恋愛距離感の中心",
        "待っている時間の重さ",
        "近づきたい気持ちと自分の余白",
        "伝える前に整えたい言葉",
        "7日間の小さな選択肢",
      ],
      limitationNote: "このレポートは相手の本心、関係の結論、将来の結果を判断するものではありません。",
      noFearCta: "伝える前に、自分の距離感をもう少し読む",
    },
    nextChecks: [
      { href: "/tests/relationship-fatigue", label: "人間関係の疲れチェック", hint: "恋愛以外の人間関係も少し疲れている方へ" },
      { href: "/check-in", label: "今の自分チェック", hint: "今の状態を広く見たい方へ" },
    ],
    lineSaveCopy: "今の距離感をあとで見返しやすくする",
  },
};
