import type { Metadata } from "next";
import Link from "next/link";

import MotionReveal from "@/app/components/MotionReveal";

export const metadata: Metadata = {
  title: "Yorisou Notes | 今の気持ちや人との距離感を静かに読み直す",
  description:
    "今の気持ちや人との距離感を、少し静かに読み直すための小さな読みものです。人間関係の疲れ、恋愛の距離感、あとで見返すためのメモ。",
};

const THEMES = [
  {
    label: "今の気持ちを整理する",
    body: "今の状態をひとことで表すとしたら何ですか。答えを決めずに、少しだけ言葉にしてみるための入口です。",
    href: "/check-in",
  },
  {
    label: "人間関係の疲れ",
    body: "返信・予定・気づかい。どこに負担が出ているかを小さく整理する。",
    href: "/tests/relationship-fatigue",
  },
  {
    label: "恋愛の距離感",
    body: "相手の気持ちではなく、自分の近づき方や安心しやすい距離を見てみる。",
    href: "/tests/love-distance",
  },
  {
    label: "あとで見返すためのメモ",
    body: "今日の結果を、あとからLINEで静かに見返す。急いで結論を出さなくていい。",
    href: "/line/mini-app",
  },
] as const;

const VOICES = [
  "返すことや合わせることが重い日がある。そう気づくだけで、少し楽になることがある。",
  "待つ時間に気持ちが揺れる。それは自分が弱いのではなく、今の状態が出ているだけかもしれない。",
  "今月の小さな問い：少し軽くしたいものは何ですか？返信、予定、距離、休む時間。ひとつだけで大丈夫です。",
] as const;

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFF9F2_0%,#fffdf8_42%,#F3FAF6_100%)] text-[#2F2A28]">

      {/* ── Header ── */}
      <section className="border-b border-[rgba(23,59,53,0.08)]">
        <div className="container py-10 md:py-14">
          <MotionReveal className="max-w-[44rem] space-y-3" delay={20}>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-[#49615B]">Yorisou Notes</p>
            <h1 className="display-serif text-[2rem] leading-[1.2] text-[#2F2A28] md:text-[2.8rem]">
              今の気持ちや人との距離感を、<br className="hidden sm:block" />
              少し静かに読み直す。
            </h1>
            <p className="text-[15px] leading-7 text-[#5F5750]">
              今の気持ちや人との距離感を、少し静かに読み直すための小さな読みものです。
            </p>
          </MotionReveal>
        </div>
      </section>

      <div className="container py-10 md:py-12">
        <div className="mx-auto max-w-[52rem] space-y-12">

          {/* ── 1. 今月の小さな問い ── */}
          <MotionReveal delay={30}>
            <section className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#49615B]">今月の小さな問い</p>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 px-6 py-5">
                <p className="text-[16px] font-semibold leading-7 text-[#2F2A28]">
                  最近、人との距離で少し疲れた場面はありましたか。
                </p>
                <p className="mt-2 text-[13px] leading-6 text-[#7A7068]">
                  答えは必要ありません。ただ、少しだけ思い浮かべてみてください。それだけで、今の状態が少し見えやすくなることがあります。
                </p>
              </div>
            </section>
          </MotionReveal>

          {/* ── 2. テーマから読む ── */}
          <MotionReveal delay={50}>
            <section className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#49615B]">テーマから読む</p>
              <p className="text-[13px] leading-6 text-[#7A7068]">
                気になるテーマをひとつ選ぶだけで大丈夫です。
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {THEMES.map((theme) => (
                  <Link
                    key={theme.label}
                    href={theme.href}
                    className="group flex flex-col gap-2.5 rounded-[1.2rem] border border-[rgba(23,59,53,0.09)] bg-white/90 p-5 transition hover:-translate-y-0.5 hover:border-[rgba(23,59,53,0.18)] hover:bg-white"
                  >
                    <p className="text-[13px] font-semibold leading-6 text-[#173B35]">{theme.label}</p>
                    <p className="text-[12px] leading-6 text-[#5F5750]">{theme.body}</p>
                    <span className="mt-auto text-[11px] text-[#8A8078] group-hover:text-[#173B35]">→</span>
                  </Link>
                ))}
              </div>
            </section>
          </MotionReveal>

          {/* ── 3. 同じような人の声 ── */}
          <MotionReveal delay={70}>
            <section className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#49615B]">同じような人の声</p>
              <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/80 p-5 space-y-3">
                {VOICES.map((voice, i) => (
                  <div
                    key={i}
                    className="rounded-[0.9rem] border border-[rgba(23,59,53,0.07)] bg-[#F3FAF6] px-4 py-3"
                  >
                    <p className="text-[13px] leading-7 text-[#2F2A28]">「{voice}」</p>
                  </div>
                ))}
                <p className="text-[11px] leading-5 text-[#9A918B]">
                  表示される声は編集されたサンプルです。個人の投稿ではありません。
                </p>
              </div>
            </section>
          </MotionReveal>

          {/* ── 4. 深く読むレポート ── */}
          <MotionReveal delay={90}>
            <section className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#49615B]">深く読むレポート</p>
              <Link
                href="/reports/relationship-fatigue"
                className="group flex flex-col gap-2 rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/90 p-5 transition hover:-translate-y-0.5 hover:border-[rgba(23,59,53,0.18)] hover:bg-white"
              >
                <span className="inline-flex self-start rounded-full bg-[#F3FAF6] px-2.5 py-1 text-[11px] font-semibold text-[#3D6058]">
                  関係の疲れ
                </span>
                <p className="text-[14px] font-semibold leading-6 text-[#2F2A28]">
                  人間関係の疲れを、もう少し深く読む
                </p>
                <p className="text-[12px] leading-6 text-[#5F5750]">
                  返信・予定・距離・回復の視点から、今の疲れ方を静かに読み直すレポートです。先行案内を受け取れます。
                </p>
                <span className="mt-1 inline-flex items-center justify-center self-start rounded-full border border-[rgba(23,59,53,0.14)] bg-[#F8F7F4] px-4 py-2 text-[12px] font-semibold text-[#8A8078] group-hover:bg-[#F3FAF6] group-hover:text-[#173B35]">
                  レポートの内容を見る →
                </span>
              </Link>
            </section>
          </MotionReveal>

          {/* ── 5. LINE CTA ── */}
          <MotionReveal delay={110}>
            <section className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/80 px-5 py-5 space-y-3">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#49615B]">LINEであとから見返す</p>
              <p className="text-[13px] leading-6 text-[#5F5750]">
                今日の気持ちを、あとからLINEで静かに見返す。急いで結論を出さなくていい。
              </p>
              <p className="text-[11px] leading-5 text-[#9A918B]">
                保存や通知は、確認と同意のあとで使えます。
              </p>
              <Link
                href="/line/mini-app"
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.22)] bg-white px-5 text-[13px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
              >
                LINEであとから見返す
              </Link>
            </section>
          </MotionReveal>

          {/* ── Safety note ── */}
          <MotionReveal delay={120}>
            <div className="rounded-[1.1rem] border border-[rgba(23,59,53,0.07)] bg-white/60 px-5 py-3.5">
              <p className="text-[11px] leading-6 text-[#9A918B]">
                Yorisou Notesは、医療・心理診断、治療、カウンセリング、専門的な対人関係の助言ではありません。今の気持ちを、少し静かに整理するための読みものです。
              </p>
            </div>
          </MotionReveal>

        </div>
      </div>
    </main>
  );
}
