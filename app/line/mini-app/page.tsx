import type { Metadata } from "next";
import Link from "next/link";

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
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A9088]">
            今の状態に近い入口を選ぶ
          </p>
        </div>

        {/* Primary entry — quick_check */}
        <div
          className="mt-4 rounded-[1.4rem] p-5"
          style={{
            background: "rgba(23,59,53,0.04)",
            border: "1px solid rgba(23,59,53,0.12)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="signal-orb" aria-hidden="true" />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "#4D7A69" }}
            >
              おすすめ
            </span>
          </div>

          <h1
            className="display-serif mt-3 leading-[1.22] text-[#22201D]"
            style={{ fontSize: "1.55rem" }}
          >
            まずは120問から、<br />
            今の動き方を見ていく。
          </h1>

          <p className="mt-2 text-[13px] leading-[1.85] text-[#6F6760]">
            今の感覚に近いものをひとつずつ選ぶだけ。答えると、今のあなたに近い無料の結果が届きます。
          </p>

          <p className="mt-2 text-[11px] tracking-[0.06em] text-[#9A9088]">
            120問 · 無料 · ログインなし
          </p>

          <OpenTestingTrackingLink
            href={startHref}
            tracking={{ eventName: "open_testing_start_clicked", route: "/line/mini-app", source: "line_mini_app", entrySource: "line-mini-app" }}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-full text-[15px] transition active:scale-[0.975]"
            style={{
              background: "#173B35",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 12px 26px rgba(23,59,53,0.26)",
            }}
          >
            はじめる
          </OpenTestingTrackingLink>

          <p className="mt-2.5 text-center text-[10px] text-[#9A9088]">
            診断ではありません
          </p>
          <p className="mt-2 text-[11px] leading-5 text-[#7A7068]">
            LINEから結果を受け取ると、結果の確認や関連するお知らせをLINEで受け取れる状態が有効になることがあります。不要な場合は停止できます。
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
          <p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#9A9088" }}
          >
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
