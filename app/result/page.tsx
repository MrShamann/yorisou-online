import type { Metadata } from "next";
import Link from "next/link";
import PersistedResultUnavailable from "./PersistedResultUnavailable";
import { resolveResultMode } from "./resultMode";

import OpenTestingNotice from "../components/OpenTestingNotice";
import { getTemporary120QResultCompatibility } from "../tests/ima-iro/resultCompatibility";
import {
  buildPrivateContinuityHref,
  buildPublicShareHref,
  legacyIdentity,
  persistedIdentity,
} from "./resultIdentityRoutes";
import ResultShareActions from "../components/ResultShareActions";
import ShareObjectActions from "../components/ShareObjectActions";
import PairInviteActions from "../components/PairInviteActions";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { sharingOperational } from "@/lib/yorisou/sharing/access";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { activeShareForSource } from "@/lib/server/sharing/store";
import { IMAIRO_SHARE_SOURCE_FAMILY, IMAIRO_SHARE_TEMPLATE_REF } from "@/packs/yorisou/imairo/share";
import { OpenTestingPageTracker, OpenTestingTrackingLink } from "../components/OpenTestingTracker";
import { buildSelfUnderstandingReportHref } from "@/lib/yorisou/reports/loader";
import RevealExperience from "./reveal/RevealExperience";
import { EvidencePanel, ConstellationPanel, LimitsPanel, PrivacyPanel, GentleActions } from "./reveal/RevealSections";
import PrivateResultSave from "./PrivateResultSave";
import InterpretationResponse from "./InterpretationResponse";
import { PUBLIC_ARCHETYPE_TAXONOMY } from "@/lib/yorisou/public-result";

