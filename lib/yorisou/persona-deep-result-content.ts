export type YorisouDeepResultPersonaId = "P01" | "P02" | "P03";
export type YorisouDeepResultLocale = "ja" | "en";

export type YorisouDeepResultLocaleContent = {
  persona_id: YorisouDeepResultPersonaId;
  official_public_name: string;
  social_handle: string;
  functional_subtitle: string;
  public_sign: string;
  current_mode: string;
  core_read: string;
  why_this_result: string;
  relationship_pattern: string;
  work_study_pattern: string;
  stress_reaction: string;
  blind_spot: string;
  strength: string;
  risk: string;
  three_small_adjustments: [string, string, string];
  oracle_line: string;
  oracle_interpretation_preview: string;
  deep_report_teaser: string;
  line_followup_day1: string;
  line_followup_day3: string;
  share_hook: string;
  paywall_hook: string;
};

type PersonaDeepResultEntry = {
  ja: YorisouDeepResultLocaleContent;
  en: YorisouDeepResultLocaleContent;
};

const DEEP_RESULT_CONTENT: Record<YorisouDeepResultPersonaId, PersonaDeepResultEntry> = {
  P01: {
    ja: {
      persona_id: "P01",
      official_public_name: "気配読み",
      social_handle: "返信前に一回沈む人",
      functional_subtitle: "先に受け取り、あとから距離を縮める人。",
      public_sign: "受・秘・柔・組",
      current_mode: "静観",
      core_read: "まず受け取り、少し置いてから返す。",
      why_this_result:
        "相手の温度や場の空気を先に読むから、すぐに返事をしない時間も含めてあなたの自然な動きになっている。",
      relationship_pattern:
        "近づき方はゆっくり。急に詰めるより、信頼の土台が見えてから会話が深くなる。",
      work_study_pattern:
        "流れを読む仕事や、先に状況を整理できる場面で強い。急な割り込みは負荷になりやすい。",
      stress_reaction: "刺激が重なると一度沈んで、反応を遅らせる。",
      blind_spot: "様子見が長引くと、自分の希望を後回しにしやすい。",
      strength: "気配を乱さず、必要な距離を静かに保てる。",
      risk: "受け取りすぎて疲れると、黙り込みすぎる。",
      three_small_adjustments: [
        "返事の前に、いま何を受け取ったかを一行で言葉にする。",
        "沈む前に、相手へ返す順番を一つだけ決める。",
        "迷いが長くなる日は、自分の希望を先にメモしておく。",
      ],
      oracle_line: "沈むのは、止まるためじゃなく、あとで正しく返すため。",
      oracle_interpretation_preview: "一拍置くのは遅れではなく、返しの精度を上げる準備。",
      deep_report_teaser: "あなたの“沈む時間”がどこで信頼に変わるかを、場面別に読む。",
      line_followup_day1: "今日は、返事を急がない時間もあなたの型だと受け取ってみてください。",
      line_followup_day3: "三日後には、待つことと逃すことの違いをひとつだけ見分けてみてください。",
      share_hook: "返信前に一回沈む人。",
      paywall_hook: "深く読むと、待つことが弱さではないと分かる。",
    },
    en: {
      persona_id: "P01",
      official_public_name: "気配読み",
      social_handle: "The one who pauses before replying",
      functional_subtitle: "You receive first and close the distance later.",
      public_sign: "受・秘・柔・組",
      current_mode: "Steady watch",
      core_read: "You take it in first, then answer after a short pause.",
      why_this_result:
        "You read the room before you move, so the pause before replying is part of your natural rhythm, not a delay.",
      relationship_pattern:
        "You warm up slowly. Conversations deepen once trust is visible instead of being rushed.",
      work_study_pattern:
        "You do well where reading the flow matters. Sudden interruptions can feel heavy.",
      stress_reaction: "When the input stacks up, you go quiet and slow the response down.",
      blind_spot: "If the pause gets too long, your own wishes can get pushed aside.",
      strength: "You keep the atmosphere steady and hold the right distance without noise.",
      risk: "If you absorb too much, you can become too quiet and tired.",
      three_small_adjustments: [
        "Before replying, name in one line what you actually received.",
        "Before you pull inward, decide one thing you will answer first.",
        "On slow days, write your own wish down before you wait.",
      ],
      oracle_line: "You pause not to stop, but to answer well later.",
      oracle_interpretation_preview: "The pause is preparation, not delay.",
      deep_report_teaser: "See where your pause becomes trust in real-life scenes.",
      line_followup_day1: "Today, let the time before replying count as part of your style.",
      line_followup_day3: "In three days, try spotting the difference between waiting and missing the moment.",
      share_hook: "The one who pauses before replying.",
      paywall_hook: "Deeper reading shows that waiting is not weakness here.",
    },
  },
  P02: {
    ja: {
      persona_id: "P02",
      official_public_name: "火つけ",
      social_handle: "空気より先に熱が出る人",
      functional_subtitle: "感情も行動も前に出やすい人。",
      public_sign: "先・表・柔・走",
      current_mode: "点火",
      core_read: "先に熱が立ち、場より先に動く。",
      why_this_result:
        "感じたらすぐ動けるので、あなたの熱は周囲の準備より先に現れやすい。",
      relationship_pattern:
        "気持ちが通ると速いが、温度差があると置いていかれた感じを生みやすい。",
      work_study_pattern:
        "着火役、初動、巻き込みは強い。細かい調整や待機が長いと消耗しやすい。",
      stress_reaction: "抑えられるとむしろ圧が増し、短く強く出やすい。",
      blind_spot: "勢いがある時ほど、相手の準備温度を見落としやすい。",
      strength: "空気に火を入れる初動の強さがある。",
      risk: "ずっと強く振ると、自分も周りも疲れやすい。",
      three_small_adjustments: [
        "動く前に、相手の温度を一呼吸だけ見る。",
        "熱を行動だけでなく、一言の説明にも変える。",
        "毎回先頭に立たず、待つ役を一人置く。",
      ],
      oracle_line: "点いた火は、燃え方を選べる。",
      oracle_interpretation_preview: "速い点火を、長く使える熱に変える余白がある。",
      deep_report_teaser: "あなたの熱がどこで人を動かし、どこで先走りになるかを読む。",
      line_followup_day1: "今日は、反応の速さだけで決めず、相手の温度も一度見てみてください。",
      line_followup_day3: "三日後には、熱を出す前の一拍がどれだけ効くかを観察してみてください。",
      share_hook: "空気より先に熱が出る人。",
      paywall_hook: "深く読むと、速い熱をそのまま使わない工夫が見えてくる。",
    },
    en: {
      persona_id: "P02",
      official_public_name: "火つけ",
      social_handle: "The one whose heat shows before the room catches up",
      functional_subtitle: "Your feelings and actions come forward quickly.",
      public_sign: "先・表・柔・走",
      current_mode: "Ignition",
      core_read: "Your heat rises first, and you move before the room fully settles.",
      why_this_result:
        "Once you feel it, you can move. Your energy tends to show up before others are ready.",
      relationship_pattern:
        "Things move fast when the feeling is shared. A gap in temperature can feel like being left behind.",
      work_study_pattern:
        "You are strong at ignition, first moves, and bringing others along. Long waiting can drain you.",
      stress_reaction: "When held back, the pressure builds and comes out short and strong.",
      blind_spot: "When you are moving fast, it is easy to miss the other person's readiness.",
      strength: "You can light the room up at the start.",
      risk: "If the heat stays at maximum, you and the people around you can tire out.",
      three_small_adjustments: [
        "Before you move, give the other side one breath to catch up.",
        "Turn your heat into a short explanation, not only action.",
        "Do not stand at the front every time; leave one person room to wait.",
      ],
      oracle_line: "A lit fire can still choose how it burns.",
      oracle_interpretation_preview: "Fast ignition can become heat you can use longer.",
      deep_report_teaser: "See where your spark moves people and where it becomes haste.",
      line_followup_day1: "Today, do not decide by speed alone. Check the other side's temperature first.",
      line_followup_day3: "In three days, watch how much a short pause can change your spark.",
      share_hook: "The one whose heat shows before the room catches up.",
      paywall_hook: "Deeper reading shows how to use fast heat without burning it out.",
    },
  },
  P03: {
    ja: {
      persona_id: "P03",
      official_public_name: "静燃え",
      social_handle: "平静っぽいのに内側だけ熱い人",
      functional_subtitle: "表面は静かでも、内側の熱が強い人。",
      public_sign: "受・秘・柔・組",
      current_mode: "余熱",
      core_read: "静かに見えて、内側の熱は長く続く。",
      why_this_result:
        "表面は落ち着いていても、内側で温度を保ちながら考えるので、見えない熱が行動ににじむ。",
      relationship_pattern:
        "近すぎると熱を隠し、安心すると少しずつ出す。熱の出し方に段差がある。",
      work_study_pattern:
        "集中を保つ、責任を抱える、静かに積み上げる場で強い。",
      stress_reaction: "抑えすぎると熱が内側で膨らみ、あとでまとめて出やすい。",
      blind_spot: "静かさが得意なぶん、しんどさを周りに見せるのが遅い。",
      strength: "落ち着きと熱を同時に保てる。",
      risk: "抑圧が続くと、説明抜きで急に溢れやすい。",
      three_small_adjustments: [
        "熱を早めに一言へ変えて、外へ少し逃がす。",
        "沈黙の前に、一度だけ小さく出す。",
        "抱え込みは一人で抱えず、小分けにして扱う。",
      ],
      oracle_line: "静かなままでも、火は消えていない。",
      oracle_interpretation_preview: "落ち着きは無熱ではなく、保温された熱。",
      deep_report_teaser: "表に出ない熱が、どこで関係や行動を変えているかを読む。",
      line_followup_day1: "今日は、静かにしている自分の中にも熱がある前提で見てみてください。",
      line_followup_day3: "三日後には、抑え込みが長くなりそうな場面をひとつ早めに言葉へ出してみてください。",
      share_hook: "落ち着いて見えるのに、内側だけずっと気温が高い人。",
      paywall_hook: "深く読むと、静けさの内側にある熱の扱い方が分かる。",
    },
    en: {
      persona_id: "P03",
      official_public_name: "静燃え",
      social_handle: "The one who looks calm but burns hot inside",
      functional_subtitle: "You stay quiet on the surface, but the heat inside runs strong.",
      public_sign: "受・秘・柔・組",
      current_mode: "Residual heat",
      core_read: "You look calm, but your heat lasts a long time inside.",
      why_this_result:
        "Even when you look composed, you keep warmth inside as you think, and that hidden heat shows up in what you do.",
      relationship_pattern:
        "You hide your heat when people get too close, then let it out slowly when it feels safe.",
      work_study_pattern:
        "You are strong in work that needs focus, responsibility, and quiet accumulation.",
      stress_reaction: "If you hold it in too long, the heat builds and comes out all at once later.",
      blind_spot: "Because quiet is your strength, you may show stress too late.",
      strength: "You can hold calm and heat at the same time.",
      risk: "If the pressure keeps building, it can spill out without much explanation.",
      three_small_adjustments: [
        "Turn heat into one short line earlier so some of it leaves the body.",
        "Before going silent, let something small out once.",
        "Do not carry everything alone; split the load into smaller parts.",
      ],
      oracle_line: "Even quietly, the fire is still there.",
      oracle_interpretation_preview: "Calm is not empty; it is heat being held in place.",
      deep_report_teaser: "See where hidden heat changes your choices, relationships, and pace.",
      line_followup_day1: "Today, look at yourself as someone who still has heat even when quiet.",
      line_followup_day3: "In three days, name one situation early if you feel yourself starting to hold too much in.",
      share_hook: "The one who looks calm but stays hot inside.",
      paywall_hook: "Deeper reading shows how to handle the heat inside your calm.",
    },
  },
};

function normalizePersonaId(personaId: string): YorisouDeepResultPersonaId | null {
  if (personaId === "P01" || personaId === "P02" || personaId === "P03") {
    return personaId;
  }

  return null;
}

export function hasYorisouDeepResultContent(personaId: string) {
  return normalizePersonaId(personaId) !== null;
}

export function getYorisouDeepResultContent(personaId: string, locale: YorisouDeepResultLocale = "ja") {
  const normalized = normalizePersonaId(personaId);
  if (!normalized) {
    return null;
  }

  return DEEP_RESULT_CONTENT[normalized][locale];
}

