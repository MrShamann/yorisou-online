"use client";

import Link from "next/link";

type Props = {
  href: string;
  locale: "ja" | "en";
  label: string;
};

export default function MiniAppEntrySignals({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_28px_rgba(23,59,53,0.22)] transition hover:bg-[#0F2F2B]"
    >
      {label}
    </Link>
  );
}
