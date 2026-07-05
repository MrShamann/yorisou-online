"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { buildCompanionSeed, type CompanionSeed } from "@/lib/yorisou/companion/companion-seed";
import { trackRecommendationSignal, type RecommendationSignalPayload } from "@/app/components/YorisouSignalTracker";
import type { RecommendationMemorySummary } from "@/lib/server/relationship-intelligence/recommendation-memory";
import type { RecommendationPackage } from "@/lib/server/relationship-intelligence/recommendation-orchestrator";
import type {
  RecommendationMode,
  RecommendationSignalSource,
  RecommendationSignalTestId,
} from "@/lib/server/relationship-intelligence/types";

type RecommendationApiResponse = {
  ok?: boolean;
  package?: RecommendationPackage;
  memory?: RecommendationMemorySummary;
};

type Props = {
  testId: RecommendationSignalTestId;
  source: RecommendationSignalSource;
  resultId?: string | null;
  pagePath: string;
  mode: RecommendationMode;
  variant?: "result" | "return";
};

const PROBE_VALUE_LABELS = [
  "相棒の週次ふりかえり",
  "相棒カードの保存履歴",
  "見た目のカスタマイズ",
  "深いレポートとのつながり",
] as const;

function buildCompanionPayload(
  signalType: RecommendationSignalPayload["signalType"],
  seed: CompanionSeed,
  props: Props,
  extra?: Partial<RecommendationSignalPayload>,
): RecommendationSignalPayload {
  return {
    source: props.variant === "return" ? "line_mini_app" : "companion_card",
    signalType,
    testId: props.testId,
    resultId: props.resultId || null,
    recommendationMode: props.mode,
    pagePath: props.pagePath,
    companionArchetypeId: seed.archetypeId,
    metadata: {
      companionSeedId: seed.seedId,
      companionSeedSource: seed.source,
      confidence: seed.confidence,
      isFallback: seed.isFallback,
    },
    ...extra,
  };
}

function buildFallbackSeed(props: Props) {
  return buildCompanionSeed({
    testId: props.testId,
    resultId: props.resultId || null,
    source: props.variant === "return" ? "return_session" : "fallback",
  });
}

