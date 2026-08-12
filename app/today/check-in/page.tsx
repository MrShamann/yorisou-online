import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "今の気配を見る | Yorisou",
  description: "1〜2分で、いまの状態を短い言葉に。",
};

// 今の気配を見る — the lightweight current-state interaction.
//
// ROUTE NOTE. This deliberately does not live at `/check-in`. That path has already meant two
// different products over this codebase's life, and every shared link, saved link and LINE return
// pointing at it was made with the 120Q in mind. Reusing it would keep the URL alive while silently
// swapping the product underneath — a semantic break, which is worse than a 404 because nothing warns
// the person. `/check-in` therefore keeps redirecting to the Deep Dive.
//
// SCOPE. PXR-1 builds the experience shell and does NOT invent a new assessment. No new scoring
// methodology, no new persona model, no fabricated canonical questions. The interaction below is the
// framing and the next action; the governed signal set it will read is wired in a later step rather
// than improvised here.
export default function TodayCheckInPage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-5 pb-28 pt-8">
      <span className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        1〜2分
      </span>
      <h1 className="mt-1.5 text-[26px] font-semibold leading-[1.5] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        今の気配を見る
      </h1>
      <p className="mt-3 text-[15px] leading-[1.85] text-[var(--pxr-text-secondary)]">
        いまの状態を、短い言葉にします。<br />
        決めつけるものではありません。
      </p>

      <div className="mt-8 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface-emphasis)] px-5 py-6">
        <p className="text-[15px] leading-[1.85] text-[var(--pxr-text-secondary)]">
          この短い問いかけは準備中です。<br />
          今は、じっくり見ていくほうから始められます。
        </p>
        <Link
          href="/tests/ima-iro"
          className="mt-4 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          いま色テストを見る
        </Link>
      </div>
    </main>
  );
}
