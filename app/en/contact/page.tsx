import type { Metadata } from "next";

import ContactForm from "../../components/ContactForm";
import { EditorialShell, EditorialSection } from "../../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "Contact Yorisou (English) | Ask, try, and connect",
  description:
    "Contact Yorisou in English about the check experience, saving and accounts, privacy and data, or partnering. Your inquiry does not need to be fully defined.",
};

// AIX-3D-1 (Part D) — English Contact on the shared editorial surface. Stale
// Hero / raster logo removed; the ContactForm behaviour is preserved.

export default function ContactPageEn() {
  return (
    <EditorialShell
      eyebrow="Contact"
      title="A calm place to ask, try, and connect."
      lead="Your inquiry does not need to be fully defined. You can start by sharing what you would like to try, what you are considering, or a question about the check experience, saving and accounts, privacy, or partnering. Replies may take some time, and response times are not guaranteed."
    >
      <EditorialSection title="Contact form">
        <div className="aix3-ed-card">
          <ContactForm locale="en" trackingTopic="contact-en" />
        </div>
      </EditorialSection>
    </EditorialShell>
  );
}
