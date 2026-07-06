import type { ReactNode } from "react";
import Link from "next/link";
import MotionReveal from "./MotionReveal";

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
    <section className="frontstage-hero">
      <div className="container">
        <div className="frontstage-hero-inner md:grid-cols-[minmax(0,1fr)_18rem]">
          <MotionReveal className="frontstage-hero-copy" delay={40} distance={24}>
            <div className="service-kicker">{eyebrow}</div>
            <h1 className="display-serif frontstage-hero-title mt-3 max-w-[11.5em]">{title}</h1>
            <p className="frontstage-hero-lead">{subtitle}</p>
            {(primaryHref || secondaryHref) && (
              <div className="frontstage-hero-actions">
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
          </MotionReveal>
          <MotionReveal className="frontstage-note self-end" delay={140} distance={18}>
            <p>診断や評価を断定するためではなく、今の状態を見つめやすくするための入口として整えています。</p>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
