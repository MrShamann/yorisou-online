"use client";

import { useMemo, useState } from "react";

import {
  buildFrictionLine,
  buildTrendLines,
  getOptionId,
  getOptionLabel,
  resolveRuleBasedResult,
} from "@/lib/yorisou-tests/scoring";
import { PrivateTestSave } from "../c02/C02PrivateSave";
import ShareResultActions from "@/app/components/share/ShareResultActions";
import ResultSupportPlan from "@/app/components/sr2/ResultSupportPlan";
import type { SupportPlanFamily } from "@/lib/sr1/supportPlan";
import type { RuleBasedRuntime } from "@/lib/yorisou-tests/types";
import {
  UnderstandShell,
  UnderstandPills,
  UnderstandKicker,
  UnderstandTitle,
  UnderstandLead,
  UnderstandProgress,
  UnderstandNote,
  UnderstandRelated,
} from "./UnderstandShell";

// AIX-3D-2 — rule-based public test flow (C02 / F01 / F02) on the shared calm
// branded-light Understand surface. Question/answer/scoring/save logic preserved
// verbatim from the prior implementation; only the presentation moved onto the
// shared UnderstandShell grammar. The former relationship-pair / name-pair /
// omikuji flows were divination-adjacent and not in the canonical catalogue;
// their routes (r01/r04/s01) now redirect to /tests, so those flows are removed.

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
      <UnderstandShell>
        <div className="space-y-6">
          <div className="space-y-2">
            <UnderstandKicker>{runtime.title}</UnderstandKicker>
            <h1 className="display-serif text-[1.92rem] leading-[1.24] text-[color:var(--yr-text)] md:text-[2.55rem]">
              {result.title}
            </h1>
            <UnderstandLead>{result.summary}</UnderstandLead>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)]">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[color:var(--yr-kicker)]">見えた傾向</p>
            <div className="mt-3 space-y-2.5">
              {trendLines.map((line) => (
                <div key={line} className="rounded-[1rem] border border-[var(--yr-hair)] bg-[var(--yr-panel-2)] px-4 py-3.5">
                  <p className="text-[14px] leading-7 text-[color:var(--yr-text)]">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <UnderstandNote label="気をつけたいこと" tone="accent">
            {buildFrictionLine(result)}
          </UnderstandNote>

          {runtime.paidPreviewCopy ? (
            <UnderstandNote label="深掘りで増えるもの">{runtime.paidPreviewCopy}</UnderstandNote>
          ) : null}

          <UnderstandNote tone="quiet">
            <span className="text-[color:var(--yr-text-faint)]">{runtime.boundaryNote}</span>
          </UnderstandNote>

          {/* SR-2 — the shared result→service surface: deterministic support plan +
              anonymous device-local save (parity with imairo /result) + feedback.
              Anonymous save no longer requires login; PrivateTestSave remains the
              optional cross-device account upgrade. */}
          <ResultSupportPlan
            family={runtime.testId.toLowerCase() as SupportPlanFamily}
            resultLabel={result.title}
            traits={trendLines}
            resultPath={`/tests/${runtime.slug}`}
            recognitionLine={result.summary}
          />

          {runtime.testId === "C02" || runtime.testId === "F01" || runtime.testId === "F02" ? (
            <PrivateTestSave testSlug={runtime.slug as "c02" | "f01" | "f02"} answers={answers} />
          ) : null}

          <ShareResultActions
            input={{
              testLabel: runtime.title,
              title: result.title,
              line: result.summary,
              traits: trendLines,
              seed: `${runtime.testId}:${result.title}`,
              url: `/tests/${runtime.slug}`,
            }}
            trackingTestId={runtime.slug}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={start}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--yr-accent)] bg-[var(--yr-accent)] px-5 text-[14px] font-semibold text-[color:var(--yr-accent-ink)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
            >
              もう一度試す
            </button>
          </div>

          <UnderstandRelated routes={runtime.relatedRoutes} />
        </div>
      </UnderstandShell>
    );
  }

  return (
    <UnderstandShell>
      {phase === "intro" ? (
        <div className="space-y-6">
          <UnderstandPills items={[`${runtime.questionCount}問`, runtime.estimatedTime, "無料結果あり"]} />
          <div className="space-y-3">
            <UnderstandKicker>{runtime.title}</UnderstandKicker>
            <UnderstandTitle>{runtime.introTitle}</UnderstandTitle>
            <UnderstandLead>{runtime.introDescription}</UnderstandLead>
          </div>
          <UnderstandNote label="境界メモ">{runtime.boundaryNote}</UnderstandNote>
          <button
            type="button"
            onClick={start}
            className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--yr-accent)] bg-[var(--yr-accent)] px-6 text-[16px] font-bold text-[color:var(--yr-accent-ink)] shadow-[0_18px_34px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B] sm:w-auto"
          >
            チェックを始める
          </button>
        </div>
      ) : question ? (
        <div className="space-y-4">
          <UnderstandProgress
            kicker={section?.title_jp ?? question.section}
            indexLabel={`Q${index + 1} / ${runtime.questions.length}`}
            percent={((index + 1) / runtime.questions.length) * 100}
            aside="ひとつずつ進む"
          />

          <div className="rounded-[1.35rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-5 shadow-[0_20px_42px_rgba(23,59,53,0.09)] space-y-4 md:p-6">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[color:var(--yr-kicker)]">今の感覚に近いものをひとつ選んでください</p>
            <h2 className="display-serif text-[1.48rem] leading-[1.32] text-[color:var(--yr-text)] md:text-[2.08rem]">
              {question.prompt_jp}
            </h2>
            <div className="grid gap-2.5">
              {question.options.map((option) => (
                <button
                  key={getOptionId(option)}
                  type="button"
                  onClick={() => select(getOptionId(option))}
                  className="rounded-[1rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:bg-[var(--yr-panel)]"
                >
                  <span className="text-[15px] font-semibold leading-7 text-[color:var(--yr-text)]">{getOptionLabel(option)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--yr-hair-2)] bg-[var(--yr-panel)] px-5 text-[13px] font-semibold text-[color:var(--yr-accent-text)] transition hover:-translate-y-0.5"
            >
              戻る
            </button>
          </div>
        </div>
      ) : null}
    </UnderstandShell>
  );
}
