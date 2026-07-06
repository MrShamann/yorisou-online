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
    intro:
      "ログイン状態やアクセス権限を確認したいときのご案内ページです。Founder dashboard に入るには、管理者として許可されたメールアドレスでログインする必要があります。",
    noteTitle: "確認してほしいこと",
    noteItems: [
      "Founder dashboard は、管理者として許可されたメールアドレスでのみ表示されます。",
      "公開テストや通常の利用導線から入った場合は、このサポート案内に戻ることがあります。",
      "メールアドレスでのログインやアカウント作成を済ませると、状態を切り替えやすくなります。",
    ],
    primaryTitle: "次にできること",
    loginLabel: "ログインする",
    registerLabel: "アカウントを作成する",
    openTestingLabel: "公開テストに戻る",
    contactLabel: "お問い合わせへ進む",
    dashboardTitle: "Founder dashboard について",
    dashboardBody:
      "Founder dashboard を開くには、管理者として許可されたメールアドレスのアカウントでログインした状態が必要です。公開ページでは、メールアドレスやセッションの詳細は表示されません。",
  },
  en: {
    label: "YORISOU SUPPORT",
    localeToggle: "日本語",
    title: "Yorisou Support",
    intro:
      "This page helps you confirm your login status or access permission. Founder dashboard access requires an admin-authorized email account.",
    noteTitle: "What to check",
    noteItems: [
      "The founder dashboard is only available to admin-authorized email accounts.",
      "If you arrived from public product routes, you may be returned to this support page instead of the dashboard.",
      "Logging in or creating an account with email makes it easier to confirm the current access state.",
    ],
    primaryTitle: "Next actions",
    loginLabel: "Log in",
    registerLabel: "Create account",
    openTestingLabel: "Return to open testing",
    contactLabel: "Open contact page",
    dashboardTitle: "About founder dashboard access",
    dashboardBody:
      "To open the founder dashboard, you need to be signed in with an admin-authorized email account. This public support page does not show private account, session, or token details.",
  },
} as const;

export default function SupportWorkspace({ locale }: SupportWorkspaceProps) {
  const t = copy[locale];
  const alternateHref = locale === "ja" ? "/en/support" : "/support";
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const registerHref = locale === "ja" ? "/register" : "/en/register";
  const contactHref = locale === "ja" ? "/contact" : "/en/contact";
  const openTestingHref = "/open-testing";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ef_0%,#efe8db_100%)] text-[var(--text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-6 md:py-8">
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

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.92)] px-6 py-7 shadow-[0_18px_44px_rgba(47,35,33,0.06)] md:px-8 md:py-8">
            <div className="service-kicker">YORISOU</div>
            <h1 className="display-serif mt-4 text-[1.7rem] leading-[1.65] text-[var(--text)] md:text-[2.08rem]">
              {t.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)] md:text-base">{t.intro}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={loginHref} className="btn btn-primary">
                {t.loginLabel}
              </Link>
              <Link href={registerHref} className="btn btn-secondary">
                {t.registerLabel}
              </Link>
              <Link href={openTestingHref} className="btn btn-secondary">
                {t.openTestingLabel}
              </Link>
            </div>

            <div className="mt-7 rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[rgba(247,244,238,0.86)] px-5 py-5">
              <div className="service-kicker text-[var(--accent-sage-text)]">{t.dashboardTitle}</div>
              <p className="mt-3 text-sm leading-8 text-[var(--accent-sage-text)]">{t.dashboardBody}</p>
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.88)] px-6 py-6 shadow-[0_18px_44px_rgba(47,35,33,0.05)]">
              <div className="service-kicker text-[var(--accent-sage-text)]">{t.noteTitle}</div>
              <div className="mt-4 grid gap-3">
                {t.noteItems.map((item) => (
                  <div key={item} className="rounded-[1.2rem] bg-[rgba(247,244,238,0.86)] px-4 py-4 text-sm leading-8 text-[var(--accent-sage-text)]">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(255,252,247,0.88)] px-6 py-6 shadow-[0_18px_44px_rgba(47,35,33,0.05)]">
              <div className="service-kicker text-[var(--accent-sage-text)]">{t.primaryTitle}</div>
              <div className="mt-4 flex flex-col gap-3">
                <Link href={contactHref} className="soft-link">
                  {t.contactLabel}
                </Link>
                <Link href={loginHref} className="soft-link">
                  {t.loginLabel}
                </Link>
                <Link href={registerHref} className="soft-link">
                  {t.registerLabel}
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
