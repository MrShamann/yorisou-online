import Link from "next/link";

// OSF-1 — what a signed-out visitor sees on a Life OS surface.
//
// Not a wall and not a pitch. These records are kept against an account, so there is nothing to show
// someone who does not have one — but saying that plainly, once, is kinder than a 404 (which reads
// as "this does not exist") or a redirect (which loses where they were going).

export default function SignInRequired({ next, purpose }: { next: string; purpose: string }) {
  return (
    <div>
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">わたしの記録</p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        {purpose}
      </h1>
      <p className="mt-4 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        ここに残したものは、あなただけが見られます。続けるにはサインインしてください。
      </p>
      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="mt-6 inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-8 text-[16px] font-semibold text-white"
      >
        サインインする
      </Link>
      <p className="mt-6 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
        サインインなしで使えるものもあります。
        <Link href="/today/check-in" className="ml-1 underline underline-offset-4">
          今の気配を見る
        </Link>
        。
      </p>
    </div>
  );
}
