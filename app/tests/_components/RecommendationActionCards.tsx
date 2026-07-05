"use client";

import { RECOMMENDATION_NEXT_ACTIONS, type RecommendationInterestId, type RecommendationSignalSource, type YorisouTestId } from "@/app/data/yorisouRecommendationSignals";
import { RecommendationSignalLink } from "@/app/components/YorisouSignalTracker";

type Props = {
  testId: YorisouTestId;
  source: RecommendationSignalSource;
  actionIds: readonly RecommendationInterestId[];
  resultId?: string | null;
  pagePath: string;
};

export default function RecommendationActionCards({ testId, source, actionIds, resultId, pagePath }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">次につながる入口</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {actionIds.map((actionId) => {
          const action = RECOMMENDATION_NEXT_ACTIONS[actionId];
          return (
            <RecommendationSignalLink
              key={action.id}
              href={action.href}
              signal={{
                source,
                signalType: action.signalType,
                testId,
                resultId: resultId || null,
                interestId: action.id,
                pagePath,
              }}
              className="rounded-[1.15rem] border border-[rgba(23,59,53,0.12)] bg-white/88 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
            >
              <span className="block text-[14px] font-semibold leading-6 text-[#173B35]">{action.title}</span>
              <span className="mt-1 block text-[12px] leading-6 text-[#6F625C]">{action.description}</span>
            </RecommendationSignalLink>
          );
        })}
      </div>
    </div>
  );
}
