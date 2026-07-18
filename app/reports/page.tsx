import type { Metadata } from "next";
import Link from "next/link";

import { DomainHero, DomainSection } from "../components/aix3/DomainShell";

export const metadata: Metadata = {
  title: "深める | YORISOU レポート",
  description:
    "無料結果の先の、少し深い読みもの。決めつけではなく、次の一歩を考えるための読みものです。公開プレビューと、自分だけで読む本文を分けて扱います。表示順は買えません。",
};

// AIX-3C — Deepen domain landing. Explains deeper reading truthfully; no paid
// access / purchase state fabricated. Links to the real preview + reading routes.

const INCLUDES = [
  { title: "今の動き方の輪郭", body: "どんな場面で力を使いやすいか、どんなときに立ち止まりやすいか。" },
  { title: "整えやすいペース", body: "関係の距離や、仕事・生活で無理なく整えやすいリズムの手がかり。" },
  { title: "次の一歩の材料", body: "決めつけではなく、次に試しやすい小さな選択肢を考えるための読みもの。" },
] as const;

export default function ReportsLandingPage() {
  return (
    <main className="aix2">
      <DomainHero
        eyebrow="深める · Deepen"
        status="current"
        title={<>結果の先の、<span className="em">深い読みもの</span>。</>}
        lead="無料結果より少し具体的に、今の動き方を読むための読みものです。公開プレビューと、自分だけで読む本文を分けて扱います。医学的な診断ではありません。"
        primary={{ href: "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low", label: "レポートの見本を見る" }}
        secondary={{ href: "/check-in", label: "いまの状態をみる" }}
        seed="discover-next"
      />

      <DomainSection eyebrow="読めること" title="深めると、何が見えるか。">
        <div className="grid gap-4 md:grid-cols-3">
          {INCLUDES.map((c, i) => (
            <div key={c.title} className="aix2-panel p-6 aix2-rise" style={{ ["--d" as string]: `${i * 70}ms` }}>
              <p className="text-[16px] font-bold text-[color:var(--tx)]">{c.title}</p>
              <p className="mt-2 text-[13.5px] leading-7 aix2-mut">{c.body}</p>
            </div>
          ))}
        </div>
      </DomainSection>

      <DomainSection eyebrow="種類" title="今あるレポート。" tint tight>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="aix2-panel aix2-panel--now p-6">
            <div className="flex items-center gap-2">
              <span className="aix3-status aix3-status--current">いま使える</span>
            </div>
            <p className="mt-3 text-[16px] font-bold text-[color:var(--tx)]">自己理解レポート</p>
            <p className="mt-2 text-[13.5px] leading-7 aix2-mut">120問の結果から、今の動き方をやわらかく整理した読みもの。公開テスト中はプレビューの先の本文まで読めます。</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low" className="aix2-link">見本を開く →</Link>
              <Link href="/result?resultId=EM-AK&overlayId=balancing&confidence=low" className="aix2-link">結果ページの見本 →</Link>
            </div>
          </div>
          <div className="aix2-panel p-6">
            <div className="flex items-center gap-2">
              <span className="aix3-status aix3-status--prototype">プロトタイプ</span>
            </div>
            <p className="mt-3 text-[16px] font-bold text-[color:var(--tx)]">関係・仕事・学びの読みもの</p>
            <p className="mt-2 text-[13.5px] leading-7 aix2-mut">関係の距離や働き方のテーマに沿った読みものは、コンセプトとして設計を進めています。購入・決済はありません。</p>
            <div className="mt-4">
              <Link href="/contact?topic=open-testing" className="aix2-link">読みたいテーマを送る →</Link>
            </div>
          </div>
        </div>
      </DomainSection>

      <DomainSection eyebrow="つながり" title="保存や、次の入口と。">
        <p className="max-w-[42rem] text-[14px] leading-8 aix2-mut">
          読んだ内容は、この端末やLINEに残して見返せます（<Link href="/saved" className="aix2-link">残す・戻る</Link>）。今の状態に合う次の一歩は、理由つきのおすすめから探せます（<Link href="/recommendations" className="aix2-link">見つける</Link>）。公開してよい結果と、自分だけで読む本文は、いつも分けて扱います。
        </p>
      </DomainSection>
    </main>
  );
}
