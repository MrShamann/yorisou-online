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
import { loadRecommendationSet } from "@/lib/server/recommendationStore";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import CanonicalRecommendationList from "../CanonicalRecommendationList";
import { MvpCard, MvpPill } from "../../components/MvpSurface";

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
    // Authorization alone would leave a generic graph behind a lock. Load the PERSISTED set so the
    // page renders what the database actually holds — including every signal already recorded —
    // rather than regenerating something new on each visit.
    const viewer = await getViewerContext();
    const ownerId = viewer.account?.id || viewer.legacyAccount?.id;
    if (!ownerId) return <PersistedResultUnavailable />;

    const recs = await loadRecommendationSet(loaded.context.resultRowId, ownerId, "graph");
    if (recs.outcome === "withheld") {
      return (
        <RecommendationWithheld
          status={loaded.context.status}
          resultHref={`/result?result=${encodeURIComponent(loaded.context.resultRowId)}`}
        />
      );
    }
    if (recs.outcome !== "ok") return <PersistedResultUnavailable />;

    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_44%,_#F4FAF7_100%)] text-[#2F2A28]">
        <section className="container py-8">
          <div className="mx-auto w-full max-w-[44rem] space-y-5">
            <MvpPill>今の状態から、小さく選ぶ</MvpPill>
            <MvpCard className="space-y-5 p-5 sm:p-7">
              <h1 className="display-serif text-[2rem] leading-[1.16] md:text-[2.4rem]">
                いまのあなたに合わせた入口
              </h1>
              <CanonicalRecommendationList set={recs.set} surface="graph" />
            </MvpCard>
          </div>
        </section>
      </main>
    );
  }

  return <RecommendationGraphView />;
}
