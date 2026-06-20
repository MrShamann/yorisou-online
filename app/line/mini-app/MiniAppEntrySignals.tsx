"use client";

import Link from "next/link";

type Props = {
  href: string;
  locale: "ja" | "en";
  label: string;
};

export default function MiniAppEntrySignals({ href, locale: _locale, label }: Props) {
  return (
    <Link
      href={href}
      className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(26,39,34,1)_0%,rgba(11,16,15,1)_100%)] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_16px_30px_rgba(5,10,9,0.28)] ring-1 ring-[rgba(157,184,170,0.18)]"
    >
      {label}
    </Link>
  );
}
