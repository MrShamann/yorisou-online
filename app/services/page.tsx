import Image from "next/image";
import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";
import Section from "../components/Section";

export default function ServicesPage() {
  return (
    <main>
      <Hero
        title="導入・実証"
        subtitle="Yorisouは、福岡での検証知見を踏まえ、自治体・施設・地域事業者とともに高齢者移動の導入設計と実証運用を支援します。目的は単発イベントではなく、継続可能なサービスモデルの判断材料を整えることです。"
        primaryHref="/contact"
        primaryLabel="導入・実証を相談する"
        secondaryHref="/pilot"
        secondaryLabel="福岡での検証思想を見る"
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image src="/images/illustrations/services-scene.svg" alt="事業内容のイメージ" width={1000} height={620} style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <Section label="Support Area 01" title="導入前の調査・計画策定">
        <CardGrid>
          <article className="card"><h3>課題整理</h3><p className="muted">移動課題を対象者、時間帯、ルート、ご家族負担の観点から具体化します。</p></article>
          <article className="card"><h3>関係者調整</h3><p className="muted">自治体、施設、地域事業者間の役割分担を明確化し、現実的な実施条件を整えます。</p></article>
          <article className="card"><h3>評価設計</h3><p className="muted">利用実績だけでなく、受容性、安全性、運用負荷、継続判断の指標を設計します。</p></article>
        </CardGrid>
      </Section>

      <Section label="Support Area 02" title="小規模実証と現場運用">
        <CardGrid>
          <article className="card"><h3>運行設計</h3><p className="muted">運行時間帯、導線、利用条件を現場に合わせて設計します。</p></article>
          <article className="card"><h3>安全管理</h3><p className="muted">点検、記録、異常時フローを標準化し、現場で無理なく回る運用を検証します。</p></article>
          <article className="card"><h3>現場伴走</h3><p className="muted">運用開始後の調整、説明、相談導線まで含めて、立ち上がりを支援します。</p></article>
        </CardGrid>
      </Section>

      <Section label="Support Area 03" title="評価・改善提案">
        <CardGrid>
          <article className="card"><h3>実績分析</h3><p className="muted">利用実績、走行距離、満足度、ヒヤリハット、家族評価を整理します。</p></article>
          <article className="card"><h3>提案作成</h3><p className="muted">導入可否だけでなく、どの条件なら継続できるかまで含めて改善案をまとめます。</p></article>
          <article className="card"><h3>次段階計画</h3><p className="muted">拡張範囲、体制、予算感に加え、Yorisou標準へ返すべき学びを整理します。</p></article>
        </CardGrid>
      </Section>

      <Section
        label="Positioning"
        title="導入・実証は、サービスとブランド標準を磨くための実務プロセスです"
        lead="地域パートナー向け支援でありながら、Yorisouの将来プロダクト設計にもつながる検証レイヤーとして位置づけています。"
      >
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            実証の目的は、実績を作ること自体ではありません。利用者に合う選択肢、説明のしやすさ、運用負荷、継続条件を見極め、
            将来のYorisouサービス標準とブランドの方向性に返せる学びを得ることにあります。
          </p>
        </div>
      </Section>
    </main>
  );
}
