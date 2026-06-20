export const YORISOU_PERSONA_ANNEX_A_VERSION = "v1-2026-04-24" as const;

export type PersonaAnnexARow = {
  personaId: `P${string}`;
  structuralWorkingName: string;
  officialPublicPersonaName: string;
  socialHandle: string;
  functionalSubtitle: string;
  publicSign: string;
  priorityFlag: string;
  neighboringPersonaCandidates: string[];
  currentModeVariants: [string, string, string];
  mythCrestMotifCandidate: string;
  shareCardHookDirection: string;
  visualPromptDirection: string;
  riskNote: string;
  traitChips: [string, string, string];
};

export const YORISOU_PUBLIC_SIGN_REGEX = /^[先受]・[表秘]・[柔刃]・[走組]$/;

function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function ensureEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(message);
  }
}

function ensureDeepEqual(actual: unknown, expected: unknown, message: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message);
  }
}

export const YORISOU_PERSONA_ANNEX_A_ROWS: readonly PersonaAnnexARow[] = [
  {
    personaId: "P01",
    structuralWorkingName: "The Quiet Receiver",
    officialPublicPersonaName: "気配読み",
    socialHandle: "返信前に一回沈む人",
    functionalSubtitle: "先に受け取り、あとから距離を縮める人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P03", "P19", "P20"],
    currentModeVariants: ["静観", "過敏", "ひらき"],
    mythCrestMotifCandidate: "月影 / tide rings / soft seal line",
    shareCardHookDirection: "朝だけ妙に手順が細かい人、これでしょ。",
    visualPromptDirection: "Side gaze, shoulders slightly inward, cool gray-blue palette, upper-body editorial portrait with quiet tension.",
    riskNote: "Avoid weak, passive, or tragic framing.",
    traitChips: ["気配の受け取り", "静かな返し", "先に沈む"],
  },
  {
    personaId: "P02",
    structuralWorkingName: "The Visible Spark",
    officialPublicPersonaName: "火つけ",
    socialHandle: "空気より先に熱が出る人",
    functionalSubtitle: "感情も行動も前に出やすい人。",
    publicSign: "先・表・柔・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P10", "P15", "P21"],
    currentModeVariants: ["点火", "波及", "オフ"],
    mythCrestMotifCandidate: "火花 / warm flare / rising spark mark",
    shareCardHookDirection: "なんかこの人だけ感情の点灯が早い、いるよね。",
    visualPromptDirection: "Forward gaze, lifted chin, warm coral-orange accent, open chest, lively but not childish.",
    riskNote: "Avoid loud extrovert cliché.",
    traitChips: ["熱の立ち上がり", "場の先取り", "切替の速さ"],
  },
  {
    personaId: "P03",
    structuralWorkingName: "The Hidden Fire",
    officialPublicPersonaName: "静燃え",
    socialHandle: "平静っぽいのに内側だけ熱い人",
    functionalSubtitle: "表面は静かでも、内側の熱が強い人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P01", "P09", "P27"],
    currentModeVariants: ["余熱", "抑圧", "溢れ"],
    mythCrestMotifCandidate: "余炎 / ember seam / hidden glow",
    shareCardHookDirection: "落ち着いて見えるのに、内側だけずっと気温が高い人。",
    visualPromptDirection: "Calm face with eyes carrying heat, muted charcoal and ember palette, controlled posture.",
    riskNote: "Avoid melodrama or mysterious-girl cliché.",
    traitChips: ["静かな蓄熱", "表面の落ち着き", "内側の熱"],
  },
  {
    personaId: "P04",
    structuralWorkingName: "The Careful Wall",
    officialPublicPersonaName: "線守り",
    socialHandle: "入れていい人を自分で決める人",
    functionalSubtitle: "心はあるけれど、入口を狭く管理する人。",
    publicSign: "受・秘・刃・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P20", "P30", "P08"],
    currentModeVariants: ["閉門", "点検", "許可"],
    mythCrestMotifCandidate: "門 / lock plate / threshold mark",
    shareCardHookDirection: "優しいかどうかより、入れていい人をちゃんと選ぶ人。",
    visualPromptDirection: "Guarded posture, slight body angle away, dark neutral palette, clear edge around silhouette.",
    riskNote: "Avoid cold, mean, or punishment-coded reading.",
    traitChips: ["入口の管理", "線の見極め", "距離の設計"],
  },
  {
    personaId: "P05",
    structuralWorkingName: "The Gentle Anchor",
    officialPublicPersonaName: "受け止め",
    socialHandle: "揺れた人の体温を下げる人",
    functionalSubtitle: "静かに安心を作り、場を安定させる人。",
    publicSign: "受・表・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P29", "P19", "P30"],
    currentModeVariants: ["安定", "保温", "抱持"],
    mythCrestMotifCandidate: "灯 / harbor knot / soft anchor seal",
    shareCardHookDirection: "しんどい人の隣で、空気だけ静かに整える人。",
    visualPromptDirection: "Centered posture, soft open hands, deep green and cream palette, grounded steadiness.",
    riskNote: "Avoid motherly stereotype or healer cosplay tone.",
    traitChips: ["安心の安定", "揺れの受け皿", "場を落ち着かせる"],
  },
  {
    personaId: "P06",
    structuralWorkingName: "The Soft Rescuer",
    officialPublicPersonaName: "抱え込み",
    socialHandle: "人のしんどさを先に持つ人",
    functionalSubtitle: "助けながら、自分の分を後回しにしやすい人。",
    publicSign: "先・表・柔・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P05", "P19", "P27"],
    currentModeVariants: ["介抱", "先回収", "枯れ"],
    mythCrestMotifCandidate: "帯 / clasped hands / wrapped thread",
    shareCardHookDirection: "人のしんどさを拾うのが早すぎて、自分の分が後回しになる人。",
    visualPromptDirection: "Slight forward lean, caring gaze, muted rose and beige palette, warmth with a fatigue hint.",
    riskNote: "Avoid martyr romanticization.",
    traitChips: ["抱え込みの早さ", "先に持つ", "自分後回し"],
  },
  {
    personaId: "P07",
    structuralWorkingName: "The Straight Blade",
    officialPublicPersonaName: "霧切り",
    socialHandle: "正論で霧を切る人",
    functionalSubtitle: "遠回しより、明確さを選ぶ人。",
    publicSign: "先・表・刃・走",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P28", "P10", "P18"],
    currentModeVariants: ["直断", "切開", "留保"],
    mythCrestMotifCandidate: "刃 / single stroke / ink slash",
    shareCardHookDirection: "正論で霧を切る人、ほんとこれ。",
    visualPromptDirection: "Direct frontal crop, sharp eye line, monochrome palette with a red accent, clean editorial severity.",
    riskNote: "Avoid cruel or domineering framing.",
    traitChips: ["明確さ", "霧を切る", "遠回し回避"],
  },
  {
    personaId: "P08",
    structuralWorkingName: "The Quiet Deflector",
    officialPublicPersonaName: "すり抜け",
    socialHandle: "もめる前に静かに離れる人",
    functionalSubtitle: "摩擦を起こさず、距離だけ取るのがうまい人。",
    publicSign: "受・秘・刃・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P04", "P27", "P30"],
    currentModeVariants: ["回避", "退避", "無音"],
    mythCrestMotifCandidate: "薄霧 / water slip / vanishing trace",
    shareCardHookDirection: "ぶつからずに距離だけ取るのが妙にうまい人。",
    visualPromptDirection: "Side-turned body, lowered gaze, blue-gray palette, exit-ready stillness.",
    riskNote: "Avoid cowardice-only framing.",
    traitChips: ["摩擦回避", "静かな退避", "距離だけ取る"],
  },
  {
    personaId: "P09",
    structuralWorkingName: "The Reluctant Exploder",
    officialPublicPersonaName: "堪え込み",
    socialHandle: "我慢してたのに急に切れる人",
    functionalSubtitle: "溜めてから一気に溢れやすい人。",
    publicSign: "受・秘・刃・走",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P03", "P19", "P27"],
    currentModeVariants: ["蓄圧", "我慢", "噴出"],
    mythCrestMotifCandidate: "火山 / pressure ring / cracked seal",
    shareCardHookDirection: "返信の一言だけ妙に空気ある人、ほんとこれ。",
    visualPromptDirection: "Still body with compressed jaw, low-saturation plum-charcoal palette, pressure under restraint.",
    riskNote: "Avoid unstable or abusive framing.",
    traitChips: ["溜める力", "温度の爆発", "我慢の圧"],
  },
  {
    personaId: "P10",
    structuralWorkingName: "The Fast Mover",
    officialPublicPersonaName: "即断",
    socialHandle: "考えるより先に一歩出る人",
    functionalSubtitle: "動きながら調整したい人。",
    publicSign: "先・表・刃・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P17", "P15", "P13"],
    currentModeVariants: ["加速", "試運転", "切替"],
    mythCrestMotifCandidate: "矢羽 / motion stripe / split wind",
    shareCardHookDirection: "悩むより先に一回やってみる人、いるよね。",
    visualPromptDirection: "Mid-step energy, bright neutral palette with orange accent, decisive movement.",
    riskNote: "Avoid reckless-idiot framing.",
    traitChips: ["先に動く", "試しながら進む", "切替の速さ"],
  },
  {
    personaId: "P11",
    structuralWorkingName: "The Measured Architect",
    officialPublicPersonaName: "段取り",
    socialHandle: "ノイズより設計図が欲しい人",
    functionalSubtitle: "先に筋道を作ってから動く人。",
    publicSign: "先・秘・刃・組",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P18", "P29", "P14"],
    currentModeVariants: ["設計", "整列", "実装"],
    mythCrestMotifCandidate: "方眼 / blueprint grid / ruled frame",
    shareCardHookDirection: "ノリじゃなく段取りで勝つ人、これでしょ。",
    visualPromptDirection: "Neat posture, precise shoulders, graphite and navy palette, clean editorial structure.",
    riskNote: "Avoid dry corporate or robot framing.",
    traitChips: ["設計図", "順番の先読み", "整列して実装"],
  },
  {
    personaId: "P12",
    structuralWorkingName: "The Hesitant Planner",
    officialPublicPersonaName: "詰めすぎ",
    socialHandle: "決める前に枝を増やす人",
    functionalSubtitle: "正しく決めたいほど、動きが遅くなる人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P11", "P18", "P27"],
    currentModeVariants: ["比較", "保留", "再検討"],
    mythCrestMotifCandidate: "枝道 / branching line / option fan",
    shareCardHookDirection: "決める前に比較表が増えていく人、これ。",
    visualPromptDirection: "Composed but slightly held-breath posture, cool taupe palette, branching tension in hands or gaze.",
    riskNote: "Avoid incompetence framing.",
    traitChips: ["比較", "保留", "再検討"],
  },
  {
    personaId: "P13",
    structuralWorkingName: "The Friction Runner",
    officialPublicPersonaName: "熱先行",
    socialHandle: "点火は早いのに燃費が続かない人",
    functionalSubtitle: "始める力は強いが、持久戦は苦手な人。",
    publicSign: "先・表・柔・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P10", "P15", "P25"],
    currentModeVariants: ["点火", "飛び出し", "失速"],
    mythCrestMotifCandidate: "導火線 / spark fuse / broken flame",
    shareCardHookDirection: "始まりだけ異様に速い人、ほんとこれ。",
    visualPromptDirection: "Ignited posture, forward energy with loose finish, electric amber accent, spark over endurance.",
    riskNote: "Avoid flaky or clown framing.",
    traitChips: ["点火の速さ", "燃費の波", "前のめり"],
  },
  {
    personaId: "P14",
    structuralWorkingName: "The Long-Burn Builder",
    officialPublicPersonaName: "積み上げ",
    socialHandle: "派手じゃないのに最後まで残る人",
    functionalSubtitle: "遅く見えても、止まりにくい人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P26", "P11", "P25"],
    currentModeVariants: ["定着", "耐久", "反復"],
    mythCrestMotifCandidate: "年輪 / stacked stone / quiet build",
    shareCardHookDirection: "目立たないのに、最後まで残ってる人。",
    visualPromptDirection: "Planted stance, earthy palette, durable calm, minimal motion.",
    riskNote: "Avoid boring or dull framing.",
    traitChips: ["積み上げ", "止まりにくさ", "反復の強さ"],
  },
  {
    personaId: "P15",
    structuralWorkingName: "The Novelty Hunter",
    officialPublicPersonaName: "刺激追い",
    socialHandle: "予定より新しさに反応する人",
    functionalSubtitle: "新しい刺激で熱が上がる人。",
    publicSign: "先・表・柔・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P10", "P17", "P25"],
    currentModeVariants: ["探索", "刺激", "浮遊"],
    mythCrestMotifCandidate: "風跡 / trail line / shifting light",
    shareCardHookDirection: "同じ日々が続くと、先に心が飽きる人。",
    visualPromptDirection: "Curious tilt, airy wind palette, restless eyes, freshness over rootedness.",
    riskNote: "Avoid shallow dopamine-junkie framing.",
    traitChips: ["新しさへの反応", "刺激の点火", "飽きの早さ"],
  },
  {
    personaId: "P16",
    structuralWorkingName: "The Stable Dweller",
    officialPublicPersonaName: "安定圏",
    socialHandle: "変化より落ち着く場所を選ぶ人",
    functionalSubtitle: "知っている地面で力を出す人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P18", "P20", "P26"],
    currentModeVariants: ["定住", "保持", "休整"],
    mythCrestMotifCandidate: "庭石 / settled ring / still ground",
    shareCardHookDirection: "変化がなくてもちゃんと生きていける人、実は強い。",
    visualPromptDirection: "Settled posture, soft stable neutrals, home-like calm, low drama.",
    riskNote: "Avoid stagnant no-growth framing.",
    traitChips: ["落ち着く場所", "地面の安定", "変化より定着"],
  },
  {
    personaId: "P17",
    structuralWorkingName: "The Calm Gambler",
    officialPublicPersonaName: "平然跳び",
    socialHandle: "不確実でも顔色変えずに踏み出す人",
    functionalSubtitle: "危なさを怖がりすぎず動ける人。",
    publicSign: "先・秘・刃・走",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P10", "P15", "P28"],
    currentModeVariants: ["跳躍", "賭け", "軽快"],
    mythCrestMotifCandidate: "跳び石 / open sky / clean leap mark",
    shareCardHookDirection: "不確実でも顔色ひとつ変えずに跳ぶ人、これでしょ。",
    visualPromptDirection: "Relaxed gaze with forward lean, cool steel and sky accents, ease inside uncertainty.",
    riskNote: "Avoid casino-gambler trope excess.",
    traitChips: ["跳ぶ勇気", "不確実への平気さ", "軽快な着地"],
  },
  {
    personaId: "P18",
    structuralWorkingName: "The Safety Sculptor",
    officialPublicPersonaName: "安全組み",
    socialHandle: "飛ぶ前にリスクを飼いならす人",
    functionalSubtitle: "先に安全地帯を作ってから入る人。",
    publicSign: "受・秘・刃・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P11", "P12", "P16"],
    currentModeVariants: ["整備", "予防", "制御"],
    mythCrestMotifCandidate: "囲い / measured frame / protective knot",
    shareCardHookDirection: "飛び込む前に安全地帯を作る人。",
    visualPromptDirection: "Deliberate posture, ordered hands, controlled neutral palette, engineered safety.",
    riskNote: "Avoid fearfulness-only framing.",
    traitChips: ["安全地帯づくり", "リスクの飼いならし", "先に整える"],
  },
  {
    personaId: "P19",
    structuralWorkingName: "The Closeness Seeker",
    officialPublicPersonaName: "安心待ち",
    socialHandle: "先に大丈夫がないと動けない人",
    functionalSubtitle: "確かめられると、心が動き出す人。",
    publicSign: "受・表・柔・組",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P01", "P06", "P29"],
    currentModeVariants: ["確認", "密着", "不安"],
    mythCrestMotifCandidate: "鈴 / red thread / small bell mark",
    shareCardHookDirection: "先に大丈夫がないと動けない人、これでしょ。",
    visualPromptDirection: "Open eyes seeking cue, soft rose and ivory palette, reassurance hunger without melodrama.",
    riskNote: "Avoid clingy or shaming read.",
    traitChips: ["安心の下ごしらえ", "見落としの拾い上げ", "進む前の整え"],
  },
  {
    personaId: "P20",
    structuralWorkingName: "The Self-Contained Orbit",
    officialPublicPersonaName: "間合い持ち",
    socialHandle: "近いけど依存は見せない人",
    functionalSubtitle: "距離を守りながら、深くつながる人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P04", "P16", "P30"],
    currentModeVariants: ["自圏", "半歩", "私温"],
    mythCrestMotifCandidate: "円環 / small orbit / private moon ring",
    shareCardHookDirection: "近いのに、あと半歩だけ自分の間合いを残す人。",
    visualPromptDirection: "Half-open posture, private gaze, muted indigo palette, warmth kept behind distance.",
    riskNote: "Avoid avoidant or cold stereotype.",
    traitChips: ["距離の守り方", "依存しすぎ回避", "深くつながる"],
  },
  {
    personaId: "P21",
    structuralWorkingName: "The Social Chameleon",
    officialPublicPersonaName: "空気合わせ",
    socialHandle: "場に合わせるのが速すぎる人",
    functionalSubtitle: "その場の温度に合わせて形を変える人。",
    publicSign: "先・表・柔・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P02", "P27", "P22"],
    currentModeVariants: ["同調", "擬態", "退色"],
    mythCrestMotifCandidate: "鏡面 / mask edge / shifting ripple",
    shareCardHookDirection: "場に合わせるのが速すぎて、本音の置き場所が迷子になる人。",
    visualPromptDirection: "Adaptable expression, slightly shifting angle, reflective silver accents, room-reading alertness.",
    riskNote: "Avoid fake or manipulative framing.",
    traitChips: ["場への同調", "擬態の速さ", "本音の置き場"],
  },
  {
    personaId: "P22",
    structuralWorkingName: "The Transparent Self",
    officialPublicPersonaName: "地声",
    socialHandle: "表に出してる自分と中身が近い人",
    functionalSubtitle: "見える自分が、そのまま本音に近い人。",
    publicSign: "先・表・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P21", "P30", "P29"],
    currentModeVariants: ["素顔", "直線", "一致"],
    mythCrestMotifCandidate: "水鏡 / clear surface / open seal",
    shareCardHookDirection: "表に出してる自分と中身がちゃんと近い人。",
    visualPromptDirection: "Steady direct gaze, clean water-light palette, no visible mask.",
    riskNote: "Avoid moral-superiority tone.",
    traitChips: ["表と中の近さ", "素顔の一致", "隠しすぎない"],
  },
  {
    personaId: "P23",
    structuralWorkingName: "The Story-Seeker",
    officialPublicPersonaName: "意味探し",
    socialHandle: "普通の出来事でも裏テーマを探す人",
    functionalSubtitle: "表面より、その先の意味を追う人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P31", "P25", "P26"],
    currentModeVariants: ["解釈", "投影", "意味化"],
    mythCrestMotifCandidate: "星図 / path marker / layered lantern",
    shareCardHookDirection: "普通の出来事でも、すぐ裏テーマを探し始める人。",
    visualPromptDirection: "Upward or distance gaze, deep midnight and gold accents, meaning-seeking calm.",
    riskNote: "Avoid pseudo-philosophy cliché.",
    traitChips: ["意味の探索", "裏テーマ読み", "解釈の早さ"],
  },
  {
    personaId: "P24",
    structuralWorkingName: "The Practical Surfer",
    officialPublicPersonaName: "回し上手",
    socialHandle: "深さよりまず回るかで見る人",
    functionalSubtitle: "今うまく回るかを先に見る人。",
    publicSign: "先・表・刃・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P11", "P18", "P28"],
    currentModeVariants: ["即応", "実務", "切替"],
    mythCrestMotifCandidate: "舵 / tool mark / current arrow",
    shareCardHookDirection: "深さよりまず回るかどうかで見る人。",
    visualPromptDirection: "Practical stance, efficient frame, slate and khaki palette, present-tense competence.",
    riskNote: "Avoid small-minded anti-depth framing.",
    traitChips: ["回す判断", "実務の即応", "切替の軽さ"],
  },
  {
    personaId: "P25",
    structuralWorkingName: "The Reinvention Engine",
    officialPublicPersonaName: "更新中",
    socialHandle: "今の自分で終わる気がない人",
    functionalSubtitle: "今の自分を更新し続けたい人。",
    publicSign: "先・表・柔・走",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P13", "P14", "P23"],
    currentModeVariants: ["更新", "変身", "伸長"],
    mythCrestMotifCandidate: "脱皮 / fresh leaf / growth ring",
    shareCardHookDirection: "今の自分で終わる気が最初からない人。",
    visualPromptDirection: "Forward growth energy, fresh green and cobalt accents, becoming-driven posture.",
    riskNote: "Avoid hustle-culture cliché.",
    traitChips: ["更新の熱", "変化への前向きさ", "伸び続ける"],
  },
  {
    personaId: "P26",
    structuralWorkingName: "The Quiet Evolver",
    officialPublicPersonaName: "静か更新",
    socialHandle: "大騒ぎせずに変わっていく人",
    functionalSubtitle: "見せずに積み上げて、ちゃんと変わる人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P14", "P23", "P30"],
    currentModeVariants: ["伸び", "蓄積", "静進"],
    mythCrestMotifCandidate: "若木 / silent growth / hidden vein",
    shareCardHookDirection: "大騒ぎせずに、気づいたら前より変わってる人。",
    visualPromptDirection: "Quiet upright posture, soft evergreen and stone palette, patient internal upgrade.",
    riskNote: "Avoid low-energy invisibility.",
    traitChips: ["静かな成長", "積み上げ", "更新の持続"],
  },
  {
    personaId: "P27",
    structuralWorkingName: "The Approval Watcher",
    officialPublicPersonaName: "空気過読",
    socialHandle: "人の目の気圧に先に反応する人",
    functionalSubtitle: "どう見られたかが、先に入ってくる人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P21", "P03", "P19"],
    currentModeVariants: ["警戒", "過読", "硬直"],
    mythCrestMotifCandidate: "風向計 / rippled air / thin alert line",
    shareCardHookDirection: "人の目の気圧に、先に反応してしまう人。",
    visualPromptDirection: "Alert eyes, tightened shoulders, pale gray and amber tension palette, evaluation radar.",
    riskNote: "Avoid vanity or shallow-social read.",
    traitChips: ["空気の過読", "目線の気圧", "警戒の速さ"],
  },
  {
    personaId: "P28",
    structuralWorkingName: "The Rule Break Listener",
    officialPublicPersonaName: "筋通し",
    socialHandle: "穏やかそうなのに従いきらない人",
    functionalSubtitle: "表は柔らかくても、判断は独立している人。",
    publicSign: "先・秘・刃・走",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P07", "P17", "P24"],
    currentModeVariants: ["反骨", "判断", "拒否"],
    mythCrestMotifCandidate: "一本線 / boundary rope / quiet refusal mark",
    shareCardHookDirection: "穏やかそうなのに、筋が通らないと従わない人。",
    visualPromptDirection: "Calm face with firm jaw, black-ink accent, quiet refusal energy.",
    riskNote: "Avoid rebel-for-style trope.",
    traitChips: ["筋の通し方", "穏やかな反骨", "独立判断"],
  },
  {
    personaId: "P29",
    structuralWorkingName: "The Tender Strategist",
    officialPublicPersonaName: "先回り",
    socialHandle: "優しいのに準備まで抜かりない人",
    functionalSubtitle: "気づかいを、構造に変えられる人。",
    publicSign: "先・表・柔・組",
    priorityFlag: "P0 priority test persona",
    neighboringPersonaCandidates: ["P05", "P11", "P19"],
    currentModeVariants: ["采配", "保護", "整流"],
    mythCrestMotifCandidate: "結び目 / folded plan / warm grid",
    shareCardHookDirection: "優しいのに、準備と線引きまで抜かりない人。",
    visualPromptDirection: "Warm eyes with composed hands, structured soft palette, care with design.",
    riskNote: "Avoid scheming or manipulative misread.",
    traitChips: ["先回り", "構造への気づかい", "柔らかな準備"],
  },
  {
    personaId: "P30",
    structuralWorkingName: "The Slow Trust Keeper",
    officialPublicPersonaName: "鍵つき",
    socialHandle: "心のドアを開けるまで長い人",
    functionalSubtitle: "信頼は遅いが、一度入れると深い人。",
    publicSign: "受・秘・刃・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P04", "P20", "P22"],
    currentModeVariants: ["施錠", "解錠", "固着"],
    mythCrestMotifCandidate: "鍵穴 / door plate / oath seal",
    shareCardHookDirection: "心の鍵を開けるまで長いのに、一度開くと深い人。",
    visualPromptDirection: "Closed posture that still reads loyal, key-threshold motif, muted navy and bronze palette.",
    riskNote: "Avoid trauma-coded over-pathologizing.",
    traitChips: ["信頼の遅さ", "開けるまで長い", "深く入る"],
  },
  {
    personaId: "P31",
    structuralWorkingName: "The Inner Wanderer",
    officialPublicPersonaName: "内めぐり",
    socialHandle: "自分の輪郭が少しずつ動く人",
    functionalSubtitle: "自分を固定しすぎず、探し続ける人。",
    publicSign: "受・秘・柔・組",
    priorityFlag: "P1",
    neighboringPersonaCandidates: ["P23", "P26", "P27"],
    currentModeVariants: ["漂流", "再定義", "内省"],
    mythCrestMotifCandidate: "潮流 / travel map / soft orbit drift",
    shareCardHookDirection: "自分の輪郭が、いつも少しだけ動いてる人。",
    visualPromptDirection: "Reflective moving gaze, layered neutral palette, shifting identity without chaos.",
    riskNote: "Avoid chaos, mystic fog, or vague-poetic collapse.",
    traitChips: ["輪郭の変化", "内省の流れ", "探し続ける"],
  },
] as const;

