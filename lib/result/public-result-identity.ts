import deepReportScaffoldJson from "@/docs/yorisou_deep_report_scaffold_2026-04-13/yorisou_deep_report_scaffold_v1.json";
import shareCardLogicJson from "@/docs/yorisou_share_card_logic_2026-04-13/yorisou_share_card_logic_v1.json";
import teaserLayerJson from "@/docs/yorisou_teaser_result_layer_2026-04-13/yorisou_teaser_result_layer_v1.json";

import type { ResultLabSnapshot } from "@/lib/result/rendering-contract-adapter";
import type { ResultVisualFamilyKey } from "@/lib/result/visual-asset-chain";
import { getPersonaAnnexARow } from "@/lib/yorisou/dte/persona-annex-a";

type TeaserPersonaRow = {
  persona_id: string;
  working_name: string;
  structural_teaser_summary: string;
  recommended_teaser_line_jp: string;
  internal_logic_gloss_en: string;
  screenshot_value_note?: string;
};

type ShareCardPersonaRow = {
  persona_id: string;
  working_name: string;
  structural_share_card_summary: string;
  recommended_share_card_line_jp: string;
  internal_logic_gloss_en: string;
};

type DeepReportPersonaRow = {
  persona_id: string;
  working_name: string;
  scaffold_summary: string;
  deep_report_core_identity: string;
  internal_logic_gloss_en?: string;
};

type TeaserLayerJson = {
  personas: TeaserPersonaRow[];
};

type ShareCardLogicJson = {
  personas: ShareCardPersonaRow[];
};

type DeepReportScaffoldJson = {
  personas: DeepReportPersonaRow[];
};

export type PublicResultStepCopy = {
  resultPrimaryCtaJa: string;
  resultPrimaryHintJa: string;
  continueTitleJa: string;
  continueSummaryJa: string;
  continueShareLabelJa: string;
  continueShareHintJa: string;
  continueDetailsLabelJa: string;
  continueDetailsHintJa: string;
  continueCompanionLabelJa: string;
  continueCompanionHintJa: string;
  continueRecurringLabelJa: string;
  continueRecurringHintJa: string;
  companionTitleJa: string;
  companionSummaryJa: string;
  companionPrimaryLabelJa: string;
  companionPrimaryHintJa: string;
  companionDeeperLabelJa: string;
  companionRecurringLabelJa: string;
  returnTitleJa: string;
  returnSummaryJa: string;
  returnStartLabelJa: string;
  returnChoicePromptJa: string;
  returnChoiceHelperJa: string;
  returnDoneLeadJa: string;
};

export type PublicResultVisualIdentity = {
  familyKey: ResultVisualFamilyKey;
  crestDirectionJa: string;
  heroDirectionJa: string;
  motifGrammarJa: string;
  paletteDirectionJa: string;
  symbolicLogicJa: string[];
  forbiddenVisualLogicJa: string[];
  polishedTier: "core" | "standard";
};

export type PublicResultIdentity = {
  personaId: string;
  internalWorkingName: string;
  mythArchetypeLabelJa: string;
  contemporarySocialLabelJa: string;
  functionalSubtitleJa: string;
  hookLineJa: string;
  traitChipsJa: string[];
  shareSendLineJa: string;
  nextMoveLineJa: string;
  paywallTeaseJa: string;
  stepCopy: PublicResultStepCopy;
  visualIdentity: PublicResultVisualIdentity;
  publicResultLabelJa: string;
  publicSubtitleJa: string;
  shortResultHookJa: string;
  shareLineJa: string;
  teaserLineJa: string;
  shareCategoryTagJa: string;
  shareOtherReadableJa: string;
  shareTensionLineJa: string;
  shareSocialHookJa: string;
  publicResultLabelEn: string;
  publicSubtitleEn: string;
  shortResultHookEn: string;
  shareLineEn: string;
  teaserLineEn: string;
  paywallTeaseEn: string;
};

type BuildPublicResultIdentityInput = {
  personaId: string;
  payload?: ResultLabSnapshot["payload"] | null;
  sourceResultLabel?: string | null;
  sourceResultSummary?: string | null;
  sourceShareLine?: string | null;
  sourceTeaserLine?: string | null;
  sourcePaywallTease?: string | null;
};

type PersonaPackSeed = {
  mythArchetypeLabelJa: string;
  contemporarySocialLabelJa: string;
  functionalSubtitleJa: string;
  hookLineJa: string;
  traitChipsJa: [string, string, string];
  shareSendLineJa: string;
  nextMoveLineJa: string;
  paywallTeaseJa: string;
  publicResultLabelEn: string;
  publicSubtitleEn: string;
  shortResultHookEn: string;
  shareLineEn: string;
  teaserLineEn: string;
  paywallTeaseEn: string;
  shareOtherReadableJa?: string;
  shareTensionLineJa?: string;
  shareSocialHookJa?: string;
  stepCopyJa?: Partial<PublicResultStepCopy>;
  visualIdentityJa?: Partial<Omit<PublicResultVisualIdentity, "familyKey">>;
};

const teaserLayer = teaserLayerJson as TeaserLayerJson;
const shareCardLayer = shareCardLogicJson as ShareCardLogicJson;
const deepReportLayer = deepReportScaffoldJson as DeepReportScaffoldJson;

const TEASER_LOOKUP = new Map(teaserLayer.personas.map((entry) => [entry.persona_id, entry]));
const SHARE_LOOKUP = new Map(shareCardLayer.personas.map((entry) => [entry.persona_id, entry]));
const DEEP_LOOKUP = new Map(deepReportLayer.personas.map((entry) => [entry.persona_id, entry]));

