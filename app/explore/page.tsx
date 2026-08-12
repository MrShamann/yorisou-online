import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "探す | Yorisou",
  description: "今の自分に合いそうなものを、時間や深さから探せます。",
};

// 探す — discovery, not a catalogue.
//
// Grouped by what a person actually has right now — time, and how deep they want to go — rather than
// by which internal system produced the object. A test, a report and a piece of writing are all just
// "something that might help next" to the person reading, so they share one visual language here.
const GROUPS = [
  {
    heading: "5分でできること",
    body: "短い時間で、ひとつだけ。",
    href: "/today/check-in",
    cta: "今の気配を見る",
  },
  {
    heading: "テーマから探す",
    body: "気になっていることから選ぶ。",
    href: "/tests",
    cta: "テーマを見る",
  },
  {
    heading: "もっと深く知る",
    body: "時間があるときに、じっくりと。",
    href: "/tests/ima-iro",
    cta: "いま色テストを見る",
  },
] as const;

export default function ExplorePage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-5 pb-28 pt-8">
      <h1 className="text-[26px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        探す
      </h1>
      <p className="mt-2 text-[15px] leading-[1.85] text-[var(--pxr-text-secondary)]">
        今の自分に合いそうなものから。
      </p>

      <div className="mt-7 flex flex-col gap-3">
        {GROUPS.map((group) => (
          <section
            key={group.heading}
            className="rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-5"
          >
            <h2 className="text-[17px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
              {group.heading}
            </h2>
            <p className="mt-1 text-[14px] leading-[1.8] text-[var(--pxr-text-secondary)]">
              {group.body}
            </p>
            <Link
              href={group.href}
              className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
            >
              {group.cta}
            </Link>
          </section>
        ))}
      </div>
    </main>
  );
}
