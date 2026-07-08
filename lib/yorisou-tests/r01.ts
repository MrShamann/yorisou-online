import type { TestCatalogEntry } from "./types";

export const r01CatalogEntry: TestCatalogEntry = {
  slug: "r01",
  testId: "R01",
  title: "ふたり恋愛相性診断",
  description: "この入口は、元データの確認が完了してから公開予定です。",
  estimatedTime: "準備中",
  category: "恋愛・関係",
  boundaryNote: "レビュー済みのR01ソースが揃い次第、公開予定です。",
  ctaLabel: "準備中",
  route: "/tests/r01",
  status: "blocked",
  blockedReason: "Attached R01 asset contains duplicated C02 content and no valid R01 question/result IDs.",
};
