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
        <div className="rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.72)] px-6 py-6 md:flex md:items-end md:justify-between md:px-8 md:py-7">
          <div className="max-w-[38rem]">
            <div className="service-kicker">ご相談</div>
            <h3 className="display-serif mt-4 max-w-[15em] text-[1.55rem] leading-[1.6] text-[var(--text)] md:text-[1.9rem]">{title}</h3>
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
