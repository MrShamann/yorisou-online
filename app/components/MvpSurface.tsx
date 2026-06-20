import Link from "next/link";
import type { ReactNode } from "react";

type ActionTone = "primary" | "secondary" | "ghost";

type MvpActionLinkProps = {
  href: string;
  label: string;
  tone?: ActionTone;
  className?: string;
};

type MvpSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

type MvpFeedbackSignalProps = {
  title?: string;
  note?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
  className?: string;
};

type MvpRecognitionScaleOption = {
  value: string;
  label: string;
  hint: string;
};

type MvpRecognitionScaleProps = {
  title?: string;
  note?: string;
  name: string;
  options?: MvpRecognitionScaleOption[];
  className?: string;
};

const DEFAULT_RECOGNITION_OPTIONS: MvpRecognitionScaleOption[] = [
  { value: "fits-strongly", label: "かなり近い", hint: "しっくりくる" },
  { value: "fits-somewhat", label: "少し近い", hint: "おおむね合う" },
  { value: "fits-not-yet", label: "まだ違う", hint: "もう少し様子を見る" },
];

export function MvpCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[1.45rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.86)] p-4 shadow-[0_12px_28px_rgba(47,35,33,0.05)] sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function MvpPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[rgba(201,211,195,0.78)] bg-white/84 px-3 py-1.5 text-[11px] leading-5 tracking-[0.14em] text-[var(--accent-sage-text)]">
      {children}
    </span>
  );
}

export function MvpActionLink({ href, label, tone = "primary", className = "" }: MvpActionLinkProps) {
  const toneClass =
    tone === "primary"
      ? "bg-[var(--cta-main)] text-white shadow-[0_14px_24px_rgba(47,35,33,0.13)]"
      : tone === "ghost"
        ? "border-transparent bg-transparent text-[var(--accent-sage-text)]"
        : "border-[rgba(201,211,195,0.72)] bg-[rgba(252,250,245,0.9)] text-[var(--text)] shadow-[0_6px_14px_rgba(47,35,33,0.03)]";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-[48px] items-center justify-center rounded-[1.1rem] border px-4 py-3 text-[14px] font-semibold transition hover:-translate-y-0.5 hover:opacity-95 ${toneClass} ${className}`}
    >
      {label}
    </Link>
  );
}

export function MvpSection({ eyebrow, title, lead, actions, children, className = "" }: MvpSectionProps) {
  return (
    <section className={`section ${className}`}>
      <div className="container">
        <div className="grid gap-5">
          <div className="max-w-[48rem]">
            {eyebrow ? <p className="service-kicker">{eyebrow}</p> : null}
            <h2 className="display-serif mt-3 max-w-[16em] text-[1.7rem] leading-[1.62] md:text-[2.02rem]">{title}</h2>
            {lead ? <p className="mt-3 max-w-[42rem] text-[15px] leading-8 text-[var(--muted)]">{lead}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2.5">{actions}</div> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

export function MvpRecognitionScale({
  title = "軽い認識の反応",
  note = "ここでの選択は、あとで見直すための静かな反応です。送信はまだ行いません。",
  name,
  options = DEFAULT_RECOGNITION_OPTIONS,
  className = "",
}: MvpRecognitionScaleProps) {
  return (
    <MvpCard className={`space-y-4 ${className}`}>
      <div className="service-kicker">{title}</div>
      <p className="text-[14px] leading-7 text-[var(--muted)]">{note}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option, index) => {
          const id = `${name}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className="flex cursor-pointer flex-col gap-1 rounded-[1rem] border border-[rgba(201,211,195,0.72)] bg-[rgba(252,250,245,0.92)] px-3 py-3 transition hover:-translate-y-0.5 hover:bg-white/96"
            >
              <input id={id} type="radio" name={name} value={option.value} className="peer sr-only" defaultChecked={index === 1} />
              <span className="rounded-[0.85rem] border border-transparent px-2 py-1 text-[13px] font-semibold text-[var(--text)] peer-checked:border-[rgba(201,211,195,0.9)] peer-checked:bg-[rgba(225,232,219,0.72)] peer-checked:text-[var(--accent-sage-text)]">
                {option.label}
              </span>
              <span className="px-2 text-[11px] leading-5 tracking-[0.04em] text-[var(--muted)]">{option.hint}</span>
            </label>
          );
        })}
      </div>
    </MvpCard>
  );
}

export function MvpFeedbackSignal({
  title = "フィードバックの入口",
  note = "ここでの選択は、次に何を出すかを見直すための仮の入り口です。送信機能は段階的に整えます。",
  primaryHref = "/report-preview",
  primaryLabel = "この方向で進める",
  secondaryHref = "/recommendations",
  secondaryLabel = "おすすめを見る",
  tertiaryHref = "/methodology",
  tertiaryLabel = "考え方を見る",
  className = "",
}: MvpFeedbackSignalProps) {
  // TODO: wire feedback_submit analytics once the MVP event layer is approved.
  return (
    <MvpCard className={`space-y-4 ${className}`}>
      <div className="service-kicker">{title}</div>
      <p className="text-[15px] leading-8 text-[var(--muted)]">{note}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <MvpActionLink href={primaryHref} label={primaryLabel} />
        <MvpActionLink href={secondaryHref} label={secondaryLabel} tone="secondary" />
        <MvpActionLink href={tertiaryHref} label={tertiaryLabel} tone="ghost" />
      </div>
    </MvpCard>
  );
}
