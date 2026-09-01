"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CONSUMER_HOME } from "@/lib/consumerHome";

// PXR-1 — the consumer information architecture.
//
// This shell already existed; PXR-1 changes what it MEANS rather than adding a second navigation.
// `ホーム` became `今日` because the destination stopped being a description of Yorisou and became
// what is useful to this person now — the label had to move with the product model, not decorate it.
//
// CORP-v1.3.1 — the 今日 tab points at /today, not at "/".
//
// The apex cutover makes "/" the YORISOU company site. Left alone, the first tab of the consumer
// product's own tab bar — the one labelled 今日 — would have taken a person from inside the product
// to the corporate front page. Nothing would have 404ed; it would just have been the wrong site.
const TABS = [
  {
    href: CONSUMER_HOME,
    label: "今日",
    icon: (
      <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-7.5Z" />
    ),
  },
  {
    href: "/notice",
    label: "気づく",
    icon: (
      <path d="M5 13.5 9 9l3.5 3.5L19 6M15.5 6H19v3.5" />
    ),
  },
  {
    href: "/explore",
    label: "探す",
    icon: (
      <path d="M12 4.5 13.8 9.7 19 11.5 13.8 13.3 12 18.5 10.2 13.3 5 11.5 10.2 9.7 12 4.5Z" />
    ),
  },
  {
    href: "/connect",
    label: "つながる",
    icon: (
      <>
        <circle cx="8.5" cy="9" r="2.75" />
        <circle cx="15.5" cy="9" r="2.75" />
        <path d="M3.5 19c.8-2.4 2.6-3.6 5-3.6M15.5 15.4c2.4 0 4.2 1.2 5 3.6" />
      </>
    ),
  },
  {
    href: "/me",
    label: "わたし",
    icon: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5.5 19.5c1.1-3 3.6-4.5 6.5-4.5s5.4 1.5 6.5 4.5" />
      </>
    ),
  },
] as const;

function isActive(pathname: string, href: string) {
  const normalized = pathname.replace(/\/$/, "") || "/";
  // Exact match, so /today/check-in and /today/discovery do not light the 今日 tab. Previously this
  // read `href === "/"`; the tab's destination moved, so its active rule moved with it.
  if (href === CONSUMER_HOME) return normalized === CONSUMER_HOME;
  // 探す owns discovery, including the existing recommendation surfaces it absorbs.
  if (href === "/explore") {
    return normalized.startsWith("/explore") || normalized.startsWith("/recommendations");
  }
  // 気づく owns the depth ladder: the light interaction, the test library and the Deep Dive.
  if (href === "/notice") {
    return normalized.startsWith("/notice") ||
      normalized.startsWith("/today/check-in") ||
      normalized.startsWith("/tests");
  }
  // つながる owns the pair surfaces and nothing else.
  if (href === "/connect") return normalized.startsWith("/connect");
  // わたし absorbs the existing saved surface.
  if (href === "/me") return normalized.startsWith("/me") || normalized.startsWith("/saved");
  return normalized === href || normalized.startsWith(`${href}/`);
}

type Props = {
  /**
   * CPR-1 — whether つながる is part of the navigation for this deployment.
   *
   * Resolved on the server and passed in as a bounded boolean; the gate itself reads server-only
   * env, so it must never be evaluated here. A closed deployment renders the original four tabs
   * and the fifth destination does not exist in the DOM at all — this is not CSS hiding.
   */
  connectEnabled?: boolean;
};

export default function MobileBottomNav({ connectEnabled = false }: Props) {
  const pathname = usePathname() || "/";
  const tabs = connectEnabled ? TABS : TABS.filter((tab) => tab.href !== "/connect");

  return (
    <nav
      aria-label="モバイルナビゲーション"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--yorisou-color-neutral-100)] bg-[rgba(255,255,255,0.96)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="mx-auto grid max-w-[520px]"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-0.5 no-underline transition-colors duration-[var(--yorisou-motion-tap)] ${
                active ? "text-[var(--yorisou-color-primary-600)]" : "text-[var(--yorisou-color-neutral-500)]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                width={22}
                height={22}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {tab.icon}
              </svg>
              <span className="text-[10.5px] font-semibold leading-4">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
