import type { Metadata } from "next";

import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";
import Section from "../components/Section";

export const metadata: Metadata = {
  title: "導入・実証 | Yorisou",
  description: "Yorisouの導入・実証は、高齢者とご家族の移動支援が地域で続けられるかを、相談体験と運用の両面から丁寧に確かめる取り組みです。",
};

const themes = [
  {
    title: "相談導線の確かめ",
    body: "ご本人、ご家族、地域の関係者が無理なく相談を始められるかを見ます。",
  },
  {
    title: "運用の続けやすさ",
    body: "現場での案内、共有、見直しが継続できる流れになっているかを確認します。",
  },
  {
    title: "導入判断の整理",
    body: "何を導入するかより先に、どの条件なら続けられるかを落ち着いて見極めます。",
  },
];

const deliverables = [
  "対象地域や利用場面に応じた相談・運用整理",
  "小規模導入や実証の進め方の設計",
  "現場で得られた気づきの共有と次の提案",
];

export default function PilotPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        title="導入・実証も、まずは暮らしに合うかを丁寧に見るところから始めます。"
        subtitle="Yorisouの導入・実証は、自治体、施設、地域事業者の方と一緒に、高齢者とご家族の移動支援が現場で続けられるかを確かめる取り組みです。福岡での学びも活かしながら、相談体験と運用の両方を見ていきます。"
        primaryHref="/contact"
        primaryLabel="導入・実証を相談する"
        secondaryHref="/services"
        secondaryLabel="サービスを見る"
      />

      <Section
        label="Approach"
        title="Yorisouが大切にしていること"
        lead="制度や計画だけでなく、実際に使う方、ご家族、運営する方の無理のなさを同時に見ます。"
      >
        <CardGrid minWidth={220}>
          {themes.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p className="muted">{item.body}</p>
            </article>
          ))}
        </CardGrid>
      </Section>

      <Section
        label="How We Support"
        title="ご相談から実施までの流れ"
        lead="導入の可否を急いで決めるのではなく、地域や現場に合う形を一緒に整理していきます。"
      >
        <div className="grid gap-4 md:grid-cols-4">
          {["課題の共有", "対象場面の整理", "小規模実施", "振り返りと次の提案"].map((item, index) => (
            <div key={item} className="rounded-[1.5rem] bg-[rgba(255,253,249,0.72)] px-5 py-5">
              <div className="text-sm tracking-[0.12em] text-[#87776b]">STEP {index + 1}</div>
              <div className="mt-3 text-lg leading-8 text-[var(--text)]">{item}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        label="What You Receive"
        title="導入・実証でご一緒できること"
      >
        <div className="rounded-[1.6rem] bg-[rgba(255,253,249,0.72)] px-6 py-6">
          <ul className="list-clean muted" style={{ display: "grid", gap: 10, margin: 0 }}>
            {deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}
