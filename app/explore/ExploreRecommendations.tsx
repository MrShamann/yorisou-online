"use client";

import { useSyncExternalStore } from "react";

import RecommendationCard, { useRecommendationFeedback } from "../components/RecommendationCard";
import {
  DISCOVERY_INVENTORY,
  discoveryEntryForRoute,
} from "@/lib/yorisou/recommendations/discoveryInventory";
import {
  buildRecommendationObject,
  type RecommendationEvidence,
} from "@/lib/yorisou/recommendations/recommendationObject";
import {
  labelForIntent,
  nextStepFor,
  readCurrentStateCheckIn,
  subscribeCurrentStateCheckIn,
} from "@/lib/yorisou/today/currentStateCheckIn";
import { readSavedResultRecord, subscribeSavedResult } from "../result/saveState";

// 探す — the discovery list.
//
// THE HEADING IS THE HONEST PART. A person with no history sees 「まずはここから」, not
// 「あなたにおすすめ」: with nothing recorded there is no "you" for the product to have an opinion
// about, and pretending otherwise is the exact failure the reason classes exist to prevent. The
// heading changes only when something real changed — a completed check-in, or a saved result.
//
// Every item is a RecommendationObject, so the reason on each card is derived from evidence rather
// than written next to it. The one personal item is chosen by the check-in contract's own bounded
// lookup; nothing here decides for itself what a person "needs".
export default function ExploreRecommendations() {
  const checkIn = useSyncExternalStore(
    subscribeCurrentStateCheckIn,
    readCurrentStateCheckIn,
    () => null,
  );
  const saved = useSyncExternalStore(subscribeSavedResult, readSavedResultRecord, () => null);
  const feedback = useRecommendationFeedback();

  const personalHref = checkIn ? nextStepFor(checkIn.intent).href : null;
  const personalEntry = personalHref ? discoveryEntryForRoute(personalHref) : null;

  // 保存したものを見る is only shown once there IS something saved. Offering a route to an empty
  // shelf is a dead end dressed as a feature.
  const hasSavedAnything = Boolean(saved) || feedback.saved.length > 0;

  const entries = DISCOVERY_INVENTORY.filter((entry) => entry.id !== "saved" || hasSavedAnything);

  const ordered = personalEntry
    ? [personalEntry, ...entries.filter((entry) => entry.id !== personalEntry.id)]
    : entries;

  const objects = ordered.map((entry) => {
    let evidence: RecommendationEvidence = { kind: "editorial" };
    if (personalEntry && entry.id === personalEntry.id && checkIn) {
      evidence = {
        kind: "current_checkin",
        intentLabel: labelForIntent(checkIn.intent),
        capturedAt: checkIn.completedAt,
      };
    } else if (entry.id === "saved" && saved) {
      evidence = { kind: "recent_result", resultLabel: saved.resultLabel, savedAt: saved.savedAt };
    } else if (!checkIn && !saved) {
      // Nothing is known about this person at all, and the card says exactly that.
      evidence = { kind: "none" };
    }

    return buildRecommendationObject({
      id: entry.id,
      title: entry.title,
      body: `${entry.body}（${entry.timeHint}）`,
      href: entry.href,
      ctaLabel: entry.ctaLabel,
      limitations: entry.limitations,
      evidence,
    });
  });

  // The heading only claims what the CARDS can back up. When the check-in's next step is 探す
  // itself — which it is for three of the five intents, because "browse" is a legitimate answer —
  // there is no single personal item, so the heading stays neutral and the check-in is stated as
  // the plain fact it is. A heading that says 今日えらんだ内容から over four editorial cards would
  // be the same overclaim the reason classes exist to stop, moved up one level.
  const heading = personalEntry ? "今日えらんだ内容から" : "まずはここから";

  return (
    <section className="mt-7">
      <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        {heading}
      </h2>
      {checkIn && !personalEntry ? (
        <p className="mt-2 text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          今日は「{labelForIntent(checkIn.intent)}」を選びました。
        </p>
      ) : null}
      <div className="mt-3 flex flex-col gap-3">
        {objects.map((object) => (
          <RecommendationCard key={object.id} object={object} />
        ))}
      </div>
    </section>
  );
}
