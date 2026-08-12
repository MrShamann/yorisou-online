// Package 9 — server-rendered reveal sections (evidence grammar, limits,
// privacy, gentle actions). All content derives from the existing
// compatibility model; source types are labeled on-surface.
//
// PXR-1 — presentation only. Every sentence rendered here is the same approved
// string it was before; the source grammar still names where each part came
// from. What changed is weight: this surface used a dark-green microsite
// palette, three levels of nested cards, and five coloured provenance chips,
// none of which the rest of the product uses.
import type { ReactElement, ReactNode } from "react";
import { TraitConstellation } from "./TraitConstellation";
import {
  SOURCE_LABEL, CONFIDENCE_COPY, LIMITATION_COPY, AI_UNAVAILABLE_COPY,
  PRIVACY_COPY, DECLINE_ALL_COPY, type SourceType,
} from "./revealContent";

const PANEL =
  "rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] p-5";
const HEADING = "text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]";
const BODY = "text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]";
const NOTE = "text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]";

/**
 * Names where a piece of content came from.
 *
 * The GRAMMAR is unchanged — the same six `SourceType`s, the same Japanese
 * labels — because honest provenance is a product requirement. Only its weight
 * changed: it was a bordered, dotted, individually-coloured chip, and five of
 * them appeared before the reader reached any sentence. Badges get ranked
 * before prose gets read, so provenance was outcompeting the content it exists
 * to qualify. It is now a quiet label next to the heading it describes.
 */
export function SourceLabel({ type }: { type: SourceType }): ReactElement {
  return <span className={NOTE}>{SOURCE_LABEL[type]}</span>;
}

export function EvidencePanel({ highlights }: { highlights: { label: string; text: string }[] }): ReactElement {
  return (
    <section aria-labelledby="evidence-h" className={`${PANEL} grid gap-4`}>
      <div className="flex items-baseline justify-between gap-3">
        <p id="evidence-h" className={HEADING}>どうしてこの結果?</p>
        <SourceLabel type="ANSWER_DERIVED" />
      </div>
      <p className={NOTE}>
        あなたの回答に、つぎのような傾向が繰り返し見えました。ここに回答の内容そのものは表示されません。
      </p>
      {/* A separated list, not a stack of cards inside a card. Each row also
          carried an identical 「タイプ解釈」 label; an identical label on every
          row of a list carries no information, and the rule-based origin is
          stated as a full sentence directly below. */}
      <ul className="m-0 grid list-none gap-0 p-0">
        {highlights.map((h) => (
          <li
            key={`${h.label}:${h.text}`}
            className="border-t border-[var(--pxr-border-subtle)] py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <p className="text-[13px] font-semibold text-[var(--pxr-text-primary)]">{h.label}</p>
            <p className={`mt-1 ${BODY}`}>{h.text}</p>
          </li>
        ))}
      </ul>
      <p className={NOTE}>{AI_UNAVAILABLE_COPY}</p>
    </section>
  );
}

export function ConstellationPanel({ centerLabel, highlights }: { centerLabel: string; highlights: { label: string; text: string }[] }): ReactElement {
  return (
    <section aria-labelledby="constellation-h" className={`${PANEL} grid gap-3`}>
      <p id="constellation-h" className={HEADING}>いま色の星座</p>
      <TraitConstellation centerLabel={centerLabel} traits={highlights} />
      <details>
        {/* Display is left as the default `list-item`: overriding it drops the disclosure marker
            and can strip the control's disclosure semantics. Height comes from padding. */}
        <summary className="min-h-[var(--pxr-touch-target)] cursor-pointer py-3 text-[14px] font-medium text-[var(--pxr-accent)]">
          リストでも読む
        </summary>
        <ul className={`m-0 grid list-none gap-1.5 p-0 ${BODY}`}>
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
    <section aria-labelledby="limits-h" className={`${PANEL} grid gap-2`}>
      {/* The heading already says 限界 and the band already says how sure this
          is. A LIMITATION label sat between them saying「このテストの限界」— the
          same statement a third time, in the same viewport. */}
      <p id="limits-h" className={HEADING}>たしかさと、限界</p>
      <p className="text-[14px] font-semibold leading-[1.7] text-[var(--pxr-text-primary)]">{c.label}</p>
      <p className={BODY}>{c.note}</p>
      <ul className={`m-0 grid list-none gap-1 p-0 ${NOTE}`}>
        {LIMITATION_COPY.map((line) => <li key={line}>・{line}</li>)}
      </ul>
    </section>
  );
}

export function PrivacyPanel(): ReactElement {
  return (
    <section aria-labelledby="privacy-h" className={`${PANEL} grid gap-2`}>
      <p id="privacy-h" className={HEADING}>プライバシーについて</p>
      <ul className={`m-0 grid list-none gap-1 p-0 ${NOTE}`}>
        {PRIVACY_COPY.map((line) => <li key={line}>・{line}</li>)}
      </ul>
    </section>
  );
}

export function GentleActions({ children }: { children: ReactNode }): ReactElement {
  return (
    <section aria-labelledby="actions-h" className={`${PANEL} grid gap-4`}>
      {/* 「よければ」 and the decline line below already make this optional twice.
          A third 「任意の一歩」 label was decoration. */}
      <p id="actions-h" className={HEADING}>よければ、つぎの一歩</p>
      {children}
      <p className={NOTE}>{DECLINE_ALL_COPY}</p>
    </section>
  );
}
