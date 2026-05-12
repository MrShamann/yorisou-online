import type { Metadata } from "next";

import { MvpActionLink, MvpCard, MvpPill } from "../components/MvpSurface";

export const metadata: Metadata = {
  title: "正式版の案内 | Yorisou",
  description:
    "72問の正式版は準備中です。いまは設計方向だけを静かに見られる Yorisou の案内ページです。",
};

const previewPoints = [
  "72問版は準備中",
  "24問結果をもとに広く読む",
  "リズム・距離・戻り方を見る",
  "今は回答画面ではありません",
  "固定したラベルではありません",
] as const;

export default function FormalCheckPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(204,226,229,0.58),_transparent_34%),radial-gradient(circle_at_86%_16%,_rgba(255,226,181,0.42),_transparent_32%),linear-gradient(180deg,_#FFF7F1_0%,_#FFFCF8_44%,_#F4FAF7_100%)] text-[#2F2A28]">
      <section className="container py-5 md:py-12">
        <div className="mx-auto max-w-[40rem] space-y-4">
          <div className="flex flex-wrap gap-1.5">
            <MvpPill>正式版の案内</MvpPill>
            <MvpPill>準備中</MvpPill>
          </div>

          <MvpCard className="space-y-4 rounded-[1.35rem] border-[rgba(23,59,53,0.12)] bg-white/95 p-4 shadow-[0_24px_52px_rgba(23,59,53,0.1)] sm:p-7">
            <div className="space-y-3 rounded-[1.15rem] bg-[radial-gradient(circle_at_18%_0%,_rgba(255,226,181,0.5),_transparent_44%),linear-gradient(135deg,_#FFF7F1,_#F4FAF7)] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.62)]">
              <p className="service-kicker text-[#315F50]">72問版は準備中です</p>
              <h1 className="display-serif text-[2rem] leading-[1.1] text-[#2F2A28] md:text-[3rem]">
                今はまだ受けられません。
                <span className="block text-[#173B35]">でも、どんな読み物になるかは先に見られます。</span>
              </h1>
              <p className="text-[15px] font-medium leading-7 text-[#6F625C] md:leading-8">
                24問の無料結果はこのまま使えます。72問版は、今の結果を土台にして、生活リズムや人との距離、戻り方をもう少し広く読むための準備中ページです。
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {previewPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[1rem] border border-[rgba(23,59,53,0.12)] bg-[#F4FAF7] px-4 py-3 text-[14px] font-semibold leading-7 text-[#315F50] shadow-[0_10px_22px_rgba(23,59,53,0.045)]"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="rounded-[0.95rem] border border-[rgba(217,164,65,0.2)] bg-[#FFF7F1] px-4 py-3">
              <p className="text-[13px] leading-7 text-[#6F625C]">
                このページでは72問への回答は始まりません。まずは24問の結果を保存したり、次にほしいヒントを選んだりしながら、今の読みを持ち帰れます。
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <MvpActionLink
                href="/check-in"
                label="クイックチェックを始める"
                className="min-h-[56px] rounded-full !border-[#173B35] !bg-[#173B35] text-[16px] !text-white shadow-[0_18px_34px_rgba(23,59,53,0.22)] hover:!bg-[#0F2F2B]"
              />
              <MvpActionLink href="/" label="ホームへ戻る" tone="secondary" className="rounded-full border-[rgba(23,59,53,0.16)] bg-[#EAF7F1] !text-[#173B35] shadow-none" />
            </div>
          </MvpCard>
        </div>
      </section>
    </main>
  );
}
