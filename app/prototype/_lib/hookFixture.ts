// Prototype-only fixture. Not a model, not a provider call, not persisted to
// production. Deterministic mapping from scenario + optional correction to an
// AI "revelation" + one small experiment + a return reason.

export type ScenarioId = "reply" | "recover" | "tired";

export const SCENARIOS: { id: ScenarioId; text: string }[] = [
  { id: "reply", text: "返信しなきゃと思いながら、開けずにいる" },
  { id: "recover", text: "人に会ったあと、一人で回復する時間が長い" },
  { id: "tired", text: "予定は多くないのに、なぜかずっと疲れている" },
];

// Each revelation is split into lines for sentence-by-sentence reveal.
export type Revelation = {
  lines: string[];
  experiment: string;
  experimentTime: string;
  experimentWhy: string;
  returnCheck: string;
};

export const BASE_REVELATION: Record<ScenarioId, Revelation> = {
  reply: {
    lines: [
      "疲れているのは、予定の数より、",
      "「まだ返していないこと」を",
      "頭の中で持ち続けているからかもしれません。",
    ],
    experiment: "今夜、返信する相手を一人だけ決める",
    experimentTime: "2分",
    experimentWhy: "「全部返さなきゃ」を、一人分まで小さくするためです。",
    returnCheck: "頭の重さが少し軽くなったか",
  },
  recover: {
    lines: [
      "回復に時間がかかるのは、弱さではなく、",
      "人といる間に、無意識に気を配り続けて",
      "いるからかもしれません。",
    ],
    experiment: "次に人と会う前に、そのあとの30分を空けておく",
    experimentTime: "予定を組むだけ",
    experimentWhy: "会ったあとに戻る時間を、先に確保するためです。",
    returnCheck: "戻りやすさが変わったか",
  },
  tired: {
    lines: [
      "疲れの原因は、していることより、",
      "「やめられていないこと」の方に",
      "あるのかもしれません。",
    ],
    experiment: "今日ひとつだけ、やめてもいいことを決める",
    experimentTime: "1分",
    experimentWhy: "足すより減らす方が、今の状態に合いやすいからです。",
    returnCheck: "軽くなった感じがあったか",
  },
};

// Correction options shown when the user says "少し違う" (reply scenario focus,
// but reused for all with scenario-appropriate wording via CORRECTION_LABELS).
export type CorrectionId = "weight" | "reaction" | "postpone";

export const CORRECTION_OPTIONS: { id: CorrectionId; label: string }[] = [
  { id: "weight", label: "返事そのものが重い" },
  { id: "reaction", label: "相手の反応を考え続ける" },
  { id: "postpone", label: "後回しにしたことが気になる" },
];

// Adjusted revelations after a correction is chosen.
export const ADJUSTED_REVELATION: Record<CorrectionId, Revelation> = {
  weight: {
    lines: [
      "返事が重いのは、内容ではなく、",
      "「ちょうどいい返し方」を探す時間に",
      "エネルギーが使われているのかもしれません。",
    ],
    experiment: "次の返信は、一言だけで送ってみる",
    experimentTime: "1分",
    experimentWhy: "「ちょうどよさ」を探すのを、一度やめてみるためです。",
    returnCheck: "送るときの重さが変わったか",
  },
  reaction: {
    lines: [
      "気になっているのは返信そのものより、",
      "「相手がどう受け取るか」を",
      "先に想像し続けることかもしれません。",
    ],
    experiment: "返信を送ったら、その画面を一度閉じる",
    experimentTime: "すぐ",
    experimentWhy: "反応を待ち続ける時間を、短くするためです。",
    returnCheck: "送ったあとの気の残り方が変わったか",
  },
  postpone: {
    lines: [
      "気になっているのは返信ではなく、",
      "「後回しにした」という感覚が",
      "残り続けていることかもしれません。",
    ],
    experiment: "後回しにした一件だけ、今日中に区切りをつける",
    experimentTime: "3分",
    experimentWhy: "残っている感覚を、一件だけ手放すためです。",
    returnCheck: "引っかかりが減ったか",
  },
};
