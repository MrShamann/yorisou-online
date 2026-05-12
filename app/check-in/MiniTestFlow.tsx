"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { MvpActionLink, MvpCard } from "../components/MvpSurface";
import {
  buildCurrentStateResultPayload,
  currentStateCheckV1,
  currentStateQuestions,
  getCurrentStateMilestone,
  getCurrentStateSegmentLabel,
  saveCurrentStateResult,
  scoreCurrentStateCheck,
  type CurrentStateQuestion,
  type CurrentStateAnswerMap,
} from "./currentStateCheckV1";

type Phase = "intro" | "quiz";
const AUTO_ADVANCE_DELAY_MS = 320;

const INTRO_PILLS = ["24問のクイックチェック", "3分ほど", "無料結果あり", "診断ではありません"] as const;
const RESULT_PROMISES = [
  "今のあなたに近いモード",
  "短い認識の一行",
  "やさしい次のヒント",
  "正式版はあとで進めます",
] as const;

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
  const segmentLabel = getCurrentStateSegmentLabel(currentIndex);
  const milestone = getCurrentStateMilestone(currentIndex);
  const remainingMinutes = getRemainingMinutes(currentIndex);

  const selectedCount = useMemo(
    () => Object.keys(answers).filter((questionId) => Boolean(answers[questionId])).length,
    [answers],
  );

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,_rgba(221,236,242,0.68),_transparent_34%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_46%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container py-5 md:py-10">
          <div className="mx-auto max-w-[40rem]">
            {phase === "intro" ? (
              <div className="grid gap-5">
                <div className="flex flex-wrap gap-1.5">
                  {INTRO_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex rounded-full border border-[rgba(233,120,99,0.18)] bg-white/78 px-3 py-1.5 text-[12px] font-semibold leading-5 text-[#6F625C] shadow-[0_8px_18px_rgba(233,120,99,0.06)]"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="service-kicker">今の状態チェック v1</p>
                  <h1 className="display-serif max-w-[11em] text-[2.05rem] leading-[1.14] text-[#2F2A28] md:text-[2.95rem]">
                    いまの自分の流れを、
                    <span className="block text-[#D95F4E]">24問のクイックチェックで静かに見る。</span>
                  </h1>
                  <p className="max-w-[35rem] text-[15px] font-medium leading-7 text-[#6F625C] md:leading-8">
                    今の感覚に近いものを、その場でひとつずつ選ぶだけです。正解はありません。
                    答え終えると、今のあなたに近い無料結果が表示されます。正式版の 72 問は準備中です。
                  </p>
                </div>

                <MvpCard className="space-y-4 rounded-[1.2rem] border-[rgba(233,120,99,0.12)] bg-white/90 shadow-[0_16px_34px_rgba(233,120,99,0.08)]">
                  <div className="service-kicker">答えたあとに見えること</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {RESULT_PROMISES.map((item) => (
                      <div
                        key={item}
                        className="rounded-[0.95rem] border border-[rgba(105,151,130,0.16)] bg-[#F4FAF7] px-4 py-2.5 text-[14px] font-semibold leading-7 text-[#315F50]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-[13px] leading-7 text-[var(--muted)]">
                    最初に見えるのは無料結果です。そのあとで、必要なら正式版の案内や次のヒントへ進めます。
                  </p>
                </MvpCard>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={begin}
                    className="inline-flex min-h-[58px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 py-3 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] hover:opacity-95 sm:w-auto"
                  >
                    クイックチェックを始める
                  </button>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] leading-7 text-[var(--muted)]">
                    <MvpActionLink href="/formal-check" label="正式版の案内を見る" tone="ghost" />
                    <MvpActionLink href="/privacy" label="プライバシー" tone="ghost" />
                  </div>
                </div>

                <p className="text-[12px] leading-7 text-[var(--muted)]">
                  ログインなしで始められます。今の状態を見返すための無料結果で、診断や固定的なラベルづけではありません。
                  24問は入口で、正式版はあとで進めます。
                </p>
              </div>
            ) : null}

            {phase === "quiz" && currentQuestion ? (
              <div className="grid gap-4">
                <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.12)] bg-white/90 p-3.5 shadow-[0_18px_38px_rgba(23,59,53,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.14em] text-[#6F625C]">{segmentLabel}</div>
                      <div className="mt-1 text-[14px] font-bold text-[#2F2A28]">Q{Math.min(currentIndex + 1, totalQuestions)} / {totalQuestions}</div>
                    </div>
                    <div className="rounded-full bg-[#FDE8DD] px-3 py-1 text-[12px] font-semibold text-[#D95F4E]">
                      残り約{remainingMinutes}分
                    </div>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-[rgba(23,59,53,0.12)]">
                    <div
                      className="h-full rounded-full bg-[#173B35] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-[12px] leading-6 text-[var(--muted)]">
                    <span>{stepLabel}</span>
                    <span>{selectedCount} / {totalQuestions} 回答済み</span>
                  </div>
                  {milestone ? (
                    <div className="mt-3 rounded-[0.9rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.58)] px-3.5 py-2 text-[13px] leading-7 text-[var(--accent-sage-text)]">
                      {milestone}
                    </div>
                  ) : null}
                </div>

                <MvpCard className="space-y-4 rounded-[1.3rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_22px_44px_rgba(23,59,53,0.09)] md:p-6">
                  <div className="space-y-3">
                    <p className="service-kicker">今の感覚に近いものをひとつ選んでください</p>
                    <h2 className="display-serif text-[1.52rem] leading-[1.32] text-[#2F2A28] md:text-[2.4rem]">
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
                          className={`rounded-[1.05rem] border px-4 py-3.5 text-left transition ${
                            selected
                              ? "border-[#173B35] bg-[#F4FAF7] shadow-[0_12px_24px_rgba(23,59,53,0.12)]"
                              : "border-[rgba(111,98,92,0.14)] bg-white/90 hover:-translate-y-0.5 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-[15px] font-semibold leading-7 text-[var(--text)]">{option.label}</span>
                            <span
                              className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-[#173B35] bg-[#173B35] text-white"
                                  : "border-[rgba(201,211,195,0.78)] bg-white"
                              }`}
                            >
                              {selected ? "✓" : ""}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </MvpCard>

                <div className="sticky bottom-0 z-20 -mx-4 border-t border-[rgba(23,59,53,0.1)] bg-[rgba(255,247,241,0.96)] px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
                  <div className="flex gap-2.5 sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex min-h-[50px] w-[34%] items-center justify-center rounded-full border border-[rgba(105,151,130,0.24)] bg-[#EAF7F1] px-4 py-3 text-[14px] font-semibold text-[#315F50] transition hover:-translate-y-0.5 hover:opacity-95 sm:w-auto"
                    >
                      戻る
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!currentAnswer}
                      className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-full border border-transparent bg-[#173B35] px-4 py-3 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[rgba(111,98,92,0.28)] disabled:text-white disabled:shadow-none"
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
