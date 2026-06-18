import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../components/Hero";
import MotionReveal from "../components/MotionReveal";

const serviceLayers = [
  {
    number: "1",
    heading: "今の状態をふり返るチェック",
    body: "最初の入口は、短いチェックです。質問は、病名や正解を探すものではありません。今の生活リズム、考え方、距離の取り方、回復しやすいタイミングなどを、答えやすい形でふり返るためのものです。現在の公開入口は、24問チェックです。",
  },
  {
    number: "2",
    heading: "公開しても安心な結果",
    body: "チェック後には、まず公開用の結果が表示されます。自分を説明しやすいタイプ名、短い認識の言葉、軽い傾向を確認できます。人に見せても困りにくい範囲に絞り、深い悩みや個別事情は含めません。",
  },
  {
    number: "3",
    heading: "自分だけで読めるヒントとレポートプレビュー",
    body: "公開用の結果だけでは見えにくい部分は、自分だけで読めるヒントとして扱います。今のリズム、迷いやすい場面、回復しやすいきっかけ、次に考えるとよさそうな問い。そうした内容を、必要以上に強く言い切らず、ふり返りやすい形で届けます。レポートプレビューでは、追加で読める内容の方向性を紹介します。",
  },
  {
    number: "4",
    heading: "おすすめは、少数で理由つき",
    body: "Yorisouのおすすめは、商品やサービスを大量に並べる場所ではありません。今の状態に対して、読んでみる、見返してみる、試してみる、少し整えてみる。そうした次の一歩につながる候補を、必要に応じて少数だけ提示します。おすすめには、なぜ表示されるのかが分かる言葉を添える方針です。",
  },
  {
    number: "5",
    heading: "LINE/Webで戻りやすくする導線",
    body: "一度のチェックだけで、状態をすべて理解することはできません。Yorisouは、LINE/Webで結果やヒントに戻りやすくする導線を整えていきます。「今は読むだけ」「あとで戻る」「次のチェックで変化を見る」。そうした軽い使い方を大切にします。",
  },
  {
    number: "6",
    heading: "将来のマッチング/サポート層",
    body: "将来的には、ユーザーの状態やフィードバックから、より合いやすいコンテンツ、レポート、リソース、選択肢を見つける仕組みを育てていきます。ただし、これは専門サービスの代替や、生活上の判断を請け負うものではありません。Yorisouが目指すのは、状態理解から次の選択肢までを丁寧につなぐことです。",
  },
];

export const metadata: Metadata = {
  title: "Yorisouのサービス | チェック、結果、ヒント、おすすめの流れ",
  description:
    "Yorisouは、今の状態をふり返るチェックから、公開しても安心な結果、自分だけのヒント、レポートプレビュー、LINE/Webで戻りやすくする導線、おすすめの入口までをつなぐプロダクトです。",
};

export default function ServicesPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="Yorisouのサービス"
        title={
          <>
            <span className="block md:whitespace-nowrap">チェックから、</span>
            <span className="block md:whitespace-nowrap">次の一歩までを軽くつなぐ。</span>
          </>
        }
        subtitle="Yorisouのサービスは、何かをすぐ売るための一覧ではありません。今の状態を知り、必要なヒントや選択肢に無理なく戻ってこられる流れをつくるものです。"
        primaryHref="/check-in"
        primaryLabel="24問チェックをはじめる"
        secondaryHref="/about"
        secondaryLabel="Yorisouについて"
      />

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">Yorisouの現在のサービス層</p>
            <h2 className="section-title">チェックから、次の一歩まで</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              Yorisouは、ひとつのチェックページだけで完結するサービスではありません。
            </p>
            <p className="page-copy" style={{ marginTop: 8 }}>
              今の状態をふり返るチェック、公開しても安心な結果、自分だけで読めるヒント、レポートのプレビュー、必要に応じたおすすめ、LINE/Webで戻りやすくする導線。これらをひとつの流れとして育てています。
            </p>
            <p className="page-copy" style={{ marginTop: 8, fontFamily: "monospace", fontSize: 13 }}>
              チェック → 状態の理解 → ヒント → 次の一歩 → ふり返り
            </p>
          </MotionReveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceLayers.slice(0, 3).map((item, index) => (
              <MotionReveal key={item.number} delay={80 + index * 60} distance={16}>
                <article className="motion-card rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-5 py-5">
                  <div className="service-kicker">{item.number}</div>
                  <h3 className="text-[1.05rem] font-medium leading-8 text-[var(--text)]" style={{ marginTop: 8 }}>
                    {item.heading}
                  </h3>
                  <p className="page-copy" style={{ marginTop: 8, fontSize: 14 }}>
                    {item.body}
                  </p>
                </article>
              </MotionReveal>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceLayers.slice(3).map((item, index) => (
              <MotionReveal key={item.number} delay={80 + index * 60} distance={16}>
                <article className="motion-card rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-5 py-5">
                  <div className="service-kicker">{item.number}</div>
                  <h3 className="text-[1.05rem] font-medium leading-8 text-[var(--text)]" style={{ marginTop: 8 }}>
                    {item.heading}
                  </h3>
                  <p className="page-copy" style={{ marginTop: 8, fontSize: 14 }}>
                    {item.body}
                  </p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">提供しないもの</div>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  Yorisouは、医療・心理・介護・法律・金融・進路などの専門助言サービスではありません。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  移動支援、車両販売、施設紹介、行政サービス、緊急支援を提供するものでもありません。
                </p>
                <p className="page-copy" style={{ marginTop: 8 }}>
                  また、おすすめを広告一覧や販売カタログとして扱うことも目指していません。
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={120} distance={18}>
              <div className="motion-card panel-sage rounded-[1.7rem] px-6 py-6">
                <div className="service-kicker text-[var(--accent-sage-text)]">まずは、今の状態を短く見る</div>
                <p className="page-copy" style={{ marginTop: 12, color: "var(--accent-sage-text)" }}>
                  サービスの入口は、24問チェックです。結果を見てから、必要なヒントや次の導線に進めます。
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/check-in" className="btn btn-primary">
                    24問チェックをはじめる
                  </Link>
                  <Link href="/about" className="soft-link">
                    Yorisouについて読む
                  </Link>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
