// PXR-1 — what 探す is allowed to offer.
//
// REAL INVENTORY ONLY. Every entry below is a route that exists and does what the entry says it
// does. There are no "coming soon" tiles, no placeholder cards, and no categories that exist to
// make the screen look populated. A discovery surface that pads itself teaches people that most of
// what it shows is not worth tapping.
//
// This is deliberately small. 探す is not a catalogue of everything Yorisou can do; it is the
// shortest honest answer to "what could I do next?", grouped by the two things a person actually
// knows about themselves in the moment: how much time they have, and how deep they want to go.
//
// COPY_REFINEMENT_REQUIRED — neutral working Japanese, not final approved copy.

import type { IntentOptionId } from "@/lib/yorisou/today/currentStateCheckIn";

export type DiscoveryEntry = {
  id: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  limitations: string;
  /** Roughly how long, in the person's terms. Never a progress metric. */
  timeHint: string;
};

export const DISCOVERY_INVENTORY: readonly DiscoveryEntry[] = [
  {
    id: "light-check-in",
    title: "今の気配を見る",
    body: "いまの状態を、短い言葉にしてみる。",
    href: "/today/check-in",
    ctaLabel: "はじめる",
    limitations: "診断ではありません。選んだ内容をそのまま映すだけで、点数はつきません。",
    timeHint: "1〜2分",
  },
  {
    id: "themes",
    title: "テーマから見る",
    body: "気になっていることから選ぶ。",
    href: "/tests",
    ctaLabel: "テーマを見る",
    limitations: "扱っていないテーマもあります。ここにないものが問題ではない、という意味ではありません。",
    timeHint: "5分ほど",
  },
  {
    id: "ima-iro-deep",
    title: "いま色テスト",
    body: "120問で、今の動き方をじっくり見る。",
    href: "/tests/ima-iro",
    ctaLabel: "内容を見る",
    limitations: "時間がかかります。途中でやめても構いません。固定のタイプを決めるものではありません。",
    timeHint: "20分ほど",
  },
  {
    id: "saved",
    title: "保存したものを見る",
    body: "この端末に残してあるものを、あとから読み返す。",
    href: "/saved",
    ctaLabel: "見返す",
    limitations: "この端末にあるものだけです。ほかの端末とは共有されません。",
    timeHint: "すぐ",
  },
] as const;

/**
 * Which entry a check-in points at.
 *
 * This does NOT introduce a second intent→content mapping. It reads the ONE bounded lookup that
 * already exists in the check-in contract (`nextStepFor`) and finds the inventory entry sitting at
 * that route. A separate mapping here would be a place for the two to drift, and drift between two
 * "what should this person see next" tables is how a product starts making claims nobody approved.
 */
export function discoveryEntryForRoute(href: string): DiscoveryEntry | null {
  return DISCOVERY_INVENTORY.find((entry) => entry.href === href) ?? null;
}

/** Present so callers can type against the check-in contract without importing it twice. */
export type DiscoveryIntent = IntentOptionId;
