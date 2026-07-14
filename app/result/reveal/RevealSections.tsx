// Package 9 — server-rendered reveal sections (evidence grammar, limits,
// privacy, gentle actions). All content derives from the existing
// compatibility model; source types are labeled on-surface.
import type { ReactElement, ReactNode } from "react";
import { TraitConstellation } from "./TraitConstellation";
import {
  SOURCE_LABEL, CONFIDENCE_COPY, LIMITATION_COPY, AI_UNAVAILABLE_COPY,
  PRIVACY_COPY, DECLINE_ALL_COPY, type SourceType,
} from "./revealContent";

export function SourceChip({ type }: { type: SourceType }): ReactElement {
  const tone = type === "ANSWER_DERIVED" ? "#4D7A69" : type === "LIMITATION" ? "#8A6D3B" : "#49615B";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold"
      style={{ borderColor: `${tone}44`, color: tone, background: "rgba(255,255,255,0.7)" }}
    >
      <span aria-hidden style={{ width: 5, height: 5, borderRadius: 99, background: tone }} />
      {SOURCE_LABEL[type]}
    </span>
  );
}

export function EvidencePanel({ highlights }: { highlights: { label: string; text: string }[] }): ReactElement {
  return (
    <section aria-labelledby="evidence-h" className="surface-panel-soft space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p id="evidence-h" className="surface-meta">どうしてこの結果?</p>
        <SourceChip type="ANSWER_DERIVED" />
      </div>
      <p className="text-[13px] leading-6 text-[#7A7068]">
        あなたの回答に、つぎのような傾向が繰り返し見えました。ここに回答の内容そのものは表示されません。
      </p>
      <ul className="m-0 grid list-none gap-2 p-0">
        {highlights.map((h) => (
          <li key={`${h.label}:${h.text}`} className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/80 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-semibold text-[#49615B]">{h.label}</p>
              <SourceChip type="RULE_BASED_INTERPRETATION" />
            </div>
            <p className="mt-1 text-[13px] leading-6 text-[#6F625C]">{h.text}</p>
          </li>
        ))}
      </ul>
      <p className="text-[11.5px] leading-5 text-[#8A7F78]">{AI_UNAVAILABLE_COPY}</p>
    </section>
  );
}

export function ConstellationPanel({ centerLabel, highlights }: { centerLabel: string; highlights: { label: string; text: string }[] }): ReactElement {
  return (
    <section aria-labelledby="constellation-h" className="surface-panel-soft space-y-3">
      <p id="constellation-h" className="surface-meta">いま色の星座</p>
      <TraitConstellation centerLabel={centerLabel} traits={highlights} />
      <details>
        <summary className="cursor-pointer text-[12.5px] font-semibold text-[#49615B]">リストでも読む</summary>
        <ul className="mt-2 grid list-none gap-1.5 p-0 text-[13px] leading-6 text-[#6F625C]">
          {highlights.map((h) => (
            <li key={h.label}>・{h.label} — {h.text}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export function LimitsPanel({ band }: { band: "low" | "medium" }): ReactElement {
  const c = CONFIDENCE_COPY[band];
  return (
    <section aria-labelledby="limits-h" className="surface-panel-soft space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p id="limits-h" className="surface-meta">たしかさと、限界</p>
        <SourceChip type="LIMITATION" />
      </div>
      <p className="text-[13px] font-semibold leading-6 text-[#6F625C]">{c.label}</p>
      <p className="text-[13px] leading-6 text-[#7A7068]">{c.note}</p>
      <ul className="m-0 grid list-none gap-1 p-0 text-[12.5px] leading-6 text-[#8A7F78]">
        {LIMITATION_COPY.map((line) => <li key={line}>・{line}</li>)}
      </ul>
    </section>
  );
}

export function PrivacyPanel(): ReactElement {
  return (
    <section aria-labelledby="privacy-h" className="surface-panel-soft space-y-2">
      <p id="privacy-h" className="surface-meta">プライバシーについて</p>
      <ul className="m-0 grid list-none gap-1 p-0 text-[12.5px] leading-6 text-[#7A7068]">
        {PRIVACY_COPY.map((line) => <li key={line}>・{line}</li>)}
      </ul>
    </section>
  );
}

export function GentleActions({ children }: { children: ReactNode }): ReactElement {
  return (
    <section aria-labelledby="actions-h" className="surface-panel-soft space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p id="actions-h" className="surface-meta">よければ、つぎの一歩</p>
        <SourceChip type="OPTIONAL_NEXT_ACTION" />
      </div>
      {children}
      <p className="text-[12.5px] leading-6 text-[#8A7F78]">{DECLINE_ALL_COPY}</p>
    </section>
  );
}
