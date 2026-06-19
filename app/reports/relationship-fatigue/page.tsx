import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "人間関係の疲れを、もう少し深く読む | Yorisou",
  description: "返信・予定・距離・回復の視点から、今の疲れ方を静かに読み直すレポートです。医療・心理診断ではありません。",
};

const REPORT_SECTIONS = [
  "今の疲れ方の見取り図",
  "人との距離で消耗しやすい場面",
  "無理して合わせているサイン",
  "守りたい距離感",
  "回復しやすい整え方",
  "次の7日間の小さな行動",
  "LINEで見返すためのメモ",
] as const;

const SAMPLE_SECTIONS = [
  {
    title: "今の疲れ方の見取り図",
    body: "今のあなたは、人との関係を雑にしたいわけではなく、むしろ丁寧に扱おうとして疲れやすくなっている可能性があります。誘われたときにすぐ断れない。返事を短くすると冷たく見えないか気になる。会っている間は普通にふるまえるけれど、帰ったあとにぐったりする。そうした小さな負担が、あとからまとまって「人と関わるのが少し重い」という感覚になっているかもしれません。",
  },
  {
    title: "守りたい距離感",
    body: "今守りたいのは、「相手と離れること」よりも、「すぐに反応しなくてもいい余白」かもしれません。返信をすぐに返さない時間、予定をその場で決めず一度持ち帰る時間、会ったあとに何もしない時間。この距離は冷たさではありません。関係を続けるために必要な間隔です。使いやすい言葉としては、「少し確認してから返すね」「今日はゆっくりしたいから、また別の日にしたい」のような短い表現が合いそうです。",
  },
  {
    title: "回復しやすい整え方",
    body: "回復の入口は、大きな決断ではなく、負担をひとつ軽くすることです。返信・予定・SNS・会った後の休み方のうち、いちばん小さく変えられそうなものをひとつ選んでみてください。返信なら短く返す。予定なら一度持ち帰る。会ったあとなら次の予定を詰めずに10分だけ何もしない時間を置く。あなたに必要なのは、人間関係を一気に整理することではなく、自分が戻ってこられる余白を先に確保することです。",
  },
  {
    title: "次の7日間の小さな行動",
    body: "この7日間は、人間関係を変えようとしすぎず、「ひとつだけ軽くする」期間にしてみましょう。1日目は今いちばん重い連絡や予定をひとつ思い浮かべます。2日目は、それに対してすぐ返す以外の選択肢を書き出します。3日目は、短く返す・一度持ち帰る・今日は休む、のどれかを選びます。4日目以降は、その選択をしたあとに自分の疲れがどう変わったかを見ます。うまくできたかどうかより「少し軽くなった場所があったか」を見ることが大切です。",
  },
  {
    title: "LINEで見返すためのメモ",
    body: "相手を大切にすることと、すぐに反応することは同じではありません。今の自分には、返す前・決める前・会った後に、少し余白を置くことが必要そうです。あとで見返すなら、「どの関係をどうするか」より先に、「どの場面で疲れが出たか」を見るところから始めてください。",
  },
] as const;

export default function ReportRelationshipFatiguePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F2_0%,#fffdf8_42%,#F3FAF6_100%)] text-[#2F2A28]">
      <div className="container py-10 md:py-14">
        <div className="mx-auto max-w-[44rem] space-y-10">

          {/* Back */}
          <Link
            href="/tests/relationship-fatigue"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#49615B] hover:underline"
          >
            ← 人間関係の疲れチェックへ戻る
          </Link>

          {/* ── 1. Hero ── */}
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#F3FAF6] px-3 py-1 text-[11px] font-semibold text-[#3D6058]">
              関係の疲れ
            </span>
            <h1 className="display-serif text-[2rem] leading-[1.2] text-[#2F2A28] md:text-[2.6rem]">
              人間関係の疲れを、<br className="hidden sm:block" />もう少し深く読む
            </h1>
            <p className="text-[15px] leading-7 text-[#5F5750]">
              無料結果で見えた疲れ方を、返信・予定・距離・回復の視点から静かに読み直すレポートです。関係を決めつけるものではなく、今の自分に必要な余白を見つけるために使えます。
            </p>
            <div className="rounded-[0.85rem] border border-[rgba(23,59,53,0.1)] bg-[#F3FAF6] px-4 py-2.5 inline-flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#49615B]">このページでは、支払いは発生しません。まずは内容のイメージを確認できます。</span>
            </div>
          </div>

          {/* ── 2. Preparation note ── */}
          <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.1)] bg-white/70 px-5 py-3.5">
            <p className="text-[12px] leading-6 text-[#7A7068]">
              このレポートは、今後の有料レポート候補として準備中です。表示内容や価格は、レビュー後に変更される場合があります。
            </p>
          </div>

          {/* ── 3. What this report helps you read ── */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">このレポートで読めること</p>
              <p className="text-[14px] leading-7 text-[#5F5750]">
                人との関わりでどこに疲れが出やすいか、どんな場面で無理して合わせやすいか、次の7日間に何を少し軽くできるかを整理します。
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {REPORT_SECTIONS.map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 rounded-[0.95rem] border border-[rgba(23,59,53,0.09)] bg-white/80 px-4 py-3"
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#173B35] text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-medium leading-6 text-[#2F2A28]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. Free vs deeper boundary ── */}
          <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-6 space-y-4">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">無料結果と深く読むレポートの違い</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[0.9rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] p-4 space-y-2">
                <p className="text-[12px] font-semibold text-[#3D6058]">無料結果に含まれること</p>
                <ul className="space-y-1 text-[12px] leading-6 text-[#5F5750]">
                  {["今の状態のタイプ名と基本的な認識","短いひとこと整理","小さな次の一歩","安全の注記"].map(t => (
                    <li key={t} className="flex items-start gap-1.5"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#49615B]" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[0.9rem] border border-[rgba(23,59,53,0.12)] bg-white p-4 space-y-2">
                <p className="text-[12px] font-semibold text-[#2F2A28]">深く読むレポートで加わること</p>
                <ul className="space-y-1 text-[12px] leading-6 text-[#5F5750]">
                  {["場面ごとの疲れ方の構造","無理して合わせているサインの読み方","守りたい距離感の言葉化","7日間の具体的な行動プラン","LINEで見返すためのメモ"].map(t => (
                    <li key={t} className="flex items-start gap-1.5"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#173B35]" />{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-[12px] leading-6 text-[#7A7068]">
              無料結果だけでも、今の状態を見直す入口として使えます。深く読むレポートは、必要なときにもう少し細かく整理するためのものです。
            </p>
          </div>

          {/* ── 5. Sample preview ── */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold tracking-[0.13em] text-[#49615B]">サンプルプレビュー</p>
              <p className="text-[17px] font-semibold leading-7 text-[#2F2A28]">
                距離を取りたいのに、気を使いすぎてしまう状態
              </p>
              <p className="text-[12px] leading-5 text-[#8A8078]">
                サンプル状態 — アーカイブタイプ「距離を整えたいタイプ」より抜粋。個人の結果は異なります。
              </p>
            </div>

            <div className="space-y-3">
              {SAMPLE_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="rounded-[1.2rem] border border-[rgba(23,59,53,0.09)] bg-white/90 p-5 space-y-2"
                >
                  <p className="text-[12px] font-semibold tracking-[0.1em] text-[#49615B]">{section.title}</p>
                  <p className="text-[13px] leading-7 text-[#2F2A28]">{section.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[0.9rem] border border-[rgba(23,59,53,0.07)] bg-[#F3FAF6] px-4 py-3">
              <p className="text-[12px] leading-6 text-[#7A7068]">
                これはサンプルプレビューです。実際のレポートは、あなたの回答結果にもとづいて構成されます。現在準備中です。
              </p>
            </div>
          </div>

          {/* ── 6. LINE CTA ── */}
          <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/80 px-5 py-5 space-y-4">
            <div className="space-y-1">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">LINEで結果をあとから見返す</p>
              <p className="text-[14px] font-semibold leading-6 text-[#2F2A28]">LINEであとから見返す</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="hidden sm:block shrink-0 rounded-[0.7rem] border border-[rgba(23,59,53,0.1)] bg-white p-1.5">
                <Image
                  src="/line/yorisou-line-miniapp-qr.png"
                  alt="YorisouのLINE Mini Appに繋がるQRコード"
                  width={80}
                  height={80}
                  className="rounded-[0.3rem]"
                  unoptimized
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[13px] leading-6 text-[#5F5750]">LINEでYorisouを開いて、今日の結果を保存する。</p>
                <p className="text-[11px] leading-5 text-[#9A918B]">保存や通知は、確認と同意のあとで使えます。現在準備中です。</p>
              </div>
              <Link
                href="/line/mini-app"
                className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-[rgba(23,59,53,0.22)] bg-white px-5 text-[13px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
              >
                LINEでYorisouを開く
              </Link>
            </div>
          </div>

          {/* ── 7. Start quiz CTA ── */}
          <div className="space-y-3">
            <Link
              href="/tests/relationship-fatigue"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#173B35] px-6 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(23,59,53,0.18)] transition hover:bg-[#0F2F2B]"
            >
              無料チェックを始める
            </Link>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/tests/relationship-fatigue" className="text-[12px] text-[#7A7068] hover:underline">
                今は無料結果だけ見る
              </Link>
              <span className="text-[#D4CCC6]">·</span>
              <Link href="/" className="text-[12px] text-[#7A7068] hover:underline">
                今日はここまでにする
              </Link>
              <span className="text-[#D4CCC6]">·</span>
              <Link href="/" className="text-[12px] text-[#7A7068] hover:underline">
                必要になったら、あとで深く読む
              </Link>
            </div>
          </div>

          {/* ── 8. Safety note ── */}
          <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.08)] bg-white/60 px-5 py-4">
            <p className="text-[11px] leading-6 text-[#8A8078]">
              このレポートは、医療・心理診断、治療、カウンセリング、専門的な対人関係の助言ではありません。つらさが強い、長く続く、生活に影響している場合は、信頼できる人や確認済みの相談先につながることも選択肢です。
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
