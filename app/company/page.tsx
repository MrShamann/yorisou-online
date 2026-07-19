import type { Metadata } from "next";

import { EditorialShell, EditorialSection } from "../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "会社情報 | YORISOU",
  description: "YORISOUを開発・運営する会社の概要です。セルフリフレクション体験、状態理解、デジタルレポート、推薦・マッチング支援の企画・開発・運営を行います。",
};

// AIX-3D-1 — company (legal disclosure) on the shared editorial system. Company
// facts preserved; distinct legal purpose (not a duplicate of /about).

const ROWS: ReadonlyArray<[string, string]> = [
  ["会社名", "寄り添う（Yorisou）"],
  ["所在地", "福岡県福岡市"],
  ["設立", "2026年"],
  ["代表取締役", "Jin Yang（ジン ヤン）"],
  ["事業内容", "セルフリフレクションサービス、状態理解、デジタルレポート、推薦・マッチング支援の企画・開発・運営"],
];

export default function CompanyPage() {
  return (
    <EditorialShell
      eyebrow="会社情報"
      title="会社概要"
      lead="YORISOU を開発・運営する会社の概要です。"
      secondary={{ href: "/about", label: "Yorisouとは" }}
    >
      <EditorialSection>
        <dl className="grid gap-0">
          {ROWS.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-[rgba(23,59,53,0.08)] py-4 last:border-b-0 sm:grid-cols-[10rem_1fr]">
              <dt className="text-[14px] font-semibold text-[#2f2a28]">{k}</dt>
              <dd className="text-[14px] leading-8 text-[#5f5750]">{v}</dd>
            </div>
          ))}
        </dl>
      </EditorialSection>
    </EditorialShell>
  );
}
