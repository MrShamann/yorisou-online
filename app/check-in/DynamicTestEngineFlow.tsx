"use client";

import { useEffect, useState } from "react";

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

export default function DynamicTestEngineFlow({ locale }: Props) {
  const t = copy[locale];
  const [phase, setPhase] = useState<"intro" | "quiz" | "redirecting">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const totalQuestions = dynamicTestSessionQuestions.length;
  const currentQuestion = dynamicTestSessionQuestions[currentIndex] || null;
  const progress = Math.min(currentIndex + 1, totalQuestions);

  useEffect(() => {
    if (phase === "quiz" || phase === "redirecting") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [phase, currentIndex]);

  function beginSession() {
    setAnswers({});
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setPhase("quiz");
  }

  function selectOption(optionId: string) {
    setSelectedOptionId(optionId);
    if (currentQuestion) {
      setAnswers((current) => ({
        ...current,
        [currentQuestion.candidate_id]: optionId,
      }));
    }
  }

  function goBack() {
    if (currentIndex === 0) {
      setPhase("intro");
      return;
    }

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    const previousQuestion = dynamicTestSessionQuestions[previousIndex];
    setSelectedOptionId(previousQuestion ? answers[previousQuestion.candidate_id] || null : null);
  }

  function goNext() {
    if (!currentQuestion || !selectedOptionId) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.candidate_id]: selectedOptionId,
    };
    setAnswers(nextAnswers);

    const nextIndex = currentIndex + 1;
    if (nextIndex < totalQuestions) {
      setCurrentIndex(nextIndex);
      setSelectedOptionId(nextAnswers[dynamicTestSessionQuestions[nextIndex]?.candidate_id || ""] || null);
      return;
    }

    const personaId = deriveDynamicTestPersonaId(nextAnswers);
    const nextHref = buildDynamicTestResultHref({ locale, personaId, source: "mini_app" });
    setPhase("redirecting");
    window.location.assign(nextHref);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(247,244,238,1)_0%,rgba(242,238,229,1)_100%)] px-5 py-6 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center justify-between gap-3 text-xs tracking-[0.2em] text-[var(--muted)]">
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
          <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-5 py-6 shadow-[0_14px_28px_rgba(47,35,33,0.04)] sm:px-7 sm:py-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="service-kicker">{t.progressLabel}</div>
                <h1 className="display-serif mt-2 text-[1.9rem] leading-[1.38] sm:text-[2.3rem]">{currentQuestion.question}</h1>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{currentQuestion.helper_text}</p>
              </div>
              <div className="shrink-0 rounded-full border border-[color:var(--line-soft)] bg-white/80 px-3 py-1.5 text-xs tracking-[0.18em] text-[var(--muted)]">
                {t.progressLabel} {progress}
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map((option) => {
                const active = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectOption(option.id)}
                    className={[
                      "min-h-[68px] rounded-[1.1rem] border px-4 py-4 text-left transition",
                      active
                        ? "border-[color:var(--cta-main)] bg-[rgba(58,38,33,0.06)] shadow-[0_8px_18px_rgba(47,35,33,0.08)]"
                        : "border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.76)] hover:border-[color:var(--line-sage)] hover:bg-[rgba(225,232,219,0.26)]",
                    ].join(" ")}
                  >
                    <div className="text-sm font-semibold text-[var(--text)]">{option.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={goBack} className="btn btn-secondary">
                {t.back}
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!selectedOptionId}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {progress === totalQuestions ? t.result : t.next}
              </button>
            </div>
            <p className="mt-4 text-xs leading-6 text-[var(--muted)]">
              {t.choiceHint}
            </p>
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
