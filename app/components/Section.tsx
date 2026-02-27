import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  label?: string;
  title: string;
  lead?: string;
  children: ReactNode;
};

export default function Section({ id, label, title, lead, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="section-header">
          {label && <p className="section-label">{label}</p>}
          <h2 className="section-title">{title}</h2>
          {lead && (
            <p className="muted" style={{ marginTop: 10, maxWidth: 760 }}>
              {lead}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
