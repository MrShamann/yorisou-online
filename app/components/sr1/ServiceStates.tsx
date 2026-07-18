// SR-1 — governed service states (presentational, public-safe).
//
// Calm, plain-language panels for the recovery / empty / recovery-block moments
// of the stranger-ready service journey. They NEVER speak in technical or
// stack-trace language, never blame the person, and always offer a safe next
// action and a return path as real <Link>s (§11, §12). These are PURE
// presentational components — no hooks, no client state, no side effects — so
// they render identically on the server and compose into any governed surface.
//
// They assume an `.aix2` dark-surface ancestor (the shared design system),
// matching the existing reveal / domain components.

import Link from "next/link";
import type { JSX } from "react";

type ServiceEmptyStateProps = {
  eyebrow?: string;
  title: string;
  body: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
};

type ServiceRecoveryBlockProps = {
  eyebrow?: string;
  title: string;
  body: string;
  actions: { href: string; label: string; primary?: boolean }[];
};

// A quiet, unblamed empty state: nothing is here yet, and here is a calm way
// forward. Both actions are optional; when present they read as invitations,
// never demands.
export function ServiceEmptyState({ eyebrow, title, body, primary, secondary }: ServiceEmptyStateProps): JSX.Element {
  const hasActions = Boolean(primary || secondary);
  return (
    <section className="aix2-panel mx-auto max-w-[34rem] space-y-4 p-6 text-center sm:p-8">
      {eyebrow ? <p className="aix2-eyebrow">{eyebrow}</p> : null}
      <h2 className="aix2-serif text-[19px] leading-8 text-[color:var(--tx)]">{title}</h2>
      <p className="mx-auto max-w-[30rem] text-[13.5px] leading-7 aix2-mut">{body}</p>
      {hasActions ? (
        <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row">
          {primary ? (
            <Link href={primary.href} className="aix2-btn aix2-btn-primary w-full sm:w-auto">
              {primary.label}
            </Link>
          ) : null}
          {secondary ? (
            <Link href={secondary.href} className="aix2-btn aix2-btn-ghost w-full sm:w-auto">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

// A recovery block for 401 / failed / empty-that-should-not-be-empty moments.
// It reassures in plain language and ALWAYS renders at least one safe next
// action (the caller is responsible for including a return path among them).
export function ServiceRecoveryBlock({ eyebrow, title, body, actions }: ServiceRecoveryBlockProps): JSX.Element {
  return (
    <section className="aix2-panel mx-auto max-w-[34rem] space-y-4 p-6 sm:p-8">
      <p className="aix2-eyebrow">{eyebrow ?? "つづけられます"}</p>
      <h2 className="aix2-serif text-[19px] leading-8 text-[color:var(--tx)]">{title}</h2>
      <p className="text-[13.5px] leading-7 aix2-mut">{body}</p>
      {actions.length > 0 ? (
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
          {actions.map((action) => (
            <Link
              key={`${action.href}:${action.label}`}
              href={action.href}
              className={`aix2-btn ${action.primary ? "aix2-btn-primary" : "aix2-btn-ghost"} w-full sm:w-auto`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
