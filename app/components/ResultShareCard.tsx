"use client";

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
  const hookLine = personaShell?.socialHandle || (locale === "en" ? identity.shortResultHookEn : identity.shortResultHookJa);
  const categoryTag = personaShell?.publicSign || (locale === "en" ? pack?.familyLabelEn || "Yorisou result" : identity.shareCategoryTagJa);
  const shareLine = locale === "en" ? identity.shareLineEn : identity.shareLineJa;
  const otherReadableLine = locale === "en" ? shareLine : identity.shareOtherReadableJa;
  const tensionLine =
    locale === "en" ? "There is a little more edge here than it first shows." : identity.shareTensionLineJa;
  const socialHook = locale === "en" ? "You can probably picture someone close to this." : identity.shareSocialHookJa;
  const publicSign = personaShell?.publicSign || null;
  const officialName = personaShell?.officialPublicPersonaName || resultLabel;
  const socialHandle = personaShell?.socialHandle || "";
  const subtitle = personaShell?.functionalSubtitle || identity.publicSubtitleJa;
  const traits = (identity.traitChipsJa || []).slice(0, 3);
  const closingLine = personaShell?.shareCardHookDirection || otherReadableLine;
  const signHelperLine = locale === "en" ? subtitle : identity.shareOtherReadableJa || subtitle;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(221,232,217,0.96)_0%,rgba(247,244,238,1)_36%,rgba(244,239,231,1)_100%)] px-4 py-5 text-[var(--text)]">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-md items-center justify-center">
        <section className="relative w-full overflow-hidden rounded-[2.35rem] border border-[color:var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98)_0%,rgba(242,234,223,0.98)_100%)] p-4 shadow-[0_20px_46px_rgba(47,35,33,0.14)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(180,106,72,0.18)_0%,rgba(79,105,98,0.84)_50%,rgba(180,106,72,0.18)_100%)]" />
          <div className="relative space-y-3.5">
            <div className="flex items-center justify-between gap-3">
              <BrandSigil label={locale === "en" ? "SHARE CARD" : "結果カード"} className="shrink-0" />
              <span className="rounded-full border border-[rgba(125,141,121,0.24)] bg-[rgba(255,253,249,0.88)] px-3 py-1.5 text-[11px] tracking-[0.14em] text-[var(--accent-sage-text)]">
                {categoryTag}
              </span>
            </div>

            <PersonaAssetSlot
              personaId={personaShell?.personaId || "P01"}
              officialPublicPersonaName={officialName}
              surface="share"
              compact
            />

            <div className="rounded-[2rem] border border-white/70 bg-[rgba(255,255,255,0.46)] px-4 py-4 shadow-[0_12px_28px_rgba(47,35,33,0.08)]">
              <div className="text-[11px] tracking-[0.16em] text-[var(--muted)]">{locale === "en" ? "RESULT" : "結果名"}</div>
              <h1 className="mt-1 display-serif text-[2.18rem] leading-[1.02] tracking-[-0.04em] text-[var(--text)]" data-official-public-persona-name={officialName} data-persona-id={personaShell?.personaId || "fallback"}>
                {officialName}
              </h1>
              {socialHandle ? (
                <p className="mt-2 rounded-[1rem] bg-[rgba(220,230,216,0.46)] px-3 py-2 text-[0.98rem] font-semibold leading-6 text-[var(--accent-sage-text)]" data-social-handle={socialHandle}>
                  {socialHandle}
                </p>
              ) : null}
              <p className="mt-2.5 text-[12px] leading-5 text-[var(--muted)]" data-functional-subtitle={subtitle}>
                {subtitle}
              </p>
              {publicSign || currentModeLabel ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {publicSign ? (
                    <span className="rounded-full border border-[rgba(125,141,121,0.2)] bg-[rgba(255,253,249,0.82)] px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]" data-public-sign={publicSign}>
                      {locale === "en" ? "Sign" : "しるし"}: {publicSign}
                    </span>
                  ) : null}
                  {currentModeLabel ? (
                    <span className="rounded-full border border-[rgba(125,141,121,0.2)] bg-[rgba(235,240,230,0.8)] px-3 py-1 text-[11px] leading-5 text-[var(--accent-sage-text)]" data-current-mode-label={currentModeLabel}>
                      {locale === "en" ? "Mode" : "今のモード"}: {currentModeLabel}
                    </span>
                  ) : null}
                </div>
              ) : null}
              {signHelperLine ? (
                <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]" data-public-sign-helper={signHelperLine}>
                  {signHelperLine}
                </p>
              ) : null}
              <p className="mt-2.5 rounded-[1rem] border border-[rgba(125,141,121,0.12)] bg-[rgba(255,255,255,0.6)] px-3 py-3 text-[12px] leading-5 text-[var(--accent-sage-text)]" data-hook-line={hookLine}>
                {hookLine}
              </p>
              <p className="mt-2 rounded-[1rem] bg-[rgba(255,255,255,0.56)] px-3 py-2 text-[12px] leading-5 text-[var(--accent-sage-text)]">{tensionLine}</p>
              <p className="mt-2 text-[11px] leading-5 tracking-[0.04em] text-[var(--muted)]">{socialHook}</p>
            </div>

            {traits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
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

            <p className="text-[12px] leading-5 text-[var(--muted)]">{closingLine}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
