// UX-2R / CPC-1 §2 — the graph is a recommendation destination, and is gated like one.
//
// Before this, the graph merely *received* `?result=<row-id>` and did nothing with it: no canonical
// load, no eligibility check, no use of the accepted (corrected) result. So the consent gate held
// for exactly one hop — /result → /recommendations — and then dissolved. Anyone could open the
// graph directly for a result they had rejected, deferred or never answered.

import RecommendationGraphView from "../view";
import RecommendationWithheld from "../RecommendationWithheld";
import PersistedResultUnavailable from "../../result/PersistedResultUnavailable";
import { requireRecommendationContext } from "@/lib/server/canonicalResultContext";

export const dynamic = "force-dynamic";

export default async function RecommendationGraphPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = (await searchParams) || {};
  const rawRowId = typeof query.result === "string" ? query.result : null;

  if (rawRowId) {
    const loaded = await requireRecommendationContext(rawRowId);
    if (loaded.outcome === "unavailable") return <PersistedResultUnavailable />;
    if (loaded.outcome === "withheld") {
      return (
        <RecommendationWithheld
          status={loaded.context.status}
          resultHref={`/result?result=${encodeURIComponent(loaded.context.resultRowId)}`}
        />
      );
    }
  }

  return <RecommendationGraphView />;
}