export default function YorisouCompanionCard({
  testId,
  source,
  resultId,
  pagePath,
  mode,
  variant = "result",
}: Props) {
  const [recommendationPackage, setRecommendationPackage] = useState<RecommendationPackage | null>(null);
  const [recommendationMemory, setRecommendationMemory] = useState<RecommendationMemorySummary | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCompanionContext() {
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

        if (!cancelled && response.ok && payload?.ok) {
          setRecommendationPackage(payload.package || null);
          setRecommendationMemory(payload.memory || null);
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

    void loadCompanionContext();

    return () => {
      cancelled = true;
    };
  }, [mode, pagePath, resultId, source, testId]);

  const seed = useMemo(
    () =>
      buildCompanionSeed({
        testId,
        resultId: resultId || null,
        recommendationPackage,
        recommendationMemory,
        source:
          variant === "return"
            ? "return_session"
            : recommendationPackage || recommendationMemory
              ? "result_page"
              : "fallback",
      }),
    [recommendationMemory, recommendationPackage, resultId, testId, variant],
  );

  useEffect(() => {
    if (trackedRef.current === seed.seedId) {
      return;
    }

    trackedRef.current = seed.seedId;
    void trackRecommendationSignal(
      buildCompanionPayload(
        variant === "return" ? "companion_return_block_viewed" : "companion_card_viewed",
        seed,
        { testId, source, resultId, pagePath, mode, variant },
      ),
    );
  }, [mode, pagePath, resultId, seed, source, testId, variant]);

  const subtitle =
    variant === "return"
      ? "前回のチェックや最近の入口から、今日戻りやすい場所をひとつ表示します。"
      : "今のチェック結果や最近の選び方から生まれた、小さな目印です。";

  const selectedOption = seed.boundedOptions.find((entry) => entry.id === selectedOptionId) || null;
  const selectedSubscriptionChoice =
    seed.subscriptionProbe?.choices.find((entry) => entry.id === selectedSubscription) || null;

  const fallbackSeed = loadFailed ? buildFallbackSeed({ testId, source, resultId, pagePath, mode, variant }) : null;
  const visibleSeed = fallbackSeed || seed;

  return (
    <section className="space-y-4 rounded-[1.25rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-5 shadow-[0_16px_34px_rgba(23,59,53,0.07)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">
          {variant === "return" ? "前回の続き" : "よりそうの小さな相棒"}
        </p>
        <h2 className="display-serif text-[1.45rem] leading-[1.28] text-[#2F2A28] md:text-[1.8rem]">
          よりそうの小さな相棒
        </h2>
        <p className="text-[13px] leading-7 text-[#6F625C]">{subtitle}</p>
      </div>

      <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-[#F6FBF8] p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[1.5rem] shadow-[0_10px_20px_rgba(23,59,53,0.08)]">
            {visibleSeed.motifEmoji}
          </span>
          <div>
            <p className="text-[15px] font-semibold leading-6 text-[#173B35]">{visibleSeed.displayNameJa}</p>
            <p className="text-[12px] leading-6 text-[#6F625C]">{visibleSeed.shortMessageJa}</p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-7 text-[#5F5750]">{visibleSeed.stateSummaryJa}</p>
        {recommendationMemory?.staleSignals && recommendationMemory.memoryState !== "no_memory" ? (
          <p className="mt-2 text-[12px] leading-6 text-[#7A7068]">
            少し前の動きも含めた目印なので、今日は軽く見直す入口として使ってください。
          </p>
        ) : null}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <Link
          href={visibleSeed.recommendedCta.href}
          onClick={() => {
            void trackRecommendationSignal(
              buildCompanionPayload("companion_cta_clicked", visibleSeed, {
                testId,
                source,
                resultId,
                pagePath,
                mode,
                variant,
              }, {
                actionId: visibleSeed.recommendedCta.actionId,
                metadata: {
                  companionSeedId: visibleSeed.seedId,
                  companionSeedSource: visibleSeed.source,
                  confidence: visibleSeed.confidence,
                  isFallback: visibleSeed.isFallback,
                  companionActionType: visibleSeed.recommendedCta.actionType,
                },
              }),
            );
          }}
          className="flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 text-[14px] font-semibold text-white transition hover:-translate-y-0.5"
        >
          {visibleSeed.recommendedCta.label}
        </Link>
        {visibleSeed.lineReturnCta ? (
          <Link
            href={visibleSeed.lineReturnCta.href}
            onClick={() => {
              void trackRecommendationSignal(
                buildCompanionPayload("companion_line_return_clicked", visibleSeed, {
                  testId,
                  source,
                  resultId,
                  pagePath,
                  mode,
                  variant,
                }, {
                  actionId: visibleSeed.lineReturnCta?.actionId || null,
                }),
              );
            }}
            className="flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-4 text-[14px] font-semibold text-[#173B35] transition hover:-translate-y-0.5"
          >
            {visibleSeed.lineReturnCta.label}
          </Link>
        ) : null}
      </div>

      {visibleSeed.boundedQuestion ? (
        <div className="space-y-3 rounded-[1.1rem] border border-[rgba(23,59,53,0.08)] bg-[#FCFAF6] p-4">
          <p className="text-[13px] font-semibold leading-6 text-[#2F2A28]">{visibleSeed.boundedQuestion}</p>
          <div className="grid gap-2">
            {visibleSeed.boundedOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedOptionId(option.id);
                  void trackRecommendationSignal(
                    buildCompanionPayload("companion_question_answered", visibleSeed, {
                      testId,
                      source,
                      resultId,
                      pagePath,
                      mode,
                      variant,
                    }, {
                      companionOptionId: option.id,
                    }),
                  );
                  void trackRecommendationSignal(
                    buildCompanionPayload("companion_option_clicked", visibleSeed, {
                      testId,
                      source,
                      resultId,
                      pagePath,
                      mode,
                      variant,
                    }, {
                      companionOptionId: option.id,
                    }),
                  );
                }}
                className={`rounded-[0.95rem] border px-3.5 py-3 text-left text-[13px] font-semibold transition ${
                  selectedOptionId === option.id
                    ? "border-[#173B35] bg-[#F3FAF6] text-[#173B35]"
                    : "border-[rgba(23,59,53,0.08)] bg-white text-[#315F50] hover:-translate-y-0.5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedOption ? <p className="text-[12px] leading-6 text-[#6F625C]">{selectedOption.reply}</p> : null}
        </div>
      ) : null}

      {variant === "return" && visibleSeed.subscriptionProbe?.show ? (
        <div className="space-y-3 rounded-[1.1rem] border border-[rgba(23,59,53,0.08)] bg-[#FFF9F2] p-4">
          <div className="space-y-1.5">
            <p className="text-[13px] font-semibold leading-6 text-[#2F2A28]">{visibleSeed.subscriptionProbe.question}</p>
            <p className="text-[12px] leading-6 text-[#6F625C]">
              これは支払いではなく、今後の関心を確かめるための小さな確認です。
            </p>
          </div>
          <div className="grid gap-2">
            {visibleSeed.subscriptionProbe.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => {
                  setSelectedSubscription(choice.id);
                  void trackRecommendationSignal(
                    buildCompanionPayload(choice.signalType, visibleSeed, {
                      testId,
                      source,
                      resultId,
                      pagePath,
                      mode,
                      variant,
                    }, {
                      companionIntentType: choice.id,
                    }),
                  );
                }}
                className={`rounded-[0.95rem] border px-3.5 py-3 text-left text-[13px] font-semibold transition ${
                  selectedSubscription === choice.id
                    ? "border-[#173B35] bg-[#F3FAF6] text-[#173B35]"
                    : "border-[rgba(23,59,53,0.08)] bg-white text-[#315F50] hover:-translate-y-0.5"
                }`}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] leading-5 text-[#7A7068]">
            {PROBE_VALUE_LABELS.map((label) => (
              <span key={label} className="rounded-full border border-[rgba(23,59,53,0.08)] bg-white px-2.5 py-1">
                {label}
              </span>
            ))}
          </div>
          {selectedSubscriptionChoice ? (
            <p className="text-[12px] leading-6 text-[#6F625C]">
              {selectedSubscriptionChoice.id === "free_only_for_now"
                ? "今は無料の入口を優先する、という受け止め方で記録します。"
                : "今後の相棒まわりの検討材料として、関心だけを記録します。"}
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="text-[12px] leading-6 text-[#7A7068]">{visibleSeed.riskBoundaryNote}</p>
    </section>
  );
}
