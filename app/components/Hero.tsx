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
    <section style={{ padding: "72px 0 56px", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <h1 style={{ fontSize: "clamp(30px, 5vw, 50px)", lineHeight: 1.3, margin: 0 }}>{title}</h1>
        <p className="muted" style={{ marginTop: 16, maxWidth: 760, fontSize: 16 }}>
          {subtitle}
        </p>
        {(primaryHref || secondaryHref) && (
          <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
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
