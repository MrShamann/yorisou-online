import type { Metadata } from "next";
import Link from "next/link";

import CardGrid from "../components/CardGrid";
import CTA from "../components/CTA";
import Hero from "../components/Hero";
import Section from "../components/Section";

export const metadata: Metadata = {
  title: "Yorisouについて | 移動の不安から、暮らしの安心へ",
  description: "Yorisouは、高齢者とご家族の移動と暮らしにやさしく寄り添う相談サービスです。ひなたとの対話から状況を整理し、必要な支え方へつないでいきます。",
};

const principles = [
  {
    title: "まず話を聞く",
    body: "すぐに答えを急がず、ご本人、ご家族、地域の状況を落ち着いて整理するところから始めます。",
  },
  {
    title: "暮らし全体で考える",
    body: "外出だけでなく、通院、買い物、ご家族との連絡、導入後の続けやすさまで含めて見ていきます。",
  },
  {
    title: "無理のない形でつなぐ",
    body: "必要に応じて、製品、サービス、導入相談、継続支援へ丁寧につなぎます。",
  },
];

const trustPoints = [
  "高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添うこと。",
  "一度の案内で終わらせず、続けやすい支え方を整えていくこと。",
  "現場や地域の運用も見ながら、導入の現実性を確かめること。",
];

export default function AboutPage() {
  return (
    <main className="bg-[#F7F0E5] text-[#312321]">
      <Hero
        title="Yorisouは、移動の不安から暮らしの安心へつないでいく相談サービスです。"
        subtitle="高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添うこと。まずは AI相談員 ひなた が状況を一緒に整理し、必要に応じて製品、サービス、導入相談、その後の支え方へ丁寧につないでいきます。"
        primaryHref="/support#scenario-assistant"
        primaryLabel="ひなたに相談する"
        secondaryHref="/services"
        secondaryLabel="サービスを見る"
      />

      <Section
        label="Mission"
        title="高齢者とご家族の移動と暮らしに、やさしく、誠実に寄り添う。"
        lead="Yorisouが目指しているのは、移動の不安を減らし、年齢を重ねても自分らしく外出し、暮らせる社会です。"
      >
        <div className="rounded-[1.9rem] border border-[#D8C6B4]/30 bg-white/72 p-6 shadow-[0_18px_38px_rgba(47,35,33,0.05)] md:p-8">
          <p className="m-0 max-w-3xl text-sm leading-8 text-[#5A4B3E] md:text-base">
            私たちは、移動手段そのものだけではなく、その先にある暮らしの安心まで見ています。ご本人の気持ち、
            ご家族の納得、地域で続けやすい運用を重ね合わせながら、無理のない支え方を整えていきます。
          </p>
        </div>
      </Section>

      <Section label="How We Work" title="Yorisouの支え方">
        <CardGrid minWidth={220}>
          {principles.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p className="muted">{item.body}</p>
            </article>
          ))}
        </CardGrid>
      </Section>

      <Section
        label="Trust"
        title="ひなたの相談体験と、現場での学びを同じサービスの中に持ち続けます"
        lead="ふだんの相談と、導入・実証の現場で得られる学びを切り離さず、サービスの質を静かに磨いていくことを大切にしています。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {trustPoints.map((item) => (
            <div key={item} className="rounded-[1.7rem] border border-[#E3D6C8]/70 bg-[#FFFBF6] px-5 py-5 text-sm leading-8 text-[#5A4B3E]">
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section
        label="Founder"
        title="代表について"
        lead="Yorisouは、グローバルな事業推進と自動車産業の経験を持つ代表が、日本の高齢社会に向けて立ち上げた取り組みです。"
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card">
            <h3>ごあいさつ</h3>
            <p className="muted">
              Yorisouは、単なる製品紹介の場ではありません。移動に不安を感じたとき、まず落ち着いて話せる入口をつくり、
              その先の暮らしまで見通しながら、一人ひとりに合う支え方を考えるためのサービスです。
            </p>
            <p className="muted">
              福岡での対話や導入検証を重ねながら、日本の高齢社会に本当に合う支援の形を丁寧に育てていきます。
            </p>
          </div>
          <div className="card">
            <h3>代表略歴</h3>
            <ul className="list-clean muted" style={{ display: "grid", gap: 8, margin: 0 }}>
              <li>自動車産業で20年以上の国際事業経験</li>
              <li>欧州系自動車部品企業でグローバル事業・産業プロジェクトを統括</li>
              <li>電動化・車載電子関連の量産導入を推進</li>
              <li>現在は福岡を拠点に、日本の高齢者移動支援に取り組む</li>
            </ul>
            <div className="mt-5">
              <Link href="/contact" className="btn btn-secondary">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <CTA
        title="まずは、ひなたに相談するところから始めませんか。"
        description="気になっていることがまだ曖昧でも大丈夫です。移動のこと、暮らしのことを一緒に整理しながらご案内します。"
        href="/support#scenario-assistant"
        label="ひなたに相談する"
      />
    </main>
  );
}
