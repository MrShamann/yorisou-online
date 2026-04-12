export type CompanionCheckResultKey = "watchful" | "organizing" | "action" | "reassurance";

export type CompanionCheckOption = {
  id: string;
  label: string;
  resultKey: CompanionCheckResultKey;
};

export type CompanionCheckQuestion = {
  id: string;
  prompt: string;
  helperText: string;
  options: CompanionCheckOption[];
};

export type CompanionCheckResult = {
  key: CompanionCheckResultKey;
  title: string;
  summary: string;
  insight: string;
  nextStep: string;
  teaser: string;
  shareCopy: string;
};

export const companionCheckQuestions: CompanionCheckQuestion[] = [
  {
    id: "support-style",
    prompt: "誰かを支えるとき、いちばん自然なのは？",
    helperText: "いまの寄り添い方を、直感でひとつ選んでください。",
    options: [
      { id: "watchful", label: "そっと見守る", resultKey: "watchful" },
      { id: "organizing", label: "順序を整える", resultKey: "organizing" },
      { id: "action", label: "すぐ一緒に動く", resultKey: "action" },
      { id: "reassurance", label: "安心を確かめる", resultKey: "reassurance" },
    ],
  },
  {
    id: "messy-moment",
    prompt: "話がまとまっていないとき、まずしたいのは？",
    helperText: "最初にやりやすい動きを選んでください。",
    options: [
      { id: "watchful", label: "落ち着いて様子を見る", resultKey: "watchful" },
      { id: "organizing", label: "要点を整理する", resultKey: "organizing" },
      { id: "action", label: "すぐ次の一手を出す", resultKey: "action" },
      { id: "reassurance", label: "不安を先に減らす", resultKey: "reassurance" },
    ],
  },
  {
    id: "reply-preference",
    prompt: "心に残る返し方は？",
    helperText: "受け取りやすい返しの形を選んでください。",
    options: [
      { id: "watchful", label: "やさしく短い返し", resultKey: "watchful" },
      { id: "organizing", label: "具体的に整った返し", resultKey: "organizing" },
      { id: "action", label: "すぐ役立つ返し", resultKey: "action" },
      { id: "reassurance", label: "丁寧に確かめる返し", resultKey: "reassurance" },
    ],
  },
  {
    id: "next-step",
    prompt: "次の一歩に必要なのは？",
    helperText: "今ほしいものに近いものを選んでください。",
    options: [
      { id: "watchful", label: "無理のない空気", resultKey: "watchful" },
      { id: "organizing", label: "ひとつに絞れた整理", resultKey: "organizing" },
      { id: "action", label: "すぐできる行動", resultKey: "action" },
      { id: "reassurance", label: "安心できる確認", resultKey: "reassurance" },
    ],
  },
  {
    id: "continuity",
    prompt: "続けるなら、どんな寄り添いがいい？",
    helperText: "これからの続き方にいちばん近いものを選んでください。",
    options: [
      { id: "watchful", label: "静かに見守ってほしい", resultKey: "watchful" },
      { id: "organizing", label: "流れをまとめてほしい", resultKey: "organizing" },
      { id: "action", label: "一緒に進めてほしい", resultKey: "action" },
      { id: "reassurance", label: "気持ちを確かめてほしい", resultKey: "reassurance" },
    ],
  },
];

export const companionCheckResults: Record<CompanionCheckResultKey, CompanionCheckResult> = {
  watchful: {
    key: "watchful",
    title: "そっと見守る寄り添いが合うタイプ",
    summary:
      "相手の熱が高い場面ほど、あなたは一歩引いて空気を落ち着かせる力があります。言葉を増やしすぎず、まず安心の余白を置く寄り添いが合っています。",
    insight: "先に答えを詰めるより、1拍おいて受け止めると伝わりやすいです。",
    nextStep: "今日は、気になることを一文だけメモかメッセージにしてみましょう。",
    teaser: "LINEで続けると、次の小さな見守り方が1つだけ届きます。",
    shareCopy: "今日の寄り添い方チェックで『そっと見守る寄り添いが合うタイプ』でした。",
  },
  organizing: {
    key: "organizing",
    title: "順序を整えて支えるタイプ",
    summary:
      "あなたは、話が散らかった場面でも、順番をつくると力が出る人です。ひとつずつ並べ直すことで、相手も自分も落ち着きやすくなります。",
    insight: "要点を3つ以内に絞るだけで、寄り添いの手触りが整いやすいです。",
    nextStep: "今日は、気になることを3つまでに絞って書き出してみましょう。",
    teaser: "LINEでは、整理に合う次の一歩を短く受け取れます。",
    shareCopy: "今日の寄り添い方チェックで『順序を整えて支えるタイプ』でした。",
  },
  action: {
    key: "action",
    title: "すぐ一緒に動くタイプ",
    summary:
      "あなたは、考え込むより先に小さく動くと寄り添いが生きる人です。完璧に整える前でも、短い一歩が安心につながりやすいタイプです。",
    insight: "5分で終わる行動を先に置くと、次の判断が軽くなります。",
    nextStep: "今日は、5分でできることを1つだけ先にやってみましょう。",
    teaser: "LINEで続けると、次の小さな一歩が1つだけ届きます。",
    shareCopy: "今日の寄り添い方チェックで『すぐ一緒に動くタイプ』でした。",
  },
  reassurance: {
    key: "reassurance",
    title: "安心を確かめて進むタイプ",
    summary:
      "あなたは、不安をほどいてから進むと寄り添いが安定する人です。ひとつ確認できるだけで、相手にも自分にも落ち着きが戻りやすくなります。",
    insight: "確認先を1つ決めるだけで、動き出しの不安が小さくなります。",
    nextStep: "今日は、気になることの確認先を1つだけ決めてみましょう。",
    teaser: "LINEでは、安心を確かめる短い質問が1つ届きます。",
    shareCopy: "今日の寄り添い方チェックで『安心を確かめて進むタイプ』でした。",
  },
};

const resultPriority: CompanionCheckResultKey[] = ["watchful", "organizing", "action", "reassurance"];

export function scoreCompanionCheck(answers: Record<string, string | undefined>) {
  const scores: Record<CompanionCheckResultKey, number> = {
    watchful: 0,
    organizing: 0,
    action: 0,
    reassurance: 0,
  };

  for (const question of companionCheckQuestions) {
    const selected = answers[question.id];
    const matched = question.options.find((option) => option.id === selected);
    if (matched) {
      scores[matched.resultKey] += 1;
    }
  }

  let winner: CompanionCheckResultKey = "watchful";
  let bestScore = -1;
  for (const key of resultPriority) {
    const score = scores[key];
    if (score > bestScore) {
      winner = key;
      bestScore = score;
    }
  }

  return companionCheckResults[winner];
}
