import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "気づく | Yorisou",
  description: "今の気配から、深く知るところまで。自分のペースで選べます。",
};

// 気づく — the depth ladder.
//
// The live product put 120 questions in the entry position, which is the single biggest reason a
// first visit asks for more than it gives. Depth is not removed here; it is ORDERED. Someone with two
// minutes and someone with twenty minutes should both find their own next step on this screen, and
// the shortest one is listed first because it is the one most people can actually take today.
const STEPS = [
  {
    href: "/today/check-in",
    eyebrow: "1〜2分",
    title: "今の気配を見る",
    body: "いまの状態を、短い言葉にします。",
    emphasis: true,
  },
  {
    href: "/tests",
    eyebrow: "5分ほど",
    title: "短く知る",
    body: "テーマを選んで、もう少しだけ見てみる。",
    emphasis: false,
  },
  {
    href: "/tests/ima-iro",
    eyebrow: "120問・じっくり",
    title: "いま色テスト",
    body: "今の動き方を、24の色と名前で見ていきます。",
    emphasis: false,
  },
] as const;

export default function NoticePage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-5 pb-28 pt-8">
      <h1 className="text-[26px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        気づく
      </h1>
      <p className="mt-2 text-[15px] leading-[1.85] text-[var(--pxr-text-secondary)]">
        時間があるときも、ないときも。今できるところから。
      </p>

      <ul className="mt-7 flex flex-col gap-3">
        {STEPS.map((step) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className={[
                "block rounded-[var(--pxr-radius-lg)] px-5 py-5 transition-colors",
                "min-h-[var(--pxr-touch-target)]",
                step.emphasis
                  ? "bg-[var(--pxr-surface-emphasis)] border border-[var(--pxr-border-subtle)]"
                  : "bg-[var(--pxr-surface)] border border-[var(--pxr-border-subtle)]",
              ].join(" ")}
            >
              <span className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                {step.eyebrow}
              </span>
              <span className="mt-1.5 block text-[18px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
                {step.title}
              </span>
              <span className="mt-1 block text-[14px] leading-[1.8] text-[var(--pxr-text-secondary)]">
                {step.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
