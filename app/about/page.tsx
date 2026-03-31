import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../components/Hero";
import MotionReveal from "../components/MotionReveal";

const principles = [
  "まず話を聞き、急いで答えを決めないこと。",
  "外出だけでなく、その先の暮らしの安心まで見ること。",
  "必要になったときだけ、製品、導入、継続支援へ丁寧につなぐこと。",
];

const trustPoints = [
  "高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添うこと。",
  "一度の案内で終わらせず、続けやすい支え方を整えていくこと。",
  "現場や地域での学びを、日々の支援に静かに活かし続けること。",
];

export const metadata: Metadata = {
  title: "Yorisouとは | 移動の不安から、暮らしの安心へ",
  description: "Yorisouは、高齢者とご家族の移動と暮らしにやさしく寄り添う支援サービスです。ひなたとの対話から状況を整理し、必要な支え方へつないでいきます。",
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="Yorisouとは"
        title={
          <>
            <span className="block md:whitespace-nowrap">Yorisouは、</span>
            <span className="block md:whitespace-nowrap">移動の不安から暮らしの安心へ寄り添う支援サービスです。</span>
          </>
        }
        subtitle="高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添うこと。まずは AI相談員 ひなた が状況を一緒に整理し、必要に応じて製品、導入、継続支援へ丁寧につないでいきます。"
        primaryHref="/support#scenario-assistant"
        primaryLabel="ひなたに相談する"
        secondaryHref="/services"
        secondaryLabel="支援内容を見る"
      />

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">Yorisouの考え方</p>
            <h2 className="section-title">移動の不安を減らし、年齢を重ねても自分らしく暮らせる社会へ。</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              私たちは、移動手段そのものだけではなく、その先にある暮らしの安心まで見ています。ご本人の気持ち、ご家族の納得、地域で続けやすい運用を重ねながら、無理のない支え方を整えていきます。
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="section section-wash" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
              <div className="service-kicker">大切にしていること</div>
              <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 12 }}>
                {principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              </div>
            </MotionReveal>

            <MotionReveal delay={120} distance={18}>
              <div className="motion-card panel-sage rounded-[1.7rem] px-6 py-6">
              <div className="service-kicker text-[var(--accent-sage-text)]">支え方の土台</div>
              <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 12, color: "var(--accent-sage-text)" }}>
                {trustPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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
              <div className="service-kicker">代表について</div>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                相談の入口と、地域での学びをつなぎ続けるために。
              </h2>
              <p className="page-copy" style={{ marginTop: 12 }}>
                Yorisouは、単なる製品紹介の場ではありません。移動に不安を感じたとき、まず落ち着いて話せる入口をつくり、その先の暮らしまで見通しながら、一人ひとりに合う支え方を考えるためのサービスです。
              </p>
              <p className="page-copy" style={{ marginTop: 12 }}>
                福岡での対話や導入検証を重ねながら、日本の高齢社会に本当に合う支援の形を丁寧に育てていきます。
              </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={130} distance={18}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
              <div className="service-kicker">代表略歴</div>
              <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <li>自動車産業で20年以上の国際事業経験</li>
                <li>欧州系自動車部品企業でグローバル事業・産業プロジェクトを統括</li>
                <li>電動化・車載電子関連の量産導入を推進</li>
                <li>現在は福岡を拠点に、日本の高齢者移動支援に取り組む</li>
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
