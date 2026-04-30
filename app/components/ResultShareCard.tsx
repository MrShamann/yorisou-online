"use client";

import Link from "next/link";

import BrandSigil from "./BrandSigil";
import PersonaAssetSlot from "./PersonaAssetSlot";
import type { PublicResultIdentity } from "@/lib/result/public-result-identity";
import type { ResultStaticPack } from "@/lib/result/visual-asset-chain";
import type { CanonicalPublicPersonaShell } from "@/lib/yorisou/dte/public-persona-shell";

type Props = {
  locale: "ja" | "en";
  identity: PublicResultIdentity;
  pack?: ResultStaticPack | null;
  personaShell?: CanonicalPublicPersonaShell | null;
  currentModeLabel?: string | null;
};

export default function ResultShareCard({ locale, identity, pack = null, personaShell = null, currentModeLabel = null }: Props) {
  const resultLabel = personaShell?.officialPublicPersonaName || (locale === "en" ? identity.publicResultLabelEn : identity.publicResultLabelJa);
  const categoryTag = personaShell?.publicSign || (locale === "en" ? pack?.familyLabelEn || "Yorisou result" : identity.shareCategoryTagJa);
  const publicSign = personaShell?.publicSign || null;
  const officialName = personaShell?.officialPublicPersonaName || resultLabel;
  const socialHandle = personaShell?.socialHandle || "";
  const subtitle = personaShell?.functionalSubtitle || identity.publicSubtitleJa;
  const traits = (identity.traitChipsJa || []).slice(0, 3);
  const shareLink = "/line/mini-app";
  const shortUrl = "yorisou.online/line/mini-app";

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(211,228,221,0.98)_0%,rgba(250,250,247,1)_36%,rgba(235,240,233,1)_100%)] px-4 py-5 text-[var(--text)]">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-md items-center justify-center">
        <section className="relative w-full overflow-hidden rounded-[2.35rem] border border-[rgba(42,63,56,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(245,248,243,0.98)_100%)] p-4 shadow-[0_22px_46px_rgba(47,35,33,0.12)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(88,121,112,0.15)_0%,rgba(24,24,24,0.82)_50%,rgba(88,121,112,0.15)_100%)]" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BrandSigil label="YORISOU" className="shrink-0" />
                <span className="rounded-full border border-[rgba(42,63,56,0.12)] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-[11px] tracking-[0.14em] text-[var(--accent-sage-text)]">
                  {locale === "en" ? "Share card" : "あなたの結果"}
                </span>
              </div>
              <span className="rounded-full border border-[rgba(42,63,56,0.12)] bg-[rgba(235,241,234,0.88)] px-3 py-1.5 text-[11px] tracking-[0.14em] text-[var(--accent-sage-text)]">
                {categoryTag}
              </span>
            </div>

            <PersonaAssetSlot personaId={personaShell?.personaId || "P01"} officialPublicPersonaName={officialName} surface="share" compact />

            <div className="rounded-[1.95rem] border border-[rgba(42,63,56,0.1)] bg-white/88 px-4 py-4 shadow-[0_14px_28px_rgba(47,35,33,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">{locale === "en" ? "Your result" : "あなたの結果"}</div>
                <div className="rounded-full border border-[rgba(42,63,56,0.12)] bg-[rgba(235,241,234,0.88)] px-2.5 py-1 text-[10px] tracking-[0.14em] text-[var(--accent-sage-text)]">
                  {locale === "en" ? "Preview" : "共有向け"}
                </div>
              </div>
              <h1 className="mt-2 display-serif text-[2.28rem] leading-[1.02] tracking-[-0.05em] text-[var(--text)]" data-official-public-persona-name={officialName} data-persona-id={personaShell?.personaId || "fallback"}>
                {officialName}
              </h1>
              {socialHandle ? (
                <p className="mt-2 rounded-[1rem] bg-[rgba(39,52,49,0.06)] px-3 py-2 text-[0.95rem] font-semibold leading-6 text-[var(--accent-sage-text)]" data-social-handle={socialHandle}>
                  {socialHandle}
                </p>
              ) : null}
              <p className="mt-2.5 text-[12px] leading-5 text-[var(--muted)]" data-functional-subtitle={subtitle}>
                {subtitle}
              </p>
              {publicSign || currentModeLabel ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {publicSign ? (
                    <span className="rounded-full border border-[rgba(42,63,56,0.12)] bg-[rgba(255,255,255,0.88)] px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]" data-public-sign={publicSign}>
                      {locale === "en" ? "Sign" : "しるし"}: {publicSign}
                    </span>
                  ) : null}
                  {currentModeLabel ? (
                    <span className="rounded-full border border-[rgba(42,63,56,0.12)] bg-[rgba(235,241,234,0.88)] px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]" data-current-mode-label={currentModeLabel}>
                      {locale === "en" ? "Mode" : "今のモード"}: {currentModeLabel}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            {traits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <span
                    key={trait}
                    className="rounded-full border border-[rgba(42,63,56,0.12)] bg-[rgba(255,255,255,0.92)] px-3 py-1.5 text-[12px] leading-5 text-[var(--accent-sage-text)] shadow-[0_6px_14px_rgba(47,35,33,0.04)]"
                    data-trait-chip={trait}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="rounded-[1.4rem] border border-[rgba(42,63,56,0.12)] bg-[rgba(246,249,244,0.92)] px-4 py-3">
              <div className="text-[10px] tracking-[0.18em] text-[var(--muted)]">あなたも診断する</div>
              <Link
                href={shareLink}
                className="mt-2 inline-flex min-h-[46px] w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,rgba(36,45,43,1)_0%,rgba(18,20,19,1)_100%)] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_14px_24px_rgba(47,35,33,0.16)]"
              >
                LINEでひらく
              </Link>
              <p className="mt-2 text-[11px] leading-5 text-[var(--muted)]">{shortUrl}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
