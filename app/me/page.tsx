import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "わたし | Yorisou",
  description: "保存した結果と、これまでの気づき。",
};

// わたし — continuity first, settings last.
//
// Deliberately not an account dashboard. What someone returns for is the thread of their own
// history; a profile header and a settings list would put the least personal thing at the top.
// Empty states carry a next action rather than an apology, because a new person sees them first.
export default function MyYorisouPage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-5 pb-28 pt-8">
      <h1 className="text-[26px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        わたし
      </h1>
      <p className="mt-2 text-[15px] leading-[1.85] text-[var(--pxr-text-secondary)]">
        保存したものは、あなたにだけ表示されます。
      </p>

      <section className="mt-7">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          最近の気づき
        </h2>
        <div className="mt-3 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-6">
          <p className="text-[15px] leading-[1.85] text-[var(--pxr-text-secondary)]">
            まだ記録はありません。
          </p>
          <Link
            href="/today/check-in"
            className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
          >
            今の気配を見る
          </Link>
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          保存したもの
        </h2>
        <div className="mt-3 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-6">
          <p className="text-[15px] leading-[1.85] text-[var(--pxr-text-secondary)]">
            気になったものを保存すると、ここに集まります。
          </p>
          <Link
            href="/saved"
            className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
          >
            保存した結果を見る
          </Link>
        </div>
      </section>
    </main>
  );
}
