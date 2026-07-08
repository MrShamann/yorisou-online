import { r04NamaeAishoCheckV10 } from "./generated/R04_namae_aisho_check_v1_0";
import type { NamePairRuntime, TestCatalogEntry } from "./types";

export const r04CatalogEntry: TestCatalogEntry = {
  slug: "r04",
  testId: "R04",
  title: "名前相性チェック",
  description: "ふたりの呼び名をきっかけに、会話や距離感のヒントを軽く受け取る入口です。",
  estimatedTime: "約1〜2分",
  category: "名前・関係",
  boundaryNote: "姓名判断や運命予測ではありません。名前をきっかけにした、あそび型の相性リフレクションです。",
  ctaLabel: "チェックしてみる",
  route: "/tests/r04",
  status: "available",
};

export const r04Runtime: NamePairRuntime = {
  slug: "r04",
  testId: "R04",
  title: "名前相性チェック",
  introTitle: "呼び名をきっかけに、\nふたりの空気を軽く見る。",
  introDescription:
    "本名でなくても大丈夫です。ふたりの呼び名や、いま気になる距離感をきっかけに、会話のヒントをひとつ受け取れます。",
  estimatedTime: r04CatalogEntry.estimatedTime,
  boundaryNote: r04NamaeAishoCheckV10.boundary_notes.jp,
  inputs: r04NamaeAishoCheckV10.inputs,
  optionalQuestions: r04NamaeAishoCheckV10.optional_questions,
  resultPool: r04NamaeAishoCheckV10.result_pool,
  relatedRoutes: [
    { href: "/tests/r01", label: "ふたり恋愛相性診断を見る" },
    { href: "/tests/c02", label: "今の状態を見る" },
    { href: "/tests/s01", label: "今日のおみくじを見る" },
  ],
};
