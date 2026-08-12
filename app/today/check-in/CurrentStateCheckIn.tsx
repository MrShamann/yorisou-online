"use client";

import Link from "next/link";
import { useState } from "react";

import {
  INTENT_OPTIONS,
  STATE_OPTIONS,
  labelForIntent,
  labelForState,
  nextStepFor,
  reflectionFor,
  writeCurrentStateCheckIn,
  type IntentOptionId,
  type StateOptionId,
} from "@/lib/yorisou/today/currentStateCheckIn";

// 今の気配を見る — two bounded questions, then a reflection of exactly what was chosen.
//
// One question per screen, large targets, no login, no timer, no progress bar with a percentage.
// A person can leave after the first question and has lost nothing, because nothing is submitted
// anywhere: the record is written on completion, device-local, and only if the browser allows it.
//
// The result reflects the selections VERBATIM. It does not name a type, score a dimension, or say
// "you are" anything — see the module comment for why that boundary is absolute here.

type Step = "state" | "intent" | "done";

export default function CurrentStateCheckIn() {
  const [step, setStep] = useState<Step>("state");
  const [state, setState] = useState<StateOptionId | null>(null);
  const [intent, setIntent] = useState<IntentOptionId | null>(null);

  function chooseState(id: StateOptionId) {
    setState(id);
    setStep("intent");
  }

  function chooseIntent(id: IntentOptionId) {
    setIntent(id);
    writeCurrentStateCheckIn(state as StateOptionId, id);
    setStep("done");
  }

  if (step === "done" && state && intent) {
    const next = nextStepFor(intent);
    return (
      <div>
        <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          今の気配
        </p>
        {/* Reflection only: their words back, not our interpretation. */}
        <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
          {labelForState(state)}。<br />
          {labelForIntent(intent)}。
        </h1>
        <p className="mt-4 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          {reflectionFor(intent)}
        </p>

        <section className="mt-9">
          <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            今できること
          </h2>
          <Link
            href={next.href}
            className="mt-3 flex min-h-[var(--pxr-touch-target)] w-full items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 py-4 text-[16px] font-semibold text-white"
          >
            {next.label}
          </Link>
        </section>

        {/* The Deep Dive is an option here, never the default completion action. */}
        <section className="mt-9">
          <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
            もう少し深く見る
          </h2>
          <Link
            href="/tests/ima-iro"
            className="mt-3 flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
          >
            いま色テストを見る（120問）
          </Link>
        </section>

        <p className="mt-10 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
          この記録はこの端末にだけ保存されます。
        </p>
      </div>
    );
  }

  const isState = step === "state";
  const options = isState ? STATE_OPTIONS : INTENT_OPTIONS;

  return (
    <div>
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        {isState ? "1 / 2" : "2 / 2"}
      </p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        {isState ? "いま、どんな感じですか。" : "どうなるとよさそうですか。"}
      </h1>

      <ul className="mt-7 flex flex-col gap-2.5">
        {options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() =>
                isState
                  ? chooseState(option.id as StateOptionId)
                  : chooseIntent(option.id as IntentOptionId)
              }
              className="flex min-h-[var(--pxr-touch-target)] w-full items-center rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-4 text-left text-[16px] leading-[1.6] text-[var(--pxr-text-primary)]"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>

      {!isState && (
        <button
          type="button"
          onClick={() => setStep("state")}
          className="mt-6 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[14px] text-[var(--pxr-text-muted)]"
        >
          ひとつ戻る
        </button>
      )}
    </div>
  );
}
