import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "../components/ContactForm";
import { EditorialShell, EditorialSection } from "../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "お問い合わせ | YORISOU",
  description: "YORISOUのチェック体験、保存・アカウント、LINE、おすすめのフィードバック、共創参加、パートナー、プライバシーに関するお問い合わせを受け付けています。",
};

// AIX-3D-1 — contact on the shared editorial system with topic separation.
// ContactForm + topic context preserved.

function getInitialContactContext(topic: string | null) {
  const map: Record<string, { inquiryType: string; message: string }> = {
    "open-testing": {
      inquiryType: "公開テストの感想・不具合報告",
      message: "公開テストの感想や不具合報告を送ります。\n\n・どのページで気づいたか\n・よかった点 / わかりにくかった点\n・不具合があれば再現手順\n\n",
    },
    "saved": { inquiryType: "保存・アカウントについて", message: "保存した結果やアカウントについての相談です。\n\n" },
    "line": { inquiryType: "LINEについて", message: "LINEでの継続や連携についての相談です。\n\n" },
    "co-design": { inquiryType: "共創・フィードバック", message: "共創やアイデア、フィードバックを送ります。\n\n" },
    "partners": { inquiryType: "パートナーについて", message: "パートナー（提供者・作り手）としての関心を伝えます。\n\n・提供したい資料/プロダクトの概要\n・想定する対象や状態\n\n" },
    "privacy": { inquiryType: "プライバシー・データについて", message: "プライバシーやデータの取り扱い、削除についての相談です。\n\n" },
  };
  return topic && map[topic] ? map[topic] : { inquiryType: undefined, message: undefined };
}

const TOPICS: ReadonlyArray<[string, string]> = [
  ["open-testing", "感想・不具合"],
  ["saved", "保存・アカウント"],
  ["line", "LINE"],
  ["co-design", "共創・フィードバック"],
  ["partners", "パートナー"],
  ["privacy", "プライバシー・データ"],
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const topicValue = typeof params.topic === "string" ? params.topic : null;
  const initialContext = getInitialContactContext(topicValue);

  return (
    <EditorialShell
      eyebrow="お問い合わせ"
      title="気になったことを、落ち着いて送れる入口。"
      lead="ご相談内容がまだまとまっていなくても大丈夫です。感想・不具合、保存やアカウント、LINE、おすすめの反応、共創、パートナー、プライバシーまで、必要なことから順番にお送りいただけます。"
    >
      <EditorialSection title="話したいことを選ぶ（任意）">
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(([t, label]) => (
            <Link
              key={t}
              href={`/contact?topic=${t}`}
              className={`inline-flex rounded-full border px-3.5 py-1.5 text-[13px] no-underline transition ${topicValue === t ? "border-[#315f50] bg-[#eaf7f1] text-[#173b35]" : "border-[rgba(23,59,53,0.14)] text-[#5f5750] hover:border-[#315f50]"}`}
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[13px]">返信までお時間をいただく場合があります。返信時間の保証はしていません。急ぎで専門的な支援が必要なときは、適切な専門家や公的窓口にご相談ください。</p>
      </EditorialSection>

      <EditorialSection title="お問い合わせフォーム">
        <div className="aix3-ed-card">
          <ContactForm
            locale="ja"
            initialInquiryType={initialContext.inquiryType}
            initialMessage={initialContext.message}
            trackingTopic={topicValue || "contact"}
          />
        </div>
      </EditorialSection>
    </EditorialShell>
  );
}
