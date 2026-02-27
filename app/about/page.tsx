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

      <Section label="Profile" title="組織情報">
        <div className="card">
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 12 }}>
            <dt>組織名</dt><dd>YORISOU</dd>
            <dt>所在地</dt><dd>福岡県福岡市</dd>
            <dt>事業領域</dt><dd>地域モビリティ実証、運用設計、評価・改善提案</dd>
            <dt>主な対象</dt><dd>自治体、介護施設、医療機関、地域企業</dd>
          </dl>
        </div>
      </Section>
    </main>
  );
}
