import type { Metadata } from "next";
import Link from "next/link";

import DteEventTracker from "../../components/DteEventTracker";

export const metadata: Metadata = {
  title: "詳細レポート サンプル | Yorisou",
  description:
    "Yorisou詳細レポートのサンプル抜粋です。実際のレポートはクイックチェックの回答結果にもとづいて構成されます。",
};

const sampleSections = [
  {
    chapter: "今の疲れ方の見取り図",
    body: "今のあなたは、人との関係を雑にしたいわけではなく、むしろ丁寧に扱おうとして疲れやすくなっている可能性があります。誘われたときにすぐ断れない。返事を短くすると冷たく見えないか気になる。会っている間は普通にふるまえるけれど、帰ったあとにぐったりする。そうした小さな負担が、あとからまとまって「人と関わるのが少し重い」という感覚になっているかもしれません。",
  },
  {
    chapter: "回復しやすい整え方",
    body: "回復の入口は、大きな決断ではなく、負担をひとつ軽くすることです。返信・予定・SNS・会った後の休み方のうち、いちばん小さく変えられそうなものをひとつ選んでみてください。あなたに必要なのは、人間関係を一気に整理することではなく、自分が戻ってこられる余白を先に確保することです。",
  },
] as const;

export default function ReportSamplePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F2_0%,#fffdf8_44%,#F3FAF6_100%)] text-[#2F2A28]">
      <DteEventTracker
        event="sample_report_opened"
        surface="report_sample"
        source="sample_page"
        locale="ja"
      />

      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem] space-y-8">

          {/* Back */}
          <Link
            href="/report-preview"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#49615B] hover:underline"
          >
            ← 詳細レポートへ戻る
          </Link>

          {/* Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-[#F3FAF6] px-3 py-1 text-[11px] font-semibold text-[#3D6058]">
                サンプル
              </span>
              <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.1)] bg-white/80 px-3 py-1 text-[11px] text-[#8A7764]">
                実際のレポートは回答にもとづきます
              </span>
            </div>
            <h1 className="display-serif text-[1.9rem] leading-[1.22] text-[#2F2A28] md:text-[2.4rem]">
              詳細レポート — サンプル抜粋
            </h1>
            <p className="text-[14px] leading-7 text-[#5F5750]">
              これは詳細レポートの一部を抜粋したサンプルです。実際のレポートは、クイックチェックの回答結果にもとづいて個別に構成されます。
            </p>
          </div>

          {/* Sample label */}
          <div className="rounded-[0.9rem] border border-[rgba(23,59,53,0.08)] bg-[#F4FAF7] px-4 py-3">
            <p className="text-[12px] leading-6 text-[#6F625C]">
              以下はアーカイブタイプ「距離を整えたいタイプ」を参照したサンプル状態です。個人の結果は異なります。
            </p>
          </div>

          {/* Sample sections */}
          <div className="space-y-4">
            {sampleSections.map((section) => (
              <div
                key={section.chapter}
                className="rounded-[1.2rem] border border-[rgba(23,59,53,0.09)] bg-white/90 p-5 space-y-2.5 shadow-[0_10px_24px_rgba(23,59,53,0.05)]"
              >
                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">{section.chapter}</p>
                <p className="text-[14px] leading-8 text-[#2F2A28]">{section.body}</p>
              </div>
            ))}
          </div>

          {/* Full report — free during open testing (SR-1: no fabricated lock) */}
          <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70 p-5 space-y-2">
            <p className="text-[13px] font-semibold text-[#315F50]">続きも、いま無料で読めます</p>
            <p className="text-[12px] leading-6 text-[#6F625C]">
              自己理解レポートは、公開テスト中は導入・本編・発展まで無料で読めます。チェックを終えると、あなたの結果に合ったレポートが開けます。支払いはありません。
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/reports"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[14px] font-bold text-white shadow-[0_14px_28px_rgba(23,59,53,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
            >
              自己理解レポートを見る
            </Link>
            <Link
              href="/start"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.16)] bg-white/80 px-6 text-[14px] font-medium text-[#315F50] transition hover:bg-white"
            >
              今の自分から始める
            </Link>
          </div>

          {/* Safety note */}
          <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.07)] bg-white/60 px-5 py-4">
            <p className="text-[11px] leading-6 text-[#8A8078]">
              このレポートは、医療・心理診断、治療、カウンセリング、未来予測ではありません。今の状態を整理し、小さな次の行動を考えるための自己理解レポートです。
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
