import Hero from "../components/Hero";
import Section from "../components/Section";
import CardGrid from "../components/CardGrid";

export default function PartnersPage() {
  return (
    <main>
      <Hero
        title="連携・パートナー"
        subtitle="YORISOUは、行政・地域機関・民間事業者との協働により、公共性と継続性を両立した運用体制を構築します。"
      />

      <Section label="Partnership" title="主な連携先">
        <CardGrid>
          <article className="card"><h3>自治体</h3><p className="muted">政策整合、公共性評価、地域調整</p></article>
          <article className="card"><h3>介護施設</h3><p className="muted">利用者導線把握、運用協力、評価協力</p></article>
          <article className="card"><h3>医療機関</h3><p className="muted">通院導線設計、時間帯調整、安全確認</p></article>
          <article className="card"><h3>地域企業</h3><p className="muted">運用支援、保守協力、地域実装支援</p></article>
        </CardGrid>
      </Section>

      <Section label="Policy" title="連携方針">
        <div className="card">
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>法令順守および個人情報保護を前提とした業務設計</li>
            <li>役割と責任範囲を明確化した合意形成</li>
            <li>実証で得られた知見の透明な共有と改善実行</li>
            <li>短期成果に偏らない長期的な地域価値創出</li>
          </ul>
        </div>
      </Section>
    </main>
  );
}
