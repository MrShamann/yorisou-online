"use client";

import type { ResultStaticPack } from "@/lib/result/visual-asset-chain";
import type { CanonicalPublicPersonaShell } from "@/lib/yorisou/dte/public-persona-shell";
import { resolveCanonicalPublicPersonaModeLabel } from "@/lib/yorisou/dte/public-persona-shell";
import PersonaHeroPortrait from "./PersonaHeroPortrait";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  pack?: ResultStaticPack | null;
  resultLabel: string;
  punchLine: string;
  subtitle: string;
  hookLine: string;
  traitChips?: string[];
  stepLabel?: string;
  compact?: boolean;
  climaxActions?: React.ReactNode;
  showMemoryLine?: boolean;
  personaShell?: CanonicalPublicPersonaShell | null;
  currentModeKey?: string | null;
  currentModeLabel?: string | null;
};

export default function ResultMobileHero({
  locale,
  pack = null,
  resultLabel,
  punchLine,
  subtitle,
  hookLine,
  traitChips = [],
  stepLabel,
  compact = false,
  climaxActions,
  showMemoryLine = false,
  personaShell = null,
  currentModeKey = null,
  currentModeLabel = null,
}: Props) {
  const familyLabel = locale === "en" ? pack?.familyLabelEn || "Yorisou result" : pack?.familyLabelJa || "Yorisou の結果";
  const chips = traitChips.slice(0, compact ? 2 : 3);
  const memoryHook = locale === "en" ? pack?.memoryHookEn || punchLine : pack?.memoryHookJa || punchLine;
  const resolvedCurrentModeLabel = resolveCanonicalPublicPersonaModeLabel(personaShell, currentModeKey, currentModeLabel);
  const officialName = personaShell?.officialPublicPersonaName || resultLabel;
  const socialHandle = personaShell?.socialHandle || "";
  const subtitleText = personaShell?.functionalSubtitle || subtitle;
  const publicSign = personaShell?.publicSign || null;
  const signHelperLine = locale === "en" ? subtitleText : personaShell?.shareCardHookDirection || subtitleText;

  return (
    <section className="relative overflow-hidden rounded-[2.1rem] border border-[color:var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98)_0%,rgba(243,235,224,0.98)_54%,rgba(232,238,229,0.96)_100%)] shadow-[0_20px_44px_rgba(47,35,33,0.11)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.08)_34%,transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(180,106,72,0.18)_0%,rgba(79,105,98,0.88)_50%,rgba(180,106,72,0.18)_100%)]" />
      <div className={`relative ${compact ? "px-4 py-4" : "px-4 py-5"}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">{stepLabel || familyLabel}</div>
            <p className="mt-1 text-[12px] font-medium leading-5 text-[var(--accent-sage-text)]">
              {locale === "en" ? "Revealed one scene at a time." : "ひと場面ずつ、結果が立ち上がる。"}
            </p>
          </div>
          <div className="rounded-full border border-[rgba(125,141,121,0.18)] bg-[rgba(255,253,249,0.86)] px-3 py-1 text-[10px] tracking-[0.14em] text-[var(--accent-sage-text)]">
            33 / 21 / 31
          </div>
        </div>

        <div className={`mt-4 ${compact ? "space-y-2.5" : "space-y-3"}`}>
          <div className="grid gap-3 md:grid-cols-[1fr_7.5rem] md:items-start">
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-2">
                <span className="visual-chip rounded-full px-3 py-1 text-[10px] tracking-[0.14em]">結果</span>
                <span className="visual-chip rounded-full px-3 py-1 text-[10px] tracking-[0.14em]">単独表示</span>
              </div>
              <h1
                className={`${compact ? "text-[1.84rem]" : "text-[2.42rem]"} display-serif hero-name leading-[1.01] text-[var(--text)]`}
                data-official-public-persona-name={officialName}
                data-persona-id={personaShell?.personaId || "P01"}
              >
                {officialName}
              </h1>
              {socialHandle ? (
                <p className="text-[12px] leading-5 tracking-[0.03em] text-[var(--muted)]" data-social-handle={socialHandle}>
                  {socialHandle}
                </p>
              ) : null}
              <p className={`${compact ? "text-[0.98rem] leading-6" : "text-[1.02rem] leading-7"} font-semibold text-[var(--accent-sage-text)]`}>
                {punchLine}
              </p>
              <p className={`${compact ? "text-[0.98rem] leading-6" : "text-[1rem] leading-7"} font-medium text-[var(--text)]`}>
                {hookLine}
              </p>
              <p className={`max-w-[26rem] text-[var(--muted)] ${compact ? "text-[12px] leading-5" : "text-[13px] leading-6"}`}>
                {subtitleText}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-[1.55rem] border border-[rgba(125,141,121,0.15)] bg-[linear-gradient(180deg,rgba(255,253,249,0.88)_0%,rgba(240,233,222,0.94)_100%)] shadow-[0_14px_28px_rgba(47,35,33,0.08)] md:mt-0">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.08)_38%,transparent_64%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0)_36%,rgba(47,35,33,0.04)_100%)]" />
              <div className="relative min-h-[164px]">
                <PersonaHeroPortrait familyKey={pack?.familyKey || "recovery"} variant="result" />
                <div className="absolute left-3 top-3 rounded-full border border-[rgba(125,141,121,0.18)] bg-[rgba(255,253,249,0.84)] px-3 py-1 text-[10px] tracking-[0.14em] text-[var(--accent-sage-text)]">
                  表示
                </div>
              </div>
            </div>
          </div>

          {publicSign || resolvedCurrentModeLabel ? (
            <div className="flex flex-wrap gap-2">
              {publicSign ? (
                <span
                  className="rounded-full border border-[rgba(125,141,121,0.2)] bg-[rgba(255,253,249,0.82)] px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]"
                  data-public-sign={publicSign}
                >
                  {locale === "en" ? "Sign" : "しるし"}: {publicSign}
                </span>
              ) : null}
              {resolvedCurrentModeLabel ? (
                <span
                  className="rounded-full border border-[rgba(125,141,121,0.2)] bg-[rgba(235,240,230,0.8)] px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]"
                  data-current-mode-label={resolvedCurrentModeLabel}
                >
                  {locale === "en" ? "Mode" : "今のモード"}: {resolvedCurrentModeLabel}
                </span>
              ) : null}
            </div>
          ) : null}
          {signHelperLine ? (
            <p className="text-[12px] leading-5 text-[var(--muted)]" data-public-sign-helper={signHelperLine}>
              {signHelperLine}
            </p>
          ) : null}

          {compact || !showMemoryLine ? null : memoryHook && memoryHook !== punchLine ? (
            <div className="rounded-[1.15rem] border border-[rgba(125,141,121,0.1)] bg-[rgba(255,253,249,0.78)] px-3 py-2.5">
              <div className="text-[10px] tracking-[0.16em] text-[var(--muted)]">{locale === "en" ? "RESULT LINE" : "送れるひとこと"}</div>
              <p className="mt-1 text-[12px] leading-5 text-[var(--accent-sage-text)]">{memoryHook}</p>
            </div>
          ) : null}

          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {chips.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-[rgba(125,141,121,0.24)] bg-[rgba(255,253,249,0.92)] px-3 py-1.5 text-[12px] leading-5 text-[var(--accent-sage-text)] shadow-[0_6px_14px_rgba(47,35,33,0.04)]"
                  data-trait-chip={trait}
                >
                  {trait}
                </span>
              ))}
            </div>
          ) : null}

          {climaxActions ? <div className="pt-1">{climaxActions}</div> : null}
        </div>
      </div>
    </section>
  );
}
