export type YorisouDeepResultPersonaId = "P01" | "P02" | "P03";
export type YorisouDeepResultLocale = "ja" | "en";

type YorisouDeepResultCoreContent = {
  persona_id: YorisouDeepResultPersonaId;
  official_public_name: string;
  social_handle: string;
  functional_subtitle: string;
  public_sign: string;
  current_mode: string;
  core_identity: string;
  core_read: string;
  why_this_result_fits: string;
  relationship_pattern: string;
  love_or_close_relationship_pattern: string;
  work_study_pattern: string;
  stress_reaction: string;
  blind_spot: string;
  misunderstanding_pattern: string;
  strength: string;
  risk: string;
  three_small_adjustments: [string, string, string];
  oracle_aftertaste: string;
  oracle_interpretation: string;
  paid_report_preview: string;
  line_continuation_hook: string;
  line_followup_day1: string;
  line_followup_day3: string;
  share_hook: string;
  oracle_line?: string;
  oracle_interpretation_preview?: string;
  deep_report_teaser?: string;
  paywall_hook?: string;
};

export type YorisouDeepResultLocaleContent = YorisouDeepResultCoreContent & {
  oracle_line: string;
  oracle_interpretation_preview: string;
  deep_report_teaser: string;
  paywall_hook: string;
};

type PersonaDeepResultEntry = {
  ja: YorisouDeepResultLocaleContent;
  en: YorisouDeepResultLocaleContent;
};

function finalizeContent(content: YorisouDeepResultCoreContent): YorisouDeepResultLocaleContent {
  return {
    ...content,
    oracle_line: content.oracle_line || content.oracle_aftertaste,
    oracle_interpretation_preview: content.oracle_interpretation_preview || content.oracle_interpretation,
    deep_report_teaser: content.deep_report_teaser || content.paid_report_preview,
    paywall_hook: content.paywall_hook || content.paid_report_preview,
  };
}

