import type { Metadata } from "next";
import Link from "next/link";

import { EditorialShell, EditorialSection } from "../../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "Partners (English) | Yorisou",
  description:
    "For providers and makers who want to reach people by their current state, not by ads. Placement is never for sale. The full partner pathway is offered in Japanese.",
};

// AIX-3D-1 (Part D) — English Partners overview. Points to the real (Japanese)
// partner pathway and to contact. No pay-to-rank, no fabricated partners.

export default function PartnersPageEn() {
  return (
    <EditorialShell
      eyebrow="Partners"
      title="Reach people by their current state — not by ads."
      lead="Yorisou can connect providers and makers with people whose current state fits what they offer. Recommendations are explained, optional, and bounded. The full partner pathway is currently offered in Japanese."
      primary={{ href: "/en/contact", label: "Contact us" }}
      secondary={{ href: "/partners", label: "パートナー案内（日本語）" }}
    >
      <EditorialSection title="How it works">
        <p>
          When something you offer genuinely fits a person&apos;s current state, Yorisou can surface it
          as a small, explained next step. People always see why something is shown, and they can
          decline. It is a fit-based connection, not a feed of promotions.
        </p>
      </EditorialSection>

      <EditorialSection title="Placement is not for sale">
        <p>
          Ranking cannot be bought. Yorisou does not run public listings, checkout, or pre-sales, and
          it does not present paid placement as if it were a fit. This keeps recommendations
          trustworthy for the people who receive them.
        </p>
      </EditorialSection>

      <EditorialSection title="Getting in touch">
        <p>
          If you are a provider or maker and this sounds relevant, please{" "}
          <Link href="/en/contact" className="underline">contact us</Link> with a short description of
          what you offer and who it tends to help.
        </p>
      </EditorialSection>
    </EditorialShell>
  );
}
