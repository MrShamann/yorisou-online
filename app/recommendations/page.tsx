import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";
import { currentStateCheckV1, getCurrentStateResult } from "../check-in/currentStateCheckV1";
import RecommendationSignalForm from "./RecommendationSignalForm";

export const metadata: Metadata = {
  title: "次にほしいヒント | Yorisou",
  description:
    "無料結果のあとで、次にどんなヒントが役立ちそうかを 1〜2個だけ静かに選べる Yorisou のページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const resultId = readParam(params, "resultId") ?? currentStateCheckV1.scoring.fallbackResultId;
  const result =
    getCurrentStateResult(resultId) ??
    currentStateCheckV1.fallbackResult;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_88%_0%,_rgba(221,236,242,0.72),_transparent_34%),linear-gradient(180deg,_#FFF7F1_0%,_#fffdf9_44%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="border-b border-[rgba(23,59,53,0.1)]">
        <div className="container grid gap-5 py-5 md:py-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-start lg:gap-8">
          <div className="max-w-[40rem] space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <MvpPill>次のヒント</MvpPill>
              <MvpPill>2つだけ</MvpPill>
            </div>
            <div className="space-y-3">
              <p className="service-kicker">{result.publicName}の次に見るもの</p>
              <h1 className="display-serif max-w-[11em] text-[2rem] leading-[1.13] text-[#2F2A28] md:text-[2.72rem]">
                次に見る入口は、
                <span className="block text-[#173B35]">この2つだけです。</span>
              </h1>
              <p className="max-w-[34rem] text-[15px] font-medium leading-7 text-[#6F625C]">
                今の結果のあとで役立ちそうな入口だけを、軽く並べています。
              </p>
            </div>
            <div className="grid gap-3">
              <MvpCard className="space-y-3 rounded-[1.25rem] border-[rgba(23,59,53,0.12)] bg-[radial-gradient(circle_at_16%_0%,_rgba(217,164,65,0.2),_transparent_46%),linear-gradient(180deg,_#fffefd,_#F4FAF7)] shadow-[0_22px_44px_rgba(23,59,53,0.1)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="service-kicker">正式版の案内</div>
                  <MvpPill>おすすめ</MvpPill>
                </div>
                <h2 className="display-serif text-[1.55rem] leading-[1.25] text-[#2F2A28]">
                  正式版の案内を見る
                </h2>
                <p className="text-[14px] font-medium leading-7 text-[#4A3E39]">
                  72問で、もう少し広く見る入口です。まだ準備中の案内だけを見せます。
                </p>
                <MvpActionLink
                  href="/formal-check"
                  label="正式版の案内を見る"
                  className="rounded-full !border-[#173B35] !bg-[#173B35] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] hover:!bg-[#0F2F2B]"
                />
              </MvpCard>

              <MvpCard className="space-y-3 rounded-[1.15rem] border-[rgba(105,151,130,0.14)] bg-white/92 shadow-[0_14px_30px_rgba(105,151,130,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="service-kicker">もう一度チェック</div>
                  <MvpPill>次の候補</MvpPill>
                </div>
                <h2 className="display-serif text-[1.45rem] leading-[1.38]">もう一度クイックチェックする</h2>
                <p className="text-[14px] leading-7 text-[var(--text)]">
                  別の日に見比べると、今の傾向が少し読みやすくなります。
                </p>
                <MvpActionLink
                  href="/check-in"
                  label="もう一度クイックチェックする"
                  tone="secondary"
                  className="rounded-full border-[rgba(105,151,130,0.22)] bg-[#EAF7F1] !text-[#315F50] shadow-none"
                />
              </MvpCard>
            </div>
          </div>

          <RecommendationSignalForm
            options={[
              {
                value: "self-understanding-reading",
                label: "正式版の案内を見る",
                hint: "もう少し広く見たいとき",
              },
              {
                value: "none-right-now",
                label: "もう一度チェックする",
                hint: "今日は比較を先にしたいとき",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
