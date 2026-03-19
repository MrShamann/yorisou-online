export type Locale = "ja" | "en";

export type AdvisorAnswers = {
  userType: "self" | "parent" | "family" | "facility";
  ageRange: "under65" | "65to74" | "75to84" | "85plus";
  walkingAbility: "normal" | "somewhat_limited" | "difficult_long_distance";
  primaryScenario: "shopping" | "hospital" | "neighborhood" | "commuting" | "mixed";
  usageEnvironment: "outdoor" | "mixed" | "indoor_community";
  needFoldable: "yes" | "no" | "not_sure";
  carTrunkFit: "yes" | "no";
  useFrequency: "occasional" | "weekly" | "several_times_week" | "daily";
  budgetRange: "under200k" | "200kto400k" | "400kto700k" | "700kplus";
  safetyNote: string;
};

export type RecommendationCategory =
  | "Compact Senior Mobility Scooter"
  | "Foldable Lightweight Mobility Scooter"
  | "Community Micro EV"
  | "Stable 3-Wheel Utility Mobility";

export type AdvisorRecommendation = {
  recommendedCategory: RecommendationCategory;
  secondaryRecommendation: RecommendationCategory;
  whyItFits: string[];
  cautionPoints: string[];
  suggestedNextAction: string;
  summary: string;
  scoreBreakdown: Record<RecommendationCategory, number>;
};

const categories: RecommendationCategory[] = [
  "Compact Senior Mobility Scooter",
  "Foldable Lightweight Mobility Scooter",
  "Community Micro EV",
  "Stable 3-Wheel Utility Mobility",
];

const labelMap = {
  ja: {
    userType: {
      self: "ご本人",
      parent: "親御さま",
      family: "ご家族",
      facility: "施設・事業所",
    },
    ageRange: {
      under65: "65歳未満",
      "65to74": "65〜74歳",
      "75to84": "75〜84歳",
      "85plus": "85歳以上",
    },
    walkingAbility: {
      normal: "通常どおり歩ける",
      somewhat_limited: "やや不安がある",
      difficult_long_distance: "長距離歩行が負担",
    },
    primaryScenario: {
      shopping: "買い物",
      hospital: "通院",
      neighborhood: "近隣移動",
      commuting: "通勤・通所",
      mixed: "複数用途",
    },
    usageEnvironment: {
      outdoor: "屋外中心",
      mixed: "屋内外の併用",
      indoor_community: "屋内・敷地内中心",
    },
    needFoldable: {
      yes: "必要",
      no: "不要",
      not_sure: "まだ未定",
    },
    carTrunkFit: {
      yes: "必要",
      no: "不要",
    },
    useFrequency: {
      occasional: "たまに使う",
      weekly: "週1回程度",
      several_times_week: "週に数回",
      daily: "ほぼ毎日",
    },
    budgetRange: {
      under200k: "20万円未満",
      "200kto400k": "20万〜40万円",
      "400kto700k": "40万〜70万円",
      "700kplus": "70万円以上",
    },
  },
  en: {
    userType: {
      self: "Self",
      parent: "Parent",
      family: "Family member",
      facility: "Facility",
    },
    ageRange: {
      under65: "Under 65",
      "65to74": "65-74",
      "75to84": "75-84",
      "85plus": "85+",
    },
    walkingAbility: {
      normal: "Walking is mostly normal",
      somewhat_limited: "Some limitation",
      difficult_long_distance: "Long distances are difficult",
    },
    primaryScenario: {
      shopping: "Shopping",
      hospital: "Hospital visits",
      neighborhood: "Neighborhood trips",
      commuting: "Commuting",
      mixed: "Mixed use",
    },
    usageEnvironment: {
      outdoor: "Outdoor only",
      mixed: "Mixed indoor/outdoor",
      indoor_community: "Mostly indoor/community",
    },
    needFoldable: {
      yes: "Yes",
      no: "No",
      not_sure: "Not sure",
    },
    carTrunkFit: {
      yes: "Yes",
      no: "No",
    },
    useFrequency: {
      occasional: "Occasional",
      weekly: "Weekly",
      several_times_week: "Several times a week",
      daily: "Daily",
    },
    budgetRange: {
      under200k: "Under JPY 200k",
      "200kto400k": "JPY 200k-400k",
      "400kto700k": "JPY 400k-700k",
      "700kplus": "JPY 700k+",
    },
  },
} as const;

function addScore(
  scores: Record<RecommendationCategory, number>,
  category: RecommendationCategory,
  value: number
) {
  scores[category] += value;
}

