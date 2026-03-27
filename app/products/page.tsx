import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yorisou | 製品を見る",
  description:
    "Yorisouが整理しているシニア向けモビリティ製品一覧です。利用シーンや違いを見比べながら、相談につなげられます。",
};

const groups = [
  {
    title: "近所の外出を支えたいとき",
    lead: "買い物や通院など、日常の短い移動で負担を減らしたい方向けの候補です。",
    items: [
      {
        name: "屋外移動向け 電動カート",
        image: "/images/products/electric-cart.svg",
        useCase: "買い物・通院・近所の外出",
        audience: "歩行に不安があり、屋外での移動距離を減らしたい方",
        difference: "屋外の安定感を優先しながら、日常の移動範囲を広げやすいタイプです。",
      },
      {
        name: "歩行アシスト中心モデル",
        image: "/images/products/walking-aid.svg",
        useCase: "短距離の外出・施設内移動",
        audience: "まだ歩けるが、長い距離や坂道が負担になってきた方",
        difference: "いきなり大きな機種にせず、歩行を残しながら支えやすい点が違いです。",
      },
    ],
  },
  {
    title: "ご家族と一緒に選びたいとき",
    lead: "保管、持ち運び、介助のしやすさなど、ご家族側の扱いやすさも重視する候補です。",
    items: [
      {
        name: "折りたたみしやすい軽量タイプ",
        image: "/images/products/folding-type.svg",
        useCase: "車載・保管しやすさ重視",
        audience: "車で運ぶことが多く、保管スペースも気になるご家庭",
        difference: "使わないときの扱いやすさを優先し、家族が支えやすい点が特長です。",
      },
      {
        name: "介助切替を考えやすい共有モデル",
        image: "/images/products/shared-support.svg",
        useCase: "本人利用とご家族介助の両立",
        audience: "本人だけでなく、ご家族の付き添い場面も想定している方",
        difference: "本人の使いやすさと、ご家族が支える場面の両方を考えやすい構成です。",
      },
    ],
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="shell-card max-w-4xl p-8 md:p-12">
            <h1 className="text-4xl font-light leading-tight md:text-6xl">製品を見比べながら、相談につなげられます</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              Yorisouでは、使う場面、ご本人の歩行状況、ご家族の支えやすさを見ながら、候補を整理していきます。まずは違いを見てから相談したい方のための入口です。
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm leading-7 text-[#5A4B3E] md:flex-row md:justify-between">
          <div>使う場面で見比べやすく</div>
          <div>ご本人にもご家族にも分かりやすく</div>
          <div>迷ったらすぐ相談につなげられるように</div>
        </div>
      </section>

      <section className="bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto max-w-6xl space-y-10">
          {groups.map((group) => (
            <div key={group.title} className="rounded-[2.1rem] border border-[#D6C3A3]/28 bg-white/80 p-7 shadow-[0_20px_48px_rgba(59,47,47,0.05)] md:p-10">
              <h2 className="text-3xl font-light leading-tight">{group.title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5A4B3E] md:text-base">{group.lead}</p>
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {group.items.map((item) => (
                  <article key={item.name} className="overflow-hidden rounded-[1.75rem] border border-[#D6C3A3]/24 bg-[#FCFAF6]">
                    <div className="relative h-52 w-full bg-[linear-gradient(135deg,rgba(252,248,240,0.98),rgba(236,227,214,0.82))]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-[#8A7764]">{item.useCase}</div>
                      <h3 className="mt-2 text-2xl font-light leading-tight">{item.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.audience}</p>
                      <p className="mt-4 rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/78 px-4 py-4 text-sm leading-7 text-[#6B5A4A]">
                        {item.difference}
                      </p>
                      <div className="mt-5">
                        <Link href="/support#scenario-assistant" className="btn btn-secondary">
                          この内容で相談する
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
