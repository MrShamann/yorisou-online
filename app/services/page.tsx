import Image from "next/image";
import Hero from "../components/Hero";
import Section from "../components/Section";
import CardGrid from "../components/CardGrid";

export default function ServicesPage() {
  return (
    <main>
      <Hero
        title="事業内容"
        subtitle="導入前の調査から実証運用、評価レポートまでを一気通貫で支援し、地域に適した移動モデルを構築します。"
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image src="/images/illustrations/services-scene.svg" alt="事業内容のイメージ" width={1000} height={620} style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <Section label="Service 01" title="調査・計画策定">
        <CardGrid>
          <article className="card"><h3>課題整理</h3><p className="muted">移動課題を対象者、時間帯、ルート単位で具体化します。</p></article>
          <article className="card"><h3>関係者調整</h3><p className="muted">自治体、施設、地域事業者間の役割分担を明確化します。</p></article>
          <article className="card"><h3>評価設計</h3><p className="muted">利用実績、安全指標、運用負荷などの評価項目を定義します。</p></article>
        </CardGrid>
      </Section>

      <Section label="Service 02" title="実証運用">
        <CardGrid>
          <article className="card"><h3>運行設計</h3><p className="muted">運行時間帯、導線、利用条件を現場に合わせて設計します。</p></article>
          <article className="card"><h3>安全管理</h3><p className="muted">点検、記録、異常時フローを運用手順として標準化します。</p></article>
          <article className="card"><h3>現場伴走</h3><p className="muted">運用開始後の調整と課題解決を定期的に支援します。</p></article>
        </CardGrid>
      </Section>

      <Section label="Service 03" title="評価・改善提案">
        <CardGrid>
          <article className="card"><h3>実績分析</h3><p className="muted">利用実績、走行距離、満足度、ヒヤリハットを整理します。</p></article>
          <article className="card"><h3>提案作成</h3><p className="muted">課題別に改善提案を整理し、次期施策に接続します。</p></article>
          <article className="card"><h3>次段階計画</h3><p className="muted">拡張範囲、体制、予算感を含めた次フェーズ案を提示します。</p></article>
        </CardGrid>
      </Section>
    </main>
  );
}
