import Image from "next/image";
import Hero from "../components/Hero";
import Section from "../components/Section";
import CardGrid from "../components/CardGrid";

export default function AboutPage() {
  return (
    <main>
      <Hero
        title="私たちについて"
        subtitle="YORISOUは、高齢社会における移動課題を地域単位で解決するため、実証を軸に制度・運用・地域連携を統合した支援を行います。"
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image
              src="/images/illustrations/about-scene.svg"
              alt="組織紹介のイメージ"
              width={1000}
              height={620}
              style={{ width: "100%", height: "auto", borderRadius: 10 }}
            />
          </div>
        </div>
      </section>

      <Section label="Mission" title="地域の移動課題を、実装可能な形で改善する">
        <p className="muted">
          生活に必要な移動を持続的に支えるため、机上設計ではなく現場で検証可能な方法論を重視します。
          安全性、公共性、費用対効果を丁寧に確認しながら、段階的な社会実装を目指します。
        </p>
      </Section>

      <Section label="Value" title="事業推進の基本方針">
        <CardGrid>
          <article className="card"><h3>法令・規範の順守</h3><p className="muted">関連法規、地域ルール、個人情報保護の観点を徹底します。</p></article>
          <article className="card"><h3>安全最優先</h3><p className="muted">ヒヤリハットを含む運用記録を蓄積し、予防型の改善を継続します。</p></article>
          <article className="card"><h3>地域共創</h3><p className="muted">自治体・施設・地域企業との対話に基づき、現実的な運用設計を行います。</p></article>
          <article className="card"><h3>長期視点</h3><p className="muted">単発導入ではなく、継続可能な地域運用体制の構築を重視します。</p></article>
        </CardGrid>
      </Section>

      <Section label="Founder" title="代表挨拶 / 代表略歴">
        <div className="card" style={{ display: "grid", gap: 14 }}>
          <h3 style={{ margin: 0 }}>代表挨拶（Founder Message）</h3>
          <p style={{ margin: 0, fontWeight: 700 }}>「グローバル経営の経験を、福岡の地域課題へ」</p>
          <p style={{ margin: 0 }}>
            私はこれまで自動車産業において、グローバル規模の産業プロジェクトおよび事業統括に携わってきました。
            欧州系自動車部品企業にて経営レベルでの事業推進を担当し、世界主要自動車メーカーとの協業を通じて、車載電子および電動化関連領域の製品導入と量産化を推進してきました。
          </p>
          <p style={{ margin: 0 }}>
            現在は福岡を拠点とし、日本の超高齢社会における移動課題に対し、実証と検証を重ねながら、持続可能なモビリティモデルの構築に取り組んでいます。
          </p>
          <p style={{ margin: 0 }}>
            Yorisouは単なる製品販売ではなく、地域と連携しながら課題を構造的に分析し、日本に適した移動のあり方を設計するプロジェクトです。
          </p>

          <h3 style={{ margin: "6px 0 0" }}>代表略歴（Founder Profile）</h3>
          <p style={{ margin: 0 }}>Jin Yang（ヤン ジン）｜創業者・代表</p>

          <p style={{ margin: "6px 0 0", fontWeight: 700 }}>グローバル経営・事業統括経験</p>
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>自動車産業における20年以上の国際経営経験</li>
            <li>欧州系大手自動車部品企業にて、グローバル事業および産業プロジェクトを統括</li>
            <li>欧米主要自動車メーカーとの協業を通じ、車載電子・電動化関連分野の量産プロジェクトを推進</li>
            <li>グローバル規模でのサプライチェーンおよび産業化プロジェクトを統合管理</li>
          </ul>

          <p style={{ margin: "6px 0 0", fontWeight: 700 }}>起業・技術領域</p>
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>2021年、Miracle AI（邁瑞科）を創業</li>
            <li>自動運転関連技術および車載システム統合領域の開発に従事</li>
          </ul>

          <p style={{ margin: "6px 0 0", fontWeight: 700 }}>学歴</p>
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>IESEビジネススクール 経営学修士（MBA）取得</li>
            <li>ハーバード・ビジネス・スクール 一般経営プログラム（General Management Program）修了</li>
            <li>ハーバード大学 校友（Harvard University Alumni）</li>
          </ul>

          <p style={{ margin: "6px 0 0", fontWeight: 700 }}>言語</p>
          <p style={{ margin: 0 }}>
            中国語（母語）、英語、スペイン語、フランス語（中級）、日本語（学習・実践中）
          </p>
        </div>
      </Section>
    </main>
  );
}
