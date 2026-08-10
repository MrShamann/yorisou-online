// UX-2R / CPC-1 — the consent-withheld state for a recommendation destination.
//
// This is deliberately NOT the concealed "unavailable" state. The viewer demonstrably owns this
// result; nothing is hidden from them. What stops the page is their own unanswered, rejected or
// deferred interpretation — and saying so plainly is the whole point. A silent empty page would
// read as a bug and teach people that the product is broken rather than that it is waiting.

import Link from "next/link";

import { MvpCard, MvpPill } from "../components/MvpSurface";

const LINE: Record<string, string> = {
  unanswered:
    "まだ、この結果が合っているかを聞けていません。合っているかどうかを教えてもらえたら、それに合わせたヒントをお出しします。",
  deferred:
    "「いまは決められない」を選んでいます。保留は「はい」ではないので、この結果をもとに何かをすすめることはありません。決められるようになったら、いつでも変えられます。",
  rejected:
    "「しっくりこない」を選んでいます。合っていない内容をもとにヒントを出すことはしません。結果自体は消えていないので、あとから選び直すこともできます。",
};

export default function RecommendationWithheld({
  status,
  resultHref,
}: {
  status: string;
  resultHref: string;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_44%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="container py-12">
        <div className="mx-auto w-full max-w-[34rem] space-y-5">
          <MvpPill>ヒントはまだ出していません</MvpPill>
          <MvpCard className="space-y-4 p-5 sm:p-6">
            <h1 className="display-serif text-[2rem] leading-[1.16] md:text-[2.4rem]">
              先に、結果が合っているかを教えてください
            </h1>
            <p className="text-[14px] leading-7 text-[var(--muted)]">
              {LINE[status] ?? LINE.unanswered}
            </p>
            <Link
              href={resultHref}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#173B35] px-4 py-3 text-[15px] font-extrabold text-white"
            >
              結果に戻って答える
            </Link>
          </MvpCard>
        </div>
      </section>
    </main>
  );
}
