"use client";

import { useState } from "react";

const FEEDBACK_OPTIONS = [
  { value: "close", label: "近い" },
  { value: "mixed", label: "少し違う" },
  { value: "later", label: "あとで考える" },
] as const;

export default function ResultFeedbackPrompt() {
  const [selected, setSelected] = useState<(typeof FEEDBACK_OPTIONS)[number]["value"] | null>(null);

  return (
    <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[rgba(255,253,249,0.76)] p-4">
      <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">ひとこと反応</p>
      <p className="mt-2 text-[14px] leading-7 text-[#6F625C]">この結果、今の自分に近いですか？</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {FEEDBACK_OPTIONS.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              className="min-h-[44px] rounded-[0.95rem] border px-3 py-2 text-[13px] font-semibold transition active:scale-[0.98]"
              style={{
                borderColor: isSelected ? "rgba(73,97,91,0.24)" : "rgba(23,59,53,0.08)",
                background: isSelected ? "rgba(234,247,241,0.9)" : "rgba(255,255,255,0.72)",
                color: isSelected ? "#315F50" : "#6F625C",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-6 text-[#9A9088]">
        この反応はこの端末だけの表示で、まだ送信や集計はしていません。
      </p>
    </div>
  );
}