const PERSONA_PACK: Record<string, PersonaPackSeed> = {
  P01: {
    mythArchetypeLabelJa: "暁導の段取り",
    contemporarySocialLabelJa: "朝の順番で今日を動かす人。",
    functionalSubtitleJa: "起きてから出るまでの並びを、自分の呼吸で整える。",
    hookLineJa: "朝の一手が、今日の手触りを決める。",
    traitChipsJa: ["朝の初速", "出発の並べ替え", "先回りの一手"],
    shareSendLineJa: "朝の順番で動くタイプ。",
    nextMoveLineJa: "この朝の流れを、もう半歩だけ開く。",
    paywallTeaseJa: "朝の立ち上がりがどう整い、どこで勢いが噛み合うかを深読みする。",
    publicResultLabelEn: "Dawn starter",
    publicSubtitleEn: "You set the day in motion before the world fully wakes up.",
    shortResultHookEn: "One morning move sets the day.",
    shareLineEn: "You take the day early.",
    teaserLineEn: "Open the shape of your morning momentum.",
    paywallTeaseEn: "Read how your morning order becomes your daily pace.",
    shareOtherReadableJa: "暁導の段取り。朝の流れを先に整えておく人。",
    shareTensionLineJa: "朝の順番が崩れるとちょっと不機嫌。",
    shareSocialHookJa: "朝だけ妙に手順が細かい人、ほんとそれ。",
    stepCopyJa: {
      continueTitleJa: "朝の順番を、もう半歩だけ開く。",
      continueSummaryJa: "送る、深く読む、近い場面で確かめる。朝の型を崩さずに次だけ選べる。",
      continueShareHintJa: "一言送るだけで、このタイプの空気が伝わる。",
      companionTitleJa: "朝の型が出る場面だけ、近くで見る。",
      returnTitleJa: "暁導の段取り の返り道",
      returnChoicePromptJa: "朝の型をもう一度見るなら、どこから確かめる？",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "夜明けの門を一筆で切る印。",
      heroDirectionJa: "朝の余白にひと筋の流れが立ち上がる構図。",
      motifGrammarJa: "薄い朝霧、門前の線、立ち上がる余白。",
      symbolicLogicJa: ["夜明けの門", "立ち上がる線", "先回りの余白"],
    },
  },
  P02: {
    mythArchetypeLabelJa: "火つけ",
    contemporarySocialLabelJa: "空気より先に熱が出る人",
    functionalSubtitleJa: "感情も行動も前に出やすい人。",
    hookLineJa: "空気より先に、熱が点く。",
    traitChipsJa: ["熱の立ち上がり", "場の先取り", "切替の速さ"],
    shareSendLineJa: "なんかこの人だけ感情の点灯が早い、いるよね。",
    nextMoveLineJa: "この点火の速さを、次で半歩だけ見る。",
    paywallTeaseJa: "点火の速さが、どこで勢いに変わりやすいかを深読みする。",
    publicResultLabelEn: "Visible spark",
    publicSubtitleEn: "You light up faster than the room expects.",
    shortResultHookEn: "You are the spark that shows first.",
    shareLineEn: "You light up before the room does.",
    teaserLineEn: "See where your spark starts the day.",
    paywallTeaseEn: "Read how your early spark turns into motion.",
    shareOtherReadableJa: "火つけ。空気より先に熱が出る人。",
    shareSocialHookJa: "感情の点灯が早い人、ほんとそれ。",
  },
  P03: {
    mythArchetypeLabelJa: "切替の実務",
    contemporarySocialLabelJa: "手数で流れを止めない人。",
    functionalSubtitleJa: "切り替えを細かく刻みながら、負荷をためすぎずに回していく。",
    hookLineJa: "切り替えの速さが、そのまま軽さになる。",
    traitChipsJa: ["切替の速さ", "抱えすぎ回避", "実務の回し方"],
    shareSendLineJa: "切り替えで重さを逃がすタイプ。",
    nextMoveLineJa: "手数のさばき方を、近い場面で見直す。",
    paywallTeaseJa: "切り替えの癖と負荷の逃がし方を、場面ごとに読む。",
    publicResultLabelEn: "Switch-work operator",
    publicSubtitleEn: "You keep moving by slicing work into clean handoffs.",
    shortResultHookEn: "Fast switching makes the load lighter.",
    shareLineEn: "You survive by switching cleanly.",
    teaserLineEn: "See how your handoffs keep the day from stacking.",
    paywallTeaseEn: "Read how your switching style prevents overload.",
  },
  P04: {
    mythArchetypeLabelJa: "月彩の買い回り",
    contemporarySocialLabelJa: "用事のついでに、気分まで戻す人。",
    functionalSubtitleJa: "出かける用事の中に、小さな回復まで自然に混ぜ込める。",
    hookLineJa: "用事の帰りに、気分まで少し持ち直す。",
    traitChipsJa: ["買い回りの勘", "気分の戻し方", "寄り道の温度"],
    shareSendLineJa: "用事の中に回復も混ぜるタイプ。",
    nextMoveLineJa: "この小回復の入り方を、もう少し開く。",
    paywallTeaseJa: "実務と小さな回復がどう同居しているかを深読みする。",
    publicResultLabelEn: "Moon-market runner",
    publicSubtitleEn: "You mix errands with small lifts that keep the mood alive.",
    shortResultHookEn: "Errands can still leave a little glow.",
    shareLineEn: "You mix errands with a small lift.",
    teaserLineEn: "See where recovery sneaks into the routine.",
    paywallTeaseEn: "Read how practical movement and small recovery overlap.",
  },
  P05: {
    mythArchetypeLabelJa: "雨避の歩み",
    contemporarySocialLabelJa: "無理の少ない道を先に選ぶ人。",
    functionalSubtitleJa: "天候や段差の負担を先に読み、軽く進めるほうへ歩幅を寄せる。",
    hookLineJa: "進める道より、続けられる道を選ぶ。",
    traitChipsJa: ["負担の見取り", "天気の読み", "歩幅の守り"],
    shareSendLineJa: "無理の少ない道を選ぶタイプ。",
    nextMoveLineJa: "その守り方が出る場面を、近くで見る。",
    paywallTeaseJa: "天候・段差・歩幅の選び方がどう安全になるかを読む。",
    publicResultLabelEn: "Rain-shelter pace",
    publicSubtitleEn: "You move by choosing the path you can keep, not just the path you can take.",
    shortResultHookEn: "Choose the path you can keep.",
    shareLineEn: "You choose the lighter path first.",
    teaserLineEn: "See how you protect your own pace.",
    paywallTeaseEn: "Read how weather and friction shape your movement.",
  },
  P06: {
    mythArchetypeLabelJa: "しまい順の手",
    contemporarySocialLabelJa: "片付けの並びが、先に見える人。",
    functionalSubtitleJa: "しまう順が先に立つから、片付けの手が止まりにくい。",
    hookLineJa: "しまう順が見えたら、片付けはもう動き出している。",
    traitChipsJa: ["しまう順", "見た目の収まり", "手が止まらない型"],
    shareSendLineJa: "順番が見えると動けるタイプ。",
    nextMoveLineJa: "その収まり方のクセを、ひとつ深く読む。",
    paywallTeaseJa: "片付けの順序と見た目の整い方を深読みする。",
    publicResultLabelEn: "Order-of-put-away",
    publicSubtitleEn: "Once the order is visible, your hands can keep going.",
    shortResultHookEn: "Seeing the order starts the cleanup.",
    shareLineEn: "You move when the order is visible.",
    teaserLineEn: "See how order turns into motion.",
    paywallTeaseEn: "Read the structure behind tidying and visual calm.",
  },
  P07: {
    mythArchetypeLabelJa: "守門の見張り",
    contemporarySocialLabelJa: "危ないを先に拾っておきたい人。",
    functionalSubtitleJa: "家の中の小さな危険や抜けを、先回りで見つけて安心に変える。",
    hookLineJa: "見逃さない人がいると、家は静かに守られる。",
    traitChipsJa: ["危険の拾い上げ", "先回り確認", "家の守り"],
    shareSendLineJa: "危ないを先に拾うタイプ。",
    nextMoveLineJa: "この守り方の癖を、次でひとつ確かめる。",
    paywallTeaseJa: "家の守りがどこで働き、どこで念押しになるかを深読みする。",
    publicResultLabelEn: "Gatekeeper watch",
    publicSubtitleEn: "You feel calmer when the risky spots are spotted first.",
    shortResultHookEn: "A home feels safer when nothing slips past you.",
    shareLineEn: "You are the one who catches the danger first.",
    teaserLineEn: "See how your watchfulness protects the room.",
    paywallTeaseEn: "Read where your guard becomes reassurance.",
    shareOtherReadableJa: "守門の見張り。危ないを先に拾っておきたい人。",
    shareTensionLineJa: "危ない気配があると先に口を出す。",
    shareSocialHookJa: "その前に危ないって言う人、ほんとそれ。",
    stepCopyJa: {
      continueTitleJa: "守りの勘を、もう半歩だけ開く。",
      continueSummaryJa: "送る、深く読む、近い場面で確かめる。守り方の空気だけを残した。",
      companionTitleJa: "守門の見張り が出る場面だけ確かめる。",
      returnTitleJa: "守門の見張り の返り道",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "門の継ぎ目に置く見張り印。",
      heroDirectionJa: "静かな室内に、ひとつだけ守りの線が立つ構図。",
      motifGrammarJa: "戸口、角、見回りの軌跡、静かな緊張。",
      symbolicLogicJa: ["門の継ぎ目", "見回りの線", "家を守る角"],
    },
  },
  P08: {
    mythArchetypeLabelJa: "変わり目の調整",
    contemporarySocialLabelJa: "変化のあとを、きれいに着地させる人。",
    functionalSubtitleJa: "変わった直後ほど押し切らず、無理のない着地へ流れを寄せる。",
    hookLineJa: "変わり目は、速さより着地で品が出る。",
    traitChipsJa: ["着地の勘", "切替の減速", "現実への寄せ"],
    shareSendLineJa: "変化のあとを整えるタイプ。",
    nextMoveLineJa: "その着地のうまさを、近い場面で見直す。",
    paywallTeaseJa: "変わったあとの収まり方と、無理のなさを深読みする。",
    publicResultLabelEn: "Landing adjuster",
    publicSubtitleEn: "You settle change by choosing the clean landing over the noisy rush.",
    shortResultHookEn: "Change is won at the landing.",
    shareLineEn: "You settle into the shape of change.",
    teaserLineEn: "See how you land after the turn.",
    paywallTeaseEn: "Read how you settle after change without forcing speed.",
  },
  P09: {
    mythArchetypeLabelJa: "返しの温度",
    contemporarySocialLabelJa: "LINEの一言で空気を変える人。",
    functionalSubtitleJa: "返す速さより、返し方の温度で場の気配を整えていく。",
    hookLineJa: "一言の返しで、その場の空気は変わる。",
    traitChipsJa: ["返信の温度", "間の取り方", "空気の整え"],
    shareSendLineJa: "返し方で空気を整えるタイプ。",
    nextMoveLineJa: "その温度差が出る場面を、次で近く見る。",
    paywallTeaseJa: "返す速さと温度が、相手との距離をどう変えるかを深読みする。",
    publicResultLabelEn: "Reply temperature",
    publicSubtitleEn: "You shape the mood of the chat through tone more than speed.",
    shortResultHookEn: "One reply changes the air.",
    shareLineEn: "You change the air with the reply itself.",
    teaserLineEn: "See where your tone works harder than speed.",
    paywallTeaseEn: "Read how tone and timing shape your distance from others.",
    shareOtherReadableJa: "返しの温度。返す速さより、返し方の空気で伝える人。",
    shareTensionLineJa: "返す温度が合わないとちょっと冷える。",
    shareSocialHookJa: "返信の一言だけ妙に空気ある人、ほんとそれ。",
    stepCopyJa: {
      continueTitleJa: "返しの温度を、もう半歩だけ開く。",
      continueShareLabelJa: "この空気を送る",
      continueShareHintJa: "一言だけでも、このタイプの温度は伝わる。",
      companionTitleJa: "返しの温度 が出る場面だけ近く見る。",
      returnTitleJa: "返しの温度 の返り道",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "言葉の間に置く温度印。",
      heroDirectionJa: "余白の多い会話面に、ひとつだけ温度の残像が灯る構図。",
      motifGrammarJa: "吹き出しではなく、返答の余熱と間の弧線。",
      symbolicLogicJa: ["言葉の余熱", "間の弧線", "空気の反射"],
    },
  },
  P10: {
    mythArchetypeLabelJa: "家族の一声",
    contemporarySocialLabelJa: "家の流れを、ひと声で動かす人。",
    functionalSubtitleJa: "長く説明しなくても、ちょうどいい一声で家の実務が回り出す。",
    hookLineJa: "ひと声きれいに入ると、家の流れは軽くなる。",
    traitChipsJa: ["家族への切り出し", "短い伝達", "家の実務連携"],
    shareSendLineJa: "一声で家を動かすタイプ。",
    nextMoveLineJa: "その一声の効き方を、場面ごとに見る。",
    paywallTeaseJa: "家族への切り出し方と、伝わりやすい実務連携を読む。",
    publicResultLabelEn: "Family signal",
    publicSubtitleEn: "A short line from you can get the household moving.",
    shortResultHookEn: "One line can move the house.",
    shareLineEn: "You move the house with one line.",
    teaserLineEn: "See how your short signal gets through.",
    paywallTeaseEn: "Read how your family communication stays practical and clear.",
  },
  P11: {
    mythArchetypeLabelJa: "静月の回復",
    contemporarySocialLabelJa: "静かなひとり時間で戻る人。",
    functionalSubtitleJa: "にぎやかさより、静かな余白で気力を戻すほうが合っている。",
    hookLineJa: "回復は、静かな時間のほうが深く入る。",
    traitChipsJa: ["ひとりの余白", "静かな回復", "気力の戻し方"],
    shareSendLineJa: "静かな余白で戻るタイプ。",
    nextMoveLineJa: "その静けさが効く場面を、もう少し近く見る。",
    paywallTeaseJa: "静かな回復がどこで深く効き、どこで不足するかを深読みする。",
    publicResultLabelEn: "Quiet-moon recovery",
    publicSubtitleEn: "Your energy returns best in stillness, not in noise.",
    shortResultHookEn: "Quiet recovery sinks deeper.",
    shareLineEn: "You recover through quiet space.",
    teaserLineEn: "See where stillness restores you best.",
    paywallTeaseEn: "Read how your quiet recovery deepens and where it thins out.",
    shareOtherReadableJa: "静月の回復。静かな余白でちゃんと戻る人。",
    shareTensionLineJa: "ひとり時間が削られると急に黙る。",
    shareSocialHookJa: "ひとりにしておくと戻る人、ほんとそれ。",
    stepCopyJa: {
      continueTitleJa: "静けさの戻り方を、もう半歩だけ開く。",
      continueSummaryJa: "送る、深く読む、近い場面で確かめる。静かな回復の輪郭だけ残した。",
      companionTitleJa: "静月の回復 が出る場面だけ近く見る。",
      returnTitleJa: "静月の回復 の返り道",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "静かな水面に置く月印。",
      heroDirectionJa: "余白の多い暗がりに、回復の明度だけが残る構図。",
      motifGrammarJa: "静かな水面、薄月、息の浅い波紋。",
      symbolicLogicJa: ["薄月", "水面", "息の波紋"],
    },
  },
  P12: {
    mythArchetypeLabelJa: "夜の余灯",
    contemporarySocialLabelJa: "夜の残量を見ながら動く人。",
    functionalSubtitleJa: "残っている体力を見誤らず、静かに使い切るより残すほうを選ぶ。",
    hookLineJa: "夜は、進む量より残す量で整う。",
    traitChipsJa: ["夜の残量感覚", "省エネの癖", "静かな着地"],
    shareSendLineJa: "夜の残量で動きを決めるタイプ。",
    nextMoveLineJa: "その夜の使い方を、近い場面で見直す。",
    paywallTeaseJa: "夜の省エネと、残しておく回復の勘を深読みする。",
    publicResultLabelEn: "Night reserve glow",
    publicSubtitleEn: "At night you work by what is left, not by what you wish were there.",
    shortResultHookEn: "Night is shaped by what you keep.",
    shareLineEn: "You move by your remaining light.",
    teaserLineEn: "See how you spend the night without overspending yourself.",
    paywallTeaseEn: "Read how you use and preserve your night reserve.",
  },
  P13: {
    mythArchetypeLabelJa: "変わり目の収まり",
    contemporarySocialLabelJa: "揺れたあとを、静かに納める人。",
    functionalSubtitleJa: "変わった直後に慌てず、ちょうどいい位置へ流れを戻していく。",
    hookLineJa: "揺れたあとの空気を、きれいに納めるのがうまい。",
    traitChipsJa: ["揺れの収まり", "慌てない調整", "静かな戻し"],
    shareSendLineJa: "揺れのあとを納めるタイプ。",
    nextMoveLineJa: "その収まり方の癖を、近くでひとつ見る。",
    paywallTeaseJa: "変化の余波をどう納めているかを深読みする。",
    publicResultLabelEn: "Soft landing keeper",
    publicSubtitleEn: "You are good at calming the air after the change, not just surviving it.",
    shortResultHookEn: "You are good at settling the aftershock.",
    shareLineEn: "You settle the aftershock well.",
    teaserLineEn: "See how you bring things back into place.",
    paywallTeaseEn: "Read how you settle the ripple after change.",
  },
  P14: {
    mythArchetypeLabelJa: "立て直しの余白",
    contemporarySocialLabelJa: "つまずいた日を、引きずりにくい人。",
    functionalSubtitleJa: "崩れたあとでも、全部を責めずに戻せる余白をちゃんと持っている。",
    hookLineJa: "崩れた日ほど、戻れる余白が効いてくる。",
    traitChipsJa: ["戻れる幅", "自責しすぎ回避", "立て直しの勘"],
    shareSendLineJa: "つまずいた日を戻せるタイプ。",
    nextMoveLineJa: "その立て直しの幅を、場面で確かめる。",
    paywallTeaseJa: "崩れた日の戻し方と、自分への扱い方を深読みする。",
    publicResultLabelEn: "Recovery margin",
    publicSubtitleEn: "Even on a rough day, you keep enough room to recover without collapsing into blame.",
    shortResultHookEn: "Recovery begins with room.",
    shareLineEn: "You keep room to recover.",
    teaserLineEn: "See how you recover without turning harsh on yourself.",
    paywallTeaseEn: "Read how you rebuild after the day slips.",
  },
  P15: {
    mythArchetypeLabelJa: "並走の切替",
    contemporarySocialLabelJa: "仕事も家の用事も、並走で回す人。",
    functionalSubtitleJa: "複数の流れを並走させながら、切り替えの間で破綻を出さない。",
    hookLineJa: "並走のうまさは、切り替えの間で決まる。",
    traitChipsJa: ["並走の手数", "切替の中継", "破綻させない運び"],
    shareSendLineJa: "並走で回すタイプ。",
    nextMoveLineJa: "その並走の癖を、近い場面でひとつ開く。",
    paywallTeaseJa: "仕事と家の用事を並走させる切り替え方を深読みする。",
    publicResultLabelEn: "Parallel switcher",
    publicSubtitleEn: "You keep multiple tracks moving by mastering the handoff between them.",
    shortResultHookEn: "Parallel life is won in the handoff.",
    shareLineEn: "You run parallel tracks well.",
    teaserLineEn: "See how you keep two worlds from colliding.",
    paywallTeaseEn: "Read how you switch between work and home without breaking the flow.",
  },
  P16: {
    mythArchetypeLabelJa: "回復後の交流",
    contemporarySocialLabelJa: "戻ってから人と混ざる人。",
    functionalSubtitleJa: "まず自分を少し戻してから、人の輪へ軽く入り直していく。",
    hookLineJa: "人に戻る前に、自分へ戻る。",
    traitChipsJa: ["戻ってから混ざる", "交流の再起動", "軽い合流"],
    shareSendLineJa: "戻ってから人に混ざるタイプ。",
    nextMoveLineJa: "その合流のタイミングを、もう少し近く見る。",
    paywallTeaseJa: "回復から交流へ移る境目をどう作るかを深読みする。",
    publicResultLabelEn: "Rejoin after rest",
    publicSubtitleEn: "You return to people best after you have returned to yourself first.",
    shortResultHookEn: "Return to yourself before you rejoin the room.",
    shareLineEn: "You rejoin after you recover.",
    teaserLineEn: "See how you step back into people after rest.",
    paywallTeaseEn: "Read how recovery becomes social re-entry for you.",
  },
  P17: {
    mythArchetypeLabelJa: "ひと息ご褒美",
    contemporarySocialLabelJa: "頑張ったあとに火を足す人。",
    functionalSubtitleJa: "全部を使い切る前に、小さなご褒美で気分を戻して次へつなぐ。",
    hookLineJa: "小さく火を足すと、また前へ出やすい。",
    traitChipsJa: ["ご褒美の入れ方", "気分の再点火", "疲れの切り替え"],
    shareSendLineJa: "小さく火を足して戻るタイプ。",
    nextMoveLineJa: "この再点火の癖を、場面ごとにひとつ開く。",
    paywallTeaseJa: "ご褒美が回復になる瞬間と、効きすぎる境目を深読みする。",
    publicResultLabelEn: "Little-flame reward",
    publicSubtitleEn: "You recover by lighting a small reward before the battery goes flat.",
    shortResultHookEn: "A small spark makes the next step possible.",
    shareLineEn: "You come back by adding a small spark.",
    teaserLineEn: "See how your reward becomes momentum.",
    paywallTeaseEn: "Read where your reward renews you and where it overreaches.",
    shareOtherReadableJa: "ひと息ご褒美。小さく気分を上げて戻る人。",
    shareTensionLineJa: "気分の火が落ちると露骨に鈍る。",
    shareSocialHookJa: "小さいご褒美だけは要る人、ほんとこれ。",
    stepCopyJa: {
      continueTitleJa: "ご褒美の火加減を、もう半歩だけ開く。",
      continueSummaryJa: "送る、深く読む、近い場面で確かめる。気分の再点火だけを残した。",
      companionTitleJa: "ひと息ご褒美 が出る場面だけ近く見る。",
      returnTitleJa: "ひと息ご褒美 の返り道",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "小さな火種を囲う円印。",
      heroDirectionJa: "淡い暗がりの中に、ひと点だけ灯りが戻る構図。",
      motifGrammarJa: "火種、余熱、丸い呼吸、戻る明度。",
      symbolicLogicJa: ["火種", "余熱", "再点火の輪"],
    },
  },
  P18: {
    mythArchetypeLabelJa: "和らぎの間合い",
    contemporarySocialLabelJa: "近すぎず遠すぎずを、自然に守る人。",
    functionalSubtitleJa: "人との距離を急に詰めず、ちょうどいい間で会話を続けていく。",
    hookLineJa: "近づき方より、ちょうどよさで信頼が残る。",
    traitChipsJa: ["距離の取り方", "入りすぎ回避", "空気の保ち方"],
    shareSendLineJa: "ちょうどいい間合いを取るタイプ。",
    nextMoveLineJa: "その距離の勘を、近い場面で確かめる。",
    paywallTeaseJa: "近すぎず遠すぎずの距離感が、どう安心に変わるかを読む。",
    publicResultLabelEn: "Measured distance",
    publicSubtitleEn: "You build trust by keeping the distance just right, not by pushing closeness.",
    shortResultHookEn: "Trust grows in the right distance.",
    shareLineEn: "You keep the distance just right.",
    teaserLineEn: "See how your spacing becomes ease.",
    paywallTeaseEn: "Read how your distance turns into comfort.",
  },
  P19: {
    mythArchetypeLabelJa: "護りの見取り",
    contemporarySocialLabelJa: "先に安心を置いてから動く人。",
    functionalSubtitleJa: "不安をなだめるより、確認と手順を先に置いてから進む。",
    hookLineJa: "安心がそろうと、一気に動ける。",
    traitChipsJa: ["確認の置き方", "安心の順番", "進む前の整え"],
    shareSendLineJa: "先に安心を置いてから動くタイプ。",
    nextMoveLineJa: "安心の作り方が出る場面を、近くで見直す。",
    paywallTeaseJa: "安心材料の集め方と、進む前の整え方を深読みする。",
    publicResultLabelEn: "Safety-first mover",
    publicSubtitleEn: "You move best after the air feels safe enough to start.",
    shortResultHookEn: "You start once safety is in place.",
    shareLineEn: "You move after safety is in place.",
    teaserLineEn: "See how reassurance turns into motion.",
    paywallTeaseEn: "Read how reassurance is gathered and turned into momentum.",
    shareOtherReadableJa: "護りの見取り。先に安心を置いてから動く人。",
    shareTensionLineJa: "安心の順番が崩れると、足が止まりやすい。",
    shareSocialHookJa: "先に確認がそろうと急に強い人、これでしょ。",
    stepCopyJa: {
      resultPrimaryCtaJa: "この安心の作り方を開く",
      resultPrimaryHintJa: "安心の作り方だけを、次で短く開ける。",
      continueTitleJa: "護りの見取り を、もう半歩だけ開く。",
      continueSummaryJa: "送る、深く読む、近い場面で確かめる。まずは護り方の輪郭だけ残した。",
      continueShareHintJa: "このタイプの一言は、守り方まで伝わる。",
      companionTitleJa: "護りの見取り が出る場面だけ近く見る。",
      companionSummaryJa: "安心を先に作る癖が、どの場面で強く出るかだけ確かめる。",
      returnTitleJa: "護りの見取り の返り道",
      returnSummaryJa: "結果は変えず、護りが出る近い場面だけひとつ確かめる。",
      returnChoicePromptJa: "護りの見取り をもう一度見るなら、どこから確かめる？",
      returnChoiceHelperJa: "先に大丈夫を作る場面を、ひとつだけ選べば十分。",
      returnDoneLeadJa: "先に大丈夫を作ってから動くタイプ。必要なら、また結果へ戻れる。",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "護符を重ねる前の見取り印。",
      heroDirectionJa: "やわらかな防壁が一枚だけ前に立つ構図。",
      motifGrammarJa: "護符、輪郭線、見取り図、静かな守り。",
      symbolicLogicJa: ["護符", "防壁の線", "見取りの輪郭"],
      forbiddenVisualLogicJa: ["お守り商品っぽい装飾", "宗教販促の見え方"],
    },
  },
  P20: {
    mythArchetypeLabelJa: "決めどきの線",
    contemporarySocialLabelJa: "今決めるか、まだ持つかが見える人。",
    functionalSubtitleJa: "勢いで切らず、保留も決断もちゃんと強さとして使い分ける。",
    hookLineJa: "決める強さは、待てる強さと一緒に出る。",
    traitChipsJa: ["決断の境目", "保留の使い方", "見極めの勘"],
    shareSendLineJa: "決めどきの線が見えるタイプ。",
    nextMoveLineJa: "その線引きが出る場面を、ひとつ近く見る。",
    paywallTeaseJa: "決める強さと保留の強さを、どう使い分けているかを読む。",
    publicResultLabelEn: "Decision threshold",
    publicSubtitleEn: "You know when to decide and when to keep holding without treating either as weakness.",
    shortResultHookEn: "Deciding well starts with holding well.",
    shareLineEn: "You see the line between decide and hold.",
    teaserLineEn: "See where your boundary becomes a strength.",
    paywallTeaseEn: "Read how your deciding line actually works.",
  },
  P21: {
    mythArchetypeLabelJa: "先手の一歩",
    contemporarySocialLabelJa: "様子見より、まず動く人。",
    functionalSubtitleJa: "考え切るより先に足を出し、動いてから見える材料で整えていく。",
    hookLineJa: "先に一歩出ると、景色のほうが追いついてくる。",
    traitChipsJa: ["先手の着火", "様子見しすぎ回避", "動いて整える"],
    shareSendLineJa: "まず一歩出るタイプ。",
    nextMoveLineJa: "その先手が効く場面を、近くで見直す。",
    paywallTeaseJa: "動きながら整える強さと、勢いの使い方を深読みする。",
    publicResultLabelEn: "First-step striker",
    publicSubtitleEn: "You understand the situation better after moving than before it.",
    shortResultHookEn: "Step first and let the view catch up.",
    shareLineEn: "You are the type who moves first.",
    teaserLineEn: "See where your first step creates the path.",
    paywallTeaseEn: "Read how you turn early movement into clarity.",
  },
  P22: {
    mythArchetypeLabelJa: "朝の立て直し",
    contemporarySocialLabelJa: "重い朝でも、戻し方を知っている人。",
    functionalSubtitleJa: "前日が残る朝でも、無理なく少しずつテンポを戻していける。",
    hookLineJa: "重い朝ほど、戻し方の順番が効いてくる。",
    traitChipsJa: ["朝の戻し方", "重さの逃がし方", "小さな再起動"],
    shareSendLineJa: "重い朝を戻せるタイプ。",
    nextMoveLineJa: "その戻し方の順番を、近い場面で読む。",
    paywallTeaseJa: "重い朝の立て直し方と、最初の一手を深読みする。",
    publicResultLabelEn: "Morning reset",
    publicSubtitleEn: "Even when the morning starts heavy, you know how to bring the pace back.",
    shortResultHookEn: "Heavy mornings are solved in order.",
    shareLineEn: "You know how to reset a heavy morning.",
    teaserLineEn: "See how your morning reset starts.",
    paywallTeaseEn: "Read the order that brings your mornings back.",
  },
  P23: {
    mythArchetypeLabelJa: "負荷の采配",
    contemporarySocialLabelJa: "重さに合わせて、配分を変える人。",
    functionalSubtitleJa: "予定を守るより、負荷を見て動き方を組み替える。",
    hookLineJa: "うまさは、予定通りより配分のしなやかさに出る。",
    traitChipsJa: ["重さの配分", "動きの組み替え", "抱えすぎ回避"],
    shareSendLineJa: "負荷に合わせて配分を変えるタイプ。",
    nextMoveLineJa: "その配分替えの癖を、ひとつ近く見る。",
    paywallTeaseJa: "負荷をどう見積もり、どう組み替えているかを深読みする。",
    publicResultLabelEn: "Load juggler",
    publicSubtitleEn: "You adjust the plan to the weight instead of forcing the weight to fit the plan.",
    shortResultHookEn: "The real skill is in reallocation.",
    shareLineEn: "You reshape the plan to fit the load.",
    teaserLineEn: "See how you rebalance under pressure.",
    paywallTeaseEn: "Read how you estimate and reassign load.",
  },
  P24: {
    mythArchetypeLabelJa: "念押しのひと目",
    contemporarySocialLabelJa: "もう一回見てから、進みたい人。",
    functionalSubtitleJa: "一回多めに確かめることで、やっと安心して足が出る。",
    hookLineJa: "あとひと目あると、やっと前へ出られる。",
    traitChipsJa: ["念押しの一回", "見落とし回避", "進む前の落ち着き"],
    shareSendLineJa: "もう一回見てから進むタイプ。",
    nextMoveLineJa: "その念押しが出る場面を、近くで確かめる。",
    paywallTeaseJa: "安全確認を重ねる強さと、重ねすぎる境目を読む。",
    publicResultLabelEn: "Double-check calm",
    publicSubtitleEn: "One extra check is what finally lets your body move.",
    shortResultHookEn: "One more look makes the step possible.",
    shareLineEn: "You move after one more look.",
    teaserLineEn: "See where your extra check calms you down.",
    paywallTeaseEn: "Read the line between useful checking and too much checking.",
  },
  P25: {
    mythArchetypeLabelJa: "場読みの返し",
    contemporarySocialLabelJa: "空気と流れを見て返す人。",
    functionalSubtitleJa: "言う内容だけでなく、その場の温度とタイミングも一緒に見ている。",
    hookLineJa: "返す前に空気を読む人は、場を荒らしにくい。",
    traitChipsJa: ["場の温度読み", "返すタイミング", "角の立たない一言"],
    shareSendLineJa: "空気を見て返すタイプ。",
    nextMoveLineJa: "その返しの読みを、近い場面でひとつ見る。",
    paywallTeaseJa: "場の温度と週末の流れが、返答をどう変えているかを深読みする。",
    publicResultLabelEn: "Room-reading reply",
    publicSubtitleEn: "You answer by reading the room, the timing, and the social current together.",
    shortResultHookEn: "Reading the room keeps the reply clean.",
    shareLineEn: "You reply by reading the room.",
    teaserLineEn: "See how the room changes your answer.",
    paywallTeaseEn: "Read how mood, timing, and flow shape your reply.",
    shareOtherReadableJa: "場読みの返し。その場の空気ごと見て返す人。",
    shareTensionLineJa: "合わせていても返す線だけは曲げない。",
    shareSocialHookJa: "その場に合わせても芯がぶれない人、だいたいこれ。",
    stepCopyJa: {
      continueTitleJa: "場読みの返し を、もう半歩だけ開く。",
      continueShareLabelJa: "この返しを送る",
      continueShareHintJa: "一言送るだけでも、この場読みは伝わる。",
      companionTitleJa: "場読みの返し が出る場面だけ近く見る。",
      returnTitleJa: "場読みの返し の返り道",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "場の波を読む返答印。",
      heroDirectionJa: "人の気配が重ならず、空気だけが重なる構図。",
      motifGrammarJa: "波、余白、視線の外周、空気の層。",
      symbolicLogicJa: ["場の波", "返答の余白", "視線の外周"],
    },
  },
  P26: {
    mythArchetypeLabelJa: "夜の残り火",
    contemporarySocialLabelJa: "夜のぶんまで見越して、動く人。",
    functionalSubtitleJa: "その場のやる気より、夜に残る体力まで見て動きを決める。",
    hookLineJa: "夜の残り火を残せると、明日まで崩れにくい。",
    traitChipsJa: ["夜に残す勘", "使い切らない運び", "省エネの線引き"],
    shareSendLineJa: "夜の余力を残して動くタイプ。",
    nextMoveLineJa: "その余力の残し方を、近くでひとつ見る。",
    paywallTeaseJa: "夜の残り体力をどう守り、どう使うかを深読みする。",
    publicResultLabelEn: "Night reserve line",
    publicSubtitleEn: "You decide with tonight's remaining energy already in the calculation.",
    shortResultHookEn: "Save enough for tonight and tomorrow holds.",
    shareLineEn: "You move by protecting your night reserve.",
    teaserLineEn: "See how you keep something back for later.",
    paywallTeaseEn: "Read how you protect and spend your night reserve.",
  },
  P27: {
    mythArchetypeLabelJa: "ご褒美のひと息",
    contemporarySocialLabelJa: "終わったあとに小さく上げる人。",
    functionalSubtitleJa: "片付けや実務のあとに、小さなご褒美で気分をやさしく戻す。",
    hookLineJa: "終わったあとに少し上げると、気持ちはちゃんと戻る。",
    traitChipsJa: ["小さなご褒美", "気分の戻し方", "片付け後の余熱"],
    shareSendLineJa: "終わったあとに小さく上げるタイプ。",
    nextMoveLineJa: "その余熱の作り方を、近い場面で見る。",
    paywallTeaseJa: "ご褒美の入れ方が、回復になる境目を深読みする。",
    publicResultLabelEn: "Rewarded breather",
    publicSubtitleEn: "A small lift after the work helps your mood come back into place.",
    shortResultHookEn: "A little lift after the task brings you back.",
    shareLineEn: "You recover through a small afterglow.",
    teaserLineEn: "See how your reward becomes recovery.",
    paywallTeaseEn: "Read where your reward turns into restoration.",
  },
  P28: {
    mythArchetypeLabelJa: "家の間合い",
    contemporarySocialLabelJa: "家族との距離を、やさしく整える人。",
    functionalSubtitleJa: "踏み込みすぎず放しすぎず、家の中でちょうどいい距離を作る。",
    hookLineJa: "家の空気は、ちょうどいい距離でやわらいでいく。",
    traitChipsJa: ["家族との距離感", "やさしい調整", "言いすぎ回避"],
    shareSendLineJa: "家の距離感を整えるタイプ。",
    nextMoveLineJa: "そのやさしい距離の取り方を、ひとつ近く見る。",
    paywallTeaseJa: "家族との間合いがどう安心に変わるかを深読みする。",
    publicResultLabelEn: "Household spacing",
    publicSubtitleEn: "You keep family life easier by setting a softer, better distance.",
    shortResultHookEn: "Home softens at the right distance.",
    shareLineEn: "You soften the home through distance.",
    teaserLineEn: "See how your gentle spacing works at home.",
    paywallTeaseEn: "Read how your family distance becomes ease.",
  },
  P29: {
    mythArchetypeLabelJa: "週末の引き算",
    contemporarySocialLabelJa: "休むために、ちゃんと減らす人。",
    functionalSubtitleJa: "足す予定より、引く予定で週末の回復を守る。",
    hookLineJa: "週末は、足すより引くほうがうまくいく。",
    traitChipsJa: ["減らす決断", "週末の静けさ", "回復の守り"],
    shareSendLineJa: "週末は引き算で整えるタイプ。",
    nextMoveLineJa: "その引き算の強さを、近い場面で見る。",
    paywallTeaseJa: "週末に何を減らし、何を残して回復しているかを深読みする。",
    publicResultLabelEn: "Weekend subtraction",
    publicSubtitleEn: "You protect your weekend by choosing what not to carry into it.",
    shortResultHookEn: "Weekends work better when you subtract.",
    shareLineEn: "You recover by subtracting on weekends.",
    teaserLineEn: "See what you remove to make the weekend breathe.",
    paywallTeaseEn: "Read what you subtract and preserve over the weekend.",
    shareOtherReadableJa: "週末の引き算。休むために、ちゃんと減らす人。",
    shareTensionLineJa: "休みを削る予定には急に機嫌が悪い。",
    shareSocialHookJa: "週末だけ急に予定を減らす人、これでしょ。",
    stepCopyJa: {
      continueTitleJa: "週末の引き算 を、もう半歩だけ開く。",
      continueSummaryJa: "送る、深く読む、近い場面で確かめる。休むための減らし方だけ残した。",
      companionTitleJa: "週末の引き算 が出る場面だけ近く見る。",
      returnTitleJa: "週末の引き算 の返り道",
    },
    visualIdentityJa: {
      polishedTier: "core",
      crestDirectionJa: "余白を残す引き算印。",
      heroDirectionJa: "広い余白の中で、要素がひとつずつ引かれていく構図。",
      motifGrammarJa: "余白、間引かれた線、静かな週末光。",
      symbolicLogicJa: ["余白", "間引かれた線", "静かな週末光"],
    },
  },
  P30: {
    mythArchetypeLabelJa: "組み直しの岐路",
    contemporarySocialLabelJa: "変わった現実から、組み直せる人。",
    functionalSubtitleJa: "計画通りに戻すより、新しい条件でちゃんと組み直すほうが早い。",
    hookLineJa: "変わったなら、戻すより組み直したほうが早い。",
    traitChipsJa: ["再段取りの勘", "現実への寄せ", "組み直しの早さ"],
    shareSendLineJa: "変わったら組み直すタイプ。",
    nextMoveLineJa: "その組み直しの勘を、ひとつ近く見る。",
    paywallTeaseJa: "崩れた計画をどう組み直し、どう前へ出るかを深読みする。",
    publicResultLabelEn: "Rebuild fork",
    publicSubtitleEn: "When reality changes, you rebuild instead of clinging to the original plan.",
    shortResultHookEn: "When it changes, rebuild it.",
    shareLineEn: "You rebuild when reality changes.",
    teaserLineEn: "See how your replanning works under change.",
    paywallTeaseEn: "Read how you rebuild and move after the plan breaks.",
  },
  P31: {
    mythArchetypeLabelJa: "場配りの距離",
    contemporarySocialLabelJa: "その場ごとのちょうどよさを、配れる人。",
    functionalSubtitleJa: "人の数や空気に合わせて、距離の置き方を自然に変えていく。",
    hookLineJa: "場ごとのちょうどよさを配れると、空気は荒れにくい。",
    traitChipsJa: ["場の温度調整", "距離の配り方", "混ざり方の勘"],
    shareSendLineJa: "場ごとのちょうどよさを作るタイプ。",
    nextMoveLineJa: "その距離の配り方を、近い場面でひとつ見る。",
    paywallTeaseJa: "場ごとの距離感がどう自然に切り替わるかを深読みする。",
    publicResultLabelEn: "Scene distance maker",
    publicSubtitleEn: "You distribute the right distance for the room instead of using one distance everywhere.",
    shortResultHookEn: "Good rooms begin with good spacing.",
    shareLineEn: "You create the right distance for the scene.",
    teaserLineEn: "See how you shift your distance across rooms.",
    paywallTeaseEn: "Read how your distance changes with the scene.",
  },
};

