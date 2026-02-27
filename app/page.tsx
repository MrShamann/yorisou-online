import Link from "next/link";
import CTA from "./components/CTA";
import CardGrid from "./components/CardGrid";
import Hero from "./components/Hero";
import NewsTeaser from "./components/NewsTeaser";
import Section from "./components/Section";

export default function HomePage() {
  return (
    <main>
      <Hero
        title="高齢社会の『移動』を、福岡から。"
        subtitle="YORISOUは、地域の生活導線に即した小規模実証を通じて、安全性と継続運用性を検証し、自治体・地域機関とともに実装可能な移動モデルを構築します。"
        primaryHref="/contact"
        primaryLabel="お問い合わせ"
        secondaryHref="/pilot"
        secondaryLabel="実証実験を見る"
      />

      <Section
        label="課題認識"
        title="日常の短距離移動に、見えにくい不便が蓄積しています"
      >
        <CardGrid>
          <article className="card">
            <h3>短距離移動の空白</h3>
            <p className="muted">徒歩では負担が大きく、既存交通では過剰となる移動区間が地域に残されています。</p>
          </article>
          <article className="card">
            <h3>生活導線の分断</h3>
            <p className="muted">買い物・公共施設・交流拠点をつなぐ日常ルートに、継続的な移動支援が不足しています。</p>
          </article>
          <article className="card">
            <h3>介護・医療アクセス</h3>
            <p className="muted">通院や介護関連の移動負担が、本人・家族・支援者の運用負荷として顕在化しています。</p>
          </article>
        </CardGrid>
      </Section>

      <Section
        label="アプローチ"
        title="小規模・安全・検証可能を原則とした実装"
      >
        <CardGrid>
          <article className="card">
            <h3>小規模</h3>
            <p className="muted">対象エリアを絞り、関係者の合意形成と現場運用を丁寧に積み上げます。</p>
          </article>
          <article className="card">
            <h3>安全</h3>
            <p className="muted">運行ルール、点検、記録、教育を標準化し、予防的な安全管理を徹底します。</p>
          </article>
          <article className="card">
            <h3>検証可能</h3>
            <p className="muted">利用データと運用実績を可視化し、次段階判断に必要な根拠を明確化します。</p>
          </article>
        </CardGrid>
      </Section>

      <Section label="事業内容" title="導入フェーズに応じた3つの支援" lead="各支援の詳細は事業内容ページでご覧いただけます。">
        <CardGrid>
          <article className="card">
            <h3>計画策定支援</h3>
            <p className="muted">地域課題の整理、対象ルート設計、評価指標設定を支援します。</p>
          </article>
          <article className="card">
            <h3>実証運用支援</h3>
            <p className="muted">運用手順の整備、現場伴走、関係者調整を実施します。</p>
          </article>
          <article className="card">
            <h3>評価・次期計画支援</h3>
            <p className="muted">実証結果をレポート化し、改善提案と次フェーズ計画へ接続します。</p>
          </article>
        </CardGrid>
        <div style={{ marginTop: 16 }}>
          <Link href="/services" className="btn btn-secondary">
            事業内容の詳細へ
          </Link>
        </div>
      </Section>

      <Section label="Pilot Flow" title="実証実験の進め方（5ステップ）">
        <div className="card">
          <ol className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>相談</li>
            <li>設計</li>
            <li>実施</li>
            <li>評価</li>
            <li>レポート</li>
          </ol>
        </div>
      </Section>

      <Section label="連携先" title="地域の多様な主体との協働を前提とします">
        <CardGrid>
          <article className="card"><h3>自治体</h3><p className="muted">政策整合と公共性の観点から制度面の調整を行います。</p></article>
          <article className="card"><h3>介護施設</h3><p className="muted">利用者の日常行動に即した移動シナリオを設計します。</p></article>
          <article className="card"><h3>医療機関</h3><p className="muted">通院アクセスを踏まえた安全運行時間帯を設計します。</p></article>
          <article className="card"><h3>地域企業</h3><p className="muted">地域内で継続可能な運用体制を共同で整備します。</p></article>
        </CardGrid>
        <div style={{ marginTop: 16 }}>
          <Link href="/partners" className="btn btn-secondary">
            連携体制を見る
          </Link>
        </div>
      </Section>

      <Section label="お知らせ" title="最新情報">
        <NewsTeaser limit={3} />
      </Section>

      <CTA
        title="実証実験のご相談を受け付けています"
        description="地域の状況に応じて、初期ヒアリングから段階的に進行します。"
        href="/contact"
        label="お問い合わせへ"
      />
    </main>
  );
}
