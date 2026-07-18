import Link from "next/link";
import type { ReactNode } from "react";

// AIX-4 — the retained per-test flows now render in the dark Product-Focus mode
// (`.yr-focus`), unmistakably the same product as the immersive catalogue, quieter
// for concentration. All surfaces are token-driven (var(--yr-*)) so the shared
// recommendation/conversion components embedded in results render dark here and
// light on the LINE mini-app from one code path. Flow logic/scoring lives in the
// flow components and is never touched here.

export function UnderstandShell({ children }: { children: ReactNode }) {
  return (
    <main className="yr-focus">
      <section className="relative z-[1]">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-[44rem]">{children}</div>
        </div>
      </section>
    </main>
  );
}

export function UnderstandPills({ items }: { items: ReadonlyArray<ReactNode> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex rounded-full border border-[var(--yr-hair-2)] bg-[var(--yr-panel-2)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--yr-text-mut)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function UnderstandKicker({ children }: { children: ReactNode }) {
  return <p className="yr-kicker">{children}</p>;
}

export function UnderstandTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={`aix2-serif whitespace-pre-line text-[2rem] font-semibold leading-[1.22] text-[color:var(--yr-text)] md:text-[2.7rem] ${className ?? ""}`}
    >
      {children}
    </h1>
  );
}

export function UnderstandLead({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-8 text-[color:var(--yr-text-mut)]">{children}</p>;
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
    <div className="yr-panel p-3.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.13em] text-[color:var(--yr-text-faint)]">{kicker}</div>
          <div className="mt-0.5 text-[14px] font-bold text-[color:var(--yr-text)]">{indexLabel}</div>
        </div>
        {aside ? (
          <div className="rounded-full bg-[var(--yr-accent-soft)] px-3 py-1 text-[12px] font-semibold text-[color:var(--yr-accent-text)]">
            {aside}
          </div>
        ) : null}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--yr-panel-2)]">
        <div
          className="h-full rounded-full bg-[var(--yr-accent)] transition-[width] duration-500"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

// A labelled token-driven info panel (traits, friction, teasers, boundary notes).
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
      ? "rounded-[18px] border border-[var(--yr-hair-2)] bg-[var(--yr-accent-soft)]"
      : tone === "quiet"
        ? "rounded-[18px] border border-[var(--yr-hair)] bg-[var(--yr-panel-soft)]"
        : "rounded-[18px] border border-[var(--yr-hair)] bg-[var(--yr-panel)]";
  return (
    <div className={`${base} px-5 py-4`}>
      {label ? <p className="text-[12px] font-semibold tracking-[0.1em] text-[color:var(--yr-accent-text)]">{label}</p> : null}
      <div className={`${label ? "mt-1 " : ""}text-[13px] leading-7 text-[color:var(--yr-text-mut)]`}>{children}</div>
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
      <Link href="/tests" className="yr-btn yr-btn-ghost !min-h-[46px] !text-[13px]">
        {backLabel}
      </Link>
      {routes.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-[14px] border border-[var(--yr-hair)] bg-[var(--yr-panel-2)] px-4 py-3 text-[13px] font-semibold text-[color:var(--yr-accent-text)] transition hover:-translate-y-0.5 hover:border-[var(--yr-hair-2)]"
            >
              {route.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
