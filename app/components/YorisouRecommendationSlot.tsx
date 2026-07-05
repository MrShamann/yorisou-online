"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { trackRecommendationSignals, type RecommendationSignalPayload } from "@/app/components/YorisouSignalTracker";
import type { RecommendationMode, RecommendationSignalSource, YorisouTestId } from "@/app/data/yorisouRecommendationSignals";
import type { RecommendationMemorySummary } from "@/lib/server/relationship-intelligence/recommendation-memory";
import type { RecommendationPackage } from "@/lib/server/relationship-intelligence/recommendation-orchestrator";

type Props = {
  testId: YorisouTestId;
  source: RecommendationSignalSource;
  resultId?: string | null;
  pagePath: string;
  mode: RecommendationMode;
  title?: string;
};

type RecommendationApiResponse = {
  ok?: boolean;
  package?: RecommendationPackage;
  memory?: RecommendationMemorySummary;
};

const TEST_LABELS: Record<YorisouTestId, string> = {
  "current-state": "入口一覧",
  "love-distance": "恋愛の距離感",
  "work-rhythm": "仕事のリズム",
  "name-impression": "名前の印象",
  "local-life": "暮らしの困りごと",
};

const INTEREST_LABELS: Record<string, string> = {
  "report-preview": "レポート",
  "line-save": "LINE保存",
  "related-test": "関連テスト",
  "select-info": "Select",
  "design-interest": "Design",
  "community-interest": "Community",
  "local-life-interest": "Local Life",
};

function buildShownPayload(
  recommendationPackage: RecommendationPackage,
  action: RecommendationPackage["primaryAction"],
  actionRole: "primary" | "secondary" | "suppressed",
  memory: RecommendationMemorySummary | null,
): RecommendationSignalPayload {
  const signalType =
    recommendationPackage.recommendationMode === "return_session"
      ? "return_recommendation_shown"
      : "recommendation_package_shown";
  return {
    source: recommendationPackage.source,
    signalType,
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
      memoryState: memory?.memoryState || null,
      recentSignalCount: memory?.recentSignalCount || 0,
      staleSignals: memory?.staleSignals || false,
    },
  };
}

function buildClickPayload(
  recommendationPackage: RecommendationPackage,
  action: RecommendationPackage["primaryAction"],
  actionRole: "primary" | "secondary",
  memory: RecommendationMemorySummary | null,
): RecommendationSignalPayload[] {
  const signalType =
    recommendationPackage.recommendationMode === "return_session"
      ? "return_recommendation_clicked"
      : "recommendation_action_clicked";
  const payloads: RecommendationSignalPayload[] = [
    {
      source: recommendationPackage.source,
      signalType,
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
        memoryState: memory?.memoryState || null,
        recentSignalCount: memory?.recentSignalCount || 0,
        staleSignals: memory?.staleSignals || false,
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

function buildMemorySummary(memory: RecommendationMemorySummary | null) {
  if (!memory) {
    return null;
  }

  if (memory.memoryState === "no_memory") {
    return {
      title: "まだ記録が少ない状態です。",
      detail: "まずは気になる入口から始めてください。",
    };
  }

  const recentTests = memory.recentTests.map((testId) => TEST_LABELS[testId]).filter(Boolean).slice(0, 2).join(" / ");
  const recentInterests = memory.recentInterests.map((interestId) => INTEREST_LABELS[interestId] || interestId).slice(0, 2).join(" / ");
  const detailParts = [recentTests ? `最近の入口: ${recentTests}` : null, recentInterests ? `関心: ${recentInterests}` : null].filter(Boolean);

  return {
    title: "前回の続きに近い入口です。",
    detail: detailParts.join(" ・ ") || "最近の動きから続けやすい入口を選んでいます。",
  };
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
  const [memorySummary, setMemorySummary] = useState<RecommendationMemorySummary | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const trackedPackageRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendationPackage() {
      try {
        setLoadFailed(false);
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
        const payload = (await response.json().catch(() => null)) as RecommendationApiResponse | null;

        if (!cancelled && response.ok && payload?.ok && payload.package) {
          setRecommendationPackage(payload.package);
          setMemorySummary(payload.memory || null);
          return;
        }

        if (!cancelled) {
          setLoadFailed(true);
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
        }
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
      buildShownPayload(recommendationPackage, recommendationPackage.primaryAction, "primary", memorySummary),
      ...recommendationPackage.secondaryActions.map((action) =>
        buildShownPayload(recommendationPackage, action, "secondary", memorySummary),
      ),
      ...recommendationPackage.suppressedActions.map((action) =>
        buildShownPayload(recommendationPackage, action, "suppressed", memorySummary),
      ),
    ];

    void trackRecommendationSignals(payloads);
  }, [memorySummary, recommendationPackage]);

  if (!recommendationPackage && loadFailed) {
    return (
      <section className="space-y-3 rounded-[1.2rem] border border-[rgba(23,59,53,0.1)] bg-white/88 p-5 shadow-[0_14px_30px_rgba(23,59,53,0.06)]">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">{title}</p>
        <p className="text-[14px] leading-7 text-[#5F5750]">
          次に試せる入口を読み込めませんでした。診断一覧から選べます。
        </p>
        <Link
          href="/tests"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-[#F6FBF8] px-4 text-[13px] font-semibold text-[#173B35]"
        >
          診断一覧を見る
        </Link>
      </section>
    );
  }

  if (!recommendationPackage) {
    return null;
  }

  const safetyNote = buildSafetyNote(recommendationPackage);
  const memory = buildMemorySummary(memorySummary);

  return (
    <section className="space-y-3 rounded-[1.2rem] border border-[rgba(23,59,53,0.1)] bg-white/88 p-5 shadow-[0_14px_30px_rgba(23,59,53,0.06)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">{title}</p>
        {memory ? (
          <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F6FBF8] px-4 py-3">
            <p className="text-[13px] font-semibold leading-6 text-[#173B35]">{memory.title}</p>
            <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">{memory.detail}</p>
          </div>
        ) : null}
        <p className="text-[14px] leading-7 text-[#5F5750]">{recommendationPackage.explanation}</p>
      </div>

      <Link
        href={recommendationPackage.primaryAction.href}
        onClick={() => {
          void trackRecommendationSignals(
            buildClickPayload(recommendationPackage, recommendationPackage.primaryAction, "primary", memorySummary),
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
                void trackRecommendationSignals(buildClickPayload(recommendationPackage, action, "secondary", memorySummary));
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
