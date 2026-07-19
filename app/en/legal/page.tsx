import type { Metadata } from "next";
import Link from "next/link";

import { EditorialShell, EditorialSection } from "../../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "Legal (English) | Yorisou",
  description:
    "Yorisou's terms of use and privacy policy are maintained in Japanese as the authoritative versions. English summaries are provided for convenience.",
};

// AIX-3D-1 (Part D) — English legal index. The authoritative legal documents are
// in Japanese; this page routes English readers to them and to the English
// summaries, instead of silently dropping them onto a Japanese page.

export default function LegalPageEn() {
  return (
    <EditorialShell
      eyebrow="Legal"
      title="Terms and privacy."
      lead="Yorisou's terms of use and privacy policy are maintained in Japanese as the authoritative versions. English summaries are provided for convenience only."
    >
      <EditorialSection title="Documents">
        <ul className="space-y-2">
          <li>
            <Link href="/terms" className="underline">Terms of Use (Japanese, authoritative)</Link>
          </li>
          <li>
            <Link href="/privacy" className="underline">Privacy Policy (Japanese, authoritative)</Link>
          </li>
          <li>
            <Link href="/en/privacy" className="underline">Privacy — English summary</Link>
          </li>
        </ul>
      </EditorialSection>

      <EditorialSection title="Questions">
        <p>
          If anything is unclear, please <Link href="/en/contact" className="underline">contact us</Link>.
          Where an English summary and the Japanese document differ, the Japanese document governs.
        </p>
      </EditorialSection>
    </EditorialShell>
  );
}
