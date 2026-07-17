import type { Metadata } from "next";
import Link from "next/link";

import { PHASE1_TEST_CATALOG } from "@/lib/yorisou-tests/catalog";
import IntentionChooser, { type IntentionGroup } from "./IntentionChooser";

export const metadata: Metadata = {
  title: "入口を選ぶ | Yorisou",
  description:
    "Yorisouの公開テスト入口を、今の状態や関心に合わせて選べるページです。結果、レポート、LINE保存につながる入口を一覧できます。",
};

// AIX-1 — entry selection as an intention choice, not a catalog of cards.
// Test availability comes from the existing PHASE1 catalog (unchanged).

function catalogItem(testId: string) {
  const test = PHASE1_TEST_CATALOG.find((entry) => entry.testId === testId);
  if (!test || test.status !== "available") return null;
  return {
    key: test.testId,
    title: test.title,
    description: test.description,
    meta: `${test.category} · ${test.estimatedTime}`,
    href: test.route,
    ctaLabel: test.ctaLabel,
    boundaryNote: test.boundaryNote,
  };
}

export default function TestsPage() {
  const groups: IntentionGroup[] = [
    {
      intention: "current-state",
      title: "今の自分の状態を、見てみたい",
      body: "気持ちや動き方が定まらないとき。まず今の見え方をやわらかく整理します。",
      items: [
        {
          key: "imairo",
          title: "いま色テスト by よりそう",
          description: "今の動き方を、24の色と名前で見てみるテスト。120問をもとにしています。",
          meta: "今の状態 · 120問 · 無料 · ログインなし",
          href: "/check-in",
          ctaLabel: "いま色テストをはじめる",
          boundaryNote: "結果は固定タイプではなく、今の動き方です。医療・心理的な判定ではありません。",
        },
        ...[catalogItem("C02")].filter((item): item is NonNullable<typeof item> => item !== null),
      ],
    },
    {
      intention: "work-life-rhythm",
      title: "仕事や生活のリズムを、整えたい",
      body: "働き方や職場環境が今の自分に合っているか、少し立ち止まって見たいとき。",
      items: [catalogItem("F01"), catalogItem("F02")].filter(
        (item): item is NonNullable<typeof item> => item !== null,
      ),
    },
    {
      intention: "continue-previous",
      title: "前回の結果から、続けたい",
      body: "保存した結果を見返したり、状態が変わったと感じたらもう一度試せます。",
      items: [
        {
          key: "saved",
          title: "保存した結果を見返す",
          description: "この端末やアカウントに保存した結果・レポートを、自分のペースで見直せます。",
          meta: "継続 · 保存済みの結果",
          href: "/saved",
          ctaLabel: "保存した結果を開く",
        },
        {
          key: "retake",
          title: "もう一度いま色テストをする",
          description: "結果は今の見え方です。変わったと感じたら、また試せます。",
          meta: "今の状態 · 120問",
          href: "/check-in",
          ctaLabel: "もう一度はじめる",
        },
      ],
    },
    {
      intention: "discover-next",
      title: "次の一歩やヒントを、探したい",
      body: "結果の先にある詳しいレポートや、今の状態に合いそうなヒントを見てみたいとき。",
      items: [
        {
          key: "report-sample",
          title: "レポートの見本を見る",
          description: "無料結果の先にある、少し深い読みものの見本です。公開テスト中のため全文まで確認できます。",
          meta: "レポート · 見本",
          href: "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low",
          ctaLabel: "見本を開く",
        },
        {
          key: "hints",
          title: "今のヒントを見る",
          description: "今の状態に合いそうな読みものや小さな次の一歩の入口です。購入や申込みはありません。",
          meta: "おすすめ · 入口",
          href: "/recommendations?resultId=EM-AK&overlayId=balancing&confidence=low",
          ctaLabel: "ヒントを見る",
        },
      ],
      pendingNote: "関係の距離や暮らしのテーマの入口は、これから少しずつ増やしていきます。",
    },
  ];

  return (
    <main className="aix2">
      <section className="border-b border-[var(--hair)]">
        <div className="container">
          <div className="max-w-[44rem] py-14 md:py-20">
            <p className="aix2-eyebrow">入口をえらぶ</p>
            <h1 className="aix2-serif mt-4 text-[2.3rem] font-semibold leading-[1.18] text-[color:var(--tx)] md:text-[3.1rem]">
              いま、どんな気持ちに近い？
            </h1>
            <p className="aix2-lead mt-5">
              テストの一覧からではなく、今の気持ちから入口を選べます。どの入口も、医療・診断・運命判断ではなく、今の状態や関心を見直すためのリフレクションです。
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="mx-auto max-w-[46rem]">
          <IntentionChooser groups={groups} />
        </div>
      </section>

      <div className="container pb-14">
        <div className="mx-auto max-w-[46rem]">
          <p className="text-[12px] leading-7 aix2-faint">
            いずれも医療・心理診断ではありません。占いの断定、恋愛や仕事の結論、退職や収入の助言ではなく、今の状態や関心を見直すための入口です。
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/open-testing" className="aix2-link text-[13px]">公開中の入口を見る →</Link>
            <Link href="/line/mini-app" className="aix2-link text-[13px]">LINE入口を見る →</Link>
            <Link href="/contact?topic=open-testing" className="aix2-link text-[13px]">先行テーマへの関心を送る →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
