"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MvpActionLink } from "../components/MvpSurface";
import OpenTestingNotice from "../components/OpenTestingNotice";
import { trackOpenTestingEvent } from "../components/OpenTestingTracker";
import StateFieldCanvasLazy from "../components/state-field/StateFieldCanvasLazy";
import { intentionParams } from "../components/state-field/seed";
import { buildAbsolutePublicResultUrl, buildPublicResultHref } from "./resultCompatibility";
import { LINE_MINI_APP_NAV_VERSION } from "@/lib/server/miniAppEntryRouting";
import {
  buildCurrentStateResultPayload,
  currentStateQuestions,
  getCurrentStateMilestone,
  saveCurrentStateResult,
  scoreCurrentStateCheck,
  type CurrentStateQuestion,
  type CurrentStateAnswerMap,
} from "./currentStateCheckV1";

type Phase = "intro" | "quiz";
const AUTO_ADVANCE_DELAY_MS = 320;
const RESULT_NAVIGATION_FALLBACK_DELAY_MS = 320;

type PreparedResultNavigationTarget = {
  absoluteHref: string;
  relativeHref: string;
  loadingHref: string;
  payload: ReturnType<typeof buildCurrentStateResultPayload>;
};

function getIntroFacts(totalQuestions: number) {
  return `${totalQuestions}問 · 無料 · ログインなし`;
}