const ANNEX_A_LOOKUP = new Map(YORISOU_PERSONA_ANNEX_A_ROWS.map((row) => [row.personaId, row]));

export function isYorisouPublicSign(value: string): value is string {
  return YORISOU_PUBLIC_SIGN_REGEX.test(value);
}

export function getPersonaAnnexARow(personaId: string) {
  return ANNEX_A_LOOKUP.get(personaId as PersonaAnnexARow["personaId"]) || null;
}

export function assertPersonaAnnexACompleteness() {
  const errors: string[] = [];
  const rows = YORISOU_PERSONA_ANNEX_A_ROWS;

  ensureEqual(rows.length, 31, "annex_a_row_count_must_be_31");
  ensureEqual(new Set(rows.map((row) => row.personaId)).size, 31, "annex_a_persona_ids_must_be_unique");

  for (let index = 1; index <= 31; index += 1) {
    const personaId = `P${String(index).padStart(2, "0")}`;
    const row = getPersonaAnnexARow(personaId);
    if (!row) {
      errors.push(`missing_row:${personaId}`);
      continue;
    }

    ensure(row.structuralWorkingName.trim(), `missing_structural_working_name:${personaId}`);
    ensure(row.officialPublicPersonaName.trim(), `missing_official_name:${personaId}`);
    ensure(row.socialHandle.trim(), `missing_social_handle:${personaId}`);
    ensure(row.functionalSubtitle.trim(), `missing_functional_subtitle:${personaId}`);
    ensure(isYorisouPublicSign(row.publicSign), `invalid_public_sign:${personaId}`);
    ensure(row.currentModeVariants.length === 3, `invalid_current_mode_count:${personaId}`);
    ensure(row.neighboringPersonaCandidates.length >= 2, `invalid_neighbor_candidates:${personaId}`);
    ensure(row.traitChips.length === 3, `invalid_trait_chip_count:${personaId}`);
  }

  const p02 = getPersonaAnnexARow("P02");
  const p11 = getPersonaAnnexARow("P11");
  const p01 = getPersonaAnnexARow("P01");
  const p07 = getPersonaAnnexARow("P07");
  const p09 = getPersonaAnnexARow("P09");

  ensureEqual(p01?.officialPublicPersonaName, "気配読み", "p01_official_name_mismatch");
  ensureEqual(p01?.publicSign, "受・秘・柔・組", "p01_public_sign_mismatch");
  ensureDeepEqual(p01?.currentModeVariants, ["静観", "過敏", "ひらき"], "p01_mode_variants_mismatch");

  ensureEqual(p02?.officialPublicPersonaName, "火つけ", "p02_official_name_mismatch");
  ensureEqual(p02?.socialHandle, "空気より先に熱が出る人", "p02_social_handle_mismatch");
  ensureEqual(p02?.functionalSubtitle, "感情も行動も前に出やすい人。", "p02_functional_subtitle_mismatch");
  ensureEqual(p02?.publicSign, "先・表・柔・走", "p02_public_sign_mismatch");
  ensureDeepEqual(p02?.currentModeVariants, ["点火", "波及", "オフ"], "p02_mode_variants_mismatch");
  ensure(!/段取り|準備|変更の受け身|出る前の余白/.test(`${p02?.functionalSubtitle || ""}${p02?.traitChips.join("") || ""}`), "p02_mixed_row_risk");

  ensureEqual(p07?.officialPublicPersonaName, "霧切り", "p07_official_name_mismatch");
  ensureEqual(p07?.publicSign, "先・表・刃・走", "p07_public_sign_mismatch");
  ensureDeepEqual(p07?.currentModeVariants, ["直断", "切開", "留保"], "p07_mode_variants_mismatch");

  ensureEqual(p09?.officialPublicPersonaName, "堪え込み", "p09_official_name_mismatch");
  ensureEqual(p09?.publicSign, "受・秘・刃・走", "p09_public_sign_mismatch");
  ensureDeepEqual(p09?.currentModeVariants, ["蓄圧", "我慢", "噴出"], "p09_mode_variants_mismatch");

  ensureEqual(p11?.officialPublicPersonaName, "段取り", "p11_official_name_mismatch");
  ensureEqual(p11?.publicSign, "先・秘・刃・組", "p11_public_sign_mismatch");
  ensureDeepEqual(p11?.currentModeVariants, ["設計", "整列", "実装"], "p11_mode_variants_mismatch");

  return {
    version: YORISOU_PERSONA_ANNEX_A_VERSION,
    rows,
    rowCount: rows.length,
    invalidSignsCount: rows.filter((row) => !isYorisouPublicSign(row.publicSign)).length,
    p01: p01,
    p02: p02,
    p07: p07,
    p09: p09,
    p11: p11,
    errors,
  };
}
