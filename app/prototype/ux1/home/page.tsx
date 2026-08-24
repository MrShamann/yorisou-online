import Link from "next/link";

import Ux1Shell from "../_lib/Ux1Shell";
import HomeField from "./HomeField";
import { LENSES } from "../_lib/ux1";

// Surface 1 — Home / Entry.
//
// The first screen does not ASSERT the product in a slogan; it SHOWS the artifact
// the product makes, and labels it. Everything a first-time visitor must know is
// anchored to something visible: the lenses are distinct, the reading is a period
// (not a type), the reading is private by default, and it can be corrected.

export default function Ux1HomePage() {
  const usable = LENSES.filter((l) => l.status !== "not_available").length;

  return (
    <Ux1Shell register="open">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:gap-12">
        {/* The artifact, first. */}
        <HomeField />

        {/* What it is — anchored to what is on screen. */}
        <div className="lg:pb-2">
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--yorisou-color-primary-600)]">
            いまの理解を、置いておく場所
          </p>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--yorisou-color-neutral-800)] md:text-[34px]">
            いくつかの見方から、
            <br />
            「いまの自分」を一枚に置く。
          </h1>
          <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.85] text-[var(--yorisou-color-neutral-500)]">
            YORISOU は、いくつかの見方（レンズ）から見えた「いまの状態」を、ひとつの場に置いていくところです。
            結果は固定した性格ではなく<strong className="font-semibold text-[var(--yorisou-color-neutral-800)]">「いまの時期」</strong>として置かれ、
            違うと感じたら<strong className="font-semibold text-[var(--yorisou-color-neutral-800)]">あなたが置き直せます</strong>。
          </p>

          <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="m-0 text-[12.5px] font-bold text-[var(--yorisou-color-neutral-800)]">見方はひとつではない</dt>
              <dd className="m-0 mt-1 text-[13px] leading-[1.7] text-[var(--yorisou-color-neutral-500)]">
                いま使えるのは{usable}つ。それぞれ見ているものも、確からしさの種類も違います。
              </dd>
            </div>
            <div>
              <dt className="m-0 text-[12.5px] font-bold text-[var(--yorisou-color-neutral-800)]">受け取るもの</dt>
              <dd className="m-0 mt-1 text-[13px] leading-[1.7] text-[var(--yorisou-color-neutral-500)]">
                点数ではなく、「〜時期」というひとつの置き方と、小さな気づき。
              </dd>
            </div>
            <div>
              <dt className="m-0 text-[12.5px] font-bold text-[var(--yorisou-color-neutral-800)]">残すかどうかは、あとで</dt>
              <dd className="m-0 mt-1 text-[13px] leading-[1.7] text-[var(--yorisou-color-neutral-500)]">
                最初は残りません。残す・消す・見せないは、いつでもあなたが決められます。
              </dd>
            </div>
            <div>
              <dt className="m-0 text-[12.5px] font-bold text-[var(--yorisou-color-neutral-800)]">断定はしない</dt>
              <dd className="m-0 mt-1 text-[13px] leading-[1.7] text-[var(--yorisou-color-neutral-500)]">
                診断でも占いでもありません。当たり・外れを決めるものでもありません。
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/prototype/ux1/understand"
              className="inline-flex min-h-[48px] items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-6 text-[14px] font-bold text-white no-underline shadow-[var(--yorisou-shadow-card)] transition hover:bg-[var(--yorisou-color-primary-600)]"
            >
              知りたいことから始める
            </Link>
            <Link
              href="/prototype/ux1/result"
              className="inline-flex min-h-[48px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-5 text-[14px] font-semibold text-[var(--yorisou-color-neutral-800)] no-underline transition hover:border-[var(--yorisou-color-primary-500)]"
            >
              先に「読み」の例を見る
            </Link>
          </div>
          <p className="mt-3 text-[12px] text-[var(--yorisou-color-neutral-500)]">
            ログインなしで始められます。あとから残すかどうかを選べます。
          </p>
        </div>
      </div>
    </Ux1Shell>
  );
}
