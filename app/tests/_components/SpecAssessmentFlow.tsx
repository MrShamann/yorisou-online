"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  buildFrictionLine,
  buildTrendLines,
  getOptionId,
  getOptionLabel,
  pickSeededIndex,
  resolveRuleBasedResult,
  buildNamePairOffset,
} from "@/lib/yorisou-tests/scoring";
import { resolveR01Result } from "@/lib/yorisou-tests/r01";
import type {
  NamePairRuntime,
  OmikujiRuntime,
  RelationshipPairRuntime,
  RuleBasedRuntime,
} from "@/lib/yorisou-tests/types";

type Phase = "intro" | "questions" | "result";

export function RuleBasedTestFlow({ runtime }: { runtime: RuleBasedRuntime }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = runtime.questions[index];
  const section = runtime.sections.find((candidate) => candidate.id === question?.section);
  const result = useMemo(
    () => (phase === "result" ? resolveRuleBasedResult(runtime, answers) : null),
    [answers, phase, runtime],
  );

  function start() {
    setPhase("questions");
    setIndex(0);
    setAnswers({});
  }

  function select(optionId: string) {
    if (!question) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    if (index === runtime.questions.length - 1) {
      setAnswers(nextAnswers);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIndex((current) => current + 1);
  }

  function goBack() {
    if (index === 0) {
      setPhase("intro");
      return;
    }
    setIndex((current) => current - 1);
  }

  if (phase === "result" && result) {
    const trendLines = buildTrendLines(result);
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]">
        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-[44rem] space-y-6">
            <div className="space-y-2">
              <p className="service-kicker">{runtime.title}</p>
              <h1 className="display-serif text-[1.92rem] leading-[1.24] md:text-[2.55rem]">{result.title}</h1>
              <p className="text-[15px] leading-8 text-[#5F5750]">{result.summary}</p>
            </div>

            <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.12)] bg-white/92 p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)]">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">見えた傾向</p>
              <div className="mt-3 space-y-2.5">
                {trendLines.map((line) => (
                  <div key={line} className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-4 py-3.5">
                    <p className="text-[14px] leading-7 text-[#2F2A28]">{line}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-[rgba(138,119,100,0.14)] bg-[#FFFDF8] px-5 py-4">
              <p className="text-[13px] font-semibold text-[#6B5E55]">気をつけたいこと</p>
              <p className="mt-1 text-[13px] leading-7 text-[#6B5E55]">{buildFrictionLine(result)}</p>
            </div>

            {runtime.paidPreviewCopy ? (
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
                <p className="text-[12px] font-semibold tracking-[0.1em] text-[#49615B]">深掘りで増えるもの</p>
                <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">{runtime.paidPreviewCopy}</p>
              </div>
            ) : null}

            <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
              <p className="text-[12px] leading-7 text-[#7A7068]">{runtime.boundaryNote}</p>
            </div>

            <div className="rounded-[1.2rem] border border-[rgba(105,151,130,0.16)] bg-[#F7FBF8] px-5 py-4">
              <p className="text-[12px] font-semibold tracking-[0.1em] text-[#49615B]">シェア用の一行</p>
              <p className="mt-1 text-[14px] leading-7 text-[#2F2A28]">
                {runtime.shareLabel ? `${runtime.shareLabel}: ` : ""}
                {result.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={start}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5"
              >
                もう一度試す
              </button>
              <Link
                href="/tests"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
              >
                入口一覧に戻る
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {runtime.relatedRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/88 px-4 py-3 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem]">
          {phase === "intro" ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Pill>{runtime.questionCount}問</Pill>
                <Pill>{runtime.estimatedTime}</Pill>
                <Pill>無料結果あり</Pill>
              </div>
              <div className="space-y-3">
                <p className="service-kicker">{runtime.title}</p>
                <h1 className="display-serif whitespace-pre-line text-[2rem] leading-[1.22] md:text-[2.7rem]">
                  {runtime.introTitle}
                </h1>
                <p className="text-[15px] leading-8 text-[#5F5750]">{runtime.introDescription}</p>
              </div>
              <div className="rounded-[1.25rem] border border-[rgba(23,59,53,0.1)] bg-white/88 p-5">
                <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">境界メモ</p>
                <p className="mt-2 text-[13px] leading-7 text-[#5F5750]">{runtime.boundaryNote}</p>
              </div>
              <button
                type="button"
                onClick={start}
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 sm:w-auto"
              >
                チェックを始める
              </button>
            </div>
          ) : question ? (
            <div className="space-y-4">
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.13em] text-[#6F625C]">
                      {section?.title_jp ?? question.section}
                    </div>
                    <div className="mt-0.5 text-[14px] font-bold text-[#2F2A28]">
                      Q{index + 1} / {runtime.questions.length}
                    </div>
                  </div>
                  <div className="rounded-full bg-[#EAF7F1] px-3 py-1 text-[12px] font-semibold text-[#315F50]">
                    ひとつずつ進む
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgba(23,59,53,0.08)]">
                  <div
                    className="h-2 rounded-full bg-[#173B35]"
                    style={{ width: `${((index + 1) / runtime.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/95 p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
                <p className="service-kicker">今の感覚に近いものをひとつ選んでください</p>
                <h2 className="display-serif text-[1.48rem] leading-[1.32] md:text-[2.08rem]">
                  {question.prompt_jp}
                </h2>
                <div className="grid gap-2.5">
                  {question.options.map((option) => (
                    <button
                      key={getOptionId(option)}
                      type="button"
                      onClick={() => select(getOptionId(option))}
                      className="rounded-[1rem] border border-[rgba(111,98,92,0.13)] bg-white/90 px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <span className="text-[15px] font-semibold leading-7 text-[#2F2A28]">{getOptionLabel(option)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[13px] font-semibold text-[#315F50]"
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.14)] bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-[#5F5750]">
      {children}
    </span>
  );
}

export function RelationshipPairFlow({ runtime }: { runtime: RelationshipPairRuntime }) {
  const [phase, setPhase] = useState<"intro" | "A" | "swap" | "B" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [answersA, setAnswersA] = useState<Record<string, string>>({});
  const [answersB, setAnswersB] = useState<Record<string, string>>({});

  const questionsA = useMemo(
    () => runtime.questions.filter((question) => question.person === "A"),
    [runtime.questions],
  );
  const questionsB = useMemo(
    () => runtime.questions.filter((question) => question.person === "B"),
    [runtime.questions],
  );

  const participant =
    phase === "B" ? runtime.participants.find((entry) => entry.id === "B") : runtime.participants.find((entry) => entry.id === "A");
  const currentQuestions = phase === "B" ? questionsB : questionsA;
  const question = phase === "A" || phase === "B" ? currentQuestions[index] : null;
  const result = useMemo(
    () => (phase === "result" ? resolveR01Result(answersA, answersB) : null),
    [answersA, answersB, phase],
  );

  function start() {
    setAnswersA({});
    setAnswersB({});
    setIndex(0);
    setPhase("A");
  }

  function select(optionLabel: string) {
    if (!question) return;
    const updater = phase === "B" ? setAnswersB : setAnswersA;
    updater((current) => ({ ...current, [question.id]: optionLabel }));

    if (index === currentQuestions.length - 1) {
      setIndex(0);
      setPhase(phase === "A" ? "swap" : "result");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIndex((current) => current + 1);
  }

  function goBack() {
    if (phase === "A") {
      if (index === 0) {
        setPhase("intro");
        return;
      }
      setIndex((current) => current - 1);
      return;
    }

    if (phase === "B") {
      if (index === 0) {
        setPhase("swap");
        return;
      }
      setIndex((current) => current - 1);
    }
  }

  if (phase === "result" && result) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]">
        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-[44rem] space-y-6">
            <div className="flex flex-wrap gap-2">
              <Pill>ふたりの結果</Pill>
              <Pill>
                {result.confidence === "high"
                  ? "温度差は小さめ"
                  : result.confidence === "medium"
                    ? "差も含めて見える"
                    : "違いを言葉にすると活きる"}
              </Pill>
            </div>

            <div className="space-y-2">
              <p className="service-kicker">{runtime.title}</p>
              <h1 className="display-serif text-[1.92rem] leading-[1.24] md:text-[2.55rem]">{result.title}</h1>
              <p className="text-[15px] leading-8 text-[#5F5750]">{result.summary}</p>
            </div>

            <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.12)] bg-white/92 p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)]">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">見えた相性の軸</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.alignedLabels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex rounded-full border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-3 py-1.5 text-[12px] font-semibold text-[#315F50]"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid gap-3">
                {result.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-[#F7FBF8] px-4 py-3.5">
                    <p className="text-[14px] leading-7 text-[#2F2A28]">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            {result.gapSummary ? (
              <div className="rounded-[1.2rem] border border-[rgba(138,119,100,0.14)] bg-[#FFFDF8] px-5 py-4">
                <p className="text-[13px] font-semibold text-[#6B5E55]">差が出やすいところ</p>
                <p className="mt-1 text-[13px] leading-7 text-[#6B5E55]">{result.gapSummary}</p>
              </div>
            ) : null}

            <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
              <p className="text-[12px] font-semibold tracking-[0.1em] text-[#49615B]">{runtime.reportTeaserLabel}</p>
              <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">{result.reportTeaser}</p>
            </div>

            <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
              <p className="text-[12px] leading-7 text-[#7A7068]">{runtime.boundaryNote}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={start}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5"
              >
                もう一度ふたりで試す
              </button>
              <Link
                href="/tests"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
              >
                入口一覧に戻る
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {runtime.relatedRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/88 px-4 py-3 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem]">
          {phase === "intro" ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Pill>{runtime.questionCountPerPerson}問 × 2人</Pill>
                <Pill>{runtime.estimatedTime}</Pill>
                <Pill>公開結果のみ</Pill>
              </div>
              <div className="space-y-3">
                <p className="service-kicker">{runtime.title}</p>
                <h1 className="display-serif whitespace-pre-line text-[2rem] leading-[1.22] md:text-[2.7rem]">
                  {runtime.introTitle}
                </h1>
                <p className="text-[15px] leading-8 text-[#5F5750]">{runtime.introDescription}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {runtime.participants.map((entry) => (
                  <div key={entry.id} className="rounded-[1.1rem] border border-[rgba(23,59,53,0.1)] bg-white/88 px-5 py-4">
                    <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">{entry.label_jp}</p>
                    <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">{entry.intro_jp}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.25rem] border border-[rgba(23,59,53,0.1)] bg-white/88 p-5">
                <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">境界メモ</p>
                <p className="mt-2 text-[13px] leading-7 text-[#5F5750]">{runtime.boundaryNote}</p>
              </div>
              <button
                type="button"
                onClick={start}
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 sm:w-auto"
              >
                ふたりでチェックする
              </button>
            </div>
          ) : phase === "swap" ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="service-kicker">ひとり目の回答が終わりました</p>
                <h2 className="display-serif text-[1.9rem] leading-[1.26] md:text-[2.45rem]">
                  次は、ふたり目の 30 問です。
                </h2>
                <p className="text-[15px] leading-8 text-[#5F5750]">
                  ここまでの回答を表示したり比較したりはしません。端末をそのまま渡して、もうひとりにも近い感覚を選んでもらってください。
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.1)] bg-white/90 px-5 py-4">
                <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">安心メモ</p>
                <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
                  結果ではふたり全体の傾向だけを返し、片方の答えだけを責める材料として見せることはありません。
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIndex(0);
                    setPhase("B");
                  }}
                  className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5"
                >
                  ふたり目を始める
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIndex(questionsA.length - 1);
                    setPhase("A");
                  }}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
                >
                  ひとり目に戻る
                </button>
              </div>
            </div>
          ) : question && participant ? (
            <div className="space-y-4">
              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.13em] text-[#6F625C]">{participant.label_jp}</div>
                    <div className="mt-0.5 text-[14px] font-bold text-[#2F2A28]">
                      Q{index + 1} / {runtime.questionCountPerPerson}
                    </div>
                  </div>
                  <div className="rounded-full bg-[#EAF7F1] px-3 py-1 text-[12px] font-semibold text-[#315F50]">
                    全体 {phase === "A" ? index + 1 : runtime.questionCountPerPerson + index + 1} / {runtime.questionCountTotal}
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgba(23,59,53,0.08)]">
                  <div
                    className="h-2 rounded-full bg-[#173B35]"
                    style={{
                      width: `${(((phase === "A" ? 0 : runtime.questionCountPerPerson) + index + 1) / runtime.questionCountTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/95 p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
                <p className="service-kicker">{participant.intro_jp}</p>
                <h2 className="display-serif text-[1.48rem] leading-[1.32] md:text-[2.08rem]">{question.prompt}</h2>
                <div className="grid gap-2.5">
                  {question.options.map((option) => (
                    <button
                      key={`${question.id}:${option.label}`}
                      type="button"
                      onClick={() => select(option.label)}
                      className="rounded-[1rem] border border-[rgba(111,98,92,0.13)] bg-white/90 px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <span className="text-[15px] font-semibold leading-7 text-[#2F2A28]">{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[13px] font-semibold text-[#315F50]"
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

export function OmikujiFlow({ runtime }: { runtime: OmikujiRuntime }) {
  const [drawnIndex, setDrawnIndex] = useState<number | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const drawn = drawnIndex === null ? null : runtime.resultPool[drawnIndex];

  function draw() {
    const daySeed = new Date().toISOString().slice(0, 10);
    const extraSeed = runtime.optionalInputs.map((input) => inputs[input.id] ?? "").join("|");
    const index = pickSeededIndex(`${runtime.testId}:${daySeed}:${extraSeed}`, runtime.resultPool.length);
    setDrawnIndex(index);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem] space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Pill>{runtime.estimatedTime}</Pill>
              <Pill>48種の結果</Pill>
              <Pill>軽いリフレクション</Pill>
            </div>
            <p className="service-kicker">{runtime.title}</p>
            <h1 className="display-serif whitespace-pre-line text-[2rem] leading-[1.22] md:text-[2.7rem]">
              {runtime.introTitle}
            </h1>
            <p className="text-[15px] leading-8 text-[#5F5750]">{runtime.introDescription}</p>
          </div>

          <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/92 p-5 shadow-[0_16px_36px_rgba(23,59,53,0.07)] space-y-4">
            {runtime.optionalInputs.map((input) => (
              <label key={input.id} className="block space-y-2">
                <span className="text-[13px] font-semibold text-[#315F50]">{input.label_jp}</span>
                <select
                  value={inputs[input.id] ?? ""}
                  onChange={(event) =>
                    setInputs((current) => ({ ...current, [input.id]: event.target.value }))
                  }
                  className="w-full rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-white px-4 py-3 text-[15px] text-[#2F2A28] outline-none transition focus:border-[#173B35]"
                >
                  <option value="">選ばなくても大丈夫です</option>
                  {input.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <button
              type="button"
              onClick={draw}
              className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5"
            >
              今日の一枚を引く
            </button>
          </div>

          {drawn ? (
            <div className="space-y-5">
              <div className="rounded-[1.4rem] border border-[rgba(23,59,53,0.12)] bg-white/94 p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)]">
                <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">{drawn.fortune_level_jp}</p>
                <h2 className="display-serif mt-2 text-[1.72rem] leading-[1.28] md:text-[2.3rem]">{drawn.title_jp}</h2>
                <p className="mt-3 text-[15px] leading-8 text-[#5F5750]">{drawn.main_message_jp}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <InfoBlock label="今日のヒント" value={drawn.today_hint_jp} />
                  <InfoBlock label="避けたいこと" value={drawn.avoid_jp} />
                  <InfoBlock label="ラッキーアクション" value={drawn.lucky_action_jp} />
                  <InfoBlock label="ラッキーカラー" value={drawn.lucky_color_jp} />
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(105,151,130,0.16)] bg-[#F7FBF8] px-5 py-4">
                <p className="text-[12px] font-semibold tracking-[0.1em] text-[#49615B]">シェア用の一行</p>
                <p className="mt-1 text-[14px] leading-7 text-[#2F2A28]">{drawn.share_card_line_jp}</p>
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
                <p className="text-[12px] leading-7 text-[#7A7068]">{runtime.boundaryNote}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {runtime.relatedRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/88 px-4 py-3 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export function NamePairFlow({ runtime }: { runtime: NamePairRuntime }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [shareMode, setShareMode] = useState<"both" | "partner-hidden" | "both-hidden">("both");

  const result = resultIndex === null ? null : runtime.resultPool[resultIndex];

  function setValue(key: string, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  const yourName = (answers.your_name_or_nickname ?? "").trim();
  const partnerName = (answers.partner_name_or_nickname ?? "").trim();
  const canDraw = yourName.length > 0 && partnerName.length > 0;

  function resolveShareLine() {
    if (!result) return "";
    if (shareMode === "both-hidden") return result.share_card_line_jp.replaceAll("ふたり", "この組み合わせ");
    if (shareMode === "partner-hidden") return `${yourName}さんと相手の組み合わせ: ${result.share_card_line_jp}`;
    return `${yourName}さんと${partnerName}さん: ${result.share_card_line_jp}`;
  }

  function draw() {
    if (!canDraw) return;
    const inputSeed = runtime.inputs.map((input) => answers[input.id] ?? "").join("|");
    const offset = buildNamePairOffset(runtime, answers);
    const index = pickSeededIndex(`${runtime.testId}:${inputSeed}`, runtime.resultPool.length, offset);
    setResultIndex(index);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem] space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Pill>{runtime.estimatedTime}</Pill>
              <Pill>32種の結果</Pill>
              <Pill>名前は保存しません</Pill>
            </div>
            <p className="service-kicker">{runtime.title}</p>
            <h1 className="display-serif whitespace-pre-line text-[2rem] leading-[1.22] md:text-[2.7rem]">
              {runtime.introTitle}
            </h1>
            <p className="text-[15px] leading-8 text-[#5F5750]">{runtime.introDescription}</p>
          </div>

          <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.11)] bg-white/92 p-5 shadow-[0_16px_36px_rgba(23,59,53,0.07)] space-y-4">
            {runtime.inputs.map((input) =>
              input.type === "text" ? (
                <label key={input.id} className="block space-y-2">
                  <span className="text-[13px] font-semibold text-[#315F50]">{input.label_jp}</span>
                  <input
                    value={answers[input.id] ?? ""}
                    maxLength={input.max_length}
                    onChange={(event) => setValue(input.id, event.target.value)}
                    className="w-full rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-white px-4 py-3 text-[15px] text-[#2F2A28] outline-none transition focus:border-[#173B35]"
                  />
                  {input.guidance_jp ? (
                    <p className="text-[12px] leading-6 text-[#7A7068]">{input.guidance_jp}</p>
                  ) : null}
                </label>
              ) : (
                <label key={input.id} className="block space-y-2">
                  <span className="text-[13px] font-semibold text-[#315F50]">{input.label_jp}</span>
                  <select
                    value={answers[input.id] ?? ""}
                    onChange={(event) => setValue(input.id, event.target.value)}
                    className="w-full rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-white px-4 py-3 text-[15px] text-[#2F2A28] outline-none transition focus:border-[#173B35]"
                  >
                    <option value="">選ばなくても大丈夫です</option>
                    {input.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ),
            )}

            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[#315F50]">軽く答えてみる</p>
              <div className="grid gap-3">
                {runtime.optionalQuestions.map((question) => (
                  <div key={question.id} className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F7FBF8] px-4 py-4">
                    <p className="text-[14px] font-semibold leading-7 text-[#2F2A28]">{question.prompt_jp}</p>
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setValue(question.id, option.key)}
                          className={`rounded-[0.95rem] border px-3.5 py-2.5 text-left text-[13px] font-semibold transition ${
                            answers[question.id] === option.key
                              ? "border-[#173B35] bg-white text-[#173B35]"
                              : "border-[rgba(23,59,53,0.08)] bg-white/86 text-[#5F5750]"
                          }`}
                        >
                          {option.label_jp}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!canDraw}
              onClick={draw}
              className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[16px] font-bold text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[rgba(111,98,92,0.26)]"
            >
              相性を見てみる
            </button>
          </div>

          {result ? (
            <div className="space-y-5">
              <div className="rounded-[1.4rem] border border-[rgba(23,59,53,0.12)] bg-white/94 p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)]">
                <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">{result.compatibility_label_jp}</p>
                <h2 className="display-serif mt-2 text-[1.72rem] leading-[1.28] md:text-[2.3rem]">{result.title_jp}</h2>
                <p className="mt-3 text-[15px] leading-8 text-[#5F5750]">{result.main_message_jp}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <InfoBlock label="ふたりの強み" value={result.pair_strength_jp} />
                  <InfoBlock label="すれ違いやすい点" value={result.possible_gap_jp} />
                  <InfoBlock label="話してみる問い" value={result.one_question_to_talk_jp} />
                  <InfoBlock label="次につながる入口" value={result.r01_bridge_jp ?? result.c02_bridge_jp ?? runtime.relatedRoutes[0]?.label ?? ""} />
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(105,151,130,0.16)] bg-[#F7FBF8] px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShareMode("both")}
                    className={shareButtonClass(shareMode === "both")}
                  >
                    両方表示
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareMode("partner-hidden")}
                    className={shareButtonClass(shareMode === "partner-hidden")}
                  >
                    相手を隠す
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareMode("both-hidden")}
                    className={shareButtonClass(shareMode === "both-hidden")}
                  >
                    両方隠す
                  </button>
                </div>
                <p className="mt-3 text-[14px] leading-7 text-[#2F2A28]">{resolveShareLine()}</p>
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 px-5 py-4">
                <p className="text-[12px] leading-7 text-[#7A7068]">{runtime.boundaryNote}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {runtime.relatedRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/88 px-4 py-3 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-4 py-3.5">
      <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">{label}</p>
      <p className="mt-1 text-[14px] leading-7 text-[#2F2A28]">{value}</p>
    </div>
  );
}

function shareButtonClass(active: boolean) {
  return `inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
    active
      ? "bg-[#173B35] text-white"
      : "border border-[rgba(23,59,53,0.12)] bg-white text-[#315F50]"
  }`;
}
