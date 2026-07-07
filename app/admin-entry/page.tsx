import type { Metadata } from "next";
import Link from "next/link";

import { buildSafeInternalHref } from "@/lib/server/foundation/safeRedirect";

export const metadata: Metadata = {
  title: "管理者入口 | Yorisou",
  description: "現在のログイン状態を整えて、管理ログインへ進むための入口です。",
};

export default function AdminEntryPage() {
  const dashboardPath = "/dashboard/open-testing";
  const loginHref = buildSafeInternalHref("/login", dashboardPath);
  const resetAction = `/admin-entry/reset?next=${encodeURIComponent(dashboardPath)}`;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ee_0%,#efe7da_100%)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-8 md:px-6">
        <div className="rounded-[1.75rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.96)] px-6 py-7 shadow-[0_18px_44px_rgba(47,35,33,0.06)] md:px-8 md:py-8">
          <div className="service-kicker">管理者入口</div>
          <h1 className="display-serif mt-4 text-[1.65rem] leading-[1.5] text-[var(--text)] md:text-[2rem]">
            現在のログイン状態を整えて、
            <br />
            管理ログインへ進みます。
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
            管理画面へ入る前に、今のセッションをいったんリセットしてからログインします。
          </p>

          <form action={resetAction} method="post" className="mt-8">
            <button type="submit" className="btn btn-primary w-full justify-center sm:w-auto">
              現在のログイン状態をリセットして、管理ログインへ進む
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
            <Link href={loginHref} className="soft-link">
              ログインページへ
            </Link>
            <Link href="/support" className="soft-link">
              サポートへ戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
