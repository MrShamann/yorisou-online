import type { Metadata } from "next";
import Link from "next/link";

import DepthFieldStatic from "../components/depth-field/DepthFieldStatic";
import DepthFieldLazy from "../components/depth-field/DepthFieldLazy";
import { intentionDepthParams, intentionPalette } from "../components/depth-field/seed";
import AixIn from "../components/aix2/AixIn";

export const metadata: Metadata = {
  title: "パートナー | YORISOU 検証とインテリジェンス",
  description:
    "YORISOUのパートナー向け領域。候補の受け付け、資料・プロダクトの審査、コンセプト・プロトタイプ・市場検証、匿名化された需要の把握。公開の出品・決済・先行販売は行いません。表示順は買えません。",
};

// AIX-3 — Partner (Validation & Intelligence) domain. Truthful concept surface:
// no public supplier self-service, no payments, no preorder, no outreach.

const CAPABILITIES: ReadonlyArray<{ title: string; body: string; status: "prototype" | "planned" }> = [
  { title: "候補の受け付け", body: "資料・体験・プロダクトの提供者候補を、審査前提で受け付けます。受理は推薦や採用の約束ではありません。", status: "prototype" },
  { title: "審査とスクリーニング", body: "ユーザーの状態理解に本当に役立つかを基準に、内部で審査します。表示順は買えません。", status: "prototype" },
  { title: "コンセプト・プロトタイプ検証", body: "作る前に、コンセプトやプロトタイプの手応えを、実際の関心にもとづいて確かめます。", status: "planned" },
  { title: "市場・需要インテリジェンス", body: "匿名化・集約された需要の傾向を、機会ブリーフとして整理します。個人は特定しません。", status: "planned" },
];

const PRINCIPLES = [
  "推薦や販売を保証しません",
  "表示順は買えません（pay-to-rankなし）",
  "個人データは匿名化・集約して扱います",
  "公開の出品・決済・先行販売は行いません",
  "外部への勝手な連絡はしません",
] as const;

const STATUS_LABEL = { prototype: "プロトタイプ", planned: "設計中" } as const;

export default function PartnersPage() {
  const params = intentionDepthParams("discover-next", 240);
  const palette = intentionPalette();

  return (
    <main className="aix2">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="depth-scene" aria-hidden="true">
          <DepthFieldStatic params={params} palette={palette} formation={0.8} className="depth-layer" />
          <DepthFieldLazy params={params} palette={palette} formation={1} className="depth-layer" />
          <div className="depth-veil" />
        </div>
        <div className="container relative z-[1]">
          <div className="aix2-in max-w-[48rem] py-20 md:py-28">
            <div className="flex flex-wrap items-center gap-3">
              <p className="aix2-eyebrow aix2-rise">パートナー · 検証とインテリジェンス</p>
              <span className="aix3-status aix3-status--planned aix2-rise">検証・設計中</span>
            </div>
            <h1 className="aix2-hero-title mt-5 aix2-rise" style={{ ["--d" as string]: "120ms" }}>
              需要と相性を、<span className="em">検証する</span>。
            </h1>
            <p className="aix2-lead mt-6 aix2-rise" style={{ ["--d" as string]: "220ms" }}>
              YORISOUは、ユーザーの状態理解を中心に置いたまま、資料やプロダクトが本当に役立つかを検証します。売り場ではありません。
            </p>
            <div className="mt-8 flex flex-wrap gap-3 aix2-rise" style={{ ["--d" as string]: "320ms" }}>
              <Link href="/contact?topic=partners" className="aix2-btn aix2-btn-primary">関心を伝える</Link>
              <Link href="/#system" className="aix2-btn aix2-btn-ghost">プロダクト全体を見る</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Capabilities ===== */}
      <AixIn as="section" className="aix2-band">
        <div className="container">
          <p className="aix2-eyebrow aix2-rise">できること</p>
          <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
            作る前に、確かめる。
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <div key={c.title} className="aix2-panel p-6 aix2-rise" style={{ ["--d" as string]: `${i * 70}ms` }}>
                <span className={`aix3-status aix3-status--${c.status}`}>{STATUS_LABEL[c.status]}</span>
                <p className="mt-3 text-[16px] font-bold text-[color:var(--tx)]">{c.title}</p>
                <p className="mt-2 text-[13.5px] leading-7 aix2-mut">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </AixIn>

      {/* ===== Principles ===== */}
      <AixIn as="section" className="aix2-band aix2-band--tight aix2-band--tint">
        <div className="container">
          <p className="aix2-eyebrow aix2-rise">前提</p>
          <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>
            ユーザーの信頼が、いちばん上。
          </h2>
          <div className="mt-6 grid gap-0 sm:grid-cols-2 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p}
                className="aix2-hair-top py-4 text-[14px] leading-7 aix2-mut aix2-rise"
                style={{ ["--d" as string]: `${i * 60}ms`, borderLeft: "2px solid var(--hair-2)", paddingLeft: "1rem", marginTop: "0.5rem" }}
              >
                {p}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] text-[13px] leading-7 aix2-faint">
            現在は検証と設計の段階です。公開の出品システムや決済は用意していません。関心のある方は、内容を添えてご連絡ください。
            <Link href="/contact?topic=partners" className="ml-2 aix2-link">関心を伝える →</Link>
          </p>
        </div>
      </AixIn>
    </main>
  );
}
