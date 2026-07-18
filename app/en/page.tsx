import type { Metadata } from "next";
import Link from "next/link";

import { EditorialShell, EditorialSection } from "../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "Yorisou (English) | Understand where you are now",
  description:
    "Yorisou is a Japanese-first reflective service that helps you notice your current state, receive a public-safe result, and continue privately. This English section explains what Yorisou is and how to begin.",
};

// AIX-3D-1 (Part D) — English Option B. A consolidated, honest English surface:
// /en, /en/about, /en/contact, /en/privacy, /en/legal, /en/partners. The live
// experience is currently Japanese-first; this section explains the product and
// links into the real (Japanese) flow rather than presenting a stale parallel
// English product. Product / auth / LINE flows are unchanged.

const WHAT = [
  {
    title: "Reflection first, recommendations later",
    body: "Yorisou turns a short check into a current-state result. It gives language to what is already happening, rather than adding another loud answer.",
  },
  {
    title: "Public-safe, then private depth",
    body: "Your first result is written to be safe to view, save, or share. More personal interpretation stays in private spaces meant only for you.",
  },
  {
    title: "A small next step, not a marketplace",
    body: "Any recommendation is narrow, explained, and optional — reports, content, or gentle paths. It is not a catalog and never a hidden sales funnel.",
  },
];

export default function HomePageEn() {
  return (
    <EditorialShell
      eyebrow="Yorisou · English"
      title="A lighter way to understand where you are now."
      lead="Yorisou is a reflective service that helps you notice your current state, receive a public-safe result, and continue privately at your own pace. The live experience is currently offered in Japanese; this English section explains what Yorisou is and how to begin."
      primary={{ href: "/tests", label: "Start the check (Japanese)" }}
      secondary={{ href: "/en/about", label: "About Yorisou" }}
    >
      <EditorialSection title="What Yorisou is">
        <div className="grid gap-4">
          {WHAT.map((item) => (
            <div key={item.title} className="aix3-ed-card">
              <h3 className="text-[15px] font-semibold text-[#2f2a28]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-7 text-[#5f5750]">{item.body}</p>
            </div>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection title="What Yorisou is not">
        <p>
          Yorisou is not a medical, clinical, psychological, legal, financial, mobility, care, or
          government service. It is not fortune-telling, and it is not an AI that decides your life
          for you. When a situation calls for professional support, please reach out to an
          appropriate specialist or public service.
        </p>
      </EditorialSection>

      <EditorialSection title="English information">
        <p>
          These English pages are available while the product experience remains Japanese-first:
        </p>
        <ul className="mt-3 space-y-2">
          <li>
            <Link href="/en/about" className="underline">About Yorisou</Link> — what it is and why it exists
          </li>
          <li>
            <Link href="/en/partners" className="underline">Partners</Link> — for providers and makers
          </li>
          <li>
            <Link href="/en/contact" className="underline">Contact</Link> — questions in English are welcome
          </li>
          <li>
            <Link href="/en/privacy" className="underline">Privacy</Link> and{" "}
            <Link href="/en/legal" className="underline">Legal</Link> — how your information is handled
          </li>
        </ul>
      </EditorialSection>
    </EditorialShell>
  );
}
