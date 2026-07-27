"use client";

import Link from "next/link";
import { useState } from "react";

import UnderstandingField from "../_lib/UnderstandingField";
import { LENSES, READING_CORRECTED, SOURCE_LABEL, SUGGESTIONS_FOR, TRAJECTORY } from "../_lib/ux1";

export default function ContinuityView() {
  const [remember, setRemember] = useState(true);
  const [companion, setCompanion] = useState(false);
  const current = READING_CORRECTED;
  const suggestions = SUGGESTIONS_FOR.corrected;

  const recentLenses = LENSES.filter((l) => ["yorisou-values", "daily-check-in", "imairo-120q"].includes(l.id));

  return (
    <div>
      <header className="max-w-[46rem]">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--yorisou-color-accent-500)]">わたしの今</p>
        <h1 className="mt-3 text-[26px] font-bold leading-[1.35] tracking-[-0.01em] text-white md:text-[32px]">
          いまのところ、こう置かれています。
        </h1>
        <p className="mt-3 text-[14px] leading-[1.9] text-[rgba(255,255,255,0.78)]">
          ここはあなただけの層です。人に見える場所ではありません。残すのをやめれば、この場からも消えます。
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.85fr)] lg:gap-12">
        {/* trajectory */}
        <section aria-labelledby="ux1-trajectory">
          <h2 id="ux1-trajectory" className="m-0 text-[13px] font-bold tracking-[0.04em] text-[rgba(255,255,255,0.62)]">
            これまでの動き
          </h2>
          <UnderstandingField
            className="mt-3"
            lenses={LENSES}
            position={current.position}
            trail={[...TRAJECTORY.map((t) => t.position), current.position]}
            description="いまの読みと、これまでの読みの動き。うすい線が、どこからどこへ動いてきたかを示す。"
            markLabel="いまの読み"
          />

          <ol className="m-0 mt-4 grid list-none gap-2 p-0">
            {[...TRAJECTORY].reverse().map((t) => (
              <li
                key={t.labelJa}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.12)] px-4 py-3"
              >
                <span className="text-[13px] font-semibold text-white">{t.labelJa}</span>
                <span className="text-[11.5px] text-[rgba(255,255,255,0.6)]">{t.whenJa}</span>
              </li>
            ))}
            <li className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-accent-500)] bg-[rgba(42,211,193,0.10)] px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[13px] font-semibold text-white">{current.periodJa}</span>
                <span className="text-[11.5px] text-[var(--yorisou-color-accent-500)]">いま</span>
              </div>
              <p className="m-0 mt-1 text-[11.5px] text-[rgba(255,255,255,0.7)]">
                {SOURCE_LABEL[current.source]}：あなたが置き直したものです。
              </p>
            </li>
          </ol>
        </section>

        {/* right column */}
        <div className="grid content-start gap-4">
          <section className="rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-4">
            <h2 className="m-0 text-[12px] font-bold tracking-[0.04em] text-[rgba(255,255,255,0.62)]">最近使った見方</h2>
            <ul className="m-0 mt-2 grid list-none gap-2 p-0">
              {recentLenses.map((l) => (
                <li key={l.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-[13px] text-white">{l.nameJa}</span>
                  <span className="text-[11px] text-[rgba(255,255,255,0.55)]">
                    {l.status === "active_private_pilot" ? "限定公開" : "公開中"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-4">
            <h2 className="m-0 text-[12px] font-bold tracking-[0.04em] text-[rgba(255,255,255,0.62)]">次に試せること（任意・最大2件）</h2>
            <ul className="m-0 mt-2 grid list-none gap-2 p-0">
              {suggestions.map((s) => (
                <li key={s.titleJa} className="rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.12)] p-3">
                  <span className="block text-[13px] font-semibold text-white">{s.titleJa}</span>
                  <span className="mt-1 block text-[12px] leading-[1.7] text-[rgba(255,255,255,0.7)]">{s.whyJa}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-4">
            <h2 className="m-0 text-[12px] font-bold tracking-[0.04em] text-[rgba(255,255,255,0.62)]">覚えておくこと・見せないこと</h2>
            <label className="mt-3 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mt-0.5 h-[18px] w-[18px] accent-[var(--yorisou-color-accent-500)]"
              />
              <span className="text-[12.5px] leading-[1.7] text-[rgba(255,255,255,0.82)]">
                この場に置いておく（外すと、この読みも動きの記録も残しません）
              </span>
            </label>
            <p className="m-0 mt-3 text-[11.5px] leading-[1.7] text-[rgba(255,255,255,0.6)]">
              {remember
                ? "いまは、あなただけが見られる状態で置いています。公開はしていません。"
                : "残さない設定です。この画面を離れると、置かれていたものは消えます。"}
            </p>
          </section>

          <section className="rounded-[var(--yorisou-radius-card)] border border-dashed border-[rgba(255,255,255,0.22)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="m-0 text-[12px] font-bold tracking-[0.04em] text-[rgba(255,255,255,0.62)]">そばに置く（任意）</h2>
              <span className="rounded-[var(--yorisou-radius-pill)] border border-[rgba(255,255,255,0.24)] px-2 py-0.5 text-[9.5px] font-bold tracking-[0.06em] text-[rgba(255,255,255,0.66)]">
                PROTOTYPE_VISUAL_DIRECTION_ONLY
              </span>
            </div>
            <label className="mt-3 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={companion}
                onChange={(e) => setCompanion(e.target.checked)}
                className="mt-0.5 h-[18px] w-[18px] accent-[var(--yorisou-color-accent-500)]"
              />
              <span className="text-[12.5px] leading-[1.7] text-[rgba(255,255,255,0.82)]">
                戻ってきたときだけ、そっと一言を置く
              </span>
            </label>
            <p className="m-0 mt-3 text-[11.5px] leading-[1.7] text-[rgba(255,255,255,0.6)]">
              いまは動いていません。見た目の方向性だけを示しています。こちらから通知を送ることはありません。
            </p>
          </section>

          <Link
            href="/prototype/ux1/result"
            className="inline-flex min-h-[46px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[rgba(255,255,255,0.28)] px-5 text-[13px] font-bold text-white no-underline transition hover:border-white"
          >
            いまの読みに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
