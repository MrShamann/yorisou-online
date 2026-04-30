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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(10,16,15,0.98)_0%,rgba(23,34,30,0.97)_34%,rgba(243,246,239,1)_100%)] px-4 py-4 text-[var(--text)]">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center justify-center">
        <section className="relative w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(23,34,30,0.98)_57%,rgba(242,246,239,0.99)_100%)] shadow-[0_24px_52px_rgba(10,16,14,0.18)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(157,184,170,0.16)_0%,rgba(255,255,255,0.88)_50%,rgba(157,184,170,0.16)_100%)]" />
          <div className="relative space-y-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BrandSigil label="YORISOU" className="shrink-0" />
                <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-white/84">
                  {locale === "en" ? "Share card" : "あなたの結果"}
                </span>
              </div>
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-white/84">
                {categoryTag}
              </span>
            </div>

            <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.04)_34%,rgba(245,248,243,1)_100%)] p-4 text-white shadow-[0_18px_34px_rgba(24,30,28,0.18)]">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] tracking-[0.2em] text-white/84">
                    {locale === "en" ? "Your result" : "あなたの結果"}
                  </div>
                  <h1 className="display-serif text-[2.45rem] leading-[0.98] tracking-[-0.06em] text-white" data-official-public-persona-name={officialName} data-persona-id={personaShell?.personaId || "fallback"}>
                    {officialName}
                  </h1>
                  {socialHandle ? (
                    <p className="max-w-[18rem] rounded-[1rem] border border-white/12 bg-white/10 px-3 py-2 text-[0.95rem] font-semibold leading-6 text-white" data-social-handle={socialHandle}>
                      {socialHandle}
                    </p>
                  ) : null}
                </div>
                <div className="rounded-[1.25rem] border border-white/12 bg-white/10 px-3 py-2 text-right text-[11px] tracking-[0.16em] text-white/76">
                  <div>{locale === "en" ? "Preview" : "結果カード"}</div>
                  <div className="mt-2 rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-[10px] tracking-[0.12em] text-white/84">
                    {currentModeLabel || "Mode"}
                  </div>
                </div>
              </div>

              <p className="mt-3 max-w-[20rem] text-[12px] leading-5 text-white/74" data-functional-subtitle={subtitle}>
                {subtitle}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {publicSign ? (
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] leading-5 text-white/90" data-public-sign={publicSign}>
                    {locale === "en" ? "Sign" : "しるし"}: {publicSign}
                  </span>
                ) : null}
                {currentModeLabel ? (
                  <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] leading-5 text-white/90" data-current-mode-label={currentModeLabel}>
                    {locale === "en" ? "Mode" : "今のモード"}: {currentModeLabel}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-[1rem] border border-[rgba(36,45,43,0.12)] bg-white/92 px-3 py-3 text-[12.5px] font-medium leading-5 text-[var(--text)] shadow-[0_10px_18px_rgba(47,35,33,0.05)]"
                  data-trait-chip={trait}
                >
                  {trait}
                </span>
              ))}
            </div>

            <div className="rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,20,19,0.96)_0%,rgba(31,44,39,0.96)_100%)] px-4 py-3 text-white shadow-[0_12px_22px_rgba(20,28,25,0.16)]">
              <div className="text-[10px] tracking-[0.18em] text-white/60">あなたも診断する</div>
              <Link
                href={shareLink}
                className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,rgba(242,248,241,1)_0%,rgba(224,234,224,1)_100%)] px-4 py-3 text-[14px] font-semibold text-[var(--accent-sage-text)] shadow-[0_16px_28px_rgba(20,28,25,0.24)]"
              >
                あなたも診断する
              </Link>
              <p className="mt-2 text-[11px] leading-5 text-white/62">{shortUrl}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
