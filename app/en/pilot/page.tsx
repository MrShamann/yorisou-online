import Image from "next/image";
import Link from "next/link";
import CTA from "../../components/CTA";
import CardGrid from "../../components/CardGrid";
import Hero from "../../components/Hero";
import Section from "../../components/Section";

export default function PilotPageEn() {
  return (
    <main>
      <Hero
        title="Pilot Program"
        subtitle="We provide a phased pilot program from objective setting to final reporting, coordinated with local stakeholders."
        primaryHref="/en/contact"
        primaryLabel="Start Consultation"
      />

      <section className="section" style={{ paddingTop: 22 }}>
        <div className="container">
          <div className="card" style={{ padding: 10 }}>
            <Image src="/images/illustrations/pilot-scene.svg" alt="pilot illustration" width={1000} height={620} style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>
      </section>

      <Section label="Purpose" title="Pilot Objective">
        <div className="card"><p className="muted" style={{ margin: 0 }}>The pilot verifies safety, social acceptance, and operational burden at the same time, and prepares evidence for next-phase decisions.</p></div>
      </Section>

      <Section label="Pilot Menus" title="Pilot Menus (3 Scenarios)" lead="Menus are designed by local mobility scenario, not by specific vehicle model name.">
        <CardGrid>
          <article className="card"><h3>Daily Living Route Scenario</h3><p className="muted">Supports short-distance travel between residential areas, shops, and public facilities.</p></article>
          <article className="card"><h3>Medical Access Scenario</h3><p className="muted">Designs operation windows for better access to clinics and pharmacies.</p></article>
          <article className="card"><h3>Care Facility Collaboration Scenario</h3><p className="muted">Verifies both outing support and operator workload optimization for care facilities.</p></article>
        </CardGrid>
      </Section>

      <Section label="Process" title="Pilot Process (6 Steps)">
        <div className="card">
          <ol className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
            <li>Initial Consultation and Issue Definition</li>
            <li>Target Area and Route Design</li>
            <li>Operation Procedure and Safety Planning</li>
            <li>Field Execution and Operation Management</li>
            <li>Mid-Term Evaluation and Adjustment</li>
            <li>Final Evaluation and Next-Phase Planning</li>
          </ol>
        </div>
      </Section>

      <Section label="Data" title="Data to Collect">
        <CardGrid>
          <article className="card"><h3>Utilization</h3><p className="muted">Trip count, usage by time zone, repeat usage rate</p></article>
          <article className="card"><h3>Distance and Time</h3><p className="muted">Travel distance, route trends, average travel time</p></article>
          <article className="card"><h3>User Feedback</h3><p className="muted">Satisfaction, perceived safety, improvement requests</p></article>
          <article className="card"><h3>Safety Indicators</h3><p className="muted">Near-miss count, proximity events, corrective actions</p></article>
          <article className="card"><h3>Operational Burden</h3><p className="muted">Staff effort, inquiry volume, maintenance frequency</p></article>
        </CardGrid>
      </Section>

      <Section label="Deliverables" title="Deliverables">
        <CardGrid>
          <article className="card"><h3>Pilot Report</h3><p className="muted">Integrated report of quantitative and qualitative outcomes</p></article>
          <article className="card"><h3>Improvement Proposals</h3><p className="muted">Issue-based recommendations with priority levels</p></article>
          <article className="card"><h3>Next-Phase Plan</h3><p className="muted">Conditions for expansion, operation model, and roadmap</p></article>
        </CardGrid>
      </Section>

      <Section label="FAQ" title="Frequently Asked Questions">
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
          <article className="card"><h3>Q. What is the typical pilot duration?</h3><p className="muted">A. In most cases, we run a small-scale pilot for approximately 1 to 3 months.</p></article>
          <article className="card"><h3>Q. What preparation is required before launch?</h3><p className="muted">A. We conduct stakeholder hearings, route checks, and agreement on operation and safety rules.</p></article>
          <article className="card"><h3>Q. Do you support post-pilot continuation planning?</h3><p className="muted">A. Yes. We prepare next-phase plans based on evaluation outcomes and local conditions.</p></article>
        </div>
        <div style={{ marginTop: 16 }}><Link href="/en/contact" className="btn btn-primary">Contact</Link></div>
      </Section>

      <CTA
        title="Pilot design tailored to local conditions"
        description="Please share your region, constraints, and key mobility issues to begin."
        href="/en/contact"
        label="Contact Us"
      />
    </main>
  );
}
