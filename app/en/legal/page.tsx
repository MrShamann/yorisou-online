import Hero from "../../components/Hero";
import Section from "../../components/Section";

export default function LegalPageEn() {
  return (
    <main>
      <Hero
        title="Terms and Privacy"
        subtitle="This page describes the terms of use and personal information handling for this website."
      />

      <Section label="Terms" title="Terms of Use">
        <div className="card">
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
            <li>Website content may be changed or suspended without prior notice.</li>
            <li>We are not liable for damages arising from use of this website except in cases of willful misconduct or gross negligence.</li>
            <li>Copyrights of texts and images belong to YORISOU or their rightful owners.</li>
          </ul>
        </div>
      </Section>

      <Section label="Privacy" title="Privacy Policy">
        <div className="card">
          <ul className="list-clean" style={{ margin: 0, display: "grid", gap: 8 }}>
            <li>Collected information is used for inquiry handling and partnership consultation.</li>
            <li>We do not provide personal data to third parties without consent unless required by law.</li>
            <li>Personal data is stored and managed with appropriate security controls.</li>
          </ul>
        </div>
      </Section>

      <Section label="Disclaimer" title="Disclaimer">
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            Information on this website may include content from pilot planning stages. Final implementation decisions require confirmation based on laws, local conditions, and stakeholder agreements.
          </p>
        </div>
      </Section>
    </main>
  );
}
