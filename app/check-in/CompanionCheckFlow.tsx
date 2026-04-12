"use client";

import { useEffect, useState } from "react";

import {
  companionCheckQuestions,
  companionCheckResults,
  scoreCompanionCheck,
  type CompanionCheckResult,
  type CompanionCheckResultKey,
} from "@/lib/yorisouCompanionCheck";
import type { CheckInTrafficSource } from "@/lib/checkInAttribution";

type CompanionCheckFlowProps = {
  initialResultKey?: CompanionCheckResultKey | null;
  trafficSource: CheckInTrafficSource;
};

type TrackEventName =
  | "landing_viewed"
  | "quiz_started"
  | "question_progressed"
  | "quiz_completed"
  | "result_viewed"
  | "line_cta_clicked"
  | "line_continuation_clicked"
  | "share_save_clicked";

const routePath = "/check-in";

function buildShareText(result: CompanionCheckResult) {
  return `${result.shareCopy} ${routePath}`;
}

export default function CompanionCheckFlow({ initialResultKey = null, trafficSource }: CompanionCheckFlowProps) {
  const hasInitialResult = Boolean(initialResultKey && companionCheckResults[initialResultKey]);
  const [phase, setPhase] = useState<"landing" | "quiz" | "result">(hasInitialResult ? "result" : "landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [resultKey, setResultKey] = useState<CompanionCheckResultKey | null>(hasInitialResult ? initialResultKey : null);
  const [shareState, setShareState] = useState<"idle" | "done" | "copied">("idle");
  const [flowId] = useState(() =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  );

  const currentQuestion = companionCheckQuestions[currentIndex] || null;
  const totalQuestions = companionCheckQuestions.length;
  const result = resultKey ? companionCheckResults[resultKey] : null;
  const progress = Math.min(currentIndex + 1, totalQuestions);
  const shareUrl = typeof window !== "undefined" ? window.location.href : routePath;

  useEffect(() => {
    if (phase === "landing") {
      void trackEvent("landing_viewed");
    }
    if (phase === "result" && resultKey) {
      void trackEvent("result_viewed", { resultKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, resultKey]);

  useEffect(() => {
    if (phase === "quiz" || phase === "result") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [phase, currentIndex, resultKey]);

  async function trackEvent(event: TrackEventName, extra: Record<string, unknown> = {}) {
    try {
      await fetch("/api/check-in/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          event,
          source: trafficSource,
          timestamp: new Date().toISOString(),
          sessionId: flowId,
          ...(typeof extra.questionIndex === "number" ? { questionIndex: extra.questionIndex } : {}),
          ...(typeof extra.resultKey === "string" ? { resultKey: extra.resultKey } : {}),
        }),
      });
    } catch {
      // Intentionally silent: tracking should never block the experience.
    }
  }

  function beginQuiz() {
    setPhase("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOptionId(null);
    void trackEvent("quiz_started");
  }

  function selectOption(optionId: string) {
    setSelectedOptionId(optionId);
    if (currentQuestion) {
      setAnswers((current) => ({
        ...current,
        [currentQuestion.id]: optionId,
      }));
    }
  }

  function goNext() {
    if (!currentQuestion || !selectedOptionId) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOptionId,
    };
    setAnswers(nextAnswers);
    void trackEvent("question_progressed", { questionIndex: currentIndex });
    const nextIndex = currentIndex + 1;
    if (nextIndex < totalQuestions) {
      setCurrentIndex(nextIndex);
      setSelectedOptionId(nextAnswers[companionCheckQuestions[nextIndex]?.id || ""] || null);
      return;
    }

    const nextResult = scoreCompanionCheck(nextAnswers);
    setResultKey(nextResult.key);
    setPhase("result");
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("source", trafficSource);
    nextUrl.searchParams.set("result", nextResult.key);
    window.history.replaceState({}, "", nextUrl.toString());
    void trackEvent("quiz_completed", { resultKey: nextResult.key });
  }

  function goBack() {
    if (phase !== "quiz" || currentIndex === 0) {
      setPhase("landing");
      return;
    }

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    const previousQuestion = companionCheckQuestions[previousIndex];
    setSelectedOptionId(previousQuestion ? answers[previousQuestion.id] || null : null);
  }

  function restart() {
    setAnswers({});
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setResultKey(null);
    setPhase("landing");
    setShareState("idle");
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("source", trafficSource);
    nextUrl.searchParams.delete("result");
    window.history.replaceState({}, "", nextUrl.toString());
  }

  async function shareResult() {
    if (!result) return;
    const text = buildShareText(result);
    try {
      if (navigator.share) {
        await navigator.share({ title: "今日の寄り添い方チェック", text, url: shareUrl });
        setShareState("done");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        setShareState("copied");
      } else {
        setShareState("copied");
      }
    } catch {
      // Swallow share failures. The flow should remain usable.
    }
    void trackEvent("share_save_clicked", { resultKey: result.key });
  }

  const resultExample = companionCheckResults.watchful;
  const lineContinuationHref = "/support";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(247,244,238,1)_0%,rgba(242,238,229,1)_100%)] text-[var(--text)]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs tracking-[0.2em] text-[var(--muted)]">
          <div>YORISOU / 今日の寄り添い方チェック</div>
          <div>LIGHT COMPANIONSHIP ENTRY</div>
        </div>

        {phase === "landing" && (
          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.9)] px-6 py-8 shadow-[0_14px_28px_rgba(47,35,33,0.04)] sm:px-8 sm:py-10">
              <div className="service-kicker">1-2 minutes / 5 questions</div>
              <h1 className="display-serif mt-4 max-w-[13em] text-[2.2rem] leading-[1.25] sm:text-[3rem]">
                いまの寄り添い方を、5問で軽く確かめる。
              </h1>
              <p className="mt-5 max-w-[40rem] text-[15px] leading-8 text-[var(--muted)] sm:text-base">
                今日の寄り添い方チェックは、いまの支え方の傾向を短く受け取るための入口です。
                1〜2分で終わる5問のチェックから、あなたに合う寄り添い方と、次の小さな一歩を返します。
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <span className="rounded-full border border-[color:var(--line-soft)] bg-white/75 px-3 py-1.5">5問だけ</span>
                <span className="rounded-full border border-[color:var(--line-soft)] bg-white/75 px-3 py-1.5">答えは短く</span>
                <span className="rounded-full border border-[color:var(--line-soft)] bg-white/75 px-3 py-1.5">LINEで続ける</span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={beginQuiz} className="btn btn-primary">
                  5問をはじめる
                </button>
                <a href="#sample-result" className="btn btn-secondary">
                  結果例を見る
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              <article id="sample-result" className="rounded-[2rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.48)] px-6 py-6 sm:px-7 sm:py-7">
                <div className="service-kicker text-[var(--accent-sage-text)]">結果イメージ</div>
                <h2 className="display-serif mt-3 text-[1.62rem] leading-[1.4] text-[var(--text)]">{resultExample.title}</h2>
                <p className="mt-4 text-sm leading-8 text-[var(--accent-sage-text)]">{resultExample.summary}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--accent-sage-text)]">
                  例: {resultExample.nextStep}
                </p>
              </article>

              <article className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.72)] px-6 py-6">
                <div className="service-kicker">このチェックでわかること</div>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                  <li>・今の寄り添い方の傾向</li>
                  <li>・短く読める結果の要点</li>
                  <li>・LINEで続く小さな次の一歩</li>
                </ul>
              </article>
            </div>
          </section>
        )}

        {phase === "quiz" && currentQuestion && (
          <section className="mx-auto max-w-4xl rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.94)] px-5 py-6 shadow-[0_14px_28px_rgba(47,35,33,0.04)] sm:px-7 sm:py-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="service-kicker">QUESTION {progress}</div>
                <h1 className="display-serif mt-2 text-[1.8rem] leading-[1.42] sm:text-[2.2rem]">{currentQuestion.prompt}</h1>
              </div>
              <div className="shrink-0 rounded-full border border-[color:var(--line-soft)] bg-white/80 px-3 py-1.5 text-xs tracking-[0.18em] text-[var(--muted)]">
                {progress} / {totalQuestions}
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">{currentQuestion.helperText}</p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[rgba(201,211,195,0.28)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(85,98,82,0.8),rgba(58,38,33,0.86))]"
                style={{ width: `${(progress / totalQuestions) * 100}%` }}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
                戻る
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!selectedOptionId}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {progress === totalQuestions ? "結果を見る" : "次へ"}
              </button>
            </div>
          </section>
        )}

        {phase === "result" && result && (
          <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
              <article className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-6 py-7 shadow-[0_14px_28px_rgba(47,35,33,0.04)] sm:px-8 sm:py-8">
                <div className="service-kicker">RESULT</div>
                <h1 className="display-serif mt-4 text-[2rem] leading-[1.34] sm:text-[2.42rem]">{result.title}</h1>
              <p className="mt-5 text-[15px] leading-8 text-[var(--muted)] sm:text-base">{result.summary}</p>
                <div className="mt-6 rounded-[1.35rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.4)] px-5 py-5">
                  <div className="service-kicker text-[var(--accent-sage-text)]">ひとつの気づき</div>
                  <p className="mt-3 text-sm leading-8 text-[var(--accent-sage-text)]">{result.insight}</p>
              </div>
              <div className="mt-5 rounded-[1.35rem] border border-[color:var(--line-soft)] bg-white/78 px-5 py-5">
                <div className="service-kicker">今日の一歩</div>
                <p className="mt-3 text-sm leading-8 text-[var(--muted)]">{result.nextStep}</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={lineContinuationHref}
                  onClick={() => void trackEvent("line_continuation_clicked", { resultKey: result.key })}
                  className="btn btn-primary"
                >
                  LINEで続ける
                </a>
                <button type="button" onClick={shareResult} className="btn btn-secondary">
                  結果を共有する
                </button>
              </div>
              <div className="mt-4 text-sm text-[var(--muted)]">
                {shareState === "copied" && "結果リンクをコピーしました。"}
                {shareState === "done" && "共有画面を開きました。"}
              </div>
            </article>

            <aside className="grid gap-4">
              <article className="rounded-[2rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.5)] px-6 py-6">
                <div className="service-kicker text-[var(--accent-sage-text)]">次の続き</div>
                <p className="mt-3 text-sm leading-8 text-[var(--accent-sage-text)]">{result.teaser}</p>
              </article>
              <article className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.76)] px-6 py-6">
                <div className="service-kicker">この結果について</div>
                <p className="mt-3 text-sm leading-8 text-[var(--muted)]">
                  このv1は、深い分析よりも「いまの寄り添い方」を軽く見つけることを優先しています。
                  次の段階では、LINEでの小さな継続と、より軽い追加チェックを育てていきます。
                </p>
              </article>
              <div className="flex gap-3">
                <button type="button" onClick={restart} className="btn btn-secondary">
                  もう一度試す
                </button>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
