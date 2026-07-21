// YV-1 §15 — canonical PRIVATE, consent-gated recommendation hints for a scored
// result. Hints only, never verdicts; private-only; no commercial/affiliate/
// supplier content; no payment; no automatic external action; default is
// no_recommendation until the user opts in. Each hint is a canonical tag carried
// on the result with its canonical fitReason, evidence and boundary — no
// generalized recommendation engine, no ranking change.

import { YORISOU_VALUES_DEFINITION, type YorisouValuesResultId } from "./definition.generated";

type ResultRecord = (typeof YORISOU_VALUES_DEFINITION.results)[number];
const RESULT_BY_ID = new Map<string, ResultRecord>(YORISOU_VALUES_DEFINITION.results.map((r) => [r.resultId, r]));
const GOVERNED = new Set<string>(YORISOU_VALUES_DEFINITION.recommendationGovernedTags);

export type YorisouValuesHint = {
  tag: string;
  fitReasonJa: string | null;
  evidenceSource: string | null;
  consent: "recommendation purpose consent required";
  boundary: "private-only; never in share/URL";
};

// Returns the canonical hints for a result ONLY when the user has opted in;
// otherwise the single no_recommendation default.
export function hintsForResult(resultId: YorisouValuesResultId, consentGranted: boolean): YorisouValuesHint[] {
  const noRecommendation: YorisouValuesHint = {
    tag: "no_recommendation",
    fitReasonJa: null,
    evidenceSource: null,
    consent: "recommendation purpose consent required",
    boundary: "private-only; never in share/URL",
  };
  if (!consentGranted) return [noRecommendation];
  const result = RESULT_BY_ID.get(resultId);
  const recs = (result?.private as { recommendations?: { tag: string; fitReasonJa: string; evidenceSource: string }[] } | undefined)?.recommendations;
  if (!recs || recs.length === 0) return [noRecommendation];
  return recs
    .filter((r) => GOVERNED.has(r.tag))
    .map((r) => ({
      tag: r.tag,
      fitReasonJa: r.fitReasonJa,
      evidenceSource: r.evidenceSource,
      consent: "recommendation purpose consent required" as const,
      boundary: "private-only; never in share/URL" as const,
    }));
}
