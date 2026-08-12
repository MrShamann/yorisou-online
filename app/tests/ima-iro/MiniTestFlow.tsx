"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAssessmentAttempt } from "./useAssessmentAttempt";

import { MvpCard } from "../../components/MvpSurface";
import OpenTestingNotice from "../../components/OpenTestingNotice";
import { trackOpenTestingEvent } from "../../components/OpenTestingTracker";
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
  payload: ReturnType<typeof buildCurrentStateResultPayload>;
};

function getIntroFacts(totalQuestions: number) {
  return `${totalQuestions}問 · 無料 · ログインなし`;
}

export default function MiniTestFlow() {
  // UX-2: server-authoritative attempt persistence (resume across refresh; real persisted result).
  const attempt = useAssessmentAttempt();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CurrentStateAnswerMap>({});
  const [navigationFallbackHref, setNavigationFallbackHref] = useState<string | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const navigationFallbackTimerRef = useRef<number | null>(null);
  const resultNavigationStartedRef = useRef(false);
  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [restartConfirming, setRestartConfirming] = useState(false);
  const [restartError, setRestartError] = useState<string | null>(null);
  const [restarting, setRestarting] = useState(false);

  // UX-2: a persisted in-progress attempt is offered EXPLICITLY rather than silently restored —
  // the user is never teleported into the middle of a quiz they did not just ask to resume.
  const resumableAttempt =
    attempt.restored && attempt.restored.answeredCount > 0 ? attempt.restored : null;

  function resumeSavedAttempt() {
    if (!resumableAttempt) return;
    clearAutoAdvanceTimer();
    clearNavigationFallbackTimer();
    resultNavigationStartedRef.current = false;
    setNavigationFallbackHref(null);
    attempt.adoptRestoredAttempt(resumableAttempt);
    setAnswers(resumableAttempt.answers as CurrentStateAnswerMap);
    setCurrentIndex(Math.min(resumableAttempt.answeredCount, currentStateQuestions.length - 1));
    setPhase("quiz");
  }

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
  // UX-2: the client-side LINE result-URL builder was REMOVED. A client-constructed result
  // URL is exactly the unpersisted bypass this package eliminates — every completion path
  // now goes through the awaited server completion and navigates by persisted identity.
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
    return { payload };
  }

  function routeToResult(nextAnswers: CurrentStateAnswerMap, preparedTarget?: PreparedResultNavigationTarget) {
    if (resultNavigationStartedRef.current) {
      return;
    }

    resultNavigationStartedRef.current = true;
    const target = preparedTarget ?? buildPreparedResultTarget(nextAnswers);
    // NOTE: the legacy local store is written ONLY after the server persists (see below). Writing
    // it here would leave a convincing "saved" artefact behind a failed completion.
    // UX-2: completion is AWAITED and authoritative. We navigate only after the server has
    // persisted an immutable result, carrying that stable identity. On failure we stay put with
    // every answer intact, emit no success analytics, and offer retry.
    setCompletionError(null);
    setCompleting(true);
    void attempt.completeAttempt(nextAnswers as Record<string, string>).then((outcome) => {
      setCompleting(false);
      if (!outcome.ok) {
        resultNavigationStartedRef.current = false;
        setCompletionError(outcome.error);
        return;
      }
      // Compatibility cache only — the server record is the source of truth. Written after
      // success so a failed completion can never leave a false local "saved result".
      saveCurrentStateResult(target.payload);
      finishNavigation(target, outcome.resultRowId);
    });
  }

  // Navigation carries the PERSISTED result identity so /result can resolve the real record.
  // No raw answers ever enter the URL.
  function finishNavigation(target: PreparedResultNavigationTarget, resultRowId: string) {
    // Completion always has a persisted identity, and the canonical link travels ALONE — legacy
    // parameters riding along would let /result be addressed two ways at once and leak scoring
    // context into history/referrers. The legacy payload already went to the compatibility cache.
    const canonical = (pathname: string) =>
      `${pathname}?result=${encodeURIComponent(resultRowId)}`;
    void trackOpenTestingEvent({
      eventName: "test_completed",
      route: "/tests/ima-iro",
      source: "mini_test_flow",
      entrySource: isMiniAppEntry ? "line-mini-app" : "open-testing",
      resultId: target.payload.resultId,
      overlayId: target.payload.overlayId,
      confidence: target.payload.confidenceBand,
      testVersion: "120q-current-state-v1",
    });
    void trackOpenTestingEvent({
      eventName: "result_generated",
      route: "/tests/ima-iro",
      source: "mini_test_flow",
      entrySource: isMiniAppEntry ? "line-mini-app" : "open-testing",
      resultId: target.payload.resultId,
      overlayId: target.payload.overlayId,
      confidence: target.payload.confidenceBand,
      testVersion: "120q-current-state-v1",
    });

    setNavigationFallbackHref(null);
    clearNavigationFallbackTimer();

    // Same-origin RELATIVE navigation, always. The absolute production-origin URL sent a person
    // who completed on a Preview deployment to yorisou.online — a different environment — with
    // their canonical private row id in the query string. The person is already on the correct
    // origin; a relative href keeps them there in every environment, including the LINE webview.
    if (typeof window !== "undefined" && isMiniAppEntry) {
      window.location.assign(canonical("/result"));
      return;
    }

    router.push(canonical("/report-loading"));

    if (typeof window !== "undefined") {
      navigationFallbackTimerRef.current = window.setTimeout(() => {
        navigationFallbackTimerRef.current = null;
        const { pathname } = window.location;
        if (pathname !== "/report-loading" && pathname !== "/result") {
          setNavigationFallbackHref(canonical("/result"));
          window.location.assign(canonical("/result"));
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

  // Entry point for the primary CTA. When saved answers exist, restarting is a destructive act,
  // so it must be confirmed and the old attempt explicitly abandoned before a new one is created.
  async function beginOrConfirmRestart() {
    if (resumableAttempt && !restartConfirming) {
      setRestartConfirming(true);
      return;
    }
    await begin();
  }

  async function confirmRestart() {
    if (restarting || !resumableAttempt) return;
    setRestarting(true);
    setRestartError(null);
    const abandoned = await attempt.abandonAttempt(resumableAttempt.id);
    if (!abandoned) {
      // The previous attempt is preserved and NO new attempt is created.
      setRestarting(false);
      setRestartError("restart_failed");
      return;
    }
    setRestartConfirming(false);
    await begin();
    setRestarting(false);
  }

  async function begin() {
    clearAutoAdvanceTimer();
    clearNavigationFallbackTimer();
    resultNavigationStartedRef.current = false;
    setNavigationFallbackHref(null);
    setCurrentIndex(0);
    setAnswers({});
    setCompletionError(null);
    // UX-2: the attempt must EXIST before question 1 is answerable, otherwise the first progress
    // saves silently no-op. Creation is awaited; the quiz opens only on success.
    const createdId = await attempt.startAttempt(isMiniAppEntry ? "line-mini-app" : "open-testing");
    if (!createdId) return;
    setPhase("quiz");
    void trackOpenTestingEvent({
      eventName: "test_started",
      route: "/tests/ima-iro",
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
    // UX-2: persist progress server-side (debounced) so a refresh does not destroy the journey.
    attempt.saveProgress(nextAnswers as Record<string, string>);
    void trackOpenTestingEvent({
      eventName: "question_answered",
      route: "/tests/ima-iro",
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

  return (
    // PXR-1 — the 120Q keeps its own minimal chrome, because the product tab bar has no business
    // sitting under a running assessment. What it stops having is its own COLOUR SYSTEM: the page
    // frame, measure and type now match every other surface, so arriving here from 探す does not
    // feel like leaving Yorisou for a microsite that happens to share the logo.
    <main className="min-h-screen text-[var(--pxr-text-primary)]">
      {/* Minimal top bar — the orientation anchor in a shell-suppressed context. */}
      <div className="sticky top-0 z-30 border-b border-[var(--pxr-border-subtle)] bg-[var(--pxr-canvas)]">
        <div className="mx-auto flex w-full max-w-[var(--pxr-content-width)] items-center justify-between px-5 py-3">
          <span className="text-[15px] font-semibold tracking-[0.08em] text-[var(--pxr-text-primary)]">YORISOU</span>
          <span className="text-[13px] text-[var(--pxr-text-muted)]">
            {phase === "quiz" ? stepLabel : "いま色テスト"}
          </span>
        </div>
      </div>
      <section>
        <div className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 py-6 md:py-10">
          <div>
            {phase === "intro" ? (
              <div className="grid gap-5">
                <div className="grid gap-3">
                  <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                    いま色テスト by よりそう
                  </p>
                  <h1 className="display-serif max-w-[12em] text-[2rem] leading-[1.2] text-[var(--pxr-text-primary)] md:text-[2.6rem]">
                    今のあなたの“いま色”を見てみる
                  </h1>
                  <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">{getIntroFacts(totalQuestions)}</p>
                  <p className="text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                    結果は固定タイプではなく、120Qから見た今の動き方です。
                  </p>
                </div>

                {attempt.startState === "error" ? (
                  <MvpCard className="space-y-2 rounded-[1.2rem] border-[rgba(138,46,46,0.28)] bg-white p-4">
                    <p className="text-[13px] font-semibold text-[#8A2E2E]">はじめられませんでした</p>
                    <p className="text-[13px] leading-6 text-[#6F6760]">
                      通信が不安定なようです。もう一度「いま色テストをはじめる」を選んでください。
                    </p>
                  </MvpCard>
                ) : null}

                {completionError ? (
                  <MvpCard className="space-y-2 rounded-[1.2rem] border-[rgba(138,46,46,0.28)] bg-white p-4">
                    <p className="text-[13px] font-semibold text-[#8A2E2E]">結果を保存できませんでした</p>
                    <p className="text-[13px] leading-6 text-[#6F6760]">
                      {completionError === "attempt_expired"
                        ? "保存できる期間が過ぎました。お手数ですが、はじめからやり直してください。"
                        : "回答は残っています。通信状況を確かめて、もう一度お試しください。"}
                    </p>
                  </MvpCard>
                ) : null}

                {attempt.expired ? (
                  <MvpCard className="space-y-2 rounded-[1.2rem] border-[rgba(138,46,46,0.28)] bg-white p-4">
                    <p className="text-[13px] font-semibold text-[#8A2E2E]">保存期間が過ぎました</p>
                    <p className="text-[13px] leading-6 text-[#6F6760]">
                      途中の回答は保存できる期間を過ぎました。はじめからやり直してください。
                    </p>
                  </MvpCard>
                ) : null}

                {restartConfirming && resumableAttempt ? (
                  <MvpCard className="space-y-3 rounded-[1.2rem] border-[rgba(23,59,53,0.28)] bg-white p-4">
                    <p className="text-[13px] font-semibold text-[#22201D]">保存した回答を消して、はじめからやり直しますか？</p>
                    <p className="text-[13px] leading-6 text-[#6F6760]">
                      {resumableAttempt.answeredCount} / {totalQuestions} 問の回答は削除され、元に戻せません。
                    </p>
                    {restartError ? (
                      <p role="alert" className="text-[13px] leading-6 text-[#8A2E2E]">
                        やり直しの処理ができませんでした。前回の回答はそのまま残っています。もう一度お試しください。
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => { void confirmRestart(); }}
                        disabled={restarting}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-[14px] disabled:opacity-60"
                        style={{ background: "#173B35", color: "#fff", fontWeight: 700 }}
                      >
                        {restarting ? "処理しています…" : "削除してやり直す"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRestartConfirming(false); setRestartError(null); }}
                        disabled={restarting}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-full border px-5 text-[14px] disabled:opacity-60"
                        style={{ borderColor: "rgba(23,59,53,0.2)", color: "#315F50", fontWeight: 700 }}
                      >
                        やめる
                      </button>
                    </div>
                  </MvpCard>
                ) : null}

                {resumableAttempt ? (
                  <MvpCard className="space-y-3 rounded-[1.2rem] border-[rgba(23,59,53,0.16)] bg-white p-4">
                    <p className="text-[13px] font-semibold text-[#22201D]">前回の途中から続けられます</p>
                    <p className="text-[13px] leading-6 text-[#6F6760]">
                      {resumableAttempt.answeredCount} / {totalQuestions} 問まで保存されています。
                    </p>
                    <button
                      type="button"
                      onClick={resumeSavedAttempt}
                      className="inline-flex min-h-[var(--pxr-touch-target)] w-full items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 py-3 text-[15px] font-semibold text-white transition hover:opacity-95 active:scale-[0.975]"
                    >
                      続きからはじめる
                    </button>
                    <p className="text-[11px] leading-5 text-[#6F6760]">
                      はじめからやり直す場合は、下のボタンを選んでください。
                    </p>
                  </MvpCard>
                ) : null}

                <div>
                  <button
                    type="button"
                    onClick={() => { void beginOrConfirmRestart(); }}
                    disabled={attempt.startState === "starting" || completing || restarting}
                    className="inline-flex min-h-[54px] w-full items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 py-3 text-[16px] font-semibold text-white transition hover:opacity-95 active:scale-[0.975] disabled:opacity-60"
                  >
                    {attempt.startState === "starting" ? "準備しています…" : resumableAttempt ? "はじめからやり直す" : "いま色テストをはじめる"}
                  </button>
                  {/* The privacy link was a ghost MvpActionLink: bold, dark green, and visually
                      heavier than the reassurance it sits inside. */}
                  <p className="mt-3 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                    診断ではありません ·{" "}
                    <Link href="/privacy" className="font-medium text-[var(--pxr-accent)]">
                      プライバシー
                    </Link>
                  </p>
                </div>

                {/* Information, not a card. This was a shadowed white panel and, directly beneath it,
                    a second decorative strip whose entire content restated 「24の色と名前」 — a card
                    that existed to say again what the hero had just said. The strip is gone; the four
                    facts stay, because they are what someone weighing 120 questions needs to know. */}
                <div className="grid gap-2 border-t border-[var(--pxr-border-subtle)] pt-4">
                  <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                    このあと受け取れるもの
                  </p>
                  <div className="grid gap-1 text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                    <p>・24の結果から今の動き方を表示します。</p>
                    <p>・公開テスト中の詳しいレポートまで続けて読めます。</p>
                    <p>・レポートはこの端末に保存できます。</p>
                    <p>・感想や不具合はあとで送れます。</p>
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
                  <div className="flex items-center justify-between text-[12px] text-[#6F6760]">
                    <span>{stepLabel}</span>
                    <span>残り{remainingQuestions}問</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--pxr-surface-emphasis)]">
                    <div
                      className="h-full rounded-full bg-[var(--pxr-accent)] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {milestone ? (
                    <div className="mt-2 rounded-[0.9rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.58)] px-3.5 py-2 text-[13px] leading-7 text-[var(--accent-sage-text)]">
                      {milestone}
                    </div>
                  ) : null}
                </div>

                <MvpCard className="space-y-4 rounded-[1.3rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_22px_44px_rgba(23,59,53,0.09)] md:p-6">
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
                </MvpCard>

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
                    {isMiniAppEntry && isFinalQuestion ? (
                      <div className="flex-1 space-y-2">
                        {/* UX-2: the LINE Mini App no longer has its own client-authoritative
                            completion. It calls the SAME awaited server completion as the Web
                            path; the hard WebView navigation happens only after persistence. */}
                        <button
                          type="button"
                          onClick={() => routeToResult(answers)}
                          disabled={completing}
                          className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-4 py-3 text-[16px] font-extrabold text-white transition hover:opacity-95 disabled:opacity-70"
                          style={{ background: "#173B35", boxShadow: "0 14px 28px rgba(23,59,53,0.26)" }}
                        >
                          {completing ? "保存しています…" : "結果へ進む"}
                        </button>
                        <div className="rounded-[0.95rem] border border-[rgba(23,59,53,0.08)] bg-white/92 px-4 py-3">
                          <p className="text-[12px] leading-6 text-[#6F6760]">
                            {completionError
                              ? "結果を保存できませんでした。回答は残っています。もう一度お試しください。"
                              : "進まない場合は、もう一度「結果へ進む」を選んでください。"}
                          </p>
                          {navigationFallbackHref ? (
                            <a
                              href={navigationFallbackHref}
                              className="mt-2 inline-flex min-h-[44px] items-center justify-center text-[13px] font-semibold text-[#315F50] underline underline-offset-4"
                            >
                              結果ページを開く
                            </a>
                          ) : null}
                          <p className="mt-2 text-[10px] leading-5 text-[#6F6760]">
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
