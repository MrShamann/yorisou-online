// PRODUCT PACK — yorisou.daily-symbols 「今日のしるし」 v0.1.0
//
// Yorisou product IP: a controlled, Founder-locked engineering-seed pack of sixteen original daily
// symbols. The capability tier (lib/platform/discoveryCore.ts) knows nothing in this file; this
// file supplies content and display identity only, through the DiscoveryPatternDefinition
// interface.
//
// CONTENT IS LOCKED. Every id, mark, name, recognition line, prompt, and consumer copy string in
// this file was supplied verbatim by the Founder package YORISOU-ARCH-P3-DAILY-DISCOVERY-SYMBOLS.
// Do not add, remove, reword, or reorder results without a new Founder authorization —
// test:arch-p3 asserts the exact sixteen ids and the safety register (no fate/destiny/prediction/
// diagnosis claims; the result is SYMBOLIC_INTERPRETATION, nothing more).
//
// This pack is INTERNAL / controlled-pilot content. Shipping it in the repository is not Public
// release approval.

import type { DiscoveryPatternDefinition } from "@/lib/platform/discoveryCore";

export const DAILY_SYMBOLS_PACK_ID = "yorisou.daily-symbols";
export const DAILY_SYMBOLS_PACK_VERSION = "0.1.0";
export const DAILY_SYMBOLS_PATTERN_FAMILY = "symbol_draw" as const;
export const DAILY_SYMBOLS_CALENDAR_TIMEZONE = "Asia/Tokyo";
export const DAILY_SYMBOLS_RECENT_EXCLUSION_WINDOW = 7;

export interface DailySymbol {
  id: string;
  mark: string;
  name: string;
  recognition: string;
  prompt: string;
}

export const DAILY_SYMBOLS: readonly DailySymbol[] = [
  {
    id: "space",
    mark: "余",
    name: "余白",
    recognition: "足すより、ひとつ空けることで見えてくるものがあるかもしれません。",
    prompt: "今日は、何をひとつ減らすと少し楽になりそうですか。",
  },
  {
    id: "light",
    mark: "灯",
    name: "灯り",
    recognition: "全部を照らさなくても、次の一歩だけ見えれば十分なことがあります。",
    prompt: "いま、少しだけ確かめたいことは何ですか。",
  },
  {
    id: "window",
    mark: "窓",
    name: "窓",
    recognition: "同じ場所でも、見方を少し変えると景色が変わることがあります。",
    prompt: "別の角度から見てみたいことはありますか。",
  },
  {
    id: "stone",
    mark: "石",
    name: "石",
    recognition: "動かないものがあると、急がずに戻れる場所になります。",
    prompt: "今日は、変えなくていいものを一つ挙げるなら何ですか。",
  },
  {
    id: "wave",
    mark: "波",
    name: "波",
    recognition: "近づいたり離れたりするリズムも、ひとつの自然な動きです。",
    prompt: "今は進む時と休む時、どちらに少し近いですか。",
  },
  {
    id: "thread",
    mark: "糸",
    name: "糸",
    recognition: "細くても続いているものは、思ったより遠くまでつながっています。",
    prompt: "最近、途切れずに続いている小さなことはありますか。",
  },
  {
    id: "wind",
    mark: "風",
    name: "風",
    recognition: "止めるより、通り道をつくるほうが楽なこともあります。",
    prompt: "今日は、少し流してもいいことは何ですか。",
  },
  {
    id: "sprout",
    mark: "芽",
    name: "芽",
    recognition: "大きく見えなくても、始まりは小さいままで十分です。",
    prompt: "今、ほんの少し育てたいことはありますか。",
  },
  {
    id: "bridge",
    mark: "橋",
    name: "橋",
    recognition: "すぐに同じ場所へ行かなくても、間に道をつくることはできます。",
    prompt: "誰かや何かとの間に、ひとつ橋をかけるなら何をしますか。",
  },
  {
    id: "surface",
    mark: "水",
    name: "水面",
    recognition: "動いている最中より、静まったあとに見えるものがあります。",
    prompt: "答えを急がず置いておきたいことはありますか。",
  },
  {
    id: "key",
    mark: "鍵",
    name: "鍵",
    recognition: "開けることだけでなく、今は閉じておくことも選べます。",
    prompt: "今日は、どこまで開くか自分で決めたいことはありますか。",
  },
  {
    id: "guide",
    mark: "道",
    name: "道しるべ",
    recognition: "遠い目的地より、次の曲がり角だけで十分な日もあります。",
    prompt: "次に確かめる一歩をひとつだけ選ぶなら何ですか。",
  },
  {
    id: "raindrop",
    mark: "雨",
    name: "雨粒",
    recognition: "ひとつでは小さくても、重なると空気が変わることがあります。",
    prompt: "最近積み重なっている小さな変化はありますか。",
  },
  {
    id: "mirror",
    mark: "鏡",
    name: "鏡",
    recognition: "鏡は答えを決めず、そこにあるものを映すだけです。",
    prompt: "今の自分を評価せずに言葉にすると、どんな感じですか。",
  },
  {
    id: "door",
    mark: "扉",
    name: "扉",
    recognition: "開くかどうかを決める前に、そこに扉があると気づくだけでも十分です。",
    prompt: "まだ決めなくていいけれど、気になっている選択肢はありますか。",
  },
  {
    id: "footprint",
    mark: "足",
    name: "足あと",
    recognition: "大きな道筋がなくても、残った足あとから分かることがあります。",
    prompt: "ここ数日で、自分が実際にやった小さなことは何ですか。",
  },
] as const;