export default function MiniTestFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CurrentStateAnswerMap>({});
  const [navigationFallbackHref, setNavigationFallbackHref] = useState<string | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const navigationFallbackTimerRef = useRef<number | null>(null);
  const resultNavigationStartedRef = useRef(false);

  const totalQuestions = currentStateQuestions.length;
  const currentQuestion = currentStateQuestions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? "" : "";
  const stepLabel = `${Math.min(currentIndex + 1, totalQuestions)} / ${totalQuestions}`;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const milestone = getCurrentStateMilestone(currentIndex);
  const remainingQuestions = Math.max(totalQuestions - currentIndex - 1, 0);
  const isFinalQuestion = currentIndex === totalQuestions - 1;
  const isMiniAppEntry =
    searchParams.get("entry_source") === "line-mini-app" ||
    searchParams.get("entry_source") === "mini_app" ||
    searchParams.get("source") === "line" ||
    searchParams.get("source") === "mini_app" ||
    searchParams.get("nav") === "hard";
  const lineMiniAppFinalResultHref = useMemo(() => {
    if (!(phase === "quiz" && isMiniAppEntry && isFinalQuestion && currentAnswer)) {
      return null;
    }

    const scoring = scoreCurrentStateCheck(answers);
    return buildAbsolutePublicResultUrl("/result", {
      resultId: scoring.resultId,
      overlayId: scoring.overlayId,
      confidenceBand: scoring.confidenceBand,
    });
  }, [answers, currentAnswer, isFinalQuestion, isMiniAppEntry, phase]);
  const lineMiniAppReleaseMarker = `line handoff v${LINE_MINI_APP_NAV_VERSION}`;

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  function clearAutoAdvanceTimer() {
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }

  function clearNavigationFallbackTimer() {
    if (navigationFallbackTimerRef.current) {
      window.clearTimeout(navigationFallbackTimerRef.current);
      navigationFallbackTimerRef.current = null;
    }
  }

  function buildPreparedResultTarget(nextAnswers: CurrentStateAnswerMap): PreparedResultNavigationTarget {
    const scoring = scoreCurrentStateCheck(nextAnswers);
    const payload = buildCurrentStateResultPayload(scoring, nextAnswers);
    const publicRouteContext = {
      resultId: scoring.resultId,
      overlayId: scoring.overlayId,
      confidenceBand: scoring.confidenceBand,
    } as const;
    const loadingRouteContext = {
      resultId: scoring.resultId,
      overlayId: scoring.overlayId,
      payloadKey: scoring.payloadKey,
      confidenceBand: scoring.confidenceBand,
    } as const;

    return {
      absoluteHref: buildAbsolutePublicResultUrl("/result", publicRouteContext),
      relativeHref: buildPublicResultHref("/result", publicRouteContext),
      loadingHref: buildPublicResultHref("/report-loading", loadingRouteContext),
      payload,
    };
  }

  function routeToResult(nextAnswers: CurrentStateAnswerMap, preparedTarget?: PreparedResultNavigationTarget) {
    if (resultNavigationStartedRef.current) {
      return;
    }

    resultNavigationStartedRef.current = true;
    const target = preparedTarget ?? buildPreparedResultTarget(nextAnswers);
    saveCurrentStateResult(target.payload);
    void trackOpenTestingEvent({
      eventName: "test_completed",
      route: "/check-in",
      source: "mini_test_flow",
      entrySource: isMiniAppEntry ? "line-mini-app" : "open-testing",
      resultId: target.payload.resultId,
      overlayId: target.payload.overlayId,
      confidence: target.payload.confidenceBand,
      testVersion: "120q-current-state-v1",
    });
    void trackOpenTestingEvent({
      eventName: "result_generated",
      route: "/check-in",
      source: "mini_test_flow",
      entrySource: isMiniAppEntry ? "line-mini-app" : "open-testing",
      resultId: target.payload.resultId,
      overlayId: target.payload.overlayId,
      confidence: target.payload.confidenceBand,
      testVersion: "120q-current-state-v1",
    });

    setNavigationFallbackHref(null);
    clearNavigationFallbackTimer();

    if (typeof window !== "undefined" && isMiniAppEntry) {
      window.location.assign(target.absoluteHref);
      return;
    }

    router.push(target.loadingHref);

    if (typeof window !== "undefined") {
      navigationFallbackTimerRef.current = window.setTimeout(() => {
        navigationFallbackTimerRef.current = null;
        const { pathname } = window.location;
        if (pathname !== "/report-loading" && pathname !== "/result") {
          setNavigationFallbackHref(target.absoluteHref);
          window.location.assign(target.absoluteHref);
        }
      }, RESULT_NAVIGATION_FALLBACK_DELAY_MS);
    }
  }

  function advanceAfterSelection(nextAnswers: CurrentStateAnswerMap) {
    clearAutoAdvanceTimer();
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      autoAdvanceTimerRef.current = null;

      if (currentIndex === totalQuestions - 1) {
        routeToResult(nextAnswers);
        return;
      }

      setCurrentIndex((value) => Math.min(value + 1, totalQuestions - 1));
    }, AUTO_ADVANCE_DELAY_MS);
  }

  function begin() {
    clearAutoAdvanceTimer();
    clearNavigationFallbackTimer();
    resultNavigationStartedRef.current = false;
    setNavigationFallbackHref(null);
    setPhase("quiz");
    setCurrentIndex(0);
    setAnswers({});
    void trackOpenTestingEvent({
      eventName: "test_started",
      route: "/check-in",
      source: "mini_test_flow",
      entrySource: isMiniAppEntry ? "line-mini-app" : "open-testing",
      testVersion: "120q-current-state-v1",
    });
  }

  function selectOption(optionId: CurrentStateQuestion["options"][number]["id"]) {
    if (!currentQuestion) {
      return;
    }

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };

    setAnswers(nextAnswers);
    void trackOpenTestingEvent({
      eventName: "question_answered",
      route: "/check-in",
      source: "mini_test_flow",
      entrySource: isMiniAppEntry ? "line-mini-app" : "open-testing",
      testVersion: "120q-current-state-v1",
      metadata: {
        questionId: currentQuestion.id,
        currentIndex,
      },
    });

    if (isMiniAppEntry && isFinalQuestion) {
      clearAutoAdvanceTimer();
      return;
    }

    advanceAfterSelection(nextAnswers);
  }

  function goBack() {
    clearAutoAdvanceTimer();
    if (currentIndex === 0) {
      setPhase("intro");
      return;
    }

    setCurrentIndex((value) => value - 1);
  }

  function goNext() {
    if (!currentQuestion || !currentAnswer) {
      return;
    }

    if (isFinalQuestion) {
      routeToResult(answers);
      return;
    }

    clearAutoAdvanceTimer();
    setCurrentIndex((value) => value + 1);
  }

  // AIX-1 — the field quietly forms as the visitor answers (state formation).
  // Purely presentational: derived from progress only, never required to
  // answer, and absent under reduced motion (static ivory stays).
  const fieldParams = useMemo(() => intentionParams("current-state", 36), []);
  const fieldFormation =
    phase === "intro" ? 0.3 : 0.3 + (Math.min(currentIndex + 1, totalQuestions) / totalQuestions) * 0.7;

  return (
    <main className="relative min-h-screen bg-[#FBFAF6] text-[#22201D]">
      <div className="state-field-scene !fixed" aria-hidden="true">
        <StateFieldCanvasLazy params={fieldParams} formation={fieldFormation} className="state-field-layer" />
        <div className="state-field-veil" />
      </div>
      {/* Minimal top bar — orientation anchor in shell-suppressed context */}
      <div className="sticky top-0 z-30 border-b border-[rgba(23,59,53,0.06)] bg-[rgba(251,250,246,0.96)] backdrop-blur-sm">
        <div className="container flex items-center justify-between py-3">
          <span className="display-serif text-[1.1rem] font-semibold tracking-[0.09em] text-[#22201D]">YORISOU</span>
          {phase === "quiz" ? (
            <span className="rounded-full bg-[rgba(23,59,53,0.08)] px-3 py-1 text-[12px] font-semibold text-[#315F50]">
              {stepLabel}
            </span>
          ) : (
            <span className="rounded-full bg-[rgba(23,59,53,0.08)] px-3 py-1 text-[11px] font-semibold text-[#315F50]">いま色テスト</span>
          )}
        </div>
      </div>
      <section className="relative z-[1] border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-5 md:py-8">
          <div className="mx-auto max-w-[40rem]">
            {phase === "intro" ? (
              <div className="grid gap-5">
                <div className="space-y-3">
                  <p className="service-kicker" style={{ color: "#4D7A69" }}>いま色テスト by よりそう</p>
                  <h1 className="display-serif max-w-[12em] text-[2rem] leading-[1.2] text-[#22201D] md:text-[2.6rem]">
                    今のあなたの“いま色”を見てみる
                  </h1>
                  <p className="text-[11px] tracking-[0.06em] text-[#9A9088]">{getIntroFacts(totalQuestions)}</p>
                  <p className="max-w-[35rem] text-[14px] leading-7 text-[#6F6760]">
                    結果は固定タイプではなく、120Qから見た今の動き方です。
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={begin}
                    className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full px-5 py-3 text-[16px] transition hover:opacity-95 active:scale-[0.975]"
                    style={{ background: "#173B35", color: "#fff", fontWeight: 800, boxShadow: "0 14px 30px rgba(23,59,53,0.28)" }}
                  >
                    いま色テストをはじめる
                  </button>
                  <p className="mt-2.5 text-[11px] leading-6 text-[#9A9088]">
                    診断ではありません · <MvpActionLink href="/privacy" label="プライバシー" tone="ghost" />
                  </p>
                </div>

                <div className="space-y-2.5 border-l border-[rgba(105,151,130,0.4)] pl-4">
                  <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">このあと受け取れるもの</p>
                  <div className="grid gap-1.5 text-[13px] leading-6 text-[#6F6760]">
                    <p>24の結果から今の動き方を表示します。</p>
                    <p>公開テスト中の詳しいレポートまで続けて読めます。</p>
                    <p>レポートはこの端末に保存できます。</p>
                    <p>感想や不具合はあとで送れます。</p>
                  </div>
                </div>

                {/* Transition cue — lightweight signal strip */}
                <div
                  className="rounded-[1rem] px-4 py-3"
                  style={{ background: "rgba(23,59,53,0.04)", border: "1px solid rgba(23,59,53,0.07)" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="signal-orb" aria-hidden="true" />
                    <p className="text-[12px] leading-6 text-[#6F6760]">
                      今の動き方を、24の色と名前で見ていきます。
                    </p>
                  </div>
                </div>

                <OpenTestingNotice
                  body="現在は最初の公開テスト中です。結果やレポートの見え方、わかりにくかった点、不具合があれば、あとでそのまま感想として送っていただけます。"
                  primaryHref="/contact?topic=open-testing"
                  primaryLabel="先に公開テストの連絡先を見る"
                />
              </div>
            ) : null}

            {phase === "quiz" && currentQuestion ? (
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px] text-[#9A9088]">
                    <span>{stepLabel}</span>
                    <span>残り{remainingQuestions}問</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[rgba(23,59,53,0.1)]">
                    <div
                      className="h-full rounded-full bg-[#173B35] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {milestone ? (
                    <div className="mt-2 rounded-[0.9rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.58)] px-3.5 py-2 text-[13px] leading-7 text-[var(--accent-sage-text)]">
                      {milestone}
                    </div>
                  ) : null}
                </div>

                <div key={currentQuestion.id} className="aix-question-enter aix-quiz-surface space-y-4 p-4 md:p-6">
                  <div className="space-y-3">
                    <p className="service-kicker" style={{ color: "#4D7A69" }}>今の感覚に近いものをひとつ選んでください</p>
                    <h2 className="display-serif text-[1.52rem] leading-[1.32] text-[#22201D] md:text-[2.4rem]">
                      {currentQuestion.prompt}
                    </h2>
                    <p className="text-[13px] font-medium leading-7 text-[var(--muted)]">
                      ひとつ選ぶと、少し間を置いて次へ進みます。
                    </p>
                  </div>

                  <div className="grid gap-2.5">
                    {currentQuestion.options.map((option) => {
                      const selected = currentAnswer === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => selectOption(option.id)}
                          className={`answer-btn w-full rounded-[1.05rem] border px-4 py-3.5 text-left ${
                            selected
                              ? "border-[#173B35] bg-[#F4FAF7] shadow-[0_12px_24px_rgba(23,59,53,0.12)]"
                              : "border-[rgba(111,98,92,0.14)] bg-white/90 hover:-translate-y-0.5 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[15px] font-semibold leading-7 text-[#22201D]">{option.label}</span>
                            {selected && (
                              <span
                                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                                style={{ background: "#173B35", color: "#fff" }}
                              >
                                ✓
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sticky bottom-0 z-20 -mx-4 border-t border-[rgba(23,59,53,0.07)] bg-[rgba(251,250,246,0.97)] px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}>
                  {navigationFallbackHref ? (
                    <div className="mb-3 rounded-[1rem] border border-[rgba(23,59,53,0.12)] bg-white px-4 py-3 shadow-[0_14px_28px_rgba(23,59,53,0.08)]">
                      <p className="text-[13px] leading-6 text-[#6F6760]">
                        結果の表示に少し時間がかかっています。進まない場合は、下のボタンから結果を開いてください。
                      </p>
                      <a
                        href={navigationFallbackHref}
                        className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#173B35] px-4 py-3 text-[15px] font-extrabold text-white"
                      >
                        結果ページを開く
                      </a>
                    </div>
                  ) : null}
                  <div className="flex gap-2.5 sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex min-h-[50px] w-[34%] items-center justify-center rounded-full border px-4 py-3 text-[14px] font-semibold transition hover:opacity-95 sm:w-auto"
                      style={{ borderColor: "rgba(23,59,53,0.16)", background: "rgba(23,59,53,0.05)", color: "#4D7A69" }}
                    >
                      戻る
                    </button>
                    {isMiniAppEntry && isFinalQuestion && lineMiniAppFinalResultHref ? (
                      <div className="flex-1 space-y-2">
                        <a
                          href={lineMiniAppFinalResultHref}
                          onClick={() => saveCurrentStateResult(buildPreparedResultTarget(answers).payload)}
                          className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-4 py-3 text-[16px] font-extrabold text-white transition hover:opacity-95"
                          style={{ background: "#173B35", boxShadow: "0 14px 28px rgba(23,59,53,0.26)" }}
                        >
                          結果へ進む
                        </a>
                        <div className="rounded-[0.95rem] border border-[rgba(23,59,53,0.08)] bg-white/92 px-4 py-3">
                          <p className="text-[12px] leading-6 text-[#6F6760]">
                            進まない場合は、下のリンクから結果ページを開いてください。
                          </p>
                          <a
                            href={lineMiniAppFinalResultHref}
                            onClick={() => saveCurrentStateResult(buildPreparedResultTarget(answers).payload)}
                            className="mt-2 inline-flex min-h-[44px] items-center justify-center text-[13px] font-semibold text-[#315F50] underline underline-offset-4"
                          >
                            結果ページを開く
                          </a>
                          <p className="mt-2 text-[10px] leading-5 text-[#9A9088]">
                            {lineMiniAppReleaseMarker}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!currentAnswer}
                        className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-full px-4 py-3 text-[16px] transition hover:opacity-95 disabled:cursor-not-allowed disabled:shadow-none"
                        style={currentAnswer ? { background: "#173B35", color: "#fff", fontWeight: 800, boxShadow: "0 14px 28px rgba(23,59,53,0.26)" } : { background: "rgba(34,32,29,0.18)", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}
                      >
                        {isFinalQuestion ? "結果へ進む" : "すぐ次へ"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
