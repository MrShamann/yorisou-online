"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import {
  readRecommendationSignal,
  saveRecommendationSignal,
  subscribeRecommendationSignal,
  type RecommendationSignalValue,
} from "./recommendationSignalState";

type SignalOption = {
  value: RecommendationSignalValue;
  label: string;
  hint: string;
};

const SIGNAL_OPTIONS: SignalOption[] = [
  {
    value: "self-understanding-reading",
    label: "もう少し詳しく読む",
    hint: "あとで詳しく読みたい",
  },
  {
    value: "distance-and-relationships",
    label: "人との距離感を考えるヒント",
    hint: "関わり方を少し整理したい",
  },
  {
    value: "work-and-learning-rhythm",
    label: "仕事や学びのリズムを整えるヒント",
    hint: "日々の進め方を見直したい",
  },
  {
    value: "rest-and-recovery",
    label: "休み方や回復のヒント",
    hint: "整え直し方を知りたい",
  },
  {
    value: "none-right-now",
    label: "今は特にいらない",
    hint: "今はここまでで十分",
  },
];

export type RecommendationSignalOption = SignalOption;

export function getRecommendationSignalOptions() {
  return SIGNAL_OPTIONS;
}

type RecommendationSignalContext = {
  resultId?: string;
  overlayId?: string;
  confidenceBand?: "low" | "medium";
  payloadKey?: string;
};

export default function RecommendationSignalForm({
  options = SIGNAL_OPTIONS,
  resultContext,
}: {
  options?: SignalOption[];
  resultContext?: RecommendationSignalContext;
}) {
  const storedSignal = useSyncExternalStore(subscribeRecommendationSignal, readRecommendationSignal, () => null);
  const [selectedSignal, setSelectedSignal] = useState<RecommendationSignalValue | "">(
    storedSignal?.selectedSignal ?? "",
  );
  const resolvedSelectedSignal = selectedSignal || storedSignal?.selectedSignal || "";

  const selectedOption = useMemo(
    () => options.find((option) => option.value === resolvedSelectedSignal) ?? null,
    [options, resolvedSelectedSignal],
  );

  const handleSubmit = () => {
    if (!resolvedSelectedSignal) {
      return;
    }

    saveRecommendationSignal({
      submittedAt: new Date().toISOString(),
      selectedSignal: resolvedSelectedSignal,
      source: "local-browser",
      version: "v0.2",
      path: "/recommendations",
      ...(resultContext?.resultId ? { resultId: resultContext.resultId } : {}),
      ...(resultContext?.overlayId ? { overlayId: resultContext.overlayId } : {}),
      ...(resultContext?.confidenceBand ? { confidenceBand: resultContext.confidenceBand } : {}),
      ...(resultContext?.payloadKey ? { payloadKey: resultContext.payloadKey } : {}),
    });
  };

  return (
    <div className="aix2-glass space-y-3.5 p-4 md:p-5">
      <div className="aix2-eyebrow">この方向を記録する</div>
      <p className="text-[13px] leading-7 aix2-mut">
        どちらを先に見たいかを、この端末に静かに残せます。たくさん選ぶ場所ではありません。
      </p>
      <div className="grid gap-1.5 lg:grid-cols-2">
        {options.map((option) => {
          const id = `recommendation-signal-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className="aix2-answer flex cursor-pointer flex-col gap-0.5 !py-2.5"
              data-selected={selectedSignal === option.value ? "true" : undefined}
            >
              <input
                id={id}
                type="radio"
                name="recommendation-signal"
                value={option.value}
                checked={resolvedSelectedSignal === option.value}
                onChange={() => setSelectedSignal(option.value)}
                className="sr-only"
              />
              <span className="text-[13px] font-semibold leading-5 text-[color:var(--tx)]">{option.label}</span>
              <span className="text-[11px] leading-5 aix2-mut">{option.hint}</span>
            </label>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          data-recommendation-signal="submit"
          disabled={!resolvedSelectedSignal}
          className="aix2-btn aix2-btn-primary !min-h-[50px] !text-[15px] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {storedSignal && storedSignal.selectedSignal === resolvedSelectedSignal && selectedOption
            ? "記録しました"
            : "選んだ方向を記録する"}
        </button>
      </div>
      <div className="rounded-[0.95rem] border border-[var(--hair)] bg-[rgba(16,20,18,0.6)] px-4 py-2.5">
        <p className="text-[12px] leading-6 aix2-faint">
          {storedSignal && storedSignal.selectedSignal === resolvedSelectedSignal && selectedOption
            ? "この端末内の簡易記録です。"
            : "あとで見返すための簡易記録です。"}
        </p>
      </div>
    </div>
  );
}
