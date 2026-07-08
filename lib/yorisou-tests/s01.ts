import { s01KyouNoOmikujiV10 } from "./generated/S01_kyou_no_omikuji_v1_0";
import type { OmikujiRuntime, TestCatalogEntry } from "./types";

export const s01CatalogEntry: TestCatalogEntry = {
  slug: "s01",
  testId: "S01",
  title: "今日のおみくじ",
  description: "今日の気分や関心に合わせて、軽いヒントをひとつ受け取る小さな入口です。",
  estimatedTime: "約30秒",
  category: "軽いヒント",
  boundaryNote: "未来を予言するものではありません。今日の気分を少し見つめるための小さなリフレクションです。",
  ctaLabel: "引いてみる",
  route: "/tests/s01",
  status: "available",
};

export const s01Runtime: OmikujiRuntime = {
  slug: "s01",
  testId: "S01",
  title: "今日のおみくじ",
  introTitle: "今日の気分に、\n軽いヒントをひとつ。",
  introDescription:
    "大きな結論ではなく、今日の自分に近い空気をひとつ受け取るための小さな入口です。気分や気になることを選ぶと、引きが少しだけ変わります。",
  estimatedTime: s01CatalogEntry.estimatedTime,
  boundaryNote: s01KyouNoOmikujiV10.boundary_notes.jp,
  optionalInputs: s01KyouNoOmikujiV10.optional_inputs.map((input) => ({
    id: input.id,
    label_jp: input.label_jp,
    options: input.options,
  })),
  resultPool: s01KyouNoOmikujiV10.result_pool,
  relatedRoutes: [
    { href: "/tests/c02", label: "今の状態を見る" },
    { href: "/tests/f01", label: "働き方の入口を見る" },
    { href: "/open-testing", label: "120問の入口を見る" },
  ],
};