function rankedCategories(answers: AdvisorAnswers) {
  const scores: Record<RecommendationCategory, number> = {
    "Compact Senior Mobility Scooter": 0,
    "Foldable Lightweight Mobility Scooter": 0,
    "Community Micro EV": 0,
    "Stable 3-Wheel Utility Mobility": 0,
  };

  switch (answers.walkingAbility) {
    case "normal":
      addScore(scores, "Community Micro EV", 2);
      addScore(scores, "Foldable Lightweight Mobility Scooter", 1);
      break;
    case "somewhat_limited":
      addScore(scores, "Compact Senior Mobility Scooter", 3);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
      break;
    case "difficult_long_distance":
      addScore(scores, "Compact Senior Mobility Scooter", 4);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 3);
      break;
  }

  switch (answers.primaryScenario) {
    case "shopping":
      addScore(scores, "Stable 3-Wheel Utility Mobility", 3);
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      break;
    case "hospital":
      addScore(scores, "Compact Senior Mobility Scooter", 3);
      addScore(scores, "Foldable Lightweight Mobility Scooter", 1);
      break;
    case "neighborhood":
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
      break;
    case "commuting":
      addScore(scores, "Community Micro EV", 4);
      addScore(scores, "Foldable Lightweight Mobility Scooter", 2);
      break;
    case "mixed":
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      addScore(scores, "Community Micro EV", 2);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
      break;
  }

  switch (answers.usageEnvironment) {
    case "outdoor":
      addScore(scores, "Community Micro EV", 3);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      break;
    case "mixed":
      addScore(scores, "Compact Senior Mobility Scooter", 3);
      addScore(scores, "Foldable Lightweight Mobility Scooter", 2);
      break;
    case "indoor_community":
      addScore(scores, "Foldable Lightweight Mobility Scooter", 3);
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      break;
  }

  if (answers.needFoldable === "yes") {
    addScore(scores, "Foldable Lightweight Mobility Scooter", 5);
  } else if (answers.needFoldable === "not_sure") {
    addScore(scores, "Foldable Lightweight Mobility Scooter", 1);
  } else {
    addScore(scores, "Stable 3-Wheel Utility Mobility", 1);
    addScore(scores, "Community Micro EV", 1);
  }

  if (answers.carTrunkFit === "yes") {
    addScore(scores, "Foldable Lightweight Mobility Scooter", 4);
    addScore(scores, "Compact Senior Mobility Scooter", 1);
  } else {
    addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
    addScore(scores, "Community Micro EV", 2);
  }

  switch (answers.useFrequency) {
    case "occasional":
      addScore(scores, "Foldable Lightweight Mobility Scooter", 2);
      break;
    case "weekly":
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 1);
      break;
    case "several_times_week":
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
      break;
    case "daily":
      addScore(scores, "Community Micro EV", 3);
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
      break;
  }

  switch (answers.budgetRange) {
    case "under200k":
      addScore(scores, "Foldable Lightweight Mobility Scooter", 2);
      break;
    case "200kto400k":
      addScore(scores, "Compact Senior Mobility Scooter", 2);
      addScore(scores, "Foldable Lightweight Mobility Scooter", 1);
      break;
    case "400kto700k":
      addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
      addScore(scores, "Compact Senior Mobility Scooter", 1);
      break;
    case "700kplus":
      addScore(scores, "Community Micro EV", 4);
      break;
  }

  if (answers.ageRange === "85plus") {
    addScore(scores, "Compact Senior Mobility Scooter", 2);
    addScore(scores, "Stable 3-Wheel Utility Mobility", 2);
  }

  return [...categories].sort((a, b) => scores[b] - scores[a] || categories.indexOf(a) - categories.indexOf(b)).map((category) => ({
    category,
    score: scores[category],
  }));
}

function buildDeterministicSummary(answers: AdvisorAnswers, locale: Locale) {
  const labels = labelMap[locale];

  if (locale === "ja") {
    const base = [
      `${labels.userType[answers.userType]}向けに、${labels.primaryScenario[answers.primaryScenario]}を中心とした移動を想定しています。`,
      `歩行状況は「${labels.walkingAbility[answers.walkingAbility]}」、利用環境は「${labels.usageEnvironment[answers.usageEnvironment]}」です。`,
      `利用頻度は「${labels.useFrequency[answers.useFrequency]}」、ご予算感は「${labels.budgetRange[answers.budgetRange]}」です。`,
    ];

    if (answers.safetyNote.trim()) {
      base.push(`安全面や特記事項として「${answers.safetyNote.trim()}」が挙がっています。`);
    }

    return base.join(" ");
  }

  const base = [
    `This request is for ${labels.userType[answers.userType].toLowerCase()} use, mainly for ${labels.primaryScenario[answers.primaryScenario].toLowerCase()}.`,
    `Walking ability is "${labels.walkingAbility[answers.walkingAbility]}", and the expected environment is "${labels.usageEnvironment[answers.usageEnvironment]}".`,
    `Expected frequency is "${labels.useFrequency[answers.useFrequency]}", with a budget of "${labels.budgetRange[answers.budgetRange]}".`,
  ];

  if (answers.safetyNote.trim()) {
    base.push(`Special note: "${answers.safetyNote.trim()}".`);
  }

  return base.join(" ");
}

