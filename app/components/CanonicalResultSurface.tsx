import DteTextResultFirstScreen from "./DteTextResultFirstScreen";
import PrivateTestFeedbackCard from "./PrivateTestFeedbackCard";
import OracleLineModule from "./OracleLineModule";
import ResultLoopMap from "./ResultLoopMap";
import { buildCoreTraitLabels } from "@/lib/result/result-traits";
import type { PublicResultIdentity } from "@/lib/result/public-result-identity";
import type { ResultLabSnapshot } from "@/lib/result/rendering-contract-adapter";
import type { ResultStaticPack } from "@/lib/result/visual-asset-chain";
import type { CanonicalPublicPersonaShell } from "@/lib/yorisou/dte/public-persona-shell";
import type { OracleLineRecord } from "@/lib/yorisou/dte/oracle/oracle-line-types";

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
  oracleRecord?: OracleLineRecord | null;
  showFallbackOracle?: boolean;
};

const copy = {
  ja: {
    invalidTitle: "結果を読み込めません",
    invalidBody: "完了した結果をもう一度開いてください。",
    versionBody: "最新の結果ページから開き直してください。",
    primaryDefault: "この結果のつづきを開く",
    primaryHint: "次の一歩だけを、下で開けます。",
    detailsCta: "この結果を保存",
    detailsTitle: "結果の受け取りはここで完了です",
    detailsSummary: "深い見方はあとで開ける。先に、この結果の核だけを受け取る。",
    screenLabel: "RESULT",
    closureTitle: "このタイプの核",
    supportLabel: "受け取った答え",
    primarySubcopy: "まずは結果を受け取る。次の一歩はそのあとでいい。",
    secondaryCta: "画像として表示",
    belowFoldLabel: "受け取ったあとでできること",
  },
  en: {
    invalidTitle: "Result unavailable",
    invalidBody: "Please reopen the result from the completed session.",
    versionBody: "Please reopen the latest result page.",
    primaryDefault: "Open the next step",
    primaryHint: "Only the next useful move is below.",
    detailsCta: "Save this result",
    detailsTitle: "The result is already complete here",
    detailsSummary: "The deeper reading can wait. This screen only keeps the core identity.",
    screenLabel: "RESULT",
    closureTitle: "Core line",
    supportLabel: "Your current answer",
    primarySubcopy: "Take the result first. Then only one next move matters.",
    secondaryCta: "Open share card",
    belowFoldLabel: "After the reveal",
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
  oracleRecord = null,
  showFallbackOracle = false,
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
  const primaryHref = nextStepHref || "#result-details";
  const primaryLabel =
    nextStepLabel || (locale === "ja" ? identity?.stepCopy.resultPrimaryCtaJa : undefined) || t.primaryDefault;
  const shareHref = shareViewHref || "#";
  const oraclePreviewLine =
    oracleRecord?.oracleLine ||
    (locale === "en"
      ? identity?.shortResultHookEn || "Your current state has a softer next step."
      : identity?.shareSendLineJa || "いまの気配は、少しやわらかく受け取るのがちょうどいい。");

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
            secondaryHref={shareHref}
            secondaryLabel={t.secondaryCta}
            renderErrorState={renderErrorState}
            oraclePreviewLine={!renderErrorState ? oraclePreviewLine : null}
          />

        {!renderErrorState && (oracleRecord || showFallbackOracle) ? (
          <OracleLineModule
            record={oracleRecord}
            fallback={
              oracleRecord
                ? null
                : {
                    oracleId: `fallback:${personaShell?.personaId || "unknown"}`,
                    currentMode: currentModeLabel || null,
                    oracleLine:
                      locale === "en"
                        ? identity?.shortResultHookEn || "Your current state has a softer next step."
                        : identity?.shareSendLineJa || "いまの気配は、少しやわらかく受け取るのがちょうどいい。",
                    interpretation:
                      locale === "en"
                        ? identity?.paywallTeaseEn || "This is a gentle aftertaste line, not a diagnosis."
                        : identity?.paywallTeaseJa || "これは診断ではなく、余韻を言葉にした一文です。",
                    lifeMapping:
                      locale === "en"
                        ? identity?.publicSubtitleEn || "You can feel it most in the next small decision."
                        : identity?.publicSubtitleJa || "次の小さな選び方に、いちばん出やすい気配です。",
                    smallAdjustment:
                      locale === "en"
                        ? identity?.nextMoveLineJa || "Take the next small step without forcing it."
                        : identity?.nextMoveLineJa || "次の一歩を、無理のない速さに寄せる。",
                  }
            }
          />
        ) : null}

        {!renderErrorState ? (
          <PrivateTestFeedbackCard
            locale={locale}
            personaId={personaShell?.personaId || null}
            currentModeLabel={currentModeLabel}
            surface="result"
          />
        ) : null}

        <section className="space-y-3" id="result-details">
          <div className="px-1 text-[10px] tracking-[0.2em] text-[var(--muted)]">{t.belowFoldLabel}</div>
          <ResultLoopMap locale={locale} currentStep="result" />
          <section className="rounded-[1.7rem] border border-[rgba(125,141,121,0.14)] bg-[rgba(255,252,247,0.76)] px-4 py-4">
            <div className="text-[11px] tracking-[0.18em] text-[var(--muted)]">{t.detailsTitle}</div>
            <p className="mt-2 text-[15px] font-semibold leading-7 text-[var(--accent-sage-text)]">
              {locale === "en" ? socialLine : identity?.nextMoveLineJa || socialLine}
            </p>
            <div className="mt-3 text-[11px] tracking-[0.18em] text-[var(--muted)]">{t.closureTitle}</div>
            <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">{detailCopy}</p>
            {!renderErrorState ? (
              <a href={shareHref} className="mt-3 inline-flex text-sm font-medium text-[var(--muted)]">
                {t.detailsCta}
              </a>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}
