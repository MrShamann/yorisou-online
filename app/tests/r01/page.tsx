import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ふたり恋愛相性診断 | Yorisou",
  description: "R01 ふたり恋愛相性診断は現在準備中です。",
};

export default function R01BlockedPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-[42rem] space-y-6">
          <div className="space-y-3">
            <p className="service-kicker">R01 準備中</p>
            <h1 className="display-serif text-[2rem] leading-[1.22] md:text-[2.6rem]">ふたり恋愛相性診断は、元データ確認後に公開します。</h1>
            <p className="text-[15px] leading-8 text-[#5F5750]">
              今回の第一段階公開では、R01 のレビュー済み元データ確認がまだ完了していません。公開前に内容を整え、安心して使える形にしてから追加します。
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-[rgba(23,59,53,0.1)] bg-white/88 p-5">
            <p className="text-[13px] leading-7 text-[#5F5750]">
              先に使える入口としては、今のわたしチェック、向いている働き方診断、職場環境フィット診断、今日のおみくじ、名前相性チェックがあります。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/tests"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white"
            >
              入口一覧に戻る
            </Link>
            <Link
              href="/tests/c02"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[14px] font-semibold text-[#315F50]"
            >
              今のわたしチェックを見る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
