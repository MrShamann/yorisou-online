import type { Metadata } from "next";

import Hero from "../components/Hero";
import Section from "../components/Section";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Yorisou",
  description:
    "Yorisouのプライバシーポリシーです。取得する情報、その利用目的、第三者提供、Cookie等、ユーザー情報の取扱いについて定めています。",
};

export default function PrivacyPage() {
  return (
    <main>
      <Hero
        title="プライバシーポリシー"
        subtitle="Yorisou（以下「当社」といいます。）は、本サービスにおけるユーザー情報の重要性を認識し、関連法令を踏まえ、以下のとおりプライバシーポリシーを定めます。"
      />

      <Section label="1" title="取得する情報">
        <div className="card">
          <div className="grid gap-4">
            <div>
              <p className="font-medium" style={{ marginBottom: 8 }}>
                (1) ユーザーが入力または提供する情報
              </p>
              <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
                <li>氏名または表示名</li>
                <li>メールアドレス</li>
                <li>パスワードその他認証に必要な情報</li>
                <li>LINEアカウント連携に伴い取得するユーザー識別情報、プロフィール情報その他ユーザーが許可した情報</li>
                <li>お問い合わせ内容</li>
                <li>アンケート、フォーム、診断回答その他ユーザーが本サービス上で入力した情報</li>
                <li>任意で登録したプロフィール情報</li>
              </ul>
            </div>
            <div>
              <p className="font-medium" style={{ marginBottom: 8 }}>
                (2) 本サービスの利用に伴って自動的に取得する情報
              </p>
              <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
                <li>端末情報、ブラウザ情報、IPアドレス、言語設定、参照元、アクセス日時</li>
                <li>Cookie、類似技術を用いて取得される識別子・利用履歴</li>
                <li>本サービス内での操作履歴、閲覧履歴、結果閲覧履歴、継続コンテンツ利用履歴</li>
                <li>エラー情報、ログ情報、パフォーマンス情報</li>
              </ul>
            </div>
            <div>
              <p className="font-medium" style={{ marginBottom: 8 }}>
                (3) 外部サービスから取得する情報
              </p>
              <p className="muted" style={{ margin: 0 }}>
                当社は、LINEその他の外部サービスと連携する場合、ユーザーが当該外部サービスを通じて当社への提供を許可した範囲で、当該情報を取得することがあります。
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section label="2" title="利用目的">
        <div className="card">
          <ol className="list-clean" style={{ margin: 0, display: "grid", gap: 8, paddingLeft: 18 }}>
            <li>本サービスの提供、本人確認、ログイン認証、アカウント管理のため</li>
            <li>診断の実行、結果表示、結果保存、継続コンテンツ提供のため</li>
            <li>ユーザーごとの利用状況に応じた表示最適化、品質改善、機能改善、新機能開発のため</li>
            <li>不正利用防止、セキュリティ確保、障害対応、監査対応のため</li>
            <li>お問い合わせ対応、重要なお知らせの通知、利用規約違反対応のため</li>
            <li>利用状況の分析、統計化、サービス改善のため</li>
            <li>法令または行政上の要請への対応のため</li>
          </ol>
        </div>
      </Section>

      <Section label="3" title="Cookie等の利用">
        <div className="card">
          <ol className="list-clean" style={{ margin: 0, display: "grid", gap: 8, paddingLeft: 18 }}>
            <li>当社は、本サービスの利便性向上、利用状況分析、表示最適化、不正防止等のためにCookieその他これに類する技術を利用することがあります。</li>
            <li>ユーザーは、ブラウザ設定によりCookieの受け取りを制限または無効化できる場合があります。ただし、その場合、本サービスの一部機能が正常に利用できなくなることがあります。</li>
          </ol>
        </div>
      </Section>

      <Section label="4" title="第三者提供">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            当社は、次の場合を除き、個人情報を第三者に提供しません。
          </p>
          <ol className="list-clean" style={{ marginTop: 12, display: "grid", gap: 8, paddingLeft: 18 }}>
            <li>ユーザー本人の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難である場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要があり、本人の同意を得ることが困難である場合</li>
            <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</li>
          </ol>
        </div>
      </Section>

      <Section label="5" title="業務委託">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            当社は、サービス運営、システム保守、クラウドインフラ、通知配信、分析その他の業務の一部を外部事業者に委託することがあります。この場合、当社は、委託先に対して必要かつ適切な監督を行います。
          </p>
        </div>
      </Section>

      <Section label="6" title="国外での取扱い">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            当社または委託先が利用するクラウド基盤その他のサービスの所在により、取得した情報が日本国外で保存または処理される場合があります。当社は、法令に従い、必要な安全管理措置を講じます。
          </p>
        </div>
      </Section>

      <Section label="7" title="安全管理措置">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            当社は、個人情報への不正アクセス、漏えい、滅失または毀損の防止その他個人情報の安全管理のために、組織的、人的、物理的および技術的な措置を講じるよう努めます。
          </p>
        </div>
      </Section>

      <Section label="8" title="保有期間">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            当社は、取得した情報を、利用目的の達成に必要な範囲で保有し、不要となった後は、法令上保存が必要な場合を除き、合理的な方法で削除または匿名化します。
          </p>
        </div>
      </Section>

      <Section label="9" title="ユーザーの請求">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            ユーザーは、法令の定めに従い、当社に対して、自己の個人情報の開示、訂正、追加、削除、利用停止等を求めることができます。請求方法は、当社が別途表示する窓口によるものとします。
          </p>
        </div>
      </Section>

      <Section label="10" title="未成年者">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            未成年のユーザーは、必要に応じて親権者その他法定代理人の同意を得たうえで本サービスを利用してください。
          </p>
        </div>
      </Section>

      <Section label="11" title="外部リンク">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            本サービスには外部サイトまたは外部サービスへのリンクが含まれる場合があります。リンク先における情報の取扱いについて、当社は責任を負いません。
          </p>
        </div>
      </Section>

      <Section label="12" title="本ポリシーの変更">
        <div className="card">
          <ol className="list-clean" style={{ margin: 0, display: "grid", gap: 8, paddingLeft: 18 }}>
            <li>当社は、必要に応じて本ポリシーを変更することがあります。</li>
            <li>変更後の本ポリシーは、本サービスまたはウェブサイト上に掲載した時点または別途定める効力発生日から効力を生じます。</li>
          </ol>
        </div>
      </Section>

      <Section label="13" title="お問い合わせ窓口">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            個人情報の取扱いに関するお問い合わせは、当社が本サービス上で別途表示する窓口までご連絡ください。
          </p>
        </div>
      </Section>

      <div className="container pb-12 text-xs text-[var(--muted)]">
        最終更新日：2026年4月14日
      </div>
    </main>
  );
}

