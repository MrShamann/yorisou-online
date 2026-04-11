import type { Metadata } from "next";
import Link from "next/link";

import Hero from "../components/Hero";
import MotionReveal from "../components/MotionReveal";

const currentRole = [
  "予約前に、家族の不安や確認事項を整理する入口になること。",
  "本人、家族、地域の支援者が、同じ話題から次の一歩を考えられるようにすること。",
  "必要なときだけ、相談、導入、実証の入口へ静かにつなぐこと。",
];

const notRole = [
  "既存の送迎や予約システムを置き換えること。",
  "広い機能を並べるだけのプラットフォームになること。",
  "最初から多くを説明しすぎること。",
];

const growthPoints = [
  "今の相談入口を、必要な人にとってわかりやすく保つこと。",
  "小さな実証や導入の相談を、無理なく受けられる形で整えること。",
  "地域で続けやすい支え方を、落ち着いて積み重ねること。",
];

export const metadata: Metadata = {
  title: "Yorisouとは | 予約前の相談入口",
  description: "Yorisouは、予約型の移動を使う前に、家族の不安や運営側の確認事項を整理する相談入口です。",
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--text)]">
      <Hero
        eyebrow="Yorisouとは"
        title={
          <>
            <span className="block md:whitespace-nowrap">予約前の相談から、</span>
            <span className="block md:whitespace-nowrap">次の一歩を静かにつなぐ。</span>
          </>
        }
        subtitle="Yorisouは、予約型の移動を使う前に、家族の不安や運営側の確認事項を整理する入口です。ひなたが状況を受け取り、必要なときだけ相談、導入、実証へつなぎます。"
        primaryHref="/reservation-mobility-support"
        primaryLabel="予約型移動相談を見る"
        secondaryHref="/reservation-mobility-support#pilot-inquiry"
        secondaryLabel="導入・実証を相談する"
      />

      <section className="section section-wash">
        <div className="container">
          <MotionReveal className="section-header" delay={30}>
            <p className="section-label">今の役割</p>
            <h2 className="section-title">予約前の不安を整え、家族と運営側の次の一歩を見やすくします。</h2>
            <p className="page-copy" style={{ marginTop: 10 }}>
              Yorisouは、既存の送迎や予約システムを置き換えるものではありません。
              利用前に確認したいことを整理し、説明のやり直しや導入時の摩擦を減らすための入口です。
            </p>
          </MotionReveal>

          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionReveal delay={40}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">今できること</div>
                <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 12 }}>
                  {currentRole.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </MotionReveal>

            <MotionReveal delay={120} distance={18}>
              <div className="motion-card panel-sage rounded-[1.7rem] px-6 py-6">
                <div className="service-kicker text-[var(--accent-sage-text)]">今はしないこと</div>
                <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 12, color: "var(--accent-sage-text)" }}>
                  {notRole.map((item) => (
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
                <div className="service-kicker">どう育てるか</div>
                <h2 className="section-title" style={{ marginTop: 12 }}>
                  今の相談入口を保ちながら、必要な人にだけ静かに広げていく。
                </h2>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  ひなたは、まず相談しやすい入口として働きます。そのうえで、小さな実証や導入の相談が必要になったときだけ、落ち着いて次の窓口へつなぎます。
                </p>
                <p className="page-copy" style={{ marginTop: 12 }}>
                  福岡での対話や現場の学びを、無理のない形で積み重ねながら、日本の高齢社会に合う支え方を育てていきます。
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={130} distance={18}>
              <div className="motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.82)] px-6 py-6">
                <div className="service-kicker">大切にしていること</div>
                <ul className="list-clean page-copy" style={{ marginTop: 16, display: "grid", gap: 10 }}>
                  {growthPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/reservation-mobility-support" className="soft-link">
                    予約型移動相談
                  </Link>
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
