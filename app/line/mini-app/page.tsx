import type { Metadata } from "next";
import Link from "next/link";

import YorisouLogo from "@/app/components/YorisouLogo";

import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";
import { requireRecommendationContext } from "@/lib/server/canonicalResultContext";
import { loadRecommendationSet } from "@/lib/server/recommendationStore";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import CanonicalRecommendationList from "@/app/recommendations/CanonicalRecommendationList";
import RecommendationWithheld from "@/app/recommendations/RecommendationWithheld";
import PersistedResultUnavailable from "@/app/result/PersistedResultUnavailable";
import { OpenTestingPageTracker, OpenTestingTrackingLink } from "@/app/components/OpenTestingTracker";

export const metadata: Metadata = {
  title: "Yorisou | チェックを始める",
  description: "今の状態に近い入口を選んで、軽く整理するチェックを始められます。",
};

const currentTests = [
  {
    id: "relationship-fatigue",
    kicker: "関係疲れ",
    title: "人との距離感や疲れ方を見直す",
    href: "/tests/relationship-fatigue",
  },
  {
    id: "love-distance",
    kicker: "恋愛・距離感",
    title: "恋愛や親密さの距離感を整理する",
    href: "/tests/love-distance",
  },
] as const;

const comingSoonTests = [
  "仕事・リズム",
  "生活・回復",
  "月次チェック",
] as const;

