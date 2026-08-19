"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import AppHeader from "./AppHeader";
import MobileBottomNav from "./MobileBottomNav";
import SiteFooter from "./SiteFooter";

type Props = {
  children: ReactNode;
  /** CPR-1 — server-resolved navigation gate for つながる. Never computed in the client. */
  connectEnabled?: boolean;
};

// Chrome is suppressed where a person is INSIDE something — a support conversation, a running
// assessment, a loading step. It is not suppressed on outcomes.
//
// PXR-1 removed "/result". The Result is where 理解 lands and where 保存 and 発見 are offered, so
// the locked model (Sense → Understand → Act → Save → Return → Discover) requires that a person can
// leave it by the product's own navigation. Without the shell, the only ways off the Result were
// the in-page links and the browser back button, which is why it read as a standalone microsite.
// PXR-1 added "/tests/ima-iro". The 120Q used to live at "/check-in", which was suppressed; moving
// the flow to its own canonical route silently gave a 120-question assessment a header, a footer and
// a bottom tab bar. A tab bar during a running assessment is an invitation to abandon it.
const SHELL_SUPPRESSED_EXACT = new Set([
  "/support",
  "/en/support",
  "/check-in",
  "/report-loading",
  "/report-preview",
  "/tests/ima-iro",
]);

const SHELL_SUPPRESSED_PREFIXES = ["/line", "/reports/self-understanding", "/prototype"];

function isSuppressedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (SHELL_SUPPRESSED_EXACT.has(pathname)) return true;
  return SHELL_SUPPRESSED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function AppShell({ children, connectEnabled = false }: Props) {
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
      <MobileBottomNav connectEnabled={connectEnabled} />
    </>
  );
}
