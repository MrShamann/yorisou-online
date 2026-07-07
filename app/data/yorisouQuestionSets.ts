import type { RecommendationInterestId, YorisouTestId } from "./yorisouRecommendationSignals";

export type LightweightOption = {
  id: string;
  label: string;
  tags: readonly string[];
};

export type LightweightQuestion = {
  id: string;
  section: string;
  prompt: string;
  options: readonly LightweightOption[];
};

export type LightweightResult = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  bullets: readonly string[];
  recommendationTags: readonly string[];
  nextActionIds: readonly RecommendationInterestId[];
};

function pickStrongestTag(scoreMap: Record<string, number>, fallback: string) {
  const top = Object.entries(scoreMap).sort(([, a], [, b]) => b - a)[0];
  return top?.[0] || fallback;
}

export const WORK_RHYTHM_QUESTIONS: readonly LightweightQuestion[] = [
  {
    id: "WR_Q1",
    section: "今の集中の仕方を見る",
    prompt: "やることが多い日に、動き出しやすいのはどれですか？",
    options: [
      { id: "a", label: "締切を一つ決めて一気に進める", tags: ["short-burst"] },
      { id: "b", label: "順番を決めて一つずつ崩す", tags: ["steady-planner"] },
      { id: "c", label: "人と話しながら流れをつくる", tags: ["social-drive"] },
      { id: "d", label: "静かな場所にこもって始める", tags: ["quiet-focus"] },
    ],
  },
  {
    id: "WR_Q2",
    section: "今の集中の仕方を見る",
    prompt: "疲れが出やすいのはどんな場面ですか？",
    options: [
      { id: "a", label: "長く同じ作業が続くとき", tags: ["short-burst"] },
      { id: "b", label: "急な変更が続くとき", tags: ["steady-planner"] },
      { id: "c", label: "一人で抱え込む時間が長いとき", tags: ["social-drive"] },
      { id: "d", label: "話しかけられ続けるとき", tags: ["quiet-focus"] },
    ],
  },
  {
    id: "WR_Q3",
    section: "動きやすい環境を見る",
    prompt: "うまく進んだ日に近いのは？",
    options: [
      { id: "a", label: "短い山をいくつか越えられた", tags: ["short-burst"] },
      { id: "b", label: "予定どおり進められた", tags: ["steady-planner"] },
      { id: "c", label: "相談しながら前に進めた", tags: ["social-drive"] },
      { id: "d", label: "静かな時間をしっかり取れた", tags: ["quiet-focus"] },
    ],
  },
  {
    id: "WR_Q4",
    section: "動きやすい環境を見る",
    prompt: "人との関わり方で楽なのは？",
    options: [
      { id: "a", label: "要点だけ共有して自分で進める", tags: ["short-burst"] },
      { id: "b", label: "役割がはっきりしている", tags: ["steady-planner"] },
      { id: "c", label: "こまめに会話できる", tags: ["social-drive"] },
      { id: "d", label: "必要なときだけ話せる", tags: ["quiet-focus"] },
    ],
  },
  {
    id: "WR_Q5",
    section: "整え方を見る",
    prompt: "立て直したいとき、最初にしたいのは？",
    options: [
      { id: "a", label: "10分だけ集中して片づける", tags: ["short-burst"] },
      { id: "b", label: "順番を並べ直す", tags: ["steady-planner"] },
      { id: "c", label: "誰かに状況を話す", tags: ["social-drive"] },
      { id: "d", label: "環境を静かに整える", tags: ["quiet-focus"] },
    ],
  },
  {
    id: "WR_Q6",
    section: "整え方を見る",
    prompt: "今、助かりそうなものは？",
    options: [
      { id: "a", label: "短く区切れるタスク設計", tags: ["short-burst"] },
      { id: "b", label: "見通しが立つ段取り", tags: ["steady-planner"] },
      { id: "c", label: "相談しやすい相手や場", tags: ["social-drive"] },
      { id: "d", label: "集中を守る静かな時間", tags: ["quiet-focus"] },
    ],
  },
];

