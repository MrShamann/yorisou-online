"use client";

import { useEffect, useRef, useState } from "react";

import BrandSigil from "@/app/components/BrandSigil";
import { trackDteEvent } from "@/app/components/DteEventTracker";
import { buildDynamicTestResultHref, deriveDynamicTestPersonaId, dynamicTestSessionQuestions } from "@/lib/dynamicTestEngineSession";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  entrySource?: string | null;
};

const copy = {
  ja: {
    pretitle: "YORISOU / LINE MINI App",
    title: "今のあなたに合う寄り添い方を、やさしく見つける。",
    body: "短い質問にひとつずつ答えるだけで、今の気持ちに合う寄り添い方と、共有しやすい結果が返ってきます。",
    start: "はじめる",
    back: "戻る",
    next: "次へ",
    result: "結果を見る",
    progressLabel: "質問",
    completeLabel: "結果を表示しています",
    choiceHint: "いちばん近いものを1つ選んでください。",
    duration: "目安: 約5分",
    benefitOne: "LINE内で完結",
    benefitTwo: "1問ずつ進む",
    benefitThree: "結果は共有しやすい",
  },
  en: {
    pretitle: "YORISOU / LINE MINI App",
    title: "Find the kind of support that fits you right now.",
    body: "Answer one short question at a time and get a result that is easy to share and easy to continue from.",
    start: "Start",
    back: "Back",
    next: "Next",
    result: "View result",
    progressLabel: "Question",
    completeLabel: "Showing your result",
    choiceHint: "Pick the one option that feels closest to you.",
    duration: "About 5 minutes",
    benefitOne: "Stays in LINE",
    benefitTwo: "One question at a time",
    benefitThree: "Easy to share",
  },
} as const;

function createClientSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `dte_session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function DynamicTestEngineFlow({ locale, entrySource = null }: Props) {
  const t = copy[locale];
  const miniAppEntry = entrySource === "mini_app";
  const [phase, setPhase] = useState<"intro" | "quiz" | "redirecting">(miniAppEntry ? "quiz" : "intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const sessionIdRef = useRef(createClientSessionId());
  const advancingLockRef = useRef(false);
  const completionSubmitLockRef = useRef(false);

  const totalQuestions = dynamicTestSessionQuestions.length;
  const currentQuestion = dynamicTestSessionQuestions[currentIndex] || null;
  const progress = Math.min(currentIndex + 1, totalQuestions);

  useEffect(() => {
    if (phase === "quiz" || phase === "redirecting") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [phase, currentIndex]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current !== null) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  function clearAutoAdvanceTimer() {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }

  async function persistCompletionRecord(personaId: string) {
    const response = await fetch("/api/dynamic-test/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        locale,
        personaId,
        totalQuestions,
        answeredQuestions: totalQuestions,
        sourceSurface: "mini_app",
        entrySource: "mini_app",
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { completionId?: string | null } | null;
    return typeof data?.completionId === "string" && data.completionId.length > 0 ? data.completionId : null;
  }

  function beginSession() {
    clearAutoAdvanceTimer();
    advancingLockRef.current = false;
    completionSubmitLockRef.current = false;
    sessionIdRef.current = createClientSessionId();
    setAnswers({});
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setPhase("quiz");

    void trackDteEvent({
      event: "session_started",
      sessionId: sessionIdRef.current,
      locale,
      entrySource: "mini_app",
      source: "check_in",
      surface: "check_in",
      action: "start",
      branchId: "yorisou_dte",
      sourceBranchId: "yorisou_dte",
      visibilityPolicy: "public",
      crossBranchAccessPolicy: "explicit_bridge",
    });
  }

  function selectOption(optionId: string) {
    clearAutoAdvanceTimer();
    if (advancingLockRef.current) {
      return;
    }
    setSelectedOptionId(optionId);
    if (currentQuestion) {
      setAnswers((current) => ({
        ...current,
        [currentQuestion.candidate_id]: optionId,
      }));

      void trackDteEvent({
        event: "question_answered",
        sessionId: sessionIdRef.current,
        locale,
        entrySource: "mini_app",
        questionPosition: progress,
        questionId: currentQuestion.candidate_id,
        totalQuestionsAnswered: currentIndex + 1,
        source: "check_in",
        surface: "check_in",
        action: "answer",
        branchId: "yorisou_dte",
        sourceBranchId: "yorisou_dte",
        visibilityPolicy: "public",
        crossBranchAccessPolicy: "explicit_bridge",
      });
    }

    if (currentQuestion) {
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        autoAdvanceTimerRef.current = null;
        void goNext(optionId);
      }, 200);
    }
  }

  function goBack() {
    clearAutoAdvanceTimer();
    advancingLockRef.current = false;
    if (currentIndex === 0) {
      if (miniAppEntry) {
        window.location.assign("/line/mini-app");
        return;
      }
      setPhase("intro");
      return;
    }

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    const previousQuestion = dynamicTestSessionQuestions[previousIndex];
    setSelectedOptionId(previousQuestion ? answers[previousQuestion.candidate_id] || null : null);
  }

  async function goNext(selectedOptionIdOverride?: string) {
    clearAutoAdvanceTimer();
    if (advancingLockRef.current) {
      return;
    }

    const effectiveSelectedOptionId = selectedOptionIdOverride || selectedOptionId;
    if (!currentQuestion || !effectiveSelectedOptionId) return;

    advancingLockRef.current = true;

    const nextAnswers = {
      ...answers,
      [currentQuestion.candidate_id]: effectiveSelectedOptionId,
    };
    setAnswers(nextAnswers);

    const nextIndex = currentIndex + 1;
    if (nextIndex < totalQuestions) {
      setCurrentIndex(nextIndex);
      setSelectedOptionId(nextAnswers[dynamicTestSessionQuestions[nextIndex]?.candidate_id || ""] || null);
      advancingLockRef.current = false;
      return;
    }

    const personaId = deriveDynamicTestPersonaId(nextAnswers);
    let completionId: string | null = null;

    if (!completionSubmitLockRef.current) {
      completionSubmitLockRef.current = true;
      try {
        completionId = await persistCompletionRecord(personaId);
      } catch {
        completionId = null;
      }
    }

    const nextHref = buildDynamicTestResultHref({
      locale,
      personaId,
      source: "mini_app",
      completionId,
    });
    setPhase("redirecting");
    window.location.assign(nextHref);
  }

  function handleNextClick() {
    void goNext();
  }

  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(9,14,13,0.98)_0%,rgba(20,32,28,0.97)_36%,rgba(243,246,239,1)_100%)] px-4 py-4 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full min-h-[calc(100svh-2rem)] max-w-2xl flex-col">
        <div className="mb-3 flex items-center justify-between gap-3 text-[10px] tracking-[0.18em] text-white/62">
          <BrandSigil label="YORISOU" />
          <div>{t.progressLabel}</div>
        </div>

        {phase === "intro" && (
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(22,34,29,0.98)_55%,rgba(242,246,239,0.99)_100%)] shadow-[0_24px_54px_rgba(10,16,14,0.18)]">
            <div className="px-4 pt-4 text-white">
              <div className="flex items-center justify-between gap-3">
                <BrandSigil label="YORISOU" className="shrink-0" />
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-white/84">
                  LINE MINI App
                </span>
              </div>

              <div className="mt-4 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)] px-4 py-4 shadow-[0_16px_30px_rgba(5,10,9,0.12)]">
                <div className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] tracking-[0.22em] text-white/82">
                  YORISOU / LINE
                </div>
                <h1 className="display-serif mt-4 text-[2.35rem] leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.55rem]">
                  {t.title}
                </h1>
                <p className="mt-3 text-[14px] leading-7 text-white/74 sm:text-[15px]">{t.body}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    t.duration,
                    t.benefitOne,
                    t.benefitTwo,
                    t.benefitThree,
                  ].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] leading-5 text-white/88"
                    >
                      {label}
                    </span>
                  ))}
                </div>

              <button type="button" onClick={beginSession} className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(26,39,34,1)_0%,rgba(11,16,15,1)_100%)] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_16px_30px_rgba(5,10,9,0.28)] ring-1 ring-[rgba(157,184,170,0.18)]">
                  {t.start}
              </button>
                <p className="mt-2 text-[11px] leading-5 text-white/60">{t.duration} / 5択 / 33問 / Q1からそのまま開始</p>
              </div>
            </div>
          </section>
        )}

        {phase === "quiz" && currentQuestion && (
          <section className="flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(23,34,30,0.98)_58%,rgba(241,245,238,0.99)_100%)] shadow-[0_24px_52px_rgba(10,16,14,0.16)]">
            <div className="px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] tracking-[0.16em] text-white/82">{t.progressLabel}</div>
                  <h1 className="display-serif mt-2 text-[1.52rem] leading-[1.22] tracking-[-0.03em] text-white sm:text-[1.92rem]">{currentQuestion.question}</h1>
                  <p className="mt-2 text-[12px] leading-5 text-white/72 sm:text-sm sm:leading-6">{currentQuestion.helper_text}</p>
                </div>
                <div className="shrink-0 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[10px] tracking-[0.16em] text-white/76">
                  {t.progressLabel} {progress}
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 sm:px-6">
              <div className="grid gap-2.5 sm:gap-3">
                {currentQuestion.options.map((option) => {
                  const active = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(option.id)}
                      className={[
                        "min-h-[56px] rounded-[1rem] border px-4 py-3 text-left transition",
                        active
                          ? "border-[rgba(242,248,241,0.9)] bg-[linear-gradient(180deg,rgba(242,248,241,0.98)_0%,rgba(224,234,224,0.98)_100%)] shadow-[0_10px_20px_rgba(10,16,14,0.18)]"
                          : "border-white/12 bg-white/8 hover:border-white/20 hover:bg-white/12",
                      ].join(" ")}
                    >
                      <div className={["text-[13px] font-semibold leading-5 sm:text-sm", active ? "text-[var(--accent-sage-text)]" : "text-white/92"].join(" ")}>{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,22,20,0.96)_0%,rgba(24,35,31,0.96)_100%)] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6">
              <div className="flex gap-2 sm:gap-3">
                <button type="button" onClick={goBack} className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[0.95rem] border border-white/12 bg-white/8 px-4 py-3 text-[14px] font-medium text-white/86 shadow-[0_10px_18px_rgba(10,16,14,0.1)]">
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={handleNextClick}
                  disabled={!selectedOptionId}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[0.95rem] bg-[linear-gradient(180deg,rgba(242,248,241,1)_0%,rgba(224,234,224,1)_100%)] px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)] shadow-[0_14px_24px_rgba(10,16,14,0.16)] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {progress === totalQuestions ? t.result : t.next}
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-white/62">{t.choiceHint}</p>
            </div>
          </section>
        )}

        {phase === "redirecting" && (
          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(23,34,30,0.98)_100%)] px-6 py-8 text-center text-white shadow-[0_24px_52px_rgba(10,16,14,0.16)]">
            <div className="service-kicker">{t.completeLabel}</div>
            <p className="mt-4 text-sm leading-7 text-white/72">
              {locale === "ja" ? "ロック済みの結果画面へ移動しています。" : "Moving to the locked result surface."}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
