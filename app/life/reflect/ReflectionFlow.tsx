"use client";

import Link from "next/link";
import { useState } from "react";

import { reflectionQuestionsFor, type MemoryCandidate, type ReflectionField, type ReflectionMode } from "@/lib/life-os/contract";
import { lifePost, lifeFailureMessage } from "@/lib/life-os/client";
import MemoryConfirmation from "../MemoryConfirmation";
import { LIFE_OS_PRIVACY } from "@/lib/life-os/privacyCopy";

// OSF-1 — the guided reflection, in two modes: light (5 questions) and deep postmortem (7).
//
// One question per screen, the same rhythm as the Today check-in. The difference is that these
// answers are the person's own words rather than bounded choices, because "what happened" cannot be
// a list of options — and that is exactly why nothing here interprets them. The flow asks, stores
// what was typed, and offers to remember a sentence the person wrote. It never summarises them back.
//
// ONLY THE FIRST QUESTION IS REQUIRED. Every other screen can be skipped with 「とばす」 and the
// reflection still saves. Someone who wanted to write one line about a hard day should not have to
// answer the rest to keep it, and a flow that refuses to save until every box is full is a form.

type Props = { experienceId?: string; mode?: ReflectionMode };

export default function ReflectionFlow({ experienceId, mode = "light" }: Props) {
  // Light (5) or deep postmortem (7). Same table, same columns — see contract.ts for why they are
  // two acts rather than two versions of one.
  const REFLECTION_QUESTIONS = reflectionQuestionsFor(mode);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<ReflectionField, string>>>({});
  const [phase, setPhase] = useState<"asking" | "saving" | "done" | "failed">("asking");
  const [candidates, setCandidates] = useState<MemoryCandidate[]>([]);
  const [failure, setFailure] = useState<string>("");
  // PHASE D — the assistant. `draft` is never auto-applied: it sits beside the person's own text
  // until they choose it. `unavailable` is the ordinary case, because providers are off by default.
  const [draft, setDraft] = useState<{ draft: string; question: string | null } | null>(null);
  const [assistant, setAssistant] = useState<"idle" | "working" | "unavailable">("idle");

  const question = REFLECTION_QUESTIONS[index];
  const isLast = index === REFLECTION_QUESTIONS.length - 1;
  const canAdvance = question.fields
    .filter((entry) => entry.required)
    .every((entry) => (answers[entry.field] ?? "").trim().length > 0);

  function setValue(field: ReflectionField, next: string) {
    setAnswers((current) => ({ ...current, [field]: next }));
  }

  async function askAssistant() {
    setAssistant("working");
    const result = await lifePost<{ ok: boolean; draft?: { draft: string; question: string | null } }>(
      "assistant",
      { answers },
    );
    if (result.ok && result.data.ok && result.data.draft) {
      setDraft(result.data.draft);
      setAssistant("idle");
      return;
    }
    // Every failure path lands here, including a refused boundary violation. The person is told the
    // assistant is unavailable and continues; nothing they wrote is affected.
    setAssistant("unavailable");
  }

  async function submit(finalAnswers: Partial<Record<ReflectionField, string>>) {
    setPhase("saving");
    const result = await lifePost<{ id: string; memoryCandidates: MemoryCandidate[] }>("reflections", {
      ...finalAnswers,
      experienceId: experienceId ?? null,
      mode,
    });
    if (result.ok) {
      setCandidates(result.data.memoryCandidates ?? []);
      setPhase("done");
      return;
    }
    setFailure(lifeFailureMessage(result));
    setPhase("failed");
  }

  function advance() {
    if (isLast) {
      void submit(answers);
      return;
    }
    setIndex(index + 1);
  }

  if (phase === "done") {
    return (
      <div>
        <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          振り返り
        </p>
        <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
          書き終わりました。
        </h1>
        <p className="mt-4 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          この振り返りが{LIFE_OS_PRIVACY}
        </p>

        <MemoryConfirmation candidates={candidates} />

        <Link
          href="/life"
          className="mt-10 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          わたしの記録へ
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        {index + 1} / {REFLECTION_QUESTIONS.length}
      </p>
      <h1 className="mt-3 text-[22px] font-semibold leading-[1.6] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        {question.prompt}
      </h1>
      {/* BEFORE the first input, not after the last one. The disclosure used to appear only on the
          finished screen, which told people where their words had gone after they had already
          written them — the one moment it cannot inform a decision. */}
      {index === 0 && (
        <p className="mt-3 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
          ここに書いたものが{LIFE_OS_PRIVACY}
        </p>
      )}
      {question.help && (
        <p className="mt-2 text-[14px] leading-[1.9] text-[var(--pxr-text-muted)]">{question.help}</p>
      )}

      {question.fields.map((entry, position) => (
        <div key={entry.field} className={position === 0 ? "mt-6" : "mt-5"}>
          <label
            htmlFor={`reflection-${entry.field}`}
            // A single-input screen already has the question as its heading; a visible second label
            // would just repeat it. Where a screen holds two inputs they need distinguishing.
            className={
              question.fields.length === 1
                ? "sr-only"
                : "block text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]"
            }
          >
            {question.fields.length === 1 ? question.prompt : entry.label}
          </label>
          <textarea
            id={`reflection-${entry.field}`}
            value={answers[entry.field] ?? ""}
            onChange={(event) => setValue(entry.field, event.target.value)}
            maxLength={2000}
            rows={question.fields.length === 1 ? 6 : 4}
            disabled={phase === "saving"}
            className="mt-2 w-full rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-4 py-3 text-[16px] leading-[1.8] text-[var(--pxr-text-primary)]"
          />
        </div>
      ))}

      {/* The assistant is offered only on the last screen, and only once there is something to work
          with. It never runs on its own and never replaces what was typed. */}
      {isLast && Object.values(answers).some((v) => (v ?? "").trim().length > 0) && (
        <section className="mt-7 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4">
          <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            書いたことを整理する（任意）
          </h2>
          {draft ? (
            <>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.9] text-[var(--pxr-text-primary)]">
                {draft.draft}
              </p>
              {draft.question && (
                <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">{draft.question}</p>
              )}
              <p className="mt-3 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                これは案です。使うかどうかはあなたが決めます。
              </p>
              <button
                type="button"
                onClick={() => {
                  // Applying is explicit and only ever touches the last answer, appending — it does
                  // not overwrite anything the person wrote earlier.
                  setValue("next_time", `${answers.next_time ?? ""}${answers.next_time ? "\n" : ""}${draft.draft}`.trim());
                  setDraft(null);
                }}
                className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
              >
                この案を使う
              </button>
            </>
          ) : (
            <>
              <p className="mt-2 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
                書いた内容だけをもとに、読みやすく整理します。診断や決めつけはしません。
              </p>
              <button
                type="button"
                onClick={() => void askAssistant()}
                disabled={assistant === "working"}
                className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] border border-[var(--pxr-border-subtle)] px-5 text-[15px] text-[var(--pxr-text-primary)] disabled:text-[var(--pxr-text-muted)]"
              >
                {assistant === "working" ? "整理しています" : "整理してもらう"}
              </button>
              {assistant === "unavailable" && (
                <p className="mt-2 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                  いまは整理を利用できません。このまま書き終えられます。
                </p>
              )}
            </>
          )}
        </section>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={advance}
          disabled={!canAdvance || phase === "saving"}
          className="inline-flex min-h-[var(--pxr-touch-target)] items-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-7 text-[16px] font-semibold text-white disabled:opacity-60"
        >
          {phase === "saving" ? "保存しています" : isLast ? "書き終える" : "次へ"}
        </button>
        {!question.required && (
          <button
            type="button"
            onClick={advance}
            disabled={phase === "saving"}
            className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
          >
            とばす
          </button>
        )}
        {/* Finishing early is always available once the first answer exists — the remaining
            questions are an offer, not a queue to clear. */}
        {!isLast && index > 0 && (answers.what_happened ?? "").trim().length > 0 && (
          <button
            type="button"
            onClick={() => void submit(answers)}
            disabled={phase === "saving"}
            className="inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] text-[var(--pxr-text-muted)]"
          >
            ここまでで残す
          </button>
        )}
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={() => setIndex(index - 1)}
          disabled={phase === "saving"}
          className="mt-6 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[14px] text-[var(--pxr-text-muted)]"
        >
          ひとつ戻る
        </button>
      )}

      {phase === "failed" && (
        <p className="mt-6 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">{failure}</p>
      )}
    </div>
  );
}
