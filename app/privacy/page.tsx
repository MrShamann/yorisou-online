import type { Metadata } from "next";

import { EditorialShell, EditorialSection } from "../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "プライバシー | YORISOU",
  description:
    "ログインなしで始められる YORISOU の使い方と、公開結果・保存・診断ではないことを短く伝えるページです。保存はこの端末内の簡易保存で、いつでも削除できます。",
};

// AIX-3D-1 — privacy on the shared editorial system. Legal/substantive meaning
// preserved; presentation reskinned; storage boundaries stated accurately.

const POINTS: ReadonlyArray<{ title: string; body: string }> = [
  { title: "最初はログインなしで始められます", body: "最初のチェックは、ログインなしで始められます。" },
  { title: "保存は、この端末のブラウザ内だけ", body: "簡易保存はこの端末（デバイス）のブラウザ内だけに残ります。別の端末には引き継がれません。アカウント保存やLINE連携は、実装されている場合だけ明示します。いつでも削除・クリアできます。" },
  { title: "最初のチェックでは個人情報を求めません", body: "名前、住所、家族介護の詳細など、個人を特定する情報は最初のチェックでは求めません。" },
  { title: "公開結果と、自分だけのものを分けます", body: "公開しても安心な結果と、自分だけで読む深いヒントやレポート本文は、いつも分けて扱います。診断や医療・心理評価ではありません。" },
];

export default function PrivacyPage() {
  return (
    <EditorialShell
      eyebrow="プライバシー"
      title="はじめやすく、境界はわかりやすく。"
      lead="YORISOU では、最初のチェックを軽く始められることと、公開してよい結果と自分だけのものの境界がわかることを大切にしています。"
      primary={{ href: "/check-in", label: "いまの状態をみる" }}
      secondary={{ href: "/contact?topic=privacy", label: "プライバシーの問い合わせ" }}
    >
      {POINTS.map((p) => (
        <EditorialSection key={p.title} title={p.title}>
          <p>{p.body}</p>
        </EditorialSection>
      ))}

      <EditorialSection title="おすすめ・フィードバックの signal">
        <p>おすすめや「役立った / 今は合わない」などの反応は、次のマッチングを少しずつ良くするために使います。個人を特定しない形で扱い、表示順を売ることはしません。参加は任意で、公開への強制はありません。</p>
      </EditorialSection>

      <EditorialSection title="削除・クリア / LINE の境界">
        <p>この端末の簡易保存は、保存ページからいつでも削除できます。LINEは継続の入口のひとつであり、YORISOUの全体ではありません。プロトタイプの参加は任意で、内容は明示された範囲だけを使います。</p>
        <p>詳しい取り扱いや削除のご相談は、<a href="/contact?topic=privacy">お問い合わせ</a>からご連絡ください。</p>
      </EditorialSection>
    </EditorialShell>
  );
}
