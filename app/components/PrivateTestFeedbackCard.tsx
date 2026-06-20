"use client";

import { useState } from "react";

type Locale = "ja" | "en";

type FeedbackLabel =
  | "面白かった"
  | "ちょっと当たってる"
  | "よく分からない"
  | "友だちに送りたい"
  | "もう少し鋭くしてほしい";

type Props = {
  locale: Locale;
  personaId?: string | null;
  currentModeLabel?: string | null;
  surface?: "result" | "continue" | "return";
};

const COPY = {
  ja: {
    title: "ひとことフィードバック",
    body: "公開結果には残らず、私的なテスト用の記録だけに入ります。",
    success: "送信しました。ありがとう。",
    unavailable: "記録先が見つからなかったため、今回は送信できませんでした。",
    buttons: {
      "面白かった": "面白かった",
      "ちょっと当たってる": "ちょっと当たってる",
      "よく分からない": "よく分からない",
      "友だちに送りたい": "友だちに送りたい",
      "もう少し鋭くしてほしい": "もう少し鋭くしてほしい",
    } satisfies Record<FeedbackLabel, string>,
  },
  en: {
    title: "Private feedback",
    body: "This stays out of the public result and goes only to the private test record.",
    success: "Sent. Thank you.",
    unavailable: "No writable store was available, so nothing was recorded.",
    buttons: {
      "面白かった": "Fun",
      "ちょっと当たってる": "Feels accurate",
      "よく分からない": "Not clear",
      "友だちに送りたい": "Would share",
      "もう少し鋭くしてほしい": "Make it sharper",
    } satisfies Record<FeedbackLabel, string>,
  },
} as const;

const FEEDBACK_LABELS: FeedbackLabel[] = [
  "面白かった",
  "ちょっと当たってる",
  "よく分からない",
  "友だちに送りたい",
  "もう少し鋭くしてほしい",
];

export default function PrivateTestFeedbackCard({ locale, personaId = null, currentModeLabel = null, surface = "result" }: Props) {
  const t = COPY[locale];
  const [status, setStatus] = useState<string>("");
  const [busyLabel, setBusyLabel] = useState<FeedbackLabel | null>(null);

  async function submitFeedback(label: FeedbackLabel) {
    setBusyLabel(label);
    setStatus("");
    try {
      const response = await fetch("/api/dte/private-test-feedback", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          label,
          locale,
          personaId,
          currentModeLabel,
          surface,
          path: typeof window !== "undefined" ? window.location.pathname : null,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; stored?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "feedback_submission_failed");
      }

      setStatus(result.stored === false ? t.unavailable : t.success);
    } catch {
      setStatus(t.unavailable);
    } finally {
      setBusyLabel(null);
    }
  }

  return (
    <section className="rounded-[1.45rem] border border-[rgba(125,141,121,0.14)] bg-[rgba(255,252,247,0.92)] px-4 py-4 shadow-[0_10px_24px_rgba(47,35,33,0.05)]" data-private-feedback-card>
      <div className="text-[11px] tracking-[0.18em] text-[var(--muted)]">{t.title}</div>
      <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">{t.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {FEEDBACK_LABELS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => void submitFeedback(label)}
            disabled={busyLabel !== null}
            className="rounded-full border border-[rgba(125,141,121,0.18)] bg-white/82 px-3 py-2 text-[12px] font-medium leading-5 text-[var(--accent-sage-text)] transition hover:bg-[rgba(225,232,219,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t.buttons[label]}
          </button>
        ))}
      </div>
      {status ? <p className="mt-3 text-[12px] leading-5 text-[var(--muted)]">{status}</p> : null}
    </section>
  );
}
