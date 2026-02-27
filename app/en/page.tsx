import Image from "next/image";
import Link from "next/link";
import CTA from "../components/CTA";
import CardGrid from "../components/CardGrid";
import NewsTeaser from "../components/NewsTeaser";
import Section from "../components/Section";

export default function HomePageEn() {
  return (
    <main>
      <section style={{ padding: "72px 0 40px", borderBottom: "1px solid var(--line)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.3, margin: 0 }}>
              Mobility for an Aging Society, Starting from Fukuoka.
            </h1>
            <p className="muted" style={{ marginTop: 16, fontSize: 16 }}>
              YORISOU builds practical local mobility models with municipalities and institutions through small-scale pilots,
              with priority on safety, compliance, and long-term operational sustainability.
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/en/contact" className="btn btn-primary">Contact</Link>
              <Link href="/en/pilot" className="btn btn-secondary">View Pilot Program</Link>
            </div>
          </div>
          <div className="card" style={{ padding: 10 }}>
            <Image
              src="/images/illustrations/hero-fukuoka.svg"
              alt="Fukuoka local mobility pilot illustration"
              width={1200}
              height={720}
              style={{ width: "100%", height: "auto", borderRadius: 10 }}
              priority
            />
          </div>
        </div>
      </section>

      <Section label="Problem" title="Practical mobility gaps remain in short-distance daily travel">
        <CardGrid>
          <article className="card"><Image src="/images/icons/problem-distance.svg" alt="distance" width={52} height={52} /><h3>Short-Distance Mobility Gap</h3><p className="muted">Walking is often difficult while existing public transit can be excessive for local short trips.</p></article>
          <article className="card"><Image src="/images/icons/problem-route.svg" alt="route" width={52} height={52} /><h3>Fragmented Daily Routes</h3><p className="muted">Continuous support is limited across shopping, public facilities, and neighborhood destinations.</p></article>
          <article className="card"><Image src="/images/icons/problem-care.svg" alt="care" width={52} height={52} /><h3>Care and Medical Access</h3><p className="muted">Travel burden for clinic visits creates operational pressure for users, families, and care staff.</p></article>
        </CardGrid>
      </Section>

      <Section label="Approach" title="Small-Scale, Safety-Oriented, and Verifiable">
        <CardGrid>
          <article className="card"><Image src="/images/icons/approach-small.svg" alt="small-scale" width={52} height={52} /><h3>Small-Scale</h3><p className="muted">Focused pilot areas enable careful consensus-building and operational control.</p></article>
          <article className="card"><Image src="/images/icons/approach-safe.svg" alt="safe" width={52} height={52} /><h3>Safety</h3><p className="muted">Rules, inspections, records, and training are standardized for preventive safety management.</p></article>
          <article className="card"><Image src="/images/icons/approach-verify.svg" alt="verifiable" width={52} height={52} /><h3>Verifiable</h3><p className="muted">Pilot outcomes are measured through data and field records to support next-phase decisions.</p></article>
        </CardGrid>
      </Section>

      <Section label="Services" title="Three support layers by implementation phase" lead="Details are available on the Services page.">
        <CardGrid>
          <article className="card"><h3>Planning Support</h3><p className="muted">Issue definition, route design, and evaluation metric setting.</p></article>
          <article className="card"><h3>Pilot Operation Support</h3><p className="muted">Operational procedure setup, field support, and stakeholder coordination.</p></article>
          <article className="card"><h3>Evaluation and Next-Phase Planning</h3><p className="muted">Reporting, improvement proposals, and expansion planning.</p></article>
        </CardGrid>
        <div style={{ marginTop: 16 }}><Link href="/en/services" className="btn btn-secondary">View Services</Link></div>
      </Section>

      <Section label="Pilot Flow" title="Pilot program flow (5 steps)">
        <div className="card">
          <ol className="list-clean" style={{ margin: 0, display: "grid", gap: 6 }}>
            <li>Consultation</li>
            <li>Design</li>
            <li>Execution</li>
            <li>Evaluation</li>
            <li>Report</li>
          </ol>
        </div>
      </Section>

      <Section label="Partners" title="Collaboration with local stakeholders">
        <CardGrid>
          <article className="card"><h3>Municipalities</h3><p className="muted">Policy alignment and public-interest coordination.</p></article>
          <article className="card"><h3>Care Facilities</h3><p className="muted">Mobility scenarios aligned with daily routines of users.</p></article>
          <article className="card"><h3>Medical Institutions</h3><p className="muted">Safer clinic access planning with time-slot coordination.</p></article>
          <article className="card"><h3>Regional Companies</h3><p className="muted">Operational support toward sustainable local implementation.</p></article>
        </CardGrid>
        <div style={{ marginTop: 16 }}><Link href="/en/partners" className="btn btn-secondary">View Partnerships</Link></div>
      </Section>

      <Section label="News" title="Latest updates">
        <NewsTeaser limit={3} locale="en" />
      </Section>

      <CTA
        title="Consultation for local pilot programs"
        description="We can start from an initial review of your local conditions and operational constraints."
        href="/en/contact"
        label="Go to Contact"
      />
    </main>
  );
}
