import type { Metadata } from "next";
import Link from "next/link";

import BrandMark from "../components/brand/BrandMark";

export const metadata: Metadata = {
  title: "オフライン | YORISOU",
  description: "接続が確認できないときの、YORISOU の案内ページです。",
};

// APP-1 — public-safe offline recovery shell. Precached by the service worker
// and served when a navigation fails offline. Carries NO server data and NO
// private state — only an honest message and safe local next steps.
export default function OfflinePage() {
  return (
    <main className="aix2">
      <section className="relative z-[1]">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-[36rem] text-center">
            <span className="inline-flex text-[color:var(--jade-bright)]">
              <BrandMark size={44} />
            </span>
            <p className="aix2-eyebrow mt-6">オフライン</p>
            <h1 className="aix2-serif mt-3 text-[2rem] font-semibold leading-[1.2] text-[color:var(--tx)] md:text-[2.6rem]">
              いまは、つながっていないようです。
            </h1>
            <p className="mt-4 text-[14px] leading-8 aix2-mut">
              電波やネットワークが戻ると、YORISOU をそのまま続けられます。この端末に保存した状態や、
              途中まで進めたチェックは、ここで消えることはありません。
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/" className="aix2-btn aix2-btn-primary">もう一度ひらく</Link>
              <Link href="/my-yorisou" className="aix2-btn aix2-btn-ghost">マイよりそうへ</Link>
            </div>
            <p className="mt-6 text-[12px] leading-6 aix2-faint">
              つながったあと、続きから始められます。保存はこの端末だけ、いつでも削除できます。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