const WORK_RHYTHM_RESULTS: Record<string, LightweightResult> = {
  "short-burst": {
    id: "short-burst",
    title: "短期集中型",
    summary: "短い山をつくると動きやすい今です。",
    detail: "長く均一に進めるより、区切りをつくって集中するほうがリズムが戻りやすいようです。",
    bullets: [
      "短く切ったタスクが進みやすい",
      "止まったら一度区切り直すと戻りやすい",
      "道具や読みものも“すぐ試せるもの”が合いやすい",
    ],
    recommendationTags: ["short-burst", "select-tools", "report-interest"],
    nextActionIds: ["report-preview", "select-info", "line-save", "related-test"],
  },
  "steady-planner": {
    id: "steady-planner",
    title: "段取り安定型",
    summary: "順番が見えると落ち着いて進めやすい今です。",
    detail: "急な切り替えより、見通しを持てる状態のほうが、力を無理なく使いやすいようです。",
    bullets: [
      "流れが見えると安心して動ける",
      "変更が重なると疲れやすい",
      "整理しやすい設計やサポートの案が相性よさそう",
    ],
    recommendationTags: ["steady-planner", "design-interest", "report-interest"],
    nextActionIds: ["report-preview", "design-interest", "line-save", "related-test"],
  },
  "social-drive": {
    id: "social-drive",
    title: "人との刺激で動く型",
    summary: "会話や相談があると流れをつくりやすい今です。",
    detail: "一人で抱えるより、人とのやり取りの中でリズムが生まれるほうが進みやすいようです。",
    bullets: [
      "相談しながらだと動き出しやすい",
      "ひとり時間が長すぎると停滞しやすい",
      "Communityや小さな共創の入口も合いやすいかもしれません",
    ],
    recommendationTags: ["social-drive", "community-interest", "report-interest"],
    nextActionIds: ["report-preview", "community-interest", "line-save", "related-test"],
  },
  "quiet-focus": {
    id: "quiet-focus",
    title: "静かな環境で深まる型",
    summary: "落ち着いた環境があると力を発揮しやすい今です。",
    detail: "会話や通知が多い場より、静かな余白があるほうが、考えを深めやすいようです。",
    bullets: [
      "集中を守る環境づくりが大切",
      "話しかけられ続けると負荷が出やすい",
      "道具や設計の案を静かに選べると合いやすい",
    ],
    recommendationTags: ["quiet-focus", "select-tools", "design-interest"],
    nextActionIds: ["report-preview", "select-info", "design-interest", "line-save"],
  },
};

export function getWorkRhythmResult(answerMap: Record<string, string>) {
  const scores: Record<string, number> = {
    "short-burst": 0,
    "steady-planner": 0,
    "social-drive": 0,
    "quiet-focus": 0,
  };

  for (const question of WORK_RHYTHM_QUESTIONS) {
    const selected = answerMap[question.id];
    const option = question.options.find((entry) => entry.id === selected);
    for (const tag of option?.tags || []) {
      scores[tag] = (scores[tag] || 0) + 1;
    }
  }

  const strongest = pickStrongestTag(scores, "steady-planner");
  return {
    result: WORK_RHYTHM_RESULTS[strongest],
    scores,
  };
}

export const NAME_IMPRESSION_QUESTIONS: readonly LightweightQuestion[] = [
  {
    id: "NI_Q1",
    section: "見え方の輪郭を見る",
    prompt: "初対面で言われると近いのは？",
    options: [
      { id: "a", label: "やわらかい雰囲気がある", tags: ["soft"] },
      { id: "b", label: "印象がはっきり残る", tags: ["straight"] },
      { id: "c", label: "落ち着いて見える", tags: ["steady"] },
      { id: "d", label: "少しつかみどころがある", tags: ["spacious"] },
    ],
  },
  {
    id: "NI_Q2",
    section: "見え方の輪郭を見る",
    prompt: "自分の名前に合うと感じる言葉は？",
    options: [
      { id: "a", label: "やわらかい", tags: ["soft"] },
      { id: "b", label: "まっすぐ", tags: ["straight"] },
      { id: "c", label: "落ち着き", tags: ["steady"] },
      { id: "d", label: "余白", tags: ["spacious"] },
    ],
  },
  {
    id: "NI_Q3",
    section: "見え方の輪郭を見る",
    prompt: "人に覚えてもらいやすいのはどんなときですか？",
    options: [
      { id: "a", label: "話し方がやわらかいとき", tags: ["soft"] },
      { id: "b", label: "短くはっきり伝えたとき", tags: ["straight"] },
      { id: "c", label: "安心感を出せたとき", tags: ["steady"] },
      { id: "d", label: "少し余韻を残せたとき", tags: ["spacious"] },
    ],
  },
  {
    id: "NI_Q4",
    section: "今の見せ方を見る",
    prompt: "今の自分に近い見せ方は？",
    options: [
      { id: "a", label: "やわらかく受け取ってもらいたい", tags: ["soft"] },
      { id: "b", label: "まっすぐ伝わるほうが安心", tags: ["straight"] },
      { id: "c", label: "信頼してもらえる落ち着きがほしい", tags: ["steady"] },
      { id: "d", label: "決めつけられない余白を残したい", tags: ["spacious"] },
    ],
  },
  {
    id: "NI_Q5",
    section: "今の見せ方を見る",
    prompt: "名前から受ける印象をどう使いたいですか？",
    options: [
      { id: "a", label: "人に話しかけやすくしたい", tags: ["soft"] },
      { id: "b", label: "自己紹介をすっきりさせたい", tags: ["straight"] },
      { id: "c", label: "安心して任せてもらいたい", tags: ["steady"] },
      { id: "d", label: "無理に決めつけずにいたい", tags: ["spacious"] },
    ],
  },
];