// UX-2R / CPC-1 — LINE has TWO structurally separate modes.
//
// Before this, one page served both and claimed things neither could support: recommendations
// "based on recent diagnoses and interests" (there was no canonical read at all) and
// "LINE / Web 継続用 · ログインなし" (private continuation without authentication, which is not a
// thing this product does or should do). LINE was effectively its own truth.
//
// CANONICAL RETURN MODE — `?result=<row-id>` present. Exclusively canonical: the same loader, the
// same owner authorization and the same permissions as Web. No LINE-specific result, recommendation
// or feedback record exists anywhere.
//
// ANONYMOUS ENTRY MODE — no identity. Offers starting a check and nothing else. It must not imply
// a personal history it cannot read.
export default async function MiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawRowId =
    typeof resolvedSearchParams?.result === "string" ? resolvedSearchParams.result : null;

  if (rawRowId) {
    const loaded = await requireRecommendationContext(rawRowId);
    if (loaded.outcome === "unavailable") return <PersistedResultUnavailable />;

    const resultHref = `/result?result=${encodeURIComponent(loaded.context.resultRowId)}`;
    if (loaded.outcome === "withheld") {
      return (
        <RecommendationWithheld status={loaded.context.status} resultHref={resultHref} />
      );
    }

    const viewer = await getViewerContext();
    const ownerId = viewer.account?.id || viewer.legacyAccount?.id;
    if (!ownerId) return <PersistedResultUnavailable />;

    const recs = await loadRecommendationSet(loaded.context.resultRowId, ownerId, "line");
    if (recs.outcome === "withheld") {
      return <RecommendationWithheld status={loaded.context.status} resultHref={resultHref} />;
    }
    if (recs.outcome !== "ok") return <PersistedResultUnavailable />;

    return (
      <main
        className="relative min-h-screen overflow-hidden bg-[#FBFAF6] text-[#22201D]"
        style={{ paddingBottom: "max(40px, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto w-full max-w-[30rem] px-4 py-6">
          <YorisouLogo />
          <h1 className="mt-4 text-[1.3rem] font-bold leading-[1.34] text-[#302A3D]">
            今の結果のあとに選べる、負担の少ない入口
          </h1>
          <p className="mt-2 text-[13px] leading-[1.85] text-[#6F6760]">
            Webで見ているものと同じ記録です。ここで選んだことも、そのまま残ります。
          </p>
          <div className="mt-5">
            {/* surface="line" — the same canonical action graph, attributed to where it happened. */}
            <CanonicalRecommendationList set={recs.set} surface="line" />
          </div>
          <Link href={resultHref} className="mt-6 inline-block text-[13px] font-semibold text-[#315F50] underline">
            結果に戻る
          </Link>
        </div>
      </main>
    );
  }

  const startHref = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: resolvedSearchParams || {} });

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#FBFAF6] text-[#22201D]"
      style={{ paddingBottom: "max(40px, env(safe-area-inset-bottom, 0px))" }}
    >
      <OpenTestingPageTracker eventName="line_entry_opened" route="/line/mini-app" source="line_mini_app" entrySource="line-mini-app" />
      {/* No return-session signal is emitted here. Anonymous entry has no session to return to,
          and recording one would make the analytics claim a continuity the runtime cannot read. */}
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(108,76,255,0.1) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto max-w-md px-5 pt-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <YorisouLogo variant="primary" size={26} />
          <span
            className="rounded-full px-3 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-[#067A34]"
            style={{ border: "1px solid rgba(6,199,85,0.3)", background: "rgba(6,199,85,0.08)" }}
          >
            LINE
          </span>
        </div>

        {/* No "continue where you left off" line: at this point nothing has been read, and there
            may be nothing to continue. */}

        <div
          className="mt-4 rounded-[1.4rem] p-5"
          style={{
            background: "rgba(108,76,255,0.05)",
            border: "1px solid rgba(233,230,243,1)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="signal-orb" aria-hidden="true" />
            <span className="text-[10px] font-semibold tracking-[0.08em]" style={{ color: "#5836EB" }}>
              おすすめ
            </span>
          </div>

          <h1
            className="mt-3 font-bold leading-[1.34] text-[#302A3D]"
            style={{ fontSize: "1.32rem" }}
          >
            まずは、今の状態を<br />
            軽く整理するところから。
          </h1>

          <p className="mt-2 text-[13px] leading-[1.85] text-[#6F6760]">
            チェックを終えると、その結果から選べる入口が表示されます。医療・心理診断ではなく、今の状態を見つめるための小さな手がかりです。
          </p>

          <p className="mt-2 text-[11px] text-[#9A9088]">
            保存された結果はここでは読み込みません。ログイン後の結果ページから開けます。
          </p>
        </div>


        <div className="mt-5 grid gap-2.5">
          <OpenTestingTrackingLink
            href={startHref}
            tracking={{ eventName: "open_testing_start_clicked", route: "/line/mini-app", source: "line_mini_app", entrySource: "line-mini-app" }}
            className="flex min-h-[52px] w-full items-center justify-center rounded-full text-[15px] transition active:scale-[0.975]"
            style={{
              background: "#6C4CFF",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 12px 26px rgba(108,76,255,0.3)",
            }}
          >
            120問から始める
          </OpenTestingTrackingLink>
        </div>

        <div className="mt-5">
          <div className="surface-link-row text-[13px] font-semibold text-[#315F50]">
            <Link href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low" className="hover:underline">
              レポートの見本を見る
            </Link>
            <Link href="/tests/local-life" className="hover:underline">
              暮らしの入口を見る
            </Link>
          </div>
          <p className="mt-1 text-[11px] leading-5 text-[#7A7068]">
            公開テスト案内や診断一覧から、気になる入口を選べます。不要なお知らせはいつでも止められます。
          </p>
        </div>

        {/* Current secondary tests */}
        <div className="mt-5 space-y-2">
          {currentTests.map((test) => (
            <Link
              key={test.id}
              href={test.href}
              className="flex items-center justify-between gap-3 rounded-[1.1rem] px-4 py-3.5 transition active:scale-[0.99]"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(129,122,150,0.16)",
              }}
            >
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.13em]"
                  style={{ color: "#9A9088" }}
                >
                  {test.kicker}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold leading-[1.5] text-[#22201D]">
                  {test.title}
                </p>
              </div>
              <span className="shrink-0 text-[18px] leading-none text-[#B0A89E]">›</span>
            </Link>
          ))}
        </div>

        {/* Coming soon section */}
        <div className="mt-10 border-t pt-6" style={{ borderColor: "rgba(129,122,150,0.12)" }}>
          <p className="mb-3 text-[10px] font-semibold tracking-[0.08em]" style={{ color: "#9A9088" }}>
            これから増えるチェック
          </p>
          <div className="space-y-1.5">
            {comingSoonTests.map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[0.9rem] px-4 py-3"
                style={{ background: "rgba(129,122,150,0.06)", border: "1px solid rgba(129,122,150,0.1)" }}
              >
                <span className="text-[13px] text-[#B0A89E]">{label}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: "rgba(129,122,150,0.1)", color: "#9A9088" }}
                >
                  準備中
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