const FAMILY_VISUAL_DEFAULTS: Record<ResultVisualFamilyKey, Omit<PublicResultVisualIdentity, "familyKey" | "polishedTier">> = {
  dawn: {
    crestDirectionJa: "立ち上がりの線を切る朝印。",
    heroDirectionJa: "朝の余白に一筋の起動線が通る構図。",
    motifGrammarJa: "夜明けの紙、細い光、出発の余白。",
    paletteDirectionJa: "灰緑、砂色、象牙、薄い朝光。",
    symbolicLogicJa: ["起動線", "夜明けの余白", "出発の門"],
    forbiddenVisualLogicJa: ["神社パンフレット風", "国旗連想の強い日輪", "アニメ輪郭"],
  },
  motion: {
    crestDirectionJa: "切替の拍を刻む中継印。",
    heroDirectionJa: "流れが折れずに次へ渡る構図。",
    motifGrammarJa: "中継線、折り返し、軽い加速。",
    paletteDirectionJa: "灰緑、薄琥珀、乳白、青灰。",
    symbolicLogicJa: ["中継線", "折り返し", "軽い加速"],
    forbiddenVisualLogicJa: ["ダッシュボード感", "ゲームUI化", "ネオン過多"],
  },
  recovery: {
    crestDirectionJa: "静けさを囲う回復印。",
    heroDirectionJa: "余白の中で明度だけがゆっくり戻る構図。",
    motifGrammarJa: "静かな水面、深呼吸の波紋、戻る灯り。",
    paletteDirectionJa: "象牙、薄鼠緑、くすみ土、柔らかい光。",
    symbolicLogicJa: ["静かな水面", "深呼吸の波紋", "戻る灯り"],
    forbiddenVisualLogicJa: ["医療パンフ感", "癒やし商品風", "パステル過多"],
  },
  boundary: {
    crestDirectionJa: "境目を読む一筆印。",
    heroDirectionJa: "余白の中に線引きだけが浮く構図。",
    motifGrammarJa: "境界線、間引かれた要素、静かな判断。",
    paletteDirectionJa: "灰緑、薄薔薇砂、紙白、鈍い銅。",
    symbolicLogicJa: ["境界線", "判断の余白", "配られた距離"],
    forbiddenVisualLogicJa: ["警告UI感", "劇画風の緊張", "派手な赤"],
  },
};

