"use client";

import { useState } from "react";

import ProtoShell from "../_lib/ProtoShell";
import { FEED_ITEMS, FEED_TYPE_META } from "../_lib/fixtures";

type ItemState = { feedback?: "saved" | "try" | "skip"; showReason?: boolean };

export default function PrototypeDiscover() {
  const [states, setStates] = useState<Record<string, ItemState>>({});

  const visible = FEED_ITEMS.filter((item) => states[item.id]?.feedback !== "skip");

  function setFeedback(id: string, feedback: "saved" | "try" | "skip") {
    setStates((s) => ({ ...s, [id]: { ...s[id], feedback } }));
  }
  function toggleReason(id: string) {
    setStates((s) => ({ ...s, [id]: { ...s[id], showReason: !s[id]?.showReason } }));
  }

  return (
    <ProtoShell title="見つける">
      <div className="mx-auto max-w-[560px]">
        <h1 className="text-[1.25rem] font-bold leading-[1.4]">今のあなたに近いもの</h1>
        <p className="mt-1 text-[12.5px] leading-6 text-[var(--yorisou-color-neutral-500)]">
          今日の候補は{FEED_ITEMS.length}件だけ。合わないものは減らせます。
        </p>

        <div className="mt-4 grid gap-4">
          {visible.map((item) => {
            const meta = FEED_TYPE_META[item.type];
            const st = states[item.id] || {};
            return (
              <article key={item.id} className="overflow-hidden rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-white shadow-[var(--yorisou-shadow-card)]">
                {/* Visual identity */}
                <div className="relative flex h-[108px] items-end px-5 pb-3" style={{ background: meta.tint }}>
                  <span className="rounded-[var(--yorisou-radius-pill)] bg-white/92 px-3 py-1 text-[11px] font-bold text-[var(--yorisou-color-primary-700)]">
                    {meta.label}
                  </span>
                  <span className="absolute right-4 top-3 rounded-[var(--yorisou-radius-pill)] bg-black/25 px-2.5 py-1 text-[10.5px] font-semibold text-white">
                    {item.timeCost}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-[15.5px] font-bold leading-7">{item.title}</h2>
                  <p className="mt-1 text-[13px] leading-6 text-[var(--yorisou-color-neutral-500)]">{item.body}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[var(--yorisou-color-neutral-500)]">
                    <span className="font-semibold">{item.source}</span>
                    <button
                      type="button"
                      onClick={() => toggleReason(item.id)}
                      aria-expanded={Boolean(st.showReason)}
                      className="font-bold text-[var(--yorisou-color-primary-600)] underline-offset-2 hover:underline"
                    >
                      なぜこれ？
                    </button>
                  </div>

                  {st.showReason ? (
                    <p className="mt-2 rounded-[var(--yorisou-radius-button)] bg-[var(--yorisou-color-primary-50)] px-3.5 py-2.5 text-[12.5px] leading-6 text-[var(--yorisou-color-primary-700)]">
                      {item.reason}
                      <span className="mt-1 block text-[11px] text-[var(--yorisou-color-primary-600)] opacity-80">{item.disclosure}</span>
                    </p>
                  ) : null}

                  {st.feedback ? (
                    <p className="mt-4 text-[13px] font-bold text-[var(--yorisou-color-accent-600)]" aria-live="polite">
                      {st.feedback === "saved" ? "保存しました。「わたし」からいつでも見返せます。" : "試すことにしました。明日そっと聞きますね。"}
                    </p>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setFeedback(item.id, "try")} className="inline-flex min-h-[42px] items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-4 text-[13px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[var(--yorisou-color-primary-600)] active:scale-[0.98]">
                        試してみる
                      </button>
                      <button type="button" onClick={() => setFeedback(item.id, "saved")} className="inline-flex min-h-[42px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13px] font-semibold">
                        保存
                      </button>
                      <button type="button" onClick={() => setFeedback(item.id, "skip")} className="inline-flex min-h-[42px] items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[13px] font-semibold text-[var(--yorisou-color-neutral-500)]">
                        今は合わない
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Finite end */}
        <div className="mt-6 rounded-[var(--yorisou-radius-card)] border border-dashed border-[var(--yorisou-color-neutral-200)] bg-[var(--yorisou-color-surface-raised)] px-5 py-6 text-center">
          <p className="text-[13.5px] font-bold">今日はここまで。</p>
          <p className="mt-1 text-[12px] leading-6 text-[var(--yorisou-color-neutral-500)]">
            {visible.length < FEED_ITEMS.length
              ? `「今は合わない」を${FEED_ITEMS.length - visible.length}件受け取りました。次の候補に反映します。`
              : "無理に選ぶ必要はありません。状態が変わったら、候補も変わります。"}
          </p>
        </div>
      </div>
    </ProtoShell>
  );
}