const DEEP_RESULT_CONTENT: Record<YorisouDeepResultPersonaId, PersonaDeepResultEntry> = {
  P01: {
    ja: finalizeContent({
      persona_id: "P01",
      official_public_name: "気配読み",
      social_handle: "返信前に一回沈む人",
      functional_subtitle: "先に受け取り、あとから距離を縮める人。",
      public_sign: "受・秘・柔・組",
      current_mode: "静観",
      core_identity:
        "あなたは、相手の熱や空気を先に受け取り、返す前に一度沈めて整える人。沈黙は回避ではなく、受け取ったものを正しく扱うための間です。",
      core_read: "まず受け取り、少し置いてから返す。",
      why_this_result_fits:
        "返事の速さより、場の温度差を外さないことを優先するから、この結果はP01に寄ります。気配のズレを先に感じ取るため、あなたの反応は少し遅れて見えても、実際には内部で丁寧に調整されています。",
      relationship_pattern:
        "近い関係では、すぐに距離を詰めるより、相手の安心が見えてから深く入る。相手の表情、言葉の間、声の高さを見ながら、会話の温度を整えるのが得意です。",
      love_or_close_relationship_pattern:
        "好意があっても先に気持ちを全部出さず、反応の粒度で関係を見ます。焦らずに見守る姿勢は魅力ですが、相手からは『本音が見えにくい』と映ることもあります。",
      work_study_pattern:
        "会議や課題では、最初に空気を読んで論点を整える役回り。急いで答えるより、整理してから返す場面で精度が上がります。割り込みや短い締切が続くと負荷になりやすいです。",
      stress_reaction:
        "刺激や予定変更が重なると、ひとまず沈んで反応を遅らせる。外からは静かに見えても、中では受け取ったものを分類していることが多いです。",
      blind_spot:
        "沈む時間が長くなると、自分の希望を『まだいい』と後回しにしやすい。受け取りの丁寧さが、そのまま自己保留につながる日は要注意です。",
      misunderstanding_pattern:
        "周りからは『静か』『受け身』と見られがちだが、実際は判断中で、遅いほど精度を上げています。止まっているように見える間にも、内側では関係の温度を測り続けています。",
      strength:
        "気配を乱さず、必要な距離を静かに保てる。場の空気を壊さずに、相手が受け取りやすい形へ整え直せるのが強みです。",
      risk:
        "受け取りすぎて疲れると、黙り込みすぎる。優しさが積もるほど、自分の輪郭が薄くならないように境界を持つ必要があります。",
      three_small_adjustments: [
        "返事の前に、いま何を受け取ったかを一行で言葉にする。",
        "沈む前に、相手へ返す順番を一つだけ決める。",
        "迷いが長くなる日は、自分の希望を先にメモしておく。",
      ],
      oracle_aftertaste: "沈むのは、止まるためじゃなく、あとで正しく返すため。",
      oracle_interpretation: "一拍置くのは遅れではなく、返しの精度を上げる準備。",
      paid_report_preview:
        "深読みでは、受け取る速さ、返す順番、境界の引き方を場面ごとに読む。恋愛、仕事、家族の前でどの沈黙が助けになり、どの沈黙が自分を薄めるかまで見ていきます。",
      line_continuation_hook: "返事を急がない時間も、あなたの型のひとつです。",
      line_followup_day1: "今日は、受け取ったものを一行で書いてから返してみてください。",
      line_followup_day3: "三日後には、待つことと逃すことの違いを一つだけ見分けてみてください。",
      share_hook: "返信前に一回沈む人。",
    }),
    en: finalizeContent({
      persona_id: "P01",
      official_public_name: "気配読み",
      social_handle: "The one who pauses before replying",
      functional_subtitle: "You receive first and close the distance later.",
      public_sign: "受・秘・柔・組",
      current_mode: "Steady watch",
      core_identity:
        "You pick up the temperature of a room before you answer. The pause is not avoidance; it is the time you use to place what you received in the right order.",
      core_read: "You take it in first, then answer after a short pause.",
      why_this_result_fits:
        "You read the atmosphere before replying, so the pause is part of your rhythm rather than a delay. What looks slow from the outside is often careful calibration inside.",
      relationship_pattern:
        "You warm up slowly. Conversations deepen once trust is visible, and you tend to feel safer when the other person’s pace is clear.",
      love_or_close_relationship_pattern:
        "Even when you care, you do not show everything at once. That restraint helps you avoid overexposure, but it can also make your feelings harder to read.",
      work_study_pattern:
        "You do well in situations where reading the flow matters. Interruptions and rushed deadlines can feel heavy because they cut into your time to sort what you received.",
      stress_reaction:
        "When the input stacks up, you go quiet and slow the response down. From the outside that can look like distance, but inside you are organizing what landed.",
      blind_spot:
        "If the pause gets too long, your own wishes can get pushed aside. Careful reception can turn into self-delay if you never name what you want.",
      misunderstanding_pattern:
        "People may read you as quiet or passive, but you are usually thinking through the situation. The slower you look, the more you are refining the answer.",
      strength:
        "You keep the atmosphere steady and hold the right distance without noise.",
      risk:
        "If you absorb too much, you can become too quiet and tired.",
      three_small_adjustments: [
        "Before replying, name in one line what you actually received.",
        "Before you pull inward, decide one thing you will answer first.",
        "On slow days, write your own wish down before you wait.",
      ],
      oracle_aftertaste: "You pause not to stop, but to answer well later.",
      oracle_interpretation: "The pause is preparation, not delay.",
      paid_report_preview:
        "The deeper reading shows where your pause builds trust and where it quietly erases your own preference. It follows the same pattern across relationships, work, and family scenes.",
      line_continuation_hook:
        "Today, let the time before replying count as part of your style. In three days, try spotting the difference between waiting and missing the moment.",
      line_followup_day1: "Today, let the time before replying count as part of your style.",
      line_followup_day3: "In three days, try spotting the difference between waiting and missing the moment.",
      share_hook: "The one who pauses before replying.",
    }),
  },
  P02: {
    ja: finalizeContent({
      persona_id: "P02",
      official_public_name: "火つけ",
      social_handle: "空気より先に熱が出る人",
      functional_subtitle: "感情も行動も前に出やすい人。",
      public_sign: "先・表・柔・走",
      current_mode: "点火",
      core_identity:
        "あなたは、空気が動く前に熱を出し、停滞した場に最初の火を入れる人。周囲がまだ言葉にしていないうちに、もう始めたい感覚が立ち上がります。",
      core_read: "先に熱が立ち、場より先に動く。",
      why_this_result_fits:
        "感じたらすぐ動けるので、あなたの熱は周囲の準備より先に現れやすい。止まった空気に触れた瞬間に、流れを変える役割を自然に引き受けています。",
      relationship_pattern:
        "気持ちが通ると一気に近づくが、相手の温度が追いつかないと置いていかれた感じを招く。速さは魅力ですが、相手には『もう少し待って』が必要なこともあります。",
      love_or_close_relationship_pattern:
        "好意は速く伝わるけれど、関係を深めるには相手の整理する時間も要ります。熱のまま押し切るより、一度ことばにしてから進むと誤解が減ります。",
      work_study_pattern:
        "着火役、初動、巻き込みは強い。企画の始動や場の立ち上げに向きますが、細かい調整や長い待機が続くと、自分の熱が持て余されやすいです。",
      stress_reaction:
        "止められると圧がたまり、短く強い言い方や急な行動として出やすい。熱を止めるより、逃がす先を先に用意しておくほうが扱いやすくなります。",
      blind_spot:
        "勢いのあるときほど、相手の準備温度や、説明を受け取る余白を見落としやすい。自分の立ち上がりの速さが、周りにはまだ速すぎることがあります。",
      misunderstanding_pattern:
        "『いつも明るい』『勢いだけ』と見られがちだが、実際は場を動かすための熱。軽さではなく、停滞に火を入れるための反応です。",
      strength:
        "停滞に最初の火を入れられる。動きが止まった場で、最初の一歩を出せるのが強みです。",
      risk:
        "ずっと最大出力だと、自分も周りも疲れやすい。熱を出し続けるより、長く使える形へ変える工夫が必要です。",
      three_small_adjustments: [
        "動く前に、相手の温度を一呼吸だけ見る。",
        "熱を行動だけでなく、一言の説明にも変える。",
        "毎回先頭に立たず、待つ役を一人置く。",
      ],
      oracle_aftertaste: "点いた火は、燃え方を選べる。",
      oracle_interpretation: "速い点火を、長く使える熱に変える余白がある。",
      paid_report_preview:
        "深読みでは、熱の起点、巻き込み方、先走りになりやすい場面を、関係と仕事の両方から読む。熱を止めるのではなく、使いどころを整えるのがこのタイプの本質です。",
      line_continuation_hook: "速さを少し整えると、熱はもっと遠くまで届きます。",
      line_followup_day1: "今日は、動く前に相手の温度を一度見てみてください。",
      line_followup_day3: "三日後には、熱を説明に変える一拍の効きを見てみてください。",
      share_hook: "空気より先に熱が出る人。",
    }),
    en: finalizeContent({
      persona_id: "P02",
      official_public_name: "火つけ",
      social_handle: "The one whose heat shows before the room catches up",
      functional_subtitle: "Your feelings and actions come forward quickly.",
      public_sign: "先・表・柔・走",
      current_mode: "Ignition",
      core_identity:
        "You bring heat into a stagnant room before others have named what is happening. The urge to start is already there while the room is still catching up.",
      core_read: "Your heat rises first, and you move before the room fully settles.",
      why_this_result_fits:
        "Once you feel it, you move. Your energy tends to show up before other people are ready, which is why this result points so clearly to P02.",
      relationship_pattern:
        "Things move fast when the feeling is shared, but a mismatch in temperature can make you feel left behind. Speed is your strength, but not everyone can catch up instantly.",
      love_or_close_relationship_pattern:
        "You reveal interest quickly, yet closeness still needs room to settle. Turning the heat into words first can keep the connection from getting ahead of itself.",
      work_study_pattern:
        "You are strong at ignition, first moves, and bringing others along. Long waiting can drain you, especially when the job needs small adjustments rather than a fresh start.",
      stress_reaction:
        "When held back, the pressure builds and comes out short and strong. It helps to give the heat somewhere to go before it has to burst out.",
      blind_spot:
        "When you are moving fast, it is easy to miss the other person’s readiness. Your timing can be right for you and still feel too fast for the room.",
      misunderstanding_pattern:
        "People may read you as simply loud or impulsive, but your heat is there to move things that have gone stale. It is a functional spark, not just volume.",
      strength:
        "You can light the room up at the start.",
      risk:
        "If the heat stays at maximum, you and the people around you can tire out.",
      three_small_adjustments: [
        "Before you move, give the other side one breath to catch up.",
        "Turn your heat into a short explanation, not only action.",
        "Do not stand at the front every time; leave one person room to wait.",
      ],
      oracle_aftertaste: "A lit fire can still choose how it burns.",
      oracle_interpretation: "Fast ignition can become heat you can use longer.",
      paid_report_preview:
        "The deeper read shows where your spark becomes momentum and where it becomes haste. It helps you keep the ignition while reducing the friction that comes from moving too fast.",
      line_continuation_hook:
        "Today, do not decide by speed alone. Check the other side’s temperature first. In three days, watch how much a short pause can change your spark.",
      line_followup_day1: "Today, do not decide by speed alone. Check the other side’s temperature first.",
      line_followup_day3: "In three days, watch how much a short pause can change your spark.",
      share_hook: "The one whose heat shows before the room catches up.",
    }),
  },
  P03: {
    ja: finalizeContent({
      persona_id: "P03",
      official_public_name: "静燃え",
      social_handle: "平静っぽいのに内側だけ熱い人",
      functional_subtitle: "表面は静かでも、内側の熱が強い人。",
      public_sign: "受・秘・柔・組",
      current_mode: "余熱",
      core_identity:
        "あなたは、外側は静かでも、内側ではずっと火が保たれている人。気持ちを雑に見せたくないからこそ、熱を一度自分の中で抱えて形にしてから出します。",
      core_read: "静かに見えて、内側では熱がずっと動いている。",
      why_this_result_fits:
        "表面を整えながら内側で強く考えるため、この結果はP03に寄ります。落ち着いて見える場面でも、あなたの中では感情や判断がしっかり動いています。",
      relationship_pattern:
        "近い関係では、安心できるまで感情を見せすぎない。だが中ではすでに深く動いていて、信頼ができると一気に熱が伝わります。",
      love_or_close_relationship_pattern:
        "好きな気持ちは薄くないのに、軽く扱われたくなくて慎重になる。雑に見せたくないぶん、相手の軽い扱いに敏感です。",
      work_study_pattern:
        "見た目は落ち着いていても、頭の中ではずっと高温で回っている。集中は深い一方で、周囲からは負荷や熱量が見えにくいことがあります。",
      stress_reaction:
        "抑え込みが長いと、ある日まとめてあふれやすい。静かに耐えられる分、出口を見つける前に溜め込みやすいです。",
      blind_spot:
        "静かに耐えられる分、疲れや困りごとを後回しにしやすい。『まだ大丈夫』が長く続くと、限界の前兆を見逃しやすくなります。",
      misunderstanding_pattern:
        "『冷静』『落ち着いている』と見られがちだが、実際は熱を保ったまま制御している。静かさは無関心ではなく、熱を守るための形です。",
      strength:
        "熱を雑に扱わず、集中として持ち続けられる。",
      risk:
        "我慢を長く続けると、出口が急になる。",
      three_small_adjustments: [
        "熱をためる前に、今の温度を短い言葉にする。",
        "安心できる相手には、早めに一段階だけ本音を出す。",
        "静かさを守る日ほど、疲れのサインを見逃さない。",
      ],
      oracle_aftertaste: "静けさは無熱ではなく、保温された熱。",
      oracle_interpretation: "落ち着きの奥で、感情はすでに動いている。",
      paid_report_preview:
        "深読みでは、静かな表面の下にある熱の保ち方、出し方、関係への影響を丁寧に読む。静かに見える人ほど、熱の出口の設計が重要になります。",
      line_continuation_hook: "静かなままでも、熱はちゃんと届きます。",
      line_followup_day1: "今日は、静かにしている自分の中の熱を一言にしてみてください。",
      line_followup_day3: "三日後には、外に出す前の小さな合図をひとつ見つけてみてください。",
      share_hook: "平静っぽいのに内側だけ熱い人。",
    }),
    en: finalizeContent({
      persona_id: "P03",
      official_public_name: "静燃え",
      social_handle: "The calm-looking one with heat inside",
      functional_subtitle: "You look quiet, but the heat inside is strong.",
      public_sign: "受・秘・柔・組",
      current_mode: "Warm afterglow",
      core_identity:
        "You stay calm on the outside while keeping a strong fire alive inside. You do not want to show feelings carelessly, so you hold them until they have a shape you can trust.",
      core_read: "You look quiet, but the heat keeps moving inside.",
      why_this_result_fits:
        "You keep the outside composed while thinking hard inside, so this result fits P03. Even when you look calm, your emotions and decisions are already moving.",
      relationship_pattern:
        "In close relationships, you do not reveal everything until it feels safe. Once trust is there, the warmth runs deep and quietly strong.",
      love_or_close_relationship_pattern:
        "You do care deeply, but you are careful not to let that care be treated lightly. Because you protect the feeling, you can also become sensitive to careless treatment.",
      work_study_pattern:
        "You may look calm, yet your mind keeps running hot. You can concentrate deeply, but others may not notice how much energy is held inside.",
      stress_reaction:
        "If you keep holding it in, the pressure can come out all at once. Quiet endurance is useful until it starts to hide the exit.",
      blind_spot:
        "Because you can endure quietly, you may postpone your own fatigue. If 'I’m fine' lasts too long, the warning signs become easy to miss.",
      misunderstanding_pattern:
        "People may see you as simply calm, but you are really controlling a strong inner heat. The stillness is a shape that protects the fire.",
      strength:
        "You can keep heat alive without handling it carelessly.",
      risk:
        "Long restraint can make the release feel sudden.",
      three_small_adjustments: [
        "Before the heat builds, name its temperature in a short phrase.",
        "With people you trust, let one layer of truth out earlier.",
        "On quiet days, keep an eye on the signs of fatigue.",
      ],
      oracle_aftertaste: "Quietness is not coldness; it is heat kept warm.",
      oracle_interpretation: "Under the calm surface, the feeling is already moving.",
      paid_report_preview:
        "The deeper read shows how you hold heat, how you release it, and how it changes relationships. For this type, the design of the exit matters as much as the feeling itself.",
      line_continuation_hook:
        "Today, treat the heat inside you as real even when you look calm. In three days, look for one small sign before the heat needs to come out.",
      line_followup_day1: "Today, treat the heat inside you as real even when you look calm.",
      line_followup_day3: "In three days, look for one small sign before the heat needs to come out.",
      share_hook: "The calm-looking one with heat inside.",
    }),
  },
};

export function hasYorisouDeepResultContent(personaId: string) {
  return personaId === "P01" || personaId === "P02" || personaId === "P03";
}

export function getYorisouDeepResultContent(personaId: string, locale: YorisouDeepResultLocale = "ja") {
  if (!hasYorisouDeepResultContent(personaId)) {
    return null;
  }

  const entry = DEEP_RESULT_CONTENT[personaId];
  return entry[locale];
}