const PERSONA_CORE_IDS = new Set(["P01", "P07", "P09", "P11", "P17", "P19", "P25", "P29"]);

export const PUBLIC_RESULT_IDENTITY_OPTIONS: PublicResultIdentity[] = Array.from({ length: 31 }, (_, index) =>
  buildPublicResultIdentity({ personaId: `P${String(index + 1).padStart(2, "0")}` }),
);

export function getPublicResultIdentity(personaId: string) {
  return buildPublicResultIdentity({ personaId });
}

export function getPublicResultIdentityOptions() {
  return PUBLIC_RESULT_IDENTITY_OPTIONS;
}

export function buildPublicResultIdentity(input: BuildPublicResultIdentityInput): PublicResultIdentity {
  const personaId = normalizePersonaId(input.personaId);
  const annex = getPersonaAnnexARow(personaId) || getPersonaAnnexARow("P01")!;
  const teaser = TEASER_LOOKUP.get(personaId) || TEASER_LOOKUP.get("P01")!;
  const share = SHARE_LOOKUP.get(personaId) || SHARE_LOOKUP.get("P01")!;
  const deep = DEEP_LOOKUP.get(personaId) || DEEP_LOOKUP.get("P01")!;
  const seed = PERSONA_PACK[personaId] || PERSONA_PACK.P01;

  const mythArchetypeLabelJa = annex.officialPublicPersonaName || seed.mythArchetypeLabelJa || input.sourceResultLabel || "";
  const contemporarySocialLabelJa = annex.socialHandle || seed.contemporarySocialLabelJa || input.sourceShareLine || "";
  const functionalSubtitleJa = annex.functionalSubtitle || seed.functionalSubtitleJa || input.sourceResultSummary || "";
  const hookLineJa = annex.shareCardHookDirection || seed.hookLineJa || input.sourceTeaserLine || teaser.recommended_teaser_line_jp || functionalSubtitleJa;
  const traitChipsJa = annex.traitChips;
  const shareSendLineJa = annex.shareCardHookDirection || seed.shareSendLineJa || input.sourceShareLine || share.recommended_share_card_line_jp || contemporarySocialLabelJa;
  const nextMoveLineJa = annex.shareCardHookDirection || seed.nextMoveLineJa || input.sourceTeaserLine || teaser.recommended_teaser_line_jp || functionalSubtitleJa;
  const paywallTeaseJa =
    input.sourcePaywallTease ||
    `この${annex.officialPublicPersonaName}の見方を、もう少し深く見る。`;
  const publicResultLabelEn = seed.publicResultLabelEn || annex.officialPublicPersonaName;
  const publicSubtitleEn = seed.publicSubtitleEn || annex.functionalSubtitle;
  const shortResultHookEn = seed.shortResultHookEn || teaser.internal_logic_gloss_en || share.internal_logic_gloss_en || annex.functionalSubtitle;
  const shareLineEn = seed.shareLineEn || share.internal_logic_gloss_en || annex.socialHandle;
  const teaserLineEn = seed.teaserLineEn || teaser.internal_logic_gloss_en || annex.functionalSubtitle;
  const paywallTeaseEn = seed.paywallTeaseEn || deep.internal_logic_gloss_en || annex.functionalSubtitle;

  return {
    personaId,
    internalWorkingName: annex.structuralWorkingName,
    mythArchetypeLabelJa,
    contemporarySocialLabelJa,
    functionalSubtitleJa,
    hookLineJa,
    traitChipsJa,
    shareSendLineJa,
    nextMoveLineJa,
    paywallTeaseJa,
    stepCopy: buildStepCopyJa({
      personaId,
      mythArchetypeLabelJa,
      shareSendLineJa,
      nextMoveLineJa,
      paywallTeaseJa,
      overrides: {
        resultPrimaryCtaJa: `この${annex.officialPublicPersonaName}をもう少し開く`,
        resultPrimaryHintJa: `この${annex.officialPublicPersonaName}の見方を、次で短く開ける。`,
      },
    }),
    visualIdentity: buildVisualIdentity(personaId, seed.visualIdentityJa),
    publicResultLabelJa: mythArchetypeLabelJa,
    publicSubtitleJa: functionalSubtitleJa,
    shortResultHookJa: hookLineJa,
    shareLineJa: shareSendLineJa,
    teaserLineJa: nextMoveLineJa,
    shareCategoryTagJa: buildShareCategoryTagJa(resolveFamilyKey(personaId)),
    shareOtherReadableJa: seed.shareOtherReadableJa || buildShareOtherReadableJa(mythArchetypeLabelJa, contemporarySocialLabelJa),
    shareTensionLineJa: seed.shareTensionLineJa || buildShareTensionLineJa(resolveFamilyKey(personaId), traitChipsJa),
    shareSocialHookJa: annex.shareCardHookDirection || seed.shareSocialHookJa || buildShareSocialHookJa(personaId),
    publicResultLabelEn,
    publicSubtitleEn,
    shortResultHookEn,
    shareLineEn,
    teaserLineEn,
    paywallTeaseEn:
      paywallTeaseEn,
  };
}

