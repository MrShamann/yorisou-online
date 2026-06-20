"use client";

import { useState, useSyncExternalStore } from "react";

import { MvpCard } from "../components/MvpSurface";
import {
  readFeedbackRecord,
  saveFeedbackRecord,
  subscribeFeedbackRecord,
  type FeedbackSurface,
  type FeedbackValue,
} from "./feedbackState";

type FeedbackOption = {
  value: FeedbackValue;
  label: string;
};

const FEEDBACK_OPTIONS: FeedbackOption[] = [
  { value: "helpful", label: "役に立った" },
  { value: "somewhat-helpful", label: "少し役に立った" },
  { value: "not-sure-yet", label: "今はまだわからない" },
  { value: "not-a-fit", label: "あまり合わなかった" },
  { value: "want-to-revisit", label: "あとで見返したい" },
];

type LocalFeedbackConsentProps = {
  surface: FeedbackSurface;
  className?: string;
};

export default function LocalFeedbackConsent({
  surface,
  className = "",
}: LocalFeedbackConsentProps) {
  const storedRecord = useSyncExternalStore(subscribeFeedbackRecord, readFeedbackRecord, () => null);
  const [selectedValue, setSelectedValue] = useState<FeedbackValue | "">(storedRecord?.feedbackValue ?? "");

  const handleSubmit = () => {
    if (!selectedValue) {
      return;
    }

    saveFeedbackRecord({
      submittedAt: new Date().toISOString(),
      surface,
      feedbackValue: selectedValue,
      source: "local-browser",
      version: "v0.2",
      consentNoticeSeen: true,
    });
  };

  const isRecorded = Boolean(
    storedRecord && storedRecord.surface === surface && storedRecord.feedbackValue === selectedValue,
  );

  return (
    <MvpCard className={`space-y-5 ${className}`}>
      <div className="service-kicker">フィードバック</div>
      <div className="space-y-2">
        <p className="text-[15px] leading-8 text-[var(--text)]">この内容は役に立ちましたか。近いものを選んでください。</p>
        <p className="text-[13px] leading-7 text-[var(--muted)]">
          フィードバックは任意です。この端末内の簡易記録です。アカウント保存やLINE連携ではありません。
          個人を特定する情報は入力しないでください。診断ではなく、今の状態を見つめながら、あとで見返すための小さな記録です。
        </p>
      </div>
      <div className="grid gap-2">
        {FEEDBACK_OPTIONS.map((option) => {
          const id = `feedback-${surface}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-3 rounded-[1rem] border border-[rgba(201,211,195,0.72)] bg-[rgba(252,250,245,0.92)] px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/96"
            >
              <input
                id={id}
                type="radio"
                name={`feedback-${surface}`}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => setSelectedValue(option.value)}
                className="h-4 w-4 border-[color:var(--line-soft)] text-[var(--cta-main)]"
              />
              <span className="text-[14px] leading-7 text-[var(--text)]">{option.label}</span>
            </label>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          data-feedback-submit={surface}
          disabled={!selectedValue}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[1.1rem] border border-[var(--cta-main)] bg-[var(--cta-main)] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_14px_24px_rgba(47,35,33,0.13)] transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isRecorded ? "フィードバックを記録しました" : "この内容で記録する"}
        </button>
      </div>
      <div className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-3">
        <p className="text-[13px] leading-7 text-[var(--muted)]">
          {isRecorded
            ? "フィードバックを記録しました。これはこの端末内の簡易記録です。個人情報や回答内容は保存していません。"
            : "これはこの端末内の簡易記録です。個人情報や回答内容は保存していません。"}
        </p>
      </div>
    </MvpCard>
  );
}
