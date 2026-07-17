import type { Metadata } from "next";
import Link from "next/link";

import OpenTestingNotice from "../components/OpenTestingNotice";
import { OpenTestingPageTracker, OpenTestingTrackingLink } from "../components/OpenTestingTracker";
import StateFieldStatic from "../components/state-field/StateFieldStatic";
import StateFieldCanvasLazy from "../components/state-field/StateFieldCanvasLazy";
import { intentionParams } from "../components/state-field/seed";

export const metadata: Metadata = {
  title: "公開テスト | Yorisou",
  description:
    "Yorisou公開テストの入口です。120問のチェック、結果、詳しいレポート、保存、感想送信まで一通り試せます。",
};

// AIX-1 — open-testing as a narrative continuation of the home scene:
// the same field, one flow, no card grid. All truth copy preserved.

const OPEN_TESTING_STEPS = [
  {
    title: "120問に答える",
    body: "ログインなしで、今の動き方をみるための120問チェックを始められます。",
  },
  {
    title: "今の結果を受け取る",
    body: "24の結果のなかから、公開向けの言葉で今の見え方を表示します。",
  },
  {
    title: "詳しいレポートを読む",
    body: "公開テスト中のため、プレビューだけでなく詳しい本文まで続けて確認できます。",
  },
  {
    title: "保存して見返す",
    body: "必要であればレポートを保存し、あとから自分のペースで見直せます。",
  },
] as const;

const TESTING_NOTES = [
  "現在は最初の外部公開テスト中です。",
  "医療・心理的な判定ではありません。",
  "使いにくかった点や不具合は、そのまま感想として送れます。",
] as const;

export default function OpenTestingPage() {
  const fieldParams = intentionParams("current-state", 56);

  return (
    <main className="frontstage-page">
      <OpenTestingPageTracker eventName="open_testing_viewed" route="/open-testing" source="open_testing_page" entrySource="open-testing" />

      <section className="aix-scene border-b border-[rgba(23,59,53,0.07)]">
        <div className="state-field-scene" aria-hidden="true">
          <StateFieldStatic params={fieldParams} formation={0.8} className="state-field-layer" />
          <StateFieldCanvasLazy params={fieldParams} formation={0.9} className="state-field-layer" />
          <div className="state-field-veil" />
        </div>
        <div className="container">
          <div className="max-w-[42rem] py-10 md:py-14">
            <p className="aix-kicker">公開テストのご案内 · 公開テスト中</p>
            <h1 className="display-serif mt-4 text-[2rem] leading-[1.2] text-[#22201D] md:text-[2.9rem]">
              いまの状態を見て、
              <br className="hidden sm:block" />
              次の入口まで試せる流れです。
            </h1>
            <p className="aix-band-lead">
              120問のチェックから、結果、詳しいレポート、保存、感想送信、おすすめの入口まで、現在のYorisouで使える流れをまとめています。迷ったら、まずここから始めれば大丈夫です。
            </p>
            <div className="frontstage-hero-actions">
              <OpenTestingTrackingLink
                href="/check-in?source=open-testing&entry_source=open-testing"
                tracking={{ eventName: "open_testing_start_clicked", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing" }}
                className="btn btn-primary"
              >
                公開テストを始める
              </OpenTestingTrackingLink>
              <Link href="/tests" className="btn btn-secondary">
                別の入口を選ぶ
              </Link>
            </div>
            <p className="mt-4 max-w-[38rem] text-[12px] leading-7 text-[#8A8078]">
              結果をあとで見返したい場合は、途中でLINE導線も選べます。これは医療や心理診断ではなく、今の状態を見直し、レポートやおすすめ、次の入口につなげるための公開テストです。
            </p>
          </div>
        </div>
      </section>

      <section className="aix-band">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="aix-kicker">このページでわかること</p>
              <h2 className="aix-band-title mt-3">公開テストで進められる流れ。</h2>
              <p className="aix-band-lead">
                最初に何をして、そのあと何が見えてくるのかを、先に短くまとめています。公開テストは、結果を読むだけで終わりません。あとで見返す、詳しいレポートへ進む、おすすめや別の入口を見る、コミュニティやよりそうデザイン、マッチングの関心へつなぐ、といった次の行動にもつながります。
              </p>
            </div>
            <div className="aix-flow">
              {OPEN_TESTING_STEPS.map((step) => (
                <div key={step.title} className="aix-flow-step">
                  <p className="aix-flow-title">{step.title}</p>
                  <p className="aix-flow-body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="aix-band !pt-0">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="aix-kicker">公開テストの前提</p>
              <h2 className="aix-band-title mt-3">先に知っておいてほしいこと。</h2>
              <div className="mt-5 space-y-3">
                {TESTING_NOTES.map((note) => (
                  <p key={note} className="border-l-2 border-[rgba(105,151,130,0.4)] pl-4 text-[14px] leading-7 text-[#5F5750]">
                    {note}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="aix-kicker">関連ページ</p>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/contact?topic=open-testing" className="text-[14px] font-semibold text-[#315F50] hover:underline">
                  公開テストの感想・不具合報告を送る →
                </Link>
                <Link href="/tests" className="text-[14px] font-semibold text-[#315F50] hover:underline">
                  ほかの入口を見る →
                </Link>
                <Link
                  href="/result?resultId=EM-AK&overlayId=balancing&confidence=low"
                  className="text-[14px] font-semibold text-[#315F50] hover:underline"
                >
                  結果ページの見本を見る →
                </Link>
                <OpenTestingTrackingLink
                  href="/reports/self-understanding/EM-AK"
                  tracking={{ reportEvent: { eventType: "intent_clicked", reportType: "self-understanding-v0.2.1", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing", resultId: "EM-AK" } }}
                  className="text-[14px] font-semibold text-[#315F50] hover:underline"
                >
                  詳しいレポートの見本を見る →
                </OpenTestingTrackingLink>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-[52rem]">
            <OpenTestingNotice
              body="Yorisouは現在、最初の外部公開テスト中です。いま色テストを受けて、結果、詳しいレポート、保存導線まで一通り試せます。使いにくかった点や不具合は、そのまま感想として送っていただけます。"
              primaryHref="/contact?topic=open-testing"
              primaryLabel="感想や不具合を送る"
              secondaryHref="/check-in?source=open-testing&entry_source=open-testing"
              secondaryLabel="いま色テストを始める"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
