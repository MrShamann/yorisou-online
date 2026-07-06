import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Founder Access Entry | Yorisou",
  description: "Founder dashboard に入る前に、現在のログイン状態をリセットしてメールログインへ進むための入口です。",
};

export default function AdminEntryPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ef_0%,#efe8db_100%)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 md:px-6 md:py-8">
        <div className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.94)] px-6 py-7 shadow-[0_18px_44px_rgba(47,35,33,0.06)] md:px-8 md:py-8">
          <div className="service-kicker">FOUNDER ACCESS</div>
          <h1 className="display-serif mt-4 text-[1.7rem] leading-[1.65] text-[var(--text)] md:text-[2.08rem]">
            管理画面へ入る前に、
            <br />
            ログイン状態を整えます。
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)] md:text-base">
            現在の Yorisou セッションをリセットしてから、メールログインへ進むための入口です。
          </p>

          <form action="/admin-entry/reset" method="post" className="mt-7">
            <button type="submit" className="btn btn-primary">
              現在のログイン状態をリセットして、ログインへ進む
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/login" className="btn btn-secondary">
              ログインする
            </Link>
            <Link href="/register" className="btn btn-secondary">
              アカウントを作成する
            </Link>
            <Link href="/dashboard/open-testing" className="btn btn-secondary">
              Founder dashboard を開く
            </Link>
            <Link href="/support" className="btn btn-secondary">
              サポートへ戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
