import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "恋愛の距離感を深く読むレポート | Yorisou",
  description: "待ち方・近づき方・伝える前に整えたいことを、自分側から整理するレポートです。無料チェックのあとに選べます。",
};

const SECTIONS = [
  "今の恋愛距離感の中心",
  "待っている時間の重さ",
  "近づきたい気持ちと自分の余白",
  "伝える前に整えたい言葉",
  "7日間の小さな選択肢",
] as const;

export default function ReportLoveDistancePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F2_0%,#fffdf8_42%,#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem] space-y-8">

          {/* Back */}
          <Link
            href="/tests/love-distance"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#49615B] hover:underline"
          >
            ← 恋愛距離感チェックへ戻る
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-[#F3FAF6] px-3 py-1 text-[11px] font-semibold text-[#3D6058]">
              距離感
            </span>
            <h1 className="display-serif text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.5rem]">
              恋愛の距離感を深く読む
            </h1>
            <p className="text-[15px] leading-7 text-[#5F5750]">
              待ち方・近づき方・伝える前に整えたいことを、自分側から整理するレポートです。
            </p>
          </div>

          {/* Teaser */}
          <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-6 space-y-4">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              相手の気持ちを読むものではなく、あなた自身の距離感を整理するレポートです。連絡や関係の結論を急がず、今の自分を少し落ち着いて見たいときに読めます。
            </p>

            <p className="text-[13px] font-semibold tracking-[0.12em] text-[#49615B]">レポートに含まれること（準備中）</p>
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
                このレポートは相手の本心、関係の結論、将来の結果を判断するものではありません。医療的・専門的判断でもありません。
              </p>
            </div>
          </div>

          {/* Status + CTA */}
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-[rgba(23,59,53,0.14)] bg-[#F8F7F4] px-4 py-2 text-[13px] font-semibold text-[#8A8078]">
              現在準備中です
            </div>
            <p className="text-[13px] leading-6 text-[#7A7068]">
              今は無料チェックだけ受けられます。チェックを終えると、結果のあとにここへのリンクが表示されます。
            </p>
            <Link
              href="/tests/love-distance"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.22)] bg-white px-5 text-[14px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
            >
              恋愛距離感チェックを始める
            </Link>
          </div>

          {/* LINE CTA */}
          <div className="rounded-[1.25rem] border border-[rgba(23,59,53,0.1)] bg-white/80 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="hidden sm:block shrink-0 rounded-[0.7rem] border border-[rgba(23,59,53,0.1)] bg-white p-1.5">
              <Image src="/line/yorisou-line-miniapp-qr.png" alt="Yorisou LINE QR" width={72} height={72} className="rounded-[0.3rem]" unoptimized />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[12px] font-semibold tracking-[0.1em] text-[#49615B]">必要なら、もう少し深く読めます。</p>
              <p className="text-[13px] leading-6 text-[#5F5750]">LINEでYorisouを開いて、結果をあとから見返す。</p>
              <p className="text-[11px] leading-5 text-[#9A918B]">購入や申込みではありません。保存や通知は確認と同意のあとで使えます。</p>
            </div>
            <Link href="/line/mini-app" className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-full border border-[rgba(23,59,53,0.22)] bg-white px-4 text-[13px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]">
              LINEで開く
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
