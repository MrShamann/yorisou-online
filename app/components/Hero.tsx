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
    <section className="border-b border-[var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_rgba(247,240,229,0.98)_60%)]">
      <div className="container py-16 md:py-20">
        <div className="max-w-4xl">
          <div className="service-kicker">YORISOU</div>
          <h1 className="display-serif mt-5 text-[2.4rem] leading-[1.22] text-[var(--text)] md:text-[3.6rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-[var(--muted)] md:text-base">
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
