import type { Metadata } from "next";
import Link from "next/link";

import YorisouCompanionCard from "@/app/components/YorisouCompanionCard";
import YorisouRecommendationSlot from "@/app/components/YorisouRecommendationSlot";
import { RecommendationSignalMountTracker } from "@/app/components/YorisouSignalTracker";
import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";
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

export default async function MiniAppEntryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const startHref = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: resolvedSearchParams || {} });

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#FBFAF6] text-[#22201D]"
      style={{ paddingBottom: "max(40px, env(safe-area-inset-bottom, 0px))" }}
    >
      <OpenTestingPageTracker eventName="line_entry_opened" route="/line/mini-app" source="line_mini_app" entrySource="line-mini-app" />
      <RecommendationSignalMountTracker
        signal={{
          source: "line_mini_app",
          signalType: "return_surface_viewed",
          testId: "current-state",
          recommendationMode: "return_session",
          pagePath: "/line/mini-app",
        }}
      />
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(23,59,53,0.08) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto max-w-md px-5 pt-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="display-serif text-[1.22rem] font-semibold tracking-[0.09em] text-[#22201D]">
            YORISOU
          </span>
          <span
            className="rounded-full px-3 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-[#4D7A69]"
            style={{ border: "1px solid rgba(23,59,53,0.14)", background: "rgba(23,59,53,0.05)" }}
          >
            LINE
          </span>
        </div>

        {/* Launcher headline */}
        <div className="mt-8">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#9A9088]">
            前回の続きから、少しだけ。
          </p>
        </div>

        <div
          className="mt-4 rounded-[1.4rem] p-5"
          style={{
            background: "rgba(23,59,53,0.04)",
            border: "1px solid rgba(23,59,53,0.12)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="signal-orb" aria-hidden="true" />
            <span className="text-[10px] font-semibold tracking-[0.08em]" style={{ color: "#4D7A69" }}>
              おすすめ
            </span>
          </div>

          <h1
            className="display-serif mt-3 leading-[1.22] text-[#22201D]"
            style={{ fontSize: "1.55rem" }}
          >
            最近の診断や関心をもとに、<br />
            次に試しやすい入口を出します。
          </h1>

          <p className="mt-2 text-[13px] leading-[1.85] text-[#6F6760]">
            最近の診断や関心をもとに、次に試しやすい入口を表示します。医療・心理診断ではなく、今の状態を見つめるための小さな手がかりです。
          </p>

          <p className="mt-2 text-[11px] text-[#9A9088]">
            LINE / Web 継続用 · ログインなし
          </p>
        </div>

        <div className="mt-5 space-y-2">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#4D7A69]">今日の返り道</p>
            <p className="mt-1 text-[12px] leading-6 text-[#7A7068]">
              まずは相棒で今の続き方をひとつ見て、その下で次の入口を選べます。
            </p>
          </div>
          <YorisouCompanionCard
            testId="current-state"
            source="line_mini_app"
            pagePath="/line/mini-app"
            mode="return_session"
            variant="return"
          />
        </div>

        <div className="mt-5">
          <YorisouRecommendationSlot
            testId="current-state"
            source="line_mini_app"
            pagePath="/line/mini-app"
            mode="return_session"
            title="前回の続き"
          />
        </div>

        <div className="mt-5 grid gap-2.5">
          <OpenTestingTrackingLink
            href={startHref}
            tracking={{ eventName: "open_testing_start_clicked", route: "/line/mini-app", source: "line_mini_app", entrySource: "line-mini-app" }}
            className="flex min-h-[52px] w-full items-center justify-center rounded-full text-[15px] transition active:scale-[0.975]"
            style={{
              background: "#173B35",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 12px 26px rgba(23,59,53,0.26)",
            }}
          >
            120問から始める
          </OpenTestingTrackingLink>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/tests"
              className="flex min-h-[48px] items-center justify-center rounded-[1rem] border border-[rgba(23,59,53,0.09)] bg-white/82 px-4 text-[13px] font-semibold text-[#173B35]"
            >
              テスト一覧
            </Link>
            <Link
              href="/open-testing"
              className="flex min-h-[48px] items-center justify-center rounded-[1rem] border border-[rgba(23,59,53,0.09)] bg-white/82 px-4 text-[13px] font-semibold text-[#173B35]"
            >
              公開テスト案内
            </Link>
          </div>
          <div className="surface-link-row text-[13px] font-semibold text-[#315F50]">
            <Link href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low" className="hover:underline">
              レポートの見本を見る
            </Link>
            <Link href="/tests/local-life" className="hover:underline">
              暮らしの入口を見る
            </Link>
          </div>
          <p className="mt-1 text-[11px] leading-5 text-[#7A7068]">
            まだ記録が少ない場合は、公開テスト案内や診断一覧から続けやすい入口を案内します。不要なお知らせはいつでも止められます。
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
                border: "1px solid rgba(23,59,53,0.09)",
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
        <div className="mt-10 border-t pt-6" style={{ borderColor: "rgba(23,59,53,0.07)" }}>
          <p className="mb-3 text-[10px] font-semibold tracking-[0.08em]" style={{ color: "#9A9088" }}>
            これから増えるチェック
          </p>
          <div className="space-y-1.5">
            {comingSoonTests.map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[0.9rem] px-4 py-3"
                style={{ background: "rgba(23,59,53,0.03)", border: "1px solid rgba(23,59,53,0.06)" }}
              >
                <span className="text-[13px] text-[#B0A89E]">{label}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: "rgba(23,59,53,0.06)", color: "#9A9088" }}
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
