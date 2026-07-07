import type { Metadata } from "next";

import { RecommendationSignalLink } from "../components/YorisouSignalTracker";
import { YORISOU_TEST_ENTRIES } from "../data/yorisouTests";

export const metadata: Metadata = {
  title: "入口を選ぶ | Yorisou",
  description:
    "Yorisouの入口を、今の状態や関心に合わせて選べるページです。結果、レポート、LINEでの見返し、次のおすすめへつながる始め方を案内します。",
};

export default function TestsPage() {
  return (
    <main className="frontstage-page">
      <section className="frontstage-hero">
        <div className="container">
          <div className="frontstage-hero-inner">
            <div className="frontstage-hero-copy">
              <p className="service-kicker">入口を選ぶ</p>
              <h1 className="display-serif frontstage-hero-title max-w-[11em] mt-3">
                今日は、
                <br className="hidden sm:block" />
                どの入口から始めるか。
              </h1>
              <p className="frontstage-hero-lead max-w-[39rem]">
                Yorisouは、今の状態に近い入口から始めて、結果、レポート、おすすめ、コミュニティ、Yorisou Design、マーケットの次の層へつなげる流れを整えています。
              </p>
              <div className="frontstage-hero-actions">
                <RecommendationSignalLink
                  href="/open-testing"
                  signal={{ source: "tests_page", signalType: "related_test_clicked", testId: "current-state", pagePath: "/tests" }}
                  className="btn btn-primary"
                >
                  まず今の自分をチェックする
                </RecommendationSignalLink>
                <RecommendationSignalLink
                  href="/line/mini-app"
                  signal={{ source: "tests_page", signalType: "line_save_interest_clicked", pagePath: "/tests", interestId: "line-save" }}
                  className="btn btn-secondary"
                >
                  LINEから始める
                </RecommendationSignalLink>
              </div>
            </div>
            <div className="frontstage-note">
              <p>
                入口ごとに向いている場面が違います。迷ったら公開テストから始め、近いテーマがあるときはその入口を選ぶだけで大丈夫です。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-10">
        <div className="mx-auto max-w-[52rem]">
          <div className="surface-panel bg-white/80">
            <p className="surface-meta">入口の選び方</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F6FBF8] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">まず全体を知りたい</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  公開テストから始めると、結果、レポート、LINE保存まで今の流れを一通り試せます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F6FBF8] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">近いテーマがある</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  恋愛、仕事、名前、暮らしなど、今ひっかかるテーマから小さく選べます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F6FBF8] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">あとで戻りたい</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  LINEやレポートの導線があるので、その場で決めきらなくても後から続けられます。
                </p>
              </div>
            </div>
          </div>

          <div className="surface-panel bg-white/76">
            <p className="surface-meta">このページの先にある層</p>
            <div className="mt-3 grid gap-3 md:grid-cols-5">
              {[
                "結果を見る",
                "レポートへ進む",
                "おすすめを見る",
                "コミュニティに反応を残す",
                "Design / マーケットの関心を見る",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/84 px-4 py-3 text-[12px] leading-6 text-[#5F5750]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {YORISOU_TEST_ENTRIES.map((test) => (
              <div
                key={test.id}
                className={`surface-panel ${
                  test.availableNow
                    ? "border-[rgba(23,59,53,0.16)] bg-white/96"
                    : "border-[rgba(23,59,53,0.1)] bg-white/88"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-[rgba(105,151,130,0.22)] bg-[#F4FAF7] px-3 py-1 text-[11px] font-semibold text-[#315F50]">
                    {test.category}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                      test.availableNow
                        ? "bg-[#173B35] text-white"
                        : "border border-[rgba(23,59,53,0.08)] bg-[rgba(23,59,53,0.04)] text-[#7A7068]"
                    }`}
                  >
                    {test.status}
                  </span>
                  <span className="inline-flex rounded-full border border-[rgba(23,59,53,0.08)] bg-white px-3 py-1 text-[11px] font-semibold text-[#8A7764]">
                    {test.estimatedTime}
                  </span>
                </div>
                <h2 className="display-serif mt-4 text-[1.35rem] leading-[1.38] text-[#2F2A28] md:text-[1.62rem]">
                  {test.title}
                </h2>
                <p className="mt-2 text-[14px] leading-7 text-[#5F5750]">{test.hook}</p>
                <div className="surface-panel-soft mt-4">
                  <p className="surface-meta">こんなときに選ぶ</p>
                  <p className="mt-1 text-[13px] leading-6 text-[#6F625C]">{test.whenToChoose}</p>
                </div>
                <div className="surface-panel-soft mt-3">
                  <p className="surface-meta">この入口で受け取れるもの</p>
                  <p className="mt-1 text-[13px] leading-6 text-[#6F625C]">{test.outcome}</p>
                </div>
                <div className="surface-panel-soft mt-3 !bg-white/74">
                  <p className="surface-meta">このあとにつながること</p>
                  <p className="mt-1 text-[13px] leading-6 text-[#6F625C]">{test.nextLayer}</p>
                </div>
                <div className="mt-4">
                  <RecommendationSignalLink
                    href={test.route}
                    signal={{
                      source: "tests_page",
                      signalType: "recommendation_interest_clicked",
                      testId: test.id,
                      pagePath: "/tests",
                    }}
                    className={`inline-flex min-h-[50px] items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold transition hover:-translate-y-0.5 ${
                      test.availableNow
                        ? "border border-[#173B35] bg-[#173B35] text-white shadow-[0_14px_28px_rgba(23,59,53,0.22)] hover:bg-[#0F2F2B]"
                        : "border border-[rgba(105,151,130,0.34)] bg-[#EAF7F1] text-[#315F50] hover:bg-[#ddf0e8]"
                    }`}
                  >
                    {test.label}
                  </RecommendationSignalLink>
                </div>
                <p className="mt-3 text-[12px] leading-6 text-[#8A7764]">{test.trustBoundaryNote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="mx-auto max-w-[52rem]">
          <div className="surface-panel bg-white/78">
            <p className="service-kicker">入口の先でつながるもの</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">結果とレポート</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  結果や整理だけで終わらず、必要ならレポートの見本や関連導線へ進めます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">LINE保存</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  結果を見返したい人は、LINEから無理なく続けられる入口を選べます。
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-4">
                <p className="text-[14px] font-semibold text-[#173B35]">次の提案</p>
                <p className="mt-1 text-[12px] leading-6 text-[#6F625C]">
                  レポート、おすすめ、コミュニティ、Yorisou Design、マーケットの入口へ、テーマごとに無理なくつながります。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-8">
        <div className="mx-auto max-w-[52rem]">
          <p className="text-[12px] leading-7 text-[#8A7764]">
            いずれも医療・心理診断ではありません。サービス提供の約束や占いではなく、今の状態や関心を見直し、次の選択肢を考えるための入口です。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <RecommendationSignalLink
              href="/open-testing"
              signal={{ source: "tests_page", signalType: "related_test_clicked", testId: "current-state", pagePath: "/tests" }}
              className="text-[13px] font-semibold text-[#315F50] hover:underline"
            >
              公開中の入口を見る
            </RecommendationSignalLink>
            <RecommendationSignalLink
              href="/line/mini-app"
              signal={{ source: "tests_page", signalType: "line_save_interest_clicked", pagePath: "/tests", interestId: "line-save" }}
              className="text-[13px] font-semibold text-[#315F50] hover:underline"
            >
              LINE入口を見る
            </RecommendationSignalLink>
            <RecommendationSignalLink
              href="/contact?topic=open-testing"
              signal={{ source: "tests_page", signalType: "community_interest_clicked", pagePath: "/tests", interestId: "community-interest" }}
              className="text-[13px] font-semibold text-[#315F50] hover:underline"
            >
              先行テーマへの関心を送る
            </RecommendationSignalLink>
          </div>
        </div>
      </div>
    </main>
  );
}
