import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../components/Hero";
import MotionReveal from "../components/MotionReveal";

export const metadata: Metadata = {
  title: "Yorisouについて | 今の状態をふり返るライフステートチェック",
  description:
    "Yorisouは、今の状態をふり返り、自分に合う次の一歩を見つけるためのLINE/Webファーストのチェック体験です。診断や占いではなく、公開用の結果と自分だけのヒントを分けて届けます。",
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="Yorisouについて"
        title={
          <>
            <span className="block md:whitespace-nowrap">今の自分に、</span>
            <span className="block md:whitespace-nowrap">少し近づくためのチェック体験。</span>
          </>
        }
        subtitle="Yorisouは、いまの気分・考え方・行動のリズムをふり返り、公開しても安心な結果と、自分だけで読めるヒントを分けて届けるサービスです。"
        primaryHref="/check-in"
        primaryLabel="24問チェックをはじめる"
        secondaryHref="/insights"
        secondaryLabel="結果の見方を知る"
      />

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">Yorisouとは</p>
            <h2 className="section-title">Yorisouは、ライフステートを理解するための入口です</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              日々の選び方、休み方、人との距離感、考えがまとまるタイミング。そうした小さな傾向は、忙しい毎日の中では見えにくくなります。
            </p>
            <p className="page-copy" style={{ marginTop: 8 }}>
              Yorisouは、短いチェックを通じて「今の状態」を言葉にし、自分に合う次の一歩を考えやすくするためのプロダクトです。それは、あなたを決めつけるラベルではなく、今の状態を見つめるための入口です。
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">なぜ存在するか</div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  答えを決めつけるためではなく、考えやすくするために
                </h2>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  自分のことは、近すぎるからこそ見えにくいことがあります。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  Yorisouは、AIを使って結果やヒントを整理しますが、あなたの人生を代わりに決めるものではありません。結果は、いまの状態を少し離れた場所から眺めるための手がかりです。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  うまく言葉にできない感覚を、ひとつずつ扱いやすくする。Yorisouは、そのための軽い伴走者でありたいと考えています。
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={120} distance={18}>
              <div className="motion-card panel-sage rounded-[1.7rem] px-6 py-6">
                <div className="service-kicker text-[var(--accent-sage-text)]">最初にすること</div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  最初の入口は、24問チェックです
                </h2>
                <p className="page-copy" style={{ marginTop: 12, color: "var(--accent-sage-text)" }}>
                  質問は、医学的な診断や専門的な評価ではなく、今の生活リズムや感じ方をふり返るためのものです。深く考え込みすぎず、「今の自分に近い」と感じる選択肢を選んでください。
                </p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">チェックのあとに届くもの</div>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  チェック後には、まず公開しても安心な結果が表示されます。タイプ名、短い認識の言葉、いくつかの安全な傾向を確認できます。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  その先では、自分だけで読めるヒント、レポートのプレビュー、必要に応じたおすすめの入口につながります。LINEやWebであとから戻りやすくする導線も、順次整えています。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  おすすめは、たくさん並べるためのものではありません。今の状態に対して、次に試しやすい選択肢を少しだけ見つけるためのものです。
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={130} distance={18}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">Yorisouがしないこと</div>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  Yorisouは、医療・心理・法律・金融・進路などの専門判断を提供するサービスではありません。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  占いのように未来を断定するものでも、AIがあなたの代わりに人生を決めるものでもありません。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  また、移動支援、介護サービス、車両販売、行政サービス、専門相談の代替でもありません。必要な判断や支援がある場合は、適切な専門家や公的窓口に相談してください。
                </p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <MotionReveal delay={40}>
            <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
              <div className="service-kicker">公開されるものと、自分だけのものを分けます</div>
              <p className="page-copy" style={{ marginTop: 12 }}>
                Yorisouでは、公開してもよい結果と、自分だけで読む深いヒントを分けて扱います。
              </p>
              <p className="page-copy" style={{ marginTop: 8 }}>
                シェアできる内容には、弱さ・家庭事情・個別の悩み・推薦履歴・レポート内容などを含めません。自分を説明しやすくすることと、必要以上にさらけ出さないこと。その両方を大切にします。
              </p>
              <div className="mt-6">
                <p className="section-label">今の状態を、短くふり返ってみる</p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  まずは24問チェックから。LINEやWebであとから戻りやすくする導線も、順次整えています。
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/check-in" className="btn btn-primary">
                    24問チェックをはじめる
                  </Link>
                  <Link href="/services" className="soft-link">
                    サービスの流れを見る
                  </Link>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
