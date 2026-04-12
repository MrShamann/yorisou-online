"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { CheckInTrafficSource } from "@/lib/checkInAttribution";

type HomepageTrackEventName = "homepage_checkin_cta_clicked" | "homepage_support_cta_clicked";

type TrackableHomepageLinkProps = {
  href: string;
  eventName: HomepageTrackEventName;
  source: CheckInTrafficSource;
  className?: string;
  children: ReactNode;
};

function postHomepageTrack(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  const blob = new Blob([body], { type: "application/json" });

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon("/api/check-in/track", blob);
    return;
  }

  void fetch("/api/check-in/track", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
    keepalive: true,
  });
}

export default function TrackableHomepageLink({
  href,
  eventName,
  source,
  className,
  children,
}: TrackableHomepageLinkProps) {
  const handleClick = () => {
    postHomepageTrack({
      event: eventName,
      source,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
