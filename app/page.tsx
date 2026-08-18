import type { Metadata } from "next";
import Link from "next/link";

import TodayContinuity from "./TodayContinuity";
import TodaySavedState from "./TodaySavedState";
import TodayDiscoveryEntry from "./TodayDiscoveryEntry";

export const metadata: Metadata = {
  title: "YORISOU | AIと整える、わたしの毎日。",
  description: "今の状態を短い言葉にして、次の小さな一歩へ。ログインなしではじめられます。",
};

// 今日 — the product home.
//
// WHAT THIS REPLACED, AND WHY.
//
// The previous root screen was a project explainer: a three-line manifesto, two competing CTAs, then
// a five-step 体験の流れ diagram, a six-card capability grid, an AI section and a LINE section. It
// answered "what is Yorisou?" — a question only a newcomer evaluating the company asks, and only
// once. It never answered "what is useful to me now?", which is the question every visit after the
// first one actually has.
//
// So the business architecture — Select, Design, Community, the roadmap — is gone from here. Those
// capabilities still exist; they surface contextually, when they are relevant to a person, rather
// than as permanent explanatory blocks on the surface someone opens every day. Deeper explanation
// belongs at /about.
//
// NO FABRICATED PERSONALIZATION. Everything on this server-rendered screen is identical for every
// visitor, because a first-time visitor has told us nothing. The one personal element —
// `TodayContinuity` — reads a real governed record and renders nothing when there isn't one.
//
// FIRST VIEWPORT BUDGET: product context, one entry hero, ONE primary action, and the beginning of
// the next section. Not five cards and four CTAs.

const SHORT_ACTIONS = [
  {
    href: "/tests",
    title: "テーマから見る",
    time: "5分ほど",
  },
  {
    href: "/explore",
    title: "合いそうなものを探す",
    time: "数分",
  },
] as const;

export default function TodayPage() {
  return (
    <main className="mx-auto flex w-full max-w-[var(--pxr-content-width)] flex-col px-5 pb-28 pt-8 md:pt-14">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">今日</p>

      {/* The entry hero. One motif's worth of weight, carried by type and space rather than an
          illustration that would push the primary action below the fold. */}
      <h1 className="mt-3 text-[28px] font-semibold leading-[1.5] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        今の気分から、
        <br />
        少しだけ見てみる。
      </h1>
      <p className="mt-3 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        1〜2分で、いまの状態を短い言葉に。
      </p>

      {/* ONE primary action. */}
      <Link
        href="/today/check-in"
        // Full width where the thumb needs it; intrinsic width once there is room, because a 560px
        // button on desktop reads as an unfinished layout rather than a confident one.
        className="mt-6 flex min-h-[var(--pxr-touch-target)] w-full items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-8 py-4 text-[16px] font-semibold text-white sm:w-auto sm:self-start"
      >
        今の気配を見る
      </Link>
      <p className="mt-3 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
        ログインなしではじめられます。診断ではありません。
      </p>

      {/* Real history only. Renders nothing for a new visitor. */}
      <TodayContinuity />
      {/* OSF-1: the same discipline for the account-backed record — nothing for a signed-out or
          empty visitor, and nothing if the database is unreachable. */}
      <TodaySavedState />
      {/* DD-1: Today's curiosity half (今日のひとつ) — gated, authenticated, schema-ready only.
          Utility stays primary; this renders nothing for everyone else. */}
      <TodayDiscoveryEntry />

      <section className="mt-10">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          5分でできること
        </h2>
        {/* Rows, not cards. A bordered rectangle per item would make a calm list look like a
            dashboard, and on a 390px screen that is most of the viewport. */}
        <ul className="mt-2 divide-y divide-[var(--pxr-border-subtle)] border-y border-[var(--pxr-border-subtle)]">
          {SHORT_ACTIONS.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="flex min-h-[var(--pxr-touch-target)] items-baseline justify-between gap-4 py-4"
              >
                <span className="text-[16px] font-medium leading-[1.6] text-[var(--pxr-text-primary)]">
                  {action.title}
                </span>
                <span className="shrink-0 text-[13px] text-[var(--pxr-text-muted)]">{action.time}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          じっくり見たいとき
        </h2>
        <Link
          href="/tests/ima-iro"
          className="mt-3 flex min-h-[var(--pxr-touch-target)] flex-col rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface-emphasis)] px-5 py-5"
        >
          <span className="text-[17px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
            いま色テスト
          </span>
          <span className="mt-1 text-[14px] leading-[1.8] text-[var(--pxr-text-secondary)]">
            120問・今の動き方を、24の色と名前で。
          </span>
        </Link>
      </section>

      <p className="mt-12 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
        Yorisouについて詳しくは
        <Link href="/about" className="ml-1 underline underline-offset-4">
          こちら
        </Link>
        。
      </p>
    </main>
  );
}
