"use client";

import { useState } from "react";

import ProtoShell from "../_lib/ProtoShell";
import { YorisouSymbol } from "@/app/components/YorisouLogo";

export default function PrototypeLogin() {
  const [emailMode, setEmailMode] = useState(false);

  return (
    <ProtoShell title="わたし">
      <div className="flex min-h-[70dvh] items-center justify-center py-6">
        <div className="w-full max-w-[400px] rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-white p-6 shadow-[var(--yorisou-shadow-raised)] md:p-7">
          <div className="flex flex-col items-center text-center">
            <div className="yorisou-orb flex h-[62px] w-[62px] items-center justify-center">
              <YorisouSymbol variant="white" size={30} />
            </div>
            <h1 className="mt-4 text-[1.2rem] font-bold leading-[1.4]">続きを、あなたのものに。</h1>
            <p className="mt-1.5 text-[12.5px] leading-6 text-[var(--yorisou-color-neutral-500)]">
              状態の記録・保存した提案・ふり返りが、この端末以外からも見られるようになります。
            </p>
          </div>

          <div className="mt-5 grid gap-2.5">
            <button
              type="button"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[var(--yorisou-radius-pill)] bg-[#06C755] px-4 text-[14.5px] font-bold text-white transition duration-[var(--yorisou-motion-tap)] hover:bg-[#05B34C] active:scale-[0.99]"
            >
              <span className="inline-flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white text-[10px] font-black text-[#06C755]" aria-hidden="true">L</span>
              LINEで続ける
            </button>

            {emailMode ? (
              <form className="yorisou-reveal grid gap-2" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="proto-email" className="text-[12px] font-bold text-[var(--yorisou-color-neutral-800)]">
                  メールアドレス
                </label>
                <input
                  id="proto-email"
                  type="email"
                  autoComplete="email"
                  className="min-h-[48px] rounded-[var(--yorisou-radius-button)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[14px] outline-none transition focus:border-[var(--yorisou-color-primary-500)]"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-4 text-[14px] font-bold text-white transition hover:bg-[var(--yorisou-color-primary-600)]"
                >
                  ログインリンクを受け取る
                </button>
                <button type="button" onClick={() => setEmailMode(false)} className="text-[12px] font-semibold text-[var(--yorisou-color-neutral-500)] underline-offset-2 hover:underline">
                  戻る
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setEmailMode(true)}
                className="inline-flex min-h-[50px] items-center justify-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] bg-white px-4 text-[14px] font-semibold text-[var(--yorisou-color-neutral-800)] transition duration-[var(--yorisou-motion-tap)] hover:border-[var(--yorisou-color-primary-500)]"
              >
                メールで続ける
              </button>
            )}
          </div>

          <p className="mt-5 text-center text-[11.5px] leading-5 text-[var(--yorisou-color-neutral-500)]">
            記録はすべて非公開で、あなたにだけ表示されます。いつでも削除できます。
          </p>
        </div>
      </div>
    </ProtoShell>
  );
}
