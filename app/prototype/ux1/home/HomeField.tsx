"use client";

import UnderstandingField from "../_lib/UnderstandingField";
import { LENSES, READING_PRIMARY, TRAJECTORY } from "../_lib/ux1";

// The first-screen artifact. It is a real (synthetic) reading, shown and labelled —
// not an abstract "AI" graphic. The legend teaches the three things a newcomer must
// understand: lenses differ, the centre is you, the mark can move.

// The section is labelled with aria-label rather than a visible <h2>: the field
// precedes the page <h1> in reading order, and a heading here would put the
// document outline out of order for screen-reader users.
export default function HomeField() {
  return (
    <section
      aria-label="いまの「置かれ方」の例（架空）"
      className="rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-card)] p-4 shadow-[var(--yorisou-shadow-card)] md:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="m-0 text-[13px] font-bold text-[var(--yorisou-color-neutral-800)]">
          いまの「置かれ方」の例
        </p>
        <p className="m-0 text-[11.5px] text-[var(--yorisou-color-neutral-500)]">架空の例です</p>
      </div>

      <UnderstandingField
        className="mt-1"
        lenses={LENSES}
        position={READING_PRIMARY.position}
        trail={TRAJECTORY.map((t) => t.position)}
        description="中央にその人がいて、まわりにいくつかの見方（レンズ）が並び、いまの読みが場のなかに一点として置かれている図。うすい線は、その読みがこれまで動いてきた跡。"
      />

      <div className="mt-1 rounded-[var(--yorisou-radius-card)] bg-[var(--yorisou-color-primary-50)] px-4 py-3">
        <p className="m-0 text-[13.5px] font-semibold leading-[1.6] text-[var(--yorisou-color-neutral-800)]">
          {READING_PRIMARY.periodJa}
        </p>
        <p className="m-0 mt-1 text-[12.5px] leading-[1.7] text-[var(--yorisou-color-primary-700)]">
          性格ではなく「いまの時期」として置かれています。
        </p>
      </div>

      <ul className="mt-3 grid list-none gap-2 p-0 sm:grid-cols-3">
        {[
          { k: "まわりの線", v: "見方（レンズ）。太さは、いまどれだけ効いているか" },
          { k: "中央の点", v: "あなた。結果ではなく、あなたが中心" },
          { k: "明るい点", v: "いまの読み。違えば動かせる" },
        ].map((item) => (
          <li key={item.k} className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] px-3 py-2">
            <span className="block text-[11.5px] font-bold text-[var(--yorisou-color-neutral-800)]">{item.k}</span>
            <span className="mt-0.5 block text-[11.5px] leading-[1.6] text-[var(--yorisou-color-neutral-500)]">{item.v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
