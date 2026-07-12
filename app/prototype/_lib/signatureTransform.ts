// Prototype-only deterministic transformer. NOT a real model, NOT a provider
// call, NOT persisted to any production store. Maps a rough one-line entry to
// three controllable layers. Session/local state only.

export type SignatureResult = {
  privateMemo: string;
  shareTitle: string;
  shareBody: string;
  removedHints: string[];
  action: string;
  actionTime: string;
  actionDifficulty: string;
  actionReason: string;
};

type Rule = {
  match: RegExp;
  build: (raw: string) => SignatureResult;
};

// De-identification: strip obvious personal/location markers for the share-safe layer.
const IDENTIFIER_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /[一-龯ぁ-ん]{2,4}(さん|くん|ちゃん|先輩|部長|課長|上司)/g, label: "相手の呼び名" },
  { re: /(会社|職場|学校|部署|チーム|バイト先)/g, label: "所属先" },
  { re: /(東京|大阪|名古屋|福岡|札幌|駅|店)/g, label: "場所" },
  { re: /\d{1,2}時/g, label: "具体的な時刻" },
];

function deidentify(raw: string): { text: string; removed: string[] } {
  const removed: string[] = [];
  let text = raw;
  for (const { re, label } of IDENTIFIER_PATTERNS) {
    if (re.test(text)) {
      removed.push(label);
      text = text.replace(re, "");
    }
  }
  return { text: text.replace(/\s+/g, " ").trim(), removed };
}

const RULES: Rule[] = [
  {
    // SNS / 夜 / 疲れ
    match: /(sns|snsを|スマホ|夜.*疲|疲.*夜|通知)/i,
    build: (raw) => {
      const { removed } = deidentify(raw);
      return {
        privateMemo: "夜にSNSを見続けて疲れた。返信も気になり続けている。",
        shareTitle: "返信を夜にまとめたら、昼の疲れが少し減った",
        shareBody:
          "通知が気になり続けるとき、返信する時間を夜にまとめてみました。日中に戻りやすくなりました。",
        removedHints: removed.length ? removed : ["個人が特定できる表現"],
        action: "今夜30分だけ、返信を見ない時間をつくる",
        actionTime: "約30分",
        actionDifficulty: "とても軽い",
        actionReason: "「通知が気になり続ける」に、いちばん小さく効きやすいからです。",
      };
    },
  },
  {
    // 返信 / 溜め / 連絡
    match: /(返信|連絡|メッセージ|既読|溜め)/,
    build: (raw) => {
      const { removed } = deidentify(raw);
      return {
        privateMemo: "返信が溜まっていて、返さなきゃという気持ちが重くなっている。",
        shareTitle: "返信を「短く・あとで」に決めたら、少し軽くなった",
        shareBody:
          "全部にすぐ返そうとすると重くなるので、短く返す・あとでまとめて返す、と自分の中で決めました。",
        removedHints: removed.length ? removed : ["やり取りの相手が分かる表現"],
        action: "返信をひとつだけ、短く返してみる",
        actionTime: "約5分",
        actionDifficulty: "とても軽い",
        actionReason: "「全部返さなきゃ」の負担を、一件だけに小さくするためです。",
      };
    },
  },
  {
    // 断れない / 予定 / 誘い
    match: /(断れ|誘い|予定|頼まれ|付き合)/,
    build: (raw) => {
      const { removed } = deidentify(raw);
      return {
        privateMemo: "断りにくくて予定を入れてしまい、あとで少し後悔している。",
        shareTitle: "「一度持ち帰る」と決めたら、断りやすくなった",
        shareBody:
          "その場で返事をせず「一度持ち帰って考えます」と伝える言い方を用意しておきました。無理な予定が減りました。",
        removedHints: removed.length ? removed : ["相手や場所が分かる表現"],
        action: "次の誘いは、その場で決めず「持ち帰る」と伝える",
        actionTime: "約1分",
        actionDifficulty: "軽い",
        actionReason: "「その場で断れない」を、断らずに保留へ変えるためです。",
      };
    },
  },
];

const FALLBACK: Rule["build"] = (raw) => {
  const { removed } = deidentify(raw);
  const memo = raw.trim().length <= 60 ? raw.trim() : `${raw.trim().slice(0, 58)}…`;
  return {
    privateMemo: memo || "今日、少し引っかかったことがあった。",
    shareTitle: "今日の引っかかりを、ひとつ言葉にしてみた",
    shareBody: "うまく言えないもやもやを、短く書き出してみました。書くだけでも少し整理されました。",
    removedHints: removed.length ? removed : ["個人が特定できる表現"],
    action: "今日は、この一行を残すだけにする",
    actionTime: "約1分",
    actionDifficulty: "とても軽い",
    actionReason: "無理に解決しようとせず、まず残すことを大切にするためです。",
  };
};

export function transformEntry(raw: string): SignatureResult {
  const rule = RULES.find((r) => r.match.test(raw));
  return (rule ? rule.build : FALLBACK)(raw);
}

export const PROCESSING_STEPS = [
  "受け取りました",
  "内容を整理しています",
  "共有しても安全な表現を分けています",
  "今日できる小さな一歩を考えています",
] as const;

export const SIGNATURE_EXAMPLE = "夜のSNSで疲れて、返信も溜めてしまいました。";

export const SIGNATURE_CHIPS = [
  "夜のSNSで疲れて、返信も溜めてしまいました。",
  "断れずに予定を入れてしまった。",
  "返信が溜まって、気になり続けている。",
] as const;
