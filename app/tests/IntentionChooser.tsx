"use client";

// AIX-2 — intention-oriented entry selection on the dark depth system. The
// visitor chooses a current intention (not a catalog card); the depth field
// re-forms around the choice and the matching entries disclose. Test
// eligibility and routes come from the existing PHASE1 catalog and are NOT
// modified here. Native <details> keeps it keyboard- and no-JS-accessible.

import { useMemo, useState } from "react";
import Link from "next/link";

import DepthFieldLazy from "../components/depth-field/DepthFieldLazy";
import { intentionDepthParams, intentionPalette, type EntryIntention } from "../components/depth-field/seed";

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
  pendingNote?: string;
};

export default function IntentionChooser({ groups }: { groups: IntentionGroup[] }) {
  const [selected, setSelected] = useState<EntryIntention | null>(null);
  const params = useMemo(() => intentionDepthParams(selected, 160), [selected]);
  const palette = intentionPalette();

  return (
    <div className="relative">
      <div className="depth-scene" aria-hidden="true">
        <DepthFieldLazy params={params} palette={palette} formation={selected ? 1 : 0.72} className="depth-layer" />
        <div className="depth-veil" />
      </div>

      <div className="relative z-[1]">
        {groups.map((group) => (
          <details
            key={group.intention}
            name="yorisou-intent"
            onToggle={(event) => {
              if ((event.target as HTMLDetailsElement).open) setSelected(group.intention);
              else if (selected === group.intention) setSelected(null);
            }}
          >
            <summary className="aix2-intent cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <p className="aix2-intent-title">{group.title}</p>
              <p className="aix2-intent-body">{group.body}</p>
              <span className="aix2-intent-cue">この気持ちから入る →</span>
            </summary>
            <div className="border-b border-[var(--hair)] bg-[rgba(10,19,16,0.55)] px-2 py-4 sm:px-4">
              {group.items.map((item) => (
                <div key={item.key} className="border-l-2 border-[var(--hair-2)] py-3 pl-4">
                  <p className="text-[15px] font-bold leading-7 text-[color:var(--tx)]">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-7 aix2-mut">{item.description}</p>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.06em] aix2-faint">{item.meta}</p>
                  {item.boundaryNote ? (
                    <p className="mt-1.5 text-[12px] leading-6 aix2-faint">{item.boundaryNote}</p>
                  ) : null}
                  <Link href={item.href} className="aix2-btn aix2-btn-primary mt-3 !min-h-[46px] !text-[14px]">
                    {item.ctaLabel}
                  </Link>
                </div>
              ))}
              {group.pendingNote ? (
                <p className="border-l-2 border-[var(--hair)] py-3 pl-4 text-[13px] leading-7 aix2-mut">
                  {group.pendingNote}{" "}
                  <Link href="/contact?topic=open-testing" className="aix2-link">関心を送る →</Link>
                </p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
