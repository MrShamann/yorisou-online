"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import {
  MODULE_VERSION,
  RF_QUESTIONS,
  computeRFResult,
  type AnswerMap,
  type RFResult,
} from "./data";
import ResultConversionCommunity from "../../components/ResultConversionCommunity";
import { RelationshipFatiguePrivateSave } from "./PrivateSaveAndNext";
import { trackOpenTestingEvent } from "@/app/components/OpenTestingTracker";
import { YorisouSymbol } from "@/app/components/YorisouLogo";

type Phase = "intro" | "quiz" | "result";
const AUTO_ADVANCE_MS = 320;

const INTRO_PILLS = ["24問", "約4〜6分", "無料結果あり", "医療的判定ではありません"] as const;

const WHAT_YOU_GET = [
  "疲れが出やすい場面",
  "守りたい距離のヒント",
  "戻りやすい形",
  "今日の小さな一歩",
] as const;

export default function RelationshipFatigueFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<RFResult | null>(null);
  const timerRef = useRef<number | null>(null);
  const resultStartedRef = useRef(false);

  const total = RF_QUESTIONS.length;
  const currentQ = RF_QUESTIONS[currentIndex];
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
    const r = computeRFResult(finalAnswers);
    setResult(r);
    setPhase("result");
    void trackOpenTestingEvent({
      eventName: "test_completed",
      route: "/tests/relationship-fatigue",
      source: "relationship-fatigue",
      resultId: r.archetypeId,
      testVersion: MODULE_VERSION,
    });
    void trackOpenTestingEvent({
      eventName: "result_viewed",
      route: "/tests/relationship-fatigue",
      source: "relationship-fatigue",
      resultId: r.archetypeId,
      testVersion: MODULE_VERSION,
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
    void trackOpenTestingEvent({
      eventName: "test_started",
      route: "/tests/relationship-fatigue",
      source: "relationship-fatigue",
      testVersion: MODULE_VERSION,
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
    return <ResultView result={result} answers={answers} onRetake={begin} />;
  }

  return (
    <main className="min-h-screen bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]">
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
                <p className="service-kicker">人間関係の疲れチェック</p>
                <h1 className="display-serif text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.6rem]">
                  会う・返す・合わせる。<br />
                  <span className="text-[var(--yorisou-color-primary-600)]">今の負担を、少し整理する。</span>
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
                      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--yorisou-color-primary-500)] text-[10px] text-white">✓</span>
                      <span className="text-[13px] font-semibold leading-6 text-[#315F50]">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[12px] leading-6 text-[#7A7068]">
                  ログインなしで最後まで進めます。回答が送信されるのは、結果を保存すると選んだときだけです。医療・専門的判断ではありません。
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={begin}
                  className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--yorisou-color-primary-500)] bg-[var(--yorisou-color-primary-500)] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--yorisou-color-primary-600)] sm:w-auto"
                >
                  チェックを始める
                </button>
                <p className="text-[12px] leading-7 text-[#7A7068]">
                  人間関係の結論や相手への判断を決めるものではありません。
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
                  <div className="rounded-full bg-[var(--yorisou-color-primary-50)] px-3 py-1 text-[12px] font-semibold text-[var(--yorisou-color-primary-700)]">
                    {answeredCount} / {total} 回答済み
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgba(23,59,53,0.1)]">
                  <div
                    className="h-full rounded-full bg-[var(--yorisou-color-primary-500)] transition-all"
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
                            ? "border-[var(--yorisou-color-primary-500)] bg-[var(--yorisou-color-primary-50)] shadow-[var(--yorisou-shadow-card)]"
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
                                ? "border-[var(--yorisou-color-primary-500)] bg-[var(--yorisou-color-primary-500)] text-white"
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
                    className="inline-flex min-h-[50px] w-[34%] items-center justify-center rounded-full border border-[var(--yorisou-color-neutral-200)] bg-[var(--yorisou-color-primary-50)] px-4 text-[14px] font-semibold text-[var(--yorisou-color-primary-700)] transition hover:-translate-y-0.5 sm:w-auto"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!currentAnswer}
                    className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-full bg-[var(--yorisou-color-primary-500)] px-4 text-[16px] font-bold text-white shadow-[var(--yorisou-shadow-raised)] transition hover:-translate-y-0.5 hover:bg-[var(--yorisou-color-primary-600)] disabled:cursor-not-allowed disabled:bg-[rgba(111,98,92,0.26)] disabled:shadow-none"
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

