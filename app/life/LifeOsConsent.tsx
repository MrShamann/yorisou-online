"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  LIFE_OS_CONSENT_ACCEPT,
  LIFE_OS_CONSENT_DECLINE,
  LIFE_OS_CONSENT_LINES,
} from "@/lib/life-os/consent";

// LCO-1 — the explanation, shown once, before anything durable is kept.
//
// TWO REAL CHOICES. 「今は使わない」 is not a smaller, greyer, apologetic version of the other
// button — it is a plain link out, and choosing it leaves the person exactly where they were with
// nothing recorded. No pre-ticked box, no "recommended", no countdown, no second ask on the way
// out. A consent screen that makes declining feel like an error is not collecting consent.
//
// It is a page section rather than a modal, on purpose: a dialog over a surface someone cannot read
// implies they are being interrupted, when in fact they have not started yet.

export default function LifeOsConsent() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/life/consent", { method: "POST" });
      if (!response.ok) {
        setError("いま保存できませんでした。時間をおいて試してみてください。");
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("通信できませんでした。時間をおいて試してみてください。");
      setPending(false);
    }
  }

  return (
    <section aria-labelledby="life-os-consent-heading">
      <h1
        id="life-os-consent-heading"
        className="text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]"
      >
        はじめる前に
      </h1>
      <ul className="mt-6 flex list-none flex-col gap-4 p-0">
        {LIFE_OS_CONSENT_LINES.map((line) => (
          <li
            key={line}
            className="text-[15px] leading-[1.95] text-[var(--pxr-text-secondary)]"
          >
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-9 flex flex-col gap-4">
        <button
          type="button"
          onClick={accept}
          disabled={pending}
          className="inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-full bg-[var(--yorisou-color-primary-600)] px-7 py-3 text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {pending ? "保存しています…" : LIFE_OS_CONSENT_ACCEPT}
        </button>
        <a
          href="/me"
          className="inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center text-[15px] font-medium text-[var(--pxr-text-secondary)]"
        >
          {LIFE_OS_CONSENT_DECLINE}
        </a>
      </div>

      {error ? (
        <p role="alert" className="mt-5 text-[14px] leading-[1.85] text-[var(--pxr-text-secondary)]">
          {error}
        </p>
      ) : null}
    </section>
  );
}
