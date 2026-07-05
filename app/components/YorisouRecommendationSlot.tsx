"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { trackRecommendationSignals, type RecommendationSignalPayload } from "@/app/components/YorisouSignalTracker";
import type { RecommendationMode, RecommendationSignalSource, YorisouTestId } from "@/app/data/yorisouRecommendationSignals";
import type { RecommendationPackage } from "@/lib/server/relationship-intelligence/recommendation-orchestrator";

type Props = {
  testId: YorisouTestId;
  source: RecommendationSignalSource;
  resultId?: string | null;
  pagePath: string;
  mode: RecommendationMode;
  title?: string;
};

function buildShownPayload(
  recommendationPackage: RecommendationPackage,
  action: RecommendationPackage["primaryAction"],
  actionRole: "primary" | "secondary" | "suppressed",
): RecommendationSignalPayload {
  return {
    source: recommendationPackage.source,
    signalType: "recommendation_package_shown",
    testId: recommendationPackage.testId,
    resultId: recommendationPackage.resultId,
    actionId: action.actionId,
    actionRole,
    recommendationMode: recommendationPackage.recommendationMode,
    pagePath: recommendationPackage.trackingPayload.pagePath,
    metadata: {
      productLayer: action.productLayer,
      actionType: action.actionType,
      confidence: recommendationPackage.confidence,
      packageId: recommendationPackage.packageId,
    },
  };
}

function buildClickPayload(
  recommendationPackage: RecommendationPackage,
  action: RecommendationPackage["primaryAction"],
  actionRole: "primary" | "secondary",
): RecommendationSignalPayload[] {
  const payloads: RecommendationSignalPayload[] = [
    {
      source: recommendationPackage.source,
      signalType: "recommendation_action_clicked",
      testId: recommendationPackage.testId,
      resultId: recommendationPackage.resultId,
      actionId: action.actionId,
      actionRole,
      recommendationMode: recommendationPackage.recommendationMode,
      pagePath: recommendationPackage.trackingPayload.pagePath,
      metadata: {
        productLayer: action.productLayer,
        actionType: action.actionType,
        confidence: recommendationPackage.confidence,
        packageId: recommendationPackage.packageId,
      },
    },
  ];

  if (action.legacyInterestId && action.legacySignalType) {
    payloads.push({
      source: recommendationPackage.source,
      signalType: action.legacySignalType,
      testId: recommendationPackage.testId,
      resultId: recommendationPackage.resultId,
      interestId: action.legacyInterestId,
      pagePath: recommendationPackage.trackingPayload.pagePath,
      metadata: {
        actionId: action.actionId,
        packageId: recommendationPackage.packageId,
      },
    });
  }

  return payloads;
}

function buildSafetyNote(recommendationPackage: RecommendationPackage) {
  if (recommendationPackage.riskBoundary === "care_welfare_mobility_boundary") {
    return "暮らし領域では、直接のサービス申込みではなく、関心や声を送る入口だけを表示しています。";
  }
  if (recommendationPackage.riskBoundary === "clinical_or_fortune_boundary") {
    return "相手の気持ちや関係の結論を決める導線は出していません。自分の整理につながる入口だけを残しています。";
  }
  if (recommendationPackage.riskBoundary === "product_claim_boundary") {
    return "案づくりへの関心は、提供約束ではなくアイデア段階の入口として扱っています。";
  }
  return null;
}

export default function YorisouRecommendationSlot({
  testId,
  source,
  resultId,
  pagePath,
  mode,
  title = "次に試せること",
}: Props) {
  const [recommendationPackage, setRecommendationPackage] = useState<RecommendationPackage | null>(null);
  const trackedPackageRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendationPackage() {
      try {
        const response = await fetch("/api/open-testing/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            testId,
            resultId,
            source,
            pagePath,
            mode,
          }),
        });
        const payload = (await response.json().catch(() => null)) as
          | { ok?: boolean; package?: RecommendationPackage }
          | null;

        if (!cancelled && response.ok && payload?.ok && payload.package) {
          setRecommendationPackage(payload.package);
        }
      } catch {
        // Recommendation fetch must never block the public flow.
      }
    }

    void loadRecommendationPackage();

    return () => {
      cancelled = true;
    };
  }, [mode, pagePath, resultId, source, testId]);

  useEffect(() => {
    if (!recommendationPackage) {
      return;
    }
    if (trackedPackageRef.current === recommendationPackage.packageId) {
      return;
    }

    trackedPackageRef.current = recommendationPackage.packageId;

    const payloads: RecommendationSignalPayload[] = [
      buildShownPayload(recommendationPackage, recommendationPackage.primaryAction, "primary"),
      ...recommendationPackage.secondaryActions.map((action) => buildShownPayload(recommendationPackage, action, "secondary")),
      ...recommendationPackage.suppressedActions.map((action) => buildShownPayload(recommendationPackage, action, "suppressed")),
    ];

    void trackRecommendationSignals(payloads);
  }, [recommendationPackage]);

  if (!recommendationPackage) {
    return null;
  }

  const safetyNote = buildSafetyNote(recommendationPackage);

  return (
    <section className="space-y-3 rounded-[1.2rem] border border-[rgba(23,59,53,0.1)] bg-white/88 p-5 shadow-[0_14px_30px_rgba(23,59,53,0.06)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">{title}</p>
        <p className="text-[14px] leading-7 text-[#5F5750]">{recommendationPackage.explanation}</p>
      </div>

      <Link
        href={recommendationPackage.primaryAction.href}
        onClick={() => {
          void trackRecommendationSignals(
            buildClickPayload(recommendationPackage, recommendationPackage.primaryAction, "primary"),
          );
        }}
        className="block rounded-[1.1rem] border border-[#173B35] bg-[#173B35] px-4 py-4 text-white transition hover:-translate-y-0.5"
      >
        <span className="block text-[12px] font-semibold tracking-[0.08em] text-white/72">いちばん試しやすい入口</span>
        <span className="mt-1 block text-[15px] font-semibold leading-6">{recommendationPackage.primaryAction.title}</span>
        <span className="mt-1 block text-[13px] leading-6 text-white/82">{recommendationPackage.primaryAction.description}</span>
      </Link>

      {recommendationPackage.secondaryActions.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {recommendationPackage.secondaryActions.map((action) => (
            <Link
              key={action.actionId}
              href={action.href}
              onClick={() => {
                void trackRecommendationSignals(buildClickPayload(recommendationPackage, action, "secondary"));
              }}
              className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-[#F6FBF8] px-4 py-4 transition hover:-translate-y-0.5"
            >
              <span className="block text-[14px] font-semibold leading-6 text-[#173B35]">{action.title}</span>
              <span className="mt-1 block text-[12px] leading-6 text-[#6F625C]">{action.description}</span>
            </Link>
          ))}
        </div>
      ) : null}

      {safetyNote ? (
        <p className="text-[12px] leading-6 text-[#7A7068]">{safetyNote}</p>
      ) : null}
    </section>
  );
}