async function maybeEnhanceSummaryWithOpenAI(
  answers: AdvisorAnswers,
  recommendation: Omit<AdvisorRecommendation, "summary">,
  locale: Locale
) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt =
    locale === "ja"
      ? `以下の構造化情報をもとに、日本語で落ち着いた丁寧な2〜3文の要約を作成してください。誇張表現は避け、家族や高齢者にやさしい語り口にしてください。\n\n回答: ${JSON.stringify(
          answers
        )}\n\n推薦: ${JSON.stringify(recommendation)}`
      : `Write a calm, warm 2-3 sentence summary in English based on this structured mobility advisor data. Avoid hype. Keep it suitable for seniors and family members.\n\nAnswers: ${JSON.stringify(
          answers
        )}\n\nRecommendation: ${JSON.stringify(recommendation)}`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI summary request failed:", await response.text());
      return null;
    }

    const data = (await response.json()) as {
      output_text?: string;
    };

    const text = data.output_text?.trim();
    return text || null;
  } catch (error) {
    console.error("OpenAI summary request error:", error);
    return null;
  }
}

export async function generateAdvisorRecommendation(
  answers: AdvisorAnswers,
  locale: Locale
): Promise<AdvisorRecommendation> {
  const ranked = rankedCategories(answers);
  const primary = ranked[0].category;
  const secondary = ranked[1].category;
  const deterministicSummary = buildDeterministicSummary(answers, locale);

  const whyItFits =
    locale === "ja"
      ? buildWhyItFitsJa(answers, primary)
      : buildWhyItFitsEn(answers, primary);
  const cautionPoints =
    locale === "ja"
      ? buildCautionPointsJa(answers, primary)
      : buildCautionPointsEn(answers, primary);
  const suggestedNextAction =
    locale === "ja"
      ? buildNextActionJa(answers, primary)
      : buildNextActionEn(answers, primary);

  const baseRecommendation = {
    recommendedCategory: primary,
    secondaryRecommendation: secondary,
    whyItFits,
    cautionPoints,
    suggestedNextAction,
    scoreBreakdown: ranked.reduce<Record<RecommendationCategory, number>>((acc, item) => {
      acc[item.category] = item.score;
      return acc;
    }, {
      "Compact Senior Mobility Scooter": 0,
      "Foldable Lightweight Mobility Scooter": 0,
      "Community Micro EV": 0,
      "Stable 3-Wheel Utility Mobility": 0,
    }),
  };

  const aiSummary = await maybeEnhanceSummaryWithOpenAI(answers, baseRecommendation, locale);

  return {
    ...baseRecommendation,
    summary: aiSummary || deterministicSummary,
  };
}

export function getAnswerLabels(answers: AdvisorAnswers, locale: Locale) {
  const labels = labelMap[locale];

  return {
    userType: labels.userType[answers.userType],
    ageRange: labels.ageRange[answers.ageRange],
    walkingAbility: labels.walkingAbility[answers.walkingAbility],
    primaryScenario: labels.primaryScenario[answers.primaryScenario],
    usageEnvironment: labels.usageEnvironment[answers.usageEnvironment],
    needFoldable: labels.needFoldable[answers.needFoldable],
    carTrunkFit: labels.carTrunkFit[answers.carTrunkFit],
    useFrequency: labels.useFrequency[answers.useFrequency],
    budgetRange: labels.budgetRange[answers.budgetRange],
    safetyNote: answers.safetyNote.trim(),
  };
}

