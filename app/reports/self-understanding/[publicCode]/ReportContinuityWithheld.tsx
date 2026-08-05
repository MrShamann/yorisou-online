// UX-2R / CPC-1 §2 — continuity withheld for the private canonical report.
//
// Distinct from the concealed unavailable state: this viewer owns the result. What stops the page
// is their own unanswered, rejected or deferred interpretation. Continuity is a SEPARATE permission
// from recommendation, so this copy speaks about carrying the result forward into their own
// reading — not about hints.

import Link from "next/link";

import { MvpCard, MvpPill } from "@/app/components/MvpSurface";

const LINE: Record<string, string> = {
  unanswered:
    "まだ、この結果が合っているかを聞けていません。合っていない内容をもとに詳しいレポートを組み立てることはしたくないので、先に教えてください。",
  deferred:
    "「いまは決められない」を選んでいます。保留のあいだは、この結果を前提にした詳しいレポートは開きません。決められるようになったら、いつでも変えられます。",
  rejected:
    "「しっくりこない」を選んでいます。合っていない内容を土台にしたレポートはお見せしません。結果自体は残っているので、あとから選び直すこともできます。",
};

export default function ReportContinuityWithheld({
  status,
  resultHref,
}: {
  status: string;
  resultHref: string;
}) {
  return (
    <main className="frontstage-page">
      <div className="container py-12">
        <div className="mx-auto w-full max-w-[34rem] space-y-5">
          <MvpPill>レポートはまだ開いていません</MvpPill>
          <MvpCard className="space-y-4 p-5 sm:p-6">
            <h1 className="display-serif text-[2rem] leading-[1.16] md:text-[2.4rem]">
              先に、結果が合っているかを教えてください
            </h1>
            <p className="text-[14px] leading-7 text-[var(--muted)]">{LINE[status] ?? LINE.unanswered}</p>
            <Link
              href={resultHref}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#173B35] px-4 py-3 text-[15px] font-extrabold text-white"
            >
              結果に戻って答える
            </Link>
          </MvpCard>
        </div>
      </div>
    </main>
  );
}
