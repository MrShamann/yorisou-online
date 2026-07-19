"use client";

import Link from "next/link";

import { lineRecoveryMessage } from "@/lib/app2/lineCallbackContract";

// APP-2 WS-C — LINE connect recovery surface.
//
// Public-safe by construction: it shows only a safe, non-technical recovery
// message derived from an outcome CODE (never a raw error, token, or PII), plus
// three honest paths — retry the connect, continue as a guest on this device, or
// return home. It never dead-ends and never implies a connection that failed.
export default function LineRecoveryView({ code, retryHref }: { code: string; retryHref: string }) {
  const message = lineRecoveryMessage(code);
  const cancelled = code === "cancelled";

  return (
    <main className="aix2">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-[40rem]">
          <p className="aix2-eyebrow">LINE連携</p>
          <h1 className="aix2-serif mt-3 text-[1.9rem] leading-[1.25] text-[color:var(--tx)]">
            {cancelled ? "連携はキャンセルされました。" : "連携を完了できませんでした。"}
          </h1>

          <div className="aix2-panel mt-7 p-6 space-y-4">
            <p className="text-[15px] leading-8 text-[color:var(--tx)]" role="status">
              {message}
            </p>
            <p className="text-[13.5px] leading-8 aix2-mut">
              この端末に残した記録はそのままです。連携しなくても、続きから利用できます。
            </p>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href={retryHref} className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]">
                もう一度つなぐ
              </Link>
              <Link href="/my-yorisou" className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[13px]">
                この端末で続ける
              </Link>
              <Link href="/support" className="aix2-link self-center">
                困ったときは →
              </Link>
            </div>
          </div>

          <p className="mt-5 text-[12.5px] leading-7 aix2-faint">
            連携は任意です。個人情報や結果の内容は、この画面には表示していません。
          </p>
        </div>
      </div>
    </main>
  );
}
