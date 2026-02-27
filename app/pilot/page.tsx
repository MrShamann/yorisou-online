import Link from "next/link";
import CTA from "../components/CTA";
import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";
import Section from "../components/Section";

export default function PilotPage() {
  return (
    <main>
      <Hero
        title="実証実験"
        subtitle="目的設定から評価報告まで、地域と合意形成しながら段階的に進める実証プログラムを提供します。"
        primaryHref="/contact"
        primaryLabel="実証の相談をする"
      />

      <Section label="Purpose" title="実証の目的">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            地域の移動課題に対し、安全性・受容性・運用負荷を同時に検証し、継続導入に向けた判断材料を整えることを目的とします。
          </p>
        </div>
      </Section>

      <Section label="Pilot Menus" title="実証メニュー（3シナリオ）" lead="車両モデル名ではなく、生活導線シナリオを基準に設計します。">
        <CardGrid>
          <article className="card">
            <h3>生活支援ルート型</h3>
            <p className="muted">住宅地から商業施設・公共施設までの短距離移動を支援します。</p>
          </article>
          <article className="card">
            <h3>通院アクセス型</h3>
            <p className="muted">診療所・薬局へのアクセス改善を目的に時間帯別運行を設計します。</p>
          </article>
          <article className="card">
            <h3>介護施設連携型</h3>
            <p className="muted">施設利用者の外出機会創出と運用者負荷の最適化を検証します。</p>
          </article>
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

      <Section label="Data" title="主な収集データ">
        <CardGrid>
          <article className="card"><h3>利用実績</h3><p className="muted">利用回数、時間帯別利用、再利用率</p></article>
          <article className="card"><h3>移動量</h3><p className="muted">移動距離、ルート別利用傾向、所要時間</p></article>
          <article className="card"><h3>利用者評価</h3><p className="muted">満足度、安心感、要望項目</p></article>
          <article className="card"><h3>安全指標</h3><p className="muted">ヒヤリハット件数、近接事象、運用是正履歴</p></article>
          <article className="card"><h3>運用負荷</h3><p className="muted">人員工数、問い合わせ件数、保守対応頻度</p></article>
        </CardGrid>
      </Section>

      <Section label="Deliverables" title="成果物">
        <CardGrid>
          <article className="card"><h3>Pilot Report</h3><p className="muted">実績値と定性評価を統合した報告書</p></article>
          <article className="card"><h3>改善提案</h3><p className="muted">課題別の運用改善提案と優先順位</p></article>
          <article className="card"><h3>次段階計画</h3><p className="muted">対象拡張の条件、体制案、実施ロードマップ</p></article>
        </CardGrid>
      </Section>

      <Section label="FAQ" title="よくあるご質問">
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
          <article className="card"><h3>Q. 実証期間はどの程度ですか。</h3><p className="muted">A. 地域状況に応じて、1〜3か月程度の小規模実証を基本としています。</p></article>
          <article className="card"><h3>Q. 実施前に必要な準備はありますか。</h3><p className="muted">A. 関係者ヒアリング、対象導線の現地確認、運用ルールの合意形成を実施します。</p></article>
          <article className="card"><h3>Q. 実証後の継続導入支援は可能ですか。</h3><p className="muted">A. 可能です。評価結果を踏まえ、体制・予算・範囲を整理した次期計画を提案します。</p></article>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/contact" className="btn btn-primary">お問い合わせへ</Link>
        </div>
      </Section>

      <CTA
        title="地域条件に応じた実証設計をご提案します"
        description="まずは対象地域と課題の概要をお知らせください。"
        href="/contact"
        label="相談を開始する"
      />
    </main>
  );
}
