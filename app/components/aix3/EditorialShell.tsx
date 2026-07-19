import Link from "next/link";
import type { ReactNode } from "react";

// AIX-3B — shared editorial surface for trust / information / legal routes.
// Calm branded-light; belongs to the same product via the shared BrandLockup
// header/footer (rendered by AppShell) + product type, spacing and nav. Not a
// full WebGL surface, by design (§14).

export function EditorialShell({
  eyebrow,
  title,
  lead,
  children,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <main className="aix3-editorial-page">
      <section className="aix3-editorial-hero">
        <div className="container">
          <div className="max-w-[46rem] py-14 md:py-20">
            <p className="aix3-ed-eyebrow">{eyebrow}</p>
            <h1 className="aix3-ed-title mt-4">{title}</h1>
            {lead ? <p className="aix3-ed-lead mt-5">{lead}</p> : null}
            {primary || secondary ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {primary ? (
                  <Link href={primary.href} className="btn btn-primary !min-h-[48px]">
                    {primary.label}
                  </Link>
                ) : null}
                {secondary ? (
                  <Link href={secondary.href} className="btn btn-secondary !min-h-[48px]">
                    {secondary.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <div className="container pb-20">
        <div className="max-w-[46rem]">{children}</div>
      </div>
    </main>
  );
}

// A consistent editorial section (heading + body grammar).
export function EditorialSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="aix3-ed-section">
      {title ? <h2 className="aix3-ed-h2">{title}</h2> : null}
      <div className="aix3-ed-body">{children}</div>
    </section>
  );
}
