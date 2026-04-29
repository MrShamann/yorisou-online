"use client";

type Locale = "ja" | "en";
type ResultLoopStep = "result" | "continue" | "companion" | "return";

type Props = {
  locale: Locale;
  currentStep: ResultLoopStep;
};

const copy = {
  ja: {
    title: "RESULT LOOP",
    summary: "結果を受け取ってから、次はひとつずつでいい。",
    steps: {
      result: "結果",
      continue: "つづき",
      companion: "3問",
      return: "返り道",
    },
  },
  en: {
    title: "RESULT LOOP",
    summary: "Once the result lands, the next steps only need to be one at a time.",
    steps: {
      result: "Result",
      continue: "Next",
      companion: "3Q",
      return: "Return",
    },
  },
} as const;

const ORDER: ResultLoopStep[] = ["result", "continue", "companion", "return"];

export default function ResultLoopMap({ locale, currentStep }: Props) {
  const t = copy[locale];
  const activeIndex = ORDER.indexOf(currentStep);

  return (
    <section className="rounded-[0.95rem] border border-[rgba(125,141,121,0.06)] bg-[rgba(255,252,247,0.34)] px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[9px] tracking-[0.2em] text-[var(--muted)]">{t.title}</div>
        <p className="max-w-[14rem] text-right text-[9px] leading-4 text-[var(--muted)]">{t.summary}</p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {ORDER.map((step, index) => {
          const active = step === currentStep;
          const completed = index < activeIndex;
          return (
            <div key={step} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    active || completed ? "bg-[rgba(114,132,109,0.86)]" : "bg-[rgba(125,141,121,0.18)]"
                  }`}
                />
                <div
                  className={`min-w-0 truncate text-[10px] tracking-[0.12em] ${
                    active ? "text-[var(--accent-sage-text)]" : "text-[var(--muted)]"
                  }`}
                >
                  {t.steps[step]}
                </div>
              </div>
              {index < ORDER.length - 1 ? <div className="h-px flex-1 bg-[rgba(125,141,121,0.08)]" /> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
