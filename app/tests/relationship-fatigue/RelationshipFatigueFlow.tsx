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
import ShareResultActions from "@/app/components/share/ShareResultActions";

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
    <main className="yr-focus">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[42rem]">

          {/* ── INTRO ── */}
          {phase === "intro" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-1.5">
                {INTRO_PILLS.map((p) => (
                  <span
                    key={p}
                    className="inline-flex rounded-full border border-[var(--yr-hair-2)] bg-[var(--yr-panel)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--yr-text-mut)]"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <p className="service-kicker">人間関係の疲れチェック</p>
                <h1 className="display-serif text-[2rem] leading-[1.22] text-[color:var(--yr-text)] md:text-[2.6rem]">
                  会う・返す・合わせる。<br />
                  <span className="text-[color:var(--yr-accent-text)]">今の負担を、少し整理する。</span>
                </h1>
                <p className="text-[15px] leading-8 text-[color:var(--yr-text-mut)]">
                  今の感覚に近いものを、ひとつずつ選ぶだけです。答え終えると、今のあなたに近いチェック結果が表示されます。
                </p>
              </div>

              {/* 終わると見えること */}
              <div className="rounded-[1.35rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-5 shadow-[0_16px_36px_rgba(23,59,53,0.07)] space-y-3">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[color:var(--yr-kicker)]">終わると見えること</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {WHAT_YOU_GET.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-[0.9rem] border border-[var(--yr-hair)] bg-[var(--yr-panel-2)] px-3.5 py-2.5"
                    >
                      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--yr-accent)] text-[10px] text-[color:var(--yr-accent-ink)]">✓</span>
                      <span className="text-[13px] font-semibold leading-6 text-[color:var(--yr-accent-text)]">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[12px] leading-6 text-[color:var(--yr-text-faint)]">
                  ログインなしで最後まで進めます。回答が送信されるのは、結果を保存すると選んだときだけです。医療・専門的判断ではありません。
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={begin}
                  className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--yr-accent)] bg-[var(--yr-accent)] px-6 text-[16px] font-bold text-[color:var(--yr-accent-ink)] shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] sm:w-auto"
                >
                  チェックを始める
                </button>
                <p className="text-[12px] leading-7 text-[color:var(--yr-text-faint)]">
                  人間関係の結論や相手への判断を決めるものではありません。
                </p>
              </div>

              <div className="pt-2">
                <Link href="/" className="text-[13px] text-[color:var(--yr-kicker)] underline-offset-2 hover:underline">
                  ← トップに戻る
                </Link>
              </div>
            </div>
          )}

          {/* ── QUIZ ── */}
          {phase === "quiz" && currentQ && (
            <div className="space-y-4">
              {/* Progress header */}
              <div className="rounded-[1.2rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.13em] text-[color:var(--yr-text-faint)]">
                      {currentQ.section}
                    </div>
                    <div className="mt-0.5 text-[14px] font-bold text-[color:var(--yr-text)]">
                      Q{currentIndex + 1} / {total}
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--yr-panel-2)] px-3 py-1 text-[12px] font-semibold text-[color:var(--yr-accent-text)]">
                    {answeredCount} / {total} 回答済み
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgba(23,59,53,0.1)]">
                  <div
                    className="h-full rounded-full bg-[var(--yr-accent)] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="rounded-[1.35rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
                <div className="space-y-2">
                  <p className="service-kicker">今の感覚に近いものをひとつ選んでください</p>
                  <h2 className="display-serif text-[1.48rem] leading-[1.32] text-[color:var(--yr-text)] md:text-[2.1rem]">
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
                            ? "border-[var(--yr-accent)] bg-[var(--yr-panel-2)] shadow-[0_10px_22px_rgba(23,59,53,0.11)]"
                            : "border-[var(--yr-hair)] bg-[var(--yr-panel)] hover:-translate-y-0.5 hover:bg-[var(--yr-panel)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-[15px] font-semibold leading-7 text-[color:var(--yr-text)]">
                            {opt.label}
                          </span>
                          <span
                            className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                              selected
                                ? "border-[var(--yr-accent)] bg-[var(--yr-accent)] text-[color:var(--yr-accent-ink)]"
                                : "border-[var(--yr-hair)] bg-[var(--yr-panel)]"
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
              <div className="sticky bottom-0 z-20 -mx-4 border-t border-[var(--yr-hair)] bg-[rgba(251,250,246,0.96)] px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex min-h-[50px] w-[34%] items-center justify-center rounded-full border border-[rgba(105,151,130,0.22)] bg-[var(--yr-panel-2)] px-4 text-[14px] font-semibold text-[color:var(--yr-accent-text)] transition hover:-translate-y-0.5 sm:w-auto"
                  >
                    戻る
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!currentAnswer}
                    className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-full bg-[var(--yr-accent)] px-4 text-[16px] font-bold text-[color:var(--yr-accent-ink)] shadow-[0_16px_32px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] disabled:cursor-not-allowed disabled:bg-[rgba(111,98,92,0.26)] disabled:shadow-none"
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
    <main className="yr-focus">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[42rem] space-y-6">

          {/* Result header */}
          <div className="space-y-2">
            <p className="service-kicker">チェック結果 · 人間関係の疲れ</p>
            <h1 className="display-serif text-[1.9rem] leading-[1.24] text-[color:var(--yr-text)] md:text-[2.5rem]">
              今の整理:&nbsp;「{archetype.name}」
            </h1>
          </div>

          {/* Main result card */}
          <div className="rounded-[1.45rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)] space-y-4">
            <p className="text-[16px] leading-8 text-[color:var(--yr-text)]">
              今のあなたは、<strong>{archetype.fatigueScene}</strong>に負担が出やすい状態かもしれません。
              これは人間関係の結論ではなく、今の疲れ方を小さく整理するための結果です。
            </p>
            <p className="text-[15px] leading-8 text-[color:var(--yr-text-mut)]">
              {archetype.body}
            </p>
          </div>

          {/* Three insights */}
          <div className="space-y-2.5">
            <p className="text-[13px] font-semibold tracking-[0.1em] text-[color:var(--yr-kicker)]">今の整理 — 3つのポイント</p>
            {[
              { label: "疲れが出やすい場面", value: archetype.fatigueScene },
              { label: "守りたい距離", value: archetype.boundaryHint },
              { label: "戻りやすい形", value: archetype.recoveryHint },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-[1.1rem] border border-[var(--yr-hair)] bg-[var(--yr-panel-2)] px-4 py-3.5"
              >
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[color:var(--yr-kicker)]">{label}</p>
                <p className="mt-1 text-[14px] leading-7 text-[color:var(--yr-text)]">{value}</p>
              </div>
            ))}
          </div>

          {/* Next action */}
          <div className="rounded-[1.25rem] border border-[var(--yr-hair-2)] bg-[var(--yr-accent)] px-5 py-4 text-[color:var(--yr-accent-ink)]">
            <p className="text-[12px] font-semibold tracking-[0.1em] opacity-70">今日の小さな一歩</p>
            <p className="mt-1.5 text-[15px] font-semibold leading-7">{archetype.nextStep}</p>
          </div>

          {/* General next action line from spec */}
          <p className="text-[14px] leading-7 text-[color:var(--yr-text-mut)]">
            返信・予定・SNS・ひとり時間のうち、今日いちばん軽くできそうなものを一つ選んでみましょう。
          </p>

          {/* Phase 3B: private save + one governed recommendation + return loop */}
          <RelationshipFatiguePrivateSave answers={answers} archetypeId={result.archetypeId} />

          {/* Phase 2U: community + report + LINE + next checks */}
          <ResultConversionCommunity
            moduleId="relationship-fatigue"
            reportTeaser={archetype.reportTeaser}
          />

          {/* AIX-4: public-safe result share */}
          <ShareResultActions
            input={{
              testLabel: "人間関係の疲れチェック",
              title: archetype.name,
              line: archetype.body,
              traits: ["疲れが出やすい場面", "守りたい距離", "戻りやすい形"],
              seed: result.archetypeId,
              url: "/tests/relationship-fatigue",
            }}
            trackingTestId="relationship-fatigue"
          />

          {/* Safety note */}
          <div className="rounded-[1.25rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] px-5 py-4">
            <p className="text-[12px] leading-7 text-[color:var(--yr-text-faint)]">
              この結果は医療・心理診断ではありません。人間関係の結論や相手への判断を決めるものでもありません。
              つらさが強い、長く続く、生活に影響している場合は、結果だけで抱え込まず、信頼できる人や確認済みの相談先につながることも選択肢です。
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Link
              href="/check-in"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-[var(--yr-hair-2)] bg-[var(--yr-panel)] px-6 text-[15px] font-semibold text-[color:var(--yr-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--yr-panel-2)] sm:w-auto"
            >
              「今の自分」チェックも見る
            </Link>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[color:var(--yr-kicker)]">
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
