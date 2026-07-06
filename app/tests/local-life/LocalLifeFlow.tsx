"use client";

import { useRef, useState } from "react";
import Link from "next/link";

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
      <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_44%,_#F3FAF6_100%)] text-[#2F2A28]">
        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-[42rem] space-y-6">
            <div className="space-y-2">
              <p className="service-kicker">暮らしの困りごとチェック</p>
              <h1 className="display-serif text-[1.9rem] leading-[1.24] text-[#2F2A28] md:text-[2.5rem]">
                今の関心: 「{result.title}」
              </h1>
              <p className="text-[15px] leading-8 text-[#5F5750]">{result.summary}</p>
            </div>

            <div className="rounded-[1.4rem] border border-[rgba(23,59,53,0.12)] bg-white/92 p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)]">
              <p className="text-[15px] leading-8 text-[#5F5750]">{result.detail}</p>
            </div>

            <div className="space-y-2.5">
              {result.bullets.map((bullet) => (
                <div key={bullet} className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-4 py-3.5">
                  <p className="text-[14px] leading-7 text-[#2F2A28]">{bullet}</p>
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

            <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
              <p className="text-[12px] leading-7 text-[#7A7068]">
                ここは、暮らしの困りごとを直接引き受けるサービスではありません。生活の声や関心を、次の取り組みや案内の材料として整理する入口です。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={begin}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5"
              >
                もう一度整理する
              </button>
              <Link href="/tests" className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]">
                入口一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_44%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[42rem]">
          {phase === "intro" ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="service-kicker">暮らしの困りごとチェック</p>
                <h1 className="display-serif text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.6rem]">
                  言葉にしにくい困りごとを、<br />
                  <span className="text-[#173B35]">関心の入口として整理する。</span>
                </h1>
                <p className="text-[15px] leading-8 text-[#5F5750]">
                  暮らし方、回復の仕方、身近なつながり、次に見たいテーマ。今の関心に近いものを選ぶと、次の入口を静かに整理できます。
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-5 shadow-[0_16px_36px_rgba(23,59,53,0.07)] space-y-3">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">この入口で確認すること</p>
                <ul className="space-y-2 text-[13px] leading-7 text-[#5F5750]">
                  <li>・今の関心テーマがどれに近いか</li>
                  <li>・情報がほしいのか、声を送りたいのか</li>
                  <li>・Community / Design につながる余地があるか</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={begin}
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] sm:w-auto"
              >
                関心を整理する
              </button>
            </div>
          ) : question ? (
            <div className="space-y-4">
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
                <div className="text-[11px] font-semibold tracking-[0.13em] text-[#6F625C]">{question.section}</div>
                <div className="mt-0.5 text-[14px] font-bold text-[#2F2A28]">
                  Q{currentIndex + 1} / {LOCAL_LIFE_QUESTIONS.length}
                </div>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/95 p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
                <p className="service-kicker">近いものをひとつ選んでください</p>
                <h2 className="display-serif text-[1.48rem] leading-[1.32] text-[#2F2A28] md:text-[2.1rem]">{question.prompt}</h2>
                <div className="grid gap-2.5">
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(option.id)}
                      className="rounded-[1rem] border border-[rgba(111,98,92,0.13)] bg-white/90 px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <span className="text-[15px] font-semibold leading-7 text-[#2F2A28]">{option.label}</span>
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
