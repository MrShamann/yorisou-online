import DteEventTracker from "./DteEventTracker";
import DteTextResultFirstScreen from "./DteTextResultFirstScreen";
import ResultShareActions from "./ResultShareActions";
import { buildCoreTraitLabels } from "@/lib/result/result-traits";
import { buildResultShareMessaging } from "@/lib/result/share-messaging";
import type { PublicResultIdentity } from "@/lib/result/public-result-identity";
import type { ResultLabSnapshot } from "@/lib/result/rendering-contract-adapter";
import type { ResultStaticPack } from "@/lib/result/visual-asset-chain";
import { yorisouPersonaAssetRegistry, type YorisouPersonaAssetKind } from "@/lib/yorisou/persona-asset-registry";
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
  shareHref?: string | null;
  completionId?: string | null;
  personaShell?: CanonicalPublicPersonaShell | null;
  currentModeKey?: string | null;
  currentModeLabel?: string | null;
};

const copy = {
  ja: {
    invalidTitle: "結果を開けません",
    invalidBody: "完了した結果を、もう一度開いてください。",
    versionBody: "最新の結果ページから開き直してください。",
    detailsCta: "結果のつづきを開く",
    detailsTitle: "さらに深く見る",
    detailsSummary: "まずは結果の核を受け取り、読み解きは下で開く。",
    screenLabel: "結果",
    closureTitle: "ひとこと",
    supportLabel: "いまの答え",
    belowFoldLabel: "深く見る",
  },
  en: {
    invalidTitle: "Result unavailable",
    invalidBody: "Please reopen the result from the completed session.",
    versionBody: "Please reopen the latest result page.",
    detailsCta: "Continue reading",
    detailsTitle: "Read deeper",
    detailsSummary: "Take the core read first and deepen it below.",
    screenLabel: "Result",
    closureTitle: "Core line",
    supportLabel: "Current read",
    belowFoldLabel: "Read deeper",
  },
} as const;

type VisualSamplePersonaId = "P01" | "P02" | "P03";

const VISUAL_SAMPLE_PERSONA_IDS = new Set<VisualSamplePersonaId>(["P01", "P02", "P03"]);
const RENDERABLE_STATUSES = new Set(["manual_candidate", "approved_static"] as const);

function getRenderablePersonaAsset(personaId: string, kind: YorisouPersonaAssetKind) {
  if (!VISUAL_SAMPLE_PERSONA_IDS.has(personaId as VisualSamplePersonaId)) {
    return null;
  }

  const registryEntry = yorisouPersonaAssetRegistry[personaId as VisualSamplePersonaId];
  if (!registryEntry) {
    return null;
  }

  const record = registryEntry.assets[kind];
  if (!record || !RENDERABLE_STATUSES.has(record.status as "manual_candidate" | "approved_static")) {
    return null;
  }

  if (!record.path) {
    return null;
  }

  return record;
}

