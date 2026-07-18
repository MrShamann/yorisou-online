import type { Metadata } from "next";
import Link from "next/link";

import { DomainHero, DomainSection } from "../components/aix3/DomainShell";

export const metadata: Metadata = {
  title: "育てる | YORISOU 共創とフィードバック",
  description:
    "感想や共創で、これからの体験・資料・プロダクトを一緒に良くしていく領域です。参加は任意・許可制で、公開の強制はありません。表示順は買えません。購入や先行販売はありません。",
};

// AIX-3C — Co-Design & Improve domain. Individual participation (optional,
// permissioned, private-controlled) vs partner pathway (→ /partners). No
// pay-to-rank, no false commerce, no fabricated participation.

const WAYS: ReadonlyArray<{ title: string; body: string; status: "current" | "prototype" | "planned"; action?: { href: string; label: string } }> = [
  { title: "感想を送る", body: "使ってみて分かりにくかった点や、よかった点を、そのまま送れます。声は次の改善につながります。", status: "current", action: { href: "/contact?topic=open-testing", label: "感想を送る" } },
  { title: "アイデアを寄せる", body: "「こんな入口や読みものがあると助かる」を、軽く共有できます。採用の約束ではありません。", status: "current", action: { href: "/contact?topic=co-design", label: "アイデアを送る" } },
  { title: "コンセプト・プロトタイプ評価", body: "作る前のコンセプトやプロトタイプに、実際の関心にもとづいて手応えを返す仕組みを設計しています。", status: "prototype" },
  { title: "許可された学び", body: "役立った/合わないの signal は、匿名化・集約された傾向として、次のマッチングを少しずつ良くするために使います。", status: "planned" },
];

const STATUS_LABEL = { current: "いま使える", prototype: "プロトタイプ", planned: "設計中" } as const;

const INDIVIDUAL = [
  "参加は任意です",
  "許可した範囲だけを使います",
  "非公開が既定です",
  "購入や申込みの義務はありません",
  "公開への強制はありません",
] as const;

export default function CoDesignPage() {
  return (
    <main className="aix2">
      <DomainHero
        eyebrow="育てる · Co-Design"
        status="prototype"
        title={<>これからを、<span className="em">一緒に育てる</span>。</>}
        lead="感想や共創で、これからの体験・資料・プロダクトを少しずつ良くしていく領域です。参加は任意で、あなたが許可した範囲だけを使います。"
        primary={{ href: "/contact?topic=co-design", label: "フィードバックを送る" }}
        secondary={{ href: "/#system", label: "プロダクト全体を見る" }}
        seed="continue-previous"
      />

      <DomainSection eyebrow="できること" title="小さく関わる、いくつかの方法。">
        <div className="grid gap-4 md:grid-cols-2">
          {WAYS.map((w, i) => (
            <div key={w.title} className="aix2-panel p-6 aix2-rise" style={{ ["--d" as string]: `${i * 70}ms` }}>
              <span className={`aix3-status aix3-status--${w.status}`}>{STATUS_LABEL[w.status]}</span>
              <p className="mt-3 text-[16px] font-bold text-[color:var(--tx)]">{w.title}</p>
              <p className="mt-2 text-[13.5px] leading-7 aix2-mut">{w.body}</p>
              {w.action ? <Link href={w.action.href} className="mt-3 inline-block aix2-link">{w.action.label} →</Link> : null}
            </div>
          ))}
        </div>
      </DomainSection>

      <DomainSection eyebrow="あなたの参加" title="主導権は、いつもあなたに。" tint tight>
        <div className="flex flex-wrap gap-2.5">
          {INDIVIDUAL.map((t) => (
            <span key={t} className="aix3-chip">{t}</span>
          ))}
        </div>
      </DomainSection>

      <DomainSection eyebrow="パートナーの方へ" title="提供者・作り手の検証は、別の入口。">
        <p className="max-w-[42rem] text-[14px] leading-8 aix2-mut">
          資料やプロダクトの候補審査、コンセプト・市場検証、匿名化された需要の把握は、パートナー向けの領域です。個人の参加とは、はっきり分けています。支払っても表示順は買えません。推薦や販売の保証はなく、公開の出品・決済・先行販売は行いません。
        </p>
        <div className="mt-5">
          <Link href="/partners" className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[14px]">パートナー向けを見る</Link>
        </div>
      </DomainSection>
    </main>
  );
}
