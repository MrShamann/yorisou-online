"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";

import { trackOpenTestingEvent } from "../components/OpenTestingTracker";
import DepthFieldLazy from "../components/depth-field/DepthFieldLazy";
import DepthFieldStatic from "../components/depth-field/DepthFieldStatic";
import { intentionDepthParams, intentionPalette } from "../components/depth-field/seed";
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
import {
  answeredCount,
  clearCheckProgress,
  readCheckProgress,
  relativeUpdatedLabel,
  writeCheckProgress,
  type CheckProgress,
} from "@/lib/sr2/checkProgress";

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
  // SR-2 — device-local 120Q progress resume. Raw answers persist only in the
  // separately-versioned checkProgress record (never the guest journey / URL /
  // analytics / share). A stale question-bank signature or corrupt data auto-
  // discards (see readCheckProgress).
  const [resumeCandidate, setResumeCandidate] = useState<CheckProgress | null>(null);
  const [resumeUpdatedLabel, setResumeUpdatedLabel] = useState("");

  const totalQuestions = currentStateQuestions.length;
  const bankSignature = `120q:v1:${totalQuestions}`;

  function persistProgress(nextIndex: number, nextAnswers: CurrentStateAnswerMap) {
    if (Object.keys(nextAnswers).length === 0) return;
    writeCheckProgress({
      bankSignature,
      currentIndex: nextIndex,
      answers: nextAnswers as Record<string, string>,
    });
  }
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

  useEffect(() => {
    // Read any saved in-progress 120Q once after mount (kept out of first paint
    // so there is no hydration mismatch); offer to resume from the intro.
    const saved = readCheckProgress(bankSignature);
    if (saved && Object.keys(saved.answers).length > 0) {
      /* eslint-disable react-hooks/set-state-in-effect -- intentional: read the
         device-local progress ONCE after mount so the resume prompt is absent
         from the SSR/first-paint HTML (no hydration mismatch), then surface it. */
      setResumeCandidate(saved);
      setResumeUpdatedLabel(relativeUpdatedLabel(saved.updatedAt, Date.now()));
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [bankSignature]);

  function resumeFromCandidate() {
    if (!resumeCandidate) return;
    resultNavigationStartedRef.current = false;
    setAnswers(resumeCandidate.answers as CurrentStateAnswerMap);
    setCurrentIndex(Math.max(0, Math.min(resumeCandidate.currentIndex, totalQuestions - 1)));
    setResumeCandidate(null);
    setPhase("quiz");
  }

  function discardAndRestart() {
    clearCheckProgress();
    setResumeCandidate(null);
    begin();
  }

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
    // SR-2 — completed: the in-progress record is no longer needed (never submit
    // incomplete as complete; never leave a stale resume after a real result).
    clearCheckProgress();
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
    clearCheckProgress();
    setResumeCandidate(null);
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
    // SR-2 — persist progress after each answer (device-local, versioned record).
    persistProgress(Math.min(currentIndex + 1, totalQuestions - 1), nextAnswers);
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

    const prev = currentIndex - 1;
    setCurrentIndex(prev);
    persistProgress(prev, answers);
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
    const next = currentIndex + 1;
    setCurrentIndex(next);
    persistProgress(next, answers);
  }

  // AIX-2 — the depth field quietly forms as the visitor answers (state
  // formation). Purely presentational: derived from progress only, never
  // required to answer, absent under reduced motion (static frame stays).
  const fieldParams = useMemo(() => intentionDepthParams("current-state", 150), []);
  const fieldPalette = intentionPalette();
  const fieldFormation =
    phase === "intro" ? 0.3 : 0.3 + (Math.min(currentIndex + 1, totalQuestions) / totalQuestions) * 0.7;

  return (
    <main className="aix2 relative min-h-screen">
      <div className="depth-scene !fixed" aria-hidden="true">
        {/* static frame first (SSR/no-JS/reduced-motion/WebGL-unavailable);
            fades out via data-canvas-active once the canvas takes over. */}
        <DepthFieldStatic params={fieldParams} palette={fieldPalette} formation={0.3} className="depth-layer" />
        <DepthFieldLazy params={fieldParams} palette={fieldPalette} formation={fieldFormation} className="depth-layer" />
        <div className="depth-veil" />
      </div>
      {/* Minimal top bar — orientation anchor in shell-suppressed context */}
      <div className="aix2-shell-header sticky top-0 z-30">
        <div className="container flex items-center justify-between py-3">
          <span className="aix2-serif text-[1.15rem] font-semibold tracking-[0.1em] text-[color:var(--tx)]">YORISOU</span>
          <span className="rounded-full bg-[rgba(126,224,182,0.1)] px-3 py-1 text-[12px] font-semibold text-[color:var(--jade-bright)]">
            {phase === "quiz" ? stepLabel : "いま色テスト"}
          </span>
        </div>
      </div>
      <section className="relative z-[1] border-b border-[var(--hair)]">
        <div className="container py-6 md:py-10">
          <div className="mx-auto max-w-[40rem]">
            {phase === "intro" ? (
              <div className="grid gap-6">
                <div className="space-y-3">
                  <p className="aix2-eyebrow">いま色テスト by よりそう</p>
                  <h1 className="aix2-serif max-w-[12em] text-[2.1rem] font-semibold leading-[1.2] text-[color:var(--tx)] md:text-[2.9rem]">
                    今のあなたの“いま色”を視る
                  </h1>
                  <p className="text-[11px] tracking-[0.06em] aix2-faint">{getIntroFacts(totalQuestions)}</p>
                  <p className="max-w-[35rem] text-[14px] leading-7 aix2-mut">
                    結果は固定タイプではなく、120Qから見た今の動き方です。
                  </p>
                </div>

                {resumeCandidate ? (
                  <div className="aix2-panel p-4 sm:p-5" data-sr2-resume="true">
                    <p className="aix2-eyebrow">前回の続き</p>
                    <p className="mt-2 text-[14px] leading-7 aix2-mut">
                      前回の回答がこの端末に残っています（{answeredCount(resumeCandidate)} / {totalQuestions}問
                      {resumeUpdatedLabel ? ` · ${resumeUpdatedLabel}` : ""}
                      ）。続きから、または最初からやり直せます。
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={resumeFromCandidate}
                        className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]"
                      >
                        続きから
                      </button>
                      <button
                        type="button"
                        onClick={discardAndRestart}
                        className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[14px]"
                      >
                        最初から
                      </button>
                    </div>
                  </div>
                ) : null}

                <div>
                  <button type="button" onClick={begin} className="aix2-btn aix2-btn-primary w-full">
                    {resumeCandidate ? "最初から始める" : "いま色テストをはじめる"}
                  </button>
                  <p className="mt-2.5 text-[11px] leading-6 aix2-faint">
                    診断ではありません · <Link href="/privacy" className="aix2-link">プライバシー</Link>
                  </p>
                </div>

                <div className="space-y-2.5 border-l-2 border-[var(--hair-2)] pl-4">
                  <p className="text-[11px] font-semibold tracking-[0.13em] text-[color:var(--jade-bright)]">このあと受け取れるもの</p>
                  <div className="grid gap-1.5 text-[13px] leading-6 aix2-mut">
                    <p>24の結果から今の動き方を表示します。</p>
                    <p>公開テスト中の詳しいレポートまで続けて読めます。</p>
                    <p>レポートはこの端末に保存できます。</p>
                    <p>感想や不具合はあとで送れます。</p>
                  </div>
                </div>

                <div className="aix2-panel px-4 py-3">
                  <p className="text-[12px] leading-6 aix2-mut">
                    現在は最初の公開テスト中です。わかりにくかった点や不具合は、
                    <Link href="/contact?topic=open-testing" className="aix2-link">あとで感想として送れます</Link>。
                  </p>
                </div>
              </div>
            ) : null}

            {phase === "quiz" && currentQuestion ? (
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px] aix2-faint">
                    <span>{stepLabel}</span>
                    <span>残り{remainingQuestions}問</span>
                  </div>
                  <div className="aix2-progress-track">
                    <div className="aix2-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  {milestone ? (
                    <div className="mt-2 rounded-[0.9rem] border border-[var(--hair-2)] bg-[rgba(47,197,150,0.08)] px-3.5 py-2 text-[13px] leading-7 text-[color:var(--jade-bright)]">
                      {milestone}
                    </div>
                  ) : null}
                </div>

                <div key={currentQuestion.id} className="aix-question-enter aix2-quiz space-y-4 p-4 md:p-6">
                  <div className="space-y-3">
                    <p className="aix2-eyebrow">今の感覚に近いものをひとつ選んでください</p>
                    <h2 className="aix2-serif text-[1.55rem] font-semibold leading-[1.34] text-[color:var(--tx)] md:text-[2.3rem]">
                      {currentQuestion.prompt}
                    </h2>
                    <p className="text-[13px] font-medium leading-7 aix2-mut">
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
                          className="aix2-answer"
                          data-selected={selected}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[15px] font-semibold leading-7 text-[color:var(--tx)]">{option.label}</span>
                            {selected && (
                              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--jade)] text-[10px] font-bold text-[color:var(--jade-ink)]">
                                ✓
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sticky bottom-0 z-20 -mx-4 border-t border-[var(--hair)] bg-[rgba(9,11,10,0.94)] px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}>
                  {navigationFallbackHref ? (
                    <div className="mb-3 aix2-panel px-4 py-3">
                      <p className="text-[13px] leading-6 aix2-mut">
                        結果の表示に少し時間がかかっています。進まない場合は、下のボタンから結果を開いてください。
                      </p>
                      <a href={navigationFallbackHref} className="aix2-btn aix2-btn-primary mt-3 w-full">
                        結果ページを開く
                      </a>
                    </div>
                  ) : null}
                  <div className="flex gap-2.5 sm:justify-between">
                    <button type="button" onClick={goBack} className="aix2-btn aix2-btn-ghost !min-h-[50px] w-[34%] !px-4 !text-[14px] sm:w-auto">
                      戻る
                    </button>
                    {isMiniAppEntry && isFinalQuestion && lineMiniAppFinalResultHref ? (
                      <div className="flex-1 space-y-2">
                        <a
                          href={lineMiniAppFinalResultHref}
                          onClick={() => saveCurrentStateResult(buildPreparedResultTarget(answers).payload)}
                          className="aix2-btn aix2-btn-primary w-full"
                        >
                          結果へ進む
                        </a>
                        <div className="aix2-panel px-4 py-3">
                          <p className="text-[12px] leading-6 aix2-mut">
                            進まない場合は、下のリンクから結果ページを開いてください。
                          </p>
                          <a
                            href={lineMiniAppFinalResultHref}
                            onClick={() => saveCurrentStateResult(buildPreparedResultTarget(answers).payload)}
                            className="mt-2 inline-flex min-h-[44px] items-center text-[13px] font-semibold text-[color:var(--jade-bright)] underline underline-offset-4"
                          >
                            結果ページを開く
                          </a>
                          <p className="mt-2 text-[10px] leading-5 aix2-faint">{lineMiniAppReleaseMarker}</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!currentAnswer}
                        className="aix2-btn aix2-btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
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
