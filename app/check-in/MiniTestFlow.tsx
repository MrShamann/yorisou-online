"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { MvpActionLink, MvpCard } from "../components/MvpSurface";
import {
  buildCurrentStateResultPayload,
  currentStateCheckV1,
  currentStateQuestions,
  getCurrentStateMilestone,
  saveCurrentStateResult,
  scoreCurrentStateCheck,
  type CurrentStateQuestion,
  type CurrentStateAnswerMap,
} from "./currentStateCheckV1";

type Phase = "intro" | "quiz";
const AUTO_ADVANCE_DELAY_MS = 320;

const INTRO_FACTS = "24問 · 3分ほど · 無料 · ログインなし" as const;

function getRemainingMinutes(currentIndex: number) {
  const answered = currentIndex + 1;
  const remainingRatio = Math.max(currentStateQuestions.length - answered, 0) / currentStateQuestions.length;
  return Math.max(1, Math.ceil(remainingRatio * currentStateCheckV1.estimatedMinutes));
}

export default function MiniTestFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CurrentStateAnswerMap>({});
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const resultNavigationStartedRef = useRef(false);

  const totalQuestions = currentStateQuestions.length;
  const currentQuestion = currentStateQuestions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? "" : "";
  const stepLabel = `${Math.min(currentIndex + 1, totalQuestions)} / ${totalQuestions}`;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const milestone = getCurrentStateMilestone(currentIndex);
  const remainingMinutes = getRemainingMinutes(currentIndex);

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

  function routeToResult(nextAnswers: CurrentStateAnswerMap) {
    if (resultNavigationStartedRef.current) {
      return;
    }

    resultNavigationStartedRef.current = true;
    const scoring = scoreCurrentStateCheck(nextAnswers);
    const payload = buildCurrentStateResultPayload(scoring, nextAnswers);
    saveCurrentStateResult(payload);

    const query = new URLSearchParams({
      resultId: scoring.resultId,
      overlayId: scoring.overlayId,
      confidence: scoring.confidenceBand,
      payloadKey: scoring.payloadKey,
    });

    router.push(`/report-loading?${query.toString()}`);
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
    resultNavigationStartedRef.current = false;
    setPhase("quiz");
    setCurrentIndex(0);
    setAnswers({});
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

    if (currentIndex === totalQuestions - 1) {
      routeToResult(answers);
      return;
    }

    clearAutoAdvanceTimer();
    setCurrentIndex((value) => value + 1);
  }

  return (
    <main className="min-h-screen bg-[#FBFAF6] text-[#22201D]">
      {/* Minimal top bar — orientation anchor in shell-suppressed context */}
      <div className="sticky top-0 z-30 border-b border-[rgba(23,59,53,0.06)] bg-[rgba(251,250,246,0.96)] backdrop-blur-sm">
        <div className="container flex items-center justify-between py-3">
          <span className="display-serif text-[1.1rem] font-semibold tracking-[0.09em] text-[#22201D]">YORISOU</span>
          {phase === "quiz" ? (
            <span className="rounded-full bg-[rgba(23,59,53,0.08)] px-3 py-1 text-[12px] font-semibold text-[#315F50]">
              {stepLabel}
            </span>
          ) : (
            <span className="rounded-full bg-[rgba(23,59,53,0.08)] px-3 py-1 text-[11px] font-semibold text-[#315F50]">クイックチェック</span>
          )}
        </div>
      </div>
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-5 md:py-8">
          <div className="mx-auto max-w-[40rem]">
            {phase === "intro" ? (
              <div className="grid gap-5">
                <div className="space-y-3">
                  <p className="service-kicker" style={{ color: "#4D7A69" }}>クイックチェック</p>
                  <h1 className="display-serif max-w-[12em] text-[2rem] leading-[1.2] text-[#22201D] md:text-[2.6rem]">
                    今の感覚を、24問で静かに整理する。
                  </h1>
                  <p className="text-[11px] tracking-[0.06em] text-[#9A9088]">{INTRO_FACTS}</p>
                  <p className="max-w-[35rem] text-[14px] leading-7 text-[#6F6760]">
                    今の感覚に近いものをひとつずつ選ぶだけです。正解はありません。
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={begin}
                    className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full px-5 py-3 text-[16px] transition hover:opacity-95 active:scale-[0.975]"
                    style={{ background: "#173B35", color: "#fff", fontWeight: 800, boxShadow: "0 14px 30px rgba(23,59,53,0.28)" }}
                  >
                    はじめる
                  </button>
                  <p className="mt-2.5 text-[11px] leading-6 text-[#9A9088]">
                    診断ではありません · <MvpActionLink href="/privacy" label="プライバシー" tone="ghost" />
                  </p>
                </div>

                {/* Transition cue — lightweight signal strip */}
                <div
                  className="rounded-[1rem] px-4 py-3"
                  style={{ background: "rgba(23,59,53,0.04)", border: "1px solid rgba(23,59,53,0.07)" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="signal-orb" aria-hidden="true" />
                    <p className="text-[12px] leading-6 text-[#6F6760]">
                      24問で、今の流れを少しずつ見ていきます。
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {phase === "quiz" && currentQuestion ? (
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px] text-[#9A9088]">
                    <span>{stepLabel}</span>
                    <span>残り約{remainingMinutes}分</span>
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

                <MvpCard className="space-y-4 rounded-[1.3rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_22px_44px_rgba(23,59,53,0.09)] md:p-6">
                  <div className="space-y-3">
                    <p className="service-kicker" style={{ color: "#4D7A69" }}>今の感覚に近いものをひとつ選んでください</p>
                    <h2 className="display-serif text-[1.52rem] leading-[1.32] text-[#22201D] md:text-[2.4rem]">
                      {currentQuestion.prompt}
                    </h2>
                    <p className="text-[13px] font-medium leading-7 text-[var(--muted)]">
                      {currentQuestion.format === "AB"
                        ? "A / B と、どちらともいえないの3択です。"
                        : "ひとつ選ぶと、少し間を置いて次へ進みます。"}
                    </p>
                  </div>

                  <div className={`grid gap-2.5 ${currentQuestion.format === "AB" ? "sm:grid-cols-3" : ""}`}>
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
                  <div className="flex gap-2.5 sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex min-h-[50px] w-[34%] items-center justify-center rounded-full border px-4 py-3 text-[14px] font-semibold transition hover:opacity-95 sm:w-auto"
                      style={{ borderColor: "rgba(23,59,53,0.16)", background: "rgba(23,59,53,0.05)", color: "#4D7A69" }}
                    >
                      戻る
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!currentAnswer}
                      className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-full px-4 py-3 text-[16px] transition hover:opacity-95 disabled:cursor-not-allowed disabled:shadow-none"
                      style={currentAnswer ? { background: "#173B35", color: "#fff", fontWeight: 800, boxShadow: "0 14px 28px rgba(23,59,53,0.26)" } : { background: "rgba(34,32,29,0.18)", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}
                    >
                      {currentIndex === totalQuestions - 1 ? "無料結果へ進む" : "すぐ次へ"}
                    </button>
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
