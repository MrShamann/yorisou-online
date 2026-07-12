"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import AppHeader from "./AppHeader";
import MobileBottomNav from "./MobileBottomNav";
import SiteFooter from "./SiteFooter";

type Props = {
  children: ReactNode;
};

const SHELL_SUPPRESSED_EXACT = new Set([
  "/support",
  "/en/support",
  "/check-in",
  "/report-loading",
  "/report-preview",
  "/result",
]);

const SHELL_SUPPRESSED_PREFIXES = ["/line", "/reports/self-understanding", "/prototype"];

function isSuppressedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (SHELL_SUPPRESSED_EXACT.has(pathname)) return true;
  return SHELL_SUPPRESSED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function AppShell({ children }: Props) {
  const pathname = usePathname();

  if (isSuppressedRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <AppHeader />
      <div className="pb-[74px] md:pb-0">
        {children}
        <SiteFooter />
      </div>
      <MobileBottomNav />
    </>
  );
}
