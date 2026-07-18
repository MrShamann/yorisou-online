import type { Metadata } from "next";
import Link from "next/link";

import { EditorialShell, EditorialSection } from "../../components/aix3/EditorialShell";

export const metadata: Metadata = {
  title: "Privacy (English summary) | Yorisou",
  description:
    "An English summary of how Yorisou handles your information: no login required to take a check, device-local storage in your browser, and a clear split between public-safe and private content. The Japanese policy is authoritative.",
};

// AIX-3D-1 (Part D) — English privacy summary. This is an explanatory summary
// for English readers; the authoritative policy is the Japanese privacy policy.
// It must not diverge from that policy in substance.

export default function PrivacyPageEn() {
  return (
    <EditorialShell
      eyebrow="Privacy"
      title="How your information is handled."
      lead="This is an English summary for convenience. The authoritative version is the Japanese privacy policy."
      secondary={{ href: "/privacy", label: "日本語の完全なポリシー" }}
    >
      <EditorialSection title="No login to take a check">
        <p>
          You can take a check and see a result without creating an account or logging in. Saving,
          returning, and account features are optional and asked for separately.
        </p>
      </EditorialSection>

      <EditorialSection title="Stored on your device">
        <p>
          When you save a result, it is kept locally in your browser on the device you used. Clearing
          your browser storage removes it. It is not tied to a personal profile unless you choose to
          use an account.
        </p>
      </EditorialSection>

      <EditorialSection title="Public-safe and private, kept separate">
        <p>
          Your first result is written to be safe to view, save, or share. Deeper, more personal
          interpretation stays in private spaces meant only for you and is not included in the
          public-safe result.
        </p>
      </EditorialSection>

      <EditorialSection title="Delete or clear">
        <p>
          You can clear a saved result from your device at any time. Notifications and any optional
          messages can be stopped whenever you want. For anything else, please{" "}
          <Link href="/en/contact" className="underline">contact us</Link>.
        </p>
        <p className="mt-3 text-[13px]">
          The Japanese policy at <Link href="/privacy" className="underline">/privacy</Link> governs
          in case of any difference.
        </p>
      </EditorialSection>
    </EditorialShell>
  );
}
