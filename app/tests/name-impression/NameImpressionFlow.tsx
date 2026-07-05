"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import YorisouRecommendationSlot from "@/app/components/YorisouRecommendationSlot";
import { NAME_IMPRESSION_QUESTIONS, getNameImpressionResult } from "@/app/data/yorisouQuestionSets";
import { trackRecommendationSignal } from "@/app/components/YorisouSignalTracker";

type Phase = "intro" | "quiz" | "result";

export default function NameImpressionFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [displayName, setDisplayName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultId, setResultId] = useState<string | null>(null);
  const trackedStartRef = useRef(false);

  const question = NAME_IMPRESSION_QUESTIONS[currentIndex];
  const resultBundle = resultId ? getNameImpressionResult(answers) : null;

  function begin() {
    if (!trackedStartRef.current) {
      trackedStartRef.current = true;
      void trackRecommendationSignal({
        source: "name_impression_flow",
        signalType: "test_started",
        testId: "name-impression",
        pagePath: "/tests/name-impression",
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
    if (currentIndex === NAME_IMPRESSION_QUESTIONS.length - 1) {
      const nextResult = getNameImpressionResult(nextAnswers).result;
      setResultId(nextResult.id);
      setPhase("result");
      void trackRecommendationSignal({
        source: "name_impression_flow",
        signalType: "test_completed",
        testId: "name-impression",
        resultId: nextResult.id,
        pagePath: "/tests/name-impression",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  const introDisabled = displayName.trim().length === 0;

  if (phase === "result" && resultBundle) {
    const result = resultBundle.result;

    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_44%,_#F3FAF6_100%)] text-[#2F2A28]">
        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-[42rem] space-y-6">
            <div className="space-y-2">
              <p className="service-kicker">名前の印象チェック</p>
              <h1 className="display-serif text-[1.9rem] leading-[1.24] text-[#2F2A28] md:text-[2.5rem]">
                {displayName ? `${displayName}さんは、` : "今のあなたは、"}「{result.title}」
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
              testId="name-impression"
              source="name_impression_flow"
              resultId={result.id}
              pagePath="/tests/name-impression"
              mode="immediate_result"
              title="この入口の次に試しやすいもの"
            />

            <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
              <p className="text-[12px] leading-7 text-[#7A7068]">
                入力した名前そのものは保存されません。これは占いや相性判断ではなく、名前から受ける印象を通して今の見え方を振り返る小さな入口です。
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
              <div className="space-y-3">
                <p className="service-kicker">名前の印象チェック</p>
                <h1 className="display-serif text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.6rem]">
                  名前から受ける印象を、<br />
                  <span className="text-[#173B35]">今の見え方のヒントにする。</span>
                </h1>
                <p className="text-[15px] leading-8 text-[#5F5750]">
                  名前から受ける雰囲気をきっかけに、今の自分らしさの見え方を軽く整理します。運命や相性を占うものではありません。
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-5 shadow-[0_16px_36px_rgba(23,59,53,0.07)] space-y-3">
                <label className="block space-y-2">
                  <span className="text-[13px] font-semibold text-[#315F50]">呼ばれたい名前やニックネーム</span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="例: あや / Aya"
                    className="w-full rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-white px-4 py-3 text-[15px] text-[#2F2A28] outline-none transition focus:border-[#173B35]"
                  />
                </label>
                <p className="text-[12px] leading-6 text-[#7A7068]">入力した名前はこの端末上だけで使われ、送信されません。</p>
              </div>
              <button
                type="button"
                onClick={begin}
                disabled={introDisabled}
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] disabled:cursor-not-allowed disabled:bg-[rgba(111,98,92,0.26)] sm:w-auto"
              >
                印象を見てみる
              </button>
            </div>
          ) : question ? (
            <div className="space-y-4">
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
                <div className="text-[11px] font-semibold tracking-[0.13em] text-[#6F625C]">{question.section}</div>
                <div className="mt-0.5 text-[14px] font-bold text-[#2F2A28]">
                  Q{currentIndex + 1} / {NAME_IMPRESSION_QUESTIONS.length}
                </div>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/95 p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
                <p className="service-kicker">{displayName ? `${displayName}さんの今の見え方に近いものを選んでください` : "今の感覚に近いものを選んでください"}</p>
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