const NAME_IMPRESSION_RESULTS: Record<string, LightweightResult> = {
  soft: {
    id: "soft",
    title: "やわらかく届く印象",
    summary: "人に安心感を与えるやわらかさが今の魅力になりやすいようです。",
    detail: "強く押し出すより、受け取りやすい雰囲気や言葉の温度が印象に残りやすい状態です。",
    bullets: [
      "やさしい言い回しが強みになりやすい",
      "短い自己紹介でも安心感が出やすい",
      "対人系の診断やLINE保存とも相性がよさそうです",
    ],
    recommendationTags: ["soft-impression", "related-test", "community-interest"],
    nextActionIds: ["related-test", "report-preview", "line-save", "community-interest"],
  },
  straight: {
    id: "straight",
    title: "まっすぐ残る印象",
    summary: "すっきり伝わる輪郭が今の魅力になりやすいようです。",
    detail: "余計に飾りすぎない言い方や、短く伝える姿勢が印象に残りやすい状態です。",
    bullets: [
      "短く伝えるほど良さが出やすい",
      "役割や意図がはっきりすると強みになりやすい",
      "仕事のリズム診断やレポートの見本とつなげやすい方向です",
    ],
    recommendationTags: ["straight-impression", "work-rhythm", "report-interest"],
    nextActionIds: ["related-test", "report-preview", "line-save", "select-info"],
  },
  steady: {
    id: "steady",
    title: "落ち着いて信頼される印象",
    summary: "急がず安心してもらえる雰囲気が今の魅力になりやすいようです。",
    detail: "派手さより、落ち着きや整った受け答えが信頼感につながりやすい状態です。",
    bullets: [
      "安心感や安定感が伝わりやすい",
      "整った言い方が強みになりやすい",
      "DesignやCommunityの関心導線ともつなげやすい方向です",
    ],
    recommendationTags: ["steady-impression", "design-interest", "community-interest"],
    nextActionIds: ["report-preview", "community-interest", "design-interest", "line-save"],
  },
  spacious: {
    id: "spacious",
    title: "少し余白のある印象",
    summary: "決めつけない余韻や余白が今の魅力になりやすいようです。",
    detail: "はっきり言い切りすぎないことで、相手が受け取る余地を残せる状態です。",
    bullets: [
      "余韻や含みが印象に残りやすい",
      "無理に強く見せないほうがよさが出やすい",
      "恋愛の距離感や暮らしの関心チェックにもつなげやすい方向です",
    ],
    recommendationTags: ["spacious-impression", "love-distance", "local-life"],
    nextActionIds: ["related-test", "report-preview", "local-life-interest", "line-save"],
  },
};

export function getNameImpressionResult(answerMap: Record<string, string>) {
  const scores: Record<string, number> = {
    soft: 0,
    straight: 0,
    steady: 0,
    spacious: 0,
  };

  for (const question of NAME_IMPRESSION_QUESTIONS) {
    const selected = answerMap[question.id];
    const option = question.options.find((entry) => entry.id === selected);
    for (const tag of option?.tags || []) {
      scores[tag] = (scores[tag] || 0) + 1;
    }
  }

  const strongest = pickStrongestTag(scores, "steady");
  return {
    result: NAME_IMPRESSION_RESULTS[strongest],
    scores,
  };
}

export const LOCAL_LIFE_THEMES = [
  "生活リズムの立て直し",
  "気持ちの戻し方",
  "人との距離の整え方",
  "小さく動ける次の一歩",
  "続き方のヒントへの関心",
] as const;

export type LocalLifeTheme = (typeof LOCAL_LIFE_THEMES)[number];

