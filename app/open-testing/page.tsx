import type { Metadata } from "next";
import Link from "next/link";

import OpenTestingNotice from "../components/OpenTestingNotice";
import { MvpCard, MvpSection } from "../components/MvpSurface";
import { OpenTestingPageTracker, OpenTestingTrackingLink } from "../components/OpenTestingTracker";

export const metadata: Metadata = {
  title: "公開テスト | Yorisou",
  description:
    "Yorisou公開テストの入口です。120問のチェック、結果、詳しいレポート、保存、感想送信まで一通り試せます。",
};

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
  return (
    <main className="frontstage-page">
      <OpenTestingPageTracker eventName="open_testing_viewed" route="/open-testing" source="open_testing_page" entrySource="open-testing" />
      <section className="frontstage-hero">
        <div className="container">
          <div className="frontstage-hero-inner">
            <div className="frontstage-hero-copy">
            <p className="service-kicker">公開テストのご案内</p>
            <div className="mt-3 inline-flex rounded-full border border-[rgba(23,59,53,0.12)] bg-white/84 px-3 py-1 text-[11px] font-semibold text-[#49615B]">
              公開テスト中
            </div>
            <h1 className="display-serif frontstage-hero-title mt-4 max-w-[12em]">
              はじめての方が、
              <br className="hidden sm:block" />
              結果まで迷わず進めるための入口です。
            </h1>
            <p className="frontstage-hero-lead max-w-[38rem]">
              120問のチェックから、結果、詳しいレポート、保存、感想送信まで、現在のYorisouで試せる流れをまとめています。
            </p>
            <div className="frontstage-hero-actions">
              <OpenTestingTrackingLink
                href="/check-in?source=open-testing&entry_source=open-testing"
                tracking={{ eventName: "open_testing_start_clicked", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing" }}
                className="btn btn-primary"
              >
                公開テストを始める
              </OpenTestingTrackingLink>
              <OpenTestingTrackingLink
                href="/line/mini-app"
                tracking={{ eventName: "line_entry_opened", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing" }}
                className="btn btn-secondary"
              >
                LINEから始める
              </OpenTestingTrackingLink>
            </div>
            </div>
            <div className="frontstage-note">
            <p>
              LINEから始めると、結果の見返しや関連するお知らせをLINEで受け取れる状態が有効になることがあります。不要な場合はいつでも停止できます。
            </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-6 md:py-8">
        <div className="mx-auto max-w-[52rem]">
          <OpenTestingNotice
            body="Yorisouは現在、最初の外部公開テスト中です。いま色テストを受けて、結果、詳しいレポート、保存導線まで一通り試せます。使いにくかった点や不具合は、そのまま感想として送っていただけます。"
            primaryHref="/contact?topic=open-testing"
            primaryLabel="感想や不具合を送る"
            secondaryHref="/check-in?source=open-testing&entry_source=open-testing"
            secondaryLabel="いま色テストを始める"
          />
        </div>
      </section>

      <MvpSection
        eyebrow="このページでわかること"
        title="公開テストで進められる流れ。"
        lead="最初の利用者がどこまで進めるのかを、先に短くまとめています。"
        className="!py-8 md:!py-10"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {OPEN_TESTING_STEPS.map((step, index) => (
            <MvpCard key={step.title} className="space-y-2 bg-white/94">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3FAF6] text-[13px] font-semibold text-[#49615B]">
                {index + 1}
              </div>
              <p className="text-[14px] font-semibold leading-6 text-[#173B35]">{step.title}</p>
              <p className="text-[13px] leading-6 text-[#7A7068]">{step.body}</p>
            </MvpCard>
          ))}
        </div>
      </MvpSection>

      <MvpSection
        eyebrow="公開テストの前提"
        title="先に知っておいてほしいこと。"
        lead="実際に試す前に、公開テストとしての位置づけと感想の送り先を明確にしています。"
        className="!py-8 md:!pb-14"
      >
        <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <MvpCard className="surface-list bg-white/94">
            {TESTING_NOTES.map((note) => (
              <p key={note} className="text-[14px] leading-7 text-[#5F5750]">
                {note}
              </p>
            ))}
          </MvpCard>
          <MvpCard className="space-y-3 bg-white/94">
            <p className="surface-meta">関連ページ</p>
            <div className="surface-link-row flex-col !gap-2.5">
              <Link href="/contact?topic=open-testing" className="text-[14px] font-semibold text-[#315F50] hover:underline">
                公開テストの感想・不具合報告を送る
              </Link>
              <Link
                href="/result?resultId=EM-AK&overlayId=balancing&confidence=low"
                className="text-[14px] font-semibold text-[#315F50] hover:underline"
              >
                結果ページの見本を見る
              </Link>
              <OpenTestingTrackingLink
                href="/reports/self-understanding/EM-AK"
                tracking={{ reportEvent: { eventType: "intent_clicked", reportType: "self-understanding-v0.2.1", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing", resultId: "EM-AK" } }}
                className="text-[14px] font-semibold text-[#315F50] hover:underline"
              >
                詳しいレポートの見本を見る
              </OpenTestingTrackingLink>
            </div>
          </MvpCard>
        </div>
      </MvpSection>
    </main>
  );
}
