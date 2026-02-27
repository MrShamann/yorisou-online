import Image from "next/image";
import Hero from "../../components/Hero";
import Section from "../../components/Section";
import CardGrid from "../../components/CardGrid";

export default function ServicesPageEn() {
  return (
    <main>
      <Hero
        title="Services"
        subtitle="We provide end-to-end support from initial assessment and pilot operation to evaluation reporting and next-phase planning."
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image src="/images/illustrations/services-scene.svg" alt="services illustration" width={1000} height={620} style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <Section label="Service 01" title="Assessment and Planning">
        <CardGrid>
          <article className="card"><h3>Issue Definition</h3><p className="muted">Mobility gaps are defined by target group, route, and time zone.</p></article>
          <article className="card"><h3>Stakeholder Coordination</h3><p className="muted">Roles and responsibilities are aligned among municipalities and local institutions.</p></article>
          <article className="card"><h3>Evaluation Design</h3><p className="muted">Metrics are defined for usage, safety, and operational load.</p></article>
        </CardGrid>
      </Section>

      <Section label="Service 02" title="Pilot Operation">
        <CardGrid>
          <article className="card"><h3>Operation Design</h3><p className="muted">Operation hours, routes, and usage rules are adapted to local conditions.</p></article>
          <article className="card"><h3>Safety Management</h3><p className="muted">Inspection, logging, and incident response flows are standardized.</p></article>
          <article className="card"><h3>Field Support</h3><p className="muted">We support local teams during launch and ongoing operations.</p></article>
        </CardGrid>
      </Section>

      <Section label="Service 03" title="Evaluation and Improvement">
        <CardGrid>
          <article className="card"><h3>Performance Review</h3><p className="muted">Usage volume, travel distance, satisfaction, and near-miss records are analyzed.</p></article>
          <article className="card"><h3>Improvement Proposal</h3><p className="muted">Priority-based recommendations are prepared for local decision making.</p></article>
          <article className="card"><h3>Next-Phase Plan</h3><p className="muted">Expansion scope, operation structure, and roadmap are proposed.</p></article>
        </CardGrid>
      </Section>
    </main>
  );
}
