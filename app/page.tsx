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
    <main className="frontstage-page">
      <section className="frontstage-hero">
        <div className="container">
          <div className="frontstage-hero-inner md:grid-cols-[minmax(0,1fr)_18rem]">
            <MotionReveal className="frontstage-hero-copy" delay={20} distance={18}>
              <p className="service-kicker">Yorisou</p>
              <h1 className="display-serif frontstage-hero-title max-w-[10.5em]">
                いまの自分に、
                <br className="hidden md:block" />
                <span className="text-[#173B35]">次のよりそいを。</span>
              </h1>
              <p className="frontstage-hero-lead">
                Yorisouは、短い診断とLINEでの振り返りを通じて、いまの状態や人との距離感、仕事や生活のリズムを見つめ直すためのサービスです。結果、レポート、関連する入口を落ち着いた順番で受け取れるように整えています。
              </p>
              <div className="frontstage-hero-actions">
                <Link
                  href="/open-testing"
                  className="btn btn-primary"
                >
                  今の自分を診断する
                </Link>
                <Link
                  href="/tests"
                  className="btn btn-secondary"
                >
                  入口を選ぶ
                </Link>
              </div>
            </MotionReveal>

            <MotionReveal className="surface-panel-soft self-end" delay={110} distance={16}>
              <p className="surface-meta">最初に伝えておきたいこと</p>
              <p className="mt-2 text-[13px] leading-7 text-[#6F625C]">
                医療や心理診断ではありません。自分を決めつけるためではなく、今の状態を見つめるための小さな手がかりとして使います。
              </p>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="container py-6 md:py-8">
        <div className="mx-auto max-w-[52rem]">
          <OpenTestingNotice
            title="いま試せる流れ"
            body="いまは、短い入口選びから120問の公開テスト、結果、詳しいレポート、LINE保存、感想送信まで一通り確認できます。受け取った声をもとに、次の入口やおすすめの出し方を少しずつ育てています。"
            primaryHref="/contact?topic=open-testing"
            primaryLabel="感想や不具合を送る"
            secondaryHref="/open-testing"
            secondaryLabel="公開中の入口を見る"
          />
        </div>
      </section>

      <MvpSection
        eyebrow="Yorisouがしていること"
        title="診断で終わらない、次の入口までを整える。"
        lead="Yorisouは、ひとつのテストやレポートだけで終わらず、今の状態を見つめ直し、次に合いそうな情報や参加の入口へつなぐサービスを目指しています。"
        className="!py-7 md:!py-9"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PLATFORM_PILLARS.map((pillar) => (
            <MvpCard
              key={pillar.title}
              className="space-y-3 bg-white/94"
            >
              <p className="text-[15px] font-semibold leading-7 text-[#173B35]">{pillar.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{pillar.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="入口の選び方"
        title="今日は、どこから始めるか。"
        lead="今すぐ診断したい人も、まず入口を見比べたい人も、LINEからゆるく続けたい人も、今の自分に合う始め方を選べます。"
        className="!py-7 md:!py-8"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {PLATFORM_ENTRY_LINKS.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="surface-panel group space-y-3 no-underline transition hover:-translate-y-0.5"
            >
              <p className="text-[15px] font-semibold leading-7 text-[#173B35]">{entry.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{entry.body}</p>
              <span className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(23,59,53,0.1)] bg-[#F8F7F4] px-4 text-[12px] font-semibold text-[#315F50]">
                {entry.label}
              </span>
            </Link>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="LINEで、ゆるく続くよりそい"
        title="あとで見返せる、次にもつながる。"
        lead="診断結果をLINEに保存すると、あとから見返せます。必要に応じて、振り返りのきっかけや次に試せる入口、あなたに合いそうな情報が届くことがあります。通知はいつでも止められるようにします。"
        className="!py-7 md:!py-8"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel space-y-4">
            <p className="surface-meta">今つながっていること</p>
            <div className="surface-list">
              <div className="text-[13px] leading-7 text-[#5F5750]">結果をLINEに保存して見返す</div>
              <div className="text-[13px] leading-7 text-[#5F5750]">必要なときだけ次の入口を受け取る</div>
              <div className="text-[13px] leading-7 text-[#5F5750]">深いレポートや関連情報へ戻る</div>
              <div className="text-[13px] leading-7 text-[#5F5750]">不要なときは通知を止める</div>
            </div>
          </div>
          <div className="surface-panel-soft space-y-3">
            <p className="surface-meta">LINEから始める</p>
            <p className="text-[13px] leading-7 text-[#6F625C]">
              LINEは、診断の代わりではなく、結果や振り返りを無理なく続けるための軽い入口です。
            </p>
            <Link
              href="/line/mini-app"
              className="btn btn-secondary inline-flex"
            >
              LINEでYorisouを開く
            </Link>
          </div>
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="深く読みたいときのレポート"
        title="レポートは、Yorisouの一層です。"
        lead="無料結果だけでは見えにくい傾向や、関係・仕事・選び方のリズムを、もう少し具体的に整理します。レポートは、あなたの状態を決めつけるものではなく、次の選択肢を考えるための読みものです。"
        className="!py-7 md:!py-9"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <MvpCard className="space-y-3 bg-white/94">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              今の自分の流れや関係の距離、仕事や生活で整えやすいペースを、無料結果より少し深く読むための入口があります。
            </p>
            <p className="text-[14px] leading-7 text-[#5F5750]">
              いまは公開テスト中のため、全文レポートと保存導線も確認できます。
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/contact?topic=open-testing"
                className="btn btn-primary"
              >
                レポート案内を受け取る
              </Link>
              <Link
                href="/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low"
                className="btn btn-secondary"
              >
                レポートの見本を見る
              </Link>
            </div>
          </MvpCard>
          <MvpCard className="space-y-3 bg-white/94">
            <p className="surface-meta">関連する入口</p>
            <div className="surface-link-row flex-col !gap-2.5">
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
        id="yorisou-select"
        eyebrow="Yorisou Select"
        title="今の状態に合いそうな選択肢を、少しずつ。"
        lead="診断結果やフィードバックをもとに、今の状態に合いそうな読みもの、道具、サービス、商品を少しずつ提案していきます。"
        className="!py-7 md:!py-8"
      >
        <div className="grid gap-3 md:grid-cols-4">
          {SELECT_CARDS.map((item) => (
            <MvpCard key={item.title} className="space-y-2 bg-white/94">
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
        id="yorisou-design"
        eyebrow="Yorisou Design"
        title="あると助かるものを、声から育てる。"
        lead="診断やフィードバックから見えてきた「あると助かるもの」を、アイデア、試用、共創、商品化へと少しずつ育てていきます。"
        className="!py-7 md:!py-8"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {DESIGN_CARDS.map((item) => (
            <MvpCard key={item.title} className="space-y-3 bg-white/94">
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-7 text-[#6F625C]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        id="yorisou-community"
        eyebrow="小さく参加できる、よりそいの場"
        title="参加は任意で、声は次の改善につながる。"
        lead="気になるテーマには、フィードバック、試用、生活の観察、アイデアづくりとして参加できます。参加は任意です。あなたの声は、よりよい診断、レポート、おすすめ、サービスや商品アイデアにつながります。"
        className="!py-7 md:!py-8"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COMMUNITY_CARDS.map((item) => (
            <MvpCard key={item.title} className="space-y-2 bg-white/94">
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{item.title}</p>
              <p className="text-[13px] leading-6 text-[#7A7068]">{item.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        id="yorisou-local-life"
        eyebrow="暮らしの小さな揺れも、入口から。"
        title="言葉にしにくい揺れを、次の一歩のヒントに。"
        lead="生活リズム、気持ちの戻り方、人との距離、小さな行動。まだ大きな悩みになる前の揺れも、Yorisouでは今の関心を整理する入口として受け止めます。"
        className="!py-7 md:!pb-14"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <MvpCard className="space-y-3 bg-white/94">
            <p className="surface-meta">関心を寄せているテーマ</p>
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
          <MvpCard className="space-y-3 bg-white/94">
            <p className="text-[14px] leading-7 text-[#5F5750]">
              いまは、暮らしを直接引き受けるサービスではなく、今の関心や戻り方を整理する入口として扱っています。受け取った声は、次の案内や小さな改善につなげる材料として慎重に見ています。
            </p>
            <Link
              href="/contact?topic=open-testing"
              className="btn btn-secondary"
            >
              感想や関心を送る
            </Link>
          </MvpCard>
        </div>
      </MvpSection>
    </main>
  );
}