function ResultView({ result, answers, onRetake }: { result: RFResult; answers: AnswerMap; onRetake: () => void }) {
  const { archetype } = result;

  return (
    <main className="min-h-screen bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]">
      <div className="container py-8 md:py-14">
        <div className="mx-auto max-w-[42rem] space-y-5">

          {/* ── Section 1: Result Hero ── */}
          <div className="yorisou-reveal space-y-3 rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-card)] p-6 shadow-[var(--yorisou-shadow-card)] md:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-100)] px-3 py-1 text-[11px] font-bold text-[var(--yorisou-color-primary-700)]">
                チェック結果
              </span>
              <span className="inline-flex items-center gap-1 rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-neutral-100)] px-3 py-1 text-[11px] font-semibold text-[var(--yorisou-color-neutral-500)]">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="10" rx="2.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                この画面はあなたにだけ表示されています
              </span>
            </div>
            <h1 className="text-[1.62rem] font-bold leading-[1.3] text-[var(--yorisou-color-neutral-800)] md:text-[2.1rem]">
              {archetype.name}
            </h1>
            <p className="text-[15px] leading-8 text-[var(--yorisou-color-neutral-500)]">{archetype.body}</p>
            <p className="text-[12.5px] leading-6 text-[var(--yorisou-color-neutral-500)] opacity-90">
              これは今の状態を小さく整理した結果で、あなたという人を決めつけるものではありません。日や状況によって変わります。
            </p>
          </div>

          {/* Deep insight card */}
          <div className="yorisou-reveal-late rounded-[var(--yorisou-radius-card)] bg-[var(--yorisou-color-deep-900)] p-5 text-white md:p-6">
            <div className="flex items-center gap-2">
              <YorisouSymbol variant="white" size={20} breathing />
              <span className="text-[11px] font-bold tracking-[0.1em] text-white/70">見つかったこと</span>
            </div>
            <p className="mt-3 text-[14px] leading-8 text-white/92">{archetype.insight}</p>
          </div>

          {/* Three insights */}
          <div className="space-y-2.5">
            <p className="text-[12px] font-bold tracking-[0.08em] text-[var(--yorisou-color-neutral-500)]">今の整理 — 3つのポイント</p>
            {[
              { label: "疲れが出やすい場面", value: archetype.fatigueScene },
              { label: "守りたい距離", value: archetype.boundaryHint },
              { label: "戻りやすい形", value: archetype.recoveryHint },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-[var(--yorisou-radius-button)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-raised)] px-4 py-3.5"
              >
                <p className="text-[11px] font-bold tracking-[0.08em] text-[var(--yorisou-color-primary-600)]">{label}</p>
                <p className="mt-1 text-[14px] leading-7 text-[var(--yorisou-color-neutral-800)]">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Section 2: 今日の小さな一歩 ── */}
          <div className="rounded-[var(--yorisou-radius-card)] bg-[var(--yorisou-color-deep-800)] px-5 py-5 text-white">
            <p className="text-[11px] font-bold tracking-[0.1em] text-white/60">今日の小さな一歩</p>
            <p className="mt-2 text-[15.5px] font-bold leading-8">{archetype.nextStep}</p>
            <p className="mt-2 text-[12.5px] leading-6 text-white/70">
              短い時間でできることからで大丈夫です。今日はここまでにしても構いません。
            </p>
          </div>

          <p className="text-[13.5px] leading-7 text-[var(--yorisou-color-neutral-500)]">
            返信・予定・SNS・ひとり時間のうち、今日いちばん軽くできそうなものを一つ選んでみましょう。
          </p>

          {/* ── Sections 3–5: private save + one governed recommendation + return path ── */}
          <RelationshipFatiguePrivateSave answers={answers} archetypeId={result.archetypeId} />

          {/* Phase 2U: community + report + next checks */}
          <ResultConversionCommunity
            moduleId="relationship-fatigue"
            reportTeaser={archetype.reportTeaser}
          />

          {/* Safety note */}
          <div className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-white/70 px-5 py-4">
            <p className="text-[12px] leading-7 text-[var(--yorisou-color-neutral-500)]">
              この結果は医療・心理診断ではありません。人間関係の結論や相手への判断を決めるものでもありません。
              つらさが強い、長く続く、生活に影響している場合は、結果だけで抱え込まず、信頼できる人や確認済みの相談先につながることも選択肢です。
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Link
              href="/check-in"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-6 text-[15px] font-semibold text-[var(--yorisou-color-primary-700)] transition hover:bg-[var(--yorisou-color-primary-50)] sm:w-auto"
            >
              「今の自分」チェックも見る
            </Link>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[var(--yorisou-color-neutral-500)]">
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
