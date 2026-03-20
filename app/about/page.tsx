import Image from "next/image";
import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";
import Section from "../components/Section";

export default function AboutPage() {
  return (
    <main>
      <Hero
        title="Yorisouについて"
        subtitle="Yorisouは、日本の高齢者とご家族の移動を支えるモビリティサービスプラットフォームです。相談支援、福岡での検証、インサイト分析を一体で進めながら、長期的なYorisou標準を育てていきます。"
        primaryHref="/ai-advisor"
        primaryLabel="モビリティ相談へ"
        secondaryHref="/insights"
        secondaryLabel="インサイトを見る"
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

      <Section label="Mission" title="高齢社会の移動を、本人と家族の双方にとって続けやすい形へ整える">
        <p className="muted">
          Yorisouが重視するのは、移動手段そのものよりも、暮らしの中で無理なく使い続けられることです。
          ご本人の安心感、ご家族の納得、地域での運用現実を同時に見ながら、日本のシニアモビリティにふさわしい支援のあり方を整えていきます。
        </p>
      </Section>

      <Section
        label="Two Integrated Cores"
        title="Yorisouは、サービスレイヤーとインテリジェンスレイヤーを分けずに設計します"
        lead="サービス提供と知見形成を別事業にせず、相互に循環させることを前提にしています。"
      >
        <CardGrid>
          <article className="card"><h3>モビリティサービス</h3><p className="muted">相談、選定支援、家族との意思決定、導入後支援までを一つの流れで整えます。</p></article>
          <article className="card"><h3>Insights / Intelligence</h3><p className="muted">高齢社会、地域交通、介護周辺の論点を継続的に分析し、サービス設計と将来戦略に返します。</p></article>
        </CardGrid>
      </Section>

      <Section label="基本方針" title="事業推進の基本方針">
        <CardGrid>
          <article className="card"><h3>法令・規範の順守</h3><p className="muted">関連法規、地域ルール、個人情報保護の観点を徹底します。</p></article>
          <article className="card"><h3>安全最優先</h3><p className="muted">ヒヤリハットを含む運用記録を蓄積し、予防型の改善を継続します。</p></article>
          <article className="card"><h3>地域共創</h3><p className="muted">自治体・施設・地域企業との対話に基づき、現実的な運用設計を行います。</p></article>
          <article className="card"><h3>長期視点</h3><p className="muted">単発導入ではなく、継続利用と将来の標準化まで見据えた判断を重視します。</p></article>
        </CardGrid>
      </Section>

      <Section
        label="Fukuoka Pilot Base"
        title="福岡は、Yorisouの出発点であり検証拠点です"
        lead="地域の暮らしに近い距離感で、相談体験から現場運用までを確かめるためのベースとして位置づけています。"
      >
        <CardGrid>
          <article className="card"><h3>プロダクトフィット確認</h3><p className="muted">どの選択肢が日本の利用環境に合うかを、実際の生活導線と利用目的に照らして検証します。</p></article>
          <article className="card"><h3>家族受容の観察</h3><p className="muted">ご本人だけでなく、ご家族が安心して説明を受け、納得できるかを確認します。</p></article>
          <article className="card"><h3>運用フローの検証</h3><p className="muted">相談、案内、試用、導入後支援が現場で成立するかを整理し、改善します。</p></article>
          <article className="card"><h3>将来標準への反映</h3><p className="muted">福岡で得た学びを、今後のYorisou標準、支援体験、将来的なブランド設計に返していきます。</p></article>
        </CardGrid>
      </Section>

      <Section
        label="Brand Path"
        title="検証済みの選定支援から、Yorisouらしいブランド標準へ"
        lead="現段階では外部製品も活用しながら適合性を見極めていますが、長期的には知見をYorisouとして統合する方向を見据えています。"
      >
        <div className="card" style={{ display: "grid", gap: 14 }}>
          <p style={{ margin: 0 }}>
            私たちは、現時点でフルラインアップの自社ハードウェアを持っているわけではありません。
            一方で、単なる製品仲介や輸入販売に留まる考え方でもありません。
          </p>
          <p style={{ margin: 0 }}>
            相談現場、福岡での実証、インサイト分析を通じて、日本の高齢者移動に本当に必要な要件を積み上げ、
            選定基準、説明の仕方、継続支援、将来的な製品・サービス標準までをYorisouとして一貫させていくことを目指しています。
          </p>
        </div>
      </Section>

      <Section label="代表情報" title="代表挨拶 / 代表略歴">
        <div className="card" style={{ display: "grid", gap: 14 }}>
          <h3 style={{ margin: 0 }}>代表挨拶（Founder Message）</h3>
          <p style={{ margin: 0, fontWeight: 700 }}>「グローバル経営の経験を、福岡から日本の高齢者移動へ」</p>
          <p style={{ margin: 0 }}>
            私はこれまで自動車産業において、グローバル規模の産業プロジェクトおよび事業統括に携わってきました。
            欧州系自動車部品企業にて経営レベルでの事業推進を担当し、世界主要自動車メーカーとの協業を通じて、車載電子および電動化関連領域の製品導入と量産化を推進してきました。
          </p>
          <p style={{ margin: 0 }}>
            現在は福岡を拠点とし、日本の超高齢社会における移動課題に対し、実証と検証を重ねながら、持続可能なモビリティモデルの構築に取り組んでいます。
          </p>
          <p style={{ margin: 0 }}>
            Yorisouは単なる製品販売ではなく、相談支援、実証、編集知見を重ねながら、日本に適した移動のあり方を設計するモビリティ基盤です。
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
