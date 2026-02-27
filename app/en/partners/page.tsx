import Image from "next/image";
import Hero from "../../components/Hero";
import Section from "../../components/Section";
import CardGrid from "../../components/CardGrid";

export default function PartnersPageEn() {
  return (
    <main>
      <Hero
        title="Partnerships"
        subtitle="YORISOU builds operation frameworks that balance public value and continuity through collaboration with local stakeholders."
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image src="/images/illustrations/partners-scene.svg" alt="partnership illustration" width={1000} height={620} style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <Section label="Partnership" title="Main Partner Types">
        <CardGrid>
          <article className="card"><h3>Municipalities</h3><p className="muted">Policy alignment, public-interest evaluation, and local coordination.</p></article>
          <article className="card"><h3>Care Facilities</h3><p className="muted">User route understanding, operation cooperation, and evaluation support.</p></article>
          <article className="card"><h3>Medical Institutions</h3><p className="muted">Clinic-access route planning, schedule coordination, and safety review.</p></article>
          <article className="card"><h3>Regional Companies</h3><p className="muted">Operation support, maintenance cooperation, and local implementation support.</p></article>
        </CardGrid>
      </Section>

      <Section label="Policy" title="Collaboration Policy">
        <div className="card">
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>Operations are designed with compliance and personal data protection as baseline requirements.</li>
            <li>Roles and responsibilities are clearly defined by agreement with stakeholders.</li>
            <li>Pilot findings are shared transparently and linked to practical improvements.</li>
            <li>Long-term regional value is prioritized over short-term outcomes.</li>
          </ul>
        </div>
      </Section>
    </main>
  );
}
