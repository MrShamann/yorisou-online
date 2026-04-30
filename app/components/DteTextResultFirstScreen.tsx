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
  },
  en: {
    label: "Your result",
    sign: "Sign",
    mode: "Current mode",
    traits: "Behavior traits",
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
  const signHelperLine = locale === "en"
    ? fallbackSubtitle
    : personaShell?.shareCardHookDirection || fallbackSubtitle;

  return (
    <section className="flex min-h-[calc(100dvh-2rem)] flex-col justify-center" data-result-shell="canonical">
      <div className="rounded-[1.65rem] border border-[rgba(125,141,121,0.18)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98)_0%,rgba(242,234,223,0.98)_100%)] px-4 py-4 shadow-[0_18px_38px_rgba(47,35,33,0.1)]">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">{t.label}</div>
          {!renderErrorState && oraclePreviewLine ? (
            <div className="rounded-full border border-[rgba(125,141,121,0.18)] bg-[rgba(255,253,249,0.92)] px-3 py-1 text-[10px] tracking-[0.14em] text-[var(--accent-sage-text)]">
              結果のひとこと
            </div>
          ) : null}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_7.5rem] md:items-start">
          <div>
            <h1
              className="display-serif hero-name text-[2.28rem] leading-[1.02] text-[var(--text)]"
              data-official-public-persona-name={resultName}
              data-persona-id={personaShell?.personaId || "fallback"}
            >
              {resultName}
            </h1>
            {socialLine ? (
              <p className="mt-2 text-[14px] font-semibold leading-6 text-[var(--accent-sage-text)]" data-social-handle={socialLine}>
                {socialLine}
              </p>
            ) : null}
            {subtitle ? (
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]" data-functional-subtitle={subtitle}>
                {subtitle}
              </p>
            ) : null}
          </div>
          <PersonaAssetSlot
            personaId={personaShell?.personaId || "P01"}
            officialPublicPersonaName={resultName}
            surface="result"
            compact
          />
        </div>
        {!renderErrorState && oraclePreviewLine ? (
          <div className="mt-3 rounded-[1rem] border border-[rgba(125,141,121,0.14)] bg-[rgba(220,230,216,0.34)] px-3 py-3">
            <div className="text-[10px] tracking-[0.16em] text-[var(--muted)]">余韻の一文</div>
            <p className="mt-1 text-[13px] leading-6 text-[var(--accent-sage-text)]" data-oracle-preview-line={oraclePreviewLine}>
              {oraclePreviewLine}
            </p>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          {publicSign ? (
            <span className="rounded-full border border-[rgba(125,141,121,0.18)] bg-white/74 px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]" data-public-sign={publicSign}>
              {t.sign}: {publicSign}
            </span>
          ) : null}
          {resolvedCurrentModeLabel ? (
            <span className="rounded-full border border-[rgba(125,141,121,0.18)] bg-[rgba(235,240,230,0.72)] px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]" data-current-mode-label={resolvedCurrentModeLabel}>
              {t.mode}: {resolvedCurrentModeLabel}
            </span>
          ) : null}
        </div>
        {signHelperLine ? (
          <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]" data-public-sign-helper={signHelperLine}>
            {signHelperLine}
          </p>
        ) : null}

        {chips.length > 0 ? (
          <div className="mt-4">
            <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">{t.traits}</div>
            <div className="mt-2 grid gap-2">
              {chips.map((trait) => (
                <div
                  key={trait}
                  className="rounded-[0.8rem] border border-[rgba(125,141,121,0.14)] bg-white/70 px-3 py-2 text-[13px] leading-5 text-[var(--text)]"
                  data-trait-chip={trait}
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 space-y-2.5">
          {actionArea ? (
            <>{actionArea}</>
          ) : (
            <>
              <Link
                href={primaryHref}
                className="inline-flex min-h-[54px] w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,rgba(57,35,30,1)_0%,rgba(27,17,14,1)_100%)] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_24px_rgba(47,35,33,0.12)]"
              >
                {primaryLabel}
              </Link>
              {!renderErrorState && secondaryHref && secondaryLabel ? (
                <a
                  href={secondaryHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/64 px-4 py-2 text-[13px] font-medium text-[var(--accent-sage-text)]"
                >
                  {secondaryLabel}
                </a>
              ) : null}
            </>
          )}
          {detailLink ? <div>{detailLink}</div> : null}
        </div>
      </div>
    </section>
  );
}
