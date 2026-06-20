import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpSection } from "../components/MvpSurface";

export const metadata: Metadata = {
  title: "Life-State Archetype の見方 | Yorisou",
  description:
    "Yorisou の Life-State Archetype が、24問の現在地チェックをどう扱うかを短く伝えるページです。",
};

const principles = [
  {
    title: "固定した性格ではなく、今の状態を見る",
    body: "Life-State Archetype は、ずっと変わらないラベルではなく、今の生活リズムや選び方の偏りを軽く受け取るための見方です。",
  },
  {
    title: "リズム・距離・決め方・戻り方を見る",
    body: "24問では、進むテンポ、人との距離感、決めるときの手触り、乱れたあとの戻り方などを小さく見ます。",
  },
  {
    title: "公開結果は軽く、安全な範囲にする",
    body: "最初に表示する結果は、名前・認識の一行・3つのチップ・今の状態の補助線だけに絞ります。回答内容や細かいスコアは出しません。",
  },
  {
    title: "見返しながら、変化を扱う",
    body: "この端末に保存して見返したり、別の日にまたチェックしたりしながら、今の状態の揺れをゆっくり扱えます。",
  },
];

const modelLayers = [
  "24問の回答から、今の傾向を6つの公開結果に寄せて整理します。",
  "負荷や広がり方は、4つの状態ラベルで補助的に添えます。",
  "自分だけで見返す保存や意向記録は、ブラウザ内だけに残します。",
] as const;

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(247,244,238,0.98)_35%,_rgba(240,244,236,0.98)_100%)] text-[var(--text)]">
      <section className="border-b border-[color:var(--line-soft)]">
        <div className="container py-12 md:py-16">
          <div className="max-w-[44rem] space-y-4">
            <p className="service-kicker">Life-State Archetype</p>
            <h1 className="display-serif max-w-[12em] text-[2.28rem] leading-[1.22] md:text-[3rem]">
              今の状態を、
              <span className="block text-[var(--accent-sage-text)]">固定せずに受け取る方法です。</span>
            </h1>
            <p className="max-w-[38rem] text-[15px] leading-8 text-[var(--muted)]">
              Yorisou は、診断でも占いでもありません。24問のチェックでは、今の暮らしのリズムや距離感、決め方、戻り方を見て、公開結果と自分だけの記録を分けて扱います。
            </p>
          </div>
        </div>
      </section>

      <MvpSection eyebrow="考え方" title="Life-State Archetype で大切にしていること。">
        <div className="grid gap-4 md:grid-cols-2">
          {principles.map((item) => (
            <MvpCard key={item.title}>
              <div className="service-kicker">{item.title}</div>
              <p className="mt-3 text-[15px] leading-8">{item.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection eyebrow="24問MVPの範囲" title="いま動いている範囲は、軽い現在地チェックです。">
        <MvpCard className="space-y-3">
          {modelLayers.map((item) => (
            <p key={item} className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-3 text-[14px] leading-7 text-[var(--text)]">
              {item}
            </p>
          ))}
        </MvpCard>
      </MvpSection>

      <MvpSection
        eyebrow="次の一歩"
        title="方法を見たら、軽く試してみるだけで十分です。"
        lead="まずはチェックインから始めて、結果のあとで必要な読みだけを選べます。"
        actions={
          <>
            <MvpActionLink href="/check-in" label="チェックインをはじめる" />
            <MvpActionLink href="/" label="ホームへ戻る" tone="secondary" />
          </>
        }
      >
        <MvpCard>
          <div className="service-kicker">受け取り方</div>
          <p className="mt-3 text-[15px] leading-8">
            今の状態やリズムを静かに見て、診断でも性格の決めつけでもない形で返します。最初の結果と、自分だけで見返す記録は分けて扱います。
          </p>
        </MvpCard>
      </MvpSection>
    </main>
  );
}