/** The pack, expressed as the capability's definition interface. Mechanics only cross this line. */
export const DAILY_SYMBOLS_DEFINITION: DiscoveryPatternDefinition = {
  pack_ref: DAILY_SYMBOLS_PACK_ID,
  pack_version: DAILY_SYMBOLS_PACK_VERSION,
  pattern_family: DAILY_SYMBOLS_PATTERN_FAMILY,
  calendar_timezone: DAILY_SYMBOLS_CALENDAR_TIMEZONE,
  result_ids: DAILY_SYMBOLS.map((symbol) => symbol.id),
  recent_exclusion_window: DAILY_SYMBOLS_RECENT_EXCLUSION_WINDOW,
};

export function dailySymbolById(id: string): DailySymbol | null {
  return DAILY_SYMBOLS.find((symbol) => symbol.id === id) ?? null;
}

// ── Locked consumer copy ─────────────────────────────────────────────────────

export const DAILY_SYMBOLS_COPY = {
  safetyNote: "正解や予言ではありません。今の自分に近いところだけ、持ち帰ってください。",
  eyebrow: "今日のひとつ",
  title: "今日のしるし",
  description: "今日は、ひとつだけ。答えを当てるものではなく、今の自分を見る小さなきっかけです。",
  primaryCta: "今日のしるしを見る",
  duration: "1分ほど・今日は一度だけ",
  completedCta: "今日のしるしを見返す",
  closeCta: "今日はここまで",
  shareCta: "結果を共有する",
  todayEntryDescription: "考えすぎずに、今日ひとつだけ。",
} as const;

/**
 * Sharing-lite derivative: allowlist-BUILT, never redacted. Exactly the pack display name, the
 * symbol name, one recognition line, and generic attribution — no id, no timestamp, no history,
 * no state, nothing personal. This is the ONLY text that may leave the result screen.
 */
export function buildShareText(symbol: Pick<DailySymbol, "name" | "recognition">): string {
  return [
    `今日のしるしは『${symbol.name}』でした。`,
    symbol.recognition,
    "正解や予言ではなく、今日を少し見るための小さなきっかけです。",
    "Yorisou",
  ].join("\n");
}
