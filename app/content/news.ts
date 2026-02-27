export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string[];
};

export const newsPosts: NewsPost[] = [
  {
    slug: "fukuoka-pilot-consultation-2026-02",
    title: "福岡市内での実証候補ルートに関する相談受付を開始",
    date: "2026-02-20",
    summary: "自治体・施設担当者向けに、生活導線の事前ヒアリング受付を開始しました。",
    content: [
      "YORISOUは、福岡市内の生活導線を対象とした実証候補ルートの相談受付を開始しました。",
      "本相談では、通院・買い物・公共施設アクセスなど、地域住民の実態に沿った移動ニーズを整理します。",
      "安全配慮と運用負荷の両立を前提に、段階的な実証設計を提案します。",
    ],
  },
  {
    slug: "safety-guideline-v1-2026-02",
    title: "実証実験向け安全運用ガイドライン（第1版）を公開",
    date: "2026-02-08",
    summary: "現場運用を想定した点検・乗降・ヒヤリハット記録の基本手順を整理しました。",
    content: [
      "実証実験における安全性の均質化を目的に、安全運用ガイドライン第1版を公開しました。",
      "内容は、運行前点検、利用者説明、運行記録、異常時連絡フローなどの基本項目で構成されています。",
      "今後は現場での運用結果を踏まえて、自治体や連携先と継続的に改訂します。",
    ],
  },
  {
    slug: "care-facility-hearing-2026-01",
    title: "介護施設向け移動課題ヒアリングを実施",
    date: "2026-01-25",
    summary: "通所・外出支援時の移動負担と業務負荷について、複数施設から意見を収集しました。",
    content: [
      "福岡市内および近郊の介護施設を対象に、移動課題に関するヒアリングを実施しました。",
      "日常的な短距離移動の不足が、外出機会と生活の質に影響していることを確認しています。",
      "運用者側の負担軽減につながる設計要件を次期実証の仕様に反映します。",
    ],
  },
  {
    slug: "medical-access-study-2026-01",
    title: "医療アクセス支援シナリオの検討を開始",
    date: "2026-01-16",
    summary: "診療所・薬局へのアクセスを想定した運用シナリオ検討を開始しました。",
    content: [
      "高齢者の通院・服薬導線を対象に、医療アクセス支援シナリオの検討を開始しました。",
      "診療時間帯や施設周辺環境を踏まえ、過密を避けた安全運行計画を検討しています。",
      "医療機関との連携を前提に、実証時の評価指標も併せて整備します。",
    ],
  },
  {
    slug: "regional-partner-dialogue-2025-12",
    title: "地域企業との連携対話プログラムを開始",
    date: "2025-12-18",
    summary: "地域交通を支える運用体制づくりに向け、連携対話を開始しました。",
    content: [
      "地域企業との連携枠組みを整備するため、対話プログラムを開始しました。",
      "運行支援、利用者案内、保守対応など、地域内で担える役割分担を協議しています。",
      "短期導入ではなく、中長期で継続可能な地域運用モデルの構築を目指します。",
    ],
  },
  {
    slug: "yorisou-corporate-site-release-2025-11",
    title: "YORISOU公式サイトを公開",
    date: "2025-11-30",
    summary: "福岡を起点とした地域モビリティ実証事業の情報発信を開始しました。",
    content: [
      "YORISOUは、地域モビリティ実証の取り組みを発信する公式サイトを公開しました。",
      "本サイトでは、事業内容、実証実験、連携体制、ニュース、問い合わせ窓口を案内します。",
      "行政・地域機関との対話を重視し、段階的な社会実装に向けて活動を進めます。",
    ],
  },
];

export function getSortedNews(): NewsPost[] {
  return [...newsPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getLatestNews(limit: number): NewsPost[] {
  return getSortedNews().slice(0, limit);
}

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((post) => post.slug === slug);
}
