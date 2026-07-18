import Link from "next/link";
import type { ReactNode } from "react";

import DepthFieldStatic from "../depth-field/DepthFieldStatic";
import DepthFieldLazy from "../depth-field/DepthFieldLazy";
import { intentionDepthParams, intentionPalette, type EntryIntention } from "../depth-field/seed";
import AixIn from "../aix2/AixIn";

// AIX-3C — shared immersive domain surface. One reusable dark "Living
// Intelligence" domain page (hero + optional WebGL depth + sections) so the
// product domains do not each hand-roll a layout. Server component.

export type DomainStatus = "current" | "testing" | "prototype" | "planned";
export const DOMAIN_STATUS_LABEL: Record<DomainStatus, string> = {
  current: "いま使える",
  testing: "試験中",
  prototype: "プロトタイプ",
  planned: "設計中",
};

export function DomainHero({
  eyebrow,
  status,
  title,
  lead,
  primary,
  secondary,
  seed = null,
  depth = true,
}: {
  eyebrow: string;
  status?: DomainStatus;
  title: ReactNode;
  lead?: ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  seed?: EntryIntention | null;
  depth?: boolean;
}) {
  const params = intentionDepthParams(seed, 220);
  const palette = intentionPalette();
  return (
    <section className="relative overflow-hidden">
      {depth ? (
        <div className="depth-scene" aria-hidden="true">
          <DepthFieldStatic params={params} palette={palette} formation={0.82} className="depth-layer" />
          <DepthFieldLazy params={params} palette={palette} formation={1} className="depth-layer" />
          <div className="depth-veil" />
        </div>
      ) : null}
      <div className="container relative z-[1]">
        <div className="aix2-in max-w-[48rem] py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <p className="aix2-eyebrow aix2-rise">{eyebrow}</p>
            {status ? <span className={`aix3-status aix3-status--${status} aix2-rise`}>{DOMAIN_STATUS_LABEL[status]}</span> : null}
          </div>
          <h1 className="aix2-hero-title mt-4 aix2-rise" style={{ ["--d" as string]: "120ms" }}>
            {title}
          </h1>
          {lead ? (
            <p className="aix2-lead mt-6 aix2-rise" style={{ ["--d" as string]: "220ms" }}>
              {lead}
            </p>
          ) : null}
          {primary || secondary ? (
            <div className="mt-8 flex flex-wrap gap-3 aix2-rise" style={{ ["--d" as string]: "320ms" }}>
              {primary ? <Link href={primary.href} className="aix2-btn aix2-btn-primary">{primary.label}</Link> : null}
              {secondary ? <Link href={secondary.href} className="aix2-btn aix2-btn-ghost">{secondary.label}</Link> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function DomainSection({
  eyebrow,
  title,
  children,
  tint = false,
  tight = false,
}: {
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  tint?: boolean;
  tight?: boolean;
}) {
  return (
    <AixIn as="section" className={`aix2-band ${tight ? "aix2-band--tight" : ""} ${tint ? "aix2-band--tint" : ""}`}>
      <div className="container">
        {eyebrow ? <p className="aix2-eyebrow aix2-rise">{eyebrow}</p> : null}
        {title ? <h2 className="aix2-band-title mt-3 aix2-rise" style={{ ["--d" as string]: "90ms" }}>{title}</h2> : null}
        <div className={eyebrow || title ? "mt-7" : ""}>{children}</div>
      </div>
    </AixIn>
  );
}

// A reusable empty / boundary state card.
export function DomainNote({ children }: { children: ReactNode }) {
  return <div className="aix2-panel p-5 text-[13.5px] leading-7 aix2-mut">{children}</div>;
}
