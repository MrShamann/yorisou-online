// Package 9 — server-rendered reveal sections (evidence grammar, limits,
// privacy, gentle actions). All content derives from the existing
// compatibility model; source types are labeled on-surface.
// AIX-2 — restyled to the dark "Living Intelligence" system; content and
// YRR-1 reveal behavior unchanged.
import type { ReactElement, ReactNode } from "react";
import { TraitConstellation } from "./TraitConstellation";
import {
  SOURCE_LABEL, COMPLETION_COPY, LIMITATION_COPY, AI_UNAVAILABLE_COPY,
  PRIVACY_COPY, DECLINE_ALL_COPY, type SourceType,
} from "./revealContent";

export function SourceChip({ type }: { type: SourceType }): ReactElement {
  const tone = type === "ANSWER_DERIVED" ? "#5ce6b4" : type === "LIMITATION" ? "#ecb765" : "#8fe9d0";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold"
      style={{ borderColor: `${tone}44`, color: tone, background: "rgba(18,22,20,0.7)" }}
    >
      <span aria-hidden style={{ width: 5, height: 5, borderRadius: 99, background: tone }} />
      {SOURCE_LABEL[type]}
    </span>
  );
}

export function EvidencePanel({ highlights }: { highlights: { label: string; text: string }[] }): ReactElement {
  return (
    <section aria-labelledby="evidence-h" className="aix2-panel space-y-3 p-5">
      <div className="flex items-center justify-between gap-2">
        <p id="evidence-h" className="aix2-eyebrow">どうしてこの結果?</p>
        <SourceChip type="ANSWER_DERIVED" />
      </div>
      <p className="text-[13px] leading-6 aix2-mut">
        あなたの回答に、つぎのような傾向が繰り返し見えました。ここに回答の内容そのものは表示されません。
      </p>
      <ul className="m-0 grid list-none gap-2 p-0">
        {highlights.map((h) => (
          <li key={`${h.label}:${h.text}`} className="rounded-[12px] border border-[var(--hair)] bg-[rgba(26,32,29,0.45)] px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-semibold text-[color:var(--jade-bright)]">{h.label}</p>
              <SourceChip type="RULE_BASED_INTERPRETATION" />
            </div>
            <p className="mt-1 text-[13px] leading-6 aix2-mut">{h.text}</p>
          </li>
        ))}
      </ul>
      <p className="text-[11.5px] leading-5 aix2-faint">{AI_UNAVAILABLE_COPY}</p>
    </section>
  );
}

export function ConstellationPanel({ centerLabel, highlights }: { centerLabel: string; highlights: { label: string; text: string }[] }): ReactElement {
  return (
    <section aria-labelledby="constellation-h" className="aix2-panel space-y-3 p-5">
      <p id="constellation-h" className="aix2-eyebrow">いま色の星座</p>
      <TraitConstellation centerLabel={centerLabel} traits={highlights} />
      <details>
        <summary className="cursor-pointer text-[12.5px] font-semibold text-[color:var(--jade-bright)]">リストでも読む</summary>
        <ul className="mt-2 grid list-none gap-1.5 p-0 text-[13px] leading-6 aix2-mut">
          {highlights.map((h) => (
            <li key={h.label}>・{h.label}：{h.text}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}

// CPV1 WS-A1: completion + method presentation (no confidence band, no
// "too few answers" claim). A valid 120/120 completion reads as complete.
export function LimitsPanel(): ReactElement {
  return (
    <section aria-labelledby="limits-h" className="aix2-panel space-y-2 p-5">
      <div className="flex items-center justify-between gap-2">
        <p id="limits-h" className="aix2-eyebrow">この結果について</p>
        <SourceChip type="LIMITATION" />
      </div>
      <p className="text-[13px] font-semibold leading-6 text-[color:var(--tx)]">{COMPLETION_COPY.statusComplete}</p>
      <p className="text-[12.5px] leading-6 aix2-faint">方式: {COMPLETION_COPY.methodVersion}</p>
      <p className="text-[13px] leading-6 aix2-mut">{COMPLETION_COPY.methodNote}</p>
      <ul className="m-0 grid list-none gap-1 p-0 text-[12.5px] leading-6 aix2-faint">
        {LIMITATION_COPY.map((line) => <li key={line}>・{line}</li>)}
      </ul>
    </section>
  );
}

export function PrivacyPanel(): ReactElement {
  return (
    <section aria-labelledby="privacy-h" className="aix2-panel space-y-2 p-5">
      <p id="privacy-h" className="aix2-eyebrow">プライバシーについて</p>
      <ul className="m-0 grid list-none gap-1 p-0 text-[12.5px] leading-6 aix2-mut">
        {PRIVACY_COPY.map((line) => <li key={line}>・{line}</li>)}
      </ul>
    </section>
  );
}

export function GentleActions({ children }: { children: ReactNode }): ReactElement {
  return (
    <section aria-labelledby="actions-h" className="aix2-panel space-y-3 p-5">
      <div className="flex items-center justify-between gap-2">
        <p id="actions-h" className="aix2-eyebrow">よければ、つぎの一歩</p>
        <SourceChip type="OPTIONAL_NEXT_ACTION" />
      </div>
      {children}
      <p className="text-[12.5px] leading-6 aix2-faint">{DECLINE_ALL_COPY}</p>
    </section>
  );
}
