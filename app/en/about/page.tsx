import type { Metadata } from "next";

import { EditorialShell, EditorialSection } from "../../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "About Yorisou (English) | Life-state understanding, gently",
  description:
    "How Yorisou helps people reflect on their current life state, receive a public-safe result, continue privately, and consider a gentle next step. The live experience is Japanese-first.",
};

// AIX-3D-1 (Part D) — English About on the shared editorial surface. Substance
// preserved; stale Hero / shell-card / raster logo removed. Start points into
// the real (Japanese) understand entry.

export default function AboutPageEn() {
  return (
    <EditorialShell
      eyebrow="About Yorisou"
      title="Notice your current state before choosing your next step."
      lead="Yorisou is a reflective service that turns a short check into a public-safe result, private hints, and carefully bounded next steps. The live experience is currently offered in Japanese."
      primary={{ href: "/tests", label: "Start the check (Japanese)" }}
    >
      <EditorialSection title="A life-state understanding service">
        <p>
          Yorisou helps people look at the patterns that are easy to miss in daily life: how they
          make decisions, recover energy, relate to others, and respond to small pressures. It
          starts with a check and uses structured interpretation to turn those answers into a
          current-state result.
        </p>
      </EditorialSection>

      <EditorialSection title="Not to define you — to make reflection easier">
        <p>
          People often do not need a louder answer. They need a clearer way to look at what is
          already happening. Yorisou gives language to your current state, keeps public and private
          content separate, and helps you consider a next step without pressure.
        </p>
      </EditorialSection>

      <EditorialSection title="Public result, private depth">
        <p>
          After the check, Yorisou first shows a public-safe result: a short summary, a recognition
          line, and a few safe traits. From there, the experience can continue into private hints,
          report previews, and limited, explained recommendations. The deeper parts are meant for
          you, not for public sharing.
        </p>
      </EditorialSection>

      <EditorialSection title="Clear boundaries">
        <p>
          Yorisou is not a medical or psychological diagnosis, therapy, fortune-telling, professional
          advice, a chatbot replacement for human care, or a public-service provider. It does not
          provide direct professional care, government support operations, marketplace checkout, or
          real-world service dispatch. When a situation requires professional support, Yorisou should
          not be treated as a substitute.
        </p>
      </EditorialSection>
    </EditorialShell>
  );
}
