import ContactForm from "../../components/ContactForm";
import Hero from "../../components/Hero";
import Section from "../../components/Section";

export default function ContactPageEn() {
  return (
    <main>
      <Hero
        title="Contact"
        subtitle="We accept inquiries regarding pilot programs, local partnership, and document requests."
      />

      <Section label="Contact" title="Inquiry Form">
        <ContactForm locale="en" />
      </Section>
    </main>
  );
}
