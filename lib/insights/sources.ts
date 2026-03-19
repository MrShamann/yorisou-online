import type { InsightSourceConfig } from "@/lib/insights/types";

export const insightSources: InsightSourceConfig[] = [
  {
    id: "mlit-press",
    name: "国土交通省 報道発表",
    type: "rss",
    url: "https://www.mlit.go.jp/pressrelease.rdf",
    region: "japan",
    categoryHints: ["community-transport", "local-transport", "welfare-mobility", "micro-mobility"],
    tagHints: ["国交省", "地域交通"],
    includeKeywords: ["交通", "移動", "地域", "高齢", "バリアフリー", "自動運転", "モビリティ", "EV", "道路", "鉄道", "バス", "自動車", "物流", "ETC"],
    excludeKeywords: ["港湾", "航空", "船舶", "観光庁のみ", "河川", "下水道"],
    note: "Mobility-relevant items are filtered from the broader MLIT press feed.",
  },
  {
    id: "meti-kanto-news",
    name: "関東経済産業局 新着情報",
    type: "rss",
    url: "https://www.kanto.meti.go.jp/ml_past_info_rss2.xml",
    region: "local-community",
    categoryHints: ["micro-mobility", "local-transport", "community-transport"],
    tagHints: ["経産局", "地域実装"],
    includeKeywords: ["モビリティ", "EV", "地域", "移動", "交通", "高齢", "ラストマイル", "物流", "バリアフリー"],
    excludeKeywords: ["半導体", "通商", "関税", "石油備蓄"],
    note: "Used selectively for practical regional mobility and last-mile topics.",
  },
];
