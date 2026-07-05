"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import YorisouRecommendationSlot from "@/app/components/YorisouRecommendationSlot";
import { WORK_RHYTHM_QUESTIONS, getWorkRhythmResult } from "@/app/data/yorisouQuestionSets";
import { trackRecommendationSignal } from "@/app/components/YorisouSignalTracker";

type Phase = "intro" | "quiz" | "result";

const INTRO_PILLS = ["6問", "約2〜3分", "無料結果あり", "適職の断定ではありません"] as const;
const WHAT_YOU_GET = [
  "今の仕事リズムの方向",
  "動きやすい環境のヒント",
  "Select / Design につながる入口",
  "次に試せる小さな動き",
] as const;

export default function WorkRhythmFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultId, setResultId] = useState<string | null>(null);
  const trackedStartRef = useRef(false);

  const question = WORK_RHYTHM_QUESTIONS[currentIndex];
  const currentAnswer = question ? answers[question.id] || "" : "";
  const resultBundle = resultId ? getWorkRhythmResult(answers) : null;

  function begin() {
    if (!trackedStartRef.current) {
      trackedStartRef.current = true;
      void trackRecommendationSignal({
        source: "work_rhythm_flow",
        signalType: "test_started",
        testId: "work-rhythm",
        pagePath: "/tests/work-rhythm",
      });
    }
    setPhase("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setResultId(null);
  }

  function selectOption(optionId: string) {
    if (!question) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    if (currentIndex === WORK_RHYTHM_QUESTIONS.length - 1) {
      const nextResult = getWorkRhythmResult(nextAnswers).result;
      setResultId(nextResult.id);
      setPhase("result");
      void trackRecommendationSignal({
        source: "work_rhythm_flow",
        signalType: "test_completed",
        testId: "work-rhythm",
        resultId: nextResult.id,
        pagePath: "/tests/work-rhythm",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  function goBack() {
    if (currentIndex === 0) {
      setPhase("intro");
      return;
    }
    setCurrentIndex((index) => index - 1);
  }

  if (phase === "result" && resultBundle) {
    const result = resultBundle.result;

    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_44%,_#F3FAF6_100%)] text-[#2F2A28]">
        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-[42rem] space-y-6">
            <div className="space-y-2">
              <p className="service-kicker">仕事のリズム診断</p>
              <h1 className="display-serif text-[1.9rem] leading-[1.24] text-[#2F2A28] md:text-[2.5rem]">
                今の整理: 「{result.title}」
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

            <YorisouRecommendationSlot
              testId="work-rhythm"
              source="work_rhythm_flow"
              resultId={result.id}
              pagePath="/tests/work-rhythm"
              mode="immediate_result"
              title="この入口の次に試しやすいもの"
            />

            <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
              <p className="text-[12px] leading-7 text-[#7A7068]">
                この結果は、能力や適職を決めるものではありません。今の仕事リズムと、無理なく動きやすい形を見直すための入口です。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={begin}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5"
              >
                もう一度試す
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
              <div className="flex flex-wrap gap-1.5">
                {INTRO_PILLS.map((pill) => (
                  <span key={pill} className="inline-flex rounded-full border border-[rgba(23,59,53,0.14)] bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-[#5F5750]">
                    {pill}
                  </span>
                ))}
              </div>
              <div className="space-y-3">
                <p className="service-kicker">仕事のリズム診断</p>
                <h1 className="display-serif text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.6rem]">
                  進みやすい形を、<br />
                  <span className="text-[#173B35]">今の仕事リズムから軽く見る。</span>
                </h1>
                <p className="text-[15px] leading-8 text-[#5F5750]">
                  いまの感覚に近いものを選ぶと、動きやすい環境や次の整え方が短く見えてきます。
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-5 shadow-[0_16px_36px_rgba(23,59,53,0.07)] space-y-3">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">終わると見えること</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {WHAT_YOU_GET.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-[0.9rem] border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-3.5 py-2.5">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#173B35] text-[10px] text-white">✓</span>
                      <span className="text-[13px] font-semibold leading-6 text-[#315F50]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={begin}
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] sm:w-auto"
              >
                チェックを始める
              </button>
            </div>
          ) : question ? (
            <div className="space-y-4">
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.13em] text-[#6F625C]">{question.section}</div>
                    <div className="mt-0.5 text-[14px] font-bold text-[#2F2A28]">
                      Q{currentIndex + 1} / {WORK_RHYTHM_QUESTIONS.length}
                    </div>
                  </div>
                  <div className="rounded-full bg-[#EAF7F1] px-3 py-1 text-[12px] font-semibold text-[#315F50]">軽量チェック</div>
                </div>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/95 p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
                <div className="space-y-2">
                  <p className="service-kicker">今の感覚に近いものをひとつ選んでください</p>
                  <h2 className="display-serif text-[1.48rem] leading-[1.32] text-[#2F2A28] md:text-[2.1rem]">{question.prompt}</h2>
                </div>
                <div className="grid gap-2.5">
                  {question.options.map((option) => {
                    const selected = currentAnswer === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => selectOption(option.id)}
                        className={`rounded-[1rem] border px-4 py-3.5 text-left transition ${
                          selected
                            ? "border-[#173B35] bg-[#F3FAF6] shadow-[0_10px_22px_rgba(23,59,53,0.11)]"
                            : "border-[rgba(111,98,92,0.13)] bg-white/90 hover:-translate-y-0.5 hover:bg-white"
                        }`}
                      >
                        <span className="text-[15px] font-semibold leading-7 text-[#2F2A28]">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] px-4 text-[14px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
                >
                  戻る
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
