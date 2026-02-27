import Image from "next/image";
import Hero from "../../components/Hero";
import Section from "../../components/Section";
import CardGrid from "../../components/CardGrid";

export default function AboutPageEn() {
  return (
    <main>
      <Hero
        title="About Us"
        subtitle="YORISOU addresses mobility challenges in an aging society through pilot-based implementation, safety-focused operations, and regional collaboration."
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image src="/images/illustrations/about-scene.svg" alt="about illustration" width={1000} height={620} style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <Section label="Mission" title="Improve local mobility issues through practical implementation">
        <p className="muted">
          We prioritize field-verifiable approaches over desk-only planning. Safety, public value, and operational feasibility are assessed step by step for long-term implementation.
        </p>
      </Section>

      <Section label="Value" title="Core operating principles">
        <CardGrid>
          <article className="card"><h3>Compliance</h3><p className="muted">Relevant laws, local rules, and personal data protection are treated as baseline requirements.</p></article>
          <article className="card"><h3>Safety First</h3><p className="muted">Near-miss records and field logs are used for continuous preventive improvements.</p></article>
          <article className="card"><h3>Co-Creation</h3><p className="muted">Operational design is built with municipalities, institutions, and local partners.</p></article>
          <article className="card"><h3>Long-Term Perspective</h3><p className="muted">We focus on sustainable regional operation frameworks rather than one-off deployment.</p></article>
        </CardGrid>
      </Section>

      <Section label="Founder" title="Founder Message / Profile">
        <div className="card" style={{ display: "grid", gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>Founder Message</p>
          <p style={{ margin: 0 }}>
            Jin Yang brings global automotive management and industrial project leadership experience to local mobility challenges in Fukuoka.
            YORISOU focuses on evidence-based pilot programs and structural problem analysis rather than product sales.
          </p>
          <p style={{ margin: 0, fontWeight: 700 }}>Founder Profile</p>
          <p style={{ margin: 0 }}>Jin Yang | Founder and Representative</p>
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>20+ years of international management experience in the automotive industry</li>
            <li>Led global business and industrial projects at a major European automotive supplier</li>
            <li>Directed mass-production programs in automotive electronics and electrification through collaboration with major OEMs</li>
            <li>Integrated management of global supply-chain and industrialization projects</li>
          </ul>
        </div>
      </Section>
    </main>
  );
}
