import type { Metadata } from "next";
import Link from "next/link";

import { buildMiniAppCheckInHandoffHref } from "@/lib/server/miniAppEntryRouting";

export const metadata: Metadata = {
  title: "Yorisou | チェックを始める",
  description: "今の状態に合う入口を選んで、軽く整理するチェックを始められます。",
};

const secondaryTests = [
  {
    id: "relationship-fatigue",
    title: "人との距離感や疲れ方を見直す",
    href: "/tests/relationship-fatigue",
  },
  {
    id: "love-distance",
    title: "恋愛や親密さの距離感を整理する",
    href: "/tests/love-distance",
  },
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
      style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Ambient glow — CSS only, no JS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(23,59,53,0.09) 0%, transparent 68%)",
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

        {/* Hero */}
        <div className="mt-11 space-y-5">
          <div className="flex items-center gap-2">
            <span className="signal-orb" aria-hidden="true" />
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "#4D7A69" }}
            >
              クイックチェック
            </p>
          </div>

          <h1
            className="display-serif leading-[1.2] text-[#22201D]"
            style={{ fontSize: "1.85rem" }}
          >
            まずは24問で、<br />
            今の自分を整理する。
          </h1>

          <p className="text-[14px] leading-[1.85] text-[#6F6760]">
            今の感覚に近いものをひとつずつ選ぶだけ。<br />
            答えると、今の自分に近い無料の結果が届きます。
          </p>

          <p className="text-[12px] tracking-[0.06em] text-[#9A9088]">
            24問 · 3分ほど · 無料
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mt-9">
          <Link
            href={startHref}
            className="flex min-h-[56px] w-full items-center justify-center rounded-full text-[16px] tracking-[0.02em] text-white transition active:scale-[0.975]"
            style={{
              background: "#173B35",
              fontWeight: 800,
              boxShadow: "0 14px 30px rgba(23,59,53,0.28)",
            }}
          >
            クイックチェックを始める
          </Link>
          <p className="mt-3 text-center text-[11px] leading-6 text-[#9A9088]">
            ログインなし · 診断ではありません
          </p>
        </div>

        {/* Secondary tests — intentionally below fold */}
        <div className="mt-20 border-t pt-5" style={{ borderColor: "rgba(23,59,53,0.07)" }}>
          <p
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#9A9088" }}
          >
            ほかのチェック
          </p>
          <div className="space-y-1">
            {secondaryTests.map((test) => (
              <Link
                key={test.id}
                href={test.href}
                className="flex items-center justify-between gap-2 py-2 text-[13px] text-[#6F6760] transition hover:text-[#22201D]"
              >
                <span>{test.title}</span>
                <span className="text-[#B0A89E]">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
