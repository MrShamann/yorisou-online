"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

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
  "/result/share",
]);

const SHELL_SUPPRESSED_PREFIXES = ["/line", "/reports/self-understanding"];

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
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
