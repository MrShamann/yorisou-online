import type { Metadata } from "next";

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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_42%,_#F3FAF6_100%)] text-[#2F2A28]">
      <OpenTestingPageTracker eventName="open_testing_viewed" route="/open-testing" source="open_testing_page" entrySource="open-testing" />
      <section className="border-b border-[rgba(23,59,53,0.08)] bg-[radial-gradient(circle_at_14%_0%,_rgba(217,130,86,0.11),_transparent_30%),radial-gradient(circle_at_88%_7%,_rgba(223,238,235,0.75),_transparent_34%),linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_60%,_#F3FAF6_100%)]">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-[44rem] space-y-4">
            <p className="service-kicker">公開テストのご案内</p>
            <div className="inline-flex rounded-full border border-[rgba(23,59,53,0.12)] bg-white/84 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#49615B]">
              公開テスト中
            </div>
            <h1 className="display-serif text-[2rem] leading-[1.16] text-[#2F2A28] md:text-[3rem]">
              はじめての方が、
              <br className="hidden sm:block" />
              結果まで迷わず進めるための入口です。
            </h1>
            <p className="max-w-[38rem] text-[15px] leading-8 text-[#5F5750]">
              120問のチェックから、結果、詳しいレポート、保存、感想送信まで、現在のYorisouで試せる流れをまとめています。
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <OpenTestingTrackingLink
                href="/check-in?source=open-testing&entry_source=open-testing"
                tracking={{ eventName: "open_testing_start_clicked", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing" }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5"
              >
                公開テストを始める
              </OpenTestingTrackingLink>
              <OpenTestingTrackingLink
                href="/line/mini-app"
                tracking={{ eventName: "line_entry_opened", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing" }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white/85 px-5 text-[14px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
              >
                LINEから始める
              </OpenTestingTrackingLink>
            </div>
            <p className="text-[12px] leading-6 text-[#6F625C]">
              LINEから始めると、結果の見返しや関連するお知らせをLINEで受け取れる状態が有効になることがあります。不要な場合はいつでも停止できます。
            </p>
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
            <MvpCard
              key={step.title}
              className="space-y-2 rounded-[1.15rem] border-[rgba(23,59,53,0.1)] bg-white/94 p-4 shadow-[0_12px_26px_rgba(23,59,53,0.06)]"
            >
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
          <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_12px_24px_rgba(23,59,53,0.06)]">
            {TESTING_NOTES.map((note) => (
              <p key={note} className="text-[14px] leading-7 text-[#5F5750]">
                {note}
              </p>
            ))}
          </MvpCard>
          <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.1)] bg-white/92 p-5 shadow-[0_12px_24px_rgba(23,59,53,0.06)]">
            <p className="text-[12px] font-semibold tracking-[0.08em] text-[#49615B]">関連ページ</p>
            <div className="flex flex-col gap-2.5">
              <OpenTestingTrackingLink
                href="/contact?topic=open-testing"
                tracking={{ eventName: "contact_feedback_submitted", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing" }}
                className="text-[14px] font-semibold text-[#315F50] hover:underline"
              >
                公開テストの感想・不具合報告を送る
              </OpenTestingTrackingLink>
              <OpenTestingTrackingLink
                href="/result?resultId=EM-AK&overlayId=balancing&confidence=low"
                tracking={{ eventName: "result_viewed", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing", resultId: "EM-AK", overlayId: "balancing", confidence: "low" }}
                className="text-[14px] font-semibold text-[#315F50] hover:underline"
              >
                結果ページの見本を見る
              </OpenTestingTrackingLink>
              <OpenTestingTrackingLink
                href="/reports/self-understanding/EM-AK"
                tracking={{ reportEvent: { eventType: "full_viewed", reportType: "self-understanding-v0.2.1", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing", resultId: "EM-AK" } }}
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