function buildShareCategoryTagJa(familyKey: ResultVisualFamilyKey) {
  switch (familyKey) {
    case "dawn":
      return "朝の型";
    case "motion":
      return "動きの型";
    case "recovery":
      return "戻り方の型";
    case "boundary":
    default:
      return "境目の型";
  }
}

function buildShareOtherReadableJa(label: string, socialLine: string) {
  return `${label}。${socialLine}`;
}

function buildShareTensionLineJa(familyKey: ResultVisualFamilyKey, traitChips: string[]) {
  switch (familyKey) {
    case "dawn":
      return "静かに見えて、立ち上がりは意外と早い。";
    case "motion":
      return "軽く見えて、切り替えの中ではかなり粘る。";
    case "recovery":
      return "穏やかに見えて、戻る順番には意外と厳密。";
    case "boundary":
    default:
      return traitChips[0]?.includes("距離")
        ? "やさしく見えて、入れすぎる線はちゃんと止める。"
        : "落ち着いて見えて、決めどきはかなり正確。";
  }
}

function buildShareSocialHookJa(personaId: string) {
  const hooks: Record<string, string> = {
    P02: "予定が揺れても、先に並べ直す人、これでしょ。",
    P03: "手数で流れを止めない人、これでしょ。",
    P04: "用事の帰りに気分まで戻す人、これでしょ。",
    P05: "雨の日ほど足元を先に見る人、これでしょ。",
    P06: "片付けは順番から入る人、これでしょ。",
    P08: "変わった直後に、着地を整える人、これでしょ。",
    P10: "家の流れを、一声で動かす人、これでしょ。",
    P12: "夜の残量を残したい人、これでしょ。",
    P13: "変化のあとを、無理なく収める人、これでしょ。",
    P14: "崩れた日ほど、片付けで戻す人、これでしょ。",
    P15: "仕事と家の用事を並走でさばく人、これでしょ。",
    P16: "戻ってから人の輪に混ざる人、これでしょ。",
    P18: "近すぎず遠すぎずを守る人、これでしょ。",
    P20: "決めるか持つかを、きちんと分ける人、これでしょ。",
    P21: "まず動いてから整える人、これでしょ。",
    P22: "重い朝でも戻し方を知っている人、これでしょ。",
    P23: "負荷に合わせて配分を変える人、これでしょ。",
    P24: "もう一回見てから進みたい人、これでしょ。",
    P26: "夜のぶんまで見越して動く人、これでしょ。",
    P27: "終わったあとに小さく上げる人、これでしょ。",
    P28: "家族との距離をやさしく整える人、これでしょ。",
    P30: "変わった現実から組み直せる人、これでしょ。",
    P31: "場ごとのちょうどよさを配れる人、これでしょ。",
  };

  return hooks[personaId] || "この感じ、身近にいる人、これでしょ。";
}

