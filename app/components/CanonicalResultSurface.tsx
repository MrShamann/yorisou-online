import DteTextResultFirstScreen from "./DteTextResultFirstScreen";
import { buildCoreTraitLabels } from "@/lib/result/result-traits";
import type { PublicResultIdentity } from "@/lib/result/public-result-identity";
import type { ResultLabSnapshot } from "@/lib/result/rendering-contract-adapter";
import type { ResultStaticPack } from "@/lib/result/visual-asset-chain";
import type { CanonicalPublicPersonaShell } from "@/lib/yorisou/dte/public-persona-shell";

type Locale = "ja" | "en";

type Props = {
  locale: Locale;
  snapshot: ResultLabSnapshot;
  publicIdentity?: PublicResultIdentity;
  nextStepHref?: string;
  nextStepLabel?: string;
  nextStepHint?: string;
  visualAssetPack?: ResultStaticPack | null;
  shareViewHref?: string;
  personaShell?: CanonicalPublicPersonaShell | null;
  currentModeKey?: string | null;
  currentModeLabel?: string | null;
};

const copy = {
  ja: {
    invalidTitle: "結果を開けません",
    invalidBody: "完了した結果を、もう一度開いてください。",
    versionBody: "最新の結果ページから開き直してください。",
    primaryDefault: "共有カードを見る",
    primaryHint: "結果の画像版を先に開けます。",
    detailsCta: "結果のつづきを開く",
    detailsTitle: "受け取った結果",
    detailsSummary: "まずは核を受け取って、深い読みはあとで開ける。",
    screenLabel: "結果",
    closureTitle: "受け取った核",
    supportLabel: "いまの答え",
    primarySubcopy: "結果を先に見せる。深い読みはそのあとでいい。",
    secondaryCta: "結果のつづきを開く",
    belowFoldLabel: "次に開くもの",
  },
  en: {
    invalidTitle: "Result unavailable",
    invalidBody: "Please reopen the result from the completed session.",
    versionBody: "Please reopen the latest result page.",
    primaryDefault: "Open share card",
    primaryHint: "Open the visual result first.",
    detailsCta: "Continue reading",
    detailsTitle: "Result recapped",
    detailsSummary: "Take the core read first and deepen it below.",
    screenLabel: "Result",
    closureTitle: "Core line",
    supportLabel: "Current read",
    primarySubcopy: "Take the result first. Then only one next move matters.",
    secondaryCta: "Continue reading",
    belowFoldLabel: "What to open next",
  },
} as const;

export default function CanonicalResultSurface({
  locale,
  snapshot,
  publicIdentity,
  nextStepHref,
  nextStepLabel,
  shareViewHref,
  personaShell = null,
  currentModeKey = null,
  currentModeLabel = null,
}: Props) {
  const t = copy[locale];
  const payload = snapshot.payload;
  const identity = publicIdentity;
  const renderErrorState =
    snapshot.renderingState === "invalid_or_missing_payload" || snapshot.renderingState === "version_mismatch_guard";
  const publicResultName = renderErrorState
    ? t.invalidTitle
    : locale === "en"
      ? identity?.publicResultLabelEn || payload?.final_locked_label_jp || t.invalidTitle
      : identity?.mythArchetypeLabelJa || identity?.publicResultLabelJa || payload?.final_locked_label_jp || t.invalidTitle;
  const socialLine = renderErrorState
    ? locale === "en"
      ? "The completed result could not be loaded."
      : "完了した結果を読み込めませんでした。"
    : locale === "en"
      ? identity?.shareLineEn || payload?.share_card_result.share_card_line_en_logic_gloss || payload?.share_card_result.share_card_summary || ""
      : identity?.contemporarySocialLabelJa || identity?.shareSendLineJa || identity?.shareLineJa || payload?.share_card_result.share_card_line_jp || payload?.share_card_result.share_card_summary || "";
  const subtitle = renderErrorState
    ? snapshot.renderingState === "version_mismatch_guard"
      ? t.versionBody
      : t.invalidBody
    : locale === "en"
      ? identity?.publicSubtitleEn || payload?.final_locked_subtitle_jp || ""
      : identity?.functionalSubtitleJa || identity?.publicSubtitleJa || payload?.final_locked_subtitle_jp || "";
  const detailCopy = renderErrorState
    ? subtitle
    : locale === "en"
      ? identity?.paywallTeaseEn || payload?.deep_report_stub.deep_report_intro_jp || t.detailsSummary
      : identity?.paywallTeaseJa || payload?.deep_report_stub.deep_report_intro_jp || t.detailsSummary;
  const coreTraits = renderErrorState
    ? buildCoreTraitLabels(snapshot, 3).map((trait) => trait.label)
    : locale === "en"
      ? buildCoreTraitLabels(snapshot, 3).map((trait) => trait.label)
      : identity?.traitChipsJa || buildCoreTraitLabels(snapshot, 3).map((trait) => trait.label);
  const shareHref = shareViewHref || "#";
  const primaryHref = shareHref;
  const primaryLabel = t.primaryDefault;
  const secondaryHref = nextStepHref || "#result-details";
  const secondaryLabel =
    nextStepLabel || (locale === "ja" ? identity?.stepCopy.resultPrimaryCtaJa : undefined) || t.detailsCta;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(214,228,208,0.9)_0%,rgba(247,244,238,1)_32%,rgba(244,239,231,1)_100%)] px-4 py-4 text-[var(--text)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_28%,rgba(233,224,212,0.22)_100%)]" />
      <div className="mx-auto max-w-md space-y-4">
        <DteTextResultFirstScreen
            locale={locale}
            personaShell={renderErrorState ? null : personaShell}
            fallbackName={publicResultName}
            fallbackSubtitle={subtitle}
            fallbackSocialLine={socialLine}
            fallbackPublicSign={personaShell?.publicSign || identity?.shareCategoryTagJa || null}
            currentModeKey={currentModeKey}
            traitChips={coreTraits}
            currentModeLabel={currentModeLabel}
            primaryHref={primaryHref}
            primaryLabel={primaryLabel}
            secondaryHref={secondaryHref}
            secondaryLabel={secondaryLabel}
            renderErrorState={renderErrorState}
            oraclePreviewLine={null}
          />

        <section className="space-y-3" id="result-details">
          <div className="px-1 text-[10px] tracking-[0.2em] text-[var(--muted)]">{t.belowFoldLabel}</div>
          <section className="rounded-[1.7rem] border border-[rgba(125,141,121,0.14)] bg-[rgba(255,252,247,0.76)] px-4 py-4">
            <div className="text-[11px] tracking-[0.18em] text-[var(--muted)]">{t.detailsTitle}</div>
            <p className="mt-2 text-[15px] font-semibold leading-7 text-[var(--accent-sage-text)]">
              {locale === "en" ? socialLine : identity?.nextMoveLineJa || socialLine}
            </p>
            <div className="mt-3 text-[11px] tracking-[0.18em] text-[var(--muted)]">{t.closureTitle}</div>
            <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">{detailCopy}</p>
            {!renderErrorState ? (
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={shareHref}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[0.95rem] bg-[linear-gradient(180deg,rgba(57,35,30,1)_0%,rgba(27,17,14,1)_100%)] px-4 py-2 text-[14px] font-semibold text-white shadow-[0_14px_24px_rgba(47,35,33,0.12)]"
                >
                  {t.detailsCta}
                </a>
                {nextStepHref ? (
                  <a
                    href={nextStepHref}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/64 px-4 py-2 text-[13px] font-medium text-[var(--accent-sage-text)]"
                  >
                    {secondaryLabel}
                  </a>
                ) : null}
              </div>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}
