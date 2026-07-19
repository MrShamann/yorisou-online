import type { Metadata } from "next";

import { EditorialShell, EditorialSection } from "../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "考え方 | YORISOU のメソドロジー",
  description:
    "YORISOU が、状態を固定した性格ではなく今の動き方として扱い、チェックを一つの信号として、説明できる範囲のおすすめや自分で選べる継続につなぐ考え方を伝えるページです。診断ではありません。",
};

const PRINCIPLES: ReadonlyArray<{ title: string; body: string }> = [
  { title: "固定した性格ではなく、今の状態を見る", body: "結果は、ずっと変わらないラベルではなく、今の生活リズムや選び方の偏りを軽く受け取るための見方です。時期や環境が変われば、前に出る面も変わります。" },
  { title: "チェックは、ひとつの信号", body: "120問のチェックは、進むテンポ、人との距離感、決めるときの手触り、乱れたあとの戻り方などを小さく見る、状態を理解するための一つの入口です。すべてを決める判定ではありません。" },
  { title: "おすすめは、説明できる範囲で", body: "おすすめは命令ではなく、なぜ表示されたかを添えた、任意の候補です。合わないときは「今は合わない」を選べます。表示順は買えません。" },
  { title: "続けかたは、自分で選ぶ", body: "保存も、LINEでの継続も、あなたが選んだときだけ行われます。非公開が既定で、いつでも見返し・削除できます。" },
];

const MODEL = [
  "120問の回答から、今の傾向を24の結果に寄せて整理します。",
  "負荷や広がり方は、状態ラベルで補助的に添えます。",
  "自分だけで見返す保存や意向記録は、この端末のブラウザ内だけに残します。",
] as const;

export default function MethodologyPage() {
  return (
    <EditorialShell
      eyebrow="考え方 · Methodology"
      title="今の状態を、固定せずに受け取る方法。"
      lead="YORISOU は、診断でも占いでもありません。チェックでは、今の暮らしのリズムや距離感、決め方、戻り方を見て、公開結果と自分だけの記録を分けて扱います。"
      primary={{ href: "/check-in", label: "今の自分から始める" }}
      secondary={{ href: "/#system", label: "YORISOUでできることを見る" }}
    >
      <EditorialSection title="大切にしていること">
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="aix3-ed-card">
              <p className="text-[14px] font-bold text-[#2f2a28]">{p.title}</p>
              <p className="mt-2 text-[14px] leading-8 text-[#5f5750]">{p.body}</p>
            </div>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection title="いま動いている範囲">
        <p>公開テスト中に実際に動いているのは、次の範囲です。無理に広げず、正確に扱えるところから公開しています。</p>
        <div className="mt-3 grid gap-2">
          {MODEL.map((m) => (
            <p key={m} className="aix3-ed-card !py-3 text-[14px] leading-7 text-[#2f2a28]">{m}</p>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection title="状態は、変わる">
        <p>この結果は「当てる」ものではありません。日をおいて受け直したり、この端末に保存して見返したりしながら、今の状態の揺れをゆっくり扱えます。変わることは、自然なことです。</p>
        <p>必要な判断や支援がある場合は、医療・心理・法律などの適切な専門家や公的窓口に相談してください。YORISOU はその代替ではありません。</p>
      </EditorialSection>
    </EditorialShell>
  );
}