function buildWhyItFitsJa(answers: AdvisorAnswers, category: RecommendationCategory) {
  const items = [
    answers.walkingAbility !== "normal"
      ? "歩行負担を軽くしつつ、近距離移動を日常に取り入れやすい構成です。"
      : "現状の歩行力を活かしながら、移動の選択肢を無理なく広げやすい方向性です。",
    answers.primaryScenario === "hospital"
      ? "通院のように目的地と時間がはっきりした移動に合わせやすい想定です。"
      : "日常の買い物や近隣移動に合わせて扱いやすさを重視しています。",
  ];

  if (category === "Foldable Lightweight Mobility Scooter") {
    items.push("折りたたみや収納性を重視する条件と相性が良く、ご家族の送迎にも組み込みやすい候補です。");
  }

  if (category === "Community Micro EV") {
    items.push("利用頻度が高い場合でも安定した移動手段として検討しやすいカテゴリーです。");
  }

  if (category === "Stable 3-Wheel Utility Mobility") {
    items.push("荷物の持ち運びや屋外での安定感を求める用途と相性があります。");
  }

  if (category === "Compact Senior Mobility Scooter") {
    items.push("扱いやすさと安心感のバランスが取りやすく、初回相談の候補としてまとまりがあります。");
  }

  return items;
}

function buildWhyItFitsEn(answers: AdvisorAnswers, category: RecommendationCategory) {
  const items = [
    answers.walkingAbility !== "normal"
      ? "It is aligned with reducing walking burden while keeping local trips manageable."
      : "It broadens mobility options without forcing a major change in current movement habits.",
    answers.primaryScenario === "hospital"
      ? "It suits regular, purpose-driven trips such as clinic or hospital visits."
      : "It keeps everyday ease of use in focus for shopping and neighborhood movement.",
  ];

  if (category === "Foldable Lightweight Mobility Scooter") {
    items.push("It is a strong match when storage flexibility and family car transport matter.");
  }

  if (category === "Community Micro EV") {
    items.push("It becomes more attractive when use is frequent and range expectations are higher.");
  }

  if (category === "Stable 3-Wheel Utility Mobility") {
    items.push("It fits users who want steadier outdoor handling and room for carrying items.");
  }

  if (category === "Compact Senior Mobility Scooter") {
    items.push("It offers a balanced starting point between reassurance, comfort, and daily practicality.");
  }

  return items;
}

function buildCautionPointsJa(answers: AdvisorAnswers, category: RecommendationCategory) {
  const items = [
    "実際の乗り降りのしやすさ、操作感、保管場所は試乗時に必ず確認してください。",
  ];

  if (answers.carTrunkFit === "yes" && category !== "Foldable Lightweight Mobility Scooter") {
    items.push("車載が前提の場合は、分解や積み込みの手順が現実的かを先に確認する必要があります。");
  }

  if (answers.usageEnvironment === "indoor_community") {
    items.push("施設内や共用部での利用は、通路幅や運用ルールとの相性確認が必要です。");
  }

  if (answers.safetyNote.trim()) {
    items.push("ご記入いただいた安全面の懸念は、スタッフとの個別相談で優先的に確認するのが安心です。");
  }

  return items;
}

function buildCautionPointsEn(answers: AdvisorAnswers, category: RecommendationCategory) {
  const items = [
    "Please confirm real-world fit through a test ride, including boarding ease, controls, and storage space.",
  ];

  if (answers.carTrunkFit === "yes" && category !== "Foldable Lightweight Mobility Scooter") {
    items.push("If car transport is essential, loading steps and actual trunk fit should be checked early.");
  }

  if (answers.usageEnvironment === "indoor_community") {
    items.push("Indoor or facility use should be checked against corridor width and local operating rules.");
  }

  if (answers.safetyNote.trim()) {
    items.push("The safety concern shared in the form should be reviewed directly during consultation.");
  }

  return items;
}

function buildNextActionJa(answers: AdvisorAnswers, category: RecommendationCategory) {
  if (category === "Foldable Lightweight Mobility Scooter") {
    return "候補機の折りたたみ手順と車載可否を一緒に確認できる試乗相談がおすすめです。";
  }

  if (category === "Community Micro EV") {
    return "利用エリアや走行距離を踏まえ、日常導線に合うかを相談しながら確認するのがおすすめです。";
  }

  if (answers.userType === "facility") {
    return "施設内の利用動線や保管方法を含めた導入相談から始めるのがおすすめです。";
  }

  return "まずは試乗または個別相談で、乗り心地と日常動線への合い方を確かめるのがおすすめです。";
}

function buildNextActionEn(answers: AdvisorAnswers, category: RecommendationCategory) {
  if (category === "Foldable Lightweight Mobility Scooter") {
    return "A test ride that also checks folding steps and trunk loading would be the best next step.";
  }

  if (category === "Community Micro EV") {
    return "The next step is to review local travel routes and confirm whether daily range expectations are realistic.";
  }

  if (answers.userType === "facility") {
    return "A consultation covering on-site routes, storage, and daily operation would be the best next step.";
  }

  return "The best next step is a calm consultation or test ride to confirm comfort and real-life fit.";
}
