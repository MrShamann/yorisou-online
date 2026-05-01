"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import DteProductShell from "./DteProductShell";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type Props = {
  children: ReactNode;
};

function isDteRoute(pathname: string) {
  return (
    pathname === "/result" ||
    pathname.startsWith("/result/") ||
    pathname === "/en/result" ||
    pathname.startsWith("/en/result/")
  );
}

export default function AppShell({ children }: Props) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const dteRoute = isDteRoute(pathname);
  const locale = pathname.startsWith("/en") ? "en" : "ja";
  const personaId = searchParams.get("persona") || searchParams.get("personaId") || null;

  if (dteRoute) {
    return <DteProductShell locale={locale} personaId={personaId}>{children}</DteProductShell>;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
