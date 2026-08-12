// UX-2R / CPC-1 Wave A — the single place that decides WHICH identity a link may carry.
//
// The persisted result row id is a private, owner-scoped credential-adjacent identifier. Before
// this module, every outbound link from /result was built by one shared helper, so any link that
// gained the stable identity gained it everywhere — including the share surface, which is designed
// to be handed to another person.
//
// Wave A splits the two intents so the distinction is structural rather than a convention someone
// has to remember:
//
//   PRIVATE CONTINUITY  — /report-loading, the report entry, /recommendations, /result/return.
//                         These stay inside the person's own session and MUST carry the stable
//                         identity so the destination reads the same persisted record rather than
//                         recomputing from URL parameters.
//
//   PUBLIC DERIVATIVE   — /result/share and any share-card URL. These may carry ONLY governed
//                         public content parameters. The private row id is never appended, and the
//                         type system does not offer a way to append it.
//
// Legacy parameters remain supported for pre-persistence links, but in persisted mode they are
// deliberately NOT emitted: the destination must resolve the record, not a URL-encoded result.

import {
  buildPublicResultHref,
  type PublicResultRouteContext,
} from "../tests/ima-iro/resultCompatibility";

/** The stable, private identity of one persisted assessment result. */
export type PersistedResultIdentity = {
  /** `yorisou_assessment_results.id` — private, owner-scoped. Never leaves the person's session. */
  resultRowId: string;
};

/** A pre-persistence result reconstructed from URL parameters only. */
export type LegacyResultIdentity = PublicResultRouteContext;

export type ResultIdentity =
  | { mode: "persisted"; persisted: PersistedResultIdentity; legacy: LegacyResultIdentity }
  | { mode: "legacy"; legacy: LegacyResultIdentity };

export const PERSISTED_RESULT_QUERY_KEY = "result" as const;

export function persistedIdentity(
  resultRowId: string,
  legacy: LegacyResultIdentity,
): ResultIdentity {
  return { mode: "persisted", persisted: { resultRowId }, legacy };
}

export function legacyIdentity(legacy: LegacyResultIdentity): ResultIdentity {
  return { mode: "legacy", legacy };
}

/**
 * A link that stays inside the person's own session.
 *
 * In persisted mode this emits ONLY `?result=<uuid>`. Legacy parameters are omitted on purpose:
 * carrying both would let a destination silently prefer the URL-encoded result over the record,
 * which is exactly the divergence Wave A exists to remove.
 */
export function buildPrivateContinuityHref(pathname: string, identity: ResultIdentity) {
  if (identity.mode === "persisted") {
    const params = new URLSearchParams();
    params.set(PERSISTED_RESULT_QUERY_KEY, identity.persisted.resultRowId);
    return `${pathname}?${params.toString()}`;
  }
  return buildPublicResultHref(pathname, identity.legacy);
}

/**
 * A link that may be handed to another person.
 *
 * Public content parameters only. The persisted row id is unreachable here by construction — this
 * function never reads `identity.persisted`.
 */
export function buildPublicShareHref(pathname: string, identity: ResultIdentity) {
  const href = buildPublicResultHref(pathname, {
    resultId: identity.legacy.resultId,
    overlayId: identity.legacy.overlayId,
    // A share link carries governed public content only: no confidence band, no payload key.
  });
  return href;
}

/** Guard used by tests and by the share surface: a public link must never expose the row id. */
export function shareHrefExposesPrivateIdentity(href: string) {
  return new URLSearchParams(href.split("?")[1] || "").has(PERSISTED_RESULT_QUERY_KEY);
}
