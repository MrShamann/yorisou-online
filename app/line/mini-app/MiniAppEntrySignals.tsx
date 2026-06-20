"use client";

import Link from "next/link";
import { useEffect } from "react";

import { trackDteEvent } from "@/app/components/DteEventTracker";

type Props = {
  href: string;
  locale: "ja" | "en";
  label: string;
};

export default function MiniAppEntrySignals({ href, locale, label }: Props) {
  useEffect(() => {
    void trackDteEvent({
      event: "mini_app_landing_rendered",
      locale,
      source: "line_mini_app",
      surface: "line_mini_app",
      action: "view",
      branchId: "yorisou_dte",
      sourceBranchId: "yorisou_dte",
      visibilityPolicy: "public",
      crossBranchAccessPolicy: "explicit_bridge",
    });
  }, [locale]);

  return (
    <Link
      href={href}
      onClick={() => {
        void trackDteEvent({
          event: "start_button_tapped",
          locale,
          source: "line_mini_app",
          surface: "line_mini_app",
          action: "start",
          branchId: "yorisou_dte",
          sourceBranchId: "yorisou_dte",
          visibilityPolicy: "public",
          crossBranchAccessPolicy: "explicit_bridge",
        });
      }}
      className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(26,39,34,1)_0%,rgba(11,16,15,1)_100%)] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_16px_30px_rgba(5,10,9,0.28)] ring-1 ring-[rgba(157,184,170,0.18)]"
    >
      {label}
    </Link>
  );
}
