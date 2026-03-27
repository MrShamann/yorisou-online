import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
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
    <section className="border-b border-[var(--line)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.97),_rgba(250,245,238,0.99)_58%)]">
      <div className="container py-12 md:py-14">
        <div className="max-w-[52rem]">
          <div className="service-kicker">{eyebrow}</div>
          <h1 className="display-serif mt-5 max-w-[15em] text-[1.95rem] leading-[1.6] text-[var(--text)] md:text-[2.5rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-[44rem] text-sm leading-8 text-[var(--muted)] md:text-base">
            {subtitle}
          </p>
        </div>
        {(primaryHref || secondaryHref) && (
          <div className="mt-7 flex flex-wrap gap-3">
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
