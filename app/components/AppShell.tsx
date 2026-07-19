"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type Props = {
  children: ReactNode;
};

// AIX-3D-1 (Part B) — /support + /en/support moved off the suppressed list so
// they render inside the shared branded editorial shell (SiteHeader/SiteFooter,
// BrandLockup, language toggle), consistent with the other trust routes. Their
// access-helper logic is preserved inside the editorial surface.
const SHELL_SUPPRESSED_EXACT = new Set([
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
