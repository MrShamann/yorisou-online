import type { Metadata } from "next";

import { EditorialShell, EditorialSection } from "../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "利用規約 | YORISOU",
  description:
    "YORISOUのチェックコンテンツ、結果表示、アカウント、保存機能、サポート機能の利用条件を定めます。YORISOUは医療・心理診断・法律・金融・その他専門助言を提供するものではありません。",
};

// AIX-3D-1 — terms on the shared editorial system. Legal substance preserved
// verbatim; presentation and product terminology updated.

export default function TermsPage() {
  return (
    <EditorialShell
      eyebrow="利用規約"
      title="利用規約"
      lead="本利用規約（以下「本規約」といいます。）は、YORISOU（以下「本サービス」といいます。）の利用条件を定めるものです。ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。"
    >
      <EditorialSection title="1. 適用">
        <p>本規約は、本サービスのウェブサイト、LINE MINI App、LINE連携機能、診断コンテンツ、結果表示、関連する継続コンテンツその他本サービスに関する一切の利用に適用されます。</p>
      </EditorialSection>
      <EditorialSection title="2. 本サービスの内容">
        <ol className="ml-5 list-decimal space-y-2">
          <li>本サービスは、質問回答、結果表示、関連コンテンツの提供、アカウント機能、LINEその他の外部連携を通じて、ユーザーに自己理解・関係理解・継続的なコンテンツ体験を提供するものです。</li>
          <li>本サービス上の診断結果、説明文、提案、表示内容その他の情報は、娯楽・参考・一般情報提供を目的とするものであり、医療行為、心理療法、法律・税務・投資その他の専門的助言を構成するものではありません。</li>
          <li>当社は、本サービスの内容、表示項目、機能、提供方法を、必要に応じて追加、変更、停止または終了することがあります。</li>
        </ol>
      </EditorialSection>
      <EditorialSection title="3. 利用登録・アカウント">
        <ol className="ml-5 list-decimal space-y-2">
          <li>ユーザーは、当社所定の方法により、本サービスのアカウント登録またはLINEその他の外部サービスを通じた利用を行うことができます。</li>
          <li>ユーザーは、登録情報を正確かつ最新の内容に保つものとします。</li>
          <li>ユーザーは、自己の責任においてアカウント情報、ログイン手段、連携済み外部アカウントを管理するものとし、これらの管理不十分により生じた損害について、当社は故意または重過失がある場合を除き責任を負いません。</li>
          <li>当社は、虚偽登録、不正利用、重複登録、または本規約違反のおそれがある場合、登録の拒否、停止または削除を行うことができます。</li>
        </ol>
      </EditorialSection>
      <EditorialSection title="4. 禁止事項">
        <ol className="ml-5 list-decimal space-y-2">
          <li>法令または公序良俗に反する行為</li>
          <li>犯罪行為またはこれに関連する行為</li>
          <li>虚偽情報の登録または提供</li>
          <li>他人になりすます行為</li>
          <li>他のユーザー、第三者または当社の権利、利益、名誉、信用、プライバシーを侵害する行為</li>
          <li>本サービスの運営を妨害する行為、過度な負荷をかける行為、不正アクセスまたはこれを試みる行為</li>
          <li>本サービス上のコンテンツ、データ、結果画面、文言等を、当社の事前承諾なく営利目的で利用、転載、複製、改変、再配布する行為</li>
          <li>本サービスの不具合や仕様を不正目的で利用する行為</li>
          <li>反社会的勢力に関与する行為</li>
          <li>その他、当社が不適切と判断する行為</li>
        </ol>
      </EditorialSection>
      <EditorialSection title="5. 知的財産権">
        <ol className="ml-5 list-decimal space-y-2">
          <li>本サービスに関する文章、画像、ロゴ、構成、画面、診断ロジック、結果表現、データベース、ソフトウェアその他一切の権利は、当社または正当な権利者に帰属します。</li>
          <li>本規約に基づく利用許諾は、本サービスに関する知的財産権の譲渡または使用許諾を意味するものではありません。</li>
          <li>ユーザーが法令上認められる範囲を超えて本サービスの内容を利用することはできません。</li>
        </ol>
      </EditorialSection>
      <EditorialSection title="6. 外部サービス連携">
        <ol className="ml-5 list-decimal space-y-2">
          <li>本サービスは、LINEその他の外部サービスと連携する場合があります。</li>
          <li>外部サービスの利用には、当該外部サービスの利用規約、プライバシーポリシーその他の条件が適用されることがあります。</li>
          <li>当社は、外部サービスの仕様変更、中断、停止、連携解除その他外部要因により生じた不具合または損害について、当社に故意または重過失がある場合を除き責任を負いません。</li>
        </ol>
      </EditorialSection>
      <EditorialSection title="7. 免責">
        <ol className="ml-5 list-decimal space-y-2">
          <li>当社は、本サービスが特定の目的に適合すること、特定の結果・効用を保証すること、継続的に利用可能であること、またはエラー・不具合・中断が生じないことを保証しません。</li>
          <li>当社は、ユーザーが本サービスを利用したことまたは利用できなかったことにより生じた損害について、当社に故意または重過失がある場合を除き責任を負いません。</li>
          <li>本サービス上で提供される結果、提案、説明、継続コンテンツその他の情報は、最終的な判断を代替するものではなく、ユーザー自身の判断と責任において利用されるものとします。</li>
        </ol>
      </EditorialSection>
      <EditorialSection title="8. サービスの変更・停止・終了">
        <p>当社は、保守、障害対応、仕様変更、法令対応、事業上の判断その他の理由により、ユーザーへの事前通知なく、本サービスの全部または一部を変更、停止または終了することがあります。</p>
      </EditorialSection>
      <EditorialSection title="9. 規約違反時の措置">
        <p>当社は、ユーザーが本規約に違反し、または違反するおそれがあると判断した場合、事前通知なく、投稿・データの削除、機能制限、利用停止、アカウント削除その他必要な措置を講じることができます。</p>
      </EditorialSection>
      <EditorialSection title="10. プライバシー">
        <p>本サービスにおける個人情報その他ユーザー情報の取扱いは、別途定める「<a href="/privacy">プライバシーポリシー</a>」に従います。</p>
      </EditorialSection>
      <EditorialSection title="11. 本規約の変更">
        <ol className="ml-5 list-decimal space-y-2">
          <li>当社は、必要に応じて本規約を変更することがあります。</li>
          <li>変更後の本規約は、当社が本サービスまたはウェブサイト上に掲載した時点または別途定める効力発生日から効力を生じます。</li>
          <li>変更後にユーザーが本サービスを利用した場合、変更後の本規約に同意したものとみなします。</li>
        </ol>
      </EditorialSection>
      <EditorialSection title="12. 準拠法・管轄">
        <p>本規約は日本法に準拠して解釈されます。本サービスに関して当社とユーザーとの間で紛争が生じた場合には、当社の主たる事業所所在地を管轄する地方裁判所または簡易裁判所を第一審の専属的合意管轄裁判所とします。</p>
      </EditorialSection>
      <EditorialSection title="13. お問い合わせ">
        <p>本規約に関するお問い合わせは、<a href="/contact">お問い合わせ</a>窓口までご連絡ください。</p>
      </EditorialSection>
      <EditorialSection>
        <p className="text-[13px]">最終更新日：2026年4月14日</p>
      </EditorialSection>
    </EditorialShell>
  );
}
