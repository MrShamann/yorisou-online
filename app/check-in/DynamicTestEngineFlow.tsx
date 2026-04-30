"use client";

import { useEffect, useRef, useState } from "react";

import { buildDynamicTestResultHref, deriveDynamicTestPersonaId, dynamicTestSessionQuestions } from "@/lib/dynamicTestEngineSession";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
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

export default function DynamicTestEngineFlow({ locale }: Props) {
  const t = copy[locale];
  const [phase, setPhase] = useState<"intro" | "quiz" | "redirecting">("intro");
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
    <main className="min-h-[100svh] overflow-x-hidden bg-[linear-gradient(180deg,rgba(247,244,238,1)_0%,rgba(242,238,229,1)_100%)] px-4 py-3 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full min-h-[calc(100svh-1.5rem)] max-w-2xl flex-col">
        <div className="mb-3 flex items-center justify-between gap-3 text-[10px] tracking-[0.18em] text-[var(--muted)]">
          <div>{t.pretitle}</div>
          <div>{t.progressLabel}</div>
        </div>

        {phase === "intro" && (
          <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-5 py-7 shadow-[0_14px_28px_rgba(47,35,33,0.04)] sm:px-8 sm:py-9">
            <div className="service-kicker">LINE MINI App</div>
            <h1 className="display-serif mt-4 text-[2rem] leading-[1.26] sm:text-[2.6rem]">{t.title}</h1>
            <p className="mt-5 text-[15px] leading-8 text-[var(--muted)] sm:text-base">{t.body}</p>
            <div className="mt-6 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-3">
              <span className="rounded-[1.1rem] border border-[color:var(--line-soft)] bg-white/75 px-4 py-3 text-center">{t.duration}</span>
              <span className="rounded-[1.1rem] border border-[color:var(--line-soft)] bg-white/75 px-4 py-3 text-center">{t.benefitOne}</span>
              <span className="rounded-[1.1rem] border border-[color:var(--line-soft)] bg-white/75 px-4 py-3 text-center">{t.benefitThree}</span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={beginSession} className="btn btn-primary min-h-[52px]">
                {t.start}
              </button>
            </div>
          </section>
        )}

        {phase === "quiz" && currentQuestion && (
          <section className="flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-[1.9rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] shadow-[0_14px_28px_rgba(47,35,33,0.04)]">
            <div className="px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="service-kicker text-[10px] tracking-[0.16em]">{t.progressLabel}</div>
                  <h1 className="display-serif mt-1.5 text-[1.58rem] leading-[1.24] sm:text-[2.1rem]">{currentQuestion.question}</h1>
                  <p className="mt-2 text-[12px] leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">{currentQuestion.helper_text}</p>
                </div>
                <div className="shrink-0 rounded-full border border-[color:var(--line-soft)] bg-white/80 px-3 py-1.5 text-[10px] tracking-[0.16em] text-[var(--muted)]">
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
                        "min-h-[58px] rounded-[1rem] border px-4 py-3 text-left transition",
                        active
                          ? "border-[color:var(--cta-main)] bg-[rgba(58,38,33,0.06)] shadow-[0_8px_18px_rgba(47,35,33,0.08)]"
                          : "border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.76)] hover:border-[color:var(--line-sage)] hover:bg-[rgba(225,232,219,0.26)]",
                      ].join(" ")}
                    >
                      <div className="text-[13px] font-semibold leading-5 text-[var(--text)] sm:text-sm">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.98)] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6">
              <div className="flex gap-2 sm:gap-3">
                <button type="button" onClick={goBack} className="btn btn-secondary min-h-[48px] flex-1">
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={handleNextClick}
                  disabled={!selectedOptionId}
                  className="btn btn-primary min-h-[48px] flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {progress === totalQuestions ? t.result : t.next}
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[var(--muted)]">{t.choiceHint}</p>
            </div>
          </section>
        )}

        {phase === "redirecting" && (
          <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-6 py-8 text-center shadow-[0_14px_28px_rgba(47,35,33,0.04)]">
            <div className="service-kicker">{t.completeLabel}</div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {locale === "ja" ? "ロック済みの結果画面へ移動しています。" : "Moving to the locked result surface."}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
