import Image from "next/image";
import Link from "next/link";
import CTA from "../components/CTA";
import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";
import Section from "../components/Section";

export default function PilotPage() {
  return (
    <main>
      <Hero
        title="福岡パイロット"
        subtitle="Yorisouにとって福岡は、単なる地域事例ではなく、利用者適合、家族受容、運用成立性、将来標準化を確認するための戦略的な検証拠点です。"
        primaryHref="/contact"
        primaryLabel="導入・実証を相談する"
        secondaryHref="/about"
        secondaryLabel="Yorisouの考え方を見る"
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image src="/images/illustrations/pilot-scene.svg" alt="実証実験イメージ" width={1000} height={620} style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <Section label="Role of Fukuoka" title="福岡パイロットの目的">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            福岡パイロットでは、安全性、受容性、運用負荷を同時に見ながら、どのような相談導線と支援体験が日本の高齢者移動に合うのかを検証します。
            目的は、地域に合う導入判断と、将来のYorisou標準づくりの両方に必要な学びを得ることです。
          </p>
        </div>
      </Section>

      <Section label="Validation Themes" title="主な検証テーマ" lead="車両モデル名ではなく、生活導線と支援体験を基準に設計します。">
        <CardGrid>
          <article className="card"><h3>生活支援ルート型</h3><p className="muted">住宅地から商業施設・公共施設までの短距離移動について、日常利用のしやすさを確認します。</p></article>
          <article className="card"><h3>通院アクセス型</h3><p className="muted">診療所・薬局へのアクセス改善をテーマに、時間帯と支援導線の適合性を確かめます。</p></article>
          <article className="card"><h3>介護施設連携型</h3><p className="muted">施設利用者の外出機会創出と、運用者負荷を抑えた支援モデルの成立性を検証します。</p></article>
        </CardGrid>
      </Section>

      <Section label="Process" title="実証プロセス（6ステップ）">
        <div className="card">
          <ol className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
            <li>事前相談・課題整理</li>
            <li>対象エリア・導線設計</li>
            <li>運用手順・安全計画策定</li>
            <li>現場実施・運行管理</li>
            <li>中間評価・改善調整</li>
            <li>最終評価・次段階計画</li>
          </ol>
        </div>
      </Section>

      <Section label="What We Observe" title="主な観察項目">
        <CardGrid>
          <article className="card"><h3>利用実績</h3><p className="muted">利用回数、時間帯別利用、再利用率</p></article>
          <article className="card"><h3>移動量</h3><p className="muted">移動距離、ルート別利用傾向、所要時間</p></article>
          <article className="card"><h3>利用者評価</h3><p className="muted">満足度、安心感、要望項目、家族の納得感</p></article>
          <article className="card"><h3>安全指標</h3><p className="muted">ヒヤリハット件数、近接事象、運用是正履歴</p></article>
          <article className="card"><h3>運用負荷</h3><p className="muted">人員工数、問い合わせ件数、保守対応頻度</p></article>
        </CardGrid>
      </Section>

      <Section label="Outputs" title="成果物">
        <CardGrid>
          <article className="card"><h3>Pilot Report</h3><p className="muted">実績値と定性評価を統合した報告書</p></article>
          <article className="card"><h3>改善提案</h3><p className="muted">課題別の運用改善提案と優先順位</p></article>
          <article className="card"><h3>次段階計画</h3><p className="muted">対象拡張の条件、体制案、実施ロードマップ、Yorisou標準への反映事項</p></article>
        </CardGrid>
      </Section>

      <Section
        label="Strategic Meaning"
        title="福岡での学びは、今後のYorisouのサービス標準に返していきます"
        lead="外部ソリューションの適合性を見極めるだけでなく、将来的にYorisouとして何を標準化すべきかを見定める役割も持たせています。"
      >
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            福岡パイロットは、地域ごとの導入支援と並行して、相談の進め方、説明のしやすさ、支援継続の要件を蓄積する場所です。
            この知見が、将来的なYorisouブランドの設計思想と品質基準の土台になります。
          </p>
        </div>
      </Section>

      <Section label="よくあるご質問" title="よくあるご質問">
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
          <article className="card"><h3>Q. 実証期間はどの程度ですか。</h3><p className="muted">A. 地域状況に応じて、1〜3か月程度の小規模実証を基本としています。</p></article>
          <article className="card"><h3>Q. 実施前に必要な準備はありますか。</h3><p className="muted">A. 関係者ヒアリング、対象導線の現地確認、運用ルールの合意形成を実施します。</p></article>
          <article className="card"><h3>Q. 実証後の継続導入支援は可能ですか。</h3><p className="muted">A. 可能です。評価結果を踏まえ、体制・予算・範囲を整理した次期計画と、継続支援の考え方をご提案します。</p></article>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/contact" className="btn btn-primary">お問い合わせへ</Link>
        </div>
      </Section>

      <CTA
        title="地域条件に応じた実証設計をご提案します"
        description="まずは対象地域と課題の概要をご共有ください。"
        href="/contact"
        label="相談を開始する"
      />
    </main>
  );
}
