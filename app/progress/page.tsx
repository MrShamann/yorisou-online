export default function ProgressPage() {
  return (
    <main style={{ background: "#f6f3ec", minHeight: "100vh" }}>
      <section style={{ padding: "64px 0 28px", borderBottom: "1px solid #e4dfd6" }}>
        <div className="container">
          <h1 style={{ margin: 0, fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1.35 }}>
            実証準備の進捗状況（2026年1月〜現在）
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">現在までの取り組み</h2>
          <p style={{ marginTop: 16 }}>
            2026年1月7日、日本に入国後、Yorisouは福岡市を拠点に地域モビリティ実証の準備を開始しました。
          </p>
          <p>
            これまでの主な進捗は以下の通りです：
          </p>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>合同会社（GK）設立準備の開始</li>
            <li>福岡市西区今宿にて共有オフィス拠点を確保</li>
            <li>公式ウェブサイト公開</li>
            <li>地域モビリティ実証の基本設計および運用構造の整理</li>
            <li>高齢社会における移動課題に関する初期調査の実施</li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">2026年7月までの重点計画</h2>
          <p style={{ marginTop: 16 }}>
            Yorisouは、2026年7月までに以下の段階的な準備を進めます。
          </p>

          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Phase 1（3月）</h3>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>会社設立完了</li>
            <li>事業基盤の整備（銀行口座・契約関係）</li>
          </ul>

          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Phase 2（4月〜5月）</h3>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>地域ヒアリングおよび実証候補フィールドの選定</li>
            <li>小規模実証モデル（3〜5台規模）の運用設計</li>
            <li>安全管理・保険方針の整備</li>
          </ul>

          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Phase 3（6月）</h3>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>実証実行計画の確定</li>
            <li>事業計画の最終整理</li>
            <li>行政および地域機関との調整</li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">基本方針</h2>
          <p style={{ marginTop: 16 }}>
            Yorisouは、行政予算に依存することなく、
            小規模実証を通じて持続可能な地域モビリティモデルを構築することを目指しています。
            地域の生活動線に沿った現実的な運用モデルを検証し、
            安全性と継続性を重視した設計を行います。
          </p>
        </div>
      </section>
    </main>
  );
}