function buildStepCopyJa(input: {
  personaId: string;
  mythArchetypeLabelJa: string;
  shareSendLineJa: string;
  nextMoveLineJa: string;
  paywallTeaseJa: string;
  overrides?: Partial<PublicResultStepCopy>;
}): PublicResultStepCopy {
  const base: PublicResultStepCopy = {
    resultPrimaryCtaJa: "この結果をもう少し開く",
    resultPrimaryHintJa: "この結果の見方を、次で短く開ける。",
    continueTitleJa: `${input.mythArchetypeLabelJa} を、もう半歩だけ開く。`,
    continueSummaryJa: `送る、深く読む、近い場面で確かめる。${input.mythArchetypeLabelJa} の空気だけ残した。`,
    continueShareLabelJa: "このタイプを送る",
    continueShareHintJa: input.shareSendLineJa,
    continueDetailsLabelJa: "深読みを開く",
    continueDetailsHintJa: input.paywallTeaseJa,
    continueCompanionLabelJa: "近い場面で確かめる",
    continueCompanionHintJa: input.nextMoveLineJa,
    continueRecurringLabelJa: "返り道を残す",
    continueRecurringHintJa: "少し時間を置いてから戻れる。",
    companionTitleJa: `${input.mythArchetypeLabelJa} が出る場面だけ近く見る。`,
    companionSummaryJa: `${input.nextMoveLineJa} 結果そのものは変えず、近い場面だけを軽く確かめる。`,
    companionPrimaryLabelJa: "3問だけ見る",
    companionPrimaryHintJa: input.nextMoveLineJa,
    companionDeeperLabelJa: "深読みへ戻る",
    companionRecurringLabelJa: "返り道を残す",
    returnTitleJa: `${input.mythArchetypeLabelJa} の返り道`,
    returnSummaryJa: `${input.nextMoveLineJa} 最後に近い場面をひとつだけ確かめる。`,
    returnStartLabelJa: "ひとつ確かめる",
    returnChoicePromptJa: `${input.mythArchetypeLabelJa} をもう一度見るなら、どこから確かめる？`,
    returnChoiceHelperJa: input.nextMoveLineJa,
    returnDoneLeadJa: `${input.shareSendLineJa} 必要なら、また結果へ戻れる。`,
  };

  return { ...base, ...(input.overrides || {}) };
}

