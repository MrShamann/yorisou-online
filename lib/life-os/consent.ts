// LCO-1 — the Life OS explanation a person sees once, before anything durable is kept.
//
// THE WORDING IS FOUNDER-APPROVED AND IS NOT AN IMPLEMENTATION DETAIL.
//
// Gate 5 required consent-comprehension copy verified verbatim. What follows is that copy, split
// into four lines for reading on a phone and given normal Japanese punctuation. Splitting and
// spacing are presentation; the sentences are unchanged. Changing what any of them MEANS is a
// Founder act, which is why the version below travels with the text: if the meaning ever changes,
// the version changes, and a previous acceptance stops counting rather than silently carrying over
// to words the person never read.
//
// WHY EACH LINE IS THERE, since a consent screen that nobody understands is not consent:
//   1. what the product actually does — connect what YOU left, not what it guessed about you
//   2. the boundary that matters most here — an AI guess never becomes a confirmed fact
//   3. the controls — this is reversible, and the sentence says so before you agree
//   4. the disclosure boundary — nothing is published to other users automatically
//
// NOT A LEGAL WALL. Four sentences, two buttons, and the decline is a real option with equal
// standing — no pre-ticked box, no "recommended" badge, no dark pattern that makes declining feel
// like a mistake. The terms and privacy policy remain where they are; this is comprehension, not a
// contract restatement.

/**
 * The version of the wording below. Bump ONLY when the meaning changes.
 *
 * Dated rather than sequential so that a stored acceptance says WHEN, in the wording's own terms,
 * without needing a lookup table to interpret it.
 */
export const LIFE_OS_CONSENT_VERSION = "2026-08-21.v1";

/** The four sentences, verbatim. */
export const LIFE_OS_CONSENT_LINES = [
  "YORISOUは、あなたが自分で残した結果・状態・振り返り・確認した情報を、あとから見返せるようにつなげます。",
  "AIの推測を、あなたが確認した事実として保存することはありません。",
  "保存された内容は、あとから確認・修正・削除できます。",
  "あなたの情報が、他のユーザーに自動で公開されることはありません。",
] as const;

export const LIFE_OS_CONSENT_ACCEPT = "この内容で続ける";
export const LIFE_OS_CONSENT_DECLINE = "今は使わない";

/** Whether a stored acceptance still covers the wording shown today. */
export function consentIsCurrent(
  record: { consent_version: string; revoked_at: string | null } | null,
): boolean {
  if (!record) return false;
  if (record.revoked_at !== null) return false;
  return record.consent_version === LIFE_OS_CONSENT_VERSION;
}
