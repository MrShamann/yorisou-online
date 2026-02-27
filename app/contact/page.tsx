import ContactForm from "../components/ContactForm";
import Hero from "../components/Hero";
import Section from "../components/Section";

export default function ContactPage() {
  return (
    <main>
      <Hero
        title="お問い合わせ"
        subtitle="実証実験、連携、資料請求などのご相談を受け付けています。内容確認後、担当よりご連絡します。"
      />

      <Section label="Contact" title="ご相談フォーム">
        <ContactForm />
      </Section>
    </main>
  );
}