export const metadata: Metadata = {
  metadataBase: new URL("https://yorisou.online"),
  title: "いま色テストの結果 | Yorisou",
  description:
    "今の動き方を、24の色と名前で見てみるテスト。120Qをもとにした公開結果ページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function buildHighlightSummary(highlights: { text: string }[]) {
  if (highlights.length === 0) {
    return "今の動き方を、公開できる範囲でやわらかく整えています。";
  }

  const summary = highlights
    .map((item) => item.text.replace(/。$/u, ""))
    .join("、");

  return `${summary}傾向があります。`;
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};

  // UX-2R Wave A: mode resolution lives in ./resultMode, and the two modes are DISTINCT TYPES.
  // Nothing below re-derives which mode it is in from nullable fields.
  const mode = await resolveResultMode(params);
  if (mode.kind === "unavailable") {
    return <PersistedResultUnavailable />;
  }

  const { resultId, overlayId, confidenceBand, payloadKey } = mode;
  const routeContext = { resultId, overlayId, confidenceBand, payloadKey } as const;
  const compatibility = getTemporary120QResultCompatibility(routeContext);

  // Wave A: outbound links are split by INTENT, not built by one shared helper.
  //   • private continuity keeps the stable identity so the destination reads the record;
  //   • the share surface is a public derivative and can never receive the private row id.
  const identity =
    mode.kind === "persisted"
      ? persistedIdentity(mode.resultRowId, routeContext)
      : legacyIdentity(routeContext);
  const recommendationPermitted =
    mode.kind !== "persisted" || mode.understanding.recommendationUsePermitted;
  // The frozen contract keeps the two permissions SEPARATE. Gating the report on the recommendation
  // flag would quietly grant one on the strength of the other.
  const continuityPermitted =
    mode.kind !== "persisted" || mode.understanding.continuityUsePermitted;
  const resultShareHref = buildPublicShareHref("/result/share", identity);
  // SHR-1 — the formal ShareObject flow is offered ONLY to the authenticated owner of a persisted
  // result, and ONLY when sharing.core is gated on AND schema-ready AND its store answered. Every
  // other case — legacy result, anonymous attempt view, gate off, schema not declared, store
  // unreachable — falls back to the EXISTING share behavior below, so a person always has a
  // working share action and never a dead CTA (the ARCH-P3 remediation lesson, applied here from
  // day one).
  // CPR-1 — the pair entry has the same owner+persisted precondition as the ShareObject entry
  // but its OWN gate: a deployment may have formal sharing on and pairing off, or the reverse.
  const pairInviteResultRowId =
    mode.kind === "persisted" && mode.isOwner && connectionOperational() ? mode.resultRowId : null;
  let shareObjectState: { resultRowId: string; activePublicId: string | null } | null = null;
  if (mode.kind === "persisted" && mode.isOwner && sharingOperational()) {
    try {
      const viewer = await getViewerContext();
      const shareOwnerId = viewer.account?.id || viewer.legacyAccount?.id;
      if (shareOwnerId) {
        const active = await activeShareForSource(
          shareOwnerId,
          IMAIRO_SHARE_SOURCE_FAMILY,
          mode.resultRowId,
          IMAIRO_SHARE_TEMPLATE_REF,
        );
        shareObjectState = { resultRowId: mode.resultRowId, activePublicId: active?.public_id ?? null };
      }
    } catch {
      shareObjectState = null;
    }
  }
  const recommendationHref = buildPrivateContinuityHref("/recommendations", identity);
  // The report is built from the ACCEPTED understanding: the machine's original assignment is
  // kept on the page for honesty, but the person's confirmed/corrected code decides what the
  // report is ABOUT. In persisted mode nothing accepted ⇒ no report entry (continuity is
  // withheld anyway); legacy mode has no interpretation and keeps the assignment code.
  const reportCode =
    mode.kind === "persisted"
      ? mode.understanding.acceptedResultId
      : compatibility.assignment?.publicCode ?? null;
  const reportEntryHref = reportCode ? buildSelfUnderstandingReportHref(reportCode) : null;
  // The report entry is private continuity: it must carry the stable identity so a return trip
  // resolves the same persisted record rather than re-deriving one from the public code.
  const fullReportHref = !continuityPermitted
    ? null
    : reportEntryHref && identity.mode === "persisted"
      ? buildPrivateContinuityHref(reportEntryHref, identity)
      : reportEntryHref;
  // Legacy mode has no stored answer and no owner, so it keeps its existing behaviour; only
  // persisted mode can withhold on the basis of a recorded response.
  const highlightSummary = buildHighlightSummary(compatibility.highlights);
  const publicTypeLabel = compatibility.assignment
    ? `${compatibility.assignment.clanJapanese}のタイプ`
    : "いま色テストの結果";

  return (
    // PXR-1 — the Result is a product surface, so it uses the product's page frame: the same
    // content width, canvas and rhythm as 今日. It previously had its own gradient background, its
    // own 42rem measure, and wrapped everything in one large white card, which is why it read as a
    // microsite that happened to be reachable from the app.
    <main className="mx-auto flex w-full max-w-[var(--pxr-content-width)] flex-col px-5 pb-24 pt-8 md:pt-14">
      <OpenTestingPageTracker
        eventName="result_viewed"
        route="/result"
        source="result_page"
        entrySource={payloadKey ? "payload" : "public-result"}
        resultId={resultId}
        overlayId={overlayId}
        confidence={confidenceBand}
      />
      <p className="sr-only">
        結果のまとめ: {compatibility.assignment ? `あなたのいま色は「${compatibility.assignment.nickname}」(${publicTypeLabel})。` : compatibility.displayLine}
        {highlightSummary} この結果は診断ではなく、いまの傾向のやわらかい整理です。以下の内容はアニメーションなしでもすべて読めます。
      </p>
      <RevealExperience stages={[
        /* The first viewport — PXR-1 recomposition.
         *
         * Canonical data and methodology are untouched: every value below is the same
         * `compatibility.*` field the page already resolved. What was fixed:
         *
         * 1. `recognitionLine` rendered twice — here and again in a 今の見え方 box directly
         *    beneath. The same sentence twice in one viewport reads as a bug, and it ate the
         *    space the primary action needed.
         * 2. Four badge treatments (two pills, a chip row, a secondary badge) preceded any
         *    meaning. Test name, type and framing are now one kicker and one quiet line, each
         *    fact appearing exactly once on the whole screen.
         * 3. `gentleNextStep` sat several stages down inside つぎの一歩. It is here now, and ONLY
         *    here. NOTE ON WHAT IT IS: a BEHAVIOURAL next step — an invitation to do something
         *    away from the screen ("…してみてください", as all 24 approved variants end) — not a
         *    control. Nothing in this stage is clickable, and that is the design: the first thing
         *    a person meets after being recognised should not be a button. Reading the report is
         *    a real call-to-action and it stays further down, after the recognition.
         * 4. The dark-green/serif system made this a microsite. It inherits the product frame,
         *    with persona expression as a LAYER — the display face is kept for the identity
         *    line alone, where it carries meaning rather than decorating.
         * 5. A card wrapped a gradient block which wrapped a chip row. Hierarchy is now carried
         *    by type and space.
         */
        <div key="hero" className="grid gap-6">
          <div className="grid gap-3">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
              {compatibility.brandedTestName}
            </p>
            {compatibility.assignment ? (
              <>
                <h1 className="display-serif text-[2.3rem] leading-[1.12] text-[var(--pxr-text-primary)] md:text-[2.9rem]">
                  {compatibility.assignment.nickname}。
                </h1>
                {/* One quiet line carries what the badge cluster used to: which type this is,
                    and what kind of reading it is. Both are approved copy; neither repeats the
                    kicker above. */}
                <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                  {publicTypeLabel}・{compatibility.currentStateNote}
                </p>
              </>
            ) : (
              <>
                <h1 className="display-serif text-[2.12rem] leading-[1.14] text-[var(--pxr-text-primary)] md:text-[2.9rem]">
                  {compatibility.displayLine}
                </h1>
                <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                  {compatibility.currentStateNote}
                </p>
              </>
            )}
            {/* The recognition, once. */}
            <p className="text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
              {compatibility.recognitionLine}
            </p>
          </div>

          {/* One suggested step, above the fold — a sentence, deliberately not a control. Paid
              conversion stays further down: it is offered after the person has been recognised,
              not before. */}
          <div className="grid gap-2">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
              今できること
            </p>
            <p className="text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
              {compatibility.gentleNextStep}
            </p>
          </div>
        </div>,

        /* `highlightSummary` is the highlights joined into one sentence. Placing it above the
           panel that then lists those same highlights individually says the same thing twice,
           adjacently. It stays where a joined sentence is actually useful — the screen-reader
           summary at the top of the document. */
        <EvidencePanel key="evidence" highlights={compatibility.highlights} />,

        <ConstellationPanel
          key="constellation"
          centerLabel={compatibility.assignment ? compatibility.assignment.nickname : "いまのあなた"}
          highlights={compatibility.highlights}
        />,

        <LimitsPanel key="limits" band={confidenceBand} />,

        /* つぎの一歩 is the OFFER: what there is to read next. It used to open by restating
           `gentleNextStep` verbatim — the same sentence the first viewport now leads with — which
           made the section look like it was starting over. The action lives above the fold; this
           section is the offer and nothing else. */
        <GentleActions key="actions">
          <div className="grid gap-3">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
              このあと読めるもの
            </p>
            <p className="text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
              まずは詳しいレポートを開き、必要なら今日のヒントをあとから見返せます。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {fullReportHref ? (
                <OpenTestingTrackingLink
                  href={fullReportHref}
                  tracking={{
                    reportEvent: {
                      eventType: "intent_clicked",
                      reportType: "self-understanding-v0.2.1",
                      route: "/result",
                      source: "result_page",
                      entrySource: payloadKey ? "payload" : "public-result",
                      resultId,
                      overlayId,
                      confidence: confidenceBand,
                    },
                  }}
                  className="inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-6 text-[15px] font-semibold text-white"
                >
                  今の詳しいレポートを読む
                </OpenTestingTrackingLink>
              ) : null}
              {/* Wave B: "deferred is not consent" is enforced in the PRODUCT, not only in the
                  database. Without an accepting answer the recommendation entry is not offered,
                  and the reason is stated instead of the control being silently missing. */}
              {recommendationPermitted ? (
                <Link
                  href={recommendationHref}
                  className="inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center text-[15px] font-medium text-[var(--pxr-accent)]"
                >
                  今のヒントを見る
                </Link>
              ) : (
                <p className="text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
                  この結果が合っているかを答えると、それに合わせたヒントを出せます。答えるまでは、この結果をもとに何かをすすめることはありません。
                </p>
              )}
            </div>
          </div>
        </GentleActions>,

        <div key="privacy-share" className="grid gap-4">
          <PrivacyPanel />
          <div className="grid gap-3 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] p-5">
            <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
              シェア
            </p>
            <p className="text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
              今の印象を短い言葉のまま残したいときだけ、ここからシェアできます。
            </p>
            {shareObjectState ? (
              <ShareObjectActions
                resultRowId={shareObjectState.resultRowId}
                activePublicId={shareObjectState.activePublicId}
              />
            ) : (
              <ResultShareActions
                shareUrl={resultShareHref}
                shareTitle={compatibility.brandedTestName}
                shareText={`${compatibility.shareLine}\n${compatibility.currentStateNote}`}
                shareCardUrl={resultShareHref}
                personaId={resultId ?? "imairo-placeholder"}
                shareSurface="result-page"
                showCopyLink={false}
              />
            )}
          </div>

          {pairInviteResultRowId ? (
            <div className="grid gap-3 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] p-5">
              <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                ふたりで見る
              </p>
              <p className="text-[14px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                選んだ相手と結果を並べて、似ているところと違うところを話すためのページを作れます。
              </p>
              <PairInviteActions resultRowId={pairInviteResultRowId} />
            </div>
          ) : null}

          <OpenTestingNotice
            body="現在は公開テスト中のため、結果から詳しいレポート、保存導線まで一通り試せます。わかりにくかった点や不具合があれば、この結果ページからそのまま送ってください。"
            primaryHref="/contact?topic=open-testing"
            primaryLabel="感想や不具合を送る"
            // The consent gate must hold on EVERY route to recommendations, including this
            // secondary link — otherwise the withheld entry is reachable one card lower.
            secondaryHref={fullReportHref ?? (recommendationPermitted ? recommendationHref : "/tests")}
            secondaryLabel={
              fullReportHref
                ? "詳しいレポートへ進む"
                : recommendationPermitted
                  ? "今のヒントを見る"
                  : "ほかのチェックを見る"
            }
          />
        </div>,
      ]} />

      {mode.kind === "persisted" ? (
        <div className="mt-5">
          <InterpretationResponse
            resultRowId={mode.resultRowId}
            isOwner={mode.isOwner}
            initial={{
              status: mode.understanding.status,
              resolved: mode.understanding.resolved,
              recommendationUsePermitted: mode.understanding.recommendationUsePermitted,
              continuityUsePermitted: mode.understanding.continuityUsePermitted,
            }}
            archetypes={PUBLIC_ARCHETYPE_TAXONOMY.map((a) => ({
              publicCode: a.publicCode,
              nickname: a.nickname,
              clanJapanese: a.clanJapanese,
            }))}
            originalResultId={resultId}
          />
        </div>
      ) : null}

      {compatibility.assignment ? (
        <div className="mt-5">
          <PrivateResultSave
            context={{
              resultId: compatibility.assignment.publicCode,
              overlayId,
              confidence: confidenceBand,
              payloadKey,
            }}
            resultRowId={identity.mode === "persisted" ? identity.persisted.resultRowId : null}
          />
        </div>
      ) : null}
    </main>
  );
}
