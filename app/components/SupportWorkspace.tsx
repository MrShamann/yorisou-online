import Link from "next/link";

import { EditorialShell, EditorialSection } from "@/app/components/aix3/EditorialShell";

// AIX-3D-1 (Part B) — support/access helper rendered on the shared editorial
// surface. The shared SiteHeader/SiteFooter (brand + language toggle + nav) now
// wrap this page, so the workspace owns only its access-helper content. The
// reset form + login / register / open-testing / founder-entry links and their
// locale-aware targets are preserved verbatim.

type Locale = "ja" | "en";
type SupportWorkspaceProps = {
  locale: Locale;
};

const copy = {
  ja: {
    eyebrow: "サポート",
    localeToggle: "English",
    title: "Yorisou サポート",
    intro: "ログイン状態やアクセス権限を確認できます。ログインは不要でも今の状態を見つめるチェックは始められます。ここは主に、保存やアカウントを使う人のための入口です。",
    accessTitle: "ログインとアクセス",
    resetLabel: "ログイン状態をリセットしてログイン",
    loginLabel: "ログインする",
    registerLabel: "アカウントを作成する",
    openTestingLabel: "公開テストに戻る",
    accessEntryLabel: "Founder 向け入口を開く",
  },
  en: {
    eyebrow: "Support",
    localeToggle: "日本語",
    title: "Yorisou Support",
    intro: "You can check your login state or access permission here. You can start a check without logging in — this page is mainly for people who use saving or an account.",
    accessTitle: "Login and access",
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
    <EditorialShell
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.intro}
      secondary={{ href: alternateHref, label: t.localeToggle }}
    >
      <EditorialSection title={t.accessTitle}>
        <div className="aix3-ed-card">
          <form action={resetAction} method="post">
            <button type="submit" className="btn btn-primary !min-h-[48px]">
              {t.resetLabel}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={loginHref} className="btn btn-primary !min-h-[44px]">
              {t.loginLabel}
            </Link>
            <Link href={registerHref} className="btn btn-secondary !min-h-[44px]">
              {t.registerLabel}
            </Link>
            <Link href={openTestingHref} className="btn btn-secondary !min-h-[44px]">
              {t.openTestingLabel}
            </Link>
            <Link href={adminEntryHref} className="btn btn-secondary !min-h-[44px]">
              {t.accessEntryLabel}
            </Link>
          </div>
        </div>
      </EditorialSection>
    </EditorialShell>
  );
}