function buildVisualIdentity(
  personaId: string,
  override: PersonaPackSeed["visualIdentityJa"],
): PublicResultVisualIdentity {
  const familyKey = resolveFamilyKey(personaId);
  const base = FAMILY_VISUAL_DEFAULTS[familyKey];
  return {
    familyKey,
    crestDirectionJa: override?.crestDirectionJa || base.crestDirectionJa,
    heroDirectionJa: override?.heroDirectionJa || base.heroDirectionJa,
    motifGrammarJa: override?.motifGrammarJa || base.motifGrammarJa,
    paletteDirectionJa: override?.paletteDirectionJa || base.paletteDirectionJa,
    symbolicLogicJa: override?.symbolicLogicJa || base.symbolicLogicJa,
    forbiddenVisualLogicJa: override?.forbiddenVisualLogicJa || base.forbiddenVisualLogicJa,
    polishedTier: override?.polishedTier || (PERSONA_CORE_IDS.has(personaId) ? "core" : "standard"),
  };
}

function resolveFamilyKey(personaId: string): ResultVisualFamilyKey {
  const index = Number.parseInt(personaId.replace("P", ""), 10);
  if (index >= 1 && index <= 8) {
    return "dawn";
  }
  if (index >= 9 && index <= 16) {
    return "motion";
  }
  if (index >= 17 && index <= 24) {
    return "recovery";
  }
  return "boundary";
}

function normalizePersonaId(value: string) {
  const normalized = value.trim().toUpperCase();
  return getPersonaAnnexARow(normalized) ? normalized : "P01";
}
