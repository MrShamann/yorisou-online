import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "人間関係の疲れチェック | Yorisou",
  description:
    "会う・返す・合わせる。今どこに負担が出ているかを小さく整理するためのチェックです。近日公開予定です。",
};

export default function RelationshipFatiguePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_42%,_#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-[42rem] space-y-8">
          <div className="space-y-2">
            <p className="service-kicker">人間関係の疲れチェック</p>
            <h1 className="display-serif text-[2rem] leading-[1.25] md:text-[2.6rem]">
              会う・返す・合わせる。<br />
              <span className="text-[#173B35]">今の負担を、少し整理する。</span>
            </h1>
          </div>

          <div className="rounded-[1.45rem] border border-[rgba(23,59,53,0.12)] bg-white/90 p-6 shadow-[0_16px_40px_rgba(23,59,53,0.07)] space-y-4">
            <div className="inline-flex rounded-full bg-[#F3FAF6] px-4 py-2 text-[13px] font-semibold text-[#173B35]">
              近日公開
            </div>
            <p className="text-[15px] leading-8 text-[#5F5750]">
              人間関係の疲れチェックは現在準備中です。
              まずは「今の自分」チェックから始めることができます。
            </p>
            <p className="text-[13px] leading-7 text-[#7A7068]">
              診断や相手への判断をするものではありません。今どこに負担が出ているかを、自分のペースで整理するためのチェックです。
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-[rgba(217,130,86,0.14)] bg-[#FFF7EC]/70 px-5 py-4">
            <p className="text-[13px] font-semibold leading-6 text-[#6B4E3F]">
              人間関係の結論や相手への判断を決めるものではありません。
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              今すぐ使えるチェックはこちらです。
            </p>
            <Link
              href="/check-in"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[15px] font-semibold text-white shadow-[0_16px_32px_rgba(23,59,53,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
            >
              今の自分をチェックする
            </Link>
            <div className="pt-1">
              <Link
                href="/"
                className="text-[13px] leading-6 text-[#49615B] underline-offset-2 hover:underline"
              >
                ← トップに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
