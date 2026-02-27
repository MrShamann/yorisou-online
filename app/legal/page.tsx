import Hero from "../components/Hero";
import Section from "../components/Section";

export default function LegalPage() {
  return (
    <main>
      <Hero
        title="利用規約・プライバシーポリシー"
        subtitle="本サイトの利用条件および個人情報の取り扱いについて記載しています。"
      />

      <Section label="Terms" title="利用規約">
        <div className="card">
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
            <li>本サイトの内容は、予告なく変更または停止する場合があります。</li>
            <li>本サイトの情報利用により生じた損害について、当社は故意または重過失を除き責任を負いません。</li>
            <li>本サイトに掲載される文章・画像等の著作権は、当社または正当な権利者に帰属します。</li>
          </ul>
        </div>
      </Section>

      <Section label="Privacy" title="プライバシーポリシー">
        <div className="card">
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
            <li>取得する情報は、お問い合わせ対応および連携検討の目的で利用します。</li>
            <li>法令に基づく場合を除き、本人の同意なく第三者提供を行いません。</li>
            <li>取得した個人情報は、適切な安全管理措置のもとで保管・管理します。</li>
          </ul>
        </div>
      </Section>

      <Section label="Disclaimer" title="免責事項">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            本サイトに記載された内容は、実証検討時点の情報を含みます。実際の運用や導入判断にあたっては、関係法令、地域条件、関係者協議結果を踏まえた最終確認が必要です。
          </p>
        </div>
      </Section>
    </main>
  );
}
