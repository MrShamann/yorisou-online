// OSF-1 — the visibility sentences, in one place, because they are promises.
//
// WHY THIS MODULE EXISTS.
//
// Five surfaces told people 「あなただけが見られます」 — "only you can see this". For the Life OS
// records that is a fair description of who ELSE can read them, but as an absolute claim it is not
// true of the product, and for one real case it is plainly false:
//
//   lib/server/experienceCards.ts trustFlags() flags text containing 診断 / 治療 / 必ず治る /
//   絶対に効く. createExperience() then sets moderation_status='limited' — including for a PRIVATE
//   card — and moderationQueue() selects `moderation_status.eq.limited or .eq.published` with
//   `select=*`. So a person writing 「うつ病と診断されて休職した」 as a private note for themselves
//   has that note, in full, in the Founder moderation queue, on a screen that just told them nobody
//   else would see it.
//
// That is not a hypothetical for a product about how people are coping: describing a diagnosis is
// one of the most ordinary things someone would write here.
//
// WHAT IS ACTUALLY TRUE, AND SAID BELOW.
//
//   1. Other USERS cannot read it. This is provable, not aspirational: discoverExperiences,
//      sharedCard and invitedCard every one require a shared visibility plus moderation_status
//      'published' plus searchable, and the Life OS tables grant anon/authenticated nothing at all
//      and are read only through owner-scoped server queries.
//   2. Yorisou's own systems and, in bounded cases, its operators can. Saying so is not a
//      disclaimer bolted on — it is the difference between a promise the product keeps and one it
//      does not.
//
// Kept as constants so the five surfaces cannot drift into five different promises, and so
// lib/server/__tests__/osf1PrivacyCopy.test.ts can assert that no surface reintroduces an absolute
// claim.

/**
 * Who else can read it. The load-bearing sentence, and the one that is literally true.
 *
 * Deliberately "ほかの利用者に表示されることはありません" (it is not shown to other users) rather than
 * "あなただけが見られます" (only you can see it). The first is a statement about other users, which
 * the code enforces. The second is a statement about everyone, which it does not.
 */
export const NOT_VISIBLE_TO_OTHER_USERS = "ほかの利用者に表示されることはありません。";

/**
 * The separate, honest sentence about internal handling. Separate on purpose: the Founder's
 * requirement is that internal processing be "explained separately", not folded into the
 * reassurance as a qualifier nobody reads.
 */
export const INTERNAL_HANDLING = "保存先はYorisouのサーバーです。運営が内容を見るのは、安全確認が必要なときに限られます。";

/**
 * Experience cards only: the specific, nameable trigger.
 *
 * Naming the trigger rather than hinting at it. Someone deciding whether to write about a diagnosis
 * deserves to know before they type, not after — and a vague "sometimes we review content" would
 * leave them guessing about exactly the sentence they were most hesitant to write.
 */
export const SAFETY_REVIEW_TRIGGER =
  "診断や治療にふれる内容は、安全確認の対象になることがあります。そのとき運営が本文を確認します。";

/** Life OS records (state, goals, reflections, memories): no operator surface reads these today. */
export const LIFE_OS_PRIVACY = `${NOT_VISIBLE_TO_OTHER_USERS}${INTERNAL_HANDLING}`;

/** Experience cards: the same, plus the trigger that can route a private card to a human. */
export const EXPERIENCE_PRIVACY = `${NOT_VISIBLE_TO_OTHER_USERS}${INTERNAL_HANDLING}${SAFETY_REVIEW_TRIGGER}`;

/**
 * Phrases that claim absolute user-only visibility. No surface may contain one.
 *
 * Asserted by the test rather than left to review: this is the exact wording that was shipped and
 * had to be corrected, so the cheapest way for it to come back is someone reaching for the shorter,
 * warmer sentence in a hurry.
 */
export const PROHIBITED_ABSOLUTE_VISIBILITY_CLAIMS = [
  "あなただけが見られます",
  "あなただけが見ることができます",
  "あなた以外には公開されません",
  "あなた以外は見られません",
  "誰にも見られません",
  "だれにも見られません",
] as const;
