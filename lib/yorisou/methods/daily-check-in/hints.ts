// DCI-1 — canonical PRIVATE recommendation-hint mapping (kyou_hoshii → governed
// need_* tags). Hints only, never verdicts; private-only; no commercial content;
// never sent to LINE; never written into cross-method understanding in DCI-1.
// Surfaced ONLY after the user explicitly chooses to see the hint (the applicable
// consent action in this vertical slice).

import { DAILY_CHECK_IN_DEFINITION } from "./definition.generated";

export type DailyHint = {
  tag: string; // governed taxonomy tag (need_* | no_recommendation)
  fitReasonJa: string | null;
  sourceOptionId: string | null; // answer-traceable source
  consent: "user_initiated_reveal_only"; // private boundary — no automatic surfacing
};

export function hintForEntry(stateValues: Record<string, string | null>): DailyHint {
  const need = stateValues.kyou_hoshii;
  if (!need) {
    // Canonical: a day without kyou_hoshii produces no hint (explicit no_recommendation).
    return { tag: "no_recommendation", fitReasonJa: null, sourceOptionId: null, consent: "user_initiated_reveal_only" };
  }
  const mapping = DAILY_CHECK_IN_DEFINITION.needMapping.find((m) => m.optionId === need);
  if (!mapping) return { tag: "no_recommendation", fitReasonJa: null, sourceOptionId: null, consent: "user_initiated_reveal_only" };
  return { tag: mapping.tag, fitReasonJa: mapping.fitReasonJa, sourceOptionId: need, consent: "user_initiated_reveal_only" };
}
