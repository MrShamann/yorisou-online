import type { Metadata } from "next";
import type { ReactNode } from "react";

// UX-1 visual-direction prototype. Preview-only, never indexed, never linked from
// public navigation, catalog or sitemap.
export const metadata: Metadata = {
  title: "UX-1 プロトタイプ | YORISOU",
  robots: { index: false, follow: false, nocache: true },
};

export default function Ux1PrototypeLayout({ children }: { children: ReactNode }) {
  return children;
}
