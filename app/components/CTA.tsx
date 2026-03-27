import Link from "next/link";

type CTAProps = {
  title: string;
  description: string;
  href: string;
  label: string;
};

export default function CTA({ title, description, href, label }: CTAProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-7 shadow-[0_14px_30px_rgba(47,35,33,0.04)] md:flex md:items-end md:justify-between md:px-8 md:py-8">
          <div className="max-w-[38rem]">
            <div className="service-kicker">YORISOU</div>
            <h3 className="display-serif mt-4 max-w-[14em] text-[1.9rem] leading-[1.4] text-[var(--text)] md:text-[2.15rem]">{title}</h3>
            <p className="mt-3 text-sm leading-8 text-[var(--muted)] md:text-base">{description}</p>
          </div>
          <Link href={href} className="btn btn-primary mt-6 md:mt-0">
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
