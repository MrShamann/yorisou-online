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
        <div
          style={{
            padding: 24,
            borderRadius: 14,
            border: "1px solid var(--line)",
            background: "var(--accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 24 }}>{title}</h3>
            <p className="muted" style={{ margin: "8px 0 0" }}>
              {description}
            </p>
          </div>
          <Link href={href} className="btn btn-primary">
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