export const LOCAL_LIFE_QUESTIONS: readonly LightweightQuestion[] = [
  {
    id: "LL_Q1",
    section: "今の関心を見る",
    prompt: "今、いちばん近い関心はどれですか？",
    options: [
      { id: "a", label: "生活リズムを立て直したい", tags: ["rhythm-reset"] },
      { id: "b", label: "気持ちの戻し方を知りたい", tags: ["emotional-recovery"] },
      { id: "c", label: "人との距離を整えたい", tags: ["distance-balance"] },
      { id: "d", label: "小さく動ける次の一歩がほしい", tags: ["small-step"] },
      { id: "e", label: "あとで戻りやすい続き方に関心がある", tags: ["continuation-clue"] },
    ],
  },
  {
    id: "LL_Q2",
    section: "今の関心を見る",
    prompt: "今ほしいのはどれに近いですか？",
    options: [
      { id: "a", label: "同じ悩みの方向を整理したい", tags: ["acknowledgement"] },
      { id: "b", label: "使えそうな情報の入口がほしい", tags: ["information"] },
      { id: "c", label: "声を送れる先がほしい", tags: ["feedback"] },
      { id: "d", label: "小さく試せる案が知りたい", tags: ["co-creation"] },
    ],
  },
  {
    id: "LL_Q3",
    section: "受け取りたい形を見る",
    prompt: "受け取りやすいのはどんな案内ですか？",
    options: [
      { id: "a", label: "短く読めるヒント", tags: ["information"] },
      { id: "b", label: "似た声の整理", tags: ["acknowledgement"] },
      { id: "c", label: "一緒に考える入口", tags: ["co-creation"] },
      { id: "d", label: "今はまだ、整理だけで十分", tags: ["quiet"] },
    ],
  },
  {
    id: "LL_Q4",
    section: "受け取りたい形を見る",
    prompt: "次につながるなら、無理がないのはどれですか？",
    options: [
      { id: "a", label: "同じテーマの情報を見る", tags: ["information"] },
      { id: "b", label: "関心だけ送る", tags: ["feedback"] },
      { id: "c", label: "試作やアイデアの声を送る", tags: ["co-creation"] },
      { id: "d", label: "今日はここで止めておく", tags: ["quiet"] },
    ],
  },
];

export function getLocalLifeAcknowledgement(answerMap: Record<string, string>) {
  const themeMap: Record<string, LocalLifeTheme> = {
    "rhythm-reset": "生活リズムの立て直し",
    "emotional-recovery": "気持ちの戻し方",
    "distance-balance": "人との距離の整え方",
    "small-step": "小さく動ける次の一歩",
    "continuation-clue": "続き方のヒントへの関心",
  };
  const question1 = LOCAL_LIFE_QUESTIONS[0];
  const selectedThemeOption = question1.options.find((entry) => entry.id === answerMap[question1.id]);
  const primaryTheme = themeMap[selectedThemeOption?.tags[0] || "community-link"];

  const supportScores: Record<string, number> = {
    acknowledgement: 0,
    information: 0,
    feedback: 0,
    "co-creation": 0,
    quiet: 0,
  };

  for (const question of LOCAL_LIFE_QUESTIONS.slice(1)) {
    const selected = answerMap[question.id];
    const option = question.options.find((entry) => entry.id === selected);
    for (const tag of option?.tags || []) {
      supportScores[tag] = (supportScores[tag] || 0) + 1;
    }
  }

  const strongest = pickStrongestTag(supportScores, "information");
  const supportCopy: Record<string, string> = {
    acknowledgement: "まずは同じ方向の困りごとを整理して受け止めるのが近そうです。",
    information: "まずは短く読める情報や案内の入口が合いそうです。",
    feedback: "今の声を短く送れる入口が合いそうです。",
    "co-creation": "小さく試す案や、一緒に考える入口が合いそうです。",
    quiet: "今日は整理だけで止めておく形が無理なさそうです。",
  };

  return {
    result: {
      id: primaryTheme,
      title: primaryTheme,
      summary: "今の暮らし方や戻り方に近い入口を整理した確認結果です。",
      detail: `${primaryTheme}に近い関心が見えています。${supportCopy[strongest]}`,
      bullets: [
        "これは専門的な支援やサービス提供の約束ではありません",
        "今の関心を次の案内や改善につなげる入口です",
        "必要ならCommunityやDesignの関心導線にもつなげられます",
      ],
      recommendationTags: [primaryTheme, strongest, "local-life-signal"],
      nextActionIds: ["local-life-interest", "community-interest", "design-interest"],
    } satisfies LightweightResult,
    primaryTheme,
    supportScores,
  };
}

export const TEST_THEME_BY_ID: Record<YorisouTestId, string> = {
  "current-state": "今の状態タイプ",
  "love-distance": "恋愛の距離感",
  "work-rhythm": "仕事のリズム",
  "name-impression": "名前の印象",
  "local-life": "暮らしの関心",
};
