import Link from "next/link";
import type { ReactNode } from "react";

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
    <section className="flex flex-col justify-start pt-0.5" data-result-shell="canonical">
      <div className="overflow-hidden rounded-[2rem] border border-[rgba(36,45,43,0.1)] bg-[linear-gradient(180deg,rgba(12,18,17,0.98)_0%,rgba(24,35,31,0.98)_44%,rgba(34,48,43,0.96)_68%,rgba(242,246,239,0.99)_100%)] shadow-[0_20px_46px_rgba(15,22,20,0.15)]">
        <div className="px-4 pt-3.5 text-white">
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

          <div className="mt-3.5 grid gap-3 md:grid-cols-[1.06fr_0.94fr] md:items-stretch">
            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] tracking-[0.2em] text-white/86">
                {renderErrorState ? "結果を開けません" : "結果の核"}
              </div>

              <h1
                className="display-serif hero-name max-w-[11ch] text-[clamp(2.25rem,12.6vw,3.6rem)] leading-[0.94] tracking-[-0.06em] text-white"
                data-official-public-persona-name={resultName}
                data-persona-id={personaShell?.personaId || "fallback"}
              >
                {resultName}
              </h1>

              {recognitionLine ? (
                <div className="space-y-2.5">
                  <div className="text-[10px] tracking-[0.2em] text-white/56">{t.recognition}</div>
                  <div className="max-w-[28rem] rounded-[1.15rem] border border-white/12 bg-white/10 px-4 py-2.5 text-[14px] font-semibold leading-7 text-white shadow-[0_14px_24px_rgba(6,12,10,0.12)]" data-social-handle={recognitionLine}>
                    {recognitionLine}
                  </div>
                </div>
              ) : null}

              {detailLine ? (
                <p className="max-w-[28rem] text-[13px] leading-7 text-white/74" data-functional-subtitle={detailLine}>
                  {detailLine}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {publicSign ? (
                  <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-[10px] leading-5 text-white/92" data-public-sign={publicSign}>
                    {t.sign}: {publicSign}
                  </span>
                ) : null}
                {resolvedCurrentModeLabel ? (
                  <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-[10px] leading-5 text-white/92" data-current-mode-label={resolvedCurrentModeLabel}>
                    {t.mode}: {resolvedCurrentModeLabel}
                  </span>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] tracking-[0.2em] text-white/56">{t.traits}</div>
                <div className="grid gap-2 sm:grid-cols-3">
                {chips.map((trait) => (
                  <div
                    key={trait}
                    className="flex min-h-[46px] items-center rounded-[1rem] border border-white/12 bg-[rgba(255,255,255,0.08)] px-3.5 py-2.5 text-[12.5px] font-medium leading-5 text-white/92 shadow-[0_10px_18px_rgba(6,12,10,0.08)]"
                    data-trait-chip={trait}
                  >
                    {trait}
                  </div>
                ))}
                </div>
              </div>

              {hasHeroNote && oraclePreviewLine ? (
                <p className="max-w-[28rem] rounded-[1.05rem] border border-white/12 bg-white/8 px-3 py-3 text-[12px] leading-7 text-white/72" data-oracle-preview-line={oraclePreviewLine}>
                  {oraclePreviewLine}
                </p>
              ) : null}
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.05)_36%,rgba(246,249,243,0.08)_100%)] p-3 shadow-[0_16px_28px_rgba(10,16,14,0.12)]">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] tracking-[0.18em] text-white/82">
                  {locale === "en" ? "Public view" : "公開用の見え方"}
                </div>
                <div className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1 text-[10px] tracking-[0.14em] text-white/78">
                  {locale === "en" ? "Calm" : "静か"}
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <div className="h-28 rounded-[1.2rem] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_34%,rgba(12,18,17,0.92)_100%)]" />
                  <p className="max-w-[18rem] text-[12px] leading-6 text-white/76">
                    {locale === "en"
                      ? "Made to read clearly in a public result view."
                      : "公開結果の見え方として、読みやすく整えています。"}
                  </p>
                </div>
                <div className="hidden sm:flex h-full flex-col items-end justify-end gap-2">
                  <div className="h-14 w-14 rounded-full border border-white/16 bg-white/10 shadow-[0_12px_24px_rgba(0,0,0,0.12)]" />
                  <div className="h-2.5 w-20 rounded-full bg-white/14" />
                  <div className="h-2.5 w-14 rounded-full bg-white/12" />
                </div>
              </div>
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
