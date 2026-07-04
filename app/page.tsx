import type { Metadata } from "next";
import Link from "next/link";

import MotionReveal from "./components/MotionReveal";
import OpenTestingNotice from "./components/OpenTestingNotice";
import { MvpCard, MvpSection } from "./components/MvpSurface";
import {
  COMMUNITY_CARDS,
  DESIGN_CARDS,
  LOCAL_LIFE_THEMES,
  PLATFORM_ENTRY_LINKS,
  PLATFORM_PILLARS,
  SELECT_CARDS,
} from "./data/platformNarrative";

export const metadata: Metadata = {
  title: "Yorisou | いまの自分に、次のよりそいを。",
  description:
    "Yorisouは、短い診断とLINEでの振り返りを通じて、いまの状態、人との距離感、仕事や生活のリズムを見つめ直し、レポート、情報、選択肢、参加できる小さな取り組みを届けるサービスです。",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_42%,_#F3FAF6_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.08)] bg-[radial-gradient(circle_at_14%_0%,_rgba(217,130,86,0.11),_transparent_30%),radial-gradient(circle_at_88%_7%,_rgba(223,238,235,0.75),_transparent_34%),linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_60%,_#F3FAF6_100%)]">
        <div className="container pb-8 pt-6 md:pb-12 md:pt-14">
          <MotionReveal className="mx-auto max-w-[48rem] space-y-4 md:text-center" delay={20} distance={18}>
            <p className="service-kicker">Yorisou</p>
            <h1 className="display-serif text-[2.1rem] leading-[1.16] text-[#2F2A28] md:text-[3.35rem]">
              いまの自分に、
              <br className="hidden md:block" />
              <span className="text-[#173B35]">次のよりそいを。</span>
            </h1>
            <p className="max-w-[43rem] text-[15px] leading-8 text-[#5F5750] md:mx-auto">
              Yorisouは、短い診断とLINEでの振り返りを通じて、いまの状態、人との距離感、仕事や生活のリズムを見つめ直すためのサービスです。診断結果やフィードバックをもとに、深いレポート、役立つ情報、合いそうなサービスや商品アイデア、参加できる小さな取り組みを届けながら、あなたに合う次の一歩を一緒に探していきます。
            </p>
            <p className="max-w-[40rem] text-[12px] leading-6 text-[#6F625C] md:mx-auto">
              医療・心理診断ではありません。自分を決めつけるためではなく、今の状態を見つめるための小さな手がかりです。
            </p>
            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap md:justify-center">
              <Link
                href="/open-testing"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-6 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
              >
                今の自分を診断する
              </Link>
              <Link
                href="/tests"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white/88 px-6 text-[14px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
              >
                入口を選ぶ
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="container py-6 md:py-8">
        <div className="mx-auto max-w-[52rem]">
          <OpenTestingNotice
            title="いま試せること"
            body="いまは、短い診断の入口、120問の公開テスト、結果ページ、深いレポート、LINE保存、感想送信まで一通り使えます。受け取った声をもとに、おすすめ、診断テーマ、Yorisou Select、Yorisou Designの提案候補を少しずつ育てています。"
            primaryHref="/contact?topic=open-testing"
            primaryLabel="感想や不具合を送る"
            secondaryHref="/open-testing"
            secondaryLabel="公開中の入口を見る"
          />
        </div>
      </section>

      <MvpSection
        eyebrow="Yorisouがしていること"
        title="診断だけで終わらない、よりそいの入口。"
        lead="Yorisouは、ひとつのテストやレポートだけを売る場所ではなく、今の状態を見つめ直し、次に合いそうな情報や参加の形までつなぐための軽い伴走面を目指しています。"
        className="!py-8 md:!py-10"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PLATFORM_PILLARS.map((pillar) => (
            <MvpCard
              key={pillar.title}
              className="space-y-3 rounded-[1.2rem] border-[rgba(23,59,53,0.1)] bg-white/94 p-5 shadow-[0_12px_26px_rgba(23,59,53,0.06)]"
            >
              <p className="text-[15px] font-semibold leading-7 text-[#173B35]">{pillar.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{pillar.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="入口の選び方"
        title="今日はどこから始めるか。"
        lead="今すぐ診断したい人も、まず入口を見比べたい人も、LINEからゆるく続けたい人も、今の自分に合う入り方を選べます。"
        className="!py-8"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {PLATFORM_ENTRY_LINKS.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="group rounded-[1.35rem] border border-[rgba(23,59,53,0.12)] bg-white/92 p-5 shadow-[0_12px_28px_rgba(23,59,53,0.06)] transition hover:-translate-y-0.5 hover:border-[rgba(23,59,53,0.22)]"
            >
              <p className="text-[15px] font-semibold leading-7 text-[#173B35]">{entry.title}</p>
              <p className="mt-2 text-[13px] leading-7 text-[#6F625C]">{entry.body}</p>
              <span className="mt-4 inline-flex min-h-[42px] items-center rounded-full border border-[rgba(23,59,53,0.12)] bg-[#F8F7F4] px-4 text-[12px] font-semibold text-[#315F50]">
                {entry.label}
              </span>
            </Link>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="LINEで、ゆるく続くよりそい"
        title="あとで見返せる、次もつながる。"
        lead="診断結果をLINEに保存すると、あとから見返せます。必要に応じて、振り返りのきっかけ、次に試せる診断、深いレポート、あなたに合いそうな情報が届くことがあります。通知はいつでも止められるようにします。"
        className="!py-8"
      >
        <MvpCard className="grid gap-4 rounded-[1.3rem] border-[rgba(23,59,53,0.12)] bg-white/92 p-5 shadow-[0_12px_28px_rgba(23,59,53,0.06)] md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">今つながっていること</p>
            <div className="grid gap-2 text-[13px] leading-6 text-[#5F5750] sm:grid-cols-2">
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3">結果をLINEに保存して見返す</div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3">必要なときだけ次の入口を受け取る</div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3">深いレポートや関連情報へ戻る</div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3">不要なときは通知を止める</div>
            </div>
          </div>
          <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.1)] bg-[rgba(243,250,246,0.72)] p-4">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">LINEから始める</p>
            <p className="mt-2 text-[13px] leading-7 text-[#6F625C]">
              LINEは、診断の代わりではなく、結果や振り返りを無理なく続けるための軽い入口です。
            </p>
            <Link
              href="/line/mini-app"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.18)] bg-white px-5 text-[13px] font-semibold text-[#173B35] transition hover:-translate-y-0.5"
            >
              LINEでYorisouを開く
            </Link>
          </div>
        </MvpCard>
      </MvpSection>

      <MvpSection
        eyebrow="深く読みたいときのレポート"
        title="レポートは、Yorisouの一層です。"
        lead="無料結果だけでは見えにくい傾向や、関係・仕事・選び方のリズムを、もう少し具体的に整理します。レポートは、あなたの状態を決めつけるものではなく、次の選択肢を考えるための読みものです。"
        className="!py-8 md:!py-10"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_12px_24px_rgba(23,59,53,0.06)]">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              今の自分の流れ、関係の距離、仕事や生活で整えやすいペースを、無料結果より少し深く読むための導線があります。
            </p>
            <p className="text-[14px] leading-7 text-[#5F5750]">
              いまは公開テスト中のため、実際の全文レポートと保存導線も確認できます。
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/contact?topic=open-testing"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
              >
                レポート案内を受け取る
              </Link>
              <Link
                href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white/85 px-5 text-[14px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
              >
                レポート preview を見る
              </Link>
            </div>
          </MvpCard>
          <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_12px_24px_rgba(23,59,53,0.06)]">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">関連する入口</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/reports/self-understanding/EM-AK" className="text-[14px] font-semibold text-[#315F50] hover:underline">
                自己理解レポートの見本を見る
              </Link>
              <Link href="/result?resultId=EM-AK&overlayId=balancing&confidence=low" className="text-[14px] font-semibold text-[#315F50] hover:underline">
                結果ページの見本を見る
              </Link>
            </div>
          </MvpCard>
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="Yorisou Select"
        title="今の状態に合いそうな選択肢を、少しずつ。"
        lead="診断結果やフィードバックをもとに、今の状態に合いそうな読みもの、道具、サービス、商品を少しずつ提案していきます。"
        className="!py-8"
      >
        <div className="grid gap-3 md:grid-cols-4">
          {SELECT_CARDS.map((item) => (
            <MvpCard
              key={item.title}
              className="space-y-2 rounded-[1.15rem] border-[rgba(23,59,53,0.1)] bg-white/94 p-4 shadow-[0_12px_26px_rgba(23,59,53,0.06)]"
            >
              <span className="inline-flex rounded-full bg-[#F3FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#49615B]">
                {item.status}
              </span>
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-6 text-[#7A7068]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
        <p className="text-[12px] leading-6 text-[#8A7E78]">
          ここではまだ、購入や申込みは行いません。いまは提案候補や関心の入口として、無理のない形で整えています。
        </p>
      </MvpSection>

      <MvpSection
        eyebrow="Yorisou Design"
        title="あると助かるものを、声から育てる。"
        lead="診断やフィードバックから見えてきた「あると助かるもの」を、アイデア、試用、共創、商品化へと少しずつ育てていきます。"
        className="!py-8"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {DESIGN_CARDS.map((item) => (
            <MvpCard
              key={item.title}
              className="space-y-3 rounded-[1.2rem] border-[rgba(23,59,53,0.1)] bg-white/94 p-5 shadow-[0_12px_26px_rgba(23,59,53,0.06)]"
            >
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="小さく参加できる、よりそいの場"
        title="参加は任意で、声は次の改善につながる。"
        lead="気になるテーマには、フィードバック、試用、生活の観察、アイデアづくりとして参加できます。参加は任意です。あなたの声は、よりよい診断、レポート、おすすめ、サービスや商品アイデアにつながります。"
        className="!py-8"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COMMUNITY_CARDS.map((item) => (
            <MvpCard
              key={item.title}
              className="space-y-2 rounded-[1.15rem] border-[rgba(23,59,53,0.1)] bg-white/94 p-4 shadow-[0_12px_26px_rgba(23,59,53,0.06)]"
            >
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-6 text-[#7A7068]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="暮らしの困りごとも、少しずつ見える形に。"
        title="言葉にしにくい生活の困りごとも、関心の入口から。"
        lead="買い物、移動、家族のサポート、地域のつながり。日々の中で言葉にしにくい困りごとも、Yorisouでは関心や相談の入口として受け止め、必要な情報や選択肢を探すきっかけにしていきます。"
        className="!py-8 md:!pb-14"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_12px_24px_rgba(23,59,53,0.06)]">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">関心を寄せているテーマ</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {LOCAL_LIFE_THEMES.map((theme) => (
                <div
                  key={theme}
                  className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3 text-[13px] leading-6 text-[#2F2A28]"
                >
                  {theme}
                </div>
              ))}
            </div>
          </MvpCard>
          <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_12px_24px_rgba(23,59,53,0.06)]">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              いまは、暮らしの困りごとを直接提供するサービスではなく、関心や相談の入口、地域の生活シグナル、今後の責任あるマッチングや公共的な仮説づくりの材料として受け止めています。
            </p>
            <Link
              href="/contact?topic=open-testing"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.18)] bg-white px-5 text-[13px] font-semibold text-[#173B35] transition hover:-translate-y-0.5"
            >
              関心や相談を送る
            </Link>
          </MvpCard>
        </div>
      </MvpSection>
    </main>
  );
}
