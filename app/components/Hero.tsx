import Link from "next/link";

type HeroProps = {
  title: string;
  subtitle: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function Hero({
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: HeroProps) {
  return (
    <section className="border-b border-[var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.97),_rgba(250,245,238,0.99)_58%)]">
      <div className="container py-12 md:py-16">
        <div className="max-w-[56rem]">
          <div className="service-kicker">YORISOU</div>
          <h1 className="display-serif mt-5 max-w-[14em] text-[2rem] leading-[1.42] text-[var(--text)] md:text-[2.9rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-[44rem] text-sm leading-8 text-[var(--muted)] md:text-base">
            {subtitle}
          </p>
        </div>
        {(primaryHref || secondaryHref) && (
          <div className="mt-8 flex flex-wrap gap-3">
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
