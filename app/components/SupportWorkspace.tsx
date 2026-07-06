import Link from "next/link";

type Locale = "ja" | "en";
type SupportWorkspaceProps = {
  locale: Locale;
};

const copy = {
  ja: {
    label: "YORISOU SUPPORT",
    localeToggle: "English",
    title: "Yorisou サポート",
    intro: "ログイン状態やアクセス権限を確認できます。",
    resetLabel: "ログイン状態をリセットしてログイン",
    loginLabel: "ログインする",
    registerLabel: "アカウントを作成する",
    openTestingLabel: "公開テストに戻る",
    accessEntryLabel: "Founder 向け入口を開く",
  },
  en: {
    label: "YORISOU SUPPORT",
    localeToggle: "日本語",
    title: "Yorisou Support",
    intro: "You can check login state or access permission here.",
    resetLabel: "Reset login state and continue to login",
    loginLabel: "Log in",
    registerLabel: "Create account",
    openTestingLabel: "Return to open testing",
    accessEntryLabel: "Open founder access entry",
  },
} as const;

export default function SupportWorkspace({ locale }: SupportWorkspaceProps) {
  const t = copy[locale];
  const alternateHref = locale === "ja" ? "/en/support" : "/support";
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const registerHref = locale === "ja" ? "/register" : "/en/register";
  const openTestingHref = "/open-testing";
  const adminEntryHref = "/admin-entry";
  const resetAction = locale === "ja" ? "/admin-entry/reset" : "/admin-entry/reset?locale=en";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ef_0%,#efe8db_100%)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-3 py-1.5 text-[11px] tracking-[0.18em] text-[var(--muted)] shadow-[0_10px_24px_rgba(47,35,33,0.05)] backdrop-blur">
            {t.label}
          </div>
          <Link
            href={alternateHref}
            className="rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-4 py-2 text-sm text-[var(--accent-sage-text)] shadow-[0_10px_24px_rgba(47,35,33,0.05)] transition hover:bg-white"
          >
            {t.localeToggle}
          </Link>
        </div>

        <div className="flex-1">
          <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-6 py-7 shadow-[0_18px_44px_rgba(47,35,33,0.06)] md:px-8 md:py-8">
            <div className="service-kicker">YORISOU</div>
            <h1 className="display-serif mt-4 text-[1.7rem] leading-[1.65] text-[var(--text)] md:text-[2.08rem]">
              {t.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)] md:text-base">{t.intro}</p>

            <form action={resetAction} method="post" className="mt-7">
              <button type="submit" className="btn btn-primary">
                {t.resetLabel}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={loginHref} className="btn btn-primary">
                {t.loginLabel}
              </Link>
              <Link href={registerHref} className="btn btn-secondary">
                {t.registerLabel}
              </Link>
              <Link href={openTestingHref} className="btn btn-secondary">
                {t.openTestingLabel}
              </Link>
              <Link href={adminEntryHref} className="btn btn-secondary">
                {t.accessEntryLabel}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
