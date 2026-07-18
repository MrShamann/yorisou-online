import type { Metadata } from "next";
import Link from "next/link";

import { OpenTestingPageTracker, OpenTestingTrackingLink } from "../components/OpenTestingTracker";
import DepthFieldStatic from "../components/depth-field/DepthFieldStatic";
import DepthFieldLazy from "../components/depth-field/DepthFieldLazy";
import { intentionDepthParams, intentionPalette } from "../components/depth-field/seed";

export const metadata: Metadata = {
  title: "公開テスト | Yorisou",
  description:
    "Yorisou公開テストの入口です。120問のチェック、結果、詳しいレポート、保存、感想送信まで一通り試せます。",
};

// AIX-2 — open-testing as a narrative continuation of the dark home scene:
// the same depth field, one flow, no card grid. All truth copy preserved.

const OPEN_TESTING_STEPS = [
  { title: "120問に答える", body: "ログインなしで、今の動き方をみるための120問チェックを始められます。" },
  { title: "今の結果を受け取る", body: "24の結果のなかから、公開向けの言葉で今の見え方を表示します。" },
  { title: "詳しいレポートを読む", body: "公開テスト中のため、プレビューだけでなく詳しい本文まで続けて確認できます。" },
  { title: "保存して見返す", body: "必要であればレポートを保存し、あとから自分のペースで見直せます。" },
] as const;

const TESTING_NOTES = [
  "現在は最初の外部公開テスト中です。",
  "医療・心理的な判定ではありません。",
  "使いにくかった点や不具合は、そのまま感想として送れます。",
] as const;

export default function OpenTestingPage() {
  const params = intentionDepthParams("current-state", 220);
  const palette = intentionPalette();

  return (
    <main className="aix2">
      <OpenTestingPageTracker eventName="open_testing_viewed" route="/open-testing" source="open_testing_page" entrySource="open-testing" />

      <section className="relative overflow-hidden border-b border-[var(--hair)]">
        <div className="depth-scene" aria-hidden="true">
          <DepthFieldStatic params={params} palette={palette} formation={0.85} className="depth-layer" />
          <DepthFieldLazy params={params} palette={palette} formation={0.95} className="depth-layer" />
          <div className="depth-veil" />
        </div>
        <div className="container relative z-[1]">
          <div className="max-w-[44rem] py-16 md:py-24">
            <p className="aix2-eyebrow">公開テストのご案内 · 公開テスト中</p>
            <h1 className="aix2-serif mt-4 text-[2.4rem] font-semibold leading-[1.14] text-[color:var(--tx)] md:text-[3.4rem]">
              いまの状態を見て、次の入口まで。
            </h1>
            <p className="aix2-lead mt-5">
              チェックから結果、レポート、保存、おすすめまで、いま使える流れをまとめました。迷ったら、まずここから。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <OpenTestingTrackingLink
                href="/check-in?source=open-testing&entry_source=open-testing"
                tracking={{ eventName: "open_testing_start_clicked", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing" }}
                className="aix2-btn aix2-btn-primary"
              >
                公開テストを始める
              </OpenTestingTrackingLink>
              <Link href="/tests" className="aix2-btn aix2-btn-ghost">別の入口を選ぶ</Link>
            </div>
            <p className="mt-4 max-w-[38rem] text-[12.5px] leading-7 aix2-faint">
              途中でLINE導線も選べます。医療や心理診断ではなく、今の状態を見直すための公開テストです。
            </p>
          </div>
        </div>
      </section>

      <section className="aix2-band">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="aix2-eyebrow">このページでわかること</p>
              <h2 className="aix2-band-title mt-3">公開テストで進められる流れ。</h2>
              <p className="aix2-lead mt-4">
                最初に何をして、次に何が見えるか。結果を読むだけで終わらず、保存やレポート、次の入口へ続きます。
              </p>
            </div>
            <div className="grid gap-0">
              {OPEN_TESTING_STEPS.map((step, i) => (
                <div key={step.title} className="aix2-hair-top py-4 pl-5" style={{ borderLeft: "2px solid var(--hair-2)" }}>
                  <p className="text-[11px] font-bold tracking-[0.16em] text-[color:var(--jade-bright)]">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-[14px] font-bold text-[color:var(--tx)]">{step.title}</p>
                  <p className="mt-1 text-[13px] leading-7 aix2-mut">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="aix2-band !pt-0">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="aix2-eyebrow">公開テストの前提</p>
              <h2 className="aix2-band-title mt-3">先に知っておいてほしいこと。</h2>
              <div className="mt-5 space-y-3">
                {TESTING_NOTES.map((note) => (
                  <p key={note} className="border-l-2 border-[var(--hair-2)] pl-4 text-[14px] leading-7 aix2-mut">{note}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="aix2-eyebrow">関連ページ</p>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/contact?topic=open-testing" className="aix2-link">公開テストの感想・不具合報告を送る →</Link>
                <Link href="/tests" className="aix2-link">ほかの入口を見る →</Link>
                <Link href="/result?resultId=EM-AK&overlayId=balancing&confidence=low" className="aix2-link">結果ページの見本を見る →</Link>
                <OpenTestingTrackingLink
                  href="/reports/self-understanding/EM-AK"
                  tracking={{ reportEvent: { eventType: "intent_clicked", reportType: "self-understanding-v0.2.1", route: "/open-testing", source: "open_testing_page", entrySource: "open-testing", resultId: "EM-AK" } }}
                  className="aix2-link"
                >
                  詳しいレポートの見本を見る →
                </OpenTestingTrackingLink>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-[52rem]">
            <div className="aix2-panel p-6 sm:p-8">
              <p className="aix2-eyebrow">公開テストについて</p>
              <p className="mt-3 aix2-mut text-[14px] leading-8">
                Yorisouは現在、最初の外部公開テスト中です。いま色テストを受けて、結果、詳しいレポート、保存導線まで一通り試せます。使いにくかった点や不具合は、そのまま感想として送っていただけます。
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <Link href="/contact?topic=open-testing" className="aix2-link">感想や不具合を送る →</Link>
                <Link href="/check-in?source=open-testing&entry_source=open-testing" className="aix2-link">いま色テストを始める →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
