import Link from "next/link";
import type { ReactNode } from "react";

// AIX-3D-2 — shared Understand-domain grammar for the retained per-test flows
// under /tests/*. One calm branded-LIGHT surface, framed by the shared
// SiteHeader/SiteFooter (BrandLockup, product nav). Light by design: these flows
// embed the shared, hardcoded-light recommendation/conversion components
// (YorisouCompanionCard / RecommendationSlot / ResultConversionCommunity) that
// also render on the light LINE mini-app, so the whole test-flow surface reads
// as one coherent light product grammar — not a disconnected catalogue of
// quizzes, and not a stale test-only palette. Flow logic/scoring lives in the
// flow components and is never touched here.

export function UnderstandShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-[#FBFAF6] text-[#2F2A28]">
      <div className="container py-9 md:py-14">
        <div className="mx-auto max-w-[44rem]">{children}</div>
      </div>
    </main>
  );
}

export function UnderstandPills({ items }: { items: ReadonlyArray<ReactNode> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex rounded-full border border-[rgba(23,59,53,0.14)] bg-white/80 px-3 py-1.5 text-[12px] font-semibold text-[#5F5750]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function UnderstandKicker({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold tracking-[0.14em] text-[#49615B]">{children}</p>;
}

export function UnderstandTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={`display-serif whitespace-pre-line text-[2rem] leading-[1.22] text-[#2F2A28] md:text-[2.6rem] ${className ?? ""}`}
    >
      {children}
    </h1>
  );
}

export function UnderstandLead({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-8 text-[#5F5750]">{children}</p>;
}

// Question progress header: section/kicker + Q index + progress bar.
export function UnderstandProgress({
  kicker,
  indexLabel,
  percent,
  aside,
}: {
  kicker: ReactNode;
  indexLabel: ReactNode;
  percent: number;
  aside?: ReactNode;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[rgba(23,59,53,0.11)] bg-white/90 p-3.5 shadow-[0_14px_30px_rgba(23,59,53,0.07)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.13em] text-[#6F625C]">{kicker}</div>
          <div className="mt-0.5 text-[14px] font-bold text-[#2F2A28]">{indexLabel}</div>
        </div>
        {aside ? (
          <div className="rounded-full bg-[#EAF7F1] px-3 py-1 text-[12px] font-semibold text-[#315F50]">{aside}</div>
        ) : null}
      </div>
      <div className="mt-3 h-2 rounded-full bg-[rgba(23,59,53,0.1)]">
        <div
          className="h-full rounded-full bg-[#173B35] transition-[width] duration-500"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

// A labelled light info panel (traits, friction, teasers, boundary notes).
export function UnderstandNote({
  label,
  children,
  tone = "default",
}: {
  label?: ReactNode;
  children: ReactNode;
  tone?: "default" | "quiet" | "accent";
}) {
  const base =
    tone === "accent"
      ? "rounded-[1.2rem] border border-[rgba(138,119,100,0.16)] bg-[#FFFDF8]"
      : tone === "quiet"
        ? "rounded-[1.2rem] border border-[rgba(23,59,53,0.08)] bg-white/70"
        : "rounded-[1.25rem] border border-[rgba(23,59,53,0.1)] bg-white/90";
  const labelColor = tone === "accent" ? "text-[#6B5E55]" : "text-[#49615B]";
  const bodyColor = tone === "accent" ? "text-[#6B5E55]" : "text-[#5F5750]";
  return (
    <div className={`${base} px-5 py-4`}>
      {label ? <p className={`text-[12px] font-semibold tracking-[0.1em] ${labelColor}`}>{label}</p> : null}
      <div className={`${label ? "mt-1 " : ""}text-[13px] leading-7 ${bodyColor}`}>{children}</div>
    </div>
  );
}

// Related routes + a consistent "back to /tests" return.
export function UnderstandRelated({
  routes,
  backLabel = "入口一覧に戻る",
}: {
  routes: ReadonlyArray<{ href: string; label: string }>;
  backLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <Link
        href="/tests"
        className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
      >
        {backLabel}
      </Link>
      {routes.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-white/88 px-4 py-3 text-[13px] font-semibold text-[#315F50] transition hover:-translate-y-0.5"
            >
              {route.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
