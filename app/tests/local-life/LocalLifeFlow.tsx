"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import ShareResultActions from "@/app/components/share/ShareResultActions";
import ResultSupportPlan from "@/app/components/sr2/ResultSupportPlan";
import YorisouCompanionCard from "@/app/components/YorisouCompanionCard";
import YorisouRecommendationSlot from "@/app/components/YorisouRecommendationSlot";
import { LOCAL_LIFE_QUESTIONS, getLocalLifeAcknowledgement } from "@/app/data/yorisouQuestionSets";
import { trackRecommendationSignal } from "@/app/components/YorisouSignalTracker";

type Phase = "intro" | "quiz" | "result";

export default function LocalLifeFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultReady, setResultReady] = useState(false);
  const trackedStartRef = useRef(false);

  const question = LOCAL_LIFE_QUESTIONS[currentIndex];
  const resultBundle = resultReady ? getLocalLifeAcknowledgement(answers) : null;

  function begin() {
    if (!trackedStartRef.current) {
      trackedStartRef.current = true;
      void trackRecommendationSignal({
        source: "local_life_flow",
        signalType: "test_started",
        testId: "local-life",
        pagePath: "/tests/local-life",
      });
    }
    setPhase("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setResultReady(false);
  }

  function selectOption(optionId: string) {
    if (!question) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    if (currentIndex === LOCAL_LIFE_QUESTIONS.length - 1) {
      const nextResult = getLocalLifeAcknowledgement(nextAnswers);
      setResultReady(true);
      setPhase("result");
      void trackRecommendationSignal({
        source: "local_life_flow",
        signalType: "test_completed",
        testId: "local-life",
        resultId: nextResult.primaryTheme,
        pagePath: "/tests/local-life",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  if (phase === "result" && resultBundle) {
    const result = resultBundle.result;

    return (
      <main className="yr-focus">
        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-[42rem] space-y-6">
            <div className="space-y-2">
              <p className="service-kicker">暮らしの関心チェック</p>
              <h1 className="display-serif text-[1.9rem] leading-[1.24] text-[color:var(--yr-text)] md:text-[2.5rem]">
                今の関心: 「{result.title}」
              </h1>
              <p className="text-[15px] leading-8 text-[color:var(--yr-text-mut)]">{result.summary}</p>
            </div>

            <div className="surface-panel bg-[var(--yr-panel)]">
              <p className="text-[15px] leading-8 text-[color:var(--yr-text-mut)]">{result.detail}</p>
            </div>

            <div className="space-y-2.5">
              {result.bullets.map((bullet) => (
                <div key={bullet} className="surface-panel-soft">
                  <p className="text-[14px] leading-7 text-[color:var(--yr-text)]">{bullet}</p>
                </div>
              ))}
            </div>

            <YorisouCompanionCard
              testId="local-life"
              source="local_life_flow"
              resultId={result.id}
              pagePath="/tests/local-life"
              mode="local_life_inquiry"
            />

            <YorisouRecommendationSlot
              testId="local-life"
              source="local_life_flow"
              resultId={result.id}
              pagePath="/tests/local-life"
              mode="local_life_inquiry"
              title="今の関心から試しやすい入口"
            />

            <div className="surface-panel-soft !bg-[var(--yr-panel)]">
              <p className="text-[12px] leading-7 text-[color:var(--yr-text-faint)]">
                ここは、暮らしを直接引き受けるサービスではありません。今の関心や戻り方を、次の案内や改善の材料として整理する入口です。
              </p>
            </div>

            {/* SR-2: deterministic support plan + anonymous device-local save */}
            <ResultSupportPlan
              family="local-life"
              resultLabel={result.title}
              traits={result.bullets.slice(0, 3)}
              resultPath="/tests/local-life"
              recognitionLine={result.summary}
            />

            <ShareResultActions
              input={{
                testLabel: "暮らしの関心チェック",
                title: result.title,
                line: result.summary,
                traits: result.bullets.slice(0, 3),
                seed: result.id,
                url: "/tests/local-life",
              }}
              trackingTestId="local-life"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={begin}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--yr-accent)] bg-[var(--yr-accent)] px-5 text-[14px] font-semibold text-[color:var(--yr-accent-ink)] transition hover:-translate-y-0.5"
              >
                もう一度整理する
              </button>
              <Link href="/tests" className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--yr-hair-2)] bg-[var(--yr-panel)] px-5 text-[14px] font-semibold text-[color:var(--yr-accent-text)]">
                入口一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="yr-focus">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[42rem]">
          {phase === "intro" ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="service-kicker">暮らしの関心チェック</p>
                <h1 className="display-serif text-[2rem] leading-[1.22] text-[color:var(--yr-text)] md:text-[2.6rem]">
                  言葉にしにくい揺れを、<br />
                  <span className="text-[color:var(--yr-accent-text)]">今の関心として整理する。</span>
                </h1>
                <p className="text-[15px] leading-8 text-[color:var(--yr-text-mut)]">
                  生活リズム、気持ちの戻り方、人との距離、小さな行動。今の関心に近いものを選ぶと、次の入口を静かに整理できます。
                </p>
              </div>
              <div className="surface-panel space-y-3 bg-[var(--yr-panel)]">
                <p className="surface-meta">この入口で確認すること</p>
                <div className="surface-list">
                  <p className="text-[13px] leading-7 text-[color:var(--yr-text-mut)]">今の関心テーマがどれに近いか</p>
                  <p className="text-[13px] leading-7 text-[color:var(--yr-text-mut)]">情報がほしいのか、声を送りたいのか</p>
                  <p className="text-[13px] leading-7 text-[color:var(--yr-text-mut)]">Community / Design につながる余地があるか</p>
                </div>
              </div>
              <button
                type="button"
                onClick={begin}
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--yr-accent)] bg-[var(--yr-accent)] px-6 text-[16px] font-bold text-[color:var(--yr-accent-ink)] shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] sm:w-auto"
              >
                関心を整理する
              </button>
            </div>
          ) : question ? (
            <div className="space-y-4">
              <div className="surface-panel-soft">
                <div className="text-[11px] font-semibold tracking-[0.13em] text-[color:var(--yr-text-faint)]">{question.section}</div>
                <div className="mt-0.5 text-[14px] font-bold text-[color:var(--yr-text)]">
                  Q{currentIndex + 1} / {LOCAL_LIFE_QUESTIONS.length}
                </div>
              </div>
              <div className="surface-panel space-y-4 bg-[var(--yr-panel)] md:p-6">
                <p className="service-kicker">近いものをひとつ選んでください</p>
                <h2 className="display-serif text-[1.48rem] leading-[1.32] text-[color:var(--yr-text)] md:text-[2.1rem]">{question.prompt}</h2>
                <div className="grid gap-2.5">
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(option.id)}
                      className="rounded-[1rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:bg-[var(--yr-panel)]"
                    >
                      <span className="text-[15px] font-semibold leading-7 text-[color:var(--yr-text)]">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
