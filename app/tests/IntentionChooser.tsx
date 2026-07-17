"use client";

// AIX-1 — intention-oriented entry selection. The visitor chooses a current
// intention (not a catalog card); the State Field quietly re-forms around the
// choice and the matching entries are disclosed. Test eligibility and routes
// come from the existing PHASE1 catalog and are NOT modified here.
//
// Progressive enhancement: native <details name="intent"> gives a keyboard-
// accessible exclusive accordion that works with JavaScript disabled; the
// field reaction is the only JS-dependent layer.

import { useMemo, useState } from "react";
import Link from "next/link";

import StateFieldCanvasLazy from "../components/state-field/StateFieldCanvasLazy";
import { intentionParams, type EntryIntention } from "../components/state-field/seed";

export type EntryItem = {
  key: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  ctaLabel: string;
  boundaryNote?: string;
};

export type IntentionGroup = {
  intention: EntryIntention;
  title: string;
  body: string;
  items: EntryItem[];
  /** honest note when a lane is still growing */
  pendingNote?: string;
};

export default function IntentionChooser({ groups }: { groups: IntentionGroup[] }) {
  const [selected, setSelected] = useState<EntryIntention | null>(null);
  const fieldParams = useMemo(() => intentionParams(selected, 64), [selected]);

  return (
    <div className="relative">
      <div className="state-field-scene" aria-hidden="true">
        <StateFieldCanvasLazy params={fieldParams} formation={selected ? 1 : 0.7} className="state-field-layer" />
        <div className="state-field-veil" />
      </div>

      <div className="relative z-[1]">
        {groups.map((group) => (
          <details
            key={group.intention}
            name="yorisou-intent"
            onToggle={(event) => {
              if ((event.target as HTMLDetailsElement).open) {
                setSelected(group.intention);
              } else if (selected === group.intention) {
                setSelected(null);
              }
            }}
          >
            <summary className="aix-intent cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <p className="aix-intent-title">{group.title}</p>
              <p className="aix-intent-body">{group.body}</p>
              <span className="aix-intent-meta">
                <span>この気持ちから入る →</span>
              </span>
            </summary>
            <div className="border-b border-[rgba(23,59,53,0.1)] bg-[rgba(255,253,248,0.66)] px-2 py-4 sm:px-4">
              {group.items.map((item) => (
                <div key={item.key} className="border-l-2 border-[rgba(105,151,130,0.4)] py-3 pl-4">
                  <p className="text-[15px] font-bold leading-7 text-[#173B35]">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">{item.description}</p>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.06em] text-[#8A8078]">{item.meta}</p>
                  {item.boundaryNote ? (
                    <p className="mt-1.5 text-[12px] leading-6 text-[#8A7E78]">{item.boundaryNote}</p>
                  ) : null}
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#173B35] bg-[#173B35] px-5 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0F2F2B]"
                  >
                    {item.ctaLabel}
                  </Link>
                </div>
              ))}
              {group.pendingNote ? (
                <p className="border-l-2 border-[rgba(23,59,53,0.14)] py-3 pl-4 text-[13px] leading-7 text-[#7A7068]">
                  {group.pendingNote}{" "}
                  <Link href="/contact?topic=open-testing" className="font-semibold text-[#315F50] hover:underline">
                    関心を送る →
                  </Link>
                </p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