export default function CanonicalResultSurface({
  locale,
  snapshot,
  publicIdentity,
  nextStepHref,
  nextStepLabel,
  shareViewHref,
  shareHref = null,
  completionId = null,
  personaShell = null,
  currentModeKey = null,
  currentModeLabel = null,
}: Props) {
  const t = copy[locale];
  const payload = snapshot.payload;
  const identity = publicIdentity;
  const personaId = snapshot.personaId;
  const sampleResultHero = getRenderablePersonaAsset(personaId, "result_hero");
  const sampleCrest = getRenderablePersonaAsset(personaId, "crest");
  const samplePortrait = getRenderablePersonaAsset(personaId, "portrait");
  const sampleResultHeroPath = sampleResultHero?.path ?? "";
  const sampleCrestPath = sampleCrest?.path ?? "";
  const samplePortraitPath = samplePortrait?.path ?? "";
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
  const primaryShareHref =
    shareHref && shareHref.trim()
      ? shareHref.trim()
      : completionId && completionId.trim()
        ? `/result?completionId=${encodeURIComponent(completionId.trim())}`
        : "/line/mini-app";
  const shareCardHref = shareViewHref || primaryShareHref;
  const shareMessaging = buildResultShareMessaging({
    locale,
    publicResultName,
    socialLine,
    ctaLine: locale === "en" ? "What kind of support fits you?" : "あなたは今、どの寄り添い方？",
  });
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(12,18,17,0.98)_0%,rgba(25,37,33,0.98)_20%,rgba(244,246,240,1)_70%,rgba(237,242,235,1)_100%)] px-4 py-4 text-[var(--text)]">
      {renderErrorState ? (
        <DteEventTracker
          event="result_render_failed"
          completionId={completionId}
          personaId={personaShell?.personaId || null}
          locale={locale}
          source="result"
          surface="result"
          action="view"
          branchId="yorisou_dte"
          sourceBranchId="yorisou_dte"
          visibilityPolicy="public"
          crossBranchAccessPolicy="explicit_bridge"
          enabled={true}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_26%,rgba(223,233,227,0.18)_100%)]" />
      <div className="mx-auto max-w-md space-y-3">
        {!renderErrorState && (sampleResultHero || sampleCrest || samplePortrait) ? (
          <section className="overflow-hidden rounded-[1.45rem] border border-[rgba(36,45,43,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,248,243,0.97)_100%)] shadow-[0_10px_22px_rgba(47,35,33,0.06)]">
            {sampleResultHero ? (
              <div className="relative overflow-hidden">
                <img
                  src={sampleResultHeroPath}
                  alt="result hero"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,19,18,0.14)_0%,rgba(15,19,18,0.1)_40%,rgba(15,19,18,0.4)_100%)]" />
                <div className="relative flex min-h-[11.25rem] flex-col justify-between gap-3 p-3.5 sm:min-h-[13.5rem] sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-[rgba(15,19,18,0.32)] px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-white backdrop-blur-sm">
                      <span>{locale === "en" ? "Your type" : "あなたのタイプ"}</span>
                    </div>
                    {sampleCrest ? (
                      <div className="flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(255,255,255,0.12)] px-2.5 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                        <img
                          src={sampleCrestPath}
                          alt="crest"
                          className="h-7 w-7 rounded-full border border-white/20 bg-white/70 object-contain p-1"
                        />
                        <span className="hidden text-[10px] tracking-[0.14em] sm:inline">
                          {locale === "en" ? "Result mood" : "結果の雰囲気"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="max-w-[16.5rem] rounded-[1rem] border border-white/14 bg-[rgba(15,19,18,0.28)] px-3 py-2.5 text-[12px] leading-5 text-white/94 backdrop-blur-sm">
                      {locale === "en"
                        ? "A quiet visual impression of this result."
                        : "いまのあなたに近い空気感を、静かに映しています。"}
                    </div>
                    {samplePortrait ? (
                      <img
                        src={samplePortraitPath}
                        alt="portrait"
                        className="h-20 w-20 rounded-[1.2rem] border border-white/18 object-cover shadow-[0_10px_24px_rgba(15,19,18,0.22)] sm:h-24 sm:w-24"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

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
          primaryHref={primaryShareHref}
          primaryLabel={shareMessaging.shareTitle}
          renderErrorState={renderErrorState}
          oraclePreviewLine={null}
          actionArea={
            !renderErrorState ? (
              <ResultShareActions
                locale={locale}
                shareUrl={primaryShareHref}
                shareTitle={shareMessaging.shareTitle}
                shareText={shareMessaging.shareText}
                completionId={completionId}
                personaId={personaShell?.personaId || null}
                shareSurface="result_first_screen"
                shareCardUrl={shareCardHref}
              />
            ) : null
          }
          detailLink={
            !renderErrorState ? (
              <a
                href="#result-details"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[0.95rem] border border-[rgba(125,141,121,0.18)] bg-white/64 px-4 py-2 text-[13px] font-medium text-[var(--accent-sage-text)]"
              >
                詳しく見る
              </a>
            ) : null
          }
        />

        <section className="space-y-3" id="result-details">
          <div className="px-1 text-[10px] tracking-[0.2em] text-[var(--muted)]">{t.belowFoldLabel}</div>
          <section className="rounded-[1.65rem] border border-[rgba(36,45,43,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,248,243,0.97)_100%)] px-4 py-3.5 shadow-[0_14px_28px_rgba(47,35,33,0.08)]">
            <div className="inline-flex rounded-full border border-[rgba(36,45,43,0.12)] bg-[rgba(235,241,234,0.9)] px-3 py-1 text-[11px] tracking-[0.18em] text-[var(--accent-sage-text)]">
              {t.detailsTitle}
            </div>
            <p className="mt-3 text-[15px] font-semibold leading-7 text-[var(--accent-sage-text)]">
              {locale === "en" ? socialLine : identity?.nextMoveLineJa || socialLine}
            </p>
            <div className="mt-3 text-[11px] tracking-[0.18em] text-[var(--muted)]">{t.closureTitle}</div>
            <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">{detailCopy}</p>
            {!renderErrorState ? null : null}
          </section>
        </section>
      </div>
    </main>
  );
}
