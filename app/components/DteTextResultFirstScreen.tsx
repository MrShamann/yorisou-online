import Link from "next/link";
import type { ReactNode } from "react";

import PersonaAssetSlot from "./PersonaAssetSlot";
import type { CanonicalPublicPersonaShell } from "@/lib/yorisou/dte/public-persona-shell";
import { resolveCanonicalPublicPersonaModeLabel } from "@/lib/yorisou/dte/public-persona-shell";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  personaShell: CanonicalPublicPersonaShell | null;
  fallbackName: string;
  fallbackSubtitle: string;
  fallbackSocialLine: string;
  fallbackPublicSign?: string | null;
  currentModeKey?: string | null;
  currentModeLabel?: string | null;
  traitChips: string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  actionArea?: ReactNode;
  detailLink?: ReactNode;
  renderErrorState?: boolean;
  oraclePreviewLine?: string | null;
};

const copy = {
  ja: {
    label: "あなたの結果",
    sign: "しるし",
    mode: "いまのモード",
    traits: "出やすい動き",
    recognition: "いまのあなたをひとことで受け取る",
  },
  en: {
    label: "Your result",
    sign: "Sign",
    mode: "Current mode",
    traits: "Behavior traits",
    recognition: "A one-line read of you right now",
  },
} as const;

export default function DteTextResultFirstScreen({
  locale,
  personaShell,
  fallbackName,
  fallbackSubtitle,
  fallbackSocialLine,
  fallbackPublicSign = null,
  currentModeKey = null,
  currentModeLabel = null,
  traitChips,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  actionArea = null,
  detailLink = null,
  renderErrorState = false,
  oraclePreviewLine = null,
}: Props) {
  const t = copy[locale];
  const resultName = personaShell?.officialPublicPersonaName || fallbackName;
  const socialLine = personaShell?.socialHandle || fallbackSocialLine;
  const subtitle = personaShell?.functionalSubtitle || fallbackSubtitle;
  const publicSign = personaShell?.publicSign || fallbackPublicSign;
  const resolvedCurrentModeLabel = resolveCanonicalPublicPersonaModeLabel(personaShell, currentModeKey, currentModeLabel);
  const chips = traitChips.slice(0, 3);
  const recognitionLine = socialLine || subtitle || fallbackSubtitle;
  const detailLine = subtitle && subtitle !== recognitionLine ? subtitle : null;
  const hasHeroNote = Boolean(oraclePreviewLine && !renderErrorState);

  return (
    <section className="flex min-h-[calc(100svh-0.5rem)] flex-col justify-start pt-1" data-result-shell="canonical">
      <div className="overflow-hidden rounded-[2.1rem] border border-[rgba(36,45,43,0.12)] bg-[linear-gradient(180deg,rgba(12,18,17,0.98)_0%,rgba(24,35,31,0.98)_44%,rgba(34,48,43,0.96)_68%,rgba(242,246,239,0.99)_100%)] shadow-[0_24px_60px_rgba(15,22,20,0.18)]">
        <div className="px-4 pt-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] tracking-[0.24em] text-white/86">
              {t.label}
            </div>
            {!renderErrorState && hasHeroNote ? (
              <div className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] tracking-[0.16em] text-white/78">
                ひとこと
              </div>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[1.06fr_0.94fr] md:items-stretch">
            <div className="space-y-3.5">
              <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] tracking-[0.2em] text-white/86">
                {renderErrorState ? "結果を開けません" : "結果の核"}
              </div>

              <h1
                className="display-serif hero-name max-w-[11ch] text-[clamp(2.35rem,13.2vw,3.9rem)] leading-[0.95] tracking-[-0.06em] text-white"
                data-official-public-persona-name={resultName}
                data-persona-id={personaShell?.personaId || "fallback"}
              >
                {resultName}
              </h1>

              {recognitionLine ? (
                <div className="space-y-2">
                  <div className="text-[10px] tracking-[0.2em] text-white/56">{t.recognition}</div>
                  <div className="max-w-[28rem] rounded-[1.18rem] border border-white/12 bg-white/10 px-4 py-3 text-[15px] font-semibold leading-6 text-white shadow-[0_14px_24px_rgba(6,12,10,0.12)]" data-social-handle={recognitionLine}>
                    {recognitionLine}
                  </div>
                </div>
              ) : null}

              {detailLine ? (
                <p className="max-w-[28rem] text-[13px] leading-6 text-white/72" data-functional-subtitle={detailLine}>
                  {detailLine}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {publicSign ? (
                  <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] leading-5 text-white/92" data-public-sign={publicSign}>
                    {t.sign}: {publicSign}
                  </span>
                ) : null}
                {resolvedCurrentModeLabel ? (
                  <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] leading-5 text-white/92" data-current-mode-label={resolvedCurrentModeLabel}>
                    {t.mode}: {resolvedCurrentModeLabel}
                  </span>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="text-[10px] tracking-[0.2em] text-white/56">{t.traits}</div>
                <div className="grid gap-2 sm:grid-cols-3">
                {chips.map((trait) => (
                  <div
                    key={trait}
                    className="rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.08)] px-3 py-2.5 text-[12.5px] font-medium leading-5 text-white/92 shadow-[0_10px_18px_rgba(6,12,10,0.08)]"
                    data-trait-chip={trait}
                  >
                    {trait}
                  </div>
                ))}
                </div>
              </div>

              {hasHeroNote && oraclePreviewLine ? (
                <p className="max-w-[28rem] rounded-[1.05rem] border border-white/12 bg-white/8 px-3 py-3 text-[12px] leading-6 text-white/70" data-oracle-preview-line={oraclePreviewLine}>
                  {oraclePreviewLine}
                </p>
              ) : null}
            </div>

            <div className="relative overflow-hidden rounded-[1.72rem] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_100%)] p-2.5 shadow-[0_18px_32px_rgba(10,16,14,0.14)]">
              <PersonaAssetSlot
                personaId={personaShell?.personaId || "P01"}
                officialPublicPersonaName={resultName}
                surface="result"
                compact
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(36,45,43,0.12)] bg-[linear-gradient(180deg,rgba(248,250,245,1)_0%,rgba(242,246,239,1)_100%)] px-4 py-3.5">
          {actionArea ? (
            <div className="space-y-2.5">{actionArea}</div>
          ) : (
            <div className="space-y-2.5">
              <Link
                href={primaryHref}
                className="inline-flex min-h-[54px] w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,rgba(18,20,19,1)_0%,rgba(31,44,39,1)_100%)] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_16px_28px_rgba(20,28,25,0.24)]"
              >
                {primaryLabel}
              </Link>
              {!renderErrorState && secondaryHref && secondaryLabel ? (
                <a
                  href={secondaryHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[42px] w-full items-center justify-center rounded-[0.95rem] border border-[rgba(36,45,43,0.12)] bg-white/76 px-4 py-2 text-[13px] font-medium text-[var(--accent-sage-text)]"
                >
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          )}
          {detailLink ? <div className="mt-3">{detailLink}</div> : null}
        </div>
      </div>
    </section>
  );
}
