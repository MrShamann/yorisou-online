import type { ReactNode } from "react";
import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle: ReactNode;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function Hero({
  eyebrow = "YORISOU",
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: HeroProps) {
  return (
    <section className="border-b border-[var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.97),_rgba(247,244,238,0.99)_60%)]">
      <div className="container py-11 md:py-13">
        <div className="max-w-[48rem]">
          <div className="service-kicker">{eyebrow}</div>
          <h1 className="display-serif mt-4 max-w-[15.4em] text-[1.62rem] leading-[1.68] text-[var(--text)] md:text-[2.04rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-[40rem] text-sm leading-8 text-[var(--muted)] md:text-[0.97rem]">
            {subtitle}
          </p>
        </div>
        {(primaryHref || secondaryHref) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {primaryHref && primaryLabel && (
              <Link href={primaryHref} className="btn btn-primary">
                {primaryLabel}
              </Link>
            )}
            {secondaryHref && secondaryLabel && (
              <Link href={secondaryHref} className="btn btn-secondary">
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
