"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import {
  LD_QUESTIONS,
  computeLDResult,
  type AnswerMap,
  type LDResult,
} from "./data";
import YorisouCompanionCard from "@/app/components/YorisouCompanionCard";
import YorisouRecommendationSlot from "@/app/components/YorisouRecommendationSlot";
import ResultConversionCommunity from "../../components/ResultConversionCommunity";
import { trackRecommendationSignal } from "@/app/components/YorisouSignalTracker";

type Phase = "intro" | "quiz" | "result";
const AUTO_ADVANCE_MS = 320;

const INTRO_PILLS = ["18問", "約3〜5分", "無料結果あり", "医療的判定ではありません"] as const;

const WHAT_YOU_GET = [
  "今の距離感のパターン",
  "待つ時間の負担ヒント",
  "伝える前に整えること",
  "今日の小さな一歩",
] as const;

export default function LoveDistanceFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<LDResult | null>(null);
  const timerRef = useRef<number | null>(null);
  const resultStartedRef = useRef(false);

  const total = LD_QUESTIONS.length;
  const currentQ = LD_QUESTIONS[currentIndex];
  const currentAnswer = currentQ ? answers[currentQ.id] ?? "" : "";
  const progress = ((currentIndex + 1) / total) * 100;
  const answeredCount = Object.keys(answers).filter((k) => Boolean(answers[k])).length;

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function finishQuiz(finalAnswers: AnswerMap) {
    if (resultStartedRef.current) return;
    resultStartedRef.current = true;
    const r = computeLDResult(finalAnswers);
    setResult(r);
    setPhase("result");
    void trackRecommendationSignal({
      source: "love_distance_flow",
      signalType: "test_completed",
      testId: "love-distance",
      resultId: r.archetypeId,
      pagePath: "/tests/love-distance",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceAfterSelect(nextAnswers: AnswerMap) {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      if (currentIndex === total - 1) {
        finishQuiz(nextAnswers);
      } else {
        setCurrentIndex((i) => Math.min(i + 1, total - 1));
      }
    }, AUTO_ADVANCE_MS);
  }

  function begin() {
    clearTimer();
    resultStartedRef.current = false;
    setAnswers({});
    setCurrentIndex(0);
    setPhase("quiz");
    void trackRecommendationSignal({
      source: "love_distance_flow",
      signalType: "test_started",
      testId: "love-distance",
      pagePath: "/tests/love-distance",
    });
  }

  function selectOption(optId: string) {
    if (!currentQ) return;
    const next = { ...answers, [currentQ.id]: optId };
    setAnswers(next);
    advanceAfterSelect(next);
  }

  function goBack() {
    clearTimer();
    if (currentIndex === 0) {
      setPhase("intro");
    } else {
      setCurrentIndex((i) => i - 1);
    }
  }

  function goNext() {
    if (!currentQ || !currentAnswer) return;
    clearTimer();
    if (currentIndex === total - 1) {
      finishQuiz(answers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (phase === "result" && result) {
    return <ResultView result={result} onRetake={begin} />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_44%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[42rem]">

          {/* ── INTRO ── */}
          {phase === "intro" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-1.5">
                {INTRO_PILLS.map((p) => (
                  <span
                    key={p}
                    className="inline-flex rounded-full border border-[rgba(23,59,53,0.14)] bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-[#5F5750]"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <p className="service-kicker">恋愛距離感チェック</p>
                <h1 className="display-serif text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.6rem]">
                  近づきたい、待っている、<br />
                  <span className="text-[#173B35]">今の距離感を、少し整理する。</span>
                </h1>
                <p className="text-[15px] leading-8 text-[#5F5750]">
                  今の感覚に近いものを、ひとつずつ選ぶだけです。答え終えると、今のあなたに近いチェック結果が表示されます。
                </p>
              </div>

              {/* 終わると見えること */}
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-5 shadow-[0_16px_36px_rgba(23,59,53,0.07)] space-y-3">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">終わると見えること</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {WHAT_YOU_GET.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-[0.9rem] border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-3.5 py-2.5"
                    >
                      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#173B35] text-[10px] text-white">✓</span>
                      <span className="text-[13px] font-semibold leading-6 text-[#315F50]">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[12px] leading-6 text-[#7A7068]">
                  ログインなし。回答は送信されません。相手の気持ちや関係の結論を判断するものではありません。
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={begin}
                  className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] sm:w-auto"
                >
                  チェックを始める
                </button>
                <p className="text-[12px] leading-7 text-[#7A7068]">
                  連絡する・告白する・別れる・復縁するなどの判断を決めるものではありません。
                </p>
              </div>

              <div className="pt-2">
                <Link href="/" className="text-[13px] text-[#49615B] underline-offset-2 hover:underline">
                  ← トップに戻る
                </Link>
              </div>
            </div>
          )}

          {/* ── QUIZ ── */}
          {phase === "quiz" && currentQ && (
            <div className="space-y-4">
              {/* Progress header */}
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.13em] text-[#6F625C]">
                      {currentQ.section}
                    </div>
                    <div className="mt-0.5 text-[14px] font-bold text-[#2F2A28]">
                      Q{currentIndex + 1} / {total}
                    </div>
                  </div>
                  <div className="rounded-full bg-[#EAF7F1] px-3 py-1 text-[12px] font-semibold text-[#315F50]">
                    {answeredCount} / {total} 回答済み
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgba(23,59,53,0.1)]">
                  <div
                    className="h-full rounded-full bg-[#173B35] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/95 p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
                <div className="space-y-2">
                  <p className="service-kicker">今の感覚に近いものをひとつ選んでください</p>
                  <h2 className="display-serif text-[1.48rem] leading-[1.32] text-[#2F2A28] md:text-[2.1rem]">
                    {currentQ.prompt}
                  </h2>
                </div>

                <div className="grid gap-2.5">
                  {currentQ.options.map((opt) => {
                    const selected = currentAnswer === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectOption(opt.id)}
                        className={`rounded-[1rem] border px-4 py-3.5 text-left transition ${
                          selected
                            ? "border-[#173B35] bg-[#F3FAF6] shadow-[0_10px_22px_rgba(23,59,53,0.11)]"
                            : "border-[rgba(111,98,92,0.13)] bg-white/90 hover:-translate-y-0.5 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-[15px] font-semibold leading-7 text-[#2F2A28]">
                            {opt.label}
                          </span>
                          <span
                            className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                              selected
                                ? "border-[#173B35] bg-[#173B35] text-white"
                                : "border-[rgba(201,211,195,0.8)] bg-white"
                            }`}
                          >
                            {selected ? "✓" : ""}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nav */}
              <div className="sticky bottom-0 z-20 -mx-4 border-t border-[rgba(23,59,53,0.09)] bg-[rgba(255,249,242,0.96)] px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex min-h-[50px] w-[34%] items-center justify-center rounded-full border border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] px-4 text-[14px] font-semibold text-[#315F50] transition hover:-translate-y-0.5 sm:w-auto"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!currentAnswer}
                    className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-full bg-[#173B35] px-4 text-[16px] font-bold text-white shadow-[0_16px_32px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] disabled:cursor-not-allowed disabled:bg-[rgba(111,98,92,0.26)] disabled:shadow-none"
                  >
                    {currentIndex === total - 1 ? "チェック結果へ" : "すぐ次へ"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

function ResultView({ result, onRetake }: { result: LDResult; onRetake: () => void }) {
  const { archetype, repeatedCheckCount, unsafePressureCount } = result;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_44%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[42rem] space-y-6">

          {/* Result header */}
          <div className="space-y-2">
            <p className="service-kicker">チェック結果 · 恋愛距離感</p>
            <h1 className="display-serif text-[1.9rem] leading-[1.24] text-[#2F2A28] md:text-[2.5rem]">
              今の整理:&nbsp;「{archetype.name}」
            </h1>
          </div>

          {/* Main result card */}
          <div className="rounded-[1.45rem] border border-[rgba(23,59,53,0.12)] bg-white/92 p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)] space-y-4">
            <p className="text-[16px] leading-8 text-[#2F2A28]">
              今のあなたは、<strong>{archetype.title}</strong>かもしれません。
              これは相手の気持ちや関係の結論を示すものではなく、今の自分の距離感を整理するための結果です。
            </p>
            <p className="text-[15px] leading-8 text-[#5F5750]">
              {archetype.body}
            </p>
          </div>

          {/* Three insights */}
          <div className="space-y-2.5">
            <p className="text-[13px] font-semibold tracking-[0.1em] text-[#49615B]">今の整理 — 3つのポイント</p>
            {[
              { label: "今の距離感", value: archetype.distanceHint },
              { label: "待ち方の負担", value: archetype.waitingHint },
              { label: "伝える前に整えたいこと", value: archetype.communicationHint },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-[1.1rem] border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-4 py-3.5"
              >
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[#49615B]">{label}</p>
                <p className="mt-1 text-[14px] leading-7 text-[#2F2A28]">{value}</p>
              </div>
            ))}
          </div>

          {/* Next action */}
          <div className="rounded-[1.25rem] border border-[rgba(23,59,53,0.14)] bg-[#173B35] px-5 py-4 text-white">
            <p className="text-[12px] font-semibold tracking-[0.1em] opacity-70">今日の小さな一歩</p>
            <p className="mt-1.5 text-[15px] font-semibold leading-7">{archetype.nextStep}</p>
          </div>

          {/* General next action line */}
          <p className="text-[14px] leading-7 text-[#5F5750]">
            今日は、関係の答えを出さずに「今の自分は何を整えたいか」を一つだけ選んでみましょう。
          </p>

          {/* Repeated-check warning */}
          {repeatedCheckCount >= 2 && (
            <div className="rounded-[1.15rem] border border-[rgba(180,120,60,0.18)] bg-[#FFF7EC]/80 px-5 py-4">
              <p className="text-[13px] font-semibold text-[#7A4E20]">チェックを繰り返したいと感じているかたへ</p>
              <p className="mt-1.5 text-[13px] leading-7 text-[#6B4E3F]">
                同じテーマを何度も確認したくなるときは、チェックを続けるほど不安が強くなることがあります。今日は結果を増やすより、少し時間を置いて自分の安心を優先してみてください。
              </p>
            </div>
          )}

          {/* Unsafe-pressure warning */}
          {unsafePressureCount >= 1 && (
            <div className="rounded-[1.15rem] border border-[rgba(180,60,60,0.15)] bg-[#FFF5F5]/80 px-5 py-4">
              <p className="text-[13px] font-semibold text-[#7A2020]">行動を急ぎたい気持ちが強いかたへ</p>
              <p className="mt-1.5 text-[13px] leading-7 text-[#6B3030]">
                相手に何度も確認したい、急がせたい気持ちが強いときは、いったん行動を止めることが大切です。このチェックは、相手を動かすためではなく、自分を落ち着かせるためのものです。
              </p>
            </div>
          )}

          {/* Phase 2U: community + report + LINE + next checks */}
          <ResultConversionCommunity
            moduleId="love-distance"
            reportTeaser={archetype.reportTeaser}
          />

          <YorisouCompanionCard
            testId="love-distance"
            source="love_distance_flow"
            resultId={archetype.id}
            pagePath="/tests/love-distance"
            mode="immediate_result"
          />

          <YorisouRecommendationSlot
            testId="love-distance"
            source="love_distance_flow"
            resultId={archetype.id}
            pagePath="/tests/love-distance"
            mode="immediate_result"
            title="もう少し整理したいときは"
          />

          {/* Safety note */}
          <div className="rounded-[1.25rem] border border-[rgba(23,59,53,0.08)] bg-white/60 px-5 py-4">
            <p className="text-[12px] leading-7 text-[#7A7068]">
              この結果は、相手の本心や関係の結論を判断するものではありません。連絡する、告白する、別れる、復縁する、結婚するなどの判断は、この結果だけで決めないでください。
              つらさが強い場合は、信頼できる人や確認済みの相談先につながることも選択肢です。
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Link
              href="/tests/relationship-fatigue"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-[rgba(23,59,53,0.22)] bg-white px-6 text-[15px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6] sm:w-auto"
            >
              「人間関係の疲れ」チェックも見る
            </Link>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#49615B]">
              <button
                type="button"
                onClick={onRetake}
                className="underline-offset-2 hover:underline"
              >
                もう一度チェックする
              </button>
              <Link href="/" className="underline-offset-2 hover:underline">
                ← トップに戻る
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
