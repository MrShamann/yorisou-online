import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../components/Hero";
import MotionReveal from "../components/MotionReveal";

const themes = [
  "ご本人、ご家族、地域の関係者が無理なく相談を始められるかを見ること。",
  "現場での案内、共有、見直しが、続けやすい流れになっているかを確かめること。",
  "何を導入するかより先に、どの条件なら続けられるかを落ち着いて見極めること。",
];

const deliverables = [
  "対象地域や利用場面に応じた相談・運用整理",
  "小規模導入や実証の進め方の設計",
  "現場で得られた気づきの共有と次の提案",
];

export const metadata: Metadata = {
  title: "導入・実証 | Yorisou",
  description: "Yorisouの導入・実証は、高齢者とご家族の移動支援が地域で続けられるかを、相談体験と運用の両面から丁寧に確かめる取り組みです。",
};

export default function PilotPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="導入・実証"
        title={
          <>
            <span className="block md:whitespace-nowrap">導入・実証も、</span>
            <span className="block md:whitespace-nowrap">まずは暮らしに合うかを丁寧に見ていきます。</span>
          </>
        }
        subtitle="Yorisouの導入・実証は、自治体、施設、地域事業者の方と一緒に、高齢者とご家族の移動支援が現場で続けられるかを確かめる取り組みです。相談体験と運用の両方を見ながら、無理のない形を整えていきます。"
        primaryHref="/contact"
        primaryLabel="導入・実証を相談する"
        secondaryHref="/services"
        secondaryLabel="支援内容を見る"
      />

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">大切にしていること</p>
            <h2 className="section-title">制度や計画だけでなく、暮らしの実感まで見ていきます。</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              実際に使う方、ご家族、運営する方の無理のなさを同時に見ながら、地域で続く形を一緒に確かめます。
            </p>
          </MotionReveal>

          <MotionReveal delay={90}>
            <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
            <ul className="list-clean page-copy" style={{ display: "grid", gap: 12, margin: 0 }}>
              {themes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
              <div className="service-kicker">進め方</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                ご相談から実施までを、急がずに整えます。
              </h2>
              <ol className="page-copy" style={{ marginTop: 16, paddingLeft: "1.25rem", display: "grid", gap: 10 }}>
                {["課題の共有", "対象場面の整理", "小規模実施", "振り返りと次の提案"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              </div>
            </MotionReveal>

            <MotionReveal delay={120} distance={18}>
              <div className="motion-card panel-sage rounded-[1.7rem] px-6 py-6">
              <div className="service-kicker text-[var(--accent-sage-text)]">ご一緒できること</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                導入・実証で、具体的にお手伝いできること。
              </h2>
              <ul className="list-clean page-copy" style={{ marginTop: 16, color: "var(--accent-sage-text)", display: "grid", gap: 10 }}>
                {deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-5">
                <Link href="/contact" className="soft-link">
                  お問い合わせ
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
