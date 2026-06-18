import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpSection } from "../components/MvpSurface";

export const metadata: Metadata = {
  title: "プライバシー | Yorisou",
  description:
    "ログインなしで始められる Yorisou の使い方と、公開結果・保存・診断ではないことを短く伝えるページです。",
};

const privacyPoints = [
  {
    title: "最初はログインなしで始められます",
    body: "最初のチェックインは、ログインなしで始められます。",
  },
  {
    title: "この端末内に簡易保存できます",
    body: "保存はブラウザ内だけの簡易保存です。アカウント保存やLINE連携は、実装されている場合だけ明示します。",
  },
  {
    title: "最初のチェックインでは個人情報を求めません",
    body: "名前、住所、家族介護の詳細など、個人を特定する情報は最初のチェックインでは求めません。",
  },
  {
    title: "公開結果と自分だけのヒントは分けます",
    body: "公開しやすい結果と、自分だけのヒントは分けて扱います。診断や医療・心理評価ではありません。",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(247,244,238,0.98)_35%,_rgba(240,244,236,0.98)_100%)] text-[var(--text)]">
      <section className="border-b border-[color:var(--line-soft)]">
        <div className="container py-12 md:py-16">
          <div className="max-w-[44rem] space-y-4">
            <p className="service-kicker">プライバシー</p>
            <h1 className="display-serif max-w-[12em] text-[2.28rem] leading-[1.22] md:text-[3rem]">
              はじめやすく、
              <span className="block text-[var(--accent-sage-text)]">境界はわかりやすく。</span>
            </h1>
            <p className="max-w-[38rem] text-[15px] leading-8 text-[var(--muted)]">
              Yorisou では、最初のチェックインを軽く始められることと、最初の結果と自分だけのヒントの境界がわかることを大切にしています。
            </p>
          </div>
        </div>
      </section>

      <MvpSection eyebrow="最初に伝えたいこと" title="使い方と境界を、短くお伝えします。">
        <div className="grid gap-4 md:grid-cols-2">
          {privacyPoints.map((point) => (
            <MvpCard key={point.title}>
              <div className="service-kicker">{point.title}</div>
              <p className="mt-3 text-[15px] leading-8">{point.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="安心して使うために"
        title="最初は、軽く試せる範囲だけを整えています。"
        lead="保存はこの端末内だけの簡易保存です。診断や医療・心理評価ではない形で、今の状態を受け取れます。"
        actions={
          <>
            <MvpActionLink href="/check-in" label="チェックインをはじめる" />
            <MvpActionLink href="/" label="ホームへ戻る" tone="secondary" />
          </>
        }
      >
        <MvpCard>
          <div className="service-kicker">補足</div>
          <p className="mt-3 text-[15px] leading-8">
            最初に見る結果には自分だけのヒントを含めません。最初のチェックインでは個人を特定する情報は求めず、この端末内の簡易保存だけを使います。
          </p>
        </MvpCard>
      </MvpSection>
    </main>
  );
}
