import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "今の自分を深く読むレポート | Yorisou",
  description: "今の状態の流れ、回復のリズム、人との距離感を整理するレポートです。無料チェックのあとに選べます。",
};

const SECTIONS = [
  "今の自分の状態の中心",
  "消耗しやすい場面と回復しやすいリズム",
  "人との距離感の今のパターン",
  "整えやすい方向のヒント",
  "7日間の小さな回復アクション",
] as const;

export default function ReportSelfPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F2_0%,#fffdf8_42%,#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem] space-y-8">

          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#49615B] hover:underline"
          >
            ← ホームへ戻る
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-[#F3FAF6] px-3 py-1 text-[11px] font-semibold text-[#3D6058]">
              自分理解
            </span>
            <h1 className="display-serif text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.5rem]">
              今の自分を深く読む
            </h1>
            <p className="text-[15px] leading-7 text-[#5F5750]">
              今の状態の流れ、回復のリズム、人との距離感を整理するレポートです。
            </p>
          </div>

          {/* Sections */}
          <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-6 space-y-4">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">レポートに含まれること（準備中）</p>
            <ul className="space-y-2.5">
              {SECTIONS.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-[14px] leading-7 text-[#2F2A28]">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#173B35]" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="rounded-[0.9rem] border border-[rgba(23,59,53,0.07)] bg-[#F3FAF6] px-4 py-3">
              <p className="text-[12px] leading-6 text-[#5F5750]">
                このレポートは医療的・専門的判断ではありません。自分の状態を整理する読み物です。購入や申込みが必要な内容ではありません。
              </p>
            </div>
          </div>

          {/* Status + CTA */}
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-[rgba(23,59,53,0.14)] bg-[#F8F7F4] px-4 py-2 text-[13px] font-semibold text-[#8A8078]">
              現在準備中です
            </div>
            <p className="text-[13px] leading-6 text-[#7A7068]">
              今は無料チェックだけ受けられます。結果のあとに整理したいことがあれば、そのときにまた戻ってきてください。
            </p>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.22)] bg-white px-5 text-[14px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
            >
              チェックを始める
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
